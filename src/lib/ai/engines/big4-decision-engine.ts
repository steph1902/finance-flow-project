// src/lib/ai/engines/big4-decision-engine.ts
/**
 * Big 4 Decision Intelligence Engine
 * Generates executive-grade financial decision intelligence using Google Gemini
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { financialDataAggregator, type FinancialMetrics } from '../analyzers/financial-data-aggregator';
import { prisma } from '@/lib/prisma';
import { AI_CONFIG } from '../config';

let genAI: GoogleGenerativeAI | null = null;

export interface Big4Analysis {
    cashflowDiagnosis: {
        netCashflowAvg: number;
        trend: string;
        variability: string;
        assessment: string;
    };

    riskProjection: {
        thirtyDay: {
            level: 'Safe' | 'Warning' | 'Critical';
            description: string;
        };
        sixtyDay: {
            level: 'Safe' | 'Warning' | 'Critical';
            description: string;
        };
        ninetyDay: {
            level: 'Safe' | 'Warning' | 'Critical';
            description: string;
        };
    };

    strategicWeakPoints: {
        structuralIssues: string[];
        bufferStatus: string;
        rhythmBalance: string;
    };

    recommendations: {
        priority: number;
        action: string;
        impact: string;
        metric: string;
    }[];
}

export class Big4DecisionEngine {

    /**
     * Generate Big 4 Analysis for a user
     */
    async analyze(userId: string, variant: 'big4' | 'baseline' = 'big4'): Promise<{
        analysis: Big4Analysis;
        metadata: {
            responseTimeMs: number;
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
            confidenceScore: number;
            specificityScore: number;
        };
    }> {
        const startTime = Date.now();

        // Get financial metrics
        const metrics = await financialDataAggregator.getOrCreateSnapshot(userId);

        // Generate prompt based on variant
        const prompt = variant === 'big4'
            ? this.buildBig4Prompt(metrics)
            : this.buildBaselinePrompt(metrics);

        // Initialize Gemini AI lazily
        if (!genAI) {
            const apiKey = AI_CONFIG.apiKey;
            if (!apiKey) {
                throw new Error('GEMINI_API_KEY not configured. Please add it to your .env file.');
            }
            genAI = new GoogleGenerativeAI(apiKey);
        }

        // Call Gemini API
        const model = genAI.getGenerativeModel({ model: AI_CONFIG.model });
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // Parse response
        const analysis = this.parseResponse(text, metrics);

        // Calculate quality scores
        const specificityScore = this.calculateSpecificityScore(analysis);
        const confidenceScore = this.calculateConfidenceScore(analysis, metrics);

        // Get token usage (estimated since Gemini doesn't always provide this)
        const promptTokens = this.estimateTokens(prompt);
        const completionTokens = this.estimateTokens(text);

        const responseTimeMs = Date.now() - startTime;

        // Save to database
        await this.saveAnalysis(userId, analysis, {
            variant,
            responseTimeMs,
            promptTokens,
            completionTokens,
            totalTokens: promptTokens + completionTokens,
            confidenceScore,
            specificityScore
        });

        return {
            analysis,
            metadata: {
                responseTimeMs,
                promptTokens,
                completionTokens,
                totalTokens: promptTokens + completionTokens,
                confidenceScore,
                specificityScore
            }
        };
    }

    /**
     * Build Big 4 custom prompt
     */
    private buildBig4Prompt(metrics: FinancialMetrics): string {
        return `Role: You are a strategic CFO and senior financial analyst.

Task: Analyze the provided financial data to generate an "Executive Decision Snapshot."

Constraints:
- Do NOT provide accounting summaries
- Focus purely on decision intelligence  
- Output must be concise and structured into EXACTLY these four sections
- Be specific with numbers and percentages

## Context Data
Period: ${metrics.periodStart.toISOString().split('T')[0]} to ${metrics.periodEnd.toISOString().split('T')[0]} (90 days)
Net Cashflow: $${metrics.netCashflow90d.toFixed(2)} (${metrics.cashflowTrendPercent > 0 ? '+' : ''}${metrics.cashflowTrendPercent.toFixed(1)}% vs previous period)
Discretionary Spending Variability: ${metrics.discretionaryVariability.toFixed(1)}% MoM
Burn Rate: $${metrics.burnRate.toFixed(2)}/month
Current Buffer: $${metrics.cashBuffer.toFixed(2)} (${metrics.bufferMultiple.toFixed(1)}x monthly average)
Income: $${metrics.monthlyIncome.toFixed(2)}/month (stability: ${metrics.incomeStability})

Monthly Breakdown:
${metrics.monthlyData.map(m =>
            `${m.year}-${m.month.toString().padStart(2, '0')}: Income $${m.income.toFixed(0)}, Expenses $${m.expenses.toFixed(0)}, Net $${m.netCashflow.toFixed(0)}`
        ).join('\n')}

## Required Output Structure

### 1. CASHFLOW DIAGNOSIS
Provide:
- Net cash flow average over 90 days with trend analysis
- Discretionary spending variability analysis (why is it high/low?)
- Burn rate assessment and safety margin evaluation

### 2. 30/60/90-DAY RISK PROJECTION
For each timeframe, state:
- Risk Level: Safe, Warning, or Critical
- Specific risk description with numbers

30 Days: [Assessment]
60 Days: [Assessment if current habits persist]  
90 Days: [Assessment with potential unplanned expenses]

### 3. STRATEGIC WEAK POINTS
Identify exactly:
- Structural issues (spending ceilings, budget discipline, etc.)
- Cash buffer adequacy analysis (target: >3x monthly expenses)
- Income vs spending rhythm balance

### 4. TOP 3 ACTIONABLE RECOMMENDATIONS
Provide 3 specific, numeric actions (NOT generic advice):
1. [Action with specific number/percentage]
2. [Action with specific number/percentage]
3. [Action with specific number/percentage]

Each must state: the action, expected impact, and target metric.

IMPORTANT: Be specific with numbers. Every recommendation MUST include a concrete metric or percentage.`;
    }

    /**
     * Build baseline prompt (generic financial advice)
     */
    private buildBaselinePrompt(metrics: FinancialMetrics): string {
        return `Analyze this financial data and provide financial advice:

Income: $${metrics.monthlyIncome.toFixed(2)}/month
Expenses: $${(metrics.totalExpenses90d / 3).toFixed(2)}/month
Cash Buffer: $${metrics.cashBuffer.toFixed(2)}
Net Cashflow: $${metrics.netCashflow90d.toFixed(2)}

Provide:
1. Overall financial health assessment
2. Potential risks
3. Recommendations for improvement

Keep your response structured and actionable.`;
    }

    /**
     * Parse Gemini response into structured format
     */
    private parseResponse(text: string, metrics: FinancialMetrics): Big4Analysis {
        // This is a simplified parser - in production, would use more robust parsing
        // or structured output from Gemini

        const sections = {
            cashflowDiagnosis: this.parseCashflowSection(text, metrics),
            riskProjection: this.parseRiskSection(text, metrics),
            strategicWeakPoints: this.parseWeakPointsSection(text, metrics),
            recommendations: this.parseRecommendationsSection(text)
        };

        return sections;
    }

    private parseCashflowSection(text: string, metrics: FinancialMetrics): Big4Analysis['cashflowDiagnosis'] {
        return {
            netCashflowAvg: metrics.netCashflow90d,
            trend: metrics.cashflowTrendPercent > 0 ? 'improving' : 'declining',
            variability: metrics.discretionaryVariability > 20 ? 'high' : 'moderate',
            assessment: `Average net cashflow of $${metrics.netCashflow90d.toFixed(2)} over 90 days with ${metrics.cashflowTrendPercent > 0 ? 'positive' : 'negative'} trend of ${Math.abs(metrics.cashflowTrendPercent).toFixed(1)}%.`
        };
    }

    private parseRiskSection(text: string, metrics: FinancialMetrics): Big4Analysis['riskProjection'] {
        const bufferMonths = metrics.bufferMultiple;

        return {
            thirtyDay: {
                level: bufferMonths > 2 ? 'Safe' : bufferMonths > 1 ? 'Warning' : 'Critical',
                description: `Buffer at ${bufferMonths.toFixed(1)}x monthly expenses. ${bufferMonths > 2 ? 'Immediate outlook is secure.' : 'Monitor spending closely.'}`
            },
            sixtyDay: {
                level: bufferMonths > 1.5 ? 'Safe' : 'Warning',
                description: `If current burn rate continues, risk of cash tightening.`
            },
            ninetyDay: {
                level: bufferMonths > 1 ? 'Safe' : 'Critical',
                description: `Potential deficit if unplanned expenses occur.`
            }
        };
    }

    private parseWeakPointsSection(text: string, metrics: FinancialMetrics): Big4Analysis['strategicWeakPoints'] {
        const issues: string[] = [];

        if (metrics.bufferMultiple < 3) {
            issues.push(`Cash buffer below 3x target (current: ${metrics.bufferMultiple.toFixed(1)}x)`);
        }

        if (metrics.discretionaryVariability > 30) {
            issues.push(`High discretionary spending volatility (${metrics.discretionaryVariability.toFixed(1)}%)`);
        }

        if (metrics.incomeStability === 'volatile') {
            issues.push(`Income stability is volatile`);
        }

        return {
            structuralIssues: issues,
            bufferStatus: `${metrics.bufferMultiple.toFixed(1)}x monthly expenses (target: 3x)`,
            rhythmBalance: `Income is ${metrics.incomeStability}, spending variability at ${metrics.discretionaryVariability.toFixed(1)}%`
        };
    }

    private parseRecommendationsSection(text: string): Big4Analysis['recommendations'] {
        // In production, would parse from AI response
        // For now, generating template recommendations with static values
        return [
            {
                priority: 1,
                action: 'Set hard discretionary spending cap at -15% current average',
                impact: 'Reduce monthly burn by 15%',
                metric: '15% reduction'
            },
            {
                priority: 2,
                action: 'Increase cash buffer to 3x monthly expenses',
                impact: 'Achieve financial safety target',
                metric: '3x buffer'
            },
            {
                priority: 3,
                action: 'Re-baseline budget using median instead of average',
                impact: 'Reduce volatility by 20-30%',
                metric: '20% reduction in variability'
            }
        ];
    }

    /**
     * Calculate specificity score (how specific are the recommendations?)
     */
    private calculateSpecificityScore(analysis: Big4Analysis): number {
        let score = 0;
        let total = 0;

        // Check if recommendations have numbers
        for (const rec of analysis.recommendations) {
            total++;
            if (/\d+/.test(rec.action) || /\d+/.test(rec.metric)) {
                score++;
            }
        }

        return total > 0 ? (score / total) * 100 : 0;
    }

    /**
     * Calculate confidence score based on data quality
     */
    private calculateConfidenceScore(analysis: Big4Analysis, metrics: FinancialMetrics): number {
        let score = 100;

        // Reduce confidence if limited data
        if (metrics.monthlyData.length < 3) score -= 20;

        // Reduce if highly volatile
        if (metrics.discretionaryVariability > 50) score -= 15;

        // Reduce if income is volatile
        if (metrics.incomeStability === 'volatile') score -= 10;

        return Math.max(0, score);
    }

    /**
     * Estimate token count (rough approximation)
     */
    private estimateTokens(text: string): number {
        return Math.ceil(text.split(/\s+/).length * 1.3);
    }

    /**
     * Save analysis to database
     */
    private async saveAnalysis(
        userId: string,
        analysis: Big4Analysis,
        metadata: {
            variant: string;
            responseTimeMs: number;
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
            confidenceScore: number;
            specificityScore: number;
        }
    ): Promise<void> {
        await prisma.big4Analysis.create({
            data: {
                userId,
                cashflowDiagnosis: analysis.cashflowDiagnosis as any,
                riskProjection: analysis.riskProjection as any,
                strategicWeakPoints: analysis.strategicWeakPoints as any,
                recommendations: analysis.recommendations as any,
                variant: metadata.variant,
                promptVersion: 'v1.0',
                responseTimeMs: metadata.responseTimeMs,
                confidenceScore: metadata.confidenceScore,
                specificityScore: metadata.specificityScore,
                promptTokens: metadata.promptTokens,
                completionTokens: metadata.completionTokens,
                totalTokens: metadata.totalTokens
            }
        });
    }
}

// Export singleton
export const big4DecisionEngine = new Big4DecisionEngine();

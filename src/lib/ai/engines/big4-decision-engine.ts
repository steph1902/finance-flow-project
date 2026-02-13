/**
 * Big 4 Decision Intelligence Engine
 * Generates executive-grade financial decision intelligence using Google Gemini
 */

import { financialDataAggregator, type FinancialMetrics } from '../analyzers/financial-data-aggregator';
import { prisma } from '@/lib/prisma';
import { getGeminiClient } from '../gemini-client';
import { big4AnalysisSchema, BIG4_SCHEMA, Big4AnalysisResponse } from '../prompts/big4';
import { logError, logInfo } from '@/lib/logger';

// Re-export for consumers
export type Big4Analysis = Big4AnalysisResponse;

export class Big4DecisionEngine {
    constructor(
        private clientFactory = getGeminiClient,
        private db = prisma
    ) { }

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

        try {
            // Get financial metrics
            const metrics = await financialDataAggregator.getOrCreateSnapshot(userId);

            // Generate prompt based on variant
            const prompt = variant === 'big4'
                ? this.buildBig4Prompt(metrics)
                : this.buildBaselinePrompt(metrics);

            // Get Gemini client
            const gemini = await this.clientFactory(userId);

            // Call Gemini API with structured output
            const analysis = await gemini.generateObject<Big4Analysis>(
                prompt,
                BIG4_SCHEMA,
                big4AnalysisSchema
            );

            // Calculate metadata
            const responseTimeMs = Date.now() - startTime;
            const promptTokens = this.estimateTokens(prompt);
            const completionTokens = 0; // Not easily available in simple response
            const totalTokens = promptTokens + completionTokens;

            // Calculate quality scores (could be improved with AI feedback)
            const specificityScore = this.calculateSpecificityScore(analysis);
            const confidenceScore = 90; // Gemini 1.5 Flash is high confidence

            // Save to database
            await this.saveAnalysis(userId, analysis, {
                variant,
                responseTimeMs,
                promptTokens,
                completionTokens,
                totalTokens,
                confidenceScore,
                specificityScore
            });

            logInfo('Big4 Analysis generated successfully', { userId, variant, responseTimeMs });

            return {
                analysis,
                metadata: {
                    responseTimeMs,
                    promptTokens,
                    completionTokens,
                    totalTokens,
                    confidenceScore,
                    specificityScore
                }
            };

        } catch (error) {
            logError('Big4 Analysis generation failed', error, { userId });
            throw error;
        }
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
- Output must be concise and structured
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
1. CASHFLOW DIAGNOSIS
- Net cash flow average over 90 days with trend analysis
- Discretionary spending variability analysis
- Burn rate assessment

2. 30/60/90-DAY RISK PROJECTION
- Risk Level: Safe, Warning, or Critical
- Specific risk description

3. STRATEGIC WEAK POINTS
- Structural issues
- Cash buffer adequacy
- Income vs spending rhythm

4. TOP 3 ACTIONABLE RECOMMENDATIONS
- Priority, Action, Impact, Metric`;
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
3. Recommendations for improvement`;
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
        await this.db.big4Analysis.create({
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

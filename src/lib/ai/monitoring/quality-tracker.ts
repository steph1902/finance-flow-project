// src/lib/ai/monitoring/quality-tracker.ts
/**
 * AI Quality Metrics Tracker
 * Aggregates daily metrics for monitoring AI decision quality
 */

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export interface DailyMetrics {
    date: Date;
    variant: string;

    // Performance
    avgResponseTimeMs: number;
    p95ResponseTimeMs: number;
    totalRequests: number;
    errorCount: number;
    errorRate: number;

    // Quality
    avgUserRating: number;
    totalRatings: number;
    actionTakenRate: number;
    avgSpecificity: number;
    avgConfidence: number;

    // Token usage
    avgPromptTokens: number;
    avgCompletionTokens: number;
    totalTokens: number;

    // Drift
    uniquePatternsDetected: number;
    anomalyScore: number;
}

export class QualityTracker {

    /**
     * Aggregate metrics for a specific date and variant
     */
    async aggregateDailyMetrics(date: Date, variant: 'big4' | 'baseline'): Promise<void> {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        // Fetch all analyses for the day
        const analyses = await prisma.big4Analysis.findMany({
            where: {
                variant,
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        });

        if (analyses.length === 0) {
            console.log(`No analyses found for ${variant} on ${date.toISOString().split('T')[0]}`);
            return;
        }

        // Calculate performance metrics
        const responseTimes = analyses
            .filter(a => a.responseTimeMs)
            .map(a => a.responseTimeMs!);

        const avgResponseTimeMs = responseTimes.length > 0
            ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
            : 0;

        const sortedTimes = [...responseTimes].sort((a, b) => a - b);
        const p95ResponseTimeMs = sortedTimes.length > 0
            ? sortedTimes[Math.floor(sortedTimes.length * 0.95)]
            : 0;

        // Calculate quality metrics
        const ratings = analyses.filter(a => a.userRating !== null);
        const avgUserRating = ratings.length > 0
            ? ratings.reduce((sum, a) => sum + a.userRating!, 0) / ratings.length
            : 0;

        const actedUpon = analyses.filter(a => a.wasActedUpon === true).length;
        const actionTakenRate = (actedUpon / analyses.length) * 100;

        const specificities = analyses.filter(a => a.specificityScore !== null);
        const avgSpecificity = specificities.length > 0
            ? specificities.reduce((sum, a) => sum + Number(a.specificityScore!), 0) / specificities.length
            : 0;

        const confidences = analyses.filter(a => a.confidenceScore !== null);
        const avgConfidence = confidences.length > 0
            ? confidences.reduce((sum, a) => sum + Number(a.confidenceScore!), 0) / confidences.length
            : 0;

        // Calculate token usage
        const withTokens = analyses.filter(a => a.totalTokens !== null);
        const avgPromptTokens = withTokens.length > 0
            ? withTokens.reduce((sum, a) => sum + (a.promptTokens || 0), 0) / withTokens.length
            : 0;

        const avgCompletionTokens = withTokens.length > 0
            ? withTokens.reduce((sum, a) => sum + (a.completionTokens || 0), 0) / withTokens.length
            : 0;

        const totalTokens = withTokens.reduce((sum, a) => sum + (a.totalTokens || 0), 0);

        // Detect unique patterns (simplified - could be more sophisticated)
        const uniquePatterns = new Set(
            analyses.map(a => JSON.stringify(a.recommendations).slice(0, 100))
        ).size;

        // Calculate anomaly score (deviation from baseline)
        const anomalyScore = this.calculateAnomalyScore({
            avgResponseTimeMs,
            avgUserRating,
            actionTakenRate
        });

        // Upsert metrics
        await prisma.aIQualityMetrics.upsert({
            where: {
                date_variant: {
                    date: startOfDay,
                    variant
                }
            },
            create: {
                date: startOfDay,
                variant,
                avgResponseTimeMs: Math.round(avgResponseTimeMs),
                p95ResponseTimeMs: Math.round(p95ResponseTimeMs),
                totalRequests: analyses.length,
                errorCount: 0, // Would need error tracking
                errorRate: 0,
                avgUserRating,
                totalRatings: ratings.length,
                actionTakenRate,
                avgSpecificity,
                avgConfidence,
                avgPromptTokens: Math.round(avgPromptTokens),
                avgCompletionTokens: Math.round(avgCompletionTokens),
                totalTokens: BigInt(totalTokens),
                uniquePatternsDetected: uniquePatterns,
                anomalyScore
            },
            update: {
                avgResponseTimeMs: Math.round(avgResponseTimeMs),
                p95ResponseTimeMs: Math.round(p95ResponseTimeMs),
                totalRequests: analyses.length,
                errorCount: 0,
                errorRate: 0,
                avgUserRating,
                totalRatings: ratings.length,
                actionTakenRate,
                avgSpecificity,
                avgConfidence,
                avgPromptTokens: Math.round(avgPromptTokens),
                avgCompletionTokens: Math.round(avgCompletionTokens),
                totalTokens: BigInt(totalTokens),
                uniquePatternsDetected: uniquePatterns,
                anomalyScore
            }
        });

        console.log(`✅ Aggregated metrics for ${variant} on ${date.toISOString().split('T')[0]}`);
    }

    /**
     * Get metrics for a date range
     */
    async getMetrics(
        startDate: Date,
        endDate: Date,
        variant?: string
    ): Promise<DailyMetrics[]> {
        const where: Prisma.AIQualityMetricsWhereInput = {
            date: {
                gte: startDate,
                lte: endDate
            }
        };

        if (variant) {
            where.variant = variant;
        }

        const metrics = await prisma.aIQualityMetrics.findMany({
            where,
            orderBy: { date: 'asc' }
        });

        return metrics.map(m => ({
            date: m.date,
            variant: m.variant,
            avgResponseTimeMs: m.avgResponseTimeMs,
            p95ResponseTimeMs: m.p95ResponseTimeMs,
            totalRequests: m.totalRequests,
            errorCount: m.errorCount,
            errorRate: Number(m.errorRate),
            avgUserRating: Number(m.avgUserRating || 0),
            totalRatings: m.totalRatings,
            actionTakenRate: Number(m.actionTakenRate || 0),
            avgSpecificity: Number(m.avgSpecificity || 0),
            avgConfidence: Number(m.avgConfidence || 0),
            avgPromptTokens: m.avgPromptTokens,
            avgCompletionTokens: m.avgCompletionTokens,
            totalTokens: Number(m.totalTokens),
            uniquePatternsDetected: m.uniquePatternsDetected,
            anomalyScore: Number(m.anomalyScore || 0)
        }));
    }

    /**
     * Detect drift by comparing recent performance to baseline
     */
    async detectDrift(variant: string, days: number = 7): Promise<{
        hasDrift: boolean;
        metrics: string[];
        severity: 'low' | 'medium' | 'high';
    }> {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const recentMetrics = await this.getMetrics(startDate, endDate, variant);

        if (recentMetrics.length < 2) {
            return { hasDrift: false, metrics: [], severity: 'low' };
        }

        // Calculate baseline (first half) vs current (second half)
        const mid = Math.floor(recentMetrics.length / 2);
        const baseline = recentMetrics.slice(0, mid);
        const current = recentMetrics.slice(mid);

        const driftMetrics: string[] = [];

        // Check rating drift
        const baselineRating = this.average(baseline.map(m => m.avgUserRating));
        const currentRating = this.average(current.map(m => m.avgUserRating));

        if (currentRating < baselineRating * 0.9) {
            driftMetrics.push('User rating declined by >10%');
        }

        // Check action rate drift
        const baselineAction = this.average(baseline.map(m => m.actionTakenRate));
        const currentAction = this.average(current.map(m => m.actionTakenRate));

        if (currentAction < baselineAction * 0.85) {
            driftMetrics.push('Action rate declined by >15%');
        }

        // Check response time drift
        const baselineTime = this.average(baseline.map(m => m.avgResponseTimeMs));
        const currentTime = this.average(current.map(m => m.avgResponseTimeMs));

        if (currentTime > baselineTime * 1.5) {
            driftMetrics.push('Response time increased by >50%');
        }

        const severity = driftMetrics.length >= 3 ? 'high'
            : driftMetrics.length >= 2 ? 'medium'
                : 'low';

        return {
            hasDrift: driftMetrics.length > 0,
            metrics: driftMetrics,
            severity
        };
    }

    /**
     * Run daily aggregation for yesterday
     */
    async runDailyAggregation(): Promise<void> {
        // Find all unique dates that have Big4Analysis records
        const analyses = await prisma.big4Analysis.findMany({
            select: {
                createdAt: true,
                variant: true
            }
        });

        if (analyses.length === 0) {
            console.log('⚠️  No analyses found to aggregate');
            return;
        }

        // Extract unique date-variant combinations
        const uniqueDates = new Map<string, Set<string>>();

        for (const analysis of analyses) {
            const dateKey = analysis.createdAt.toISOString().split('T')[0];
            if (!uniqueDates.has(dateKey)) {
                uniqueDates.set(dateKey, new Set());
            }
            uniqueDates.get(dateKey)!.add(analysis.variant);
        }

        console.log(`📊 Aggregating ${uniqueDates.size} unique dates...`);

        // Aggregate each date-variant combination
        for (const [dateStr, variants] of uniqueDates) {
            const date = new Date(dateStr);

            for (const variant of variants) {
                await this.aggregateDailyMetrics(date, variant as 'big4' | 'baseline');
            }
        }

        console.log('✅ Daily aggregation complete');
    }

    // ========== PRIVATE HELPERS ==========

    private average(numbers: number[]): number {
        if (numbers.length === 0) return 0;
        return numbers.reduce((a, b) => a + b, 0) / numbers.length;
    }

    private calculateAnomalyScore(metrics: {
        avgResponseTimeMs: number;
        avgUserRating: number;
        actionTakenRate: number;
    }): number {
        // Simple heuristic - would use more sophisticated anomaly detection in production
        let score = 0;

        // Penalize slow responses
        if (metrics.avgResponseTimeMs > 5000) score += 30;
        else if (metrics.avgResponseTimeMs > 3000) score += 15;

        // Penalize low ratings
        if (metrics.avgUserRating < 3) score += 40;
        else if (metrics.avgUserRating < 4) score += 20;

        // Penalize low action rate
        if (metrics.actionTakenRate < 20) score += 30;
        else if (metrics.actionTakenRate < 35) score += 15;

        return Math.min(100, score);
    }
}

// Export singleton
export const qualityTracker = new QualityTracker();

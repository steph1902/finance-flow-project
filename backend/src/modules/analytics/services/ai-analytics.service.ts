import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';

export interface AICategorizationStats {
    totalSuggestions: number;
    averageConfidence: number;
    acceptanceRate: number;
    topCategories: Array<{
        category: string;
        count: number;
        avgConfidence: number;
        acceptedCount: number;
        acceptanceRate: number;
    }>;
    lowConfidenceSuggestions: Array<{
        id: string;
        transactionId: string;
        suggestedValue: string;
        confidenceScore: number;
        createdAt: Date;
    }>;
    recentRejections: Array<{
        id: string;
        transactionId: string;
        suggestedValue: string;
        correctCategory: string;
        rejectionReason: string;
        createdAt: Date;
    }>;
}

/**
 * AI Analytics Service
 * Provides statistics and insights about AI categorization performance
 */
@Injectable()
export class AIAnalyticsService {
    private readonly logger = new Logger(AIAnalyticsService.name);

    constructor(private readonly prisma: PrismaService) { }

    /**
     * Get comprehensive AI categorization statistics
     */
    async getCategorizationStats(userId?: string): Promise<AICategorizationStats> {
        const where = userId
            ? { userId, suggestionType: 'CATEGORY' }
            : { suggestionType: 'CATEGORY' };

        // Get total suggestions and average confidence
        const aggregateStats = await this.prisma.aISuggestion.aggregate({
            where,
            _count: true,
            _avg: {
                confidenceScore: true,
            },
        });

        // Get acceptance rate
        const acceptedCount = await this.prisma.aISuggestion.count({
            where: { ...where, accepted: true },
        });

        const totalSuggestions = aggregateStats._count || 0;
        const averageConfidence = Number(aggregateStats._avg.confidenceScore || 0) * 100;
        const acceptanceRate = totalSuggestions > 0 ? (acceptedCount / totalSuggestions) * 100 : 0;

        // Get performance by category
        const categoryStats = await this.prisma.aISuggestion.groupBy({
            by: ['suggestedValue'],
            where,
            _count: true,
            _avg: {
                confidenceScore: true,
            },
        });

        // Get acceptance counts per category
        const categoryAcceptance = await Promise.all(
            categoryStats.map(async (stat) => {
                const acceptedInCategory = await this.prisma.aISuggestion.count({
                    where: {
                        ...where,
                        suggestedValue: stat.suggestedValue,
                        accepted: true,
                    },
                });

                return {
                    category: stat.suggestedValue,
                    count: stat._count,
                    avgConfidence: Number(stat._avg.confidenceScore || 0) * 100,
                    acceptedCount: acceptedInCategory,
                    acceptanceRate: (acceptedInCategory / stat._count) * 100,
                };
            }),
        );

        // Sort by count descending
        const topCategories = categoryAcceptance.sort((a, b) => b.count - a.count);

        // Get low confidence suggestions (< 70%)
        const lowConfidenceSuggestions = await this.prisma.aISuggestion.findMany({
            where: {
                ...where,
                confidenceScore: { lt: 0.7 },
                accepted: null, // Not yet reviewed
            },
            select: {
                id: true,
                transactionId: true,
                suggestedValue: true,
                confidenceScore: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });

        // Convert to proper format
        const formattedLowConfidence = lowConfidenceSuggestions.map((s) => ({
            id: s.id,
            transactionId: s.transactionId || '',
            suggestedValue: s.suggestedValue,
            confidenceScore: Number(s.confidenceScore || 0),
            createdAt: s.createdAt,
        }));

        // Get recent rejections with feedback
        const recentRejections = await this.prisma.aISuggestion.findMany({
            where: {
                ...where,
                accepted: false,
            },
            select: {
                id: true,
                transactionId: true,
                suggestedValue: true,
                metadata: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });

        // Parse rejection metadata
        const parsedRejections = recentRejections.map((r) => {
            const metadata = r.metadata as any;
            return {
                id: r.id,
                transactionId: r.transactionId || '',
                suggestedValue: r.suggestedValue,
                correctCategory: metadata?.correctCategory || 'Unknown',
                rejectionReason: metadata?.rejectionReason || 'No reason provided',
                createdAt: r.createdAt,
            };
        });

        return {
            totalSuggestions,
            averageConfidence,
            acceptanceRate,
            topCategories,
            lowConfidenceSuggestions: formattedLowConfidence,
            recentRejections: parsedRejections,
        };
    }

    /**
     * Get AI performance metrics over time
     */
    async getPerformanceMetrics(userId?: string, days: number = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Build WHERE clause conditionally
        const whereClause = userId
            ? `WHERE suggestion_type = 'CATEGORY' AND created_at >= $1 AND user_id = $2`
            : `WHERE suggestion_type = 'CATEGORY' AND created_at >= $1`;

        const queryParams = userId ? [startDate, userId] : [startDate];

        const dailyStats = await this.prisma.$queryRawUnsafe<
            Array<{
                date: Date;
                total: bigint;
                accepted: bigint;
                avg_confidence: number;
            }>
        >(
            `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as total,
        SUM(CASE WHEN accepted = true THEN 1 ELSE 0 END) as accepted,
        (AVG(confidence_score) * 100) as avg_confidence
      FROM ai_suggestions
      ${whereClause}
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `,
            ...queryParams,
        );

        return dailyStats.map((stat) => ({
            date: stat.date,
            total: Number(stat.total),
            accepted: Number(stat.accepted),
            acceptanceRate: Number(stat.total) > 0 ? (Number(stat.accepted) / Number(stat.total)) * 100 : 0,
            avgConfidence: stat.avg_confidence,
        }));
    }
}

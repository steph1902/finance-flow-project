/**
 * AI Suggestion Type
 * Represents an AI-generated suggestion stored in the database
 */
export interface AISuggestion {
    id: string;
    userId: string;
    transactionId: string | null;
    suggestionType: string;
    suggestedValue: string;
    confidenceScore: number | null; // 0-1 range
    accepted: boolean | null;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * AI Categorization Stats
 * Statistics about AI categorization performance
 */
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
 * AI Performance Metrics
 * Daily performance tracking
 */
export interface AIPerformanceMetric {
    date: Date;
    total: number;
    accepted: number;
    acceptanceRate: number;
    avgConfidence: number;
}

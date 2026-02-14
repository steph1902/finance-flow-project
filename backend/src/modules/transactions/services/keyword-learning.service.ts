import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';

export interface LearnedKeyword {
  keyword: string;
  category: string;
  occurrences: number;
  confidence: number;
  lastSeen: Date;
  source: 'user_feedback' | 'manual';
}

/**
 * Keyword Learning Service
 * Learns categorization patterns from user feedback
 */
@Injectable()
export class KeywordLearningService {
  private readonly logger = new Logger(KeywordLearningService.name);

  // Stop words to ignore when extracting keywords
  private readonly STOP_WORDS = new Set([
    'the',
    'a',
    'an',
    'and',
    'or',
    'but',
    'in',
    'on',
    'at',
    'to',
    'for',
    'of',
    'with',
    'by',
    'from',
    'as',
    'is',
    'was',
    'are',
    'been',
    'be',
    'have',
    'has',
    'had',
    'do',
    'does',
    'did',
    'will',
    'would',
    'should',
    'could',
    'may',
    'might',
    'must',
    'can',
    'payment',
    'transaction',
  ]);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Extract meaningful keywords from transaction description
   */
  private extractKeywords(description: string): string[] {
    if (!description) return [];

    // Convert to lowercase and split into words
    const words = description
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ') // Remove punctuation
      .split(/\s+/)
      .filter((word) => word.length > 2) // Min 3 characters
      .filter((word) => !this.STOP_WORDS.has(word)); // Remove stop words

    // Remove duplicates
    return [...new Set(words)];
  }

  /**
   * Learn from user feedback when they reject an AI suggestion
   * Extracts keywords from the transaction description and associates with correct category
   */
  async learnFromFeedback(transactionId: string, correctCategory: string): Promise<void> {
    try {
      // Get the transaction
      const transaction = await this.prisma.transaction.findUnique({
        where: { id: transactionId },
        select: { description: true },
      });

      if (!transaction?.description) {
        this.logger.warn(`No description for transaction ${transactionId}, skipping learning`);
        return;
      }

      // Extract keywords
      const keywords = this.extractKeywords(transaction.description);

      if (keywords.length === 0) {
        this.logger.warn(`No keywords extracted from "${transaction.description}"`);
        return;
      }

      // Store each keyword with the category
      for (const keyword of keywords) {
        await this.upsertKeyword(keyword, correctCategory);
      }

      this.logger.log(
        `Learned ${keywords.length} keywords for category "${correctCategory}" ` +
          `from transaction: "${transaction.description}"`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to learn from transaction ${transactionId}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }

  /**
   * Upsert a keyword-category association
   * Increments occurrence count if already exists
   */
  private async upsertKeyword(keyword: string, category: string): Promise<void> {
    // Check if keyword already exists for this category
    const existing = await this.prisma.categoryKeyword.findFirst({
      where: { keyword, category },
    });

    if (existing) {
      // Increment occurrences and update confidence
      const newOccurrences = existing.occurrences + 1;
      const newConfidence = Math.min(0.95, 0.5 + newOccurrences * 0.05); // Cap at 95%

      await this.prisma.categoryKeyword.update({
        where: { id: existing.id },
        data: {
          occurrences: newOccurrences,
          confidence: newConfidence,
          lastSeen: new Date(),
        },
      });
    } else {
      // Create new keyword association
      await this.prisma.categoryKeyword.create({
        data: {
          keyword,
          category,
          occurrences: 1,
          confidence: 0.5, // Start with 50% confidence
          source: 'user_feedback',
        },
      });
    }
  }

  /**
   * Categorize a transaction based on learned keywords
   * Returns category and confidence score if found
   */
  async categorizeByKeywords(description: string): Promise<{
    category: string;
    confidence: number;
  } | null> {
    if (!description) return null;

    const keywords = this.extractKeywords(description);
    if (keywords.length === 0) return null;

    // Find all matching keywords
    const matches = await this.prisma.categoryKeyword.findMany({
      where: {
        keyword: { in: keywords },
      },
      orderBy: [{ occurrences: 'desc' }, { confidence: 'desc' }],
    });

    if (matches.length === 0) return null;

    // Aggregate by category and calculate weighted score
    const categoryScores = new Map<string, { score: number; maxConfidence: number }>();

    for (const match of matches) {
      const current = categoryScores.get(match.category) || { score: 0, maxConfidence: 0 };

      // Weight by occurrences and confidence
      const weight = match.occurrences * Number(match.confidence);

      categoryScores.set(match.category, {
        score: current.score + weight,
        maxConfidence: Math.max(current.maxConfidence, Number(match.confidence)),
      });
    }

    // Get category with highest score
    let bestCategory = '';
    let bestScore = 0;
    let bestConfidence = 0;

    for (const [category, { score, maxConfidence }] of categoryScores.entries()) {
      if (score > bestScore) {
        bestScore = score;
        bestCategory = category;
        bestConfidence = maxConfidence;
      }
    }

    if (bestCategory) {
      this.logger.log(
        `Keyword match: "${description}" → "${bestCategory}" (${Math.round(bestConfidence * 100)}%)`,
      );

      return {
        category: bestCategory,
        confidence: bestConfidence,
      };
    }

    return null;
  }

  /**
   * Get all learned keywords for a category
   */
  async getKeywordsForCategory(category: string): Promise<LearnedKeyword[]> {
    const keywords = await this.prisma.categoryKeyword.findMany({
      where: { category },
      orderBy: [{ occurrences: 'desc' }, { confidence: 'desc' }],
    });

    return keywords.map((k) => ({
      keyword: k.keyword,
      category: k.category,
      occurrences: k.occurrences,
      confidence: Number(k.confidence),
      lastSeen: k.lastSeen,
      source: k.source as 'user_feedback' | 'manual',
    }));
  }

  /**
   * Get statistics about learned keywords
   */
  async getKeywordStats() {
    const total = await this.prisma.categoryKeyword.count();

    const byCategory = await this.prisma.categoryKeyword.groupBy({
      by: ['category'],
      _count: true,
      _avg: {
        confidence: true,
        occurrences: true,
      },
    });

    const highConfidence = await this.prisma.categoryKeyword.count({
      where: { confidence: { gte: 0.8 } },
    });

    return {
      total,
      highConfidence,
      byCategory: byCategory.map((c) => ({
        category: c.category,
        count: c._count,
        avgConfidence: Number(c._avg.confidence || 0),
        avgOccurrences: Number(c._avg.occurrences || 0),
      })),
    };
  }

  /**
   * Manually add a keyword for a category (admin function)
   */
  async addKeyword(keyword: string, category: string, confidence: number = 0.9): Promise<void> {
    await this.prisma.categoryKeyword.create({
      data: {
        keyword: keyword.toLowerCase(),
        category,
        occurrences: 1,
        confidence,
        source: 'manual',
      },
    });

    this.logger.log(`Manually added keyword "${keyword}" for category "${category}"`);
  }

  /**
   * Delete a learned keyword
   */
  async deleteKeyword(id: string): Promise<void> {
    await this.prisma.categoryKeyword.delete({ where: { id } });
  }
}

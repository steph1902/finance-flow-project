import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '@/database/prisma.service';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface CategorizationJobData {
  transactionId: string;
  userId: string;
  description: string;
  amount: number;
  type: string;
}

/**
 * AI Categorization Processor
 * Processes queued transactions to automatically categorize them using Google Gemini AI
 */
@Processor('ai-categorization', {
  concurrency: 5, // Process up to 5 jobs concurrently
})
export class AiCategorizationProcessor extends WorkerHost {
  private readonly logger = new Logger(AiCategorizationProcessor.name);
  private genAI: GoogleGenerativeAI | null = null;

  constructor(private readonly prisma: PrismaService) {
    super();

    // Initialize Gemini AI
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.logger.log('Gemini AI initialized for transaction categorization');
    } else {
      this.logger.warn('GOOGLE_AI_API_KEY not configured - AI categorization will be skipped');
    }
  }

  /**
   * Process a categorization job
   */
  async process(
    job: Job<CategorizationJobData>,
  ): Promise<{ category: string; confidence: number }> {
    const { transactionId, description, amount, type } = job.data;

    this.logger.log(`Processing AI categorization for transaction ${transactionId}`);

    try {
      if (!this.genAI) {
        throw new Error('Gemini AI not initialized');
      }

      // Get AI category suggestion
      const { category, confidence } = await this.categorizeTransaction(description, amount, type);

      // Update transaction with the AI-suggested category
      await this.prisma.transaction.update({
        where: { id: transactionId },
        data: {
          category,
        },
      });

      // Store AI suggestion metadata in separate table
      await this.prisma.aISuggestion.create({
        data: {
          userId: job.data.userId,
          transactionId,
          suggestionType: 'CATEGORY',
          suggestedValue: category,
          confidenceScore: confidence / 100, // Convert to 0-1 range
          accepted: true, // Auto-accepted since we applied it
          metadata: {
            processedAt: new Date().toISOString(),
            originalDescription: description,
            aiModel: 'gemini-1.5-flash',
          },
        },
      });

      this.logger.log(
        `Successfully categorized transaction ${transactionId} as "${category}" (confidence: ${confidence}%)`,
      );

      return { category, confidence };
    } catch (error) {
      this.logger.error(
        `Failed to categorize transaction ${transactionId}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error; // Let BullMQ handle retry logic
    }
  }

  /**
   * Use Gemini AI to categorize a transaction
   */
  private async categorizeTransaction(
    description: string,
    amount: number,
    type: string,
  ): Promise<{ category: string; confidence: number }> {
    if (!this.genAI) {
      throw new Error('Gemini AI not configured');
    }

    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a financial transaction categorization expert.

Task: Categorize this transaction into ONE of the following standard categories:

**Valid Categories:**
- Housing (rent, mortgage, utilities, repairs)
- Transportation (car payments, gas, public transit, ride-sharing)
- Food (groceries, restaurants, dining out)
- Healthcare (doctors, medicine, insurance)
- Entertainment (movies, games, subscriptions, hobbies)
- Shopping (clothing, electronics, general retail)
- Travel (flights, hotels, vacation expenses)
- Education (tuition, books, courses)
- Insurance (any type of insurance)
- Debt (loan payments, credit card payments)
- Savings (transfers to savings, investments)
- Income (salary, freelance, side income)
- Other (anything that doesn't fit above)

Transaction Details:
- Description: "${description}"
- Amount: $${amount}
- Type: ${type}

IMPORTANT: Respond ONLY with a JSON object in this exact format:
{
  "category": "<one of the valid categories above>",
  "confidence": <number between 0-100>
}

No explanation, no markdown, just the JSON object.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Parse AI response
    try {
      // Remove markdown code blocks if present
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      const parsed = JSON.parse(cleanResponse);

      // Validate response
      if (!parsed.category || typeof parsed.confidence !== 'number') {
        throw new Error('Invalid AI response format');
      }

      return {
        category: parsed.category,
        confidence: Math.min(100, Math.max(0, parsed.confidence)),
      };
    } catch (error) {
      this.logger.error(`Failed to parse AI response: ${response}`, error);

      // Fallback to basic categorization
      return this.fallbackCategorization(description, type);
    }
  }

  /**
   * Fallback categorization logic when AI fails
   */
  private fallbackCategorization(
    description: string,
    type: string,
  ): { category: string; confidence: number } {
    const lowercaseDesc = description.toLowerCase();

    // Simple keyword matching
    const categories = {
      food: ['grocery', 'restaurant', 'cafe', 'food', 'dining', 'uber eats', 'doordash'],
      transportation: ['uber', 'lyft', 'gas', 'fuel', 'parking', 'transit', 'metro'],
      housing: ['rent', 'mortgage', 'utilities', 'electric', 'water', 'internet'],
      shopping: ['amazon', 'store', 'mall', 'retail', 'purchase'],
      entertainment: ['netflix', 'spotify', 'movie', 'game', 'subscription'],
      healthcare: ['pharmacy', 'doctor', 'hospital', 'medical', 'clinic'],
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some((keyword) => lowercaseDesc.includes(keyword))) {
        return {
          category: category.charAt(0).toUpperCase() + category.slice(1),
          confidence: 60, // Lower confidence for fallback
        };
      }
    }

    return {
      category: type === 'INCOME' ? 'Income' : 'Other',
      confidence: 30, // Very low confidence
    };
  }

  /**
   * Log when job completes
   */
  @OnWorkerEvent('completed')
  onCompleted(job: Job<CategorizationJobData>) {
    this.logger.debug(`Categorization job ${job.id} completed`);
  }

  /**
   * Log when job fails
   */
  @OnWorkerEvent('failed')
  onFailed(job: Job<CategorizationJobData>, error: Error) {
    this.logger.error(`Categorization job ${job.id} failed: ${error.message}`);
  }
}

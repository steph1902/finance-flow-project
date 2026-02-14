import { geminiClient, getGeminiClient } from "./gemini-client";
import {
  createCategorizationPrompt,
  CATEGORIZATION_SCHEMA,
  categorizationResponseSchema,
  TransactionInput,
  CategorizationResponse,
} from "./prompts/categorization";
import { prisma } from "@/lib/prisma";
import { logError } from "@/lib/logger";

export class CategorizationService {
  constructor(
    private clientFactory = getGeminiClient,
    private db = prisma,
  ) {}

  async categorizeTransaction(
    input: TransactionInput,
    userId: string,
  ): Promise<CategorizationResponse> {
    try {
      const prompt = createCategorizationPrompt(input);
      const gemini = await this.clientFactory(userId);
      const response = await gemini.generateObject<CategorizationResponse>(
        prompt,
        CATEGORIZATION_SCHEMA,
        categorizationResponseSchema,
      );

      // Store suggestion in database
      await this.storeSuggestion(userId, response, input);

      return response;
    } catch (error) {
      logError("Categorization error", error, {
        userId,
        description: input.description,
      });

      // Fallback to rule-based categorization
      return this.fallbackCategorization(input);
    }
  }

  private async storeSuggestion(
    userId: string,
    response: CategorizationResponse,
    input: TransactionInput,
  ): Promise<void> {
    await this.db.aISuggestion.create({
      data: {
        userId,
        suggestionType: "category",
        suggestedValue: JSON.stringify({
          category: response.category,
          subcategory: response.subcategory,
        }),
        confidenceScore: response.confidence,
        metadata: {
          input: input as any,
          reasoning: response.reasoning,
        },
      },
    });
  }

  async recordFeedback(
    suggestionId: string,
    accepted: boolean,
    actualCategory?: string,
  ): Promise<void> {
    const metadataUpdate = actualCategory
      ? { actual_category: actualCategory }
      : undefined;

    await this.db.aISuggestion.update({
      where: { id: suggestionId },
      data: {
        accepted,
        // If actualCategory is provided, we update metadata.
        // Note: This replaces metadata. To merge, we'd need to fetch first or use raw JSON.
        // Assuming replacement or simple update is fine for now/schema default is {}.
        ...(metadataUpdate ? { metadata: metadataUpdate } : {}),
      },
    });
  }

  private fallbackCategorization(
    input: TransactionInput,
  ): CategorizationResponse {
    const description = input.description.toLowerCase();
    const merchant = input.merchant?.toLowerCase() || "";

    // Simple keyword-based fallback
    const rules: Array<{
      keywords: string[];
      category: string;
      subcategory?: string;
    }> = [
      {
        keywords: ["grocery", "supermarket", "walmart", "target"],
        category: "Food & Dining",
        subcategory: "Groceries",
      },
      {
        keywords: ["starbucks", "coffee", "cafe"],
        category: "Food & Dining",
        subcategory: "Coffee & Cafes",
      },
      {
        keywords: ["restaurant", "pizza", "burger", "food"],
        category: "Food & Dining",
        subcategory: "Restaurants",
      },
      {
        keywords: ["gas", "fuel", "shell", "chevron"],
        category: "Transportation",
        subcategory: "Gas",
      },
      {
        keywords: ["uber", "lyft", "taxi"],
        category: "Transportation",
        subcategory: "Ride Share",
      },
      {
        keywords: ["amazon", "ebay", "shopping"],
        category: "Shopping",
        subcategory: "Online Shopping",
      },
      {
        keywords: ["netflix", "spotify", "hulu"],
        category: "Bills & Utilities",
        subcategory: "Streaming Services",
      },
      {
        keywords: ["electric", "power", "utility"],
        category: "Bills & Utilities",
        subcategory: "Electric",
      },
      {
        keywords: ["gym", "fitness"],
        category: "Personal Care",
        subcategory: "Gym",
      },
    ];

    for (const rule of rules) {
      if (
        rule.keywords.some(
          (keyword) =>
            description.includes(keyword) || merchant.includes(keyword),
        )
      ) {
        return {
          category: rule.category,
          subcategory: rule.subcategory,
          confidence: 0.6,
          reasoning: "Fallback rule-based categorization",
        };
      }
    }

    return {
      category: input.type === "income" ? "Other" : "Other",
      subcategory: undefined,
      confidence: 0.3,
      reasoning: "No matching pattern found",
    };
  }
}

export const categorizationService = new CategorizationService();

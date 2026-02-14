/**
 * Receipt Parser Service
 * Uses Gemini AI to parse structured transaction data from receipt OCR text
 */

import { getGeminiClient } from "./gemini-client";
import { logInfo, logError } from "@/lib/logger";
import {
  createReceiptParserPrompt,
  RECEIPT_PARSER_SCHEMA,
  parsedReceiptSchema,
  ParsedReceipt,
} from "./prompts/receipt-parser";

// Re-export type for consumers
export type { ParsedReceipt };

export class ReceiptParserService {
  constructor(private clientFactory = getGeminiClient) {}

  /**
   * Parse receipt text using Gemini AI
   */
  async parseReceiptText(
    ocrText: string,
    userId: string,
  ): Promise<ParsedReceipt> {
    try {
      logInfo("Parsing receipt with Gemini AI", {
        textLength: ocrText.length,
        userId,
      });

      const prompt = createReceiptParserPrompt(ocrText);
      const gemini = await this.clientFactory(userId);

      const parsed = await gemini.generateObject<ParsedReceipt>(
        prompt,
        RECEIPT_PARSER_SCHEMA,
        parsedReceiptSchema,
      );

      logInfo("Receipt parsed successfully", {
        merchant: parsed.merchant,
        amount: parsed.amount,
        itemCount: parsed.items?.length || 0,
        confidence: parsed.confidence,
      });

      return parsed;
    } catch (error) {
      logError("Receipt parsing failed", error);

      // Return best-effort fallback
      const fallbackDate = new Date().toISOString().split("T")[0];
      return {
        merchant: "Unknown Merchant",
        amount: 0,
        date: fallbackDate || "",
        confidence: 0,
        items: [],
      };
    }
  }

  /**
   * Combine OCR + Parsing + Categorization
   */
  async processReceipt(
    ocrText: string,
    userId: string,
  ): Promise<ParsedReceipt & { suggestedCategory?: string | undefined }> {
    // Parse receipt data
    const parsed = await this.parseReceiptText(ocrText, userId);

    // Auto-categorize if we have the categorization service
    let suggestedCategory: string | undefined = undefined;

    try {
      // Dynamic import to avoid circular dependencies
      const { categorizationService } =
        await import("./categorization-service");

      // Use real userId for categorization (allows it to learn from history)
      const categoryResult = await categorizationService.categorizeTransaction(
        {
          description: `${parsed.merchant} ${parsed.items?.map((i) => i.name).join(", ") || ""}`,
          amount: parsed.amount,
          type: "expense", // Receipts are typically expenses
        },
        userId,
      );

      suggestedCategory = categoryResult.category;
    } catch (error) {
      logError("Auto-categorization failed, skipping", error);
    }

    return {
      ...parsed,
      suggestedCategory,
    };
  }
}

export const receiptParserService = new ReceiptParserService();

// Backward compatibility wrapper (deprecated)
export const processReceipt = (ocrText: string, userId: string) =>
  receiptParserService.processReceipt(ocrText, userId);
export const parseReceiptText = (ocrText: string, userId: string) =>
  receiptParserService.parseReceiptText(ocrText, userId);

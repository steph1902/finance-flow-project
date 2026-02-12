/**
 * Receipt Parser Service
 * Uses Gemini AI to parse structured transaction data from receipt OCR text
 */

import { getGeminiClient } from "./gemini-client";
import { logInfo, logError } from "@/lib/logger";

interface ParsedReceipt {
  merchant: string;
  amount: number;
  date: string; // ISO date string
  category?: string;
  items?: Array<{
    name: string;
    quantity?: number;
    price?: number;
  }>;
  confidence: number;
  rawData?: {
    total?: string;
    subtotal?: string;
    tax?: string;
    tip?: string;
  };
}

/**
 * Parse receipt text using Gemini AI
 */
export async function parseReceiptText(ocrText: string, userId: string): Promise<ParsedReceipt> {
  try {
    logInfo("Parsing receipt with Gemini AI", {
      textLength: ocrText.length,
      userId
    });

    const prompt = `You are an expert at parsing receipt data. Extract structured information from this receipt text.

Receipt Text:
${ocrText}

Extract the following information (return as valid JSON):
1. merchant: The store/business name (string)
2. amount: Total purchase amount as a number (parse from various formats like "$12.34", "12,34€", "Total: 50.00")
3. date: Transaction date in ISO format YYYY-MM-DD (if year is missing, use current year ${new Date().getFullYear()})
4. items: Array of purchased items with name, quantity (if available), price (if available)
5. rawData: Object with total, subtotal, tax, tip if available (as strings)
6. confidence: Your confidence in the extraction (0-1)

Rules:
- If merchant name is unclear, extract the most prominent business name or location
- Amount should be the final TOTAL, not subtotal (look for "Total", "Amount Due", "Balance")
- Date format: if you see "11/16/2024" or "16-Nov-2024" or "November 16", convert to "2024-11-16"
- If date is completely missing, use today's date: "${new Date().toISOString().split('T')[0]}"
- Items array can be empty if individual items aren't clear
- Confidence should be lower if information is ambiguous or missing

Return ONLY valid JSON (no markdown, no code blocks):
{
  "merchant": "Store Name",
  "amount": 12.34,
  "date": "2024-11-16",
  "items": [
    { "name": "Item 1", "quantity": 2, "price": 5.99 },
    { "name": "Item 2", "price": 6.35 }
  ],
  "rawData": {
    "subtotal": "11.99",
    "tax": "0.35",
    "total": "12.34"
  },
  "confidence": 0.85
}`;

    // Use factory to get client with user's specific API key
    const gemini = await getGeminiClient(userId);
    const result = await gemini.generateContent(prompt);
    const text = result.trim();

    // Extract JSON from response (handle markdown code blocks)
    let jsonText = text;
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    const parsed = JSON.parse(jsonText) as ParsedReceipt;

    // Validate required fields
    if (!parsed.merchant || typeof parsed.amount !== "number" || !parsed.date) {
      throw new Error("Missing required fields from Gemini response");
    }

    // Validate amount is positive
    if (parsed.amount <= 0) {
      throw new Error("Invalid amount: must be greater than 0");
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(parsed.date)) {
      throw new Error("Invalid date format: must be YYYY-MM-DD");
    }

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
export async function processReceipt(ocrText: string, userId: string): Promise<ParsedReceipt & { suggestedCategory?: string | undefined }> {
  // Parse receipt data
  const parsed = await parseReceiptText(ocrText, userId);

  // Auto-categorize if we have the categorization service
  let suggestedCategory: string | undefined = undefined;

  try {
    // Dynamic import to avoid circular dependencies
    const { categorizationService } = await import("./categorization-service");

    // Use real userId for categorization (allows it to learn from history)
    const categoryResult = await categorizationService.categorizeTransaction({
      description: `${parsed.merchant} ${parsed.items?.map(i => i.name).join(", ") || ""}`,
      amount: parsed.amount,
      type: "expense", // Receipts are typically expenses
    }, userId);

    suggestedCategory = categoryResult.category;
  } catch (error) {
    logError("Auto-categorization failed, skipping", error);
  }

  return {
    ...parsed,
    suggestedCategory,
  };
}

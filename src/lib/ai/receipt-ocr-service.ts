/**
 * Receipt OCR Service
 * Uses Gemini Vision API to extract text from receipt images
 */

import { logInfo, logWarn, logError } from "@/lib/logger";
import { getGeminiClient } from "./gemini-client";
import { ENV } from "@/lib/env";

export interface OCRResult {
  fullText: string;
  lines: string[];
  confidence: number;
}

export class ReceiptOCRService {
  constructor(private clientFactory = getGeminiClient) {}

  /**
   * Extract text from receipt image using Gemini Vision API
   */
  async extractTextFromReceipt(
    imageBase64: string,
    userId?: string, // Made optional to support non-authenticated flows if needed, but optimally passed
  ): Promise<OCRResult> {
    try {
      logInfo("Starting receipt OCR with Gemini Vision API");

      // Remove data URL prefix if present
      const base64Image = imageBase64.replace(/^data:image\/\w+;base64,/, "");

      // Extract mime type
      const mimeMatch = imageBase64.match(/^data:(image\/\w+);base64,/);
      const mimeType: string =
        mimeMatch && mimeMatch[1] ? mimeMatch[1] : "image/jpeg";

      const prompt = `Extract ALL text visible in this receipt image. 
Return the text exactly as it appears, line by line, preserving the order and spacing.
Do not summarize or interpret - just extract the raw text.`;

      const gemini = await this.clientFactory(userId);

      const responseText = await gemini.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Image,
            mimeType,
          },
        },
      ]);

      if (!responseText || responseText.trim().length === 0) {
        logWarn("No text detected in image");
        return {
          fullText: "",
          lines: [],
          confidence: 0,
        };
      }

      // Split into lines and clean up
      const lines = responseText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      logInfo("OCR completed successfully", {
        textLength: responseText.length,
        lineCount: lines.length,
      });

      return {
        fullText: responseText,
        lines,
        confidence: responseText.length > 0 ? 0.9 : 0,
      };
    } catch (error) {
      logError("Receipt OCR failed", error);
      throw error;
    }
  }

  /**
   * Validate image before processing
   */
  validateReceiptImage(imageBase64: string): {
    valid: boolean;
    error?: string;
  } {
    // Check if empty
    if (!imageBase64 || imageBase64.trim().length === 0) {
      return { valid: false, error: "Image data is empty" };
    }

    // Check size (max 4MB base64 = ~3MB image)
    const sizeInBytes = imageBase64.length * 0.75; // Base64 to bytes approximation
    const maxSize = 4 * 1024 * 1024; // 4MB

    if (sizeInBytes > maxSize) {
      return {
        valid: false,
        error: `Image too large (${Math.round(sizeInBytes / 1024 / 1024)}MB). Maximum size is 4MB.`,
      };
    }

    // Check if it's a valid base64 image
    const imagePattern = /^data:image\/(jpeg|jpg|png|webp);base64,/;
    if (!imagePattern.test(imageBase64)) {
      return {
        valid: false,
        error: "Invalid image format. Please use JPEG, PNG, or WebP.",
      };
    }

    return { valid: true };
  }
}

export const receiptOCRService = new ReceiptOCRService();

// Backward compatibility wrappers
export const extractTextFromReceipt = (imageBase64: string) =>
  receiptOCRService.extractTextFromReceipt(imageBase64);
export const validateReceiptImage = (imageBase64: string) =>
  receiptOCRService.validateReceiptImage(imageBase64);

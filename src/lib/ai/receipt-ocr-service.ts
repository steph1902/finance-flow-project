/**
 * Receipt OCR Service
 * Uses Gemini Vision API to extract text from receipt images
 */

import { logInfo, logWarn, logError } from "@/lib/logger";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ENV } from "@/lib/env";

interface OCRResult {
  fullText: string;
  lines: string[];
  confidence: number;
}

/**
 * Extract text from receipt image using Gemini Vision API
 */
export async function extractTextFromReceipt(
  imageBase64: string
): Promise<OCRResult> {
  const API_KEY = ENV.GEMINI_API_KEY;
  
  if (!API_KEY || API_KEY.trim() === '') {
    throw new Error(
      "GOOGLE_GENERATIVE_AI_API_KEY not configured. Please add it to your .env file to use receipt scanning."
    );
  }

  try {
    logInfo("Starting receipt OCR with Gemini Vision API");

    // Remove data URL prefix if present
    const base64Image = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    // Extract mime type
    const mimeMatch = imageBase64.match(/^data:(image\/\w+);base64,/);
    const mimeType: string = (mimeMatch && mimeMatch[1]) ? mimeMatch[1] : "image/jpeg";

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Extract ALL text visible in this receipt image. 
Return the text exactly as it appears, line by line, preserving the order and spacing.
Do not summarize or interpret - just extract the raw text.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType,
        },
      },
    ]);

    const response = await result.response;
    const fullText = response.text();

    if (!fullText || fullText.trim().length === 0) {
      logWarn("No text detected in image");
      return {
        fullText: "",
        lines: [],
        confidence: 0,
      };
    }

    // Split into lines and clean up
    const lines = fullText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    logInfo("OCR completed successfully", {
      textLength: fullText.length,
      lineCount: lines.length,
    });

    return {
      fullText,
      lines,
      confidence: fullText.length > 0 ? 0.9 : 0,
    };
  } catch (error) {
    logError("Receipt OCR failed", error);
    throw error;
  }
}

/**
 * Validate image before processing
 */
export function validateReceiptImage(imageBase64: string): {
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

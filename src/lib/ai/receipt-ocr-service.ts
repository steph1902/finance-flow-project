/**
 * Receipt OCR Service
 * Uses Google Cloud Vision API to extract text from receipt images
 * and Gemini AI to parse structured data
 */

import { logInfo, logWarn, logError } from "@/lib/logger";

const VISION_API_KEY = process.env.GOOGLE_CLOUD_API_KEY;
const VISION_API_URL = "https://vision.googleapis.com/v1/images:annotate";

interface VisionAPIResponse {
  responses: Array<{
    textAnnotations?: Array<{
      description: string;
      boundingPoly?: {
        vertices: Array<{ x: number; y: number }>;
      };
    }>;
    fullTextAnnotation?: {
      text: string;
    };
    error?: {
      code: number;
      message: string;
      status: string;
    };
  }>;
}

interface OCRResult {
  fullText: string;
  lines: string[];
  confidence: number;
}

/**
 * Extract text from receipt image using Google Cloud Vision API
 */
export async function extractTextFromReceipt(
  imageBase64: string
): Promise<OCRResult> {
  if (!VISION_API_KEY) {
    throw new Error(
      "GOOGLE_CLOUD_API_KEY not configured. Please add it to your .env file."
    );
  }

  try {
    logInfo("Starting receipt OCR with Google Cloud Vision API");

    // Remove data URL prefix if present
    const base64Image = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    // Call Google Cloud Vision API
    const response = await fetch(`${VISION_API_URL}?key=${VISION_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: [
          {
            image: {
              content: base64Image,
            },
            features: [
              {
                type: "TEXT_DETECTION",
                maxResults: 1,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logError("Vision API error", null, { status: response.status, errorText });
      throw new Error(`Vision API request failed: ${response.status}`);
    }

    const data: VisionAPIResponse = await response.json();

    // Check for API errors
    if (data.responses[0]?.error) {
      const error = data.responses[0].error;
      logError("Vision API returned error", error);
      throw new Error(`Vision API error: ${error.message}`);
    }

    // Extract full text
    const fullTextAnnotation = data.responses[0]?.fullTextAnnotation;
    const textAnnotations = data.responses[0]?.textAnnotations;

    if (!fullTextAnnotation && (!textAnnotations || textAnnotations.length === 0)) {
      logWarn("No text detected in image");
      return {
        fullText: "",
        lines: [],
        confidence: 0,
      };
    }

    // Get full text (most reliable)
    const fullText = fullTextAnnotation?.text || textAnnotations?.[0]?.description || "";

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
      confidence: fullText.length > 0 ? 0.85 : 0, // Vision API doesn't provide confidence for TEXT_DETECTION
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

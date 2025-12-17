/**
 * Receipt Scan API Route
 * POST /api/ai/receipt-scan
 * 
 * Accepts a base64-encoded receipt image, performs OCR,
 * parses transaction data, and suggests a category
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { extractTextFromReceipt, validateReceiptImage } from "@/lib/ai/receipt-ocr-service";
import { processReceipt } from "@/lib/ai/receipt-parser-service";
import { checkAIRateLimit } from "@/lib/rate-limiter";
import { logError, logInfo } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    // 1. Authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Rate limiting (AI operations are expensive)
    const userId = session.user.email;
    if (!checkAIRateLimit(userId)) {
      logInfo("Receipt scan rate limit exceeded", { userId });
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please try again later.",
        },
        { status: 429 }
      );
    }

    // 3. Parse request body
    const body = await req.json();
    const { image } = body;

    if (!image || typeof image !== "string") {
      return NextResponse.json(
        { error: "Image is required (base64 encoded)" },
        { status: 400 }
      );
    }

    // 4. Validate image
    const validation = validateReceiptImage(image);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    logInfo("Processing receipt", {
      userId,
      imageSize: Math.round(image.length / 1024) + "KB",
    });

    // 5. Extract text using OCR
    const ocrResult = await extractTextFromReceipt(image);

    if (!ocrResult.fullText || ocrResult.fullText.length === 0) {
      return NextResponse.json(
        {
          error: "No text detected in image",
          suggestion: "Please ensure the receipt is clear and well-lit",
        },
        { status: 400 }
      );
    }

    // 6. Parse receipt data with Gemini
    const parsedData = await processReceipt(ocrResult.fullText);

    // 7. Return parsed transaction data
    return NextResponse.json({
      success: true,
      data: {
        merchant: parsedData.merchant,
        amount: parsedData.amount,
        date: parsedData.date,
        category: parsedData.suggestedCategory,
        items: parsedData.items || [],
        confidence: parsedData.confidence,
        ocrText: ocrResult.fullText, // For debugging/review
      },
    });

  } catch (error) {
    logError("Receipt scan failed", error);

    // Check for specific errors
    if (error instanceof Error) {
      if (error.message.includes("GOOGLE_GENERATIVE_AI_API_KEY")) {
        return NextResponse.json(
          { error: "Receipt scanning not configured. Please contact support." },
          { status: 503 }
        );
      }

      if (error.message.includes("Vision") || error.message.includes("Gemini")) {
        return NextResponse.json(
          { error: "OCR service unavailable. Please try again later." },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to process receipt" },
      { status: 500 }
    );
  }
}

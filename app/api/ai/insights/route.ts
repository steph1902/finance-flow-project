import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { withApiAuth } from "@/lib/auth-helpers";
import { generateInsights } from "@/lib/ai/insights-service";
import { checkAIRateLimit, getRateLimitHeaders } from "@/lib/rate-limiter";
import { logError } from "@/lib/logger";

const insightsRequestSchema = z.object({
  period: z.enum(["week", "month", "quarter"]).default("month"),
});

export const GET = withApiAuth(async (req: NextRequest, userId: string) => {
  try {
    // Check rate limit
    if (!checkAIRateLimit(userId)) {
      const headers = getRateLimitHeaders(userId, 'AI_ENDPOINTS');
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { 
          status: 429,
          headers,
        }
      );
    }

    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "month";

    const { period: validatedPeriod } = insightsRequestSchema.parse({ period });

    const insights = await generateInsights({
      userId,
      period: validatedPeriod,
    });

    return NextResponse.json({
      insights,
      period: validatedPeriod,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.issues },
        { status: 400 }
      );
    }

    logError("Insights API error", error, { userId });
    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    );
  }
});

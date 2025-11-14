import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { withApiAuth } from "@/lib/auth-helpers";
import { generateInsights } from "@/lib/ai/insights-service";

const insightsRequestSchema = z.object({
  period: z.enum(["week", "month", "quarter"]).default("month"),
});

async function handler(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    console.error("Insights API error:", error);
    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    );
  }
}

export const GET = withApiAuth(handler);

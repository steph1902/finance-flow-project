// src/app/api/ai/big4-analysis/route.ts
import { getErrorMessage } from "@/lib/utils/error";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { big4DecisionEngine } from "@/lib/ai/engines/big4-decision-engine";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/ai/big4-analysis - Generate Big 4 Decision Intelligence Report
 */
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.GOOGLE_AI_API_KEY) {
      console.error("Missing GOOGLE_AI_API_KEY");
      return NextResponse.json(
        { error: "Server configuration error: Missing AI API Key" },
        { status: 500 },
      );
    }

    const body = await request.json();
    const { variant = "big4", force = false } = body;

    // Check for recent analysis (within 24 hours) unless forced
    if (!force) {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const recent = await prisma.big4Analysis.findFirst({
        where: {
          userId: user.id,
          variant,
          createdAt: { gte: oneDayAgo },
        },
        orderBy: { createdAt: "desc" },
      });

      if (recent) {
        return NextResponse.json({
          success: true,
          cached: true,
          analysis: {
            cashflowDiagnosis: recent.cashflowDiagnosis,
            riskProjection: recent.riskProjection,
            strategicWeakPoints: recent.strategicWeakPoints,
            recommendations: recent.recommendations,
          },
          metadata: {
            responseTimeMs: recent.responseTimeMs,
            confidenceScore: Number(recent.confidenceScore),
            specificityScore: Number(recent.specificityScore),
            analysisDate: recent.analysisDate,
          },
        });
      }
    }

    // Generate new analysis
    const result = await big4DecisionEngine.analyze(user.id, variant);

    return NextResponse.json({
      success: true,
      cached: false,
      ...result,
    });
  } catch (error: unknown) {
    console.error("Big 4 Analysis Error:", error);
    return NextResponse.json(
      { error: getErrorMessage(error) || "Failed to generate analysis" },
      { status: 500 },
    );
  }
}

/**
 * GET /api/ai/big4-analysis - Retrieve latest Big 4 analysis
 */
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const variant = searchParams.get("variant") || "big4";
    const limit = parseInt(searchParams.get("limit") || "5");

    const analyses = await prisma.big4Analysis.findMany({
      where: {
        userId: user.id,
        variant,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({
      success: true,
      analyses: analyses.map((a) => ({
        id: a.id,
        analysisDate: a.analysisDate,
        variant: a.variant,
        cashflowDiagnosis: a.cashflowDiagnosis,
        riskProjection: a.riskProjection,
        strategicWeakPoints: a.strategicWeakPoints,
        recommendations: a.recommendations,
        confidenceScore: Number(a.confidenceScore),
        specificityScore: Number(a.specificityScore),
        responseTimeMs: a.responseTimeMs,
        userRating: a.userRating,
        wasHelpful: a.wasHelpful,
        wasActedUpon: a.wasActedUpon,
      })),
    });
  } catch (error: unknown) {
    console.error("Get Big 4 Analysis Error:", error);
    return NextResponse.json(
      { error: getErrorMessage(error) || "Failed to retrieve analyses" },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/ai/big4-analysis - Submit feedback on analysis
 */
export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { analysisId, userRating, wasHelpful, wasActedUpon, feedbackText } =
      body;

    const analysis = await prisma.big4Analysis.findUnique({
      where: { id: analysisId },
    });

    if (!analysis || analysis.userId !== user.id) {
      return NextResponse.json(
        { error: "Analysis not found" },
        { status: 404 },
      );
    }

    await prisma.big4Analysis.update({
      where: { id: analysisId },
      data: {
        userRating,
        wasHelpful,
        wasActedUpon,
        feedbackText,
        feedbackDate: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Feedback submitted successfully",
    });
  } catch (error: unknown) {
    console.error("Submit Feedback Error:", error);
    return NextResponse.json(
      { error: getErrorMessage(error) || "Failed to submit feedback" },
      { status: 500 },
    );
  }
}

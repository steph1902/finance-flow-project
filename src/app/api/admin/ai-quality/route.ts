// src/app/api/admin/ai-quality/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { getErrorMessage } from "@/lib/utils/error";
import { qualityTracker } from "@/lib/ai/monitoring/quality-tracker";

/**
 * GET /api/admin/ai-quality - Get AI quality metrics
 */
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");
    const variant = searchParams.get("variant") || undefined;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const metrics = await qualityTracker.getMetrics(
      startDate,
      endDate,
      variant,
    );

    // Get drift detection for each variant
    const big4Drift = await qualityTracker.detectDrift("big4", 7);
    const baselineDrift = await qualityTracker.detectDrift("baseline", 7);

    return NextResponse.json({
      success: true,
      metrics,
      drift: {
        big4: big4Drift,
        baseline: baselineDrift,
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 },
    );
  }
}

/**
 * POST /api/admin/ai-quality/aggregate - Run daily aggregation
 */
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await qualityTracker.runDailyAggregation();

    return NextResponse.json({
      success: true,
      message: "Daily aggregation complete",
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 },
    );
  }
}

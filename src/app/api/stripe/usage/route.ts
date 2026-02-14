/**
 * Stripe Usage API Route
 * GET /api/stripe/usage - Get user's feature usage counts
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get usage counts for the user
    const [
      transactionCount,
      goalCount,
      budgetCount,
      sharedBudgetCount,
      reportCount,
      aiRequestCount,
    ] = await Promise.all([
      prisma.transaction.count({
        where: { userId, deletedAt: null },
      }),
      prisma.goal.count({
        where: { userId },
      }),
      prisma.budget.count({
        where: { userId },
      }),
      prisma.sharedBudget.count({
        where: { ownerId: userId },
      }),
      prisma.report.count({
        where: { userId },
      }),
      prisma.aISuggestion.count({
        where: { userId },
      }),
    ]);

    return NextResponse.json({
      transactions: transactionCount,
      goals: goalCount,
      budgets: budgetCount,
      sharedBudgets: sharedBudgetCount,
      reports: reportCount,
      aiRequests: aiRequestCount,
    });
  } catch (error) {
    logger.error("Failed to fetch usage data", error);
    return NextResponse.json(
      { error: "Failed to fetch usage data" },
      { status: 500 },
    );
  }
}

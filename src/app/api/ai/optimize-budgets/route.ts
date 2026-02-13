import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logInfo, logError } from "@/lib/logger";
import { budgetOptimizerService } from "@/lib/ai/budget-optimizer-service";
import { checkAIRateLimit } from "@/lib/rate-limiter";

/**
 * AI Budget Optimizer API
 * GET /api/ai/optimize-budgets - Get optimization suggestions
 * POST /api/ai/optimize-budgets/apply - Apply suggested optimizations
 * 
 * Analyzes budget vs actual spending and suggests reallocation
 * to better align budgets with real spending patterns.
 */

export async function GET(req: NextRequest) {
  try {
    // 1. Authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Rate limiting
    const userId = session.user.email;
    if (!checkAIRateLimit(userId)) {
      logInfo("Budget optimization rate limit exceeded", { userId });
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    // 3. Parse query parameters
    const { searchParams } = new URL(req.url);
    const monthsParam = searchParams.get("months") || "3";
    const months = Math.min(Math.max(parseInt(monthsParam, 10), 1), 6);

    logInfo("Budget optimization requested", { userId, months });

    // 4. Get user
    const user = await prisma.user.findUnique({
      where: { email: userId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 5. Get current month's budgets
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const budgets = await prisma.budget.findMany({
      where: {
        userId: user.id,
        month: currentMonth,
        year: currentYear,
      },
      select: {
        id: true,
        category: true,
        amount: true,
        month: true,
        year: true,
      },
    });

    // 6. Get actual spending for analysis period
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        deletedAt: null,
        type: "EXPENSE",
        date: {
          gte: startDate,
        },
      },
      select: {
        amount: true,
        category: true,
        date: true,
      },
    });

    // 7. Generate optimization suggestions
    const optimization = await budgetOptimizerService.optimizeBudgets({
      budgets,
      transactions,
      months,
      userId: user.id,
    });

    logInfo("Budget optimization generated", {
      userId,
      suggestionsCount: optimization.suggestions.length,
      totalSavings: optimization.totalSavings,
    });

    return NextResponse.json({
      data: optimization,
    });

  } catch (error) {
    logError("Budget optimization failed", error);
    return NextResponse.json(
      { error: "Failed to optimize budgets" },
      { status: 500 }
    );
  }
}

/**
 * Apply budget optimization suggestions
 */
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

    const userId = session.user.email;
    logInfo("Applying budget optimizations", { userId });

    // 2. Get user
    const user = await prisma.user.findUnique({
      where: { email: userId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 3. Parse request body
    const body = await req.json();
    const { suggestions } = body;

    if (!suggestions || !Array.isArray(suggestions)) {
      return NextResponse.json(
        { error: "Invalid request: suggestions array required" },
        { status: 400 }
      );
    }

    // 4. Apply optimizations in a transaction
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const results = await prisma.$transaction(async (tx) => {
      const updates = [];

      for (const suggestion of suggestions) {
        const { fromCategory, toCategory, amount } = suggestion;

        // Get source budget
        const fromBudget = await tx.budget.findFirst({
          where: {
            userId: user.id,
            category: fromCategory,
            month: currentMonth,
            year: currentYear,
          },
        });

        // Get target budget
        const toBudget = await tx.budget.findFirst({
          where: {
            userId: user.id,
            category: toCategory,
            month: currentMonth,
            year: currentYear,
          },
        });

        if (fromBudget) {
          // Decrease source budget
          const updated = await tx.budget.update({
            where: { id: fromBudget.id },
            data: {
              amount: Math.max(0, Number(fromBudget.amount) - amount),
            },
          });
          updates.push({ action: "decreased", ...updated });
        }

        if (toBudget) {
          // Increase target budget
          const updated = await tx.budget.update({
            where: { id: toBudget.id },
            data: {
              amount: Number(toBudget.amount) + amount,
            },
          });
          updates.push({ action: "increased", ...updated });
        } else {
          // Create new budget if doesn't exist
          const created = await tx.budget.create({
            data: {
              userId: user.id,
              category: toCategory,
              amount: amount,
              month: currentMonth,
              year: currentYear,
            },
          });
          updates.push({ action: "created", ...created });
        }
      }

      return updates;
    });

    logInfo("Budget optimizations applied", {
      userId,
      updatesCount: results.length,
    });

    return NextResponse.json({
      data: {
        message: "Budget optimizations applied successfully",
        updates: results,
      },
    });

  } catch (error) {
    logError("Failed to apply budget optimizations", error);
    return NextResponse.json(
      { error: "Failed to apply optimizations" },
      { status: 500 }
    );
  }
}

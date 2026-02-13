import { NextRequest, NextResponse } from "next/server";
import { getErrorMessage } from '@/lib/utils/error';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logInfo, logError } from "@/lib/logger";
import { forecastService } from "@/lib/ai/forecast-service";
import { checkAIRateLimit } from "@/lib/rate-limiter";

/**
 * AI Spending Forecast API
 * GET /api/ai/forecast?months=3
 * 
 * Generates predictive spending forecast based on:
 * - Historical transaction patterns (6 months)
 * - Active recurring transactions
 * - Category spending trends
 * - Seasonal patterns
 * 
 * Returns:
 * - Monthly forecast by category
 * - Confidence score
 * - Methodology explanation
 * - Total projected spending
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
      logInfo("AI forecast rate limit exceeded", { userId });
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    // 3. Parse query parameters
    const { searchParams } = new URL(req.url);
    const monthsParam = searchParams.get("months") || "3";
    const months = Math.min(Math.max(parseInt(monthsParam, 10), 1), 6); // Clamp 1-6

    logInfo("Forecast requested", { userId, months });

    // 4. Get user from database
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

    // 5. Get historical transactions (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        deletedAt: null,
        date: {
          gte: sixMonthsAgo,
        },
      },
      select: {
        amount: true,
        category: true,
        type: true,
        date: true,
        description: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    // 6. Get active recurring transactions
    const recurringTransactions = await prisma.recurringTransaction.findMany({
      where: {
        userId: user.id,
        isActive: true,
        OR: [
          { endDate: null },
          { endDate: { gte: new Date() } },
        ],
      },
      select: {
        amount: true,
        category: true,
        type: true,
        frequency: true,
        description: true,
      },
    });

    // 7. Convert Prisma Decimal to number for AI service
    const convertedTransactions = transactions.map(t => ({
      ...t,
      amount: t.amount.toNumber(),
    }));

    const convertedRecurringTransactions = recurringTransactions.map(rt => ({
      ...rt,
      amount: rt.amount.toNumber(),
    }));

    // 8. Generate forecast using Gemini AI
    const forecast = await forecastService.generateForecast({
      transactions: convertedTransactions,
      recurringTransactions: convertedRecurringTransactions,
      months,
      userId: user.id,
    });

    logInfo("Forecast generated successfully", {
      userId,
      months,
      totalProjected: forecast.totalProjected,
      confidence: forecast.confidence,
    });

    // 8. Return forecast
    return NextResponse.json({
      data: forecast,
    });

  } catch (error) {
    logError("Forecast generation failed", error);

    // Provide more specific error messages
    const errorMessage = error instanceof Error ? getErrorMessage(error) : "Failed to generate forecast";

    return NextResponse.json(
      {
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

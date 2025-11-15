import { geminiClient } from "./gemini-client";
import { createInsightsPrompt } from "./prompts/assistant";
import { prisma } from "@/lib/prisma";

export interface Insight {
  type: "spending_alert" | "trend" | "recommendation" | "achievement";
  severity: "info" | "warning" | "critical";
  title: string;
  message: string;
  category: string | null;
  amount: number | null;
  recommendation: string | null;
}

interface GenerateInsightsRequest {
  userId: string;
  period: "week" | "month" | "quarter";
}

interface PeriodData {
  startDate: Date;
  endDate: Date;
  previousStartDate: Date;
  previousEndDate: Date;
}

function getPeriodDates(period: "week" | "month" | "quarter"): PeriodData {
  const now = new Date();
  const endDate = new Date(now);
  const startDate = new Date(now);
  const previousEndDate = new Date(now);
  const previousStartDate = new Date(now);

  switch (period) {
    case "week":
      startDate.setDate(now.getDate() - 7);
      previousStartDate.setDate(now.getDate() - 14);
      previousEndDate.setDate(now.getDate() - 7);
      break;
    case "month":
      startDate.setMonth(now.getMonth() - 1);
      previousStartDate.setMonth(now.getMonth() - 2);
      previousEndDate.setMonth(now.getMonth() - 1);
      break;
    case "quarter":
      startDate.setMonth(now.getMonth() - 3);
      previousStartDate.setMonth(now.getMonth() - 6);
      previousEndDate.setMonth(now.getMonth() - 3);
      break;
  }

  return {
    startDate,
    endDate,
    previousStartDate,
    previousEndDate,
  };
}

export async function generateInsights({
  userId,
  period,
}: GenerateInsightsRequest): Promise<Insight[]> {
  try {
    const { startDate, endDate, previousStartDate, previousEndDate } =
      getPeriodDates(period);

    // Fetch current period transactions
    const [currentTransactions, previousTransactions, budgets] =
      await Promise.all([
        prisma.transaction.findMany({
          where: {
            userId,
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
          select: {
            amount: true,
            category: true,
            description: true,
            date: true,
            type: true,
          },
          orderBy: { date: "desc" },
        }),
        prisma.transaction.findMany({
          where: {
            userId,
            date: {
              gte: previousStartDate,
              lte: previousEndDate,
            },
          },
          select: {
            amount: true,
            category: true,
            date: true,
            type: true,
          },
        }),
        prisma.budget.findMany({
          where: { userId },
          select: {
            category: true,
            amount: true,
            month: true,
            year: true,
          },
        }),
      ]);

    // Calculate spending by category for current period
    const currentSpending = currentTransactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((acc: Record<string, number>, t) => {
        acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
        return acc;
      }, {});

    // Calculate spending by category for previous period
    const previousSpending = previousTransactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((acc: Record<string, number>, t) => {
        acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
        return acc;
      }, {});

    // Calculate totals
    const currentTotal = Object.values(currentSpending).reduce(
      (sum: number, amt) => sum + amt,
      0
    );
    const previousTotal = Object.values(previousSpending).reduce(
      (sum: number, amt) => sum + amt,
      0
    );

    // Prepare data for AI analysis
    const analysisData = {
      period,
      currentPeriod: {
        total: currentTotal,
        byCategory: currentSpending,
        transactionCount: currentTransactions.filter((t) => t.type === "EXPENSE")
          .length,
        topTransactions: currentTransactions
          .filter((t) => t.type === "EXPENSE")
          .slice(0, 10)
          .map((t) => ({
            amount: Number(t.amount),
            category: t.category,
            description: t.description || "",
            date: t.date.toISOString(),
          })),
      },
      previousPeriod: {
        total: previousTotal,
        byCategory: previousSpending,
      },
      budgets: budgets.map((b) => ({
        category: b.category,
        amount: Number(b.amount),
        period: `${b.month}/${b.year}`,
      })),
      comparison: {
        percentageChange:
          previousTotal > 0
            ? ((currentTotal - previousTotal) / previousTotal) * 100
            : 0,
        absoluteChange: currentTotal - previousTotal,
      },
    };

    // Get AI insights using Gemini
    const prompt = createInsightsPrompt({
      transactions: currentTransactions,
      period,
      previousPeriodData: analysisData,
    });

    const aiResponse = await geminiClient.generateContent(prompt);

    // Parse AI response (expecting JSON array)
    let insights: Insight[] = [];
    try {
      // Extract JSON from response
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        insights = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback to generated insights if AI response isn't JSON
        insights = generateFallbackInsights(analysisData, budgets);
      }
    } catch (parseError) {
      console.error("Failed to parse AI insights:", parseError);
      insights = generateFallbackInsights(analysisData, budgets);
    }

    return insights;
  } catch (error) {
    console.error("Insights generation error:", error);
    throw new Error("Failed to generate insights");
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function generateFallbackInsights(
  data: any,
  budgets: any[]
): Insight[] {
/* eslint-enable @typescript-eslint/no-explicit-any */
  const insights: Insight[] = [];

  // Spending trend insight
  if (data.comparison.percentageChange > 10) {
    insights.push({
      type: "trend",
      severity: "warning",
      title: "Spending Increased",
      message: `Your spending is up ${data.comparison.percentageChange.toFixed(
        1
      )}% compared to last ${data.period}. You spent $${data.currentPeriod.total.toFixed(
        2
      )} vs $${data.previousPeriod.total.toFixed(2)} previously.`,
      category: null,
      amount: data.comparison.absoluteChange,
      recommendation:
        "Review your top spending categories and look for areas to cut back.",
    });
  } else if (data.comparison.percentageChange < -10) {
    insights.push({
      type: "achievement",
      severity: "info",
      title: "Spending Decreased",
      message: `Great job! Your spending is down ${Math.abs(
        data.comparison.percentageChange
      ).toFixed(1)}% compared to last ${data.period}. You saved $${Math.abs(
        data.comparison.absoluteChange
      ).toFixed(2)}.`,
      category: null,
      amount: Math.abs(data.comparison.absoluteChange),
      recommendation: "Keep up the good work!",
    });
  }

  // Budget alerts
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  budgets.forEach((budget) => {
    if (budget.month === currentMonth && budget.year === currentYear) {
      const spent = data.currentPeriod.byCategory[budget.category] || 0;
      const budgetAmount = Number(budget.amount);
      const percentUsed = (spent / budgetAmount) * 100;

      if (percentUsed > 90) {
        insights.push({
          type: "spending_alert",
          severity: percentUsed > 100 ? "critical" : "warning",
          title: `${budget.category} Budget Alert`,
          message: `You've used ${percentUsed.toFixed(
            0
          )}% of your ${budget.category} budget ($${spent.toFixed(
            2
          )} of $${budgetAmount.toFixed(2)}).`,
          category: budget.category,
          amount: spent,
          recommendation:
            percentUsed > 100
              ? `You're over budget! Consider reducing ${budget.category} spending.`
              : `You're close to your limit. Be mindful of ${budget.category} expenses.`,
        });
      }
    }
  });

  // Top category insight
  const topCategory = Object.entries(data.currentPeriod.byCategory).sort(
    ([, a], [, b]) => (b as number) - (a as number)
  )[0];

  if (topCategory) {
    const [category, amount] = topCategory;
    insights.push({
      type: "recommendation",
      severity: "info",
      title: `Top Spending: ${category}`,
      message: `${category} is your biggest expense this ${data.period} at $${(
        amount as number
      ).toFixed(2)}.`,
      category,
      amount: amount as number,
      recommendation: `Review your ${category} transactions to find potential savings.`,
    });
  }

  return insights;
}

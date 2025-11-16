/**
 * AI Budget Optimizer Service
 * 
 * Analyzes budget vs actual spending variance and suggests
 * optimal budget reallocation using statistical analysis and Gemini AI.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { ENV } from "@/lib/env";
import { logInfo, logError } from "@/lib/logger";

const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);

interface Budget {
  id: string;
  category: string;
  amount: number | { toNumber: () => number };
  month: number;
  year: number;
}

interface Transaction {
  amount: number | { toNumber: () => number };
  category: string;
  date: Date;
}

interface OptimizationInput {
  budgets: Budget[];
  transactions: Transaction[];
  months: number;
  userId: string;
}

interface BudgetSuggestion {
  fromCategory: string;
  toCategory: string;
  amount: number;
  reason: string;
  impact: string;
  priority: "high" | "medium" | "low";
}

export interface OptimizationResult {
  suggestions: BudgetSuggestion[];
  totalSavings: number;
  confidence: number;
  analysis: {
    overBudget: Array<{ category: string; budget: number; actual: number; variance: number }>;
    underBudget: Array<{ category: string; budget: number; actual: number; variance: number }>;
    balanced: Array<{ category: string; budget: number; actual: number }>;
  };
  insights: string[];
  generatedAt: string;
}

/**
 * Convert Prisma Decimal to number
 */
function toNumber(value: number | { toNumber: () => number }): number {
  return typeof value === "number" ? value : value.toNumber();
}

/**
 * Calculate actual spending by category
 */
function calculateActualSpending(
  transactions: Transaction[],
  months: number
): Map<string, number> {
  const spending = new Map<string, number>();

  for (const tx of transactions) {
    const amount = toNumber(tx.amount);
    const current = spending.get(tx.category) || 0;
    spending.set(tx.category, current + amount);
  }

  // Convert to monthly average
  for (const [category, total] of spending.entries()) {
    spending.set(category, total / months);
  }

  return spending;
}

/**
 * Analyze variance between budgets and actual spending
 */
function analyzeVariance(
  budgets: Budget[],
  actualSpending: Map<string, number>
) {
  const overBudget: Array<{ category: string; budget: number; actual: number; variance: number }> = [];
  const underBudget: Array<{ category: string; budget: number; actual: number; variance: number }> = [];
  const balanced: Array<{ category: string; budget: number; actual: number }> = [];

  for (const budget of budgets) {
    const budgetAmount = toNumber(budget.amount);
    const actualAmount = actualSpending.get(budget.category) || 0;
    const variance = actualAmount - budgetAmount;
    const variancePercent = budgetAmount > 0 ? (variance / budgetAmount) * 100 : 0;

    if (variancePercent > 10) {
      // Over budget by >10%
      overBudget.push({
        category: budget.category,
        budget: budgetAmount,
        actual: actualAmount,
        variance,
      });
    } else if (variancePercent < -10) {
      // Under budget by >10%
      underBudget.push({
        category: budget.category,
        budget: budgetAmount,
        actual: actualAmount,
        variance,
      });
    } else {
      // Within ±10%
      balanced.push({
        category: budget.category,
        budget: budgetAmount,
        actual: actualAmount,
      });
    }
  }

  // Sort by variance magnitude
  overBudget.sort((a, b) => b.variance - a.variance);
  underBudget.sort((a, b) => a.variance - b.variance);

  return { overBudget, underBudget, balanced };
}

/**
 * Generate budget optimization suggestions using Gemini AI
 */
export async function optimizeBudgets(input: OptimizationInput): Promise<OptimizationResult> {
  try {
    const { budgets, transactions, months, userId } = input;

    logInfo("Optimizing budgets", { userId, months, budgetsCount: budgets.length });

    // 1. Calculate actual spending
    const actualSpending = calculateActualSpending(transactions, months);

    // 2. Analyze variance
    const analysis = analyzeVariance(budgets, actualSpending);

    // 3. Use Gemini to generate optimization suggestions
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `You are a financial budget optimization expert. Analyze this budget variance data and suggest optimal reallocations.

Current Budgets (${budgets.length} categories):
${budgets.map(b => `- ${b.category}: $${toNumber(b.amount).toFixed(2)}/month`).join("\n")}

Analysis Period: ${months} months

Over Budget (spending too much):
${analysis.overBudget.map(ob => 
  `- ${ob.category}: Budget $${ob.budget.toFixed(2)}, Actual $${ob.actual.toFixed(2)} (${((ob.variance / ob.budget) * 100).toFixed(0)}% over)`
).join("\n") || "None"}

Under Budget (budget too high):
${analysis.underBudget.map(ub => 
  `- ${ub.category}: Budget $${ub.budget.toFixed(2)}, Actual $${ub.actual.toFixed(2)} (${((Math.abs(ub.variance) / ub.budget) * 100).toFixed(0)}% under)`
).join("\n") || "None"}

Balanced:
${analysis.balanced.map(b => `- ${b.category}: $${b.budget.toFixed(2)}`).join("\n") || "None"}

Please provide:
1. Specific reallocation suggestions (move $X from Category A to Category B)
2. Reason for each suggestion (why this reallocation makes sense)
3. Expected impact (how this improves budget accuracy)
4. Priority (high/medium/low)
5. 3-5 actionable insights about spending patterns
6. Overall confidence score (0-1)

Return as JSON:
{
  "suggestions": [
    {
      "fromCategory": "category name",
      "toCategory": "category name",
      "amount": 100,
      "reason": "explanation",
      "impact": "expected outcome",
      "priority": "high"
    }
  ],
  "insights": ["insight1", "insight2", ...],
  "confidence": 0.85
}

Only suggest reallocations if variance is significant (>15%). Limit to 5 suggestions maximum.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Parse Gemini response
    let geminiData: {
      suggestions: BudgetSuggestion[];
      insights: string[];
      confidence: number;
    };

    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      geminiData = JSON.parse(jsonMatch?.[0] || "{}");
    } catch {
      // Fallback if parsing fails
      geminiData = {
        suggestions: [],
        insights: [
          "Your budgets are generally well-aligned with actual spending.",
          "Consider reviewing categories with >20% variance.",
        ],
        confidence: 0.7,
      };
    }

    // 4. Calculate total savings (sum of amounts being reallocated)
    const totalSavings = geminiData.suggestions.reduce(
      (sum, s) => sum + s.amount,
      0
    );

    logInfo("Budget optimization completed", {
      userId,
      suggestionsCount: geminiData.suggestions.length,
      totalSavings,
    });

    return {
      suggestions: geminiData.suggestions,
      totalSavings,
      confidence: geminiData.confidence,
      analysis,
      insights: geminiData.insights,
      generatedAt: new Date().toISOString(),
    };

  } catch (error) {
    logError("Budget optimization failed", error);
    throw new Error("Failed to optimize budgets");
  }
}

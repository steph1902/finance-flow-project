/**
 * AI Budget Optimizer Service
 * 
 * Analyzes budget vs actual spending variance and suggests
 * optimal budget reallocation using statistical analysis and Gemini AI.
 */

import { geminiClient, GeminiClient } from "./gemini-client";
import { logInfo, logError } from "@/lib/logger"; // Assuming logger exists
import {
  createOptimizationPrompt,
  optimizationResultSchema,
  OptimizationResponse,
  Budget,
  Transaction
} from "./prompts/optimization";

export interface OptimizationInput {
  budgets: Budget[];
  transactions: Transaction[];
  months: number;
  userId: string;
}

export interface OptimizationResult extends OptimizationResponse {
  totalSavings: number;
  analysis: {
    overBudget: Array<{ category: string; budget: number; actual: number; variance: number }>;
    underBudget: Array<{ category: string; budget: number; actual: number; variance: number }>;
    balanced: Array<{ category: string; budget: number; actual: number }>;
  };
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
 * @internal - Exported for testing
 */
export function calculateActualSpending(
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
 * @internal - Exported for testing
 */
export function analyzeVariance(
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
    // Handle division by zero
    const variancePercent = budgetAmount > 0 ? (variance / budgetAmount) * 100 : (actualAmount > 0 ? 100 : 0);

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

export class BudgetOptimizerService {
  constructor(private client: GeminiClient = geminiClient) { }

  /**
   * Generate budget optimization suggestions using Gemini AI
   */
  async optimizeBudgets(input: OptimizationInput): Promise<OptimizationResult> {
    try {
      const { budgets, transactions, months, userId } = input;

      logInfo("Optimizing budgets", { userId, months, budgetsCount: budgets.length });

      // 1. Calculate actual spending
      const actualSpending = calculateActualSpending(transactions, months);

      // 2. Analyze variance
      const analysis = analyzeVariance(budgets, actualSpending);

      // 3. Use Gemini to generate optimization suggestions
      const prompt = createOptimizationPrompt(budgets, analysis, months);

      const geminiData = await this.client.generateObject<OptimizationResponse>(
        prompt,
        "Budget Optimization Schema",
        optimizationResultSchema
      );

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
        ...geminiData,
        totalSavings,
        analysis,
        generatedAt: new Date().toISOString(),
      };

    } catch (error) {
      logError("Budget optimization failed", error);
      throw new Error("Failed to optimize budgets");
    }
  }
}

export const budgetOptimizerService = new BudgetOptimizerService();


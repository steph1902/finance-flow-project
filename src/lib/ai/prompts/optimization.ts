import { z } from "zod";

export interface Budget {
  id: string;
  category: string;
  amount: number | { toNumber: () => number };
  month: number;
  year: number;
}

export interface Transaction {
  amount: number | { toNumber: () => number };
  category: string;
  date: Date;
}

export const budgetSuggestionSchema = z.object({
  fromCategory: z.string(),
  toCategory: z.string(),
  amount: z.number(),
  reason: z.string(),
  impact: z.string(),
  priority: z.enum(["high", "medium", "low"]),
});

export const optimizationResultSchema = z.object({
  suggestions: z.array(budgetSuggestionSchema),
  insights: z.array(z.string()),
  confidence: z.number().min(0).max(1),
});

export type OptimizationResponse = z.infer<typeof optimizationResultSchema>;

export function createOptimizationPrompt(
  budgets: Budget[],
  analysis: {
    overBudget: Array<{
      category: string;
      budget: number;
      actual: number;
      variance: number;
    }>;
    underBudget: Array<{
      category: string;
      budget: number;
      actual: number;
      variance: number;
    }>;
    balanced: Array<{ category: string; budget: number; actual: number }>;
  },
  months: number,
): string {
  // Helper to safely convert Decimal/number to number
  const toNumber = (value: number | { toNumber: () => number }): number => {
    return typeof value === "number" ? value : value.toNumber();
  };

  return `You are a financial budget optimization expert. Analyze this budget variance data and suggest optimal reallocations.

Current Budgets (${budgets.length} categories):
${budgets.map((b) => `- ${b.category}: $${toNumber(b.amount).toFixed(2)}/month`).join("\n")}

Analysis Period: ${months} months

Over Budget (spending too much):
${
  analysis.overBudget
    .map(
      (ob) =>
        `- ${ob.category}: Budget $${ob.budget.toFixed(2)}, Actual $${ob.actual.toFixed(2)} (${((ob.variance / ob.budget) * 100).toFixed(0)}% over)`,
    )
    .join("\n") || "None"
}

Under Budget (budget too high):
${
  analysis.underBudget
    .map(
      (ub) =>
        `- ${ub.category}: Budget $${ub.budget.toFixed(2)}, Actual $${ub.actual.toFixed(2)} (${((Math.abs(ub.variance) / ub.budget) * 100).toFixed(0)}% under)`,
    )
    .join("\n") || "None"
}

Balanced:
${analysis.balanced.map((b) => `- ${b.category}: $${b.budget.toFixed(2)}`).join("\n") || "None"}

Please provide:
1. Specific reallocation suggestions (move $X from Category A to Category B)
2. Reason for each suggestion (why this reallocation makes sense)
3. Expected impact (how this improves budget accuracy)
4. Priority (high/medium/low)
5. 3-5 actionable insights about spending patterns
6. Overall confidence score (0-1)

Only suggest reallocations if variance is significant (>15%). Limit to 5 suggestions maximum.`;
}

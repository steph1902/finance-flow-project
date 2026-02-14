import { z } from "zod";

export const forecastResponseSchema = z.object({
  categoryExplanations: z.record(z.string(), z.string()),
  insights: z.array(z.string()),
  confidence: z.number().min(0).max(1),
  methodology: z.string(),
});

export type ForecastResponse = z.infer<typeof forecastResponseSchema>;

export const FORECAST_SCHEMA = JSON.stringify({
  type: "object",
  properties: {
    categoryExplanations: {
      type: "object",
      additionalProperties: { type: "string" },
      description:
        "Explanation for each category forecast, keyed by category name",
    },
    insights: {
      type: "array",
      items: { type: "string" },
      description: "Actionable insights about spending patterns",
    },
    confidence: {
      type: "number",
      description: "Overall forecast confidence (0-1)",
    },
    methodology: {
      type: "string",
      description: "Summary of the methodology used",
    },
  },
  required: ["categoryExplanations", "insights", "confidence", "methodology"],
});

export const createForecastPrompt = (
  transactionsLength: number,
  categories: string[],
  months: number,
  categoryForecasts: { category: string; projected: number; trend: string }[],
  recurringTransactions: {
    description?: string | null;
    amount: number;
    frequency: string;
  }[],
): string => {
  return `You are a financial forecasting assistant. Analyze this spending data and provide insights.

Historical Data (last 6 months):
- Total transactions: ${transactionsLength}
- Categories: ${categories.join(", ")}

Forecast Request:
- Forecast ${months} months ahead
- Include ${categoryForecasts.length} categories

Category Forecasts:
${categoryForecasts.map((cf) => `- ${cf.category}: $${cf.projected.toFixed(2)}/month (${cf.trend})`).join("\n")}

Recurring Transactions:
${recurringTransactions.map((rt) => `- ${rt.description || "Unnamed"}: $${rt.amount} (${rt.frequency})`).join("\n")}

Please provide:
1. A brief explanation for each category's forecast (1 sentence each).
2. 3-5 actionable insights about spending patterns.
3. Overall forecast confidence (0-1).
4. Methodology summary (2 sentences).`;
};

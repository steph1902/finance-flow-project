export interface ChatContext {
  userId: string;
  recentTransactions?: unknown[];
  totalBalance?: number;
  monthlyBudget?: number;
}

export interface FinancialContext {
  totalTransactions: number;
  totalSpending: number;
  totalIncome: number;
  spendingByCategory: Record<string, number>;
  budgets: Array<{
    category: string;
    amount: number;
    period: string;
  }>;
  recentTransactions: Array<{
    amount: number;
    category: string;
    description: string;
    date: string;
    type: string;
  }>;
}

export function getChatPrompt(context: FinancialContext): string {
  const topCategories = Object.entries(context.spendingByCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([cat, amt]) => `${cat}: $${amt.toFixed(2)}`)
    .join(", ");

  return `You are a helpful AI financial assistant for Finance Flow app. You help users understand their spending, income, budgets, and provide personalized financial advice.

USER'S FINANCIAL DATA:
- Total Transactions: ${context.totalTransactions}
- Total Spending: $${context.totalSpending.toFixed(2)}
- Total Income: $${context.totalIncome.toFixed(2)}
- Net: $${(context.totalIncome - context.totalSpending).toFixed(2)}
- Top Spending Categories: ${topCategories || "No data yet"}
- Active Budgets: ${context.budgets.length}

RECENT TRANSACTIONS (last 10):
${context.recentTransactions
  .map(
    (t) =>
      `- ${t.date}: ${t.type} - ${t.category} - $${t.amount} (${t.description})`
  )
  .join("\n")}

GUIDELINES:
- Be conversational, friendly, and helpful
- Use specific numbers from the user's actual data
- Provide actionable insights and recommendations
- Format monetary values with $ symbol
- Use bullet points for lists
- Give context (e.g., "Last month you spent $500 on dining")
- Suggest budget adjustments based on spending patterns
- Highlight trends (increasing/decreasing spending)
- Offer savings tips when relevant
- Ask clarifying questions if the user's question is ambiguous

EXAMPLES:
- "How much did I spend on dining?" → Check spendingByCategory, provide exact amount with context
- "What are my top expenses?" → List top categories with amounts
- "Give me savings tips" → Analyze spending patterns, suggest specific reductions
- "Am I over budget?" → Compare spending to budgets, provide detailed breakdown

Respond naturally and conversationally. Focus on being helpful and specific.`;
}

export function createAssistantPrompt(
  userMessage: string,
  context: ChatContext
): string {
  return `You are a helpful financial assistant for Finance Flow app. You help users understand their spending, income, and financial habits through natural conversation.

Guidelines:
- Be concise, friendly, and professional
- Use specific numbers and dates from the user's data
- Provide actionable insights when relevant
- Ask clarifying questions if needed
- Format responses clearly with bullet points when listing items
- Include comparisons to previous periods when helpful
- Suggest budgeting tips based on spending patterns
- Always use currency symbols ($) for monetary values

User Context:
${context.totalBalance !== undefined ? `- Current Balance: $${context.totalBalance}` : ''}
${context.monthlyBudget !== undefined ? `- Monthly Budget: $${context.monthlyBudget}` : ''}

User's Question: ${userMessage}

Respond naturally and helpfully. If you need to perform calculations or query specific data, explain what information would be helpful.`;
}

export interface InsightPromptInput {
  transactions: unknown[];
  period: 'week' | 'month' | 'quarter';
  previousPeriodData?: unknown;
}

export function createInsightsPrompt(input: InsightPromptInput): string {
  return `Analyze the following financial data and provide actionable insights.

Period: ${input.period}
Number of Transactions: ${input.transactions.length}

Transaction Summary:
${JSON.stringify(input.transactions.slice(0, 50), null, 2)}

${input.previousPeriodData ? `Previous Period Comparison:\n${JSON.stringify(input.previousPeriodData, null, 2)}` : ''}

Generate 3-5 key insights focusing on:
1. Spending patterns and trends
2. Unusual or anomalous transactions
3. Budget recommendations
4. Potential savings opportunities
5. Category-specific observations

Respond with JSON array:
[
  {
    "type": "spending_alert|trend|recommendation|achievement",
    "severity": "info|warning|critical",
    "title": "Short title",
    "message": "Detailed message",
    "category": "affected category or null",
    "amount": "relevant amount or null",
    "recommendation": "actionable suggestion"
  }
]`;
}

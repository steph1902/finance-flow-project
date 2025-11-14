export interface ChatContext {
  userId: string;
  recentTransactions?: unknown[];
  totalBalance?: number;
  monthlyBudget?: number;
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

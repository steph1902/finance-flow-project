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
  recurringObligations?: {
    count: number;
    monthlyTotal: number;
    breakdown: Array<{
      category: string;
      amount: number;
      frequency: string;
      nextDate: string;
      type: string;
    }>;
  };
}

export function getChatPrompt(context: FinancialContext): string {
  const topCategories = Object.entries(context.spendingByCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([cat, amt]) => `${cat}: $${amt.toFixed(2)}`)
    .join(", ");

  // Calculate budget utilization
  const budgetUtilization = context.budgets.map((budget) => {
    const spent = context.spendingByCategory[budget.category] || 0;
    const percentage = budget.amount > 0 ? ((spent / budget.amount) * 100).toFixed(1) : '0';
    const status = Number(percentage) > 100 ? 'OVER BUDGET ⚠️' : Number(percentage) > 80 ? 'NEAR LIMIT 📊' : 'ON TRACK ✅';
    return `${budget.category}: $${spent.toFixed(2)}/$${budget.amount.toFixed(2)} (${percentage}%) ${status}`;
  });

  // Calculate net position
  const netAmount = context.totalIncome - context.totalSpending;
  const netStatus = netAmount > 0 ? 'POSITIVE 📈' : netAmount < 0 ? 'DEFICIT 📉' : 'BREAK-EVEN ⚖️';

  // Analyze spending velocity (transactions per category)
  const categoryFrequency = context.recentTransactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((acc: Record<string, number>, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {});
  
  const frequentCategories = Object.entries(categoryFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([cat, count]) => `${cat} (${count} transactions)`)
    .join(", ");

  return `You are a highly knowledgeable AI financial assistant for FinanceFlow. You analyze spending patterns, provide personalized budget recommendations, and help users achieve their financial goals.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
USER'S COMPREHENSIVE FINANCIAL SNAPSHOT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 OVERALL SUMMARY:
• Total Transactions Analyzed: ${context.totalTransactions}
• Total Income: $${context.totalIncome.toFixed(2)}
• Total Spending: $${context.totalSpending.toFixed(2)}
• Net Position: $${netAmount.toFixed(2)} ${netStatus}
• Savings Rate: ${context.totalIncome > 0 ? ((netAmount / context.totalIncome) * 100).toFixed(1) : 0}%

💰 SPENDING BREAKDOWN:
• Top 5 Categories: ${topCategories || "No spending data yet"}
• Most Active Categories: ${frequentCategories || "No activity yet"}
• Average Transaction: $${context.totalTransactions > 0 ? (context.totalSpending / context.totalTransactions).toFixed(2) : '0'}

📋 BUDGET TRACKING (${context.budgets.length} active):
${budgetUtilization.length > 0 ? budgetUtilization.map(b => `• ${b}`).join('\n') : '• No budgets set yet'}

� RECURRING OBLIGATIONS (${context.recurringObligations?.count || 0} active):
${context.recurringObligations && context.recurringObligations.count > 0
  ? `• Monthly Commitment: $${context.recurringObligations.monthlyTotal.toFixed(2)}
${context.recurringObligations.breakdown.map(r => 
  `• ${r.category}: $${r.amount.toFixed(2)} ${r.frequency.toLowerCase()} (next: ${new Date(r.nextDate).toLocaleDateString()})`
).join('\n')}`
  : '• No recurring transactions set up'}

�📌 RECENT ACTIVITY (Last 10 Transactions):
${context.recentTransactions.length > 0
  ? context.recentTransactions
      .map(
        (t, i) =>
          `${i + 1}. ${new Date(t.date).toLocaleDateString()} - ${t.type} | ${t.category} | $${t.amount.toFixed(2)}${t.description ? ` | "${t.description}"` : ''}`
      )
      .join("\n")
  : '• No recent transactions'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YOUR CAPABILITIES AS AI ASSISTANT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ ANALYSIS YOU CAN PROVIDE:
• Detailed spending pattern insights
• Budget performance analysis (utilization %, overspending alerts)
• Category-specific breakdowns with trends
• Income vs. expense comparisons
• Savings opportunities identification
• Recurring transaction detection
• Month-over-month comparisons
• Anomaly detection (unusual transactions)

✅ RECOMMENDATIONS YOU CAN MAKE:
• Specific budget adjustments based on actual spending
• Category reallocation suggestions
• Savings goals with realistic timelines
• Expense reduction strategies (e.g., "Cut dining by $100/month")
• Income optimization ideas
• Emergency fund planning
• Debt reduction strategies

✅ COMMUNICATION GUIDELINES:
• Be conversational, empathetic, and encouraging
• Use EXACT numbers from the user's data (never estimate)
• Provide context: "Last month you spent X on Y"
• Use emojis sparingly for visual clarity (📊 💰 ⚠️ ✅)
• Format lists with bullet points
• Highlight achievements: "Great! You're 20% under budget"
• Ask clarifying questions if the request is ambiguous
• Reference specific transactions when helpful
• Suggest actionable next steps

✅ EXAMPLE RESPONSES:
Q: "How much did I spend on dining?"
A: Provide exact amount from spendingByCategory, include transaction count from categoryFrequency, compare to budget if exists

Q: "What are my top expenses?"
A: List top 5 categories with amounts and percentages of total spending

Q: "Give me savings tips"
A: Analyze categories over budget, suggest specific reductions, calculate potential monthly savings

Q: "Am I over budget?"
A: List budgets, show utilization percentages, flag overages, calculate total variance

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Respond naturally, specifically, and helpfully. Use the user's actual data to provide personalized insights.`;
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

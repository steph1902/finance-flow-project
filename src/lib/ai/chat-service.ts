import { getGeminiClient } from "./gemini-client";
import { getChatPrompt } from "./prompts/assistant";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { logError } from "@/lib/logger";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  userId: string;
  message: string;
  conversationHistory?: ChatMessage[];
}

interface ChatResponse {
  message: string;
  conversationId: string;
}

export async function chatWithAssistant({
  userId,
  message,
  conversationHistory = [],
}: ChatRequest): Promise<ChatResponse> {
  try {
    // Get user's financial data for context
    const [transactions, budgets, recurringTransactions] = await Promise.all([
      prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        take: 100, // Last 100 transactions for context
        select: {
          amount: true,
          category: true,
          description: true,
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
      prisma.recurringTransaction.findMany({
        where: { userId, isActive: true },
        select: {
          amount: true,
          category: true,
          frequency: true,
          nextDate: true,
          type: true,
        },
      }),
    ]);

    // Calculate spending by category
    const spendingByCategory = transactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((acc: Record<string, number>, t) => {
        acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
        return acc;
      }, {});

    // Calculate upcoming recurring obligations
    const monthlyRecurringTotal = recurringTransactions
      .filter((r) => r.type === "EXPENSE")
      .reduce((sum, r) => {
        const multiplier =
          r.frequency === "DAILY" ? 30 :
            r.frequency === "WEEKLY" ? 4 :
              r.frequency === "BIWEEKLY" ? 2 :
                r.frequency === "MONTHLY" ? 1 :
                  r.frequency === "QUARTERLY" ? 0.33 :
                    r.frequency === "YEARLY" ? 0.083 : 0;
        return sum + (Number(r.amount) * multiplier);
      }, 0);

    // Build context for AI
    const financialContext = {
      totalTransactions: transactions.length,
      totalSpending: transactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum: number, t) => sum + Number(t.amount), 0),
      totalIncome: transactions
        .filter((t) => t.type === "INCOME")
        .reduce((sum: number, t) => sum + Number(t.amount), 0),
      spendingByCategory,
      budgets: budgets.map((b) => ({
        category: b.category,
        amount: Number(b.amount),
        period: `${b.month}/${b.year}`,
      })),
      recentTransactions: transactions.slice(0, 10).map((t) => ({
        amount: Number(t.amount),
        category: t.category,
        description: t.description || "",
        date: t.date.toISOString(),
        type: t.type,
      })),
      recurringObligations: {
        count: recurringTransactions.length,
        monthlyTotal: monthlyRecurringTotal,
        breakdown: recurringTransactions.map((r) => ({
          category: r.category,
          amount: Number(r.amount),
          frequency: r.frequency,
          nextDate: r.nextDate.toISOString(),
          type: r.type,
        })),
      },
    };

    // Get AI prompt with financial context
    const systemPrompt = getChatPrompt(financialContext);

    // Build conversation history for Gemini
    const conversationForAI = conversationHistory.map((msg) => ({
      role: msg.role === "user" ? ("user" as const) : ("model" as const),
      parts: [{ text: msg.content }],
    }));

    // Add current user message
    conversationForAI.push({
      role: "user",
      parts: [{ text: message }],
    });

    // Get AI response - build prompt with conversation
    const fullPrompt = `${systemPrompt}\n\nConversation:\n${conversationForAI
      .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.parts[0]?.text ?? ''}`)
      .join("\n")}`;

    let aiResponse: string;
    try {
      // Use factory to get client with user's specific API key
      const gemini = await getGeminiClient(userId);
      aiResponse = await gemini.generateContentWithRetry(fullPrompt);
    } catch (aiError) {
      logError("Gemini API error in chat service", aiError);
      aiResponse = "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.";
    }

    const responseText = aiResponse || "I'm sorry, I couldn't process that request.";

    // Store conversation in database - generate UUIDs for database
    const conversationId = randomUUID();

    await Promise.all([
      prisma.aIChatHistory.create({
        data: {
          userId,
          conversationId,
          role: "user",
          message,
        },
      }),
      prisma.aIChatHistory.create({
        data: {
          userId,
          conversationId,
          role: "assistant",
          message: responseText,
        },
      }),
    ]);

    return {
      message: responseText,
      conversationId,
    };
  } catch (error) {
    logError("Chat service error", error, { userId });
    throw new Error("Failed to process chat message");
  }
}

export async function getConversationHistory(
  userId: string,
  conversationId: string
): Promise<ChatMessage[]> {
  const history = await prisma.aIChatHistory.findMany({
    where: {
      userId,
      conversationId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return history.map((msg) => ({
    role: msg.role as "user" | "assistant",
    content: msg.message,
  }));
}

export async function getUserConversations(userId: string) {
  const conversations = await prisma.aIChatHistory.groupBy({
    by: ["conversationId"],
    where: { userId },
    _count: {
      conversationId: true,
    },
    orderBy: {
      _count: {
        conversationId: "desc",
      },
    },
  });

  return conversations;
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logError, logInfo } from "@/lib/logger";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    logInfo("Data export requested", { email: session.user.email });

    // Fetch all user data
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        transactions: {
          orderBy: { date: "desc" },
          where: { deletedAt: null },
        },
        budgets: {
          orderBy: { createdAt: "desc" },
        },
        recurringTransactions: {
          orderBy: { createdAt: "desc" },
        },
        aiSuggestions: {
          orderBy: { createdAt: "desc" },
        },
        aiChatHistory: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Remove sensitive data (password hash)
    const exportData = {
      profile: {
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      transactions: user.transactions.map((t) => ({
        id: t.id,
        amount: t.amount.toString(),
        category: t.category,
        description: t.description,
        notes: t.notes,
        date: t.date,
        type: t.type,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
      })),
      budgets: user.budgets.map((b) => ({
        id: b.id,
        category: b.category,
        amount: b.amount.toString(),
        month: b.month,
        year: b.year,
        createdAt: b.createdAt,
        updatedAt: b.updatedAt,
      })),
      recurringTransactions: user.recurringTransactions.map((r) => ({
        id: r.id,
        amount: r.amount.toString(),
        category: r.category,
        description: r.description,
        notes: r.notes,
        type: r.type,
        frequency: r.frequency,
        nextDate: r.nextDate,
        startDate: r.startDate,
        endDate: r.endDate,
        isActive: r.isActive,
        lastGenerated: r.lastGenerated,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      })),
      aiSuggestions: user.aiSuggestions.map((s) => ({
        id: s.id,
        suggestionType: s.suggestionType,
        suggestedValue: s.suggestedValue,
        confidenceScore: s.confidenceScore?.toString(),
        accepted: s.accepted,
        metadata: s.metadata,
        createdAt: s.createdAt,
      })),
      aiChatHistory: user.aiChatHistory.map((c) => ({
        id: c.id,
        conversationId: c.conversationId,
        role: c.role,
        message: c.message,
        metadata: c.metadata,
        createdAt: c.createdAt,
      })),
      exportMetadata: {
        exportedAt: new Date().toISOString(),
        version: "1.0",
        totalTransactions: user.transactions.length,
        totalBudgets: user.budgets.length,
        totalRecurring: user.recurringTransactions.length,
      },
    };

    logInfo("Data export completed", {
      email: session.user.email,
      transactionCount: user.transactions.length,
    });

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="financeflow-data-${new Date().toISOString().split("T")[0]}.json"`,
      },
    });
  } catch (error) {
    logError("Data export failed", error);
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}

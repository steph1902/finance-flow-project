import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current month's usage
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      transactionCount,
      aiRequestCount,
      budgetCount,
    ] = await Promise.all([
      prisma.transaction.count({
        where: {
          userId: session.user.id,
          date: { gte: startOfMonth },
        },
      }),
      prisma.aIChatHistory.count({
        where: {
          userId: session.user.id,
          createdAt: { gte: startOfMonth },
        },
      }),
      prisma.budget.count({
        where: { userId: session.user.id },
      }),
    ]);

    return NextResponse.json({
      transactions: transactionCount,
      aiRequests: aiRequestCount,
      goals: 0, // TODO: Add goals count when Goal model is available
      budgets: budgetCount,
      sharedBudgets: 0, // TODO: Add shared budgets count when available
      reports: 0, // TODO: Add reports count when Report model is available
    });
  } catch (error) {
    console.error('Usage fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch usage' }, { status: 500 });
  }
}

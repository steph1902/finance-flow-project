import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Weekly Summary Cron Job
 * Runs every Sunday at 8 AM UTC
 * Vercel Cron: 0 8 * * 0
 * 
 * Sends weekly financial summary to users
 */
export async function GET(request: Request) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get all users
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true },
    });

    let summariesCreated = 0;

    for (const user of users) {
      // Get week's transactions
      const transactions = await prisma.transaction.findMany({
        where: {
          userId: user.id,
          deletedAt: null,
          date: {
            gte: oneWeekAgo,
            lt: now,
          },
        },
      });

      // Calculate stats
      const totalIncome = transactions
        .filter((t) => t.type === 'INCOME')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const totalExpenses = transactions
        .filter((t) => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const netSavings = totalIncome - totalExpenses;

      // Top spending categories
      const categoryTotals: Record<string, number> = {};
      transactions
        .filter((t) => t.type === 'EXPENSE')
        .forEach((t) => {
          categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Number(t.amount);
        });

      const topCategories = Object.entries(categoryTotals)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3);

      // Create weekly summary notification
      let summaryMessage = `This week: `;
      summaryMessage += `${transactions.length} transaction${transactions.length !== 1 ? 's' : ''}, `;
      summaryMessage += `$${totalExpenses.toFixed(2)} spent`;

      if (totalIncome > 0) {
        summaryMessage += `, $${totalIncome.toFixed(2)} earned`;
      }

      if (netSavings > 0) {
        summaryMessage += `. Net savings: $${netSavings.toFixed(2)} ✅`;
      } else if (netSavings < 0) {
        summaryMessage += `. Deficit: $${Math.abs(netSavings).toFixed(2)} ⚠️`;
      }

      if (topCategories.length > 0) {
        const topCategory = topCategories[0];
        if (topCategory) {
          summaryMessage += `. Top category: ${topCategory[0]} ($${topCategory[1].toFixed(2)})`;
        }
      }

      await prisma.notification.create({
        data: {
          userId: user.id,
          type: 'SYSTEM',
          title: 'Weekly Financial Summary',
          message: summaryMessage,
          priority: 0, // Low priority
          status: 'UNREAD',
          metadata: {},
          actionUrl: '/dashboard',
        },
      });

      summariesCreated++;

      // TODO: Send email using Resend (when email feature is implemented)
      // await sendWeeklySummaryEmail(user.email, {
      //   totalIncome,
      //   totalExpenses,
      //   netSavings,
      //   topCategories,
      //   transactionCount: transactions.length,
      // });
    }

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      stats: {
        usersProcessed: users.length,
        summariesCreated,
        weekRange: {
          from: oneWeekAgo.toISOString(),
          to: now.toISOString(),
        },
      },
    });
  } catch (error) {
    console.error('Weekly summary cron job failed:', error);
    return NextResponse.json(
      { error: 'Cron job failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

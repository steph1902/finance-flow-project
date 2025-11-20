import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createNotification } from '@/lib/services/notification-service';

/**
 * Daily Cron Job - Budget Alerts & Bill Reminders
 * Runs every day at 9 AM UTC
 * Vercel Cron: 0 9 * * *
 */
export async function GET(request: Request) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Get all users
    const users = await prisma.user.findMany({
      select: { id: true, email: true },
    });

    let budgetAlertsCreated = 0;
    let billRemindersCreated = 0;

    // Check each user's budgets and recurring transactions
    for (const user of users) {
      // 1. Check Budget Alerts
      const budgets = await prisma.budget.findMany({
        where: {
          userId: user.id,
          month: currentMonth,
          year: currentYear,
        },
      });

      for (const budget of budgets) {
        // Get current spending for this category
        const spending = await prisma.transaction.aggregate({
          where: {
            userId: user.id,
            category: budget.category,
            type: 'EXPENSE',
            deletedAt: null,
            date: {
              gte: new Date(currentYear, currentMonth - 1, 1),
              lt: new Date(currentYear, currentMonth, 1),
            },
          },
          _sum: {
            amount: true,
          },
        });

        const totalSpent = Number(spending._sum.amount || 0);
        const budgetAmount = Number(budget.amount);
        const percentage = (totalSpent / budgetAmount) * 100;

        // Alert at 90% and 100%
        if (percentage >= 90 && percentage < 100) {
          await createNotification({
            userId: user.id,
            type: 'BUDGET_ALERT',
            title: `Budget Alert: ${budget.category}`,
            message: `You've used ${Math.round(percentage)}% of your ${budget.category} budget ($${totalSpent.toFixed(2)} of $${budgetAmount.toFixed(2)})`,
            priority: 2, // High priority
            actionUrl: '/budgets',
          });
          budgetAlertsCreated++;
        } else if (percentage >= 100) {
          await createNotification({
            userId: user.id,
            type: 'BUDGET_ALERT',
            title: `Budget Exceeded: ${budget.category}`,
            message: `You've exceeded your ${budget.category} budget by $${(totalSpent - budgetAmount).toFixed(2)}`,
            priority: 2, // High priority
            actionUrl: '/budgets',
          });
          budgetAlertsCreated++;
        }
      }

      // 2. Check Bill Reminders (3 days before due date)
      const threeDaysFromNow = new Date(now);
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

      const upcomingBills = await prisma.recurringTransaction.findMany({
        where: {
          userId: user.id,
          type: 'EXPENSE',
          isActive: true,
          nextDate: {
            gte: now,
            lte: threeDaysFromNow,
          },
        },
      });

      for (const bill of upcomingBills) {
        // Check if we already sent a reminder for this bill recently
        const recentNotifications = await prisma.notification.count({
          where: {
            userId: user.id,
            type: 'BILL_REMINDER',
            message: {
              contains: bill.description || '',
            },
            createdAt: {
              gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
            },
          },
        });

        if (recentNotifications === 0) {
          const daysUntil = Math.ceil(
            (new Date(bill.nextDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          );

          await createNotification({
            userId: user.id,
            type: 'BILL_REMINDER',
            title: `Upcoming Bill: ${bill.description}`,
            message: `${bill.description || 'Bill'} of $${Number(bill.amount).toFixed(2)} is due in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`,
            priority: 1, // Medium priority
            actionUrl: '/recurring',
          });
          billRemindersCreated++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      stats: {
        usersChecked: users.length,
        budgetAlertsCreated,
        billRemindersCreated,
      },
    });
  } catch (error) {
    console.error('Daily cron job failed:', error);
    return NextResponse.json(
      { error: 'Cron job failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

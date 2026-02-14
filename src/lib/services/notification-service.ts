/**
 * Notification Service
 *
 * Manages in-app notifications and email alerts for:
 * - Budget alerts (90%+ usage)
 * - Bill reminders
 * - Goal milestones
 * - Anomaly detection
 * - System notifications
 */

import { prisma } from "@/lib/prisma";
import { Prisma, Notification } from "@prisma/client";
import { logger } from "@/lib/logger";
import { ENV } from "@/lib/env";

export interface CreateNotificationInput {
  userId: string;
  type:
    | "BUDGET_ALERT"
    | "BILL_REMINDER"
    | "GOAL_MILESTONE"
    | "ANOMALY_DETECTION"
    | "SUBSCRIPTION_RENEWAL"
    | "SYSTEM";
  title: string;
  message: string;
  priority?: number;
  metadata?: Record<string, unknown>;
  actionUrl?: string;
}

/**
 * Create a new notification
 */
export async function createNotification(input: CreateNotificationInput) {
  try {
    const notificationData: Prisma.NotificationCreateInput = {
      user: { connect: { id: input.userId } },
      type: input.type,
      title: input.title,
      message: input.message,
      priority: input.priority || 0,
      metadata: (input.metadata || {}) as Prisma.InputJsonValue,
      status: "UNREAD",
    };

    if (input.actionUrl) notificationData.actionUrl = input.actionUrl;

    const notification = await prisma.notification.create({
      data: notificationData,
    });

    logger.info("Notification created", {
      notificationId: notification.id,
      type: input.type,
    });

    // Send email if Resend is configured and priority is high
    if (ENV.RESEND_API_KEY && input.priority && input.priority >= 2) {
      await sendEmailNotification(notification);
    }

    return notification;
  } catch (error) {
    logger.error("Failed to create notification", error);
    throw new Error("Failed to create notification");
  }
}

/**
 * Send email notification using Resend
 */
async function sendEmailNotification(notification: Notification) {
  if (!ENV.RESEND_API_KEY) {
    logger.warn("Resend API key not configured, skipping email");
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: notification.userId },
      select: { email: true, name: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Dynamic import to avoid build-time issues
    const { Resend } = await import("resend");
    const resend = new Resend(ENV.RESEND_API_KEY);

    await resend.emails.send({
      from: ENV.RESEND_FROM_EMAIL,
      to: user.email,
      subject: notification.title,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">${notification.title}</h2>
          <p style="color: #666; line-height: 1.6;">${notification.message}</p>
          ${
            notification.actionUrl
              ? `
            <a href="${notification.actionUrl}" 
               style="display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin-top: 16px;">
              View Details
            </a>
          `
              : ""
          }
          <hr style="margin: 32px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px;">
            You received this email because you have notifications enabled for FinanceFlow.
            <br>
            <a href="${ENV.NEXTAUTH_URL}/settings" style="color: #4F46E5;">Manage notification preferences</a>
          </p>
        </div>
      `,
    });

    logger.info("Email notification sent", {
      userId: notification.userId,
      type: notification.type,
    });
  } catch (error) {
    logger.error("Failed to send email notification", error);
    // Don't throw - email is optional
  }
}

/**
 * Get user notifications
 */
export async function getUserNotifications(
  userId: string,
  status?: "UNREAD" | "READ" | "ARCHIVED",
  limit = 50,
) {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
        ...(status && { status }),
      },
      orderBy: [{ priority: "desc" }, { sentAt: "desc" }],
      take: limit,
    });

    return notifications;
  } catch (error) {
    logger.error("Failed to get notifications", error);
    throw new Error("Failed to get notifications");
  }
}

/**
 * Mark notification as read
 */
export async function markAsRead(notificationId: string, userId: string) {
  try {
    const notification = await prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: {
        status: "READ",
        readAt: new Date(),
      },
    });

    if (notification.count === 0) {
      throw new Error("Notification not found");
    }

    return { success: true };
  } catch (error) {
    logger.error("Failed to mark notification as read", error);
    throw new Error("Failed to mark notification as read");
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(userId: string) {
  try {
    await prisma.notification.updateMany({
      where: { userId, status: "UNREAD" },
      data: {
        status: "READ",
        readAt: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    logger.error("Failed to mark all as read", error);
    throw new Error("Failed to mark all as read");
  }
}

/**
 * Delete notification
 */
export async function deleteNotification(
  notificationId: string,
  userId: string,
) {
  try {
    const result = await prisma.notification.deleteMany({
      where: { id: notificationId, userId },
    });

    if (result.count === 0) {
      throw new Error("Notification not found");
    }

    return { success: true };
  } catch (error) {
    logger.error("Failed to delete notification", error);
    throw new Error("Failed to delete notification");
  }
}

/**
 * Check budget alerts and create notifications
 */
export async function checkBudgetAlerts(
  userId: string,
  month: number,
  year: number,
) {
  try {
    const budgets = await prisma.budget.findMany({
      where: { userId, month, year },
    });

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        type: "EXPENSE",
        date: {
          gte: new Date(year, month - 1, 1),
          lt: new Date(year, month, 1),
        },
        deletedAt: null,
      },
    });

    for (const budget of budgets) {
      const spent = transactions
        .filter((tx) => tx.category === budget.category)
        .reduce((sum, tx) => sum + Number(tx.amount), 0);

      const percentage = (spent / Number(budget.amount)) * 100;

      // Alert at 90% and 100%
      if (percentage >= 90 && percentage < 100) {
        await createNotification({
          userId,
          type: "BUDGET_ALERT",
          title: `Budget Alert: ${budget.category}`,
          message: `You've used ${percentage.toFixed(0)}% of your ${budget.category} budget this month.`,
          priority: 1,
          metadata: {
            budgetId: budget.id,
            percentage,
            spent,
            budget: Number(budget.amount),
          },
          actionUrl: `/dashboard/budgets`,
        });
      } else if (percentage >= 100) {
        await createNotification({
          userId,
          type: "BUDGET_ALERT",
          title: `Budget Exceeded: ${budget.category}`,
          message: `You've exceeded your ${budget.category} budget by ${(percentage - 100).toFixed(0)}%.`,
          priority: 2,
          metadata: {
            budgetId: budget.id,
            percentage,
            spent,
            budget: Number(budget.amount),
          },
          actionUrl: `/dashboard/budgets`,
        });
      }
    }

    logger.info("Budget alerts checked", { userId, month, year });
  } catch (error) {
    logger.error("Failed to check budget alerts", error);
  }
}

/**
 * Check upcoming recurring transactions and create bill reminders
 */
export async function checkBillReminders(userId: string) {
  try {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const upcomingBills = await prisma.recurringTransaction.findMany({
      where: {
        userId,
        isActive: true,
        type: "EXPENSE",
        nextDate: {
          gte: new Date(),
          lte: threeDaysFromNow,
        },
      },
    });

    for (const bill of upcomingBills) {
      await createNotification({
        userId,
        type: "BILL_REMINDER",
        title: "Upcoming Bill Reminder",
        message: `${bill.description || bill.category} of $${Number(bill.amount).toFixed(2)} is due soon.`,
        priority: 1,
        metadata: {
          recurringTxId: bill.id,
          amount: Number(bill.amount),
          dueDate: bill.nextDate,
        },
        actionUrl: `/dashboard/recurring`,
      });
    }

    logger.info("Bill reminders checked", {
      userId,
      count: upcomingBills.length,
    });
  } catch (error) {
    logger.error("Failed to check bill reminders", error);
  }
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(userId: string): Promise<number> {
  try {
    const count = await prisma.notification.count({
      where: { userId, status: "UNREAD" },
    });
    return count;
  } catch (error) {
    logger.error("Failed to get unread count", error);
    return 0;
  }
}

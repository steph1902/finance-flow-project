import { NextResponse } from "next/server";
import { getErrorMessage } from "@/lib/utils/error";
import { PrismaClient, NotificationType } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Security: Only allow seeding if admin password is set
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(request: Request) {
  try {
    // Authenticate
    const { password } = await request.json();

    if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("🌱 Starting database seed...");

    // Create demo user
    const hashedPassword = await bcrypt.hash("Demo1234", 10);
    const demoUser = await prisma.user.upsert({
      where: { email: "demo@financeflow.com" },
      update: { name: "Alex Johnson" },
      create: {
        email: "demo@financeflow.com",
        name: "Alex Johnson",
        password: hashedPassword,
      },
    });

    // Clear existing demo data
    await prisma.transaction.deleteMany({ where: { userId: demoUser.id } });
    await prisma.budget.deleteMany({ where: { userId: demoUser.id } });
    await prisma.goal.deleteMany({ where: { userId: demoUser.id } });
    await prisma.notification.deleteMany({ where: { userId: demoUser.id } });

    // Simplified demo data (subset for quick seeding)
    const transactions = [];

    // Income - bi-weekly salary for 3 months
    for (let month = 0; month < 3; month++) {
      transactions.push({
        userId: demoUser.id,
        amount: 3250,
        type: "INCOME" as const,
        category: "Salary",
        description: "Direct Deposit - Acme Technologies",
        date: new Date(
          new Date().getFullYear(),
          new Date().getMonth() - month,
          1,
        ),
      });
      transactions.push({
        userId: demoUser.id,
        amount: 3250,
        type: "INCOME" as const,
        category: "Salary",
        description: "Direct Deposit - Acme Technologies",
        date: new Date(
          new Date().getFullYear(),
          new Date().getMonth() - month,
          15,
        ),
      });
    }

    // Expenses - Monthly bills
    for (let month = 0; month < 3; month++) {
      transactions.push(
        {
          userId: demoUser.id,
          amount: 2150,
          type: "EXPENSE" as const,
          category: "Housing",
          description: "Monthly Rent",
          date: new Date(
            new Date().getFullYear(),
            new Date().getMonth() - month,
            1,
          ),
        },
        {
          userId: demoUser.id,
          amount: 120,
          type: "EXPENSE" as const,
          category: "Utilities",
          description: "Electric Bill",
          date: new Date(
            new Date().getFullYear(),
            new Date().getMonth() - month,
            8,
          ),
        },
        {
          userId: demoUser.id,
          amount: 80,
          type: "EXPENSE" as const,
          category: "Utilities",
          description: "Internet",
          date: new Date(
            new Date().getFullYear(),
            new Date().getMonth() - month,
            5,
          ),
        },
        {
          userId: demoUser.id,
          amount: 142,
          type: "EXPENSE" as const,
          category: "Transportation",
          description: "Car Insurance",
          date: new Date(
            new Date().getFullYear(),
            new Date().getMonth() - month,
            22,
          ),
        },
      );

      // Groceries (weekly)
      for (let week = 0; week < 4; week++) {
        transactions.push({
          userId: demoUser.id,
          amount: Math.floor(Math.random() * 50) + 60,
          type: "EXPENSE" as const,
          category: "Groceries",
          description: ["Whole Foods", "Trader Joes", "Safeway"][week % 3],
          date: new Date(
            new Date().getFullYear(),
            new Date().getMonth() - month,
            7 * week + 3,
          ),
        });
      }

      // Dining out
      for (let i = 0; i < 8; i++) {
        transactions.push({
          userId: demoUser.id,
          amount: Math.floor(Math.random() * 30) + 15,
          type: "EXPENSE" as const,
          category: "Dining",
          description: ["Chipotle", "Starbucks", "Panera Bread", "Local Cafe"][
            i % 4
          ],
          date: new Date(
            new Date().getFullYear(),
            new Date().getMonth() - month,
            Math.floor(Math.random() * 28) + 1,
          ),
        });
      }
    }

    // Insert transactions in batches
    await prisma.transaction.createMany({ data: transactions });

    // Create budgets for current month
    const budgets = [
      { category: "Housing", amount: 2300 },
      { category: "Utilities", amount: 400 },
      { category: "Groceries", amount: 600 },
      { category: "Dining", amount: 350 },
      { category: "Transportation", amount: 500 },
      { category: "Entertainment", amount: 300 },
      { category: "Shopping", amount: 400 },
    ];

    const currentDate = new Date();
    for (const budget of budgets) {
      await prisma.budget.upsert({
        where: {
          userId_category_month_year: {
            userId: demoUser.id,
            category: budget.category,
            month: currentDate.getMonth() + 1,
            year: currentDate.getFullYear(),
          },
        },
        update: {},
        create: {
          userId: demoUser.id,
          category: budget.category,
          amount: budget.amount,
          month: currentDate.getMonth() + 1,
          year: currentDate.getFullYear(),
        },
      });
    }

    // Create goals
    const goals = [
      {
        name: "Emergency Fund",
        target: 25000,
        current: 18500,
        category: "Savings",
      },
      {
        name: "New Car Down Payment",
        target: 12000,
        current: 7800,
        category: "Transportation",
      },
      {
        name: "Vacation Fund",
        target: 8000,
        current: 3200,
        category: "Entertainment",
      },
    ];

    for (const goal of goals) {
      await prisma.goal.create({
        data: {
          userId: demoUser.id,
          name: goal.name,
          targetAmount: goal.target,
          currentAmount: goal.current,
          targetDate: new Date(new Date().getFullYear() + 1, 11, 31),
          category: goal.category,
        },
      });
    }

    // Create notifications
    const notifications = [
      {
        type: "BUDGET_ALERT",
        title: "Dining Budget Warning",
        message: "You've used 85% of your monthly dining budget.",
      },
      {
        type: "GOAL_MILESTONE",
        title: "Goal Progress",
        message: "Great job! Emergency Fund is now 74% complete.",
      },
      {
        type: "SYSTEM",
        title: "Welcome to FinanceFlow",
        message: "Your demo account is set up!",
      },
    ];

    for (const notif of notifications) {
      await prisma.notification.create({
        data: {
          userId: demoUser.id,
          type: notif.type as NotificationType,
          title: notif.title,
          message: notif.message,
          // status: 'UNREAD',
        },
      });
    }

    console.log("✅ Seed completed successfully");

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      stats: {
        transactions: transactions.length,
        budgets: budgets.length,
        goals: goals.length,
        notifications: notifications.length,
      },
    });
  } catch (error) {
    console.error("❌ Seed error:", error);
    return NextResponse.json(
      {
        error: "Seeding failed",
        details:
          error instanceof Error ? getErrorMessage(error) : "Unknown error",
      },
      { status: 500 },
    );
  }
}

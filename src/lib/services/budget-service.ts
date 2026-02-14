import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { BudgetInput } from "@/lib/validations";
import { logger } from "@/lib/logger";
import { startOfMonth, endOfMonth } from "date-fns";

/**
 * Get budgets for a specific month/year with spending progress
 * Calculates spending progress based on transactions for the period.
 *
 * @param {string} userId - The ID of the user.
 * @param {number} month - The month number (1-12).
 * @param {number} year - The full year (e.g., 2024).
 * @returns {Promise<Array<Budget & { spent: number; remaining: number; progress: number }>>} List of budgets with progress metrics.
 * @throws {Error} If database query fails.
 */
export async function getBudgets(userId: string, month: number, year: number) {
  try {
    const periodStart = startOfMonth(new Date(year, month - 1));
    const periodEnd = endOfMonth(periodStart);

    const budgets = await prisma.budget.findMany({
      where: { userId, month, year },
      orderBy: { category: "asc" },
    });

    const spendingByCategory = await prisma.transaction.groupBy({
      by: ["category"],
      where: {
        userId,
        deletedAt: null,
        type: "EXPENSE",
        date: {
          gte: periodStart,
          lte: periodEnd,
        },
      },
      _sum: { amount: true },
    });

    const spendingMap = new Map<string, number>();
    spendingByCategory.forEach((item) => {
      spendingMap.set(item.category, Number(item._sum.amount ?? 0));
    });

    return budgets.map((budget) => {
      const amount = Number(budget.amount);
      const spent = spendingMap.get(budget.category) ?? 0;
      const remaining = Math.max(amount - spent, 0);
      const progress = amount === 0 ? 0 : Math.min((spent / amount) * 100, 100);

      return {
        ...budget,
        amount, // Return as number for frontend
        spent,
        remaining,
        progress,
      };
    });
  } catch (error: unknown) {
    logger.error("Failed to fetch budgets", error);
    throw new Error("Failed to fetch budgets");
  }
}

/**
 * Create a new budget for a category in a specific month
 *
 * @param {string} userId - The ID of the user.
 * @param {BudgetInput} data - The budget data (category, amount, month, year).
 * @returns {Promise<Budget>} The created budget.
 * @throws {Error} If budget for category/month already exists or creation fails.
 */
export async function createBudget(userId: string, data: BudgetInput) {
  try {
    const { amount, ...rest } = data;

    const budget = await prisma.budget.create({
      data: {
        ...rest,
        amount: new Prisma.Decimal(amount),
        userId,
      },
    });

    logger.info("Budget created", { userId, budgetId: budget.id });
    return budget;
  } catch (error: unknown) {
    logger.error("Failed to create budget", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error(
        "Budget for this category already exists for the selected month",
      );
    }

    throw new Error("Failed to create budget");
  }
}

/**
 * Update an existing budget
 *
 * @param {string} userId - The ID of the owner.
 * @param {string} budgetId - The ID of the budget to update.
 * @param {Partial<BudgetInput>} data - The fields to update.
 * @returns {Promise<Budget>} The updated budget.
 * @throws {Error} If budget not found or update fails.
 */
export async function updateBudget(
  userId: string,
  budgetId: string,
  data: Partial<BudgetInput>,
) {
  try {
    const existing = await prisma.budget.findFirst({
      where: { id: budgetId, userId },
    });

    if (!existing) {
      throw new Error("Budget not found");
    }

    const { amount, ...rest } = data;

    const budget = await prisma.budget.update({
      where: { id: budgetId },
      data: {
        ...rest,
        ...(amount !== undefined && { amount: new Prisma.Decimal(amount) }),
      },
    });

    logger.info("Budget updated", { userId, budgetId });
    return budget;
  } catch (error: unknown) {
    logger.error("Failed to update budget", error);
    if (error instanceof Error && error.message === "Budget not found") {
      throw error;
    }
    throw new Error("Failed to update budget");
  }
}

/**
 * Delete a budget
 *
 * @param {string} userId - The ID of the owner.
 * @param {string} budgetId - The ID of the budget to delete.
 * @returns {Promise<void>}
 * @throws {Error} If budget not found or delete fails.
 */
export async function deleteBudget(userId: string, budgetId: string) {
  try {
    const existing = await prisma.budget.findFirst({
      where: { id: budgetId, userId },
    });

    if (!existing) {
      throw new Error("Budget not found");
    }

    await prisma.budget.delete({
      where: { id: budgetId },
    });

    logger.info("Budget deleted", { userId, budgetId });
  } catch (error: unknown) {
    logger.error("Failed to delete budget", error);
    if (error instanceof Error && error.message === "Budget not found") {
      throw error;
    }
    throw new Error("Failed to delete budget");
  }
}

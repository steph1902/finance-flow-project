import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { TransactionFilters, TransactionInput } from "@/lib/validations";
import { logger } from "@/lib/logger";

const transactionSelect = {
  id: true,
  userId: true,
  amount: true,
  type: true,
  category: true,
  description: true,
  notes: true,
  date: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.TransactionSelect;

export type TransactionWithdecimals = Prisma.TransactionGetPayload<{
  select: typeof transactionSelect;
}>;

/**
 * Get transactions with comprehensive filtering and pagination
 *
 * @param {string} userId - The ID of the user.
 * @param {TransactionFilters} filters - Filter criteria (page, limit, type, category, dates, search).
 * @returns {Promise<{ data: TransactionWithdecimals[]; meta: { total: number; page: number; limit: number; totalPages: number } }>} Paginated transactions and metadata.
 * @throws {Error} If database query fails.
 */
export async function getTransactions(
  userId: string,
  filters: TransactionFilters,
) {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      category,
      startDate,
      endDate,
      search,
      sort = "date",
      order = "desc",
    } = filters;

    const where: Prisma.TransactionWhereInput = {
      userId,
      deletedAt: null,
    };

    if (type) {
      where.type = type;
    }

    if (category) {
      where.category = category;
    }

    if (startDate || endDate) {
      where.date = {
        ...(startDate ? { gte: startDate } : {}),
        ...(endDate ? { lte: endDate } : {}),
      };
    }

    if (search) {
      where.OR = [
        { description: { contains: search, mode: "insensitive" } },
        { notes: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [transactions, total] = await prisma.$transaction([
      prisma.transaction.findMany({
        select: transactionSelect,
        where,
        orderBy:
          sort === "amount"
            ? { amount: order }
            : sort === "date"
              ? { date: order }
              : { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ]);

    const totalPages = Math.max(Math.ceil(total / limit), 1);

    return {
      data: transactions,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  } catch (error: unknown) {
    logger.error("Failed to fetch transactions", error);
    throw new Error("Failed to fetch transactions");
  }
}

/**
 * Create a new transaction
 *
 * @param {string} userId - The ID of the user.
 * @param {TransactionInput} data - The transaction data.
 * @returns {Promise<TransactionWithdecimals>} The created transaction.
 * @throws {Error} If creation fails.
 */
export async function createTransaction(
  userId: string,
  data: TransactionInput,
) {
  try {
    const { amount, date, ...rest } = data;

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        amount: new Prisma.Decimal(amount),
        date,
        type: rest.type,
        category: rest.category,
        description: rest.description ?? null,
        notes: rest.notes ?? null,
      },
      select: transactionSelect,
    });

    logger.info("Transaction created", {
      userId,
      transactionId: transaction.id,
    });
    return transaction;
  } catch (error: unknown) {
    logger.error("Failed to create transaction", error);
    throw new Error("Failed to create transaction");
  }
}

/**
 * Get a single transaction by ID
 *
 * @param {string} userId - The ID of the owner.
 * @param {string} transactionId - The ID of the transaction.
 * @returns {Promise<TransactionWithdecimals | null>} The transaction or null if not found.
 * @throws {Error} If database query fails.
 */
export async function getTransaction(userId: string, transactionId: string) {
  try {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
        deletedAt: null,
      },
      select: transactionSelect,
    });

    if (!transaction) {
      return null;
    }

    return transaction;
  } catch (error: unknown) {
    logger.error("Failed to fetch transaction", error);
    throw new Error("Failed to fetch transaction");
  }
}

/**
 * Update a transaction
 *
 * @param {string} userId - The ID of the owner.
 * @param {string} transactionId - The ID of the transaction to update.
 * @param {Partial<TransactionInput>} data - The fields to update.
 * @returns {Promise<TransactionWithdecimals>} The updated transaction.
 * @throws {Error} If transaction not found or update fails.
 */
export async function updateTransaction(
  userId: string,
  transactionId: string,
  data: Partial<TransactionInput>,
) {
  try {
    // Verify ownership
    const existing = await getTransaction(userId, transactionId);
    if (!existing) {
      throw new Error("Transaction not found");
    }

    const { amount, ...rest } = data;

    const transaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        ...(amount !== undefined && { amount: new Prisma.Decimal(amount) }),
        ...rest,
      },
      select: transactionSelect,
    });

    logger.info("Transaction updated", { userId, transactionId });
    return transaction;
  } catch (error: unknown) {
    logger.error("Failed to update transaction", error);
    if (error instanceof Error && error.message === "Transaction not found") {
      throw error;
    }
    throw new Error("Failed to update transaction");
  }
}

/**
 * Soft delete a transaction
 *
 * @param {string} userId - The ID of the owner.
 * @param {string} transactionId - The ID of the transaction to delete.
 * @returns {Promise<void>}
 * @throws {Error} If transaction not found or delete fails.
 */
export async function deleteTransaction(userId: string, transactionId: string) {
  try {
    // Verify ownership
    const existing = await getTransaction(userId, transactionId);
    if (!existing) {
      throw new Error("Transaction not found");
    }

    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        deletedAt: new Date(),
      },
    });

    logger.info("Transaction deleted", { userId, transactionId });
  } catch (error: unknown) {
    logger.error("Failed to delete transaction", error);
    if (error instanceof Error && error.message === "Transaction not found") {
      throw error;
    }
    throw new Error("Failed to delete transaction");
  }
}

import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { RecurringTransactionInput, recurringTransactionSchema, recurringTransactionUpdateSchema } from "@/lib/validations";
import { z } from "zod";

export type RecurringTransactionUpdateInput = z.infer<typeof recurringTransactionUpdateSchema>;

/**
 * Calculate next date based on frequency
 */
export function calculateNextDate(currentDate: Date, frequency: string): Date {
    const next = new Date(currentDate);

    switch (frequency) {
        case "DAILY":
            next.setDate(next.getDate() + 1);
            break;
        case "WEEKLY":
            next.setDate(next.getDate() + 7);
            break;
        case "BIWEEKLY":
            next.setDate(next.getDate() + 14);
            break;
        case "MONTHLY":
            next.setMonth(next.getMonth() + 1);
            break;
        case "QUARTERLY":
            next.setMonth(next.getMonth() + 3);
            break;
        case "YEARLY":
            next.setFullYear(next.getFullYear() + 1);
            break;
    }

    return next;
}

/**
 * Get all recurring transactions for a user
 */
export async function getRecurringTransactions(userId: string) {
    try {
        const transactions = await prisma.recurringTransaction.findMany({
            where: { userId },
            orderBy: { nextDate: "asc" },
        });
        return transactions;
    } catch (error) {
        logger.error("Failed to fetch recurring transactions", error);
        throw new Error("Failed to fetch recurring transactions");
    }
}

/**
 * Get a single recurring transaction
 */
export async function getRecurringTransaction(userId: string, id: string) {
    try {
        const transaction = await prisma.recurringTransaction.findFirst({
            where: { id, userId },
        });
        return transaction;
    } catch (error) {
        logger.error("Failed to fetch recurring transaction", error);
        throw new Error("Failed to fetch recurring transaction");
    }
}

/**
 * Create a new recurring transaction
 */
export async function createRecurringTransaction(userId: string, data: RecurringTransactionInput) {
    try {
        const startDate = new Date(data.startDate);
        const nextDate = calculateNextDate(startDate, data.frequency);

        const transaction = await prisma.recurringTransaction.create({
            data: {
                userId,
                amount: data.amount,
                type: data.type,
                category: data.category,
                description: data.description ?? null,
                notes: data.notes ?? null,
                frequency: data.frequency,
                startDate,
                endDate: data.endDate ? new Date(data.endDate) : null,
                nextDate,
                isActive: data.isActive,
            },
        });

        logger.info("Recurring transaction created", { userId, id: transaction.id });
        return transaction;
    } catch (error) {
        logger.error("Failed to create recurring transaction", error);
        throw new Error("Failed to create recurring transaction");
    }
}

/**
 * Update a recurring transaction
 */
export async function updateRecurringTransaction(userId: string, id: string, data: RecurringTransactionUpdateInput) {
    try {
        // Use transaction to ensure ownership check and update are atomic
        const result = await prisma.$transaction(async (tx) => {
            const existing = await tx.recurringTransaction.findFirst({
                where: { id, userId },
            });

            if (!existing) {
                throw new Error("Recurring transaction not found");
            }

            // Calculate new nextDate if start date or frequency changes
            // This logic is tricky. If frequency changes, should nextDate change?
            // The API route didn't handle nextDate updates explicitly in PATCH.
            // But if startDate changes, nextDate should probably change?
            // For now, I'll follow the simple update pattern but re-calculate nextDate if frequency changes?
            // Actually, standard behavior: if you edit a recurring txn, you might just want to update metadata.
            // If you update frequency, you probably expect next occurrence to shift.
            // The previous route implementation basically ignored nextDate recalculation on update.
            // I will keep it simple for now (no auto-recalc on update) UNLESS explicitly requested.
            // Wait, if I change frequency, nextDate MIGHT need to be updated or it will stay old.
            // But usually `nextDate` is the state.

            // I'll stick to a direct update for now to match the route behavior, 
            // but ensure dates are Date objects.

            const updateData: any = { ...data };
            if (data.startDate) updateData.startDate = new Date(data.startDate);
            if (data.endDate) updateData.endDate = new Date(data.endDate);

            return await tx.recurringTransaction.update({
                where: { id },
                data: updateData,
            });
        });

        logger.info("Recurring transaction updated", { userId, id });
        return result;
    } catch (error: unknown) {
        logger.error("Failed to update recurring transaction", error);
        if (error instanceof Error && error.message === "Recurring transaction not found") {
            throw error;
        }
        throw new Error("Failed to update recurring transaction");
    }
}

/**
 * Delete a recurring transaction
 */
export async function deleteRecurringTransaction(userId: string, id: string) {
    try {
        const result = await prisma.recurringTransaction.deleteMany({
            where: { id, userId },
        });

        if (result.count === 0) {
            throw new Error("Recurring transaction not found");
        }

        logger.info("Recurring transaction deleted", { userId, id });
        return { success: true };
    } catch (error: unknown) {
        logger.error("Failed to delete recurring transaction", error);
        if (error instanceof Error && error.message === "Recurring transaction not found") {
            throw error;
        }
        throw new Error("Failed to delete recurring transaction");
    }
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withApiAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { logError } from "@/lib/logger";

// Validation schemas
const createRecurringSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string().min(1),
  description: z.string().optional(),
  notes: z.string().optional(),
  frequency: z.enum(["DAILY", "WEEKLY", "BIWEEKLY", "MONTHLY", "QUARTERLY", "YEARLY"]),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
});

// Calculate next date based on frequency
function calculateNextDate(currentDate: Date, frequency: string): Date {
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

// GET /api/recurring-transactions - List all recurring transactions
export const GET = withApiAuth(async (_req: NextRequest, userId: string) => {
  try {
    const recurringTransactions = await prisma.recurringTransaction.findMany({
      where: { userId },
      orderBy: { nextDate: "asc" },
    });

    return NextResponse.json({ recurringTransactions });
  } catch (error) {
    logError("Get recurring transactions error", error, { userId });
    return NextResponse.json(
      { error: "Failed to fetch recurring transactions" },
      { status: 500 }
    );
  }
});

// POST /api/recurring-transactions - Create new recurring transaction
export const POST = withApiAuth(async (req: NextRequest, userId: string) => {
  try {
    const body = await req.json();
    const validatedData = createRecurringSchema.parse(body);

    const startDate = new Date(validatedData.startDate);
    const nextDate = calculateNextDate(startDate, validatedData.frequency);

    const recurringTransaction = await prisma.recurringTransaction.create({
      data: {
        userId,
        amount: validatedData.amount,
        type: validatedData.type,
        category: validatedData.category,
        description: validatedData.description,
        notes: validatedData.notes,
        frequency: validatedData.frequency,
        startDate,
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
        nextDate,
      },
    });

    return NextResponse.json({ recurringTransaction }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.issues },
        { status: 400 }
      );
    }

    logError("Create recurring transaction error", error, { userId });
    return NextResponse.json(
      { error: "Failed to create recurring transaction" },
      { status: 500 }
    );
  }
});

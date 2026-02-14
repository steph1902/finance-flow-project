import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withApiAuth } from "@/lib/auth-helpers";
import { recurringTransactionSchema } from "@/lib/validations";
import {
  createRecurringTransaction,
  getRecurringTransactions,
} from "@/lib/services/recurring-transaction-service";

// Validation schemas

// GET /api/recurring-transactions - List all recurring transactions
export const GET = withApiAuth(async (_req: NextRequest, userId: string) => {
  try {
    const recurringTransactions = await getRecurringTransactions(userId);
    return NextResponse.json({ recurringTransactions });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch recurring transactions" },
      { status: 500 },
    );
  }
});

// POST /api/recurring-transactions - Create new recurring transaction
export const POST = withApiAuth(async (req: NextRequest, userId: string) => {
  try {
    const body = await req.json();
    const validatedData = recurringTransactionSchema.parse(body);

    const recurringTransaction = await createRecurringTransaction(
      userId,
      validatedData,
    );

    return NextResponse.json({ recurringTransaction }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to create recurring transaction" },
      { status: 500 },
    );
  }
});

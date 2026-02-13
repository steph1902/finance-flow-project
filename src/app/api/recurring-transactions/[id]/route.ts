import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withApiAuth } from "@/lib/auth-helpers";
import { getRecurringTransaction, updateRecurringTransaction, deleteRecurringTransaction } from "@/lib/services/recurring-transaction-service";
import { recurringTransactionUpdateSchema } from "@/lib/validations";

// GET /api/recurring-transactions/[id]
export const GET = withApiAuth(async (req: NextRequest, userId: string) => {
  try {
    const id = req.nextUrl.pathname.split("/").pop()!;

    const recurringTransaction = await getRecurringTransaction(userId, id);

    if (!recurringTransaction) {
      return NextResponse.json(
        { error: "Recurring transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ recurringTransaction });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch recurring transaction" },
      { status: 500 }
    );
  }
});

// PATCH /api/recurring-transactions/[id]
export const PATCH = withApiAuth(async (req: NextRequest, userId: string) => {
  try {
    const id = req.nextUrl.pathname.split("/").pop()!;
    const body = await req.json();
    const validatedData = recurringTransactionUpdateSchema.parse(body);

    const recurringTransaction = await updateRecurringTransaction(userId, id, validatedData);

    return NextResponse.json({ recurringTransaction });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.issues },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === "Recurring transaction not found") {
      return NextResponse.json(
        { error: "Recurring transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update recurring transaction" },
      { status: 500 }
    );
  }
});

// DELETE /api/recurring-transactions/[id]
export const DELETE = withApiAuth(async (req: NextRequest, userId: string) => {
  try {
    const id = req.nextUrl.pathname.split("/").pop()!;

    await deleteRecurringTransaction(userId, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Recurring transaction not found") {
      return NextResponse.json(
        { error: "Recurring transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete recurring transaction" },
      { status: 500 }
    );
  }
});

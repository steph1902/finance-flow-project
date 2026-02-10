import { NextRequest, NextResponse } from "next/server";
import { getErrorMessage } from '@/lib/utils/error';
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withApiAuth } from "@/lib/auth-helpers";
import { logError } from "@/lib/logger";

const updateRecurringSchema = z.object({
  amount: z.number().positive().optional(),
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  category: z.string().min(1).optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
  frequency: z.enum(["DAILY", "WEEKLY", "BIWEEKLY", "MONTHLY", "QUARTERLY", "YEARLY"]).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional().nullable(),
  isActive: z.boolean().optional(),
});

// GET /api/recurring-transactions/[id]
export const GET = withApiAuth(async (req: NextRequest, userId: string) => {
  try {
    const id = req.nextUrl.pathname.split("/").pop()!;

    const recurringTransaction = await prisma.recurringTransaction.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!recurringTransaction) {
      return NextResponse.json(
        { error: "Recurring transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ recurringTransaction });
  } catch (error) {
    logError("Get recurring transaction error", error, { userId });
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
    const validatedData = updateRecurringSchema.parse(body);

    // Use transaction to ensure ownership check and update are atomic
    const recurringTransaction = await prisma.$transaction(async (tx) => {
      // Check ownership
      const existing = await tx.recurringTransaction.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        throw new Error("NOT_FOUND");
      }

      // Build update data with explicit undefined filtering for exactOptionalPropertyTypes
      const updateData: {
        amount?: number;
        type?: "INCOME" | "EXPENSE";
        category?: string;
        description?: string;
        notes?: string;
        frequency?: "DAILY" | "WEEKLY" | "BIWEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY";
        startDate?: Date;
        endDate?: Date | null;
        isActive?: boolean;
      } = {};

      if (validatedData.amount !== undefined) updateData.amount = validatedData.amount;
      if (validatedData.type !== undefined) updateData.type = validatedData.type;
      if (validatedData.category !== undefined) updateData.category = validatedData.category;
      if (validatedData.description !== undefined) updateData.description = validatedData.description;
      if (validatedData.notes !== undefined) updateData.notes = validatedData.notes;
      if (validatedData.frequency !== undefined) updateData.frequency = validatedData.frequency;
      if (validatedData.startDate !== undefined) updateData.startDate = new Date(validatedData.startDate);
      if (validatedData.endDate !== undefined) {
        updateData.endDate = validatedData.endDate ? new Date(validatedData.endDate) : null;
      }
      if (validatedData.isActive !== undefined) updateData.isActive = validatedData.isActive;

      // Update the recurring transaction
      return await tx.recurringTransaction.update({
        where: { id },
        data: updateData,
      });
    });

    return NextResponse.json({ recurringTransaction });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.issues },
        { status: 400 }
      );
    }

    if (error instanceof Error && getErrorMessage(error) === "NOT_FOUND") {
      return NextResponse.json(
        { error: "Recurring transaction not found" },
        { status: 404 }
      );
    }

    logError("Update recurring transaction error", error, { userId });
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

    // Use transaction to ensure ownership check and delete are atomic
    await prisma.$transaction(async (tx) => {
      // Check ownership
      const existing = await tx.recurringTransaction.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        throw new Error("NOT_FOUND");
      }

      // Delete the recurring transaction
      await tx.recurringTransaction.delete({
        where: { id },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && getErrorMessage(error) === "NOT_FOUND") {
      return NextResponse.json(
        { error: "Recurring transaction not found" },
        { status: 404 }
      );
    }

    logError("Delete recurring transaction error", error, { userId });
    return NextResponse.json(
      { error: "Failed to delete recurring transaction" },
      { status: 500 }
    );
  }
});

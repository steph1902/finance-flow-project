import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

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
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recurringTransaction = await prisma.recurringTransaction.findFirst({
      where: {
        id: params.id,
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
    console.error("Get recurring transaction error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recurring transaction" },
      { status: 500 }
    );
  }
}

// PATCH /api/recurring-transactions/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = updateRecurringSchema.parse(body);

    // Check ownership
    const existing = await prisma.recurringTransaction.findFirst({
      where: { id: params.id, userId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Recurring transaction not found" },
        { status: 404 }
      );
    }

    const recurringTransaction = await prisma.recurringTransaction.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : undefined,
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : undefined,
      },
    });

    return NextResponse.json({ recurringTransaction });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Update recurring transaction error:", error);
    return NextResponse.json(
      { error: "Failed to update recurring transaction" },
      { status: 500 }
    );
  }
}

// DELETE /api/recurring-transactions/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check ownership
    const existing = await prisma.recurringTransaction.findFirst({
      where: { id: params.id, userId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Recurring transaction not found" },
        { status: 404 }
      );
    }

    await prisma.recurringTransaction.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete recurring transaction error:", error);
    return NextResponse.json(
      { error: "Failed to delete recurring transaction" },
      { status: 500 }
    );
  }
}

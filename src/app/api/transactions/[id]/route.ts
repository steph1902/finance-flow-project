import { Prisma } from "@prisma/client";
import { getErrorMessage } from '@/lib/utils/error';
import { NextRequest, NextResponse } from "next/server";

import { withApiAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { transactionUpdateSchema } from "@/lib/validations";

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

const serialize = (
  transaction: Prisma.TransactionGetPayload<{ select: typeof transactionSelect }>,
) => ({
  ...transaction,
  amount: Number(transaction.amount),
  date: transaction.date.toISOString(),
  createdAt: transaction.createdAt.toISOString(),
  updatedAt: transaction.updatedAt.toISOString(),
});

async function getTransactionOr404(id: string, userId: string) {
  const transaction = await prisma.transaction.findFirst({
    where: {
      id,
      userId,
      deletedAt: null,
    },
    select: transactionSelect,
  });

  if (!transaction) {
    return null;
  }

  return transaction;
}

export const GET = withApiAuth(async (_req: NextRequest, userId) => {
  const id = _req.nextUrl.pathname.split("/").pop()!;

  const transaction = await getTransactionOr404(id, userId);

  if (!transaction) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  return NextResponse.json({ data: serialize(transaction) });
});

export const PATCH = withApiAuth(async (req: NextRequest, userId) => {
  const id = req.nextUrl.pathname.split("/").pop()!;

  const json = await req.json();
  const parsed = transactionUpdateSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  if (Object.keys(parsed.data).length === 0) {
    return NextResponse.json(
      { error: "No updates provided" },
      { status: 400 },
    );
  }

  const { amount, date, ...rest } = parsed.data;

  try {
    // Use transaction to ensure ownership check and update are atomic
    const transaction = await prisma.$transaction(async (tx) => {
      const existing = await tx.transaction.findFirst({
        where: {
          id,
          userId,
          deletedAt: null,
        },
        select: transactionSelect,
      });

      if (!existing) {
        throw new Error("NOT_FOUND");
      }

      // Build update data with explicit undefined filtering for exactOptionalPropertyTypes
      const updateData: {
        type?: "INCOME" | "EXPENSE";
        category?: string;
        description?: string | null;
        notes?: string | null;
        amount?: Prisma.Decimal;
        date?: Date;
      } = {};

      if (rest.type !== undefined) updateData.type = rest.type;
      if (rest.category !== undefined) updateData.category = rest.category;
      if (rest.description !== undefined) updateData.description = rest.description;
      if (rest.notes !== undefined) updateData.notes = rest.notes;
      if (amount !== undefined) updateData.amount = new Prisma.Decimal(amount);
      if (date !== undefined) updateData.date = date;

      return await tx.transaction.update({
        where: { id: existing.id },
        data: updateData,
        select: transactionSelect,
      });
    });

    return NextResponse.json({
      message: "Transaction updated",
      data: serialize(transaction),
    });
  } catch (error) {
    if (error instanceof Error && getErrorMessage(error) === "NOT_FOUND") {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    throw error;
  }
});

export const DELETE = withApiAuth(async (req: NextRequest, userId) => {
  const id = req.nextUrl.pathname.split("/").pop()!;

  try {
    // Use transaction to ensure ownership check and soft delete are atomic
    await prisma.$transaction(async (tx) => {
      const existing = await tx.transaction.findFirst({
        where: {
          id,
          userId,
          deletedAt: null,
        },
        select: transactionSelect,
      });

      if (!existing) {
        throw new Error("NOT_FOUND");
      }

      await tx.transaction.update({
        where: { id: existing.id },
        data: { deletedAt: new Date() },
      });
    });

    return NextResponse.json({ message: "Transaction deleted" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && getErrorMessage(error) === "NOT_FOUND") {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    throw error;
  }
});


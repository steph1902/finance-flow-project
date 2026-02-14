import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { withApiAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { transactionQuerySchema, transactionSchema } from "@/lib/validations";
import {
  createTransaction,
  getTransactions,
} from "@/lib/services/transaction-service";

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

const serializeTransaction = (
  transaction: Prisma.TransactionGetPayload<{
    select: typeof transactionSelect;
  }>,
) => ({
  ...transaction,
  amount: Number(transaction.amount),
  date: transaction.date.toISOString(),
  createdAt: transaction.createdAt.toISOString(),
  updatedAt: transaction.updatedAt.toISOString(),
});

export const GET = withApiAuth(async (req: NextRequest, userId) => {
  const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = transactionQuerySchema.safeParse(searchParams);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const { data: transactions, meta } = await getTransactions(
      userId,
      parsed.data,
    );

    return NextResponse.json({
      data: transactions.map(serializeTransaction),
      meta,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 },
    );
  }
});

export const POST = withApiAuth(async (req: NextRequest, userId) => {
  const json = await req.json();
  const parsed = transactionSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const transaction = await createTransaction(userId, parsed.data);

    return NextResponse.json(
      {
        message: "Transaction created",
        data: serializeTransaction(transaction),
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 },
    );
  }
});

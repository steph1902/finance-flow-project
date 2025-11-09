import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { withApiAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import {
  transactionQuerySchema,
  transactionSchema,
} from "@/lib/validations";

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

const serializeTransaction = (transaction: Prisma.TransactionGetPayload<{ select: typeof transactionSelect }>) => ({
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

  const { page, limit, type, category, startDate, endDate, search, sort, order } = parsed.data;

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

  return NextResponse.json({
    data: transactions.map(serializeTransaction),
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  });
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

  const { amount, date, ...rest } = parsed.data;

  const transaction = await prisma.transaction.create({
    data: {
      ...rest,
      userId,
      amount: new Prisma.Decimal(amount),
      date,
    },
    select: transactionSelect,
  });

  return NextResponse.json(
    {
      message: "Transaction created",
      data: serializeTransaction(transaction),
    },
    { status: 201 },
  );
});


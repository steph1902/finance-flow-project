import { Prisma } from "@prisma/client";
import { endOfMonth, startOfMonth } from "date-fns";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { withApiAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

const rangeSchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

const serializeTransaction = (transaction: Prisma.TransactionGetPayload<{
  select: {
    id: true;
    amount: true;
    type: true;
    category: true;
    description: true;
    notes: true;
    date: true;
  };
}>) => ({
  ...transaction,
  amount: Number(transaction.amount),
  date: transaction.date.toISOString(),
});

export const GET = withApiAuth(async (req: NextRequest, userId) => {
  const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = rangeSchema.safeParse(searchParams);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const now = new Date();
  const start = parsed.data.startDate ?? startOfMonth(now);
  const end = parsed.data.endDate ?? endOfMonth(now);

  if (start > end) {
    return NextResponse.json(
      { error: "startDate must be before endDate" },
      { status: 400 },
    );
  }

  const where: Prisma.TransactionWhereInput = {
    userId,
    deletedAt: null,
    date: {
      gte: start,
      lte: end,
    },
  };

  const [incomeAgg, expenseAgg, transactionCount, categoryGroup, transactions, recentTransactions] =
    await prisma.$transaction([
      prisma.transaction.aggregate({
        where: { ...where, type: "INCOME" },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { ...where, type: "EXPENSE" },
        _sum: { amount: true },
      }),
      prisma.transaction.count({ where }),
      prisma.transaction.groupBy({
        by: ["category"],
        where: { ...where, type: "EXPENSE" },
        _sum: { amount: true },
        orderBy: { category: "asc" },
      }),
      prisma.transaction.findMany({
        where,
        select: {
          id: true,
          amount: true,
          type: true,
          category: true,
          date: true,
        },
        orderBy: { date: "asc" },
      }),
      prisma.transaction.findMany({
        where,
        select: {
          id: true,
          amount: true,
          type: true,
          category: true,
          description: true,
          notes: true,
          date: true,
        },
        orderBy: { date: "desc" },
        take: 10,
      }),
    ]);

  const totalIncome = Number(incomeAgg._sum.amount ?? 0);
  const totalExpenses = Number(expenseAgg._sum.amount ?? 0);
  const totalBalance = totalIncome - totalExpenses;

  const spendingByCategory = categoryGroup
    .map((item) => ({
      category: item.category,
      amount: Number(item._sum?.amount ?? 0),
    }))
    .sort((a, b) => b.amount - a.amount);

  const dailyMap = new Map<
    string,
    {
      date: string;
      income: number;
      expenses: number;
    }
  >();

  transactions.forEach((transaction) => {
    const key = transaction.date.toISOString().slice(0, 10);
    if (!dailyMap.has(key)) {
      dailyMap.set(key, {
        date: key,
        income: 0,
        expenses: 0,
      });
    }

    const entry = dailyMap.get(key)!;
    const amount = Number(transaction.amount);
    if (transaction.type === "INCOME") {
      entry.income += amount;
    } else {
      entry.expenses += amount;
    }
  });

  const dailyTrend = Array.from(dailyMap.values()).sort((a, b) => (a.date < b.date ? -1 : 1));

  return NextResponse.json({
    summary: {
      totalIncome,
      totalExpenses,
      totalBalance,
      transactionCount,
    },
    spendingByCategory,
    dailyTrend,
    recentTransactions: recentTransactions.map(serializeTransaction),
    period: {
      start: start.toISOString(),
      end: end.toISOString(),
    },
  });
});


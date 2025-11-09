import { Prisma } from "@prisma/client";
import { endOfMonth, startOfMonth } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

import { withApiAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import {
  budgetQuerySchema,
  budgetSchema,
} from "@/lib/validations";

const serializeBudget = (budget: Prisma.BudgetGetPayload<true>) => ({
  ...budget,
  amount: Number(budget.amount),
  createdAt: budget.createdAt.toISOString(),
  updatedAt: budget.updatedAt.toISOString(),
});

export const GET = withApiAuth(async (req: NextRequest, userId) => {
  const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = budgetQuerySchema.safeParse(searchParams);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const now = new Date();
  const month = parsed.data.month ?? now.getMonth() + 1;
  const year = parsed.data.year ?? now.getFullYear();

  const periodStart = startOfMonth(new Date(year, month - 1));
  const periodEnd = endOfMonth(periodStart);

  const budgets = await prisma.budget.findMany({
    where: { userId, month, year },
    orderBy: { category: "asc" },
  });

  const spendingByCategory = await prisma.transaction.groupBy({
    by: ["category"],
    where: {
      userId,
      deletedAt: null,
      type: "EXPENSE",
      date: {
        gte: periodStart,
        lte: periodEnd,
      },
    },
    _sum: { amount: true },
  });

  const spendingMap = new Map<string, number>();
  spendingByCategory.forEach((item) => {
    spendingMap.set(item.category, Number(item._sum.amount ?? 0));
  });

  const data = budgets.map((budget) => {
    const amount = Number(budget.amount);
    const spent = spendingMap.get(budget.category) ?? 0;
    const remaining = Math.max(amount - spent, 0);
    const progress = amount === 0 ? 0 : Math.min((spent / amount) * 100, 100);

    return {
      ...serializeBudget(budget),
      spent,
      remaining,
      progress,
    };
  });

  return NextResponse.json({
    data,
    period: {
      month,
      year,
      start: periodStart.toISOString(),
      end: periodEnd.toISOString(),
    },
  });
});

export const POST = withApiAuth(async (req: NextRequest, userId) => {
  const json = await req.json();
  const parsed = budgetSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { amount, ...rest } = parsed.data;

  try {
    const budget = await prisma.budget.create({
      data: {
        ...rest,
        amount: new Prisma.Decimal(amount),
        userId,
      },
    });

    return NextResponse.json(
      {
        message: "Budget created",
        data: serializeBudget(budget),
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { error: "Budget for this category already exists for the selected month" },
        { status: 409 },
      );
    }

    throw error;
  }
});


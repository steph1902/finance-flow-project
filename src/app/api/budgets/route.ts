import { Prisma } from "@prisma/client";
import { endOfMonth, startOfMonth } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

import { withApiAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { budgetQuerySchema, budgetSchema } from "@/lib/validations";
import { createBudget, getBudgets } from "@/lib/services/budget-service";

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

  try {
    const budgets = await getBudgets(userId, month, year);

    return NextResponse.json({
      data: budgets,
      period: {
        month,
        year,
        start: startOfMonth(new Date(year, month - 1)).toISOString(),
        end: endOfMonth(startOfMonth(new Date(year, month - 1))).toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch budgets" },
      { status: 500 },
    );
  }
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

  try {
    const budget = await createBudget(userId, parsed.data);

    return NextResponse.json(
      {
        message: "Budget created",
        data: serializeBudget(budget),
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("already exists")) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    return NextResponse.json(
      { error: "Failed to create budget" },
      { status: 500 },
    );
  }
});

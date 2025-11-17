import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { withApiAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { budgetUpdateSchema } from "@/lib/validations";

const serializeBudget = (budget: Prisma.BudgetGetPayload<true>) => ({
  ...budget,
  amount: Number(budget.amount),
  createdAt: budget.createdAt.toISOString(),
  updatedAt: budget.updatedAt.toISOString(),
});

export const PATCH = withApiAuth(async (req: NextRequest, userId) => {
  const id = req.nextUrl.pathname.split("/").pop()!;

  const json = await req.json();
  const parsed = budgetUpdateSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  if (Object.keys(parsed.data).length === 0) {
    return NextResponse.json({ error: "No updates provided" }, { status: 400 });
  }

  const { amount, ...rest } = parsed.data;

  try {
    // Use transaction to ensure ownership check and update are atomic
    const budget = await prisma.$transaction(async (tx) => {
      const existing = await tx.budget.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        throw new Error("NOT_FOUND");
      }

      // Build update data with explicit undefined filtering for exactOptionalPropertyTypes
      const updateData: {
        category?: string;
        month?: number;
        year?: number;
        amount?: Prisma.Decimal;
      } = {};

      if (rest.category !== undefined) updateData.category = rest.category;
      if (rest.month !== undefined) updateData.month = rest.month;
      if (rest.year !== undefined) updateData.year = rest.year;
      if (amount !== undefined) updateData.amount = new Prisma.Decimal(amount);

      return await tx.budget.update({
        where: { id: existing.id },
        data: updateData,
      });
    });

    return NextResponse.json({
      message: "Budget updated",
      data: serializeBudget(budget),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_FOUND") {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { error: "Budget for this category already exists for the selected month" },
        { status: 409 },
      );
    }

    throw error;
  }
});

export const DELETE = withApiAuth(async (req: NextRequest, userId) => {
  const id = req.nextUrl.pathname.split("/").pop()!;

  try {
    // Use transaction to ensure ownership check and delete are atomic
    await prisma.$transaction(async (tx) => {
      const existing = await tx.budget.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        throw new Error("NOT_FOUND");
      }

      await tx.budget.delete({ where: { id: existing.id } });
    });

    return NextResponse.json({ message: "Budget deleted" });
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_FOUND") {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    throw error;
  }
});


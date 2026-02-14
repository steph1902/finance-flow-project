import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { logger } from "@/lib/logger";

const createSharedBudgetSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  category: z.string(),
  amount: z.number().positive(),
  month: z.number().min(1).max(12),
  year: z.number().min(2000),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sharedBudgets = await prisma.sharedBudget.findMany({
      where: {
        OR: [
          { ownerId: session.user.id },
          {
            permissions: {
              some: {
                userId: session.user.id,
              },
            },
          },
        ],
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        permissions: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            permissions: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ sharedBudgets });
  } catch (error) {
    logger.error("Failed to fetch shared budgets", error);
    return NextResponse.json(
      { error: "Failed to fetch shared budgets" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = createSharedBudgetSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validation.error.issues },
        { status: 400 },
      );
    }

    const { name, description, category, amount, month, year } =
      validation.data;

    const sharedBudget = await prisma.sharedBudget.create({
      data: {
        name,
        ...(description !== undefined && { description }),
        category,
        amount,
        month,
        year,
        ownerId: session.user.id,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        permissions: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ sharedBudget }, { status: 201 });
  } catch (error) {
    logger.error("Failed to create shared budget", error);
    return NextResponse.json(
      { error: "Failed to create shared budget" },
      { status: 500 },
    );
  }
}

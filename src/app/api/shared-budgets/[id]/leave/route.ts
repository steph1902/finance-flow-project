import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if user has permission
    const permission = await prisma.budgetPermission.findFirst({
      where: {
        sharedBudgetId: id,
        userId: session.user.id,
      },
      include: {
        sharedBudget: true,
      },
    });

    if (!permission) {
      return NextResponse.json(
        { error: "You do not have access to this budget" },
        { status: 404 },
      );
    }

    // Owners cannot leave (must transfer ownership or delete)
    if (permission.sharedBudget.ownerId === session.user.id) {
      return NextResponse.json(
        {
          error: "Owner cannot leave. Transfer ownership or delete the budget.",
        },
        { status: 400 },
      );
    }

    // Remove permission
    await prisma.budgetPermission.delete({
      where: {
        id: permission.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Failed to leave budget", error);
    return NextResponse.json(
      { error: "Failed to leave budget" },
      { status: 500 },
    );
  }
}

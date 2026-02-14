/**
 * Bulk Operations API
 * POST /api/transactions/bulk
 *
 * Perform bulk operations on multiple transactions (delete, update category, etc.)
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { logger } from "@/lib/logger";

const bulkOperationSchema = z.object({
  operation: z.enum(["delete", "update_category", "update_type"]),
  transactionIds: z.array(z.string()).min(1).max(100),
  data: z
    .object({
      category: z.string().optional(),
      type: z.enum(["INCOME", "EXPENSE"]).optional(),
    })
    .optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = bulkOperationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validation.error.issues },
        { status: 400 },
      );
    }

    const { operation, transactionIds, data } = validation.data;
    const userId = session.user.id;

    // Verify all transactions belong to the user
    const transactions = await prisma.transaction.findMany({
      where: {
        id: { in: transactionIds },
        userId,
      },
    });

    if (transactions.length !== transactionIds.length) {
      return NextResponse.json(
        { error: "Some transactions not found or unauthorized" },
        { status: 403 },
      );
    }

    let result;

    switch (operation) {
      case "delete":
        result = await prisma.transaction.updateMany({
          where: {
            id: { in: transactionIds },
            userId,
          },
          data: {
            deletedAt: new Date(),
          },
        });

        logger.info("Bulk delete transactions", {
          userId,
          count: result.count,
        });

        return NextResponse.json({
          success: true,
          count: result.count,
          message: `${result.count} transactions deleted`,
        });

      case "update_category":
        if (!data?.category) {
          return NextResponse.json(
            { error: "Category is required for update_category operation" },
            { status: 400 },
          );
        }

        result = await prisma.transaction.updateMany({
          where: {
            id: { in: transactionIds },
            userId,
          },
          data: {
            category: data.category,
          },
        });

        logger.info("Bulk update category", {
          userId,
          category: data.category,
          count: result.count,
        });

        return NextResponse.json({
          success: true,
          count: result.count,
          message: `${result.count} transactions updated to category: ${data.category}`,
        });

      case "update_type":
        if (!data?.type) {
          return NextResponse.json(
            { error: "Type is required for update_type operation" },
            { status: 400 },
          );
        }

        result = await prisma.transaction.updateMany({
          where: {
            id: { in: transactionIds },
            userId,
          },
          data: {
            type: data.type,
          },
        });

        logger.info("Bulk update type", {
          userId,
          type: data.type,
          count: result.count,
        });

        return NextResponse.json({
          success: true,
          count: result.count,
          message: `${result.count} transactions updated to type: ${data.type}`,
        });

      default:
        return NextResponse.json(
          { error: "Invalid operation" },
          { status: 400 },
        );
    }
  } catch (error) {
    logger.error("Bulk operation failed", error);
    return NextResponse.json(
      { error: "Failed to perform bulk operation" },
      { status: 500 },
    );
  }
}

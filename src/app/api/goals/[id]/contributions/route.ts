/**
 * Goal Contributions API Route
 *
 * POST - Add contribution to a goal
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { addContribution } from "@/lib/services/goal-service";
import { z } from "zod";
import { logger } from "@/lib/logger";

// Validation schema
const addContributionSchema = z.object({
  amount: z.number().positive(),
  notes: z.string().optional(),
});

/**
 * POST /api/goals/[id]/contributions
 * Add contribution to a goal
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Validate input
    const validation = addContributionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.issues },
        { status: 400 },
      );
    }

    const { amount, notes } = validation.data;

    const contribution = await addContribution(
      {
        goalId: id,
        amount,
        ...(notes && { notes }),
      },
      session.user.id,
    );

    return NextResponse.json({ contribution }, { status: 201 });
  } catch (error) {
    logger.error("Failed to add contribution", error);
    return NextResponse.json(
      { error: "Failed to add contribution" },
      { status: 500 },
    );
  }
}

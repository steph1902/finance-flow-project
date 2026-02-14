import { NextRequest, NextResponse } from "next/server";
import { withApiAuth } from "@/lib/auth-helpers";
import { categorizationService } from "@/lib/ai/categorization-service";
import { prisma } from "@/lib/prisma";
import { logError } from "@/lib/logger";

export const POST = withApiAuth(async (req: NextRequest, userId) => {
  try {
    const body = await req.json();
    const { suggestionId, accepted, actualCategory } = body;

    if (!suggestionId || accepted === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: suggestionId, accepted" },
        { status: 400 },
      );
    }

    // Verify suggestion belongs to user - Use Prisma's type-safe query builder
    const suggestion = await prisma.aISuggestion.findUnique({
      where: { id: suggestionId },
      select: { userId: true },
    });

    if (!suggestion || suggestion.userId !== userId) {
      return NextResponse.json(
        { error: "Suggestion not found" },
        { status: 404 },
      );
    }

    await categorizationService.recordFeedback(
      suggestionId,
      accepted,
      actualCategory,
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    logError("Feedback API error", error, { userId });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
});

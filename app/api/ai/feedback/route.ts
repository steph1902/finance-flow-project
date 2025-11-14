import { NextRequest, NextResponse } from 'next/server';
import { withApiAuth } from '@/lib/auth-helpers';
import { categorizationService } from '@/lib/ai/categorization-service';
import { prisma } from '@/lib/prisma';

export const POST = withApiAuth(async (req: NextRequest, userId) => {
  try {
    const body = await req.json();
    const { suggestionId, accepted, actualCategory } = body;

    if (!suggestionId || accepted === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: suggestionId, accepted' },
        { status: 400 }
      );
    }

    // Verify suggestion belongs to user
    const suggestion = await prisma.$queryRaw<Array<{ user_id: string }>>`
      SELECT user_id
      FROM ai_suggestions
      WHERE id = ${suggestionId}::uuid
      LIMIT 1
    `;

    if (!suggestion.length || suggestion[0].user_id !== userId) {
      return NextResponse.json(
        { error: 'Suggestion not found' },
        { status: 404 }
      );
    }

    await categorizationService.recordFeedback(
      suggestionId,
      accepted,
      actualCategory
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

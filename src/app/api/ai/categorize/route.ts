import { NextRequest, NextResponse } from 'next/server';
import { withApiAuth } from '@/lib/auth-helpers';
import { categorizationService } from '@/lib/ai/categorization-service';
import { checkAIRateLimit, getRateLimitHeaders } from '@/lib/rate-limiter';
import { logError } from '@/lib/logger';

export const POST = withApiAuth(async (req: NextRequest, userId) => {
  try {
    // Check rate limit
    if (!checkAIRateLimit(userId)) {
      const headers = getRateLimitHeaders(userId, 'AI_ENDPOINTS');
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { 
          status: 429,
          headers,
        }
      );
    }

    // Parse request body
    const body = await req.json();
    const { description, amount, type, merchant, date } = body;

    // Validate input
    if (!description || !amount || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: description, amount, type' },
        { status: 400 }
      );
    }

    if (type !== 'income' && type !== 'expense') {
      return NextResponse.json(
        { error: 'Invalid type. Must be "income" or "expense"' },
        { status: 400 }
      );
    }

    // Categorize transaction
    const result = await categorizationService.categorizeTransaction(
      { description, amount, type, merchant, date },
      userId
    );

    return NextResponse.json(result);
  } catch (error) {
    logError('Categorization API error', error, { userId });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

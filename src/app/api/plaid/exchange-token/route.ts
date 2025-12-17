/**
 * Plaid Exchange Token API
 * POST /api/plaid/exchange-token - Exchange public token for access token
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { exchangePublicToken } from '@/lib/services/plaid-service';
import { logger } from '@/lib/logger';
import { z } from 'zod';

const exchangeSchema = z.object({
  publicToken: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = exchangeSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.issues },
        { status: 400 }
      );
    }

    const result = await exchangePublicToken(
      session.user.id,
      validation.data.publicToken
    );

    return NextResponse.json({
      success: true,
      institutionName: result.institutionName,
    });
  } catch (error) {
    logger.error('Failed to exchange token', error);
    return NextResponse.json(
      { error: 'Failed to connect bank account' },
      { status: 500 }
    );
  }
}

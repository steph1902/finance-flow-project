/**
 * Plaid Link Token API
 * POST /api/plaid/link-token - Create link token for Plaid Link
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createLinkToken, isPlaidConfigured } from '@/lib/services/plaid-service';
import { logger } from '@/lib/logger';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!isPlaidConfigured()) {
      return NextResponse.json(
        { error: 'Plaid is not configured' },
        { status: 503 }
      );
    }

    const linkToken = await createLinkToken(session.user.id);

    return NextResponse.json({ linkToken });
  } catch (error) {
    logger.error('Failed to create link token', error);
    return NextResponse.json(
      { error: 'Failed to create link token' },
      { status: 500 }
    );
  }
}

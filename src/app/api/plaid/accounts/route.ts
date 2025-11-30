/**
 * Plaid Accounts API
 * GET /api/plaid/accounts - Get connected bank accounts
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getConnectedBanks } from '@/lib/services/plaid-service';
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const banks = await getConnectedBanks(session.user.id);

    return NextResponse.json({ banks });
  } catch (error) {
    logger.error('Failed to fetch connected banks', error);
    return NextResponse.json(
      { error: 'Failed to fetch connected banks' },
      { status: 500 }
    );
  }
}

/**
 * Update User Currency Preference API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { updateUserCurrency } from '@/lib/services/currency-service';
import { logger } from '@/lib/logger';

/**
 * PATCH /api/currency/update-preference
 * Update user's preferred currency
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currency } = body;

    if (!currency) {
      return NextResponse.json(
        { error: 'Currency is required' },
        { status: 400 }
      );
    }

    await updateUserCurrency(session.user.id, currency);

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Failed to update currency preference', error);
    return NextResponse.json(
      { error: 'Failed to update currency preference' },
      { status: 500 }
    );
  }
}

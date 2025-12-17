/**
 * Currency Conversion API Routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { convertCurrency } from '@/lib/services/currency-service';
import { logger } from '@/lib/logger';

/**
 * POST /api/currency/convert
 * Convert amount from one currency to another
 */
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
    const { amount, from, to } = body;

    if (!amount || !from || !to) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, from, to' },
        { status: 400 }
      );
    }

    const converted = await convertCurrency(
      parseFloat(amount),
      from,
      to
    );

    return NextResponse.json({
      amount: parseFloat(amount),
      from,
      to,
      converted,
    });
  } catch (error) {
    logger.error('Currency conversion failed', error);
    return NextResponse.json(
      { error: 'Currency conversion failed' },
      { status: 500 }
    );
  }
}

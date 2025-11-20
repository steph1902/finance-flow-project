/**
 * Exchange Rates API Route
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/currency/rates
 * Get all exchange rates
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Since migration hasn't created currencyRate table yet, return mock data
    const mockRates = [
      { fromCurrency: 'USD', toCurrency: 'EUR', rate: 0.92, date: new Date() },
      { fromCurrency: 'USD', toCurrency: 'GBP', rate: 0.79, date: new Date() },
      { fromCurrency: 'USD', toCurrency: 'JPY', rate: 149.50, date: new Date() },
    ];

    return NextResponse.json({
      rates: mockRates,
    });
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exchange rates' },
      { status: 500 }
    );
  }
}

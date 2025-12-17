/**
 * Investments API Routes
 * GET /api/investments - List all investments
 * POST /api/investments - Create new investment
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { logger } from '@/lib/logger';
import { InvestmentType } from '@prisma/client';
import {
  createInvestment,
  getUserInvestments,
  getPortfolioSummary,
} from '@/lib/services/investment-service';

const createInvestmentSchema = z.object({
  symbol: z.string().min(1).max(10),
  name: z.string().min(1).max(200),
  type: z.enum(['STOCK', 'BOND', 'MUTUAL_FUND', 'ETF', 'CRYPTO', 'REAL_ESTATE', 'COMMODITY', 'OTHER']),
  quantity: z.number().positive(),
  costBasis: z.number().positive(),
  currentValue: z.number().positive().optional(),
  currency: z.string().optional(),
  purchaseDate: z.string().transform((str) => new Date(str)),
  notes: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const summary = searchParams.get('summary') === 'true';

    if (summary) {
      const portfolioSummary = await getPortfolioSummary(session.user.id);
      return NextResponse.json({ summary: portfolioSummary });
    }

    const investments = await getUserInvestments(session.user.id);
    return NextResponse.json({ investments });
  } catch (error) {
    logger.error('Failed to fetch investments', error);
    return NextResponse.json(
      { error: 'Failed to fetch investments' },
      { status: 500 }
    );
  }
}

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
    const validation = createInvestmentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.issues },
        { status: 400 }
      );
    }

    const investmentData: {
      symbol: string;
      name: string;
      type: InvestmentType;
      quantity: number;
      costBasis: number;
      currentValue: number;
      currency: string;
      purchaseDate: Date;
      notes?: string;
    } = {
      symbol: validation.data.symbol,
      name: validation.data.name,
      type: validation.data.type as InvestmentType,
      quantity: validation.data.quantity,
      costBasis: validation.data.costBasis,
      currentValue: validation.data.currentValue ?? validation.data.costBasis,
      currency: validation.data.currency ?? 'USD',
      purchaseDate: validation.data.purchaseDate,
    };

    if (validation.data.notes) {
      investmentData.notes = validation.data.notes;
    }

    const investment = await createInvestment(session.user.id, investmentData);

    return NextResponse.json({ investment }, { status: 201 });
  } catch (error) {
    logger.error('Failed to create investment', error);
    return NextResponse.json(
      { error: 'Failed to create investment' },
      { status: 500 }
    );
  }
}

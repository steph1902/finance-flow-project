/**
 * Import/Export API Routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { withApiAuth } from '@/lib/auth-helpers';
import { importTransactionsFromCSV } from '@/lib/services/import-export-service';
import { logger } from '@/lib/logger';

/**
 * POST /api/import-export/import
 * Import transactions from CSV file
 */
export const POST = withApiAuth(async (request: NextRequest, userId: string) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Read file content
    const csvContent = await file.text();

    // Fix: userId is the first argument
    const result = await importTransactionsFromCSV(userId, csvContent);

    return NextResponse.json(result);
  } catch (error) {
    logger.error('Failed to import transactions', error);
    return NextResponse.json(
      { error: 'Failed to import transactions' },
      { status: 500 }
    );
  }
});

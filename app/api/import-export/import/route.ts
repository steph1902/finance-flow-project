/**
 * Import/Export API Routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { importTransactionsFromCSV } from '@/lib/services/import-export-service';
import { logger } from '@/lib/logger';

/**
 * POST /api/import-export/import
 * Import transactions from CSV file
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

    const result = await importTransactionsFromCSV(csvContent, session.user.id);

    return NextResponse.json(result);
  } catch (error) {
    logger.error('Failed to import transactions', error);
    return NextResponse.json(
      { error: 'Failed to import transactions' },
      { status: 500 }
    );
  }
}

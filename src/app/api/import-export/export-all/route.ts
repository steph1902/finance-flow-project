/**
 * Export All Data API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { exportAllUserData } from '@/lib/services/import-export-service';
import { logger } from '@/lib/logger';

/**
 * GET /api/import-export/export-all
 * Export all user data as JSON
 */
export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await exportAllUserData(session.user.id);

    return new NextResponse(JSON.stringify(data, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="financeflow-data-${new Date().toISOString().split('T')[0]}.json"`,
      },
    });
  } catch (error) {
    logger.error('Failed to export all data', error);
    return NextResponse.json(
      { error: 'Failed to export all data' },
      { status: 500 }
    );
  }
}

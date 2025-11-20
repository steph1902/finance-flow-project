/**
 * CSV Template API Route
 */

import { NextResponse } from 'next/server';
import { generateCSVTemplate } from '@/lib/services/import-export-service';

/**
 * GET /api/import-export/template
 * Download CSV template for transactions
 */
export async function GET() {
  try {
    const template = generateCSVTemplate();

    return new NextResponse(template, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="transaction-template.csv"',
      },
    });
  } catch (error) {
    console.error('Failed to generate template:', error);
    return NextResponse.json(
      { error: 'Failed to generate template' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getReportById } from '@/lib/services/report-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id} = await params;
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';

    const report = await getReportById(id, session.user.id);

    const data = report.data as Record<string, unknown>;

    if (format === 'csv') {
      // Generate CSV from report data
      const csv = generateCSV(data);
      
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${report.name?.replace(/\s/g, '_') || 'report'}.csv"`,
        },
      });
    }

    // JSON format
    const json = JSON.stringify(data, null, 2);
    
    return new NextResponse(json, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${report.name?.replace(/\s/g, '_') || 'report'}.json"`,
      },
    });
  } catch (error) {
    console.error('Failed to download report:', error);
    return NextResponse.json(
      { error: 'Failed to download report' },
      { status: 500 }
    );
  }
}

function generateCSV(data: Record<string, unknown>): string {
  // Extract transactions or summary data
  const transactions = (data.transactions as Array<Record<string, unknown>>) || [];
  
  if (transactions.length === 0) {
    return 'No data available';
  }

  // Get headers from first transaction
  const firstTransaction = transactions[0];
  if (!firstTransaction) {
    return 'No data available';
  }
  const headers = Object.keys(firstTransaction);
  const csvRows = [headers.join(',')];

  // Add data rows
  for (const transaction of transactions) {
    const values = headers.map(header => {
      const value = transaction[header];
      // Escape commas and quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}

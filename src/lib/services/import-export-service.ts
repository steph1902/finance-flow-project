/**
 * Data Import/Export Service
 * 
 * Handles CSV import/export of transactions with validation,
 * error handling, and progress tracking.
 */

import { prisma } from '@/lib/prisma';
import { logInfo, logError } from '@/lib/logger';
import { Decimal } from '@prisma/client/runtime/library';

export interface TransactionCSVRow {
  date: string;
  amount: string;
  type: string;
  category: string;
  description?: string;
  notes?: string;
}

export interface ImportResult {
  total: number;
  successful: number;
  failed: number;
  errors: { row: number; error: string; data: TransactionCSVRow }[];
}

export interface ExportOptions {
  userId: string;
  startDate?: Date;
  endDate?: Date;
  categories?: string[];
  type?: 'INCOME' | 'EXPENSE' | 'ALL';
  format?: 'CSV' | 'JSON';
}

/**
 * Parse CSV string to array of rows
 */
function parseCSV(csvContent: string): TransactionCSVRow[] {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV file must contain headers and at least one data row');
  }

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const rows: TransactionCSVRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row: any = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });

    rows.push(row as TransactionCSVRow);
  }

  return rows;
}

/**
 * Validate a CSV row
 */
function validateRow(row: TransactionCSVRow): { valid: boolean; error?: string } {
  // Check required fields
  if (!row.date) {
    return { valid: false, error: 'Date is required' };
  }
  if (!row.amount) {
    return { valid: false, error: 'Amount is required' };
  }
  if (!row.type) {
    return { valid: false, error: 'Type is required' };
  }
  if (!row.category) {
    return { valid: false, error: 'Category is required' };
  }

  // Validate date format
  const date = new Date(row.date);
  if (isNaN(date.getTime())) {
    return { valid: false, error: 'Invalid date format. Use YYYY-MM-DD' };
  }

  // Validate amount
  const amount = parseFloat(row.amount);
  if (isNaN(amount) || amount <= 0) {
    return { valid: false, error: 'Amount must be a positive number' };
  }

  // Validate type
  if (row.type !== 'INCOME' && row.type !== 'EXPENSE') {
    return { valid: false, error: 'Type must be INCOME or EXPENSE' };
  }

  return { valid: true };
}

/**
 * Import transactions from CSV content
 */
export async function importTransactionsFromCSV(
  userId: string,
  csvContent: string
): Promise<ImportResult> {
  const result: ImportResult = {
    total: 0,
    successful: 0,
    failed: 0,
    errors: [],
  };

  try {
    const rows = parseCSV(csvContent);
    result.total = rows.length;

    logInfo('Starting CSV import', { userId, rowCount: rows.length });

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const validation = validateRow(row);

      if (!validation.valid) {
        result.failed++;
        result.errors.push({
          row: i + 2, // +2 because CSV has headers and is 1-indexed
          error: validation.error!,
          data: row,
        });
        continue;
      }

      try {
        await prisma.transaction.create({
          data: {
            userId,
            amount: new Decimal(parseFloat(row.amount)),
            type: row.type as 'INCOME' | 'EXPENSE',
            category: row.category,
            description: row.description || null,
            notes: row.notes || null,
            date: new Date(row.date),
          },
        });

        result.successful++;
      } catch (error) {
        result.failed++;
        result.errors.push({
          row: i + 2,
          error: error instanceof Error ? error.message : 'Database error',
          data: row,
        });
      }
    }

    logInfo('CSV import completed', {
      userId,
      total: result.total,
      successful: result.successful,
      failed: result.failed,
    });

    return result;
  } catch (error) {
    logError('CSV import failed', error);
    throw new Error('Failed to import CSV');
  }
}

/**
 * Export transactions to CSV format
 */
export async function exportTransactionsToCSV(options: ExportOptions): Promise<string> {
  try {
    const { userId, startDate, endDate, categories, type } = options;

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        deletedAt: null,
        ...(startDate && { date: { gte: startDate } }),
        ...(endDate && { date: { lte: endDate } }),
        ...(categories && categories.length > 0 && { category: { in: categories } }),
        ...(type && type !== 'ALL' && { type }),
      },
      orderBy: { date: 'desc' },
    });

    logInfo('Exporting transactions to CSV', { userId, count: transactions.length });

    // Build CSV content
    const headers = ['Date', 'Amount', 'Type', 'Category', 'Description', 'Notes'];
    const rows = transactions.map(tx => [
      tx.date.toISOString().split('T')[0],
      tx.amount.toString(),
      tx.type,
      tx.category,
      tx.description || '',
      tx.notes || '',
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    return csv;
  } catch (error) {
    logError('CSV export failed', error);
    throw new Error('Failed to export CSV');
  }
}

/**
 * Export all user data to JSON
 */
export async function exportAllUserData(userId: string): Promise<any> {
  try {
    logInfo('Exporting all user data', { userId });

    const [user, transactions, budgets, recurringTransactions, aiChatHistory] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          preferredCurrency: true,
          timezone: true,
          language: true,
        },
      }),
      prisma.transaction.findMany({
        where: { userId, deletedAt: null },
        orderBy: { date: 'desc' },
      }),
      prisma.budget.findMany({
        where: { userId },
        orderBy: [{ year: 'desc' }, { month: 'desc' }],
      }),
      prisma.recurringTransaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.aIChatHistory.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 100, // Limit to last 100 messages
      }),
    ]);

    return {
      user,
      transactions: transactions.map(tx => ({
        ...tx,
        amount: tx.amount.toString(),
      })),
      budgets: budgets.map(b => ({
        ...b,
        amount: b.amount.toString(),
      })),
      recurringTransactions: recurringTransactions.map(rt => ({
        ...rt,
        amount: rt.amount.toString(),
      })),
      aiChatHistory,
      exportedAt: new Date().toISOString(),
    };
  } catch (error) {
    logError('Data export failed', error);
    throw new Error('Failed to export user data');
  }
}

/**
 * Generate CSV template for import
 */
export function generateCSVTemplate(): string {
  const headers = ['date', 'amount', 'type', 'category', 'description', 'notes'];
  const example = [
    '2025-01-15',
    '50.00',
    'EXPENSE',
    'Food',
    'Grocery shopping',
    'Weekly groceries',
  ];

  return [
    headers.join(','),
    example.join(','),
  ].join('\n');
}

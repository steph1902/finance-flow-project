/**
 * Tests for Export Service
 * Covers JSON, CSV, PDF, and Excel export generation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as exportService from '../export-service';
import { prisma } from '@/lib/prisma';

// Mock dependencies
vi.mock('@/lib/prisma', () => ({
  prisma: {
    transaction: {
      findMany: vi.fn(),
    },
    budget: {
      findMany: vi.fn(),
    },
    goal: {
      findMany: vi.fn(),
    },
    recurringTransaction: {
      findMany: vi.fn(),
    },
    investment: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock('jspdf', () => ({
  default: vi.fn().mockImplementation(() => ({
    text: vi.fn(),
    setFontSize: vi.fn(),
    output: vi.fn().mockReturnValue(new ArrayBuffer(100)),
  })),
}));

vi.mock('jspdf-autotable', () => ({
  default: vi.fn(),
}));

vi.mock('xlsx', () => ({
  utils: {
    book_new: vi.fn(() => ({})),
    json_to_sheet: vi.fn(() => ({})),
    book_append_sheet: vi.fn(),
  },
  write: vi.fn(() => Buffer.from('mock-excel-data')),
}));

describe('Export Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('exportUserData', () => {
    it('should export data as JSON', async () => {
      const mockTransactions = [
        {
          id: 'tx-1',
          amount: 100,
          category: 'Food',
          date: new Date('2024-11-24'),
          type: 'EXPENSE',
        },
      ];

      /* eslint-disable @typescript-eslint/no-explicit-any */
      (prisma.transaction.findMany as any).mockResolvedValue(mockTransactions);
      (prisma.budget.findMany as any).mockResolvedValue([]);
      (prisma.goal.findMany as any).mockResolvedValue([]);
      (prisma.recurringTransaction.findMany as any).mockResolvedValue([]);
      (prisma.investment.findMany as any).mockResolvedValue([]);
      /* eslint-enable @typescript-eslint/no-explicit-any */

      const result = await exportService.exportUserData({
        userId: 'user-123',
        format: 'json',
      });

      expect(typeof result).toBe('string');
      const parsed = JSON.parse(result as string);
      expect(parsed.transactions).toBeDefined();
      expect(parsed.exportDate).toBeDefined();
    });

    it('should export data as CSV', async () => {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      (prisma.transaction.findMany as any).mockResolvedValue([
        {
          id: 'tx-1',
          amount: 100,
          category: 'Food',
          date: new Date('2024-11-24'),
          type: 'EXPENSE',
          description: 'Lunch',
        },
      ]);
      (prisma.budget.findMany as any).mockResolvedValue([]);
      (prisma.goal.findMany as any).mockResolvedValue([]);
      (prisma.recurringTransaction.findMany as any).mockResolvedValue([]);
      (prisma.investment.findMany as any).mockResolvedValue([]);
      /* eslint-enable @typescript-eslint/no-explicit-any */

      const result = await exportService.exportUserData({
        userId: 'user-123',
        format: 'csv',
      });

      expect(typeof result).toBe('string');
      expect(result).toContain('Date,Description,Category,Type,Amount');
      expect(result).toContain('Lunch');
    });

    it('should export data as PDF', async () => {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      (prisma.transaction.findMany as any).mockResolvedValue([
        {
          id: 'tx-1',
          amount: 100,
          category: 'Food',
          date: new Date('2024-11-24'),
          type: 'EXPENSE',
          description: 'Lunch',
        },
      ]);
      (prisma.budget.findMany as any).mockResolvedValue([]);
      (prisma.goal.findMany as any).mockResolvedValue([]);
      (prisma.recurringTransaction.findMany as any).mockResolvedValue([]);
      (prisma.investment.findMany as any).mockResolvedValue([]);
      /* eslint-enable @typescript-eslint/no-explicit-any */

      const result = await exportService.exportUserData({
        userId: 'user-123',
        format: 'pdf',
      });

      expect(Buffer.isBuffer(result)).toBe(true);
    });

    it('should export data as Excel', async () => {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      (prisma.transaction.findMany as any).mockResolvedValue([
        {
          id: 'tx-1',
          amount: 100,
          category: 'Food',
          date: new Date('2024-11-24'),
          type: 'EXPENSE',
          description: 'Lunch',
        },
      ]);
      (prisma.budget.findMany as any).mockResolvedValue([]);
      (prisma.goal.findMany as any).mockResolvedValue([]);
      (prisma.recurringTransaction.findMany as any).mockResolvedValue([]);
      (prisma.investment.findMany as any).mockResolvedValue([]);
      /* eslint-enable @typescript-eslint/no-explicit-any */

      const result = await exportService.exportUserData({
        userId: 'user-123',
        format: 'excel',
      });

      expect(Buffer.isBuffer(result)).toBe(true);
    });

    it('should filter by date range', async () => {
      const startDate = new Date('2024-11-01');
      const endDate = new Date('2024-11-30');

      /* eslint-disable @typescript-eslint/no-explicit-any */
      (prisma.transaction.findMany as any).mockResolvedValue([]);
      (prisma.budget.findMany as any).mockResolvedValue([]);
      (prisma.goal.findMany as any).mockResolvedValue([]);
      (prisma.recurringTransaction.findMany as any).mockResolvedValue([]);
      (prisma.investment.findMany as any).mockResolvedValue([]);
      /* eslint-enable @typescript-eslint/no-explicit-any */

      await exportService.exportUserData({
        userId: 'user-123',
        format: 'json',
        startDate,
        endDate,
      });

      expect(prisma.transaction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            date: {
              gte: startDate,
              lte: endDate,
            },
          }),
        })
      );
    });

    it('should handle selective data export', async () => {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      (prisma.transaction.findMany as any).mockResolvedValue([]);
      (prisma.budget.findMany as any).mockResolvedValue([]);
      /* eslint-enable @typescript-eslint/no-explicit-any */

      await exportService.exportUserData({
        userId: 'user-123',
        format: 'json',
        includeTransactions: true,
        includeBudgets: true,
        includeGoals: false,
        includeRecurring: false,
        includeInvestments: false,
      });

      expect(prisma.transaction.findMany).toHaveBeenCalled();
      expect(prisma.budget.findMany).toHaveBeenCalled();
      expect(prisma.goal.findMany).not.toHaveBeenCalled();
    });
  });

  describe('CSV generation', () => {
    it('should properly escape CSV special characters', async () => {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      (prisma.transaction.findMany as any).mockResolvedValue([
        {
          id: 'tx-1',
          amount: 100,
          category: 'Food',
          date: new Date('2024-11-24'),
          type: 'EXPENSE',
          description: 'Lunch, with "quotes"',
        },
      ]);
      (prisma.budget.findMany as any).mockResolvedValue([]);
      (prisma.goal.findMany as any).mockResolvedValue([]);
      (prisma.recurringTransaction.findMany as any).mockResolvedValue([]);
      (prisma.investment.findMany as any).mockResolvedValue([]);
      /* eslint-enable @typescript-eslint/no-explicit-any */

      const result = await exportService.exportUserData({
        userId: 'user-123',
        format: 'csv',
      });

      // CSV should properly escape the description with quotes
      expect(result).toContain('"Lunch, with ""quotes"""');
    });
  });

  describe('Error handling', () => {
    it('should throw error on invalid format', async () => {
      await expect(
        exportService.exportUserData({
          userId: 'user-123',
          format: 'invalid' as any,
        })
      ).rejects.toThrow();
    });
  });
});

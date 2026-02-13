/**
 * Tests for Export Service
 * Covers JSON, CSV, PDF, and Excel export generation
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import * as exportService from '../export-service';
import { prisma } from '@/lib/prisma';

// Mock dependencies
// Mock Prisma via global injection
const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  plaidItem: {
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
  },
  transaction: {
    findFirst: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  budget: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  goal: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  recurringTransaction: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  investment: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findFirst: jest.fn(),
  },
  investmentTransaction: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
  systemLog: {
    create: jest.fn(),
  },
};

(global as any).prisma = mockPrisma;

jest.mock('jspdf', () => ({
  default: jest.fn().mockImplementation(() => ({
    text: jest.fn(),
    setFontSize: jest.fn(),
    output: jest.fn().mockReturnValue(new ArrayBuffer(100)),
  })),
}));

jest.mock('jspdf-autotable', () => ({
  default: jest.fn(),
}));

jest.mock('xlsx', () => ({
  utils: {
    book_new: jest.fn(() => ({})),
    json_to_sheet: jest.fn(() => ({})),
    book_append_sheet: jest.fn(),
  },
  write: jest.fn(() => Buffer.from('mock-excel-data')),
}));

describe('Export Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

      (prisma.transaction.findMany as unknown as any).mockResolvedValue(mockTransactions);
      (prisma.budget.findMany as unknown as any).mockResolvedValue([]);
      (prisma.goal.findMany as unknown as any).mockResolvedValue([]);
      (prisma.recurringTransaction.findMany as unknown as any).mockResolvedValue([]);
      (prisma.investment.findMany as unknown as any).mockResolvedValue([]);

      const result = await exportService.exportUserData({
        userId: 'user-123',
        format: 'json',
      });

      expect(typeof result).toBe('string');
      const parsed = JSON.parse(result as string);
      expect(parsed.transactions).toBeDefined();

    });

    it('should export data as CSV', async () => {
      (prisma.transaction.findMany as unknown as any).mockResolvedValue([
        {
          id: 'tx-1',
          amount: 100,
          category: 'Food',
          date: new Date('2024-11-24'),
          type: 'EXPENSE',
          description: 'Lunch',
        },
      ]);
      (prisma.budget.findMany as unknown as any).mockResolvedValue([]);
      (prisma.goal.findMany as unknown as any).mockResolvedValue([]);
      (prisma.recurringTransaction.findMany as unknown as any).mockResolvedValue([]);
      (prisma.investment.findMany as unknown as any).mockResolvedValue([]);

      const result = await exportService.exportUserData({
        userId: 'user-123',
        format: 'csv',
      });

      expect(typeof result).toBe('string');
      expect(result).toContain('Date,Description,Category,Type,Amount');
      expect(result).toContain('Lunch');
    });

    it('should export data as PDF', async () => {
      (prisma.transaction.findMany as unknown as any).mockResolvedValue([
        {
          id: 'tx-1',
          amount: 100,
          category: 'Food',
          date: new Date('2024-11-24'),
          type: 'EXPENSE',
          description: 'Lunch',
        },
      ]);
      (prisma.budget.findMany as unknown as any).mockResolvedValue([]);
      (prisma.goal.findMany as unknown as any).mockResolvedValue([]);
      (prisma.recurringTransaction.findMany as unknown as any).mockResolvedValue([]);
      (prisma.investment.findMany as unknown as any).mockResolvedValue([]);

      const result = await exportService.exportUserData({
        userId: 'user-123',
        format: 'pdf',
      });

      expect(Buffer.isBuffer(result)).toBe(true);
    });

    it('should export data as Excel', async () => {
      (prisma.transaction.findMany as unknown as any).mockResolvedValue([
        {
          id: 'tx-1',
          amount: 100,
          category: 'Food',
          date: new Date('2024-11-24'),
          type: 'EXPENSE',
          description: 'Lunch',
        },
      ]);
      (prisma.budget.findMany as unknown as any).mockResolvedValue([]);
      (prisma.goal.findMany as unknown as any).mockResolvedValue([]);
      (prisma.recurringTransaction.findMany as unknown as any).mockResolvedValue([]);
      (prisma.investment.findMany as unknown as any).mockResolvedValue([]);

      const result = await exportService.exportUserData({
        userId: 'user-123',
        format: 'excel',
      });

      expect(Buffer.isBuffer(result)).toBe(true);
    });

    it('should filter by date range', async () => {
      const startDate = new Date('2024-11-01');
      const endDate = new Date('2024-11-30');

      (prisma.transaction.findMany as unknown as any).mockResolvedValue([]);
      (prisma.budget.findMany as unknown as any).mockResolvedValue([]);
      (prisma.goal.findMany as unknown as any).mockResolvedValue([]);
      (prisma.recurringTransaction.findMany as unknown as any).mockResolvedValue([]);
      (prisma.investment.findMany as unknown as any).mockResolvedValue([]);

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
      (prisma.transaction.findMany as unknown as any).mockResolvedValue([]);
      (prisma.budget.findMany as unknown as any).mockResolvedValue([]);

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
      (prisma.transaction.findMany as unknown as any).mockResolvedValue([
        {
          id: 'tx-1',
          amount: 100,
          category: 'Food',
          date: new Date('2024-11-24'),
          type: 'EXPENSE',
          description: 'Lunch, with "quotes"',
        },
      ]);
      (prisma.budget.findMany as unknown as any).mockResolvedValue([]);
      (prisma.goal.findMany as unknown as any).mockResolvedValue([]);
      (prisma.recurringTransaction.findMany as unknown as any).mockResolvedValue([]);
      (prisma.investment.findMany as unknown as any).mockResolvedValue([]);

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
          format: 'invalid' as unknown as exportService.ExportFormat,
        })
      ).rejects.toThrow();
    });
  });
});

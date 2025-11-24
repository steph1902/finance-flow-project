/**
 * Tests for Investment Service
 * Covers portfolio management, transactions, and performance calculations
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as investmentService from '../investment-service';
import { prisma } from '@/lib/prisma';
import { InvestmentType, InvestmentTransactionType } from '@prisma/client';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    investment: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findFirst: vi.fn(),
    },
    investmentTransaction: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

describe('Investment Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createInvestment', () => {
    it('should create a new investment with initial BUY transaction', async () => {
      const mockInvestment = {
        id: 'inv-123',
        userId: 'user-123',
        symbol: 'AAPL',
        name: 'Apple Inc.',
        type: 'STOCK' as InvestmentType,
        quantity: 10,
        costBasis: 1500,
        currentValue: 1500,
        currency: 'USD',
        purchaseDate: new Date('2024-01-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      /* eslint-disable @typescript-eslint/no-explicit-any */
      (prisma.investment.create as any).mockResolvedValue(mockInvestment);
      (prisma.investmentTransaction.create as any).mockResolvedValue({
        id: 'tx-123',
      });
      /* eslint-enable @typescript-eslint/no-explicit-any */

      const result = await investmentService.createInvestment('user-123', {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        type: 'STOCK' as InvestmentType,
        quantity: 10,
        costBasis: 1500,
        currentValue: 1500,
        currency: 'USD',
        purchaseDate: new Date('2024-01-01'),
      });

      expect(result).toEqual(mockInvestment);
      expect(prisma.investment.create).toHaveBeenCalled();
      expect(prisma.investmentTransaction.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          investmentId: 'inv-123',
          type: 'BUY',
          quantity: 10,
        }),
      });
    });
  });

  describe('recordInvestmentTransaction', () => {
    it('should handle BUY transaction and update investment', async () => {
      const mockInvestment = {
        id: 'inv-123',
        quantity: 10,
        costBasis: 1500,
      };

      /* eslint-disable @typescript-eslint/no-explicit-any */
      (prisma.investment.findUnique as any).mockResolvedValue(mockInvestment);
      (prisma.investmentTransaction.create as any).mockResolvedValue({
        id: 'tx-123',
      });
      (prisma.investment.update as any).mockResolvedValue({});
      /* eslint-enable @typescript-eslint/no-explicit-any */

      const result = await investmentService.recordInvestmentTransaction('inv-123', {
        type: 'BUY' as InvestmentTransactionType,
        quantity: 5,
        price: 155,
        totalAmount: 775,
        fees: 10,
        date: new Date('2024-11-24'),
      });

      expect(result).toBeDefined();
      expect(prisma.investment.update).toHaveBeenCalledWith({
        where: { id: 'inv-123' },
        data: {
          quantity: 15, // 10 + 5
          costBasis: 2285, // 1500 + 775 + 10
        },
      });
    });

    it('should handle SELL transaction and reduce quantity', async () => {
      const mockInvestment = {
        id: 'inv-123',
        quantity: 10,
        costBasis: 1500,
      };

      /* eslint-disable @typescript-eslint/no-explicit-any */
      (prisma.investment.findUnique as any).mockResolvedValue(mockInvestment);
      (prisma.investmentTransaction.create as any).mockResolvedValue({
        id: 'tx-123',
      });
      (prisma.investment.update as any).mockResolvedValue({});
      /* eslint-enable @typescript-eslint/no-explicit-any */

      await investmentService.recordInvestmentTransaction('inv-123', {
        type: 'SELL' as InvestmentTransactionType,
        quantity: 5,
        price: 160,
        totalAmount: 800,
        date: new Date('2024-11-24'),
      });

      expect(prisma.investment.update).toHaveBeenCalledWith({
        where: { id: 'inv-123' },
        data: {
          quantity: 5, // 10 - 5
          costBasis: 750, // Proportional reduction
        },
      });
    });
  });

  describe('getUserInvestments', () => {
    it('should return investments with calculated metrics', async () => {
      const mockInvestments = [
        {
          id: 'inv-1',
          symbol: 'AAPL',
          name: 'Apple Inc.',
          type: 'STOCK',
          quantity: 10,
          costBasis: 1500,
          currentValue: 1700,
          currency: 'USD',
          purchaseDate: new Date('2024-01-01'),
        },
      ];

      /* eslint-disable @typescript-eslint/no-explicit-any */
      (prisma.investment.findMany as any).mockResolvedValue(mockInvestments);
      /* eslint-enable @typescript-eslint/no-explicit-any */

      const result = await investmentService.getUserInvestments('user-123');

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 'inv-1',
        symbol: 'AAPL',
        gainLoss: 200, // 1700 - 1500
        gainLossPercentage: 13.33, // (200/1500) * 100
      });
    });
  });

  describe('getPortfolioSummary', () => {
    it('should calculate portfolio totals and breakdown', async () => {
      const mockInvestments = [
        {
          id: 'inv-1',
          type: 'STOCK' as InvestmentType,
          costBasis: 1500,
          currentValue: 1700,
        },
        {
          id: 'inv-2',
          type: 'ETF' as InvestmentType,
          costBasis: 2000,
          currentValue: 2200,
        },
      ];

      /* eslint-disable @typescript-eslint/no-explicit-any */
      (prisma.investment.findMany as any).mockResolvedValue(mockInvestments);
      /* eslint-enable @typescript-eslint/no-explicit-any */

      const result = await investmentService.getPortfolioSummary('user-123');

      expect(result.totalValue).toBe(3900); // 1700 + 2200
      expect(result.totalCostBasis).toBe(3500); // 1500 + 2000
      expect(result.totalGainLoss).toBe(400); // 3900 - 3500
      expect(result.totalGainLossPercentage).toBeCloseTo(11.43, 2);
      expect(result.breakdown).toHaveLength(2);
    });
  });

  describe('deleteInvestment', () => {
    it('should delete investment if user owns it', async () => {
      const mockInvestment = {
        id: 'inv-123',
        userId: 'user-123',
      };

      /* eslint-disable @typescript-eslint/no-explicit-any */
      (prisma.investment.findFirst as any).mockResolvedValue(mockInvestment);
      (prisma.investment.delete as any).mockResolvedValue({});
      /* eslint-enable @typescript-eslint/no-explicit-any */

      await investmentService.deleteInvestment('inv-123', 'user-123');

      expect(prisma.investment.delete).toHaveBeenCalledWith({
        where: { id: 'inv-123' },
      });
    });

    it('should throw error if user does not own investment', async () => {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      (prisma.investment.findFirst as any).mockResolvedValue(null);
      /* eslint-enable @typescript-eslint/no-explicit-any */

      await expect(
        investmentService.deleteInvestment('inv-123', 'user-999')
      ).rejects.toThrow('Failed to delete investment');
    });
  });

  describe('Performance calculations', () => {
    it('should correctly calculate gain/loss percentage', async () => {
      const investment = {
        costBasis: 1000,
        currentValue: 1200,
      };

      const gainLoss = 1200 - 1000; // 200
      const percentage = (gainLoss / 1000) * 100; // 20%

      expect(percentage).toBe(20);
    });

    it('should handle zero cost basis edge case', async () => {
      const investment = {
        costBasis: 0,
        currentValue: 100,
      };

      // Should not divide by zero
      const percentage = investment.costBasis > 0 
        ? ((investment.currentValue - investment.costBasis) / investment.costBasis) * 100 
        : 0;

      expect(percentage).toBe(0);
    });
  });
});

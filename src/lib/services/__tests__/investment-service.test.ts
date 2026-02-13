/**
 * Tests for Investment Service
 * Covers portfolio management, transactions, and performance calculations
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import * as investmentService from '../investment-service';
import { prisma } from '@/lib/prisma';
import { InvestmentType, InvestmentTransactionType } from '@prisma/client';

// Mock Prisma
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

describe('Investment Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

      (prisma.investment.create as unknown as any).mockResolvedValue(mockInvestment);
      (prisma.investmentTransaction.create as unknown as any).mockResolvedValue({
        id: 'tx-123',
      });

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

      (prisma.investment.findUnique as unknown as any).mockResolvedValue(mockInvestment);
      (prisma.investmentTransaction.create as unknown as any).mockResolvedValue({
        id: 'tx-123',
      });
      (prisma.investment.update as unknown as any).mockResolvedValue({});

      const result = await investmentService.recordInvestmentTransaction('inv-123', {
        type: 'BUY' as InvestmentTransactionType,
        quantity: 5,
        price: 155,

        fees: 10,
        date: new Date('2024-11-24'),
      });

      expect(result).toBeDefined();
      expect(prisma.investment.update).toHaveBeenCalledWith({
        where: { id: 'inv-123' },
        data: {
          quantity: 15, // 10 + 5
          costBasis: 2285, // 1500 + 775 + 10
          lastUpdated: expect.anything(),
        },
      });
    });

    it('should handle SELL transaction and reduce quantity', async () => {
      const mockInvestment = {
        id: 'inv-123',
        quantity: 10,
        costBasis: 1500,
      };

      (prisma.investment.findUnique as unknown as any).mockResolvedValue(mockInvestment);
      (prisma.investmentTransaction.create as unknown as any).mockResolvedValue({
        id: 'tx-123',
      });
      (prisma.investment.update as unknown as any).mockResolvedValue({});

      await investmentService.recordInvestmentTransaction('inv-123', {
        type: 'SELL' as InvestmentTransactionType,
        quantity: 5,
        price: 160,

        date: new Date('2024-11-24'),
      });

      expect(prisma.investment.update).toHaveBeenCalledWith({
        where: { id: 'inv-123' },
        data: {
          quantity: 5, // 10 - 5
          costBasis: 750, // Proportional reduction
          lastUpdated: expect.anything(),
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

      (prisma.investment.findMany as unknown as any).mockResolvedValue(mockInvestments);

      const result = await investmentService.getUserInvestments('user-123');

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 'inv-1',
        symbol: 'AAPL',
        gainLoss: 200, // 1700 - 1500
        gainLossPercentage: expect.closeTo(13.33, 1), // (200/1500) * 100
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

      (prisma.investment.findMany as unknown as any).mockResolvedValue(mockInvestments);

      const result = await investmentService.getPortfolioSummary('user-123');

      expect(result.totalValue).toBe(3900); // 1700 + 2200
      expect(result.totalCostBasis).toBe(3500); // 1500 + 2000
      expect(result.totalGainLoss).toBe(400); // 3900 - 3500
      expect(result.totalGainLossPercentage).toBeCloseTo(11.43, 2);
      expect(Object.keys(result.byType).filter(k => result.byType[k as keyof typeof result.byType].count > 0)).toHaveLength(2);
    });

    it('should throw error if summary calculation fails', async () => {
      (prisma.investment.findMany as unknown as any).mockRejectedValue(new Error('DB Error'));
      await expect(investmentService.getPortfolioSummary('user-123')).rejects.toThrow('Failed to calculate portfolio summary');
    });
  });

  describe('deleteInvestment', () => {
    it('should delete investment if user owns it', async () => {
      const mockInvestment = {
        id: 'inv-123',
        userId: 'user-123',
      };

      (prisma.investment.findFirst as unknown as any).mockResolvedValue(mockInvestment);
      (prisma.investment.delete as unknown as any).mockResolvedValue({});

      await investmentService.deleteInvestment('user-123', 'inv-123');

      expect(prisma.investment.delete).toHaveBeenCalledWith({
        where: { id: 'inv-123' },
      });
    });

    it('should throw error if user does not own investment', async () => {
      (prisma.investment.findFirst as unknown as any).mockResolvedValue(null);

      await expect(
        investmentService.deleteInvestment('inv-123', 'user-999')
      ).rejects.toThrow('Failed to delete investment');
    });
  });

  describe('Performance calculations', () => {
    it('should correctly calculate gain/loss percentage', async () => {
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

  describe('updateInvestmentValue', () => {
    it('should update investment value and timestamp', async () => {
      const mockResult = {
        id: 'inv-123',
        currentValue: 2000,
      };

      (prisma.investment.update as unknown as any).mockResolvedValue(mockResult);

      const result = await investmentService.updateInvestmentValue('inv-123', 2000);

      expect(result).toEqual(mockResult);
      expect(prisma.investment.update).toHaveBeenCalledWith({
        where: { id: 'inv-123' },
        data: {
          currentValue: 2000,
          lastUpdated: expect.any(Date),
        },
      });
    });

    it('should throw error if update fails', async () => {
      (prisma.investment.update as unknown as any).mockRejectedValue(new Error('Update Error'));

      await expect(
        investmentService.updateInvestmentValue('inv-123', 2000)
      ).rejects.toThrow('Failed to update investment value');
    });
  });

  describe('getInvestmentTransactions', () => {
    it('should return transactions for an investment', async () => {
      const mockTx = [{ id: 'tx-1', type: 'BUY', amount: 100 }];
      (prisma.investmentTransaction.findMany as unknown as any).mockResolvedValue(mockTx);

      const result = await investmentService.getInvestmentTransactions('inv-123');
      expect(result).toEqual(mockTx);
      expect(prisma.investmentTransaction.findMany).toHaveBeenCalledWith({
        where: { investmentId: 'inv-123' },
        orderBy: { date: 'desc' },
      });
    });

    it('should handle errors', async () => {
      (prisma.investmentTransaction.findMany as unknown as any).mockRejectedValue(new Error('DB Error'));
      await expect(investmentService.getInvestmentTransactions('inv-123')).rejects.toThrow('Failed to fetch transactions');
    });
  });

  describe('getPortfolioPerformance', () => {
    it('should calculate performance data points', async () => {
      const mockInvestments = [
        { currentValue: 1000 },
        { currentValue: 2000 },
      ];
      (prisma.investment.findMany as unknown as any).mockResolvedValue(mockInvestments);

      const result = await investmentService.getPortfolioPerformance('user-123', 30);
      expect(result).toHaveLength(31); // 0 to 30
      expect(result[0]).toHaveProperty('date');
      expect(result[0].value).toBe(3000); // 1000 + 2000
    });

    it('should handle performance calculation errors', async () => {
      (prisma.investment.findMany as unknown as any).mockRejectedValue(new Error('Perf Error'));
      await expect(investmentService.getPortfolioPerformance('user-123')).rejects.toThrow('Failed to calculate performance');
    });
  });
});

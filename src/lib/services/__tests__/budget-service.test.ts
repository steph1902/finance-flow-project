import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import * as budgetService from '../budget-service';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Mock Prisma
const mockPrisma = {
    budget: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
    transaction: {
        groupBy: jest.fn(),
    },
};

(global as any).prisma = mockPrisma;

describe('Budget Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getBudgets', () => {
        it('should return budgets with calculated progress', async () => {
            const mockBudgets = [
                { id: 'b1', category: 'Food', amount: new Prisma.Decimal(500), userId: 'u1' },
                { id: 'b2', category: 'Rent', amount: new Prisma.Decimal(1000), userId: 'u1' },
            ];

            const mockSpending = [
                { category: 'Food', _sum: { amount: new Prisma.Decimal(250) } },
            ];

            (prisma.budget.findMany as unknown as any).mockResolvedValue(mockBudgets);
            (prisma.transaction.groupBy as unknown as any).mockResolvedValue(mockSpending);

            const result = await budgetService.getBudgets('u1', 1, 2024);

            expect(result).toHaveLength(2);

            const foodBudget = result.find(b => b.category === 'Food');
            expect(foodBudget).toBeDefined();
            expect(foodBudget?.amount).toBe(500);
            expect(foodBudget?.spent).toBe(250);
            expect(foodBudget?.remaining).toBe(250);
            expect(foodBudget?.progress).toBe(50);

            const rentBudget = result.find(b => b.category === 'Rent');
            expect(rentBudget).toBeDefined();
            expect(rentBudget?.spent).toBe(0); // No spending
            expect(rentBudget?.progress).toBe(0);
        });

        it('should handle errors', async () => {
            (prisma.budget.findMany as unknown as any).mockRejectedValue(new Error('DB Error'));
            await expect(budgetService.getBudgets('u1', 1, 2024)).rejects.toThrow('Failed to fetch budgets');
        });
    });

    describe('createBudget', () => {
        it('should create a budget', async () => {
            const input = {
                category: 'Food',
                amount: 500,
                month: 1,
                year: 2024,
            };

            const mockBudget = { id: 'b1', ...input, amount: new Prisma.Decimal(500) };
            (prisma.budget.create as unknown as any).mockResolvedValue(mockBudget);

            const result = await budgetService.createBudget('u1', input);

            expect(result).toEqual(mockBudget);
            expect(prisma.budget.create).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({
                    userId: 'u1',
                    amount: new Prisma.Decimal(500),
                }),
            }));
        });

        it('should handle duplicate budget error (P2002)', async () => {
            const error = new Prisma.PrismaClientKnownRequestError('Error', { code: 'P2002', clientVersion: '1' });
            (prisma.budget.create as unknown as any).mockRejectedValue(error);

            await expect(budgetService.createBudget('u1', {
                category: 'Food', amount: 500, month: 1, year: 2024
            })).rejects.toThrow('Budget for this category already exists for the selected month');
        });

        it('should handle other creation errors', async () => {
            (prisma.budget.create as unknown as any).mockRejectedValue(new Error('DB Error'));
            await expect(budgetService.createBudget('u1', {
                category: 'Food', amount: 500, month: 1, year: 2024
            })).rejects.toThrow('Failed to create budget');
        });
    });

    describe('updateBudget', () => {
        it('should update budget', async () => {
            (prisma.budget.findFirst as unknown as any).mockResolvedValue({ id: 'b1' });
            (prisma.budget.update as unknown as any).mockResolvedValue({ id: 'b1', amount: new Prisma.Decimal(600) });

            const result = await budgetService.updateBudget('u1', 'b1', { amount: 600 });
            expect(prisma.budget.update).toHaveBeenCalledWith(expect.objectContaining({
                where: { id: 'b1' },
                data: expect.objectContaining({ amount: new Prisma.Decimal(600) })
            }));
        });

        it('should throw if not found', async () => {
            (prisma.budget.findFirst as unknown as any).mockResolvedValue(null);
            await expect(budgetService.updateBudget('u1', 'b1', {})).rejects.toThrow('Budget not found');
        });
    });

    describe('deleteBudget', () => {
        it('should delete budget', async () => {
            (prisma.budget.findFirst as unknown as any).mockResolvedValue({ id: 'b1' });
            (prisma.budget.delete as unknown as any).mockResolvedValue({});

            await budgetService.deleteBudget('u1', 'b1');
            expect(prisma.budget.delete).toHaveBeenCalledWith({ where: { id: 'b1' } });
        });

        it('should throw if not found', async () => {
            (prisma.budget.findFirst as unknown as any).mockResolvedValue(null);
            await expect(budgetService.deleteBudget('u1', 'b1')).rejects.toThrow('Budget not found');
        });
    });
});

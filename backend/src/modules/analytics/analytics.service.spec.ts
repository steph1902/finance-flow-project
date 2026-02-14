import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { PrismaService } from '../../database/prisma.service';
import { mockPrismaService } from '../../../test/helpers/mocks';
import { Decimal } from '@prisma/client/runtime/library';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let prisma: jest.Mocked<PrismaService>;

  const userId = 'user-123';
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const mockTransactions = [
    {
      id: 'tx-1',
      userId,
      type: 'INCOME',
      amount: new Decimal(5000),
      category: 'Salary',
      date: new Date(now.getFullYear(), now.getMonth(), 5),
      description: 'Monthly salary',
    },
    {
      id: 'tx-2',
      userId,
      type: 'EXPENSE',
      amount: new Decimal(1500),
      category: 'Rent',
      date: new Date(now.getFullYear(), now.getMonth(), 1),
      description: 'Monthly rent',
    },
    {
      id: 'tx-3',
      userId,
      type: 'EXPENSE',
      amount: new Decimal(500),
      category: 'Food',
      date: new Date(now.getFullYear(), now.getMonth(), 10),
      description: 'Groceries',
    },
    {
      id: 'tx-4',
      userId,
      type: 'EXPENSE',
      amount: new Decimal(200),
      category: 'Food',
      date: new Date(now.getFullYear(), now.getMonth(), 15),
      description: 'Dining out',
    },
  ];

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    prisma = module.get(PrismaService) as jest.Mocked<PrismaService>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOverview', () => {
    it('should calculate correct financial overview', async () => {
      (prisma.transaction.findMany as jest.Mock).mockResolvedValue(mockTransactions);

      const result = await service.getOverview(userId, {});

      expect(prisma.transaction.findMany).toHaveBeenCalledWith({
        where: {
          userId,
          date: {
            gte: expect.any(Date),
            lte: expect.any(Date),
          },
        },
      });
      expect(result.totalIncome).toBe(5000);
      expect(result.totalExpenses).toBe(2200);
      expect(result.netSavings).toBe(2800);
      expect(result.transactionCount).toBe(4);
    });

    it('should use custom date range when provided', async () => {
      const customStart = new Date('2025-01-01');
      const customEnd = new Date('2025-01-31');
      (prisma.transaction.findMany as jest.Mock).mockResolvedValue([]);

      await service.getOverview(userId, {
        startDate: customStart,
        endDate: customEnd,
      });

      expect(prisma.transaction.findMany).toHaveBeenCalledWith({
        where: {
          userId,
          date: {
            gte: customStart,
            lte: customEnd,
          },
        },
      });
    });

    it('should return zeros when no transactions', async () => {
      (prisma.transaction.findMany as jest.Mock).mockResolvedValue([]);

      const result = await service.getOverview(userId, {});

      expect(result.totalIncome).toBe(0);
      expect(result.totalExpenses).toBe(0);
      expect(result.netSavings).toBe(0);
      expect(result.transactionCount).toBe(0);
    });
  });

  describe('getSpendingTrends', () => {
    it('should return spending trends for expenses only', async () => {
      const expenseTransactions = mockTransactions.filter((t) => t.type === 'EXPENSE');
      (prisma.transaction.findMany as jest.Mock).mockResolvedValue(expenseTransactions);

      const result = await service.getSpendingTrends(userId, {});

      expect(prisma.transaction.findMany).toHaveBeenCalledWith({
        where: {
          userId,
          type: 'EXPENSE',
          date: {
            gte: expect.any(Date),
            lte: expect.any(Date),
          },
        },
        orderBy: { date: 'asc' },
      });
      expect(result.trends).toBeDefined();
      expect(Array.isArray(result.trends)).toBe(true);
    });

    it('should return empty trends when no expenses', async () => {
      (prisma.transaction.findMany as jest.Mock).mockResolvedValue([]);

      const result = await service.getSpendingTrends(userId, {});

      expect(result.trends).toEqual([]);
    });
  });

  describe('getCategoryBreakdown', () => {
    it('should group expenses by category', async () => {
      const expenseTransactions = mockTransactions.filter((t) => t.type === 'EXPENSE');
      (prisma.transaction.findMany as jest.Mock).mockResolvedValue(expenseTransactions);

      const result = await service.getCategoryBreakdown(userId, {});

      expect(result.breakdown).toBeDefined();
      expect(Array.isArray(result.breakdown)).toBe(true);

      // Check Rent category (1500)
      const rentCategory = result.breakdown.find((b: any) => b.category === 'Rent');
      expect(rentCategory).toBeDefined();
      expect(rentCategory.amount).toBe(1500);

      // Check Food category (500 + 200 = 700)
      const foodCategory = result.breakdown.find((b: any) => b.category === 'Food');
      expect(foodCategory).toBeDefined();
      expect(foodCategory.amount).toBe(700);

      // Total should be 2200
      expect(result.total).toBe(2200);
    });

    it('should include percentage for each category', async () => {
      const expenseTransactions = mockTransactions.filter((t) => t.type === 'EXPENSE');
      (prisma.transaction.findMany as jest.Mock).mockResolvedValue(expenseTransactions);

      const result = await service.getCategoryBreakdown(userId, {});

      result.breakdown.forEach((item: any) => {
        expect(item.percentage).toBeDefined();
        expect(typeof item.percentage).toBe('number');
      });
    });

    it('should handle uncategorized transactions', async () => {
      const uncategorizedTx = [
        {
          id: 'tx-5',
          userId,
          type: 'EXPENSE',
          amount: new Decimal(100),
          category: null,
          date: new Date(),
        },
      ];
      (prisma.transaction.findMany as jest.Mock).mockResolvedValue(uncategorizedTx);

      const result = await service.getCategoryBreakdown(userId, {});

      const uncategorized = result.breakdown.find((b: any) => b.category === 'Uncategorized');
      expect(uncategorized).toBeDefined();
      expect(uncategorized.amount).toBe(100);
    });
  });

  describe('getIncomeVsExpenses', () => {
    it('should compare income and expenses by month', async () => {
      (prisma.transaction.findMany as jest.Mock).mockResolvedValue(mockTransactions);

      const result = await service.getIncomeVsExpenses(userId, {});

      expect(result.comparison).toBeDefined();
      expect(Array.isArray(result.comparison)).toBe(true);

      if (result.comparison.length > 0) {
        const monthData = result.comparison[0];
        expect(monthData).toHaveProperty('month');
        expect(monthData).toHaveProperty('income');
        expect(monthData).toHaveProperty('expenses');
        expect(monthData).toHaveProperty('netSavings');
      }
    });

    it('should calculate net savings correctly', async () => {
      (prisma.transaction.findMany as jest.Mock).mockResolvedValue(mockTransactions);

      const result = await service.getIncomeVsExpenses(userId, {});

      if (result.comparison.length > 0) {
        const monthData = result.comparison[0];
        expect(monthData.netSavings).toBe(monthData.income - monthData.expenses);
      }
    });
  });

  describe('getMonthlyComparison', () => {
    it('should compare current and previous month', async () => {
      (prisma.transaction.findMany as jest.Mock).mockResolvedValue(mockTransactions);

      const result = await service.getMonthlyComparison(userId, {});

      expect(result.current).toBeDefined();
      expect(result.previous).toBeDefined();
      expect(result.changes).toBeDefined();
      expect(result.changes).toHaveProperty('income');
      expect(result.changes).toHaveProperty('expenses');
      expect(result.changes).toHaveProperty('savings');
    });

    it('should return percentage changes', async () => {
      (prisma.transaction.findMany as jest.Mock).mockResolvedValue(mockTransactions);

      const result = await service.getMonthlyComparison(userId, {});

      expect(typeof result.changes.income).toBe('number');
      expect(typeof result.changes.expenses).toBe('number');
      expect(typeof result.changes.savings).toBe('number');
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

describe('AnalyticsController', () => {
  let controller: AnalyticsController;
  let analyticsService: jest.Mocked<AnalyticsService>;

  const mockAnalyticsService = {
    getOverview: jest.fn(),
    getSpendingTrends: jest.fn(),
    getCategoryBreakdown: jest.fn(),
    getIncomeVsExpenses: jest.fn(),
    getMonthlyComparison: jest.fn(),
  };

  const userId = 'user-123';
  const mockQuery = {};

  const mockOverview = {
    totalIncome: 5000,
    totalExpenses: 2200,
    netSavings: 2800,
    transactionCount: 4,
    period: { startDate: new Date(), endDate: new Date() },
  };

  const mockTrends = {
    trends: [
      { period: '2025-01-01', amount: 500 },
      { period: '2025-01-02', amount: 300 },
    ],
    period: { startDate: new Date(), endDate: new Date() },
  };

  const mockCategoryBreakdown = {
    breakdown: [
      { category: 'Rent', amount: 1500, percentage: 68.2 },
      { category: 'Food', amount: 700, percentage: 31.8 },
    ],
    total: 2200,
    period: { startDate: new Date(), endDate: new Date() },
  };

  const mockIncomeVsExpenses = {
    comparison: [{ month: '2025-01', income: 5000, expenses: 2200, netSavings: 2800 }],
    period: { startDate: new Date(), endDate: new Date() },
  };

  const mockMonthlyComparison = {
    current: mockOverview,
    previous: { ...mockOverview, totalIncome: 4500 },
    changes: { income: 11.1, expenses: 5.0, savings: 15.5 },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [
        {
          provide: AnalyticsService,
          useValue: mockAnalyticsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AnalyticsController>(AnalyticsController);
    analyticsService = module.get(AnalyticsService) as jest.Mocked<AnalyticsService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getOverview', () => {
    it('should return financial overview', async () => {
      mockAnalyticsService.getOverview.mockResolvedValue(mockOverview);

      const result = await controller.getOverview(userId, mockQuery);

      expect(analyticsService.getOverview).toHaveBeenCalledWith(userId, mockQuery);
      expect(result).toEqual(mockOverview);
    });

    it('should pass query parameters to service', async () => {
      const customQuery = { startDate: new Date('2025-01-01'), endDate: new Date('2025-01-31') };
      mockAnalyticsService.getOverview.mockResolvedValue(mockOverview);

      await controller.getOverview(userId, customQuery);

      expect(analyticsService.getOverview).toHaveBeenCalledWith(userId, customQuery);
    });
  });

  describe('getSpendingTrends', () => {
    it('should return spending trends', async () => {
      mockAnalyticsService.getSpendingTrends.mockResolvedValue(mockTrends);

      const result = await controller.getSpendingTrends(userId, mockQuery);

      expect(analyticsService.getSpendingTrends).toHaveBeenCalledWith(userId, mockQuery);
      expect(result).toEqual(mockTrends);
    });
  });

  describe('getCategoryBreakdown', () => {
    it('should return category breakdown', async () => {
      mockAnalyticsService.getCategoryBreakdown.mockResolvedValue(mockCategoryBreakdown);

      const result = await controller.getCategoryBreakdown(userId, mockQuery);

      expect(analyticsService.getCategoryBreakdown).toHaveBeenCalledWith(userId, mockQuery);
      expect(result).toEqual(mockCategoryBreakdown);
    });
  });

  describe('getIncomeVsExpenses', () => {
    it('should return income vs expenses comparison', async () => {
      mockAnalyticsService.getIncomeVsExpenses.mockResolvedValue(mockIncomeVsExpenses);

      const result = await controller.getIncomeVsExpenses(userId, mockQuery);

      expect(analyticsService.getIncomeVsExpenses).toHaveBeenCalledWith(userId, mockQuery);
      expect(result).toEqual(mockIncomeVsExpenses);
    });
  });

  describe('getMonthlyComparison', () => {
    it('should return monthly comparison', async () => {
      mockAnalyticsService.getMonthlyComparison.mockResolvedValue(mockMonthlyComparison);

      const result = await controller.getMonthlyComparison(userId, mockQuery);

      expect(analyticsService.getMonthlyComparison).toHaveBeenCalledWith(userId, mockQuery);
      expect(result).toEqual(mockMonthlyComparison);
    });
  });
});

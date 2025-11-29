import { Test, TestingModule } from '@nestjs/testing';
import { BudgetsController } from './budgets.controller';
import { BudgetsService } from './budgets.service';

describe('BudgetsController', () => {
  let controller: BudgetsController;
  let service: jest.Mocked<BudgetsService>;

  const mockUserId = 'user-123';
  const mockBudgetId = 'budget-123';

  const mockBudgetResponse = {
    id: mockBudgetId,
    userId: mockUserId,
    category: 'GROCERIES',
    amount: 500,
    spent: 350,
    remaining: 150,
    percentUsed: 70,
    startDate: new Date('2025-11-01'),
    endDate: new Date('2025-11-30'),
    rollover: false,
    alertThreshold: 80,
    isOverBudget: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockBudgetsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getBudgetSummary: jest.fn(),
    optimizeBudgets: jest.fn(),
    createSharedBudget: jest.fn(),
    processRollover: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BudgetsController],
      providers: [
        {
          provide: BudgetsService,
          useValue: mockBudgetsService,
        },
      ],
    }).compile();

    controller = module.get<BudgetsController>(BudgetsController);
    service = module.get(BudgetsService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new budget', async () => {
      const createDto = {
        category: 'GROCERIES',
        amount: 500,
        startDate: new Date('2025-11-01'),
        endDate: new Date('2025-11-30'),
        rollover: false,
        alertThreshold: 80,
      };

      service.create.mockResolvedValue(mockBudgetResponse);

      const result = await controller.create(mockUserId, createDto);

      expect(service.create).toHaveBeenCalledWith(mockUserId, createDto);
      expect(result).toEqual(mockBudgetResponse);
    });
  });

  describe('findAll', () => {
    it('should return all budgets for user', async () => {
      const budgets = [mockBudgetResponse];
      service.findAll.mockResolvedValue(budgets);

      const query = { category: 'GROCERIES' };
      const result = await controller.findAll(mockUserId, query);

      expect(service.findAll).toHaveBeenCalledWith(mockUserId, query);
      expect(result).toEqual(budgets);
    });
  });

  describe('getSummary', () => {
    it('should return budget summary', async () => {
      const summary = {
        totalBudgeted: 500,
        totalSpent: 350,
        totalRemaining: 150,
        overallPercentUsed: 70,
        categoryBreakdown: [],
        period: {
          start: new Date('2025-11-01'),
          end: new Date('2025-11-30'),
        },
      };

      service.getBudgetSummary.mockResolvedValue(summary);

      const result = await controller.getSummary(mockUserId, '2025-11');

      expect(service.getBudgetSummary).toHaveBeenCalledWith(mockUserId, '2025-11');
      expect(result).toEqual(summary);
    });
  });

  describe('findOne', () => {
    it('should return a budget by id', async () => {
      service.findOne.mockResolvedValue(mockBudgetResponse);

      const result = await controller.findOne(mockUserId, mockBudgetId);

      expect(service.findOne).toHaveBeenCalledWith(mockUserId, mockBudgetId);
      expect(result).toEqual(mockBudgetResponse);
    });
  });

  describe('update', () => {
    it('should update a budget', async () => {
      const updateDto = { amount: 600 };
      const updatedBudget = { ...mockBudgetResponse, amount: 600 };

      service.update.mockResolvedValue(updatedBudget);

      const result = await controller.update(mockUserId, mockBudgetId, updateDto);

      expect(service.update).toHaveBeenCalledWith(mockUserId, mockBudgetId, updateDto);
      expect(result).toEqual(updatedBudget);
    });
  });

  describe('remove', () => {
    it('should delete a budget', async () => {
      service.remove.mockResolvedValue(undefined);

      await controller.remove(mockUserId, mockBudgetId);

      expect(service.remove).toHaveBeenCalledWith(mockUserId, mockBudgetId);
    });
  });

  describe('optimize', () => {
    it('should call optimize budgets', async () => {
      const optimizeDto = { targetSavings: 1000 };
      service.optimizeBudgets.mockResolvedValue({ recommendations: [] });

      const result = await controller.optimize(mockUserId, optimizeDto);

      expect(service.optimizeBudgets).toHaveBeenCalledWith(mockUserId, optimizeDto);
      expect(result).toHaveProperty('recommendations');
    });
  });

  describe('createShared', () => {
    it('should create a shared budget', async () => {
      const createSharedDto = {
        category: 'GROCERIES',
        amount: 500,
        startDate: new Date(),
        endDate: new Date(),
        sharedWith: ['user-456'],
      };

      service.createSharedBudget.mockResolvedValue({ id: 'shared-123' });

      const result = await controller.createShared(mockUserId, createSharedDto);

      expect(service.createSharedBudget).toHaveBeenCalledWith(mockUserId, createSharedDto);
      expect(result).toHaveProperty('id');
    });
  });

  describe('rollover', () => {
    it('should process budget rollover', async () => {
      service.processRollover.mockResolvedValue({ message: 'Budget rollover processed successfully' });

      const result = await controller.rollover(mockUserId);

      expect(service.processRollover).toHaveBeenCalledWith(mockUserId);
      expect(result.message).toBe('Budget rollover processed successfully');
    });
  });
});

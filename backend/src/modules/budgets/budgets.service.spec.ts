import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { BudgetRepository } from './repositories/budget.repository';
import { Decimal } from '@prisma/client/runtime/library';

describe('BudgetsService', () => {
  let service: BudgetsService;
  let repository: jest.Mocked<BudgetRepository>;

  const mockUserId = 'user-123';
  const mockBudgetId = 'budget-123';

  const mockBudget = {
    id: mockBudgetId,
    userId: mockUserId,
    category: 'GROCERIES',
    amount: new Decimal(500),
    spent: new Decimal(350),
    startDate: new Date('2025-11-01'),
    endDate: new Date('2025-11-30'),
    rollover: false,
    alertThreshold: new Decimal(80),
    createdAt: new Date(),
    updatedAt: new Date(),
    month: 1,
    year: 2024,
  };

  const mockBudgetRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findOverlapping: jest.fn(),
    findRolloverCandidates: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BudgetsService,
        {
          provide: BudgetRepository,
          useValue: mockBudgetRepository,
        },
      ],
    }).compile();

    service = module.get<BudgetsService>(BudgetsService);
    repository = module.get(BudgetRepository);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new budget successfully', async () => {
      const createDto = {
        category: 'GROCERIES',
        amount: 500,
        startDate: new Date('2025-11-01'),
        endDate: new Date('2025-11-30'),
        rollover: false,
        alertThreshold: 80,
      };

      repository.findOverlapping.mockResolvedValue([]);
      repository.create.mockResolvedValue(mockBudget);

      const result = await service.create(mockUserId, createDto);

      expect(repository.findOverlapping).toHaveBeenCalledWith(
        mockUserId,
        createDto.category,
        createDto.startDate,
        createDto.endDate,
      );
      expect(repository.create).toHaveBeenCalledWith({
        ...createDto,
        userId: mockUserId,
        spent: new Decimal(0),
      });
      expect(result).toEqual({
        id: mockBudgetId,
        userId: mockUserId,
        category: 'GROCERIES',
        amount: 500,
        spent: 350,
        remaining: 150,
        percentUsed: 70,
        startDate: mockBudget.startDate,
        endDate: mockBudget.endDate,
        rollover: false,
        alertThreshold: 80,
        isOverBudget: false,
        createdAt: mockBudget.createdAt,
        updatedAt: mockBudget.updatedAt,
      });
    });

    it('should throw BadRequestException if end date is before start date', async () => {
      const createDto = {
        category: 'GROCERIES',
        amount: 500,
        startDate: new Date('2025-11-30'),
        endDate: new Date('2025-11-01'),
        rollover: false,
        alertThreshold: 80,
      };

      await expect(service.create(mockUserId, createDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(mockUserId, createDto)).rejects.toThrow(
        'End date must be after start date',
      );
      expect(repository.findOverlapping).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if overlapping budget exists', async () => {
      const createDto = {
        category: 'GROCERIES',
        amount: 500,
        startDate: new Date('2025-11-01'),
        endDate: new Date('2025-11-30'),
        rollover: false,
        alertThreshold: 80,
      };

      repository.findOverlapping.mockResolvedValue([mockBudget]);

      await expect(service.create(mockUserId, createDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(mockUserId, createDto)).rejects.toThrow(
        'Budget for category "GROCERIES" already exists for this period',
      );
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all budgets for user', async () => {
      const budgets = [mockBudget, { ...mockBudget, id: 'budget-456' }];
      repository.findAll.mockResolvedValue(budgets);

      const query = { category: 'GROCERIES' };
      const result = await service.findAll(mockUserId, query);

      expect(repository.findAll).toHaveBeenCalledWith(mockUserId, query);
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('percentUsed');
      expect(result[0]).toHaveProperty('remaining');
    });

    it('should return empty array if no budgets found', async () => {
      repository.findAll.mockResolvedValue([]);

      const result = await service.findAll(mockUserId, {});

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a budget by id', async () => {
      repository.findById.mockResolvedValue(mockBudget);

      const result = await service.findOne(mockUserId, mockBudgetId);

      expect(repository.findById).toHaveBeenCalledWith(mockBudgetId, mockUserId);
      expect(result.id).toBe(mockBudgetId);
      expect(result).toHaveProperty('percentUsed', 70);
    });

    it('should throw NotFoundException if budget not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findOne(mockUserId, 'nonexistent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne(mockUserId, 'nonexistent')).rejects.toThrow(
        'Budget with ID nonexistent not found',
      );
    });
  });

  describe('update', () => {
    it('should update a budget successfully', async () => {
      const updateDto = {
        amount: 600,
        alertThreshold: 75,
      };

      const updatedBudget = {
        ...mockBudget,
        amount: new Decimal(600),
        alertThreshold: new Decimal(75),
      };

      repository.findById.mockResolvedValue(mockBudget);
      repository.update.mockResolvedValue(updatedBudget);

      const result = await service.update(mockUserId, mockBudgetId, updateDto);

      expect(repository.findById).toHaveBeenCalledWith(mockBudgetId, mockUserId);
      expect(repository.update).toHaveBeenCalledWith(mockBudgetId, updateDto);
      expect(result.amount).toBe(600);
      expect(result.alertThreshold).toBe(75);
    });

    it('should throw NotFoundException if budget not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        service.update(mockUserId, 'nonexistent', { amount: 600 }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a budget successfully', async () => {
      repository.findById.mockResolvedValue(mockBudget);
      repository.delete.mockResolvedValue(mockBudget);

      await service.remove(mockUserId, mockBudgetId);

      expect(repository.findById).toHaveBeenCalledWith(mockBudgetId, mockUserId);
      expect(repository.delete).toHaveBeenCalledWith(mockBudgetId);
    });

    it('should throw NotFoundException if budget not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.remove(mockUserId, 'nonexistent')).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });

  describe('getBudgetSummary', () => {
    it('should return budget summary for current month', async () => {
      const budgets = [
        mockBudget,
        {
          ...mockBudget,
          id: 'budget-456',
          category: 'ENTERTAINMENT',
          amount: new Decimal(200),
          spent: new Decimal(150),
        },
      ];

      repository.findAll.mockResolvedValue(budgets);

      const result = await service.getBudgetSummary(mockUserId);

      expect(result).toMatchObject({
        totalBudgeted: 700,
        totalSpent: 500,
        totalRemaining: 200,
        overallPercentUsed: expect.any(Number),
      });
      expect(result.categoryBreakdown).toHaveLength(2);
      expect(result.categoryBreakdown[0]).toMatchObject({
        category: 'GROCERIES',
        budgeted: 500,
        spent: 350,
        remaining: 150,
        percentUsed: 70,
        isOverBudget: false,
      });
      expect(result.period).toHaveProperty('start');
      expect(result.period).toHaveProperty('end');
    });

    it('should return budget summary for specific month', async () => {
      repository.findAll.mockResolvedValue([mockBudget]);

      const result = await service.getBudgetSummary(mockUserId, '2025-11');

      expect(repository.findAll).toHaveBeenCalledWith(
        mockUserId,
        expect.objectContaining({
          startDate: expect.any(Date),
          endDate: expect.any(Date),
        }),
      );
      expect(result.totalBudgeted).toBe(500);
    });

    it('should handle over-budget scenarios', async () => {
      const overBudget = {
        ...mockBudget,
        spent: new Decimal(600), // Over the 500 budget
      };

      repository.findAll.mockResolvedValue([overBudget]);

      const result = await service.getBudgetSummary(mockUserId);

      expect(result.categoryBreakdown[0]?.isOverBudget).toBe(true);
      expect(result.categoryBreakdown[0]?.percentUsed).toBe(120);
    });

    it('should handle zero budgets', async () => {
      repository.findAll.mockResolvedValue([]);

      const result = await service.getBudgetSummary(mockUserId);

      expect(result.totalBudgeted).toBe(0);
      expect(result.totalSpent).toBe(0);
      expect(result.overallPercentUsed).toBe(0);
      expect(result.categoryBreakdown).toHaveLength(0);
    });
  });

  describe('processRollover', () => {
    it('should rollover budgets with remaining balance', async () => {
      const rolloverBudget = {
        ...mockBudget,
        rollover: true,
        spent: new Decimal(300), // 200 remaining
      };

      repository.findRolloverCandidates.mockResolvedValue([rolloverBudget]);
      repository.create.mockResolvedValue(rolloverBudget);

      const result = await service.processRollover(mockUserId);

      expect(repository.findRolloverCandidates).toHaveBeenCalledWith(mockUserId);
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockUserId,
          category: 'GROCERIES',
          amount: new Decimal(700), // 500 + 200 rollover
          spent: new Decimal(0),
          rollover: true,
        }),
      );
      expect(result.message).toBe('Budget rollover processed successfully');
    });

    it('should not rollover budgets without balance', async () => {
      const noRolloverBudget = {
        ...mockBudget,
        rollover: true,
        spent: new Decimal(500), // No remaining
      };

      repository.findRolloverCandidates.mockResolvedValue([noRolloverBudget]);

      const result = await service.processRollover(mockUserId);

      expect(repository.create).not.toHaveBeenCalled();
      expect(result.message).toBe('Budget rollover processed successfully');
    });

    it('should not rollover budgets with rollover disabled', async () => {
      const noRolloverBudget = {
        ...mockBudget,
        rollover: false,
      };

      repository.findRolloverCandidates.mockResolvedValue([noRolloverBudget]);

      const result = await service.processRollover(mockUserId);

      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('optimizeBudgets', () => {
    it('should throw error for unimplemented feature', async () => {
      await expect(
        service.optimizeBudgets(mockUserId, { totalIncome: 5000 }),
      ).rejects.toThrow('Budget optimization not yet implemented');
    });
  });

  describe('createSharedBudget', () => {
    it('should throw error for unimplemented feature', async () => {
      await expect(
        service.createSharedBudget(mockUserId, {
          name: 'Shared Budget',
          category: 'GROCERIES',
          amount: 500,
          startDate: new Date(),
          endDate: new Date(),
          sharedWith: ['user-456'],
        }),
      ).rejects.toThrow('Shared budgets not yet implemented');
    });
  });
});

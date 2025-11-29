import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { GoalRepository } from './repositories/goal.repository';
import { Decimal } from '@prisma/client/runtime/library';
import { GoalStatus } from '@prisma/client';

describe('GoalsService', () => {
  let service: GoalsService;
  let repository: jest.Mocked<GoalRepository>;

  const mockUserId = 'user-123';
  const mockGoalId = 'goal-123';

  const mockGoal = {
    id: mockGoalId,
    userId: mockUserId,
    name: 'Emergency Fund',
    description: 'Save for emergencies',
    targetAmount: new Decimal(10000),
    currentAmount: new Decimal(5000),
    targetDate: new Date('2026-12-31'),
    category: 'SAVINGS',
    priority: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: GoalStatus.ACTIVE,
    reminderEnabled: true,
    completedAt: null,
  };

  const mockGoalRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoalsService,
        {
          provide: GoalRepository,
          useValue: mockGoalRepository,
        },
      ],
    }).compile();

    service = module.get<GoalsService>(GoalsService);
    repository = module.get(GoalRepository);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new goal successfully', async () => {
      const createDto = {
        name: 'Emergency Fund',
        description: 'Save for emergencies',
        targetAmount: 10000,
        currentAmount: 0,
        targetDate: new Date('2026-12-31'),
        category: 'SAVINGS',
        priority: 1,
      };

      repository.create.mockResolvedValue(mockGoal);

      const result = await service.create(mockUserId, createDto);

      expect(repository.create).toHaveBeenCalledWith({
        ...createDto,
        userId: mockUserId,
        currentAmount: new Decimal(0),
        targetAmount: new Decimal(10000),
      });
      expect(result).toEqual(mockGoal);
    });

    it('should create a goal with initial amount', async () => {
      const createDto = {
        name: 'Vacation Fund',
        targetAmount: 5000,
        currentAmount: 1000,
        targetDate: new Date('2026-06-01'),
        category: 'TRAVEL',
        priority: 2,
      };

      const goalWithInitialAmount = {
        ...mockGoal,
        currentAmount: new Decimal(1000),
        targetAmount: new Decimal(5000),
      };

      repository.create.mockResolvedValue(goalWithInitialAmount);

      const result = await service.create(mockUserId, createDto);

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          currentAmount: new Decimal(1000),
        }),
      );
      expect(result.currentAmount).toEqual(new Decimal(1000));
    });
  });

  describe('findAll', () => {
    it('should return all goals with enriched data', async () => {
      const goals = [mockGoal, { ...mockGoal, id: 'goal-456' }];
      repository.findAll.mockResolvedValue(goals);

      const result = await service.findAll(mockUserId);

      expect(repository.findAll).toHaveBeenCalledWith(mockUserId);
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('progress');
      expect(result[0]).toHaveProperty('remaining');
      expect(result[0]).toHaveProperty('isCompleted');
      expect(result[0]).toHaveProperty('projectedCompletion');
      expect(result[0].currentAmount).toBe(5000);
      expect(result[0].targetAmount).toBe(10000);
      expect(result[0].progress).toBe(50);
      expect(result[0].remaining).toBe(5000);
      expect(result[0].isCompleted).toBe(false);
    });

    it('should return empty array if no goals found', async () => {
      repository.findAll.mockResolvedValue([]);

      const result = await service.findAll(mockUserId);

      expect(result).toEqual([]);
    });

    it('should calculate 100% progress for completed goals', async () => {
      const completedGoal = {
        ...mockGoal,
        currentAmount: new Decimal(10000),
      };

      repository.findAll.mockResolvedValue([completedGoal]);

      const result = await service.findAll(mockUserId);

      expect(result[0].progress).toBe(100);
      expect(result[0].isCompleted).toBe(true);
      expect(result[0].remaining).toBe(0);
    });
  });

  describe('findOne', () => {
    it('should return a goal by id with enriched data', async () => {
      repository.findById.mockResolvedValue(mockGoal);

      const result = await service.findOne(mockUserId, mockGoalId);

      expect(repository.findById).toHaveBeenCalledWith(mockGoalId, mockUserId);
      expect(result.id).toBe(mockGoalId);
      expect(result).toHaveProperty('progress', 50);
      expect(result).toHaveProperty('remaining', 5000);
    });

    it('should throw NotFoundException if goal not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findOne(mockUserId, 'nonexistent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne(mockUserId, 'nonexistent')).rejects.toThrow(
        'Goal with ID nonexistent not found',
      );
    });
  });

  describe('update', () => {
    it('should update a goal successfully', async () => {
      const updateDto = {
        name: 'Updated Emergency Fund',
        targetAmount: 15000,
      };

      const updatedGoal = {
        ...mockGoal,
        name: 'Updated Emergency Fund',
        targetAmount: new Decimal(15000),
      };

      repository.findById.mockResolvedValue(mockGoal);
      repository.update.mockResolvedValue(updatedGoal);

      const result = await service.update(mockUserId, mockGoalId, updateDto);

      expect(repository.findById).toHaveBeenCalledWith(mockGoalId, mockUserId);
      expect(repository.update).toHaveBeenCalledWith(
        mockGoalId,
        expect.objectContaining({
          name: 'Updated Emergency Fund',
          targetAmount: new Decimal(15000),
        }),
      );
      expect(result.name).toBe('Updated Emergency Fund');
      expect(result.targetAmount).toBe(15000);
    });

    it('should update current amount', async () => {
      const updateDto = {
        currentAmount: 7000,
      };

      const updatedGoal = {
        ...mockGoal,
        currentAmount: new Decimal(7000),
      };

      repository.findById.mockResolvedValue(mockGoal);
      repository.update.mockResolvedValue(updatedGoal);

      const result = await service.update(mockUserId, mockGoalId, updateDto);

      expect(repository.update).toHaveBeenCalledWith(
        mockGoalId,
        expect.objectContaining({
          currentAmount: new Decimal(7000),
        }),
      );
      expect(result.currentAmount).toBe(7000);
      expect(result.progress).toBe(70);
    });

    it('should throw NotFoundException if goal not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        service.update(mockUserId, 'nonexistent', { name: 'Test' }),
      ).rejects.toThrow(NotFoundException);
      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a goal successfully', async () => {
      repository.findById.mockResolvedValue(mockGoal);
      repository.delete.mockResolvedValue(mockGoal);

      await service.remove(mockUserId, mockGoalId);

      expect(repository.findById).toHaveBeenCalledWith(mockGoalId, mockUserId);
      expect(repository.delete).toHaveBeenCalledWith(mockGoalId);
    });

    it('should throw NotFoundException if goal not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.remove(mockUserId, 'nonexistent')).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });

  describe('addContribution', () => {
    it('should add contribution to goal', async () => {
      const contributionAmount = 1000;
      const updatedGoal = {
        ...mockGoal,
        currentAmount: new Decimal(6000),
      };

      repository.findById.mockResolvedValue(mockGoal);
      repository.update.mockResolvedValue(updatedGoal);

      const result = await service.addContribution(mockUserId, mockGoalId, contributionAmount);

      expect(repository.findById).toHaveBeenCalledWith(mockGoalId, mockUserId);
      expect(repository.update).toHaveBeenCalledWith(
        mockGoalId,
        expect.objectContaining({
          currentAmount: new Decimal(6000),
        }),
      );
      expect(result.currentAmount).toBe(6000);
      expect(result.progress).toBe(60);
    });

    it('should mark goal as completed when contribution reaches target', async () => {
      const contributionAmount = 5000;
      const completedGoal = {
        ...mockGoal,
        currentAmount: new Decimal(10000),
      };

      repository.findById.mockResolvedValue(mockGoal);
      repository.update.mockResolvedValue(completedGoal);

      const result = await service.addContribution(mockUserId, mockGoalId, contributionAmount);

      expect(result.isCompleted).toBe(true);
      expect(result.progress).toBe(100);
      expect(result.remaining).toBe(0);
    });

    it('should throw NotFoundException if goal not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        service.addContribution(mockUserId, 'nonexistent', 1000),
      ).rejects.toThrow(NotFoundException);
      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('enrichGoalData', () => {
    it('should calculate progress correctly', async () => {
      repository.findById.mockResolvedValue(mockGoal);

      const result = await service.findOne(mockUserId, mockGoalId);

      expect(result.progress).toBe(50);
    });

    it('should handle zero target amount', async () => {
      const zeroTargetGoal = {
        ...mockGoal,
        targetAmount: new Decimal(0),
      };

      repository.findById.mockResolvedValue(zeroTargetGoal);

      const result = await service.findOne(mockUserId, mockGoalId);

      expect(result.progress).toBe(0);
    });

    it('should calculate remaining amount', async () => {
      repository.findById.mockResolvedValue(mockGoal);

      const result = await service.findOne(mockUserId, mockGoalId);

      expect(result.remaining).toBe(5000);
    });

    it('should determine completion status', async () => {
      const completedGoal = {
        ...mockGoal,
        currentAmount: new Decimal(10000),
      };

      repository.findById.mockResolvedValue(completedGoal);

      const result = await service.findOne(mockUserId, mockGoalId);

      expect(result.isCompleted).toBe(true);
    });

    it('should calculate projected completion date', async () => {
      const recentGoal = {
        ...mockGoal,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        currentAmount: new Decimal(3000),
      };

      repository.findById.mockResolvedValue(recentGoal);

      const result = await service.findOne(mockUserId, mockGoalId);

      expect(result.projectedCompletion).toBeDefined();
      expect(result.projectedCompletion).toBeInstanceOf(Date);
    });
  });
});

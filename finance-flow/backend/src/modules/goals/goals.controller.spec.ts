import { Test, TestingModule } from '@nestjs/testing';
import { GoalsController } from './goals.controller';
import { GoalsService } from './goals.service';
import { Decimal } from '@prisma/client/runtime/library';

describe('GoalsController', () => {
  let controller: GoalsController;
  let service: jest.Mocked<GoalsService>;

  const mockUserId = 'user-123';
  const mockGoalId = 'goal-123';

  const mockGoalResponse = {
    id: mockGoalId,
    userId: mockUserId,
    name: 'Emergency Fund',
    description: 'Save for emergencies',
    targetAmount: new Decimal(10000),
    currentAmount: new Decimal(5000),
    progress: 50,
    remaining: 5000,
    targetDate: new Date('2026-12-31'),
    category: 'SAVINGS',
    priority: 1, // High priority
    isCompleted: false,
    projectedCompletion: new Date('2026-11-15'),
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'ACTIVE' as any, // GoalStatus.ACTIVE
    reminderEnabled: true,
    completedAt: null,
  };

  const mockGoalsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    addContribution: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoalsController],
      providers: [
        {
          provide: GoalsService,
          useValue: mockGoalsService,
        },
      ],
    }).compile();

    controller = module.get<GoalsController>(GoalsController);
    service = module.get(GoalsService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new goal', async () => {
      const createDto = {
        name: 'Emergency Fund',
        targetAmount: 10000,
        targetDate: new Date('2026-12-31'),
        category: 'SAVINGS',
        priority: 1,
      };

      service.create.mockResolvedValue(mockGoalResponse);

      const result = await controller.create(mockUserId, createDto);

      expect(service.create).toHaveBeenCalledWith(mockUserId, createDto);
      expect(result).toEqual(mockGoalResponse);
    });
  });

  describe('findAll', () => {
    it('should return all goals for user', async () => {
      const goals = [mockGoalResponse];
      service.findAll.mockResolvedValue(goals);

      const result = await controller.findAll(mockUserId);

      expect(service.findAll).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual(goals);
    });
  });

  describe('findOne', () => {
    it('should return a goal by id', async () => {
      service.findOne.mockResolvedValue(mockGoalResponse);

      const result = await controller.findOne(mockUserId, mockGoalId);

      expect(service.findOne).toHaveBeenCalledWith(mockUserId, mockGoalId);
      expect(result).toEqual(mockGoalResponse);
    });
  });

  describe('update', () => {
    it('should update a goal', async () => {
      const updateDto = { name: 'Updated Emergency Fund' };
      const updatedGoal = { ...mockGoalResponse, name: 'Updated Emergency Fund' };

      service.update.mockResolvedValue(updatedGoal);

      const result = await controller.update(mockUserId, mockGoalId, updateDto);

      expect(service.update).toHaveBeenCalledWith(mockUserId, mockGoalId, updateDto);
      expect(result).toEqual(updatedGoal);
    });
  });

  describe('remove', () => {
    it('should delete a goal', async () => {
      service.remove.mockResolvedValue(undefined);

      await controller.remove(mockUserId, mockGoalId);

      expect(service.remove).toHaveBeenCalledWith(mockUserId, mockGoalId);
    });
  });

  describe('contribute', () => {
    it('should add contribution to goal', async () => {
      const contributeDto = { amount: 1000 };
      const updatedGoal = {
        ...mockGoalResponse,
        currentAmount: 6000,
        progress: 60,
        remaining: 4000,
      };

      service.addContribution.mockResolvedValue(updatedGoal);

      const result = await controller.contribute(mockUserId, mockGoalId, contributeDto);

      expect(service.addContribution).toHaveBeenCalledWith(mockUserId, mockGoalId, 1000);
      expect(result).toEqual(updatedGoal);
    });
  });
});

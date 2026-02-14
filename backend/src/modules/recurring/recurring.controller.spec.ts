import { Test, TestingModule } from '@nestjs/testing';
import { RecurringController } from './recurring.controller';
import { RecurringService } from './recurring.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

describe('RecurringController', () => {
  let controller: RecurringController;
  let recurringService: jest.Mocked<RecurringService>;

  const mockRecurringService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    skipNext: jest.fn(),
  };

  const userId = 'user-123';
  const recurringId = 'recurring-123';

  const mockRecurring = {
    id: recurringId,
    userId,
    description: 'Monthly Rent',
    amount: 1500,
    type: 'EXPENSE',
    category: 'Rent',
    frequency: 'MONTHLY',
    nextDate: new Date(),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecurringController],
      providers: [
        {
          provide: RecurringService,
          useValue: mockRecurringService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<RecurringController>(RecurringController);
    recurringService = module.get(RecurringService) as jest.Mocked<RecurringService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      description: 'Monthly Rent',
      amount: 1500,
      type: 'EXPENSE' as const,
      category: 'Rent',
      frequency: 'MONTHLY' as const,
      startDate: new Date(),
    };

    it('should create a recurring transaction', async () => {
      mockRecurringService.create.mockResolvedValue(mockRecurring);

      const result = await controller.create(userId, createDto);

      expect(recurringService.create).toHaveBeenCalledWith(userId, createDto);
      expect(result).toEqual(mockRecurring);
    });
  });

  describe('findAll', () => {
    it('should return all recurring transactions', async () => {
      mockRecurringService.findAll.mockResolvedValue([mockRecurring]);

      const result = await controller.findAll(userId);

      expect(recurringService.findAll).toHaveBeenCalledWith(userId);
      expect(result).toEqual([mockRecurring]);
    });

    it('should return empty array when no recurring transactions', async () => {
      mockRecurringService.findAll.mockResolvedValue([]);

      const result = await controller.findAll(userId);

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a recurring transaction by id', async () => {
      mockRecurringService.findOne.mockResolvedValue(mockRecurring);

      const result = await controller.findOne(userId, recurringId);

      expect(recurringService.findOne).toHaveBeenCalledWith(userId, recurringId);
      expect(result).toEqual(mockRecurring);
    });

    it('should pass through not found errors', async () => {
      mockRecurringService.findOne.mockRejectedValue(new Error('Not found'));

      await expect(controller.findOne(userId, 'nonexistent')).rejects.toThrow('Not found');
    });
  });

  describe('update', () => {
    const updateDto = { amount: 1600 };

    it('should update a recurring transaction', async () => {
      const updated = { ...mockRecurring, amount: 1600 };
      mockRecurringService.update.mockResolvedValue(updated);

      const result = await controller.update(userId, recurringId, updateDto);

      expect(recurringService.update).toHaveBeenCalledWith(userId, recurringId, updateDto);
      expect(result.amount).toBe(1600);
    });
  });

  describe('remove', () => {
    it('should delete a recurring transaction', async () => {
      mockRecurringService.remove.mockResolvedValue(undefined);

      await controller.remove(userId, recurringId);

      expect(recurringService.remove).toHaveBeenCalledWith(userId, recurringId);
    });
  });

  describe('skipNext', () => {
    it('should skip the next occurrence', async () => {
      const skipped = {
        ...mockRecurring,
        nextDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };
      mockRecurringService.skipNext.mockResolvedValue(skipped);

      const result = await controller.skipNext(userId, recurringId);

      expect(recurringService.skipNext).toHaveBeenCalledWith(userId, recurringId);
      expect(result).toEqual(skipped);
    });
  });
});

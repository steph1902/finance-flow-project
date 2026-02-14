import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RecurringService } from './recurring.service';
import { RecurringRepository } from './repositories/recurring.repository';
import { Decimal } from '@prisma/client/runtime/library';

import { RecurringFrequency, TransactionType } from '@prisma/client';

describe('RecurringService', () => {
  let service: RecurringService;
  let repository: jest.Mocked<RecurringRepository>;

  const mockUserId = 'user-123';
  const mockRecurringId = 'recurring-123';

  const mockRecurring = {
    id: mockRecurringId,
    userId: mockUserId,
    amount: new Decimal(100),
    description: 'Monthly Rent',
    frequency: RecurringFrequency.MONTHLY,
    startDate: new Date(),
    endDate: null,
    nextRun: new Date(),
    active: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    notes: 'Some notes',
    lastGenerated: new Date(),
    categoryId: 'cat-123',
    type: TransactionType.EXPENSE,
    category: 'HOUSING',
    nextDate: new Date(),
  };

  const mockRecurringRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecurringService,
        {
          provide: RecurringRepository,
          useValue: mockRecurringRepository,
        },
      ],
    }).compile();

    service = module.get<RecurringService>(RecurringService);
    repository = module.get(RecurringRepository);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new recurring transaction', async () => {
      const createDto = {
        description: 'Monthly Rent',
        amount: 1500,
        frequency: RecurringFrequency.MONTHLY,
        category: 'HOUSING',
        type: TransactionType.EXPENSE,
        startDate: new Date('2025-01-01'),
      };

      repository.create.mockResolvedValue(mockRecurring);

      const result = await service.create(mockUserId, createDto);

      expect(repository.create).toHaveBeenCalledWith({
        userId: mockUserId,
        amount: new Decimal(1500), // Amount from createDto
        description: 'Monthly Rent',
        frequency: RecurringFrequency.MONTHLY, // Frequency from createDto
        startDate: createDto.startDate,
        categoryId: 'cat-123', // Assuming a default or derived categoryId
        active: true,
        nextRun: expect.any(Date),
      });
      expect(result).toEqual(mockRecurring);
    });

    it('should calculate next date for daily frequency', async () => {
      const createDto = {
        description: 'Daily Expense',
        amount: 10,
        frequency: RecurringFrequency.DAILY,
        category: 'OTHER',
        type: TransactionType.EXPENSE,
        startDate: new Date('2025-11-01'),
      };

      repository.create.mockResolvedValue(mockRecurring);

      await service.create(mockUserId, createDto);

      const createCall = repository.create.mock.calls[0]![0];
      const nextDate = new Date(createCall.nextDate);
      const expectedDate = new Date('2025-11-02');
      expect(nextDate.toDateString()).toBe(expectedDate.toDateString());
    });

    it('should calculate next date for weekly frequency', async () => {
      const createDto = {
        description: 'Weekly Expense',
        amount: 50,
        frequency: RecurringFrequency.WEEKLY,
        category: 'OTHER',
        type: TransactionType.EXPENSE,
        startDate: new Date('2025-11-01'),
      };

      repository.create.mockResolvedValue(mockRecurring);

      await service.create(mockUserId, createDto);

      const createCall = repository.create.mock.calls[0]![0];
      const nextDate = new Date(createCall.nextDate);
      const expectedDate = new Date('2025-11-08');
      expect(nextDate.toDateString()).toBe(expectedDate.toDateString());
    });

    it('should calculate next date for monthly frequency', async () => {
      const createDto = {
        description: 'Monthly Rent',
        amount: 1500,
        frequency: RecurringFrequency.MONTHLY,
        category: 'HOUSING',
        type: TransactionType.EXPENSE,
        startDate: new Date('2025-11-01'),
      };

      repository.create.mockResolvedValue(mockRecurring);

      await service.create(mockUserId, createDto);

      const createCall = repository.create.mock.calls[0]![0];
      const nextDate = new Date(createCall.nextDate);
      expect(nextDate.getMonth()).toBe(11); // December (0-indexed)
      expect(nextDate.getDate()).toBe(1);
    });
  });

  describe('findAll', () => {
    it('should return all recurring transactions for user', async () => {
      const recurring = [mockRecurring, { ...mockRecurring, id: 'recurring-456' }];
      repository.findAll.mockResolvedValue(recurring);

      const result = await service.findAll(mockUserId);

      expect(repository.findAll).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual(recurring);
    });

    it('should return empty array if no recurring transactions found', async () => {
      repository.findAll.mockResolvedValue([]);

      const result = await service.findAll(mockUserId);

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a recurring transaction by id', async () => {
      repository.findById.mockResolvedValue(mockRecurring);

      const result = await service.findOne(mockUserId, mockRecurringId);

      expect(repository.findById).toHaveBeenCalledWith(mockRecurringId, mockUserId);
      expect(result).toEqual(mockRecurring);
    });

    it('should throw NotFoundException if recurring transaction not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findOne(mockUserId, 'nonexistent')).rejects.toThrow(NotFoundException);
      await expect(service.findOne(mockUserId, 'nonexistent')).rejects.toThrow(
        'Recurring transaction with ID nonexistent not found',
      );
    });
  });

  describe('update', () => {
    it('should update a recurring transaction successfully', async () => {
      const updateDto = {
        description: 'Updated Rent',
        amount: 1600,
      };

      const updatedRecurring = {
        ...mockRecurring,
        description: 'Updated Rent',
        amount: new Decimal(1600),
      };

      repository.findById.mockResolvedValue(mockRecurring);
      repository.update.mockResolvedValue(updatedRecurring);

      const result = await service.update(mockUserId, mockRecurringId, updateDto);

      expect(repository.findById).toHaveBeenCalledWith(mockRecurringId, mockUserId);
      expect(repository.update).toHaveBeenCalledWith(
        mockRecurringId,
        expect.objectContaining({
          description: 'Updated Rent',
          amount: new Decimal(1600),
        }),
      );
      expect(result).toEqual(updatedRecurring);
    });

    it('should throw NotFoundException if recurring transaction not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        service.update(mockUserId, 'nonexistent', { description: 'Test' }),
      ).rejects.toThrow(NotFoundException);
      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a recurring transaction successfully', async () => {
      repository.findById.mockResolvedValue(mockRecurring);
      repository.delete.mockResolvedValue(mockRecurring);

      await service.remove(mockUserId, mockRecurringId);

      expect(repository.findById).toHaveBeenCalledWith(mockRecurringId, mockUserId);
      expect(repository.delete).toHaveBeenCalledWith(mockRecurringId);
    });

    it('should throw NotFoundException if recurring transaction not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.remove(mockUserId, 'nonexistent')).rejects.toThrow(NotFoundException);
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });

  describe('skipNext', () => {
    it('should skip next occurrence and calculate new next date', async () => {
      const updatedRecurring = {
        ...mockRecurring,
        nextDate: new Date('2026-01-01'),
      };

      repository.findById.mockResolvedValue(mockRecurring);
      repository.update.mockResolvedValue(updatedRecurring);

      const result = await service.skipNext(mockUserId, mockRecurringId);

      expect(repository.findById).toHaveBeenCalledWith(mockRecurringId, mockUserId);
      expect(repository.update).toHaveBeenCalledWith(
        mockRecurringId,
        expect.objectContaining({
          nextDate: expect.any(Date),
        }),
      );
      expect(result).toEqual(updatedRecurring);
    });

    it('should throw NotFoundException if recurring transaction not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.skipNext(mockUserId, 'nonexistent')).rejects.toThrow(NotFoundException);
      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('calculateNextDate', () => {
    it('should calculate next date for quarterly frequency', async () => {
      const createDto = {
        description: 'Quarterly Payment',
        amount: 300,
        frequency: RecurringFrequency.QUARTERLY,
        category: 'OTHER',
        type: TransactionType.EXPENSE,
        startDate: new Date('2025-01-01'),
      };

      repository.create.mockResolvedValue(mockRecurring);

      await service.create(mockUserId, createDto);

      const createCall = repository.create.mock.calls[0]![0];
      const nextDate = new Date(createCall.nextDate);
      expect(nextDate.getMonth()).toBe(3); // April (0-indexed)
    });

    it('should calculate next date for yearly frequency', async () => {
      const createDto = {
        description: 'Yearly Subscription',
        amount: 1200,
        frequency: RecurringFrequency.YEARLY,
        category: 'SUBSCRIPTION',
        type: TransactionType.EXPENSE,
        startDate: new Date('2025-01-01'),
      };

      repository.create.mockResolvedValue(mockRecurring);

      await service.create(mockUserId, createDto);

      const createCall = repository.create.mock.calls[0]![0];
      const nextDate = new Date(createCall.nextDate);
      expect(nextDate.getFullYear()).toBe(2026);
    });

    it('should calculate next date for biweekly frequency', async () => {
      const createDto = {
        description: 'Biweekly Payment',
        amount: 100,
        frequency: RecurringFrequency.BIWEEKLY,
        category: 'OTHER',
        type: TransactionType.EXPENSE,
        startDate: new Date('2025-11-01'),
      };

      repository.create.mockResolvedValue(mockRecurring);

      await service.create(mockUserId, createDto);

      const createCall = repository.create.mock.calls[0]![0];
      const nextDate = new Date(createCall.nextDate);
      const expectedDate = new Date('2025-11-15');
      expect(nextDate.toDateString()).toBe(expectedDate.toDateString());
    });
  });
});

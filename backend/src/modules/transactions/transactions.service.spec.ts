import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsRepository } from './transactions.repository';
import { PrismaService } from '@/database/prisma.service';
import { mockPrismaService } from '../../../test/helpers/mocks';
import { Decimal } from '@prisma/client/runtime/library';
import { TransactionType } from '@prisma/client';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let repository: jest.Mocked<TransactionsRepository>;
  let prisma: jest.Mocked<PrismaService>;

  const mockTransaction = {
    id: 'trans-123',
    userId: 'user-123',
    amount: new Decimal(100.50),
    type: TransactionType.EXPENSE,
    category: 'Food',
    description: 'Grocery shopping',
    notes: 'Weekly groceries',
    date: new Date('2025-01-15'),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: TransactionsRepository,
          useValue: {
            create: jest.fn(),
            findMany: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            count: jest.fn(),
            aggregate: jest.fn(),
            groupBy: jest.fn(),
            createMany: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    repository = module.get(TransactionsRepository) as jest.Mocked<TransactionsRepository>;
    prisma = module.get(PrismaService) as jest.Mocked<PrismaService>;

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      amount: 100.50,
      type: TransactionType.EXPENSE,
      category: 'Food',
      description: 'Grocery shopping',
      notes: 'Weekly groceries',
      date: new Date('2025-01-15'),
    };

    it('should create a transaction successfully', async () => {
      repository.create.mockResolvedValue(mockTransaction);

      const result = await service.create('user-123', createDto);

      expect(result).toEqual({
        ...mockTransaction,
        amount: 100.5,
        date: mockTransaction.date.toISOString(),
        createdAt: mockTransaction.createdAt.toISOString(),
        updatedAt: mockTransaction.updatedAt.toISOString(),
      });
      expect(repository.create).toHaveBeenCalledWith({
        userId: 'user-123',
        amount: expect.any(Decimal),
        type: createDto.type,
        category: createDto.category,
        description: createDto.description,
        notes: createDto.notes,
        date: createDto.date,
      });
    });

    it('should handle missing optional fields', async () => {
      const minimalDto = {
        amount: 50.00,
        type: TransactionType.INCOME,
        category: 'Salary',
        date: new Date(),
      };

      const minimalTransaction = {
        ...mockTransaction,
        ...minimalDto,
        amount: new Decimal(minimalDto.amount),
        description: null,
        notes: null,
      };

      repository.create.mockResolvedValue(minimalTransaction);

      const result = await service.create('user-123', minimalDto);

      expect(result).toBeDefined();
      expect(repository.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    const queryDto = {
      page: 1,
      limit: 10,
      type: TransactionType.EXPENSE,
      category: 'Food',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-01-31'),
    };

    it('should return paginated transactions', async () => {
      const mockTransactions = [mockTransaction];
      repository.findMany.mockResolvedValue(mockTransactions);
      repository.count.mockResolvedValue(1);

      const result = await service.findAll('user-123', queryDto);

      expect(result).toEqual({
        data: [
          {
            ...mockTransaction,
            amount: 100.5,
            date: mockTransaction.date.toISOString(),
            createdAt: mockTransaction.createdAt.toISOString(),
            updatedAt: mockTransaction.updatedAt.toISOString(),
          },
        ],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });

      expect(repository.findMany).toHaveBeenCalledWith(
        'user-123',
        expect.objectContaining({
          skip: 0,
          take: 10,
          where: expect.objectContaining({
            type: 'EXPENSE',
            category: 'Food',
          }),
        }),
      );
    });

    it('should handle empty results', async () => {
      repository.findMany.mockResolvedValue([]);
      repository.count.mockResolvedValue(0);

      const result = await service.findAll('user-123', {});

      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
    });

    it('should apply pagination limits', async () => {
      const largeLimit = { page: 1, limit: 200 };
      repository.findMany.mockResolvedValue([]);
      repository.count.mockResolvedValue(0);

      await service.findAll('user-123', largeLimit);

      expect(repository.findMany).toHaveBeenCalledWith(
        'user-123',
        expect.objectContaining({
          take: 100, // Max limit applied
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return transaction when found', async () => {
      repository.findOne.mockResolvedValue(mockTransaction);

      const result = await service.findOne('user-123', 'trans-123');

      expect(result).toEqual({
        ...mockTransaction,
        amount: 100.5,
        date: mockTransaction.date.toISOString(),
        createdAt: mockTransaction.createdAt.toISOString(),
        updatedAt: mockTransaction.updatedAt.toISOString(),
      });
      expect(repository.findOne).toHaveBeenCalledWith('trans-123');
    });

    it('should throw NotFoundException when not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('user-123', 'nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException when accessing other user transaction', async () => {
      const otherUserTransaction = { ...mockTransaction, userId: 'other-user' };
      repository.findOne.mockResolvedValue(otherUserTransaction);

      await expect(service.findOne('user-123', 'trans-123')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('update', () => {
    const updateDto = {
      amount: 150.75,
      category: 'Entertainment',
      description: 'Updated description',
    };

    it('should update transaction successfully', async () => {
      repository.findOne.mockResolvedValue(mockTransaction);
      const updatedTransaction = { ...mockTransaction, ...updateDto, amount: new Decimal(updateDto.amount) };
      repository.update.mockResolvedValue(updatedTransaction);

      const result = await service.update('user-123', 'trans-123', updateDto);

      expect(result).toEqual({
        ...updatedTransaction,
        amount: 150.75,
        date: updatedTransaction.date.toISOString(),
        createdAt: updatedTransaction.createdAt.toISOString(),
        updatedAt: updatedTransaction.updatedAt.toISOString(),
      });
      expect(repository.update).toHaveBeenCalledWith(
        'trans-123',
        expect.objectContaining({
          amount: expect.any(Decimal),
          category: updateDto.category,
          description: updateDto.description,
        }),
      );
    });

    it('should throw NotFoundException when transaction not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(
        service.update('user-123', 'nonexistent', updateDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when updating other user transaction', async () => {
      const otherUserTransaction = { ...mockTransaction, userId: 'other-user' };
      repository.findOne.mockResolvedValue(otherUserTransaction);

      await expect(
        service.update('user-123', 'trans-123', updateDto),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('softDelete', () => {
    it('should soft delete transaction successfully', async () => {
      repository.findOne.mockResolvedValue(mockTransaction);
      repository.update.mockResolvedValue({ ...mockTransaction, deletedAt: new Date() });

      const result = await service.softDelete('user-123', 'trans-123');

      expect(result).toEqual({ message: 'Transaction deleted successfully' });
      expect(repository.update).toHaveBeenCalledWith({
        where: { id: 'trans-123' },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('should throw NotFoundException when transaction not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.softDelete('user-123', 'nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException when deleting other user transaction', async () => {
      const otherUserTransaction = { ...mockTransaction, userId: 'other-user' };
      repository.findOne.mockResolvedValue(otherUserTransaction);

      await expect(service.softDelete('user-123', 'trans-123')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('getStats', () => {
    const mockStats = {
      totalIncome: 5000,
      totalExpense: 3000,
      netSavings: 2000,
      transactionCount: 150,
      categoryBreakdown: [
        { category: 'Food', type: TransactionType.EXPENSE, total: 1000, count: 50 },
        { category: 'Transport', type: TransactionType.EXPENSE, total: 500, count: 30 },
      ],
    };

    it('should return statistics for date range', async () => {
      repository.aggregate.mockResolvedValueOnce({ _sum: { amount: new Decimal(5000) } }); // Income
      repository.aggregate.mockResolvedValueOnce({ _sum: { amount: new Decimal(3000) } }); // Expense
      repository.count.mockResolvedValue(150);
      repository.groupBy.mockResolvedValue([
        { category: 'Food', type: TransactionType.EXPENSE, _sum: { amount: new Decimal(1000) }, _count: 50 },
        { category: 'Transport', type: TransactionType.EXPENSE, _sum: { amount: new Decimal(500) }, _count: 30 },
      ] as any);

      const result = await service.getStats('user-123', new Date('2025-01-01'), new Date('2025-01-31'));

      expect(result).toEqual(mockStats);
    });

    it('should handle empty statistics', async () => {
      repository.aggregate.mockResolvedValue({ _sum: { amount: null } });
      repository.count.mockResolvedValue(0);
      repository.groupBy.mockResolvedValue([]);

      const result = await service.getStats('user-123');

      expect(result.transactionCount).toBe(0);
      expect(result.totalIncome).toBe(0);
    });
  });

  describe('exportToCsv', () => {
    it('should export transactions to CSV', async () => {
      const mockTransactions = [mockTransaction];
      repository.findMany.mockResolvedValue(mockTransactions);

      const result = await service.exportToCsv('user-123', {});

      expect(result.content).toContain('Date,Type,Category,Amount,Description,Notes');
      expect(result.content).toContain('100.5');
      expect(result.mimeType).toBe('text/csv');
    });

    it('should sanitize CSV for injection attacks', async () => {
      const dangerousTransaction = { ...mockTransaction, description: '=cmd|/c calc' };
      repository.findMany.mockResolvedValue([dangerousTransaction]);

      const result = await service.exportToCsv('user-123', {});

      expect(result.content).toContain("'=cmd|/c calc");
    });
  });

  describe('bulkCreate', () => {
    const bulkDto = [
      {
        amount: 100,
        type: TransactionType.EXPENSE,
        category: 'Food',
        date: new Date(),
      },
      {
        amount: 200,
        type: TransactionType.INCOME,
        category: 'Salary',
        date: new Date(),
      },
    ];

    it('should create multiple transactions', async () => {
      repository.createMany.mockResolvedValue({ count: 2 });

      const result = await service.bulkCreate('user-123', bulkDto);

      expect(result.count).toBe(2);
      expect(repository.createMany).toHaveBeenCalled();
    });

    it('should throw BadRequestException if empty array', async () => {
      await expect(service.bulkCreate('user-123', [])).rejects.toThrow(
        'No transactions provided',
      );
    });
  });
});

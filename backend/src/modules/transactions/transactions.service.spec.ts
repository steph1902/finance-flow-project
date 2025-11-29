import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsRepository } from './transactions.repository';
import { PrismaService } from '@/database/prisma.service';
import { mockPrismaService } from '../../../test/helpers/mocks';
import { Decimal } from '@prisma/client/runtime/library';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let repository: jest.Mocked<TransactionsRepository>;
  let prisma: jest.Mocked<PrismaService>;

  const mockTransaction = {
    id: 'trans-123',
    userId: 'user-123',
    amount: new Decimal(100.50),
    type: 'EXPENSE' as const,
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
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            count: jest.fn(),
            getStatistics: jest.fn(),
            exportToCSV: jest.fn(),
            bulkCreate: jest.fn(),
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
      type: 'EXPENSE' as const,
      category: 'Food',
      description: 'Grocery shopping',
      notes: 'Weekly groceries',
      date: new Date('2025-01-15'),
    };

    it('should create a transaction successfully', async () => {
      repository.create.mockResolvedValue(mockTransaction);

      const result = await service.create('user-123', createDto);

      expect(result).toEqual(mockTransaction);
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
        type: 'INCOME' as const,
        category: 'Salary',
        date: new Date(),
      };

      const minimalTransaction = {
        ...mockTransaction,
        ...minimalDto,
        description: undefined,
        notes: undefined,
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
      type: 'EXPENSE' as const,
      category: 'Food',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-01-31'),
    };

    it('should return paginated transactions', async () => {
      const mockTransactions = [mockTransaction];
      repository.findAll.mockResolvedValue(mockTransactions);
      repository.count.mockResolvedValue(1);

      const result = await service.findAll('user-123', queryDto);

      expect(result).toEqual({
        data: mockTransactions,
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });

      expect(repository.findAll).toHaveBeenCalledWith(
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
      repository.findAll.mockResolvedValue([]);
      repository.count.mockResolvedValue(0);

      const result = await service.findAll('user-123', {});

      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
    });

    it('should apply pagination limits', async () => {
      const largeLimit = { page: 1, limit: 200 };
      repository.findAll.mockResolvedValue([]);
      repository.count.mockResolvedValue(0);

      await service.findAll('user-123', largeLimit);

      expect(repository.findAll).toHaveBeenCalledWith(
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

      expect(result).toEqual(mockTransaction);
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
      const updatedTransaction = { ...mockTransaction, ...updateDto };
      repository.update.mockResolvedValue(updatedTransaction);

      const result = await service.update('user-123', 'trans-123', updateDto);

      expect(result).toEqual(updatedTransaction);
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

  describe('delete', () => {
    it('should soft delete transaction successfully', async () => {
      repository.findOne.mockResolvedValue(mockTransaction);
      repository.delete.mockResolvedValue({ ...mockTransaction, deletedAt: new Date() });

      const result = await service.delete('user-123', 'trans-123');

      expect(result).toHaveProperty('deletedAt');
      expect(repository.delete).toHaveBeenCalledWith('trans-123');
    });

    it('should throw NotFoundException when transaction not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.delete('user-123', 'nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException when deleting other user transaction', async () => {
      const otherUserTransaction = { ...mockTransaction, userId: 'other-user' };
      repository.findOne.mockResolvedValue(otherUserTransaction);

      await expect(service.delete('user-123', 'trans-123')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('getStatistics', () => {
    const mockStats = {
      totalIncome: new Decimal(5000),
      totalExpenses: new Decimal(3000),
      netIncome: new Decimal(2000),
      transactionCount: 150,
      averageTransaction: new Decimal(53.33),
      categoryBreakdown: [
        { category: 'Food', total: new Decimal(1000), count: 50 },
        { category: 'Transport', total: new Decimal(500), count: 30 },
      ],
    };

    it('should return statistics for date range', async () => {
      repository.getStatistics.mockResolvedValue(mockStats);

      const result = await service.getStatistics('user-123', {
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-31'),
      });

      expect(result).toEqual(mockStats);
      expect(repository.getStatistics).toHaveBeenCalledWith(
        'user-123',
        expect.any(Date),
        expect.any(Date),
      );
    });

    it('should handle empty statistics', async () => {
      const emptyStats = {
        totalIncome: new Decimal(0),
        totalExpenses: new Decimal(0),
        netIncome: new Decimal(0),
        transactionCount: 0,
        averageTransaction: new Decimal(0),
        categoryBreakdown: [],
      };

      repository.getStatistics.mockResolvedValue(emptyStats);

      const result = await service.getStatistics('user-123', {});

      expect(result.transactionCount).toBe(0);
      expect(result.totalIncome).toEqual(new Decimal(0));
    });
  });

  describe('exportCSV', () => {
    it('should export transactions to CSV', async () => {
      const mockCSV = 'Date,Amount,Type,Category,Description\n2025-01-15,100.50,EXPENSE,Food,Grocery shopping';
      repository.exportToCSV.mockResolvedValue(mockCSV);

      const result = await service.exportCSV('user-123', {});

      expect(result).toBe(mockCSV);
      expect(repository.exportToCSV).toHaveBeenCalledWith('user-123', {});
    });

    it('should sanitize CSV for injection attacks', async () => {
      const dangerousCSV = '=cmd|/c calc,100,EXPENSE,Food,Test';
      const sanitizedCSV = "'=cmd|/c calc,100,EXPENSE,Food,Test";
      repository.exportToCSV.mockResolvedValue(sanitizedCSV);

      const result = await service.exportCSV('user-123', {});

      expect(result).not.toContain('=cmd');
    });
  });

  describe('bulkCreate', () => {
    const bulkDto = [
      {
        amount: 100,
        type: 'EXPENSE' as const,
        category: 'Food',
        date: new Date(),
      },
      {
        amount: 200,
        type: 'INCOME' as const,
        category: 'Salary',
        date: new Date(),
      },
    ];

    it('should create multiple transactions', async () => {
      const createdTransactions = bulkDto.map((dto, i) => ({
        ...mockTransaction,
        id: `trans-${i}`,
        ...dto,
      }));

      repository.bulkCreate.mockResolvedValue(createdTransactions);

      const result = await service.bulkCreate('user-123', bulkDto);

      expect(result).toHaveLength(2);
      expect(repository.bulkCreate).toHaveBeenCalled();
    });

    it('should handle empty array', async () => {
      repository.bulkCreate.mockResolvedValue([]);

      const result = await service.bulkCreate('user-123', []);

      expect(result).toEqual([]);
    });
  });
});

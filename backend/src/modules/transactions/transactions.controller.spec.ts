import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

describe('TransactionsController', () => {
    let controller: TransactionsController;
    let transactionsService: jest.Mocked<TransactionsService>;

    const mockTransactionsService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        softDelete: jest.fn(),
        getStats: jest.fn(),
        bulkCreate: jest.fn(),
        exportToCsv: jest.fn(),
    };

    const userId = 'user-123';
    const transactionId = 'tx-123';

    const mockTransaction = {
        id: transactionId,
        userId,
        type: 'EXPENSE',
        amount: 50.00,
        category: 'Food',
        description: 'Lunch',
        date: new Date(),
        currency: 'USD',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [TransactionsController],
            providers: [
                {
                    provide: TransactionsService,
                    useValue: mockTransactionsService,
                },
            ],
        })
            .overrideGuard(JwtAuthGuard)
            .useValue({ canActivate: () => true })
            .compile();

        controller = module.get<TransactionsController>(TransactionsController);
        transactionsService = module.get(TransactionsService) as jest.Mocked<TransactionsService>;
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        const createDto = {
            type: 'EXPENSE' as const,
            amount: 50.00,
            category: 'Food',
            description: 'Lunch',
            date: new Date(),
        };

        it('should create a transaction', async () => {
            mockTransactionsService.create.mockResolvedValue(mockTransaction);

            const result = await controller.create(userId, createDto);

            expect(transactionsService.create).toHaveBeenCalledWith(userId, createDto);
            expect(result).toEqual(mockTransaction);
        });
    });

    describe('findAll', () => {
        it('should return paginated transactions', async () => {
            const paginatedResult = {
                data: [mockTransaction],
                total: 1,
                page: 1,
                limit: 10,
            };
            mockTransactionsService.findAll.mockResolvedValue(paginatedResult);

            const result = await controller.findAll(userId, {});

            expect(transactionsService.findAll).toHaveBeenCalledWith(userId, {});
            expect(result).toEqual(paginatedResult);
        });

        it('should pass filter parameters to service', async () => {
            const query = { type: 'EXPENSE', category: 'Food', page: 1, limit: 20 };
            mockTransactionsService.findAll.mockResolvedValue({ data: [], total: 0, page: 1, limit: 20 });

            await controller.findAll(userId, query);

            expect(transactionsService.findAll).toHaveBeenCalledWith(userId, query);
        });
    });

    describe('findOne', () => {
        it('should return a transaction by id', async () => {
            mockTransactionsService.findOne.mockResolvedValue(mockTransaction);

            const result = await controller.findOne(userId, transactionId);

            expect(transactionsService.findOne).toHaveBeenCalledWith(userId, transactionId);
            expect(result).toEqual(mockTransaction);
        });

        it('should pass through not found errors', async () => {
            mockTransactionsService.findOne.mockRejectedValue(new Error('Not found'));

            await expect(controller.findOne(userId, 'nonexistent')).rejects.toThrow('Not found');
        });
    });

    describe('update', () => {
        const updateDto = { amount: 75.00, description: 'Updated lunch' };

        it('should update a transaction', async () => {
            const updated = { ...mockTransaction, ...updateDto };
            mockTransactionsService.update.mockResolvedValue(updated);

            const result = await controller.update(userId, transactionId, updateDto);

            expect(transactionsService.update).toHaveBeenCalledWith(userId, transactionId, updateDto);
            expect(result.amount).toBe(75.00);
        });
    });

    describe('remove', () => {
        it('should soft delete a transaction', async () => {
            mockTransactionsService.softDelete.mockResolvedValue(undefined);

            await controller.remove(userId, transactionId);

            expect(transactionsService.softDelete).toHaveBeenCalledWith(userId, transactionId);
        });
    });

    describe('getStats', () => {
        it('should return transaction statistics', async () => {
            const stats = {
                totalIncome: 5000,
                totalExpenses: 2200,
                netSavings: 2800,
                transactionCount: 25,
            };
            mockTransactionsService.getStats.mockResolvedValue(stats);

            const result = await controller.getStats(userId);

            expect(transactionsService.getStats).toHaveBeenCalledWith(userId, undefined, undefined);
            expect(result).toEqual(stats);
        });

        it('should pass date range to service', async () => {
            const startDate = new Date('2025-01-01');
            const endDate = new Date('2025-01-31');
            mockTransactionsService.getStats.mockResolvedValue({});

            await controller.getStats(userId, startDate, endDate);

            expect(transactionsService.getStats).toHaveBeenCalledWith(userId, startDate, endDate);
        });
    });

    describe('bulkCreate', () => {
        it('should create multiple transactions', async () => {
            const transactions = [
                { type: 'EXPENSE' as const, amount: 50, category: 'Food', date: new Date() },
                { type: 'INCOME' as const, amount: 1000, category: 'Salary', date: new Date() },
            ];
            mockTransactionsService.bulkCreate.mockResolvedValue({ created: 2 });

            const result = await controller.bulkCreate(userId, transactions);

            expect(transactionsService.bulkCreate).toHaveBeenCalledWith(userId, transactions);
            expect(result).toEqual({ created: 2 });
        });
    });

    describe('exportCsv', () => {
        it('should export transactions to CSV', async () => {
            const csvData = 'id,type,amount,category\ntx-1,EXPENSE,50,Food';
            mockTransactionsService.exportToCsv.mockResolvedValue(csvData);

            const result = await controller.exportCsv(userId, {});

            expect(transactionsService.exportToCsv).toHaveBeenCalledWith(userId, {});
            expect(result).toBe(csvData);
        });
    });
});

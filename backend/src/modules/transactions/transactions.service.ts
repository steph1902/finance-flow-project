import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Prisma, TransactionType } from '@prisma/client';
import { PrismaService } from '@/database/prisma.service';
import { TransactionsRepository } from './transactions.repository';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
  QueryTransactionDto,
} from './dto';
import { PaginatedResponse } from '@/common/interfaces/common.interface';

/**
 * Transactions Service
 * Contains all business logic for transaction management
 */
@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly repository: TransactionsRepository,
  ) {}

  /**
   * Create a new transaction
   */
  async create(userId: string, dto: CreateTransactionDto) {
    this.logger.log(`Creating transaction for user ${userId}`);

    // Convert amount to Prisma Decimal
    const data = {
      ...dto,
      amount: new Prisma.Decimal(dto.amount),
      userId,
    };

    const transaction = await this.repository.create(data);

    // TODO: Queue AI categorization if not provided
    // TODO: Check budget alerts

    return this.serializeTransaction(transaction);
  }

  /**
   * Get all transactions with pagination and filters
   */
  async findAll(
    userId: string,
    query: QueryTransactionDto,
  ): Promise<PaginatedResponse<any>> {
    const {
      page = 1,
      limit = 10,
      type,
      category,
      startDate,
      endDate,
      search,
      sortBy = 'date',
      sortOrder = 'desc',
    } = query;

    // Enforce maximum pagination limit to prevent abuse
    const safeLimit = Math.min(limit, 100);
    const skip = (page - 1) * safeLimit;

    // Build where clause
    const where: Prisma.TransactionWhereInput = {
      userId,
      deletedAt: null,
      ...(type && { type }),
      ...(category && { category }),
      ...(startDate || endDate
        ? {
            date: {
              ...(startDate && { gte: startDate }),
              ...(endDate && { lte: endDate }),
            },
          }
        : {}),
      ...(search && {
        OR: [
          { description: { contains: search, mode: 'insensitive' } },
          { category: { contains: search, mode: 'insensitive' } },
          { notes: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    // Execute queries in parallel
    const [transactions, total] = await Promise.all([
      this.repository.findMany({
        where,
        skip,
        take: safeLimit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.repository.count(where),
    ]);

    return {
      data: transactions.map(this.serializeTransaction),
      meta: {
        total,
        page,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  /**
   * Find transaction by ID
   */
  async findOne(userId: string, id: string) {
    const transaction = await this.repository.findOne({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return this.serializeTransaction(transaction);
  }

  /**
   * Update transaction
   */
  async update(userId: string, id: string, dto: UpdateTransactionDto) {
    // Verify transaction exists and belongs to user
    await this.findOne(userId, id);

    const data = {
      ...dto,
      ...(dto.amount && { amount: new Prisma.Decimal(dto.amount) }),
    };

    const transaction = await this.repository.update({
      where: { id },
      data,
    });

    this.logger.log(`Updated transaction ${id}`);

    return this.serializeTransaction(transaction);
  }

  /**
   * Soft delete transaction
   */
  async softDelete(userId: string, id: string) {
    // Verify transaction exists and belongs to user
    await this.findOne(userId, id);

    await this.repository.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    this.logger.log(`Soft deleted transaction ${id}`);

    return { message: 'Transaction deleted successfully' };
  }

  /**
   * Get transaction statistics
   */
  async getStats(userId: string, startDate?: Date, endDate?: Date) {
    const where: Prisma.TransactionWhereInput = {
      userId,
      deletedAt: null,
      ...(startDate || endDate
        ? {
            date: {
              ...(startDate && { gte: startDate }),
              ...(endDate && { lte: endDate }),
            },
          }
        : {}),
    };

    const [totalIncome, totalExpense, transactionCount, categoryBreakdown] =
      await Promise.all([
        this.repository.aggregate({
          where: { ...where, type: TransactionType.INCOME },
          _sum: { amount: true },
        }),
        this.repository.aggregate({
          where: { ...where, type: TransactionType.EXPENSE },
          _sum: { amount: true },
        }),
        this.repository.count(where),
        this.repository.groupBy({
          by: ['category', 'type'],
          where,
          _sum: { amount: true },
          _count: true,
        }),
      ]);

    const income = Number(totalIncome._sum?.amount ?? 0);
    const expense = Number(totalExpense._sum?.amount ?? 0);

    return {
      totalIncome: income,
      totalExpense: expense,
      netSavings: income - expense,
      transactionCount,
      categoryBreakdown: categoryBreakdown.map((item) => ({
        category: item.category,
        type: item.type,
        total: Number(item._sum?.amount ?? 0),
        count: item._count,
      })),
    };
  }

  /**
   * Bulk create transactions
   */
  async bulkCreate(userId: string, transactions: CreateTransactionDto[]) {
    if (transactions.length === 0) {
      throw new BadRequestException('No transactions provided');
    }

    if (transactions.length > 1000) {
      throw new BadRequestException('Maximum 1000 transactions allowed per bulk operation');
    }

    const data = transactions.map((dto) => ({
      ...dto,
      amount: new Prisma.Decimal(dto.amount),
      userId,
    }));

    const result = await this.repository.createMany(data);

    this.logger.log(`Bulk created ${result.count} transactions for user ${userId}`);

    return {
      message: `${result.count} transactions created successfully`,
      count: result.count,
    };
  }

  /**
   * Export transactions to CSV
   */
  async exportToCsv(userId: string, query: QueryTransactionDto) {
    const { data } = await this.findAll(userId, { ...query, limit: 10000 });

    // Sanitize CSV cells to prevent injection attacks
    const sanitizeCell = (value: any): string => {
      const str = String(value ?? '');
      // Prevent CSV injection by prefixing formulas with single quote
      if (str.match(/^[=+\-@]/)) {
        return `'${str.replace(/"/g, '""')}`;
      }
      return str.replace(/"/g, '""');
    };

    // Generate CSV
    const headers = ['Date', 'Type', 'Category', 'Amount', 'Description', 'Notes'];
    const rows = data.map((t) => [
      new Date(t.date).toISOString().split('T')[0],
      t.type,
      t.category,
      t.amount.toString(),
      t.description || '',
      t.notes || '',
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${sanitizeCell(cell)}"`).join(',')),
    ].join('\n');

    return {
      filename: `transactions_${new Date().toISOString().split('T')[0]}.csv`,
      content: csv,
      mimeType: 'text/csv',
    };
  }

  /**
   * Serialize transaction for response
   */
  private serializeTransaction(transaction: any) {
    return {
      ...transaction,
      amount: Number(transaction.amount),
      date: transaction.date.toISOString(),
      createdAt: transaction.createdAt.toISOString(),
      updatedAt: transaction.updatedAt.toISOString(),
    };
  }
}

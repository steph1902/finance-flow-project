import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Prisma, TransactionType, Transaction } from '@prisma/client';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '@/database/prisma.service';
import { TransactionsRepository } from './transactions.repository';
import { BudgetRepository } from '../budgets/repositories/budget.repository';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
  QueryTransactionDto,
} from './dto';
import { PaginatedResponse } from '@/common/interfaces/common.interface';
import { CategorizationJobData } from './processors/ai-categorization.processor';

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
    private readonly budgetRepository: BudgetRepository,
    @InjectQueue('ai-categorization') private readonly aiQueue: Queue<CategorizationJobData>,
  ) { }

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

    // Update budget spent for expense transactions
    if (dto.type === TransactionType.EXPENSE) {
      await this.updateBudgetSpent(userId, dto.category, transaction.date, data.amount);
      await this.checkBudgetAlerts(userId, dto.category, transaction.date);
    }

    // Queue AI categorization if category not provided or is generic
    if (!dto.category || dto.category === 'Other' || dto.category === 'Uncategorized') {
      await this.queueAICategorization(transaction);
    }

    return this.serializeTransaction(transaction);
  }

  /**
   * Queue a transaction for AI categorization
   */
  private async queueAICategorization(transaction: Transaction): Promise<void> {
    try {
      await this.aiQueue.add(
        'categorize-transaction',
        {
          transactionId: transaction.id,
          userId: transaction.userId,
          description: transaction.description || 'Transaction',
          amount: Number(transaction.amount),
          type: transaction.type,
        },
        {
          attempts: 3, // Retry up to 3 times
          backoff: {
            type: 'exponential',
            delay: 2000, // Start with 2 second delay
          },
          removeOnComplete: true, // Clean up completed jobs
          removeOnFail: false, // Keep failed jobs for debugging
        },
      );

      this.logger.log(`Queued AI categorization for transaction ${transaction.id}`);
    } catch (error) {
      // Don't fail transaction creation if queueing fails
      this.logger.error(
        `Failed to queue AI categorization for transaction ${transaction.id}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
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
    // Get existing transaction to calculate budget adjustments
    const existing = await this.repository.findOne({
      where: { id, userId, deletedAt: null },
    });

    if (!existing) {
      throw new NotFoundException('Transaction not found');
    }

    const data = {
      ...dto,
      ...(dto.amount && { amount: new Prisma.Decimal(dto.amount) }),
    };

    const transaction = await this.repository.update({
      where: { id },
      data,
    });

    // Update budget spent if amount, category, or type changed for expenses
    const oldIsExpense = existing.type === TransactionType.EXPENSE;
    const newIsExpense = (dto.type ?? existing.type) === TransactionType.EXPENSE;
    const oldAmount = existing.amount;
    const newAmount = dto.amount ? new Prisma.Decimal(dto.amount) : oldAmount;
    const oldCategory = existing.category;
    const newCategory = dto.category ?? oldCategory;
    const newDate = dto.date ?? existing.date;

    if (oldIsExpense && newIsExpense) {
      // Both are expenses - adjust budgets
      if (oldCategory === newCategory) {
        // Same category - just adjust the difference
        const difference = newAmount.minus(oldAmount);
        if (!difference.isZero()) {
          await this.updateBudgetSpent(userId, newCategory, newDate, difference);
          await this.checkBudgetAlerts(userId, newCategory, newDate);
        }
      } else {
        // Category changed - decrement old, increment new
        await this.updateBudgetSpent(userId, oldCategory, existing.date, oldAmount.negated());
        await this.updateBudgetSpent(userId, newCategory, newDate, newAmount);
        await this.checkBudgetAlerts(userId, newCategory, newDate);
      }
    } else if (oldIsExpense && !newIsExpense) {
      // Was expense, no longer is - decrement budget
      await this.updateBudgetSpent(userId, oldCategory, existing.date, oldAmount.negated());
    } else if (!oldIsExpense && newIsExpense) {
      // Wasn't expense, now is - increment budget
      await this.updateBudgetSpent(userId, newCategory, newDate, newAmount);
      await this.checkBudgetAlerts(userId, newCategory, newDate);
    }

    this.logger.log(`Updated transaction ${id}`);

    return this.serializeTransaction(transaction);
  }

  /**
   * Soft delete transaction
   */
  async softDelete(userId: string, id: string) {
    // Get existing transaction to adjust budget
    const transaction = await this.repository.findOne({
      where: { id, userId, deletedAt: null },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    await this.repository.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    // Decrement budget spent if it was an expense
    if (transaction.type === TransactionType.EXPENSE) {
      await this.updateBudgetSpent(
        userId,
        transaction.category,
        transaction.date,
        transaction.amount.negated(),
      );
    }

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
   * Update budget spent for a category in a specific month/year
   */
  private async updateBudgetSpent(
    userId: string,
    category: string,
    date: Date,
    amount: Prisma.Decimal,
  ): Promise<void> {
    try {
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      // Find budget for this category and period
      const budget = await this.prisma.budget.findFirst({
        where: { userId, category, month, year },
      });

      if (budget) {
        await this.budgetRepository.incrementSpent(budget.id, amount);
        this.logger.log(
          `Updated budget ${budget.id} spent by ${amount.toString()} for category ${category}`,
        );
      } else {
        this.logger.debug(
          `No budget found for category ${category} in ${month}/${year}`,
        );
      }
    } catch (error) {
      // Don't fail transaction if budget update fails
      this.logger.error(
        `Failed to update budget spent: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Check budget alerts and create notifications if thresholds exceeded
   */
  private async checkBudgetAlerts(
    userId: string,
    category: string,
    date: Date,
  ): Promise<void> {
    try {
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      const budget = await this.prisma.budget.findFirst({
        where: { userId, category, month, year },
      });

      if (!budget || !budget.alertThreshold) {
        return; // No budget or no alert threshold set
      }

      const percentUsed = budget.amount.isZero()
        ? 0
        : budget.spent.dividedBy(budget.amount).times(100).toNumber();

      // Check if we should create an alert
      if (percentUsed >= budget.alertThreshold.toNumber()) {
        const isOverBudget = percentUsed >= 100;

        // Create notification
        await this.prisma.notification.create({
          data: {
            userId,
            type: 'BUDGET_ALERT',
            title: isOverBudget
              ? `Budget Exceeded: ${category}`
              : `Budget Alert: ${category}`,
            message: isOverBudget
              ? `You have exceeded your ${category} budget by ${(percentUsed - 100).toFixed(1)}%. Spent: $${budget.spent.toNumber()} of $${budget.amount.toNumber()}.`
              : `You have used ${percentUsed.toFixed(1)}% of your ${category} budget. Spent: $${budget.spent.toNumber()} of $${budget.amount.toNumber()}.`,
            priority: isOverBudget ? 2 : 1, // High priority if over budget
            metadata: {
              budgetId: budget.id,
              category,
              percentUsed,
              spent: budget.spent.toNumber(),
              budgeted: budget.amount.toNumber(),
            },
          },
        });

        this.logger.log(
          `Created budget alert for user ${userId}, category ${category}: ${percentUsed.toFixed(1)}%`,
        );
      }
    } catch (error) {
      // Don't fail transaction if alert creation fails
      this.logger.error(
        `Failed to check budget alerts: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Serialize transaction for response
   */
  private serializeTransaction(transaction: Transaction) {
    return {
      ...transaction,
      amount: Number(transaction.amount),
      date: transaction.date.toISOString(),
      createdAt: transaction.createdAt.toISOString(),
      updatedAt: transaction.updatedAt.toISOString(),
    };
  }
}

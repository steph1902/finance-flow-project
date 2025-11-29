import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { BudgetRepository } from './repositories/budget.repository';
import {
  CreateBudgetDto,
  UpdateBudgetDto,
  BudgetQueryDto,
  OptimizeBudgetDto,
  CreateSharedBudgetDto,
} from './dto';
import { BudgetResponseDto, BudgetSummaryDto } from './dto/budget-response.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class BudgetsService {
  constructor(private readonly budgetRepository: BudgetRepository) {}

  /**
   * Create a new budget
   */
  async create(userId: string, createBudgetDto: CreateBudgetDto): Promise<BudgetResponseDto> {
    // Check for overlapping budgets in same category
    const overlapping = await this.budgetRepository.findOverlapping(
      userId,
      createBudgetDto.category,
      createBudgetDto.startDate,
      createBudgetDto.endDate,
    );

    if (overlapping.length > 0) {
      throw new BadRequestException(
        `Budget for category "${createBudgetDto.category}" already exists for this period`,
      );
    }

    // Convert dates to month/year
    const month = createBudgetDto.startDate.getMonth() + 1;
    const year = createBudgetDto.startDate.getFullYear();

    const budget = await this.budgetRepository.create({
      userId,
      category: createBudgetDto.category,
      amount: createBudgetDto.amount,
      month,
      year,
    });

    return this.mapToResponse(budget);
  }

  /**
   * Get all budgets for a user with optional filters
   */
  async findAll(userId: string, query: BudgetQueryDto): Promise<BudgetResponseDto[]> {
    const budgets = await this.budgetRepository.findAll(userId, query);
    return budgets.map((budget) => this.mapToResponse(budget));
  }

  /**
   * Get a single budget by ID
   */
  async findOne(userId: string, id: string): Promise<BudgetResponseDto> {
    const budget = await this.budgetRepository.findById(id, userId);
    if (!budget) {
      throw new NotFoundException(`Budget with ID ${id} not found`);
    }
    return this.mapToResponse(budget);
  }

  /**
   * Update a budget
   */
  async update(
    userId: string,
    id: string,
    updateBudgetDto: UpdateBudgetDto,
  ): Promise<BudgetResponseDto> {
    const existing = await this.budgetRepository.findById(id, userId);
    if (!existing) {
      throw new NotFoundException(`Budget with ID ${id} not found`);
    }

    const updated = await this.budgetRepository.update(id, updateBudgetDto);
    return this.mapToResponse(updated);
  }

  /**
   * Delete a budget
   */
  async remove(userId: string, id: string): Promise<void> {
    const budget = await this.budgetRepository.findById(id, userId);
    if (!budget) {
      throw new NotFoundException(`Budget with ID ${id} not found`);
    }
    await this.budgetRepository.delete(id);
  }

  /**
   * Get budget summary with spending analysis
   */
  async getBudgetSummary(userId: string, month?: string): Promise<BudgetSummaryDto> {
    const currentDate = month ? new Date(month) : new Date();
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const budgets = await this.budgetRepository.findAll(userId, {
      startDate,
      endDate,
    });

    let totalBudgeted = new Decimal(0);
    let totalSpent = new Decimal(0);
    const categoryBreakdown = [];

    for (const budget of budgets) {
      totalBudgeted = totalBudgeted.plus(budget.amount);
      const spent = new Decimal(0); // TODO: Calculate actual spent from transactions
      totalSpent = totalSpent.plus(spent);

      const percentUsed = budget.amount.isZero()
        ? 0
        : spent.dividedBy(budget.amount).times(100).toNumber();

      categoryBreakdown.push({
        category: budget.category,
        budgeted: budget.amount.toNumber(),
        spent: spent.toNumber(),
        remaining: budget.amount.minus(spent).toNumber(),
        percentUsed,
        isOverBudget: spent.greaterThan(budget.amount),
      });
    }

    return {
      totalBudgeted: totalBudgeted.toNumber(),
      totalSpent: totalSpent.toNumber(),
      totalRemaining: totalBudgeted.minus(totalSpent).toNumber(),
      overallPercentUsed: totalBudgeted.isZero()
        ? 0
        : totalSpent.dividedBy(totalBudgeted).times(100).toNumber(),
      categoryBreakdown,
      period: {
        start: startDate,
        end: endDate,
      },
    };
  }

  /**
   * AI-powered budget optimization
   */
  async optimizeBudgets(userId: string, optimizeDto: OptimizeBudgetDto) {
    // TODO: Integrate with AI module for budget optimization
    // This would analyze spending patterns and provide recommendations
    throw new Error('Budget optimization not yet implemented');
  }

  /**
   * Create a shared budget
   */
  async createSharedBudget(userId: string, createSharedDto: CreateSharedBudgetDto) {
    // TODO: Implement shared budget creation with proper permissions
    throw new Error('Shared budgets not yet implemented');
  }

  async processRollover(userId: string) {
    // TODO: Implement when rollover field is added to schema
    return { message: 'Budget rollover not yet implemented' };
  }

  /**
   * Map budget entity to response DTO
   */
  private mapToResponse(budget: any): BudgetResponseDto {
    const spent = new Decimal(0); // TODO: Calculate actual spent from transactions
    
    // Convert month/year back to approximate dates
    const startDate = new Date(budget.year, budget.month - 1, 1);
    const endDate = new Date(budget.year, budget.month, 0); // Last day of month
    
    return {
      id: budget.id,
      userId: budget.userId,
      category: budget.category,
      amount: budget.amount.toNumber(),
      spent: spent.toNumber(),
      remaining: budget.amount.minus(spent).toNumber(),
      percentUsed: budget.amount.isZero()
        ? 0
        : spent.dividedBy(budget.amount).times(100).toNumber(),
      startDate,
      endDate,
      rollover: false, // TODO: Add to schema
      alertThreshold: undefined, // TODO: Add to schema
      isOverBudget: spent.greaterThan(budget.amount),
      createdAt: budget.createdAt,
      updatedAt: budget.updatedAt,
    };
  }
}

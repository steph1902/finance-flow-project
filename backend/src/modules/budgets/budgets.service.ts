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
    // Validate budget period
    if (createBudgetDto.startDate >= createBudgetDto.endDate) {
      throw new BadRequestException('End date must be after start date');
    }

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

    const budget = await this.budgetRepository.create({
      ...createBudgetDto,
      userId,
      spent: new Decimal(0),
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
      totalSpent = totalSpent.plus(budget.spent);

      const percentUsed = budget.amount.isZero()
        ? 0
        : budget.spent.dividedBy(budget.amount).times(100).toNumber();

      categoryBreakdown.push({
        category: budget.category,
        budgeted: budget.amount.toNumber(),
        spent: budget.spent.toNumber(),
        remaining: budget.amount.minus(budget.spent).toNumber(),
        percentUsed,
        isOverBudget: budget.spent.greaterThan(budget.amount),
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

  /**
   * Process monthly budget rollover
   */
  async processRollover(userId: string) {
    const budgets = await this.budgetRepository.findRolloverCandidates(userId);

    for (const budget of budgets) {
      if (budget.rollover && budget.amount.greaterThan(budget.spent)) {
        const remaining = budget.amount.minus(budget.spent);
        // Create new budget for next period with rolled over amount
        await this.budgetRepository.create({
          userId,
          category: budget.category,
          amount: budget.amount.plus(remaining),
          spent: new Decimal(0),
          startDate: new Date(budget.endDate.getTime() + 86400000), // Next day
          endDate: new Date(
            budget.endDate.getFullYear(),
            budget.endDate.getMonth() + 2,
            0,
          ), // End of next month
          rollover: budget.rollover,
          alertThreshold: budget.alertThreshold,
        });
      }
    }

    return { message: 'Budget rollover processed successfully' };
  }

  /**
   * Map budget entity to response DTO
   */
  private mapToResponse(budget: any): BudgetResponseDto {
    return {
      id: budget.id,
      userId: budget.userId,
      category: budget.category,
      amount: budget.amount.toNumber(),
      spent: budget.spent.toNumber(),
      remaining: budget.amount.minus(budget.spent).toNumber(),
      percentUsed: budget.amount.isZero()
        ? 0
        : budget.spent.dividedBy(budget.amount).times(100).toNumber(),
      startDate: budget.startDate,
      endDate: budget.endDate,
      rollover: budget.rollover,
      alertThreshold: budget.alertThreshold,
      isOverBudget: budget.spent.greaterThan(budget.amount),
      createdAt: budget.createdAt,
      updatedAt: budget.updatedAt,
    };
  }
}

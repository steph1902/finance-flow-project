import { Injectable, NotFoundException } from '@nestjs/common';
import { GoalRepository } from './repositories/goal.repository';
import { CreateGoalDto, UpdateGoalDto } from './dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class GoalsService {
  constructor(private readonly goalRepository: GoalRepository) {}

  async create(userId: string, createGoalDto: CreateGoalDto) {
    return this.goalRepository.create({
      ...createGoalDto,
      userId,
      currentAmount: new Decimal(createGoalDto.currentAmount || 0),
      targetAmount: new Decimal(createGoalDto.targetAmount),
    });
  }

  async findAll(userId: string) {
    const goals = await this.goalRepository.findAll(userId);
    return goals.map((goal) => this.enrichGoalData(goal));
  }

  async findOne(userId: string, id: string) {
    const goal = await this.goalRepository.findById(id, userId);
    if (!goal) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }
    return this.enrichGoalData(goal);
  }

  async update(userId: string, id: string, updateGoalDto: UpdateGoalDto) {
    const existing = await this.goalRepository.findById(id, userId);
    if (!existing) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }

    const updateData: any = { ...updateGoalDto };
    if (updateGoalDto.targetAmount !== undefined) {
      updateData.targetAmount = new Decimal(updateGoalDto.targetAmount);
    }
    if (updateGoalDto.currentAmount !== undefined) {
      updateData.currentAmount = new Decimal(updateGoalDto.currentAmount);
    }

    const updated = await this.goalRepository.update(id, updateData);
    return this.enrichGoalData(updated);
  }

  async remove(userId: string, id: string): Promise<void> {
    const goal = await this.goalRepository.findById(id, userId);
    if (!goal) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }
    await this.goalRepository.delete(id);
  }

  async addContribution(userId: string, id: string, amount: number) {
    const goal = await this.goalRepository.findById(id, userId);
    if (!goal) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }

    const newAmount = goal.currentAmount.plus(new Decimal(amount));
    const updated = await this.goalRepository.update(id, {
      currentAmount: newAmount,
    });

    return this.enrichGoalData(updated);
  }

  /**
   * Enrich goal data with calculated fields
   */
  private enrichGoalData(goal: any) {
    const progress = goal.targetAmount.isZero()
      ? 0
      : goal.currentAmount.dividedBy(goal.targetAmount).times(100).toNumber();

    const remaining = goal.targetAmount.minus(goal.currentAmount).toNumber();

    let projectedCompletion: Date | null = null;
    if (goal.targetDate && remaining > 0) {
      const now = new Date();
      const daysRemaining = Math.ceil(
        (goal.targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );
      const dailyRequired = remaining / Math.max(daysRemaining, 1);
      
      // Simple projection based on current progress
      if (progress > 0) {
        const daysElapsed = Math.ceil(
          (now.getTime() - goal.createdAt.getTime()) / (1000 * 60 * 60 * 24),
        );
        const avgDailyContribution = goal.currentAmount.toNumber() / Math.max(daysElapsed, 1);
        if (avgDailyContribution > 0) {
          const projectedDays = remaining / avgDailyContribution;
          projectedCompletion = new Date(now.getTime() + projectedDays * 24 * 60 * 60 * 1000);
        }
      }
    }

    return {
      ...goal,
      currentAmount: goal.currentAmount.toNumber(),
      targetAmount: goal.targetAmount.toNumber(),
      progress,
      remaining,
      isCompleted: goal.currentAmount.greaterThanOrEqualTo(goal.targetAmount),
      projectedCompletion,
    };
  }
}

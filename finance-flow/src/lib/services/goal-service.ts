/**
 * Goal & Savings Tracking Service
 * 
 * Handles financial goal management with milestone tracking,
 * progress monitoring, and achievement celebrations.
 */

import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export interface CreateGoalInput {
  userId: string;
  name: string;
  description?: string;
  targetAmount: number;
  targetDate?: Date;
  category?: string;
  priority?: number;
}

export interface UpdateGoalInput {
  name?: string;
  description?: string;
  targetAmount?: number;
  targetDate?: Date;
  category?: string;
  priority?: number;
  status?: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'PAUSED';
}

export interface AddContributionInput {
  goalId: string;
  amount: number;
  notes?: string;
}

export interface GoalProgress {
  goalId: string;
  name: string;
  currentAmount: number;
  targetAmount: number;
  progressPercentage: number;
  remainingAmount: number;
  daysRemaining: number | null;
  isOnTrack: boolean;
  milestones: {
    id: string;
    amount: number;
    description: string | null;
    achievedAt: Date | null;
    isAchieved: boolean;
  }[];
}

/**
 * Create a new financial goal
 */
export async function createGoal(input: CreateGoalInput) {
  try {
    const goalData: Prisma.GoalCreateInput = {
      user: { connect: { id: input.userId } },
      name: input.name,
      targetAmount: new Decimal(input.targetAmount),
      category: input.category || 'General',
      priority: input.priority || 0,
      currentAmount: new Decimal(0),
      status: 'ACTIVE',
    }

    if (input.description) goalData.description = input.description
    if (input.targetDate) goalData.targetDate = input.targetDate

    const goal = await prisma.goal.create({
      data: goalData,
      include: {
        milestones: true,
        contributions: true,
      },
    });

    // Auto-generate milestones (25%, 50%, 75%, 100%)
    const milestonePercentages = [0.25, 0.5, 0.75, 1.0];
    for (const percentage of milestonePercentages) {
      await prisma.goalMilestone.create({
        data: {
          goalId: goal.id,
          amount: new Decimal(input.targetAmount * percentage),
          description: `${percentage * 100}% milestone`,
        },
      });
    }

    logger.info('Goal created', { goalId: goal.id, userId: input.userId });
    return goal;
  } catch (error) {
    logger.error('Failed to create goal', error);
    throw new Error('Failed to create goal');
  }
}

/**
 * Update an existing goal
 */
export async function updateGoal(goalId: string, userId: string, input: UpdateGoalInput) {
  try {
    const updateData: Prisma.GoalUpdateInput = {}

    if (input.name !== undefined) updateData.name = input.name
    if (input.description !== undefined) updateData.description = input.description
    if (input.targetDate !== undefined) updateData.targetDate = input.targetDate
    if (input.category !== undefined) updateData.category = input.category
    if (input.priority !== undefined) updateData.priority = input.priority
    if (input.status !== undefined) updateData.status = input.status
    if (input.targetAmount !== undefined) updateData.targetAmount = new Decimal(input.targetAmount)

    const goal = await prisma.goal.updateMany({
      where: { id: goalId, userId },
      data: updateData,
    });

    if (goal.count === 0) {
      throw new Error('Goal not found');
    }

    logger.info('Goal updated', { goalId, userId });
    return goal;
  } catch (error) {
    logger.error('Failed to update goal', error);
    throw new Error('Failed to update goal');
  }
}

/**
 * Add contribution to a goal
 */
export async function addContribution(input: AddContributionInput, userId: string) {
  try {
    const goal = await prisma.goal.findFirst({
      where: { id: input.goalId, userId },
      include: { milestones: true },
    });

    if (!goal) {
      throw new Error('Goal not found');
    }

    // Create contribution
    // Create contribution
    const contributionData: Prisma.GoalContributionCreateInput = {
      goal: { connect: { id: input.goalId } },
      amount: new Decimal(input.amount),
    }

    if (input.notes) contributionData.notes = input.notes

    const contribution = await prisma.goalContribution.create({
      data: contributionData,
    });

    // Update goal current amount
    const newAmount = Number(goal.currentAmount) + input.amount;
    await prisma.goal.update({
      where: { id: input.goalId },
      data: {
        currentAmount: new Decimal(newAmount),
        ...(newAmount >= Number(goal.targetAmount) && {
          status: 'COMPLETED',
          completedAt: new Date(),
        }),
      },
    });

    // Check and update milestone achievements
    for (const milestone of goal.milestones) {
      if (!milestone.achievedAt && newAmount >= Number(milestone.amount)) {
        await prisma.goalMilestone.update({
          where: { id: milestone.id },
          data: { achievedAt: new Date() },
        });

        // Create notification for milestone
        await prisma.notification.create({
          data: {
            userId,
            type: 'GOAL_MILESTONE',
            title: 'Goal Milestone Achieved! 🎉',
            message: `You've reached a milestone for "${goal.name}"! ${milestone.description}`,
            priority: 1,
            metadata: { goalId: goal.id, milestoneId: milestone.id },
          },
        });
      }
    }

    logger.info('Contribution added', { goalId: input.goalId, amount: input.amount });
    return contribution;
  } catch (error) {
    logger.error('Failed to add contribution', error);
    throw new Error('Failed to add contribution');
  }
}

/**
 * Get goal progress with analytics
 */
export async function getGoalProgress(goalId: string, userId: string): Promise<GoalProgress> {
  try {
    const goal = await prisma.goal.findFirst({
      where: { id: goalId, userId },
      include: {
        milestones: {
          orderBy: { amount: 'asc' },
        },
      },
    });

    if (!goal) {
      throw new Error('Goal not found');
    }

    const currentAmount = Number(goal.currentAmount);
    const targetAmount = Number(goal.targetAmount);
    const progressPercentage = (currentAmount / targetAmount) * 100;
    const remainingAmount = targetAmount - currentAmount;

    let daysRemaining: number | null = null;
    let isOnTrack = true;

    if (goal.targetDate) {
      const now = new Date();
      const target = new Date(goal.targetDate);
      daysRemaining = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      // Check if on track (simple linear projection)
      if (daysRemaining > 0) {
        const daysSinceStart = Math.ceil((now.getTime() - goal.createdAt.getTime()) / (1000 * 60 * 60 * 24));
        const totalDays = daysSinceStart + daysRemaining;
        const expectedProgress = (daysSinceStart / totalDays) * 100;
        isOnTrack = progressPercentage >= expectedProgress * 0.9; // 10% tolerance
      }
    }

    return {
      goalId: goal.id,
      name: goal.name,
      currentAmount,
      targetAmount,
      progressPercentage,
      remainingAmount,
      daysRemaining,
      isOnTrack,
      milestones: goal.milestones.map((m) => ({
        id: m.id,
        amount: Number(m.amount),
        description: m.description,
        achievedAt: m.achievedAt,
        isAchieved: !!m.achievedAt,
      })),
    };
  } catch (error) {
    logger.error('Failed to get goal progress', error);
    throw new Error('Failed to get goal progress');
  }
}

/**
 * Get all goals for a user
 */
export async function getUserGoals(userId: string, status?: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'PAUSED') {
  try {
    const goals = await prisma.goal.findMany({
      where: {
        userId,
        ...(status && { status }),
      },
      include: {
        milestones: true,
        contributions: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
      orderBy: [
        { priority: 'desc' },
        { targetDate: 'asc' },
      ],
    });

    return goals;
  } catch (error) {
    logger.error('Failed to get user goals', error);
    throw new Error('Failed to get user goals');
  }
}

/**
 * Delete a goal
 */
export async function deleteGoal(goalId: string, userId: string) {
  try {
    const result = await prisma.goal.deleteMany({
      where: { id: goalId, userId },
    });

    if (result.count === 0) {
      throw new Error('Goal not found');
    }

    logger.info('Goal deleted', { goalId, userId });
    return { success: true };
  } catch (error) {
    logger.error('Failed to delete goal', error);
    throw new Error('Failed to delete goal');
  }
}

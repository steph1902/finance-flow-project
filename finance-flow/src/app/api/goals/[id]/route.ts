/**
 * Individual Goal API Route
 * 
 * GET    - Get goal details
 * PATCH  - Update goal
 * DELETE - Delete goal
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { updateGoal, deleteGoal, getGoalProgress } from '@/lib/services/goal-service';
import { z } from 'zod';
import { logger } from '@/lib/logger';

// Validation schema
const updateGoalSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  targetAmount: z.number().positive().optional(),
  targetDate: z.string().datetime().optional(),
  category: z.string().optional(),
  priority: z.number().min(0).max(2).optional(),
  status: z.enum(['ACTIVE', 'COMPLETED', 'CANCELLED', 'PAUSED']).optional(),
});

/**
 * GET /api/goals/[id]
 * Get goal details with progress
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const progress = await getGoalProgress(id, session.user.id);

    return NextResponse.json({ progress });
  } catch (error) {
    logger.error('Failed to fetch goal', error);
    return NextResponse.json(
      { error: 'Failed to fetch goal' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/goals/[id]
 * Update a goal
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    
    // Validate input
    const validation = updateGoalSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;
    
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.targetAmount !== undefined) updateData.targetAmount = data.targetAmount;
    if (data.targetDate) updateData.targetDate = new Date(data.targetDate);
    if (data.category !== undefined) updateData.category = data.category;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.status !== undefined) updateData.status = data.status;
    
    await updateGoal(id, session.user.id, updateData);

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Failed to update goal', error);
    return NextResponse.json(
      { error: 'Failed to update goal' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/goals/[id]
 * Delete a goal
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    await deleteGoal(id, session.user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Failed to delete goal', error);
    return NextResponse.json(
      { error: 'Failed to delete goal' },
      { status: 500 }
    );
  }
}

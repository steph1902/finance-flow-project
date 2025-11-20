/**
 * Goals API Route
 * 
 * GET  - List all user goals
 * POST - Create new goal
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createGoal, getUserGoals } from '@/lib/services/goal-service';
import { z } from 'zod';

// Validation schema
const createGoalSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  targetAmount: z.number().positive(),
  targetDate: z.string().datetime().optional(),
  category: z.string().optional(),
  priority: z.number().min(0).max(2).optional(),
});

/**
 * GET /api/goals
 * List all goals for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get status filter from query params
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'PAUSED' | undefined;

    const goals = await getUserGoals(session.user.id, status);

    return NextResponse.json({ goals });
  } catch (error) {
    console.error('Failed to fetch goals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch goals' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/goals
 * Create a new goal
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validation = createGoalSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { name, description, targetAmount, targetDate, category, priority } = validation.data;

    const goal = await createGoal({
      userId: session.user.id,
      name,
      targetAmount,
      ...(description && { description }),
      ...(targetDate && { targetDate: new Date(targetDate) }),
      ...(category && { category }),
      ...(priority !== undefined && { priority }),
    });

    return NextResponse.json({ goal }, { status: 201 });
  } catch (error) {
    console.error('Failed to create goal:', error);
    return NextResponse.json(
      { error: 'Failed to create goal' },
      { status: 500 }
    );
  }
}

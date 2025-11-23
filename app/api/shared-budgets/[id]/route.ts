import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { logger } from '@/lib/logger';

const updateSharedBudgetSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  category: z.string().optional(),
  limit: z.number().positive().optional(),
  period: z.enum(['MONTHLY', 'YEARLY']).optional(),
});

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

    const sharedBudget = await prisma.sharedBudget.findFirst({
      where: {
        id,
        OR: [
          { ownerId: session.user.id },
          {
            permissions: {
              some: {
                userId: session.user.id,
              },
            },
          },
        ],
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        permissions: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!sharedBudget) {
      return NextResponse.json(
        { error: 'Shared budget not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ sharedBudget });
  } catch (error) {
    logger.error('Failed to fetch shared budget', error);
    return NextResponse.json(
      { error: 'Failed to fetch shared budget' },
      { status: 500 }
    );
  }
}

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

    // Check if user has edit permission
    const permission = await prisma.budgetPermission.findFirst({
      where: {
        sharedBudgetId: id,
        userId: session.user.id,
        canEdit: true,
      },
    });

    // Also allow owner even without explicit permission
    const budget = await prisma.sharedBudget.findFirst({
      where: { id },
    });

    if (!permission && budget?.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = updateSharedBudgetSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.issues },
        { status: 400 }
      );
    }

    // Filter out undefined values for exactOptionalPropertyTypes
    const updateData: Record<string, any> = {};
    if (validation.data.name !== undefined) updateData.name = validation.data.name;
    if (validation.data.category !== undefined) updateData.category = validation.data.category;
    if (validation.data.limit !== undefined) updateData.limit = validation.data.limit;
    if (validation.data.period !== undefined) updateData.period = validation.data.period;

    const sharedBudget = await prisma.sharedBudget.update({
      where: { id },
      data: updateData,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        permissions: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ sharedBudget });
  } catch (error) {
    logger.error('Failed to update shared budget', error);
    return NextResponse.json(
      { error: 'Failed to update shared budget' },
      { status: 500 }
    );
  }
}

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

    // Only owner can delete
    const sharedBudget = await prisma.sharedBudget.findFirst({
      where: {
        id,
        ownerId: session.user.id,
      },
    });

    if (!sharedBudget) {
      return NextResponse.json(
        { error: 'Only owner can delete shared budget' },
        { status: 403 }
      );
    }

    await prisma.sharedBudget.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Failed to delete shared budget', error);
    return NextResponse.json(
      { error: 'Failed to delete shared budget' },
      { status: 500 }
    );
  }
}

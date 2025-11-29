import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { logger } from '@/lib/logger';

const updatePermissionsSchema = z.object({
  userId: z.string(),
  role: z.enum(['ADMIN', 'CONTRIBUTOR', 'VIEWER']),
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

    const permissions = await prisma.budgetPermission.findMany({
      where: {
        sharedBudgetId: id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json({ permissions });
  } catch (error) {
    logger.error('Failed to fetch permissions', error);
    return NextResponse.json(
      { error: 'Failed to fetch permissions' },
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

    // Only owner can change permissions
    const sharedBudget = await prisma.sharedBudget.findUnique({
      where: { id },
    });

    if (!sharedBudget || sharedBudget.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: 'Only owner can change permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = updatePermissionsSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { userId, role } = validation.data;

    const updatedPermission = await prisma.budgetPermission.update({
      where: {
        sharedBudgetId_userId: {
          sharedBudgetId: id,
          userId,
        },
      },
      data: {
        role,
        canEdit: role === 'ADMIN' || role === 'CONTRIBUTOR',
        canDelete: role === 'ADMIN',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ permission: updatedPermission });
  } catch (error) {
    logger.error('Failed to update permissions', error);
    return NextResponse.json(
      { error: 'Failed to update permissions' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { logger } from '@/lib/logger';

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(['ADMIN', 'CONTRIBUTOR', 'VIEWER']),
  canEdit: z.boolean().optional(),
  canDelete: z.boolean().optional(),
});

export async function POST(
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

    // Check if user is owner or has ADMIN permission
    const permission = await prisma.budgetPermission.findFirst({
      where: {
        sharedBudgetId: id,
        userId: session.user.id,
        role: 'ADMIN',
      },
    });

    if (!permission) {
      return NextResponse.json(
        { error: 'Insufficient permissions - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = inviteSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { email, role, canEdit, canDelete } = validation.data;

    // Find user by email
    const invitedUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!invitedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if already has permission
    const existingPermission = await prisma.budgetPermission.findFirst({
      where: {
        sharedBudgetId: id,
        userId: invitedUser.id,
      },
    });

    if (existingPermission) {
      return NextResponse.json(
        { error: 'User is already a member' },
        { status: 400 }
      );
    }

    // Add permission
    const newPermission = await prisma.budgetPermission.create({
      data: {
        sharedBudgetId: id,
        userId: invitedUser.id,
        role,
        canEdit: canEdit ?? (role === 'CONTRIBUTOR' || role === 'ADMIN'),
        canDelete: canDelete ?? (role === 'ADMIN'),
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

    // Create notification for invited user
    await prisma.notification.create({
      data: {
        userId: invitedUser.id,
        type: 'SYSTEM',
        title: 'Budget Shared',
        message: `${session.user.name || 'Someone'} invited you to collaborate on a budget`,
      },
    });

    return NextResponse.json({ permission: newPermission }, { status: 201 });
  } catch (error) {
    logger.error('Failed to invite user', error);
    return NextResponse.json(
      { error: 'Failed to invite user' },
      { status: 500 }
    );
  }
}

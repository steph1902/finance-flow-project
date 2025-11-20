import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

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
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: {
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
    console.error('Failed to fetch shared budget:', error);
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

    // Check if user is owner or editor
    const member = await prisma.sharedBudgetMember.findFirst({
      where: {
        sharedBudgetId: id,
        userId: session.user.id,
        role: { in: ['OWNER', 'EDITOR'] },
      },
    });

    if (!member) {
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

    const sharedBudget = await prisma.sharedBudget.update({
      where: { id },
      data: validation.data,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: {
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
    console.error('Failed to update shared budget:', error);
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
    console.error('Failed to delete shared budget:', error);
    return NextResponse.json(
      { error: 'Failed to delete shared budget' },
      { status: 500 }
    );
  }
}

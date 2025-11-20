import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
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

    // Check if user is a member
    const member = await prisma.sharedBudgetMember.findFirst({
      where: {
        sharedBudgetId: id,
        userId: session.user.id,
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: 'Not a member of this budget' },
        { status: 404 }
      );
    }

    // Owners cannot leave (must transfer ownership or delete)
    if (member.role === 'OWNER') {
      return NextResponse.json(
        { error: 'Owner cannot leave. Transfer ownership or delete the budget.' },
        { status: 400 }
      );
    }

    // Remove member
    await prisma.sharedBudgetMember.delete({
      where: {
        id: member.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to leave budget:', error);
    return NextResponse.json(
      { error: 'Failed to leave budget' },
      { status: 500 }
    );
  }
}

/**
 * Notifications API Route
 * 
 * GET  - List user notifications
 * POST - Create notification (admin/system only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserNotifications, createNotification } from '@/lib/services/notification-service';
import { z } from 'zod';
import { logger } from '@/lib/logger';

// Validation schema
const createNotificationSchema = z.object({
  type: z.enum(['BUDGET_ALERT', 'BILL_REMINDER', 'GOAL_MILESTONE', 'ANOMALY_DETECTION', 'SUBSCRIPTION_RENEWAL', 'SYSTEM']),
  title: z.string().min(1).max(200),
  message: z.string().min(1),
  priority: z.number().min(0).max(2).optional(),
  actionUrl: z.string().optional(),
});

/**
 * GET /api/notifications
 * List notifications for the authenticated user
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

    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');

    const notifications = await getUserNotifications(
      session.user.id,
      unreadOnly ? 'UNREAD' : undefined,
      limit
    );

    return NextResponse.json({ notifications });
  } catch (error) {
    logger.error('Failed to fetch notifications', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/notifications
 * Create a notification (for system/admin use)
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
    const validation = createNotificationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { type, title, message, priority, actionUrl } = validation.data;

    const notification = await createNotification({
      userId: session.user.id,
      type,
      title,
      message,
      ...(priority !== undefined && { priority }),
      ...(actionUrl && { actionUrl }),
    });

    return NextResponse.json({ notification }, { status: 201 });
  } catch (error) {
    logger.error('Failed to create notification', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}

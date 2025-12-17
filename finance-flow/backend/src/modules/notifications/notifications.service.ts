import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationRepository } from './repositories/notification.repository';
import { EmailService } from './services/email.service';
import { NotificationQueryDto } from './dto';
import { NotificationStatus } from '@prisma/client';

export interface CreateNotificationData {
  userId: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  sendEmail?: boolean;
}

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Create a new notification
   */
  async create(data: CreateNotificationData) {
    const notification = await this.notificationRepository.create({
      userId: data.userId,
      title: data.title,
      message: data.message,
      type: data.type as any, // TODO: Fix type casting
      actionUrl: data.link,
      status: 'UNREAD',
    });

    // Send email if requested
    if (data.sendEmail) {
      await this.emailService.sendNotification(data.userId, {
        title: data.title,
        message: data.message,
        link: data.link,
      });
    }

    return notification;
  }

  /**
   * Get all notifications for a user
   */
  async findAll(userId: string, query: NotificationQueryDto) {
    return this.notificationRepository.findAll(userId, query);
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(userId: string) {
    const count = await this.notificationRepository.countUnread(userId);
    return { count };
  }

  /**
   * Mark notification as read
   */
  async markAsRead(userId: string, id: string) {
    const notification = await this.notificationRepository.findById(id, userId);
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return this.notificationRepository.update(id, { status: NotificationStatus.READ });
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string) {
    await this.notificationRepository.markAllAsRead(userId);
    return { message: 'All notifications marked as read' };
  }

  /**
   * Delete notification
   */
  async remove(userId: string, id: string): Promise<void> {
    const notification = await this.notificationRepository.findById(id, userId);
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    await this.notificationRepository.delete(id);
  }

  /**
   * Send budget alert notification
   */
  async sendBudgetAlert(userId: string, budgetData: { category: string; percentUsed: number }) {
    await this.create({
      userId,
      title: 'Budget Alert',
      message: `You have used ${budgetData.percentUsed.toFixed(0)}% of your ${budgetData.category} budget`,
      type: 'BUDGET_ALERT',
      sendEmail: true,
    });
  }

  /**
   * Send goal milestone notification
   */
  async sendGoalMilestone(userId: string, goalData: { name: string; progress: number }) {
    await this.create({
      userId,
      title: 'Goal Milestone',
      message: `Congratulations! You've reached ${goalData.progress.toFixed(0)}% of your ${goalData.name} goal`,
      type: 'GOAL_MILESTONE',
      sendEmail: true,
    });
  }
}

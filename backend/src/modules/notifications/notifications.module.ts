import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationRepository } from './repositories/notification.repository';
import { EmailService } from './services/email.service';

/**
 * Notifications Module
 * In-app and email notification system with Resend integration
 *
 * Features:
 * - Notification types: BUDGET_ALERT, BILL_REMINDER, GOAL_MILESTONE, etc.
 * - Status tracking: UNREAD, READ, ARCHIVED
 * - Priority levels (0=low, 1=medium, 2=high)
 * - Rich HTML email templates
 * - Action URLs for deep linking
 */
@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationRepository, EmailService],
  exports: [NotificationsService],
})
export class NotificationsModule {}

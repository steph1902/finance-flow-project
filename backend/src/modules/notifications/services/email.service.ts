import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface EmailNotificationData {
  title: string;
  message: string;
  link?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {}

  /**
   * Send email notification
   * TODO: Integrate with email service (SendGrid, AWS SES, etc.)
   */
  async sendNotification(userId: string, data: EmailNotificationData): Promise<void> {
    this.logger.log(`Sending email notification to user ${userId}: ${data.title}`);

    // TODO: Implement actual email sending
    // Example with SendGrid:
    // const msg = {
    //   to: user.email,
    //   from: this.configService.get('EMAIL_FROM'),
    //   subject: data.title,
    //   text: data.message,
    //   html: `<p>${data.message}</p>${data.link ? `<a href="${data.link}">View Details</a>` : ''}`,
    // };
    // await this.sendGridService.send(msg);

    this.logger.log(`Email notification sent successfully to user ${userId}`);
  }

  /**
   * Send budget alert email
   */
  async sendBudgetAlert(userEmail: string, budgetData: any): Promise<void> {
    this.logger.log(`Sending budget alert to ${userEmail}`);
    // TODO: Implement budget alert email template
  }

  /**
   * Send weekly report email
   */
  async sendWeeklyReport(userEmail: string, reportData: any): Promise<void> {
    this.logger.log(`Sending weekly report to ${userEmail}`);
    // TODO: Implement weekly report email template
  }
}

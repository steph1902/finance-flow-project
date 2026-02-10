import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

interface EmailNotificationData {
  title: string;
  message: string;
  link?: string;
}

interface BudgetAlertData {
  category: string;
  budgeted: number;
  spent: number;
  percentUsed: number;
}

interface WeeklyReportData {
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  categoryBreakdown: Array<{
    category: string;
    total: number;
  }>;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend;
  private readonly fromEmail: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.fromEmail = this.configService.get<string>('EMAIL_FROM', 'noreply@financeflow.app');

    if (apiKey) {
      this.resend = new Resend(apiKey);
      this.logger.log('Resend email service initialized');
    } else {
      this.logger.warn('RESEND_API_KEY not configured - email notifications will be logged only');
    }
  }

  /**
   * Send email notification
   */
  async sendNotification(userEmail: string, data: EmailNotificationData): Promise<void> {
    if (!this.resend) {
      this.logger.log(`[EMAIL NOT SENT - No API Key] To: ${userEmail}, Subject: ${data.title}`);
      return;
    }

    try {
      const { error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: userEmail,
        subject: data.title,
        html: this.generateNotificationTemplate(data),
      });

      if (error) {
        throw new Error(error.message);
      }

      this.logger.log(`Email notification sent successfully to ${userEmail}`);
    } catch (error) {
      this.logger.error(`Failed to send email notification to ${userEmail}`, error);
      throw error;
    }
  }

  /**
   * Send budget alert email
   */
  async sendBudgetAlert(userEmail: string, budgetData: BudgetAlertData): Promise<void> {
    if (!this.resend) {
      this.logger.log(`[EMAIL NOT SENT - No API Key] Budget alert for ${userEmail}`);
      return;
    }

    try {
      const { error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: userEmail,
        subject: `⚠️ Budget Alert: ${budgetData.category} at ${budgetData.percentUsed.toFixed(0)}%`,
        html: this.generateBudgetAlertTemplate(budgetData),
      });

      if (error) {
        throw new Error(error.message);
      }

      this.logger.log(`Budget alert sent to ${userEmail}`);
    } catch (error) {
      this.logger.error(`Failed to send budget alert to ${userEmail}`, error);
      throw error;
    }
  }

  /**
   * Send weekly report email
   */
  async sendWeeklyReport(userEmail: string, reportData: WeeklyReportData): Promise<void> {
    if (!this.resend) {
      this.logger.log(`[EMAIL NOT SENT - No API Key] Weekly report for ${userEmail}`);
      return;
    }

    try {
      const { error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: userEmail,
        subject: '📊 Your Weekly Financial Report',
        html: this.generateWeeklyReportTemplate(reportData),
      });

      if (error) {
        throw new Error(error.message);
      }

      this.logger.log(`Weekly report sent to ${userEmail}`);
    } catch (error) {
      this.logger.error(`Failed to send weekly report to ${userEmail}`, error);
      throw error;
    }
  }

  /**
   * Generate notification email template
   */
  private generateNotificationTemplate(data: EmailNotificationData): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
            .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">💼 FinanceFlow</h1>
            </div>
            <div class="content">
              <h2>${data.title}</h2>
              <p>${data.message}</p>
              ${data.link ? `<a href="${data.link}" class="button">View Details</a>` : ''}
            </div>
            <div class="footer">
              <p>You're receiving this email because you have notifications enabled in FinanceFlow.</p>
              <p>© ${new Date().getFullYear()} FinanceFlow. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Generate budget alert email template
   */
  private generateBudgetAlertTemplate(data: BudgetAlertData): string {
    const isOverBudget = data.spent > data.budgeted;
    const remaining = data.budgeted - data.spent;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: ${isOverBudget ? '#ef4444' : '#f59e0b'}; color: white; padding: 30px; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
            .stats { background: #f9fafb; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .stat-row { display: flex; justify-content: space-between; margin: 10px 0; }
            .progress-bar { background: #e5e7eb; height: 20px; border-radius: 10px; overflow: hidden; margin: 20px 0; }
            .progress-fill { background: ${isOverBudget ? '#ef4444' : '#f59e0b'}; height: 100%; width: ${Math.min(data.percentUsed, 100)}%; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">⚠️ Budget Alert</h1>
            </div>
            <div class="content">
              <h2>${isOverBudget ? 'You\'ve exceeded your budget!' : 'Budget threshold reached'}</h2>
              <p>Your <strong>${data.category}</strong> spending has reached <strong>${data.percentUsed.toFixed(1)}%</strong> of your budget.</p>
              
              <div class="stats">
                <div class="stat-row">
                  <span>Budgeted:</span>
                  <strong>$${data.budgeted.toFixed(2)}</strong>
                </div>
                <div class="stat-row">
                  <span>Spent:</span>
                  <strong style="color: ${isOverBudget ? '#ef4444' : '#f59e0b'};">$${data.spent.toFixed(2)}</strong>
                </div>
                <div class="stat-row">
                  <span>${isOverBudget ? 'Over budget by:' : 'Remaining:'}:</span>
                  <strong style="color: ${isOverBudget ? '#ef4444' : '#10b981'};">$${Math.abs(remaining).toFixed(2)}</strong>
                </div>
              </div>
              
              <div class="progress-bar">
                <div class="progress-fill"></div>
              </div>
              
              <p>${isOverBudget
        ? 'Consider reviewing your spending in this category to get back on track.'
        : 'Keep an eye on your spending to stay within budget.'}
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} FinanceFlow. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Generate weekly report email template
   */
  private generateWeeklyReportTemplate(data: WeeklyReportData): string {
    const savingsRate = data.totalIncome > 0
      ? ((data.netSavings / data.totalIncome) * 100).toFixed(1)
      : '0';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
            .summary-cards { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin: 20px 0; }
            .card { background: #f9fafb; padding: 20px; border-radius: 6px; text-align: center; }
            .card-value { font-size: 24px; font-weight: bold; margin: 10px 0; }
            .card-label { font-size: 12px; color: #6b7280; text-transform: uppercase; }
            .breakdown { margin: 30px 0; }
            .breakdown-item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">📊 Your Weekly Financial Report</h1>
            </div>
            <div class="content">
              <p>Here's your financial summary for the week:</p>
              
              <div class="summary-cards">
                <div class="card">
                  <div class="card-label">Income</div>
                  <div class="card-value" style="color: #10b981;">$${data.totalIncome.toFixed(2)}</div>
                </div>
                <div class="card">
                  <div class="card-label">Expenses</div>
                  <div class="card-value" style="color: #ef4444;">$${data.totalExpense.toFixed(2)}</div>
                </div>
                <div class="card">
                  <div class="card-label">Net Savings</div>
                  <div class="card-value" style="color: ${data.netSavings >= 0 ? '#10b981' : '#ef4444'};">
                    $${data.netSavings.toFixed(2)}
                  </div>
                </div>
              </div>
              
              <p><strong>Savings Rate:</strong> ${savingsRate}%</p>
              
              <div class="breakdown">
                <h3>Top Spending Categories</h3>
                ${data.categoryBreakdown.map(cat => `
                  <div class="breakdown-item">
                    <span>${cat.category}</span>
                    <strong>$${cat.total.toFixed(2)}</strong>
                  </div>
                `).join('')}
              </div>
              
              <p style="margin-top: 30px; padding: 15px; background: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 4px;">
                💡 <strong>Tip:</strong> ${data.netSavings >= 0
        ? 'Great job staying on track this week! Keep up the good work.'
        : 'Consider reviewing your spending to identify areas where you can cut back.'
      }
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} FinanceFlow. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}

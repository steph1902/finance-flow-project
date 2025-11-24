/**
 * Email Notification Service
 * Sends email notifications via Resend API
 */

import { Resend } from 'resend';
import { logger } from '@/lib/logger';
import { formatCurrency } from '@/lib/formatters';
import { format } from 'date-fns';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@financeflow.app';

let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (!RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY not configured');
  }

  if (!resendClient) {
    resendClient = new Resend(RESEND_API_KEY);
  }

  return resendClient;
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send email via Resend
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    if (!RESEND_API_KEY) {
      logger.warn('Email skipped: RESEND_API_KEY not configured');
      return;
    }

    const client = getResendClient();

    const emailData: any = {
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    if (options.text) {
      emailData.text = options.text;
    }

    await client.emails.send(emailData);

    logger.info('Email sent', { to: options.to, subject: options.subject });
  } catch (error) {
    logger.error('Failed to send email', error);
    throw new Error('Failed to send email');
  }
}

/**
 * Send budget alert email
 */
export async function sendBudgetAlert(
  userEmail: string,
  userName: string | null,
  category: string,
  spent: number,
  budget: number,
  percentage: number
) {
  const displayName = userName || 'there';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; }
          .alert-box { background: ${percentage >= 100 ? '#fee2e2' : '#fef3c7'}; border-left: 4px solid ${percentage >= 100 ? '#dc2626' : '#f59e0b'}; padding: 20px; margin: 20px 0; border-radius: 4px; }
          .stats { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .stat-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .stat-label { font-weight: 600; color: #6b7280; }
          .stat-value { font-weight: 700; color: #111827; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💰 Budget Alert</h1>
          </div>
          <div class="content">
            <p>Hi ${displayName},</p>
            
            <div class="alert-box">
              <h2 style="margin-top: 0; color: ${percentage >= 100 ? '#dc2626' : '#f59e0b'};">
                ${percentage >= 100 ? '⚠️ Budget Exceeded!' : '⚡ Budget Alert!'}
              </h2>
              <p>You've spent <strong>${percentage.toFixed(0)}%</strong> of your <strong>${category}</strong> budget for this month.</p>
            </div>

            <div class="stats">
              <div class="stat-row">
                <span class="stat-label">Budget</span>
                <span class="stat-value">${formatCurrency(budget)}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Spent</span>
                <span class="stat-value" style="color: ${percentage >= 100 ? '#dc2626' : '#f59e0b'};">${formatCurrency(spent)}</span>
              </div>
              <div class="stat-row" style="border-bottom: none;">
                <span class="stat-label">Remaining</span>
                <span class="stat-value" style="color: ${budget - spent > 0 ? '#10b981' : '#dc2626'};">${formatCurrency(Math.max(0, budget - spent))}</span>
              </div>
            </div>

            <p>${percentage >= 100 
              ? 'Consider reviewing your spending in this category or adjusting your budget.' 
              : 'You\'re approaching your budget limit. Keep an eye on your spending!'}</p>

            <center>
              <a href="${process.env.NEXTAUTH_URL}/budgets" class="button">View Budget Details</a>
            </center>
          </div>
          <div class="footer">
            <p>This is an automated notification from FinanceFlow.</p>
            <p>You can manage your notification preferences in Settings.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Budget Alert - ${category}

Hi ${displayName},

You've spent ${percentage.toFixed(0)}% of your ${category} budget for this month.

Budget: ${formatCurrency(budget)}
Spent: ${formatCurrency(spent)}
Remaining: ${formatCurrency(Math.max(0, budget - spent))}

${percentage >= 100 
  ? 'Your budget has been exceeded. Consider reviewing your spending or adjusting your budget.' 
  : 'You\'re approaching your budget limit. Keep an eye on your spending!'}

View your budget details: ${process.env.NEXTAUTH_URL}/budgets
  `;

  await sendEmail({
    to: userEmail,
    subject: `${percentage >= 100 ? '⚠️ Budget Exceeded' : '⚡ Budget Alert'}: ${category}`,
    html,
    text,
  });
}

/**
 * Send bill reminder email
 */
export async function sendBillReminder(
  userEmail: string,
  userName: string | null,
  description: string,
  amount: number,
  dueDate: Date
) {
  const displayName = userName || 'there';
  const dueDateStr = format(dueDate, 'MMMM d, yyyy');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; }
          .reminder-box { background: #dbeafe; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 4px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 Bill Reminder</h1>
          </div>
          <div class="content">
            <p>Hi ${displayName},</p>
            
            <div class="reminder-box">
              <h2 style="margin-top: 0; color: #3b82f6;">Upcoming Bill</h2>
              <p><strong>${description}</strong></p>
              <p>Amount: <strong>${formatCurrency(amount)}</strong></p>
              <p>Due Date: <strong>${dueDateStr}</strong></p>
            </div>

            <p>Don't forget to make this payment before the due date!</p>

            <center>
              <a href="${process.env.NEXTAUTH_URL}/recurring" class="button">View Recurring Transactions</a>
            </center>
          </div>
          <div class="footer">
            <p>This is an automated reminder from FinanceFlow.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Bill Reminder

Hi ${displayName},

You have an upcoming bill:

${description}
Amount: ${formatCurrency(amount)}
Due Date: ${dueDateStr}

Don't forget to make this payment!

View details: ${process.env.NEXTAUTH_URL}/recurring
  `;

  await sendEmail({
    to: userEmail,
    subject: `🔔 Bill Reminder: ${description}`,
    html,
    text,
  });
}

/**
 * Send goal milestone email
 */
export async function sendGoalMilestone(
  userEmail: string,
  userName: string | null,
  goalName: string,
  currentAmount: number,
  targetAmount: number,
  percentage: number
) {
  const displayName = userName || 'there';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; }
          .milestone-box { background: #d1fae5; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 4px; }
          .progress-bar { background: #e5e7eb; height: 30px; border-radius: 15px; overflow: hidden; margin: 20px 0; }
          .progress-fill { background: linear-gradient(90deg, #10b981 0%, #059669 100%); height: 100%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Goal Milestone Reached!</h1>
          </div>
          <div class="content">
            <p>Hi ${displayName},</p>
            
            <div class="milestone-box">
              <h2 style="margin-top: 0; color: #059669;">Congratulations!</h2>
              <p>You've reached a milestone for your goal: <strong>${goalName}</strong></p>
            </div>

            <div class="progress-bar">
              <div class="progress-fill" style="width: ${Math.min(percentage, 100)}%;">
                ${percentage.toFixed(0)}%
              </div>
            </div>

            <p>Current: <strong>${formatCurrency(currentAmount)}</strong> / Target: <strong>${formatCurrency(targetAmount)}</strong></p>

            ${percentage >= 100 
              ? '<p>🎊 You\'ve achieved your goal! Time to celebrate and set a new target!</p>' 
              : '<p>Keep up the great work! You\'re making excellent progress!</p>'}

            <center>
              <a href="${process.env.NEXTAUTH_URL}/goals" class="button">View Goals</a>
            </center>
          </div>
          <div class="footer">
            <p>This is an automated notification from FinanceFlow.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Goal Milestone Reached!

Hi ${displayName},

Congratulations! You've reached a milestone for your goal: ${goalName}

Progress: ${percentage.toFixed(0)}%
Current: ${formatCurrency(currentAmount)}
Target: ${formatCurrency(targetAmount)}

${percentage >= 100 
  ? 'You\'ve achieved your goal! Time to celebrate!' 
  : 'Keep up the great work!'}

View your goals: ${process.env.NEXTAUTH_URL}/goals
  `;

  await sendEmail({
    to: userEmail,
    subject: `🎉 Goal Milestone: ${goalName}`,
    html,
    text,
  });
}

/**
 * Check if email service is configured
 */
export function isEmailConfigured(): boolean {
  return !!RESEND_API_KEY;
}

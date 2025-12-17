import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RecurringRepository } from '../repositories/recurring.repository';
import { TransactionsService } from '../../transactions/transactions.service';

/**
 * Recurring Transaction Processor
 * 
 * Runs daily to process due recurring transactions
 */
@Injectable()
export class RecurringProcessor {
  private readonly logger = new Logger(RecurringProcessor.name);

  constructor(
    private readonly recurringRepository: RecurringRepository,
    private readonly transactionsService: TransactionsService,
  ) { }

  /**
   * Process recurring transactions daily at 1 AM
   */
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async processRecurringTransactions() {
    this.logger.log('Starting recurring transaction processing');

    try {
      const dueTransactions = await this.recurringRepository.findDue();
      this.logger.log(`Found ${dueTransactions.length} due recurring transactions`);

      for (const recurring of dueTransactions) {
        try {
          // Create the actual transaction
          await this.transactionsService.create(recurring.userId, {
            description: recurring.description ?? undefined,
            amount: recurring.amount.toNumber(),
            category: recurring.category,
            type: recurring.type,
            date: new Date(),
          });

          // Update next date
          const nextDate = this.calculateNextDate(recurring.nextDate, recurring.frequency);
          await this.recurringRepository.update(recurring.id, { nextDate });

          this.logger.log(`Processed recurring transaction: ${recurring.id}`);
        } catch (error) {
          this.logger.error(
            `Failed to process recurring transaction ${recurring.id}: ${(error as Error).message}`,
          );
        }
      }

      this.logger.log('Recurring transaction processing completed');
    } catch (error) {
      this.logger.error(`Recurring transaction processing failed: ${(error as Error).message}`);
    }
  }

  private calculateNextDate(currentDate: Date, frequency: string): Date {
    const next = new Date(currentDate);

    switch (frequency) {
      case 'DAILY':
        next.setDate(next.getDate() + 1);
        break;
      case 'WEEKLY':
        next.setDate(next.getDate() + 7);
        break;
      case 'BIWEEKLY':
        next.setDate(next.getDate() + 14);
        break;
      case 'MONTHLY':
        next.setMonth(next.getMonth() + 1);
        break;
      case 'QUARTERLY':
        next.setMonth(next.getMonth() + 3);
        break;
      case 'YEARLY':
        next.setFullYear(next.getFullYear() + 1);
        break;
      default:
        throw new Error(`Unknown frequency: ${frequency}`);
    }

    return next;
  }
}

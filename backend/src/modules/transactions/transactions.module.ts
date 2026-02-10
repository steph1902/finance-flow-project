import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TransactionsRepository } from './transactions.repository';
import { BudgetRepository } from '../budgets/repositories/budget.repository';
import { AiCategorizationProcessor } from './processors/ai-categorization.processor';

/**
 * Transactions Module
 * Handles transaction CRUD, categorization, statistics, and bulk operations
 */
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'ai-categorization',
    }),
  ],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    TransactionsRepository,
    BudgetRepository,
    AiCategorizationProcessor,
  ],
  exports: [TransactionsService, TransactionsRepository],
})
export class TransactionsModule { }

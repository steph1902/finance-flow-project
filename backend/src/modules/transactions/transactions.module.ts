import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TransactionsRepository } from './transactions.repository';
import { BudgetRepository } from '../budgets/repositories/budget.repository';
import { AiCategorizationProcessor } from './processors/ai-categorization.processor';
import { KeywordLearningService } from './services/keyword-learning.service';

/**
 * Transactions Module
 * Handles all transaction-related operations with AI categorization
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
    KeywordLearningService,
  ],
  exports: [TransactionsService, TransactionsRepository, KeywordLearningService],
})
export class TransactionsModule { }

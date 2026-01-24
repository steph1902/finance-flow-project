import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TransactionsRepository } from './transactions.repository';
import { BudgetsModule } from '../budgets/budgets.module';

/**
 * Transactions Module
 * Handles all transaction-related operations
 */
@Module({
  imports: [BudgetsModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionsRepository],
  exports: [TransactionsService],
})
export class TransactionsModule { }

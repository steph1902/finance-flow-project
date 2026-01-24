import { Module } from '@nestjs/common';
import { BudgetsController } from './budgets.controller';
import { BudgetsService } from './budgets.service';
import { BudgetRepository } from './repositories/budget.repository';

/**
 * Budgets Module
 * Handles budget management, shared budgets, and budget alerts
 */
@Module({
  controllers: [BudgetsController],
  providers: [BudgetsService, BudgetRepository],
  exports: [BudgetsService, BudgetRepository],
})
export class BudgetsModule { }

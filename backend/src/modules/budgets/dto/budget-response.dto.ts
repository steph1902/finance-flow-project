import { ApiProperty } from '@nestjs/swagger';

export class BudgetResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  spent: number;

  @ApiProperty()
  remaining: number;

  @ApiProperty()
  percentUsed: number;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  rollover: boolean;

  @ApiProperty()
  alertThreshold?: number;

  @ApiProperty()
  isOverBudget: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class CategoryBreakdown {
  @ApiProperty()
  category: string;

  @ApiProperty()
  budgeted: number;

  @ApiProperty()
  spent: number;

  @ApiProperty()
  remaining: number;

  @ApiProperty()
  percentUsed: number;

  @ApiProperty()
  isOverBudget: boolean;
}

export class BudgetSummaryDto {
  @ApiProperty()
  totalBudgeted: number;

  @ApiProperty()
  totalSpent: number;

  @ApiProperty()
  totalRemaining: number;

  @ApiProperty()
  overallPercentUsed: number;

  @ApiProperty({ type: [CategoryBreakdown] })
  categoryBreakdown: CategoryBreakdown[];

  @ApiProperty()
  period: {
    start: Date;
    end: Date;
  };
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class OptimizeBudgetDto {
  @ApiProperty({ example: 3000, description: 'Total monthly income' })
  @IsNumber()
  @Min(0)
  totalIncome: number;

  @ApiProperty({ example: 3, required: false, description: 'Number of months to analyze' })
  @IsNumber()
  @IsOptional()
  @Min(1)
  analysisMonths?: number;
}

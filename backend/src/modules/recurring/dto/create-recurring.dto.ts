import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDate, IsEnum, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionType, RecurringFrequency } from '@prisma/client';

export class CreateRecurringDto {
  @ApiProperty({ example: 'Netflix Subscription' })
  @IsString()
  description: string;

  @ApiProperty({ example: 15.99 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ enum: RecurringFrequency, example: 'MONTHLY' })
  @IsEnum(RecurringFrequency)
  frequency: RecurringFrequency;

  @ApiProperty({ example: 'Entertainment' })
  @IsString()
  category: string;

  @ApiProperty({ example: '2025-01-01' })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({ example: '2025-12-31', required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @ApiProperty({ example: 'EXPENSE', enum: TransactionType })
  @IsEnum(TransactionType)
  type: TransactionType;
}

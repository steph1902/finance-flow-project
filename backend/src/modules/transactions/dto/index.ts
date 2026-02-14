import {
  IsNumber,
  IsPositive,
  IsEnum,
  IsString,
  IsOptional,
  IsDate,
  MaxLength,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';

/**
 * Create Transaction DTO
 */
export class CreateTransactionDto {
  @ApiProperty({ example: 100.5, description: 'Transaction amount' })
  @IsNumber()
  @IsPositive()
  @Max(999999.99)
  amount: number;

  @ApiProperty({ enum: TransactionType, example: 'EXPENSE' })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ example: 'Food & Dining' })
  @IsString()
  @MaxLength(100)
  category: string;

  @ApiProperty({ example: 'Lunch at restaurant', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(191)
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: '2024-11-25T12:00:00Z' })
  @IsDate()
  @Type(() => Date)
  date: Date;
}

/**
 * Update Transaction DTO
 */
export class UpdateTransactionDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Max(999999.99)
  amount?: number;

  @ApiProperty({ enum: TransactionType, required: false })
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(191)
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;
}

/**
 * Query Transaction DTO
 */
export class QueryTransactionDto {
  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Max(100)
  limit?: number = 10;

  @ApiProperty({ enum: TransactionType, required: false })
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false, enum: ['date', 'amount'], default: 'date' })
  @IsOptional()
  @IsString()
  sortBy?: 'date' | 'amount' = 'date';

  @ApiProperty({ required: false, enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

// Export RejectAISuggestionDto
export { RejectAISuggestionDto } from './reject-ai-suggestion.dto';

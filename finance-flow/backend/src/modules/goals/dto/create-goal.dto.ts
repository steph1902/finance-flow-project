import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDate, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGoalDto {
  @ApiProperty({ example: 'Emergency Fund' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Save 6 months of expenses', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 10000 })
  @IsNumber()
  @Min(0)
  targetAmount: number;

  @ApiProperty({ example: 0, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  currentAmount?: number;

  @ApiProperty({ example: '2025-12-31', required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  targetDate?: Date;

  @ApiProperty({ example: 'savings', required: false })
  @IsString()
  @IsOptional()
  category?: string;
}

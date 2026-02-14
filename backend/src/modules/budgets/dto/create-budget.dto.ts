import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDate, IsBoolean, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBudgetDto {
  @ApiProperty({ example: 'Food & Dining' })
  @IsString()
  category: string;

  @ApiProperty({ example: 500 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ example: '2025-01-01' })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({ example: '2025-01-31' })
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  rollover?: boolean;

  @ApiProperty({
    example: 80,
    required: false,
    description: 'Alert when spending reaches this percentage',
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  alertThreshold?: number;
}

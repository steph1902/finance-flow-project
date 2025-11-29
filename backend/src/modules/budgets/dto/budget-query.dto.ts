import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class BudgetQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class AnalyticsQueryDto {
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

import { PartialType } from '@nestjs/swagger';
import { CreateRecurringDto } from './create-recurring.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateRecurringDto extends PartialType(CreateRecurringDto) {
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

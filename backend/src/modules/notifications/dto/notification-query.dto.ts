import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsString, IsNumber, Min, IsEnum } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { NotificationType } from '@prisma/client';

export class NotificationQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  read?: boolean;

  @ApiProperty({ required: false, enum: NotificationType })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @ApiProperty({ required: false, default: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number;
}

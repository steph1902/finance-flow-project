import { IsOptional, IsString, IsBoolean, IsInt, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Update User DTO
 */
export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  preferredCurrency?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  onboardingCompleted?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  onboardingStep?: number;
}

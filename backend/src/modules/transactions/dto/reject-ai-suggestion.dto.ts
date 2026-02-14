import { IsString, IsEnum, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum RejectionReason {
  INCORRECT_CATEGORY = 'incorrect_category',
  TOO_GENERIC = 'too_generic',
  WRONG_MERCHANT = 'wrong_merchant',
  OTHER = 'other',
}

/**
 * DTO for rejecting an AI suggestion and providing feedback
 */
export class RejectAISuggestionDto {
  @ApiProperty({
    description: 'The correct category for this transaction',
    example: 'Housing',
  })
  @IsString()
  correctCategory: string;

  @ApiProperty({
    description: 'Reason for rejecting the AI suggestion',
    enum: RejectionReason,
    example: RejectionReason.INCORRECT_CATEGORY,
  })
  @IsEnum(RejectionReason)
  reason: RejectionReason;

  @ApiPropertyOptional({
    description: 'Optional comment explaining the rejection',
    example: 'This is my rent payment, not transportation',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  comment?: string;
}

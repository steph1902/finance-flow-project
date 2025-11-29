import { ApiProperty } from '@nestjs/swagger';

/**
 * Auth Response DTO
 */
export class AuthResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  expiresIn: string;

  @ApiProperty()
  tokenType: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class ContributeToGoalDto {
  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0.01)
  amount: number;
}

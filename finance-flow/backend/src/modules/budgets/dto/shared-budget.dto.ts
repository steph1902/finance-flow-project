import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsEmail } from 'class-validator';
import { CreateBudgetDto } from './create-budget.dto';

export class CreateSharedBudgetDto extends CreateBudgetDto {
  @ApiProperty({ example: ['user1@example.com', 'user2@example.com'] })
  @IsArray()
  @IsEmail({}, { each: true })
  sharedWith: string[];

  @ApiProperty({ example: 'Family Groceries' })
  @IsString()
  name: string;
}

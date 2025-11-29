import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RecurringService } from './recurring.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateRecurringDto, UpdateRecurringDto } from './dto';

@ApiTags('Recurring Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('recurring')
export class RecurringController {
  constructor(private readonly recurringService: RecurringService) {}

  @Post()
  @ApiOperation({ summary: 'Create recurring transaction' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(
    @CurrentUser('id') userId: string,
    @Body() createRecurringDto: CreateRecurringDto,
  ) {
    return this.recurringService.create(userId, createRecurringDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all recurring transactions' })
  @ApiResponse({ status: HttpStatus.OK })
  async findAll(@CurrentUser('id') userId: string) {
    return this.recurringService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get recurring transaction by ID' })
  @ApiResponse({ status: HttpStatus.OK })
  async findOne(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.recurringService.findOne(userId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update recurring transaction' })
  @ApiResponse({ status: HttpStatus.OK })
  async update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateRecurringDto: UpdateRecurringDto,
  ) {
    return this.recurringService.update(userId, id, updateRecurringDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete recurring transaction' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  async remove(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.recurringService.remove(userId, id);
  }

  @Post(':id/skip')
  @ApiOperation({ summary: 'Skip next occurrence' })
  @ApiResponse({ status: HttpStatus.OK })
  async skipNext(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.recurringService.skipNext(userId, id);
  }
}

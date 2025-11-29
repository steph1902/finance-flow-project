import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BudgetsService } from './budgets.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  CreateBudgetDto,
  UpdateBudgetDto,
  BudgetQueryDto,
  OptimizeBudgetDto,
  CreateSharedBudgetDto,
} from './dto';
import { BudgetResponseDto, BudgetSummaryDto } from './dto/budget-response.dto';

@ApiTags('Budgets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new budget' })
  @ApiResponse({ status: HttpStatus.CREATED, type: BudgetResponseDto })
  async create(
    @CurrentUser('id') userId: string,
    @Body() createBudgetDto: CreateBudgetDto,
  ): Promise<BudgetResponseDto> {
    return this.budgetsService.create(userId, createBudgetDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all budgets for user' })
  @ApiResponse({ status: HttpStatus.OK, type: [BudgetResponseDto] })
  async findAll(
    @CurrentUser('id') userId: string,
    @Query() query: BudgetQueryDto,
  ): Promise<BudgetResponseDto[]> {
    return this.budgetsService.findAll(userId, query);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get budget summary with spending analysis' })
  @ApiResponse({ status: HttpStatus.OK, type: BudgetSummaryDto })
  async getSummary(
    @CurrentUser('id') userId: string,
    @Query('month') month?: string,
  ): Promise<BudgetSummaryDto> {
    return this.budgetsService.getBudgetSummary(userId, month);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get budget by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: BudgetResponseDto })
  async findOne(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ): Promise<BudgetResponseDto> {
    return this.budgetsService.findOne(userId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update budget' })
  @ApiResponse({ status: HttpStatus.OK, type: BudgetResponseDto })
  async update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateBudgetDto: UpdateBudgetDto,
  ): Promise<BudgetResponseDto> {
    return this.budgetsService.update(userId, id, updateBudgetDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete budget' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  async remove(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.budgetsService.remove(userId, id);
  }

  @Post('optimize')
  @ApiOperation({ summary: 'Get AI-powered budget optimization recommendations' })
  @ApiResponse({ status: HttpStatus.OK })
  async optimize(
    @CurrentUser('id') userId: string,
    @Body() optimizeDto: OptimizeBudgetDto,
  ) {
    return this.budgetsService.optimizeBudgets(userId, optimizeDto);
  }

  @Post('shared')
  @ApiOperation({ summary: 'Create a shared budget' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async createShared(
    @CurrentUser('id') userId: string,
    @Body() createSharedDto: CreateSharedBudgetDto,
  ) {
    return this.budgetsService.createSharedBudget(userId, createSharedDto);
  }

  @Post('rollover')
  @ApiOperation({ summary: 'Process budget rollover for new month' })
  @ApiResponse({ status: HttpStatus.OK })
  async rollover(@CurrentUser('id') userId: string) {
    return this.budgetsService.processRollover(userId);
  }
}

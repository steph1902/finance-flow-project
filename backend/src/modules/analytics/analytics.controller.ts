import { Controller, Get, Query, UseGuards, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AnalyticsQueryDto } from './dto';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get financial overview' })
  @ApiResponse({ status: HttpStatus.OK })
  async getOverview(
    @CurrentUser('id') userId: string,
    @Query() query: AnalyticsQueryDto,
  ) {
    return this.analyticsService.getOverview(userId, query);
  }

  @Get('spending-trends')
  @ApiOperation({ summary: 'Get spending trends over time' })
  @ApiResponse({ status: HttpStatus.OK })
  async getSpendingTrends(
    @CurrentUser('id') userId: string,
    @Query() query: AnalyticsQueryDto,
  ) {
    return this.analyticsService.getSpendingTrends(userId, query);
  }

  @Get('category-breakdown')
  @ApiOperation({ summary: 'Get spending breakdown by category' })
  @ApiResponse({ status: HttpStatus.OK })
  async getCategoryBreakdown(
    @CurrentUser('id') userId: string,
    @Query() query: AnalyticsQueryDto,
  ) {
    return this.analyticsService.getCategoryBreakdown(userId, query);
  }

  @Get('income-vs-expenses')
  @ApiOperation({ summary: 'Get income vs expenses comparison' })
  @ApiResponse({ status: HttpStatus.OK })
  async getIncomeVsExpenses(
    @CurrentUser('id') userId: string,
    @Query() query: AnalyticsQueryDto,
  ) {
    return this.analyticsService.getIncomeVsExpenses(userId, query);
  }

  @Get('monthly-comparison')
  @ApiOperation({ summary: 'Get month-over-month comparison' })
  @ApiResponse({ status: HttpStatus.OK })
  async getMonthlyComparison(
    @CurrentUser('id') userId: string,
    @Query() query: AnalyticsQueryDto,
  ) {
    return this.analyticsService.getMonthlyComparison(userId, query);
  }
}

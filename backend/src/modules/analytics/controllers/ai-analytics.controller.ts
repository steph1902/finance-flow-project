import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { AIAnalyticsService } from '../services/ai-analytics.service';

/**
 * AI Analytics Controller
 * Provides endpoints for monitoring AI categorization performance
 */
@ApiTags('AI Analytics')
@Controller('api/admin/ai-analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AIAnalyticsController {
  constructor(private readonly aiAnalyticsService: AIAnalyticsService) {}

  /**
   * Get AI categorization statistics
   */
  @Get('categorization-stats')
  @ApiOperation({
    summary: 'Get AI categorization statistics',
    description: 'Returns comprehensive statistics about AI suggestion performance',
  })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by specific user ID' })
  async getCategorizationStats(@Query('userId') userId?: string) {
    return this.aiAnalyticsService.getCategorizationStats(userId);
  }

  /**
   * Get AI performance metrics over time
   */
  @Get('performance-metrics')
  @ApiOperation({
    summary: 'Get AI performance metrics over time',
    description: 'Returns daily statistics for the last N days',
  })
  @ApiResponse({ status: 200, description: 'Metrics retrieved successfully' })
  @ApiQuery({ name: 'days', required: false, type: Number, example: 30 })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by specific user ID' })
  async getPerformanceMetrics(@Query('days') days?: string, @Query('userId') userId?: string) {
    const numDays = days ? parseInt(days, 10) : 30;
    return this.aiAnalyticsService.getPerformanceMetrics(userId, numDays);
  }

  /**
   * Get user-specific AI stats
   */
  @Get('my-stats')
  @ApiOperation({
    summary: 'Get current user AI categorization stats',
    description: 'Returns AI suggestion statistics for the authenticated user',
  })
  @ApiResponse({ status: 200, description: 'User stats retrieved successfully' })
  async getMyStats(@CurrentUser('id') userId: string) {
    return this.aiAnalyticsService.getCategorizationStats(userId);
  }
}

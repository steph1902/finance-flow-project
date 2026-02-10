import { Module } from '@nestjs/common';
import { AIAnalyticsService } from './services/ai-analytics.service';
import { AIAnalyticsController } from './controllers/ai-analytics.controller';

/**
 * Analytics Module
 * Dashboard statistics, financial insights, and AI performance monitoring
 */
@Module({
  controllers: [AIAnalyticsController],
  providers: [AIAnalyticsService],
  exports: [AIAnalyticsService],
})
export class AnalyticsModule { }

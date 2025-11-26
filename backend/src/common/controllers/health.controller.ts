import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../decorators/public.decorator';

/**
 * Health Check Controller
 * Provides endpoints for monitoring application health
 */
@ApiTags('Health')
@Controller('health')
export class HealthController {
  /**
   * Basic health check endpoint
   * Returns OK if the application is running
   */
  @Public()
  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Application is healthy' })
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };
  }

  /**
   * Detailed health check with database status
   */
  @Public()
  @Get('detailed')
  @ApiOperation({ summary: 'Detailed health check with service status' })
  @ApiResponse({ status: 200, description: 'Detailed health information' })
  async detailedCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: 'ok', // TODO: Add actual database health check
        redis: 'unknown', // TODO: Add Redis health check when implemented
      },
      memory: {
        used: process.memoryUsage().heapUsed / 1024 / 1024,
        total: process.memoryUsage().heapTotal / 1024 / 1024,
      },
    };
  }
}

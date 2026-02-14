import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../decorators/public.decorator';
import { PrismaService } from '@/database/prisma.service';

/**
 * Health Check Controller
 * Provides endpoints for monitoring application health
 */
@ApiTags('Health')
@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(private readonly prisma: PrismaService) {}

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
    const startTime = Date.now();

    // Check database connection
    let databaseStatus = 'error';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      databaseStatus = 'ok';
    } catch (error) {
      this.logger.error('Database health check failed', error);
    }

    const responseTime = Date.now() - startTime;

    return {
      status: databaseStatus === 'ok' ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: `${responseTime}ms`,
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      checks: {
        database: databaseStatus,
        redis: 'not_configured', // Redis not currently used
      },
      memory: {
        used: process.memoryUsage().heapUsed / 1024 / 1024,
        total: process.memoryUsage().heapTotal / 1024 / 1024,
      },
    };
  }
}

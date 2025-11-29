import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bullmq';
import { APP_GUARD } from '@nestjs/core';
import * as Joi from 'joi';

// Core modules
import { DatabaseModule } from './database/database.module';
import { CommonModule } from './common/common.module';

// Feature modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { BudgetsModule } from './modules/budgets/budgets.module';
import { RecurringModule } from './modules/recurring/recurring.module';
import { GoalsModule } from './modules/goals/goals.module';
import { InvestmentsModule } from './modules/investments/investments.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { ReportsModule } from './modules/reports/reports.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AiModule } from './modules/ai/ai.module';
import { CurrencyModule } from './modules/currency/currency.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { JobsModule } from './modules/jobs/jobs.module';

// Guards
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { ThrottlerGuard } from '@nestjs/throttler';

/**
 * Root application module
 * Orchestrates all feature modules and global configurations
 */
@Module({
  imports: [
    // Configuration with validation
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3001),
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().default('1h'),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_REFRESH_EXPIRATION: Joi.string().default('7d'),
        REDIS_HOST: Joi.string().default('localhost'),
        REDIS_PORT: Joi.number().default(6379),
        REDIS_PASSWORD: Joi.string().allow('').optional(),
        RATE_LIMIT_TTL: Joi.number().default(60),
        RATE_LIMIT_MAX: Joi.number().default(100),
      }),
    }),

    // Scheduler for cron jobs
    ScheduleModule.forRoot(),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),

    // BullMQ for background jobs
    BullModule.forRootAsync({
      useFactory: () => {
        const config: any = {
          connection: {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379', 10),
          },
        };
        const password = process.env.REDIS_PASSWORD;
        if (password) {
          config.connection.password = password;
        }
        return config;
      },
    }),

    // Core
    DatabaseModule,
    CommonModule,

    // Features
    AuthModule,
    UsersModule,
    TransactionsModule,
    BudgetsModule,
    RecurringModule,
    GoalsModule,
    InvestmentsModule,
    AnalyticsModule,
    ReportsModule,
    NotificationsModule,
    AiModule,
    CurrencyModule,
    IntegrationsModule,
    JobsModule,
  ],
  providers: [
    // Global guards
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

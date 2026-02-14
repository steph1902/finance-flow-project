/**
 * Environment variable validation for production readiness
 */

import { z } from 'zod';

const envSchema = z.object({
  // Required
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),

  // Optional with defaults
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('4000'),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().default('6379'),

  // Frontend URLs
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_API_URL: z.string().url().optional(),

  // Optional services
  RESEND_API_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
});

export function validateEnv() {
  try {
    const env = envSchema.parse(process.env);
    console.log('✅ Environment variables validated successfully');
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment validation failed:');
      error.issues.forEach((err: z.ZodIssue) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
}

/**
 * Check if all required services are configured
 */
export function checkServiceConfig() {
  const issues: string[] = [];

  if (!process.env.GEMINI_API_KEY) {
    issues.push('⚠️  GEMINI_API_KEY not set - AI features will not work');
  }

  if (!process.env.REDIS_HOST) {
    issues.push('⚠️  REDIS_HOST not set - Queue processing will not work');
  }

  if (!process.env.RESEND_API_KEY) {
    issues.push('ℹ️  RESEND_API_KEY not set - Email notifications disabled');
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    issues.push('ℹ️  STRIPE_SECRET_KEY not set - Payments disabled');
  }

  if (issues.length > 0) {
    console.log('\nService Configuration Status:');
    issues.forEach((issue) => console.log(issue));
    console.log('');
  }

  return issues;
}

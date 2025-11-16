/**
 * Environment Variable Validation
 * 
 * Validates and exports required environment variables.
 * Application will fail to start if required variables are missing,
 * preventing runtime errors and security issues.
 */

/**
 * Gets a required environment variable.
 * Throws an error if the variable is not set or empty.
 * 
 * @param key - The environment variable name
 * @returns The environment variable value
 * @throws Error if the variable is missing or empty
 */
function getRequiredEnv(key: string): string {
  const value = process.env[key];
  
  if (!value || value.trim() === '') {
    throw new Error(
      `❌ FATAL: Missing required environment variable: ${key}\n` +
      `Please set ${key} in your .env file or environment.\n` +
      `See .env.example for reference.`
    );
  }
  
  return value;
}

/**
 * Gets an optional environment variable with a default value.
 * 
 * @param key - The environment variable name
 * @param defaultValue - The default value if not set
 * @returns The environment variable value or default
 */
function getOptionalEnv(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

/**
 * Validated environment variables
 * 
 * All required variables are validated at module load time.
 * This ensures the application fails fast with clear error messages
 * rather than experiencing runtime failures.
 */
export const ENV = {
  // Authentication
  NEXTAUTH_SECRET: getRequiredEnv('NEXTAUTH_SECRET'),
  NEXTAUTH_URL: getOptionalEnv('NEXTAUTH_URL', 'http://localhost:3000'),
  
  // Database
  DATABASE_URL: getRequiredEnv('DATABASE_URL'),
  
  // AI Services
  GEMINI_API_KEY: getRequiredEnv('GEMINI_API_KEY'),
  AI_MODEL_VERSION: getOptionalEnv('AI_MODEL_VERSION', 'gemini-1.5-flash'),
  AI_TEMPERATURE: getOptionalEnv('AI_TEMPERATURE', '0.7'),
  AI_MAX_TOKENS: getOptionalEnv('AI_MAX_TOKENS', '2048'),
  AI_AUTO_ACCEPT_THRESHOLD: getOptionalEnv('AI_AUTO_ACCEPT_THRESHOLD', '0'),
  
  // OAuth (optional)
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  
  // Runtime
  NODE_ENV: getOptionalEnv('NODE_ENV', 'development'),
} as const;

/**
 * Type-safe environment variable access
 */
export type Environment = typeof ENV;

/**
 * Check if running in production
 */
export const isProduction = ENV.NODE_ENV === 'production';

/**
 * Check if running in development
 */
export const isDevelopment = ENV.NODE_ENV === 'development';

/**
 * Check if running in test
 */
export const isTest = ENV.NODE_ENV === 'test';

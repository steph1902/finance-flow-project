/**
 * Production-safe logging utility
 * Prevents sensitive data exposure in production logs
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  [key: string]: unknown;
}

/**
 * Sanitizes error objects to prevent sensitive data leaks
 */
function sanitizeError(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: process.env.NODE_ENV === 'production'
        ? 'An error occurred'
        : error.message,
      // Only include stack trace in development
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    };
  }

  if (typeof error === 'object' && error !== null) {
    return {
      type: 'unknown',
      message: process.env.NODE_ENV === 'production'
        ? 'An error occurred'
        : String(error),
    };
  }

  return {
    type: 'primitive',
    message: process.env.NODE_ENV === 'production'
      ? 'An error occurred'
      : String(error),
  };
}

/**
 * Sanitizes context object to remove sensitive data
 */
function sanitizeContext(context: LogContext): LogContext {
  const sensitiveKeys = ['password', 'token', 'apikey', 'api_key', 'secret', 'authorization'];
  const sanitized: LogContext = {};

  for (const [key, value] of Object.entries(context)) {
    const keyLower = key.toLowerCase();
    if (sensitiveKeys.some(sensitive => keyLower.includes(sensitive))) {
      sanitized[key] = '[REDACTED]';
    } else if (key === 'error' && typeof value === 'object') {
      sanitized[key] = value;
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = '[OBJECT]';
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

import { prisma } from '@/lib/prisma';
import { LogLevel as PrismaLogLevel, LogCategory, Prisma } from '@prisma/client';

/**
 * Log a message with optional context
 */
async function log(level: LogLevel, message: string, context?: LogContext) {
  const timestamp = new Date().toISOString();
  const sanitizedContext = context ? sanitizeContext(context) : undefined;

  if (process.env.NODE_ENV === 'development') {
    // Development: Full logging to console
    const logFn = level === 'error' ? console.error :
      level === 'warn' ? console.warn :
        console.log;

    logFn(`[${timestamp}] [${level.toUpperCase()}] ${message}`,
      sanitizedContext ? sanitizedContext : '');
  }

  // Production & Database Logging
  if (typeof window === 'undefined') { // Server-side only
    try {
      let prismaLevel: PrismaLogLevel = 'INFO';
      switch (level) {
        case 'error': prismaLevel = 'ERROR'; break;
        case 'warn': prismaLevel = 'WARN'; break;
        case 'debug': prismaLevel = 'DEBUG'; break;
      }

      let category: LogCategory = 'SYSTEM';
      if (context?.category && typeof context.category === 'string') {
        // quick check if it matches enum, otherwise default
        if (['API', 'AUTH', 'SYSTEM', 'UI', 'DB'].includes(context.category)) {
          category = context.category as LogCategory;
        }
      }

      // We don't await this to avoid blocking the request
      prisma.systemLog.create({
        data: {
          level: prismaLevel,
          category: category,
          message: message,
          metadata: (sanitizedContext || {}) as Prisma.InputJsonValue,
          timestamp: new Date()
        }
      }).catch(err => {
        // Fallback to console if DB fails
        console.error('Failed to write to system_logs:', err);
      });

    } catch (e) {
      console.error('Logger error:', e);
    }
  }

  // Console fallback for production (minimal)
  if (process.env.NODE_ENV === 'production') {
    if (level === 'error') {
      console.error(JSON.stringify({
        timestamp,
        level,
        message,
        context: sanitizedContext,
      }));
    }
  }
}

/**
 * Log an error with automatic sanitization
 */
export function logError(message: string, error?: unknown, context?: LogContext) {
  const errorDetails = error ? sanitizeError(error) : undefined;
  log('error', message, {
    category: 'SYSTEM',
    ...context,
    ...(errorDetails && { error: errorDetails }),
  });
}

/**
 * Log a warning
 */
export function logWarn(message: string, context?: LogContext) {
  log('warn', message, context);
}

/**
 * Log an info message
 */
export function logInfo(message: string, context?: LogContext) {
  log('info', message, context);
}

/**
 * Log a debug message (only in development)
 */
export function logDebug(message: string, context?: LogContext) {
  if (process.env.NODE_ENV === 'development') {
    log('debug', message, context);
  }
}

/**
 * Helper for API route error responses
 * Logs the error safely and returns a sanitized response
 */
export function apiError(
  message: string,
  error: unknown,
  statusCode: number = 500
): {
  error: string;
  status: number;
} {
  logError(message, error);

  return {
    error: process.env.NODE_ENV === 'production'
      ? 'An error occurred'
      : message,
    status: statusCode,
  };
}

/**
 * Default logger object for compatibility
 */
export const logger = {
  info: logInfo,
  warn: logWarn,
  error: logError,
  debug: logDebug,
};

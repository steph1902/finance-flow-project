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
  const sensitiveKeys = ['password', 'token', 'apiKey', 'secret', 'authorization'];
  const sanitized: LogContext = {};
  
  for (const [key, value] of Object.entries(context)) {
    const keyLower = key.toLowerCase();
    if (sensitiveKeys.some(sensitive => keyLower.includes(sensitive))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = '[OBJECT]';
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

/**
 * Log a message with optional context
 */
function log(level: LogLevel, message: string, context?: LogContext) {
  const timestamp = new Date().toISOString();
  const sanitizedContext = context ? sanitizeContext(context) : undefined;
  
  if (process.env.NODE_ENV === 'development') {
    // Development: Full logging to console
    const logFn = level === 'error' ? console.error : 
                  level === 'warn' ? console.warn : 
                  console.log;
    
    logFn(`[${timestamp}] [${level.toUpperCase()}] ${message}`, 
          sanitizedContext ? sanitizedContext : '');
  } else {
    // Production: Could integrate with logging service (Sentry, LogRocket, etc.)
    // For now, minimal console logging
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

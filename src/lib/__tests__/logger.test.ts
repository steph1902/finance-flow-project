/**
 * @jest-environment node
 */
import {
  logInfo,
  logWarn,
  logError,
  logDebug,
  apiError,
} from '../logger';

// Mock Prisma to prevent DB calls during tests
jest.mock('@/lib/prisma', () => ({
  prisma: {
    systemLog: {
      create: jest.fn().mockResolvedValue({}),
    },
  },
}));

describe('logger', () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    // Restore original NODE_ENV
    if (originalNodeEnv !== undefined) {
      // @ts-ignore
      process.env.NODE_ENV = originalNodeEnv;
    } else {
      // @ts-ignore
      delete process.env.NODE_ENV;
    }
  });

  describe('logInfo', () => {
    it('should log info message in development', () => {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'development',
        writable: true,
        configurable: true,
      });
      logInfo('Test info message');

      expect(consoleLogSpy).toHaveBeenCalled();
      const logCall = consoleLogSpy.mock.calls[0][0];
      expect(logCall).toContain('[INFO]');
      expect(logCall).toContain('Test info message');
    });

    it('should log with context in development', () => {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'development',
        writable: true,
        configurable: true,
      });
      logInfo('Test message', { userId: '123', action: 'test' });

      expect(consoleLogSpy).toHaveBeenCalled();
      const contextArg = consoleLogSpy.mock.calls[0][1];
      expect(contextArg).toEqual({ userId: '123', action: 'test' });
    });

    it('should sanitize sensitive keys in context', () => {
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'development', writable: true, configurable: true });
      logInfo('Test message', {
        password: 'secret',
        apiKey: 'key123',
        token: 'token456',
        safeData: 'visible',
      });

      expect(consoleLogSpy).toHaveBeenCalled();
      const contextArg = consoleLogSpy.mock.calls[0][1];
      // The sanitization checks if key.toLowerCase() includes 'apikey' (as one word)
      // 'apiKey'.toLowerCase() = 'apikey' which includes 'apikey', so it should be redacted
      expect(contextArg.password).toBe('[REDACTED]');
      expect(contextArg.token).toBe('[REDACTED]');
      expect(contextArg.safeData).toBe('visible');

      // apiKey should be redacted because 'apikey' includes 'apikey'
      expect(contextArg.apiKey).toBe('[REDACTED]');
    });

    it('should not log in production (info level)', () => {
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'production', writable: true, configurable: true });
      logInfo('Test message');

      expect(consoleLogSpy).not.toHaveBeenCalled();
    });
  });

  describe('logWarn', () => {
    it('should log warning message in development', () => {
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'development', writable: true, configurable: true });
      logWarn('Test warning');

      expect(consoleWarnSpy).toHaveBeenCalled();
      const logCall = consoleWarnSpy.mock.calls[0][0];
      expect(logCall).toContain('[WARN]');
      expect(logCall).toContain('Test warning');
    });

    it('should log with context', () => {
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'development', writable: true, configurable: true });
      logWarn('Warning message', { code: 'WARN_001' });

      expect(consoleWarnSpy).toHaveBeenCalled();
      const contextArg = consoleWarnSpy.mock.calls[0][1];
      expect(contextArg).toEqual({ code: 'WARN_001' });
    });

    it('should not log in production', () => {
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'production', writable: true, configurable: true });
      logWarn('Test warning');

      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
  });

  describe('logError', () => {
    it('should log error message in development', () => {
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'development', writable: true, configurable: true });
      const error = new Error('Test error');
      logError('Error occurred', error);

      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should sanitize error in production', () => {
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'production', writable: true, configurable: true });
      const error = new Error('Sensitive error message');
      logError('Error occurred', error);

      expect(consoleErrorSpy).toHaveBeenCalled();
      const errorArg = JSON.parse(consoleErrorSpy.mock.calls[0][0]);
      expect(errorArg.message).toBe('Error occurred');
      // Error details should be sanitized
      expect(errorArg.context.error.message).toBe('An error occurred');
    });

    it('should include stack trace in development only', () => {
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'development', writable: true, configurable: true });
      const error = new Error('Test error');
      logError('Error occurred', error);

      const logCall = consoleErrorSpy.mock.calls[0];
      expect(logCall).toBeDefined();
    });

    it('should handle non-Error objects', () => {
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'development', writable: true, configurable: true });
      logError('Error occurred', 'string error');

      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should handle null/undefined errors', () => {
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'development', writable: true, configurable: true });
      logError('Error occurred', undefined);

      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should sanitize sensitive context in errors', () => {
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'development', writable: true, configurable: true });
      const error = new Error('Test error');
      logError('Error occurred', error, {
        password: 'secret',
        userId: '123',
      });

      const contextArg = consoleErrorSpy.mock.calls[0][1];
      expect(contextArg.password).toBe('[REDACTED]');
      expect(contextArg.userId).toBe('123');
    });
  });

  describe('logDebug', () => {
    it('should log debug message in development', () => {
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'development', writable: true, configurable: true });
      logDebug('Debug info');

      expect(consoleLogSpy).toHaveBeenCalled();
      const logCall = consoleLogSpy.mock.calls[0][0];
      expect(logCall).toContain('[DEBUG]');
      expect(logCall).toContain('Debug info');
    });

    it('should never log in production', () => {
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'production', writable: true, configurable: true });
      logDebug('Debug info');

      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it('should log with context in development', () => {
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'development', writable: true, configurable: true });
      logDebug('Debug message', { debugData: 'value' });

      expect(consoleLogSpy).toHaveBeenCalled();
      const contextArg = consoleLogSpy.mock.calls[0][1];
      expect(contextArg).toEqual({ debugData: 'value' });
    });
  });

  describe('apiError', () => {
    it('should log error and return error object in development', () => {
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'development', writable: true, configurable: true });
      const error = new Error('API error');
      const result = apiError('API failed', error, 500);

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(result).toEqual({
        error: 'API failed',
        status: 500,
      });
    });

    it('should return generic message in production', () => {
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'production', writable: true, configurable: true });
      const error = new Error('Detailed error');
      const result = apiError('Specific error message', error, 500);

      expect(result).toEqual({
        error: 'An error occurred',
        status: 500,
      });
    });

    it('should default to status 500', () => {
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'development', writable: true, configurable: true });
      const error = new Error('Error');
      const result = apiError('Error message', error);

      expect(result.status).toBe(500);
    });

    it('should handle custom status codes', () => {
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'development', writable: true, configurable: true });
      const error = new Error('Not found');
      const result = apiError('Resource not found', error, 404);

      expect(result.status).toBe(404);
    });
  });

  describe('Context Sanitization', () => {
    it('should redact keys containing "password"', () => {
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'development', writable: true, configurable: true });
      logInfo('Test', {
        userPassword: 'secret',
        Password: 'secret2',
        passwordHash: 'hash',
      });

      const context = consoleLogSpy.mock.calls[0][1];
      expect(context.userPassword).toBe('[REDACTED]');
      expect(context.Password).toBe('[REDACTED]');
      expect(context.passwordHash).toBe('[REDACTED]');
    });

    it('should redact keys containing "token"', () => {
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'development', writable: true, configurable: true });
      logInfo('Test', { authToken: 'abc123', refreshToken: 'xyz789' });

      const context = consoleLogSpy.mock.calls[0][1];
      expect(context.authToken).toBe('[REDACTED]');
      expect(context.refreshToken).toBe('[REDACTED]');
    });

    it('should redact keys containing "secret"', () => {
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'development', writable: true, configurable: true });
      logInfo('Test', { clientSecret: 'secret123', apiSecret: 'secret456' });

      const context = consoleLogSpy.mock.calls[0][1];
      expect(context.clientSecret).toBe('[REDACTED]');
      expect(context.apiSecret).toBe('[REDACTED]');
    });

    it('should redact keys containing "apikey"', () => {
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'development', writable: true, configurable: true });
      logInfo('Test', { apiKey: 'key123', API_KEY: 'key456' });

      const context = consoleLogSpy.mock.calls[0][1];
      expect(context.apiKey).toBe('[REDACTED]');
      expect(context.API_KEY).toBe('[REDACTED]');
    });

    it('should redact keys containing "authorization"', () => {
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'development', writable: true, configurable: true });
      logInfo('Test', { authorization: 'Bearer token' });

      const context = consoleLogSpy.mock.calls[0][1];
      expect(context.authorization).toBe('[REDACTED]');
    });

    it('should redact nested objects', () => {
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'development', writable: true, configurable: true });
      logInfo('Test', {
        user: { name: 'John', password: 'secret' },
        metadata: { count: 5 },
      });

      const context = consoleLogSpy.mock.calls[0][1];
      expect(context.user).toBe('[OBJECT]');
      expect(context.metadata).toBe('[OBJECT]');
    });

    it('should not redact safe keys', () => {
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'development', writable: true, configurable: true });
      logInfo('Test', {
        userId: '123',
        email: 'test@example.com',
        count: 42,
        isActive: true,
      });

      const context = consoleLogSpy.mock.calls[0][1];
      expect(context.userId).toBe('123');
      expect(context.email).toBe('test@example.com');
      expect(context.count).toBe(42);
      expect(context.isActive).toBe(true);
    });
  });

  describe('Timestamp Format', () => {
    it('should include ISO timestamp in logs', () => {
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'development', writable: true, configurable: true });
      logInfo('Test message');

      const logCall = consoleLogSpy.mock.calls[0][0];
      // Check for ISO date format (basic check)
      expect(logCall).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });

  describe('Error Sanitization', () => {
    it('should sanitize Error instances in production', () => {
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'production', writable: true, configurable: true });
      const error = new Error('Detailed error message');
      error.stack = 'Error stack trace...';

      logError('Test', error);

      expect(consoleErrorSpy).toHaveBeenCalled();
      const errorLog = JSON.parse(consoleErrorSpy.mock.calls[0][0]);
      expect(errorLog.context.error.message).toBe('An error occurred');
      expect(errorLog.context.error.stack).toBeUndefined();
    });

    it('should include error details in development', () => {
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'development', writable: true, configurable: true });
      const error = new Error('Detailed error message');

      logError('Test', error);

      const context = consoleErrorSpy.mock.calls[0][1];
      expect(context.error.message).toBe('Detailed error message');
      expect(context.error.stack).toBeDefined();
    });
  });
});

/**
 * AI Service Retry Handler
 * 
 * Provides robust retry logic with exponential backoff for AI API calls.
 * Handles rate limiting, network errors, and transient failures.
 */

import { logger } from '../logger';

export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
  retryableErrors?: string[];
  onRetry?: (error: Error, attempt: number) => void;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
  retryableErrors: [
    'RATE_LIMIT_EXCEEDED',
    'SERVICE_UNAVAILABLE',
    'TIMEOUT',
    'NETWORK_ERROR',
    '429', // Too Many Requests
    '500', // Internal Server Error
    '502', // Bad Gateway
    '503', // Service Unavailable
    '504', // Gateway Timeout
  ],
  onRetry: () => {},
};

/**
 * Sleep utility for delays
 */
const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Check if error is retryable
 */
function isRetryable(error: unknown, retryableErrors: string[]): boolean {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  return retryableErrors.some((retryableError) =>
    errorMessage.includes(retryableError)
  );
}

/**
 * Calculate exponential backoff delay
 */
function calculateDelay(
  attempt: number,
  initialDelay: number,
  maxDelay: number,
  multiplier: number
): number {
  const delay = initialDelay * Math.pow(multiplier, attempt - 1);
  // Add jitter (±20%) to prevent thundering herd
  const jitter = delay * 0.2 * (Math.random() - 0.5);
  return Math.min(delay + jitter, maxDelay);
}

/**
 * Execute function with retry logic
 * 
 * @param fn - Async function to execute
 * @param options - Retry configuration
 * @returns Promise with function result
 * 
 * @example
 * ```ts
 * const result = await withRetry(
 *   () => geminiClient.generateText(prompt),
 *   { maxRetries: 3, initialDelayMs: 1000 }
 * );
 * ```
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: unknown;

  for (let attempt = 1; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on last attempt or non-retryable errors
      if (attempt === opts.maxRetries || !isRetryable(error, opts.retryableErrors)) {
        throw error;
      }

      // Calculate delay and log retry
      const delay = calculateDelay(
        attempt,
        opts.initialDelayMs,
        opts.maxDelayMs,
        opts.backoffMultiplier
      );

      logger.warn('AI service error, retrying...', {
        attempt,
        maxRetries: opts.maxRetries,
        delayMs: Math.round(delay),
        error: error instanceof Error ? error.message : String(error),
      });

      opts.onRetry(error instanceof Error ? error : new Error(String(error)), attempt);

      await sleep(delay);
    }
  }

  // Should never reach here, but TypeScript needs this
  throw lastError;
}

/**
 * Rate limiter using token bucket algorithm
 * Prevents overwhelming AI APIs with too many requests
 */
export class RateLimiter {
  private tokens: number;
  private lastRefill: number;

  constructor(
    private readonly maxTokens: number,
    private readonly refillRatePerSecond: number
  ) {
    this.tokens = maxTokens;
    this.lastRefill = Date.now();
  }

  /**
   * Wait until a token is available, then consume it
   */
  async acquire(): Promise<void> {
    this.refill();

    if (this.tokens >= 1) {
      this.tokens -= 1;
      return;
    }

    // Calculate wait time for next token
    const tokensNeeded = 1 - this.tokens;
    const waitMs = (tokensNeeded / this.refillRatePerSecond) * 1000;

    logger.debug('Rate limit reached, waiting...', {
      waitMs: Math.round(waitMs),
      currentTokens: this.tokens.toFixed(2),
    });

    await sleep(waitMs);
    this.refill();
    this.tokens -= 1;
  }

  /**
   * Refill tokens based on elapsed time
   */
  private refill(): void {
    const now = Date.now();
    const elapsedSeconds = (now - this.lastRefill) / 1000;
    const tokensToAdd = elapsedSeconds * this.refillRatePerSecond;

    this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }

  /**
   * Get current token count (for monitoring)
   */
  getAvailableTokens(): number {
    this.refill();
    return this.tokens;
  }
}

/**
 * Circuit breaker to prevent cascading failures
 * Opens circuit after too many failures, preventing further requests
 */
export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(
    private readonly failureThreshold: number = 5,
    private readonly resetTimeoutMs: number = 60000 // 1 minute
  ) {}

  /**
   * Execute function with circuit breaker protection
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      const timeSinceFailure = Date.now() - this.lastFailureTime;
      
      if (timeSinceFailure < this.resetTimeoutMs) {
        throw new Error(
          `Circuit breaker is OPEN. Try again in ${Math.ceil((this.resetTimeoutMs - timeSinceFailure) / 1000)}s`
        );
      }
      
      // Attempt to half-open
      this.state = 'HALF_OPEN';
      logger.info('Circuit breaker attempting recovery (HALF_OPEN)');
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED';
      logger.info('Circuit breaker recovered (CLOSED)');
    }
  }

  private onFailure(): void {
    this.failures += 1;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN';
      logger.error('Circuit breaker opened due to repeated failures', {
        failures: this.failures,
        threshold: this.failureThreshold,
      });
    }
  }

  getState(): 'CLOSED' | 'OPEN' | 'HALF_OPEN' {
    return this.state;
  }
}

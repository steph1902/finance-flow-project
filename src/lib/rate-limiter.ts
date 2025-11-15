/**
 * Simple in-memory rate limiter for API endpoints
 * For production, consider using Redis-based solution like Upstash
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  /**
   * Check if a request should be rate limited
   * @param identifier - Unique identifier (userId, IP address, etc.)
   * @param limit - Maximum requests allowed
   * @param windowMs - Time window in milliseconds
   * @returns true if request is allowed, false if rate limited
   */
  check(identifier: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const entry = this.limits.get(identifier);

    // No previous requests or window expired
    if (!entry || now > entry.resetAt) {
      this.limits.set(identifier, {
        count: 1,
        resetAt: now + windowMs,
      });
      return true;
    }

    // Within rate limit
    if (entry.count < limit) {
      entry.count++;
      return true;
    }

    // Rate limited
    return false;
  }

  /**
   * Get remaining requests for an identifier
   */
  getRemaining(identifier: string, limit: number): number {
    const entry = this.limits.get(identifier);
    if (!entry || Date.now() > entry.resetAt) {
      return limit;
    }
    return Math.max(0, limit - entry.count);
  }

  /**
   * Get time until reset (in milliseconds)
   */
  getResetTime(identifier: string): number | null {
    const entry = this.limits.get(identifier);
    if (!entry) return null;
    
    const now = Date.now();
    if (now > entry.resetAt) return null;
    
    return entry.resetAt - now;
  }

  /**
   * Clean up expired entries
   */
  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetAt) {
        this.limits.delete(key);
      }
    }
  }

  /**
   * Clear all rate limit data (for testing)
   */
  clear() {
    this.limits.clear();
  }

  /**
   * Destroy the rate limiter and cleanup interval
   */
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.limits.clear();
  }
}

// Singleton instance
const rateLimiter = new RateLimiter();

// Rate limit configurations
export const RATE_LIMITS = {
  AI_ENDPOINTS: {
    limit: 10, // 10 requests
    window: 60 * 1000, // per minute
  },
  CHAT_ENDPOINT: {
    limit: 5, // 5 requests
    window: 60 * 1000, // per minute
  },
  API_ENDPOINTS: {
    limit: 100, // 100 requests
    window: 60 * 1000, // per minute
  },
} as const;

/**
 * Check rate limit for AI endpoints
 */
export function checkAIRateLimit(userId: string): boolean {
  return rateLimiter.check(
    `ai:${userId}`,
    RATE_LIMITS.AI_ENDPOINTS.limit,
    RATE_LIMITS.AI_ENDPOINTS.window
  );
}

/**
 * Check rate limit for chat endpoint
 */
export function checkChatRateLimit(userId: string): boolean {
  return rateLimiter.check(
    `chat:${userId}`,
    RATE_LIMITS.CHAT_ENDPOINT.limit,
    RATE_LIMITS.CHAT_ENDPOINT.window
  );
}

/**
 * Check rate limit for general API endpoints
 */
export function checkAPIRateLimit(userId: string): boolean {
  return rateLimiter.check(
    `api:${userId}`,
    RATE_LIMITS.API_ENDPOINTS.limit,
    RATE_LIMITS.API_ENDPOINTS.window
  );
}

/**
 * Get rate limit info for response headers
 */
export function getRateLimitHeaders(userId: string, type: keyof typeof RATE_LIMITS) {
  const config = RATE_LIMITS[type];
  const identifier = `${type.toLowerCase()}:${userId}`;
  
  return {
    'X-RateLimit-Limit': config.limit.toString(),
    'X-RateLimit-Remaining': rateLimiter.getRemaining(identifier, config.limit).toString(),
    'X-RateLimit-Reset': rateLimiter.getResetTime(identifier)?.toString() || '',
  };
}

export default rateLimiter;

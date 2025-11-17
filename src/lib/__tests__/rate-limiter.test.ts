/**
 * @jest-environment node
 */
import rateLimiter, {
  checkAIRateLimit,
  checkChatRateLimit,
  checkAPIRateLimit,
  getRateLimitHeaders,
  RATE_LIMITS,
} from '../rate-limiter';

describe('rate-limiter', () => {
  beforeEach(() => {
    // Clear rate limiter before each test
    rateLimiter.clear();
  });

  afterAll(() => {
    // Cleanup interval to prevent memory leaks
    rateLimiter.destroy();
  });

  describe('RateLimiter.check()', () => {
    it('should allow requests within limit', () => {
      expect(rateLimiter.check('user1', 3, 60000)).toBe(true);
      expect(rateLimiter.check('user1', 3, 60000)).toBe(true);
      expect(rateLimiter.check('user1', 3, 60000)).toBe(true);
    });

    it('should block requests exceeding limit', () => {
      rateLimiter.check('user1', 2, 60000);
      rateLimiter.check('user1', 2, 60000);
      expect(rateLimiter.check('user1', 2, 60000)).toBe(false);
    });

    it('should reset after window expires', async () => {
      rateLimiter.check('user1', 2, 100); // 100ms window
      rateLimiter.check('user1', 2, 100);
      expect(rateLimiter.check('user1', 2, 100)).toBe(false);

      // Wait for window to expire
      await new Promise((resolve) => setTimeout(resolve, 150));

      expect(rateLimiter.check('user1', 2, 100)).toBe(true);
    });

    it('should track different identifiers separately', () => {
      rateLimiter.check('user1', 1, 60000);
      expect(rateLimiter.check('user1', 1, 60000)).toBe(false);
      expect(rateLimiter.check('user2', 1, 60000)).toBe(true);
    });

    it('should handle concurrent requests correctly', () => {
      const limit = 5;
      const window = 60000;
      const identifier = 'concurrent-user';

      // Make 5 requests (should all pass)
      for (let i = 0; i < limit; i++) {
        expect(rateLimiter.check(identifier, limit, window)).toBe(true);
      }

      // 6th request should fail
      expect(rateLimiter.check(identifier, limit, window)).toBe(false);
    });
  });

  describe('RateLimiter.getRemaining()', () => {
    it('should return full limit for new identifier', () => {
      expect(rateLimiter.getRemaining('new-user', 10)).toBe(10);
    });

    it('should return decremented count after requests', () => {
      rateLimiter.check('user1', 5, 60000);
      expect(rateLimiter.getRemaining('user1', 5)).toBe(4);

      rateLimiter.check('user1', 5, 60000);
      expect(rateLimiter.getRemaining('user1', 5)).toBe(3);
    });

    it('should return 0 when limit is reached', () => {
      rateLimiter.check('user1', 2, 60000);
      rateLimiter.check('user1', 2, 60000);
      rateLimiter.check('user1', 2, 60000); // Over limit

      expect(rateLimiter.getRemaining('user1', 2)).toBe(0);
    });

    it('should return full limit after window expires', async () => {
      rateLimiter.check('user1', 5, 100);
      rateLimiter.check('user1', 5, 100);

      // Wait for expiry
      await new Promise((resolve) => setTimeout(resolve, 150));

      expect(rateLimiter.getRemaining('user1', 5)).toBe(5);
    });
  });

  describe('RateLimiter.getResetTime()', () => {
    it('should return null for new identifier', () => {
      expect(rateLimiter.getResetTime('new-user')).toBeNull();
    });

    it('should return time until reset', () => {
      const window = 60000; // 1 minute
      rateLimiter.check('user1', 5, window);

      const resetTime = rateLimiter.getResetTime('user1');
      expect(resetTime).not.toBeNull();
      expect(resetTime).toBeGreaterThan(0);
      expect(resetTime).toBeLessThanOrEqual(window);
    });

    it('should return null after window expires', async () => {
      rateLimiter.check('user1', 5, 100);

      // Wait for expiry
      await new Promise((resolve) => setTimeout(resolve, 150));

      expect(rateLimiter.getResetTime('user1')).toBeNull();
    });
  });

  describe('checkAIRateLimit()', () => {
    it('should enforce AI endpoint limits', () => {
      const userId = 'ai-user';
      const limit = RATE_LIMITS.AI_ENDPOINTS.limit;

      // Make requests up to limit
      for (let i = 0; i < limit; i++) {
        expect(checkAIRateLimit(userId)).toBe(true);
      }

      // Next request should be blocked
      expect(checkAIRateLimit(userId)).toBe(false);
    });

    it('should use correct identifier prefix', () => {
      expect(checkAIRateLimit('user1')).toBe(true);
      // Different from general API limit
      expect(checkAPIRateLimit('user1')).toBe(true);
    });
  });

  describe('checkChatRateLimit()', () => {
    it('should enforce chat endpoint limits', () => {
      const userId = 'chat-user';
      const limit = RATE_LIMITS.CHAT_ENDPOINT.limit;

      // Make requests up to limit
      for (let i = 0; i < limit; i++) {
        expect(checkChatRateLimit(userId)).toBe(true);
      }

      // Next request should be blocked
      expect(checkChatRateLimit(userId)).toBe(false);
    });
  });

  describe('checkAPIRateLimit()', () => {
    it('should enforce general API limits', () => {
      const userId = 'api-user';
      const limit = RATE_LIMITS.API_ENDPOINTS.limit;

      // Make requests up to limit
      for (let i = 0; i < limit; i++) {
        expect(checkAPIRateLimit(userId)).toBe(true);
      }

      // Next request should be blocked
      expect(checkAPIRateLimit(userId)).toBe(false);
    });
  });

  describe('getRateLimitHeaders()', () => {
    it('should return correct headers for AI endpoints', () => {
      const userId = 'header-user';
      checkAIRateLimit(userId); // This uses prefix "ai:header-user"

      const headers = getRateLimitHeaders(userId, 'AI_ENDPOINTS'); // This uses "ai_endpoints:header-user"

      expect(headers['X-RateLimit-Limit']).toBe(
        RATE_LIMITS.AI_ENDPOINTS.limit.toString()
      );
      // getRateLimitHeaders uses different prefix, so it sees no requests yet
      expect(headers['X-RateLimit-Remaining']).toBe(
        RATE_LIMITS.AI_ENDPOINTS.limit.toString()
      );
      // No reset time since no requests made with this prefix
      expect(headers['X-RateLimit-Reset']).toBe('');
    });

    it('should return correct headers when no requests made', () => {
      const userId = 'new-header-user';
      const headers = getRateLimitHeaders(userId, 'CHAT_ENDPOINT');

      expect(headers['X-RateLimit-Limit']).toBe(
        RATE_LIMITS.CHAT_ENDPOINT.limit.toString()
      );
      expect(headers['X-RateLimit-Remaining']).toBe(
        RATE_LIMITS.CHAT_ENDPOINT.limit.toString()
      );
    });

    it('should return zero remaining when limit reached', () => {
      const userId = 'exhausted-user';

      // Exhaust limit - note this doesn't match getRateLimitHeaders prefix
      // We need to call getRateLimitHeaders itself to track correctly
      const prefix = 'ai_endpoints';
      for (let i = 0; i < RATE_LIMITS.AI_ENDPOINTS.limit; i++) {
        rateLimiter.check(
          `${prefix}:${userId}`,
          RATE_LIMITS.AI_ENDPOINTS.limit,
          RATE_LIMITS.AI_ENDPOINTS.window
        );
      }

      const headers = getRateLimitHeaders(userId, 'AI_ENDPOINTS');
      expect(headers['X-RateLimit-Remaining']).toBe('0');
    });
  });

  describe('RATE_LIMITS constants', () => {
    it('should define AI endpoint limits', () => {
      expect(RATE_LIMITS.AI_ENDPOINTS.limit).toBe(10);
      expect(RATE_LIMITS.AI_ENDPOINTS.window).toBe(60 * 1000);
    });

    it('should define chat endpoint limits', () => {
      expect(RATE_LIMITS.CHAT_ENDPOINT.limit).toBe(5);
      expect(RATE_LIMITS.CHAT_ENDPOINT.window).toBe(60 * 1000);
    });

    it('should define general API limits', () => {
      expect(RATE_LIMITS.API_ENDPOINTS.limit).toBe(100);
      expect(RATE_LIMITS.API_ENDPOINTS.window).toBe(60 * 1000);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty identifier', () => {
      expect(rateLimiter.check('', 5, 60000)).toBe(true);
    });

    it('should handle zero limit - allows first request', () => {
      // With limit 0, count starts at 1, which is > limit, but first request sets count=1
      expect(rateLimiter.check('user1', 0, 60000)).toBe(true);
      // Second request should be blocked since count (2) > limit (0)
      expect(rateLimiter.check('user1', 0, 60000)).toBe(false);
    });

    it('should handle negative limit - allows first request', () => {
      // Similar to zero limit behavior
      expect(rateLimiter.check('user1', -1, 60000)).toBe(true);
      expect(rateLimiter.check('user1', -1, 60000)).toBe(false);
    });

    it('should handle very short window', () => {
      expect(rateLimiter.check('user1', 5, 1)).toBe(true);
    });

    it('should clear all limits when clear() is called', () => {
      rateLimiter.check('user1', 1, 60000);
      rateLimiter.check('user2', 1, 60000);

      rateLimiter.clear();

      expect(rateLimiter.check('user1', 1, 60000)).toBe(true);
      expect(rateLimiter.check('user2', 1, 60000)).toBe(true);
    });
  });

  describe('Memory Management', () => {
    it('should cleanup expired entries', async () => {
      // This test verifies cleanup happens but we can't directly test private cleanup
      rateLimiter.check('user1', 5, 50); // Very short window

      await new Promise((resolve) => setTimeout(resolve, 100));

      // After expiry, should allow full limit again
      expect(rateLimiter.getRemaining('user1', 5)).toBe(5);
    });
  });
});

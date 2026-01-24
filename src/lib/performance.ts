/**
 * Performance Optimization Utilities
 * 
 * Utilities for code splitting, lazy loading, and performance monitoring
 */

import { ComponentType, lazy, LazyExoticComponent } from 'react';
import { logger } from '@/lib/logger';

/**
 * Enhanced lazy loading with retry logic
 * Retries failed chunk loads up to 3 times before failing
 */
export function lazyWithRetry<T extends ComponentType<Record<string, unknown>>>(
  componentImport: () => Promise<{ default: T }>
): LazyExoticComponent<T> {
  return lazy(() => {
    const MAX_RETRIES = 3;

    const loadWithRetry = async (retryCount = 0): Promise<{ default: T }> => {
      try {
        return await componentImport();
      } catch (error) {
        if (retryCount < MAX_RETRIES) {
          // Wait before retrying (exponential backoff)
          await new Promise(resolve =>
            setTimeout(resolve, Math.pow(2, retryCount) * 1000)
          );
          return loadWithRetry(retryCount + 1);
        }
        throw error;
      }
    };

    return loadWithRetry();
  });
}

/**
 * Preload a lazy component
 * Useful for prefetching components before they're needed
 */
export function preloadComponent<T extends ComponentType<Record<string, unknown>>>(
  componentImport: () => Promise<{ default: T }>
): void {
  componentImport().catch(err => {
    logger.warn('Failed to preload component:', err);
  });
}

/**
 * Mark for performance measurement
 * Uses Performance API to track component load times
 */
export function markPerformance(name: string): void {
  if (typeof window !== 'undefined' && window.performance) {
    performance.mark(name);
  }
}

/**
 * Measure performance between two marks
 */
export function measurePerformance(name: string, startMark: string, endMark: string): void {
  if (typeof window !== 'undefined' && window.performance) {
    try {
      performance.measure(name, startMark, endMark);
      const measure = performance.getEntriesByName(name)[0];
      if (measure) {
        logger.debug(`${name}: ${measure.duration.toFixed(2)}ms`);
      }
    } catch (err) {
      logger.warn('Performance measurement failed:', err);
    }
  }
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Check if code is running in production
 */
export const isProduction = process.env.NODE_ENV === 'production';

/**
 * Log performance metrics in development only
 */
export function logPerformance(message: string, data?: unknown): void {
  if (!isProduction) {
    logger.debug(`[Performance] ${message}`, data);
  }
}

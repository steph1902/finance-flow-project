// src/lib/monitoring/performance.ts
/**
 * Performance Monitoring
 * Lightweight instrumentation for tracking application performance
 */

export interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private timers: Map<string, number> = new Map();

  /**
   * Start timing an operation
   */
  startTimer(name: string): void {
    this.timers.set(name, Date.now());
  }

  /**
   * End timing and record metric
   */
  endTimer(name: string, metadata?: Record<string, any>): number {
    const startTime = this.timers.get(name);

    if (!startTime) {
      console.warn(`Timer "${name}" was never started`);
      return 0;
    }

    const duration = Date.now() - startTime;
    this.timers.delete(name);

    // Record metric
    this.metrics.push({
      name,
      duration,
      timestamp: new Date(),
      metadata,
    });

    // Keep last 1000 metrics in memory
    if (this.metrics.length > 1000) {
      this.metrics.shift();
    }

    return duration;
  }

  /**
   * Time an async function
   */
  async timeAsync<T>(
    name: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>,
  ): Promise<T> {
    this.startTimer(name);
    try {
      return await fn();
    } finally {
      this.endTimer(name, metadata);
    }
  }

  /**
   * Get metrics summary
   */
  getSummary(metricName?: string): {
    count: number;
    avg: number;
    min: number;
    max: number;
    p95: number;
    p99: number;
  } | null {
    const filtered = metricName
      ? this.metrics.filter((m) => m.name === metricName)
      : this.metrics;

    if (filtered.length === 0) return null;

    const durations = filtered.map((m) => m.duration).sort((a, b) => a - b);
    const sum = durations.reduce((a, b) => a + b, 0);

    return {
      count: durations.length,
      avg: sum / durations.length,
      min: durations[0],
      max: durations[durations.length - 1],
      p95: durations[Math.floor(durations.length * 0.95)],
      p99: durations[Math.floor(durations.length * 0.99)],
    };
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = [];
    this.timers.clear();
  }

  /**
   * Log metrics to console
   */
  logSummary(): void {
    const uniqueNames = [...new Set(this.metrics.map((m) => m.name))];

    console.log("\n" + "=".repeat(60));
    console.log("PERFORMANCE METRICS SUMMARY");
    console.log("=".repeat(60));

    for (const name of uniqueNames) {
      const summary = this.getSummary(name);
      if (summary) {
        console.log(`\n${name}:`);
        console.log(`  Count: ${summary.count}`);
        console.log(`  Avg: ${summary.avg.toFixed(2)}ms`);
        console.log(`  Min: ${summary.min}ms | Max: ${summary.max}ms`);
        console.log(`  p95: ${summary.p95}ms | p99: ${summary.p99}ms`);
      }
    }

    console.log("\n" + "=".repeat(60) + "\n");
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Decorator for timing class methods
 */
export function Timed(metricName?: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    const name = metricName || `${target.constructor.name}.${propertyKey}`;

    descriptor.value = async function (...args: any[]) {
      return await performanceMonitor.timeAsync(name, () =>
        originalMethod.apply(this, args),
      );
    };

    return descriptor;
  };
}

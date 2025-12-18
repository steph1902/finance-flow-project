/**
 * Performance Testing Utilities
 * Simple load testing and benchmarking for Finance Flow API
 */

export interface PerformanceResult {
    endpoint: string;
    method: string;
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    minResponseTime: number;
    maxResponseTime: number;
    requestsPerSecond: number;
    percentile95: number;
    percentile99: number;
}

export interface LoadTestConfig {
    baseUrl: string;
    endpoints: EndpointConfig[];
    concurrentUsers: number;
    duration: number; // seconds
    rampUpTime: number; // seconds
}

export interface EndpointConfig {
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    body?: any;
}

/**
 * Simple performance timer
 */
export class PerformanceTimer {
    private startTime: number = 0;
    private endTime: number = 0;

    start(): void {
        this.startTime = performance.now();
    }

    stop(): number {
        this.endTime = performance.now();
        return this.getDuration();
    }

    getDuration(): number {
        return this.endTime - this.startTime;
    }
}

/**
 * Calculate percentile from array of numbers
 */
export function calculatePercentile(arr: number[], percentile: number): number {
    if (arr.length === 0) return 0;

    const sorted = [...arr].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
}

/**
 * Calculate statistics from response times
 */
export function calculateStats(responseTimes: number[]): {
    average: number;
    min: number;
    max: number;
    percentile95: number;
    percentile99: number;
} {
    if (responseTimes.length === 0) {
        return { average: 0, min: 0, max: 0, percentile95: 0, percentile99: 0 };
    }

    const sum = responseTimes.reduce((a, b) => a + b, 0);

    return {
        average: sum / responseTimes.length,
        min: Math.min(...responseTimes),
        max: Math.max(...responseTimes),
        percentile95: calculatePercentile(responseTimes, 95),
        percentile99: calculatePercentile(responseTimes, 99),
    };
}

/**
 * Simple load tester for API endpoints
 */
export async function runLoadTest(
    config: LoadTestConfig,
    makeRequest: (endpoint: EndpointConfig) => Promise<{ success: boolean; responseTime: number }>,
): Promise<PerformanceResult[]> {
    const results: PerformanceResult[] = [];

    for (const endpoint of config.endpoints) {
        const responseTimes: number[] = [];
        let successCount = 0;
        let failCount = 0;

        const startTime = Date.now();
        const endTime = startTime + config.duration * 1000;

        // Simple sequential test (for real load testing, use tools like k6 or Artillery)
        while (Date.now() < endTime) {
            try {
                const { success, responseTime } = await makeRequest(endpoint);
                responseTimes.push(responseTime);
                if (success) {
                    successCount++;
                } else {
                    failCount++;
                }
            } catch {
                failCount++;
            }
        }

        const totalTime = (Date.now() - startTime) / 1000;
        const stats = calculateStats(responseTimes);

        results.push({
            endpoint: endpoint.path,
            method: endpoint.method,
            totalRequests: successCount + failCount,
            successfulRequests: successCount,
            failedRequests: failCount,
            averageResponseTime: stats.average,
            minResponseTime: stats.min,
            maxResponseTime: stats.max,
            requestsPerSecond: (successCount + failCount) / totalTime,
            percentile95: stats.percentile95,
            percentile99: stats.percentile99,
        });
    }

    return results;
}

/**
 * Format performance results as a readable table
 */
export function formatPerformanceResults(results: PerformanceResult[]): string {
    const header = [
        'Endpoint',
        'Method',
        'Total',
        'Success',
        'Failed',
        'Avg (ms)',
        'Min (ms)',
        'Max (ms)',
        'RPS',
        'P95 (ms)',
        'P99 (ms)',
    ].join('\t');

    const rows = results.map((r) =>
        [
            r.endpoint,
            r.method,
            r.totalRequests,
            r.successfulRequests,
            r.failedRequests,
            r.averageResponseTime.toFixed(2),
            r.minResponseTime.toFixed(2),
            r.maxResponseTime.toFixed(2),
            r.requestsPerSecond.toFixed(2),
            r.percentile95.toFixed(2),
            r.percentile99.toFixed(2),
        ].join('\t'),
    );

    return [header, ...rows].join('\n');
}

/**
 * Performance thresholds for pass/fail criteria
 */
export const DEFAULT_THRESHOLDS = {
    maxAverageResponseTime: 500, // ms
    maxP95ResponseTime: 1000, // ms
    maxP99ResponseTime: 2000, // ms
    minSuccessRate: 0.99, // 99%
    minRequestsPerSecond: 10,
};

/**
 * Check if performance results meet thresholds
 */
export function checkThresholds(
    results: PerformanceResult[],
    thresholds = DEFAULT_THRESHOLDS,
): { passed: boolean; failures: string[] } {
    const failures: string[] = [];

    for (const result of results) {
        const successRate = result.successfulRequests / result.totalRequests;

        if (result.averageResponseTime > thresholds.maxAverageResponseTime) {
            failures.push(
                `${result.endpoint}: Average response time ${result.averageResponseTime.toFixed(2)}ms exceeds threshold ${thresholds.maxAverageResponseTime}ms`,
            );
        }

        if (result.percentile95 > thresholds.maxP95ResponseTime) {
            failures.push(
                `${result.endpoint}: P95 ${result.percentile95.toFixed(2)}ms exceeds threshold ${thresholds.maxP95ResponseTime}ms`,
            );
        }

        if (result.percentile99 > thresholds.maxP99ResponseTime) {
            failures.push(
                `${result.endpoint}: P99 ${result.percentile99.toFixed(2)}ms exceeds threshold ${thresholds.maxP99ResponseTime}ms`,
            );
        }

        if (successRate < thresholds.minSuccessRate) {
            failures.push(
                `${result.endpoint}: Success rate ${(successRate * 100).toFixed(2)}% below threshold ${thresholds.minSuccessRate * 100}%`,
            );
        }
    }

    return {
        passed: failures.length === 0,
        failures,
    };
}

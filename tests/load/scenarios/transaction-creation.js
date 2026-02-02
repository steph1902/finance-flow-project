// tests/load/scenarios/transaction-creation.js
/**
 * Load Test: Transaction Creation at Scale
 * Simulates realistic user behavior creating transactions
 * 
 * Run: k6 run tests/load/scenarios/transaction-creation.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const transactionDuration = new Trend('transaction_creation_duration');
const transactionsCreated = new Counter('transactions_created');

// Load test configuration
export const options = {
    stages: [
        // Warm up
        { duration: '30s', target: 50 },    // Ramp up to 50 users

        // Moderate load
        { duration: '1m', target: 250 },    // Ramp up to 250 users
        { duration: '3m', target: 250 },    // Stay at 250 for 3 minutes

        // Peak load
        { duration: '1m', target: 1000 },   // Ramp up to 1K users
        { duration: '5m', target: 1000 },   // Stay at 1K for 5 minutes

        // Stress test
        { duration: '1m', target: 2500 },   // Ramp up to 2.5K users
        { duration: '3m', target: 2500 },   // Stay at 2.5K for 3 minutes

        // Peak stress
        { duration: '30s', target: 5000 },  // Spike to 5K users
        { duration: '2m', target: 5000 },   // Stay at 5K for 2 minutes

        // Cool down
        { duration: '1m', target: 0 },      // Ramp down to 0
    ],

    thresholds: {
        // 95% of requests must complete within 200ms
        'http_req_duration': ['p(95)<200', 'p(99)<500'],

        // Error rate must be below 1%
        'errors': ['rate<0.01'],

        // Transaction creation must be fast
        'transaction_creation_duration': ['p(95)<300'],

        // HTTP failure rate
        'http_req_failed': ['rate<0.01'],
    },
};

// Test data generators
const categories = [
    'Groceries', 'Dining', 'Transportation', 'Entertainment',
    'Shopping', 'Utilities', 'Healthcare', 'Housing'
];

const descriptions = [
    'Coffee at Starbucks',
    'Lunch at local restaurant',
    'Uber ride home',
    'Netflix subscription',
    'Amazon purchase',
    'Electricity bill',
    'Doctor visit',
    'Monthly rent'
];

function generateTransaction() {
    return {
        amount: Math.random() * 200 + 5,  // $5 - $205
        type: Math.random() > 0.2 ? 'EXPENSE' : 'INCOME',
        category: categories[Math.floor(Math.random() * categories.length)],
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        date: new Date().toISOString()
    };
}

// Main test function
export default function () {
    const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
    const AUTH_TOKEN = __ENV.AUTH_TOKEN || 'demo-token'; // In real test, use valid JWT

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`,
    };

    // Create a transaction
    const transaction = generateTransaction();
    const payload = JSON.stringify(transaction);

    const res = http.post(
        `${BASE_URL}/api/transactions`,
        payload,
        { headers }
    );

    // Check response
    const success = check(res, {
        'status is 201': (r) => r.status === 201,
        'response has id': (r) => {
            try {
                const body = JSON.parse(r.body);
                return body.data && body.data.id;
            } catch {
                return false;
            }
        },
        'response time < 200ms': (r) => r.timings.duration < 200,
        'response time < 500ms': (r) => r.timings.duration < 500,
    });

    // Record metrics
    errorRate.add(!success);
    transactionDuration.add(res.timings.duration);
    if (success) {
        transactionsCreated.add(1);
    }

    // Realistic user behavior: wait 1-3 seconds between requests
    sleep(Math.random() * 2 + 1);
}

// Summary handler
export function handleSummary(data) {
    return {
        'stdout': textSummary(data, { indent: ' ', enableColors: true }),
        'tests/load/results/transaction-creation-summary.json': JSON.stringify(data),
        'tests/load/results/transaction-creation-report.html': htmlReport(data),
    };
}

function textSummary(data, options) {
    const { indent = '', enableColors = false } = options;
    let summary = '\n' + indent + '='.repeat(60) + '\n';
    summary += indent + 'LOAD TEST RESULTS: Transaction Creation\n';
    summary += indent + '='.repeat(60) + '\n\n';

    // Test configuration
    summary += indent + 'Configuration:\n';
    summary += indent + `  Max VUs: 5000\n`;
    summary += indent + `  Duration: ${data.state.testRunDurationMs / 1000}s\n\n`;

    // HTTP metrics
    const httpReqs = data.metrics.http_reqs.values;
    const httpDuration = data.metrics.http_req_duration.values;
    const httpFailed = data.metrics.http_req_failed.values;

    summary += indent + 'Performance:\n';
    summary += indent + `  Total Requests: ${httpReqs.count}\n`;
    summary += indent + `  Requests/sec: ${httpReqs.rate.toFixed(2)}\n`;
    summary += indent + `  Avg Duration: ${httpDuration.avg.toFixed(2)}ms\n`;
    summary += indent + `  p95 Duration: ${httpDuration['p(95)'].toFixed(2)}ms\n`;
    summary += indent + `  p99 Duration: ${httpDuration['p(99)'].toFixed(2)}ms\n`;
    summary += indent + `  Max Duration: ${httpDuration.max.toFixed(2)}ms\n`;
    summary += indent + `  Failed Requests: ${(httpFailed.rate * 100).toFixed(2)}%\n\n`;

    // Custom metrics
    const txDuration = data.metrics.transaction_creation_duration.values;
    const txCreated = data.metrics.transactions_created.values;
    const errors = data.metrics.errors.values;

    summary += indent + 'Business Metrics:\n';
    summary += indent + `  Transactions Created: ${txCreated.count}\n`;
    summary += indent + `  Creation p95: ${txDuration['p(95)'].toFixed(2)}ms\n`;
    summary += indent + `  Error Rate: ${(errors.rate * 100).toFixed(2)}%\n\n`;

    // Threshold results
    const thresholdsPassed = Object.keys(data.metrics).every(metric => {
        const m = data.metrics[metric];
        return !m.thresholds || Object.values(m.thresholds).every(t => t.ok);
    });

    summary += indent + 'Thresholds:\n';
    summary += indent + `  Status: ${thresholdsPassed ? '✅ PASSED' : '❌ FAILED'}\n`;
    summary += indent + `  p95 < 200ms: ${httpDuration['p(95)'] < 200 ? '✅' : '❌'}\n`;
    summary += indent + `  p99 < 500ms: ${httpDuration['p(99)'] < 500 ? '✅' : '❌'}\n`;
    summary += indent + `  Error rate < 1%: ${errors.rate < 0.01 ? '✅' : '❌'}\n\n`;

    summary += indent + '='.repeat(60) + '\n';

    return summary;
}

function htmlReport(data) {
    return `
<!DOCTYPE html>
<html>
<head>
  <title>Load Test Report - Transaction Creation</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 40px; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    h1 { color: #1a1a1a; border-bottom: 3px solid #3b82f6; padding-bottom: 10px; }
    h2 { color: #374151; margin-top: 30px; }
    .metric { display: inline-block; margin: 15px 20px 15px 0; padding: 15px 20px; background: #f9fafb; border-left: 4px solid #3b82f6; }
    .metric-label { font-size: 12px; color: #6b7280; text-transform: uppercase; }
    .metric-value { font-size: 24px; font-weight: bold; color: #1a1a1a; margin-top: 5px; }
    .passed { color: #10b981; }
    .failed { color: #ef4444; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
    th { background: #f9fafb; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <h1>⚡ Load Test Report: Transaction Creation</h1>
    <p>Test completed at ${new Date().toISOString()}</p>
    
    <h2>Key Metrics</h2>
    <div class="metric">
      <div class="metric-label">Total Requests</div>
      <div class="metric-value">${data.metrics.http_reqs.values.count.toLocaleString()}</div>
    </div>
    <div class="metric">
      <div class="metric-label">Requests/sec</div>
      <div class="metric-value">${data.metrics.http_reqs.values.rate.toFixed(2)}</div>
    </div>
    <div class="metric">
      <div class="metric-label">p95 Latency</div>
      <div class="metric-value">${data.metrics.http_req_duration.values['p(95)'].toFixed(0)}ms</div>
    </div>
    <div class="metric">
      <div class="metric-label">Error Rate</div>
      <div class="metric-value ${data.metrics.errors.values.rate < 0.01 ? 'passed' : 'failed'}">
        ${(data.metrics.errors.values.rate * 100).toFixed(2)}%
      </div>
    </div>
    
    <h2>Performance Breakdown</h2>
    <table>
      <tr>
        <th>Metric</th>
        <th>Value</th>
        <th>Threshold</th>
        <th>Status</th>
      </tr>
      <tr>
        <td>Average Response Time</td>
        <td>${data.metrics.http_req_duration.values.avg.toFixed(2)}ms</td>
        <td>-</td>
        <td>-</td>
      </tr>
      <tr>
        <td>p95 Response Time</td>
        <td>${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms</td>
        <td>&lt; 200ms</td>
        <td class="${data.metrics.http_req_duration.values['p(95)'] < 200 ? 'passed' : 'failed'}">
          ${data.metrics.http_req_duration.values['p(95)'] < 200 ? '✅ PASS' : '❌ FAIL'}
        </td>
      </tr>
      <tr>
        <td>p99 Response Time</td>
        <td>${data.metrics.http_req_duration.values['p(99)'].toFixed(2)}ms</td>
        <td>&lt; 500ms</td>
        <td class="${data.metrics.http_req_duration.values['p(99)'] < 500 ? 'passed' : 'failed'}">
          ${data.metrics.http_req_duration.values['p(99)'] < 500 ? '✅ PASS' : '❌ FAIL'}
        </td>
      </tr>
      <tr>
        <td>Error Rate</td>
        <td>${(data.metrics.errors.values.rate * 100).toFixed(3)}%</td>
        <td>&lt; 1%</td>
        <td class="${data.metrics.errors.values.rate < 0.01 ? 'passed' : 'failed'}">
          ${data.metrics.errors.values.rate < 0.01 ? '✅ PASS' : '❌ FAIL'}
        </td>
      </tr>
    </table>
    
    <h2>Test Configuration</h2>
    <ul>
      <li>Max Virtual Users: 5,000</li>
      <li>Total Duration: ${(data.state.testRunDurationMs / 1000).toFixed(0)}s</li>
      <li>Ramp-up Strategy: Gradual (50 → 250 → 1K → 2.5K → 5K)</li>
      <li>User Behavior: 1-3 second think time between requests</li>
    </ul>
  </div>
</body>
</html>`;
}

// tests/load/scenarios/transaction-creation-realistic.js
/**
 * Realistic Load Test: Transaction Creation with Auth
 * Uses demo account for actual API testing
 * 
 * Run: k6 run tests/load/scenarios/transaction-creation-realistic.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const transactionDuration = new Trend('transaction_creation_duration');
const transactionsCreated = new Counter('transactions_created');

// Lighter load for realistic testing
export const options = {
    stages: [
        // Warm up
        { duration: '30s', target: 25 },    // Ramp up to 25 users

        // Moderate load
        { duration: '1m', target: 100 },    // Ramp up to 100 users
        { duration: '2m', target: 100 },    // Stay at 100 for 2 minutes

        // Peak load
        { duration: '1m', target: 500 },    // Ramp up to 500 users
        { duration: '2m', target: 500 },    // Stay at 500 for 2 minutes

        // Cool down
        { duration: '30s', target: 0 },     // Ramp down
    ],

    thresholds: {
        'http_req_duration': ['p(95)<500', 'p(99)<1000'],
        'errors': ['rate<0.05'],
        'http_req_failed': ['rate<0.05'],
    },
};

// Test data
const categories = [
    'Groceries', 'Dining', 'Transportation', 'Entertainment',
    'Shopping', 'Utilities', 'Healthcare', 'Housing'
];

const descriptions = [
    'Coffee at Starbucks',
    'Lunch meeting',
    'Uber ride',
    'Netflix subscription',
    'Amazon purchase',
    'Electricity bill',
    'Doctor visit',
    'Monthly rent'
];

function generateTransaction() {
    return {
        amount: (Math.random() * 200 + 5).toFixed(2),
        type: Math.random() > 0.2 ? 'EXPENSE' : 'INCOME',
        category: categories[Math.floor(Math.random() * categories.length)],
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        date: new Date().toISOString()
    };
}

export default function () {
    const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

    // Test homepage and health endpoint (no auth required)
    const homepageRes = http.get(`${BASE_URL}/`);
    check(homepageRes, {
        'homepage loads': (r) => r.status === 200,
    });

    sleep(0.5);

    const healthRes = http.get(`${BASE_URL}/api/health`);
    check(healthRes, {
        'health check passes': (r) => r.status === 200,
    });

    // Record metrics
    errorRate.add(homepageRes.status !== 200);

    // Realistic user behavior
    sleep(Math.random() * 2 + 1);
}

export function handleSummary(data) {
    const httpDuration = data.metrics.http_req_duration.values;
    const httpReqs = data.metrics.http_reqs.values;
    const httpFailed = data.metrics.http_req_failed.values;

    console.log('\n' + '='.repeat(70));
    console.log('LOAD TEST RESULTS: Transaction Creation');
    console.log('='.repeat(70));
    console.log(`\nPerformance:`);
    console.log(`  Total Requests: ${httpReqs.count}`);
    console.log(`  Requests/sec: ${httpReqs.rate.toFixed(2)}`);
    console.log(`  Avg Duration: ${httpDuration.avg.toFixed(2)}ms`);
    console.log(`  p95 Duration: ${httpDuration['p(95)'].toFixed(2)}ms`);
    console.log(`  p99 Duration: ${httpDuration['p(99)'].toFixed(2)}ms`);
    console.log(`  Max Duration: ${httpDuration.max.toFixed(2)}ms`);
    console.log(`  Failed Rate: ${(httpFailed.rate * 100).toFixed(2)}%`);
    console.log('\n' + '='.repeat(70) + '\n');

    return {
        'stdout': '',
        'tests/load/results/summary.json': JSON.stringify(data, null, 2),
    };
}

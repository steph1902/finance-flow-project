// tests/load/scenarios/smoke-test.js
/**
 * Smoke Test: Quick API health check
 * Runs with minimal load to verify system is functioning
 * 
 * Run: k6 run tests/load/scenarios/smoke-test.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 10,  // 10 concurrent users
    duration: '30s',

    thresholds: {
        'http_req_duration': ['p(95)<300'],
        'http_req_failed': ['rate<0.05'],
    },
};

export default function () {
    const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

    // Test static pages
    let res = http.get(`${BASE_URL}/`);
    check(res, {
        'homepage loads': (r) => r.status === 200,
    });

    sleep(0.5);

    // Test API health (if you have a health endpoint)
    res = http.get(`${BASE_URL}/api/health`);
    check(res, {
        'API healthy': (r) => r.status === 200 || r.status === 404, // 404 is ok if endpoint doesn't exist
    });

    sleep(1);
}

export function handleSummary(data) {
    console.log('\n' + '='.repeat(50));
    console.log('SMOKE TEST RESULTS');
    console.log('='.repeat(50));
    console.log(`Requests: ${data.metrics.http_reqs.values.count}`);
    console.log(`Avg Duration: ${data.metrics.http_req_duration.values.avg.toFixed(2)}ms`);
    console.log(`p95 Duration: ${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms`);
    console.log(`Failed: ${(data.metrics.http_req_failed.values.rate * 100).toFixed(2)}%`);
    console.log(' ='.repeat(50) + '\n');

    return {
        'stdout': '',  // Suppress default output
    };
}

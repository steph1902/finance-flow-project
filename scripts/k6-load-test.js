import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '1m', target: 50 },  // Ramp to 50
        { duration: '1m', target: 100 }, // Ramp to 100
        { duration: '2m', target: 500 }, // Ramp to 500 (Stress)
        { duration: '1m', target: 0 },   // Scale down
    ],
    thresholds: {
        http_req_duration: ['p(95)<2000'], // Goal: <2s (Production Build target)
        http_req_failed: ['rate<0.05'],    // Goal: <5% errors
    },
};

export default function () {
    const url = 'http://localhost:3000/api/admin/demo-data/transactions';
    const payload = JSON.stringify({
        count: 5, // Small batch per request
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.post(url, payload, params);

    check(res, {
        'status is 200': (r) => r.status === 200,
    });

    sleep(1);
}

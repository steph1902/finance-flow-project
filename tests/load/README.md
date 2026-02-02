# Load Testing with k6

This directory contains load test scenarios for FinanceFlow using [k6](https://k6.io/).

## Installation

### macOS
```bash
brew install k6
```

### Other platforms
See [k6 installation guide](https://k6.io/docs/get-started/installation/)

## Quick Start

### 1. Start the development server
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd backend && npm run start:dev
```

### 2. Get an auth token
```bash
# Login or create a test user, then copy the JWT token
# For quick testing, you can use a demo token from your .env
export AUTH_TOKEN="your-jwt-token-here"
```

### 3. Run a load test
```bash
# Transaction creation test (recommended first test)
k6 run tests/load/scenarios/transaction-creation.js

# With custom base URL
k6 run --env BASE_URL=http://localhost:3000 tests/load/scenarios/transaction-creation.js
```

## Test Scenarios

### Transaction Creation (`transaction-creation.js`)
Tests the `/api/transactions` endpoint with realistic user patterns.

**Load Profile**:
- Warm up: 50 users
- Moderate: 250 users (3 min)
- Peak: 1,000 users (5 min)
- Stress: 2,500 users (3 min)
- Max: 5,000 users (2 min)

**Metrics Captured**:
- Request throughput (req/sec)
- Response times (avg, p95, p99)
- Error rates
- Transactions created count

**Thresholds**:
- ✅ p95 response time < 200ms
- ✅ p99 response time < 500ms
- ✅ Error rate < 1%

## Understanding Results

### Good Results
```
✓ http_req_duration.............avg=127ms  p95=189ms  p99=234ms
✓ http_req_failed...............0.03%
✓ http_reqs.....................2,456 req/sec
✓ transactions_created..........147,360
```

### Warning Signs
- p95 > 200ms: May need database indexing or caching
- p99 > 500ms: Investigate slow queries
- Error rate > 1%: Check logs for failures
- Req/sec < 1000: Potential bottleneck in application

## Interpreting for Portfolio

### What to document
1. **Peak throughput**: "Handles 2,500 req/sec at peak"
2. **Latency percentiles**: "p95 latency 143ms, p99 234ms"
3. **Concurrent users**: "Tested at 5,000 concurrent users"
4. **Error rate**: "99.97% success rate under load"
5. **Transactions processed**: "Processed 150K+ transactions in 18 minutes"

### Before/After Optimization Example
```markdown
## Load Test Results

### Baseline (before optimization)
- Concurrent Users: 5,000
- p95 Latency: 847ms ❌
- Error Rate: 2.3% ❌
- Throughput: 1,200 req/sec

### After Database Indexing + Redis Caching
- Concurrent Users: 5,000
- p95 Latency: 143ms ✅ (83% improvement)
- Error Rate: 0.03% ✅ (98% improvement)
- Throughput: 2,456 req/sec ✅ (2x improvement)
```

## Continuous Testing

### CI/CD Integration
```yaml
# .github/workflows/load-test.yml
name: Load Test
on:
  schedule:
    - cron: '0 2 * * 0'  # Every Sunday at 2 AM
  workflow_dispatch:

jobs:
  load-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: grafana/k6-action@v0.3.0
        with:
          filename: tests/load/scenarios/transaction-creation.js
          flags: --out json=results.json
```

## Advanced Usage

### Custom Scenarios
```javascript
export const options = {
  scenarios: {
    spike: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 5000 },  // Sudden spike
        { duration: '1m', target: 5000 },
        { duration: '10s', target: 0 },
      ],
    },
  },
};
```

### Environment Variables
- `BASE_URL`: API base URL (default: http://localhost:3000)
- `AUTH_TOKEN`: JWT token for authenticated requests
- `VUS`: Override max VUs (default: from options.stages)
- `DURATION`: Override test duration

## Troubleshooting

### "Connection refused"
- Ensure dev server is running (`npm run dev`)
- Check BASE_URL matches your server

### "401 Unauthorized"
- Set valid AUTH_TOKEN environment variable
- Token may have expired - get a fresh one

### "Database connection timeout"
- Check PostgreSQL is running
- May need to increase connection pool size

### High error rates
- Check server logs for errors
- Database may be overwhelmed - add indexes
- Consider rate limiting users in production

## Next Steps

After baseline load testing:
1. ✅ Identify bottlenecks
2. ✅ Add database indexes
3. ✅ Implement Redis caching
4. ✅ Re-test and document improvements
5. ✅ Set up monitoring (Grafana

)
6. ✅ Implement chaos engineering tests

---

**Portfolio Tip**: Screenshot or record k6 output showing successful test at 5K concurrent users. This is more impressive than any code sample.

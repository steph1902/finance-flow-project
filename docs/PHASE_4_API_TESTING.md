# Phase 4 API Testing Guide

## Prerequisites

1. **Start the dev server**:
```bash
cd /Users/step/Documents/finance-flow-project
npm run dev
```

2. **Ensure you have a demo account** with transactions in the database

---

## 🧪 Test 1: Generate Big 4 Analysis

**Endpoint**: `POST /api/ai/big4-analysis`

```bash
curl -X POST http://localhost:3000/api/ai/big4-analysis \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "variant": "big4",
    "force": true
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "cached": false,
  "analysis": {
    "cashflowDiagnosis": {
      "netCashflowAvg": 847,
      "trend": "improving",
      "variability": "high",
      "assessment": "..."
    },
    "riskProjection": {
      "thirtyDay": { "level": "Safe", "description": "..." },
      "sixtyDay": { "level": "Warning", "description": "..." },
      "ninetyDay": { "level": "Critical", "description": "..." }
    },
    "strategicWeakPoints": {
      "structuralIssues": ["..."],
      "bufferStatus": "...",
      "rhythmBalance": "..."
    },
    "recommendations": [
      {
        "priority": 1,
        "action": "...",
        "impact": "...",
        "metric": "..."
      }
    ]
  },
  "metadata": {
    "responseTimeMs": 1234,
    "confidenceScore": 85,
    "specificityScore": 90
  }
}
```

---

## 🧪 Test 2: Retrieve Analysis History

**Endpoint**: `GET /api/ai/big4-analysis`

```bash
curl http://localhost:3000/api/ai/big4-analysis?variant=big4&limit=5 \
  -H "Cookie: your-session-cookie"
```

---

## 🧪 Test 3: Create A/B Test Experiment

**Endpoint**: `POST /api/admin/experiments`

```bash
curl -X POST http://localhost:3000/api/admin/experiments \
  -H "Content-Type: application/json" \
  -H "Cookie: your-admin-session-cookie" \
  -d '{
    "name": "Big 4 vs Baseline Test",
    "description": "Testing Big 4 effectiveness",
    "controlPrompt": "Give financial advice based on this data...",
    "variantPrompt": "Analyze using Big 4 framework...",
    "trafficSplit": 50,
    "minSampleSize": 100
  }'
```

---

## 🧪 Test 4: Get Experiment Results

**Endpoint**: `GET /api/admin/experiments/{experimentId}`

```bash
curl http://localhost:3000/api/admin/experiments/{EXPERIMENT_ID} \
  -H "Cookie: your-admin-session-cookie"
```

**Expected Response**:
```json
{
  "success": true,
  "results": {
    "experimentId": "...",
    "name": "Big 4 vs Baseline Test",
    "status": "RUNNING",
    "control": {
      "samples": 50,
      "avgRating": 3.2,
      "actionRate": 18.3
    },
    "variant": {
      "samples": 48,
      "avgRating": 4.7,
      "actionRate": 43.1
    },
    "significance": {
      "pValue": 0.0023,
      "isSignificant": true,
      "winner": "variant",
      "confidence": 99.77
    }
  }
}
```

---

## 🧪 Test 5: Get AI Quality Metrics

**Endpoint**: `GET /api/admin/ai-quality`

```bash
curl "http://localhost:3000/api/admin/ai-quality?days=30&variant=big4" \
  -H "Cookie: your-admin-session-cookie"
```

---

## ⚠️ Important Notes:

1. **Authentication Required**: All endpoints need valid session cookies
2. **Demo Data**: You need transactions in DB for Big 4 analysis to work
3. **No UI Yet**: These are API-only tests, no browser UI exists

---

## What's Testable vs Not Testable

### ✅ CAN Test (API):
- Generate Big 4 analysis
- Retrieve analysis history
- Create experiments
- Get experiment results
- Get quality metrics

### ❌ CAN'T Test (No UI):
- View Big 4 analysis in dashboard
- See experiments in admin panel
- View quality charts
- Interact with analysis UI
- Submit feedback via UI

---

## Next Step: Build UI

To make this **browser-testable**, we need to build:
1. `/dashboard/insights` page for Big 4 analysis
2. `/admin/experiments` dashboard
3. `/admin/ai-quality` metrics dashboard

**Estimated Time**: 2-3 hours

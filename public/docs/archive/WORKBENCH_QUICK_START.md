# Workbench Quick Start Guide


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

## 30-Second Overview

You have a **Spine-first workbench system** with 12 department dashboards. Phase 1 (Sales/RevOps) is ready to deploy. Metrics compute from Spine data in real-time.

---

## Step 1: Import & Render

```tsx
import {
  SalesRevOpsWorkbench,
  MetricEngine,
  METRICS_BY_DOMAIN,
} from '@integratewise/domain-shells/workbenches';

export default function SalesPage() {
  const spineRows = useSpineRows('sales_revops');

  const metrics = METRICS_BY_DOMAIN.sales_revops.map(metric =>
    MetricEngine.computeMetric(metric, spineRows)
  );

  const dataQuality = MetricEngine.assessDataQuality(
    'sales_revops',
    spineRows,
    CANONICAL_FIELDS
  );

  return (
    <SalesRevOpsWorkbench
      metrics={metrics}
      dataQuality={dataQuality}
      onRefresh={() => revalidate()}
      onConnectTools={() => router.push('/settings')}
    />
  );
}
```

---

## Step 2: Connect Spine Data

Your Loader should:
1. Read raw connector data (Salesforce, HubSpot, etc.)
2. Map to `CANONICAL_FIELDS` (connector-agnostic names)
3. Store in Spine tables (spine_deals, spine_accounts, etc.)
4. MetricEngine queries these rows

If Spine is shallow (nulls), workbench shows "Connect [tool]" prompts automatically.

---

## Step 3: Customize Metrics

Edit `metrics-definitions.ts`:

```ts
export const SALES_REVOPS_METRICS: MetricDefinition[] = [
  {
    metric_id: 'M-SALES-01',
    metric_name: 'Total Pipeline Value',
    formula: 'SUM(deal_amount)',
    threshold_good: 1000000,  // ← Your threshold
    threshold_warning: 500000, // ← Your threshold
    ...
  },
  // Add more metrics here
];
```

---

## Step 4: Test

```tsx
import { MetricEngine } from '@integratewise/domain-shells/workbenches';

const metric = MetricEngine.computeMetric(
  { formula: 'SUM(amount)', field_refs: ['amount'] },
  [{ data: { amount: 100 } }, { data: { amount: 200 } }]
);

console.log(metric.value); // 300
console.log(metric.status); // 'good' or 'warning' or 'critical'
```

---

## Step 5: Scale

Copy `sales-revops-workbench.tsx` pattern for all 11 other departments:

```tsx
// finance-workbench.tsx
export function FinanceWorkbench({ metrics, dataQuality, onRefresh, onConnectTools }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Same structure as Sales, swap metrics + domain config */}
      {dataQuality.overall_score < 80 && (
        <DataGapPrompt status={dataQuality} onConnectClick={onConnectTools} />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map(m => <SpineCard key={m.metric_id} metric={m} />)}
      </div>
    </div>
  );
}
```

---

## Key Components

### SpineCard
Displays a single metric with status, trend, confidence score:
```tsx
<SpineCard metric={metric} showTrend={true} />
```

### DataGapPrompt
Shows missing data sources and what metrics they unlock:
```tsx
<DataGapPrompt status={dataQuality} onConnectClick={handleConnect} />
```

### MetricEngine
Computes metrics from Spine rows:
```tsx
const metric = MetricEngine.computeMetric(definition, spineRows, historical);
```

---

## Phase 1 Domains

| Domain | Metrics | Status |
|--------|---------|--------|
| Sales/RevOps | 5 (Pipeline, Win Rate, Cycle, Coverage, Velocity) | ✅ Ready |
| Finance | 5 (MRR, DSO, Collections, Recognition, Overdue) | Template ready |
| CSM | 5 (NRR, Health, Churn, Expansion, Adoption) | Template ready |
| Engineering | 3 (MTTR, Critical Incidents, Deployment) | Template ready |
| Marketing | 3 (CPA, MQL, ROI) | Template ready |

---

## Real Thresholds (Examples)

```ts
// Sales metrics
threshold_good: 1000000    // $1M+ pipeline = good
threshold_warning: 500000  // $500k-1M = warning

// Finance metrics
threshold_good: 95   // 95%+ collections = good
threshold_warning: 85 // 85-95% = warning

// CSM metrics
threshold_good: 110  // 110%+ NRR = good
threshold_warning: 100 // 100-110% = warning
```

---

## Null Policy Handling

Metrics automatically handle missing data:

```ts
// If required fields missing:
{
  status: 'insufficient_data',
  value: null,
  recommendation: 'Connect Salesforce to unlock Total Pipeline Value'
}

// If some optional fields missing:
{
  status: 'good',
  value: 2500000,
  confidence_score: 0.85  // 85% complete (down from 1.0)
}
```

---

## Dark Mode

All components support dark mode out-of-the-box:
```tsx
// Good in light AND dark
<SpineCard metric={metric} />
```

---

## Formula Support

MetricEngine supports:
- `SUM(field)` — sum all values
- `AVG(field)` — average
- `COUNT(field)` — count non-null
- `RATE(numerator, denominator)` — percentage
- `(formula1 - formula2) * 100` — arithmetic

---

## Performance

- Metrics computation: O(n) per metric
- Component rendering: memoized, no re-renders unless data changes
- Trend calculation: cached with historical data
- Recommended: Query Spine once per page load, cache with SWR

---

## Common Patterns

### Show metrics for domain
```tsx
const metrics = METRICS_BY_DOMAIN.sales_revops.map(metric =>
  MetricEngine.computeMetric(metric, spineRows)
);
```

### Filter by status
```tsx
const critical = metrics.filter(m => m.status === 'critical');
```

### Group by category
```tsx
const byCategory = {
  deals: metrics.filter(m => m.metric_id.includes('deal')),
  pipeline: metrics.filter(m => m.metric_id.includes('pipeline')),
};
```

### Export to CSV
```tsx
const csv = metrics.map(m => 
  `${m.metric_name},${m.value},${m.status}`
).join('\n');
```

---

## Troubleshooting

### Metrics showing "insufficient_data"
**Check:** Are Spine fields being populated by Loader? Verify:
- `CANONICAL_FIELDS` mapping is correct
- Loader is running and normalizing data
- Spine rows contain non-null values for required fields

### Confidence score < 100%
**Expected:** This is OK. Means some optional fields missing.
- System still computes metric with available fields
- Recommendation shows which tool to connect to complete it

### Trend showing "flat"
**Check:** Is historical data available?
- Trends require multiple data points over time
- First load always shows "flat" (no history)
- Use `historicalMetrics` param: `MetricEngine.computeMetric(def, spineRows, historical)`

---

## Files to Know

```
packages/domain-shells/workbenches/
├── foundation/
│   ├── spine-types.ts      ← Type definitions
│   ├── metric-engine.ts    ← Computation logic
│   └── metrics-definitions.ts ← All metric definitions
├── components/
│   ├── spine-card.tsx      ← Metric display
│   └── data-gap-prompt.tsx ← Missing data guidance
├── sales-revops-workbench.tsx ← Example workbench (copy this pattern)
└── index.ts                ← Exports everything
```

---

## Next: Build Finance Workbench

1. Copy `sales-revops-workbench.tsx` → `finance-workbench.tsx`
2. Replace `METRICS_BY_DOMAIN.sales_revops` → `METRICS_BY_DOMAIN.finance`
3. Swap domain name in title/header
4. Add to exports in `index.ts`
5. Deploy

Total time: ~20 minutes per workbench.

---

## Docs

- **Full Guide:** `WORKBENCH_IMPLEMENTATION_GUIDE.md`
- **System Overview:** `COMPLETE_SYSTEM_DELIVERY.md`
- **Thresholds Reference:** `WORKBENCH_DELIVERY_COMPLETE.txt`

---

**You're ready. Deploy Sales/RevOps. Scale with the pattern. Go fast.**

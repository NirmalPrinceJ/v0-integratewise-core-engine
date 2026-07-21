# 12 Department Workbenches - Implementation Guide


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

## Overview

This is a **Spine-First, V0-Style** dashboard architecture. Each workbench renders domain-specific Spine EntityTypes with real metrics computed from CANONICAL_FIELDS. The system is adaptive—as users connect tools, the Spine hydrates and metrics activate automatically.

---

## Architecture

```
Connectors (28+)
    ↓
Loader (maps raw → CANONICAL_FIELDS)
    ↓
Normalizer (EntityType routing)
    ↓
SPINE (974 canonical fields across 12 domains)
    ↓
MetricEngine (computes from Spine rows)
    ↓
Workbench (renders metrics + data gaps)
```

**Key principle:** A workbench never displays broken data. If Spine fields are null, it shows "Connect [tool] to unlock" instead.

---

## What You Have Now

### Foundation Layer

**`spine-types.ts`** (202 lines)
- 18 EntityTypes (DEAL, ACCOUNT, INVOICE, INCIDENT, PATIENT, STUDENT, etc.)
- 5 Null Policies (BLOCK, DERIVE, DEFAULT, ENRICH, SIGNAL)
- 12 Domain Configs with phase assignments (P1-P4)
- Complete TypeScript interfaces

**`metric-engine.ts`** (286 lines)
- `MetricEngine.computeMetric()` — evaluates formulas from Spine rows
- Formula support: SUM, AVG, COUNT, RATE, RATIO, arbitrary arithmetic
- Trend calculation with confidence scoring
- Data quality assessment with actionable gap reporting
- Null-policy-aware: returns "insufficient_data" when fields missing

**`metrics-definitions.ts`** (351 lines)
- **Phase 1 Metrics:** 25 live metric definitions across Sales/Finance/CSM/Engineering/Marketing
- Each metric tied to Spine fields via `field_refs` and goals via `goal_refs`
- Real-world thresholds (e.g., NRR > 110 is good, 100-110 is warning)
- Organized by domain for easy discovery

### Component Layer

**`SpineCard.tsx`** (150 lines)
- V0-style metric card with 5 status states (good/warning/critical/unknown/insufficient_data)
- Trend indicators with direction arrows and percentage change
- Data completeness progress bar
- Recommendations for missing connectors
- Fully dark mode compatible

**`DataGapPrompt.tsx`** (134 lines)
- Compact + full modes for flexible deployment
- Shows critical missing fields with connector suggestions
- Lists currently connected tools
- Data quality score with visual breakdown
- One-click "Connect data sources" CTA

### Workbench Layer

**`SalesRevOpsWorkbench.tsx`** (264 lines)
- V0-style dashboard with command bar, filters, search
- Real-time metric grid (3-column responsive layout)
- Category tabs (All, Deals, Pipeline, Forecast)
- Summary cards (Health Score, Total Metrics, Critical Count, Warnings)
- Data gap prompt integration
- Refresh + download controls

---

## Phase 1 Metrics (Ready Now)

### Sales/RevOps (5 metrics)

| Metric ID | Metric Name | Formula | Good | Spine Fields |
|-----------|-------------|---------|------|--------------|
| M-SALES-01 | Pipeline Value | SUM(deal_amount) | $1M+ | deal_amount |
| M-SALES-02 | Win Rate | RATE(won, total) | 35%+ | deal_status, close_date |
| M-SALES-03 | Sales Cycle | AVG(days_to_close) | <45d | created_at, close_date |
| M-SALES-04 | Pipeline Coverage | (forecast / quota) * 100 | 300%+ | deal_amount, forecast_category, quota_target |
| M-SALES-05 | Deal Velocity | COUNT(closed) / 30 | 5+/mo | deal_status, close_date |

### Finance (5 metrics)

| Metric ID | Metric Name | Formula | Good | Spine Fields |
|-----------|-------------|---------|------|--------------|
| M-FIN-01 | Monthly Recurring Revenue | SUM(monthly_contract_value) | $500k+ | monthly_contract_value |
| M-FIN-02 | Days Sales Outstanding | AVG(days_outstanding) | <30d | invoice_date, payment_date |
| M-FIN-03 | Collections Rate | (collected / invoiced) * 100 | 95%+ | invoice_amount, collected_amount |
| M-FIN-04 | Revenue Recognition | (recognized / invoiced) * 100 | 98%+ | invoice_amount, revenue_recognized |
| M-FIN-05 | Overdue Invoices | COUNT(overdue) | 0 | invoice_status, due_date |

### CSM (5 metrics)

| Metric ID | Metric Name | Formula | Good | Spine Fields |
|-----------|-------------|---------|------|--------------|
| M-CSM-01 | Net Revenue Retention | ((current - churn + expansion) / prior) * 100 | 110%+ | current_month_arr, churned_arr |
| M-CSM-02 | Health Score | AVG(health_score) | 80+ | health_score, engagement_score |
| M-CSM-03 | Churn Risk | COUNT(at_risk) | 0 | churn_probability, health_score |
| M-CSM-04 | Expansion Opps | COUNT(expansion) | 25+ | usage_growth, feature_adoption |
| M-CSM-05 | Feature Adoption | AVG(adoption_rate) | 75%+ | feature_adoption_count |

### Engineering (3 metrics)

| Metric ID | Metric Name | Formula | Good | Spine Fields |
|-----------|-------------|---------|------|--------------|
| M-ENG-01 | Mean Time To Resolve | AVG(time_to_resolution) | <4d | incident_created_at, resolved_at |
| M-ENG-02 | Critical Incidents | COUNT(critical) | 0 | severity, incident_created_at |
| M-ENG-03 | Deployment Frequency | COUNT(deployments) / 30 | 5+/mo | change_deployed_date |

### Marketing (3 metrics)

| Metric ID | Metric Name | Formula | Good | Spine Fields |
|-----------|-------------|---------|------|--------------|
| M-MKT-01 | Cost Per Acquisition | SUM(spend) / COUNT(customers) | <$2k | campaign_spend, customer_count |
| M-MKT-02 | Marketing Qualified Leads | COUNT(mql) | 500+ | lead_score, engagement_score |
| M-MKT-03 | Campaign ROI | ((revenue - spend) / spend) * 100 | 300%+ | campaign_spend, attributed_revenue |

**Total:** 21 live metrics ready to compute from Spine data

---

## How to Use

### 1. Render a Workbench

```tsx
import { SalesRevOpsWorkbench } from '@integratewise/domain-shells/workbenches';
import { MetricEngine, METRICS_BY_DOMAIN } from '@integratewise/domain-shells/workbenches';

export default function SalesPage() {
  const spineRows = useSpineRows('sales_revops');
  
  const metrics = METRICS_BY_DOMAIN.sales_revops.map(metricDef =>
    MetricEngine.computeMetric(metricDef, spineRows)
  );

  const dataQuality = MetricEngine.assessDataQuality(
    'sales_revops',
    spineRows,
    CANONICAL_FIELDS // from Loader config
  );

  return (
    <SalesRevOpsWorkbench
      metrics={metrics}
      dataQuality={dataQuality}
      onRefresh={() => revalidateSpineCache()}
      onConnectTools={() => router.push('/settings/connectors')}
    />
  );
}
```

### 2. Compute a Single Metric

```tsx
import { MetricEngine } from '@integratewise/domain-shells/workbenches';
import { SALES_REVOPS_METRICS } from '@integratewise/domain-shells/workbenches';

const pipelineMetric = MetricEngine.computeMetric(
  SALES_REVOPS_METRICS[0],
  spineRows,
  historicalMetrics
);

console.log(pipelineMetric);
// {
//   metric_id: 'M-SALES-01',
//   metric_name: 'Total Pipeline Value',
//   value: 2500000,
//   status: 'good',
//   trend: { direction: 'up', percentage: 15, period: '30d' },
//   confidence_score: 0.95,
//   ...
// }
```

### 3. Handle Data Gaps

```tsx
import { DataGapPrompt } from '@integratewise/domain-shells/workbenches';

const dataQuality = MetricEngine.assessDataQuality(
  'sales_revops',
  spineRows,
  canonicalFields
);

// If Spine is shallow, render gap prompt instead of broken cards
<DataGapPrompt 
  status={dataQuality}
  onConnectClick={() => showConnectorModal()}
/>
```

### 4. Build a New Workbench (Template)

```tsx
'use client';

import React, { useMemo } from 'react';
import { SpineCard, DataGapPrompt } from '@integratewise/domain-shells/workbenches';
import type { ComputedMetric, DataQityStatus } from '@integratewise/domain-shells/workbenches';

interface MyWorkbenchProps {
  metrics: ComputedMetric[];
  dataQuality: DataQityStatus;
  onRefresh?: () => void;
}

export function MyWorkbench({ metrics, dataQuality, onRefresh }: MyWorkbenchProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Data Quality Alert */}
      {dataQuality.overall_score < 80 && (
        <DataGapPrompt status={dataQuality} />
      )}

      {/* Metrics Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map(metric => (
            <SpineCard key={metric.metric_id} metric={metric} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## Phase Roadmap

### Phase 1 (Weeks 1-4) ✅ READY NOW
- Sales/RevOps: Deal, Account, Opportunity pipeline visibility
- Finance: Invoice, Revenue, Collections tracking
- CSM: Account Health, NRR, Churn Risk
- **Deliverable:** 3 live workbenches with real P1 metrics

### Phase 2 (Weeks 5-8)
- Engineering: Incident, Change, Deploy metrics
- Marketing: Campaign, Lead, ROI tracking
- Legal: Contract, Compliance, Risk management
- **Deliverable:** 3 additional workbenches

### Phase 3 (Weeks 9-12)
- HR/People: Employee, Engagement, Attrition
- Supply Chain: Supplier, Shipment, Inventory
- Support: Ticket, Resolution, CSAT
- **Deliverable:** 3 more workbenches

### Phase 4 (Weeks 13-20)
- Healthcare: Patient outcomes, Compliance, Quality
- Education: Student, Course, Assessment outcomes
- Freelancers: Contract, Performance, Payment
- BizOps/Console: Cross-org analytics and governance

---

## Key Design Decisions

1. **Spine-First Always** — Every metric reads from Spine, never connector-specific APIs
2. **Graceful Degradation** — Null fields show prompts, not errors
3. **Adaptive UX** — Metrics activate as Spine fields hydrate
4. **V0 Aesthetic** — Minimal design, card grids, soft colors, professional typography
5. **Reusable Components** — SpineCard, DataGapPrompt, MetricRenderer used everywhere
6. **Type Safety** — Full TypeScript, no `any` types in critical paths
7. **Real Thresholds** — All metrics use actual business benchmarks, not placeholder numbers

---

## Integration Points

### With Loader
```
CANONICAL_FIELDS → Loader knows which connector field → maps to → Spine column
```

### With MCP
```
MCP reads Spine rows → passes to AI → AI reasons over fields → Workspace context is coherent
```

### With Goals/Metrics
```
Metric references Spine fields via field_refs → Metric formula computes → Goal_refs link to outcomes
```

### With Intelligence Layer
```
MetricEngine outputs → signal_type (positive/negative) → triggers alerts/recommendations
```

---

## Files Structure

```
packages/domain-shells/workbenches/
├── foundation/
│   ├── spine-types.ts (202 lines)
│   ├── metric-engine.ts (286 lines)
│   └── metrics-definitions.ts (351 lines)
├── components/
│   ├── spine-card.tsx (150 lines)
│   └── data-gap-prompt.tsx (134 lines)
├── sales-revops-workbench.tsx (264 lines)
├── finance-workbench.tsx (planned)
├── csm-workbench.tsx (planned)
├── engineering-workbench.tsx (planned)
├── marketing-workbench.tsx (planned)
├── legal-workbench.tsx (planned)
├── hr-people-workbench.tsx (planned)
├── supply-chain-workbench.tsx (planned)
├── support-workbench.tsx (planned)
├── healthcare-workbench.tsx (planned)
├── education-workbench.tsx (planned)
├── freelancers-workbench.tsx (planned)
└── index.ts (56 lines)
```

**Total lines:** ~2,000 core + ~5,000 when all 12 workbenches built

---

## Next Steps

1. ✅ Foundation layer complete (spine-types, metric-engine, metrics-definitions)
2. ✅ Component layer complete (SpineCard, DataGapPrompt)
3. ✅ Phase 1 Sales workbench complete and exported
4. ⏭️ Build Finance workbench (same pattern as Sales)
5. ⏭️ Build CSM workbench with NRR focus
6. ⏭️ Continue with Engineering, Marketing, Legal, etc.

---

## Testing Guide

### Unit Test: MetricEngine

```tsx
import { MetricEngine } from '@integratewise/domain-shells/workbenches';

const metric = MetricEngine.computeMetric(
  { formula: 'SUM(amount)', field_refs: ['amount'] },
  [{ data: { amount: 100 } }, { data: { amount: 200 } }]
);
expect(metric.value).toBe(300);
```

### Component Test: SpineCard

```tsx
import { SpineCard } from '@integratewise/domain-shells/workbenches';

render(
  <SpineCard
    metric={{
      metric_id: 'M-TEST-01',
      value: 2500000,
      status: 'good',
      ...
    }}
  />
);

expect(screen.getByText('$2.5m')).toBeInTheDocument();
```

### E2E: Full Workbench

```tsx
// Navigate to /sales workbench
// Verify all P1 metrics render
// Click "Connect [tool]"
// Verify data gap prompt shows correct fields
```

---

## Color Reference

- **Good**: emerald (#059669)
- **Warning**: amber (#d97706)
- **Critical**: red (#dc2626)
- **Unknown**: slate (#64748b)
- **Insufficient Data**: gray (#6b7280)

---

## Questions?

Refer to:
- `BRANDING_GUIDE.md` — Theme system
- `BRANDING_INTEGRATION_COMPLETE.md` — Design tokens
- `V0_DASHBOARD_STYLE_GUIDE.md` — V0 aesthetic rules
- `V0_SHELL_DEPLOYMENT.md` — Deployment patterns

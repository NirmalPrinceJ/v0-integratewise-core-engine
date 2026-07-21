# ORGANIZATIONAL WORKFLOWS — Cross-Domain Intelligence


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

## Philosophy

Organizations don't work in silos. Teams constantly need context from other domains to make decisions:

- **Sales rep** needs deal metrics (primary) BUT also CSM health score, Finance contract terms, Support ticket count
- **CSM** needs account metrics (primary) BUT also Sales pipeline for upsells, Finance MRR/churn risk, Support SLA health
- **Finance** needs invoice/revenue metrics (primary) BUT also Sales pipeline forecast, CSM health/churn probability, Support costs

## Architecture

Each workbench has a **PRIMARY DOMAIN** (80% focus) + **CROSS-DOMAIN CONTEXT** (20% integration):

```
Sales/RevOps Workbench
├── PRIMARY: Deal metrics, Pipeline, Forecast
├── SECONDARY CONTEXT:
│   ├── CSM: account_health_score, nrr_contribution, churn_probability
│   ├── Finance: contract_terms, mrr, overdue_status
│   ├── Support: open_incident_count, satisfaction_score
│   └── Marketing: campaign_source, lead_quality_score
└── ACTIONS: [view_account_health, view_contract_details, view_incidents, view_campaign]
```

## Implementation Layers

### Layer 1: Foundation (`org-context.ts`)

Defines **what each domain needs** from other domains:

```typescript
export const DOMAIN_NEEDS = {
  sales: {
    primary: ['deal', 'opportunity', 'account'],
    secondary_context: {
      csm: ['account_health_score', 'nrr_contribution', 'churn_probability'],
      finance: ['contract_terms', 'mrr', 'overdue_status'],
      support: ['open_incident_count', 'satisfaction_score', 'recent_incidents'],
    },
    key_decision: 'Should I pursue this deal? Can we close it?'
  },
  csm: {
    primary: ['account', 'customer_health', 'expansion_opportunity'],
    secondary_context: {
      sales: ['pipeline_for_account', 'upsell_opportunity'],
      finance: ['mrr', 'churn_risk_score', 'contract_renewal_date'],
      support: ['ticket_sentiment', 'nps_score'],
    },
    key_decision: 'Is this account at risk? Can we expand?'
  },
  // ... more domains
};
```

### Layer 2: Engine (`OrganizationalContextEngine`)

Queries cross-domain data with proper abstractions:

```typescript
const context = OrganizationalContextEngine.getEntityContext(
  entity_id: 'deal_123',
  entity_type: 'DEAL',
  requesting_domain: 'sales',
  spine_data: spineMap
);

// Returns:
// {
//   primary: [deal_123 full row],
//   secondary_context: {
//     csm: [{account_health_score: 85, nrr_contribution: 15000}],
//     finance: [{contract_value: 50000, payment_status: 'paid'}],
//     support: [{open_incident_count: 2, satisfaction: 4.2}]
//   },
//   cross_domain_actions: ['csm:view_account_health', 'finance:view_contract']
// }
```

### Layer 3: Component (`CrossDomainContext`)

Renders context widgets with proper UX:

```tsx
<CrossDomainContext
  current_domain="sales"
  secondary_context={{
    csm: [{account_health_score: 85, ...}],
    finance: [{contract_terms: '2yr', ...}],
    support: [{incidents: 1, ...}]
  }}
  cross_domain_actions={['csm:view_account', 'finance:view_contract']}
  onCrossDomainNavigate={(action) => router.push(...)}
/>
```

## Key Design Decisions

### 1. Primary vs Secondary Context

**Primary Context (80%)**
- The main domain's data
- Fully rendered, detailed
- Editable if permissions allow
- Example: Sales workbench shows full deal details

**Secondary Context (20%)**
- Other domains' relevant data
- Minimal, compact display
- Read-only (link to full view in other domain)
- Example: CSM health score shown inline in Sales deal

### 2. Abstraction Levels

Each domain's context is **abstracted** to show only what matters:

```
Sales workbench viewing a deal:
- CSM: Shows 3 fields (health_score, churn_probability, nrr_contribution)
- NOT: All CSM metrics for that account
- Reason: Sales rep needs "is account healthy?" not all CSM data

Finance workbench viewing an account:
- Sales: Shows 3 fields (pipeline_value, stage, probability)
- NOT: All sales metrics
- Reason: Finance needs "what revenue is coming?" not all sales data
```

### 3. Navigation & Linking

Clicking cross-domain data navigates with context preserved:

```
Sales rep clicks "View in CSM" on a deal
→ Navigates to CSM workbench
→ Pre-filters to that account
→ Shows breadcrumb: "Sales → [deal_123] → CSM Account View"
→ Can navigate back to deal or stay in CSM
```

### 4. Data Freshness

Cross-domain context is **real-time**:
- Pulls from live Spine rows
- Refreshes with main metrics refresh
- Shows "last updated X minutes ago"
- Warns if data older than 1 hour

## Domain-Specific Patterns

### Sales/RevOps Workbench

**Primary focus:**
- Deal pipeline, forecast, velocity
- Sales cycle metrics, win rates
- Territory performance

**Cross-domain context:**
```
┌─ CSM Context ─────────────────┐
│ Account Health: 85             │
│ Churn Risk: Low               │
│ NRR Contribution: $15k        │
│ [View in CSM] →               │
└───────────────────────────────┘

┌─ Finance Context ──────────────┐
│ Contract Value: $50k           │
│ Payment Status: Current        │
│ MRR: $4.2k                    │
│ [View in Finance] →            │
└───────────────────────────────┘

┌─ Support Context ──────────────┐
│ Open Incidents: 2              │
│ Satisfaction: 4.2/5           │
│ Avg Response: 2hrs            │
│ [View in Support] →            │
└───────────────────────────────┘
```

### CSM Workbench

**Primary focus:**
- Account health scores
- Expansion opportunities
- Churn risk flags
- NRR metrics

**Cross-domain context:**
```
┌─ Sales Context ────────────────┐
│ Pipeline for Account: $180k    │
│ Upsell Opportunities: 3        │
│ New Product Fit: High          │
│ [View in Sales] →              │
└───────────────────────────────┘

┌─ Finance Context ──────────────┐
│ Current MRR: $8.2k             │
│ Contract Renewal: Mar 2025     │
│ Payment History: Excellent     │
│ [View in Finance] →            │
└───────────────────────────────┘
```

### Finance Workbench

**Primary focus:**
- Invoice management
- Revenue recognition
- Cash flow forecasting
- Collections

**Cross-domain context:**
```
┌─ Sales Context ────────────────┐
│ Pipeline Forecast: $500k       │
│ Avg Deal Size: $25k            │
│ Sales Cycle: 45 days           │
│ [View in Sales] →              │
└───────────────────────────────┘

┌─ CSM Context ─────────────────┐
│ Churn Risk Accounts: 3         │
│ NRR: 112%                      │
│ Expansion Probability: 60%     │
│ [View in CSM] →                │
└───────────────────────────────┘
```

## Real Workflows Enabled

### Workflow: Sales Close + CSM Onboarding

1. **Sales rep** closes deal in Sales workbench
   - Sees Finance contract terms (payment schedule, terms)
   - Sees Support SLA agreements
   - Clicks "Hand off to CSM" button
   
2. **CSM context** is auto-populated from closed deal:
   - Account created
   - Health score initialized
   - Contract renewal date scheduled
   - Implementation team notified

3. **CSM workbench** shows:
   - New account with initial health = 50
   - Sales pipeline for upsells (linked)
   - Finance MRR projection
   - Next steps checklist

### Workflow: CSM Detects Churn + Finance Intervenes

1. **CSM** identifies account with health score < 30
   - Support context shows high ticket volume
   - Finance context shows invoice overdue
   - Sales context shows no pipeline activity
   
2. **CSM clicks "View Financial Status"**
   - Navigates to Finance workbench
   - Pre-filtered to this account's invoices
   - Finance team can adjust payment terms or offer discount

3. **Finance closes account**
   - Health score auto-updates in CSM
   - Support team notified of resolution
   - Sales team flagged for win-back opportunity

### Workflow: Engineering Incident → Impact

1. **Engineering incident** marked critical
   - Shows "Customers affected: 127"
   - Lists top 10 affected accounts

2. **CSM context** appears in incident view:
   - Account health scores for affected accounts
   - Recent expansion opportunities (now at risk)
   - NRR impact calculation

3. **CSM clicks incident from own workbench:**
   - Sees system status in-line
   - Can notify affected customers
   - Tracks how incident affects churn probability

## Implementation Pattern

For each workbench:

### 1. Define Domain Needs (one time)

```typescript
export const DOMAIN_NEEDS = {
  your_domain: {
    primary: ['entity_type_1', 'entity_type_2'],
    secondary_context: {
      other_domain_1: ['field_a', 'field_b'],
      other_domain_2: ['field_c', 'field_d'],
    },
    key_decision: 'What decision does this workbench enable?'
  }
};
```

### 2. Compute Context (in workbench)

```typescript
const spineData = new Map([
  ['spine_deals', deal_rows],
  ['spine_accounts', account_rows],
  // ... all domains
]);

const context = OrganizationalContextEngine.getEntityContext(
  selected_deal_id,
  'DEAL',
  'sales',
  spineData
);
```

### 3. Render Component (in JSX)

```tsx
<CrossDomainContext
  current_domain="sales"
  secondary_context={context.secondary_context}
  cross_domain_actions={context.cross_domain_actions}
  onCrossDomainNavigate={handleNavigation}
/>
```

## Guidelines

### DO

✓ Show only 3-5 key fields per domain  
✓ Make cross-domain actions one-click  
✓ Keep secondary context compact and read-only  
✓ Preserve navigation context (breadcrumbs, back button)  
✓ Show "last updated" time for freshness  
✓ Handle missing data gracefully (show "not connected yet")  

### DON'T

✗ Show all fields from other domains (too overwhelming)  
✗ Allow editing of cross-domain data (stay in owner domain)  
✗ Make navigation complex (one button to view full context)  
✗ Break domain boundaries (Sales workbench is for sales, not CSM data)  
✗ Assume all domains are connected (warn if critical data missing)  

## What This Enables

1. **Informed Decision Making**
   - Sales rep knows account health before closing deal
   - CSM knows sales pipeline before account review
   - Finance knows CSM health scores before forecasting

2. **Seamless Handoffs**
   - Deal closes → CSM account created automatically
   - CSM flags churn → Finance sees payment issues
   - Support incident → CSM notified of impact

3. **Cross-Team Collaboration**
   - Everyone sees related data without context switching
   - One-click to dive deeper in other domain
   - Natural workflow without tool fragmentation

4. **Real-Time Organization View**
   - Sales, CSM, Finance all aligned on same accounts
   - Pipeline forecast based on actual CSM health
   - Churn risk visible to entire organization

## Files

- `foundation/org-context.ts` (413 lines) — Domain needs, engine, patterns
- `components/cross-domain-context.tsx` (180 lines) — UI component
- `workbenches/sales-revops-workbench.tsx` (updated) — Integration example

## Next Steps

1. Review `org-context.ts` DOMAIN_NEEDS mapping
2. Add cross-domain context to all 12 workbenches (copy Sales pattern)
3. Test workflows end-to-end
4. Gather feedback on what context matters most
5. Iterate on abstraction levels (show more/less fields)

---

**The goal: Your workbenches feel like one integrated system, not 12 separate tools.**


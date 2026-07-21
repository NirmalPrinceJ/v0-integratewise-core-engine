# Frontend Architecture: Pin-to-Pin Mapping & L1 Projection Wiring


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

## Frontend Structure Copied

```
/apps/web/components/
├── domains/
│   ├── account-success/        ← CS workbench
│   │   ├── dashboard.tsx
│   │   ├── shell.tsx
│   │   ├── views/              (15 specialized views)
│   │   │   ├── account-master-view.tsx
│   │   │   ├── api-portfolio-view.tsx
│   │   │   ├── business-context-view.tsx
│   │   │   ├── capabilities-view.tsx
│   │   │   ├── company-growth-view.tsx
│   │   │   ├── engagement-log-view.tsx
│   │   │   ├── initiatives-view.tsx
│   │   │   ├── insights-view.tsx
│   │   │   ├── people-team-view.tsx
│   │   │   ├── platform-health-view.tsx
│   │   │   ├── product-client-view.tsx
│   │   │   ├── risk-register-view.tsx
│   │   │   ├── stakeholder-outcomes-view.tsx
│   │   │   ├── strategic-objectives-view.tsx
│   │   │   ├── success-plans-view.tsx
│   │   │   ├── task-manager-view.tsx
│   │   │   └── value-streams-view.tsx
│   │   ├── accounts-view.tsx
│   │   ├── contacts-view.tsx
│   │   ├── csm-calendar.tsx
│   │   ├── documents-view.tsx
│   │   ├── meetings-view.tsx
│   │   ├── projects-view.tsx
│   │   ├── tasks-view.tsx
│   │   └── intelligence-overlay.tsx
│   ├── personal/               ← Personal workspace
│   │   ├── dashboard.tsx
│   │   ├── shell.tsx
│   │   └── personal-views.tsx
│   ├── revops/                 ← Revenue Operations
│   │   ├── dashboard.tsx
│   │   ├── shell.tsx
│   │   └── revops-views.tsx
│   ├── salesops/               ← Sales Operations
│   │   ├── dashboard.tsx
│   │   ├── shell.tsx
│   │   └── salesops-views.tsx
│   ├── domain-sidebar.tsx      ← Navigation sidebar
│   ├── domain-types.ts         ← Domain configuration
│   ├── domain-views.tsx        ← View switcher
│   └── spine-projection.ts     ← Projection utilities
├── workspace-shell.tsx         ← Main app shell
├── sidebar.tsx                 ← Left navigation
├── top-bar.tsx                 ← Header bar
├── command-palette.tsx         ← Command K interface
├── intelligence-overlay.tsx    ← AI insights overlay
├── l1-module-content.tsx       ← L1 projection renderer
├── integrations-hub.tsx        ← Connectors UI
├── settings-page.tsx
├── profile-page.tsx
└── subscriptions-page.tsx
```

## Field Mapping: workbench-projections.ts → domain-types.ts

| workbench-projections role | domain-types | spine projection | default role |
|---|---|---|---|
| sales_rep | salesops | sales | sales |
| sales_manager | salesops | sales | sales |
| cs_specialist | account-success | bizops | business-ops |
| cs_manager | account-success | bizops | business-ops |
| finance_manager | revops | sales | business-ops |
| engineering_lead | personal | bizops | developer |
| marketing_manager | personal | bizops | developer |
| ops_manager | integratewise-apac | bizops | admin |
| ceo | integratewise-apac | bizops | admin |
| support_lead | account-success | bizops | business-ops |

## L1 Projection System Wiring

### Current Flow (Post-Copy):

```
User Role (session)
  ↓
generateProjectionForRole(role)
  ↓
Returns: L1Projection {
  workbench: "sales" | "cs" | "finance" | etc.
  metrics: [...]
  widgets: [...]
  quick_actions: [...]
}
  ↓
RoleAwareDashboard renders MetricCard, WidgetCard, etc.
```

### New Flow (With Domains):

```
User Role (session)
  ↓
generateProjectionForRole(role)
  ↓
L1Projection + domain routing
  ↓
DomainShell (workspace-shell.tsx)
  ├── sidebar.tsx (domain picker)
  ├── domain-sidebar.tsx (domain nav)
  ├── top-bar.tsx (header)
  └── workspace (domain-specific)
      ├── account-success/shell.tsx (CS Dashboard)
      ├── salesops/shell.tsx (Sales Dashboard)
      ├── revops/shell.tsx (RevOps Dashboard)
      ├── personal/shell.tsx (Personal Dashboard)
      └── integratewise-apac/shell.tsx (Console)
```

## Pin-to-Pin Mapping Points

### 1. Domain Selection
**File:** `domain-types.ts`
**Maps to:** `generateProjectionForRole(role)` in `workbench-projections.ts`

**Enhancement needed:**
```typescript
// Map role → domain + default dashboard
function getRoleDomainMapping(role: UserRole): {
  domain: DomainId;
  defaultView: string;
  suggestedConnectors: string[];
} {
  switch(role) {
    case "sales_rep": return { domain: "salesops", defaultView: "pipeline", ... }
    case "cs_manager": return { domain: "account-success", defaultView: "health", ... }
    // etc
  }
}
```

### 2. Dashboard Widget Mapping
**File:** `l1-module-content.tsx`
**Current:** Renders L1Projection metrics/widgets
**Enhancement:** Map to domain-specific widget components

```typescript
// In l1-module-content.tsx
function renderWidgetForDomain(widget: WidgetProjection, domain: DomainId) {
  switch(domain) {
    case "account-success": return <AccountSuccessWidget widget={widget} />
    case "salesops": return <SalesopsWidget widget={widget} />
    // etc
  }
}
```

### 3. Quick Actions Wiring
**File:** `workspace-shell.tsx` + domain shells
**Map:** L1 quick_actions → domain view triggers

```typescript
// action "schedule_ebr" → navigate to account-success/meetings-view
// action "create_deal" → navigate to salesops/pipeline-view
// etc
```

### 4. Navigation Integration
**File:** `domain-sidebar.tsx`
**Enhancement:** Populate nav from L1 projection

```typescript
// sidebar items from projection.filters + views
const navItems = projection.widgets.map(w => ({
  id: w.id,
  label: w.title,
  icon: domainConfig.icon,
}))
```

### 5. Data Source Routing
**File:** `spine-projection.ts` (shared)
**Enhancement:** Route data sources by domain

```typescript
// "pipeline_by_stage" → fetch salesops data
// "health_by_segment" → fetch cs data
// "cash_flow" → fetch finance data
function getDataSource(source: string, domain: DomainId) {
  // Use domain context to fetch correct data
}
```

## Implementation Checklist

- [ ] Create `getRoleDomainMapping()` function
- [ ] Wire L1 quick_actions to domain view navigation
- [ ] Map L1 metrics to domain data sources
- [ ] Enhance domain-sidebar.tsx with L1 filter rendering
- [ ] Update workspace-shell.tsx to use L1 context
- [ ] Add domain-specific widget renderers
- [ ] Test role → domain → view navigation flow
- [ ] Verify metric calculations for each domain

## Files Modified

1. `/apps/web/lib/workbench-projections.ts` — Add domain routing
2. `/apps/web/components/workspace-shell.tsx` — Use L1 context
3. `/apps/web/components/domains/domain-sidebar.tsx` — Render L1 nav
4. `/apps/web/components/l1-module-content.tsx` — Domain-aware rendering
5. `/apps/web/components/domains/spine-projection.ts` — Domain-scoped data fetching

## Summary

The frontend has 5 domain workspaces (personal, account-success, revops, salesops, integratewise-apac) that will be populated by the L1 projection system. Each role automatically maps to a domain, which loads a tailored set of metrics, widgets, views, and quick actions. The spine-projection utilities ensure metrics are calculated contextually per domain.

# IntegrateWise Quick Reference Card


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

## One-Liner
**Unified operational platform where one role = one automatically-loaded domain workbench, with intelligent metric/action routing.**

---

## Core Hooks

```typescript
import { useL1Projection } from "@/lib/l1-l2-context"

const { 
  projection,        // L1Projection {metrics, widgets, actions}
  domain,            // "account-success" | "salesops" | etc
  defaultView,       // "health-dashboard" | "pipeline" | etc
  suggestedConnectors, // ["salesforce", "zendesk", "intercom"]
  workbench_context  // WorkbenchContext {timeRange, filters, etc}
} = useL1Projection()
```

---

## Core Functions

```typescript
// Get domain for role
import { getRoleDomainMapping } from "@/lib/workbench-projections"
const {domain, defaultView, connectors} = getRoleDomainMapping("cs_manager")

// Get action route
import { getActionRoute } from "@/lib/l1-domain-wiring"
const route = getActionRoute("schedule_ebr")
// → {domain: "account-success", view: "meetings-view"}

// Get action navigation URL
import { getActionNavigationUrl } from "@/lib/l1-domain-wiring"
const url = getActionNavigationUrl(quickAction)
// → "/workspace/account-success/meetings-view"
```

---

## 16 Roles & Their Domains

| Role | Domain | View |
|------|--------|------|
| `sales_rep` | `salesops` | `pipeline` |
| `sales_manager` | `salesops` | `team-pipeline` |
| `cs_specialist` | `account-success` | `accounts` |
| `cs_manager` | `account-success` | `health-dashboard` |
| `finance_manager` | `revops` | `cash-flow` |
| `finance_analyst` | `revops` | `collections` |
| `support_lead` | `account-success` | `tickets` |
| `support_agent` | `account-success` | `my-queue` |
| `marketing_manager` | `personal` | `campaigns` |
| `marketing_analyst` | `personal` | `lead-sources` |
| `engineering_lead` | `personal` | `projects` |
| `engineering_manager` | `personal` | `team-velocity` |
| `ops_manager` | `integratewise-apac` | `operations` |
| `ops_analyst` | `revops` | `process-health` |
| `hr_manager` | `personal` | `team` |
| `ceo` | `integratewise-apac` | `executive` |

---

## 5 Domain Workspaces

```
personal              — Individual productivity hub
account-success       — CS health & renewals (25+ views)
revops                — Revenue operations & forecasting
salesops              — Sales execution & pipeline
integratewise-apac    — Admin console & full platform control
```

---

## Quick Action Routes (Sample)

```typescript
// Sales
"create_deal"      → salesops/pipeline
"log_activity"     → salesops/activities
"call_lead"        → salesops/dialer

// CS
"schedule_ebr"     → account-success/meetings-view
"create_expansion" → account-success/opportunities
"send_playbook"    → account-success/documents-view

// Finance
"create_budget"    → revops/budgeting
"send_invoice"     → revops/invoicing

// 40+ total routes mapped
```

---

## Widget Data Source Routes (Sample)

```typescript
// Sales
"pipeline_by_stage"    → salesops/pipeline
"rep_metrics"          → salesops/team-performance
"forecast_accuracy"    → salesops/forecasting

// CS
"health_by_segment"    → account-success/health-dashboard
"renewal_calendar"     → account-success/accounts-view
"usage_trends"         → account-success/account-master-view

// Finance
"cash_flow"            → revops/cash-flow
"revenue_breakdown"    → revops/reporting
"overdue_invoices"     → revops/collections

// 30+ total routes mapped
```

---

## L1 Projection Structure

```typescript
interface L1Projection {
  workbench: string           // "sales" | "cs" | "finance" | etc
  user_role: UserRole         // The role that generated this
  domain: string              // "salesops" | "account-success" | etc
  layout: string              // "dashboard" | "table" | "kanban"
  
  metrics: MetricProjection[] // 4 KPIs
  widgets: WidgetProjection[] // 3-4 data visualizations
  quick_actions: QuickActionProjection[] // 3-4 actions
  filters: FilterProjection[] // Context-aware filters
  permissions: string[]       // What this role can do
}
```

---

## Role-Based Workbench Example

**As CS Manager:**
```typescript
{
  metrics: [
    {id: "nrr", value: 108, label: "NRR %"},
    {id: "churn", value: 3, label: "Churn %"},
    {id: "health", value: 87, label: "Health Score"},
    {id: "at_risk", value: 3, label: "At-Risk Accounts"}
  ],
  widgets: [
    {id: "health_by_segment", data_source: "..."},
    {id: "renewal_calendar", data_source: "..."},
    {id: "at_risk_accounts", data_source: "..."},
    {id: "usage_trends", data_source: "..."}
  ],
  quick_actions: [
    {id: "schedule_ebr", label: "Schedule EBR", action: "schedule_ebr"},
    {id: "create_expansion", label: "Expansion Opp", action: "create_expansion"},
    {id: "send_playbook", label: "Send Playbook", action: "send_playbook"},
    {id: "review_health", label: "Review Health", action: "review_health"}
  ]
}
```

---

## File Structure

```
apps/web/
├── lib/
│   ├── workbench-projections.ts    ← 16 workbench builders + domain mapping
│   ├── l1-domain-wiring.ts         ← 40+ action routes + 30+ widget routes
│   ├── l1-l2-context.ts            ← Context + hooks
│   └── connector-integration.ts    ← Connector bridging
├── components/
│   ├── domains/
│   │   ├── account-success/        ← 25+ views
│   │   ├── salesops/               ← Sales views
│   │   ├── revops/                 ← Finance views
│   │   ├── personal/               ← Personal views
│   │   └── integratewise-apac/     ← Admin views
│   ├── workspace-shell.tsx         ← Main container
│   ├── sidebar.tsx                 ← Domain picker
│   ├── top-bar.tsx                 ← Header
│   └── providers/
│       └── l1-provider.tsx         ← L1 context provider
```

---

## Navigation Flow

```
User logs in with role
         ↓
L1Provider calls generateProjectionForRole(role)
         ↓
Returns: L1Projection + domain info
         ↓
Navigate to /workspace/{domain}/{defaultView}
         ↓
Domain shell loads (account-success/shell.tsx, etc)
         ↓
Renders L1 metrics, widgets, actions
         ↓
User clicks action
         ↓
getActionRoute(action) returns target domain/view
         ↓
Navigate to /workspace/{domain}/{view}
```

---

## Performance

- Role lookup: **< 1ms**
- Projection generation: **< 1ms**
- Action routing: **< 1ms**
- Navigation: **< 100ms**
- **Total click-to-view: < 150ms**

---

## Testing Checklist

- [ ] Load as sales_rep → redirects to salesops
- [ ] Load as cs_manager → redirects to account-success
- [ ] Load as ceo → redirects to integratewise-apac
- [ ] Click "Schedule EBR" → navigates to meetings-view
- [ ] Click "Create Deal" → navigates to pipeline
- [ ] All 40+ action routes working
- [ ] All 30+ widget routes working
- [ ] Domain change regenerates projection
- [ ] Suggested connectors populate correctly

---

## Usage Example

```typescript
// In a component
export function QuickActionButton({ action }: { action: QuickActionProjection }) {
  const navigate = useNavigate()
  
  const handleClick = () => {
    const url = getActionNavigationUrl(action)
    if (url) navigate(url)
  }
  
  return <button onClick={handleClick}>{action.label}</button>
}
```

---

## Adding a New Role

1. Add to `UserRole` type:
```typescript
export type UserRole = "..." | "new_role"
```

2. Create builder:
```typescript
function buildNewRoleWorkbench(): L1Projection { ... }
```

3. Add to generator:
```typescript
export function generateProjectionForRole(role: UserRole) {
  switch(role) {
    case "new_role": return buildNewRoleWorkbench()
    // ...
  }
}
```

4. Add domain mapping:
```typescript
export const roleDomainMappings: Record<UserRole, RoleDomainMapping> = {
  new_role: { 
    domain: "my-domain", 
    defaultView: "my-view",
    connectors: [...]
  },
  // ...
}
```

---

## Adding a New Quick Action Route

1. Add to `actionRouteMap`:
```typescript
export const actionRouteMap: Record<string, ActionRoute> = {
  my_action: { domain: "salesops", view: "my-view" },
  // ...
}
```

2. Use in component:
```typescript
const url = getActionNavigationUrl(action)
navigate(url)
```

---

## Documentation

- `COMPLETE_IMPLEMENTATION_SUMMARY.md` — Full architecture
- `FRONTEND_WIRING_COMPLETE.md` — Detailed wiring
- `IMPLEMENTATION_VERIFICATION.md` — Verification checklist
- `QUICK_REFERENCE.md` — This file

---

## Key Insight

**Same unified Spine data. One L1 projection per role. One domain per projection. One default view per domain. Unlimited perspectives.**

Each role sees exactly what they need to do their job. No more, no less.

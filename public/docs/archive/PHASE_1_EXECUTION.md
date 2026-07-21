# Phase 1: Dashboard Restoration - Execution Plan


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

## Goal
Get the dashboard rendering with REAL data (not mock, not skeletons, not redirects).

## Current State
- ✓ Dashboard page renders at `/dashboard`
- ✓ HomeView component fully implemented
- ✓ All UI components in place
- ✗ Uses Supabase hooks (old pattern)
- ✗ No backend API integration yet
- ✗ Hardcoded mock data in some sections

## What Success Looks Like
Dashboard at `/dashboard` shows:
- Health Score: Real value from backend
- KPI Cards: Real metrics from `/api/v1/cognitive/spine`
- AI Insights: Real signals from `/api/v1/cognitive/signals`
- Tasks: Real tasks from workspace
- Calendar: Real events
- Emails: Real emails from connectors
- Recent Activity: Real audit log
- No skeleton loaders (data fetches before render)
- No hardcoded values

## The Problem We're Solving
HomeView currently:
1. Uses Supabase hooks (6 custom hooks)
2. Falls back to mock data when no data
3. Shows skeletons during loading
4. Has hardcoded values like "8/10" for health score

We need HomeView to:
1. Use TypedApiClient from our endpoints
2. Fetch from Gateway endpoints
3. Show real data or error states
4. Never show skeletons (that's user confusion)

## Execution Steps

### Step 1: Update HomeView Data Fetching (1-2 hours)

Replace the Supabase hook pattern:
```typescript
// OLD (Supabase)
const { data: metrics } = useMetrics()

// NEW (Gateway)
useEffect(() => {
  const fetchMetrics = async () => {
    const health = await getGateway().getWorkspaceHealth()
    setMetrics(health.metrics)
  }
  fetchMetrics()
}, [])
```

Key endpoints to wire:
- `GET /cognitive/spine` → Health score, KPI metrics
- `GET /cognitive/signals` → AI insights (risks, trends, opportunities)
- `GET /workspace/tasks` → User's pending tasks
- `GET /workspace/events` → Calendar events
- `GET /connector/emails` → Recent emails
- `GET /admin/audit-log` → Activity feed

### Step 2: Replace Mock Data with Real Data (1 hour)

Find all places with hardcoded values:
```typescript
// BEFORE
<p className="text-5xl font-bold">8/10</p>

// AFTER
<p className="text-5xl font-bold">{health?.healthScore}/10</p>
```

Search for:
- `8/10` (hardcoded health score)
- `₹26L` (hardcoded revenue)
- `mrr` const values
- `pipeline` const values
- Mock insights array

### Step 3: Add Error States (Not Skeletons) (30 min)

When data doesn't load:
```typescript
if (error) {
  return <ErrorCard title="Failed to load health" retry={refetch} />
}

if (!data) {
  return <EmptyState message="No data available" />
}

return <HealthScore value={data} />
```

### Step 4: Test & Verify (30 min)

Checklist:
- [ ] Dashboard loads without redirects
- [ ] Health score shows real value (not 8/10)
- [ ] KPI cards show real metrics
- [ ] Tasks panel shows real tasks or empty state
- [ ] Calendar shows real events or empty state
- [ ] AI Insights shows real signals or empty state
- [ ] No TypeScript errors in dashboard page
- [ ] No console errors
- [ ] Properly handles missing/error data

## Technical Details

### Endpoints We'll Use
```
GET /cognitive/spine
  → Returns: WorkspaceHealth (healthScore, metrics)

GET /cognitive/signals  
  → Returns: Signal[] (risks, trends, opportunities, metrics)

GET /workspace/tasks
  → Returns: Task[] (user's pending tasks)

GET /workspace/events
  → Returns: Event[] (calendar events)

GET /connector/emails
  → Returns: Email[] (recent emails from integrations)

GET /admin/audit-log
  → Returns: AuditLog[] (activity timeline)
```

### How to Fetch
```typescript
import { getGateway } from '@/lib'

export function HomeView() {
  const [health, setHealth] = useState(null)
  const [insights, setInsights] = useState([])

  useEffect(() => {
    const load = async () => {
      const gateway = getGateway()
      const h = await gateway.getWorkspaceHealth()
      const s = await gateway.listSignals()
      setHealth(h)
      setInsights(s)
    }
    load()
  }, [])
}
```

### Error Handling
```typescript
const [error, setError] = useState(null)

useEffect(() => {
  const load = async () => {
    try {
      const data = await gateway.getWorkspaceHealth()
      setHealth(data)
    } catch (err) {
      setError(err.message)
      // Still render, just with error state
    }
  }
  load()
}, [])
```

## Files to Update

### Primary
- `apps/web/components/views/home-view.tsx` — Main changes (remove Supabase hooks, add Gateway calls)

### Secondary  
- `apps/web/app/(app)/dashboard/page.tsx` — Already updated ✓

### Verify
- `apps/web/lib/hooks/use-data.ts` — Can we remove the Supabase hooks?

## Definition of Done

✓ Dashboard renders without redirect
✓ All widgets show real data (not mock)
✓ No hardcoded values like "8/10"
✓ Proper error handling (no skeletons)
✓ No TypeScript errors on dashboard
✓ All endpoint calls use TypedApiClient
✓ Backend auth headers passed correctly
✓ Respects rate limiting

## What NOT to Do

✗ Don't generate more documentation
✗ Don't create new endpoints
✗ Don't optimize performance yet
✗ Don't add real-time updates
✗ Don't build additional features
✗ Don't fix unrelated TypeScript errors

Just. Make. Dashboard. Work. With. Real. Data.

## Success Metrics

| Before | After |
|--------|-------|
| Dashboard redirects | Dashboard renders |
| Shows skeletons | Shows data or error |
| Hardcoded "8/10" | Real health score |
| Mock insights | Real signals from API |
| No backend calls | All data from /api/v1 |

## Time Estimate
- Step 1 (Data fetching): 1-2 hours
- Step 2 (Remove mock data): 1 hour
- Step 3 (Error states): 30 min
- Step 4 (Testing): 30 min

**Total: 3-4 hours to Phase 1 Done**

Then Phase 2: Wire more components to backend
Then Phase 3: Real-time + optimization

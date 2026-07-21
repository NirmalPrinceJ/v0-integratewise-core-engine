# Workspace Projection Architecture


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

## Overview

This document defines the architectural contract between frontend and backend for the IntegrateWise dashboard.

**Core Principle:** Frontend doesn't know about backend service topology. Frontend only knows about **one DTO**.

---

## The Single Contract: WorkspaceDashboard

```typescript
interface WorkspaceDashboard {
  // Tier 1: Operational (required)
  health_score: number
  metrics: WorkspaceMetrics
  tasks: DashboardTask[]
  activity: DashboardActivity[]
  insights: DashboardInsight[]
  search: DashboardSearch

  // Tier 2: Optional (nice to have)
  calendar?: DashboardCalendarEvent[]
  email?: DashboardEmail[]
  documents?: DashboardDocument[]

  // Metadata
  last_updated: string
  next_sync: string
}
```

**That's it.** This is the ONLY object the frontend needs to understand.

---

## Frontend Architecture

### How HomeView Consumes the DTO

```tsx
export function HomeView() {
  const [dashboard, setDashboard] = useState<WorkspaceDashboard | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // ONE API call
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const gateway = getGateway()
        const data = await gateway.workspace.dashboard()
        setDashboard(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    loadDashboard()
  }, [])

  // Every widget is a pure presentation component
  return (
    <HealthCard health={dashboard?.health_score} />
    <KPICards metrics={dashboard?.metrics} />
    <TasksPanel tasks={dashboard?.tasks} />
    <ActivityFeed activity={dashboard?.activity} />
    <InsightsPanel insights={dashboard?.insights} />
  )
}
```

**Key properties:**
- ✅ Single `dashboard` state (not 10 different states)
- ✅ Single useEffect (not multiple per widget)
- ✅ Widgets are pure presentation (receive data as props)
- ✅ No widget knows about API endpoints
- ✅ No service names in frontend code

### Widget Pattern

Every widget follows this pattern:

```tsx
function HealthCard({ health }: { health?: number }) {
  return (
    <Card>
      <CardContent>
        {health ? (
          <div>
            <p>Health Score</p>
            <p className="text-5xl">{health}/100</p>
          </div>
        ) : (
          <Skeleton />
        )}
      </CardContent>
    </Card>
  )
}
```

**Rules:**
- ✅ Receives data as props
- ✅ No API calls
- ✅ No Supabase hooks
- ✅ No service-specific knowledge
- ✅ Pure presentation logic

---

## Backend Architecture

### Projection Builder Pattern

The backend Gateway receives a dashboard request and orchestrates:

```
GET /api/v1/workspace/dashboard
    ↓
Projection Builder
    ↓
Fetches from multiple services:
  • Workspace Aggregator (entity data)
  • Adaptive Spine (health score)
  • Adaptive Memory (context)
  • Intelligence Service (signals, insights)
  • Connector Platform (data sync status)
  • Task Service (pending tasks)
  • Audit Log (recent activity)
  • Search Index (search metadata)
    ↓
Shapes data into WorkspaceDashboard DTO
    ↓
Returns single JSON response
```

### Service Choreography

The Projection Builder is responsible for:

1. **Parallel fetches** where possible
2. **Fallback values** if a service is down
3. **Caching** the result
4. **Rate limiting** the aggregation
5. **Partial responses** if needed

Example pseudocode:

```typescript
async function buildDashboard(workspaceId: string): WorkspaceDashboard {
  // Parallel fetches
  const [health, tasks, activity, insights] = await Promise.allSettled([
    adaptiveSpine.getHealth(workspaceId),
    taskService.list(workspaceId),
    auditLog.recent(workspaceId, 5),
    intelligence.signals(workspaceId, { limit: 5 }),
  ])

  // Build DTO with fallbacks
  return {
    health_score: health.value?.score ?? 50,
    metrics: health.value?.metrics ?? {},
    tasks: tasks.value ?? [],
    activity: activity.value ?? [],
    insights: insights.value ?? [],
    search: { query: "", recent_queries: [], suggestions: [] },
    last_updated: new Date().toISOString(),
    next_sync: new Date(Date.now() + 5 * 60000).toISOString(),
  }
}
```

### Why This Works

- ✅ **Resilience:** One service down doesn't break the dashboard
- ✅ **Performance:** Parallel fetches, single response
- ✅ **Maintainability:** Frontend never changes when backend services do
- ✅ **Scalability:** Can add services to projection without frontend code
- ✅ **Cacheable:** Entire dashboard can be cached as one unit
- ✅ **Real-time Ready:** Can broadcast updates via WebSocket as one DTO

---

## SDK Layer (Gateway SDK)

The `GatewaySDK` exposes business operations:

```typescript
// ✅ GOOD - Business operations
sdk.workspace.dashboard()
sdk.accounts.list()
sdk.tasks.list()
sdk.search.query("term")

// ❌ BAD - Service topology
sdk.cognitiveSpine.getHealth()
sdk.intelligence.signals()
sdk.adaptiveMemory.list()
```

### Usage

```typescript
const gateway = getGateway()
gateway.setToken(authToken)

// Single call for entire dashboard
const dashboard = await gateway.workspace.dashboard()

// Individual operations for other pages
const accounts = await gateway.accounts.list()
const searchResults = await gateway.search.query("customer")
```

---

## Phase 1 Success Criteria

| Item | Status |
|------|--------|
| Dashboard renders at `/dashboard` | ✅ |
| No redirects | ✅ |
| Single DTO pattern | ✅ |
| Health metrics live | ✅ |
| KPI cards live | ✅ |
| Tasks live | ✅ |
| Activity live | ✅ |
| Zero mock data | ⏳ |
| Backend Projection Builder | ⏳ |
| Search live | ⏳ |

---

## Implementation Checklist

### Backend (Next)

- [ ] Create Projection Builder service
- [ ] Implement `GET /api/v1/workspace/dashboard`
- [ ] Fetch from Adaptive Spine (health)
- [ ] Fetch from Task service (tasks)
- [ ] Fetch from Audit log (activity)
- [ ] Fetch from Intelligence (insights)
- [ ] Add caching (5 min TTL)
- [ ] Add fallback values
- [ ] Test in Postman
- [ ] Test with multiple services down

### Frontend (Current)

- [x] Define WorkspaceDashboard DTO
- [x] Create GatewaySDK
- [x] Update HomeView to use single DTO
- [x] Make all widgets pure presentation
- [x] Remove Supabase hooks from HomeView
- [ ] Test on localhost
- [ ] Remove remaining mock data
- [ ] Add error boundaries
- [ ] Wire search functionality

---

## Data Flow Diagram

```
User at /dashboard
        ↓
Dashboard Page
        ↓
HomeView Component
        ↓
useEffect triggers
        ↓
getGateway().workspace.dashboard()
        ↓
HTTP GET /api/v1/workspace/dashboard
        ↓
Gateway Router
        ↓
Projection Builder Service
        ↓
Parallel fetches to:
  • Adaptive Spine
  • Task Service
  • Audit Log
  • Intelligence Service
        ↓
Aggregate into WorkspaceDashboard DTO
        ↓
Return JSON
        ↓
HomeView setState(dashboard)
        ↓
Render all widgets from single DTO
```

---

## Key Files

| File | Purpose |
|------|---------|
| `packages/lib/src/workspace-dashboard.ts` | DTO definitions (Tier 1, 2, 3) |
| `packages/lib/src/gateway-sdk.ts` | SDK wrapper (business operations) |
| `apps/web/components/views/home-view.tsx` | Dashboard view (uses DTO) |
| `apps/web/app/(app)/dashboard/page.tsx` | Route handler |

---

## Migration Path

If you have existing components using Supabase hooks:

### Before
```tsx
function OldDashboard() {
  const { data: health } = useWorkspaceHealth()
  const { data: tasks } = useTasks()
  const { data: activity } = useActivities()
  
  return (
    <HealthCard health={health} />
    <TasksPanel tasks={tasks} />
    <ActivityFeed activity={activity} />
  )
}
```

### After
```tsx
function NewDashboard() {
  const [dashboard] = useDashboard() // Single hook

  return (
    <HealthCard health={dashboard.health_score} />
    <TasksPanel tasks={dashboard.tasks} />
    <ActivityFeed activity={dashboard.activity} />
  )
}
```

---

## Future Enhancements

Once this architecture is solid:

1. **Real-time Updates** - WebSocket emits new `WorkspaceDashboard` DTO
2. **Selective Refresh** - Update individual sections (tasks, activity) without full reload
3. **Offline Support** - Cache entire DTO locally
4. **Optimistic Updates** - Update UI before server confirms
5. **Streaming** - Large responses via streaming protocol
6. **GraphQL** - Replace REST with GraphQL for better caching
7. **Per-user Permissions** - RLS at DTO level

---

## Principles

1. **Single Responsibility** - Frontend doesn't care about backend topology
2. **Contracts Over Implementation** - DTO is the only contract
3. **Composition Over Coupling** - Projection Builder composes services
4. **Resilience** - Graceful degradation if services are down
5. **Performance** - Parallel fetches, cached responses
6. **Maintainability** - One place to change (Projection Builder)

---

**Last Updated:** 2024-01-15
**Status:** ACTIVE
**Owner:** Architecture Team

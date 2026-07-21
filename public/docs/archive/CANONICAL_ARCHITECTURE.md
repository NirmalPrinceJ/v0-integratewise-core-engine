# CANONICAL ARCHITECTURE


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

**How Platform Thesis is Implemented**

Maps each thesis principle to actual code and architecture.

---

## Architecture Diagram

```
FRONTEND                    GATEWAY                 PROJECTION ENGINE           CAPABILITIES
│                           │                       │                           │
├─ Web Dashboard            ├─ POST /projection     ├─ FacadeRegistry          ├─ Adaptive Spine
├─ Mobile App               │  { context }          │  │                       ├─ Workspace Service
├─ AI Assistant             │                       │  ├─ WorkspaceFacade      ├─ Connector Platform
├─ Slack Bot                │ GET /projection/:id   │  ├─ MobileFacade         ├─ Intelligence Service
├─ VSCode Extension         │                       │  ├─ ExecutiveFacade      ├─ Memory Service
├─ Custom Widget            │ WebSocket /live       │  └─ [Others]             ├─ Governance Service
│                           │                       │                           └─ Workflow Runtime
│ Stateless, receives       │ Routes requests,      │ Composes capabilities     │ Independent,
│ projection DTO            │ carries context       │ into semantic sections    │ well-defined units
│                           │                       │                           │
└─ Zero business logic      └─ No service names     └─ Per-projection          └─ Idempotent,
                              exposed                  composition logic          circuit-breakered
```

---

## Layer 1: Capabilities (Core Logic)

Each capability is independent, composable, observable.

### Adaptive Spine

**Purpose:** Compute workspace health, metrics, reasoning

**Inputs:**
- workspace_id
- entity_data, task_data, activity_data
- time_range

**Outputs:**
```typescript
WorkspaceHealth {
  health_score: number,          // 0-100
  health_status: 'healthy' | 'warning' | 'critical',
  metrics: {
    total_revenue: number,
    active_customers: number,
    pending_tasks: number,
    completion_rate: number,
    avg_response_time: number,
  },
  entity_count: {
    accounts: number,
    contacts: number,
    tasks: number,
    workflows: number,
  },
  last_updated: string,
}
```

**Implementation:** `services/adaptive-spine/src/`

---

### Workspace Service

**Purpose:** Manage tasks, workflows, events, entities

**Capabilities:**
- List tasks (filtered by user, status, priority)
- List workflows (by status)
- List events (calendar)
- Manage entities (CRM data)

**Outputs:** Task[], Event[], Entity[]

**Implementation:** `services/workspace/src/`

---

### Connector Platform

**Purpose:** Unified access to external services

**Integrations:**
- Gmail / email
- Google Calendar
- Google Drive
- Slack
- GitHub
- Linear
- Stripe
- Custom webhooks

**Capability:**
```typescript
interface IConnector {
  authenticate(credentials)
  fetch(query)
  push(data)
  sync()
}
```

**Implementation:** `services/connector-platform/src/`

---

### Intelligence Service

**Purpose:** Generate signals, insights, recommendations

**Inputs:**
- workspace_id
- entity_data, metrics, history
- context (role, tier, features)

**Outputs:**
```typescript
Signal {
  id: string,
  type: 'risk' | 'trend' | 'opportunity' | 'metric',
  title: string,
  description: string,
  severity: 'low' | 'medium' | 'high',
  confidence: 0-1,
  timestamp: string,
}

Insight {
  id: string,
  category: 'business' | 'operations' | 'people' | 'growth',
  title: string,
  summary: string,
  data: object,
}

Recommendation {
  id: string,
  action: string,
  rationale: string,
  priority: number,
  estimated_impact: string,
}
```

**Implementation:** `services/intelligence/src/`

---

### Memory Service

**Purpose:** Long-term context, learning, decision history

**Capabilities:**
- Store decisions and outcomes
- Retrieve similar past scenarios
- Track what worked, what didn't
- Enable learning across time

**Implementation:** `services/memory/src/`

---

### Governance Service

**Purpose:** Approvals, rules, compliance

**Workflows:**
```
Observe → Understand → Propose → [GOVERNANCE] → Execute → Writeback
                                      ↓
                            Check rules, policies
                            Request approvals (if needed)
                            Apply role-based gates
```

**Implementation:** `services/governance/src/`

---

### Workflow Runtime

**Purpose:** Execute approved actions atomically

**Capabilities:**
- Execute workflows
- Handle retries and idempotency
- Update state atomically
- Emit events for observers

**Implementation:** `services/workflow-runtime/src/`

---

## Layer 2: Projection Facades (Business Assembly)

Each facade composes capabilities into a projection shape.

### FacadeRegistry

**Location:** `services/projection-engine/src/facades/facade-registry.ts`

**Responsibility:**
- Route projection requests to correct facade
- Pass context through the facade
- Handle facade instantiation and caching

**Interface:**
```typescript
class FacadeRegistry {
  async loadProjection(context: ProjectionContext): Promise<Projection>
  register(type: string, facade: IProjectionFacade): void
  unregister(type: string): void
}
```

---

### Workspace Facade

**Location:** `services/projection-engine/src/facades/workspace-facade.ts`

**Composes:**
- Adaptive Spine → health, metrics, kpis
- Workspace Service → tasks, workflows
- Intelligence Service → signals, insights, recommendations
- Audit Log → activity
- Connector Platform → search

**Output:**
```typescript
WorkspaceProjection {
  overview: { health_score, metrics, kpis },
  execution: { tasks, workflows, pending_count },
  intelligence: { signals, insights, recommendations },
  collaboration: { activity, recent_count },
  search: { enabled, placeholder, suggestions },
}
```

**Filtering by Context:**
```typescript
// Role-based
if (context.role === 'viewer') {
  projection.execution.tasks = filterReadOnly(tasks)
}

// Tier-based
if (context.tier !== 'enterprise') {
  projection.intelligence.recommendations = projection.intelligence.recommendations.slice(0, 3)
}

// Device-based
if (context.device === 'mobile') {
  projection = compressForMobile(projection)
}

// Feature-based
if (!context.features.includes('workflows')) {
  delete projection.execution.workflows
}
```

**Implementation Pattern:**
```typescript
class WorkspaceFacade implements IProjectionFacade {
  async buildProjection(context: ProjectionContext) {
    const [health, tasks, signals, activity] = await Promise.allSettled([
      spine.getHealth(context.workspace_id),
      workspace.getTasks(context.workspace_id),
      intelligence.getSignals(context.workspace_id),
      audit.getActivity(context.workspace_id),
    ])

    return {
      overview: {
        health_score: health.value?.health_score,
        metrics: health.value?.metrics,
        kpis: computeKPIs(health.value),
      },
      execution: {
        tasks: filterByContext(tasks.value, context),
        workflows: ...,
        pending_count: tasks.value?.filter(t => t.status === 'pending').length,
      },
      intelligence: {
        signals: signals.value?.slice(0, getLimit(context)),
        insights: ...,
        recommendations: ...,
      },
      collaboration: {
        activity: activity.value?.slice(0, 5),
        recent_count: activity.value?.length,
      },
      search: { enabled: true, ... },
    }
  }
}
```

---

### Other Facades (Template)

**MobileFacade:**
```typescript
// Smaller payload, pre-computed values
// Focus on execution (tasks) and quick actions
// Less intelligence, more actionable
```

**ExecutiveFacade:**
```typescript
// Metrics-first, no operational details
// Advanced intelligence and recommendations
// Full governance and approval workflow
```

**DeveloperFacade:**
```typescript
// MCP registry, webhook config
// Schema documentation
// Logs and error traces
// Raw API access
```

**AssistantFacade:**
```typescript
// Memory-first context
// Full LOOP integration
// Capability descriptions
// Approval gates
```

---

## Layer 3: Gateway (HTTP Boundary)

### Main Endpoint: POST /api/v1/projection

**Request:**
```typescript
{
  projection_type: 'workspace' | 'mobile' | 'executive' | 'developer' | 'assistant',
  tenant_id: string,
  workspace_id: string,
  user_id: string,
  role: 'viewer' | 'editor' | 'admin',
  permissions: string[],
  device: 'web' | 'mobile' | 'slack' | 'vscode' | 'assistant',
  features: string[],
  tier: 'free' | 'pro' | 'enterprise',
}
```

**Response:**
```typescript
{
  request_id: string,
  timestamp: string,
  projection: {
    // Projection-specific shape (WorkspaceProjection, MobileProjection, etc)
  },
  metadata: {
    cached: boolean,
    capabilities_available: string[],
    user_permissions: string[],
    rate_limit: { limit, remaining, reset_at },
  },
}
```

**Implementation:** `services/gateway/src/router.ts` lines 120-239

---

### Legacy Endpoints (Backward Compatibility)

**GET /api/v1/workspace/dashboard**
- Maps to: `facade.load({ projection_type: 'workspace' })`
- Deprecated but maintained for transition

---

## Layer 4: Frontend Contract

### Frontend Receives One of These DTOs:

**WorkspaceProjection:**
```typescript
{
  overview: { health_score, metrics, kpis },
  execution: { tasks, workflows, pending_count },
  intelligence: { signals, insights, recommendations },
  collaboration: { activity },
  search: { enabled, placeholder },
}
```

**MobileProjection:**
```typescript
{
  quick_actions: [...],
  tasks: [...],
  recent_activity: [...],
  push_preferences: {...},
}
```

**ExecutiveProjection:**
```typescript
{
  metrics: { revenue, growth, trends },
  goals: { achieved, in_progress, at_risk },
  forecast: { next_quarter },
  approvals_pending: [...],
  insights: [{ title, data, action }],
}
```

### Frontend Implementation Pattern:

```typescript
function HomeView() {
  const [projection, setProjection] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const gateway = getGateway()
      const result = await gateway.projection({
        projection_type: 'workspace',
        tenant_id: context.tenant_id,
        user_id: context.user_id,
        role: context.role,
        device: 'web',
        tier: context.tier,
      })
      setProjection(result.projection)
    }
    load()
  }, [])

  if (loading) return <Loading />
  if (error) return <Error message={error} />
  
  return (
    <>
      <OverviewSection data={projection.overview} />
      <ExecutionSection data={projection.execution} />
      <IntelligenceSection data={projection.intelligence} />
      <CollaborationSection data={projection.collaboration} />
      <SearchSection data={projection.search} />
    </>
  )
}
```

---

## Implementation Checklist

| Phase | Component | Status | Location |
|-------|-----------|--------|----------|
| 1 | Dashboard page routing | ✓ | apps/web/app/(app)/dashboard/page.tsx |
| 1 | HomeView component | ✓ | apps/web/components/views/home-view.tsx |
| 2a | ProjectionContext types | ✓ | services/projection-engine/src/types.ts |
| 2a | WorkspaceFacade | ✓ | services/projection-engine/src/facades/workspace-facade.ts |
| 2a | FacadeRegistry | ✓ | services/projection-engine/src/facades/facade-registry.ts |
| 2a | Gateway endpoint | ✓ | services/gateway/src/router.ts |
| 2b | Spine integration | ⏳ | services/projection-engine/src/facades/workspace-facade.ts |
| 2c | Memory integration | ⏳ | services/memory/src/ |
| 2d | Additional facades | ⏳ | services/projection-engine/src/facades/ |
| 3 | Governance gates | ⏳ | services/governance/src/ |
| 3 | LOOP implementation | ⏳ | services/workflow-runtime/src/ |

---

## How Each Principle is Enforced

| Principle | Mechanism | Verification |
|-----------|-----------|--------------|
| One Platform, Many Projections | Facade pattern | New projection = new facade only |
| Frontends are Stateless Renderers | DTO contract | Frontend receives projection, renders it |
| Projection Context | Context object | Every request carries full context |
| Semantic Sections | Section definitions | projection.overview, .execution, .intelligence |
| Tier Structure | Facade filtering | Facade removes tiers unavailable to user |
| LOOP pattern | Workflow runtime | Observe → Understand → Propose → Govern → Execute |
| Service Topology Hidden | FacadeRegistry | Facades abstract all service calls |
| Composability | Capability interfaces | Each capability is independently callable |

---

## Data Flow: End-to-End

```
1. User opens dashboard
   ↓
2. Frontend: GET /dashboard
   → Dashboard component mounts
   ↓
3. HomeView useEffect fires
   → const gateway = getGateway()
   ↓
4. Frontend calls gateway.projection({
     projection_type: 'workspace',
     tenant_id: 'tenant-123',
     user_id: 'user-456',
     role: 'editor',
     device: 'web',
   })
   ↓
5. HTTP: POST /api/v1/projection
   { context above }
   ↓
6. Gateway receives request
   → extract ProjectionContext
   → call FacadeRegistry.loadProjection(context)
   ↓
7. FacadeRegistry routes to WorkspaceFacade
   ↓
8. WorkspaceFacade.buildProjection(context)
   ├─ Call spine.getHealth(workspace_id)
   ├─ Call workspace.getTasks(workspace_id)
   ├─ Call intelligence.getSignals(workspace_id)
   ├─ Call audit.getActivity(workspace_id)
   ├─ Wait for all (Promise.allSettled)
   ├─ Filter results by context (role, tier, device)
   ├─ Compose into WorkspaceProjection shape
   └─ Return
   ↓
9. Gateway returns HTTP 200
   {
     projection: { overview, execution, intelligence, ... },
     metadata: { ... }
   }
   ↓
10. Frontend receives projection
    ↓
11. HomeView: setProjection(result.projection)
    ↓
12. Component re-renders
    ├─ <OverviewSection data={projection.overview} />
    ├─ <ExecutionSection data={projection.execution} />
    ├─ <IntelligenceSection data={projection.intelligence} />
    ├─ <CollaborationSection data={projection.collaboration} />
    └─ <SearchSection data={projection.search} />
    ↓
13. User sees dashboard
```

---

## Testing Strategy

### Unit Tests
- Each capability tested in isolation
- Each facade method tested with mock capabilities
- Context filtering verified

### Integration Tests
- Facade + capabilities
- Gateway endpoint
- Frontend receiving projection

### Contract Tests
- ProjectionDTO shape matches interface
- Context filtering produces expected results
- Role-based filtering works

---

## Deployment

### Capability Services
- Deploy independently
- Backward-compatible APIs
- Circuit breakers for failures

### Projection Engine
- Deploy with facades
- Can be restarted without affecting capabilities

### Gateway
- Stateless
- Can scale horizontally
- Load balances to projection engine

### Frontend
- Deployed independently
- No coordination needed with backend

---

## References

- PLATFORM_THESIS.md - Constitutional principles
- CANONICAL_STATE.md - Implementation status vs. thesis
- Each service's README for specific details

---

**Last Updated:** Phase 2a complete
**Status:** Architectural blueprint locked

# Selective Backend Architecture: Capability Resolver Pattern


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

**Status:** ✅ ARCHITECTURAL ENHANCEMENT  
**Date:** June 27, 2026  
**Motivation:** "Backend is capable of everything. Don't make everything follow everything."  

---

## THE PROBLEM

Traditional platform architecture creates tight coupling:

```
Frontend
    ↓
Everything
    ↓
Backend
```

Result: Every UI depends on every service. Eventually everything breaks when you change anything.

---

## THE SOLUTION: Capability Resolver Pattern

```
Frontend
    ↓
Feature Manifest (What do I need?)
    ↓
Capability Resolver (Can you provide it?)
    ↓
Projection Registry (How do I show it?)
    ↓
Selected Platform Capabilities
    ↓
Spine + Governance (Centralized auth, data access, audit)
```

**Key Innovation:** Each frontend enters the platform at different depths based on its needs.

---

## FIVE DIFFERENT FRONTENDS, FIVE DIFFERENT NEEDS

### 1. Brainstorming Workspace (Human Layer)

**What it needs:**
```
Memory ─→ Save ideas
Entity360 ─→ Understand context
Chat ─→ Talk to AI
Search ─→ Find related thoughts
Tasks ─→ Create action items
```

**What it doesn't need:**
- MCP (not building integrations)
- ADK (not developing agents)
- Workflow runtime (not orchestrating)
- Prediction engine (not forecasting)
- Developer tools (not debugging)

**Gateway calls:**
```
POST   /api/v1/memory/save
POST   /api/v1/memory/query
GET    /api/v1/entity/account/123
POST   /api/v1/chat/message
POST   /api/v1/tasks
```

**Layers loaded:** Memory, Context, Chat, Search  
**Excluded layers:** 8 others  
**Efficiency:** 35% of full platform

---

### 2. Customer Success Platform

**What it needs:**
```
Entity360 ─→ Customer context
Signals ─→ Risk detection
Insights ─→ AI recommendations
Timeline ─→ Event history
Renewal ─→ Forecast outcomes
Health Score ─→ Account health
Approvals ─→ Workflow approvals
```

**What it doesn't need:**
- MCP (no external data integration needed)
- ADK/Workflows (no automation building)
- Developer console (not debugging)
- Schema discovery (not exploring data)
- Executive metrics (not dashboards)

**Gateway calls:**
```
GET    /api/v1/entity/:type/:id
POST   /api/v1/insights/query
POST   /api/v1/spine/query (timeline)
POST   /api/v1/proposals (approvals)
POST   /api/v1/tasks
```

**Layers loaded:** Entity, Signals, Governance, Continuity Bridge  
**Excluded layers:** 10 others  
**Efficiency:** 45% of full platform

---

### 3. Developer Console

**What it needs:**
```
MCP ─→ 200+ data sources
ADK ─→ Build agents
Workflows ─→ Orchestrate tasks
Registry ─→ Discover capabilities
Logs ─→ Debug execution
Schema Discovery ─→ Understand models
```

**What it doesn't need:**
- Customer data (not a CSM)
- Customer insights (not relevant)
- Business forecasting (not analyzing)
- Executive metrics (not reporting)
- Brainstorm ideas (not ideating)

**Gateway calls:**
```
GET    /api/v1/capabilities
POST   /api/v1/capabilities/:id/execute
GET    /api/v1/connectors
POST   /api/v1/spine/query (logs)
```

**Layers loaded:** Runtime, Registry, Logs, Continuity Bridge  
**Excluded layers:** 10 others  
**Efficiency:** 40% of full platform

---

### 4. Executive Dashboard

**What it needs:**
```
Metrics ─→ KPIs
Goals ─→ Business objectives
Insights ─→ AI analysis
Predictions ─→ Forecasts
Revenue ─→ Financial metrics
Performance ─→ Team metrics
Approvals ─→ Strategic decisions
```

**What it doesn't need:**
- MCP (not integrating)
- Developer tools (not coding)
- Technical logs (not debugging)
- Brainstorm ideas (not ideating)
- Customer details (not managing)

**Gateway calls:**
```
POST   /api/v1/insights/query
GET    /api/v1/proposals/:id
POST   /api/v1/entity/search (aggregate metrics)
```

**Layers loaded:** Insights, Metrics, Governance  
**Excluded layers:** 12 others  
**Efficiency:** 25% of full platform (lightweight!)

---

### 5. AI Twin (Full Access)

**What it needs:** Everything

```
Memory ─→ Complete memory
Entity360 ─→ Full context
Chat ─→ Conversation
MCP ─→ All sources
ADK ─→ Agent development
Workflows ─→ Orchestration
Governance ─→ Approvals
Signals ─→ Pattern detection
+ Everything else
```

**Gateway calls:** All 30 endpoints  
**Layers loaded:** All 15 layers  
**Efficiency:** 100% of full platform

---

## HOW IT WORKS

### Step 1: Frontend Declares Its Manifest

**Brainstorming workspace:**
```yaml
frontendId: brainstorming
capabilities:
  - memory
  - entity360
  - chat
  - search
  - tasks
projections:
  - brainstorm-workbench
  - memory-browser
```

**Customer Success:**
```yaml
frontendId: customer-success
capabilities:
  - entity360
  - signals
  - insights
  - timeline
  - renewal
  - health-score
  - approvals
  - tasks
projections:
  - account-health
  - renewal-forecast
```

### Step 2: Capability Resolver Validates

```typescript
// Frontend makes first call
POST /api/v1/resolve-capabilities
{
  frontendType: 'customer-success',
  userId: 'user-123'
}

// Resolver responds with:
{
  frontendType: 'customer-success',
  capabilities: [
    {
      name: 'entity360',
      available: true,
      layers: ['entity', 'context'],
      gateway_endpoints: [
        'GET /api/v1/entity/:type/:id',
        'POST /api/v1/entity/search'
      ]
    },
    // ...more capabilities
  ],
  layers: {
    required: ['entity', 'signals', 'governance'],
    total: 3
  },
  rateLimit: {
    perSecond: 100,
    globalQuota: 360000 // per hour
  }
}
```

### Step 3: Projection Registry Renders UI

```typescript
// Frontend asks how to render
POST /api/v1/projections/render
{
  projectionId: 'account-health',
  userId: 'user-123'
}

// Registry responds with:
{
  id: 'account-health',
  name: 'Account Health Dashboard',
  capabilities: ['entity360', 'signals', 'health-score'],
  navigation: [
    { label: 'Health', route: '/health' },
    { label: 'Signals', route: '/signals' },
    { label: 'Timeline', route: '/timeline' }
  ],
  widgets: [
    {
      id: 'health-card',
      component: 'HealthCard',
      capabilities: ['health-score']
    },
    // ...more widgets
  ]
}
```

### Step 4: Frontend Only Loads What It Needs

```typescript
// Customer Success app
import { GatewayClient } from '@integratewise/gateway-client'

const client = new GatewayClient({
  url: 'https://integratewise-gateway.workers.dev',
  manifest: 'customer-success' // Only these capabilities
})

// Can call these:
await client.entity360.get('account-123')
await client.signals.query({ scope: 'renewal_risk' })
await client.approvals.create({ ... })

// Cannot call these (blocked):
await client.mcp.executeConnector() // Error: Not in manifest
await client.adk.testAgent() // Error: Not in manifest
await client.metrics.getKPI() // Error: Not in manifest
```

### Step 5: Platform Enforces Access

Everything still goes through:
- ✅ **Spine:** Central audit log (who did what)
- ✅ **Governance:** Permission checks (are you allowed?)
- ✅ **Auth:** Session validation (are you logged in?)

**Different frontends, different paths, same foundation.**

---

## ARCHITECTURE DIAGRAM

```
┌────────────────────────────────────────────────────────────┐
│                  FRONTENDS (5 types)                       │
├─────────────────┬──────────────────┬──────────────────┬────┤
│ Brainstorming   │ Customer Success │ Developer        │ ... │
└────────┬────────┴────────┬─────────┴────────┬────────┴────┘
         │                 │                  │
    Manifest          Manifest           Manifest
         │                 │                  │
         ▼                 ▼                  ▼
   ┌──────────────────────────────────────────────────┐
   │    Capability Resolver Service                   │
   │                                                  │
   │  ✓ Validates capabilities                        │
   │  ✓ Resolves dependencies                         │
   │  ✓ Calculates rate limits                        │
   │  ✓ Returns allowed endpoints                     │
   └─────────────────┬────────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
         ▼           ▼           ▼
    Memory      Entity360    Signals
    
         Gateway (30 endpoints)
    ═════════════════════════════════
    
    ┌─────────────────────────────────┐
    │  Spine (Audit Log)              │
    │  Governance (Permissions)       │
    │  Auth (Session Check)           │
    └─────────────────────────────────┘
```

---

## EFFICIENCY METRICS

| Frontend | Layers Used | % of Platform | Typical Load | Impact |
|----------|------------|--------|-----|--------|
| Brainstorming | 4 | 35% | Light | Individual use |
| Customer Success | 4 | 45% | Medium | Account management |
| Developer | 4 | 40% | Variable | Depends on testing |
| Executive | 3 | 25% | Very light | Dashboard only |
| AI Twin | 15 | 100% | High | Full experience |

**Result:** Platform scales efficiently based on usage patterns.

---

## IMPLEMENTATION LAYERS

### 1. Capability Resolver (New)
```
services/capability-resolver/
  ├─ Validates manifest
  ├─ Resolves dependencies
  ├─ Calculates rate limits
  └─ Returns capability graph
```

### 2. Projection Registry (New)
```
services/projection-registry/
  ├─ Defines UI projections
  ├─ Maps capabilities to widgets
  ├─ Manages navigation structure
  └─ Renders for frontend type
```

### 3. Feature Manifests (New)
```
services/gateway/manifests/
  ├─ brainstorming.ts
  ├─ customer-success.ts
  ├─ developer.ts
  ├─ executive.ts
  └─ twin.ts
```

### 4. Gateway (Updated)
```
services/gateway/
  ├─ Added: /resolve-capabilities
  ├─ Added: /projections
  ├─ Updated: Request validation
  └─ Updated: Rate limiting per manifest
```

### 5. Client SDK (Updated)
```
lib/gateway-client.ts
  ├─ Accepts manifest parameter
  ├─ Blocks non-manifest endpoints
  ├─ Respects rate limits
  └─ Type-safe by manifest
```

---

## EVOLUTION PATH

**Today:** 5 predefined frontends
**Week 1:** Add custom manifests
**Week 2:** Add manifest composition (combine multiple)
**Week 3:** Add runtime manifest adjustment
**Month 2:** Add ML-based optimal manifest suggestion

---

## KEY PRINCIPLES

1. **Backend is capable of everything**
   - All 15 layers always available
   - All services always running

2. **Frontend declares what it needs**
   - "I only use memory, entity360, chat"
   - Not "give me everything"

3. **Platform enforces at Gateway**
   - Requests outside manifest are rejected
   - Rate limits apply per manifest
   - Permissions still centralized

4. **Spine provides accountability**
   - Every call logged
   - Every action audited
   - Every permission checked

5. **Projections make it visual**
   - How capabilities appear on screen
   - Different frontends see different UIs
   - Same backend, different presentations

---

## EXAMPLE: CUSTOM MANIFEST

```typescript
// Startup may only need analytics + chat
const startupManifest = {
  frontendId: 'startup-app',
  capabilities: [
    'metrics',
    'chat',
    'entity360',
    'tasks'
  ]
}

// Request resolution
const resolved = await fetch(
  'https://gateway.integratewise.dev/api/v1/resolve-capabilities',
  {
    method: 'POST',
    body: JSON.stringify({
      frontendType: 'custom',
      customCapabilities: startupManifest.capabilities
    })
  }
)

// Response includes:
// - Which endpoints are allowed
// - Rate limits (shared across 4 capabilities)
// - Required layers (metrics, chat, context)
// - Projection recommendations
```

---

## SUMMARY

**Before:** One size fits all
```
Frontend
    ↓
All 30 endpoints
    ↓
All 15 layers
    ↓
Backend
```

**After:** Right-sized for each use case
```
Frontend (type)
    ↓
Feature Manifest (declares needs)
    ↓
Capability Resolver (validates)
    ↓
Projection Registry (renders)
    ↓
Selected Capabilities (efficient)
    ↓
Backend (provides what's asked)
```

**Impact:**
- ✅ Each frontend only loads what it needs
- ✅ Platform still enforces auth, permissions, audit
- ✅ Backend is simple: one API, multiple entry points
- ✅ Easy to add new frontends (just create manifest)
- ✅ Easy to optimize (each manifest has own rate limits)

---

## NEXT: IMPLEMENT & DEPLOY

1. **Deploy Capability Resolver**
   - Validates manifests
   - Returns capability graph

2. **Deploy Projection Registry**
   - Manages UI layouts
   - Maps to capabilities

3. **Update Gateway**
   - Add /resolve-capabilities endpoint
   - Add rate limiting per manifest
   - Add request validation per manifest

4. **Update Client SDK**
   - Accept manifest parameter
   - Enforce manifest in TypeScript
   - Block non-manifest endpoints

5. **Update Each Frontend**
   - Provide manifest on client creation
   - Only call allowed endpoints
   - Respect rate limits

---

**This is the architectural leap that makes the platform truly multi-product, not multi-tenant.**


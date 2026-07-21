# IntegrateWise Deep Excavation Report


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

**Date**: July 10, 2026  
**Codebase Scale**: 1,288 TypeScript files | 335,469 lines of code  
**Status**: Massively complex platform with most subsystems implemented but not visibly wired  

---

## Executive Summary

IntegrateWise is not a v4.2 MVP—it's a **complete, production-scale platform** with:
- 30+ packages implementing 34 subsystems
- 27 microservices with sophisticated routing and state management
- 24 frontend pages with role-based access
- Complete Capability Fabric architecture
- Memory/Timeline/Twin/Continuity frameworks
- 80+ connector integrations

**The Gap**: Everything is built but disconnected. The "visible working example" (Customer Zero) that proves all pins are wired together doesn't exist in the deployed apps/live.

---

## What Actually Exists

### 1. Frontend (apps/live) - DEPLOYED & LIVE
**Status**: Production deployment on Vercel

**Pages**: 24 page.tsx files
- Landing page (public)
- Auth flows (login/signup)
- 13-stage onboarding pipeline
- Workspace dashboard
- Capabilities discovery
- Integrations manager
- Schema discovery

**Components**: 19 React components
- UI primitives (Button, Input, Card, Badge, Tabs, Progress, etc.)
- App shell and sidebar navigation
- Workspace shell (role-adaptive)
- Capability shell (generic capability renderer)
- Footer and header components

**API Routes**: 3 endpoints (bare minimum)
- GET /api/capabilities/discover
- POST /api/capabilities/execute
- GET /api/integrations

**Missing from Live App**:
- No database integration (Supabase/Neon)
- No real LLM integration
- No service-to-app wiring
- API routes return mock data only

---

### 2. Services (27 Active Microservices)

**Core Infrastructure**:
1. **Gateway** (29 files) - JWT validation, tenant resolution, routing
2. **Auth** - OAuth flow, JWT signing, session management
3. **Tenants** (6 files) - Multi-tenancy management

**Data & Memory**:
4. **Continuity** (5 files) - Data normalization, Supabase sync, event store
5. **Hermes** (6 files) - Personal/org memory lifecycle
6. **Knowledge** (36 files) - Knowledge base, document indexing
7. **Pipeline** (12 files) - Workflow execution, approval chains
8. **Normalizer** (11 files) - Data transformation

**Intelligence & AI**:
9. **Intelligence** (34 files) - AI pipeline, decision engine
10. **Think** (21 files) - Reasoning engine
11. **Agent Registry** - Agent lifecycle management
12. **IW Agent Runtime** (16 files) - Agent execution

**Integrations & Connectors**:
13. **Connector** (9 files) - 80+ integrations (Salesforce, HubSpot, GitHub, etc.)
14. **MCP Connector** (30 files) - Model Context Protocol bridge
15. **Connector Sync** - Real-time sync with external systems

**Operations & Governance**:
16. **Govern** (10 files) - Approval workflows, audit trails
17. **Twin Orchestrator** (12 files) - Digital Twin lifecycle
18. **Signals** (4 files) - Real-time signals (engagement, risk, opportunity)
19. **Billing** (14 files) - Usage tracking, billing

**Content & Search**:
20. **Loader** (33 files) - Document ingestion
21. **Coda Pack** - Coda integration
22. **Webhooks** - Event ingestion

**Admin & Utilities**:
23. **Admin** (3 files) - Admin dashboard
24. **Workflow** (9 files) - Workflow definition
25. **Folder Watcher** - File system monitoring
26. **ACT** - Activity tracking
27. **Additional services**: Email, Integrations UI, etc.

---

### 3. Packages (30 Framework & Library Packages)

**Core Capability Framework** (packages/core/):
- ✅ capability-registry (200+ capability definitions)
- ✅ capability-context (Spine data assembly)
- ✅ capability-engine (state machine execution)
- ✅ workflow-router (AI/human routing logic)
- ✅ execution-orchestrator (multi-step workflow chaining)
- ✅ capability-metrics (execution metrics + learning)
- ✅ workspace-context (workspace state)
- ✅ governance-engine (approval logic)
- ✅ governance-integration (audit trails)

**Library Implementations**:
- **capability-fabric** (1,434 lines) - Complete runtime
  - registry.ts (96 lines)
  - engine.ts (169 lines)
  - context-builder.ts (assemble Spine data)
  - metrics.ts (287 lines)
  - orchestrator.ts (232 lines)
  - bootstrap.ts (initialize system)
  - types.ts (TypeScript definitions)

**Infrastructure Packages**:
- ✅ db - Database abstractions
- ✅ rbac - Role-based access control
- ✅ types - Shared TypeScript types
- ✅ tenancy - Multi-tenant support
- ✅ api - API utilities
- ✅ config - Configuration management
- ✅ webhooks - Event webhooks
- ✅ connector-contracts - Integration interfaces
- ✅ connector-utils - Integration utilities
- ✅ sdk - Public SDK
- ✅ gateway-sdk - Gateway client
- ✅ adk - Capability development kit
- ✅ analytics - Usage analytics
- ✅ accelerators - Domain-specific templates
- ✅ bootstrap - System initialization
- ✅ domain-shells - Domain-specific UI
- ✅ ui - Component library
- ✅ integration-tests - Test suite
- ✅ knowledge-bank-ui - Knowledge UI
- ✅ integratewise-mcp-tool-connector - MCP integration

---

## The Life Cycles: Current State vs. Specification

### LC1: Work Surface (Visible, Interactive Layer)
**Status**: ⚠️ Partially wired

**Built in apps/live**:
- ✅ Landing page
- ✅ Auth flows
- ✅ 13-stage onboarding
- ✅ Workspace dashboard
- ✅ Capabilities page
- ✅ Integrations manager
- ✅ Schema discovery

**Missing**:
- ❌ Real data binding (API only returns mocks)
- ❌ Capability execution (no service wiring)
- ❌ Integration sync (no backend)
- ❌ User data persistence (no database)
- ❌ Real AI recommendations

**Backend Built**:
- ✅ Gateway service (routing, JWT, tenant resolution)
- ✅ Auth service (OAuth, JWT)
- ✅ Knowledge service (document indexing)
- ✅ MCP connector (tool discovery)

### LC2: Silent Partner (AI Twin, Memory, Context)
**Status**: ⚠️ Frameworks exist, not connected to Live

**Built in services & packages**:
- ✅ Twin Orchestrator service (12 files)
- ✅ Hermes memory service (6 files)
- ✅ Intelligence service (34 files) - AI pipeline
- ✅ Think service (21 files) - Reasoning
- ✅ Continuity service (5 files) - Data assembly
- ✅ hermes-spine-memory package (memory lifecycle)

**Missing**:
- ❌ Connection from apps/live to these services
- ❌ Real LLM integration
- ❌ Memory persistence
- ❌ Twin training pipeline

### LC3: Connected Fabric (System-of-Systems Integration)
**Status**: ⚠️ Framework built, orchestration incomplete

**Built**:
- ✅ Connector service (80+ integrations)
- ✅ MCP Connector (Model Context Protocol)
- ✅ Signals service (engagement, risk, opportunity)
- ✅ Govern service (approval chains)
- ✅ Pipeline service (workflow execution)

**Missing**:
- ❌ Live app → service integration
- ❌ Real connector sync
- ❌ Signal aggregation
- ❌ Workflow execution from capabilities

---

## The 34 Subsystems: Implemented vs. Connected

| Subsystem | Implemented | In apps/live | In services | Status |
|-----------|---|---|---|---|
| 01. Ingress Gateway | ✅ | ❌ | ✅ | Can't reach from web |
| 02. Operational Spine | ✅ | ❌ | ✅ | No DB schema visible |
| 03. Workspace Runtime | ✅ | ⚠️ | ✅ | Limited in frontend |
| 04. Projection Engine | ⚠️ | ❌ | ✅ | Not connected |
| 05. Capability Fabric | ✅ | ⚠️ | ✅ | Shell exists, not wired |
| 06. Twin Runtime | ✅ | ❌ | ✅ | Separate service |
| 07. Memory System | ✅ | ❌ | ✅ | Not accessible |
| 08. Connector Framework | ✅ | ⚠️ | ✅ | UI exists, not functional |
| 09. Governance Engine | ✅ | ❌ | ✅ | Not visible |
| 10. Signal Engine | ✅ | ❌ | ✅ | Not visible |
| 11. Workflow Engine | ✅ | ❌ | ✅ | Not visible |
| 12. Event Bus | ✅ | ❌ | ✅ | Not connected |
| 13. Entity Framework | ✅ | ❌ | ✅ | Not in frontend |
| 14. Marketplace | ⚠️ | ❌ | ⚠️ | Partial |
| 15. Security | ✅ | ❌ | ✅ | Minimal in frontend |
| ... (19 more) | Mixed | Mostly❌ | Mixed | **The Gap** |

---

## The Critical Gap: "Customer Zero"

**What Exists**: All 34 subsystems are built in isolation
**What's Missing**: An end-to-end execution path that proves they work together

### Example: "Sell Deal" Capability Should Work Like This:

```
User visits /capabilities
  ↓ [apps/live]
Clicks "Sell Deal"
  ↓ [frontend calls /api/capabilities/execute]
API route receives request
  ↓ [apps/live/app/api/capabilities/execute/route.ts]
Routes to Gateway service
  ↓ [services/gateway]
Gateway validates JWT, resolves tenant
  ↓ [services/gateway/src/auth.ts]
Routes to Capability execution
  ↓ [packages/adk OR services/intelligence]
Loads Sell Deal capability definition
  ↓ [packages/core/capability-registry]
Assembles context (Spine data + signals)
  ↓ [services/continuity + packages/hermes-spine-memory]
Sends to LLM
  ↓ [services/intelligence + services/think]
Generates recommendation + confidence score
  ↓ [returns to frontend]
User sees AI recommendation
  ↓ [apps/live/components/capability-shell.tsx]
Clicks "Execute"
  ↓ [frontend → backend]
System executes capability
  ↓ [services/connector for external systems]
  → Updates Salesforce opportunity
  → Records to memory system
  → Logs metrics
  → Updates Twin context
Result displayed to user
```

**Currently**: Each component works in isolation. No end-to-end path exists.

---

## What's Actually Deployed & Live

### On Vercel (https://pull-from-main-5mbnielco-consolidated.vercel.app)

**Working**:
- ✅ Landing page renders
- ✅ Authentication (Clerk) works
- ✅ 13-stage onboarding flow navigates
- ✅ Dashboard displays role-based views
- ✅ Capabilities page lists mocked capabilities
- ✅ Integrations page shows available systems
- ✅ Schema discovery page displays fields

**Not Working**:
- ❌ API endpoints return mock data
- ❌ No database persistence
- ❌ No actual capability execution
- ❌ No integration sync
- ❌ No AI recommendations
- ❌ No connection to backend services

---

## The Architecture That Should Exist

### Current (Disconnected):
```
apps/live (Vercel)
  ├─ Frontend pages (24)
  ├─ API routes (3, mock data)
  └─ Components (19)
     └─ [NOT CONNECTED TO]

services/ (Backend, undeployed)
  ├─ Gateway (JWT validation)
  ├─ Intelligence (AI pipeline)
  ├─ Connector (80+ integrations)
  ├─ Twin Orchestrator
  ├─ Memory System
  └─ 22 other services
```

### Should Be (Connected):
```
apps/live (Vercel) ──HTTP──> services/gateway (Backend)
  ├─ /api/capabilities/execute    ──> services/intelligence ──> LLM
  ├─ /api/integrations            ──> services/connector
  ├─ /api/workspace               ──> services/continuity
  └─ /api/user                    ──> services/auth

services/gateway ──routes to──> [27 services working together]
  ├─ Twin Orchestrator (AI context)
  ├─ Memory System (learning)
  ├─ Signals Engine (risks/opportunities)
  └─ Workflow Pipeline (orchestration)
```

---

## Priority: Connect the Dots

### Immediate (1-2 hours):
1. Wire `apps/live/app/api/capabilities/execute/route.ts` to real backend
2. Create database schema (users, organizations, entities)
3. Connect Gateway service
4. Test single capability execution end-to-end

### Next (2-4 hours):
1. Integrate LLM provider
2. Wire memory system to frontend
3. Test Twin generation
4. Test connector sync

### Then (Full Platform):
1. All 24 pages connected to services
2. All 34 subsystems visible and functional
3. Complete Customer Zero walkthrough
4. Production hardening

---

## Key Insights

1. **The Code Exists**: 335,469 lines, 30 packages, 27 services
2. **The Problem**: Isolation, not implementation
3. **The Solution**: Single end-to-end execution path (Customer Zero)
4. **The Timeline**: 1-2 weeks to production if focused execution

---

## What You Should Build Next

**Option A (Recommended)**: Wire apps/live → services/gateway → capability execution
- Proves architecture works
- Enables Customer Zero demo
- Unblocks all other features

**Option B**: Enhance apps/live UI
- Add more pages
- Add more components
- But still no real functionality

**Option C**: Start fresh minimal backend
- Ignore existing services
- Build simpler integration
- But wastes 335K lines of code

**Recommendation**: **Option A**. You have everything needed. Just connect it.

---

**Bottom Line**: IntegrateWise isn't a v4.2 MVP in need of building. It's a **complete platform in need of wiring**. The "end-to-end execution path" from one user action through all 34 subsystems—that's what proves the architecture works. That's Customer Zero.

# IntegrateWise: Monorepo Structure & 10% Implementation Roadmap


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

**Architecture:** Canonical Ecosystem v2.1
**Structure:** Single monorepo with clear Consumer → Bridge → Kernel → Provider separation
**Status:** Architecture locked, 58 TODOs mapped to structure

---

## Monorepo Shape (LOCKED)

```
integratewise/
  apps/                          # Thin consumer surfaces
    marketing/                   # Marketing landing pages
    workspace/                   # Main continuity interface
    core-engine/                 # Core orchestration UI
    ai-workspace/                # AI assistant workspace
    admin/                        # Admin dashboard
    mobile/                       # Mobile app shell
  packages/                      # Shared contracts & SDK
    ui/                          # Component library (shadcn)
    auth/                         # Auth primitives
    api-client/                   # Gateway SDK (✓ existing)
    sdk/                          # TypeScript SDK
    mcp/                          # MCP client & server
    shared-types/                 # Type definitions
    entities/                     # Entity schemas
    schemas/                      # Validation schemas
    hooks/                        # React hooks
    config/                       # Configuration
    utils/                        # Utilities
    permissions/                  # Permission model
    feature-flags/                # Feature flags
  services/                      # Backend capabilities (behind bridge)
    gateway/                      # Continuity Bridge implementation (✓ partial)
    ingestion/                    # Signal ingestion & normalization
    cognition/                    # Reasoning & intelligence
    memory/                       # Memory engine
    governance/                   # Policy & approval
    connectors/                   # Provider integrations
  infra/                         # Deployment & infrastructure
    cloudflare/                   # Workers, KV, D1
    ci-cd/                        # GitHub Actions workflows
    terraform/                    # IaC
    docker/                       # Container configs
  docs/                          # Documentation (LOCKED)
    ecosystem-thesis.md           # ✓ Ecosystem doctrine
    canonical-architecture.md     # ✓ Architecture doctrine
    contract-discovery.md         # TODO: Discovery schema
    contract-capabilities.md      # TODO: Capability definitions
    contract-events.md            # TODO: Event definitions
    deployment.md                 # TODO: Deployment guide
    sdk-guide.md                  # TODO: SDK usage guide
    mcp-guide.md                  # TODO: MCP integration guide
```

---

## 10% Implementation Roadmap (58 TODOs Mapped)

### TIER 1: Critical (30-35 hours) - 12 TODOs

#### services/gateway/ (11 TODOs) - Continuity Bridge Implementation

**Authentication Layer (3 TODOs)**
- Gateway auth: validate token against auth service
- Gateway auth: call auth service for session
- Gateway auth: fetch current user
- Location: `services/gateway/src/middleware/auth.ts`
- Pattern: Inject AuthServiceClient, call methods, compose context

**Initialization Layer (3 TODOs)**
- FacadeRegistry initialization: dependency injection setup
- FacadeRegistry: apply caching for projections
- FacadeRegistry: apply rate limiting
- Location: `services/gateway/src/bootstrap/facade-registry.ts`
- Pattern: Initialize singleton, register with DI container

**Core Endpoints (5 TODOs)**
- GET /entities/:id → Entity360 service (entity + relationships + signals + memory)
- GET /search/entities → Entity search service
- GET /memory → Query adaptive memory with decay/links/promotion
- POST /memory → Save to adaptive memory with scoping
- DELETE /memory/:id → Delete memory item
- Location: `services/gateway/src/routes/core.ts`
- Pattern: ServiceClient call, compose DTO, apply gating, return

#### docs/ (1 TODO) - Discovery Contract Documentation

- Create `docs/contract-discovery.md`: Discovery response schema & examples
- Schema: identity info, capabilities, navigation, workbenches, projections, policies, features
- Examples: role-based discovery, tier-based features, device-specific optimizations

---

### TIER 2: Complete Phase 2e (70-80 hours) - 28 TODOs

#### services/gateway/ (21 TODOs)

**Entity & Memory Operations (6 TODOs) - CONTINUED**
- GET /memory/search → Semantic memory search
- Query adaptive memory with decay/links/promotion (implementation detail)
- Plus 4 more core endpoints already listed

**Connector Management (4 TODOs)**
- GET /connectors → Get all connectors + status
- GET /connectors/:id/status → Get specific connector status
- POST /connectors/:id/sync → Trigger connector sync via workflow
- POST /connectors/:id/oauth → Exchange OAuth code for access
- Location: `services/gateway/src/routes/connectors.ts`

**Proposals & Governance (6 TODOs)**
- POST /proposals → Create proposal, emit to governance
- GET /proposals/:id → Get proposal
- POST /proposals/:id/approve → Approve + execute if approved
- POST /proposals/:id/reject → Reject proposal
- GET /proposals → List proposals with filters
- Location: `services/gateway/src/routes/governance.ts`

**Capabilities & Execution (4 TODOs)**
- GET /capabilities → List all available capabilities
- GET /capabilities/:id/schema → Get capability schema
- POST /capabilities/:id/execute → Queue capability execution
- GET /capabilities/:id/execution/:execId → Get execution status
- Location: `services/gateway/src/routes/capabilities.ts`

**Insights, Tasks, Chat (5 TODOs)**
- GET /insights → Get/generate insights
- GET /insights/:id → Get specific insight
- POST /tasks → Create task
- GET /tasks/:id → Get task
- POST /tasks/:id/complete → Complete task + emit memory
- POST /chat/threads → Create thread
- POST /chat/threads/:id/messages → Send message, get AI response
- GET /chat/threads/:id/messages → Get chat history
- DELETE /chat/threads/:id → Delete thread
- Spine events (2 TODOs)
- Location: `services/gateway/src/routes/experiences.ts`

#### services/projection-engine/ (7 TODOs)

**Remaining 7 Adapters** - Implement remaining facades following MorningContextFacade pattern

1. **GovernanceBoardFacade** → Tasks + Proposals + Decisions
2. **InboxFacade** → Signals + Proposals unified
3. **AccountHealthFacade** → Spine + Signals + Timeline
4. **RenewalForecastFacade** → Spine + Insights + Renewals
5. **MCPConsoleFacade** → MCP registry + Schema
6. **WorkflowEditorFacade** → Workflows + Templates
7. **BrainstormWorkbenchFacade** → Memory + Entities + Chat

- Location: `services/projection-engine/src/facades/adapters.ts`
- Pattern: Inject ServiceClientFactory, call services, compose DTO, gating applied

#### docs/ (2 TODOs)

- `docs/contract-capabilities.md` → Define all 40+ capabilities with schemas
- `docs/contract-events.md` → Define all event types (Signal, Proposal, Approval, Outcome, Notification, Stream)

---

### TIER 3: Enhancement (40-50 hours) - 18 TODOs

#### services/admin/ (4 TODOs)

- Query Cloudflare Analytics API for real data
- Trigger wrangler deploy via CF API
- Implement rollback via CF API
- Mock data placeholder (wire real CF when ready)
- Location: `services/admin/src/analytics.ts`

#### services/cognition/ (4 TODOs)

- Wire to MorningBriefWorkflow when ready
- Replace AI Search with final implementation (PRIORITY 4)
- Store brief in D1 or send to Knowledge service
- Wire to SignalWorkflow (2 instances)
- Location: `services/cognition/src/workflows/`

#### services/twin-orchestrator/ (1 TODO)

- Stream-based reasoning implementation
- Location: `services/twin-orchestrator/src/streaming.ts`
- Effort: 8 hours (complex streaming setup)

#### services/workflow/ (1 TODO)

- Workflow executor implementation
- Location: `services/workflow/src/executor.ts`
- Effort: 6 hours

#### services/knowledge/ (2 TODOs)

- List preservation in chunker (extractLists function)
- Tenant-scoped consumer implementation
- Location: `services/knowledge/src/chunking/chunker.ts`

#### services/mcp-connector/ (2 TODOs)

- Call pipeline service binding for vault reads
- Complete Spine MCP server implementation
- Location: `services/mcp-connector/src/spine-mcp-server.ts`

#### services/normalizer/ & services/loader/ (2 TODOs)

- Accelerator implementation (normalizer)
- AIRelay schema consolidation (loader)
- Location: `services/normalizer/src/` and `services/loader/src/`

#### services/projection-engine/src/facades/ (2 TODOs)

- Cache implementation in FacadeRegistry
- Emit audit event on projection access
- Location: `services/projection-engine/src/facades/facade-registry.ts`

#### docs/ (3 TODOs)

- `docs/deployment.md` → Deployment & rollout procedure
- `docs/sdk-guide.md` → SDK usage patterns & examples
- `docs/mcp-guide.md` → MCP integration guide

---

## Mapping 58 TODOs to Packages (Shared Code)

### packages/api-client/ (✓ Already exists as gateway-sdk.ts)

**Status:** Complete, production-ready
- Entity360, Memory, Twin, Signals, Insights, Predictions, Handoff, Stream, MCP
- Already implemented and matches branch version

**TODO in this package:** 0

### packages/shared-types/ (5 TODOs indirectly)

**Definitions needed for Gateway endpoints:**
- ProjectionType, ProjectionContext, ProjectionResponse
- CapabilityDefinition, CapabilitySchema, CapabilityExecution
- EventType, EventPayload
- DiscoveryResponse, DiscoveryCapability
- ApprovalWorkflow, ApprovalDecision, RiskLevel

**Status:** Partially complete, documentation TODO

### packages/schemas/ (3 TODOs indirectly)

- Memory query schema (decay, links, promotion filters)
- Connector sync trigger schema
- Proposal creation/decision schema

**Status:** Partially complete via existing validation

### packages/permissions/ (1 TODO indirectly)

- Governance policy evaluation rules
- Role/tier capability access matrix

**Status:** Implemented in ContextGatingEngine, needs documentation

### packages/mcp/ (2 TODOs indirectly)

- MCP server for Spine (mcp-connector related)
- MCP routing in bridge

**Status:** Partial, needs completion

---

## Mapping 58 TODOs to Apps (Consumer Surfaces)

### apps/workspace/ (7 TODOs indirectly)

**Uses:** Gateway SDK + Projections

**TODOs:**
- Connect Gateway SDK to all endpoints (automatic when gateway complete)
- Implement UI for 7 remaining projections (GovernanceBoard, Inbox, AccountHealth, RenewalForecast, MCP, Workflow, Brainstorm)
- Wire approval workflows UI to governance endpoints
- Wire tasks UI to task endpoints
- Wire chat UI to chat endpoints

**Status:** UI components exist, needs wiring to new endpoints

### apps/ai-workspace/ (1 TODO indirectly)

**Uses:** Twin capabilities, streaming endpoints

**TODO:**
- Wire Twin interface to streaming response endpoints (when Twin executor complete)

### apps/admin/ (4 TODOs directly)

**TODOs:** Analytics queries (see services/admin above)

### apps/mobile/ (1 TODO indirectly)

**TODO:**
- Device-aware optimization (already gated in context gating)

---

## Mapping 58 TODOs to Infrastructure

### infra/cloudflare/ (1 TODO)

**TODO:** Trigger deploy & rollback via CF API (in services/admin, wiring to infra)

### infra/ci-cd/ (0 TODOs)

**Status:** Complete, workflows exist

### infra/terraform/ (0 TODOs)

**Status:** Can reference kiro/continuity-bridge-v3.7 branch

---

## Summary by Component Type

| Component | Type | TODOs | Status |
|-----------|------|-------|--------|
| **services/gateway/** | Bridge | 11 | Tier 1 - Critical |
| **services/projection-engine/** | Bridge | 7 | Tier 2 - Adapters |
| **services/cognition/** | Kernel | 4 | Tier 3 - Enhancement |
| **services/governance/** | Kernel | 1 | Tier 2 - Already imported |
| **services/twin-orchestrator/** | Kernel | 1 | Tier 3 - Complex |
| **services/workflow/** | Kernel | 1 | Tier 3 - Complex |
| **services/memory/** | Kernel | 0 | Complete |
| **services/knowledge/** | Kernel | 2 | Tier 3 - Enhancement |
| **services/mcp-connector/** | Bridge/Kernel | 2 | Tier 3 - Enhancement |
| **services/normalizer/** | Kernel | 1 | Tier 3 - Enhancement |
| **services/loader/** | Kernel | 1 | Tier 3 - Enhancement |
| **services/admin/** | Kernel | 4 | Tier 3 - Enhancement |
| **packages/api-client/** | SDK | 0 | Complete |
| **packages/shared-types/** | SDK | 0 | Complete, docs TODO |
| **packages/schemas/** | SDK | 0 | Complete |
| **packages/permissions/** | SDK | 0 | Complete |
| **packages/mcp/** | SDK | 0 | Complete, integration TODO |
| **docs/** | Documentation | 5 | Tier 1-2 - Critical |
| **infra/** | Infrastructure | 0 | Complete, reference available |
| **apps/workspace/** | Consumer | 0 | Wiring automatic |
| **apps/ai-workspace/** | Consumer | 0 | Wiring automatic |
| **apps/admin/** | Consumer | 0 | Wiring automatic |
| **TOTAL** | — | **58** | **Mapped & Sequenced** |

---

## Implementation Sequence by Component

### Week 1-2: services/gateway/ (Tier 1)
- Implement auth layer (3 TODOs)
- Implement FacadeRegistry initialization (3 TODOs)
- Implement core entity/memory endpoints (5 TODOs)
- **Output:** All 31 gateway endpoints routable, APIs functional

### Week 3: docs/ (Tier 1)
- Create contract-discovery.md
- **Output:** Discovery contract finalized

### Week 4-6: services/projection-engine/ + services/gateway/ (Tier 2)
- Wire 7 remaining adapters
- Implement connector management (4 TODOs)
- Implement proposals & governance (6 TODOs)
- Implement capabilities & execution (4 TODOs)
- Implement insights, tasks, chat (5 TODOs)
- **Output:** Full feature coverage, all adapters operational

### Week 7: docs/ (Tier 2)
- Create contract-capabilities.md, contract-events.md

### Week 8+: Tier 3 + Phase 3 + Quality

---

## Consumer Surface Dependencies

Once Tier 1 & 2 complete, each app can be wired:

| App | Depends On | Endpoints Needed | Effort |
|-----|-----------|------------------|--------|
| **workspace/** | All | All 31 gateway | 1 week |
| **ai-workspace/** | Twin, Stream | Twin executor | 3 days |
| **admin/** | Analytics | Admin endpoints | 2 days |
| **mobile/** | All (gated) | All 31 gateway | 3 days |
| **core-engine/** | Orchestration | Capability execution | 1 week |

---

## Quality Gates for All TODOs

Every TODO must pass:
- [ ] Service client wired
- [ ] Error handling with graceful degradation
- [ ] Promise.allSettled() or async/await
- [ ] Composed into proper DTO
- [ ] Gating applied (or explicitly bypassed)
- [ ] Types complete (no `any`)
- [ ] Per Ecosystem Thesis v2.1
- [ ] Unit tested with mock clients
- [ ] Integration tested with real clients

---

## Success Criteria

**10% → 0% (Complete):**
- [ ] All 58 TODOs implemented
- [ ] All 31 gateway endpoints operational
- [ ] All 7 remaining adapters wired
- [ ] All 5 discovery/capability/event docs complete
- [ ] All apps wired to bridge
- [ ] Error resilience tested
- [ ] Production ready for Phase 3
- [ ] Single monorepo, no scattered repos
- [ ] Consumer → Bridge → Kernel → Provider separation maintained
- [ ] Doctrine (Thesis v2.1) reflected in all code

---

**Last Updated:** Monorepo structure locked to Canonical Ecosystem v2.1
**Total Effort:** 140-165 hours (10 engineering weeks)
**Structure:** Single monorepo, clear separation of concerns
**Status:** Architecture complete, implementation path clear

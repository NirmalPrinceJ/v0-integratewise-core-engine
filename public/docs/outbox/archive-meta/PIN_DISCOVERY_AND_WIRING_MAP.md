# IntegrateWise: Pin Discovery & Wiring Map

> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

## The Situation: 1000+ Commits, All Pins Exist

Every pin already exists in the codebase. The 12 frameworks are implemented across 1000+ commits across services, packages, and apps.

**What's Missing**: A visible, working **Customer Zero** that proves everything is wired and discoverable.

---

## Pin Inventory (What Exists)

### Layer 1: Entry Points (Ingress Frameworks)

**Gateway Service** (`services/gateway/src/`)

- ✅ JWT validation (`lib/jwt.ts`)
- ✅ Tenant resolution
- ✅ Customer Zero provisioning (`customer-zero.ts`)
- ✅ CORS + Rate limiting
- ✅ Routing table to all downstream services
- **Pin**: Gateway.handle(request) → routes to all frameworks
- **Already wired to**: 7 downstream services (Connector, Pipeline, Intelligence, Knowledge, BFF, L2, Agent Runtime)

**Auth Framework** (`services/gateway/src/auth.ts`)

- ✅ OAuth flow
- ✅ JWT signing/verification
- ✅ Session management via KV
- **Pin**: Auth.authenticate(credentials) → returns JWT + tenant context

---

### Layer 2: Capabilities Frameworks

**Capability Framework (ADK)** (`packages/adk/`)

- ✅ Tool registry
- ✅ Skill registry
- ✅ Capability execution runtime
- **Pin**: ADK.execute(capabilityId, context) → executes capability

**Connector Service** (`services/connector/src/`)

- ✅ 80+ integrations (Salesforce, HubSpot, GitHub, etc.)
- ✅ OAuth handling
- ✅ MCP connector bridge
- **Pin**: Connector.invoke(integration, method, params) → executes on external system

**MCP Connector** (`services/mcp-connector/`)

- ✅ Model Context Protocol server
- ✅ Tool discovery
- ✅ MCP transport (SSE)
- **Pin**: MCP.listTools() → returns available tools

**Pipeline Service** (`services/pipeline/src/`)

- ✅ Workflow execution
- ✅ Approval chains
- ✅ State management
- **Pin**: Pipeline.execute(workflow) → executes workflow with approvals

---

### Layer 3: Continuity & Context Frameworks (The Moat)

**Continuity Service** (`services/continuity/src/`)

- ✅ Continuity assembler (normalizes data from sources)
- ✅ Supabase integration (data sync)
- ✅ Event store
- **Pin**: Continuity.assemble(workspace) → returns normalized org view
- **Feeds**: Memory, Context, Entity Graph

**Memory Framework** (`packages/hermes-spine-memory/`)

- ✅ Personal memory
- ✅ Org memory
- ✅ AI memory lifecycle
- **Pin**: Memory.record(interaction) → records to continuity
- **Pin**: Memory.retrieve(query) → retrieves user/org context

**Context Framework**

- ✅ Entity360 (full entity context)
- ✅ Timeline (interaction history)
- ✅ Awareness profiles
- **Pin**: Context.assemble(entity) → returns rich context for decision-making

**Knowledge Service** (`services/knowledge/src/`)

- ✅ Doc ingestion + search
- ✅ Embedding generation
- ✅ Schema AI (proposes entity mappings)
- **Pin**: Knowledge.search(query) → returns relevant docs
- **Pin**: Knowledge.proposeSchema(entity) → suggests entity structure

---

### Layer 4: Intelligence Frameworks

**Intelligence Service** (`services/intelligence/src/`)

- ✅ LLM orchestration (multiple models)
- ✅ Agent orchestration
- ✅ Reasoning loops
- **Pin**: Intelligence.reason(context) → returns decision/plan
- **Pin**: Intelligence.executeAgent(agent, task) → runs agent with tools

**Twin Service** (`services/twin-orchestrator/`)

- ✅ User twins (digital representation)
- ✅ Org twins
- ✅ Agent twins
- ✅ Durable Objects for state
- **Pin**: Twin.handoff(request, context) → delegates to user's twin
- **Pin**: Twin.sync(userData) → keeps twin in sync

**Action Loop** (`services/intelligence/src/action-loop.ts`)

- ✅ OODA implementation
- ✅ Tool calling
- ✅ Feedback integration
- **Pin**: ActionLoop.observe(data) → captures observation
- **Pin**: ActionLoop.act(decision) → executes action + records outcome

**Think Service** (`services/think/`)

- ✅ Planning
- ✅ Reasoning chains
- ✅ Multi-step orchestration
- **Pin**: Think.plan(goal) → creates multi-step plan

**Govern Service** (`services/govern/`)

- ✅ Policy evaluation
- ✅ RBAC enforcement
- ✅ Approval workflows
- **Pin**: Govern.canAccess(user, resource) → returns access decision
- **Pin**: Govern.requestApproval(request) → starts approval chain

---

### Layer 5: Networking & Collaboration Framework

**Signals Service** (`services/signals/`)

- ✅ Event sourcing
- ✅ Signal broadcasting
- ✅ Learning feedback loops
- **Pin**: Signals.record(event) → records to event stream
- **Pin**: Signals.broadcast(event) → publishes to subscribers

**Webhook Ingress** (`services/webhook-ingress/`)

- ✅ Webhook verification
- ✅ Real-time routing
- ✅ Event broadcasting
- **Pin**: WebhookIngress.handleWebhook(source, payload) → publishes event

**Store Service** (`services/store/`)

- ✅ Workspace state management
- ✅ Shared storage for all services
- **Pin**: Store.get(key) → retrieves workspace state
- **Pin**: Store.set(key, value) → updates workspace state

---

### Layer 6: Data Access & Governance

**RBAC Package** (`packages/rbac/`)

- ✅ Role-based access control
- ✅ Resource-level permissions
- ✅ Team-level authorization
- **Pin**: RBAC.hasPermission(user, action, resource) → returns bool

**Tenancy Package** (`packages/tenancy/`)

- ✅ Multi-tenant data isolation
- ✅ Tenant context resolution
- ✅ Database schema per tenant
- **Pin**: Tenancy.resolveContext(request) → returns tenant context

**Tenants Service** (`services/tenants/`)

- ✅ Tenant provisioning
- ✅ Workspace creation
- ✅ Billing integration
- **Pin**: Tenants.provision(orgData) → creates new workspace

---

### Layer 7: SDK (API Contracts)

**@integratewise/sdk** (`packages/sdk/`)

- ✅ Accounts client
- ✅ Capability client
- ✅ Contracts
- ✅ Memory client
- ✅ Proposals client
- **Exports**:
  - `SDK.authenticate()`
  - `SDK.executeCapability()`
  - `SDK.recordMemory()`
  - `SDK.getContext()`
  - `SDK.propose()`

**@integratewise/types** (`packages/types/`)

- ✅ TypeScript contracts
- ✅ Domain models
- ✅ API schemas

**@integratewise/adk** (`packages/adk/`)

- ✅ Accelerator Development Kit
- ✅ Tool building framework

---

### Layer 8: Apps (Consumption)

**Web App** (`apps/web/`)

- ✅ Main UI
- ✅ Routes connected to gateway
- ✅ Component library
- **Entry**: `apps/web/src/main.tsx`
- **Uses**: SDK for all platform capabilities

**Mobile App** (`apps/mobile/`)

- ✅ React Native
- ✅ Same SDK as web

**Desktop App** (`apps/desktop/`)

- ✅ Electron
- ✅ Same SDK as web

**Local Monitor** (`apps/local-monitor/`)

- ✅ Development monitoring
- ✅ Service health checks

---

## The Wiring (How Pins Connect)

### Request Flow (Customer Zero)

```
User Browser (Web App)
  ↓
Web App calls SDK.authenticate(credentials)
  ↓
SDK.authenticate() calls Gateway.handleAuth()
  ↓
Gateway.handleAuth()
  ├─ Validates credentials
  ├─ Checks Customer Zero email
  ├─ Calls ensureCustomerZeroMembership()
  └─ Returns JWT + tenant context
  ↓
Web App receives JWT + tenant ID
  ↓
Web App calls SDK.executeCapability(capabilityId, context)
  ↓
SDK.executeCapability() calls Gateway.route(request)
  ↓
Gateway.route(request)
  ├─ Validates JWT
  ├─ Injects x-tenant-id header
  ├─ Routes to correct service:
  │  ├─ /connector/* → Connector service
  │  ├─ /pipeline/* → Pipeline service
  │  ├─ /intelligence/* → Intelligence service
  │  ├─ /knowledge/* → Knowledge service
  │  ├─ /twin/* → Twin service
  │  └─ /govern/* → Govern service
  └─ Returns result to web app
  ↓
Web App receives result
```

### Continuity Flow (The Moat)

```
Any app action (chat, docs, approval)
  ↓
Signals.record(event)
  ├─ Event type: "user_approved_proposal"
  ├─ Entities: ["proposal_123", "user_456"]
  ├─ Context: { approvedAmount: "$100K", timing: "fast" }
  └─ Tenant: "tenant_cz"
  ↓
Signals publishes to subscribers:
  ├─ Memory service (stores to continuity)
  ├─ Context service (updates entity graph)
  ├─ Intelligence service (trains on patterns)
  └─ Twin service (updates user twin)
  ↓
On next action:
  SDK.getContext() retrieves:
  ├─ User's approval patterns
  ├─ Previous decisions
  ├─ Team members who participated
  ├─ Entity relationships
  └─ Timing preferences
  ↓
Intelligence service uses enriched context
  to predict next action / suggest workflow
```

### Multi-Tenant Isolation

```
Request arrives at Gateway
  ↓
Gateway.verifyJWT(token)
  └─ Extracts tenant_id from JWT
  ↓
Gateway.injectTenantHeader()
  ├─ Sets x-tenant-id = tenant_id
  ├─ Sets x-user-id = user_id
  └─ All downstream services see tenant context
  ↓
Database queries automatically filtered by tenant:
  SELECT * FROM proposals
  WHERE tenant_id = x-tenant-id
  ↓
Continuity service respects tenant boundary:
  SELECT * FROM continuity_events
  WHERE tenant_id = x-tenant-id
  ↓
Result: Complete isolation between tenants
```

---

## What's "Customer Zero"?

Customer Zero = The **visible, working proof** that all pins are wired.

Currently exists in code:

- ✅ `services/gateway/src/customer-zero.ts` - Provisioning logic
- ✅ `services/gateway/src/index.ts` - Wiring to gateway
- ✅ Types in `packages/types/` - Contracts

**What's Missing**:

- A **public endpoint** that demonstrates the end-to-end flow
- A **test suite** that proves continuity works
- A **documented journey** through all pins

---

## Surfacing All Pins: Action Plan

### Phase 1: Customer Zero Endpoint (Week 1)

Create a public endpoint that proves everything works:

```
GET /api/customer-zero/status
  ↓ Gateway routes to Intelligence
  ↓ Intelligence assembles Customer Zero context
  ↓ Returns visible proof of all pins

Response:
{
  "status": "operational",
  "pins": {
    "identity": "✓ JWT verified",
    "ingress": "✓ Customer Zero provisioned",
    "continuity": "✓ 14 events recorded",
    "memory": "✓ Context retrieved",
    "context": "✓ Entity360 assembled",
    "intelligence": "✓ Agent reasoning active",
    "governance": "✓ Policies enforced",
    "networking": "✓ 3 subscribers active"
  },
  "moat_strength": {
    "memory_events": 14,
    "entity_mappings": 7,
    "workflow_patterns": 3,
    "confidence": 0.89
  }
}
```

### Phase 2: Test Suite (Week 1)

Create tests that exercise all pins:

```
test("Customer Zero: End-to-end flow")
  ├─ Authenticate Customer Zero user
  ├─ Execute a capability (propose something)
  ├─ Record to memory/signals
  ├─ Retrieve context
  ├─ Check entity graph
  ├─ Verify continuity
  └─ Assert all pins fired

test("Customer Zero: Multi-tenant isolation")
  ├─ Create two Customer Zero instances
  ├─ Each has their own tenant_id
  ├─ Data doesn't leak between
  └─ Assert strict isolation

test("Customer Zero: Continuity moat")
  ├─ Record 100 interactions
  ├─ Detect workflow patterns
  ├─ Verify entity graph growth
  └─ Assert moat strength > 0.8
```

### Phase 3: Visual Dashboard (Week 2)

Create a Customer Zero dashboard visible in web app:

```
Dashboard shows:
├─ Live authentication status
├─ Tenant context
├─ Memory events recorded (timeline)
├─ Entity graph (visual graph)
├─ Detected workflow patterns
├─ Last 10 interactions
├─ Current context state
├─ Twin status
├─ Approval chain status
└─ System health (all pins)
```

---

## The 27 Services Mapping to 12 Frameworks

### Identity Framework

- `gateway` - Auth + JWT
- `tenants` - Workspace provisioning
- `auth` - OAuth flows

### Ingress Framework

- `gateway` - HTTP routing
- `webhook-ingress` - Real-time webhooks

### Capability Framework

- `connector` - External capabilities (80+ integrations)
- `mcp-connector` - MCP tool framework
- `pipeline` - Workflow capabilities
- `think` - Planning capabilities

### Continuity Framework

- `continuity` - Data normalization + assembly
- `signals` - Event sourcing
- `store` - Workspace state

### Memory Framework

- `hermes` - Memory service
- `hermes-spine-memory` - Memory lifecycle

### Context Framework

- `knowledge` - Doc/entity retrieval
- `normalizer` - Data normalization

### Intelligence Framework

- `intelligence` - LLM orchestration
- `iw-agent-runtime` - Agent runtime
- `think` - Planning + reasoning
- `l2` - Layer 2 API

### Governance Framework

- `govern` - Policies + RBAC
- `admin` - Admin controls
- `tenants` - Tenant governance

### Networking Framework

- `signals` - Event broadcasting
- `webhook-ingress` - Real-time ingress

### Twin Framework

- `twin-orchestrator` - User/org/agent twins
- `iw-agent-runtime` - Twin agents

### Billing Framework

- `billing` - Billing + usage

### Monitoring Framework

- `telemetry` - Metrics + tracing
- `analytics` - Usage analytics

---

## How to Surface a Pin (Example)

Let's surface the Memory Framework pin:

**Step 1: Find the implementation**

```
Location: packages/hermes-spine-memory/src/
Implements: Memory.record(), Memory.retrieve()
```

**Step 2: Wire to SDK**

```
Location: packages/sdk/src/memory.ts
Exports: SDK.recordMemory(interaction), SDK.getContext()
```

**Step 3: Wire to App**

```
Location: apps/web/src/hooks/useMemory.ts
Calls: SDK.getContext() on page load
Displays: "3 related decisions", "2 relevant docs"
```

**Step 4: Add to Customer Zero**

```
Location: services/gateway/src/customer-zero.ts
On auth: Record "customer_zero_authenticated" event
On action: Record "customer_zero_executed_capability"
Verify: Memory retrieves these events
```

**Step 5: Test**

```
Location: services/gateway/src/customer-zero.test.ts
Assert: Memory events recorded
Assert: Context retrieved successfully
Assert: Moat strength increases
```

---

## What "Wire Everything" Means

For each of the 27 services:

1. **Identify** where it lives in codebase
2. **Map** to one of 12 frameworks
3. **Surface** via SDK or public endpoint
4. **Wire** to web app or another service
5. **Test** via Customer Zero scenario
6. **Document** in dashboard or API docs

After all 27 are surfaced + wired + tested = **Complete Platform** visible and working.

---

## Success Criteria

Customer Zero is "working" when:

- [ ] Can authenticate as Customer Zero user (pin #1: identity)
- [ ] Can execute a capability (pin #2: capability)
- [ ] Can record to memory (pin #3: continuity)
- [ ] Can retrieve context (pin #4: context)
- [ ] Can see entity graph (pin #5: intelligence)
- [ ] Can enforce policy (pin #6: governance)
- [ ] Can see audit trail (pin #7: security)
- [ ] All 27 services report "ready" (pin #27: monitoring)

When all pass: **Platform is visible, discoverable, and fully operational**.

---

## Next Steps

1. **Read** this document completely
2. **Map** each of 27 services to one of 12 frameworks
3. **Create** `/api/customer-zero/status` endpoint
4. **Run** Customer Zero test suite
5. **View** Customer Zero dashboard in web app
6. **Verify** all 27 pins firing

After: All ecosystem apps (chat, docs, blog) can consume proven pins via SDK.

# Platform Activation Framework

> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

**The Frozen Architecture: Proving IntegrateWise is a Platform**

---

## The Acceptance Test

> **Swap any frontend without changing business logic.**
>
> Replace Lovable ↔ v0 ↔ Replit ↔ Electron ↔ Next.js on top of the same tenant, same data, same capability set — and the user behavior must be identical.

If this passes, **platform-first is proven.**

---

## Why This Matters

**Old thinking:** "Build beautiful UI in this tool, then rebuild it in that tool"
**Platform thinking:** "Build ONE SDK. Every tool becomes a Projection."

The breakthrough: **The product is not the UI. The product is the Capability APIs + SDK.**

---

## The Eight Frozen Contracts

These are the load-bearing API of IntegrateWise. No frontend invents payloads. Every interaction flows through these envelopes.

### 1. PlatformRequest — Every request enters through this

```typescript
interface PlatformRequest<TKind extends PlatformOp, TPayload> {
  id:        string             // request id (idempotency key)
  op:        TKind              // discriminated union: "read" | "write" | "execute" | "search"
  payload:   TPayload           // op-specific body
  actor:     ActorRef           // who: human | twin | service
  tenant:    TenantId           // tenant boundary (security)
  context:   ContextRef         // workbench projection + current capability
  trace:     TraceMeta          // audit + replay trail
}
```

### 2. PlatformResponse — Every response leaves through this

```typescript
interface PlatformResponse<TResult, TError = PlatformError> {
  requestId: string             // matches PlatformRequest.id
  status:    "ok" | "partial" | "denied" | "error"
  result?:   TResult
  error?:    TError
  cursor?:   string             // pagination / continuation token
  audit?:    AuditRef           // link into Memory audit boundary
  replay?:   ReplayHandle       // how to replay this operation
}
```

### 3. Capability — The atomic unit of work

```typescript
interface Capability {
  id:          CapabilityId     // stable id: "renewal-risk" | "account-health"
  version:     SemVer           // "1.4.0" (major=breaking, minor=additive)
  projection:  Projection[]     // how it surfaces in Workbench lenses
  inputs:      SchemaRef        // input contract (JSON Schema)
  outputs:     SchemaRef        // output contract
  actions:     ActionRef[]      // side-effecting verbs: create | update | delete | execute
  providers:   ProviderRef[]    // external systems it can touch
  governance:  GovernancePolicy // approval rules + audit + scope
}
```

### 4. Entity — The thing a Capability operates on

```typescript
interface Entity {
  id:        EntityId
  type:      EntityType         // Account | Contact | Deal | Invoice | Task
  tenant:    TenantId
  fields:    Record<string, unknown>
  memory:    MemoryRef          // link to human/twin/org/audit memory
  capabilities: CapabilityRef[] // what this entity can do
}
```

### 5. Memory — The knowledge triple with boundaries

```typescript
interface Memory {
  scope:     "human" | "twin" | "org" | "audit"  // CRITICAL boundary
  entity:    EntityRef
  content:   unknown            // arbitrary JSON
  citations: EntityRef[]        // what this memory references
  ttl:       number             // seconds to live (resets on access)
  redaction: RedactionRule[]    // what to hide from whom
}
```

### 6. Proposal — Decision / change lifecycle

```typescript
interface Proposal {
  id:        ProposalId
  capability: CapabilityRef
  rationale: string
  proposedBy: ActorRef          // twin OR human
  approvals:  ApprovalRef[]     // governance gates (who must sign off)
  status:    "draft" | "pending" | "approved" | "denied" | "executed"
}
```

### 7. Approval — The approval grain

```typescript
interface Approval {
  id:       ApprovalId
  proposal: ProposalRef
  actor:    ActorRef            // who is deciding
  decision: "approve" | "deny" | "request-info"
  reason?:  string
  at:       ISODateTime
}
```

### 8. Projection — How Capabilities are rendered per lens

```typescript
interface Projection {
  lens:      WorkbenchLens      // Sales | CS | Finance | Marketing | Operations | HR | Executive | Personal
  view:      ViewSpec           // what fields to show, how to arrange, what actions available
  capability: CapabilityRef     // which capability this projection is rendering
}
```

---

## The SDK Surface (`@integratewise/sdk`)

Every method in the SDK compiles to one `PlatformRequest` envelope and unwraps one `PlatformResponse`. From any framework.

### Entity Discovery

```typescript
iw.accounts.list(filters?: AccountFilter):        Promise<PlatformResponse<Entity[]>>
iw.accounts.get(id: EntityId):                    Promise<PlatformResponse<Entity>>
iw.contacts.list(filters?: ContactFilter):        Promise<PlatformResponse<Entity[]>>
iw.contacts.get(id: EntityId):                    Promise<PlatformResponse<Entity>>
iw.entity360(id: EntityRef):                      Promise<PlatformResponse<EntityBundle>>
```

### Capability Discovery & Execution

```typescript
iw.capabilities.list():                           Promise<PlatformResponse<Capability[]>>
iw.capabilities.describe(id: CapabilityId):       Promise<PlatformResponse<Capability>>
iw.capability(id: CapabilityId, args):            Promise<PlatformResponse<CapabilityOutput>>

// Examples:
iw.capability("renewal-risk", { account: "acme-123" })
iw.capability("account-health", { account: "acme-123" })
iw.capability("ar-exposure", { filters: { overdue: true } })
```

### Memory & Knowledge

```typescript
iw.memory.write(scope: MemoryScope, content):     Promise<PlatformResponse<MemoryRef>>
iw.memory.read(ref: MemoryRef):                   Promise<PlatformResponse<Memory>>
iw.memory.search(query, scope?, topK?):           Promise<PlatformResponse<SearchHit[]>>
iw.knowledge.search(q):                           Promise<PlatformResponse<KnowledgeHit[]>>
```

### Proposals & Approvals

```typescript
iw.proposals.list(filters?):                      Promise<PlatformResponse<Proposal[]>>
iw.proposals.create(capability, args, rationale): Promise<PlatformResponse<Proposal>>
iw.proposals.approve(id, reason?):                Promise<PlatformResponse<Approval>>
iw.proposals.deny(id, reason):                    Promise<PlatformResponse<Approval>>
iw.proposals.execute(id):                         Promise<PlatformResponse<ExecutionReceipt>>
iw.governance.policy(capabilityId):               Promise<PlatformResponse<GovernancePolicy>>
```

### Providers & Tools

```typescript
iw.tool(id: ToolRef, args):                       Promise<PlatformResponse<ToolReceipt>>
iw.provider(id: ProviderRef, args, idempotencyKey?): Promise<PlatformResponse<ProviderReceipt>>
iw.workflow.start(workflowRef, args):             Promise<PlatformResponse<WorkflowHandle>>
iw.workflow.status(handle):                       Promise<PlatformResponse<WorkflowState>>
```

### Signals & Notifications

```typescript
iw.notifications.subscribe(topic, handler):       UnsubscribeFn
iw.notifications.publish(topic, payload):         Promise<void>
iw.signals.observe(pattern):                      AsyncIterable<Signal>
```

### Strategy & Analytics

```typescript
iw.strategy.summary(period):                      Promise<PlatformResponse<ExecSummary>>
iw.workbench.lens(lens: WorkbenchLens):           Promise<PlatformResponse<ProjectionSpec>>
iw.analytics.run(query: AnalyticsQuery):          Promise<PlatformResponse<AnalyticsResult>>
```

---

## How a Frontend Connects (Three Lines)

```typescript
import { IntegrateWise } from "@integratewise/sdk";

const iw = new IntegrateWise({
  tenant:   process.env.IW_TENANT!,
  identity: process.env.IW_IDENTITY!,    // OAuth or service token
  runtime:  "browser" | "electron" | "server" | "mobile"
});

// Now use it from any framework
const health = await iw.accounts.health(accountId);
if (health.result?.atRisk) {
  const proposal = await iw.proposals.create(
    "renewal-risk",
    { account: accountId },
    "Detected deteriorating engagement"
  );
}
```

---

## Layering: Frontend → Platform

```
┌─────────────────────────────────────────────┐
│  UI Surface Layer                           │
│  React · Lovable · v0 · Replit · Electron  │
│  Next.js · React Native                     │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  Projection Layer                           │
│  (Lens Adapter)                             │
│  Sales → CS → Finance → Ops → Exec → ...    │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  Capability SDK (@integratewise/sdk)        │
│  iw.accounts | iw.capability | iw.memory    │
│  iw.proposals | iw.provider | iw.workflows  │
└─────────────────────────────────────────────┘
                    ↓
═══════════════════════════════════════════════════════════════════
            INTEGRATEWISE PLATFORM (Frozen Contracts)
═══════════════════════════════════════════════════════════════════
┌─────────────────────────────────────────────┐
│  PlatformRequest / PlatformResponse         │
│  (Load-bearing envelopes)                   │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  Capability APIs                            │
│  (Capability-first, not endpoint-first)     │
│  /capabilities/:id (canonical)              │
│  /entities/:id                              │
│  /memory/:id                                │
│  /proposals/:id                             │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  Adaptive Spine                             │
│  (Kernel → Worker → Capability Engine)      │
│                                             │
│  Services:                                  │
│  • Identity (Auth, Users, Teams, Roles)     │
│  • Capability Registry                      │
│  • Entity360                                │
│  • Memory (Scopes: human/twin/org/audit)   │
│  • Knowledge                                │
│  • Governance + Approval                    │
│  • Workflow + Kernel                        │
│  • Signals                                  │
│  • Provider + Connector                     │
│  • Notification                             │
│  • Twin (Participant, not product)          │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  Connected Applications (100+)              │
│  Gmail · Slack · GitHub · HubSpot · Figma   │
│  Notion · Salesforce · Drive · Linear · ... │
└─────────────────────────────────────────────┘
```

---

## Decision Rules

1. **No new endpoint unless it is a capability.** `/accounts` is forbidden. `/capabilities/account-health` is canonical.
2. **Every Capability has a governance field** before it ships.
3. **Every Provider call takes an idempotency key.** Replay is mandatory.
4. **Every Capability has a version.** Major bumps are breaking; minors are projection-only.
5. **The SDK is the public API.** Endpoints can be deprecated; the SDK cannot without a Major version.
6. **No business logic in frontends.** If logic bleeds into UI, file an issue against the Capability, not the frontend.

---

## The Eight Workbench Lenses

Every Capability is rendered through one or more of these projections:

| Lens | Focus | Metrics | Capabilities |
|------|-------|---------|--------------|
| **Sales** | Pipeline, quota, close | ARR, pipeline value, win rate | renewal-risk, account-health, qbr-brief |
| **CS** | Health, risk, expansion | NPS, health score, churn risk | account-health, renewal-risk, expansion-opp |
| **Finance** | AR, AP, forecast | DSO, cash flow, forecast accuracy | ar-exposure, ap-aging, forecast |
| **Marketing** | Campaigns, funnel, pipeline | CAC, conversion, MQL-to-SQL | lead-scoring, campaign-roi, segment |
| **Operations** | Flow, supply, SLA | SLA compliance, cycle time, throughput | workflow-status, sla-breach, capacity |
| **HR** | People, ops, review | headcount, retention, engagement | performance-review, hiring, succession |
| **Executive** | Strategy, KPIs, risk | revenue, margins, risk score | strategy-summary, kpi-dashboard, risk-register |
| **Personal** | Life, goals, lifeOS | energy, progress, impact | goal-tracking, note-search, reflection |

---

## Platform Activation Roadmap

### Phase 0 — Stabilize (Jan 21 → Feb 7)
- ✓ Continuity Bridge Vercel build
- ✓ Identity / Tenant onboarding
- ✓ Vercel UI integration sanity check

### Phase A — Backend Completion (6 weeks)
Complete all services behind Capability contracts:
- Capability Registry (v1.0 + versioning)
- Entity360 (joins memory + signals + capabilities)
- Memory (scopes: human/twin/org/audit + TTL + redaction)
- Knowledge (ingestion + retrieval)
- Signals (NEW service — observe + replay)
- Strategic Hub (Capability + Exec projection)
- Governance + Approval (policy on every Capability)
- Workflow (Kernel schedules ACTIONS)
- Notification (Provider action variant)
- Search (Memory + Entity360 + Knowledge)
- Analytics (Capability projection)
- Connector (Continuity sync spine)
- Provider (idempotency keys mandatory)
- Runtime (projection dimension)

### Phase B — Freeze Platform Contracts (2 weeks, blocked on Phase A 80%)
- ✓ PlatformRequest / Response envelopes (frozen)
- ✓ Capability contract (typed)
- ✓ Entity, Memory scopes, Proposal / Approval
- ✓ ToolAction / ProviderAction / Search / Projection
- ✓ governance field mandatory on every Capability
- Versioning rules

### Phase C — Capability APIs + SDK (3 weeks, blocked on Phase B)
- ✓ Publish Capability APIs (no /accounts endpoints)
- ✓ Publish @integratewise/sdk (TS first; Python + Go follow)
- ✓ Reference SDK tests against Capability spec
- ✓ Idempotency documented on every Provider call

### Phase D — Frontend Swap Validation (acceptance test)
1. Pick one Capability: `renewal-risk`
2. Build the same screen 3 ways: Lovable, Replit, v0
3. Each consumes `@integratewise/sdk` against same tenant
4. Diff outputs — must be byte-identical
5. Repeat for: `account-health`, `memory.search`, `strategy.summary`
6. **Acceptance:** business logic untouched across 3 builds

### Phase E — Re-platform existing L1/L2 surfaces
- Vercel UI → Projection adapter → SDK calls only
- v0 prototypes → SDK
- Lovable apps → SDK
- Replit apps → SDK
- Electron → SDK

---

## Success Criteria: Platform Activation Complete

When you can answer YES to all five:

1. ☑ Phase A services are at v1.0, all behind Capability contracts
2. ☑ Platform contracts are frozen, versioned, and published as spec
3. ☑ `@integratewise/sdk` ships, and a Capability looks identical from Lovable, v0, Replit, Electron, Vercel UI
4. ☑ Same tenant + same Capability ⇒ swapping UI surface produces byte-identical outputs
5. ☑ A new Workbench lens is built in days by composing Capability APIs — no new backend code

---

## What This Means

**Before Platform Activation:**
- Each frontend is a full-stack application
- Business logic spread across multiple tools
- Adding a new UI tool = rebuilding everything

**After Platform Activation:**
- Each frontend is a **Projection** of the same Spine
- Business logic lives in **Capabilities**
- Adding a new UI tool = adding a Projection adapter (days, not weeks)

**The moat:** Once frozen, the Platform Contracts are locked. Endpoints evolve. Backends scale. But the SDK surface never breaks. Every tool can count on stable, versioned Capability APIs.

---

## Integration with Recovery Vision

The **Human Workbench Recovery** + **Platform Activation** are not competing—they're complementary:

**Recovery Vision:**
- Human Workbench is primary
- 8 Workbench lenses (Sales, CS, Finance, Ops, etc.)
- Surfaces are configurable features
- AI Twin has separate home

**Platform Activation:**
- Same 8 lenses become Projections
- Each Projection calls iw.workbench.lens(LensName)
- Capability SDK is universal
- Any frontend can implement any Projection

**Together:** When both are done, you've proven:
1. ✓ The workbench is human-centric (Recovery)
2. ✓ The workbench is a platform, not a tool (Platform Activation)
3. ✓ Business logic is in Capabilities, not UIs (Platform)
4. ✓ Any frontend can become IntegrateWise (Activation)

---

*Framework: Platform Activation*
*Status: Frozen Architecture, Roadmap Defined*
*Next: Begin Phase A backend completion*

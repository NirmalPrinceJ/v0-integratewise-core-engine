# IntegrateWise: Integrated Vision

> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

**Recovery + Activation = Platform-First Human Experience**

---

## The Three Breakthroughs

### 1. Recovery Vision: Human Workbench is Primary
> "Stop Being Human APIs" — January 2025 insight

The workbench is not a feature. It is THE product.
- Dashboard, Contacts, Companies, Opportunities
- Tasks, Calendar, Notes, Meetings, Communications
- Knowledge, Goals, Values, Reports, Settings
- 15+ surfaces, all configurable

AI Twin has its own home (separate, not interrupting).
Continuity Engine owns memory (invisible backbone).

### 2. Platform Activation: Frozen Contracts + SDK
> "Every frontend is a Projection" — Architecture insight

Eight frozen contracts make IntegrateWise replaceable:
1. PlatformRequest/Response (envelopes)
2. Capability (atomic work unit)
3. Entity (what Capability operates on)
4. Memory (knowledge with boundaries)
5. Proposal/Approval (decision lifecycle)
6. Projection (how Capability renders per lens)
7. + two more (ToolAction, ProviderAction)

@integratewise/sdk makes any frontend functional:
```typescript
import { IntegrateWise } from "@integratewise/sdk"
const iw = new IntegrateWise({ tenant, identity, runtime })
const health = await iw.accounts.health(accountId)
```

### 3. The Synthesis: Adaptive Platform
When you combine both:
- **Recovery:** Workbench is human-centric, eight lenses (Sales, CS, Finance, Ops, HR, Exec, Personal)
- **Activation:** Those eight lenses become Projections via iw.workbench.lens()
- **Result:** Any frontend using @integratewise/sdk becomes an IntegrateWise workbench

---

## Architecture Diagram

```
                            HUMAN WORKBENCH (Recovery Vision)
                    (Dashboard + 15 Surfaces + Configurability)

        Sales    CS    Finance    Ops    HR    Exec    Personal
         │       │        │       │     │      │         │
         └─────────────────┴───────┴─────┴──────┴─────────┘
                            │
                            ▼
            ┌───────────────────────────────┐
            │  Projection Layer             │
            │  (iw.workbench.lens(...))     │
            └───────────────────────────────┘
                            │
                            ▼
            ┌───────────────────────────────┐
            │  @integratewise/sdk           │
            │  (Frozen Capability APIs)     │
            └───────────────────────────────┘
                            │
  ┌─────────────────────────┼─────────────────────────┐
  ▼                         ▼                         ▼
Lovable                   v0                      Replit
(via SDK)              (via SDK)                (via SDK)
  │                         │                         │
  └─────────────────────────┼─────────────────────────┘
                            │
                            ▼
    ════════════════════════════════════════════════════════════
          IntegrateWise Platform (Frozen Contracts)
    ════════════════════════════════════════════════════════════
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
  Capability Engine    Memory Spine         Governance
  • Renewal Risk       • Entity360          • Approvals
  • Account Health     • Scopes             • Audit
  • AR Exposure        • TTLs               • Policies
  • 50+ more           • Redaction          • Rate Limits
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                            ▼
            ┌───────────────────────────────┐
            │  Continuity Bridge (Front Door)
            │  • Connection Management      │
            │  • Tenant Isolation           │
            │  • OAuth Once, Reuse Always   │
            └───────────────────────────────┘
                            │
                            ▼
    Connected Applications (100+)
    Gmail · Slack · GitHub · Figma · Notion · Salesforce · ...
```

---

## How It Works: Three Scenarios

### Scenario 1: Sales User at Beginning of Day

```typescript
// Behind the scenes: iw.workbench.lens("Sales")

import { IntegrateWise } from "@integratewise/sdk"

const iw = new IntegrateWise({
  tenant: "acme-corp",
  identity: "sarah@acme.com",
  runtime: "browser"  // v0 frontend
})

// 1. Get accounts with health scores
const accounts = await iw.accounts.list()
const health = await Promise.all(
  accounts.map(acc => iw.accounts.health(acc.id))
)

// 2. See what needs renewal attention
const renewal = await iw.capability("renewal-risk", {
  accounts: accounts.slice(0, 10)
})

// 3. Review proposals waiting for approval
const proposals = await iw.proposals.list({
  status: "pending",
  lens: "Sales"
})

// Result: Sales Dashboard populated via pure SDK calls
// Same result from Lovable, Replit, Electron, Next.js
// because all call same SDK against same Spine
```

### Scenario 2: CS Manager via Replit Frontend

```typescript
// Behind the scenes: iw.workbench.lens("CustomerSuccess")

const iw = new IntegrateWise({
  tenant: "acme-corp",
  identity: "marcus@acme.com",
  runtime: "browser"  // Replit frontend
})

// 1. Get all accounts flagged as at-risk
const atRisk = await iw.memory.search({
  query: "at-risk status",
  scope: ["org"],  // Organization-scoped memory
  topK: 20
})

// 2. Create expansion opportunity proposals
const proposals = await Promise.all(
  atRisk.map(risk => 
    iw.proposals.create(
      "expansion-opportunity",
      {
        account: risk.id,
        opportunity: "upsell to premium",
        expectedARR: 50000
      },
      "Customer engagement trending up 3 months"
    )
  )
)

// 3. Get QBR briefs for this week
const qbrs = await iw.capability("qbr-brief", {
  period: "this-week",
  lens: "CustomerSuccess"
})

// Result: CS Dashboard identical regardless of frontend
```

### Scenario 3: Executive Getting Daily Brief

```typescript
// Behind the scenes: iw.workbench.lens("Executive")

const iw = new IntegrateWise({
  tenant: "acme-corp",
  identity: "ceo@acme.com",
  runtime: "server"  // Next.js server component
})

// 1. Get strategy summary
const strategy = await iw.strategy.summary("this-month")

// 2. Get KPI dashboard
const kpis = await iw.analytics.run({
  metric: "arr_by_cohort",
  groupBy: ["segment", "region"],
  period: { start: thisMonthStart, end: today }
})

// 3. Get risk register
const risks = await iw.memory.search({
  query: "strategic risk",
  scope: ["org"],  // org-level memory only
  topK: 10
})

// 4. Get pending executive approvals
const pending = await iw.proposals.list({
  approvals: { actor: { id: "ceo@acme.com", type: "human" } },
  status: "pending"
})

// Result: Executive dashboard with real KPIs
// Same data whether accessed from Vercel UI, Next.js app, or Electron
```

---

## Key Principles (Integration)

### 1. One Platform, Many Surfaces
The workbench isn't built once—it's projected eight times:
- **Sales:** Focus on pipeline, renewal, expansion
- **CS:** Focus on health, risk, expansion
- **Finance:** Focus on AR, AP, forecast
- **Ops:** Focus on workflow, SLA, capacity
- **HR:** Focus on people, retention, succession
- **Exec:** Focus on strategy, KPIs, risk
- **Personal:** Focus on goals, reflection, life
- **Emerging:** (Easy to add new lenses)

Each lens is a **Projection** — a different view of the same Adaptive Spine.

### 2. Business Logic Lives in Capabilities, Not UIs
- Renewal Risk Capability exists once, everywhere
- CS user sees it in CS lens, Sales user in Sales lens
- Twin can call it for daily routines
- API can call it for integrations

If logic varies by UI, **that's a bug in the Capability contract**, not a feature.

### 3. Memory Has Boundaries, Not Walls
```
Organization Memory   (shared across team)
  ├─ Strategic risk register
  ├─ Customer segments
  └─ Competitive intelligence

Work Memory           (shared across projects)
  ├─ Sprint goals
  ├─ Technical decisions
  └─ Meeting notes

Personal Memory       (individual only)
  ├─ Goals + reflections
  ├─ Career development
  └─ 1:1 notes with manager

Audit Memory          (system only)
  ├─ All approvals
  ├─ All large changes
  └─ Compliance trail
```

Human ↔ Twin memories are **separate but shared** (no human memory erased, Twin gets its own).

### 4. Twin is Operational Participant, Not Product
Twin:
- Observes patterns daily
- Maintains own memory + learnings
- Has daily routines (not random)
- Collaborates via overlay (not interrupting)
- Answers questions when asked
- **Never** replaces workbench

Twin's home is **separate** from human workbench.
When Twin adds value (daily insights, draft proposals), it surfaces in workbench via Capabilities.

### 5. The SDK is the Covenant
```typescript
@integratewise/sdk is the contract.

iw.accounts.list()               → Same everywhere
iw.capability("renewal-risk"...)  → Same everywhere
iw.proposals.create(...)          → Same everywhere
iw.workbench.lens("Sales")        → Same everywhere

No frontend gets special behavior.
No endpoint exists outside the SDK.
No business logic hides in a tool.
```

---

## Execution: How They Converge

### Phase 1: Recovery (Weeks 1-2)
- Clean v0 experimental files
- Deploy restored Human Workbench
- Customer Zero begins real work
- Spine starts ingesting patterns

**Goal:** Workbench is primary, not overlay.

### Phase 2: Schema Evolution (Week 3)
- Spine Schema v1.0 emerges from real usage
- Entity types, relationships, boundaries defined
- 150+ entities, 500+ relationships indexed
- Memory scopes validated

**Goal:** Platform has canonical data model.

### Phase 3: Platform Activation (Weeks 4-6)
- Phase A backend services reach v1.0 (Capability Registry, Entity360, Governance, etc.)
- Platform contracts frozen
- @integratewise/sdk published and tested
- Frontend swap validation passes

**Goal:** Business logic provably in Capabilities, not UIs.

### Phase 4: Full Integration (Weeks 7-8)
- All eight Workbench lenses operational
- All Projections calling iw.workbench.lens()
- Each lens independently configurable
- Twin AI Workbench integrated

**Goal:** Human-centric platform proven + platform-first proven = complete.

---

## Success Looks Like

**From User Perspective:**
```
Monday morning, Sales user opens v0 workbench
  → Dashboard shows all accounts + health + renewal risk
  → Can create renewal proposals with one click
  → Proposals queue for CS review (separate step)
  → All configurable: show/hide columns, reorder, pin favorites

Tuesday, CS manager opens Replit workbench (same company)
  → Same data, different lens (health-focused, not pipeline)
  → Can see why renewals are at risk (Twin's observations)
  → Can create expansion proposals (to Sales for approval)
  → Identical data, different interpretation

Thursday, CEO opens Lovable dashboard
  → Executive lens shows KPIs, risks, strategy summary
  → All from same Spine, same Capabilities
  → Read-only for most, can approve big decisions
  → Byte-identical to what CEO would see in Next.js app
```

**From Technical Perspective:**
```
Acceptance Test Passes:
  ✓ Build "account-health" screen in v0
  ✓ Build "account-health" screen in Replit
  ✓ Build "account-health" screen in Lovable
  ✓ All call iw.capability("account-health", args)
  ✓ All return identical results
  ✓ UI differences (colors, layout) don't matter
  ✓ Business logic (health calculation) is identical

Platform Proven:
  ✓ Every method in SDK is a Capability
  ✓ Every Capability has governance
  ✓ Every Capability has a version
  ✓ Business logic doesn't leak into frontends
  ✓ Adding a new frontend = day of work (SDK integration)
  ✓ Adding a new Capability = internal work (backend only)
```

---

## What's Different After Integration

### Before
- "Which tool should we rebuild this in?" (Lovable? v0? Replit?)
- Business logic scattered across multiple frontends
- Each new tool = months of rebuilding
- Continuity depends on manual note-taking

### After
- "What Capability do we need?" (renewal-risk? account-health? forecast?)
- Business logic lives in Capability, not UI
- Each new tool = days (just implement Projections)
- Continuity is automatic via Spine

### Before
- Workbench is one of many "agents"
- AI is the primary product, humans are users
- Context is ephemeral (lost between sessions)

### After
- Workbench is the primary product
- AI is invisible infrastructure (powerful but not prominent)
- Context is persistent (Spine remembers everything)

---

## The Real Product

Not: "MultiModel AI Orchestration"
Not: "Capability Engine"
Not: "Adaptive Spine"

**Yes:** "Nothing is lost in context."

When Sarah (Sales) works in v0, then switches to Replit, then hands off to Marcus (CS):
- Marcus sees everything Sarah saw
- Marcus sees what Twin observed
- Marcus knows Sarah's proposals are waiting
- Marcus can pick up exactly where Sarah left off
- No context switching cost
- No information re-entering
- No missed details

That's the product.
That's what people buy.
That's what makes the moat.

---

## Roadmap Summary

| Phase | What | Duration | Milestone |
|-------|------|----------|-----------|
| **0** | Stabilize | 2 weeks | Continuity Bridge + Vercel |
| **1** | Recover | 2 weeks | Human Workbench Primary |
| **2** | Evolve | 1 week | Spine Schema v1.0 |
| **A** | Backend | 6 weeks | Services at v1.0 |
| **B** | Contracts | 2 weeks | Frozen + Versioned |
| **C** | SDK | 3 weeks | @integratewise/sdk Ships |
| **D** | Validation | 2 weeks | Acceptance Test Passes |
| **E** | Platform | 3 weeks | All Surfaces Unified |

**Total: ~12 weeks to "Platform is proven and human-centric."**

---

## What Needs to Happen Now

1. **Freeze decision:** Is this architecture the target? (Yes/No/Refine)
2. **Commit to phases:** Are you executing in this order?
3. **Assign owners:** Who owns each service (Capability Registry, Memory, etc.)?
4. **Define "done":** What proves each phase is complete?

If yes to all four: execution starts tomorrow.

---

*Integration: Recovery Vision + Platform Activation*
*Product: Nothing Lost in Context*
*Moat: Adaptive Platform Behind Frozen Contracts*
*Timeline: 12 weeks to proof*


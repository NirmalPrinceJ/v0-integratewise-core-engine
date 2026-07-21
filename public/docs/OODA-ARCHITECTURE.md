# OODA Loop Architecture Guide

## Overview

The IntegrateWise platform operates as a continuous **OODA loop** (Observe, Orient, Decide, Act) that enables human-centered AI collaboration. This is not a new layer, but the operational rhythm that runs through all six platform layers.

**Core Principle:** Agents handle uncertainty. Pipelines handle certainty.

## The Four OODA Phases

### 1. Observe — "What is happening?"

**Layers involved:** Ingress Layer + Connector Sync

**Pipeline responsibilities (mechanical):**

- Webhook ingestion (`webhook-ingress`)
- Delta polling (`connector-sync`)
- Event streaming (SSE, MCP incoming)
- Metric collection and logging
- Spine change detection

**Agent responsibilities (intelligent):**

- Anomaly detection on incoming data streams
- Pattern recognition across multiple connectors
- Intent classification on natural language requests
- Sentiment/urgency scoring before routing

**Key insight:** Observation is mostly mechanical, but _what_ you observe and _how_ you prioritize it is intelligent.

---

### 2. Orient — "What does it mean?"

**Layers involved:** Continuity Layer + Capability Layer

**This phase is dominated by agents** because orientation requires:

- Context assembly (memory, knowledge, workspace state, entity history)
- Pattern matching (comparing current to historical)
- Hypothesis generation (what does the user want?)
- Spine synthesis (multi-connector coherence)

**Key services:**

- `intelligence` service (think/act paths) — core orientation engine
- `twin-orchestrator` — per-user context model
- `knowledge` (KB + vector search) — semantic retrieval
- `continuity` (memory lifecycle) — temporal context assembly
- Schema AI (Continuity Bridge) — entity relationship understanding

**Boundary rule:** Pipelines move and transform data. **Agents interpret it.**

---

### 3. Decide — "What should we do?"

**Layers involved:** Capability Layer + Governance Layer

**This is a hybrid zone:**

**Agents (complex decisions):**

- Capability routing — which runtime? which provider? which path?
- Dynamic policy evaluation — context-dependent governance
- Approval routing — should this go to human review?
- Multi-step plan generation — breaking requests into dependent actions
- Fallback chain selection — when primary fails, what's next?

**Pipelines (rule-based decisions):**

- Tier gate enforcement — subscription limits
- Rate limiting — deterministic throttling
- Static RBAC — role-based permissions
- Simple routing tables — path → service mapping

**Boundary rule:** If decision requires context reasoning → agent. If it checks a rule → pipeline.

---

### 4. Act — "Do it."

**Layers involved:** Provider Fabric + Capability Layer

**Pipelines (deterministic execution):**

- Spine writes (`pipeline` — sole writer to source of truth)
- Connector API calls with known schemas
- Workflow step execution (predetermined paths)
- Data synchronization pushes
- Billing event emission

**Agents (adaptive execution):**

- Multi-step workflows with branching
- MCP tool negotiation and fallback
- Provider fallback (alternative connectors)
- Adaptive retry with backoff strategies
- Real-time course correction

---

## The Human-In-The-Loop (HITL) Cycle

HITL is where human judgment enters the OODA loop at the critical **Decide** phase:

```
User Intent
    ↓
┌─────────────────────────────────────────┐
│ OBSERVE: Capture intent + context       │
│ (hitl-orchestrator.captureIntent)       │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ ORIENT: AI generates proposal + reasoning
│ (intelligence service generates proposal)│
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ DECIDE: Human approves/rejects/modifies │
│ ↑ IRREDUCIBLE HUMAN AGENCY ↑            │
│ (hitl-orchestrator.submitApproval)      │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ ACT: Execute approved action            │
│ (hitl-orchestrator.executeApprovedAction)
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ LEARN: Capture results + feedback       │
│ → Feeds into knowledge, memory, signals │
│ → Platform evolves for next cycle       │
└─────────────────────────────────────────┘
```

## Nested OODA Loops

OODA loops are recursive. An agent's **Act** becomes a pipeline's **Observe**:

```
Request Level OODA
  ├─ Observe: HTTP/MCP ingress
  ├─ Orient: Capability resolution
  ├─ Decide: Route to ADK runtime
  └─ Act: Spawn agent task
      ↓
  Agent Level OODA
    ├─ Observe: Memory + Knowledge + Spine
    ├─ Orient: Plan generation
    ├─ Decide: Which tools to call
    └─ Act: Execute tool calls
        ↓
    Pipeline Level OODA
      ├─ Observe: Tool results / webhook events
      ├─ Orient: Data normalization
      ├─ Decide: Write to spine? Emit signal?
      └─ Act: Pipeline execution
```

The `signals` service bridges these loops — an agent's action emits a signal that a pipeline observes.

## Service-to-OODA Mapping

| Service               | Primary Phase   | Type      | Role                                          |
| --------------------- | --------------- | --------- | --------------------------------------------- |
| **gateway**           | Observe         | Pipeline  | Ingress/routing only                          |
| **connector-sync**    | Observe         | Pipeline  | Mechanical delta polling                      |
| **webhook-ingress**   | Observe         | Pipeline  | Event ingestion                               |
| **knowledge**         | Orient          | Hybrid    | Embedding (pipeline); Retrieval (agent)       |
| **continuity**        | Orient          | Hybrid    | Maintenance (pipeline); Assembly (agent)      |
| **intelligence**      | Orient + Decide | **Agent** | Core orientation + decision engine            |
| **twin-orchestrator** | Orient          | **Agent** | Per-user context model                        |
| **govern**            | Decide          | Hybrid    | Rules (pipeline); Routing (agent)             |
| **pipeline**          | Act             | Pipeline  | Sole Spine writer                             |
| **workflow**          | Act             | Hybrid    | Durable execution; branching = agent-directed |
| **mcp-connector**     | Observe + Act   | Hybrid    | Ingestion (pipeline); Negotiation (agent)     |
| **signals**           | All phases      | Hybrid    | Signal bridge between OODA cycles             |
| **Projection Engine** | Orient + Act    | **Agent** | User-facing domain facades                    |

## The HOME Model: Platform Evolution

OODA loops enable continuous platform evolution through the **HOME** lifecycle:

1. **Have** — Foundation (SDK, services, schema)
2. **Own** — User control (RBAC, workspace customization)
3. **Maintain** — Ongoing operations (compliance, audits, governance)
4. **Learn** — Feedback loops (memory, signals, patterns from OODA cycles)
5. **Evolve** — Adaptation (capability discovery, agent learning, preference refinement)

Each HITL cycle generates data that feeds back:

- **Observe** data → Signals (anomaly patterns, priorities)
- **Orient** data → Knowledge (semantic learning) + Memory (context models)
- **Decide** data → Governance (approval decisions, risk calibration)
- **Act** data → Execution (success rates, fallback effectiveness)
- **Learn** data → Agent models (outcome-based decision refinement)

The next HITL cycle benefits from this learning. The platform adapts to the user's needs as they learn.

## Agent vs. Pipeline Decision Tree

```
Is the outcome deterministic?
├─ YES → Use Pipeline
│   (tier gates, rate limits, RBAC, schema transforms, spine writes)
│
└─ NO → Does it require reasoning about context?
    ├─ YES → Use Agent
    │   (capability routing, plan generation, approval decisions, fallback selection)
    │
    └─ NO → Could happen either way (Hybrid)
        (knowledge retrieval, memory assembly, workflow branching, error recovery)
```

## Integration Patterns

### Pattern 1: Agent Orchestrates, Pipeline Executes

Agent decides **what** to do → Pipeline does it deterministically.

_Example:_ Agent plans multi-step spine update → `pipeline` service executes write.

### Pattern 2: Pipeline Observes, Agent Decides

Pipeline detects condition → Agent evaluates significance → Decides response.

_Example:_ `connector-sync` detects delta → `intelligence` evaluates anomaly → triggers investigation.

### Pattern 3: Agent Acts, Pipeline Reacts

Agent executes external call → Pipeline handles webhook/event response.

_Example:_ Agent calls Salesforce API → Webhook response → Pipeline normalizes and writes to spine.

## Key Insight: The Irreducible Human

In the OODA loop, there is exactly **one irreducible point of human agency**: the **Decide** phase. This is where a human chooses whether to approve an AI proposal. Every other phase can be automated:

- **Observe:** Captured by pipelines and agents
- **Orient:** Generated by intelligence service
- **Decide:** **Only humans can decide** (approval, rejection, modification)
- **Act:** Executed by deterministic pipelines or adaptive agents
- **Learn:** Captured by signals, memory, knowledge systems

The platform is designed around this principle. The HITL orchestrator centers on the Decide phase. Everything else supports it.

---

## References

- See `services/gateway/src/hitl-orchestrator.ts` for HITL implementation with OODA phase annotations
- See `v0_memories/user/ooda-loop-architecture.md` for detailed architectural reference
- See individual service READMEs for service-specific OODA responsibilities

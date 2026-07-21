# §E — Ecosystem Architecture & SDK Specification

## IntegrateWise Continuity Bridge v2.0 — Capability Fabric, Knowledge Protocol, A2A, SDK Variants, Composition Patterns

**Status:** DRAFT v2.0 — Stage 1/2 Deep-Dive  
**Domain Owner:** Ecosystem Architecture & SDK  
**Supersedes:** v1.0.1 §5 (MCP Pool), §9 (Discovery), §12.4 (A2A), §18 (Registry), §26 (Template) where conflicting.  
**Date:** 2026-07-02

---

## E.1 Doctrine — What the Ecosystem Layer Is

> **The Ecosystem is the capability fabric.** It is not a separate system. It is the emergent property of the Continuity Bridge when tools, agents, humans, and memory are allowed to communicate through the Spine — governed, audited, and scoped.

The Ecosystem Layer sits conceptually across the **Capability** and **Continuity** layers of the 6-layer stack. It is the substrate that enables:

1. **Capability Fabric Model** — How named business capabilities are discovered, composed, and executed across the mesh.
2. **Knowledge Sharing Protocol (KSP)** — How memory, context, and evidence move between agents, tools, and humans without leaking tenant boundaries.
3. **Agent-to-Agent Communication (A2A)** — How autonomous agents coordinate through the Spine (not peer-to-peer), governed by the Twin ambient reasoning layer.
4. **SDK Variants** — Five consumer-facing SDK packages that expose the same contract at different fidelity levels.
5. **Ecosystem App Composition Patterns** — How third-party developers build on the Bridge without importing internal topology.
6. **Template Starter** — The canonical `create-iw-app` bootstrap for ecosystem participants.

**Key Invariant:** The Ecosystem never bypasses the Spine. All communication between ecosystem participants is mediated by the Spine, gated by `tenant_id`, and audited to `spine_audit_log`.

---

## E.2 The Capability Fabric Model

### E.2.1 Conceptual Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ECOSYSTEM CAPABILITY FABRIC                         │
│                                                                             │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐ │
│   │  Capability │◄──►│  Capability │◄──►│  Capability │◄──►│  Capability │ │
│   │   Registry  │    │   Router    │    │   Sandbox   │    │   Monitor   │ │
│   │(agent-registry)  │  (hermes)   │    │(iw-agent-  │    │ (telemetry) │ │
│   └──────┬──────┘    └──────┬──────┘    │  runtime)   │    └─────────────┘ │
│          │                  │            └─────────────┘                    │
│          ▼                  ▼                                               │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                    SPINE — The Single Source of Truth               │  │
│   │         (entities, relationships, memory, audit, continuity)        │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                              ▲                                              │
│   ┌─────────────┐    ┌───────┴───────┐    ┌─────────────┐    ┌──────────┐ │
│   │   Inbound   │    │    Twin       │    │   Outbound  │    │  Shared  │ │
│   │   MCP Pool  │◄──►│  (ambient)    │◄──►│   MCP Pool  │◄──►│  Memory  │ │
│   │(mcp-connector)    │(twin-orchestrator)  │  (act +    │    │(continuity│ │
│   └─────────────┘    └─────────────┘    │   adapters)   │    └──────────┘ │
│                                         └─────────────┘                   │
└─────────────────────────────────────────────────────────────────────────────┘
                              ▲
        Consumers ────────────┴───────────── SDKs, AI Assistants, Web Workbench
```

### E.2.2 Capability Taxonomy

Every capability in the ecosystem is a **named, versioned, discoverable action** with a strict contract:

```typescript
// packages/sdk/src/types/capability.ts

/**
 * Capability — the atomic unit of the Capability Fabric.
 * Every capability is: named, versioned, scoped, gated, and audited.
 */
export interface Capability {
  /** Canonical capability ID: `{domain}.{resource}.{action}` */
  id: string; // e.g., "salesforce.opportunity.create"

  /** Semantic version of the capability contract */
  version: string; // e.g., "2.1.0"

  /** Human-readable name */
  name: string;

  /** Markdown description for Discovery */
  description: string;

  /** The provider that owns this capability */
  provider: string; // e.g., "salesforce", "slack", "iw-native"

  /** Capability tier: L1=read, L2=insight, L3=execute, L4=autonomous */
  level: 1 | 2 | 3 | 4;

  /** Required scopes to invoke */
  scopes: string[]; // e.g., ["read:opportunities", "write:opportunities"]

  /** Input JSON Schema (for validation + UI generation) */
  inputSchema: JSONSchema7;

  /** Output JSON Schema */
  outputSchema: JSONSchema7;

  /** Governance gate required? */
  governanceGate: boolean; // true for L3/L4, false for L1/L2

  /** Minimum confidence threshold for auto-execution */
  autoExecuteThreshold: number; // 0.85 default for L3, 1.0 (never auto) for L4

  /** Whether this capability supports streaming (SSE) responses */
  streaming: boolean;

  /** Estimated cost in tokens / compute units */
  costEstimate: CostEstimate;

  /** Deprecation status */
  deprecation?: {
    deprecatedAt: string; // ISO date
    sunsetAt: string; // ISO date
    replacement?: string; // capability ID of replacement
  };
}

export interface CostEstimate {
  /** Token estimate for LLM-based capabilities */
  tokens?: { input: number; output: number };

  /** External API call cost estimate (USD) */
  apiCalls?: { count: number; estimatedCost: number };

  /** Compute time estimate (ms) */
  computeMs: number;
}

/** Capability invocation request — what consumers send */
export interface CapabilityInvokeRequest {
  /** The capability to invoke */
  capability: string;

  /** Tenant context (injected by Gateway, never from client) */
  tenantId: string;

  /** User context (injected by Gateway from JWT) */
  userId: string;

  /** Correlation ID for distributed tracing */
  correlationId: string;

  /** Invocation payload — validated against capability.inputSchema */
  payload: unknown;

  /** Execution preferences */
  options?: {
    /** Prefer streaming response? */
    streaming?: boolean;

    /** Maximum wait time (ms) before async handoff */
    timeoutMs?: number;

    /** Whether to compound result into memory */
    compoundMemory?: boolean;

    /** Required confidence threshold override */
    confidenceThreshold?: number;
  };
}

/** Capability invocation response */
export interface CapabilityInvokeResponse {
  correlationId: string;
  status: "success" | "pending" | "rejected" | "error" | "async";
  result?: unknown;
  proposalId?: string; // Present if governance-gated
  confidence?: number; // Governance confidence score
  auditLogId: string; // Reference to spine_audit_log entry
  executionTimeMs: number;
}
```

### E.2.3 Capability Discovery & Routing

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     CAPABILITY DISCOVERY & ROUTING FLOW                     │
│                                                                             │
│  Consumer                          Gateway                        Discovery │
│     │                                │                              Cache   │
│     │  GET /api/v1/discovery         │                                 │   │
│     │ ─────────────────────────────► │                                 │   │
│     │                                │  1. Extract tenantId from JWT   │   │
│     │                                │  2. Query KV cache (5-min TTL)  │   │
│     │                                │                                 │   │
│     │                                │ ◄──── cached Discovery? ───────►│   │
│     │                                │                                 │   │
│     │                                │  [Cache MISS]                   │   │
│     │                                │     │                           │   │
│     │                                │     ▼                           │   │
│     │                                │  3. Fetch from agent-registry   │   │
│     │                                │     (service binding)           │   │
│     │                                │                                 │   │
│     │                                │  4. agent-registry queries:     │   │
│     │                                │     - capability_registry (D1)  │   │
│     │                                │     - endpoint_registry (D1)    │   │
│     │                                │     - connector status (KV)     │   │
│     │                                │                                 │   │
│     │                                │  5. Filter by tenant plan + RBAC │   │
│     │                                │                                 │   │
│     │                                │  6. Write to KV cache           │   │
│     │                                │                                 │   │
│     │  DiscoveryResponse             │                                 │   │
│     │ ◄───────────────────────────── │                                 │   │
│     │                                │                                 │   │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Discovery Response Contract:**

```typescript
// packages/sdk/src/types/discovery.ts

export interface DiscoveryResponse {
  /** Identity context */
  identity: {
    userId: string;
    tenantId: string;
    orgId: string;
    role: string;
    scopes: string[];
  };

  /** Workspace configuration */
  workspace: {
    name: string;
    plan: "free" | "pro" | "enterprise";
    connectedProviders: string[];
    limits: WorkspaceLimits;
  };

  /** Available projections (8 lenses) */
  projections: Projection[];

  /** Available capabilities — FILTERED by tenant plan + RBAC */
  capabilities: CapabilitySummary[];

  /** Available agents in the ecosystem */
  agents: AgentSummary[];

  /** Knowledge sources available */
  knowledgeSources: KnowledgeSource[];

  /** Navigation structure for the workbench */
  navigation: NavNode[];

  /** Personalization */
  personalization: {
    recentCapabilities: string[];
    pinnedProjections: string[];
    preferences: Record<string, unknown>;
  };

  /** SDK version compatibility */
  sdkVersion: string;

  /** Bridge version */
  bridgeVersion: string;
}

export interface CapabilitySummary {
  id: string;
  name: string;
  description: string;
  level: 1 | 2 | 3 | 4;
  provider: string;
  category: string;
  scopes: string[];
  streaming: boolean;
  /** Whether currently available (provider connected + healthy) */
  available: boolean;
}

export interface AgentSummary {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  status: "active" | "idle" | "maintenance";
}

export interface KnowledgeSource {
  id: string;
  name: string;
  type: "spine" | "memory" | "document" | "connector";
  entityTypes: string[];
}
```

### E.2.4 Capability Execution Flow

```
Consumer → Gateway → hermes (queue) → twin-orchestrator (OODA) → govern (gate) → act (execute)
                                              │
                                              ▼
                                    ┌─────────────────┐
                                    │   SPINE READ    │
                                    │  Entity360 +    │
                                    │  Memory + RAG   │
                                    └─────────────────┘
```

**Detailed Execution Flow:**

| Step | Service             | Queue/Binding                     | Action                                                           | Security Boundary       |
| ---- | ------------------- | --------------------------------- | ---------------------------------------------------------------- | ----------------------- |
| 1    | `gateway`           | N/A                               | Validate JWT, extract `tenant_id`, assemble `correlationId`      | Identity Layer          |
| 2    | `gateway`           | `HERMES` (service binding)        | Enqueue `CapabilityInvokeRequest` to Hermes                      | Ingress → Capability    |
| 3    | `hermes`            | `ACT_QUEUE`                       | DO acquires message, checks idempotency key                      | Capability Layer        |
| 4    | `hermes`            | `TWIN_ORCHESTRATOR` (binding)     | If L2/L3/L4, route to Twin for OODA                              | Capability → Continuity |
| 5    | `twin-orchestrator` | D1 + KV + Vectorize               | Orient: assemble Entity360 + Memory + Knowledge                  | Continuity Layer        |
| 6    | `twin-orchestrator` | `THINK` (binding)                 | Decide: LLM reasoning, proposal generation                       | Continuity Layer        |
| 7    | `twin-orchestrator` | `GOVERN` (binding)                | Confidence scoring, proposal emission                            | Governance Layer        |
| 8    | `govern`            | D1 `action_proposals`             | Gate: ≥0.85 auto, 0.70-0.85 HITL, <0.70 discard                  | Governance Layer        |
| 9    | `govern`            | `ACT_QUEUE`                       | Approved → enqueue to act                                        | Governance → Provider   |
| 10   | `act`               | D1 + outbound adapters            | Execute: adapter selection, credential wall, Entity360 injection | Provider Fabric         |
| 11   | `act`               | `PIPELINE_QUEUE`                  | Writeback: result → Pipeline → Spine                             | Provider → Spine        |
| 12   | `pipeline`          | D1 `entities` + `spine_audit_log` | Commit: ONLY writer to Spine                                     | Spine Integrity         |
| 13   | `continuity`        | D1 `memory` + KV                  | Remember: compound into memory tiers                             | Memory Layer            |

---

## E.3 Knowledge Sharing Protocol (KSP)

### E.3.1 Protocol Overview

> **KSP is the contract for how knowledge moves between ecosystem participants.** It is not a separate network protocol. It is a schema and governance contract over the Spine.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    KNOWLEDGE SHARING PROTOCOL (KSP)                         │
│                                                                             │
│   ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐          │
│   │  Agent A │◄───►│  SPINE   │◄───►│  Agent B │◄───►│  Human   │          │
│   │ (twin-A) │     │ (shared) │     │ (twin-B) │     │ (desk)   │          │
│   └────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘          │
│        │                │                │                │                │
│        │   KSP Packet   │   KSP Packet   │   KSP Packet   │                │
│        │   (scoped)     │   (scoped)     │   (scoped)     │                │
│        │                │                │                │                │
│   ┌────▼────────────────▼────────────────▼────────────────▼─────┐          │
│   │              KSP GOVERNANCE LAYER (govern)                  │          │
│   │  • tenant_id isolation (HARD)                               │          │
│   │  • scope validation (read/write/admin)                      │          │
│   │  • confidence scoring (0.70/0.85)                           │          │
│   │  • audit trail (spine_audit_log)                            │          │
│   │  • retention policy (D1 + R2)                               │          │
│   └─────────────────────────────────────────────────────────────┘          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### E.3.2 KSP Packet Schema

```typescript
// packages/sdk/src/types/ksp.ts

/**
 * Knowledge Sharing Protocol Packet — the unit of knowledge transfer.
 * Every packet is: typed, scoped, attributed, timed, and governed.
 */
export interface KSPPacket {
  /** Unique packet ID (UUID v7 for time-sortability) */
  id: string;

  /** Protocol version */
  version: "ksp/2.0";

  /** Tenant isolation boundary — HARD GATE */
  tenantId: string;

  /** Source of the knowledge */
  source: KSPSource;

  /** Destination of the knowledge */
  destination: KSPDestination;

  /** The knowledge payload */
  payload: KSPPayload;

  /** Temporal context */
  timing: KSPTiming;

  /** Governance metadata */
  governance: KSPGovernance;

  /** Audit reference */
  audit: {
    logId: string;
    spineAuditLogId: string;
  };
}

export interface KSPSource {
  /** Source type */
  type: "agent" | "tool" | "human" | "twin" | "system" | "connector";

  /** Source ID (agent ID, user ID, tool ID) */
  id: string;

  /** Source name (for display) */
  name: string;

  /** Capability that produced this knowledge (if applicable) */
  capabilityId?: string;

  /** Provider that produced this knowledge (if applicable) */
  providerId?: string;
}

export interface KSPDestination {
  /** Target type */
  type: "broadcast" | "agent" | "tool" | "human" | "twin" | "memory" | "spine";

  /** Target ID (for directed packets) */
  id?: string;

  /** Scope filter — who can see this packet */
  visibility: "personal" | "work" | "organization" | "ai";
}

export interface KSPPayload {
  /** Payload type discriminator */
  type:
    | "observation"
    | "orientation"
    | "decision"
    | "action_result"
    | "memory_fragment"
    | "signal"
    | "proposal"
    | "evidence";

  /** The actual content — shape depends on type */
  content: unknown;

  /** Semantic embedding (Vectorize) for similarity search */
  embedding?: number[];

  /** Confidence score (0.0–1.0) for memory triage */
  confidence: number;

  /** References to related Spine entities */
  entityRefs?: string[]; // SSOC UUIDs

  /** References to related packets (lineage) */
  parentPacketIds?: string[];
}

export interface KSPTiming {
  /** Packet creation time */
  createdAt: string; // ISO 8601

  /** Valid until (for time-bounded knowledge) */
  expiresAt?: string;

  /** Time-to-live in seconds (for cacheable knowledge) */
  ttlSeconds?: number;
}

export interface KSPGovernance {
  /** Minimum role required to access */
  minRole: string;

  /** Required scopes */
  requiredScopes: string[];

  /** Whether this packet requires governance approval before distribution */
  approvalRequired: boolean;

  /** Classification level */
  classification: "public" | "internal" | "confidential" | "restricted";

  /** Data residency requirements */
  residency?: string; // e.g., "us-east", "eu-west"
}
```

### E.3.3 KSP Flow — Agent Shares Insight with Organization

```
┌─────────────────────────────────────────────────────────────────────────────┐
│           KSP FLOW: Agent A Shares Insight → Organization Memory             │
│                                                                             │
│  Agent A (twin-orchestrator-A)                                              │
│     │                                                                       │
│     │  1. Generates insight (OODA Decide phase)                             │
│     │     confidence: 0.92                                                  │
│     │                                                                       │
│     ▼                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  2. Assemble KSP Packet                                             │    │
│  │     source: { type: "twin", id: "twin-A", name: "Sales Twin" }      │    │
│  │     destination: { type: "memory", visibility: "organization" }     │    │
│  │     payload: { type: "memory_fragment", confidence: 0.92, ... }     │    │
│  │     governance: { minRole: "member", approvalRequired: false }      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│     │                                                                       │
│     │  POST /api/v1/knowledge/share                                         │
│     ▼                                                                       │
│  Gateway — validates JWT, extracts tenant_id                                │
│     │                                                                       │
│     │  3. Route to knowledge service (service binding)                      │
│     ▼                                                                       │
│  knowledge — semantic analysis, embedding generation                        │
│     │                                                                       │
│     │  4. Route to continuity (service binding)                             │
│     ▼                                                                       │
│  continuity — Memory Triage                                                 │
│     │  confidence ≥ 0.85 → ACTIVE memory (D1 + KV + Vectorize)            │
│     │  0.70–0.85 → STAGING memory (D1 only)                               │
│     │  < 0.70 → DISCARD (R2 cold storage)                                 │
│     │                                                                       │
│     │  5. Write to spine_audit_log                                         │
│     ▼                                                                       │
│  pipeline — commit audit entry                                              │
│     │                                                                       │
│     │  6. Broadcast to subscribers                                         │
│     ▼                                                                       │
│  hermes — enqueue to notification queue                                     │
│     │                                                                       │
│     │  SSE push to connected workbench clients                             │
│     │  WebSocket update to Twin Workbench                                  │
│     ▼                                                                       │
│  Organization Memory Updated                                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

### E.3.4 KSP Security Boundaries

| Boundary              | Enforcement                                        | Failure Mode          |
| --------------------- | -------------------------------------------------- | --------------------- |
| **Tenant Isolation**  | `WHERE tenant_id = ?` on every KSP query           | 403 fail-loud         |
| **Visibility Scope**  | `personal` < `work` < `organization` < `ai`        | Filter silently       |
| **Role Gate**         | `minRole` checked against RBAC in `tenants`        | 403 if insufficient   |
| **Scope Gate**        | `requiredScopes` checked against JWT `scope` claim | 403 if missing        |
| **Classification**    | `restricted` → requires `admin` role + approval    | Quarantine to staging |
| **Residency**         | Packet rejected if target region mismatch          | 422 with reason       |
| **Approval Required** | `approvalRequired: true` → routed to `govern`      | HITL queue            |

---

## E.4 Agent-to-Agent Communication (A2A)

### E.4.1 A2A Architecture — Spine as Shared Blackboard

> **A2A in v2.0 is NOT peer-to-peer.** Agents coordinate through the Spine as a shared blackboard, mediated by the ambient Twin layer. This prevents circular dependencies, ensures auditability, and maintains tenant isolation.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              A2A: SPINE-BASED COORDINATION (NOT PEER-TO-PEER)               │
│                                                                             │
│                                                                             │
│    Agent A ──────┐                                                          │
│   (Sales Twin)   │                                                          │
│                  │                                                          │
│                  │    ┌──────────────────────────────────────────┐          │
│                  │    │           SPINE BLACKBOARD               │          │
│                  ├───►│                                          │          │
│                  │    │  ┌─────────────┐   ┌─────────────┐       │          │
│    Agent B ──────┤    │  │  Intent A   │   │  Intent B   │       │          │
│   (CS Twin)      │    │  │  (proposal) │   │  (proposal) │       │          │
│                  │    │  └──────┬──────┘   └──────┬──────┘       │          │
│                  │    │         │                 │              │          │
│                  │    │         ▼                 ▼              │          │
│                  │    │  ┌─────────────────────────────────┐     │          │
│                  ├───►│  │     GOVERN (arbitration)        │     │          │
│                  │    │  │  • Detect conflicts             │     │          │
│    Agent C ──────┤    │  │  • Score joint confidence       │     │          │
│   (Finance Twin) │    │  │  • Enforce priority rules       │     │          │
│                  │    │  │  • Escalate to human if needed  │     │          │
│                  │    │  └─────────────────────────────────┘     │          │
│                  │    │         │                 │              │          │
│                  │    │         ▼                 ▼              │          │
│                  │    │  ┌─────────────┐   ┌─────────────┐       │          │
│                  └───►│  │  Action A   │   │  Action B   │       │          │
│                       │  │  (approved) │   │  (approved) │       │          │
│                       │  └─────────────┘   └─────────────┘       │          │
│                       │                                          │          │
│                       └──────────────────────────────────────────┘          │
│                                    ▲                                        │
│                                    │                                        │
│                            ┌───────┴───────┐                                │
│                            │   TWIN LAYER   │                                │
│                            │   (ambient)    │                                │
│                            │  • OODA cycle  │                                │
│                            │  • Context asm │                                │
│                            │  • Reasoning   │                                │
│                            └───────────────┘                                │
│                                                                             │
│  RULE: Agents never call each other directly. They read/write the Spine.    │
│        The Twin layer observes and reasons across agent outputs.            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### E.4.2 A2A Intent Schema

```typescript
// packages/sdk/src/types/a2a.ts

/**
 * A2A Intent — an agent's declared intention published to the Spine.
 * Other agents read intents and may respond with complementary or conflicting intents.
 */
export interface A2AIntent {
  /** Unique intent ID */
  id: string;

  /** The agent that published this intent */
  agentId: string;

  /** Agent type */
  agentType: "twin" | "autonomous" | "workflow" | "human";

  /** Tenant isolation */
  tenantId: string;

  /** Intent classification */
  intentType: A2AIntentType;

  /** The target capability or entity */
  target: {
    type: "capability" | "entity" | "memory" | "projection";
    id: string;
  };

  /** What the agent wants to do */
  action: {
    verb: "propose" | "request" | "inform" | "query" | "warn" | "block";
    description: string;
    payload: unknown;
  };

  /** Confidence in this intent (0.0–1.0) */
  confidence: number;

  /** Priority relative to other intents */
  priority: "critical" | "high" | "normal" | "low";

  /** Time bounds */
  timing: {
    publishedAt: string;
    validUntil?: string;
    executeAfter?: string; // Defer execution until this time
  };

  /** Dependencies — other intents that must resolve first */
  dependencies?: string[]; // Intent IDs

  /** Response to another intent (for threading) */
  inReplyTo?: string;

  /** Governance status */
  governance: {
    status: "pending" | "approved" | "rejected" | "escalated";
    proposalId?: string;
    approvedBy?: string;
    approvedAt?: string;
  };
}

export type A2AIntentType =
  | "cross-sell" // Sales agent → CS agent: opportunity signal
  | "churn-risk" // CS agent → Sales/Finance: retention alert
  | "data-request" // Any agent → Spine: needs context
  | "action-proposal" // Any agent → Govern: proposes action
  | "memory-share" // Any agent → Memory: shares insight
  | "conflict" // Agent → Agent: detects conflicting intent
  | "handoff" // Agent → Human: needs human intervention
  | "sync-request"; // Agent → Connector: trigger sync

/**
 * A2A Arbitration Result — produced by the Twin layer when conflicting intents detected.
 */
export interface A2AArbitration {
  id: string;
  tenantId: string;
  conflictType: "resource" | "priority" | "dependency" | "policy";
  conflictingIntents: string[];
  resolution: "merge" | "sequence" | "reject" | "escalate";
  mergedIntent?: A2AIntent;
  sequence?: string[]; // Ordered intent IDs
  reason: string;
  arbitratedBy: string; // Twin instance ID
  arbitratedAt: string;
}
```

### E.4.3 A2A Flow — Cross-Sell Signal from Sales Twin to CS Twin

```
┌─────────────────────────────────────────────────────────────────────────────┐
│     A2A FLOW: Sales Twin Detects Upsell → CS Twin Takes Action              │
│                                                                             │
│  SALES TWIN (twin-orchestrator-sales)                                       │
│     │                                                                       │
│     │  1. OBSERVE: Account "Acme Corp" shows expansion signals              │
│     │     (new team members, API usage spike)                               │
│     │                                                                       │
│     │  2. ORIENT: Entity360 shows CS health score = 0.91                    │
│     │     Memory: recent positive NPS, no open tickets                      │
│     │                                                                       │
│     │  3. DECIDE: Publish "cross-sell" intent to Spine                      │
│     ▼                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  A2AIntent:                                                         │    │
│  │    agentId: "twin-sales"                                            │    │
│  │    intentType: "cross-sell"                                         │    │
│  │    target: { type: "entity", id: "account:acme-corp" }              │    │
│  │    action: { verb: "propose", description: "Upsell to Enterprise",  │    │
│  │              payload: { expansionSignals: [...] } }                 │    │
│  │    confidence: 0.89                                                 │    │
│  │    priority: "high"                                                 │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│     │                                                                       │
│     │  POST via mcp-connector → Gateway → pipeline                          │
│     ▼                                                                       │
│  SPINE — intent stored in `a2a_intents` table (D1)                          │
│     │                                                                       │
│     │  4. TWIN LAYER (ambient) observes new intent                          │
│     │     twin-orchestrator reads all unprocessed intents for tenant        │
│     ▼                                                                       │
│  CS TWIN (twin-orchestrator-cs)                                             │
│     │                                                                       │
│     │  5. Reads intent from Spine (WHERE tenant_id = ? AND agentId != self) │
│     │                                                                       │
│     │  6. ORIENT: Fetch Account context, recent tickets, NPS                │
│     │                                                                       │
│     │  7. DECIDE: Confidence = 0.87, agrees with upsell                     │
│     │     Publishes response intent: "action-proposal" to govern            │
│     ▼                                                                       │
│  GOVERN — joint confidence = 0.88 (0.89 × 0.87 weighted)                    │
│     │  ≥ 0.85 → AUTO-APPROVE                                              │
│     ▼                                                                       │
│  ACT — execute "salesforce.opportunity.create" + "slack.notify-cs-channel"  │
│     │                                                                       │
│     ▼                                                                       │
│  PIPELINE — writeback to Spine                                              │
│  CONTINUITY — compound into Organization Memory                             │
│                                                                             │
│  RESULT: CS team notified in Slack with full context. No manual routing.    │
│          Audit trail: spine_audit_log entries for every step.               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### E.4.4 A2A Security Model

| Threat                      | Mitigation                                       | Enforcement Point            |
| --------------------------- | ------------------------------------------------ | ---------------------------- |
| Agent impersonation         | JWT signing + `agent_id` registry                | `gateway` + `agent-registry` |
| Cross-tenant intent leakage | `WHERE tenant_id = ?` on ALL intent queries      | All services                 |
| Intent flooding             | Rate-limit per agent: 100 intents/min            | `gateway` + `hermes`         |
| Circular dependencies       | Dependency graph validation (DAG check)          | `twin-orchestrator`          |
| Priority inversion          | `critical` intents bypass normal queue           | `hermes` (queue priority)    |
| Unauthorized arbitration    | Only `twin-orchestrator` instances may arbitrate | `govern` + RBAC              |

---

## E.5 SDK Variants

### E.5.1 SDK Taxonomy

The Bridge exposes **five SDK variants** — same underlying contract, different fidelity and bundle size. Each variant is a separate npm package under the `@iw` scope.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SDK VARIANT SPECTRUM                                │
│                                                                             │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐  ┌──────┐ │
│   │ @iw/sdk-full│  │@iw/sdk-lite │  │@iw/sdk-content│ │@iw/sdk- │  │@iw/  │ │
│   │             │  │             │  │               │ │ minimal │  │sdk-  │ │
│   │  ~180 KB    │  │   ~85 KB    │  │    ~45 KB     │ │  ~12 KB │  │head- │ │
│   │  gzipped    │  │   gzipped   │  │   gzipped     │ │ gzipped │  │less  │ │
│   │             │  │             │  │               │ │         │  │~3 KB │ │
│   └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └────┬────┘  └──┬───┘ │
│          │                │                │              │          │     │
│          ▼                ▼                ▼              ▼          ▼     │
│    Full-stack      Browser/Node      Content-only    Telemetry   Server-  │
│    SDK with        SDK with         SDK (read-only   + Events   side only │
│    all features    streaming        Discovery +            (no UI)        │
│    + UI helpers    + caching        Projections)                          │
│                                                                             │
│    Use case:       Use case:        Use case:      Use case:   Use case:   │
│    Workbench       Web apps,        Mobile apps,   Analytics   Background  │
│    builders,       dashboards,      embeddable     pipelines,  workers,    │
│    extension       CLI tools        widgets        logging     edge        │
│    developers                                                       functions│
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### E.5.2 SDK Interface Contracts

```typescript
// ============================================================
// @iw/sdk-full — The complete SDK (workbench + headless)
// ============================================================

import { IWBridge, WorkbenchUI, TwinPanel } from "@iw/sdk-full";

export interface SDKFullConfig {
  /** Bridge endpoint */
  baseUrl: string; // default: "https://api.integratewise.ai"

  /** Authentication */
  jwt: string;

  /** Tenant context (optional — extracted from JWT if omitted) */
  tenantId?: string;

  /** MCP endpoint for AI assistant integration */
  mcpEndpoint?: string; // default: "https://mcp.integratewise.ai/v1/mcp"

  /** Enable React UI components */
  enableUI: boolean;

  /** UI theme config */
  theme?: UIThemeConfig;

  /** Real-time transport: 'sse' | 'ws' | 'polling' */
  realtimeTransport: "sse" | "ws" | "polling";

  /** Maximum reconnect attempts */
  maxReconnects: number;

  /** Debug mode */
  debug: boolean;
}

export class IWBridgeFull {
  constructor(config: SDKFullConfig);

  // ── Core Capabilities ──
  invoke<T = unknown>(capability: string, payload: unknown): Promise<CapabilityInvokeResponse<T>>;
  discover(): Promise<DiscoveryResponse>;
  stream(capability: string, payload: unknown): AsyncIterable<StreamChunk>;

  // ── Projections ──
  getProjection(name: string, params?: Record<string, unknown>): Promise<Projection>;
  listProjections(): Promise<ProjectionSummary[]>;

  // ── Memory ──
  queryMemory(query: MemoryQuery): Promise<MemoryResult[]>;
  shareKnowledge(packet: KSPPacketInput): Promise<KSPPacket>;

  // ── Agent ──
  getTwin(): TwinSession;
  listAgents(): Promise<AgentSummary[]>;
  publishIntent(intent: A2AIntentInput): Promise<A2AIntent>;

  // ── Governance ──
  getProposals(filter?: ProposalFilter): Promise<Proposal[]>;
  approveProposal(proposalId: string): Promise<void>;
  rejectProposal(proposalId: string, reason?: string): Promise<void>;

  // ── Real-time ──
  onEvent(event: string, handler: EventHandler): Unsubscribe;
  onIntent(handler: IntentHandler): Unsubscribe;

  // ── UI Components (React) ──
  Workbench: typeof WorkbenchUI;
  TwinPanel: typeof TwinPanel;
  MemoryExplorer: typeof MemoryExplorer;
  ProposalQueue: typeof ProposalQueue;
}

// ============================================================
// @iw/sdk-lite — Browser/Node SDK (no UI, with streaming)
// ============================================================

import { IWBridgeLite } from "@iw/sdk-lite";

export interface SDKLiteConfig {
  baseUrl: string;
  jwt: string;
  tenantId?: string;
  realtimeTransport: "sse" | "polling";
  cacheEnabled: boolean;
  cacheTtlSeconds: number;
}

export class IWBridgeLite {
  constructor(config: SDKLiteConfig);

  invoke<T = unknown>(capability: string, payload: unknown): Promise<CapabilityInvokeResponse<T>>;
  stream(capability: string, payload: unknown): AsyncIterable<StreamChunk>;
  discover(): Promise<DiscoveryResponse>;
  queryMemory(query: MemoryQuery): Promise<MemoryResult[]>;
  onEvent(event: string, handler: EventHandler): Unsubscribe;

  // Lite has no UI components, no Twin session, no governance actions
}

// ============================================================
// @iw/sdk-content — Content/readonly SDK (smallest interactive)
// ============================================================

import { IWContentSDK } from "@iw/sdk-content";

export interface SDKContentConfig {
  baseUrl: string;
  jwt: string;
  tenantId?: string;
}

export class IWContentSDK {
  constructor(config: SDKContentConfig);

  // Read-only operations only
  discover(): Promise<DiscoveryResponse>;
  getProjection(name: string): Promise<Projection>;
  queryMemory(query: MemoryQuery): Promise<MemoryResult[]>;

  // No invoke, no stream, no write operations
}

// ============================================================
// @iw/sdk-minimal — Telemetry + Events only
// ============================================================

import { IWMinimalSDK } from "@iw/sdk-minimal";

export interface SDKMinimalConfig {
  baseUrl: string;
  jwt: string;
  tenantId?: string;
}

export class IWMinimalSDK {
  constructor(config: SDKMinimalConfig);

  // Events and telemetry only
  track(event: string, properties?: Record<string, unknown>): Promise<void>;
  onEvent(event: string, handler: EventHandler): Unsubscribe;
  health(): Promise<HealthStatus>;
}

// ============================================================
// @iw/sdk-headless — Server-side / edge functions
// ============================================================

import { IWHeadlessSDK } from "@iw/sdk-headless";

export interface SDKHeadlessConfig {
  baseUrl: string;
  /** API Key (server-side only) OR JWT */
  apiKey?: string;
  jwt?: string;
  tenantId: string; // Required for headless
}

export class IWHeadlessSDK {
  constructor(config: SDKHeadlessConfig);

  // Full capability invocation (server-side has no governance gate —
  // assumes calling service has already gated)
  invoke<T = unknown>(capability: string, payload: unknown): Promise<CapabilityInvokeResponse<T>>;

  // Batch operations
  invokeBatch(requests: CapabilityInvokeRequest[]): Promise<CapabilityInvokeResponse[]>;

  // Admin operations (requires admin scope)
  getTenantConfig(): Promise<TenantConfig>;
  updateTenantConfig(config: Partial<TenantConfig>): Promise<void>;

  // No real-time, no UI, no streaming (server-side is request/response)
}
```

### E.5.3 SDK Package Structure

```
packages/
├── sdk-full/
│   ├── src/
│   │   ├── index.ts              # Main export: IWBridgeFull
│   │   ├── client.ts             # HTTP client + retry logic
│   │   ├── streaming.ts          # SSE/WebSocket stream handler
│   │   ├── capabilities.ts       # Capability invocation wrappers
│   │   ├── projections.ts        # Projection fetch + cache
│   │   ├── memory.ts             # Memory query + KSP
│   │   ├── agent.ts              # Twin session + A2A intents
│   │   ├── governance.ts         # Proposal review actions
│   │   ├── realtime.ts           # Event bus (SSE/WS/polling)
│   │   ├── ui/                   # React components
│   │   │   ├── Workbench.tsx
│   │   │   ├── TwinPanel.tsx
│   │   │   ├── MemoryExplorer.tsx
│   │   │   └── ProposalQueue.tsx
│   │   └── types.ts              # Re-exports from @iw/sdk-types
│   ├── package.json
│   └── tsconfig.json
│
├── sdk-lite/
│   ├── src/
│   │   ├── index.ts
│   │   ├── client.ts             # Shared HTTP logic (same as sdk-full)
│   │   ├── streaming.ts          # SSE only
│   │   ├── capabilities.ts
│   │   ├── projections.ts
│   │   ├── memory.ts
│   │   └── realtime.ts
│   └── package.json
│
├── sdk-content/
│   ├── src/
│   │   ├── index.ts
│   │   ├── client.ts             # Simple fetch wrapper
│   │   ├── discovery.ts
│   │   ├── projections.ts
│   │   └── memory.ts             # Read-only queries
│   └── package.json
│
├── sdk-minimal/
│   ├── src/
│   │   ├── index.ts
│   │   ├── client.ts             # Tiny fetch wrapper (~2KB)
│   │   ├── events.ts
│   │   └── health.ts
│   └── package.json
│
├── sdk-headless/
│   ├── src/
│   │   ├── index.ts
│   │   ├── client.ts             # Node.js fetch / undici
│   │   ├── capabilities.ts       # Full invoke + batch
│   │   └── admin.ts              # Tenant management
│   └── package.json
│
└── sdk-types/                    # SHARED types package (all SDKs depend on this)
    ├── src/
    │   ├── capability.ts
    │   ├── discovery.ts
    │   ├── ksp.ts
    │   ├── a2a.ts
    │   ├── memory.ts
    │   ├── governance.ts
    │   └── events.ts
    └── package.json
```

### E.5.4 SDK Authentication Patterns

```typescript
// packages/sdk-types/src/auth.ts

/**
 * Authentication contract for all SDK variants.
 * The Gateway is the single source of truth for auth.
 */
export interface SDKAuth {
  /** JWT issued by Gateway (primary auth for browser clients) */
  jwt?: string;

  /** API Key for server-to-server calls */
  apiKey?: string;

  /** Tenant ID (extracted from JWT if omitted) */
  tenantId?: string;

  /** User ID (extracted from JWT if omitted) */
  userId?: string;
}

/**
 * Every SDK request carries these headers:
 *
 * Authorization: Bearer <jwt_or_apikey>
 * x-tenant-id: <tenant_id>        ← injected by Gateway, never trusted from client
 * x-correlation-id: <uuid>         ← for distributed tracing
 * x-sdk-variant: <full|lite|content|minimal|headless>
 * x-sdk-version: <semver>
 */
```

---

## E.6 Ecosystem App Composition Patterns

### E.6.1 The Composition Model

> **Third-party apps compose on the Bridge by consuming capabilities, not by importing internal services.** The Bridge is a capability platform, not a PaaS.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ECOSYSTEM APP COMPOSITION PATTERNS                       │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                    THIRD-PARTY APP (e.g., CS Widget)                │   │
│   │                                                                     │   │
│   │  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐               │   │
│   │  │   @iw/sdk   │   │   @iw/sdk   │   │  @iw/sdk    │               │   │
│   │  │  -content   │   │   -lite     │   │   -full     │               │   │
│   │  │  (read-only)│   │  (streaming)│   │  (workbench)│               │   │
│   │  └──────┬──────┘   └──────┬──────┘   └──────┬──────┘               │   │
│   │         │                 │                 │                       │   │
│   │         └─────────────────┴─────────────────┘                       │   │
│   │                           │                                         │   │
│   │                    ┌──────┴──────┐                                  │   │
│   │                    │  Gateway    │                                  │   │
│   │                    │  (JWT gate) │                                  │   │
│   │                    └──────┬──────┘                                  │   │
│   │                           │                                         │   │
│   └───────────────────────────┼─────────────────────────────────────────┘   │
│                               │                                             │
│   ┌───────────────────────────┼─────────────────────────────────────────┐   │
│   │         CONTINUITY BRIDGE │                                         │   │
│   │                           ▼                                         │   │
│   │  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐               │   │
│   │  │  Discovery  │   │  Capability │   │   Events    │               │   │
│   │  │  (GET /api/ │   │  (POST /api/│   │  (SSE /api/ │               │   │
│   │  │   v1/disco) │   │  v1/cap/...)│   │  v1/stream) │               │   │
│   │  └─────────────┘   └─────────────┘   └─────────────┘               │   │
│   │                                                                     │   │
│   │  The app NEVER imports: services/, packages/spine-schema/, D1       │   │
│   │  The app NEVER calls: act, pipeline, normalizer directly            │   │
│   │                                                                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  COMPOSITION PATTERNS:                                                      │
│  1. Embed Pattern      — iframe/widget using @iw/sdk-content                │
│  2. Plugin Pattern     — browser extension using @iw/sdk-lite               │
│  3. Workbench Pattern  — full app using @iw/sdk-full                        │
│  4. Webhook Pattern    — server receives events, uses @iw/sdk-headless      │
│  5. MCP Pattern        — AI assistant connects via MCP, no SDK needed       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### E.6.2 Composition Patterns Catalog

#### Pattern 1: Embed Pattern (iframe/widget)

```typescript
// Third-party app embeds a Bridge-powered widget
import { IWContentSDK } from "@iw/sdk-content";

const sdk = new IWContentSDK({
  baseUrl: "https://api.integratewise.ai",
  jwt: getTenantJWT(), // From host app auth
});

// Fetch discovery to learn what's available
const discovery = await sdk.discover();

// Render a read-only account health widget
const projection = await sdk.getProjection("cs-health", {
  accountId: props.accountId,
});

// Mount React component (if using @iw/sdk-full)
// Or render raw HTML from projection data
```

**Security:** Embed runs in sandboxed iframe. Host app provides JWT via `postMessage`. SDK validates JWT on every call.

#### Pattern 2: Plugin Pattern (browser extension)

```typescript
// Browser extension content script
import { IWBridgeLite } from "@iw/sdk-lite";

const bridge = new IWBridgeLite({
  baseUrl: "https://api.integratewise.ai",
  jwt: await chrome.storage.local.get("iw_jwt"),
  realtimeTransport: "sse",
  cacheEnabled: true,
});

// Listen for Twin proposals while user browses Salesforce
bridge.onEvent("twin.proposal", (proposal) => {
  showInPageNotification(proposal);
});

// Invoke capability from any page
bridge.invoke("salesforce.opportunity.update", {
  opportunityId: extractIdFromPage(),
  stage: "Closed Won",
});
```

**Security:** Extension manifest declares `api.integratewise.ai` as allowed host. CORS preflight validated by Gateway.

#### Pattern 3: Workbench Pattern (full app)

```typescript
// Custom workbench built on Bridge
import { IWBridgeFull } from '@iw/sdk-full';

const bridge = new IWBridgeFull({
  baseUrl: 'https://api.integratewise.ai',
  jwt: auth.jwt,
  enableUI: true,
  theme: customTheme,
  realtimeTransport: 'ws',
});

// Render full workbench with Twin panel
function App() {
  return (
    <div className="workbench">
      <bridge.Workbench projection="sales" />
      <bridge.TwinPanel />
      <bridge.MemoryExplorer />
      <bridge.ProposalQueue />
    </div>
  );
}
```

**Security:** Full SDK requires `scope: workbench` in JWT. UI components are sandboxed React trees with CSP.

#### Pattern 4: Webhook Pattern (server-side integration)

```typescript
// Third-party server receives Bridge webhooks
import { IWHeadlessSDK } from "@iw/sdk-headless";

const bridge = new IWHeadlessSDK({
  baseUrl: "https://api.integratewise.ai",
  apiKey: process.env.IW_API_KEY,
  tenantId: process.env.IW_TENANT_ID,
});

// Webhook handler
app.post("/webhooks/iw", async (req, res) => {
  const event = req.body;

  // Verify webhook signature
  verifyWebhookSignature(req);

  switch (event.type) {
    case "proposal.approved":
      await bridge.invoke("slack.notify", {
        channel: "#ops",
        message: `Proposal approved: ${event.proposalId}`,
      });
      break;

    case "memory.promoted":
      await syncToExternalKB(event.memory);
      break;
  }

  res.sendStatus(200);
});
```

**Security:** Webhook signatures use HMAC-SHA256. API keys are server-side only. Never exposed to browser.

#### Pattern 5: MCP Pattern (AI assistant integration)

```json
// No SDK needed — AI assistant connects via MCP directly
{
  "mcpServers": {
    "integratewise": {
      "type": "sse",
      "url": "https://mcp.integratewise.ai/v1/mcp",
      "headers": {
        "Authorization": "Bearer ${IW_JWT}"
      }
    }
  }
}
```

**Security:** MCP connection is read-only by default. Write capabilities require `scope: write` + governance approval.

### E.6.3 App Manifest Contract

```typescript
// packages/sdk-types/src/manifest.ts

/**
 * Ecosystem App Manifest — every third-party app registers with the Bridge.
 */
export interface EcosystemAppManifest {
  /** Unique app ID (reverse DNS) */
  id: string; // e.g., "com.acme.cswidget"

  /** Human name */
  name: string;

  /** Description for Discovery */
  description: string;

  /** App type */
  type: "embed" | "plugin" | "workbench" | "webhook" | "mcp-client";

  /** Required SDK variant */
  sdkVariant: "content" | "lite" | "full" | "headless";

  /** Minimum SDK version */
  minSdkVersion: string;

  /** Required scopes */
  requiredScopes: string[];

  /** Capabilities this app consumes */
  consumedCapabilities: string[];

  /** Capabilities this app provides (if any) */
  providedCapabilities?: Capability[];

  /** Webhook URL (for webhook-type apps) */
  webhookUrl?: string;

  /** Content Security Policy */
  csp: {
    allowedOrigins: string[];
    allowedConnectSrc: string[];
  };

  /** Data handling */
  dataHandling: {
    storesDataLocally: boolean;
    cachesInBrowser: boolean;
    piiAccess: boolean;
  };

  /** Registration */
  registeredBy: string; // User ID
  registeredAt: string;
  status: "pending" | "approved" | "rejected" | "revoked";
}
```

---

## E.7 Template Starter (`create-iw-app`)

### E.7.1 Template Architecture

```
create-iw-app/
├── templates/
│   ├── embed-widget/           # Pattern 1: iframe/widget
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── main.ts         # Widget entry point
│   │   │   ├── bridge.ts       # @iw/sdk-content init
│   │   │   └── widget.tsx      # React widget component
│   │   └── README.md
│   │
│   ├── browser-extension/      # Pattern 2: browser plugin
│   │   ├── manifest.json
│   │   ├── src/
│   │   │   ├── background.ts   # Service worker
│   │   │   ├── content.ts      # Content script
│   │   │   ├── bridge.ts       # @iw/sdk-lite init
│   │   │   └── popup.tsx       # Extension popup
│   │   └── README.md
│   │
│   ├── workbench-app/          # Pattern 3: full workbench
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── App.tsx
│   │   │   ├── bridge.ts       # @iw/sdk-full init
│   │   │   ├── pages/
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── TwinPage.tsx
│   │   │   │   └── Settings.tsx
│   │   │   └── components/
│   │   └── README.md
│   │
│   ├── webhook-server/         # Pattern 4: server-side webhook
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── server.ts       # Express/Fastify server
│   │   │   ├── bridge.ts       # @iw/sdk-headless init
│   │   │   ├── webhooks.ts     # Webhook handlers
│   │   │   └── verify.ts       # Signature verification
│   │   └── README.md
│   │
│   └── mcp-client/             # Pattern 5: AI assistant client
│       ├── package.json
│       ├── src/
│       │   ├── client.ts       # MCP client setup
│       │   └── prompts/        # System prompts for Bridge
│       └── README.md
│
├── src/
│   ├── index.ts                # CLI entry: create-iw-app <template>
│   ├── init.ts                 # Project scaffolding logic
│   └── validate.ts             # Manifest validation
│
├── package.json
└── README.md
```

### E.7.2 Template Quick-Start

```bash
# Install the CLI
npm install -g @iw/create-app

# Create a new ecosystem app
create-iw-app my-cs-widget --template embed-widget --sdk content

# Templates: embed-widget | browser-extension | workbench-app | webhook-server | mcp-client
# SDKs:      content | lite | full | minimal | headless

cd my-cs-widget
npm install
npm run dev          # Local dev server with Bridge sandbox
npm run build        # Production build
npm run register     # Register app manifest with Bridge
```

### E.7.3 Template Bootstrap Code

```typescript
// templates/embed-widget/src/bridge.ts

import { IWContentSDK } from "@iw/sdk-content";

/**
 * Bridge client initialization for embed widget pattern.
 * The host page injects the JWT via window.postMessage.
 */
export function createBridge() {
  return new IWContentSDK({
    baseUrl: import.meta.env.VITE_BRIDGE_URL || "https://api.integratewise.ai",
    jwt: extractJWTFromParent(),
  });
}

function extractJWTFromParent(): string {
  // Host app sends JWT via postMessage
  return new Promise((resolve) => {
    window.addEventListener("message", (e) => {
      if (e.origin !== "https://app.integratewise.ai") return;
      if (e.data.type === "IW_JWT") resolve(e.data.jwt);
    });
  });
}

// ───────────────────────────────────────────────────────────────────────────
// templates/workbench-app/src/bridge.ts
// ───────────────────────────────────────────────────────────────────────────

import { IWBridgeFull } from "@iw/sdk-full";

export const bridge = new IWBridgeFull({
  baseUrl: import.meta.env.VITE_BRIDGE_URL,
  jwt: localStorage.getItem("iw_jwt")!,
  enableUI: true,
  theme: {
    primary: "#0F172A",
    accent: "#3B82F6",
    surface: "#F8FAFC",
  },
  realtimeTransport: "ws",
  maxReconnects: 5,
  debug: import.meta.env.DEV,
});

// Auto-refresh JWT before expiry
bridge.onEvent("auth.token_expiring", async () => {
  const newToken = await refreshToken();
  bridge.setJWT(newToken);
});

// ───────────────────────────────────────────────────────────────────────────
// templates/webhook-server/src/bridge.ts
// ───────────────────────────────────────────────────────────────────────────

import { IWHeadlessSDK } from "@iw/sdk-headless";

export const bridge = new IWHeadlessSDK({
  baseUrl: process.env.BRIDGE_URL!,
  apiKey: process.env.IW_API_KEY!,
  tenantId: process.env.IW_TENANT_ID!,
});

// Health check on startup
bridge.health().then((status) => {
  if (status.status !== "healthy") {
    console.error("Bridge unhealthy:", status);
    process.exit(1);
  }
});
```

---

## E.8 Integration Points with Adjacent Layers

### E.8.1 North-South Integration Matrix

| Ecosystem Component     | North Bound (Ingress)                   | South Bound (Egress)                        | Adjacent Layer          |
| ----------------------- | --------------------------------------- | ------------------------------------------- | ----------------------- |
| **Capability Registry** | Discovery API (`GET /api/v1/discovery`) | `agent-registry` service binding            | Identity + Capability   |
| **Capability Router**   | `HERMES` queue consumer                 | `ACT_QUEUE` producer                        | Capability + Governance |
| **KSP Packet Bus**      | `mcp-connector` inbound                 | `knowledge` + `continuity` service bindings | Continuity + Knowledge  |
| **A2A Intent Bus**      | `twin-orchestrator` read                | `pipeline` write + `spine_audit_log`        | Continuity + Governance |
| **SDK Client**          | `gateway` HTTP/SSE                      | Consumer app runtime                        | Identity (JWT)          |
| **Template Starter**    | `gateway` registration API              | `agent-registry` manifest storage           | Registry                |

### E.8.2 Service Binding Map (Ecosystem-Relevant)

```typescript
// apps/gateway/src/bindings.ts — Ecosystem-relevant bindings

export interface ServiceBindings {
  // Tier 0 — Ingress
  GATEWAY: Fetcher; // Self
  WEBHOOK_INGRESS: Fetcher;

  // Tier 1 — Tenant & Sync
  TENANTS: Fetcher;
  CONNECTOR: Fetcher;
  CONNECTOR_SYNC: Fetcher;
  NORMALIZER: Fetcher;
  LOADER: Fetcher;

  // Tier 2 — Projection (Ecosystem reads these)
  PIPELINE: Fetcher; // Spine writer — ecosystem NEVER calls directly
  TWIN_ORCHESTRATOR: Fetcher; // OODA engine — ecosystem routes through Gateway
  L2: Fetcher;
  INTELLIGENCE: Fetcher; // Context assembly
  KNOWLEDGE: Fetcher; // KSP semantic layer
  GOVERN: Fetcher; // Governance gate
  STORE: Fetcher;
  ACT: Fetcher; // Outbound execution — ecosystem NEVER calls directly
  SPINE_V2: Fetcher;

  // Tier 3 — Runtime (Ecosystem orchestrates through these)
  HERMES: Fetcher; // Message queue — primary ecosystem router
  TRIAGE: Fetcher; // Confidence routing (runs inside Hermes)
  WORKFLOW: Fetcher;
  IW_AGENT_RUNTIME: Fetcher; // Agent sandbox
  MCP_CONNECTOR: Fetcher; // Inbound MCP pool

  // Tier 4 — Supporting (Ecosystem metadata)
  AGENT_REGISTRY: Fetcher; // Capability catalog
  BILLING: Fetcher;
  ADMIN: Fetcher;
  FOLDER_WATCHER: Fetcher;
  CONTINUITY: Fetcher; // Memory substrate
  TELEMETRY: Fetcher;
  THINK: Fetcher; // LLM orchestration
}
```

### E.8.3 Queue Topology (Ecosystem-Relevant)

| Queue                        | Publisher                     | Consumer            | Purpose                                | Ecosystem Role                 |
| ---------------------------- | ----------------------------- | ------------------- | -------------------------------------- | ------------------------------ |
| `DISCOVERY_CACHE_INVALIDATE` | `agent-registry`, `connector` | `gateway`           | Cache bust on capability changes       | Keeps Discovery fresh          |
| `ACT_QUEUE`                  | `hermes`, `govern`            | `act`               | Approved action execution              | Ecosystem actions execute here |
| `PIPELINE_QUEUE`             | `act`, `normalizer`           | `pipeline`          | Spine write requests                   | Ecosystem results written here |
| `KSP_BROADCAST`              | `knowledge`, `continuity`     | `hermes`            | Knowledge packet distribution          | KSP fan-out                    |
| `A2A_INTENT`                 | `twin-orchestrator`           | `twin-orchestrator` | Intent publication (self-consuming DO) | A2A blackboard                 |
| `NOTIFICATION_SSE`           | `hermes`                      | `gateway`           | SSE push to connected clients          | Real-time ecosystem updates    |
| `CONNECTOR_SYNC_QUEUE`       | `loader`, `connector-sync`    | `connector-sync`    | Provider sync jobs                     | Ecosystem data freshness       |

---

## E.9 Security Boundaries

### E.9.1 Ecosystem Security Model

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ECOSYSTEM SECURITY BOUNDARIES                            │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  LAYER 1: Identity Gate (Gateway)                                   │   │
│   │  • JWT validation (RS256)                                           │   │
│   │  • tenant_id extraction from JWT claim ONLY                         │   │
│   │  • Rate-limit per tenant: 1000 req/min (pro), 100 req/min (free)    │   │
│   │  • API Key rotation (90 days)                                       │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                              │
│   ┌──────────────────────────┼──────────────────────────────────────────┐   │
│   │  LAYER 2: Capability Gate (agent-registry + Gateway)                │   │
│   │  • Discovery filtered by tenant plan + RBAC                         │   │
│   │  • Capability schema validation on invoke                           │   │
│   │  • Scope enforcement: `scope: read` default, `scope: write` opt-in  │   │
│   │  • Deprecated capabilities hidden after sunset date                 │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                              │
│   ┌──────────────────────────┼──────────────────────────────────────────┐   │
│   │  LAYER 3: Governance Gate (govern)                                  │   │
│   │  • Confidence scoring: ≥0.85 auto, 0.70–0.85 HITL, <0.70 discard    │   │
│   │  • Proposal expiry: 48 hours default                                │   │
│   │  • Audit: every decision → spine_audit_log                          │   │
│   │  • Escalation: L4 capabilities NEVER auto-execute                   │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                              │
│   ┌──────────────────────────┼──────────────────────────────────────────┐   │
│   │  LAYER 4: Memory Gate (continuity + triage)                         │   │
│   │  • KSP packet validation: tenant_id, scope, classification          │   │
│   │  • Memory triage: ≥0.85 active, 0.70–0.85 staging, <0.70 discard    │   │
│   │  • Retention: active 30 days, staging 90 days, archived 7 years     │   │
│   │  • Cross-scope leakage: personal < work < org < ai (HARD filter)    │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                              │
│   ┌──────────────────────────┼──────────────────────────────────────────┐   │
│   │  LAYER 5: Execution Gate (act + adapters)                           │   │
│   │  • Credential wall: per-tenant, never shared                        │   │
│   │  • Adapter sandbox: provider errors don't crash Bridge              │   │
│   │  • Circuit breaker: 5 errors → 30s cooldown                         │   │
│   │  • Entity360 injection: context enriched before outbound call       │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### E.9.2 SDK Security Invariants

| Invariant                                                    | Enforcement                       | Violation                               |
| ------------------------------------------------------------ | --------------------------------- | --------------------------------------- |
| **JWT never stored in localStorage for SDK-headless**        | Server-side API keys only         | SDK-headless throws if jwt provided     |
| **SDK-content never invokes write capabilities**             | Runtime schema check              | 403 from Gateway                        |
| **SDK-lite streaming requires `scope: stream`**              | JWT scope validation              | SSE connection rejected                 |
| **Cross-origin SDK calls require app manifest registration** | Gateway CORS + manifest check     | 403 with `X-IW-App-Not-Registered`      |
| **SDK version compatibility checked on every call**          | `x-sdk-version` header validation | 426 Upgrade Required                    |
| **KSP packets without tenant_id are quarantined**            | `continuity` validation           | Packet logged to `ksp_quarantine` table |

---

## E.10 Metrics & Observability

### E.10.1 Ecosystem Metrics

```typescript
// packages/sdk-types/src/telemetry.ts

export interface EcosystemMetrics {
  // Capability Fabric
  "capability.invocations.total": Counter;
  "capability.invocations.success": Counter;
  "capability.invocations.error": Counter;
  "capability.invocations.latency": Histogram; // ms
  "capability.discovery.cache_hit_rate": Gauge; // 0–1

  // KSP
  "ksp.packets.sent": Counter;
  "ksp.packets.received": Counter;
  "ksp.packets.quarantined": Counter;
  "ksp.memory.promoted": Counter;
  "ksp.memory.staged": Counter;
  "ksp.memory.discarded": Counter;

  // A2A
  "a2a.intents.published": Counter;
  "a2a.intents.resolved": Counter;
  "a2a.conflicts.detected": Counter;
  "a2a.arbitrations.completed": Counter;

  // SDK
  "sdk.connections.active": Gauge; // Per variant
  "sdk.streaming.bytes": Counter;
  "sdk.errors.timeout": Counter;
  "sdk.errors.auth": Counter;

  // Ecosystem Apps
  "ecosystem.apps.registered": Gauge;
  "ecosystem.apps.invocations": Counter; // Per app ID
}
```

---

## E.11 Glossary

| Term                  | Definition                                                                                                                          |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Capability**        | A named, versioned, discoverable business action with a strict input/output schema.                                                 |
| **Capability Fabric** | The mesh of registries, routers, and execution engines that makes capabilities composable.                                          |
| **KSP**               | Knowledge Sharing Protocol — the schema and governance contract for moving knowledge between ecosystem participants.                |
| **A2A**               | Agent-to-Agent communication — Spine-based coordination (not peer-to-peer).                                                         |
| **Discovery**         | The canonical API (`GET /api/v1/discovery`) that tells consumers what exists and what they can do.                                  |
| **Twin**              | The ambient reasoning layer — not a separate entity, but the emergent property of OODA across the Capability and Continuity layers. |
| **Spine**             | The single source of truth for context — entities, relationships, memory, audit.                                                    |
| **OODA**              | Observe → Orient → Decide → Act — the decision cycle running across Capability and Continuity.                                      |
| **Governance Gate**   | The 0.70/0.85 confidence threshold system that governs execution and memory promotion.                                              |

---

## E.12 Version History

| Version | Date       | Changes                                                                                                                                                                                                       |
| ------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| v1.0.0  | 2026-06-15 | Initial ecosystem specification (part of FINAL_E2E_SYSTEM)                                                                                                                                                    |
| v2.0.0  | 2026-07-02 | **This document.** Separate Capability Fabric, KSP, A2A, SDK variants, composition patterns, template starter. SDK split into 5 variants. A2A formalized as Spine-based (not P2P). KSP packet schema defined. |

---

**END OF DOCUMENT**

_IntegrateWise Continuity Bridge v2.0 — Ecosystem Architecture & SDK Specification. This is the definitive reference for the Capability Fabric Model, Knowledge Sharing Protocol, Agent-to-Agent Communication, SDK Variants, Ecosystem App Composition Patterns, and Template Starter domains._

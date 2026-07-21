# Capability Layer and OODA Runtime — IntegrateWise Continuity Bridge v2.0

**Domain:** Capability Layer and OODA Runtime — Capability Registry, Platform SDK, Platform Contracts, Context Assembly, Capability Runtime, ADK Runtime, MCP Runtime, Execution Routing, OODA Phase Mapping, Agent vs Pipeline Boundaries  
**Status:** STAGE 1/2 DEEP-DIVE — PRODUCTION SPECIFICATION  
**Version:** 2.0.0-DRAFT  
**Date:** 2026-07-02  
**Supersedes:** v1.0.1-FINAL §6 (Tier 3), §7 (Layers 9–11), §12 (AI/Twin/Reasoning)

---

## 0. Domain Position in the 6-Layer Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Layer 1: Identity            — JWT, RBAC, Tenant Resolution, SSO           │
├─────────────────────────────────────────────────────────────────────────────┤
│  Layer 2: Ingress             — Gateway, Webhook-Ingress, Inbound MCP Pool  │
├─────────────────────────────────────────────────────────────────────────────┤
│▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶│
│  Layer 3: CAPABILITY          — THIS DOCUMENT — The OODA Execution Fabric   │
│                               Capability Registry · Context Assembly        │
│                               ADK Runtime · MCP Runtime · Execution Routing │
├─────────────────────────────────────────────────────────────────────────────┤
│  Layer 4: Continuity          — The Moat · Spine · Memory · Knowledge       │
│                               Twin-orchestrator (AMBIENT) · Triage          │
├─────────────────────────────────────────────────────────────────────────────┤
│  Layer 5: Governance          — Confidence Gates · HITL · Audit · Policy    │
├─────────────────────────────────────────────────────────────────────────────┤
│  Layer 6: Provider Fabric     — Adapter Modules · Nango · MCP · Native REST │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Invariant:** The Capability Layer is the **only** layer that can initiate outbound execution. It does not store context (that is Continuity), it does not govern (that is Governance), and it does not touch providers directly (that is the Provider Fabric via adapter modules). The Capability Layer **orchestrates** — it routes, assembles, reasons, and dispatches.

---

## 1. Core Doctrine for This Domain

> **The Capability Layer turns intent into execution. It does not own data. It does not own memory. It owns the contract between "what the user wants" and "what the system can do."**

The Capability Layer exposes five canonical primitives to all consumers:

| Primitive        | Contract                                             | Runtime                                               |
| ---------------- | ---------------------------------------------------- | ----------------------------------------------------- |
| **Identity**     | `whoami` — JWT claims, tenant, org, role             | `gateway` → `tenants`                                 |
| **Discovery**    | `GET /api/v1/discovery` — what exists, what can I do | `gateway` → `agent-registry` + `intelligence`         |
| **Projections**  | L1–L4 capability tiers — persona-specific views      | `l2`, `store`, `intelligence`                         |
| **Capabilities** | Named business actions with typed schemas            | `capability-registry` → `hermes` → `act` / `workflow` |
| **Events**       | Signal, Proposal, Approval, Outcome, Stream          | `hermes` + `mcp-connector` + `telemetry`              |

**The Twin is AMBIENT.** It is not a separate service that consumers call. It is the persistent reasoning substrate that lives _inside_ the Capability Runtime, accessible via the `twin-orchestrator` Durable Object, surfaced through capabilities like `twin/propose` and `insights`. Consumers never interact with `twin-orchestrator` directly — they invoke capabilities that _use_ the Twin.

---

## 2. Capability Registry

### 2.1 Purpose

The Capability Registry is the **single source of truth** for every named action the platform can perform. It is a living catalog — not a static file. Capabilities are registered at deploy time, discovered at runtime, and validated on every invocation.

### 2.2 Registry Schema (D1 + KV Cache)

```typescript
// packages/spine-schema/src/schema/capability-registry.ts

import { sqliteTable, text, integer, real, blob } from "drizzle-orm/sqlite-core";

export const capabilityRegistry = sqliteTable("capability_registry", {
  id: text("id").primaryKey(), // capability URI: "salesforce.opportunity.update"
  tenantId: text("tenant_id").notNull(), // NULLABLE for platform-level capabilities
  namespace: text("namespace").notNull(), // "salesforce", "twin", "platform"
  name: text("name").notNull(), // "opportunity.update"
  displayName: text("display_name"), // "Update Opportunity"
  description: text("description"),
  version: text("version").notNull().default("1.0.0"),

  // OODA phase classification
  oodaPhase: text("ooda_phase", {
    enum: ["observe", "orient", "decide", "act", "cross-phase"],
  }).notNull(),

  // Execution routing
  runtime: text("runtime", {
    enum: ["agent", "pipeline", "workflow", "mcp", "direct"],
  }).notNull(),

  // Routing target
  serviceBinding: text("service_binding").notNull(),
  handler: text("handler").notNull(), // "execute", "propose", "sync", "invoke"

  // Schema references
  inputSchema: text("input_schema"), // JSON Schema URI
  outputSchema: text("output_schema"), // JSON Schema URI

  // Governance
  requiresApproval: integer("requires_approval", { mode: "boolean" }).default(false),
  minConfidence: real("min_confidence").default(0.7),
  autoApproveThreshold: real("auto_approve_threshold").default(0.85),

  // Authorization
  requiredRoles: text("required_roles"), // JSON array of RBAC role IDs
  requiredScopes: text("required_scopes"), // JSON array: ["read", "write", "admin"]

  // Metadata
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  isDeprecated: integer("is_deprecated", { mode: "boolean" }).default(false),
  deprecationNote: text("deprecation_note"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Platform SDK Contract table — shared across all SDK clients
export const platformContracts = sqliteTable("platform_contracts", {
  id: text("id").primaryKey(), // contract URI
  capabilityId: text("capability_id").references(() => capabilityRegistry.id),
  contractType: text("contract_type", {
    enum: ["request", "response", "event", "error", "schema"],
  }).notNull(),
  schema: blob("schema", { mode: "json" }).notNull(), // JSON Schema
  version: text("version").notNull(),
  isBreaking: integer("is_breaking", { mode: "boolean" }).default(false),
  migrationPath: text("migration_path"), // URI to migration guide
});
```

### 2.3 Capability URI Format

```
capability := <namespace> "." <name>
namespace  := "platform" | "twin" | <provider> | "ecosystem"
provider   := "salesforce" | "hubspot" | "slack" | "github" | "stripe" | ...
name       := <resource> "." <action>
```

**Examples:**

- `salesforce.opportunity.update` — Provider capability, Act phase
- `twin.propose` — Twin reasoning capability, Decide phase
- `platform.discovery` — Platform capability, Observe phase
- `ecosystem.broadcast` — Cross-tenant knowledge sharing, Cross-phase

### 2.4 Registry Operations

```typescript
// services/agent-registry/src/registry.ts

interface CapabilityRegistryAPI {
  /**
   * Register a new capability. Called by service deploy hooks.
   * Writes to D1, invalidates KV cache.
   */
  register(capability: CapabilityRegistration): Promise<RegistrationResult>;

  /**
   * Resolve a capability URI to its runtime configuration.
   * Hot path — reads from KV cache first, D1 fallback.
   */
  resolve(capabilityUri: string, tenantId: string): Promise<ResolvedCapability>;

  /**
   * List capabilities filtered by tenant, role, OODA phase, runtime.
   * Powers Discovery endpoint.
   */
  list(filters: CapabilityFilter): Promise<CapabilityList>;

  /**
   * Validate a capability invocation against its schema and permissions.
   */
  validate(
    capabilityUri: string,
    tenantId: string,
    callerRole: string,
    payload: unknown
  ): Promise<ValidationResult>;

  /**
   * Deprecate a capability. Marks as deprecated, schedules removal.
   */
  deprecate(capabilityUri: string, note: string): Promise<void>;
}

interface CapabilityRegistration {
  id: string; // capability URI
  namespace: string;
  name: string;
  oodaPhase: OodaPhase;
  runtime: RuntimeType;
  serviceBinding: string; // e.g., "ACT", "WORKFLOW", "IW_AGENT_RUNTIME"
  handler: string;
  inputSchema: JsonSchema;
  outputSchema: JsonSchema;
  requiredRoles?: string[];
  requiredScopes?: string[];
  requiresApproval?: boolean;
  minConfidence?: number;
  autoApproveThreshold?: number;
}

interface ResolvedCapability {
  capability: typeof capabilityRegistry.$inferSelect;
  contract: PlatformContract;
  route: ServiceRoute; // Which binding + handler to call
  cacheHit: boolean;
}
```

### 2.5 Registry Caching Strategy

| Tier                     | TTL        | Source                                           | Invalidation                           |
| ------------------------ | ---------- | ------------------------------------------------ | -------------------------------------- |
| **KV Cache**             | 5 min      | `agent-registry` writes to KV on registration    | Service deploy, manual registry update |
| **D1**                   | Persistent | Source of truth                                  | Never directly by runtime              |
| **Service Binding Memo** | 30 sec     | `gateway` memoizes binding resolution per tenant | TTL expiry                             |

---

## 3. Platform SDK and Platform Contracts

### 3.1 Platform SDK — Consumer Contract

The Platform SDK (`packages/sdk/`) is the **only** consumer-facing code artifact. It provides typed wrappers around every capability. Consumers import `@integratewise/sdk` — they never import internal service topology.

```typescript
// packages/sdk/src/capabilities.ts

import { CapabilityClient } from "./client";

/**
 * The Platform SDK exposes every capability as a typed method.
 * Each method validates input against the capability's JSON Schema,
 * routes to the correct service binding, and deserializes the response.
 */
export class PlatformSDK {
  constructor(private client: CapabilityClient) {}

  // ── Observe Phase Capabilities ──

  async discover(tenantId: string): Promise<DiscoveryResponse> {
    return this.client.invoke("platform.discovery", tenantId, {});
  }

  async querySignals(tenantId: string, filter: SignalFilter): Promise<SignalStream> {
    return this.client.invoke("platform.signals.query", tenantId, filter);
  }

  // ── Orient Phase Capabilities ──

  async getEntity360(tenantId: string, entityType: string, entityId: string): Promise<Entity360> {
    return this.client.invoke("platform.entity360.get", tenantId, {
      entityType,
      entityId,
    });
  }

  async assembleContext(
    tenantId: string,
    request: ContextAssemblyRequest
  ): Promise<AssembledContext> {
    return this.client.invoke("intelligence.context.assemble", tenantId, request);
  }

  // ── Decide Phase Capabilities ──

  async twinPropose(tenantId: string, userId: string, prompt: string): Promise<Proposal> {
    return this.client.invoke("twin.propose", tenantId, {
      userId,
      prompt,
      // Twin is ambient — this capability routes to twin-orchestrator DO
    });
  }

  async twinAnalyze(tenantId: string, entityType: string, entityId: string): Promise<Analysis> {
    return this.client.invoke("twin.analyze", tenantId, {
      entityType,
      entityId,
    });
  }

  // ── Act Phase Capabilities ──

  async executeCapability(
    tenantId: string,
    capabilityUri: string,
    payload: unknown
  ): Promise<ExecutionResult> {
    return this.client.invoke(capabilityUri, tenantId, payload);
  }

  async runWorkflow(
    tenantId: string,
    workflowType: string,
    input: unknown
  ): Promise<WorkflowHandle> {
    return this.client.invoke("workflow.start", tenantId, {
      type: workflowType,
      input,
    });
  }

  // ── Ecosystem Capabilities ──

  async broadcastKnowledge(
    tenantId: string,
    knowledge: KnowledgePacket
  ): Promise<EcosystemReceipt> {
    return this.client.invoke("ecosystem.broadcast", tenantId, knowledge);
  }
}
```

### 3.2 Platform Contract Types

```typescript
// packages/sdk/src/contracts.ts

/**
 * Every capability invocation follows this envelope.
 * This is the wire format between Gateway and all internal services.
 */
export interface CapabilityInvocation {
  /** Capability URI being invoked */
  capability: string;

  /** Tenant scope — extracted from JWT claim, never from client payload */
  tenantId: string;

  /** User scope — extracted from JWT sub claim */
  userId: string;

  /** Caller role — from JWT rbac claim */
  role: string;

  /** Correlation ID for distributed tracing */
  correlationId: string;

  /** JWT scope array */
  scopes: string[];

  /** The actual payload — validated against capability.inputSchema */
  payload: unknown;

  /** Context assembly hints — passed to intelligence service */
  contextHints?: ContextHint[];

  /** Requested OODA phase — used for routing and telemetry */
  oodaPhase: OodaPhase;
}

export interface CapabilityResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: CapabilityError;

  /** Confidence score — populated by Decide-phase capabilities */
  confidence?: number;

  /** Governance state — for capabilities requiring approval */
  governance?: GovernanceState;

  /** Telemetry metadata */
  meta: ResponseMeta;
}

export interface CapabilityError {
  code: string; // "CAPABILITY_NOT_FOUND" | "VALIDATION_FAILED" | "GOVERNANCE_DENIED" | ...
  message: string;
  details?: Record<string, unknown>;
  retryable: boolean;
}

export interface ResponseMeta {
  correlationId: string;
  durationMs: number;
  serviceBinding: string;
  cacheHit: boolean;
  oodaPhase: OodaPhase;
}
```

---

## 4. Context Assembly

### 4.1 Purpose

Context Assembly is the **Orient phase engine**. It gathers Entity360, Memory, Knowledge, and Evidence into a structured context window for reasoning and execution. It runs in the `intelligence` service (Layer 7 in the 0–16 stack).

### 4.2 Assembly Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CONTEXT ASSEMBLY PIPELINE                          │
│                         (services/intelligence/src/)                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  INPUT: CapabilityInvocation + ContextHints                                 │
│       │                                                                     │
│       ▼                                                                     │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐     │
│  │  Stage 1    │──▶│  Stage 2    │──▶│  Stage 3    │──▶│  Stage 4    │     │
│  │  RESOLVE    │   │   FETCH     │   │  ASSEMBLE   │   │  OPTIMIZE   │     │
│  │             │   │             │   │             │   │             │     │
│  │ • Entity    │   │ • Spine     │   │ • Merge     │   │ • Truncate  │     │
│  │   resolution│   │   entities  │   │   sources   │   │   to window │     │
│  │ • SSOC bind │   │ • Memory    │   │ • Rank by   │   │ • Prioritize│     │
│  │ • Type infer│   │ • Knowledge │   │   relevance │   │ • Deduplicate│    │
│  └─────────────┘   │ • Evidence  │   │ • Inject    │   │ • Compress  │     │
│                    └─────────────┘   │   metadata  │   └─────────────┘     │
│                                      └─────────────┘                       │
│                                                                             │
│  OUTPUT: AssembledContext (Entity360 + Memory + Knowledge + Tools)         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.3 TypeScript Interfaces

```typescript
// packages/sdk/src/context.ts

/**
 * The output of Context Assembly — fed into the Twin for reasoning
 * or into the Capability Runtime for execution.
 */
export interface AssembledContext {
  /** The entity at the center of this context window */
  entity360: Entity360;

  /** Relevant memory entries — active tier, ranked by recency + relevance */
  memory: MemoryEntry[];

  /** Knowledge base hits — RAG results from Vectorize + AI Search */
  knowledge: KnowledgeHit[];

  /** Available tools/capabilities for this tenant + role */
  tools: ToolCatalog;

  /** Evidence — audit trail, past decisions, lineage */
  evidence: Evidence[];

  /** Relationship graph — connected entities within 2 hops */
  relationships: Relationship[];

  /** Assembled prompt — ready for LLM consumption */
  prompt: StructuredPrompt;

  /** Metadata about the assembly process */
  assemblyMeta: AssemblyMeta;
}

export interface Entity360 {
  id: string; // SSOC stable UUID
  type: string; // "account", "contact", "opportunity", ...
  tenantId: string;

  /** Canonical properties from Spine */
  properties: Record<string, unknown>;

  /** Computed traits from Normalizer */
  traits: EntityTrait[];

  /** Temporal context — when this entity was created, updated, last seen */
  timeline: EntityTimeline;

  /** Projection data — L1/L2 lens overlays */
  projections: ProjectionData;

  /** Source-of-truth provenance */
  provenance: Provenance[];
}

export interface MemoryEntry {
  id: string;
  scope: "Personal" | "Work" | "Organization" | "AI";
  tier: "active" | "staging" | "archived";
  content: string;
  confidence: number; // TriageBot score
  source: string; // Which service created this memory
  createdAt: Date;
  accessedAt: Date;
  reinforcementCount: number; // How many times this memory was reinforced
}

export interface KnowledgeHit {
  id: string;
  source: string; // Document name, URL, or KB entry
  content: string;
  embeddingScore: number; // Vectorize cosine similarity
  semanticScore: number; // AI Search relevance
  chunkIndex: number; // Which chunk of the document
}

export interface ToolCatalog {
  /** Capabilities available to this tenant + role + context */
  capabilities: ResolvedCapability[];

  /** Tool schemas for LLM function calling */
  schemas: Record<string, JsonSchema>;

  /** Tool descriptions for prompt injection */
  descriptions: ToolDescription[];
}

export interface StructuredPrompt {
  /** System prompt — platform identity, constraints, safety rules */
  system: string;

  /** Context window — the assembled Entity360 + Memory + Knowledge */
  context: string;

  /** Available tools — formatted for the specific LLM provider */
  tools: string;

  /** The user's actual request */
  user: string;

  /** Total token count estimate */
  estimatedTokens: number;

  /** Model that will consume this prompt */
  targetModel: string;
}

export interface AssemblyMeta {
  correlationId: string;
  stagesCompleted: string[]; // ["resolve", "fetch", "assemble", "optimize"]
  durationMs: number;
  sourcesQueried: number;
  memoryEntriesScanned: number;
  knowledgeChunksScanned: number;
  tokensBeforeOptimization: number;
  tokensAfterOptimization: number;
}
```

### 4.4 Context Assembly Service Interface

```typescript
// services/intelligence/src/context-assembly.ts

export interface ContextAssemblyEngine {
  /**
   * Assemble a full context window for reasoning or execution.
   * This is the hot path for every Twin proposal and every Act execution.
   */
  assemble(request: ContextAssemblyRequest): Promise<AssembledContext>;

  /**
   * Lightweight entity resolution — SSOC lookup only.
   * Used by Observe-phase handlers that don't need full context.
   */
  resolveEntity(tenantId: string, entityType: string, entityId: string): Promise<Entity360 | null>;

  /**
   * Memory-only retrieval — used by continuity service for decay decisions.
   */
  queryMemory(tenantId: string, query: MemoryQuery): Promise<MemoryEntry[]>;

  /**
   * Tool catalog assembly — used by MCP /tools endpoint.
   */
  assembleToolCatalog(tenantId: string, role: string, scopes: string[]): Promise<ToolCatalog>;
}

export interface ContextAssemblyRequest {
  tenantId: string;
  userId: string;
  correlationId: string;

  /** The primary entity being operated on */
  primaryEntity?: {
    type: string;
    id: string;
  };

  /** The user's natural language request (for Twin reasoning) */
  naturalLanguage?: string;

  /** Explicit context hints from the caller */
  hints?: ContextHint[];

  /** Maximum tokens for the assembled context */
  maxTokens?: number;

  /** Which OODA phase is requesting context — affects depth */
  forPhase: OodaPhase;
}

export interface ContextHint {
  type: "include_memory" | "include_knowledge" | "focus_entity" | "time_range" | "lens";
  value: string | Record<string, unknown>;
  priority: number; // 0.0–1.0, higher = more important
}
```

---

## 5. OODA Phase Mapping

### 5.1 The OODA Loop in the Capability Layer

OODA runs **across** the Capability Layer (Layer 3) and the Continuity Layer (Layer 4). The Capability Layer owns the execution fabric; the Continuity Layer owns the state substrate. The Twin is the ambient reasoning engine that bridges both.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        OODA LOOP — PLATFORM MAPPING                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   OBSERVE ─────────────────────────────────────────────────────────────►    │
│   │                                                                         │
│   │  • webhook-ingress    (webhooks, events, signals)                       │
│   │  • connector-sync     (poll-based sync)                                 │
│   │  • folder-watcher     (filesystem changes)                              │
│   │  • mcp-connector      (inbound MCP tool calls)                          │
│   │  • platform.signals.* (signal query capabilities)                       │
│   │                                                                         │
│   ▼                                                                         │
│   ORIENT ───────────────────────────────────────────────────────────────►   │
│   │                                                                         │
│   │  • intelligence       (Context Assembly — Entity360, Memory, Knowledge) │
│   │  • knowledge          (RAG, semantic search)                            │
│   │  • continuity         (memory retrieval, SSOC resolution)               │
│   │  • normalizer         (8-stage canonicalization)                        │
│   │  • platform.entity360.get                                              │
│   │  • intelligence.context.assemble                                       │
│   │                                                                         │
│   ▼                                                                         │
│   DECIDE ───────────────────────────────────────────────────────────────►   │
│   │                                                                         │
│   │  • twin-orchestrator  (persistent per-user DO — reasoning engine)       │
│   │  • think              (LLM orchestration — OpenRouter abstraction)      │
│   │  • govern             (confidence scoring, proposal evaluation)         │
│   │  • twin.propose       (capability: generate proposal)                   │
│   │  • twin.analyze       (capability: analyze entity)                      │
│   │  • twin.predict       (capability: generate forecast)                   │
│   │                                                                         │
│   ▼                                                                         │
│   ACT ──────────────────────────────────────────────────────────────────►   │
│   │                                                                         │
│   │  • hermes             (message queue + execution routing)               │
│   │  • workflow           (durable orchestration — sagas, retries)          │
│   │  • act                (outbound execution + adapter modules)            │
│   │  • iw-agent-runtime   (MCP-compliant agent execution)                   │
│   │  • mcp-connector      (outbound MCP calls — inside act adapters)        │
│   │  • platform.execute.* (generic execution capability)                    │
│   │                                                                         │
│   └────────────────────────────────────────────────────────────────────►    │
│        (memory compounds) ──▶ continuity (memory consolidation)             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Phase-to-Service Matrix

| OODA Phase  | Primary Services                                                                 | Capability Runtime                       | Data Layer                             | Speed Target                        |
| ----------- | -------------------------------------------------------------------------------- | ---------------------------------------- | -------------------------------------- | ----------------------------------- |
| **Observe** | `webhook-ingress`, `connector-sync`, `folder-watcher`, `mcp-connector` (inbound) | Event ingestion only                     | Spine read (Entity360 for routing)     | ms–min                              |
| **Orient**  | `intelligence`, `knowledge`, `continuity`, `normalizer`                          | Context Assembly engine                  | D1 + Vectorize + KV + AI Search        | <2s normalizer p99, <10ms cache hit |
| **Decide**  | `twin-orchestrator`, `think`, `govern`                                           | Proposal generation + confidence scoring | OpenRouter API, KV model config        | 1–2s simple, 5–10s complex          |
| **Act**     | `hermes`, `workflow`, `act`, `iw-agent-runtime`                                  | Execution routing + adapter dispatch     | Durable Objects, Queues, external APIs | 500ms–2s (external API)             |

### 5.3 Phase-to-Queue Mapping

```typescript
// infra/queues/definitions.ts

/**
 * Queue topology for OODA execution.
 * Each phase has its own queue to prevent head-of-line blocking.
 */
export const QUEUES = {
  // Observe → Orient handoff
  OBSERVE_QUEUE: "iw-observe-queue",

  // Orient → Decide handoff (context assembly complete, ready for reasoning)
  ORIENT_QUEUE: "iw-orient-queue",

  // Decide → Act handoff (proposal approved or auto-approved)
  ACT_QUEUE: "iw-act-queue",

  // Act → Continuity handoff (execution result, writeback pending)
  PIPELINE_QUEUE: "iw-pipeline-queue",

  // Governance review queue (0.70–0.85 proposals awaiting HITL)
  GOVERNANCE_QUEUE: "iw-governance-queue",

  // Cross-cutting: telemetry, audit, memory triage
  TELEMETRY_QUEUE: "iw-telemetry-queue",
  MEMORY_TRIAGE_QUEUE: "iw-memory-triage-queue",
} as const;

/**
 * Dead letter queues — every primary queue has a corresponding DLQ.
 */
export const DLQS = {
  OBSERVE_DLQ: "iw-observe-dlq",
  ACT_DLQ: "iw-act-dlq",
  PIPELINE_DLQ: "iw-pipeline-dlq",
} as const;
```

---

## 6. Capability Runtime

### 6.1 Architecture

The Capability Runtime is the **execution fabric** of Layer 3. It receives capability invocations from the Gateway, resolves them through the Capability Registry, assembles context, routes to the appropriate handler, and manages the lifecycle of every execution.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CAPABILITY RUNTIME                                  │
│                    (Layer 3 — Execution Orchestration)                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐        │
│  │   Gateway    │────▶│ CapabilityRouter │────▶│  RegistryCache   │        │
│  │  (Layer 2)   │     │   (hermes DO)    │     │    (KV + D1)     │        │
│  └──────────────┘     └──────────────────┘     └──────────────────┘        │
│                              │                                              │
│              ┌───────────────┼───────────────┐                              │
│              ▼               ▼               ▼                              │
│        ┌──────────┐    ┌──────────┐    ┌──────────┐                        │
│        │  Direct  │    │  Agent   │    │ Workflow │                        │
│        │ Handler  │    │ Runtime  │    │ Engine   │                        │
│        │ (act)    │    │(iw-agent │    │(workflow│                        │
│        │          │    │ runtime) │    │ DO)      │                        │
│        └──────────┘    └──────────┘    └──────────┘                        │
│              │               │               │                              │
│              └───────────────┼───────────────┘                              │
│                              ▼                                              │
│                    ┌──────────────────┐                                    │
│                    │  Adapter Layer   │  ◄── Provider Fabric (Layer 6)    │
│                    │  (act adapters)  │                                    │
│                    └──────────────────┘                                    │
│                              │                                              │
│                              ▼                                              │
│                    ┌──────────────────┐                                    │
│                    │  PIPELINE_QUEUE  │  ──▶ Spine Writeback (Layer 4)    │
│                    └──────────────────┘                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 CapabilityRouter — Hermes Durable Object

```typescript
// services/hermes/src/router.ts

/**
 * Hermes is the central message queue + execution router.
 * It is implemented as a Durable Object to maintain stateful routing tables,
 * in-flight execution tracking, and backpressure management.
 */
export class CapabilityRouter {
  private registry: CapabilityRegistryAPI;
  private contextAssembly: ContextAssemblyEngine;
  private governance: GovernanceGate;
  private telemetry: TelemetryCollector;

  constructor(state: DurableObjectState, env: Env) {
    this.registry = new CachedRegistry(env);
    this.contextAssembly = new ContextAssemblyClient(env.INTELLIGENCE);
    this.governance = new GovernanceGate(env.GOVERN);
    this.telemetry = new TelemetryCollector(env.TELEMETRY);
  }

  /**
   * Main entry point for all capability invocations.
   * Routes through: Resolve → Validate → Assemble Context → Execute → Writeback
   */
  async route(invocation: CapabilityInvocation): Promise<CapabilityResponse> {
    const start = Date.now();

    try {
      // 1. RESOLVE — capability URI → runtime config
      const resolved = await this.registry.resolve(invocation.capability, invocation.tenantId);

      if (!resolved) {
        return this.error(
          "CAPABILITY_NOT_FOUND",
          `No capability registered for ${invocation.capability}`
        );
      }

      // 2. VALIDATE — schema + permissions
      const validation = await this.registry.validate(
        invocation.capability,
        invocation.tenantId,
        invocation.role,
        invocation.payload
      );

      if (!validation.valid) {
        return this.error("VALIDATION_FAILED", validation.errors.join("; "));
      }

      // 3. GOVERNANCE PRE-CHECK — block before expensive operations
      if (resolved.capability.requiresApproval) {
        const preCheck = await this.governance.preCheck(invocation);
        if (preCheck === "DENY") {
          return this.error("GOVERNANCE_DENIED", "This capability requires explicit approval");
        }
      }

      // 4. CONTEXT ASSEMBLY (for Orient+ phases)
      let context: AssembledContext | undefined;
      if (["orient", "decide", "act", "cross-phase"].includes(resolved.capability.oodaPhase)) {
        context = await this.contextAssembly.assemble({
          tenantId: invocation.tenantId,
          userId: invocation.userId,
          correlationId: invocation.correlationId,
          forPhase: resolved.capability.oodaPhase,
          hints: invocation.contextHints,
        });
      }

      // 5. EXECUTE — route to the appropriate runtime
      const result = await this.execute(resolved, invocation, context);

      // 6. POST-EXECUTION GOVERNANCE (for Decide phase)
      if (resolved.capability.oodaPhase === "decide" && result.confidence !== undefined) {
        const governanceResult = await this.governance.evaluate({
          capability: invocation.capability,
          tenantId: invocation.tenantId,
          userId: invocation.userId,
          confidence: result.confidence,
          proposal: result.data,
        });

        result.governance = governanceResult;

        // Auto-approve or queue for review
        if (governanceResult.action === "queue") {
          await this.enqueueGovernanceReview(invocation, result);
        }
      }

      // 7. TELEMETRY
      await this.telemetry.record({
        correlationId: invocation.correlationId,
        capability: invocation.capability,
        tenantId: invocation.tenantId,
        durationMs: Date.now() - start,
        success: true,
        oodaPhase: resolved.capability.oodaPhase,
        runtime: resolved.capability.runtime,
      });

      return {
        success: true,
        data: result.data,
        confidence: result.confidence,
        governance: result.governance,
        meta: {
          correlationId: invocation.correlationId,
          durationMs: Date.now() - start,
          serviceBinding: resolved.capability.serviceBinding,
          cacheHit: resolved.cacheHit,
          oodaPhase: resolved.capability.oodaPhase,
        },
      };
    } catch (err) {
      await this.telemetry.record({
        correlationId: invocation.correlationId,
        capability: invocation.capability,
        tenantId: invocation.tenantId,
        durationMs: Date.now() - start,
        success: false,
        error: err instanceof Error ? err.message : String(err),
      });

      return this.error("EXECUTION_ERROR", err instanceof Error ? err.message : String(err));
    }
  }

  /**
   * Execute the capability through the appropriate runtime.
   */
  private async execute(
    resolved: ResolvedCapability,
    invocation: CapabilityInvocation,
    context?: AssembledContext
  ): Promise<ExecutionResult> {
    const enrichedPayload = {
      ...invocation.payload,
      _context: context,
      _tenantId: invocation.tenantId,
      _userId: invocation.userId,
      _correlationId: invocation.correlationId,
    };

    switch (resolved.capability.runtime) {
      case "direct":
        // Direct execution via service binding (synchronous, <100ms)
        return this.executeDirect(resolved, enrichedPayload);

      case "agent":
        // Agent runtime — MCP-compliant AI agent execution
        return this.executeAgent(resolved, enrichedPayload);

      case "pipeline":
        // Pipeline execution — enqueues to PIPELINE_QUEUE
        return this.executePipeline(resolved, enrichedPayload);

      case "workflow":
        // Durable workflow — saga pattern, retries, pause/resume
        return this.executeWorkflow(resolved, enrichedPayload);

      case "mcp":
        // MCP outbound execution — via act service MCP adapter
        return this.executeMCP(resolved, enrichedPayload);

      default:
        throw new Error(`Unknown runtime: ${resolved.capability.runtime}`);
    }
  }

  private async executeDirect(
    resolved: ResolvedCapability,
    payload: unknown
  ): Promise<ExecutionResult> {
    const binding = resolved.capability.serviceBinding;
    // Service binding call — synchronous RPC
    const service = this.env[binding] as ServiceBinding;
    return service
      .fetch(
        new Request("http://internal/execute", {
          method: "POST",
          body: JSON.stringify({
            handler: resolved.capability.handler,
            payload,
          }),
        })
      )
      .then((r) => r.json());
  }

  private async executeAgent(
    resolved: ResolvedCapability,
    payload: unknown
  ): Promise<ExecutionResult> {
    // Route to iw-agent-runtime for MCP-compliant agent execution
    const agentRuntime = this.env.IW_AGENT_RUNTIME as ServiceBinding;
    return agentRuntime
      .fetch(
        new Request("http://internal/agent/execute", {
          method: "POST",
          body: JSON.stringify({
            capability: resolved.capability.id,
            payload,
          }),
        })
      )
      .then((r) => r.json());
  }

  private async executeWorkflow(
    resolved: ResolvedCapability,
    payload: unknown
  ): Promise<ExecutionResult> {
    // Start a durable workflow — returns a handle, not a result
    const workflow = this.env.WORKFLOW as ServiceBinding;
    const handle = await workflow
      .fetch(
        new Request("http://internal/workflow/start", {
          method: "POST",
          body: JSON.stringify({
            type: resolved.capability.handler,
            input: payload,
          }),
        })
      )
      .then((r) => r.json());

    return {
      data: { workflowId: handle.id, status: "started" },
    };
  }

  private async executeMCP(
    resolved: ResolvedCapability,
    payload: unknown
  ): Promise<ExecutionResult> {
    // Route to act service — MCP outbound adapter handles provider specifics
    const act = this.env.ACT as ServiceBinding;
    return act
      .fetch(
        new Request("http://internal/mcp/execute", {
          method: "POST",
          body: JSON.stringify({
            capability: resolved.capability.id,
            payload,
          }),
        })
      )
      .then((r) => r.json());
  }

  private error(code: string, message: string): CapabilityResponse {
    return {
      success: false,
      error: { code, message, retryable: code !== "VALIDATION_FAILED" },
      meta: {
        correlationId: "", // populated by caller
        durationMs: 0,
        serviceBinding: "hermes",
        cacheHit: false,
        oodaPhase: "observe",
      },
    };
  }
}
```

### 6.3 Execution Result Contract

```typescript
// packages/sdk/src/execution.ts

export interface ExecutionResult {
  /** The primary output of the execution */
  data?: unknown;

  /** Confidence score — set by Decide-phase capabilities */
  confidence?: number;

  /** Governance state — populated for capabilities requiring approval */
  governance?: GovernanceState;

  /** For workflow executions — the workflow handle */
  workflowHandle?: WorkflowHandle;

  /** For streaming capabilities — SSE stream reference */
  streamRef?: string;

  /** Side effects — what was written, what changed */
  sideEffects?: SideEffect[];

  /** Whether the result should be written back to Spine */
  requiresWriteback: boolean;

  /** Memory entries to persist */
  memoryToCreate?: MemoryEntryDraft[];
}

export interface GovernanceState {
  status: "auto_approved" | "pending_review" | "denied" | "escalated";
  confidence: number;
  threshold: number;
  reviewer?: string;
  reviewedAt?: Date;
  auditRef: string; // Reference to governance_audit_log entry
}

export interface SideEffect {
  type: "spine_write" | "memory_create" | "event_emit" | "notification";
  target: string;
  payload: unknown;
}

export interface WorkflowHandle {
  id: string;
  status: "pending" | "running" | "paused" | "completed" | "failed";
  checkpointUrl: string;
}

export interface MemoryEntryDraft {
  scope: "Personal" | "Work" | "Organization" | "AI";
  content: string;
  confidence: number;
  source: string;
}
```

---

## 7. ADK Runtime (Ambient Twin Development Kit)

### 7.1 Architecture

The ADK Runtime is the **persistent reasoning substrate** that powers the Twin. It is not a separate service that consumers call — it is the engine behind `twin.propose`, `twin.analyze`, and `twin.predict` capabilities. The ADK Runtime lives inside the `twin-orchestrator` Durable Object and the `think` service.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ADK RUNTIME ARCHITECTURE                            │
│                     (Ambient — Not Directly Callable)                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Consumer ──▶ capability "twin.propose" ──▶ Hermes Router                  │
│                                                  │                          │
│                                                  ▼                          │
│   ┌──────────────────────────────────────────────────────────────┐         │
│   │              TWIN-ORCHESTRATOR (Durable Object)                │         │
│   │                                                              │         │
│   │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐       │         │
│   │  │   Session   │───▶│   Memory    │───▶│   Reason    │       │         │
│   │  │   State     │    │   Graph     │    │   Engine    │       │         │
│   │  │             │    │             │    │             │       │         │
│   │  │ • User pref │    │ • Personal  │    │ • think svc │       │         │
│   │  │ • Active    │    │ • Work      │    │ • OpenRouter│       │         │
│   │  │   context   │    │ • Org       │    │ • Model sel │       │         │
│   │  │ • Last N    │    │ • AI        │    │ • Chain-of- │       │         │
│   │  │   turns     │    │             │    │   thought   │       │         │
│   │  └─────────────┘    └─────────────┘    └─────────────┘       │         │
│   │         │                   │                   │             │         │
│   │         └───────────────────┴───────────────────┘             │         │
│   │                             │                                 │         │
│   │                             ▼                                 │         │
│   │                    ┌─────────────────┐                        │         │
│   │                    │  OODA Engine    │                        │         │
│   │                    │  (inside DO)    │                        │         │
│   │                    │                 │                        │         │
│   │                    │ Observe ──▶ Orient ──▶ Decide ──▶ Act    │         │
│   │                    │   │             │          │         │   │         │
│   │                    │   ▼             ▼          ▼         ▼   │         │
│   │                    │ Spine      Context    Proposal  Execute │         │
│   │                    │ read       Assembly     + conf   route  │         │
│   │                    └─────────────────┘                        │         │
│   │                              │                                │         │
│   │                              ▼                                │         │
│   │                    ┌─────────────────┐                        │         │
│   │                    │  Proposal Output │  ──▶ Govern ──▶ Act   │         │
│   │                    │  + Confidence    │                        │         │
│   │                    └─────────────────┘                        │         │
│   │                                                              │         │
│   └──────────────────────────────────────────────────────────────┘         │
│                                                                             │
│   KEY INVARIANT: The Twin is AMBIENT. Consumers call capabilities.          │
│   The Twin is the reasoning engine INSIDE those capabilities.               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 ADK Runtime Interfaces

```typescript
// packages/twin-types/src/adk.ts

/**
 * The ADK Runtime is the persistent per-user reasoning engine.
 * Each user gets one Durable Object instance: idFromName(tenantId + userId)
 */
export interface ADKRuntime {
  /**
   * Generate a proposal based on the current context.
   * This is the core Decide-phase capability.
   */
  propose(request: ProposeRequest): Promise<Proposal>;

  /**
   * Analyze an entity and return structured insights.
   */
  analyze(request: AnalyzeRequest): Promise<Analysis>;

  /**
   * Generate a forecast or prediction.
   */
  predict(request: PredictRequest): Promise<Prediction>;

  /**
   * Ingest a new observation into the Twin's session state.
   * Called by Observe-phase handlers to keep the Twin current.
   */
  observe(event: TwinObservation): Promise<void>;

  /**
   * Get the current OODA state of this Twin session.
   */
  getState(): Promise<TwinState>;

  /**
   * Reinforce a memory — mark it as important, reset decay clock.
   */
  reinforce(memoryId: string): Promise<void>;
}

export interface ProposeRequest {
  tenantId: string;
  userId: string;
  prompt: string;

  /** Optional: focus on a specific entity */
  targetEntity?: {
    type: string;
    id: string;
  };

  /** Optional: constrain to specific capability namespaces */
  capabilityNamespaces?: string[];

  /** Maximum number of proposals to generate */
  maxProposals?: number;

  /** Whether to include evidence citations in proposals */
  includeEvidence?: boolean;
}

export interface Proposal {
  id: string;
  correlationId: string;

  /** The proposed action */
  action: {
    capability: string; // e.g., "salesforce.opportunity.update"
    payload: unknown;
    description: string; // Human-readable description
  };

  /** Reasoning trace */
  reasoning: string;

  /** Evidence supporting this proposal */
  evidence: Evidence[];

  /** Confidence score — 0.0 to 1.0 */
  confidence: number;

  /** Estimated impact */
  impact: {
    type: "revenue" | "risk" | "efficiency" | "relationship";
    score: number; // -1.0 to 1.0
    description: string;
  };

  /** Alternative actions considered */
  alternatives: Alternative[];

  /** Governance requirements */
  governance: {
    requiresApproval: boolean;
    autoApproveThreshold: number;
    minConfidence: number;
  };

  /** Model used to generate this proposal */
  model: string;

  createdAt: Date;
}

export interface TwinState {
  sessionId: string;
  userId: string;
  tenantId: string;

  /** Current OODA phase */
  currentPhase: OodaPhase;

  /** Turn count in this session */
  turnCount: number;

  /** Active context window */
  activeContext: AssembledContext;

  /** Pending proposals awaiting governance */
  pendingProposals: Proposal[];

  /** Last interaction timestamp */
  lastActiveAt: Date;

  /** Session health */
  health: {
    contextSize: number; // tokens
    memoryEntries: number;
    modelLatencyAvg: number; // ms
    errorRate: number; // 0.0–1.0
  };
}

export interface TwinObservation {
  type: "signal" | "event" | "user_action" | "execution_result";
  source: string; // Which service produced this observation
  payload: unknown;
  timestamp: Date;
  entityRefs?: string[]; // SSOC UUIDs referenced
}
```

### 7.3 Think Service — LLM Orchestration

```typescript
// services/think/src/engine.ts

/**
 * The Think service is the LLM abstraction layer.
 * It routes to OpenRouter by default, but is swappable to any OpenAI-compatible endpoint.
 * It handles model selection, prompt formatting, retry logic, and circuit breaking.
 */
export interface ThinkEngine {
  /**
   * Generate a completion from the configured model provider.
   */
  complete(request: CompletionRequest): Promise<CompletionResponse>;

  /**
   * Generate a structured output (JSON mode).
   */
  structured<T>(request: StructuredRequest<T>): Promise<T>;

  /**
   * Stream a completion (SSE).
   */
  stream(request: CompletionRequest): ReadableStream;

  /**
   * Select the optimal model for a given capability and context.
   */
  selectModel(capability: string, contextComplexity: number): string;
}

export interface CompletionRequest {
  prompt: string | StructuredPrompt;
  model?: string; // Override default model selection
  maxTokens?: number;
  temperature?: number;
  tools?: ToolDescription[]; // For function calling

  /** Which capability is requesting this completion — used for model selection */
  forCapability?: string;
}

export interface CompletionResponse {
  content: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason: "stop" | "length" | "tool_calls" | "content_filter";
  toolCalls?: ToolCall[];
}
```

---

## 8. MCP Runtime

### 8.1 Bidirectional MCP Architecture

MCP is **first-class** in the Capability Layer. There are two distinct MCP runtimes:

1. **Inbound MCP Runtime** (`mcp-connector` service) — AI assistants connect TO us
2. **Outbound MCP Runtime** (inside `act` service adapters) — We connect TO provider MCP servers

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      MCP RUNTIME — BIDIRECTIONAL POOL                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────┐    ┌─────────────────────────────────┐ │
│  │     INBOUND MCP POOL            │    │     OUTBOUND MCP POOL           │ │
│  │     (North Plane — Layer 2)     │    │     (South Plane — Layer 6)     │ │
│  │                                 │    │                                 │ │
│  │  Claude ──▶ mcp.integratewise   │    │   act service                   │ │
│  │  ChatGPT    .ai/v1/mcp          │    │   ├── MCPOutboundAdapter        │ │
│  │  Cursor     │                   │    │   │   ├── Salesforce MCP        │ │
│  │  Perplexity │  ┌───────────┐    │    │   │   ├── Slack MCP             │ │
│  │             └──▶│ MCP       │    │    │   │   ├── GitHub MCP            │ │
│  │                 │ Connector │    │    │   │   └── Custom MCP            │ │
│  │                 │ Service   │    │    │   │                             │ │
│  │                 │           │    │    │   └── Entity360 injection       │ │
│  │                 │ • /tools  │    │    │       before every call         │ │
│  │                 │ • /invoke │    │    │                                 │ │
│  │                 │ • /health │    │    │   Credential wall per tenant    │ │
│  │                 └───────────┘    │    │   (CF Secrets / KV)             │ │
│  │                      │          │    │                                 │ │
│  │                      ▼          │    │                                 │ │
│  │              ┌──────────────┐   │    │   ┌──────────────┐              │ │
│  │              │  Tool Catalog │   │    │   │  Result      │              │ │
│  │              │  Assembly     │   │    │   │  Normalizer  │              │ │
│  │              │               │   │    │   │              │              │ │
│  │              │ • Filter by   │   │    │   │ • Map to     │              │ │
│  │              │   tenant/role │   │    │   │   Spine      │              │ │
│  │              │ • Schema      │   │    │   │   schema     │              │ │
│  │              │   validation  │   │    │   │ • Enqueue    │              │ │
│  │              └──────────────┘   │    │   │   to Pipeline│              │ │
│  │                                 │    │   └──────────────┘              │ │
│  └─────────────────────────────────┘    └─────────────────────────────────┘ │
│                                                                             │
│  SECURITY: Both pools enforce tenant isolation, JWT validation, and         │
│  read-only default. Write requires governance approval.                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.2 Inbound MCP Runtime

```typescript
// services/mcp-connector/src/runtime.ts

/**
 * Inbound MCP Runtime — AI assistants connect to us via SSE.
 * Multi-tenant: one Worker, many sessions, each session bound to a tenant.
 */
export class InboundMCPRuntime {
  /**
   * Handle SSE transport negotiation.
   */
  async createSession(request: Request): Promise<MCPSession> {
    const jwt = this.extractJWT(request);
    const claims = await this.verifyJWT(jwt);
    const tenantId = claims.tenant_id;
    const userId = claims.sub;

    // Security: fail-loud on cross-tenant session reuse
    const sessionId = crypto.randomUUID();
    const sessionKey = `mcp:session:${tenantId}:${sessionId}`;

    await this.env.KV.put(
      sessionKey,
      JSON.stringify({
        tenantId,
        userId,
        role: claims.rbac_role,
        scopes: claims.scopes,
        createdAt: Date.now(),
      }),
      { expirationTtl: 3600 }
    );

    return { id: sessionId, tenantId, userId };
  }

  /**
   * Assemble the tool catalog for this tenant + role.
   * Read-only tools are always included. Write tools require scope:write.
   */
  async getToolCatalog(session: MCPSession): Promise<Tool[]> {
    const cacheKey = `mcp:tools:${session.tenantId}:${session.role}`;
    const cached = await this.env.KV.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    // Fetch from Capability Registry
    const capabilities = await this.registry.list({
      tenantId: session.tenantId,
      role: session.role,
      isActive: true,
    });

    // Map capabilities to MCP Tool format
    const tools = capabilities.items.map((cap) => ({
      name: cap.id,
      description: cap.description || cap.displayName,
      inputSchema: cap.inputSchema,
      // Read-only default: only include write tools if scope includes "write"
      readOnly: !cap.requiredScopes?.includes("write"),
    }));

    // Cache for 5 minutes
    await this.env.KV.put(cacheKey, JSON.stringify(tools), { expirationTtl: 300 });

    return tools;
  }

  /**
   * Invoke a capability via MCP.
   * Routes through Hermes (CapabilityRouter) for full OODA execution.
   */
  async invokeTool(session: MCPSession, toolName: string, arguments: unknown): Promise<ToolResult> {
    // Resolve the capability
    const resolved = await this.registry.resolve(toolName, session.tenantId);

    if (!resolved) {
      return { error: `Tool ${toolName} not found for this tenant` };
    }

    // Read-only gate
    if (
      resolved.capability.requiredScopes?.includes("write") &&
      !session.scopes.includes("write")
    ) {
      return { error: "Write scope required for this tool" };
    }

    // Build CapabilityInvocation and route through Hermes
    const invocation: CapabilityInvocation = {
      capability: toolName,
      tenantId: session.tenantId,
      userId: session.userId,
      role: session.role,
      correlationId: crypto.randomUUID(),
      scopes: session.scopes,
      payload: arguments,
      oodaPhase: resolved.capability.oodaPhase,
    };

    const result = await this.hermes.route(invocation);

    // Audit
    await this.audit.log({
      via: "mcp",
      tenantId: session.tenantId,
      userId: session.userId,
      capability: toolName,
      success: result.success,
      correlationId: invocation.correlationId,
    });

    return {
      content: result.success ? JSON.stringify(result.data) : JSON.stringify(result.error),
      isError: !result.success,
    };
  }
}
```

### 8.3 Outbound MCP Adapter (Inside `act`)

```typescript
// services/act/src/adapters/mcp-outbound.ts

/**
 * MCP Outbound Adapter — connects to provider MCP servers.
 * Part of the adapter pattern inside the act service.
 */
export class MCPOutboundAdapter implements OutboundAdapter {
  constructor(
    private provider: string,
    private serverUrl: string,
    private credentialStore: CredentialStore
  ) {}

  async execute(
    resource: string,
    operation: string,
    payload: unknown,
    credentials: Credentials
  ): Promise<ExecutionResult> {
    // 1. Fetch Entity360 context for injection
    const entityContext = payload["_context"] as AssembledContext | undefined;
    const entity360 = entityContext?.entity360;

    // 2. Build MCP tool call
    const toolCall = {
      name: `${this.provider}.${resource}.${operation}`,
      arguments: this.enrichPayload(payload, entity360),
    };

    // 3. Call provider MCP server
    const response = await fetch(this.serverUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${credentials.accessToken}`,
        "Content-Type": "application/json",
        "X-Tenant-Id": credentials.tenantId,
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "tools/call",
        params: toolCall,
        id: crypto.randomUUID(),
      }),
    });

    if (!response.ok) {
      throw new Error(`MCP outbound call failed: ${response.status} ${await response.text()}`);
    }

    const result = await response.json();

    // 4. Normalize result to Spine schema
    const normalizedResult = await this.normalizeResult(result, resource, operation);

    // 5. Enqueue to Pipeline for writeback
    await this.enqueueWriteback({
      tenantId: credentials.tenantId,
      capability: `${this.provider}.${resource}.${operation}`,
      result: normalizedResult,
    });

    return {
      data: normalizedResult,
      requiresWriteback: true,
    };
  }

  private enrichPayload(payload: unknown, entity360?: Entity360): unknown {
    if (!entity360) return payload;

    // Inject relevant Entity360 properties into the payload
    // Provider-specific enrichment rules live in config
    return {
      ...payload,
      _context: {
        entityId: entity360.id,
        entityType: entity360.type,
        entityProperties: entity360.properties,
      },
    };
  }

  private async normalizeResult(
    result: unknown,
    resource: string,
    operation: string
  ): Promise<unknown> {
    // Normalize provider-specific response to Spine canonical schema
    // Delegates to normalizer service via queue for complex normalization
    return result;
  }
}
```

---

## 9. Execution Routing

### 9.1 Routing Decision Tree

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        EXECUTION ROUTING LOGIC                              │
│                         (Inside Hermes Router)                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  INPUT: CapabilityInvocation                                                │
│       │                                                                     │
│       ▼                                                                     │
│  ┌─────────────────┐                                                        │
│  │ Resolve from    │                                                        │
│  │ Capability      │                                                        │
│  │ Registry        │                                                        │
│  └────────┬────────┘                                                        │
│           │                                                                 │
│           ▼                                                                 │
│  ┌─────────────────┐                                                        │
│  │ OODA Phase?     │                                                        │
│  └────────┬────────┘                                                        │
│           │                                                                 │
│     ┌─────┴─────┬─────────┬─────────┐                                       │
│     ▼           ▼         ▼         ▼                                       │
│  observe     orient    decide      act                                      │
│     │           │         │         │                                       │
│     ▼           ▼         ▼         ▼                                       │
│  Direct      Context    Twin      Hermes                                    │
│  Handler     Assembly   + Think   Queue                                     │
│  (sync)      (async)    (async)   (async)                                   │
│     │           │         │         │                                       │
│     ▼           ▼         ▼         ▼                                       │
│  Return     Return     Return     Enqueue                                  │
│  <100ms     <2s        1-10s      to ACT_QUEUE                             │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │ Runtime Selection (after phase routing):                           │    │
│  │                                                                    │    │
│  │ runtime === "direct"    ──▶ Service Binding RPC (sync)             │    │
│  │ runtime === "agent"     ──▶ iw-agent-runtime (MCP execution)       │    │
│  │ runtime === "pipeline"  ──▶ Enqueue to PIPELINE_QUEUE              │    │
│  │ runtime === "workflow"  ──▶ Start Workflow DO (saga)               │    │
│  │ runtime === "mcp"       ──▶ act service → MCPOutboundAdapter       │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 9.2 Routing Interface

```typescript
// services/hermes/src/routing.ts

/**
 * The RoutingTable maps capabilities to their execution runtime.
 * It is populated from the Capability Registry at deploy time and
 * refreshed every 30 seconds from KV cache.
 */
export interface RoutingTable {
  /**
   * Get the route for a capability URI.
   */
  getRoute(capabilityUri: string): RouteEntry | undefined;

  /**
   * Refresh the routing table from the Capability Registry.
   */
  refresh(): Promise<void>;

  /**
   * Register a dynamic route (for runtime-discovered capabilities).
   */
  registerDynamicRoute(entry: RouteEntry): void;
}

export interface RouteEntry {
  capabilityUri: string;

  /** Primary target */
  target: {
    serviceBinding: string; // e.g., "ACT", "WORKFLOW", "IW_AGENT_RUNTIME"
    handler: string; // e.g., "execute", "start", "agent/execute"
  };

  /** Fallback target if primary fails */
  fallback?: {
    serviceBinding: string;
    handler: string;
  };

  /** Circuit breaker config */
  circuitBreaker: {
    failureThreshold: number;
    recoveryTimeout: number; // ms
    halfOpenMaxCalls: number;
  };

  /** Retry config */
  retry: {
    maxRetries: number;
    backoffType: "fixed" | "exponential";
    backoffMs: number;
  };

  /** Timeout config */
  timeout: {
    requestTimeoutMs: number;
    deadlineMs: number;
  };
}
```

---

## 10. Agent vs Pipeline Boundaries

### 10.1 The Fundamental Distinction

| Dimension      | **Agent** (iw-agent-runtime)                           | **Pipeline** (pipeline service)           |
| -------------- | ------------------------------------------------------ | ----------------------------------------- |
| **Purpose**    | Execute AI-driven, reasoning-intensive capabilities    | Write canonical data to the Spine         |
| **Runtime**    | MCP-compliant, LLM-orchestrated                        | Deterministic, schema-validated           |
| **Input**      | Natural language + Entity360 + Tools                   | Normalized canonical records              |
| **Output**     | Proposals, analysis, predictions, tool calls           | Spine entities, relationships, audit logs |
| **State**      | Stateful (Durable Object per user)                     | Stateless (single Worker, all tenants)    |
| **Governance** | Always through confidence gate                         | Always through schema validation          |
| **Speed**      | 1–10s (LLM latency)                                    | <2s p99 (database writes)                 |
| **Queue**      | `ORIENT_QUEUE` → `ACT_QUEUE`                           | `PIPELINE_QUEUE`                          |
| **Moat**       | The Twin is ambient — consumers don't call it directly | Pipeline is the **ONLY** Spine writer     |

### 10.2 When to Use Agent vs Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    AGENT VS PIPELINE DECISION MATRIX                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Consumer Request                                                           │
│       │                                                                     │
│       ▼                                                                     │
│  ┌─────────────────────────┐                                               │
│  │ Requires reasoning,     │                                               │
│  │ LLM, or Twin?           │                                               │
│  └───────────┬─────────────┘                                               │
│              │                                                             │
│         ┌────┴────┐                                                        │
│         ▼         ▼                                                        │
│       YES        NO                                                        │
│         │         │                                                        │
│         ▼         ▼                                                        │
│   ┌─────────┐  ┌─────────────┐                                             │
│   │  AGENT  │  │  PIPELINE   │                                             │
│   │  PATH   │  │  PATH       │                                             │
│   │         │  │             │                                             │
│   │ Route   │  │ Route to    │                                             │
│   │ to      │  │ pipeline    │                                             │
│   │ twin-   │  │ service     │                                             │
│   │ orchestr│  │             │                                             │
│   │ ator or │  │ Validate    │                                             │
│   │ iw-agen-│  │ schema      │                                             │
│   │ t-runtim│  │ Write to    │                                             │
│   │ e       │  │ Spine       │                                             │
│   │         │  │ Emit audit  │                                             │
│   │ Generate│  │             │                                             │
│   │ proposal│  │             │                                             │
│   │ + conf  │  │             │                                             │
│   │         │  │             │                                             │
│   │ Govern  │  │             │                                             │
│   │ eval    │  │             │                                             │
│   │         │  │             │                                             │
│   │ Execute │  │             │                                             │
│   │ via act │  │             │                                             │
│   └─────────┘  └─────────────┘                                             │
│                                                                             │
│  KEY RULE: Pipeline NEVER calls LLM. Agent NEVER writes to Spine directly.  │
│  The only path from Agent to Spine is: Agent ──▶ Act ──▶ PIPELINE_QUEUE     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 10.3 Boundary Enforcement

```typescript
// packages/lib/src/boundaries.ts

/**
 * Boundary enforcement — compile-time and runtime checks to ensure
 * Agents and Pipelines do not violate their separation of concerns.
 */

// Agent boundary: Agents MUST NOT write to D1 directly
export function enforceAgentBoundary(serviceName: string): void {
  if (serviceName === "iw-agent-runtime" || serviceName === "twin-orchestrator") {
    // These services have NO D1 binding in their wrangler.toml
    // Attempting to import db-gate.ts will fail at build time
  }
}

// Pipeline boundary: Pipeline MUST be the only Spine writer
export function enforcePipelineBoundary(serviceName: string, operation: string): void {
  if (operation.startsWith("INSERT") || operation.startsWith("UPDATE")) {
    if (serviceName !== "pipeline") {
      throw new Error(
        `SPINE_WRITE_VIOLATION: Only 'pipeline' may write to Spine. ` +
          `Attempted by '${serviceName}'. ` +
          `Use PIPELINE_QUEUE instead.`
      );
    }
  }
}

// Runtime check: every D1 query must pass through pipeline service
export async function spineWrite(payload: SpineWritePayload): Promise<void> {
  // This function ONLY exists in the pipeline service
  // All other services call this via service binding or queue
  throw new Error("spineWrite is only available in pipeline service");
}
```

---

## 11. Security Boundaries

### 11.1 Capability Layer Security Model

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CAPABILITY LAYER SECURITY BOUNDARIES                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  BOUNDARY 1: Identity Gate (Layer 1)                                │   │
│  │  ─────────────────────────────────                                  │   │
│  │  • JWT validation on every capability invocation                    │   │
│  │  • tenant_id extracted from JWT claim ONLY                          │   │
│  │  • role + scopes from JWT rbac claim                                │   │
│  │  • x-correlation-id injected for tracing                            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  BOUNDARY 2: Capability Registry Gate                               │   │
│  │  ────────────────────────────────────                               │   │
│  │  • Capability URI must exist in registry                            │   │
│  │  • Tenant must have access to this capability (plan limits)         │   │
│  │  • Caller role must match requiredRoles                             │   │
│  │  • Caller scopes must include requiredScopes                        │   │
│  │  • Deprecated capabilities return 410 Gone                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  BOUNDARY 3: Context Assembly Gate                                  │   │
│  │  ─────────────────────────────────                                  │   │
│  │  • Entity360 scoped to tenant_id (WHERE tenant_id = ?)              │   │
│  │  • Memory scoped to tenant_id + user_id                             │   │
│  │  • Knowledge scoped to tenant_id                                    │   │
│  │  • Cross-tenant context assembly → 403 fail-loud                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  BOUNDARY 4: Governance Gate (Layer 5)                              │   │
│  │  ─────────────────────────────────                                  │   │
│  │  • Confidence < 0.70 → discard                                      │   │
│  │  • 0.70 ≤ confidence < 0.85 → queue for HITL review                 │   │
│  │  • confidence ≥ 0.85 → auto-approve                                 │   │
│  │  • Every decision logged to governance_audit_log                    │   │
│  │  • Audit write failure → halt operation                             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  BOUNDARY 5: Execution Gate (Layer 6)                               │   │
│  │  ─────────────────────────────────                                  │   │
│  │  • Adapter modules inside act service ONLY                          │   │
│  │  • Credential wall: per-tenant credentials from CF Secrets/KV       │   │
│  │  • Entity360 injection before every outbound call                   │   │
│  │  • No shared tokens across tenants                                  │   │
│  │  • Every outbound call logged to outbound_mcp_calls                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 11.2 Security Checklist for Capability Layer

| #   | Check                                         | Implementation                                              |
| --- | --------------------------------------------- | ----------------------------------------------------------- |
| 1   | Every capability invocation carries valid JWT | `gateway` validates, passes claims via service binding      |
| 2   | `tenant_id` never from client payload         | Extracted from JWT `tenant_id` claim only                   |
| 3   | Cross-tenant capability resolution → 403      | Registry query includes `WHERE tenant_id = ?`               |
| 4   | Read-only default for MCP                     | `scope: read` in JWT; write requires `scope: write`         |
| 5   | Tool catalog filtered by tenant               | `agent-registry.list()` enforces `tenant_id` filter         |
| 6   | Every invocation audited                      | `spine_audit_log` with `via: capability`                    |
| 7   | Capability schema validated before execution  | `registry.validate()` runs JSON Schema validation           |
| 8   | Agent cannot write to Spine directly          | Build-time restriction: no D1 binding in `iw-agent-runtime` |
| 9   | Pipeline cannot call LLM                      | Build-time restriction: no OpenRouter import in `pipeline`  |
| 10  | Dead-letter queues for every queue            | `OBSERVE_DLQ`, `ACT_DLQ`, `PIPELINE_DLQ`                    |

---

## 12. Integration Points with Adjacent Layers

### 12.1 Northbound: Ingress Layer (Layer 2)

| Integration                  | Contract                                                 | Direction            |
| ---------------------------- | -------------------------------------------------------- | -------------------- |
| `gateway` → `hermes`         | `CapabilityInvocation` via service binding               | Ingress → Capability |
| `mcp-connector` → `hermes`   | MCP `tools/call` → `CapabilityInvocation`                | Ingress → Capability |
| `webhook-ingress` → `hermes` | Webhook payload → `CapabilityInvocation` (observe phase) | Ingress → Capability |

### 12.2 Southbound: Continuity Layer (Layer 4)

| Integration               | Contract                                      | Direction               |
| ------------------------- | --------------------------------------------- | ----------------------- |
| `hermes` → `intelligence` | `ContextAssemblyRequest` → `AssembledContext` | Capability → Continuity |
| `hermes` → `continuity`   | Memory retrieval for context assembly         | Capability → Continuity |
| `hermes` → `knowledge`    | RAG queries for knowledge hits                | Capability → Continuity |
| `act` → `pipeline`        | `ExecutionResult` → `PIPELINE_QUEUE`          | Capability → Continuity |

### 12.3 Eastbound: Governance Layer (Layer 5)

| Integration           | Contract                                  | Direction               |
| --------------------- | ----------------------------------------- | ----------------------- |
| `hermes` → `govern`   | Proposal + confidence → `GovernanceState` | Capability → Governance |
| `govern` → `hermes`   | Approval/denial → execution routing       | Governance → Capability |
| `workflow` → `govern` | HITL pause → approval checkpoint          | Capability → Governance |

### 12.4 Westbound: Provider Fabric (Layer 6)

| Integration                     | Contract                                 | Direction               |
| ------------------------------- | ---------------------------------------- | ----------------------- |
| `act` → Provider APIs           | Adapter modules (Nango, MCP, Native)     | Capability → Provider   |
| `act` → `spine-v2`              | Entity360 injection before outbound call | Capability → Continuity |
| `connector-sync` → `normalizer` | Raw records → canonical transform        | Provider → Continuity   |

---

## 13. Ecosystem = Capability Fabric

### 13.1 Definition

The **Ecosystem** is the capability fabric for:

- **Knowledge sharing** — cross-tenant (with consent) and cross-entity knowledge propagation
- **Tool-to-tool communication** — agents and tools coordinate through Spine, not peer-to-peer
- **Agent communication** — A2A protocol through shared Spine context

### 13.2 Ecosystem Capabilities

```typescript
// packages/sdk/src/ecosystem.ts

/**
 * Ecosystem capabilities enable cross-boundary collaboration
 * while maintaining tenant isolation.
 */
export interface EcosystemAPI {
  /**
   * Broadcast a knowledge packet to the ecosystem.
   * Knowledge packets are anonymized, scored, and governed before broadcast.
   */
  broadcast(tenantId: string, packet: KnowledgePacket): Promise<EcosystemReceipt>;

  /**
   * Query the ecosystem for relevant knowledge.
   * Returns knowledge from other tenants (anonymized) + own tenant.
   */
  query(tenantId: string, query: EcosystemQuery): Promise<KnowledgeHit[]>;

  /**
   * Subscribe to ecosystem signals.
   * Relevant signals from other tenants (anonymized patterns, not raw data).
   */
  subscribe(tenantId: string, filter: SignalFilter): Promise<SubscriptionHandle>;
}

export interface KnowledgePacket {
  id: string;
  tenantId: string; // Source tenant (anonymized in broadcast)
  category: "pattern" | "insight" | "best_practice" | "cautionary_tale";
  content: string;
  confidence: number; // Must be ≥ 0.85 for ecosystem broadcast
  evidence: Evidence[];
  tags: string[];

  /** Whether this packet can be shared across tenant boundaries */
  shareable: boolean;

  /** Anonymization level */
  anonymization: "full" | "partial" | "none";
}
```

---

## 14. Service Topology for This Domain

| Service             | Tier   | Binding             | Role in This Domain                                         |
| ------------------- | ------ | ------------------- | ----------------------------------------------------------- |
| `hermes`            | Tier 3 | `HERMES`            | Capability Router — Durable Object, execution orchestration |
| `iw-agent-runtime`  | Tier 3 | `IW_AGENT_RUNTIME`  | MCP-compliant agent execution                               |
| `workflow`          | Tier 3 | `WORKFLOW`          | Durable orchestration — sagas, retries, HITL pause          |
| `act`               | Tier 2 | `ACT`               | Outbound execution + adapter modules                        |
| `mcp-connector`     | Tier 3 | `MCP_CONNECTOR`     | Inbound MCP bridge                                          |
| `twin-orchestrator` | Tier 2 | `TWIN_ORCHESTRATOR` | Persistent per-user OODA engine (Durable Object)            |
| `think`             | Tier 4 | `THINK`             | LLM orchestration — OpenRouter abstraction                  |
| `govern`            | Tier 2 | `GOVERN`            | Confidence gate — approval thresholds                       |
| `agent-registry`    | Tier 4 | `AGENT_REGISTRY`    | Capability Registry — catalog of all capabilities           |
| `intelligence`      | Tier 2 | `INTELLIGENCE`      | Context Assembly — Entity360, memory, knowledge             |
| `knowledge`         | Tier 2 | `KNOWLEDGE`         | RAG, semantic search, document chunking                     |
| `continuity`        | Tier 4 | `CONTINUITY`        | Memory retrieval, SSOC resolution                           |
| `normalizer`        | Tier 1 | `NORMALIZER`        | 8-stage canonicalization (Observe → Orient)                 |
| `pipeline`          | Tier 2 | `PIPELINE`          | **ONLY Spine writer** — all writeback routes here           |

---

## 15. Summary: The Capability Layer in One Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CAPABILITY LAYER v2.0                               │
│                    The OODA Execution Fabric                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   NORTH (Layer 2)                                                           │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                        │
│   │   Gateway   │  │   MCP In    │  │  Webhook    │                        │
│   │             │  │   (SSE)     │  │  Ingress    │                        │
│   └──────┬──────┘  └──────┬──────┘  └──────┬──────┘                        │
│          │                │                │                                │
│          └────────────────┼────────────────┘                                │
│                           ▼                                                 │
│   ┌───────────────────────────────────────────────────────┐                │
│   │              HERMES — Capability Router               │                │
│   │              (Durable Object)                         │                │
│   │                                                       │                │
│   │  1. RESOLVE ──▶ Registry (KV + D1)                   │                │
│   │  2. VALIDATE ──▶ Schema + Permissions                 │                │
│   │  3. ASSEMBLE ──▶ intelligence (Context Assembly)      │                │
│   │  4. GOVERN ──▶ govern (confidence gate)               │                │
│   │  5. EXECUTE ──▶ Route to runtime:                     │                │
│   │     • direct → service binding RPC                    │                │
│   │     • agent → iw-agent-runtime (MCP)                  │                │
│   │     • pipeline → PIPELINE_QUEUE → pipeline            │                │
│   │     • workflow → WORKFLOW DO (saga)                   │                │
│   │     • mcp → act → MCPOutboundAdapter                  │                │
│   │                                                       │                │
│   └───────────────────────────────────────────────────────┘                │
│                           │                                                 │
│          ┌────────────────┼────────────────┐                                │
│          ▼                ▼                ▼                                │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                        │
│   │    ADK      │  │   Workflow  │  │     Act     │                        │
│   │   Runtime   │  │   Engine    │  │  + Adapters │                        │
│   │(twin-orches-│  │(saga,retry, │  │             │                        │
│   │  trator DO) │  │  HITL pause)│  │ • Nango     │                        │
│   │             │  │             │  │ • MCP out   │                        │
│   │ • propose   │  │             │  │ • Native    │                        │
│   │ • analyze   │  │             │  │             │                        │
│   │ • predict   │  │             │  │             │                        │
│   └─────────────┘  └─────────────┘  └──────┬──────┘                        │
│                                             │                               │
│   SOUTH (Layer 6)                           ▼                               │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                        │
│   │  Salesforce │  │    Slack    │  │   GitHub    │  ... Provider Fabric   │
│   └─────────────┘  └─────────────┘  └─────────────┘                        │
│                                                                             │
│   EAST (Layer 4)          │           WEST (Layer 5)                       │
│   ┌─────────────┐         │         ┌─────────────┐                        │
│   │  Continuity │◄────────┘         │  Governance │                        │
│   │  (Spine,    │  (writeback)      │  (0.70/0.85)│                        │
│   │   Memory)   │                   │             │                        │
│   └─────────────┘                   └─────────────┘                        │
│                                                                             │
│   INVARIANTS:                                                               │
│   • Pipeline is the ONLY Spine writer                                       │
│   • Agent NEVER writes to Spine directly                                    │
│   • Every hop carries tenant_id                                             │
│   • Twin is AMBIENT — consumers call capabilities, not the Twin             │
│   • Ecosystem = capability fabric for knowledge + tool + agent comms        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 16. Appendix: File Paths and Package Structure

```
packages/
├── sdk/                          # Platform SDK — consumer-facing
│   ├── src/
│   │   ├── client.ts             # CapabilityClient — HTTP + service binding
│   │   ├── capabilities.ts       # Typed capability wrappers
│   │   ├── context.ts            # AssembledContext, Entity360 types
│   │   ├── contracts.ts          # CapabilityInvocation, CapabilityResponse
│   │   ├── execution.ts          # ExecutionResult, GovernanceState
│   │   └── ecosystem.ts          # EcosystemAPI, KnowledgePacket
│   └── package.json
│
├── twin-types/                   # Shared Twin/ADK types
│   ├── src/
│   │   ├── adk.ts                # ADKRuntime, Proposal, TwinState
│   │   ├── proposal.ts           # Proposal + ConfidenceScore
│   │   ├── governance.ts         # ApprovalState, GovernanceEvent
│   │   └── memory.ts             # MemoryScope, MemoryTier, DecayRule
│   └── package.json
│
└── mcp-types/                    # Shared MCP schemas
    ├── src/
    │   ├── inbound.ts            # Session, Tool, Invoke, Health types
    │   ├── outbound.ts           # ProviderAdapter, ContextInjection types
    │   └── guards.ts             # JWT claims, TenantScope, ReadOnlyGate
    └── package.json

services/
├── hermes/                       # Capability Router (Durable Object)
│   ├── src/
│   │   ├── index.ts              # DO entry point
│   │   ├── router.ts             # CapabilityRouter class
│   │   ├── routing.ts            # RoutingTable, RouteEntry
│   │   └── circuit-breaker.ts    # Per-provider circuit breaker
│   └── wrangler.toml
│
├── iw-agent-runtime/             # MCP-compliant agent execution
│   ├── src/
│   │   ├── index.ts
│   │   ├── agent.ts              # Agent execution engine
│   │   └── mcp-server.ts         # MCP server wrapper for agents
│   └── wrangler.toml
│
├── twin-orchestrator/            # Persistent per-user OODA engine
│   ├── src/
│   │   ├── index.ts              # DO entry point
│   │   ├── engine.ts             # OODA engine implementation
│   │   ├── session.ts            # Session state management
│   │   └── memory-graph.ts       # In-DO memory graph
│   └── wrangler.toml
│
├── think/                        # LLM orchestration
│   ├── src/
│   │   ├── index.ts
│   │   ├── engine.ts             # ThinkEngine implementation
│   │   ├── openrouter.ts         # OpenRouter adapter
│   │   └── model-selector.ts     # Model selection logic
│   └── wrangler.toml
│
├── mcp-connector/                # Inbound MCP bridge
│   ├── src/
│   │   ├── index.ts
│   │   ├── sessions.ts           # Session lifecycle (KV-backed)
│   │   ├── tools.ts              # Tool catalog assembly
│   │   ├── invoke.ts             # Capability routing via Hermes
│   │   └── guard.ts              # JWT verify + tenant_id + read-only gate
│   └── wrangler.toml
│
└── agent-registry/               # Capability Registry
    ├── src/
    │   ├── index.ts
    │   ├── registry.ts             # Registry CRUD + caching
    │   ├── validation.ts           # JSON Schema validation
    │   └── discovery.ts            # Discovery response assembly
    └── wrangler.toml
```

---

**END OF SPECIFICATION**

_IntegrateWise Continuity Bridge v2.0 — Capability Layer and OODA Runtime. This document is Stage 1/2 of the canonical architecture deep-dive. It feeds into the final v2.0 canonical architecture document._

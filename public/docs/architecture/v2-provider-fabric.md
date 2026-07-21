# IntegrateWise Continuity Bridge v2.0 — Provider Fabric and Adapter Pattern

> **Canonical Reference:** [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md)  
> _This document is downstream of the canonical architecture. Refer to the canonical source for current truth._

**Status:** STAGE 1/2 DEEP-DIVE — DRAFT FOR CANONICAL v2.0  
**Domain:** Provider Fabric and Adapter Pattern — Outbound adapters (Nango/MCP/Native), Inbound sync adapters, Credential wall, Tool-to-tool communication protocol, Entity360 injection, Provider health, Circuit breaker  
**Date:** 2026-07-03  
**Version:** 2.0.0-DRAFT  
**Supersedes:** v1.0.1-FINAL §5 (Adapter Pattern), §8.2 (Outbound MCP Pool)  
**Author:** Architecture Specialist — Provider Fabric Domain

---

## Table of Contents

1. [Domain Charter](#1-domain-charter)
2. [Conceptual Position in the 6-Layer Stack](#2-conceptual-position-in-the-6-layer-stack)
3. [Architecture Overview](#3-architecture-overview)
4. [Adapter Taxonomy and Interface Contracts](#4-adapter-taxonomy-and-interface-contracts)
5. [Outbound Execution Flow (act Service)](#5-outbound-execution-flow-act-service)
6. [Inbound Sync Flow (connector-sync Service)](#6-inbound-sync-flow-connector-sync-service)
7. [Credential Wall](#7-credential-wall)
8. [Entity360 Injection Protocol](#8-entity360-injection-protocol)
9. [Tool-to-Tool Communication Protocol (T2T)](#9-tool-to-tool-communication-protocol-t2t)
10. [Provider Health Monitoring](#10-provider-health-monitoring)
11. [Circuit Breaker](#11-circuit-breaker)
12. [Security Boundaries](#12-security-boundaries)
13. [Integration Points with Adjacent Domains](#13-integration-points-with-adjacent-domains)
14. [Error Handling, Retries, and Dead-Letter Behavior](#14-error-handling-retries-and-dead-letter-behavior)
15. [Physical Deployment Map](#15-physical-deployment-map)
16. [Operational Runbooks](#16-operational-runbooks)

---

## 1. Domain Charter

The Provider Fabric is Layer 6 of the IntegrateWise Continuity Bridge — the **execution boundary** between the platform's continuity kernel and the external universe of SaaS providers, APIs, databases, queues, and agent runtimes. Every byte that crosses this boundary is mediated by an adapter, governed by a credential wall, enriched by Entity360 context, and monitored by health probes and circuit breakers.

**Core responsibility:** The Provider Fabric makes the platform **provider-agnostic** at the Continuity Layer. Swapping Salesforce for HubSpot, or Nango for direct OAuth, or MCP for REST, is a configuration change — never a consumer-facing change.

**Doctrine:** _Truth you own. AI you rent. Providers you adapt. The Continuity Layer is the moat._

**Key invariant:** No service outside the Provider Fabric ever holds a provider credential, constructs a provider API call, or parses a provider-specific response schema. The Continuity Layer (Spine, Memory, Knowledge) is entirely provider-agnostic.

---

## 2. Conceptual Position in the 6-Layer Stack

```
┌─────────────────────────────────────────────────────────────────────┐
│ LAYER 1 — IDENTITY                                                  │
│  JWT issuance, tenant resolution, RBAC, SSO, API Keys               │
├─────────────────────────────────────────────────────────────────────┤
│ LAYER 2 — INGRESS                                                   │
│  Gateway, webhook-ingress, inbound MCP pool, rate-limiting          │
├─────────────────────────────────────────────────────────────────────┤
│ LAYER 3 — CAPABILITY                                                │
│  Capability engine, agent runtime, think, knowledge, intelligence   │
│  OODA: OBSERVE → ORIENT (Context Assembly)                          │
├─────────────────────────────────────────────────────────────────────┤
│ LAYER 4 — CONTINUITY                                                │
│  Adaptive Spine, Shared Memory, Continuity Engine, Twin (AMBIENT)   │
│  OODA: DECIDE → ACT (governance-gated)                              │
│  ████████████████ THE MOAT ████████████████                         │
├─────────────────────────────────────────────────────────────────────┤
│ LAYER 5 — GOVERNANCE                                                │
│  Confidence gates (0.70/0.85), HITL, audit, policy registry         │
├─────────────────────────────────────────────────────────────────────┤
│ LAYER 6 — PROVIDER FABRIC  ◄── YOU ARE HERE                         │
│  Adapter pattern, credential wall, Entity360 injection,             │
│  provider health, circuit breaker, T2T protocol                     │
│  Outbound: act → adapters → providers                               │
│  Inbound:  providers → adapters → normalizer → pipeline → spine     │
└─────────────────────────────────────────────────────────────────────┘
```

**North-South axis:** The Provider Fabric is the **South plane** — all egress and all inbound sync converge here. The North plane (Ingress) and South plane (Provider Fabric) never communicate directly; all coordination happens through the Spine (Layer 4) and the Governance Layer (Layer 5).

---

## 3. Architecture Overview

### 3.1 The Adapter Pattern at v2.0

The Integration Manager is **not a separate service** in v2.0. It is a **pattern** — a set of adapter modules co-located inside the services that actually touch external providers. This is the canonical implementation:

```
┌──────────────────────────────────────────────────────────────────────┐
│                         OUTBOUND PATH                                │
│                                                                      │
│   Continuity Layer                                                   │
│   ┌──────────────┐                                                   │
│   │   GOVERN     │─── approved action ───► ACT_QUEUE (Cloudflare)   │
│   └──────────────┘                                                   │
│          │                                                           │
│          ▼                                                           │
│   ┌──────────────────────────────────────────────────────────────┐   │
│   │                    iw-act  (Cloudflare Worker)                │   │
│   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │   │
│   │  │  execute.ts │─►│ adapter sel │─►│ credentials.ts      │   │   │
│   │  │  (dequeue   │  │ (outbound   │  │ (credential wall)   │   │   │
│   │  │   ACT_QUEUE)│  │  adapter    │  │ CF Secrets / KV     │   │   │
│   │  └─────────────┘  │  factory)   │  │ Nango vault         │   │   │
│   │                   └─────────────┘  └─────────────────────┘   │   │
│   │                          │                    │              │   │
│   │                   ┌──────┴──────┐              │              │   │
│   │                   ▼             ▼             ▼              │   │
│   │            ┌──────────┐  ┌──────────┐  ┌──────────┐         │   │
│   │            │  nango   │  │   mcp    │  │  native  │         │   │
│   │            │ adapter  │  │ outbound │  │ adapter  │         │   │
│   │            │ (OAuth   │  │ adapter  │  │ (direct  │         │   │
│   │            │  mature) │  │ (AI-nat) │  │  REST)   │         │   │
│   │            └──────────┘  └──────────┘  └──────────┘         │   │
│   │                   │             │             │              │   │
│   │                   └─────────────┴─────────────┘              │   │
│   │                                 │                            │   │
│   │                          ┌──────┴──────┐                     │   │
│   │                          ▼             ▼                     │   │
│   │                   ┌──────────┐   ┌──────────┐               │   │
│   │                   │ context- │   │ circuit- │               │   │
│   │                   │ inject.ts│   │ breaker  │               │   │
│   │                   │(Entity360│   │ (per     │               │   │
│   │                   │injection)│   │provider) │               │   │
│   │                   └──────────┘   └──────────┘               │   │
│   │                          │                                  │   │
│   └──────────────────────────┼──────────────────────────────────┘   │
│                              │                                       │
│                              ▼                                       │
│   ┌──────────────────────────────────────────────────────────────┐   │
│   │              EXTERNAL PROVIDER FABRIC                         │   │
│   │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐     │   │
│   │  │Salesf. │ │HubSpot │ │ Slack  │ │ GitHub │ │ Stripe │ ... │   │
│   │  │ MCP/   │ │ Nango  │ │ Nango  │ │ MCP/   │ │ Native │     │   │
│   │  │ REST   │ │ OAuth  │ │ OAuth  │ │ REST   │ │ REST   │     │   │
│   │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘     │   │
│   └──────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                         INBOUND PATH                                 │
│                                                                      │
│   EXTERNAL PROVIDERS                                                 │
│   ┌────────┐ ┌────────┐ ┌────────┐                                  │
│   │Salesf. │ │HubSpot │ │ Stripe │  webhooks / sync polls           │
│   │webhook │ │ webhook│ │webhook │ ───────────────────────────►     │
│   └────────┘ └────────┘ └────────┘                                  │
│                              │                                       │
│                              ▼                                       │
│   ┌──────────────────────────────────────────────────────────────┐   │
│   │              webhook-ingress  (Cloudflare Worker)             │   │
│   │  JWT verify (provider signature) → tenant routing             │   │
│   └──────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│                              ▼                                       │
│   ┌──────────────────────────────────────────────────────────────┐   │
│   │              iw-connector-sync  (Cloudflare Worker)           │   │
│   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │   │
│   │  │   sync.ts   │─►│ sync adapter│─►│ credentials.ts      │   │   │
│   │  │ (cron/      │  │ (inbound    │  │ (same credential    │   │   │
│   │  │  webhook    │  │  adapter)   │  │  wall as outbound)  │   │   │
│   │  │  triggered) │  └─────────────┘  └─────────────────────┘   │   │
│   │  └─────────────┘                                              │   │
│   │                              │                                │   │
│   │                              ▼                                │   │
│   │   ┌────────────────────────────────────────────────────┐     │   │
│   │   │  NORMALIZER_QUEUE → iw-normalizer (8-stage NA0-5) │     │   │
│   │   └────────────────────────────────────────────────────┘     │   │
│   │                              │                                │   │
│   │                              ▼                                │   │
│   │   ┌────────────────────────────────────────────────────┐     │   │
│   │   │  PIPELINE_QUEUE → iw-pipeline (only spine writer)  │     │   │
│   │   └────────────────────────────────────────────────────┘     │   │
│   └──────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
```

### 3.2 Adapter Philosophy

| Principle              | Implementation                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| **Co-location**        | Adapters live inside the service that uses them (`act`, `connector`, `connector-sync`)      |
| **Zero extra hop**     | `act` → adapter → provider. No intermediate orchestrator.                                   |
| **Interface contract** | `OutboundAdapter` and `InboundSyncAdapter` interfaces are the only contracts.               |
| **Swappability**       | Change adapter registration in a map. No consumer code changes.                             |
| **Tenant isolation**   | Every adapter instance is scoped to one tenant. No shared credential state.                 |
| **Observability**      | Every adapter call emits a `provider_call` telemetry event with latency, status, tenant_id. |

---

## 4. Adapter Taxonomy and Interface Contracts

### 4.1 Core TypeScript Interfaces

```typescript
// packages/connectors/src/types.ts
// Shared adapter contract — consumed by act, connector-sync, and connector

// ─────────────────────────────────────────────────────────────
// 4.1.1 Outbound Adapter Contract (execution)
// ─────────────────────────────────────────────────────────────

export interface OutboundAdapter {
  /** Execute a capability against a provider */
  execute(request: OutboundExecutionRequest): Promise<OutboundExecutionResult>;

  /** Health check — used by provider health monitor */
  healthCheck(credentials: Credentials): Promise<ProviderHealthStatus>;

  /** Optional: batch execution for bulk operations */
  executeBatch?(requests: OutboundExecutionRequest[]): Promise<OutboundExecutionResult[]>;
}

export interface OutboundExecutionRequest {
  /** Capability path: "salesforce.opportunity.update" */
  capability: string;

  /** Tenant identifier — every call is tenant-scoped */
  tenantId: string;

  /** Operation payload */
  payload: Record<string, unknown>;

  /** Entity360 context injected by the Continuity Layer */
  entityContext?: Entity360Context;

  /** Correlation ID for distributed tracing */
  correlationId: string;

  /** Governance approval token (for writes) */
  approvalToken?: string;

  /** Timeout override (ms). Default: 30000 */
  timeoutMs?: number;

  /** Idempotency key for safe retries */
  idempotencyKey: string;
}

export interface OutboundExecutionResult {
  /** Success / error / partial */
  status: "success" | "error" | "partial";

  /** Provider-native response (normalized later by pipeline) */
  rawResponse: Record<string, unknown>;

  /** Canonical entity IDs created/updated (for Spine writeback) */
  affectedEntities?: AffectedEntity[];

  /** Metadata for audit and telemetry */
  metadata: {
    provider: string;
    adapter: "nango" | "mcp" | "native";
    latencyMs: number;
    retryCount: number;
    circuitBreakerState: CircuitBreakerState;
    timestamp: number;
  };

  /** Error details if status !== 'success' */
  error?: AdapterError;
}

// ─────────────────────────────────────────────────────────────
// 4.1.2 Inbound Sync Adapter Contract (sync / webhook)
// ─────────────────────────────────────────────────────────────

export interface InboundSyncAdapter {
  /** Fetch raw records since last sync timestamp */
  fetch(request: InboundSyncRequest): Promise<InboundSyncResult>;

  /** Webhook handler — parse provider-specific webhook to canonical event */
  handleWebhook?(request: WebhookRequest): Promise<WebhookResult>;

  /** Resolve provider-specific cursor for incremental sync */
  getCursor?(credentials: Credentials): Promise<string | null>;
}

export interface InboundSyncRequest {
  tenantId: string;
  connectorId: string;
  provider: string;
  credentials: Credentials;

  /** Last successful sync timestamp */
  since: Date;

  /** Provider-specific cursor (for cursor-based pagination) */
  cursor?: string | null;

  /** Max records per page. Default: 500 */
  pageSize?: number;

  /** Correlation ID */
  correlationId: string;
}

export interface InboundSyncResult {
  /** Raw provider records — NOT normalized */
  rawRecords: RawRecord[];

  /** Next cursor, or null if complete */
  nextCursor: string | null;

  /** Whether more pages exist */
  hasMore: boolean;

  /** Provider-specific sync state to persist */
  syncState?: Record<string, unknown>;

  /** Metadata */
  metadata: {
    provider: string;
    adapter: string;
    recordsFetched: number;
    latencyMs: number;
    timestamp: number;
  };
}

// ─────────────────────────────────────────────────────────────
// 4.1.3 Credential Wall Types
// ─────────────────────────────────────────────────────────────

export interface Credentials {
  /** Adapter type determines which adapter factory is used */
  type: "nango" | "mcp" | "native";

  tenantId: string;
  provider: string;

  /** Nango: connectionId = tenant_id in practice */
  connectionId?: string;

  /** Nango: cached access token (short-lived, rotated) */
  accessToken?: string;

  /** Nango: refresh token (stored in CF Secrets, never logged) */
  refreshToken?: string;

  /** Native: API key (stored in CF Secrets) */
  apiKey?: string;

  /** Native / MCP: endpoint URL */
  endpointUrl?: string;

  /** MCP: server URL for outbound MCP pool */
  mcpServerUrl?: string;

  /** MCP: tool whitelist for this tenant */
  allowedTools?: string[];

  /** OAuth: token expiry timestamp */
  tokenExpiresAt?: number;

  /** OAuth: scopes granted */
  scopes?: string[];

  /** Custom provider-specific config */
  config?: Record<string, unknown>;
}

// ─────────────────────────────────────────────────────────────
// 4.1.4 Entity360 Context (injected into outbound calls)
// ─────────────────────────────────────────────────────────────

export interface Entity360Context {
  /** The primary entity this action targets */
  primaryEntity: {
    id: string; // SSOC stable UUID
    type: string; // e.g., "account", "contact", "deal"
    providerId: string; // Provider-native ID
    displayName: string;
  };

  /** Related entities (up to 5, ranked by relevance) */
  relatedEntities: RelatedEntity[];

  /** Recent timeline events for this entity */
  timeline: TimelineEvent[];

  /** Memory context — what the system "knows" about this entity */
  memory: {
    lastInteraction: number; // timestamp
    sentiment: number; // -1.0 to 1.0
    keyTopics: string[];
    openTasks: number;
  };

  /** Tenant-specific projection context (e.g., CS lens, Sales lens) */
  projectionContext?: Record<string, unknown>;
}

export interface RelatedEntity {
  id: string;
  type: string;
  relationship: string; // e.g., "primary_contact", "parent_account"
  displayName: string;
}

export interface TimelineEvent {
  timestamp: number;
  type: "email" | "call" | "meeting" | "note" | "task" | "sync";
  summary: string;
  actor: string; // user ID or "system"
}

// ─────────────────────────────────────────────────────────────
// 4.1.5 Error and Health Types
// ─────────────────────────────────────────────────────────────

export interface AdapterError {
  code:
    | "PROVIDER_UNAVAILABLE" // 5xx from provider
    | "AUTH_EXPIRED" // 401/403
    | "RATE_LIMITED" // 429
    | "INVALID_PAYLOAD" // 400 from provider
    | "TIMEOUT" // Adapter timeout
    | "CIRCUIT_OPEN" // Circuit breaker blocked call
    | "NOT_FOUND" // 404
    | "PERMISSION_DENIED" // Scope insufficient
    | "UNKNOWN"; // Catch-all
  message: string;
  providerErrorCode?: string;
  providerErrorMessage?: string;
  retryable: boolean;
  suggestedRetryAfterMs?: number;
}

export type CircuitBreakerState = "CLOSED" | "OPEN" | "HALF_OPEN";

export interface ProviderHealthStatus {
  provider: string;
  tenantId: string;
  state: CircuitBreakerState;
  lastCheckAt: number;
  consecutiveFailures: number;
  latencyP50: number;
  latencyP99: number;
  errorRate: number; // 0.0 - 1.0 over last 5 min
  nextRetryAt?: number; // Only when OPEN
}

// ─────────────────────────────────────────────────────────────
// 4.1.6 Affected Entity (for Spine writeback)
// ─────────────────────────────────────────────────────────────

export interface AffectedEntity {
  /** Canonical SSOC ID (assigned by normalizer) */
  canonicalId: string;

  /** Provider-native ID */
  providerId: string;

  /** Entity type in canonical schema */
  type: string;

  /** Operation performed */
  operation: "created" | "updated" | "deleted" | "noop";

  /** Provider name */
  provider: string;
}
```

### 4.2 Adapter Registry Maps

```typescript
// packages/connectors/src/registry.ts
// Adapter registration — the ONLY place provider → adapter mapping is defined.
// Changing a provider from Nango to MCP is a one-line change here.

import { NangoAdapter } from "./adapters/nango";
import { MCPOutboundAdapter } from "./adapters/mcp-outbound";
import { NativeAdapter } from "./adapters/native";
import { SalesforceSyncAdapter } from "./adapters/sync/salesforce-sync";
import { HubSpotSyncAdapter } from "./adapters/sync/hubspot-sync";
import { SlackSyncAdapter } from "./adapters/sync/slack-sync";
import { StripeSyncAdapter } from "./adapters/sync/stripe-sync";

// ─────────────────────────────────────────────────────────────
// OUTBOUND ADAPTER REGISTRY
// ─────────────────────────────────────────────────────────────

export const outboundAdapterRegistry: Record<
  string,
  {
    adapter: new () => OutboundAdapter;
    credentialType: "nango" | "mcp" | "native";
    defaultTimeoutMs: number;
    supportsBatch: boolean;
    circuitBreaker: {
      failureThreshold: number;
      recoveryTimeoutMs: number;
      halfOpenMaxCalls: number;
    };
  }
> = {
  // Nango-powered OAuth providers (mature SaaS)
  salesforce: {
    adapter: NangoAdapter,
    credentialType: "nango",
    defaultTimeoutMs: 30000,
    supportsBatch: true,
    circuitBreaker: { failureThreshold: 5, recoveryTimeoutMs: 30000, halfOpenMaxCalls: 3 },
  },
  hubspot: {
    adapter: NangoAdapter,
    credentialType: "nango",
    defaultTimeoutMs: 30000,
    supportsBatch: true,
    circuitBreaker: { failureThreshold: 5, recoveryTimeoutMs: 30000, halfOpenMaxCalls: 3 },
  },
  slack: {
    adapter: NangoAdapter,
    credentialType: "nango",
    defaultTimeoutMs: 15000,
    supportsBatch: false, // Slack API is chat-oriented
    circuitBreaker: { failureThreshold: 5, recoveryTimeoutMs: 20000, halfOpenMaxCalls: 2 },
  },
  notion: {
    adapter: NangoAdapter,
    credentialType: "nango",
    defaultTimeoutMs: 20000,
    supportsBatch: true,
    circuitBreaker: { failureThreshold: 5, recoveryTimeoutMs: 30000, halfOpenMaxCalls: 3 },
  },

  // MCP-native providers (AI-first tool APIs)
  github: {
    adapter: MCPOutboundAdapter,
    credentialType: "mcp",
    defaultTimeoutMs: 30000,
    supportsBatch: false,
    circuitBreaker: { failureThreshold: 3, recoveryTimeoutMs: 60000, halfOpenMaxCalls: 1 },
  },
  linear: {
    adapter: MCPOutboundAdapter,
    credentialType: "mcp",
    defaultTimeoutMs: 20000,
    supportsBatch: true,
    circuitBreaker: { failureThreshold: 3, recoveryTimeoutMs: 60000, halfOpenMaxCalls: 1 },
  },
  figma: {
    adapter: MCPOutboundAdapter,
    credentialType: "mcp",
    defaultTimeoutMs: 20000,
    supportsBatch: false,
    circuitBreaker: { failureThreshold: 3, recoveryTimeoutMs: 60000, halfOpenMaxCalls: 1 },
  },

  // Native REST providers (direct HTTP, no abstraction)
  stripe: {
    adapter: NativeAdapter,
    credentialType: "native",
    defaultTimeoutMs: 30000,
    supportsBatch: true,
    circuitBreaker: { failureThreshold: 5, recoveryTimeoutMs: 30000, halfOpenMaxCalls: 3 },
  },
  aws: {
    adapter: NativeAdapter,
    credentialType: "native",
    defaultTimeoutMs: 60000,
    supportsBatch: true,
    circuitBreaker: { failureThreshold: 5, recoveryTimeoutMs: 60000, halfOpenMaxCalls: 3 },
  },
  custom: {
    adapter: NativeAdapter,
    credentialType: "native",
    defaultTimeoutMs: 30000,
    supportsBatch: false,
    circuitBreaker: { failureThreshold: 5, recoveryTimeoutMs: 30000, halfOpenMaxCalls: 3 },
  },
};

// ─────────────────────────────────────────────────────────────
// INBOUND SYNC ADAPTER REGISTRY
// ─────────────────────────────────────────────────────────────

export const inboundSyncAdapterRegistry: Record<
  string,
  {
    adapter: new () => InboundSyncAdapter;
    syncMode: "poll" | "webhook" | "hybrid";
    defaultIntervalMinutes: number;
    supportsIncremental: boolean;
  }
> = {
  salesforce: {
    adapter: SalesforceSyncAdapter,
    syncMode: "hybrid", // Webhook for realtime + poll for backup
    defaultIntervalMinutes: 360, // 6 hours creamy sync
    supportsIncremental: true,
  },
  hubspot: {
    adapter: HubSpotSyncAdapter,
    syncMode: "hybrid",
    defaultIntervalMinutes: 360,
    supportsIncremental: true,
  },
  slack: {
    adapter: SlackSyncAdapter,
    syncMode: "webhook", // Slack is event-driven
    defaultIntervalMinutes: 0, // No polling
    supportsIncremental: false,
  },
  stripe: {
    adapter: StripeSyncAdapter,
    syncMode: "webhook",
    defaultIntervalMinutes: 0,
    supportsIncremental: false,
  },
};
```

---

## 5. Outbound Execution Flow (act Service)

### 5.1 Service Structure

```
services/act/
├── src/
│   ├── index.ts                    # Worker entry — ACT_QUEUE consumer
│   ├── execute.ts                  # Main execution orchestrator
│   ├── batch-execute.ts            # Batch execution (bulk ops)
│   ├── adapters/
│   │   ├── index.ts                # Adapter factory + registry
│   │   ├── nango.ts                # Nango OAuth adapter
│   │   ├── mcp-outbound.ts         # MCP outbound adapter
│   │   ├── native.ts               # Native REST adapter
│   │   ├── credentials.ts          # Credential wall (CF Secrets / KV / Nango)
│   │   ├── context-inject.ts       # Entity360 injection
│   │   └── health.ts               # Per-provider health checks
│   ├── circuit-breaker/
│   │   ├── breaker.ts              # Circuit breaker state machine
│   │   ├── store.ts                # KV-backed breaker state
│   │   └── monitor.ts              # Background health probe
│   ├── telemetry.ts                # Provider call telemetry
│   └── types.ts                    # Service-local types
├── wrangler.toml
└── package.json
```

### 5.2 Execution Flow Diagram

```
ACT_QUEUE (Cloudflare Queues)
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│  iw-act  (Cloudflare Worker)                                 │
│                                                              │
│  1. DEQUEUE                                                  │
│     │ Parse message: { capability, tenantId, payload,        │
│     │   correlationId, idempotencyKey, approvalToken }       │
│     ▼                                                        │
│  2. IDEMPOTENCY CHECK                                        │
│     │ Query KV: idempotencyKey exists?                       │
│     │ Yes → return cached result                             │
│     │ No → proceed                                           │
│     ▼                                                        │
│  3. CREDENTIAL WALL                                          │
│     │ credentials.ts → getCredentials(provider, tenantId)    │
│     │                                                        │
│     │   CF Secrets ──► decrypt API key / refresh token       │
│     │   Nango API ───► fetch access token (cached 5 min)     │
│     │   KV cache ────► short-lived token cache               │
│     │                                                        │
│     │ Security: NEVER log tokens. NEVER return to caller.    │
│     ▼                                                        │
│  4. CIRCUIT BREAKER CHECK                                    │
│     │ breaker.ts → getState(provider, tenantId)              │
│     │                                                        │
│     │   CLOSED   → proceed                                   │
│     │   OPEN     → reject with CIRCUIT_OPEN error            │
│     │   HALF_OPEN→ allow limited probes, then decide         │
│     ▼                                                        │
│  5. ENTITY360 INJECTION                                      │
│     │ context-inject.ts → assembleEntity360(tenantId,        │
│     │   payload.entity_id)                                   │
│     │                                                        │
│     │   Spine query ──► entity by SSOC ID                    │
│     │   Memory query ──► recent interactions                 │
│     │   Relation query ──► linked entities                   │
│     │   Timeline query ──► recent events                     │
│     │                                                        │
│     │ Result: Entity360Context enriched payload              │
│     ▼                                                        │
│  6. ADAPTER SELECTION + EXECUTION                            │
│     │ adapters/index.ts → selectAdapter(provider)            │
│     │                                                        │
│     │   nango.ts      ──► Nango proxy API                    │
│     │   mcp-outbound.ts ──► MCP client (SSE/stdio)           │
│     │   native.ts     ──► fetch() with custom headers        │
│     │                                                        │
│     │ Each adapter implements OutboundAdapter interface.     │
│     ▼                                                        │
│  7. TELEMETRY EMIT                                           │
│     │ telemetry.ts → emitProviderCall({...})                 │
│     │   → Cloudflare Workers Analytics                       │
│     │   → telemetry service (async)                          │
│     ▼                                                        │
│  8. CIRCUIT BREAKER UPDATE                                   │
│     │ On success: reset failure count                        │
│     │ On failure: increment, check threshold, maybe OPEN     │
│     ▼                                                        │
│  9. SPINE WRITEBACK                                          │
│     │ enqueueToPipelineQueue({ type: 'execution_result',     │
│     │   tenantId, capability, result, affectedEntities })    │
│     │                                                        │
│     │ ONLY pipeline writes to Spine. act NEVER writes D1.    │
│     ▼                                                        │
│  10. IDEMPOTENCY CACHE                                       │
│     │ KV.set(idempotencyKey, result, { expirationTtl: 86400 })│
│     │                                                        │
│     └────────────────────────────────────────────────────────►│
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 5.3 execute.ts — Canonical Implementation

```typescript
// services/act/src/execute.ts

import { getCredentials } from "./adapters/credentials";
import { selectAdapter } from "./adapters";
import { assembleEntity360 } from "./adapters/context-inject";
import { checkCircuitBreaker, recordResult } from "./circuit-breaker/breaker";
import { emitProviderCall } from "./telemetry";
import { enqueueToPipelineQueue } from "./queue";
import { kv } from "./kv";

const IDEMPOTENCY_TTL = 86400; // 24 hours

export async function executeCapability(
  message: ActQueueMessage
): Promise<OutboundExecutionResult> {
  const startTime = Date.now();
  const { capability, tenantId, payload, correlationId, idempotencyKey } = message;
  const [provider, resource, operation] = capability.split(".");

  // ── 1. IDEMPOTENCY ──────────────────────────────────────────
  const cached = await kv.get<OutboundExecutionResult>(`idemp:${idempotencyKey}`);
  if (cached) {
    return {
      ...cached,
      metadata: { ...cached.metadata, fromCache: true },
    } as OutboundExecutionResult;
  }

  try {
    // ── 2. CREDENTIAL WALL ────────────────────────────────────
    const credentials = await getCredentials(provider, tenantId);
    if (!credentials) {
      throw adapterError("AUTH_EXPIRED", `No credentials for ${provider}/${tenantId}`, false);
    }

    // ── 3. CIRCUIT BREAKER ────────────────────────────────────
    const breakerState = await checkCircuitBreaker(provider, tenantId);
    if (breakerState === "OPEN") {
      throw adapterError("CIRCUIT_OPEN", `Circuit breaker OPEN for ${provider}/${tenantId}`, false);
    }

    // ── 4. ENTITY360 INJECTION ────────────────────────────────
    const entityContext = payload.entity_id
      ? await assembleEntity360(tenantId, payload.entity_id as string)
      : undefined;

    // ── 5. ADAPTER EXECUTION ──────────────────────────────────
    const adapter = selectAdapter(provider);
    const request: OutboundExecutionRequest = {
      capability,
      tenantId,
      payload,
      entityContext,
      correlationId,
      approvalToken: message.approvalToken,
      idempotencyKey,
    };

    const result = await adapter.execute(request);

    // ── 6. TELEMETRY ──────────────────────────────────────────
    await emitProviderCall({
      tenantId,
      provider,
      capability,
      latencyMs: Date.now() - startTime,
      status: result.status,
      correlationId,
    });

    // ── 7. CIRCUIT BREAKER UPDATE ─────────────────────────────
    await recordResult(provider, tenantId, result.status === "success");

    // ── 8. SPINE WRITEBACK ────────────────────────────────────
    await enqueueToPipelineQueue({
      type: "execution_result",
      tenantId,
      capability,
      result,
      timestamp: Date.now(),
      correlationId,
    });

    // ── 9. IDEMPOTENCY CACHE ──────────────────────────────────
    await kv.put(`idemp:${idempotencyKey}`, JSON.stringify(result), {
      expirationTtl: IDEMPOTENCY_TTL,
    });

    return result;
  } catch (err) {
    // ── ERROR PATH ────────────────────────────────────────────
    const adapterErr = normalizeError(err);

    await recordResult(provider, tenantId, false);

    await emitProviderCall({
      tenantId,
      provider,
      capability,
      latencyMs: Date.now() - startTime,
      status: "error",
      errorCode: adapterErr.code,
      correlationId,
    });

    // Even errors write to pipeline for audit completeness
    await enqueueToPipelineQueue({
      type: "execution_error",
      tenantId,
      capability,
      error: adapterErr,
      timestamp: Date.now(),
      correlationId,
    });

    throw adapterErr;
  }
}
```

---

## 6. Inbound Sync Flow (connector-sync Service)

### 6.1 Service Structure

```
services/connector-sync/
├── src/
│   ├── index.ts                    # Worker entry — cron + queue
│   ├── sync.ts                     # Sync orchestrator
│   ├── webhook-handler.ts          # Webhook → sync adapter routing
│   ├── adapters/
│   │   ├── index.ts                # Sync adapter factory
│   │   ├── salesforce-sync.ts      # SOQL + bulk API sync
│   │   ├── hubspot-sync.ts         // HubSpot CRM sync
│   │   ├── slack-sync.ts           // Conversations + users sync
│   │   └── stripe-sync.ts          // Events API sync
│   ├── scheduler.ts                // Cron schedule manager
│   ├── state.ts                    // Sync cursor/state persistence
│   └── types.ts
├── wrangler.toml
└── package.json
```

### 6.2 Sync Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        INBOUND SYNC FLOW                            │
│                                                                     │
│   TRIGGER SOURCES                                                   │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐    │
│   │  Cloudflare │  │  Nango      │  │  Provider webhook       │    │
│   │  Cron (6h)  │  │  webhook    │  │  (Salesforce, Stripe)   │    │
│   └──────┬──────┘  └──────┬──────┘  └────────────┬────────────┘    │
│          │                │                      │                 │
│          └────────────────┼──────────────────────┘                 │
│                           ▼                                         │
│   ┌───────────────────────────────────────────────────────────┐    │
│   │           CONNECTOR_SYNC_QUEUE                            │    │
│   │  { tenantId, connectorId, provider, trigger, timestamp }  │    │
│   └────────────────────────┬──────────────────────────────────┘    │
│                            │                                        │
│                            ▼                                        │
│   ┌───────────────────────────────────────────────────────────┐    │
│   │  iw-connector-sync  (Cloudflare Worker)                   │    │
│   │                                                           │    │
│   │  1. DEQUEUE                                               │    │
│   │     │ Load connector config from D1                       │    │
│   │     │   WHERE tenant_id = ? AND connector_id = ?          │    │
│   │     ▼                                                     │    │
│   │  2. RESOLVE CREDENTIALS                                   │    │
│   │     │ Same credential wall as outbound (getCredentials)   │    │
│   │     │ Connection ID = tenant_id (isolated)                │    │
│   │     ▼                                                     │    │
│   │  3. LOAD SYNC STATE                                       │    │
│   │     │ KV: sync_state:{tenantId}:{connectorId}             │    │
│   │     │   { lastSyncAt, cursor, recordCount }               │    │
│   │     ▼                                                     │    │
│   │  4. SELECT SYNC ADAPTER                                   │    │
│   │     │ Factory looks up inboundSyncAdapterRegistry         │    │
│   │     │   SalesforceSyncAdapter, HubSpotSyncAdapter, etc.   │    │
│   │     ▼                                                     │    │
│   │  5. FETCH RAW RECORDS                                     │    │
│   │     │ Adapter calls provider API                          │    │
│   │     │   Salesforce → SOQL REST API                        │    │
│   │     │   HubSpot    → CRM API v3                           │    │
│   │     │   Slack      → Conversations API                    │    │
│   │     │   Stripe     → Events API                           │    │
│   │     ▼                                                     │    │
│   │  6. PERSIST STATE                                         │    │
│   │     │ Save cursor, timestamp to KV                        │    │
│   │     ▼                                                     │    │
│   │  7. ENQUEUE TO NORMALIZER                                 │    │
│   │     │ NORMALIZER_QUEUE: { tenantId, provider, records }   │    │
│   │     │                                                     │    │
│   │     │ Security: Records are RAW — no parsing here.        │    │
│   │     │   Normalizer owns schema transformation.            │    │
│   │     ▼                                                     │    │
│   │  8. EMIT SYNC TELEMETRY                                   │    │
│   │     │ Records fetched, latency, provider, tenant          │    │
│   │     │                                                     │    │
│   └───────────────────────────────────────────────────────────┘    │
│                            │                                        │
│                            ▼                                        │
│   ┌───────────────────────────────────────────────────────────┐    │
│   │  iw-normalizer  (8-stage pipeline: NA0 → NA5)             │    │
│   │                                                           │    │
│   │  NA0: Schema detection     ──► detect provider schema     │    │
│   │  NA1: Canonical transform  ──► map to canonical types     │    │
│   │  NA2: SSOC resolution      ──► stable UUID assignment     │    │
│   │  NA3: Lineage tracking     ──► provenance + audit trail   │    │
│   │  NA4: Relation binding     ──► link to existing entities  │    │
│   │  NA5: Spine publish        ──► emit to PIPELINE_QUEUE     │    │
│   └───────────────────────────────────────────────────────────┘    │
│                            │                                        │
│                            ▼                                        │
│   ┌───────────────────────────────────────────────────────────┐    │
│   │  iw-pipeline  (ONLY writer to D1 Spine)                   │    │
│   │                                                           │    │
│   │  INSERT entities, relationships                           │    │
│   │  WRITE spine_audit_log                                    │    │
│   │  WRITE sync_job_log                                       │    │
│   │                                                           │    │
│   │  Invariant: pipeline is the SOLE writer.                  │    │
│   │    No other service writes to D1 entities table.          │    │
│   └───────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.3 Webhook-to-Sync Routing

When a provider webhook arrives at `webhook-ingress`, it is **not** directly processed. It is routed through the same adapter pattern:

```typescript
// services/webhook-ingress/src/index.ts

export async function handleWebhook(request: Request): Promise<Response> {
  // 1. Verify provider signature (Salesforce HMAC, Stripe sig, etc.)
  const provider = extractProvider(request);
  const signature = request.headers.get("X-Webhook-Signature");
  if (!verifyWebhookSignature(provider, signature, await request.text())) {
    return new Response("Invalid signature", { status: 401 });
  }

  // 2. Extract tenant from webhook metadata (never from URL param)
  const tenantId = await resolveTenantFromWebhook(provider, request);
  if (!tenantId) {
    return new Response("Unknown tenant", { status: 404 });
  }

  // 3. Enqueue to connector-sync — do NOT process inline
  //    (webhook ingress must be fast; sync processing is async)
  await enqueueToConnectorSyncQueue({
    type: "webhook",
    tenantId,
    provider,
    payload: await request.json(),
    receivedAt: Date.now(),
    correlationId: crypto.randomUUID(),
  });

  return new Response("Accepted", { status: 202 });
}
```

---

## 7. Credential Wall

### 7.1 Design Principle

The Credential Wall is the **single point of secret retrieval** for the entire Provider Fabric. No adapter fetches credentials directly. No service caches credentials outside the wall. Every credential access is logged, audited, and tenant-isolated.

### 7.2 Storage Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                  CREDENTIAL WALL ARCHITECTURE                 │
│                                                             │
│   TIER 1: Cloudflare Secrets (Encrypted at rest)            │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  Secret Name Pattern:                               │   │
│   │    PROVIDER_{PROVIDER}_{TENANT_ID}_API_KEY         │   │
│   │    PROVIDER_{PROVIDER}_{TENANT_ID}_REFRESH_TOKEN   │   │
│   │    PROVIDER_{PROVIDER}_{TENANT_ID}_CLIENT_SECRET   │   │
│   │                                                     │   │
│   │  Examples:                                          │   │
│   │    PROVIDER_SALESFORCE_T_abc123_API_KEY            │   │
│   │    PROVIDER_STRIPE_T_abc123_API_KEY                │   │
│   │    PROVIDER_GITHUB_T_abc123_TOKEN                  │   │
│   │                                                     │   │
│   │  Access: Only via env.getSecret() in Workers       │   │
│   │  Rotation: Admin CLI or Nango auto-refresh         │   │
│   └─────────────────────────────────────────────────────┘   │
│                            │                                │
│   TIER 2: Nango Vault (OAuth token storage)                 │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  connectionId = tenant_id  (by convention)          │   │
│   │                                                     │   │
│   │  Nango stores:                                      │   │
│   │    - access_token  (short-lived, ~1 hour)           │   │
│   │    - refresh_token  (long-lived, rotated by Nango)  │   │
│   │    - expires_at                                     │   │
│   │    - connection_config (scopes, metadata)           │   │
│   │                                                     │   │
│   │  Access: Nango REST API with NANGO_SECRET_KEY       │   │
│   └─────────────────────────────────────────────────────┘   │
│                            │                                │
│   TIER 3: KV Cache (Performance, NOT security)              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  Key: cred_cache:{provider}:{tenantId}              │   │
│   │  TTL: 300 seconds (5 min)                           │   │
│   │  Content: Decrypted access token (ephemeral)        │   │
│   │                                                     │   │
│   │  WARNING: KV is NOT encrypted. Tokens are short-    │   │
│   │  lived and rotate frequently. Never cache refresh   │   │
│   │  tokens in KV.                                      │   │
│   └─────────────────────────────────────────────────────┘   │
│                            │                                │
│                            ▼                                │
│   ┌─────────────────────────────────────────────────────┐   │
│   │              getCredentials() FLOW                  │   │
│   │                                                     │   │
│   │  1. Check KV cache first (fast path)                │   │
│   │     Hit → return cached token (check expiry)        │   │
│   │                                                     │   │
│   │  2. Check credential type from connector config     │   │
│   │     nango  → call Nango API for access token        │   │
│   │     native → fetch from CF Secrets                  │   │
│   │     mcp    → fetch endpoint + token from Secrets    │   │
│   │                                                     │   │
│   │  3. If token expired and refreshable:               │   │
│   │     Nango → auto-refresh (Nango handles this)       │   │
│   │     Native → use refresh_token → new access_token   │   │
│   │                                                     │   │
│   │  4. Cache in KV (5 min TTL)                         │   │
│   │                                                     │   │
│   │  5. Return credentials to adapter                   │   │
│   │                                                     │   │
│   │  AUDIT: Every retrieval logged to                   │   │
│   │    spine_audit_log with action: CREDENTIAL_ACCESS   │   │
│   └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 7.3 getCredentials Implementation

```typescript
// services/act/src/adapters/credentials.ts
// services/connector-sync/src/adapters/credentials.ts
// (shared via packages/connectors, but implemented per-service)

import { Credentials } from "@integratewise/connectors";

const KV_CACHE_TTL = 300; // 5 minutes

export async function getCredentials(
  provider: string,
  tenantId: string
): Promise<Credentials | null> {
  // 1. Check KV cache
  const cacheKey = `cred_cache:${provider}:${tenantId}`;
  const cached = await kv.get<Credentials>(cacheKey);
  if (cached && !isExpired(cached)) {
    return cached;
  }

  // 2. Load connector config to determine credential type
  const config = await getConnectorConfig(provider, tenantId);
  if (!config) return null;

  let credentials: Credentials;

  switch (config.credentialType) {
    case "nango": {
      const nangoCreds = await fetchNangoCredentials(provider, tenantId);
      credentials = {
        type: "nango",
        tenantId,
        provider,
        connectionId: tenantId, // Convention: connectionId = tenantId
        accessToken: nangoCreds.access_token,
        refreshToken: undefined, // Nango manages refresh; we never see it
        tokenExpiresAt: nangoCreds.expires_at,
        scopes: nangoCreds.scopes,
      };
      break;
    }

    case "native": {
      const apiKey = await env.getSecret(`PROVIDER_${provider.toUpperCase()}_${tenantId}_API_KEY`);
      const endpointUrl = config.endpointUrl;
      credentials = {
        type: "native",
        tenantId,
        provider,
        apiKey,
        endpointUrl,
      };
      break;
    }

    case "mcp": {
      const mcpToken = await env.getSecret(
        `PROVIDER_${provider.toUpperCase()}_${tenantId}_MCP_TOKEN`
      );
      const mcpServerUrl = config.mcpServerUrl;
      const allowedTools = config.allowedTools;
      credentials = {
        type: "mcp",
        tenantId,
        provider,
        mcpServerUrl,
        accessToken: mcpToken,
        allowedTools,
      };
      break;
    }

    default:
      return null;
  }

  // 3. Cache in KV (ephemeral — token is short-lived anyway)
  await kv.put(cacheKey, JSON.stringify(credentials), {
    expirationTtl: KV_CACHE_TTL,
  });

  // 4. Audit log
  await logCredentialAccess(provider, tenantId, config.credentialType);

  return credentials;
}

function isExpired(creds: Credentials): boolean {
  if (!creds.tokenExpiresAt) return false;
  return Date.now() >= creds.tokenExpiresAt - 60000; // 1 min buffer
}
```

---

## 8. Entity360 Injection Protocol

### 8.1 Purpose

Every outbound call carries **context** from the Continuity Layer. This is not just "pass the entity ID." It is a structured, ranked, truncated context package that lets the provider adapter (or the provider itself, if MCP-native) make semantically richer decisions.

### 8.2 Assembly Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                 ENTITY360 ASSEMBLY PIPELINE                         │
│                                                                     │
│   INPUT: tenantId, entityId (SSOC UUID)                             │
│                                                                     │
│   STEP 1: PRIMARY ENTITY RESOLUTION                                 │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │  Query Spine (via service binding to spine-v2)              │   │
│   │    SELECT * FROM entities                                   │   │
│   │    WHERE tenant_id = ? AND ssoc_id = ?                      │   │
│   │                                                             │   │
│   │  Result: { id, type, provider_ids, traits, metadata }       │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│   STEP 2: RELATED ENTITIES (max 5)                                  │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │  Query relationships table                                  │   │
│   │    SELECT * FROM relationships                              │   │
│   │    WHERE tenant_id = ?                                      │   │
│   │      AND (source_id = ? OR target_id = ?)                   │   │
│   │    ORDER BY strength DESC                                   │   │
│   │    LIMIT 5                                                  │   │
│   │                                                             │   │
│   │  Resolve each related entity's display name + type          │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│   STEP 3: TIMELINE (last 10 events)                                 │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │  Query memory / audit log                                   │   │
│   │    SELECT * FROM spine_audit_log                            │   │
│   │    WHERE tenant_id = ? AND entity_id = ?                    │   │
│   │    ORDER BY timestamp DESC                                  │   │
│   │    LIMIT 10                                                 │   │
│   │                                                             │   │
│   │  Normalize to TimelineEvent[]                               │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│   STEP 4: MEMORY CONTEXT                                            │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │  Query continuity service (memory tier)                     │   │
│   │    { lastInteraction, sentiment, keyTopics, openTasks }     │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│   STEP 5: CONTEXT WINDOW OPTIMIZATION                               │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │  Truncate timeline to fit within budget                     │   │
│   │  Rank related entities by relevance score                   │   │
│   │  Serialize to compact JSON                                  │   │
│   │                                                             │   │
│   │  Budget: max 8KB per outbound call (configurable)           │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│                              ▼                                      │
│   OUTPUT: Entity360Context object                                   │
└─────────────────────────────────────────────────────────────────────┘
```

### 8.3 context-inject.ts Implementation

```typescript
// services/act/src/adapters/context-inject.ts

import { Entity360Context, RelatedEntity, TimelineEvent } from "@integratewise/connectors";

const MAX_RELATED_ENTITIES = 5;
const MAX_TIMELINE_EVENTS = 10;
const CONTEXT_BUDGET_BYTES = 8192; // 8KB

export async function assembleEntity360(
  tenantId: string,
  entityId: string
): Promise<Entity360Context | undefined> {
  // Query spine-v2 via service binding
  const spine = getSpineBinding();

  const [entity, relations, timeline, memory] = await Promise.all([
    spine.getEntity(tenantId, entityId),
    spine.getRelatedEntities(tenantId, entityId, MAX_RELATED_ENTITIES),
    spine.getEntityTimeline(tenantId, entityId, MAX_TIMELINE_EVENTS),
    getMemoryContext(tenantId, entityId),
  ]);

  if (!entity) return undefined;

  const context: Entity360Context = {
    primaryEntity: {
      id: entity.ssoc_id,
      type: entity.type,
      providerId: entity.provider_ids?.[0] ?? entity.id,
      displayName: entity.traits?.display_name ?? entity.traits?.name ?? "Unknown",
    },
    relatedEntities: relations.map((r: any) => ({
      id: r.target_id === entityId ? r.source_id : r.target_id,
      type: r.target_type,
      relationship: r.relationship_type,
      displayName: r.target_name ?? "Unknown",
    })),
    timeline: timeline.map((t: any) => ({
      timestamp: t.timestamp,
      type: t.event_type,
      summary: t.summary,
      actor: t.actor_id ?? "system",
    })),
    memory: memory ?? {
      lastInteraction: 0,
      sentiment: 0,
      keyTopics: [],
      openTasks: 0,
    },
  };

  // Budget enforcement
  const serialized = JSON.stringify(context);
  if (serialized.length > CONTEXT_BUDGET_BYTES) {
    return truncateContext(context, CONTEXT_BUDGET_BYTES);
  }

  return context;
}

function truncateContext(ctx: Entity360Context, budget: number): Entity360Context {
  // Truncate timeline first (least critical)
  while (JSON.stringify(ctx).length > budget && ctx.timeline.length > 3) {
    ctx.timeline.pop();
  }
  // Then related entities
  while (JSON.stringify(ctx).length > budget && ctx.relatedEntities.length > 2) {
    ctx.relatedEntities.pop();
  }
  // Last resort: truncate summaries
  if (JSON.stringify(ctx).length > budget) {
    ctx.timeline = ctx.timeline.map((t) => ({
      ...t,
      summary: t.summary.substring(0, 100),
    }));
  }
  return ctx;
}
```

### 8.4 MCP-Native Context Passing

For MCP outbound adapters, Entity360 is injected into the MCP `tool` call as a structured `_context` parameter:

```typescript
// services/act/src/adapters/mcp-outbound.ts

async function execute(request: OutboundExecutionRequest): Promise<OutboundExecutionResult> {
  const { capability, payload, entityContext, credentials } = request;

  // Build MCP tool call
  const toolCall = {
    name: capability,
    arguments: {
      ...payload,
      // Entity360 injected as structured context
      _iw_context: entityContext
        ? {
            entity: entityContext.primaryEntity,
            related: entityContext.relatedEntities,
            memory: entityContext.memory,
            // Timeline omitted for MCP (too large); summary only
            summary: entityContext.timeline
              .slice(0, 3)
              .map((t) => t.summary)
              .join("; "),
          }
        : undefined,
    },
  };

  // Call provider MCP server
  const mcpClient = new MCPClient({
    serverUrl: credentials.mcpServerUrl!,
    authToken: credentials.accessToken!,
  });

  const result = await mcpClient.callTool(toolCall);
  return normalizeMCPResult(result, capability);
}
```

---

## 9. Tool-to-Tool Communication Protocol (T2T)

### 9.1 Purpose

The Tool-to-Tool (T2T) protocol enables **providers to communicate with each other through the Bridge**, not peer-to-peer. When Salesforce needs to notify Slack, or GitHub needs to update Linear, the request flows through the Provider Fabric — mediated, governed, and audited.

### 9.2 Why Not Peer-to-Peer?

| Peer-to-Peer        | T2T via Bridge                                |
| ------------------- | --------------------------------------------- |
| No governance       | Governed by confidence gate                   |
| No audit trail      | Full `spine_audit_log` + `outbound_mcp_calls` |
| No context sharing  | Entity360 injected automatically              |
| Credential sprawl   | Single credential wall                        |
| No tenant isolation | `WHERE tenant_id = ?` on every hop            |

### 9.3 T2T Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TOOL-TO-TOOL PROTOCOL                            │
│                                                                     │
│   SCENARIO: Salesforce opportunity closes → Slack notification      │
│                                                                     │
│   Salesforce                                                        │
│       │ webhook: "opportunity.closed_won"                           │
│       ▼                                                             │
│   ┌───────────────────┐                                             │
│   │ webhook-ingress   │  verify signature, route to tenant          │
│   └─────────┬─────────┘                                             │
│             ▼                                                       │
│   ┌───────────────────┐                                             │
│   │ connector-sync    │  SalesforceSyncAdapter.handleWebhook()      │
│   └─────────┬─────────┘                                             │
│             ▼                                                       │
│   ┌───────────────────┐                                             │
│   │ normalizer        │  NA0-NA5: normalize to canonical event      │
│   └─────────┬─────────┘                                             │
│             ▼                                                       │
│   ┌───────────────────┐                                             │
│   │ pipeline          │  WRITE Spine: event entity + relationships   │
│   └─────────┬─────────┘                                             │
│             ▼                                                       │
│   ┌───────────────────┐                                             │
│   │ twin-orchestrator │  AMBIENT Twin detects pattern:              │
│   │  (AMBIENT)        │  "closed_won → notify channel"              │
│   └─────────┬─────────┘                                             │
│             │ Proposes: send_slack_notification                     │
│             │ Confidence: 0.92                                      │
│             ▼                                                       │
│   ┌───────────────────┐                                             │
│   │ govern            │  ≥0.85 → AUTO-APPROVE                       │
│   └─────────┬─────────┘                                             │
│             ▼                                                       │
│   ┌───────────────────┐                                             │
│   │ ACT_QUEUE         │  { capability: "slack.chat.postMessage",    │
│   └─────────┬─────────┘    payload: { channel, text, blocks } }     │
│             ▼                                                       │
│   ┌───────────────────┐                                             │
│   │ act               │  NangoAdapter.execute()                     │
│   │                   │  Entity360 injected (account context)       │
│   │                   │  Credential wall: Slack token for tenant    │
│   └─────────┬─────────┘                                             │
│             ▼                                                       │
│   ┌───────────────────┐                                             │
│   │ Slack API         │  Message posted                             │
│   └───────────────────┘                                             │
│                                                                     │
│   RESULT:                                                           │
│   - Slack message sent with account context                         │
│   - Full audit trail in spine_audit_log                             │
│   - No direct Salesforce → Slack connection ever existed            │
│   - If Slack is down: circuit breaker OPEN, retry later             │
└─────────────────────────────────────────────────────────────────────┘
```

### 9.4 T2T Message Schema

```typescript
// packages/connectors/src/t2t.ts

export interface T2TRequest {
  /** The source provider that triggered this chain */
  sourceProvider: string;

  /** The target capability to invoke */
  targetCapability: string;

  /** Tenant scope */
  tenantId: string;

  /** Canonical entity ID that triggered the chain */
  triggerEntityId: string;

  /** The full Entity360 context from the source */
  sourceContext: Entity360Context;

  /** Proposed payload for the target capability */
  proposedPayload: Record<string, unknown>;

  /** Why this T2T was proposed (Twin reasoning trace) */
  reasoningTrace: string;

  /** Governance approval token (pre-approved by govern) */
  approvalToken: string;

  /** Max chain depth to prevent infinite loops */
  maxChainDepth: number;

  /** Current depth in the chain */
  currentDepth: number;
}

export interface T2TResult {
  /** Whether the target call succeeded */
  status: "success" | "error" | "rejected";

  /** Target call result */
  targetResult?: OutboundExecutionResult;

  /** Next T2T requests (if chain continues) */
  nextSteps?: T2TRequest[];

  /** Chain depth consumed */
  chainDepthConsumed: number;

  /** Full audit record */
  auditRecord: {
    tenantId: string;
    sourceProvider: string;
    targetCapability: string;
    triggerEntityId: string;
    timestamp: number;
    correlationId: string;
  };
}

/** Max chain depth to prevent infinite T2T loops */
export const T2T_MAX_CHAIN_DEPTH = 3;

/** T2T chain registry — tracks in-flight chains to detect cycles */
export interface T2TChainRegistry {
  /** Start a new chain or extend an existing one */
  registerStep(
    correlationId: string,
    step: { from: string; to: string; timestamp: number }
  ): Promise<boolean>; // returns false if cycle detected

  /** Close a chain */
  closeChain(correlationId: string): Promise<void>;
}
```

### 9.5 T2T Governance Rules

1. **Chain depth limit:** Max 3 hops. A → B → C. No further.
2. **Cycle detection:** `salesforce → slack → salesforce` is blocked by T2TChainRegistry.
3. **Capability whitelist:** Only capabilities in `t2t_allowed_capabilities` config can be T2T targets.
4. **Approval required:** Every T2T hop re-evaluates confidence. Auto-approve only if ≥0.85.
5. **Audit completeness:** Every hop logs to `spine_audit_log` with `via: t2t`.
6. **Tenant isolation:** T2T cannot cross tenant boundaries. Ever.

---

## 10. Provider Health Monitoring

### 10.1 Health Check Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                PROVIDER HEALTH MONITORING                           │
│                                                                     │
│   HEALTH PROBE SCHEDULER  (inside act service)                      │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │  Cron: Every 60 seconds per active provider/tenant pair     │   │
│   │                                                             │   │
│   │  For each (provider, tenantId) with active connection:      │   │
│   │    1. Call adapter.healthCheck(credentials)                │   │
│   │    2. Record latency, status code, error (if any)          │   │
│   │    3. Update KV: health:{provider}:{tenantId}              │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│                              ▼                                      │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │  HEALTH STATE MACHINE  (per provider/tenant)                │   │
│   │                                                             │   │
│   │  State: CLOSED  ──► healthy, traffic allowed                │   │
│   │         OPEN    ──► unhealthy, all calls rejected fast      │   │
│   │         HALF_OPEN ──► probing with limited traffic          │   │
│   │                                                             │   │
│   │  Transitions:                                               │   │
│   │    CLOSED → OPEN:     consecutiveFailures >= threshold      │   │
│   │    OPEN → HALF_OPEN:  recoveryTimeoutMs elapsed             │   │
│   │    HALF_OPEN → CLOSED: halfOpenMaxCalls consecutive success │   │
│   │    HALF_OPEN → OPEN:   any failure during probe             │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│                              ▼                                      │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │  HEALTH DASHBOARD DATA  (exposed via intelligence service)  │   │
│   │                                                             │   │
│   │  GET /api/v1/health/providers                               │   │
│   │  Returns per-tenant provider health:                        │   │
│   │    [                                                        │   │
│   │      { provider: "salesforce", state: "CLOSED",             │   │
│   │        latencyP50: 234, latencyP99: 1200,                   │   │
│   │        errorRate: 0.01, lastCheckAt: 1234567890 },          │   │
│   │      { provider: "slack", state: "OPEN",                    │   │
│   │        nextRetryAt: 1234570890 }                            │   │
│   │    ]                                                        │   │
│   └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### 10.2 Health Check Implementation

```typescript
// services/act/src/circuit-breaker/monitor.ts

import { ProviderHealthStatus, Credentials } from "@integratewise/connectors";
import { outboundAdapterRegistry } from "@integratewise/connectors/registry";

const HEALTH_CHECK_INTERVAL_MS = 60000;

export async function runHealthChecks(): Promise<void> {
  // Load all active provider/tenant pairs from D1
  const connections = await db
    .selectFrom("connector_connections")
    .select(["provider", "tenant_id"])
    .where("status", "=", "active")
    .execute();

  for (const conn of connections) {
    await checkProviderHealth(conn.provider, conn.tenant_id);
  }
}

async function checkProviderHealth(
  provider: string,
  tenantId: string
): Promise<ProviderHealthStatus> {
  const start = Date.now();

  try {
    // Fetch credentials via credential wall
    const credentials = await getCredentials(provider, tenantId);
    if (!credentials) {
      return buildHealthStatus(provider, tenantId, "OPEN", 0, 1);
    }

    // Run adapter-specific health check
    const adapterConfig = outboundAdapterRegistry[provider];
    const AdapterClass = adapterConfig?.adapter;
    if (!AdapterClass) {
      return buildHealthStatus(provider, tenantId, "OPEN", 0, 1);
    }

    const adapter = new AdapterClass();
    const health = await adapter.healthCheck(credentials);

    const latencyMs = Date.now() - start;

    // Update rolling metrics in KV
    await updateHealthMetrics(provider, tenantId, {
      latencyMs,
      success: health.state !== "OPEN",
    });

    return health;
  } catch (err) {
    const latencyMs = Date.now() - start;
    await updateHealthMetrics(provider, tenantId, {
      latencyMs,
      success: false,
      error: (err as Error).message,
    });

    return buildHealthStatus(provider, tenantId, "OPEN", latencyMs, 1);
  }
}

function buildHealthStatus(
  provider: string,
  tenantId: string,
  state: CircuitBreakerState,
  latencyMs: number,
  consecutiveFailures: number
): ProviderHealthStatus {
  return {
    provider,
    tenantId,
    state,
    lastCheckAt: Date.now(),
    consecutiveFailures,
    latencyP50: latencyMs,
    latencyP99: latencyMs,
    errorRate: state === "OPEN" ? 1.0 : 0.0,
  };
}
```

---

## 11. Circuit Breaker

### 11.1 State Machine

```
                    ┌─────────────────────────────────────────┐
                    │                                         │
                    │   ┌─────────┐      success              │
           ┌────────┼──►│  CLOSED │◄────────────────────┐     │
           │        │   └────┬────┘                     │     │
           │        │        │ failure                   │     │
           │        │        ▼                           │     │
           │        │   ┌─────────┐  failure >= threshold│     │
  recovery │        │   │  COUNT  │──────────────────────┼─────┼──►┌──────┐
  timeout  │        │   │ FAILURES│                      │     │   │ OPEN │
  elapsed  │        │   └─────────┘                      │     │   └──┬───┘
           │        │                                    │     │      │
           │        └────────────────────────────────────┘     │      │
           │                                                   │      │
           │         ┌─────────────────────────────────────────┘      │
           │         │                                                │
           │    ┌────┴────┐    halfOpenMaxCalls                      │
           └───┄│HALF_OPEN│◄─────────────────────────────────────────┘
                └────┬────┘
                     │
        ┌────────────┼────────────┐
        │ success    │    failure │
        ▼            │            ▼
    ┌───────┐        │        ┌──────┐
    │ CLOSED│        │        │ OPEN │
    └───────┘        │        └──────┘
                     │
```

### 11.2 KV-Backed State Storage

```typescript
// services/act/src/circuit-breaker/store.ts

interface CircuitBreakerStateData {
  state: CircuitBreakerState;
  failures: number;
  lastFailureAt: number;
  lastSuccessAt: number;
  openedAt?: number;
  halfOpenCalls: number;
  halfOpenSuccesses: number;
}

const CB_KEY_PREFIX = "cb:";

export async function getBreakerState(
  provider: string,
  tenantId: string
): Promise<CircuitBreakerStateData> {
  const key = `${CB_KEY_PREFIX}${provider}:${tenantId}`;
  const stored = await kv.get<CircuitBreakerStateData>(key);

  if (!stored) {
    return {
      state: "CLOSED",
      failures: 0,
      lastFailureAt: 0,
      lastSuccessAt: 0,
      halfOpenCalls: 0,
      halfOpenSuccesses: 0,
    };
  }

  return stored;
}

export async function setBreakerState(
  provider: string,
  tenantId: string,
  state: CircuitBreakerStateData
): Promise<void> {
  const key = `${CB_KEY_PREFIX}${provider}:${tenantId}`;
  await kv.put(key, JSON.stringify(state), {
    // State persists for 24 hours to survive deploys
    expirationTtl: 86400,
  });
}
```

### 11.3 breaker.ts — Core Logic

```typescript
// services/act/src/circuit-breaker/breaker.ts

import { getBreakerState, setBreakerState } from "./store";
import { outboundAdapterRegistry } from "@integratewise/connectors/registry";

export async function checkCircuitBreaker(
  provider: string,
  tenantId: string
): Promise<CircuitBreakerState> {
  const config = outboundAdapterRegistry[provider]?.circuitBreaker;
  if (!config) return "CLOSED"; // No config = no breaker

  const state = await getBreakerState(provider, tenantId);

  switch (state.state) {
    case "CLOSED":
      return "CLOSED";

    case "OPEN":
      // Check if recovery timeout has elapsed
      if (state.openedAt && Date.now() - state.openedAt >= config.recoveryTimeoutMs) {
        // Transition to HALF_OPEN
        await setBreakerState(provider, tenantId, {
          ...state,
          state: "HALF_OPEN",
          halfOpenCalls: 0,
          halfOpenSuccesses: 0,
        });
        return "HALF_OPEN";
      }
      return "OPEN";

    case "HALF_OPEN":
      // Allow limited calls through
      if (state.halfOpenCalls >= config.halfOpenMaxCalls) {
        return "OPEN"; // Too many probes, back to OPEN
      }
      return "HALF_OPEN";
  }
}

export async function recordResult(
  provider: string,
  tenantId: string,
  success: boolean
): Promise<void> {
  const config = outboundAdapterRegistry[provider]?.circuitBreaker;
  if (!config) return;

  const state = await getBreakerState(provider, tenantId);

  if (success) {
    // Success path
    if (state.state === "HALF_OPEN") {
      const newSuccesses = state.halfOpenSuccesses + 1;
      if (newSuccesses >= config.halfOpenMaxCalls) {
        // Fully recovered
        await setBreakerState(provider, tenantId, {
          state: "CLOSED",
          failures: 0,
          lastFailureAt: 0,
          lastSuccessAt: Date.now(),
          halfOpenCalls: 0,
          halfOpenSuccesses: 0,
        });
      } else {
        await setBreakerState(provider, tenantId, {
          ...state,
          halfOpenSuccesses: newSuccesses,
          halfOpenCalls: state.halfOpenCalls + 1,
        });
      }
    } else {
      await setBreakerState(provider, tenantId, {
        ...state,
        failures: 0,
        lastSuccessAt: Date.now(),
      });
    }
  } else {
    // Failure path
    const newFailures = state.failures + 1;

    if (state.state === "HALF_OPEN") {
      // Any failure in HALF_OPEN → immediately OPEN
      await setBreakerState(provider, tenantId, {
        ...state,
        state: "OPEN",
        failures: newFailures,
        lastFailureAt: Date.now(),
        openedAt: Date.now(),
      });
    } else if (newFailures >= config.failureThreshold) {
      // Threshold crossed → OPEN
      await setBreakerState(provider, tenantId, {
        ...state,
        state: "OPEN",
        failures: newFailures,
        lastFailureAt: Date.now(),
        openedAt: Date.now(),
      });
    } else {
      await setBreakerState(provider, tenantId, {
        ...state,
        failures: newFailures,
        lastFailureAt: Date.now(),
      });
    }
  }
}
```

---

## 12. Security Boundaries

### 12.1 Trust Zones

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         TRUST ZONES                                     │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ ZONE 0: PUBLIC INTERNET                                         │   │
│  │  Untrusted. All traffic TLS-terminated at Cloudflare edge.      │   │
│  │  WAF rules apply. Rate limiting enforced.                       │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                              │                                          │
│                              ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ ZONE 1: INGRESS (gateway, webhook-ingress, mcp-connector)       │   │
│  │  JWT validation. Tenant extraction from JWT claim ONLY.         │   │
│  │  No provider credentials in this zone.                          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                              │                                          │
│                              ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ ZONE 2: CONTINUITY KERNEL (Spine, Memory, Twin, Govern)         │   │
│  │  Tenant-isolated via WHERE tenant_id = ? on every query.        │   │
│  │  No provider credentials. No external API calls.                │   │
│  │  This is THE MOAT.                                              │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                              │                                          │
│                              ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ ZONE 3: PROVIDER FABRIC (act, connector, connector-sync)        │   │
│  │  CREDENTIAL WALL: Only zone that reads CF Secrets / Nango.     │   │
│  │  Adapter modules execute external calls.                        │   │
│  │  Circuit breaker blocks failing providers.                      │   │
│  │  Every call audited. Every call tenant-scoped.                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                              │                                          │
│                              ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ ZONE 4: EXTERNAL PROVIDERS (Salesforce, Slack, GitHub, ...)     │   │
│  │  Untrusted. Ephemeral connections. No persistent state.         │   │
│  │  Provider signatures verified on inbound.                       │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 12.2 Security Rules (P0)

| #   | Rule                              | Enforcement                                                                          | Violation         |
| --- | --------------------------------- | ------------------------------------------------------------------------------------ | ----------------- |
| 1   | No credential outside Zone 3      | CF Secrets bindings only on `act`, `connector`, `connector-sync`                     | Security incident |
| 2   | Tenant isolation at adapter layer | Every adapter call includes `tenantId`; adapter resolves credentials per-tenant only | 403               |
| 3   | No credential logging             | Tokens, API keys, refresh tokens NEVER logged or returned                            | Security incident |
| 4   | Read-only default for MCP         | Inbound MCP pool default `scope: read`. Write requires `scope: write` + governance   | 403               |
| 5   | Tool whitelist per tenant         | MCP outbound only calls tools in `allowedTools` config                               | 403               |
| 6   | Circuit breaker blocks abuse      | Failed auth repeated 5x → circuit OPEN → no more credential exposure                 | Automatic         |
| 7   | Idempotency prevents replay       | Every outbound call carries `idempotencyKey`                                         | Duplicate ignored |
| 8   | Webhook signature verification    | Every inbound webhook verified against provider secret                               | 401 if invalid    |
| 9   | Approval token for writes         | Every write capability requires governance `approvalToken`                           | 403               |
| 10  | Audit completeness                | Every provider call logged to `spine_audit_log` + `outbound_mcp_calls`               | Halt operation    |

---

## 13. Integration Points with Adjacent Domains

### 13.1 Northbound: Continuity Layer (Spine, Memory, Twin)

| Direction         | Integration                     | Contract                                                 |
| ----------------- | ------------------------------- | -------------------------------------------------------- |
| **Inbound**       | `connector-sync` → `normalizer` | `NORMALIZER_QUEUE` — raw records + tenantId + provider   |
| **Inbound**       | `normalizer` → `pipeline`       | `PIPELINE_QUEUE` — canonical entities + relationships    |
| **Outbound**      | `govern` → `act`                | `ACT_QUEUE` — approved action + payload + Entity360      |
| **Bidirectional** | `act` ↔ `spine-v2`              | Service binding — Entity360 assembly reads Spine         |
| **Bidirectional** | `act` ↔ `continuity`            | Service binding — memory retrieval for context injection |

### 13.2 East/West: Governance Layer

| Direction    | Integration               | Contract                                              |
| ------------ | ------------------------- | ----------------------------------------------------- |
| **Inbound**  | `govern` → `act`          | `ACT_QUEUE` messages include `approvalToken`          |
| **Outbound** | `act` → `govern`          | On failure, `governance_audit_log` updated with error |
| **Inbound**  | `govern` policy → adapter | `allowedTools` per tenant restricts MCP outbound      |

### 13.3 Southbound: External Providers

| Provider   | Adapter              | Protocol        | Credential Type         |
| ---------- | -------------------- | --------------- | ----------------------- |
| Salesforce | `NangoAdapter`       | REST / Bulk API | Nango OAuth             |
| HubSpot    | `NangoAdapter`       | REST API v3     | Nango OAuth             |
| Slack      | `NangoAdapter`       | Web API         | Nango OAuth             |
| GitHub     | `MCPOutboundAdapter` | MCP (SSE)       | MCP token               |
| Linear     | `MCPOutboundAdapter` | MCP (SSE)       | MCP token               |
| Figma      | `MCPOutboundAdapter` | MCP (SSE)       | MCP token               |
| Stripe     | `NativeAdapter`      | REST API        | API key (CF Secrets)    |
| AWS        | `NativeAdapter`      | SDK / REST      | Access key (CF Secrets) |
| Notion     | `NangoAdapter`       | REST API        | Nango OAuth             |

### 13.4 Registry Integration

The Provider Fabric reads from and writes to the **Registry Layer** (Layer 13):

```typescript
// Provider registration at tenant onboarding
interface ProviderRegistration {
  provider: string;
  tenantId: string;
  credentialType: "nango" | "mcp" | "native";
  status: "pending" | "active" | "error" | "disconnected";
  connectedAt: number;
  lastSyncAt?: number;
  capabilities: string[]; // e.g., ["salesforce.opportunity.read", ...]
  allowedTools?: string[]; // For MCP providers
  syncConfig?: {
    mode: "poll" | "webhook" | "hybrid";
    intervalMinutes: number;
    supportsIncremental: boolean;
  };
}

// Registered in D1 `provider_registry` table
// Read by Discovery to build per-tenant capability catalog
// Read by adapter factory to select correct adapter
```

---

## 14. Error Handling, Retries, and Dead-Letter Behavior

### 14.1 Retry Matrix

| Error Code             | Retryable  | Retry Strategy        | Max Retries | Backoff                     |
| ---------------------- | ---------- | --------------------- | ----------- | --------------------------- |
| `PROVIDER_UNAVAILABLE` | Yes        | Exponential           | 3           | 1s → 2s → 4s                |
| `RATE_LIMITED`         | Yes        | Fixed delay           | 5           | `Retry-After` header or 60s |
| `TIMEOUT`              | Yes        | Exponential           | 3           | 2s → 4s → 8s                |
| `AUTH_EXPIRED`         | Yes (once) | Refresh token → retry | 1           | Immediate                   |
| `CIRCUIT_OPEN`         | No         | Reject immediately    | 0           | N/A                         |
| `INVALID_PAYLOAD`      | No         | Log + discard         | 0           | N/A                         |
| `PERMISSION_DENIED`    | No         | Log + alert admin     | 0           | N/A                         |
| `NOT_FOUND`            | No         | Log + discard         | 0           | N/A                         |

### 14.2 Dead-Letter Queue (DLQ)

```
ACT_QUEUE_DLQ
├── Message format: original message + error history + retry count
├── Trigger: max retries exceeded OR non-retryable error
├── Processing: telemetry service polls DLQ every 5 minutes
├── Actions:
│   ├── Alert admin via `admin` service (P1)
│   ├── Write to `spine_audit_log` as `execution_error`
│   ├── If `AUTH_EXPIRED` → trigger credential refresh alert
│   └── If `PERMISSION_DENIED` → disable connector, notify tenant owner
└── Retention: 7 days in DLQ, then archived to R2
```

### 14.3 DLQ Handler

```typescript
// services/act/src/dlq.ts

export async function processDLQ(
  message: ActQueueMessage & { errorHistory: AdapterError[] }
): Promise<void> {
  const lastError = message.errorHistory[message.errorHistory.length - 1];

  // Always audit
  await enqueueToPipelineQueue({
    type: "execution_error_dlq",
    tenantId: message.tenantId,
    capability: message.capability,
    error: lastError,
    retryCount: message.errorHistory.length,
    timestamp: Date.now(),
  });

  switch (lastError.code) {
    case "AUTH_EXPIRED":
      // Alert: credential needs refresh
      await alertAdmin({
        type: "credential_expired",
        tenantId: message.tenantId,
        provider: message.capability.split(".")[0],
        severity: "high",
      });
      break;

    case "PERMISSION_DENIED":
      // Auto-disable connector
      await disableConnector(message.tenantId, message.capability.split(".")[0]);
      await notifyTenantOwner(message.tenantId, {
        type: "connector_disabled",
        reason: "permission_denied",
        provider: message.capability.split(".")[0],
      });
      break;

    case "RATE_LIMITED":
      // Auto-backoff: increase circuit breaker recovery time
      await increaseBreakerRecoveryTimeout(message.capability.split(".")[0], message.tenantId);
      break;

    default:
      // Log and archive
      await archiveToR2(message);
  }
}
```

---

## 15. Physical Deployment Map

### 15.1 Cloudflare Workers Topology

| Service           | Worker Name          | Bindings                           | Queues                                     | D1           | KV                                      |
| ----------------- | -------------------- | ---------------------------------- | ------------------------------------------ | ------------ | --------------------------------------- |
| `act`             | `iw-act`             | `SPINE_V2`, `CONTINUITY`, `GOVERN` | `ACT_QUEUE`                                | —            | `cred_cache`, `idempotency`, `cb_state` |
| `connector`       | `iw-connector`       | `TENANTS`                          | —                                          | `connectors` | `oauth_state`                           |
| `connector-sync`  | `iw-connector-sync`  | `SPINE_V2`, `NORMALIZER`           | `CONNECTOR_SYNC_QUEUE`, `NORMALIZER_QUEUE` | `sync_jobs`  | `sync_state`                            |
| `webhook-ingress` | `iw-webhook-ingress` | `CONNECTOR_SYNC`                   | `CONNECTOR_SYNC_QUEUE`                     | —            | —                                       |

### 15.2 Secret Bindings

```toml
# services/act/wrangler.toml
[name]
name = "iw-act"

[[env.production.vars]]
NANGO_SECRET_KEY = "secret_key_from_cf_secrets"

[[env.production.secrets]]
# Provider credentials pattern: PROVIDER_{PROVIDER}_{TENANT}_API_KEY
# Managed by admin CLI, not in wrangler.toml

[[env.production.kv_namespaces]]
binding = "CREDENTIAL_CACHE"
id = "cred_cache_kv_namespace_id"

[[env.production.kv_namespaces]]
binding = "IDEMPOTENCY_STORE"
id = "idempotency_kv_namespace_id"

[[env.production.kv_namespaces]]
binding = "CIRCUIT_BREAKER"
id = "circuit_breaker_kv_namespace_id"

[[queues.producers]]
binding = "ACT_QUEUE"
queue = "act-queue"

[[queues.producers]]
binding = "PIPELINE_QUEUE"
queue = "pipeline-queue"
```

---

## 16. Operational Runbooks

### 16.1 Adding a New Provider

```
1. Add adapter implementation:
   services/act/src/adapters/{provider}.ts
   services/connector-sync/src/adapters/sync/{provider}-sync.ts

2. Register in registry:
   packages/connectors/src/registry.ts

3. Add credential schema:
   packages/connectors/src/types.ts (Credentials interface)

4. Configure circuit breaker:
   outboundAdapterRegistry[provider] = { ... }

5. Add health check endpoint in adapter:
   adapter.healthCheck(credentials)

6. Deploy and test:
   pnpm --filter act deploy
   pnpm test:provider {provider}

7. Update Discovery:
   agent-registry service picks up new capabilities automatically
```

### 16.2 Rotating Credentials

```
1. Admin CLI:
   iw-admin credentials rotate --provider salesforce --tenant T_abc123

2. CLI actions:
   a. Generate new connection in Nango (or new API key)
   b. Write to CF Secrets: PROVIDER_SALESFORCE_T_abc123_API_KEY
   c. Invalidate KV cache: cred_cache:salesforce:T_abc123
   d. Test: adapter.healthCheck(newCreds)
   e. If test passes: update connector_connections.status = 'active'
   f. If test fails: rollback, alert admin

3. No downtime: KV cache miss triggers credential wall re-fetch
```

### 16.3 Circuit Breaker Manual Override

```
# Force circuit breaker state (emergency only)
# Requires admin JWT with scope: admin:provider

POST /api/v1/admin/circuit-breaker
{
  "provider": "salesforce",
  "tenantId": "T_abc123",
  "action": "force_close",  // or "force_open"
  "reason": "Emergency maintenance window"
}

# Audit: logged to governance_audit_log with admin identity
```

### 16.4 Provider Health Dashboard Query

```sql
-- Run in D1 console or via intelligence service
SELECT
  provider,
  tenant_id,
  state,
  COUNT(*) as tenant_count,
  AVG(latency_p50) as avg_latency,
  SUM(CASE WHEN state = 'OPEN' THEN 1 ELSE 0 END) as open_count
FROM provider_health_status
WHERE last_check_at > datetime('now', '-1 hour')
GROUP BY provider, state
ORDER BY open_count DESC;
```

---

## Appendix A: Queue Message Schemas

### A.1 ACT_QUEUE

```typescript
interface ActQueueMessage {
  type: "execute_capability" | "execute_batch" | "t2t_request";
  capability: string;
  tenantId: string;
  payload: Record<string, unknown>;
  correlationId: string;
  idempotencyKey: string;
  approvalToken?: string;
  entityId?: string; // For Entity360 injection
  t2tContext?: T2TRequest; // For tool-to-tool chains
}
```

### A.2 PIPELINE_QUEUE (from act)

```typescript
interface PipelineQueueMessage {
  type: "execution_result" | "execution_error" | "execution_error_dlq";
  tenantId: string;
  capability: string;
  result?: OutboundExecutionResult;
  error?: AdapterError;
  affectedEntities?: AffectedEntity[];
  timestamp: number;
  correlationId: string;
}
```

### A.3 CONNECTOR_SYNC_QUEUE

```typescript
interface ConnectorSyncQueueMessage {
  type: "scheduled_sync" | "webhook" | "creamy_sync";
  tenantId: string;
  connectorId: string;
  provider: string;
  trigger: "cron" | "webhook" | "manual";
  payload?: Record<string, unknown>; // For webhooks
  correlationId: string;
}
```

### A.4 NORMALIZER_QUEUE

```typescript
interface NormalizerQueueMessage {
  tenantId: string;
  provider: string;
  records: RawRecord[];
  syncJobId: string;
  timestamp: number;
  correlationId: string;
}
```

---

## Appendix B: Change Log from v1.0.1

| Change                | v1.0.1                              | v2.0.0 (this doc)                                                     |
| --------------------- | ----------------------------------- | --------------------------------------------------------------------- |
| Integration Manager   | Separate service (incorrectly)      | Pattern inside `act` + `connector-sync`                               |
| Adapter location      | `integration-manager/src/adapters/` | `services/act/src/adapters/`, `services/connector-sync/src/adapters/` |
| Entity360             | Mentioned but not specified         | Full assembly pipeline, budget enforcement, MCP injection             |
| T2T Protocol          | Not defined                         | Formal protocol with chain limits, cycle detection, governance        |
| Circuit breaker       | Mentioned                           | Full state machine, KV storage, per-provider/tenant configuration     |
| Credential wall       | `getCredentials()` sketch           | Full tiered storage (Secrets → Nango → KV), audit logging             |
| Health monitoring     | Not defined                         | Per-provider/tenant health checks, metrics, dashboard API             |
| DLQ                   | Not defined                         | Retry matrix, DLQ handler, auto-alerts                                |
| Security boundaries   | P0 list                             | Full trust zone model with 4 zones                                    |
| TypeScript interfaces | Basic `OutboundAdapter`             | Complete type system: 15+ interfaces, registry maps, error taxonomy   |

---

**END OF SPECIFICATION**

_IntegrateWise Continuity Bridge v2.0 — Provider Fabric and Adapter Pattern. This document is a Stage 1/2 deep-dive feeding into the canonical v2.0 architecture document. All interfaces, flows, and schemas are production-intended and must be validated against the live repo before implementation._

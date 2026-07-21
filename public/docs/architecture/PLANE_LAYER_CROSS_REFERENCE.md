# Platform Plane ↔ Layer Stack Cross-Reference

> **Status:** Canonical cross-reference  
> **Date:** July 12, 2026  
> **Authority:** Nirmal (Founder)  
> **Canonical Reference:** [CANONICAL_PLATFORM_ARCHITECTURE.md](./CANONICAL_PLATFORM_ARCHITECTURE.md)  
> **Purpose:** Maps every Platform Plane to its layer(s) in the 6-Layer Stack, primary service bindings, and specification sections. This is the structural bridge between the product architecture (19 planes) and the technical architecture (6 layers).

---

## The Two Models

### 6-Layer Stack (Technical Architecture — Documents 1 & 2)

| Layer | Name            | Responsibility                                                                  |
| ----- | --------------- | ------------------------------------------------------------------------------- |
| L1    | Identity        | JWT, tenant isolation, RBAC, session management                                 |
| L2    | Ingress         | Gateway routing, MCP protocol, SSE connections, webhook intake                  |
| L3    | Capability      | Capability registry, routing, governance pre-check, context assembly, execution |
| L4    | Continuity      | Spine (D1), memory, knowledge, context hydration                                |
| L5    | Governance      | Proposal lifecycle, HITL queue, approval, audit                                 |
| L6    | Provider Fabric | External API adapters, sync, writeback                                          |

### 19 Platform Planes (Product Architecture — Document 3)

| Plane                        | Canonical Responsibility                                                  |
| ---------------------------- | ------------------------------------------------------------------------- |
| Configuration Manager        | Defines how the tenant operates                                           |
| Integration Manager          | Connects and discovers the tenant ecosystem                               |
| Activation Bridge            | Compiles configuration + connections + user context into active workspace |
| Pipeline                     | Converts provider activity into canonical operational state               |
| Adaptive Spine               | Owns canonical operational truth                                          |
| Spine Cache                  | Accelerates hydration and derived views                                   |
| Knowledge                    | Owns semantic retrieval representations                                   |
| Blobs                        | Owns files, raw artifacts, and evidence                                   |
| User Workbench               | Department hub composing cross-tool fields, data, memory, capabilities    |
| Twin                         | Reasons, retrieves, plans, delegates, proposes                            |
| Twin Memory                  | Owns durable AI / user continuity                                         |
| Session Logs                 | Own interaction and runtime session history                               |
| Twin Audit Logs              | Own AI accountability and lineage                                         |
| Capability Fabric            | Resolves how an intent can be performed                                   |
| Governance Engine            | Resolves whether and under whose authority it may be performed            |
| Hermes                       | Orchestrates execution                                                    |
| Sync Engine                  | Controls system convergence                                               |
| Continuity Pipeline          | Converts outcomes back into persistent operational memory                 |
| Cross-Cutting Infrastructure | Identity, config, queues, observability, deployment, billing              |

---

## Cross-Reference Table

| Platform Plane                   | Layer(s)                    | Primary Services                           | Spec Section                               | Notes                                                                                                                                   |
| -------------------------------- | --------------------------- | ------------------------------------------ | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Configuration Manager**        | L1 (partial), Cross-cutting | Tenant DO, KV config stores                | Not yet specified                          | Spans identity config, composition rules, sync policy, governance policy. No technical spec exists.                                     |
| **Integration Manager**          | L2, L6                      | mcp-connector, act service adapters, Nango | Doc 1 §6 (MCP), Doc 1 §8 (Provider Fabric) | Four paths: MCP (L2), AI Connector (L2+L3), API Connector (L6), API Wrapper (L3). Only MCP has detailed spec.                           |
| **Activation Bridge**            | L3 (partial), L4            | Context assembly, workspace hydration      | Not yet specified                          | Compiles config + connections + user context → active workspace. Maps to Doc 1's `AssembledContext` but broader.                        |
| **Pipeline**                     | L4, L6                      | pipeline service (D1 writer), normalizer   | Doc 1 §4 (Normalizer), Doc 3 Data Pipeline | Three modes: Creamy Load (full), Delta Load (incremental), Streaming/Event Load. Only normalizer has partial spec.                      |
| **Adaptive Spine**               | L4                          | D1 domain partitions, spine service        | Doc 1 §3 (Spine D1), Doc 3 Spine Model     | Canonical entity model, relationships, decisions, evidence, work state. Entity360 mismatch: flat (Doc 1) vs. rich (Doc 3).              |
| **Spine Cache**                  | L4                          | D1 cache, KV hot cache                     | Doc 1 §3.5 (Spine Cache)                   | Entity 360 hydration views, context bundles, derived state.                                                                             |
| **Knowledge**                    | L4                          | Vectorize, AI Search                       | Doc 1 §4 (Memory/Knowledge)                | Semantic embeddings, retrieval, graph context.                                                                                          |
| **Blobs**                        | L4                          | R2 storage                                 | Not detailed in Doc 1                      | Documents, attachments, evidence, raw payloads.                                                                                         |
| **User Workbench**               | Consumer of all layers      | apps/live (React/Next.js)                  | Doc 3 User Workbench, Doc 3 OODA Grammar   | Role-aware composition surface. No backend — consumes projections from all layers.                                                      |
| **Twin**                         | L3 (partial), L4            | iw-agent-runtime DO, think service         | Doc 1 §7 (Twin DO), Doc 3 Twin             | 7 capabilities narratively described, 3 technically specified. Gap: planning, tool selection, agent delegation, capability preparation. |
| **Twin Memory**                  | L4                          | D1/KV memory stores                        | Doc 1 §7.2 (Memory Graph)                  | Durable AI continuity, user preferences, learned context.                                                                               |
| **Session Logs**                 | L4                          | D1 session state                           | Doc 1 §7.3 (Session State)                 | Conversations, tool calls, context lifecycle.                                                                                           |
| **Twin Audit Logs**              | L5                          | D1 audit partition                         | Doc 1 §5 (Audit)                           | Model/agent identity, intent, policy decision, approval lineage.                                                                        |
| **Capability Fabric**            | L3                          | CapabilityRouter DO, capability registry   | Doc 1 §6 (Capability Registry)             | Resolves how work gets done. 5 runtime types: agent, pipeline, workflow, mcp, direct. Needs 4 connection paths added.                   |
| **Governance Engine**            | L5                          | govern service, HITL queue                 | Doc 1 §5 (Governance)                      | Confidence-based (Doc 1) vs. authority-based (Doc 3) — needs reconciliation.                                                            |
| **Hermes**                       | L3                          | CapabilityRouter DO                        | Doc 1 §6 (CapabilityRouter)                | Execution orchestrator. Doc 1: routing only. Doc 3: broader (coordinate agents, retry, reconcile).                                      |
| **Sync Engine**                  | L6                          | pipeline queue, writeback adapters         | Not yet specified                          | 6 convergence modes. Only PIPELINE_QUEUE exists. No spec for deferred, batch, scheduled, reconciliation.                                |
| **Continuity Pipeline**          | L4, L5                      | pipeline service, audit                    | Doc 3 Continuity Pipeline                  | Intent → Action → Evidence → Outcome → State → Memory → Promote to Spine. No technical spec.                                            |
| **Cross-Cutting Infrastructure** | L1, Cross-cutting           | Gateway, KV, queues, metrics               | Doc 1 §2 (Service Topology)                | Identity, config, ephemeral runtime, queues, observability, deployment, billing, admin.                                                 |

---

## Gap Analysis Summary

### Planes with Full Technical Specification

| Plane             | Status                             |
| ----------------- | ---------------------------------- |
| Adaptive Spine    | Partial (Entity360 mismatch)       |
| Spine Cache       | Partial                            |
| Capability Fabric | Partial (needs 4 connection paths) |
| Hermes            | Partial (scope divergence)         |
| Twin              | Partial (3 of 7 capabilities)      |
| Twin Memory       | Partial                            |
| Session Logs      | Partial                            |
| Twin Audit Logs   | Partial                            |

### Planes with No Technical Specification

| Plane                              | Complexity     | Priority |
| ---------------------------------- | -------------- | -------- |
| Configuration Manager              | High           | P2       |
| Integration Manager (3 of 4 paths) | Very High      | P1       |
| Activation Bridge                  | High           | P2       |
| Pipeline (Creamy/Delta/Streaming)  | Very High      | P1       |
| Sync Engine                        | Very High      | P1       |
| Continuity Pipeline                | High           | P1       |
| Knowledge                          | Medium         | P2       |
| Blobs                              | Low            | P3       |
| User Workbench                     | N/A (frontend) | P3       |

---

## Governance Model Reconciliation

The two governance models must be unified. Proposed reconciliation:

### Layered Governance Model

```
                    GOVERNANCE ENGINE
                          │
          ┌───────────────┼───────────────┐
          │               │               │
     AUTHORITY        CONFIDENCE       EVIDENCE
     GOVERNANCE       GOVERNANCE       GOVERNANCE
          │               │               │
   Who can do what   How sure is the   What proof exists
   under what policy  system about      for this action?
          │           this proposal?        │
          │               │               │
          └───────────────┼───────────────┘
                          │
                    UNIFIED OUTCOME
                          │
              ┌───────────┼───────────┐
              │           │           │
           ALLOW       DENY      REQUIRE
                                  APPROVAL
```

**Resolution Rules:**

1. Authority gates capability access (RBAC × policy × scope)
2. Confidence gates auto-approval (≥0.85 auto, 0.70–0.85 HITL, <0.70 discard)
3. Evidence gates audit trail (every action logged with intent + evidence + outcome)
4. When authority allows but confidence is low → REQUIRE APPROVAL
5. When authority denies → DENY (regardless of confidence)
6. When confidence is high but authority is missing → REQUIRE APPROVAL
7. When both authority and confidence are satisfied → ALLOW

This preserves both models without conflict.

---

## Entity360 Reconciliation

The Entity360 data model must support both the flat struct (for simple lookups) and the rich cross-tool composition (for Workbench surfaces).

### Proposed Entity360 V2

```typescript
interface Entity360 {
  // Core identity (always present)
  id: string;
  type: CanonicalEntityType;
  tenantId: string;

  // Flat properties (fast lookup)
  properties: Record<string, unknown>;

  // Rich composition (lazy-loaded per Workbench)
  composition?: {
    crm?: CrmEntityView;
    support?: SupportEntityView;
    billing?: BillingEntityView;
    product?: ProductEntityView;
    communication?: CommunicationEntityView;
    projects?: ProjectEntityView;
    memory?: MemoryEntityView;
    decisions?: DecisionEntityView;
    capabilities?: CapabilityView[];
  };

  // Metadata
  traits: Trait[];
  timeline: TimelineEvent[];
  projections: ProjectedView[];
  provenance: ProvenanceRecord[];

  // Governance
  authority: AuthorityScope;
  syncPolicy: SyncPolicy;
}
```

The `composition` field is lazy-loaded based on the Workbench's role + department + active context. This preserves the flat struct for internal operations while supporting the rich cross-tool view for the User Workbench.

---

## Next Steps

1. **P0:** This cross-reference table is now the structural bridge
2. **P0:** Reconcile governance models using the layered model above
3. **P0:** Reconcile Entity360 using V2 data model above
4. **P1:** Write technical spec for Data Pipeline (Creamy/Delta/Streaming)
5. **P1:** Write technical spec for Sync Engine
6. **P1:** Write technical spec for Integration Manager (4 paths)
7. **P2:** Write technical spec for Configuration Manager
8. **P2:** Write technical spec for Activation Bridge
9. **P2:** Expand Twin specification to cover all 7 capabilities

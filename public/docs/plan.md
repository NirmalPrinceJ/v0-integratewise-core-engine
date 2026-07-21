# IntegrateWise Architecture Completion Plan

## Objective

Produce the canonical, complete architecture specification for IntegrateWise Continuity Bridge v2.0 that unifies all prior work into one document covering the 6-layer architecture, OODA runtime, HITL governance, Ecosystem Fabric, and Security Model.

## Background from Prior Work

- **Architecture Spec v1.0.1-FINAL**: 26 services, 4 layers, adapter pattern, 0-16 stack, MCP pools, governance gates
- **Reality Audit**: 19/26 services exist, 7 missing, Supabase entanglement, marketing bloat
- **FINAL_E2E_SYSTEM.md**: Canonical end-to-end specification with all §14 conflicts resolved
- **HITL Orchestrator**: 5-step human-in-the-loop with OODA annotations
- **6-Layer Architecture**: Identity → Ingress → Capability → Continuity → Governance → Provider Fabric
- **OODA Model**: Observe (pipelines) → Orient (agents) → Decide (hybrid) → Act (pipelines + agents)
- **Moat**: Continuity Layer (memory, entity graph, workflow intelligence)
- **Ecosystem Purpose**: Capability fabric, knowledge sharing, tool-to-tool communication, agent communication

## Stages

### Stage 1 — Parallel Deep-Dive Architecture (5 subagents)

Each subagent owns one architectural domain and produces a detailed specification section.

| Subagent                     | Domain                              | Deliverable                                                                                                                |
| ---------------------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Arch_L1_IdentityIngress      | Identity Layer + Ingress Layer      | Complete API contracts, auth flows, tenant resolution, transport protocols, routing, rate limiting, discovery              |
| Arch_L2_CapabilityOODA       | Capability Layer + OODA Runtime     | Capability registry, runtime routing, context assembly, ADK, agent runtime, execution routing, OODA phase mapping          |
| Arch_L3_ContinuityGovernance | Continuity Layer + Governance Layer | Spine architecture, memory lifecycle, entity graph, knowledge, normalizer, governance rules, approval gates, HITL          |
| Arch_L4_ProviderFabric       | Provider Fabric + Adapter Pattern   | Outbound/inbound adapters, Nango, MCP, Native, credential wall, tool-to-tool communication                                 |
| Arch_L5_EcosystemFabric      | Ecosystem Architecture + SDK        | Capability fabric model, knowledge sharing protocol, agent-to-agent communication, SDK variants, ecosystem app composition |

### Stage 2 — Cross-Cutting Concerns (3 subagents)

| Subagent        | Domain                            | Deliverable                                                                         |
| --------------- | --------------------------------- | ----------------------------------------------------------------------------------- |
| Arch_Security   | Security Model                    | Zero-trust boundaries, P0/P1 posture, tenant isolation, audit model                 |
| Arch_DataModel  | Data Model + Entity Relationships | Complete entity relationship diagram across all layers, spine schema, memory schema |
| Arch_Deployment | Deployment Architecture           | Service topology, Cloudflare Workers topology, D1 schema, CI/CD, local dev          |

### Stage 3 — Integration (1 subagent)

Merge all outputs into a single canonical document: `INTEGRATEWISE_ARCHITECTURE_v2.0.md`

## Key Design Decisions

1. **Twin is NOT a separate entity** — it is ambient context inside the Capability + Continuity layers
2. **Onboarding is a distinct flow** — separate from operational OODA, pipeline-heavy with agent guidance
3. **MCP is a transport** — sits in Ingress, not Capability
4. **Ecosystem = Capability Fabric** — not lightweight apps, but interoperating capabilities
5. **Agent/pipeline boundary** — agents handle uncertainty, pipelines handle certainty
6. **HITL is at the Decide phase** — irreducible human agency
7. **Moat = Continuity Layer** — time-accumulated memory, entity graph, workflow intelligence

## Output Format

Each subagent produces Markdown with:

- ASCII diagrams where helpful
- TypeScript interface definitions
- SQL schema where relevant
- Flow descriptions
- Security boundary annotations

## Final Deliverable

`INTEGRATEWISE_ARCHITECTURE_v2.0.md` — the single canonical architecture document that supersedes all prior documents.

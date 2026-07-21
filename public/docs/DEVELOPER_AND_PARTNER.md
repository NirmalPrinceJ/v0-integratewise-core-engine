# IntegrateWise Developer and Partner Documentation

**Source of truth:** `docs/spec/INTEGRATEWISE_CANONICAL_SPEC_v1.0.md`  
**Audience:** Developers, partners, integrators, and technical buyers  
**Purpose:** Onboard quickly, understand the integration model, and implement against stable contracts

---

## How to Use This Docs Set

Start with the conceptual model, then move to the integration model, then to implementation. If you are a partner, focus on the Integration Manager section and the four connection paths. If you are a developer extending the platform, focus on the Workbench and Capability Fabric sections.

All links in this docs set point to documents that should be created or expanded under this directory.

---

## 1. Conceptual Model

### 1.1 What IntegrateWise Is

IntegrateWise is not an automation tool, an integration platform, or an AI chat wrapper.

IntegrateWise is an operational continuity platform.

It connects the tools a team already uses, preserves operational memory across those tools, and exposes that continuity through one composed Workbench.

The AI layer is a silent partner, not a replacement for user judgment.

### 1.2 The Daily Loop From a Technical Perspective

From the user's perspective:

1. The Workbench opens with current context already assembled.
2. The Twin understands the active work.
3. The user asks, assigns, stores, or approves.
4. The system executes, syncs, and remembers.

From the runtime perspective:

1. Configuration Manager compiles the effective tenant configuration.
2. Integration Manager manages connections and capability sources.
3. Activation Bridge compiles the active workspace.
4. Data Pipeline ingests, normalizes, relates, and governs operational state.
5. Adaptive Spine owns canonical truth.
6. Continuity Bridge delivers active context.
7. Workbench Composition renders the user's surface.
8. Twin prepares, proposes, and waits.
9. Governance evaluates authority and consequence.
10. Hermes coordinates authorized execution.
11. Sync reconciles connected systems.
12. Promotion evaluates and promotes approved outcomes.

The user experience is simple.

The platform is precise.

### 1.3 Where You Fit

Developers and partners interact with IntegrateWise at three levels:

- Connection: connect tools, systems, intelligence, and capabilities
- Composition: extend Workbench behavior and context projection
- Execution: implement runtime adapters, capability contracts, and governance hooks

You do not need to understand the full platform to contribute.

---

## 2. Integration Model

### 2.1 The Four Paths

IntegrateWise preserves four distinct connection and capability paths.

| Path          | Purpose                                            | Typical Integrator                                      |
| ------------- | -------------------------------------------------- | ------------------------------------------------------- |
| API Connector | Connect operational systems                        | SaaS integrations, CRM/ERP/Support APIs                 |
| MCP           | Connect tools and resource protocols               | MCP servers, tool providers                             |
| AI Connector  | Connect intelligence providers                     | Model providers, embedding providers, reasoning systems |
| API Wrapper   | Turn an API or function into a governed capability | Internal APIs, serverless functions, legacy services    |

### 2.2 Connection vs Capability

Not every connection should become a capability.

A connection makes a system reachable.

A capability defines how IntegrateWise uses that reachability: intent, inputs, outputs, authority, evidence requirements, execution mode, risk, governance policy, sync policy, and promotion policy.

### 2.3 Integration Manager Ownership

Integration Manager owns:

- connector lifecycle;
- provider authentication binding;
- capability discovery;
- provider metadata;
- webhook registration;
- schema discovery;
- sync configuration;
- connection health.

Integration Manager does not own tenant runtime configuration.

That belongs to Configuration Manager.

### 2.4 Partner Entry Points

| Partner type         | Recommended path                     |
| -------------------- | ------------------------------------ |
| SaaS vendor          | API Connector or API Wrapper         |
| Tool developer       | MCP                                  |
| AI provider          | AI Connector                         |
| Internal engineering | API Wrapper + custom runtime adapter |

---

## 3. Capability Fabric

### 3.1 What a Capability Contract Defines

A capability contract describes:

- intent;
- input schema;
- output schema;
- authority and required scopes;
- evidence requirements;
- execution mode;
- sync mode;
- promotion policy;
- risk;
- governance policy hints;
- provider dependency;
- runtime binding.

### 3.2 Execution Resolution

Capability Fabric answers: How can this intent be performed?

The valid execution paths are:

- Local Execution
- API Connector Action
- API Wrapper Capability
- MCP Invocation
- AI Execution
- Agent-to-Agent
- Tool-to-Tool

### 3.3 Runtime Adapter Contract

A runtime adapter:

- receives an authorized ExecutionPlan or capability invocation;
- binds active context;
- executes the capability;
- emits an OutcomeEvent;
- does not make governance decisions;
- does not write to Spine directly;
- does not assemble continuity context.

Hermes coordinates the runtime adapter.

Hermes does not replace the adapter.

---

## 4. Context Contracts

### 4.1 The Three Canonical Contexts

| Context              | Responsibility                                                                      |
| -------------------- | ----------------------------------------------------------------------------------- |
| SpineContext         | Canonical operational context retrieved from continuity state                       |
| WorkbenchComposition | Role-aware UI, data, and capability composition                                     |
| ContinuityBundle     | Portable active runtime context delivered to Twin, agent, capability, or AI runtime |

### 4.2 Continuity Bundle Contents

A continuity bundle contains:

- spineContext;
- optional workbench composition;
- memory context;
- knowledge context;
- capability references;
- evidence references;
- authority context;
- generatedAt;
- expiresAt.

### 4.3 Important Distinctions

- Entity360 is a projection inside SpineContext.
- AssembledContext is replaced by ContinuityBundle.
- Active Context Bundle is the product-language name for ContinuityBundle.
- Do not introduce additional context types without updating this specification.

---

## 5. Workbench Extension Model

### 5.1 Composition Rules

The Workbench is configuration-driven.

Configuration Manager resolves the effective platform and tenant configuration before Workbench composition.

CompiledTenantConfig determines:

- enabled departments;
- enabled domains;
- role definitions;
- Workbench composition rules;
- available Context types;
- visible fields;
- field precedence;
- enabled capabilities;
- provider bindings;
- Twin policy;
- memory policy;
- governance policy references;
- approval requirements;
- notification policy;
- retention policy;
- feature policy.

### 5.2 Department Hubs

The Workbench is not a fixed dashboard.

It is the compositional operating hub for every department.

Each department sees the fields, data, memory, knowledge, and capabilities relevant to its work.

Examples:

- Customer Success Hub
- Revenue Hub
- Engineering Hub
- Operations Hub
- Finance Hub

### 5.3 Extension Points

| Extension area         | Contract boundary                               |
| ---------------------- | ----------------------------------------------- |
| New domain             | Domain definition + Workbench composition rules |
| New capability         | Capability contract + runtime binding           |
| New connectivity path  | Integration Manager connection contract         |
| New governance rule    | Governance policy reference                     |
| New storage substrate  | Repository contract + adapter implementation    |
| New experience surface | Gateway-projection API                          |

---

## 6. Governance and Approval Model

### 6.1 Two Gates

**Pre-Proposal Gate**

- Authority
- Scope
- Policy

Result:

- ALLOW_PROCEED
- REQUIRE_PRE_APPROVAL
- DENY

**Post-Proposal Gate**

- Risk
- Evidence
- Confidence
- Approval Requirement

Result:

- AUTO_APPROVE
- REQUIRE_HUMAN_APPROVAL
- DENY

### 6.2 Invariant

Confidence can increase trust in a proposal.

Confidence never grants authority.

A 0.99 confidence proposal with missing authority is DENY.

A 0.99 confidence proposal for a consequential action can still require human approval.

### 6.3 Approval Target

Approve Twin's Action approves an ExecutionPlan, not an AI message.

The plan must describe:

- what will happen;
- where it will happen;
- which records will change;
- who will be contacted;
- expected impact;
- supporting evidence;
- required authority;
- execution-plan version.

---

## 7. Execution and Sync Model

### 7.1 Modes

Execution mode and synchronization mode are independent.

Execution modes:

- Local Execution
- API Connector Action
- MCP Invocation
- API Wrapper Capability
- AI Execution
- Agent-to-Agent
- Tool-to-Tool

Sync modes:

- Immediate
- Deferred
- Scheduled
- Batch
- Event-Driven
- Reconciliation

### 7.2 Promotable Outcomes

Not every execution outcome promotes to the Spine.

Promotion is capability-aware and governance-aware.

The promotion decision may result in:

- PROMOTE
- HOLD
- REJECT
- NO_OP

---

## 8. State Substrate

### 8.1 Semantic Planes

| Semantic Plane | Responsibility                             |
| -------------- | ------------------------------------------ |
| Adaptive Spine | canonical operational truth                |
| Spine Cache    | hot projections and hydration acceleration |
| Memory Fabric  | memory metadata and lifecycle              |
| Knowledge      | semantic retrieval representations         |
| Twin Runtime   | session coordination and active runtime    |
| Blobs          | large immutable or versioned artifacts     |
| Sync State     | convergence progress                       |

### 8.2 Swappable Provider Contract

Product code talks to stable repository contracts.

The Configuration Manager selects physical providers and adapters.

No product logic imports D1, KV, R2, Vectorize, OpenAI, Supabase, or Redis SDKs directly.

### 8.3 Customer Zero Physical Bindings

| Semantic Plane | Customer Zero Binding               |
| -------------- | ----------------------------------- |
| Adaptive Spine | D1 / Postgres                       |
| Spine Cache    | KV                                  |
| Memory Fabric  | D1 + KV + Vectorize                 |
| Knowledge      | D1 metadata + R2 source + Vectorize |
| Twin Runtime   | Durable Object                      |
| Blobs          | R2                                  |
| Sync State     | D1 + queues                         |

---

## 9. Developer Onboarding

### 9.1 Repository Orientation

The repository is organized around platform services and packages.

Key areas:

- packages: shared contracts, types, SDKs, utilities
- services: runtime services, workers, APIs
- apps: user-facing experiences and surfaces
- docs: product, platform, marketing, sales, and technical documentation

### 9.2 Canonical Document Map

| Document                                               | Purpose                                      |
| ------------------------------------------------------ | -------------------------------------------- |
| `docs/spec/INTEGRATEWISE_CANONICAL_SPEC_v1.0.md`       | Top-level product and platform specification |
| `docs/architecture/CANONICAL_PLATFORM_ARCHITECTURE.md` | Platform architecture reference              |
| `docs/product/L1_WORKBENCH.md`                         | L1 Workbench surface specification           |
| `docs/architecture/WORKBENCH_DOCTRINE.md`              | Workbench composition doctrine               |
| `docs/architecture/SPINE_MODEL.md`                     | Spine data model                             |
| `docs/architecture/UNIFIED_GOVERNANCE_SPEC.md`         | Unified governance specification             |

### 9.3 Contribution Rules

- Follow the canonical contract chain.
- Do not bypass repository abstractions.
- Do not expose provider SDKs to product code.
- Preserve state ownership boundaries.
- Do not collapse the four connection paths.
- Do not bypass governance.
- Do not merge Activation Bridge and Continuity Bridge.

---

## 10. Partner Quick Reference

### 10.1 What Partners Build

| Partner archetype  | Typical contribution                                     |
| ------------------ | -------------------------------------------------------- |
| SaaS vendor        | API Connector or API Wrapper                             |
| Tool vendor        | MCP server or MCP-compatible tool interface              |
| AI provider        | AI Connector adapter                                     |
| Systems integrator | API Wrapper capabilities and Workbench composition rules |
| Embedded partner   | Experience surface using Gateway Projection APIs         |

### 10.2 What Partners Should Not Build

- Direct Spine writes outside governed promotion
- Bypass governance hooks
- Hard-code provider SDKs into shared contracts
- Collapse distinct connection paths into one generic connector
- Autonomously execute on behalf of users without approval

### 10.3 Partner Success Criteria

A partner integration is complete when:

- The connection is discoverable and healthy;
- The capability has a valid contract;
- The capability respects authority and scope;
- The capability emits observable OutcomeEvents;
- The partner does not require platform code changes to enable the connection for new tenants.

---

## 11. Troubleshooting

### 11.1 Integration Issues

Check:

- connection health in Integration Manager;
- provider authentication and credential status;
- schema discovery logs;
- webhook registration and delivery;
- sync cursors and checkpoint state.

### 11.2 Capability Issues

Check:

- capability registry entry and contract validity;
- required authority and scopes;
- execution mode binding;
- governance decision history;
- OutcomeEvent and error state.

### 11.3 Governance Issues

Check:

- Pre-Proposal and Post-Proposal decision history;
- approval policy assignment;
- affected systems and entity scope;
- evidence attachment;
- execution plan version state.

---

## 12. Glossary

| Term                  | Meaning                                                                |
| --------------------- | ---------------------------------------------------------------------- |
| User Workbench        | The compositional operating hub for every department                   |
| Twin                  | A persistent AI assistant that reasons over active context             |
| Continuity            | Operational memory that persists across tools, sessions, and providers |
| Adaptive Spine        | The canonical truth layer                                              |
| Capability Fabric     | The runtime resolver for how work can be performed                     |
| ExecutionPlan         | The governed, versioned plan approved by the user                      |
| Hermes                | The execution coordinator                                              |
| Sync Engine           | The convergence controller for connected systems                       |
| Continuity Pipeline   | The transformation and promotion path for outcomes                     |
| Governance            | The authority boundary evaluated in two gates                          |
| Store in Spine        | Observe action                                                         |
| Ask Your Twin         | Orient action                                                          |
| Assign Your Twin      | Decide action                                                          |
| Approve Twin's Action | Act action                                                             |

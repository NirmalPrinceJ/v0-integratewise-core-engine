# IntegrateWise Canonical Product and Platform Specification

**Version:** 1.0  
**Status:** CANONICAL  
**Primary Experience:** User Workbench  
**AI Experience:** Your Twin  
**Interaction Model:** See → Ask → Assign → Approve  
**Internal Operating Model:** OODA — Observe, Orient, Decide, Act  
**Brand Doctrine:** Truth you own. AI you rent. Approval in between.

---

## How to Use This Document

This specification is the single source of truth for IntegrateWise product behavior, platform architecture, runtime boundaries, state ownership, and canonical contracts.

It is divided into two parts:

- **Part I — Product** defines what the user experiences, the Workbench surfaces, the four-button interaction grammar, Twin behavior, and end-to-end workflows.
- **Part II — Platform** defines how the product is implemented: Configuration Manager, Integration Manager, Activation Bridge, data continuity, state substrate, Memory Fabric, retrieval, Context Contracts, Capability Fabric, Governance, Hermes, Sync, Promotion, and the runtime contract chain.

When this document conflicts with earlier architecture notes, deck copy, or generated files, this document wins.

---

## PART I — PRODUCT

### 1. The Problem

People already know how to do their jobs.

The problem is everything they have to do around the job.

Every day starts with finding context.

Open the inbox.

Check messages.

Open the CRM.

Look through tasks.

Find the last meeting notes.

Check what changed.

Remember what was promised.

Search for a document.

Compare information across tools.

Update one system after changing another.

Then open an AI assistant and explain the situation again.

The real work is surrounded by repetitive preparation, context gathering, remembering, searching, copying, checking, and updating.

AI was supposed to make this easier.

Instead, most AI starts from a blank conversation.

It does not reliably know what the user is working on.

It forgets useful work context.

Its memory can drift away from operational reality.

It often requires the user to gather the same information that the AI was supposed to help with.

And when AI is allowed to act freely, the user loses visibility and control.

IntegrateWise removes this daily cycle.

---

### 2. The Product

IntegrateWise gives the user one place to work and an AI Twin that stays with the work.

The user's work is brought together from the tools they already use.

The Twin understands the work currently in front of the user.

It remembers useful context the user has allowed it to remember.

It knows what changed.

It can find the information the user would normally search for.

It prepares the summaries, drafts, comparisons, follow-ups, research, updates, and next steps that normally consume the user's time.

The user does not have to explain the same work again every day.

The Twin does the hard lifting around the job.

The user reviews the work.

The user makes the decision.

The user approves anything important before it happens.

The next day does not start from zero.

The work continues with context.

---

### 3. The Daily Experience

#### See what matters

Open IntegrateWise.

Your current work is already there.

See what needs attention.

See what changed.

See where you left off.

See what is waiting for you.

#### Ask without starting again

Ask your Twin about the work in front of you.

You do not need to copy the customer name.

You do not need to paste the previous meeting notes.

You do not need to explain which task you are working on.

The Twin already has the permitted context of the work.

#### Give the hard lifting to your Twin

Assign the preparation work.

Research this issue.

Compare these options.

Prepare me for this meeting.

Draft the follow-up.

Find what changed.

Summarize the account.

Check the dependencies.

Prepare the update.

Build the next-step plan.

The Twin prepares the work and brings it back for review.

#### Stay in control

The Twin does not quietly send an email because it thinks the email is correct.

It does not update a customer record because its confidence score is high.

It does not make a business decision and execute it in the background.

When something important should happen, the user sees what is proposed.

The user reviews it.

The user approves it.

Then IntegrateWise helps get it done.

#### Continue with context

What happened becomes part of the continuing work.

The next task has the previous decision.

The next meeting has the previous commitments.

The next question has the relevant context.

The Twin does not begin every session as a stranger.

---

### 4. The Simple Product Promise

**Your work is already in context.**

**Your Twin remembers the work.**

**AI does the hard lifting.**

**You stay in control.**

That is IntegrateWise.

Everything else in this specification exists to make those four promises reliable.

---

### 5. The User Interaction Model

The user should not need to understand OODA, capability contracts, execution runtimes, promotion policies, or continuity infrastructure.

The visible interaction model is simple:

#### Store in Spine

Keep this as part of my work.

#### Ask Your Twin

Help me understand this.

#### Assign Your Twin

Do the hard preparation for me.

#### Approve Twin's Action

I reviewed this. Go ahead.

Internally, these actions map to Observe, Orient, Decide, and Act.

OODA is the internal operating model.

The four actions are the product language.

---

### 6. The User Workbench

The User Workbench is where the user does their daily job.

It is not another dashboard to monitor.

It is not a blank AI chat.

It is not a replacement for every specialist tool.

It brings together the parts of those tools that matter to the user's work.

A Customer Success user may need customer details, support history, product usage, billing state, meetings, commitments, open work, and recent communication.

A Finance user may need invoices, payments, vendors, approvals, exceptions, and cash-related work.

An Engineering user may need issues, incidents, code activity, documentation, dependencies, and current decisions.

A founder may need customers, revenue, product, hiring, finance, commitments, and company decisions.

Each person sees the work relevant to their role.

Their Twin works with that same context.

The Workbench and the Twin are two parts of the same daily experience.

---

### 7. What IntegrateWise Must Remove

IntegrateWise succeeds when the user spends less time:

- finding information;
- switching between tools;
- reconstructing context;
- remembering previous commitments;
- repeating information to AI;
- preparing repetitive work;
- manually comparing systems;
- copying updates between tools;
- checking whether work was completed;
- rebuilding yesterday's context.

The product should not be measured by how many AI messages the user sends.

A better product may result in fewer AI conversations because the Twin already understands the work and prepares useful output before another long explanation is required.

---

### 8. Product-to-Platform Translation

The user buys a simpler working day.

The platform exists to make that experience dependable.

| What the user expects                | What IntegrateWise uses internally |
| ------------------------------------ | ---------------------------------- |
| My work is together                  | User Workbench                     |
| I do not search five tools           | Common Connected Surface           |
| It knows what I am working on        | Active Context                     |
| It remembers useful context          | Memory                             |
| It does not forget what happened     | Adaptive Spine                     |
| AI does not drift away from the work | Context and memory boundaries      |
| It finds the right information       | Knowledge and Retrieval            |
| AI prepares the hard work            | Twin                               |
| I can give AI preparation work       | Assign Your Twin                   |
| It can use my connected tools        | Capability Fabric                  |
| It does not act behind my back       | Governance                         |
| I see exactly what will happen       | ExecutionPlan                      |
| I decide whether it happens          | Approve Twin's Action              |
| The approved work gets done          | Hermes and Runtime                 |
| My tools remain updated              | Sync                               |
| Tomorrow starts with context         | Continuity                         |

From this point forward, the specification defines the product and platform mechanisms used to keep these promises.

---

## PART II — PLATFORM

### 9. Primary Information Architecture

#### 9.1 Global Navigation

The main navigation contains:

1. Home
2. My Work
3. Contexts
4. Meetings
5. Knowledge
6. Approvals
7. Timeline

Secondary items:
Connections, Twin Activity, Settings, Help, Administration

#### 9.2 Global App Shell

**Left Rail**  
Logo, workspace selector, primary navigation, pinned contexts, recent contexts, connection-health indicator, user profile/settings.

**Top Bar**  
Universal search, current workspace, contextual breadcrumb, notifications, approval count, Twin status, connection/sync status, user menu.

**Main Canvas**  
Active product surface.

**Right Contextual Panel**  
Current-context summary, Twin observations, related evidence, prepared work, suggested next actions, quick connected-system actions. Collapsible, resizable on desktop, drawer on tablet, full-screen sheet on mobile.

**Bottom Action Sheet**  
Used only for urgent Twin proposals, approval requests, action previews, execution progress, and recoverable failures. It must not permanently obstruct work.

---

### 10. Home

#### 10.1 Purpose

Home answers: **What should I know and do now?**

It is personalized by user role, assignments, active contexts, priorities, connected-system changes, due dates, recent activity, organizational policy, and validated work preferences.

#### 10.2 Home Layout

**A. Resume Work**  
Last active context, active task, last viewed section, unresolved draft, pending approval, latest relevant change.

Primary action: Resume  
Secondary actions: Open context, Review changes, Dismiss from Home

**B. My Priorities**  
Ranked work requiring attention. Each item includes title, context or entity, priority, due date, source system, reason for ranking, current status, and available actions. Twin may add: Why this matters, What changed, or Prepared next step.

**C. What Changed**  
Meaningful operational changes rather than raw activity.

Examples:

- account health declined after unresolved tickets;
- opportunity stage changed without forecast update;
- project deadline moved;
- payment failed;
- meeting action item became overdue.

Each card includes change summary, time, affected context, previous and current state, source, impact, evidence, and suggested response.

**D. Prepared by Twin**  
Non-executed preparation: meeting briefs, response drafts, account summaries, follow-up plans, report drafts, issue analyses, proposed record updates.

Each item includes output type, context, creation reason, source count, freshness, confidence or uncertainty indicator, and review action.

**E. Decisions and Approvals**  
Approvals required, approving actor, action impact, affected systems, deadline, risk level, current execution-plan version.

**F. Upcoming**  
Meetings, commitments, deadlines, renewals, milestones, scheduled workflows.

---

### 11. My Work

#### 11.1 Purpose

My Work is the user's unified operational queue across connected systems.

#### 11.2 Views

Today, Upcoming, Assigned to Me, Assigned to Twin, Waiting, Blocked, Completed, custom saved views.

#### 11.3 Work Item Model

Every work item displays: title, work type, status, priority, owner, due date, associated context, source provider, related dependencies, last meaningful change, Twin preparation state, and available actions.

#### 11.4 Work Item Details

Overview, description, current state, context and relationships, evidence, activity, Twin preparation, provider actions, execution and sync status.

#### 11.5 Unified Actions

Depending on capability and authorization, the user may: update status, change owner, add a note, set a due date, send a message, create a related task, update a provider record, assign preparation to Twin, approve a proposed action, or mark resolved.

---

### 12. Contexts and Context360

#### 12.1 Context Definition

A context is a connected operational object around which work occurs.

Examples: customer, account, opportunity, project, incident, ticket, product, campaign, employee, candidate, vendor, contract, invoice.

#### 12.2 Contexts Index

Search, filtering, sorting, saved views, role-specific columns, recent contexts, pinned contexts, at-risk contexts, contexts with changes, contexts requiring decisions.

Operational relevance is prioritized over static CRM-style listing.

#### 12.3 Context360 Header

Context name, context type, current status, owner, health or risk state, key identifiers, latest meaningful change, freshness, source systems, primary actions.

#### 12.4 Context360 Tabs

The canonical tab set includes:

1. Overview
2. Work
3. Relationships
4. Timeline
5. Meetings
6. Knowledge
7. Files
8. Decisions
9. Systems

#### 12.5 Progressive Loading

Context360 loads in order:

1. identity and header
2. key operational state
3. current work
4. primary relationships
5. recent timeline
6. knowledge and files
7. Twin-generated interpretation

| State           | Target Response Time                    |
| --------------- | --------------------------------------- |
| Prepped context | Immediate perceived display             |
| Warm context    | 200 ms for cached projection            |
| Cold context    | 2–4 seconds with progressive loading    |
| AI enrichment   | Asynchronous; never blocks core context |

Every cached projection displays freshness metadata when relevant.

---

### 13. Meetings

#### 13.1 Meeting List

Upcoming, Today, Needs Preparation, Follow-up Required, Past Meetings.

#### 13.2 Meeting Detail

Title, participants, linked contexts, calendar source, agenda, previous commitments, open work, recent changes, relevant documents, Twin-prepared brief, notes, decisions, follow-up actions.

#### 13.3 Silent Preparation

Twin prepares a meeting brief automatically when:

- the meeting is approaching;
- relevant context exists;
- the user has access;
- preparation is permitted;
- source freshness is sufficient.

The brief includes purpose, relationship summary, changes since the previous interaction, unresolved commitments, risks, suggested questions, and relevant evidence.

The brief must be explicitly labeled as AI-prepared and remain fully editable.

---

### 14. Knowledge

#### 14.1 Purpose

Knowledge provides evidence-backed access to organizational information without requiring users to know where every artifact is stored.

#### 14.2 Knowledge Views

Search, Recommended, Recent, Saved, Policies, Playbooks, Context-linked knowledge.

#### 14.3 Search Results

Each result displays title, source, content type, owner, last updated, access level, related contexts, matching excerpt, and freshness.

AI-generated answers provide explicit citations to source artifacts.

---

### 15. Approvals

#### 15.1 Purpose

Approvals provide a single review surface for proposed consequential actions.

#### 15.2 Approval Queue

Needs My Approval, Submitted by Me, In Execution, Completed, Rejected, Failed, Expired.

#### 15.3 Approval Detail

Every approval must show:

- proposed action;
- business purpose;
- initiating user or Twin assignment;
- affected contexts;
- affected systems;
- exact fields or operations;
- evidence;
- execution-plan version;
- risk classification;
- approval policy;
- expected outcome;
- rollback or recovery availability.

Available decisions:
Approve, Reject, Request Changes, Edit and Approve, Delegate Approval, Cancel.

If a proposal changes after approval, the changed version must be approved again when its consequence boundary changes.

---

### 16. Timeline

#### 16.1 Purpose

Timeline is the normalized continuity record across user work, provider events, Twin preparation, decisions, and outcomes.

#### 16.2 Event Types

Provider change, user action, Twin observation, prepared output, proposed action, approval, execution, synchronization, promotion, rejection, failure, recovery, memory update.

#### 16.3 Timeline Event Anatomy

Each event includes: event type, actor, timestamp, affected context, source, description, evidence, before-and-after state when applicable, and execution or sync status.

Raw technical events are grouped into understandable business changes by default.

---

### 17. Twin in L1

#### 17.1 Twin States

- Quiet
- Observing
- Prepared
- Attention
- Approval Required
- Executing
- Completed
- Blocked

**Observing** must not imply that private or unrestricted user activity is being recorded.

#### 17.2 Twin Panel Sections

- Current Context
- What Twin Noticed
- Prepared for You
- Suggested Next Step
- Evidence
- Activity

#### 17.3 Canonical Workbench Actions

The universal interaction grammar is:

- Store in Spine
- Ask Your Twin
- Assign Your Twin
- Approve Twin's Action

Supporting actions:
Dismiss, Save for later, Show evidence, Correct, Reduce similar suggestions, Report incorrect context.

---

### 18. OODA Interaction Model

#### 18.1 Observe — Store in Spine

Capture operational truth.

Store notes, facts, decisions, commitments, evidence, documents, and meeting outcomes.

The system also captures authorized operational events from connected systems.

Not every single event becomes canonical truth.

#### 18.2 Orient — Ask Your Twin

Retrieve and interpret active continuity context.

Twin answers using:

- active Workbench context;
- Spine state;
- relationships;
- recent changes;
- permitted memory;
- knowledge;
- provider data;
- relevant policies.

Questions automatically inherit the active context unless the user explicitly changes scope.

#### 18.3 Decide — Assign Your Twin

Delegate preparation:

- investigate an issue;
- compare alternatives;
- prepare a meeting;
- draft a response;
- produce a report;
- determine affected work;
- create a proposed plan.

An assignment produces a reviewable output.

It does not automatically grant execution authority.

#### 18.4 Act — Approve Twin's Action

Before approval, the UI displays:

- what will happen;
- where it will happen;
- which records will change;
- who will be contacted;
- expected impact;
- supporting evidence;
- required authority;
- execution-plan version.

After approval, the UI displays:

- execution progress;
- provider responses;
- partial completion;
- failure and retry states;
- synchronization results;
- final outcome.

**Twin never receives a direct Act button.**

The fourth button is **Approve Twin's Action**, not Run Twin, Execute, or Automate.

---

### 19. Silent Partner Behavior

#### 19.1 Intervention Levels

- Level 0 — No Surface
- Level 1 — Passive Indication
- Level 2 — Contextual Card
- Level 3 — Attention Notification
- Level 4 — Decision Required
- Level 5 — Blocking Policy Event

#### 19.2 Interruption Rules

Twin interrupts only when at least one condition is met:

- user impact is material;
- the action is time-sensitive;
- confidence and evidence are sufficient;
- a policy decision is required;
- the user requested notification;
- execution is blocked or failed.

Repeated low-value suggestions are automatically suppressed.

---

### 20. Context and Memory Model

- **Working Context:** temporary context including current page, active entity, selected work item, active filter, current meeting, in-progress draft, and recent Workbench actions. Working context expires and is not automatically committed as permanent memory.
- **Candidate Memory:** Twin may identify potential operational patterns. Candidate memories remain tentative.
- **Promoted Memory:** a memory becomes durable through applicable validation, confidence thresholds, user confirmation, organizational policy, retention controls, and source provenance.
- **Correction:** users can correct a Twin assumption, remove a memory, change a preference, identify an incorrect relationship, report stale context, or prevent similar suggestions.

Twin Memory is durable AI/user continuity.

Spine Memory is canonical operational truth.

Session Logs are interaction history.

Audit Logs are accountability and execution lineage.

These are separate substrates.

---

### 21. Connected-System Actions

#### 21.1 Capability Rendering

The Workbench renders actions based on:

- provider capabilities;
- active context;
- user authority;
- organization policy;
- connection health;
- required fields;
- current provider state.

Unavailable actions must clearly explain why they are disabled.

#### 21.2 Execution States

Draft -> Validating -> Approval Required / Authorized -> Queued -> Executing -> Provider Confirmed -> Synchronizing -> Completed

Alternative states:
Denied, Cancelled, Partially Completed, Failed, Retry Available, Recovery Required, Sync Conflict

#### 21.3 Provider Transparency

Users see exactly:

- which provider is affected;
- which account or connection is used;
- what data will be sent;
- whether the provider confirmed the operation;
- whether the Spine has reconciled the result.

Technical adapter details remain hidden unless needed for deep troubleshooting.

---

### 22. Key End-to-End Workflows

#### 22.1 Resume Daily Work

User opens Home -> Home restores previous active context -> Spine supplies current state and changes -> Twin silently compares new state with the previous session -> Home shows Resume Work and changes -> User resumes without manual briefing.

**Do not use Observe Pipeline or Orient Pipeline as named service boundaries.**

#### 22.2 Context Risk Detected

Connected-system event enters the Data Pipeline -> Spine links it to the appropriate context -> Continuity Bridge assembles relevant operational context -> Twin trigger policy evaluates whether cognitive analysis is warranted -> Twin identifies a material risk -> A contextual card appears in Context360 -> User reviews evidence, and Twin prepares recommended next steps.

#### 22.3 Draft and Send Follow-Up

Twin detects an unresolved commitment -> Twin prepares a follow-up draft -> Workbench shows the draft non-intrusively -> User reviews and edits -> System displays recipients and provider -> User approves sending -> Hermes dispatches the authorized ExecutionPlan -> Outcome is logged in Timeline.

#### 22.4 Meeting Preparation

Calendar event is observed -> Participants are linked to Spine contexts -> Recent updates are assembled -> Twin prepares a brief -> User opens meeting and reviews brief -> Post-meeting decisions and follow-ups are proposed for validation.

The correct runtime chain is:

1. User requests or initiates an operational change.
2. Capability Fabric resolves the applicable CapabilityContract.
3. Pre-Proposal Governance evaluates authority, scope, policy.
4. Twin or the deterministic planning runtime prepares the proposed outcome.
5. Plan Builder converts the proposal and capability contracts into an ExecutionPlan.
6. Post-Proposal Governance evaluates risk, evidence, confidence, approval requirement.
7. The Workbench previews the governed ExecutionPlan.
8. The user approves when required.
9. Hermes receives the authorized ExecutionPlan.
10. Runtime adapters execute the plan steps.
11. OutcomeEvents are emitted.
12. Sync reconciles provider state.
13. Promotion evaluates whether the resulting state becomes canonical Spine truth.
14. Context360 rehydrates.
15. Timeline records proposal -> approval -> execution -> sync -> promotion.

**Approve Twin's Action approves an ExecutionPlan, not an AI message.**

---

## PART II — PLATFORM

### 23. Configuration Manager

#### 23.1 Purpose

Configuration Manager defines how the tenant operates.

It compiles the effective runtime configuration from platform defaults, deployment profile, environment profile, tenant configuration, tenant policy, and runtime feature policy.

#### 23.2 Authority

Configuration Manager owns:

- provider selection;
- adapter selection;
- binding references;
- runtime policies;
- consistency requirements;
- isolation requirements;
- retention policy;
- residency requirements;
- failover selection;
- feature policy;
- effective config compilation.

Configuration Manager never owns provider credentials.

#### 23.3 Output

CompiledTenantConfig

#### 23.4 Effective Configuration Precedence

Platform Default -> Deployment Profile -> Environment Profile -> Tenant Config -> Tenant Policy -> Runtime Feature Policy -> Effective Config

Not every layer may override every field.

Some fields are platform-only:

- mandatory audit;
- governance bypass prevention;
- tenant isolation;
- encryption floor;
- platform safety policy.

---

### 24. Integration Manager and Four Connection Paths

IntegrateWise preserves four distinct connection and capability paths.

**Authorization authority:** Descope is the canonical external authorization authority for supported outbound connections (where supported). IntegrateWise owns connector semantics, connection bindings, tenant/workspace ownership, configuration, wiring, activation, capability definitions, governance, routing, and continuity. Descope owns external authorization, outbound connection authorization state, credential/token lifecycle, and external authorization resource identity. Nango is classified as legacy/dormant compatibility until provider-specific runtime evidence proves it is still required; it is not the default architecture.

Spine does not eliminate future authorization requirements. Descope owns the authorization lifecycle; Spine retains canonical operational continuity so future work does not start with empty context.

**Canonical runtime law:** Connectors provide reach. Connections provide authorized access. Capabilities provide bounded actions. Governance provides permission. Hermes coordinates execution. Spine remembers.

Routing selects. Governance authorizes. Hermes coordinates. The activated execution adapter executes. Pipeline promotes the result. Spine retains canonical continuity.

**MCP surface boundary:** IW-Continuity-Bridge is the public semantic MCP surface (fixed IntegrateWise semantic contract). External AI clients (ChatGPT, Claude, Perplexity, Hermes) connect through the Bridge. The Descope MCP Adapter (established at commit `5c15413e`) is an internal execution adapter that resolves Descope-managed outbound authorization and executes an already selected, governed, activated provider route. External AI clients must not connect directly to the Descope MCP execution surface.

#### 24.1 MCP

Connects tool and resource protocols.

Discovers tools, resources, prompts, schemas, and server capabilities.

Governs tool/resource invocation.

MCP connects tools.

#### 24.2 AI Connector

Connects intelligence providers and AI runtimes.

Models, embeddings, reasoning, multimodal intelligence, specialized AI services.

AI Connector connects intelligence.

No model owns canonical operational truth.

#### 24.3 API Connector

Connects operational systems.

Provider authentication, OAuth lifecycle, schemas, objects, fields, events, reads, writes, webhooks, cursors, checkpoints, incremental hydration, synchronization.

API Connector connects systems.

#### 24.4 API Wrapper

Converts an API, function, workflow, or service into an IntegrateWise capability.

Defines intent, inputs, outputs, authority, evidence requirements, execution mode, risk, governance policy.

API Wrapper creates capabilities.

**The Four-Path Law**: API Connectors connect systems. MCP connects tools. AI Connectors connect intelligence. API Wrappers create capabilities.

All four paths enter the Capability Registry under distinct contracts.

They do not share one generic integration contract.

---

### 25. Activation Bridge and Continuity Bridge

#### 25.1 Activation Bridge

Compiles:

- compiled tenant configuration;
- connected ecosystem;
- organization structure;
- user identity;
- department;
- role;
- available data;
- available capabilities;
- governance policy.

Produces the Active Workspace Definition.

Hydration phases:

- Instant Hydration
- Operational Hydration
- Historical Hydration

#### 25.2 Continuity Bridge

Delivers the active context bundle to the active runtime.

Resolves:

- user memory;
- work memory;
- organization memory;
- Twin memory;
- active entities;
- relevant relationships;
- recent decisions;
- current work state;
- available evidence;
- relevant knowledge;
- capability context.

Produces the Active Context Bundle.

Activation Bridge and Continuity Bridge are separate contracts.

Do not merge them.

---

### 26. Data Continuity

#### 26.1 Common Connected Surface

One logical operational surface across independent systems.

Connected tools retain provider boundaries.

IntegrateWise creates a shared operational layer.

The Common Connected Surface understands provider identity, tool category, objects, fields, schemas, entities, relationships, capabilities, events, authority, sync behavior, and data ownership.

#### 26.2 Creamy Load

Deep initial continuity formation.

Discover -> Select -> Extract -> Parse -> Normalize -> Synthesize -> Relate -> Govern -> Promote -> Hydrate

Goal: create enough normalized and related operational state for the organization to begin working from IntegrateWise.

#### 26.3 Delta Load

Continuously absorb changes.

Detect -> Capture Delta -> Resolve Source and Entity -> Parse -> Normalize -> Synthesize -> Compare with Spine State -> Govern -> Promote or Queue -> Invalidate or Refresh Cache -> Rehydrate Active Context

#### 26.4 Streaming Load

Continuous event-driven hydration for high-volume or real-time sources.

#### 26.5 Spine Networking

The Spine is the canonical context and continuity network.

It is not an ESB.

Tools connect once to IntegrateWise.

Canonical entities and governed context become reusable across every authorized Workbench, Twin, agent, and capability.

Spine Networking understands:

- source ownership;
- canonical state;
- consumer scope;
- write authority;
- sync policy.

---

### 27. State Substrate

#### 27.1 Semantic planes

| Semantic Plane | Responsibility                             | Physical Customer Zero Binding      |
| -------------- | ------------------------------------------ | ----------------------------------- |
| Adaptive Spine | canonical operational truth                | D1 / Postgres                       |
| Spine Cache    | hot projections and hydration acceleration | KV                                  |
| Memory Fabric  | Memory metadata and lifecycle              | D1 + KV + Vectorize                 |
| Knowledge      | semantic retrieval representations         | D1 metadata + R2 source + Vectorize |
| Twin Runtime   | session coordination and active runtime    | Durable Object                      |
| Blobs          | large immutable or versioned artifacts     | R2                                  |
| Sync State     | convergence progress                       | D1 + queues                         |

#### 27.2 Laws

1. Every byte has an owner.
2. Every store has a purpose.
3. D1 owns structured state and metadata for v0.
4. KV owns reconstructable hot projections and caches.
5. R2 owns bytes, raw artifacts, large payloads, and evidence objects.
6. Vectorize owns semantic retrieval vectors, not source truth.
7. Embeddings are versioned derived representations and may always be rebuilt.
8. D1 owns the meaning and references of blobs and vectors; R2 and Vectorize own their physical representations.
9. Product logic talks to stable repository contracts, never directly to D1, KV, R2, or Vectorize.
10. No product plane depends on a provider primitive.

#### 27.3 Swappable Provider Architecture

IntegrateWise defines capability contracts.

The Configuration Manager resolves configured implementations.

Providers execute through adapters.

No external provider owns an IntegrateWise architectural boundary.

Deployment configuration selects infrastructure.

Application architecture does not.

Product code must never import a provider SDK directly.

---

### 28. Memory Fabric

#### 28.1 Memory Scopes

- User Memory
- Work Memory
- Organization Memory
- Twin Memory

Twin Memory is a memory scope, not the entire Twin runtime.

Twin Memory, Session Logs, Audit Logs, and Spine state remain separate.

#### 28.2 Memory Record

Each memory record contains:

- memoryId
- tenantId
- scope
- ownerRef
- subjectRefs
- memoryType
- content
- provenance
- evidenceRefs
- embeddingRef
- blobRefs
- confidence
- createdAt
- updatedAt
- expiresAt

#### 28.3 Physical substrate

- D1 owns memory metadata and lifecycle.
- KV owns hot memory projections.
- Vectorize owns semantic memory retrieval indexes.

---

### 29. Embeddings and Retrieval Fabric

Embeddings are derived representations.

If an embedding model changes, re-embed from source truth.

Vectorize is a retrieval primitive.

Logical index families:

- memory retrieval
- knowledge retrieval
- Spine semantic retrieval
- session semantic retrieval

Do not dump everything into one vector index.

Similarity score semantics differ by domain.

---

### 30. Unified Governance

#### 30.1 Two gates

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

Governance is a cross-phase authority boundary.

It is not an Act-phase service.

#### 30.2 Invariant

Confidence can increase trust in a proposal.

Confidence never grants authority.

A 0.99 confidence proposal with missing authority is DENY.

A 0.99 confidence proposal for a consequential action can still require human approval.

---

### 31. Execution Model

#### 31.1 ExecutionPlan

**Approve Twin's Action approves an ExecutionPlan, not an AI message.**

ExecutionPlan describes:

- planId
- tenantId
- proposalId
- planVersion
- summary
- impactSummary
- steps
- affectedEntities
- affectedSystems
- authority
- evidence
- executionMode
- syncMode
- rollbackStrategy
- compensationPlan
- status
- createdAt
- createdBy
- expiresAt

The user sees the execution plan before approval.

#### 31.2 Execution Modes

- Local Execution
- API Connector Action
- MCP Invocation
- API Wrapper Capability
- AI Execution
- Agent-to-Agent
- Tool-to-Tool

Execution mode and synchronization mode are independent.

#### 31.3 Hermes Scope

Hermes is the execution coordinator.

Hermes:

1. RECEIVE the ExecutionPlan
2. RESOLVE runtime binding
3. VALIDATE schema and permissions
4. ROUTE to runtime adapter
5. DISPATCH execution
6. TRACK correlation, state, and timeouts
7. REPORT telemetry and outcome events

Hermes does not:

- assemble continuity context;
- make governance decisions;
- write to Spine;
- reconcile provider systems;
- select AI models.

Capability Fabric resolves intent.

Governance authorizes.

Plan Builder plans.

Hermes coordinates.

Runtime adapter executes.

Sync reconciles.

Pipeline promotes.

---

### 32. Sync Engine

#### 32.1 Convergence Modes

- Immediate
- Deferred
- Scheduled
- Batch
- Event-Driven
- Reconciliation

#### 32.2 State

Cursors, checkpoints, pending mutations, retries, dead-letter state, conflict state, reconciliation state.

#### 32.3 Canonical law

Work now. Converge by policy.

---

### 33. Continuity Pipeline

Every governed execution produces an OutcomeEvent.

The pipeline evaluates:

- intent,
- action,
- evidence,
- authority,
- outcome,
- state,
- memory.

Approved operational truth is promoted back into the Adaptive Spine.

Twin Memory is updated according to memory policy.

Session history remains in Session Logs.

AI accountability remains in Audit Logs.

Files and evidence remain in Blob storage.

Semantic representations are updated in Knowledge.

Caches are invalidated or refreshed.

Sync state is advanced.

---

### 34. Canonical Contract Chain

```
CompiledTenantConfig
        ↓
ConnectionContract
        ↓
ActivationManifest
        ↓
LoadPlan
        ↓
CanonicalEntity / CanonicalField
        ↓
SpineContext
        ↓
WorkbenchComposition
        ↓
ContinuityBundle
        ↓
TwinProposal
        ↓
CapabilityInvocation
        ↓
PreProposalDecision
        ↓
ExecutionPlan
        ↓
PostProposalDecision
        ↓
ApprovalRecord
        ↓
OutcomeEvent
        ↓
SyncMutation
        ↓
PromotionDecision
        ↓
Canonical Spine State
```

Each arrow is a transformation with ownership.

Context proliferation is avoided.

**Three canonical context contracts**:

- SpineContext
- WorkbenchComposition
- ContinuityBundle

Entity360 is a projection inside SpineContext.

AssembledContext is replaced by ContinuityBundle.

Active Context Bundle is the product-language name for ContinuityBundle.

---

### 35. State Ownership Canonical Law

Adaptive Spine owns canonical operational truth.

No model owns canonical truth.

No agent writes directly to the Spine.

Changes reach canonical state through governed promotion.

Twin Memory owns durable AI/user continuity.

Session Logs own interaction history.

Audit Logs own accountability and execution lineage.

Blobs own binary and raw artifacts.

Spine Cache owns disposable derived acceleration state.

Knowledge owns retrievable semantic representations.

Sync State owns convergence progress.

Config State owns tenant runtime choices.

Ephemeral Runtime owns temporary coordination state.

---

### 36. Canonical Acceptance Criteria

A proposed architecture, service, data model, or UI interaction is canonical only if it satisfies all of the following:

- It preserves Workbench-first composition.
- It preserves the four-button interaction grammar.
- It preserves four distinct connection paths.
- It separates Activation Bridge from Continuity Bridge.
- It defines Creamy, Delta, and Streaming Load correctly.
- It preserves Spine Networking as governed context topology, not an ESB.
- It preserves state ownership boundaries.
- It preserves two-gate Governance.
- It preserves ExecutionPlan as the approval target.
- It preserves Hermes as execution coordinator only.
- It preserves promotion as capability-aware and governance-aware.
- It preserves swappable provider architecture.
- It does not conflate OODA with deployment topology.
- It does not collapse API Connector, MCP, AI Connector, or API Wrapper into one generic integration path.
- It does not claim the Twin operates autonomously without context or approval.

---

### 37. Final Canonical Statement

IntegrateWise gives every department one connected operational Workbench.

Every user works with a persistent Twin that understands operational continuity.

AI can propose and coordinate work, but enterprise truth and execution authority remain governed.

**Truth you own. AI you rent. Approval in between.**

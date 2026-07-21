# 20 — Operations Runbooks

> **Extracted from:** IntegrateWise Platform Specification Suite
> **Region:** first_pass
> **Original line:** 1342
> **Lines:** 107 | **Chars:** 6,165
> **Status:** Raw extraction — requires review and canonicalization

20 — Operations Runbooks
20.1 Daily motion runbook
Morning brief sanity, Promotion Queue SLAs, Connector healthcheck dashboard review.
20.2 Incident runbooks
P0: Twin down → revert to “Last Good Answer” projection.
P0: Connector down → triage by vendor, Nango re-auth, soft-sync queue flush.
P1: Spine write failures → DO alarm, retry, manual rebuild.
P2: Signal lag → check rule DSL hot-reload.
20.3 Compliance runbook
Quarterly RBAC review.
Annual encryption & key rotation.
20.4 DR runbook
R2 snapshot restore flow in https://docs.integratewise.ai/runbooks/dr.
Product Specifications (now formalized)
P-1 Universal Search
Indexes Spine (02), Memory (07), Knowledge (07).
Cursor pagination, persona-scoped filters.
Surfaces across Workbench and Command Palette.
P-2 Global Command Palette
Bound to ⌘K, surfaces Workspace switch, Twin invocation, Capability trigger.
Contextual based on persona and screen state (04).
P-3 Notification Center
Triage of Signal surfaced, GovernanceRequested, MemoryApproved events.
Per-user mute & digest cadence.
P-4 Activity Center
Unified feed of tl\_ events scoped to the workspace.
Filter by entity kind, actor, connector.
P-5 Timeline UI
Read view of Timeline; reverse-chronological with as-of toggle.
Entity detail “history” tab uses the same component.
P-6 Entity Detail Framework
One component render across all AggregateEntity types.
Tabs: Overview, Activity, Evidence, Signals, Capabilities, Memory.
P-7 Dashboard Composition Engine
Server-rendered, declarative JSON → React hierarchy.
Versioned dashboards per persona.
P-8 Widget SDK
Custom widget authoring; binding to Spine reads and Twin intents.
Sandbox iframe with capability allowlist.
P-9 Extension SDK
Workspace-scoped extensions; install via Marketplace (13).
P-10 Theme / Design Token Specification
See 18.1.
Engineering Specifications (now formalized)
Spec Doc location Key points
API versioning 19.1 date-based namespaces; 6-mo deprecation
SDK contracts 17 semver; breaking changes gated by MAJOR + migration
Error model 19.2 stable codes; trace_id correlation
Pagination 19.3 cursor; ≤1000 limit
Cursor strategy 19.3 ?cursor=…&limit=…; opaque, sign+expiry
Feature flags 19.4 X-IW-Feature-Flags; tenant scope override
Configuration system 19.5 server-driven; tenant + experiment + flag
Testing strategy 19.6 contract tests; synthetic tenant bed
Migration strategy 15.4 reversible; dry-run; bumping schema_version
Release strategy 15.3 flag-gated dark launch; progressive
Cross-spec runtime contracts (consolidated)
The user’s most important gap — runtime contracts between components — is now satisfied because every subsystem from 02–13 contains the same Responsibilities / Inputs / Outputs / Events Produced / Events Consumed / APIs / State Transitions / Failure Handling / Extension Points structure. Any engineer updating one component can read the canonical Events Consumed and APIs columns of the consumers/producers and reason about the change surface.

The single canonical cross-spec rule for evolving the platform:

Update the Spine (02) entity or event vocabulary first.
Update producers (03–13) to emit the new event name.
Update consumers (03–13) to declare the new event in Events Consumed.
Bump tenant_spine_config.schema_version (m054+) and write a migration (15.4).
Roll out under feature flag (15.3 / 19.4).
Every doc above follows that rule, so the suite is internally consistent and the existing Marketplace Onboarding & Persona Architecture spec remains the authoritative reference for OAuth, the 12×11 Matrix, L0.5–L4, Memory Pipeline, and Capability Fabric — while the 21 docs here supply the runtime, marketplace lifecycle, observability, security, deployment, and product-surface machinery the platform was missing.

Pasted markdown (1).md
84.36 KB
One doc end tn end
Source file appears identical in size (86388 bytes) to the prior one but at a different wrapper URL. I’ll re-confirm the existing spec via the index from the previous round, then deliver the entire 21-doc suite in one continuous inline document, fully written out with no placeholders.
IntegrateWise — Unified Platform Specification (00–20)
Companion to IntegrateWise — Marketplace Onboarding & Persona Architecture (m054+). The original spec defined Marketplace OAuth, the Onboarding Interstitial, the 12×11 Matrix, L0.5/L1/L2/L3/L4 operating layers, the 8-Layer Memory Pipeline, the Capability Fabric (Soft/Real/Propose sync modes), and the Morning Brief / Twin interaction model. This unified document supplies everything that spec referenced but did not define: the Operational Spine, runtime contracts for every subsystem, SDKs, governance runtime, marketplace lifecycle, security, deployment, observability, and the engineering / product surfaces required to evolve the platform.

This is a single continuous end-to-end document. Every section below is fully written out in sequence; no “see above” placeholders.

Unifying Doctrines (held constant across every doc below)
Distribution is ingress — every AI assistant marketplace is a tenant-acquisition channel.
Truth you own — the Spine is canonical; AI tools are projections.
AI you rent — the LLM provider is plumbable via Cloudflare AI Gateway; no vendor lock.
Approval in between — every write that crosses a system boundary passes through the Governance Engine.
One capability, every surface — the same cap*id resolves identically in Workbench, Twin, Chat, CLI, Slack, Mobile.
Continuity over asking — the Spine is the source of context; the Twin never re-asks.
Persona barrier — tenant_spine_config.industry × department defines the visible universe; users cannot pivot roles by widening scope.
Hard gates are non-negotiable — Soft-sync defaulting, 5-minute first-data-load, Promotion-Queue human approval.
Canonical ID Prefixes (used in every section below)
Prefix Domain
tnt* Tenant
wsp* Workspace
usr* User
ent* Entity (any domain object)
rel* Relationship
tl* Timeline entry
act* Activity
evd* Evidence
sig* Signal
cap* Capability
mem* Memory
knw* Knowledge
tw* Twin
prj* Projection
evt* Bus event
wf* Workflow
gov* Governance token
obs* Observability record
mkt* Marketplace listing
conn\_ Connector

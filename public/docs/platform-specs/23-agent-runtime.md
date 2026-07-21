# 23 — Agent Runtime

> **Extracted from:** IntegrateWise Platform Specification Suite
> **Region:** third_region
> **Original line:** 3085
> **Lines:** 54 | **Chars:** 3,220
> **Status:** Raw extraction — requires review and canonicalization

23 — Agent Runtime
23.1 Responsibilities
Own the Agent Registry, lifecycle, memory, permissions, scheduling, communication, supervision, and failure handling for automated agents beyond the Twin (Twin is itself an Agent, but is documented in 06 with persona-fit specialization).
23.2 Agent kinds (canonical)
Twin (inherits 06, persona-bound).
Worker Agent — runs inside a Workflow step (11), no persona-fit, transactional.
Supervisor Agent — watches Worker Agents and Twin health, can pause/restart.
Background Agent — runs from a cron or Event, e.g., TwinAgent (morning brief), TenantBrainDO (approvals).
Community Agent — contributed via Marketplace (13); sandboxed.
23.3 Inputs
Workflow step launch, cron schedule, Event Bus trigger, Manual admin launch.
Continuity context (25).
23.4 Outputs
Capability invocations (05), Memory intakes (07), Signals (10), Workflow handoffs (11).
23.5 Events produced
AgentRegistered, AgentScheduled, AgentStarted, AgentPaused, AgentResumed, AgentStopped, AgentFailed, AgentSupervisedAction, AgentCommunicationSent, AgentCommunicationReceived.
23.6 Events consumed
WorkflowStarted, WorkflowStepDue, CronTick, EventBus\*, TwinRoutedRequest.
23.7 APIs
POST /agents, POST /agents/{ag_id}/schedule, POST /agents/{ag_id}/pause, POST /agents/{ag_id}/resume, POST /agents/{ag_id}/invoke, GET /agents/{ag_id}/runs.
23.8 State transitions
declared → registered → scheduled → running → paused → resumed → stopped → failed → archived. Health watch: healthy → degrading → critical → quarantined.

23.9 Agent lifecycle specification
Mandatory metadata: id, kind, capabilities[], permissions[], memory_scope, owner, contacts[].
Permissions inherit from capability-level requiredScopes + agent-level overrides.
Run traces appended to Observability (16); supervision emits AgentSupervisedAction.
23.10 Agent registry
Persistent in D1 (agents.agents, agents.runs, agents.permissions).
Discoverable per workspace via Projection Engine (04).
23.11 Agent memory
memory_scope chooses: Twin-meaning (07/L1) for ephemeral, Organizational Memory (07/L7) for durable.
Agents may not write directly to Spine (02) — only via Capability Fabric (05).
23.12 Agent permissions
Each agent declares requiredScopes[] evaluated through 09 Governance.
Cross-workspace calls require gov.cross_workspace token.
23.13 Agent scheduling
Trigger types: cron, Event Bus (filter), Time-window, Manual, Chain.
Time windows enforced in DO durable alarms.
23.14 Agent communication
Two patterns: (a) Capability invocation through 05; (b) Async envelope through Event Bus.
All envelopes signed; recipient validates.
23.15 Agent supervision
Supervisor Agent checks HealthSnapshot (08.7-style), run success rate, drift metrics.
Allowed actions: pause, restart, route to fallback model (22), quarantine.
23.16 Failure handling
Per Agent kind: restart policy varies.
Twin: rehydrate context from 25; do not lose conversation state.
Worker Agent: idempotent retry, max N=3.
Community Agent: quarantine + admin notify.
Cross-agent failure cascade: Supervisor Agent breaks the loop.
23.17 Extension points
New Agent kinds via registry; reviewed for sandbox if kind=community.
Custom runners (e.g., remote executor) via AGENT_RUNNER(name).

# 01 — Platform Architecture

> **Extracted from:** IntegrateWise Platform Specification Suite
> **Region:** first_pass
> **Original line:** 535
> **Lines:** 64 | **Chars:** 2,852
> **Status:** Raw extraction — requires review and canonicalization

01 — Platform Architecture
1.1 Reference layers
Copy┌────────────────────────────────────────────────────────────────────┐
│ Distribution surfaces: ChatGPT · Claude · Perplexity · Web · Slack │
└────────────────────────────────────────────────────────────────────┘
↓
┌────────────────────────────────────────────────────────────────────┐
│ Gateway (Cloudflare Worker) RS256 JWT · rate limit · routing │
└────────────────────────────────────────────────────────────────────┘
↓
┌────────────────────────────────────────────────────────────────────┐
│ Operational Spine (D1 + DO SQL) canonical entities + timeline │
└────────────────────────────────────────────────────────────────────┘
↓ ↑ ↑
┌──────────────────────┐ ┌───────────────────────┐ ┌──────────────┐
│ Projection Engine │ │ Twin Runtime │ │ Workflows │
│ (Workbench, Persona, │ │ (OODA, Memory, │ │ (triggers, │
│ Workspace surfaces) │ │ Persona Grammar) │ │ retries) │
└──────────────────────┘ └───────────────────────┘ └──────────────┘
↓
┌────────────────────────────────────────────────────────────────────┐
│ Capability Fabric (registry + SDK) sync_mode = soft|real|propose │
└────────────────────────────────────────────────────────────────────┘
↓
┌────────────────────────────────────────────────────────────────────┐
│ Connectors (Nango · MCP · Native · AI Provider) outbound writes │
└────────────────────────────────────────────────────────────────────┘
↓
┌────────────────────────────────────────────────────────────────────┐
│ Systems of Record (Salesforce, HubSpot, Jira, NetSuite, …) │
└────────────────────────────────────────────────────────────────────┘
1.2 Subsystem responsibility matrix (canonical references)
Subsystem Defined in Runtime contract template
Operational Spine 02 ✔
Workspace Runtime 03 ✔
Projection Engine 04 ✔
Capability Fabric 05 ✔
Twin Runtime 06 ✔
Memory System 07 ✔
Connector Framework 08 ✔
Governance Engine 09 ✔
Signal Engine 10 ✔
Workflow Engine 11 ✔
Entity Framework 12 ✔
Marketplace 13 ✔
Security 14 ✔
Deployment 15 ✔
Observability 16 ✔
SDKs 17 n/a (delivery)
UI/Design System 18 n/a (delivery)
API Contracts 19 n/a (delivery)
Runbooks 20 n/a (delivery)
1.3 Runtime contract template (used by every numbered subsystem)
Each subsystem spec below contains these fields, in this order:

Responsibilities — what this subsystem owns.
Inputs — events, APIs, scheduled inputs.
Outputs — events, APIs, persisted rows.
Events produced — names emitted onto the Event Bus (10).
Events consumed — names subscribed-to from the Event Bus.
APIs — Gateway routes / worker RPCs that touch this subsystem.
State transitions — the lifecycle state machine.
Failure handling — retries, fallbacks, dead-letter.
Extension points — how external code injects behavior.

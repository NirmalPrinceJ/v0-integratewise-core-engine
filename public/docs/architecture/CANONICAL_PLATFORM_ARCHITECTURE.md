# IntegrateWise — Canonical Platform Architecture

**Status:** Canonical — Authoritative Platform Architecture  
**Date:** July 12, 2026  
**Authority:** Nirmal (Founder)  
**Supersedes:** All prior architecture documents unless explicitly versioned  
**Version:** 2.1 (Architecture corrections: Spine network topology, Activation/Continuity Bridge separation, Capability Fabric expansion)

---

## Operational Continuity Infrastructure with Governed Intelligence

---

### Core Doctrine

> **Truth you own. AI you rent. Approval in between.**

IntegrateWise is operational continuity infrastructure with governed intelligence. It connects the systems an organization already runs, converts their activity into canonical operational truth, composes role-aware Workbenches on top of that truth, and lets humans and their Tandem Twin operate together under explicit authority and approval. Every intent, evidence trail, outcome, and approval flows through a Continuity Pipeline that returns to the Adaptive Spine, so the next OODA loop begins with more context than the last.

The organization owns its operational truth in the Adaptive Spine. The Twin provides rented intelligence — reasoning, drafting, retrieval, and proposals — but never gets a direct Act button. Every consequential execution is gated by human approval and by Governance.

**The user never opens a provider tool to do work. The Workbench is the tool. Every action that can be performed inside Salesforce, Jira, Slack, Stripe, HubSpot, Linear, GitHub, Zendesk, Intercom, QuickBooks, or any connected system can be executed from the Workbench surface itself. The user stays in one place. The platform reaches into every system on their behalf.**

**The Twin is not waiting to be asked. The Twin is always present, always watching, always contextually aware. Every click, every field change, every navigation, every data interaction is observed by the Twin in real time. The Twin sees what the user sees. The Twin knows what the user knows. The Twin has already retrieved the memory, the history, the relationships, the evidence, and the next-best-action before the user finishes thinking about it. The user never provides context. The user never restates data. The user never explains what they are working on. The Twin already knows.**

---

### The Four-Button OODA Grammar

The User Workbench interaction model is exactly four canonical buttons, mapped directly to the OODA loop. These are the universal interaction grammar across every Workbench — not domain-specific action button chaos.

| OODA    | Canonical Action   | Button                    | System Meaning                                                                               |
| ------- | ------------------ | ------------------------- | -------------------------------------------------------------------------------------------- |
| Observe | Capture truth      | **Store in Spine**        | Persist context, evidence, decision, note, or artifact into canonical Digital Memory         |
| Orient  | Understand context | **Ask Your Twin**         | Query the Twin using current workspace + Continuity Bridge + Spine context                   |
| Decide  | Delegate intent    | **Assign Your Twin**      | Give the Twin an objective to plan, reason, draft, or prepare an action                      |
| Act     | Govern execution   | **Approve Twin's Action** | Human approval authorizes Hermes / capability execution. Twin never gets a direct Act button |

The critical authority boundary is:

```
STORE
User ────────────────► Spine

ASK
Spine + Context ─────► Twin ─────► Insight

ASSIGN
User ────────────────► Twin ─────► Proposal

APPROVE
Human ───────────────► Governance ─────► Hermes ─────► Capability
```

The fourth button is deliberately **Approve Twin's Action** — not Run Twin, not Execute, not Automate. That is what preserves the doctrine.

> **Truth you own. AI you rent. Approval in between.**

---

## 1. Signup and Tenant Activation

The IntegrateWise lifecycle begins when an organization creates a workspace. The platform establishes:

- Organization
- Tenant
- Workspace
- Users
- Departments
- Roles
- Identity
- Entitlements

This creates the initial tenant boundary. No operational workspace is assumed yet. The tenant must first be configured and connected.

---

## 2. Configuration Manager

### Define how the organization operates.

Configuration Manager owns the compiled operating configuration of the tenant. It defines:

**Organization Structure** — Departments, teams, roles, personas, scopes, and user relationships.

**Infrastructure Choices** — Spine provider, cache provider, blob storage, memory infrastructure, event infrastructure, and supported runtime providers.

**AI Choices** — Model providers, preferred models, embedding providers, reasoning policy, fallback models, and AI runtime rules.

**Memory Policy** — User Memory, Work Memory, Organization Memory, Twin Memory, retention and promotion rules.

**Governance Policy** — Authority, risk levels, approval requirements, evidence requirements, capability restrictions.

**Sync Policy** — Immediate, deferred, scheduled, batch, event-driven, reconciliation.

**Composition Policy** — Which fields, data, memories, and capabilities are relevant to each role and department.

Configuration Manager produces the **Compiled Tenant Config**. The platform runtime is driven by configuration. Infrastructure remains provider-configurable behind stable IntegrateWise contracts. Configuration Manager does not connect systems or execute capabilities — it defines how the organization operates.

---

## 3. Integration Manager — Four Connection Paths

### Connect the organization's operating ecosystem.

IntegrateWise does not treat every connection as an API integration. Different systems expose different operating contracts. IntegrateWise preserves those differences through four distinct paths.

| Path              | Purpose                                                  | Contract                        |
| ----------------- | -------------------------------------------------------- | ------------------------------- |
| **MCP**           | Tool / resource discovery and invocation                 | Tool protocol                   |
| **AI Connector**  | Connect models and AI runtimes                           | Intelligence provider contract  |
| **API Connector** | Connect external SaaS / system APIs                      | Provider integration contract   |
| **API Wrapper**   | Convert an API / function into an IW-governed capability | Capability abstraction contract |

### MCP — Tool Protocol

Connects tool and resource protocols. Discovers available tools, resources, prompts, and schemas from an MCP server and invokes them through a governed MCP execution path. MCP connects **tools**.

### AI Connector — Intelligence Provider Contract

Connects intelligence providers and AI runtimes. Provides access to models, embeddings, reasoning systems, multimodal intelligence, and specialized AI services through a model-agnostic provider contract. AI Connector connects **intelligence**. No model owns canonical operational truth.

### API Connector — Provider Integration Contract

Connects operational systems. Owns provider authentication, OAuth lifecycle, provider schemas, objects, fields, events, reads, writes, webhooks, cursors, checkpoints, incremental hydration, and synchronization. API Connector connects **systems**.

### API Wrapper — Capability Abstraction Contract

Converts an existing callable operation into an IntegrateWise capability. The source may be an API endpoint, an internal service, a serverless function, a workflow, a legacy operation, or a private enterprise service. The wrapper defines intent, inputs, outputs, authority, evidence requirements, execution mode, risk, and governance policy. API Wrapper creates **capabilities**.

### The Four-Path Law

**API Connectors connect systems. MCP connects tools. AI Connectors connect intelligence. API Wrappers create capabilities.**

Four paths. Four contracts. One governed platform.

All four become available to the wider Capability Fabric, but they do not enter it through the same lifecycle or contract.

---

## 4. Activation Bridge

### Compile the tenant into an active operational workspace.

Activation Bridge combines Compiled Tenant Configuration + Connected Ecosystem + Organization Structure + User Identity + Department + Role + Available Data + Available Capabilities + Governance Policy.

The Activation Bridge resolves: Role, Department, Connected systems, Available tool categories, Relevant entities, Required fields, Data composition rules, Memory scopes, Authorized capabilities, AI runtime, Sync policy, and Governance boundaries.

It produces the **Active Workspace Definition**. Activation then begins hydration in three stages:

**Instant Hydration** — Identity, Configuration, Roles, Connections, Available capabilities, Hot context.

**Operational Hydration** — Active entities, Current records, Recent activity, Current work, Open tasks, Operational relationships.

**Historical Hydration** — Historical records, Documents, Past decisions, Long-term activity, Historical relationships, Organizational knowledge.

The workspace becomes useful immediately and deepens continuously.

---

## 5. Common Connected Surface, Creamy Load, Delta Load, and Spine Networking

### The Common Connected Surface

IntegrateWise does not present each connected tool as an isolated integration. The platform creates a **Common Connected Surface** across every connected category:

```
CRM · Support · Communication · Billing · Product · Projects
Finance · Engineering · Hiring · Legal · Marketing · Operations
Files · AI systems · MCP tools · Internal services · Knowledge bases
```

Each system retains its provider boundary. IntegrateWise creates a shared operational layer across them. The surface allows data and context from multiple tools to participate in the same operational work — without forcing the user to manually reconstruct relationships across systems.

### Creamy Load — Build the Initial Connected State

Creamy Load is the first deep hydration of the connected ecosystem. It discovers, retrieves, normalizes, relates, and prepares connected data for operational use.

```
DISCOVER      Inspect schemas, objects, fields, resources, events, access patterns
     ↓
SELECT        Apply tenant config, role rules, composition rules, entity priorities, data policy
     ↓
EXTRACT       Retrieve selected operational data from connected systems
     ↓
PARSE         Mechanically understand provider-specific payloads
     ↓
NORMALIZE     Convert provider structures into IW canonical primitives
     ↓
SYNTHESIZE    Resolve semantic meaning · identify entities · map fields · detect relationships
     ↓
RELATE        Build operational relationships across tools
              Account ↔ Tickets · Account ↔ Invoices · Account ↔ Product Usage
              Account ↔ Conversations · Account ↔ Projects · Account ↔ Decisions
              Candidate ↔ Interview · Deal ↔ Communication · Invoice ↔ Expense
     ↓
GOVERN        Apply scope, memory scope, retention, authority, promotion policy
     ↓
PROMOTE       Promote approved operational state into the Adaptive Spine
     ↓
HYDRATE       Build Spine Cache, Entity 360, continuity bundles, Workbench surfaces
```

**Creamy Load = Deep Initial Context Formation.** The goal is not to copy every connected database — the goal is to create enough normalized and related operational state for the organization to begin working from IntegrateWise.

### Delta Load — Continuously Absorb What Changed

After Creamy Load establishes the initial operational state, connected systems move into Delta Load. Delta Load processes only new or changed operational information.

Delta signals may originate from:

```
Webhooks · Provider events · Change data capture · Polling
Incremental APIs · Updated timestamps · Cursor-based APIs
MCP resource changes · File changes · Local Workbench mutations
Agent outcomes · Tool-to-tool actions
```

```
DETECT CHANGE
     ↓
CAPTURE DELTA
     ↓
RESOLVE SOURCE AND ENTITY
     ↓
PARSE → NORMALIZE → SYNTHESIZE
     ↓
COMPARE WITH SPINE STATE
     ↓
GOVERN → PROMOTE OR QUEUE
     ↓
INVALIDATE / REFRESH CACHE
     ↓
REHYDRATE ACTIVE CONTEXT
```

**Creamy Load builds continuity. Delta Load maintains continuity.**

### Spine Networking — The Network Effect

IntegrateWise changes the integration topology. Without a continuity layer, organizations create point-to-point integration complexity — every new system increases integration proportional to N × M. IntegrateWise replaces that with a governed canonical context network:

```
POINT-TO-POINT
Tool A ↔ Tool B
Tool A ↔ Tool C
Tool B ↔ Tool C
Tool C ↔ Tool D

        N × (N - 1)
        integration relationships


INTEGRATEWISE
Tool A ─┐
Tool B ─┤
Tool C ─┼──► IW CONNECTED SURFACE / SPINE NETWORK
Tool D ─┤
Tool E ─┘

        N provider connections
        +
        governed capability routes
```

The Spine is not an ESB routing hub. It is the canonical context and continuity network.

> **Tools connect once to IntegrateWise. Canonical entities and governed context become reusable across every authorized Workbench, Twin, agent, and capability.**

The Spine network enables:

```
Cross-tool entity resolution
Cross-tool field composition
Cross-tool context retrieval
Cross-tool capability execution
Cross-tool event propagation
Cross-tool synchronization
Cross-tool memory
Cross-tool continuity
```

The Spine does not blindly replicate every field to every system. It understands:

| Spine Discipline     | Meaning                                                             |
| -------------------- | ------------------------------------------------------------------- |
| **Source Ownership** | Which system owns the authoritative source field                    |
| **Canonical State**  | What operational truth IntegrateWise currently understands          |
| **Consumer Scope**   | Which Workbench / Twin / agent / capability / system may consume it |
| **Write Authority**  | Which system or capability may change the state                     |
| **Sync Policy**      | When a resulting mutation should return to a connected source       |

### Data Sharing Between Tools

A connected tool does not automatically receive unrestricted access to every other tool's data. Sharing is resolved through the Spine network and governance policy. Data sharing is contextual, governed, traceable, and bidirectional when authorized.

### The Common Connected Surface Formula

```
CONNECTED SYSTEMS + CREAMY LOAD + DELTA LOAD + ADAPTIVE SPINE
+ SPINE NETWORKING + GOVERNED DATA SHARING + CAPABILITY FABRIC
= COMMON CONNECTED SURFACE
```

> **One connected ecosystem. One Spine network. Many role-aware Workbenches.**

---

## 6. Normalized Data and Memory Pipeline

Connected operational data enters the IntegrateWise pipeline:

```
CONNECT → CAPTURE → PARSE → NORMALIZE → SYNTHESIZE → GOVERN → PROMOTE → HYDRATE
```

Provider-specific data becomes operational continuity.

---

## 7. Adaptive Spine

### Canonical operational truth.

The Adaptive Spine owns: Entities, Canonical fields, Relationships, Operational state, Lifecycle state, Work state, Decisions, Approved outcomes, Evidence references, Continuity state.

**NO MODEL OWNS CANONICAL TRUTH.**

**NO AGENT WRITES DIRECTLY TO THE SPINE.**

Changes reach canonical state through governed promotion.

---

## 8. The IW State Planes

IntegrateWise separates state according to semantic ownership.

| Plane                 | Ownership                                                                           |
| --------------------- | ----------------------------------------------------------------------------------- |
| **Adaptive Spine**    | Canonical operational truth                                                         |
| **Spine Cache**       | Disposable acceleration state — Hot Entity 360, Hydration Views, Context Bundles    |
| **Twin Memory**       | Durable AI and user continuity — Preferences, Learned context, Memory summaries     |
| **Twin Session Logs** | Interaction history — Conversations, Tool calls, Session state, Context lifecycle   |
| **Twin Audit Logs**   | AI accountability — Intent, Model identity, Policy decisions, Approval lineage      |
| **Knowledge**         | Semantic retrieval — Document chunks, Embeddings, Semantic indexes, Graph context   |
| **Blobs**             | Binary and raw artifacts — Files, Attachments, Evidence, Exports                    |
| **Sync State**        | Convergence progress — Cursors, Checkpoints, Pending mutations, DLQ, Conflict state |
| **Config State**      | Tenant runtime choices — Compiled configuration, Composition rules, Policies        |
| **Ephemeral Runtime** | Temporary coordination — Locks, Leases, Rate limits, Agent scratch state            |

Identity and Secrets, Telemetry, Queues, Events, Billing, Entitlements, Deployment, and Platform Administration operate as cross-cutting infrastructure planes.

---

## 9. Continuity Bridge

### Deliver active context to the current runtime.

The Continuity Bridge is different from the Activation Bridge. Activation Bridge compiles and activates the workspace. Continuity Bridge continuously delivers the relevant context bundle to the active user, Workbench, Twin, agent, or capability runtime.

The Continuity Bridge resolves: User Memory, Work Memory, Organization Memory, Twin Memory, Active entities, Relevant relationships, Recent decisions, Current work state, Available evidence, Relevant knowledge, Capability context.

It produces the **Active Context Bundle**. The context bundle moves with the work. No model switch should begin cold. No workspace switch should require reconstructing operational history manually.

---

## 10. The Twin — Always Present, Always Contextual

### A continuous AI work partner that never needs to be told what is happening.

The Twin is not a chatbot the user opens when they need help. The Twin is a persistent, ambient presence embedded in the Workbench surface. The Twin is always running. The Twin is always watching. The Twin always has context.

**The user never gives the Twin data. The user never provides context. The user never explains what they are looking at, what account they are reviewing, what deal they are working on, or what problem they are solving. The Twin already knows.**

Every user action on the Workbench — every field viewed, every record opened, every filter applied, every data point hovered, every capability invoked, every note written, every decision made — is observed by the Twin in real time. The Twin maintains a continuous understanding of:

- What the user is currently looking at
- What the user just did
- What the user is likely to do next
- What changed since the user last worked on this entity
- What memory and evidence are relevant to the current context
- What other entities, tools, and data are connected to the current work
- What risks, opportunities, and patterns exist in the current view
- What the user's history, preferences, and working style suggest

The Twin operates with:

- Active workspace context
- Continuity Bridge context
- Twin Memory
- Relevant Spine state
- Knowledge retrieval
- Available capabilities
- Governance boundaries

### The Twin Always Knows Because the Platform Always Feeds It

The Continuity Bridge delivers a new Active Context Bundle every time the user's focus changes. When a CSM opens an account, the Twin immediately has:

- The full entity relationship graph
- The recent support tickets
- The product usage deltas
- The billing and renewal state
- The communication history
- The project milestones
- The previous decisions about this account
- The user's past actions on similar accounts
- The organizational memory about this account
- The evidence and documents related to renewal

The user does not provide any of this. The Twin receives it automatically through the Continuity Bridge, which is fed by the Adaptive Spine, which is fed by the Data Pipeline, which is fed by the four connection paths.

**The context chain is:**

```
CONNECTED TOOLS
     ↓ (Creamy Load + Delta Load)
ADAPTIVE SPINE
     ↓ (Spine Cache + Knowledge)
CONTINUITY BRIDGE
     ↓ (Active Context Bundle)
WORKBENCH SURFACE
     ↓ (User action observation)
TWIN RUNTIME
     ↓ (Reasoning + Memory + Knowledge)
SUGGESTION / PROPOSAL / INSIGHT
```

**At no point does the user enter the loop as a context provider. The user is the decision-maker, not the data transporter.**

### The Twin Suggests Before Being Asked

Because the Twin is always observing and always contextually fed, it does not wait for the user to click "Ask Your Twin." The Twin proactively surfaces:

**Next-Best-Actions** — Based on the current entity state, the user's role, the OODA phase, and the organizational memory, the Twin suggests what the user should do next.

**Risk Alerts** — When the Twin detects a pattern that suggests risk — a renewal at risk, a support escalation trend, a billing anomaly, a project delay, a candidate dropout signal — it surfaces the alert on the Workbench before the user asks.

**Opportunity Signals** — When the Twin detects an expansion opportunity, an upsell signal, a cross-sell pattern, a process improvement, or an operational efficiency gain, it surfaces the suggestion.

**Contextual Insights** — When the user is reviewing a record, the Twin automatically surfaces relevant memory, historical decisions, related entity changes, and cross-tool context that the user would otherwise need to manually retrieve.

**Draft Completions** — When the user begins typing a note, composing a message, drafting a document, or preparing a proposal, the Twin can suggest completions, templates, or drafts based on the user's history, the entity context, and the organizational knowledge.

**Capability Recommendations** — When the Twin detects that a capability the user is authorized to perform would be valuable in the current context — updating a field, sending a message, creating a ticket, scheduling a meeting, generating a report — it recommends the capability with the pre-filled context.

### The Twin Proactively Does Not Act

The Twin suggests. The Twin proposes. The Twin drafts. The Twin does not execute without human approval. The Twin's proactive behavior is always in the **Orient** and **Decide** phases of OODA. It surfaces context and proposes action. The **Act** step remains the user's via "Approve Twin's Action."

```
TWIN OBSERVES user behavior in real time
     ↓
TWIN UNDERSTANDS current context from Continuity Bridge
     ↓
TWIN RETRIEVES relevant memory, knowledge, evidence, relationships
     ↓
TWIN SUGGESTS next-best-action, risk alert, opportunity, or insight
     ↓
USER SEES suggestion on Workbench surface
     ↓
USER DECIDES
     ↓
  ┌──────────────┐
  │ IGNORE       │ → Twin learns, adjusts future suggestions
  │ ASK TWIN     │ → Twin provides deeper analysis
  │ ASSIGN TWIN  │ → Twin prepares full proposal with execution plan
  │ APPROVE      │ → Twin's proposed action executes through Governance → Hermes
  └──────────────┘
```

### The Three Companion Stores

| Store               | Contents                                                                                                                                    |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Twin Memory**     | Durable AI continuity, user preferences, learned context, what the user cares about, how the user works, what patterns the user responds to |
| **Session Logs**    | Conversations, tool calls, session state, context lifecycle, what was suggested and what was done                                           |
| **Twin Audit Logs** | Model / agent identity, intent, policy decision, approval lineage, full accountability trail                                                |

AI Connectors feed intelligence into Twin, Specialist Agents, Hermes AI Tasks, and Synthesis / Embedding / Reasoning. Models remain replaceable. Continuity persists outside the model.

The Twin does not own canonical truth. The Twin does not bypass governance. The Twin proposes action. But the Twin never starts cold, never asks for context, and never waits to be told what is happening.

---

## 11. The User Workbench — Every Tool Category, Every Functionality, One Surface

### The operational hub of every department.

The User Workbench is not a dashboard that shows data from other tools. The User Workbench **is the tool**. Every action a user would perform inside a connected system — updating a field, sending a message, creating a record, moving a card, approving a request, generating a report, scheduling a meeting, assigning a task, writing a note, processing a payment, resolving a ticket, pushing code, publishing content — is available as a composed capability on the Workbench surface.

**The user never leaves the Workbench to do work in another tool. The Workbench reaches into every connected system and executes on the user's behalf.**

Every department works across a different combination of tools, data, memory, and workflows. IntegrateWise composes them into a role-aware User Workbench.

### Every Tool Category Is Represented

#### CRM / Sales

**Connected Tools:** Salesforce, HubSpot, Pipedrive, Close, Zoho CRM, and any CRM via API Connector.

**Workbench Capabilities — Executed Without Leaving the Workbench:**

- View and update opportunity fields (stage, amount, close date, owner, probability)
- Create and update contacts, accounts, and leads
- Log calls, meetings, and activities
- Send emails directly from the Workbench (synced back to CRM automatically)
- Move deals through pipeline stages
- Update forecast categories
- Create and assign tasks
- View deal history, stage duration, and velocity
- Access relationship maps and engagement scoring
- Generate proposals and quotes using Twin-drafted content
- Trigger sequences and cadences
- Update custom fields defined in the CRM schema
- Merge duplicate records
- Assign or reassign ownership
- View competitor and product line associations

**The Workbench reads and writes to Salesforce without opening Salesforce.** The API Connector handles authentication, schema mapping, and bidirectional sync. The user sees a composed field view and performs actions. The sync engine converges with the CRM according to policy.

**Twin Behavior:**

- Surfaces renewal risk when deal stage stalls beyond normal duration
- Suggests next-best-action based on deal stage, competitor presence, and historical win patterns
- Drafts follow-up emails using communication history and deal context
- Alerts when a contact changes role or company
- Proposes stage updates based on activity signals
- Recommends when to escalate to a manager based on deal size and risk

#### Customer Success

**Connected Tools:** Gainsight, ChurnZero, Totango, Planhat, Vitally, and any CS platform via API Connector.

**Workbench Capabilities:**

- View and update health scores
- Manage renewal pipeline and forecast
- Track adoption metrics and feature usage
- Create and manage success plans
- Log QBR notes and action items
- Assign risk alerts and playbooks
- Update lifecycle stages
- Trigger interventions (email, call, escalation)
- View NPS / CSAT scores and trends
- Track expansion and upsell signals
- Manage portfolios and account segments
- Create and manage CTA (calls to action)

**Twin Behavior:**

- Auto-generates QBR decks from cross-tool context (CRM + Support + Product + Billing)
- Predicts churn risk based on usage decline, support sentiment, and communication gaps
- Suggests intervention playbooks based on similar account patterns
- Drafts renewal conversations using relationship history
- Surfaces feature adoption gaps that correlate with churn

#### Support

**Connected Tools:** Zendesk, Intercom, Freshdesk, Front, Help Scout, Jira Service Management, and any support platform via API Connector.

**Workbench Capabilities:**

- View, update, and resolve tickets
- Respond to tickets with Twin-drafted replies
- Escalate tickets and assign to specialists
- Create internal notes and public responses
- Update ticket priority, status, category, and tags
- Merge, split, and link tickets
- View customer context alongside the ticket (CRM account, billing, product usage)
- Trigger macros and automations
- Manage SLA tracking and breach alerts
- Access and insert canned responses
- Create follow-up tasks
- View ticket history and resolution patterns

**The user handles support tickets alongside the account context, billing state, product usage, and communication history — all on one Workbench surface.**

**Twin Behavior:**

- Suggests ticket responses based on similar resolved tickets and knowledge base content
- Surfaces relevant documentation and runbooks for the current issue
- Detects escalation signals from sentiment analysis
- Recommends ticket priority changes based on account value and SLA risk
- Drafts internal summaries for escalated tickets
- Identifies recurring issues that should become product feedback

#### Communication

**Connected Tools:** Slack, Microsoft Teams, Email (Gmail, Outlook), SMS, WhatsApp Business, and any messaging via API Connector or MCP.

**Workbench Capabilities:**

- Send and receive messages directly from the Workbench
- Compose and schedule emails
- Send Slack messages to channels or individuals
- View communication history across all channels for an entity
- Create Slack channels or Teams conversations for cross-functional work
- Share documents and context directly from the Workbench
- Set up notifications and alerts
- Archive and search across communication history
- Reply to email threads
- Forward context and summaries to stakeholders

**Communication is not a separate tool the user opens. Communication is an action available on the Workbench. The user composes and sends from the same surface where they review account context.**

**Twin Behavior:**

- Drafts communication based on the entity context, the user's voice, and the history of interactions
- Suggests when to send a message based on engagement patterns
- Surfaces the best channel for reaching a contact based on response history
- Summarizes long email threads or Slack conversations
- Recommends escalation communication when risk is detected

#### Billing / Finance

**Connected Tools:** Stripe, Chargebee, Recurly, QuickBooks, Xero, NetSuite, Zuora, and any billing/finance platform via API Connector.

**Workbench Capabilities:**

- View invoices, payments, and billing history
- Process refunds and credits
- Update subscription plans and quantities
- View revenue metrics (MRR, ARR, churn, expansion)
- Manage payment methods and billing contacts
- Create and send invoices
- Track overdue payments and send reminders
- View expense records and categorize transactions
- Generate financial summaries
- Reconcile billing with CRM opportunity data
- View billing context alongside account and product data
- Manage subscription lifecycle (trial, active, paused, cancelled)

**Twin Behavior:**

- Surfaces billing anomalies (unexpected churn, payment failures, downgrade signals)
- Suggests renewal pricing based on usage trends and comparable accounts
- Drafts payment reminder emails with context about the account relationship
- Recommends plan changes based on usage patterns
- Alerts when revenue at risk exceeds configured thresholds
- Correlates billing changes with support activity and product usage

#### Product

**Connected Tools:** Productboard, Aha!, Linear, Jira, Notion, Confluence, Amplitude, Mixpanel, FullStory, and any product tool via API Connector or MCP.

**Workbench Capabilities:**

- View feature requests linked to customer accounts
- Track product roadmap alongside customer context
- View product usage analytics for specific accounts
- Create and update feature requests
- Link support tickets to product issues
- View release notes and changelog
- Track experiment results
- Access product health dashboards
- Submit and prioritize bugs
- View customer feedback aggregated across tools
- Map product usage to account health and renewal risk

**Twin Behavior:**

- Surfaces feature requests that correlate with churn risk
- Recommends which product feedback to escalate based on revenue impact
- Suggests product updates to communicate to specific account segments
- Identifies usage patterns that predict expansion or contraction
- Drafts product update communications for CSMs to share with accounts

#### Engineering

**Connected Tools:** GitHub, GitLab, Bitbucket, Linear, Jira, PagerDuty, Datadog, Sentry, and any engineering tool via API Connector or MCP.

**Workbench Capabilities:**

- View pull requests, issues, and deployments linked to customer context
- Track incident status and impact on affected accounts
- View code review status
- Create and update issues directly from the Workbench
- Link customer-reported bugs to engineering tickets
- View deployment history and release status
- Track on-call schedules and incident response
- Access error rates and performance metrics for customer-facing services
- View sprint progress alongside customer commitments

**Twin Behavior:**

- Surfaces engineering issues that affect at-risk accounts
- Correlates incident reports with support ticket spikes
- Drafts customer-facing incident communications
- Recommends which bugs to prioritize based on customer revenue impact
- Surfaces deployment risks before they affect production

#### Marketing

**Connected Tools:** Mailchimp, HubSpot Marketing, ActiveCampaign, Google Ads, Meta Ads, LinkedIn Ads, Webflow, WordPress, and any marketing platform via API Connector.

**Workbench Capabilities:**

- View campaign performance alongside customer context
- Track lead source and attribution
- Manage email campaigns and sequences
- View social media performance
- Create and update content
- Track SEO performance
- Manage ad campaigns and budgets
- View marketing-qualified leads and conversion metrics
- Coordinate content with sales and CS for account-based marketing
- Track brand mentions and sentiment

**Twin Behavior:**

- Suggests content topics based on support trends and product feedback
- Recommends campaign targeting based on account segmentation
- Drafts marketing copy using brand voice and historical performance
- Surfaces underperforming campaigns and recommends adjustments
- Identifies customer stories and case study candidates from account data

#### Finance

**Connected Tools:** QuickBooks, Xero, NetSuite, Brex, Ramp, Expensify, Bill.com, and any finance platform via API Connector.

**Workbench Capabilities:**

- View financial statements and summaries
- Process and approve expenses
- Manage accounts payable and receivable
- Track budget vs. actuals
- View cash flow projections
- Reconcile transactions
- Generate financial reports
- Manage vendor relationships and contracts
- Track runway and burn rate
- View departmental spend

**Twin Behavior:**

- Surfaces cash flow risks and unusual spend patterns
- Suggests budget reallocations based on departmental performance
- Drafts vendor negotiation talking points based on contract history
- Alerts when expenses exceed category thresholds
- Correlates revenue trends with operational costs

#### Hiring / People

**Connected Tools:** Lever, Greenhouse, Ashby, BambooHR, Gusto, Rippling, Workday, and any HR/ATS platform via API Connector.

**Workbench Capabilities:**

- View candidate pipeline and stage progression
- Schedule interviews and manage calendar
- Review candidate profiles and feedback
- Send offer letters and manage negotiation
- Track onboarding progress
- View team structure and org chart
- Manage PTO and time-off requests
- View compensation benchmarks
- Track hiring metrics (time-to-fill, source effectiveness)
- Manage employee records and updates

**Twin Behavior:**

- Suggests candidate outreach based on role requirements and market data
- Drafts offer letters using compensation policy and candidate context
- Surfaces candidates at risk of dropping out based on communication gaps
- Recommends interview questions based on role and candidate background
- Identifies hiring bottlenecks in the pipeline

#### Operations / Legal

**Connected Tools:** DocuSign, Ironclad, Juro, Notion, Confluence, internal tools via API Wrapper, and any system via MCP.

**Workbench Capabilities:**

- View and manage contracts in progress
- Send documents for signature
- Track contract renewal dates and obligations
- Manage vendor agreements
- Review compliance status
- Track internal approvals and policy changes
- Manage SaaS vendor inventory and spend
- View audit trails and governance logs
- Handle NDA and DPA workflows

**Twin Behavior:**

- Surfaces upcoming contract renewals and suggests negotiation strategy
- Drafts contract summaries and risk assessments
- Alerts when vendor contracts auto-renew without review
- Recommends compliance actions based on regulatory changes
- Identifies SaaS spend optimization opportunities

#### Business Intelligence

**Connected Tools:** Looker, Metabase, Tableau, Mode, BigQuery, Snowflake, and any BI platform via API Connector or MCP.

**Workbench Capabilities:**

- View dashboards and reports composed from cross-tool data
- Create and share ad-hoc queries
- Track KPIs across departments
- Generate executive summaries
- Export data and visualizations
- Set up automated reporting
- Drill into entity-level detail from aggregate views

**Twin Behavior:**

- Generates narrative summaries of dashboards and metrics
- Surfaces anomalies and trends in cross-departmental data
- Suggests new metrics based on business goals
- Drafts board-ready and investor-ready reports
- Correlates operational metrics with strategic outcomes

#### Internal Comms / Decisions / OKRs

**Connected Tools:** Notion, Confluence, Loom, internal decision logs, and any knowledge system via API Connector or MCP.

**Workbench Capabilities:**

- Log decisions with evidence and authority
- Track OKR progress across departments
- Create and share meeting notes
- Manage internal announcements
- Track action items and commitments
- Maintain decision history and rationale
- Create and manage runbooks and playbooks

**Twin Behavior:**

- Drafts meeting summaries from session context
- Surfaces decisions that may need revisiting based on changed conditions
- Tracks OKR alignment across departments
- Suggests OKR adjustments based on performance data
- Maintains organizational memory about why past decisions were made

#### Knowledge / Wiki

**Connected Tools:** Notion, Confluence, Guru, Tettra, Slite, Google Docs, and any knowledge base via API Connector or MCP.

**Workbench Capabilities:**

- Search across all organizational knowledge
- Create and update documentation
- Link knowledge entries to entities and capabilities
- Manage runbooks and playbooks
- Track documentation freshness
- Surface relevant knowledge in the current context

**Twin Behavior:**

- Automatically surfaces relevant knowledge entries based on the current entity and user action
- Suggests documentation updates when processes change
- Identifies knowledge gaps based on recurring questions
- Drafts knowledge articles from resolved support tickets and past decisions

#### Fundraising / Investor Relations

**Connected Tools:** Affinity, Visible.vc, Carta, AngelList, internal dataroom, and any IR tool via API Connector.

**Workbench Capabilities:**

- Manage investor CRM and relationship pipeline
- Track fundraising milestones and commitments
- Generate investor updates from operational data
- Manage dataroom access and document sharing
- Track cap table and equity events
- Prepare board materials from cross-departmental data

**Twin Behavior:**

- Drafts investor updates from revenue, product, and operational metrics
- Surfaces investor engagement signals
- Recommends investor outreach timing and content
- Generates board deck narratives from platform data
- Tracks investor communication cadence and relationship health

### The Workbench Is the Tool

**In every category above, the pattern is the same:**

1. The user opens their Workbench
2. Fields, data, memory, and capabilities from all connected tools are composed on one surface
3. The user performs actions — reading, writing, updating, communicating, approving — without leaving the Workbench
4. Every action executes through the Capability Fabric into the connected system
5. Every outcome flows through the Continuity Pipeline back to the Spine
6. The Workbench rehydrates with updated state
7. The Twin observes every action and suggests the next one

**The user never opens Salesforce to update an opportunity.**
**The user never opens Zendesk to respond to a ticket.**
**The user never opens Slack to send a message.**
**The user never opens Stripe to process a refund.**
**The user never opens Jira to create an issue.**
**The user never opens Gmail to send an email.**
**The user never opens QuickBooks to review a transaction.**

**The Workbench is the operating surface. Every connected tool is a backend that the Workbench reaches into through governed capabilities.**

### Customer Zero — One User, Every Walk, Every Day

The discipline started at home. Customer Zero is the IntegrateWise team itself running the company on the platform. A Customer Zero founder touches every category in a single day, with no team to delegate to.

No functional teams. No department walls. Just one founder, one company, every walk of work, every day.

A department hub in a larger org covers a subset of those walks with role-based depth. A **CSM Workbench** = Account Success + Support + Billing + Product Usage + Communication. A **Finance Workbench** = Billing + Vendors + Subscriptions + Cash + Compliance. A **Founder Workbench** = all of the above, hydrated by whichever walk is active today.

The Workbench pattern is the same. The composition is what changes.

### Composition Sources

```
CRM Tools        Billing Tools      Product Tools
Support Tools    Communication     Project Tools
Engineering      Finance           Hiring Tools
Legal & Comp.    Knowledge/Wiki    Fundraising / IR
Files            AI systems        MCP tools
Internal services · Functions · Agents
═══════════════════════════════════════════════
            NORMALIZED PIPELINE
        (Creamy Load + Delta Load + AI Enrichment)
═══════════════════════════════════════════════
            ADAPTIVE SPINE
═══════════════════════════════════════════════
   ROLE  +  DEPARTMENT  +  ACTIVE CONTEXT
        +  POLICY  +  MEMORY SCOPE
═══════════════════════════════════════════════
   FIELD COMPOSITION  +  CAPABILITY COMPOSITION
═══════════════════════════════════════════════
            USER WORKBENCH
```

### Capabilities and Sync

Capabilities may execute:

- **Locally** against Workbench state and Spine — recorded immediately, synchronized later by policy
- **Directly** through provider APIs / MCP / API Wrapper — execute against the source system, return outcome into the continuity pipeline
- **Hybrid / Deferred** — combine local and API execution; converge on the configured schedule

Different capabilities have different sync contracts. The capability definition — not the UI — decides.

> Work now. Synchronize by policy. Preserve continuity always.

---

## 12. Capability Fabric

### Resolve how work can be performed.

User intent or Twin intent enters the Capability Fabric. The Capability Fabric identifies available execution possibilities.

| Path                       | Purpose                                                                                                    |
| -------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Tool → Tool**            | Move, transform, enrich, or coordinate information between tools                                           |
| **Memory Fetch**           | Retrieve relevant operational or continuity memory                                                         |
| **MCP Invocation**         | Invoke a discovered MCP tool or resource through its protocol contract                                     |
| **Agent → Agent**          | Delegate specialized work between Twins, agents, or domain workers                                         |
| **API Connector Action**   | Read or write through an established operational system connection                                         |
| **API Wrapper Capability** | Invoke an IW capability created around an endpoint, function, service, or workflow                         |
| **Local Execution**        | Perform a capability against local Workbench or runtime state                                              |
| **AI Execution**           | Use an AI Connector for reasoning, synthesis, embeddings, multimodal analysis, or specialized intelligence |

The Capability Registry describes: Capability identity, Intent, Input schema, Output schema, Authority, Risk, Evidence requirements, Execution mode, Sync mode, Provider dependency.

The Capability Fabric answers: **HOW CAN THIS INTENT BE PERFORMED?** It does not decide whether the action is authorized. That belongs to Governance.

---

## 13. Governance Engine

### Determine whether work may be performed.

Governance evaluates: Policy, Authority, Evidence, Risk, Scope, Approval.

Three outcomes:

```
ALLOW · DENY · REQUIRE APPROVAL
```

**No agent writes directly to the Spine.** All Spine mutations flow through approved capability execution and the Continuity Pipeline.

**Approval is the boundary between AI intent and governed action.**

---

## 14. Hermes

### The execution orchestrator.

After authorization, Hermes coordinates execution:

```
Resolve Capability → Select Runtime → Bind Context → Execute
Coordinate Tools → Coordinate Agents → Observe → Retry → Reconcile
```

Hermes **preserves intent + authority + context + execution lineage**. Hermes is the orchestrator. It is not canonical memory.

---

## 15. Execution Paths

An approved capability may execute through different runtime paths:

**Local Execution** — Against local Workbench or platform state. Pending mutation for later synchronization.

**API Connector Execution** — Directly against a connected operational system. Provider immediately updated.

**MCP Execution** — A governed MCP tool invoked using its discovered tool contract.

**API Wrapper Execution** — The wrapped endpoint, function, workflow, or service.

**AI Execution** — An AI Connector provides model or intelligence capability.

**Agent-to-Agent Execution** — Context and delegated intent move between authorized agents.

**Tool-to-Tool Execution** — Cross-system workflow or transformation.

Execution mode and synchronization mode are independent.

---

## 16. Sync Engine

### Systems converge according to policy.

```
Immediate · Deferred · Batch · Scheduled · Event-Driven · Reconciliation
Full Sync · Delta Sync · Continuous Sync
Cursors · Checkpoints · Pending Mutations · Retry · DLQ · Conflict State
```

A user may perform work locally. The connected provider may synchronize later according to policy.

**WORK NOW. CONVERGE BY POLICY.**

---

## 17. Continuity Pipeline

Every governed execution produces an outcome event.

```
INTENT → ACTION → EVIDENCE → AUTHORITY → OUTCOME → STATE → MEMORY
                    ↓
              PROMOTE TO SPINE
```

The Continuity Pipeline evaluates the resulting state and promotes canonical operational truth into the Adaptive Spine. Twin Memory is updated. Session history remains in Session Logs. Accountability remains in Audit Logs. Files remain in Blobs. Semantic representations are updated in Knowledge. Caches are refreshed. Sync state is advanced.

---

## 18. Workbench Rehydration and the Next OODA Loop

The updated Spine state flows into the hydration system. Spine Cache refreshes. Entity views update. Continuity context updates. The Continuity Bridge produces a new active context bundle. The User Workbench rehydrates. The Twin receives the updated context.

The next OODA loop begins.

```
OBSERVE → ORIENT → DECIDE → ACT → REMEMBER → REHYDRATE → REPEAT
```

Each loop begins with more continuity than the previous loop.

---

## The Data Continuity Loop

```
CONNECT          establish the source relationship
     ↓
CREAMY LOAD      build initial normalized and related operational state
     ↓
SPINE NETWORK    create cross-tool entity and context continuity
     ↓
COMPOSE          build the Common Connected Surface and role-aware Workbench
     ↓
WORK             user, Twin, agent, or capability performs operational work
     ↓
EXECUTE          Hermes coordinates authorized execution
     ↓
SYNC             immediate · deferred · scheduled · batch · event-driven · reconciled
     ↓
DELTA LOAD       capture changes from source systems and local execution
     ↓
CONTINUITY       intent → action → evidence → authority → outcome → state → memory
PIPELINE
     ↓
PROMOTE          update canonical operational truth
     ↓
REHYDRATE        refresh caches, context bundles, Twins, Workbenches
     ↓
REPEAT           the connected surface continuously evolves
```

---

## The Platform Planes

| Plane                     | Canonical Responsibility                                                           |
| ------------------------- | ---------------------------------------------------------------------------------- |
| **Configuration Manager** | Defines how the tenant operates                                                    |
| **Integration Manager**   | Connects and discovers the tenant ecosystem                                        |
| **Activation Bridge**     | Compiles configuration + connections + user context into an active workspace       |
| **Pipeline**              | Converts provider activity into canonical operational state                        |
| **Adaptive Spine**        | Owns canonical operational truth and creates the governed context network          |
| **Spine Cache**           | Accelerates hydration and derived views                                            |
| **Knowledge**             | Owns semantic retrieval representations                                            |
| **Blobs**                 | Owns files, raw artifacts, and evidence                                            |
| **User Workbench**        | Department hub composing cross-tool fields, data, memory, and capabilities         |
| **Twin**                  | Reasons, retrieves, plans, delegates, proposes — always present, always contextual |
| **Twin Memory**           | Owns durable AI/user continuity                                                    |
| **Session Logs**          | Own interaction and runtime session history                                        |
| **Twin Audit Logs**       | Own AI accountability and lineage                                                  |
| **Capability Fabric**     | Resolves how an intent can be performed                                            |
| **Governance Engine**     | Resolves whether and under whose authority it may be performed                     |
| **Hermes**                | Orchestrates execution                                                             |
| **Sync Engine**           | Controls system convergence                                                        |
| **Continuity Pipeline**   | Converts outcomes back into persistent operational memory                          |

## Cross-Cutting Infrastructure

| Infrastructure Layer       | Concerns                                                              |
| -------------------------- | --------------------------------------------------------------------- |
| **Identity + Secrets**     | OAuth, API Keys, Service Identity, Delegated Authority, RBAC          |
| **Config State**           | Tenant Config, Provider Selection, Composition Rules, Sync Policy     |
| **Ephemeral Runtime**      | Locks, Leases, Agent Scratch State, Rate Limits, Temporary Context    |
| **Queues + Events**        | Ingestion, Capability Jobs, Agent Jobs, Sync Jobs, Promotion Events   |
| **Observability**          | Metrics, Traces, Errors, Model Usage, Capability Latency, Sync Health |
| **Deployment + Runtime**   | Edge, Workers, Containers, Local Runtime, Regional Compute            |
| **Billing + Entitlements** | Plan, Usage, Model Spend, Capability Access, Limits                   |
| **Admin + Operations**     | Tenant Control, Runtime Health, Replay, DLQ, Policy Inspection        |

---

## The Complete End-to-End Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            INTEGRATEWISE                                    │
│              OPERATIONAL CONTINUITY + GOVERNED INTELLIGENCE                 │
└─────────────────────────────────────────────────────────────────────────────┘

                                  ACTIVATE
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CONFIGURATION MANAGER                               │
│  Tenant Config · Org Config · User Roles · Departments · Infrastructure     │
│  Memory Providers · Model Providers · Storage · Cache · Sync Policy         │
│  Governance Policy · Composition Rules · Capability Policy                  │
│                    COMPILES THE TENANT RUNTIME                              │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          INTEGRATION MANAGER                                │
│   CONNECT                         AUTHENTICATE                    DISCOVER  │
│   SaaS Tools                      OAuth / API Key                 APIs      │
│   Databases                       Service Identity                MCP Tools │
│   Files                           Delegated Authority             Resources │
│   AI Providers                    Provider Tokens                 Schemas   │
│   MCP Servers                                                    Events    │
│   ┌──────────┬───────────────┬───────────────┬──────────────┐               │
│   │ API      │ AI CONNECTOR  │     MCP       │ API WRAPPER  │               │
│   │ CONNECTOR│               │               │              │               │
│   └──────────┴───────────────┴───────────────┴──────────────┘               │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ACTIVATION BRIDGE                                 │
│       CONFIGURATION              CONNECTIONS              USER CONTEXT       │
│             └─────────────────────────┼─────────────────────────┘           │
│                         COMPILE ACTIVE WORKSPACE                            │
│                      Instant → Operational → Historical Hydration            │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            DATA PIPELINE                                    │
│  Creamy Load │ Delta Load │ Continuous Sync │ AI-Enriched Synthesis         │
│  CONNECT → CAPTURE → PARSE → NORMALIZE → SYNTHESIZE → GOVERN → PROMOTE     │
│                                      → HYDRATE                              │
│                     RAW PROVIDER DATA → CANONICAL ENTITY MODEL              │
│                              → CONTINUITY STATE                             │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
                          COMMON CONNECTED SURFACE
                              SPINE NETWORK EFFECT
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ADAPTIVE SPINE                                      │
│                         OPERATIONAL TRUTH                                   │
│ Entities · Relationships · Fields · Decisions · Evidence · Work State       │
│ Lifecycle State · Continuity State · Approved Outcomes                      │
│                     NO MODEL OWNS CANONICAL TRUTH                           │
└───────────────────────────────────┬─────────────────────────────────────────┘
                 ┌──────────────────┼──────────────────┐
                 ▼                  ▼                  ▼
          SPINE CACHE           KNOWLEDGE            BLOBS
          Hot Entity 360       Semantic Index      Documents
          Hydration Views      Embeddings           Attachments
          Context Bundles      Retrieval            Evidence
                 └──────────────────┼──────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ACTIVATION BRIDGE                                   │
│                                                                             │
│       CONFIGURATION              CONNECTIONS              USER CONTEXT       │
│             │                         │                         │             │
│             └─────────────────────────┼─────────────────────────┘             │
│                                       ▼                                     │
│                         COMPILE ACTIVE WORKSPACE                            │
│                                                                             │
│                      Instant → Operational → Historical Hydration            │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CONTINUITY BRIDGE                                   │
│                                                                             │
│               SPINE + CACHE + KNOWLEDGE + USER CONTEXT                      │
│                                      │                                      │
│                                      ▼                                      │
│                         ACTIVE CONTEXT BUNDLE                               │
│                                      │                                      │
│                   USER / WORK / ORG MEMORY SCOPE                            │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          USER WORKBENCH                                     │
│                    HUB OF EVERY DEPARTMENT                                  │
│                                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │   CRM /  │ │ CUSTOMER │ │ SUPPORT  │ │  COMMS   │ │ BILLING  │          │
│  │   SALES  │ │ SUCCESS  │ │          │ │          │ │ FINANCE  │          │
│  │          │ │          │ │ Zendesk  │ │ Slack    │ │          │          │
│  │Salesforce│ │ Gainsight│ │ Intercom │ │ Teams    │ │ Stripe   │          │
│  │ HubSpot  │ │ ChurnZero│ │ Freshdesk│ │ Email    │ │ QuickBooks│         │
│  │ Pipedrive│ │ Planhat  │ │ Front    │ │ SMS      │ │ Xero     │          │
│  │ Close    │ │ Totango  │ │ HelpScout│ │ WhatsApp │ │ NetSuite │          │
│  │          │ │ Vitally  │ │ Jira SM  │ │          │ │ Chargebee│          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ PRODUCT  │ │ENGINEERING│ │MARKETING │ │  HIRING  │ │OPERATIONS│          │
│  │          │ │          │ │          │ │  PEOPLE  │ │  LEGAL   │          │
│  │Productbrd│ │ GitHub   │ │ Mailchimp│ │          │ │          │          │
│  │ Aha!     │ │ GitLab   │ │ HubSpot  │ │ Lever    │ │ DocuSign │          │
│  │ Linear   │ │ Jira     │ │ Active   │ │ Greenhse │ │ Ironclad │          │
│  │ Amplitude│ │ PagerDuty│ │ Campaign │ │ Ashby    │ │ Juro     │          │
│  │ Mixpanel │ │ Datadog  │ │ Google   │ │ BambooHR │ │ Notion   │          │
│  │ FullStory│ │ Sentry   │ │ Ads      │ │ Gusto    │ │ Confluence│         │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐                       │
│  │   BI     │ │ INTERNAL │ │KNOWLEDGE │ │  FUND-   │                       │
│  │          │ │ COMMS    │ │   WIKI   │ │ RAISING  │                       │
│  │ Looker   │ │ DECISIONS│ │          │ │   IR     │                       │
│  │ Metabase │ │ OKRs     │ │ Notion   │ │          │                       │
│  │ Tableau  │ │          │ │ Confluence│ │ Affinity │                       │
│  │ Mode     │ │ Loom     │ │ Guru     │ │ Visible  │                       │
│  │ BigQuery │ │ Notion   │ │ Tettra   │ │ Carta    │                       │
│  │ Snowflake│ │          │ │ Slite    │ │          │                       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘                       │
│                                                                             │
│   EVERY FUNCTIONALITY EXECUTABLE WITHOUT LEAVING THE WORKBENCH              │
│   EVERY ACTION SYNCED TO SOURCE SYSTEMS BY POLICY                           │
│   EVERY FIELD COMPOSED FROM CROSS-TOOL CANONICAL STATE                      │
│                                                                             │
│       CROSS-CATEGORY FIELD + DATA + MEMORY + CAPABILITY COMPOSITION         │
│              USER ROLE + DEPARTMENT + ACTIVE CONTEXT + POLICY               │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
                                    ▼
                    ┌──────────────────────────────────────┐
                    │      FOUR-BUTTON OODA GRAMMAR        │
                    ├──────────────────────────────────────┤
                    │ OBSERVE  → STORE IN SPINE            │
                    │ ORIENT   → ASK YOUR TWIN             │
                    │ DECIDE   → ASSIGN YOUR TWIN          │
                    │ ACT      → APPROVE TWIN'S ACTION     │
                    └────────────────┬─────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                               TWIN                                          │
│                      CONTINUOUS AI WORK PARTNER                             │
│              ALWAYS PRESENT · ALWAYS CONTEXTUAL · NEVER COLD                │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                    TWIN CONTEXT CHAIN                               │   │
│   │                                                                     │   │
│   │  CONNECTED TOOLS → ADAPTIVE SPINE → CONTINUITY BRIDGE               │   │
│   │       → WORKBENCH SURFACE → USER ACTION OBSERVATION                 │   │
│   │            → TWIN RUNTIME → SUGGESTION / PROPOSAL                   │   │
│   │                                                                     │   │
│   │  THE USER NEVER PROVIDES CONTEXT                                    │   │
│   │  THE TWIN ALWAYS KNOWS                                              │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   ┌──────────────────┬────────────────────┬──────────────────────────────┐   │
│   │   TWIN MEMORY    │   SESSION LOGS     │       TWIN AUDIT LOGS       │   │
│   │                  │                    │                              │   │
│   │ Durable AI       │ Conversations      │ Model / Agent Identity       │   │
│   │ Continuity       │ Tool Calls         │ Intent                       │   │
│   │ User Preferences │ Session State      │ Policy Decision              │   │
│   │ Learned Context  │ Context Lifecycle  │ Approval Lineage             │   │
│   └──────────────────┴────────────────────┴──────────────────────────────┘   │
│                                                                             │
│   PROACTIVE BEHAVIORS:                                                      │
│   • Next-Best-Action suggestions based on entity state + history            │
│   • Risk alerts surfaced before the user asks                               │
│   • Opportunity signals detected from cross-tool patterns                   │
│   • Contextual insights auto-surfaced when entity is opened                 │
│   • Draft completions offered as user begins composing                      │
│   • Capability recommendations with pre-filled context                      │
│   • The Twin suggests in Orient/Decide — Act remains human-gated            │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CAPABILITY FABRIC                                   │
│                                                                             │
│                     RESOLVE HOW WORK GETS DONE                              │
│                                                                             │
│  TOOL → TOOL       MEMORY FETCH       MCP             AGENT → AGENT         │
│                                                                             │
│  API CONNECTOR     API WRAPPER        LOCAL           AI EXECUTION          │
│  ACTION            CAPABILITY         EXECUTION       (AI CONNECTOR)        │
│                                                                             │
│                       CAPABILITY REGISTRY                                   │
│                                                                             │
│ Schema · Input · Output · Authority · Execution Mode · Sync Mode            │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────────────┐
│                         GOVERNANCE ENGINE                                   │
│ Policy · Authority · Evidence · Risk · Scope · Approval                     │
│                 ALLOW · DENY · REQUIRE APPROVAL                             │
│                    NO AGENT WRITES DIRECTLY TO SPINE                        │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              HERMES                                         │
│                       EXECUTION ORCHESTRATOR                                │
│ Resolve Capability → Select Runtime → Bind Context → Execute                │
│ Coordinate Tools → Coordinate Agents → Observe → Retry → Reconcile          │
│              PRESERVES INTENT + AUTHORITY + EXECUTION LINEAGE               │
└───────────────────────────────────┬─────────────────────────────────────────┘
              ┌─────────────────────┼───────────────────────┐
              ▼                     ▼                       ▼
      LOCAL EXECUTION          API EXECUTION          DISTRIBUTED EXECUTION
      Workbench State          Provider API             Tool → Tool
      Local Capability         Source System            MCP
                                                   Agent → Agent
              └─────────────────────┼───────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            SYNC ENGINE                                      │
│ Immediate · Deferred · Batch · Scheduled · Event-Driven · Reconciliation    │
│ Cursors · Checkpoints · Pending Mutations · Retry · DLQ · Conflict State    │
│                      SYSTEMS CONVERGE BY POLICY                             │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       CONTINUITY PIPELINE                                   │
│        INTENT → ACTION → EVIDENCE → OUTCOME → STATE → MEMORY                │
│                         PROMOTE TO SPINE                                    │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
                                    └──────────────► ADAPTIVE SPINE
                                                        │
                                                        ▼
                                               WORKBENCH REHYDRATION
                                                        │
                                                        ▼
                                                   NEXT OODA LOOP
```

---

## Canonical Execution Sequence

```
Configuration Manager
   → Integration Manager
   → Activation Bridge
   → Common Connected Surface Bootstrap
   → Creamy Load
   → Spine Network
   → Workbench Composition
   → OODA / Twin
   → Capability Fabric
   → Governance
   → Hermes
   → Sync
   → Delta Load
   → Continuity Pipeline
   → Spine Promotion
   → Rehydration
```

---

## The Complete IW Operating Model

**Configuration Manager** defines how the tenant operates.

**Integration Manager** connects systems, tools, intelligence, and capability sources through four distinct contracts — **MCP, AI Connector, API Connector, and API Wrapper**.

**Activation Bridge** compiles the tenant, ecosystem, role, and policy into an active workspace.

**Pipeline** transforms fragmented provider data into normalized operational context.

**Adaptive Spine** owns canonical operational truth.

**Continuity Bridge** delivers the right memory and context to the active runtime.

**User Workbench** becomes the operational hub of every department — with every tool category composed and every functionality executable without leaving the surface.

**Twin** is always present, always contextual, always suggesting — the user never provides context because the Twin always has it.

**Capability Fabric** resolves how an intent can be performed.

**Governance** determines whether and under whose authority it may be performed.

**Hermes** coordinates governed execution.

**Sync Engine** converges local and connected systems according to policy.

**Continuity Pipeline** turns execution outcomes into persistent operational memory.

**Spine** remembers.

**Workbench** rehydrates.

**OODA** repeats.

---

## INTEGRATEWISE

One operational hub for every department.

Every tool category composed. Every functionality executable from one surface.

Persistent Twins with continuity — always present, always contextual, never cold.

Four distinct connection and capability paths.

Governed capabilities across tools, systems, APIs, agents, and AI.

The user never leaves the Workbench. The user never provides context to AI.

The Twin sees what the user sees. The Twin knows what the user knows. The Twin suggests before being asked.

Local work with policy-driven synchronization. Canonical truth that no model owns.

## Truth you own. AI you rent. Approval in between.

## Your Data. Your Twin. Your Model. Your Yes / No Matters.

## IntegrateWise is Operational Continuity Infrastructure with Governed Intelligence.

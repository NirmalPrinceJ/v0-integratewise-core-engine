# IntegrateWise GTM Motion: "One Connection, Infinite Intelligence"


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

## Executive Summary

**The Motion:**
> "Click an AI marketplace app. Authorize once. Your AI tools now read and write from your organizational Spine."

**The Promise:**
- Connect IntegrateWise in Claude Desktop, ChatGPT, Perplexity, Replit, Lovable, Cursor, or Windsurf
- One OAuth flow establishes identity (tenant + user)
- Every AI activity automatically writes to your Spine
- All AI tools indirectly access Salesforce, HubSpot, Stripe, NetSuite, etc. via MCP
- No separate integrations; one managed MCP endpoint for all

---

## The User Journey (5 Minutes)

### Step 1: Discovery (30 seconds)
User is in Claude Desktop and sees **"IntegrateWise"** in the marketplace or app gallery.

```
┌─────────────────────────────────────────┐
│  Claude Desktop - App Marketplace       │
├─────────────────────────────────────────┤
│                                         │
│  📱 IntegrateWise                       │
│  "Wired business intelligence for AI"   │
│                                         │
│  [CONNECT]                              │
│                                         │
└─────────────────────────────────────────┘
```

### Step 2: Authorization (2 minutes)
User clicks "Connect" → MCP client talks to your MCP server → Server redirects to OAuth → User authorizes.

```
Flow:
  Claude (MCP Client) → IntegrateWise MCP Server
                          ↓
                       [401 Unauthorized]
                          ↓
                       Return OAuth URL
                          ↓
  Claude redirects → User's browser → OAuth flow
                          ↓
                       IntegrateWise Continuity Bridge
                          ↓
                       [Tenant + User Created]
                          ↓
                       [JWT Token Issued]
                          ↓
  Return to Claude with token
```

### Step 3: Marketplace Activation (30 seconds)
User's IntegrateWise app is now active in Claude. Claude MCP client loads tools and resources.

```
┌─────────────────────────────────────────┐
│  Claude Desktop                         │
├─────────────────────────────────────────┤
│                                         │
│  IntegrateWise                          │
│  ✓ Connected & Authorized               │
│                                         │
│  Available Tools:                       │
│  • Query your Spine (entities, memory)  │
│  • Propose decisions                    │
│  • Create tasks & notes                 │
│  • Update metrics                       │
│  • Chat with Agent Lee                  │
│                                         │
└─────────────────────────────────────────┘
```

### Step 4: First AI Interaction (2 minutes)
User asks Claude: "Should we pursue lead #123?"

Claude calls IntegrateWise MCP tools:
1. Query Spine for lead data (HubSpot account, Salesforce opportunity, Stripe payment info)
2. Query memory for similar deals
3. Call Agent Lee's orchestrator
4. Generate recommendation
5. **Write decision to Spine** (audit trail, memory, metrics updated)

```
User: "Should we pursue lead #123?"
  ↓
Claude MCP Client
  ↓
IntegrateWise MCP Server (tools):
  - read_spine(lead_123) → HubSpot + Salesforce + Stripe data
  - query_memory("similar_deals")
  - invoke_agent_lee(decision_request)
  ↓
Agent Lee (Twin Orchestrator):
  - Observes context (Spine + Memory)
  - Reasons about decision
  - Proposes with confidence score
  ↓
Claude receives response
  ↓
**MCP Tool: write_spine(decision, evidence, outcome)**
  ↓
Spine records:
  - Decision event
  - Evidence (which fields from HubSpot, Salesforce, Stripe)
  - Outcome signal (approval pending)
  - Audit trail
```

### Step 5: Continuous Intelligence (Ongoing)
Every AI conversation, decision, task, note written by Claude is persisted to the Spine.

- Other MCP clients (ChatGPT, Perplexity, Replit, Lovable) see the same Spine data
- Agent Lee learns from outcomes
- Metrics update automatically
- Memory compounds

---

## Technical Architecture

### 1. Identity + Auth: Continuity Bridge

**Component:** `services/continuity-bridge/` (new)

Responsible for:
- OAuth flow (OAuth 2.0 PKCE for desktop clients)
- Tenant resolution (which org?)
- User identity creation
- JWT token issuance (with tenant, user, capabilities)
- MCP-compatible token validation

**Flow:**
```
MCP Client                  IntegrateWise
    │
    ├─ GET /mcp/auth/init
    │  └─ Returns oauth_url + state
    │
    ├─ User opens URL
    │  └─ User authorizes (browser)
    │
    └─ GET /mcp/auth/callback?code=X&state=Y
       └─ Exchange code for JWT
       └─ Returns: { token, tenant_id, user_id, capabilities }
```

**Token Payload:**
```json
{
  "sub": "user_123",
  "tenant": "tenant_abc",
  "capabilities": ["read_spine", "write_spine", "invoke_agents"],
  "iat": 1234567890,
  "exp": 1234654290,
  "iss": "integratewise.continuity"
}
```

### 2. MCP Marketplace Integration

**Component:** `services/mcp-server/` (enhanced)

Three marketplace integrations:

#### A. Claude Desktop
- Marketplace: Claude app store (claude.ai/apps)
- Integration: MCP server URL
- Auth: OAuth → JWT token
- Tools: Spine queries, Agent Lee, decision capture

#### B. ChatGPT/OpenAI
- Marketplace: OpenAI action/tool marketplace
- Integration: Custom action → calls IntegrateWise MCP
- Auth: OAuth → Session token
- Tools: Subset of Spine data, decision logging

#### C. Cloud MCP Hubs
- Marketplace: Databricks, ClickHouse, Auth0 MCP hub
- Integration: Registered remote MCP server
- Auth: Tenant API key or OAuth
- Tools: Full Spine access for API key auth

### 3. Spine → MCP Tool Adapter

**Component:** `services/spine-mcp-adapter/` (new)

Maps Spine data to MCP tools:

```typescript
// MCP Tools exposed:

tools.read_spine({
  entity_type: "account" | "opportunity" | "contact" | "ticket" | "invoice",
  id: string,
  scope: "all" | "sales" | "finance" | "csm"
}) → Returns: Entity with 50-200 fields (depends on connected connectors)

tools.query_memory({
  query: string,
  scope: "global" | "tenant" | "user",
  limit: 10
}) → Returns: Relevant past decisions, outcomes, learnings

tools.invoke_agent_lee({
  context: { account_id, opportunity_id, ... },
  request: "Should we pursue this? Is there churn risk?"
}) → Returns: Agent Lee's proposal with confidence, evidence

tools.write_decision({
  entity_id: string,
  decision_type: "pursue" | "defer" | "decline" | "upsell",
  reasoning: string,
  evidence: { source: "HubSpot", field: "value" }[] 
}) → Writes to Spine, updates metrics, updates memory

tools.create_task({
  title: string,
  assigned_to: string,
  due_date: ISO8601,
  related_entity: { type, id }
}) → Creates in Spine, syncs to task management tool
```

### 4. Data Flow: AI Activity → Spine → Intelligence

```
┌─────────────────────────────────────────────────────────────────┐
│ MCP Client (Claude, ChatGPT, Perplexity, etc.)                 │
│                                                                 │
│  User: "Create a task for follow-up on lead #123"              │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ IntegrateWise MCP Server                                        │
│                                                                 │
│  tools.create_task({                                            │
│    title: "Follow up with acme.com",                           │
│    related_entity: { type: "account", id: "123" }              │
│  })                                                             │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ Loader/Normalizer                                               │
│                                                                 │
│  Normalize: { source: "mcp_client", event_type: "task_created" }│
│  Apply null policies: BLOCK, DERIVE, DEFAULT, ENRICH, SIGNAL   │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ Spine (D1 Database + Events)                                    │
│                                                                 │
│  tasks table:                                                   │
│    ├─ id: "task_abc123"                                         │
│    ├─ title: "Follow up with acme.com"                          │
│    ├─ created_by_source: "mcp_client"                          │
│    ├─ related_account_id: "123"                                │
│    └─ created_at: 2024-12-15T10:30:00Z                          │
│                                                                 │
│  events table:                                                  │
│    ├─ type: "task.created"                                      │
│    ├─ entity_id: "task_abc123"                                  │
│    ├─ source: "mcp_client"                                      │
│    └─ timestamp: 2024-12-15T10:30:00Z                           │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ Hermes Event Stream                                             │
│                                                                 │
│  Task broadcast to:                                             │
│    ├─ Twin Orchestrator (Agent Lee)                             │
│    ├─ Other MCP Clients (ChatGPT, Replit see same task)        │
│    ├─ Task management connector (Jira, Asana)                   │
│    └─ Dashboard (real-time updates)                             │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ Connected Systems (Real Sync)                                   │
│                                                                 │
│  Jira/Asana Connector:                                          │
│    └─ Create corresponding task in Jira (bi-directional)       │
│                                                                 │
│  Slack Connector:                                               │
│    └─ Post to #sales: "New task: Follow up with acme.com"     │
│                                                                 │
│  Memory System:                                                 │
│    └─ Index task (searchable in future conversations)          │
└─────────────────────────────────────────────────────────────────┘
```

---

## GTM Messaging

### Headline
> **"One marketplace connection. Your AI tools now understand your business."**

### Subheading
> **"Connect IntegrateWise in Claude, ChatGPT, Perplexity, or Replit. Every AI decision gets stored, learned from, and shared across all your tools."**

### 3-Pillar Positioning

#### Pillar 1: One-Click Connection
"No integration complexity. No API keys. Click IntegrateWise in your favorite AI marketplace. Authorize once. Done."

#### Pillar 2: Always Current
"Your AI sees your live Salesforce, HubSpot, Stripe, NetSuite, Jira, Slack—without them talking directly. IntegrateWise bridges it all."

#### Pillar 3: Composable Intelligence
"Every AI decision (Claude, ChatGPT, Perplexity, Replit) flows into your organizational Spine. Agent Lee learns. Your business gets smarter."

### Use Cases by User

#### Sales Rep
> "I ask Claude: 'Is this lead a good fit?' Claude checks our Salesforce pipeline, HubSpot account value, Stripe payment history—all in one conversation. Decision gets logged. Agent Lee learns. Next rep sees the reasoning."

#### Finance
> "I ask ChatGPT: 'What's our cash runway?' It queries Stripe invoices, NetSuite expenses, bank transactions—from MCP. Generates forecast. Updates our financial dashboard."

#### CSM
> "I ask Perplexity: 'Which customers are at risk?' It queries Zendesk tickets, Slack sentiment, renewal dates. Creates follow-up tasks. Everything syncs."

#### Developer
> "I ask Claude Code: 'Write a script to update all inactive leads.' Claude queries our Salesforce Spine data, writes the code, then logs every change for audit."

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
- [ ] Build Continuity Bridge (OAuth + JWT)
- [ ] Enhance MCP server with Spine → tool adapter
- [ ] Create Claude Desktop marketplace app
- [ ] Test OAuth flow (Claude ↔ IntegrateWise)
- [ ] Verify Spine write from MCP client

### Phase 2: Multi-Platform (Week 3-4)
- [ ] OpenAI ChatGPT integration
- [ ] Perplexity MCP integration
- [ ] Replit integration
- [ ] Lovable integration
- [ ] Cursor/Windsurf integration

### Phase 3: Intelligence Layer (Week 5-6)
- [ ] Agent Lee activation in MCP tools
- [ ] Memory indexing for MCP queries
- [ ] Cross-domain metrics from MCP actions
- [ ] Real-time Spine updates from AI activity

### Phase 4: Monetization (Week 7-8)
- [ ] Usage-based billing (MCP calls)
- [ ] Premium connectors (HubSpot Pro, Salesforce Advanced)
- [ ] Enterprise tier (unlimited agents, priority queue)
- [ ] Partner marketplace revenue

---

## Success Metrics

### Adoption
- MCP connections per day
- Marketplace app installs
- Active MCP clients (daily)
- Retention (% still using after 30 days)

### Engagement
- Spine writes per user
- Average tools called per session
- Decision logging rate
- Memory query volume

### Intelligence
- Agent Lee invocations
- Cross-domain metric activations
- Metrics impacted by MCP decisions
- ML model improvement (← decisions logged)

### Revenue
- ARR per tenant
- MPC call volume (pricing)
- Premium connector adoption
- Enterprise customers

---

## Competitive Advantage

### vs. Native Integrations (Salesforce native ChatGPT, etc.)
- ✅ Works with ANY AI tool
- ✅ One connection for all systems
- ✅ Learning persists across AI tools
- ✅ Agent Lee sits in the middle

### vs. Zapier/Make (automation)
- ✅ Real-time (not batch)
- ✅ Intelligence baked in (not just data copy)
- ✅ Persistent decisions (audit trail)
- ✅ Agent-based (not rule-based)

### vs. Langchain/Framework Tools
- ✅ Managed service (no self-hosting)
- ✅ Real connectors (not mock data)
- ✅ Enterprise governance (RLS, audit)
- ✅ Production-grade infrastructure

---

## Launch Checklist

- [ ] Continuity Bridge deployed (OAuth working)
- [ ] MCP server handles 1000 req/min
- [ ] Spine writes verified (no data loss)
- [ ] Claude marketplace app approved
- [ ] First 10 pilot customers onboarded
- [ ] Agent Lee accessible via MCP
- [ ] Memory queries working
- [ ] Cross-domain metrics active
- [ ] Monitoring dashboards live
- [ ] Support playbooks ready

---

## Messaging for Investors

> "IntegrateWise is positioning itself as the **Spine layer for AI operations**. Instead of every AI tool building integrations with Salesforce, HubSpot, Stripe, and 100+ other systems, they integrate once with IntegrateWise. We handle the connectors. The Spine is the single source of truth. Every AI decision gets logged, learned from, and shared. This is the MCP marketplace thesis—one managed endpoint that every AI client connects to."

---

## The One Headline

> **"Connect IntegrateWise once in your AI marketplace. All your AI tools now read and write from your organizational Spine."**


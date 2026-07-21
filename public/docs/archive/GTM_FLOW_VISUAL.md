# GTM Flow: Visual Architecture


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

## Three Simple Pieces

### Piece 1: Marketplace Apps (Multiple)

```
┌─────────────────────────────────────────────────────────────┐
│ Claude Desktop                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [Connect IntegrateWise Button]                          │ │
│ │ ↓ Click                                                 │ │
│ │ Opens: https://integratewise.com/auth?app=claude       │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ChatGPT                                                     │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [Connect IntegrateWise Action]                          │ │
│ │ ↓ Click                                                 │ │
│ │ Opens: https://integratewise.com/auth?app=chatgpt      │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Perplexity                                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [Connect IntegrateWise Plugin]                          │ │
│ │ ↓ Click                                                 │ │
│ │ Opens: https://integratewise.com/auth?app=perplexity   │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Piece 2: OAuth Gateway (One)

```
┌──────────────────────────────────────────────────────────────┐
│                 IntegrateWise OAuth                          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  GET /oauth?app=claude&redirect_uri=...                     │
│         ↓                                                   │
│  Show form: Email + Organization Name                       │
│         ↓                                                   │
│  POST /oauth/authorize                                      │
│         ↓                                                   │
│  Create Tenant (if new)                                     │
│  Create User                                                │
│  Issue JWT Token                                            │
│         ↓                                                   │
│  Redirect: redirect_uri?token=JWT&app=claude                │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Piece 3: Feature Surface (All Connected)

```
┌──────────────────────────────────────────────────────────────┐
│                  Feature Surface                            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  if (token exists) {                                         │
│    Show:                                                     │
│      • Spine Query Builder                                   │
│      • Agent Lee Recommendations                             │
│      • Memory Search                                         │
│      • Decision Log                                          │
│      • Task Sync                                             │
│  }                                                           │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```


## Complete User Journey (2 Minutes)

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: User opens Claude Desktop (15 seconds)              │
├─────────────────────────────────────────────────────────────┤
│ • Sees "Connect IntegrateWise" button                        │
│ • Clicks button                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Redirected to OAuth (Page loads)                    │
├─────────────────────────────────────────────────────────────┤
│ • Shows: Email + Organization Name form                     │
│ • User enters: acme@acme.com + "Acme Corp"                 │
│ • Clicks: "Authorize"                                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 3: Backend Processing (5 seconds)                      │
├─────────────────────────────────────────────────────────────┤
│ • Creates Tenant(id=tenant_001)                             │
│ • Creates User(id=user_001, email=acme@acme.com)            │
│ • Issues JWT(userId=user_001, tenantId=tenant_001)          │
│ • Redirects to: claude-extension://callback?token=JWT       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 4: Claude Extension Receives Token (1 second)          │
├─────────────────────────────────────────────────────────────┤
│ • Stores JWT in local storage                               │
│ • Recognizes: Connected                                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 5: Feature Surface Available (Instant)                 │
├─────────────────────────────────────────────────────────────┤
│ • Shows: Spine Query Builder                                │
│ • Shows: Agent Lee Panel                                    │
│ • Shows: Memory Search                                      │
│ • Shows: Decision Log                                       │
│ • Shows: Task Sync                                          │
│                                                              │
│ User can now ask:                                           │
│ "Should we pursue Acme Corp?" → Claude queries Spine        │
└─────────────────────────────────────────────────────────────┘
```


## Data Flow: One Question

```
User: "Should we pursue Acme Corp?"
  ↓
Claude Extension sends to MCP Server:
  GET /mcp/spine?query=account:acme_corp&fields=*
  ↓
MCP Server (with JWT):
  1. Validates JWT → Gets tenant_id + user_id
  2. Queries Spine: SELECT * FROM accounts WHERE org_id = tenant_001
  3. Returns: { revenue, deal_count, arr, logo_status, ...}
  ↓
Claude processes response:
  "Based on Acme's $2M revenue, $500k ARR, and 5 existing deals,
   I recommend pursuing. 92% confidence."
  ↓
User clicks: "Log Decision"
  ↓
Claude sends to MCP Server:
  POST /mcp/decisions
  { account_id: acme_001, decision: "pursue", confidence: 0.92 }
  ↓
MCP Server (with JWT):
  1. Validates JWT
  2. Inserts to decisions table
  3. Emits event: { type: "decision_made", ... }
  4. Hermes broadcasts to all connected clients
  ↓
All clients (ChatGPT, Perplexity, etc.) see:
  "Acme Corp: Decision to pursue logged by Claude. 92% confidence."
```


## Architecture: Three Layers

```
┌────────────────────────────────────────────────────────────────┐
│ LAYER 1: MARKETPLACE APPS                                      │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Claude Desktop ──┐                                            │
│  ChatGPT         ├──→ OAuth Redirect                           │
│  Perplexity      │                                             │
│  Replit          │                                             │
│  Lovable         │                                             │
│                                                                │
└────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────┐
│ LAYER 2: INTEGRATEWISE GATEWAY                                 │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ OAuth Handler                                           │  │
│  │ • Email + Organization                                  │  │
│  │ • Create Tenant                                         │  │
│  │ • Create User                                           │  │
│  │ • Issue JWT                                             │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ MCP Server (with JWT validation)                         │  │
│  │ • read_spine                                             │  │
│  │ • write_decision                                         │  │
│  │ • query_memory                                           │  │
│  │ • invoke_agent_lee                                       │  │
│  │ • create_task                                            │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Spine + Hermes Event Stream                              │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────┐
│ LAYER 3: CONNECTED SYSTEMS                                     │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Salesforce ──┐                                               │
│  HubSpot      ├──→ Read/Write via Connectors                  │
│  Stripe       │                                               │
│  NetSuite     │                                               │
│  28 more...   │                                               │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```


## Deployment Path

```
Week 1:
  • Deploy OAuth handler
  • Deploy MCP server (JWT validation)
  • Test manual flow

Week 2:
  • Add Claude Desktop extension
  • Publish to Claude marketplace
  • First 10 users

Week 3:
  • Add ChatGPT action
  • Add Perplexity plugin
  • 100+ users

Week 4:
  • Add Replit integration
  • Add Lovable integration
  • Scale to 1000+ users
```


## That's It

Click marketplace app → One OAuth → Features available.

No magic. No complexity. Just three pieces working together.


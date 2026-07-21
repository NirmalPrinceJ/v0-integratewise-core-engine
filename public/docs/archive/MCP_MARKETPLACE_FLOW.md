# MCP Marketplace Integration Flow: Technical Architecture


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

## Overview

This document details how IntegrateWise integrates with MCP-aware AI clients (Claude Desktop, ChatGPT, Perplexity, Replit, Lovable) through the MCP protocol, OAuth authentication, and Spine data synchronization.

---

## 1. MCP Server Architecture

### Location
```
services/mcp-server/
├── src/
│   ├── index.ts                  # Main server entry
│   ├── marketplace-setup.ts      # Marketplace app configs
│   ├── oauth-redirect.ts         # OAuth callback handler
│   ├── mcp-handlers.ts           # MCP protocol handlers
│   ├── tools/
│   │   ├── spine-read.ts         # Read Spine data
│   │   ├── spine-write.ts        # Write decisions, tasks
│   │   ├── memory-query.ts       # Query shared memory
│   │   ├── agent-lee.ts          # Invoke Twin orchestrator
│   │   └── sync-tools.ts         # Sync with Jira, Asana, etc.
│   ├── resources/
│   │   ├── entities.ts           # Spine entities (accounts, opportunities)
│   │   ├── metrics.ts            # Live metrics from Spine
│   │   └── memory.ts             # Shared memory resources
│   └── types.ts                  # MCP types & interfaces
├── package.json
├── wrangler.toml
└── tsconfig.json
```

### 1.1 MCP Server Initialization

```typescript
// services/mcp-server/src/index.ts

import { Server } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server({
  name: "integratewise",
  version: "1.0.0",
  description: "Wired business intelligence for AI agents"
});

// Register tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "read_spine",
      description: "Query live entity data from Spine (Salesforce, HubSpot, Stripe, etc.)",
      inputSchema: {
        type: "object",
        properties: {
          entity_type: { type: "string", enum: ["account", "opportunity", "contact", "invoice", "ticket"] },
          entity_id: { type: "string" },
          scope: { type: "string", enum: ["all", "sales", "finance", "csm"] }
        },
        required: ["entity_type", "entity_id"]
      }
    },
    {
      name: "query_memory",
      description: "Search shared memory for past decisions and outcomes",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string" },
          scope: { type: "string", enum: ["global", "tenant", "user"] },
          limit: { type: "number", default: 10 }
        },
        required: ["query"]
      }
    },
    {
      name: "invoke_agent_lee",
      description: "Get Agent Lee's recommendation on a business decision",
      inputSchema: {
        type: "object",
        properties: {
          context: { type: "object" },
          request: { type: "string" }
        },
        required: ["request"]
      }
    },
    {
      name: "write_decision",
      description: "Log a business decision to the Spine with evidence",
      inputSchema: {
        type: "object",
        properties: {
          entity_id: { type: "string" },
          decision_type: { type: "string" },
          reasoning: { type: "string" },
          evidence: { type: "array" }
        },
        required: ["entity_id", "decision_type", "reasoning"]
      }
    },
    {
      name: "create_task",
      description: "Create a task in Spine (syncs to Jira, Asana, etc.)",
      inputSchema: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          assigned_to: { type: "string" },
          due_date: { type: "string" },
          related_entity: { type: "object" }
        },
        required: ["title"]
      }
    }
  ]
}));

// Register resources
server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: "spine://accounts",
      name: "Accounts",
      description: "All accounts in Spine (from Salesforce, HubSpot, etc.)"
    },
    {
      uri: "spine://metrics",
      name: "Live Metrics",
      description: "Active metrics (CSM health, pipeline, etc.)"
    },
    {
      uri: "memory://decisions",
      name: "Past Decisions",
      description: "Historical decisions and outcomes"
    }
  ]
}));

export default server;
```

---

## 2. OAuth + Continuity Bridge

### Location
```
services/continuity-bridge/
├── src/
│   ├── index.ts                 # Main handler
│   ├── oauth-flow.ts            # OAuth 2.0 PKCE flow
│   ├── tenant-resolver.ts       # Identify tenant from OAuth context
│   ├── token-issuer.ts          # JWT token creation
│   ├── token-validator.ts       # Validate MCP client tokens
│   └── types.ts                 # OAuth types
├── wrangler.toml
└── tsconfig.json
```

### 2.1 OAuth Flow Sequence

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│ 1. MCP Client Initialization                               │
│    (Claude Desktop starts up)                              │
│                                                             │
│    Claude MCP Handler                                       │
│      ├─ Connects to: https://api.integratewise.ai/mcp     │
│      └─ Receives MCP tools list                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│ 2. Authorization Challenge                                 │
│    (MCP client makes first request → 401 Unauthorized)    │
│                                                             │
│    MCP Tool Call: read_spine(account_123)                  │
│      │                                                      │
│      └─ MCP Server checks: missing X-MCP-Token header      │
│         ↓                                                   │
│         Returns: {                                          │
│           error: "unauthorized",                           │
│           auth_url: "https://integratewise.ai/auth/init",  │
│           state: "xyz123"                                  │
│         }                                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│ 3. User Opens Authorization URL                            │
│    (Claude opens browser to IntegrateWise OAuth)          │
│                                                             │
│    GET /auth/init?state=xyz123                             │
│      └─ Continuity Bridge returns OAuth authorization page │
│                                                             │
│    User sees:                                              │
│      "Claude is requesting access to your IntegrateWise    │
│       business data (Salesforce, HubSpot, Stripe, etc.)"   │
│                                                             │
│      [AUTHORIZE]  [CANCEL]                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│ 4. User Authorizes                                          │
│    (User clicks AUTHORIZE)                                 │
│                                                             │
│    POST /auth/authorize                                    │
│      ├─ Email: user@company.com                            │
│      ├─ Org: Acme Corp                                     │
│      └─ Capabilities: ["read_spine", "write_spine"]        │
│         ↓                                                   │
│      Continuity Bridge:                                    │
│        ├─ Resolves tenant (email domain → tenant_abc)     │
│        ├─ Checks: Is user@company.com in tenant_abc?      │
│        ├─ If no: Create user in tenant                     │
│        ├─ Apply capabilities based on role                 │
│        └─ Generate authorization code                      │
│           ↓                                                 │
│      Redirect: /auth/callback?code=AUTH_CODE&state=xyz123 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│ 5. Token Exchange                                           │
│    (Claude exchanges auth code for token)                  │
│                                                             │
│    Claude browser redirects: /auth/callback?code=...       │
│      └─ Claude intercepts and sends to:                    │
│         POST /auth/token                                   │
│           ├─ code: AUTH_CODE                               │
│           ├─ client_id: claude_desktop                     │
│           └─ code_verifier: PKCE_VERIFIER                 │
│            ↓                                                │
│      Continuity Bridge validates PKCE                      │
│      Issues JWT token:                                     │
│      {                                                     │
│        "sub": "user_123",                                  │
│        "tenant": "tenant_abc",                             │
│        "email": "user@company.com",                        │
│        "capabilities": ["read_spine", "write_spine"],      │
│        "iat": 1702700000,                                  │
│        "exp": 1702786400,                                  │
│        "iss": "integratewise.continuity"                   │
│      }                                                     │
│      ↓                                                      │
│      Returns: { access_token, expires_in, token_type }   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│ 6. MCP Client Stores Token                                 │
│    (Claude saves token in local config)                    │
│                                                             │
│    ~/.config/Claude/integratewise.json                     │
│      ├─ mcp_server_url: https://api.integratewise.ai/mcp  │
│      ├─ access_token: JWT_TOKEN                            │
│      ├─ tenant_id: tenant_abc                              │
│      ├─ user_id: user_123                                  │
│      └─ expires_at: 1702786400                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│ 7. Authenticated MCP Calls                                 │
│    (Claude can now call MCP tools)                         │
│                                                             │
│    Claude MCP Client:                                      │
│      POST /mcp/call                                        │
│        ├─ Authorization: Bearer JWT_TOKEN                  │
│        ├─ tool: "read_spine"                               │
│        ├─ params: { entity_type: "account", id: "123" }   │
│        └─ ↓                                                 │
│                                                             │
│      MCP Server validates token:                           │
│        ├─ Extract tenant from JWT                          │
│        ├─ Extract user from JWT                            │
│        ├─ Check capabilities (has "read_spine"?)           │
│        ├─ Scope Spine query to tenant                      │
│        └─ ↓                                                 │
│                                                             │
│      Query Spine for account (with RLS):                   │
│        WHERE tenant_id = 'tenant_abc'                      │
│        AND id = '123'                                      │
│        ↓                                                    │
│                                                             │
│      Returns: {                                            │
│        id: "acc_123",                                      │
│        name: "Acme Corp",                                  │
│        revenue: 5000000,                                   │
│        industry: "Technology",                             │
│        crm: "Salesforce",                                  │
│        billing: "Stripe",                                  │
│        support: "Zendesk"                                  │
│      }                                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Continuity Bridge Implementation

```typescript
// services/continuity-bridge/src/index.ts

import { Router } from "itty-router";
import { verify, sign } from "@tsndr/cloudflare-workers-jwt";

const router = Router();

// 1. OAuth init endpoint
router.get("/auth/init", async (req: Request, env: Env) => {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = base64UrlEncode(sha256(codeVerifier));

  // Store in KV (short TTL)
  await env.KV.put(`oauth_state:${state}`, codeVerifier, { expirationTtl: 600 });

  return json({
    oauth_url: `https://integratewise.ai/auth/authorize?state=${state}&code_challenge=${codeChallenge}`,
    state
  });
});

// 2. Authorization endpoint
router.post("/auth/authorize", async (req: Request, env: Env) => {
  const { email, org, state } = await req.json();

  // Verify state
  const codeVerifier = await env.KV.get(`oauth_state:${state}`);
  if (!codeVerifier) throw new Error("Invalid state");

  // Resolve tenant
  const emailDomain = email.split("@")[1];
  let tenant = await env.DB.prepare(
    "SELECT id FROM tenants WHERE domain = ?"
  ).bind(emailDomain).first();

  if (!tenant) {
    // Create tenant
    tenant = await env.DB.prepare(
      "INSERT INTO tenants (domain, name) VALUES (?, ?) RETURNING id"
    ).bind(emailDomain, org).first();
  }

  // Ensure user exists
  let user = await env.DB.prepare(
    "SELECT id FROM users WHERE email = ? AND tenant_id = ?"
  ).bind(email, tenant.id).first();

  if (!user) {
    user = await env.DB.prepare(
      "INSERT INTO users (email, tenant_id, role) VALUES (?, ?, ?) RETURNING id"
    ).bind(email, tenant.id, "member").first();
  }

  // Generate auth code
  const authCode = generateAuthCode();
  await env.KV.put(
    `auth_code:${authCode}`,
    JSON.stringify({ user_id: user.id, tenant_id: tenant.id }),
    { expirationTtl: 300 }
  );

  return json({
    code: authCode,
    state,
    redirect_uri: `https://claude-desktop.integratewise.ai/callback?code=${authCode}&state=${state}`
  });
});

// 3. Token exchange endpoint
router.post("/auth/token", async (req: Request, env: Env) => {
  const { code, client_id, code_verifier } = await req.json();

  // Validate auth code
  const authData = await env.KV.get(`auth_code:${code}`);
  if (!authData) throw new Error("Invalid code");

  const { user_id, tenant_id } = JSON.parse(authData);

  // Get user details for JWT
  const user = await env.DB.prepare(
    "SELECT id, email, role FROM users WHERE id = ? AND tenant_id = ?"
  ).bind(user_id, tenant_id).first();

  // Determine capabilities based on role
  const capabilities = getCapabilitiesForRole(user.role);

  // Create JWT
  const token = await sign(
    {
      sub: user.id,
      tenant: tenant_id,
      email: user.email,
      capabilities,
      client_id
    },
    env.JWT_SECRET,
    { algorithm: "HS256", expirationTime: "24h" }
  );

  return json({
    access_token: token,
    token_type: "Bearer",
    expires_in: 86400
  });
});

// 4. Token validation middleware
router.use("*", async (req: Request, env: Env) => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(json({ error: "Unauthorized" }), { status: 401 });
  }

  const token = authHeader.slice(7);
  try {
    const decoded = await verify(token, env.JWT_SECRET);
    (req as any).user = decoded;
    (req as any).tenant = decoded.tenant;
  } catch (e) {
    return new Response(json({ error: "Invalid token" }), { status: 401 });
  }
});

export default router;
```

---

## 3. Spine → MCP Tool Adapter

### 3.1 read_spine Tool

```typescript
// services/mcp-server/src/tools/spine-read.ts

export async function read_spine(
  params: { entity_type: string; entity_id: string; scope?: string },
  env: Env,
  user: any
) {
  const { entity_type, entity_id, scope = "all" } = params;

  // Scope query to tenant
  const tenant_id = user.tenant;

  // Get entity from Spine
  const entity = await env.DB.prepare(
    `SELECT * FROM ${entity_type}s WHERE id = ? AND tenant_id = ?`
  ).bind(entity_id, tenant_id).first();

  if (!entity) {
    throw new Error(`${entity_type} not found`);
  }

  // Apply scope filtering
  if (scope === "sales") {
    return filterBySalesScope(entity);
  } else if (scope === "finance") {
    return filterByFinanceScope(entity);
  } else if (scope === "csm") {
    return filterByCSMScope(entity);
  }

  return entity;
}

// Scope helpers
function filterBySalesScope(entity: any) {
  return {
    id: entity.id,
    name: entity.name,
    revenue: entity.revenue,
    deal_count: entity.deal_count,
    arr_current: entity.arr_current,
    logo_status: entity.logo_status,
    csm_assigned: entity.csm_assigned,
    renewal_date: entity.renewal_date,
    expansion_opportunity: entity.expansion_opportunity
  };
}

function filterByFinanceScope(entity: any) {
  return {
    id: entity.id,
    name: entity.name,
    revenue: entity.revenue,
    arr_current: entity.arr_current,
    arr_forecast: entity.arr_forecast,
    mrr: entity.mrr,
    churn_rate: entity.churn_rate,
    payment_terms: entity.payment_terms,
    overdue_invoices: entity.overdue_invoices
  };
}

function filterByCSMScope(entity: any) {
  return {
    id: entity.id,
    name: entity.name,
    csm_assigned: entity.csm_assigned,
    health_score: entity.health_score,
    nps_score: entity.nps_score,
    support_tickets_open: entity.support_tickets_open,
    renewal_date: entity.renewal_date,
    churn_risk: entity.churn_risk
  };
}
```

### 3.2 write_decision Tool

```typescript
// services/mcp-server/src/tools/spine-write.ts

export async function write_decision(
  params: {
    entity_id: string;
    decision_type: string;
    reasoning: string;
    evidence?: any[];
  },
  env: Env,
  user: any
) {
  const { entity_id, decision_type, reasoning, evidence = [] } = params;
  const tenant_id = user.tenant;
  const user_id = user.sub;

  // Create decision event
  const decision_id = generateId();
  const now = new Date().toISOString();

  // Write to Spine decisions table
  await env.DB.prepare(
    `INSERT INTO decisions (id, tenant_id, user_id, entity_id, decision_type, reasoning, evidence, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    decision_id,
    tenant_id,
    user_id,
    entity_id,
    decision_type,
    reasoning,
    JSON.stringify(evidence),
    now
  ).run();

  // Emit event to Hermes (event stream)
  await env.HERMES.emit("decision.created", {
    id: decision_id,
    tenant_id,
    user_id,
    entity_id,
    decision_type,
    reasoning,
    evidence,
    timestamp: now
  });

  // Update metrics
  await updateMetricsFromDecision(env, tenant_id, decision_id);

  // Update memory
  await updateMemoryFromDecision(env, tenant_id, decision_id, reasoning);

  return {
    success: true,
    decision_id,
    timestamp: now
  };
}

async function updateMetricsFromDecision(env: Env, tenant_id: string, decision_id: string) {
  // Example: If decision_type is "pursue", update "deals_pursued" metric
  await env.DB.prepare(
    `UPDATE metrics SET value = value + 1, last_updated_at = NOW()
     WHERE tenant_id = ? AND name = 'deals_pursued'`
  ).bind(tenant_id).run();
}

async function updateMemoryFromDecision(env: Env, tenant_id: string, decision_id: string, reasoning: string) {
  // Save to shared memory (searchable for future conversations)
  const memory_id = generateId();
  await env.SHARED_MEMORY_DO.put(
    `memory:${memory_id}`,
    {
      decision_id,
      reasoning,
      timestamp: Date.now(),
      tenant_id
    },
    { expirationTtl: 7776000 } // 90 days
  );
}
```

---

## 4. Multi-Platform Integrations

### 4.1 Claude Desktop

**Integration Point:** MCP server URL in Claude config

```json
{
  "mcpServers": {
    "integratewise": {
      "command": "node",
      "args": ["./dist/mcp-server.js"],
      "env": {
        "MCP_SERVER_URL": "https://api.integratewise.ai/mcp",
        "CLIENT_ID": "claude_desktop",
        "AUTH_CALLBACK": "https://claude-desktop.integratewise.ai/callback"
      }
    }
  }
}
```

### 4.2 ChatGPT / OpenAI

**Integration Point:** Custom action (schema-based)

```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "IntegrateWise",
    "description": "Query live business data from Salesforce, HubSpot, Stripe, etc.",
    "version": "1.0.0"
  },
  "servers": [
    {
      "url": "https://api.integratewise.ai",
      "description": "IntegrateWise API"
    }
  ],
  "paths": {
    "/mcp/read_spine": {
      "post": {
        "summary": "Query Spine entity",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "entity_type": { "type": "string" },
                  "entity_id": { "type": "string" }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Entity data",
            "content": {
              "application/json": {
                "schema": { "type": "object" }
              }
            }
          }
        },
        "security": [
          { "oauth2": ["read_spine"] }
        ]
      }
    }
  }
}
```

### 4.3 Perplexity, Replit, Lovable

**Integration Point:** Shared MCP endpoint

All clients connect to: `https://api.integratewise.ai/mcp` with OAuth token

---

## 5. Data Flow: Decision Logging

### Complete End-to-End Flow

```
User (Claude): "Should we pursue Acme Corp?"
    │
    ▼
Claude MCP Client (calls tools):
    ├─ read_spine(account_id, scope=sales)
    │  └─ Returns: { name, revenue, csm_health, renewal_date }
    │
    ├─ query_memory("similar_companies_similar_revenue")
    │  └─ Returns: [ { outcome: "pursued", result: "won" }, ... ]
    │
    ├─ invoke_agent_lee({ context, request })
    │  └─ Returns: { proposal: "PURSUE", confidence: 0.88, reasoning: "..." }
    │
    └─ write_decision({
         entity_id: "acme_corp",
         decision_type: "pursue",
         reasoning: "Strong health, good renewal timing, expansion opportunity",
         evidence: [
           { source: "HubSpot", field: "csm_health", value: 0.9 }
         ]
       })
       │
       ▼
    MCP Server (in Cloudflare):
       ├─ Validate token (JWT)
       ├─ Scope to tenant
       ├─ Insert into decisions table
       │
       ▼
    Spine (D1 Database):
       ├─ INSERT decisions row
       ├─ INSERT events row
       └─ Emit event to Hermes
       │
       ▼
    Hermes Event Stream (broadcast):
       ├─ → Twin Orchestrator (Agent Lee learns)
       ├─ → ChatGPT MCP Client (sees same decision)
       ├─ → Perplexity MCP Client (sees same decision)
       ├─ → Memory indexer (searchable)
       └─ → Metrics updater (trends)
       │
       ▼
    Connected Systems (real sync):
       ├─ → Salesforce (log activity)
       ├─ → Jira (create follow-up task)
       ├─ → Slack (post to #sales)
       └─ → Dashboard (real-time update)
```

---

## 6. Security & Multi-Tenancy

### Token Security
- JWT tokens signed with HS256
- 24-hour expiration
- User + tenant scoped
- Capabilities-based access control

### Row-Level Security (RLS)
- Every Spine query scoped to `tenant_id = ?`
- MCP server extracts tenant from JWT
- No cross-tenant data leakage

### Audit Trail
- All MCP tool calls logged (tool name, params, result)
- All Spine writes tracked (user, timestamp, decision)
- Events immutable in Hermes stream

---

## 7. Implementation Checklist

- [ ] Continuity Bridge deployed (OAuth working)
- [ ] MCP server handles concurrent requests
- [ ] Spine write paths tested (no data loss)
- [ ] Claude Desktop app approved
- [ ] ChatGPT action created and tested
- [ ] Perplexity integration working
- [ ] Replit integration working
- [ ] Token refresh logic implemented
- [ ] Error handling for auth failures
- [ ] Monitoring dashboards live


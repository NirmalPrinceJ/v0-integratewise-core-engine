# IntegrateWise Platform API — Full Reference

## 🚀 Platform URLs

**Production Gateway:** `https://gateway.dev.integratewise.ai`

**Base Path:** `/api/v1`

---

## 🔐 Authentication

All authenticated endpoints require:

```bash
Authorization: Bearer YOUR_INTEGRATEWISE_API_TOKEN
x-tenant-id: YOUR_INTEGRATEWISE_TENANT_ID
x-user-id: your-user-id           # optional
x-user-role: owner|admin|manager|member|viewer  # optional
```

### Auth Endpoints (Clerk)

| Endpoint | URL |
|----------|-----|
| Sign In | `https://accounts.integratewise.ai/sign-in` |
| Sign Up | `https://accounts.integratewise.ai/sign-up` |
| OAuth Authorize | `https://integratewise.ai/clerk/oauth/authorize` |
| OAuth Token | `https://integratewise.ai/clerk/oauth/token` |
| User Info | `https://integratewise.ai/clerk/oauth/userinfo` |
| Token Info | `https://integratewise.ai/clerk/oauth/token_info` |
| OpenID Config | `https://integratewise.ai/clerk/.well-known/openid-configuration` |
| Organization | `https://accounts.integratewise.ai/organization` |
| Create Org | `https://accounts.integratewise.ai/create-organization` |
| OAuth Consent | `https://accounts.integratewise.ai/oauth-consent` |

### Get Token

```bash
# 1. Sign in via Clerk
open "https://accounts.integratewise.ai/sign-in"

# 2. After login, get token from OAuth flow
export INTEGRATEWISE_API_TOKEN="eyJhbGci..."
export INTEGRATEWISE_TENANT_ID="tenant_abc123"
```

---

## 📋 All Endpoints by Category

### Health & Status (No Auth Required)

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| `GET` | `/health` | Gateway health check | `{"status":"ok","service":"gateway","ts":1784601533721}` |
| `GET` | `/health/ready` | Full readiness probe (all services) | `{"status":"ready","services":[...]}` |

---

### Workspace & Projection

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| `GET` | `/api/v1/workspace/projection/:department` | Full department workbench | SharedWorkbench |
| `GET` | `/api/v1/workspace/entities?type=:type&limit=:n` | Entities filtered by type | `{"entities":[...],"provenance":{}}` |
| `GET` | `/api/v1/workspace/readiness` | Department readiness scores | `{"overall_score":0.85,"buckets":[...]}` |
| `GET` | `/api/v1/workspace/metadata` | Workspace metadata | `{"domains":[...],"connectors":[...]}` |
| `GET` | `/api/v1/pipeline/entities` | Dashboard entities (limited) | `{"entities":[...],"provenance":{}}` |

**Department Codes:** `SALES`, `CUSTOMER_SUCCESS`, `MARKETING`, `PRODUCT_ENGINEERING`, `FINANCE`, `SERVICE`, `PROCUREMENT`, `BIZOPS`, `PERSONAL`, `REVOPS`

**Entity Types:** `account`, `person`, `deal`, `task`, `signal`, `event`, `document`, `campaign`, `invoice`, `ticket`, `project`, `incident`, `vendor`, `contract`, `engagement`, `note`

**Example Request:**
```bash
curl -H "Authorization: Bearer $INTEGRATEWISE_API_TOKEN" \
     -H "x-tenant-id: $INTEGRATEWISE_TENANT_ID" \
     "https://gateway.dev.integratewise.ai/api/v1/workspace/projection/SALES"
```

**Example Response:**
```json
{
  "workspace_id": "ws_123",
  "tenant_id": "tenant_456",
  "department": "SALES",
  "domain": "SALES",
  "entities": {
    "account": [
      {
        "id": "acc_001",
        "entity_type": "account",
        "name": "Acme Corp",
        "status": "active",
        "metadata": {"industry": "Technology", "ARR": 120000},
        "source_tool": "salesforce",
        "created_at": "2026-07-01T10:00:00Z",
        "updated_at": "2026-07-21T14:30:00Z"
      }
    ],
    "person": [...],
    "deal": [...],
    "task": [...]
  },
  "relationships": [
    {"source": "acc_001", "target": "per_001", "type": "has_contact"}
  ],
  "signals": [
    {"id": "sig_001", "severity": "info", "title": "New deal created", "timestamp": "2026-07-21T10:30:00Z"}
  ],
  "capabilities": [
    {"name": "salesforce:read-accounts", "status": "active"}
  ],
  "governance": [
    {"id": "gov_001", "decision": "approved", "capability": "salesforce:write-opportunities"}
  ],
  "readiness": {
    "overall_score": 0.85,
    "overall_state": "live",
    "buckets": [
      {"capability": "accounts", "state": "live", "score": 0.9, "coverage": 0.95}
    ]
  },
  "provenance": {
    "source": "spine",
    "confidence": 0.95,
    "last_sync": "2026-07-21T10:30:00Z"
  },
  "composed_at": "2026-07-21T10:30:00Z",
  "composed_by": "projection-engine",
  "projection_version": "1.0.0"
}
```

---

### Connectors

Connectors are **tenant-level assets**. Once connected, all apps share the same connection.

```
                    Tenant

                       │

               Connector Registry

                       │

      Salesforce (Connected)
      Slack (Connected)
      Gmail (Connected)
      GitHub (Connected)

           │           │          │

     Customer Zero   Marketplace   Admin
           │           │          │
           └───────────┼──────────┘
                       │
                 Same Connections
```

**Connector ownership:**
```
Tenant
    ├── Connector
    │     id
    │     provider
    │     auth
    │     scopes
    │     status
    │     owner
    │     permissions
```

**What's shared at tenant level:**
- OAuth tokens
- Refresh tokens
- Webhooks
- Sync cursors
- Provider schemas
- Field mappings
- Connector configuration

**What's frontend-specific:**
- UI preferences (layout, recent views, local state)

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| `GET` | `/api/v1/workspace/connectors` | List installed connectors | `{"connectors":[...]}` |
| `GET` | `/api/v1/workspace/connectors/catalog` | Full connector catalog (100+) | `{"connectors":[...],"domain":"SALES","total":45}` |
| `POST` | `/api/v1/workspace/connectors/nango-session` | Create sync session | `{"session_id":"...","status":"active"}` |
| `POST` | `/api/v1/workspace/connectors/:id/disconnect` | Disconnect connector | `{"success":true}` |
| `POST` | `/api/v1/workspace/register-connector` | Register new connector | `{"success":true,"connector_id":"..."}` |

**Flow Types:**
- `A` — OAuth (Nango-managed)
- `B` — API Key
- `C` — AI Provider

**Example Request — Register Connector:**
```bash
curl -X POST \
  -H "Authorization: Bearer $INTEGRATEWISE_API_TOKEN" \
  -H "x-tenant-id: $INTEGRATEWISE_TENANT_ID" \
  -H "Content-Type: application/json" \
  -d '{"provider":"salesforce","flowType":"A"}' \
  "https://gateway.dev.integratewise.ai/api/v1/workspace/register-connector"
```

**Example Response — Catalog:**
```json
{
  "connectors": [
    {
      "id": "salesforce",
      "name": "Salesforce",
      "category": "crm",
      "flowType": "A",
      "connectionMethod": "nango",
      "status": "available",
      "capabilities": {
        "auth": true,
        "webhook": true,
        "mcp": ["mcp:tools", "mcp:resources"]
      },
      "departments": ["SALES", "CUSTOMER_SUCCESS"],
      "industries": ["technology", "saas"],
      "mcpTools": ["sf_accounts", "sf_contacts", "sf_opportunities"],
      "supportedEntities": ["account", "person", "deal"],
      "authType": "oauth"
    },
    {
      "id": "hubspot",
      "name": "HubSpot",
      "category": "crm",
      "flowType": "A",
      "connectionMethod": "nango",
      "status": "available",
      "capabilities": {"auth": true, "webhook": true, "mcp": []},
      "departments": ["SALES", "MARKETING"],
      "industries": ["technology", "saas", "ecommerce"],
      "mcpTools": [],
      "supportedEntities": ["account", "person", "deal"],
      "authType": "oauth"
    }
  ],
  "domain": "SALES",
  "total": 45,
  "catalogSize": 100,
  "source": "integratewise-connectors",
  "accelerators": [...]
}
```

---

### Integrations

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `GET` | `/api/v1/integrations` | List connected integrations | - | `[{id, provider, status, ...}]` |
| `GET` | `/api/v1/integrations/:provider` | Connection status | - | `{id, provider, status, last_sync, ...}` |
| `POST` | `/api/v1/integrations/:provider/authorize` | Start OAuth flow | - | `{auth_url, state}` |
| `DELETE` | `/api/v1/integrations/:provider` | Disconnect integration | - | `{success: true}` |
| `GET` | `/api/v1/integrations/callback` | OAuth callback (public) | - | Redirect to app |

**Example Request — Start OAuth:**
```bash
curl -X POST \
  -H "Authorization: Bearer $INTEGRATEWISE_API_TOKEN" \
  -H "x-tenant-id: $INTEGRATEWISE_TENANT_ID" \
  "https://gateway.dev.integratewise.ai/api/v1/integrations/salesforce/authorize"
```

**Example Response:**
```json
{
  "auth_url": "https://connect.nango.dev/oauth/authorize?...",
  "state": "iw_state_abc123"
}
```

**Example Response — List Integrations:**
```json
[
  {
    "id": "conn_abc123",
    "provider": "salesforce",
    "status": "active",
    "last_sync": "2026-07-21T10:30:00Z",
    "entities_synced": 1250,
    "health": "healthy"
  },
  {
    "id": "conn_def456",
    "provider": "hubspot",
    "status": "active",
    "last_sync": "2026-07-21T10:25:00Z",
    "entities_synced": 890,
    "health": "healthy"
  }
]
```

---

### Capabilities

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `GET` | `/api/v1/capabilities` | List available capabilities | - | `{tier, capabilities:[...]}` |
| `POST` | `/api/v1/capabilities/resolve` | Execute capability | `{capability, params}` | `{resolved, result, governance}` |
| `GET` | `/api/v1/workbench/capabilities` | Capability manifest | - | `{capabilities:[...]}` |
| `GET` | `/api/v1/workbench/connected-ecosystem` | Ecosystem status | - | `{connected, available, ...}` |
| `POST` | `/api/v1/workbench/capability-plans/:id/execute` | Execute plan | `{params}` | `{execution_id, status, ...}` |

**Example Request — Execute Capability:**
```bash
curl -X POST \
  -H "Authorization: Bearer $INTEGRATEWISE_API_TOKEN" \
  -H "x-tenant-id: $INTEGRATEWISE_TENANT_ID" \
  -H "Content-Type: application/json" \
  -d '{"capability":"salesforce:read-accounts","params":{"limit":10}}' \
  "https://gateway.dev.integratewise.ai/api/v1/capabilities/resolve"
```

**Example Response:**
```json
{
  "resolved": true,
  "capability": "salesforce:read-accounts",
  "result": {
    "accounts": [
      {"id": "acc_001", "name": "Acme Corp", "industry": "Technology"},
      {"id": "acc_002", "name": "TechStart Inc", "industry": "Technology"}
    ],
    "total": 156,
    "page": 1
  },
  "governance": {
    "decision": "allowed",
    "reason": "Capability enabled for tenant tier"
  }
}
```

---

### Cognitive & Intelligence

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `POST` | `/api/v1/brainstorm` | AI brainstorm session | `{query, context}` | `{insights:[...]}` |
| `POST` | `/api/v1/cognitive/twin` | Twin reasoning | `{query, context}` | `{response, reasoning}` |
| `GET` | `/api/v1/cognitive/insights` | Get insights | - | `{insights:[...]}` |

---

### Twin & Proposals

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `POST` | `/api/v1/twin/handoff` | Twin handoff to human | `{proposal, context}` | `{handoff_id, status}` |
| `POST` | `/api/v1/twin/handoff/:id/approve` | Approve twin action | `{reason}` | `{success, decision}` |
| `POST` | `/api/v1/twin/handoff/:id/reject` | Reject twin action | `{reason}` | `{success, decision}` |

---

### MCP (Model Context Protocol)

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| `GET` | `/tools` | List available tools | `{tools:[...]}` |
| `POST` | `/tools/invoke` | Invoke a tool | `{result}` |
| `GET` | `/mcp` | MCP server info | `{name, version, tools}` |
| `GET` | `/sessions` | Active sessions | `{sessions:[...]}` |
| `GET` | `/config/mcp-server` | MCP server config | `{config}` |
| `GET` | `/v1/mcp/*` | MCP endpoints | - |

---

### Continuity Bridge

| Method | Endpoint | Description |
|--------|----------|-------------|
| `*` | `/api/v1/continuity-bridge/*` | Continuity state management |

---

### Webhooks (Inbound)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/webhooks/stripe` | Signature | Stripe webhooks |
| `POST` | `/webhooks/razorpay` | Signature | Razorpay webhooks |
| `POST` | `/webhooks/hubspot` | Signature | HubSpot webhooks |
| `POST` | `/webhooks/slack` | Signature | Slack events |
| `POST` | `/webhooks/github` | Signature | GitHub webhooks |
| `POST` | `/webhooks/billing` | Signature | Generic billing webhooks |

**Webhook Event Types:**
- `contact.created`, `contact.updated`
- `deal.created`, `deal.updated`
- `sync.completed`
- `ai.insight.generated`
- `billing.subscription.changed`, `billing.payment.failed`

---

### Public (No Auth)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `POST` | `/api/v1/public/contact` | Contact form submission | `{name, email, message}` | `{success: true}` |
| `POST` | `/api/v1/public/newsletter` | Newsletter signup | `{email}` | `{success: true}` |

---

### Metrics

| Method | Endpoint | Auth | Description | Response |
|--------|----------|------|-------------|----------|
| `GET` | `/metrics/signals` | Yes | Signal metrics and pipeline latency | `{recent_signals, hitl_pending, pipeline_latency}` |

---

## 📊 Entity Shapes

### SpineEntity
```json
{
  "id": "string",
  "entity_type": "account|person|deal|task|signal|event|document|campaign|invoice|ticket|project|incident|vendor|contract|engagement|note",
  "name": "string",
  "status": "string",
  "metadata": {},
  "source_tool": "string",
  "source_id": "string",
  "tenant_id": "string",
  "created_at": "ISO8601",
  "updated_at": "ISO8601",
  "provenance": {
    "source_tool_id": "string",
    "source_tool_name": "string",
    "raw_id": "string",
    "synced_at": "ISO8601",
    "confidence": 0.95
  }
}
```

### SharedWorkbench
```json
{
  "workspace_id": "string",
  "tenant_id": "string",
  "department": "string",
  "domain": "string",
  "user": {
    "id": "string",
    "name": "string",
    "role": "string"
  },
  "entities": {
    "account": [SpineEntity],
    "person": [SpineEntity],
    "deal": [SpineEntity],
    "task": [SpineEntity],
    "signal": [SpineEntity],
    "event": [SpineEntity],
    "document": [SpineEntity]
  },
  "relationships": [
    {
      "source": "string",
      "target": "string",
      "type": "string",
      "metadata": {}
    }
  ],
  "timeline": [
    {
      "id": "string",
      "type": "string",
      "title": "string",
      "timestamp": "ISO8601"
    }
  ],
  "memory": [
    {
      "id": "string",
      "type": "string",
      "content": {},
      "tags": ["string"]
    }
  ],
  "knowledge": {
    "topic_summaries": [],
    "learnings": [],
    "conversations": []
  },
  "signals": [
    {
      "id": "string",
      "severity": "info|warning|critical",
      "title": "string",
      "timestamp": "ISO8601"
    }
  ],
  "capabilities": [
    {
      "name": "string",
      "status": "active|inactive|error",
      "last_sync": "ISO8601"
    }
  ],
  "governance": [
    {
      "id": "string",
      "decision": "approved|rejected|pending",
      "capability": "string"
    }
  ],
  "readiness": {
    "overall_score": 0.85,
    "overall_state": "live|seeded|empty",
    "buckets": [
      {
        "capability": "string",
        "state": "live|seeded|empty",
        "score": 0.9,
        "coverage": 0.95
      }
    ]
  },
  "actions": [],
  "twinContext": {},
  "provenance": {
    "source": "spine",
    "confidence": 0.95,
    "last_sync": "ISO8601"
  },
  "composed_at": "ISO8601",
  "composed_by": "projection-engine",
  "projection_version": "1.0.0"
}
```

### Connector
```json
{
  "id": "string",
  "name": "string",
  "category": "crm|marketing|communication|project_management|productivity|analytics|finance|support|ecommerce|ai",
  "flowType": "A|B|C",
  "connectionMethod": "nango|api_wrapper|ai_provider",
  "status": "available|connected|error",
  "capabilities": {
    "auth": true,
    "webhook": true,
    "mcp": ["mcp:tools", "mcp:resources"]
  },
  "departments": ["SALES", "MARKETING"],
  "industries": ["technology", "saas"],
  "mcpTools": ["sf_accounts", "sf_contacts"],
  "supportedEntities": ["account", "person", "deal"],
  "authType": "oauth|api_key|none"
}
```

### Capability
```json
{
  "name": "string",
  "description": "string",
  "min_tier": "free|pro|enterprise",
  "channel": "sync|async|webhook"
}
```

---

## ⏱️ Rate Limits

| Category | Limit | Window |
|----------|-------|--------|
| General API | 100 requests | 1 minute |
| AI/Cognitive | 10 requests | 1 minute |

**Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1721580060
```

---

## 🔄 Common Patterns

### Making a Request
```bash
curl -X GET \
  https://gateway.dev.integratewise.ai/api/v1/workspace/projection/SALES \
  -H "Authorization: Bearer $INTEGRATEWISE_API_TOKEN" \
  -H "x-tenant-id: $INTEGRATEWISE_TENANT_ID"
```

### With JSON Body
```bash
curl -X POST \
  https://gateway.dev.integratewise.ai/api/v1/capabilities/resolve \
  -H "Authorization: Bearer $INTEGRATEWISE_API_TOKEN" \
  -H "x-tenant-id: $INTEGRATEWISE_TENANT_ID" \
  -H "Content-Type: application/json" \
  -d '{"capability":"salesforce:read-accounts","params":{"limit":10}}'
```

### With Query Parameters
```bash
curl -X GET \
  "https://gateway.dev.integratewise.ai/api/v1/workspace/entities?type=deal&limit=20" \
  -H "Authorization: Bearer $INTEGRATEWISE_API_TOKEN" \
  -H "x-tenant-id: $INTEGRATEWISE_TENANT_ID"
```

---

## 📊 Response Format

### Success (2xx)
```json
{
  "status": "success",
  "data": { /* response data */ }
}
```

### Error (4xx/5xx)
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "status": 400,
  "details": { /* optional details */ }
}
```

---

## 🚨 Error Codes

| Code | Status | Meaning |
|------|--------|---------|
| `Unauthorized` | 401 | Missing or invalid JWT |
| `Forbidden` | 403 | Insufficient permissions |
| `Not Found` | 404 | Resource not found |
| `Rate Limit Exceeded` | 429 | Too many requests |
| `Service Unavailable` | 503 | Downstream service down |

---

## 🔌 Connector Categories

| Category | Connectors |
|----------|------------|
| CRM | Salesforce, HubSpot, Pipedrive, Zoho CRM, Freshsales, Close |
| Marketing | Mailchimp, Marketo, SendGrid, Segment, Braze, Customer.io |
| Communication | Slack, Discord, Microsoft Teams, Gmail, Outlook, Zoom, Twilio |
| Project Management | Jira, GitHub, GitLab, Linear, Asana, Bitbucket |
| Productivity | Notion, Google Sheets, Google Drive, Airtable, Dropbox, OneDrive |
| Analytics | Mixpanel, Amplitude, Heap, Google Analytics, Tableau, Metabase |
| Finance | Stripe, Razorpay, QuickBooks, Xero, Chargebee, Paddle |
| Support | Zendesk, Freshdesk, Intercom, Help Scout, Kustomer, Front |
| E-commerce | Shopify, WooCommerce, BigCommerce |
| AI/LLM | OpenAI, Anthropic, Cohere, Perplexity |

---

## 🛠️ Integration Sources

| Source | Description |
|--------|-------------|
| `salesforce` | Salesforce CRM |
| `hubspot` | HubSpot CRM |
| `slack` | Slack workspace |
| `github` | GitHub repositories |
| `notion` | Notion databases |
| `jira` | Jira projects |
| `stripe` | Stripe payments |
| `google-sheets` | Google Sheets |
| `gmail` | Gmail inbox |
| `quickbooks` | QuickBooks accounting |

---

## 📚 SDK

```bash
npm install @integratewise/sdk
```

```typescript
import { IntegrateWise } from "@integratewise/sdk";

const client = new IntegrateWise({
  baseUrl: "https://gateway.dev.integratewise.ai",
  token: process.env.INTEGRATEWISE_API_TOKEN,
  context: {
    identity: {
      userId: "user-123",
      tenantId: process.env.INTEGRATEWISE_TENANT_ID,
      organizationId: "org-789"
    },
    request: { id: `req-${Date.now()}`, timestamp: Date.now(), version: "1.0" }
  }
});

// Discover capabilities
const capabilities = await client.capability.discover({ query: "salesforce" });

// Execute capability
const result = await client.capability.execute({
  capabilityId: "salesforce:read-accounts",
  input: { limit: 10 },
  context: client.context
});

// Store memory
await client.memory.store({
  type: "semantic",
  content: { insight: "Customer prefers email" },
  tags: ["sales", "communication"]
});

// Create proposal
const proposal = await client.proposals.create({
  action: "update-contact",
  reasoning: "Contact moved to new company",
  data: { contactId: "123", company: "Acme Inc" }
});
```

---

## 🎯 Get Started

1. **Get credentials** — Sign in via Clerk at `https://accounts.integratewise.ai/sign-in`
2. **Set environment variables** — `INTEGRATEWISE_API_TOKEN` and `INTEGRATEWISE_TENANT_ID`
3. **Verify access** — `GET /health`
4. **Explore connectors** — `GET /api/v1/workspace/connectors/catalog`
5. **Connect a source** — `POST /api/v1/workspace/register-connector`
6. **Read workbench** — `GET /api/v1/workspace/projection/SALES`
7. **Execute capabilities** — `POST /api/v1/capabilities/resolve`

---

**Platform Status:** ✅ Live & Production Ready  
**Gateway:** `https://gateway.dev.integratewise.ai`  
**Last Updated:** July 21, 2026

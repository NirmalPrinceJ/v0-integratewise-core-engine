# Two-Layer Connection Model: The Complete GTM Motion


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

## Overview

IntegrateWise operates on a **two-layer connection model**:

1. **Identity Layer** - AI Client ↔ IntegrateWise (user identity)
2. **Connectivity Layer** - IntegrateWise ↔ Customer Systems (system credentials)

This creates a **multiplicative effect**: One AI client connected to IntegrateWise automatically gets access to ALL systems IntegrateWise is connected to.

---

## Layer 1: Identity (AI Client → IntegrateWise)

### What Happens
User clicks IntegrateWise in marketplace app (Claude, ChatGPT, Perplexity, Replit, Lovable):

```
Step 1: Marketplace App
  User: "Click IntegrateWise"
  → Redirects to: https://integratewise.com/auth/authorize?app=claude&redirect_uri=...

Step 2: Identity Creation
  User enters: email@company.com + organization_name
  → Backend creates:
     • Tenant (if new)
     • User record
     • OAuth token for this specific AI client
  → Issues JWT token

Step 3: Return to Marketplace
  → Redirects back: claude-extension://callback?token=eyJhbGc...
  → Claude stores token locally
  → MCP client now has authentication

Step 4: AI Client Ready
  → Claude can now make MPC calls
  → All calls include: Authorization: Bearer {JWT}
```

**Result**: IntegrateWise knows which user/tenant is using Claude. Claude has a persistent identity in IntegrateWise.

---

## Layer 2: Connectivity (IntegrateWise ↔ Customer Systems)

### What Happens
Meanwhile, the company's admin has already connected customer systems to IntegrateWise:

```
Step 1: Admin Connects HubSpot
  Admin: "Connect HubSpot"
  → Redirects to HubSpot OAuth
  → User authorizes
  → IntegrateWise receives HubSpot OAuth token
  → Creates "Connectivity" record: tenant_id=X → hubspot_token=abc123

Step 2: Admin Connects Salesforce
  Admin: "Connect Salesforce"
  → Same flow
  → IntegrateWise receives Salesforce OAuth token
  → Creates "Connectivity" record: tenant_id=X → salesforce_token=def456

Step 3: Admin Connects Stripe
  Admin: "Connect Stripe"
  → Same flow
  → IntegrateWise receives Stripe OAuth token
  → Creates "Connectivity" record: tenant_id=X → stripe_token=ghi789

Step 4: Admin Connects 7 More Systems
  → Zendesk, Slack, GitHub, Jira, Google Workspace, Microsoft 365, Notion
  → Each creates a "Connectivity" record
  → Total: 10 systems connected to IntegrateWise for this tenant
```

**Result**: IntegrateWise has credentials for 10 customer systems. IntegrateWise can query/write to all of them on behalf of the tenant.

---

## The Multiplicative Effect

### Scenario

**Company A**:
- Has Claude connected (Layer 1: Identity)
- Has HubSpot, Salesforce, Stripe connected (Layer 2: Connectivity)

When Claude user asks: "Show me top 5 deals"

```
Claude (in MPC): GET /api/v1/spine/opportunities?limit=5

IntegrateWise receives:
  • JWT token: identifies tenant=CompanyA, user=alice@companyA.com
  • Request: opportunities (deals)

IntegrateWise logic:
  1. Validate JWT → Tenant=CompanyA
  2. Look up Connectivity records for CompanyA
     → Found: HubSpot, Salesforce, Stripe
  3. Query Spine → Opportunities table
  4. Spin hydrates from:
     → Salesforce (deals/opportunities)
     → HubSpot (deals)
     → Stripe (subscriptions → opportunities)
  5. Return merged + normalized data to Claude

Claude displays: Top 5 deals
```

---

## The Power: Multi-Client Cascade

### Scenario: Company B has 3 AI Clients Connected

**Layer 1 (Identity)**: 3 different AI clients, same tenant
- Claude Desktop connected (alice@companyB.com)
- ChatGPT connected (alice@companyB.com)
- Perplexity connected (alice@companyB.com)

**Layer 2 (Connectivity)**: 10 systems connected
- HubSpot, Salesforce, Stripe, Zendesk, Slack, GitHub, Jira, Google Workspace, Microsoft 365, Notion

**Result**: Each AI client can independently query all 10 systems

```
Claude asks: "What's our revenue this month?"
  → Queries Stripe (payment data)
  → Returns: $500k

ChatGPT asks: "Which deals are closing this week?"
  → Queries Salesforce (opportunity data)
  → Returns: 3 deals worth $2M

Perplexity asks: "Who is at risk of churning?"
  → Queries Zendesk + Stripe + HubSpot (support + churn signals)
  → Returns: 5 accounts at risk

All 3 AI clients see the SAME Spine data.
All 3 AI clients have access to ALL 10 systems.
```

---

## The Connection Flow: Step-by-Step

### For First-Time User (Identity Layer)

```
1. User opens Claude Desktop
2. Searches for "IntegrateWise"
3. Clicks "Connect IntegrateWise"
4. Redirected to: https://integratewise.com/auth/authorize?app=claude&redirect_uri=claude-extension://callback
5. User enters:
   - Email: alice@company.com
   - Organization: Acme Corp
6. User clicks "Authorize"
7. Backend creates:
   - Tenant("Acme Corp") if new
   - User("alice@company.com", tenant_id=X)
   - Creates OAuth token
8. Issues JWT: eyJhbGc...
9. Redirects back: claude-extension://callback?token=eyJhbGc...
10. Claude stores token
11. All future MPC calls include token
```

**Time**: 2 minutes
**Result**: Claude can make authenticated calls to IntegrateWise

---

### For Admin Connecting Systems (Connectivity Layer)

```
1. Admin goes to IntegrateWise dashboard (e.g., CloudFlare Pages frontend)
2. Clicks "Connect Salesforce"
3. Redirected to Salesforce OAuth
4. Admin authorizes
5. Salesforce redirects back with auth code
6. Backend exchanges auth code for Salesforce token
7. Backend stores: Connectivity(tenant_id=X, system="salesforce", token=abc123)
8. Dashboard shows: "Salesforce ✓ Connected"
9. Admin repeats for HubSpot, Stripe, etc.
```

**Time**: 5 minutes per system (10 systems = 50 minutes)
**Result**: IntegrateWise has credentials for 10 systems

---

## The Data Flow: End-to-End

### Example: Claude Asking "What's Our Cash Position?"

```
1. Claude (on user's laptop):
   MPC Call: GET /api/v1/spine/metrics/cash_position
   Headers: Authorization: Bearer {JWT_token}

2. IntegrateWise Gateway (Cloudflare Worker):
   • Validates JWT
   • Identifies: tenant="Acme Corp", user="alice@company.com"
   • Applies tenant_id filter automatically

3. Spine Query Service:
   Query: SELECT * FROM metrics WHERE tenant_id=X AND metric="cash_position"
   
4. Normalizer:
   "cash_position" metric depends on:
   • stripe_mrr (Monthly Recurring Revenue from Stripe)
   • bank_balance (from Bank API if connected)
   • payroll_run (from Gusto if connected)
   
5. Hydration:
   • Looks up Connectivity records: tenant=X
   • Finds: Stripe connected, Bank API connected, Gusto connected
   • Fetches:
     - Stripe: SELECT SUM(amount) FROM subscriptions
       → $500k MRR
     - Bank: GET /balance
       → $2M cash on hand
     - Gusto: GET /payroll_forecasted
       → $500k next 30 days

6. Calculation:
   cash_position = $2M (on hand) + $500k (MRR) - $500k (payroll)
                 = $2M runway

7. Return to Claude:
   { cash_position: 2000000, breakdown: {...}, currency: "USD" }

8. Claude (on user's laptop):
   Displays: "Your cash position is $2M"
```

**Key Insight**: Claude doesn't need to know about Stripe, Bank API, or Gusto. Claude just asks Spine. IntegrateWise figures out where to get the data.

---

## Architecture: Three Layers

```
┌─────────────────────────────────────────────────────────────┐
│ LAYER 1: IDENTITY (AI Clients)                              │
├─────────────────────────────────────────────────────────────┤
│ Claude Desktop  │ ChatGPT  │ Perplexity  │ Replit  │ Lovable│
│                                                              │
│ Each has:                                                   │
│ • JWT token (tenant + user scoped)                         │
│ • MPC client                                               │
│ • OAuth app configuration                                 │
│ • Redirect URI whitelisted                                │
└──────────────────────────┬──────────────────────────────────┘
                           │
                    OAuth Endpoint
              (CONTINUITY_BRIDGE_SIMPLE.md)
                           │
┌──────────────────────────┴──────────────────────────────────┐
│ LAYER 2: GATEWAY (Identity Validation)                     │
├─────────────────────────────────────────────────────────────┤
│ JWT Validator Middleware                                   │
│ • Validates token signature                                │
│ • Extracts tenant_id + user_id                             │
│ • Applies automatic tenant scoping                         │
│ • Forwards to service                                      │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────┐
│ LAYER 3: CONNECTIVITY (Customer Systems)                   │
├─────────────────────────────────────────────────────────────┤
│ Spine (Tenant-Scoped Data)                                │
│                           │                                │
│    ┌─────────────────────┼─────────────────────┐          │
│    ▼                      ▼                      ▼          │
│ HubSpot              Salesforce              Stripe         │
│ (credentials)       (credentials)         (credentials)    │
│ Connected via       Connected via          Connected via   │
│ OAuth token         OAuth token            OAuth token     │
│                                                             │
│ Result: All data queried, normalized, merged into Spine   │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Points

### 1. Identity is User + Tenant Scoped
```
JWT payload:
{
  "tenant_id": "acme-corp-123",
  "user_id": "alice@company.com",
  "app": "claude",
  "exp": 1719432000
}
```

Every API call filtered automatically by tenant_id.

### 2. Connectivity is Admin Configured
Admin connects HubSpot, Salesforce, Stripe once per company.
All users in that company can query those systems (if they have permission).

### 3. Multiplicative Effect
- 1 AI client × 10 connected systems = 10 data sources
- 5 AI clients × 10 connected systems = 50 combinations, but same Spine
- 5 AI clients × 28 connectors = 140 combinations, same Spine

### 4. Data Freshness
- Real-time queries (Stripe balance, Salesforce opportunities)
- Cached queries (company history, metrics)
- Mixed: Some from cache, some real-time

### 5. Failure Isolation
- If Stripe is down, Spine still returns HubSpot + Salesforce data
- If HubSpot is down, Spine still returns Salesforce + Stripe data
- Users see partial data, not errors

---

## Deployment Checklist

### Identity Layer (Day 1)
- [ ] OAuth endpoint deployed (CONTINUITY_BRIDGE_SIMPLE.md)
- [ ] JWT generation working
- [ ] All 5 marketplace apps configured
- [ ] Redirect URIs whitelisted
- [ ] Manual OAuth flow tested

### Gateway Layer (Day 1)
- [ ] JWT validator middleware added
- [ ] Feature gate middleware added
- [ ] Tenant scoping automatic on all queries
- [ ] No data leakage between tenants

### Connectivity Layer (Day 2)
- [ ] Connector handlers updated to store OAuth tokens
- [ ] Connectivity records created for each connected system
- [ ] Hydration logic updated to query connected systems
- [ ] Normalizer handles missing systems gracefully

### Verification (Day 2)
- [ ] Claude → IntegrateWise → Salesforce (full chain)
- [ ] ChatGPT → IntegrateWise → HubSpot (full chain)
- [ ] Multiple AI clients see same Spine data
- [ ] Failover: One system down, others still work

---

## What's Different (vs. Individual Integrations)

### Old Way (Direct Integration)
```
Claude → Salesforce (direct OAuth)
ChatGPT → Salesforce (direct OAuth)
Perplexity → Salesforce (direct OAuth)
Slack → Salesforce (direct OAuth)

Each connection: Separate OAuth, separate credentials, separate logic
```

### New Way (Via IntegrateWise)
```
Claude → IntegrateWise → Salesforce (OAuth once at Salesforce level)
ChatGPT → IntegrateWise → Salesforce (same Salesforce credentials)
Perplexity → IntegrateWise → Salesforce (same Salesforce credentials)
Slack → IntegrateWise → Salesforce (same Salesforce credentials)

One connection: Shared OAuth, shared credentials, merged logic
```

---

## Success Metrics

### Identity Layer
- OAuth success rate: > 99%
- JWT token validity: 24 hours
- Redirect success: 100% to all 5 apps

### Connectivity Layer
- Connected systems per tenant: 1-28
- Query time (Spine → System): < 500ms
- Failure isolation: Partial data returned

### Overall
- Time from "Click" to "Features Available": < 2 minutes
- AI clients seeing same Spine: 100%
- Data consistency: No stale data in Spine

---

## Summary

**Layer 1 (Identity)**: ChatGPT connects to IntegrateWise (user authenticated)
**Layer 2 (Connectivity)**: IntegrateWise connects to HubSpot, Salesforce, Stripe (company authorized)

**Result**: ChatGPT can query all 10 systems through IntegrateWise Spine.

**Multiplicative**: Add 5 AI clients and all 5 can query all 10 systems.

**Simple**: No complexity at AI client level. Just click → OAuth → Features.

# Two-Layer Connection Model: Visual Diagrams


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

## Diagram 1: The Complete Two-Layer Architecture

```
╔════════════════════════════════════════════════════════════════════╗
║                  LAYER 1: IDENTITY (AI Clients)                   ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  ┌─────────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ ┌────┐  ║
║  │   Claude    │  │ ChatGPT  │  │Perplexity│  │ Replit │ │Love│  ║
║  │  Desktop    │  │          │  │          │  │        │ │able│  ║
║  └──────┬──────┘  └────┬─────┘  └────┬─────┘  └───┬────┘ └──┬─┘  ║
║         │              │             │            │        │     ║
║  JWT Token         JWT Token    JWT Token    JWT Token  JWT Token║
║  (tenant_id)       (tenant_id)  (tenant_id) (tenant_id)(tenant_id)
║         │              │             │            │        │     ║
║         └──────────────┼─────────────┼────────────┼────────┘     ║
║                        │             │            │               ║
║                        └─────────────┴────────────┘               ║
║                                  │                                 ║
║                 ┌────────────────▼────────────────┐               ║
║                 │  CONTINUITY_BRIDGE (OAuth)      │               ║
║                 │ /auth/authorize endpoint        │               ║
║                 │ • JWT generation                │               ║
║                 │ • User + Tenant scoping         │               ║
║                 │ • Token validation              │               ║
║                 └────────────────┬────────────────┘               ║
║                                  │                                 ║
╠══════════════════════════════════════════════════════════════════════╣
║                                  │                                   ║
║                 ┌────────────────▼────────────────┐                ║
║                 │  GATEWAY (JWT Validation)       │                ║
║                 │ • Validate token signature      │                ║
║                 │ • Extract tenant_id + user_id   │                ║
║                 │ • Automatic tenant scoping      │                ║
║                 │ • Feature gate                  │                ║
║                 └────────────────┬────────────────┘                ║
║                                  │                                 ║
╠══════════════════════════════════════════════════════════════════════╣
║          LAYER 2: CONNECTIVITY (Customer Systems)                  ║
╠══════════════════════════════════════════════════════════════════════╣
║                                  │                                 ║
║                        ┌─────────▼─────────┐                      ║
║                        │   SPINE (D1)      │                      ║
║                        │ Tenant-scoped     │                      ║
║                        │ Normalized data   │                      ║
║                        └────────┬──────────┘                      ║
║                                 │                                 ║
║              ┌──────────────────┼──────────────────┐              ║
║              ▼                  ▼                  ▼              ║
║        ┌─────────────┐   ┌─────────────┐   ┌────────────┐        ║
║        │  HubSpot    │   │ Salesforce  │   │   Stripe   │        ║
║        │ (OAuth token)   │ (OAuth token)   │(OAuth token)        ║
║        └─────────────┘   └─────────────┘   └────────────┘        ║
║              ▼                  ▼                  ▼              ║
║         Contacts          Opportunities        Payments          ║
║         Companies          Accounts            Subscriptions     ║
║         Deals              Contacts            Customers         ║
║              │                  │                  │              ║
║              └──────────────────┼──────────────────┘              ║
║                                 │                                 ║
║              [+ 7 more systems] Zendesk, Slack, GitHub, etc.      ║
║                                                                    ║
║  Result: ChatGPT queries Spine.                                   ║
║           Spine fetches from ALL connected systems.               ║
║           ChatGPT sees merged, normalized data.                  ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
```

---

## Diagram 2: Single AI Client Query Flow

```
┌─ Claude User: "What's our revenue this month?"
│
├─ Claude MPC Call:
│  GET /api/v1/spine/metrics/revenue_this_month
│  Headers: Authorization: Bearer {JWT_token}
│
├─ Gateway validates JWT:
│  ✓ Signature valid
│  ✓ tenant_id = "acme-corp-123"
│  ✓ user_id = "alice@company.com"
│
├─ Spine query:
│  SELECT * FROM metrics
│  WHERE tenant_id = "acme-corp-123"
│  AND metric = "revenue_this_month"
│
├─ Hydration: Need data from:
│  • Stripe (subscriptions → revenue)
│  • NetSuite (invoices → revenue)
│  • Zuora (subscriptions → revenue)
│
├─ Fetches from all 3 (in parallel):
│  • Stripe: SELECT SUM(amount) FROM subscriptions WHERE created_at >= 2024-06-01
│  • NetSuite: SELECT SUM(total) FROM invoices WHERE date >= 2024-06-01
│  • Zuora: SELECT SUM(mrr) FROM subscriptions WHERE status="active"
│
├─ Returns to Claude:
│  {
│    "revenue_this_month": 500000,
│    "breakdown": {
│      "stripe": 250000,
│      "netsuite": 150000,
│      "zuora": 100000
│    },
│    "currency": "USD",
│    "updated_at": "2024-06-27T10:15:00Z"
│  }
│
└─ Claude displays: "Your revenue this month is $500k"
```

---

## Diagram 3: Multi-Client Cascade (The Power)

```
┌────────────────────────────────────────────────────────────────┐
│            Company: Acme Corp (tenant_id=123)                  │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  LAYER 1: 5 AI Clients Connected                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ • Claude (JWT: tenant=123, user=alice@acme.com)         │ │
│  │ • ChatGPT (JWT: tenant=123, user=alice@acme.com)        │ │
│  │ • Perplexity (JWT: tenant=123, user=alice@acme.com)     │ │
│  │ • Replit (JWT: tenant=123, user=alice@acme.com)         │ │
│  │ • Lovable (JWT: tenant=123, user=alice@acme.com)        │ │
│  └─────────────────────────────────────────────────────────┘ │
│           All authenticate same Identity (Acme Corp)          │
│                          │                                     │
│  LAYER 2: 10 Systems Connected                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ • HubSpot (token=abc123)      • Zendesk (token=mno456)  │ │
│  │ • Salesforce (token=def456)   • Slack (token=pqr789)    │ │
│  │ • Stripe (token=ghi789)       • GitHub (token=stu012)   │ │
│  │ • NetSuite (token=jkl012)     • Jira (token=vwx345)     │ │
│  │ • Google Workspace (token=...)• Microsoft 365 (token=...)│ │
│  └─────────────────────────────────────────────────────────┘ │
│                          │                                     │
│                  ┌───────▼────────┐                           │
│                  │  SPINE (D1)    │                           │
│                  │  Tenant=123    │                           │
│                  └────────────────┘                           │
│                          │                                     │
│  RESULT: 5 × 10 = 50 combinations, but 1 Spine              │
│                                                                │
│  • Claude queries Opportunities → Salesforce + HubSpot       │
│  • ChatGPT queries Revenue → Stripe + NetSuite               │
│  • Perplexity queries Health → Zendesk + Slack + GitHub     │
│  • Replit queries Tasks → Jira + GitHub                     │
│  • Lovable queries People → Google Workspace + Microsoft 365 │
│                                                                │
│  All 5 AI clients see the SAME Spine.                        │
│  All 5 AI clients can query ALL 10 systems.                  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Diagram 4: Connection Timeline (User Journey)

```
Day 0: Before Connection
├─ Company: No IntegrateWise
├─ AI Client: Claude exists but can't access company data
└─ Systems: HubSpot, Salesforce, Stripe (standalone)

Day 1: Marketplace Discovery
├─ User opens Claude Desktop
├─ Searches for "IntegrateWise"
├─ Clicks "Connect IntegrateWise"
└─ (5 minutes) Enters email + org name → OAuth complete

Day 1: Identity Layer Active
├─ IntegrateWise knows: alice@company.com + Acme Corp
├─ Claude has JWT token
├─ Claude can make MPC calls
└─ But... no systems connected yet

Day 2: Admin Connects Systems
├─ Admin goes to IntegrateWise dashboard
├─ Clicks "Connect HubSpot" → OAuth complete (2 min)
├─ Clicks "Connect Salesforce" → OAuth complete (2 min)
├─ Clicks "Connect Stripe" → OAuth complete (2 min)
└─ (50 minutes total) 10 systems connected

Day 2: Connectivity Layer Active
├─ IntegrateWise has credentials for 10 systems
├─ Spine is now hydrated with data from all 10
├─ Claude can query merged data
└─ ChatGPT (connected same day) also sees all 10

Result: Exponential Access
├─ 1 Claude (before): 0 integrations
├─ 1 Claude + 10 systems: 10 integrations
├─ 5 AI clients + 10 systems: Still 10 systems (shared)
└─ 5 AI clients + 28 systems: Still 28 systems (shared)
```

---

## Diagram 5: Data Access Flow (With Failure Isolation)

```
Claude: "Show me accounts at risk"
     │
     ├─ Query Spine: accounts_with_risk_score > 7
     │
     ├─ Spine tries to hydrate from:
     │  ├─ Zendesk (support tickets: high volume = risk)
     │  ├─ Stripe (churn rate: high = risk)
     │  ├─ Salesforce (NRR: declining = risk)
     │  └─ Slack (channel activity: low = risk)
     │
     ├─ What if Salesforce is down?
     │  ├─ Fetch from: Zendesk ✓, Stripe ✓, Slack ✓
     │  ├─ Skip: Salesforce ✗ (try again later)
     │  ├─ Return partial score (based on 3/4 signals)
     │  └─ Flag: "Salesforce data unavailable"
     │
     ├─ Claude receives:
     │  ├─ 8 accounts (Zendesk + Stripe + Slack data)
     │  ├─ Risk scores (partial)
     │  ├─ Warning: "Salesforce data unavailable"
     │  └─ (Retry Salesforce in background)
     │
     └─ Claude displays:
        "8 accounts at risk (Salesforce data pending)"
```

---

## Diagram 6: Feature Visibility (Binary State)

```
User Journey:

Before OAuth:
├─ Marketplace app shows "Connect IntegrateWise" button
├─ No MPC tools available
└─ No features visible

After OAuth (Identity Layer):
├─ JWT token stored
├─ MPC tools available
├─ But no systems connected yet
├─ Feature surface shows:
│  ├─ "Connect HubSpot" link
│  ├─ "Connect Salesforce" link
│  ├─ "Connect Stripe" link
│  └─ "Add more systems" button
└─ (Admin can start connecting systems)

After Systems Connected (Connectivity Layer):
├─ Spine is hydrated
├─ MPC tools can return data
├─ Feature surface shows:
│  ├─ ✓ Accounts (from Salesforce + HubSpot)
│  ├─ ✓ Opportunities (from Salesforce + HubSpot)
│  ├─ ✓ Revenue (from Stripe)
│  ├─ ✓ Health metrics (from Zendesk + Slack)
│  ├─ ✓ Risk scoring (from all 10 systems)
│  ├─ Agent Lee (orchestrator)
│  └─ Memory (shared context)
└─ (Full feature surface visible)
```

---

## Diagram 7: Admin Connectivity Dashboard

```
┌─ IntegrateWise Dashboard
├─ Organization: Acme Corp (tenant_id=123)
├─ Users Connected:
│  ├─ alice@company.com (Claude, ChatGPT, Perplexity)
│  ├─ bob@company.com (Claude)
│  └─ carol@company.com (ChatGPT)
│
├─ Connected Systems (10):
│  ├─ ✓ HubSpot (connected 2024-06-20, 142 accounts, 8 properties)
│  ├─ ✓ Salesforce (connected 2024-06-20, 500 opportunities, 15 fields)
│  ├─ ✓ Stripe (connected 2024-06-20, $2.5M MRR, 50 subscriptions)
│  ├─ ✓ NetSuite (connected 2024-06-21, 100 invoices/month)
│  ├─ ✓ Zendesk (connected 2024-06-21, 500 tickets/month)
│  ├─ ✓ Slack (connected 2024-06-22, 50 channels)
│  ├─ ✓ GitHub (connected 2024-06-22, 5 repositories)
│  ├─ ✓ Jira (connected 2024-06-23, 200 issues)
│  ├─ ✓ Google Workspace (connected 2024-06-23)
│  └─ ✓ Microsoft 365 (connected 2024-06-24)
│
├─ System Status:
│  ├─ HubSpot: Last sync 2m ago, 0 errors
│  ├─ Salesforce: Last sync 5m ago, 0 errors
│  ├─ Stripe: Last sync 30s ago, 0 errors
│  ├─ [...]
│  └─ All systems healthy
│
├─ Actions:
│  ├─ [+ Add System]
│  ├─ [Edit Permissions]
│  ├─ [View Activity Log]
│  └─ [Manage Users]
│
└─ Result: Admin sees all systems connected, all data flowing
```

---

## Summary of Visuals

1. **Layer 1**: AI clients authenticate with IntegrateWise
2. **Layer 2**: IntegrateWise authenticates with customer systems
3. **Cascade**: Multiple AI clients, multiple systems, one Spine
4. **Failure**: Partial data if one system is down (not error)
5. **Features**: Binary (not connected / fully connected)
6. **Dashboard**: Admin sees all connections at a glance

Key Insight: **Multiplicative, not additive**
- 1 AI client × 10 systems = 10 sources
- 5 AI clients × 10 systems = **still 10 sources** (shared Spine)
- Adding 1 more AI client = no additional system integrations needed

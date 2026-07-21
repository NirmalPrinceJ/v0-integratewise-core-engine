# ChatGPT Connector Registration for IntegrateWise


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

## Overview

IntegrateWise MCP Server is registered as a **ChatGPT Connector** allowing enterprise ChatGPT users to access:
- **spine.query** — unified operational data
- **spine.get** — entity details
- **memory.search** — organizational knowledge
- **memory.propose** — capture insights
- **spine.connected_sources** — connection status

ChatGPT can then use its own connectors (Salesforce, Gmail, etc.) to reach external tools, with IntegrateWise in the middle as the **continuity brain**.

## Architecture

```
ChatGPT Enterprise
  ├─ ChatGPT Connectors (Salesforce, Gmail, etc.)
  └─ IntegrateWise MCP Server (our connector)
       ├─ spine.query → D1 vault → Salesforce/Gmail data
       ├─ memory.search → vector DB → org knowledge
       └─ memory.propose → proposals table → triage bot

Result: ChatGPT can read unified data AND capture insights
```

## Registration Steps

### 1. Create Connector Metadata

Go to **ChatGPT Enterprise Settings** → **Connectors** → **Create Connector**

Fill in:

```
Name: IntegrateWise Spine
Description: Unified operational truth — query sales data, accounts, memories

Category: Data Integration
Authentication: OAuth 2.0

API Endpoint: https://mcp.integratewise.ai
Auth Endpoint: https://mcp.integratewise.ai/oauth/authorize
Token Endpoint: https://mcp.integratewise.ai/oauth/token

Schema Endpoint: https://mcp.integratewise.ai/schema.json
```

### 2. Configure OAuth (if using token-based auth)

**Option A: API Key Auth (simpler)**

```
Authentication Type: API Key
Header Name: Authorization
Header Format: Bearer {token}
```

Users will paste their MCP token in ConnectorSettings.

**Option B: OAuth (more secure)**

Create OAuth endpoints in gateway:

```
POST /oauth/authorize
  ↓
Generate authorization code
↓ (user grants permission in ChatGPT)
  ↓
POST /oauth/token (code) → MCP token
```

### 3. Register Tools

ChatGPT will query `https://mcp.integratewise.ai/schema.json` to discover tools.

Create endpoint:

```typescript
// services/mcp-connector/src/handlers/schema.ts
export async function getSchema(actor: SpineMcpActor) {
  return {
    tools: [
      {
        name: "spine.query",
        description: "Query unified operational data",
        inputSchema: { /* from spine-mcp-server.ts */ }
      },
      {
        name: "spine.get",
        description: "Get entity details"
        inputSchema: { /* ... */ }
      },
      // ... rest of tools
    ]
  }
}
```

### 4. Deploy MCP Server

The MCP server is already built in `services/mcp-connector/src/spine-mcp-server.ts`.

Deploy to CF Workers:

```bash
cd services/mcp-connector
npm run deploy
# → https://mcp.integratewise.ai
```

Ensure bindings:
- `CACHE_DB` → D1 database
- `SPINE_ENCRYPTION_KEY` → secrets
- `VECTORIZE` → vector index
- `CACHE` → KV namespace
- `MCP_SERVICE_SECRET` → shared secret with gateway

### 5. Test in ChatGPT

1. **Connect Connector:**
   - ChatGPT Settings → Connectors → IntegrateWise Spine
   - Authorize (OAuth) or paste API key
   - Test connection

2. **Test Tools:**
   - Ask ChatGPT: "What accounts are in the Spine?"
   - ChatGPT calls `spine.query` with entity_type="account"
   - Returns list of accounts with status, health, MRR

3. **Query Examples:**
   - "Find stalled deals in Salesforce"
   - "What patterns have we seen in renewals?"
   - "Summarize recent activities for Acme Corp"

## User Flow (ChatGPT Enterprise)

```
1. User opens ChatGPT Enterprise
2. Selects "IntegrateWise Spine" connector
3. AuthenticatesOAuth) → gets MCP token
4. Token stored in ChatGPT session
5. User asks question (e.g., "Show me high-risk accounts")
6. ChatGPT calls spine.query with MCP token
   ↓ (validated in mcp-connector/src/middleware/auth.ts)
7. Query executes against encrypted vault
8. Results returned to ChatGPT
9. ChatGPT generates natural language response
```

## Example Conversation

**User:** "What are my top 3 expansion opportunities this quarter?"

**ChatGPT (using IntegrateWise):**

```
Calling: spine.query({
  entity_type: "account",
  status: "active",
  health_trend: "improving",
  arr_over: 100000,
  limit: 3
})

Result: [
  { id: "acc-123", name: "Acme Corp", arr: 250000, health_score: 0.85 },
  { id: "acc-456", name: "TechCorp", arr: 180000, health_score: 0.78 },
  { id: "acc-789", name: "InnovateCo", arr: 150000, health_score: 0.82 }
]
```

**ChatGPT Response:**

> Your top 3 expansion opportunities this quarter are:
> 
> 1. **Acme Corp** ($250k ARR, 85% health)
>    - Healthy trend, receptive to upsells
>    - Recommendation: Schedule EBR next week
> 
> 2. **InnovateCo** ($150k ARR, 82% health)
>    - Rising health score indicates engagement
>    - Recommendation: Present new feature set
> 
> 3. **TechCorp** ($180k ARR, 78% health)
>    - Steady health, growth potential
>    - Recommendation: Evaluate expansion product fit

## Tier-Based Feature Access

**Free Tier:** (no ChatGPT access)

**Starter Tier:**
- ✅ spine.query
- ✅ spine.get
- ✅ spine.summary
- ✅ spine.connected_sources
- ✅ memory.search (semantic)
- ✅ memory.propose (to governance)

**Pro Tier:**
- All starter features +
- ✅ Advanced memory queries
- ✅ Custom entity types
- ✅ Report generation

**Enterprise Tier:**
- All features +
- ✅ Full audit logs
- ✅ Custom connectors
- ✅ Dedicated MCP instance

## Security

1. **Token Validation:**
   - 15-minute expiry
   - HMAC-SHA256 signed
   - Validates on every tool call
   - See `services/mcp-connector/src/middleware/auth.ts`

2. **Tenant Isolation:**
   - All queries scoped to tenant_id
   - Hard wall: tenant_id mismatch → 403 Forbidden
   - No cross-tenant data leakage

3. **Role-Based Access:**
   - Actor permissions derived from role + tier
   - Fine-grained checks in `middleware/actor.ts`
   - Tool access gated by permissions

4. **Encrypted Vault:**
   - All data at rest encrypted (AES-256)
   - Decryption key in CF Secrets (not queryable)
   - Vault reads always decrypt before returning

## Monitoring

Monitor via CF Analytics:

```
GET /api/v1/mcp/metrics
→ tool calls per hour
→ error rates
→ latency p50/p95
→ tenant activity
```

Add to dashboard:

```typescript
// services/gateway/src/metrics.ts
export async function getMcpMetrics(tenantId: string, hoursBack: number = 24) {
  // Query CF Analytics for MCP calls
  // Return: call_count, error_count, avg_latency, tools_used
}
```

## Troubleshooting

**"Connector not authorized"**
- User didn't authenticate OAuth
- Token expired (> 15 min)
- Solution: Re-authorize in ChatGPT settings

**"Entity type not configured"**
- Tenant doesn't have entity type enabled
- Solution: Admin enables in Settings → Spine Config

**"Connector not connected"**
- Tenant doesn't have data source enabled (e.g., Salesforce)
- Tool tried to query disconnected source
- Solution: Connect source in /connectors

**High latency**
- Vault queries slow (encrypted field searches)
- Solution: Pre-populate vectorize for memory searches

## Integration with Onboarding

When user completes onboarding:
1. Role + connectors stored in D1
2. tenant_spine_config populated
3. User can now authenticate ChatGPT connector
4. ChatGPT sees only authorized entity types + connectors

## Next: Auto-Approve Workflow

When ChatGPT calls `memory.propose()` to capture insight:

```
memory.propose({
  content_type: "insight",
  title: "Renewal Pattern: EBR → 85% renewal rate",
  body: "Accounts with quarterly EBRs renew at 85% vs 60% baseline",
  confidence: 0.92
})
  ↓
Triage Bot scores proposal
  ↓
Score ≥ 0.85 → auto-approve to org memory
  ↓
Next user asks: "What renewal patterns have we learned?"
  ↓
ChatGPT calls memory.search() → finds this insight
```

This closes the loop: ChatGPT captures knowledge, promotes to org memory, answers future questions.

## Files Summary

### Created
- `services/mcp-connector/src/middleware/auth.ts` (209 lines) - Token validation
- `services/mcp-connector/src/middleware/actor.ts` (327 lines) - Actor resolution

### Existing (Already Built)
- `services/mcp-connector/src/spine-mcp-server.ts` - MCP tool definitions
- `apps/web/lib/auth/connector-approval.ts` - OAuth flow

### To Create
- `services/mcp-connector/src/handlers/schema.ts` - ChatGPT schema endpoint
- `services/gateway/src/oauth.ts` - OAuth authorize/token endpoints
- `services/mcp-connector/src/handlers/proposal.ts` - Enhanced memory.propose

## Next Steps

1. ✅ Deploy MCP server to CF Workers
2. ⏳ Create schema endpoint (handlers/schema.ts)
3. ⏳ Register in ChatGPT Connector UI
4. ⏳ Test OAuth flow
5. ⏳ Verify tenant isolation + permission gating
6. ⏳ Load test (1000+ concurrent ChatGPT connections)
7. ⏳ Enable memory.propose governance loop

## Success Metrics

- ChatGPT connects successfully (< 1% auth failures)
- Queries execute < 500ms p50, < 2s p95
- Tenant isolation enforced (0 cross-tenant leaks)
- Memory proposals flow through triage bot (> 80% auto-approved)
- User engagement: avg 5+ queries/user/day

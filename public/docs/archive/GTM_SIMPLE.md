# GTM Motion: Simple Implementation


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

## The Motion

**Marketplace App + One OAuth Redirect = Connected**

User clicks IntegrateWise in marketplace → Redirects to IntegrateWise OAuth → Authorized → Features available.

That's it. No steps. No complexity.


## Flow Diagram

```
Marketplace App (Claude/ChatGPT/Perplexity)
    ↓
User clicks "Connect IntegrateWise"
    ↓
Redirect to: https://integratewise.com/auth?app=claude&redirect_uri=...
    ↓
IntegrateWise OAuth (tenant creation + user auth)
    ↓
Redirect back to: https://claude.extension/connected?token=JWT
    ↓
Feature surface fully available
```


## Implementation (Simple)

### 1. OAuth Endpoint

**Location:** `services/continuity-bridge/src/routes/oauth.ts`

```typescript
// GET /oauth
export async function handleOAuth(request: Request) {
  const url = new URL(request.url);
  const app = url.searchParams.get('app'); // 'claude', 'chatgpt', 'perplexity'
  const redirectUri = url.searchParams.get('redirect_uri');
  
  // Store state
  const state = crypto.randomUUID();
  await KV.put(`oauth:${state}`, JSON.stringify({
    app,
    redirectUri,
    createdAt: Date.now()
  }), { expirationTtl: 600 }); // 10 min expiry
  
  // Show OAuth form (email + org)
  return showOAuthForm(state, app);
}

// POST /oauth/authorize
export async function handleAuthorize(request: Request) {
  const { state, email, orgName } = await request.json();
  
  // Get stored state
  const stateData = await KV.get(`oauth:${state}`);
  if (!stateData) throw new Error('Invalid state');
  
  const { app, redirectUri } = JSON.parse(stateData);
  
  // Create tenant + user + JWT
  const tenant = await createTenant(orgName);
  const user = await createUser(email, tenant.id);
  const token = createJWT({ userId: user.id, tenantId: tenant.id });
  
  // Redirect back to app with token
  return redirect(`${redirectUri}?token=${token}&app=${app}`);
}
```

### 2. Feature Gate

**Location:** `services/frontend/src/hooks/useIntegrateWise.ts`

```typescript
export function useIntegrateWise() {
  const token = getTokenFromURL();
  
  if (!token) {
    return {
      connected: false,
      features: []
    };
  }
  
  // Token present = everything available
  return {
    connected: true,
    features: [
      'read_spine',
      'write_decision',
      'query_memory',
      'invoke_agent_lee',
      'create_task'
    ]
  };
}
```

### 3. Feature Surface

**Location:** `services/frontend/src/components/IntegrateWisePanel.tsx`

```typescript
export function IntegrateWisePanel() {
  const { connected, features } = useIntegrateWise();
  
  if (!connected) {
    return (
      <div>
        <button onClick={() => startOAuth()}>
          Connect IntegrateWise
        </button>
      </div>
    );
  }
  
  // Connected = show everything
  return (
    <div>
      <SpineQueryBuilder />
      <AgentLeeRecommendations />
      <MemorySearch />
      <DecisionLog />
      <TaskSync />
    </div>
  );
}
```

### 4. Multi-Frontend Support

**Each marketplace app points to same OAuth endpoint:**

```
Claude Desktop:
  URL: https://integratewise.com/auth?app=claude&redirect_uri=claude-extension://callback

ChatGPT Action:
  URL: https://integratewise.com/auth?app=chatgpt&redirect_uri=https://chatgpt.com/integratewise/callback

Perplexity:
  URL: https://integratewise.com/auth?app=perplexity&redirect_uri=https://perplexity.com/integratewise/callback

Replit:
  URL: https://integratewise.com/auth?app=replit&redirect_uri=https://replit.com/integratewise/callback

Lovable:
  URL: https://integratewise.com/auth?app=lovable&redirect_uri=https://lovable.dev/integratewise/callback
```

All redirect back with JWT. All show full feature surface.


## Key Points

1. **One OAuth endpoint** - All apps use same endpoint
2. **Simple state machine** - Not connected → Connected (binary)
3. **Full features on connection** - No progressive activation
4. **Multiple frontends** - Same logic, different redirect URIs
5. **JWT token** - Tenant + user scoped

## Deployment Checklist

- [ ] OAuth endpoint deployed
- [ ] State management (KV) working
- [ ] JWT generation verified
- [ ] All 5 marketplace apps redirect configured
- [ ] Feature gate logic verified
- [ ] First test: manual OAuth flow
- [ ] Second test: verify all marketplace apps redirect correctly


## Success = Click → OAuth → Features

That's the entire motion. Simple. Repeatable. Scales to infinite marketplace apps.


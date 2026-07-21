# How to Build on IntegrateWise Platform

Guide for external frontend apps consuming the platform.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Your Frontend App                        │
├─────────────────────────────────────────────────────────────┤
│  React / Next.js / Vue / Svelte / React Native / Flutter   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              IntegrateWise Gateway                          │
│         https://gateway.dev.integratewise.ai                │
├─────────────────────────────────────────────────────────────┤
│  Auth (JWT) → Tenant Resolution → Rate Limiting → Routing  │
└─────────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
      ┌──────────┐   ┌──────────┐   ┌──────────┐
      │Connector │   │  Spine   │   │Capability│
      │  APIs    │   │  Data    │   │  Engine  │
      └──────────┘   └──────────┘   └──────────┘
            │               │               │
            ▼               ▼               ▼
      Salesforce      Accounts        Execute
      HubSpot         Contacts        Actions
      Slack           Deals           Govern
      GitHub          Tasks           Approve
```

---

## Quick Start (5 minutes)

### 1. Get Credentials

```bash
# Sign in via OAuth
open "https://gateway.dev.integratewise.ai/api/v1/auth/descope?provider=google"

# After login, you get:
export INTEGRATEWISE_API_TOKEN="eyJhbGci..."
export INTEGRATEWISE_TENANT_ID="tenant_abc123"
```

### 2. Verify Access

```bash
curl -H "Authorization: Bearer $INTEGRATEWISE_API_TOKEN" \
     -H "x-tenant-id: $INTEGRATEWISE_TENANT_ID" \
     https://gateway.dev.integratewise.ai/health

# → {"status":"ok","service":"gateway","ts":...}
```

### 3. Fetch Data

```bash
# Get your workspace data
curl -H "Authorization: Bearer $INTEGRATEWISE_API_TOKEN" \
     -H "x-tenant-id: $INTEGRATEWISE_TENANT_ID" \
     https://gateway.dev.integratewise.ai/api/v1/workspace/projection/SALES

# → Full workbench with accounts, contacts, deals, tasks
```

---

## Use Cases

### 1. CRM Dashboard

Build a sales dashboard showing accounts, deals, and pipeline.

```typescript
// Fetch sales workbench
const workbench = await fetch(
  "https://gateway.dev.integratewise.ai/api/v1/workspace/projection/SALES",
  {
    headers: {
      "Authorization": `Bearer ${token}`,
      "x-tenant-id": tenantId,
    },
  }
).then(r => r.json());

// Render
const accounts = workbench.entities.account || [];
const deals = workbench.entities.deal || [];
const tasks = workbench.entities.task || [];

return (
  <Dashboard>
    <Metrics accounts={accounts.length} deals={deals.length} />
    <AccountList accounts={accounts} />
    <DealPipeline deals={deals} />
    <TaskList tasks={tasks} />
  </Dashboard>
);
```

---

### 2. Integration Marketplace

Let users connect data sources (Salesforce, HubSpot, etc.).

```typescript
// Get available connectors
const catalog = await fetch(
  "https://gateway.dev.integratewise.ai/api/v1/workspace/connectors/catalog",
  {
    headers: {
      "Authorization": `Bearer ${token}`,
      "x-tenant-id": tenantId,
    },
  }
).then(r => r.json());

// Render marketplace
return (
  <Marketplace>
    {catalog.connectors.map(connector => (
      <ConnectorCard
        key={connector.id}
        name={connector.name}
        category={connector.category}
        status={connector.status}
        onConnect={() => connectConnector(connector.id)}
      />
    ))}
  </Marketplace>
);

// Connect a connector
async function connectConnector(connectorId: string) {
  // 1. Start OAuth flow
  const { auth_url } = await fetch(
    `https://gateway.dev.integratewise.ai/api/v1/integrations/${connectorId}/authorize`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "x-tenant-id": tenantId,
      },
    }
  ).then(r => r.json());

  // 2. Redirect user
  window.location.href = auth_url;
}
```

---

### 3. AI Assistant

Build an AI assistant that can query workspace data.

```typescript
// Ask AI to analyze data
const response = await fetch(
  "https://gateway.dev.integratewise.ai/api/v1/brainstorm",
  {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "x-tenant-id": tenantId,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: "What are the top 5 deals this quarter?",
      context: { department: "SALES" },
    }),
  }
).then(r => r.json());

// response.insights = [
//   { title: "Top Deal", value: "Acme Corp - $120K", confidence: 0.95 },
//   ...
// ]
```

---

### 4. Automated Workflows

Execute capabilities programmatically.

```typescript
// Read data from Salesforce
const accounts = await fetch(
  "https://gateway.dev.integratewise.ai/api/v1/capabilities/resolve",
  {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "x-tenant-id": tenantId,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      capability: "salesforce:read-accounts",
      params: { limit: 100, filter: { industry: "Technology" } },
    }),
  }
).then(r => r.json());

// Process and write back
for (const account of accounts.result.accounts) {
  await fetch(
    "https://gateway.dev.integratewise.ai/api/v1/capabilities/resolve",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "x-tenant-id": tenantId,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        capability: "salesforce:update-account",
        params: {
          id: account.id,
          fields: { last_reviewed: new Date().toISOString() },
        },
      }),
    }
  );
}
```

---

### 5. Mobile App

React Native integration.

```typescript
import { IntegrateWise } from "@integratewise/sdk";

// Initialize client
const client = new IntegrateWise({
  baseUrl: "https://gateway.dev.integratewise.ai",
  token: await AsyncStorage.getItem("token"),
  context: {
    identity: {
      userId: "mobile-user",
      tenantId: await AsyncStorage.getItem("tenantId"),
      organizationId: "org-789",
    },
    request: {
      id: `req-${Date.now()}`,
      timestamp: Date.now(),
      version: "1.0",
    },
  },
});

// Fetch data
const workbench = await client.capability.discover({ limit: 20 });

// Render
return (
  <View>
    <Text>Deals: {workbench.entities.deal.length}</Text>
    <FlatList
      data={workbench.entities.deal}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <DealCard deal={item} />
      )}
    />
  </View>
);
```

---

## React Hooks

### useWorkbench

```typescript
function useWorkbench(token: string, tenantId: string, department: string) {
  const [workbench, setWorkbench] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(
      `https://gateway.dev.integratewise.ai/api/v1/workspace/projection/${department}`,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "x-tenant-id": tenantId,
        },
      }
    )
      .then(r => r.json())
      .then(setWorkbench)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [token, tenantId, department]);

  return { workbench, loading, error };
}

// Usage
function Dashboard() {
  const { workbench, loading } = useWorkbench(token, tenantId, "SALES");
  
  if (loading) return <Spinner />;
  
  return (
    <div>
      <h1>Sales Dashboard</h1>
      <p>Accounts: {workbench.entities.account.length}</p>
      <p>Deals: {workbench.entities.deal.length}</p>
    </div>
  );
}
```

### useConnectors

```typescript
function useConnectors(token: string, tenantId: string) {
  const [connectors, setConnectors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://gateway.dev.integratewise.ai/api/v1/workspace/connectors/catalog", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "x-tenant-id": tenantId,
      },
    })
      .then(r => r.json())
      .then(data => setConnectors(data.connectors))
      .finally(() => setLoading(false));
  }, [token, tenantId]);

  const connect = async (connectorId: string) => {
    const { auth_url } = await fetch(
      `https://gateway.dev.integratewise.ai/api/v1/integrations/${connectorId}/authorize`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "x-tenant-id": tenantId,
        },
      }
    ).then(r => r.json());
    window.location.href = auth_url;
  };

  return { connectors, loading, connect };
}
```

### useCapabilities

```typescript
function useCapabilities(token: string, tenantId: string) {
  const [capabilities, setCapabilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://gateway.dev.integratewise.ai/api/v1/workbench/capabilities", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "x-tenant-id": tenantId,
      },
    })
      .then(r => r.json())
      .then(data => setCapabilities(data.capabilities))
      .finally(() => setLoading(false));
  }, [token, tenantId]);

  const execute = async (capabilityId: string, params: any) => {
    const res = await fetch(
      "https://gateway.dev.integratewise.ai/api/v1/capabilities/resolve",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "x-tenant-id": tenantId,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ capability: capabilityId, params }),
      }
    ).then(r => r.json());
    return res;
  };

  return { capabilities, loading, execute };
}
```

---

## Complete Example

```typescript
import { useWorkbench } from "./hooks/useWorkbench";
import { useConnectors } from "./hooks/useConnectors";
import { useCapabilities } from "./hooks/useCapabilities";

function IntegrateWiseApp({ token, tenantId }) {
  const { workbench } = useWorkbench(token, tenantId, "SALES");
  const { connectors, connect } = useConnectors(token, tenantId);
  const { capabilities, execute } = useCapabilities(token, tenantId);

  return (
    <div className="app">
      {/* Header */}
      <header>
        <h1>IntegrateWise</h1>
        <p>Tenant: {tenantId}</p>
      </header>

      {/* Integrations */}
      <section>
        <h2>Connected Integrations</h2>
        {connectors
          .filter(c => c.status === "connected")
          .map(connector => (
            <div key={connector.id}>
              <span>{connector.name}</span>
              <span>{connector.status}</span>
            </div>
          ))}
        <button onClick={() => connect("salesforce")}>
          + Connect Salesforce
        </button>
      </section>

      {/* Data */}
      <section>
        <h2>Workspace Data</h2>
        <div className="metrics">
          <div>Accounts: {workbench?.entities?.account?.length || 0}</div>
          <div>Deals: {workbench?.entities?.deal?.length || 0}</div>
          <div>People: {workbench?.entities?.person?.length || 0}</div>
        </div>
        
        <h3>Recent Deals</h3>
        {workbench?.entities?.deal?.slice(0, 5).map(deal => (
          <div key={deal.id}>
            <span>{deal.name}</span>
            <span>{deal.metadata.amount}</span>
          </div>
        ))}
      </section>

      {/* Capabilities */}
      <section>
        <h2>Available Actions</h2>
        {capabilities.map(cap => (
          <button
            key={cap.id}
            onClick={() => execute(cap.id, { limit: 10 })}
          >
            {cap.name}
          </button>
        ))}
      </section>
    </div>
  );
}
```

---

## Environment Variables

```bash
# Required
INTEGRATEWISE_API_TOKEN=eyJhbG...      # JWT from OAuth
INTEGRATEWISE_TENANT_ID=tenant_abc123   # Your workspace tenant ID

# Optional
INTEGRATEWISE_BASE_URL=https://gateway.dev.integratewise.ai
INTEGRATEWISE_USER_ID=user-123
INTEGRATEWISE_ORG_ID=org-789
```

---

## Error Handling

```typescript
import { ApiError } from "@integratewise/sdk";

async function safeFetch<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof ApiError) {
      switch (error.status) {
        case 401:
          // Token expired — refresh or redirect to login
          redirectToLogin();
          break;
        case 403:
          // No permission — show error
          showError("You don't have permission to access this resource");
          break;
        case 429:
          // Rate limited — retry after delay
          const retryAfter = error.details?.retryAfter || 60;
          await new Promise(r => setTimeout(r, retryAfter * 1000));
          return safeFetch(fn);
        default:
          console.error(error);
      }
    }
    return null;
  }
}
```

---

## Resources

- **API Reference:** [docs/api/PLATFORM_API.md](./PLATFORM_API.md)
- **SDK:** `npm install @integratewise/sdk`
- **GitHub:** https://github.com/NirmalPrinceJ/integratewise-live
- **Gateway:** `https://gateway.dev.integratewise.ai`

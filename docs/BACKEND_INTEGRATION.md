# Backend Integration Guide — Customer Zero + IntegrateWise Platform

Customer Zero now connects directly to the **IntegrateWise Platform Gateway** (`https://gateway.dev.integratewise.ai`). This guide shows how to use all backend platform features.

---

## Quick Start

### 1. Set Environment Variables

Add to `.env.local`:

```bash
# IntegrateWise Platform credentials
NEXT_PUBLIC_INTEGRATEWISE_API_TOKEN=eyJhbGci...
NEXT_PUBLIC_INTEGRATEWISE_TENANT_ID=tenant_abc123
```

### 2. Use Platform Provider

Your app is already wrapped with `PlatformProvider` in the root layout. No setup needed!

### 3. Use Hooks in Components

```typescript
import { usePlatform, useWorkspaceProjection } from '@/lib/platform';

export function Dashboard() {
  const { client } = usePlatform();
  const { data, loading } = useWorkspaceProjection(client, 'SALES');

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Sales Workbench</h1>
      <p>Accounts: {data?.entities?.account?.length}</p>
      <p>Deals: {data?.entities?.deal?.length}</p>
    </div>
  );
}
```

---

## Platform Features

### Workspace Projection

Fetch complete department workbench data:

```typescript
const { client } = usePlatform();
const workbench = await client.getWorkspaceProjection('SALES');

// Access all department data
console.log(workbench.entities.account);    // Accounts
console.log(workbench.entities.deal);       // Deals
console.log(workbench.entities.person);     // Contacts
console.log(workbench.relationships);       // Entity relationships
console.log(workbench.signals);             // Real-time signals
```

**Supported Departments:**
- `SALES` — Sales operations
- `CUSTOMER_SUCCESS` — CS/Support
- `MARKETING` — Marketing campaigns
- `PRODUCT_ENGINEERING` — Engineering
- `FINANCE` — Finance & accounting
- `SERVICE` — Support services
- `PROCUREMENT` — Vendor management
- `BIZOPS` — Business operations
- `REVOPS` — Revenue operations
- `PERSONAL` — Personal workspace

### Connectors & Integrations

**List Available Connectors:**

```typescript
const { connectors, loading, error } = useConnectors(client);

connectors.forEach(connector => {
  console.log(connector.name);        // "Salesforce"
  console.log(connector.status);      // "available" or "connected"
  console.log(connector.category);    // "crm"
});
```

**Connect a Connector (OAuth Flow):**

```typescript
const { integrations, authorize } = useIntegrations(client);

async function connectSalesforce() {
  const { auth_url } = await authorize('salesforce');
  window.location.href = auth_url;
}
```

**List All Connected Integrations:**

```typescript
const integrations = await client.listIntegrations();

integrations.forEach(int => {
  console.log(int.provider);       // "salesforce"
  console.log(int.status);         // "active"
  console.log(int.last_sync);      // ISO timestamp
  console.log(int.entities_synced); // 1250
});
```

### Capabilities — Execute Actions

Capabilities are composable actions across your connected ecosystem.

**List Available Capabilities:**

```typescript
const { capabilities, execute, loading } = useCapabilities(client);

capabilities.forEach(cap => {
  console.log(cap.name);           // "salesforce:read-accounts"
  console.log(cap.description);    // Human description
  console.log(cap.min_tier);       // "free" or "pro"
});
```

**Execute a Capability:**

```typescript
// Read Salesforce accounts
const result = await execute('salesforce:read-accounts', {
  limit: 100,
  filter: { industry: 'Technology' },
});

console.log(result.result.accounts);  // Array of accounts
```

### Intelligence & Cognitive

**Brainstorm/AI Analysis:**

```typescript
const { query, loading } = useBrainstorm(client);

const insights = await query(
  'What are the top 5 deals this quarter?',
  { department: 'SALES' }
);

console.log(insights.insights);  // Array of AI-generated insights
```

**Twin Reasoning:**

```typescript
const reasoning = await client.twinReasoning(
  'Should we increase the discount on this deal?',
  { dealId: 'deal_123', context: 'quarterly_review' }
);

console.log(reasoning.response);    // AI reasoning
console.log(reasoning.reasoning);   // Detailed thought process
```

### Twin Handoff — Human-in-the-Loop

Proposals get human approval before execution:

```typescript
// Twin proposes an action
const { handoff_id } = await client.handoffToHuman(
  {
    action: 'update_deal_stage',
    dealId: 'deal_123',
    newStage: 'closed_won',
  },
  { approver: 'manager', priority: 'high' }
);

// Later: Human approves
await client.approveTwinHandoff(handoff_id, 'Looks good!');

// Or rejects
await client.rejectTwinHandoff(handoff_id, 'Need more info');
```

### Onboarding Flow

Guide new users through workspace setup:

```typescript
const { state, initialize, complete, getProgress } = useOnboarding(client);

// Check onboarding status
console.log(state.status);        // "not_started", "in_progress", "completed"
console.log(state.currentStep);   // "profile", "connectors", etc.

// Initialize Spine (Phase 5)
const { tenantConfig, syncJobs } = await initialize(
  'SALES',              // domain
  'technology',         // industry
  'Sales',              // department
  [
    { provider: 'salesforce', flowType: 'A' },
    { provider: 'hubspot', flowType: 'A' },
  ]
);

// Monitor sync progress
const progress = await getProgress();
console.log(progress.jobs);  // [{ jobId, connector, status, progress }]

// Complete onboarding (Phase 6)
const { redirectUrl } = await complete({
  preferences: { theme: 'dark', notifications: true }
});

window.location.href = redirectUrl;
```

---

## API Route Proxy

All platform requests automatically go through `/api/platform/[...path]`:

```typescript
// Direct client usage
const result = await client.getWorkspaceProjection('SALES');

// Under the hood, this calls:
// GET /api/platform/api/v1/workspace/projection/SALES
//
// Which forwards to:
// GET https://gateway.dev.integratewise.ai/api/v1/workspace/projection/SALES
```

Your backend route adds authentication headers automatically.

---

## Direct Client Usage

If you need direct control, use the client:

```typescript
import { createPlatformClient } from '@/lib/platform';

const client = createPlatformClient({
  token: process.env.INTEGRATEWISE_API_TOKEN!,
  tenantId: process.env.INTEGRATEWISE_TENANT_ID!,
});

// Use all methods
const workbench = await client.getWorkspaceProjection('SALES');
const capabilities = await client.listCapabilities();
const insights = await client.brainstorm('Query...', {});
```

---

## Error Handling

```typescript
try {
  const workbench = await client.getWorkspaceProjection('SALES');
} catch (error) {
  if (error.message.includes('Unauthorized')) {
    // Token expired — refresh or redirect to login
    redirectToLogin();
  } else if (error.message.includes('Forbidden')) {
    // No permission
    showError('You don\'t have permission for this action');
  } else if (error.message.includes('Rate Limited')) {
    // Retry after delay
    setTimeout(() => retry(), 5000);
  }
}
```

---

## Rate Limits

| Category | Limit | Window |
|----------|-------|--------|
| General API | 100 requests | 1 minute |
| AI/Cognitive | 10 requests | 1 minute |

Rate limit headers in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1721580060
```

---

## Architecture

```
Customer Zero App
       │
       ▼
   Components (useHooks)
       │
       ▼
   usePlatform() Hook
       │
       ▼
   PlatformClient
       │
       ▼
   /api/platform/[...path] (Next.js Route)
       │
       ▼
   Gateway (https://gateway.dev.integratewise.ai)
       │
       ├─→ Spine (Data)
       ├─→ Connectors (Integrations)
       ├─→ Capabilities (Actions)
       ├─→ Intelligence (AI)
       ├─→ Pipeline (Data Flow)
       └─→ Agent Runtime (Twins)
```

---

## Files

| File | Purpose |
|------|---------|
| `/lib/platform/api/client.ts` | Gateway API client |
| `/lib/platform/hooks/use-platform.ts` | React hooks for all features |
| `/lib/platform/provider.tsx` | Context provider |
| `/lib/platform/index.ts` | Exports & documentation |
| `/app/api/platform/[...path]/route.ts` | API proxy |
| `/docs/PLATFORM_API.md` | Full API reference |
| `/docs/SERVICE_TOPOLOGY.md` | Architecture & routing |
| `/docs/ONBOARDING_FLOW.md` | Onboarding endpoints |
| `/docs/HOW_TO_USE.md` | Build guide |

---

## Examples

### Build a Sales Dashboard

```typescript
import { usePlatform, useWorkspaceProjection } from '@/lib/platform';

export function SalesDashboard() {
  const { client } = usePlatform();
  const { data, loading } = useWorkspaceProjection(client, 'SALES');

  if (loading) return <Spinner />;

  const accounts = data?.entities?.account || [];
  const deals = data?.entities?.deal || [];

  return (
    <div>
      <h1>Sales Dashboard</h1>
      <MetricsCard
        title="Total Accounts"
        value={accounts.length}
      />
      <MetricsCard
        title="Active Deals"
        value={deals.filter(d => d.status === 'open').length}
      />
      <AccountList accounts={accounts} />
      <DealPipeline deals={deals} />
    </div>
  );
}
```

### Connect a New Integration

```typescript
import { useIntegrations } from '@/lib/platform';

export function IntegrationMarketplace() {
  const { integrations, authorize } = useIntegrations(client);

  return (
    <div>
      {integrations.map(int => (
        <div key={int.id}>
          <h3>{int.name}</h3>
          <p>{int.description}</p>
          {int.status === 'connected' ? (
            <Badge>Connected</Badge>
          ) : (
            <Button onClick={() => authorize(int.id)}>
              Connect {int.name}
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
```

### AI-Powered Assistant

```typescript
import { useBrainstorm } from '@/lib/platform';

export function AiAssistant() {
  const { query, loading } = useBrainstorm(client);
  const [input, setInput] = useState('');
  const [insights, setInsights] = useState([]);

  const handleAsk = async () => {
    const result = await query(input, { department: 'SALES' });
    setInsights(result.insights);
  };

  return (
    <div>
      <Input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Ask about your data..."
      />
      <Button onClick={handleAsk} disabled={loading}>
        {loading ? 'Thinking...' : 'Ask'}
      </Button>
      <InsightsList insights={insights} />
    </div>
  );
}
```

---

## Next Steps

1. **Set credentials** in `.env.local`
2. **Import hooks** in components
3. **Fetch data** using `useWorkspaceProjection`, `useConnectors`, etc.
4. **Execute actions** with `useCapabilities`
5. **Deploy** and watch the platform work!

---

**Gateway:** `https://gateway.dev.integratewise.ai`  
**API Reference:** `/docs/PLATFORM_API.md`  
**GitHub:** `https://github.com/NirmalPrinceJ/integratewise-live`

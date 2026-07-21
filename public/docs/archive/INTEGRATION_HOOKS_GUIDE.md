# Integration Hooks Guide — Multi-App & Backend Connectivity


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

## Overview

The `@integratewise/domain-shells` package now includes **7 comprehensive integration hooks** that connect:

- **Multi-app Portfolio:** Cross-domain navigation between Revops, SalesOps, Admin, Personal, etc.
- **Backend Services:** Spine (SSOT), Memory (conversations), Governance (approvals), Connected Apps
- **Real-time Sync:** Automatic data synchronization with retry logic
- **RBAC Integration:** Permission-based rendering and navigation
- **Signal Detection:** Intelligence overlay powered by platform signals

All hooks are fully typed with TypeScript and follow React best practices.

---

## Hook Reference

### 1. `useDomainNavigation()`

Cross-app navigation bridge for 12-app portfolio.

```typescript
import { useDomainNavigation } from '@integratewise/domain-shells';

function App() {
  const { allDomains, accessibleDomains, navigateToDomain } = useDomainNavigation();

  return (
    <div>
      {/* Show only accessible domains based on user permissions */}
      {accessibleDomains.map(domain => (
        <button
          key={domain.id}
          onClick={() => navigateToDomain(domain.id)}
        >
          {domain.name}
        </button>
      ))}
    </div>
  );
}
```

**Returns:**
- `allDomains: DomainApp[]` — All 12 workbenches (unfiltered)
- `accessibleDomains: DomainApp[]` — RBAC-filtered domains
- `navigateToDomain(domainId: string)` — Navigate to domain

**Domains Included:**
- Account Success (`/workspace`)
- RevOps (`/revops`)
- SalesOps (`/salesops`)
- Personal (`/personal`)
- Admin (`/admin` - requires `admin` permission)

---

### 2. `useBackendSync(config?)`

Real-time backend data synchronization with retry logic.

```typescript
import { useBackendSync } from '@integratewise/domain-shells';

function Dashboard() {
  const { syncing, lastSync, performSync } = useBackendSync({
    interval: 30000, // Sync every 30 seconds
    retryAttempts: 3,
    onSync: (data) => {
      console.log('Synced data:', data);
    },
    onError: (error) => {
      console.error('Sync failed:', error);
    },
  });

  return (
    <div>
      {syncing && <p>Syncing...</p>}
      {lastSync && <p>Last synced: {lastSync.toLocaleTimeString()}</p>}
      <button onClick={performSync}>Sync Now</button>
    </div>
  );
}
```

**Config:**
- `interval?: number` — Milliseconds between syncs (default: 30000)
- `retryAttempts?: number` — Number of retry attempts (default: 3)
- `onSync?: (data) => void` — Callback on successful sync
- `onError?: (error) => void` — Callback on sync failure

**Returns:**
- `syncing: boolean` — Is currently syncing
- `lastSync: Date | null` — Last successful sync time
- `performSync()` — Trigger manual sync

---

### 3. `useSpineData(entityType)`

Fetch and cache Spine SSOT entity data with TTL.

```typescript
import { useSpineData } from '@integratewise/domain-shells';

function AccountsList() {
  const { data: accounts, loading, error, refetch } = useSpineData('account');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {accounts.map(account => (
        <div key={account.id}>{account.name}</div>
      ))}
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

**Cache:**
- 5-minute TTL per entity type
- Automatic cache invalidation
- Manual refetch available

**Returns:**
- `data: SpineEntity[]` — Array of entities from Spine
- `loading: boolean` — Is loading
- `error: Error | null` — Error if fetch failed
- `refetch()` — Manual refresh

---

### 4. `useSignalDetection()`

Intelligence signal detection and classification.

```typescript
import { useSignalDetection } from '@integratewise/domain-shells';

function IntelligencePanel() {
  const {
    signals,
    loading,
    getSignalsByType,
    getHighSeveritySignals,
  } = useSignalDetection();

  const risks = getSignalsByType('risk');
  const criticalSignals = getHighSeveritySignals();

  return (
    <div>
      <h3>Critical Signals ({criticalSignals.length})</h3>
      {criticalSignals.map(signal => (
        <div
          key={signal.id}
          className={`severity-${signal.severity}`}
        >
          {signal.title}
        </div>
      ))}

      <h3>Risks ({risks.length})</h3>
      {risks.map(risk => (
        <div key={risk.id}>{risk.description}</div>
      ))}
    </div>
  );
}
```

**Signal Types:**
- `risk` — High-risk signals requiring attention
- `opportunity` — Growth opportunities
- `insight` — Data insights
- `action` — Recommended actions

**Severity Levels:**
- `critical` — Immediate action required
- `high` — Should address soon
- `medium` — Worth monitoring
- `low` — Informational
- `info` — Background info

**Returns:**
- `signals: Signal[]` — All detected signals
- `loading: boolean` — Is loading
- `filteredSignals: Signal[]` — Filtered results
- `filterSignals(filters)` — Filter signals
- `getSignalsByType(type)` — Get signals by type
- `getHighSeveritySignals()` — Get critical + high

---

### 5. `useMemoryIntegration()`

Conversational memory persistence and retrieval.

```typescript
import { useMemoryIntegration } from '@integratewise/domain-shells';

function ChatInterface() {
  const { messages, loading, addMessage, reload } = useMemoryIntegration();

  const handleSendMessage = (content: string) => {
    addMessage({
      role: 'user',
      content,
    });

    // Chat logic here...
  };

  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id} className={`message-${msg.role}`}>
          {msg.content}
        </div>
      ))}
      <input
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSendMessage(e.currentTarget.value);
          }
        }}
      />
    </div>
  );
}
```

**Returns:**
- `messages: ConversationMessage[]` — All messages in current session
- `loading: boolean` — Is loading conversation history
- `addMessage(message)` — Add message to memory
- `reload()` — Reload conversation history

---

### 6. `useGovernanceIntegration()`

Governance approvals and workflows.

```typescript
import { useGovernanceIntegration } from '@integratewise/domain-shells';

function ApprovalCenter() {
  const { workflows, loading, pendingApprovals, reload } = useGovernanceIntegration();

  return (
    <div>
      <h3>Pending Approvals ({pendingApprovals.length})</h3>
      {pendingApprovals.map(workflow => (
        <div key={workflow.id}>
          <p>{workflow.type}</p>
          <p>Requested by: {workflow.requester}</p>
          <p>Approvers: {workflow.approvers.join(', ')}</p>
          <button>Review</button>
        </div>
      ))}
      <button onClick={reload}>Refresh Approvals</button>
    </div>
  );
}
```

**Workflow Statuses:**
- `pending` — Awaiting approval
- `approved` — Approved
- `rejected` — Rejected
- `cancelled` — Cancelled

**Returns:**
- `workflows: ApprovalWorkflow[]` — All workflows
- `loading: boolean` — Is loading
- `pendingApprovals()` — Only pending workflows
- `reload()` — Refresh workflows

---

### 7. `useConnectedAppsSync()`

External app data synchronization (ChatGPT, HubSpot, Slack, etc.).

```typescript
import { useConnectedAppsSync } from '@integratewise/domain-shells';

function ConnectedAppsPanel() {
  const { apps, syncing, triggerSync } = useConnectedAppsSync();

  return (
    <div>
      <h3>Connected Apps</h3>
      {apps.map(app => (
        <div key={app.id}>
          <span>{app.name}</span>
          <span className={`status-${app.status}`}>
            {app.status}
          </span>
          <button
            onClick={() => triggerSync(app.id)}
            disabled={syncing}
          >
            {syncing ? 'Syncing...' : 'Sync'}
          </button>
        </div>
      ))}
      <button
        onClick={() => triggerSync()}
        disabled={syncing}
      >
        Sync All
      </button>
    </div>
  );
}
```

**App Statuses:**
- `connected` — Connected and synced
- `disconnected` — Not connected
- `syncing` — Currently syncing
- `error` — Sync error

**Returns:**
- `apps: ConnectedApp[]` — All connected apps
- `syncing: boolean` — Is syncing
- `triggerSync(appId?)` — Sync specific or all apps

---

## Usage Patterns

### Pattern 1: Multi-Domain App Switcher

```typescript
function DomainSwitcher() {
  const { accessibleDomains, navigateToDomain } = useDomainNavigation();

  return (
    <nav>
      {accessibleDomains.map(domain => (
        <button
          key={domain.id}
          onClick={() => navigateToDomain(domain.id)}
        >
          {domain.icon} {domain.name}
        </button>
      ))}
    </nav>
  );
}
```

### Pattern 2: Real-time Dashboard

```typescript
function RealTimeDashboard() {
  // Auto-sync every 30 seconds with error handling
  useBackendSync({
    interval: 30000,
    onSync: (data) => console.log('Dashboard updated'),
    onError: (error) => console.error('Sync failed, will retry'),
  });

  const accounts = useSpineData('account');
  const signals = useSignalDetection();

  return (
    <div>
      <Stats accounts={accounts.data} />
      <Signals signals={signals.getHighSeveritySignals()} />
    </div>
  );
}
```

### Pattern 3: Intelligence Overlay

```typescript
function IntelligenceOverlay() {
  const signals = useSignalDetection();

  return (
    <aside>
      <h3>Intelligence ({signals.signals.length})</h3>
      
      <section>
        <h4>Risks</h4>
        {signals.getSignalsByType('risk').map(risk => (
          <Alert key={risk.id} signal={risk} />
        ))}
      </section>

      <section>
        <h4>Opportunities</h4>
        {signals.getSignalsByType('opportunity').map(opp => (
          <Opportunity key={opp.id} signal={opp} />
        ))}
      </section>
    </aside>
  );
}
```

### Pattern 4: Integrated Workbench

```typescript
function AccountSuccessWorkbench() {
  const { user } = usePlatform();
  const { accessibleDomains } = useDomainNavigation();
  const { syncing } = useBackendSync({ interval: 30000 });
  const accounts = useSpineData('account');
  const signals = useSignalDetection();

  return (
    <div>
      <Sidebar domains={accessibleDomains} />
      <Header user={user} syncing={syncing} />
      <Dashboard
        accounts={accounts.data}
        signals={signals.signals}
      />
      <IntelligencePanel signals={signals.signals} />
    </div>
  );
}
```

---

## Type Definitions

All hooks are fully typed:

```typescript
// Signals
type SignalType = 'risk' | 'opportunity' | 'insight' | 'action';
type SignalSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

interface Signal {
  id: string;
  type: SignalType;
  severity: SignalSeverity;
  title: string;
  description: string;
  source: string;
  confidence: number; // 0-100
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Spine Entities
interface SpineEntity {
  id: string;
  type: string;
  name: string;
  [key: string]: any;
}

// Domain Apps
interface DomainApp {
  id: string;
  name: string;
  path: string;
  icon: React.ReactNode;
  requiresPermission?: string;
}

// Workflows
interface ApprovalWorkflow {
  id: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  requester: string;
  approvers: string[];
  createdAt: Date;
  expiresAt?: Date;
}

// Connected Apps
interface ConnectedApp {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  lastSync?: Date;
  nextSync?: Date;
}
```

---

## Performance Considerations

1. **Spine Data Caching:** 5-minute TTL prevents excessive API calls
2. **Backend Sync Retry:** Automatic retry with exponential backoff
3. **Memory Integration:** Lazy-loads conversation history
4. **Signal Detection:** Filters signals client-side to minimize API calls
5. **Connected Apps:** Batches sync operations

---

## Integrating with Your Backend

All hooks use the `useGateway()` SDK to call your backend. Wire them by:

1. **Ensure Gateway SDK is installed:** `npm install @integratewise/gateway-sdk`
2. **Configure backend endpoints** in `/api/gateway/*` routes
3. **Test with real data** using the hooks in your workbench

Example backend integration:

```typescript
// /api/gateway/entity/route.ts
export async function GET(req: Request) {
  const { orgId, entityType } = req.nextUrl.searchParams;
  
  // Fetch from Spine SSOT
  const data = await spine.getEntities(orgId, entityType);
  return Response.json(data);
}
```

---

## Summary

These 7 hooks provide enterprise-grade integration:

✅ Multi-app portfolio navigation
✅ Real-time backend synchronization
✅ Spine SSOT data caching
✅ Intelligence signal detection
✅ Conversational memory persistence
✅ Governance workflow management
✅ External app synchronization

Use them to build seamless, production-ready workbenches across all 12+ frontend apps.

# Phase 4: Gateway SDK Foundation


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

The minimal, reusable SDK that every frontend imports. Platform capabilities only—no business logic.

## What It Does

The Gateway SDK is a **thin HTTP client** that:
- Handles authentication (Stack Auth tokens → Gateway tokens)
- Manages request/response envelopes
- Implements retry logic with exponential backoff
- Provides React hooks for common patterns
- Streams SSE and WebSocket events
- Handles errors consistently
- Provides TypeScript types for all namespaces

## What It Does NOT Do

- Business logic (getting "customers" vs "deals")
- UI components
- State management beyond request/response caching
- Feature flags or A/B testing

Those belong in the application layer.

---

## File Structure

```
packages/gateway-sdk/
├── package.json
├── tsconfig.json
├── src/
│   ├── client/
│   │   ├── index.ts              # createGatewayClient()
│   │   ├── httpClient.ts         # HTTP request logic
│   │   ├── auth.ts               # Stack Auth token → Gateway token exchange
│   │   ├── retry.ts              # Exponential backoff
│   │   └── envelope.ts           # Request/response shape
│   ├── hooks/
│   │   ├── index.ts
│   │   ├── useGateway.ts         # Get client context
│   │   ├── useQuery.ts           # Fetch + cache + refetch
│   │   ├── useMutation.ts        # POST/PUT/DELETE + error handling
│   │   ├── useStream.ts          # SSE streaming
│   │   ├── useRealtime.ts        # WebSocket subscriptions
│   │   └── useInfinite.ts        # Pagination with cursor
│   ├── types/
│   │   ├── index.ts
│   │   ├── auth.ts               # AuthToken, GatewayToken, User
│   │   ├── request.ts            # Request envelope
│   │   ├── response.ts           # Response envelope
│   │   ├── error.ts              # Error types
│   │   └── namespaces.ts         # Workspace, Memory, Twin, etc.
│   ├── errors/
│   │   ├── index.ts
│   │   ├── GatewayError.ts
│   │   ├── AuthError.ts
│   │   └── handlers.ts           # Error handling strategies
│   ├── realtime/
│   │   ├── index.ts
│   │   ├── websocket.ts          # WebSocket manager
│   │   ├── eventEmitter.ts       # Event subscription
│   │   └── reconnection.ts       # Automatic reconnect
│   ├── cache/
│   │   ├── index.ts
│   │   ├── queryCache.ts         # SWR-like cache
│   │   └── invalidation.ts       # Cache busting strategies
│   ├── context/
│   │   ├── index.ts
│   │   ├── GatewayProvider.tsx   # React context provider
│   │   └── useGatewayContext.ts
│   ├── mock/
│   │   ├── index.ts
│   │   ├── mockClient.ts         # In-memory client for testing
│   │   └── fixtures.ts           # Sample data
│   └── index.ts                  # Public API
├── __tests__/
│   ├── client.test.ts
│   ├── auth.test.ts
│   ├── hooks.test.ts
│   └── realtime.test.ts
└── README.md
```

---

## Public API (Main Exports)

### 1. Client Creation

```typescript
import { createGatewayClient } from '@packages/gateway-sdk'

const gateway = createGatewayClient({
  gatewayUrl: 'https://gateway.integratewise.com',
  stackAuthToken: '<from-stack-auth>',
  org_id: 'org_456',
  team_id: 'team_789'
})

// On success, gateway.auth returns Gateway token
// Automatically renewed on expiry
```

### 2. Request Method

```typescript
const response = await gateway.request({
  namespace: 'workspace',
  action: 'listEntities',
  version: 'v1',
  params: {
    type: 'customer',
    limit: 50
  }
})

// Returns: { success: true, data: {...}, context: {...} }
```

### 3. React Hook: useQuery

```typescript
import { useQuery } from '@packages/gateway-sdk'

function CustomerList() {
  const { data, isLoading, error, refetch } = useQuery({
    namespace: 'workspace',
    action: 'listEntities',
    params: { type: 'customer' }
  })

  if (isLoading) return <Loading />
  if (error) return <Error error={error} />

  return (
    <>
      {data.entities.map(e => <Customer key={e.id} entity={e} />)}
      <button onClick={refetch}>Refresh</button>
    </>
  )
}
```

### 4. React Hook: useMutation

```typescript
import { useMutation } from '@packages/gateway-sdk'

function UpdateCustomer({ customerId }) {
  const mutation = useMutation({
    namespace: 'workspace',
    action: 'updateEntity',
    onSuccess: () => queryClient.invalidateQueries('workspace')
  })

  const handleUpdate = async (changes) => {
    await mutation.mutate({
      params: { id: customerId, ...changes }
    })
  }

  return (
    <form onSubmit={e => {
      e.preventDefault()
      handleUpdate({ status: 'active' })
    }}>
      <button disabled={mutation.isLoading}>
        {mutation.isLoading ? 'Saving...' : 'Save'}
      </button>
    </form>
  )
}
```

### 5. React Hook: useRealtime

```typescript
import { useRealtime } from '@packages/gateway-sdk'

function LiveCustomers() {
  const events = useRealtime({
    namespaces: ['workspace'],
    filters: { workspace: { type: 'customer' } }
  })

  useEffect(() => {
    const unsubscribe = events.subscribe((event) => {
      console.log('Customer updated:', event.entity_id)
      queryClient.invalidateQueries('workspace')
    })
    return unsubscribe
  }, [])

  return <div>Listening for live updates...</div>
}
```

### 6. React Hook: useStream

```typescript
import { useStream } from '@packages/gateway-sdk'

function Search({ query }) {
  const { isStreaming, results, error, stop } = useStream({
    namespace: 'workspace',
    action: 'search',
    params: { query }
  })

  return (
    <div>
      {results.map(r => <Result key={r.id} result={r} />)}
      {isStreaming && <LoadingIndicator />}
      {error && <Error error={error} />}
      <button onClick={stop}>Stop</button>
    </div>
  )
}
```

### 7. Mock Client (for testing)

```typescript
import { createMockGateway } from '@packages/gateway-sdk/mock'

const gateway = createMockGateway({
  fixtures: {
    'workspace.listEntities': [
      { id: 'ent_1', type: 'customer', name: 'Acme' },
      { id: 'ent_2', type: 'customer', name: 'TechCorp' }
    ]
  }
})

// Behaves identically to real Gateway
// No network calls, no auth needed
```

---

## Type Definitions

```typescript
// From packages/gateway-sdk/src/types/index.ts

export interface GatewayRequest {
  namespace: 'workspace' | 'memory' | 'twin' | 'approvals' | 'integrations' | 'skills' | 'entity360' | 'identity'
  action: string
  version?: string
  params: Record<string, any>
  context?: {
    request_id?: string
    trace_id?: string
  }
}

export interface GatewayResponse<T = any> {
  success: boolean
  data?: T
  error?: GatewayError
  context: {
    request_id: string
    processed_at: number
    latency_ms: number
  }
}

export interface GatewayError {
  code: string
  message: string
  details?: Record<string, any>
  request_id: string
  timestamp: number
}

export interface User {
  user_id: string
  org_id: string
  team_id: string
  role: string
  permissions: string[]
}

export interface GatewayToken {
  access_token: string
  refresh_token?: string
  expires_at: number
  scope: string[]
}
```

---

## Configuration

```typescript
// packages/gateway-sdk/src/client/index.ts

interface GatewayClientOptions {
  // Required
  gatewayUrl: string
  stackAuthToken: string
  org_id: string
  team_id: string

  // Optional
  maxRetries?: number            // default: 3
  retryDelay?: number            // default: 1000ms
  requestTimeout?: number        // default: 30000ms
  cacheTime?: number             // default: 60000ms
  staleTime?: number             // default: 0ms (immediately stale)

  // Callbacks
  onAuthRefresh?: (token: GatewayToken) => void
  onError?: (error: GatewayError) => void
  onRateLimit?: (retryAfter: number) => void
}
```

---

## Example: Provider Setup

```typescript
// apps/ai-workspace/app/layout.tsx

import { GatewayProvider } from '@packages/gateway-sdk'
import { useAuth } from '@packages/auth-sdk'

export default function RootLayout({ children }) {
  const { stackAuthToken, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return (
    <GatewayProvider
      gatewayUrl={process.env.NEXT_PUBLIC_GATEWAY_URL}
      stackAuthToken={stackAuthToken}
      org_id={getCurrentOrgId()}
      team_id={getCurrentTeamId()}
    >
      {children}
    </GatewayProvider>
  )
}
```

---

## Retry & Error Handling

```typescript
// Automatic retry with exponential backoff
// Retries on: 408, 429, 500, 502, 503, 504
// Not on: 400, 401, 403, 404, 409

// Example: fails with 429 (rate limit)
// Retry 1: wait 1000ms → fails
// Retry 2: wait 2000ms → fails
// Retry 3: wait 4000ms → succeeds

// On auth error (401)
// No retry — request onAuthRefresh callback
// App must get new Stack Auth token
// Gateway SDK automatically exchanges it for new Gateway token
```

---

## Testing

```typescript
// apps/ai-workspace/__tests__/customers.test.tsx

import { renderHook, waitFor } from '@testing-library/react'
import { createMockGateway } from '@packages/gateway-sdk/mock'
import { GatewayProvider } from '@packages/gateway-sdk'
import { useQuery } from '@packages/gateway-sdk'

test('loads customers', async () => {
  const gateway = createMockGateway({
    fixtures: {
      'workspace.listEntities': {
        entities: [
          { id: '1', type: 'customer', name: 'Acme' }
        ]
      }
    }
  })

  const wrapper = ({ children }) => (
    <GatewayProvider gateway={gateway}>
      {children}
    </GatewayProvider>
  )

  const { result } = renderHook(() =>
    useQuery({
      namespace: 'workspace',
      action: 'listEntities',
      params: { type: 'customer' }
    }),
    { wrapper }
  )

  await waitFor(() => expect(result.current.isLoading).toBe(false))
  expect(result.current.data.entities).toHaveLength(1)
})
```

---

## Implementation Checklist

- [ ] Create `packages/gateway-sdk` folder structure
- [ ] Implement HTTP client and envelope handling
- [ ] Implement auth token exchange (Stack → Gateway)
- [ ] Implement retry logic with backoff
- [ ] Implement React hooks (useQuery, useMutation, useStream, useRealtime)
- [ ] Implement cache invalidation strategies
- [ ] Implement mock client for testing
- [ ] Implement WebSocket manager for realtime
- [ ] Write comprehensive tests
- [ ] Write documentation
- [ ] Create example app using Gateway SDK
- [ ] Publish to npm registry

---

## Next Steps

1. Build Gateway SDK Foundation (this phase)
2. Use it in AI Workspace (Phase 5)
3. Validate all namespace contracts work
4. Document patterns other apps should follow
5. Migrate Wise Docs, Wise Ops, Wise ERMS, Wise Branding (Phase 6+)

Every app after AI Workspace will import the same SDK and follow the same patterns. No variations.

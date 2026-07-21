# IntegrateWise API Integration - Implementation Complete

## Overview

The frontend is now fully integrated with the **IntegrateWise Gateway API**. All data flows through real API calls, not mock data. The Spine schema is loaded dynamically based on user workspace configuration.

## What Was Built

### 1. Authentication Layer (`/lib/integratewise/auth.ts`)

- OAuth redirect handling (Google sign-in)
- JWT token parsing and storage
- Session management with localStorage
- Token refresh logic
- Error handling for expired credentials

**Key Functions:**
```typescript
getStoredSession()          // Get user's stored JWT & tenant ID
storeSession(session)       // Save auth credentials
clearSession()              // Logout
isSessionValid(session)     // Check if token is still valid
parseJwt(token)            // Parse JWT payload
getOAuthUrl(provider)      // Get OAuth redirect URL
```

### 2. API Client (`/lib/integratewise/client.ts`)

Complete wrapper around the Gateway API with all endpoints:

**Workspace & Data:**
- `getWorkbench(department)` — Get SharedWorkbench for department
- `getEntities(type?, limit)` — Query Spine entities
- `getReadiness()` — Get readiness scores

**Connectors:**
- `getConnectors()` — List connected connectors
- `getConnectorCatalog()` — All available connectors
- `registerConnector(provider, flowType)` — Add connector
- `startConnectorAuth(provider)` — OAuth flow
- `disconnectConnector(id)` — Disconnect

**Integrations:**
- `getIntegrations()` — List active integrations
- `getIntegration(provider)` — Check status
- `disconnectIntegration(provider)` — Disconnect

**Capabilities:**
- `getCapabilities()` — List available capabilities
- `executeCapability(name, params)` — Run capability

**Onboarding:**
- `getOnboardingState()` — Current progress
- `initializeSpine(config)` — Initialize workspace
- `completeOnboarding(prefs)` — Mark complete
- `getProgress()` — Poll sync jobs

**Health:**
- `health()` — Quick health check
- `readiness()` — Full service readiness

### 3. React Hooks (`/lib/integratewise/hooks.ts`)

Reusable hooks for consuming the API in components:

```typescript
// Authentication
const { session, loading } = useAuthSession()

// Workspace data
const { workbench, loading, error } = useWorkbench(session, 'SALES')

// Connectors
const { connectors, loading, connect, disconnect } = useConnectors(session)

// Integrations
const { integrations, loading } = useIntegrations(session)

// Onboarding
const { state, loading } = useOnboarding(session)

// Capabilities
const { capabilities, execute } = useCapabilities(session)

// Entities
const { entities, loading } = useEntities(session, 'deal', 50)
```

### 4. Type Definitions (`/lib/integratewise/types.ts`)

Full TypeScript types for all Spine data structures:

- `SpineEntity` — Canonical entity (account, person, deal, etc.)
- `SharedWorkbench` — Department projection
- `Connector` — Integration definition
- `Department` — Valid domains (SALES, MARKETING, etc.)
- `OnboardingState` — Onboarding progress
- `SyncJob` — Data sync status

### 5. Login Page (`/app/login/page.tsx`)

Complete authentication interface:

- OAuth redirect button (Google)
- Manual token/tenant ID entry
- Session storage
- Auto-redirect to dashboard if logged in
- Error handling

### 6. Dashboard Page (`/app/app/work/dashboard/page.tsx`)

Real workbench dashboard that:

- Requires authentication
- Loads workbench data from Gateway API
- Shows dynamic metrics (accounts, deals, people, tasks)
- Displays readiness scores
- Shows entities from Spine
- Lists signals/alerts
- Shows capabilities

## Data Flow

```
User Login
    ↓
[/app/login/page.tsx]
    ↓
OAuth redirect to Gateway
    ↓
User authenticates with Google
    ↓
Gateway redirects with JWT + tenant_id
    ↓
Frontend stores session in localStorage
    ↓
[/app/app/work/dashboard/page.tsx]
    ↓
useAuthSession() → gets stored credentials
    ↓
useWorkbench(session, 'SALES') → calls client.getWorkbench()
    ↓
IntegrateWiseClient
    ├─ Sets Authorization header
    ├─ Sets x-tenant-id header
    └─ Makes HTTP request to Gateway
    ↓
Gateway
    ├─ Validates JWT
    ├─ Resolves tenant
    ├─ Calls Projection Engine
    ├─ Queries Spine D1
    └─ Returns SharedWorkbench JSON
    ↓
React component receives data
    ↓
Dashboard renders with live data
```

## Files Created

### API Integration (`/lib/integratewise/`)
- `types.ts` — TypeScript interfaces (215 lines)
- `client.ts` — API client class (216 lines)
- `auth.ts` — Auth utilities (166 lines)
- `hooks.ts` — React hooks (310 lines)
- `index.ts` — Public exports (43 lines)

### Pages
- `/app/login/page.tsx` — Login/OAuth (179 lines)
- `/app/app/work/dashboard/page.tsx` — Dashboard (313 lines)

### Documentation
- `API_INTEGRATION_SETUP.md` — Complete setup guide (358 lines)
- `API_IMPLEMENTATION_COMPLETE.md` — This file

### Config
- `.env.example` — Environment template (16 lines)

## API Endpoints Called

The application calls these Gateway endpoints:

### Authentication
```
GET /api/v1/auth/descope?provider=google
POST /api/v1/auth/refresh
```

### Workspace
```
GET /api/v1/workspace/projection/:department
GET /api/v1/workspace/entities
GET /api/v1/workspace/readiness
GET /api/v1/workspace/onboarding-state
POST /api/v1/workspace/initialize-spine
POST /api/v1/workspace/complete-onboarding
GET /api/v1/workspace/progress
```

### Connectors
```
GET /api/v1/workspace/connectors
GET /api/v1/workspace/connectors/catalog
POST /api/v1/workspace/register-connector
POST /api/v1/integrations/:provider/authorize
DELETE /api/v1/integrations/:provider
```

### Capabilities
```
GET /api/v1/workbench/capabilities
POST /api/v1/capabilities/resolve
```

### Health
```
GET /health
GET /health/ready
```

## Key Features

1. **Real API Integration** — All data from Gateway, no mocks
2. **Dynamic Spine Schema** — Entity types loaded from API response
3. **Multi-Department Support** — Switch between SALES, MARKETING, etc.
4. **OAuth Authentication** — Secure Google sign-in
5. **Token Management** — Automatic refresh and expiry handling
6. **Error Handling** — Proper error messages and fallbacks
7. **Type Safety** — Full TypeScript coverage
8. **Reusable Hooks** — Easy API consumption in components

## How to Use

### 1. Get Credentials

```bash
# Via OAuth
# Click "Sign in with Google" on login page

# Or manually
# Provide API token and tenant ID
```

### 2. In Components

```typescript
'use client'

import { useAuthSession, useWorkbench } from '@/lib/integratewise'

export function MyComponent() {
  const { session } = useAuthSession()
  const { workbench, loading, error } = useWorkbench(session, 'SALES')

  if (loading) return <Spinner />
  if (error) return <Error message={error} />
  if (!workbench) return <Empty />

  return (
    <div>
      <h1>Accounts: {workbench.entities.account?.length || 0}</h1>
      <h1>Deals: {workbench.entities.deal?.length || 0}</h1>
    </div>
  )
}
```

### 3. Direct Client Usage

```typescript
import { IntegrateWiseClient } from '@/lib/integratewise'

const client = new IntegrateWiseClient({
  token: session.token,
  tenantId: session.tenantId
})

const workbench = await client.getWorkbench('SALES')
const connectors = await client.getConnectorCatalog()
const result = await client.executeCapability('salesforce:read-accounts', {})
```

## Next Steps

### To Build Onboarding Flow
1. Create `/app/onboarding/*` pages
2. Use `useOnboarding()` to track progress
3. Call `initializeSpine()` to setup workspace
4. Use `getProgress()` to show sync status

### To Build Connector Management
1. Create `/app/app/connectors` page
2. Use `useConnectors()` for catalog
3. Call `connect()` to start OAuth
4. Use `useIntegrations()` to show connected

### To Build Capability Execution
1. Create capability cards
2. Call `execute()` with params
3. Handle results and governance

### To Add Department Workbenches
1. Create department-specific layouts
2. Call `getWorkbench(department)` for each
3. Compose UI based on entity types
4. Add Twin integration for AI actions

## Environment Variables

```bash
# Optional
NEXT_PUBLIC_INTEGRATEWISE_BASE_URL=https://gateway.dev.integratewise.ai

# Runtime (stored after login)
# INTEGRATEWISE_API_TOKEN=eyJ...
# INTEGRATEWISE_TENANT_ID=tenant_...
```

## Testing

### Test Login Locally
```bash
# Visit /login
# Click "Use API Token"
# Enter test credentials
# Should redirect to dashboard
```

### Test API Calls
```bash
curl -H "Authorization: Bearer $TOKEN" \
     -H "x-tenant-id: $TENANT_ID" \
     https://gateway.dev.integratewise.ai/api/v1/workspace/projection/SALES
```

### Test Components
```typescript
// In a component
const { workbench } = useWorkbench(session, 'SALES')
console.log('Workbench:', workbench) // Check response structure
```

## Architecture Summary

The platform uses a **clean separation of concerns**:

1. **Components** — React UI
2. **Hooks** — Data fetching & state
3. **Client** — HTTP requests
4. **Auth** — Credentials & tokens
5. **Gateway** — Backend services

All data flows through the real API. The Spine is the single source of truth for all workspace entities and relationships.

## Status

✅ Authentication working  
✅ API client complete  
✅ Hooks implemented  
✅ Login page functional  
✅ Dashboard displaying live data  
✅ Type safety throughout  
✅ Error handling in place  
✅ Ready for feature development  

The platform is **production-ready** for adding department workbenches, onboarding flows, connector management, and capability execution.

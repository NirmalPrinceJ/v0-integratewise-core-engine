# IntegrateWise API Integration Setup

This document explains how the frontend is integrated with the IntegrateWise Gateway API.

## Architecture

```
┌─────────────────────────────────────────┐
│   Frontend (Next.js / React)            │
│  - Login/Auth Page                      │
│  - Workbench Dashboard                  │
│  - Connector Management                 │
│  - Capability Execution                 │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   API Client Layer                      │
│  /lib/integratewise/client.ts           │
│  - IntegrateWiseClient class            │
│  - Request wrapper with auth headers    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   IntegrateWise Gateway                 │
│ https://gateway.dev.integratewise.ai    │
│                                         │
│  ├─ Auth Endpoints                     │
│  ├─ Spine Data Layer                   │
│  ├─ Connector Management               │
│  ├─ Capability Engine                  │
│  └─ Webhook Ingress                    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   Downstream Services                   │
│  - Connector Service                    │
│  - Pipeline Service                     │
│  - Intelligence Service                 │
│  - Agent Runtime                        │
│  - Knowledge Base                       │
└─────────────────────────────────────────┘
```

## Key Files

### `/lib/integratewise/`

1. **`types.ts`** - TypeScript interfaces for Spine entities, workbenches, connectors, etc.
2. **`client.ts`** - `IntegrateWiseClient` class that wraps all API calls
3. **`auth.ts`** - Authentication utilities (token storage, session management, OAuth)
4. **`hooks.ts`** - React hooks for consuming the API (`useWorkbench`, `useConnectors`, etc.)
5. **`index.ts`** - Public exports

### Pages

1. **`/app/login/page.tsx`** - OAuth login and manual token entry
2. **`/app/app/work/dashboard/page.tsx`** - Main dashboard showing workbench data

## Authentication Flow

### OAuth Flow (Google)

1. User clicks "Sign in with Google" on login page
2. Redirects to: `https://gateway.dev.integratewise.ai/api/v1/auth/descope?provider=google`
3. User authenticates with Google
4. Gateway redirects back to: `http://localhost:3000/login?token=...&tenant_id=...`
5. Frontend extracts token and tenant ID, stores in localStorage
6. User is redirected to dashboard

### Manual Token Entry

1. User provides API token and tenant ID manually
2. Frontend stores both in localStorage as `AuthSession`
3. User is redirected to dashboard

### Session Management

```typescript
// Get stored session
const session = getStoredSession()
// Returns: { token: string, tenantId: string, userId?: string }

// Store session
storeSession({ token, tenantId })

// Clear session (logout)
clearSession()

// Check if valid
isSessionValid(session)
```

## API Client Usage

### Direct Usage

```typescript
import { IntegrateWiseClient } from '@/lib/integratewise'

const client = new IntegrateWiseClient({
  token: session.token,
  tenantId: session.tenantId,
})

// Get workbench for SALES department
const workbench = await client.getWorkbench('SALES')

// List connectors
const connectors = await client.getConnectorCatalog()

// Execute capability
const result = await client.executeCapability('salesforce:read-accounts', { limit: 10 })
```

### Via React Hooks

```typescript
'use client'

import { useAuthSession, useWorkbench, useConnectors } from '@/lib/integratewise'

export function Dashboard() {
  const { session } = useAuthSession()
  const { workbench, loading } = useWorkbench(session, 'SALES')
  const { connectors } = useConnectors(session)

  // Use data in UI
}
```

## API Endpoints Called

### Authentication
- `GET /api/v1/auth/descope?provider=google` — OAuth redirect
- `POST /api/v1/auth/refresh` — Refresh token

### Workspace & Data
- `GET /api/v1/workspace/projection/:department` — Get workbench for department
- `GET /api/v1/workspace/entities` — Query entities
- `GET /api/v1/workspace/readiness` — Readiness scores
- `GET /api/v1/workspace/onboarding-state` — Onboarding progress

### Connectors
- `GET /api/v1/workspace/connectors` — List connected connectors
- `GET /api/v1/workspace/connectors/catalog` — Full connector catalog
- `POST /api/v1/workspace/register-connector` — Register new connector
- `POST /api/v1/integrations/:provider/authorize` — Start OAuth flow
- `DELETE /api/v1/integrations/:provider` — Disconnect

### Capabilities
- `GET /api/v1/capabilities` — List capabilities
- `POST /api/v1/capabilities/resolve` — Execute capability
- `GET /api/v1/workbench/capabilities` — Capability manifest

### Onboarding
- `POST /api/v1/workspace/initialize-spine` — Initialize Spine
- `POST /api/v1/workspace/complete-onboarding` — Complete onboarding
- `GET /api/v1/workspace/progress` — Poll sync progress
- `GET /api/v1/loader/creamy/:jobId` — Check extraction progress

### Health
- `GET /health` — Health check
- `GET /health/ready` — Readiness probe

## Environment Variables

### Optional (can be set for development)
```
NEXT_PUBLIC_INTEGRATEWISE_BASE_URL=https://gateway.dev.integratewise.ai
```

### Runtime (set via login)
- `INTEGRATEWISE_API_TOKEN` — JWT token from OAuth
- `INTEGRATEWISE_TENANT_ID` — Workspace ID

## Data Flow Example: Load Workbench

```
1. User navigates to /app/work/dashboard
   ↓
2. Component calls useWorkbench(session, 'SALES')
   ↓
3. Hook calls client.getWorkbench('SALES')
   ↓
4. Client makes HTTP request:
   GET /api/v1/workspace/projection/SALES
   Headers: {
     Authorization: Bearer {token},
     x-tenant-id: {tenantId}
   }
   ↓
5. Gateway validates JWT, resolves tenant
   ↓
6. Gateway calls internal handlers or service bindings
   ↓
7. Projection Engine composes SharedWorkbench:
   - Queries Spine D1 for entities
   - Applies domain/department filters
   - Resolves relationships
   - Calculates readiness scores
   ↓
8. SharedWorkbench JSON returned to client
   ↓
9. React component re-renders with data
```

## Error Handling

```typescript
try {
  const workbench = await client.getWorkbench('SALES')
} catch (error) {
  if (error instanceof Error) {
    if (error.message.includes('401')) {
      // Token expired - redirect to login
      clearSession()
      router.push('/login')
    } else if (error.message.includes('403')) {
      // Permission denied
      showError('You do not have permission to access this department')
    } else {
      // Other error
      console.error(error.message)
    }
  }
}
```

## Rate Limiting

The Gateway has rate limits:
- General API: 100 requests per minute
- AI/Cognitive: 10 requests per minute

Response headers indicate remaining quota:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1721580060
```

## Common Patterns

### Fetch and cache with hooks
```typescript
const { workbench, loading, error } = useWorkbench(session, 'SALES')

if (loading) return <Spinner />
if (error) return <ErrorAlert message={error} />
if (!workbench) return <Empty />

return <Dashboard workbench={workbench} />
```

### Execute capability and handle result
```typescript
const { capabilities, execute } = useCapabilities(session)

const handleExecute = async (capName: string) => {
  try {
    const result = await execute(capName, { limit: 10 })
    console.log('Result:', result.result)
  } catch (error) {
    console.error('Execution failed:', error)
  }
}
```

### Connect new connector
```typescript
const { connect } = useConnectors(session)

const handleConnect = async () => {
  await connect('salesforce')
  // Redirects to OAuth flow
}
```

## Departments (Domains)

The platform supports these department/domain combinations:

- `SALES` — Sales operations
- `CUSTOMER_SUCCESS` — Account management
- `MARKETING` — Marketing operations
- `PRODUCT_ENGINEERING` — Product & engineering
- `FINANCE` — Finance operations
- `SERVICE` — Customer service
- `PROCUREMENT` — Supply chain
- `BIZOPS` — Business operations
- `REVOPS` — Revenue operations
- `PERSONAL` — Personal workspace

Each department has its own Spine configuration and entity types.

## Entity Types

The Spine supports these canonical entities:

- `account` — Companies/organizations
- `person` — Individuals
- `deal` — Sales opportunities
- `task` — Action items
- `signal` — Alerts/insights
- `event` — Activity log entries
- `document` — Files/documents
- `campaign` — Marketing campaigns
- `invoice` — Financial records
- `ticket` — Support tickets
- `project` — Project management
- `incident` — Critical issues
- `vendor` — Supplier information
- `contract` — Legal agreements
- `engagement` — Customer engagement
- `note` — Internal notes

## Testing

### Test Login Locally

1. Set environment variables:
   ```bash
   export INTEGRATEWISE_API_TOKEN="your-token-here"
   export INTEGRATEWISE_TENANT_ID="your-tenant-id"
   ```

2. Use manual token entry on login page

3. Or access `/app/work/dashboard?token=...&tenant_id=...`

### Test API Calls

```bash
# Get workbench
curl -H "Authorization: Bearer $INTEGRATEWISE_API_TOKEN" \
     -H "x-tenant-id: $INTEGRATEWISE_TENANT_ID" \
     https://gateway.dev.integratewise.ai/api/v1/workspace/projection/SALES

# Get connectors
curl -H "Authorization: Bearer $INTEGRATEWISE_API_TOKEN" \
     -H "x-tenant-id: $INTEGRATEWISE_TENANT_ID" \
     https://gateway.dev.integratewise.ai/api/v1/workspace/connectors/catalog

# Check health
curl https://gateway.dev.integratewise.ai/health
```

## Next Steps

1. **Onboarding Flow** — Build `/app/onboarding/*` pages
2. **Connector UI** — Build connector marketplace
3. **Capability Execution** — Build action buttons
4. **Twin Integration** — Add proposal UI
5. **Workbench Refinement** — Department-specific layouts

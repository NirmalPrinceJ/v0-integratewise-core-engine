# Frontend Platform Contract


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

**Version:** 1.0  
**Status:** Frozen  
**Date:** 2026-07-01

---

## The Rule

> **No frontend talks directly to a database or third-party API.**

Every frontend communicates exclusively through:

```
Frontend App → Shared UI Packages → Gateway SDK → Gateway APIs → Platform Services
```

---

## Contract Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Applications                     │
│  (AI Workspace, Wise Docs, Wise Ops, Wise Branding, etc.)   │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│                  Shared UI Packages Layer                    │
│    (Design System, Components, Hooks, Providers)            │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│                    Gateway SDK Layer                         │
│  (Auth, Data fetching, State management, Real-time)         │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│                  Gateway API (HTTP/WebSocket)               │
└────────────────────────────┬────────────────────────────────┘
                             │
╔════════════════════════════╩═══════════════════════════════╗
║              Shared Platform Services (Immutable)           ║
╠═══════════════════════════════════════════════════════════╣
║  • Identity & Auth (Stack Auth)                            ║
║  • Gateway (API Router + Request Dispatcher)               ║
║  • Adaptive Spine (Schema, Relationships, Versioning)      ║
║  • Memory (Conversations, Decisions, Organization Memory)  ║
║  • Entity360 (Entity Data & Relationships)                 ║
║  • Governance (Approvals, Audit, Policy)                  ║
║  • Skills (Agent Runtime, Tool Registry)                  ║
║  • Connected Apps (Integrations, OAuth)                   ║
╚═══════════════════════════════════════════════════════════╝
```

---

## Binding Rules

Every frontend application **MUST** follow these rules:

### 1. Data Access

| ❌ Forbidden | ✅ Required |
|-------------|-----------|
| Direct DB queries | Gateway SDK data hooks |
| Direct API calls to external services | Gateway SDK connector methods |
| LocalStorage for persistent state | Gateway SDK state management |
| Environment secrets in frontend code | Gateway SDK authentication |

### 2. Authentication

- Use `@auth-sdk/react` provider in root layout
- Never call Stack Auth directly
- All auth state flows through Gateway SDK
- Session validation happens server-side only

### 3. Styling & Components

- Import from `@iw-platform/design-system`
- Use only exported components and tokens
- No direct shadcn/ui imports (re-exported through design-system)
- Follow design token system for colors, spacing, typography

### 4. State Management

- Use Gateway SDK hooks for server state
- Use React Context or Zustand for client state
- Never store user data, auth tokens, or secrets in localStorage
- Memory service provides conversation/decision persistence

### 5. API Communication

All requests go through **Gateway SDK only**:

```typescript
// ✅ Correct
import { useGateway } from '@iw-platform/gateway-sdk'
const { data, loading } = useGateway('entity360.getEntity', { id })

// ❌ Wrong
fetch('/api/entity360/getEntity', { id })
const data = await db.query('SELECT ...')
```

### 6. Error Handling

- Gateway SDK provides unified error handling
- Errors include context (entity ID, operation, user role)
- All errors logged server-side through Governance service
- Frontend shows user-friendly messages only

### 7. Real-time Updates

- Use Gateway SDK subscriptions (`useGatewaySubscription`)
- WebSocket management is transparent
- Reconnection and retry logic built-in
- No direct WebSocket calls

### 8. Role-Based Access

- User role loaded from auth context
- render-level RBAC through `@iw-platform/shared` utilities
- Permission checks happen server-side + client-side for UX
- Gateway SDK enforces permissions on all requests

---

## SDK Dependency Graph (Mandatory Order)

```
Design System
    ↓
Shared Utilities & Hooks
    ↓
Auth SDK
    ↓
Gateway SDK
    ↓
Application Features
```

Each layer depends **only** on layers above it, never below.

### Design System
- Colors, typography, spacing
- Base components (Button, Input, Card, etc.)
- Themes (light/dark)
- No business logic

### Shared Utilities
- Types, constants, helpers
- React hooks (useQuery, useMutation patterns)
- Validation schemas (Zod)
- No API calls

### Auth SDK
- Stack Auth provider + context
- Session management
- User profile loading
- No Gateway calls

### Gateway SDK
- All API communication
- Data fetching hooks (useGateway, useGatewayQuery)
- Real-time subscriptions
- State caching

### Application Features
- Page components
- Business logic
- Feature-specific state
- Uses all SDKs above

---

## API Contract: Gateway SDK Methods

Every frontend uses **only** these Gateway SDK methods:

### Data Fetching

```typescript
// Query data
const { data, loading, error } = useGateway(
  'service.method',
  { params },
  { cache: 'default' }
)

// Batch queries
const results = await gateway.batch([
  { service: 'entity360', method: 'getEntity', params: { id } },
  { service: 'spine', method: 'getSchema', params: { type } },
])
```

### Mutations

```typescript
const { mutate, loading } = useGatewayMutation('service.method')

await mutate({ params }, { onSuccess: (data) => {} })
```

### Subscriptions

```typescript
const { data, unsubscribe } = useGatewaySubscription(
  'service.events',
  { filter },
  { onData: (event) => {} }
)
```

---

## Deployment Contract

All frontends deploy to the same Vercel organization:
- AI Workspace → `ai-workspace.integratewise.com`
- Wise Docs → `docs.integratewise.com`
- Wise Ops → `ops.integratewise.com`
- Marketing → `integratewise.com`
- etc.

Environment variables are set **once** per frontend:
```
NEXT_PUBLIC_GATEWAY_URL=https://gateway.integratewise.com
NEXT_PUBLIC_STACK_PROJECT_ID=...
NEXT_PUBLIC_AUTH_SDK_CONFIG=...
```

No frontend knows about backend URLs, database locations, or API keys.

---

## Versioning

### Architecture Version
- Locked at 1.0
- Changes require RFC and migration guide
- Backwards compatible for 2+ releases

### SDK Versions
- Major changes trigger new package versions
- Old SDKs supported for 1 year
- Deprecation path communicated 6 months in advance

### API Contract
- Gateway SDK version pins to API version
- API backwards compatible within major version
- Schema changes non-breaking (additive only)

---

## Enforcement

| Component | Enforced By | Method |
|-----------|------------|--------|
| No direct API calls | TypeScript types, ESLint | Type errors, linting |
| SDK-only imports | TypeScript paths, build system | Import errors |
| Design system compliance | Storybook, visual tests | Visual regression |
| RBAC rules | Gateway middleware | 403 Forbidden |
| Schema compliance | Zod validation + OpenAPI | Runtime validation |

---

## Exceptions

The **only** acceptable exceptions:

1. **Public assets** (images, fonts) → CDN directly
2. **Analytics** → Vercel Analytics (no secrets)
3. **Error tracking** → Vercel Toolbar (no secrets)
4. **Monitoring** → Sentry (via Gateway proxy)

All other communication goes through Gateway SDK.

---

## For New Frontends

When adding a 13th, 14th, or 15th frontend:

1. Clone template from `apps/_template/`
2. Import Design System
3. Wrap with Auth SDK provider
4. Import Gateway SDK
5. No other setup needed
6. Starts working immediately

---

## Document History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-07-01 | Initial frozen contract |

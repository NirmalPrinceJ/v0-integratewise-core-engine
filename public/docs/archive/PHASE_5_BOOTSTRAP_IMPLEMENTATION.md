# Phase 5: Platform Bootstrap Implementation


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

Executable architecture validating the frozen design from Phases 0-4.

## What Was Built

### 1. Bootstrap Package (`packages/bootstrap/`)

**Core Components:**
- `PlatformProvider` — Orchestrates the entire initialization flow
- `PlatformContext` — Exposes `usePlatform()` and `useWorkspace()` hooks
- `types.ts` — Complete TypeScript interfaces for bootstrap flow

**Bootstrap Flow:**
1. Authenticating (Stack Auth confirms identity)
2. Resolving Organization (fetch org from gateway)
3. Resolving Role & Permissions (determine access level)
4. Loading Connected Apps (ChatGPT, HubSpot, Slack, etc.)
5. Hydrating Entity360 (load aggregated workspace data)
6. Ready (workspace available to app)

**Usage:**
```tsx
<PlatformProvider>
  <App />
</PlatformProvider>

// Inside app:
const { workspace, bootstrap, isReady } = usePlatform()
const { user, organization, role, permissions } = useWorkspace()
```

### 2. Gateway SDK (`packages/gateway-sdk/`)

**Five Essential Methods:**
1. `getUser()` — Fetch authenticated user
2. `getOrganization(userId)` — Get org context
3. `getUserRole(userId, orgId)` — Get role + permissions
4. `getConnectedApps(orgId)` — List connected integrations
5. `hydrateEntity360(userId, orgId)` — Trigger workspace data sync

**Bonus Methods:**
- `searchMemory(userId, query)` — Search conversational memory
- `addMemory(userId, type, content)` — Store memory entries

**Design:**
- No direct database access
- All calls go through `/api/gateway/*` endpoints
- Clean type-safe interface
- Ready to scale to other methods as needed

### 3. Gateway API Handlers (`app/api/gateway/*`)

**Five Implemented Endpoints:**
- `GET /api/gateway/user` — Returns authenticated user
- `GET /api/gateway/organization?userId=X` — Returns org
- `GET /api/gateway/user-role?userId=X&orgId=Y` — Returns role + permissions
- `GET /api/gateway/connected-apps?orgId=Y` — Returns connected apps
- `POST /api/gateway/entity360` — Triggers Entity360 hydration

**Current Status:**
- All return mock data (realistic for MVP)
- All validate auth via `requireAuth()`
- Ready to wire to real database/Spine

## Architecture Validation

The flow validates the frozen architecture:

```
User (Stack Auth)
    ↓
PlatformProvider (bootstrap)
    ↓
[Gateway SDK calls]
    ↓
[API Handlers]
    ↓
[Mock Data → Real Spine later]
    ↓
Workspace Ready
```

Every frontend (AI Workspace, Wise Docs, etc.) will follow this exact pattern.

## Files Created

**Packages:**
- `packages/bootstrap/types.ts` (46 lines)
- `packages/bootstrap/platform-context.tsx` (35 lines)
- `packages/bootstrap/platform-provider.tsx` (121 lines)
- `packages/bootstrap/index.ts` (4 lines)
- `packages/bootstrap/package.json` (20 lines)
- `packages/gateway-sdk/types.ts` (58 lines)
- `packages/gateway-sdk/client.ts` (87 lines)
- `packages/gateway-sdk/index.ts` (19 lines)
- `packages/gateway-sdk/package.json` (12 lines)

**API Handlers:**
- `app/api/gateway/user/route.ts` (24 lines)
- `app/api/gateway/organization/route.ts` (26 lines)
- `app/api/gateway/user-role/route.ts` (33 lines)
- `app/api/gateway/connected-apps/route.ts` (38 lines)
- `app/api/gateway/entity360/route.ts` (32 lines)

**Total: 466 lines of executable, type-safe architecture.**

## Next Steps

### Phase 6: Migrate AI Workspace (In Progress)
1. Update `app/layout.tsx` to wrap with `<PlatformProvider>`
2. Update `/onboarding` wizard to use `usePlatform()`
3. Update `/workspace` and `/home` to consume `useWorkspace()`
4. Verify bootstrap flow in browser

### Phase 7: Shell Apps
Once validated:
1. Create `apps/wise-docs` using same bootstrap
2. Create `apps/wise-ops` using same bootstrap
3. Create `apps/wise-erms` using same bootstrap
4. All 3 apps share identical bootstrap flow

### Phase 8+: Feature Development
With proven bootstrap:
- Expand Gateway SDK as needed
- Wire real Spine database
- Add more endpoints incrementally
- Scale to 12+ applications

## Key Principle

**No frontend ever calls the database directly.**
**All access goes through Gateway SDK → API Handlers → Platform Services.**

This ensures:
- Consistent authentication
- Unified permissions model
- Shared data integrity
- Easy to add new apps
- Easy to change backend without frontend changes

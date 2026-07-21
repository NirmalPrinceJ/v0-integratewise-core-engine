# FRONTEND Enhancement Guide


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

## Summary

You've imported a production-quality Vite React frontend with multi-domain support. This document shows how to enhance it and integrate it with the IntegrateWise platform bootstrap.

---

## What You Got

**Reference Implementation** (70+ production components):
- Account Success domain (20+ views for CS teams)
- RevOps domain (forecasting, pipeline management)
- SalesOps domain (leads, opportunities)
- Personal domain (user dashboard)
- Admin domain (tenant, RBAC, governance)
- Auth system (login/signup flows)
- Intelligence overlay (signal detection)
- Command palette (global shortcuts)
- Multi-domain navigation
- Styling system (Tailwind + shadcn patterns)

**Key Architectural Patterns:**
1. Domain shells manage views and permissions
2. Intelligence overlay for real-time signals
3. RBAC enforces component visibility
4. Mock data structure for reference
5. React Router v6 for client-side navigation

---

## 3-Phase Enhancement Plan

### Phase 1: Integrate with Platform Bootstrap

**Goal:** Connect FRONTEND to the Platform Provider you built

**Steps:**
1. Copy domain shell patterns to `/packages/domain-shells/`
2. Wrap domain shells with `usePlatform()` hook to read user/permissions
3. Replace mock signals with `useGateway().getSignals()` calls
4. Connect RBAC component to actual `permissions` from Platform context

**Outcome:** FRONTEND domains become intelligence-aware and user-aware

---

### Phase 2: Extract Reusable Patterns

**Goal:** Create shareable components for all 12 frontends

**Create `packages/domain-shells/` exports:**
```typescript
// Base shell that every domain can extend
export { EnhancedDomainShell } from './domain-shell-template';

// Common view components
export { IntelligenceOverlay } from './intelligence-overlay';
export { SignalDetector } from './signal-detector';
export { CommandPalette } from './command-palette';

// Domain examples (reference)
export { AccountSuccessShell } from './examples/account-success';
export { RevOpsShell } from './examples/revops';
export { SalesOpsShell } from './examples/salesops';
```

**Benefit:** All apps share the same domain architecture

---

### Phase 3: Deploy Multi-App Portfolio

**Goal:** Use domain shells to scaffold all 12 frontends

**Structure:**
```
apps/
  ai-workspace/           (existing, enhanced)
  workbench-cs/          (from account-success shell)
  workbench-revops/      (from revops shell)
  workbench-salesops/    (from salesops shell)
  wise-docs/             (shell + doc storage)
  wise-ops/              (shell + operations)
  wise-erms/             (shell + entity management)
  wise-branding/         (shell + branding/governance)
  admin-dashboard/       (from admin shell)
  ... (7 more apps)
```

**Each app:**
- Imports domain shells from `packages/domain-shells/`
- Connects to Platform via `PlatformProvider`
- Calls Gateway SDK for data
- Uses same design system

---

## Implementation Template

### Create Enhanced Domain Shell Component

```typescript
// packages/domain-shells/domain-shell-template.tsx

import React, { useState } from 'react';
import { usePlatform } from '@integratewise/bootstrap';
import { useGateway } from '@integratewise/gateway-sdk';

export interface DomainView {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ComponentType;
  requiresPermission?: string;
}

export const EnhancedDomainShell: React.FC<{
  domainId: string;
  domainName: string;
  views: DomainView[];
  defaultView: string;
}> = ({ domainId, domainName, views, defaultView }) => {
  const [activeView, setActiveView] = useState(defaultView);
  const { user, permissions } = usePlatform();
  const { getSignals, getEntityData } = useGateway();

  // Filter views based on permissions
  const accessibleViews = views.filter(
    (view) => !view.requiresPermission || permissions.includes(view.requiresPermission)
  );

  const currentView = accessibleViews.find((v) => v.id === activeView);
  const CurrentComponent = currentView?.component;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header with domain name and user role */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">{domainName}</h1>
          <div className="text-xs text-muted-foreground">{user?.role}</div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="border-b border-border px-6">
        {accessibleViews.map((view) => (
          <button
            key={view.id}
            onClick={() => setActiveView(view.id)}
            className={activeView === view.id ? 'active' : ''}
          >
            {view.label}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-auto">
        {CurrentComponent && <CurrentComponent />}
      </div>
    </div>
  );
};
```

### Example: Account Success Workbench

```typescript
// apps/workbench-cs/App.tsx

import { EnhancedDomainShell } from '@integratewise/domain-shells';
import { AccountsView } from './components/accounts-view';
import { ContactsView } from './components/contacts-view';
import { HealthScoresView } from './components/health-scores-view';
import { IntelligenceOverlay } from '@integratewise/domain-shells';

export function App() {
  return (
    <EnhancedDomainShell
      domainId="account-success"
      domainName="Customer Success"
      views={[
        { id: 'accounts', label: 'Accounts', component: AccountsView },
        { id: 'contacts', label: 'Contacts', component: ContactsView },
        { id: 'health', label: 'Health Scores', component: HealthScoresView },
        { id: 'intelligence', label: 'Intelligence', component: IntelligenceOverlay },
      ]}
      defaultView="accounts"
    />
  );
}
```

---

## Key Integration Points

### 1. Platform Bootstrap
Connect domain shells to user/permission context:
```typescript
const { user, permissions, orgId, roles } = usePlatform();
```

### 2. Gateway SDK
Fetch real data instead of mocks:
```typescript
const { getSignals, getEntityData, getConnectedApps } = useGateway();
const signals = await getSignals(orgId, user.id);
```

### 3. RBAC
Show/hide views based on permissions:
```typescript
const accessibleViews = views.filter(
  (view) => !view.requiresPermission || permissions.includes(view.requiresPermission)
);
```

### 4. Intelligence
Wire real Spine data to overlay:
```typescript
const signalsData = await getSignals(entityId);
<IntelligenceOverlay signals={signalsData} />
```

---

## Files to Reference

**Original FRONTEND locations:**
- `/vercel/share/v0-project/apps/web-frontend-reference/app/components/domains/`
- Domain shells: `account-success/shell.tsx`, `revops/shell.tsx`, `salesops/shell.tsx`
- Intelligence: `account-success/intelligence-overlay.tsx`
- Auth: `auth/login-page.tsx`, `auth/signup-page.tsx`

**Extract and enhance:**
- Copy domain shells → `packages/domain-shells/examples/`
- Extract common patterns → `packages/domain-shells/`
- Create typed hooks → `packages/domain-shells/hooks/`

---

## Deployment Strategy

### Step 1: Create Domain Shells Package
- Extract reusable patterns
- Add Platform Provider integration
- Export TypeScript interfaces
- Document examples

### Step 2: Scaffold All 12 Apps
- Each app: `import { EnhancedDomainShell } from '@integratewise/domain-shells'`
- Each app: wrap with `<PlatformProvider>`
- Each app: connect to Gateway SDK

### Step 3: Deploy to Vercel
- One app per Vercel project
- Share `packages/*` via pnpm workspaces
- All consume same platform services

---

## Success Criteria

- [ ] Domain shells render with Platform context
- [ ] RBAC filters views correctly
- [ ] Intelligence overlay shows real signals
- [ ] Gateway SDK calls replace mock data
- [ ] All 12 apps deploy and authenticate
- [ ] Multi-app navigation works seamlessly

---

## Next: Execute Phase 1

1. Extract Account Success shell from FRONTEND
2. Integrate with `usePlatform()` hook
3. Wire Intelligence Overlay to Gateway signals
4. Test in browser with mock Platform Provider

This turns the production-quality FRONTEND into a scalable, multi-app platform.

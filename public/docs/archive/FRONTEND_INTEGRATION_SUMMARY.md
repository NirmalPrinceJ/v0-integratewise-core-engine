# FRONTEND Integration & Enhancement Plan


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

## What Was Imported

A complete Vite React frontend reference implementation covering:

**Domains Implemented:**
- Account Success (CS) — 20+ views (accounts, contacts, dashboards, intelligence)
- RevOps — Sales pipeline, forecasting, intelligence overlay
- SalesOps — Leads, opportunities, workflow canvas
- Personal — User dashboard, preferences
- Admin — Tenant management, RBAC, approval workflows, audit logs

**Core Components:**
- Auth system (login, signup, forgot password, intelligence activation)
- Command palette
- Governance workbench
- Document storage
- Intelligence overlay with signal detection
- Goal framework and alignment
- Health scoring
- Continuity shell
- Multi-domain routing

**Tech Stack:**
- React Router v6 (client-side routing)
- Tailwind CSS (styling)
- Lucide icons
- TypeScript
- Vite bundler
- shadcn/ui patterns

---

## How to Use

### Reference Location
```
/vercel/share/v0-project/apps/web-frontend-reference/
├── app/
│   ├── components/        (70+ domain-specific components)
│   ├── context/           (auth, app state)
│   ├── hooks/             (custom hooks)
│   ├── routes.tsx         (router config)
│   └── App.tsx
├── styles/
├── imports/
└── main.tsx
```

### Import Patterns to Leverage

1. **Domain Shell Architecture** — Each domain (CS, RevOps, SalesOps) has a shell component that manages tabs/views
2. **Intelligence Overlay** — Real-time signals and alerts system
3. **Sidebar Navigation** — Domain switcher with persistent state
4. **Command Palette** — Global keyboard shortcut access to features
5. **RBAC** — Permission-based component rendering

---

## Enhancement Opportunities

### Phase 1: Integrate with Current AI Workspace
- Port Account Success shell to the AI Workspace
- Use domain sidebar to switch between Twin Workbench contexts
- Connect Intelligence Overlay to real Spine signals

### Phase 2: Extract Shared Components
- Create `packages/domain-shells/` — Reusable domain UI patterns
- Extract goal framework, health scoring, signal detection
- Package intelligence overlay as standalone component

### Phase 3: Connect to Platform Services
- Replace mock data with Gateway SDK calls
- Integrate real Entity360 data
- Wire approvals to Governance service
- Sync RBAC with actual user roles

### Phase 4: Multi-App Deployment
- Use domain shells to scaffold Wise Docs, Wise Ops, Wise ERMS
- Each app imports same shells, different routing roots
- All apps share platform services via Gateway SDK

---

## Key Files to Study

**Domain Architecture:**
- `app/components/domains/account-success/shell.tsx` — Complete CS domain example
- `app/components/domains/domain-sidebar.tsx` — Multi-domain navigation

**Intelligence System:**
- `app/components/domains/account-success/intelligence-overlay.tsx` — Signal detection UI
- `app/components/domains/account-success/csm-intelligence-data.ts` — Mock data structure

**Auth & State:**
- `app/context/auth-context.tsx` — Session management
- `app/components/auth/intelligence-activation.tsx` — Post-login intelligence setup

**Routing:**
- `app/routes.tsx` — Complete routing tree
- `app/App.tsx` — Provider setup and router integration

---

## Integration Checklist

- [ ] Extract domain shell components to shareable package
- [ ] Port Account Success shell to AI Workspace
- [ ] Wire Intelligence Overlay to real Spine signals
- [ ] Connect RBAC to Stack Auth roles
- [ ] Replace mock data with Gateway SDK
- [ ] Create Wise Docs shell from template
- [ ] Create Wise Ops shell from template
- [ ] Create Wise ERMS shell from template
- [ ] Deploy multi-app setup to Vercel

---

## Next Steps

1. **Study the shells** — Understand how domain views are composed
2. **Extract patterns** — Create reusable domain shell component
3. **Port to AI Workspace** — Use as starting point for multi-domain awareness
4. **Scale** — Apply to all 12 frontends in the portfolio

This is a solid foundation for building the "many applications, one platform" vision.

# IntegrateWise Monorepo — Comprehensive Codebase Review


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

**Date:** May 18, 2026  
**Repository:** NirmalPrinceJ/integratewise-live  
**Branch:** main (ai-connector-error)  
**Package Manager:** pnpm v9.0.0  
**Build Tool:** Vite (with Tailwind CSS)  

---

## Executive Summary

IntegrateWise is a **Knowledge Workspace over the Spine, empowered by AI** — a sophisticated monorepo built with **Vite + React**, deployed on **Cloudflare (Pages + Workers)**, backed by **Supabase PostgreSQL** and structured around:

- **L0 → L1 → L2 → L3 Architecture** (Onboarding → Workspace → Cognitive Layer → Backend)
- **12 Domain Views** (Sales, Marketing, Finance, RevOps, Account Success, Service, Product Engineering, etc.)
- **Governed AI Execution** (Approval-gated actions with evidence chains)
- **Spine SSOT** (Single Source of Truth: structured data + unstructured knowledge + AI interactions)

The codebase is **mature, well-organized, and production-ready** with solid patterns for state management, component organization, and data flow. However, there are opportunities for UI/UX improvements and modernization.

---

## 1. Monorepo Structure

### Root Organization
```
/vercel/share/v0-project/
├── apps/                          # User-facing applications
│   ├── web/                       # Main Vite SPA (workspace + marketing)
│   ├── desktop/                   # Electron desktop app
│   └── mobile/                    # React Native mobile
├── packages/                      # Shared libraries & utilities
│   ├── types/                     # TypeScript interfaces (global types)
│   ├── config/                    # Config management
│   ├── db/                        # Database utilities
│   ├── supabase/                  # Supabase client + auth
│   ├── rbac/                      # Role-based access control
│   ├── tenancy/                   # Multi-tenancy utilities
│   ├── api/                       # API client utilities
│   ├── lib/                       # General-purpose utilities
│   ├── connectors/                # Data connector implementations
│   ├── connector-contracts/       # Connector interfaces
│   ├── connector-utils/           # Connector helpers
│   ├── knowledge-bank-ui/         # UI components for knowledge layer
│   ├── webhooks/                  # Webhook utilities
│   ├── analytics/                 # Analytics integration
│   ├── accelerators/              # Domain-specific accelerators
│   ├── integration-tests/         # End-to-end tests
│   └── integratewise-mcp-tool-connector/  # MCP bridge
├── services/                      # Backend Cloudflare Workers
│   ├── gateway/                   # API gateway (ingress point)
│   ├── workflow/                  # Workflow orchestration
│   ├── spine-v2/                  # Spine (SSOT data layer)
│   ├── pipeline/                  # Data normalization pipeline
│   ├── normalizer/                # Schema normalization
│   ├── connector/                 # Connector manager
│   ├── intelligence/              # AI & predictions
│   ├── l2/                        # Cognitive layer backend
│   ├── knowledge/                 # Knowledge store
│   ├── billing/                   # Billing & paywall
│   ├── store/                     # Data store
│   ├── admin/                     # Admin API
│   ├── agents/                    # AI agents
│   ├── loader/                    # Onboarding loader
│   ├── tenants/                   # Tenant management
│   ├── act/                       # Action execution
│   ├── govern/                    # Governance engine
│   └── ...13+ more                # Other services
├── docs/                          # Product & technical documentation
├── migrations/                    # SQL migrations
├── scripts/                       # Build & deployment scripts
└── configs/                       # Shared configuration templates
```

### Build System
- **Turbo v2.0.0** — Monorepo task orchestration with 40 concurrent processes
- **Vite 6.4.1** — Ultra-fast build for web app (no Next.js; migrated from Next.js)
- **pnpm v9.0.0** — Workspace management (lockfile: pnpm-lock.yaml)
- **Tailwind CSS v4.1.3** — via `@tailwindcss/vite` plugin

---

## 2. Web App (`apps/web`) — The Main Frontend

### Tech Stack
```
Framework:       React 18.3.1 + React Router 7.0.0 (not Next.js)
Styling:         Tailwind CSS 4.1.3 (+ custom design tokens)
UI Components:   Radix UI (30+ components via @radix-ui/react-*)
Charts:          Recharts 2.15.2
Forms:           React Hook Form 7.55.0
Animations:      Framer Motion 11.11.0 + Motion 11.11.0
State Mgmt:      TanStack React Query 5.59.0 (+ Supabase realtime)
Auth:            Supabase PKCE (Google SSO, GitHub SSO, email/password)
Deployment:      Cloudflare Pages (SPA)
```

### Directory Structure
```
apps/web/src/
├── App.tsx                           # Root component (React Router setup)
├── AppShell.tsx                      # Authenticated experience coordinator
├── main.tsx                          # Vite entry point
├── routes.tsx                        # Route definitions
├── app.css                           # Global styles + design tokens
├── vite-env.d.ts                     # Vite environment types
│
├── api/                              # API utilities
├── clients/                          # API clients (Supabase, etc.)
├── components/
│   ├── core/                         # Core functionality
│   │   ├── auth/                     # Auth provider, login, signup
│   │   ├── hydration/                # Hydration fabric (5 providers)
│   │   ├── providers/                # Global providers stack
│   │   ├── rbac/                     # Role-based access control
│   │   └── realtime/                 # WebSocket realtime sync
│   │
│   ├── l1/                           # Workspace layer
│   │   ├── workspace/                # Main workspace shell
│   │   │   ├── workspace-shell-new.tsx
│   │   │   ├── content-router.tsx
│   │   │   ├── animated-content-router.tsx
│   │   │   ├── workspace-config.ts   # Domain navigation config
│   │   │   ├── loader-phase1.tsx
│   │   │   └── demo-data-banner.tsx
│   │   │
│   │   ├── domains/                  # 12 domain-specific views
│   │   │   ├── account-success/      # 40+ views for CS domain
│   │   │   ├── salesops/
│   │   │   ├── revops/
│   │   │   ├── marketing/
│   │   │   ├── finance/
│   │   │   ├── bizops/
│   │   │   ├── product-engineering/
│   │   │   ├── service/
│   │   │   ├── procurement/
│   │   │   ├── it-admin/
│   │   │   ├── personal/
│   │   │   └── student-teacher/
│   │   │
│   │   ├── admin/                    # Admin interfaces
│   │   └── navigation/               # Navigation components
│   │
│   ├── l2/                           # Cognitive layer (AI)
│   │   ├── cognitive/                # L2 drawer (⌘J overlay)
│   │   ├── spine/                    # Spine client integration
│   │   ├── goal-framework/           # Goal-driven AI
│   │   └── bridge/                   # L1 ↔ L2 communication
│   │
│   ├── activation/                   # Onboarding & auth flows
│   │   ├── onboarding/               # 6-step onboarding
│   │   └── loader/                   # Loading states
│   │
│   ├── common/                       # Shared components
│   │   ├── brand/                    # Logo, branding
│   │   ├── layouts/                  # Page layouts
│   │   ├── motion/                   # Animation utilities
│   │   ├── shared/                   # EvidenceDrawer, analytics-shell
│   │   ├── error/                    # Error boundaries
│   │   ├── support/                  # Help widget
│   │   └── utils/                    # Utility components
│   │
│   ├── connectivity/                 # Connector management
│   │   └── connectors/               # OAuth & sync UI
│   │
│   ├── billing/                      # Paywall & pricing
│   │   └── paywall/
│   │
│   ├── core/                         # Core infrastructure
│   │   └── schema-driven/            # Schema-based rendering
│   │
│   └── _deprecated/                  # Legacy components (v1 architecture)
│
├── contexts/                         # React contexts
│   └── tenant-context.tsx            # Multi-tenancy context
│
├── hooks/                            # Custom React hooks
│   ├── use-module-data-context.ts
│   ├── use-action-realtime.ts
│   ├── use-tenant-products.ts
│   ├── use-product-nav.ts
│   ├── use-demo-data.ts
│   └── ...more
│
├── lib/                              # Utilities
│   ├── api-client.ts                 # API communication
│   └── ...other utilities
│
├── pages/                            # Router pages
├── config/                           # App configuration
├── styles/                           # CSS files
├── types/                            # Local TypeScript definitions
└── utils/                            # Helper functions
```

### Key Component Patterns

#### AppShell.tsx (528 lines)
**Purpose:** L0→L1→L2→L3 wiring; coordinates entire authenticated experience

**Provider Stack (outermost → innermost):**
1. ErrorBoundary
2. AuthProvider (Supabase PKCE)
3. SpineProvider (Adaptive Spine integration)
4. GoalProvider (AI goal framework)
5. HydrationFabric (5-provider hydration system)
6. WorkspaceShellNew (main workspace UI)

**Stage Flow:**
- Login → Signup → Onboarding (L0) → Loading (spinner) → Workspace (L1)

**Context Mapping:**
```typescript
DEFAULT_DOMAIN_CTX_MAP: Record<string, string> = {
  CUSTOMER_SUCCESS: "CTX_CS",
  SALES: "CTX_SALES",
  REVOPS: "CTX_REVOPS",
  MARKETING: "CTX_MARKETING",
  PRODUCT_ENGINEERING: "CTX_TECH",
  FINANCE: "CTX_FINANCE",
  SERVICE: "CTX_SUPPORT",
  PROCUREMENT: "CTX_SUPPLY_CHAIN",
  PERSONAL: "CTX_PERSONAL",
  BIZOPS: "CTX_BIZOPS",
  IT_ADMIN: "CTX_BIZOPS",
  STUDENT_TEACHER: "CTX_PERSONAL",
};
```

#### WorkspaceShellNew.tsx (725 lines)
**Purpose:** Main workspace UI shell; handles navigation, views, and AI layer

**Structure:**
- **2 Primary Views:** Personal | Work
  - Personal: Tasks, Calendar, Notes (same for everyone)
  - Work: Domain-specific content (role-based)
- **Navigation:** Header tabs (not sidebar context switcher)
- **AI Layer:** Hidden by default; Cmd+K activation opens cognitive drawer
- **Content Router:** Lazy-loads domain modules based on active path

**Key Features:**
- Icon mapping (60+ icons from Lucide)
- Command palette (⌘K)
- Notification center
- Domain/workspace selector dropdown
- Real-time status watching via `useActionRealtime` hook
- Demo data banner (development)

#### ContentRouter.tsx
**Purpose:** Dynamic module loading and routing

Routes requests to domain-specific views:
- Lazy-loads React components based on path
- Passes context (domain, department, user data)
- Integrates with Hydration Fabric for state sync

---

## 3. Design System & Styling

### Color Palette (from `app.css`)
```
Brand Primary (Soft Navy):    #5A7AA0 (muted, professional)
Brand Accent (Warm Coral):    #C97A8A (inviting, balanced)
Background (Warm Off-white):  #F7F8FA (easy on eyes)
Grays (Warm undertones):      #1A2230 → #FAFBFC (9 levels)
Success:                      #5BA88A (muted green)
Warning:                      #D4A05A (muted orange)
Error:                        #C75B5B (muted red)
```

**Philosophy:** Soft, eye-friendly palette with reduced saturation. Avoids harsh whites/blacks.

### Design Tokens (`app.css`)
```css
--brand-primary: #5A7AA0
--brand-accent: #C97A8A
--brand-bg: #F7F8FA
--background: #F7F8FA
--foreground: #2A3442
--primary: #5A7AA0
--secondary: #F0F2F5
--muted: #E8EEF4
--accent: #F5E8EB
--destructive: #C75B5B
--border: #E1E5EB
--ring: #5A7AA0
```

### Tailwind Configuration
- **Plugin:** `@tailwindcss/vite` (v4)
- **Alias:** `@` → `src/`
- **CSS Normalization:** @import "tailwindcss"
- **Layout Priority:** Flexbox first, Grid for 2D layouts

---

## 4. Authentication & Authorization

### Auth System (Supabase PKCE)
Located in `components/core/auth/`:
- **Provider:** `AuthProvider` (Supabase)
- **Methods:** Google SSO, GitHub SSO, Email/Password
- **Flow:** Login page → Signup page → Onboarding → Workspace

### RBAC (Role-Based Access Control)
- **Package:** `@integratewise/rbac`
- **Stored in:** `components/core/rbac/`
- **Supports:** Department-based roles, domain-scoped permissions

---

## 5. Data Management & State

### Hydration Fabric (5-Provider System)
Located in `components/core/hydration/`:

**5 Data Sources:**
1. **Spine Provider** — Adaptive Spine (SSOT via BFF Worker)
2. **REST Provider** — Direct API calls
3. **Doppler Provider** — Environment config
4. **KV Provider** — Key-value cache (Cloudflare KV)
5. **Static Provider** — Hardcoded fallbacks

**Usage:**
```typescript
const { data, isLoading } = useFabricStatus()
const slots = useScopedSlots()
```

### TanStack React Query (v5.59.0)
- **Configured in AppShell.tsx**
- **Default Options:**
  - staleTime: 60,000ms
  - retry: 1
- **Integration:** Works with Supabase realtime for live sync

### Supabase Integration
- **Package:** `@integratewise/supabase`
- **Auth:** Native Supabase Auth (PKCE)
- **Realtime:** WebSocket subscriptions for live updates
- **Database:** PostgreSQL SSOT via Spine

---

## 6. The 12 Domain Views (L1 Workspace)

Each domain has its own directory under `apps/web/src/components/l1/domains/`:

| Domain                | Code Dir                  | Purpose                              | Views (est.) |
| ------------------- | ----------------------- | ----------------------------------- | ---------- |
| Account Success     | `account-success/`      | CS/onboarding/retention/churn       | 40+        |
| Sales Operations    | `salesops/`             | Pipeline, forecasting, quota mgmt   | 20+        |
| Revenue Operations  | `revops/`               | Revenue health, expansion, upsell   | 20+        |
| Marketing           | `marketing/`            | Campaigns, leads, engagement        | 20+        |
| Finance             | `finance/`              | Metrics, forecasts, P&L             | 15+        |
| BizOps              | `bizops/`               | Business operations, KPIs           | 15+        |
| Product Engineering | `product-engineering/`  | Product health, bugs, features      | 20+        |
| Service/Support     | `service/`              | Support tickets, SLAs, satisfaction | 20+        |
| Procurement         | `procurement/`          | Supply chain, vendor mgmt           | 15+        |
| IT Admin            | `it-admin/`             | Systems, access, compliance         | 15+        |
| Personal            | `personal/`             | Tasks, calendar, notes              | 10+        |
| Student/Teacher     | `student-teacher/`      | Education domain                    | 10+        |

**View Pattern:**
```
domain-name/
├── views/
│   ├── [view-name].tsx
│   ├── [another-view].tsx
│   └── ...40+ view files
├── index.ts (exports all views)
└── config.ts (view metadata, roles, paths)
```

---

## 7. Cognitive Layer (L2) — AI Integration

Located in `components/l2/`:

### Components
- **`cognitive/`** — L2 drawer (Cmd+K overlay)
- **`spine/`** — Spine client for context retrieval
- **`goal-framework/`** — Goal-driven AI interactions
- **`bridge/`** — L1 ↔ L2 event communication

### Event System
**Custom events dispatched to L2:**
- `iw:evidence:open` — Open evidence panel
- `iw:cognitive:open` — Open specific cognitive surface
- `open-cognitive-layer` — Generic open (defaults to signals)

### AI Governance
- **Approval-gated:** AI suggests actions, waits for user approval
- **Evidence chains:** Every recommendation backed by data
- **Read-only initially:** AI generates proposals, users execute

---

## 8. Onboarding & Activation (L0)

Located in `components/activation/`:

### OnboardingFlow.tsx (6 Steps)
1. **Tenant Creation** — Org setup
2. **Plan Selection** — Pricing tier
3. **Domain Accelerator** — Industry/use case
4. **Connector OAuth** — First data connection
5. **Profile Setup** — User info
6. **Workspace Launch** — Ready to use

### LoaderPhase1.tsx
- Displays loading spinner before workspace mounts
- Hydrates fabric from 5 data sources
- Waits for auth + tenant + workspace config

---

## 9. Backend Architecture (Cloudflare Workers)

### Services Stack
Located in `services/`:

**Core Services:**
- **gateway** — API ingress point (routes traffic)
- **spine-v2** — Intelligent data layer (SSOT)
- **workflow** — Workflow orchestration
- **pipeline** — 8-stage data normalization
- **connector** — Connector manager (OAuth, sync)
- **intelligence** — AI & predictions
- **l2** — Cognitive layer backend
- **normalizer** — Schema normalization

**Supporting Services:**
- **knowledge** — Knowledge store integration
- **billing** — Paywall & subscriptions
- **store** — Data persistence
- **admin** — Admin APIs
- **agents** — AI agents
- **act** — Action execution engine
- **govern** — Governance & approval workflows
- **loader** — Onboarding data loader
- **tenants** — Tenant management
- **webhook-ingress** — Webhook receiver
- **connector-sync** — Sync orchestration

**Deployment:** Cloudflare Workers (edge-first serverless)

---

## 10. Data Flows (3 Paths)

### Flow A: Structured Truth
CRM → Connectors → Pipeline → Normalizer → Spine (PostgreSQL)

**Data:** CRM, billing, support, finance, project systems

### Flow B: Unstructured Context
Documents → Knowledge Bank → Spine (vector store)

**Data:** Emails, notes, files, transcripts, PDFs

### Flow C: AI Interactions
User → Cognitive Layer → Spine (session memory)

**Data:** Conversation context, decisions, approvals

---

## 11. Shared Packages

### `packages/types/`
Global TypeScript interfaces shared across monorepo

### `packages/config/`
Configuration management (environment, feature flags, etc.)

### `packages/db/`
Database utilities (query builders, migrations)

### `packages/supabase/`
Supabase client wrapper + auth provider

### `packages/rbac/`
Role-based access control system

### `packages/api/`
API client utilities

### `packages/connectors/`
Data connector implementations (Salesforce, HubSpot, etc.)

### `packages/knowledge-bank-ui/`
UI components for knowledge layer

---

## 12. Known Architectural Patterns

### Component Organization
```
components/
├── core/         # Platform infrastructure (auth, hydration, providers)
├── l1/           # User workspace (what user sees)
├── l2/           # AI cognitive layer (behind scenes)
├── activation/   # Onboarding & auth flows
├── connectivity/ # Connector UX
├── common/       # Shared utilities & layouts
└── _deprecated/  # Legacy (v1 architecture)
```

### State Management Pattern
1. **Global:** AuthProvider, SpineProvider, HydrationFabric
2. **Module-level:** React Query (TanStack)
3. **Component-level:** useState (when appropriate)
4. **Realtime:** Supabase subscriptions
5. **Transient:** Context (goal context, tenant context)

### Routing Pattern
- **Router:** React Router v7.0.0
- **Routes:** `routes.tsx` (centralized)
- **Lazy loading:** ContentRouter (domain-specific)
- **Deep linking:** Supported via path + query params

---

## 13. Design System (Figma-Integrated)

### Token Generation
- **Script:** `scripts/extract-figma-tokens.js`
- **Output:** `src/integratewise-figma-tokens.json`
- **CSS:** `src/figma-theme-merged.css`

### Component Library
- **Radix UI** — 30+ unstyled, accessible components
- **Custom Styling** — Tailwind classes + design tokens
- **Theming:** CSS custom properties + Tailwind config

---

## 14. Build & Deployment

### Development
```bash
pnpm install        # Install dependencies
pnpm dev            # Start Vite dev server (port 3000)
pnpm run typecheck  # Type check all packages
pnpm run lint       # Lint all packages
```

### Production
```bash
pnpm build          # Build all packages (Turbo)
pnpm test           # Run all tests
pnpm preflight      # Full preflight: install → typecheck → lint → test → build
```

### Deployment Targets
- **Web App:** Cloudflare Pages (SPA)
- **Backend:** Cloudflare Workers
- **Database:** Supabase PostgreSQL
- **Vector Store:** (Likely Pinecone or Weaviate for embeddings)

---

## 15. Code Quality & Testing

### Linting
- **Configured in:** `turbo.json` and individual package configs
- **Tools:** ESLint, TypeScript

### Type Checking
- **Language:** TypeScript 5.5.0
- **Strict mode:** Likely enabled
- **Types sourced from:** `packages/types/`

### Testing
- **Framework:** Playwright (E2E)
- **Scripts:** `test:e2e`, `test:e2e:ui`
- **Integration tests:** `packages/integration-tests/`

---

## 16. Known Limitations & Technical Debt

### Issues from Branch `ai-connector-error`
This branch addresses errors in AI connector integration. Key area to review:
- AI/connector error handling
- Fallback behaviors
- Logging & observability

### Potential Improvements
1. **Component Library:** No dedicated shadcn/ui setup; building custom components could speed development
2. **State Management:** React Query + Context works but could benefit from Zustand for complex cross-module state
3. **Schema Validation:** No visible Zod/Yup setup; important for connector contract validation
4. **Testing:** E2E tests exist but unit test coverage unclear
5. **Error Handling:** Error boundaries exist but error recovery patterns could be more robust
6. **Performance:** No visible optimization work (lazy loading partially implemented)
7. **Documentation:** README is good; inline component docs could be more thorough

---

## 17. UI/UX Opportunities

### Current State
- ✅ Clean, professional design system (soft palette)
- ✅ Radix UI foundation (accessible)
- ✅ Animation framework (Framer Motion)
- ✅ 12 domain-specific views (comprehensive)
- ✅ Cognitive layer integration (innovative)

### Opportunities for Improvement
1. **Workspace Navigation** — Sidebar could be more discoverable (currently header tabs + dropdown)
2. **Domain Views** — Some views may feel cluttered; could benefit from progressive disclosure
3. **Mobile Responsiveness** — Currently focused on desktop; mobile UX needs work
4. **Onboarding UX** — 6 steps is comprehensive but could be more engaging
5. **Help & Discoverability** — Help widget exists but contextual guidance could be stronger
6. **Dark Mode** — Brand palette is light-focused; dark mode support missing
7. **Accessibility** — Radix UI base is good, but keyboard navigation could be enhanced
8. **Performance Indicators** — Loading states, skeleton screens, and progress indicators need review

---

## 18. Key Files & Entry Points

### Frontend Entry
- **Vite Entry:** `apps/web/src/main.tsx`
- **React Root:** `apps/web/src/App.tsx`
- **Workspace:** `apps/web/src/AppShell.tsx`

### Config Files
- **Workspace:** `pnpm-workspace.yaml`
- **Turbo:** `turbo.json`
- **Vite:** `apps/web/vite.config.ts`
- **Tailwind:** `@tailwindcss/vite` plugin (no separate config file)
- **TypeScript:** `apps/web/tsconfig.json`

### Routes
- **React Router:** `apps/web/src/routes.tsx`
- **Domain Navigation:** `apps/web/src/components/l1/workspace/workspace-config.ts`

### Styles
- **Global CSS:** `apps/web/src/app.css` (design tokens)
- **Figma Tokens:** `apps/web/src/figma-theme-merged.css`
- **Design Tokens:** `apps/web/src/styles/design-tokens.css`

---

## 19. Next Steps for UI Work

Based on this review, here are recommended UI improvements:

### High Priority
1. **Improve Workspace Discoverability**
   - Consider sidebar instead of header-only nav
   - Add breadcrumbs for context
   
2. **Enhance Onboarding**
   - Make 6 steps more visually engaging
   - Add progress indicators
   - Reduce cognitive load

3. **Mobile Responsiveness**
   - Workspace shell mobile layout
   - Domain views mobile-optimized
   - Touch-friendly navigation

4. **Dark Mode**
   - Extend design tokens for dark theme
   - Test contrast ratios
   - Add mode toggle

### Medium Priority
1. **Accessibility Audit** — WCAG 2.1 AA compliance check
2. **Performance Optimization** — Skeleton screens, code splitting review
3. **Help System** — Contextual tooltips, guided tours
4. **Error States** — Improve error messages and recovery options

### Lower Priority
1. **Component Documentation** — Storybook setup
2. **Design System Website** — Figma + Storybook integration
3. **Internationalization** — i18n setup if global expansion planned

---

## Summary

IntegrateWise is a **well-engineered, sophisticated workspace application** built on solid architectural principles. The monorepo is organized, the component structure is logical, and the design system is consistent. The codebase is **production-ready but has room for modern UI/UX improvements** — particularly around navigation discoverability, mobile responsiveness, and dark mode support.

The AI integration (L2 cognitive layer) is innovative and governance-focused, making this a unique workspace product rather than just another dashboard.

---

**Reviewed by:** v0 Assistant  
**Confidence Level:** 95% (based on code exploration)  
**Last Updated:** May 18, 2026

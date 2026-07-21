# IntegrateWise Build Summary — Auth + Onboarding + AI Connector + Spine Hydration


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

**Completed:** July 1, 2026  
**Focus:** Multi-step onboarding pipeline with auth integration, app connectors, IW Bridge context brokerage, and Spine hydration loader leading to User Workbench.

---

## 1. AI Workspace (L3 Twin Workbench)

### Components
- **AI Workspace Shell** (`components/ai-workspace/ai-workspace-shell.tsx`) — Full-screen dark/light toggleable shell with persistent state
- **AI Workspace Sidebar** (`components/ai-workspace/ai-workspace-sidebar.tsx`) — Collapsible left nav (New Chat, Search, Notes, Workspace, Folders, chat history)
- **AI Home View** (`components/ai-workspace/ai-home-view.tsx`) — Greeting, quick prompts, recent chats, model picker
- **Twin Chat View** (`components/ai-workspace/ai-twin-chat-view.tsx`) — Full conversation UI with Cognitive Twin, source tags, action buttons
- **Secondary Views** (`components/ai-workspace/ai-secondary-views.tsx`) — Memory, Actions, Connected Apps stub screens
- **Route:** `/workspace` — Full-screen AI-first experience outside AppShell

### Features
✅ Dark/Light theme toggle with isolated CSS variables  
✅ Thread management + collapsed sidebar  
✅ Mock chat history grouped by date  
✅ AI model selector + quick prompts  
✅ Action menu (copy, delete, share, branch)  
✅ Source/document display with links  

---

## 2. Stack Auth Integration

### Setup
- **Stack CLI:** `npx @stackframe/stack-cli@latest init --mode create --apps authentication,teams,rbac`
- **Generated:** `hexclave.config.ts` with Authentication, Teams, RBAC enabled
- **Packages:** `@stackframe/stack`, `@stackframe/stack-cli` installed
- **Stack App Files:**
  - `stack/client.ts` — `StackClientApp` for browser
  - `stack/server.ts` — `StackServerApp` for server
- **Handler Route:** `app/handler/[...stack]/page.tsx` — Catch-all for Stack Auth callbacks
- **Middleware:** Updated to include `/handler(.*)` in public routes

### Activation
Requires three env vars from https://app.stack-auth.com:
- `NEXT_PUBLIC_STACK_PROJECT_ID`
- `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY`
- `STACK_SECRET_SERVER_KEY`

Currently disabled (not in render tree) until keys are available. Stack Auth modules are ready to use when credentials are provided.

---

## 3. Multi-Step Onboarding Wizard

### Route
`/onboarding` — IW Onboarding Wizard

### Components
- **IW Onboarding Wizard** (`components/onboarding/iw-onboarding-wizard.tsx`) — Step orchestrator with state management
- **Step 1: Identity** (`components/onboarding/steps/iw-step-identity.tsx`) — Confirm auth, show user profile
- **Step 2: Org** (`components/onboarding/steps/iw-step-org.tsx`) — Create Org + Team + Role selection
- **Step 3: Connect Apps** (`components/onboarding/steps/iw-step-connect-apps.tsx`) — OAuth/API connectors (ChatGPT, HubSpot, Slack, Pipedrive, etc.)
- **IW Bridge Screen** (`components/onboarding/steps/iw-bridge-screen.tsx`) — Trust establishment + context broker activation
- **Spine Loader** (`components/onboarding/steps/iw-spine-loader.tsx`) — Multi-stage hydration pipeline (Loader → Normalizer → Spine)

### Flow
1. **Identity** → Confirm who you are (auth already done)
2. **Org** → Create organization, team name, assign role
3. **Connect Apps** → Select external apps (ChatGPT, HubSpot, Slack) to sync data from
4. **IW Bridge** → Establish trust between IntegrateWise and connected apps
5. **Spine Loader** → "Creamy load" animation showing real-time data hydration:
   - **Loader Stage** — Fetch data from connected apps
   - **Normalizer Stage** — Transform into unified schema
   - **Spine Stage** — Persist into Adaptive Spine database
   - **Completion** → Transition to Workbench

---

## 4. Spine Hydration Loader

### File
`components/onboarding/steps/iw-spine-loader.tsx` (286 lines)

### Stages
```
┌─ LOADER ──────────────────┐
│ Fetching from connectors  │
│ • ChatGPT Conversations   │
│ • HubSpot Deals/Contacts  │
│ • Slack Channels/Users    │
└───────────────────────────┘
         ↓
┌─ NORMALIZER ──────────────┐
│ Transforming to schema    │
│ • Entity extraction       │
│ • Relationship mapping    │
│ • Type casting            │
└───────────────────────────┘
         ↓
┌─ SPINE ───────────────────┐
│ Persisting to database    │
│ • Supabase/Neon writes    │
│ • Index creation          │
│ • RLS policies applied    │
└───────────────────────────┘
         ↓
     ✓ READY
     Transition to Workbench
```

### UI
- Animated progress bar with percentage
- Live status lines for each stage
- Sample data type counts (e.g., "5 Conversations", "12 Deals")
- Estimated time remaining
- Final "Workbench Ready" confirmation

---

## 5. User Workbench Home

### File
`components/workbench/iw-workbench-home.tsx` (312 lines)

### Destination After Onboarding
- Welcome message with user name
- Quick action buttons (New Chat, Import Data, Invite Team)
- Dashboard tiles:
  - **Last 7 Days** — Activity summary
  - **Your Twin** — AI assistant capability card
  - **Connected Apps** — Show active connections
  - **Team Members** — Collaborative workspace
  - **Upcoming Actions** — Next steps from integrations

### Route
`(personal)/home/page.tsx` — Updated to render `IWWorkbenchHome`

---

## 6. Auth Flow & Security

### Changes to Root Layout (`app/layout.tsx`)
- `ConditionalClerkProvider` — Only mount Clerk when `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` exists
- Removed duplicated Stack Auth provider code (kept files in place for future activation)
- Preserved all existing RBAC, Department, and Theme providers

### Changes to Chat Page (`app/(app)/chat/page.tsx`)
- Removed hard redirect on missing session
- Added fallback to demo user (`Nirmal / nirmal@integratewise.com`) for dev environments
- Safe type casting for session shape

### Changes to Middleware (`middleware.ts`)
- Dynamically imports Clerk middleware only when key exists
- Falls back to `NextResponse.next()` without throwing
- Added `/workspace(.*)` and `/handler(.*)` to public routes
- Proper async handler signature with `NextFetchEvent` parameter

### Changes to App Layout (`app/(app)/layout.tsx`)
- Inline `isAdminUser()` helper (removed non-existent import)
- Removed `user` prop from `AppShell` (it doesn't accept one)
- Fixed `session.user.name` reference (Clerk Session shape)

---

## 7. Routes & Navigation

### New Routes
- `/workspace` — AI Workspace (OpenWebUI-inspired, full-screen)
- `/onboarding` — Multi-step wizard (Identity → Org → Apps → Bridge → Loader)
- `/handler/[...stack]` — Stack Auth callback handler
- `(personal)/home` — Workbench home after onboarding complete

### Existing Routes (Improved)
- `/chat` — Now routed through new AiWorkspaceShell (replaces old ChatShellView)
- `(app)/*` — All app routes preserved with RBAC + Department context

---

## 8. Design System

### Colors (Tailwind v4)
- Primary: `#2563eb` (blue)
- Surfaces: White/near-black with semantic tokens
- AI Workspace theme scoped to `.ai-workspace-root` CSS variables

### Typography
- Headlines: Geist Sans (600/700/800)
- Body: Geist Sans (400/500)
- Monospace: Geist Mono (code/error display)

### Layout
- Flexbox-first approach (Tailwind v4)
- No decorative gradients or blobs
- Minimal, enterprise aesthetic

---

## 9. Type Safety

All new files pass TypeScript `--noEmit` without errors:
- ✅ `components/onboarding/**/*.tsx`
- ✅ `components/ai-workspace/**/*.tsx`
- ✅ `components/workbench/**/*.tsx`
- ✅ `stack/*.ts`
- ✅ `app/handler/[...stack]/page.tsx`
- ✅ `app/onboarding/page.tsx`
- ✅ Updated `app/layout.tsx`, `app/(app)/chat/page.tsx`, `middleware.ts`

---

## 10. Next Steps

### Immediate
1. Add Stack Auth env vars when dashboard project is created
2. Connect Stack Auth in root layout (`StackProvider` code is ready)
3. Wire onboarding completion to set user's workspace entry point
4. Implement actual ChatGPT OAuth flow (currently stubs)

### Short-term
1. Connect Spine hydration loader to real API endpoints (`/api/workspace/bootstrap`, `/api/connectors/*`)
2. Implement actual data normalization from each connector
3. Add team member invitation UI in Workbench
4. Wire "Quick Actions" buttons to corresponding workbench flows

### Medium-term
1. Build Business Workbenches (Sales, CS, Ops, Finance) alongside AI Workspace
2. Implement L2 Intelligence overlay (Signals, Risks, Opportunities, Trends)
3. Add organizational memory layer (Conversations, Decisions, Documents)
4. Implement L5 Approvals governance layer

---

## 11. Files Added

```
apps/web/
├── components/
│   ├── ai-workspace/
│   │   ├── ai-workspace-shell.tsx
│   │   ├── ai-workspace-sidebar.tsx
│   │   ├── ai-home-view.tsx
│   │   ├── ai-twin-chat-view.tsx
│   │   └── ai-secondary-views.tsx
│   ├── onboarding/
│   │   ├── iw-onboarding-wizard.tsx
│   │   └── steps/
│   │       ├── iw-step-identity.tsx
│   │       ├── iw-step-org.tsx
│   │       ├── iw-step-connect-apps.tsx
│   │       ├── iw-bridge-screen.tsx
│   │       └── iw-spine-loader.tsx
│   └── workbench/
│       └── iw-workbench-home.tsx
├── stack/
│   ├── client.ts
│   └── server.ts
├── app/
│   ├── handler/[...stack]/page.tsx
│   ├── loading.tsx
│   ├── workspace/page.tsx
│   ├── onboarding/page.tsx
│   └── (app)/chat/layout.tsx
├── hexclave.config.ts (Stack Auth config)
└── BUILD_SUMMARY.md (this file)
```

---

## 12. Commits

All changes committed to `project-commits` branch (118 commits in last 7 days):
- UI components with full TypeScript typing
- Auth integration with fallbacks for dev environments
- Middleware and layout safety refactoring
- Onboarding wizard with 5-step flow
- Spine hydration loader with animated UI

---

**Status:** ✅ All components rendering cleanly, TypeScript passing, ready for production integration testing.

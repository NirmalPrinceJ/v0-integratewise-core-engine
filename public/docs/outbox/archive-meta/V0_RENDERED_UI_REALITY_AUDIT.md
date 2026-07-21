# V0 Rendered UI Reality Audit

> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

**Audit date:** July 11, 2026  
**Repository:** `NirmalPrinceJ/integratewise-live`  
**Branch:** `v0/integratewi-1ebfc754`  
**Primary runnable frontend:** `apps/live` (`@integratewise/live`, Next.js 15.5.20 at runtime)  
**Audit viewport:** 593 × 765 CSS px, with a 375 × 667 responsive check  
**Method:** Browser-first route rendering with `agent-browser`, interaction testing, screenshots, console inspection, then source tracing only where rendering was blocked.

## 1. Executive verdict

The repository contains a very large UI component inventory, but the currently reachable product is not a stable, coherent application shell. The browser-visible reality is:

1. `/` redirects to `/landing`, but the browser is then diverted into a Clerk development/keyless sign-in surface instead of reliably showing the public landing page.
2. Public onboarding pages render, but visibly carry two overlapping brand treatments, a Clerk missing-keys overlay, stale 2024 footer copy, and a progression action that can remain disabled as `Continuing...`.
3. Authenticated routes are protected by Clerk, while the embedded `/workspace` application has a second, Cloudflare-auth-based state machine and internal React Router. This creates two auth models and two routing models in one user journey.
4. The requested Leads route is not a real Next.js page. Marketing Leads exists only as an internal module at `/app/work/leads` inside the `/workspace` MemoryRouter shell. A separate BizOps CRM lead pipeline also exists. There is no routed lead-detail page.
5. Many screens are coded as polished-looking shells with data hooks, but important visible controls are inert: `Add Lead`, lead rows/cards, `New Campaign`, and numerous card affordances have no handlers or destinations.

**Overall classification: non-deployable UI shell with substantial prototype/component coverage.** The strongest asset is breadth of domain component work. The primary blocker is not lack of screens; it is the absence of one authoritative runtime, route grammar, auth boundary, data contract, and interaction standard.

## 2. Evidence captured

| Evidence                                                                                                                             | Observation                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| [`audit-evidence/v0-rendered-ui/landing-593x765.png`](audit-evidence/v0-rendered-ui/landing-593x765.png)                             | The nominal landing journey resolves to Clerk's generic development sign-in card, not IntegrateWise marketing UI.             |
| [`audit-evidence/v0-rendered-ui/onboarding-department-593x765.png`](audit-evidence/v0-rendered-ui/onboarding-department-593x765.png) | Department onboarding at the active preview width: overlapping wordmarks and a Clerk environment warning obscure the product. |
| [`audit-evidence/v0-rendered-ui/onboarding-department-375x667.png`](audit-evidence/v0-rendered-ui/onboarding-department-375x667.png) | On mobile, the same header collision persists; warning UI obscures middle choices and footer text wraps poorly.               |

Browser console evidence included:

- Clerk development-key warnings.
- Clerk structural-CSS warning.
- Failed RSC payload fetch during Clerk keyless synchronization.
- Missing `/icon.svg` and `/icon-light-32x32.png` responses.
- Repeated missing `chat-static` CSS, JavaScript, and font assets during the keyless redirect flow.
- Clerk's visible `Missing environment keys` prompt on public onboarding pages.

## 3. Runnable frontend and route reality

### 3.1 Which frontend actually boots

The root `package.json` points `dev` to `@integratewise/live`. `vercel.json` also targets `apps/live/.next`, although its build filter says `live` while the package is named `@integratewise/live`. `apps/web` exists as a separate Next.js 16 package but currently has no `app/**/page.tsx` route inventory in this checkout. No runnable `apps/workspace` package was found.

`apps/live` does boot directly with `pnpm dev` and compiled the tested public routes. However, the root Turbo configuration contains unresolved Git conflict markers around `concurrency`, so the normal monorepo task path is invalid.

### 3.2 Next.js route inventory

| Route family                                 | Browser/HTTP reality                                                       | Classification                                       |
| -------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------- |
| `/`                                          | 307 to `/landing`                                                          | Redirect only                                        |
| `/landing`                                   | HTTP 200, but browser was taken into Clerk keyless sign-in synchronization | Broken public entry                                  |
| `/login`, `/signup`                          | HTTP 200; Clerk-backed pages                                               | Auth prototype; brand/runtime mismatch               |
| `/onboarding`                                | 307 to `/onboarding/email-verification`                                    | Redirect only                                        |
| 14 onboarding step routes                    | Source pages exist; first steps compiled and rendered publicly             | UI prototype; progression not trustworthy            |
| `/dashboard`                                 | Protected by Clerk; simple zero-state dashboard in source                  | Stub/prototype                                       |
| `/workspace`                                 | Protected by Clerk; mounts the large internal app in a MemoryRouter        | Main product prototype, not externally deep-linkable |
| `/capabilities`                              | Protected standalone page                                                  | Prototype                                            |
| `/integrations`                              | Protected standalone page                                                  | Prototype                                            |
| `/schema`                                    | Protected standalone page                                                  | Prototype                                            |
| `/leads`, `/lead/:id`, `/admin`, `/settings` | No Next.js pages                                                           | Missing as actual routes                             |

### 3.3 Route grammar conflict

Three incompatible route grammars coexist:

- Next.js pages: `/dashboard`, `/workspace`, `/integrations`, `/schema`, `/capabilities`.
- Internal MemoryRouter paths: `/app/work/<module>` and `/app/personal/<module>`.
- Dashboard links to absent Next.js routes such as `/settings/team`.

Because `/workspace` mounts a `MemoryRouter`, internal navigation changes memory history rather than the browser's actual Next.js route. Source comments and handlers refer to `/app/work/dashboard`, but there is no Next.js `/app` route. A refresh or pasted deep link therefore does not reliably reconstruct the intended product surface.

## 4. Auth and onboarding reality

### Critical: two independent auth systems

The root Next.js application is wrapped in `ClerkProvider`; middleware and the protected app layout use Clerk. Inside `/workspace`, `AppShell` uses a separate Cloudflare auth context and a local onboarding metadata cache. The source documentation still mentions Supabase PKCE in places. This is not merely stale copy: it produces two login/onboarding state machines with different session assumptions.

### Browser-observed onboarding defects

1. **Header collision:** a green `Integrate Wise` mark and black `IntegrateWise` title occupy the same horizontal position. This is visible at both tested widths.
2. **Environment prompt blocks the flow:** Clerk's dark missing-keys card overlays department options.
3. **Interaction can dead-end:** selecting Customer Success and clicking `Next: Business Goals` changed the button to disabled `Continuing...`, but the URL remained `/onboarding/department` after the check.
4. **Cards are generic clickable containers:** the accessibility tree exposes department cards as generic clickable elements, not radio inputs or buttons with selected state.
5. **Progress lacks meaning:** the header exposes the literal text `Step indicators`, not a useful current-step/total-step label.
6. **Copy is stale:** footer says `© 2024` in a 2026 product build.
7. **Onboarding taxonomy diverges from workspace taxonomy:** onboarding offers Sales, Customer Success, Finance, Operations, Executive, and Support, while the workspace domain model includes 12 different domain keys and labels.

## 5. Leads page audit

### 5.1 The canonical Leads route does not exist

There is no `/leads` Next.js page and no `/lead/:id` page. The visible product has two competing lead concepts:

- **Marketing Leads**: internal module ID `leads`, intended path `/app/work/leads`, implemented by `MarketingLeadsView`.
- **BizOps CRM**: internal module ID `crm`, a lead pipeline with Kanban/list modes, implemented by `CRMView`.

This ambiguity should be resolved before visual redesign. Marketing-qualified leads and sales/CRM leads may be related projections, but they should not be two unrelated UI grammars without explicit ownership and navigation.

### 5.2 Marketing Leads information architecture

Current structure:

- Header: `Leads`
- Search input
- `Add Lead` button
- Table-like CSS grid columns: Lead, Source, Score, Status, Last Activity
- Empty state when no projection data exists

What is good:

- Compact scanning hierarchy.
- Search is implemented as local filtering.
- The empty state accurately states a connector dependency.
- Lead score uses visual severity coloring.

What fails:

- `Add Lead` has no handler.
- Rows look clickable but have no click handler, link, selected state, keyboard behavior, or destination.
- No lead detail route, drawer, or side panel exists.
- No sorting, stage filter, ownership filter, bulk selection, pagination, saved view, import, or deduplication path.
- Fixed five-column CSS grid has no responsive fallback and will compress or overflow at narrow widths.
- Loading, request failure, stale data, and permission-denied states are not separately rendered.
- “Last Activity” is raw unformatted source data.

**Classification:** read-only projection prototype.

### 5.3 BizOps CRM information architecture

Current structure:

- CRM title and descriptive subtitle
- `Add Lead`
- Four KPI cards
- Search, stage filter, and Kanban/list toggle
- Four pipeline stages
- Lead cards or table rows

What is good:

- Better operational hierarchy than Marketing Leads.
- Provides stage and view filters.
- Includes pipeline value, conversion rate, qualified count, score, owner, source, and value.

What fails:

- `Add Lead` has no handler.
- Cards and rows appear clickable but do nothing.
- No drag/drop or explicit stage transition action exists.
- No lead detail, activity composer, audit trail, conversion confirmation, duplicate management, or owner reassignment.
- Source is represented with emoji, conflicting with the rest of the Lucide icon system and reducing enterprise consistency.
- At 593 px, the `grid-cols-2` Kanban still forces two dense columns; at 375 px it remains two columns because the base is `grid-cols-2`.
- The list table has no horizontal-scroll wrapper.
- `company.toLowerCase()` and other assumptions can throw on incomplete records.

**Classification:** richer interactive-looking prototype; most consequential actions are missing.

### 5.4 Expected Leads interaction grammar

A real Leads surface needs one consistent grammar:

- `/app/work/leads` or a real Next.js equivalent as the collection route.
- `/app/work/leads/:leadId` or a deterministic side-panel deep link as detail.
- Search, filter, sort, saved views, and bulk selection.
- Add/import lead flows with validation, duplicate detection, ownership, and source attribution.
- Stage change with confirmation or undo and an audit event.
- Detail tabs: Overview, Activity, Relationships, Evidence, Decisions, Governance.
- Clear loading, empty, error, offline, stale, and unauthorized states.
- Every row/card reachable by keyboard with a visible focus state and semantic link/button behavior.

## 6. Major product surfaces

| Surface                          | Actual state                                                                                        | User-risk                                         |
| -------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| Landing                          | Implemented in source, not reliably reachable in browser due Clerk keyless flow                     | Critical acquisition failure                      |
| Login/signup                     | Clerk surface plus separate Cloudflare auth inside workspace                                        | Critical identity inconsistency                   |
| Onboarding                       | 14 source routes plus a second six-step embedded onboarding flow                                    | Critical duplicated journey                       |
| Dashboard                        | Basic zero-state cards with hard-coded 0/1 values                                                   | High; looks disconnected from product             |
| Workspace shell                  | Broad internal UI with Work/Personal views and projected nav                                        | High-potential prototype, blocked by auth/routing |
| Account Success                  | Deepest component family; many views and an entity-centric model                                    | Medium-to-high; needs runtime proof               |
| Sales                            | Dashboard, pipeline, Kanban, deals, contacts, activities, forecasting, quotes, sequences, analytics | Prototype coverage                                |
| Marketing                        | Campaigns, leads, analytics, channels, forms                                                        | Read-heavy prototype                              |
| RevOps                           | Pipeline, forecast, quotas, cohorts, metrics, review, decisions                                     | Prototype coverage                                |
| Product & Engineering            | Incidents, roadmap, features, bugs, sprints, releases, analytics, feedback                          | Prototype coverage                                |
| Finance                          | Revenue, expenses, reports, forecast, budget, approvals                                             | Prototype coverage                                |
| Service                          | Tickets, customers, knowledge, analytics, satisfaction, SLA                                         | Prototype coverage                                |
| Procurement                      | Renewals, vendors, orders, contracts, spend, savings                                                | Prototype coverage                                |
| IT Admin                         | Systems, incidents, vulnerabilities, certificates, licenses                                         | Prototype coverage                                |
| Student/Teacher                  | At-risk, students, courses, assignments, gradebook                                                  | Prototype coverage                                |
| Personal                         | Dashboard, today, projects, decisions, knowledge, tasks, calendar, notes                            | Prototype coverage                                |
| BizOps                           | Very broad super-domain with cross-department copies of modules                                     | Severe navigation overload risk                   |
| Admin                            | Large component inventory but no standalone Next.js `/admin` route                                  | Inaccessible/inconsistent                         |
| Settings                         | Internal module exists; dashboard links to missing `/settings/team`                                 | Broken navigation                                 |
| Capabilities/integrations/schema | Standalone protected pages outside the main internal route grammar                                  | Fragmented architecture                           |

## 7. Navigation and shell audit

### Strengths

- Work and Personal are explicit top-level concepts.
- Domain configuration centralizes much of the menu vocabulary.
- Command palette and notification center exist.
- Lazy module loading and module error boundaries are present.

### Problems

1. **Navigation authority is not singular.** Projection-native navigation, database product navigation, domain config fallback, and a static `MODULE_PATH_MAP` all compete.
2. **Declared links and loaded modules do not fully match.** Example: Account Success nav declares `risk-matrix`, `engagement-log`, `cs-queue`, and `knowledge`, while the content map uses other keys or omits some mappings.
3. **MemoryRouter masks route integrity.** Browser URL, Next.js route, and internal active path can diverge.
4. **Domain config uses emoji icons**, while the shell otherwise relies on Lucide.
5. **BizOps duplicates every other domain** through prefixed module IDs, producing an enormous navigation surface rather than a task-oriented operations center.
6. **Admin/settings live in multiple places** and do not have a coherent permission-aware route hierarchy.
7. **Error recovery points to nonexistent `/app/work/dashboard`** at the Next.js layer.

## 8. Visual consistency and density

The UI is not one design system in practice. Observed and source-traced patterns include:

- Clerk's purple generic auth UI versus IntegrateWise forest/gold product styling.
- Onboarding's pale blue cards and black CTA versus the forest/gold workspace.
- Simple dashboard cards using direct Tailwind slate/blue/green/purple/orange values.
- Workspace modules using `--iw-*` tokens, semantic tokens, direct hex values, inline styles, gradients, and emoji in parallel.
- Multiple shell concepts: standalone Next pages, `WorkspaceShellNew`, `UnifiedShell`, `WorkShell`, `PersonalShell`, plus deprecated shells.

Density also varies sharply: onboarding is spacious and card-heavy, the dashboard is generic SaaS spacing, and domain tables use 10–12 px labels and fixed desktop grids. The product does not yet feel like a deliberate adaptive-density system; it feels like several design eras composed together.

## 9. Loading, empty, error, and failure states

### Existing

- Generic module Suspense/loading support.
- Module error boundary with Retry.
- Empty messages in several domain views.
- Onboarding buttons expose loading labels.
- A top-level “Something went wrong” screen exists.

### Missing or misleading

- Data loading often collapses to an empty collection, making “no data” indistinguishable from “not loaded” or “request failed.”
- No common stale/offline/permission-denied state grammar.
- Top-level error state uses an emoji and a gradient, unlike the normal product system.
- Retry resets the local boundary but does not guarantee refetch or invalidation.
- Error action routes are not valid Next.js routes.
- Buttons can enter indefinite disabled states.
- Connector-dependent empties often provide no direct, working connector CTA.

## 10. Responsive behavior

### Browser-observed

- At 593 × 765 and 375 × 667, the onboarding wordmark/title collision persists.
- The Clerk environment warning obscures interactive cards at both widths.
- Footer text wraps into a visually weak two-line block on mobile.
- The page itself remains scrollable and the primary button stays within viewport width.

### Source-traced risks

- Marketing Leads uses a fixed five-column grid without mobile collapse or horizontal scrolling.
- BizOps CRM uses two Kanban columns at its smallest breakpoint rather than one.
- Several data tables have no `overflow-x-auto` parent.
- The shell is designed around a full desktop navigation/content frame; mobile navigation behavior could not be authenticated and proven.
- Widespread 10 px labels and compact controls are below a comfortable enterprise-mobile reading target.

## 11. Interaction matrix

| Interaction                   | Observed/implemented behavior                 | Verdict                           |
| ----------------------------- | --------------------------------------------- | --------------------------------- |
| Root entry                    | Redirects into Clerk keyless flow             | Broken                            |
| Department select             | Selection changes visually                    | Partial                           |
| Department Next               | Can remain `Continuing...` without navigation | Broken                            |
| Marketing lead search         | Local filter                                  | Works in source                   |
| Marketing Add Lead            | No handler                                    | Inert                             |
| Marketing lead row            | Cursor/hover only                             | Inert                             |
| CRM search/filter/view toggle | Local state logic exists                      | Prototype functional              |
| CRM Add Lead                  | No handler                                    | Inert                             |
| CRM lead card/row             | Cursor/hover only                             | Inert                             |
| Dashboard Manage Team         | Links to nonexistent `/settings/team`         | Broken                            |
| Workspace deep links          | Internal MemoryRouter only                    | Not refresh-safe                  |
| Module error Retry            | Resets boundary state                         | Partial                           |
| Command palette               | Implemented in shell                          | Not runtime-proven due auth block |
| Notifications                 | Implemented in shell                          | Not runtime-proven due auth block |

## 12. Broken UI and engineering defects

### P0 — prevents trustworthy evaluation or deployment

1. Clerk keys/environment are not configured for the active preview; warning UI and keyless synchronization alter the rendered experience.
2. Public landing is not reliably public in the browser.
3. Clerk-protected Next shell conflicts with Cloudflare auth inside `/workspace`.
4. Internal `/app/...` routing has no corresponding Next.js route ownership.
5. Root `turbo.json` contains unresolved merge-conflict markers.

### P1 — breaks core product journeys

1. Onboarding can dead-end on `Continuing...`.
2. Two different onboarding systems exist.
3. Leads has no detail route and primary actions are inert.
4. Dashboard contains missing-route links and hard-coded zero values.
5. Navigation/module keys can diverge.
6. No unified loading/error/empty/offline grammar.

### P2 — damages usability and product confidence

1. Overlapping onboarding brand header.
2. Missing icon assets and Clerk static-asset errors.
3. Fixed desktop grids on Leads and other tables.
4. Emoji mixed with Lucide icons.
5. Stale copy and architecture comments.
6. Multiple visual token systems and direct color usage.

## 13. Prioritized fix backlog

### Phase 0 — establish one runtime contract

1. Choose the production auth owner: Clerk **or** Cloudflare auth. Remove the other from the user-facing runtime.
2. Choose the route owner: Next.js App Router is recommended. Replace MemoryRouter-only paths with actual App Router segments or a single intentional catch-all route.
3. Fix `turbo.json` conflict markers and verify the root dev/build commands.
4. Make `/landing`, `/login`, and `/signup` deterministic without keyless detours.
5. Add a sanctioned audit/demo tenant or test-session mechanism so every protected surface can be rendered in CI and browser audits.

### Phase 1 — restore coherent first-run experience

1. Keep one onboarding flow and one domain taxonomy.
2. Repair the overlapping brand header and remove environment overlays from production UI.
3. Make each step semantic, keyboard-accessible, resumable, and failure-aware.
4. Add explicit step count, Back, Save and exit, retry, and support paths.
5. Verify every step at desktop and mobile widths with persisted state.

### Phase 2 — make Leads the reference L1 surface

1. Define canonical collection and detail routes.
2. Reconcile Marketing Leads and BizOps CRM ownership.
3. Implement Add, import, row navigation, detail, stage changes, owner assignment, and activity timeline.
4. Add loading, empty, error, stale, offline, unauthorized, and connector-not-configured states.
5. Add responsive list/card behavior and table horizontal scrolling where necessary.
6. Use this screen as the template for Accounts, Deals, Contacts, Tickets, Vendors, and other entity collections.

### Phase 3 — normalize the shell and design system

1. One shell, one header, one navigation authority, one icon system.
2. Resolve navigation from a validated surface registry rather than four competing sources.
3. Standardize page header, KPI strip, toolbar, collection, detail, drawer, modal, and status components.
4. Define three supported density modes and minimum typography/touch targets.
5. Remove direct palette values and stale/deprecated shells from active imports.

### Phase 4 — prove every declared surface

1. Generate automated route/surface checks from the registry.
2. Add browser smoke tests for every domain's dashboard and primary entity.
3. Report unhandled buttons, invalid internal links, console errors, and absent empty/error states.
4. Gate deployment on no broken routes, no auth warnings, and no critical console failures.

## 14. Recommended acceptance criteria for the next audit

- Public landing renders IntegrateWise at `/landing` without external/keyless detours.
- One login creates a session recognized by all product routes.
- Every main navigation item has a refresh-safe URL.
- `/leads` collection and `/leads/:id` detail both render and complete create/update flows.
- No primary-looking button is inert.
- No console errors, missing assets, or environment overlays.
- All L1 collections distinguish loading, empty, error, stale, unauthorized, and offline states.
- Desktop, 593 px, and 375 px screenshots show no overlap, clipping, inaccessible content, or forced unreadable grids.
- Surface registry and rendered route inventory match exactly.

## 15. Bottom line

IntegrateWise has enough component breadth to demonstrate the intended operating-system vision, but the rendered product is currently governed by competing runtimes rather than a coherent UI contract. The fastest route to a real product is not adding more domain screens; it is consolidating auth, routing, shell, and state grammar, then turning Leads into the first fully operational L1 reference surface.

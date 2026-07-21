# IntegrateWise Continuity Bridge — Product UI Specification

> **Version:** 1.0.0 | **Date:** 2026-07-03 | **Status:** Final Product Specification  
> **For:** IntegrateWise Engineering & Product Design Teams  
> **Scope:** Concrete UI specification for the 8 user-facing product components of the Continuity Bridge.

---

## Table of Contents

1. [User Workbench](#1-user-workbench)
2. [Overlay (Communication Layer)](#2-overlay-communication-layer)
3. [AI Home (OpenWeb UI-like)](#3-ai-home)
4. [Capability Fabric](#4-capability-fabric)
5. [Ingress (UI Entry Points)](#5-ingress)
6. [Audit Logs (Transparency Layer)](#6-audit-logs)
7. [Browser Automation](#7-browser-automation)
8. [Workflows](#8-workflows)

---

## Design System Foundations

### Color Palette (Tailwind)

```css
:root {
  /* Primary: Deep Trust Blue */
  --iw-primary-50: #eff6ff;
  --iw-primary-100: #dbeafe;
  --iw-primary-200: #bfdbfe;
  --iw-primary-300: #93c5fd;
  --iw-primary-400: #60a5fa;
  --iw-primary-500: #3b82f6;
  --iw-primary-600: #2563eb;
  --iw-primary-700: #1d4ed8;
  --iw-primary-800: #1e40af;
  --iw-primary-900: #1e3a8a;

  /* Neutral: Slate — NOT gray for warmth */
  --iw-neutral-50: #f8fafc;
  --iw-neutral-100: #f1f5f9;
  --iw-neutral-200: #e2e8f0;
  --iw-neutral-300: #cbd5e1;
  --iw-neutral-400: #94a3b8;
  --iw-neutral-500: #64748b;
  --iw-neutral-600: #475569;
  --iw-neutral-700: #334155;
  --iw-neutral-800: #1e293b;
  --iw-neutral-900: #0f172a;

  /* Semantic */
  --iw-success: #22c55e;
  --iw-warning: #f59e0b;
  --iw-danger: #ef4444;
  --iw-info: #3b82f6;

  /* Confidence heat */
  --iw-confidence-high: #22c55e; /* ≥0.85 */
  --iw-confidence-medium: #f59e0b; /* 0.70–0.85 */
  --iw-confidence-low: #ef4444; /* <0.70 */

  /* Surface */
  --iw-surface: #ffffff;
  --iw-elevated: #f8fafc;
  --iw-canvas: #f1f5f9;
  --iw-overlay: rgba(15, 23, 42, 0.4);
}
```

### Typography

```css
--iw-font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
--iw-font-mono: "JetBrains Mono", "Fira Code", monospace;
--iw-font-display: "Inter", sans-serif; /* Use variable weight for headings */

/* Scale */
--text-xs: 0.75rem; /* 12px — captions, tags */
--text-sm: 0.875rem; /* 14px — body secondary, metadata */
--text-base: 1rem; /* 16px — primary body */
--text-lg: 1.125rem; /* 18px — section titles */
--text-xl: 1.25rem; /* 20px — card titles */
--text-2xl: 1.5rem; /* 24px — page titles */
--text-3xl: 1.875rem; /* 30px — hero headings */
```

### Spacing Scale (Tailwind)

```
4px   (1)   — micro gaps, icon padding
8px   (2)   — tight internal padding
12px  (3)   — button padding, list gaps
16px  (4)   — card padding, section gaps
20px  (5)   — form field gaps
24px  (6)   — panel internal padding
32px  (8)   — major section separation
40px  (10)  — page-level padding
48px  (12)  — hero spacing
64px  (16)  — major page sections
```

### Shadow & Elevation

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.04);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -1px rgba(0, 0, 0, 0.04);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
--shadow-twin: 0 0 0 1px rgba(59, 130, 246, 0.15), 0 4px 12px rgba(59, 130, 246, 0.12);
```

### Animation Tokens

```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--duration-fast: 150ms; /* micro-interactions */
--duration-normal: 250ms; /* state transitions */
--duration-slow: 400ms; /* panel movements */
--duration-dramatic: 600ms; /* page transitions */
```

---

## 1. User Workbench

### 1.1 Overview

The User Workbench is the primary working surface of IntegrateWise. It is not a data viewer — it is where users perform actual work on unified data without switching contexts. It reads from the Adaptive Spine, queries the Capability Fabric for available actions, and is enriched by the Twin's inline insights.

**User Journey Position:** Step 3 (WORK) of the 6-step flow: CONNECT → HYDRATE → **WORK** → AI → MEMORY → REPEAT.

**Core Principles:**

- One workbench. All tools. One truth. No tab switching.
- Every action is governed and audited.
- 8 projections adapt the interface to the user's role without changing the underlying data.
- The Twin is ambient — present but not intrusive.

---

### 1.2 Layout / Wireframe Description

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  TOP BAR (64px)                                                             │
│  ┌────┐ ┌────────────────────────────────────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ │
│  │ IW │ │ 🔍  Search anything...        ⌘K   │ │ 🔔 │ │ ✨ │ │ 👤 │ │ ⚙️ │ │
│  └────┘ └────────────────────────────────────┘ └────┘ └────┘ └────┘ └────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐  ┌────────────────────────────────────┐  ┌────────────────┐  │
│  │ ENTITY   │  │                                    │  │                │  │
│  │ EXPLORER │  │         DETAIL PANE                │  │  ACTION PANEL  │  │
│  │ (240px)  │  │        (Fluid, min 480px)          │  │   (320px)      │  │
│  │          │  │                                    │  │                │  │
│  │ ┌──────┐ │  │  ┌────────────────────────────┐   │  │ ┌────────────┐ │  │
│  │ │Sales │◄─┼──┼──┤  ENTITY HEADER             │   │  │ │ Quick      │ │  │
│  │ │CS    │ │  │  │  [Icon] Acme Corporation   │   │  │ │ Actions    │ │  │
│  │ │Fin   │ │  │  │  ┌────────┬────────┐       │   │  │ │ • Email    │ │  │
│  │ │Exec  │ │  │  │  │Tab:360 │Tab:Rel │ ...   │   │  │ │ • Call     │ │  │
│  │ │Arch  │ │  │  │  └────────┴────────┘       │   │  │ │ • Task     │ │  │
│  │ │Ops   │ │  │  │                            │   │  │ └────────────┘ │  │
│  │ │Pers  │ │  │  │  ┌────────────────────┐    │   │  │ ┌────────────┐ │  │
│  │ │Dev   │ │  │  │  │ ENTITY360 CONTENT  │    │   │  │ │ Related    │ │  │
│  │ └──────┘ │  │  │  │                    │    │   │  │ │ Entities   │ │  │
│  │          │  │  │  │  [traits]          │    │   │  │ │ • Contact  │ │  │
│  │ Recently │  │  │  │  [timeline]        │    │   │  │ │ • Deal     │ │  │
│  │ Viewed   │  │  │  │  [memory]          │    │   │  │ └────────────┘ │  │
│  │ • Acme   │  │  │  │                    │    │   │  │                │  │
│  │ • Widget │  │  │  └────────────────────┘    │   │  │ ┌────────────┐ │  │
│  │          │  │  │                            │   │  │ │ Governance │ │  │
│  │          │  │  └────────────────────────────┘   │  │ │ Status     │ │  │
│  │          │  │                                    │  │ └────────────┘ │  │
│  └──────────┘  └────────────────────────────────────┘  └────────────────┘  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  TWIN ENRICHMENT BAR (48px, collapsible)                            │  │
│  │  💡 "3 accounts show churn risk this week. Review →"                │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  MEMORY PANEL (collapsible drawer, 200px when open)                   │  │
│  │  What the system knows about this entity:                           │  │
│  │  • Last interaction: 2 days ago (sent proposal)                     │  │
│  │  • Sentiment: Positive (0.72)                                       │  │
│  │  • Key topics: renewal, pricing, expansion                          │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 1.3 Key UI Components

#### 1.3.1 Top Navigation Bar

```typescript
interface TopBarProps {
  tenant: { name: string; logo?: string };
  user: { displayName: string; avatar?: string; role: Role };
  projection: ProjectionType; // 'sales' | 'cs' | 'finance' | 'executive' | 'architecture' | 'operations' | 'personal' | 'developer'
  notificationCount: number;
  onSearchFocus: () => void;
  onCommandPalette: () => void;
}
```

**Visual Spec:**

- Height: `64px` (`h-16`)
- Background: `--iw-surface` with `border-b border-neutral-200`
- Left: IntegrateWise logo (`32px` square) + tenant name (truncated to `max-w-[160px]`)
- Center: Universal search bar — `max-w-2xl`, `rounded-full`, `bg-neutral-100`, placeholder: "Search anything..."
  - Right inner: `⌘K` badge (`text-xs`, `bg-neutral-200`, `rounded`, `px-1.5`)
  - Focus state: `ring-2 ring-primary-200`, background transitions to white
- Right cluster (gap-2):
  - Notification bell: `relative`, badge for unread count (`absolute -top-1 -right-1 bg-danger text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center`)
  - Twin sparkle icon: `text-primary-500`, pulses subtly when Twin is active
  - User avatar: `32px` circle, `dropdown` on click
  - Settings gear: `dropdown` with projection switcher, preferences, logout

#### 1.3.2 Projection Switcher (Lens Selector)

```typescript
interface ProjectionSwitcherProps {
  current: ProjectionType;
  available: ProjectionType[]; // filtered by RBAC
  onSwitch: (projection: ProjectionType) => void;
}
```

**Visual Spec:**

- Collapsible sidebar section, pinned to top of Entity Explorer
- 8 icons in a vertical stack, `40px` each, `rounded-lg`
- Active projection: `bg-primary-50 text-primary-700`, left border `3px` `bg-primary-500`
- Inactive: `text-neutral-400`, hover: `bg-neutral-50 text-neutral-600`
- Tooltip on hover: projection name + keyboard shortcut (`1`–`8`)
- Switching animation: `fade` + `slide` on Detail Pane content, `200ms`

#### 1.3.3 Entity Explorer (Left Sidebar)

```typescript
interface EntityExplorerProps {
  projection: ProjectionType;
  entityTypes: EntityTypeInfo[]; // filtered by projection
  selectedEntityId?: string;
  recentEntities: RecentEntity[];
  onSelect: (entityId: string) => void;
  onCreate: (entityType: string) => void;
}

interface EntityTypeInfo {
  type: string; // 'account', 'contact', 'deal', ...
  displayName: string;
  icon: string; // Lucide icon name
  count: number; // visible count in current projection
  isFavorite: boolean;
}
```

**Visual Spec:**

- Width: `240px` (`w-60`), collapsible to `64px` (`w-16`) — icons only
- Background: `--iw-elevated` (`bg-slate-50`)
- Section 1: Projection Switcher (see above)
- Section 2: Entity Types (collapsible groups)
  - Each entity type: `icon` + `name` + `count` pill (`bg-neutral-200 text-neutral-600 text-xs rounded-full px-2`)
  - Selected: `bg-primary-50 text-primary-700`, right chevron
  - Hover: `bg-neutral-100`
- Section 3: Recently Viewed (last 10, scrollable)
  - Each item: `avatar` (if contact) or `building` icon + `name` + `type` badge
  - Hover: show `pin` icon to favorite
- Section 4: Quick Actions (sticky bottom)
  - "+ Create" button: `primary` style, opens flyout menu of entity types

#### 1.3.4 Detail Pane (Center)

```typescript
interface DetailPaneProps {
  entity: Entity360 | null;
  activeTab: DetailTab;
  onTabChange: (tab: DetailTab) => void;
  onAction: (capability: string, payload: unknown) => void;
}

type DetailTab = "entity360" | "relationships" | "timeline" | "memory" | "audit" | "knowledge";
```

**Visual Spec:**

- Fluid width: `flex-1`, min `480px`
- Background: `--iw-surface` (`bg-white`)
- Entity Header (`80px`):
  - Left: Entity type icon (`40px`, `rounded-lg`, `bg-primary-100 text-primary-600`) + entity name (`text-xl font-semibold`) + SSOC ID (muted, `text-xs`, `font-mono`)
  - Right: Action dropdown (favorite, share, archive) + status badge (if applicable)
- Tab Bar (`44px`, `border-b`):
  - Tabs: `Entity360`, `Relationships`, `Timeline`, `Memory`, `Audit`, `Knowledge`
  - Active: `border-b-2 border-primary-500 text-primary-700`
  - Inactive: `text-neutral-500 hover:text-neutral-700`
- Content area: scrollable, `p-6`

**Entity360 Tab Content:**

- Traits grid: `grid-cols-2` or `grid-cols-3` depending on viewport
  - Each trait: `label` (`text-xs uppercase tracking-wide text-neutral-500`) + `value` (`text-sm`)
  - Editable traits: click to edit, `inline` `input` or `select`, `blur` or `Enter` to save
- Relationship mini-map: `200px` height, D3.js force-directed graph of linked entities
- Timeline: vertical scrollable, `400px` max, reverse chronological
  - Each event: `dot` + `timestamp` + `action` + `actor` + `via` badge
- Memory snippets: cards showing what the system knows (`text-sm`, `bg-amber-50 border border-amber-200 rounded-lg`)

#### 1.3.5 Action Panel (Right Sidebar)

```typescript
interface ActionPanelProps {
  entity: Entity360 | null;
  availableCapabilities: CapabilityInfo[]; // filtered by entity type + user role
  governanceStatus: GovernanceStatus | null;
  onExecute: (capability: string, payload: unknown) => void;
  onPropose: (capability: string, payload: unknown) => void;
}
```

**Visual Spec:**

- Width: `320px` (`w-80`), collapsible to `0` (hidden)
- Background: `--iw-elevated` (`bg-slate-50`), `border-l border-neutral-200`
- Section 1: Quick Actions (primary CTA buttons)
  - Up to 5 most-used capabilities for this entity type
  - Each button: `full-width`, `justify-start`, `gap-3`, icon + label + shortcut (if any)
  - Primary action: `bg-primary-600 text-white hover:bg-primary-700`
  - Secondary: `bg-white border border-neutral-200 hover:bg-neutral-50`
- Section 2: Related Entities (linked list)
  - Each: `flex row`, `gap-3`, `py-2`, `border-b border-neutral-100`
  - Avatar/icon + name + relationship type badge (`owns`, `reports_to`, etc.)
  - Click: navigate to that entity (detail pane updates, history pushed)
- Section 3: Governance Status (if applicable)
  - Pending proposals: `bg-warning-50 border border-warning-200 rounded-lg p-3`
  - Confidence badge: `rounded-full` with color by threshold
  - "Review in My Desk" link

#### 1.3.6 Twin Enrichment Bar

```typescript
interface TwinEnrichmentBarProps {
  insights: TwinInsight[];
  onDismiss: (insightId: string) => void;
  onAction: (insightId: string, action: "accept" | "reject" | "view") => void;
}

interface TwinInsight {
  id: string;
  type: "proposal" | "context" | "suggestion" | "alert" | "pattern";
  message: string;
  confidence: number;
  entityId?: string;
  action?: { capability: string; payload: unknown; label: string };
}
```

**Visual Spec:**

- Height: `48px` (single line), expandable to `auto` (multi-line)
- Background: `bg-primary-50 border-t border-primary-100`
- Left: Sparkle icon (`text-primary-500`) + insight text (`text-sm text-primary-800`)
- Right (if actionable): CTA button(s) + dismiss (`×`)
- Dismissed insights animate out: `slide-up + fade`, `200ms`
- If empty: bar collapses to `0px` with `transition-height`

#### 1.3.7 Memory Panel (Bottom Drawer)

```typescript
interface MemoryPanelProps {
  entity: Entity360 | null;
  memories: MemoryRecord[];
  isOpen: boolean;
  onToggle: () => void;
}
```

**Visual Spec:**

- Collapsible drawer, `200px` open, `0` closed
- Handle: `w-12 h-1 bg-neutral-300 rounded-full mx-auto mt-2`
- Content: `p-4`
- Each memory snippet: `rounded-lg bg-amber-50 border border-amber-200 p-3 mb-2`
  - Content: `text-sm text-amber-900`
  - Meta: `text-xs text-amber-600 mt-1` — source, confidence, last accessed

#### 1.3.8 Universal Search Bar

```typescript
interface UniversalSearchProps {
  isOpen: boolean;
  query: string;
  results: SearchResult[];
  onQueryChange: (q: string) => void;
  onSelect: (result: SearchResult) => void;
  onClose: () => void;
}

interface SearchResult {
  type: "entity" | "capability" | "memory" | "knowledge" | "command";
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  score: number;
  entityType?: string;
}
```

**Visual Spec:**

- Modal overlay: `bg-black/40 backdrop-blur-sm`, `z-50`
- Search container: `max-w-2xl mx-auto mt-24 bg-white rounded-xl shadow-2xl overflow-hidden`
- Input: `w-full px-4 py-3 text-lg border-b border-neutral-200`, auto-focus
  - Left: `Search` icon. Right: `⌘K` badge (when empty)
- Results: grouped by type, `max-h-96 overflow-y-auto`
  - Each result: `flex row gap-3 px-4 py-3 hover:bg-neutral-50 cursor-pointer`
  - Selected: `bg-primary-50`
  - Keyboard: `↑`/`↓` to navigate, `Enter` to select, `Esc` to close

#### 1.3.9 Command Palette

```typescript
interface CommandPaletteProps {
  isOpen: boolean;
  commands: Command[];
  onExecute: (command: Command) => void;
  onClose: () => void;
}

interface Command {
  id: string;
  label: string;
  shortcut?: string; // e.g., '⌘E'
  category: "navigation" | "action" | "projection" | "twin" | "system";
  icon: string;
  action: () => void;
}
```

**Visual Spec:**

- Same container as Universal Search, but commands are static/preset
- Grouped by category with headers (`text-xs uppercase text-neutral-400 font-semibold px-4 py-2`)
- Each command: `flex row gap-3 px-4 py-2.5 hover:bg-neutral-50`
  - Left: `icon` (`16px`, `text-neutral-500`)
  - Center: `label` (`text-sm`)
  - Right: `shortcut` (`text-xs bg-neutral-100 rounded px-1.5 font-mono`)

---

### 1.4 Data Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  DATA FLOW: User Workbench                                                    │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  INBOUND (Read)                                                               │
│  ─────────────                                                                │
│  1. Gateway → Discovery (GET /api/v1/discovery)                              │
│     → projections, capabilities, navigation, personalization                     │
│                                                                               │
│  2. Entity Explorer → L2 Service Binding (KV cache + D1 fallback)            │
│     → entity list by type + projection filter                                 │
│                                                                               │
│  3. Detail Pane → Entity360 Assembly (intelligence service binding)          │
│     → entity + related entities + timeline + memory + knowledge               │
│                                                                               │
│  4. Action Panel → Capability Registry (KV cache)                           │
│     → capabilities filtered by entity type + user role + plan tier           │
│                                                                               │
│  5. Twin Enrichment → Twin Orchestrator DO (SSE stream)                    │
│     → real-time insights based on current entity context                      │
│                                                                               │
│  OUTBOUND (Write)                                                             │
│  ────────────────                                                             │
│  1. Entity CRUD → store service binding → Pipeline Queue → Spine              │
│  2. Capability Execution → Gateway → Capability Router (Hermes DO)            │
│  3. Governance Proposal → Gateway → govern service → HITL DO                │
│  4. Memory Reinforcement → continuity service (implicit, on entity view)      │
│                                                                               │
│  SERVICES CALLED                                                              │
│  ───────────────                                                              │
│  • gateway (auth, routing)                                                    │
│  • l2 (projection queries, KV cache)                                           │
│  • store (entity CRUD)                                                        │
│  • intelligence (Entity360 assembly)                                          │
│  • agent-registry (capability discovery)                                    │
│  • twin-orchestrator (SSE enrichment stream)                                │
│  • govern (pending proposals)                                               │
│  • continuity (memory query)                                                │
│  • knowledge (RAG for entity context)                                       │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

### 1.5 User Interactions

#### Flow: Sales Rep Reviews an Account and Acts

| Step | Action                                             | System Response                                                              | UI Change                                                                                                                                  |
| ---- | -------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 1    | User opens app, already authenticated              | Discovery returns available projections                                      | Sales projection is active (from preference)                                                                                               |
| 2    | User presses `⌘K`                                  | Command palette opens                                                        | Modal overlay with focus on input                                                                                                          |
| 3    | User types "Acme"                                  | Universal search queries Spine + Memory                                      | Results show: Account "Acme Corp", Contact "John @ Acme", Deal "Acme Expansion"                                                            |
| 4    | User selects "Acme Corp" account                   | Entity360 assembled, SSE stream opens to Twin                                | Detail pane loads account header, traits, timeline. Twin bar appears: "Last contact: 5 days ago. Suggested: send follow-up."               |
| 5    | User clicks "Send Follow-up Email" in Action Panel | Capability invocation routed through Hermes, governance pre-check            | If confidence ≥0.85: executes immediately. If 0.70–0.85: proposal queued in My Desk. If <0.70: shows reason for low confidence.            |
| 6    | User switches to CS projection (`2` key)           | Same account, CS lens applied                                                | Detail pane shows: health score, support tickets, NPS, churn risk. Twin bar updates: "Churn risk: medium (0.62). 2 open tickets > 3 days." |
| 7    | User clicks "Review Tickets"                       | Capability invocation to `platform.entity360.get` with `includeTickets=true` | Detail pane updates to show embedded ticket list                                                                                           |
| 8    | User clicks Memory Panel handle                    | Drawer opens, queries `continuity` service                                   | Memory snippets displayed: sentiment, key topics, last interaction                                                                         |

---

### 1.6 States

#### Empty States

| State                  | Visual Treatment                                                                      | Action                         |
| ---------------------- | ------------------------------------------------------------------------------------- | ------------------------------ |
| **No entity selected** | Detail pane: centered illustration + "Select an entity to begin" + suggested entities | Show recent + popular entities |
| **No connected tools** | Entity Explorer: "Connect your first tool" CTA + connector marketplace link           | Prompt to CONNECT step         |
| **No search results**  | Search: "No results for 'X'" + "Did you mean?" + create entity option                 | Offer fuzzy match + create     |
| **No Twin insights**   | Twin bar: collapsed to 0px, no handle visible                                         | Silent — no UI for absence     |
| **No memory**          | Memory panel: "No accumulated memory yet. Interactions will appear here."             | Inform + reassure              |

#### Loading States

| Component      | Loading Indicator                                 | Duration Expectation   |
| -------------- | ------------------------------------------------- | ---------------------- |
| Entity list    | Skeleton rows (`animate-pulse`, `bg-neutral-200`) | <200ms (KV)            |
| Entity360      | Skeleton cards + shimmer on header                | <2s (cache hit <100ms) |
| Capabilities   | Spinner in Action Panel                           | <50ms (KV)             |
| Search results | Inline spinner in search bar                      | <500ms                 |
| Twin insights  | `...` typing indicator in bar                     | <3s                    |

#### Error States

| Error                  | Visual Treatment                                                    | Recovery                              |
| ---------------------- | ------------------------------------------------------------------- | ------------------------------------- |
| **Entity not found**   | "Entity not found or access denied" + 403 icon + "Go back"          | Return to previous entity             |
| **Capability blocked** | Governance badge: "Requires approval" + "Go to My Desk"             | Redirect to proposal                  |
| **Network error**      | Toast: "Connection lost. Retrying..." + offline indicator in header | Auto-retry SSE, manual retry for sync |
| **Rate limited**       | Toast: "Too many requests. Slow down." + countdown                  | Disable rapid actions                 |
| **Permission denied**  | "You don't have access to this" + contact admin CTA                 | Read-only mode                        |

#### Success States

| Action              | Feedback                                      | Duration  |
| ------------------- | --------------------------------------------- | --------- |
| Entity created      | Toast: "Account created" + link to new entity | 3s        |
| Capability executed | Toast: "Done" + inline checkmark              | 2s        |
| Proposal approved   | Inline badge update: "Approved → Executing"   | Immediate |
| Memory reinforced   | Subtle sparkle on Memory Panel icon           | 500ms     |
| Projection switched | Content crossfade                             | 200ms     |

---

### 1.7 Accessibility

| Requirement              | Implementation                                                                                                                      |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Keyboard navigation**  | `Tab` cycles through all interactive elements. `Shift+Tab` reverse. `Enter`/`Space` activates. `Esc` closes modals/panels.          |
| **Command palette**      | `⌘K` (Mac) / `Ctrl+K` (Win) opens. `↑`/`↓` navigates. `Enter` selects. `Esc` closes.                                                |
| **Projection shortcuts** | `1`–`8` switches projections. `Shift+number` opens in split view.                                                                   |
| **Screen reader**        | All icons have `aria-label`. Entity list: `role="listbox"`, `aria-activedescendant`. Detail pane: `aria-live="polite"` for updates. |
| **Focus management**     | Focus trap in modals. Return focus after close. Visible focus ring: `ring-2 ring-primary-500 ring-offset-2`.                        |
| **Color contrast**       | All text meets WCAG AA (4.5:1). Confidence badges use shape + text, not just color.                                                 |
| **Reduced motion**       | `prefers-reduced-motion: reduce` disables animations. Transitions become instant.                                                   |
| **Entity Explorer**      | `aria-label="Entity Explorer"`. Collapsible: `aria-expanded`. Tree items: `aria-selected`.                                          |
| **Twin Bar**             | `aria-live="polite"` so insights are announced. Dismiss button has `aria-label="Dismiss insight"`.                                  |
| **Memory Panel**         | `aria-label="Memory about this entity"`. Drawer: `aria-hidden` when closed.                                                         |

---

### 1.8 Responsive Behavior

| Breakpoint              | Layout                                                                                         | Behavior                                                                                                          |
| ----------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Desktop (≥1280px)**   | Full 3-column: Explorer (240px) + Detail (fluid) + Action (320px)                              | All panels visible. Twin bar and Memory drawer at bottom.                                                         |
| **Tablet (768–1279px)** | 2-column: Explorer (collapsed to 64px icons) + Detail (fluid). Action panel as overlay drawer. | Action panel toggles via floating FAB. Memory drawer as bottom sheet.                                             |
| **Mobile (<768px)**     | Single column: Detail pane only. Explorer as overlay drawer. Action panel as bottom sheet.     | Swipe left from edge opens Explorer. Swipe right from edge opens Action panel. Bottom nav bar for common actions. |
| **Mobile collapsed**    | Only selected entity visible. Search is primary entry point.                                   | Command palette becomes primary navigation.                                                                       |

---

## 2. Overlay (Communication Layer)

### 2.1 Overview

The Overlay is the **ambient, always-on communication layer**. It is not a separate page — it is a floating companion that lives alongside the Workbench. It carries the Twin's 5 communication channels: Proposals, Notifications, Morning Briefing, Workbench Enrichment, and Direct Messaging.

**User Journey Position:** Cross-cutting. Present in all phases after HYDRATE. The Twin is ambient — it does not wait to be called.

**Core Principles:**

- Ephemeral: never takes over the screen.
- Context-aware: shows insights based on what the user is looking at.
- Dismissible: every message can be dismissed with one click or swipe.
- Non-blocking: work continues underneath.

---

### 2.2 Layout / Wireframe Description

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        WORKBENCH CONTENT                             │   │
│  │                                                                     │   │
│  │                                                                     │   │
│  │                                                                     │   │
│  │                                                                     │   │
│  │                                                                     │   │
│  │                                                                     │   │
│  │                                                                     │   │
│  │                                                                     │   │
│  │                                                                     │   │
│  │                                                                     │   │
│  │                                                                     │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐    │
│  │  TWIN ENRICHMENT BAR (inline, above overlay)                     │    │
│  │  💡 "3 accounts show churn risk..."    [Review] [Dismiss]       │    │
│  └──────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  MEMORY PANEL DRAWER (bottom, collapsible)                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────┐                                                                    │
│  │  ●  │  ← FLOATING BUBBLE (bottom-right, 56px)                         │
│  │ 🤖  │     • Subtle pulse when unread                                   │
│  └─────┘     • Color dot for priority                                     │
│              • Drag to reposition (within bounds)                         │
│                                                                           │
│  [OVERLAY EXPANDED STATE — slides in from right edge]                    │
│  ┌────────────────────────────────────────────────────────┐               │
│  │  OVERLAY PANEL (400px wide, max 80vh)                  │               │
│  │  ┌──────────────────────────────────────────────────┐    │               │
│  │  │  HEADER (48px)                                   │    │               │
│  │  │  [🤖] Twin        [🔔] [✉️] [⚙️]               │    │               │
│  │  └──────────────────────────────────────────────────┘    │               │
│  │  ┌──────────────────────────────────────────────────┐    │               │
│  │  │  CONTEXT CHIP (current entity)                   │    │               │
│  │  │  📁 Acme Corp  →  What would you like to do?    │    │               │
│  │  └──────────────────────────────────────────────────┘    │               │
│  │  ┌──────────────────────────────────────────────────┐    │               │
│  │  │  MESSAGE STREAM (scrollable, reverse)            │    │               │
│  │  │  ┌────────────────┐                            │    │               │
│  │  │  │ 🔔 Notification │  "Salesforce sync complete" │    │               │
│  │  │  └────────────────┘                            │    │               │
│  │  │  ┌────────────────────────────────────┐        │    │               │
│  │  │  │ 💡 Proposal (confidence: 0.92)     │        │    │               │
│  │  │  │ "Update Acme's renewal date to     │        │    │               │
│  │  │  │  July 15. It was pushed from SF."  │        │    │               │
│  │  │  │ [Approve] [Modify] [Dismiss]       │        │    │               │
│  │  │  └────────────────────────────────────┘        │    │               │
│  │  │  ┌────────────────┐                            │    │               │
│  │  │  │ 🤖 Twin         │  "You usually review..."  │    │               │
│  │  │  └────────────────┘                            │    │               │
│  │  │  ┌────────────────────────────────────┐        │    │               │
│  │  │  │ 📊 Morning Briefing                 │        │    │               │
│  │  │  │ 3 new deals, 2 proposals pending    │        │    │               │
│  │  │  │ [View Full Briefing]                │        │    │               │
│  │  │  └────────────────────────────────────┘        │    │               │
│  │  └──────────────────────────────────────────────────┘    │               │
│  │  ┌──────────────────────────────────────────────────┐    │               │
│  │  │  QUICK INPUT BAR (56px)                          │    │               │
│  │  │  [🎤] [Type a message or command...] [Send]      │    │               │
│  │  │  ┌──────────────────────────────────────────┐    │    │               │
│  │  │  │ CAPABILITY BUTTONS: 📧 Email  📞 Call    │    │    │               │
│  │  │  │                     📋 Task  🔗 Link      │    │    │               │
│  │  │  └──────────────────────────────────────────┘    │    │               │
│  │  └──────────────────────────────────────────────────┘    │               │
│  └────────────────────────────────────────────────────────┘               │
│                                                                             │
│  [TOAST NOTIFICATIONS — top-right, stacked]                               │
│  ┌────────────────────────────────────┐                                    │
│  │ ✅  Salesforce sync completed        │  ← auto-dismiss 5s              │
│  │ ⚠️  3 proposals need review          │  ← persistent until acted       │
│  └────────────────────────────────────┘                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 2.3 Key UI Components

#### 2.3.1 Floating Bubble

```typescript
interface FloatingBubbleProps {
  unreadCount: number;
  priority: "none" | "info" | "warning" | "proposal";
  isOpen: boolean;
  onClick: () => void;
  onDragEnd: (position: { x: number; y: number }) => void;
}
```

**Visual Spec:**

- Size: `56px` circle (`w-14 h-14`)
- Position: `fixed bottom-6 right-6`, `z-50`
- Background: `bg-white shadow-lg border border-neutral-200`
- Icon: Twin robot icon (`text-primary-600`, `24px`)
- Unread badge: `absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center`
  - Priority info: `bg-primary-500 text-white`
  - Priority warning: `bg-warning-500 text-white`
  - Priority proposal: `bg-danger-500 text-white animate-pulse`
- Pulse: `animate-subtle-pulse` when unread > 0 (not aggressive, 3s cycle)
- Drag: `pointer-events-auto`, constrained to viewport minus `24px` padding
- Hover: `scale-105`, `shadow-xl`, `transition-transform duration-200`
- Open state: icon rotates `90°` to `×` (close indicator)

#### 2.3.2 Overlay Panel (Slide-out Drawer)

```typescript
interface OverlayPanelProps {
  isOpen: boolean;
  contextEntity?: { id: string; name: string; type: string };
  messages: OverlayMessage[];
  onClose: () => void;
  onSendMessage: (text: string) => void;
  onAction: (messageId: string, action: string) => void;
}

interface OverlayMessage {
  id: string;
  type: "notification" | "proposal" | "twin" | "briefing" | "user";
  content: string;
  timestamp: Date;
  confidence?: number;
  actions?: { label: string; action: string; style: "primary" | "secondary" | "danger" }[];
  metadata?: Record<string, unknown>;
}
```

**Visual Spec:**

- Width: `400px` (`w-[400px]`), max `90vw` on mobile
- Height: `max-h-[80vh]`, `min-h-[400px]`
- Position: `fixed right-0 bottom-0`, slides in from right
- Background: `bg-white shadow-2xl border-l border-neutral-200 rounded-tl-2xl`
- Animation: `translate-x-full` → `translate-x-0`, `400ms`, `ease-out`
- Header (`48px`):
  - Left: Twin avatar (`32px`) + "Twin" label (`text-sm font-medium`)
  - Right: Notification bell + Message count + Settings (gear)
- Context Chip (`40px`):
  - Shows current entity if user is viewing one
  - `bg-neutral-100 rounded-full px-3 py-1 text-xs flex items-center gap-2`
  - Clicking: "What about this entity?" quick query
- Message Stream (`flex-1`, scrollable):
  - Reverse chronological (newest at bottom)
  - Each message: `rounded-lg p-3 mb-2 max-w-[90%]`
  - Type-specific styling:
    - **Notification:** `bg-neutral-50 border border-neutral-200`, left-aligned
    - **Proposal:** `bg-primary-50 border border-primary-200`, left-aligned, confidence badge
    - **Twin:** `bg-amber-50 border border-amber-200`, left-aligned
    - **Briefing:** `bg-blue-50 border border-blue-200`, left-aligned, full-width
    - **User:** `bg-primary-600 text-white`, right-aligned
  - Timestamp: `text-[10px] text-neutral-400 mt-1` on all messages
- Input Bar (`56px`):
  - Text input: `flex-1 bg-neutral-100 rounded-full px-4 py-2 text-sm`
  - Placeholder: "Ask the Twin anything..." or context-aware: "About Acme Corp..."
  - Send button: `primary` icon button, disabled when empty
  - Voice input: `🎤` icon (optional, speech-to-text)
- Capability Buttons (collapsible row above input):
  - Context-aware quick actions: `Email`, `Call`, `Task`, `Link`, `Summarize`
  - Each: `rounded-full bg-white border border-neutral-200 px-3 py-1 text-xs hover:bg-neutral-50`

#### 2.3.3 Proposal Card (within Overlay)

```typescript
interface ProposalCardProps {
  proposal: {
    id: string;
    summary: string;
    confidence: number;
    reasoningTrace: string;
    estimatedImpact?: { revenue?: number; timeSaved?: number; riskScore?: number };
    capability: string;
    payload: unknown;
  };
  onApprove: () => void;
  onModify: () => void;
  onReject: () => void;
  onDismiss: () => void;
}
```

**Visual Spec:**

- Container: `bg-primary-50 border border-primary-200 rounded-lg p-4`
- Header: `💡` + "Proposal" + confidence badge
  - Confidence badge: `rounded-full px-2 py-0.5 text-xs font-bold`
    - `≥0.85`: `bg-success text-white` + "Auto-approved"
    - `0.70–0.85`: `bg-warning text-white` + "Needs approval"
- Body: `text-sm text-primary-900` summary
- Reasoning: collapsible `accordion`, `text-xs text-primary-600`
- Impact: mini-metrics row if available (`revenue`, `timeSaved`)
- Actions: `flex gap-2 mt-3`
  - `Approve`: `bg-primary-600 text-white rounded-md px-3 py-1.5 text-sm`
  - `Modify`: `bg-white border border-primary-300 text-primary-700 rounded-md px-3 py-1.5 text-sm`
  - `Reject`: `text-danger text-sm hover:underline`
  - `Dismiss`: `text-neutral-400 text-xs hover:text-neutral-600` (x icon)

#### 2.3.4 Toast Notifications

```typescript
interface ToastProps {
  id: string;
  type: "success" | "warning" | "error" | "info";
  message: string;
  duration: number; // ms, 0 = persistent
  action?: { label: string; onClick: () => void };
  onDismiss: () => void;
}
```

**Visual Spec:**

- Position: `fixed top-6 right-6`, `z-50`, stacked with `gap-2`
- Container: `bg-white rounded-lg shadow-lg border px-4 py-3 min-w-[300px] max-w-[400px] flex items-start gap-3`
- Border color by type:
  - Success: `border-success`
  - Warning: `border-warning`
  - Error: `border-danger`
  - Info: `border-primary`
- Icon: `20px` by type (check, alert, x, info)
- Message: `text-sm text-neutral-700`
- Action: `text-sm font-medium text-primary-600 hover:text-primary-700` (if provided)
- Dismiss: `×` icon, `text-neutral-400 hover:text-neutral-600`
- Auto-dismiss: `duration` timer with thin progress bar at bottom (`h-0.5`)
- Animation: `slide-in-right` + `fade`, `300ms`

#### 2.3.5 Morning Briefing Card

```typescript
interface MorningBriefingCardProps {
  briefing: {
    overnightChanges: ChangeSummary[];
    pendingProposals: number;
    scheduledTasks: TaskSummary[];
    memorySuggestions: string[];
    proactiveInsights: string[];
  };
  onViewFull: () => void;
  onDismiss: () => void;
}
```

**Visual Spec:**

- Full-width within overlay, `bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3`
- Header: `☀️` + "Good morning, [Name]" + `text-sm font-medium text-blue-900`
- Sections (collapsible, default open):
  - Overnight changes: bullet list, `text-xs text-blue-700`
  - Pending proposals: `bg-warning-100 rounded px-2 py-1 text-xs` inline
  - Scheduled tasks: `text-xs`, strikethrough when checked
  - Memory suggestions: `italic text-xs text-blue-600`
- Footer: "View full briefing →" link + dismiss

---

### 2.4 Data Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  DATA FLOW: Overlay (Communication Layer)                                     │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  INBOUND (Real-time)                                                          │
│  ───────────────────                                                            │
│  1. SSE Stream: gateway → client (event stream)                                │
│     → notifications, proposals, twin insights, briefing triggers              │
│                                                                               │
│  2. Context sync: Workbench selected entity → Overlay context chip             │
│     → when user navigates, Overlay knows what they're looking at             │
│                                                                               │
│  3. Discovery refresh: every 60s (KV cache)                                   │
│     → capability buttons update based on current context + role               │
│                                                                               │
│  OUTBOUND (User actions)                                                      │
│  ────────────────────────                                                       │
│  1. Approve/Reject proposal → gateway → govern service → HITL DO             │
│  2. Send message → gateway → twin-orchestrator DO → think service            │
│  3. Quick action → capability invoke → Hermes → act → provider              │
│  4. Dismiss → client-side (no server call, but telemetry logged)             │
│                                                                               │
│  DATA SOURCES                                                                 │
│  ────────────                                                                 │
│  • SSE: /v1/events (Server-Sent Events, persistent connection)               │
│  • Context: Workbench state (shared client-side store)                        │
│  • Capabilities: Discovery KV cache (filtered by entity type + role)         │
│  • Proposals: govern service (pending for user)                              │
│  • Notifications: notification queue (KV-backed)                         │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

### 2.5 User Interactions

#### Flow: User Receives and Acts on a Proposal

| Step | Action                                          | System Response                                                      | UI Change                                                    |
| ---- | ----------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------ |
| 1    | Twin generates proposal (confidence 0.78)       | Proposal queued in HITL DO, SSE event emitted                        | Floating bubble pulses orange, unread badge +1               |
| 2    | User clicks floating bubble                     | Overlay panel slides in, message stream shows new proposal at bottom | Proposal card rendered with "Needs approval" badge           |
| 3    | User clicks "Approve"                           | Gateway → govern → HITL DO → ACT_QUEUE → act → provider              | Proposal card updates: "Approved → Executing..." → "Done ✅" |
| 4    | User types "Why did you suggest that?" in input | Gateway → twin-orchestrator DO → reasoning trace returned            | Twin message appears: "Based on the pattern..."              |
| 5    | User dismisses overlay                          | Panel slides out, floating bubble returns to normal                  | Bubble shows no unread if all handled                        |

---

### 2.6 States

#### Empty States

| State            | Visual Treatment                                                          |
| ---------------- | ------------------------------------------------------------------------- |
| **No messages**  | "You're all caught up. The Twin is watching." + subtle robot illustration |
| **No context**   | Context chip shows: "No entity selected. Browse or search to begin."      |
| **Disconnected** | "Reconnecting..." + spinner in header. Retry button after 5s.             |

#### Loading States

| Component        | Indicator                                  |
| ---------------- | ------------------------------------------ |
| Message stream   | Skeleton messages (`animate-pulse`)        |
| Proposal card    | Inline spinner on action buttons           |
| Send message     | Input disabled + "Thinking..." placeholder |
| SSE reconnecting | Header dot: `yellow` + "Reconnecting..."   |

---

### 2.7 Accessibility

| Requirement       | Implementation                                                                                                              |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Keyboard**      | `Esc` closes overlay. `Tab` traps within panel. `Enter` sends message. `↑`/`↓` navigates message history (in input).        |
| **Screen reader** | Messages: `aria-live="polite"` on stream container. Proposals: `role="alert"` + `aria-label="Proposal requiring approval"`. |
| **Focus**         | When panel opens, focus moves to input. When closed, focus returns to trigger.                                              |
| **Motion**        | Panel slides only if `prefers-reduced-motion: no-preference`. Otherwise: instant appear.                                    |
| **Contrast**      | All message types meet AA. Proposal badges have text + color.                                                               |

---

### 2.8 Responsive Behavior

| Breakpoint           | Behavior                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------ |
| **Desktop**          | Panel: `400px` right-side drawer. Bubble: bottom-right.                                          |
| **Tablet**           | Panel: `100vw` overlay from bottom (sheet). Bubble: bottom-right.                                |
| **Mobile**           | Panel: full-screen bottom sheet (`h-[90vh]`). Bubble: bottom-right, `48px`. Swipe down to close. |
| **Mobile landscape** | Panel: `50vw` right-side drawer.                                                                 |

---

## 3. AI Home

### 3.1 Overview

AI Home is the dedicated natural-language interface to the entire platform. It is where the user goes to "talk to the AI" directly — like OpenWeb UI, ChatGPT, or Claude. Unlike the Overlay (ambient), AI Home is an intentional destination: the user opens it to have a focused conversation with the Twin.

**User Journey Position:** Step 4 (AI) — "The AI knew what I needed before I asked."

**Core Principles:**

- Natural language is the primary input. The AI understands context, capabilities, and intent.
- Every response is grounded in what the system knows (Memory, Entity360, Knowledge).
- The AI can cite its sources. The user can verify.
- The AI can invoke capabilities directly (with governance).
- File uploads enable multimodal analysis.

---

### 3.2 Layout / Wireframe Description

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  TOP BAR (56px)                                                             │
│  ┌────┐ ┌─────────────────┐ ┌────────────────────────────────────────────┐  │
│  │ IW │ │ AI Home         │ │ [Model: GPT-5 ▼]  [New Chat]  [Settings]   │  │
│  └────┘ └─────────────────┘ └────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐  ┌────────────────────────────────────┐  ┌────────────────┐  │
│  │ CHAT     │  │                                    │  │  CONTEXT PANEL │  │
│  │ HISTORY  │  │         CHAT CANVAS                │  │  (320px)       │  │
│  │ (260px)  │  │        (Fluid, centered)           │  │                │  │
│  │          │  │                                    │  │ ┌────────────┐ │  │
│  │ New Chat │  │  ┌────────────────────────────┐   │  │ │ Current    │ │  │
│  │ [+]      │  │  │                              │   │  │ │ Topic      │ │  │
│  │          │  │  │  [WELCOME / EMPTY STATE]     │   │  │ │ • Entities │ │  │
│  │ Today    │  │  │  ┌────────────────────────┐  │   │  │ │ • Memory   │ │  │
│  │ ┌──────┐ │  │  │  │  "What can I help     │  │   │  │ │ • Knowledge│ │  │
│  │ │Brief │ │  │  │  │   you with today?"    │  │   │  │ └────────────┘ │  │
│  │ │Deal  │ │  │  │  │                        │  │   │  │                │  │
│  │ └──────┘ │  │  │  │  [Quick starters]     │  │   │  │ ┌────────────┐ │  │
│  │          │  │  │  │  ┌────┐ ┌────┐ ┌────┐ │  │   │  │ │ Capabilities│ │  │
│  │ Yesterday│  │  │  │  │Summ│ │Last│ │Create│  │   │  │ │ Available   │ │  │
│  │ ┌──────┐ │  │  │  │  │arize│ │Week│ │Task│  │   │  │ │ • 42 tools  │ │  │
│  │ │Churn │ │  │  │  │  └────┘ └────┘ └────┘ │  │   │  │ │   connected │ │  │
│  │ └──────┘ │  │  │  └────────────────────────┘  │   │  │ └────────────┘ │  │
│  │          │  │  │                              │   │  │                │  │
│  │ 7 Days   │  │  │  [MESSAGES]                  │   │  │ ┌────────────┐ │  │
│  │ ┌──────┐ │  │  │                              │   │  │ │ Memory     │ │  │
│  │ │Q2   │ │  │  │  ┌────────────────────────┐   │   │  │ │ References │ │  │
│  │ └──────┘ │  │  │  │ 👤 User                │   │   │  │ │ (cited)    │ │  │
│  │          │  │  │  │ "What should I do      │   │   │  │ │ • Account  │ │  │
│  │ 30 Days  │  │  │  │  about Acme Corp?"     │   │   │  │ │   history  │ │  │
│  │ ┌──────┐ │  │  │  └────────────────────────┘   │   │  │ │ • Past     │ │  │
│  │ │Sync  │ │  │  │                              │   │   │  │ │   decisions│ │  │
│  │ └──────┘ │  │  │  ┌────────────────────────┐   │   │  │ └────────────┘ │  │
│  │          │  │  │  │ 🤖 Twin                 │   │   │  │                │  │
│  │          │  │  │  │ "Based on the account    │   │   │  │ ┌────────────┐ │  │
│  │          │  │  │  │  health score (0.72) and │   │   │  │ │ File       │ │  │
│  │          │  │  │  │  2 open tickets..."     │   │   │  │ │ Uploads    │ │  │
│  │          │  │  │  │                          │   │   │  │ │ • Q2.pdf   │ │  │
│  │          │  │  │  │ [Tool Call: entity360]  │   │   │  │ │ • logo.png │ │  │
│  │          │  │  │  │ [Tool Call: memory]     │   │   │  │ └────────────┘ │  │
│  │          │  │  │  │                          │   │   │  └────────────────┘  │
│  │          │  │  │  │ [💡 Proposal card]      │   │   │                     │  │
│  │          │  │  │  │ "I suggest escalating   │   │   │                     │  │
│  │          │  │  │  │  to CSM. Approve?"      │   │   │                     │  │
│  │          │  │  │  │ [Approve] [Dismiss]     │   │   │                     │  │
│  │          │  │  │  └────────────────────────┘   │   │                     │  │
│  │          │  │  │                              │   │                     │  │
│  │          │  │  │  ┌────────────────────────┐   │   │                     │  │
│  │          │  │  │  │ 👤 User                │   │   │                     │  │
│  │          │  │  │  │ "Show me the pipeline" │   │   │                     │  │
│  │          │  │  │  └────────────────────────┘   │   │                     │  │
│  │          │  │  │                              │   │                     │  │
│  │          │  │  │  ┌────────────────────────┐   │   │                     │  │
│  │          │  │  │  │ 🤖 Twin (generating)   │   │   │                     │  │
│  │          │  │  │  │ [streaming dots]         │   │   │                     │  │
│  │          │  │  │  └────────────────────────┘   │   │                     │  │
│  │          │  │  │                              │   │                     │  │
│  │          │  │  └────────────────────────────┘   │                     │  │
│  │          │  │                                    │                     │  │
│  │          │  │  ┌────────────────────────────────┐                     │  │
│  │          │  │  │ INPUT BAR (72px)               │                     │  │
│  │          │  │  │ ┌────┐ ┌─────────────────┐ ┌──┐                     │  │
│  │          │  │  │ │ 📎 │ │ Type a message... │ │⬆️│  [Capability      │  │
│  │          │  │  │ │    │ │                   │ │  │   buttons row]    │  │
│  │          │  │  │ └────┘ └─────────────────┘ └──┘                     │  │
│  │          │  │  └────────────────────────────────┘                     │  │
│  │          │  │                                    │                     │  │
│  └──────────┘  └────────────────────────────────────┘  └────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 3.3 Key UI Components

#### 3.3.1 Chat History Sidebar

```typescript
interface ChatHistoryProps {
  sessions: ChatSession[];
  activeSessionId: string;
  onSelect: (sessionId: string) => void;
  onNewChat: () => void;
  onDelete: (sessionId: string) => void;
  onRename: (sessionId: string, title: string) => void;
}

interface ChatSession {
  id: string;
  title: string; // auto-generated or user-edited
  preview: string; // last message preview
  timestamp: Date;
  messageCount: number;
  isPinned: boolean;
}
```

**Visual Spec:**

- Width: `260px` (`w-65`), collapsible to `0` on mobile
- Background: `bg-slate-50 border-r border-neutral-200`
- Top: "New Chat" button (`full-width`, `primary`, `gap-2`, `+` icon)
- Grouped by date: "Today", "Yesterday", "7 Days", "30 Days"
- Each session:
  - `flex row gap-3 px-3 py-2 rounded-lg hover:bg-neutral-100 cursor-pointer`
  - Icon: `message-square` or `pin` (if pinned)
  - Title: `text-sm truncate max-w-[180px]`
  - Preview: `text-xs text-neutral-400 truncate`
  - Right: `...` menu (rename, delete, pin)
- Active: `bg-primary-50 text-primary-700 border-l-3 border-primary-500`
- Empty: "No conversations yet. Start one!"

#### 3.3.2 Chat Canvas (Message Stream)

```typescript
interface ChatCanvasProps {
  messages: ChatMessage[];
  isGenerating: boolean;
  onRegenerate: (messageId: string) => void;
  onCopy: (text: string) => void;
  onFeedback: (messageId: string, feedback: "good" | "bad") => void;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  toolCalls?: ToolCallDisplay[];
  memoryCitations?: MemoryCitation[];
  fileAttachments?: FileAttachment[];
  proposal?: ProposalCardProps["proposal"];
}
```

**Visual Spec:**

- Centered, `max-w-3xl`, `mx-auto`
- Background: `bg-white` (subtle `bg-neutral-50` for AI messages)
- Scrollable, reverse? No — scrollable top-to-bottom, auto-scroll to bottom on new messages
- User messages: `ml-auto max-w-[80%] bg-primary-600 text-white rounded-2xl rounded-tr-sm px-4 py-3`
- AI messages: `mr-auto max-w-[80%] bg-neutral-50 border border-neutral-200 rounded-2xl rounded-tl-sm px-4 py-3`
- System/tool messages: `full-width bg-neutral-100 border border-neutral-200 rounded-lg px-4 py-2`
- Message actions (AI only, on hover):
  - `Copy`, `Regenerate`, `👍`/`👎` feedback
  - Row of icons, `text-neutral-400 hover:text-neutral-600`, `gap-2`
- Streaming state: `...` dots animation (`animate-bounce` on 3 dots)

#### 3.3.3 Model Selector

```typescript
interface ModelSelectorProps {
  models: AIModel[];
  selected: string;
  onSelect: (modelId: string) => void;
}

interface AIModel {
  id: string;
  name: string;
  provider: "openai" | "anthropic" | "openrouter" | "local";
  description: string;
  capabilities: ("text" | "vision" | "code" | "long-context")[];
  isAvailable: boolean;
}
```

**Visual Spec:**

- Dropdown in top bar, right-aligned
- Trigger: `rounded-full bg-neutral-100 px-3 py-1.5 text-sm flex items-center gap-2`
- Selected model name + `▾` chevron
- Dropdown: `bg-white rounded-lg shadow-lg border border-neutral-200 py-1 min-w-[240px]`
- Each model:
  - `flex row gap-3 px-3 py-2.5 hover:bg-neutral-50`
  - Left: provider icon + model name (`text-sm font-medium`)
  - Right: capability badges (`text-[10px]`, `bg-neutral-100 rounded px-1`)
  - Description: `text-xs text-neutral-400` below name
- Unavailable: `opacity-50 cursor-not-allowed`, tooltip: "Enterprise plan required"

#### 3.3.4 Tool Call Display

```typescript
interface ToolCallDisplayProps {
  toolCall: {
    id: string;
    capability: string;
    status: "pending" | "running" | "success" | "error";
    input?: unknown;
    output?: unknown;
    latencyMs?: number;
  };
}
```

**Visual Spec:**

- Inline within AI message, `full-width`
- Container: `bg-neutral-100 rounded-lg border border-neutral-200 p-3 mb-2`
- Header: `flex row gap-2 items-center`
  - Status icon: spinner (`pending`/`running`), check (`success`), x (`error`)
  - Capability name: `text-xs font-mono font-medium text-neutral-700`
  - Latency: `text-[10px] text-neutral-400` (if completed)
- Expandable: `accordion` with input/output details
  - Input: `JSON` formatted, `font-mono text-xs bg-white rounded p-2`
  - Output: same, collapsed by default
- Error: `bg-danger-50 border-danger-200`, error message shown inline

#### 3.3.5 Memory Citation

```typescript
interface MemoryCitationProps {
  citation: {
    memoryId: string;
    content: string;
    source: string;
    confidence: number;
    entityName?: string;
  };
}
```

**Visual Spec:**

- Inline within AI message, `inline-block` or `block` depending on context
- Container: `bg-amber-50 border border-amber-200 rounded px-2 py-1 text-xs inline-flex items-center gap-1`
- Icon: `bookmark` or `brain` (`text-amber-600`)
- Text: truncated content + "→" link to full memory
- Hover: tooltip shows full content + source + confidence
- Click: opens Memory detail modal or navigates to entity

#### 3.3.6 Capability Invocation Buttons (Bottom)

```typescript
interface CapabilityButtonsProps {
  capabilities: { capability: string; label: string; icon: string }[];
  onInvoke: (capability: string) => void;
}
```

**Visual Spec:**

- Row of `rounded-full bg-white border border-neutral-200 px-3 py-1 text-xs` pills
- Above input bar, `gap-2`, `flex-wrap`
- Context-aware: changes based on conversation topic
- Hover: `bg-neutral-50 shadow-sm`
- Click: sends message with capability trigger + shows tool call display

#### 3.3.7 File Upload

```typescript
interface FileUploadProps {
  files: File[];
  maxSize: number; // bytes
  acceptedTypes: string[];
  onUpload: (files: File[]) => void;
  onRemove: (fileIndex: number) => void;
}
```

**Visual Spec:**

- Trigger: `📎` icon button in input bar, left side
- Click: opens file picker
- Drag-and-drop: entire chat canvas accepts drops (`border-2 border-dashed border-primary-400 bg-primary-50` when dragging)
- Uploaded files: row of chips above input bar
  - Each chip: `bg-neutral-100 rounded-full px-3 py-1 text-xs flex items-center gap-2`
  - Icon by mime type (`image`, `pdf`, `document`)
  - Filename (truncated) + `×` to remove
- Progress: inline `progress bar` if uploading to R2
- Error (too large): `toast` with max size info

---

### 3.4 Data Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  DATA FLOW: AI Home                                                           │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  INBOUND                                                                      │
│  ───────                                                                      │
│  1. Chat sessions → D1 (chat_sessions table) + KV cache (recent)             │
│  2. Messages → D1 (chat_messages) + SSE streaming for real-time              │
│  3. Model catalog → static config + runtime health check                     │
│  4. Context Panel → assembled from current chat topic + memory              │
│                                                                               │
│  OUTBOUND                                                                     │
│  ────────                                                                     │
│  1. User message → gateway → twin-orchestrator DO                            │
│     → DO assembles Entity360 + Memory + Knowledge + Tools                     │
│     → think service (LLM) → streaming response                              │
│  2. File upload → R2 (direct) → knowledge service (chunk + index)            │
│  3. Capability invoke (from chat) → Hermes → act → provider                │
│  4. Feedback → telemetry queue (implicit)                                    │
│                                                                               │
│  SERVICES                                                                     │
│  ────────                                                                     │
│  • gateway (auth, SSE routing)                                                │
│  • twin-orchestrator (per-user DO, session state)                           │
│  • think (LLM orchestration, streaming)                                      │
│  • intelligence (context assembly)                                           │
│  • knowledge (RAG for uploaded docs)                                         │
│  • continuity (memory query)                                                 │
│  • agent-registry (capability catalog for tool calls)                        │
│  • store (chat session persistence)                                          │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

### 3.5 User Interactions

#### Flow: User Asks About an Account and Gets a Proposal

| Step | Action                                                          | System Response                                | UI Change                                                               |
| ---- | --------------------------------------------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------- |
| 1    | User types "What should I do about Acme Corp?"                  | Message sent to twin-orchestrator DO           | User message appears in canvas. AI shows "Thinking..."                  |
| 2    | Twin assembles context: Entity360 for Acme + Memory + Knowledge | DO queries intelligence, continuity, knowledge | Tool call displays: `entity360.get` (success), `memory.query` (success) |
| 3    | LLM generates response with proposal                            | Streaming response via SSE                     | AI message appears with inline memory citations                         |
| 4    | Proposal generated (confidence 0.91)                            | Govern pre-check: auto-approve                 | Proposal card inline: "I suggest escalating to CSM." + "Approved" badge |
| 5    | User clicks "Tell me more"                                      | Twin explains reasoning trace                  | New AI message with expanded reasoning                                  |
| 6    | User drags a PDF into chat                                      | File uploaded to R2, indexed                   | File chip appears. Knowledge query includes document.                   |
| 7    | User asks "What does the contract say about renewals?"          | Knowledge RAG → LLM                            | AI cites knowledge chunks with page numbers                             |

---

### 3.6 States

#### Empty States

| State                 | Visual Treatment                                                                         |
| --------------------- | ---------------------------------------------------------------------------------------- |
| **No chat selected**  | Center: Twin avatar + "What can I help you with today?" + Quick starter cards (3×2 grid) |
| **No history**        | Sidebar: "No conversations yet. Start one!"                                              |
| **No context**        | Context panel: "Start a conversation to see context."                                    |
| **Model unavailable** | Selector: "Unavailable" badge + tooltip. Fallback to next model.                         |

#### Loading States

| Component        | Indicator                           |
| ---------------- | ----------------------------------- |
| AI response      | Streaming dots + "Thinking..."      |
| Tool call        | Inline spinner with capability name |
| File upload      | Progress bar + "Uploading..."       |
| Context assembly | Subtle shimmer on Context Panel     |
| Session load     | Skeleton message list               |

---

### 3.7 Accessibility

| Requirement       | Implementation                                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Keyboard**      | `Tab` navigates input + buttons. `Enter` sends. `Shift+Enter` newline. `↑` recalls last message (in input).              |
| **Screen reader** | Messages: `aria-live="polite"`. User messages: `aria-label="You said: ..."`. AI messages: `aria-label="Twin said: ..."`. |
| **Focus**         | Input always focusable. New messages scroll into view.                                                                   |
| **High contrast** | User messages: white on primary. AI messages: neutral-900 on neutral-50.                                                 |
| **Motion**        | `prefers-reduced-motion` disables streaming animation. Text appears instantly.                                           |

---

### 3.8 Responsive Behavior

| Breakpoint          | Layout                                                                         |
| ------------------- | ------------------------------------------------------------------------------ |
| **Desktop**         | Full 3-column: History (260px) + Canvas (fluid) + Context (320px)              |
| **Tablet**          | History collapsible (drawer). Canvas + Context visible.                        |
| **Mobile**          | Full-screen canvas. History via swipe from left. Context via swipe from right. |
| **Mobile portrait** | Input bar fixed at bottom. Messages scroll above.                              |

---

## 4. Capability Fabric

### 4.1 Overview

The Capability Fabric is the **"what can I do?" layer**. It is the user-facing discovery and execution surface for every named action the platform can perform. It answers the question: "I have connected Salesforce, Slack, and Stripe — what can I do with them?"

**User Journey Position:** Post-CONNECT (Step 1), pre-WORK (Step 3). Users visit to discover capabilities after connecting tools, or to explore what's possible.

**Core Principles:**

- Discovery-first: show capabilities, not just tools.
- Confidence and transparency: every capability shows what it does, what it needs, and how often it's used.
- Try it: execute capabilities directly from the Fabric without leaving.
- Living catalog: updates automatically as tools are connected/disconnected.

---

### 4.2 Layout / Wireframe Description

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  TOP BAR (64px)                                                             │
│  ┌────┐ ┌─────────────────┐ ┌────────────────────────────────────────────┐  │
│  │ IW │ │ Capability Fabric│ │ [🔍 Search]  [Filter ▼]  [View: Grid|List] │  │
│  └────┘ └─────────────────┘ └────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  CONNECTED TOOLS GALLERY (horizontal scroll, 120px tall)             │   │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐           │   │
│  │  │ [SF]   │ │ [Slack]│ │ [Stripe]│ │ [GitHub]│ │ [+ Add]│           │   │
│  │  │ ✓ Conn │ │ ✓ Conn │ │ ⚠ Sync │ │ ✓ Conn │ │        │           │   │
│  │  │ 12 caps│ │ 8 caps │ │ 6 caps │ │ 15 caps│ │        │           │   │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘           │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  CATEGORY FILTERS (horizontal chips, 48px)                           │   │
│  │  [All] [Sales] [Communication] [Finance] [Dev] [Platform] [AI] ...    │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  CAPABILITY GRID (main content)                                      │   │
│  │                                                                      │   │
│  │  ┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐ │   │
│  │  │ [📧]               │ │ [📊]               │ │ [🤖]               │ │   │
│  │  │ Send Email         │ │ Generate Report    │ │ Analyze Sentiment  │ │   │
│  │  │ salesforce.contact │ │ platform.report    │ │ twin.analyze       │ │   │
│  │  │                    │ │                    │ │                    │ │   │
│  │  │ "Send a templated  │ │ "Generate a        │ │ "Analyze the      │ │   │
│  │  │  email to a        │ │  pipeline report   │ │  sentiment of     │ │   │
│  │  │  contact."         │ │  for any entity."  │ │  this account."   │ │   │
│  │  │                    │ │                    │ │                    │ │   │
│  │  │ ┌────────────────┐ │ │ ┌────────────────┐ │ │ ┌────────────────┐ │ │   │
│  │  │ │ Used: 42×      │ │ │ │ Used: 128×     │ │ │ │ Used: 15×      │ │ │   │
│  │  │ │ Conf: 0.92     │ │ │ │ Conf: 0.88     │ │ │ │ Conf: 0.85     │ │ │   │
│  │  │ └────────────────┘ │ │ └────────────────┘ │ │ └────────────────┘ │ │   │
│  │  │ [Try It] [Details] │ │ [Try It] [Details] │ │ [Try It] [Details] │ │   │
│  │  └────────────────────┘ └────────────────────┘ └────────────────────┘ │   │
│  │                                                                      │   │
│  │  ┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐ │   │
│  │  │ [⚠️]               │ │                    │ │                    │ │   │
│  │  │ Requires Approval  │ │ ... more cards     │ │                    │ │   │
│  │  │ (governed)         │ │                    │ │                    │ │   │
│  │  └────────────────────┘ └────────────────────┘ └────────────────────┘ │   │
│  │                                                                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  [CAPABILITY DETAIL SIDEBAR (drawer, 480px, from right)]                   │
│  ┌────────────────────────────────────────────────────────────────┐        │
│  │  [📧] Send Email                                                │        │
│  │  salesforce.contact.send_email                                 │        │
│  │                                                                │        │
│  │  Description: Send a templated email to a Salesforce contact.   │        │
│  │                                                                │        │
│  │  ┌────────────────────────────────────────────────────────┐      │        │
│  │  │ PARAMETERS                                             │      │        │
│  │  │ • contact_id (string, required)                        │      │        │
│  │  │ • template_id (string, optional)                       │      │        │
│  │  │ • subject (string, optional)                           │      │        │
│  │  │ • body (string, optional)                              │      │        │
│  │  └────────────────────────────────────────────────────────┘      │        │
│  │                                                                │        │
│  │  ┌────────────────────────────────────────────────────────┐      │        │
│  │  │ REQUIRED PERMISSIONS                                   │      │        │
│  │  │ • salesforce:write                                     │      │        │
│  │  │ • capability:invoke                                  │      │        │
│  │  └────────────────────────────────────────────────────────┘      │        │
│  │                                                                │        │
│  │  ┌────────────────────────────────────────────────────────┐      │        │
│  │  │ AUDIT TRAIL                                            │      │        │
│  │  │ • Last used: 2 hours ago by alice@acme.com               │      │        │
│  │  │ • Success rate: 94% (47/50)                              │      │        │
│  │  │ • Average latency: 1.2s                                  │      │        │
│  │  └────────────────────────────────────────────────────────┘      │        │
│  │                                                                │        │
│  │  [Try It]  [Add to Workflow]  [Copy API Call]                  │        │
│  │                                                                │        │
│  └────────────────────────────────────────────────────────────────┘        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 4.3 Key UI Components

#### 4.3.1 Connected Tools Gallery

```typescript
interface ConnectedToolsGalleryProps {
  connectors: Connector[];
  onAdd: () => void;
  onClick: (connectorId: string) => void;
}

interface Connector {
  id: string;
  provider: string;
  displayName: string;
  icon: string;
  status: "connected" | "disconnected" | "error" | "syncing";
  capabilityCount: number;
  lastSyncAt?: Date;
}
```

**Visual Spec:**

- Horizontal scrollable row, `h-[120px]`, `gap-4`, `px-4`
- Each card: `w-[140px] h-[100px] bg-white rounded-xl border border-neutral-200 p-3 flex flex-col justify-between`
- Top: provider icon (`24px`) + status dot (`8px` circle, absolute top-right)
  - Connected: `bg-success`
  - Syncing: `bg-warning animate-pulse`
  - Error: `bg-danger`
  - Disconnected: `bg-neutral-300`
- Middle: provider name (`text-sm font-medium`)
- Bottom: capability count (`text-xs text-neutral-500`) + "caps"
- "+ Add" card: `dashed border border-neutral-300 bg-neutral-50`, `+` icon, "Connect tool"
- Hover: `shadow-md`, `border-primary-200`, `transition-all duration-200`

#### 4.3.2 Category Filter Chips

```typescript
interface CategoryFilterProps {
  categories: string[];
  active: string;
  onSelect: (category: string) => void;
}
```

**Visual Spec:**

- Horizontal scrollable row, `h-[48px]`, `gap-2`, `px-4 py-2`
- Each chip: `rounded-full px-3 py-1 text-sm`
- Active: `bg-primary-100 text-primary-700 border border-primary-200`
- Inactive: `bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50`
- "All" is always first, selected by default

#### 4.3.3 Capability Cards

```typescript
interface CapabilityCardProps {
  capability: {
    id: string; // capability URI
    displayName: string;
    description: string;
    namespace: string;
    icon: string;
    usageCount: number;
    confidence: number;
    requiresApproval: boolean;
    oodaPhase: string;
  };
  onTry: () => void;
  onDetails: () => void;
}
```

**Visual Spec:**

- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4`
- Card: `bg-white rounded-xl border border-neutral-200 p-5 hover:shadow-md hover:border-primary-200 transition-all duration-200`
- Top row: icon (`32px`, `rounded-lg bg-primary-100 text-primary-600`) + capability name (`text-sm font-semibold`)
- URI: `text-xs font-mono text-neutral-400 mt-1`
- Description: `text-sm text-neutral-600 mt-2 line-clamp-2`
- Stats row: `flex gap-3 mt-4 text-xs text-neutral-500`
  - `Used: N×` + `Conf: 0.XX`
- Badge (if requires approval): `bg-warning-50 text-warning-700 border border-warning-200 rounded px-2 py-0.5 text-[10px] font-bold uppercase` "Requires Approval"
- Actions: `flex gap-2 mt-4`
  - `Try It`: `bg-primary-600 text-white rounded-md px-3 py-1.5 text-sm`
  - `Details`: `bg-white border border-neutral-200 text-neutral-700 rounded-md px-3 py-1.5 text-sm`

#### 4.3.4 Capability Detail Drawer

```typescript
interface CapabilityDetailProps {
  capability: CapabilityInfo;
  onTry: () => void;
  onAddToWorkflow: () => void;
  onCopyApi: () => void;
  onClose: () => void;
}
```

**Visual Spec:**

- Drawer: `w-[480px]`, slides from right, `shadow-2xl`
- Header: icon + name + URI (`font-mono text-xs`) + close `×`
- Sections with `border-b border-neutral-200 pb-4 mb-4`:
  - Description: `text-sm text-neutral-700`
  - Parameters: table (`w-full text-sm`), columns: name, type, required, description
  - Required Permissions: tag list (`flex gap-2 flex-wrap`), each: `bg-neutral-100 rounded-full px-2 py-1 text-xs`
  - Audit Trail: mini stats cards (`grid-cols-3`), `bg-neutral-50 rounded-lg p-3`
- Footer: `flex gap-3 sticky bottom-0 bg-white p-4 border-t`
  - `Try It` (primary), `Add to Workflow` (secondary), `Copy API Call` (secondary)

---

### 4.4 Data Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  DATA FLOW: Capability Fabric                                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  INBOUND                                                                      │
│  ───────                                                                      │
│  1. Discovery → GET /api/v1/discovery                                          │
│     → connectors, capabilities, limits, features                               │
│  2. Capability details → agent-registry (KV cache, D1 fallback)               │
│     → schema, permissions, audit stats                                        │
│  3. Usage stats → telemetry aggregation (D1)                                  │
│                                                                               │
│  OUTBOUND (Try It)                                                            │
│  ─────────────────                                                              │
│  1. User clicks "Try It" → form modal → gateway → Hermes → capability invoke  │
│  2. Result shown inline in drawer or toast                                    │
│  3. Add to Workflow → workflow editor opens with this capability pre-loaded   │
│  4. Copy API Call → clipboard: curl + SDK code snippet                      │
│                                                                               │
│  SERVICES                                                                     │
│  ────────                                                                     │
│  • gateway (discovery endpoint)                                                 │
│  • agent-registry (capability metadata)                                         │
│  • connector (connector status)                                                 │
│  • telemetry (usage stats)                                                      │
│  • hermes (capability execution)                                              │
│  • workflow (workflow creation)                                                 │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

### 4.5 User Interactions

#### Flow: User Discovers and Tries a Capability

| Step | Action                                | System Response                         | UI Change                                                 |
| ---- | ------------------------------------- | --------------------------------------- | --------------------------------------------------------- |
| 1    | User opens Capability Fabric from nav | Discovery returns all capabilities      | Gallery shows connected tools + grid of capability cards  |
| 2    | User clicks "Salesforce" filter       | Capabilities filtered by namespace      | Grid updates, only Salesforce capabilities shown          |
| 3    | User clicks "Details" on "Send Email" | Capability schema + audit stats fetched | Detail drawer slides in with params, permissions, history |
| 4    | User clicks "Try It"                  | Modal form opens with parameters        | Form with `contact_id` (entity picker), `subject`, `body` |
| 5    | User fills form, clicks "Execute"     | Gateway → Hermes → act → Salesforce     | Inline result: "Email sent successfully" + message ID     |
| 6    | User clicks "Copy API Call"           | Clipboard: curl command                 | Toast: "Copied to clipboard"                              |

---

### 4.6 States

#### Empty States

| State                         | Visual Treatment                                                                          |
| ----------------------------- | ----------------------------------------------------------------------------------------- |
| **No connected tools**        | Center: "Connect your first tool to discover capabilities" + CTA to Connector Marketplace |
| **No capabilities in filter** | "No capabilities match this filter. Try another."                                         |
| **Search no results**         | "No capabilities found for 'X'. Search entities or knowledge instead?"                    |
| **Connector error**           | Card: red border + "Connection error. Retry?"                                             |

#### Loading States

| Component        | Indicator                             |
| ---------------- | ------------------------------------- |
| Gallery          | Skeleton cards                        |
| Grid             | Skeleton cards with shimmer           |
| Detail drawer    | Spinner in header + skeleton sections |
| Try It execution | Inline spinner + "Executing..."       |

---

### 4.7 Accessibility

| Requirement       | Implementation                                                                                     |
| ----------------- | -------------------------------------------------------------------------------------------------- |
| **Keyboard**      | `Tab` navigates cards. `Enter` opens details. `Esc` closes drawer. Arrow keys scroll gallery.      |
| **Screen reader** | Cards: `role="button"`, `aria-label="Capability: [name]. [description]. Press Enter for details."` |
| **Focus**         | Focus visible on all cards. Drawer traps focus. Return focus on close.                             |
| **Search**        | `aria-live="polite"` on grid for filter results.                                                   |

---

### 4.8 Responsive Behavior

| Breakpoint  | Layout                                                                  |
| ----------- | ----------------------------------------------------------------------- |
| **Desktop** | Full gallery + `4-col` grid. Detail drawer `480px`.                     |
| **Tablet**  | Gallery scrolls. `2-col` grid. Detail drawer `50vw`.                    |
| **Mobile**  | Gallery collapses to dropdown. `1-col` grid. Detail drawer full-screen. |

---

## 5. Ingress (UI Entry Points)

### 5.1 Overview

Ingress is the **front door** of the platform. It covers every way a user or system enters IntegrateWise: sign-in, connector setup, MCP connections, API keys, webhooks, and team invites. Clean, minimal, and one-click where possible.

**User Journey Position:** Step 1 (CONNECT) — "One click and Salesforce is here."

**Core Principles:**

- One-click auth: minimize friction.
- Progressive disclosure: don't overwhelm on first visit.
- Trust signals: security badges, clear data handling, transparent scopes.
- Self-service: users can connect tools without admin help.

---

### 5.2 Layout / Wireframe Description

#### 5.2.1 Sign-in / Sign-up Page

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                                                                     │    │
│  │                    [IntegrateWise Logo]                              │    │
│  │                                                                     │    │
│  │              "One click to make tools and AI                       │    │
│  │               work for humans."                                    │    │
│  │                                                                     │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │  Sign in with Google                                        │   │    │
│  │  │  [Google icon]  Continue with Google                        │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  │                                                                     │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │  Sign in with GitHub                                        │   │    │
│  │  │  [GitHub icon]  Continue with GitHub                        │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  │                                                                     │    │
│  │  ────────────  or  ────────────                                     │    │
│  │                                                                     │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │  Email address                                              │   │    │
│  │  │  [email@example.com]                                        │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  │                                                                     │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │  Password                                                   │   │    │
│  │  │  [••••••••]  [👁️]                                         │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  │                                                                     │    │
│  │  [Sign In]  (full-width, primary)                                  │    │
│  │                                                                     │    │
│  │  [Forgot password?]  |  [Create account]                            │    │
│  │                                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  🔒 SOC 2 Type II  •  GDPR Compliant  •  TLS 1.3                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 5.2.2 Connector Marketplace

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  TOP BAR: IntegrateWise  |  [🔍 Search tools]  |  [👤 User]                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  "Connect Your Tools"                                                        │
│  "Search 200+ integrations and connect in one click."                      │
│                                                                             │
│  [Filter: All] [CRM] [Communication] [Finance] [Dev] [Storage] [AI]         │
│                                                                             │
│  ┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐      │
│  │ [Salesforce logo]  │ │ [HubSpot logo]     │ │ [Slack logo]       │      │
│  │ Salesforce         │ │ HubSpot            │ │ Slack              │      │
│  │ CRM                │ │ CRM                │ │ Communication      │      │
│  │                    │ │                    │ │                    │      │
│  │ [Connect]          │ │ [Connect]          │ │ [Connect]          │      │
│  │ Popular            │ │ Popular            │ │ Connected ✓        │      │
│  └────────────────────┘ └────────────────────┘ └────────────────────┘      │
│                                                                             │
│  ┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐      │
│  │ [Stripe logo]      │ │ [GitHub logo]      │ │ [Linear logo]      │      │
│  │ Stripe             │ │ GitHub             │ │ Linear             │      │
│  │ Finance            │ │ Dev                │ │ Dev                │      │
│  │                    │ │                    │ │                    │      │
│  │ [Connect]          │ │ [Connect]          │ │ [Connect]          │      │
│  │                    │ │                    │ │                    │      │
│  └────────────────────┘ └────────────────────┘ └────────────────────┘      │
│                                                                             │
│  [Show more tools →]                                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 5.2.3 MCP Connection Screen

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  "Connect Your AI Assistant"                                                 │
│                                                                             │
│  IntegrateWise acts as an MCP server. Your AI assistant (Claude, ChatGPT)   │
│  can discover and invoke all your connected tools through the Bridge.       │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  MCP Endpoint                                                        │    │
│  │  https://mcp.integratewise.ai/v1/mcp                                 │    │
│  │  [Copy]                                                            │    │
│  │                                                                    │    │
│  │  Authentication: Bearer <your JWT>                                   │    │
│  │  [Copy token]  [Regenerate]                                        │    │
│  │                                                                    │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │  Setup Instructions                                          │   │    │
│  │  │  1. Open Claude Desktop / ChatGPT                            │   │    │
│  │  │  2. Add MCP server: paste endpoint                           │   │    │
│  │  │  3. Authenticate with your JWT                               │   │    │
│  │  │  4. The AI will discover your capabilities automatically     │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  [Test Connection]  [View Logs]                                            │
│                                                                             │
│  Connection Status: 🟢 Connected  |  Last ping: 2s ago  |  Tools: 42     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 5.2.4 API Key Management

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  "API Keys"  |  [+ Create New Key]                                          │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Name              │  Key Preview    │  Scopes    │  Created  │ Actions│    │
│  ├─────────────────────────────────────────────────────────────────────┤    │
│  │  Production SDK    │  iwak_••••••x3y  │ read,write│  Jan 15   │ [•••]  │    │
│  │  CI/CD Pipeline    │  iwak_••••••a9b  │ read      │  Mar 2    │ [•••]  │    │
│  │  Zapier Integration│  iwak_••••••k7m  │ webhook   │  Apr 10   │ [•••]  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  [Create Key Modal]                                                         │
│  Name: [Production Webhook]                                                  │
│  Scopes: [☑ read] [☑ write] [☑ webhook] [☐ admin]                          │
│  Expiry: [90 days ▼]                                                         │
│  [Create]  [Cancel]                                                          │
│                                                                             │
│  ⚠️  Keys are shown only once. Copy and store securely.                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 5.2.5 Webhook Dashboard

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  "Webhook Dashboard"  |  [+ Create Webhook]  |  [View Docs]                │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Endpoint: https://api.integratewise.ai/api/v1/webhooks/...       │    │
│  │  [Copy]  [Regenerate Secret]  [Test]                               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  Recent Deliveries (last 24h)                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Time    │  Source    │  Event        │  Status    │  Payload      │    │
│  ├─────────────────────────────────────────────────────────────────────┤    │
│  │  14:32   │  Salesforce│  opp.updated  │  ✅ 200    │  [View]       │    │
│  │  14:15   │  Stripe    │  invoice.paid │  ✅ 200    │  [View]       │    │
│  │  13:58   │  Slack     │  message      │  ⚠️ 429    │  [View] [Retry]│   │
│  │  12:20   │  HubSpot   │  contact.created│ ❌ 500   │  [View] [Retry]│   │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  [View all history →]                                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 5.2.6 Invite Team Members

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  "Invite Team Members"                                                       │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Email addresses (one per line, or comma-separated)                  │    │
│  │  [alice@acme.com                                     ]               │    │
│  │  [bob@acme.com                                       ]               │    │
│  │  [carol@acme.com                                     ]               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  Role: [Member ▼]  (Member | Admin | Viewer | TAM)                          │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Message (optional)                                                  │    │
│  │  [Join our IntegrateWise workspace to access unified tools...]      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  [☑] Send welcome email with getting started guide                          │
│                                                                             │
│  [Send Invites]  (3 invites)                                                │
│                                                                             │
│  Pending Invites                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Email            │  Role    │  Sent    │  Status    │  Action      │    │
│  ├─────────────────────────────────────────────────────────────────────┤    │
│  │  dave@acme.com    │  Admin   │  2h ago  │  Pending   │  [Resend]   │    │
│  │  eve@acme.com     │  Viewer  │  1d ago  │  Expired   │  [Resend]   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 5.3 Key UI Components

#### 5.3.1 OAuth Sign-in Button

```typescript
interface OAuthButtonProps {
  provider: "google" | "github" | "microsoft" | "okta";
  onClick: () => void;
  isLoading: boolean;
}
```

**Visual Spec:**

- Full-width: `w-full h-12 rounded-lg border flex items-center justify-center gap-3`
- Google: `bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50`
- GitHub: `bg-neutral-900 text-white hover:bg-neutral-800`
- Loading: spinner replaces icon, `disabled` state
- Focus: `ring-2 ring-primary-500 ring-offset-2`

#### 5.3.2 Connector Card (Marketplace)

```typescript
interface ConnectorCardProps {
  provider: string;
  displayName: string;
  category: string;
  icon: string;
  description: string;
  isPopular: boolean;
  isConnected: boolean;
  onConnect: () => void;
}
```

**Visual Spec:**

- `bg-white rounded-xl border border-neutral-200 p-5 hover:shadow-md transition-all`
- Top: icon (`48px`) + `isPopular` ? ` Popular` badge (`bg-primary-100 text-primary-700 text-xs rounded-full px-2`) : null
- Name: `text-base font-semibold mt-3`
- Category: `text-xs text-neutral-500 uppercase tracking-wide`
- Description: `text-sm text-neutral-600 mt-2 line-clamp-2`
- Action:
  - Connected: `bg-success-50 text-success-700 border border-success-200 rounded-lg px-4 py-2 text-sm flex items-center gap-2` + check icon + "Connected"
  - Not connected: `bg-primary-600 text-white rounded-lg px-4 py-2 text-sm hover:bg-primary-700` + "Connect"
- Clicking connected: opens connector settings modal (sync status, mappings, disconnect)

#### 5.3.3 MCP Endpoint Card

```typescript
interface McEndpointCardProps {
  endpoint: string;
  token: string;
  connectionStatus: "connected" | "disconnected" | "testing";
  toolCount: number;
  lastPingAt?: Date;
  onCopy: () => void;
  onRegenerate: () => void;
  onTest: () => void;
}
```

**Visual Spec:**

- `bg-neutral-50 rounded-xl border border-neutral-200 p-6`
- Endpoint: `font-mono text-sm bg-white rounded-lg border border-neutral-200 px-3 py-2 flex justify-between items-center`
  - Copy button: `text-neutral-400 hover:text-neutral-600`
- Token: same style, but masked (`iwak_••••••x3y`) with "Show" toggle
- Status row: `flex items-center gap-2 mt-4`
  - Dot: `8px circle` + `text-sm`
  - Connected: green dot + "Connected"
  - Tools count: `text-xs text-neutral-500`
  - Last ping: `text-xs text-neutral-400`
- Actions: `flex gap-3 mt-4`
  - `Test Connection` (secondary), `Regenerate Token` (danger, confirm modal)

#### 5.3.4 API Key Table Row

```typescript
interface ApiKeyRowProps {
  key: {
    id: string;
    name: string;
    preview: string; // last 4 chars
    scopes: string[];
    createdAt: Date;
    lastUsedAt?: Date;
  };
  onRevoke: () => void;
  onEdit: () => void;
}
```

**Visual Spec:**

- Table row: `border-b border-neutral-100 hover:bg-neutral-50`
- Columns: Name (`text-sm font-medium`), Preview (`font-mono text-xs`), Scopes (`flex gap-1`), Created (`text-xs text-neutral-500`), Actions (`...` dropdown)
- Scopes: each is `bg-neutral-100 rounded-full px-2 py-0.5 text-[10px]`
- Actions dropdown: `Edit`, `Revoke` (with confirm)
- Revoke: `bg-danger-50 text-danger` on hover, confirm modal with "This will break integrations."

#### 5.3.5 Webhook Delivery Row

```typescript
interface WebhookDeliveryRowProps {
  delivery: {
    id: string;
    receivedAt: Date;
    provider: string;
    eventType: string;
    status: "success" | "retry" | "failed";
    statusCode: number;
    payload: unknown;
  };
  onViewPayload: () => void;
  onRetry: () => void;
}
```

**Visual Spec:**

- Table row: `border-b border-neutral-100`
- Status: icon + `text-xs`
  - Success: `✅ text-success`
  - Retry: `⚠️ text-warning`
  - Failed: `❌ text-danger`
- Time: `text-xs text-neutral-500`
- Provider: `text-sm`
- Event: `font-mono text-xs text-neutral-600`
- Status code: `text-xs` + colored badge (2xx green, 4xx warning, 5xx danger)
- Actions: `View` (opens payload drawer) + `Retry` (if failed)

---

### 5.4 Data Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  DATA FLOW: Ingress (UI Entry Points)                                       │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  SIGN-IN / SIGN-UP                                                            │
│  ──────────────────                                                             │
│  1. OAuth: User clicks provider → OAuth 2.0 flow → Gateway → tenants service  │
│     → JWT minted → session created → redirect to workbench                   │
│  2. Email/Password: POST /auth/login → Gateway → tenants → JWT               │
│                                                                               │
│  CONNECTOR MARKETPLACE                                                        │
│  ───────────────────────                                                        │
│  1. Discovery → GET /api/v1/discovery → connectors list + available providers │
│  2. Connect → POST /api/v1/connect → OAuth flow → credential wall → sync      │
│                                                                               │
│  MCP CONNECTION                                                               │
│  ────────────────                                                             │
│  1. GET /mcp/sessions → Gateway creates SSE session                          │
│  2. Token: JWT from current session (no separate API key needed)             │
│  3. Test: POST /mcp/tools → verify catalog assembly                            │
│                                                                               │
│  API KEY MANAGEMENT                                                           │
│  ────────────────────                                                         │
│  1. CRUD: admin service → D1 api_keys table → KV cache invalidate             │
│  2. Usage: gateway checks KV whitelist on every API key request             │
│                                                                               │
│  WEBHOOK DASHBOARD                                                            │
│  ─────────────────                                                            │
│  1. Read: webhook-ingress → D1 webhook_deliveries table                      │
│  2. Retry: POST /webhooks/retry → re-enqueue to webhook-ingress             │
│                                                                               │
│  INVITE TEAM                                                                  │
│  ────────────                                                                 │
│  1. POST /iam/invite → iam service → email send → D1 invitation record       │
│  2. Accept: link → gateway → tenants → user created → role assigned          │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

### 5.5 User Interactions

#### Flow: New User Signs Up and Connects Salesforce

| Step | Action                                         | System Response                                            | UI Change                                            |
| ---- | ---------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------- |
| 1    | User visits app, clicks "Continue with Google" | OAuth 2.0 flow initiated                                   | Redirect to Google auth                              |
| 2    | User grants consent                            | Redirect to IntegrateWise with code                        | Gateway exchanges code, JWT minted, workbench loads  |
| 3    | Onboarding: "Connect your first tool" CTA      | Discovery shows no connectors                              | Marketplace opens with popular tools                 |
| 4    | User clicks "Connect" on Salesforce card       | OAuth flow to Salesforce                                   | Salesforce auth window opens                         |
| 5    | User grants Salesforce scopes                  | Redirect back, credential wall stores token, sync enqueued | Card updates: "Connected ✓" + "Syncing..." badge     |
| 6    | Sync completes (SSE notification)              | Data flows through normalizer to Spine                     | Toast: "Salesforce connected. 1,247 records synced." |
| 7    | User clicks "Go to Workbench"                  | Workbench loads with Sales projection                      | Entity explorer shows accounts, contacts, deals      |

---

### 5.6 States

#### Empty States

| State                  | Visual Treatment                                                      |
| ---------------------- | --------------------------------------------------------------------- |
| **No connectors**      | Marketplace: "Connect your first tool to get started" + popular tools |
| **No API keys**        | "No API keys yet. Create one for external integrations."              |
| **No webhooks**        | "No webhook deliveries yet. Connect a tool to receive events."        |
| **No pending invites** | "No pending invitations. Invite your team to collaborate."            |

#### Error States

| Error                       | Visual Treatment                                                 | Recovery                           |
| --------------------------- | ---------------------------------------------------------------- | ---------------------------------- |
| **OAuth failed**            | "Connection failed. [Provider] returned an error." + "Try again" | Retry OAuth flow                   |
| **Invalid scopes**          | "This tool requires additional permissions." + scope list        | Re-auth with correct scopes        |
| **Webhook secret mismatch** | "Signature verification failed." + regenerate CTA                | Regenerate secret, update provider |
| **Invite expired**          | "This invitation has expired." + resend option                   | Resend invite                      |
| **API key revoked**         | "Authentication failed. Key may be revoked."                     | Prompt to create new key           |

---

### 5.7 Accessibility

| Requirement     | Implementation                                                                             |
| --------------- | ------------------------------------------------------------------------------------------ |
| **Sign-in**     | All inputs have `label`. Error messages: `aria-live="polite"`. Focus on first error field. |
| **Marketplace** | Cards: `role="button"` or `role="link"`. Filter: `aria-label="Filter by category"`.        |
| **MCP screen**  | Endpoint/token: `aria-label` on copy buttons. Status announced via `aria-live`.            |
| **Tables**      | `scope="col"` on headers. Row actions: `aria-label` per row.                               |
| **Keyboard**    | `Tab` navigates all fields. `Enter` submits forms. `Esc` closes modals.                    |

---

### 5.8 Responsive Behavior

| Breakpoint  | Behavior                                                                               |
| ----------- | -------------------------------------------------------------------------------------- |
| **Desktop** | Centered auth card (`max-w-[400px]`). Marketplace: `3-col` grid. Tables: full width.   |
| **Tablet**  | Auth card: `max-w-[360px]`. Marketplace: `2-col`. Tables: scrollable.                  |
| **Mobile**  | Auth card: full width with padding. Marketplace: `1-col`. Tables: card view (stacked). |

---

## 6. Audit Logs (Transparency Layer)

### 6.1 Overview

The Audit Logs interface is the **"what did the AI do?" transparency layer**. It gives users and admins full visibility into every action the system took, every proposal it made, every piece of data it accessed, and every governance decision that was applied.

**User Journey Position:** Cross-cutting. Accessible from any screen. Critical for compliance (SOC 2, GDPR) and trust.

**Core Principles:**

- Immutable: every log is append-only. No edits, no deletes.
- Filterable: users can find what they're looking for in seconds.
- Exportable: compliance requires exports (CSV, JSON, Parquet).
- Permission-bound: users see only what they're allowed to see.

---

### 6.2 Layout / Wireframe Description

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  TOP BAR (64px)                                                             │
│  ┌────┐ ┌─────────────────┐ ┌────────────────────────────────────────────┐  │
│  │ IW │ │ Audit Logs      │ │ [Export]  [Filter ▼]  [Date Range]  [👤] │  │
│  └────┘ └─────────────────┘ └────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  FILTER BAR (56px)                                                     │   │
│  │  [Actor: All ▼] [Action: All ▼] [Via: All ▼] [Entity: Search...]   │   │
│  │  [Confidence: All ▼] [Status: All ▼]                                  │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  VIEW TOGGLE: [Timeline] [Table] [Governance] [Data Access]         │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  TIMELINE VIEW (default)                                               │   │
│  │                                                                        │   │
│  │  Jun 3, 2026                                                             │   │
│  │  ─────────────────────────────────────────────────────────────────────   │   │
│  │  ┌──────────┐                                                          │   │
│  │  │ 14:32:15 │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │          │  │ 🤖 twin    │  PROPOSED                             │  │   │
│  │  │    ●     │  │            │  "Update renewal date for Acme Corp"  │  │   │
│  │  │          │  │ Confidence: 0.78                                   │  │   │
│  │  │          │  │ [View Details]  [Go to My Desk]                     │  │   │
│  │  └──────────┘  └────────────────────────────────────────────────────┘  │   │
│  │                                                                        │   │
│  │  ┌──────────┐                                                          │   │
│  │  │ 14:28:03 │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │          │  │ 👤 alice@acme │  APPROVED                         │  │   │
│  │  │    ●     │  │            │  Proposal #prop_001 approved        │  │   │
│  │  │          │  │            │  [View Details]                     │  │   │
│  │  └──────────┘  └────────────────────────────────────────────────────┘  │   │
│  │                                                                        │   │
│  │  ┌──────────┐                                                          │   │
│  │  │ 14:27:55 │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │          │  │ 🔧 system  │  SYNC                               │  │   │
│  │  │    ●     │  │            │  Salesforce incremental sync: 47    │  │   │
│  │  │          │  │            │  records processed                  │  │   │
│  │  │          │  │            │  [View Records]                     │  │   │
│  │  └──────────┘  └────────────────────────────────────────────────────┘  │   │
│  │                                                                        │   │
│  │  Jun 2, 2026                                                             │   │
│  │  ─────────────────────────────────────────────────────────────────────   │   │
│  │  ┌──────────┐                                                          │   │
│  │  │ 09:15:22 │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │          │  │ 👤 bob@acme  │  EXECUTED                          │  │   │
│  │  │    ●     │  │            │  salesforce.opportunity.update         │  │   │
│  │  │          │  │            │  Entity: Acme Corp (ssoc_001)        │  │   │
│  │  │          │  │            │  [View Details]  [View Entity]       │  │   │
│  │  └──────────┘  └────────────────────────────────────────────────────┘  │   │
│  │                                                                        │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  [DETAIL DRAWER (from right, 520px)]                                        │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │  AUDIT EVENT DETAIL                                                │    │
│  │                                                                    │    │
│  │  Event ID:     aud_01H...                                          │    │
│  │  Timestamp:    2026-06-03 14:32:15 UTC                             │    │
│  │  Actor:        twin (agent: twin-orchestrator)                     │    │
│  │  Action:       PROPOSED                                             │    │
│  │  Via:          twin (SSE)                                           │    │
│  │                                                                    │    │
│  │  ┌────────────────────────────────────────────────────────────┐   │    │
│  │  │  CAPABILITY INVOKED                                          │   │    │
│  │  │  twin.propose                                                │   │    │
│  │  │  Input: { entityId: "ssoc_001", ... }                      │   │    │
│  │  └────────────────────────────────────────────────────────────┘   │    │
│  │                                                                    │    │
│  │  ┌────────────────────────────────────────────────────────────┐   │    │
│  │  │  GOVERNANCE DECISION                                         │   │    │
│  │  │  Confidence: 0.78                                            │   │    │
│  │  │  Decision: QUEUED (0.70–0.85 requires approval)              │   │    │
│  │  │  Rule: default_0.70_0.85                                   │   │    │
│  │  └────────────────────────────────────────────────────────────┘   │    │
│  │                                                                    │    │
│  │  ┌────────────────────────────────────────────────────────────┐   │    │
│  │  │  FULL PAYLOAD (SHA-256 verified)                             │   │    │
│  │  │  { ... }                                                     │   │    │
│  │  └────────────────────────────────────────────────────────────┘   │    │
│  │                                                                    │    │
│  │  [Export This Event]  [View in My Desk]                            │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 6.3 Key UI Components

#### 6.3.1 Filter Bar

```typescript
interface AuditFilterBarProps {
  filters: {
    actor?: string[];
    action?: string[];
    via?: string[];
    entityId?: string;
    confidenceRange?: [number, number];
    status?: string[];
    dateRange?: { start: Date; end: Date };
  };
  onFilterChange: (filters: AuditFilterBarProps["filters"]) => void;
  availableFilters: { actors: string[]; actions: string[]; vias: string[]; statuses: string[] };
}
```

**Visual Spec:**

- Horizontal row, `h-[56px]`, `flex items-center gap-3 px-4`
- Each filter: `rounded-lg bg-white border border-neutral-200 px-3 py-1.5 text-sm flex items-center gap-2`
- Dropdowns: multi-select checkboxes
- Entity search: `input` with `entity` icon, autocomplete from Spine
- Date range: `DateRangePicker` (two inputs or calendar widget)
- Clear all: `text-sm text-primary-600 hover:underline` when filters active

#### 6.3.2 Timeline View

```typescript
interface TimelineViewProps {
  events: AuditEvent[];
  onSelect: (eventId: string) => void;
  onLoadMore: () => void;
  hasMore: boolean;
}

interface AuditEvent {
  id: string;
  timestamp: Date;
  actor: string; // 'user:<id>', 'twin', 'system', 'agent:<id>'
  action: string;
  via: string;
  entityId?: string;
  entityName?: string;
  confidence?: number;
  governanceDecision?: string;
  summary: string;
  payloadHash: string;
}
```

**Visual Spec:**

- Vertical timeline with `border-l-2 border-neutral-200` left gutter
- Date headers: `text-xs font-semibold text-neutral-500 uppercase tracking-wide my-4`
- Each event:
  - Time: `text-xs text-neutral-400 font-mono w-[72px] text-right pr-4`
  - Dot: `absolute -left-[5px] w-[10px] h-[10px] rounded-full` — color by action type
    - `proposed`: `bg-primary-500`
    - `approved/rejected`: `bg-success` or `bg-danger`
    - `executed`: `bg-neutral-700`
    - `sync`: `bg-info-500`
    - `error`: `bg-danger-500`
  - Card: `bg-white rounded-lg border border-neutral-200 p-4 hover:shadow-sm transition-shadow`
  - Header: `flex items-center gap-2`
    - Actor badge: `rounded-full px-2 py-0.5 text-[10px] font-bold uppercase`
      - `user`: `bg-neutral-100 text-neutral-700`
      - `twin`: `bg-primary-100 text-primary-700`
      - `system`: `bg-neutral-100 text-neutral-500`
    - Action: `text-sm font-medium`
    - Via: `text-xs text-neutral-400` in parentheses
  - Body: `text-sm text-neutral-600 mt-1` summary
  - Footer: `flex gap-3 mt-2 text-xs text-primary-600`
    - `View Details` + `Go to Entity` (if entityId) + `View in My Desk` (if proposal)
- Infinite scroll: `IntersectionObserver` at bottom, spinner while loading

#### 6.3.3 Governance Decision Badge

```typescript
interface GovernanceBadgeProps {
  decision:
    | "auto_approved"
    | "queued"
    | "discarded"
    | "rule_blocked"
    | "approved"
    | "rejected"
    | "modified"
    | "expired";
  confidence?: number;
}
```

**Visual Spec:**

- Inline badge within event card
- `rounded-full px-2 py-0.5 text-[10px] font-bold uppercase`
- Colors:
  - `auto_approved`: `bg-success text-white`
  - `queued`: `bg-warning text-white`
  - `discarded`: `bg-neutral-200 text-neutral-600`
  - `rule_blocked`: `bg-danger text-white`
  - `approved`: `bg-success text-white`
  - `rejected`: `bg-danger text-white`
  - `modified`: `bg-info text-white`
  - `expired`: `bg-neutral-200 text-neutral-500`

#### 6.3.4 Audit Detail Drawer

```typescript
interface AuditDetailDrawerProps {
  event: AuditEvent;
  onClose: () => void;
  onExport: () => void;
  onNavigateToEntity: () => void;
  onNavigateToProposal: () => void;
}
```

**Visual Spec:**

- Drawer: `w-[520px]`, slides from right
- Sections with `border-b border-neutral-200 pb-4 mb-4`:
  - Metadata: key-value grid, `grid-cols-[120px_1fr]`, `text-sm`
  - Capability Invoked: `bg-neutral-50 rounded-lg p-3`, capability URI + input JSON
  - Governance Decision: confidence badge + decision + rule name
  - Full Payload: `JSON` formatted, `font-mono text-xs bg-neutral-900 text-neutral-100 rounded-lg p-3 overflow-auto max-h-[300px]`
  - SHA-256: `font-mono text-xs text-neutral-400` with "Verified" checkmark
- Footer: `flex gap-3 sticky bottom-0 bg-white p-4 border-t`
  - `Export This Event` (JSON), `View in My Desk` (if proposal)

#### 6.3.5 Export Modal

```typescript
interface ExportModalProps {
  isOpen: boolean;
  format: "csv" | "json" | "parquet";
  dateRange: { start: Date; end: Date };
  filters: AuditFilterBarProps["filters"];
  onExport: () => void;
  onClose: () => void;
}
```

**Visual Spec:**

- Modal: `max-w-[480px]`, centered
- Format: `flex gap-3` — radio cards with icon + label
- Date range: pre-filled from current view, editable
- Filters: summary of active filters
- Estimate: "~1,247 events (2.3 MB)"
- Action: `Export` (primary), `Cancel` (secondary)
- Progress: inline spinner + "Generating..." then download trigger

---

### 6.4 Data Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  DATA FLOW: Audit Logs                                                        │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  INBOUND                                                                      │
│  ───────                                                                      │
│  1. Audit events → D1 spine_audit_log + governance_audit_log (append-only)   │
│  2. Query: govern service (for governance) + gateway audit endpoint           │
│  3. Aggregation: telemetry hub (for stats, usage)                             │
│                                                                               │
│  OUTBOUND                                                                     │
│  ────────                                                                     │
│  1. Filtered query → D1 with WHERE tenant_id + indexed filters               │
│  2. Export → CSV/JSON/Parquet generation → R2 signed URL → download        │
│  3. Navigation → workbench (entity) or My Desk (proposal)                   │
│                                                                               │
│  PERMISSIONS                                                                  │
│  ───────────                                                                  │
│  • User view: own actions + twin proposals + entity access for own entities │
│  • Admin view: all actions in tenant (cross-user)                             │
│  • System events: admin + owner only                                          │
│                                                                               │
│  SERVICES                                                                     │
│  ────────                                                                     │
│  • govern (governance audit log)                                              │
│  • gateway (audit endpoint, export)                                           │
│  • l2 (cached queries)                                                        │
│  • telemetry (aggregations)                                                     │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

### 6.5 User Interactions

#### Flow: Admin Investigates a Twin Proposal

| Step | Action                                            | System Response                      | UI Change                                     |
| ---- | ------------------------------------------------- | ------------------------------------ | --------------------------------------------- |
| 1    | Admin opens Audit Logs, filters by Actor = "twin" | Query returns twin events            | Timeline shows only twin-generated events     |
| 2    | Admin clicks on "PROPOSED" event from Jun 3       | Detail drawer opens                  | Full payload, governance decision, confidence |
| 3    | Admin clicks "View in My Desk"                    | Navigates to My Desk (governance)    | Proposal shown with approve/reject options    |
| 4    | Admin clicks "View Entity"                        | Workbench loads with entity selected | Entity360 shows context at time of proposal   |
| 5    | Admin clicks "Export This Event"                  | JSON generated, download triggered   | File: `audit_event_aud_01H.json`              |

---

### 6.6 States

#### Empty States

| State                      | Visual Treatment                                                               |
| -------------------------- | ------------------------------------------------------------------------------ |
| **No events**              | "No audit events yet. Actions will appear here as they occur."                 |
| **Filter returns nothing** | "No events match these filters. Try broadening your search." + "Clear filters" |
| **No permission**          | "You don't have access to audit logs. Contact your admin."                     |

#### Loading States

| Component     | Indicator                                 |
| ------------- | ----------------------------------------- |
| Timeline      | Skeleton events with timeline dots        |
| Detail drawer | Spinner + skeleton sections               |
| Export        | Modal with progress bar + "Generating..." |
| Filter counts | `...` in dropdown badges while loading    |

---

### 6.7 Accessibility

| Requirement  | Implementation                                                                |
| ------------ | ----------------------------------------------------------------------------- |
| **Timeline** | `role="list"`. Each event: `role="listitem"`. Date headers: `role="heading"`. |
| **Filters**  | `aria-label` on each dropdown. Multi-select: `aria-expanded`.                 |
| **Drawer**   | Focus trap. `Esc` closes. Return focus to trigger.                            |
| **Export**   | Progress announced via `aria-live="polite"`. Download link auto-focused.      |
| **Color**    | Timeline dots use shape + position, not just color. Badges have text labels.  |

---

### 6.8 Responsive Behavior

| Breakpoint  | Behavior                                                                                |
| ----------- | --------------------------------------------------------------------------------------- |
| **Desktop** | Full timeline + `520px` detail drawer. Filter bar visible.                              |
| **Tablet**  | Timeline + `50vw` drawer. Filters in collapsible row.                                   |
| **Mobile**  | Table view default (more compact). Timeline becomes vertical cards. Drawer full-screen. |

---

## 7. Browser Automation

### 7.1 Overview

Browser Automation is the **workflow studio for browser-based tasks**. Unlike API-only capabilities, this runs actual browser automation: clicking, typing, scraping, and navigating websites. Users can record workflows by performing actions, then replay them in headless browsers.

**User Journey Position:** Operations (Ops) projection primarily. Used by power users, admins, and developers.

**Core Principles:**

- Record by doing: no code required to start.
- Visual workflow builder: drag, drop, and connect steps.
- Safety first: human-in-the-loop for sensitive actions, screenshots for every step.
- Reusable: workflows become capabilities in the Capability Fabric.

---

### 7.2 Layout / Wireframe Description

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  TOP BAR (64px)                                                             │
│  ┌────┐ ┌──────────────────────────┐ ┌────────────────────────────────────┐ │
│  │ IW │ │ Browser Automation Studio│ │ [New Workflow] [Import] [👤]       │ │
│  └────┘ └──────────────────────────┘ └────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐  ┌────────────────────────────────────────┐  ┌────────────┐ │
│  │ WORKFLOW │  │          WORKFLOW CANVAS               │  │  PROPERTIES│ │
│  │ LIBRARY  │  │          (Visual Builder)              │  │  PANEL     │ │
│  │ (240px)  │  │                                        │  │  (280px)   │ │
│  │          │  │  ┌────┐     ┌────┐     ┌────┐        │  │            │ │
│  │ Folders  │  │  │Visit│────▶│Fill│────▶│Click│────▶  │  │  Selected: │ │
│  │ ┌──────┐ │  │  │URL  │     │Form│     │Btn  │      │  │  Click     │ │
│  │ │Sales │ │  │  └────┘     └────┘     └────┘        │  │  "Submit"  │ │
│  │ │Flows │ │  │     │          │          │            │  │            │ │
│  │ └──────┘ │  │     ▼          ▼          ▼            │  │  Selector: │ │
│  │ ┌──────┐ │  │  [Screenshot] [Wait]   [Screenshot]  │  │  #submit   │ │
│  │ │CS    │ │  │                                        │  │  button    │ │
│  │ │Flows │ │  │  ┌────────────────────────────────┐  │  │            │ │
│  │ └──────┘ │  │  │  RECORDING INDICATOR (optional) │  │  │  Wait:     │ │
│  │          │  │  │  🔴 Recording...  [Stop] [Pause] │  │  │  500ms     │ │
│  │ ┌──────┐ │  │  └────────────────────────────────┘  │  │            │ │
│  │ │+[New]│ │  │                                        │  │  [Screenshot│ │
│  │ └──────┘ │  │  ┌────────────────────────────────┐  │  │   on fail] │ │
│  │          │  │  │  PREVIEW / HEADLESS BROWSER     │  │  │  [☑]       │ │
│  │          │  │  │  (iframe or screenshot stream)   │  │  │            │ │
│  │          │  │  │                                 │  │  │  On Error: │ │
│  │          │  │  │  [Screenshot of current state]  │  │  │  [Stop]    │ │
│  │          │  │  │                                 │  │  │  [Retry 3x]│ │
│  │          │  │  │                                 │  │  │  [Continue]│ │
│  │          │  │  └────────────────────────────────┘  │  │            │ │
│  └──────────┘  └────────────────────────────────────────┘  └────────────┘ │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  BOTTOM BAR: Triggers | Schedule | Safety | Logs                    │  │
│  │  [Run Now] [Schedule: Daily 9am ▼] [HITL: ☑] [Domain: *.salesforce.com]│  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 7.3 Key UI Components

#### 7.3.1 Workflow Library (Left Sidebar)

```typescript
interface WorkflowLibraryProps {
  folders: WorkflowFolder[];
  onSelect: (workflowId: string) => void;
  onCreate: () => void;
  onImport: () => void;
}

interface WorkflowFolder {
  name: string;
  workflows: {
    id: string;
    name: string;
    lastRunAt?: Date;
    status?: "success" | "failed" | "never";
  }[];
}
```

**Visual Spec:**

- Width: `240px`, collapsible to `64px`
- Background: `bg-slate-50 border-r border-neutral-200`
- Folders: collapsible, `text-sm font-semibold uppercase text-neutral-500 px-3 py-2`
- Each workflow: `flex row gap-2 px-3 py-2 rounded-lg hover:bg-neutral-100 cursor-pointer`
  - Name: `text-sm truncate`
  - Status dot: `8px circle` — `success` green, `failed` red, `never` gray
- "+ New" button: `primary` at bottom, sticky

#### 7.3.2 Workflow Canvas (Visual Builder)

```typescript
interface WorkflowCanvasProps {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  onNodeAdd: (type: string, position: { x: number; y: number }) => void;
  onNodeConnect: (from: string, to: string) => void;
  onNodeSelect: (nodeId: string) => void;
  onNodeDelete: (nodeId: string) => void;
  isRecording: boolean;
}

interface WorkflowNode {
  id: string;
  type: "visit" | "click" | "type" | "wait" | "screenshot" | "extract" | "condition" | "loop";
  position: { x: number; y: number };
  data: Record<string, unknown>;
}

interface WorkflowEdge {
  id: string;
  from: string;
  to: string;
  label?: string; // "success", "fail", "always"
}
```

**Visual Spec:**

- Background: `bg-white` with `dot-grid` pattern (subtle `bg-neutral-50` dots, `16px` spacing)
- Drag-and-drop canvas: `@xyflow/react` or similar
- Nodes: `rounded-lg bg-white border-2 shadow-sm min-w-[140px] p-3`
  - Header: icon + type name (`text-xs font-bold uppercase`) + color by type
    - `visit`: `border-blue-400`
    - `click`: `border-green-400`
    - `type`: `border-purple-400`
    - `wait`: `border-yellow-400`
    - `screenshot`: `border-gray-400`
    - `extract`: `border-orange-400`
    - `condition`: `border-pink-400`
  - Body: `text-xs text-neutral-600 mt-1` — e.g., "https://...", "#submit-btn"
  - Selected: `ring-2 ring-primary-500`, `border-primary-400`
- Edges: `stroke-neutral-300 stroke-2`, arrowheads. Labels: `bg-white text-[10px]`
- Recording indicator: `fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-danger text-white rounded-lg px-4 py-2 shadow-lg flex items-center gap-2 z-50`
  - `🔴 Recording...` + `Stop` button

#### 7.3.3 Properties Panel (Right Sidebar)

```typescript
interface PropertiesPanelProps {
  selectedNode: WorkflowNode | null;
  onUpdate: (nodeId: string, data: Record<string, unknown>) => void;
}
```

**Visual Spec:**

- Width: `280px`, `bg-slate-50 border-l border-neutral-200`
- Empty: "Select a node to edit properties"
- Node selected:
  - Header: node type icon + name + delete button (`🗑️`)
  - Form: `label` + `input`/`select`/`textarea` per property
  - Common properties:
    - `selector`: `input` with CSS selector validation
    - `wait`: `number` input (ms)
    - `screenshot on fail`: `checkbox`
    - `on error`: `select` (`stop`, `retry`, `continue`, `branch`)
  - Dynamic properties based on node type
- Validation: `text-danger text-xs` inline, node border turns red if invalid

#### 7.3.4 Headless Browser Preview

```typescript
interface BrowserPreviewProps {
  screenshotUrl?: string;
  isRunning: boolean;
  currentUrl?: string;
  logs: BrowserLog[];
}

interface BrowserLog {
  timestamp: Date;
  level: "info" | "warn" | "error";
  message: string;
  step?: number;
  screenshotUrl?: string;
}
```

**Visual Spec:**

- Panel: `bg-neutral-900 rounded-lg border border-neutral-700 overflow-hidden`
- Header: `bg-neutral-800 px-3 py-2 flex items-center gap-2 text-xs text-neutral-300`
  - Mock browser chrome: `● ● ●` (red/yellow/green dots) + URL bar showing current URL
- Body: `screenshot` or `iframe` of running browser
  - If running: screenshot refreshes every `2s` or on each step
  - If idle: "Ready to run. Click 'Run Now' to start."
- Step overlay: `absolute` box drawn on screenshot showing selector location (if click/type)

#### 7.3.5 Trigger Configuration Panel

```typescript
interface TriggerConfigProps {
  triggers: Trigger[];
  onAdd: (trigger: Trigger) => void;
  onRemove: (triggerId: string) => void;
}

type Trigger =
  | { type: "scheduled"; cron: string; timezone: string }
  | { type: "event"; event: string; condition?: string }
  | { type: "manual" }
  | { type: "ai_proposed"; confidence: number };
```

**Visual Spec:**

- Collapsible bottom panel, `h-[200px]` when open
- Trigger list: `flex gap-3` cards
  - Each trigger: `bg-white rounded-lg border border-neutral-200 p-3 flex-1`
  - Icon by type: `⏰` scheduled, `⚡` event, `👆` manual, `🤖` AI
  - Config: `text-xs text-neutral-600` — e.g., "Daily at 9:00 AM UTC"
  - Remove: `×` icon
- Add trigger: `+` button opens dropdown of trigger types

#### 7.3.6 Safety Controls Panel

```typescript
interface SafetyControlsProps {
  settings: {
    humanInTheLoop: boolean;
    rateLimit: number; // requests per minute
    allowedDomains: string[];
    blockedDomains: string[];
    maxExecutionTime: number; // seconds
    screenshotOnEveryStep: boolean;
  };
  onUpdate: (settings: SafetyControlsProps["settings"]) => void;
}
```

**Visual Spec:**

- Tab or section within bottom panel
- `bg-warning-50 border border-warning-200 rounded-lg p-4`
- Header: `⚠️` + "Safety Controls" + `text-sm font-semibold`
- Controls:
  - Human-in-the-loop: `toggle` + "Pause before sensitive actions (form submits, deletes)"
  - Rate limit: `slider` + `number` input (1–60 req/min)
  - Allowed domains: `tag input` (`flex gap-2 flex-wrap`), each domain is a removable chip
  - Blocked domains: same, but `bg-danger-50 text-danger`
  - Max execution time: `slider` (30s–10min)
  - Screenshot every step: `toggle`

---

### 7.4 Data Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  DATA FLOW: Browser Automation                                                │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  INBOUND                                                                      │
│  ───────                                                                      │
│  1. Workflow definitions → D1 (workflow_definitions)                        │
│  2. Execution logs → D1 (workflow_executions) + R2 (screenshots)            │
│  3. Library: D1 query by tenant + folder                                    │
│                                                                               │
│  OUTBOUND                                                                     │
│  ────────                                                                     │
│  1. Record mode: Browser events → workflow DO → node sequence → D1 save     │
│  2. Playback: workflow DO → browser automation worker → headless Chrome    │
│     → screenshots → R2 → execution log → D1                              │
│  3. Trigger: cron DO / event queue → workflow DO enqueue                  │
│                                                                               │
│  SERVICES                                                                     │
│  ────────                                                                     │
│  • workflow (workflow DO, execution engine)                                 │
│  • browser-automation (headless Chrome worker)                                │
│  • scheduler (cron triggers)                                                  │
│  • l2 (screenshot CDN via R2)                                                 │
│  • govern (HITL for sensitive steps)                                        │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

### 7.5 User Interactions

#### Flow: User Records a Login Workflow

| Step | Action                                    | System Response                                 | UI Change                                               |
| ---- | ----------------------------------------- | ----------------------------------------------- | ------------------------------------------------------- |
| 1    | User clicks "+ New Workflow"              | New workflow created in D1                      | Blank canvas with start node                            |
| 2    | User clicks "Record" button               | Browser automation worker opens headless Chrome | Recording indicator appears, preview shows live browser |
| 3    | User types URL, fills form, clicks submit | Each action captured as node                    | Nodes appear on canvas: Visit → Type → Type → Click     |
| 4    | User clicks "Stop Recording"              | Recording ends, workflow saved                  | Recording indicator disappears. Nodes are editable.     |
| 5    | User clicks "Run Now"                     | Workflow DO executes in headless browser        | Preview shows live screenshots. Step-by-step progress.  |
| 6    | Workflow completes                        | Screenshot saved to R2, log written to D1       | Toast: "Workflow completed. 5 steps, 12s." + "View log" |
| 7    | User clicks "Schedule"                    | Cron trigger created                            | Bottom panel shows "Daily at 9am" trigger card          |

---

### 7.6 States

#### Empty States

| State                | Visual Treatment                                                                        |
| -------------------- | --------------------------------------------------------------------------------------- |
| **No workflows**     | Library: "No workflows yet. Create one or record your first automation." + tutorial CTA |
| **No node selected** | Properties panel: "Select a node to edit properties."                                   |
| **Preview idle**     | "Ready to run. Click 'Run Now' to see the browser in action."                           |
| **No triggers**      | "No triggers set. This workflow can only be run manually."                              |

#### Loading States

| Component | Indicator                                      |
| --------- | ---------------------------------------------- |
| Canvas    | Skeleton nodes                                 |
| Recording | Red pulse indicator + "Recording..."           |
| Playback  | Progress bar across steps + screenshot updates |
| Preview   | Spinner + "Launching browser..."               |

#### Error States

| Error                  | Visual Treatment                                            | Recovery                                 |
| ---------------------- | ----------------------------------------------------------- | ---------------------------------------- |
| **Selector not found** | Node turns red. Log: "Element '#submit' not found."         | Edit selector, re-run.                   |
| **Timeout**            | Node turns red. Log: "Timeout after 30s."                   | Increase wait, check URL.                |
| **Domain blocked**     | Toast: "Navigation to example.com blocked by safety rules." | Add to allowed domains or edit workflow. |
| **HITL rejected**      | Log: "Human rejected step 4. Workflow halted."              | Resume from step or abort.               |

---

### 7.7 Accessibility

| Requirement    | Implementation                                                                                                       |
| -------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Canvas**     | Nodes: `role="button"`, `aria-label="[type] node: [description]"`. Edges: `aria-label="Connection from [A] to [B]"`. |
| **Properties** | All inputs have `label`. Error messages: `aria-live="polite"`.                                                       |
| **Recording**  | `aria-live="assertive"` announces "Recording started" / "Recording stopped".                                         |
| **Preview**    | Screenshots: `alt` text describes current step. If iframe, `title` attribute.                                        |
| **Keyboard**   | `Tab` navigates nodes. `Enter` selects. `Delete` removes. `Ctrl+Z` undo.                                             |

---

### 7.8 Responsive Behavior

| Breakpoint  | Behavior                                                              |
| ----------- | --------------------------------------------------------------------- |
| **Desktop** | Full 3-column: Library + Canvas + Properties. Bottom panel visible.   |
| **Tablet**  | Library collapsible. Properties as overlay. Bottom panel `h-[160px]`. |
| **Mobile**  | Not supported for editing. Read-only: execution logs, run/pause.      |

---

## 8. Workflows

### 8.1 Overview

Workflows are **user-defined or AI-proposed sequences of actions**. They are the primary automation layer of the platform — from simple "when X, do Y" to complex multi-step business processes with branching, retries, and human approval.

**User Journey Position:** Cross-cutting. Used in Sales (follow-up sequences), CS (health check workflows), Operations (sync + reconcile), and Architecture (CI/CD pipelines).

**Core Principles:**

- Visual first, code optional: anyone can build a workflow.
- AI-assisted: the Twin proposes workflows based on observed patterns.
- Reusable: templates and marketplace enable sharing.
- Governed: every step is auditable, approval-gated where needed.

---

### 8.2 Layout / Wireframe Description

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  TOP BAR (64px)                                                             │
│  ┌────┐ ┌──────────────────────────┐ ┌────────────────────────────────────┐ │
│  │ IW │ │ Workflows                │ │ [New Workflow] [Templates] [👤]  │ │
│  └────┘ └──────────────────────────┘ └────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  VIEW TABS: [My Workflows] [Team] [Marketplace] [AI Proposed]      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  AI PROPOSED BANNER (if available)                                   │   │
│  │  ┌────────────────────────────────────────────────────────────────┐   │   │
│  │  │ 🤖 "I noticed you manually update deal stages 5× daily.     │   │   │
│  │  │     Want to automate it?"  [Review Proposal] [Dismiss]       │   │   │
│  │  └────────────────────────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  WORKFLOW GRID / LIST                                                  │   │
│  │                                                                        │   │
│  │  ┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐   │   │
│  │  │ [🔁]               │ │ [📧]               │ │ [🤖]               │   │   │
│  │  │ Deal Stage Sync    │ │ Follow-up Sequence │ │ Health Check Bot   │   │   │
│  │  │                    │ │                    │ │                    │   │   │
│  │  │ Trigger: Event     │ │ Trigger: Scheduled │ │ Trigger: AI        │   │   │
│  │  │ Status: ✅ Active  │ │ Status: ✅ Active  │ │ Status: ⏸️ Paused │   │   │
│  │  │ Runs: 1,247        │ │ Runs: 84           │ │ Runs: 12           │   │   │
│  │  │ Last: 2 min ago    │ │ Last: 1 hour ago   │ │ Last: 3 days ago   │   │   │
│  │  │                    │ │                    │ │                    │   │   │
│  │  │ [Run] [Edit] [•••] │ │ [Run] [Edit] [•••] │ │ [Run] [Edit] [•••] │   │   │
│  │  └────────────────────┘ └────────────────────┘ └────────────────────┘   │   │
│  │                                                                        │   │
│  │  [Workflow Marketplace →]                                              │   │
│  │  ┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐   │   │
│  │  │ [📊] Revenue Rec   │ │ [🔄] Data Cleanup  │ │ [📢] Slack Alert   │   │   │
│  │  │ [Install]          │ │ [Install]          │ │ [Install]          │   │   │
│  │  │ 128 installs       │ │ 64 installs        │ │ 312 installs       │   │   │
│  │  └────────────────────┘ └────────────────────┘ └────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 8.3 Key UI Components

#### 8.3.1 Workflow Editor

```typescript
interface WorkflowEditorProps {
  workflow: Workflow;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  onSave: (workflow: Workflow) => void;
  onRun: () => void;
  onPublish: () => void;
  isDirty: boolean;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: Trigger;
  status: "draft" | "active" | "paused" | "error";
  isTemplate: boolean;
  owner: string;
  teamAccess: "private" | "team" | "organization";
  createdAt: Date;
  updatedAt: Date;
}
```

**Visual Spec:**

- Similar to Browser Automation canvas but with workflow-specific nodes
- Node types:
  - `trigger`: `rounded-full bg-neutral-900 text-white`, start of workflow
  - `action`: `rounded-lg bg-white border-2 border-blue-400` — capability invoke
  - `condition`: `diamond shape bg-white border-2 border-pink-400` — if/else branch
  - `wait`: `rounded-lg bg-white border-2 border-yellow-400` — delay or wait for event
  - `loop`: `rounded-lg bg-white border-2 border-purple-400` — iterate over list
  - `governance`: `rounded-lg bg-white border-2 border-warning-400` — HITL gate
  - `end`: `rounded-full bg-neutral-200 text-neutral-500` — terminal
- Toolbar: `fixed top-[80px] left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-md border px-4 py-2 flex gap-2 z-40`
  - Draggable node types: `Trigger`, `Action`, `Condition`, `Wait`, `Loop`, `Governance`, `End`
  - Each: `icon` + `label` (`text-xs`), `cursor-grab`
- Save status: `bottom-left`, `text-xs text-neutral-400` — "Saved" / "Unsaved changes" / "Saving..."
- Run button: `fixed bottom-6 right-6 bg-primary-600 text-white rounded-full w-14 h-14 shadow-lg flex items-center justify-center hover:bg-primary-700 z-50`

#### 8.3.2 AI-Proposed Workflow Banner

```typescript
interface AIProposalBannerProps {
  proposal: {
    id: string;
    description: string;
    observedPattern: string;
    confidence: number;
    estimatedImpact: { timeSaved: number; frequency: number };
  };
  onReview: () => void;
  onDismiss: () => void;
}
```

**Visual Spec:**

- Full-width banner: `bg-primary-50 border border-primary-200 rounded-xl p-4 mb-6 flex items-center gap-4`
- Left: `🤖` icon (`40px`, `bg-primary-100 rounded-full p-2`)
- Center: `text-sm text-primary-900`
  - Line 1: `font-medium` — description
  - Line 2: `text-xs text-primary-600` — "Based on N observed actions"
- Right: `flex gap-2`
  - `Review Proposal`: `bg-primary-600 text-white rounded-lg px-4 py-2 text-sm`
  - `Dismiss`: `text-neutral-400 hover:text-neutral-600 text-sm`
- Dismiss: collapses with `slide-up + fade`, `200ms`

#### 8.3.3 Workflow Execution Dashboard

```typescript
interface ExecutionDashboardProps {
  executions: WorkflowExecution[];
  onViewLog: (executionId: string) => void;
  onRerun: (executionId: string) => void;
  onCancel: (executionId: string) => void;
}

interface WorkflowExecution {
  id: string;
  workflowId: string;
  workflowName: string;
  status: "running" | "completed" | "failed" | "cancelled" | "waiting";
  startedAt: Date;
  completedAt?: Date;
  triggeredBy: "schedule" | "manual" | "event" | "ai";
  stepCount: number;
  currentStep?: number;
  errorMessage?: string;
}
```

**Visual Spec:**

- Table: `w-full text-sm`
- Columns: Status (icon + text), Workflow (name + link), Triggered By (badge), Started (time), Duration, Steps (progress), Actions
- Status icons:
  - `running`: `spinner` + `text-info`
  - `completed`: `check` + `text-success`
  - `failed`: `x` + `text-danger`
  - `cancelled`: `slash` + `text-neutral-400`
  - `waiting`: `pause` + `text-warning`
- Progress: `w-[100px] h-2 bg-neutral-200 rounded-full overflow-hidden` with `bg-primary-500` fill
- Actions: `View Log` (drawer), `Rerun` (if completed/failed), `Cancel` (if running)

#### 8.3.4 Workflow Templates Gallery

```typescript
interface TemplateGalleryProps {
  templates: WorkflowTemplate[];
  onInstall: (templateId: string) => void;
  onPreview: (templateId: string) => void;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  author: string;
  installCount: number;
  isOfficial: boolean;
  previewNodes: WorkflowNode[];
}
```

**Visual Spec:**

- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`
- Card: `bg-white rounded-xl border border-neutral-200 p-5 hover:shadow-md transition-all`
- Top: `text-xs text-neutral-400 uppercase` category + `isOfficial` ? `Official` badge : null
- Name: `text-sm font-semibold`
- Description: `text-xs text-neutral-600 mt-1 line-clamp-2`
- Mini preview: `h-[80px] bg-neutral-50 rounded border border-neutral-200 mt-3` — static SVG or canvas of node layout
- Footer: `flex items-center justify-between mt-3`
  - Left: author avatar + name (`text-xs`)
  - Right: install count (`text-xs text-neutral-400`) + `Install` button (`primary`)

#### 8.3.5 Trigger Configuration Modal

```typescript
interface TriggerConfigModalProps {
  trigger: Trigger | null;
  onSave: (trigger: Trigger) => void;
  onClose: () => void;
}
```

**Visual Spec:**

- Modal: `max-w-[560px]`
- Type selector: `flex gap-3` — card radio buttons
  - `Time-based`: `⏰` + "Run on a schedule"
  - `Event-based`: `⚡` + "Run when something happens"
  - `Manual`: `👆` + "Run when I click"
  - `AI-proposed`: `🤖` + "Let the AI decide when"
- Dynamic config based on type:
  - Time: `cron` input + timezone picker + "Next 3 runs" preview
  - Event: `select` event type + `condition` builder
  - Manual: no config needed
  - AI: `confidence` slider (0.70–0.95) + `max frequency` selector
- Footer: `Save` (primary), `Cancel` (secondary)

---

### 8.4 Data Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  DATA FLOW: Workflows                                                         │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  INBOUND                                                                      │
│  ───────                                                                      │
│  1. Workflow definitions → D1 (workflow_definitions)                        │
│  2. Execution logs → D1 (workflow_executions) + KV (real-time status)         │
│  3. Templates → D1 (workflow_templates) + R2 (previews)                     │
│  4. AI proposals → twin-orchestrator DO → user approval → D1              │
│                                                                               │
│  OUTBOUND                                                                     │
│  ────────                                                                     │
│  1. Create/Edit → Gateway → workflow service → D1                            │
│  2. Run → Gateway → Hermes → workflow DO → capability invocations          │
│  3. Trigger: cron DO / event queue → workflow DO enqueue                    │
│  4. AI proposal: twin → govern → user → workflow DO (if approved)           │
│                                                                               │
│  SERVICES                                                                     │
│  ────────                                                                     │
│  • workflow (workflow DO, execution engine)                                   │
│  • hermes (capability routing for action nodes)                             │
│  • scheduler (cron triggers)                                                  │
│  • twin-orchestrator (AI proposals)                                           │
│  • govern (approval for AI-proposed workflows)                               │
│  • store (persistence)                                                        │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

### 8.5 User Interactions

#### Flow: User Creates and Runs a Workflow from Template

| Step | Action                                           | System Response                             | UI Change                                            |
| ---- | ------------------------------------------------ | ------------------------------------------- | ---------------------------------------------------- |
| 1    | User opens Workflows, clicks "Templates"         | Templates fetched from D1                   | Gallery of official + community templates            |
| 2    | User clicks "Install" on "Revenue Recognition"   | Workflow definition copied to user's tenant | Editor opens with template pre-loaded                |
| 3    | User customizes trigger to "Monthly, 1st at 9am" | Cron trigger saved                          | Trigger node shows "Monthly 9am"                     |
| 4    | User clicks "Publish"                            | Workflow status → `active`                  | Toast: "Workflow active. Next run: July 1, 9:00 AM." |
| 5    | Workflow runs on schedule                        | Execution log written, capabilities invoked | Execution dashboard shows "Running" → "Completed"    |
| 6    | User views execution log                         | Step-by-step trace fetched                  | Log drawer shows each node, input/output, latency    |

---

### 8.6 States

#### Empty States

| State               | Visual Treatment                                                                 |
| ------------------- | -------------------------------------------------------------------------------- |
| **No workflows**    | "No workflows yet. Create one from scratch or install a template." + CTA buttons |
| **No templates**    | "No templates available. Check back later."                                      |
| **No executions**   | "This workflow hasn't run yet. Click 'Run Now' to test."                         |
| **No AI proposals** | "The Twin is watching. When it spots a pattern, a proposal will appear here."    |

#### Loading States

| Component | Indicator                              |
| --------- | -------------------------------------- |
| Editor    | Skeleton nodes + "Loading workflow..." |
| Gallery   | Skeleton cards                         |
| Dashboard | Skeleton table rows                    |
| Execution | Real-time step progress + spinner      |
| Run       | Inline button spinner + "Running..."   |

#### Error States

| Error                 | Visual Treatment                                                        | Recovery                 |
| --------------------- | ----------------------------------------------------------------------- | ------------------------ |
| **Workflow invalid**  | Node red border + "Invalid configuration" tooltip                       | Fix properties, re-save. |
| **Execution failed**  | Status: red + error message in log. Toast: "Workflow failed at step 3." | View log, edit, rerun.   |
| **Trigger error**     | "Invalid cron expression" inline.                                       | Correct cron syntax.     |
| **Permission denied** | "You don't have permission to edit this workflow."                      | Fork or request access.  |

---

### 8.7 Accessibility

| Requirement       | Implementation                                                       |
| ----------------- | -------------------------------------------------------------------- |
| **Editor**        | Same as Browser Automation canvas: `role` and `aria-label` on nodes. |
| **Dashboard**     | Table: `scope="col"` headers. Row actions: `aria-label`.             |
| **Triggers**      | `aria-live="polite"` on cron preview. Slider: `aria-valuemin/max`.   |
| **Modals**        | Focus trap. `Esc` closes. Return focus.                              |
| **Notifications** | Toast: `aria-live="polite"`. AI banner: `aria-live="polite"`.        |

---

### 8.8 Responsive Behavior

| Breakpoint  | Behavior                                                                    |
| ----------- | --------------------------------------------------------------------------- |
| **Desktop** | Full editor canvas + side panels. Gallery `3-col`. Dashboard full table.    |
| **Tablet**  | Editor: properties panel as overlay. Gallery `2-col`. Dashboard scrollable. |
| **Mobile**  | Editor: read-only, view executions. Gallery `1-col`. Dashboard: card view.  |

---

## Appendix A: Shared TypeScript Interfaces

```typescript
// ============================================
// SHARED UI TYPES
// ============================================

export type ProjectionType =
  | "sales"
  | "cs"
  | "finance"
  | "executive"
  | "architecture"
  | "operations"
  | "personal"
  | "developer";

export type Role = "owner" | "admin" | "member" | "viewer" | "api" | "tam" | "account_success";

export type OodaPhase = "observe" | "orient" | "decide" | "act" | "cross-phase";

export interface Entity360 {
  primaryEntity: {
    id: string; // SSOC UUID
    type: string;
    providerId: string;
    displayName: string;
    traits: Record<string, unknown>;
  };
  relatedEntities: RelatedEntity[];
  timeline: TimelineEvent[];
  memory: {
    lastInteraction: number; // timestamp
    sentiment: number; // -1 to 1
    keyTopics: string[];
    openTasks: number;
  };
  knowledge: KnowledgeChunk[];
  availableCapabilities: string[];
}

export interface RelatedEntity {
  id: string;
  type: string;
  displayName: string;
  relationType: string;
  confidence: number;
}

export interface TimelineEvent {
  timestamp: Date;
  action: string;
  actor: string;
  via: string;
  description: string;
}

export interface KnowledgeChunk {
  id: string;
  documentId: string;
  content: string;
  source: string;
  pageNumber?: number;
  heading?: string;
}

export interface CapabilityInfo {
  id: string; // capability URI
  displayName: string;
  description: string;
  namespace: string;
  oodaPhase: OodaPhase;
  requiresApproval: boolean;
  minConfidence: number;
  autoApproveThreshold: number;
  requiredRoles: string[];
  requiredScopes: string[];
  usageCount: number;
  averageConfidence: number;
  averageLatencyMs: number;
  isActive: boolean;
  isDeprecated: boolean;
  inputSchema?: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
}

export interface GovernanceStatus {
  pendingProposals: number;
  autoApprovedToday: number;
  hitlToday: number;
  rejectedToday: number;
}

export interface TwinInsight {
  id: string;
  type: "proposal" | "context" | "suggestion" | "alert" | "pattern";
  message: string;
  confidence: number;
  entityId?: string;
  entityName?: string;
  action?: { capability: string; payload: unknown; label: string };
  dismissible: boolean;
}

export interface MemoryRecord {
  id: string;
  scope: "personal" | "work" | "organization" | "ai";
  tier: "active" | "staging" | "archived";
  content: string;
  confidence: number;
  source: string;
  ssocReferences: string[];
  accessCount: number;
  lastAccessedAt?: Date;
  createdAt: Date;
}

export interface SearchResult {
  type: "entity" | "capability" | "memory" | "knowledge" | "command";
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  score: number;
  entityType?: string;
  entityId?: string;
}

export interface Command {
  id: string;
  label: string;
  shortcut?: string;
  category: "navigation" | "action" | "projection" | "twin" | "system";
  icon: string;
  action: () => void;
}

export interface ChatSession {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
  messageCount: number;
  isPinned: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  toolCalls?: ToolCallDisplay[];
  memoryCitations?: MemoryCitation[];
  fileAttachments?: FileAttachment[];
  proposal?: ProposalInline;
  isStreaming?: boolean;
}

export interface ToolCallDisplay {
  id: string;
  capability: string;
  status: "pending" | "running" | "success" | "error";
  input?: unknown;
  output?: unknown;
  latencyMs?: number;
}

export interface MemoryCitation {
  memoryId: string;
  content: string;
  source: string;
  confidence: number;
  entityName?: string;
}

export interface FileAttachment {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
}

export interface ProposalInline {
  id: string;
  summary: string;
  confidence: number;
  reasoningTrace?: string;
  estimatedImpact?: { revenue?: number; timeSaved?: number; riskScore?: number };
  capability: string;
  payload: unknown;
}

export interface AuditEvent {
  id: string;
  timestamp: Date;
  actor: string;
  action: string;
  via: string;
  entityId?: string;
  entityName?: string;
  entityType?: string;
  capability?: string;
  confidence?: number;
  governanceDecision?: string;
  summary: string;
  payloadHash: string;
  metadata?: Record<string, unknown>;
}

export interface WorkflowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: Record<string, unknown>;
}

export interface WorkflowEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
}
```

---

## Appendix B: CSS / Tailwind Quick Reference

```css
/* ============================================
   INTEGRATEWISE TAILWIND CONFIG EXTENSIONS
   ============================================ */

/* Add to tailwind.config.js:
module.exports = {
  theme: {
    extend: {
      colors: {
        'iw-primary': {
          50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd',
          400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8',
          800: '#1e40af', 900: '#1e3a8a',
        },
        'iw-neutral': {
          50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1',
          400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155',
          800: '#1e293b', 900: '#0f172a',
        },
        'iw-success': '#22c55e',
        'iw-warning': '#f59e0b',
        'iw-danger': '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'subtle-pulse': 'subtle-pulse 3s ease-in-out infinite',
      },
      keyframes: {
        'subtle-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
};
*/

/* ============================================
   COMMON UTILITY PATTERNS
   ============================================ */

/* Card base */
.iw-card {
  @apply bg-white rounded-xl border border-iw-neutral-200 p-5
         hover:shadow-md transition-all duration-200;
}

/* Button primary */
.iw-btn-primary {
  @apply bg-iw-primary-600 text-white rounded-lg px-4 py-2 text-sm
         hover:bg-iw-primary-700 active:bg-iw-primary-800
         focus:ring-2 focus:ring-iw-primary-500 focus:ring-offset-2
         disabled:opacity-50 disabled:cursor-not-allowed
         transition-colors duration-150;
}

/* Button secondary */
.iw-btn-secondary {
  @apply bg-white border border-iw-neutral-200 text-iw-neutral-700 rounded-lg px-4 py-2 text-sm
         hover:bg-iw-neutral-50 active:bg-iw-neutral-100
         focus:ring-2 focus:ring-iw-primary-500 focus:ring-offset-2
         transition-colors duration-150;
}

/* Input base */
.iw-input {
  @apply w-full bg-white border border-iw-neutral-200 rounded-lg px-3 py-2 text-sm
         focus:outline-none focus:ring-2 focus:ring-iw-primary-200 focus:border-iw-primary-400
         placeholder:text-iw-neutral-400
         transition-colors duration-150;
}

/* Badge */
.iw-badge {
  @apply inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide;
}

/* Drawer overlay */
.iw-drawer-overlay {
  @apply fixed inset-0 bg-black/40 backdrop-blur-sm z-40;
}

/* Drawer panel */
.iw-drawer-panel {
  @apply fixed right-0 top-0 h-full bg-white shadow-2xl z-50
         transform transition-transform duration-400 ease-out;
}

/* Toast */
.iw-toast {
  @apply fixed top-6 right-6 z-50 bg-white rounded-lg shadow-lg border px-4 py-3
         min-w-[300px] max-w-[400px] flex items-start gap-3
         animate-slide-in-right;
}

/* Skeleton */
.iw-skeleton {
  @apply animate-pulse bg-iw-neutral-200 rounded;
}

/* Confidence badge */
.iw-confidence-high {
  @apply bg-iw-success text-white;
}
.iw-confidence-medium {
  @apply bg-iw-warning text-white;
}
.iw-confidence-low {
  @apply bg-iw-danger text-white;
}

/* Scrollbar (subtle) */
.iw-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.iw-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.iw-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
.iw-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
```

---

## Appendix C: Keyboard Shortcuts Reference

| Shortcut                    | Action                         | Context                      |
| --------------------------- | ------------------------------ | ---------------------------- |
| `⌘K` / `Ctrl+K`             | Open Command Palette           | Global                       |
| `⌘/` / `Ctrl+/`             | Toggle Overlay                 | Global                       |
| `1`–`8`                     | Switch Projection              | Workbench                    |
| `⌘E` / `Ctrl+E`             | Focus Entity Explorer          | Workbench                    |
| `⌘F` / `Ctrl+F`             | Focus Universal Search         | Workbench                    |
| `Esc`                       | Close modal / drawer / overlay | Global                       |
| `?`                         | Show keyboard shortcuts help   | Global                       |
| `Shift+1`–`Shift+8`         | Open projection in split view  | Workbench                    |
| `⌘Enter` / `Ctrl+Enter`     | Send message                   | AI Home                      |
| `Shift+Enter`               | New line in message            | AI Home                      |
| `↑` (in empty input)        | Recall last message            | AI Home                      |
| `⌘S` / `Ctrl+S`             | Save workflow                  | Workflow Editor              |
| `⌘R` / `Ctrl+R`             | Run workflow                   | Workflow Editor              |
| `Delete` / `Backspace`      | Delete selected node           | Canvas (Workflow/Automation) |
| `Ctrl+Z` / `⌘Z`             | Undo                           | Canvas                       |
| `Ctrl+Shift+Z` / `⌘Shift+Z` | Redo                           | Canvas                       |

---

> **End of Document**
>
> This specification is the definitive product UI reference for the IntegrateWise Continuity Bridge. All frontend implementations should conform to the layouts, components, data flows, states, accessibility requirements, and responsive behaviors described herein.
>
> For questions or clarifications, contact the Product Design team.

# IntegrateWise Continuity Bridge — Human-First UI Specification

> **Version:** 2.0.0 | **Date:** 2026-07-03 | **Status:** Human-First Product Specification  
> **For:** IntegrateWise Engineering & Product Design Teams  
> **Scope:** Revised UI specification applying human-first philosophy to all 8 user-facing product components.  
> **Philosophy:** The human is the protagonist. AI is the supporting character.

---

## Table of Contents

1. [The Philosophy Shift](#the-philosophy-shift)
2. [Human-First Design Principles](#human-first-design-principles)
3. [The Human's Mental Model](#the-humans-mental-model)
4. [User Workbench](#1-user-workbench)
5. [Overlay (Notification Layer)](#2-overlay-notification-layer)
6. [AI Home (Dedicated Chat Space)](#3-ai-home)
7. [Capability Fabric](#4-capability-fabric)
8. [Ingress (UI Entry Points)](#5-ingress)
9. [Audit Logs (Transparency Layer)](#6-audit-logs)
10. [Browser Automation](#7-browser-automation)
11. [Workflows](#8-workflows)
12. [Accessibility for Human-First AI](#accessibility-for-human-first-ai)
13. [Appendices](#appendices)

---

## The Philosophy Shift

### BEFORE (AI-First)

The AI-first interface positioned the Twin as the dominant presence. Users opened the app to an AI dashboard:

- **Lead Intelligence sidebar** dominated the right side of every screen with AI scores, AI enrichment, and AI reasoning prominently displayed.
- **Twin Enrichment Bar** persisted at the bottom of the Workbench, always pushing suggestions.
- **Floating AI Bubble** (robot avatar) sat in the bottom-right corner at all times, pulsing with "unread" counts.
- **AI Proposals** appeared as large cards in side panels, interrupting the user's current task.
- **AI Scores** (0.0–1.0 confidence) were displayed as large colored badges on every entity, every capability, every workflow.
- **AI Home** was positioned as a primary destination — the user was expected to "talk to the AI" as a core workflow.

The UI felt like an **AI dashboard with human data layered underneath**.

### AFTER (Human-First)

The human-first interface is a **workbench for human work**. AI is ambient, subtle, and opt-in:

- **The Workbench is human-only by default.** Clean entity lists. Clear data. Human actions. No AI panels.
- **AI presence is a whisper, not a shout.** A subtle colored dot on an entity. A small badge. A dismissible toast at the bottom of the screen.
- **AI is opt-in, not opt-out.** The user must explicitly ask for AI help. AI never pushes itself into the primary view.
- **The AI lives in its own home.** AI Home is a dedicated chat space — accessed intentionally, not by default.
- **Human actions are the story.** Audit logs show what the human did by default. AI actions are a separate, toggleable view.
- **The human is the protagonist.** Every button the user presses is a human action. AI proposals are suggestions, never actions.

The UI feels like a **human workbench with an AI layer that appears only when invited**.

---

## Human-First Design Principles

| #   | Principle                           | Before                                                     | After                                                    |
| --- | ----------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------- |
| 1   | **Human is the protagonist.**       | UI tells the story of what the AI did.                     | UI tells the story of what the human did.                |
| 2   | **AI is the supporting character.** | AI present always, dominates the view.                     | AI present only when relevant, never dominates.          |
| 3   | **Opt-in, not opt-out.**            | AI features visible by default, user dismisses.            | AI features hidden by default, user reveals.             |
| 4   | **No AI panels in default view.**   | AI content lives in sidebars and persistent bars.          | AI content lives in drawers, toasts, or dedicated pages. |
| 5   | **Subtle indicators.**              | Large score cards, intelligence panels, confidence badges. | Color dots, small badges, whisper-level hints.           |
| 6   | **Explicit human actions.**         | AI action buttons (Qualify, Convert) prominent.            | Human actions only. AI proposals are suggestions.        |
| 7   | **The workbench is sacred.**        | Main workspace shared with AI outputs.                     | Main workspace is for human work only.                   |

---

## The Human's Mental Model

> **"I am doing my work. The AI is helping me when I ask."**

### What the Human Believes

1. **"This is my workbench."** The entities, the data, the actions — they are mine. I am the actor.
2. **"The AI is a tool I can use."** Like a calculator or a search engine, it is available when I need it. It does not work unless I invoke it.
3. **"The AI does not act without my permission."** Every action that affects my data requires my explicit approval. Nothing happens automatically.
4. **"I can ignore the AI completely."** If I never click "Ask AI," the interface still works perfectly. I am not missing core functionality.
5. **"The AI's suggestions are suggestions, not commands."** I can dismiss them without consequence. I can explore them if I choose.

### What the Human Experiences

| Scenario             | Before (AI-First)                                               | After (Human-First)                                                         |
| -------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Open app             | See AI dashboard with scores, proposals, enrichment             | See clean entity list with my data. No AI clutter.                          |
| View a lead          | Lead Intelligence sidebar shows AI score, enrichment, reasoning | See my lead data. Small dot: green/yellow/red. Hover reveals "Ask AI."      |
| Need help            | AI chat is always open in overlay                               | Click "Ask AI" button. AI panel slides in. Ask question. Dismiss when done. |
| AI has a suggestion  | Large proposal card slides in from right                        | Subtle toast at bottom: "AI suggests: [action] [Why?] [Dismiss] [Do it]"    |
| Review what happened | Audit log shows AI actions mixed with human actions             | Audit log shows my actions. Toggle to see "What did the AI do?"             |
| Build a workflow     | AI suggests workflow templates aggressively                     | I browse templates. ONE chip: "You might also like..." I click if I want.   |

---

## Design System Foundations (Human-First Adaptations)

The core design system (colors, typography, spacing, shadows, animations) remains unchanged from v1.0.0. The following adaptations apply specifically to the human-first philosophy:

### Semantic Color Usage (Revised)

```css
:root {
  /* AI Presence Indicators — SMALL, never large cards */
  --iw-ai-whisper: rgba(59, 130, 246, 0.08); /* Subtle background tint */
  --iw-ai-indicator: #3b82f6; /* 8px dot, not badge */
  --iw-ai-hover: #2563eb; /* Hover state only */

  /* Confidence — DOTS, not scores. Never displayed as text by default. */
  --iw-confidence-high: #22c55e; /* ≥0.85 — 8px green dot */
  --iw-confidence-medium: #f59e0b; /* 0.70–0.85 — 8px yellow dot */
  --iw-confidence-low: #ef4444; /* <0.70 — 8px red dot */
  --iw-confidence-none: #cbd5e1; /* No AI data — no dot, or gray dot */

  /* Human Action Colors — unchanged, always prominent */
  --iw-human-action: #2563eb; /* Primary buttons, human actions */
  --iw-human-success: #22c55e; /* Human completed action */

  /* AI Proposal Toast — bottom of screen, ephemeral */
  --iw-proposal-bg: #f8fafc; /* Neutral surface, not AI blue */
  --iw-proposal-border: #e2e8f0; /* Subtle border */
  --iw-proposal-text: #334155; /* Neutral text, not primary blue */
}
```

### AI Indicator Spec (New)

```css
/* AI AMBIENT INDICATOR — the primary AI presence in the workbench */
.ai-ambient-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  margin-left: 8px;
  /* No text. No label. Just a dot. */
}

.ai-ambient-dot.high {
  background: var(--iw-confidence-high);
}
.ai-ambient-dot.medium {
  background: var(--iw-confidence-medium);
}
.ai-ambient-dot.low {
  background: var(--iw-confidence-low);
}
.ai-ambient-dot.none {
  background: var(--iw-confidence-none);
  opacity: 0.5;
}

/* AI ON-DEMAND BUTTON — appears on hover, not by default */
.ai-ask-button {
  opacity: 0;
  transition: opacity 150ms ease;
  /* Revealed on hover of entity row or via keyboard focus */
}
.entity-row:hover .ai-ask-button,
.entity-row:focus-within .ai-ask-button {
  opacity: 1;
}

/* AI PROPOSAL TOAST — bottom of screen, dismissible */
.ai-proposal-toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  max-width: 640px;
  background: var(--iw-surface);
  border: 1px solid var(--iw-proposal-border);
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: var(--shadow-lg);
  z-index: 50;
  /* Ephemeral. Auto-dismiss after 30s unless hovered. */
}
```

### Typography Additions

```css
/* AI Whisper Text — the smallest, lightest text for AI context */
--text-ai-whisper: 0.6875rem; /* 11px — smaller than captions */
--text-ai-whisper-color: var(--iw-neutral-400);
--text-ai-whisper-weight: 400;
```

---

## 1. User Workbench

### 1.1 Overview

The User Workbench is the **human's primary working surface**. It is where users perform actual work on unified data without switching contexts. The workbench is **human-first by default** — AI is present only as a subtle, ambient layer that the user can invoke when needed.

**User Journey Position:** Step 3 (WORK) of the 6-step flow: CONNECT → HYDRATE → **WORK** → AI → MEMORY → REPEAT.

**Core Principles (Human-First):**

- One workbench. All tools. One truth. No tab switching.
- The default view is **human-only**: clean entity list, clear data, human actions.
- AI is **ambient**: a subtle colored dot on entities, nothing more.
- AI is **on-demand**: hover an entity → "Ask AI about this" appears. Click → AI panel slides in.
- AI proposals are **toasts**: bottom-of-screen, dismissible, ephemeral. Never a sidebar.
- Every action is governed and audited. The human is always in control.

---

### 1.2 Before / After Comparison

| Aspect             | BEFORE (AI-First)                                                     | AFTER (Human-First)                                                                      |
| ------------------ | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **Right Sidebar**  | Lead Intelligence panel (320px) with AI scores, enrichment, reasoning | Action Panel (320px) with human Quick Actions only. No AI content.                       |
| **Bottom Bar**     | Twin Enrichment Bar (48px) always visible with AI suggestions         | Removed. AI proposals appear as bottom toasts only when needed.                          |
| **AI on Entities** | Large confidence badges ("0.92"), score cards, AI labels              | 8px colored dot (green/yellow/red). No number. No label.                                 |
| **AI Invocation**  | AI Overlay always available via floating bubble                       | "Ask AI" button on hover. AI panel slides in. Dismiss to close.                          |
| **AI Proposals**   | Proposal cards in sidebar with "Approve/Modify/Dismiss"               | Toast at bottom: "AI suggests: [action] [Why?] [Dismiss] [Do it]"                        |
| **Memory Panel**   | Bottom drawer showing "What the system knows"                         | Bottom drawer showing "What I know about this entity" — human-curated notes + AI toggle. |
| **Default Feel**   | AI dashboard                                                          | Human workbench                                                                          |

---

### 1.3 Layout / Wireframe Description

```
┌──────────────────────────────────────────────────────────────┐
│  TOP BAR (64px) — Human-First. No AI clutter.             │
│  ┌────┐ ┌────────────────────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ │
│  │ IW │ │ Search...     ⌘K   │ │ 🔔 │ │ 💬 │ │ 👤 │ │ ⚙️ │ │
│  └────┘ └────────────────────┘ └────┘ └────┘ └────┘ └────┘ │
├──────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌────────────────────┐  ┌────────────────┐ │
│  │ ENTITY   │  │   DETAIL PANE        │  │ ACTION PANEL   │ │
│  │ EXPLORER │  │   (Human data only)  │  │ (Human actions)│ │
│  │ (240px)  │  │                      │  │                │ │
│  │ ● Acme   │  │  Acme Corporation    │  │ • Email        │ │
│  │ ● Widget │  │  [traits][timeline]  │  │ • Call         │ │
│  │ ○ Unknown│  │                      │  │ • Task         │ │
│  │ [Ask AI] │  │  [Ask AI → opens     │  │ [Ask AI]       │ │
│  │ on hover │  │   AI panel]          │  │                │ │
│  └──────────┘  └────────────────────┘  └────────────────┘ │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  MEMORY PANEL: My Notes (primary) + AI toggle        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌────────────────────────────────────────────────────┐  │
│  │  AI suggests: Update renewal. [Why?] [Dismiss] [Do]│  │
│  └────────────────────────────────────────────────────┘  │
│  ─ Toast: bottom, center, dismissible, ephemeral ──       │
└──────────────────────────────────────────────────────────────┘
```

**Entity Explorer with AI Ambient Dots:**

```
┌─────────────────────────────┐
│  Accounts (42)              │
│  ┌────────────────────────┐   │
│  │ ● Acme Corporation     │   │  ← green dot = high confidence AI data
│  │   [Industry: SaaS]     │   │
│  │   [Ask AI] ← on hover  │   │
│  └────────────────────────┘   │
│  ┌────────────────────────┐   │
│  │ ● Widget Co            │   │  ← yellow dot = medium confidence
│  │   [Industry: Hardware] │   │
│  │   [Ask AI] ← on hover  │   │
│  └────────────────────────┘   │
│  ┌────────────────────────┐   │
│  │ ○ Unknown Corp         │   │  ← gray dot = no AI data yet
│  │   [Industry: —]        │   │
│  │   [Ask AI] ← on hover  │   │
│  └────────────────────────┘   │
└─────────────────────────────┘
```

**AI On-Demand Panel (slides in when user clicks "Ask AI"):**

```
┌────────────────────────────────────────┐
│  ASK AI PANEL (400px, slides right)    │
│  ┌────────────────────────────────┐    │
│  │  About: Acme Corporation  [✕]  │    │
│  └────────────────────────────────┘    │
│  ┌────────────────────────────────┐    │
│  │  AI INSIGHTS (only when asked) │    │
│  │  Confidence: High (0.92)       │    │
│  │  Sentiment: Positive (0.72)    │    │
│  │  Key topics: renewal, pricing   │    │
│  │  Suggested: • Send follow-up   │    │
│  │             • Review tickets   │    │
│  └────────────────────────────────┘    │
│  ┌────────────────────────────────┐    │
│  │  Ask a question...        [Send]│   │
│  └────────────────────────────────┘    │
│  ─ Closes when dismissed. No AI    │
│    persists in main view.              │
└────────────────────────────────────────┘
```

---

### 1.4 Key UI Components (Human-First)

#### 1.4.1 Top Navigation Bar (Revised)

```typescript
interface TopBarProps {
  tenant: { name: string; logo?: string };
  user: { displayName: string; avatar?: string; role: Role };
  projection: ProjectionType;
  notificationCount: number;
  onSearchFocus: () => void;
  onCommandPalette: () => void;
  onAskAI: () => void; // NEW: opens AI Home panel
}
```

**Visual Spec (Human-First):**

- Height: `64px` (`h-16`)
- Background: `--iw-surface` with `border-b border-neutral-200`
- Left: IntegrateWise logo + tenant name (unchanged)
- Center: Universal search bar (unchanged)
- Right cluster (gap-2):
  - Notification bell: unchanged
  - **"Ask AI" button** (replaces Twin sparkle icon): `text-sm text-primary-600 hover:text-primary-700 bg-primary-50 rounded-lg px-3 py-1.5 flex items-center gap-2`
    - Icon: `message-circle` or `sparkles` (subtle, not robot)
    - Label: "Ask AI" (not "Twin")
    - No pulse. No animation. Static button.
    - Click: opens AI Home panel (slide-in from right, not overlay)
  - User avatar: unchanged
  - Settings gear: unchanged

**Rationale:** The sparkle icon suggested the AI was "always on" and "watching." The "Ask AI" button makes it clear: the AI is a tool you invoke. The robot avatar is removed entirely from the workbench.

---

#### 1.4.2 Entity Explorer (Left Sidebar) — With AI Ambient Dots

```typescript
interface EntityExplorerProps {
  projection: ProjectionType;
  entityTypes: EntityTypeInfo[];
  selectedEntityId?: string;
  recentEntities: RecentEntity[];
  onSelect: (entityId: string) => void;
  onCreate: (entityType: string) => void;
  onAskAI: (entityId: string) => void; // NEW
}

interface RecentEntity {
  id: string;
  name: string;
  type: string;
  aiConfidence: "high" | "medium" | "low" | "none"; // NEW: ambient indicator
  lastModifiedAt: Date;
}
```

**Visual Spec (Human-First):**

- Width: `240px` (`w-60`), collapsible to `64px`
- Background: `--iw-elevated`
- Entity list items (revised):
  - Each row: `flex row items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-100`
  - Name: `text-sm font-medium`
  - **AI Ambient Dot**: `8px circle` (`w-2 h-2 rounded-full`) positioned after the name
    - `high`: `bg-success` (green) — AI has high-confidence data about this entity
    - `medium`: `bg-warning` (yellow) — AI has medium-confidence data
    - `low`: `bg-danger` (red) — AI has low-confidence data or detects a concern
    - `none`: `bg-neutral-300` or absent — no AI data yet
    - **No number.** No "0.92" label. No tooltip on hover. Just a dot.
  - **On hover (or keyboard focus):**
    - "Ask AI" button appears: `opacity-0 → opacity-100`, `text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1`
    - Icon: `message-circle` (`12px`)
    - Label: "Ask AI"
    - Click: opens AI panel for this entity
  - Selected: `bg-primary-50 text-primary-700`, right chevron

**Rationale:** The dot is a subtle status indicator. It says "AI has something to say about this" without saying what. The user can ignore it completely. If they want to know more, they hover and click "Ask AI." The number is hidden because the user doesn't need to see a confidence score unless they ask for AI help.

---

#### 1.4.3 Detail Pane (Center) — Human-First

```typescript
interface DetailPaneProps {
  entity: Entity360 | null;
  activeTab: DetailTab;
  onTabChange: (tab: DetailTab) => void;
  onAction: (capability: string, payload: unknown) => void;
  onAskAI: () => void; // NEW: opens AI panel for this entity
}

type DetailTab = "entity360" | "relationships" | "timeline" | "memory" | "audit" | "knowledge";
```

**Visual Spec (Human-First):**

- Fluid width: `flex-1`, min `480px`
- Background: `--iw-surface`
- Entity Header (`80px`):
  - Left: Entity type icon + entity name + SSOC ID (unchanged)
  - **NEW: AI Status Indicator** (subtle, right of name):
    - `8px dot` only. No label. No score.
    - Tooltip on hover (optional): "AI has insights about this entity. Click 'Ask AI' to see."
  - Right: Action dropdown (favorite, share, archive) + status badge + **"Ask AI" button** (`text-xs text-primary-600 bg-primary-50 rounded px-2 py-1`)
- Tab Bar (`44px`, `border-b`): unchanged
- Content area: `p-6`, human data only

**Entity360 Tab Content (Human-First):**

- Traits grid: unchanged
- Relationship mini-map: unchanged
- Timeline: unchanged
- **No AI enrichment cards in the main content area.**
- **No AI scores in the traits grid.**

---

#### 1.4.4 Action Panel (Right Sidebar) — Human Actions Only

```typescript
interface ActionPanelProps {
  entity: Entity360 | null;
  availableCapabilities: CapabilityInfo[];
  governanceStatus: GovernanceStatus | null;
  onExecute: (capability: string, payload: unknown) => void;
  onPropose: (capability: string, payload: unknown) => void;
  onAskAI: () => void; // NEW
}
```

**Visual Spec (Human-First):**

- Width: `320px`, collapsible to `0`
- Background: `--iw-elevated`, `border-l border-neutral-200`
- **Section 1: Quick Actions (human actions only)**
  - Up to 5 most-used capabilities for this entity type
  - Each button: `full-width`, `justify-start`, `gap-3`, icon + label + shortcut
  - Primary action: `bg-primary-600 text-white`
  - Secondary: `bg-white border border-neutral-200`
  - **No AI action buttons.** No "Qualify (AI)" or "Convert (AI)." These are human actions.
- **Section 2: Related Entities** (unchanged)
- **Section 3: Governance Status** (unchanged)
- **Section 4: Ask AI (NEW)**
  - Collapsible section at bottom: `border-t border-neutral-200 pt-4 mt-4`
  - Header: `text-xs uppercase tracking-wide text-neutral-500` — "AI Assistant"
  - Button: `w-full bg-primary-50 text-primary-700 rounded-lg px-3 py-2 text-sm hover:bg-primary-100 flex items-center justify-center gap-2`
    - Icon: `message-circle`
    - Label: "Ask AI about this entity"
  - Click: opens AI panel (slide-in from right)

**Rationale:** The Action Panel is for human actions. AI is separated into its own section at the bottom. The user can expand it if they want AI help, or ignore it entirely.

---

#### 1.4.5 AI On-Demand Panel (NEW — replaces Twin Enrichment Bar + Overlay in Workbench)

```typescript
interface AIOnDemandPanelProps {
  isOpen: boolean;
  entity: Entity360 | null;
  aiInsights: AIInsight[] | null;
  onClose: () => void;
  onAskQuestion: (question: string) => void;
  onAcceptSuggestion: (suggestionId: string) => void;
  onDismissSuggestion: (suggestionId: string) => void;
}

interface AIInsight {
  id: string;
  type: "confidence" | "sentiment" | "topics" | "suggestion" | "alert";
  content: string;
  confidence?: number; // shown as text only inside this panel
  reasoning?: string;
  suggestedAction?: { capability: string; label: string };
}
```

**Visual Spec:**

- Width: `400px` (`w-[400px]`), max `90vw` on mobile
- Position: `fixed right-0 top-0 h-full`, slides in from right
- Background: `bg-white shadow-2xl border-l border-neutral-200`
- Animation: `translate-x-full` → `translate-x-0`, `400ms`, `ease-out`
- Header (`48px`):
  - Left: `message-circle` icon (`20px`, `text-primary-600`) + "Ask AI" (`text-sm font-medium`)
  - Right: `×` close button
- Entity Context (if applicable): `bg-neutral-50 rounded-lg px-3 py-2 text-xs text-neutral-600`
  - "About: Acme Corporation"
- AI Insights Section (scrollable):
  - If entity selected: show AI insights (confidence, sentiment, key topics)
  - Confidence: `text-xs text-neutral-500` — "Confidence: High (0.92)" — **only shown here, not in main view**
  - Sentiment: `text-xs` with subtle emoji or color
  - Key topics: chip list
  - Suggested actions: `flex gap-2 mt-2`
    - Each: `rounded-md bg-primary-50 text-primary-700 px-3 py-1.5 text-xs hover:bg-primary-100`
- Question Input:
  - Text area: `flex-1 bg-neutral-100 rounded-lg px-3 py-2 text-sm`
  - Placeholder: "Ask about this entity..."
  - Send button: `primary` icon button
- Footer: "AI suggestions are optional. You are always in control." — `text-[10px] text-neutral-400`

**Rationale:** This panel is the ONLY place AI intelligence is displayed in the Workbench. It is hidden by default. The user must explicitly open it. When closed, the Workbench is entirely human-focused.

---

#### 1.4.6 AI Proposal Toast (NEW — replaces proposal cards in sidebar)

```typescript
interface AIProposalToastProps {
  proposal: {
    id: string;
    summary: string;
    reasoningTrace?: string;
    suggestedAction: { capability: string; label: string };
  } | null;
  onWhy: () => void; // opens reasoning
  onDismiss: () => void;
  onDoIt: () => void; // routes to governance
}
```

**Visual Spec:**

- Position: `fixed bottom-6 left-1/2 -translate-x-1/2`, `z-50`
- Width: `max-w-[640px]`, `min-w-[400px]`
- Container: `bg-white rounded-xl border border-neutral-200 shadow-xl px-4 py-3 flex items-center gap-4`
- Left: `sparkles` icon (`16px`, `text-neutral-400`) — subtle, not robot
- Center: `text-sm text-neutral-700` — "AI suggests: [summary]"
- Right: `flex gap-2`
  - `Why?`: `text-xs text-primary-600 hover:text-primary-700 underline` — opens reasoning in AI panel
  - `Dismiss`: `text-xs text-neutral-400 hover:text-neutral-600` — closes toast
  - `Do it`: `bg-primary-600 text-white rounded-md px-3 py-1.5 text-xs hover:bg-primary-700` — routes to governance
- Auto-dismiss: `30s` after appear, unless hovered
- Animation: `slide-up + fade`, `300ms`
- Only ONE toast at a time. New proposals replace the old one.

**Rationale:** The toast is ephemeral and non-intrusive. It does not take over the screen. It does not persist. The user can dismiss it without consequence. The "Do it" button is a human action — the user explicitly chooses to act.

---

#### 1.4.7 Memory Panel (Revised — Human-First)

```typescript
interface MemoryPanelProps {
  entity: Entity360 | null;
  humanNotes: HumanNote[]; // NEW: human-curated notes
  aiMemories: MemoryRecord[]; // NEW: separated from human notes
  isOpen: boolean;
  showAIMemories: boolean; // NEW: toggle
  onToggle: () => void;
  onToggleAIMemories: () => void; // NEW
  onAddNote: (note: string) => void; // NEW
}

interface HumanNote {
  id: string;
  content: string;
  createdAt: Date;
  createdBy: string;
}
```

**Visual Spec (Human-First):**

- Collapsible drawer, `200px` open, `0` closed
- Handle: `w-12 h-1 bg-neutral-300 rounded-full mx-auto mt-2`
- Content: `p-4`
- **Section 1: My Notes (human-created, default visible)**
  - Header: `text-xs uppercase tracking-wide text-neutral-500` — "My Notes"
  - Each note: `rounded-lg bg-blue-50 border border-blue-200 p-3 mb-2`
    - Content: `text-sm text-blue-900`
    - Meta: `text-xs text-blue-600 mt-1` — author, date
  - "Add Note" button: `text-xs text-primary-600 hover:text-primary-700`
- **Section 2: AI Memory (hidden by default)**
  - Toggle: `flex items-center gap-2 mt-3 mb-2`
    - Checkbox: `rounded`
    - Label: `text-xs text-neutral-500` — "Show what the AI knows"
  - When checked: AI memory snippets appear
    - Each: `rounded-lg bg-amber-50 border border-amber-200 p-3 mb-2`
    - Content: `text-sm text-amber-900`
    - Meta: `text-xs text-amber-600 mt-1` — source, confidence

**Rationale:** Human notes are primary. AI memory is secondary and hidden by default. The user must explicitly choose to see AI-generated content. This reinforces that the human owns the context.

---

#### 1.4.8 Universal Search Bar (Unchanged)

The Universal Search Bar remains unchanged. It is a human tool for finding data.

---

#### 1.4.9 Command Palette (Revised)

```typescript
interface Command {
  id: string;
  label: string;
  shortcut?: string;
  category: "navigation" | "action" | "projection" | "ai" | "system"; // 'twin' renamed to 'ai'
  icon: string;
  action: () => void;
}
```

**Change:** The "twin" category is renamed to "ai." Commands are:

- "Ask AI about current entity" (not "Open Twin")
- "Go to AI Home" (not "Open Twin chat")

---

### 1.5 Data Flow (Human-First)

```
┌────────────────────────────────────────────────────────────┐
│  TOP BAR: AI Home  [Model ▼] [New Chat] [✕ Close]          │
│  ─ Close returns to Workbench. No AI persists. ──          │
├────────────────────────────────────────────────────────────┤
│  ┌────────┐  ┌────────────────────┐  ┌────────────────┐  │
│  │ HISTORY│  │   CHAT CANVAS        │  │ CONTEXT PANEL  │  │
│  │ (260px)│  │   (centered, fluid)  │  │ (320px)        │  │
│  │        │  │                      │  │                │  │
│  │ Today  │  │  "What would you     │  │ What we're     │  │
│  │ ┌────┐ │  │   like help with?"   │  │ talking about: │  │
│  │ │Brief│ │  │                      │  │ • Entities     │  │
│  │ └────┘ │  │  [Quick starters]    │  │ • Memory       │  │
│  │        │  │  • What did I do?      │  │ • Knowledge    │  │
│  │Yesterday│  │  • Show me last week   │  │                │  │
│  │ ┌────┐ │  │  • Help me build...    │  │ Capabilities   │  │
│  │ │Churn│ │  │                      │  │ [Show ▼]       │  │
│  │ └────┘ │  │  [Messages]            │  │                │  │
│  └────────┘  │  👤 User: "What about  │  └────────────────┘  │
│               │     Acme Corp?"         │                     │
│               │  🤖 AI: "Based on..."   │                     │
│               │  💡 Proposal: "Escalate?│                     │
│               │     [Do it] [Dismiss]   │                     │
│               │                        │                     │
│               │  [Ask anything...] [⬆️] │                     │
│               │  [Capabilities ▼]        │                     │
│               └────────────────────────┘                     │
└────────────────────────────────────────────────────────────┘
```

---

### 1.6 User Interactions (Human-First)

#### Flow: Sales Rep Reviews an Account (Human-First)

| Step | Action                                                           | System Response                              | UI Change                                                                                     |
| ---- | ---------------------------------------------------------------- | -------------------------------------------- | --------------------------------------------------------------------------------------------- |
| 1    | User opens app                                                   | Discovery returns available projections      | Sales projection is active. Clean entity list. No AI clutter.                                 |
| 2    | User sees account list                                           | Entity list loaded with AI confidence dots   | "Acme Corp" has a green dot. "Widget Co" has a yellow dot. No scores. No labels.              |
| 3    | User clicks "Acme Corp"                                          | Entity360 assembled. Human notes loaded.     | Detail pane shows account data. No AI panel. No enrichment bar.                               |
| 4    | User hovers "Acme Corp" in list                                  | —                                            | "Ask AI" button appears. User ignores it.                                                     |
| 5    | User clicks "Ask AI" in Action Panel                             | Twin-orchestrator DO queried on-demand       | AI panel slides in. Shows: confidence 0.92, sentiment positive, key topics: renewal, pricing. |
| 6    | User reads AI insights, clicks "Send follow-up email" suggestion | Capability invocation routed through Hermes  | AI panel closes. Toast appears: "AI suggests: Send follow-up email. [Why?] [Dismiss] [Do it]" |
| 7    | User clicks "Do it"                                              | Governance pre-check: 0.92 ≥ 0.85 → executes | Toast updates: "Done. Email sent." Fades after 3s.                                            |
| 8    | User switches to CS projection (`2` key)                         | Same account, CS lens applied                | Detail pane shows: health score, support tickets, NPS. No AI clutter.                         |
| 9    | User clicks Memory Panel handle                                  | Drawer opens                                 | "My Notes" section visible. "Show what the AI knows" toggle unchecked.                        |
| 10   | User clicks AI toggle                                            | AI memory fetched from continuity            | AI memory snippets appear below human notes.                                                  |

---

### 1.7 States (Human-First)

#### Empty States

| State                     | Visual Treatment                                                                   | Action                         |
| ------------------------- | ---------------------------------------------------------------------------------- | ------------------------------ |
| **No entity selected**    | Detail pane: centered illustration + "Select an entity to begin"                   | Show recent + popular entities |
| **No connected tools**    | Entity Explorer: "Connect your first tool" CTA                                     | Prompt to CONNECT step         |
| **No search results**     | Search: "No results for 'X'" + "Did you mean?"                                     | Offer fuzzy match + create     |
| **No AI insights**        | AI panel: "No AI insights yet. Ask a question to get started."                     | Prompt to ask question         |
| **No human notes**        | Memory panel: "No notes yet. Add a note to remember context."                      | Prompt to add note             |
| **No AI memory**          | AI toggle in Memory Panel: "The AI hasn't accumulated memory for this entity yet." | Inform + reassure              |
| **AI proposal dismissed** | Toast disappears. No persistent record.                                            | Silent — no UI for absence     |

#### Loading States

| Component         | Loading Indicator                  | Duration Expectation |
| ----------------- | ---------------------------------- | -------------------- |
| Entity list       | Skeleton rows                      | <200ms (KV)          |
| Entity360         | Skeleton cards + shimmer on header | <2s                  |
| AI panel          | Skeleton + "Asking AI..."          | <3s                  |
| AI proposal toast | Inline spinner on "Do it" button   | <2s                  |

#### Error States

| Error                    | Visual Treatment                       | Recovery                |
| ------------------------ | -------------------------------------- | ----------------------- |
| **AI panel failed**      | "Could not reach AI. Try again later." | Retry button            |
| **AI proposal rejected** | Toast: "Action declined."              | User can retry manually |
| **Network error**        | Toast: "Connection lost. Retrying..."  | Auto-retry              |

---

### 1.8 Accessibility (Human-First)

| Requirement                 | Implementation                                                                                                 |
| --------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **AI Ambient Dot**          | `aria-label="AI has high confidence data for this entity"` (or medium/low). Dot is `role="img"`.               |
| **"Ask AI" button (hover)** | `aria-label="Ask AI about [entity name]"`. Focusable via keyboard (Tab to entity row, then Tab to Ask AI).     |
| **AI On-Demand Panel**      | `aria-label="AI Assistant panel"`. `aria-hidden="true"` when closed. Focus trap when open.                     |
| **AI Proposal Toast**       | `aria-live="polite"` so proposals are announced. `aria-label="AI suggestion: [summary]"`.                      |
| **Memory Panel Toggle**     | `aria-label="Show AI-generated memory"`. `aria-expanded` when checked.                                         |
| **Screen reader flow**      | Entity list: "Acme Corporation, AI status high, button Ask AI." User can skip AI entirely.                     |
| **Keyboard navigation**     | Tab cycles: Entity list → Ask AI (if visible) → Detail pane → Action Panel → Ask AI section. No AI panel trap. |
| **Reduced motion**          | AI panel slide becomes instant appear. Toast fade becomes instant.                                             |

---

### 1.9 Responsive Behavior (Human-First)

| Breakpoint              | Layout                                      | AI Behavior                                                                            |
| ----------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------- |
| **Desktop (≥1280px)**   | Full 3-column + AI panel as slide-in drawer | AI panel: 400px right drawer. Toast: centered bottom.                                  |
| **Tablet (768–1279px)** | 2-column. Action panel as overlay.          | AI panel: full-screen overlay. Toast: bottom center.                                   |
| **Mobile (<768px)**     | Single column.                              | AI panel: full-screen modal. Toast: bottom, full-width. "Ask AI" button in bottom nav. |

---

## 2. Overlay (Notification Layer)

### 2.1 Overview

The Overlay is **not a persistent AI assistant.** It is a **notification and suggestion layer** that appears only when something genuinely needs attention. It carries the Twin's 5 communication channels (Proposals, Notifications, Morning Briefing, Workbench Enrichment, Direct Messaging) but in a human-first form: ephemeral, dismissible, and non-dominant.

**User Journey Position:** Cross-cutting. Present only when the user has enabled notifications or when something requires attention.

**Core Principles (Human-First):**

- **Not an AI chat.** No persistent AI avatar. No message stream.
- **Floating dot only when attention needed.** Not always visible.
- **Expands to show prioritized human tasks.** "3 things need your attention today."
- **Every message is dismissible.** No persistent AI presence.
- **Non-blocking.** Work continues underneath.

---

### 2.2 Before / After Comparison

| Aspect                 | BEFORE (AI-First)                                                         | AFTER (Human-First)                                                                                               |
| ---------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Floating Bubble**    | Robot avatar (`🤖`) always visible, bottom-right. Pulses with unread.     | **Attention dot only.** Small colored dot (8px) appears only when something needs attention. No avatar. No robot. |
| **Expanded Panel**     | Full AI chat interface with message stream, input bar, capability buttons | **Task list.** "3 things need attention." Human clicks to see each. No chat. No AI avatar.                        |
| **Message Stream**     | Reverse chronological AI messages (proposals, notifications, twin chat)   | **Prioritized task cards.** Each card: "Salesforce sync complete" or "Proposal needs review." No chat history.    |
| **Input Bar**          | "Ask the Twin anything..." with voice input, capability buttons           | **Removed.** No chat input. The Overlay is read-only notifications. To talk to AI, go to AI Home.                 |
| **Context Chip**       | "📁 Acme Corp → What would you like to do?"                               | **Removed.** The Overlay is not context-aware. It is a notification list.                                         |
| **Capability Buttons** | 📧 Email 📞 Call 📋 Task 🔗 Link in input bar                             | **Removed.** No capability invocation from Overlay. Go to Workbench for actions.                                  |
| **Morning Briefing**   | Full briefing card inside Overlay                                         | **Briefing notification.** "Your morning briefing is ready. [View]" — opens AI Home.                              |

---

### 2.3 Layout / Wireframe Description

```
┌────────────────────────────────────────────────────────────┐
│  WORKBENCH CONTENT — No AI overlay, no panels.             │
│                                                            │
│  [ATTENTION DOT — 16px, bottom-right, only when needed]    │
│  ┌─────┐                                                   │
│  │  ●  │  ← Red: proposal. Yellow: warning. Blue: info.    │
│  └─────┘     Hidden when nothing needs attention.          │
│                                                            │
│  [ATTENTION LIST — slides up from bottom]                 │
│  ┌────────────────────────────────────────────────────┐   │
│  │  3 things need attention        [Dismiss all]      │   │
│  │  ┌────────────────────────────────────────────┐    │   │
│  │  │ ⚠️ Proposal: "Update renewal date"         │    │   │
│  │  │    [Review] [Dismiss]                        │    │   │
│  │  └────────────────────────────────────────────┘    │   │
│  │  ┌────────────────────────────────────────────┐    │   │
│  │  │ ✅ Sync completed — 1,247 records         │    │   │
│  │  │    [View] [Dismiss]                          │    │   │
│  │  └────────────────────────────────────────────┘    │   │
│  │  ┌────────────────────────────────────────────┐    │   │
│  │  │ 📊 Morning briefing ready                  │    │   │
│  │  │    [Open in AI Home] [Dismiss]             │    │   │
│  │  └────────────────────────────────────────────┘    │   │
│  └────────────────────────────────────────────────────┘   │
│  No chat. No input bar. No AI avatar. Read-only.         │
└────────────────────────────────────────────────────────────┘
```

---

### 2.4 Key UI Components (Human-First)

#### 2.4.1 Attention Dot (Replaces Floating Bubble)

```typescript
interface AttentionDotProps {
  hasAttention: boolean;
  priority: "none" | "info" | "warning" | "proposal";
  unreadCount: number; // for accessibility, not visual badge
  onClick: () => void;
}
```

**Visual Spec:**

- Size: `16px` circle (`w-4 h-4`) — **much smaller than 56px bubble**
- Position: `fixed bottom-6 right-6`, `z-50`
- Background: solid color, no icon, no avatar, no border
  - `info`: `bg-primary-500`
  - `warning`: `bg-warning-500`
  - `proposal`: `bg-danger-500`
  - `none`: hidden (`display: none`)
- **No unread badge.** No number. No pulse animation.
- **No drag.** Fixed position.
- Hover: `scale-110`, `transition-transform duration-150`
- Click: expands Attention List
- **Absent by default.** Only appears when there is something to attend to.

**Rationale:** The 56px robot bubble was an AI presence. It said "the AI is here, watching." The 16px dot is a status indicator. It says "something needs your attention." The difference is profound: one is an AI avatar, the other is a notification indicator.

---

#### 2.4.2 Attention List (Replaces Overlay Panel)

```typescript
interface AttentionListProps {
  isOpen: boolean;
  items: AttentionItem[];
  onClose: () => void;
  onDismissItem: (itemId: string) => void;
  onActOnItem: (itemId: string, action: string) => void;
}

interface AttentionItem {
  id: string;
  type: "proposal" | "notification" | "briefing" | "warning";
  title: string;
  description: string;
  action?: { label: string; action: string; url?: string };
  dismissible: boolean;
  timestamp: Date;
}
```

**Visual Spec:**

- Position: `fixed bottom-0 left-0 right-0`, slides up from bottom (not side)
- Max height: `480px` or `max-h-[60vh]`
- Background: `bg-white shadow-2xl rounded-t-2xl border-t border-neutral-200`
- Animation: `translate-y-full` → `translate-y-0`, `300ms`, `ease-out`
- Header (`48px`):
  - Left: `bell` icon (`20px`) + "Attention" + count (`text-sm font-medium`)
  - Right: "Dismiss all" (`text-xs text-neutral-400 hover:text-neutral-600`) + `×` close
- Content: scrollable list
  - Each item: `rounded-lg border border-neutral-200 p-3 mb-2`
  - Type icon + title (`text-sm font-medium`) + timestamp (`text-xs text-neutral-400`)
  - Description: `text-xs text-neutral-600 mt-1`
  - Actions: `flex gap-2 mt-2`
    - Primary action: `bg-primary-600 text-white rounded-md px-3 py-1 text-xs`
    - Dismiss: `text-xs text-neutral-400 hover:text-neutral-600`
- Empty: "You're all caught up. Nothing needs your attention." + subtle check icon

**No Input Bar.** No chat. No capability buttons. No AI avatar.

---

#### 2.4.3 Notification Toast (Unchanged)

Toast notifications remain unchanged from v1.0.0. They are ephemeral and human-first by nature.

---

### 2.5 Data Flow (Human-First)

**Inbound (Real-time):**

1. SSE Stream: gateway → client (filtered)
   - ONLY proposals (0.70–0.85) and notifications
   - NO ambient twin messages, chat history, or context enrichment
2. Morning Briefing trigger: continuity service → notification queue
   - "Briefing ready" notification (not full content)

**Outbound (User actions):**

1. Approve/Reject proposal → gateway → govern service → HITL DO
2. Dismiss → client-side (logged to telemetry)
3. Open briefing → navigates to AI Home (not shown in Overlay)

**Removed from Overlay:**

- Twin chat interface (moved to AI Home)
- Message stream, input bar, capability buttons
- Context chip (Overlay is not context-aware)
- Floating robot avatar (replaced with Attention Dot)

---

### 2.6 Accessibility (Human-First)

| Requirement        | Implementation                                                                                                 |
| ------------------ | -------------------------------------------------------------------------------------------------------------- |
| **Attention Dot**  | `aria-label="3 items need attention"` (with count). `role="button"`. Hidden when `hasAttention: false`.        |
| **Attention List** | `aria-label="Attention list"`. `aria-live="polite"` on list container. Each item: `role="listitem"`.           |
| **No Chat**        | No `aria-live` for chat messages. No input bar focus management.                                               |
| **Keyboard**       | `Esc` closes list. `Tab` navigates items. `Enter` activates primary action.                                    |
| **Screen reader**  | "Attention: 3 items. Proposal: Update renewal date for Acme Corp. Button: Review in My Desk. Button: Dismiss." |
| **Motion**         | Sheet slides only if `prefers-reduced-motion: no-preference`. Otherwise instant.                               |

---

## 3. AI Home (Dedicated Chat Space)

### 3.1 Overview

AI Home is **not the primary interface.** It is a **dedicated AI chat space** for when the user WANTS to talk to AI. It is where the user goes to have a conversation, not where the AI lives.

**User Journey Position:** Step 4 (AI) — but ONLY when the user chooses to engage.

**Core Principles (Human-First):**

- **The AI Home is where the AI lives.** The workbench is human-only. The AI Home is AI-only.
- **Accessible on demand.** Via "Ask AI" button in workbench, not default view.
- **Natural language is the primary input.** When the user is here, they want to talk.
- **Every response is grounded.** The AI cites sources. The user can verify.
- **The user can leave.** Close AI Home and return to the human workbench. No AI follows.

---

### 3.2 Before / After Comparison

| Aspect                 | BEFORE (AI-First)                                                    | AFTER (Human-First)                                                                                          |
| ---------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Position**           | Primary destination. User expected to chat with AI as core workflow. | Dedicated space. User goes here intentionally. Not the default.                                              |
| **Navigation**         | Always accessible via floating robot bubble.                         | Accessible via "Ask AI" button in Workbench. No persistent access point.                                     |
| **Context Panel**      | Shows "Current Topic" with entities, memory, knowledge.              | Shows "What we're talking about" — human-curated context, not AI-decided.                                    |
| **Capability Buttons** | Context-aware quick actions always visible.                          | Hidden by default. Expandable if user wants them.                                                            |
| **Model Selector**     | Prominent in top bar.                                                | Collapsed. Default model is fine. User can change if they care.                                              |
| **Proposal Cards**     | Inline in chat with "Approve/Modify/Dismiss".                        | Inline in chat with "Do it / Dismiss" — but proposals are rare. AI Home is for conversation, not governance. |

---

### 3.3 Layout / Wireframe Description

```
┌──────────────────────────────────────────────────────────────┐
│  TOP BAR (64px) — Human-First. No AI clutter.             │
│  ┌────┐ ┌────────────────────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ │
│  │ IW │ │ Search...     ⌘K   │ │ 🔔 │ │ 💬 │ │ 👤 │ │ ⚙️ │ │
│  └────┘ └────────────────────┘ └────┘ └────┘ └────┘ └────┘ │
├──────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌────────────────────┐  ┌────────────────┐ │
│  │ ENTITY   │  │   DETAIL PANE        │  │ ACTION PANEL   │ │
│  │ EXPLORER │  │   (Human data only)  │  │ (Human actions)│ │
│  │ (240px)  │  │                      │  │                │ │
│  │ ● Acme   │  │  Acme Corporation    │  │ • Email        │ │
│  │ ● Widget │  │  [traits][timeline]  │  │ • Call         │ │
│  │ ○ Unknown│  │                      │  │ • Task         │ │
│  │ [Ask AI] │  │  [Ask AI → opens     │  │ [Ask AI]       │ │
│  │ on hover │  │   AI panel]          │  │                │ │
│  └──────────┘  └────────────────────┘  └────────────────┘ │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  MEMORY PANEL: My Notes (primary) + AI toggle        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌────────────────────────────────────────────────────┐  │
│  │  AI suggests: Update renewal. [Why?] [Dismiss] [Do]│  │
│  └────────────────────────────────────────────────────┘  │
│  ─ Toast: bottom, center, dismissible, ephemeral ──       │
└──────────────────────────────────────────────────────────────┘
```

---

### 3.4 Key UI Components (Human-First)

#### 3.4.1 Chat History Sidebar (Unchanged)

The Chat History Sidebar remains functionally unchanged. It is a human tool for navigating past conversations.

---

#### 3.4.2 Chat Canvas (Revised)

```typescript
interface ChatCanvasProps {
  messages: ChatMessage[];
  isGenerating: boolean;
  onRegenerate: (messageId: string) => void;
  onCopy: (text: string) => void;
  onFeedback: (messageId: string, feedback: "good" | "bad") => void;
  onCloseAIHome: () => void; // NEW: return to workbench
}
```

**Visual Spec (Human-First):**

- Centered, `max-w-3xl`, `mx-auto`
- Background: `bg-white`
- User messages: `ml-auto max-w-[80%] bg-primary-600 text-white rounded-2xl rounded-tr-sm px-4 py-3`
- AI messages: `mr-auto max-w-[80%] bg-neutral-50 border border-neutral-200 rounded-2xl rounded-tl-sm px-4 py-3`
- **AI avatar removed.** No robot icon. AI messages are styled as system text, not as a character.
- **Welcome state:** "What would you like help with?" — not "What can I help you with today?" (passive → active user framing)
- **Proposal cards (rare):** inline, `bg-neutral-50 border border-neutral-200 rounded-lg p-3`
  - "AI suggests: [action]"
  - Buttons: `[Do it]` `[Dismiss]`
  - No "Approve/Modify" — this is a chat, not a governance interface. "Do it" routes to governance if needed.

---

#### 3.4.3 Model Selector (Revised — Collapsed by Default)

**Visual Spec (Human-First):**

- Collapsed by default. Top bar shows: "AI" + subtle model name (`text-xs text-neutral-400`)
- Click to expand dropdown. Most users never interact with this.
- Rationale: The model is an implementation detail. The user wants to talk to "AI," not to "GPT-5."

---

#### 3.4.4 Context Panel (Revised — Human-Curated)

```typescript
interface AIContextPanelProps {
  currentTopic: {
    entities: EntityRef[]; // human-selected or human-asked-about
    memory: MemoryCitation[];
    knowledge: KnowledgeChunk[];
  };
  capabilities: CapabilityInfo[]; // collapsed by default
  showCapabilities: boolean; // NEW
  onToggleCapabilities: () => void; // NEW
}
```

**Visual Spec (Human-First):**

- **Section 1: "What we're talking about"** (replaces "Current Topic")
  - Entities: human-selected or from user's question
  - Memory: cited in conversation, human-readable
  - Knowledge: document references
- **Section 2: Capabilities (collapsed by default)**
  - Toggle: `text-xs text-primary-600 flex items-center gap-1`
  - Label: "Show capabilities"
  - When expanded: list of available capabilities, same as v1.0.0
  - Rationale: Capabilities are secondary in a chat. The user is here to talk, not to invoke tools.

---

#### 3.4.5 Capability Invocation Buttons (Revised — Hidden by Default)

**Visual Spec (Human-First):**

- Collapsed by default. "Show capabilities" toggle above input bar.
- When expanded: same pill-style buttons as v1.0.0
- Rationale: The AI should understand the user's intent from natural language. Capability buttons are a shortcut, not a primary interface.

---

### 3.5 Accessibility (Human-First)

| Requirement       | Implementation                                                                     |
| ----------------- | ---------------------------------------------------------------------------------- |
| **Close button**  | `aria-label="Close AI Home and return to Workbench"`. Focus visible.               |
| **AI messages**   | `aria-label="AI response: [truncated content]"`. No "Twin said."                   |
| **No AI avatar**  | No `aria-label` for robot icon. Messages are text, not character dialogue.         |
| **Context panel** | `aria-label="Conversation context"`. Capabilities toggle: `aria-expanded`.         |
| **Keyboard**      | `Esc` closes AI Home (returns to Workbench). `Enter` sends. `Shift+Enter` newline. |
| **Screen reader** | "AI Home. Chat with 5 messages. Input: Ask anything." Not "Twin interface."        |

---

## 4. Capability Fabric

### 4.1 Overview

The Capability Fabric is the **"what can I do?" layer**. In the human-first model, the human browses capabilities. The AI does not recommend. The human discovers.

**User Journey Position:** Post-CONNECT (Step 1), pre-WORK (Step 3).

**Core Principles (Human-First):**

- **Human browses capabilities.** The catalog is organized for human discovery.
- **AI suggestion is ONE subtle chip.** "You might also like..." — not a panel, not a banner.
- **Human clicks to explore.** Not AI pushing.
- **No AI scores on capability cards.** Usage count is human-relevant. Confidence is governance-internal.
- **Try it: human executes.** Not "AI executes for you."

---

### 4.2 Before / After Comparison

| Aspect                  | BEFORE (AI-First)                                          | AFTER (Human-First)                                                                  |
| ----------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **Capability Cards**    | Show `Conf: 0.92` badge prominently                        | No confidence badge. Show `Used: 42×` only.                                          |
| **AI Category**         | "[AI]" filter chip prominently displayed                   | "[AI]" chip present but not prioritized. Same weight as Sales, Finance.              |
| **AI Capability Cards** | `twin.analyze`, `twin.propose` as first-class cards        | Same cards, but no special styling. No "AI-powered" badges.                          |
| **AI Recommendations**  | "Recommended for you" section with AI-curated capabilities | **ONE chip** at top: "You might also like: [capability]" — dismissible.              |
| **Detail Drawer**       | Shows confidence stats, audit trail                        | No confidence stats. Shows: description, parameters, permissions, human usage stats. |

---

### 4.3 Layout / Wireframe Description

```
┌──────────────────────────────────────────────────────────────┐
│  TOP BAR (64px) — Human-First. No AI clutter.             │
│  ┌────┐ ┌────────────────────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ │
│  │ IW │ │ Search...     ⌘K   │ │ 🔔 │ │ 💬 │ │ 👤 │ │ ⚙️ │ │
│  └────┘ └────────────────────┘ └────┘ └────┘ └────┘ └────┘ │
├──────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌────────────────────┐  ┌────────────────┐ │
│  │ ENTITY   │  │   DETAIL PANE        │  │ ACTION PANEL   │ │
│  │ EXPLORER │  │   (Human data only)  │  │ (Human actions)│ │
│  │ (240px)  │  │                      │  │                │ │
│  │ ● Acme   │  │  Acme Corporation    │  │ • Email        │ │
│  │ ● Widget │  │  [traits][timeline]  │  │ • Call         │ │
│  │ ○ Unknown│  │                      │  │ • Task         │ │
│  │ [Ask AI] │  │  [Ask AI → opens     │  │ [Ask AI]       │ │
│  │ on hover │  │   AI panel]          │  │                │ │
│  └──────────┘  └────────────────────┘  └────────────────┘ │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  MEMORY PANEL: My Notes (primary) + AI toggle        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌────────────────────────────────────────────────────┐  │
│  │  AI suggests: Update renewal. [Why?] [Dismiss] [Do]│  │
│  └────────────────────────────────────────────────────┘  │
│  ─ Toast: bottom, center, dismissible, ephemeral ──       │
└──────────────────────────────────────────────────────────────┘
```

---

### 4.4 Key UI Components (Human-First)

#### 4.4.1 Capability Cards (Revised — No Confidence)

```typescript
interface CapabilityCardProps {
  capability: {
    id: string;
    displayName: string;
    description: string;
    namespace: string;
    icon: string;
    usageCount: number;
    requiresApproval: boolean;
    oodaPhase: string;
  };
  onTry: () => void;
  onDetails: () => void;
}
```

**Visual Spec (Human-First):**

- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4`
- Card: same base styling
- Top row: icon + capability name + URI
- Description: same
- **Stats row (revised):**
  - `Used: N×` only
  - **No `Conf: 0.XX` badge.** Confidence is governance-internal, not user-facing.
- Badge (if requires approval): unchanged
- Actions: `Try It` + `Details`

**Rationale:** Confidence scores are for the governance layer to decide whether an action needs approval. They are not relevant to the human browsing capabilities. The human cares about: what does it do, how do I use it, has my team used it.

---

#### 4.4.2 AI Suggestion Chip (NEW — Replaces AI Recommendation Panel)

```typescript
interface AISuggestionChipProps {
  suggestion: {
    capabilityId: string;
    capabilityName: string;
    reason: string; // e.g., "You use Salesforce often"
  } | null;
  onExplore: () => void;
  onDismiss: () => void;
}
```

**Visual Spec:**

- Single row: `flex items-center gap-3 bg-neutral-50 rounded-lg border border-neutral-200 px-4 py-2 mb-4`
- Left: `sparkles` icon (`14px`, `text-neutral-400`) — subtle, not robot
- Center: `text-sm text-neutral-600`
  - "You might also like: **Analyze Sentiment**"
  - `text-xs text-neutral-400 mt-0.5` — "Based on your connected tools"
- Right: `flex gap-2`
  - `Explore`: `text-xs text-primary-600 hover:text-primary-700`
  - `Dismiss`: `text-xs text-neutral-400 hover:text-neutral-600` (`×`)
- Dismissed: removed from DOM. Not shown again this session.
- **Only ONE chip at a time.** No carousel. No banner. No panel.

**Rationale:** One chip is a whisper. A panel is a shout. The human is browsing capabilities. The AI can suggest one. The human can take it or leave it.

---

### 4.5 Accessibility (Human-First)

| Requirement            | Implementation                                                                                       |
| ---------------------- | ---------------------------------------------------------------------------------------------------- |
| **AI Suggestion Chip** | `aria-live="polite"` on appear. `aria-label="AI suggestion: You might also like Analyze Sentiment."` |
| **Capability cards**   | `aria-label="Capability: [name]. [description]. Used [N] times."`                                    |
| **No confidence**      | No `aria-label` for confidence scores. Not present.                                                  |
| **Keyboard**           | `Tab` navigates cards. `Enter` opens details. `Esc` closes drawer.                                   |

---

## 5. Ingress (UI Entry Points)

### 5.1 Overview

Ingress is the front door. In the human-first model, the human connects tools. The AI only appears after connection, and even then, it is opt-in.

**User Journey Position:** Step 1 (CONNECT).

**Core Principles (Human-First):**

- **Human connects tools.** One-click auth. Clean, simple. No AI involvement.
- **AI only appears after connection.** "Your data is being synced. Ask AI to analyze it when ready." — opt-in.
- **No AI setup assistant.** No "AI will configure this for you." The human configures.
- **No AI recommendations during onboarding.** "Connect your tools first. Then explore what you can do."

---

### 5.2 Before / After Comparison

| Aspect              | BEFORE (AI-First)                                                  | AFTER (Human-First)                                                                    |
| ------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| **Onboarding**      | "Connect Salesforce and the AI will analyze your pipeline."        | "Connect Salesforce to see your data in one place."                                    |
| **Post-Connection** | "AI is analyzing your data..." with progress + AI insights preview | "Your data is syncing. You'll see it in your workbench shortly."                       |
| **MCP Connection**  | "Your AI assistant can discover and invoke all your tools."        | "Connect your AI assistant to use tools via chat." (AI is the consumer, not the host.) |
| **First Sync**      | Toast: "AI analyzed 1,247 records. 3 insights found."              | Toast: "Salesforce connected. 1,247 records synced."                                   |
| **AI Suggestion**   | "Ask AI to analyze your data now" button prominently displayed     | "Ask AI" button available but not emphasized. User can explore data first.             |

---

### 5.3 Post-Connection Screen (Revised)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  "Salesforce Connected"                                                      │
│                                                                             │
│  ✓  OAuth authorized                                                         │
│  ✓  Credentials stored securely                                            │
│  →  Sync in progress...  (1,247 / 1,247 records)                            │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  WHAT HAPPENS NEXT                                                   │   │
│  │                                                                      │   │
│  │  1. Your data appears in the workbench.                              │   │
│  │  2. You can browse, edit, and act on your data.                      │   │
│  │  3. When you're ready, ask the AI to help analyze or suggest actions.│   │
│  │                                                                      │   │
│  │  [Go to Workbench]  [Ask AI to Analyze] ← secondary, not primary     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─── NO "AI IS ANALYZING" SPINNER WITH LIVE INSIGHTS PREVIEW ───          │
│  ─── NO "3 INSIGHTS FOUND" BADGE ───                                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 5.4 Accessibility (Human-First)

| Requirement         | Implementation                                                         |
| ------------------- | ---------------------------------------------------------------------- |
| **Post-connection** | `aria-live="polite"` on sync progress. "Sync complete. 1,247 records." |
| **Ask AI button**   | `aria-label="Ask AI to analyze your connected data. Optional."`        |
| **Onboarding**      | No AI mentions in screen reader primary path. "Connect your tools."    |

---

## 6. Audit Logs (Transparency Layer)

### 6.1 Overview

The Audit Logs interface is the "what happened?" transparency layer. In the human-first model, the human reviews their own actions by default. AI actions are a separate, toggleable view.

**User Journey Position:** Cross-cutting.

**Core Principles (Human-First):**

- **Human is the protagonist of their own audit log.** Default view: "What did I do today?"
- **AI actions are separate.** Toggle: "What did the AI do today?" — not mixed.
- **Transparent, but not intrusive.** AI actions are logged, but they don't dominate the view.
- **Human actions are primary.** AI actions are secondary.

---

### 6.2 Before / After Comparison

| Aspect               | BEFORE (AI-First)                                                                     | AFTER (Human-First)                                                                  |
| -------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **Default View**     | Mixed timeline: human actions + AI proposals + system events                          | **Human actions only.** "What did I do today?"                                       |
| **Actor Filter**     | "All" selected by default. User can filter to "twin" or "user."                       | "Human" selected by default. User can toggle to "AI" or "All."                       |
| **Timeline Events**  | AI proposals shown prominently with confidence badges                                 | AI proposals shown only when AI filter is on. No confidence badges in main view.     |
| **Visual Hierarchy** | AI actions (blue, robot icon) given equal weight to human actions (gray, person icon) | Human actions (primary color, prominent). AI actions (muted, secondary).             |
| **Detail Drawer**    | Shows full AI reasoning trace, governance decision                                    | Shows human action details by default. AI reasoning trace under "AI Details" toggle. |

---

### 6.3 Layout / Wireframe Description

```
┌──────────────────────────────────────────────────────────────┐
│  TOP BAR (64px) — Human-First. No AI clutter.             │
│  ┌────┐ ┌────────────────────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ │
│  │ IW │ │ Search...     ⌘K   │ │ 🔔 │ │ 💬 │ │ 👤 │ │ ⚙️ │ │
│  └────┘ └────────────────────┘ └────┘ └────┘ └────┘ └────┘ │
├──────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌────────────────────┐  ┌────────────────┐ │
│  │ ENTITY   │  │   DETAIL PANE        │  │ ACTION PANEL   │ │
│  │ EXPLORER │  │   (Human data only)  │  │ (Human actions)│ │
│  │ (240px)  │  │                      │  │                │ │
│  │ ● Acme   │  │  Acme Corporation    │  │ • Email        │ │
│  │ ● Widget │  │  [traits][timeline]  │  │ • Call         │ │
│  │ ○ Unknown│  │                      │  │ • Task         │ │
│  │ [Ask AI] │  │  [Ask AI → opens     │  │ [Ask AI]       │ │
│  │ on hover │  │   AI panel]          │  │                │ │
│  └──────────┘  └────────────────────┘  └────────────────┘ │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  MEMORY PANEL: My Notes (primary) + AI toggle        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌────────────────────────────────────────────────────┐  │
│  │  AI suggests: Update renewal. [Why?] [Dismiss] [Do]│  │
│  └────────────────────────────────────────────────────┘  │
│  ─ Toast: bottom, center, dismissible, ephemeral ──       │
└──────────────────────────────────────────────────────────────┘
```

---

### 6.4 Key UI Components (Human-First)

#### 6.4.1 Actor Filter (Revised — Human Default)

```typescript
interface AuditFilterBarProps {
  filters: {
    actor?: "human" | "ai" | "system" | "all"; // NEW: human-first enum
    action?: string[];
    via?: string[];
    entityId?: string;
    dateRange?: { start: Date; end: Date };
  };
  onFilterChange: (filters: AuditFilterBarProps["filters"]) => void;
}
```

**Visual Spec (Human-First):**

- Actor dropdown: default selection is "Human"
- Options: Human, AI, System, All
- When "Human" is selected: only `user:*` actors shown
- When "AI" is selected: only `twin`, `agent:*` actors shown
- When "All" is selected: all actors shown, but human actions are styled prominently

---

#### 6.4.2 Timeline View (Revised — Human Prominent)

**Visual Spec (Human-First):**

- Vertical timeline with left gutter
- **Human actions:**
  - Dot: `10px circle`, `bg-primary-500` (blue, prominent)
  - Actor badge: `bg-primary-100 text-primary-700` — "alice@acme"
  - Card: `bg-white rounded-lg border border-neutral-200 p-4`
- **AI actions:**
  - Dot: `10px circle`, `bg-neutral-300` (gray, muted)
  - Actor badge: `bg-neutral-100 text-neutral-500` — "AI" (not "twin")
  - Card: `bg-neutral-50 rounded-lg border border-neutral-200 p-4` — slightly muted background
- **System actions:**
  - Dot: `10px circle`, `bg-neutral-200`
  - Actor badge: `bg-neutral-100 text-neutral-400` — "system"
  - Card: same as AI

**Rationale:** The visual hierarchy says "human actions matter most." AI actions are logged and visible, but they don't compete with human actions for attention.

---

#### 6.4.3 Audit Detail Drawer (Revised — Human Default)

**Visual Spec (Human-First):**

- Drawer: `w-[520px]`, slides from right
- **Default view:** Human action details (capability, input, output)
- **Toggle: "Show AI reasoning trace"** (only if AI was involved in this event)
  - Unchecked by default
  - When checked: expands to show AI reasoning, confidence, governance decision
- **Rationale:** The human is investigating their own action. AI details are secondary. They can expand them if they want to understand the AI's role.

---

### 6.5 Accessibility (Human-First)

| Requirement             | Implementation                                                                                                                     |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Actor filter**        | `aria-label="Filter by actor. Default: Human."`                                                                                    |
| **Timeline**            | Human events: `aria-label="Alice updated renewal date for Acme Corp."`. AI events: `aria-label="AI proposed update renewal date."` |
| **AI reasoning toggle** | `aria-label="Show AI reasoning trace. Hidden by default."` `aria-expanded="false"`.                                                |
| **Screen reader**       | Default announcement: "Showing 12 human actions. Toggle to see AI actions."                                                        |

---

## 7. Browser Automation

### 7.1 Overview

Browser Automation is the workflow studio. In the human-first model, the human builds workflows. The AI suggests — once, and only if asked.

**User Journey Position:** Operations (Ops) projection primarily.

**Core Principles (Human-First):**

- **Human builds workflows.** Visual builder. Human drags, drops, configures.
- **AI suggests once.** "You do this sequence often. Want to save it?" — one-time, dismissible.
- **Human approves, edits, owns.** The workflow is the human's creation.
- **No AI workflow generation.** No "AI will build this for you."

---

### 7.2 Before / After Comparison

| Aspect                  | BEFORE (AI-First)                                                    | AFTER (Human-First)                                                      |
| ----------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **Recording Mode**      | AI suggests next steps during recording                              | Human records. AI is silent.                                             |
| **Post-Recording**      | AI suggests: "I noticed you do X → Y → Z. Want to save as workflow?" | Same suggestion, but ONE time. Not persistent. Dismissible.              |
| **Workflow Suggestion** | AI proposes full workflow with explanation                           | AI proposes: "Save this sequence?" with human naming.                    |
| **Workflow Library**    | AI-suggested workflows in separate "AI Proposed" folder              | No special folder. Suggested workflows go to "My Workflows" if accepted. |
| **Trigger Config**      | "AI-proposed" trigger type with confidence slider                    | **Removed.** No AI trigger type. Human sets triggers.                    |

---

### 7.3 Layout / Wireframe Description

```
┌──────────────────────────────────────────────────────────────┐
│  TOP BAR (64px) — Human-First. No AI clutter.             │
│  ┌────┐ ┌────────────────────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ │
│  │ IW │ │ Search...     ⌘K   │ │ 🔔 │ │ 💬 │ │ 👤 │ │ ⚙️ │ │
│  └────┘ └────────────────────┘ └────┘ └────┘ └────┘ └────┘ │
├──────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌────────────────────┐  ┌────────────────┐ │
│  │ ENTITY   │  │   DETAIL PANE        │  │ ACTION PANEL   │ │
│  │ EXPLORER │  │   (Human data only)  │  │ (Human actions)│ │
│  │ (240px)  │  │                      │  │                │ │
│  │ ● Acme   │  │  Acme Corporation    │  │ • Email        │ │
│  │ ● Widget │  │  [traits][timeline]  │  │ • Call         │ │
│  │ ○ Unknown│  │                      │  │ • Task         │ │
│  │ [Ask AI] │  │  [Ask AI → opens     │  │ [Ask AI]       │ │
│  │ on hover │  │   AI panel]          │  │                │ │
│  └──────────┘  └────────────────────┘  └────────────────┘ │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  MEMORY PANEL: My Notes (primary) + AI toggle        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌────────────────────────────────────────────────────┐  │
│  │  AI suggests: Update renewal. [Why?] [Dismiss] [Do]│  │
│  └────────────────────────────────────────────────────┘  │
│  ─ Toast: bottom, center, dismissible, ephemeral ──       │
└──────────────────────────────────────────────────────────────┘
```

---

### 7.4 Key UI Components (Human-First)

#### 7.4.1 Post-Recording Suggestion (Revised — One-Time, Dismissible)

```typescript
interface PostRecordingSuggestionProps {
  recordedSequence: WorkflowNode[];
  onSave: () => void;
  onDismiss: () => void;
}
```

**Visual Spec:**

- Banner: `bg-neutral-50 rounded-lg border border-neutral-200 px-4 py-3 mb-4 flex items-center gap-3`
- Left: `lightbulb` icon (`16px`, `text-neutral-400`) — not robot, not sparkle
- Center: `text-sm text-neutral-700`
  - "You recorded: Visit → Fill → Click → Screenshot. Want to save this as a reusable workflow?"
- Right: `flex gap-2`
  - `Save`: `bg-primary-600 text-white rounded-md px-3 py-1.5 text-sm`
  - `Dismiss`: `text-neutral-400 hover:text-neutral-600 text-sm`
- Dismissed: never shown again for this recording session.
- **No AI reasoning.** No "I noticed you do this often." Just the sequence.

---

#### 7.4.2 Trigger Configuration (Revised — No AI Trigger)

```typescript
type Trigger =
  | { type: "scheduled"; cron: string; timezone: string }
  | { type: "event"; event: string; condition?: string }
  | { type: "manual" };
// AI_PROPOSED trigger type REMOVED
```

**Rationale:** The human decides when workflows run. The AI does not decide. The human configures triggers. The AI is not a trigger source.

---

### 7.5 Accessibility (Human-First)

| Requirement                   | Implementation                                                                                                   |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Post-recording suggestion** | `aria-live="polite"` on appear. `aria-label="Workflow suggestion: Save recorded sequence as reusable workflow."` |
| **No AI trigger**             | No `aria-label` for AI trigger. Not present.                                                                     |
| **Recording**                 | `aria-live="assertive"` announces "Recording started" / "Recording stopped."                                     |

---

## 8. Workflows

### 8.1 Overview

Workflows are user-defined sequences of actions. In the human-first model, the human creates and runs workflows. The AI is a template suggestion engine, not the runner.

**User Journey Position:** Cross-cutting.

**Core Principles (Human-First):**

- **Human creates and runs workflows.** The workflow is the human's tool.
- **AI is a template suggestion engine.** "I noticed you do X → Y → Z frequently. Save as workflow?" — dismissible.
- **Human edits, names, owns.** The workflow is the human's creation.
- **No AI-proposed workflow tab.** No "AI Proposed" section in the gallery.
- **AI suggestions are toasts, not banners.** One-time, dismissible, ephemeral.

---

### 8.2 Before / After Comparison

| Aspect                 | BEFORE (AI-First)                                             | AFTER (Human-First)                                                              |
| ---------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------ | ----------------------- |
| **View Tabs**          | [My Workflows] [Team] [Marketplace] [AI Proposed]             | [My Workflows] [Team] [Marketplace] — no AI Proposed tab                         |
| **AI Proposed Banner** | Full-width banner with robot icon, confidence, impact metrics | **Toast notification:** "You do X → Y often. Save as workflow? [Save] [Dismiss]" |
| **Workflow Cards**     | AI-proposed workflows marked with 🤖 icon and "AI" badge      | No special AI marking. Workflows are human-created or template-installed.        |
| **Template Gallery**   | AI-curated "Recommended for you" section at top               | Human browses templates. No AI curation. Marketplace search is human-driven.     |
| **Workflow Execution** | "Triggered by: AI" badge on execution dashboard               | "Triggered by: schedule                                                          | manual | event" — no AI trigger. |

---

### 8.3 Layout / Wireframe Description

```
┌──────────────────────────────────────────────────────────────┐
│  TOP BAR (64px) — Human-First. No AI clutter.             │
│  ┌────┐ ┌────────────────────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ │
│  │ IW │ │ Search...     ⌘K   │ │ 🔔 │ │ 💬 │ │ 👤 │ │ ⚙️ │ │
│  └────┘ └────────────────────┘ └────┘ └────┘ └────┘ └────┘ │
├──────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌────────────────────┐  ┌────────────────┐ │
│  │ ENTITY   │  │   DETAIL PANE        │  │ ACTION PANEL   │ │
│  │ EXPLORER │  │   (Human data only)  │  │ (Human actions)│ │
│  │ (240px)  │  │                      │  │                │ │
│  │ ● Acme   │  │  Acme Corporation    │  │ • Email        │ │
│  │ ● Widget │  │  [traits][timeline]  │  │ • Call         │ │
│  │ ○ Unknown│  │                      │  │ • Task         │ │
│  │ [Ask AI] │  │  [Ask AI → opens     │  │ [Ask AI]       │ │
│  │ on hover │  │   AI panel]          │  │                │ │
│  └──────────┘  └────────────────────┘  └────────────────┘ │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  MEMORY PANEL: My Notes (primary) + AI toggle        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌────────────────────────────────────────────────────┐  │
│  │  AI suggests: Update renewal. [Why?] [Dismiss] [Do]│  │
│  └────────────────────────────────────────────────────┘  │
│  ─ Toast: bottom, center, dismissible, ephemeral ──       │
└──────────────────────────────────────────────────────────────┘
```

---

### 8.4 Key UI Components (Human-First)

#### 8.4.1 Workflow Grid (Revised — No AI Badges)

**Visual Spec (Human-First):**

- Same grid layout as v1.0.0
- **No AI badges on workflow cards.** No 🤖 icon. No "AI" label.
- **Trigger badges:** `schedule`, `event`, `manual` — no `ai`
- **Status:** Active, Paused, Error — no "AI-managed"

---

#### 8.4.2 AI Workflow Suggestion Toast (Replaces AI-Proposed Banner)

```typescript
interface AIWorkflowSuggestionToastProps {
  suggestion: {
    id: string;
    observedPattern: string; // e.g., "Update Deal Stage → Send Email → Log Call"
    frequency: number; // e.g., 5× daily
  } | null;
  onSave: () => void;
  onDismiss: () => void;
}
```

**Visual Spec:**

- Same toast styling as AI Proposal Toast (bottom center, dismissible)
- Content: "You do [pattern] [frequency]. Save as a workflow?"
- Actions: `[Save]` `[Dismiss]`
- Auto-dismiss: `30s` unless hovered
- **Only ONE toast.** If user dismisses, not shown again for 7 days.
- **No confidence badge.** No impact metrics. No reasoning trace.

---

#### 8.4.3 Workflow Execution Dashboard (Revised — No AI Trigger)

**Visual Spec (Human-First):**

- Triggered By column: `schedule`, `manual`, `event` — no `ai`
- No AI badge on execution rows
- Human actions are the story

---

### 8.5 Accessibility (Human-First)

| Requirement             | Implementation                                                                                                        |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **AI suggestion toast** | `aria-live="polite"` on appear. `aria-label="Workflow suggestion: You do Update Deal Stage often. Save as workflow?"` |
| **Workflow cards**      | `aria-label="Workflow: Deal Stage Sync. Trigger: Event. Status: Active."` — no AI mention.                            |
| **No AI tab**           | Tab list: "My Workflows, Team, Marketplace." No "AI Proposed."                                                        |
| **Execution dashboard** | `aria-label="Triggered by schedule."` — no AI trigger.                                                                |

---

## Accessibility for Human-First AI

### A.1 Screen Reader Experience

The screen reader experience of a human-first AI interface is critical. The AI must be **discoverable but not intrusive.**

| Scenario                 | Before (AI-First)                                                                                                                 | After (Human-First)                                                                                                                                                                           |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Open app**             | "IntegrateWise. Twin is active. 3 proposals need attention. Lead Intelligence panel."                                             | "IntegrateWise. Workbench. Entity list. 42 accounts. Acme Corporation, high confidence data available."                                                                                       |
| **Navigate entity list** | "Acme Corporation. Confidence 0.92. AI suggests: send follow-up."                                                                 | "Acme Corporation. AI status: high. Button: Ask AI."                                                                                                                                          |
| **View entity**          | "Detail pane. Acme Corporation. Lead Intelligence: sentiment positive, key topics renewal pricing. AI suggests: escalate to CSM." | "Detail pane. Acme Corporation. Traits: Industry SaaS, Revenue 1.2M. Button: Ask AI."                                                                                                         |
| **AI panel open**        | "Twin chat. Message: Based on account health... Proposal: escalate to CSM. Approve, Modify, Dismiss."                             | "AI Assistant panel. AI insights: confidence high, sentiment positive, key topics renewal pricing. Suggested actions: send follow-up, review tickets. Question input: Ask about this entity." |
| **AI suggestion**        | "Alert: AI proposal. Update renewal date. Approve or dismiss."                                                                    | "AI suggestion: Update renewal date. Why, Dismiss, Do it."                                                                                                                                    |
| **Audit log**            | "Audit log. 12 events. Twin proposed. Alice approved. System synced."                                                             | "Audit log. 12 human actions. Toggle to see AI actions."                                                                                                                                      |

### A.2 Keyboard Experience

| Shortcut                | Action                                      | Context                           |
| ----------------------- | ------------------------------------------- | --------------------------------- |
| `⌘K` / `Ctrl+K`         | Open Command Palette                        | Global                            |
| `⌘/` / `Ctrl+/`         | Toggle Attention List                       | Global (only if attention needed) |
| `1`–`8`                 | Switch Projection                           | Workbench                         |
| `⌘E` / `Ctrl+E`         | Focus Entity Explorer                       | Workbench                         |
| `⌘F` / `Ctrl+F`         | Focus Universal Search                      | Workbench                         |
| `Esc`                   | Close modal / drawer / AI panel             | Global                            |
| `?`                     | Show keyboard shortcuts help                | Global                            |
| `Shift+A`               | Open AI On-Demand Panel for selected entity | Workbench                         |
| `Shift+D`               | Dismiss AI Proposal Toast                   | Global (when toast visible)       |
| `⌘Enter` / `Ctrl+Enter` | Send message                                | AI Home                           |
| `Shift+Enter`           | New line in message                         | AI Home                           |
| `⌘S` / `Ctrl+S`         | Save workflow                               | Workflow Editor                   |
| `⌘R` / `Ctrl+R`         | Run workflow                                | Workflow Editor                   |

### A.3 Focus Management

| State                         | Focus Behavior                                                                                               |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **AI panel opens**            | Focus moves to question input. `Tab` traps within panel. `Esc` closes and returns focus to "Ask AI" trigger. |
| **AI proposal toast appears** | Focus does NOT move to toast. Toast is `aria-live` announced. User can `Shift+D` to dismiss.                 |
| **Attention list opens**      | Focus moves to first item. `Tab` navigates items. `Esc` closes and returns focus to Attention Dot.           |
| **Entity list with Ask AI**   | `Tab` navigates entities. `→` or `Tab` moves to "Ask AI" button (if visible). `Enter` activates.             |

### A.4 Reduced Motion

| Animation            | Reduced Motion Behavior   |
| -------------------- | ------------------------- |
| AI panel slide       | Instant appear/disappear  |
| Toast slide-up       | Instant appear, fade only |
| Attention list slide | Instant appear            |
| Confidence dot       | No pulse. Static color.   |
| Sparkle icon         | No animation. Static.     |

---

## Appendices

### Appendix A: Revised TypeScript Interfaces

```typescript
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
  humanNotes: HumanNote[]; // NEW: primary
  aiMemory: {
    // NEW: secondary, hidden by default
    lastInteraction: number;
    sentiment: number;
    keyTopics: string[];
    openTasks: number;
  };
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

export interface HumanNote {
  id: string;
  content: string;
  createdAt: Date;
  createdBy: string;
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
  id: string;
  displayName: string;
  description: string;
  namespace: string;
  oodaPhase: OodaPhase;
  requiresApproval: boolean;
  minConfidence: number; // governance-internal, not user-facing
  autoApproveThreshold: number; // governance-internal, not user-facing
  requiredRoles: string[];
  requiredScopes: string[];
  usageCount: number;
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

export interface AIInsight {
  id: string;
  type: "confidence" | "sentiment" | "topics" | "suggestion" | "alert";
  content: string;
  confidence?: number; // shown as text only inside AI panel
  reasoning?: string;
  suggestedAction?: { capability: string; label: string };
}

export interface AIOnDemandPanelProps {
  isOpen: boolean;
  entity: Entity360 | null;
  aiInsights: AIInsight[] | null;
  onClose: () => void;
  onAskQuestion: (question: string) => void;
  onAcceptSuggestion: (suggestionId: string) => void;
  onDismissSuggestion: (suggestionId: string) => void;
}

export interface AIProposalToastProps {
  proposal: {
    id: string;
    summary: string;
    reasoningTrace?: string;
    suggestedAction: { capability: string; label: string };
  } | null;
  onWhy: () => void;
  onDismiss: () => void;
  onDoIt: () => void;
}

export interface AttentionItem {
  id: string;
  type: "proposal" | "notification" | "briefing" | "warning";
  title: string;
  description: string;
  action?: { label: string; action: string; url?: string };
  dismissible: boolean;
  timestamp: Date;
}

export interface AttentionListProps {
  isOpen: boolean;
  items: AttentionItem[];
  onClose: () => void;
  onDismissItem: (itemId: string) => void;
  onActOnItem: (itemId: string, action: string) => void;
}

export interface AuditEvent {
  id: string;
  timestamp: Date;
  actor: string; // 'user:<id>', 'ai', 'system'
  action: string;
  via: string;
  entityId?: string;
  entityName?: string;
  entityType?: string;
  capability?: string;
  confidence?: number; // hidden by default, expandable
  governanceDecision?: string;
  summary: string;
  payloadHash: string;
  metadata?: Record<string, unknown>;
}

type Trigger =
  | { type: "scheduled"; cron: string; timezone: string }
  | { type: "event"; event: string; condition?: string }
  | { type: "manual" };
// AI_PROPOSED trigger type REMOVED

export interface AIWorkflowSuggestionToastProps {
  suggestion: {
    id: string;
    observedPattern: string;
    frequency: number;
  } | null;
  onSave: () => void;
  onDismiss: () => void;
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
  category: "navigation" | "action" | "projection" | "ai" | "system";
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

### Appendix B: CSS / Tailwind Quick Reference (Human-First Additions)

```css
/* ============================================
   HUMAN-FIRST TAILWIND CONFIG EXTENSIONS
   ============================================ */
module.exports = {
  theme: {
    extend: {
      colors: {
        'iw-ai-whisper': 'rgba(59, 130, 246, 0.08)',
        'iw-ai-indicator': '#3b82f6',
      },
    },
  },
};

/* AI Ambient Dot — 8px, no text, no label */
.ai-ambient-dot { @apply w-2 h-2 rounded-full inline-block ml-2; }
.ai-ambient-dot.high   { @apply bg-iw-success; }
.ai-ambient-dot.medium { @apply bg-iw-warning; }
.ai-ambient-dot.low    { @apply bg-iw-danger; }
.ai-ambient-dot.none   { @apply bg-iw-neutral-300 opacity-50; }

/* AI Ask Button — revealed on hover/focus only */
.ai-ask-button { @apply opacity-0 transition-opacity duration-150; }
.entity-row:hover .ai-ask-button,
.entity-row:focus-within .ai-ask-button { @apply opacity-100; }

/* AI Proposal Toast — bottom, ephemeral, dismissible */
.ai-proposal-toast {
  @apply fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white rounded-xl
         border border-iw-neutral-200 shadow-xl px-4 py-3 flex items-center gap-4
         max-w-[640px];
}

/* Attention Dot — replaces 56px floating bubble */
.attention-dot { @apply fixed bottom-6 right-6 z-50 w-4 h-4 rounded-full; }
.attention-dot.info     { @apply bg-iw-primary-500; }
.attention-dot.warning  { @apply bg-iw-warning; }
.attention-dot.proposal { @apply bg-iw-danger; }
.attention-dot.none     { @apply hidden; }

/* Attention List — bottom sheet, not side drawer */
.attention-list {
  @apply fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl
         border-t border-iw-neutral-200 shadow-2xl max-h-[60vh];
}

/* Memory Panel — human notes primary, AI secondary */
.memory-panel-human-notes { @apply rounded-lg bg-blue-50 border border-blue-200 p-3 mb-2; }
.memory-panel-ai-memory   { @apply rounded-lg bg-amber-50 border border-amber-200 p-3 mb-2; }

/* AI Suggestion Chip — ONE chip, not a panel */
.ai-suggestion-chip {
  @apply flex items-center gap-3 bg-iw-neutral-50 rounded-lg
         border border-iw-neutral-200 px-4 py-2 mb-4;
}

/* Audit Log — human vs AI styling */
.audit-human-event { @apply bg-white rounded-lg border border-iw-neutral-200 p-4; }
.audit-ai-event    { @apply bg-iw-neutral-50 rounded-lg border border-iw-neutral-200 p-4; }
.audit-human-dot   { @apply w-2.5 h-2.5 rounded-full bg-iw-primary-500; }
.audit-ai-dot      { @apply w-2.5 h-2.5 rounded-full bg-iw-neutral-300; }
```

### Appendix C: Keyboard Shortcuts Reference (Human-First)

| Shortcut                    | Action                          | Context                      | Human-First Rationale                  |
| --------------------------- | ------------------------------- | ---------------------------- | -------------------------------------- |
| `⌘K` / `Ctrl+K`             | Open Command Palette            | Global                       | Human tool for navigation.             |
| `⌘/` / `Ctrl+/`             | Toggle Attention List           | Global (if attention needed) | Attention, not AI chat.                |
| `1`–`8`                     | Switch Projection               | Workbench                    | Human lens switch.                     |
| `⌘E` / `Ctrl+E`             | Focus Entity Explorer           | Workbench                    | Human navigation.                      |
| `⌘F` / `Ctrl+F`             | Focus Universal Search          | Workbench                    | Human search.                          |
| `Esc`                       | Close modal / drawer / AI panel | Global                       | Escape from AI returns to human space. |
| `?`                         | Show keyboard shortcuts help    | Global                       | Human help.                            |
| `Shift+A`                   | Open AI On-Demand Panel         | Workbench                    | Explicit human action to invoke AI.    |
| `Shift+D`                   | Dismiss AI Proposal Toast       | Global (when toast visible)  | Human control over AI suggestions.     |
| `⌘Enter` / `Ctrl+Enter`     | Send message                    | AI Home                      | Only in AI Home, not workbench.        |
| `Shift+Enter`               | New line in message             | AI Home                      | Only in AI Home.                       |
| `↑` (in empty input)        | Recall last message             | AI Home                      | Only in AI Home.                       |
| `⌘S` / `Ctrl+S`             | Save workflow                   | Workflow Editor              | Human action.                          |
| `⌘R` / `Ctrl+R`             | Run workflow                    | Workflow Editor              | Human action.                          |
| `Delete` / `Backspace`      | Delete selected node            | Canvas                       | Human action.                          |
| `Ctrl+Z` / `⌘Z`             | Undo                            | Canvas                       | Human action.                          |
| `Ctrl+Shift+Z` / `⌘Shift+Z` | Redo                            | Canvas                       | Human action.                          |

---

> **End of Document**
>
> This specification revises the IntegrateWise Product UI to reflect a **human-first, not AI-first** philosophy.
>
> **Key Changes Summary:**
>
> 1. **AI Enrichment Bar removed** from default Workbench view.
> 2. **Lead Intelligence sidebar replaced** with human-only Action Panel + on-demand AI panel.
> 3. **AI confidence scores** replaced with subtle 8px colored dots. No numbers. No labels.
> 4. **Floating robot bubble replaced** with 16px Attention Dot, only visible when attention needed.
> 5. **AI Overlay** is now a notification list, not an AI chat interface.
> 6. **AI Home** is a dedicated chat space, not the primary interface.
> 7. **Capability Fabric** has no confidence badges. One AI suggestion chip, not a panel.
> 8. **Ingress** has no AI setup assistant. Human connects tools. AI is opt-in after.
> 9. **Audit Logs** default to human actions. AI actions are a separate toggle.
> 10. **Browser Automation** has no AI triggers. One-time post-recording suggestion.
> 11. **Workflows** has no "AI Proposed" tab. AI suggestions are ephemeral toasts.
>
> **The human is the protagonist. The AI is the supporting character.**
>
> For questions or clarifications, contact the Product Design team.

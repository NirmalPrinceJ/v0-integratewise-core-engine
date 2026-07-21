# IntegrateWise Design System

> A human-first CRM design system where AI is ambient, human work is prominent, and intelligence is opt-in.

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Spacing System](#spacing-system)
5. [Component Styles](#component-styles)
6. [Layout Patterns](#layout-patterns)
7. [Motion & Animation](#motion--animation)
8. [Dark Mode Variants](#dark-mode-variants)

---

## Design Philosophy

### Human-First Principles

- **AI is Ambient**: AI intelligence is conveyed through subtle indicators — small colored dots, lightweight badges, and collapsible side panels. AI never dominates the viewport.
- **Human Work is Prominent**: Clean entity lists, clear action hierarchies, and uncluttered detail views put human workflow first.
- **Intelligence is Opt-In**: The "Lead Intelligence" sidebar is a secondary panel that can be collapsed. It is not persistent or intrusive.
- **Workbench Over Dashboard**: The interface feels like a precision tool — functional, clean, and task-oriented. Data density is balanced with breathable whitespace.
- **Progressive Disclosure**: Complex AI outputs and enrichment data are hidden behind expandable cards. The default view shows only what's actionable.

---

## Color Palette

### Primary Colors

| Token                 | Hex       | Usage                                                                    |
| --------------------- | --------- | ------------------------------------------------------------------------ |
| `--color-primary-500` | `#2563EB` | Primary buttons, active states, links, score bars, status badges ("New") |
| `--color-primary-600` | `#1D4ED8` | Primary button hover, link hover                                         |
| `--color-primary-50`  | `#EFF6FF` | Light blue backgrounds, hover tints                                      |
| `--color-primary-100` | `#DBEAFE` | Active tab background, subtle highlights                                 |

### Secondary Colors

| Token                   | Hex       | Usage                                                               |
| ----------------------- | --------- | ------------------------------------------------------------------- |
| `--color-secondary-500` | `#7C3AED` | Workspace pill "SaaS / Software" background, avatar gradient accent |
| `--color-secondary-50`  | `#F5F3FF` | Purple tint backgrounds                                             |
| `--color-secondary-600` | `#6D28D9` | Secondary hover states                                              |

### Neutral / Gray Scale

| Token              | Hex       | Usage                                                       |
| ------------------ | --------- | ----------------------------------------------------------- |
| `--color-gray-50`  | `#F9FAFB` | Page background, card hover background                      |
| `--color-gray-100` | `#F3F4F6` | Input backgrounds, stat card backgrounds, subtle separators |
| `--color-gray-200` | `#E5E7EB` | Borders (cards, inputs, tabs), dividers                     |
| `--color-gray-300` | `#D1D5DB` | Disabled borders, placeholder text                          |
| `--color-gray-400` | `#9CA3AF` | Secondary text, muted icons, inactive tab text              |
| `--color-gray-500` | `#6B7280` | Body text, labels, descriptions                             |
| `--color-gray-600` | `#4B5563` | Primary body text on light backgrounds                      |
| `--color-gray-700` | `#374151` | Headings, bold labels                                       |
| `--color-gray-800` | `#1F2937` | Primary headings, primary text                              |
| `--color-gray-900` | `#111827` | Maximum contrast text                                       |

### Semantic / Functional Colors

| Token                 | Hex       | Usage                                                  |
| --------------------- | --------- | ------------------------------------------------------ |
| `--color-success-500` | `#22C55E` | "Qualified" count (green), positive indicators         |
| `--color-success-50`  | `#F0FDF4` | Success tint backgrounds                               |
| `--color-warning-500` | `#F59E0B` | Warning states, enrichment alerts, amber indicators    |
| `--color-warning-50`  | `#FFFBEB` | Warning banner background (intelligence not connected) |
| `--color-warning-100` | `#FEF3C7` | Warning banner border                                  |
| `--color-danger-500`  | `#EF4444` | Error states, destructive actions                      |
| `--color-danger-50`   | `#FEF2F2` | Error tint backgrounds                                 |

### Accent Colors (Badges & Icons)

| Token                        | Hex       | Usage                                       |
| ---------------------------- | --------- | ------------------------------------------- |
| `--color-accent-apollo`      | `#F3F4F6` | Source badge "Apollo" background (gray-100) |
| `--color-accent-apollo-text` | `#374151` | Source badge "Apollo" text (gray-700)       |
| `--color-accent-linkedin`    | `#0A66C2` | LinkedIn icon hover                         |
| `--color-accent-email`       | `#6B7280` | Email icon default                          |
| `--color-accent-phone`       | `#6B7280` | Phone icon default                          |

### Background Colors

| Token                | Hex       | Usage                                  |
| -------------------- | --------- | -------------------------------------- |
| `--color-bg-page`    | `#F8F9FA` | Main page background (light warm gray) |
| `--color-bg-surface` | `#FFFFFF` | Cards, panels, modals, top bar         |
| `--color-bg-sidebar` | `#FFFFFF` | Right intelligence sidebar             |
| `--color-bg-input`   | `#FFFFFF` | Input fields                           |
| `--color-bg-hover`   | `#F9FAFB` | Row/card hover states                  |

### Avatar Gradients

| Token                      | Value                                       | Usage                                     |
| -------------------------- | ------------------------------------------- | ----------------------------------------- |
| `--avatar-gradient-blue`   | `linear-gradient(135deg, #3B82F6, #8B5CF6)` | Default avatar background (blue → purple) |
| `--avatar-gradient-purple` | `linear-gradient(135deg, #7C3AED, #C084FC)` | Variant avatar background                 |

---

## Typography

### Font Family

```css
--font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
--font-mono: "JetBrains Mono", "Fira Code", monospace;
```

> **Note**: The interface uses a clean, geometric sans-serif with excellent legibility at small sizes. Inter is the assumed primary typeface based on character shapes and metrics.

### Type Scale

| Style                  | Size             | Weight         | Line Height | Letter Spacing | Usage                        |
| ---------------------- | ---------------- | -------------- | ----------- | -------------- | ---------------------------- |
| **H1 — Page Title**    | 24px (1.5rem)    | 700 (Bold)     | 1.2         | -0.02em        | Page headings ("Leads")      |
| **H2 — Section Title** | 18px (1.125rem)  | 600 (Semibold) | 1.3         | -0.01em        | Card headers, section titles |
| **H3 — Entity Name**   | 20px (1.25rem)   | 600 (Semibold) | 1.3         | -0.01em        | Detail view entity names     |
| **H4 — List Name**     | 16px (1rem)      | 600 (Semibold) | 1.4         | 0              | List view entity names       |
| **Body**               | 14px (0.875rem)  | 400 (Regular)  | 1.5         | 0              | Paragraphs, descriptions     |
| **Body Small**         | 13px (0.8125rem) | 400 (Regular)  | 1.5         | 0              | Card descriptions, metadata  |
| **Caption**            | 12px (0.75rem)   | 400 (Regular)  | 1.4         | 0              | Labels, timestamps, hints    |
| **Caption Uppercase**  | 11px (0.6875rem) | 500 (Medium)   | 1.2         | 0.05em         | Section labels, badge text   |
| **Button**             | 14px (0.875rem)  | 500 (Medium)   | 1           | 0              | Button labels                |
| **Tab**                | 14px (0.875rem)  | 500 (Medium)   | 1           | 0              | Filter tabs                  |
| **Stat Value**         | 28px (1.75rem)   | 700 (Bold)     | 1.1         | -0.02em        | KPI numbers                  |
| **Score**              | 14px (0.875rem)  | 500 (Medium)   | 1           | 0              | Score values                 |

### Text Colors by Context

| Context            | Color Token           | Hex       |
| ------------------ | --------------------- | --------- |
| Primary text       | `--color-gray-800`    | `#1F2937` |
| Secondary text     | `--color-gray-500`    | `#6B7280` |
| Muted text         | `--color-gray-400`    | `#9CA3AF` |
| Link / Interactive | `--color-primary-500` | `#2563EB` |
| Link hover         | `--color-primary-600` | `#1D4ED8` |
| Inverse text       | `--color-bg-surface`  | `#FFFFFF` |
| Placeholder        | `--color-gray-400`    | `#9CA3AF` |

---

## Spacing System

### Base Unit

The spacing system uses **4px** as the base unit:

| Token        | Value   | Pixels |
| ------------ | ------- | ------ |
| `--space-1`  | 0.25rem | 4px    |
| `--space-2`  | 0.5rem  | 8px    |
| `--space-3`  | 0.75rem | 12px   |
| `--space-4`  | 1rem    | 16px   |
| `--space-5`  | 1.25rem | 20px   |
| `--space-6`  | 1.5rem  | 24px   |
| `--space-8`  | 2rem    | 32px   |
| `--space-10` | 2.5rem  | 40px   |
| `--space-12` | 3rem    | 48px   |

### Common Spacing Patterns

| Pattern       | Value          | Usage                                     |
| ------------- | -------------- | ----------------------------------------- |
| Page padding  | 24px (1.5rem)  | Horizontal page margins                   |
| Card padding  | 20px (1.25rem) | Internal card padding                     |
| Card gap      | 16px (1rem)    | Gap between stat cards, list cards        |
| Section gap   | 24px (1.5rem)  | Between major sections                    |
| Element gap   | 8px (0.5rem)   | Between inline elements (buttons, badges) |
| Icon gap      | 6px (0.375rem) | Between icon and text                     |
| Input padding | 10px 14px      | Internal input field padding              |

---

## Component Styles

### Buttons

#### Primary Button

```css
background-color: #2563eb;
color: #ffffff;
font-size: 14px;
font-weight: 500;
padding: 8px 16px;
border-radius: 6px;
border: none;
transition: background-color 150ms ease;
```

- **Hover**: `background-color: #1D4ED8`
- **Active**: `background-color: #1E40AF`
- **Disabled**: `background-color: #93C5FD; color: #FFFFFF; opacity: 0.6`
- **Icon**: 16px icon, 6px gap to text
- **Examples**: "Convert to Client", "Log", "Add Lead"

#### Secondary Button (Outline)

```css
background-color: #ffffff;
color: #374151;
font-size: 14px;
font-weight: 500;
padding: 8px 16px;
border-radius: 6px;
border: 1px solid #d1d5db;
transition: all 150ms ease;
```

- **Hover**: `background-color: #F9FAFB; border-color: #9CA3AF`
- **Active**: `background-color: #F3F4F6`
- **Disabled**: `opacity: 0.5; cursor: not-allowed`
- **Examples**: "Mark Contacted", "Qualify"

#### Text Button / Link

```css
background: transparent;
color: #2563eb;
font-size: 14px;
font-weight: 500;
padding: 4px 8px;
border: none;
text-decoration: none;
transition: color 150ms ease;
```

- **Hover**: `color: #1D4ED8; text-decoration: underline`
- **Examples**: "Back to Leads", entity name links

#### Icon Button

```css
background: transparent;
color: #6b7280;
padding: 8px;
border-radius: 6px;
border: none;
transition: all 150ms ease;
```

- **Hover**: `background-color: #F3F4F6; color: #374151`
- **Active**: `background-color: #E5E7EB`
- **Size**: 36px × 36px touch target
- **Icon size**: 18px–20px

---

### Cards

#### Entity Card (List View)

```css
background-color: #ffffff;
border: 1px solid #e5e7eb;
border-radius: 12px;
padding: 20px;
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
transition:
  box-shadow 150ms ease,
  border-color 150ms ease;
```

- **Hover**: `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); border-color: #D1D5DB`
- **Layout**: Horizontal flex, space-between, align-center
- **Left section**: Avatar (40px) + Entity info (name, company, role, location)
- **Right section**: Score bar + Source badge + Status badge + Action icons

#### Stat Card (KPI)

```css
background-color: #ffffff;
border: 1px solid #e5e7eb;
border-radius: 12px;
padding: 20px;
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
```

- **Layout**: Label top-left, value bottom-left, icon top-right
- **Icon container**: 36px × 36px, rounded-lg, light background tint
- **Value color**: Contextual — gray-800 (default), primary-500 (New), success-500 (Qualified)
- **Icon colors**: Gray-400 (Total), Primary-50 bg + Primary-500 icon (New), Success-50 bg + Success-500 icon (Qualified), Primary-50 bg + Primary-500 icon (Converted)

#### Detail Card

```css
background-color: #ffffff;
border: 1px solid #e5e7eb;
border-radius: 12px;
padding: 20px;
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
```

- **Header**: Section title (H2) + optional action buttons
- **Content**: Full-width, no internal padding beyond card padding

#### Intelligence Card (Sidebar)

```css
background-color: #ffffff;
border: 1px solid #e5e7eb;
border-radius: 8px;
padding: 16px;
margin-bottom: 12px;
```

- **Header**: Question title (14px, semibold) + "Unknown" badge
- **Body**: 13px gray-500 text, italic for "unknown — needs enrichment"
- **Last item**: No bottom margin

---

### Input Fields

#### Text Input

```css
background-color: #ffffff;
color: #1f2937;
font-size: 14px;
font-weight: 400;
padding: 10px 14px;
border-radius: 8px;
border: 1px solid #d1d5db;
outline: none;
transition:
  border-color 150ms ease,
  box-shadow 150ms ease;
```

- **Placeholder**: `color: #9CA3AF`
- **Focus**: `border-color: #2563EB; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1)`
- **Disabled**: `background-color: #F3F4F6; color: #9CA3AF`
- **Error**: `border-color: #EF4444; box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1)`

#### Search Input

```css
/* Extends text input */
padding-left: 40px; /* Space for search icon */
background-image: url("search-icon.svg");
background-position: 14px center;
background-repeat: no-repeat;
background-size: 16px;
```

- **Width**: 320px–400px (contextual)
- **Examples**: "Search this workspace...", "Search leads..."

#### Activity Input (Inline)

```css
/* Extends text input */
flex: 1;
border-radius: 8px;
margin-right: 8px;
```

- **Accompanied by**: Submit button ("Log") on the right
- **Full-width** within its container

---

### Icons

#### Icon Specifications

| Property           | Value     |
| ------------------ | --------- |
| **Size (default)** | 18px–20px |
| **Size (small)**   | 14px–16px |
| **Size (large)**   | 24px      |
| **Stroke width**   | 1.5px–2px |
| **Default color**  | `#6B7280` |
| **Hover color**    | `#374151` |
| **Active color**   | `#2563EB` |

#### Icon Types Used

| Icon                      | Usage                 | Default Color                  |
| ------------------------- | --------------------- | ------------------------------ |
| Search (magnifying glass) | Search inputs         | `#9CA3AF`                      |
| LinkedIn                  | External profile link | `#6B7280` → `#0A66C2` on hover |
| Email                     | Contact action        | `#6B7280`                      |
| Phone                     | Contact action        | `#6B7280`                      |
| More (three dots)         | Overflow menu         | `#6B7280`                      |
| Check / Checkmark         | Qualify action        | `#374151`                      |
| User / Person             | Stat card             | `#9CA3AF`                      |
| Star                      | New stat card         | `#2563EB`                      |
| Trending up               | Qualified stat card   | `#22C55E`                      |
| Arrow up-right            | Converted stat card   | `#2563EB`                      |
| Chevron left              | Back navigation       | `#6B7280`                      |
| Building                  | Company indicator     | `#9CA3AF`                      |
| Clock / Activity          | Activity section      | `#374151`                      |
| Sparkles / Magic          | AI intelligence       | `#F59E0B`                      |
| Info circle               | Unknown status        | `#9CA3AF`                      |

---

### Badges & Labels

#### Status Badge ("New")

```css
background-color: #2563eb;
color: #ffffff;
font-size: 11px;
font-weight: 500;
padding: 3px 10px;
border-radius: 9999px; /* Pill shape */
text-transform: none;
line-height: 1;
```

- **Variants**:
  - New: `bg: #2563EB; color: #FFFFFF`
  - Contacted: `bg: #F3F4F6; color: #374151; border: 1px solid #E5E7EB`
  - Qualified: `bg: #22C55E; color: #FFFFFF`
  - Unqualified: `bg: #F3F4F6; color: #9CA3AF`

#### Source Badge ("Apollo")

```css
background-color: #f3f4f6;
color: #374151;
font-size: 12px;
font-weight: 400;
padding: 3px 10px;
border-radius: 6px;
border: 1px solid #e5e7eb;
```

#### "Unknown" Badge

```css
background-color: #f3f4f6;
color: #6b7280;
font-size: 11px;
font-weight: 500;
padding: 3px 10px;
border-radius: 9999px;
display: inline-flex;
align-items: center;
gap: 4px;
```

- **Icon**: Small info circle (12px) before text

#### Location Tag

```css
background-color: #f9fafb;
color: #6b7280;
font-size: 12px;
font-weight: 400;
padding: 4px 10px;
border-radius: 6px;
border: 1px solid #e5e7eb;
```

---

### Avatar

#### Default Avatar

```css
width: 40px;
height: 40px;
border-radius: 50%;
background: linear-gradient(135deg, #3b82f6, #8b5cf6);
color: #ffffff;
font-size: 14px;
font-weight: 600;
display: flex;
align-items: center;
justify-content: center;
```

- **Size variants**:
  - Small: 32px (list view compact)
  - Default: 40px (list view standard)
  - Large: 48px (detail view header)
- **Text**: First + last initials (e.g., "KL", "AM", "GK")
- **Border**: None (uses background gradient for definition)

---

### Progress Bar / Score Bar

```css
/* Container */
width: 48px;
height: 6px;
background-color: #e5e7eb;
border-radius: 9999px;
overflow: hidden;

/* Fill */
height: 100%;
background-color: #2563eb;
border-radius: 9999px;
transition: width 300ms ease-out;
```

- **Width variants**: 48px (compact), 64px (standard)
- **Height**: 6px
- **Fill color**: `#2563EB` (primary)
- **Background**: `#E5E7EB`
- **Label**: Score number (14px, medium) to the right of bar
- **Full score (100)**: Fill at ~35–40% width (normalized scale, not literal percentage)

---

### Tabs / Filter Pills

#### Active Tab

```css
background-color: #2563eb;
color: #ffffff;
font-size: 14px;
font-weight: 500;
padding: 8px 16px;
border-radius: 8px;
border: none;
```

#### Inactive Tab

```css
background-color: transparent;
color: #6b7280;
font-size: 14px;
font-weight: 500;
padding: 8px 16px;
border-radius: 8px;
border: 1px solid #e5e7eb;
transition: all 150ms ease;
```

- **Hover**: `background-color: #F9FAFB; color: #374151`
- **Gap between tabs**: 8px
- **Examples**: All, New, Contacted, Qualified, Unqualified

---

### Sidebar / Intelligence Panel

#### Panel Container

```css
width: 380px;
background-color: #ffffff;
border-left: 1px solid #e5e7eb;
padding: 24px;
overflow-y: auto;
```

- **Header**: Panel title (14px, semibold, gray-800) + action link ("Obtain It" — text button style)
- **Position**: Fixed right side, full height below top bar
- **Collapsible**: Can be toggled open/closed
- **When collapsed**: Only a subtle indicator (colored dot or icon) remains visible

#### Warning Banner

```css
background-color: #fffbeb;
border: 1px solid #fef3c7;
border-radius: 8px;
padding: 12px 16px;
margin-bottom: 16px;
```

- **Icon**: Warning triangle (16px, `#F59E0B`)
- **Title**: 14px, medium, `#92400E` (amber-800)
- **Body**: 13px, regular, `#B45309` (amber-700)
- **Example**: "Live intelligence not connected" banner

---

### Navigation

#### Top Bar

```css
height: 56px;
background-color: #ffffff;
border-bottom: 1px solid #e5e7eb;
padding: 0 24px;
display: flex;
align-items: center;
gap: 16px;
```

- **Left**: Logo / workspace icon (20px square)
- **Center**: Search input (400px max-width)
- **Right**: Workspace pills + theme toggle (moon icon)

#### Workspace Pill

```css
font-size: 12px;
font-weight: 500;
padding: 4px 12px;
border-radius: 6px;
border: 1px solid transparent;
display: inline-flex;
align-items: center;
gap: 6px;
```

- **Active pill** ("Business Ops"):
  - `background-color: #EFF6FF`
  - `color: #2563EB`
  - `border-color: #BFDBFE`
  - Dot indicator: 6px circle, `#2563EB`
- **Inactive pill** ("SaaS / Software"):
  - `background-color: #F5F3FF`
  - `color: #7C3AED`
  - `border-color: #DDD6FE`

#### Breadcrumb / Back Link

```css
color: #6b7280;
font-size: 14px;
font-weight: 400;
text-decoration: none;
display: inline-flex;
align-items: center;
gap: 6px;
```

- **Hover**: `color: #374151`
- **Icon**: Chevron left (16px)
- **Example**: "← Back to Leads"

---

### Divider / Separator

```css
border: none;
border-top: 1px solid #e5e7eb;
margin: 16px 0;
```

---

## Layout Patterns

### Page Layout (List View)

```
┌─────────────────────────────────────────────────────────────┐
│ TOP BAR (56px)                                              │
├─────────────────────────────────────────────────────────────┤
│ PAGE HEADER                                                │
│ Title + Subtitle                                    [Add]   │
├─────────────────────────────────────────────────────────────┤
│ STAT CARDS ROW (4 cards, grid)                             │
├─────────────────────────────────────────────────────────────┤
│ SEARCH + FILTER TABS                                       │
├─────────────────────────────────────────────────────────────┤
│ ENTITY CARD LIST                                           │
│ [Card 1]                                                   │
│ [Card 2]                                                   │
│ [Card 3]                                                   │
└─────────────────────────────────────────────────────────────┘
```

- **Page padding**: 24px horizontal, 24px top
- **Max content width**: 100% (full-width layout)
- **Stat cards grid**: 4 columns, 16px gap
- **Card list gap**: 12px between entity cards

### Page Layout (Detail View)

```
┌──────────────────────────────────────────────────┬──────────────┐
│ TOP BAR (56px)                                   │              │
├──────────────────────────────────────────────────┼──────────────┤
│ ← Back to Leads                                  │              │
├──────────────────────────────────────────────────┤              │
│ HEADER                                           │  LEAD        │
│ Avatar + Name + Badge        [LinkedIn] [Email]  │  INTELLIGENCE│
├──────────────────────────────────────────────────┤  SIDEBAR     │
│ ACTION CARD                                      │  (380px)     │
│ Score Bar              [Mark] [Qualify] [Convert]│              │
├──────────────────────────────────────────────────┤              │
│ ACTIVITY CARD                                    │              │
│ Input field + Log button                         │              │
│ No activity yet...                               │              │
└──────────────────────────────────────────────────┴──────────────┘
```

- **Main content**: Flexible width (~60–65%)
- **Sidebar**: Fixed 380px width
- **Gap between main and sidebar**: 24px
- **Responsive**: Sidebar collapses to drawer below 1024px

---

## Motion & Animation

### Principles

- **Subtle**: Animations should not distract from workflow
- **Fast**: Most transitions complete in 150ms
- **Purposeful**: Every motion guides attention or confirms action

### Transition Tokens

| Token                 | Value                                     | Usage                        |
| --------------------- | ----------------------------------------- | ---------------------------- |
| `--transition-fast`   | `150ms ease`                              | Hover states, color changes  |
| `--transition-base`   | `200ms ease-out`                          | Card hover, sidebar toggle   |
| `--transition-slow`   | `300ms ease-out`                          | Page transitions, modal open |
| `--transition-bounce` | `300ms cubic-bezier(0.34, 1.56, 0.64, 1)` | Badge pop, score fill        |

### Specific Animations

#### Card Hover

```css
transition:
  box-shadow 150ms ease,
  border-color 150ms ease,
  transform 150ms ease;
```

- **Default**: `box-shadow: 0 1px 3px rgba(0,0,0,0.04); transform: translateY(0)`
- **Hover**: `box-shadow: 0 4px 12px rgba(0,0,0,0.08); transform: translateY(-1px); border-color: #D1D5DB`

#### Button Press

```css
transition:
  transform 100ms ease,
  background-color 150ms ease;
```

- **Active (pressed)**: `transform: scale(0.97)`

#### Score Bar Fill

```css
transition: width 400ms cubic-bezier(0.4, 0, 0.2, 1);
```

- Animates from 0 to target width on page load
- Uses ease-out curve for natural deceleration

#### Sidebar Toggle

```css
transition:
  transform 200ms ease-out,
  opacity 200ms ease-out;
```

- **Open**: `transform: translateX(0); opacity: 1`
- **Closed**: `transform: translateX(100%); opacity: 0`
- **Overlay** (mobile): `background-color: rgba(0,0,0,0.3); transition: opacity 200ms ease`

#### Badge / Tag Pop

```css
animation: badge-pop 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
```

```css
@keyframes badge-pop {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
```

#### Skeleton Loading (Inferred)

```css
background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
background-size: 200% 100%;
animation: skeleton-shimmer 1.5s infinite;
border-radius: 6px;
```

```css
@keyframes skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
```

---

## Dark Mode Variants

### Backgrounds

| Light Token          | Dark Token                | Hex       |
| -------------------- | ------------------------- | --------- |
| `--color-bg-page`    | `--color-bg-page-dark`    | `#0F1115` |
| `--color-bg-surface` | `--color-bg-surface-dark` | `#1A1D23` |
| `--color-bg-sidebar` | `--color-bg-sidebar-dark` | `#1A1D23` |
| `--color-bg-input`   | `--color-bg-input-dark`   | `#1A1D23` |
| `--color-bg-hover`   | `--color-bg-hover-dark`   | `#252830` |

### Text Colors

| Light Token                       | Dark Token                    | Hex       |
| --------------------------------- | ----------------------------- | --------- |
| `--color-gray-800` (primary text) | `--color-text-primary-dark`   | `#F3F4F6` |
| `--color-gray-500` (secondary)    | `--color-text-secondary-dark` | `#9CA3AF` |
| `--color-gray-400` (muted)        | `--color-text-muted-dark`     | `#6B7280` |

### Borders & Separators

| Light Token        | Dark Token                   | Hex       |
| ------------------ | ---------------------------- | --------- |
| `--color-gray-200` | `--color-border-dark`        | `#2D3139` |
| `--color-gray-100` | `--color-border-subtle-dark` | `#252830` |

### Component Adaptations

#### Card (Dark)

```css
background-color: #1a1d23;
border: 1px solid #2d3139;
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
```

- **Hover**: `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4); border-color: #374151`

#### Primary Button (Dark)

```css
background-color: #3b82f6; /* Slightly lighter for contrast */
color: #ffffff;
```

- **Hover**: `background-color: #60A5FA`

#### Secondary Button (Dark)

```css
background-color: #1a1d23;
color: #d1d5db;
border: 1px solid #4b5563;
```

- **Hover**: `background-color: #252830; border-color: #6B7280`

#### Input (Dark)

```css
background-color: #1a1d23;
color: #f3f4f6;
border: 1px solid #4b5563;
```

- **Placeholder**: `color: #6B7280`
- **Focus**: `border-color: #3B82F6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2)`

#### Badge — Status "New" (Dark)

```css
background-color: #2563eb;
color: #ffffff;
```

- Unchanged — maintains brand consistency

#### Badge — Source "Apollo" (Dark)

```css
background-color: #252830;
color: #d1d5db;
border: 1px solid #374151;
```

#### Warning Banner (Dark)

```css
background-color: #451a03;
border: 1px solid #78350f;
```

- **Title**: `#FCD34D`
- **Body**: `#FDE68A`

#### Avatar Gradient (Dark)

- Same gradients work in dark mode
- Consider adding a subtle `box-shadow: 0 0 0 2px #1A1D23` for definition against dark cards

### Shadows (Dark Mode)

| Elevation      | Light Shadow                   | Dark Shadow                   |
| -------------- | ------------------------------ | ----------------------------- |
| Low (cards)    | `0 1px 3px rgba(0,0,0,0.04)`   | `0 1px 3px rgba(0,0,0,0.2)`   |
| Medium (hover) | `0 4px 12px rgba(0,0,0,0.08)`  | `0 4px 12px rgba(0,0,0,0.4)`  |
| High (modals)  | `0 10px 40px rgba(0,0,0,0.12)` | `0 10px 40px rgba(0,0,0,0.5)` |

---

## Accessibility Notes

### Color Contrast

- All text on colored backgrounds meets WCAG AA (4.5:1 for body, 3:1 for large text)
- Primary blue (`#2563EB`) on white: **4.6:1** ✅
- Gray-500 (`#6B7280`) on white: **6.2:1** ✅
- White on primary blue: **4.6:1** ✅

### Focus States

- All interactive elements have visible focus rings
- Focus ring: `box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3)`
- Focus ring color adapts to element context (error = red, success = green)

### Touch Targets

- Minimum touch target: **36px × 36px**
- Buttons and icon buttons meet 44px × 44px where possible

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Token Quick Reference

### CSS Custom Properties

```css
:root {
  /* Colors */
  --iw-primary-500: #2563eb;
  --iw-primary-600: #1d4ed8;
  --iw-primary-50: #eff6ff;
  --iw-secondary-500: #7c3aed;
  --iw-success-500: #22c55e;
  --iw-warning-500: #f59e0b;
  --iw-danger-500: #ef4444;
  --iw-gray-50: #f9fafb;
  --iw-gray-100: #f3f4f6;
  --iw-gray-200: #e5e7eb;
  --iw-gray-300: #d1d5db;
  --iw-gray-400: #9ca3af;
  --iw-gray-500: #6b7280;
  --iw-gray-600: #4b5563;
  --iw-gray-700: #374151;
  --iw-gray-800: #1f2937;
  --iw-gray-900: #111827;
  --iw-bg-page: #f8f9fa;
  --iw-bg-surface: #ffffff;

  /* Typography */
  --iw-font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --iw-font-mono: "JetBrains Mono", "Fira Code", monospace;

  /* Spacing */
  --iw-space-1: 0.25rem;
  --iw-space-2: 0.5rem;
  --iw-space-3: 0.75rem;
  --iw-space-4: 1rem;
  --iw-space-5: 1.25rem;
  --iw-space-6: 1.5rem;
  --iw-space-8: 2rem;

  /* Radii */
  --iw-radius-sm: 6px;
  --iw-radius-md: 8px;
  --iw-radius-lg: 12px;
  --iw-radius-full: 9999px;

  /* Shadows */
  --iw-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.04);
  --iw-shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --iw-shadow-lg: 0 10px 40px rgba(0, 0, 0, 0.12);

  /* Transitions */
  --iw-transition-fast: 150ms ease;
  --iw-transition-base: 200ms ease-out;
}
```

---

_Document generated from analysis of IntegrateWise UI screenshots — Lead Detail View and Leads List View._
_Last updated: Based on screenshots v1.0._

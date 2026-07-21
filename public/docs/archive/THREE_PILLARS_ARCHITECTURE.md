# Three Pillars Architecture

> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

## IntegrateWise Frontend Pattern

**Date:** June 27, 2026  
**Pattern:** Frontend Consolidation  
**Status:** Foundation for all future frontends  

---

## The Insight

Every frontend in the IntegrateWise ecosystem gets exactly **three things**:

```
Frontend

├── Pillar 1: Projection Manifest
├── Pillar 2: Gateway SDK
└── Pillar 3: Design System
```

Nothing else.

This pattern emerged from analyzing years of architectural work:
- Projection Engine (what can I do?)
- Gateway SDK (how do I talk to backend?)
- Design System (how do I look?)

---

## Pillar 1: Projection Manifest

**File:** `lib/projection-manifest.ts`

### What It Does

Defines what a frontend can do, without coupling to the backend.

### Structure

```typescript
interface ProjectionManifest {
  id: string                    // unique identifier
  name: string                  // display name
  description: string           // what it does
  navigation: NavigationItem[]  // routes & menus
  widgets: WidgetDefinition[]   // ui components
  commands: CommandDefinition[] // available actions
  capabilities: string[]        // required backend capabilities
  permissions: string[]         // required user roles
  platformUsage: number         // % of platform used
}
```

### Three Complete Examples

**1. Customer Success (45% platform)**
```typescript
import { CUSTOMER_SUCCESS_PROJECTION } from '@/lib'

// Navigation: Accounts, Health, Renewals, Signals, Timeline
// Widgets: Health Score Card, Renewal Forecast, Risk Signals
// Commands: Schedule QBR, Propose Renewal, Create Task
// Capabilities: entity360, signals, timeline, health, renewal, insights, approvals, tasks
```

**2. Executive Dashboard (25% platform)**
```typescript
import { EXECUTIVE_PROJECTION } from '@/lib'

// Navigation: Metrics, Goals, Insights, Forecast
// Widgets: KPI Cards, Revenue Chart, AI Insights
// Commands: Export Report, Approve Decision
// Capabilities: metrics, goals, insights, predictions, approvals
```

**3. Developer Console (40% platform)**
```typescript
import { DEVELOPER_PROJECTION } from '@/lib'

// Navigation: Connectors, Agents, Workflows, Schema, Logs
// Widgets: Connector Card, Agent Debugger, Schema Browser
// Commands: Test Connector, Deploy Agent, View Logs
// Capabilities: mcp, adk, workflows, registry, logs, schema, connectors, tasks
```

### Using in Components

```tsx
import { getProjectionForUser, CUSTOMER_SUCCESS_PROJECTION } from '@/lib'

export function Sidebar() {
  const projection = CUSTOMER_SUCCESS_PROJECTION
  
  return (
    <nav>
      {projection.navigation.map(item => (
        <a key={item.id} href={item.href}>
          {item.label}
        </a>
      ))}
    </nav>
  )
}
```

---

## Pillar 2: Gateway SDK

**File:** `lib/gateway-sdk.ts`

### What It Does

The ONLY way the frontend talks to the backend.

Provides a type-safe client for all backend capabilities.

### Capabilities

```
Entity360    → Get complete entity context
Memory       → Retrieve and store adaptive memory
Twin         → AI capabilities (chat, reasoning)
Signals      → Risk detection
Insights     → AI analysis
Predictions  → Forecasts and outcomes
Handoff      → Multi-agent coordination
Stream       → Real-time data
MCP          → Multi-connector protocol (200+ sources)
Health       → System health monitoring
```

### API

```typescript
// Initialize once at app startup
import { initializeGateway } from '@/lib'

initializeGateway({
  baseUrl: 'https://api.integratewise.com',
  projectId: 'project-123',
})

// Then use throughout your app
import { getGateway } from '@/lib'

const gateway = getGateway()

// Entity: Get customer context
const customer = await gateway.getEntity('customer-123')

// Memory: Retrieve context
const memory = await gateway.getMemory('context-abc')

// Twin: Chat with AI
const response = await gateway.chat('What is the renewal status?', {
  entityId: 'customer-123',
})

// Signals: Get risk indicators
const signals = await gateway.getSignals('customer-123')

// Insights: Get AI recommendations
const insights = await gateway.getInsights('customer-123')

// Predictions: Forecast outcomes
const forecast = await gateway.getPredictions('customer-123')

// MCP: Query external data sources
const connectors = await gateway.listConnectors()
const data = await gateway.queryConnector('salesforce', {
  query: 'SELECT * FROM accounts',
})

// Stream: Real-time updates
const stream = await gateway.createStream('customer-123', ['renewal', 'health'])
gateway.subscribeToStream(stream.id, (data) => {
  console.log('Real-time update:', data)
})
```

### Error Handling

```typescript
try {
  const entity = await gateway.getEntity('customer-123')
} catch (error) {
  console.error('Failed to fetch entity:', error.message)
}
```

### Authentication

```typescript
// Set session token when user logs in (via Clerk)
import { useUser } from '@clerk/nextjs'

export function App() {
  const { user } = useUser()
  
  useEffect(() => {
    if (user?.id) {
      const gateway = getGateway()
      gateway.setSessionToken(user.getToken())
    }
  }, [user?.id])
}

// Clear on logout
gateway.clearSessionToken()
```

---

## Pillar 3: Design System

**File:** `lib/design-system.ts`

### What It Does

Defines how the frontend looks and feels.

Centralizes all design decisions in one place.

### Sections

**Typography**
```typescript
import { typography, hierarchy } from '@/lib'

// Use semantic sizes
typography.sizes.base    // 16px
typography.sizes.lg      // 18px
typography.sizes['3xl']  // 30px

// Use visual hierarchy (L1-L6)
hierarchy.l1  // Page title (4xl, bold)
hierarchy.l2  // Subsection (3xl, semibold)
hierarchy.l3  // Card title (2xl, semibold)
hierarchy.l4  // Label (base, medium)
hierarchy.l5  // Body (sm, normal)
hierarchy.l6  // Metadata (xs, muted)
```

**Spacing**
```typescript
import { spacing } from '@/lib'

spacing.scale[4]      // 1rem (16px)
spacing.scale[6]      // 1.5rem (24px)
spacing.scale[8]      // 2rem (32px)

spacing.gaps.md       // 1.5rem (for flexbox/grid)
spacing.padding.lg    // 2rem
spacing.margin.xl     // 3rem
```

**Colors (Semantic Tokens)**
```typescript
import { colors } from '@/lib'

colors.semantic.primary           // Primary brand
colors.semantic.background        // Page background
colors.semantic.muted             // Disabled state
colors.semantic.destructive       // Error/danger
colors.semantic['success']        // Success state
colors.semantic['warning']        // Warning state
colors.semantic['info']           // Information

// Also includes neutral palette
colors.neutral[50]   // Very light
colors.neutral[500]  // Mid-tone
colors.neutral[900]  // Very dark
```

**Components**
```typescript
import { components } from '@/lib'

// Button
components.button.sizes.md        // md button size
components.button.variants.primary  // primary variant

// Card
components.card.base              // card base styles
components.card.hover             // hover effect

// Input
components.input.base             // input base
components.input.focus            // focus state

// Badge
components.badge.sizes.sm         // small badge
components.badge.variants.success // success variant
```

**Interactions**
```typescript
import { interactions } from '@/lib'

interactions.transitions.normal   // 300ms transition
interactions.animations.fadeIn    // fade in animation
interactions.focus.ring           // focus ring style
interactions.hover.lift           // lift on hover
```

**Layout**
```typescript
import { layout } from '@/lib'

layout.containers['2xl']    // max-width: 42rem
layout.grid.columns[3]      // grid-cols-3
layout.flex.between         // flex, space-between
```

### Using in Components

```tsx
import { designSystem, hierarchy, spacing } from '@/lib'

export function Card() {
  return (
    <div className={`
      rounded-lg 
      border 
      border-border 
      bg-background 
      p-6
      ${designSystem.interactions.transitions.normal}
    `}>
      <h3 className={`
        text-${hierarchy.l3.fontSize}
        font-semibold
        mb-${spacing.scale[4]}
      `}>
        Card Title
      </h3>
      <p className={`
        text-${hierarchy.l5.fontSize}
        text-muted-foreground
        leading-relaxed
      `}>
        Card content...
      </p>
    </div>
  )
}
```

---

## How They Work Together

### Flow: User → Frontend → Backend

```
User clicks button
    ↓
Component uses Projection Manifest to validate action
    ↓
Component uses Gateway SDK to call backend
    ↓
Component uses Design System to display response
    ↓
User sees result
```

### Example: "Create Task" Command

```tsx
import {
  CUSTOMER_SUCCESS_PROJECTION,
  getGateway,
  designSystem,
} from '@/lib'

export function TaskButton() {
  const projection = CUSTOMER_SUCCESS_PROJECTION
  const gateway = getGateway()
  
  // Find the command definition
  const createTaskCmd = projection.commands.find(c => c.id === 'create-task')
  
  // Verify user has required capabilities
  const hasCapability = projection.capabilities.includes('tasks')
  
  if (!hasCapability) {
    return null  // Don't show button
  }
  
  async function handleCreateTask() {
    try {
      // Call backend via Gateway SDK
      await gateway.fetch('/api/v1/tasks', {
        method: 'POST',
        body: JSON.stringify({ title: 'New task' }),
      })
      
      // Show success with Design System
      showNotification({
        className: `bg-success text-success-foreground`,
        message: 'Task created',
      })
    } catch (error) {
      // Show error with Design System
      showNotification({
        className: `bg-destructive text-destructive-foreground`,
        message: error.message,
      })
    }
  }
  
  return (
    <button
      onClick={handleCreateTask}
      className={`
        px-4 py-2
        rounded-md
        ${designSystem.components.button.variants.primary}
        ${designSystem.interactions.transitions.normal}
      `}
    >
      {createTaskCmd.name}
    </button>
  )
}
```

---

## Adding a New Projection

To add a new product (e.g., TAM Analysis):

### Step 1: Add Projection Manifest

```typescript
// lib/projection-manifest.ts

export const TAM_ANALYSIS_PROJECTION: ProjectionManifest = {
  id: 'tam-analysis',
  name: 'TAM Analysis',
  description: 'Total addressable market analysis',
  
  navigation: [
    { id: 'markets', label: 'Markets', href: '/tam/markets' },
    { id: 'analysis', label: 'Analysis', href: '/tam/analysis' },
  ],
  
  widgets: [
    { id: 'market-card', name: 'Market Card', component: 'MarketCard', ... },
  ],
  
  commands: [
    { id: 'run-analysis', name: 'Run Analysis', action: 'run-analysis', ... },
  ],
  
  capabilities: ['entity360', 'insights', 'predictions'],
  permissions: ['executive', 'admin'],
  platformUsage: 35,
}
```

### Step 2: Build UI Components

Use the projection definition, Gateway SDK, and Design System as you build.

### Step 3: Wire Authentication

Ensure Projection Manifest is loaded after user authenticates.

### Step 4: Deploy

The new product is now available through the same frontend infrastructure.

---

## Benefits of Three Pillars

### For Frontend Developers
- ✓ Clear structure (three things to know)
- ✓ Type-safe API (TypeScript SDK)
- ✓ Consistent design (centralized system)
- ✓ Easy to add features (just add to projection)

### For Platform Architects
- ✓ Backend changes don't affect frontend (Gateway SDK abstraction)
- ✓ Easy to add new capabilities (just add to manifest)
- ✓ Easy to add new products (just add new projection)
- ✓ Scalable design (same pattern for all frontends)

### For Users
- ✓ Consistent experience across products
- ✓ Fast, responsive interface
- ✓ Rich AI capabilities
- ✓ Real-time updates

---

## Implementation in This Project

**Location:** `/apps/web/lib/`

```
lib/
├── projection-manifest.ts  (Pillar 1: What can I do?)
├── gateway-sdk.ts          (Pillar 2: How do I talk to backend?)
├── design-system.ts        (Pillar 3: How do I look?)
└── index.ts                (Export everything)
```

**Usage in Components:**

```tsx
import {
  CUSTOMER_SUCCESS_PROJECTION,
  getGateway,
  designSystem,
} from '@/lib'

export function Dashboard() {
  // Use projection for navigation
  // Use gateway for data
  // Use design system for styling
}
```

---

## File Sizes (Current)

| File | Lines | Purpose |
|------|-------|---------|
| projection-manifest.ts | 435 | Pillar 1: What can I do? |
| gateway-sdk.ts | 266 | Pillar 2: How do I talk to backend? |
| design-system.ts | 375 | Pillar 3: How do I look? |
| index.ts | 69 | Export everything |
| **Total** | **1,145** | Core frontend infrastructure |

---

## Evolution Path

**Now:** Three pillars in frontend

**Next Phase:**
1. Wire all existing components to use three pillars
2. Build new projections for new products
3. Simplify component tree (remove legacy)
4. Archive old patterns

**Final State:**
- All frontends follow three pillars pattern
- All components use Gateway SDK
- All components use Design System
- All layouts follow Projection Manifests

---

## Key Principle

> **Frontend doesn't need to know about backend topology.**
>
> It only needs three things:
> 1. What can I do? (Projection Manifest)
> 2. How do I talk? (Gateway SDK)
> 3. How do I look? (Design System)

Everything else is implementation detail.

---

**Status: Foundation Established**

All three pillars are now in place.

Ready to wire components and launch new products. 🚀


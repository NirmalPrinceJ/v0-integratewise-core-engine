# IntegrateWise Naming Framework


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

## Three Naming Layers

To avoid coupling architecture to marketing, we distinguish between what changes rarely and what evolves frequently.

### Layer 1: Architecture (Stable)
These names appear in code, APIs, documentation, and database schemas. They change rarely.

| Concept | Purpose | Stability |
|---------|---------|-----------|
| **Spine** | Canonical operational data store | 🔒 Very stable |
| **Gateway** | Request routing & context broker | 🔒 Very stable |
| **Memory** | Continuity & knowledge persistence | 🔒 Very stable |
| **Entity360** | Unified entity view | 🔒 Very stable |
| **Governance** | Policy enforcement | 🔒 Very stable |
| **Loader** | Data acquisition from connectors | 🔒 Very stable |
| **Normalizer** | Data transformation to canonical schema | 🔒 Very stable |
| **Bridge** | AI context mediation | 🔒 Very stable |
| **Skills** | Reusable actions & capabilities | 🔒 Very stable |
| **Connected Apps** | External integrations (in APIs/docs) | 🟡 Somewhat stable |

### Layer 2: Capabilities (Mostly Stable)
These names appear in UI, marketing, documentation. They change occasionally (v1 → v2), but not within a release.

| Level | Capability | Today | Alternative Names | Stability |
|-------|-----------|-------|-------------------|-----------|
| L1 | **Workbench** | Workspace / Dashboard / Hub | 🟡 Could change in v2 |
| L2 | **Intelligence** | Insights / Signals / Recommendations | 🟡 Could change in v2 |
| L3 | **Twin** | Assistant / AI / Copilot / Co-worker | 🟡 Likely to change |
| L4 | **Memory** | Knowledge / Brain / Store | 🟡 Could change in v2 |
| L5 | **Approvals** | Reviews / Governance / Policy | 🟡 Could change in v2 |
| L6 | **Connected Apps** | Integrations / Connectors / Plugins | 🟡 Likely to change |
| L7 | **Identity** | Auth / Access / Users | 🟡 Usually stable |

### Layer 3: Product & Brand (Most Flexible)
These are product names and can change independently of the platform. Update freely as you learn from customers.

| Product | Today | v1.1 | v2 | Enterprise | Notes |
|---------|-------|------|----|-----------|----|
| **AI Workspace** | AI Workspace | AI Workspace | IntegrateWise AI | IntegrateWise Copilot | Flagship application |
| **Twin** | Twin | Assistant | Copilot | Co-Pilot | The AI entity |
| **Sales Tool** | Sales Workbench | Sales Dashboard | Sales Copilot | Sales CoPilot | Role-based app |
| **CS Tool** | CS Workbench | CS Dashboard | Success Assistant | Success Co-Pilot | Role-based app |
| **Docs** | Wise Docs | Knowledge | Docs | Knowledge Hub | Documentation app |
| **Ops** | Wise Ops | Operations | Ops Copilot | Ops CoPilot | Operations app |
| **Branding** | Wise Branding | Brand Hub | Brand Central | Brand Studio | Branding app |
| **ERMS** | Wise ERMS | People | HR | People Hub | HRIS app |

---

## Evolution Examples

### Example 1: Renaming L3 (Twin) Without Code Changes

**Today (v1.0):**
```typescript
// Architecture (code)
import { twinAgent } from "@/platform/twin-agent"
const response = await twinAgent.reason(input)

// UI (marketing)
"Chat with your Twin"
```

**Later (v1.2):**
```typescript
// Architecture (same code)
import { twinAgent } from "@/platform/twin-agent"
const response = await twinAgent.reason(input)

// UI (new marketing)
"Chat with your Assistant"
```

No code changes. The architecture is decoupled from the marketing name.

---

### Example 2: Renaming L1 (Workbench)

**Today (v1.0):**
```typescript
// Architecture (route params, state, etc.)
const workbench = useWorkbench()

// UI (marketing)
<h1>Your Workbench</h1>
```

**Later (v2):**
```typescript
// Architecture (same code)
const workbench = useWorkbench()

// UI (new marketing)
<h1>Your Workspace</h1>
```

Users see "Workspace," but internally it's still the same Workbench service.

---

### Example 3: Enterprise Branding

**Standard Edition (v1.0):**
```
🤖 Twin
```

**Enterprise Edition:**
```
🤖 Co-Pilot
```

Same code path, different label based on subscription tier.

---

## Decision Tree

When naming something new, ask:

1. **Is it part of the platform infrastructure?** (Spine, Gateway, Memory, etc.)
   - Use **stable architectural names**
   - Appears in code, APIs, documentation
   - Rarely changes

2. **Is it a user-facing capability?** (Workbench, Intelligence, Twin, Memory, etc.)
   - Use **capability names**
   - Can evolve within major versions
   - Changes on marketing feedback

3. **Is it a product or branded experience?** (AI Workspace, Wise Docs, Sales Workbench, etc.)
   - Use **product names**
   - Most flexible, can change anytime
   - Independent per product/tier

---

## API Versioning

Keep architecture stable by versioning only the presentation layer.

**Backend (Stable):**
```
GET /api/platform/spine/entities/{id}
POST /api/platform/memory/store
GET /api/platform/intelligence/signals
```

**Frontend (Flexible):**
```
// v1.0
"Intelligence" card
"Twin" chat
"Workbench" dashboard

// v1.1 (same APIs)
"Insights" card
"Assistant" chat
"Dashboard" view
```

---

## Types of Name Changes

### Never Do
- Rename Spine, Gateway, Memory, Loader, Normalizer, Entity360 in the middle of a release (code instability)
- Rename core platform concepts in APIs without versioning

### Safe in Minor Release
- Rename UI labels (Intelligence → Insights)
- Rename product names (AI Workspace → AssistantWise)
- Rename capability marketing names (Twin → Copilot)

### Safe Between Major Versions
- Reorganize layer definitions
- Rename capabilities that appeared in v1 if there's a strong reason

### Freeze Pattern
For each major version, create a NAMING_FREEZE document:
```
# IntegrateWise v2 Naming Freeze

Stable through v2.x:
- Spine, Gateway, Memory, Loader, Normalizer
- L1, L2, L3, L4 (layer definitions)
- Entity360, Skills, Governance

Flexible in v2:
- "Workbench" → can become "Dashboard" or "Hub"
- "Twin" → can become "Assistant" or "Copilot"
- "Wise Docs" → can become "Knowledge" or "Wiki"
```

---

## Implementation Guidance

### In Code

**Stable names (architecture):**
```typescript
// ✅ Use stable names in services, constants, APIs
export class SpineService {}
export const MEMORY_KEY_PREFIX = "mem_"
import { gatewayClient } from "@/platform/gateway"
```

**Flexible names (UI):**
```typescript
// ✅ Use i18n or config for UI names
export const CAPABILITY_NAMES = {
  twin: "Assistant",  // Change this for rebranding
  workbench: "Dashboard",
  intelligence: "Insights",
}
<h1>{CAPABILITY_NAMES.twin}</h1>
```

### In Documentation

**Architecture docs:** Use stable names
- "The Spine stores..."
- "The Gateway routes..."
- "Memory persists..."

**Product docs:** Use capability names
- "Your Workbench shows..."
- "Intelligence alerts you to..."
- "Twin helps you reason..."

**Marketing docs:** Use product/brand names
- "AI Workspace brings you..."
- "Wise Docs organizes your..."
- "Sales Workbench accelerates..."

---

## Questions to Answer Before Launch

1. Is "Workbench" the right name for L1? (Consider: Dashboard, Hub, Workspace, Center)
2. Is "Twin" the right name for L3? (Consider: Assistant, AI, Copilot, Agent)
3. Is "Intelligence" the right name for L2? (Consider: Insights, Signals, Recommendations, Awareness)
4. Are "Wise Docs," "Wise Ops," "Wise Branding," "Wise ERMS" the right product names?
5. Should "Connected Apps" be called "Integrations" or "Connectors"?

**Note:** These decisions can change in v1.1 without code changes, so don't block Release 1.0 on perfect naming.

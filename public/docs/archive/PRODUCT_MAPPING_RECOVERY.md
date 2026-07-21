# Product Mapping: From Current to Recovered State


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

## Understanding the Drift

| Dimension | Jan 2025 (Strong) | Current (Diluted) | Fixed (Recovered) |
|-----------|------------------|------------------|-------------------|
| Center of Gravity | Human Workbench | AI Agents | Human Workbench |
| Primary Product | Adaptive workspace | MCP/ADK infrastructure | Continuity surface |
| What customers buy | "One place to work" | "AI orchestration" | "Nothing lost in context" |
| Customer question | "How do I stop context switching?" | "How do I build AI agents?" | "How do I stop being a human API?" |
| AI role | Support layer | Primary actor | Invisible infrastructure |
| User spends time in | Work surfaces (8h/day) | AI chat/approval (30min/day) | Work surfaces (8h/day) |
| Moat | Continuity + Entity360 | Multi-model routing | Continuity + Spine |

---

## Current State Diagnosis

### What Exists (Good)
- ✅ **Backend Contract Solid**
  - Auth with password enabled
  - Gateway routing correct
  - Twin model route operational
  - Knowledge service + queue + cron

- ✅ **Real Customer Zero Infrastructure**
  - Tenant: `iw-customer-zero`
  - User: Nirmal Prince
  - Verification component wired

- ✅ **Frontend Foundation**
  - Shell and routing architecture
  - L1 domain surfaces (dashboard, contacts, companies, etc.)
  - L2 overlay system for collaboration
  - Real Customer Zero integration

### What's Wrong (Problems)
- ❌ **Wrong Focus**
  - AI treated as primary product
  - Surfaces treated as overlays
  - Continuity not positioned as moat
  - Humans treated as approval layer

- ❌ **Wrong Architecture**
  - AI on top, humans below
  - Enables "agent autonomy" but kills adoption
  - Surfaces not configurable
  - No clear workbench primacy

- ❌ **Wrong Value Prop**
  - "Here's another AI" ← resonates poorly
  - "Solve your fragmentation" ← resonates well but lost

---

## Mapping: Current Components to Recovered Structure

### Level 1: Human Workbench (What exists, needs focus)

**Current State:**
- Dashboard (exists but not primary)
- Contacts/Companies (buried in UI)
- Tasks/Calendar (secondary to AI)
- Communications (viewed through AI)

**Recovered State:**
- **Dashboard** → Primary entry point (always first)
- **Accounts** → Your profile, preferences
- **Contacts** → People you work with
- **Companies** → Customers, prospects, partners
- **Opportunities** → Deals, pipeline
- **Tasks** → Personal and team work
- **Calendar** → Meetings, availability
- **Notes** → Quick capture
- **Meetings** → Recording, summary, actions
- **Communications** → Email, messages, Slack history
- **Documents** → Files, shared, versions
- **Knowledge** → FAQs, processes, learnings
- **Goals** → Quarterly, tracking
- **Values** → Principles, culture
- **Reports** → Custom dashboards
- **Settings** → Integrations, preferences

**What Changes:**
- Surfaces moved from "overlay" to "primary"
- Left sidebar shows all surfaces (configurable)
- User chooses where to work
- AI recommendation appears as side panel, not center
- "Stop Being Human APIs" becomes visible again

### Level 2: AI Workbench (Needs to be built separately)

**Current State:**
- Twin integrated into overlay
- No persistent home for AI
- No daily routines
- Memory not persistent

**Recovered State:**
- **AI's Own Environment** (separate from human surfaces)
  - Observations dashboard (what Twin sees today)
  - Memory consolidation (learnings from sessions)
  - Daily routines (morning standup, EOD summary)
  - Recommendation queue (prepared options)
  - Approval queue (waiting human decision)
  - Collaboration history (past conversations)

- **AI Visibility** (human can see Twin's work)
  - "Twin saw X today. Should we Y?"
  - "Your patterns: You code 6-9pm. Block calendar?"
  - "Team insight: 5 PRs waiting >2 days. Should we review?"
  - "Follow-up: Customer complained Monday. Haven't heard back?"

- **AI Autonomy** (Twin works continuously)
  - Morning: Reviews overnight emails, flags urgent
  - Hourly: Monitors for anomalies
  - Evening: Consolidates learning
  - Weekly: Generates insights

**What Changes:**
- AI not idle (has real responsibilities)
- AI has persistent memory (learns over time)
- AI has boundaries (can't override human work)
- AI has visibility (human always sees what it's doing)

### Level 3: Continuity Engine (Always IntegrateWise)

**Current State:**
- Spine exists but not featured
- Memory not front-and-center
- Auth hidden
- Governance invisible

**Recovered State:**
- **Identity (Always IW)**
  - Authentication (not delegated)
  - Authorization (IntegrateWise governs)
  - Organizations, Teams, Roles
  - Permissions, Boundaries
  - Governance policies

- **Spine Schema (Always IW)**
  - Canonical truth for all entities
  - Relationship definitions
  - Memory scoping rules
  - Continuity rules
  - Lineage tracking

- **Shared Memory (Always IW)**
  - Org Memory (principles, goals, rules)
  - Work Memory (current projects, priorities)
  - Personal Memory (user preferences, patterns)
  - AI Memory (learnings, continuity facts)

- **Invisible Continuity**
  - Context follows the user
  - Nothing is forgotten
  - Connections are hidden
  - Intelligence is obvious

**What Changes:**
- Continuity becomes the moat (not MCP or agents)
- Spine defines what connections mean (not just endpoints)
- Memory scopes defined by governance (not data access)
- Users experience continuity but don't think about it

### Level 4: AI Infrastructure (Invisible)

**Current State:**
- MCP highlighted
- ADK discussed frequently
- Multi-model routing complex
- Reflection loops debated

**Recovered State:**
- **Still exists, but hidden**
  - MCP routers (how tools communicate)
  - ADK discovery (how Twin finds capabilities)
  - Multi-model orchestration (Claude → GPT → Gemini)
  - Reflection & consolidation (memory promotion)
  - Voice & multimodal (speech input/output)

- **Users don't need to know about:**
  - Which model is processing
  - How MCP works
  - ADK routing details
  - Reflection mechanisms
  - These are implementation details

**What Changes:**
- Infrastructure is means, not end
- Product story doesn't mention MCP
- AI model choice is transparent to user
- Continuity is what users experience, not infrastructure

### Level 5: Connected Applications (100+)

**Current State:**
- Apps treated as data sources
- Continuity applied post-connection
- User doesn't see connection logic

**Recovered State:**
- **Apps remain external**
  - Gmail (email, calendar)
  - Slack (messages)
  - GitHub (projects, code)
  - Figma (designs)
  - Notion (docs)
  - Salesforce (CRM)
  - HubSpot (leads)
  - Linear (tasks)
  - Drive (files)
  - Calendar (availability)
  - WhatsApp (personal)
  - and 90+ more

- **Connected through Spine**
  - Not just synced
  - Relationships mapped
  - Entities normalized
  - Memory extracted

**What Changes:**
- Users see fewer duplicate entities
- Connections are federated (not replicated)
- Continuity flows across all apps
- No context lost between tools

---

## Configuration Architecture

### Surface Registry (Built)

Each surface is independently functional:

```typescript
interface Surface {
  id: string                    // 'dashboard', 'contacts', 'tasks'
  label: string                 // 'Dashboard', 'Contacts', 'Tasks'
  icon: string                  // 'home', 'users', 'checkbox'
  component: React.ComponentType
  enabled: boolean              // Can user disable?
  requiresTools?: string[]      // Which tools it depends on
  order: number                 // Default position in sidebar
  pinned?: boolean              // User's preference
}
```

### Sidebar Configuration (User-Driven)

```typescript
interface SidebarConfig {
  order: string[]               // ['dashboard', 'accounts', 'contacts', ...]
  hidden: Set<string>           // User hidden surfaces
  pinned: string[]              // User pinned favorites
  collapsed: Set<string>        // Collapsed sections
  theme: 'default' | 'compact'
}

// User actions:
useSurfaceConfig()
  .toggleSurface('notes')       // Hide/show
  .reorderSurfaces([...])       // Drag-drop
  .pin('opportunities')         // Pin to top
  .reset()                      // Back to factory
```

### Per-Role Configuration (Admin)

```typescript
interface RoleConfig {
  surfaces: {
    [surfaceId]: {
      visible: boolean          // Can they see it?
      editable: boolean         // Can they edit?
      connectedTools: string[]  // Which integrations show?
    }
  }
}

// Example: Sales role
{
  surfaces: {
    dashboard: { visible: true, editable: false },
    accounts: { visible: true, editable: true },
    contacts: { visible: true, editable: true },
    companies: { visible: true, editable: true },
    opportunities: { visible: true, editable: true },
    tasks: { visible: true, editable: true },
    calendar: { visible: true, editable: false },
    goals: { visible: false, editable: false },  // Hidden for sales
    values: { visible: false, editable: false },  // Hidden for sales
  }
}
```

---

## Implementation Checklist: Current → Recovered

### Phase 0: Cleanup (TODAY)
- [ ] Remove `components/l1/entity-stretch.tsx`
- [ ] Remove `components/l1/domains/customer-zero/`
- [ ] Flag `/pages/Metrics.tsx` for Replit reconciliation
- [ ] Verify `tsc --noEmit` clean

### Phase 1: Deploy (THIS WEEK)
- [ ] Deploy cleaned workbench to preview
- [ ] Verify all backend services online
- [ ] Confirm Customer Zero can access
- [ ] Test each L1 surface (dashboard, contacts, companies, etc.)

### Phase 2: Activate (WEEK 1)
- [ ] Customer Zero starts daily usage
- [ ] First tool connection (Gmail)
- [ ] Second tool connection (Slack)
- [ ] Third tool connection (GitHub)
- [ ] Fourth tool connection (Calendar)
- [ ] Spine ingests first entities

### Phase 3: Schema (WEEK 2)
- [ ] Document Spine Schema v1.0
- [ ] Map entities (Person, Org, Work, Communication)
- [ ] Map relationships (50+ types)
- [ ] Map memory scopes (Org, Work, Personal, AI)
- [ ] Governance rules (access, boundaries)

### Phase 4: AI Home (WEEK 2-3)
- [ ] Build AI Workbench separately
- [ ] Implement daily routines
- [ ] Connect memory consolidation
- [ ] Enable human-AI collaboration

### Phase 5: Surfaces (WEEK 3)
- [ ] Implement Surface Registry
- [ ] Build Sidebar Configuration UI
- [ ] Enable per-user customization
- [ ] Support drag-drop reordering
- [ ] Add hide/show functionality

### Phase 6: Integration (ONGOING)
- [ ] Customer Zero connects 10+ tools
- [ ] Spine handles duplicates/conflicts
- [ ] Memory consolidation working
- [ ] Human-AI working together
- [ ] Continuity invisible but omnipresent

---

## What NOT to Do

❌ Don't rebuild the frontend from scratch
- Existing foundation is solid
- Just shift focus from AI to human

❌ Don't move AI to the center
- Keep it UNDERNEATH as infrastructure
- Surface it only in collaboration overlay

❌ Don't hide the workbench surfaces
- Make them PRIMARY and prominent
- Left sidebar is the main navigation

❌ Don't make Spine visible
- Continuity is the moat
- Users shouldn't think about it

❌ Don't build AI autonomy first
- Build human workbench first
- AI gets its own environment separately

---

## What TO Do

✅ Deploy the existing workbench (cleanup only)
✅ Let Customer Zero work naturally
✅ Let Spine evolve from real usage
✅ Build AI home separately and persistently
✅ Focus on invisible continuity, not AI visibility

---

## Success = Back to Original Vision

**Original (Jan 2025):**
> "Stop Being Human APIs. All your work appears in one adaptive workspace. Every conversation, ticket, customer, document and action stays connected. Nothing is lost when switching tools."

**Today (Current):**
> "Use AI agents to orchestrate your tools. Create MCP flows. Configure reflection loops."

**Recovered (June 2026+):**
> "All your work in one place. Your Twin understands everything. Nothing is forgotten. No context switching. One unified surface."

---

## Timeline Summary

```
TODAY:
  Cleanup files, deploy workbench

WEEK 1:
  Customer Zero uses, connects tools

WEEK 2:
  Spine Schema documented, AI ready

WEEK 3+:
  Continuity invisible, productivity obvious

END STATE:
  Product focused.
  Humans supported by AI.
  AI infrastructure hidden.
  Continuity omnipresent.
  "Stop Being Human APIs" vindicated.
```

---

**Status: Ready to Implement**

The mapping is clear. The infrastructure exists. All that remains is execution.
First step: Clean files → Deploy → Activate Customer Zero → Build from reality.


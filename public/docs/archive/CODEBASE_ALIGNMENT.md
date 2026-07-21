# IntegrateWise Codebase Alignment Plan


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

## Strategic Direction

User feedback: "Capabilities should be directly executable in our workspace. The AI should be proactive—not waiting for context, but surfacing relevant capabilities based on what the user is viewing. Support inline operations: viewing contacts, updating fields, marking leads active. Mix fields from multiple tools (e.g., Website Manager shows visitor count from analytics + blog content from CMS)."

## Current State vs. Desired State

### Current (Discovery-Only)
- Capability Dashboard shows available capabilities
- User manually invokes from dedicated page
- No workspace context awareness
- No inline execution
- No field composition from multiple sources

### Desired (Execution-in-Workspace)
- User views entity (e.g., Lead "Acme Corp")
- Proactive AI suggests relevant capabilities (Mark as Active, Send Email, Create Task)
- User clicks → capability executes inline in current view
- Fields show composite data: name (Salesforce) + website visits (Analytics) + content tags (CMS)
- Sync options: real-time to connected tools OR deferred sync
- Capability context flows from workspace to Twin

## Implementation Roadmap

### Phase 1: Workspace Context Awareness (Current Task)
- Build Entity Detail View component
- Connect to Spine for entity data
- Display composite fields from multiple tools
- Track current viewing context

### Phase 2: Proactive Capability Surfacing
- Create Capability Context Engine
- Analyze current entity + user role → suggest capabilities
- Surface top 3-5 relevant capabilities in entity sidebar
- Prioritize by: role, entity type, frequency

### Phase 3: Inline Capability Execution
- Build Inline Capability Executor (mini UI vs. full modal)
- Handle form inputs within entity view
- Execute with real-time OR deferred sync option
- Show execution status inline

### Phase 4: Composite Field Views
- Create FieldComposer component
- Accept field definitions from multiple connectors
- Display composite (e.g., "Website Visitors: 4,221 (from Google Analytics) + Blog: 12 posts (from Contentful)")
- Enable field-level governance (show source, confidence)

### Phase 5: Twin Integration
- Twin watches workspace context (entity_id, viewing_user_id)
- Generates proactive capability recommendations
- Creates morning briefing with relevant workspace capabilities
- Learns which capabilities user approves most often

## File Structure Needed

```
packages/core/
├── workspace-context/
│   ├── context-provider.ts      # Track current entity/workspace
│   ├── types.ts                 # Context shape
│   └── index.ts

apps/web/components/
├── entity-detail/
│   ├── entity-detail.tsx        # Main entity view wrapper
│   ├── composite-fields.tsx     # Field composition UI
│   ├── field-viewer.tsx         # Single field with sources
│   └── index.ts
├── proactive-capabilities/
│   ├── capability-suggester.tsx # AI suggestions sidebar
│   ├── capability-card.tsx      # Mini capability card
│   └── index.ts
├── inline-executor/
│   ├── inline-executor.tsx      # Embedded capability execution
│   ├── capability-form.tsx      # Compact form input
│   ├── sync-options.tsx         # Real-time vs. deferred
│   └── index.ts
└── workspace-layout/
    ├── workspace-with-context.tsx # Root wrapper
    └── index.ts
```

## Key Contracts

### WorkspaceContext
```typescript
interface WorkspaceContext {
  tenant_id: string;
  workspace_id: string;
  user_id: string;
  current_entity_id?: string;        // What user is viewing
  current_entity_type?: string;      // e.g., "lead", "account"
  viewing_role: string;              // User role
  last_action?: { timestamp, action_name, entity_id };
}
```

### CompositeField
```typescript
interface CompositeField {
  name: string;
  values: {
    source: string;              // e.g., "salesforce", "analytics", "contentful"
    value: any;
    confidence?: number;
    last_updated?: ISO8601;
  }[];
}
```

### ProactiveCapability
```typescript
interface ProactiveCapability {
  capability_id: string;
  relevance_score: number;       // 0-100, why this capability is relevant
  reason: string;                // "Based on lead status" / "You use this 3x/week"
  suggested_inputs?: Record<string, any>;
  quick_actions: boolean;        // Can execute in < 2 seconds
}
```

## Integration Points

1. **Workspace Route** → Wraps with WorkspaceContext Provider
2. **Entity Detail Page** → Queries Spine, displays CompositeFields, surfaces ProactiveCapabilities
3. **Inline Executor** → Uses existing CapabilityEngine but with compact UI
4. **Twin** → Consumes WorkspaceContext to generate smarter recommendations
5. **Governance** → Sync options (real-time to tools vs. deferred) respect approval thresholds

## Success Criteria

- [ ] User views entity → sees composite fields from 2+ sources
- [ ] User views entity → sees 3-5 proactive capability suggestions
- [ ] User clicks capability → executes inline without page navigation
- [ ] Execution completes → shows sync status (real-time synced / deferred pending approval)
- [ ] Twin receives context → generates role-specific morning briefing
- [ ] Workspace switching → Twin maintains continuity (Continuity Bridge)

---

**Next Steps**: Start Phase 1 - Build Entity Detail View and composite field infrastructure.

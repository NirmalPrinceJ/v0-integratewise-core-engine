# Gap Analysis: Customer Zero Missing Spine + UI

## Current State (What We Have)

✅ **Core Systems Built:**
- Capability Engine with OODA state machine
- Twin Memory & Persistence
- Operating Calendar & Scheduling
- Department Workbenches (structure only)
- Lifecycle & Recurring Events
- Operational Templates (6 templates defined)
- MCP Pool (65+ tools mapped)
- Clerk Authentication configured
- Coda integration wired

✅ **Infrastructure Ready:**
- Supabase database schema hooks
- API route structure in place
- TypeScript types exported
- Environment variables configured
- Deployment guide completed

## Missing: The Spine (Critical Gap)

The **Spine is the canonical entity store** that ties everything together. Without it:

❌ **Workbenches can't surface real data** (they're empty shells)
❌ **OODA buttons can't read/write entities** (no backend store)
❌ **Twin can't query context** (no knowledge base)
❌ **Templates can't populate with data** (no data source)
❌ **Relationships can't be tracked** (no graph)
❌ **UI has nothing to display** (no entity explorer)

## What Needs to Be Built

### Phase 1: Spine Backend (Server)
**Duration:** 1-2 weeks
**Complexity:** High

```
lib/spine/
├── types.ts              # 10 entity types with full payloads
├── client.ts             # API client (get, list, search, create, update, delete)
├── store.ts              # Supabase backend with RLS
├── queries.ts            # Common queries by type/owner/status
└── index.ts              # Exports

app/api/spine/
├── entities/[id]/route.ts    # GET/PUT/DELETE single entity
├── entities/route.ts          # GET/POST (list/create)
├── search/route.ts            # Semantic search
├── relationships/route.ts     # Get entity relationships
└── bulk/route.ts              # Batch operations
```

**Key Features:**
- Full entity payload support (not metadata-only)
- Relationships stored and queryable
- Semantic search via embeddings
- Activity/audit logging
- Soft deletes with archive

### Phase 2: Spine UI (Client)
**Duration:** 1-2 weeks
**Complexity:** Medium-High

```
components/spine/
├── spine-explorer.tsx        # Main browser (sidebar + detail panel)
├── entity-card.tsx           # Show entity with relationships
├── relationship-graph.tsx    # Interactive network viz
├── search-panel.tsx          # Search + filter interface
├── timeline-view.tsx         # Activity timeline for entity
├── metadata-viewer.tsx       # Inspect entity metadata
├── payload-editor.tsx        # Edit entity payload inline
└── bulk-operations.tsx       # Batch actions (tag, update, delete)

app/spine/
├── layout.tsx               # Spine app shell
├── page.tsx                 # Spine dashboard + explorer
├── [entity_type]/page.tsx   # Entity type list view
└── [entity_type]/[id]/page.tsx   # Entity detail page
```

**Key Features:**
- Visual entity browser with full-text search
- Relationship network visualization
- Quick-add inline entity creation
- Entity detail with payload editor
- Activity feed showing changes
- Bulk operations (multi-select)
- Export to CSV/JSON

### Phase 3: Integration Points
**Duration:** 1 week
**Complexity:** Medium

1. **Workbenches → Spine**
   - Templates query Spine for data
   - Display relationships in workbench views

2. **OODA Buttons → Spine**
   - "Store in Spine" creates/updates entities
   - "Ask Twin" fetches context from Spine
   - "Assign Twin" creates task entities
   - "Approve Action" creates decision entities

3. **Lifecycle → Spine**
   - Lifecycle events trigger entity creation
   - Signal generation updates Spine entities

4. **Connectors → Spine**
   - External data synced into Spine
   - Connector webhooks create activity entities

5. **Twin → Spine**
   - Twin queries Spine for context
   - Twin reasoning stored as decisions
   - Twin actions create tasks/signals

### Phase 4: Advanced Features
**Duration:** 2-3 weeks
**Complexity:** High

- Real-time collaborative editing
- Entity versioning & rollback
- Graph-based insights (clusters, anomalies)
- Scheduled tasks/reminders from Spine
- Export integrations (Salesforce sync, etc.)
- Machine learning for entity deduplication

## Implementation Priority

### Critical (Blocking Customer Zero)
1. Spine Backend API (get, list, create, update, delete)
2. Supabase Schema (entities, metadata, relationships tables)
3. Basic SpineExplorer UI
4. Integration with one workbench (Sales Deal Tracker)

### High (Complete MVP)
5. OODA button integration
6. Semantic search
7. Timeline/activity view
8. Entity relationships visualization

### Medium (Enhance UX)
9. Inline payload editor
10. Bulk operations
11. Export/sync features

### Low (Polish)
12. Real-time collab
13. Versioning
14. ML features

## Effort Estimate

- **Phase 1 (Backend):** 80-120 hours
- **Phase 2 (UI):** 60-100 hours
- **Phase 3 (Integration):** 40-60 hours
- **Phase 4 (Advanced):** 60-100 hours

**Total:** 240-380 hours (~6-10 weeks for one developer)

## Technical Decisions

### Database Schema
```sql
-- Core entity table
CREATE TABLE spine_entities (
  id UUID PRIMARY KEY,
  entity_type VARCHAR(50),
  metadata JSONB,
  payload JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  archived_at TIMESTAMP,
  owned_by UUID
);

-- Relationships (many-to-many)
CREATE TABLE spine_relationships (
  source_id UUID,
  target_id UUID,
  relationship_type VARCHAR(100),
  created_at TIMESTAMP,
  PRIMARY KEY (source_id, target_id, relationship_type)
);

-- Activity/audit log
CREATE TABLE spine_activity (
  id UUID PRIMARY KEY,
  entity_id UUID,
  action VARCHAR(50),
  user_id UUID,
  changes JSONB,
  created_at TIMESTAMP
);

-- Full-text search
CREATE INDEX idx_entities_search ON spine_entities USING gin(to_tsvector('english', payload::text));
```

### API Design
- REST endpoints following RESTful conventions
- Pagination with limit/offset
- Filtering via query parameters
- Semantic search via POST /api/spine/search
- Batch operations via POST /api/spine/bulk

### Frontend Architecture
- `useSpine()` hook for data fetching (SWR-based)
- Atomic components (EntityCard, RelationshipNode, etc.)
- Context provider for tenant/user scoping
- Real-time updates via Supabase subscriptions

## Success Criteria

✅ Spine Backend
- All 10 entity types queryable
- Full payload returned (not metadata-only)
- Relationships traversable
- Semantic search functional
- RLS enforced by tenant

✅ Spine UI
- Entity explorer accessible at /spine
- Search finds entities in <100ms
- Relationships render as graph
- Edit payload inline
- Activity history visible

✅ Integration
- Templates get data from Spine
- OODA buttons read/write Spine
- Workbenches display Spine entities
- Twin can query Spine for context

## Next Action

**Recommendation: Start with Phase 1 (Backend)**

1. Define final Spine schema in Supabase
2. Build Spine API routes (CRUD)
3. Implement client (`lib/spine/client.ts`)
4. Add MCP tools for Twin access
5. Then move to UI in Phase 2

This unblocks all downstream work (templates, OODA, etc.) while UI can be built in parallel.

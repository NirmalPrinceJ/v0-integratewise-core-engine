# Spine Implementation for Customer Zero

## What is the Spine?

The **Spine** is the canonical entity store and knowledge graph at the heart of IntegrateWise. It maintains the single source of truth for all company entities (accounts, contacts, deals, tasks, signals, etc.) and their relationships.

## Architecture

### 1. Spine Core (`lib/spine/`)
- **types.ts** - Entity types, payloads, metadata schemas
- **client.ts** - Spine API client (get, list, search operations)
- **store.ts** - In-memory/Supabase store implementation
- **index.ts** - Export interface

### 2. Spine Operations
- **Get** - Fetch single entity with full payload
- **List** - Query entities by type with filtering
- **Search** - Semantic search across all entities
- **Create** - Insert new entities with payload
- **Update** - Modify entity payload and metadata
- **Delete** - Archive entities (soft delete)
- **Query** - Advanced filtering on relationships

### 3. Entity Types Supported

| Type | Description | Fields |
|------|-------------|--------|
| account | Customer/Company entity | name, industry, status, signals, contacts[] |
| contact | Person at account | name, email, title, phone, account_id |
| deal | Sales opportunity | title, amount, stage, close_date, account_id, owner_id |
| task | Action item | title, status, due_date, assigned_to, related_entity |
| activity | Event log | type, timestamp, entity_id, user_id, details |
| signal | Behavioral indicator | type, score, entity_id, source, timestamp |
| project | Product/Ops project | title, status, owner_id, timeline, tasks[] |
| document | Knowledge artifact | title, content, entity_id, tags, created_by |
| workflow | Business process | title, steps[], triggers[], actions[] |
| decision | Governance record | title, context, recommendation, outcome |

### 4. UI Components (`components/spine/`)
- **SpineExplorer** - Visual entity browser
- **EntityCard** - Entity detail card with relationships
- **RelationshipGraph** - Network visualization
- **SearchPanel** - Semantic search interface
- **TimelineView** - Activity timeline
- **MetadataViewer** - Entity metadata inspector
- **PayloadEditor** - Edit entity payload
- **BulkOperations** - Batch update UI

### 5. Integration Points

#### OODA Loop Integration
- **Store in Spine** (Observe) → Create/Update entity with evidence
- **Ask Your Twin** (Orient) → Twin queries Spine for context
- **Assign Your Twin** (Decide) → Twin operations create tasks/decisions in Spine
- **Approve Action** (Act) → Approval decisions stored as decision entities

#### Template Integration
Each workbench template has Spine reads/writes:
- Deal Tracker reads/writes deal entities
- Customer Health reads contact + signal entities
- Campaign Manager creates activity + signal entities
- Revenue Operations reads/writes transaction entities

#### Lifecycle Integration
Lifecycle events trigger Spine operations:
- "Customer Identified" → Create account + contact entities
- "Deal Created" → Create deal entity
- "Task Assigned" → Create task entity with owner

#### Connector Integration
Connectors sync external data into Spine:
- Salesforce Connector → Syncs accounts, contacts, deals
- GitHub Connector → Syncs projects, tasks, documents
- Slack Connector → Creates activity + signal entities
- Email Connector → Creates activity entities

## File Structure

```
lib/spine/
├── types.ts           # Entity schemas & interfaces
├── client.ts          # Spine API client
├── store.ts           # Storage layer (Supabase backend)
├── queries.ts         # Common queries (by type, by owner, etc.)
├── index.ts           # Export interface

components/spine/
├── spine-explorer.tsx       # Main Spine browser
├── entity-card.tsx          # Entity detail view
├── relationship-graph.tsx   # Visual relationships
├── search-panel.tsx         # Search interface
├── timeline-view.tsx        # Activity timeline
├── metadata-viewer.tsx      # Inspect metadata
├── payload-editor.tsx       # Edit payload
├── bulk-operations.tsx      # Batch operations

app/spine/
├── layout.tsx          # Spine app layout
├── page.tsx            # Main Spine dashboard
└── [entity_type]/[id]/ # Entity detail page
```

## API Endpoints Required

```
POST   /api/spine/entities            # Create entity
GET    /api/spine/entities/:id        # Get entity
GET    /api/spine/entities            # List entities (with filters)
PUT    /api/spine/entities/:id        # Update entity
DELETE /api/spine/entities/:id        # Delete entity (soft)
GET    /api/spine/search              # Semantic search
GET    /api/spine/relationships/:id   # Get entity relationships
POST   /api/spine/bulk                # Bulk operations
```

## Integration with Customer Zero

### In Workbenches
```tsx
// Sales workbench
const { accounts, deals } = useSpine('account', 'deal');
const selectedDeal = accounts[0].deals[0];  // Full payload with relationships

// CSM workbench
const { contacts, signals } = useSpine('contact', 'signal');
const healthScore = calculateHealth(signals);  // From Spine data
```

### In OODA Buttons
```tsx
// Store in Spine
const evidence = { interaction: 'call', notes: '...', outcome: 'positive' };
await spine.create('activity', { ...evidence, entity_id: currentDeal.id });

// Ask Twin
const context = await spine.search('similar deals closing soon');
const twin = await askTwin(context, currentTask);

// Assign Twin
const task = await spine.create('task', { title: 'Follow up', assigned_to: twin.id });

// Approve Action
const decision = await spine.create('decision', { title: 'Approve deal', outcome: 'approved' });
```

### In Templates
```tsx
// Deal Tracker template
const deals = await spine.list('deal', { owner_id: userId });
const updated = await spine.update('deal', dealId, { stage: 'closed-won' });

// Customer Health template
const customer = await spine.get('account', accountId);
const signals = customer.signals;  // From Spine payload
const health = calculateHealth(signals);
```

## Next Steps

1. **Implement Spine Client** (`lib/spine/client.ts`)
   - GET /api/spine/entities/:id
   - GET /api/spine/entities (with filtering)
   - POST /api/spine/entities
   - PUT /api/spine/entities/:id
   - DELETE /api/spine/entities/:id

2. **Create API Routes** (`app/api/spine/`)
   - Entity CRUD operations
   - Relationship queries
   - Semantic search
   - Bulk operations

3. **Build UI Components** (`components/spine/`)
   - SpineExplorer (main interface)
   - EntityCard (detail view)
   - RelationshipGraph (visual)
   - SearchPanel (discovery)

4. **Connect to Database** (Supabase)
   - Create entities, metadata, relationships tables
   - Set up full-text search indexes
   - Enable RLS for tenant isolation

5. **Integrate with Workbenches**
   - Pass Spine data to templates
   - Enable OODA buttons to read/write Spine
   - Surface entity relationships in UI

6. **Add MCP Tools** (via mcp-pool)
   - iw_spine_entity_get
   - iw_spine_entity_list
   - iw_spine_entity_search
   - Make available to Twin for queries

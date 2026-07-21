# IntegrateWise Startup Workspace Platform

## Overview
A Notion/Coda-inspired operational platform for founders and startup teams. Built on the Adaptive Spine - a unified entity graph that tracks all business data (customers, deals, team, documents, decisions).

## Architecture

### 1. Adaptive Spine (Data Foundation)
- **Core Tables** (PostgreSQL)
  - `spine_entity_types` - Defines 30+ business entity types (Account, Contact, Deal, Task, etc.)
  - `spine_entities` - Polymorphic entity storage with JSONB data
  - `spine_relationships` - Bidirectional entity graph
  - `spine_timeline` - Immutable audit log of all mutations
  - `spine_fields` - Field schema definitions

- **Core Entity Types**
  - CRM: Account, Contact, Deal, Lead, Opportunity
  - Operations: Task, Project, Milestone, Meeting
  - Communication: Email, Message, Call, Note
  - Documents: Document, Template, Decision
  - Finance: Invoice, Payment, Subscription
  - Organization: TeamMember, Department, Role
  - Product: Feature, Issue, Bug, Deployment

### 2. Spine Service Layer (`lib/platform/spine.ts`)
- `getEntityTypes()` - Fetch all entity type definitions
- `getEntities(type, filter)` - List entities with filtering
- `getEntity(type, id)` - Fetch single entity
- `createEntity(type, data)` - Create new entity with validation
- `updateEntity(type, id, data)` - Update entity with timeline entry
- `getRelated(entityId)` - Fetch related entities via graph
- `getTimeline(entityId)` - Fetch entity change history

### 3. Founder Dashboard
**Route:** `/workspace`

- **Key Metrics**: Active accounts, pipeline value, team size, critical tasks
- **Quick Access Cards**: Accounts, Sales Pipeline, Team, Calendar, Knowledge, Activity
- **Data Model Browser**: View all 30+ entity types
- **Startup Playbooks**: Pre-built templates for common workflows
  - Sales onboarding
  - Product release
  - Fundraising

### 4. 12 Department Workbenches (In Progress)
Each department gets a composed workbench with role-specific fields and capabilities:
1. **Founder** - Overview, metrics, strategic decisions
2. **Sales** - Accounts, opportunities, pipeline, forecasts
3. **Marketing** - Campaigns, leads, content, analytics
4. **Customer Success** - Accounts, health, renewals, NPS
5. **Product** - Features, roadmap, analytics, experiments
6. **Engineering** - Issues, PRs, deployments, incidents
7. **Finance** - Invoices, revenue, expenses, forecasts
8. **Operations** - Tasks, projects, resources, capacity
9. **HR** - Team, hiring, onboarding, performance
10. **IT** - Infrastructure, security, incidents, compliance
11. **Legal** - Contracts, compliance, disputes
12. **Procurement** - Vendors, RFQs, spend, approvals

### 5. 4 OODA Action Buttons (In Progress)
Canonical action grammar for all workbenches:

| Button | Phase | Purpose |
|--------|-------|---------|
| **Store in Spine** | Observe | Capture evidence, decisions, notes |
| **Ask Your Twin** | Orient | Query Twin for insights using workspace context |
| **Assign Your Twin** | Decide | Create proposals/tasks for Twin |
| **Approve Action** | Act | Governance + execution |

### 6. Twin Signal Feed (In Progress)
Real-time AI-generated insights and proposals:
- Risk detection ("Account at churn risk")
- Opportunity identification ("Expansion signal detected")
- Action suggestions ("Schedule renewal call")
- Pattern matching ("Similar accounts churned with this pattern")

## Routes & Pages

```
/                          Landing page with feature overview
/workspace                 Founder Dashboard (startup operations hub)
/workspace/[department]    Department-specific workbench
/customer-zero             Operations dashboard (raw Spine viewer)
/admin                     Admin panel for system management
```

## Development

### Create a new startup workspace:
```
npm run dev                # Start dev server on http://localhost:3000
```

### Database schema:
```
scripts/021_create_spine_core_schema.sql      Core tables
scripts/022_create_spine_entity_types.sql     Entity types and fields
```

### TypeScript types:
```
lib/types/spine.ts         All Spine entity and query types
```

## Next Steps

1. **Wire Platform API** - Connect to real IntegrateWise Gateway
2. **Build Department Workbenches** - 12 role-specific UIs
3. **Implement 4 OODA Buttons** - Store/Ask/Assign/Approve flows
4. **Twin Integration** - Signal generation and proposals
5. **Templates Library** - Notion/Coda-style reusable templates
6. **Collaboration Features** - Real-time updates, comments, @mentions
7. **Mobile App** - React Native companion app

## Key Features

✓ Unified entity graph (Spine)
✓ Multi-department workbenches
✓ Real-time audit trail
✓ Type-safe TypeScript
✓ Responsive design (Tailwind + shadcn)
✓ Professional dark mode
✓ Enterprise security patterns

## Design System

- **Primary**: IntegrateWise Blue (#5B5BFF)
- **Secondary**: Deep Gray (#2D3748)
- **Success**: Emerald (#10B981)
- **Warning**: Amber (#F59E0B)
- **Danger**: Red (#EF4444)
- **Typography**: Inter + Geist Mono
- **Accessibility**: WCAG AAA compliant

## Architecture Diagram

```
Founder Dashboard
├── Metrics & KPIs
├── Quick Access Cards
├── Entity Browser
├── Playbooks
└── Twin Status

        ↓

Department Workbenches
├── Role-specific fields
├── Real-time data
├── Capability list
└── 4 OODA Buttons

        ↓

Spine Service Layer
├── Entity CRUD
├── Relationships
├── Timeline
└── Validation

        ↓

Adaptive Spine (PostgreSQL)
├── spine_entities
├── spine_relationships
├── spine_timeline
└── spine_entity_types
```

---

Built with Next.js 16 + React 19.2 + TypeScript + Tailwind CSS + shadcn/ui

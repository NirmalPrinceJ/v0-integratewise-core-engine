# IntegrateWise Customer Zero - Codebase Overview

## Project Summary

**Customer Zero** is IntegrateWise's internal operating workspace — a reference implementation that demonstrates how to consume the Platform API. The app runs IntegrateWise's own business using the same surfaces exposed to customers.

- **Type**: Next.js 16 + React 19.2 + TypeScript
- **Database**: Supabase (PostgreSQL)
- **UI Framework**: shadcn/ui + Tailwind CSS v4
- **Auth**: Mock authentication (admin-auth.ts)
- **Deployment**: Vercel

---

## Architecture Overview

### Platform API (Modular Surfaces)

The core is defined in `lib/platform/` with 8 surfaces:

1. **Identity** - Organization, departments, organizational structure
2. **Integrations** - External connector status, sync health, webhooks
3. **Adaptive Spine** - Core business entities (leads, deals, clients, projects)
4. **Knowledge** - Documentation and knowledge base content
5. **Capabilities** - Platform functions and their performance
6. **Agent Runtime** - Production workers (Lead Qualification, Support Triage, etc.)
7. **Analytics** - Metrics, KPIs, and business intelligence
8. **Notifications** - Alerts and messaging

### File Structure

```
/vercel/share/v0-project/
├── app/
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home (customer-zero view)
│   ├── globals.css                # Global styles + Tailwind v4 config
│   ├── [departments]/             # Department workspaces
│   │   ├── founder/
│   │   ├── sales/
│   │   ├── marketing/
│   │   ├── operations/
│   │   ├── technology/
│   │   ├── customer-success/
│   │   ├── finance/
│   │   └── administration/
│   ├── [features]/                # Feature modules
│   │   ├── leads/                 # CRM - Lead management
│   │   ├── deals/                 # CRM - Sales pipeline
│   │   ├── campaigns/             # Marketing campaigns
│   │   ├── content/               # Marketing content library
│   │   ├── clients/               # Client management (+ detail views)
│   │   ├── sessions/              # Client sessions
│   │   ├── projects/              # Client projects
│   │   ├── products/              # Product catalog
│   │   ├── services/              # Service catalog
│   │   ├── knowledge/             # Knowledge base
│   │   ├── metrics/               # Analytics dashboard
│   │   ├── data-sources/          # Integration management
│   │   ├── agents/                # Agent runtime dashboard
│   │   ├── tasks/                 # Task management
│   │   ├── integrations/          # Settings
│   │   ├── settings/              # Configuration
│   │   ├── evidence/              # Success metrics
│   │   ├── customer-zero/         # Business overview
│   │   └── administration/        # Admin panel
│   ├── api/
│   │   ├── ai/chat/               # AI assistant endpoint
│   │   ├── search/                # Global search
│   │   ├── webhooks/              # External integrations
│   │   │   ├── hubspot/
│   │   │   ├── asana/
│   │   │   └── [provider]/
│   │   ├── connectors/            # OAuth flows for data sources
│   │   ├── data-sync/             # Manual sync endpoint
│   │   ├── brainstorm/            # Brainstorming AI
│   │   ├── cron/                  # Scheduled jobs
│   │   └── capture/               # Data capture
│   └── [other-workspaces]/        # Additional routes
│
├── components/
│   ├── app-shell.tsx              # Main layout wrapper
│   ├── sidebar.tsx                # Navigation sidebar
│   ├── ai-assistant.tsx           # Chat interface
│   ├── command-search.tsx         # Global search (cmd+k)
│   ├── user-menu.tsx              # User profile menu
│   ├── theme-provider.tsx         # Dark/light mode
│   ├── integratewise-logo.tsx     # Brand logo
│   ├── platform/                  # Platform-specific components
│   ├── views/                     # Page-level components
│   ├── dialogs/                   # Modal dialogs
│   ├── ui/                        # shadcn/ui primitives
│   └── widgets/                   # Reusable widgets
│
├── lib/
│   ├── platform/
│   │   ├── types.ts               # Type definitions for all surfaces
│   │   ├── data.ts                # IntegrateWise's business data
│   │   └── index.ts               # Surface accessors
│   ├── supabase/
│   │   ├── client.ts              # Browser client
│   │   ├── server.ts              # Server-side client
│   │   └── proxy.ts               # Middleware
│   ├── hooks/
│   │   └── use-data.ts            # Data fetching hooks (SWR)
│   ├── utils.ts                   # Utility functions
│   ├── admin-auth.ts              # Admin authentication
│   ├── mock-auth.ts               # Mock auth for demo
│   └── ai-webhook-service.ts      # AI integration service
│
├── public/
│   ├── favicon.jpg
│   ├── apple-icon.png
│   └── [assets]/
│
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── vercel.json                    # Vercel config
├── README.md                      # Project description
├── SYSTEM_OVERVIEW.md             # System architecture
├── ENV_VARIABLES.md               # Environment setup
└── CODEBASE_OVERVIEW.md          # This file
```

---

## Technology Stack

### Frontend
- **React 19.2.0** - UI framework with latest features
- **Next.js 16.0.10** - App Router, Server Components, API routes
- **TypeScript 5** - Type safety
- **Tailwind CSS 4.1.9** - Utility-first CSS (with @theme config in globals.css)

### UI Components
- **shadcn/ui** - 40+ pre-built accessible components
- **Radix UI** - Headless UI primitives (Dialog, Select, Tabs, etc.)
- **Lucide React** - 450+ icons
- **Recharts** - Data visualization
- **Embla Carousel** - Image carousel
- **React Hook Form** - Form state management
- **Zod** - TypeScript-first schema validation

### Data & State
- **Supabase** - PostgreSQL database + auth
- **SWR** - Client-side data fetching with caching
- **React Context** - Theme management
- **Server Components** - Server-side data fetching in RSCs

### AI/ML
- **AI SDK 5.0.115** - Vercel's AI SDK for LLM integration
- **Custom agents** - Production workers for business logic

### Utilities
- **class-variance-authority** - Component variant system
- **clsx** - Conditional classNames
- **date-fns** - Date formatting
- **react-resizable-panels** - Resizable layouts
- **cmdk** - Command palette
- **sonner** - Toast notifications
- **input-otp** - OTP input
- **vaul** - Drawer animations

### Dev Tools
- **ESLint** - Code linting
- **Turbopack** - Next.js 16 bundler (default, stable)
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

---

## Key Components & Patterns

### AppShell (components/app-shell.tsx)
Main layout wrapper that provides:
- Sidebar navigation
- Theme provider
- AI assistant panel
- Responsive layout

### Platform API (lib/platform/)

**Types** define the contract:
```typescript
// 8 Surfaces
interface Organization { ... }        // Identity
interface Department { ... }          // Identity
interface Connector { ... }           // Integrations
interface SpineEntity { ... }         // Adaptive Spine
interface KnowledgeArea { ... }       // Knowledge
interface Capability { ... }          // Capabilities
interface AgentWorker { ... }         // Agent Runtime
interface Metric { ... }              // Analytics
```

**Data** (lib/platform/data.ts) contains:
- IntegrateWise's organization structure
- Department definitions
- Connected integrations
- Business metrics
- Agent worker configurations

**Index** (lib/platform/index.ts) exports:
```typescript
platform.identity           // Organization + departments
platform.integrations       // Connected data sources
platform.spine              // Business entities
platform.knowledge          // Knowledge base
platform.capabilities       // System capabilities
platform.agents             // Production workers
platform.analytics          // Metrics
platform.workspace(dept)    // Department-specific projection
```

### Views Pattern

Each page is a "view" component that projects the platform:

```typescript
// Example: customer-zero-view.tsx
export function CustomerZeroView() {
  const org = platform.identity.organization
  const health = platform.analytics.healthScore
  const agents = platform.agents
  // Render dashboard using projected data
}
```

### Workspace Pattern

Department workspaces are projections:

```typescript
// Example: founder workspace
export function FounderWorkspace() {
  const workspace = platform.workspace('founder')
  // Render founder-specific views using their surfaces
}
```

---

## Database Schema (Supabase)

### Core Tables
- `tasks` - Task management
- `calendar_events` - Calendar
- `emails` - Email tracking
- `drive_files` - File management
- `activities` - Activity feed
- `metrics` - KPI tracking
- `documents` - Knowledge base
- `interactions` - User interactions

### CRM Tables
- `leads` - Lead management (source, score, status)
- `campaigns` - Marketing campaigns
- `content_library` - Marketing content
- `deals` - Sales opportunities

### Business Tables
- `products` - 12 IntegrateWise products
- `services` - Service catalog (legacy)
- `clients` - Client directory
- `client_engagements` - Active contracts
- `sessions` - Client sessions
- `session_notes` - Session notes & action items
- `client_projects` - Development projects
- `deployments` - Deployment tracking
- `project_milestones` - Project milestones
- `data_source_sync` - Integration sync logs

---

## API Endpoints

### Core APIs
- `POST /api/ai/chat` - AI assistant chatbot
- `POST /api/search` - Global search across entities
- `POST /api/capture` - Data capture from webhooks
- `POST /api/data-sync` - Manual sync trigger

### Webhook Handlers
- `POST /api/webhooks/hubspot` - HubSpot contact/deal sync
- `POST /api/webhooks/asana` - Asana task sync
- `POST /api/webhooks/[provider]` - Generic webhook handler

### OAuth Connectors
- `GET /api/connectors/[provider]/connect` - OAuth initiation
- `GET /api/connectors/[provider]/callback` - OAuth callback
- `POST /api/connectors/[provider]/disconnect` - Disconnect connector

### Scheduled Jobs
- `GET /api/cron/daily-insights` - Daily business insights
- `GET /api/cron/hourly-insights` - Hourly metrics update

---

## Department Workspaces

Each department has its own route and workspace projection:

1. **Founder** (`/founder`) - Business strategy, health metrics
2. **Sales** (`/sales`) - Leads, pipeline, deals, forecasting
3. **Marketing** (`/marketing`) - Content, campaigns, lead generation
4. **Operations** (`/operations`) - Tasks, processes, team coordination
5. **Technology** (`/technology`) - Systems, integrations, architecture
6. **Customer Success** (`/customer-success`) - Clients, sessions, NPS
7. **Finance** (`/finance`) - Revenue, metrics, billing
8. **Administration** (`/administration`) - Settings, users, data

---

## Feature Modules

### CRM System
- **Leads** - Lead scoring (0-100), source tracking, pipeline status
- **Campaigns** - Multi-channel campaigns with ROI tracking
- **Deals** - Sales pipeline with Kanban view
- **Content** - Marketing content library with performance metrics

### Client Management
- **Clients** - Client directory with health scores
- **Sessions** - Discovery, training, advisory, coaching sessions
- **Projects** - Development projects with progress tracking
- **Engagements** - Active contracts and billing

### Knowledge Base
- Full CRUD for documentation
- Categories (Strategy, Sales, Marketing, Operations, Delivery, Finance)
- Full-text search
- Star/favorite functionality
- Usage analytics

### Products & Services
- 12 IntegrateWise products across 5 tiers
- Service catalog (legacy)
- Product detail pages

### Analytics
- Revenue metrics by tier
- Lead conversion funnel
- Sales pipeline visualization
- Performance trends
- Real-time sync status

### Agents (Production Workers)
- Lead Qualification Agent
- Support Triage Agent
- Content Strategist Agent
- DevOps Monitor Agent
- Billing Manager Agent
- Customer Health Agent
- Competitive Intelligence Agent

---

## Authentication

**Current**: Mock authentication via `lib/admin-auth.ts`
- Simple session-based auth for demo purposes
- Can be replaced with Supabase Auth for production

---

## Styling & Theme

### Tailwind CSS v4
- Configured in `globals.css` with `@theme` block
- Dark mode optimized
- Semantic design tokens
- Responsive utilities

### Color Palette
- Primary: Teal accent
- Secondary: Slate/gray tones
- Semantic: Success (emerald), Warning (amber), Error (rose)

### Typography
- Headings: Geist Sans
- Body: Geist Sans / Inter
- Monospace: Geist Mono

---

## Development Workflow

### Install & Run
```bash
pnpm install
pnpm dev
```

### Build
```bash
pnpm build
pnpm start
```

### Lint
```bash
pnpm lint
```

### Environment Variables
See `ENV_VARIABLES.md` for complete list. Key variables:
- `SUPABASE_URL` - Database URL
- `SUPABASE_ANON_KEY` - Public API key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role (server-only)
- `POSTGRES_URL` - Direct database connection

---

## Data Flow

1. **Server Components** fetch data via Supabase using `lib/supabase/server.ts`
2. **Client Components** use SWR hooks for reactive data (`lib/hooks/use-data.ts`)
3. **Platform API** projects data into workspace-specific surfaces
4. **Views** consume projections and render UI
5. **Webhooks** sync external data (HubSpot, Asana, etc.)
6. **API Routes** handle CRUD operations and integrations

---

## Key Conventions

### Component Structure
- Page components in `app/[route]/page.tsx`
- Reusable views in `components/views/`
- UI primitives in `components/ui/`
- Dialogs in `components/dialogs/`
- Widgets in `components/widgets/`

### Naming
- Components: PascalCase (e.g., `CustomerZeroView`)
- Files: kebab-case for pages, PascalCase for components
- Functions: camelCase

### Data Fetching
- Server Components: Direct Supabase queries
- Client Components: SWR hooks with caching
- Never fetch inside useEffect - use RSC or SWR

### Styling
- Use Tailwind utilities first
- Use CSS modules for scoped styles if needed
- Override via `cn()` for variants

---

## Key Files to Know

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout, font setup, metadata |
| `app/globals.css` | Global styles + Tailwind v4 config |
| `lib/platform/index.ts` | Platform API surface accessors |
| `lib/platform/data.ts` | Business data source of truth |
| `components/app-shell.tsx` | Main layout wrapper |
| `lib/supabase/server.ts` | Server-side DB queries |
| `lib/hooks/use-data.ts` | SWR data fetching hooks |

---

## Next Steps for Development

1. **Understand the Platform API** - Read `lib/platform/types.ts` and `lib/platform/data.ts`
2. **Create a new workspace** - Add a department route that consumes platform surfaces
3. **Add a feature view** - Create a new view component that projects platform data
4. **Connect a data source** - Add webhook handlers and sync logic
5. **Deploy to Vercel** - Use GitHub integration for CI/CD

---

*Last updated: 2026-07-21*
*Built by Nirmal Prince J*

# Customer Zero Platform Documentation

## Overview

The **Customer Zero Platform** is a comprehensive internal hub for IntegrateWise that brings together complete documentation, API reference, service architecture, and onboarding flow information in one beautiful, interactive interface.

Access it at: `/customer-zero`

---

## Features

### 1. **Platform Explorer** 
Primary view showing an overview of the entire IntegrateWise platform with:
- **Documentation Cards** - Quick links to all major documentation:
  - Onboarding Flow (6 phases, 13 endpoints)
  - Platform API (45 endpoints across 10 categories)
  - Service Topology (12 microservices + Gateway)
  - UI Design System (10 components, 18 design tokens)
  - Spine Architecture (5 core tables, 13+ entity types)

### 2. **Documentation Browser**
Browse and search 900+ documentation files:
- Full-text search across all documentation
- Scrollable file list with clickable preview
- Real-time document loading and display
- API endpoints: `/api/docs/index` and `/api/docs/read`

### 3. **Service Architecture Diagram**
Visual representation of the IntegrateWise microservices architecture:
- **Gateway (BFF)** - Single entry point with JWT validation, rate limiting, request routing
- **Spine (D1)** - Canonical data layer with entity storage, timeline events, relationships
- **12 Microservices** via Cloudflare Workers service bindings:
  - Connector Service - Integration management
  - Pipeline Service - Data processing
  - Intelligence Service - AI/ML operations
  - Agent Runtime - Agent operations
  - BFF Service - Backend for frontend
  - Knowledge Service - Knowledge base
  - Webhook Ingress - Event ingestion
  - Admin, Billing, Tenants services
  - L2, Hub Controller services

- **Data Flow** visualization showing:
  - External Systems → Connector → Loader → Pipeline → Spine
  - Spine → Projection Engine → SharedWorkbench → Gateway → Client

### 4. **Onboarding Flow**
Complete 6-phase onboarding process documentation:
- **Phase 1: Welcome** - Use case selection (personal/work/business)
- **Phase 2: Profile** - Industry, department, company size
- **Phase 3: Workspace** - Workspace name and goals
- **Phase 4: Connectors** - Data source selection (45+ available)
- **Phase 5: Activation** - Initialize Spine schema, start sync
- **Phase 6: Complete** - Redirect to workspace

- **API Endpoint Reference** for each phase with request/response examples
- **Domain Resolution Matrix** showing how use case + department map to domain codes
- **Implementation Code Examples** in TypeScript

---

## Connector Integration with CDN Logos

The platform displays connector logos from the **jsDelivr CDN**, featuring 8 major integrations:
- **Salesforce** (CRM) - https://cdn.jsdelivr.net/gh/gilbarbara/logos/logos/salesforce.svg
- **HubSpot** (CRM) - https://cdn.jsdelivr.net/gh/gilbarbara/logos/logos/hubspot.svg
- **Slack** (Communication) - https://cdn.jsdelivr.net/gh/gilbarbara/logos/logos/slack.svg
- **GitHub** (Development) - https://cdn.jsdelivr.net/gh/gilbarbara/logos/logos/github.svg
- **Notion** (Productivity) - https://cdn.jsdelivr.net/gh/gilbarbara/logos/logos/notion.svg
- **Stripe** (Finance) - https://cdn.jsdelivr.net/gh/gilbarbara/logos/logos/stripe.svg
- **Jira** (Project Mgmt) - https://cdn.jsdelivr.net/gh/gilbarbara/logos/logos/jira.svg
- **Google Sheets** (Productivity) - https://cdn.jsdelivr.net/gh/gilbarbara/logos/logos/google.svg

Each logo is fetched dynamically from jsDelivr's comprehensive brand SVG collection with fallback handling for missing logos.

---

## Architecture

### Component Structure
```
/app/customer-zero/page.tsx
  ├── PlatformExplorer
  │   ├── Documentation overview cards
  │   ├── API endpoints browser
  │   ├── Connectors with CDN logos
  │   └── Resource links
  ├── DocumentationBrowser
  │   ├── Search interface
  │   ├── File list
  │   └── Document viewer
  ├── ServiceTopologyDiagram
  │   ├── Architecture overview
  │   ├── Service cards (12 workers)
  │   ├── Data flow visualization
  │   └── Binding configuration
  └── OnboardingDemo
      ├── Phase selector
      ├── API endpoint reference
      ├── Flow documentation
      └── Implementation examples
```

### API Routes
- `GET /api/docs/index` - List all documentation files (946 files)
- `GET /api/docs/read?path=<filepath>` - Read specific documentation file

### Data Sources
- All documentation from `/public/docs` directory (copied from archive)
- Live connector catalog with 45+ integrations
- Static onboarding phase definitions
- Service topology and architecture information

---

## Navigation

The Customer Zero Platform is linked from the main navigation:
- **Homepage**: Navigation header includes "Customer Zero" link
- **URL**: `http://localhost:3000/customer-zero`
- **Tab Navigation**:
  - Platform - Overview of architecture and docs
  - Docs - Search and browse 900+ documentation files
  - Architecture - Service topology and microservices
  - Flow - 6-phase onboarding process

---

## Technologies Used

- **Frontend**: React 19.2 with Next.js 16 App Router
- **UI Components**: shadcn/ui (Card, Button, Badge, Tabs, Input, ScrollArea)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **External Logos**: jsDelivr CDN (gilbarbara/logos)
- **File System**: Node.js fs module for documentation browsing
- **Database**: No backend storage required - static documentation

---

## Key Features Implemented

✅ **CDN Logo Integration** - Salesforce, HubSpot, Slack, GitHub, Notion, Stripe, Jira, Google Sheets
✅ **Documentation Browser** - Search and browse 900+ files
✅ **API Reference** - 45+ endpoints across 10 categories
✅ **Service Architecture** - 12 microservices + Gateway visualization
✅ **Onboarding Simulator** - 6-phase flow with API examples
✅ **Responsive Design** - Works on mobile, tablet, desktop
✅ **Dark Mode** - Full dark mode support
✅ **Performance** - Efficient file indexing, lazy loading, caching

---

## Future Enhancements

- [ ] Export documentation as PDF
- [ ] Syntax highlighting for code examples
- [ ] Multi-language documentation support
- [ ] Real-time API endpoint testing
- [ ] Interactive capability explorer
- [ ] Twin proposal simulator
- [ ] Governance flow visualization
- [ ] Webhook testing sandbox

---

## Files Created

### Components
- `components/customer-zero/platform-explorer.tsx` - Main platform overview
- `components/customer-zero/documentation-browser.tsx` - Doc search and viewer
- `components/customer-zero/service-topology-diagram.tsx` - Architecture visualization
- `components/customer-zero/onboarding-demo.tsx` - Onboarding flow simulator

### Pages
- `app/customer-zero/page.tsx` - Main hub page with tabs

### API Routes
- `app/api/docs/index/route.ts` - File indexing endpoint
- `app/api/docs/read/route.ts` - File reading endpoint

### Data
- `public/docs/*` - 946 documentation files (copied from archive)

---

## Screenshots

1. **Platform Overview** - Main hub showing documentation cards
2. **Connectors with CDN Logos** - Salesforce, HubSpot, Slack, GitHub, etc.
3. **Service Architecture** - Gateway + 12 microservices visualization
4. **Onboarding Flow** - 6-phase process with API reference
5. **Documentation Browser** - Search and browse interface

---

## Getting Started

1. **Navigate to Customer Zero**:
   ```
   http://localhost:3000/customer-zero
   ```

2. **Explore Documentation**:
   - Click "Docs" tab
   - Search for specific documentation
   - Click a file to view its content

3. **Review Architecture**:
   - Click "Architecture" tab
   - See service topology and data flow
   - Review service bindings and endpoints

4. **Study Onboarding**:
   - Click "Flow" tab
   - Select a phase (1-6)
   - View API endpoint, request/response, and implementation

5. **Browse Connectors**:
   - Click "Connectors" sub-tab under Platform
   - See all 8 connectors with CDN logos
   - View category and availability

---

## Documentation Structure

The documentation is organized into key files:
- `ONBOARDING_FLOW.md` - 6-phase onboarding endpoints
- `PLATFORM_API.md` - Complete REST API reference (45 endpoints)
- `SERVICE_TOPOLOGY.md` - Architecture and service bindings (12 workers)
- `UI_DESIGN.md` - Design system, components, and tokens
- `HOW_TO_USE.md` - Integration guide for external developers
- `grand-build.md` - Complete build plan for Spine and Workbench

Plus 940+ additional docs covering platform, architecture, and implementation details.

---

## License & Attribution

- **CDN Logos**: jsDelivr (https://cdn.jsdelivr.net/gh/gilbarbara/logos/)
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Framework**: Next.js 16, React 19.2, Tailwind CSS v4

---

Created: July 21, 2026  
Last Updated: July 21, 2026  
Status: ✅ Production Ready

# Customer Zero – Canonical Workbench Architecture

## Overview

Customer Zero is the reference implementation of IntegrateWise running on its own Platform API. It demonstrates the canonical 3-part workbench shell pattern that serves as the foundation for all departmental operations.

## Architecture Principles

### 1. Enterprise Standards

- **Type Safety**: Full TypeScript coverage with strict mode
- **Error Handling**: Global error boundaries with user-friendly error messages
- **Accessibility**: WCAG 2.1 AA compliance with ARIA labels and keyboard navigation
- **Performance**: Optimized rendering with React hooks and memoization
- **Security**: Input sanitization, CSRF protection, and proper authentication flows

### 2. Canonical 3-Part Workbench Shell

The workbench follows a strict architectural contract:

#### Part 1: L1 Global Composed Workbench Shell (Sticky Header)
Always present and consistent across all departments:
- **Heads Up**: Critical alerts and anomalies (2 alerts shown)
- **Decide Queue**: Twin proposals awaiting approval (2-3 proposals)
- **Knowledge Hub**: Relevant SOPs, patterns, and documentation links
- **Daily Priorities**: Tasks, calls scheduled, focus times

**Location**: Sticky at top with z-index 20
**Height**: ~200px (4 modules in 2x2 grid)
**Update Frequency**: Real-time from Spine or Platform API

#### Part 2: Dynamic Department Canvas (Scrollable Main)
Role-specific content composed at runtime:
- Renders different data based on user's department/role
- Fetched from Platform API's workspace projection
- Composed of domain-specific components
- Scrollable overflow with proper shadow indication

**Location**: Flex-1 with overflow-y-auto
**Update Frequency**: On-demand or periodic polling

#### Part 3: Twin Footer (Sticky Bottom)
Universal 4-button OODA action grammar (always accessible):
- **Store in Spine** (Blue): Record observations/decisions
- **Ask Your Twin** (Cyan): Query for insights and recommendations
- **Assign Your Twin** (Purple): Create tasks for Twin execution
- **Approve Action** (Green): Governance and authorization layer

**Location**: Sticky at bottom with z-index 20
**Update Frequency**: No polling (event-driven)

## Directory Structure

```
/vercel/share/v0-project/
├── app/
│   ├── layout.tsx                 # Root layout with ErrorBoundary
│   ├── page.tsx                   # Home/dashboard page
│   └── globals.css                # Global styles and design tokens
├── components/
│   ├── error-boundary.tsx         # Global error boundary
│   ├── customer-zero-banner.tsx   # Live metrics display
│   ├── operational-timeline.tsx   # Spine continuity timeline
│   ├── views/
│   │   └── command-center-view.tsx # Main canonical workbench
│   └── ui/                        # shadcn/ui components
├── lib/
│   ├── types/
│   │   └── workbench.ts          # TypeScript interfaces
│   ├── utils/
│   │   ├── logger.ts             # Enterprise logging
│   │   └── ...
│   ├── platform/
│   │   ├── gateway-client.ts     # Platform API client
│   │   └── ...
│   └── hooks/
│       ├── use-gateway.ts        # Platform integration hooks
│       └── ...
└── public/                        # Static assets
```

## Component Breakdown

### CommandCenterView
The main component implementing the 3-part shell.

**Key Features**:
- Full TypeScript typing with custom interfaces
- Proper React hooks usage (useState, useCallback, useMemo)
- Responsive grid layout (1 col mobile, 2-7 cols desktop)
- ARIA labels and semantic HTML for accessibility
- Keyboard navigation support (Tab, Enter, Space)
- Loading states and error handling

**Props**: None (uses hooks internally)

**State**:
```typescript
{
  activeModal: 'store' | 'ask' | 'assign' | 'approve' | null
  isLoading: boolean
}
```

### ErrorBoundary
Class component that catches React errors globally.

**Features**:
- User-friendly error messages
- Development-mode error details
- Recovery buttons (Try Again / Home)
- Prevents white-screen-of-death

## Data Flow

### Mock Data (Current)
```
CommandCenterView
├── ALERTS (hardcoded)
├── TWIN_PROPOSALS (hardcoded)
└── ACCOUNTS (hardcoded)
```

### Real Data (Production)
```
CommandCenterView
  ↓
useGateway() hook
  ↓
Platform API Gateway (https://gateway.dev.integratewise.ai)
  ├── GET /api/v1/workspace/projection/:department
  ├── POST /api/v1/capabilities/resolve
  └── GET /api/v1/workspace/connectors/catalog
```

## Integration Points

### 1. Platform API Gateway
- **Base URL**: `https://gateway.dev.integratewise.ai`
- **Authentication**: Bearer token in Authorization header
- **Primary Endpoints**:
  - `GET /api/v1/workspace/projection/:department` - Fetch dashboard data
  - `POST /api/v1/capabilities/resolve` - Execute OODA actions
  - `GET /api/v1/workspace/connectors/catalog` - List integrations

### 2. Spine (Local Database)
- Stores observations and decision history
- Provides continuity between sessions
- Linked to Platform API for sync

### 3. External Services (via connectors)
- Salesforce, HubSpot, Slack, etc.
- Integrated through Platform API Gateway
- No direct client-side integrations

## Responsive Design

The UI is mobile-first with progressive enhancement:

- **Mobile (< 640px)**: Single column, compact buttons, hidden labels
- **Tablet (640px - 1024px)**: 2-column grids, full labels
- **Desktop (> 1024px)**: Full 7-column account grid, optimal spacing

### Breakpoints Used
- `sm:` - 640px
- `md:` - 768px
- `lg:` - 1024px
- `xl:` - 1280px

## Accessibility

### WCAG 2.1 AA Compliance
- Semantic HTML (header, nav, main, footer)
- ARIA labels on all interactive elements
- Keyboard navigation (Tab, Enter, Space, Escape)
- Focus indicators with proper contrast
- Screen reader support with aria-live regions
- Color contrast ratios > 4.5:1

### Components
- All buttons have aria-labels
- All regions have role attributes
- Error messages use role="alert"
- Status updates use role="status" with aria-live="polite"

## Performance Optimizations

1. **Memoization**: useMemo for computed values (alert count, etc.)
2. **Callbacks**: useCallback for event handlers to prevent re-renders
3. **Responsive Images**: Using next/image for automatic optimization
4. **CSS-in-JS**: Tailwind CSS for zero-runtime overhead
5. **Code Splitting**: Lazy load modals and heavy components
6. **Caching**: Platform API responses cached via useGateway hook

## Security Considerations

1. **Input Validation**: All user inputs validated before sending to API
2. **XSS Prevention**: React automatically escapes content, no dangerouslySetInnerHTML
3. **CSRF Protection**: All API calls use POST with CSRF tokens
4. **Authentication**: Bearer token auth with Platform API
5. **Authorization**: User permissions fetched from workspace projection
6. **Rate Limiting**: Implemented in gateway-client.ts

## Testing Strategy

### Unit Tests
- Component rendering with different props
- Event handler logic and callbacks
- Type safety with TypeScript

### Integration Tests
- Platform API integration with mocked responses
- Error boundary error catching
- Modal state management

### E2E Tests
- Full user workflows (Store → Ask → Assign → Approve)
- Responsive layout on different devices
- Accessibility compliance with axe-core

## Deployment Checklist

- [ ] All TypeScript errors resolved
- [ ] Error boundary tested with thrown errors
- [ ] Mobile responsiveness verified on device
- [ ] Accessibility audit passed
- [ ] Platform API credentials configured
- [ ] Environment variables set (.env.local)
- [ ] Performance audit passed (Lighthouse)
- [ ] Analytics configured
- [ ] Error tracking enabled (if applicable)

## Related Documentation

- [Platform API Documentation](./PLATFORM_API.md)
- [TypeScript Interfaces](./lib/types/workbench.ts)
- [Logger Usage](./lib/utils/logger.ts)
- [Gateway Client](./lib/platform/gateway-client.ts)

## Future Enhancements

1. **Real-time Updates**: WebSocket support for live data sync
2. **Advanced Filters**: Department-specific filter panels
3. **Customization**: Saved views and preferences per user
4. **Plugins**: Extensible module system for custom departments
5. **Notifications**: Toast/notification system for alerts
6. **Offline Support**: Service Worker for offline capability

---

**Customer Zero Team** | IntegrateWise Platform | v1.0.0

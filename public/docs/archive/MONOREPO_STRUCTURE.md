# IntegrateWise Monorepo Structure


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

## High-Level Vision

```
integratewise/
├── apps/                      # User-facing applications
│   ├── ai-workspace/          # Flagship app (L3 Twin + L4 Memory + L2 Intelligence)
│   ├── workbench-sales/       # Sales (Coming v1.1)
│   ├── workbench-cs/          # Customer Success (Coming v1.1)
│   ├── wise-docs/             # Documentation (Coming v1.2)
│   ├── wise-ops/              # Operations (Coming v1.2)
│   ├── wise-branding/         # Branding (Coming v1.3)
│   ├── wise-erms/             # People/HRIS (Coming v1.3)
│   └── admin/                 # Settings & platform admin
│
├── packages/                  # Shared platform services & UI
│   ├── platform/
│   │   ├── gateway/           # Request routing, identity resolution
│   │   ├── spine/             # Adaptive Spine SDK
│   │   ├── memory/            # Memory service SDK
│   │   ├── entity360/         # Entity resolution
│   │   ├── governance/        # Policy enforcement
│   │   └── skills/            # Reusable actions
│   │
│   ├── auth/
│   │   ├── stack-config/      # Stack Auth setup
│   │   ├── middleware/        # Auth middleware
│   │   └── hooks/             # useAuth, useSession, etc.
│   │
│   ├── ui/
│   │   ├── components/        # shadcn components + custom
│   │   ├── hooks/             # useWorkbench, useTwin, etc.
│   │   ├── layouts/           # AppShell, AiWorkspaceShell, etc.
│   │   └── theme/             # Design tokens, colors, typography
│   │
│   ├── design-system/         # Tailwind config, CSS variables
│   ├── shared/                # Utilities, types, constants
│   └── api-client/            # Generated API client
│
├── services/                  # Backend services (non-Next.js)
│   ├── gateway/               # API gateway
│   ├── spine/                 # Spine service
│   ├── memory/                # Memory service
│   ├── loader/                # Data loader
│   ├── normalizer/            # Data normalizer
│   └── identity/              # Identity service
│
├── infrastructure/            # Deployment, CI/CD, monitoring
│   ├── docker/
│   ├── k8s/
│   ├── terraform/
│   └── monitoring/
│
├── docs/                      # Architecture, guides, specs
│   ├── architecture/          # System design docs
│   ├── api/                   # API reference
│   ├── guides/                # How-to guides
│   └── specs/                 # Release specs, RFCs
│
└── scripts/                   # Development & deployment scripts
    ├── setup.sh
    ├── dev.sh
    └── deploy.sh
```

---

## apps/ — User-Facing Applications

Each app is a full Next.js 16 application that consumes platform services via packages/.

### ai-workspace/

**Current: ✅ Live**

Entry point for AI-first users. Primary Release 1.0 app.

```
apps/ai-workspace/
├── app/
│   ├── layout.tsx             # Root layout with providers
│   ├── page.tsx               # AI Home
│   ├── (workspace)/
│   │   ├── layout.tsx         # AI Workspace layout
│   │   ├── chat/page.tsx      # Twin Chat
│   │   ├── memory/page.tsx    # Memory Search
│   │   └── actions/page.tsx   # Recent Actions
│   └── api/
│       ├── chat/route.ts      # Chat API
│       └── memory/route.ts    # Memory API
├── components/
│   ├── ai-home/
│   ├── twin-chat/
│   ├── memory-search/
│   └── shared/
├── hooks/
│   ├── useChat.ts
│   ├── useMemory.ts
│   └── useTwin.ts
├── styles/
│   └── ai-workspace.css       # App-specific overrides
└── package.json
```

### workbench-sales/ (Shell)

**Current: 🟡 Navigation Only**

Coming v1.1 as a full application.

```
apps/workbench-sales/
├── app/
│   ├── layout.tsx
│   ├── page.tsx               # Dashboard (shell)
│   ├── accounts/page.tsx      # Coming soon
│   ├── opportunities/page.tsx # Coming soon
│   └── twin/page.tsx          # Coming soon
├── components/
│   ├── dashboard/
│   └── coming-soon-banner/
└── package.json
```

### workbench-cs/ (Shell)

**Current: 🟡 Navigation Only**

Coming v1.1.

### wise-docs/ (Shell)

**Current: 🟡 Navigation Only**

Coming v1.2.

### wise-ops/ (Shell)

**Current: 🟡 Navigation Only**

Coming v1.2.

### wise-branding/ (Shell)

**Current: 🟡 Navigation Only**

Coming v1.3.

### wise-erms/ (Shell)

**Current: 🟡 Navigation Only**

Coming v1.3.

### admin/

**Current: 🟡 Partial Implementation**

Settings and platform administration.

```
apps/admin/
├── app/
│   ├── settings/page.tsx      # Organization settings
│   ├── users/page.tsx         # User directory
│   ├── roles/page.tsx         # Role management
│   ├── connectors/page.tsx    # Connected apps
│   └── audit/page.tsx         # Audit log
└── components/
    ├── user-form/
    ├── role-editor/
    └── connector-manager/
```

---

## packages/ — Shared Platform

### platform/gateway/

**SDK for Gateway access.**

```
packages/platform/gateway/
├── src/
│   ├── gateway-client.ts      # Main client
│   ├── types/
│   │   ├── requests.ts
│   │   └── responses.ts
│   └── hooks/
│       ├── useGateway.ts
│       └── useIdentity.ts
├── tests/
├── package.json
└── README.md
```

Usage in apps:

```typescript
import { useGateway } from "@integratewise/gateway"

const { user, org, role } = useGateway()
const users = await gateway.getUsers()
```

### platform/spine/

**SDK for Adaptive Spine access.**

```
packages/platform/spine/
├── src/
│   ├── spine-client.ts
│   ├── types/
│   │   ├── schema.ts          # Entity types
│   │   └── operations.ts
│   └── hooks/
│       ├── useSpine.ts
│       ├── useCustomers.ts
│       ├── useProjects.ts
│       └── useTasks.ts
├── tests/
├── package.json
└── README.md
```

Usage in apps:

```typescript
import { useSpine } from "@integratewise/spine"

const { customers, loading } = useSpine().getCustomers()
const customer = await spine.getEntityById("customer", id)
```

### platform/memory/

**SDK for Memory access.**

```
packages/platform/memory/
├── src/
│   ├── memory-client.ts
│   ├── types/
│   │   ├── conversation.ts
│   │   ├── decision.ts
│   │   └── timeline.ts
│   └── hooks/
│       ├── useMemory.ts
│       ├── useConversations.ts
│       ├── useTimeline.ts
│       └── useSearch.ts
├── tests/
├── package.json
└── README.md
```

### platform/entity360/

**SDK for Entity360 resolution.**

Unified view of any entity (customer, project, person, etc.).

```
packages/platform/entity360/
├── src/
│   ├── entity360-client.ts
│   ├── types/
│   │   └── entity.ts
│   └── hooks/
│       └── useEntity360.ts
└── package.json
```

Usage:

```typescript
const entity = await entity360.resolve("customer", customerId)
// Returns customer data + relationships + context
```

### platform/governance/

**Policy enforcement SDK.**

```
packages/platform/governance/
├── src/
│   ├── governance-client.ts
│   ├── types/
│   │   ├── policy.ts
│   │   ├── context.ts
│   │   └── decision.ts
│   └── hooks/
│       ├── usePolicy.ts
│       └── useCanAccess.ts
└── package.json
```

### platform/skills/

**Reusable actions SDK.**

```
packages/platform/skills/
├── src/
│   ├── skill-registry.ts
│   ├── types/
│   │   └── skill.ts
│   ├── builtin/
│   │   ├── send-email.ts
│   │   ├── create-task.ts
│   │   ├── update-customer.ts
│   │   └── send-message.ts
│   └── hooks/
│       ├── useSkills.ts
│       └── useExecuteSkill.ts
└── package.json
```

### auth/

**Authentication setup & hooks.**

```
packages/auth/
├── src/
│   ├── stack-provider.tsx     # StackProvider wrapper
│   ├── middleware.ts          # Auth middleware
│   ├── types/
│   │   ├── user.ts
│   │   ├── session.ts
│   │   └── auth.ts
│   └── hooks/
│       ├── useAuth.ts
│       ├── useUser.ts
│       └── useSession.ts
├── tests/
├── package.json
└── README.md
```

### ui/

**Shared UI components & design system.**

```
packages/ui/
├── src/
│   ├── components/            # shadcn + custom
│   │   ├── sidebar/
│   │   ├── card/
│   │   ├── button/
│   │   ├── input/
│   │   ├── dialog/
│   │   └── custom/
│   │       ├── app-shell/
│   │       ├── ai-workspace-shell/
│   │       └── navigation/
│   ├── hooks/
│   │   ├── useWorkbench.ts
│   │   ├── useTwin.ts
│   │   └── useTheme.ts
│   ├── layouts/
│   │   ├── app-layout.tsx
│   │   ├── workspace-layout.tsx
│   │   └── admin-layout.tsx
│   ├── theme/
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── tokens.ts
│   └── styles/
│       └── globals.css
├── tests/
├── package.json
└── README.md
```

### design-system/

**Tailwind & design tokens.**

```
packages/design-system/
├── tailwind.config.ts
├── globals.css
├── tokens.css               # CSS variables
├── src/
│   ├── colors.ts
│   ├── spacing.ts
│   ├── typography.ts
│   └── theme.ts
└── package.json
```

### shared/

**Utilities, types, constants.**

```
packages/shared/
├── src/
│   ├── types/
│   │   ├── user.ts
│   │   ├── org.ts
│   │   ├── entity.ts
│   │   └── errors.ts
│   ├── utils/
│   │   ├── format.ts
│   │   ├── validate.ts
│   │   ├── parse.ts
│   │   └── api.ts
│   ├── constants/
│   │   ├── routes.ts
│   │   ├── roles.ts
│   │   └── permissions.ts
│   └── hooks/
│       ├── useLocalStorage.ts
│       ├── useAsync.ts
│       └── useDebounce.ts
├── tests/
├── package.json
└── README.md
```

### api-client/

**Generated API client (if using OpenAPI/code-gen).**

```
packages/api-client/
├── src/
│   ├── generated/            # Auto-generated from OpenAPI
│   │   ├── chat.ts
│   │   ├── spine.ts
│   │   └── memory.ts
│   └── client.ts
└── package.json
```

---

## services/ — Backend Services

These are separate services that may be deployed independently.

### services/gateway/

API Gateway service (Node.js or similar).

### services/spine/

Adaptive Spine service.

### services/memory/

Memory service.

### services/loader/

Data loader service.

### services/normalizer/

Data normalizer service.

### services/identity/

Identity resolution service.

---

## Root package.json Scripts

```json
{
  "scripts": {
    "dev": "turbo run dev --parallel",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\"",
    "clean": "turbo run clean && rm -rf node_modules",
    "db:migrate": "cd services/spine && npm run migrate",
    "ai-workspace:dev": "turbo run dev --filter=ai-workspace",
    "ai-workspace:build": "turbo run build --filter=ai-workspace",
    "admin:dev": "turbo run dev --filter=admin"
  }
}
```

---

## pnpm-workspace.yaml

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'packages/platform/*'
  - 'services/*'
  - 'infrastructure/*'
```

---

## Dependency Guidelines

- **apps/** depend on **packages/**
- **packages/** depend on other **packages/** and **shared/**
- **packages/** do NOT depend on **apps/**
- **services/** are independent (deployed separately)
- **All** depend on **shared/**

---

## Deployment Strategy

### CI/CD Pipeline

1. **Lint & Type Check** — All packages
2. **Test** — All packages with tests
3. **Build** — All packages
4. **Build Docker Images** — One per service + one per app
5. **Push to Registry** — Image per artifact
6. **Deploy** — Services first, then apps

### Service Deployment (k8s or cloud-run)

```
gateway/      → Internal load-balanced service
spine/        → Scalable database + API
memory/       → Cache + storage
loader/       → Job runner
normalizer/   → Job runner
identity/     → Microservice
```

### App Deployment (Vercel or similar)

```
ai-workspace/ → Vercel
admin/        → Vercel
(shells)      → Same Vercel project
```

---

## Onboarding New Developer

```bash
# Clone repo
git clone https://github.com/integratewise/integratewise.git
cd integratewise

# Install dependencies
pnpm install

# Start dev server (all apps)
pnpm dev

# Or start specific app
pnpm ai-workspace:dev

# Run tests
pnpm test

# Type check
pnpm type-check
```

---

## Release Process

### Release 1.0
- All packages in packages/
- Single app: ai-workspace/
- Shell apps: workbench-sales/, workbench-cs/, wise-docs/, wise-ops/, wise-branding/, wise-erms/
- Admin app: admin/

### Release 1.1
- workbench-sales/ → Full implementation
- workbench-cs/ → Full implementation

### Release 1.2
- wise-docs/ → Full implementation
- wise-ops/ → Full implementation

### Release 2.0
- Additional workbenches (Finance, Executive, Projects)
- New platform services as needed

# Phase 1 — Monorepo Scaffold


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

**Status:** Ready to Execute  
**Prerequisites:** Frontend Platform Contract (frozen)  
**Deliverable:** Folder structure + workspace config

---

## Directory Structure

Execute these commands to scaffold:

```bash
# Root level
mkdir -p apps packages services

# apps/
mkdir -p apps/{ai-workspace,wise-docs,wise-ops,wise-branding,wise-erms,marketing,pricing,solutions,docs,admin,_template}

# packages/
mkdir -p packages/{ui,design-system,shared,hooks,providers,gateway-sdk,auth-sdk,types,validation}

# services/
mkdir -p services/{gateway,spine,memory,entity360,governance,skills,connected-apps,identity}
```

---

## File: pnpm-workspace.yaml

Create at repository root:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'services/*'

settings:
  autoInstallPeers: true
  dedupePeerDependencies: true
```

---

## File: turbo.json

Create at repository root:

```json
{
  "globalDependencies": ["**/.env.local", ".env.project"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": [],
      "cache": false
    },
    "type-check": {
      "outputs": [],
      "cache": false
    },
    "test": {
      "outputs": ["coverage/**"],
      "cache": false
    }
  }
}
```

---

## File: Root package.json

Add workspace scripts:

```json
{
  "name": "integratewise-platform",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*",
    "services/*"
  ],
  "scripts": {
    "dev": "turbo run dev --parallel",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check",
    "test": "turbo run test",
    "clean": "turbo run clean && rm -rf node_modules",
    "format": "prettier --write \"**/*.{ts,tsx,md,json}\"",
    "prepare": "husky install"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "prettier": "^3.0.0",
    "husky": "^9.0.0"
  }
}
```

---

## File: tsconfig.json (Root)

Create shared TypeScript config:

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@iw-platform/ui": ["packages/ui/src/index.ts"],
      "@iw-platform/design-system": ["packages/design-system/src/index.ts"],
      "@iw-platform/shared": ["packages/shared/src/index.ts"],
      "@iw-platform/hooks": ["packages/hooks/src/index.ts"],
      "@iw-platform/providers": ["packages/providers/src/index.ts"],
      "@iw-platform/gateway-sdk": ["packages/gateway-sdk/src/index.ts"],
      "@iw-platform/auth-sdk": ["packages/auth-sdk/src/index.ts"],
      "@iw-platform/types": ["packages/types/src/index.ts"],
      "@iw-platform/validation": ["packages/validation/src/index.ts"]
    }
  }
}
```

---

## File: .npmrc

Ensure peer dependencies don't conflict:

```ini
shamefully-hoist=true
strict-peer-dependencies=false
```

---

## Folder Structure

After running scaffold commands:

```
integratewise-platform/
│
├── apps/
│   ├── ai-workspace/          (Current Next.js 16 app)
│   ├── wise-docs/             (Shell - Marketing docs)
│   ├── wise-ops/              (Shell - Operations)
│   ├── wise-branding/         (Shell - Brand resources)
│   ├── wise-erms/             (Shell - Entity relationship)
│   ├── marketing/             (Public landing page)
│   ├── pricing/               (Pricing page)
│   ├── solutions/             (Solutions showcase)
│   ├── docs/                  (Developer docs)
│   ├── admin/                 (Admin dashboard)
│   └── _template/             (Template for new apps)
│
├── packages/
│   ├── ui/                    (Shadcn components re-exports)
│   ├── design-system/         (Colors, typography, tokens)
│   ├── shared/                (Types, constants, utilities)
│   ├── hooks/                 (React hooks library)
│   ├── providers/             (Context providers)
│   ├── gateway-sdk/           (API communication layer)
│   ├── auth-sdk/              (Authentication provider)
│   ├── types/                 (Shared TypeScript types)
│   └── validation/            (Zod schemas)
│
├── services/
│   ├── gateway/               (API router)
│   ├── spine/                 (Schema & relationships)
│   ├── memory/                (Conversations & knowledge)
│   ├── entity360/             (Entity data)
│   ├── governance/            (Approvals & audit)
│   ├── skills/                (Agent runtime)
│   ├── connected-apps/        (Integrations)
│   └── identity/              (Auth service)
│
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.json
├── .npmrc
├── package.json
├── FRONTEND_PLATFORM_CONTRACT.md
└── ...
```

---

## Next: Phase 2

Once scaffold is complete:

1. Create `packages/design-system/` with shadcn components
2. Create `packages/shared/` with types and utilities
3. Create `packages/auth-sdk/` with Stack Auth provider
4. Create `packages/gateway-sdk/` with API client
5. Create `packages/ui/` with component re-exports

All other frontend work is downstream.

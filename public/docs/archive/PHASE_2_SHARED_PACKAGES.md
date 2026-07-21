# Phase 2 — Shared Packages


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

**Status:** Ready to Execute  
**Prerequisites:** Phase 1 (Monorepo scaffold complete)  
**Deliverable:** 8 shared packages that all frontends consume

---

## Package Dependency Graph

```
Design System
    ↓
    ├─→ UI (re-exports design system)
    │
Shared Utilities (types, constants, helpers)
    ├─→ Validation (Zod schemas)
    │
    ├─→ Hooks (React hooks using shared types)
    │
Auth SDK
    ├─→ Providers (Context providers using auth SDK)
    │
Gateway SDK (depends on all above)
    │
    └─→ Applications consume Gateway SDK
```

---

## Package 1: Design System

**Path:** `packages/design-system/`

**Purpose:** Single source of truth for visual language

**Exports:**
```typescript
// Colors
export const colors = {
  primary: '#2563eb',
  surface: '#ffffff',
  surfaceAlt: '#f9fafb',
  text: '#09090b',
  textMuted: '#71717a',
  border: '#e4e4e7',
  error: '#ef4444',
  success: '#22c55e',
  warning: '#eab308',
}

// Typography
export const typography = {
  fontSans: 'var(--font-sans)',
  fontMono: 'var(--font-mono)',
  sizes: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
  },
}

// Spacing scale
export const spacing = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  6: '24px',
  8: '32px',
  12: '48px',
}

// Breakpoints
export const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px',
}

// Theme provider
export { ThemeProvider, useTheme } from './providers'

// Tailwind CSS config
export const tailwindConfig = { /* ... */ }
```

**Files:**
- `src/colors.ts`
- `src/typography.ts`
- `src/spacing.ts`
- `src/breakpoints.ts`
- `src/providers/theme-provider.tsx`
- `src/tailwind.config.ts`
- `src/index.ts`

**package.json:**
```json
{
  "name": "@iw-platform/design-system",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": "./dist/index.js",
    "./tailwind": "./dist/tailwind.config.js"
  },
  "dependencies": {
    "tailwindcss": "^4.1.9",
    "react": "^19.0.0"
  }
}
```

---

## Package 2: UI Components

**Path:** `packages/ui/`

**Purpose:** Re-export shadcn/ui components with design system applied

**Exports:**
```typescript
// Core components
export { Button, buttonVariants } from './button'
export { Input, inputVariants } from './input'
export { Card, CardHeader, CardTitle, CardContent } from './card'
export { Dialog, DialogTrigger, DialogContent } from './dialog'
export { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'
export { Checkbox } from './checkbox'
export { Select, SelectTrigger, SelectValue, SelectContent } from './select'
export { Toast, ToastAction, useToast } from './toast'

// Composed components
export { FormField, FormItem, FormLabel, FormControl } from './form'
export { AlertDialog, AlertDialogAction, AlertDialogCancel } from './alert-dialog'

// Re-export design system
export * from '@iw-platform/design-system'
```

**Files:**
- `src/button.tsx`
- `src/input.tsx`
- `src/card.tsx`
- `src/dialog.tsx`
- `src/tabs.tsx`
- ...all shadcn components
- `src/index.ts`

**package.json:**
```json
{
  "name": "@iw-platform/ui",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "dependencies": {
    "@iw-platform/design-system": "workspace:*",
    "@radix-ui/react-dialog": "^1.1.1",
    "@radix-ui/react-tabs": "^1.1.0",
    "react": "^19.0.0"
  }
}
```

---

## Package 3: Shared Types & Utilities

**Path:** `packages/shared/`

**Purpose:** Common types, constants, and helpers

**Exports:**
```typescript
// Types
export type { User, Organization, Session } from './types/auth'
export type { Entity, EntitySchema } from './types/spine'
export type { GatewayError, GatewayResponse } from './types/gateway'
export type { Role, Permission } from './types/rbac'

// Constants
export const ROLES = {
  ADMIN: 'admin',
  OWNER: 'owner',
  MEMBER: 'member',
  GUEST: 'guest',
}

export const PERMISSIONS = {
  READ: 'read',
  WRITE: 'write',
  DELETE: 'delete',
  ADMIN: 'admin',
}

// Utilities
export { cn } from './utils/classnames'
export { formatDate, formatTime } from './utils/date'
export { parseError } from './utils/error'
export { validateEmail, validatePhone } from './utils/validation'
export { delay, retry } from './utils/async'
```

**Files:**
- `src/types/auth.ts`
- `src/types/spine.ts`
- `src/types/gateway.ts`
- `src/types/rbac.ts`
- `src/constants.ts`
- `src/utils/classnames.ts`
- `src/utils/date.ts`
- `src/utils/error.ts`
- `src/utils/validation.ts`
- `src/utils/async.ts`
- `src/index.ts`

---

## Package 4: React Hooks

**Path:** `packages/hooks/`

**Purpose:** Reusable React hooks (non-Gateway)

**Exports:**
```typescript
export { useDebounce } from './useDebounce'
export { useTheme } from './useTheme'
export { useLocalStorage } from './useLocalStorage'
export { usePrevious } from './usePrevious'
export { useAsync } from './useAsync'
export { useClickOutside } from './useClickOutside'
export { useMedia } from './useMedia'
export { useWindowSize } from './useWindowSize'
```

**Files:**
- `src/useDebounce.ts`
- `src/useTheme.ts`
- `src/useLocalStorage.ts`
- `src/usePrevious.ts`
- `src/useAsync.ts`
- `src/useClickOutside.ts`
- `src/useMedia.ts`
- `src/useWindowSize.ts`
- `src/index.ts`

---

## Package 5: Context Providers

**Path:** `packages/providers/`

**Purpose:** React Context providers (non-auth)

**Exports:**
```typescript
export { ToastProvider, useToast } from './toast-provider'
export { ModalProvider, useModal } from './modal-provider'
export { AnalyticsProvider } from './analytics-provider'
```

**Files:**
- `src/toast-provider.tsx`
- `src/modal-provider.tsx`
- `src/analytics-provider.tsx`
- `src/index.ts`

---

## Package 6: Auth SDK

**Path:** `packages/auth-sdk/`

**Purpose:** Stack Auth provider and context (ONE authorization source)

**Exports:**
```typescript
export { AuthProvider, useAuth } from './context'
export { useSession } from './hooks/useSession'
export { useUser } from './hooks/useUser'
export { ProtectedRoute } from './components/ProtectedRoute'
export { WithAuth } from './hoc/WithAuth'

export type { User, Session, AuthContextType } from './types'
```

**Key Rule:**
> Every frontend wraps with AuthProvider **exactly once** at root level.
> All auth state flows through this provider.
> No direct Stack Auth API calls in applications.

**Files:**
- `src/context.tsx` (AuthProvider, useAuth hook)
- `src/hooks/useSession.ts`
- `src/hooks/useUser.ts`
- `src/components/ProtectedRoute.tsx`
- `src/hoc/WithAuth.tsx`
- `src/types.ts`
- `src/index.ts`

**package.json:**
```json
{
  "name": "@iw-platform/auth-sdk",
  "version": "1.0.0",
  "dependencies": {
    "@iw-platform/shared": "workspace:*",
    "@stackframe/stack": "^0.1.0",
    "react": "^19.0.0"
  }
}
```

---

## Package 7: Validation Schemas

**Path:** `packages/validation/`

**Purpose:** Zod schemas for all data structures

**Exports:**
```typescript
// Auth schemas
export const userSchema = z.object({ /* ... */ })
export const sessionSchema = z.object({ /* ... */ })

// Entity schemas
export const entitySchema = z.object({ /* ... */ })
export const relationshipSchema = z.object({ /* ... */ })

// API schemas
export const gatewayRequestSchema = z.object({ /* ... */ })
export const gatewayResponseSchema = z.object({ /* ... */ })

// Form schemas
export const loginFormSchema = z.object({ /* ... */ })
export const createOrgSchema = z.object({ /* ... */ })
```

**Files:**
- `src/auth.ts`
- `src/entity.ts`
- `src/gateway.ts`
- `src/forms.ts`
- `src/index.ts`

---

## Package 8: Types

**Path:** `packages/types/`

**Purpose:** TypeScript-only type definitions (no runtime code)

**Exports:**
```typescript
// Platform types
export type User = { /* ... */ }
export type Organization = { /* ... */ }
export type Entity = { /* ... */ }
export type Relationship = { /* ... */ }
export type Permission = { /* ... */ }

// Gateway types
export type GatewayRequest = { /* ... */ }
export type GatewayResponse = { /* ... */ }
export type GatewayError = { /* ... */ }

// API types
export type ApiEndpoint = { /* ... */ }
export type ApiMethod = { /* ... */ }
```

**Files:**
- `src/platform.ts`
- `src/gateway.ts`
- `src/api.ts`
- `src/index.ts`

---

## Setup Instructions

1. Create all 8 package directories
2. Create `package.json` for each (templates above)
3. Create `tsconfig.json` for each:
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src"]
}
```

4. Add build scripts to each `package.json`:
```json
{
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "type-check": "tsc --noEmit"
  }
}
```

5. Run `pnpm install` at root

---

## Next: Phase 3

Build `packages/gateway-sdk/` (depends on all 8 packages above).

All API communication flows through Gateway SDK. No exceptions.

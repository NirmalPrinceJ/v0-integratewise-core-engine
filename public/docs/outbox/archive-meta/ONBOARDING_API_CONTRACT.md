# Onboarding API Contract — IntegrateWise Unified Platform

> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

## Endpoints

### POST /api/onboarding/start

- Body: `{ email, name, picture, oauthProvider, oauthSub }`
- Returns: `{ userId, tenantId, onboardingToken, status: "in_progress" }`
- Action: Creates user + tenant (owner role), issues JWT

### POST /api/onboarding/step/:stepNumber

- stepNumber: 0-6
- Body: step-specific payload
- Returns: `{ success, nextStep, committedFields, status }`
- Each step progressively commits to `tenant_spine_config`

#### Step 0 — Usage Type

Body: `{ usageType: "personal" | "work" | "business" }`
Commits: `tenant_spine_config.user_type`

#### Step 1 — Industry

Body: `{ industry: string }` — one of 11 + "Other"
Commits: `tenant_spine_config.industry`, starts progressive hydration

#### Step 2 — Department / Role

Body: `{ department: string, subRole: string }`
Department: one of 12 (Sales, Marketing, RevOps, CS, Support, Eng, Product, Finance, Legal, HR, Supply Chain, Service Ops)
SubRole: department-scoped
Commits: `tenant_spine_config.department`, `tenant_spine_config.sub_role`, derives `enabled_entities`, `north_star_metric`

#### Step 3 — Company Size

Body: `{ companySize: "1-10" | "11-50" | "51-200" | "201-500" | "501-1k" | "1k-5k" | "5k+" }`
Commits: `tenant_spine_config.company_size`, sets connector quotas + sync cadence defaults

#### Step 4 — Connectors

Body: `{ connectors: [{ id, provider, type, config? }] }`
Types: "continuity_bridge" (required), "storage", "mcp", "ai_provider", "native"
Commits: connector records, triggers Nango OAuth redirects

#### Step 5 — Desired Outcome

Body: `{ primaryGoal: string }` — organize | insights | context | team | automate | docs
Commits: personalization flags, first AI insight config

#### Step 6 — Workspace Name

Body: `{ workspaceName: string }`
Commits: Final `tenant_spine_config` write, marks onboarding complete, triggers spine hydration

### POST /api/onboarding/complete

- Body: `{ onboardingToken }`
- Returns: `{ success, redirectUrl, dashboardUrl }`
- Action: Finalizes RBAC, hydrates Spine projection, triggers first sync

### GET /api/tenant-spine-config

- Headers: `Authorization: Bearer <jwt>`
- Returns: Full `tenant_spine_config` row + derived persona projection

## D1 Schema

```sql
CREATE TABLE IF NOT EXISTS onboarding_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  status TEXT DEFAULT 'in_progress', -- in_progress | completed | abandoned
  current_step INTEGER DEFAULT 0,
  completed_steps TEXT, -- JSON array of step numbers
  payload TEXT, -- JSON object of all captured fields
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tenant_spine_config (
  tenant_id TEXT PRIMARY KEY,
  industry TEXT,
  department TEXT,
  sub_role TEXT,
  user_type TEXT,
  company_size TEXT,
  enabled_entities TEXT, -- JSON array
  north_star_metric TEXT,
  schema_version TEXT DEFAULT 'v2.0',
  governance_posture TEXT, -- JSON object
  twin_greeting_id TEXT,
  onboarding_complete INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rbac_users (
  user_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  role_id TEXT NOT NULL,
  level TEXT,
  scope TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rbac_roles (
  role_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  name TEXT,
  capabilities TEXT, -- JSON array
  inherits TEXT, -- JSON array
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rbac_permissions (
  perm_id TEXT PRIMARY KEY,
  name TEXT,
  scope TEXT,
  gate_posture TEXT
);
```

## Persona Matrix (12 × 11)

Stored as JSON configuration in `packages/config/persona-matrix.json`:

- 12 departments with CTX enums, entity vocabularies, KPI sets, Twin greetings
- 11 industries with base resource types, compliance flags, vertical connectors
- 132 cross-product schema variants (derived at runtime, not stored)

## Frontend → Backend Flow

1. Marketplace OAuth callback → frontend receives identity token
2. Frontend calls `/api/onboarding/start` with OAuth claims
3. Frontend renders 7-step wizard, calling `/api/onboarding/step/:n` at each step
4. Step 4 triggers Nango OAuth popups for each selected connector
5. Step 6 calls `/api/onboarding/complete` → triggers hydration → redirects to dashboard
6. Dashboard reads `/api/tenant-spine-config` to render persona-shaped projection

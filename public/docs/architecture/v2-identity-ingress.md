# IntegrateWise Continuity Bridge v2.0

# Domain Specification: Identity & Ingress Layers

# Status: Stage 1/2 Deep-Dive — Production Reference

# Date: 2026-07-02

# Scope: Authentication, Organizations, Users, API Keys, JWT, RBAC, Tenant Context,

# Sessions, Gateway, Rate Limiting, Request Validation, Routing,

# Transport (HTTP/WebSocket/SSE/MCP/Webhooks), Discovery

---

## 1. Domain Charter

This document defines the **Identity & Ingress Layers** (Layers 0–1 of the 6-layer architecture). These layers are the **only** surfaces that external consumers ever touch. Every request — from a human clicking in the workbench, an AI assistant streaming via MCP, a webhook payload from Salesforce, or a backend SDK call — must pass through the Gateway, be authenticated, scoped to a tenant, validated, rate-limited, and routed before any internal service ever sees it.

**The Invariant:**

> No internal service accepts direct external traffic. The Gateway (`integratewise-gateway`) is the sole north-plane entry point. Every hop carries `tenant_id`. Cross-tenant access is a 403 (fail-loud, not 404).

---

## 2. Architecture Position

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         EXTERNAL CONSUMERS                                   │
│  ┌─────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐     │
│  │ Human   │  │ AI Assistant│  │ External    │  │ Provider Webhooks   │     │
│  │ (Web UI)│  │ (Claude,    │  │ Agent / SDK │  │ (Salesforce,        │     │
│  │         │  │  ChatGPT)   │  │             │  │  HubSpot, Stripe)   │     │
│  └────┬────┘  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘     │
│       │              │                │                   │                 │
│       │ HTTP(S)      │ SSE/MCP        │ HTTP/SSE          │ HTTP POST       │
│       │ + Bearer JWT │ + Bearer JWT   │ + API Key         │ + Signature     │
│       ▼              ▼                ▼                   ▼                 │
├───────┴──────────────┴────────────────┴───────────────────┴─────────────────┤
│                         IDENTITY & INGRESS LAYERS                           │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  GATEWAY (integratewise-gateway) — Single Cloudflare Worker         │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────┐   │    │
│  │  │  AuthN  │ │ Rate    │ │ Tenant  │ │ Request │ │   Router    │   │    │
│  │  │  (JWT/  │ │ Limit   │ │ Resolver│ │ Validate│ │  (Binding   │   │    │
│  │  │  APIKey)│ │         │ │         │ │         │ │   Map)      │   │    │
│  │  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └──────┬──────┘   │    │
│  │       └───────────┴───────────┴───────────┴─────────────┘          │    │
│  │                              │                                      │    │
│  │                              ▼                                      │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │           DISCOVERY ASSEMBLER (inside Gateway)              │   │    │
│  │  │  GET /api/v1/discovery → capability registry snapshot       │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              │                                              │
│                              ▼ Service Bindings (26 bindings)                │
├─────────────────────────────────────────────────────────────────────────────┤
│                         CAPABILITY LAYER (Layer 2)                          │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │ tenants │ │connector│ │normalizer│ │  act    │ │ govern  │ │  think  │   │
│  │ (RBAC)  │ │  -sync  │ │         │ │         │ │         │ │         │   │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Integration Points with Adjacent Layers:**

- **Downstream → Capability Layer:** Service bindings to all 26 services. Gateway never calls internal services over HTTP; it uses Cloudflare Service Bindings for zero-latency RPC.
- **Upstream → Consumers:** HTTP(S) for REST, SSE for MCP streams, WebSocket for real-time workbench, standard HTTP POST for webhooks.
- **Sideways → Governance Layer:** Every authenticated request is logged to `spine_audit_log` via the `pipeline` service binding (fire-and-forget audit enqueue).

---

## 3. Authentication Subsystem (AuthN)

### 3.1 Supported Credential Types

The Gateway accepts **exactly two** credential types. All others (Clerk, Stack Auth, Descope, Supabase Auth direct) are rejected at the edge.

| Credential Type | Header Format                      | Use Case                                          | Issuer                                   |
| --------------- | ---------------------------------- | ------------------------------------------------- | ---------------------------------------- |
| **Gateway JWT** | `Authorization: Bearer <jwt>`      | Human users, AI assistants, frontend sessions     | `tenants` service (login/oauth exchange) |
| **API Key**     | `Authorization: Bearer iwak_<key>` | Backend SDKs, automation scripts, external agents | `admin` service (provisioned per tenant) |

**Rejected patterns (403):**

- Missing `Authorization` header on protected routes
- `Basic` auth
- Provider-issued tokens (Salesforce session, GitHub token) — these belong in the South Plane
- Expired JWT (returns 401 with `WWW-Authenticate: Bearer error="invalid_token"`)
- Revoked API key (checked against KV blacklist)

### 3.2 JWT Specification

```typescript
// packages/auth-types/src/jwt.ts

/**
 * Gateway-issued JWT claims.
 * Signed with RS256 using a 2048-bit RSA keypair.
 * Private key lives in Cloudflare Secrets (never in repo).
 * Public key is cached in KV for edge verification.
 */
export interface GatewayJwtPayload {
  /** JWT ID — unique per token, used for revocation tracking */
  jti: string;

  /** Issuer — always "gateway" */
  iss: "gateway";

  /** Subject — user UUID */
  sub: string;

  /** Audience — tenant slug or "integratewise" for platform admin */
  aud: string;

  /** Issued at (epoch seconds) */
  iat: number;

  /** Expiration (epoch seconds) — default 24h, refresh tokens 30d */
  exp: number;

  /** Tenant context — THE isolation boundary */
  tenant_id: string;

  /** Organization ID within tenant (for multi-org tenants) */
  org_id: string;

  /** User role — resolved from RBAC at issue time */
  role: "owner" | "admin" | "member" | "viewer" | "api";

  /** Capability scope — what this token can do */
  scope: ("read" | "write" | "admin" | "webhook" | "mcp")[];

  /** Session ID — links to KV session store */
  sid: string;

  /** Correlation ID — propagated across all service bindings */
  cid: string;

  /** Plan tier — used for rate-limit bucket selection */
  tier: "free" | "pro" | "enterprise" | "customer_zero";
}

/**
 * JWT verification result. Never returns partial success.
 * Fail-loud: any validation failure → 403 with explicit reason.
 */
export interface JwtVerificationResult {
  valid: boolean;
  payload?: GatewayJwtPayload;
  error?:
    | "missing"
    | "malformed"
    | "expired"
    | "invalid_signature"
    | "invalid_issuer"
    | "invalid_audience"
    | "revoked"
    | "tenant_suspended";
}

/**
 * API Key metadata stored in D1 (hashed, not plaintext).
 */
export interface ApiKeyRecord {
  id: string;
  tenant_id: string;
  org_id: string;
  name: string; // human-readable label
  key_hash: string; // Argon2id hash of the key
  scope: string[];
  created_at: string;
  expires_at: string | null;
  last_used_at: string | null;
  revoked_at: string | null;
  created_by: string; // user UUID
  rate_limit_bucket: "default" | "elevated" | "unlimited";
}
```

### 3.3 JWT Lifecycle Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   User      │────▶│  Identity   │────▶│   Gateway   │────▶│   Client    │
│  Login      │     │  Provider   │     │  JWT Issue  │     │  Storage    │
│  (OAuth2)   │     │ (Google/    │     │             │     │             │
│             │     │  GitHub)    │     │             │     │             │
└─────────────┘     └──────┬──────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  tenants    │
                    │  Service    │
                    │  (OAuth     │
                    │  callback)  │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  D1: users  │
                    │  D1: orgs   │
                    │  D1: tenants│
                    └─────────────┘
```

**Flow Detail:**

1. **OAuth Initiation:** User clicks "Sign in with Google" → frontend → `GET /api/v1/auth/:provider/start` → Gateway → `tenants` service binding.
2. **Provider Callback:** OAuth provider redirects to `POST /api/v1/auth/:provider/callback` → `tenants` service resolves or creates user/org/tenant.
3. **RBAC Resolution:** `tenants` queries `D1 rbac_roles` + `rbac_permissions` for the user's org role.
4. **JWT Minting:** `tenants` calls Gateway's internal `issueJwt()` (service binding, not HTTP) with claims payload.
5. **Session Creation:** Gateway writes `KV:sessions:<sid>` with session metadata (IP, UA, tenant_id, exp).
6. **Response:** JWT + refresh token returned to client. Refresh token is a separate opaque token stored in `KV:refresh:<jti>`.

---

## 4. Organization & Tenant Context

### 4.1 Tenant Isolation Model

Tenant is the **hard isolation boundary**. Org is a soft partition within a tenant. Every database query, every cache key, every queue message, every log entry carries `tenant_id`.

```
Tenant (tenant_id = "acme_corp")
├── Org: "Engineering" (org_id = "eng_01")
│   ├── Users: alice@acme.com (owner), bob@acme.com (member)
│   └── Resources: scoped to org
├── Org: "Sales" (org_id = "sales_01")
│   ├── Users: carol@acme.com (admin), dave@acme.com (viewer)
│   └── Resources: scoped to org
└── Platform-level: tenant owner can see all orgs

Tenant (tenant_id = "startup_xyz")
├── Org: "Default" (single-org tenant)
└── ...
```

### 4.2 Tenant Resolution at the Edge

```typescript
// services/gateway/src/tenant-resolver.ts

/**
 * Tenant resolution is STRATIFIED — never trust client input.
 * Priority (highest wins):
 *   1. JWT claim `tenant_id` (for Bearer JWT)
 *   2. API key lookup → D1 `api_keys` table → `tenant_id`
 *   3. NOTHING ELSE — no x-tenant-id header, no query param, no URL path
 *
 * If credential type is JWT and `aud` !== `tenant_id`, return 403.
 * If API key tenant is suspended, return 403 with `error: "tenant_suspended"`.
 */
export async function resolveTenant(request: Request, env: Env): Promise<TenantContext> {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    throw new AuthError("missing", 401);
  }

  const token = authHeader.slice(7);

  // Branch 1: API Key (starts with "iwak_")
  if (token.startsWith("iwak_")) {
    return await resolveApiKey(token, env);
  }

  // Branch 2: JWT
  return await resolveJwt(token, env);
}

export interface TenantContext {
  tenant_id: string;
  org_id: string;
  user_id: string | null; // null for API keys
  role: string;
  scope: string[];
  tier: string;
  session_id: string | null;
  correlation_id: string; // x-correlation-id or generated
  credential_type: "jwt" | "api_key";
}

/**
 * SECURITY: After resolution, inject TenantContext into
 * request.cf.integratewise (Cloudflare request context).
 * Every downstream service binding receives this via the binding's
 * `request` object. No header injection allowed.
 */
```

### 4.3 Cross-Tenant Safety Gates (P0)

| #   | Vulnerability                          | Gate                                                      | Failure Mode                       |
| --- | -------------------------------------- | --------------------------------------------------------- | ---------------------------------- |
| 1   | `x-tenant-id` header spoofing          | Strip `x-tenant-id` from all inbound requests before auth | Header removed, ignored if present |
| 2   | JWT `tenant_id` ≠ `aud` claim          | Verify `payload.tenant_id === payload.aud`                | 403 `invalid_tenant_claim`         |
| 3   | API key from suspended tenant          | Check `tenants.status = 'active'` at resolution time      | 403 `tenant_suspended`             |
| 4   | Session cross-tenant reuse             | `KV:sessions:<sid>` stores `tenant_id`; verify match      | 403 `session_tenant_mismatch`      |
| 5   | Service binding without tenant context | Enforce `TenantContext` present in all internal RPCs      | 500 `missing_tenant_context`       |

---

## 5. RBAC (Role-Based Access Control)

### 5.1 Role Hierarchy

```
                    ┌─────────────┐
                    │   owner     │  ← Can do everything, including delete tenant
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌─────────┐  ┌─────────┐  ┌─────────┐
        │  admin  │  │  member │  │  viewer │
        │(manage  │  │(execute│  │(read    │
        │ users)  │  │ actions)│  │ only)   │
        └────┬────┘  └────┬────┘  └─────────┘
             │            │
             ▼            ▼
        ┌─────────┐  ┌─────────┐
        │ api_key │  │ webhook │
        │(scoped  │  │(inbound │
        │ access) │  │ only)   │
        └─────────┘  └─────────┘
```

### 5.2 Permission Model

```typescript
// packages/auth-types/src/rbac.ts

/**
 * Permission format: `<resource>:<action>`
 * Examples:
 *   - "spine:read"          → Read any entity in Spine
 *   - "spine:write"         → Create/update entities
 *   - "connector:create"    → Add a new connector
 *   - "connector:delete"    → Remove a connector
 *   - "twin:propose"        → Trigger Twin reasoning
 *   - "govern:approve"      → Approve proposals (owner/admin only)
 *   - "admin:*"             → Full admin access
 *   - "mcp:invoke"          → Execute MCP tools
 *   - "webhook:receive"     → Receive inbound webhooks
 */
export type Permission = `${string}:${string}`;

export interface RoleDefinition {
  id: string;
  tenant_id: string;
  name: string; // "owner", "admin", "member", "viewer", "api"
  permissions: Permission[];
  inherits_from: string | null; // role inheritance chain
  created_at: string;
}

/**
 * Permission check. Evaluated at TWO boundaries:
 *   1. Gateway: coarse-grained (does this role have "spine:read"?)
 *   2. Service: fine-grained (does this user own this specific record?)
 *
 * Gateway never does row-level checks — it only validates the token
 * and passes TenantContext. Services do fine-grained authorization.
 */
export function hasPermission(role: RoleDefinition, required: Permission): boolean {
  // Direct match
  if (role.permissions.includes(required)) return true;
  // Wildcard match ("admin:*" matches "admin:users")
  const [resource] = required.split(":");
  if (role.permissions.includes(`${resource}:*`)) return true;
  // Global wildcard
  if (role.permissions.includes("*:*")) return true;
  // Recursive inheritance check
  if (role.inherits_from) {
    // Resolved via D1 lookup (cached in KV)
    return checkInherited(role.inherits_from, required);
  }
  return false;
}
```

### 5.3 RBAC Enforcement Points

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         ENFORCEMENT POINTS                               │
├─────────────────────────────────────────────────────────────────────────┤
│  Layer 0 — Gateway (Coarse)                                              │
│  ├── Check role exists in `rbac_roles`                                   │
│  ├── Verify required permission for route                                │
│  │   Route map: `POST /api/v1/spine/*` → requires "spine:read|write"     │
│  └── Reject early — 403 before any service binding call                  │
│                                                                          │
│  Layer 1 — Service (Fine-grained)                                        │
│  ├── `WHERE tenant_id = ? AND org_id = ?` on every query                 │
│  ├── Record-level ownership checks (e.g., "did this user create this?") │
│  └── Audit log: `rbac_decision` table with allow/deny + reason           │
│                                                                          │
│  Layer 2 — Data (Hard boundary)                                          │
│  ├── D1 row-level security (future: Postgres RLS when swappable)         │
│  └── KV key prefixing: `kv:<tenant_id>:<key>`                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Session Management

### 6.1 Session Store (KV-Backed)

Sessions are ephemeral state stored in Cloudflare KV with TTL. They are NOT the source of truth — the JWT is. Sessions enable revocation, multi-device tracking, and security events.

```typescript
// services/gateway/src/sessions.ts

export interface SessionRecord {
  sid: string;
  tenant_id: string;
  org_id: string;
  user_id: string;
  jti: string; // links to JWT
  issued_at: number;
  expires_at: number;
  ip_hash: string; // SHA-256 of IP (privacy-preserving)
  user_agent_hash: string; // SHA-256 of UA string
  device_fingerprint: string;
  last_active_at: number;
  revoked_at: number | null;
  revoke_reason: string | null;
}

/**
 * Session lifecycle:
 *   CREATE → ACTIVE → (REFRESH) → (REVOKE) → EXPIRED
 *
 * KV keys:
 *   sessions:<sid>        → SessionRecord (TTL = JWT exp)
 *   sessions_by_jti:<jti> → sid (for revocation lookup)
 *   sessions_by_user:<user_id> → JSON[sid[]] (for "log out all devices")
 */

export async function createSession(
  env: Env,
  payload: GatewayJwtPayload,
  request: Request
): Promise<SessionRecord> {
  const sid = crypto.randomUUID();
  const now = Math.floor(Date.now() / 1000);

  const session: SessionRecord = {
    sid,
    tenant_id: payload.tenant_id,
    org_id: payload.org_id,
    user_id: payload.sub,
    jti: payload.jti,
    issued_at: now,
    expires_at: payload.exp,
    ip_hash: await hashIp(request.headers.get("CF-Connecting-IP") || ""),
    user_agent_hash: await hashString(request.headers.get("User-Agent") || ""),
    device_fingerprint: await computeFingerprint(request),
    last_active_at: now,
    revoked_at: null,
    revoke_reason: null,
  };

  // Write with TTL matching JWT expiration
  const ttlSeconds = payload.exp - now;
  await env.KV.put(`sessions:${sid}`, JSON.stringify(session), {
    expirationTtl: ttlSeconds,
  });
  await env.KV.put(`sessions_by_jti:${payload.jti}`, sid, {
    expirationTtl: ttlSeconds,
  });

  // Append to user's session list
  const userSessions = await env.KV.get(`sessions_by_user:${payload.sub}`);
  const sessions: string[] = userSessions ? JSON.parse(userSessions) : [];
  sessions.push(sid);
  await env.KV.put(`sessions_by_user:${payload.sub}`, JSON.stringify(sessions), {
    expirationTtl: 30 * 24 * 60 * 60, // 30 days
  });

  return session;
}
```

### 6.2 Session Revocation

```typescript
/**
 * Revocation flows:
 *   1. User "Log out" → revoke single session
 *   2. User "Log out all devices" → revoke all sessions for user
 *   3. Admin "Suspend user" → revoke all sessions + blacklist JWT jti
 *   4. Security event (suspicious IP) → automatic revocation
 *
 * Blacklist: KV `jwt_blacklist:<jti>` = "revoked" (TTL = remaining JWT lifetime)
 * Gateway checks blacklist on EVERY JWT verification.
 */
export async function revokeSession(env: Env, sid: string, reason: string): Promise<void> {
  const sessionData = await env.KV.get(`sessions:${sid}`);
  if (!sessionData) return;

  const session: SessionRecord = JSON.parse(sessionData);
  session.revoked_at = Math.floor(Date.now() / 1000);
  session.revoke_reason = reason;

  await env.KV.put(`sessions:${sid}`, JSON.stringify(session));

  // Blacklist the JWT
  const remainingTtl = session.expires_at - session.revoked_at;
  if (remainingTtl > 0) {
    await env.KV.put(`jwt_blacklist:${session.jti}`, "revoked", {
      expirationTtl: remainingTtl,
    });
  }
}
```

---

## 7. Gateway — The Single Entry Point

### 7.1 Gateway Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     GATEWAY REQUEST LIFECYCLE                                │
│                                                                              │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────────┐   │
│  │  WAF    │──▶│  TLS    │──▶│  CORS   │──▶│  AuthN  │──▶│ Rate Limit  │   │
│  │ (CF)    │   │ (CF)    │   │ (GW)    │   │  (GW)   │   │   (GW)      │   │
│  └─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────────┘   │
│       │            │            │            │                  │           │
│       ▼            ▼            ▼            ▼                  ▼           │
│    Blocked     Blocked      Blocked      401/403           429              │
│    (WAF)       (TLS)        (CORS)       (Auth)         (Rate limit)        │
│                                                                              │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────────────────────────┐   │
│  │   Tenant    │──▶│   Request   │──▶│         ROUTER                  │   │
│  │  Resolver   │   │  Validation │   │  ┌─────────┐  ┌─────────────┐  │   │
│  │             │   │  (Zod)      │   │  │ Route   │  │  Service    │  │   │
│  └─────────────┘   └─────────────┘   │  │  Match  │──│  Binding    │──┼───┼──▶
│                                      │  │         │  │    Call     │  │   │
│                                      │  └─────────┘  └─────────────┘  │   │
│                                      └─────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  AUDIT ENQUEUE (fire-and-forget via PIPELINE service binding)       │    │
│  │  → spine_audit_log entry with tenant_id, user_id, route, latency    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Gateway Route Map

```typescript
// services/gateway/src/routes.ts

/**
 * All routes are prefixed with `/api/v1`.
 * The Gateway matches routes and dispatches to service bindings.
 * NO route proxies to an external URL — all go to internal Workers.
 */
export const ROUTE_MAP: RouteDefinition[] = [
  // ─── Auth & Identity ───
  { method: "GET", path: "/auth/:provider/start", binding: null, handler: "oauthRedirect" },
  { method: "POST", path: "/auth/:provider/callback", binding: "TENANTS", action: "oauthCallback" },
  { method: "POST", path: "/auth/refresh", binding: null, handler: "refreshJwt" },
  { method: "POST", path: "/auth/logout", binding: null, handler: "revokeSession" },
  { method: "GET", path: "/auth/me", binding: "TENANTS", action: "getCurrentUser" },

  // ─── Discovery (served by Gateway itself) ───
  { method: "GET", path: "/discovery", binding: null, handler: "discovery" },

  // ─── Tenant & Organization ───
  { method: "GET", path: "/tenant", binding: "TENANTS", action: "getTenant" },
  {
    method: "PATCH",
    path: "/tenant",
    binding: "TENANTS",
    action: "updateTenant",
    permission: "admin:tenant",
  },
  { method: "GET", path: "/tenant/orgs", binding: "TENANTS", action: "listOrgs" },
  {
    method: "POST",
    path: "/tenant/orgs",
    binding: "TENANTS",
    action: "createOrg",
    permission: "admin:org",
  },
  { method: "GET", path: "/tenant/users", binding: "TENANTS", action: "listUsers" },
  {
    method: "POST",
    path: "/tenant/invite",
    binding: "TENANTS",
    action: "inviteUser",
    permission: "admin:users",
  },

  // ─── RBAC ───
  { method: "GET", path: "/rbac/roles", binding: "TENANTS", action: "listRoles" },
  {
    method: "POST",
    path: "/rbac/roles",
    binding: "TENANTS",
    action: "createRole",
    permission: "admin:rbac",
  },
  { method: "GET", path: "/rbac/permissions", binding: "TENANTS", action: "listPermissions" },

  // ─── API Keys ───
  { method: "GET", path: "/keys", binding: "TENANTS", action: "listApiKeys" },
  {
    method: "POST",
    path: "/keys",
    binding: "TENANTS",
    action: "createApiKey",
    permission: "admin:keys",
  },
  {
    method: "DELETE",
    path: "/keys/:id",
    binding: "TENANTS",
    action: "revokeApiKey",
    permission: "admin:keys",
  },

  // ─── Spine / Entities ───
  {
    method: "GET",
    path: "/spine/:type",
    binding: "SPINE_V2",
    action: "queryEntities",
    permission: "spine:read",
  },
  {
    method: "GET",
    path: "/spine/:type/:id",
    binding: "SPINE_V2",
    action: "getEntity",
    permission: "spine:read",
  },
  {
    method: "POST",
    path: "/spine/:type",
    binding: "PIPELINE",
    action: "createEntity",
    permission: "spine:write",
  },
  {
    method: "PATCH",
    path: "/spine/:type/:id",
    binding: "PIPELINE",
    action: "updateEntity",
    permission: "spine:write",
  },

  // ─── Capabilities ───
  {
    method: "POST",
    path: "/capabilities/:name",
    binding: "ACT",
    action: "executeCapability",
    permission: "mcp:invoke",
  },
  { method: "GET", path: "/capabilities", binding: "AGENT_REGISTRY", action: "listCapabilities" },

  // ─── Twin / AI ───
  {
    method: "POST",
    path: "/twin/propose",
    binding: "TWIN_ORCHESTRATOR",
    action: "propose",
    permission: "twin:propose",
  },
  { method: "GET", path: "/twin/status", binding: "TWIN_ORCHESTRATOR", action: "getStatus" },

  // ─── Governance ───
  { method: "GET", path: "/govern/proposals", binding: "GOVERN", action: "listProposals" },
  {
    method: "POST",
    path: "/govern/proposals/:id/approve",
    binding: "GOVERN",
    action: "approveProposal",
    permission: "govern:approve",
  },
  {
    method: "POST",
    path: "/govern/proposals/:id/reject",
    binding: "GOVERN",
    action: "rejectProposal",
    permission: "govern:approve",
  },

  // ─── Knowledge ───
  { method: "GET", path: "/knowledge/search", binding: "KNOWLEDGE", action: "search" },
  {
    method: "POST",
    path: "/knowledge/documents",
    binding: "KNOWLEDGE",
    action: "ingestDocument",
    permission: "knowledge:write",
  },

  // ─── Intelligence ───
  { method: "GET", path: "/intelligence/signals", binding: "INTELLIGENCE", action: "getSignals" },
  { method: "GET", path: "/intelligence/insights", binding: "INTELLIGENCE", action: "getInsights" },

  // ─── Connectors ───
  {
    method: "POST",
    path: "/connectors",
    binding: "CONNECTOR",
    action: "createConnector",
    permission: "connector:create",
  },
  { method: "GET", path: "/connectors", binding: "CONNECTOR", action: "listConnectors" },
  {
    method: "POST",
    path: "/connectors/:id/sync",
    binding: "CONNECTOR_SYNC",
    action: "triggerSync",
    permission: "connector:sync",
  },

  // ─── Admin ───
  {
    method: "GET",
    path: "/admin/tenants",
    binding: "ADMIN",
    action: "listTenants",
    permission: "admin:*",
  },
  {
    method: "GET",
    path: "/admin/audit",
    binding: "ADMIN",
    action: "getAuditLog",
    permission: "admin:audit",
  },

  // ─── MCP (SSE transport) ───
  { method: "POST", path: "/mcp/sessions", binding: null, handler: "mcpCreateSession" },
  { method: "POST", path: "/mcp/tools", binding: "MCP_CONNECTOR", action: "listTools" },
  {
    method: "POST",
    path: "/mcp/invoke",
    binding: "MCP_CONNECTOR",
    action: "invokeTool",
    permission: "mcp:invoke",
  },
  { method: "GET", path: "/mcp/health", binding: "MCP_CONNECTOR", action: "health" },
  { method: "DELETE", path: "/mcp/sessions/:id", binding: null, handler: "mcpDeleteSession" },

  // ─── Webhooks (inbound from providers) ───
  {
    method: "POST",
    path: "/webhooks/:provider",
    binding: "WEBHOOK_INGRESS",
    action: "receiveWebhook",
    auth: "webhook_signature",
  },

  // ─── Health ───
  { method: "GET", path: "/health", binding: null, handler: "healthCheck" },
  { method: "GET", path: "/health/deep", binding: null, handler: "deepHealthCheck" },
];

export interface RouteDefinition {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  binding: string | null; // null = handled by Gateway itself
  action?: string; // method name on the binding target
  handler?: string; // local Gateway handler function name
  permission?: string; // required permission (coarse check)
  auth?: "jwt" | "api_key" | "webhook_signature" | "none";
}
```

---

## 8. Rate Limiting

### 8.1 Rate Limit Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         RATE LIMIT TIERS                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  Tier           │ Request/min │ Burst │ Concurrent │ MCP Streams │ Webhooks │
│  ───────────────┼─────────────┼───────┼────────────┼─────────────┼──────────│
│  free           │ 60          │ 10    │ 5          │ 1           │ 10/hr    │
│  pro            │ 600         │ 100   │ 25         │ 3           │ 100/hr   │
│  enterprise     │ 6,000       │ 500   │ 100        │ 10          │ 1,000/hr │
│  customer_zero  │ unlimited   │ unlimited │ unlimited │ unlimited │ unlimited│
├─────────────────────────────────────────────────────────────────────────────┤
│  Rate limit is enforced at TWO levels:                                      │
│    1. Gateway edge — per-tenant token bucket (CF Rate Limiting API)         │
│    2. Service — per-tenant queue depth (backpressure)                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.2 Token Bucket Implementation

```typescript
// services/gateway/src/rate-limit.ts

/**
 * Token bucket stored in KV for edge rate limiting.
 * Key: `ratelimit:<tenant_id>:<bucket_type>`
 * Bucket types: "api", "mcp", "webhook", "sync"
 */
export interface RateLimitBucket {
  tokens: number; // current available tokens
  last_refill: number; // epoch ms of last refill
  window_start: number; // epoch ms of current window start
}

export async function checkRateLimit(
  env: Env,
  tenantId: string,
  tier: string,
  bucketType: "api" | "mcp" | "webhook" | "sync"
): Promise<RateLimitResult> {
  const config = RATE_LIMIT_CONFIG[tier][bucketType];
  const key = `ratelimit:${tenantId}:${bucketType}`;

  const bucketData = await env.KV.get(key);
  const now = Date.now();

  let bucket: RateLimitBucket = bucketData
    ? JSON.parse(bucketData)
    : { tokens: config.burst, last_refill: now, window_start: now };

  // Refill tokens based on elapsed time
  const elapsedMs = now - bucket.last_refill;
  const tokensToAdd = (elapsedMs / 1000) * (config.requestsPerMinute / 60);
  bucket.tokens = Math.min(config.burst, bucket.tokens + tokensToAdd);
  bucket.last_refill = now;

  // Window rollover
  if (now - bucket.window_start > config.windowMs) {
    bucket.window_start = now;
    bucket.tokens = config.burst;
  }

  if (bucket.tokens < 1) {
    // Save bucket state (short TTL)
    await env.KV.put(key, JSON.stringify(bucket), { expirationTtl: 60 });

    const retryAfter = Math.ceil((1 - bucket.tokens) / (config.requestsPerMinute / 60));
    return {
      allowed: false,
      limit: config.requestsPerMinute,
      remaining: 0,
      reset: Math.ceil((bucket.window_start + config.windowMs) / 1000),
      retryAfter,
    };
  }

  // Consume token
  bucket.tokens -= 1;
  await env.KV.put(key, JSON.stringify(bucket), { expirationTtl: 60 });

  return {
    allowed: true,
    limit: config.requestsPerMinute,
    remaining: Math.floor(bucket.tokens),
    reset: Math.ceil((bucket.window_start + config.windowMs) / 1000),
    retryAfter: 0,
  };
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  reset: number;
  retryAfter: number;
}

/**
 * Rate limit response headers (RFC 6585 + IETF draft):
 *   X-RateLimit-Limit: 600
 *   X-RateLimit-Remaining: 599
 *   X-RateLimit-Reset: 1719916800
 *   Retry-After: 60 (when limited)
 */
```

---

## 9. Request Validation

### 9.1 Validation Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      REQUEST VALIDATION PIPELINE                             │
│                                                                              │
│  Stage 1: Structural (Zod schemas)                                            │
│    ├── Content-Type header check                                              │
│    ├── Body JSON parsing                                                      │
│    ├── Zod schema validation                                                  │
│    └── Reject: 400 with `zodError.errors` array                               │
│                                                                              │
│  Stage 2: Semantic                                                            │
│    ├── Tenant exists and is active                                            │
│    ├── User exists in tenant                                                  │
│    ├── Role permits this action                                               │
│    └── Reject: 403 with reason code                                           │
│                                                                              │
│  Stage 3: Business Rules                                                      │
│    ├── Plan limits (e.g., max connectors)                                     │
│    ├── Rate limit compliance                                                  │
│    └── Reject: 402 (payment required) or 429                                  │
│                                                                              │
│  Stage 4: Security                                                            │
│    ├── Input sanitization (XSS, SQLi patterns)                                │
│    ├── Max body size (1MB for API, 10MB for file upload)                      │
│    └── Reject: 413 or 400                                                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 9.2 Zod Schema Examples

```typescript
// packages/validation/src/schemas.ts
import { z } from "zod";

/**
 * Base tenant-scoped request. All request bodies extend this.
 * NOTE: tenant_id is NEVER in the body. It comes from JWT/API key resolution.
 */
export const BaseTenantRequest = z.object({
  // Intentionally empty — tenant context is injected by Gateway
});

export const CreateEntityRequest = z.object({
  type: z.string().min(1).max(64),
  data: z.record(z.unknown()),
  org_id: z.string().optional(), // optional — defaults to user's org
  relationships: z
    .array(
      z.object({
        target_type: z.string(),
        target_id: z.string(),
        relation_type: z.string(),
      })
    )
    .optional(),
  source: z.enum(["api", "webhook", "mcp", "ui", "twin"]).default("api"),
});

export const ExecuteCapabilityRequest = z.object({
  capability: z.string().regex(/^[a-z0-9_]+\.[a-z0-9_]+\.[a-z0-9_]+$/),
  payload: z.record(z.unknown()),
  async: z.boolean().default(false),
  correlation_id: z.string().uuid().optional(),
});

export const TwinProposeRequest = z.object({
  context: z.string().max(10000),
  entity_ids: z.array(z.string().uuid()).optional(),
  projection: z
    .enum([
      "sales",
      "cs",
      "finance",
      "executive",
      "architecture",
      "operations",
      "personal",
      "developer",
    ])
    .optional(),
  max_proposals: z.number().int().min(1).max(10).default(3),
});

export const WebhookPayload = z.object({
  // Webhooks are validated by provider-specific signature verification
  // Body is passed through to webhook-ingress service
  provider: z.string(),
  signature: z.string().optional(),
  timestamp: z.string().datetime().optional(),
  event_type: z.string(),
  payload: z.record(z.unknown()),
});
```

---

## 10. Transport Layer

### 10.1 Supported Transports

| Transport     | Protocol           | Use Case                       | Endpoint                                         | Auth                   |
| ------------- | ------------------ | ------------------------------ | ------------------------------------------------ | ---------------------- |
| **HTTP/REST** | HTTP/1.1, HTTP/2   | Primary API for SDKs, webhooks | `api.integratewise.ai/api/v1/*`                  | JWT or API Key         |
| **SSE**       | Server-Sent Events | MCP streams, real-time signals | `mcp.integratewise.ai/v1/mcp`                    | JWT                    |
| **WebSocket** | WS over TLS        | Real-time workbench (future)   | `ws.integratewise.ai/v1/stream`                  | JWT                    |
| **MCP**       | stdio / SSE        | AI assistant integration       | `mcp.integratewise.ai/v1/mcp`                    | JWT                    |
| **Webhooks**  | HTTP POST          | Provider callbacks             | `api.integratewise.ai/api/v1/webhooks/:provider` | Signature verification |

### 10.2 SSE / MCP Transport Specification

```typescript
// packages/mcp-types/src/transport.ts

/**
 * MCP SSE Transport for Inbound MCP Pool.
 * Each SSE connection maps to one session in KV.
 */
export interface McpSseSession {
  session_id: string;
  tenant_id: string;
  user_id: string;
  created_at: number;
  last_event_at: number;
  event_stream: ReadableStream; // Cloudflare Workers stream
  tools_version: string; // Discovery cache version
}

/**
 * SSE Event Types
 */
export type McpSseEvent =
  | { type: "connected"; session_id: string; tenant_id: string }
  | { type: "tool_catalog"; tools: McpToolDefinition[] }
  | { type: "invocation_result"; invocation_id: string; result: unknown }
  | { type: "signal"; signal_type: string; payload: unknown }
  | { type: "error"; code: string; message: string }
  | { type: "ping" }; // keep-alive every 30s

/**
 * MCP Tool Definition (assembled from Discovery)
 */
export interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: JSONSchema7;
  capability: string; // e.g., "salesforce.opportunity.update"
  permission: string; // required RBAC permission
  provider: string;
  read_only: boolean;
}

/**
 * Session lifecycle:
 *   1. Client POST /mcp/sessions → Gateway validates JWT
 *   2. Gateway creates McpSseSession in KV (TTL = 1 hour)
 *   3. Gateway returns SSE stream with initial `connected` event
 *   4. Client POST /mcp/tools → Gateway assembles catalog from Discovery
 *   5. Client POST /mcp/invoke → Gateway routes to MCP_CONNECTOR binding
 *   6. Result streamed back via SSE
 *   7. Client DELETE /mcp/sessions/:id or TTL expiry → cleanup
 */
```

### 10.3 Webhook Transport

```typescript
// services/webhook-ingress/src/index.ts

/**
 * Webhook ingress is a SEPARATE Worker (not the Gateway).
 * It receives raw provider webhooks, verifies signatures,
 * normalizes payloads, and enqueues to NORMALIZER_QUEUE.
 *
 * Why separate from Gateway?
 *   - Webhooks have different scaling patterns (burst traffic)
 *   - Signature verification is provider-specific
 *   - Failures should not block API traffic
 */

export interface WebhookIngressConfig {
  provider: string; // "salesforce", "hubspot", "stripe", "github", ...
  secret_header: string; // "X-HubSpot-Signature", "Stripe-Signature", ...
  secret_env_key: string; // env var name for verification secret
  idempotency_header: string; // "X-Idempotency-Key", "X-Delivery-ID", ...
}

/**
 * Webhook processing flow:
 *   1. Provider POST → webhook-ingress Worker
 *   2. Verify signature (provider-specific HMAC)
 *   3. Check idempotency (KV dedup key)
 *   4. Extract tenant_id from connection mapping (D1: connector_tenant_map)
 *   5. Normalize to WebhookEnvelope
 *   6. Enqueue to NORMALIZER_QUEUE
 *   7. Return 200 (provider retries if not 200)
 */
export interface WebhookEnvelope {
  webhook_id: string; // idempotency key
  tenant_id: string;
  provider: string;
  event_type: string;
  received_at: number;
  payload: unknown;
  signature_valid: boolean;
  raw_headers: Record<string, string>;
}
```

---

## 11. Discovery Subsystem

### 11.1 Discovery Contract

Discovery is the **capability handshake**. Every consumer — human, AI agent, SDK — calls `GET /api/v1/discovery` to learn what exists and what they can do. This is a **living contract**: it changes as connectors are added, roles are modified, or plan limits are adjusted.

```typescript
// packages/sdk/src/discovery.ts

/**
 * Discovery Response — the single source of truth for consumer capability.
 * Cached client-side for 5 minutes. Gateway caches in KV for 60 seconds.
 */
export interface DiscoveryResponse {
  /** Identity context */
  identity: {
    user_id: string;
    email: string;
    name: string;
    tenant_id: string;
    tenant_name: string;
    org_id: string;
    org_name: string;
    role: string;
    tier: string;
  };

  /** Workspace state */
  workspace: {
    connected_connectors: ConnectorInfo[];
    plan_limits: PlanLimits;
    features_enabled: string[];
    onboarding_complete: boolean;
  };

  /** Available projections (8 lenses) */
  projections: ProjectionInfo[];

  /** Named capabilities this tenant can execute */
  capabilities: CapabilityInfo[];

  /** Gated features based on plan */
  features: FeatureInfo[];

  /** Role-based navigation structure */
  navigation: NavigationNode[];

  /** User personalization */
  personalization: {
    recent_entities: string[];
    preferred_projection: string;
    pinned_capabilities: string[];
    theme: "light" | "dark" | "system";
  };

  /** Current limits and usage */
  limits: {
    rate_limit: RateLimitInfo;
    storage_used_bytes: number;
    storage_limit_bytes: number;
    api_calls_this_period: number;
    api_call_limit: number;
  };

  /** MCP endpoint (for AI assistants) */
  mcp: {
    endpoint: string;
    version: string;
    transport: "sse";
    authenticated: boolean;
  };

  /** Version metadata */
  version: {
    api: string;
    schema: string;
    discovery_cache_version: string;
  };
}

export interface ConnectorInfo {
  id: string;
  provider: string;
  name: string;
  status: "connected" | "syncing" | "error" | "disconnected";
  last_sync_at: string | null;
  entity_count: number;
  capabilities: string[]; // capabilities this connector enables
}

export interface ProjectionInfo {
  id: string;
  name: string; // "Sales", "CS", "Finance", ...
  description: string;
  icon: string;
  enabled: boolean;
  required_connectors: string[];
  required_role: string;
}

export interface CapabilityInfo {
  name: string; // e.g., "analyze_account"
  description: string;
  category: string;
  input_schema: JSONSchema7;
  output_schema: JSONSchema7;
  permission: string;
  read_only: boolean;
  providers: string[]; // which connectors support this
  deprecated: boolean;
  deprecation_note?: string;
}

export interface PlanLimits {
  max_connectors: number;
  max_users: number;
  max_api_calls_per_minute: number;
  max_storage_bytes: number;
  max_mcp_streams: number;
  retention_days: number;
  features: string[];
}
```

### 11.2 Discovery Assembly Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     DISCOVERY ASSEMBLY (Inside Gateway)                      │
│                                                                              │
│  Client: GET /api/v1/discovery + Bearer JWT                                  │
│       │                                                                      │
│       ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  1. Check KV cache: `discovery:<tenant_id>:<role>:<version>`       │    │
│  │     → Cache hit? Return cached response (60s TTL)                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│       │ Cache miss                                                          │
│       ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  2. Parallel service binding calls:                                  │    │
│  │     ├── TENANTS     → getTenant, getUser, getOrg                   │    │
│  │     ├── CONNECTOR   → listConnectors (filtered by tenant)          │    │
│  │     ├── AGENT_REGISTRY → listCapabilities (filtered by role)       │    │
│  │     ├── L2          → listProjections (filtered by tenant config)  │    │
│  │     └── BILLING     → getPlanLimits                                │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│       │                                                                      │
│       ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  3. Assemble DiscoveryResponse                                       │    │
│  │  4. Write to KV cache                                                │    │
│  │  5. Return to client                                                 │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 12. Security Boundaries

### 12.1 Trust Zones

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ZONE 0: Internet (Untrusted)                                               │
│  ├── Any IP can reach Gateway                                               │
│  ├── WAF blocks obvious attacks                                             │
│  └── Rate limits prevent abuse                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│  ZONE 1: Gateway (Semi-Trusted)                                             │
│  ├── Authenticated requests only                                            │
│  ├── Tenant context resolved and validated                                  │
│  ├── No direct DB access — only service bindings                            │
│  └── Audit log enqueued for every request                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  ZONE 2: Internal Services (Trusted)                                        │
│  ├── Service bindings only — no public URLs                                 │
│  ├── Tenant context propagated implicitly                                   │
│  ├── Fine-grained RBAC enforced                                             │
│  └── Direct D1/KV access permitted                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  ZONE 3: Provider Fabric (External, Untrusted)                              │
│  ├── Credentials stored in Nango vault / CF Secrets                         │
│  ├── Entity360 injected before outbound calls                               │
│  └── Circuit breakers protect against provider failures                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 12.2 Security Checklist (P0)

| #   | Control                    | Implementation                                                   | Verification                              |
| --- | -------------------------- | ---------------------------------------------------------------- | ----------------------------------------- |
| 1   | TLS 1.3 only               | Cloudflare edge certificate                                      | `curl -I -v https://api.integratewise.ai` |
| 2   | HSTS header                | `Strict-Transport-Security: max-age=31536000; includeSubDomains` | Response headers                          |
| 3   | CORS whitelist             | `app.integratewise.ai`, `*.pages.dev`                            | Preflight response                        |
| 4   | Content Security Policy    | `default-src 'self'` on web assets                               | Response headers                          |
| 5   | JWT signature verification | RS256 with Cloudflare Secrets                                    | Unit test: tampered JWT → 403             |
| 6   | API key hashing            | Argon2id, never store plaintext                                  | DB inspection                             |
| 7   | Session revocation         | KV blacklist + TTL                                               | Test: revoked JWT → 403                   |
| 8   | Rate limiting              | Token bucket per tenant                                          | Load test: 600 req/min → 429              |
| 9   | Input validation           | Zod schemas on all routes                                        | Fuzz test: invalid payloads → 400         |
| 10  | Audit logging              | Every request → spine_audit_log                                  | D1 query: count audit rows                |
| 11  | Secret rotation            | Cloudflare Secrets API, 90-day max age                           | Admin dashboard check                     |
| 12  | No .env in repo            | `.gitignore` + secret scanning                                   | `git log --all -- .env`                   |

---

## 13. Integration Points with Adjacent Layers

### 13.1 Identity → Capability Layer

| Integration               | Direction       | Data                          | Mechanism                       |
| ------------------------- | --------------- | ----------------------------- | ------------------------------- |
| Gateway → `tenants`       | Request         | Auth callbacks, user CRUD     | Service binding `TENANTS`       |
| Gateway → `act`           | Request         | Capability execution          | Service binding `ACT`           |
| Gateway → `mcp-connector` | Bidirectional   | MCP tool catalog, invocations | Service binding `MCP_CONNECTOR` |
| Gateway → `govern`        | Request         | Proposal approval/rejection   | Service binding `GOVERN`        |
| Gateway → `pipeline`      | Fire-and-forget | Audit log entries             | Service binding `PIPELINE`      |

### 13.2 Identity → Continuity Layer

| Integration            | Direction       | Data                           | Mechanism                               |
| ---------------------- | --------------- | ------------------------------ | --------------------------------------- |
| Gateway → `continuity` | Fire-and-forget | Session events (login, logout) | Queue `SESSION_EVENTS_QUEUE`            |
| `continuity` → Gateway | Background      | Memory decay notifications     | Not applicable (no callback to Gateway) |

### 13.3 Identity → Governance Layer

| Integration        | Direction       | Data               | Mechanism                                      |
| ------------------ | --------------- | ------------------ | ---------------------------------------------- |
| Gateway → `govern` | Request         | Approval actions   | Service binding `GOVERN`                       |
| `govern` → Gateway | Response        | Approval status    | Service binding response                       |
| Gateway audit      | Fire-and-forget | All auth decisions | Service binding `PIPELINE` → `spine_audit_log` |

### 13.4 Discovery ↔ All Layers

Discovery is the **cross-layer contract**. It reads from:

- **Identity Layer:** User role, tenant, org
- **Capability Layer:** Available capabilities from `agent-registry`
- **Continuity Layer:** Connected connectors, entity counts
- **Governance Layer:** Enabled features per plan tier

---

## 14. Data Model (D1 Schema)

```sql
-- Identity & Ingress Layer D1 tables
-- All tables have `tenant_id` as the first column in PRIMARY KEY or INDEX

-- Tenants
CREATE TABLE tenants (
  id TEXT PRIMARY KEY,           -- e.g., "acme_corp"
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- active, suspended, pending_deletion
  tier TEXT NOT NULL DEFAULT 'free',     -- free, pro, enterprise, customer_zero
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  owner_id TEXT NOT NULL,
  settings TEXT -- JSON: { onboarding_complete, preferred_projection, ... }
);

-- Organizations (within a tenant)
CREATE TABLE orgs (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(tenant_id, slug)
);

-- Users
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  org_id TEXT NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  auth_provider TEXT NOT NULL,   -- google, github, email
  auth_provider_id TEXT,         -- external ID from auth provider
  status TEXT NOT NULL DEFAULT 'active',
  last_login_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(tenant_id, email)
);

-- RBAC Roles
CREATE TABLE rbac_roles (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,            -- owner, admin, member, viewer, api
  permissions TEXT NOT NULL,     -- JSON array: ["spine:read", "twin:propose", ...]
  inherits_from TEXT,            -- role ID or null
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(tenant_id, name)
);

-- User-Role Mapping
CREATE TABLE user_roles (
  user_id TEXT NOT NULL,
  role_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  org_id TEXT NOT NULL,
  assigned_at TEXT NOT NULL DEFAULT (datetime('now')),
  assigned_by TEXT NOT NULL,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (role_id) REFERENCES rbac_roles(id)
);

-- API Keys
CREATE TABLE api_keys (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  org_id TEXT NOT NULL,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL,        -- Argon2id hash
  scope TEXT NOT NULL,           -- JSON array
  rate_limit_bucket TEXT NOT NULL DEFAULT 'default',
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT,
  revoked_at TEXT,
  last_used_at TEXT
);

-- Audit Log (written via Pipeline — Gateway enqueues, Pipeline commits)
CREATE TABLE spine_audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  user_id TEXT,
  api_key_id TEXT,
  action TEXT NOT NULL,          -- route + method
  resource_type TEXT,
  resource_id TEXT,
  status_code INTEGER,
  latency_ms INTEGER,
  correlation_id TEXT NOT NULL,
  ip_hash TEXT,                  -- privacy-preserving
  user_agent_hash TEXT,
  timestamp TEXT NOT NULL DEFAULT (datetime('now')),
  details TEXT                   -- JSON: request summary
);
CREATE INDEX idx_audit_tenant ON spine_audit_log(tenant_id, timestamp);
CREATE INDEX idx_audit_correlation ON spine_audit_log(correlation_id);

-- Invitation (for org invites)
CREATE TABLE invitations (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  org_id TEXT NOT NULL,
  email TEXT NOT NULL,
  role_id TEXT NOT NULL,
  invited_by TEXT NOT NULL,
  token_hash TEXT NOT NULL,      -- hash of the invite token
  expires_at TEXT NOT NULL,
  accepted_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(tenant_id, email) WHERE accepted_at IS NULL
);
```

---

## 15. Error Handling & Response Contract

All Gateway responses follow a uniform error envelope:

```typescript
// packages/auth-types/src/errors.ts

export interface GatewayError {
  error: {
    code: string; // machine-readable: "invalid_token", "rate_limited", ...
    message: string; // human-readable
    details?: unknown; // context-specific (Zod errors, etc.)
    request_id: string; // correlation_id for tracing
    timestamp: string; // ISO 8601
  };
}

/**
 * HTTP Status → Error Code Mapping
 */
export const ERROR_CODES = {
  400: {
    invalid_json: "Request body is not valid JSON",
    validation_failed: "Request failed schema validation",
    missing_field: "Required field is missing",
  },
  401: {
    missing_token: "Authorization header is required",
    invalid_token: "Token is malformed or signature is invalid",
    expired_token: "Token has expired",
  },
  403: {
    insufficient_permissions: "Role does not have required permission",
    invalid_tenant_claim: "JWT tenant claim mismatch",
    tenant_suspended: "Tenant account is suspended",
    session_revoked: "Session has been revoked",
    cross_tenant_access: "Access to another tenant is forbidden",
  },
  404: {
    route_not_found: "The requested endpoint does not exist",
    resource_not_found: "The requested resource does not exist",
  },
  429: {
    rate_limited: "Too many requests",
  },
  500: {
    internal_error: "An unexpected error occurred",
    service_unavailable: "A downstream service is unavailable",
  },
} as const;
```

---

## 16. Operational Concerns

### 16.1 Gateway Deployment

```yaml
# services/gateway/wrangler.toml
name = "integratewise-gateway"
main = "src/index.ts"
compatibility_date = "2026-07-01"

# Service bindings to all 26 services
[[services]]
binding = "TENANTS"
service = "iw-tenants"

[[services]]
binding = "CONNECTOR"
service = "iw-connector"

# ... (all 26 bindings)

[[services]]
binding = "MCP_CONNECTOR"
service = "iw-mcp-connector"

# KV namespaces
[[kv_namespaces]]
binding = "KV"
id = "<discovery-cache-kv-id>"

# Rate limiting (Cloudflare Rate Limiting API)
[limits]
cpu_ms = 50  # Gateway is lightweight — auth, route, bind

# Secrets (set via `wrangler secret put`)
# JWT_PRIVATE_KEY — RSA private key for signing
# JWT_PUBLIC_KEY — RSA public key for verification (also cached in KV)
```

### 16.2 Monitoring & Alerting

| Metric                    | Source            | Threshold             | Alert |
| ------------------------- | ----------------- | --------------------- | ----- |
| Gateway p99 latency       | Workers Analytics | > 100ms               | P2    |
| Auth failure rate         | `spine_audit_log` | > 5% of requests      | P1    |
| Rate limit hits           | KV counters       | > 10% of tenants      | P2    |
| JWT verification errors   | Gateway logs      | > 1% of requests      | P1    |
| Discovery cache miss rate | KV stats          | > 20%                 | P3    |
| MCP session count         | KV key count      | Approaching KV limits | P2    |

### 16.3 Scaling Considerations

- **Gateway:** Single Worker handles all ingress. Cloudflare auto-scales. CPU limit 50ms per request.
- **Rate limit buckets:** KV-backed, eventual consistency acceptable. For stricter consistency, use D1 counter table.
- **Session store:** KV with TTL. Sessions are ephemeral — no need for strong consistency.
- **Discovery cache:** KV with 60s TTL. Stale data is acceptable (capabilities don't change that fast).
- **Webhook-ingress:** Separate Worker to isolate burst traffic from API traffic.

---

## 17. Changelog

| Version | Date       | Change                                                                                                                                                                                                                       |
| ------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.0.0   | 2026-07-02 | Initial v2.0 specification. Unified Identity + Ingress into single domain. Formalized JWT claims, API key model, RBAC hierarchy, rate limit tiers, MCP SSE transport, Discovery contract. Aligned with 6-layer architecture. |

---

**END OF SPECIFICATION**

_This document is the definitive reference for the Identity & Ingress Layers of the IntegrateWise Continuity Bridge v2.0. All downstream implementations must conform to the interfaces, flows, and security boundaries defined herein._

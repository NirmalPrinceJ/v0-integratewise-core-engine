# IntegrateWise Continuity Bridge v2.0 — Security Model & Zero-Trust

# Domain Specification — Stage 1/2 Deep-Dive

**Status:** DRAFT-for-Review | **Version:** 2.0.0-SECURITY | **Date:** 2026-07-02
**Domain Owner:** Security Architecture | **Feeds Into:** Canonical Architecture v2.0

---

## Table of Contents

1. [Security Doctrine](#1-security-doctrine)
2. [Zero-Trust Architecture](#2-zero-trust-architecture)
3. [P0 Security Posture](#3-p0-security-posture)
4. [P1 Security Posture](#4-p1-security-posture)
5. [Tenant Isolation](#5-tenant-isolation)
6. [JWT Validation](#6-jwt-validation)
7. [Service Binding Auth](#7-service-binding-authentication)
8. [Cross-Tenant Prevention](#8-cross-tenant-prevention)
9. [Secret Management](#9-secret-management)
10. [Audit Model](#10-audit-model)
11. [Compliance Framework](#11-compliance-framework)
12. [Integration Points](#12-integration-points)
13. [Threat Model](#13-threat-model)
14. [TypeScript Contracts](#14-typescript-contracts)

---

## 1. Security Doctrine

> **"Every hop carries tenant_id. Every gate fails closed. Every audit write halts on failure."**

| Principle           | Meaning                            | Enforcement                      |
| ------------------- | ---------------------------------- | -------------------------------- |
| **Fail-Closed**     | Absence of proof is denial         | 403 on any auth anomaly          |
| **Fail-Loud**       | Violations logged, not swallowed   | `SECURITY_VIOLATION` audit event |
| **Immutable Audit** | Synchronous, blocking audit writes | Failure halts operation          |

Security is a **cross-cutting fabric** through all six layers: Identity → Ingress → Capability → Continuity → Governance → Provider Fabric. The Continuity Layer is the **moat**.

---

## 2. Zero-Trust Architecture

### 2.1 The Six Security Gates

```
Consumers ──▶ [G1 Identity] ──▶ [G2 Ingress] ──▶ [G3 Capability]
                  │                  │                  │
            gateway JWT       rate-limit/CORS     tool scope
                  │                  │                  │
                  ▼                  ▼                  ▼
             [G4 Continuity] ──▶ [G5 Governance] ──▶ [G6 Provider]
              tenant fence       confidence gate    credential wall
```

| Gate   | Layer           | Service                             | Validates                                      |
| ------ | --------------- | ----------------------------------- | ---------------------------------------------- |
| **G1** | Identity        | `gateway`                           | JWT signature, expiry, `tenant_id` claim       |
| **G2** | Ingress         | `gateway`                           | Rate limits, CORS, API key, plan quotas        |
| **G3** | Capability      | `mcp-connector`, `iw-agent-runtime` | Tool scope, read/write posture                 |
| **G4** | Continuity      | `pipeline`, `continuity`            | Tenant fence on all Spine ops                  |
| **G5** | Governance      | `govern`                            | Confidence threshold, HITL, audit precondition |
| **G6** | Provider Fabric | `act`, `connector`                  | Credential wall, outbound scope, health        |

**Invariant:** No gate may be bypassed. G1 before G2, G2 before G3, and so on.

---

## 3. P0 Security Posture — Production Blockers

P0 vulnerabilities **must close before production** tenant data enters the platform.

| #     | Vulnerability                | Fix                                                                                                | Owner                         | Closure Criteria                                           |
| ----- | ---------------------------- | -------------------------------------------------------------------------------------------------- | ----------------------------- | ---------------------------------------------------------- |
| P0-1  | Cross-tenant data leak       | `withTenant()` on every D1 query. JOINs with tenant predicate on both sides.                       | ALL                           | Pen-test: mismatched tenant_id → 403                       |
| P0-2  | Tenant-id spoofing           | Gateway extracts `tenant_id` **exclusively** from JWT `sub`. Client `x-tenant-id` stripped at G1.  | `gateway`                     | Fuzz: 1000 forged requests → all rewritten to JWT tenant   |
| P0-3  | Tenant middleware no-op      | All service bindings include `x-iw-tenant-context`. Receiving Workers validate presence.           | `gateway`                     | Code audit: zero bindings without tenant header            |
| P0-4  | HITL DO global namespace     | All DO IDs from `hash(tenant_id + ":" + user_id + ":" + purpose)`. Never `idFromName("global")`.   | `govern`, `twin-orchestrator` | DO list: no DO without tenant prefix                       |
| P0-5  | Invitation cross-tenant scan | `SELECT * FROM invitations WHERE tenant_id = ? AND code = ?` — two-param minimum.                  | `tenants`                     | SQL audit: all invitation queries have tenant predicate    |
| P0-6  | Hardcoded secrets            | All secrets in Cloudflare Secrets. `admin` manages rotation.                                       | `admin`                       | `grep -r "sk-" services/` returns zero                     |
| P0-7  | `.env` in repository         | `.env` gitignored. `doppler.yaml` for injection. Git history scanned.                              | `admin`                       | `git log --all --full-history -- .env` shows removal       |
| P0-8  | SQL injection                | Drizzle ORM exclusively. `db-gate.ts` enforces parameterization.                                   | `continuity`, `knowledge`     | Static analysis: zero `db.raw()` outside `db-gate.ts`      |
| P0-9  | MCP-JWT bypass               | `Authorization: Bearer <jwt>` required on `/tools`, `/invoke`, `/mcp`, `/sessions`. 403 otherwise. | `mcp-connector`               | Integration test: all MCP endpoints reject unauthenticated |
| P0-10 | Auth root thrashing          | **Freeze:** Gateway JWT + API Keys only. Remove Clerk/Stack/Descope imports.                       | `gateway`                     | Zero `@clerk/`, `@stack/`, `@descope/` imports             |

---

## 4. P1 Security Posture — Hardening

Close within **30 days** of first production tenant onboarding.

| #    | Vulnerability                   | Fix                                                                                     | Owner             | SLA |
| ---- | ------------------------------- | --------------------------------------------------------------------------------------- | ----------------- | --- |
| P1-1 | Billing on Supabase             | Migrate billing to D1. Usage aggregation in `billing` service.                          | `billing`         | 30d |
| P1-2 | Rate-limiter fails open         | CF Rate Limiting: 100/min per JWT, 1000/min per tenant. Fail-closed → 429.              | `gateway`         | 14d |
| P1-3 | CORS reflects arbitrary origins | Whitelist: `app.integratewise.ai`, `*.integratewise.pages.dev`, `localhost:5173` (dev). | `gateway`         | 14d |
| P1-4 | MCP JWT bypass (residual)       | Close P0-9 + scope verification on every invocation (`scope: read` vs `write`).         | `mcp-connector`   | 7d  |
| P1-5 | Unsigned webhook auto-approve   | `loader` verifies Nango `X-Nango-Signature`. Unsigned → 401.                            | `loader`          | 14d |
| P1-6 | Webhook replay/timing           | `webhook-ingress` idempotency keys. KV dedup: 24h window.                               | `webhook-ingress` | 14d |
| P1-7 | Weak password hashing           | Argon2id or PBKDF2 600k+ iterations.                                                    | `tenants`         | 30d |
| P1-8 | Supabase client dependency      | Remove `@supabase/supabase-js`. All DB via `packages/lib/db-gate.ts`.                   | All               | 60d |

---

## 5. Tenant Isolation

### 5.1 Isolation Architecture

```
Tenant A (acme)     Tenant B (stark)      Tenant C (cz)
     │                    │                    │
     ▼                    ▼                    ▼
┌─────────┐          ┌─────────┐          ┌─────────┐
│JWT: sub │          │JWT: sub │          │JWT: sub │
│=u:acme  │          │=u:stark │          │=u:cz    │
└────┬────┘          └────┬────┘          └────┬────┘
     │                    │                    │
     ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                    GATEWAY (single Worker)                   │
│   [JWT verify] ──▶ [extract tenant_id] ──▶ [inject binding] │
└─────────────────────────────────────────────────────────────┘
     │                    │                    │
     ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                         D1 DATABASE                          │
│   entities, relationships, memory, audit_logs               │
│   ALL queries: WHERE tenant_id = ?                          │
│   Cross-tenant query = SECURITY_VIOLATION → 403 + alert     │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Isolation Rules

| Rule                        | Implementation                                           | Violation                            |
| --------------------------- | -------------------------------------------------------- | ------------------------------------ |
| **R1** Query Isolation      | `WHERE tenant_id = ?` as first predicate                 | 403 + `SECURITY_VIOLATION`           |
| **R2** Schema Isolation     | Per-tenant `tenant_spine_config` on first auth           | No shared schema                     |
| **R3** Memory Isolation     | Memory scopes sub-scoped by tenant                       | Cross-tenant read → 403              |
| **R4** Credential Isolation | Nango `connectionId = tenant_id + ":" + provider`        | Credential wall rejects cross-tenant |
| **R5** Audit Isolation      | Tenant-scoped; admin cross-tenant requires `super_admin` | Logged in `admin_audit_log`          |

### 5.3 The `withTenant()` Helper

```typescript
// packages/spine-schema/src/helpers.ts

export function withTenant<T extends SQLiteTable>(
  query: SQLiteSelectBuilder<T>,
  tenantId: string,
  table: T
): SQLiteSelectBuilder<T> {
  // HARD FENCE: tenant_id is first WHERE predicate → composite index prefix usage
  return query.where(eq(table.tenantId, tenantId));
}

export function assertTenantScope<T extends { tenantId: string }>(
  rows: T[],
  expectedTenantId: string,
  operation: string
): void {
  for (const row of rows) {
    if (row.tenantId !== expectedTenantId) {
      throw new SecurityViolationError(
        `Cross-tenant leak in ${operation}. Expected ${expectedTenantId}, got ${row.tenantId}`
      );
    }
  }
}
```

---

## 6. JWT Validation

### 6.1 JWT Claims Schema

```typescript
// packages/mcp-types/src/guards.ts

export interface GatewayJwtClaims {
  jti: string; // Unique token ID (revocation, idempotency)
  sub: string; // "user_id:tenant_id"
  tenant_id: string; // Extracted from sub, NEVER from client input
  user_id: string;
  iss: "https://gateway.integratewise.ai";
  aud: string; // Target service binding name
  iat: number;
  exp: number; // Max 24h session, 1y API key
  scope: string; // "read write admin"
  role: "owner" | "admin" | "member" | "viewer" | "service_account";
  plan: "free" | "pro" | "enterprise" | "customer_zero";
  sid: string; // Session correlation ID
  type: "session" | "api_key";
}

export interface ValidatedIdentity {
  jti: string;
  tenantId: string;
  userId: string;
  role: GatewayJwtClaims["role"];
  scope: string[];
  plan: GatewayJwtClaims["plan"];
  sessionId: string;
  tokenType: "session" | "api_key";
  issuedAt: number;
  expiresAt: number;
}
```

### 6.2 JWT Validation Flow

```
Request ──▶ G1.1 Extract Auth header ──▶ Missing → 401
                │
                ▼
           G1.2 Verify RS256 signature (CF Secrets key) ──▶ Invalid → 403
                │
                ▼
           G1.3 Validate iat/exp/nbf (60s skew) ──▶ Expired → 401
                │
                ▼
           G1.4 Extract tenant_id from sub ("user:tenant") ──▶ Strip client x-tenant-id
                │
                ▼
           G1.5 Verify aud matches target binding
                │
                ▼
           G1.6 Inject binding headers: x-iw-tenant-id, x-iw-user-id,
                x-iw-jti, x-iw-scope, x-iw-role, x-iw-caller
                │
                ▼
           [Proceed to G2: Ingress Gate]
```

### 6.3 Gateway Auth Implementation

```typescript
// services/gateway/src/auth.ts

const GATEWAY_ISSUER = "https://gateway.integratewise.ai";
const CLOCK_SKEW_MS = 60000;

export async function validateJwt(
  authHeader: string | null,
  targetAudience: string,
  env: Env
): Promise<ValidatedIdentity> {
  if (!authHeader?.startsWith("Bearer ")) {
    throw new AuthError("MISSING_AUTH_HEADER", 401, "Authorization required");
  }

  const publicKey = await importSPKI(env.JWT_PUBLIC_KEY, "RS256");
  const { payload } = await jwtVerify(authHeader.slice(7), publicKey, {
    issuer: GATEWAY_ISSUER,
    audience: targetAudience,
    clockTolerance: CLOCK_SKEW_MS / 1000,
  });

  const [userId, tenantId] = (payload.sub as string).split(":");
  if (!userId || !tenantId) {
    throw new AuthError("MALFORMED_SUBJECT", 403, "sub must be user_id:tenant_id");
  }

  return {
    jti: payload.jti as string,
    tenantId,
    userId,
    role: payload.role as GatewayJwtClaims["role"],
    scope: (payload.scope as string).split(" "),
    plan: payload.plan as GatewayJwtClaims["plan"],
    sessionId: payload.sid as string,
    tokenType: payload.type as "session" | "api_key",
    issuedAt: payload.iat as number,
    expiresAt: payload.exp as number,
  };
}

export const authMiddleware = (targetAudience: string) => async (c: Context, next: Next) => {
  try {
    const identity = await validateJwt(c.req.header("Authorization"), targetAudience, c.env);
    c.set("identity", identity);

    const headers = new Headers(c.req.raw.headers);
    headers.delete("x-tenant-id");
    headers.delete("x-iw-tenant-id"); // Strip spoofing

    headers.set("x-iw-tenant-id", identity.tenantId);
    headers.set("x-iw-user-id", identity.userId);
    headers.set("x-iw-jti", identity.jti);
    headers.set("x-iw-scope", identity.scope.join(" "));
    headers.set("x-iw-role", identity.role);

    await next();
  } catch (err) {
    // FAIL-CLOSED: any auth error = 403
    return c.json(
      { error: err instanceof AuthError ? err.code : "AUTH_FAILURE" },
      err instanceof AuthError ? err.status : 403
    );
  }
};
```

---

## 7. Service Binding Authentication

### 7.1 Internal Trust Model

Service bindings are **not implicitly trusted**. Each callee validates caller identity and tenant context.

```
Caller (gateway) ──fetch(binding, {
  headers: {
    'x-iw-tenant-id': 'acme', 'x-iw-user-id': 'user-123',
    'x-iw-jti': 'jwt-id', 'x-iw-scope': 'read',
    'x-iw-role': 'admin', 'x-iw-caller': 'gateway',
    'x-iw-correlation-id': 'uuid'
  }
})──▶ Callee (tenants)

Callee validates:
1. All required headers present
2. Caller in SERVICE_CALLER_ALLOWLISTS[serviceName]
3. tenant_id well-formed: /^[a-z0-9_-]{3,64}$/
```

### 7.2 Binding Validation Contract

```typescript
// packages/mcp-types/src/guards.ts

export interface ServiceBindingHeaders {
  "x-iw-tenant-id": string;
  "x-iw-user-id": string;
  "x-iw-jti": string;
  "x-iw-scope": string;
  "x-iw-role": string;
  "x-iw-caller": string;
  "x-iw-correlation-id": string;
}

export const SERVICE_CALLER_ALLOWLISTS: Record<string, string[]> = {
  tenants: ["gateway", "admin", "billing"],
  pipeline: ["normalizer", "act", "workflow", "gateway"],
  govern: ["twin-orchestrator", "workflow", "gateway"],
  act: ["gateway", "workflow", "hermes", "iw-agent-runtime"],
  continuity: ["pipeline", "triage", "twin-orchestrator"],
  "mcp-connector": ["gateway"],
  "agent-registry": ["gateway", "mcp-connector", "iw-agent-runtime"],
};

export function validateServiceBinding(
  headers: Headers,
  serviceName: string
): { tenantId: string; userId: string; scope: string[]; role: string; caller: string } {
  const tenantId = headers.get("x-iw-tenant-id");
  const userId = headers.get("x-iw-user-id");
  const jti = headers.get("x-iw-jti");
  const scope = headers.get("x-iw-scope");
  const role = headers.get("x-iw-role");
  const caller = headers.get("x-iw-caller");

  if (!tenantId || !userId || !jti || !scope || !role || !caller) {
    throw new ServiceBindingError(
      "MISSING_BINDING_CONTEXT",
      "Required: x-iw-tenant-id, x-iw-user-id, x-iw-jti, x-iw-scope, x-iw-role, x-iw-caller"
    );
  }

  const allowlist = SERVICE_CALLER_ALLOWLISTS[serviceName] || [];
  if (!allowlist.includes(caller)) {
    throw new ServiceBindingError(
      "UNAUTHORIZED_CALLER",
      `Service '${caller}' cannot call '${serviceName}'`
    );
  }

  if (!/^[a-z0-9_-]{3,64}$/.test(tenantId)) {
    throw new ServiceBindingError("INVALID_TENANT_ID", `Malformed tenant_id: ${tenantId}`);
  }

  return { tenantId, userId, scope: scope.split(" "), role, caller };
}
```

---

## 8. Cross-Tenant Prevention

### 8.1 Defense-in-Depth Layers

| Layer            | Mechanism                                          | Failure Mode                         |
| ---------------- | -------------------------------------------------- | ------------------------------------ |
| **L1** Gateway   | `tenant_id` from JWT only; client headers stripped | Spoofed headers ignored              |
| **L2** Binding   | `x-iw-tenant-id` on every internal call            | Missing header → 403                 |
| **L3** Query     | `withTenant()` on every DB query                   | Missing predicate → linter rejection |
| **L4** Result    | `assertTenantScope()` on every result set          | Cross-tenant row → exception         |
| **L5** Telemetry | Continuous query pattern analysis                  | Anomaly → alert                      |

### 8.2 Detection & Response Flow

```
DETECTION:
1. Gateway: forged x-tenant-id → Stripped, rewritten
2. Binding: missing tenant header → 403 + audit
3. DB Query: no WHERE tenant_id → Linter blocks
4. Result: row.tenant_id ≠ expected → SecurityViolationError
5. Telemetry: anomalous JOIN → Alert

RESPONSE:
1. Return 403 (fail-closed, NOT 404)
2. Audit: type="SECURITY_VIOLATION", severity="CRITICAL",
   violation_type="CROSS_TENANT_ACCESS_ATTEMPT", jti=<revoke>
3. Alert: PagerDuty + #security-alerts
4. Investigate: same jti in 24h
5. If data leaked: customer notification 72h SLA
6. Post-mortem: 48h
```

### 8.3 Cross-Tenant Prevention in Adapters

```typescript
// services/act/src/adapters/credentials.ts

export async function getCredentials(
  provider: string,
  tenantId: string,
  env: Env
): Promise<Credentials> {
  // L1: Validate format (injection defense)
  if (!/^[a-z0-9_-]{3,64}$/.test(tenantId)) {
    throw new SecurityViolationError("INVALID_TENANT_ID_FORMAT");
  }

  // L2: Fetch from CF Secrets using tenant-scoped key
  const secretName = `${provider}:${tenantId}:credentials`;
  const encryptedCreds = await env.CREDENTIALS_SECRETS.get(secretName);

  if (!encryptedCreds) {
    throw new AuthError(
      "CREDENTIALS_NOT_FOUND",
      403,
      `No credentials for ${provider} / ${tenantId}`
    );
  }

  // L3: Validate stored tenant matches request
  const creds: Credentials = JSON.parse(await decrypt(encryptedCreds, env.ENCRYPTION_KEY));
  if (creds.tenantId !== tenantId) {
    throw new SecurityViolationError(
      "CREDENTIAL_TENANT_MISMATCH",
      `Requested ${tenantId}, stored ${creds.tenantId}`
    );
  }

  return creds;
}
```

---

## 9. Secret Management

### 9.1 Secret Tiers

| Tier   | What                            | Storage                 | Rotation          | Access                   |
| ------ | ------------------------------- | ----------------------- | ----------------- | ------------------------ |
| **T0** | Gateway RSA keys, DB encryption | Cloudflare Secrets      | 90d               | `env.SECRET_NAME`        |
| **T1** | OAuth tokens, API keys          | CF Secrets (namespaced) | 180d / refresh    | Credential wall in `act` |
| **T2** | JWT tokens, SSE session state   | KV (encrypted)          | JWT: 24h, SSE: 1h | `sessions` namespace     |
| **T3** | Feature flags, rate limits      | KV                      | Real-time         | `config` namespace       |
| **T4** | Raw audit, telemetry            | R2 (encrypted at rest)  | 7y                | `telemetry` bucket       |

### 9.2 Naming Conventions

```
Cloudflare Secrets:
├── PLATFORM/
│   ├── GATEWAY_RSA_PRIVATE_KEY, GATEWAY_RSA_PUBLIC_KEY
│   ├── DB_ENCRYPTION_KEY, API_KEY_SALT
│   ├── MCP_SIGNING_SECRET, NANGO_WEBHOOK_SECRET
│
└── TENANT-SCOPED (pattern: {provider}:{tenantId}:credentials)
    ├── salesforce:acme-corp:credentials
    ├── hubspot:acme-corp:credentials
    ├── stripe:acme-corp:webhook_secret
    └── github:stark-ind:credentials
```

### 9.3 Field-Level Encryption

```typescript
// packages/lib/src/encryption.ts

export async function encryptField(plaintext: string, key: CryptoKey): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(plaintext)
  );
  return `${btoa(String.fromCharCode(...iv))}:${btoa(String.fromCharCode(...new Uint8Array(ciphertext)))}`;
}

export const SENSITIVE_FIELDS = [
  "access_token",
  "refresh_token",
  "api_key",
  "password_hash",
  "email_raw",
  "phone_raw",
] as const;
```

### 9.4 Secret Rotation Flow

```
Trigger (90d cron or admin) ──▶ Generate new key (RSA-4096 / AES-256)
                                      │
                                      ▼
                         Dual-write phase (old + new valid, 24h grace)
                                      │
                                      ▼
                         Issue new JWTs with new key
                                      │
                                      ▼
                         Monitor: validation errors on old tokens?
                                      │
                                      ▼
                         After grace: revoke old key
                                      │
                                      ▼
                         Audit: type="SECRET_ROTATION", key fingerprint
```

---

## 10. Audit Model

### 10.1 Audit Log Schema

```typescript
// packages/spine-schema/src/schema/audit.ts

export const auditLogs = sqliteTable("audit_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  timestamp: integer("timestamp", { mode: "timestamp" }).notNull(),
  tenantId: text("tenant_id").notNull(),
  userId: text("user_id").notNull(),
  jti: text("jti").notNull(),
  sessionId: text("session_id"),
  type: text("type", {
    enum: [
      "ENTITY_CREATE",
      "ENTITY_UPDATE",
      "ENTITY_DELETE",
      "ENTITY_READ",
      "GOVERNANCE_APPROVE",
      "GOVERNANCE_REJECT",
      "GOVERNANCE_DISCARD",
      "MCP_INVOKE",
      "MCP_TOOL_LIST",
      "MCP_SESSION",
      "WORKFLOW_START",
      "WORKFLOW_STEP",
      "WORKFLOW_COMPLETE",
      "SECURITY_VIOLATION",
      "AUTH_FAILURE",
      "RATE_LIMIT_HIT",
      "OUTBOUND_CALL",
      "SYNC_START",
      "SYNC_COMPLETE",
      "TWIN_PROPOSE",
      "TWIN_REASONING",
      "ADMIN_OVERRIDE",
      "SECRET_ROTATION",
    ],
  }).notNull(),
  severity: text("severity", { enum: ["INFO", "WARN", "ERROR", "CRITICAL"] })
    .notNull()
    .default("INFO"),
  service: text("service").notNull(),
  action: text("action").notNull(),
  resourceType: text("resource_type"),
  resourceId: text("resource_id"),
  correlationId: text("correlation_id").notNull(),
  clientIp: text("client_ip"),
  userAgent: text("user_agent"),
  requestHash: text("request_hash"), // SHA-256
  responseHash: text("response_hash"), // SHA-256
  confidenceScore: real("confidence_score"),
  approvalState: text("approval_state", {
    enum: ["auto_approved", "pending", "approved", "rejected", "discarded"],
  }),
  statusCode: integer("status_code"),
  errorCode: text("error_code"),
  errorMessage: text("error_message"),
  dataClassification: text("data_classification", {
    enum: ["public", "internal", "confidential", "restricted"],
  }),
  retentionPolicy: text("retention_policy").notNull().default("7_years"),
  parentAuditId: integer("parent_audit_id"),
  chainHash: text("chain_hash").notNull(), // Tamper detection
});
```

### 10.2 Audit Write Flow (Fail-Loud)

```
Service performs auditable action
        │
        ▼
Build AuditEvent (all fields)
        │
        ▼
Call writeAuditLog() ──synchronous, blocking──▶ pipeline service writes to D1
                                                       │
                                              ┌────────┴────────┐
                                              ▼                 ▼
                                         SUCCESS           FAILURE
                                         Return 200         HALT OPERATION
                                         Continue           Throw AuditWriteFailure
                                                            Return 503
```

**Rationale:** Cannot prove compliance without audit. Silent failures = liability.

### 10.3 Audit Events by Service

| Service             | Events                                          | Frequency         |
| ------------------- | ----------------------------------------------- | ----------------- |
| `gateway`           | `AUTH_FAILURE`, `RATE_LIMIT_HIT`, `MCP_SESSION` | Per request       |
| `mcp-connector`     | `MCP_INVOKE`, `MCP_TOOL_LIST`                   | Per MCP op        |
| `pipeline`          | `ENTITY_CREATE/UPDATE/DELETE`                   | Per Spine write   |
| `govern`            | `GOVERNANCE_APPROVE/REJECT/DISCARD`             | Per proposal      |
| `twin-orchestrator` | `TWIN_PROPOSE`, `TWIN_REASONING`                | Per cycle         |
| `act`               | `OUTBOUND_CALL`                                 | Per provider exec |
| `workflow`          | `WORKFLOW_START/STEP/COMPLETE`                  | Per workflow      |
| `connector-sync`    | `SYNC_START`, `SYNC_COMPLETE`                   | Per sync          |
| `admin`             | `ADMIN_OVERRIDE`, `SECRET_ROTATION`             | Per admin action  |
| ALL                 | `SECURITY_VIOLATION`                            | On detection      |

---

## 11. Compliance Framework

### 11.1 Compliance Posture

| Framework         | Status                | Scope                                   | Evidence                                |
| ----------------- | --------------------- | --------------------------------------- | --------------------------------------- |
| **SOC 2 Type II** | Target: Month 12      | Security, Availability, Confidentiality | `audit_logs`, rotation records          |
| **GDPR**          | Required: Launch      | Subject rights, erasure, portability    | Tenant isolation, retention, export API |
| **CCPA/CPRA**     | Required: Launch (US) | Consumer privacy rights                 | Unified privacy API                     |
| **HIPAA**         | Future (BAA required) | PHI handling                            | Field-level encryption, access logs     |
| **ISO 27001**     | Target: Month 18      | ISMS                                    | Risk register, documentation            |

### 11.2 Data Classification

| Classification   | Examples                    | Storage         | Encryption        | Retention        |
| ---------------- | --------------------------- | --------------- | ----------------- | ---------------- |
| **Public**       | Marketing, docs             | R2, Pages       | TLS in transit    | 2y               |
| **Internal**     | Tenant config, metadata     | D1, KV          | TLS + field-level | 7y               |
| **Confidential** | Entity data, memory         | D1              | TLS + field-level | 7y               |
| **Restricted**   | OAuth tokens, API keys, PII | CF Secrets + D1 | AES-256-GCM + TLS | Token life + 30d |

### 11.3 GDPR Privacy API

```typescript
// services/admin/src/privacy.ts

/** Article 17 — Right to Erasure */
export async function handleErasureRequest(
  tenantId: string,
  userId: string | null,
  initiatedBy: string,
  env: Env
): Promise<ErasureTicket> {
  const ticket: ErasureTicket = {
    id: crypto.randomUUID(),
    tenantId,
    userId,
    status: "queued",
    requestedAt: Date.now(),
    deadlineAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
  };

  await env.WORKFLOW_QUEUE.send({
    type: "gdpr_erasure",
    ticket,
    stages: [
      "audit_backup",
      "spine_entities_delete",
      "spine_relationships_delete",
      "memory_delete",
      "connector_cleanup",
      "nango_disconnect",
      "kv_invalidate",
      "final_audit",
    ],
  });

  return ticket;
}

/** Article 20 — Data Portability */
export async function handlePortabilityRequest(
  tenantId: string,
  env: Env
): Promise<PortabilityExport> {
  const entities = await withTenant(db.select().from(schema.entities), tenantId, schema.entities);
  const relationships = await withTenant(
    db.select().from(schema.relationships),
    tenantId,
    schema.relationships
  );
  return {
    tenantId,
    exportedAt: Date.now(),
    format: "json",
    entities,
    relationships,
    memory: [],
    auditTrail: [],
  };
}
```

### 11.4 Retention Policies

| Data Type        | Default                        | Configurable | Destruction                 |
| ---------------- | ------------------------------ | ------------ | --------------------------- |
| Audit logs       | 7 years                        | No           | Archive to R2 cold after 2y |
| Active memory    | 30 days (reinforcement resets) | Yes (plan)   | Soft → archive → purge      |
| Staging memory   | 7 days                         | No           | Hard delete                 |
| Spine entities   | Indefinite                     | No           | Erasure request only        |
| Telemetry traces | 30 days                        | Yes          | Auto purge                  |
| Error logs       | 90 days                        | No           | Auto purge                  |
| Session tokens   | 24h                            | No           | JWT expiry                  |
| API keys         | 1 year max                     | No           | Rotation or revocation      |

---

## 12. Integration Points with Adjacent Layers

### 12.1 Security ↔ Identity (Layer 1)

```
Identity (gateway, tenants)
     │ 1. JWT issuance on auth
     │ 2. RBAC → included in JWT claims
     ▼
Contract: JWT is the ONLY identity artifact. Role drives Discovery visibility.
          Plan drives rate limits.
```

### 12.2 Security ↔ Ingress (Layer 2)

```
Ingress (gateway, webhook-ingress, mcp-connector)
     │ 1. Rate limiting: 100/min per JWT, 1000/min per tenant
     │ 2. CORS: whitelist only
     │ 3. Webhook signatures verified before processing
     ▼
Contract: All ingress validated before Capability Layer. Webhooks untrusted until signed.
```

### 12.3 Security ↔ Capability (Layer 3)

```
Capability (iw-agent-runtime, mcp-connector, think, hermes)
     │ 1. Tool catalog filtered by tenant's connected providers
     │ 2. Read-only default; write requires scope:write + governance
     │ 3. Model access gated by plan tier
     ▼
Contract: AI agents cannot discover other tenants' tools. Write = scope + governance.
```

### 12.4 Security ↔ Continuity (Layer 4 — THE MOAT)

```
Continuity (pipeline, continuity, spine-v2)
     │ 1. pipeline (ONLY writer) enforces WHERE tenant_id = ?
     │ 2. continuity validates memory scope against tenant
     │ 3. spine-v2 ensures SSOC UUIDs are tenant-scoped
     ▼
Contract: The moat. Data here passed all upstream gates. pipeline is the ONLY Spine writer.
          Memory compounding never crosses tenants.
```

### 12.5 Security ↔ Governance (Layer 5)

```
Governance (govern, workflow, twin-orchestrator)
     │ 1. 0.70/0.85 thresholds before act
     │ 2. 0.70–0.85 queued to My Desk with audit trail
     │ 3. No governance decision without audit log
     ▼
Contract: Final human safety layer. All proposals audited. HITL DOs per-tenant+user only.
```

### 12.6 Security ↔ Provider Fabric (Layer 6)

```
Provider Fabric (act, connector, connector-sync, external APIs)
     │ 1. act fetches per-tenant credentials from CF Secrets
     │ 2. Adapter validates capability path before provider call
     │ 3. Normalizer strips PII before Spine write
     ▼
Contract: No shared tokens. Provider errors never leak credentials.
          Outbound calls audited with request/response hashes.
```

---

## 13. Threat Model & Mitigation Matrix

| Threat                 | STRIDE          | Likelihood | Impact   | Mitigation                                             | Layer |
| ---------------------- | --------------- | ---------- | -------- | ------------------------------------------------------ | ----- |
| Cross-tenant data leak | Elevation       | Medium     | Critical | `withTenant()`, `assertTenantScope()`, binding headers | L4    |
| JWT theft/replay       | Spoofing        | Medium     | High     | Short expiry, JTI tracking, RS256                      | L1    |
| Credential exposure    | Info Disclosure | Low        | Critical | CF Secrets, field-level encryption, no `.env`          | L6    |
| DDoS / Abuse           | DoS             | High       | Medium   | Rate limiting (fail-closed), CF WAF                    | L2    |
| SQL injection          | Tampering       | Low        | High     | Drizzle ORM, no raw queries                            | L4    |
| Webhook spoofing       | Spoofing        | Medium     | High     | Signature verification, idempotency keys               | L2    |
| AI prompt injection    | Tampering       | Medium     | Medium   | Input validation, governance gate                      | L3    |
| Insider threat (admin) | Elevation       | Low        | Critical | Admin audit, 2-eyes, role separation                   | L5    |
| Supply chain           | Tampering       | Medium     | High     | pnpm lockfile, Snyk, pinned versions                   | L0    |
| Session fixation       | Spoofing        | Low        | Medium   | Regenerate on auth, short JWTs                         | L1    |

---

## 14. TypeScript Contracts

### 14.1 Core Security Types

```typescript
// packages/mcp-types/src/guards.ts

export class SecurityViolationError extends Error {
  constructor(
    public code: string,
    message?: string,
    public metadata?: Record<string, unknown>
  ) {
    super(message || `Security violation: ${code}`);
    this.name = "SecurityViolationError";
  }
}

export class AuthError extends Error {
  constructor(
    public code: string,
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export class ServiceBindingError extends Error {
  constructor(
    public code: string,
    message: string
  ) {
    super(message);
    this.name = "ServiceBindingError";
  }
}

export class AuditWriteFailure extends Error {
  constructor(
    public originalOperation: string,
    public cause: Error
  ) {
    super(`Audit write failed for '${originalOperation}'. Halted. Cause: ${cause.message}`);
    this.name = "AuditWriteFailure";
  }
}

export interface DurableObjectIdPolicy {
  generate(tenantId: string, userId: string, purpose: string): string;
  parse(id: string): { tenantId: string; userId: string; purpose: string };
}

export const defaultDoIdPolicy: DurableObjectIdPolicy = {
  generate(t, u, p) {
    const raw = `${t}:${u}:${p}`;
    return raw.length <= 128 ? raw : hashString(raw);
  },
  parse(id) {
    const parts = id.split(":");
    return parts.length < 3
      ? { tenantId: "HASHED", userId: "HASHED", purpose: "HASHED" }
      : { tenantId: parts[0], userId: parts[1], purpose: parts.slice(2).join(":") };
  },
};

function hashString(input: string): string {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = ((h << 5) - h + input.charCodeAt(i)) | 0;
  return `hash_${Math.abs(h).toString(36)}`;
}
```

### 14.2 Rate Limit Configuration

```typescript
// packages/lib/src/rate-limit.ts

export interface RateLimitConfig {
  userLimit: number;
  tenantLimit: number;
  ipLimit: number;
  burstSize: number;
  windowSeconds: number;
  exposeHeaders: boolean;
}

export const DEFAULT_RATE_LIMITS: Record<string, RateLimitConfig> = {
  free: {
    userLimit: 30,
    tenantLimit: 300,
    ipLimit: 10,
    burstSize: 5,
    windowSeconds: 60,
    exposeHeaders: true,
  },
  pro: {
    userLimit: 100,
    tenantLimit: 1000,
    ipLimit: 20,
    burstSize: 10,
    windowSeconds: 60,
    exposeHeaders: true,
  },
  enterprise: {
    userLimit: 500,
    tenantLimit: 5000,
    ipLimit: 50,
    burstSize: 50,
    windowSeconds: 60,
    exposeHeaders: true,
  },
  customer_zero: {
    userLimit: 1000,
    tenantLimit: 10000,
    ipLimit: 100,
    burstSize: 100,
    windowSeconds: 60,
    exposeHeaders: true,
  },
};
```

### 14.3 Privacy Types

```typescript
// packages/spine-schema/src/schema/audit.ts

export interface ErasureTicket {
  id: string;
  tenantId: string;
  userId: string | null;
  status: "queued" | "in_progress" | "completed" | "failed";
  requestedAt: number;
  deadlineAt: number;
  completedAt?: number;
}

export interface PortabilityExport {
  tenantId: string;
  exportedAt: number;
  format: "json";
  entities: unknown[];
  relationships: unknown[];
  memory: unknown[];
  auditTrail: unknown[];
}
```

---

## 15. Operational Runbooks

### 15.1 Cross-Tenant Alert Response

1. **Acknowledge** — Page on-call via PagerDuty
2. **Contain** — Revoke JWT (`jti`) from alert
3. **Assess** — Query audit logs for same user/tenant in 24h
4. **Investigate** — Check if data returned before detection
5. **Remediate** — Fix root cause (query, binding, or Gateway)
6. **Communicate** — If leaked: customer notification 72h SLA
7. **Post-Mortem** — Document within 48h

### 15.2 Secret Rotation

1. Generate new key (RSA-4096 / AES-256)
2. Dual-write: old + new valid for 24h grace
3. Issue new JWTs with new key
4. Monitor for old token validation errors
5. After grace: revoke old key
6. Audit: `type: "SECRET_ROTATION"`

### 15.3 Incident Severity

| Severity     | Criteria                                 | Response | Example               |
| ------------ | ---------------------------------------- | -------- | --------------------- |
| **CRITICAL** | Cross-tenant access, credential exposure | 15 min   | P0-1 detection        |
| **HIGH**     | Auth bypass, privilege escalation        | 1 hour   | P0-9 bypass           |
| **MEDIUM**   | Rate limit evasion, CORS misconfig       | 4 hours  | P1-3 finding          |
| **LOW**      | Info disclosure in logs                  | 24 hours | Verbose error message |

---

## 16. Security Invariants

> 1. **Identity gates the door.** Gateway JWT is the only trusted identity artifact.
> 2. **Every hop carries `tenant_id`.** From Gateway to Provider Fabric and back.
> 3. **Cross-tenant access = 403 fail-loud.** Never 404. Never silent.
> 4. **Audit write failure halts operation.** Compliance is not optional.
> 5. **Pipeline is the only Spine writer.** All context mutations flow through one gate.
> 6. **Read-only default.** Write requires `scope: write` + governance approval.
> 7. **No shared credentials.** Per-tenant credential wall in `act` adapter.
> 8. **Secrets in Cloudflare Secrets only.** No `.env`. No hardcoded keys.
> 9. **Durable Objects are tenant-scoped.** Never `idFromName("global")`.
> 10. **Governance sits between reasoning and execution.** The 0.70/0.85 law is invariant.

---

**END OF SECURITY DOMAIN SPECIFICATION**

_IntegrateWise Continuity Bridge v2.0 — Security Model and Zero-Trust Architecture. Stage 1/2 deep-dive. P0 must close before production. P1 within 30 days of launch._

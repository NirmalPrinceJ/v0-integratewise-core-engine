# Connector Constitution

Status: CANONICAL
Scope: Provider adapter contracts, auth, sync, health, mapping, fallback, and lifecycle.
Canonical Owner: IntegrateWise Platform
Last Verified: 2026-07-20

---

## 1. Purpose

This document defines how IntegrateWise connects to external applications.

External applications are execution providers. They are not workspaces.

---

## 2. Contract

```typescript
interface ConnectorContract {
  id: ConnectorId;
  name: string;
  category: ConnectorCategory;
  auth: { type: "oauth2" | "apikey" | "mcp" | "direct"; scopes: string[]; refreshPolicy: string };
  capabilities: {
    provided: CapabilityId[];
    read: EntityType[];
    write: EntityType[];
    sync: SyncMode;
  };
  health: {
    checkInterval: number;
    timeout: number;
    retryPolicy: RetryPolicy;
    circuitBreaker: boolean;
  };
  mapping: { entities: EntityMapping[]; fields: FieldMapping[]; transforms: Transform[] };
}
```

---

## 3. Communication Hierarchy

1. In-process function call
2. Repository access — D1/KV/R2/DO
3. Service binding — same-account Worker
4. Queue — async propagation
5. External HTTP — browser/SaaS boundary only

Worker-to-Worker HTTP on the same account is an anti-pattern.

---

## 4. Sync Rules

- Sync runs after Spine commit.
- Sync failures do not invalidate successful execution.
- Sync status is surfaced explicitly in UI.
- Retry uses exponential backoff with circuit breaker.

---

## 5. Fallback Rules

- UI fails open with realistic data when connectors are unavailable.
- UI never surfaces raw provider errors as product state.
- Marketplace catalog remains loadable without Nango.

---

## 6. Invariants

1. The UI never depends on external application UIs.
2. The UI never imports provider SDKs directly.
3. Authoritative field mapping lives in the connector contract, not in views.
4. Connector health is observable, retryable, and auditable.

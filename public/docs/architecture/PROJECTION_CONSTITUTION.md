# Projection Constitution

Status: CANONICAL
Scope: Projection engine behavior, composition, layout, caching, refresh, and fallback rules.
Canonical Owner: IntegrateWise Platform
Last Verified: 2026-07-20

---

## 1. Purpose

This document defines how the Adaptive Workbench renders projections.

The UI never consumes raw API responses. The UI consumes stable projections only.

---

## 2. Contract

```typescript
interface ProjectionContract {
  input: {
    role: Role;
    department: Department;
    industry: Industry;
    connectors: ConnectorId[];
    capabilities: CapabilityId[];
    schemaVersion: string;
  };
  composition: {
    select: (schema, persona) => Field[];
    filter: (fields, permissions) => Field[];
    enrich: (fields, context) => EnrichedField[];
  };
  projection: {
    map: (fields) => UIComponent[];
    layout: (components) => LayoutGrid;
    actions: (capabilities) => ActionButton[];
  };
  render: {
    tree: (layout) => RenderTree;
    cache: (tree) => CacheKey;
    invalidate: (event) => boolean;
  };
  output: { json: RenderTree; fingerprint: string; ttl: number };
}
```

---

## 3. Composition Rules

1. Projection selects fields based on role, department, industry, and active capabilities.
2. Projection filters fields based on permissions and row-level tenant isolation.
3. Projection enriches fields with active context and memory.
4. Projection maps fields to explicit UI component declarations.
5. Projection layout is computed, not hardcoded.

---

## 4. Render Rules

1. Render tree is computed from layout at runtime.
2. Render output is cached by fingerprint.
3. Cache invalidation is triggered by domain events.
4. Cached projections fail open with realistic data.

---

## 5. Fallback Rules

1. When Spine data is empty, UI shows seeded operational data.
2. When Spine data fails, UI shows operational data without raw errors.
3. When connectors are unavailable, UI shows last known good projection with explicit source state.

---

## 6. Invariants

1. The UI never binds directly to provider APIs.
2. The UI never renders raw provider field names.
3. Projection fingerprint incorporates schema version.
4. Projections are immutable per cache key.

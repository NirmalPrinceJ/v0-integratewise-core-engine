-- spine_accounts
-- Layer: Canonical Spine (Immutable Business Truth)
-- Purpose: Stores canonical Account entities — paying customer relationships.
--          Each row is an immutable version of an Account. Updates append new versions.
-- Source: SPINE_DOMAIN.md §3.4, SPINE_INTELLIGENCE_AGENT.md §10.2
-- Target: D1 (SQLite-compatible)
-- Note: No `data JSONB`, no `scope JSONB`, no `relationships JSONB`.
--       Relationships are stored in spine_relationships (typed edge table).

CREATE TABLE IF NOT EXISTS spine_accounts (
    id              TEXT PRIMARY KEY,
    tenant_id       TEXT NOT NULL,
    canonical_id    TEXT NOT NULL,
    version         INTEGER NOT NULL DEFAULT 1,

    -- Immutable business truth
    name            TEXT NOT NULL,
    industry        TEXT,
    region          TEXT,
    tier            TEXT,
    arr_usd         REAL,
    contract_start  TEXT,
    contract_end    TEXT,

    -- System
    provenance      JSON NOT NULL DEFAULT '{}',
    created_at      INTEGER,
    updated_at      INTEGER
);

CREATE INDEX IF NOT EXISTS idx_spine_accounts_tenant_canonical
    ON spine_accounts(tenant_id, canonical_id);

CREATE INDEX IF NOT EXISTS idx_spine_accounts_tenant_version
    ON spine_accounts(tenant_id, canonical_id, version);

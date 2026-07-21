-- spine_assets
-- Layer: Canonical Spine (Immutable Business Truth)
-- Purpose: Stores canonical Asset entities -- durable resources owned or managed by
--          the organization. Assets are tangible or intangible resources that
--          have value, can be identified, and are tracked across their lifecycle.
--          Examples include documents, code repositories, design files, data sources,
--          contracts, subscriptions, products, deployments, and environments.
--          Each row is an immutable version of an Asset. Updates append new versions.
--          All concrete business types that inherit from Asset (CRMAccount, Contract,
--          Subscription, Product, Deployment, Environment, Invoice, etc.) are stored
--          here or in domain-specific projections of this root table.
-- Source: SPINE_DOMAIN.md §1.1, §3.3, §3.4
-- Target: Cloudflare D1 (SQLite-compatible)
-- Note: No `data JSONB`, no `scope JSONB`, no `relationships JSONB`.
--       Relationships are stored in spine_relationships (typed edge table).
--       Provenance required: { source, record_id, actor }

CREATE TABLE IF NOT EXISTS spine_assets (
    id              TEXT PRIMARY KEY,
    tenant_id       TEXT NOT NULL,
    canonical_id    TEXT NOT NULL,
    version         INTEGER NOT NULL DEFAULT 1,

    -- Immutable business truth
    name            TEXT NOT NULL,
    asset_type      TEXT NOT NULL,              -- 'document', 'code_repo', 'design_file', 'data_source', 'contract', 'subscription', 'product', 'deployment', 'environment', 'invoice', 'hardware', 'license', 'digital_asset', 'template', 'configuration'
    status          TEXT NOT NULL DEFAULT 'active', -- 'active', 'archived', 'deprecated', 'draft', 'pending', 'retired'
    description     TEXT,
    identifier      TEXT,                       -- SKU, serial number, document ID, ISBN, etc.
    asset_format    TEXT,                       -- MIME type, file extension, or format descriptor
    location        TEXT,                       -- URL, file path, or physical location
    size_bytes      INTEGER,                    -- Size for digital assets
    owner_actor     TEXT,                       -- Canonical ID of the owning entity or user
    namespace       TEXT,                       -- Scope or domain this asset belongs to
    version_label   TEXT,                       -- Human-readable version (e.g., 'v2.1.0')
    effective_from  INTEGER,                    -- Unix timestamp when asset becomes valid
    effective_until INTEGER,                    -- Unix timestamp when asset expires; NULL = current
    source_url      TEXT,                       -- Link to the actual resource
    checksum        TEXT,                       -- Integrity hash (SHA-256, MD5, etc.)
    language        TEXT,                       -- ISO 639-1 language code for content assets
    is_public       INTEGER NOT NULL DEFAULT 0, -- 0 = private/internal, 1 = public

    -- System
    provenance      JSON NOT NULL DEFAULT '{}',  -- { source: '...', record_id: '...', actor: '...' }
    created_at      INTEGER,                    -- Unix timestamp
    updated_at      INTEGER,                    -- Unix timestamp

    UNIQUE(tenant_id, canonical_id, version)
);

CREATE INDEX IF NOT EXISTS idx_spine_assets_tenant_canonical
    ON spine_assets(tenant_id, canonical_id);

CREATE INDEX IF NOT EXISTS idx_spine_assets_tenant_version
    ON spine_assets(tenant_id, canonical_id, version);

CREATE INDEX IF NOT EXISTS idx_spine_assets_tenant_type
    ON spine_assets(tenant_id, asset_type);

CREATE INDEX IF NOT EXISTS idx_spine_assets_tenant_status
    ON spine_assets(tenant_id, status);

CREATE INDEX IF NOT EXISTS idx_spine_assets_tenant_owner
    ON spine_assets(tenant_id, owner_actor);

-- =============================================================================
-- Entity:        spine_persons
-- Layer:         Canonical Spine (Immutable Business Truth)
-- Domain:        Platform
-- Purpose:       Represents a first-class human being across all business domains.
--                A Person is a real-world human who interacts with the organization,
--                regardless of their relationship type (employee, customer, prospect,
--                stakeholder, partner). All concrete types (User, Contact, Lead,
--                Employee, CSM, AE) inherit from this root concept.
--                One canonical record per real-world human — resolved across all
--                identity providers, CRMs, and manual entry sources.
-- Inherits:      Person (16 root concepts)
-- Source:        docs/architecture/SPINE_DOMAIN.md §1.1, §3.3
-- Target:        Cloudflare D1 (SQLite-compatible)
-- =============================================================================
-- PROVENANCE SCHEMA (required per row):
--   { source: string, record_id: string, actor: string }
--   source      — the connector or system that provided this record
--   record_id   — the native ID in the source system
--   actor       — the user or agent that created/updated this version
-- =============================================================================
-- NOTE: No data JSONB, no scope JSONB, no relationships JSONB.
--       All business truth is stored in typed columns.
--       Relationships are stored in spine_relationships (typed edge table).
-- =============================================================================

CREATE TABLE IF NOT EXISTS spine_persons (
    id              TEXT PRIMARY KEY,              -- UUID assigned by the pipeline
    tenant_id       TEXT NOT NULL,                  -- tenant isolation boundary
    canonical_id    TEXT NOT NULL,                  -- stable identity; survives merges and deduplication
    version         INTEGER NOT NULL DEFAULT 1,     -- append-only versioning

    -- Immutable business truth (typed columns only; no JSONB)
    name            TEXT NOT NULL,                  -- full display name
    email           TEXT,                           -- primary email address
    phone           TEXT,                           -- primary phone number
    title           TEXT,                           -- job title / role in their organization
    department      TEXT,                           -- organizational department
    seniority       TEXT,                           -- e.g., c-level, vp, director, manager, individual
    timezone        TEXT,                           -- IANA timezone identifier
    preferred_language TEXT,                        -- ISO 639-1 language code
    is_active       INTEGER NOT NULL DEFAULT 1,     -- lifecycle flag: 1 = active, 0 = inactive

    -- Presence tracking
    first_seen_at   INTEGER,                        -- Unix timestamp; first observed in any system
    last_seen_at    INTEGER,                        -- Unix timestamp; most recent observation

    -- Provenance (required JSON per row)
    provenance      JSON NOT NULL DEFAULT '{}',     -- { source, record_id, actor }

    -- System timestamps
    created_at      INTEGER,                        -- Unix timestamp
    updated_at      INTEGER,                        -- Unix timestamp

    -- Constraints
    UNIQUE(tenant_id, canonical_id, version)
);

-- Index: tenant-scoped lookup by canonical identity (most common read pattern)
CREATE INDEX IF NOT EXISTS idx_spine_persons_tenant_canonical
    ON spine_persons(tenant_id, canonical_id);

-- Index: tenant-scoped versioned lookup (append-only history traversal)
CREATE INDEX IF NOT EXISTS idx_spine_persons_tenant_version
    ON spine_persons(tenant_id, canonical_id, version);

-- Index: tenant-scoped email lookup (duplicate detection, contact resolution)
CREATE INDEX IF NOT EXISTS idx_spine_persons_email
    ON spine_persons(tenant_id, email);

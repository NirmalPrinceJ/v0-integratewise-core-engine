-- =============================================================================
-- IntegrateWise Platform — Dynamic Memory Layer
-- Table: memory_approval
-- Layer: L6 (Approval)
-- Target: Cloudflare D1 (SQLite-compatible)
-- =============================================================================
-- Description:
--   memory_approval stores AI-generated opinionated memories that have been
--   promoted through the pipeline (L1 Twin → L2 Intake → L3 Triage → L4
--   Evolution → L5 Promotion Queue) and are now awaiting or have received
--   human/AI approval before graduating to L7 (Organizational) or L8
--   (Knowledge). Each record is ephemeral, confidence-scored, and linked to a
--   canonical Spine entity and an OODA episode.
--
--   As an L6 table, TTL is persistent (long-lived by default), but still
--   required for projection-friendly expiry and lifecycle management.
-- =============================================================================

-- Enable foreign key support (D1 compatible, best-effort enforcement)
PRAGMA foreign_keys = ON;

-- ---------------------------------------------------------------------------
-- Table: memory_approval
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS memory_approval (
    id            TEXT PRIMARY KEY NOT NULL,
    -- Multi-tenant isolation
    tenant_id     TEXT NOT NULL,

    -- Spine canonical reference (every memory belongs to a canonical entity)
    canonical_id  TEXT NOT NULL,
    entity_type   TEXT NOT NULL,

    -- Optimistic concurrency / versioning
    version       INTEGER NOT NULL DEFAULT 1,

    -- Opinionated AI metadata (required for all memory)
    confidence    REAL NOT NULL CHECK (confidence >= 0.0 AND confidence <= 1.0),
    generated_by  TEXT NOT NULL,

    -- Event-sourced: link to the OODA cycle that produced this memory
    episode_id    TEXT NOT NULL,

    -- Memory classification (e.g., 'approval', 'domain:risk', 'domain:health')
    memory_type   TEXT NOT NULL DEFAULT 'approval',

    -- Lifecycle status (pending, approved, rejected, superseded, expired)
    status        TEXT NOT NULL DEFAULT 'pending',

    -- Human-readable content (opinionated, AI-generated narrative)
    content       TEXT,

    -- Provenance: model version, prompt lineage, data sources, etc.
    provenance    TEXT,

    -- Time-to-live in seconds (L6 has persistent / long-lived TTL)
    TTL           INTEGER NOT NULL DEFAULT 31536000,  -- 1 year default

    -- Absolute expiry timestamp (Unix epoch, seconds)
    expires_at    INTEGER NOT NULL,

    -- Audit timestamps
    created_at    INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at    INTEGER NOT NULL DEFAULT (unixepoch()),

    -- -----------------------------------------------------------------------
    -- Table constraints
    -- -----------------------------------------------------------------------
    -- Ensure a record can only be approved once per canonical + type + episode
    UNIQUE(tenant_id, canonical_id, entity_type, episode_id, memory_type, status),

    -- Composite foreign key feeler to Spine (enforced at application layer in D1)
    -- Spine entities are identified by (tenant_id, canonical_id, entity_type)
    FOREIGN KEY (tenant_id, canonical_id, entity_type) REFERENCES spine_entity (tenant_id, id, entity_type) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

-- Lookup by tenant + canonical entity (most common query pattern)
CREATE INDEX IF NOT EXISTS idx_memory_approval_tenant_canonical
    ON memory_approval(tenant_id, canonical_id);

-- Slice by entity type for projection-friendly views (e.g., all approvals for Contacts)
CREATE INDEX IF NOT EXISTS idx_memory_approval_tenant_entity_type
    ON memory_approval(tenant_id, entity_type);

-- Slice by memory type for pipeline stage filtering (e.g., domain-specific approvals)
CREATE INDEX IF NOT EXISTS idx_memory_approval_tenant_memory_type
    ON memory_approval(tenant_id, memory_type);

-- Slice by status for queue management (e.g., all pending approvals)
CREATE INDEX IF NOT EXISTS idx_memory_approval_tenant_status
    ON memory_approval(tenant_id, status);

-- Ranking / quality filtering by confidence for a canonical entity
CREATE INDEX IF NOT EXISTS idx_memory_approval_canonical_confidence
    ON memory_approval(canonical_id, confidence DESC);

-- Temporal projection: expiry sweep for garbage collection / re-evaluation
CREATE INDEX IF NOT EXISTS idx_memory_approval_tenant_expires_at
    ON memory_approval(tenant_id, expires_at);

-- ---------------------------------------------------------------------------
-- Table comment (SQLite-compatible via separate annotation comment)
-- ---------------------------------------------------------------------------
-- LAYER: L6 (Approval)
-- PURPOSE:
--   memory_approval holds AI-generated memories that have been promoted
--   through the lower pipeline layers and are now in the approval stage.
--   These memories are opinionated, confidence-scored, and ephemeral,
--   even though L6 enjoys persistent TTL defaults. They serve as the
--   gating layer between raw AI signal and organizational memory,
--   requiring explicit approval before graduation to L7/L8.
--
--   This table is designed to be sliced by tenant, team, role, and time
--   horizon, and supports graph-native edges that can reference other
--   memory records or Spine entities.
-- ---------------------------------------------------------------------------

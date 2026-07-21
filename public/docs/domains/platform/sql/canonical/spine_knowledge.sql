-- =============================================================================
-- SPINE KNOWLEDGE
-- =============================================================================
--
-- Platform-level canonical entity representing informational content,
-- documentation, facts, and knowledge artifacts across the IntegrateWise
-- platform. This is one of the 16 root conceptual entities in the Canonical Spine.
--
-- Domain-specific knowledge types (e.g., KB Articles, FAQ entries, SOPs,
-- Documentation pages, Runbooks) inherit from this root and add their own
-- typed columns in domain-specific schemas. Dynamic attributes (cs_score,
-- churn_risk, custom fields, etc.) belong in Dynamic Memory, not here.
--
-- Relationships to other spine entities (e.g., authored_by, related_to,
-- categorized_under, supersedes) are stored in the typed spine_relationships
-- edge table. No foreign key constraints are enforced at the platform level
-- to preserve loose coupling across domains.
--
-- Target: Cloudflare D1 (SQLite-compatible)
-- =============================================================================

CREATE TABLE IF NOT EXISTS spine_knowledge (
    -- Identity & Versioning
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    tenant_id       TEXT    NOT NULL,
    canonical_id    TEXT    NOT NULL,
    version         INTEGER NOT NULL DEFAULT 1,

    -- Business Truth (typed columns only — no JSONB for business data)
    title           TEXT    NOT NULL,
    content         TEXT,
    content_type    TEXT    DEFAULT 'text',
    knowledge_type  TEXT,
    status          TEXT    NOT NULL DEFAULT 'draft',
    language_code   TEXT    DEFAULT 'en',
    author_actor_id TEXT,
    summary         TEXT,

    -- Provenance (required shape: { source, record_id, actor })
    provenance      TEXT    NOT NULL,

    -- Audit
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    UNIQUE (tenant_id, canonical_id, version)
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

-- Primary tenant-scoped lookup: find all versions of a canonical record
CREATE INDEX IF NOT EXISTS idx_spine_knowledge_tenant_canonical
    ON spine_knowledge (tenant_id, canonical_id);

-- Version-aware tenant lookup: fetch a specific version or latest
CREATE INDEX IF NOT EXISTS idx_spine_knowledge_tenant_version
    ON spine_knowledge (tenant_id, version);

-- Tenant + status: filter by lifecycle state (e.g., published only)
CREATE INDEX IF NOT EXISTS idx_spine_knowledge_tenant_status
    ON spine_knowledge (tenant_id, status);

-- Tenant + knowledge type: filter by classification
CREATE INDEX IF NOT EXISTS idx_spine_knowledge_tenant_type
    ON spine_knowledge (tenant_id, knowledge_type);

-- Canonical ID across tenants (global uniqueness check, cross-tenant analytics)
CREATE INDEX IF NOT EXISTS idx_spine_knowledge_canonical_id
    ON spine_knowledge (canonical_id);

-- ---------------------------------------------------------------------------
-- Trigger: auto-update updated_at on modification
-- ---------------------------------------------------------------------------
CREATE TRIGGER IF NOT EXISTS trg_spine_knowledge_updated_at
AFTER UPDATE ON spine_knowledge
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE spine_knowledge
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.id;
END;

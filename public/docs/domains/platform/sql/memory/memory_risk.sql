-- =============================================================================
-- memory_risk
-- =============================================================================
-- Table:         memory_risk
-- Description:   Domain-specific Dynamic Memory record for risk assessment.
--                 Risk memories are ephemeral, opinionated, AI-generated projections
--                 derived from platform signals (spine_signals), evidence
--                 (spine_evidence), and other Spine entities. They capture
--                 transient risk assessments including risk levels, categories,
--                 scores, and affected scopes.
--
--                 Memory Layer: Domain-specific (derived from L1-L8 pipeline signals)
--                 Risk memories typically originate from L3 (triage) or L4 (evolution)
--                 stages where signal patterns are analyzed and risk is inferred.
--                 They may be promoted through L5 (promotion queue) toward L6-L8
--                 (persistent knowledge) if validated and approved.
--
--                 Every record references a canonical Spine entity via
--                 canonical_id + entity_type, carries confidence metadata, and
--                 links to the generating OODA episode_id.
--
--                 Risk memories are ephemeral: all records have a TTL and expire
--                 automatically unless promoted to persistent layers (L6-L8).
--
-- Architecture:   Dynamic Memory (ephemeral, opinionated, AI-generated, NOT SSOT)
-- Target:         Cloudflare D1 (SQLite-compatible)
-- Rules:          • Typed columns only — no JSONB for core business data
--                 • Content is TEXT (human-readable); structured data is typed
--                 • Memory MUST reference a Spine entity via canonical_id + entity_type
--                 • Confidence and generated_by are required
--                 • TTL and expiry are required for all ephemeral memory
-- =============================================================================

CREATE TABLE IF NOT EXISTS memory_risk (
    -- Core identity (AI-generated, graph-addressable)
    id              TEXT PRIMARY KEY,                     -- UUID v4 assigned by the generating AI pipeline
    tenant_id       TEXT NOT NULL,                        -- Tenant isolation; every query MUST include WHERE tenant_id = ?

    -- Spine reference (memory is a projection of a canonical Spine entity)
    canonical_id    TEXT NOT NULL,                        -- Stable identifier of the Spine entity this memory describes
    entity_type     TEXT NOT NULL,                        -- Spine entity type: e.g., 'spine_persons', 'spine_processes', 'spine_signals', 'spine_decisions'

    -- Versioning
    version         INTEGER NOT NULL DEFAULT 1,           -- Optimistic locking version; increments on every update

    -- Memory metadata (opinionated, AI-generated)
    confidence      REAL NOT NULL,                        -- 0.0 to 1.0; AI confidence in this risk assessment
    generated_by    TEXT NOT NULL,                        -- Agent or service that generated this memory (e.g., 'risk-agent-v2', 'triage-pipeline', 'twin-observer')
    episode_id      TEXT NOT NULL,                        -- OODA cycle episode that produced this memory

    -- Memory classification
    memory_type     TEXT NOT NULL,                        -- Risk memory subtype: 'assessment', 'trend', 'anomaly', 'projection', 'alert', 'correlation'
    status          TEXT NOT NULL DEFAULT 'active',       -- Lifecycle: 'active', 'expired', 'superseded', 'pending_review', 'promoted'

    -- Risk-specific typed columns (structured data, not JSONB)
    risk_level      TEXT,                                 -- 'critical', 'high', 'medium', 'low', 'info'
    risk_category   TEXT,                                 -- 'financial', 'operational', 'security', 'compliance', 'strategic', 'technical', 'reputational', 'health'
    risk_score      REAL,                                 -- Normalized risk score (0.0-1.0), derived from signal analysis
    affected_entity_type TEXT,                            -- Entity type directly affected by this risk (e.g., 'spine_persons', 'spine_processes')
    affected_entity_id   TEXT,                            -- Canonical ID of the entity directly affected by this risk
    mitigation_status    TEXT,                            -- 'none', 'planned', 'in_progress', 'mitigated', 'accepted', 'transferred'

    -- Content
    content         TEXT,                                 -- Human-readable risk assessment narrative

    -- Provenance: JSON object { source, record_id, actor }
    -- Tracks the origin of this memory for audit, lineage, and sync reconciliation.
    --   source:    string — name of originating system (e.g., 'web', 'api', 'pipeline', 'twin', 'migration')
    --   record_id: string — identifier in the source system (for re-sync and deduplication)
    --   actor:     string — ID of the user or service that created/updated this record
    provenance      TEXT NOT NULL,

    -- TTL / Expiry (required for all ephemeral memory; L6-L8 use persistent TTL values)
    ttl             INTEGER NOT NULL,                     -- Time-to-live in seconds (e.g., 3600 for 1 hour, 86400 for 24 hours, 2592000 for 30 days)
    expires_at      TEXT NOT NULL,                        -- ISO 8601 timestamp when this memory becomes invalid and should be purged or archived

    -- Audit timestamps (ISO 8601 in UTC)
    created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),

    -- Constraints
    CHECK(confidence >= 0.0 AND confidence <= 1.0),
    CHECK(risk_score IS NULL OR (risk_score >= 0.0 AND risk_score <= 1.0)),
    CHECK(version >= 1),
    CHECK(ttl >= 0),
    CHECK(status IN ('active', 'expired', 'superseded', 'pending_review', 'promoted')),
    CHECK(risk_level IS NULL OR risk_level IN ('critical', 'high', 'medium', 'low', 'info')),
    CHECK(risk_category IS NULL OR risk_category IN ('financial', 'operational', 'security', 'compliance', 'strategic', 'technical', 'reputational', 'health')),
    CHECK(mitigation_status IS NULL OR mitigation_status IN ('none', 'planned', 'in_progress', 'mitigated', 'accepted', 'transferred'))
);

-- =============================================================================
-- Indexes
-- =============================================================================

-- 1. Tenant + canonical_id: primary lookup for all risk memories about a given Spine entity
CREATE INDEX IF NOT EXISTS idx_memory_risk_tenant_canonical
    ON memory_risk(tenant_id, canonical_id);

-- 2. Tenant + entity_type: filter risk memories by the type of Spine entity they describe
CREATE INDEX IF NOT EXISTS idx_memory_risk_tenant_entity_type
    ON memory_risk(tenant_id, entity_type);

-- 3. Tenant + memory_type: filter by risk memory subtype (assessment, trend, anomaly, etc.)
CREATE INDEX IF NOT EXISTS idx_memory_risk_tenant_memory_type
    ON memory_risk(tenant_id, memory_type);

-- 4. Tenant + status: filter by lifecycle state (active, expired, superseded, etc.)
CREATE INDEX IF NOT EXISTS idx_memory_risk_tenant_status
    ON memory_risk(tenant_id, status);

-- 5. Canonical_id + confidence: order or filter risk memories by confidence for a given entity
CREATE INDEX IF NOT EXISTS idx_memory_risk_canonical_confidence
    ON memory_risk(canonical_id, confidence);

-- 6. Tenant + expires_at: find expiring or expired memories for cleanup, projection refresh, or TTL extension
CREATE INDEX IF NOT EXISTS idx_memory_risk_tenant_expires
    ON memory_risk(tenant_id, expires_at);

-- 7. Tenant + episode_id: trace all risk memories generated by a specific OODA episode
CREATE INDEX IF NOT EXISTS idx_memory_risk_tenant_episode
    ON memory_risk(tenant_id, episode_id);

-- 8. Tenant + generated_by: audit or filter memories by the generating agent/service
CREATE INDEX IF NOT EXISTS idx_memory_risk_tenant_generated_by
    ON memory_risk(tenant_id, generated_by);

-- 9. Tenant + risk_level + risk_category: common operational query for risk dashboards
CREATE INDEX IF NOT EXISTS idx_memory_risk_tenant_risk_level_category
    ON memory_risk(tenant_id, risk_level, risk_category);

-- 10. Affected entity lookup: find all risk memories that affect a specific entity
CREATE INDEX IF NOT EXISTS idx_memory_risk_affected_entity
    ON memory_risk(tenant_id, affected_entity_type, affected_entity_id);

-- =============================================================================
-- Trigger: auto-update updated_at on modification
-- =============================================================================
CREATE TRIGGER IF NOT EXISTS trg_memory_risk_updated_at
AFTER UPDATE ON memory_risk
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE memory_risk
    SET updated_at = (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    WHERE id = NEW.id;
END;

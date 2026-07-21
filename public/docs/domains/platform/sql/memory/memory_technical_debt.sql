-- ============================================================================
-- Table: memory_technical_debt
-- Layer: Domain-Specific (derived from platform signals)
-- Description:
--   Ephemeral, AI-generated opinion about technical debt attached to canonical
--   Spine entities. Technical debt memories are derived from platform signals
--   including static code analysis, architectural drift detection, infrastructure
--   monitoring, runtime performance alerts, and AI-driven code reviews. Each
--   record represents an identified debt instance, its severity, estimated impact,
--   and recommended remediation path. Confidence (0.0-1.0) indicates AI certainty
--   in the debt assessment. TTL/expiry ensures ephemeral memory is cleaned up
--   unless promoted to persistent knowledge (L6-L8). References canonical Spine
--   entities via (canonical_id, entity_type) and links to OODA cycles via
--   episode_id for full event-sourced traceability.
--
--   Target: Cloudflare D1 (SQLite-compatible)
-- ============================================================================

PRAGMA foreign_keys = ON;

-- ----------------------------------------------------------------------------
-- Core Memory Table: Technical Debt
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS memory_technical_debt (
    -- Identity & Spine Linkage
    id              TEXT PRIMARY KEY,                         -- UUID v4 memory record ID
    tenant_id       TEXT NOT NULL,                            -- Multi-tenant isolation key
    canonical_id    TEXT NOT NULL,                            -- FK to Spine canonical entity
    entity_type     TEXT NOT NULL,                            -- Spine entity type (service, team, project, component, etc.)
    version         INTEGER NOT NULL DEFAULT 1,               -- Optimistic concurrency version

    -- Memory Metadata (opinionated, required)
    confidence      REAL NOT NULL
                        CHECK (confidence >= 0.0 AND confidence <= 1.0),
    generated_by    TEXT NOT NULL,                            -- AI agent / system that generated this memory
    episode_id      TEXT NOT NULL,                            -- FK to OODA cycle episode (event sourcing)
    memory_type     TEXT NOT NULL DEFAULT 'technical_debt',   -- Memory classification
    status          TEXT NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active', 'expired', 'archived', 'promoted', 'superseded')),

    -- Content & Provenance
    content         TEXT,                                     -- Human-readable debt summary / description
    provenance      TEXT,                                     -- Derivation source (e.g., "sonarqube:issue_12345", "ai_review:pr_789", "runtime_alert:cpu_spike")

    -- Domain-Specific: Technical Debt Structured Fields
    -- No JSONB for core business data. Structured data uses typed columns.
    debt_category   TEXT
                        CHECK (debt_category IN ('code_quality', 'architectural', 'infrastructure',
                                                   'security', 'performance', 'documentation',
                                                   'test_coverage', 'dependency', 'data_model')),
    severity        TEXT
                        CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    impact_score    REAL
                        CHECK (impact_score >= 0.0 AND impact_score <= 1.0),
    effort_estimate TEXT,                                     -- e.g., "4 hours", "2 sprints", "1 week"
    location        TEXT,                                     -- File path, module, component, service, or repository path
    detection_source TEXT,                                    -- Tool/system that detected the debt (e.g., "sonarqube", "eslint", "custom_linter", "ai_review", "runtime_profiler")
    resolution_status TEXT NOT NULL DEFAULT 'unresolved'
                        CHECK (resolution_status IN ('unresolved', 'in_progress', 'resolved',
                                                       'accepted', 'mitigated', 'false_positive')),
    resolved_at     INTEGER,                                  -- Unix timestamp when resolved (NULL if unresolved)
    resolution_method TEXT,                                   -- How resolved (e.g., "refactored", "deprecated", "documented", "wont_fix")

    -- Ephemeral Lifecycle (required for all memory types)
    TTL             INTEGER NOT NULL
                        CHECK (TTL >= 0),
    expires_at      INTEGER NOT NULL
                        CHECK (expires_at >= created_at),
    created_at      INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    updated_at      INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),

    -- Constraints
    UNIQUE(tenant_id, canonical_id, version),
    CHECK (resolved_at IS NULL OR resolved_at >= created_at)
);

-- ----------------------------------------------------------------------------
-- Indexes (targeted for platform query patterns)
-- ----------------------------------------------------------------------------

-- Lookup memories by Spine entity
CREATE INDEX IF NOT EXISTS idx_memory_tech_debt_tenant_canonical
    ON memory_technical_debt(tenant_id, canonical_id);

-- Filter by entity type (e.g., all debt for services)
CREATE INDEX IF NOT EXISTS idx_memory_tech_debt_tenant_entity_type
    ON memory_technical_debt(tenant_id, entity_type);

-- Filter by memory type (supports sub-typing if needed)
CREATE INDEX IF NOT EXISTS idx_memory_tech_debt_tenant_memory_type
    ON memory_technical_debt(tenant_id, memory_type);

-- Filter by status (active, expired, archived, promoted, superseded)
CREATE INDEX IF NOT EXISTS idx_memory_tech_debt_tenant_status
    ON memory_technical_debt(tenant_id, status);

-- Confidence-ordered lookup by entity (for priority ranking)
CREATE INDEX IF NOT EXISTS idx_memory_tech_debt_canonical_confidence
    ON memory_technical_debt(canonical_id, confidence);

-- TTL cleanup / expiry sweep (projections by tenant + time horizon)
CREATE INDEX IF NOT EXISTS idx_memory_tech_debt_tenant_expires_at
    ON memory_technical_debt(tenant_id, expires_at);

-- Additional domain-specific indexes
-- Severity-ordered debt view per tenant (e.g., critical debt first)
CREATE INDEX IF NOT EXISTS idx_memory_tech_debt_tenant_severity
    ON memory_technical_debt(tenant_id, severity);

-- Resolution status tracking per tenant
CREATE INDEX IF NOT EXISTS idx_memory_tech_debt_tenant_resolution
    ON memory_technical_debt(tenant_id, resolution_status);

-- Episode linkage (event sourcing / OODA cycle traceability)
CREATE INDEX IF NOT EXISTS idx_memory_tech_debt_episode_id
    ON memory_technical_debt(episode_id);

-- Detection source analytics (which tools are generating most debt signals)
CREATE INDEX IF NOT EXISTS idx_memory_tech_debt_tenant_detection_source
    ON memory_technical_debt(tenant_id, detection_source);

-- Debt category filtering per tenant (e.g., all security debt)
CREATE INDEX IF NOT EXISTS idx_memory_tech_debt_tenant_category
    ON memory_technical_debt(tenant_id, debt_category);

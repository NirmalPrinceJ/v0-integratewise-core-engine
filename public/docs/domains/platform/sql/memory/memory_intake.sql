-- =============================================================================
-- IntegrateWise Platform — Dynamic Memory Layer
-- Table: memory_intake
-- Layer: L2 (Intake)
-- Target: Cloudflare D1 (SQLite-compatible)
-- =============================================================================
--
-- TABLE-LEVEL COMMENT
-- -------------------
-- memory_intake represents the first processed layer of ephemeral, AI-generated
-- memory observations ingested from the Twin (L1). These are opinionated,
-- confidence-scored records that reference canonical Spine entities via
-- canonical_id + entity_type. They are time-bound (TTL required) and event-sourced
-- via episode_id linking to the OODA cycle. This layer sits between raw twin
-- observation (L1) and triage classification (L3).
--
-- Intake memories capture initial structured observations before they undergo
-- triage (L3). They are the first point where raw twin signals are processed,
-- formatted, and associated with canonical entities. Each record carries a
-- confidence score reflecting the model's certainty and a provenance trail
-- tracking how the memory was derived.
--
-- 8-Layer Pipeline:
--   L1 (Twin) → L2 (Intake) → L3 (Triage) → L4 (Evolution) → L5 (Promotion Queue)
--   → L6 (Approval) → L7 (Organizational) → L8 (Knowledge)
--
-- Domain-specific memories (health, risk, sentiment, etc.) are derived from
-- platform signals and also follow the same pattern, using the memory_type
-- column to indicate their subtype.
--
-- Design principles:
-- • Every record references a canonical Spine entity via canonical_id + entity_type.
-- • Every record is opinionated: confidence and generated_by are required.
-- • Every record is ephemeral: TTL and expires_at are required for L2.
-- • Every record is event-sourced: episode_id links to the OODA cycle.
-- • Memory is projection-friendly: indexed for tenant-scoped queries.
-- • Memory is graph-native: designed to participate in memory graph edges.
-- • No JSONB for core business data; structured fields are typed columns.
-- =============================================================================

CREATE TABLE IF NOT EXISTS memory_intake (
    id            TEXT PRIMARY KEY NOT NULL,
                     -- Unique memory record identifier (UUID v7)

    tenant_id     TEXT NOT NULL,
                     -- Multi-tenant isolation boundary

    canonical_id  TEXT NOT NULL,
                     -- Foreign logical key to the canonical Spine entity.
                     -- All memory MUST reference a Spine entity.

    entity_type   TEXT NOT NULL,
                     -- Type of the referenced Spine entity (e.g., 'user', 'team', 'project', 'asset').
                     -- Combined with canonical_id to fully identify the Spine entity.

    version       INTEGER NOT NULL DEFAULT 1,
                     -- Optimistic locking version for concurrency control.
                     -- Incremented on every update.

    confidence    REAL NOT NULL,
                     -- Model confidence score (0.0 = no confidence, 1.0 = absolute certainty).
                     -- Opinionated: required for all memory records.

    generated_by  TEXT NOT NULL,
                     -- Identifier of the model or agent that generated this memory.
                     -- e.g., 'gpt-4o', 'twin-v2', 'intake-processor-v1'.
                     -- Opinionated: required for all memory records.

    episode_id    TEXT NOT NULL,
                     -- OODA cycle execution ID that produced this memory.
                     -- Event-sourced: links memory to the decision loop that created it.

    memory_type   TEXT NOT NULL DEFAULT 'L2',
                     -- Memory pipeline layer identifier.
                     -- For this table, value is 'L2' (intake memory).
                     -- Domain-specific subtypes may use values like 'health_intake',
                     -- 'risk_intake', 'sentiment_intake'.

    status        TEXT NOT NULL DEFAULT 'active',
                     -- Lifecycle state: 'active', 'expired', 'replaced', 'superseded', 'promoted'.
                     -- Drives TTL cleanup and pipeline progression decisions.

    content       TEXT NOT NULL,
                     -- Human-readable or structured textual content of the memory.
                     -- This is the primary payload of the intake record.

    provenance    TEXT,
                     -- Source context: how this memory was derived.
                     -- e.g., 'twin_observation', 'signal_aggregation', 'llm_generation',
                     -- 'intake_processor_v1', 'prompt_template_v2'.

    TTL           INTEGER NOT NULL,
                     -- Time-to-live in seconds. Must be > 0 for L2 intake memories.
                     -- Controls automatic expiry and cleanup scheduling.

    expires_at    INTEGER NOT NULL,
                     -- Absolute expiry timestamp (Unix epoch). Must be after created_at.
                     -- Used for deterministic TTL enforcement and index-driven eviction.

    created_at    INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
                     -- Record creation timestamp (Unix epoch).

    updated_at    INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
                     -- Last modification timestamp (Unix epoch).

    -- ------------------------------------------------------------------------
    -- Table-level constraints
    -- ------------------------------------------------------------------------
    CONSTRAINT chk_confidence_range
        CHECK (confidence >= 0.0 AND confidence <= 1.0),

    CONSTRAINT chk_ttl_positive
        CHECK (TTL > 0),

    CONSTRAINT chk_version_positive
        CHECK (version >= 1)
);

-- =============================================================================
-- Indexes for query patterns and projection slicing
-- =============================================================================

-- Multi-tenant entity lookup: find all intake memories for a specific Spine entity
CREATE INDEX IF NOT EXISTS idx_memory_intake_tenant_canonical
    ON memory_intake (tenant_id, canonical_id);

-- Entity-type projection: slice memories by the type of Spine entity they describe
CREATE INDEX IF NOT EXISTS idx_memory_intake_tenant_entity_type
    ON memory_intake (tenant_id, entity_type);

-- Memory-layer projection: filter by pipeline layer or domain-specific subtype
CREATE INDEX IF NOT EXISTS idx_memory_intake_tenant_memory_type
    ON memory_intake (tenant_id, memory_type);

-- Status-driven queries: filter by lifecycle state (active, expired, promoted, etc.)
CREATE INDEX IF NOT EXISTS idx_memory_intake_tenant_status
    ON memory_intake (tenant_id, status);

-- Confidence-ranked retrieval per entity: order observations by model certainty
CREATE INDEX IF NOT EXISTS idx_memory_intake_canonical_confidence
    ON memory_intake (canonical_id, confidence DESC);

-- TTL eviction and time-window queries: find memories expiring within a horizon
CREATE INDEX IF NOT EXISTS idx_memory_intake_tenant_expires
    ON memory_intake (tenant_id, expires_at);

-- =============================================================================
-- Trigger: auto-refresh updated_at on modification
-- =============================================================================

CREATE TRIGGER IF NOT EXISTS trg_memory_intake_updated_at
    AFTER UPDATE ON memory_intake
    FOR EACH ROW
BEGIN
    UPDATE memory_intake
    SET updated_at = strftime('%s', 'now')
    WHERE id = NEW.id;
END;

-- =============================================================================
-- END OF FILE
-- =============================================================================

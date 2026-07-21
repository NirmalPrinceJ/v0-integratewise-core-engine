-- =============================================================================
-- IntegrateWise Platform: Dynamic Memory Layer
-- Domain: memory_evidence
-- Database: Cloudflare D1 (SQLite-compatible)
-- =============================================================================
-- 
-- TABLE DESCRIPTION:
-- memory_evidence stores ephemeral, opinionated, AI-generated evidentiary 
-- artifacts. Each record links to a canonical Spine entity via 
-- canonical_id + entity_type. Evidence memory captures observations, signal 
-- artifacts, and data points collected during platform intake and triage 
-- (OODA Observe/Orient stages).
--
-- LAYER CLASSIFICATION:
-- This memory type primarily operates at L2 (Intake) and L3 (Triage). It 
-- represents raw or lightly-processed observational evidence with attached 
-- confidence scores. Evidence is ephemeral by design and subject to TTL-based 
-- eviction. High-confidence evidence may be promoted to L4 (Evolution) and 
-- beyond through the OODA episode pipeline.
--
-- CRITICAL BUSINESS RULES:
-- 1. Every record MUST reference a Spine entity via canonical_id + entity_type.
-- 2. Confidence is required (0.0-1.0) and reflects AI opinion strength.
-- 3. generated_by is required and identifies the generating agent/system.
-- 4. episode_id links to the OODA cycle for event-sourced traceability.
-- 5. TTL and expires_at are required for all evidence records.
-- 6. This is NOT a source of truth — it is ephemeral, opinionated memory.
-- 7. Domain-specific extensions (health_evidence, risk_evidence, sentiment) 
--    may share this schema or derive from it.
--
-- =============================================================================

CREATE TABLE IF NOT EXISTS memory_evidence (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    canonical_id TEXT NOT NULL,         -- Spine entity reference
    entity_type TEXT NOT NULL,          -- Spine entity type discriminator
    version INTEGER NOT NULL DEFAULT 1,
    confidence REAL NOT NULL,           -- 0.0 to 1.0, opinion strength
    generated_by TEXT NOT NULL,         -- Agent/system that generated this memory
    episode_id TEXT NOT NULL,           -- OODA cycle episode linkage
    memory_type TEXT NOT NULL,          -- L1-L8 or domain-specific classification
    status TEXT NOT NULL,               -- active | expired | superseded | archived | pending_review
    content TEXT NOT NULL,              -- Human-readable evidence content
    provenance TEXT,                    -- Source lineage and derivation path
    ttl_seconds INTEGER NOT NULL,       -- Time-to-live in seconds
    expires_at INTEGER NOT NULL,        -- Absolute expiration (Unix epoch)
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    
    -- Domain constraints
    CONSTRAINT chk_memory_evidence_confidence_range 
        CHECK (confidence >= 0.0 AND confidence <= 1.0),
    CONSTRAINT chk_memory_evidence_status_values 
        CHECK (status IN ('active', 'expired', 'superseded', 'archived', 'pending_review')),
    CONSTRAINT chk_memory_evidence_ttl_positive 
        CHECK (ttl_seconds > 0),
    CONSTRAINT chk_memory_evidence_spine_reference 
        CHECK (length(canonical_id) > 0 AND length(entity_type) > 0)
);

-- Indexes for Spine-anchored lookups and projection slicing
CREATE INDEX IF NOT EXISTS idx_memory_evidence_tenant_canonical 
    ON memory_evidence(tenant_id, canonical_id);

CREATE INDEX IF NOT EXISTS idx_memory_evidence_tenant_entity_type 
    ON memory_evidence(tenant_id, entity_type);

CREATE INDEX IF NOT EXISTS idx_memory_evidence_tenant_memory_type 
    ON memory_evidence(tenant_id, memory_type);

CREATE INDEX IF NOT EXISTS idx_memory_evidence_tenant_status 
    ON memory_evidence(tenant_id, status);

CREATE INDEX IF NOT EXISTS idx_memory_evidence_canonical_confidence 
    ON memory_evidence(canonical_id, confidence DESC);

CREATE INDEX IF NOT EXISTS idx_memory_evidence_tenant_expires 
    ON memory_evidence(tenant_id, expires_at);

-- Trigger to auto-update updated_at on row modification
CREATE TRIGGER IF NOT EXISTS trg_memory_evidence_updated_at
AFTER UPDATE ON memory_evidence
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE memory_evidence 
    SET updated_at = strftime('%s', 'now') 
    WHERE id = NEW.id;
END;
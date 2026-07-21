-- ============================================================================
-- Entity: Contract
-- Layer: Canonical Spine (Immutable Business Truth)
-- Purpose: Legally binding agreements between the company and its customers.
--          Each contract represents a formal commercial arrangement with
--          defined terms, value, duration, and renewal conditions.
-- Source: SPINE_DOMAIN.md §3.4, SPINE_INTELLIGENCE_AGENT.md §10.2
-- ============================================================================

CREATE TABLE IF NOT EXISTS spine_contracts (
    id              TEXT PRIMARY KEY,
    tenant_id       TEXT NOT NULL,
    canonical_id    TEXT NOT NULL,
    version         INTEGER NOT NULL DEFAULT 1,

    -- Immutable business truth
    contract_number     TEXT NOT NULL,
    title               TEXT,
    description         TEXT,
    contract_type       TEXT,                       -- 'master', 'amendment', 'addendum', 'sow', 'nda', 'order_form'
    status              TEXT,                       -- 'draft', 'pending_signature', 'active', 'expired', 'terminated', 'cancelled'
    start_date          TEXT,                       -- ISO 8601 date (YYYY-MM-DD)
    end_date            TEXT,                       -- ISO 8601 date (YYYY-MM-DD)
    renewal_date        TEXT,                       -- ISO 8601 date (YYYY-MM-DD)
    value_local         REAL,                       -- Contract value in local currency
    currency            TEXT,                       -- ISO 4217 currency code (e.g., 'USD', 'EUR')
    value_usd           REAL,                       -- Normalized value in USD
    billing_frequency   TEXT,                       -- 'monthly', 'quarterly', 'annual', 'multi-year'
    term_months         INTEGER,                    -- Duration in months
    auto_renew          INTEGER DEFAULT 0,          -- 0 = false, 1 = true
    renewal_notice_days INTEGER,                    -- Days before renewal notification required
    termination_clause  TEXT,                       -- Description of termination terms
    payment_terms_days  INTEGER,                    -- Net payment terms in days
    document_reference  TEXT,                       -- URL or reference to signed document
    signed_date         TEXT,                       -- ISO 8601 date
    executed_date       TEXT,                       -- ISO 8601 date when contract became effective
    governing_law       TEXT,                       -- Jurisdiction / governing law
    contract_language   TEXT DEFAULT 'en',         -- ISO 639-1 language code

    -- System
    provenance      JSON NOT NULL DEFAULT '{}',
    created_at      INTEGER,
    updated_at      INTEGER
);

-- Indexes: tenant + canonical_id for entity resolution
CREATE INDEX IF NOT EXISTS idx_spine_contracts_tenant_canonical
    ON spine_contracts(tenant_id, canonical_id);

-- Indexes: tenant + canonical_id + version for time-travel queries
CREATE INDEX IF NOT EXISTS idx_spine_contracts_tenant_version
    ON spine_contracts(tenant_id, canonical_id, version);

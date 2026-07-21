-- ============================================================================
-- Entity:        Organization
-- Layer:         Canonical Spine (Immutable Business Truth)
-- Purpose:       Represents a legal entity (parent of accounts) in the
--                 Account Success domain. Organizations are real-world
--                 companies that exist independently of the platform.
-- Sources:       Salesforce, HubSpot, D&B, manual entry, identity providers
-- Domain:        account-success
-- Authority:      SPINE_DOMAIN.md §3.4 + SPINE_INTELLIGENCE_AGENT.md §10.2
-- Target:        D1 (SQLite-compatible)
-- ============================================================================

CREATE TABLE IF NOT EXISTS spine_organizations (
    -- Primary identity (assigned by the Pipeline, never generated)
    id              TEXT PRIMARY KEY,

    -- Tenant scoping (cross-tenant queries impossible by construction)
    tenant_id       TEXT NOT NULL,

    -- Stable canonical identity (survives merges, deduplication, re-syncs)
    canonical_id    TEXT NOT NULL,

    -- Append-only versioning (every change is a new row, not an UPDATE)
    version         INTEGER NOT NULL DEFAULT 1,

    -- Immutable business truth — typed columns only
    name            TEXT NOT NULL,
    legal_name      TEXT,                       -- official registered legal name
    industry        TEXT,
    region          TEXT,
    country         TEXT,
    employee_count  INTEGER,                    -- number of employees
    website         TEXT,                       -- primary corporate website
    domain          TEXT,                       -- primary email domain
    duns_number     TEXT,                       -- Dun & Bradstreet identifier
    tax_id          TEXT,                       -- tax / EIN identifier
    headquarters    TEXT,                       -- city or full HQ address
    status          TEXT,                       -- active, inactive, merged, etc.
    founded_year    INTEGER,                    -- year the company was founded
    tier            TEXT,                       -- strategic, enterprise, mid-market, etc.

    -- Provenance tracking — { source: "salesforce", record_id: "..." }
    provenance      JSON NOT NULL DEFAULT '{}',

    -- System timestamps (Unix epoch seconds, INTEGER)
    created_at      INTEGER,
    updated_at      INTEGER
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

-- Lookup by tenant + canonical_id (entity resolution, deduplication)
CREATE INDEX IF NOT EXISTS idx_spine_organizations_tenant_canonical
    ON spine_organizations(tenant_id, canonical_id);

-- Lookup by tenant + canonical_id + version (time-travel, audit, append-only)
CREATE INDEX IF NOT EXISTS idx_spine_organizations_tenant_version
    ON spine_organizations(tenant_id, canonical_id, version);

-- Optional: fast lookup by name for search / typeahead
CREATE INDEX IF NOT EXISTS idx_spine_organizations_name
    ON spine_organizations(tenant_id, name);

-- Optional: lookup by domain for identity-provider matching
CREATE INDEX IF NOT EXISTS idx_spine_organizations_domain
    ON spine_organizations(tenant_id, domain);

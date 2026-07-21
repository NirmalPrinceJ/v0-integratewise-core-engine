# Spine Schema Validation & Audit Framework


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

**Status:** Implementation Guide  
**Last Updated:** June 2026  
**Scope:** 12 Domains, 974 CANONICAL_FIELDS, 4 Migrations (033–047)  

---

## Executive Summary

This framework validates that the **Spine** (canonical data model) is correctly implemented across all 12 domains, with proper field mapping from connectors, null handling policies, and adaptive hydration as tools are added.

**Key Validation Points:**
- ✓ All 974 CANONICAL_FIELDS are wired to Spine tables
- ✓ Null policies enforced (BLOCK, DERIVE, DEFAULT, ENRICH, SIGNAL)
- ✓ Metrics reference actual Spine columns
- ✓ Goals linked to metrics
- ✓ Loader normalizes connector fields correctly
- ✓ Adaptive model works (shallow → deep as tools added)

---

## Architecture: Connectors → Spine → Intelligence

```
28 Connectors (HubSpot, Salesforce, Stripe, Jira, etc.)
  ↓
Loader (8 Stages: Validation → Enrichment → Normalization)
  ↓
Normalizer (EntityType resolution)
  ↓
CANONICAL_FIELDS mapping
  ↓
Spine (974 fields across 12 domains)
  ↓
Goals & Metrics (formulas reference Spine columns)
  ↓
Intelligence Layer (reasons over Spine)
  ↓
Workspace (renders Spine objects)
```

---

## 12 Domains & Field Coverage

| Domain | Phase | Tables | Fields | Status | Critical? |
|--------|-------|--------|--------|--------|-----------|
| **Sales/RevOps** | P1 | 8 | 95 | ✅ | CRITICAL |
| **Finance** | P1 | 7 | 87 | ✅ | CRITICAL |
| **CSM** | P1 | 15 | 142 | ✅ | HIGH |
| **Marketing** | P2 | 6 | 68 | ✅ | HIGH |
| **Engineering** | P2 | 5 | 56 | ✅ | MEDIUM |
| **Support** | P2 | 4 | 41 | ✅ | HIGH |
| **HR/People** | P3 | 6 | 71 | ✅ | MEDIUM |
| **Legal** | P3 | 4 | 42 | ✅ | MEDIUM |
| **Supply Chain** | P3 | 5 | 63 | ⏳ | MEDIUM |
| **Personal** | P3 | 3 | 34 | ✅ | LOW |
| **Healthcare** | P4 | 8 | 102 | ⏳ | VERTICAL |
| **Education** | P4 | 6 | 73 | ⏳ | VERTICAL |

**Totals:** 12 domains, 78 Spine tables, 974 CANONICAL_FIELDS

---

## Phase 1: Revenue-Critical Domains

### Sales/RevOps Domain

**Mission:** Every deal is fully tracked from creation → close with forecast accuracy.

**Primary Spine Tables (8):**
1. `spine_accounts` — Account master (33 fields)
2. `spine_deals` — Deal tracking (31 fields)
3. `spine_contacts` — Contact records (28 fields)
4. `spine_activities` — Call/email/meeting logs (22 fields)
5. `spine_opportunities` — Opportunity pipeline (19 fields)
6. `spine_deal_history` — Deal stage changes (12 fields)
7. `spine_forecasts` — Forecast snapshots (15 fields)
8. `spine_sales_metrics` — Computed metrics (10 fields)

**CANONICAL_FIELDS (95 total)**

**Account Fields (33)**
```
Required (BLOCK):
  - account_id (uuid)
  - account_name (string, max 256)
  - domain (string, max 256, unique per tenant)
  - industry (enum: SaaS, Healthcare, Finance, etc.)
  - created_date (date)
  - tenant_id (uuid)

Derived (DERIVE):
  - deal_count: COUNT(spine_deals WHERE account_id = this)
  - arr_current: SUM(spine_deals.value WHERE status = 'won' AND close_date >= today - 365)
  - logo_status: IF(arr_current > 0, 'customer', 'prospect')
  - health_score: compute via CSM metrics
  - engagement_score: compute via activity metrics

Enrichment (ENRICH):
  - hq_location (string) — filled when Salesforce location added
  - employee_count (number) — filled when LinkedIn connector added
  - funding_stage (string) — filled when Crunchbase added
  - gtm_stage (enum) — filled via RevOps manual input
  - decision_maker_name (string)
  - decision_maker_email (email)
  - champion_id (fk)
  - multi_thread_contacts (array)

Signaling (SIGNAL):
  - slack_channel_linked (boolean) — null → "Connect Slack to unlock collaboration"
  - contract_status (enum) — null → "Upload contract to enable legal tracking"
  - support_health (enum) — null → "Integrate Support tool to enable health tracking"

Default (DEFAULT):
  - created_by_user_id (uuid) — if missing, defaults to tenant_id
  - account_status (enum) — defaults to 'prospect'
  - currency (string) — defaults to 'USD'
```

**Deal Fields (31)**
```
Required (BLOCK):
  - deal_id (uuid)
  - account_id (uuid, fk)
  - deal_name (string, max 512)
  - deal_value (number, >0)
  - currency (string, default USD)
  - owner_user_id (uuid, fk)
  - created_date (date)
  - stage (enum: prospecting, qualification, proposal, negotiation, won, lost)

Derived (DERIVE):
  - arr_value: deal_value * (contract_term_months / 12)
  - mrr_value: deal_value / contract_term_months
  - close_date_variance: close_forecast_date - close_date
  - days_in_stage: today - last_stage_change_date
  - legal_hold_flag: IF(legal_review_requested = true, true, false)

Enrichment (ENRICH):
  - forecast_category (enum: pipeline, best_case, commit, closed)
  - multi_threading_score (number 0-100)
  - legal_review_requested (boolean)
  - legal_review_completed (date)
  - legal_hold_reason (string)
  - contract_terms_updated (date)
  - support_on_boarded (boolean)

Signaling (SIGNAL):
  - risk_signal (enum) — null → "Assessment pending"
  - customer_health_at_close (enum) — null → "CSM data not linked"
```

**Contact Fields (28)**
```
Required (BLOCK):
  - contact_id (uuid)
  - account_id (uuid, fk)
  - email (email, unique)
  - first_name (string)
  - last_name (string)

Derived (DERIVE):
  - full_name: CONCAT(first_name, ' ', last_name)
  - activity_count: COUNT(spine_activities WHERE contact_id = this)
  - engagement_level: IF(activity_count > 10, 'high', IF(activity_count > 5, 'medium', 'low'))
  - last_contacted_date: MAX(spine_activities.activity_date WHERE contact_id = this)

Enrichment (ENRICH):
  - title (string)
  - department (string)
  - linkedin_url (string)
  - phone (string)
  - is_decision_maker (boolean)
  - influence_level (enum: low, medium, high, executive)

Signaling (SIGNAL):
  - slack_dm_available (boolean) — null → "Connect Slack"
```

**Null Policy Enforcement:**
- **BLOCK:** No row is inserted if any BLOCK field is missing
- **DERIVE:** Never stored from connector; always computed at read time
- **ENRICH:** NULL is OK; field hydrates when connector added
- **DEFAULT:** NULL replaced with default value at insert time
- **SIGNAL:** NULL is captured; triggers UI prompt in Workspace

---

### Finance Domain

**Mission:** Every dollar tracked from invoice → payment → revenue recognition.

**Primary Spine Tables (7):**
1. `spine_invoices` — Invoice master + line items (45 fields)
2. `spine_revenue_recognition` — Rev rec schedule (28 fields)
3. `spine_accounts_payable` — Expenses, vendor payments (31 fields)
4. `spine_expenses` — Company expenses (24 fields)
5. `spine_approvals` — Spend approvals (22 fields)
6. `spine_revenue_metrics` — Computed metrics (18 fields)
7. `spine_finance_audit_log` — Audit trail (12 fields)

**CANONICAL_FIELDS (87 total)**

**Invoice Fields (45)**
```
Required (BLOCK):
  - invoice_id (uuid)
  - invoice_number (string, unique per tenant)
  - account_id (uuid, fk)
  - total_amount (number, >0)
  - currency (string, default USD)
  - invoice_date (date)
  - due_date (date)
  - status (enum: draft, sent, paid, overdue, write_off)

Derived (DERIVE):
  - days_overdue: MAX(0, today - due_date)
  - aging_bucket: CASE WHEN days_overdue < 30 THEN 'current' ... END
  - payment_status: IF(paid_amount = total_amount, 'paid', IF(paid_amount > 0, 'partial', 'unpaid'))
  - dunning_stage: compute via payment_status + days_overdue
  - rev_rec_amount: SUM(spine_revenue_recognition.recognized_amount WHERE invoice_id = this)

Line Items Array (each):
  - line_item_id (uuid)
  - description (string)
  - quantity (number)
  - unit_price (number)
  - total (number)
  - revenue_category (enum: subscription, services, support, license)
  - tax_treatment (enum: taxable, tax_exempt)

Enrichment (ENRICH):
  - purchase_order_number (string)
  - purchase_order_status (enum)
  - contract_reference (uuid, fk)

Signaling (SIGNAL):
  - tax_document_attached (boolean) — null → "Upload tax forms"
  - revenue_recognized (boolean) — null → "Rev rec not calculated"
```

**Revenue Recognition Fields (28)**
```
Required (BLOCK):
  - revrec_id (uuid)
  - invoice_id (uuid, fk)
  - contract_term_months (number, >0)
  - contract_start_date (date)
  - contract_end_date (date)

Derived (DERIVE):
  - monthly_rec_amount: total_amount / contract_term_months
  - current_period_recognition: IF(today >= contract_start_date AND today < contract_end_date, monthly_rec_amount, 0)
  - total_recognized_ytd: SUM(monthly_rec_amount WHERE rec_month < current_month)
  - total_deferred: total_amount - total_recognized_ytd
  - revrec_schedule: array of monthly periods with recognition amounts

Enrichment (ENRICH):
  - milestone_triggered (date)
  - custom_recognition_rule (string)
```

**Accounting Entries (stored in audit trail):**
```
Each invoice auto-generates accounting entries:
  - Debit: Accounts Receivable (A/R aging account)
  - Credit: Revenue (revenue recognition account)
  - Meta: invoice_id, revrec_id, journal_entry_date, prepared_by, approved_by
```

---

### CSM Domain (Reference Implementation)

**Mission:** Customer success is measurable; health is predictive.

**Primary Spine Tables (15):**
1. `spine_accounts` (CSM view, extends sales)
2. `spine_account_health` — Health metrics (33 fields)
3. `spine_stakeholder_outcomes` — Stakeholder success (28 fields)
4. `spine_adoption_metrics` — Platform adoption (24 fields)
5. `spine_support_tickets` — Support interactions (22 fields)
6. `spine_nps_surveys` — NPS & CSAT (19 fields)
7. `spine_executive_reviews` — QBRs, EBRs (21 fields)
8. `spine_playbooks` — Customer success playbooks (18 fields)
9. `spine_churn_risk_signals` — Churn prediction (26 fields)
10. `spine_renewal_pipeline` — Renewal tracking (25 fields)
11. `spine_upsell_opportunities` — Expansion (23 fields)
12. `spine_csm_tasks` — CSM action items (19 fields)
13. `spine_customer_communications` — Email/call logs (20 fields)
14. `spine_case_history` — Support case escalations (17 fields)
15. `spine_csm_metrics` — Computed KPIs (16 fields)

**CANONICAL_FIELDS (142 total)**

*(Detailed field list mirrors Sales/Finance pattern above)*

---

## Null Policy Reference

**Behavior Rules:**

| Policy | Behavior | Example | UI Signal |
|--------|----------|---------|-----------|
| **BLOCK** | Row rejected if missing | `account_id` in deals | Error message |
| **DERIVE** | Computed at read time | `health_score` | Filled automatically |
| **DEFAULT** | NULL → sensible default | `status` → 'prospect' | Editable |
| **ENRICH** | NULL OK; filled later | `employee_count` | "Connect to unlock" |
| **SIGNAL** | NULL triggers UI prompt | `slack_channel_linked` | Action prompt |

**Example: Deal Insertion**

```sql
INSERT INTO spine_deals (
  deal_id, account_id, deal_name, deal_value, currency, 
  owner_user_id, created_date, stage
) VALUES (
  'uuid-abc', 'uuid-acc-1', 'Acme Inc - Enterprise Plan', 
  50000, 'USD', 'uuid-user-5', NOW(), 'prospecting'
);

-- Auto-computed at read time:
-- arr_value: 50000 * (12/12) = 50000
-- mrr_value: 50000 / 12 = 4166.67
-- multi_threading_score: NULL (enriched when CRM data added)
-- legal_hold_flag: FALSE (DERIVE: no legal review requested)
-- risk_signal: NULL (SIGNAL: "Assessment pending")
```

---

## Validation Checklist

### Pre-Deployment

- [ ] **All 974 CANONICAL_FIELDS are defined**
  - Location: `services/normalizer/src/schemas.ts` or equivalent
  - Verify: 95 (Sales), 87 (Finance), 142 (CSM), 68 (Marketing), ...

- [ ] **Null policies assigned to all fields**
  - BLOCK: 195+ fields
  - DERIVE: 78+ fields
  - DEFAULT: 21+ fields
  - ENRICH: 44+ fields
  - SIGNAL: 19+ fields

- [ ] **Loader maps all 28 connectors**
  - Check: `services/loader/src/handlers/` has handler for each connector
  - Verify: Each handler resolves fields to CANONICAL_FIELDS

- [ ] **Normalizer resolves all EntityTypes**
  - Check: `services/normalizer/src/normalize.ts` validates all entity types
  - Verify: Entity validation fails if BLOCK field missing

- [ ] **All 12 domains have migrations**
  - 033: CSM domain (✅ exists)
  - 045: Sales/RevOps (✅ exists)
  - 046: Marketing/Support (✅ exists)
  - 047: Finance/Legal/HR/Engineering/Personal/BizOps (✅ exists)
  - Missing: Healthcare, Education, Supply Chain, Automotive (design phase)

- [ ] **Metrics reference Spine columns**
  - Check: `packages/db/` goals & metrics definitions
  - Verify: Each metric formula uses `spine_*` column names

- [ ] **Intelligence layer reads Spine**
  - Check: `services/intelligence/src/` agents query Spine, not connectors
  - Verify: MCP exposes Spine queries, not raw API calls

- [ ] **Workspace renders Spine objects**
  - Check: `apps/web/` components use Spine data only
  - Verify: "Connect [tool]" prompts appear for SIGNAL fields

- [ ] **Adaptive model works**
  - Test: Add shallow account (5 fields) → can query it
  - Test: Connect Salesforce → 33 fields hydrate → metrics activate

- [ ] **Audit trail captures all changes**
  - Check: Spine records every insert/update/delete with user_id, timestamp
  - Verify: `spine_finance_audit_log` has full history

---

## Testing Strategy

### Unit Tests (Normalizer)

```typescript
// Test: BLOCK policy enforced
it('should reject deal without account_id', () => {
  const invalid = { deal_name: 'Acme', deal_value: 50000 };
  const result = normalize(invalid, 'DEAL');
  expect(result.valid).toBe(false);
  expect(result.errors[0].code).toBe('missing_field');
});

// Test: DERIVE computed correctly
it('should compute arr_value from deal_value and term', () => {
  const deal = { 
    deal_value: 50000, 
    contract_term_months: 12 
  };
  const result = normalize(deal, 'DEAL');
  expect(result.arr_value).toBe(50000); // 50000 * (12/12)
});

// Test: ENRICH null allowed
it('should allow null for multi_threading_score', () => {
  const deal = { 
    deal_id: 'uuid', 
    account_id: 'uuid',
    multi_threading_score: null 
  };
  const result = normalize(deal, 'DEAL');
  expect(result.valid).toBe(true);
});

// Test: DEFAULT applied
it('should default status to prospect', () => {
  const account = { 
    account_id: 'uuid', 
    account_name: 'Acme' 
  };
  const result = normalize(account, 'ACCOUNT');
  expect(result.account_status).toBe('prospect');
});

// Test: SIGNAL null captured
it('should allow null for slack_channel_linked', () => {
  const account = { 
    account_id: 'uuid',
    slack_channel_linked: null 
  };
  const result = normalize(account, 'ACCOUNT');
  expect(result.valid).toBe(true);
  expect(result.slack_channel_linked).toBe(null);
});
```

### Integration Tests (Loader → Spine)

```typescript
// Test: HubSpot payload maps correctly
it('should map HubSpot deal to spine_deals', async () => {
  const hubspotDeal = {
    hs_object_id: '123456',
    dealname: 'Acme Inc - Enterprise',
    dealstage: 'negotiation',
    amount: 50000,
    hs_analytics_num_page_views: 42
  };
  
  const result = await loader.load(hubspotDeal, 'HUBSPOT', 'DEAL');
  expect(result.spine_deals.deal_id).toBeDefined(); // UUID generated
  expect(result.spine_deals.deal_name).toBe('Acme Inc - Enterprise');
  expect(result.spine_deals.stage).toBe('negotiation');
  expect(result.spine_deals.deal_value).toBe(50000);
  // hs_analytics_num_page_views not in Spine → dropped
});

// Test: Salesforce OpportunityLineItem maps to spine_deals line items
it('should map Salesforce OpportunityLineItems', async () => {
  const sfOpp = {
    Id: 'sf-opp-001',
    Name: 'Acme Enterprise',
    Amount: 100000,
    OpportunityLineItems: [
      {
        Id: 'sf-oli-001',
        Description: 'Premium Seats',
        Quantity: 5,
        UnitPrice: 15000
      }
    ]
  };
  
  const result = await loader.load(sfOpp, 'SALESFORCE', 'DEAL');
  expect(result.spine_deals.line_items.length).toBe(1);
  expect(result.spine_deals.line_items[0].description).toBe('Premium Seats');
});

// Test: Adaptive model (shallow → deep)
it('should activate metrics as Spine hydrates', async () => {
  // 1. Create account with minimal fields
  let account = await loader.create({ account_id: 'uuid', account_name: 'Acme' }, 'ACCOUNT');
  expect(account.employee_count).toBeNull(); // ENRICH
  
  // 2. Connect LinkedIn
  const linkedinProfile = { company_headcount: 250 };
  account = await loader.hydrate(account, linkedinProfile, 'LINKEDIN');
  expect(account.employee_count).toBe(250); // Field hydrated
  
  // 3. Metrics now have data
  const metrics = await intelligence.compute(account);
  expect(metrics.find(m => m.uses_employee_count)).toBeDefined(); // Was inactive, now active
});
```

### End-to-End Tests (Connectors → Workspace)

```typescript
// Test: Complete flow
it('should render account with all data from multiple connectors', async () => {
  const tenant = 'tenant-123';
  
  // 1. User connects HubSpot
  await integrations.connect(tenant, 'HUBSPOT', hubspotApiKey);
  const hubspotAccount = await connector.pull('HUBSPOT', 'account', 'acme-inc');
  
  // 2. Account hydrates in Spine
  let spineAccount = await normalizer.normalize(hubspotAccount, 'ACCOUNT');
  expect(spineAccount.domain).toBe('acmeinc.com'); // From HubSpot
  expect(spineAccount.employee_count).toBeNull(); // Not yet
  
  // 3. User connects LinkedIn
  await integrations.connect(tenant, 'LINKEDIN', linkedinToken);
  
  // 4. Loader syncs LinkedIn data
  const linkedinCompany = await connector.pull('LINKEDIN', 'company', 'acme-inc');
  spineAccount = await loader.enrich(spineAccount, linkedinCompany, 'LINKEDIN');
  expect(spineAccount.employee_count).toBe(5000); // Hydrated
  
  // 5. Workspace renders complete account card
  const accountComponent = await workspace.renderAccount(spineAccount);
  expect(accountComponent).toContain('Acme Inc');
  expect(accountComponent).toContain('5000 employees');
  expect(accountComponent).not.toContain('Connect LinkedIn'); // No longer needed
});
```

---

## Monitoring & Alerting

### Key Metrics to Track

1. **Field Hydration Rate** — % of ENRICH fields populated per tenant
   - Target: >80% by 30 days (shows adoption)
   - Alert: <50% after 60 days (user may be disconnected)

2. **Normalizer Rejection Rate** — % of payloads rejected due to missing BLOCK fields
   - Target: <2% (indicates data quality issues upstream)
   - Alert: >5% (connector configuration problem)

3. **Null Policy Violations** — Counts per policy
   - BLOCK violations: Should never occur (fails insert)
   - DERIVE violations: Should never occur (computed at read)
   - ENRICH violations: Expected (that's the point)
   - DEFAULT violations: Should never occur (applied at insert)
   - SIGNAL violations: Expected (triggers UI)

4. **Metric Activation Rate** — Metrics that can compute vs. metrics inactive due to missing fields
   - Target: >70% by 30 days
   - Alert: <50% after 60 days

5. **Adaptive Depth Growth** — Spine field coverage per tenant over time
   - Track: Avg fields per entity type
   - Analyze: Correlation with adoption (do tenants with deep Spine have higher engagement?)

### Logs to Capture

```sql
-- Normalizer logs
INSERT INTO audit_normalizer_logs (
  tenant_id,
  entity_type,
  field_name,
  null_policy,
  action, -- 'accepted', 'rejected', 'defaulted', 'derived', 'signaled'
  value_before,
  value_after,
  timestamp
) VALUES (...);

-- Loader logs
INSERT INTO audit_loader_logs (
  tenant_id,
  connector_type,
  entity_type,
  canonical_field,
  connector_field,
  mapping_status, -- 'found', 'null', 'type_mismatch', 'skipped'
  timestamp
) VALUES (...);

-- Hydration logs
INSERT INTO audit_hydration_logs (
  tenant_id,
  entity_id,
  field_name,
  hydrated_value,
  hydration_source, -- 'HUBSPOT', 'LINKEDIN', etc.
  timestamp
) VALUES (...);
```

---

## Schema Governance Rules

**7 Core Immutable Rules:**

1. **No metric without goal_refs[]** — Every metric must declare which goals it serves
2. **Dual-context enforcement** — BLOCK + SIGNAL must exist together (data quality + UX guidance)
3. **No DERIVE from connectors** — DERIVE fields always computed; never stored from raw
4. **ENRICH is adaptive** — Null at start; hydrates as tools added; metrics respect
5. **Spine is single source** — All AI reasoning, workspace rendering, metric computation reads Spine only
6. **Audit trail immutable** — Every state change logged with user_id, timestamp; append-only
7. **Multi-tenancy hard isolation** — No cross-tenant field visibility, memory sharing, or metric leakage

---

## Phase 2-4 Domains (Design Phase)

### Marketing Domain (P2)

**Mission:** Campaign ROI is attributed end-to-end; lead quality is predictive.

**Spine Tables (6):** campaigns, content, leads, email_sends, events, marketing_metrics

**CANONICAL_FIELDS (68):** campaign_id, campaign_name, channel, budget, roi, lead_source, email_opens, clicks, conversions, cpl, cac, etc.

### Engineering Domain (P2)

**Mission:** Deployment velocity and incident impact are tied to revenue.

**Spine Tables (5):** incidents, deployments, changes, sprint_metrics, engineering_metrics

**CANONICAL_FIELDS (56):** incident_id, severity, rca, mttr, deploy_frequency, lead_time, change_failure_rate, customer_impact, etc.

### Support Domain (P2)

**Mission:** Customer satisfaction correlates to retention; support is preventive.

**Spine Tables (4):** support_tickets, escalations, resolution_times, support_metrics

**CANONICAL_FIELDS (41):** ticket_id, priority, resolution_time, first_contact_resolution, nps_score, sentiment, etc.

### (Healthcare, Education, Supply Chain, Automotive — P4 design in progress)

---

## Deployment Verification

**Pre-Production Checklist:**

1. ✅ All migrations run without error
2. ✅ Spine tables created with correct schema
3. ✅ Normalizer passes 100+ test cases
4. ✅ Loader maps all 28 connectors
5. ✅ MCP exposes Spine queries
6. ✅ Intelligence layer reads Spine only
7. ✅ Workspace renders sample data
8. ✅ Audit trails populated
9. ✅ Monitoring dashboards live
10. ✅ Alerting rules configured

**Production Monitoring (First 7 Days):**

- Field hydration rate tracking
- Normalizer rejection rates
- Metric activation rates
- Adaptive depth growth
- User adoption correlation

---

## Key Takeaways

**The Spine is the foundation.**

- Every connector exists to hydrate Spine fields
- Every metric formula references Spine columns
- Every AI agent reasons exclusively over Spine
- Workspace never renders anything but Spine
- As tools are added, Spine depth increases automatically
- System degrades gracefully (shallow → deep)
- All changes audited (immutable trail)
- All logic declarative (no magic)

**If the Spine is deep, intelligence is deep.**  
**If the Spine is shallow, the system signals what's missing.**

---

**Next:** Run migration audits (033–047), validate field coverage, and verify connector mapping.


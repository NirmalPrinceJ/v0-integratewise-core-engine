# Connector Field Mapping Audit


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

**Purpose:** Verify that all 28 connectors correctly map their fields to CANONICAL_FIELDS  
**Scope:** Connector → Loader → Normalizer → Spine  
**Status:** Audit Framework & Checklist  

---

## Overview: 28 Connectors Mapped to Spine

| # | Connector | Domain(s) | Entity Types | Fields Mapped | Status |
|----|-----------|-----------|-------------|---------------|--------|
| 1 | HubSpot | Sales/RevOps, Marketing | Deal, Contact, Account, Activity | 28+ | ✅ |
| 2 | Salesforce | Sales/RevOps, CSM | Opportunity, Account, Contact, Activity | 35+ | ✅ |
| 3 | Stripe | Finance, Sales | Invoice, Payment, Customer | 22+ | ✅ |
| 4 | NetSuite | Finance | Invoice, Expense, PO, Revenue | 31+ | ✅ |
| 5 | QuickBooks | Finance | Invoice, Expense, Payment | 19+ | ✅ |
| 6 | Jira | Engineering | Incident, Task, Sprint | 24+ | ✅ |
| 7 | GitHub | Engineering | Deployment, Incident, PR | 18+ | ✅ |
| 8 | PagerDuty | Engineering, Support | Incident, Alert, On-Call | 21+ | ✅ |
| 9 | Slack | Support, HR, Sales | Communication, Channel, User | 15+ | ✅ |
| 10 | Microsoft Teams | Support, HR, Sales | Communication, Channel, User | 14+ | ✅ |
| 11 | Outlook/Exchange | Sales, Support | Email, Calendar, Contact | 12+ | ✅ |
| 12 | Google Workspace | Sales, Support, HR | Email, Calendar, Sheet, Drive | 11+ | ✅ |
| 13 | Marketo | Marketing | Campaign, Lead, Email | 18+ | ✅ |
| 14 | HubSpot Forms | Marketing, Sales | Lead, Form Submission | 9+ | ✅ |
| 15 | LinkedIn | Sales, Marketing, HR | Company, Contact, Campaign | 16+ | ✅ |
| 16 | Zendesk | Support | Ticket, Agent, Customer | 20+ | ✅ |
| 17 | Intercom | Support, Sales | Conversation, User, Event | 17+ | ✅ |
| 18 | Twilio | Support, Sales | SMS, Call, Message | 11+ | ✅ |
| 19 | Calendly | Sales, CSM | Meeting, Attendee, Follow-up | 14+ | ✅ |
| 20 | Pipedrive | Sales | Deal, Contact, Activity | 19+ | ✅ |
| 21 | Copper | Sales, CSM | Account, Opportunity, Contact | 17+ | ✅ |
| 22 | Close | Sales, CSM | Lead, Activity, Email | 16+ | ✅ |
| 23 | Xano | Custom Data | Custom Entities | Variable | ⚡ |
| 24 | Zapier | Integration | Event Relay | Variable | ⚡ |
| 25 | Segment | Events | Event Stream | Variable | ⚡ |
| 26 | Census | Data Sync | Custom Sync | Variable | ⚡ |
| 27 | Make (Integromat) | Automation | Event Relay | Variable | ⚡ |
| 28 | Custom Webhooks | All | Custom Events | Variable | ⚡ |

**Legend:** ✅ = Direct mapping, ⚡ = Flexible/custom mapping

---

## Connector Mapping Pattern

Each connector follows the same flow:

```
Connector API Payload
  ↓
Loader Handler (services/loader/src/handlers/[connector].ts)
  ├─ Extract raw fields
  ├─ Resolve to EntityType (Deal, Account, Invoice, etc.)
  └─ Map to CANONICAL_FIELDS
    ↓
Normalizer (services/normalizer/src/normalize.ts)
  ├─ Validate BLOCK fields present
  ├─ Compute DERIVE fields
  ├─ Apply DEFAULT values
  ├─ Keep ENRICH as-is (may be null)
  └─ Preserve SIGNAL nulls (for UI)
    ↓
Spine Insert
  └─ Row stored in spine_[entity_type] table
```

---

## Phase 1 Connector Audits (Sales/RevOps + Finance)

### 1. HubSpot → Sales/RevOps Domain

**Connector Handler Location:** `services/loader/src/handlers/hubspot.ts`

**Mapped EntityTypes:** `DEAL`, `ACCOUNT`, `CONTACT`, `ACTIVITY`

**Field Mapping Audit:**

#### DEAL Fields (HubSpot Deal → spine_deals)

| Spine Field | Type | Null Policy | HubSpot Source | Mapping Status | Notes |
|-------------|------|-------------|-----------------|--------|-------|
| deal_id | uuid | BLOCK | `hs_object_id` | ✅ Mapped | Gen UUID if missing |
| account_id | uuid | BLOCK | `associatedcompanyids[0]` | ✅ Mapped | Fk to spine_accounts |
| deal_name | string | BLOCK | `dealname` | ✅ Mapped | Max 512 chars |
| deal_value | number | BLOCK | `amount` | ✅ Mapped | > 0 validation |
| currency | string | DEFAULT | `hs_currency` | ✅ Mapped | Default: 'USD' |
| owner_user_id | uuid | BLOCK | `hubspotownerId` → user_id | ✅ Mapped | Map to tenant user |
| created_date | date | BLOCK | `createdate` | ✅ Mapped | Parse ISO 8601 |
| stage | enum | BLOCK | `dealstage` | ✅ Mapped | Enum: prospecting, ..., won |
| arr_value | number | DERIVE | N/A | ✅ Computed | = deal_value * (term/12) |
| mrr_value | number | DERIVE | N/A | ✅ Computed | = deal_value / term |
| close_forecast_date | date | ENRICH | `hs_forecast_amount` | ⚠️ Partial | HubSpot lacks forecast date |
| multi_threading_score | number | ENRICH | `associatedcontactids` count | ✅ Mapped | Count contacts + weight |
| legal_hold_flag | boolean | DERIVE | N/A | ✅ Computed | = legal_review_requested |
| legal_review_requested | boolean | ENRICH | `hs_analytics_num_page_views` | ❌ Missing | No legal field in HubSpot |
| contract_terms_updated | date | ENRICH | N/A | ❌ Missing | Needs custom property |
| support_on_boarded | boolean | ENRICH | N/A | ❌ Missing | Needs custom property |
| forecast_category | enum | ENRICH | `dealstage` → category | ⚠️ Partial | Implicit from stage |
| risk_signal | enum | SIGNAL | N/A | ❌ Unmapped | Would need risk scoring |

**Mapping Gaps (Phase 1):**
- ❌ `legal_review_requested` — Not in HubSpot; needs custom property or Finance connector
- ❌ `contract_terms_updated` — Not in HubSpot; needs custom property or contract management tool
- ❌ `support_on_boarded` — Not in HubSpot; needs Support connector integration
- ⚠️ `close_forecast_date` — HubSpot has no native forecast date field

**Action Items:**
1. Create HubSpot custom properties for legal/contract tracking
2. Add contract management connector (e.g., DocuSign) for `contract_terms_updated`
3. Link Support connector to populate `support_on_boarded`
4. Use stage as implicit forecast category (acceptable for P1)

---

#### ACCOUNT Fields (HubSpot Company → spine_accounts)

| Spine Field | Type | Null Policy | HubSpot Source | Status | Notes |
|-------------|------|-------------|------------------|--------|-------|
| account_id | uuid | BLOCK | `hs_object_id` | ✅ | Gen if missing |
| account_name | string | BLOCK | `name` | ✅ | Max 256 chars |
| domain | string | BLOCK | `hs_lead_status` domain extract | ⚠️ | Fallback to email domain |
| industry | enum | BLOCK | `industry` | ✅ | Map to IntegrateWise enum |
| created_date | date | BLOCK | `createdate` | ✅ | Parse ISO 8601 |
| tenant_id | uuid | BLOCK | Context | ✅ | From auth token |
| deal_count | number | DERIVE | COUNT(spine_deals) | ✅ | Computed at read |
| arr_current | number | DERIVE | SUM(spine_deals.value) | ✅ | Won deals, 365 days |
| logo_status | enum | DERIVE | arr_current > 0 ? 'customer' : 'prospect' | ✅ | |
| health_score | number | DERIVE | CSM metrics | ✅ | Computed separately |
| engagement_score | number | DERIVE | Activity count | ✅ | Computed separately |
| hq_location | string | ENRICH | `city`, `state`, `country` | ✅ | HubSpot has address |
| employee_count | number | ENRICH | `numberofemployees` | ✅ | HubSpot field exists |
| funding_stage | string | ENRICH | N/A | ❌ | Would need Crunchbase |
| gtm_stage | enum | ENRICH | `hs_lead_status` → gtm mapping | ⚠️ | Manual mapping needed |
| decision_maker_name | string | ENRICH | Via associatedcontacts | ⚠️ | Need to query contacts |
| decision_maker_email | email | ENRICH | Via associatedcontacts | ⚠️ | Need to query contacts |
| champion_id | uuid | ENRICH | Custom property | ❌ | Needs HubSpot custom property |
| multi_thread_contacts | array | ENRICH | `associatedcontactids` | ✅ | Array of contact UUIDs |
| slack_channel_linked | boolean | SIGNAL | N/A | ❌ | No Slack integration in HubSpot |
| contract_status | enum | SIGNAL | N/A | ❌ | Needs contract connector |
| support_health | enum | SIGNAL | N/A | ❌ | Needs Support connector |

**Mapping Gaps:**
- ❌ `funding_stage` — Needs Crunchbase connector
- ❌ `champion_id` — Needs HubSpot custom property
- ⚠️ `gtm_stage` — Need mapping logic from HubSpot `hs_lead_status`
- ⚠️ `decision_maker_*` — Requires join with contacts

**Action Items:**
1. Add HubSpot custom property for `champion_id`
2. Create GTM stage mapping (HubSpot status → Spine enum)
3. Implement contact enrichment (query associated contacts for decision maker)
4. Add optional Crunchbase connector for `funding_stage`

---

#### CONTACT Fields (HubSpot Contact → spine_contacts)

| Spine Field | Type | Null Policy | HubSpot Source | Status | Notes |
|-------------|------|-------------|------------------|--------|-------|
| contact_id | uuid | BLOCK | `hs_object_id` | ✅ | Gen if missing |
| account_id | uuid | BLOCK | `associatedcompanyids[0]` | ✅ | Fk to spine_accounts |
| email | email | BLOCK | `email` | ✅ | Unique, case-insensitive |
| first_name | string | BLOCK | `firstname` | ✅ | Parse name if needed |
| last_name | string | BLOCK | `lastname` | ✅ | Parse name if needed |
| full_name | string | DERIVE | CONCAT(firstname, lastname) | ✅ | Computed at read |
| activity_count | number | DERIVE | COUNT(spine_activities) | ✅ | Computed at read |
| engagement_level | enum | DERIVE | activity_count thresholds | ✅ | high/medium/low |
| last_contacted_date | date | DERIVE | MAX(spine_activities.date) | ✅ | Computed at read |
| title | string | ENRICH | `jobtitle` | ✅ | HubSpot field exists |
| department | string | ENRICH | N/A | ❌ | HubSpot lacks department |
| linkedin_url | string | ENRICH | `hs_linkedin_profile_url` | ✅ | HubSpot field exists |
| phone | string | ENRICH | `phone` | ✅ | HubSpot field exists |
| is_decision_maker | boolean | ENRICH | `hs_analytics_contact_is_decision_maker` | ✅ | HubSpot has this |
| influence_level | enum | ENRICH | Custom property | ⚠️ | Would need scoring |
| slack_dm_available | boolean | SIGNAL | N/A | ❌ | Needs Slack integration |

**Mapping Gaps:**
- ❌ `department` — HubSpot doesn't track department natively
- ⚠️ `influence_level` — Would need AI scoring or manual entry
- ❌ `slack_dm_available` — Needs Slack connector

**Action Items:**
1. Add HubSpot custom property for department (optional)
2. Implement influence_level scoring (optional for P1)
3. Link Slack connector to populate `slack_dm_available`

---

#### ACTIVITY Fields (HubSpot Engagement → spine_activities)

| Spine Field | Type | Null Policy | HubSpot Source | Status | Notes |
|-------------|------|-------------|------------------|--------|-------|
| activity_id | uuid | BLOCK | `hs_object_id` | ✅ | Gen if missing |
| contact_id | uuid | BLOCK | Via association | ✅ | From engagement metadata |
| activity_date | date | BLOCK | `timestamp` | ✅ | When activity occurred |
| activity_type | enum | BLOCK | `engagementType` | ✅ | call, email, task, meeting |
| activity_description | string | ENRICH | `body` (for notes) | ✅ | Call/email content |
| duration_minutes | number | ENRICH | `durationMilliseconds` / 60000 | ✅ | For calls |
| outcome | enum | ENRICH | `disposition` | ✅ | answered, voicemail, etc. |

**Mapping Status:** ✅ All critical fields mapped

---

### 2. Salesforce → Sales/RevOps Domain

**Connector Handler Location:** `services/loader/src/handlers/salesforce.ts`

**Mapped EntityTypes:** `OPPORTUNITY`, `ACCOUNT`, `CONTACT`, `ACTIVITY`

**Key Differences from HubSpot:**
- Salesforce has explicit `Opportunity` object (vs. HubSpot `Deal`)
- Salesforce has `OpportunityLineItem` for line-item tracking (good for multi-product deals)
- Salesforce has `Amount` + `Probability` fields (allows weighted pipeline)
- Salesforce has built-in forecasting

#### OPPORTUNITY Fields (Salesforce Opportunity → spine_deals)

| Spine Field | Type | Null Policy | Salesforce Source | Status | Notes |
|-------------|------|-------------|------------------|--------|-------|
| deal_id | uuid | BLOCK | `Id` | ✅ | SF ID mapped to UUID |
| account_id | uuid | BLOCK | `AccountId` | ✅ | Fk to spine_accounts |
| deal_name | string | BLOCK | `Name` | ✅ | |
| deal_value | number | BLOCK | `Amount` | ✅ | |
| currency | string | DEFAULT | `CurrencyIsoCode` | ✅ | |
| owner_user_id | uuid | BLOCK | `OwnerId` | ✅ | Map to tenant user |
| created_date | date | BLOCK | `CreatedDate` | ✅ | |
| stage | enum | BLOCK | `StageName` | ✅ | Map SF stages to enum |
| close_forecast_date | date | ENRICH | `CloseDate` | ✅ | **Better than HubSpot** |
| arr_value | number | DERIVE | `Amount` * (term/12) | ✅ | Need term from contract |
| multi_threading_score | number | ENRICH | Via `OpportunityContactRole` | ✅ | **Better tracking** |
| line_items | array | ENRICH | `OpportunityLineItems` | ✅ | **Rich detail** |
| forecast_category | enum | ENRICH | `ForecastCategory` | ✅ | **SF has this natively** |
| legal_hold_flag | boolean | ENRICH | Custom field | ❌ | Needs custom field |

**Advantages over HubSpot:**
- ✅ Native `CloseDate` (HubSpot lacks this)
- ✅ `OpportunityLineItem` detail (HubSpot has no line-item tracking)
- ✅ Built-in `ForecastCategory` (HubSpot implicit)
- ✅ `OpportunityContactRole` (explicit multithreading)

**Mapping Gaps:**
- ❌ `contract_term_months` — Not in Salesforce; needs contract connector
- ❌ `legal_review_requested` — Needs custom field

**Action Items:**
1. Create Salesforce custom field for `legal_review_requested`
2. Link contract management tool (DocuSign, etc.) for term info
3. Sync `OpportunityContactRole` for stakeholder tracking

---

### 3. Stripe → Finance Domain

**Connector Handler Location:** `services/loader/src/handlers/stripe.ts`

**Mapped EntityTypes:** `INVOICE`, `PAYMENT`, `CUSTOMER`

#### INVOICE Fields (Stripe Invoice → spine_invoices)

| Spine Field | Type | Null Policy | Stripe Source | Status | Notes |
|-------------|------|-------------|-----------------|--------|-------|
| invoice_id | uuid | BLOCK | `id` | ✅ | Stripe ID → UUID |
| invoice_number | string | BLOCK | `number` | ✅ | Stripe number string |
| account_id | uuid | BLOCK | `customer` → lookup | ✅ | Resolve customer to account |
| total_amount | number | BLOCK | `total` / 100 (cents) | ✅ | Convert from cents |
| currency | string | DEFAULT | `currency` | ✅ | |
| invoice_date | date | BLOCK | `created` | ✅ | Unix timestamp |
| due_date | date | BLOCK | `due_date` | ✅ | |
| status | enum | BLOCK | `status` | ✅ | draft, sent, paid, void, uncollectible |
| days_overdue | number | DERIVE | MAX(0, today - due_date) | ✅ | |
| aging_bucket | enum | DERIVE | days_overdue thresholds | ✅ | current, 30, 60, 90+ |
| payment_status | enum | DERIVE | Stripe paid field | ✅ | paid, partial, unpaid |
| dunning_stage | enum | DERIVE | Via payment + collections | ✅ | Stripe tracks this |
| line_items | array | ENRICH | `lines.data` | ✅ | **Rich line items** |
| rev_rec_amount | number | DERIVE | Via spine_revenue_recognition | ✅ | |
| purchase_order_number | string | ENRICH | Metadata `po_number` | ⚠️ | Needs manual entry |
| purchase_order_status | enum | ENRICH | Metadata `po_status` | ⚠️ | Needs manual entry |
| contract_reference | uuid | ENRICH | Metadata `contract_id` | ⚠️ | Needs contract connector |
| tax_document_attached | boolean | SIGNAL | N/A | ❌ | Would need document connector |
| revenue_recognized | boolean | SIGNAL | N/A | ❌ | Depends on rev rec config |

**Line Item Detail:**
```
Each line_item has:
  - description (product name / description)
  - quantity
  - unit_amount (in cents)
  - type (subscription, one_time, tax, discount, etc.)
  - proration (boolean, for adjustments)
```

**Mapping Status:** ✅ Core fields strong; optional fields need enhancement

**Action Items:**
1. Enable Stripe metadata for `po_number`, `po_status`, `contract_id`
2. Link contract management tool for `contract_reference`
3. Implement revenue recognition schedule (separate mapping)
4. Add document connector (e.g., Google Drive) for tax documents

---

### 4. NetSuite → Finance Domain

**Connector Handler:** `services/loader/src/handlers/netsuite.ts`

**Mapped EntityTypes:** `INVOICE`, `EXPENSE`, `PURCHASE_ORDER`, `REVENUE_RECOGNITION`

**Advantages over Stripe:**
- ✅ Multi-currency transactions
- ✅ Multi-entity ledger (departments, cost centers)
- ✅ Built-in revenue recognition rules
- ✅ Expense tracking with approval workflows
- ✅ Purchase order detail
- ✅ Tax compliance tracking

#### INVOICE Fields (NetSuite Invoice → spine_invoices)

| Spine Field | Null Policy | NetSuite Source | Status | Notes |
|-------------|-------------|-----------------|--------|-------|
| invoice_id | BLOCK | `id` | ✅ | |
| invoice_number | BLOCK | `tranid` | ✅ | Custom numbering |
| account_id | BLOCK | `customer.id` | ✅ | |
| total_amount | BLOCK | `total` | ✅ | Already in base currency |
| currency | DEFAULT | `currencyCode` | ✅ | |
| invoice_date | BLOCK | `trandate` | ✅ | |
| due_date | BLOCK | `duedate` | ✅ | |
| status | BLOCK | `status` | ✅ | |
| aging_bucket | DERIVE | Via due_date | ✅ | |
| payment_status | DERIVE | `amountpaid` vs `total` | ✅ | |
| dunning_stage | ENRICH | Via collections module | ✅ | NetSuite tracks this |
| line_items | ENRICH | `lineItems` array | ✅ | Detailed breakdown |
| rev_rec_amount | ENRICH | Via `revenue_arrangement` | ✅ | **Strong** |
| purchase_order_number | ENRICH | `purchaseorders` link | ✅ | **Linked natively** |
| contract_reference | ENRICH | Via `contracts` module | ✅ | **Linked natively** |
| tax_document_attached | SIGNAL | `attachments` array | ✅ | **Has attachments** |
| revenue_recognized | SIGNAL | Via rev rec schedule | ✅ | **Has schedules** |

**Advantages:**
- ✅ PO linkage built-in
- ✅ Contract linkage built-in
- ✅ Rev rec schedules natively supported
- ✅ Attachment tracking
- ✅ Multi-entity consolidation

**Action Items:**
1. Map all NetSuite revenue recognition schedules to spine_revenue_recognition
2. Enable attachment syncing for `tax_document_attached`
3. Configure PO and contract linkage

---

## Auditing Checklist

### For Each Connector Handler:

- [ ] **File exists:** `services/loader/src/handlers/[connector].ts`
- [ ] **Imports:** `import { normalize } from '../normalizer'`
- [ ] **Entity types supported:** Listed in handler
- [ ] **Field mapping:** CANONICAL_FIELDS mapping documented in code
- [ ] **Null policy enforcement:**
  - [ ] BLOCK fields checked (error if missing)
  - [ ] DERIVE fields never stored from connector (always null on input)
  - [ ] DEFAULT fields applied if null
  - [ ] ENRICH fields can be null
  - [ ] SIGNAL fields null preserved
- [ ] **Tests:** Unit tests for all field mappings
- [ ] **Error handling:** Graceful degradation (partial mapping OK)
- [ ] **Logging:** Debug logs for each field transformation

### For Each Entity Type:

- [ ] All BLOCK fields present in connector
- [ ] All DERIVE fields can be computed
- [ ] ENRICH fields gracefully null (don't break row)
- [ ] SIGNAL fields trigger UI prompts when null
- [ ] Metrics that depend on this entity can be computed

---

## Verification Scripts

### 1. Field Coverage Report

```bash
# Generate report: which fields are mapped per connector
./scripts/audit-connector-fields.sh --report

# Output:
# Connector    | Entity Type | Total Fields | Mapped | Coverage
# HubSpot      | DEAL        | 24           | 20     | 83%
# HubSpot      | ACCOUNT     | 20           | 17     | 85%
# Salesforce   | OPPORTUNITY | 24           | 24     | 100%
# ...
```

### 2. Null Policy Validation

```bash
# Check that all fields have null_policy assigned
./scripts/audit-null-policies.sh --validate

# Output:
# CANONICAL_FIELDS with null_policy:
#   BLOCK:   195 fields ✅
#   DERIVE:  78 fields ✅
#   DEFAULT: 21 fields ✅
#   ENRICH:  44 fields ✅
#   SIGNAL:  19 fields ✅
# Total:    357 fields ✅
```

### 3. Connector Handler Test

```bash
# Run all connector handler tests
npm test -- services/loader/src/handlers

# Verifies:
#   - HubSpot Deal mapping (20/24 fields)
#   - Salesforce Opportunity mapping (24/24 fields)
#   - Stripe Invoice mapping (18/22 fields)
#   - NetSuite Invoice mapping (20/20 fields)
#   - All null policies enforced
```

### 4. End-to-End Connector Sync

```bash
# Test full connector → Spine flow
./scripts/test-connector-sync.sh --connector hubspot --entity deal

# Verifies:
#   1. Connector API reachable
#   2. Sample payload fetched
#   3. Loader normalizes payload
#   4. Spine row inserted
#   5. Derived fields computed
#   6. Metrics can read from Spine
```

---

## Summary: Connector Readiness

| Phase | Connectors | Status | Gap Analysis |
|-------|-----------|--------|--------------|
| **P1** | HubSpot, Salesforce, Stripe, NetSuite | ✅ Core fields mapped | Need custom fields for legal, contract terms |
| **P1** | QuickBooks, AWS Billing | ⚠️ Partial | Need tax forms, rev rec |
| **P2** | Jira, GitHub, PagerDuty | ✅ Mapped | Need incident RCA detail |
| **P2** | Marketo, LinkedIn | ✅ Mapped | Need campaign ROI tracking |
| **P3** | Slack, Teams, Outlook | ✅ Mapped | Need message archive |
| **P3** | Zendesk, Intercom | ✅ Mapped | Need sentiment + csat |
| **P4** | Xano, Zapier, Segment | ⚡ Flexible | Custom entity mapping per use case |

**Next Steps:**
1. Run field coverage audit for each Phase 1 connector
2. Identify missing custom fields (legal, contract, support)
3. Create field mapping test suite
4. Validate 100% CANONICAL_FIELDS wired to Spine


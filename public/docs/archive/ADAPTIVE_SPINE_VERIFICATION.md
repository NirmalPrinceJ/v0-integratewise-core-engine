# Adaptive Spine Model Verification Guide


> **Tier C — Historical.** This document is a point-in-time snapshot preserved for reference. For current architecture, see [CANONICAL_PLATFORM_ARCHITECTURE.md](../architecture/CANONICAL_PLATFORM_ARCHITECTURE.md).

**Purpose:** Verify that the Spine deepens as tools are connected, without breaking UX or metrics  
**Principle:** System gracefully degrades (shallow → deep); never degrades  
**Status:** Verification Checklist & Test Scenarios  

---

## The Adaptive Model in One Diagram

```
Day 1 (Minimal):
  Account { id, name, domain, industry }
  ↓ metrics: [ ] (no data to compute)
  ↓ UI: "Connect Salesforce to unlock forecasting"

Day 2 (Connected Salesforce):
  Account { id, name, domain, industry, revenue, deal_count, arr_current, logo_status }
  ↓ metrics: [revenue_health, logo_risk, expansion_opportunity]
  ↓ UI: 3 new cards populated

Day 5 (Connected LinkedIn):
  Account { +employee_count, +funding_stage, +industry_peers }
  ↓ metrics: [+headcount_to_revenue_ratio, +growth_trajectory]
  ↓ UI: 2 new insights surfaced

Day 10 (Connected Slack + Support):
  Account { +slack_channel, +support_tickets, +nps_score, +csat }
  ↓ metrics: [+engagement_velocity, +support_health, +churn_risk]
  ↓ UI: 3 more intelligence cards

NO BREAKING CHANGES. No metrics broke. No UI crashed. Just depth.
```

---

## Adaptive Model Core Rules

### Rule 1: Never Break on Missing Data

**Principle:** If a field is null, the system doesn't error — it signals.

```typescript
// BAD (breaks on null)
const ratio = account.employee_count / account.revenue; // NaN if either null

// GOOD (graceful)
const ratio = account.employee_count && account.revenue 
  ? account.employee_count / account.revenue 
  : null; // metric inactive, not errored
```

**Implementation:**
- Metrics have `requires: ['employee_count', 'revenue']` array
- At compute time: if ANY required field is null, metric returns `{ status: 'inactive', reason: 'missing_fields', missing: ['employee_count'] }`
- Workspace shows: "Connect LinkedIn to enable headcount analysis"

---

### Rule 2: Metrics Activate Automatically

**Principle:** When a field hydrates, ALL metrics using that field activate automatically.

```typescript
// Example: Revenue/Headcount ratio metric

const METRIC_RHR = {
  id: 'M-SALES-02',
  name: 'Revenue per Employee',
  requires: ['revenue', 'employee_count'],
  formula: (account) => account.revenue / account.employee_count,
  active: (account) => !!account.revenue && !!account.employee_count
};

// Day 2: Active? NO (employee_count = null)
// Day 5: Active? YES (LinkedIn connected, field hydrated)
// NO CODE CHANGE NEEDED
```

**Implementation:**
- Metrics have `active()` predicate
- At query time, only active metrics computed
- Workspace auto-discovers new active metrics

---

### Rule 3: Shallow Spine is Valid

**Principle:** A tenant with 5 fields is not broken — just less intelligent.

```typescript
// Shallow account (valid)
const account = {
  id: 'acc-123',
  name: 'Acme Inc',
  domain: 'acme.com',
  industry: 'SaaS',
  created_date: '2024-01-01'
};

// Can query Spine? YES ✅
// Can compute health_score? NO — requires 8 fields
// Can render UI? YES — account card shows 5 fields, rest are "Connect tool" prompts
// Is Spine broken? NO — it's just shallow
```

**Implementation:**
- Workspace renders what exists
- For each null SIGNAL field, shows: "Connect [tool] to unlock [feature]"

---

### Rule 4: Adding Tools Doesn't Re-Normalize Old Data

**Principle:** Historical records stay as-is. New tools enrich forward.

```
Timeline:
  2024-01-01: Account created via HubSpot (5 fields hydrated)
  2024-01-15: Salesforce connected
              → New deals sync WITH hydrated fields
              → Old account record NOT updated (stays 5 fields)
              → Next sync cycle: Account enriched with Salesforce data
  2024-01-16: Account now has 12 fields (original 5 + 7 from Salesforce)
```

**Implementation:**
- Loader checks: "Does entity already exist in Spine?"
  - If YES: Merge new fields (nulls don't overwrite, new values do)
  - If NO: Insert full row
- Upsert logic: `INSERT OR UPDATE, SET field = COALESCE(new_value, old_value)`
- Result: Spine row grows over time, never shrinks

---

### Rule 5: SIGNAL Fields Guide the User

**Principle:** Null SIGNAL fields are not errors — they're prompts.

```typescript
// Example: slack_channel_linked = null

// Data layer:
{ slack_channel_linked: null }

// Workspace rendering:
<div className="prompt">
  <Icon name="slack" />
  <p>Connect Slack to enable real-time collaboration</p>
  <Button onClick={openIntegration}>Connect Slack</Button>
</div>
```

**Implementation:**
- Workspace queries all SIGNAL fields
- For each null SIGNAL, check if corresponding tool available
- Render prompt with:
  - Icon of tool
  - Value proposition
  - "Connect [tool]" button

---

## Verification Scenarios

### Scenario 1: New User (Day 1)

**Given:** User signs up, manually creates account

**Account State:**
```json
{
  "id": "acc-abc123",
  "name": "Acme Inc",
  "domain": "acme.com",
  "industry": "SaaS",
  "created_date": "2024-06-01",
  
  "deal_count": null,
  "arr_current": null,
  "employee_count": null,
  "logo_status": null,
  "health_score": null
}
```

**Verify:**
- ✅ Account queryable from Spine (SELECT * FROM spine_accounts WHERE id = 'acc-abc123')
- ✅ UI renders: Account name, domain, industry (3 cards)
- ✅ UI shows prompts: "Connect Salesforce", "Connect LinkedIn", etc.
- ✅ Metrics query returns: All metrics `{ status: 'inactive', missing: [...] }`
- ✅ Workspace doesn't crash

**Test Code:**
```typescript
test('Shallow account renders without breaking', async () => {
  const account = await spine.query('acc-abc123');
  expect(account).toBeDefined();
  expect(account.name).toBe('Acme Inc');
  expect(account.employee_count).toBeNull();
  
  const metrics = await intelligence.computeMetrics(account);
  const activeMetrics = metrics.filter(m => m.status === 'active');
  expect(activeMetrics.length).toBe(0); // All inactive
  
  const ui = await workspace.render(account);
  expect(ui).toContain('Connect Salesforce');
  expect(ui).not.toThrow();
});
```

---

### Scenario 2: User Connects Salesforce (Day 2)

**Given:** Day 1 account; user connects Salesforce

**Loader Action:**
1. Fetch account from Salesforce
2. Resolve CANONICAL_FIELDS: name, domain, employees, industry, revenue
3. Upsert spine_accounts: `UPDATE WHERE id = 'acc-abc123', SET revenue = 5000000, ...`

**New Account State:**
```json
{
  "id": "acc-abc123",
  "name": "Acme Inc",
  "domain": "acme.com",
  "industry": "SaaS",
  "created_date": "2024-06-01",
  
  "revenue": 5000000,
  "deal_count": 3,
  "arr_current": 4500000,
  "logo_status": "customer",
  "health_score": null,
  "employee_count": null
}
```

**Verify:**
- ✅ Existing fields preserved
- ✅ New fields hydrated
- ✅ Metrics that require revenue are NOW ACTIVE
- ✅ Metrics that require employee_count still inactive
- ✅ UI auto-discovers new active metrics (no page reload needed)
- ✅ No data loss or errors

**Test Code:**
```typescript
test('Salesforce connection hydrates fields without breaking', async () => {
  // Day 1 state
  let account = await spine.query('acc-abc123');
  expect(account.revenue).toBeNull();
  
  // Simulate Salesforce connector
  const sfAccount = { 
    name: 'Acme Inc', 
    revenue: 5000000, 
    deals: 3 
  };
  await loader.sync(sfAccount, 'SALESFORCE', 'account');
  
  // Day 2 state
  account = await spine.query('acc-abc123');
  expect(account.name).toBe('Acme Inc'); // Original preserved
  expect(account.revenue).toBe(5000000); // New hydrated
  
  // Metrics
  const metrics = await intelligence.computeMetrics(account);
  const activeMetrics = metrics.filter(m => m.status === 'active');
  expect(activeMetrics.length).toBeGreaterThan(0); // Now has active metrics
  
  // Specific metrics
  expect(metrics.find(m => m.id === 'M-SALES-01')?.status).toBe('active'); // Revenue-based metric
  expect(metrics.find(m => m.id === 'M-SALES-02')?.status).toBe('inactive'); // Needs employee_count
});
```

---

### Scenario 3: User Connects LinkedIn (Day 5)

**Given:** Day 2 account + Salesforce; user connects LinkedIn

**Loader Action:**
1. Fetch company from LinkedIn
2. Enrich with: employee_count, funding_stage, industry_peers
3. Upsert spine_accounts: `UPDATE WHERE id = 'acc-abc123', SET employee_count = 500, ...`

**New Account State:**
```json
{
  "id": "acc-abc123",
  "name": "Acme Inc",
  "domain": "acme.com",
  "industry": "SaaS",
  "created_date": "2024-06-01",
  
  "revenue": 5000000,
  "deal_count": 3,
  "arr_current": 4500000,
  "logo_status": "customer",
  "employee_count": 500,
  "funding_stage": "Series B",
  "health_score": null
}
```

**Verify:**
- ✅ All previous fields preserved
- ✅ LinkedIn fields hydrated (employee_count, funding_stage)
- ✅ Metrics that require employee_count NOW ACTIVE
- ✅ Revenue-per-employee metric activates
- ✅ UI discovers new metrics
- ✅ No errors, no rerenders needed (reactive update)

**Test Code:**
```typescript
test('LinkedIn connection adds new metrics without breaking', async () => {
  // Pre-LinkedIn
  let account = await spine.query('acc-abc123');
  expect(account.employee_count).toBeNull();
  
  const preMetrics = await intelligence.computeMetrics(account);
  const preActiveCount = preMetrics.filter(m => m.status === 'active').length;
  
  // Connect LinkedIn
  const linkedinCompany = { 
    name: 'Acme Inc',
    employee_count: 500
  };
  await loader.sync(linkedinCompany, 'LINKEDIN', 'company');
  
  // Post-LinkedIn
  account = await spine.query('acc-abc123');
  expect(account.employee_count).toBe(500);
  
  const postMetrics = await intelligence.computeMetrics(account);
  const postActiveCount = postMetrics.filter(m => m.status === 'active').length;
  
  expect(postActiveCount).toBeGreaterThan(preActiveCount); // More metrics active
  expect(metrics.find(m => m.id === 'M-SALES-02')?.status).toBe('active'); // Revenue/employee
});
```

---

### Scenario 4: Adaptive Metrics Don't Break

**Given:** Metrics formula depends on potentially-null fields

**Scenario:** Revenue/Headcount ratio metric

```typescript
// Metric definition
const REVENUE_PER_EMPLOYEE = {
  id: 'M-SALES-02',
  name: 'Revenue per Employee',
  formula: (account) => account.revenue / account.employee_count,
  requires: ['revenue', 'employee_count'],
  active: (account) => account.revenue && account.employee_count
};

// Day 1: Both null → Metric inactive
const day1 = { revenue: null, employee_count: null };
expect(REVENUE_PER_EMPLOYEE.active(day1)).toBe(false);
expect(intelligence.compute(REVENUE_PER_EMPLOYEE, day1)).toEqual({
  status: 'inactive',
  reason: 'missing_fields: revenue, employee_count'
});

// Day 2: Revenue hydrated, but employee_count still null → Still inactive
const day2 = { revenue: 5000000, employee_count: null };
expect(REVENUE_PER_EMPLOYEE.active(day2)).toBe(false); // One missing is enough
expect(intelligence.compute(REVENUE_PER_EMPLOYEE, day2)).toEqual({
  status: 'inactive',
  reason: 'missing_fields: employee_count'
});

// Day 5: Both hydrated → Now active
const day5 = { revenue: 5000000, employee_count: 500 };
expect(REVENUE_PER_EMPLOYEE.active(day5)).toBe(true);
expect(intelligence.compute(REVENUE_PER_EMPLOYEE, day5)).toEqual({
  status: 'active',
  value: 10000
});
```

**Verify:**
- ✅ Metric never throws error (handles null gracefully)
- ✅ Metric status transitions: inactive → active when fields hydrate
- ✅ UI prompts for missing fields
- ✅ Workspace shows metric value only when active

**Implementation:**
```typescript
// Safe metric computation
export function computeMetric(metric, account) {
  if (!metric.active(account)) {
    return {
      status: 'inactive',
      reason: `missing_fields: ${metric.requires.filter(f => !account[f]).join(', ')}`,
      missing: metric.requires.filter(f => !account[f])
    };
  }
  
  try {
    const value = metric.formula(account);
    return { status: 'active', value };
  } catch (e) {
    return { status: 'error', message: e.message };
  }
}
```

---

### Scenario 5: Cross-Domain Adaptive Model

**Given:** User connects Salesforce + Stripe + Zendesk

**Day 1 (Salesforce only):**
```
Account Spine:
  - sales fields hydrated (deals, arr, stage)
  - finance fields: null
  - support fields: null
  
Active Metrics:
  - M-SALES-01: Pipeline Health ✅
  - M-SALES-02: Revenue per Employee ❌ (needs headcount)
  - M-FINANCE-01: Revenue Forecast ❌ (needs invoice data)
  - M-SUPPORT-01: CSAT Trend ❌ (needs support data)
```

**Day 2 (+ Stripe):**
```
Account Spine:
  - sales fields hydrated
  - finance fields hydrated (invoices, revenue recognition)
  - support fields: null
  
Active Metrics:
  - M-SALES-01: Pipeline Health ✅
  - M-SALES-02: Revenue per Employee ❌ (still needs headcount)
  - M-FINANCE-01: Revenue Forecast ✅ (Stripe data ready)
  - M-SUPPORT-01: CSAT Trend ❌ (needs support)
```

**Day 5 (+ Zendesk):**
```
Account Spine:
  - sales fields hydrated
  - finance fields hydrated
  - support fields hydrated (tickets, csat, sentiment)
  
Active Metrics:
  - M-SALES-01: Pipeline Health ✅
  - M-SALES-02: Revenue per Employee ❌ (still needs headcount)
  - M-FINANCE-01: Revenue Forecast ✅
  - M-SUPPORT-01: CSAT Trend ✅
```

**Verify:**
- ✅ Adding Finance data doesn't break Sales metrics
- ✅ Adding Support data doesn't break Finance or Sales metrics
- ✅ Metrics activate independently (no cascading failures)
- ✅ Metrics can depend on fields from different domains
- ✅ UI smoothly transitions as new metrics become available

---

## Verification Checklist

### Pre-Launch Verification

- [ ] **Null Handling**
  - [ ] No metric throws error on null field
  - [ ] All metrics have `active()` predicate
  - [ ] All metrics have `requires: [...]` array
  - [ ] Inactive metrics shown as "insufficient data" in UI

- [ ] **Field Hydration**
  - [ ] Upsert logic correctly merges fields
  - [ ] Nulls don't overwrite existing values
  - [ ] New tools enrich forward (don't re-normalize history)
  - [ ] Field hydration doesn't break queries

- [ ] **Metric Activation**
  - [ ] Metrics activate when all required fields present
  - [ ] Metrics deactivate if ANY required field becomes null
  - [ ] UI discovers new active metrics without reload
  - [ ] Metric value doesn't cache (always fresh)

- [ ] **UI Graceful Degradation**
  - [ ] Workspace renders 0 active metrics (shallow account)
  - [ ] Workspace renders 10+ active metrics (deep account)
  - [ ] "Connect tool" prompts appear for null SIGNAL fields
  - [ ] Cards don't show broken data (empty instead of NaN)

- [ ] **Cross-Domain Integration**
  - [ ] Sales + Finance metrics don't interfere
  - [ ] CSM + Support metrics don't interfere
  - [ ] Metrics from different domains can depend on same entity

- [ ] **Error Handling**
  - [ ] Partial connector sync doesn't break Spine
  - [ ] Type mismatches handled gracefully
  - [ ] Connector errors don't cascade to metrics
  - [ ] Normalizer rejects bad data, not entire row

---

## Test Suite

### Unit Tests (Adaptive Core)

```typescript
describe('Adaptive Spine Model', () => {
  it('should compute metric with all fields', () => { ... });
  it('should mark metric inactive if any required field null', () => { ... });
  it('should not throw error on null field', () => { ... });
  it('should update field without overwriting existing', () => { ... });
  it('should activate metric when field hydrates', () => { ... });
});
```

### Integration Tests (Full Flow)

```typescript
describe('Full Connector → Metric Flow', () => {
  it('should render shallow account without error', () => { ... });
  it('should hydrate fields on connector sync', () => { ... });
  it('should activate metrics as fields hydrate', () => { ... });
  it('should not break existing metrics on new tool', () => { ... });
});
```

### E2E Tests (Real User Journey)

```typescript
describe('Real User Adaptive Journey', () => {
  it('should handle Day 1→2→5 scenario', async () => { ... });
  it('should work across 12 domains', async () => { ... });
  it('should maintain data integrity over 30 days', async () => { ... });
});
```

---

## Implementation Checklist

- [ ] Metrics have `active()` predicate ← **CRITICAL**
- [ ] Metrics have `requires: [...]` array ← **CRITICAL**
- [ ] Normalizer upsert uses `COALESCE(new, old)` ← **CRITICAL**
- [ ] Workspace queries active metrics only
- [ ] Workspace renders SIGNAL prompts for nulls
- [ ] Intelligence layer doesn't error on null
- [ ] Loader enriches forward (doesn't re-normalize)
- [ ] All tests pass (unit + integration + E2E)

---

## Summary

**The Adaptive Model guarantees:**

✅ Shallow Spine is valid (not broken)  
✅ Deep Spine has rich intelligence (without rewriting code)  
✅ Adding tools never breaks existing functionality  
✅ Metrics activate independently (no cascading)  
✅ UI degrades gracefully (no crashed cards)  
✅ Data integrity maintained (never loses fields)  

**Result:** Tenants can start with 5 fields and grow to 50. Intelligence grows with them. No code changes. No migration scripts. Just depth.


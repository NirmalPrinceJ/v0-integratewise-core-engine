# Entity360 V2 — Cross-Tool Rich Composition Model

> **Status:** Canonical data model  
> **Date:** July 12, 2026  
> **Authority:** Nirmal (Founder)  
> **Canonical Reference:** [CANONICAL_PLATFORM_ARCHITECTURE.md](./CANONICAL_PLATFORM_ARCHITECTURE.md)  
> **Reconciles:** Document 1 (flat Entity360) and Document 3 (cross-tool rich Entity 360)  
> **Cross-Reference:** [PLANE_LAYER_CROSS_REFERENCE.md](./PLANE_LAYER_CROSS_REFERENCE.md)

---

## The Problem

Two Entity360 models exist:

1. **Document 1 (Flat Struct):**

```typescript
interface Entity360 {
  id: string;
  type: string;
  tenantId: string;
  properties: Record<string, unknown>;
  traits: Trait[];
  timeline: TimelineEvent[];
  projections: ProjectedView[];
  provenance: ProvenanceRecord[];
}
```

2. **Document 3 (Rich Cross-Tool):**
   > "CRM account fields + Support ticket history + Product usage deltas + Billing status + Recent communication + Project milestones + Renewal memory + Relevant decisions + Authorized capabilities."

The flat struct cannot support the richness described in Document 3. The rich model needs a structured composition that preserves type safety while supporting lazy loading.

---

## The Unified Model

```typescript
// ═══════════════════════════════════════════════════════════════
// ENTITY360 V2 — Canonical Cross-Tool Entity Model
// ═══════════════════════════════════════════════════════════════

interface Entity360 {
  // ─── Core Identity (always present, always fast) ──────────
  id: string;
  type: CanonicalEntityType;
  tenantId: string;
  createdAt: string;
  updatedAt: string;

  // ─── Flat Properties (fast lookup, always loaded) ─────────
  properties: Record<string, unknown>;

  // ─── Traits (behavioral characteristics) ──────────────────
  traits: Trait[];

  // ─── Timeline (temporal events) ───────────────────────────
  timeline: TimelineEvent[];

  // ─── Provenance (source tracking) ─────────────────────────
  provenance: ProvenanceRecord[];

  // ─── Cross-Tool Composition (lazy-loaded per Workbench) ───
  composition?: EntityComposition;

  // ─── Governance (authority and sync) ──────────────────────
  governance: EntityGovernance;
}

// ═══════════════════════════════════════════════════════════════
// COMPOSITION — Lazy-loaded cross-tool views
// ═══════════════════════════════════════════════════════════════

interface EntityComposition {
  // Each view is loaded only when the Workbench needs it
  crm?: CrmEntityView;
  support?: SupportEntityView;
  billing?: BillingEntityView;
  product?: ProductEntityView;
  communication?: CommunicationEntityView;
  projects?: ProjectEntityView;
  engineering?: EngineeringEntityView;
  finance?: FinanceEntityView;
  hiring?: HiringEntityView;
  legal?: LegalEntityView;
  operations?: OperationsEntityView;

  // Cross-tool relationships
  relationships?: EntityRelationship[];

  // Memory and decisions
  memory?: MemoryEntityView;
  decisions?: DecisionEntityView;

  // Available capabilities
  capabilities?: CapabilityView[];
}

// ═══════════════════════════════════════════════════════════════
// TOOL-SPECIFIC VIEWS — Typed per provider
// ═══════════════════════════════════════════════════════════════

interface CrmEntityView {
  provider: "salesforce" | "hubspot" | "pipedrive" | "zoho";
  accountId?: string;
  contacts?: ContactSummary[];
  opportunities?: OpportunitySummary[];
  activities?: ActivitySummary[];
  healthScore?: number;
  lastActivity?: string;
  customFields?: Record<string, unknown>;
}

interface SupportEntityView {
  provider: "zendesk" | "intercom" | "freshdesk" | "servicenow";
  tickets?: TicketSummary[];
  openTickets?: number;
  avgResolutionTime?: number;
  satisfactionScore?: number;
  escalations?: EscalationSummary[];
  lastTicket?: string;
}

interface BillingEntityView {
  provider: "stripe" | "chargebee" | "zuora" | "quickbooks";
  mrr?: number;
  arr?: number;
  subscriptionStatus?: string;
  nextBillingDate?: string;
  invoices?: InvoiceSummary[];
  paymentFailures?: number;
  lifetimeValue?: number;
}

interface ProductEntityView {
  provider: "amplitude" | "mixpanel" | "segment" | "posthog";
  activeUsers?: number;
  featureUsage?: FeatureUsageSummary[];
  adoptionRate?: number;
  churnRisk?: number;
  lastActivity?: string;
  usageTrend?: TrendSummary;
}

interface CommunicationEntityView {
  provider: "slack" | "email" | "teams" | "discord";
  recentConversations?: ConversationSummary[];
  sentiment?: SentimentSummary;
  responseTime?: number;
  openThreads?: number;
  keyMentions?: MentionSummary[];
}

interface ProjectEntityView {
  provider: "jira" | "asana" | "linear" | "github";
  activeIssues?: IssueSummary[];
  milestones?: MilestoneSummary[];
  velocity?: number;
  blockers?: IssueSummary[];
  lastDeploy?: string;
  sprintProgress?: SprintSummary;
}

// ═══════════════════════════════════════════════════════════════
// RELATIONSHIPS — Cross-tool entity links
// ═══════════════════════════════════════════════════════════════

interface EntityRelationship {
  id: string;
  sourceEntityId: string;
  targetEntityId: string;
  type: RelationshipType;
  source: string; // which tool created this relationship
  confidence: number; // how certain is this link
  properties?: Record<string, unknown>;
}

type RelationshipType =
  | "owns" // Account owns Contact
  | "has_ticket" // Account has Support Ticket
  | "has_invoice" // Account has Invoice
  | "uses_product" // Account uses Product
  | "communicates" // Account communicates via Channel
  | "works_on" // Account works on Project
  | "decided" // Account made Decision
  | "related_to" // Generic relationship
  | string; // Extensible

// ═══════════════════════════════════════════════════════════════
// MEMORY AND DECISIONS — Organizational continuity
// ═══════════════════════════════════════════════════════════════

interface MemoryEntityView {
  keyDecisions?: DecisionSummary[];
  contextNotes?: NoteSummary[];
  renewalMemory?: RenewalMemory;
  riskSignals?: RiskSignal[];
  opportunities?: OpportunitySignal[];
}

interface DecisionEntityView {
  recentDecisions?: DecisionSummary[];
  pendingDecisions?: DecisionSummary[];
  decisionTrail?: DecisionTrailEntry[];
}

// ═══════════════════════════════════════════════════════════════
// CAPABILITIES — What can be done with this entity
// ═══════════════════════════════════════════════════════════════

interface CapabilityView {
  capabilityId: string;
  name: string;
  description: string;
  available: boolean; // is this capability available for this entity?
  requiresApproval: boolean;
  estimatedImpact: string;
}

// ═══════════════════════════════════════════════════════════════
// GOVERNANCE — Authority and sync policy
// ═══════════════════════════════════════════════════════════════

interface EntityGovernance {
  sourceOwnership: string; // which tool owns the canonical source
  writeAuthority: string; // who can write to this entity
  syncPolicy: SyncPolicy;
  consumerScope: string[]; // which Workbenches can consume this
}

interface SyncPolicy {
  mode: "immediate" | "deferred" | "batch" | "scheduled" | "event-driven";
  interval?: string; // for scheduled mode
  lastSync?: string;
  nextSync?: string;
  pendingMutations?: number;
}
```

---

## How Composition Loading Works

### 1. Workbench Requests Entity360

```
User opens Account Success Workbench
  → Selects account "Acme Corp"
  → Workbench requests Entity360 for Acme Corp
```

### 2. Core Entity Loaded (Fast)

```typescript
// Always loaded — flat properties + traits + timeline
const entity = await spine.getEntity360("acct_123");
// entity.properties = { name: "Acme Corp", industry: "SaaS", ... }
// entity.traits = [...]
// entity.timeline = [...]
```

### 3. Composition Loaded Based on Workbench Role

```typescript
// Role: CSM → loads CRM, Support, Billing, Communication views
const composition = await spine.loadComposition("acct_123", {
  role: "csm",
  department: "customer_success",
  activeContext: "renewal_review",
});

// composition.crm = { provider: 'salesforce', healthScore: 82, ... }
// composition.support = { openTickets: 3, satisfactionScore: 4.2, ... }
// composition.billing = { mrr: 12000, subscriptionStatus: 'active', ... }
```

### 4. Lazy Loading by Need

```typescript
// If user clicks into Product Usage tab
const productView = await spine.loadCompositionView("acct_123", "product");
// composition.product = { activeUsers: 45, adoptionRate: 0.72, ... }
```

### 5. Cross-Tool Relationships Resolved

```typescript
// Relationships are resolved during Creamy Load / Delta Load
const relationships = await spine.getRelationships("acct_123");
// [
//   { type: 'has_ticket', target: 'tkt_456', source: 'zendesk' },
//   { type: 'has_invoice', target: 'inv_789', source: 'stripe' },
//   { type: 'uses_product', target: 'prod_012', source: 'amplitude' },
// ]
```

---

## Workbench Composition Example

### Customer Success Workbench for "Acme Corp"

```typescript
const workbench = await composeWorkbench({
  entity: 'acct_123',
  role: 'csm',
  department: 'customer_success',
  activeContext: 'q3_renewal_review',
});

// Result:
{
  // Core entity
  entity: { id: 'acct_123', type: 'ACCOUNT', properties: { name: 'Acme Corp', ... } },

  // Composed views (loaded based on role)
  composition: {
    crm: { healthScore: 82, lastActivity: '2026-07-10', contacts: [...] },
    support: { openTickets: 3, avgResolutionTime: '4.2h', escalations: [...] },
    billing: { mrr: 12000, nextBillingDate: '2026-08-01', invoices: [...] },
    communication: { sentiment: 'positive', recentConversations: [...] },
    memory: { keyDecisions: [...], renewalMemory: { renewalDate: '2026-09-15', riskLevel: 'medium' } },
    decisions: { recentDecisions: [...], pendingDecisions: [...] },
    capabilities: [
      { capabilityId: 'cs.renewal draft', name: 'Draft Renewal Proposal', available: true },
      { capabilityId: 'cs.escalation create', name: 'Create Escalation', available: true },
      { capabilityId: 'cs.email send', name: 'Send Follow-up Email', available: true, requiresApproval: true },
    ],
  },

  // Relationships
  relationships: [
    { type: 'has_ticket', target: 'tkt_456', source: 'zendesk' },
    { type: 'has_invoice', target: 'inv_789', source: 'stripe' },
  ],

  // Governance
  governance: {
    sourceOwnership: 'salesforce',
    writeAuthority: 'csm_team',
    syncPolicy: { mode: 'deferred' },
    consumerScope: ['customer_success', 'finance', 'executive'],
  },
}
```

---

## Migration Path

### Phase 1: Backward Compatibility (Current)

- Document 1's flat Entity360 continues to work
- `composition` field is optional (undefined = not loaded)
- Existing services consume `properties` as before

### Phase 2: Composition Loading

- Implement `loadComposition()` in spine service
- Add composition views per tool provider
- Workbench components consume composition

### Phase 3: Rich Cross-Tool

- Implement relationship resolution during Creamy/Delta Load
- Add memory and decision views
- Add capability views per entity

### Phase 4: Full Network Effect

- Implement cross-tool entity resolution
- Add conflict detection for cross-tool writes
- Implement Spine Network Effect (N × M → T)

---

## Implementation Priorities

1. **P0:** Define Entity360 V2 interface (this document)
2. **P1:** Implement composition loading in spine service
3. **P1:** Define tool-specific view types (CRM, Support, Billing, etc.)
4. **P2:** Implement lazy loading in Workbench components
5. **P2:** Implement relationship resolution during load
6. **P3:** Implement cross-tool entity resolution
7. **P3:** Implement conflict detection for cross-tool writes

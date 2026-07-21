# Missing Canonical Services Implementation Guide

> **Status: PROPOSED**
>
> **Approved: NO**
>
> **Execution Authority: NONE**
>
> **Evidence Authority: `POST_STOP_FORENSIC_RECONCILIATION.md`**

**Original Status Claim**: Services identified as missing during canonical restoration audit — **UNAPPROVED PROPOSAL**  
**Original Impact Claim**: Customer Zero activation is blocked on these implementations — **NOT VERIFIED AS AN EXECUTION PREREQUISITE**

---

## Missing Service 1: spine-writer

**Purpose**: Canonical write path for the Operational Spine  
**Current Workaround**: `integratewise-pipeline` may be handling writes (legacy role)  
**Required Inputs**:

- Entity mutations from workflows, actions, decisions
- Spine schema (entity types, relationships)
- D1 database connection for canonical writes
- Continuity event publishing for audit

**Required Outputs**:

- Successful write confirmation (entity_id, version, timestamp)
- Continuity record created for recovery
- Timeline event published
- Cache invalidation for dependents

**Implementation Steps**:

1. Create `services/spine-writer/src/index.ts`
2. Implement entity write handler (POST /entities)
3. Connect to D1 Spine database
4. Publish continuity events
5. Deploy as `integratewise-spine-writer`

---

## Missing Service 2: governance

**Purpose**: Policy evaluation, approval chains, governance decisions  
**Current Workaround**: `integratewise-govern` (wrong name) may have partial logic  
**Required Inputs**:

- Capability proposal or action request
- Policy configuration for tenant
- User/role context
- Historical decision records

**Required Outputs**:

- Governance decision (approved, rejected, requires_approval)
- Approval record created
- Policy audit trail

**Implementation Steps**:

1. Create `services/governance/src/index.ts` (note: correct spelling)
2. Load tenant policies from policy store
3. Evaluate against capability request
4. Route to approval chain if needed
5. Deploy as `integratewise-governance`

**Note**: Rename or deprecate `integratewise-govern` to avoid naming conflict.

---

## Missing Service 3: schema-synthesis

**Purpose**: AI-driven schema inference and generation  
**Current Workaround**: None (critical gap)  
**Required Inputs**:

- Raw data samples (JSON, CSV, unstructured)
- Existing schema patterns (for similarity detection)
- User hints or type guidance

**Required Outputs**:

- Inferred schema (entity types, field mappings, relationships)
- Confidence scores
- Schema validation rules

**Implementation Steps**:

1. Create `services/schema-synthesis/src/index.ts`
2. Integrate HuggingFace inference for schema generation
3. Store inferred schemas in store service
4. Cache common patterns
5. Deploy as `integratewise-schema-synthesis`

---

## Missing Service 4: huggingface-inference

**Purpose**: Inference endpoint for AI model calls  
**Current Workaround**: Calls may be routed directly to HuggingFace (no abstraction)  
**Required Inputs**:

- Model ID (from HuggingFace)
- Input prompt or data
- Parameters (temperature, max_tokens, etc.)

**Required Outputs**:

- Model output (text, embeddings, predictions)
- Inference latency
- Token usage for billing

**Implementation Steps**:

1. Create `services/huggingface-inference/src/index.ts`
2. Implement model inference handler
3. Support multiple model types (text generation, embeddings, classification)
4. Add caching layer for common queries
5. Deploy as `integratewise-huggingface-inference`

---

## Timeline to Full Canonical Readiness

| Service               | Effort | Priority | Dependency                    |
| --------------------- | ------ | -------- | ----------------------------- |
| spine-writer          | Medium | Critical | Needed for entity mutations   |
| governance            | Medium | High     | Needed for approval chains    |
| schema-synthesis      | High   | Medium   | Needed for schema AI features |
| huggingface-inference | Low    | High     | Needed for all inference      |

**Estimated total**: 3–5 days for all four services

---

## Customer Zero Activation Can Begin With:

- 12 deployed canonical services (currently live)
- Basic workflow execution (without governance approval chain)
- Data normalization and querying (without schema synthesis)
- Inference calls routed directly or through adapter

**Full feature parity requires all 18 services.**

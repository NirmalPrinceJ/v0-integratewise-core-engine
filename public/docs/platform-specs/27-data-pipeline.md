# 27 — Data Pipeline

> **Extracted from:** IntegrateWise Platform Specification Suite
> **Region:** third_region
> **Original line:** 3281
> **Lines:** 49 | **Chars:** 1,946
> **Status:** Raw extraction — requires review and canonicalization

27 — Data Pipeline
27.1 Pipeline (preserves user’s ASCII)
CopyIngestion
↓
Normalization
↓
Validation
↓
Deduplication
↓
Canonical Mapping
↓
Enrichment
↓
Projection
↓
Storage
27.2 Responsibilities
Run the pipeline for every Connector Delta (08), Memory intake (07), and Knowledge import (07/L8).
Idempotency keyed on (source, source*record_id, observed_at, hash).
Strict stage ordering; failure of one stage quarantines the artifact (DLQ).
27.3 Inputs
ConnectorDeltaReceived, MemoryIntake, KnowledgeImportRequested, admin batch uploads.
27.4 Outputs
Canonical Spine updates (02) + Signal side-effects (10) + Memory write-backs (07).
27.5 Events produced
PipelineStarted, PipelineStageCompleted, PipelineStageFailed, PipelineCompleted, PipelineDuplicateDetected, PipelineEnrichmentApplied, PipelineAborted.
27.6 Events consumed
ConnectorDeltaReceived, MemoryIntake, KnowledgeImportRequested, EntityTypeRegistered.
27.7 APIs
POST /pipeline/run, GET /pipeline/runs/{pipe_id}, POST /pipeline/dlq/{item_id}/replay.
27.8 Stage definitions
Ingestion: parse vendor payload; schema check.
Normalization: apply tenant_spine_config.field_extensions, normalize dates/currency.
Validation: cross-field, cross-entity (12).
Deduplication: hash + semhash; resolve via Spine ?as_of.
Canonical Mapping: map to ent* via 12 inheritance.
Enrichment: Signals (10) may attach; capability cap_enrich_x may run pre-storage.
Projection: build per-persona projection shape (04).
Storage: write to Spine (02); archive snapshot to R2.
27.9 State transitions
received → ingested → normalized → validated → deduped → mapped → enriched → projected → stored. Failure path: … → DLQ. Replay path: DLQ → received.

27.10 Failure handling
Stage failure → stop, retry policy per stage (configurable), finally DLQ.
DLQ item presents replay UI in Workbench under Pipeline Admin.
27.11 Extension points
Custom pipeline steps via PIPELINE_STEP(name).
Custom canonical mappers MAPPER(name).

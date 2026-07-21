# 26 — Search Engine

> **Extracted from:** IntegrateWise Platform Specification Suite
> **Region:** third_region
> **Original line:** 3235
> **Lines:** 46 | **Chars:** 1,756
> **Status:** Raw extraction — requires review and canonicalization

26 — Search Engine
26.1 Pipeline (preserves user’s ASCII)
CopySearch (request)
↓
Spine
Memory
Knowledge
Connector Search
Conversation Search
Semantic Search
Hybrid Ranking
26.2 Responsibilities
Provide Universal Search (P-1) and Command Palette (P-2).
Index and search across Spine (02), Memory (07), Knowledge (07/L8), Connector indexes (per-vendor), Conversations (06), plus semantic vectors and lexical indexes.
Compose results with hybrid ranker.
26.3 Inputs
User search request, contextual triggers (selected entity, screen state).
26.4 Outputs
Ranked result set with provenance (every item carries provenance[] per 02).
Highlight spans.
26.5 Index kinds
Index Source Type
idx_spine Spine entities lexical + vector
idx_mem_l1 Twin conversations vector
idx_mem_l7 Organizational Memory lexical + vector
idx_knw Knowledge articles lexical + vector
idx_conn Connector feeds lexical
idx_conv Twin transcripts lexical + vector
26.6 Events produced
IndexBuilt, IndexIncremented, IndexInvalidated, SearchExecuted, SearchResultClicked.
26.7 Events consumed
EntityUpdated, MemoryApproved, KnowledgeArticlePublished, ConnectorSynced, TwinResponded.
26.8 APIs
POST /search, GET /search/{idx_id}/status, POST /search/{idx_id}/rebuild.
26.9 State transitions
Per index: cold → warming → warm → degraded → cold. Per query: received → planning → fused → ranked → served.

26.10 Hybrid ranking
Reciprocal Rank Fusion across lexical (BM25) + vector (cosine) + recency + persona boost.
Persona boost via 06; tenant admin can override weights.
26.11 Failure handling
Index unreachable → serve last good snapshot with degraded badge.
Vector index down → fall back to lexical only.
26.12 Extension points
Custom ranking models RANKER(name).
Custom indexers INDEXER(name).

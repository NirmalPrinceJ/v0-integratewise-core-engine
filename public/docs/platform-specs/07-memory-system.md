# 07 — Memory System

> **Extracted from:** IntegrateWise Platform Specification Suite
> **Region:** first_pass
> **Original line:** 893
> **Lines:** 36 | **Chars:** 1,752
> **Status:** Raw extraction — requires review and canonicalization

07 — Memory System
7.1 Responsibilities
Own the 8-layer memory pipeline (already defined in existing spec).
Bind three-axis separation: Spine (truth), Memory (meaning), Knowledge (docs).
Operate the Promotion Queue as the human-in-the-loop gate.
7.2 The eight layers (preserved and made deterministic)
CopyL1 Twin Memory — conversational working memory (ephemeral, ≤10 turns)
L2 Memory Intake — raw observations, immutable for 24h
L3 Triage Bot — classification (fact | decision | observation | relationship | noise)
L4 Memory Evolution — pattern detection (cluster, dedupe, propose promotion)
L5 Promotion Queue — staging surface (single most important screen)
L6 Human Approval — gating event (MemoryApproved | MemoryRejected)
L7 Organizational Memory — durable, indexed, queryable
L8 Knowledge — SOPs, playbooks, runbooks (curated from L7 + human authored)
7.3 Inputs
TwinMemoryIntake events (from 06).
Manual memory creation (Admin).
Knowledge imports (Markdown, Docs).
7.4 Outputs
Promotion Queue items.
L7 search hits (mem.search(“…”)).
Knowledge article refs.
7.5 Events
Produced: MemoryTriaged, MemoryPromoted, MemoryApproved, MemoryRejected, MemoryDeprecated, KnowledgeArticlePublished.
Consumed: TwinMemoryIntake, EntityUpdated (to evolve), AdminMemoryEdited.
7.6 APIs
POST /memory/intake, GET /memory/promotion-queue, POST /memory/{mem_id}/approve, POST /memory/{mem_id}/reject, GET /memory/search.
7.7 State transitions
intake → triaged → cluster → queued_for_promotion → approved | rejected → deprecated.

7.8 Failure handling
Triage bot mis-classifies → user may re-tag (human-in-the-loop).
Stuck queue → admin SLA alert (16).
7.9 Extension points
Custom Triage Bot rules.
Custom Evolution patterns.

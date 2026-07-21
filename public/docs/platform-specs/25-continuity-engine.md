# 25 — Continuity Engine

> **Extracted from:** IntegrateWise Platform Specification Suite
> **Region:** third_region
> **Original line:** 3179
> **Lines:** 56 | **Chars:** 2,682
> **Status:** Raw extraction — requires review and canonicalization

25 — Continuity Engine
25.1 Why this doc exists
The original spec references the “Continuity Bridge” but does not define it. The Continuity Engine subsumes that concept and elevates it to a first-class subsystem.

25.2 Responsibilities
Context assembly.
Session continuity.
Cross-device, cross-model, cross-workspace continuity.
Context compaction, memory hydration, context prioritization.
25.3 Continuity surfaces
Surface What must be continuous
Session current Twin conversation state (L1)
Cross-device active session survives device switch
Cross-model switch vendor/model mid-session without losing intent
Cross-workspace switching wsp* → wsp* keeps task context
Cross-temporal as-of queries are intrinsic to Spine reads
25.4 Pipeline
CopyContext Triggers (07 event, 06 screen state, 22 cache hit, 04 projection, 02 timeline)
↓
Context Assembler (assembles ordered fragments, applies priority)
↓
Memory Hydrator (pulls relevant L1+L7 hits per fragment)
↓
Compactor (only when budget exceeded)
↓
Context Pack (consumed by 06 prompt builder and 05 capability resolver)
25.5 Inputs
TwinContextBuilt triggers, WorkspaceSwitched, ModelRouted, MemoryApproved, EntityUpdated (for context-bearing entities).
25.6 Outputs
ContextPack attached to every TwinResponded, and to every capability invocation that requires tenant-wide awareness.
25.7 Events produced
ContextAssembled, ContextCompacted, ContextHydrated, ContextPrioritized, ContinuityBridgeActivated, ContinuityBridgeDeactivated.
25.8 Events consumed
WorkspaceSwitched, ModelRouted, EntityUpdated (subset bearing relevance), MemoryApproved, TwinContextBuilt.
25.9 APIs
POST /continuity/assemble, GET /continuity/context/{session_id}, POST /continuity/compact, POST /continuity/hydrate.
25.10 State transitions
empty → assembling → hydrating → compacting? → assembled → consumed → purged. Bridge state: cold → warm → hot → cold.

25.11 Priorities (canonical order)
Persona-bind (industry × department × sub-role).
Workspace module set.
Active screen state (Projection — 04).
Last 10 Twin turns (L1).
Recent Entity updates relevant to screen.
L7 promotion queue items pending approval.
Capabilities restricted by persona.
25.12 Compaction
Token budget exhausted → summarize older turns via 22; never drop pinned Memory.
Compaction log emitted as ContextCompacted with reduction_ratio.
25.13 Failure handling
Memory Lookup timeout → continue with degraded pack, badge “Partial context”.
Cross-device state divergence → resolve via Spine timestamp; last write wins for non-pinned; pinned fields stay.
25.14 Extension points
Custom priority rules CONTINUITY_PRIORITY(name).
Custom compacters COMPACTOR(name).

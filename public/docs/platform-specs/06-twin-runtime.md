# 06 — Twin Runtime

> **Extracted from:** IntegrateWise Platform Specification Suite
> **Region:** first_pass
> **Original line:** 835
> **Lines:** 58 | **Chars:** 2,236
> **Status:** Raw extraction — requires review and canonicalization

06 — Twin Runtime
6.1 Responsibilities
Drive the OODA loop for the user-facing Twin.
Compose context, prompt, persona grammar, evidence, tool calls, capability selections.
Calibrate confidence and produce proposals.
6.2 Flow
CopyUser input / screen-state
↓
Context Builder (Continuity Bridge, persona, screen)
↓
Memory Retrieval (07; meant to L1–L7)
↓
Evidence Ranking (02; evd\_ refs sorted by recency + relevance)
↓
Prompt Builder (Persona Grammar)
↓
LLM call (Cloudflare AI Gateway, plumbed provider)
↓
Tool selection (resolve capability or read-only spineRead)
↓
Confidence calibration (cap.confidenceThreshold)
↓
Proposal generation (cap.governancePolicy == propose)
↓
Twin response (Message Object: blocks, evidence, snapshots, actions)
6.3 Persona Grammar (canonical names already in existing spec)
Maya (Sales) — terse, action-oriented.
Sana (CS) — cautious, evidence-heavy.
Tomás (Engineering) — diagnostic.
…(others inherited from existing spec).
Grammar is configuration in tenant_spine_config.persona_grammar_ref.

6.4 Activation gate (safety invariant)
Pre-existing “evaluateActivation” from existing spec preserved.
Additional checks: minimum memory depth (L7 has at least one approved item), governance posture set, Continuity Bridge non-empty.
6.5 Inputs
User chat / surface action.
Screen-state projection (04).
Continuity Bridge context.
6.6 Outputs
Message Object per existing spec.
Capability invocations (05).
Memory intakes (07 → L1).
6.7 Events
Produced: TwinResponded, TwinProposing, TwinContextBuilt, TwinMemoryIntake.
Consumed: every Projection/Stale from 04, every Memory Approve/Reject from 07, every Governance Decision from 09.
6.8 APIs
POST /twin/chat, POST /twin/propose, GET /twin/messages/{msg_id}.
6.9 State transitions (per turn)
received → building → proposing | executing → responded → archived.

6.10 Failure handling
LLM timeout → degrade to “Last Good Answer” projection; mark TwinResponded(stale=true).
Persona Grammar missing → fallback to neutral; warn.
Memory retrieval empty → operation continues with explicit “no prior context” chip.
6.11 Extension points
Custom persona grammar via twin.grammar package.
Custom tool resolvers.

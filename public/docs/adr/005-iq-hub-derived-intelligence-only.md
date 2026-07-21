# ADR-005: IQ Hub Stores Derived Intelligence Only

**Status:** Accepted  
**Date:** 2026-07-21  
**Deciders:** Nirmal (Founder)

---

## Context

The IQ Hub (knowledge, intelligence, signals services) needs to store derived context: topic summaries, learnings, embeddings, signal analysis. If it also stored canonical operational state, the boundary between "fact" and "inference" would blur.

## Decision

The IQ Hub stores **only derived intelligence**: topic summaries, learnings, conversation summaries, embeddings, signal analysis, and recommendations. It **never stores canonical operational state** (entities, relationships, activities).

Canonical state lives in the Adaptive Spine. IQ Hub reads from Spine and writes derived context to its own stores (Vectorize, D1 knowledge tables).

## Consequences

- **Positive:** Clean separation between facts and inferences. IQ Hub can be rebuilt from Spine without data loss.
- **Negative:** Two storage systems to maintain. IQ Hub reads are eventually consistent with Spine.
- **Mitigation:** Provenance tracking in SharedWorkbench timestamps show when each layer was last read.

## Evidence

- `services/knowledge/` — Vectorize embeddings, D1 knowledge tables
- `services/intelligence/` — Signal analysis, recommendations
- `contracts/shared-workbench/v1.ts` — `memory`, `knowledge`, `signals` are derived fields

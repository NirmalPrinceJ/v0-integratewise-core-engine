# IntegrateWise Doctrine

These documents keep four things deliberately separate:

1. **Experience** — the feeling that a person's work already knows its context, AI has prepared the hard parts, and the person decides.
2. **Product** — the role-composed IntegrateWise User Workbench that delivers that experience.
3. **Platform** — continuity infrastructure for connected human and AI work.
4. **Access and distribution** — IW-Continuity-Bridge, which makes bounded platform capabilities available in approved entry points.

Read them in order:

- [00 — Layer model](00-layer-model.md)
- [01 — Product doctrine](01-product-doctrine.md)
- [02 — Platform doctrine](02-platform-doctrine.md)
- [03 — Continuity and context-boundary contract](03-continuity-contract.md)
- [04 — Distribution and access doctrine](04-distribution-access-doctrine.md)

The implementation chain is fixed:

`WorkbenchContextEvent → Context Observer → IW-Continuity-Bridge → ContinuityBundle → TwinTriggerDecision → TwinIntervention → placement renderer`

No layer may bypass the boundary by treating local UI state, a model prompt, or an agent's private reasoning as shared truth.

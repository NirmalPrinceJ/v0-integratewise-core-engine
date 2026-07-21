# Continuity and context-boundary contract

Continuity is not unrestricted state sharing. It is a governed exchange of the minimum work context needed for a declared purpose.

## Product-to-platform flow

`WorkbenchContextEvent → Context Observer → IW-Continuity-Bridge → ContinuityBundle → TwinTriggerDecision → TwinIntervention(s)`

The Workbench publishes typed references to work. The platform resolves authority and canonical state, applies policy, and returns a scoped bundle. The renderer shows an intervention only in the semantic slot named by that bundle.

## Context boundary

Every cross-boundary exchange carries a `ContextBoundary` with these fields:

| Field         | Requirement                                                                 |
| ------------- | --------------------------------------------------------------------------- |
| `subject`     | The accountable human or service principal whose work is being represented. |
| `source`      | The verified system or participant supplying a projection.                  |
| `target`      | The verified human, tool, application, or agent receiving it.               |
| `scope`       | Explicit work, entity, record class, and field/evidence limits.             |
| `purpose`     | A declared use such as orient, prepare, decide, relay, or delegate.         |
| `permissions` | Read, write, propose, execute, and/or share rights; no implied escalation.  |
| `policyRefs`  | The policy and authority decisions applied to the exchange.                 |
| `expiry`      | A bounded validity time and revocation point.                               |

The sender may request a boundary. The platform establishes it from verified identity and policy. Client-provided tenant, user, role, and authority claims are never authoritative.

## Exchange modes

| Mode                | Typical participants                   | Allowed result                                                                                 |
| ------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `CONTEXT_SHARE`     | Human ↔ AI, Tool ↔ Tool, Agent ↔ Agent | A minimum-necessary read projection for a stated purpose.                                      |
| `STATE_RELAY`       | Tool ↔ Tool or Human ↔ Tool            | Canonical state changes, identifiers, version/provenance, and evidence references.             |
| `AGENT_HANDOFF`     | Agent ↔ Agent                          | Bounded outcome, evidence references, open questions, and next-state; never private reasoning. |
| `ACTION_DELEGATION` | Human ↔ AI/Agent or Tool ↔ Agent       | A constrained, policy-approved action intent or plan with explicit approval/execution rights.  |

### Participant rules

- **Human ↔ AI:** AI receives a scoped projection and returns explanations, preparation, suggestions, proposals, or plans. The human remains the decision-maker unless a separately governed delegation exists.
- **Tool ↔ Tool:** tools relay canonical work state and evidence with version/provenance; they do not mirror unrestricted records or private credentials.
- **Agent ↔ Agent:** agents exchange bounded outcomes, evidence references, open questions, and approved next work. They never exchange chain-of-thought, hidden prompts, private scratchpads, or unverified conclusions as facts.

## Non-negotiable exclusions

No context projection may contain unrestricted tenant state, credentials, raw secrets, hidden system prompts, private model reasoning, or another agent’s chain-of-thought. A conversation transcript is not automatically canonical memory. Sensitive field values require explicit scope and policy; otherwise the projection carries references, redaction markers, or summaries permitted by policy.

## Enforcement lifecycle

1. Authenticate the caller and resolve tenant membership server-side.
2. Verify source and target registration, requested purpose, scope, and permissions.
3. Evaluate policy and record policy references.
4. Create the expiring boundary and generate a minimum-necessary projection.
5. Log the exchange, preserve provenance, and make revocation effective on subsequent access.
6. Reject the request when any required identity, membership, target registration, or policy check is unavailable.

The contract is successful when the target receives enough context to perform its bounded work and no more.

# 21 — Business Ontology ⭐ (foundational; the largest remaining gap)

> **Extracted from:** IntegrateWise Platform Specification Suite
> **Region:** third_region
> **Original line:** 2899
> **Lines:** 112 | **Chars:** 5,417
> **Status:** Raw extraction — requires review and canonicalization

21 — Business Ontology ⭐ (foundational; the largest remaining gap)
Every entity in 02, 12, and every subsystem that touches “things” inherits from this ontology. Without this ontology, the rest of the system has no canonical reference for what a “Person”, “Team”, “Process”, “Objective” actually is.

21.1 Why this is the largest gap
The original spec defined tenant_spine_config and the entity graph with concrete entity types (CRMAccount, CRMLead, Opportunity, Ticket, etc.) but no ontological foundation. Two B2B SaaS tenants that both have a “Person” need that to be the same concept, queried the same way, governed the same way. Hence this single document is the canonical thing-everything-else-inherits-from.

21.2 The 16 root concepts
CopyOrganization — legal entity owning the tenant
Workspace — bounded context inside Organization (inherits from 03)
Person — first-class human (User is a Person with login)
Team — durable grouping of Persons, with role inheritance
Process — repeatable set of capabilities used to produce Outcomes
Project — time-bound container of Activities
Objective — measurable target a Process or Project exists to advance
Outcome — observed result, scored against an Objective
Asset — durable, non-ephemeral object of value (data, doc, code, model)
Knowledge — distilled truth (SOP, playbook, runbook; sits at L8 of memory)
Decision — recorded commitment (chair-of-record artifact)
Policy — rule that gates Decisions and Actions
Capability — declared action (inherits from 05)
Signal — derived observation (inherits from 10)
Memory — narrative artifact at any of the 8 layers (inherits from 07)
Conversation — Twin ↔ User dialog (inherits from 06)
Time — canonical timeline reference (inherits from 02 Timeline)
21.3 Inheritance tree (canonical)
CopyThing (id, version, lifecycle, provenance, evidence[]) ← base
├── Organization
├── Workspace
├── Agent (23)
├── Knowledge
├── Decision
├── Policy
└── TimeAnchor

AgentOfActivity (Thing + who/what performed)
├── Person — has Identities (28)
└── Agent — has Lifecycle (23)

BoundedContainer (AgentOfActivity + lifecycle scope)
├── Team — composition of Persons and Agents
├── Workspace — composition of Things (03)
└── Project — composition of Activities, has Objective

ValueCarrier (Thing + has measurable state)
├── Asset
├── Knowledge — value = reusability
└── Decision — value = commitment weight

Process (BoundedContainer + repeatable, has Objective)
├── Process — def + runs[]
└── Workflow — runnable Process (inherits from 11)

Outcome (ValueCarrier + measured against Objective)
├── Outcome
└── Signal — derived from deltas (10)

Action (Thing + executes Capability, gated by Policy)
├── Capability (inherits from 05)
└── Conversation — composed of Message Tuples
└── Memory — meaning-axis (07)
21.4 Canonical IDs per root concept
Concept Prefix Notes
Organization org* legal entity; one Organization ⇒ one or more Tenants
Workspace wsp* inherits from 03
Person usr* login-bound Person
Team team* inherits from Person and Agent
Process proc* template; resolved through Workflows
Project prj* inherits from Process
Objective obj* has metric_id, target, range
Outcome out* measured vs obj*
Asset ast* sub-typed by kind
Knowledge knw* inherits from L8 memory
Decision dec* chair-of-record artifact
Policy pol* declarative rule
Capability cap* inherits from 05
Signal sig* inherits from 10
Memory mem* inherits from 07
Conversation conv* inherits from 06
Time tl* inherits from 02 Timeline
21.5 Cross-concept reference rules
A Capability always belongs to ≥ 1 Process.
An Objective always references ≥ 1 Process.
An Outcome always references ≥ 1 Objective and ≥ 1 Process.
A Decision always references ≥ 1 Outcome OR ≥ 1 Signal.
A Policy always references ≥ 1 Capability or Entity type.
Memory is either Spine-truth, Twin-meaning, or Knowledge (three-axis separation, 07).
21.6 Responsibilities
Define the 16 root concepts and the inheritance tree.
Bind every ID prefix.
Bind every cross-concept reference rule.
Pin the three-axis Memory rule.
Be the single citation for “what is a Person” in any spec.
21.7 Inputs
OnboardingComplete (initial seeding).
Admin declarations of new root concepts (rare; extension point).
21.8 Outputs
Inheritance-validated entity writes (every new ent\_ must inherit from ≥ 1 root concept).
Schema version bumps force revalidation.
21.9 Events produced
OntologyDefined, ConceptExtensionAdded, ReferenceViolationDetected.
21.10 Events consumed
EntityCreated, EntityUpdated, SchemaVersionBumped.
21.11 APIs
GET /ontology/concepts, GET /ontology/inheritance/{kind}, POST /ontology/concepts, POST /ontology/validate.
21.12 State transitions
Ontology itself: draft → ratified → superseded. Every new entity version must include a re-validation pass against the current ratified ontology.
21.13 Failure handling
Reference violation → reject write, surface explainer referencing 21.5.
Ontology supersession without migration → hard block writes involving supersession path.
21.14 Extension points
Vendors may add new root concepts (rare, requires Steering Committee review).
New sub-types within an existing concept are normal extensions.

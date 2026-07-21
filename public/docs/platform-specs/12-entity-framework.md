# 12 — Entity Framework

> **Extracted from:** IntegrateWise Platform Specification Suite
> **Region:** first_pass
> **Original line:** 1121
> **Lines:** 36 | **Chars:** 1,364
> **Status:** Raw extraction — requires review and canonicalization

12 — Entity Framework
12.1 Responsibilities
Define the canonical entity types permitted per tenant (enabled_entities).
Provide inheritance, dynamic fields, industry extensions, validation.
12.2 Inheritance
CopyEntity (base: id, version, lifecycle, provenance)
├── AggregateEntity (typed by purpose)
│ ├── CRMAccount (inherits references[]→ contacts)
│ ├── CRMLead
│ ├── CRMOpportunity
│ ├── Ticket
│ ├── Invoice
│ └── …
└── ReferenceEntity
├── User
├── Product
└── …
12.3 Dynamic fields
Schema-additive. Each tenant may add fields via tenant_spine_config.field_extensions[].
Fields typed string|number|date|ref|enum|json.
12.4 Industry extensions
Declared in the 12×11 matrix; example for Healthcare: phi_flag, consent_ref, hipaa_scope.
12.5 Validation
Type-level validators per field.
Cross-entity validators (e.g., opportunity.amount > 0 AND opportunity.stage != closed).
Validator plugins VALIDATOR(name).
12.6 References and graph traversal
Reference integrity checked via Spine (02).
12.7 Events
Produced: EntityTypeRegistered, EntityExtensionAdded.
Consumed: OnboardingComplete to seed enabled entities.
12.8 APIs
POST /entity-types, POST /entity-types/{type}/fields, POST /entities/validate.
12.9 Failure handling
Validation failure blocks write; suggests fix in the error message.
Extension conflicts surface as admin warnings.

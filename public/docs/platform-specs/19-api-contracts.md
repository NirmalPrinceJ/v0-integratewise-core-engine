# 19 — API Contracts

> **Extracted from:** IntegrateWise Platform Specification Suite
> **Region:** first_pass
> **Original line:** 1325
> **Lines:** 17 | **Chars:** 734
> **Status:** Raw extraction — requires review and canonicalization

19 — API Contracts
19.1 Versioning
URI version (/v1/…, migrating to /v2025-09/… for explicit dates).
Deprecation policy: 6 months notice, sun-set banner, parallel-run.
19.2 Error model
Copy{ “code”: “IW-1234”, “message”: “…”, “doc”: “https://…”, “trace_id”: “…” }
Codes are stable; messages may be translated.
19.3 Pagination
Cursor-based by default (?cursor=…&limit=…).
Page size limit max 1000.
19.4 Feature flags
X-IW-Feature-Flags header; tenant overrides honor most-specific scope.
19.5 Configuration system
Server-driven config: tenant_spine_config (existing) + feature_flags + experiment_assignments.
19.6 Testing strategy
Contract tests against openapi spec (@integratewise/contract-tests).
Synthetic tenant population tests.

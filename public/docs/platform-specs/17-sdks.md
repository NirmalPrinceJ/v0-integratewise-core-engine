# 17 — SDKs

> **Extracted from:** IntegrateWise Platform Specification Suite
> **Region:** first_pass
> **Original line:** 1298
> **Lines:** 17 | **Chars:** 749
> **Status:** Raw extraction — requires review and canonicalization

17 — SDKs
17.1 Server SDK (@integratewise/server)
Capability registration, connector adapters, policy packs, projection transforms.
17.2 Capability SDK contributor guide
Author cap\_.yaml per 05.
Validation rules + code-signing step.
17.3 Connector SDK (@integratewise/connector-sdk)
Implements ConnectorAdapter (08.3).
Provides test harness: connector test --mock-vendor=mux.
17.4 Worker SDK (@integratewise/worker)
Helpers for Spine, Twin, Workflows, Signals.
17.5 Client SDKs
@integratewise/react, @integratewise/swift, @integratewise/kotlin.
17.6 CLI (@integratewise/cli)
iw onboard, iw capability register, iw connector test, iw marketplace publish.
17.7 Versioning
All SDKs follow semver; breaking changes shipped with MAJOR + migration guide.

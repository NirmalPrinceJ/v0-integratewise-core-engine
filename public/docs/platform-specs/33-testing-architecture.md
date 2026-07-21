# 33 — Testing Architecture

> **Extracted from:** IntegrateWise Platform Specification Suite
> **Region:** third_region
> **Original line:** 3547
> **Lines:** 35 | **Chars:** 1,717
> **Status:** Raw extraction — requires review and canonicalization

33 — Testing Architecture
33.1 Responsibilities
Define the multi-layer testing architecture: Unit, Integration, Connector simulation, Synthetic tenants, AI evaluation, Persona validation, End-to-end, Load, Chaos.
33.2 Layers (preserves user’s list)
Unit — pure functions, SDK contracts.
Integration — subsystem boundaries (02↔05, 08↔02, etc.).
Connector simulation — vendor mocks (per mock-vendor=mux from SDK 17.3).
Synthetic tenants — generated tenant population exercising the 12×11 matrix.
AI evaluation — evalset runs on prompt versions and model swaps (22.13).
Persona validation — Persona-fit assertions: greeting, capability defaults, governance posture.
End-to-end — full flows (OAuth → Onboard → First Value → Promotion).
Load testing — synthetic traffic across Gateway/Spine.
Chaos testing — fault injection on DO, Queue, Vendor rate limit, LLM timeout.
33.3 Inputs
CI event (PR, push), scheduled nightly jobs, pre-release gate.
33.4 Outputs
Pass/fail per layer; release gate decisions; coverage report.
33.5 Events produced
TestSuiteStarted, TestSuiteCompleted, TestFailure, EvalRegressionDetected, ChaosDrillCompleted.
33.6 Events consumed
CI events, schedules.
33.7 APIs
POST /test/run, GET /test/runs/{run_id}, POST /test/evalset/publish.
33.8 State transitions
queued → running → passed | failed | flaky → archived.

33.9 Failure handling
Flake quarantine (re-run twice, isolate).
Eval regression → force prompt rollback (22.9).
33.10 Extension points
New test kinds via TEST_KIND(name).
Custom chaos faults via CHAOS_FAULT(name).
33.11 Release gate (canonical)
P0 release requires all layers pass for the last 7 days.
Any regression freezes the gate until resolved or exempted by Steering Committee.

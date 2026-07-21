# Hermes & Execution

Hermes is the execution coordinator. It does not assemble context, make governance decisions, write to the Spine, reconcile provider systems, or select AI models.

For the canonical execution model, see `docs/spec/INTEGRATEWISE_CANONICAL_SPEC_v1.0.md`, `docs/architecture/PRODUCT_ARCHITECTURE.md`, and `docs/internal/operations/API_REFERENCE.md`.

## Hermes scope

Hermes receives authorized ExecutionPlans and:

1. Resolves runtime binding.
2. Validates schema and permissions.
3. Routes to a runtime adapter.
4. Dispatches execution.
5. Tracks correlation, state, and timeouts.
6. Reports telemetry and outcome events.

Everything outside that list is out of scope.

## Execution modes

Execution is not monolithic. Supported modes include:

- local execution
- API Connector action
- MCP invocation
- API Wrapper capability
- AI execution
- agent-to-agent
- tool-to-tool

Execution mode and synchronization mode are independent. Work may execute in one mode and converge in another.

## Customer Zero versus external customers

In Customer Zero, native execution and writeback run inside IntegrateWise infrastructure.

For external customers, execution is handed off, not centralized. The approved proposal becomes a canonical handoff package. The customer’s execution environment runs the work and posts outcomes back to IntegrateWise.

This split must be preserved in integration design. Do not assume external tenants have local execution or writeback surfaces inside IntegrateWise.

## Handoff layer

The handoff layer packages approved proposals into adapter-neutral canonical contracts. Adapters then translate to JSON, MCP, Hermes, OpenClaw, n8n, or other execution targets.

Handoff packages contain:

- actions and mutations
- context references
- governance token and approval metadata
- required authority
- success criteria
- adapter routing hints

## Async behavior

All handoffs are async. The Workbench must not block users waiting for execution. Users track progress by status, not by polling synchronous responses.

## Outcome ingestion

External execution agents must POST outcomes to IntegrateWise. Outcome ingestion validates governance tokens, updates execution state, records memory signals, refreshes Workbench projections, and advances Timeline.

Outcome ingestion is a customer responsibility in the handoff model. If outcomes are not returned, the continuity loop is incomplete.

## Retry and recovery

Execution may reach:

- Denied
- Cancelled
- Partially Completed
- Failed
- Retry Available
- Recovery Required
- Sync Conflict

Recovery and retry behavior must be explicit. Do not hide recoverable failures inside generic error states.

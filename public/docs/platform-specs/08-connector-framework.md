# 08 — Connector Framework

> **Extracted from:** IntegrateWise Platform Specification Suite
> **Region:** first_pass
> **Original line:** 929
> **Lines:** 69 | **Chars:** 2,572
> **Status:** Raw extraction — requires review and canonicalization

08 — Connector Framework
8.1 Responsibilities
Own connector lifecycle (declared → registered → healthy → degraded → retired).
Manage authentication, refresh, sync policy, retry, conflict, health.
8.2 Lifecycle
Copydeclared ──▶ sandboxed ──▶ certified ──▶ active ──▶ degraded ──▶ retired
│ │ │
▼ ▼ ▼
revoked recovering archived
8.3 Adapter interface (canonical contract)
Copyinterface ConnectorAdapter {
id: string; // e.g., “salesforce”
version: string;
scopes: string[];

// discovery
capabilities(): CapabilityDescriptor[];

// lifecycle
install(ctx): Promise;
uninstall(ctx): Promise;
refresh(ctx): Promise;
health(): Promise;

// data plane
pull(since): AsyncIterable;
push(intent): Promise;
revert(intent, reason): Promise;

// error model
classify(err): ErrorClass; // transient|permission|schema|rate|fatal
}
8.4 Authentication lifecycle
Outbound connection authorization via **Descope** (canonical authorization authority where supported). IntegrateWise owns the connection binding and references Descope-managed authorization state; Descope owns the credential/token lifecycle and external authorization resource identity. Nango remains classified as legacy/dormant compatibility for providers Descope outbound does not yet support; it is not the default architecture.
8.5 Sync policies
Soft sync (default for sensitive industries), Real sync (default for high-volume mutations), Propose→Approve (default for high risk).
Conflict resolution deferred to Spine (02) by emitting a Connector Delta.
8.6 Retry policy
Transient: 5 attempts, exponential w/ jitter.
Permission: 0 retry, surface via Workbench banner requiring admin action.
Schema: 0 retry, dataclass outlier → admin queue.
Rate: token-bucket per vendor (Cloudflare Queue throttle).
Fatal: connector retired and HealthChanged emitted.
8.7 Health monitoring
HealthSnapshot { status: healthy|degraded|down, latency_ms, error_rate, last_sync_at, breaker_state }.

8.8 Inputs
Vendor API events (webhooks), Connector Deltas.
Admin actions (install/uninstall/revoke).
8.9 Outputs
Connector Deltas → Spine (02).
ConnectorHealthyChanged events → Workflows, Signals.
8.10 Events
Produced: ConnectorInstalled, ConnectorSynced, ConnectorHealthyChanged, ConnectorDeltaReceived, ConnectorRefreshed, ConnectorRetired.
Consumed: UserRoleChanged, WorkspaceArchived, TenantMerged.
8.11 APIs
POST /connectors, DELETE /connectors/{conn_id}, POST /connectors/{conn_id}/sync, GET /connectors/{conn_id}/health.
8.12 State transitions
Per state machine in 8.2, with breaker transitions on health.

8.13 Failure handling
Consecutive failures > N → degraded then down, emit ConnectorHealthyChanged.
Backoff + dead-letter queue (Cloudflare Queue).
8.14 Extension points
New connectors authored against SDK (17).
Custom retry policy per vendor.

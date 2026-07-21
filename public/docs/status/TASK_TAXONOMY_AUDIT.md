# Long-running Task Taxonomy — Implementation Audit

Date: 2026-07-20
Reviewer: Hermes Agent (cron job)

## 1. Executive Summary

The proposal for organizing Hermes long-running and event-driven tasks across **12 categories** is **already fully implemented** in `services/task-management/`. The existing codebase matches the architecture proposal almost exactly:

- **70 built-in task templates** across all 12 proposed categories
- **16 MCP capability handlers** registered in the Task Management MCP
- **Scheduler Durable Object** with alarm-based (time-based) and event-based (`/enqueue`) dispatch
- **Retry/backoff**, **Dead Letter Queue**, **metrics**, **history**, and **logs** support
- **5-stage execution model** documented: scheduled, interval, event, conditional, continuous

## 2. Category Coverage

| Category | Templates | Notes |
|----------|-----------|-------|
| automation | 6 | Renewal risk, customer health, pipeline refresh, invoice reconciliation, SLA compliance, license utilization |
| watch | 6 | GitHub releases, HubSpot changes, Salesforce schema, Cloudflare deployments, production incidents, documentation updates |
| memory | 7 | Compaction, entity merge, duplicate detection, timeline rebuilding, embedding regeneration, knowledge graph updates, continuity validation |
| ai | 7 | Account summary, opportunity forecasting, ticket clustering, meeting summarization, churn prediction, next-best-action, knowledge synthesis |
| integration | 6 | Connector health, incremental sync, full sync, OAuth validation, schema discovery, rate-limit monitoring |
| infrastructure | 8 | Cloudflare health, DB optimization, queue depth, cache warming, secret rotation, backup verification, storage cleanup |
| governance | 2 | Approval reminders, policy drift detection *(fewer templates than proposal)* |
| security | 6 | Token expiration, secret exposure, failed login analysis, API key validation, certificate expiration, suspicious activity detection |
| workspace | 7 | Dashboard refresh, KPI updates, timeline refresh, priority computation, work assignment, daily briefings |
| agent | 6 | Plan evaluation, retry failed, clean history, optimize workflows, capability cache, learn from outcomes |
| marketplace | 3 | Connector version discovery, validation, metadata updates *( fewest templates)* |
| observability | 6 | Metrics aggregation, trace analysis, error clustering, latency analysis, cost reporting, capacity forecasting |

## 3. Capability Inventory

### Implemented Handlers (`src/handlers.ts`)

**User-facing:**
- `tasks.create`, `tasks.get`, `tasks.list`, `tasks.update`, `tasks.delete`
- `tasks.pause`, `tasks.resume`, `tasks.runNow`
- `tasks.history`, `tasks.logs`, `tasks.metrics`
- `tasks.createFromTemplate`, `tasks.listTemplates`
- `tasks.dlq`, `tasks.cancel`, `tasks.retry`

**Internal (Scheduler DO):**
- `tasks.getDue`, `tasks.markCompleted`, `tasks.markFailed`

### MCP Pool Registration Status

All capabilities are implemented, but **2 are missing from the MCP Pool manifest** (`services/mcp-pool/src/registrations.ts`):

| Capability | Handler Status | MCP Pool Status |
|------------|---------------|-----------------|
| `tasks.createFromTemplate` | ✅ Implemented | ❌ **Missing from registration** |
| `tasks.listTemplates` | ✅ Implemented | ❌ **Missing from registration** |

## 4. Architecture Alignment

### Proposed vs Existing

| Proposal | Existing | Status |
|----------|----------|--------|
| Task Management MCP | ✅ `services/task-management/` | Implemented |
| Scheduler | ✅ Scheduler DO (`scheduler-do.ts`) | Implemented |
| Event Watches | ✅ `/enqueue` endpoint, Signal Engine pattern | Implemented |
| Workflow Engine | ✅ Scheduler DO dispatch | Implemented |
| Retry Manager | ✅ Exponential/linear/fixed backoff | Implemented |
| Notifications | ❌ Not explicitly implemented | Gap |
| History | ✅ `task_execution_log` table | Implemented |
| Dead Letter Queue | ✅ `ops-dlq` Queue binding | Implemented |
| Metrics | ✅ `tasks.metrics` handler | Implemented |

### Execution Models

| Model | Proposal | Implementation |
|-------|----------|----------------|
| Time-based (cron) | ✅ `0 */6 * * *` | ✅ Cron parser + DO alarm scheduling |
| Time-based (interval) | ✅ `every 5m` | ✅ `nextCronRun` + interval handling |
| Event-based | ✅ `github.push` | ✅ `/enqueue` fetch handler |
| Conditional | ✅ capability-gated | ✅ `conditionJson` field + TypeScript types |
| Continuous | ✅ poll-based | ✅ `pollIntervalSeconds` + Scheduler DO alarm |

## 5. Data Model

**D1 Tables:**
- `scheduled_tasks` — task registry with trigger types, retry policies, governance
- `task_execution_log` — append-only execution history
- `task_templates` — built-in template catalog (migration 002)

**Indexes:**
- `idx_st_tenant_enabled`, `idx_st_next_run`, `idx_st_capability`, `idx_st_trigger_type`, `idx_st_owner`
- `idx_tel_task_id`, `idx_tel_tenant`, `idx_tel_status`
- `idx_tt_category`, `idx_tt_id`

## 6. Test Coverage

| File | Coverage | Notes |
|------|----------|-------|
| `cron.test.ts` | ✅ Cron parsing & next-run calculation | 5 tests |
| `watch.test.ts` | ✅ Event trigger creation | 1 test |
| `metrics.test.ts` | ✅ Aggregation logic | 1 test |
| `task-management.test.ts` | ✅ Capability export smoke test | 1 test |

**Gap:** Integration tests for Scheduler DO dispatch, retry logic, DLQ routing, and capability invocation are absent.

## 7. Gaps & Recommendations

### High Priority
1. **Register `tasks.createFromTemplate` and `tasks.listTemplates` in MCP Pool manifest** so they are discoverable by external callers.
2. **Add Scheduler DO integration tests** covering alarm firing, event enqueue, retry backoff, and DLQ routing.

### Low Priority
3. **Add `[crons]` to `wrangler.toml` if platform-level cron triggers are needed** (currently the Scheduler DO uses DO alarms, which is the preferred dynamic-scheduling pattern — this is more of an architectural decision point than a bug).
4. **Remove unused `TASK_QUEUE` binding** from `scheduler-do.ts` types (line 26) — it is declared but never used.
5. **Update SQL migration 002 comment** to reflect the actual 12 categories in `TemplateCategory` rather than the stale `personal/customer-success/operations` list.

## 8. Conclusion

The long-running task taxonomy proposed by the user is already the **canonical implementation** in this codebase. The architecturally-sound decision to use a Scheduler Durable Object (rather than Cloudflare Cron Triggers directly) enables the dynamic, multi-tenant, multi-trigger scheduling that the proposal requires. The remaining work is **completeness and test polish**, not core architecture.

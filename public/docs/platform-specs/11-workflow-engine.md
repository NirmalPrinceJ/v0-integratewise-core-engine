# 11 — Workflow Engine

> **Extracted from:** IntegrateWise Platform Specification Suite
> **Region:** first_pass
> **Original line:** 1084
> **Lines:** 37 | **Chars:** 1,321
> **Status:** Raw extraction — requires review and canonicalization

11 — Workflow Engine
11.1 Responsibilities
Run deterministic, retryable, schedulable automations triggered by Events.
Compose capabilities (05) with approvals (09) and human tasks.
11.2 Anatomy
Copyworkflow:
id: wf_renewal_save_play
trigger: SignalCreated(kind=risk, score>=0.7)
steps:

- call: cap_mark_renewal_risk
  with: { lead_id: trigger.subject }
  on_error: notify_owner
- human_task: review_renewal_plan
  assignee: owner
- call: cap_schedule_call
  with: { lead_id: trigger.subject, when: +2d }
  retries:
  cap_mark_renewal_risk: 3 backoff=exp
  schedule: none
  11.3 Inputs
  Any Event Bus event by name.
  Cron schedules.
  11.4 Outputs
  Step records and final outcome event WorkflowCompleted | WorkflowFailed.
  11.5 Events
  Produced: WorkflowStarted, WorkflowStepCompleted, WorkflowHumanTaskCreated, WorkflowCompleted, WorkflowFailed, WorkflowRetried.
  Consumed: all event bus events (filtered by trigger).
  11.6 APIs
  POST /workflows, POST /workflows/{wf_id}/run, GET /workflows/runs/{run_id}.
  11.7 State transitions
  scheduled → running → waiting_human → running → completed | failed.

  11.8 Failure handling
  Per-step retries, exponential, max configurable.
  After max retries → WorkflowFailed + admin notification.
  11.9 Extension points
  New step types (including external HTTP), marketplace-distributed templates.

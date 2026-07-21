# 29 — Billing Platform

> **Extracted from:** IntegrateWise Platform Specification Suite
> **Region:** third_region
> **Original line:** 3377
> **Lines:** 44 | **Chars:** 2,125
> **Status:** Raw extraction — requires review and canonicalization

29 — Billing Platform
29.1 Responsibilities
Plans, Seats, Usage, Credits, Trials, Metering, Invoices, Limits, Quotas.
29.2 Plan model
Copysub*plan:
id: sub_plan*…
code: free | starter | growth | enterprise
prices: [{ currency, amount, interval: monthly|annual }]
seats: included
usage*credits: included # optional
overage_policy: [block | bill | throttle]
features: [cap_id, signal_priority, marketplace_discount]
29.3 Inputs
WorkspaceCreated, UserAdded (seat consumption), CapabilityInvoked (metered), SignalCreated (signal metering), API call (/ai/run LLM tokens).
29.4 Outputs
sub* records, bill\_ invoices, Stripe receipts (13.5).
Enforcement events (LimitExceeded, QuotaWarning).
29.5 Events produced
PlanAssigned, SeatConsumed, SeatReleased, UsageMetered, CreditConsumed, CreditGranted, TrialStarted, TrialConverted, TrialExpired, InvoiceIssued, InvoicePaid, InvoiceFailed, LimitExceeded, QuotaWarning.
29.6 Events consumed
WorkspaceCreated, UserAdded, UserRemoved, CapabilityInvoked, SignalCreated, ModelInvoked, ListingInstalled.
29.7 APIs
POST /billing/plans, POST /billing/subscriptions, POST /billing/usage/record, GET /billing/invoices, POST /billing/credits/grant.
29.8 State transitions
Subscription: trialing → active → past_due → canceled → reactivated.

29.9 Metering
Metered units: seat, llm_token, signal_score, cap_invocation, connector_sync_call, r2_storage_gb.
Hourly aggregation → monthly close.
29.10 Limits & Quotas
Per-tenant caps; per-workspace caps; per-user caps.
overage_policy: block (deny), bill (Stripe metered SKU), throttle (rotate to cheaper path).
Surfaced via 30 Operational Metrics dashboards.
29.11 Credits
Trial and grant credits stored in sub_credits, consumed FIFO, tracked in audit log.
29.12 Invoices
Monthly per workspace; line items mirror UsageMetered events.
Reconciliation against Stripe via daily job.
29.13 Failure handling
Payment failure → soft-cap features; admin notified.
Metering lag → rechecks current usage every 6 h.
29.14 Extension points
New SKUs via Marketplace (13).
Custom overage policy via BILLING_POLICY(name).

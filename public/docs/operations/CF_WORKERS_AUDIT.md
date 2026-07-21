# Cloudflare Workers Account Audit — 103 workers, ~15 real

Status: CURRENT
Date: 2026-07-19
Method: live account inventory (Workers API) cross-referenced against every
`wrangler.toml` in this repo (85 producible worker names, 55 distinct
service-binding targets) and `deploy-workers.yml` (the CI deploy path).

> **The production mesh is the ~15 `*-prod` workers deployed by
> `deploy-workers.yml`.** Everything else is history: pre-consolidation
> names, dead `-staging` twins from January, abandoned experiments, and
> personal projects. This sprawl is also why Workers Builds keeps hitting
> the account build-capacity ceiling.

## Tier 1 — KEEP (live mesh + bound dependencies)

Deployed by CI on every `main` push, and/or a service-binding target of a
deployed worker (deleting a binding target breaks its caller at runtime):

`gateway-prod` · `pipeline-prod` · `connector-prod` · `intelligence-prod` ·
`knowledge-prod` · `workflow-prod` · `l2-prod` · `continuity-prod` ·
`mcp-connector-prod` · `folder-watcher-prod` · `integratewise-tenants` ·
`integratewise-admin` · `integratewise-billing` · `integratewise-think` ·
`integratewise-webhook-ingress` · `integratewise-mcp-pool-prod` ·
`integratewise-integration-management-mcp-prod` · `integratewise-spine` ·
`iw-agent-runtime` · `hub-controller-api` · `integratewise-connector-sync` ·
`integratewise-mcp-connector`

Also currently bound (conservative keep — bound by _some_ repo config, often
deprecated ones; re-audit after the deprecated services are retired):
`connector` · `knowledge` · `intelligence` · `continuity` · `workflow` ·
`pipeline` · `gateway` · `integratewise-pipeline` · `integratewise-knowledge` ·
`integratewise-bff` · `integratewise-connector` · `integratewise-intelligence` ·
`integratewise-l2` · `integratewise-loader` · `integratewise-store` ·
`integratewise-continuity` · `integratewise-workflow` · `l2-test` ·
`integratewise-admin-staging` · `integratewise-loader-staging` ·
`integratewise-store-staging`

## Tier 2 — VERIFY before touching (19)

Recently active or repo-known but not bound by anything. Check routes/custom
domains in the dashboard before deciding:

- `integratewise-anthropic-mcp-prod`, `integratewise-perplexity-mcp-prod` —
  the AI provider MCPs (KEEP; source not yet repatriated into the repo — see
  `docs/architecture/AI_CONNECTOR_MCP_FLOW.md`)
- `integratewise-live`, `integratewise-live-prod` — active in July; unknown
  role (possibly old app hosts with routes). Verify routes before deleting.
- `integratewise-hermes` — stale deploy of `services/hermes` (redeploy from
  repo, don't delete)
- `integratewise-webhooks`, `integratewise-folder-watcher`,
  `twin-orchestrator`, `folder-watcher-test`, `integratewise-agent-registry`,
  `integratewise-telemetry-staging` — repo-known, idle since June
- Deprecated pipeline stages, unbound: `integratewise-act`,
  `integratewise-govern`, `integratewise-normalizer` (+ their `-staging`
  twins, `integratewise-think-staging`) — deletable once the deprecated
  services are formally retired (HERMES.md migration table)
- `misty-brook-99b1d` — unknown/personal, active July 8; confirm owner

## Tier 3 — DELETE (41 — not in repo, not bound, idle)

Old duplicates and dead ends. After a one-time glance for routes/DO data in
the dashboard, delete with local wrangler (OAuth session — per AGENTS.md,
`unset CLOUDFLARE_API_TOKEN` first so the connect@integratewise.ai session is
used):

```bash
unset CLOUDFLARE_API_TOKEN
for w in \
  modelflare browser-agent workflows-starter-template \
  ops-iw-agent-runtime ops-ai-bridge ops-litellm-proxy ops-memory-pipeline \
  twin twin-agent \
  integratewise-gateway integratewise-gateway-staging \
  integratewise-live-dev integratewise-live-production \
  integratewise-pipeline-staging integratewise-mcp-connector-staging \
  integratewise-bff-staging integratewise-connector-staging \
  integratewise-intelligence-staging integratewise-knowledge-staging \
  integratewise-spine-staging integratewise-iq-hub-staging \
  integratewise-mcp-tool-server-staging \
  integratewise-spine-v2 integratewise-spine-v2-production integratewise-spine-v2-staging \
  integratewise-iq-hub integratewise-mcp-tool-server integratewise-connector-manager \
  integratewise-agents \
  integratewise-maketingsite integratewise-marketingsite \
  orange-cell-7c67 orange-paper-439c glowing-pancake \
  continurityops cus0 \
  v1-portfolio-hire hub-api-prod hub-controller \
  agents-starter integratewis21 \
; do wrangler delete --name "$w" --force || echo "SKIP $w"; done
```

Notes:

- Deletion is irreversible and drops any Durable Object storage attached to
  the worker. None of the Tier-3 names are DO-bearing per repo configs, but
  the dashboard glance is the final check.
- `integratewise-maketingsite`/`-marketingsite` (March) are superseded by the
  `integratewise-marketing` Cloudflare Pages deploy; `hub-api-prod`/`hub-controller`
  are superseded by `hub-controller-api`; `integratewise-gateway` (June 9) is the
  pre-consolidation gateway superseded by `gateway-prod`.
- `v1-portfolio-hire`, `agents-starter`, `misty-brook-99b1d`, `modelflare`,
  `browser-agent` look personal/experimental — confirm before deleting.

## Also: disconnect Workers Builds git integration (12 workers)

`deploy-workers.yml` (GitHub Actions) is the working deploy path — its runs on
`main` succeed and shipped the recent gateway fixes. The Cloudflare git
integration on `gateway-prod`-family workers duplicates it, double-deploys on
main, and fails on every PR branch (capacity ceiling), spamming PRs with
❌ check runs. Per worker in the dashboard: **Settings → Build → disconnect
the Git repository** for: gateway, bff, connector, billing, l2, intelligence,
knowledge, admin, tenants, think, mcp-connector, pipeline.

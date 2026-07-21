# IW Seed Pack — Commercial OS → IntegrateWise Product

Status: READY · blocked only by MCP-pool routes (see Connectivity Report)
Created: 2026-07-21

## What this is

The commercial canon packaged as **KB articles in the exact `iw_kb_write` schema**, ready to hydrate the product's own knowledge base. This is Customer Zero made real: once seeded, the Twin briefs from the commercial canon, `iw_semantic_search` finds it, and IntegrateWise becomes its own commercial control center — the operations surface these documents were always meant to live on.

Repo (`docs/commercial/`) remains canonical; the KB is the operational projection. Re-seeding is idempotent (`iw_kb_write` updates by title).

## Contents

```
iw-seed/
  README.md            this file + connectivity report
  seed.mjs             loader (Node 18+, no deps) — reads articles/, POSTs to the gateway
  articles/            9 canon articles, YAML frontmatter = iw_kb_write args
    01-commercial-canon.md
    02-positioning-messaging.md
    03-price-book.md
    04-icp-qualification.md
    05-sales-system.md
    06-cs-operating-core.md
    07-metrics-dictionary.md
    08-gates-okrs-launch.md
    09-decisions-and-map.md
```

## How to seed (either path)

**Path A — tell Claude:** once the MCP pool serves, say **"seed the product KB"** — Claude runs `iw_kb_write` for each article and verifies with `iw_kb_search` + `iw_twin_brief`.

**Path B — run the loader:**
```bash
IW_GATEWAY_URL=https://<your-gateway> IW_TOKEN=<bearer> node docs/commercial/iw-seed/seed.mjs
# add DRY_RUN=1 to preview payloads without posting
```
The loader parses frontmatter (title/topics/tags/visibility), posts `{title, content_md, topics, tags, visibility}` to `POST {IW_GATEWAY_URL}/kb/articles` (adjust ENDPOINT in seed.mjs if your route differs), and reports per-article results.

## Connectivity Report (Customer-Zero bug report, 2026-07-21 ~04:30 ET)

Via `iw-mcppool` MCP connector, all attempted routes returned **`Error 404: Not found`**:

| Tool | Result |
| --- | --- |
| `iw_kb_list_recent` | 404 |
| `iw_kb_search` (query "doctrine") | 404 |
| `iw_spine_entity_list` (entity_type "account") | 404 |

Interpretation: the MCP pool worker responds (proper 404s, not connection failures), but KB/Spine routes behind it are not deployed or not mounted. Matches the Strategic Build Plan's assessment — plumbing, not infrastructure. When the KB routes land, this pack is the first end-to-end write test *and* the commercial hydration in one step.

## Verification checklist (post-seed)

- [ ] `iw_kb_search "price book"` returns article 03 with correct tiers
- [ ] `iw_kb_search "never say"` returns the canon's voice rules
- [ ] `iw_semantic_search "what is our category"` ranks article 01 first
- [ ] `iw_twin_brief` reflects commercial context availability
- [ ] Re-run seed → articles update (idempotency), no duplicates

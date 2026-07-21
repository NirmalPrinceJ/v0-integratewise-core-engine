# Cursor Models Configuration (for IntegrateWise workspace)

> Last updated: 2026-06-20
> Purpose: Recommended model choices inside the Cursor IDE when working on this repo.

## Why Model Choice Matters Here

This codebase has heavy protocol surface:

- `AGENTS.md` (long)
- `CLAUDE.md`
- `.cursor/rules/iw-continuity-protocol.mdc` (always applied)
- Multiple other .mdc rules + handoff requirements

You need a model that:

- Handles very long context + strict instructions reliably
- Excels at "do not skip declaration, always produce handoff, respect CF-only, never write secrets"
- Is strong at TypeScript + Cloudflare + architecture reasoning

## Recommended Settings (Cursor IDE)

### 1. Add API Keys (required for the models below)

Cursor Settings (`Cmd+,`) → **Models** (or search "API Keys"):

**Required for recommended setup:**

- **Anthropic API Key** (priority #1)
  - Get at: https://console.anthropic.com/
  - Enables: claude-4-sonnet, claude-4-opus, claude-3-5-sonnet etc.

**Strongly recommended:**

- **OpenAI API Key**
  - Enables: o3, o1, gpt-4o, gpt-4o-mini, etc.

**Optional:**

- xAI API Key (for Grok models)
- Others as needed

**Never put these keys in the repo.** Cursor stores them locally in your app.

### 2. Set Default Models in Cursor UI

After adding keys, assign defaults:

- **Agent** (most important for this repo): `claude-4-sonnet` (or the latest Sonnet variant listed)
- **Composer**: `claude-4-sonnet` or a fast model
- **Chat**: Same or Cursor's fast tier

You can override per conversation by clicking the model name in the chat input bar.

There is no committed workspace file for "default model" — configuration lives in Cursor's local settings + per-session picker. The rules we added (`.cursorrules` + `iw-continuity-protocol.mdc`) will guide the agent regardless of exact model (as long as it has good instruction following).

### 2. Assign Models by Feature

| Feature                           | Recommended Model                                  | Why                                                  |
| --------------------------------- | -------------------------------------------------- | ---------------------------------------------------- |
| **Agent**                         | `claude-4-sonnet` (or latest Claude Sonnet)        | Best instruction following for our rules + protocols |
| **Composer**                      | `claude-4-sonnet` or Cursor fast                   | Good balance of quality + speed                      |
| **Chat**                          | `claude-4-sonnet` or `cursor-small`                | Daily work                                           |
| **Hard reasoning / architecture** | `o3` / `o1-pro` / `claude-4-opus` (switch in chat) | Deep planning before implementation                  |
| **Tab / autocomplete**            | Cursor fast / Sonnet                               | Low latency                                          |

In the chat input bar you can click the model name at any time to override for that conversation.

### 3. Enable Long Context When Needed

- When reading full AGENTS.md + rules + multiple services → enable "Max mode" / long context if offered.
- For big refactors involving Spine + Twin + Gateway, start with a strong reasoning model first.

### 4. Per-Session Best Practice

1. New chat / Agent session
2. Immediately verify the model sees the injected rules (ask "what is the mandatory declaration?").
3. It should say something like: "I have read the IntegrateWise constitutional documents" when it acts.

## Default Models + API Keys (Project Runtime)

These are **for the IntegrateWise product** (Twin, intelligence, etc.). Separate from Cursor IDE keys.

### Default Models (as of now)

| Component                      | Default Model                       | Location                                               |
| ------------------------------ | ----------------------------------- | ------------------------------------------------------ |
| Twin (iw-agent-runtime)        | `openrouter/openai/gpt-5-mini`      | `wrangler.toml`, `capability-contract.ts`              |
| Shared OpenRouterClient        | `anthropic/claude-3.5-sonnet`       | `packages/lib/src/openrouter.ts` (DEFAULT_MODELS.chat) |
| AIProvider (openrouter)        | `anthropic/claude-3.5-sonnet`       | `packages/lib/src/ai-provider.ts`                      |
| Intelligence router (examples) | Workers AI llama or free OpenRouter | `services/intelligence/src/lib/ai-router.ts`           |
| .env.example comment           | `anthropic/claude-3.5-sonnet`       | `.env.example`                                         |

**Note:** Production traffic must go through **Cloudflare AI Gateway** (DECISION 26).

### API Keys the Project Needs

**Primary:**

- `OPENROUTER_API_KEY`

**Per-environment var:**

- `AI_GATEWAY_ID`
  - dev: `integratewise-ai-dev`
  - test: `integratewise-ai-test`
  - prod: `integratewise-ai-prod`

**How to set (never commit the actual key):**

**Local dev:**

```bash
# In each service that needs AI
services/intelligence/.dev.vars
services/iw-agent-runtime/.dev.vars
# (and knowledge, think, etc. as needed)
```

Content example:

```
OPENROUTER_API_KEY=sk-or-v1-yourkeyhere
```

**Production / deployed:**

- Use Cloudflare Secrets Store (already wired in `wrangler.toml` for intelligence).
- Or: `unset CLOUDFLARE_API_TOKEN && wrangler secret put OPENROUTER_API_KEY --env production`
- `AI_GATEWAY_ID` lives in the `[vars]` or `[env.xxx.vars]` sections of wrangler.toml (already set per env).

See `.env.example` for the full list of AI-related variables.

### Cursor IDE vs Project Keys

- **Cursor IDE models** → You provide keys directly in Cursor Settings (Anthropic/OpenAI). Stored locally on your machine.
- **IW product models** → Project uses its own `OPENROUTER_API_KEY` + AI Gateway. The MCP bridge we configured earlier gives Cursor _tools_, not model access.

### Codex App (OpenAI Codex.desktop)

Codex.app is another AI coding/agent surface (Chromium-based, at /Applications/Codex.app, data in ~/Library/Application Support/Codex).

**MCP / Agents update (same as Cursor/OpenCode):**

Use the stdio bridge for "integratewise":

- Command: `node`
- Args: `/Users/nirmal/Github/integratewise-live/scripts/integratewise-mcp-bridge.mjs`
- Env:
  - INTEGRATEWISE_MCP_URL=https://mcp.integratewise.ai
  - INTEGRATEWISE_TENANT_ID=integratewise
  - INTEGRATEWISE_CLIENT_ID=cursor-iw

Add this in Codex's MCP/Tools settings UI (if it has a servers panel like Cursor) or its config if it exposes a JSON.

The setup script (`setup-ai-mcp-clients.sh`) now covers Codex.

**Default models & API keys in Codex:**

- Add your Anthropic key (for Claude 4 Sonnet) and/or OpenAI key inside the app's model/API settings.
- Recommended default for agent work: Claude 4 Sonnet (best for following the long IW protocol docs, handoff requirements, and rules we have injected in other tools).
- For hard tasks: switch to o-series or Opus if available in the app.

Start sessions in Codex with the declaration: "I have read the IntegrateWise constitutional documents" and use the `integratewise` tool server for any Spine/memory/KB access.

Restart Codex after adding the MCP server.

See also the updated setup script for automation notes.

This separation is intentional (and required by the architecture).

## Quick Verification After Changing Models

Start a fresh chat and say:

"Confirm you have read the IntegrateWise constitutional documents and list the first three things you must do before editing code."

A correctly configured strong model + our rules should respond with the proper protocol.

## Adding a Custom Provider (Advanced)

If the project ever exposes an OpenAI-compatible `/v1/chat/completions` (via the intelligence layer or a dedicated proxy), you can add it under Custom Models in Cursor:

- Base URL: `https://your-gateway...`
- Model name: the slug used internally (e.g. `openrouter/anthropic/claude-4-sonnet`)

Currently the primary surface for external agents is **MCP** (configured in `.cursor/mcp.json`), not direct model calls.

---

Update this file when Cursor adds new model options or the project's default inference model changes.

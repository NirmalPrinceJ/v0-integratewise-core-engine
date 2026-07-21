# 04 — Projection Engine

> **Extracted from:** IntegrateWise Platform Specification Suite
> **Region:** first_pass
> **Original line:** 753
> **Lines:** 27 | **Chars:** 1,147
> **Status:** Raw extraction — requires review and canonicalization

04 — Projection Engine
4.1 Responsibilities
Project the Spine into Workbench, Persona, Workspace, and React components.
Own cursor strategy, pagination, widget layouts, and per-persona defaults.
4.2 Pipeline
CopySpine (02) ──▶ Projection Engine ──▶ Persona (06) ──▶ Workspace (03) ──▶ React Components (18)
4.3 Inputs
Spine reads (with as*of).
Persona fits from tenant_spine_config.
Workspace layout ref.
User viewport, locale, density.
4.4 Outputs
Render-tree JSON (workbench), iframe-bundle (webview), push payload (mobile/Slack).
4.5 Events
Produced: ProjectionBuilt, ProjectionStale, ProjectionInvalidated.
Consumed: every evt*… from Spine (02), PersonaChanged, WorkspaceSwitched.
4.6 APIs
POST /project/build, GET /project/{prj_id}?as_of=…, POST /project/{prj_id}/invalidate.
4.7 State transitions
pending → building → fresh → stale → invalid → fresh.

4.8 Failure handling
Incomplete Spine data → render safe-empty with explicit chip (“Evidence partial”).
Persona mismatch → render lockout (Persona Barrier).
4.9 Extension points
Custom widget renderer (Widget SDK, listed under 17).
Custom projection transforms PROJECTION_TRANSFORM(name).

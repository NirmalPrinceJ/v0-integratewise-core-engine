# 03 — Workspace Runtime

> **Extracted from:** IntegrateWise Platform Specification Suite
> **Region:** first_pass
> **Original line:** 715
> **Lines:** 38 | **Chars:** 1,792
> **Status:** Raw extraction — requires review and canonicalization

03 — Workspace Runtime
3.1 Responsibilities
Define the Workspace unit (Personal / Work / Business).
Hold per-workspace context, projections, module set, layout, and persistence.
Handle workspace switching without losing Twin continuity (Continuity Bridge).
3.2 Workspace definition
Copyworkspace_id: wsp_abc
tenant_id: tnt_xyz
type: personal | work | business
persona: { department: CTX_SALES, industry: saas_tech, sub_role: AE }
modules: [leads, accounts, deals, signals]
layout: ref→ prj_layout_01
created_at, updated_at, archived_at
3.3 Lifecycle
Copyinit ──▶ bootstrapping ──▶ active ──▶ suspended ──▶ archived
└──▶ migrated (tenant merge)
3.4 Inputs
Onboarding completion event (per existing spec).
Manual add/remove of modules and layouts.
Administrator actions.
3.5 Outputs
Workbench projection mount points.
Persona-side module compatibility matrix.
Continuity Bridge context bundle (delivered to Twin on switch).
3.6 Events
Produced: WorkspaceCreated, WorkspaceSwitched, WorkspaceModuleAdded, WorkspaceModuleRemoved, WorkspaceArchived, WorkspaceMigrated.
Consumed: onboarding_complete=true, TenantMerged, UserRoleChanged.
3.7 APIs
POST /workspaces, GET /workspaces/{wsp_id}, POST /workspaces/{wsp_id}/switch, POST /workspaces/{wsp_id}/modules/{module_id}, DELETE /workspaces/{wsp_id}/modules/{module_id}.
3.8 State transitions
Switching is a WorkspaceSwitched event and updates user.last_workspace_id; the Twin suspends but does not lose memory.

3.9 Failure handling
Module load failure → fallback to “minimal” module set (always-on: leads, signals, evidence).
Migration failure → block switch, surface diff in Workbench.
3.10 Extension points
Custom modules (see 12).
Custom layouts persisted via 18 (Design Tokens) but routed through Projection Engine (04).

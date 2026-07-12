
Phase 1A-8 — Current vs Target Architecture Matrix
Domain	Current Runtime	Target Architecture	Status
Human identity	Shared-key operator context	Authenticated human principal	Missing
Service identity	Implicit/runtime-specific	Authenticated service principal	Missing / partial
System actor	Metadata and defaults	Canonical system principal	Missing / partial
Workspace	No canonical runtime	Workspace authority boundary	Missing
Workspace ownership	Manual proof hint	Principal-to-workspace ownership	Missing
Workspace membership	None proven	Durable membership contract	Missing
Project membership	None proven	Workspace/project scoped membership	Missing
Active workspace	None	Authenticated selected workspace	Missing
Active project	Frontend transient selection	Authorized project context	Partial
Project runtime	Implemented	Project under workspace	Present
Project path isolation	Implemented	Retain and extend	Present
Effective permissions	Keys + route classifications	Principal + membership + RBAC/ABAC	Missing
Route security	Implemented	Retain under effective permissions	Present
Governance	Implemented	Principal-aware governance	Present / partial
Approval identity	Text metadata	Authenticated approver attribution	Missing
AI-team operational model	Backend Operations Backbone	Versioned universal AI-team contract	Present / partial
AI-team experience model	Frontend model	Projection of canonical role vocabulary	Present / partial
Handoffs	Durable + transient compatibility	Durable canonical handoffs	Present
Data resolver	Project/execution/legacy roots	Workspace/project aware resolver	Present / extend
Knowledge scope	Project-specific and fragmented	Workspace/project knowledge contract	Not yet inventoried
Shared assets	Not canonical	Workspace-shared asset scope	Missing
Shared relationships	Not canonical	Workspace relationship scope	Missing
Business readiness	Partial readiness outputs	Explainable universal readiness	Missing / partial
EOF			

cat > "$DOC_DIR/IDENTITY_WORKSPACE_GAP_REGISTER.md" <<'EOF'

Phase 1A-8 — Identity, Workspace and Project Gap Register
Critical gaps
GAP-IW-001 — Authenticated principal missing

The backend cannot currently resolve a verified human principal for each request.

GAP-IW-002 — Workspace membership missing

No canonical membership proves that a principal may access a workspace.

GAP-IW-003 — Project membership missing

Project path or project selection does not prove permission to access project data.

GAP-IW-004 — Effective permission resolver missing

There is no canonical resolver combining:

Principal
+ Workspace membership
+ Project membership
+ Role
+ Capability
+ Action
+ Resource
+ Risk
+ Governance policy
GAP-IW-005 — Authenticated approval attribution missing

Approval metadata is not proven to be bound to an authenticated reviewer.

SEC-1A8-001 — Exposed control credential

A control credential appeared in terminal evidence and environment backup data.

Required future action:

rotate the credential;
invalidate the old value;
inspect tracked/untracked backup exposure;
verify secret-scanning and ignore rules;
do not perform this mutation during Phase 1A-8.
High gaps
GAP-IW-006 — Workspace runtime missing

Workspace currently exists as approved target architecture only.

GAP-IW-007 — Role vocabulary drift

Backend operational role IDs and frontend experience role IDs differ.

Examples:

writer                 ↔ content_writer
designer               ↔ media_director
analyst                ↔ seo_insights_analyst
ads_operator           ↔ ads_optimizer

Some frontend roles do not have direct backend equivalents.

GAP-IW-008 — Frontend fallback authority debt

Frontend fallback maps remain necessary for compatibility but must never be
treated as security enforcement.

GAP-IW-009 — Owner-workspace proof is non-authoritative

owner_workspace proof is boolean/manual evidence and does not resolve real
workspace ownership.

Medium gaps
GAP-IW-010 — Active project is transient UI context

Frontend project selection is not an authenticated authorization context.

GAP-IW-011 — Transient context fallback

Shared frontend caches support UX continuity but are not durable authority.

GAP-IW-012 — Workspace-aware data roots absent

The resolver understands project, execution and legacy roots, but not canonical
workspace ownership.

Preserved strengths
project isolation;
project-scoped runtime;
Operations Backbone;
route risk catalog;
runtime security enforcement;
governance mutation gate;
approval records;
durable handoffs;
authority projection boundary;
compatibility-aware data resolver.

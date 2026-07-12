# Phase 1A-8 — Identity, Workspace and Project Gap Register

## Critical gaps

### GAP-IW-001 — Authenticated principal missing

The backend cannot currently resolve a verified human principal for each request.

### GAP-IW-002 — Workspace membership missing

No canonical membership proves that a principal may access a workspace.

### GAP-IW-003 — Project membership missing

Project path isolation or frontend project selection does not prove permission to access project data.

### GAP-IW-004 — Effective permission resolver missing

There is no canonical resolver combining:

```text
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

Approval and audit metadata are not proven to be bound to an authenticated reviewer or actor.

SEC-1A8-001 — Exposed control credential

A control credential appeared in terminal evidence and environment backup data.

Required future action:

rotate the exposed credential;
invalidate the previous value;
inspect tracked and untracked backup exposure;
verify ignore rules and secret scanning;
do not perform credential mutation during Phase 1A-8.
High gaps
GAP-IW-006 — Canonical Workspace runtime missing

Workspace currently exists as approved target architecture only.

GAP-IW-007 — Role vocabulary drift

Backend operational roles and frontend experience roles use different identifiers.

Examples:

writer       ↔ content_writer
designer     ↔ media_director
analyst      ↔ seo_insights_analyst
ads_operator ↔ ads_optimizer

Some frontend experience roles do not yet have direct backend operational equivalents.

GAP-IW-008 — Frontend compatibility fallback remains

Frontend fallback route rules remain necessary for degraded or startup behavior, but they are not a security boundary.

GAP-IW-009 — Owner-workspace proof is non-authoritative

The current owner-workspace proof is a boolean/manual request signal and does not resolve a real workspace owner or membership.

Medium gaps
GAP-IW-010 — Active project is transient UI context

Frontend project selection does not establish authenticated authorization.

GAP-IW-011 — Transient shared context

Frontend shared-context caches improve UX continuity but do not replace durable backend handoffs or project state.

GAP-IW-012 — Workspace-aware storage ownership absent

The current resolver understands project, execution and legacy roots but does not model canonical Workspace ownership.

GAP-IW-013 — Shared assets and relationships are not canonical

Workspace-shared assets and relationships remain target concepts and have no proven runtime authority.

GAP-IW-014 — Knowledge and readiness ownership remain unresolved

Knowledge, memory, learning, foundation and readiness ownership require their own source inventories before contract freeze.

Preserved strengths

The following capabilities must be retained:

project runtime;
project slug and path isolation;
compatibility-aware data resolver;
Operations Backbone;
route risk classification;
runtime security enforcement;
governance mutation gates;
approval records;
durable handoffs;
frontend authority projection boundary;
project-scoped operational data.

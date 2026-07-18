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
```
GAP-IW-005 — Authenticated approval attribution missing

Approval metadata is not proven to be bound to an authenticated reviewer.

Security gap
SEC-1A8-001 — Exposed control credential

A control credential appeared in terminal evidence and environment backup data.

Required future action:

rotate the credential;
invalidate the old value;
inspect exposure;
verify secret scanning;
do not perform credential mutation during Phase 1A-8.
High gaps
GAP-IW-006 — Workspace runtime missing

Workspace currently exists as approved target architecture only.

GAP-IW-007 — Role vocabulary drift

Backend operational role IDs and frontend experience role IDs differ.

Examples:

writer ↔ content_writer
designer ↔ media_director
analyst ↔ seo_insights_analyst
ads_operator ↔ ads_optimizer
GAP-IW-008 — Frontend fallback authority debt

Frontend fallback maps remain compatibility only and are not a security boundary.

GAP-IW-009 — Owner-workspace proof is non-authoritative

Boolean proof does not establish workspace ownership.

Medium gaps
GAP-IW-010 — Active project is transient UI context

Frontend selection is not authenticated authorization.

GAP-IW-011 — Transient shared context

Frontend caches do not replace durable backend state.

GAP-IW-012 — Workspace-aware storage ownership absent

Resolver is project aware but not workspace ownership aware.

GAP-IW-013 — Shared assets and relationships not canonical

Workspace-shared assets and relationships remain target concepts and require future inventory before runtime authority is assigned.

GAP-IW-014 — Knowledge and readiness ownership unresolved

Knowledge, memory, learning, foundation and readiness ownership require dedicated source inventories before contract freeze.

Preserved strengths
Project runtime
Project isolation
Operations Backbone
Route security
Governance gates
Approval records
Durable handoffs
Authority projection
Data resolver

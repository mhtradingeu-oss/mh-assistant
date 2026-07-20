# Phase 1A-8 — Identity, Workspace and Project Gap Register

Status: Reconciled current gap register at baseline `baf62a747f5defa51fa1376eb63272cd965a15b3`. Workspace lifecycle and Workspace-to-Project relationship gaps are closed by the [runtime truth supplement](IDENTITY_WORKSPACE_RUNTIME_TRUTH_SUPPLEMENT.md); current precedence is defined by the [Phase 1A universal reconciliation](../architecture/PHASE_1A_UNIVERSAL_CONTRACT_RECONCILIATION.md). Principal, membership, ownership, Organization, and effective permission gaps remain open.

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

### GAP-IW-005 — Authenticated approval attribution missing

Approval metadata is not proven to be bound to an authenticated reviewer.

## Security gap

### SEC-1A8-001 — Exposed control credential

A control credential appeared in terminal evidence and environment backup data.

Required future action:

- Rotate the credential.
- Invalidate the old value.
- Inspect exposure.
- Verify secret scanning.
- Do not perform credential mutation during Phase 1A-8.

## High gaps

### GAP-IW-006 — Workspace runtime missing — CLOSED / SUPERSEDED

The historical gap is closed for Workspace schema, durable storage, lifecycle mutations, versioned Workspace-to-Project relationships, Project projection, drift inspection, and bounded reconciliation. The Workspace foundation does not close authenticated principal, Workspace ownership/membership, Project membership, Organization, effective permissions, or universal Workspace ownership of other domains.

### GAP-IW-007 — Role vocabulary drift

Backend operational role IDs and frontend experience role IDs differ.

Examples:

- `writer` ↔ `content_writer`
- `designer` ↔ `media_director`
- `analyst` ↔ `seo_insights_analyst`
- `ads_operator` ↔ `ads_optimizer`

### GAP-IW-008 — Frontend fallback authority debt

Frontend fallback maps remain compatibility only and are not a security boundary.

### GAP-IW-009 — Owner-workspace proof is non-authoritative

Boolean proof does not establish workspace ownership.

## Medium gaps

### GAP-IW-010 — Active project is transient UI context

Frontend selection is not authenticated authorization.

### GAP-IW-011 — Transient shared context

Frontend caches do not replace durable backend state.

### GAP-IW-012 — Workspace-aware storage ownership absent — PARTIALLY SUPERSEDED

Workspace storage now durably owns Workspace persistence mechanics. Project and domain stores remain separate; no universal Workspace ownership resolver or authenticated access decision exists.

### GAP-IW-013 — Shared assets and relationships not canonical — NARROWED

Workspace-to-Project relationships now have a durable versioned authority. Workspace-shared assets and generic shared relationship/CRM domains remain non-canonical and require separate adoption decisions.

### GAP-IW-014 — Knowledge and readiness ownership unresolved — PARTIALLY SUPERSEDED

Phase 1A now documents the federated knowledge, memory, learning, foundation, and readiness owners. Unified runtime policy, cross-scope grants, provenance/retention, and universal readiness semantics remain deferred; the documentation records do not create new mutation owners.

## Preserved strengths

- Workspace contract, storage, and lifecycle runtime
- Workspace-to-Project relationship authority
- Project Workspace projection, drift inspection, and bounded reconciliation
- Project runtime
- Project isolation
- Operations Backbone
- Route security
- Governance gates
- Approval records
- Durable handoffs
- Authority projection
- Data resolver

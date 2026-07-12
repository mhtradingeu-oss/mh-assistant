# Phase 1A-8 — Current Identity, Workspace and Project Architecture Truth

## Status

Audit complete.

## Repository baseline

- Branch: main
- Baseline HEAD: e3285d15981caf34e5547f343efac4435303e1f0
- Baseline divergence from origin/main: 0 0
- Baseline working tree changes: 0

The baseline must be reverified before later implementation.

## Current identity authority

MH-OS does not currently have a canonical authenticated-principal runtime.

The current access model is primarily:

```text
Shared read/write control key
→ Route classification
→ Runtime security enforcement
→ Governance gate
→ Approval/manual proof
→ Execution

The current runtime does not prove:

authenticated human identity;
service principal identity;
workspace membership;
project membership;
effective permission resolution;
authenticated reviewer attribution.

Metadata fields such as requested_by, approved_by, actor, and source
are not proven to originate from an authenticated principal.

Current workspace state

A canonical MH-OS Workspace runtime is not implemented.

Existing workspaceId and organizationId references found in Integrations
represent external provider identifiers and must not be treated as MH-OS
Workspace authority.

Missing runtime concepts include:

principal_id;
workspace_id;
membership_id;
workspace ownership;
project membership;
active workspace authority;
effective permission resolver.
Current project state

Project is the current operational scope.

The current runtime includes:

project discovery;
project creation;
project setup persistence;
project-scoped operations;
project-scoped AI commands;
project-scoped workflows;
project-scoped tasks, jobs, approvals and handoffs;
project-scoped assets, integrations and publishing;
project slug validation;
project-root path containment.

Project selection in the frontend is transient UI context. It does not establish
ownership, membership, or authorization.

Current project isolation

The runtime validates project slugs and prevents path traversal through:

normalizeProjectSlug;
resolveProjectPath;
resolvePathWithinRoot;
root-containment checks.

This is filesystem/path isolation, not user authorization.

Current data-path architecture

The current data resolver supports:

project root;
execution root;
legacy root;
canonical-first reads;
compatibility fallback reads;
mirror writes;
telemetry and source decisions.

This existing migration infrastructure must be reused rather than replaced.

Current AI-team architecture

The backend Operations Backbone produces the operational team model:

team roles;
active role;
role matrix;
route permissions;
service domains;
escalation chains;
ownership and routing projections.

The frontend consumes this through projection helpers.

The frontend also maintains an AI-team experience model for labels, prompts,
page specialists and destination workspaces.

These are different concerns:

Backend model  = operational authority and routing
Frontend model = experience, labels and guidance

They currently contain vocabulary drift and require a versioned compatibility
contract.

Current route authority

Backend security currently uses:

route risk classification;
read/write-key requirements;
provider execution gates;
governance policies;
approval/manual proof requirements.

Frontend route checks are projection and compatibility behavior only.

The frontend fallback route map is not a security boundary.

Current handoff architecture

Handoffs are a real cross-page and durable operational capability.

The system currently uses:

durable backend handoffs;
transient frontend shared-context caches;
handoff creation;
handoff consumption;
project-scoped routing between operational pages.

Transient caches must not replace durable backend handoffs.

Current security issue

A control credential was exposed in collected terminal evidence and exists in an
environment backup file.

Classification:

ID: SEC-1A8-001
Severity: Critical
Status: Open
Action: Rotate the exposed credential after explicit authorization
Constraint: No credential mutation during Phase 1A-8

The exposed value must not be copied into documentation or reused.

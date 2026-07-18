# MH-OS Canonical Architecture

Status: Proposed canonical contract
Scope: Principal, Workspace, Project, Business Identity, API and UI boundaries
Authority: Runtime evidence from Phase 1A-8A through Phase 1A-9

## 1. Purpose

This document defines the canonical architectural model for MH-OS.

It governs entity authority, runtime ownership, persistence ownership, projection boundaries, API composition, UI responsibilities, and future implementation decisions.

No implementation may introduce a competing authority for a capability already owned by one of the layers defined here.

## 2. Canonical Entity Model

```text
Security Principal
        |
        | authentication and authorization
        v
Workspace
        |
        | governed operational scope
        v
Project / Business Entity
        |
        | business identity and operating context
        v
AI Growth Operating Runtime
```

The canonical operational hierarchy is:

```text
Principal -> Workspace -> Project
```

Business identity is represented by the Project domain and its project identity authority.

Organization is not currently a runtime authority. It remains a conceptual or future contract layer unless and until a real producer, persistence model, lifecycle contract and ownership relationship are introduced and validated.

## 3. Canonical Authority Matrix

| Layer | Responsibility | Canonical Authority |
|---|---|---|
| Security Principal | Authentication identity adaptation | `runtime/orchestrator-service/lib/security/identity-adapter.js` |
| Security Principal | Operational principal and access context | `runtime/orchestrator-service/lib/ops/backbone.js` |
| Workspace | Runtime lifecycle and mutation authority | `runtime/orchestrator-service/lib/workspace/workspace-runtime.js` |
| Workspace | Persistence authority | `runtime/orchestrator-service/lib/workspace/workspace-storage.js` |
| Workspace | Schema, validation and transition contract | `runtime/orchestrator-service/lib/workspace/workspace-contract.js` |
| Workspace | Workspace-to-project relationship lifecycle | `runtime/orchestrator-service/lib/workspace/workspace-relationship-runtime.js` |
| Project | Canonical project identity | `runtime/orchestrator-service/lib/projects/project-identity.js` |
| Project | Workspace projection stored with the project | `runtime/orchestrator-service/lib/projects/project-workspace-projection.js` |
| API | Route exposure and composition boundary | `runtime/orchestrator-service/server.js` |
| UI | Read projection and user experience | Control Center frontend modules |
| Documentation | Architectural description | Derived from runtime and this contract |

## 4. Domain Definitions

### 4.1 Security Principal

A Security Principal represents the authenticated or authorized actor interacting with MH-OS.

A principal is not a Project, a brand, a customer profile, an integration account, or a Workspace business identity.

Authentication identity and business identity must remain distinct.

### 4.2 Workspace

A Workspace is the canonical governed operational boundary.

A Workspace contains or scopes Projects, AI team configuration, knowledge, governance, integrations, runtime policies, shared assets, relationships, and workspace-level operating state.

The Workspace runtime is authoritative for Workspace lifecycle and mutations.

The Workspace storage module is authoritative only for persistence mechanics. It must not become a competing business runtime.

### 4.3 Project / Business Entity

A Project is the canonical universal business entity operated inside a Workspace.

A Project may represent a brand, artist, creator, application, SaaS product, clinic, restaurant, salon, agency, store, accounting application, or any other business, product or operating entity.

These are Project configurations or templates, not separate top-level runtime entity types.

### 4.4 Project Identity

Project Identity is the canonical business identity authority for a Project.

It owns the durable project identifier and canonical identity record required for project discovery and Workspace attachment.

Project Identity is distinct from Security Principal, customer profile, provider account, social account, and brand presentation data.

### 4.5 Workspace-Project Relationship

The Workspace-to-Project relationship is governed by the Workspace relationship runtime.

It owns attach lifecycle, detach lifecycle, relationship state, relationship evidence, conflict handling, and recovery behavior.

The relationship runtime must validate both Workspace and Project authorities. It must not create a competing Workspace or Project identity.

### 4.6 Project Workspace Projection

The Project Workspace Projection is a derived, project-local representation of the authoritative Workspace relationship.

It is not the relationship authority.

Projection state must be inspectable, drift-detectable, reconcilable, and subordinate to the authoritative Workspace relationship runtime.

### 4.7 Organization

Organization is not an active canonical runtime layer in the current architecture.

No Organization runtime may be introduced merely to match documentation vocabulary.

Organization can become a runtime layer only after approval of a canonical identifier, lifecycle contract, persistence authority, producer, consumers, Workspace ownership semantics, migration behavior, and security boundaries.

Until then, Workspace is the operational organizational boundary.

## 5. Non-Negotiable Invariants

1. Backend runtime is authoritative; frontend is a projection and experience layer.
2. A Project must be scoped through a valid Workspace relationship.
3. A project-local Workspace projection must never outrank the authoritative relationship runtime.
4. Persistence modules store validated records but do not invent business authority.
5. `server.js` composes and exposes runtime capabilities; it is not an entity Source of Truth.
6. Authentication Principal and Project Business Identity must never be silently merged.
7. Provider accounts, customer profiles and user-facing profiles are contextual records, not canonical Workspace or Project identity.
8. Organization and tenant concepts remain non-authoritative until a complete runtime contract exists.
9. Every new entity authority requires producer, consumer, persistence, contract, validation and migration evidence.
10. Existing capabilities must be discovered and reused before any new runtime is created.
11. Architectural changes follow Truth Scan -> Capability Discovery -> Producer/Consumer Mapping -> Source-of-Truth Decision -> Confirm -> Decide -> Contract Design -> Narrow Implementation -> Validation -> Commit -> Push.
12. Unrelated repository work must remain untouched.

## 6. Allowed Dependency Direction

```text
Contracts / Validation
        |
        v
Persistence
        |
        v
Domain Runtime
        |
        v
Relationships / Projections
        |
        v
API Composition
        |
        v
Frontend Projection
```

Cross-domain calls must use the public runtime contract of the authority-owning domain.

No frontend module may write canonical Workspace or Project state directly.

## 7. Projection Doctrine

A projection may cache or present authoritative state, support UI composition, be reconciled, be replaced, and expose drift. It must never become a hidden write authority.

The following are projections:

- project-local Workspace projection;
- Control Center view state;
- workspace dashboards;
- summaries and reporting views.

## 8. Universal Business Template Doctrine

Business types are templates over Project, not new root entities.

A business template may define default fields, workflows, AI specialists, capabilities, integrations, compliance rules, analytics models, and content or media defaults.

A template must not create a second Project authority.

## 9. Current Canonical Decisions

- Workspace is the top-level operational scope.
- Project is the universal business entity.
- Project Identity is the business identity authority.
- Security Principal is separate from business identity.
- Workspace relationship runtime owns Workspace-to-Project membership.
- Project Workspace Projection is derived.
- Organization is not currently a runtime authority.
- `server.js` is an API and composition boundary.
- UI remains a projection layer.

## 10. Change Governance

Any proposal that changes this architecture must include truth-scan evidence, current producer and consumer mapping, an explicit Source-of-Truth decision, compatibility impact, migration plan, rollback plan, regression tests, and documentation alignment.

No architectural authority may be changed through an isolated UI patch or undocumented server route.

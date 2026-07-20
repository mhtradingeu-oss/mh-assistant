# MH-OS Workspace Authority Contract Design

## Status

Historical design proposal with a current-runtime supplement.

This document did not create runtime implementation. Since its original baseline, Workspace schema, durable storage, lifecycle runtime, Workspace-to-Project relationship authority, Project projection, drift inspection, and bounded reconciliation have been implemented. Current Phase 1A precedence is defined by the [Phase 1A universal reconciliation](../contracts/architecture/PHASE_1A_UNIVERSAL_CONTRACT_RECONCILIATION.md).

Existing project and security boundaries remain authoritative.

The implemented Workspace foundation does not establish Organization authority, authenticated principal or ownership, Workspace/Project membership, effective permissions, or universal Workspace ownership of every domain. The future membership and authority portions below remain proposals.

---

# 1. Objective

Preserve the original future Workspace Authority model while distinguishing it from the implemented Workspace lifecycle and relationship foundation.

Workspace becomes the primary operating boundary for:

- identity
- projects
- data
- AI context
- integrations
- policies
- permissions
- evidence

---

# 2. Workspace Model

Original target Workspace (only the lifecycle/relationship subset is currently established):


Workspace

workspace_id
name
owner_principal
status
lifecycle
projects
members
policies
integrations
evidence_scope

---

# 3. Authority Relationship

Future relationship:


Principal

↓

Workspace

↓

Project

↓

Resource

↓

Action

↓

Policy

↓

Decision


---

# 4. Current Foundations

Existing foundations:

| Area | Current Capability |
| --- | --- |
| Workspace contract | Versioned schema, validation, transition and relationship contract |
| Workspace storage | Durable contained persistence, atomic replacement and recovery classifications |
| Workspace runtime | Lifecycle creation, reads, transitions, version checks and explicit mutation |
| Workspace relationship | Versioned Workspace-to-Project attach/detach lifecycle |
| Projection and drift | Project-side Workspace projection, inspection and bounded reconciliation |
| Identity | Authority context exists, but authenticated principal/membership authority remains missing |
| Projects | Project isolation and path boundaries |
| Security | Existing runtime gates |
| Evidence | Shadow evidence architecture |

---

# 5. Workspace Responsibilities

The original target proposed that Workspace would own the following. Current runtime proves Workspace lifecycle and Workspace-to-Project relationship ownership only; the remaining domain ownership requires separate adoption:

- project boundaries
- AI context boundaries
- data ownership boundaries
- integration ownership
- policy scope
- permission scope
- evidence scope

---

# 6. Migration Principles

Workspace Authority must:

- preserve existing project isolation
- preserve current runtime security
- introduce adapters before replacement
- validate through shadow comparison

---

# 7. Non Goals

This phase does not create:

- a second Workspace store or lifecycle runtime
- user management
- membership runtime
- permission enforcement
- RBAC replacement

---

# 8. Next Step

BE-2.5:

Use the current universal reconciliation and runtime truth supplement before any future membership or authority adoption.

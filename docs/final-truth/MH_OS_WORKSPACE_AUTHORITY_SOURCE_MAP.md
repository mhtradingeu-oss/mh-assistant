# MH-OS Workspace Authority Source Map

## Status

Historical source map updated with the implemented Workspace foundation.

Workspace lifecycle and Workspace-to-Project relationship authority are implemented. This map remains documentation and does not itself own runtime state. See the [Phase 1A universal reconciliation](../contracts/architecture/PHASE_1A_UNIVERSAL_CONTRACT_RECONCILIATION.md).

Existing project and security boundaries remain authoritative.

Organization, authenticated principal, Workspace/Project membership, ownership, and effective permission resolution are not implemented authorities.

---

# 1. Objective

Document current workspace-related concepts and define the future canonical Workspace Authority direction.

---

# 2. Current Workspace Sources

| Source | Current Meaning |
| --- | --- |
| `runtime/orchestrator-service/lib/workspace/workspace-contract.js` | Workspace and relationship schema, validation and transition contract |
| `runtime/orchestrator-service/lib/workspace/workspace-storage.js` | Workspace persistence mechanics |
| `runtime/orchestrator-service/lib/workspace/workspace-runtime.js` | Workspace lifecycle and mutation authority |
| `runtime/orchestrator-service/lib/workspace/workspace-relationship-runtime.js` | Workspace-to-Project relationship lifecycle authority |
| `runtime/orchestrator-service/lib/projects/project-identity.js` | Separate Project identity authority |
| `runtime/orchestrator-service/lib/projects/project-workspace-projection.js` | Derived Project-side Workspace projection writer; not relationship authority |
| Workspace projection orchestrator, drift inspector, reconciliation contract/executor | Coordination, read-only drift classification, bounded planning and owner-delegating execution; no duplicate owner |
| Business Templates | Workspace-like operating presets |
| Frontend Shell | Workspace presentation and context rendering |
| AI Team Contracts | Workspace ownership expectations |
| Integration Providers | External provider workspace references |
| Identity Context | Future workspace context placeholder |
| Project Isolation | Existing project boundary |

---

# 3. Current Truth

Current system has:

- canonical Workspace schema, storage and lifecycle authority
- versioned Workspace-to-Project relationship authority
- Project Workspace projection, drift inspection and bounded reconciliation
- project isolation
- non-authoritative ownership proof hints
- workspace UI projections

Current system does not have:

- workspace membership authority
- authenticated Workspace ownership authority
- effective permission resolution
- Organization authority
- workspace policy boundary

---

# 4. Future Canonical Workspace Authority

Original future authority model (identity/lifecycle and relationship foundations now exist; ownership, membership, policy and evidence authority remain deferred):


Workspace Identity

Ownership

Lifecycle

Project Relationship

Policy Boundary

Evidence Boundary


---

# 5. Authority Rules

Workspace Authority must:

- remain backend-owned
- preserve project isolation
- support multiple projects
- support AI context isolation
- support policy inheritance

---

# 6. Non Goals

This phase does not create:

- a second Workspace database or lifecycle authority
- membership runtime
- user accounts
- permission enforcement
- project migration

---

# 7. Next Step

BE-2.7:

Use the current runtime truth supplement and universal reconciliation before proposing further ownership or membership work.

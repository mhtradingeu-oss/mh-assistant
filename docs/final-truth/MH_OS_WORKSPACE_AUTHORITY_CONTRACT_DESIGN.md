# MH-OS Workspace Authority Contract Design

## Status

Design proposal only.

No workspace runtime implementation is created.

Existing project and security boundaries remain authoritative.

---

# 1. Objective

Define the future Workspace Authority model for MH-OS.

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

Future Workspace:


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
|---|---|
| Identity | Authority context with workspace placeholder |
| Projects | Project isolation and path boundaries |
| Security | Existing runtime gates |
| Evidence | Shadow evidence architecture |

---

# 5. Workspace Responsibilities

Workspace owns:

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

- workspace database
- user management
- membership runtime
- permission enforcement
- RBAC replacement

---

# 8. Next Step

BE-2.5:

Workspace Authority Source Inventory.

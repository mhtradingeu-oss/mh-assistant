# MH-OS Security Architecture Decision Record

## Status

Decision record.

Security Foundation Phase BE-1 is completed for its defined scope.

---

# 1. Completed Foundation

BE-1 delivered:

- passive identity adapter
- principal assertion context
- runtime security observation
- permission resolver contracts
- evidence contracts
- validation design

---

# 2. Current Authority Model

Current runtime authority remains:


Existing Security Gates

Route Permissions

Provider Gates

Governance Policies

Protected Route Authority


Future layers must not replace these without validation.

---

# 3. Current Security Position

Implemented:

- identity foundation
- decision observation
- evidence architecture

Remaining:

- workspace membership authority
- permission resolver runtime
- credential scope model
- isolation proof

---

# 4. Strategic Decision

Next architecture phase:

BE-2 Workspace Authority Architecture

Reason:

All future permission decisions require:


Principal

Workspace

Project

Action

Resource

Policy


---

# 5. Non Goals

BE-1 did not create:

- RBAC replacement
- user management
- workspace runtime
- permission database
- enforcement migration

---

# 6. Next Phase

BE-2:

Workspace Authority Design.

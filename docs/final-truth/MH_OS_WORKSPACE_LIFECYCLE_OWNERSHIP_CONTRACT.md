# MH-OS Workspace Lifecycle and Ownership Contract

## Status

Historical lifecycle/ownership proposal with current-runtime reconciliation.

Workspace lifecycle, durable storage, and Workspace-to-Project relationship authority are now implemented. Authenticated Workspace ownership, Principal-to-Workspace membership, transfer authority, policy inheritance, and effective permissions remain future-only. See the [Phase 1A universal reconciliation](../contracts/architecture/PHASE_1A_UNIVERSAL_CONTRACT_RECONCILIATION.md).

Existing project and security boundaries remain authoritative.

---

# 1. Objective

Preserve the original ownership proposal and distinguish it from the implemented Workspace lifecycle and relationship foundation.

Workspace authority must provide:

- ownership boundary
- lifecycle state
- project relationship
- policy boundary
- evidence ownership

---

# 2. Workspace Lifecycle

Original lifecycle design; current lifecycle transitions are governed by `workspace-contract.js` and `workspace-runtime.js`, and only their implemented states/transitions are authoritative:


CREATING

↓

ACTIVE

↓

SUSPENDED

↓

ARCHIVED


---

# 3. Ownership Model

Future authenticated ownership model (not implemented):


Principal

↓

Workspace Owner

↓

Workspace Ownership Evidence


---

# 4. Ownership Responsibilities

Workspace owner may define:

- workspace policies
- project relationships
- integration ownership
- evidence scope

Future enforcement requires validation.

---

# 5. Ownership Operations

Original proposed operations. Only operations exposed and validated by the current Workspace runtime are implemented; authenticated claim/transfer authority is not:


Create

Claim

Transfer

Suspend

Archive


---

# 6. Project Relationship

Workspace has durable versioned relationships to Projects:


Workspace

|

+-- Project A
+-- Project B
+-- Project C

Existing project isolation must remain unchanged.

---

# 7. Safety Principles

Workspace lifecycle must:

- remain backend-owned
- preserve project isolation
- preserve current runtime security
- use evidence for ownership decisions
- validate before enforcement

---

# 8. Non Goals

This phase does not create:

- a second workspace runtime or store
- membership system
- user accounts
- permission enforcement

---

# 9. Next Step

BE-2.8:

Validate future ownership and membership separately without replacing the current lifecycle and relationship owners.

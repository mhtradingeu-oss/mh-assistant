# MH-OS Identity Adapter Design

## Status

Design proposal only.

Runtime identity adapter implementation has not started.

This document does not change authentication, authorization, permissions, or security behavior.

---

# 1. Purpose

Define the smallest safe identity adapter boundary for MH-OS.

The adapter extends existing security mechanisms without replacing them.

Target flow:


Existing Authentication

↓

Identity Adapter

↓

Authority Context

↓

Shadow Resolution

↓

Existing Runtime Gates


---

# 2. Current Authentication Boundary

Current runtime already provides:

- control key validation
- protected route checks
- governance gates
- provider execution gates
- project isolation

These remain current authority sources during migration.

---

# 3. Identity Adapter Responsibility

The identity adapter should:

- consume existing authentication result
- create a non-secret identity assertion
- attach request authority context
- preserve compatibility with existing middleware

The adapter must not:

- replace authentication
- create users
- infer human identity from actor strings
- replace governance
- replace permission checks

---

# 4. Principal Assertion

Future adapter output:


principal_id
principal_type
authenticated
authentication_method
source


Supported principal types:

- human
- service
- system

Initial compatibility identity:


legacy-control-center-key
type: service


No human identity is inferred from shared credentials.

---

# 5. Authority Context

Future request context:


principal

workspace_id

project_id

roles

permissions

authentication_source

governance_decision

provider_decision

evidence_references


Workspace membership remains unresolved until a future membership model exists.

---

# 6. Shadow Resolution

Initial mode:

Read and compare only.

Existing gates remain authoritative.

The adapter may produce:


identity decision

permission interpretation

confidence

evidence references


but cannot override existing runtime decisions.

---

# 7. Current Component Reuse

Reuse:

- existing key middleware
- route security catalog
- runtime security enforcement
- governance gates
- project isolation
- authority projection

Do not create duplicate systems.

---

# 8. Migration Boundary

Migration order:


Identity Assertion

↓

Authority Context

↓

Shadow Resolver

↓

Permission Resolver

↓

Workspace Membership

↓

Future Enforcement Migration


Each step requires validation before adoption.

---

# 9. Non Goals

This phase does not create:

- login system
- user registration
- OAuth
- SSO
- new RBAC package
- database migration
- frontend authority

---

# 10. Next Step

BE-1.5:

- inspect implementation ownership
- select adapter location
- design minimal runtime patch
- validate through shadow mode

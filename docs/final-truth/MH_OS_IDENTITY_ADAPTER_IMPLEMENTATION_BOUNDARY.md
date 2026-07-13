# MH-OS Identity Adapter Implementation Boundary

## Status

Implementation boundary proposal only.

No runtime changes are implemented by this document.

---

# 1. Objective

Introduce a passive identity observation layer without replacing existing authentication or authorization.

Target:


Existing Authentication

↓

Identity Adapter

↓

Authority Context

↓

Shadow Observation

↓

Existing Runtime Decisions


---

# 2. Allowed Runtime Changes

## New module


runtime/orchestrator-service/lib/security/identity-adapter.js


Responsibilities:

- create compatibility principal assertion
- build authority context
- sanitize evidence
- record shadow observations

---

## server.js

Allowed:

- import adapter
- attach context after successful authentication
- enrich context after existing project resolution
- record existing decisions

Forbidden:

- changing request outcomes
- changing middleware order
- replacing security guards

---

## runtime-security-enforcement.js

Allowed:

- optional observer callback

Forbidden:

- changing allow/deny decisions
- recalculating authorization

---

# 3. Authority Boundary

During BE-1.7:

Existing runtime remains authority.

The adapter explains decisions.

It does not authorize.

---

# 4. Context Contract

Initial context:


principal
authentication
workspace_id
project_id
roles
permissions
governance
provider_decisions
evidence


Rules:

- no credentials
- no actor trust
- no frontend roles
- no synthesized workspace
- no granted permissions

---

# 5. Forbidden Changes

Do not introduce:

- authentication replacement
- RBAC system
- user database
- workspace database
- permission migration
- frontend authority
- governance rewrite
- credential changes

---

# 6. Validation Requirements

Required:

- adapter tests
- security regression tests
- middleware ordering checks
- governance regression checks
- project isolation checks

---

# 7. Rollback

Implementation must be isolated and reversible.

Rollback:


git revert <commit>


No migration rollback required.

---

# 8. Next Step

BE-1.7:

Controlled implementation of passive identity adapter.

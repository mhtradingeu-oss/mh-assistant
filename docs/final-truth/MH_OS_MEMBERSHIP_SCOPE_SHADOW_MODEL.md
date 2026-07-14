# MH-OS Membership and Scope Shadow Model

## Status

Design proposal only.

No membership or scope runtime is implemented.

Existing AI roles, security gates, and capability sources remain authoritative.

---

# 1. Objective

Define a shadow comparison model between current role-based capabilities and future membership scope architecture.

The shadow model observes differences without changing runtime behavior.

---

# 2. Current Model Input

Current system context:


AI Roles

Role Matrix

Action Permissions

Service Domains

Required Scopes


---

# 3. Future Model Input

Future membership context:


Membership

Scope Assignment

Capability Access

Resource Context

Evidence


---

# 4. Shadow Comparison


Current Authority Model

    VS

Future Membership Scope Model

    ↓

Comparison Result


---

# 5. Comparison Results

Possible states:


MATCH

PARTIAL

CONFLICTING

UNTRUSTED


---

# 6. Comparison Areas

Shadow evaluation compares:

- role capability mapping
- scope compatibility
- capability alignment
- resource boundaries
- evidence availability

---

# 7. Safety Rules

Shadow model:

- cannot create memberships
- cannot assign scopes
- cannot grant permissions
- cannot modify roles
- cannot replace security gates

---

# 8. Non Goals

This phase does not create:

- membership runtime
- scope database
- permission runtime
- RBAC migration
- authorization enforcement

---

# 9. Next Step

BE-3.6:

Membership Scope Architecture Review.

# MH-OS Permission Resolver Contract Design

## Status

Design proposal only.

No runtime permission replacement is implemented.

Existing security authorities remain authoritative.

---

# 1. Objective

Define a future unified permission decision contract.

The resolver normalizes existing security decisions without replacing them.

Target:


Principal

Action

Resource

Context

Policy

↓

Normalized Decision


---

# 2. Current Decision Sources

Existing authorities:

| Source | Responsibility |
|---|---|
| Route Permission Catalog | Route scope classification |
| Provider Execution Gate | Provider action authorization |
| Governance Mutation Gate | Policy and approval decisions |
| Protected Route Authority | Protected endpoint decisions |

---

# 3. Permission Request Contract

Future request shape:


PermissionRequest

principal
action
resource
context
policy_context
evidence

---

# 4. Permission Decision Contract

Future normalized decision:


PermissionDecision

decision
allowed
reason
source
required_scope
evidence
confidence
audit_reference

---

# 5. Resolver Role

The Permission Resolver:

- normalizes decisions
- explains decisions
- compares existing authorities
- provides shadow evaluation

It does not:

- replace existing enforcement
- grant permissions
- create roles
- manage users

---

# 6. Migration Strategy

Phase approach:


Existing Authorities

↓

Resolver Shadow Mode

↓

Decision Comparison

↓

Validated Adoption


---

# 7. Non Goals

This phase does not create:

- RBAC replacement
- user management
- workspace membership
- permission database
- enforcement migration

---

# 8. Next Step

BE-1.11.4:

Permission Resolver Shadow Design.

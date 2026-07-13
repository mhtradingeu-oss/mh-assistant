# MH-OS Permission Resolver Shadow Design

## Status

Design proposal only.

No permission enforcement change is implemented.

Existing security authorities remain authoritative.

---

# 1. Objective

Define a shadow evaluation model for the future Permission Resolver.

The shadow resolver compares future normalized decisions against current runtime authorities.

It does not control execution.

---

# 2. Shadow Evaluation Model


Permission Request

    +

Existing Security Decisions

    +

Future Resolver Evaluation

    ↓

Difference Report


---

# 3. Shadow Request Contract

Future shadow input:


principal

action

resource

context

existing_decisions

evidence


---

# 4. Existing Decision Sources

Shadow comparison may consume:

| Source | Current Authority |
|---|---|
| Route Permission Catalog | Route scope decisions |
| Provider Execution Gate | Provider execution decisions |
| Governance Mutation Gate | Policy and approval decisions |
| Protected Route Authority | Protected endpoint decisions |

---

# 5. Shadow Result Contract

Future output:


ShadowPermissionResult

existing_decision
resolver_decision
match_status
difference_reason
evidence
confidence

---

# 6. Safety Rules

Shadow resolver:

- cannot authorize requests
- cannot deny requests
- cannot change runtime behavior
- cannot bypass approvals
- cannot replace existing policies

---

# 7. Validation Strategy


Observe

↓

Compare

↓

Analyze Differences

↓

Validate

↓

Future Adoption Decision


---

# 8. Non Goals

This phase does not create:

- RBAC system
- user roles
- workspace permissions
- permission database
- runtime enforcement changes

---

# 9. Next Step

BE-1.11.5:

Permission Resolver Shadow Validation Plan.

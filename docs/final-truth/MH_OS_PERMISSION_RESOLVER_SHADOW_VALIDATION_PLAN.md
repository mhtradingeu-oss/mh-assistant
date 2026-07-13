# MH-OS Permission Resolver Shadow Validation Plan

## Status

Design proposal only.

No permission enforcement change is implemented.

Existing security authorities remain authoritative.

---

# 1. Objective

Define how the future Permission Resolver is validated safely.

The validation compares future resolver decisions against current runtime decisions.

---

# 2. Validation Model


Existing Security Decision

    VS

Future Resolver Decision

    ↓

Comparison Result

    ↓

Evidence Report


---

# 3. Validation Inputs

Each comparison should include:


principal

action

resource

context

existing_decision

resolver_decision

evidence


---

# 4. Comparison Categories

## MATCH

Current and future decisions agree.

---

## REVIEW_REQUIRED

Difference exists but requires analysis.

---

## CRITICAL_CONFLICT

Future resolver creates broader permission than current authority.

---

# 5. Safety Requirements

Validation must prove:

- no unexplained allow expansion
- no missing deny protections
- decision source is known
- evidence is available
- comparison is reproducible

---

# 6. Validation Sources

Current sources:

| Source | Validation Target |
|---|---|
| Route Permission Catalog | Route decisions |
| Provider Execution Gate | Provider decisions |
| Governance Mutation Gate | Policy decisions |
| Protected Route Authority | Endpoint decisions |

---

# 7. Adoption Criteria

Permission Resolver adoption requires:


Observe

↓

Compare

↓

Analyze

↓

Validate

↓

Approved Migration Decision


---

# 8. Non Goals

This validation does not create:

- RBAC replacement
- permission enforcement
- user management
- workspace permissions
- database migration

---

# 9. Next Step

BE-1.12:

Permission Resolver Evidence Contract.

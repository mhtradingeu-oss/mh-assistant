# MH-OS Permission Evidence Contract Design

## Status

Design proposal only.

No audit, security, or permission runtime replacement is implemented.

Existing evidence sources remain authoritative.

---

# 1. Objective

Define a future unified evidence contract for permission decisions.

The contract explains:

- why a decision happened
- which authority produced it
- which evidence supported it
- how it can be audited

---

# 2. Evidence Model


Decision

Authority Source

Reason

Policy Context

Evidence Items

Provenance

Confidence

↓

Explainable Decision Record


---

# 3. Evidence Contract

Future evidence record:


EvidenceRecord

evidence_id
decision_reference
source_authority
reason
policy_reference
scope
evidence_items
provenance
confidence
audit_reference

---

# 4. Existing Evidence Sources

| Source | Existing Evidence |
|---|---|
| Provider Execution Gate | provider decision, reason, audit event |
| Governance Gate | policy decision, approval state, reason |
| Protected Route Authority | proof object and authority decision |
| Route Permission Catalog | route scope and audit classification |
| Identity Adapter | sanitized shadow evidence |

---

# 5. Safety Rules

Evidence Contract:

- does not change decisions
- does not grant permissions
- does not replace audit systems
- does not replace governance
- does not replace security enforcement

---

# 6. Shadow Compatibility

Evidence can support:


Existing Decision

Future Resolver Decision

↓

Explainable Comparison


---

# 7. Non Goals

This phase does not create:

- new audit database
- permission runtime
- RBAC system
- policy migration
- enforcement changes

---

# 8. Next Step

BE-1.12.3:

Evidence Contract Validation Design.

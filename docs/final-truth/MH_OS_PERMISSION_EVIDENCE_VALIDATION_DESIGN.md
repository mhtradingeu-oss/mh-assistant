# MH-OS Permission Evidence Validation Design

## Status

Design proposal only.

No evidence validation runtime is implemented.

Existing security and evidence sources remain authoritative.

---

# 1. Objective

Define a future validation model for permission evidence.

The validator determines whether evidence supporting a decision is complete, traceable, and trustworthy.

It does not change the decision.

---

# 2. Validation Model


Decision

Evidence Record

Source Authority

↓

Evidence Validation Result


---

# 3. Validation Result Contract

Future result:


EvidenceValidationResult

evidence_complete
source_verified
decision_reference_valid
provenance_valid
confidence
validation_status

---

# 4. Validation Status

Possible states:


VALID

PARTIAL

MISSING

CONFLICTING

UNTRUSTED


---

# 5. Validation Checks

Validator should verify:

- evidence source identity
- decision reference consistency
- provenance availability
- required evidence presence
- comparison reproducibility

---

# 6. Existing Evidence Sources

Validation consumes evidence from:

| Source | Evidence |
|---|---|
| Provider Execution Gate | decision, reason, audit event |
| Governance Gate | policy decision, approval state |
| Protected Route Authority | proof object |
| Route Permission Catalog | scope classification |
| Identity Adapter | sanitized shadow evidence |

---

# 7. Safety Rules

Evidence validation:

- cannot authorize requests
- cannot deny requests
- cannot modify evidence owners
- cannot replace audit systems
- cannot replace governance decisions

---

# 8. Non Goals

This phase does not create:

- evidence database
- immutable ledger
- permission runtime
- RBAC migration
- enforcement changes

---

# 9. Next Step

BE-1.12.4:

Evidence Validation Shadow Plan.

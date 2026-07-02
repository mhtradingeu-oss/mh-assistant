# T156 — Governance Runtime Authority + UX Risk Audit

## Status
Audit only. No implementation.

## Baseline
- `7859f98 Close Operations UX polish phase`

## Purpose
Establish the current truth of the Governance surface before any UX or CSS improvement.

Governance is high-risk because it may involve:
- approvals
- safety gates
- decision lifecycle
- mutation permissions
- backend-owned execution authority
- provider / integration / publishing approval flows

## Audit Questions
This audit must answer:

1. What runtime authority does Governance currently expose?
2. Which actions are read-only, handoff-only, or mutation-capable?
3. Which mutations are backend-owned and protected?
4. Which controls are disabled, planned, or future-only?
5. Which source file owns the page?
6. Which CSS files currently affect Governance?
7. Is Governance visually ready for safe polish?
8. What Browser QA routes are required before any future patch?
9. What must remain forbidden in the first polish pass?

## Expected Source Owner
Primary source candidate:
- `public/control-center/pages/governance.js`

## Expected Risk Level
High.

Reason:
Governance can affect approvals and safety decisions. It must not receive random UI patches before action classification and mutation boundaries are documented.

## Forbidden During This Audit
No production JS changes.
No production CSS changes.
No backend changes.
No API changes.
No route changes.
No data/projects changes.
No action behavior changes.
No mutation behavior changes.
No provider execution changes.
No AI execution changes.

## Required Evidence
The audit should include:
- source scan results
- action classification
- mutation boundary notes
- CSS ownership notes
- Browser QA route list
- recommended next phase

# Integrations Duplicate UI and Feedback Audit

## Status
Audit-only checkpoint.

## Baseline
- b1b72b5 Add Integrations page truth audit
- 589c0fc Add Integrations operating surface plan

## Purpose
Identify duplicate labels, repeated action surfaces, unclear drawer authority, diagnostics overlap, and missing feedback before any implementation.

## Questions
- Which labels are repeated too often?
- Which buttons/actions appear in multiple places?
- Which actions belong in connector cards vs setup drawer?
- Which actions need user feedback?
- Does the drawer explain connect/test/sync results clearly?
- Do diagnostics repeat card state or add useful detail?
- Which UI surfaces should be de-emphasized?
- Which integration actions are sensitive and must not be changed?

## Non-goals
- No production code changes.
- No CSS changes.
- No JS changes.
- No backend changes.
- No API changes.
- No data changes.
- No route behavior changes.

## Evidence
See:
- INTEGRATIONS_DUPLICATE_FEEDBACK_EVIDENCE.txt

## Expected next step
Create a small implementation plan only after reviewing this evidence.

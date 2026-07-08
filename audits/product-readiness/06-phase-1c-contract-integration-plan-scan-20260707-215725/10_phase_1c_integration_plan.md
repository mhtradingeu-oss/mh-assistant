# Phase 1C — Contract Integration Plan

## Current decision

Do not integrate the contract into runtime pages yet.

## Reason

The contract exists and validates, but active pages still have local role maps:
- AI Command has MODE_DEFS, MODE_ID_ALIASES, SPECIALIST_DEFS, output routing.
- Home has recommended specialist and role prompt logic.
- route-role-fallback has authority role maps.
- Handoff system is broad and should not be enforced before conformance proof.

## Safest next move

Create a conformance audit script that compares:
- AI Command role IDs and aliases against contract.
- Home recommended specialist IDs against contract.
- route-role-fallback role IDs against contract.
- Page route IDs against contract page owner matrix.
- Handoff destinations against contract handoff rules.

## Do not do yet

- Do not import contract into Home.
- Do not import contract into AI Command.
- Do not replace route-role-fallback.
- Do not enforce handoff rules.
- Do not touch backend.
- Do not change runtime behavior.

## Proposed next phase

Phase 1D — AI Team Contract Conformance Audit

Expected files:
- ADD scripts/audit/ai-team-contract-conformance-check.mjs
- ADD audit report

No app-source behavior changes.

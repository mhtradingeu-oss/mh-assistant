# Runtime State Divergence Note

## Observation
Runtime-generated project state files under:

data/projects/hairoticmen/*

continue to change during normal orchestrator operation.

## Current cause
Observed canonical vs legacy mirror divergence between:
- source-of-truth-registry.json
- sources-registry.json

Observed runtime logs:
- project_data_mismatch
- canonical_legacy_value_mismatch

## Current decision
No reconciliation changes during release stabilization phase.

## Reason
Current runtime behavior is operationally stable.
Changing canonical/legacy reconciliation behavior before release may introduce regression risk.

## Deferred phase
Post-release operational data migration and canonicalization review.

## Current classification
Operational runtime state, not blocking technical debt.

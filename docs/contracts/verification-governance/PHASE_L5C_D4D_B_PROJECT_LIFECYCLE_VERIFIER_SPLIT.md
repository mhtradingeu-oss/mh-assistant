# Phase L5C-D4D-B — Project Lifecycle Verifier Split

## Status

PHASE_L5C_D4D_B_PROJECT_LIFECYCLE_VERIFIER_SPLIT=PASS

REGISTERED_VERIFIERS_BEFORE=36

REGISTERED_VERIFIERS_AFTER=37

AUTHORIZED_VERIFIERS_BEFORE=7

AUTHORIZED_VERIFIERS_AFTER=7

OLD_MIXED_REGISTRATION_RETAINED=NO

OLD_PATH_COMPATIBILITY_STUB=YES

FIXTURE_VERIFIER_REGISTERED=YES

LIVE_ROOT_VERIFIER_REGISTERED=YES

NEW_PROFILE_ASSIGNMENTS=0

SAFE_FOR_LOCAL_ADDED=0

SAFE_FOR_CI_ADDED=0

SAFE_FOR_RELEASE_ADDED=0

DEFAULT_POLICY=DENY

PRODUCTION_MUTATION_AUTHORIZED=NO

## Fixture-only verifier

ID:

`identity-workspace.project-lifecycle-readiness-fixture`

Path:

`scripts/verify-project-lifecycle-readiness-fixture.js`

Contract:

- safety class: `TEMP_ROOT_MUTATING`;
- evidence class: `ISOLATED_RUNTIME`;
- requires temporary root: yes;
- reads live root: no;
- mutates fixtures: yes;
- mutates repository: no;
- mutates live data: no;
- assigned profile: none.

## Live-root verifier

ID:

`identity-workspace.project-lifecycle-readiness-live-root`

Path:

`scripts/verify-project-lifecycle-readiness-live-root.js`

Contract:

- safety class: `LIVE_ROOT_READ_ONLY`;
- evidence class: `LIVE_ROOT_READ`;
- requires temporary root: no;
- reads live root: yes;
- mutates fixtures: no;
- mutates repository: no;
- mutates live data: no;
- assigned profile: none.

## Compatibility boundary

The former mixed script path remains as a fail-closed compatibility stub:

`scripts/verify-project-lifecycle-readiness.js`

It does not delegate to either replacement and exits nonzero with the two
replacement verifier IDs.

## Authority result

The split creates no execution authority.

The fixture verifier remains denied until isolated `TEMP_ROOT`
certification.

The live-root verifier remains denied until a dedicated governed live-root
read-only profile and immutable-read proof are approved.

## Evidence

Mixed-classification correction:

`/tmp/mhos-l5c-d4c-mixed-classification-20260726T080257Z`

Split-design truth scan:

`/tmp/mhos-l5c-d4d-a-split-design-20260726T080830Z`

NEXT_ACTION=PHASE_L5C_D4D_C_CERTIFY_FIXTURE_ONLY_VERIFIER

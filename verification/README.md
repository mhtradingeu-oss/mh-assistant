# Verification Governance

This directory contains the declarative verification-governance foundation for
MH-OS.

## Current phase

```text
phase=PHASE_L4F
status=REGISTRATION_READY
runner_available=YES
verifier_execution_authorized=NO
classification_complete=NO
default_policy=DENY
Files
manifest.json defines the canonical verifier inventory and metadata.
profiles.json defines canonical execution profiles and safety policies.
scripts/verification/validate-verification-manifest.js validates the
manifest, profiles, registered paths, classifications, gates, and profile
references without executing any verifier.
Safety rule

A verifier is not authorized merely because its file exists.

Until it is reviewed and registered, it remains outside governed execution.

A registered verifier with UNCLASSIFIED safety remains:

profiles=[]
safe_for_local=false
safe_for_ci=false
safe_for_release=false
default_policy=DENY

Registration is inventory governance. It is not execution authorization.

Current limitations

The governance layer does not currently:

execute registered verifiers;
start a server;
call HTTP endpoints;
call external providers;
set write keys;
elevate mutation gates;
modify verifier implementations;
certify production readiness;
approve a release.
Next controlled step

Register the complete verified inventory with conservative metadata.

Where behavioral evidence is insufficient, use:

safety_class=UNCLASSIFIED
profiles=[]
safe_for_local=false
safe_for_ci=false
safe_for_release=false

Classification and profile authorization must follow evidence, not filenames.


## Controlled Runner Activation — L5C-C

The minimal governed runner is available under a fail-closed policy.

Executable profiles:

- `READ_ONLY`
- `TEMP_ROOT`

Current verifier assignments:

- `identity-workspace.pure-read-approval-authority`
  - profile: `TEMP_ROOT`
  - local execution only
- `identity-workspace.production-governance-readiness-recertification`
  - profile: `TEMP_ROOT`
  - local execution only

All other registered verifiers remain unassigned and denied.

CI, release, production certification, server, HTTP, network, provider,
write-key, repository mutation, and live-data mutation remain disabled.

`default_policy=DENY`


## Governed READ_ONLY Reduced Batch — L5C-D2R

The following five verifiers are authorized only for controlled local
execution through the governed `READ_ONLY` profile:

- `backend.durable-approval-lifecycle`
- `backend.governance-mutation-gates`
- `backend.public-alias-hardening`
- `backend.workspace-authority-boundary`
- `backend.workspace-contract`

Two candidates remain denied:

- `backend.admin-policy-granularity`
  - static HTTP/network signals remain unresolved;
- `backend.runtime-security-enforcement`
  - a previous certification run coincided with an unattributed production
    telemetry append;
  - a later controlled preload capture detected no verifier-process writes,
    but deterministic causation has not been established.

Current authority totals:

- registered verifiers: `36`;
- governed `TEMP_ROOT` assignments: `2`;
- governed `READ_ONLY` assignments: `5`;
- total locally authorized verifiers: `7`;
- unassigned and denied verifiers: `29`;
- CI-authorized verifiers: `0`;
- release-authorized verifiers: `0`.

The default policy remains `DENY`.


## Mixed Verifier Classification Hold — L5C-D4C

`identity-workspace.project-lifecycle-readiness` remains unassigned and
deny-only.

Controlled execution established that the verifier currently combines:

- temporary fixture mutation confined to an isolated temporary root;
- protected live-root reads from `data/projects` and `data/workspaces`.

The manifest classification is therefore corrected to:

- `safety_class: UNCLASSIFIED`;
- `requires_temp_root: true`;
- `reads_live_root: true`;
- `mutates_fixture: true`;
- `mutates_repository: false`;
- `mutates_live_data: false`;
- no profile assignment;
- no local, CI, release, or production authority.

The required remediation is to split the capability into:

1. a fixture-only verifier eligible for later `TEMP_ROOT` certification;
2. a separate live-root read-only verifier that remains denied until an
   explicit governed live-root profile and runtime contract are approved.

The default policy remains `DENY`.


## Project Lifecycle Verifier Split — L5C-D4D-B

The mixed verifier `identity-workspace.project-lifecycle-readiness` has been retired and removed from the
verification manifest.

Its responsibilities are now separated into two deny-only registrations:

- `identity-workspace.project-lifecycle-readiness-fixture`
  - `TEMP_ROOT_MUTATING`;
  - `ISOLATED_RUNTIME`;
  - synthetic fixture mutation only;
  - no live-root reads;
  - no profile assignment.

- `identity-workspace.project-lifecycle-readiness-live-root`
  - `LIVE_ROOT_READ_ONLY`;
  - `LIVE_ROOT_READ`;
  - protected live project and workspace reads;
  - no fixture, repository, or live-data mutation;
  - no profile assignment.

The old script path remains only as a fail-closed compatibility stub. It
does not execute either replacement and exits nonzero.

Current authority totals:

- registered verifiers: `37`;
- governed `READ_ONLY` assignments: `5`;
- governed `TEMP_ROOT` assignments: `2`;
- total locally authorized verifiers: `7`;
- unassigned and denied verifiers: `30`;
- CI-authorized: `5`;
- governed `TEMP_ROOT` assignments: `2`;
- total locally authorized verifiers: `7`;
- unassigned and denied verifiers: `30`;
- CI-authorized verifiers: `0`;
- release-authorized verifiers: `0`.

The default policy remains `DENY`.


## Fixture-Only Project Lifecycle Certification — L5C-D4D-C

`identity-workspace.project-lifecycle-readiness-fixture` is authorized only for governed local execution through
the `TEMP_ROOT` profile.

Runtime evidence established:

- successful governed planning and execution;
- 37 temporary-root write events;
- zero repository write attempts;
- zero writes outside the governed temporary root;
- zero protected live-root reads;
- complete fixture cleanup;
- no protected-scope mutation.

The earlier worktree-status mismatch was a measurement-order false positive:
the original status baseline preceded the intended manifest and README
changes. It was not evidence of verifier-induced repository mutation.

`identity-workspace.project-lifecycle-readiness-live-root` remains unassigned and denied.

Current authority totals:

- registered verifiers: `37`;
- governed `READ_ONLY` assignments: `5`;
- governed `TEMP_ROOT` assignments: `3`;
- total locally authorized verifiers: `8`;
- unassigned and denied verifiers: `29`;
- CI-authorized verifiers: `0`;
- release-authorized verifiers: `0`.

The default policy remains `DENY`.

## Effective-permission resolver verifier

- Verifier ID: `authority.effective-permission-resolver-offline`
- Path: `scripts/verify-effective-permission-resolver.js`
- Profile: `READ_ONLY`
- Safety class: `PURE_READ_ONLY`
- Evidence class: `STATIC_CONTRACT`
- Local governed execution: authorized
- CI execution: denied
- Release and production execution: denied
- Server, HTTP, network, provider, write-key, fixture mutation, repository mutation, and live-data mutation: denied
- Scope: offline deterministic verification of the fail-closed effective-permission resolver
- Certified outcomes: `DENY`, `INSUFFICIENT_CONTEXT`, and `UNSUPPORTED_ACTION`
- `ALLOW` and `REQUIRES_APPROVAL` outcomes observed during certification: `0`
- Resolver route installation: none
- Middleware installation: none
- Existing runtime security gates remain authoritative

## Effective-permission shadow adapter verifier

- Verifier ID: `authority.effective-permission-shadow-adapter-offline`
- Path: `scripts/verify-effective-permission-shadow-adapter.js`
- Profile: `READ_ONLY`
- Safety class: `PURE_READ_ONLY`
- Evidence class: `STATIC_CONTRACT`
- Controlled local governed execution: authorized
- CI, release, and production execution: denied
- Certified cases: `10`
- Admitted cases: `5`
- Rejected cases: `5`
- Resolver outcomes: `DENY=1`, `INSUFFICIENT_CONTEXT=4`, `ALLOW=0`
- HEAD observation: rejected
- Public-alias observation: rejected
- Observation persistence: none
- Runtime installation: none
- Existing security gates remain authoritative

## Effective-permission runtime shadow verifier

- Verifier ID: `authority.effective-permission-shadow-runtime-offline`
- Path: `scripts/verify-effective-permission-shadow-runtime.js`
- Profile: `READ_ONLY`
- Safety class: `PURE_READ_ONLY`
- Evidence class: `STATIC_CONTRACT`
- Controlled local governed execution: authorized
- CI, release, and production execution: denied
- Certified cases: `15`
- Control cases: `6`
- Observer cases: `9`
- Runtime installation: none
- Default observer state: disabled
- Missing or invalid kill-switch state: engaged/fail-closed
- Public alias observation: excluded
- HEAD observation: excluded
- Observation destination: request-local only
- Persistent sink: none
- Response and handler result changes: none
- Production observation and production authority: denied

## Effective-permission runtime installation verifier

- Verifier ID: `authority.effective-permission-shadow-runtime-installation-offline`
- Path: `scripts/verify-effective-permission-shadow-runtime-installation.js`
- Profile: `READ_ONLY`
- Safety class: `PURE_READ_ONLY`
- Evidence class: `STATIC_CONTRACT`
- Controlled local governed execution: authorized
- CI, release, and production execution: denied
- Certified cases: `14`
- Canonical GET registrations: `1`
- Public-alias registrations: `1`, unchanged and excluded
- Explicit HEAD registrations: `0`
- Observer constructions: `1` at server startup
- Observer route insertions: `1`
- Runtime installation: present
- Runtime effective state without configuration: disabled
- Missing kill-switch configuration: engaged/fail-closed
- Control refresh model: startup-captured
- Control changes require: controlled process restart
- Hot kill switch certified: no
- Shared handler changed: no
- Response contract changed: no
- Persistent sink: none
- Production observation and production authority: denied

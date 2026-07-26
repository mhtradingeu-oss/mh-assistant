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

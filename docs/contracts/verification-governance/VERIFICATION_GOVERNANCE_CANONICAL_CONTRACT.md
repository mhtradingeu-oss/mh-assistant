# Verification Governance Canonical Contract

## 1. Status

```text
contract_id=mh-os.verification-governance.v1
status=DESIGN_LOCKED
authority_scope=verification-classification-and-controlled-execution
runtime_authority=NONE
production_certification_authority=SEPARATE

This contract defines the canonical governance boundary for verification
classification, profile selection, controlled execution, evidence recording,
and future certification decisions.

It does not certify the system for production and does not replace domain
verifiers, runtime owners, security authorities, governance authorities,
controlled writers, or release approval.

2. Current Truth

The repository contains a substantial distributed verification suite,
including root-level verifiers, backend checks, fixture-based verifiers,
live-root readers, report generators, gated mutating tests, HTTP-dependent
tests, server-dependent tests, and live-provider proof tools.

The repository does not currently contain one canonical verification
manifest, one canonical profile model, one policy-enforcing verification
runner, or one CI/release certification pipeline.

Existing safety mechanisms, environment gates, temporary-root fixtures,
package scripts, static checks, runtime-shaped checks, and historical
certification documents remain valid evidence sources within their proven
scope.

They must not be treated as a unified production certification authority.

3. Canonical Architecture
Existing Verifiers
        |
        v
Declarative Verification Manifest
        |
        v
Named Verification Profiles
        |
        v
Policy-Enforcing Safe Runner
        |
        v
Structured Evidence Report
        |
        v
Separate Release or Certification Decision

The architecture consolidates existing verification capabilities without
moving, renaming, rewriting, or duplicating them.

4. Authority Separation
4.1 Verifier Authority

A verifier may prove only the fact, contract, behavior, fixture, runtime
boundary, recovery behavior, or external behavior explicitly covered by its
implementation.

A verifier does not own release approval or production certification.

4.2 Manifest Authority

The manifest is the canonical declarative source for verifier identity,
classification, execution requirements, safety characteristics, evidence
scope, and profile eligibility.

The manifest must not execute verifiers or mutate runtime state.

4.3 Profile Authority

A profile selects a controlled subset of manifest entries for a declared
purpose.

A profile cannot weaken the safety classification of a verifier.

4.4 Runner Authority

The runner may execute only manifest-listed verifiers permitted by the
selected profile.

The runner must reject unknown, unclassified, or profile-ineligible
verifiers.

4.5 Certification Authority

Production certification, release approval, and deployment approval remain
separate decisions based on qualified evidence.

SCRIPT_PASS != PRODUCTION_CERTIFICATION
PROFILE_PASS != RELEASE_APPROVAL
HISTORICAL_PASS != CURRENT_PROOF
5. Canonical Safety Classes

Every manifest entry must use exactly one primary safety class:

PURE_READ_ONLY
TEMP_ROOT_MUTATING
LIVE_ROOT_READ_ONLY
REPOSITORY_REPORT_GENERATOR
EXPLICITLY_GATED_MUTATING
SERVER_DEPENDENT
HTTP_DEPENDENT
LIVE_PROVIDER_DEPENDENT
UNCLASSIFIED

Additional requirements may be represented by independent metadata fields.

UNCLASSIFIED is always denied by default.

6. Required Manifest Fields

Each verifier entry must define:

id
path
domain
purpose
safety_class
evidence_class
requires_server
requires_http
requires_network
requires_live_provider
requires_write_key
requires_temp_root
reads_live_root
mutates_fixture
mutates_repository
mutates_live_data
explicit_gate
safe_for_local
safe_for_ci
safe_for_release
profiles
estimated_runtime
timeout_seconds
limitations

The path must resolve inside the repository.

Duplicate verifier IDs and duplicate canonical paths are invalid.

7. Evidence Classes

Every verifier must declare the type of evidence it produces:

SYNTAX
STATIC_STRUCTURE
STATIC_CONTRACT
FIXTURE_BEHAVIOR
ISOLATED_RUNTIME
LIVE_ROOT_READ
SERVER_RUNTIME
HTTP_RUNTIME
SECURITY_ENFORCEMENT
RECOVERY
LIVE_PROVIDER
REPOSITORY_REPORT
PRODUCTION_OBSERVATION

Evidence classes are not interchangeable.

For example, syntax evidence must never be promoted to runtime evidence or
production certification.

8. Canonical Profiles

The initial profile vocabulary is:

READ_ONLY
TEMP_ROOT
LOCAL_ENGINEERING
CI
RELEASE_CANDIDATE
PRODUCTION_CERTIFICATION
READ_ONLY

Allows only verified PURE_READ_ONLY entries with no server, HTTP, network,
write key, repository mutation, live-data mutation, or provider dependency.

TEMP_ROOT

Allows fixture-mutating verifiers only when all mutations are proven to be
contained within an explicit temporary root.

LOCAL_ENGINEERING

May combine read-only and temporary-root validation and may include approved
live-root reads.

It must not implicitly enable mutating environment gates.

CI

Allows deterministic, non-interactive, non-live-provider verification
suitable for automated execution.

RELEASE_CANDIDATE

May include broader qualified runtime evidence but still excludes production
mutation and live-provider execution unless separately approved.

PRODUCTION_CERTIFICATION

Is a controlled evidence-collection profile, not automatic production
approval.

It requires explicit approval, qualified environment information, current
repository identity, evidence retention, and a separate certification
decision.

9. Deny-by-Default Policy

The runner must refuse execution when any of the following is true:

verifier_not_in_manifest
verifier_unclassified
profile_not_found
verifier_not_allowed_by_profile
required_gate_not_explicitly_approved
required_server_not_declared
required_http_not_declared
required_network_not_declared
required_live_provider_not_declared
required_write_key_not_declared
repository_mutation_not_allowed
live_data_mutation_not_allowed
path_outside_repository
duplicate_verifier_identity
manifest_validation_failed
10. Environment Gate Policy

The runner must not silently set or elevate:

ALLOW_MUTATING_TESTS
ALLOW_LOCAL_DRY_RUN
ALLOW_LOCAL_MANUAL_RECORD
MH_RUN_LIVE_PROVIDER_PROOF
MH_CONTROL_CENTER_WRITE_KEY
CONTROL_CENTER_WRITE_KEY
MH_CONTROL_KEY

A gated verifier may run only when:

its manifest metadata declares the exact gate;
the selected profile permits that gate class;
execution is explicitly approved;
repository and data mutation policy allows it;
evidence records the effective gate state without recording secret values.
11. Repository Safety Policy

A clean repository is not mandatory.

Repository safety is established by comparing scoped before-and-after state.

The runner must record:

repository_commit
repository_branch
repository_status_before
repository_status_after
approved_output_paths
unexpected_changed_paths

Existing unrelated work must remain unchanged.

The runner must never use:

git add .
git reset --hard
git clean
git stash

It must not delete or normalize unrelated files.

12. Evidence Record

Every profile execution must produce a structured record containing:

run_id
profile_id
started_at
completed_at
repository_commit
repository_branch
repository_status_before
repository_status_after
manifest_version
runner_version
verifier_id
verifier_path
safety_class
evidence_class
started
exit_code
signal
duration_ms
result
stdout_reference
stderr_reference
mutations_detected
unexpected_changed_paths
limitations

Secret values must never be stored in evidence.

13. Existing Verifier Preservation

This phase does not authorize:

moving existing verifiers;
renaming existing verifiers;
rewriting verifier internals;
merging verifiers based only on similar names;
deleting historical scripts;
replacing package scripts;
introducing CI workflows;
enabling live-provider execution;
enabling production mutation.

Those actions require separate evidence and approval.

14. Initial Implementation Boundary

The minimal implementation may add only:

verification/manifest.json
verification/profiles.json
verification/README.md
scripts/verification/validate-verification-manifest.js
scripts/verification/run-verification-profile.js

The first implementation must support manifest validation before profile
execution.

The first runner version must support only:

READ_ONLY
TEMP_ROOT

Other profiles may exist declaratively but must remain non-executable until
separately validated and approved.

15. Initial Non-Goals

The first implementation will not:

build a new test framework;
replace Node.js script execution;
modify existing verifier source;
start servers automatically;
call HTTP endpoints;
call external providers;
write production data;
create CI workflows;
decide production readiness automatically;
convert historical PASS claims into current evidence.
16. Canonical Decision
verification_governance_strategy=CONSOLIDATE_EXISTING
new_test_framework=NO
existing_verifiers_preserved=YES
manifest_required=YES
profiles_required=YES
safe_runner_required=YES
deny_by_default=YES
first_executable_profiles=READ_ONLY,TEMP_ROOT
production_certification_automatic=NO
17. Next Phase
next_phase=PHASE_L4C_MINIMAL_VERIFICATION_MANIFEST_FOUNDATION
implementation_scope=declarative-manifest-profile-validator-only
verifiers_executed=NO
server_started=NO
http_called=NO
live_provider_called=NO

# Phase L5C-B — Minimal Fail-Closed Governed Runner Implementation

## Status

PHASE_L5C_B_MINIMAL_FAIL_CLOSED_RUNNER=IMPLEMENTED

RUNNER_ACTIVATED=NO

REAL_VERIFIERS_EXECUTED=NO

PROFILES_ENABLED=NO

MANIFEST_CHANGED=NO

PROFILES_CHANGED=NO

DEFAULT_POLICY=DENY

PRODUCTION_MUTATION_AUTHORIZED=NO

## 1. Purpose

This phase implements the minimal governed verifier runner required by the
canonical verification-governance contract.

The implementation does not activate execution in the repository contracts.
The manifest and profile documents continue to declare the runner unavailable,
all profiles remain execution-disabled, and no registered repository verifier
is assigned new execution authority.

## 2. Fail-closed decisions

The runner denies execution when any of the following is true:

- the manifest or profile contract cannot be read or parsed;
- either contract does not use the canonical contract ID;
- either contract does not use `DENY` as the default policy;
- the runner is not explicitly available in both contracts;
- the selected profile is absent, duplicated, or disabled;
- the selected verifier is absent or duplicated;
- the verifier is not explicitly assigned to the selected profile;
- the safety class is not allowed by the profile;
- the relevant local, CI, or release safety flag is not enabled;
- capability requirements exceed the profile authority;
- server, HTTP, network, provider, write-key, live-root, repository-mutation,
  or live-data-mutation capabilities are requested;
- a required temporary root is missing or located inside the repository;
- the verifier path is absolute, escapes the repository, resolves through a
  symlink outside the repository, or is not a JavaScript file;
- the timeout is invalid;
- the verifier exits nonzero, times out, or is terminated by a signal.

## 3. Execution boundary

The minimal runner supports only:

- explicitly authorized pure read-only JavaScript verifiers;
- explicitly authorized temporary-root verifiers;
- shell-free child execution;
- controlled timeout;
- explicit temporary-root injection through `MH_ASSISTANT_ROOT`;
- removal of known mutation-elevation environment variables;
- plan-only authorization without verifier execution.

## 4. Self-test strategy

The runner is tested only against synthetic contracts and synthetic verifier
files created beneath the operating-system temporary directory.

The test proves:

- the real repository remains denied while `runner_available=false`;
- disabled profiles are denied;
- unassigned verifiers are denied;
- safety mismatches are denied;
- unsafe execution flags are denied;
- repository path escape is denied;
- missing temporary roots are denied;
- temporary roots inside the repository are denied;
- an external temporary-root verifier writes only to that temporary root;
- repository mutation metadata is denied;
- an authorized plan can be returned without execution.

No registered repository verifier is executed by this phase.

## 5. Activation decision

Runner implementation and runner activation are separate gates.

This phase commits executable runner code and its synthetic self-test only.
It does not update:

- `verification/manifest.json`;
- `verification/profiles.json`;
- verifier profile assignments;
- verifier safety flags;
- automatic local, CI, release, or production execution authority.

NEXT_GATE=PHASE_L5C_C_CONTROLLED_READ_ONLY_AND_TEMP_ROOT_ACTIVATION

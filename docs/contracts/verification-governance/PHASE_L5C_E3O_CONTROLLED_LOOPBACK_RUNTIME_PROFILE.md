# PHASE L5C-E3O — Controlled Loopback Runtime Profile

## Status

`IMPLEMENTED_AND_CERTIFIED`

## Governed verifier

- ID:
  `authority.effective-permission-shadow-controlled-local-runtime-proof`
- Path:
  `scripts/verify-effective-permission-shadow-controlled-local-runtime.js`
- SHA-256:
  `1c650a8af851b2c8fc23a9578af444b0f4ab4193186a40b4ed7f0cb4c1b0964c`
- Safety class:
  `SERVER_DEPENDENT`
- Evidence class:
  `HTTP_RUNTIME`

## Architecture

The generic minimal runner remains unchanged and continues to deny
server-dependent and HTTP-dependent execution.

A separate fail-closed runner governs the single certified local proof:

`scripts/verification/run-controlled-loopback-verifier.js`

Its self-test is:

`scripts/verification/verify-controlled-loopback-runner.js`

## Profile authority

`CONTROLLED_LOOPBACK_RUNTIME` permits only:

- the assigned verifier;
- the verifier's temporary local server;
- loopback HTTP;
- temporary-root mutation.

It denies:

- external network;
- live providers;
- write keys;
- live-root reads;
- repository mutation;
- live-data mutation;
- CI execution;
- release execution;
- production observation;
- production authority.

## Runtime evidence

Structured runtime evidence proves:

- 15 unique proof cases;
- 14 installation recertification cases;
- the local harness starts and closes;
- seven HTTP requests use loopback only;
- zero external-network requests;
- no request denial;
- no response mutation;
- no credential leakage;
- no repository writes;
- temporary evidence is removed;
- the production Orchestrator is not started;
- production authority is not granted.

The E3N output fields `verifier_registered=false` and
`governance_classification_deferred=true` are historical proof-origin
metadata.

Current governance is established independently by the manifest and profile:

- registered verifiers: 42;
- authorized verifiers: 13;
- controlled-profile assignments: 1;
- previously registered verifiers automatically authorized: 0.

## Network statement

No operating-system network sandbox is claimed.

External-network denial is bounded by the exact audited verifier bytes,
SHA-256 pinning, loopback-only behavior, and the runner's fail-closed
contract.

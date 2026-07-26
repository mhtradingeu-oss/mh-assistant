# Phase L5C-E3C-B — Effective Permission Verifier Certification

## Status

`PASS`

## Certified verifier

- ID: `authority.effective-permission-resolver-offline`
- Path: `scripts/verify-effective-permission-resolver.js`
- Profile: `READ_ONLY`
- Safety class: `PURE_READ_ONLY`
- Evidence class: `STATIC_CONTRACT`
- Local execution: authorized only through the governed runner
- CI execution: denied
- Release and production execution: denied

## Certified implementation

The verifier evaluates:

`runtime/orchestrator-service/lib/security/effective-permission-resolver.js`

The resolver remains offline and uninstalled. This phase does not modify
`server.js`, register middleware, connect any route, observe a public alias,
change an existing HTTP response, or replace an installed security gate.

## Verified behavior

The deterministic offline suite contains eight cases and proves:

1. a legacy compatibility service Principal cannot authorize;
2. unsupported contract versions fail with a non-authorizing result;
3. unsupported route contracts fail with a non-authorizing result;
4. runtime-security denial has precedence;
5. revoked Workspace membership produces denial;
6. cross-Project scope mismatch produces denial;
7. fabricated positive caller context cannot produce `ALLOW`;
8. output is deterministic and does not expose supplied secret-like fields.

Certified outcome totals:

- `DENY`: 3
- `INSUFFICIENT_CONTEXT`: 3
- `UNSUPPORTED_ACTION`: 2
- `ALLOW`: 0
- `REQUIRES_APPROVAL`: 0

## Safety boundary

The verifier declares and demonstrates:

- no server requirement;
- no HTTP requirement;
- no network requirement;
- no provider requirement;
- no write-key requirement;
- no temporary-root requirement;
- no fixture mutation;
- no repository mutation;
- no live-data mutation;
- no production authority.

Existing read-key and write-key guards, runtime-security enforcement,
governance gates, Project isolation, provider gates, and handler-local
safeguards remain authoritative.

## Governed execution

The verifier was:

1. registered in the canonical manifest;
2. assigned only to the `READ_ONLY` profile;
3. accepted by the manifest validator;
4. accepted by the governed runner plan;
5. executed through the governed runner;
6. directly recertified against its eight-case evidence contract.

Repository status and protected-scope snapshots remained unchanged during
governed execution.

## Governance result

Registration authorizes controlled local verification only. It does not
authorize resolver enforcement, shadow-route installation, production
observation, human identity, Workspace membership, Project membership,
role assignment, grants, provider execution, or positive permission
decisions.

## Next phase

`PHASE_L5C_E3D_DESIGN_SELECTED_ROUTE_SHADOW_ADAPTER`

# Phase L5C-E3I — Runtime Shadow Verifier Certification

## Status

`PASS`

## Certified verifier

- ID: `authority.effective-permission-shadow-runtime-offline`
- Path: `scripts/verify-effective-permission-shadow-runtime.js`
- Profile: `READ_ONLY`
- Safety class: `PURE_READ_ONLY`
- Evidence class: `STATIC_CONTRACT`
- Controlled local execution: authorized through the governed runner
- CI execution: denied
- Release and production execution: denied

## Certified implementation

The verifier evaluates:

1. `runtime/orchestrator-service/lib/security/effective-permission-shadow-control.js`
2. `runtime/orchestrator-service/lib/security/effective-permission-shadow-observer.js`
3. integration with `effective-permission-shadow-adapter.js`

The runtime observer remains offline and uninstalled. This phase does not
modify `server.js`, route registrations, middleware, the public alias, HEAD
handling, deployment configuration, or a persistent observation sink.

## Control contract

The certified control behavior is:

- feature flag environment name:
  `MH_EFFECTIVE_PERMISSION_SHADOW_ENABLED`;
- kill-switch environment name:
  `MH_EFFECTIVE_PERMISSION_SHADOW_KILL_SWITCH`;
- explicit feature-enabled value: `1`;
- explicit clear kill-switch value: `0`;
- explicit engaged kill-switch value: `1`;
- default observer state: disabled;
- kill-switch precedence: highest;
- missing kill-switch value: engaged/fail-closed;
- invalid kill-switch value: engaged/fail-closed;
- invalid feature-flag value: disabled.

The control module does not read `process.env` directly. Environment state is
explicitly injected into the parser.

## Observer contract

The observer:

- admits only the exact canonical GET route;
- excludes the public alias;
- excludes HEAD;
- always continues the legacy request;
- cannot deny the request;
- cannot modify response status, headers, or body;
- cannot change the handler result;
- isolates internal observer errors;
- does not expose error messages or raw secrets;
- reads no raw credentials;
- stores observations only in the approved request-local property;
- writes no persistent evidence;
- grants no production authority.

## Certified evidence

The deterministic suite contains 15 cases:

- control cases: 6;
- observer cases: 9;
- actual shadow-adapter integration cases: 1.

It proves:

- disabled-by-default behavior;
- explicit activation only when feature flag is `1` and kill switch is `0`;
- highest-precedence kill switch;
- fail-closed handling of missing and invalid kill-switch values;
- canonical GET request-local observation;
- public-alias exclusion;
- HEAD exclusion;
- missing Project context remains non-authorizing;
- internal failures remain response-preserving and secret-safe;
- request mutation is limited to the approved observation property;
- actual adapter integration cannot produce enforcement or production authority.

## Safety boundary

The verifier requires no:

- server;
- HTTP;
- network;
- live provider;
- write key;
- temporary root;
- live-root read;
- fixture mutation;
- repository mutation;
- live-data mutation.

The runtime remains unchanged:

- middleware installed: no;
- route changed: no;
- server changed: no;
- persistent sink: none;
- production observation: denied;
- production authority: denied.

## Governance result

The verifier is authorized only for controlled local execution through the
`READ_ONLY` profile.

This certification does not authorize runtime installation. The next phase
must separately design and prove the exact canonical-route middleware
installation, deployment control injection, rollback behavior, and zero
response impact.

## Next phase

`PHASE_L5C_E3J_DESIGN_CANONICAL_ROUTE_RUNTIME_INSTALLATION`

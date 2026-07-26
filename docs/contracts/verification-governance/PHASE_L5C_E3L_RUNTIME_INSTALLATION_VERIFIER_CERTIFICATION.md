# Phase L5C-E3L — Runtime Installation Verifier Certification

## Status

`PASS`

## Certified verifier

- ID: `authority.effective-permission-shadow-runtime-installation-offline`
- Path: `scripts/verify-effective-permission-shadow-runtime-installation.js`
- Profile: `READ_ONLY`
- Safety class: `PURE_READ_ONLY`
- Evidence class: `STATIC_CONTRACT`
- Controlled local governed execution: authorized
- CI execution: denied
- Release execution: denied
- Production execution: denied

## Certified installation

The verifier certifies the disabled-by-default runtime installation introduced
by Phase L5C-E3K.

The exact canonical route is:

`GET /media-manager/project/:project/customer-operations/health`

The route contains the shadow observer immediately before the existing shared
handler.

The public alias remains unchanged and excluded:

`GET /public/media-manager/project/:project/customer-operations/health`

No explicit HEAD route is installed.

## Certified composition contract

The verifier proves:

- one observer-module import;
- one shadow-control import;
- one observer construction;
- one canonical-route insertion;
- construction once at server startup;
- exact environment-value injection;
- unchanged shared-handler hash;
- unchanged public alias;
- unchanged HEAD behavior;
- unchanged response contract;
- no direct observation mutation in `server.js`;
- no persistent or network sink in the approved installation delta.

## Runtime control contract

The installed observer remains governed by:

- `MH_EFFECTIVE_PERMISSION_SHADOW_ENABLED`;
- `MH_EFFECTIVE_PERMISSION_SHADOW_KILL_SWITCH`.

Certified behavior:

- default state: disabled;
- missing kill switch: engaged/fail-closed;
- kill-switch precedence: highest;
- control refresh model: startup-captured;
- configuration changes require a controlled process restart;
- hot kill switch: not certified.

The presence of the middleware does not authorize active observation.

## Certified evidence

The deterministic installation suite contains 14 cases:

1. shadow imports are present exactly once;
2. observer is constructed exactly once;
3. environment injection is exact;
4. canonical GET contains the observer exactly once;
5. observer immediately precedes the shared handler;
6. public alias is unchanged and excluded;
7. explicit HEAD registration is excluded;
8. shared-handler hash is unchanged;
9. missing configuration defaults disabled;
10. explicit disabled configuration remains disabled;
11. kill-switch precedence is preserved;
12. default observer skips work and continues the request;
13. approved installation delta adds no persistence or network sink;
14. approved installation delta adds no direct observation mutation.

## Safety boundary

The verifier requires no:

- server startup;
- HTTP request;
- network access;
- live provider;
- write key;
- temporary root;
- live-root read;
- fixture mutation;
- repository mutation;
- live-data mutation.

It does not authorize:

- production observation;
- production authority;
- request denial;
- response mutation;
- shared-handler replacement;
- public-alias observation;
- HEAD observation;
- identity or membership authority;
- roles or grants;
- provider execution;
- positive effective-permission decisions.

## Governance result

The verifier is authorized only for controlled local execution through the
`READ_ONLY` profile.

The runtime installation remains present but inactive without explicit valid
configuration. No production configuration has been changed and no production
observation has been authorized.

## Next phase

`PHASE_L5C_E3M_DESIGN_CONTROLLED_LOCAL_RUNTIME_SHADOW_OBSERVATION_PROOF`

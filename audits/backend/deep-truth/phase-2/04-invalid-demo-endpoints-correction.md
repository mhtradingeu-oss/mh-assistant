# Invalid Demo Endpoint Correction

## Status

Corrected.

## What happened

The following URLs were tested as critical workflow smoke tests:

- `/workflows/run-demo`
- `/publishing/execute-demo`
- `/governance/approval-check`

They returned `Cannot GET`, which means these are not actual backend routes in the current server.

## Decision

These URLs must not be used as readiness evidence.

Critical workflow smoke tests must be based only on routes that exist in the current route inventory.

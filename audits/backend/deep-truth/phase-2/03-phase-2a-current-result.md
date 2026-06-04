# Phase 2A Current Result — Authenticated Protected Endpoint Test

## Status

Incomplete.

## What passed

- `/health` returned OK.
- `/readyz` returned `ready: true`.
- `protected_write_mode.enabled` is true.
- `protected_write_mode.key_configured` is true.
- Unauthenticated protected endpoint access is rejected.

## What failed / blocked

- The key available in the current shell did not match the backend runtime read/control key.
- Protected endpoints returned `Invalid read key`.
- Authenticated protected endpoint behavior is not yet verified.

## Important correction

The backend must not be declared 100% ready until authenticated protected endpoint reads pass with the same key expected by the running server.

## Security note

A control key was pasted into the chat/session during troubleshooting. Treat that value as exposed and rotate it before real production use.

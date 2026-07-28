# PHASE L5C E4C-R13 — Injected Pool Lifecycle Owner

## Status

Implemented and verified with an injected fake Pool only.

## Implemented lifecycle

- DISABLED
- UNINITIALIZED
- INITIALIZING
- READY
- DEGRADED
- CLOSING
- CLOSED
- FAILED

## Implemented guarantees

- Explicit initialization only.
- No import-time initialization.
- Concurrent initialization reuses one promise.
- At most one injected Pool instance is retained.
- Initialization after terminal close is rejected.
- Shutdown is serialized and idempotent.
- Pool termination is invoked once.
- Invalid lifecycle transitions fail closed.
- Health and readiness projections are immutable and sanitized.
- Pool references are never exposed publicly.
- Process signal handlers are not registered.

## Offline authorization boundary

The verifier injects a fake Pool constructor.

The fake Pool:

- does not contact PostgreSQL;
- does not open sockets;
- does not run queries;
- records lifecycle interactions only.

## Explicitly absent

- No `pg` import.
- No real Pool construction.
- No Client construction.
- No database contact.
- No SQL.
- No migrations.
- No server binding.
- No production authority.

## Acquisition boundary

Database adapter acquisition is not activated in this phase.

A later phase must freeze the exact acquisition interface and authorize real
Pool construction separately.

## Next phase

R14 Migration Authority Contract.

First database contact remains explicitly unauthorized.

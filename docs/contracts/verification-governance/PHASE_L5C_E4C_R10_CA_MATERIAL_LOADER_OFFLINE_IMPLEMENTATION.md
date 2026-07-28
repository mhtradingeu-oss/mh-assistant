# PHASE L5C E4C-R10 — CA Material Loader Offline Implementation

## Status

Candidate implementation completed and awaiting independent review.

## Implemented scope

- Dedicated PostgreSQL CA material loader.
- Explicit injected filesystem and path dependencies.
- Absolute CA-path enforcement.
- Explicit approved-root enforcement.
- Lexical containment validation.
- Symbolic-link rejection.
- Real-path containment validation.
- Regular-file enforcement.
- Pre-read and post-read size enforcement.
- Explicit UTF-8 reading.
- Empty and whitespace-only content rejection.
- Narrow PEM boundary validation.
- Immutable material descriptor.
- SHA-256 certificate digest.
- Sanitized redacted projection.
- Offline verifier using temporary fixtures outside the repository.

## Explicitly not implemented

- No reading of real project certificates.
- No reading of user certificates.
- No reading of system certificate stores.
- No `pg` import.
- No Pool construction.
- No Client construction.
- No database contact.
- No SQL.
- No migration.
- No runtime SSL option materialization.
- No server binding.
- No production authority.

## Authorized fixture boundary

The verifier creates synthetic certificate fixtures only beneath the operating
system temporary directory and removes them after execution.

## R10E adversarial coverage correction

Independent review confirmed the loader implementation and identified four
missing adversarial verifier cases.

The verifier now proves:

- injected real-path escape rejection;
- post-read UTF-8 byte-length enforcement;
- rejection of non-string injected reader results;
- rejection of malformed injected dependencies.

The verifier compares injected reads against the canonical real path returned
by the filesystem. This handles macOS canonicalization where `/var` may
resolve beneath `/private/var`.

No loader source change was required.

## Final review result

The corrected offline verifier passed all required adversarial scenarios.
The three-file implementation is approved for exact-scope closeout.

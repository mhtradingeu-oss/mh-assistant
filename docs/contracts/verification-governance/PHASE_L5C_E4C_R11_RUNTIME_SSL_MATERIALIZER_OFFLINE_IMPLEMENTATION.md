# PHASE L5C E4C-R11 — Runtime SSL Materializer Offline Implementation

## Status

Implemented and verified offline.

## Implemented behavior

- `disable` returns `false`.
- `require` uses system trust with `rejectUnauthorized: true`.
- `verify-full` requires certified CA material and enables verification.
- `verify-ca` fails closed pending a separately approved identity policy.
- Runtime TLS options are immutable.
- Policy-only fields are excluded.
- Certificate contents are excluded from redacted projections.

## Review correction

The first verifier used an overbroad source pattern that rejected the legitimate
redacted projection for disabled TLS:

`rejectUnauthorized: false`

This value exists only in metadata where `tlsEnabled` is also false. It is not
used as a runtime TLS option.

The corrected verifier uses behavioral assertions:

- disabled TLS returns `false`;
- every TLS-enabled runtime option has `rejectUnauthorized: true`;
- a runtime object containing `rejectUnauthorized: false` is rejected.

## Explicitly absent

- No `pg` import.
- No Pool or Client.
- No database contact.
- No SQL or migrations.
- No real CA-file read.
- No server binding.
- No production authority.

## Next phase

R12: offline PostgreSQL Pool-options materializer.

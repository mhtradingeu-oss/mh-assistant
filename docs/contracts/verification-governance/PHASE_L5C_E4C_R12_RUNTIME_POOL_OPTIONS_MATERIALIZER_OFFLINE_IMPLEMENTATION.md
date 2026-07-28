# PHASE L5C E4C-R12 — Runtime Pool Options Materializer Offline Implementation

## Status

Implemented, verified offline, and approved for exact-scope closeout.

## Source-of-truth mapping

The runtime materializer consumes the immutable descriptor produced by:

`postgresql-pool-options.js`

The descriptor remains the authority for:

- connection identity;
- credentials;
- application name;
- pool maximum;
- idle timeout;
- connection timeout;
- statement timeout;
- SSL policy association.

Runtime TLS options are supplied by:

`postgresql-runtime-ssl-materializer.js`

## Runtime mapping

- `connection.host` → `host`
- `connection.port` → `port`
- `connection.database` → `database`
- `connection.user` → `user`
- `connection.password` → `password`
- `connection.applicationName` → `application_name`
- `limits.max` → `max`
- `limits.idleTimeoutMs` → `idleTimeoutMillis`
- `limits.connectTimeoutMs` → `connectionTimeoutMillis`
- `limits.statementTimeoutMs` → `statement_timeout`
- materialized SSL options → `ssl`

## Security controls

- Runtime options are immutable.
- Passwords are redacted from public projections.
- CA certificate material is redacted from public projections.
- TLS-enabled runtime options must use certificate verification.
- Invalid descriptors fail closed.
- Unsupported limits fail closed.

## Explicitly absent

- No `pg` import.
- No Pool construction.
- No Client construction.
- No database connection.
- No SQL execution.
- No migration.
- No server binding.
- No production authority.

## Next phase

R13 may implement a Pool lifecycle owner using an injected fake Pool constructor.

Real Pool construction and database contact remain separately unauthorized.

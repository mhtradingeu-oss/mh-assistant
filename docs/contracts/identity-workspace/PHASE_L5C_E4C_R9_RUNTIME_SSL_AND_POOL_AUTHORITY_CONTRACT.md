# PHASE L5C E4C-R9 — Runtime SSL and Pool Authority Contract

## Status

Accepted and frozen.

No runtime implementation, database connection, SQL execution, migration,
Pool construction, Client construction, server binding, or production authority
is authorized by this document.

## 1. Purpose

This contract defines the future runtime authority boundaries for:

- PostgreSQL TLS/SSL materialization;
- CA certificate loading;
- runtime `pg` Pool option construction;
- Pool lifecycle ownership;
- startup and shutdown handling;
- health and readiness projection;
- credential and error redaction;
- offline and injected testing;
- the authorization boundary preceding first database contact.

The contract builds on the certified R7 configuration contract and the certified
R8 offline configuration and read-adapter skeleton.

## 2. Existing certified components

The following components already exist and remain authoritative within their
current scope:

### PostgreSQL configuration resolver

Owns:

- namespaced environment parsing;
- deterministic validation;
- configuration state;
- connection descriptor;
- pool-limit descriptor;
- SSL policy descriptor source values;
- immutable results;
- credential-redaction projection.

Does not own:

- filesystem access;
- certificate loading;
- runtime Pool options;
- Pool construction;
- database connections;
- query execution.

### SSL policy descriptor builder

Owns:

- interpretation of configured SSL mode;
- TLS-required state;
- certificate-verification policy;
- optional CA-file reference;
- immutable policy description.

Does not own:

- CA-file access;
- certificate-content loading;
- runtime `pg` SSL objects;
- network activity.

### Pool configuration descriptor builder

Owns:

- immutable connection description;
- immutable pool limits;
- associated SSL policy;
- explicit non-runtime markers.

Does not own:

- runtime `pg.Pool` options;
- Pool construction;
- Client construction;
- lifecycle;
- queries.

### Membership read-adapter skeleton

Owns:

- operation names;
- fail-closed disabled and not-ready responses.

Does not own:

- Pool acquisition;
- SQL;
- database reads;
- production authority.

## 3. Runtime authority components

R9 implementation shall be divided into separate components.

### 3.1 PostgreSQL CA material loader

The CA material loader is the sole component authorized to read configured CA
certificate files.

It must:

- accept an already validated SSL policy descriptor;
- reject missing paths for verification modes;
- reject non-absolute paths unless a separately approved root policy exists;
- resolve and normalize the path;
- enforce an approved certificate root or allowlist;
- reject path traversal;
- reject symbolic-link escape outside the approved root;
- reject non-regular files;
- reject files exceeding the approved maximum size;
- read using explicit UTF-8 encoding;
- reject empty certificate material;
- never log certificate contents;
- return an immutable material descriptor;
- expose only metadata suitable for logging.

It must not:

- read arbitrary files;
- contact PostgreSQL;
- construct a Pool;
- execute SQL;
- mutate configuration;
- cache secrets without an explicit lifecycle contract.

### 3.2 Runtime SSL options materializer

The runtime SSL options materializer is the sole component authorized to convert
an SSL policy descriptor and optional CA material into runtime SSL options.

It must produce one of:

- `false` when TLS is explicitly disabled;
- an immutable TLS options object for approved TLS modes.

It must:

- preserve fail-closed behavior;
- set certificate-verification behavior explicitly;
- include CA certificate material only when required;
- never include descriptor-only fields such as `mode`, `caFile`,
  `certificateVerification`, or `runtimeMaterialized`;
- avoid logging certificate material;
- avoid network activity.

It must not:

- construct a Pool;
- construct a Client;
- connect to PostgreSQL;
- execute SQL.

### 3.3 Runtime Pool options materializer

The runtime Pool options materializer is the sole component authorized to
convert the Pool configuration descriptor into runtime `pg.Pool` options.

It may map:

- host;
- port;
- database;
- user;
- password;
- application name;
- maximum pool size;
- idle timeout;
- connection timeout;
- statement timeout;
- runtime SSL options.

It must:

- consume only certified descriptors;
- reject non-materialized SSL state where runtime SSL is required;
- return a new options object;
- never log the password;
- never construct a Pool;
- never connect to PostgreSQL;
- never execute SQL.

## 4. Pool authority owner

Exactly one module shall own PostgreSQL Pool lifecycle for the
identity/workspace authority.

The Pool owner shall be the sole component authorized to:

- import `Pool` from `pg`;
- construct the Pool;
- retain the Pool reference;
- expose controlled acquisition to authorized adapters;
- close the Pool;
- project lifecycle state;
- expose sanitized health information.

No route, adapter, verifier, handler, or server module may independently create
a Pool.

## 5. Pool lifecycle state machine

The Pool owner must implement an explicit state machine:

```text
DISABLED
UNINITIALIZED
INITIALIZING
READY
DEGRADED
CLOSING
CLOSED
FAILED
```

Valid transitions must be documented and tested.

At minimum:

```text
DISABLED → DISABLED
UNINITIALIZED → INITIALIZING
INITIALIZING → READY
INITIALIZING → FAILED
READY → DEGRADED
READY → CLOSING
DEGRADED → READY
DEGRADED → CLOSING
FAILED → CLOSING
CLOSING → CLOSED
```

Invalid transitions must fail closed.

## 6. Singleton and concurrency rules

The Pool owner must:

- prevent concurrent duplicate initialization;
- reuse the same initialization promise;
- prevent more than one active Pool instance per process;
- reject initialization after terminal close unless explicitly reset in tests;
- serialize shutdown;
- make repeated shutdown idempotent;
- prevent acquisition while closing or closed;
- expose no mutable Pool reference publicly.

Module caching alone is not sufficient proof of singleton correctness.

## 7. Startup behavior

PostgreSQL authority must not silently initialize as a side effect of import.

Initialization requires an explicit caller.

Before the first database-contact phase is authorized, initialization must
support an offline mode that:

- resolves configuration;
- loads permitted CA material;
- materializes runtime options;
- validates lifecycle transitions;
- does not construct a Pool;
- does not contact PostgreSQL.

A later phase may authorize Pool construction separately.

## 8. Shutdown behavior

The Pool owner must provide explicit graceful shutdown.

Shutdown must:

transition to CLOSING;
reject new acquisitions;
call Pool termination only when a Pool exists;
be idempotent;
enforce an approved timeout;
project success or sanitized failure;
transition to CLOSED;
never expose credentials or certificate material.

Process signal ownership remains with the orchestrator lifecycle owner.

The Pool module must not independently register duplicate SIGINT or SIGTERM
handlers unless separately approved.

## 9. Health and readiness semantics

Health and readiness are distinct.

Health

Health represents the internal lifecycle state of the PostgreSQL authority.

It may report:

disabled;
uninitialized;
initializing;
ready;
degraded;
closing;
closed;
failed.

Health output must be sanitized.

Readiness

Readiness answers whether the PostgreSQL-backed authority can safely serve its
authorized operations.

Before database contact is authorized:

ready = false
reason = DATABASE_AUTHORITY_NOT_ACTIVATED

After future activation, readiness may require:

configuration valid;
SSL material valid;
Pool initialized;
no closing state;
optional bounded connectivity probe;
migration/schema compatibility.

A readiness probe must never leak credentials.

## 10. Error taxonomy

Runtime components must use stable error codes.

Minimum codes:

DATABASE_AUTHORITY_DISABLED
DATABASE_AUTHORITY_NOT_READY
DATABASE_CONFIGURATION_INVALID
DATABASE_CA_PATH_INVALID
DATABASE_CA_FILE_NOT_FOUND
DATABASE_CA_FILE_NOT_REGULAR
DATABASE_CA_FILE_TOO_LARGE
DATABASE_CA_FILE_EMPTY
DATABASE_CA_READ_FAILED
DATABASE_SSL_MATERIALIZATION_FAILED
DATABASE_POOL_OPTIONS_INVALID
DATABASE_POOL_INITIALIZATION_FAILED
DATABASE_POOL_ALREADY_CLOSED
DATABASE_POOL_CLOSING
DATABASE_POOL_UNAVAILABLE
DATABASE_POOL_SHUTDOWN_FAILED
DATABASE_AUTHORITY_STATE_INVALID

Error messages must not contain:

password;
connection string;
certificate contents;
unrestricted filesystem paths;
raw provider errors containing secrets.
## 11. Credential and sensitive-data handling

Passwords may exist only in:

resolved private configuration;
private runtime Pool options;
the internal Pool created by the authority owner.

Passwords must not exist in:

health responses;
readiness responses;
logs;
metrics labels;
audit metadata;
thrown public error messages;
serialized evidence;
frontend responses.

Certificate contents must receive equivalent protection.

## 12. Logging and observability

Permitted metadata includes:

authority state;
SSL mode;
TLS enabled;
CA configured boolean;
sanitized CA filename or approved identifier;
database host category;
port;
database name only when policy permits;
application name;
pool maximum;
timeout values;
lifecycle transition;
sanitized error code.

Forbidden logging includes:

password;
complete connection URI;
certificate contents;
unrestricted environment dumps;
raw Pool options;
raw configuration objects.
## 13. Timeout and retry policy

Initial runtime defaults must remain bounded.

The contract requires separate limits for:

CA-file read;
Pool initialization;
connection acquisition;
connection establishment;
statement execution;
graceful shutdown.

Automatic infinite retry is forbidden.

Any retry policy must define:

maximum attempts;
bounded delay;
backoff;
jitter;
retryable error taxonomy;
terminal failure behavior;
observability.

R9 does not authorize retry implementation.

## 14. Adapter acquisition boundary

Future database adapters must not import pg or construct their own Pool.

Adapters may receive a narrow authority interface such as:

acquire()
withConnection(operation)
getHealth()
getReadiness()

The exact interface must be frozen before adapter runtime implementation.

The Pool object itself must not become a global public dependency.

## 15. SQL prohibition during Pool-authority implementation

The first Pool-authority implementation phase must not:

execute SELECT;
execute INSERT;
execute UPDATE;
execute DELETE;
execute DDL;
run migrations;
perform schema discovery;
perform connectivity probes unless separately authorized.

Pool construction and database contact are separate authorization gates.

## 16. Testing and dependency injection

All runtime authority components must be testable offline.

Required injected boundaries include:

environment source;
filesystem reader;
path resolver;
clock;
timeout scheduler;
Pool constructor;
logger;
lifecycle hooks.

Offline tests must prove:

no filesystem access when TLS does not require CA material;
path traversal rejection;
symlink escape rejection;
maximum-size enforcement;
empty certificate rejection;
secret redaction;
immutable materialized results;
singleton initialization;
concurrent initialization reuse;
idempotent shutdown;
invalid transition rejection;
no query execution;
no database contact when using the test Pool constructor.
## 17. First database-contact authorization gate

First database contact is explicitly prohibited until all of the following are
complete:

Runtime SSL and Pool authority contract committed.
Offline CA loader implemented and verified.
Offline SSL materializer implemented and verified.
Offline Pool-options materializer implemented and verified.
Pool lifecycle owner implemented with injected fake Pool.
Singleton and shutdown tests pass.
Credential and certificate redaction tests pass.
Server binding remains absent.
Migration contract exists.
Exact target environment is declared.
Database credentials are provisioned through an approved secret channel.
Backup and rollback expectations are defined.
A separate explicit first-contact authorization phase is approved.

Until that gate is passed:

FIRST_DATABASE_CONTACT_AUTHORIZED=NO
## 18. Server binding boundary

runtime/orchestrator-service/server.js must remain unchanged during the
offline Runtime SSL and Pool authority implementation phases.

Runtime binding requires a separate contract covering:

initialization order;
failure behavior;
degraded startup;
readiness projection;
signal ownership;
graceful shutdown;
duplicate listener prevention;
rollback.
## 19. Production authority boundary

The following do not grant production authority:

valid configuration;
loaded certificate;
materialized SSL options;
materialized Pool options;
constructed fake Pool;
constructed real Pool;
successful connection;
successful read query;
migration completion.

Production authority requires a later explicit cutover decision supported by:

schema certification;
parity evidence;
security evidence;
recovery evidence;
operational approval;
rollback proof.
## 20. R9 implementation sequence

The required sequence is:

R9A Truth Scan
→ R9B Contract Design
→ R9C Contract Review and Freeze
→ R10A CA Loader Truth Scan
→ R10B Offline CA Loader Implementation
→ R10C Offline CA Loader Closeout
→ R11 Offline SSL Materializer
→ R12 Offline Pool Options Materializer
→ R13 Injected Pool Lifecycle Owner
→ R14 Migration Authority Contract
→ Explicit First Database Contact Authorization

No step may be skipped.

## 21. Current authorization matrix
WRITE_RUNTIME_CONTRACT=YES
READ_CA_FILE=NO
MATERIALIZE_RUNTIME_SSL=NO
MATERIALIZE_RUNTIME_POOL_OPTIONS=NO
IMPORT_PG=NO
CREATE_FAKE_POOL=NO
CREATE_REAL_POOL=NO
CONTACT_DATABASE=NO
EXECUTE_SQL=NO
RUN_MIGRATIONS=NO
CHANGE_SERVER_JS=NO
BIND_RUNTIME=NO
GRANT_PRODUCTION_AUTHORITY=NO
## 22. Exit criteria for R9

R9 may close only when:

this contract passes exact-content review;
ownership boundaries are unambiguous;
lifecycle states and transitions are frozen;
health/readiness semantics are frozen;
secret-redaction policy is frozen;
first-contact authorization gate is explicit;
no runtime source file changed;
no database contact occurred;
the contract is committed and pushed in exact scope.

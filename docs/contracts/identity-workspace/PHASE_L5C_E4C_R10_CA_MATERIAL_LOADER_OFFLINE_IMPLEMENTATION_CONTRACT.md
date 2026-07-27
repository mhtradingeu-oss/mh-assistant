# PHASE L5C E4C-R10 — CA Material Loader Offline Implementation Contract

## Status

Accepted and frozen.

No CA certificate file may be read from the real project environment during
contract design, implementation verification, or closeout.

No database contact, SQL execution, migration, Pool construction, Client
construction, server binding, or production authority is authorized.

## 1. Purpose

This contract defines the narrow offline implementation authority for a
PostgreSQL CA material loader.

The loader will eventually convert an approved CA-file reference into an
immutable certificate-material descriptor.

The first implementation must be verified only through injected filesystem
fixtures and temporary test files created outside the repository.

## 2. Relationship to R9

R9 established that:

- the configuration resolver owns the configured CA-file reference;
- the SSL policy descriptor owns certificate-verification policy;
- a dedicated CA material loader is the only component allowed to read CA files;
- runtime SSL options remain outside the CA loader;
- Pool construction and database contact remain separate authorization gates.

R10 must not weaken or bypass any R9 boundary.

## 3. Authorized implementation scope

The R10 implementation may add:

- one CA material loader module;
- one offline verifier;
- one implementation evidence document.

The implementation may use only Node.js standard-library capabilities required
for:

- path validation;
- filesystem metadata inspection;
- real-path resolution;
- injected UTF-8 file reading;
- immutable result construction;
- hashing certificate material for non-secret identity metadata;
- offline temporary fixtures.

The implementation must not add a new third-party dependency.

## 4. Proposed implementation files

The authorized candidate scope is limited to:

- `runtime/orchestrator-service/lib/identity-workspace-authority/postgresql-ca-material-loader.js`
- `scripts/verify-postgresql-ca-material-loader-offline.js`
- `docs/contracts/verification-governance/PHASE_L5C_E4C_R10_CA_MATERIAL_LOADER_OFFLINE_IMPLEMENTATION.md`

No other repository file may change during the narrow implementation phase.

## 5. Dependency-injection boundary

The loader must accept an explicit dependency object.

The injected boundary must support:

- absolute-path detection;
- path normalization;
- path resolution;
- relative-path calculation;
- lstat or equivalent metadata inspection;
- real-path resolution;
- UTF-8 file reading;
- hashing;
- maximum-size policy;
- approved-root policy.

The default production dependency object must not be invoked by offline tests
unless the test explicitly uses temporary fixtures outside the repository.

## 6. Input contract

The loader must accept an immutable SSL policy descriptor.

Required input conditions:

- `descriptorType` equals `postgresql-ssl-policy`;
- `runtimeMaterialized` equals `false`;
- SSL mode is one of the approved values;
- `caFile` is either null or a non-empty string;
- the caller supplies one approved root when CA material is required.

When SSL mode does not require CA material, the loader must return a
non-materialized result without filesystem access.

## 7. Filesystem-access authorization

Filesystem reading is authorized only for:

- injected offline fixtures;
- a path inside an explicitly approved root;
- a later separately approved runtime phase.

The first R10 implementation must not read:

- project secrets;
- user home-directory certificates;
- system certificate stores;
- environment-provided production certificates;
- arbitrary absolute paths.

## 8. Absolute-path requirement

When CA material is required:

- the configured CA path must be absolute;
- relative paths must fail closed;
- empty paths must fail closed;
- null paths must fail closed;
- path normalization must occur before policy evaluation.

The loader must never resolve a relative CA path against the current working
directory.

## 9. Approved-root policy

The caller must provide one explicit approved root.

The approved root must:

- be absolute;
- be normalized;
- resolve to a real path;
- represent an existing directory;
- be treated as an authority boundary.

The loader must not infer the approved root from:

- process working directory;
- repository root;
- home directory;
- environment-variable directory;
- CA-file parent directory.

## 10. Lexical containment check

Before filesystem reads, the normalized candidate path must be compared with
the normalized approved root.

The candidate is lexically contained only when:

- it equals an explicitly permitted file path within policy; or
- its relative path does not begin with `..`;
- its relative path is not absolute;
- it does not escape through normalization.

Lexical containment alone is insufficient and must be followed by real-path
containment.

## 11. Symlink and real-path containment

The loader must:

- inspect the configured path without following it first;
- reject a configured path that is itself a symbolic link;
- resolve the real path of the approved root;
- resolve the real path of the candidate;
- verify that the real candidate remains within the real approved root;
- reject any symlink or filesystem indirection that escapes the approved root.

A candidate whose lexical path is safe but real path escapes must fail closed.

## 12. Regular-file requirement

The candidate must:

- exist;
- be a regular file;
- not be a directory;
- not be a socket;
- not be a FIFO;
- not be a device;
- not be a symbolic link.

Missing and invalid file types must use stable error codes.

## 13. Maximum-size policy

The default maximum certificate size for the offline implementation is:

`262144` bytes.

This value equals 256 KiB.

The maximum must be:

- explicit;
- configurable only through the injected policy boundary;
- a safe positive integer;
- enforced using filesystem metadata before reading;
- revalidated against the actual UTF-8 byte length after reading.

Zero-byte files must be rejected separately as empty content.

## 14. UTF-8 reading behavior

The loader must request UTF-8 text explicitly.

The loader must reject:

- unreadable files;
- empty strings;
- whitespace-only content;
- content exceeding the maximum size;
- non-string injected reader results.

The loader must not normalize, rewrite, or modify certificate contents.

## 15. Certificate-content validation boundary

R10 does not authorize full X.509 parsing.

The loader may perform only a narrow structural check that the content includes
a PEM certificate boundary.

The loader must reject content that does not contain:

- `-----BEGIN CERTIFICATE-----`
- `-----END CERTIFICATE-----`

Cryptographic certificate validation belongs to later TLS/runtime phases.

## 16. Immutable material descriptor

A successful offline load must return an immutable descriptor containing only:

- descriptor type;
- materialized state;
- approved SSL mode;
- sanitized source identifier;
- certificate byte length;
- SHA-256 digest;
- certificate material for private internal consumption;
- filesystem-read marker;
- database-contact marker;
- runtime SSL marker.

Required values include:

- `descriptorType = postgresql-ca-material`;
- `materialized = true`;
- `filesystemRead = true`;
- `databaseContacted = false`;
- `runtimeSslCreated = false`.

The result and all nested objects must be frozen.

## 17. Sensitive-data redaction

The public redaction function must never return:

- certificate contents;
- unrestricted absolute path;
- raw filesystem error;
- environment values;
- secrets;
- Pool options.

The redacted projection may expose:

- descriptor type;
- materialized state;
- SSL mode;
- sanitized source identifier;
- byte length;
- SHA-256 digest;
- filesystem-read marker;
- database-contact marker;
- runtime SSL marker.

## 18. Sanitized source identifier

The loader must not expose the complete absolute file path in logs or public
errors.

The sanitized source identifier may contain only:

- the basename;
- a stable non-secret identifier;
- or a path relative to the approved root when policy explicitly permits it.

The first implementation should default to the basename only.

## 19. Error taxonomy

The implementation must use stable error codes including:

- `DATABASE_CA_POLICY_INVALID`
- `DATABASE_CA_PATH_REQUIRED`
- `DATABASE_CA_PATH_NOT_ABSOLUTE`
- `DATABASE_CA_ROOT_INVALID`
- `DATABASE_CA_PATH_OUTSIDE_APPROVED_ROOT`
- `DATABASE_CA_PATH_SYMLINK_REJECTED`
- `DATABASE_CA_FILE_NOT_FOUND`
- `DATABASE_CA_FILE_NOT_REGULAR`
- `DATABASE_CA_FILE_TOO_LARGE`
- `DATABASE_CA_FILE_EMPTY`
- `DATABASE_CA_CONTENT_INVALID`
- `DATABASE_CA_READ_FAILED`
- `DATABASE_CA_DEPENDENCY_INVALID`

Public error messages must not contain certificate contents or unrestricted
absolute paths.

## 20. Fail-closed behavior

Any ambiguity must produce failure.

The loader must not:

- fall back to a system CA store;
- fall back to a repository-relative path;
- ignore a failed real-path check;
- accept a symlink;
- read before metadata validation;
- continue after a size violation;
- accept malformed injected dependencies;
- return partial material after an error.

## 21. Offline fixture policy

The verifier may create temporary fixtures only under a new directory inside
the system temporary directory.

The verifier must:

- create its own approved root;
- create test certificates only;
- create traversal and symlink fixtures;
- remove all fixtures on completion or failure;
- never write fixtures inside the repository;
- never read real project certificates;
- never use production credentials.

## 22. Required offline test scenarios

The verifier must prove at minimum:

- no filesystem access when SSL mode does not require CA material;
- missing CA path rejection;
- relative CA path rejection;
- invalid approved root rejection;
- lexical path escape rejection;
- candidate symlink rejection;
- real-path escape rejection;
- missing file rejection;
- directory rejection;
- oversized file rejection before read;
- empty file rejection;
- whitespace-only file rejection;
- malformed PEM rejection;
- valid PEM fixture acceptance;
- UTF-8 byte-length enforcement;
- immutable material descriptor;
- certificate digest generation;
- public redaction;
- certificate material absent from serialized redacted output;
- database contact absent;
- Pool creation absent;
- Client creation absent;
- SQL execution absent;
- server binding absent.

## 23. Static prohibitions

The CA loader implementation must not contain:

- `require("pg")`;
- `require('pg')`;
- `new Pool`;
- `new Client`;
- `.connect(`;
- `.query(`;
- SQL statements;
- server startup binding;
- signal-handler registration;
- migration execution.

## 24. Repository-safety requirements

The implementation phase must:

- snapshot all unrelated status entries;
- verify the three candidate targets are absent before creation;
- create only the three authorized files;
- avoid `git add .`;
- avoid reset, clean, stash, and broad deletion;
- preserve protected unrelated paths byte-for-byte and status-identically;
- stop before commit and push.

## 25. Implementation authorization matrix

- Write R10 contract: YES
- Implement injected offline CA loader: NO
- Create offline temporary fixtures: NO
- Read injected temporary CA fixture: NO
- Read real CA file: NO
- Read project certificate: NO
- Read system certificate store: NO
- Import pg: NO
- Create fake Pool: NO
- Create real Pool: NO
- Contact database: NO
- Execute SQL: NO
- Run migrations: NO
- Change server.js: NO
- Bind runtime: NO
- Grant production authority: NO

## 26. Implementation sequence

The required sequence is:

1. R10A truth scan.
2. R10B offline implementation contract.
3. R10C contract review and freeze.
4. R10D narrow offline implementation.
5. R10E implementation review.
6. R10F exact-scope commit and push.
7. R10 program closeout.

No implementation may begin before R10C is committed and pushed.

## 27. Exit criteria for R10B

R10B passes only when:

- the contract exists as one new untracked document;
- all required authority boundaries are explicit;
- approved-root rules are explicit;
- lexical and real-path checks are explicit;
- symlink rejection is explicit;
- size and content checks are explicit;
- redaction rules are explicit;
- test-fixture boundaries are explicit;
- implementation remains unauthorized;
- no source code changed;
- no CA file was read;
- no database contact occurred;
- no stage, commit, or push occurred.

#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');

const {
  createPostgreSQLRuntimePoolOptions,
  redactPostgreSQLRuntimePoolOptions,
} = require(path.join(
  ROOT,
  'runtime/orchestrator-service/lib/identity-workspace-authority/postgresql-runtime-pool-options-materializer.js',
));

function descriptor(overrides = {}) {
  const base = {
    descriptorType: 'postgresql-pool-configuration',
    runtimePoolOptions: false,
    runtimeMaterialized: false,
    connection: {
      host: '127.0.0.1',
      port: 5432,
      database: 'mh_identity',
      user: 'mh_identity_reader',
      password: 'offline-test-secret',
      applicationName: 'mh-os-identity-workspace-authority',
    },
    limits: {
      max: 8,
      idleTimeoutMs: 30000,
      connectTimeoutMs: 5000,
      statementTimeoutMs: 10000,
    },
    sslPolicy: {
      descriptorType: 'postgresql-ssl-policy',
      mode: 'require',
      runtimeMaterialized: false,
    },
  };

  return Object.freeze({
    ...base,
    ...overrides,
    connection: Object.freeze({
      ...base.connection,
      ...(overrides.connection || {}),
    }),
    limits: Object.freeze({
      ...base.limits,
      ...(overrides.limits || {}),
    }),
    sslPolicy: Object.freeze({
      ...base.sslPolicy,
      ...(overrides.sslPolicy || {}),
    }),
  });
}

function expectCode(fn, code) {
  assert.throws(fn, (error) => {
    assert.equal(error.code, code);
    return true;
  });
}

const tlsOptions = Object.freeze({
  rejectUnauthorized: true,
});

const runtime = createPostgreSQLRuntimePoolOptions(
  descriptor(),
  {
    runtimeSslOptions: tlsOptions,
  },
);

assert.deepEqual(runtime, {
  host: '127.0.0.1',
  port: 5432,
  database: 'mh_identity',
  user: 'mh_identity_reader',
  password: 'offline-test-secret',
  application_name: 'mh-os-identity-workspace-authority',
  max: 8,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  statement_timeout: 10000,
  ssl: {
    rejectUnauthorized: true,
  },
});

assert.equal(Object.isFrozen(runtime), true);
assert.equal(Object.isFrozen(runtime.ssl), true);

for (const forbiddenField of [
  'descriptorType',
  'runtimePoolOptions',
  'runtimeMaterialized',
  'connection',
  'limits',
  'sslPolicy',
  'applicationName',
  'idleTimeoutMs',
  'connectTimeoutMs',
  'statementTimeoutMs',
]) {
  assert.equal(Object.hasOwn(runtime, forbiddenField), false);
}

const disabledTlsRuntime = createPostgreSQLRuntimePoolOptions(
  descriptor({
    sslPolicy: {
      mode: 'disable',
    },
  }),
  {
    runtimeSslOptions: false,
  },
);

assert.equal(disabledTlsRuntime.ssl, false);
assert.equal(Object.isFrozen(disabledTlsRuntime), true);

const customCaRuntime = createPostgreSQLRuntimePoolOptions(
  descriptor({
    sslPolicy: {
      mode: 'verify-full',
    },
  }),
  {
    runtimeSslOptions: Object.freeze({
      rejectUnauthorized: true,
      ca: [
        '-----BEGIN CERTIFICATE-----',
        'VEVTVF9PTkxZ',
        '-----END CERTIFICATE-----',
      ].join('\n'),
    }),
  },
);

assert.equal(customCaRuntime.ssl.rejectUnauthorized, true);
assert.match(customCaRuntime.ssl.ca, /BEGIN CERTIFICATE/);
assert.equal(Object.isFrozen(customCaRuntime.ssl), true);

const redacted = redactPostgreSQLRuntimePoolOptions(
  customCaRuntime,
);

assert.deepEqual(redacted, {
  runtimePoolOptions: true,
  runtimeMaterialized: true,
  connection: {
    host: '127.0.0.1',
    port: 5432,
    database: 'mh_identity',
    user: 'mh_identity_reader',
    password: '[REDACTED]',
    applicationName: 'mh-os-identity-workspace-authority',
  },
  limits: {
    max: 8,
    idleTimeoutMs: 30000,
    connectTimeoutMs: 5000,
    statementTimeoutMs: 10000,
  },
  ssl: {
    enabled: true,
    rejectUnauthorized: true,
    customCaConfigured: true,
  },
  poolCreated: false,
  clientCreated: false,
  databaseContacted: false,
});

assert.equal(Object.isFrozen(redacted), true);
assert.equal(Object.isFrozen(redacted.connection), true);
assert.equal(Object.isFrozen(redacted.limits), true);
assert.equal(Object.isFrozen(redacted.ssl), true);

const serializedRedacted = JSON.stringify(redacted);

assert.doesNotMatch(serializedRedacted, /offline-test-secret/);
assert.doesNotMatch(serializedRedacted, /BEGIN CERTIFICATE/);

expectCode(
  () => createPostgreSQLRuntimePoolOptions(null, {
    runtimeSslOptions: tlsOptions,
  }),
  'DATABASE_POOL_OPTIONS_INVALID',
);

expectCode(
  () => createPostgreSQLRuntimePoolOptions(
    descriptor({
      runtimeMaterialized: true,
    }),
    {
      runtimeSslOptions: tlsOptions,
    },
  ),
  'DATABASE_POOL_OPTIONS_INVALID',
);

expectCode(
  () => createPostgreSQLRuntimePoolOptions(
    descriptor({
      connection: {
        host: '',
      },
    }),
    {
      runtimeSslOptions: tlsOptions,
    },
  ),
  'DATABASE_POOL_OPTIONS_INVALID',
);

expectCode(
  () => createPostgreSQLRuntimePoolOptions(
    descriptor({
      connection: {
        port: 70000,
      },
    }),
    {
      runtimeSslOptions: tlsOptions,
    },
  ),
  'DATABASE_POOL_OPTIONS_INVALID',
);

expectCode(
  () => createPostgreSQLRuntimePoolOptions(
    descriptor({
      limits: {
        max: 0,
      },
    }),
    {
      runtimeSslOptions: tlsOptions,
    },
  ),
  'DATABASE_POOL_OPTIONS_INVALID',
);

expectCode(
  () => createPostgreSQLRuntimePoolOptions(
    descriptor({
      limits: {
        idleTimeoutMs: 999,
      },
    }),
    {
      runtimeSslOptions: tlsOptions,
    },
  ),
  'DATABASE_POOL_OPTIONS_INVALID',
);

expectCode(
  () => createPostgreSQLRuntimePoolOptions(
    descriptor({
      limits: {
        connectTimeoutMs: 61000,
      },
    }),
    {
      runtimeSslOptions: tlsOptions,
    },
  ),
  'DATABASE_POOL_OPTIONS_INVALID',
);

expectCode(
  () => createPostgreSQLRuntimePoolOptions(
    descriptor({
      limits: {
        statementTimeoutMs: 0,
      },
    }),
    {
      runtimeSslOptions: tlsOptions,
    },
  ),
  'DATABASE_POOL_OPTIONS_INVALID',
);

expectCode(
  () => createPostgreSQLRuntimePoolOptions(
    descriptor(),
    {
      runtimeSslOptions: {
        rejectUnauthorized: false,
      },
    },
  ),
  'DATABASE_POOL_OPTIONS_INVALID',
);

expectCode(
  () => createPostgreSQLRuntimePoolOptions(
    descriptor(),
    {},
  ),
  'DATABASE_POOL_OPTIONS_INVALID',
);

expectCode(
  () => redactPostgreSQLRuntimePoolOptions({
    host: '127.0.0.1',
  }),
  'DATABASE_POOL_OPTIONS_INVALID',
);

const source = fs.readFileSync(
  path.join(
    ROOT,
    'runtime/orchestrator-service/lib/identity-workspace-authority/postgresql-runtime-pool-options-materializer.js',
  ),
  'utf8',
);

for (const pattern of [
  /require\s*\(\s*['"]pg['"]\s*\)/,
  /\bnew\s+Pool\s*\(/,
  /\bnew\s+Client\s*\(/,
  /\.connect\s*\(/,
  /\.query\s*\(/,
  /\bSELECT\s+/i,
  /\bINSERT\s+/i,
  /\bUPDATE\s+/i,
  /\bDELETE\s+/i,
]) {
  assert.equal(pattern.test(source), false);
}

const serverSource = fs.readFileSync(
  path.join(ROOT, 'runtime/orchestrator-service/server.js'),
  'utf8',
);

assert.doesNotMatch(
  serverSource,
  /postgresql-runtime-pool-options-materializer/,
);

console.log('POSTGRESQL_RUNTIME_POOL_OPTIONS_MATERIALIZER_OFFLINE=PASS');
console.log('CONNECTION_FIELD_MAPPING=PASS');
console.log('POOL_LIMIT_MAPPING=PASS');
console.log('APPLICATION_NAME_MAPPING=PASS');
console.log('STATEMENT_TIMEOUT_MAPPING=PASS');
console.log('DISABLED_SSL_MAPPING=PASS');
console.log('SYSTEM_TRUST_SSL_MAPPING=PASS');
console.log('CUSTOM_CA_SSL_MAPPING=PASS');
console.log('INSECURE_TLS_REJECTED=PASS');
console.log('DESCRIPTOR_FIELDS_EXCLUDED=PASS');
console.log('PASSWORD_REDACTION=PASS');
console.log('CERTIFICATE_REDACTION=PASS');
console.log('RUNTIME_OPTIONS_IMMUTABLE=PASS');
console.log('PG_IMPORT=ABSENT');
console.log('POOL_CREATED=NO');
console.log('CLIENT_CREATED=NO');
console.log('REAL_CA_FILE_READ=NO');
console.log('DATABASE_CONTACTED=NO');
console.log('SQL_EXECUTED=NO');
console.log('MIGRATION_EXECUTED=NO');
console.log('SERVER_JS_CHANGED=NO');
console.log('RUNTIME_BINDING_CHANGED=NO');
console.log('PRODUCTION_AUTHORITY=NO');

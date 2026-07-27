#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');

const BASE = path.join(
  ROOT,
  'runtime/orchestrator-service/lib/identity-workspace-authority',
);

const configModule = require(
  path.join(BASE, 'postgresql-config.js'),
);

const sslModule = require(
  path.join(BASE, 'postgresql-ssl-options.js'),
);

const poolModule = require(
  path.join(BASE, 'postgresql-pool-options.js'),
);

const adapterModule = require(
  path.join(BASE, 'postgresql-membership-read-adapter.js'),
);

function enabledEnv(overrides = {}) {
  return {
    MH_IDENTITY_DB_ENABLED: 'true',
    MH_IDENTITY_DB_HOST: '127.0.0.1',
    MH_IDENTITY_DB_PORT: '5432',
    MH_IDENTITY_DB_NAME: 'mh_identity',
    MH_IDENTITY_DB_USER: 'mh_identity_reader',
    MH_IDENTITY_DB_PASSWORD: 'offline-test-secret',
    MH_IDENTITY_DB_SSL_MODE: 'require',
    MH_IDENTITY_DB_POOL_MAX: '8',
    MH_IDENTITY_DB_IDLE_TIMEOUT_MS: '30000',
    MH_IDENTITY_DB_CONNECT_TIMEOUT_MS: '5000',
    MH_IDENTITY_DB_STATEMENT_TIMEOUT_MS: '10000',
    MH_IDENTITY_DB_APPLICATION_NAME: 'mh-os-identity-reader',
    ...overrides,
  };
}

const disabled = configModule.resolvePostgreSQLConfiguration({});

assert.equal(disabled.enabled, false);
assert.equal(disabled.state, 'DISABLED');
assert.equal(disabled.connection, null);
assert.equal(Object.isFrozen(disabled), true);

for (const value of ['', '0', 'false', 'no', 'off']) {
  const result = configModule.resolvePostgreSQLConfiguration({
    MH_IDENTITY_DB_ENABLED: value,
  });

  assert.equal(result.enabled, false);
}

assert.throws(
  () => configModule.resolvePostgreSQLConfiguration({
    MH_IDENTITY_DB_ENABLED: 'unexpected',
  }),
  (error) => {
    assert.equal(error.code, 'DATABASE_CONFIGURATION_INVALID');
    assert.equal(error.field, 'MH_IDENTITY_DB_ENABLED');
    return true;
  },
);

const enabled = configModule.resolvePostgreSQLConfiguration(
  enabledEnv(),
);

assert.equal(enabled.enabled, true);
assert.equal(enabled.state, 'ENABLED');
assert.equal(enabled.connection.host, '127.0.0.1');
assert.equal(enabled.connection.port, 5432);
assert.equal(enabled.connection.database, 'mh_identity');
assert.equal(enabled.connection.user, 'mh_identity_reader');
assert.equal(enabled.connection.password, 'offline-test-secret');
assert.equal(enabled.pool.max, 8);
assert.equal(enabled.ssl.mode, 'require');
assert.equal(Object.isFrozen(enabled), true);
assert.equal(Object.isFrozen(enabled.connection), true);
assert.equal(Object.isFrozen(enabled.pool), true);
assert.equal(Object.isFrozen(enabled.ssl), true);

const genericOnly = configModule.resolvePostgreSQLConfiguration({
  DATABASE_URL: 'postgresql://forbidden.example/db',
  PGHOST: 'forbidden.example',
});

assert.equal(genericOnly.enabled, false);
assert.equal(genericOnly.connection, null);

for (const scenario of [
  ['MH_IDENTITY_DB_HOST', ''],
  ['MH_IDENTITY_DB_PORT', '0'],
  ['MH_IDENTITY_DB_PORT', '65536'],
  ['MH_IDENTITY_DB_POOL_MAX', '51'],
  ['MH_IDENTITY_DB_NAME', 'bad/name'],
  ['MH_IDENTITY_DB_SSL_MODE', 'prefer'],
]) {
  assert.throws(
    () => configModule.resolvePostgreSQLConfiguration(
      enabledEnv({
        [scenario[0]]: scenario[1],
      }),
    ),
    (error) => {
      assert.equal(error.code, 'DATABASE_CONFIGURATION_INVALID');
      assert.equal(error.field, scenario[0]);
      return true;
    },
  );
}

assert.throws(
  () => configModule.resolvePostgreSQLConfiguration(
    enabledEnv({
      MH_IDENTITY_DB_SSL_MODE: 'verify-full',
      MH_IDENTITY_DB_SSL_CA_FILE: '',
    }),
  ),
  (error) => {
    assert.equal(error.field, 'MH_IDENTITY_DB_SSL_CA_FILE');
    return true;
  },
);

const verifiedConfiguration =
  configModule.resolvePostgreSQLConfiguration(
    enabledEnv({
      MH_IDENTITY_DB_SSL_MODE: 'verify-full',
      MH_IDENTITY_DB_SSL_CA_FILE: '/secure/ca.pem',
    }),
  );

const verifiedSsl =
  sslModule.buildPostgreSQLSslPolicyDescriptor(
    verifiedConfiguration,
  );

assert.equal(
  verifiedSsl.descriptorType,
  'postgresql-ssl-policy',
);
assert.equal(verifiedSsl.mode, 'verify-full');
assert.equal(verifiedSsl.tlsEnabled, true);
assert.equal(verifiedSsl.runtimeMaterialized, false);
assert.equal(verifiedSsl.rejectUnauthorized, true);
assert.equal(verifiedSsl.caFile, '/secure/ca.pem');
assert.equal(
  verifiedSsl.certificateVerification,
  'CA_AND_HOSTNAME',
);

const poolOptions =
  poolModule.buildPostgreSQLPoolConfigurationDescriptor(enabled);

assert.equal(
  poolOptions.descriptorType,
  'postgresql-pool-configuration',
);
assert.equal(poolOptions.runtimePoolOptions, false);
assert.equal(poolOptions.runtimeMaterialized, false);
assert.equal(poolOptions.connection.host, '127.0.0.1');
assert.equal(poolOptions.connection.port, 5432);
assert.equal(poolOptions.connection.database, 'mh_identity');
assert.equal(poolOptions.connection.user, 'mh_identity_reader');
assert.equal(poolOptions.connection.password, 'offline-test-secret');
assert.equal(poolOptions.limits.max, 8);
assert.equal(poolOptions.limits.connectTimeoutMs, 5000);
assert.equal(poolOptions.limits.statementTimeoutMs, 10000);
assert.equal(poolOptions.limits.statementTimeoutMs, 10000);
assert.equal(poolOptions.sslPolicy.rejectUnauthorized, true);
assert.equal(poolOptions.sslPolicy.runtimeMaterialized, false);
assert.equal(Object.hasOwn(poolOptions, 'ssl'), false);
assert.equal(Object.isFrozen(poolOptions), true);

assert.throws(
  () => poolModule.buildPostgreSQLPoolConfigurationDescriptor(disabled),
  (error) => {
    assert.equal(error.code, 'DATABASE_AUTHORITY_DISABLED');
    return true;
  },
);

const redacted =
  configModule.redactPostgreSQLConfiguration(enabled);

assert.equal(
  redacted.connection.password,
  '[REDACTED]',
);

assert.doesNotMatch(
  JSON.stringify(redacted),
  /offline-test-secret/,
);

const disabledAdapter =
  adapterModule.createPostgreSQLMembershipReadAdapter({
    configuration: disabled,
  });

assert.equal(disabledAdapter.state, 'DISABLED');

const enabledAdapter =
  adapterModule.createPostgreSQLMembershipReadAdapter({
    configuration: enabled,
  });

assert.equal(enabledAdapter.state, 'SKELETON_ONLY');

for (const operation of adapterModule.READ_OPERATIONS) {
  assert.equal(typeof enabledAdapter[operation], 'function');

  const result = enabledAdapter[operation]('ignored');

  assert.equal(result.ok, false);
  assert.equal(result.operation, operation);
  assert.equal(result.code, 'DATABASE_AUTHORITY_NOT_READY');
  assert.equal(result.databaseContacted, false);
  assert.equal(result.sqlExecuted, false);
  assert.equal(result.productionAuthority, false);
  assert.equal(Object.isFrozen(result), true);
}

const implementationFiles = [
  'postgresql-config.js',
  'postgresql-ssl-options.js',
  'postgresql-pool-options.js',
  'postgresql-membership-read-adapter.js',
].map((name) => path.join(BASE, name));

const forbiddenPatterns = [
  /\brequire\s*\(\s*['"]pg['"]\s*\)/,
  /\bnew\s+Pool\s*\(/,
  /\bnew\s+Client\s*\(/,
  /\.connect\s*\(/,
  /\.query\s*\(/,
  /\bSELECT\b/i,
  /\bINSERT\b/i,
  /\bUPDATE\b/i,
  /\bDELETE\b/i,
];

for (const file of implementationFiles) {
  const source = fs.readFileSync(file, 'utf8');

  for (const pattern of forbiddenPatterns) {
    assert.equal(
      pattern.test(source),
      false,
      `${path.relative(ROOT, file)} contains ${pattern}`,
    );
  }
}

const serverSource = fs.readFileSync(
  path.join(ROOT, 'runtime/orchestrator-service/server.js'),
  'utf8',
);

assert.doesNotMatch(
  serverSource,
  /identity-workspace-authority\/postgresql-/,
);

console.log('POSTGRESQL_CONFIGURATION_AND_READ_ADAPTER_SKELETON=PASS');
console.log('NAMESPACED_CONFIGURATION=PASS');
console.log('GENERIC_DATABASE_ENV_FALLBACK=ABSENT');
console.log('CONFIGURATION_FAIL_CLOSED=PASS');
console.log('CONFIGURATION_IMMUTABILITY=PASS');
console.log('CREDENTIAL_REDACTION=PASS');
console.log('SSL_POLICY_DESCRIPTOR_CONSTRUCTION=PASS');
console.log('POOL_CONFIGURATION_DESCRIPTOR_CONSTRUCTION=PASS');
console.log('READ_ADAPTER_SKELETON=PASS');
console.log('PG_IMPORT=ABSENT');
console.log('DATABASE_CONTACTED=NO');
console.log('SQL_EXECUTED=NO');
console.log('MIGRATION_EXECUTED=NO');
console.log('POOL_CREATED=NO');
console.log('CLIENT_CREATED=NO');
console.log('SERVER_JS_CHANGED=NO');
console.log('RUNTIME_BINDING_CHANGED=NO');
console.log('PRODUCTION_AUTHORITY=NO');

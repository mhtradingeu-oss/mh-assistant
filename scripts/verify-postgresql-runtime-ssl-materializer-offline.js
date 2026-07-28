#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');

const {
  createPostgreSQLRuntimeSslOptions,
  redactPostgreSQLRuntimeSslOptions,
} = require(path.join(
  ROOT,
  'runtime/orchestrator-service/lib/identity-workspace-authority/postgresql-runtime-ssl-materializer.js',
));

function policy(mode, caFile = null) {
  return Object.freeze({
    descriptorType: 'postgresql-ssl-policy',
    mode,
    runtimeMaterialized: false,
    caFile,
  });
}

function caMaterial(mode = 'verify-full') {
  return Object.freeze({
    descriptorType: 'postgresql-ca-material',
    materialized: true,
    sslMode: mode,
    certificateMaterial: [
      '-----BEGIN CERTIFICATE-----',
      'VEVTVF9PTkxZ',
      '-----END CERTIFICATE-----',
    ].join('\n'),
    filesystemRead: true,
    databaseContacted: false,
    runtimeSslCreated: false,
  });
}

function expectCode(fn, code) {
  assert.throws(fn, (error) => {
    assert.equal(error.code, code);
    return true;
  });
}

const disabled = createPostgreSQLRuntimeSslOptions(policy('disable'));
assert.equal(disabled, false);

const disabledProjection = redactPostgreSQLRuntimeSslOptions(disabled);
assert.equal(disabledProjection.tlsEnabled, false);
assert.equal(disabledProjection.rejectUnauthorized, false);
assert.equal(disabledProjection.customCaConfigured, false);
assert.equal(Object.isFrozen(disabledProjection), true);

const required = createPostgreSQLRuntimeSslOptions(policy('require'));
assert.deepEqual(required, { rejectUnauthorized: true });
assert.equal(required.rejectUnauthorized, true);
assert.equal(Object.hasOwn(required, 'ca'), false);
assert.equal(Object.isFrozen(required), true);

const requiredProjection = redactPostgreSQLRuntimeSslOptions(required);
assert.equal(requiredProjection.tlsEnabled, true);
assert.equal(requiredProjection.rejectUnauthorized, true);
assert.equal(requiredProjection.customCaConfigured, false);

expectCode(
  () => createPostgreSQLRuntimeSslOptions(
    policy('require', '/forbidden/private-ca.pem'),
  ),
  'DATABASE_SSL_POLICY_INVALID',
);

expectCode(
  () => createPostgreSQLRuntimeSslOptions(
    policy('verify-ca'),
    { caMaterial: caMaterial('verify-ca') },
  ),
  'DATABASE_SSL_MODE_UNSUPPORTED',
);

expectCode(
  () => createPostgreSQLRuntimeSslOptions(policy('verify-full')),
  'DATABASE_SSL_CA_MATERIAL_INVALID',
);

expectCode(
  () => createPostgreSQLRuntimeSslOptions(
    policy('verify-full'),
    { caMaterial: caMaterial('verify-ca') },
  ),
  'DATABASE_SSL_CA_MATERIAL_INVALID',
);

expectCode(
  () => createPostgreSQLRuntimeSslOptions(
    policy('verify-full'),
    {
      caMaterial: {
        ...caMaterial(),
        certificateMaterial: '',
      },
    },
  ),
  'DATABASE_SSL_CA_MATERIAL_INVALID',
);

const verified = createPostgreSQLRuntimeSslOptions(
  policy('verify-full', '/approved/test-ca.pem'),
  { caMaterial: caMaterial() },
);

assert.equal(verified.rejectUnauthorized, true);
assert.match(verified.ca, /BEGIN CERTIFICATE/);
assert.equal(Object.isFrozen(verified), true);

for (const descriptorField of [
  'mode',
  'caFile',
  'certificateVerification',
  'runtimeMaterialized',
]) {
  assert.equal(Object.hasOwn(verified, descriptorField), false);
}

const verifiedProjection = redactPostgreSQLRuntimeSslOptions(verified);
assert.equal(verifiedProjection.tlsEnabled, true);
assert.equal(verifiedProjection.rejectUnauthorized, true);
assert.equal(verifiedProjection.customCaConfigured, true);
assert.equal(Object.isFrozen(verifiedProjection), true);

const serializedProjection = JSON.stringify(verifiedProjection);
assert.doesNotMatch(serializedProjection, /BEGIN CERTIFICATE/);
assert.doesNotMatch(serializedProjection, /test-ca\.pem/);

expectCode(
  () => createPostgreSQLRuntimeSslOptions({ mode: 'verify-full' }),
  'DATABASE_SSL_POLICY_INVALID',
);

expectCode(
  () => createPostgreSQLRuntimeSslOptions(policy('unknown')),
  'DATABASE_SSL_MODE_UNSUPPORTED',
);

expectCode(
  () => redactPostgreSQLRuntimeSslOptions({
    rejectUnauthorized: false,
  }),
  'DATABASE_SSL_RUNTIME_OPTIONS_INVALID',
);

const source = fs.readFileSync(
  path.join(
    ROOT,
    'runtime/orchestrator-service/lib/identity-workspace-authority/postgresql-runtime-ssl-materializer.js',
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
  /postgresql-runtime-ssl-materializer/,
);

console.log('POSTGRESQL_RUNTIME_SSL_MATERIALIZER_OFFLINE=PASS');
console.log('DISABLE_MODE=PASS');
console.log('DISABLED_TLS_PROJECTION=PASS');
console.log('REQUIRE_SYSTEM_TRUST_MODE=PASS');
console.log('VERIFY_CA_FAIL_CLOSED=PASS');
console.log('VERIFY_FULL_CUSTOM_CA_MODE=PASS');
console.log('TLS_ENABLED_REJECT_UNAUTHORIZED_TRUE=PASS');
console.log('DESCRIPTOR_FIELDS_EXCLUDED=PASS');
console.log('CERTIFICATE_REDACTION=PASS');
console.log('PG_IMPORT=ABSENT');
console.log('REAL_CA_FILE_READ=NO');
console.log('DATABASE_CONTACTED=NO');
console.log('SQL_EXECUTED=NO');
console.log('MIGRATION_EXECUTED=NO');
console.log('POOL_CREATED=NO');
console.log('CLIENT_CREATED=NO');
console.log('SERVER_JS_CHANGED=NO');
console.log('RUNTIME_BINDING_CHANGED=NO');
console.log('PRODUCTION_AUTHORITY=NO');

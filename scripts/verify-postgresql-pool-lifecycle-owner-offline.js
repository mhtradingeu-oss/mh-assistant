#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');

const {
  createPostgreSQLPoolLifecycleOwner,
} = require(path.join(
  ROOT,
  'runtime/orchestrator-service/lib/identity-workspace-authority/postgresql-pool-lifecycle-owner.js',
));

function runtimeOptions() {
  return Object.freeze({
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
    ssl: Object.freeze({
      rejectUnauthorized: true,
    }),
  });
}

function deferred() {
  let resolve;
  let reject;

  const promise = new Promise((resolveFn, rejectFn) => {
    resolve = resolveFn;
    reject = rejectFn;
  });

  return { promise, resolve, reject };
}

function expectCode(promise, code) {
  return assert.rejects(
    promise,
    (error) => {
      assert.equal(error.code, code);
      return true;
    },
  );
}

async function main() {
  let nowValue = 1000;
  let constructorCalls = 0;
  let endCalls = 0;
  let queryCalls = 0;
  let connectCalls = 0;

  const initializationGate = deferred();

  const fakePool = {
    end() {
      endCalls += 1;
      return Promise.resolve();
    },
    query() {
      queryCalls += 1;
      throw new Error('Query must not execute');
    },
    connect() {
      connectCalls += 1;
      throw new Error('Connect must not execute');
    },
  };

  const dependencies = {
    constructPool(options) {
      constructorCalls += 1;
      assert.equal(options.password, 'offline-test-secret');

      return initializationGate.promise.then(() => fakePool);
    },
    scheduleTimeout(callback, milliseconds) {
      return setTimeout(callback, milliseconds);
    },
    clearTimeout(handle) {
      clearTimeout(handle);
    },
    now() {
      nowValue += 1;
      return nowValue;
    },
  };

  const owner = createPostgreSQLPoolLifecycleOwner({
    enabled: true,
    shutdownTimeoutMs: 1000,
    dependencies,
  });

  assert.deepEqual(owner.getHealth(), {
    authority: 'identity-workspace-membership',
    state: 'UNINITIALIZED',
    enabled: true,
    poolPresent: false,
    initializationPending: false,
    shutdownPending: false,
    lastErrorCode: null,
    initializedAt: null,
    closedAt: null,
    databaseContacted: false,
    productionAuthority: false,
  });

  assert.equal(owner.getReadiness().ready, false);
  assert.equal(owner.getReadiness().reason, 'DATABASE_AUTHORITY_NOT_READY');

  const firstInitialization = owner.initialize(runtimeOptions());
  const secondInitialization = owner.initialize(runtimeOptions());

  assert.equal(firstInitialization, secondInitialization);

  await Promise.resolve();

  assert.equal(constructorCalls, 1);
  assert.equal(owner.getHealth().state, 'INITIALIZING');
  assert.equal(owner.getHealth().initializationPending, true);

  initializationGate.resolve();

  const [firstResult, secondResult] = await Promise.all([
    firstInitialization,
    secondInitialization,
  ]);

  assert.equal(firstResult.state, 'READY');
  assert.equal(secondResult.state, 'READY');
  assert.equal(constructorCalls, 1);
  assert.equal(owner.getReadiness().ready, true);
  assert.equal(owner.getHealth().poolPresent, true);

  const repeatedInitialization = await owner.initialize(runtimeOptions());

  assert.equal(repeatedInitialization.state, 'READY');
  assert.equal(constructorCalls, 1);

  assert.equal(owner.markDegraded().state, 'DEGRADED');
  assert.equal(owner.getReadiness().ready, false);
  assert.equal(owner.markReady().state, 'READY');

  const firstShutdown = owner.shutdown();
  const secondShutdown = owner.shutdown();

  assert.equal(firstShutdown, secondShutdown);

  const [firstShutdownResult, secondShutdownResult] = await Promise.all([
    firstShutdown,
    secondShutdown,
  ]);

  assert.equal(firstShutdownResult.state, 'CLOSED');
  assert.equal(secondShutdownResult.state, 'CLOSED');
  assert.equal(endCalls, 1);
  assert.equal(owner.getHealth().poolPresent, false);

  const repeatedShutdown = await owner.shutdown();

  assert.equal(repeatedShutdown.state, 'CLOSED');
  assert.equal(endCalls, 1);

  await expectCode(
    owner.initialize(runtimeOptions()),
    'DATABASE_POOL_ALREADY_CLOSED',
  );

  assert.throws(
    () => owner.markReady(),
    (error) => {
      assert.equal(error.code, 'DATABASE_AUTHORITY_STATE_INVALID');
      return true;
    },
  );

  const disabledOwner = createPostgreSQLPoolLifecycleOwner({
    enabled: false,
    dependencies,
  });

  assert.equal(disabledOwner.getHealth().state, 'DISABLED');
  assert.equal(disabledOwner.getReadiness().reason, 'DATABASE_AUTHORITY_DISABLED');

  await expectCode(
    disabledOwner.initialize(runtimeOptions()),
    'DATABASE_AUTHORITY_DISABLED',
  );

  const disabledShutdown = await disabledOwner.shutdown();

  assert.equal(disabledShutdown.state, 'DISABLED');

  const failingOwner = createPostgreSQLPoolLifecycleOwner({
    dependencies: {
      ...dependencies,
      constructPool() {
        throw new Error('private provider failure');
      },
    },
  });

  await expectCode(
    failingOwner.initialize(runtimeOptions()),
    'DATABASE_POOL_INITIALIZATION_FAILED',
  );

  assert.equal(failingOwner.getHealth().state, 'FAILED');
  assert.equal(
    failingOwner.getHealth().lastErrorCode,
    'DATABASE_POOL_INITIALIZATION_FAILED',
  );

  const failedOwnerShutdown = await failingOwner.shutdown();

  assert.equal(failedOwnerShutdown.state, 'CLOSED');

  await expectCode(
    createPostgreSQLPoolLifecycleOwner({
      dependencies,
    }).initialize({
      host: '127.0.0.1',
    }),
    'DATABASE_POOL_OPTIONS_INVALID',
  );

  assert.equal(queryCalls, 0);
  assert.equal(connectCalls, 0);

  const serializedHealth = JSON.stringify(owner.getHealth());
  const serializedReadiness = JSON.stringify(owner.getReadiness());

  assert.doesNotMatch(serializedHealth, /offline-test-secret/);
  assert.doesNotMatch(serializedReadiness, /offline-test-secret/);
  assert.doesNotMatch(serializedHealth, /BEGIN CERTIFICATE/);
  assert.doesNotMatch(serializedReadiness, /BEGIN CERTIFICATE/);

  const source = fs.readFileSync(
    path.join(
      ROOT,
      'runtime/orchestrator-service/lib/identity-workspace-authority/postgresql-pool-lifecycle-owner.js',
    ),
    'utf8',
  );

  for (const pattern of [
    /require\s*\(\s*['"]pg['"]\s*\)/,
    /\bnew\s+Pool\s*\(/,
    /\bnew\s+Client\s*\(/,
    /\.query\s*\(/,
    /\bSELECT\s+/i,
    /\bINSERT\s+/i,
    /\bUPDATE\s+/i,
    /\bDELETE\s+/i,
    /process\.on\s*\(/,
    /SIGINT/,
    /SIGTERM/,
  ]) {
    assert.equal(pattern.test(source), false);
  }

  const serverSource = fs.readFileSync(
    path.join(ROOT, 'runtime/orchestrator-service/server.js'),
    'utf8',
  );

  assert.doesNotMatch(
    serverSource,
    /postgresql-pool-lifecycle-owner/,
  );

  console.log('POSTGRESQL_POOL_LIFECYCLE_OWNER_OFFLINE=PASS');
  console.log('STATE_MACHINE=PASS');
  console.log('SINGLETON_INITIALIZATION=PASS');
  console.log('CONCURRENT_INITIALIZATION_PROMISE_REUSE=PASS');
  console.log('SINGLE_FAKE_POOL_INSTANCE=PASS');
  console.log('READY_DEGRADED_READY_TRANSITIONS=PASS');
  console.log('INVALID_TRANSITION_REJECTION=PASS');
  console.log('IDEMPOTENT_SHUTDOWN=PASS');
  console.log('SERIALIZED_SHUTDOWN=PASS');
  console.log('POOL_END_CALLED_ONCE=PASS');
  console.log('INITIALIZATION_AFTER_CLOSE_REJECTED=PASS');
  console.log('DISABLED_AUTHORITY=PASS');
  console.log('INITIALIZATION_FAILURE_SANITIZED=PASS');
  console.log('HEALTH_REDACTION=PASS');
  console.log('READINESS_REDACTION=PASS');
  console.log('PG_IMPORT=ABSENT');
  console.log('FAKE_POOL_CREATED=YES');
  console.log('REAL_POOL_CREATED=NO');
  console.log('POOL_CONNECT_CALLED=NO');
  console.log('POOL_QUERY_CALLED=NO');
  console.log('DATABASE_CONTACTED=NO');
  console.log('SQL_EXECUTED=NO');
  console.log('MIGRATION_EXECUTED=NO');
  console.log('SIGNAL_HANDLER_REGISTERED=NO');
  console.log('SERVER_JS_CHANGED=NO');
  console.log('RUNTIME_BINDING_CHANGED=NO');
  console.log('PRODUCTION_AUTHORITY=NO');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

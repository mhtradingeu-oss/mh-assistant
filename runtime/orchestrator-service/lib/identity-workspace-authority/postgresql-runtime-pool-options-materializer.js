'use strict';

class PostgreSQLRuntimePoolOptionsError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'PostgreSQLRuntimePoolOptionsError';
    this.code = code;
  }
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) {
    return value;
  }

  for (const child of Object.values(value)) {
    deepFreeze(child);
  }

  return Object.freeze(value);
}

function requireString(value, field) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new PostgreSQLRuntimePoolOptionsError(
      'DATABASE_POOL_OPTIONS_INVALID',
      `PostgreSQL Pool descriptor field ${field} is invalid`,
    );
  }

  return value;
}

function requireInteger(value, field, minimum, maximum) {
  if (
    !Number.isSafeInteger(value)
    || value < minimum
    || value > maximum
  ) {
    throw new PostgreSQLRuntimePoolOptionsError(
      'DATABASE_POOL_OPTIONS_INVALID',
      `PostgreSQL Pool descriptor field ${field} is invalid`,
    );
  }

  return value;
}

function validateDescriptor(descriptor) {
  if (
    !descriptor
    || descriptor.descriptorType !== 'postgresql-pool-configuration'
    || descriptor.runtimePoolOptions !== false
    || descriptor.runtimeMaterialized !== false
    || !descriptor.connection
    || !descriptor.limits
    || !descriptor.sslPolicy
  ) {
    throw new PostgreSQLRuntimePoolOptionsError(
      'DATABASE_POOL_OPTIONS_INVALID',
      'PostgreSQL Pool configuration descriptor is invalid',
    );
  }

  return descriptor;
}

function validateRuntimeSslOptions(runtimeSslOptions) {
  if (runtimeSslOptions === false) {
    return false;
  }

  if (
    !runtimeSslOptions
    || typeof runtimeSslOptions !== 'object'
    || runtimeSslOptions.rejectUnauthorized !== true
  ) {
    throw new PostgreSQLRuntimePoolOptionsError(
      'DATABASE_POOL_OPTIONS_INVALID',
      'PostgreSQL runtime SSL options are invalid',
    );
  }

  return runtimeSslOptions;
}

function createPostgreSQLRuntimePoolOptions(
  descriptorInput,
  options = {},
) {
  const descriptor = validateDescriptor(descriptorInput);
  const connection = descriptor.connection;
  const limits = descriptor.limits;

  const runtimeSslOptions = validateRuntimeSslOptions(
    options.runtimeSslOptions,
  );

  const result = {
    host: requireString(connection.host, 'connection.host'),
    port: requireInteger(
      connection.port,
      'connection.port',
      1,
      65535,
    ),
    database: requireString(
      connection.database,
      'connection.database',
    ),
    user: requireString(connection.user, 'connection.user'),
    password: requireString(
      connection.password,
      'connection.password',
    ),
    application_name: requireString(
      connection.applicationName,
      'connection.applicationName',
    ),
    max: requireInteger(
      limits.max,
      'limits.max',
      1,
      50,
    ),
    idleTimeoutMillis: requireInteger(
      limits.idleTimeoutMs,
      'limits.idleTimeoutMs',
      1000,
      300000,
    ),
    connectionTimeoutMillis: requireInteger(
      limits.connectTimeoutMs,
      'limits.connectTimeoutMs',
      1000,
      60000,
    ),
    statement_timeout: requireInteger(
      limits.statementTimeoutMs,
      'limits.statementTimeoutMs',
      1000,
      300000,
    ),
    ssl: runtimeSslOptions,
  };

  return deepFreeze(result);
}

function redactPostgreSQLRuntimePoolOptions(runtimeOptions) {
  if (
    !runtimeOptions
    || typeof runtimeOptions !== 'object'
    || typeof runtimeOptions.host !== 'string'
    || !Number.isSafeInteger(runtimeOptions.port)
    || typeof runtimeOptions.database !== 'string'
    || typeof runtimeOptions.user !== 'string'
    || typeof runtimeOptions.application_name !== 'string'
    || !Number.isSafeInteger(runtimeOptions.max)
    || !Number.isSafeInteger(runtimeOptions.idleTimeoutMillis)
    || !Number.isSafeInteger(runtimeOptions.connectionTimeoutMillis)
    || !Number.isSafeInteger(runtimeOptions.statement_timeout)
    || !Object.hasOwn(runtimeOptions, 'ssl')
  ) {
    throw new PostgreSQLRuntimePoolOptionsError(
      'DATABASE_POOL_OPTIONS_INVALID',
      'PostgreSQL runtime Pool options are invalid',
    );
  }

  return deepFreeze({
    runtimePoolOptions: true,
    runtimeMaterialized: true,
    connection: {
      host: runtimeOptions.host,
      port: runtimeOptions.port,
      database: runtimeOptions.database,
      user: runtimeOptions.user,
      password: '[REDACTED]',
      applicationName: runtimeOptions.application_name,
    },
    limits: {
      max: runtimeOptions.max,
      idleTimeoutMs: runtimeOptions.idleTimeoutMillis,
      connectTimeoutMs: runtimeOptions.connectionTimeoutMillis,
      statementTimeoutMs: runtimeOptions.statement_timeout,
    },
    ssl: {
      enabled: runtimeOptions.ssl !== false,
      rejectUnauthorized:
        runtimeOptions.ssl === false
          ? false
          : runtimeOptions.ssl.rejectUnauthorized === true,
      customCaConfigured:
        runtimeOptions.ssl !== false
        && typeof runtimeOptions.ssl.ca === 'string'
        && runtimeOptions.ssl.ca.trim() !== '',
    },
    poolCreated: false,
    clientCreated: false,
    databaseContacted: false,
  });
}

module.exports = Object.freeze({
  PostgreSQLRuntimePoolOptionsError,
  createPostgreSQLRuntimePoolOptions,
  redactPostgreSQLRuntimePoolOptions,
});

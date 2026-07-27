'use strict';

const CONFIGURATION_STATES = Object.freeze({
  DISABLED: 'DISABLED',
  ENABLED: 'ENABLED',
});

const SSL_MODES = Object.freeze([
  'disable',
  'require',
  'verify-ca',
  'verify-full',
]);

const DEFAULTS = Object.freeze({
  port: 5432,
  poolMax: 10,
  idleTimeoutMs: 30000,
  connectTimeoutMs: 5000,
  statementTimeoutMs: 10000,
  applicationName: 'mh-os-identity-workspace-authority',
});

class PostgreSQLConfigurationError extends Error {
  constructor(code, field, message) {
    super(message);
    this.name = 'PostgreSQLConfigurationError';
    this.code = code;
    this.field = field || null;
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

function readText(env, key) {
  if (!env || !Object.prototype.hasOwnProperty.call(env, key)) {
    return '';
  }

  if (env[key] === undefined || env[key] === null) {
    return '';
  }

  return String(env[key]).trim();
}

function parseEnabled(raw) {
  const value = String(raw || '').trim().toLowerCase();

  if (['', '0', 'false', 'no', 'off'].includes(value)) {
    return false;
  }

  if (['1', 'true', 'yes', 'on'].includes(value)) {
    return true;
  }

  throw new PostgreSQLConfigurationError(
    'DATABASE_CONFIGURATION_INVALID',
    'MH_IDENTITY_DB_ENABLED',
    'MH_IDENTITY_DB_ENABLED must be an explicit boolean value',
  );
}

function requireText(env, key) {
  const value = readText(env, key);

  if (!value) {
    throw new PostgreSQLConfigurationError(
      'DATABASE_CONFIGURATION_INVALID',
      key,
      `${key} is required when PostgreSQL authority is enabled`,
    );
  }

  return value;
}

function parseInteger(env, key, fallback, min, max) {
  const raw = readText(env, key);

  if (!raw) {
    return fallback;
  }

  if (!/^[0-9]+$/.test(raw)) {
    throw new PostgreSQLConfigurationError(
      'DATABASE_CONFIGURATION_INVALID',
      key,
      `${key} must be a base-10 integer`,
    );
  }

  const value = Number(raw);

  if (!Number.isSafeInteger(value) || value < min || value > max) {
    throw new PostgreSQLConfigurationError(
      'DATABASE_CONFIGURATION_INVALID',
      key,
      `${key} is outside the approved range`,
    );
  }

  return value;
}

function validateHost(value) {
  if (
    value.includes('/')
    || value.includes('\\')
    || value.includes('@')
    || /\s/.test(value)
  ) {
    throw new PostgreSQLConfigurationError(
      'DATABASE_CONFIGURATION_INVALID',
      'MH_IDENTITY_DB_HOST',
      'MH_IDENTITY_DB_HOST is malformed',
    );
  }

  return value;
}

function validateIdentifier(value, field) {
  if (!/^[A-Za-z0-9_.-]+$/.test(value)) {
    throw new PostgreSQLConfigurationError(
      'DATABASE_CONFIGURATION_INVALID',
      field,
      `${field} contains unsupported characters`,
    );
  }

  return value;
}

function resolvePostgreSQLConfiguration(env = process.env) {
  const enabled = parseEnabled(
    readText(env, 'MH_IDENTITY_DB_ENABLED'),
  );

  if (!enabled) {
    return deepFreeze({
      state: CONFIGURATION_STATES.DISABLED,
      enabled: false,
      authority: 'identity-workspace-membership',
      configurationVersion: 1,
      connection: null,
      pool: null,
      ssl: null,
    });
  }

  const host = validateHost(
    requireText(env, 'MH_IDENTITY_DB_HOST'),
  );

  const port = parseInteger(
    env,
    'MH_IDENTITY_DB_PORT',
    DEFAULTS.port,
    1,
    65535,
  );

  const database = validateIdentifier(
    requireText(env, 'MH_IDENTITY_DB_NAME'),
    'MH_IDENTITY_DB_NAME',
  );

  const user = validateIdentifier(
    requireText(env, 'MH_IDENTITY_DB_USER'),
    'MH_IDENTITY_DB_USER',
  );

  const password = requireText(
    env,
    'MH_IDENTITY_DB_PASSWORD',
  );

  const sslMode = requireText(
    env,
    'MH_IDENTITY_DB_SSL_MODE',
  ).toLowerCase();

  if (!SSL_MODES.includes(sslMode)) {
    throw new PostgreSQLConfigurationError(
      'DATABASE_CONFIGURATION_INVALID',
      'MH_IDENTITY_DB_SSL_MODE',
      'MH_IDENTITY_DB_SSL_MODE is not approved',
    );
  }

  const sslCaFile = readText(
    env,
    'MH_IDENTITY_DB_SSL_CA_FILE',
  );

  if (
    ['verify-ca', 'verify-full'].includes(sslMode)
    && !sslCaFile
  ) {
    throw new PostgreSQLConfigurationError(
      'DATABASE_CONFIGURATION_INVALID',
      'MH_IDENTITY_DB_SSL_CA_FILE',
      'A CA file is required for certificate verification modes',
    );
  }

  const poolMax = parseInteger(
    env,
    'MH_IDENTITY_DB_POOL_MAX',
    DEFAULTS.poolMax,
    1,
    50,
  );

  const idleTimeoutMs = parseInteger(
    env,
    'MH_IDENTITY_DB_IDLE_TIMEOUT_MS',
    DEFAULTS.idleTimeoutMs,
    1000,
    300000,
  );

  const connectTimeoutMs = parseInteger(
    env,
    'MH_IDENTITY_DB_CONNECT_TIMEOUT_MS',
    DEFAULTS.connectTimeoutMs,
    1000,
    60000,
  );

  const statementTimeoutMs = parseInteger(
    env,
    'MH_IDENTITY_DB_STATEMENT_TIMEOUT_MS',
    DEFAULTS.statementTimeoutMs,
    1000,
    300000,
  );

  const applicationName = validateIdentifier(
    readText(env, 'MH_IDENTITY_DB_APPLICATION_NAME')
      || DEFAULTS.applicationName,
    'MH_IDENTITY_DB_APPLICATION_NAME',
  );

  return deepFreeze({
    state: CONFIGURATION_STATES.ENABLED,
    enabled: true,
    authority: 'identity-workspace-membership',
    configurationVersion: 1,
    connection: {
      host,
      port,
      database,
      user,
      password,
      applicationName,
    },
    pool: {
      max: poolMax,
      idleTimeoutMs,
      connectTimeoutMs,
      statementTimeoutMs,
    },
    ssl: {
      mode: sslMode,
      caFile: sslCaFile || null,
    },
  });
}

function redactPostgreSQLConfiguration(configuration) {
  if (!configuration || configuration.enabled !== true) {
    return deepFreeze({
      state: CONFIGURATION_STATES.DISABLED,
      enabled: false,
    });
  }

  return deepFreeze({
    state: configuration.state,
    enabled: true,
    authority: configuration.authority,
    configurationVersion: configuration.configurationVersion,
    connection: {
      host: configuration.connection.host,
      port: configuration.connection.port,
      database: configuration.connection.database,
      user: configuration.connection.user,
      password: '[REDACTED]',
      applicationName: configuration.connection.applicationName,
    },
    pool: configuration.pool,
    ssl: {
      mode: configuration.ssl.mode,
      caFileConfigured: Boolean(configuration.ssl.caFile),
    },
  });
}

module.exports = Object.freeze({
  CONFIGURATION_STATES,
  DEFAULTS,
  SSL_MODES,
  PostgreSQLConfigurationError,
  deepFreeze,
  redactPostgreSQLConfiguration,
  resolvePostgreSQLConfiguration,
});

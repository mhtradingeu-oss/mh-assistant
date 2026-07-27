'use strict';

const {
  PostgreSQLConfigurationError,
  deepFreeze,
} = require('./postgresql-config');

const {
  buildPostgreSQLSslPolicyDescriptor,
} = require('./postgresql-ssl-options');

function buildPostgreSQLPoolConfigurationDescriptor(configuration) {
  if (!configuration || configuration.enabled !== true) {
    throw new PostgreSQLConfigurationError(
      'DATABASE_AUTHORITY_DISABLED',
      null,
      'PostgreSQL authority is disabled',
    );
  }

  if (
    !configuration.connection
    || !configuration.pool
    || !configuration.ssl
  ) {
    throw new PostgreSQLConfigurationError(
      'DATABASE_CONFIGURATION_INVALID',
      null,
      'PostgreSQL configuration is incomplete',
    );
  }

  return deepFreeze({
    descriptorType: 'postgresql-pool-configuration',
    runtimePoolOptions: false,
    runtimeMaterialized: false,
    connection: {
      host: configuration.connection.host,
      port: configuration.connection.port,
      database: configuration.connection.database,
      user: configuration.connection.user,
      password: configuration.connection.password,
      applicationName: configuration.connection.applicationName,
    },
    limits: {
      max: configuration.pool.max,
      idleTimeoutMs: configuration.pool.idleTimeoutMs,
      connectTimeoutMs: configuration.pool.connectTimeoutMs,
      statementTimeoutMs: configuration.pool.statementTimeoutMs,
    },
    sslPolicy: buildPostgreSQLSslPolicyDescriptor(configuration),
  });
}

module.exports = Object.freeze({
  buildPostgreSQLPoolConfigurationDescriptor,
});

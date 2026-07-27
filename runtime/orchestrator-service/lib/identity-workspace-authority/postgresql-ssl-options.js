'use strict';

const {
  PostgreSQLConfigurationError,
  deepFreeze,
} = require('./postgresql-config');

function buildPostgreSQLSslPolicyDescriptor(configuration) {
  if (!configuration || configuration.enabled !== true) {
    return null;
  }

  if (!configuration.ssl || typeof configuration.ssl.mode !== 'string') {
    throw new PostgreSQLConfigurationError(
      'DATABASE_CONFIGURATION_INVALID',
      'ssl',
      'PostgreSQL SSL configuration is missing',
    );
  }

  if (configuration.ssl.mode === 'disable') {
    return deepFreeze({
      descriptorType: 'postgresql-ssl-policy',
      mode: 'disable',
      tlsEnabled: false,
      runtimeMaterialized: false,
      rejectUnauthorized: null,
      caFile: null,
      certificateVerification: 'NONE',
    });
  }

  if (configuration.ssl.mode === 'require') {
    return deepFreeze({
      descriptorType: 'postgresql-ssl-policy',
      mode: 'require',
      tlsEnabled: true,
      runtimeMaterialized: false,
      rejectUnauthorized: true,
      caFile: null,
      certificateVerification: 'SYSTEM_TRUST',
    });
  }

  if (
    configuration.ssl.mode === 'verify-ca'
    || configuration.ssl.mode === 'verify-full'
  ) {
    if (!configuration.ssl.caFile) {
      throw new PostgreSQLConfigurationError(
        'DATABASE_CONFIGURATION_INVALID',
        'MH_IDENTITY_DB_SSL_CA_FILE',
        'Certificate verification requires an approved CA file',
      );
    }

    return deepFreeze({
      descriptorType: 'postgresql-ssl-policy',
      mode: configuration.ssl.mode,
      tlsEnabled: true,
      runtimeMaterialized: false,
      rejectUnauthorized: true,
      caFile: configuration.ssl.caFile,
      certificateVerification:
        configuration.ssl.mode === 'verify-full'
          ? 'CA_AND_HOSTNAME'
          : 'CA',
    });
  }

  throw new PostgreSQLConfigurationError(
    'DATABASE_CONFIGURATION_INVALID',
    'MH_IDENTITY_DB_SSL_MODE',
    'Unsupported PostgreSQL SSL mode',
  );
}

module.exports = Object.freeze({
  buildPostgreSQLSslPolicyDescriptor,
});

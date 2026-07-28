'use strict';

class PostgreSQLRuntimeSslError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'PostgreSQLRuntimeSslError';
    this.code = code;
  }
}

function freeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) {
    return value;
  }

  for (const child of Object.values(value)) {
    freeze(child);
  }

  return Object.freeze(value);
}

function validatePolicy(policy) {
  if (
    !policy
    || policy.descriptorType !== 'postgresql-ssl-policy'
    || policy.runtimeMaterialized !== false
    || typeof policy.mode !== 'string'
  ) {
    throw new PostgreSQLRuntimeSslError(
      'DATABASE_SSL_POLICY_INVALID',
      'PostgreSQL SSL policy descriptor is invalid',
    );
  }

  return policy;
}

function validateCaMaterial(material) {
  if (
    !material
    || material.descriptorType !== 'postgresql-ca-material'
    || material.materialized !== true
    || material.sslMode !== 'verify-full'
    || typeof material.certificateMaterial !== 'string'
    || material.certificateMaterial.trim() === ''
    || material.filesystemRead !== true
    || material.databaseContacted !== false
    || material.runtimeSslCreated !== false
  ) {
    throw new PostgreSQLRuntimeSslError(
      'DATABASE_SSL_CA_MATERIAL_INVALID',
      'PostgreSQL CA material descriptor is invalid',
    );
  }

  return material;
}

function createPostgreSQLRuntimeSslOptions(policyInput, options = {}) {
  const policy = validatePolicy(policyInput);

  if (policy.mode === 'disable') {
    return false;
  }

  if (policy.mode === 'verify-ca') {
    throw new PostgreSQLRuntimeSslError(
      'DATABASE_SSL_MODE_UNSUPPORTED',
      'PostgreSQL verify-ca mode is not authorized',
    );
  }

  if (policy.mode === 'require') {
    if (policy.caFile !== null && policy.caFile !== undefined) {
      throw new PostgreSQLRuntimeSslError(
        'DATABASE_SSL_POLICY_INVALID',
        'PostgreSQL require mode must use system trust',
      );
    }

    return freeze({
      rejectUnauthorized: true,
    });
  }

  if (policy.mode === 'verify-full') {
    const material = validateCaMaterial(options.caMaterial);

    return freeze({
      rejectUnauthorized: true,
      ca: material.certificateMaterial,
    });
  }

  throw new PostgreSQLRuntimeSslError(
    'DATABASE_SSL_MODE_UNSUPPORTED',
    'PostgreSQL SSL mode is unsupported',
  );
}

function redactPostgreSQLRuntimeSslOptions(runtimeOptions) {
  if (runtimeOptions === false) {
    return freeze({
      runtimeSslCreated: true,
      tlsEnabled: false,
      rejectUnauthorized: false,
      customCaConfigured: false,
    });
  }

  if (
    !runtimeOptions
    || typeof runtimeOptions !== 'object'
    || runtimeOptions.rejectUnauthorized !== true
  ) {
    throw new PostgreSQLRuntimeSslError(
      'DATABASE_SSL_RUNTIME_OPTIONS_INVALID',
      'PostgreSQL runtime SSL options are invalid',
    );
  }

  return freeze({
    runtimeSslCreated: true,
    tlsEnabled: true,
    rejectUnauthorized: true,
    customCaConfigured:
      typeof runtimeOptions.ca === 'string'
      && runtimeOptions.ca.trim() !== '',
  });
}

module.exports = Object.freeze({
  PostgreSQLRuntimeSslError,
  createPostgreSQLRuntimeSslOptions,
  redactPostgreSQLRuntimeSslOptions,
});

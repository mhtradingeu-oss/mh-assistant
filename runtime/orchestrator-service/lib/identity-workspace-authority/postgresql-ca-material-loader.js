'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const DEFAULT_MAX_CERTIFICATE_BYTES = 262144;

const CA_REQUIRED_MODES = Object.freeze([
  'verify-ca',
  'verify-full',
]);

class PostgreSQLCaMaterialError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'PostgreSQLCaMaterialError';
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

function createDefaultDependencies() {
  return Object.freeze({
    isAbsolute: path.isAbsolute,
    normalize: path.normalize,
    resolve: path.resolve,
    relative: path.relative,
    basename: path.basename,
    lstat: fs.lstatSync,
    stat: fs.statSync,
    realpath: fs.realpathSync,
    readUtf8(filePath) {
      return fs.readFileSync(filePath, 'utf8');
    },
    sha256(content) {
      return crypto
        .createHash('sha256')
        .update(content, 'utf8')
        .digest('hex');
    },
  });
}

function requireFunction(dependencies, name) {
  if (!dependencies || typeof dependencies[name] !== 'function') {
    throw new PostgreSQLCaMaterialError(
      'DATABASE_CA_DEPENDENCY_INVALID',
      `CA loader dependency ${name} is invalid`,
    );
  }

  return dependencies[name];
}

function validateDependencies(dependencies) {
  const names = [
    'isAbsolute',
    'normalize',
    'resolve',
    'relative',
    'basename',
    'lstat',
    'stat',
    'realpath',
    'readUtf8',
    'sha256',
  ];

  for (const name of names) {
    requireFunction(dependencies, name);
  }

  return dependencies;
}

function validatePositiveInteger(value, code, message) {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new PostgreSQLCaMaterialError(code, message);
  }

  return value;
}

function isContained(relativePath, isAbsolute) {
  if (relativePath === '') {
    return true;
  }

  if (isAbsolute(relativePath)) {
    return false;
  }

  return relativePath !== '..'
    && !relativePath.startsWith(`..${path.sep}`)
    && !relativePath.startsWith('../')
    && !relativePath.startsWith('..\\');
}

function noMaterialRequired(policy) {
  return deepFreeze({
    descriptorType: 'postgresql-ca-material',
    materialized: false,
    sslMode: policy.mode,
    sourceIdentifier: null,
    byteLength: 0,
    sha256: null,
    certificateMaterial: null,
    filesystemRead: false,
    databaseContacted: false,
    runtimeSslCreated: false,
  });
}

function validatePolicy(policy) {
  if (
    !policy
    || policy.descriptorType !== 'postgresql-ssl-policy'
    || policy.runtimeMaterialized !== false
    || typeof policy.mode !== 'string'
  ) {
    throw new PostgreSQLCaMaterialError(
      'DATABASE_CA_POLICY_INVALID',
      'PostgreSQL SSL policy descriptor is invalid',
    );
  }

  return policy;
}

function createPostgreSQLCaMaterialLoader(options = {}) {
  const dependencies = validateDependencies(
    options.dependencies || createDefaultDependencies(),
  );

  const maxBytes = validatePositiveInteger(
    options.maxBytes === undefined
      ? DEFAULT_MAX_CERTIFICATE_BYTES
      : options.maxBytes,
    'DATABASE_CA_DEPENDENCY_INVALID',
    'Maximum CA certificate size is invalid',
  );

  function load(policyInput, request = {}) {
    const policy = validatePolicy(policyInput);

    if (!CA_REQUIRED_MODES.includes(policy.mode)) {
      return noMaterialRequired(policy);
    }

    if (typeof policy.caFile !== 'string' || policy.caFile.trim() === '') {
      throw new PostgreSQLCaMaterialError(
        'DATABASE_CA_PATH_REQUIRED',
        'A CA certificate path is required',
      );
    }

    if (
      typeof request.approvedRoot !== 'string'
      || request.approvedRoot.trim() === ''
      || !dependencies.isAbsolute(request.approvedRoot)
    ) {
      throw new PostgreSQLCaMaterialError(
        'DATABASE_CA_ROOT_INVALID',
        'The approved CA root is invalid',
      );
    }

    if (!dependencies.isAbsolute(policy.caFile)) {
      throw new PostgreSQLCaMaterialError(
        'DATABASE_CA_PATH_NOT_ABSOLUTE',
        'The CA certificate path must be absolute',
      );
    }

    const approvedRoot = dependencies.normalize(
      dependencies.resolve(request.approvedRoot),
    );

    const candidatePath = dependencies.normalize(
      dependencies.resolve(policy.caFile),
    );

    let rootMetadata;

    try {
      rootMetadata = dependencies.stat(approvedRoot);
    } catch {
      throw new PostgreSQLCaMaterialError(
        'DATABASE_CA_ROOT_INVALID',
        'The approved CA root is unavailable',
      );
    }

    if (!rootMetadata || typeof rootMetadata.isDirectory !== 'function'
      || !rootMetadata.isDirectory()) {
      throw new PostgreSQLCaMaterialError(
        'DATABASE_CA_ROOT_INVALID',
        'The approved CA root is not a directory',
      );
    }

    const lexicalRelative = dependencies.relative(
      approvedRoot,
      candidatePath,
    );

    if (!isContained(lexicalRelative, dependencies.isAbsolute)) {
      throw new PostgreSQLCaMaterialError(
        'DATABASE_CA_PATH_OUTSIDE_APPROVED_ROOT',
        'The CA certificate path is outside the approved root',
      );
    }

    let candidateMetadata;

    try {
      candidateMetadata = dependencies.lstat(candidatePath);
    } catch (error) {
      if (error && error.code === 'ENOENT') {
        throw new PostgreSQLCaMaterialError(
          'DATABASE_CA_FILE_NOT_FOUND',
          'The CA certificate file was not found',
        );
      }

      throw new PostgreSQLCaMaterialError(
        'DATABASE_CA_READ_FAILED',
        'The CA certificate metadata could not be read',
      );
    }

    if (
      candidateMetadata
      && typeof candidateMetadata.isSymbolicLink === 'function'
      && candidateMetadata.isSymbolicLink()
    ) {
      throw new PostgreSQLCaMaterialError(
        'DATABASE_CA_PATH_SYMLINK_REJECTED',
        'Symbolic links are not allowed for CA certificate files',
      );
    }

    if (
      !candidateMetadata
      || typeof candidateMetadata.isFile !== 'function'
      || !candidateMetadata.isFile()
    ) {
      throw new PostgreSQLCaMaterialError(
        'DATABASE_CA_FILE_NOT_REGULAR',
        'The CA certificate path is not a regular file',
      );
    }

    if (
      !Number.isSafeInteger(candidateMetadata.size)
      || candidateMetadata.size < 0
    ) {
      throw new PostgreSQLCaMaterialError(
        'DATABASE_CA_READ_FAILED',
        'The CA certificate size is invalid',
      );
    }

    if (candidateMetadata.size > maxBytes) {
      throw new PostgreSQLCaMaterialError(
        'DATABASE_CA_FILE_TOO_LARGE',
        'The CA certificate file exceeds the approved size',
      );
    }

    let realApprovedRoot;
    let realCandidate;

    try {
      realApprovedRoot = dependencies.normalize(
        dependencies.realpath(approvedRoot),
      );

      realCandidate = dependencies.normalize(
        dependencies.realpath(candidatePath),
      );
    } catch {
      throw new PostgreSQLCaMaterialError(
        'DATABASE_CA_READ_FAILED',
        'The CA certificate real path could not be resolved',
      );
    }

    const realRelative = dependencies.relative(
      realApprovedRoot,
      realCandidate,
    );

    if (!isContained(realRelative, dependencies.isAbsolute)) {
      throw new PostgreSQLCaMaterialError(
        'DATABASE_CA_PATH_OUTSIDE_APPROVED_ROOT',
        'The CA certificate real path is outside the approved root',
      );
    }

    let certificateMaterial;

    try {
      certificateMaterial = dependencies.readUtf8(realCandidate);
    } catch {
      throw new PostgreSQLCaMaterialError(
        'DATABASE_CA_READ_FAILED',
        'The CA certificate file could not be read',
      );
    }

    if (typeof certificateMaterial !== 'string') {
      throw new PostgreSQLCaMaterialError(
        'DATABASE_CA_READ_FAILED',
        'The CA certificate reader returned an invalid value',
      );
    }

    const byteLength = Buffer.byteLength(
      certificateMaterial,
      'utf8',
    );

    if (byteLength > maxBytes) {
      throw new PostgreSQLCaMaterialError(
        'DATABASE_CA_FILE_TOO_LARGE',
        'The CA certificate content exceeds the approved size',
      );
    }

    if (certificateMaterial.trim() === '') {
      throw new PostgreSQLCaMaterialError(
        'DATABASE_CA_FILE_EMPTY',
        'The CA certificate file is empty',
      );
    }

    if (
      !certificateMaterial.includes('-----BEGIN CERTIFICATE-----')
      || !certificateMaterial.includes('-----END CERTIFICATE-----')
    ) {
      throw new PostgreSQLCaMaterialError(
        'DATABASE_CA_CONTENT_INVALID',
        'The CA certificate content is not a supported PEM certificate',
      );
    }

    const digest = dependencies.sha256(certificateMaterial);

    if (typeof digest !== 'string' || !/^[a-f0-9]{64}$/i.test(digest)) {
      throw new PostgreSQLCaMaterialError(
        'DATABASE_CA_DEPENDENCY_INVALID',
        'The CA certificate digest is invalid',
      );
    }

    return deepFreeze({
      descriptorType: 'postgresql-ca-material',
      materialized: true,
      sslMode: policy.mode,
      sourceIdentifier: dependencies.basename(realCandidate),
      byteLength,
      sha256: digest.toLowerCase(),
      certificateMaterial,
      filesystemRead: true,
      databaseContacted: false,
      runtimeSslCreated: false,
    });
  }

  return deepFreeze({
    loaderType: 'postgresql-ca-material-loader',
    loaderVersion: 1,
    maxBytes,
    load,
  });
}

function redactPostgreSQLCaMaterial(material) {
  if (!material || material.descriptorType !== 'postgresql-ca-material') {
    throw new PostgreSQLCaMaterialError(
      'DATABASE_CA_POLICY_INVALID',
      'PostgreSQL CA material descriptor is invalid',
    );
  }

  return deepFreeze({
    descriptorType: material.descriptorType,
    materialized: material.materialized === true,
    sslMode: material.sslMode || null,
    sourceIdentifier: material.sourceIdentifier || null,
    byteLength: Number.isSafeInteger(material.byteLength)
      ? material.byteLength
      : 0,
    sha256: material.sha256 || null,
    filesystemRead: material.filesystemRead === true,
    databaseContacted: false,
    runtimeSslCreated: false,
  });
}

module.exports = Object.freeze({
  CA_REQUIRED_MODES,
  DEFAULT_MAX_CERTIFICATE_BYTES,
  PostgreSQLCaMaterialError,
  createDefaultDependencies,
  createPostgreSQLCaMaterialLoader,
  redactPostgreSQLCaMaterial,
});

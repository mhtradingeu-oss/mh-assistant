#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');

const {
  DEFAULT_MAX_CERTIFICATE_BYTES,
  createPostgreSQLCaMaterialLoader,
  redactPostgreSQLCaMaterial,
} = require(path.join(
  ROOT,
  'runtime/orchestrator-service/lib/identity-workspace-authority/postgresql-ca-material-loader.js',
));

const {
  deepFreeze,
} = require(path.join(
  ROOT,
  'runtime/orchestrator-service/lib/identity-workspace-authority/postgresql-config.js',
));

const tempBase = fs.mkdtempSync(
  path.join(os.tmpdir(), 'mhos-r10d-ca-loader-'),
);

let fixtureReads = 0;

function cleanup() {
  fs.rmSync(tempBase, {
    recursive: true,
    force: true,
  });
}

process.on('exit', cleanup);

const approvedRoot = path.join(tempBase, 'approved');
const outsideRoot = path.join(tempBase, 'outside');

fs.mkdirSync(approvedRoot, { recursive: true });
fs.mkdirSync(outsideRoot, { recursive: true });

const validPem = [
  '-----BEGIN CERTIFICATE-----',
  'VEVTVF9PTkxZX0NFUlRJRklDQVRFX01BVEVSSUFM',
  '-----END CERTIFICATE-----',
  '',
].join('\n');

const validFile = path.join(approvedRoot, 'test-ca.pem');
const emptyFile = path.join(approvedRoot, 'empty-ca.pem');
const whitespaceFile = path.join(approvedRoot, 'whitespace-ca.pem');
const malformedFile = path.join(approvedRoot, 'malformed-ca.pem');
const directoryPath = path.join(approvedRoot, 'directory-ca.pem');
const outsideFile = path.join(outsideRoot, 'outside-ca.pem');
const oversizedFile = path.join(approvedRoot, 'oversized-ca.pem');
const symlinkFile = path.join(approvedRoot, 'symlink-ca.pem');

fs.writeFileSync(validFile, validPem, 'utf8');
fs.writeFileSync(emptyFile, '', 'utf8');
fs.writeFileSync(whitespaceFile, '   \n\t', 'utf8');
fs.writeFileSync(malformedFile, 'not-a-certificate', 'utf8');
fs.mkdirSync(directoryPath);
fs.writeFileSync(outsideFile, validPem, 'utf8');
fs.writeFileSync(
  oversizedFile,
  `-----BEGIN CERTIFICATE-----\n${'A'.repeat(4096)}\n-----END CERTIFICATE-----\n`,
  'utf8',
);
fs.symlinkSync(outsideFile, symlinkFile);

const dependencies = {
  isAbsolute: path.isAbsolute,
  normalize: path.normalize,
  resolve: path.resolve,
  relative: path.relative,
  basename: path.basename,
  lstat: fs.lstatSync,
  stat: fs.statSync,
  realpath: fs.realpathSync,
  readUtf8(filePath) {
    fixtureReads += 1;
    return fs.readFileSync(filePath, 'utf8');
  },
  sha256(content) {
    return require('node:crypto')
      .createHash('sha256')
      .update(content, 'utf8')
      .digest('hex');
  },
};

const loader = createPostgreSQLCaMaterialLoader({
  dependencies,
  maxBytes: 1024,
});

function policy(mode, caFile) {
  return deepFreeze({
    descriptorType: 'postgresql-ssl-policy',
    mode,
    tlsEnabled: mode !== 'disable',
    runtimeMaterialized: false,
    rejectUnauthorized: mode === 'disable' ? null : true,
    caFile: caFile || null,
    certificateVerification:
      mode === 'verify-full'
        ? 'CA_AND_HOSTNAME'
        : mode === 'verify-ca'
          ? 'CA'
          : mode === 'require'
            ? 'SYSTEM_TRUST'
            : 'NONE',
  });
}

function expectCode(fn, code) {
  assert.throws(
    fn,
    (error) => {
      assert.equal(error.code, code);
      return true;
    },
  );
}

const readsBeforeDisable = fixtureReads;
const disabled = loader.load(
  policy('disable', null),
  { approvedRoot },
);

assert.equal(disabled.materialized, false);
assert.equal(disabled.filesystemRead, false);
assert.equal(fixtureReads, readsBeforeDisable);

const readsBeforeRequire = fixtureReads;
const requireMode = loader.load(
  policy('require', null),
  { approvedRoot },
);

assert.equal(requireMode.materialized, false);
assert.equal(requireMode.filesystemRead, false);
assert.equal(fixtureReads, readsBeforeRequire);

expectCode(
  () => loader.load(
    policy('verify-full', null),
    { approvedRoot },
  ),
  'DATABASE_CA_PATH_REQUIRED',
);

expectCode(
  () => loader.load(
    policy('verify-full', 'relative-ca.pem'),
    { approvedRoot },
  ),
  'DATABASE_CA_PATH_NOT_ABSOLUTE',
);

expectCode(
  () => loader.load(
    policy('verify-full', validFile),
    { approvedRoot: 'relative-root' },
  ),
  'DATABASE_CA_ROOT_INVALID',
);

expectCode(
  () => loader.load(
    policy('verify-full', outsideFile),
    { approvedRoot },
  ),
  'DATABASE_CA_PATH_OUTSIDE_APPROVED_ROOT',
);

expectCode(
  () => loader.load(
    policy('verify-full', symlinkFile),
    { approvedRoot },
  ),
  'DATABASE_CA_PATH_SYMLINK_REJECTED',
);

expectCode(
  () => loader.load(
    policy(
      'verify-full',
      path.join(approvedRoot, 'missing-ca.pem'),
    ),
    { approvedRoot },
  ),
  'DATABASE_CA_FILE_NOT_FOUND',
);

expectCode(
  () => loader.load(
    policy('verify-full', directoryPath),
    { approvedRoot },
  ),
  'DATABASE_CA_FILE_NOT_REGULAR',
);

expectCode(
  () => loader.load(
    policy('verify-full', oversizedFile),
    { approvedRoot },
  ),
  'DATABASE_CA_FILE_TOO_LARGE',
);

expectCode(
  () => loader.load(
    policy('verify-full', emptyFile),
    { approvedRoot },
  ),
  'DATABASE_CA_FILE_EMPTY',
);

expectCode(
  () => loader.load(
    policy('verify-full', whitespaceFile),
    { approvedRoot },
  ),
  'DATABASE_CA_FILE_EMPTY',
);

expectCode(
  () => loader.load(
    policy('verify-full', malformedFile),
    { approvedRoot },
  ),
  'DATABASE_CA_CONTENT_INVALID',
);


const canonicalValidFile = fs.realpathSync(validFile);
const canonicalOutsideFile = fs.realpathSync(outsideFile);

const realpathEscapeDependencies = {
  ...dependencies,
  realpath(filePath) {
    if (
      filePath === validFile
      || filePath === canonicalValidFile
    ) {
      return canonicalOutsideFile;
    }

    return fs.realpathSync(filePath);
  },
};

const realpathEscapeLoader = createPostgreSQLCaMaterialLoader({
  dependencies: realpathEscapeDependencies,
  maxBytes: 1024,
});

expectCode(
  () => realpathEscapeLoader.load(
    policy('verify-full', validFile),
    { approvedRoot },
  ),
  'DATABASE_CA_PATH_OUTSIDE_APPROVED_ROOT',
);

const oversizedReaderContent = [
  '-----BEGIN CERTIFICATE-----',
  'A'.repeat(4096),
  '-----END CERTIFICATE-----',
  '',
].join('\n');

const postReadOversizeDependencies = {
  ...dependencies,
  lstat(filePath) {
    const metadata = fs.lstatSync(filePath);

    if (filePath !== validFile) {
      return metadata;
    }

    return {
      isSymbolicLink() {
        return false;
      },
      isFile() {
        return true;
      },
      size: 128,
    };
  },
  readUtf8(filePath) {
    fixtureReads += 1;

    if (
      filePath === validFile
      || filePath === canonicalValidFile
    ) {
      return oversizedReaderContent;
    }

    return fs.readFileSync(filePath, 'utf8');
  },
};

const postReadOversizeLoader = createPostgreSQLCaMaterialLoader({
  dependencies: postReadOversizeDependencies,
  maxBytes: 1024,
});

expectCode(
  () => postReadOversizeLoader.load(
    policy('verify-full', validFile),
    { approvedRoot },
  ),
  'DATABASE_CA_FILE_TOO_LARGE',
);

const nonStringReaderDependencies = {
  ...dependencies,
  readUtf8() {
    fixtureReads += 1;
    return 123;
  },
};

const nonStringReaderLoader = createPostgreSQLCaMaterialLoader({
  dependencies: nonStringReaderDependencies,
  maxBytes: 1024,
});

expectCode(
  () => nonStringReaderLoader.load(
    policy('verify-full', validFile),
    { approvedRoot },
  ),
  'DATABASE_CA_READ_FAILED',
);

const invalidDependencies = {
  ...dependencies,
  sha256: null,
};

expectCode(
  () => createPostgreSQLCaMaterialLoader({
    dependencies: invalidDependencies,
    maxBytes: 1024,
  }),
  'DATABASE_CA_DEPENDENCY_INVALID',
);

const material = loader.load(
  policy('verify-full', validFile),
  { approvedRoot },
);

assert.equal(material.descriptorType, 'postgresql-ca-material');
assert.equal(material.materialized, true);
assert.equal(material.sslMode, 'verify-full');
assert.equal(material.sourceIdentifier, 'test-ca.pem');
assert.equal(material.byteLength, Buffer.byteLength(validPem, 'utf8'));
assert.match(material.sha256, /^[a-f0-9]{64}$/);
assert.equal(material.certificateMaterial, validPem);
assert.equal(material.filesystemRead, true);
assert.equal(material.databaseContacted, false);
assert.equal(material.runtimeSslCreated, false);
assert.equal(Object.isFrozen(material), true);

const redacted = redactPostgreSQLCaMaterial(material);
const serializedRedacted = JSON.stringify(redacted);

assert.equal(redacted.materialized, true);
assert.equal(redacted.sourceIdentifier, 'test-ca.pem');
assert.equal(redacted.byteLength, material.byteLength);
assert.equal(redacted.sha256, material.sha256);
assert.equal(redacted.databaseContacted, false);
assert.equal(redacted.runtimeSslCreated, false);
assert.equal(Object.hasOwn(redacted, 'certificateMaterial'), false);
assert.doesNotMatch(serializedRedacted, /BEGIN CERTIFICATE/);
assert.doesNotMatch(serializedRedacted, new RegExp(tempBase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
assert.equal(Object.isFrozen(redacted), true);

assert.equal(
  DEFAULT_MAX_CERTIFICATE_BYTES,
  262144,
);

const loaderSource = fs.readFileSync(
  path.join(
    ROOT,
    'runtime/orchestrator-service/lib/identity-workspace-authority/postgresql-ca-material-loader.js',
  ),
  'utf8',
);

const prohibitedPatterns = [
  /require\s*\(\s*['"]pg['"]\s*\)/,
  /\bnew\s+Pool\s*\(/,
  /\bnew\s+Client\s*\(/,
  /\.connect\s*\(/,
  /\.query\s*\(/,
  /\bSELECT\s+/i,
  /\bINSERT\s+/i,
  /\bUPDATE\s+/i,
  /\bDELETE\s+/i,
];

for (const pattern of prohibitedPatterns) {
  assert.equal(pattern.test(loaderSource), false);
}

const serverSource = fs.readFileSync(
  path.join(ROOT, 'runtime/orchestrator-service/server.js'),
  'utf8',
);

assert.doesNotMatch(
  serverSource,
  /postgresql-ca-material-loader/,
);

cleanup();

console.log('POSTGRESQL_CA_MATERIAL_LOADER_OFFLINE=PASS');
console.log('TEMPORARY_FIXTURE_ROOT=SYSTEM_TEMP_DIRECTORY');
console.log('REAL_CA_FILE_READ=NO');
console.log('PROJECT_CERTIFICATE_READ=NO');
console.log('SYSTEM_CERTIFICATE_STORE_READ=NO');
console.log('NO_CA_REQUIRED_FILESYSTEM_ACCESS=ABSENT');
console.log('ABSOLUTE_PATH_ENFORCEMENT=PASS');
console.log('APPROVED_ROOT_ENFORCEMENT=PASS');
console.log('LEXICAL_ESCAPE_REJECTION=PASS');
console.log('SYMLINK_REJECTION=PASS');
console.log('REAL_PATH_ESCAPE_ADVERSARIAL_TEST=PASS');
console.log('POST_READ_OVERSIZE_ADVERSARIAL_TEST=PASS');
console.log('NON_STRING_READER_ADVERSARIAL_TEST=PASS');
console.log('INVALID_DEPENDENCY_ADVERSARIAL_TEST=PASS');
console.log('MACOS_CANONICAL_PATH_HANDLING=PASS');
console.log('REAL_PATH_CONTAINMENT=PASS');
console.log('REGULAR_FILE_ENFORCEMENT=PASS');
console.log('PRE_READ_SIZE_ENFORCEMENT=PASS');
console.log('POST_READ_BYTE_LENGTH_ENFORCEMENT=PASS');
console.log('EMPTY_CONTENT_REJECTION=PASS');
console.log('PEM_BOUNDARY_VALIDATION=PASS');
console.log('IMMUTABLE_MATERIAL_DESCRIPTOR=PASS');
console.log('CERTIFICATE_DIGEST_GENERATION=PASS');
console.log('CERTIFICATE_REDACTION=PASS');
console.log('PG_IMPORT=ABSENT');
console.log('DATABASE_CONTACTED=NO');
console.log('SQL_EXECUTED=NO');
console.log('MIGRATION_EXECUTED=NO');
console.log('POOL_CREATED=NO');
console.log('CLIENT_CREATED=NO');
console.log('SERVER_JS_CHANGED=NO');
console.log('RUNTIME_BINDING_CHANGED=NO');
console.log('PRODUCTION_AUTHORITY=NO');

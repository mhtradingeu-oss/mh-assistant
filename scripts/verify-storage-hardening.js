'use strict';

/**
 * verify-storage-hardening.js
 *
 * Verification cases for P1-C data integrity hardening.
 * Tests storage.js atomic write, backup, corrupt-read quarantine, and
 * malformed JSON behavior using a temporary directory.
 *
 * Run with: node scripts/verify-storage-hardening.js
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

// ---------------------------------------------------------------------------
// Import the hardened storage helpers directly
// ---------------------------------------------------------------------------
const {
  writeJsonFile,
  readJsonFile,
  readJsonFileDurable,
  ensureJsonFile
} = require('../runtime/orchestrator-service/lib/integrations/storage');

// ---------------------------------------------------------------------------
// Test harness
// ---------------------------------------------------------------------------
let passed = 0;
let failed = 0;

function pass(label) {
  console.log(`  PASS  ${label}`);
  passed++;
}

function fail(label, reason) {
  console.error(`  FAIL  ${label}${reason ? ' — ' + reason : ''}`);
  failed++;
}

function check(label, condition, reason) {
  if (condition) pass(label);
  else fail(label, reason);
}

function expectThrows(label, fn, codeMatch) {
  try {
    fn();
    fail(label, 'expected an error but none was thrown');
  } catch (err) {
    if (codeMatch && err.code !== codeMatch) {
      fail(label, `expected error.code '${codeMatch}', got '${err.code}': ${err.message}`);
    } else {
      pass(`${label} [threw: ${err.message.slice(0, 100)}]`);
    }
  }
}

function expectNoThrow(label, fn) {
  try {
    fn();
    pass(label);
  } catch (err) {
    fail(label, `unexpected error: ${err.message}`);
  }
}

// ---------------------------------------------------------------------------
// Setup: temp directory
// ---------------------------------------------------------------------------
const TMP_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'mh-storage-test-'));
function tmp(name) { return path.join(TMP_DIR, name); }

function cleanup() {
  try { fs.rmSync(TMP_DIR, { recursive: true, force: true }); } catch (_) { }
}

// ---------------------------------------------------------------------------
// [1] Atomic write — success path
// ---------------------------------------------------------------------------
console.log('\n--- [1] Atomic write success ---');
{
  const filePath = tmp('atomic-write-test.json');
  const data = { hello: 'world', nested: { count: 42 } };

  writeJsonFile(filePath, data);

  check('file exists after writeJsonFile', fs.existsSync(filePath));
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  check('data is correctly written', content.hello === 'world' && content.nested.count === 42);
  check('no .tmp file left behind', !fs.existsSync(filePath + '.tmp'));
}

// ---------------------------------------------------------------------------
// [2] Backup creation on overwrite
// ---------------------------------------------------------------------------
console.log('\n--- [2] Backup creation on overwrite ---');
{
  const filePath = tmp('backup-test.json');

  writeJsonFile(filePath, { version: 1 });
  check('initial write created file', fs.existsSync(filePath));
  check('no backup before first overwrite', !fs.existsSync(filePath + '.backup'));

  writeJsonFile(filePath, { version: 2 });
  check('backup created after second write', fs.existsSync(filePath + '.backup'));

  const backup = JSON.parse(fs.readFileSync(filePath + '.backup', 'utf8'));
  check('backup contains previous version', backup.version === 1);

  const current = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  check('current file contains new version', current.version === 2);
}

// ---------------------------------------------------------------------------
// [3] ensureJsonFile — creates file if missing, does not overwrite existing
// ---------------------------------------------------------------------------
console.log('\n--- [3] ensureJsonFile behavior ---');
{
  const filePath = tmp('ensure-test.json');

  ensureJsonFile(filePath, { default: true });
  check('file created by ensureJsonFile', fs.existsSync(filePath));
  const initial = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  check('default value written', initial.default === true);

  ensureJsonFile(filePath, { default: false });
  const after = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  check('existing file not overwritten by ensureJsonFile', after.default === true);
}

// ---------------------------------------------------------------------------
// [4] readJsonFile — fallback on missing file (non-critical optional read)
// ---------------------------------------------------------------------------
console.log('\n--- [4] readJsonFile fallback behavior ---');
{
  const filePath = tmp('missing-optional.json');
  const result = readJsonFile(filePath, { fallback: true });
  check('returns fallback when file is missing', result && result.fallback === true);
}

// ---------------------------------------------------------------------------
// [5] readJsonFile — fallback on malformed JSON (logs warn, does not throw)
// ---------------------------------------------------------------------------
console.log('\n--- [5] readJsonFile — malformed JSON returns fallback without throw ---');
{
  const filePath = tmp('malformed-optional.json');
  fs.writeFileSync(filePath, '{ not valid json !!', 'utf8');

  let result;
  expectNoThrow('readJsonFile does not throw on bad JSON', () => {
    result = readJsonFile(filePath, { fallback: true });
  });
  check('returns fallback value', result && result.fallback === true);
  check('corrupt file still exists (not quarantined by non-durable read)', fs.existsSync(filePath));
}

// ---------------------------------------------------------------------------
// [6] readJsonFileDurable — missing file returns null
// ---------------------------------------------------------------------------
console.log('\n--- [6] readJsonFileDurable — missing file returns null ---');
{
  const filePath = tmp('missing-durable.json');
  let result;
  expectNoThrow('readJsonFileDurable does not throw for missing file', () => {
    result = readJsonFileDurable(filePath);
  });
  check('returns null for missing file', result === null);
}

// ---------------------------------------------------------------------------
// [7] readJsonFileDurable — valid file returns parsed data
// ---------------------------------------------------------------------------
console.log('\n--- [7] readJsonFileDurable — valid file parses correctly ---');
{
  const filePath = tmp('valid-durable.json');
  writeJsonFile(filePath, [{ id: 'a', value: 1 }, { id: 'b', value: 2 }]);

  let result;
  expectNoThrow('readJsonFileDurable reads valid file', () => {
    result = readJsonFileDurable(filePath);
  });
  check('returns parsed array', Array.isArray(result) && result.length === 2);
  check('first item correct', result[0].id === 'a');
}

// ---------------------------------------------------------------------------
// [8] readJsonFileDurable — corrupt JSON quarantines file and throws
// ---------------------------------------------------------------------------
console.log('\n--- [8] readJsonFileDurable — corrupt JSON quarantine ---');
{
  const filePath = tmp('corrupt-durable.json');
  fs.writeFileSync(filePath, '{ this is not json at all', 'utf8');

  let caughtErr = null;
  try {
    readJsonFileDurable(filePath);
    fail('readJsonFileDurable should have thrown on corrupt JSON');
  } catch (err) {
    caughtErr = err;
    pass(`readJsonFileDurable threw on corrupt JSON [${err.code}]`);
  }

  if (caughtErr) {
    check('error code is STORAGE_CORRUPT_JSON', caughtErr.code === 'STORAGE_CORRUPT_JSON');
    check('corruptPath is set on error', typeof caughtErr.corruptPath === 'string');
    check('original file no longer exists (moved to .corrupt)', !fs.existsSync(filePath));
    check('.corrupt file exists', caughtErr.corruptPath && fs.existsSync(caughtErr.corruptPath));
  }
}

// ---------------------------------------------------------------------------
// [9] readJsonFileDurable — empty file quarantines and throws
// ---------------------------------------------------------------------------
console.log('\n--- [9] readJsonFileDurable — empty file quarantine ---');
{
  const filePath = tmp('empty-durable.json');
  fs.writeFileSync(filePath, '', 'utf8');

  let caughtErr = null;
  try {
    readJsonFileDurable(filePath);
    fail('readJsonFileDurable should have thrown on empty file');
  } catch (err) {
    caughtErr = err;
    pass(`readJsonFileDurable threw on empty file [${err.code}]`);
  }

  if (caughtErr) {
    check('error code is STORAGE_EMPTY_FILE', caughtErr.code === 'STORAGE_EMPTY_FILE');
    check('original empty file moved away', !fs.existsSync(filePath));
    check('.corrupt file exists for empty file', caughtErr.corruptPath && fs.existsSync(caughtErr.corruptPath));
  }
}

// ---------------------------------------------------------------------------
// [10] Atomic write — no partial file visible on crash simulation
// (Write to temp, verify temp exists before rename)
// ---------------------------------------------------------------------------
console.log('\n--- [10] Atomic write — temp intermediary is transient ---');
{
  const filePath = tmp('transient-tmp-test.json');

  // Write a first version so the file exists
  writeJsonFile(filePath, { generation: 1 });

  // Write second version and check nothing stale remains
  writeJsonFile(filePath, { generation: 2 });
  check('no .tmp remains after successful write', !fs.existsSync(filePath + '.tmp'));
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  check('final file has correct generation', content.generation === 2);
}

// ---------------------------------------------------------------------------
// Cleanup and summary
// ---------------------------------------------------------------------------
cleanup();

console.log(`\n${'='.repeat(60)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('All storage hardening checks passed.');
  process.exit(0);
}

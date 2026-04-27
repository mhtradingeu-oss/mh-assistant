const fs = require('fs');
const path = require('path');

function ensureDir(dirPath) {
  if (!dirPath) {
    return;
  }

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function ensureJsonFile(filePath, defaultValue = {}) {
  ensureDir(path.dirname(filePath));

  if (!fs.existsSync(filePath)) {
    // Use atomic write even for initial creation so the file is never half-written
    writeJsonFile(filePath, defaultValue);
  }
}

/**
 * readJsonFile — safe read with silent fallback.
 * Suitable for optional/non-critical reads where missing or bad data should
 * not abort the caller. Logs a console.warn on parse failure so it is never
 * completely invisible.
 */
function readJsonFile(filePath, fallback = {}) {
  try {
    if (!fs.existsSync(filePath)) {
      return fallback;
    }

    const raw = fs.readFileSync(filePath, 'utf8').trim();
    if (!raw) {
      return fallback;
    }

    return JSON.parse(raw);
  } catch (err) {
    console.warn(`[storage] readJsonFile: non-fatal read/parse error for ${filePath}, returning fallback. Error: ${err.message}`);
    return fallback;
  }
}

/**
 * readJsonFileDurable — strict read for durable project state.
 *
 * - If the file does not exist: returns null (caller decides the default).
 * - If the file exists but is empty or unparseable: quarantines the file by
 *   renaming it to a timestamped .corrupt path and throws a structured error.
 *   The caller must handle the thrown error — it must NOT silently fall back.
 *
 * Use this for every read of critical ops state (collections, governance, team).
 */
function readJsonFileDurable(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  let raw;
  try {
    raw = fs.readFileSync(filePath, 'utf8').trim();
  } catch (err) {
    const error = Object.assign(
      new Error(`[storage] Failed to read durable file ${filePath}: ${err.message}`),
      { filePath, code: 'STORAGE_READ_ERROR' }
    );
    throw error;
  }

  if (!raw) {
    const corruptPath = `${filePath}.${Date.now()}.corrupt`;
    try { fs.renameSync(filePath, corruptPath); } catch (_) { /* best-effort */ }
    throw Object.assign(
      new Error(`[storage] Durable file is empty, quarantined to ${corruptPath}: ${filePath}`),
      { filePath, corruptPath, code: 'STORAGE_EMPTY_FILE' }
    );
  }

  try {
    return JSON.parse(raw);
  } catch (parseErr) {
    const corruptPath = `${filePath}.${Date.now()}.corrupt`;
    try { fs.renameSync(filePath, corruptPath); } catch (_) { /* best-effort */ }
    throw Object.assign(
      new Error(`[storage] Corrupt JSON quarantined to ${corruptPath} — ${parseErr.message}`),
      { filePath, corruptPath, code: 'STORAGE_CORRUPT_JSON' }
    );
  }
}

/**
 * writeJsonFile — atomic write with backup.
 *
 * Write sequence:
 *   1. Serialize to JSON string (fails fast on non-serializable data).
 *   2. Write to <filePath>.tmp.
 *   3. fsync the temp file to flush OS write buffers.
 *   4. Copy existing file to <filePath>.backup (best-effort, non-fatal).
 *   5. Rename temp to final path (atomic on POSIX).
 *
 * The .tmp file is always cleaned up on error so stale temps do not accumulate.
 */
function writeJsonFile(filePath, data) {
  ensureDir(path.dirname(filePath));

  const serialized = JSON.stringify(data, null, 2);
  const tmpPath = filePath + '.tmp';
  const backupPath = filePath + '.backup';

  // Step 1+2: write temp file
  fs.writeFileSync(tmpPath, serialized, 'utf8');

  // Step 3: fsync temp file
  let fd;
  try {
    fd = fs.openSync(tmpPath, 'r+');
    fs.fsyncSync(fd);
  } catch (_) {
    // fsync is best-effort — some filesystems (e.g. network mounts) may not support it
  } finally {
    if (fd !== undefined) {
      try { fs.closeSync(fd); } catch (_) { /* ignore */ }
    }
  }

  // Step 4: backup existing file before overwrite (best-effort)
  if (fs.existsSync(filePath)) {
    try {
      fs.copyFileSync(filePath, backupPath);
    } catch (_) { /* non-fatal */ }
  }

  // Step 5: atomic rename
  try {
    fs.renameSync(tmpPath, filePath);
  } catch (err) {
    // Clean up orphaned temp file and re-throw
    try { fs.unlinkSync(tmpPath); } catch (_) { /* ignore */ }
    throw Object.assign(
      new Error(`[storage] Atomic rename failed for ${filePath}: ${err.message}`),
      { filePath, tmpPath, code: 'STORAGE_RENAME_ERROR' }
    );
  }
}

function appendJsonArrayEntry(filePath, entry, maxItems = 250) {
  const existing = readJsonFile(filePath, []);
  const items = Array.isArray(existing) ? existing : [];
  items.unshift(entry);
  writeJsonFile(filePath, items.slice(0, maxItems));
}

module.exports = {
  ensureDir,
  ensureJsonFile,
  readJsonFile,
  readJsonFileDurable,
  writeJsonFile,
  appendJsonArrayEntry
};

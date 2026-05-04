const crypto = require('crypto');
const path = require('path');

const {
  ensureDir,
  readJsonFile,
  writeJsonFile
} = require('./storage');

const SYSTEM_DIR = path.join(process.env.MH_ASSISTANT_ROOT || path.resolve(__dirname, '../../../..'), 'data', 'system');
const KEY_PATH = path.join(SYSTEM_DIR, 'integration-secret.key.json');

/**
 * getOrCreateSecretKey — returns a 32-byte Buffer used as the AES-256-GCM key.
 *
 * Resolution order (first match wins):
 *   1. MH_INTEGRATION_SECRET_KEY env var (base64-encoded 32-byte key).
 *      This is the recommended production path — no key material on disk.
 *   2. data/system/integration-secret.key.json on the host filesystem.
 *      Legacy path: key was auto-generated and stored locally.
 *      This file must NOT be committed to the repo (.gitignore enforces this).
 *      If absent, a new key is auto-generated and written to this file.
 *
 * ⚠  If the env key and the file key differ, all credentials encrypted with
 *    the file key will fail to decrypt. Rotate the key only during a planned
 *    migration where credentials are re-entered.
 */
function getOrCreateSecretKey() {
  // 1. Prefer env-based key (production safe)
  const envKey = String(process.env.MH_INTEGRATION_SECRET_KEY || '').trim();
  if (envKey) {
    const keyBuf = Buffer.from(envKey, 'base64');
    if (keyBuf.length !== 32) {
      throw new Error(
        'MH_INTEGRATION_SECRET_KEY must be a base64-encoded 32-byte key. ' +
        `Got ${keyBuf.length} bytes after decoding.`
      );
    }
    return keyBuf;
  }

  // 2. Fall back to host file (dev / legacy path)
  ensureDir(SYSTEM_DIR);
  const existing = readJsonFile(KEY_PATH, {});
  if (existing?.key) {
    return Buffer.from(existing.key, 'base64');
  }

  // Auto-generate a new key and persist it to the host filesystem.
  // This file is gitignored — it must never be committed.
  const key = crypto.randomBytes(32);
  writeJsonFile(KEY_PATH, {
    version: 1,
    created_at: new Date().toISOString(),
    note: 'This file contains a secret encryption key. Never commit it to version control. Set MH_INTEGRATION_SECRET_KEY env var in production instead.',
    key: key.toString('base64')
  });

  return key;
}

function hasIntegrationSecretKeyConfigured() {
  const envKey = String(process.env.MH_INTEGRATION_SECRET_KEY || '').trim();
  if (envKey) {
    try {
      return Buffer.from(envKey, 'base64').length === 32;
    } catch (error) {
      return false;
    }
  }

  const existing = readJsonFile(KEY_PATH, {});
  if (!existing?.key) {
    return false;
  }

  try {
    return Buffer.from(existing.key, 'base64').length === 32;
  } catch (error) {
    return false;
  }
}

function encryptJson(value = {}) {
  const key = getOrCreateSecretKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const serialized = JSON.stringify(value || {});
  const encrypted = Buffer.concat([
    cipher.update(serialized, 'utf8'),
    cipher.final()
  ]);
  const tag = cipher.getAuthTag();

  return {
    version: 1,
    algorithm: 'aes-256-gcm',
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
    payload: encrypted.toString('base64')
  };
}

function decryptJson(encryptedValue) {
  if (!encryptedValue || typeof encryptedValue !== 'object') {
    return {};
  }

  try {
    const key = getOrCreateSecretKey();
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      key,
      Buffer.from(String(encryptedValue.iv || ''), 'base64')
    );
    decipher.setAuthTag(Buffer.from(String(encryptedValue.tag || ''), 'base64'));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(String(encryptedValue.payload || ''), 'base64')),
      decipher.final()
    ]).toString('utf8');

    return JSON.parse(decrypted);
  } catch {
    return {};
  }
}

function normalizeCredentials(record = {}) {
  if (record.credentials_encrypted) {
    return decryptJson(record.credentials_encrypted);
  }

  if (record.credentials && typeof record.credentials === 'object') {
    return record.credentials;
  }

  return {};
}

function applyEncryptedCredentials(record = {}, credentials = {}) {
  return {
    ...record,
    credentials: {},
    credentials_encrypted: encryptJson(credentials)
  };
}

module.exports = {
  normalizeCredentials,
  applyEncryptedCredentials,
  hasIntegrationSecretKeyConfigured
};

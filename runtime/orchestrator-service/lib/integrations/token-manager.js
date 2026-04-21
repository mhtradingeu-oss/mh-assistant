const crypto = require('crypto');
const path = require('path');

const {
  ensureDir,
  readJsonFile,
  writeJsonFile
} = require('./storage');

const SYSTEM_DIR = path.join('/opt/mh-assistant/data', 'system');
const KEY_PATH = path.join(SYSTEM_DIR, 'integration-secret.key.json');

function getOrCreateSecretKey() {
  ensureDir(SYSTEM_DIR);

  const existing = readJsonFile(KEY_PATH, {});
  if (existing?.key) {
    return Buffer.from(existing.key, 'base64');
  }

  const key = crypto.randomBytes(32);
  writeJsonFile(KEY_PATH, {
    version: 1,
    created_at: new Date().toISOString(),
    key: key.toString('base64')
  });

  return key;
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
  applyEncryptedCredentials
};

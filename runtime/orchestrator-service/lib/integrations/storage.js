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
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf8');
  }
}

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
  } catch {
    return fallback;
  }
}

function writeJsonFile(filePath, data) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
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
  writeJsonFile,
  appendJsonArrayEntry
};

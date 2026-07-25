const fs = require('fs');
const path = require('path');
const { appendJsonArrayEntry } = require('./storage');

function getAuditLogPath(projectPaths) {
  return path.join(projectPaths.integrationsDir, 'audit-log.json');
}

function assertControlledAuditPath(projectPaths) {
  if (!projectPaths || typeof projectPaths.integrationsDir !== 'string' || !path.isAbsolute(projectPaths.integrationsDir)) {
    throw new TypeError('A resolved integrations directory is required');
  }
  const directory = fs.lstatSync(projectPaths.integrationsDir);
  if (!directory.isDirectory() || directory.isSymbolicLink()) {
    throw new TypeError('Integrations directory must be a real directory');
  }
  const auditPath = getAuditLogPath(projectPaths);
  for (const candidate of [auditPath, `${auditPath}.tmp`, `${auditPath}.backup`]) {
    if (!fs.existsSync(candidate)) continue;
    const stat = fs.lstatSync(candidate);
    if (stat.isSymbolicLink() || !stat.isFile()) throw new TypeError('Controlled audit files must be regular files');
  }
  return auditPath;
}

function appendIntegrationAudit(projectPaths, entry = {}) {
  appendJsonArrayEntry(getAuditLogPath(projectPaths), entry, 1000);
}

function readIntegrationAudit(projectPaths) {
  const auditPath = assertControlledAuditPath(projectPaths);
  if (!fs.existsSync(auditPath)) return [];
  const stat = fs.lstatSync(auditPath);
  if (!stat.isFile() || stat.isSymbolicLink()) throw new TypeError('Integration audit log must be a regular file');
  const entries = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
  if (!Array.isArray(entries)) throw new TypeError('Integration audit log must contain an array');
  return entries;
}

function appendIntegrationAuditOnce(projectPaths, entry = {}) {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry) || typeof entry.id !== 'string' || !entry.id) {
    throw new TypeError('An audit entry with a stable id is required');
  }
  const entries = readIntegrationAudit(projectPaths);
  const existing = entries.find((item) => item && item.id === entry.id);
  if (existing) {
    if (JSON.stringify(existing) !== JSON.stringify(entry)) {
      throw new Error(`Audit event id collision: ${entry.id}`);
    }
    return Object.freeze({ created: false, entry: existing });
  }
  appendJsonArrayEntry(getAuditLogPath(projectPaths), entry, 1000);
  return Object.freeze({ created: true, entry });
}

module.exports = {
  appendIntegrationAudit,
  readIntegrationAudit,
  appendIntegrationAuditOnce
};

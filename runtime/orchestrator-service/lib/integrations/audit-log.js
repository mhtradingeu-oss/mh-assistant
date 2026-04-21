const path = require('path');
const { appendJsonArrayEntry } = require('./storage');

function getAuditLogPath(projectPaths) {
  return path.join(projectPaths.integrationsDir, 'audit-log.json');
}

function appendIntegrationAudit(projectPaths, entry = {}) {
  appendJsonArrayEntry(getAuditLogPath(projectPaths), entry, 1000);
}

module.exports = {
  appendIntegrationAudit
};

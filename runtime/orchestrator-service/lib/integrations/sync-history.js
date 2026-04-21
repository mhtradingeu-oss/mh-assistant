const path = require('path');

const {
  ensureDir,
  appendJsonArrayEntry,
  writeJsonFile
} = require('./storage');

function getIntegrationSnapshotPath(projectPaths, integrationId) {
  const dir = path.join(projectPaths.integrationsDir, 'snapshots');
  ensureDir(dir);
  return path.join(dir, `${integrationId}.json`);
}

function getIntegrationSyncHistoryPath(projectPaths) {
  return path.join(projectPaths.integrationsDir, 'sync-history.json');
}

function writeIntegrationSnapshot(projectPaths, integrationId, payload = {}) {
  writeJsonFile(getIntegrationSnapshotPath(projectPaths, integrationId), payload);
}

function appendIntegrationSyncHistory(projectPaths, entry = {}) {
  appendJsonArrayEntry(getIntegrationSyncHistoryPath(projectPaths), entry, 500);
}

module.exports = {
  writeIntegrationSnapshot,
  appendIntegrationSyncHistory
};

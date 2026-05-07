'use strict';

function createSchedulerStorage(deps = {}) {
  const {
    path,
    fs,
    dataDir,
    normalizeProjectSlug,
    resolveProjectPath,
    ensureDir,
    readJsonFile,
    writeJsonFile,
    sanitizeErrorMessage,
    sanitizeValue
  } = deps;

  if (!path || !fs || !dataDir) {
    throw new Error('createSchedulerStorage requires path, fs, and dataDir');
  }

  function getSchedulerFilePath(projectName) {
    const safeProject = normalizeProjectSlug(projectName);
    const projectRoot = resolveProjectPath(path.join(dataDir, 'projects'), safeProject).projectRoot;
    const executionDir = path.join(projectRoot, 'execution');
    ensureDir(executionDir);
    return path.join(executionDir, 'scheduler.json');
  }

  function readSchedulerJobs(projectName) {
    return readJsonFile(getSchedulerFilePath(projectName), []);
  }

  function writeSchedulerJobs(projectName, jobs) {
    writeJsonFile(getSchedulerFilePath(projectName), jobs);
  }

  function writeSchedulerAuditLog(projectName, entry) {
    const safeProject = normalizeProjectSlug(projectName);
    const projectRoot = resolveProjectPath(path.join(dataDir, 'projects'), safeProject).projectRoot;
    const logsDir = path.join(projectRoot, 'execution', 'logs');
    ensureDir(logsDir);

    const timestamp = new Date().toISOString();
    const fileSafeStamp = timestamp.replace(/[:.]/g, '-');
    const logPath = path.join(logsDir, `scheduler-${fileSafeStamp}.jsonl`);

    const record = {
      timestamp,
      job_id: String(entry.job_id || ''),
      action: String(entry.action || 'worker_action'),
      status: String(entry.status || ''),
      error: entry.error ? sanitizeErrorMessage(entry.error, 'Worker error') : null,
      result_reference: entry.result_reference != null ? sanitizeValue(entry.result_reference) : null
    };

    fs.appendFileSync(logPath, JSON.stringify(record) + '\n', 'utf8');
    return logPath;
  }

  return {
    getSchedulerFilePath,
    readSchedulerJobs,
    writeSchedulerJobs,
    writeSchedulerAuditLog
  };
}

module.exports = {
  createSchedulerStorage
};

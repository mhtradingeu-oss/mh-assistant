'use strict';

const workers = new Map();

function upsertWorker(worker = {}) {
  const workerId = String(worker.worker_id || '');

  if (!workerId) {
    throw new Error('worker_id is required');
  }

  const record = {
    worker_id: workerId,
    worker_type: String(worker.worker_type || 'gpu-renderer'),
    status: String(worker.status || 'online'),
    capabilities: worker.capabilities || {},
    active_jobs: Number(worker.active_jobs || 0),
    max_jobs: Number(worker.max_jobs || 1),
    endpoint: String(worker.endpoint || ''),
    updated_at: new Date().toISOString()
  };

  workers.set(workerId, record);

  return record;
}

function getWorker(workerId) {
  return workers.get(String(workerId || '')) || null;
}

function listWorkers() {
  return Array.from(workers.values());
}

function listAvailableWorkers() {
  return listWorkers().filter(worker =>
    worker.status === 'online' &&
    worker.active_jobs < worker.max_jobs
  );
}

module.exports = {
  upsertWorker,
  getWorker,
  listWorkers,
  listAvailableWorkers
};

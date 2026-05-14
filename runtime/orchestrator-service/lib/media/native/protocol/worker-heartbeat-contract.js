'use strict';

function createWorkerHeartbeat(input = {}) {
  return {
    worker_id: String(input.worker_id || ''),
    worker_type: String(input.worker_type || 'gpu-renderer'),
    status: String(input.status || 'online'),
    capabilities: input.capabilities || {},
    active_jobs: Number(input.active_jobs || 0),
    max_jobs: Number(input.max_jobs || 1),
    metadata: {
      timestamp: new Date().toISOString(),
      runtime: 'mh-os-worker-runtime'
    }
  };
}

module.exports = {
  createWorkerHeartbeat
};

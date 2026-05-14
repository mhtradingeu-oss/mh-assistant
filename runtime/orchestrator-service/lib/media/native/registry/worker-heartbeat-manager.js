'use strict';

const { upsertWorker } = require('./worker-registry-store');

function createWorkerHeartbeatManager() {
  function receiveHeartbeat(heartbeat = {}) {
    return upsertWorker({
      worker_id: heartbeat.worker_id,
      worker_type: heartbeat.worker_type,
      status: heartbeat.status,
      capabilities: heartbeat.capabilities,
      active_jobs: heartbeat.active_jobs,
      max_jobs: heartbeat.max_jobs,
      endpoint: heartbeat.endpoint || ''
    });
  }

  return {
    receiveHeartbeat
  };
}

module.exports = {
  createWorkerHeartbeatManager
};

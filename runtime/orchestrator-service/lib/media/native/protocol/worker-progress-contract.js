'use strict';

function createWorkerProgressContract(input = {}) {
  return {
    job_id: String(input.job_id || ''),
    progress: Number(input.progress || 0),
    stage: String(input.stage || 'queued'),
    message: String(input.message || ''),
    eta_seconds: Number(input.eta_seconds || 0),
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  createWorkerProgressContract
};

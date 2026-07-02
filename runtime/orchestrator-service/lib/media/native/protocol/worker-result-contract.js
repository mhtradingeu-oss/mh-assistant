'use strict';

function createWorkerResultContract(input = {}) {
  return {
    contract_version: '1.0.0',
    job_id: String(input.job_id || ''),
    success: Boolean(input.success),
    renderer: String(input.renderer || ''),
    media_type: String(input.media_type || ''),
    status: String(input.status || 'unknown'),
    outputs: Array.isArray(input.outputs) ? input.outputs : [],
    metrics: input.metrics || {},
    errors: Array.isArray(input.errors) ? input.errors : [],
    metadata: {
      completed_at: new Date().toISOString(),
      worker_id: String(input.worker_id || '')
    }
  };
}

module.exports = {
  createWorkerResultContract
};

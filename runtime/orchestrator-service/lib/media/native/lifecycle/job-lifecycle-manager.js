'use strict';

const {
  createJob,
  updateJob,
  getJob,
  listJobs
} = require('./job-state-store');

function createJobLifecycleManager() {
  function queueJob(input = {}) {
    return createJob({
      job_id: input.job_id,
      media_type: input.media_type,
      status: 'queued',
      worker_id: input.worker_id || '',
      model_id: input.model_id || '',
      metadata: input.metadata || {}
    });
  }

  function markDispatched(jobId) {
    return updateJob(jobId, {
      status: 'dispatched'
    });
  }

  function markRendering(jobId, progress = 0) {
    return updateJob(jobId, {
      status: 'rendering',
      progress
    });
  }

  function markCompleted(jobId, outputs = []) {
    return updateJob(jobId, {
      status: 'completed',
      progress: 100,
      outputs
    });
  }

  function markFailed(jobId, error = '') {
    return updateJob(jobId, {
      status: 'failed',
      error: String(error || '')
    });
  }

  return {
    queueJob,
    markDispatched,
    markRendering,
    markCompleted,
    markFailed,
    getJob,
    listJobs
  };
}

module.exports = {
  createJobLifecycleManager
};

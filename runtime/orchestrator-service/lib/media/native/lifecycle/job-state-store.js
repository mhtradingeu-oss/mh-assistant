'use strict';

const jobs = new Map();

function createJob(record = {}) {
  const jobId = String(record.job_id || '');

  if (!jobId) {
    throw new Error('job_id is required');
  }

  const state = {
    job_id: jobId,
    media_type: String(record.media_type || 'video'),
    status: String(record.status || 'queued'),
    progress: Number(record.progress || 0),
    worker_id: String(record.worker_id || ''),
    model_id: String(record.model_id || ''),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    metadata: record.metadata || {}
  };

  jobs.set(jobId, state);

  return state;
}

function updateJob(jobId, updates = {}) {
  const current = jobs.get(String(jobId || ''));

  if (!current) {
    return null;
  }

  const next = {
    ...current,
    ...updates,
    updated_at: new Date().toISOString()
  };

  jobs.set(jobId, next);

  return next;
}

function getJob(jobId) {
  return jobs.get(String(jobId || '')) || null;
}

function listJobs() {
  return Array.from(jobs.values());
}

module.exports = {
  createJob,
  updateJob,
  getJob,
  listJobs
};

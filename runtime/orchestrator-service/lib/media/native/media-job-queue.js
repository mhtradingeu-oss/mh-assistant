'use strict';

const queue = [];

function enqueueMediaJob(job = {}) {
  const item = {
    ...job,
    id: job.id || `media_job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    status: job.status || 'queued',
    queued_at: new Date().toISOString()
  };

  queue.push(item);
  return item;
}

function listMediaJobs() {
  return queue.slice();
}

function getMediaJob(id) {
  return queue.find(job => job.id === id) || null;
}

module.exports = {
  enqueueMediaJob,
  listMediaJobs,
  getMediaJob
};

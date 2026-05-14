'use strict';

const { listAvailableWorkers } = require('./worker-registry-store');

function workerSupports(worker, mediaType) {
  const supported = worker.capabilities?.supported_media_types;

  if (!Array.isArray(supported)) {
    return true;
  }

  return supported.includes(mediaType);
}

function selectBestWorker(input = {}) {
  const mediaType = String(input.media_type || input.type || 'video');

  const candidates = listAvailableWorkers()
    .filter(worker => workerSupports(worker, mediaType))
    .sort((a, b) => {
      const aLoad = a.max_jobs - a.active_jobs;
      const bLoad = b.max_jobs - b.active_jobs;

      return bLoad - aLoad;
    });

  return candidates[0] || null;
}

module.exports = {
  selectBestWorker
};

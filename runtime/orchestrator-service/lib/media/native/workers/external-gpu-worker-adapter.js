'use strict';

function createExternalGpuWorkerAdapter(options = {}) {
  const endpoint = String(options.endpoint || process.env.NATIVE_MEDIA_GPU_WORKER_URL || '').trim();
  const apiKey = String(options.apiKey || process.env.NATIVE_MEDIA_GPU_WORKER_KEY || '').trim();

  function isConfigured() {
    return Boolean(endpoint);
  }

  async function submitJob(job = {}) {
    if (!isConfigured()) {
      return {
        success: false,
        status: 'not_configured',
        worker: 'external-gpu-worker',
        message: 'External GPU worker is not configured.',
        required_next_step: 'Set NATIVE_MEDIA_GPU_WORKER_URL and optional NATIVE_MEDIA_GPU_WORKER_KEY.'
      };
    }

    return {
      success: false,
      status: 'not_connected',
      worker: 'external-gpu-worker',
      endpoint,
      has_api_key: Boolean(apiKey),
      message: 'External GPU worker adapter is configured but HTTP submission is not enabled yet.',
      job_summary: {
        type: job.type || job.media_type || '',
        platform: job.platform || '',
        project: job.project || '',
        prompt_hash: job.prompt_hash || ''
      }
    };
  }

  return {
    id: 'external-gpu-worker',
    configured: isConfigured(),
    endpoint,
    submitJob
  };
}

module.exports = {
  createExternalGpuWorkerAdapter
};

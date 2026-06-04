'use strict';

const axios = require('axios');

function createExternalGpuWorkerAdapter(options = {}) {
  const endpoint = String(options.endpoint || process.env.NATIVE_MEDIA_GPU_WORKER_URL || '').trim();
  const apiKey = String(options.apiKey || process.env.NATIVE_MEDIA_GPU_WORKER_KEY || '').trim();
  const timeoutMs = Number(options.timeoutMs || process.env.NATIVE_MEDIA_GPU_WORKER_TIMEOUT_MS || 120000);

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

    try {
      const response = await axios.post(endpoint, job, {
        timeout: Number.isFinite(timeoutMs) ? timeoutMs : 120000,
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
        }
      });

      return {
        success: true,
        status: 'submitted',
        worker: 'external-gpu-worker',
        endpoint,
        has_api_key: Boolean(apiKey),
        response_status: response.status,
        response: response.data,
        submitted_at: new Date().toISOString(),
        job_summary: {
          type: job.type || job.media_type || '',
          platform: job.platform || '',
          project: job.project || '',
          prompt_hash: job.prompt_hash || ''
        }
      };
    } catch (error) {
      return {
        success: false,
        status: 'provider_error',
        worker: 'external-gpu-worker',
        endpoint,
        has_api_key: Boolean(apiKey),
        message: String(error.message || 'External GPU worker submission failed.'),
        response_status: Number(error.response?.status || 0) || null,
        response: error.response?.data || null,
        job_summary: {
          type: job.type || job.media_type || '',
          platform: job.platform || '',
          project: job.project || '',
          prompt_hash: job.prompt_hash || ''
        }
      }
    }
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

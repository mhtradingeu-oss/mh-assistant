'use strict';

const { createProviderAdapterRegistry } = require('../adapters/provider-adapter-registry');
const { createExternalGpuWorkerAdapter } = require('../../workers/external-gpu-worker-adapter');

function createProviderExecutionRouter(options = {}) {
  const adapterRegistry = createProviderAdapterRegistry(options.adapters || {});
  const gpuWorker = createExternalGpuWorkerAdapter(options.gpuWorker || {});

  async function execute(job = {}) {
    const provider = String(job.provider || 'native').toLowerCase();
    const mediaType = String(job.media_type || job.type || 'image').toLowerCase();

    if (provider === 'openai') {
      const adapter = adapterRegistry.getAdapter('openai');

      if (!adapter) {
        return {
          success: false,
          provider,
          media_type: mediaType,
          status: 'missing_adapter',
          message: 'OpenAI adapter is not registered.'
        };
      }

      if (mediaType === 'image') {
        return adapter.generateImage(job);
      }

      if (mediaType === 'voice_chat') {
        return adapter.createRealtimeVoiceSession(job);
      }

      return {
        success: false,
        provider,
        media_type: mediaType,
        status: 'unsupported_media_type',
        message: `OpenAI adapter does not yet support media type: ${mediaType}`
      };
    }

    if (provider === 'native') {
      return gpuWorker.submitJob(job);
    }

    return {
      success: false,
      provider,
      media_type: mediaType,
      status: 'missing_adapter',
      message: `No provider execution adapter registered for provider: ${provider}`
    };
  }

  function listRegisteredProviders() {
    return [
      ...adapterRegistry.listAdapters(),
      'native'
    ];
  }

  return {
    execute,
    listRegisteredProviders
  };
}

module.exports = {
  createProviderExecutionRouter
};

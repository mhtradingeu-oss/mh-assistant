'use strict';

const crypto = require('crypto');

const { createWorkerJobContract } = require('../protocol/worker-job-contract');
const { selectBestWorker } = require('../registry/worker-selection-engine');
const { selectBestModel } = require('../models/model-selection-engine');
const {
  createProviderExecutionRouter
} = require('../providers/router/provider-execution-router');

function hashValue(value = '') {
  return crypto
    .createHash('sha256')
    .update(String(value))
    .digest('hex')
    .slice(0, 16);
}

function createJobDispatchOrchestrator(options = {}) {
  const providerRouter = createProviderExecutionRouter(options.providerRouter || {});

  async function dispatch(input = {}) {
    const mediaType = String(input.media_type || input.type || 'video');

    const selectedModel = selectBestModel({
      media_type: mediaType,
      provider: input.provider || '',
      quality_tier: input.quality_tier || 'standard'
    });

    if (!selectedModel) {
      return {
        success: false,
        stage: 'model_selection',
        error: `No model available for media type: ${mediaType}`
      };
    }

    const selectedWorker = selectBestWorker({
      media_type: mediaType
    });

    if (!selectedWorker) {
      return {
        success: false,
        stage: 'worker_selection',
        selected_model: selectedModel,
        error: `No available worker for media type: ${mediaType}`
      };
    }

    const workerJob = createWorkerJobContract({
      job_id: input.job_id || `job_${Date.now()}`,
      media_type: mediaType,
      provider: selectedModel.provider,
      project: input.project || 'default',
      platform: input.platform || '',
      priority: input.priority || 'normal',
      prompt: input.prompt || '',
      prompt_hash: hashValue(input.prompt || ''),
      brief: input.brief || {},
      quality: input.quality || {}
    });

    const workerSubmission = await providerRouter.execute({
      ...workerJob,
      provider: selectedModel.provider || workerJob.provider || 'native',
      model_id: selectedModel.model_id,
      worker_id: selectedWorker.worker_id
    });

    return {
      success: true,
      stage: 'dispatch_complete',
      selected_model: selectedModel,
      selected_worker: selectedWorker,
      worker_job: workerJob,
      worker_submission: workerSubmission,
      dispatched_at: new Date().toISOString()
    };
  }

  return {
    dispatch
  };
}

module.exports = {
  createJobDispatchOrchestrator
};

'use strict';

function createWorkerJobContract(input = {}) {
  return {
    contract_version: '1.0.0',
    job_id: String(input.job_id || ''),
    media_type: String(input.media_type || input.type || 'video'),
    provider: String(input.provider || 'native'),
    project: String(input.project || 'default'),
    platform: String(input.platform || ''),
    priority: String(input.priority || 'normal'),
    prompt: String(input.prompt || ''),
    prompt_hash: String(input.prompt_hash || ''),
    brief: input.brief || {},
    quality: input.quality || {},
    metadata: {
      created_at: new Date().toISOString(),
      source_runtime: 'mh-os-native-media-runtime'
    }
  };
}

module.exports = {
  createWorkerJobContract
};

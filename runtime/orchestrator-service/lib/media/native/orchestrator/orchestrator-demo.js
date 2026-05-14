'use strict';

const { registerDefaultModels } = require('../models/default-models');
const { createWorkerHeartbeatManager } = require('../registry/worker-heartbeat-manager');
const { createJobDispatchOrchestrator } = require('./job-dispatch-orchestrator');

async function main() {
  registerDefaultModels();

  const heartbeatManager = createWorkerHeartbeatManager();

  heartbeatManager.receiveHeartbeat({
    worker_id: 'gpu-worker-1',
    worker_type: 'gpu-renderer',
    status: 'online',
    active_jobs: 1,
    max_jobs: 4,
    capabilities: {
      supported_media_types: ['image', 'video']
    }
  });

  const orchestrator = createJobDispatchOrchestrator();

  const result = await orchestrator.dispatch({
    media_type: 'video',
    platform: 'instagram',
    project: 'hairoticmen',
    quality_tier: 'high',
    prompt: 'Create premium beard oil cinematic commercial'
  });

  console.log(JSON.stringify(result, null, 2));
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});

'use strict';

async function createVideoJob(payload = {}) {
  return {
    type: 'video',
    status: 'draft',
    provider: 'native',
    prompt: String(payload.prompt || payload.video_brief || ''),
    video_brief: String(payload.video_brief || ''),
    output: null,
    metadata: {
      created_at: new Date().toISOString(),
      runtime: 'native-video-runtime'
    }
  };
}

function createNativeVideoRuntime() {
  return {
    id: 'native-video',
    type: 'video',
    available: false,
    createJob: createVideoJob
  };
}

module.exports = {
  createNativeVideoRuntime
};

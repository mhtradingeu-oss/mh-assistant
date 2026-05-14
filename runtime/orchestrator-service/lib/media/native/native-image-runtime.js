'use strict';

async function createImageJob(payload = {}) {
  return {
    type: 'image',
    status: 'draft',
    provider: 'native',
    prompt: String(payload.prompt || ''),
    output: null,
    metadata: {
      created_at: new Date().toISOString(),
      runtime: 'native-image-runtime'
    }
  };
}

function createNativeImageRuntime() {
  return {
    id: 'native-image',
    type: 'image',
    available: false,
    createJob: createImageJob
  };
}

module.exports = {
  createNativeImageRuntime
};

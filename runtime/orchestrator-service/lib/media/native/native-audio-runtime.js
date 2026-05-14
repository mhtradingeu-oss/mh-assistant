'use strict';

async function createAudioJob(payload = {}) {
  return {
    type: 'audio',
    status: 'draft',
    provider: 'native',
    prompt: String(payload.prompt || payload.voice_script || ''),
    voice_script: String(payload.voice_script || ''),
    output: null,
    metadata: {
      created_at: new Date().toISOString(),
      runtime: 'native-audio-runtime'
    }
  };
}

function createNativeAudioRuntime() {
  return {
    id: 'native-audio',
    type: 'audio',
    available: false,
    createJob: createAudioJob
  };
}

module.exports = {
  createNativeAudioRuntime
};

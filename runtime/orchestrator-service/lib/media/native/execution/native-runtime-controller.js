'use strict';

const { createNativeRuntimeExecutor } = require('./native-runtime-executor');

function createNativeRuntimeController(options = {}) {
  const executor = createNativeRuntimeExecutor(options);

  async function executeMediaRequest(payload = {}) {
    const mediaType = String(payload.media_type || payload.type || 'video').toLowerCase();

    return executor.execute({
      ...payload,
      media_type: mediaType
    });
  }

  return {
    executeMediaRequest
  };
}

module.exports = {
  createNativeRuntimeController
};

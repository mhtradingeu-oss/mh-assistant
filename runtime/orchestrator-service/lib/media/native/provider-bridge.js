'use strict';

const { createNativeEngineRegistry } = require('./native-engine-registry');

function createMediaProviderBridge(options = {}) {
  const nativeRegistry = createNativeEngineRegistry(options);

  function getEngine(type) {
    if (type === 'image') return nativeRegistry.image;
    if (type === 'video') return nativeRegistry.video;
    if (type === 'audio' || type === 'voice') return nativeRegistry.audio;
    if (type === 'voice_chat') return nativeRegistry.voiceChat;
    return null;
  }

  return {
    id: 'media-provider-bridge',
    native: nativeRegistry,
    getEngine
  };
}

module.exports = {
  createMediaProviderBridge
};

'use strict';

const { createNativeImageRuntime } = require('./native-image-runtime');
const { createNativeVideoRuntime } = require('./native-video-runtime');
const { createNativeAudioRuntime } = require('./native-audio-runtime');
const { createNativeVoiceChatRuntime } = require('./native-voice-chat-runtime');

function createNativeEngineRegistry(options = {}) {
  return {
    image: createNativeImageRuntime(options),
    video: createNativeVideoRuntime(options),
    audio: createNativeAudioRuntime(options),
    voiceChat: createNativeVoiceChatRuntime(options)
  };
}

module.exports = {
  createNativeEngineRegistry
};

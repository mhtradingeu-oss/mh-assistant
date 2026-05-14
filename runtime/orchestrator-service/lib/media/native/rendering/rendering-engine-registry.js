'use strict';

const { createImageRenderingAdapter } = require('./rendering-image-adapter');
const { createVideoRenderingAdapter } = require('./rendering-video-adapter');
const { createAudioRenderingAdapter } = require('./rendering-audio-adapter');
const { createVoiceChatRenderingAdapter } = require('./rendering-voice-chat-adapter');

function createRenderingEngineRegistry(options = {}) {
  return {
    image: createImageRenderingAdapter(options),
    video: createVideoRenderingAdapter(options),
    audio: createAudioRenderingAdapter(options),
    voice_chat: createVoiceChatRenderingAdapter(options)
  };
}

module.exports = {
  createRenderingEngineRegistry
};

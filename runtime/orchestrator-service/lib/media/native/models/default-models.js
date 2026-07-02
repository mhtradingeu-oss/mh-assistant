'use strict';

const { registerModel } = require('./model-registry-store');

function registerDefaultModels() {
  return [
    registerModel({
      model_id: 'gpt-image-1',
      provider: 'openai',
      media_type: 'image',
      category: 'image-generation-editing',
      quality_tier: 'high',
      vram_requirement_gb: 0,
      supported_resolutions: ['1024x1024']
    }),

    registerModel({
      model_id: 'gpt-realtime',
      provider: 'openai',
      media_type: 'voice_chat',
      category: 'realtime-voice',
      quality_tier: 'high',
      vram_requirement_gb: 0,
      supports_realtime: true,
      supports_streaming: true
    }),

    registerModel({
      model_id: 'flux-dev',
      provider: 'native',
      media_type: 'image',
      category: 'image-generation',
      quality_tier: 'high',
      vram_requirement_gb: 16,
      supported_resolutions: ['1024x1024', '2048x2048']
    }),

    registerModel({
      model_id: 'stable-diffusion-xl',
      provider: 'native',
      media_type: 'image',
      category: 'image-generation',
      quality_tier: 'standard',
      vram_requirement_gb: 12,
      supported_resolutions: ['1024x1024']
    }),

    registerModel({
      model_id: 'wan-video',
      provider: 'native',
      media_type: 'video',
      category: 'video-generation',
      quality_tier: 'high',
      vram_requirement_gb: 24,
      supported_resolutions: ['720p', '1080p']
    }),

    registerModel({
      model_id: 'cogvideo-x',
      provider: 'native',
      media_type: 'video',
      category: 'video-generation',
      quality_tier: 'standard',
      vram_requirement_gb: 24,
      supported_resolutions: ['720p']
    }),

    registerModel({
      model_id: 'xtts-v2',
      provider: 'native',
      media_type: 'audio',
      category: 'tts',
      quality_tier: 'high',
      vram_requirement_gb: 8,
      supports_streaming: true
    }),

    registerModel({
      model_id: 'whisper-large',
      provider: 'native',
      media_type: 'voice_chat',
      category: 'speech-recognition',
      quality_tier: 'high',
      vram_requirement_gb: 10,
      supports_realtime: true
    })
  ];
}

module.exports = {
  registerDefaultModels
};

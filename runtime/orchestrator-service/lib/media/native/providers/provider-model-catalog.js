'use strict';

const PROVIDER_MODEL_CATALOG = [
  {
    provider: 'openai',
    model_id: 'gpt-image-1',
    media_type: 'image',
    category: 'image-generation-editing',
    quality_tier: 'high',
    execution_type: 'api',
    requires_api_key: true,
    env_key: 'OPENAI_API_KEY',
    notes: 'OpenAI image generation/editing API target.'
  },
  {
    provider: 'google',
    model_id: 'gemini-2.5-flash-image',
    alias: 'nano-banana',
    media_type: 'image',
    category: 'image-generation-editing',
    quality_tier: 'high',
    execution_type: 'api',
    requires_api_key: true,
    env_key: 'GOOGLE_API_KEY',
    notes: 'Google Gemini image generation/editing target, commonly known as Nano Banana.'
  },
  {
    provider: 'google',
    model_id: 'veo',
    media_type: 'video',
    category: 'video-generation',
    quality_tier: 'high',
    execution_type: 'api',
    requires_api_key: true,
    env_key: 'GOOGLE_API_KEY',
    notes: 'Google video generation family. Exact version depends on account availability.'
  },
  {
    provider: 'runway',
    model_id: 'runway-video',
    media_type: 'video',
    category: 'video-generation',
    quality_tier: 'high',
    execution_type: 'api',
    requires_api_key: true,
    env_key: 'RUNWAY_API_KEY',
    notes: 'Runway video generation provider target.'
  },
  {
    provider: 'kling',
    model_id: 'kling-video',
    media_type: 'video',
    category: 'video-generation',
    quality_tier: 'high',
    execution_type: 'api',
    requires_api_key: true,
    env_key: 'KLING_API_KEY',
    notes: 'Kling video generation provider target.'
  },
  {
    provider: 'pika',
    model_id: 'pika-video',
    media_type: 'video',
    category: 'video-generation',
    quality_tier: 'standard',
    execution_type: 'api',
    requires_api_key: true,
    env_key: 'PIKA_API_KEY',
    notes: 'Pika video generation provider target.'
  },
  {
    provider: 'native',
    model_id: 'flux-dev',
    media_type: 'image',
    category: 'image-generation',
    quality_tier: 'high',
    execution_type: 'local-or-worker',
    requires_api_key: false,
    env_key: '',
    notes: 'Open-source image model target for GPU worker execution.'
  },
  {
    provider: 'native',
    model_id: 'stable-diffusion-xl',
    media_type: 'image',
    category: 'image-generation',
    quality_tier: 'standard',
    execution_type: 'local-or-worker',
    requires_api_key: false,
    env_key: '',
    notes: 'Open-source image model target for GPU worker execution.'
  },
  {
    provider: 'native',
    model_id: 'wan-video',
    media_type: 'video',
    category: 'video-generation',
    quality_tier: 'high',
    execution_type: 'local-or-worker',
    requires_api_key: false,
    env_key: '',
    notes: 'Open-source video model target for GPU worker execution.'
  },
  {
    provider: 'native',
    model_id: 'cogvideo-x',
    media_type: 'video',
    category: 'video-generation',
    quality_tier: 'standard',
    execution_type: 'local-or-worker',
    requires_api_key: false,
    env_key: '',
    notes: 'Open-source video model target for GPU worker execution.'
  },
  {
    provider: 'native',
    model_id: 'ltx-video',
    media_type: 'video',
    category: 'video-generation',
    quality_tier: 'standard',
    execution_type: 'local-or-worker',
    requires_api_key: false,
    env_key: '',
    notes: 'Open-source video model target for GPU worker execution.'
  },
  {
    provider: 'native',
    model_id: 'xtts-v2',
    media_type: 'audio',
    category: 'tts',
    quality_tier: 'high',
    execution_type: 'local-or-worker',
    requires_api_key: false,
    env_key: '',
    notes: 'Open-source TTS target.'
  },
  {
    provider: 'openai',
    model_id: 'gpt-realtime',
    media_type: 'voice_chat',
    category: 'realtime-voice',
    quality_tier: 'high',
    execution_type: 'api',
    requires_api_key: true,
    env_key: 'OPENAI_API_KEY',
    notes: 'OpenAI realtime voice provider target. Exact model/version depends on API availability.'
  }
];

function listProviderModels() {
  return PROVIDER_MODEL_CATALOG.slice();
}

function listProviderModelsByMediaType(mediaType) {
  const target = String(mediaType || '').toLowerCase();
  return PROVIDER_MODEL_CATALOG.filter(model => model.media_type === target);
}

function findProviderModel(provider, modelId) {
  const p = String(provider || '').toLowerCase();
  const m = String(modelId || '').toLowerCase();

  return PROVIDER_MODEL_CATALOG.find(model =>
    String(model.provider).toLowerCase() === p &&
    String(model.model_id).toLowerCase() === m
  ) || null;
}

module.exports = {
  PROVIDER_MODEL_CATALOG,
  listProviderModels,
  listProviderModelsByMediaType,
  findProviderModel
};

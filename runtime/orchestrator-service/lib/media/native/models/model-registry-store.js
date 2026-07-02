'use strict';

const models = new Map();

function registerModel(model = {}) {
  const modelId = String(model.model_id || '');

  if (!modelId) {
    throw new Error('model_id is required');
  }

  const record = {
    model_id: modelId,
    provider: String(model.provider || 'native'),
    media_type: String(model.media_type || 'video'),
    category: String(model.category || 'generation'),
    quality_tier: String(model.quality_tier || 'standard'),
    vram_requirement_gb: Number(model.vram_requirement_gb || 0),
    supports_realtime: Boolean(model.supports_realtime),
    supports_streaming: Boolean(model.supports_streaming),
    supported_resolutions: Array.isArray(model.supported_resolutions)
      ? model.supported_resolutions
      : [],
    enabled: model.enabled !== false,
    metadata: {
      registered_at: new Date().toISOString()
    }
  };

  models.set(modelId, record);

  return record;
}

function getModel(modelId) {
  return models.get(String(modelId || '')) || null;
}

function listModels() {
  return Array.from(models.values());
}

function listEnabledModels() {
  return listModels().filter(model => model.enabled);
}

module.exports = {
  registerModel,
  getModel,
  listModels,
  listEnabledModels
};

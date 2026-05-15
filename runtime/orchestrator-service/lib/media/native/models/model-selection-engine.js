'use strict';

const { listEnabledModels } = require('./model-registry-store');

function modelSupportsRequest(model, request = {}) {
  const mediaType = String(request.media_type || request.type || 'video');
  const provider = String(request.provider || '').toLowerCase();

  if (model.media_type !== mediaType) {
    return false;
  }

  if (provider && String(model.provider || '').toLowerCase() !== provider) {
    return false;
  }

  return true;
}

function selectBestModel(request = {}) {
  const preferredQuality = String(request.quality_tier || 'standard');

  const candidates = listEnabledModels()
    .filter(model => modelSupportsRequest(model, request))
    .sort((a, b) => {
      if (a.quality_tier === preferredQuality && b.quality_tier !== preferredQuality) {
        return -1;
      }

      if (b.quality_tier === preferredQuality && a.quality_tier !== preferredQuality) {
        return 1;
      }

      return b.vram_requirement_gb - a.vram_requirement_gb;
    });

  return candidates[0] || null;
}

module.exports = {
  selectBestModel
};

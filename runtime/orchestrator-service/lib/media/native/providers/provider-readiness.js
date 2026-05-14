'use strict';

const { listProviderModels } = require('./provider-model-catalog');

function isConfigured(model, env = process.env) {
  if (!model.requires_api_key) return true;
  return Boolean(env[model.env_key]);
}

function getProviderReadiness(env = process.env) {
  return listProviderModels().map(model => ({
    provider: model.provider,
    model_id: model.model_id,
    alias: model.alias || '',
    media_type: model.media_type,
    execution_type: model.execution_type,
    quality_tier: model.quality_tier,
    configured: isConfigured(model, env),
    required_env: model.requires_api_key ? model.env_key : '',
    status: isConfigured(model, env) ? 'ready' : 'missing_credentials'
  }));
}

module.exports = {
  getProviderReadiness
};

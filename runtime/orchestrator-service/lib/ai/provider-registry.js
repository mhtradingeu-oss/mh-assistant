const { createOpenAiProvider } = require('./providers/openai');

const PROVIDER_FACTORIES = {
  openai: createOpenAiProvider
};

function asString(value) {
  if (value == null) return '';
  return String(value).trim().toLowerCase();
}

function getAiProvider(providerId, options = {}) {
  const normalizedProvider = asString(providerId);
  const factory = PROVIDER_FACTORIES[normalizedProvider] || null;

  if (!factory) {
    return null;
  }

  return factory(options);
}

function isAiProviderSupported(providerId) {
  return Boolean(PROVIDER_FACTORIES[asString(providerId)]);
}

function listAiProviders() {
  return Object.keys(PROVIDER_FACTORIES);
}

module.exports = {
  getAiProvider,
  isAiProviderSupported,
  listAiProviders
};

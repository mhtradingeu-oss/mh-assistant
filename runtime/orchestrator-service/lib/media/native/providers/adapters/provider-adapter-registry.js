'use strict';

const { createOpenAiProviderAdapter } = require('./openai-provider-adapter');

function createProviderAdapterRegistry(options = {}) {
  const adapters = new Map();

  adapters.set('openai', createOpenAiProviderAdapter(options.openai || {}));

  function getAdapter(provider) {
    return adapters.get(String(provider || '').toLowerCase()) || null;
  }

  function listAdapters() {
    return Array.from(adapters.keys());
  }

  function getReadiness() {
    return listAdapters().map(provider => {
      const adapter = getAdapter(provider);

      return {
        provider,
        configured: Boolean(adapter && adapter.isConfigured && adapter.isConfigured())
      };
    });
  }

  return {
    getAdapter,
    listAdapters,
    getReadiness
  };
}

module.exports = {
  createProviderAdapterRegistry
};

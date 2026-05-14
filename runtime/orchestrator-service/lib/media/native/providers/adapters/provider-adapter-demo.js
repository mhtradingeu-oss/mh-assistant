'use strict';

const {
  createProviderAdapterRegistry
} = require('./provider-adapter-registry');

const registry = createProviderAdapterRegistry();
const openai = registry.getAdapter('openai');

console.log(JSON.stringify({
  adapters: registry.listAdapters(),
  readiness: registry.getReadiness(),
  openai_configured: openai ? openai.isConfigured() : false
}, null, 2));

'use strict';

const {
  getChannelDefinitionForIntegration
} = require('./channel-integration-mapper');

const {
  registerChannel
} = require('./registry/channel-registry-store');

function registerIntegrationChannel(integrationId, providerResult = {}) {
  const channel = getChannelDefinitionForIntegration(
    integrationId,
    providerResult
  );

  if (!channel) {
    return {
      registered: false,
      reason: 'not_mappable',
      integration_id: String(integrationId || '')
    };
  }

  const registeredChannel = registerChannel(channel);

  return {
    registered: true,
    channel: registeredChannel,
    mapping: {
      integration_id: channel.integration_id,
      source_provider: channel.source_provider,
      customer_operations: channel.customer_operations
    }
  };
}

module.exports = {
  registerIntegrationChannel
};

'use strict';

const {
  registerIntegrationChannel
} = require('../channels/register-integration-channel');

const {
  createInboxEntry
} = require('./store/unified-inbox-store');

function asString(value) {
  return String(value == null ? '' : value).trim();
}

function createIntegrationInboxSeed(
  integrationId,
  providerResult = {},
  options = {}
) {
  const registration = registerIntegrationChannel(
    integrationId,
    providerResult
  );

  if (!registration.registered) {
    return {
      created: false,
      reason: registration.reason,
      integration_id: integrationId
    };
  }

  const channel = registration.channel;

  const inboxId = asString(
    options.inbox_id ||
    `inbox_${channel.channel_id}`
  );

  const entry = createInboxEntry({
    inbox_id: inboxId,

    channel: {
      channel_id: channel.channel_id,
      provider: channel.provider
    },

    conversation: {
      conversation_id: asString(
        options.conversation_id ||
        `${channel.channel_id}_conversation`
      ),

      customer_id: asString(
        options.customer_id || ''
      )
    },

    assignment: {
      assigned_team: asString(
        options.assigned_team || 'customer-care'
      ),

      assigned_ai_agent: asString(
        options.assigned_ai_agent || ''
      )
    },

    state: {
      status: 'open',
      priority: asString(
        options.priority || 'normal'
      ),
      unread_count: Number(
        options.unread_count || 0
      )
    },

    metadata: {
      created_at: new Date().toISOString(),
      source_runtime: 'mh-os-customer-operations'
    }
  });

  return {
    created: true,
    registration,
    inbox: entry
  };
}

module.exports = {
  createIntegrationInboxSeed
};

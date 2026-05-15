'use strict';

const {
  createIntegrationInboxSeed
} = require('../unified-inbox/register-integration-inbox');

const {
  createConversation
} = require('./store/conversation-store');

const {
  createMessage
} = require('./messages/message-store');

function asString(value) {
  return String(value == null ? '' : value).trim();
}

function createIntegrationConversationSession(
  integrationId,
  providerResult = {},
  payload = {}
) {
  const inboxSeed = createIntegrationInboxSeed(
    integrationId,
    providerResult,
    payload
  );

  if (!inboxSeed.created) {
    return {
      created: false,
      reason: inboxSeed.reason,
      integration_id: integrationId
    };
  }

  const inbox = inboxSeed.inbox;

  const conversation = createConversation({
    conversation_id: inbox.conversation.conversation_id,
    channel: inbox.channel.channel_id,
    customer_id: inbox.conversation.customer_id,
    assigned_ai_agent: inbox.assignment.assigned_ai_agent,
    priority: inbox.state.priority,
    status: 'active'
  });

  const message = createMessage({
    message_id: asString(
      payload.message_id ||
      `${conversation.conversation_id}_message_1`
    ),
    conversation_id: conversation.conversation_id,
    channel_id: inbox.channel.channel_id,
    direction: 'inbound',
    sender: {
      id: asString(payload.customer_id || ''),
      type: 'customer',
      display_name: asString(payload.display_name || '')
    },
    content: {
      text: asString(
        payload.message ||
        'New customer conversation started.'
      ),
      attachments: Array.isArray(payload.attachments)
        ? payload.attachments
        : []
    }
  });

  return {
    created: true,
    inbox,
    conversation,
    message
  };
}

module.exports = {
  createIntegrationConversationSession
};

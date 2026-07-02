'use strict';

function createMessageContract(input = {}) {
  return {
    message_id: String(input.message_id || ''),
    conversation_id: String(input.conversation_id || ''),

    channel_id: String(input.channel_id || ''),
    direction: String(input.direction || 'inbound'),

    sender: {
      id: String(input.sender?.id || ''),
      type: String(input.sender?.type || 'customer'),
      display_name: String(input.sender?.display_name || '')
    },

    content: {
      text: String(input.content?.text || ''),
      attachments: Array.isArray(input.content?.attachments)
        ? input.content.attachments
        : []
    },

    ai: {
      generated: Boolean(input.ai?.generated || false),
      agent_id: String(input.ai?.agent_id || ''),
      confidence: Number(input.ai?.confidence || 0)
    },

    delivery: {
      state: String(input.delivery?.state || 'received'),
      received_at:
        input.delivery?.received_at || new Date().toISOString()
    },

    metadata: {
      created_at:
        input.metadata?.created_at || new Date().toISOString(),
      source_runtime: 'mh-os-customer-operations'
    }
  };
}

module.exports = {
  createMessageContract
};

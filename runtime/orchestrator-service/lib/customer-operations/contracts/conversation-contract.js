'use strict';

function createConversationContract(input = {}) {
  return {
    conversation_id: String(input.conversation_id || ''),
    channel: String(input.channel || 'website'),
    customer_id: String(input.customer_id || ''),
    status: String(input.status || 'active'),
    priority: String(input.priority || 'normal'),

    assigned_to: String(input.assigned_to || ''),
    assigned_ai_agent: String(input.assigned_ai_agent || ''),

    subject: String(input.subject || ''),
    tags: Array.isArray(input.tags) ? input.tags : [],

    last_message_at: input.last_message_at || new Date().toISOString(),

    escalation: {
      level: Number(input.escalation?.level || 0),
      queue: String(input.escalation?.queue || ''),
      requires_human: Boolean(input.escalation?.requires_human || false)
    },

    sla: {
      response_due_at: input.sla?.response_due_at || null,
      resolution_due_at: input.sla?.resolution_due_at || null
    },

    metadata: {
      created_at: input.metadata?.created_at || new Date().toISOString(),
      source_runtime: 'mh-os-customer-operations'
    }
  };
}

module.exports = {
  createConversationContract
};

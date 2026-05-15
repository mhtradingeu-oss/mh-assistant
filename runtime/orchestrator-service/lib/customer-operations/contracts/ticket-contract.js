'use strict';

function createTicketContract(input = {}) {
  return {
    ticket_id: String(input.ticket_id || ''),
    conversation_id: String(input.conversation_id || ''),

    type: String(input.type || 'support'),
    status: String(input.status || 'open'),
    priority: String(input.priority || 'normal'),

    customer_id: String(input.customer_id || ''),
    assigned_team: String(input.assigned_team || ''),
    assigned_to: String(input.assigned_to || ''),

    escalation: {
      level: Number(input.escalation?.level || 0),
      state: String(input.escalation?.state || 'none')
    },

    workflow: {
      requires_approval: Boolean(input.workflow?.requires_approval || false),
      approval_state: String(input.workflow?.approval_state || 'not_required')
    },

    resolution: {
      resolved_at: input.resolution?.resolved_at || null,
      resolution_note: String(input.resolution?.resolution_note || '')
    },

    metadata: {
      created_at: input.metadata?.created_at || new Date().toISOString(),
      source_runtime: 'mh-os-customer-operations'
    }
  };
}

module.exports = {
  createTicketContract
};

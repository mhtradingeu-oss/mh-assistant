'use strict';

function createUnifiedInboxContract(input = {}) {
  return {
    inbox_id: String(input.inbox_id || ''),

    channel: {
      channel_id: String(input.channel?.channel_id || ''),
      provider: String(input.channel?.provider || '')
    },

    conversation: {
      conversation_id: String(
        input.conversation?.conversation_id || ''
      ),

      customer_id: String(
        input.conversation?.customer_id || ''
      )
    },

    assignment: {
      assigned_team: String(
        input.assignment?.assigned_team || 'customer-care'
      ),

      assigned_to: String(
        input.assignment?.assigned_to || ''
      ),

      assigned_ai_agent: String(
        input.assignment?.assigned_ai_agent || ''
      )
    },

    state: {
      status: String(input.state?.status || 'open'),
      priority: String(input.state?.priority || 'normal'),
      unread_count: Number(input.state?.unread_count || 0)
    },

    sla: {
      policy_id: String(input.sla?.policy_id || ''),
      breached: Boolean(input.sla?.breached || false)
    },

    escalation: {
      active: Boolean(input.escalation?.active || false),
      escalation_id: String(
        input.escalation?.escalation_id || ''
      )
    },

    metadata: {
      created_at:
        input.metadata?.created_at || new Date().toISOString(),
      source_runtime: 'mh-os-customer-operations'
    }
  };
}

module.exports = {
  createUnifiedInboxContract
};

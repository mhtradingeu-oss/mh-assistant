'use strict';

function createSlaPolicyContract(input = {}) {
  return {
    policy_id: String(input.policy_id || ''),

    scope: {
      channel_id: String(input.scope?.channel_id || ''),
      customer_type: String(input.scope?.customer_type || 'default'),
      priority: String(input.scope?.priority || 'normal')
    },

    response: {
      first_response_minutes: Number(
        input.response?.first_response_minutes || 60
      ),
      follow_up_minutes: Number(
        input.response?.follow_up_minutes || 240
      )
    },

    resolution: {
      resolution_target_minutes: Number(
        input.resolution?.resolution_target_minutes || 1440
      )
    },

    escalation: {
      enabled: Boolean(input.escalation?.enabled ?? true),

      human_handoff_minutes: Number(
        input.escalation?.human_handoff_minutes || 120
      ),

      escalation_queue: String(
        input.escalation?.escalation_queue || 'customer-care'
      )
    },

    ai: {
      auto_reply_enabled: Boolean(
        input.ai?.auto_reply_enabled ?? true
      ),

      auto_classification_enabled: Boolean(
        input.ai?.auto_classification_enabled ?? true
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
  createSlaPolicyContract
};

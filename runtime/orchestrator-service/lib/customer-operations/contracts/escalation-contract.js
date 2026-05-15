'use strict';

function createEscalationContract(input = {}) {
  return {
    escalation_id: String(input.escalation_id || ''),

    source: {
      type: String(input.source?.type || 'conversation'),
      source_id: String(input.source?.source_id || '')
    },

    priority: String(input.priority || 'normal'),

    routing: {
      assigned_team: String(
        input.routing?.assigned_team || 'customer-care'
      ),

      assigned_to: String(
        input.routing?.assigned_to || ''
      ),

      escalation_queue: String(
        input.routing?.escalation_queue || 'default'
      )
    },

    ai: {
      triggered_by_ai: Boolean(
        input.ai?.triggered_by_ai || false
      ),

      confidence: Number(
        input.ai?.confidence || 0
      ),

      reason: String(
        input.ai?.reason || ''
      )
    },

    workflow: {
      status: String(
        input.workflow?.status || 'pending'
      ),

      requires_human: Boolean(
        input.workflow?.requires_human ?? true
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
  createEscalationContract
};

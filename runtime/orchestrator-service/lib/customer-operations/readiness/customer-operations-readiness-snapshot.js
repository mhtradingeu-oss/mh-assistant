'use strict';

function safeList(fn) {
  if (typeof fn !== 'function') return [];
  try {
    const value = fn();
    return Array.isArray(value) ? value : [];
  } catch (error) {
    return [];
  }
}

function countEnabled(items) {
  return safeList(() => items).filter((item) => item && item.enabled !== false).length;
}

function createCustomerOperationsReadinessSnapshot(runtime = {}) {
  const channels = safeList(runtime.channels?.list);
  const conversations = safeList(runtime.conversations?.list);
  const tickets = safeList(runtime.tickets?.list);
  const messages = safeList(runtime.messages?.list);
  const customers = safeList(runtime.customers?.list);
  const slaPolicies = safeList(runtime.sla?.list);
  const escalations = safeList(runtime.escalation?.list);
  const inboxEntries = safeList(runtime.unifiedInbox?.list);

  const capabilities = typeof runtime.health === 'function'
    ? runtime.health().capabilities || {}
    : {};

  return {
    runtime: 'mh-os-customer-operations',
    status: 'ready',
    generated_at: new Date().toISOString(),

    bridges: {
      integration_channel_registration: typeof runtime.channels?.registerIntegration === 'function',
      integration_inbox_seed: typeof runtime.unifiedInbox?.createFromIntegration === 'function'
    },

    counts: {
      channels: channels.length,
      enabled_channels: countEnabled(channels),
      conversations: conversations.length,
      messages: messages.length,
      tickets: tickets.length,
      customers: customers.length,
      sla_policies: slaPolicies.length,
      escalations: escalations.length,
      unified_inbox_entries: inboxEntries.length
    },

    readiness: {
      channels_ready: channels.length > 0,
      inbox_ready: Boolean(capabilities.unified_inbox),
      tickets_ready: Boolean(capabilities.tickets),
      customer_profiles_ready: Boolean(capabilities.customers),
      sla_ready: Boolean(capabilities.sla),
      escalation_ready: Boolean(capabilities.escalation),
      integration_bridge_ready: Boolean(capabilities.integration_bridge),
      integration_inbox_bridge_ready: Boolean(capabilities.integration_inbox_bridge)
    },

    channels: channels.map((channel) => ({
      channel_id: channel.channel_id,
      provider: channel.provider,
      type: channel.type,
      enabled: Boolean(channel.enabled),
      capabilities: {
        messaging: Boolean(channel.capabilities?.messaging),
        attachments: Boolean(channel.capabilities?.attachments),
        voice: Boolean(channel.capabilities?.voice),
        realtime: Boolean(channel.capabilities?.realtime)
      }
    })),

    safety: {
      read_only: true,
      sends_replies: false,
      creates_tickets: false,
      changes_sla: false,
      triggers_escalation: false,
      requires_confirmation_for_actions: true
    }
  };
}

module.exports = {
  createCustomerOperationsReadinessSnapshot
};

# PHASE 3AH.4 — Runtime Contract Evidence

## Customer operations runtime
'use strict';

const conversationStore = require('./conversations/store/conversation-store');
const ticketStore = require('./tickets/store/ticket-store');

const messageStore = require('./conversations/messages/message-store');

const customerProfileStore = require('./customers/store/customer-profile-store');

const slaPolicyStore = require('./sla/store/sla-policy-store');

const escalationStore = require('./escalation/store/escalation-store');

const unifiedInboxStore = require('./unified-inbox/store/unified-inbox-store');

const {
  createIntegrationInboxSeed
} = require('./unified-inbox/register-integration-inbox');






const {
  registerDefaultChannels
} = require('./channels/registry/default-channels');

const {
  listChannels
} = require('./channels/registry/channel-registry-store');


const {
  registerIntegrationChannel
} = require('./channels/register-integration-channel');


const {
  createCustomerOperationsReadinessSnapshot
} = require('./readiness/customer-operations-readiness-snapshot');

function createCustomerOperationsRuntime() {
  registerDefaultChannels();


  const runtime = {
    conversations: {
      create: conversationStore.createConversation,
      get: conversationStore.getConversation,
      list: conversationStore.listConversations,
      update: conversationStore.updateConversation
    },







    unifiedInbox: {
      create: unifiedInboxStore.createInboxEntry,
      get: unifiedInboxStore.getInboxEntry,
      list: unifiedInboxStore.listInboxEntries,
      update: unifiedInboxStore.updateInboxEntry,
      createFromIntegration: createIntegrationInboxSeed
    },

    escalation: {
      create: escalationStore.createEscalation,
      get: escalationStore.getEscalation,
      list: escalationStore.listEscalations,
      update: escalationStore.updateEscalation
    },

    sla: {
      create: slaPolicyStore.createSlaPolicy,
      get: slaPolicyStore.getSlaPolicy,
      list: slaPolicyStore.listSlaPolicies,
      update: slaPolicyStore.updateSlaPolicy
    },

    customers: {
      create: customerProfileStore.createCustomerProfile,
      get: customerProfileStore.getCustomerProfile,
      list: customerProfileStore.listCustomerProfiles,
      update: customerProfileStore.updateCustomerProfile
    },

    messages: {
      create: messageStore.createMessage,
      get: messageStore.getMessage,
      list: messageStore.listMessages,
      listByConversation:
        messageStore.listConversationMessages
    },

    channels: {
      list: listChannels,
      registerIntegration: registerIntegrationChannel
    },

    tickets: {
      create: ticketStore.createTicket,
      get: ticketStore.getTicket,
      list: ticketStore.listTickets,
      update: ticketStore.updateTicket
    },

    readiness: {
      snapshot: () => createCustomerOperationsReadinessSnapshot(runtime)
    },

    health() {
      return {
        runtime: 'mh-os-customer-operations',
        status: 'ready',
        capabilities: {
          conversations: true,
          tickets: true,
          channels: true,
          integration_bridge: true,
          messages: true,
          customers: true,
          sla: true,
          escalation: true,
          unified_inbox: true,
          integration_inbox_bridge: true,
          voice: false,
          ivr: false,
          outreach: false,
          crm: false
        }
      };
    }
  };

  return runtime;
}

module.exports = {
  createCustomerOperationsRuntime
};

## Readiness snapshot
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

## Contracts

### runtime/orchestrator-service/lib/customer-operations/contracts/unified-inbox-contract.js
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

### runtime/orchestrator-service/lib/customer-operations/contracts/conversation-contract.js
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

### runtime/orchestrator-service/lib/customer-operations/contracts/message-contract.js
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

### runtime/orchestrator-service/lib/customer-operations/contracts/customer-profile-contract.js
'use strict';

function createCustomerProfileContract(input = {}) {
  return {
    customer_id: String(input.customer_id || ''),

    profile: {
      display_name: String(input.profile?.display_name || ''),
      email: String(input.profile?.email || ''),
      phone: String(input.profile?.phone || ''),
      company: String(input.profile?.company || ''),
      language: String(input.profile?.language || 'en')
    },

    channels: {
      instagram: String(input.channels?.instagram || ''),
      whatsapp: String(input.channels?.whatsapp || ''),
      telegram: String(input.channels?.telegram || '')
    },

    segmentation: {
      type: String(input.segmentation?.type || 'lead'),
      score: Number(input.segmentation?.score || 0),
      tags: Array.isArray(input.segmentation?.tags)
        ? input.segmentation.tags
        : []
    },

    crm: {
      owner: String(input.crm?.owner || ''),
      stage: String(input.crm?.stage || 'new'),
      source: String(input.crm?.source || '')
    },

    ai: {
      summary: String(input.ai?.summary || ''),
      sentiment: String(input.ai?.sentiment || 'neutral')
    },

    metadata: {
      created_at:
        input.metadata?.created_at || new Date().toISOString(),
      source_runtime: 'mh-os-customer-operations'
    }
  };
}

module.exports = {
  createCustomerProfileContract
};

### runtime/orchestrator-service/lib/customer-operations/contracts/ticket-contract.js
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

### runtime/orchestrator-service/lib/customer-operations/contracts/escalation-contract.js
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

### runtime/orchestrator-service/lib/customer-operations/contracts/sla-policy-contract.js
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

## Stores

### runtime/orchestrator-service/lib/customer-operations/unified-inbox/store/unified-inbox-store.js
'use strict';

const {
  createUnifiedInboxContract
} = require('../../contracts/unified-inbox-contract');

const inboxEntries = new Map();

function createInboxEntry(input = {}) {
  const entry = createUnifiedInboxContract(input);

  if (!entry.inbox_id) {
    throw new Error('inbox_id is required');
  }

  inboxEntries.set(entry.inbox_id, entry);

  return entry;
}

function getInboxEntry(inboxId) {
  return inboxEntries.get(String(inboxId || '')) || null;
}

function listInboxEntries() {
  return Array.from(inboxEntries.values());
}

function updateInboxEntry(inboxId, updates = {}) {
  const current = getInboxEntry(inboxId);

  if (!current) {
    return null;
  }

  const updated = {
    ...current,
    ...updates,
    metadata: {
      ...current.metadata,
      updated_at: new Date().toISOString()
    }
  };

  inboxEntries.set(current.inbox_id, updated);

  return updated;
}

module.exports = {
  createInboxEntry,
  getInboxEntry,
  listInboxEntries,
  updateInboxEntry
};

### runtime/orchestrator-service/lib/customer-operations/conversations/store/conversation-store.js
'use strict';

const {
  createConversationContract
} = require('../../contracts/conversation-contract');

const conversations = new Map();

function createConversation(input = {}) {
  const conversation = createConversationContract(input);

  if (!conversation.conversation_id) {
    throw new Error('conversation_id is required');
  }

  conversations.set(conversation.conversation_id, conversation);

  return conversation;
}

function getConversation(conversationId) {
  return conversations.get(String(conversationId || '')) || null;
}

function listConversations() {
  return Array.from(conversations.values());
}

function updateConversation(conversationId, updates = {}) {
  const current = getConversation(conversationId);

  if (!current) {
    return null;
  }

  const updated = {
    ...current,
    ...updates,
    metadata: {
      ...current.metadata,
      updated_at: new Date().toISOString()
    }
  };

  conversations.set(current.conversation_id, updated);

  return updated;
}

module.exports = {
  createConversation,
  getConversation,
  listConversations,
  updateConversation
};

### runtime/orchestrator-service/lib/customer-operations/conversations/messages/message-store.js
'use strict';

const {
  createMessageContract
} = require('../../contracts/message-contract');

const messages = new Map();

function createMessage(input = {}) {
  const message = createMessageContract(input);

  if (!message.message_id) {
    throw new Error('message_id is required');
  }

  messages.set(message.message_id, message);

  return message;
}

function getMessage(messageId) {
  return messages.get(String(messageId || '')) || null;
}

function listMessages() {
  return Array.from(messages.values());
}

function listConversationMessages(conversationId) {
  const id = String(conversationId || '');

  return listMessages().filter(
    (message) => message.conversation_id === id
  );
}

module.exports = {
  createMessage,
  getMessage,
  listMessages,
  listConversationMessages
};

### runtime/orchestrator-service/lib/customer-operations/customers/store/customer-profile-store.js
'use strict';

const {
  createCustomerProfileContract
} = require('../../contracts/customer-profile-contract');

const customers = new Map();

function createCustomerProfile(input = {}) {
  const profile = createCustomerProfileContract(input);

  if (!profile.customer_id) {
    throw new Error('customer_id is required');
  }

  customers.set(profile.customer_id, profile);

  return profile;
}

function getCustomerProfile(customerId) {
  return customers.get(String(customerId || '')) || null;
}

function listCustomerProfiles() {
  return Array.from(customers.values());
}

function updateCustomerProfile(customerId, updates = {}) {
  const current = getCustomerProfile(customerId);

  if (!current) {
    return null;
  }

  const updated = {
    ...current,
    ...updates,
    metadata: {
      ...current.metadata,
      updated_at: new Date().toISOString()
    }
  };

  customers.set(current.customer_id, updated);

  return updated;
}

module.exports = {
  createCustomerProfile,
  getCustomerProfile,
  listCustomerProfiles,
  updateCustomerProfile
};

### runtime/orchestrator-service/lib/customer-operations/tickets/store/ticket-store.js
'use strict';

const {
  createTicketContract
} = require('../../contracts/ticket-contract');

const tickets = new Map();

function createTicket(input = {}) {
  const ticket = createTicketContract(input);

  if (!ticket.ticket_id) {
    throw new Error('ticket_id is required');
  }

  tickets.set(ticket.ticket_id, ticket);

  return ticket;
}

function getTicket(ticketId) {
  return tickets.get(String(ticketId || '')) || null;
}

function listTickets() {
  return Array.from(tickets.values());
}

function updateTicket(ticketId, updates = {}) {
  const current = getTicket(ticketId);

  if (!current) {
    return null;
  }

  const updated = {
    ...current,
    ...updates,
    metadata: {
      ...current.metadata,
      updated_at: new Date().toISOString()
    }
  };

  tickets.set(current.ticket_id, updated);

  return updated;
}

module.exports = {
  createTicket,
  getTicket,
  listTickets,
  updateTicket
};

### runtime/orchestrator-service/lib/customer-operations/escalation/store/escalation-store.js
'use strict';

const {
  createEscalationContract
} = require('../../contracts/escalation-contract');

const escalations = new Map();

function createEscalation(input = {}) {
  const escalation = createEscalationContract(input);

  if (!escalation.escalation_id) {
    throw new Error('escalation_id is required');
  }

  escalations.set(escalation.escalation_id, escalation);

  return escalation;
}

function getEscalation(escalationId) {
  return escalations.get(String(escalationId || '')) || null;
}

function listEscalations() {
  return Array.from(escalations.values());
}

function updateEscalation(escalationId, updates = {}) {
  const current = getEscalation(escalationId);

  if (!current) {
    return null;
  }

  const updated = {
    ...current,
    ...updates,
    metadata: {
      ...current.metadata,
      updated_at: new Date().toISOString()
    }
  };

  escalations.set(current.escalation_id, updated);

  return updated;
}

module.exports = {
  createEscalation,
  getEscalation,
  listEscalations,
  updateEscalation
};

### runtime/orchestrator-service/lib/customer-operations/sla/store/sla-policy-store.js
'use strict';

const {
  createSlaPolicyContract
} = require('../../contracts/sla-policy-contract');

const policies = new Map();

function createSlaPolicy(input = {}) {
  const policy = createSlaPolicyContract(input);

  if (!policy.policy_id) {
    throw new Error('policy_id is required');
  }

  policies.set(policy.policy_id, policy);

  return policy;
}

function getSlaPolicy(policyId) {
  return policies.get(String(policyId || '')) || null;
}

function listSlaPolicies() {
  return Array.from(policies.values());
}

function updateSlaPolicy(policyId, updates = {}) {
  const current = getSlaPolicy(policyId);

  if (!current) {
    return null;
  }

  const updated = {
    ...current,
    ...updates,
    metadata: {
      ...current.metadata,
      updated_at: new Date().toISOString()
    }
  };

  policies.set(current.policy_id, updated);

  return updated;
}

module.exports = {
  createSlaPolicy,
  getSlaPolicy,
  listSlaPolicies,
  updateSlaPolicy
};

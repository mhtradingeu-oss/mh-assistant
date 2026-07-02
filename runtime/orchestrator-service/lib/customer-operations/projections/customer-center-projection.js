function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asString(value) {
  return value == null ? '' : String(value);
}

function truncate(value, max = 180) {
  const text = asString(value).replace(/\s+/g, ' ').trim();
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function maskIdentifier(value, fallback = 'customer') {
  const text = asString(value).trim();
  if (!text) return fallback;
  if (text.includes('@')) {
    const [name, domain] = text.split('@');
    return `${name.slice(0, 2) || 'cu'}***@${domain || 'masked'}`;
  }
  if (text.length <= 4) return `${text[0] || 'c'}***`;
  return `${text.slice(0, 3)}***${text.slice(-2)}`;
}

function safeList(fn) {
  try {
    return typeof fn === 'function' ? asArray(fn()) : [];
  } catch {
    return [];
  }
}

function getRuntimeCapabilities(runtime = {}) {
  const health = typeof runtime.health?.snapshot === 'function' ? runtime.health.snapshot() : {};
  return health.capabilities || {};
}

function projectCustomerReadiness(runtime = {}) {
  const health = typeof runtime.health?.snapshot === 'function' ? runtime.health.snapshot() : {};
  const capabilities = health.capabilities || {};
  const summary = health.summary || {};
  const provider = health.provider_readiness || {};

  return {
    runtime: 'mh-os-customer-operations',
    runtime_ready: Boolean(capabilities.conversations || capabilities.unified_inbox),
    inbox_ready: Boolean(capabilities.unified_inbox),
    conversations_ready: Boolean(capabilities.conversations),
    messages_ready: Boolean(capabilities.messages),
    tickets_ready: Boolean(capabilities.tickets),
    customers_ready: Boolean(capabilities.customers),
    escalation_ready: Boolean(capabilities.escalations),
    sla_ready: Boolean(capabilities.sla_policies),
    integration_inbox_bridge_ready: Boolean(capabilities.integration_inbox_bridge),
    voice_ready: Boolean(provider.voice || capabilities.voice),
    ivr_ready: Boolean(provider.ivr || capabilities.ivr),
    crm_ready: Boolean(provider.crm || capabilities.crm),
    external_send_ready: false,
    summary,
    blockers: [
      ...(provider.voice || capabilities.voice ? [] : ['Voice provider execution is not ready.']),
      ...(provider.ivr || capabilities.ivr ? [] : ['IVR provider execution is not ready.']),
      ...(provider.crm || capabilities.crm ? [] : ['CRM provider execution is not ready.']),
      'External send is locked for Customer Center v1.'
    ],
    warnings: [
      'Customer Center read model is preview-first and read-only.',
      'Customer messages may be truncated or masked for privacy.'
    ]
  };
}

function projectInboxEntry(entry = {}) {
  const conversation = entry.conversation || {};
  const channel = entry.channel || {};
  const state = entry.state || {};
  const assignment = entry.assignment || {};
  const lastMessage = entry.last_message || entry.message || {};

  return {
    inbox_id: asString(entry.inbox_id || entry.id),
    channel: {
      channel_id: asString(channel.channel_id || entry.channel_id || conversation.channel || 'unknown'),
      provider: asString(channel.provider || ''),
      type: asString(channel.type || '')
    },
    conversation_id: asString(conversation.conversation_id || entry.conversation_id),
    customer_label: maskIdentifier(conversation.customer_id || entry.customer_id || 'customer'),
    masked_customer_id: maskIdentifier(conversation.customer_id || entry.customer_id || ''),
    priority: asString(state.priority || entry.priority || 'normal'),
    status: asString(state.status || entry.status || 'open'),
    assignment: {
      assigned_team: asString(assignment.assigned_team || 'customer-care'),
      assigned_ai_agent: asString(assignment.assigned_ai_agent || '')
    },
    last_message_preview: truncate(lastMessage.body || lastMessage.message || entry.last_message_preview || ''),
    last_message_at: asString(lastMessage.created_at || entry.last_message_at || conversation.last_message_at || ''),
    sla_status: asString(entry.sla_status || state.sla_status || 'unknown'),
    unread_count: Number(entry.unread_count || 0),
    sensitive_data_flag: Boolean(entry.sensitive_data_flag),
    privacy_flags: ['customer_identity_masked', 'message_preview_truncated']
  };
}

function projectInboxEntries(runtime = {}) {
  return safeList(runtime.unifiedInbox?.list).map(projectInboxEntry);
}

function projectConversation(conversation = {}, runtime = {}) {
  const messages = safeList(runtime.messages?.listByConversation?.bind(null, conversation.conversation_id));
  const tickets = safeList(runtime.tickets?.list).filter((ticket) => ticket.conversation_id === conversation.conversation_id);

  return {
    conversation_id: asString(conversation.conversation_id),
    customer_label: maskIdentifier(conversation.customer_id || 'customer'),
    masked_customer_id: maskIdentifier(conversation.customer_id || ''),
    channel: asString(conversation.channel || conversation.channel_id || 'unknown'),
    status: asString(conversation.status || 'open'),
    priority: asString(conversation.priority || 'normal'),
    assigned_team: asString(conversation.assigned_team || 'customer-care'),
    assigned_ai_agent: asString(conversation.assigned_ai_agent || ''),
    last_message_at: asString(conversation.last_message_at || ''),
    message_count: messages.length,
    ticket_count: tickets.length,
    escalation_state: tickets.some((ticket) => ticket.escalation_state) ? 'active' : 'none',
    privacy_flags: ['customer_identity_masked']
  };
}

function projectConversations(runtime = {}) {
  return safeList(runtime.conversations?.list).map((conversation) => projectConversation(conversation, runtime));
}

function projectConversationMessages(runtime = {}, conversationId = '') {
  return safeList(runtime.messages?.listByConversation?.bind(null, conversationId)).map((message) => ({
    message_id: asString(message.message_id),
    conversation_id: asString(message.conversation_id),
    channel_id: asString(message.channel_id || ''),
    sender_type: asString(message.sender?.type || message.sender_type || 'unknown'),
    sender_label: asString(message.sender?.type || message.sender_label || 'participant'),
    body_preview: truncate(message.body || message.message || ''),
    timestamp: asString(message.created_at || message.timestamp || ''),
    direction: asString(message.direction || ''),
    safety_labels: asArray(message.safety_labels),
    sensitive_data_flag: Boolean(message.sensitive_data_flag),
    privacy_flags: ['message_preview_truncated']
  }));
}

function projectCustomerProfile(profile = {}) {
  const profileData = profile.profile || {};
  const channels = profile.channels || {};
  const crm = profile.crm || {};

  return {
    customer_id: asString(profile.customer_id),
    display_label: maskIdentifier(profileData.email || profile.customer_id || 'customer'),
    masked_email: maskIdentifier(profileData.email || ''),
    channel_handles_masked: {
      instagram: maskIdentifier(channels.instagram || ''),
      whatsapp: maskIdentifier(channels.whatsapp || '')
    },
    crm_stage_internal_only: asString(crm.stage || ''),
    recent_issue_summary: truncate(profile.recent_issue_summary || ''),
    sentiment_summary: truncate(profile.sentiment_summary || ''),
    lifetime_context_summary: truncate(profile.lifetime_context_summary || ''),
    privacy_flags: ['customer_profile_masked']
  };
}

function projectConversationDetail(runtime = {}, conversationId = '') {
  const conversation = typeof runtime.conversations?.get === 'function' ? runtime.conversations.get(conversationId) : null;
  if (!conversation) return null;

  const messages = projectConversationMessages(runtime, conversationId);
  const customer = typeof runtime.customers?.get === 'function' ? runtime.customers.get(conversation.customer_id) : null;
  const tickets = safeList(runtime.tickets?.list).filter((ticket) => ticket.conversation_id === conversationId);

  return {
    conversation: projectConversation(conversation, runtime),
    messages,
    customer: customer ? projectCustomerProfile(customer) : null,
    tickets: tickets.map(projectTicket),
    escalation_summary: tickets.some((ticket) => ticket.escalation_state) ? 'Escalation active' : 'No escalation recorded',
    privacy_flags: ['customer_identity_masked', 'message_preview_truncated']
  };
}

function projectTickets(runtime = {}) {
  return safeList(runtime.tickets?.list).map(projectTicket);
}

function projectTicket(ticket = {}) {
  return {
    ticket_id: asString(ticket.ticket_id),
    conversation_id: asString(ticket.conversation_id),
    customer_label: maskIdentifier(ticket.customer_id || 'customer'),
    type: asString(ticket.type || 'support'),
    status: asString(ticket.status || 'open'),
    priority: asString(ticket.priority || 'normal'),
    assigned_team: asString(ticket.assigned_team || 'customer-care'),
    sla_status: asString(ticket.sla_status || 'unknown'),
    escalation_state: asString(ticket.escalation_state || ''),
    created_at: asString(ticket.created_at || ''),
    updated_at: asString(ticket.updated_at || ''),
    privacy_flags: ['customer_identity_masked']
  };
}

function projectCustomerProfileById(runtime = {}, customerId = '') {
  const profile = typeof runtime.customers?.get === 'function' ? runtime.customers.get(customerId) : null;
  return profile ? projectCustomerProfile(profile) : null;
}

function projectChannels(runtime = {}) {
  const capabilities = getRuntimeCapabilities(runtime);
  const channels = safeList(runtime.channels?.list);
  const fallbackChannels = channels.length ? channels : [
    { channel_id: 'email', provider: 'email', type: 'email' },
    { channel_id: 'instagram', provider: 'meta', type: 'social' },
    { channel_id: 'whatsapp', provider: 'meta', type: 'messaging' },
    { channel_id: 'voice', provider: 'not-configured', type: 'voice' },
    { channel_id: 'crm', provider: 'not-configured', type: 'crm' }
  ];

  return fallbackChannels.map((channel) => ({
    channel_id: asString(channel.channel_id || channel.id),
    provider: asString(channel.provider || ''),
    type: asString(channel.type || ''),
    read_ready: Boolean(capabilities.integration_inbox_bridge || capabilities.unified_inbox),
    draft_ready: true,
    external_send_ready: false,
    voice_ready: Boolean(channel.capabilities?.voice || capabilities.voice),
    ivr_ready: Boolean(channel.capabilities?.ivr || capabilities.ivr),
    crm_sync_ready: Boolean(channel.capabilities?.crm || capabilities.crm),
    backend_supported: Boolean(capabilities.integration_inbox_bridge || capabilities.unified_inbox),
    blocked_reason: 'External send, voice, IVR, and CRM mutation are locked for Customer Center v1.'
  }));
}

module.exports = {
  projectCustomerReadiness,
  projectInboxEntries,
  projectConversations,
  projectConversationDetail,
  projectConversationMessages,
  projectCustomerProfileById,
  projectTickets,
  projectChannels
};

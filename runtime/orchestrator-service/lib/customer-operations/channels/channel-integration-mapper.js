'use strict';

function asString(value) {
  return String(value == null ? '' : value).trim();
}

const CHANNEL_MAP = {
  website: {
    channel_id: 'website-chat',
    provider: 'internal',
    type: 'messaging',
    capabilities: {
      messaging: true,
      attachments: true,
      voice: false,
      realtime: true
    }
  },

  instagram: {
    channel_id: 'instagram',
    provider: 'meta',
    type: 'messaging',
    capabilities: {
      messaging: true,
      attachments: true,
      voice: false,
      realtime: false
    }
  },

  facebook: {
    channel_id: 'facebook',
    provider: 'meta',
    type: 'messaging',
    capabilities: {
      messaging: true,
      attachments: true,
      voice: false,
      realtime: false
    }
  },

  mailchimp: {
    channel_id: 'email',
    provider: 'mailchimp',
    type: 'email',
    capabilities: {
      messaging: true,
      attachments: true,
      voice: false,
      realtime: false
    }
  },

  smtp: {
    channel_id: 'email',
    provider: 'smtp',
    type: 'email',
    capabilities: {
      messaging: true,
      attachments: true,
      voice: false,
      realtime: false
    }
  },

  telegram: {
    channel_id: 'telegram',
    provider: 'telegram',
    type: 'messaging',
    capabilities: {
      messaging: true,
      attachments: true,
      voice: false,
      realtime: true
    }
  },

  webhook: {
    channel_id: 'webhook',
    provider: 'webhook',
    type: 'event',
    capabilities: {
      messaging: true,
      attachments: false,
      voice: false,
      realtime: true
    }
  }
};

function normalizeIntegrationId(integrationId) {
  return asString(integrationId).toLowerCase().replace(/_/g, '-');
}

function getChannelDefinitionForIntegration(integrationId, providerResult = {}) {
  const id = normalizeIntegrationId(integrationId);
  const normalizedProvider = asString(
    providerResult.normalized?.provider ||
    providerResult.provider ||
    id
  ).toLowerCase();

  const direct = CHANNEL_MAP[id];
  const byProvider = CHANNEL_MAP[normalizedProvider];

  const base = direct || byProvider;

  if (!base) {
    return null;
  }

  return {
    ...base,
    integration_id: id,
    source_provider: normalizedProvider,
    enabled: asString(providerResult.status || 'connected') !== 'disabled',
    customer_operations: {
      supports_inbox: Boolean(base.capabilities.messaging),
      supports_messages: Boolean(base.capabilities.messaging),
      supports_leads: ['instagram', 'facebook', 'website', 'telegram'].includes(base.channel_id),
      supports_outreach: ['email', 'instagram', 'telegram'].includes(base.channel_id),
      supports_voice: Boolean(base.capabilities.voice)
    },
    metadata: {
      mapped_at: new Date().toISOString(),
      source_runtime: 'mh-os-customer-operations'
    }
  };
}

function listMappableIntegrationIds() {
  return Object.keys(CHANNEL_MAP).sort();
}

module.exports = {
  getChannelDefinitionForIntegration,
  listMappableIntegrationIds
};

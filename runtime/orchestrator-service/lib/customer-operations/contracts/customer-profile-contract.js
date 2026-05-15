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

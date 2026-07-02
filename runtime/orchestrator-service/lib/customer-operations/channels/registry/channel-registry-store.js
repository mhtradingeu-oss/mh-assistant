'use strict';

const channels = new Map();

function registerChannel(input = {}) {
  const channelId = String(input.channel_id || '');

  if (!channelId) {
    throw new Error('channel_id is required');
  }

  const channel = {
    channel_id: channelId,
    type: String(input.type || 'messaging'),
    provider: String(input.provider || ''),
    enabled: Boolean(input.enabled),

    capabilities: {
      messaging: Boolean(input.capabilities?.messaging),
      attachments: Boolean(input.capabilities?.attachments),
      voice: Boolean(input.capabilities?.voice),
      realtime: Boolean(input.capabilities?.realtime)
    },

    metadata: {
      registered_at: new Date().toISOString(),
      source_runtime: 'mh-os-customer-operations'
    }
  };

  channels.set(channel.channel_id, channel);

  return channel;
}

function getChannel(channelId) {
  return channels.get(String(channelId || '')) || null;
}

function listChannels() {
  return Array.from(channels.values());
}

module.exports = {
  registerChannel,
  getChannel,
  listChannels
};

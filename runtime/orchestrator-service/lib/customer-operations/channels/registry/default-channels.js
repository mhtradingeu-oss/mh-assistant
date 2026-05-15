'use strict';

const {
  registerChannel
} = require('./channel-registry-store');

function registerDefaultChannels() {
  registerChannel({
    channel_id: 'website-chat',
    provider: 'internal',
    enabled: true,
    capabilities: {
      messaging: true,
      attachments: true,
      realtime: true
    }
  });

  registerChannel({
    channel_id: 'email',
    provider: 'smtp',
    enabled: true,
    capabilities: {
      messaging: true,
      attachments: true
    }
  });

  registerChannel({
    channel_id: 'instagram',
    provider: 'meta',
    enabled: false,
    capabilities: {
      messaging: true,
      attachments: true
    }
  });

  registerChannel({
    channel_id: 'voice',
    provider: 'ivr',
    enabled: false,
    capabilities: {
      voice: true,
      realtime: true
    }
  });
}

module.exports = {
  registerDefaultChannels
};

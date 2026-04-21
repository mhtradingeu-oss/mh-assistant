const { decodeJwtExpiry, requestJson, buildProviderError, buildResponseError } = require('../http-client');
const { requireFields, buildResult, asArray } = require('../provider-utils');

async function connectSlack(ctx) {
  requireFields(ctx.credentials, ['botToken'], 'credentials');
  const response = await requestJson({
    method: 'POST',
    url: 'https://slack.com/api/auth.test',
    headers: {
      Authorization: `Bearer ${ctx.credentials.botToken}`
    }
  });
  const error = buildResponseError('slack', response, 'Slack auth test failed');
  if (error) {
    throw Object.assign(new Error(error.message), error);
  }
  if (!response.data?.ok) {
    throw new Error(response.data?.error || 'Slack auth test failed');
  }

  return buildResult({
    status: 'connected',
    metadata: response.data,
    health: 'Slack bot token validated successfully.',
    normalized: {
      scope: 'automation',
      provider: 'slack',
      workspace: {
        team: response.data.team,
        team_id: response.data.team_id,
        user_id: response.data.user_id
      }
    },
    notes: 'Connected through Slack auth.test.',
    permissionScope: 'Slack workspace bot access',
    dataScopes: ['insights'],
    readScopes: ['notifications'],
    writeScopes: ['automation triggers'],
    connectionMethod: 'oauth_or_key',
    account: {
      id: response.data.team_id,
      name: response.data.team
    }
  });
}

async function connectTelegram(ctx) {
  requireFields(ctx.credentials, ['botToken'], 'credentials');
  const response = await requestJson({
    method: 'GET',
    url: `https://api.telegram.org/bot${ctx.credentials.botToken}/getMe`
  });
  const error = buildResponseError('telegram', response, 'Telegram bot lookup failed');
  if (error) {
    throw Object.assign(new Error(error.message), error);
  }
  if (!response.data?.ok) {
    throw new Error('Telegram bot lookup failed');
  }

  return buildResult({
    status: 'connected',
    metadata: response.data.result,
    health: 'Telegram bot token validated successfully.',
    normalized: {
      scope: 'automation',
      provider: 'telegram',
      bot: response.data.result
    },
    notes: 'Connected through Telegram Bot API.',
    permissionScope: 'Telegram bot API access',
    dataScopes: ['insights'],
    readScopes: ['notifications'],
    writeScopes: ['automation triggers'],
    connectionMethod: 'oauth_or_key',
    account: {
      id: response.data.result.id,
      name: response.data.result.username || response.data.result.first_name
    }
  });
}

async function connectNotion(ctx) {
  requireFields(ctx.credentials, ['accessToken'], 'credentials');
  const response = await requestJson({
    method: 'GET',
    url: 'https://api.notion.com/v1/users/me',
    headers: {
      Authorization: `Bearer ${ctx.credentials.accessToken}`,
      'Notion-Version': '2022-06-28'
    }
  });
  const error = buildResponseError('notion', response, 'Notion user lookup failed');
  if (error) {
    throw Object.assign(new Error(error.message), error);
  }

  return buildResult({
    status: 'connected',
    metadata: response.data,
    health: 'Notion integration token validated successfully.',
    normalized: {
      scope: 'automation',
      provider: 'notion',
      bot: response.data.bot || {},
      owner: response.data.owner || {}
    },
    notes: 'Connected through the Notion API.',
    tokenExpiresAt: decodeJwtExpiry(ctx.credentials.accessToken),
    permissionScope: 'Notion integration access',
    dataScopes: ['insights'],
    readScopes: ['docs'],
    writeScopes: ['automation triggers'],
    connectionMethod: 'oauth_or_key',
    account: {
      id: response.data.bot?.id || ctx.config.workspaceName,
      name: ctx.config.workspaceName || 'Notion workspace'
    }
  });
}

async function connectWebhookLike(ctx) {
  const url = ctx.config.endpointUrl || ctx.config.webhookUrl;
  requireFields({ url }, ['url']);
  const response = await requestJson({
    method: 'GET',
    url,
    headers: ctx.credentials.accessToken
      ? {
          Authorization: `Bearer ${ctx.credentials.accessToken}`
        }
      : {}
  });

  const error = buildResponseError(ctx.integrationId, response, 'Endpoint test failed');
  if (error) {
    throw Object.assign(new Error(error.message), error);
  }

  return buildResult({
    status: 'connected',
    metadata: {
      url,
      status_code: response.status
    },
    health: 'Endpoint responded successfully.',
    normalized: {
      scope: 'automation',
      provider: ctx.integrationId,
      endpoint: {
        url,
        status_code: response.status
      }
    },
    notes: 'Validated the configured endpoint directly.',
    tokenExpiresAt: decodeJwtExpiry(ctx.credentials.accessToken),
    permissionScope: 'Endpoint availability',
    dataScopes: ['insights'],
    readScopes: ['events'],
    writeScopes: ['automation triggers'],
    connectionMethod: ctx.credentials.accessToken ? 'oauth_or_key' : 'direct_config',
    account: {
      id: url,
      name: url
    }
  });
}

async function connectCustomAnalytics(ctx) {
  const url = ctx.config.endpointUrl;
  requireFields({ url }, ['url']);
  const response = await requestJson({
    method: 'GET',
    url,
    headers: ctx.credentials.accessToken
      ? {
          Authorization: `Bearer ${ctx.credentials.accessToken}`
        }
      : {}
  });
  const error = buildResponseError('custom-analytics', response, 'Custom analytics endpoint failed');
  if (error) {
    throw Object.assign(new Error(error.message), error);
  }

  return buildResult({
    status: 'connected',
    metadata: {
      endpoint_url: url,
      status_code: response.status
    },
    health: 'Custom analytics endpoint responded successfully.',
    normalized: {
      scope: 'website_analytics',
      provider: 'custom_analytics',
      endpoint: {
        url,
        status_code: response.status
      }
    },
    notes: 'Connected through the configured analytics endpoint.',
    tokenExpiresAt: decodeJwtExpiry(ctx.credentials.accessToken),
    permissionScope: 'Custom analytics endpoint access',
    dataScopes: ['traffic'],
    readScopes: ['traffic', 'events', 'conversions'],
    writeScopes: [],
    connectionMethod: ctx.credentials.accessToken ? 'oauth_or_key' : 'direct_config',
    account: {
      id: url,
      name: url
    }
  });
}

async function connectLinkedIn(ctx) {
  requireFields(ctx.credentials, ['accessToken'], 'credentials');
  const response = await requestJson({
    method: 'GET',
    url: 'https://api.linkedin.com/v2/me',
    headers: {
      Authorization: `Bearer ${ctx.credentials.accessToken}`
    }
  });
  const error = buildResponseError('linkedin', response, 'LinkedIn profile lookup failed');
  if (error) {
    throw Object.assign(new Error(error.message), error);
  }

  return buildResult({
    status: 'connected',
    metadata: response.data,
    health: 'LinkedIn profile access validated successfully.',
    normalized: {
      scope: 'social_insights',
      provider: 'linkedin',
      profile: response.data
    },
    notes: 'Connected through the LinkedIn API.',
    tokenExpiresAt: decodeJwtExpiry(ctx.credentials.accessToken),
    permissionScope: 'LinkedIn OAuth access',
    dataScopes: ['posts', 'insights'],
    readScopes: ['posts', 'insights'],
    writeScopes: ['publishing'],
    connectionMethod: 'oauth_or_key',
    account: {
      id: response.data.id,
      name: ctx.config.companyUrl || response.data.id
    }
  });
}

async function connectMailchimp(ctx) {
  requireFields(ctx.credentials, ['apiKey'], 'credentials');
  const serverPrefix = ctx.config.serverPrefix || String(ctx.credentials.apiKey).split('-')[1];
  const response = await requestJson({
    method: 'GET',
    url: `https://${serverPrefix}.api.mailchimp.com/3.0/`,
    auth: {
      username: 'mhassistant',
      password: ctx.credentials.apiKey
    }
  });
  const error = buildResponseError('mailchimp', response, 'Mailchimp API lookup failed');
  if (error) {
    throw Object.assign(new Error(error.message), error);
  }

  return buildResult({
    status: 'connected',
    metadata: response.data,
    health: 'Mailchimp API key validated successfully.',
    normalized: {
      scope: 'email',
      provider: 'mailchimp',
      account: {
        account_name: response.data.account_name,
        email: response.data.email
      }
    },
    notes: 'Connected through the Mailchimp Marketing API.',
    permissionScope: 'Mailchimp audience and campaign access',
    dataScopes: ['insights'],
    readScopes: ['email'],
    writeScopes: ['email'],
    connectionMethod: 'api_key',
    account: {
      id: response.data.login_id || ctx.config.audienceId,
      name: response.data.account_name || ctx.config.audienceId
    }
  });
}

async function dispatch(ctx) {
  try {
    if (ctx.integrationId === 'slack') return connectSlack(ctx);
    if (ctx.integrationId === 'telegram') return connectTelegram(ctx);
    if (ctx.integrationId === 'notion') return connectNotion(ctx);
    if (ctx.integrationId === 'webhook' || ctx.integrationId === 'zapier-make') return connectWebhookLike(ctx);
    if (ctx.integrationId === 'custom-analytics') return connectCustomAnalytics(ctx);
    if (ctx.integrationId === 'linkedin') return connectLinkedIn(ctx);
    if (ctx.integrationId === 'mailchimp') return connectMailchimp(ctx);

    throw new Error(`Unsupported Ops integration: ${ctx.integrationId}`);
  } catch (error) {
    const providerError = buildProviderError(ctx.integrationId, error, `Failed to process ${ctx.integrationId}`);
    throw Object.assign(new Error(providerError.message), providerError);
  }
}

module.exports = {
  integrationIds: ['slack', 'telegram', 'notion', 'webhook', 'zapier-make', 'custom-analytics', 'linkedin', 'mailchimp'],
  connect: dispatch,
  testConnection: dispatch,
  syncCurrent: dispatch,
  importHistory: dispatch
};

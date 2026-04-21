const { decodeJwtExpiry, requestJson, buildProviderError, buildResponseError } = require('../http-client');
const { asArray, asString, requireFields, buildResult, firstNonEmpty } = require('../provider-utils');

const GRAPH_BASE = 'https://graph.facebook.com/v23.0';

async function graphGet(path, accessToken, params = {}) {
  const response = await requestJson({
    method: 'GET',
    url: `${GRAPH_BASE}/${path.replace(/^\/+/, '')}`,
    params: {
      access_token: accessToken,
      ...params
    }
  });

  const error = buildResponseError('meta', response, `Meta Graph request failed for ${path}`);
  if (error) {
    throw Object.assign(new Error(error.message), error);
  }

  return response.data;
}

async function resolvePage(accessToken, pageId, pageUrl) {
  if (pageId) {
    return graphGet(pageId, accessToken, {
      fields: 'id,name,link,fan_count,followers_count,verification_status'
    });
  }

  const pages = await graphGet('me/accounts', accessToken, {
    fields: 'id,name,link,fan_count,followers_count,instagram_business_account{id,username,name,followers_count,media_count}'
  });

  const matched = asArray(pages.data).find(item => {
    const link = asString(item.link).toLowerCase();
    return pageUrl ? link === asString(pageUrl).toLowerCase() : true;
  });

  if (!matched) {
    throw new Error('No accessible Facebook page found for the provided token');
  }

  return matched;
}

async function fetchInstagramAccount(accessToken, businessAccountId, profileUrl) {
  if (businessAccountId) {
    return graphGet(businessAccountId, accessToken, {
      fields: 'id,username,name,followers_count,media_count,profile_picture_url'
    });
  }

  const pages = await graphGet('me/accounts', accessToken, {
    fields: 'id,name,instagram_business_account{id,username,name,followers_count,media_count}'
  });

  for (const page of asArray(pages.data)) {
    const account = page.instagram_business_account;
    if (!account) {
      continue;
    }

    if (!profileUrl || profileUrl.toLowerCase().includes(String(account.username || '').toLowerCase())) {
      return account;
    }
  }

  throw new Error('No Instagram business account found for the provided token');
}

async function connectFacebook(ctx) {
  requireFields(ctx.credentials, ['accessToken'], 'credentials');
  const page = await resolvePage(
    ctx.credentials.accessToken,
    ctx.config.pageId,
    firstNonEmpty(ctx.config.pageUrl, ctx.primaryValue)
  );

  return buildResult({
    status: 'connected',
    metadata: page,
    health: 'Facebook Page access validated successfully.',
    normalized: {
      scope: 'social_insights',
      provider: 'facebook',
      page: {
        id: page.id,
        name: page.name,
        link: page.link || '',
        followers: Number(page.followers_count || page.fan_count || 0)
      }
    },
    notes: 'Connected through the Meta Graph API.',
    tokenExpiresAt: decodeJwtExpiry(ctx.credentials.accessToken),
    permissionScope: 'Page insights and publishing access',
    dataScopes: ['posts', 'insights'],
    readScopes: ['posts', 'insights'],
    writeScopes: ['publishing'],
    connectionMethod: 'oauth_or_key',
    account: {
      id: page.id,
      name: page.name
    }
  });
}

async function syncFacebook(ctx) {
  const page = await resolvePage(
    ctx.credentials.accessToken,
    ctx.config.pageId,
    firstNonEmpty(ctx.config.pageUrl, ctx.primaryValue)
  );
  const posts = await graphGet(`${page.id}/published_posts`, ctx.credentials.accessToken, {
    fields: 'id,message,created_time,permalink_url,likes.summary(true),comments.summary(true)',
    limit: 10
  });

  return buildResult({
    status: 'connected',
    metadata: {
      page_id: page.id
    },
    health: 'Facebook post data synced successfully.',
    normalized: {
      scope: 'social_insights',
      provider: 'facebook',
      posts: asArray(posts.data).map((item) => ({
        id: item.id,
        message: item.message || '',
        created_at: item.created_time,
        permalink: item.permalink_url || '',
        likes: Number(item.likes?.summary?.total_count || 0),
        comments: Number(item.comments?.summary?.total_count || 0)
      }))
    },
    notes: 'Synced recent Facebook posts and engagement counts.',
    syncSummary: {
      posts: asArray(posts.data).length
    },
    dataScopes: ['posts', 'insights'],
    readScopes: ['posts', 'insights']
  });
}

async function connectInstagram(ctx) {
  requireFields(ctx.credentials, ['accessToken'], 'credentials');
  const account = await fetchInstagramAccount(
    ctx.credentials.accessToken,
    ctx.config.businessAccountId,
    firstNonEmpty(ctx.config.profileUrl, ctx.primaryValue)
  );

  return buildResult({
    status: 'connected',
    metadata: account,
    health: 'Instagram business access validated successfully.',
    normalized: {
      scope: 'social_insights',
      provider: 'instagram',
      profile: {
        id: account.id,
        username: account.username || '',
        name: account.name || '',
        followers: Number(account.followers_count || 0),
        media_count: Number(account.media_count || 0)
      }
    },
    notes: 'Connected through the Instagram Graph API.',
    tokenExpiresAt: decodeJwtExpiry(ctx.credentials.accessToken),
    permissionScope: 'Instagram business insights and publishing access',
    dataScopes: ['posts', 'insights'],
    readScopes: ['posts', 'insights'],
    writeScopes: ['publishing'],
    connectionMethod: 'oauth_or_key',
    account: {
      id: account.id,
      name: account.username || account.name
    }
  });
}

async function syncInstagram(ctx) {
  const account = await fetchInstagramAccount(
    ctx.credentials.accessToken,
    ctx.config.businessAccountId,
    firstNonEmpty(ctx.config.profileUrl, ctx.primaryValue)
  );
  const media = await graphGet(`${account.id}/media`, ctx.credentials.accessToken, {
    fields: 'id,caption,media_type,media_product_type,permalink,timestamp,like_count,comments_count',
    limit: 10
  });

  return buildResult({
    status: 'connected',
    metadata: {
      business_account_id: account.id
    },
    health: 'Instagram media data synced successfully.',
    normalized: {
      scope: 'social_insights',
      provider: 'instagram',
      media: asArray(media.data).map((item) => ({
        id: item.id,
        caption: item.caption || '',
        media_type: item.media_type || '',
        product_type: item.media_product_type || '',
        permalink: item.permalink || '',
        timestamp: item.timestamp || '',
        likes: Number(item.like_count || 0),
        comments: Number(item.comments_count || 0)
      }))
    },
    notes: 'Synced recent Instagram media and engagement counts.',
    syncSummary: {
      media: asArray(media.data).length
    },
    dataScopes: ['posts', 'insights'],
    readScopes: ['posts', 'insights']
  });
}

async function connectMetaAds(ctx) {
  requireFields(ctx.credentials, ['accessToken'], 'credentials');
  requireFields(ctx.config, ['adAccountId']);
  const accountId = asString(ctx.config.adAccountId).startsWith('act_')
    ? asString(ctx.config.adAccountId)
    : `act_${asString(ctx.config.adAccountId)}`;
  const account = await graphGet(accountId, ctx.credentials.accessToken, {
    fields: 'id,name,account_status,currency,timezone_name,business{name,id}'
  });

  return buildResult({
    status: 'connected',
    metadata: account,
    health: 'Meta Ads account access validated successfully.',
    normalized: {
      scope: 'ads',
      provider: 'meta_ads',
      account
    },
    notes: 'Connected through the Meta Marketing API.',
    tokenExpiresAt: decodeJwtExpiry(ctx.credentials.accessToken),
    permissionScope: 'Meta Ads account access',
    dataScopes: ['ads'],
    readScopes: ['ads', 'campaigns', 'insights'],
    writeScopes: ['ads updates'],
    connectionMethod: 'oauth_or_key',
    account: {
      id: account.id,
      name: account.name
    }
  });
}

async function syncMetaAds(ctx) {
  const accountId = asString(ctx.config.adAccountId).startsWith('act_')
    ? asString(ctx.config.adAccountId)
    : `act_${asString(ctx.config.adAccountId)}`;
  const insights = await graphGet(`${accountId}/insights`, ctx.credentials.accessToken, {
    fields: 'campaign_name,spend,impressions,clicks,cpc,ctr',
    date_preset: 'last_30d',
    limit: 25
  });

  return buildResult({
    status: 'connected',
    metadata: {
      ad_account_id: accountId
    },
    health: 'Meta Ads insights synced successfully.',
    normalized: {
      scope: 'ads',
      provider: 'meta_ads',
      campaigns: asArray(insights.data).map((item) => ({
        campaign_name: item.campaign_name || '',
        spend: Number(item.spend || 0),
        impressions: Number(item.impressions || 0),
        clicks: Number(item.clicks || 0),
        cpc: Number(item.cpc || 0),
        ctr: Number(item.ctr || 0)
      }))
    },
    notes: 'Synced Meta Ads campaign metrics.',
    syncSummary: {
      campaigns: asArray(insights.data).length
    },
    dataScopes: ['ads'],
    readScopes: ['ads', 'campaigns', 'insights']
  });
}

async function connectMetaPixel(ctx) {
  requireFields(ctx.credentials, ['accessToken'], 'credentials');
  requireFields(ctx.config, ['pixelId']);
  const pixel = await graphGet(ctx.config.pixelId, ctx.credentials.accessToken, {
    fields: 'id,name,creation_time,last_fired_time'
  });

  return buildResult({
    status: 'connected',
    metadata: pixel,
    health: 'Meta Pixel access validated successfully.',
    normalized: {
      scope: 'website_analytics',
      provider: 'meta_pixel',
      pixel
    },
    notes: 'Connected through the Meta Pixel API surface.',
    tokenExpiresAt: decodeJwtExpiry(ctx.credentials.accessToken),
    permissionScope: 'Meta Pixel business access',
    dataScopes: ['traffic', 'ads'],
    readScopes: ['events', 'conversions', 'ads'],
    writeScopes: ['tracking updates'],
    connectionMethod: 'oauth_or_key',
    account: {
      id: pixel.id,
      name: pixel.name || pixel.id
    }
  });
}

async function dispatch(ctx, type) {
  try {
    if (ctx.integrationId === 'facebook') {
      return type === 'sync' || type === 'import' ? syncFacebook(ctx) : connectFacebook(ctx);
    }
    if (ctx.integrationId === 'instagram') {
      return type === 'sync' || type === 'import' ? syncInstagram(ctx) : connectInstagram(ctx);
    }
    if (ctx.integrationId === 'meta-ads') {
      return type === 'sync' || type === 'import' ? syncMetaAds(ctx) : connectMetaAds(ctx);
    }
    if (ctx.integrationId === 'meta-pixel') {
      return connectMetaPixel(ctx);
    }

    throw new Error(`Unsupported Meta integration: ${ctx.integrationId}`);
  } catch (error) {
    const providerError = buildProviderError(ctx.integrationId, error, `Failed to process ${ctx.integrationId}`);
    throw Object.assign(new Error(providerError.message), providerError);
  }
}

module.exports = {
  integrationIds: ['facebook', 'instagram', 'meta-ads', 'meta-pixel'],
  connect: (ctx) => dispatch(ctx, 'connect'),
  testConnection: (ctx) => dispatch(ctx, 'test'),
  syncCurrent: (ctx) => dispatch(ctx, 'sync'),
  importHistory: (ctx) => dispatch(ctx, 'import')
};

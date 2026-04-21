const { decodeJwtExpiry, requestJson, buildProviderError, buildResponseError } = require('../http-client');
const { asArray, requireFields, buildResult, firstNonEmpty } = require('../provider-utils');

async function tiktokGet(url, accessToken, params = {}) {
  const response = await requestJson({
    method: 'GET',
    url,
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    params
  });

  const error = buildResponseError('tiktok', response, `TikTok request failed for ${url}`);
  if (error) {
    throw Object.assign(new Error(error.message), error);
  }

  return response.data;
}

async function tiktokPost(url, accessToken, data = {}) {
  const response = await requestJson({
    method: 'POST',
    url,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    data
  });

  const error = buildResponseError('tiktok', response, `TikTok request failed for ${url}`);
  if (error) {
    throw Object.assign(new Error(error.message), error);
  }

  return response.data;
}

async function connectTikTok(ctx) {
  requireFields(ctx.credentials, ['accessToken'], 'credentials');
  const data = await tiktokGet(
    'https://open.tiktokapis.com/v2/user/info/',
    ctx.credentials.accessToken,
    {
      fields: 'open_id,display_name,bio_description,profile_deep_link,avatar_url,follower_count,following_count,likes_count,video_count'
    }
  );
  const user = data?.data?.user || {};

  return buildResult({
    status: 'connected',
    metadata: user,
    health: 'TikTok user access validated successfully.',
    normalized: {
      scope: 'social_insights',
      provider: 'tiktok',
      profile: user
    },
    notes: 'Connected through the TikTok API.',
    tokenExpiresAt: decodeJwtExpiry(ctx.credentials.accessToken),
    permissionScope: 'TikTok business/user OAuth access',
    dataScopes: ['posts', 'insights'],
    readScopes: ['posts', 'insights'],
    writeScopes: ['publishing'],
    connectionMethod: 'oauth_or_key',
    account: {
      id: user.open_id || ctx.config.accountId,
      name: user.display_name || firstNonEmpty(ctx.config.profileUrl, ctx.primaryValue)
    }
  });
}

async function syncTikTok(ctx) {
  const videos = await tiktokPost(
    'https://open.tiktokapis.com/v2/video/list/',
    ctx.credentials.accessToken,
    {
      max_count: 10
    }
  );

  return buildResult({
    status: 'connected',
    metadata: {
      account_id: firstNonEmpty(ctx.config.accountId, ctx.primaryValue)
    },
    health: 'TikTok content data synced successfully.',
    normalized: {
      scope: 'social_insights',
      provider: 'tiktok',
      videos: asArray(videos?.data?.videos).map((item) => ({
        id: item.id,
        title: item.title || '',
        create_time: item.create_time || '',
        share_url: item.share_url || '',
        view_count: Number(item.view_count || 0),
        like_count: Number(item.like_count || 0),
        comment_count: Number(item.comment_count || 0)
      }))
    },
    notes: 'Synced recent TikTok videos.',
    syncSummary: {
      videos: asArray(videos?.data?.videos).length
    },
    dataScopes: ['posts', 'insights'],
    readScopes: ['posts', 'insights']
  });
}

async function connectTikTokAds(ctx) {
  requireFields(
    {
      advertiserId: ctx.config.advertiserId,
      token: ctx.credentials.accessToken
    },
    ['advertiserId', 'token'],
    'credentials'
  );

  const data = await tiktokGet(
    'https://business-api.tiktok.com/open_api/v1.3/advertiser/info/',
    ctx.credentials.accessToken,
    {
      advertiser_id: ctx.config.advertiserId
    }
  );

  const advertiser = asArray(data?.data?.list)[0] || {};

  return buildResult({
    status: 'connected',
    metadata: advertiser,
    health: 'TikTok Ads advertiser access validated successfully.',
    normalized: {
      scope: 'ads',
      provider: 'tiktok_ads',
      advertiser
    },
    notes: 'Connected through the TikTok Business API.',
    tokenExpiresAt: decodeJwtExpiry(ctx.credentials.accessToken),
    permissionScope: 'TikTok Ads advertiser access',
    dataScopes: ['ads'],
    readScopes: ['ads', 'campaigns', 'insights'],
    writeScopes: ['ads updates'],
    connectionMethod: 'oauth_or_key',
    account: {
      id: advertiser.advertiser_id || ctx.config.advertiserId,
      name: advertiser.name || ctx.config.advertiserId
    }
  });
}

async function syncTikTokAds(ctx) {
  const data = await tiktokPost(
    'https://business-api.tiktok.com/open_api/v1.3/report/integrated/get/',
    ctx.credentials.accessToken,
    {
      advertiser_id: ctx.config.advertiserId,
      data_level: 'AUCTION_AD',
      dimensions: ['campaign_id', 'campaign_name'],
      metrics: ['spend', 'impressions', 'clicks', 'ctr', 'cpc'],
      start_date: new Date(Date.now() - (1000 * 60 * 60 * 24 * 30)).toISOString().slice(0, 10),
      end_date: new Date().toISOString().slice(0, 10),
      page_size: 25
    }
  );

  return buildResult({
    status: 'connected',
    metadata: {
      advertiser_id: ctx.config.advertiserId
    },
    health: 'TikTok Ads reporting sync completed successfully.',
    normalized: {
      scope: 'ads',
      provider: 'tiktok_ads',
      campaigns: asArray(data?.data?.list).map((item) => ({
        campaign_id: item.dimensions?.campaign_id || '',
        campaign_name: item.dimensions?.campaign_name || '',
        spend: Number(item.metrics?.spend || 0),
        impressions: Number(item.metrics?.impressions || 0),
        clicks: Number(item.metrics?.clicks || 0),
        ctr: Number(item.metrics?.ctr || 0),
        cpc: Number(item.metrics?.cpc || 0)
      }))
    },
    notes: 'Synced TikTok Ads campaign performance.',
    syncSummary: {
      campaigns: asArray(data?.data?.list).length
    },
    dataScopes: ['ads'],
    readScopes: ['ads', 'campaigns', 'insights']
  });
}

async function connectTikTokPixel(ctx) {
  requireFields(
    {
      pixelId: ctx.config.pixelId,
      token: ctx.credentials.accessToken
    },
    ['pixelId', 'token'],
    'credentials'
  );

  const data = await tiktokGet(
    'https://business-api.tiktok.com/open_api/v1.3/pixel/list/',
    ctx.credentials.accessToken,
    {
      advertiser_id: ctx.config.accountId
    }
  );

  const pixel = asArray(data?.data?.pixel_list).find(item => String(item.pixel_id) === String(ctx.config.pixelId));
  if (!pixel) {
    throw new Error('Configured TikTok Pixel was not found for the provided token');
  }

  return buildResult({
    status: 'connected',
    metadata: pixel,
    health: 'TikTok Pixel access validated successfully.',
    normalized: {
      scope: 'website_analytics',
      provider: 'tiktok_pixel',
      pixel
    },
    notes: 'Connected through the TikTok Business API pixel endpoints.',
    tokenExpiresAt: decodeJwtExpiry(ctx.credentials.accessToken),
    permissionScope: 'TikTok Pixel advertiser access',
    dataScopes: ['traffic', 'ads'],
    readScopes: ['events', 'conversions', 'ads'],
    writeScopes: ['tracking updates'],
    connectionMethod: 'oauth_or_key',
    account: {
      id: pixel.pixel_id,
      name: pixel.pixel_name || pixel.pixel_id
    }
  });
}

async function dispatch(ctx, type) {
  try {
    if (ctx.integrationId === 'tiktok') {
      return type === 'sync' || type === 'import' ? syncTikTok(ctx) : connectTikTok(ctx);
    }
    if (ctx.integrationId === 'tiktok-ads') {
      return type === 'sync' || type === 'import' ? syncTikTokAds(ctx) : connectTikTokAds(ctx);
    }
    if (ctx.integrationId === 'tiktok-pixel') {
      return connectTikTokPixel(ctx);
    }

    throw new Error(`Unsupported TikTok integration: ${ctx.integrationId}`);
  } catch (error) {
    const providerError = buildProviderError(ctx.integrationId, error, `Failed to process ${ctx.integrationId}`);
    throw Object.assign(new Error(providerError.message), providerError);
  }
}

module.exports = {
  integrationIds: ['tiktok', 'tiktok-ads', 'tiktok-pixel'],
  connect: (ctx) => dispatch(ctx, 'connect'),
  testConnection: (ctx) => dispatch(ctx, 'test'),
  syncCurrent: (ctx) => dispatch(ctx, 'sync'),
  importHistory: (ctx) => dispatch(ctx, 'import')
};

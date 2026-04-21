const { decodeJwtExpiry, requestJson, buildProviderError, buildResponseError } = require('../http-client');
const { asArray, asString, requireFields, buildResult, firstNonEmpty } = require('../provider-utils');

function getBearerHeaders(credentials = {}, extra = {}) {
  return {
    Authorization: `Bearer ${credentials.accessToken || credentials.refreshToken}`,
    ...extra
  };
}

async function runGa4Report(ctx, body) {
  const propertyId = asString(ctx.config.propertyId);
  const response = await requestJson({
    method: 'POST',
    url: `https://analyticsdata.googleapis.com/v1beta/properties/${encodeURIComponent(propertyId)}:runReport`,
    headers: {
      'Content-Type': 'application/json',
      ...getBearerHeaders(ctx.credentials)
    },
    data: body
  });

  const error = buildResponseError('ga4', response, 'GA4 request failed');
  if (error) {
    throw Object.assign(new Error(error.message), error);
  }

  return response.data;
}

async function listSearchConsoleSites(ctx) {
  const response = await requestJson({
    method: 'GET',
    url: 'https://searchconsole.googleapis.com/webmasters/v3/sites',
    headers: getBearerHeaders(ctx.credentials)
  });

  const error = buildResponseError('search-console', response, 'Search Console request failed');
  if (error) {
    throw Object.assign(new Error(error.message), error);
  }

  return response.data?.siteEntry || [];
}

async function querySearchConsole(ctx, siteUrl, payload) {
  const response = await requestJson({
    method: 'POST',
    url: `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    headers: {
      'Content-Type': 'application/json',
      ...getBearerHeaders(ctx.credentials)
    },
    data: payload
  });

  const error = buildResponseError('search-console', response, 'Search Console analytics query failed');
  if (error) {
    throw Object.assign(new Error(error.message), error);
  }

  return response.data;
}

async function fetchYoutubeChannel(ctx) {
  const channelId = asString(ctx.config.channelId);
  const response = await requestJson({
    method: 'GET',
    url: 'https://www.googleapis.com/youtube/v3/channels',
    headers: getBearerHeaders(ctx.credentials),
    params: channelId
      ? {
          part: 'snippet,statistics,contentDetails',
          id: channelId
        }
      : {
          part: 'snippet,statistics,contentDetails',
          mine: true
        }
  });

  const error = buildResponseError('youtube', response, 'YouTube channel request failed');
  if (error) {
    throw Object.assign(new Error(error.message), error);
  }

  return asArray(response.data?.items)[0] || null;
}

async function fetchYoutubeVideos(ctx, channelId) {
  const searchResponse = await requestJson({
    method: 'GET',
    url: 'https://www.googleapis.com/youtube/v3/search',
    headers: getBearerHeaders(ctx.credentials),
    params: {
      part: 'snippet',
      channelId,
      maxResults: 10,
      order: 'date',
      type: 'video'
    }
  });

  const searchError = buildResponseError('youtube', searchResponse, 'YouTube video lookup failed');
  if (searchError) {
    throw Object.assign(new Error(searchError.message), searchError);
  }

  const videoIds = asArray(searchResponse.data?.items)
    .map(item => item?.id?.videoId)
    .filter(Boolean)
    .join(',');

  if (!videoIds) {
    return [];
  }

  const videosResponse = await requestJson({
    method: 'GET',
    url: 'https://www.googleapis.com/youtube/v3/videos',
    headers: getBearerHeaders(ctx.credentials),
    params: {
      part: 'snippet,statistics',
      id: videoIds
    }
  });

  const videosError = buildResponseError('youtube', videosResponse, 'YouTube video detail request failed');
  if (videosError) {
    throw Object.assign(new Error(videosError.message), videosError);
  }

  return asArray(videosResponse.data?.items);
}

async function fetchGoogleAdsCustomer(ctx) {
  const customerId = asString(ctx.config.customerId);
  const headers = {
    Authorization: `Bearer ${ctx.credentials.refreshToken || ctx.credentials.accessToken}`,
    'developer-token': firstNonEmpty(ctx.credentials.developerToken, ctx.config.developerToken)
  };

  if (asString(ctx.config.managerId)) {
    headers['login-customer-id'] = asString(ctx.config.managerId).replace(/-/g, '');
  }

  const response = await requestJson({
    method: 'GET',
    url: `https://googleads.googleapis.com/v18/customers/${customerId.replace(/-/g, '')}`,
    headers
  });

  const error = buildResponseError('google-ads', response, 'Google Ads request failed');
  if (error) {
    throw Object.assign(new Error(error.message), error);
  }

  return response.data;
}

async function fetchDriveFile(ctx) {
  const folderId = asString(ctx.config.folderId);
  const response = await requestJson({
    method: 'GET',
    url: `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(folderId)}`,
    headers: getBearerHeaders(ctx.credentials),
    params: {
      fields: 'id,name,mimeType,modifiedTime,webViewLink'
    }
  });

  const error = buildResponseError('google-drive', response, 'Google Drive request failed');
  if (error) {
    throw Object.assign(new Error(error.message), error);
  }

  return response.data;
}

async function fetchTagManagerContainer(ctx) {
  const token = ctx.credentials.accessToken;
  const containerId = asString(ctx.config.containerId);
  const accountsResponse = await requestJson({
    method: 'GET',
    url: 'https://tagmanager.googleapis.com/tagmanager/v2/accounts',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const accountsError = buildResponseError('gtm', accountsResponse, 'Google Tag Manager accounts request failed');
  if (accountsError) {
    throw Object.assign(new Error(accountsError.message), accountsError);
  }

  for (const account of asArray(accountsResponse.data?.account)) {
    const containersResponse = await requestJson({
      method: 'GET',
      url: `https://tagmanager.googleapis.com/tagmanager/v2/accounts/${account.accountId}/containers`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const containersError = buildResponseError('gtm', containersResponse, 'Google Tag Manager containers request failed');
    if (containersError) {
      continue;
    }

    const container = asArray(containersResponse.data?.container).find(
      item => item.publicId === containerId || item.containerId === containerId
    );

    if (container) {
      return {
        account,
        container
      };
    }
  }

  throw new Error('Container not found in accessible Google Tag Manager accounts');
}

async function connectGa4(ctx) {
  requireFields(ctx.config, ['propertyId']);
  requireFields(ctx.credentials, ['accessToken'], 'credentials');

  const report = await runGa4Report(ctx, {
    dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'date' }],
    metrics: [{ name: 'sessions' }],
    limit: 1
  });

  return buildResult({
    status: 'connected',
    metadata: {
      property_id: ctx.config.propertyId,
      measurement_id: ctx.config.measurementId || '',
      row_count: report.rowCount || 0
    },
    health: 'GA4 Data API access validated successfully.',
    normalized: {
      scope: 'website_analytics',
      provider: 'ga4',
      property_id: ctx.config.propertyId
    },
    notes: 'Connected through the Google Analytics Data API.',
    tokenExpiresAt: decodeJwtExpiry(ctx.credentials.accessToken),
    permissionScope: 'GA4 property access token',
    dataScopes: ['traffic'],
    readScopes: ['traffic', 'sessions', 'events', 'conversions'],
    writeScopes: ['tracking updates'],
    connectionMethod: 'oauth_or_key',
    account: {
      id: ctx.config.propertyId,
      name: ctx.config.propertyId
    }
  });
}

async function syncGa4(ctx) {
  const report = await runGa4Report(ctx, {
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'landingPagePlusQueryString' }],
    metrics: [
      { name: 'sessions' },
      { name: 'engagedSessions' },
      { name: 'screenPageViews' },
      { name: 'keyEvents' },
      { name: 'totalRevenue' }
    ],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 10
  });

  const rows = asArray(report.rows).map((row) => ({
    landing_page: row.dimensionValues?.[0]?.value || '',
    sessions: Number(row.metricValues?.[0]?.value || 0),
    engaged_sessions: Number(row.metricValues?.[1]?.value || 0),
    page_views: Number(row.metricValues?.[2]?.value || 0),
    conversions: Number(row.metricValues?.[3]?.value || 0),
    revenue: Number(row.metricValues?.[4]?.value || 0)
  }));

  return buildResult({
    status: 'connected',
    metadata: {
      property_id: ctx.config.propertyId
    },
    health: 'GA4 reporting sync completed successfully.',
    normalized: {
      scope: 'website_analytics',
      provider: 'ga4',
      landing_pages: rows
    },
    notes: 'Synced GA4 landing page and conversion data.',
    syncSummary: {
      rows: rows.length
    },
    dataScopes: ['traffic'],
    readScopes: ['traffic', 'sessions', 'events', 'conversions']
  });
}

async function connectSearchConsole(ctx) {
  requireFields(ctx.config, ['propertyUrl']);
  requireFields(ctx.credentials, ['accessToken'], 'credentials');

  const sites = await listSearchConsoleSites(ctx);
  const target = sites.find(site => site.siteUrl === ctx.config.propertyUrl || site.siteUrl === ctx.config.siteDomain);

  if (!target) {
    throw new Error('Configured Search Console property is not accessible with the provided token');
  }

  return buildResult({
    status: 'connected',
    metadata: target,
    health: 'Search Console access validated successfully.',
    normalized: {
      scope: 'seo',
      provider: 'search_console',
      property: target.siteUrl
    },
    notes: 'Connected through the Google Search Console API.',
    tokenExpiresAt: decodeJwtExpiry(ctx.credentials.accessToken),
    permissionScope: 'Search Console property access',
    dataScopes: ['insights'],
    readScopes: ['seo', 'queries', 'pages'],
    writeScopes: [],
    connectionMethod: 'oauth_or_key',
    account: {
      id: target.siteUrl,
      name: target.siteUrl
    }
  });
}

async function syncSearchConsole(ctx) {
  const propertyUrl = firstNonEmpty(ctx.config.propertyUrl, ctx.config.siteDomain);
  const data = await querySearchConsole(ctx, propertyUrl, {
    startDate: new Date(Date.now() - (1000 * 60 * 60 * 24 * 28)).toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
    dimensions: ['query', 'page'],
    rowLimit: 25
  });

  const rows = asArray(data.rows).map((row) => ({
    query: row.keys?.[0] || '',
    page: row.keys?.[1] || '',
    clicks: row.clicks || 0,
    impressions: row.impressions || 0,
    ctr: row.ctr || 0,
    position: row.position || 0
  }));

  return buildResult({
    status: 'connected',
    metadata: {
      property_url: propertyUrl
    },
    health: 'Search Console sync completed successfully.',
    normalized: {
      scope: 'seo',
      provider: 'search_console',
      rows
    },
    notes: 'Synced Search Console queries and pages.',
    syncSummary: {
      rows: rows.length
    },
    dataScopes: ['insights'],
    readScopes: ['seo', 'queries', 'pages']
  });
}

async function connectYoutube(ctx) {
  requireFields(ctx.credentials, ['accessToken'], 'credentials');
  const channel = await fetchYoutubeChannel(ctx);

  if (!channel) {
    throw new Error('No accessible YouTube channel found for the provided token');
  }

  return buildResult({
    status: 'connected',
    metadata: channel,
    health: 'YouTube channel access validated successfully.',
    normalized: {
      scope: 'social_insights',
      provider: 'youtube',
      channel: {
        id: channel.id,
        title: channel.snippet?.title || '',
        subscribers: Number(channel.statistics?.subscriberCount || 0)
      }
    },
    notes: 'Connected through the YouTube Data API.',
    tokenExpiresAt: decodeJwtExpiry(ctx.credentials.accessToken),
    permissionScope: 'YouTube channel OAuth access',
    dataScopes: ['posts', 'insights'],
    readScopes: ['posts', 'insights'],
    writeScopes: ['publishing'],
    connectionMethod: 'oauth_or_key',
    account: {
      id: channel.id,
      name: channel.snippet?.title || ctx.config.channelUrl
    }
  });
}

async function syncYoutube(ctx) {
  const channel = await fetchYoutubeChannel(ctx);
  const videos = await fetchYoutubeVideos(ctx, channel.id);

  return buildResult({
    status: 'connected',
    metadata: {
      channel_id: channel.id
    },
    health: 'YouTube channel and video metrics synced successfully.',
    normalized: {
      scope: 'social_insights',
      provider: 'youtube',
      channel: {
        id: channel.id,
        title: channel.snippet?.title || '',
        subscribers: Number(channel.statistics?.subscriberCount || 0),
        views: Number(channel.statistics?.viewCount || 0)
      },
      videos: videos.map((item) => ({
        id: item.id,
        title: item.snippet?.title || '',
        published_at: item.snippet?.publishedAt || '',
        views: Number(item.statistics?.viewCount || 0),
        likes: Number(item.statistics?.likeCount || 0),
        comments: Number(item.statistics?.commentCount || 0)
      }))
    },
    notes: 'Synced YouTube content performance.',
    syncSummary: {
      videos: videos.length
    },
    dataScopes: ['posts', 'insights'],
    readScopes: ['posts', 'insights']
  });
}

async function connectGoogleAds(ctx) {
  requireFields(ctx.config, ['customerId']);
  requireFields(
    {
      token: ctx.credentials.refreshToken || ctx.credentials.accessToken,
      developerToken: ctx.credentials.developerToken || ctx.config.developerToken
    },
    ['token', 'developerToken'],
    'credentials'
  );

  const customer = await fetchGoogleAdsCustomer(ctx);

  return buildResult({
    status: 'connected',
    metadata: customer,
    health: 'Google Ads account access validated successfully.',
    normalized: {
      scope: 'ads',
      provider: 'google_ads',
      account: customer
    },
    notes: 'Connected through the Google Ads API.',
    tokenExpiresAt: decodeJwtExpiry(ctx.credentials.accessToken),
    permissionScope: 'Google Ads developer token + customer OAuth access',
    dataScopes: ['ads'],
    readScopes: ['ads', 'campaigns', 'insights'],
    writeScopes: ['ads updates'],
    connectionMethod: 'oauth_or_key',
    account: {
      id: ctx.config.customerId,
      name: ctx.config.customerId
    }
  });
}

async function connectGoogleDrive(ctx) {
  requireFields(ctx.config, ['folderId']);
  requireFields(ctx.credentials, ['accessToken'], 'credentials');
  const file = await fetchDriveFile(ctx);

  return buildResult({
    status: 'connected',
    metadata: file,
    health: 'Google Drive access validated successfully.',
    normalized: {
      scope: 'automation',
      provider: 'google_drive',
      file
    },
    notes: 'Connected through the Google Drive API.',
    tokenExpiresAt: decodeJwtExpiry(ctx.credentials.accessToken),
    permissionScope: 'Drive file or folder OAuth access',
    dataScopes: ['traffic'],
    readScopes: ['files'],
    writeScopes: ['shared file updates'],
    connectionMethod: 'oauth_or_key',
    account: {
      id: file.id,
      name: file.name
    }
  });
}

async function connectGtm(ctx) {
  requireFields(ctx.config, ['containerId']);
  requireFields(ctx.credentials, ['accessToken'], 'credentials');
  const result = await fetchTagManagerContainer(ctx);

  return buildResult({
    status: 'connected',
    metadata: result,
    health: 'Google Tag Manager access validated successfully.',
    normalized: {
      scope: 'website_analytics',
      provider: 'gtm',
      container: result.container
    },
    notes: 'Connected through the Google Tag Manager API.',
    tokenExpiresAt: decodeJwtExpiry(ctx.credentials.accessToken),
    permissionScope: 'GTM account OAuth access',
    dataScopes: ['traffic'],
    readScopes: ['tracking config'],
    writeScopes: ['tracking updates'],
    connectionMethod: 'oauth_or_key',
    account: {
      id: result.container.containerId || result.container.publicId,
      name: result.container.name || result.container.publicId
    }
  });
}

async function dispatch(ctx, type) {
  try {
    if (ctx.integrationId === 'ga4') {
      return type === 'sync' || type === 'import' ? syncGa4(ctx) : connectGa4(ctx);
    }
    if (ctx.integrationId === 'search-console') {
      return type === 'sync' || type === 'import' ? syncSearchConsole(ctx) : connectSearchConsole(ctx);
    }
    if (ctx.integrationId === 'youtube') {
      return type === 'sync' || type === 'import' ? syncYoutube(ctx) : connectYoutube(ctx);
    }
    if (ctx.integrationId === 'google-ads') {
      return connectGoogleAds(ctx);
    }
    if (ctx.integrationId === 'google-drive') {
      return connectGoogleDrive(ctx);
    }
    if (ctx.integrationId === 'gtm') {
      return connectGtm(ctx);
    }

    throw new Error(`Unsupported Google integration: ${ctx.integrationId}`);
  } catch (error) {
    const providerError = buildProviderError(ctx.integrationId, error, `Failed to process ${ctx.integrationId}`);
    throw Object.assign(new Error(providerError.message), providerError);
  }
}

module.exports = {
  integrationIds: ['ga4', 'search-console', 'youtube', 'google-ads', 'google-drive', 'gtm'],
  connect: (ctx) => dispatch(ctx, 'connect'),
  testConnection: (ctx) => dispatch(ctx, 'test'),
  syncCurrent: (ctx) => dispatch(ctx, 'sync'),
  importHistory: (ctx) => dispatch(ctx, 'import')
};

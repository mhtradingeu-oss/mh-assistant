const { requestJson, buildProviderError, buildResponseError } = require('../http-client');
const { asString, requireFields, buildResult } = require('../provider-utils');

async function fetchWebsiteMetadata(url) {
  const response = await requestJson({
    method: 'GET',
    url,
    maxRedirects: 5,
    headers: {
      Accept: 'text/html,application/xhtml+xml'
    }
  });

  const error = buildResponseError('website', response, 'Website request failed');
  if (error) {
    throw Object.assign(new Error(error.message), error);
  }

  const html = asString(response.data);
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);

  return {
    final_url: response.request?.res?.responseUrl || url,
    status_code: response.status,
    title: titleMatch ? titleMatch[1].trim() : '',
    server: asString(response.headers?.server),
    content_type: asString(response.headers?.['content-type'])
  };
}

async function connect(ctx) {
  const config = ctx.config || {};
  requireFields(config, ['url']);
  const metadata = await fetchWebsiteMetadata(config.url);

  return buildResult({
    status: 'connected',
    metadata,
    health: 'Website endpoint responded successfully.',
    normalized: {
      scope: 'website',
      website: metadata
    },
    notes: 'Website connection verified against the live site.',
    permissionScope: 'Website URL availability',
    dataScopes: ['traffic'],
    readScopes: ['traffic'],
    writeScopes: ['site updates', 'webhooks'],
    connectionMethod: 'direct_config',
    account: {
      id: metadata.final_url,
      name: metadata.title || metadata.final_url
    }
  });
}

async function testConnection(ctx) {
  return connect(ctx);
}

async function syncCurrent(ctx) {
  const metadata = await fetchWebsiteMetadata(ctx.config.url);
  return buildResult({
    status: 'connected',
    metadata,
    health: 'Website is reachable.',
    normalized: {
      scope: 'website',
      website: metadata
    },
    notes: 'Fetched current website metadata and reachability state.',
    syncSummary: {
      urls_checked: 1
    },
    dataScopes: ['traffic'],
    readScopes: ['traffic'],
    writeScopes: ['site updates']
  });
}

async function importHistory(ctx) {
  try {
    const sitemapUrl = new URL('/sitemap.xml', ctx.config.url).toString();
    const response = await requestJson({
      method: 'GET',
      url: sitemapUrl,
      headers: {
        Accept: 'application/xml,text/xml'
      }
    });
    const error = buildResponseError('website', response, 'Failed to fetch sitemap');
    if (error) {
      throw Object.assign(new Error(error.message), error);
    }

    const matches = String(response.data || '').match(/<loc>/g) || [];
    return buildResult({
      status: 'connected',
      metadata: {
        sitemap_url: sitemapUrl
      },
      health: 'Website history import completed from sitemap.',
      normalized: {
        scope: 'website',
        sitemap: {
          url: sitemapUrl,
          urls_detected: matches.length
        }
      },
      notes: 'Imported historical URL coverage from the sitemap.',
      syncSummary: {
        urls_detected: matches.length
      },
      dataScopes: ['traffic'],
      readScopes: ['traffic']
    });
  } catch (error) {
    const providerError = buildProviderError('website', error, 'Failed to import website history');
    throw Object.assign(new Error(providerError.message), providerError);
  }
}

module.exports = {
  integrationIds: ['website'],
  connect,
  testConnection,
  syncCurrent,
  importHistory
};

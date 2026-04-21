const { requestJson, buildProviderError, buildResponseError } = require('../http-client');
const { asArray, requireFields, buildResult } = require('../provider-utils');

function buildAuthParams(credentials = {}) {
  return {
    consumer_key: credentials.consumerKey,
    consumer_secret: credentials.consumerSecret
  };
}

async function fetchWooCommerce(ctx, endpoint, params = {}) {
  const response = await requestJson({
    method: 'GET',
    url: `${ctx.config.storeUrl.replace(/\/+$/, '')}/wp-json/wc/v3/${endpoint.replace(/^\/+/, '')}`,
    params: {
      ...buildAuthParams(ctx.credentials),
      ...params
    }
  });

  const error = buildResponseError('woocommerce', response, `WooCommerce request failed for ${endpoint}`);
  if (error) {
    throw Object.assign(new Error(error.message), error);
  }

  return response.data;
}

async function connect(ctx) {
  requireFields(ctx.config, ['storeUrl']);
  requireFields(ctx.credentials, ['consumerKey', 'consumerSecret'], 'credentials');

  const systemStatus = await fetchWooCommerce(ctx, 'system_status');

  return buildResult({
    status: 'connected',
    metadata: {
      store_url: ctx.config.storeUrl,
      environment: systemStatus?.environment || {},
      settings: {
        currency: systemStatus?.settings?.currency,
        weight_unit: systemStatus?.settings?.weight_unit
      }
    },
    health: 'WooCommerce API credentials validated successfully.',
    normalized: {
      scope: 'commerce',
      platform: 'woocommerce',
      store: {
        url: ctx.config.storeUrl,
        currency: systemStatus?.settings?.currency || '',
        https: Boolean(systemStatus?.environment?.https_status)
      }
    },
    notes: 'Connected through the WooCommerce REST API.',
    permissionScope: 'Store URL + consumer key/secret',
    dataScopes: ['orders', 'traffic'],
    readScopes: ['products', 'orders', 'sales'],
    writeScopes: ['catalog sync'],
    connectionMethod: 'api_key',
    account: {
      id: ctx.config.storeUrl,
      name: systemStatus?.environment?.home_url || ctx.config.storeUrl
    }
  });
}

async function testConnection(ctx) {
  return connect(ctx);
}

async function syncCurrent(ctx) {
  const [products, orders] = await Promise.all([
    fetchWooCommerce(ctx, 'products', { per_page: 5, orderby: 'date', order: 'desc' }),
    fetchWooCommerce(ctx, 'orders', { per_page: 5, orderby: 'date', order: 'desc' })
  ]);

  return buildResult({
    status: 'connected',
    metadata: {
      store_url: ctx.config.storeUrl
    },
    health: 'WooCommerce products and recent orders synced successfully.',
    normalized: {
      scope: 'commerce',
      platform: 'woocommerce',
      products: asArray(products).map((item) => ({
        id: item.id,
        name: item.name,
        status: item.status,
        price: item.price,
        permalink: item.permalink
      })),
      orders: asArray(orders).map((item) => ({
        id: item.id,
        status: item.status,
        currency: item.currency,
        total: item.total,
        created_at: item.date_created
      }))
    },
    notes: 'Synced recent products and orders from WooCommerce.',
    syncSummary: {
      products: asArray(products).length,
      orders: asArray(orders).length
    },
    dataScopes: ['orders'],
    readScopes: ['products', 'orders', 'sales']
  });
}

async function importHistory(ctx) {
  try {
    const orders = await fetchWooCommerce(ctx, 'orders', {
      per_page: 25,
      orderby: 'date',
      order: 'desc'
    });

    return buildResult({
      status: 'connected',
      metadata: {
        store_url: ctx.config.storeUrl
      },
      health: 'WooCommerce order history imported successfully.',
      normalized: {
        scope: 'commerce',
        platform: 'woocommerce',
        orders: asArray(orders).map((item) => ({
          id: item.id,
          status: item.status,
          total: item.total,
          currency: item.currency,
          created_at: item.date_created
        }))
      },
      notes: 'Imported recent WooCommerce order history.',
      syncSummary: {
        orders: asArray(orders).length
      },
      dataScopes: ['orders'],
      readScopes: ['orders', 'sales']
    });
  } catch (error) {
    const providerError = buildProviderError('woocommerce', error, 'Failed to import WooCommerce history');
    throw Object.assign(new Error(providerError.message), providerError);
  }
}

module.exports = {
  integrationIds: ['woocommerce'],
  connect,
  testConnection,
  syncCurrent,
  importHistory
};

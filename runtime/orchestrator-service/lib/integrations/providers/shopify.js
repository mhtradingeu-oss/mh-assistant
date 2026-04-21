const { requestJson, buildProviderError, buildResponseError } = require('../http-client');
const { asArray, requireFields, buildResult } = require('../provider-utils');

function getStoreDomain(config = {}) {
  return String(config.storeDomain || '').trim().replace(/^https?:\/\//, '').replace(/\/+$/, '');
}

async function runGraphql(ctx, query) {
  const response = await requestJson({
    method: 'POST',
    url: `https://${getStoreDomain(ctx.config)}/admin/api/2025-01/graphql.json`,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ctx.credentials.adminToken
    },
    data: { query }
  });

  const error = buildResponseError('shopify', response, 'Shopify request failed');
  if (error) {
    throw Object.assign(new Error(error.message), error);
  }

  if (response.data?.errors?.length) {
    throw new Error(response.data.errors.map(item => item.message).join(', '));
  }

  return response.data?.data || {};
}

async function connect(ctx) {
  requireFields(ctx.config, ['storeDomain']);
  requireFields(ctx.credentials, ['adminToken'], 'credentials');

  const data = await runGraphql(ctx, `
    {
      shop {
        name
        myshopifyDomain
        primaryDomain {
          url
        }
        currencyCode
        email
        plan {
          displayName
        }
      }
    }
  `);

  const shop = data.shop || {};

  return buildResult({
    status: 'connected',
    metadata: {
      shop
    },
    health: 'Shopify Admin API token validated successfully.',
    normalized: {
      scope: 'commerce',
      platform: 'shopify',
      store: {
        name: shop.name,
        domain: shop.myshopifyDomain,
        primary_domain: shop.primaryDomain?.url || '',
        currency: shop.currencyCode
      }
    },
    notes: 'Connected through the Shopify Admin GraphQL API.',
    permissionScope: 'Store domain + Admin API token',
    dataScopes: ['orders'],
    readScopes: ['products', 'orders', 'sales'],
    writeScopes: ['catalog sync'],
    connectionMethod: 'oauth_or_key',
    account: {
      id: shop.myshopifyDomain || ctx.config.storeDomain,
      name: shop.name || ctx.config.storeDomain
    }
  });
}

async function testConnection(ctx) {
  return connect(ctx);
}

async function syncCurrent(ctx) {
  const data = await runGraphql(ctx, `
    {
      products(first: 5, sortKey: UPDATED_AT, reverse: true) {
        edges {
          node {
            id
            title
            status
            onlineStorePreviewUrl
          }
        }
      }
      orders(first: 5, reverse: true, sortKey: PROCESSED_AT) {
        edges {
          node {
            id
            name
            displayFinancialStatus
            processedAt
            totalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `);

  const products = asArray(data.products?.edges).map(({ node }) => ({
    id: node.id,
    title: node.title,
    status: node.status,
    url: node.onlineStorePreviewUrl
  }));
  const orders = asArray(data.orders?.edges).map(({ node }) => ({
    id: node.id,
    name: node.name,
    status: node.displayFinancialStatus,
    processed_at: node.processedAt,
    amount: node.totalPriceSet?.shopMoney?.amount,
    currency: node.totalPriceSet?.shopMoney?.currencyCode
  }));

  return buildResult({
    status: 'connected',
    metadata: {
      store_domain: getStoreDomain(ctx.config)
    },
    health: 'Shopify products and recent orders synced successfully.',
    normalized: {
      scope: 'commerce',
      platform: 'shopify',
      products,
      orders
    },
    notes: 'Synced Shopify products and orders.',
    syncSummary: {
      products: products.length,
      orders: orders.length
    },
    dataScopes: ['orders'],
    readScopes: ['products', 'orders', 'sales']
  });
}

async function importHistory(ctx) {
  const data = await runGraphql(ctx, `
    {
      orders(first: 25, reverse: true, sortKey: PROCESSED_AT) {
        edges {
          node {
            id
            name
            displayFinancialStatus
            processedAt
            totalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `);

  const orders = asArray(data.orders?.edges).map(({ node }) => ({
    id: node.id,
    name: node.name,
    status: node.displayFinancialStatus,
    processed_at: node.processedAt,
    amount: node.totalPriceSet?.shopMoney?.amount,
    currency: node.totalPriceSet?.shopMoney?.currencyCode
  }));

  return buildResult({
    status: 'connected',
    metadata: {
      store_domain: getStoreDomain(ctx.config)
    },
    health: 'Shopify history import completed successfully.',
    normalized: {
      scope: 'commerce',
      platform: 'shopify',
      orders
    },
    notes: 'Imported recent Shopify order history.',
    syncSummary: {
      orders: orders.length
    },
    dataScopes: ['orders'],
    readScopes: ['orders', 'sales']
  });
}

module.exports = {
  integrationIds: ['shopify'],
  connect,
  testConnection,
  syncCurrent,
  importHistory
};

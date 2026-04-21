const { decodeJwtExpiry, requestJson, buildProviderError, buildResponseError } = require('../http-client');
const { asArray, requireFields, buildResult } = require('../provider-utils');

async function ebayGet(path, accessToken) {
  const response = await requestJson({
    method: 'GET',
    url: `https://api.ebay.com${path}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json'
    }
  });

  const error = buildResponseError('ebay', response, `eBay request failed for ${path}`);
  if (error) {
    throw Object.assign(new Error(error.message), error);
  }

  return response.data;
}

async function connect(ctx) {
  requireFields(ctx.credentials, ['accessToken'], 'credentials');
  const privileges = await ebayGet('/sell/account/v1/privilege', ctx.credentials.accessToken);

  return buildResult({
    status: 'connected',
    metadata: privileges,
    health: 'eBay seller privileges validated successfully.',
    normalized: {
      scope: 'commerce',
      platform: 'ebay',
      privileges: asArray(privileges?.privileges).map((item) => ({
        program: item.program,
        status: item.status
      }))
    },
    notes: 'Connected through the eBay Sell Account API.',
    tokenExpiresAt: decodeJwtExpiry(ctx.credentials.accessToken),
    permissionScope: 'eBay seller OAuth access',
    dataScopes: ['orders'],
    readScopes: ['listings', 'orders'],
    writeScopes: ['listing updates'],
    connectionMethod: 'oauth_or_key',
    account: {
      id: ctx.config.sellerId || ctx.primaryValue,
      name: ctx.config.sellerId || ctx.primaryValue
    }
  });
}

async function testConnection(ctx) {
  return connect(ctx);
}

async function syncCurrent(ctx) {
  const programs = await ebayGet('/sell/account/v1/program/get_opted_in_programs', ctx.credentials.accessToken);

  return buildResult({
    status: 'connected',
    metadata: programs,
    health: 'eBay opted-in program sync completed successfully.',
    normalized: {
      scope: 'commerce',
      platform: 'ebay',
      programs: asArray(programs?.programs).map((item) => ({
        program: item.programType,
        status: item.status
      }))
    },
    notes: 'Synced eBay seller program status.',
    syncSummary: {
      programs: asArray(programs?.programs).length
    },
    dataScopes: ['orders'],
    readScopes: ['listings', 'orders']
  });
}

async function importHistory(ctx) {
  return syncCurrent(ctx);
}

module.exports = {
  integrationIds: ['ebay'],
  connect,
  testConnection,
  syncCurrent,
  importHistory
};

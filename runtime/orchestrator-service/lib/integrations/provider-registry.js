const website = require('./providers/website');
const woocommerce = require('./providers/woocommerce');
const shopify = require('./providers/shopify');
const google = require('./providers/google');
const meta = require('./providers/meta');
const tiktok = require('./providers/tiktok');
const ebay = require('./providers/ebay');
const ops = require('./providers/ops');
const { createUnsupportedAdapter } = require('./providers/unsupported');

const registry = new Map();

[
  website,
  woocommerce,
  shopify,
  google,
  meta,
  tiktok,
  ebay,
  ops,
  createUnsupportedAdapter(
    ['amazon', 'smtp', 'mailer', 'crm'],
    'This provider requires a dedicated auth flow or credential model that is not yet configured in MH Assistant OS.'
  )
].forEach((adapter) => {
  (adapter.integrationIds || []).forEach((integrationId) => {
    registry.set(integrationId, adapter);
  });
});

function getProviderAdapter(integrationId) {
  return registry.get(String(integrationId || '').trim().toLowerCase()) || null;
}

module.exports = {
  getProviderAdapter
};

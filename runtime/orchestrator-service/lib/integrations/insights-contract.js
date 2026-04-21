function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function asString(value) {
  return String(value == null ? '' : value).trim();
}

function detectDomain(record = {}, normalized = {}) {
  const scopes = [
    ...asArray(record.data_scopes),
    ...asArray(record.read_scopes),
    ...asArray(record.write_scopes)
  ].map(item => asString(item).toLowerCase());
  const scopeText = [normalized.scope, ...scopes].join(' ').toLowerCase();

  if (/seo|query|position|search/.test(scopeText)) return 'seo';
  if (/ads|campaign/.test(scopeText)) return 'ads';
  if (/order|product|sale|commerce/.test(scopeText)) return 'commerce';
  if (/social|post|video|reel|media|insight/.test(scopeText)) return 'social';
  if (/traffic|session|landing|page|analytics|website/.test(scopeText)) return 'website_analytics';
  if (/email|audience|contact|crm/.test(scopeText)) return 'crm_email';
  return 'automation';
}

function buildCollections(normalized = {}, domain = '') {
  const payload = asObject(normalized);
  const automationEntities = [];

  if (payload.endpoint) {
    automationEntities.push(payload.endpoint);
  }

  automationEntities.push(...asArray(payload.events));
  automationEntities.push(...asArray(payload.programs));

  return {
    content_items: asArray(payload.posts || payload.media || payload.videos),
    website_pages: asArray(payload.landing_pages || payload.pages),
    seo_rows: asArray(payload.rows || payload.queries),
    ad_entities: asArray(payload.campaigns),
    commerce_orders: asArray(payload.orders),
    commerce_products: asArray(payload.products),
    automation_entities: domain === 'automation' ? automationEntities : []
  };
}

function buildInsightsReadyContract({
  projectName,
  integrationId,
  record = {},
  providerResult = {},
  generatedAt
}) {
  const normalized = asObject(providerResult.normalized);
  const domain = detectDomain(record, normalized);
  const collections = buildCollections(normalized, domain);

  return {
    version: 1,
    project: projectName,
    generated_at: generatedAt,
    integration_id: integrationId,
    provider: asString(normalized.provider || integrationId),
    domain,
    account: Object.keys(asObject(providerResult.account)).length
      ? asObject(providerResult.account)
      : asObject(record.provider_account),
    capabilities: {
      data_scopes: asArray(providerResult.data_scopes),
      read_scopes: asArray(providerResult.read_scopes),
      write_scopes: asArray(providerResult.write_scopes)
    },
    summary: {
      status: asString(providerResult.status),
      health: asString(providerResult.health),
      sync: asObject(providerResult.sync_summary)
    },
    collections,
    raw: normalized
  };
}

module.exports = {
  buildInsightsReadyContract
};

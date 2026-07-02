#!/usr/bin/env node
'use strict';

process.env.MH_DISABLE_READ_TELEMETRY = process.env.MH_DISABLE_READ_TELEMETRY || '1';

const {
  __stability: {
    getProductIntelligencePaths,
    readJsonFile,
    selectLaunchReadyProducts
  }
} = require('../runtime/orchestrator-service/server');

const project = String(process.env.MH_PROJECT || process.argv[2] || 'hairoticmen').trim().toLowerCase();
const theme = String(process.env.MH_LAUNCH_THEME || process.argv[3] || 'beard').trim().toLowerCase();

function normalizeText(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function matchesTheme(product, targetTheme) {
  if (!targetTheme) return true;
  const normalizedTheme = normalizeText(targetTheme);
  const category = normalizeText(product.category);
  const productType = normalizeText(product.marketing_intelligence && product.marketing_intelligence.product_type);
  const haystack = `${category} ${productType}`.trim();
  const tokens = new Set(haystack.split(' ').filter(Boolean));
  return category === normalizedTheme || productType === normalizedTheme || tokens.has(normalizedTheme) || haystack.includes(normalizedTheme);
}

function stableKey(product) {
  const id = String(product.product_id || product.id || '').trim().toLowerCase();
  const slug = String(product.product_slug || product.slug || '').trim().toLowerCase();
  return id ? `id:${id}` : slug ? `slug:${slug}` : '';
}

const paths = getProductIntelligencePaths(project);
const products = readJsonFile(paths.productsPath, []);
const launchReady = selectLaunchReadyProducts(products, project, 'verify_launch_wave_selection');
const selected = launchReady.filter((product) => matchesTheme(product, theme));
const duplicateKeys = selected
  .map(stableKey)
  .filter((key, index, keys) => key && keys.indexOf(key) !== index);
const draftProducts = selected.filter((product) => String(product.status || '').trim().toLowerCase() !== 'publish');

const result = {
  project,
  theme,
  source_file: paths.productsPath,
  total_products: Array.isArray(products) ? products.length : 0,
  launch_ready_count: launchReady.length,
  selected_count: selected.length,
  selected_products: selected.map((product) => ({
    product_id: product.product_id || null,
    product_slug: product.product_slug || null,
    product_name: product.product_name || null,
    status: product.status || null,
    category: product.category || null,
    product_type: product.marketing_intelligence?.product_type || null
  })),
  duplicate_keys: Array.from(new Set(duplicateKeys)),
  draft_products: draftProducts.map((product) => product.product_slug || product.product_name || product.product_id)
};

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);

if (result.duplicate_keys.length || result.draft_products.length) {
  process.exitCode = 1;
}

#!/usr/bin/env node
'use strict';

const fs = require('fs');
const {
  __stability: {
    createProject,
    updateProjectSetup,
    reviewProject,
    reviewProjectReadiness,
    getProjectBaselinePaths,
    getProductIntelligencePaths,
    buildGermanLaunchPlan,
    buildCampaignExecutionPackage,
    buildCampaignPublishPackage,
    readJsonFile,
    writeJsonFile,
    upsertCampaign
  }
} = require('../runtime/orchestrator-service/server');

const projectName = process.env.MH_STABILITY_PROJECT || 'corestabilitysmokev2';
const campaignName = 'stability-launch';
let passed = 0;

function assert(label, condition) {
  if (!condition) {
    throw new Error(`FAIL ${label}`);
  }
  passed += 1;
  console.log(`PASS ${label}`);
}

function ensureProject() {
  try {
    const created = createProject(projectName, 'United States', 'en', 'ecommerce', 'https://example.test');
    assert('project creation returns project file', Boolean(created.project_file));
    return;
  } catch (error) {
    if (!/already exists/i.test(error.message || '')) {
      throw error;
    }
  }

  const existing = reviewProject(projectName);
  assert('project creation baseline exists', existing.project_name === projectName);
}

function seedProductIntelligence() {
  const productPaths = getProductIntelligencePaths(projectName);
  const products = readJsonFile(productPaths.productsPath, []);
  const smokeProduct = {
    product_id: 'prod_stability_smoke',
    product_slug: 'stability-product',
    product_name: 'Stability Product',
    category: 'general',
    status: 'publish',
    marketing_intelligence: {
      benefits: ['quality', 'clarity']
    },
    prompt_pack: {
      branding: {
        hook: 'Stability without drama',
        visual_prompt: 'Clean product image',
        cta: 'Learn more'
      }
    },
    channel_pack: {
      instagram: {
        caption: 'Stability Product launch caption',
        visual_prompt: 'Clean product visual',
        format: 'square',
        goal: 'awareness'
      }
    }
  };

  const next = [
    smokeProduct,
    ...products.filter((item) => item.product_slug !== smokeProduct.product_slug)
  ];
  writeJsonFile(productPaths.productsPath, next);
}

function run() {
  ensureProject();

  const setup = updateProjectSetup(projectName, {
    project_name: projectName,
    project_type: 'ecommerce',
    website_url: 'https://example.test',
    project_status: 'active',
    brand_name: 'Core Stability Smoke',
    brand_promise: 'Reliable project persistence',
    brand_voice: 'clear',
    visual_identity: 'simple',
    offer_positioning: 'stability-first',
    market: 'United States',
    language: 'en',
    currency: 'USD',
    primary_goal: 'Verify core persistence',
    audience_primary: 'Operators',
    competitors: ['Manual process'],
    operator_notes: ['Smoke baseline']
  });
  assert('setup save returns baseline validation', Boolean(setup.baseline_validation));

  const paths = getProjectBaselinePaths(projectName);
  assert('brand-profile exists', fs.existsSync(paths.brandProfilePath));
  assert('assets-registry exists', fs.existsSync(paths.assetsRegistryPath));
  assert('source-of-truth registry exists', fs.existsSync(paths.sourceOfTruthRegistryPath));
  assert('ai-memory exists', fs.existsSync(paths.aiMemoryPath));
  assert('integrations registry exists', fs.existsSync(paths.integrationRegistryPath));

  const reloadedProject = reviewProject(projectName);
  const brandProfile = readJsonFile(paths.brandProfilePath, {});
  assert('setup reload keeps website', reloadedProject.website_url === 'https://example.test');
  assert('brand profile reload keeps brand name', brandProfile.brand_name === 'Core Stability Smoke');

  const readiness = reviewProjectReadiness(projectName);
  assert('readiness baseline has required files', Object.values(readiness.baseline_validation.required_files).every((item) => item.exists));

  const campaign = upsertCampaign(projectName, {
    id: campaignName,
    name: 'Stability Launch',
    objective: 'No-crash campaign creation',
    channels: ['instagram'],
    status: 'draft'
  });
  assert('campaign creation returns campaign id', campaign.id === campaignName);

  seedProductIntelligence();
  const launchPlan = buildGermanLaunchPlan(projectName);
  assert('launch plan handles product selection', launchPlan.product_selection.published_count >= 1);

  const executionPackage = buildCampaignExecutionPackage(projectName, campaignName, ['stability-product']);
  assert('campaign execution package includes product', executionPackage.total_products === 1);

  const publishPackage = buildCampaignPublishPackage(projectName, campaignName, 'instagram');
  assert('publish package creation is ready', publishPackage.ready_for_publish === true);

  console.log(`PASS Core stabilization smoke completed (${passed} assertions).`);
}

function cleanupRegistryEntry() {
  if (process.env.MH_STABILITY_KEEP_PROJECT === '1') {
    return;
  }

  const registryPath = '/opt/mh-assistant/data/projects/registry.json';
  const registry = readJsonFile(registryPath, []);
  if (!Array.isArray(registry)) {
    return;
  }

  writeJsonFile(
    registryPath,
    registry.filter((project) => project.project_name !== projectName)
  );
}

try {
  run();
} finally {
  cleanupRegistryEntry();
}

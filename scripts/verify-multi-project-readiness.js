#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

if (process.env.ALLOW_MUTATING_TESTS !== '1') {
  console.error('Refusing to run mutating multi-project readiness smoke test. Set ALLOW_MUTATING_TESTS=1 to create/update smoke project data.');
  process.exit(1);
}

const {
  __stability: {
    createProject,
    updateProjectSetup,
    reviewProject,
    reviewProjectReadiness,
    reviewProjectSources,
    reviewProjectCanonicalParity,
    getProjectBaselinePaths,
    registerProjectAsset,
    listProjectAssets,
    setProjectSourceOfTruth,
    readJsonFile,
    writeJsonFile
  }
} = require('../runtime/orchestrator-service/server');

const KEEP_PROJECT = process.env.MH_KEEP_MULTI_PROJECT === '1';
const projectName = (process.env.MH_MULTI_PROJECT_NAME || `multireadiness_${Date.now()}`).toLowerCase();
const ROOT = process.env.MH_ASSISTANT_ROOT || path.resolve(__dirname, '..');

const checks = [];

function assert(check, condition, details = {}) {
  checks.push({ check, pass: Boolean(condition), ...details });
  if (!condition) {
    throw new Error(`FAIL ${check}`);
  }
}

function ensureFile(filePath, content = '') {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function freshRequireServer() {
  const target = path.resolve(__dirname, '../runtime/orchestrator-service/server.js');
  delete require.cache[target];
  return require(target);
}

function cleanup(project) {
  if (KEEP_PROJECT) {
    return;
  }

  const registryPath = path.join(ROOT, 'data', 'projects', 'registry.json');
  const registry = readJsonFile(registryPath, []);
  if (Array.isArray(registry)) {
    writeJsonFile(
      registryPath,
      registry.filter((item) => String(item?.project_name || '').toLowerCase() !== project)
    );
  }

  const projectRoot = path.join(ROOT, 'data', 'projects', project);
  if (fs.existsSync(projectRoot)) {
    fs.rmSync(projectRoot, { recursive: true, force: true });
  }
}

function run() {
  const created = createProject(projectName, 'Germany', 'de', 'ecommerce', 'https://example-multi.test');
  assert('fresh project created', created.project_name === projectName, {
    project: created.project_name
  });

  const beforeReadiness = reviewProjectReadiness(projectName);

  const paths = getProjectBaselinePaths(projectName);
  const requiredFiles = {
    project_json: paths.projectFilePath,
    brand_profile_json: paths.brandProfilePath,
    assets_registry_json: paths.assetsRegistryPath,
    source_of_truth_registry_json: paths.sourceOfTruthRegistryPath,
    integrations_registry_json: paths.integrationsRegistryPath,
    ai_memory_json: paths.aiMemoryPath,
    ai_commands_json: paths.aiCommandsPath,
    ai_artifacts_json: paths.aiArtifactsPath,
    ai_recommendations_json: paths.aiRecommendationsPath
  };

  Object.entries(requiredFiles).forEach(([label, filePath]) => {
    assert(`baseline file exists: ${label}`, fs.existsSync(filePath), { file: filePath });
  });

  const requiredFolders = {
    campaigns: paths.campaignsDir,
    content: paths.contentDir,
    media: paths.mediaDir,
    publishing: paths.publishingDir,
    reports: paths.reportsDir,
    execution: paths.executionDir,
    telemetry: paths.telemetryDir,
    logs: paths.logsDir
  };

  Object.entries(requiredFolders).forEach(([label, folderPath]) => {
    assert(`baseline folder exists: ${label}`, fs.existsSync(folderPath), { folder: folderPath });
  });

  const setupPayload = {
    project_name: projectName,
    project_type: 'ecommerce',
    business_type: 'D2C grooming',
    website_url: 'https://example-multi.test',
    market: 'Germany',
    language: 'de',
    currency: 'EUR',
    tone: 'confident and premium',
    positioning: 'premium direct-to-consumer grooming',
    audience: 'style-conscious men 20-45',
    competitors: ['Competitor A', 'Competitor B'],
    goals: ['Increase direct sales', 'Improve retention'],
    primary_goal: 'Increase direct sales',
    secondary_goal: 'Improve retention',
    social_channels: ['instagram', 'facebook', 'tiktok'],
    brand_name: 'Multi Project Smoke',
    brand_promise: 'Precision grooming with reliable quality',
    brand_voice: 'direct and premium',
    offer_positioning: 'premium value',
    audience_primary: 'style-conscious men',
    audience_problem: 'inconsistent grooming results',
    differentiation: 'consistent premium outcomes',
    legal_docs: 'terms-v1.pdf',
    pricing_docs: 'pricing-v1.csv',
    campaign_docs: 'campaign-guidelines.md'
  };

  const setupResult = updateProjectSetup(projectName, setupPayload);
  assert('setup save returns project', setupResult.project === projectName);

  const reloaded = reviewProject(projectName);
  assert('setup reload keeps website', reloaded.website_url === setupPayload.website_url);
  assert('setup reload keeps social channels', Array.isArray(reloaded.social_channels) && reloaded.social_channels.length === 3);

  const brandProfile = readJsonFile(paths.brandProfilePath, {});
  const requiredBrandFields = [
    'brand_name',
    'business_type',
    'market',
    'language',
    'currency',
    'tone',
    'positioning',
    'audience',
    'competitors',
    'goals',
    'website',
    'social_channels'
  ];

  requiredBrandFields.forEach((field) => {
    const value = brandProfile[field];
    const valid = Array.isArray(value) ? value.length > 0 : Boolean(String(value || '').trim());
    assert(`brand profile populated: ${field}`, valid);
  });

  const sourcesReview = reviewProjectSources(projectName);
  const requiredSourceGroups = [
    'website',
    'social_links',
    'product_files',
    'brand_assets',
    'legal_docs',
    'pricing_docs',
    'campaign_docs'
  ];

  const requiredSources = sourcesReview.source_of_truth_registry?.required_sources || {};
  requiredSourceGroups.forEach((group) => {
    assert(`source-of-truth group exists: ${group}`, Boolean(requiredSources[group]));
    const status = String(requiredSources[group]?.status || '');
    assert(`source-of-truth status valid: ${group}`, ['missing', 'connected', 'verified', 'outdated'].includes(status), {
      status
    });
  });

  setProjectSourceOfTruth(projectName, 'product_files', '/imports/products.csv');
  setProjectSourceOfTruth(projectName, 'brand_assets', '/brand/logo-pack.zip');

  const sourceAfterSet = reviewProjectSources(projectName);
  assert(
    'source-of-truth product_files connected',
    ['connected', 'verified'].includes(String(sourceAfterSet.source_of_truth_registry.required_sources?.product_files?.status || ''))
  );

  const sampleAssetPath = path.join(paths.mediaDir, 'sample-asset.txt');
  ensureFile(sampleAssetPath, 'multi-project sample asset');
  const asset = registerProjectAsset(projectName, 'brand_guideline', sampleAssetPath);
  assert('asset registration returns id', Boolean(asset.id || asset.asset_id));

  const assets = listProjectAssets(projectName);
  const matchedAsset = assets.find((item) => item.file_path === sampleAssetPath);
  assert('asset registry persists asset', Boolean(matchedAsset));
  assert('asset registry has required schema fields', Boolean(
    matchedAsset
    && matchedAsset.id
    && matchedAsset.file_name
    && matchedAsset.type
    && matchedAsset.project
    && matchedAsset.source
    && Array.isArray(matchedAsset.tags)
    && matchedAsset.status
    && matchedAsset.created_at
    && matchedAsset.updated_at
    && Object.prototype.hasOwnProperty.call(matchedAsset, 'source_of_truth')
  ));

  const reloadedModule = freshRequireServer();
  const afterRestartProject = reloadedModule.__stability.reviewProject(projectName);
  assert('persistence survives simulated restart', afterRestartProject.website_url === setupPayload.website_url);

  const afterReadiness = reviewProjectReadiness(projectName);
  assert('readiness score is numeric', Number.isFinite(Number(afterReadiness.readiness_score)));
  assert('readiness includes 9 domains', Object.keys(afterReadiness.readiness_domains || {}).length === 9);

  const parity = reviewProjectCanonicalParity(projectName);
  assert('parity report generated', fs.existsSync(parity.report_path));

  const projectRoot = paths.baseDir;
  const jsonFiles = [];
  (function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    entries.forEach((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile() && full.endsWith('.json')) {
        jsonFiles.push(full);
      }
    });
  }(projectRoot));

  const leakedFiles = jsonFiles.filter((file) => /hairoticmen/i.test(fs.readFileSync(file, 'utf8')));
  assert('no hardcoded HAIROTICMEN leakage in new project files', leakedFiles.length === 0, {
    leaked_files: leakedFiles
  });

  const summary = {
    project: projectName,
    timestamp: new Date().toISOString(),
    tests_run: checks.length,
    passed: checks.filter((item) => item.pass).length,
    failed: checks.filter((item) => !item.pass).length,
    readiness_before: beforeReadiness.readiness_score,
    readiness_after: afterReadiness.readiness_score,
    readiness_domains_after: afterReadiness.readiness_domains,
    migration_report: parity,
    checks
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

try {
  run();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
} finally {
  cleanup(projectName);
}

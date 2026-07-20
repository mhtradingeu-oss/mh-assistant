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
    ensureProjectBaselineFiles,
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
const readContractProjectName = `${projectName}_read_contract`;
const ensureContractProjectName = `${projectName}_ensure_contract`;
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

function snapshotTree(rootPath) {
  const entries = [];

  (function walk(currentPath, relativePath = '') {
    fs.readdirSync(currentPath, { withFileTypes: true })
      .sort((left, right) => left.name.localeCompare(right.name))
      .forEach((entry) => {
        const fullPath = path.join(currentPath, entry.name);
        const relativeEntryPath = path.join(relativePath, entry.name);

        if (entry.isDirectory()) {
          entries.push({ path: relativeEntryPath, type: 'directory' });
          walk(fullPath, relativeEntryPath);
          return;
        }

        entries.push({
          path: relativeEntryPath,
          type: 'file',
          content_base64: fs.readFileSync(fullPath).toString('base64')
        });
      });
  }(rootPath));

  return JSON.stringify(entries);
}

function assertJsonFile(filePath, check) {
  assert(check, fs.existsSync(filePath), { file: filePath });
  JSON.parse(fs.readFileSync(filePath, 'utf8'));
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

  const legacyProjectRoot = path.join(ROOT, 'data', 'brand-assets', project);
  if (fs.existsSync(legacyProjectRoot)) {
    fs.rmSync(legacyProjectRoot, { recursive: true, force: true });
  }
}

function verifyPureAssetReadContract() {
  const paths = getProjectBaselinePaths(readContractProjectName);
  const createdAt = '2026-01-02T03:04:05.000Z';
  const updatedAt = '2026-02-03T04:05:06.000Z';
  const missingAssetPath = path.join(paths.baseDir, 'missing-asset.png');
  const records = [
    {
      id: 'durable-existing-id',
      asset_id: 'durable-existing-asset-id',
      type: 'brand_guideline',
      file_path: paths.projectFilePath,
      created_at: createdAt,
      updated_at: updatedAt,
      source: 'project_upload',
      status: 'connected'
    },
    {
      id: 'durable-missing-id',
      asset_id: 'durable-missing-asset-id',
      type: 'image',
      file_path: missingAssetPath,
      created_at: createdAt,
      updated_at: updatedAt,
      source: 'project_upload',
      status: 'connected'
    }
  ];

  fs.mkdirSync(paths.baseDir, { recursive: true });
  ensureFile(paths.projectFilePath, `${JSON.stringify({ project_name: readContractProjectName }, null, 2)}\n`);
  ensureFile(paths.assetsRegistryPath, `${JSON.stringify(records, null, 2)}\n`);

  const forbiddenArtifacts = [
    paths.brandProfilePath,
    paths.integrationsRegistryPath,
    `${paths.integrationsRegistryPath}.backup`,
    paths.integrationControlCenterPath,
    path.join(paths.opsDir, 'data-mismatches.json'),
    paths.sourceOfTruthRegistryPath
  ];
  forbiddenArtifacts.forEach((filePath) => {
    assert(`pure read fixture starts without ${path.relative(paths.baseDir, filePath)}`, !fs.existsSync(filePath));
  });

  const registryBefore = fs.readFileSync(paths.assetsRegistryPath);
  const treeBefore = snapshotTree(paths.baseDir);
  const firstRead = listProjectAssets(readContractProjectName);
  const treeAfterFirstRead = snapshotTree(paths.baseDir);
  const secondRead = listProjectAssets(readContractProjectName);
  const treeAfterSecondRead = snapshotTree(paths.baseDir);

  assert('pure asset read leaves complete project tree byte-for-byte identical after one call', treeAfterFirstRead === treeBefore);
  assert('repeated pure asset reads leave complete project tree byte-for-byte identical', treeAfterSecondRead === treeBefore);
  assert(
    'pure asset read leaves assets-registry.json byte-for-byte identical',
    fs.readFileSync(paths.assetsRegistryPath).equals(registryBefore)
  );
  forbiddenArtifacts.forEach((filePath) => {
    assert(`pure asset read does not create ${path.relative(paths.baseDir, filePath)}`, !fs.existsSync(filePath));
  });

  assert('pure asset read returns current projection count', firstRead.length === records.length);
  const existingProjection = firstRead.find((item) => item.id === records[0].id);
  const missingProjection = firstRead.find((item) => item.id === records[1].id);
  assert('durable id remains stable', existingProjection?.id === records[0].id);
  assert('durable asset_id remains stable', existingProjection?.asset_id === records[0].asset_id);
  assert('durable created_at remains stable', existingProjection?.created_at === createdAt);
  assert('durable updated_at remains stable', existingProjection?.updated_at === updatedAt);
  assert('transient exists is true for a current filesystem path', existingProjection?.exists === true);
  assert('transient exists is false for a missing filesystem path', missingProjection?.exists === false);
  assert(
    'repeated pure reads preserve durable ids and timestamps',
    JSON.stringify(secondRead.map(({ id, asset_id, created_at, updated_at }) => ({ id, asset_id, created_at, updated_at })))
      === JSON.stringify(firstRead.map(({ id, asset_id, created_at, updated_at }) => ({ id, asset_id, created_at, updated_at })))
  );

  const compatibleProjectionFields = [
    'id',
    'asset_id',
    'file_name',
    'file_path',
    'name',
    'title',
    'display_name',
    'type',
    'asset_type',
    'project',
    'source',
    'tags',
    'status',
    'readiness_status',
    'review_status',
    'created_at',
    'updated_at',
    'source_of_truth',
    'exists',
    'metadata'
  ];
  assert(
    'pure asset read projection remains compatible with current contract',
    compatibleProjectionFields.every((field) => Object.prototype.hasOwnProperty.call(existingProjection || {}, field))
  );

  let missingProjectError = null;
  try {
    listProjectAssets(`${readContractProjectName}_missing`);
  } catch (error) {
    missingProjectError = error;
  }
  assert('missing project throws exactly Project not found', missingProjectError?.message === 'Project not found');
}

function verifyExplicitEnsureContract() {
  const paths = getProjectBaselinePaths(ensureContractProjectName);
  const legacyAsset = {
    id: 'legacy-id',
    asset_id: 'legacy-asset-id',
    type: 'image',
    file_path: '/disposable/legacy-image.png',
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2025-01-02T00:00:00.000Z'
  };

  fs.mkdirSync(paths.baseDir, { recursive: true });
  ensureFile(paths.projectFilePath, `${JSON.stringify({ project_name: ensureContractProjectName }, null, 2)}\n`);
  ensureFile(paths.legacy.brandProfilePath, `${JSON.stringify({ brand_name: 'Legacy Ensure Fixture' }, null, 2)}\n`);
  ensureFile(paths.legacy.assetsRegistryPath, `${JSON.stringify([legacyAsset], null, 2)}\n`);
  ensureFile(paths.sourcesRegistryPath, `${JSON.stringify({ website: { value: 'https://legacy.example', status: 'connected' } }, null, 2)}\n`);

  const firstEnsure = ensureProjectBaselineFiles(ensureContractProjectName);
  assert('explicit ensure migrates legacy brand profile', firstEnsure.required_files.brand_profile.migrated === true);
  assert('explicit ensure migrates legacy asset registry', firstEnsure.required_files.assets_registry.migrated === true);
  assert('explicit ensure migrates legacy source-of-truth registry', firstEnsure.required_files.source_of_truth_registry.migrated === true);
  assert(
    'explicit ensure preserves migrated legacy asset data',
    readJsonFile(paths.assetsRegistryPath, [])[0]?.asset_id === legacyAsset.asset_id
  );

  const expectedArtifacts = [
    paths.brandProfilePath,
    paths.assetsRegistryPath,
    paths.sourcesRegistryPath,
    paths.sourceOfTruthRegistryPath,
    paths.integrationsRegistryPath,
    `${paths.integrationsRegistryPath}.backup`,
    paths.integrationControlCenterPath,
    paths.aiCommandsPath,
    paths.aiArtifactsPath,
    paths.aiRecommendationsPath,
    paths.aiMemoryPath
  ];
  expectedArtifacts.forEach((filePath) => {
    assertJsonFile(filePath, `explicit ensure creates valid JSON: ${path.relative(paths.baseDir, filePath)}`);
  });

  const secondEnsure = ensureProjectBaselineFiles(ensureContractProjectName);
  assert('repeated explicit ensure remains valid', secondEnsure.project === ensureContractProjectName);
  expectedArtifacts.forEach((filePath) => {
    assertJsonFile(filePath, `repeated explicit ensure preserves valid JSON: ${path.relative(paths.baseDir, filePath)}`);
  });
}

function run() {
  verifyPureAssetReadContract();
  verifyExplicitEnsureContract();

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

  const registryBeforeAssetRead = fs.readFileSync(paths.assetsRegistryPath, 'utf8');

  const assets = listProjectAssets(projectName);

  const registryAfterAssetRead = fs.readFileSync(paths.assetsRegistryPath, 'utf8');
  assert(
    'asset list read does not rewrite registry',
    registryAfterAssetRead === registryBeforeAssetRead
  );

  const repeatedAssets = listProjectAssets(projectName);
  const registryAfterRepeatedRead = fs.readFileSync(paths.assetsRegistryPath, 'utf8');

  assert(
    'repeated asset list read does not rewrite registry',
    registryAfterRepeatedRead === registryBeforeAssetRead
  );

  const stableAssetProjection = (items) => items.map((item) => ({
    id: item.id,
    asset_id: item.asset_id,
    file_path: item.file_path,
    created_at: item.created_at,
    updated_at: item.updated_at
  }));

  assert(
    'repeated asset list reads preserve ids and timestamps',
    JSON.stringify(stableAssetProjection(repeatedAssets))
      === JSON.stringify(stableAssetProjection(assets))
  );

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
  [projectName, readContractProjectName, ensureContractProjectName].forEach(cleanup);
}

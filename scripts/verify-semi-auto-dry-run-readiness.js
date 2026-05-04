#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = process.env.MH_ASSISTANT_ROOT || path.resolve(__dirname, '..');
const project = String(process.env.MH_PROJECT || process.argv[2] || 'hairoticmen').trim().toLowerCase();
const campaign = String(process.env.MH_CAMPAIGN || process.argv[3] || 'beard_launch').trim();
const channel = String(process.env.MH_CHANNEL || process.argv[4] || 'instagram').trim().toLowerCase();
const campaignSafe = campaign.replace(/[^a-z0-9_-]/gi, '_').toLowerCase();

function readJson(filePath, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (_) {
    return fallback;
  }
}

function existsAny(paths) {
  return paths.find((candidate) => fs.existsSync(candidate)) || '';
}

function listJsonFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((name) => name.endsWith('.json'))
    .map((name) => path.join(dir, name));
}

const projectBrandRoot = path.join(ROOT, 'data', 'projects', project, 'brand-assets');
const legacyRoot = path.join(ROOT, 'data', 'brand-assets', project);
const executionRoot = path.join(ROOT, 'data', 'execution', 'projects', project);

const campaignPackagePath = existsAny([
  path.join(executionRoot, 'campaign-execution', 'packages', `${campaignSafe}.json`),
  path.join(projectBrandRoot, 'campaign-execution', 'packages', `${campaignSafe}.json`),
  path.join(legacyRoot, 'campaign-execution', 'packages', `${campaignSafe}.json`)
]);

const mediaJobPath = existsAny([
  path.join(executionRoot, 'campaign-finalization', 'media-jobs', `${campaignSafe}_${channel}.json`),
  path.join(projectBrandRoot, 'campaign-finalization', 'media-jobs', `${campaignSafe}_${channel}.json`),
  path.join(legacyRoot, 'campaign-finalization', 'media-jobs', `${campaignSafe}_${channel}.json`)
]);

const emailPackagePath = existsAny([
  path.join(executionRoot, 'campaign-finalization', 'email', `${campaignSafe}.json`),
  path.join(projectBrandRoot, 'campaign-finalization', 'email', `${campaignSafe}.json`),
  path.join(legacyRoot, 'campaign-finalization', 'email', `${campaignSafe}.json`)
]);

const publishPackagePath = existsAny([
  path.join(executionRoot, 'campaign-finalization', 'publish-packages', `${campaignSafe}_${channel}.json`),
  path.join(projectBrandRoot, 'campaign-finalization', 'publish-packages', `${campaignSafe}_${channel}.json`),
  path.join(legacyRoot, 'campaign-finalization', 'publish-packages', `${campaignSafe}_${channel}.json`)
]);

const executionModePath = existsAny([
  path.join(executionRoot, 'execution', 'config', 'mode.json'),
  path.join(projectBrandRoot, 'execution', 'config', 'mode.json'),
  path.join(legacyRoot, 'execution', 'config', 'mode.json')
]);

const schedulerFiles = [
  ...listJsonFiles(path.join(executionRoot, 'publishing', 'scheduler')),
  ...listJsonFiles(path.join(projectBrandRoot, 'launch-ops', 'scheduler')),
  ...listJsonFiles(path.join(legacyRoot, 'launch-ops', 'scheduler'))
];

const executionResultFiles = [
  ...listJsonFiles(path.join(executionRoot, 'publishing', 'results')),
  ...listJsonFiles(path.join(projectBrandRoot, 'execution', 'results')),
  ...listJsonFiles(path.join(legacyRoot, 'execution', 'results'))
];

const mode = readJson(executionModePath, {});
const result = {
  project,
  campaign,
  channel,
  ready: false,
  checks: {
    campaign_package: Boolean(campaignPackagePath),
    media_job: Boolean(mediaJobPath),
    email_package: Boolean(emailPackagePath),
    publish_package: Boolean(publishPackagePath),
    semi_auto_mode: mode.mode === 'semi_auto',
    scheduler_job_available: schedulerFiles.length > 0,
    execution_result_available: executionResultFiles.length > 0
  },
  paths: {
    campaign_package: campaignPackagePath || null,
    media_job: mediaJobPath || null,
    email_package: emailPackagePath || null,
    publish_package: publishPackagePath || null,
    execution_mode: executionModePath || null,
    scheduler_jobs: schedulerFiles,
    execution_results: executionResultFiles
  }
};

result.ready = Object.values(result.checks).every(Boolean);
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);

if (!result.ready) {
  process.exitCode = 1;
}

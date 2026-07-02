#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

if (process.env.ALLOW_LOCAL_DRY_RUN !== '1') {
  console.error('Refusing to run controlled mutating dry run. Set ALLOW_LOCAL_DRY_RUN=1 to proceed.');
  process.exit(1);
}

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

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeJson(filePath, data) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function existsAny(paths) {
  return paths.find((candidate) => fs.existsSync(candidate)) || '';
}

function resolveBrandRoot() {
  const projectBrandRoot = path.join(ROOT, 'data', 'projects', project, 'brand-assets');
  const legacyRoot = path.join(ROOT, 'data', 'brand-assets', project);
  if (fs.existsSync(projectBrandRoot)) return projectBrandRoot;
  return legacyRoot;
}

const executionRoot = path.join(ROOT, 'data', 'execution', 'projects', project);
const projectBrandRoot = path.join(ROOT, 'data', 'projects', project, 'brand-assets');
const legacyRoot = path.join(ROOT, 'data', 'brand-assets', project);
const selectedBrandRoot = resolveBrandRoot();

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

const mode = readJson(executionModePath, { mode: 'semi_auto' });

const checks = {
  campaign_package: Boolean(campaignPackagePath),
  media_job: Boolean(mediaJobPath),
  email_package: Boolean(emailPackagePath),
  publish_package: Boolean(publishPackagePath),
  semi_auto_mode: String(mode.mode || '').trim().toLowerCase() === 'semi_auto'
};

const ready = Object.values(checks).every(Boolean);
if (!ready) {
  process.stdout.write(`${JSON.stringify({
    ok: false,
    reason: 'READINESS_FAILED',
    project,
    campaign,
    channel,
    checks,
    paths: {
      campaign_package: campaignPackagePath || null,
      media_job: mediaJobPath || null,
      email_package: emailPackagePath || null,
      publish_package: publishPackagePath || null,
      execution_mode: executionModePath || null
    }
  }, null, 2)}\n`);
  process.exit(1);
}

const publishPackage = readJson(publishPackagePath, {});
const now = new Date();
const nowIso = now.toISOString();
const stamp = nowIso.replace(/[:.]/g, '-');
const touched = [];

const schedulerDir = path.join(selectedBrandRoot, 'launch-ops', 'scheduler');
const resultsDir = path.join(selectedBrandRoot, 'execution', 'results');
const dryRunLogDir = path.join(ROOT, 'data', 'projects', project, 'execution', 'logs');

const jobId = `dryrun_${Date.now()}`;
const totalAssets = Number(publishPackage.total_assets || 0) || 0;

const schedulerRecord = {
  job_id: jobId,
  project,
  campaign_name: campaign,
  wave_name: `campaign_${campaignSafe}`,
  channel,
  scheduled_for: nowIso,
  created_at: nowIso,
  updated_at: nowIso,
  status: 'scheduled',
  mode: 'semi_auto',
  total_assets: totalAssets,
  connector_file: publishPackagePath,
  dry_run: true,
  local_only: true,
  external_publish: false,
  notes: ['Controlled local dry run scheduler record. No external publish performed.']
};

const executionStatus = channel === 'email'
  ? 'ready_for_manual_send'
  : ['instagram', 'facebook', 'tiktok', 'youtube'].includes(channel)
    ? 'ready_for_manual_publish'
    : ['amazon', 'ebay'].includes(channel)
      ? 'ready_for_manual_handoff'
      : 'ready_for_review';

const actionType = channel === 'email'
  ? 'manual_send'
  : ['instagram', 'facebook', 'tiktok', 'youtube'].includes(channel)
    ? 'manual_publish'
    : ['amazon', 'ebay'].includes(channel)
      ? 'manual_marketplace_handoff'
      : 'manual_review';

const executionResult = {
  execution_id: `exec_${Date.now()}`,
  project,
  campaign_name: campaign,
  job_id: jobId,
  wave_name: `campaign_${campaignSafe}`,
  channel,
  mode: 'semi_auto',
  executed_at: nowIso,
  source_status: 'scheduled',
  execution_status: executionStatus,
  action_type: actionType,
  dry_run: true,
  local_only: true,
  external_publish: false,
  notes: ['Controlled local dry run execution result. Manual handoff only.']
};

const schedulerPath = path.join(schedulerDir, `${jobId}.json`);
const executionResultPath = path.join(resultsDir, `${jobId}.json`);
const dryRunLogPath = path.join(dryRunLogDir, `controlled-dry-run-${stamp}.json`);

writeJson(schedulerPath, schedulerRecord);
touched.push(schedulerPath);

writeJson(executionResultPath, executionResult);
touched.push(executionResultPath);

const report = {
  ok: true,
  project,
  campaign,
  channel,
  mode: 'semi_auto',
  started_at: nowIso,
  completed_at: new Date().toISOString(),
  checks,
  paths: {
    campaign_package: campaignPackagePath,
    media_job: mediaJobPath,
    email_package: emailPackagePath,
    publish_package: publishPackagePath,
    execution_mode: executionModePath,
    scheduler_record: schedulerPath,
    execution_result: executionResultPath
  },
  final_result: executionResult,
  touched_files: touched,
  external_publish: false
};

writeJson(dryRunLogPath, report);
touched.push(dryRunLogPath);
report.touched_files = touched;

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

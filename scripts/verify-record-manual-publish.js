#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

if (process.env.ALLOW_LOCAL_MANUAL_RECORD !== '1') {
  console.error('Refusing to run manual publish recording verification. Set ALLOW_LOCAL_MANUAL_RECORD=1 to proceed.');
  process.exit(1);
}

const ROOT = process.env.MH_ASSISTANT_ROOT || path.resolve(__dirname, '..');
const {
  __stability: {
    recordManualPublish
  }
} = require('../runtime/orchestrator-service/server');

const project = 'hairoticmen';
const campaign = 'beard_launch';
const channel = 'instagram';
const jobId = 'dryrun_test_manual_record';
const operator = 'local_operator';
const postUrl = 'https://www.instagram.com/p/test-local-record';
const notes = 'local verification only';

function collectFileHashes(targetPaths) {
  const hashes = new Map();

  for (const targetPath of targetPaths) {
    if (!fs.existsSync(targetPath)) continue;
    const stat = fs.statSync(targetPath);
    if (stat.isDirectory()) {
      const entries = fs.readdirSync(targetPath);
      for (const entry of entries) {
        const full = path.join(targetPath, entry);
        const entryStat = fs.statSync(full);
        if (entryStat.isFile()) {
          hashes.set(full, fs.readFileSync(full));
        }
      }
    } else if (stat.isFile()) {
      hashes.set(targetPath, fs.readFileSync(targetPath));
    }
  }

  return hashes;
}

function diffChangedPaths(before, after) {
  const changed = [];
  const allPaths = new Set([...before.keys(), ...after.keys()]);

  for (const filePath of allPaths) {
    const beforeBuf = before.get(filePath);
    const afterBuf = after.get(filePath);

    if (!beforeBuf && afterBuf) {
      changed.push(filePath);
      continue;
    }
    if (beforeBuf && !afterBuf) {
      changed.push(filePath);
      continue;
    }
    if (beforeBuf && afterBuf && Buffer.compare(beforeBuf, afterBuf) !== 0) {
      changed.push(filePath);
    }
  }

  return changed.sort();
}

const watchPaths = [
  path.join(ROOT, 'data', 'projects', project, 'execution', 'manual-publish'),
  path.join(ROOT, 'data', 'projects', project, 'brand-assets', 'execution', 'results'),
  path.join(ROOT, 'data', 'brand-assets', project, 'execution', 'results'),
  path.join(ROOT, 'data', 'execution', 'projects', project, 'publishing', 'results')
];

const before = collectFileHashes(watchPaths);

const result = recordManualPublish(
  project,
  campaign,
  channel,
  jobId,
  operator,
  postUrl,
  notes
);

const after = collectFileHashes(watchPaths);
const changedPaths = diffChangedPaths(before, after);

if (!result || !result.file_path || !fs.existsSync(result.file_path)) {
  throw new Error('Manual publish record file was not created.');
}

const record = JSON.parse(fs.readFileSync(result.file_path, 'utf8'));
if (record.external_publish !== false) {
  throw new Error('external_publish must be false.');
}
if (record.manual_publish !== true) {
  throw new Error('manual_publish must be true.');
}

const allowedPrefixes = [
  path.join(ROOT, 'data', 'projects', project, 'execution', 'manual-publish') + path.sep,
  path.join(ROOT, 'data', 'projects', project, 'brand-assets', 'execution', 'results') + path.sep,
  path.join(ROOT, 'data', 'brand-assets', project, 'execution', 'results') + path.sep,
  path.join(ROOT, 'data', 'execution', 'projects', project, 'publishing', 'results') + path.sep
];

const unexpected = changedPaths.filter((filePath) => !allowedPrefixes.some((prefix) => filePath.startsWith(prefix)));
if (unexpected.length) {
  throw new Error(`Unexpected files changed: ${unexpected.join(', ')}`);
}

process.stdout.write(`${JSON.stringify({
  ok: true,
  verification: 'manual_publish_recording',
  project,
  campaign,
  channel,
  job_id: jobId,
  record_file: result.file_path,
  external_publish: record.external_publish,
  manual_publish: record.manual_publish,
  touched_files: result.touched_files || [],
  changed_files: changedPaths,
  warnings: result.warnings || []
}, null, 2)}\n`);

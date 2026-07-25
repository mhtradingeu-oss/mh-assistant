#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const REPOSITORY_ROOT = path.resolve(__dirname, '..');
const SERVER_PATH = path.join(
  REPOSITORY_ROOT,
  'runtime',
  'orchestrator-service',
  'server.js'
);

function listTree(root) {
  if (!fs.existsSync(root)) {
    return [];
  }

  const entries = [];

  function visit(current, relativeBase) {
    const names = fs.readdirSync(current).sort();

    for (const name of names) {
      const absolute = path.join(current, name);
      const relative = path.join(relativeBase, name);
      const stat = fs.lstatSync(absolute);

      if (stat.isDirectory()) {
        entries.push(`${relative}/`);
        visit(absolute, relative);
      } else if (stat.isFile()) {
        const content = fs.readFileSync(absolute);
        entries.push(`${relative}:${content.toString('base64')}`);
      } else {
        entries.push(`${relative}:OTHER`);
      }
    }
  }

  visit(root, '');
  return entries;
}

function parseJsonDocuments(raw) {
  const source = String(raw || '');
  const documents = [];
  let position = 0;

  while (position < source.length) {
    while (
      position < source.length &&
      /\s/.test(source[position])
    ) {
      position += 1;
    }

    if (position >= source.length) {
      break;
    }

    const start = position;
    let depth = 0;
    let inString = false;
    let escaped = false;
    let completed = false;

    for (; position < source.length; position += 1) {
      const character = source[position];

      if (inString) {
        if (escaped) {
          escaped = false;
          continue;
        }

        if (character === '\\') {
          escaped = true;
          continue;
        }

        if (character === '"') {
          inString = false;
        }

        continue;
      }

      if (character === '"') {
        inString = true;
        continue;
      }

      if (character === '{' || character === '[') {
        depth += 1;
        continue;
      }

      if (character === '}' || character === ']') {
        depth -= 1;

        if (depth === 0) {
          position += 1;

          const documentText = source.slice(start, position);

          try {
            documents.push(JSON.parse(documentText));
          } catch (error) {
            throw new Error(
              `Invalid JSON document in child stdout at offset ${start}: ` +
              error.message
            );
          }

          completed = true;
          break;
        }
      }
    }

    if (!completed) {
      throw new Error(
        `Incomplete JSON document in child stdout at offset ${start}`
      );
    }
  }

  return documents;
}

function extractContractResult(raw) {
  const documents = parseJsonDocuments(raw);

  const contractDocuments = documents.filter(
    (document) =>
      document &&
      typeof document === 'object' &&
      !Array.isArray(document) &&
      document.contract === 'backbone-read-write'
  );

  if (contractDocuments.length !== 1) {
    throw new Error(
      'Expected exactly one backbone-read-write contract document, found ' +
      contractDocuments.length
    );
  }

  return contractDocuments[0];
}

function buildChildProgram() {
  return String.raw`
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.env.MH_ASSISTANT_ROOT;
const serverPath = process.env.MH_SERVER_PATH;
const projectName = process.env.MH_TEST_PROJECT;
const campaignName = process.env.MH_TEST_CAMPAIGN;

assert.ok(root, 'MH_ASSISTANT_ROOT is required');
assert.ok(serverPath, 'MH_SERVER_PATH is required');
assert.ok(projectName, 'MH_TEST_PROJECT is required');
assert.ok(campaignName, 'MH_TEST_CAMPAIGN is required');

process.env.MH_DISABLE_READ_TELEMETRY = '1';

const {
  __stability: {
    reviewProjectReadiness,
    upsertCampaign
  }
} = require(serverPath);

assert.equal(typeof reviewProjectReadiness, 'function');
assert.equal(typeof upsertCampaign, 'function');

const projectDir = path.join(root, 'data', 'projects', projectName);
const opsDir = path.join(projectDir, 'ops');
const campaignsPath = path.join(opsDir, 'campaigns.json');
const systemPath = path.join(opsDir, 'system.json');
const eventsPath = path.join(opsDir, 'events.json');

function listTree(targetRoot) {
  if (!fs.existsSync(targetRoot)) {
    return [];
  }

  const entries = [];

  function visit(current, relativeBase) {
    const names = fs.readdirSync(current).sort();

    for (const name of names) {
      const absolute = path.join(current, name);
      const relative = path.join(relativeBase, name);
      const stat = fs.lstatSync(absolute);

      if (stat.isDirectory()) {
        entries.push(relative + '/');
        visit(absolute, relative);
      } else if (stat.isFile()) {
        const content = fs.readFileSync(absolute);
        entries.push(relative + ':' + content.toString('base64'));
      } else {
        entries.push(relative + ':OTHER');
      }
    }
  }

  visit(targetRoot, '');
  return entries;
}

assert.equal(fs.existsSync(projectDir), true, 'fixture project must exist');
assert.equal(fs.existsSync(opsDir), false, 'ops must be absent before read');

const treeBeforeRead = listTree(projectDir);
const readiness = reviewProjectReadiness(projectName);
const treeAfterRead = listTree(projectDir);

assert.ok(readiness && typeof readiness === 'object');
assert.deepEqual(
  treeAfterRead,
  treeBeforeRead,
  'reviewProjectReadiness must not mutate the project tree'
);
assert.equal(
  fs.existsSync(opsDir),
  false,
  'reviewProjectReadiness must not create ops'
);

const campaign = upsertCampaign(projectName, {
  name: campaignName,
  objective: 'Verify explicit writer filesystem initialization',
  actor: 'backbone-contract-verifier'
});

assert.equal(fs.existsSync(opsDir), true, 'writer must create ops');
assert.equal(fs.existsSync(systemPath), true, 'writer must create system.json');
assert.equal(fs.existsSync(campaignsPath), true, 'writer must create campaigns.json');
assert.equal(fs.existsSync(eventsPath), true, 'writer must create events.json');

const campaigns = JSON.parse(fs.readFileSync(campaignsPath, 'utf8'));
const events = JSON.parse(fs.readFileSync(eventsPath, 'utf8'));
const system = JSON.parse(fs.readFileSync(systemPath, 'utf8'));

assert.ok(Array.isArray(campaigns), 'campaigns.json must contain an array');
assert.ok(Array.isArray(events), 'events.json must contain an array');
assert.ok(system && typeof system === 'object', 'system.json must contain an object');

const storedCampaigns = campaigns.filter((item) => item && item.id === campaign.id);

assert.equal(storedCampaigns.length, 1, 'campaign must be stored exactly once');
assert.equal(campaign.project, projectName);
assert.equal(campaign.name, campaignName);
assert.equal(storedCampaigns[0].project, projectName);
assert.equal(storedCampaigns[0].name, campaignName);

const campaignEvents = events.filter(
  (item) =>
    item &&
    item.entity_type === 'campaign' &&
    item.entity_id === campaign.id
);

assert.ok(
  campaignEvents.length >= 1,
  'campaign writer must append a campaign event'
);

process.stdout.write(JSON.stringify({
  contract: 'backbone-read-write',
  project: projectName,
  pure_read: {
    passed: true,
    readiness_returned_object: true,
    filesystem_changed: false,
    ops_created: false
  },
  writer: {
    passed: true,
    ops_created: true,
    system_created: true,
    campaigns_created: true,
    events_created: true,
    campaign_id: campaign.id,
    campaign_stored_once: true,
    event_recorded: true
  },
  sandbox: {
    root,
    isolated: true
  }
}));
`;
}

function run() {
  const fixtureRoot = fs.mkdtempSync(
    path.join(os.tmpdir(), 'mh-backbone-contract-')
  );

  const projectName = 'backbone-contract-fixture';
  const campaignName = 'Backbone Contract Campaign';
  const projectDir = path.join(
    fixtureRoot,
    'data',
    'projects',
    projectName
  );

  let result;

  try {
    fs.mkdirSync(projectDir, { recursive: true });

    fs.writeFileSync(
      path.join(projectDir, 'project.json'),
      `${JSON.stringify({
        id: projectName,
        name: 'Backbone Contract Fixture',
        status: 'draft'
      }, null, 2)}\n`,
      'utf8'
    );

    const child = spawnSync(
      process.execPath,
      ['-e', buildChildProgram()],
      {
        cwd: REPOSITORY_ROOT,
        env: {
          ...process.env,
          MH_ASSISTANT_ROOT: fixtureRoot,
          MH_SERVER_PATH: SERVER_PATH,
          MH_TEST_PROJECT: projectName,
          MH_TEST_CAMPAIGN: campaignName,
          MH_DISABLE_READ_TELEMETRY: '1'
        },
        encoding: 'utf8',
        maxBuffer: 10 * 1024 * 1024
      }
    );

    if (child.status !== 0) {
      process.stderr.write(child.stdout || '');
      process.stderr.write(child.stderr || '');
      throw new Error(
        `Backbone contract child failed with status ${child.status}`
      );
    }

    assert.equal(
      child.signal,
      null,
      'child process must not terminate by signal'
    );

    result = extractContractResult(child.stdout);

    assert.equal(result.contract, 'backbone-read-write');
    assert.equal(result.pure_read.passed, true);
    assert.equal(result.pure_read.filesystem_changed, false);
    assert.equal(result.pure_read.ops_created, false);
    assert.equal(result.writer.passed, true);
    assert.equal(result.writer.ops_created, true);
    assert.equal(result.writer.campaign_stored_once, true);
    assert.equal(result.writer.event_recorded, true);

  } finally {
    fs.rmSync(fixtureRoot, { recursive: true, force: true });
  }

  assert.equal(
    fs.existsSync(fixtureRoot),
    false,
    'sandbox must be removed'
  );

  assert.ok(result, 'child result must exist before certification');

  result.sandbox.cleanup = true;

  process.stdout.write(
    `${JSON.stringify({
      contract: result.contract,
      certified: true,
      pure_read: result.pure_read,
      writer: result.writer,
      sandbox: result.sandbox
    }, null, 2)}\n`
  );
}

try {
  run();
} catch (error) {
  process.stderr.write(
    `${error && error.stack ? error.stack : String(error)}\n`
  );
  process.exitCode = 1;
}

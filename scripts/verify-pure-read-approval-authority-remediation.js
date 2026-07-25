#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const REPOSITORY_ROOT = path.resolve(__dirname, "..");
const TEST_ROOT = process.env.MH_ASSISTANT_ROOT
  ? path.resolve(process.env.MH_ASSISTANT_ROOT)
  : REPOSITORY_ROOT;
const BACKBONE_PATH = path.join(
  REPOSITORY_ROOT,
  "runtime/orchestrator-service/lib/ops/backbone.js"
);
const READER_PATH = path.join(
  REPOSITORY_ROOT,
  "runtime/orchestrator-service/lib/workspace/workspace-governance-approval-reader.js"
);
const GOVERNANCE_PARTITION_PATH = path.join(
  TEST_ROOT,
  "data/projects/governance-system"
);
const WORKSPACES_PATH = path.join(TEST_ROOT, "data/workspaces");
const MISSING_APPROVAL_ID = "approval_k6b_missing_001";

function inventory(root) {
  const files = [];

  function visit(current) {
    if (!fs.existsSync(current)) return;
    for (const entry of fs.readdirSync(current, { withFileTypes: true })
      .sort((left, right) => left.name.localeCompare(right.name))) {
      const target = path.join(current, entry.name);
      if (entry.isDirectory()) {
        visit(target);
      } else {
        files.push({
          path: path.relative(root, target),
          hash: crypto.createHash("sha256").update(fs.readFileSync(target)).digest("hex")
        });
      }
    }
  }

  visit(root);
  return files;
}

function withoutComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
}

function runIsolatedRead(root, project, options = {}) {
  const program = `
    const backbone = require(process.env.K6B_BACKBONE_PATH);
    try {
      const result = backbone.listApprovals(
        process.env.K6B_PROJECT,
        JSON.parse(process.env.K6B_OPTIONS)
      );
      process.stdout.write(JSON.stringify({ ok: true, result }));
    } catch (error) {
      process.stdout.write(JSON.stringify({
        ok: false,
        code: error && error.code,
        message: error && error.message
      }));
    }
  `;
  const child = spawnSync(process.execPath, ["-e", program], {
    cwd: REPOSITORY_ROOT,
    env: {
      ...process.env,
      MH_ASSISTANT_ROOT: root,
      K6B_BACKBONE_PATH: BACKBONE_PATH,
      K6B_PROJECT: project,
      K6B_OPTIONS: JSON.stringify(options)
    },
    encoding: "utf8"
  });
  assert.equal(child.status, 0, child.stderr);
  return JSON.parse(child.stdout);
}

function approval(id, status, extra = {}) {
  return {
    id,
    project: "fixture-governance",
    entity_type: "workspace",
    entity_id: "MH Trading",
    status,
    nested: { preserved: true },
    ...extra
  };
}

function staticSafety() {
  const backboneSource = fs.readFileSync(BACKBONE_PATH, "utf8");
  const readerSource = fs.readFileSync(READER_PATH, "utf8");
  const pureReadBlock = withoutComments(backboneSource.match(
    /function resolveApprovalReadPath[\s\S]*?\nfunction writeCollection/
  )[0]);
  const listBlock = withoutComments(backboneSource.match(
    /function listApprovals[\s\S]*?\n}\n\nfunction decideApproval/
  )[0]);
  const createBlock = withoutComments(backboneSource.match(
    /function createApproval[\s\S]*?\n}\n\nfunction listApprovals/
  )[0]);
  const decideOpening = withoutComments(backboneSource.match(
    /function decideApproval[\s\S]*?const index =/
  )[0]);

  const forbiddenPureReadCalls = [
    /\bensureDir\s*\(/,
    /\bensureOperationsFiles\s*\(/,
    /\bwriteJsonFile\s*\(/,
    /\bmkdir(?:Sync)?\s*\(/,
    /\.writeFile(?:Sync)?\s*\(/,
    /\.appendFile(?:Sync)?\s*\(/,
    /\.rename(?:Sync)?\s*\(/,
    /\.unlink(?:Sync)?\s*\(/,
    /\bcreateApproval\s*\(/,
    /\bdecideApproval\s*\(/,
    /\bappendEvent\s*\(/,
    /\bcreateNotification\s*\(/,
    /\bupsertQueueItem\s*\(/,
    /\.createWorkspace\s*\(/
  ];
  forbiddenPureReadCalls.forEach((pattern) => {
    assert.equal(pattern.test(pureReadBlock), false, `pure read contains ${pattern}`);
  });
  assert.match(pureReadBlock, /fs\.existsSync\s*\(/);
  assert.match(pureReadBlock, /fs\.readFileSync\s*\(/);
  assert.match(listBlock, /readApprovalCollectionReadOnly\s*\(/);
  assert.doesNotMatch(listBlock, /(?:getOperationsPaths|ensureOperationsPaths)\s*\(/);
  assert.match(createBlock, /ensureOperationsPaths\s*\(/);
  assert.ok(
    decideOpening.indexOf("fs.existsSync(resolveApprovalReadPath(projectName))")
      < decideOpening.indexOf("ensureOperationsPaths(projectName)")
  );
  assert.match(readerSource, /\blistApprovals\b/);
  assert.doesNotMatch(readerSource, /\bcreateApproval\b|\bdecideApproval\b/);
  assert.doesNotMatch(
    `${pureReadBlock}\n${listBlock}\n${readerSource}`,
    /data\/approvals\.json/
  );
}

function existingStoreCompatibility() {
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mh-k6b-"));
  try {
    const opsRoot = path.join(
      fixtureRoot,
      "data/projects/fixture-governance/ops"
    );
    fs.mkdirSync(opsRoot, { recursive: true });
    const records = [
      approval("approval_fixture_003", "approved", { rank: 3 }),
      approval("approval_fixture_002", "pending", { rank: 2 }),
      approval("approval_fixture_001", "rejected", { rank: 1 })
    ];
    fs.writeFileSync(
      path.join(opsRoot, "approvals.json"),
      JSON.stringify(records, null, 2)
    );

    const before = inventory(fixtureRoot);
    const all = runIsolatedRead(fixtureRoot, "fixture-governance", { limit: 10 });
    const limited = runIsolatedRead(fixtureRoot, "fixture-governance", { limit: 2 });
    const after = inventory(fixtureRoot);

    assert.deepEqual(all, { ok: true, result: records });
    assert.deepEqual(limited, { ok: true, result: records.slice(0, 2) });
    assert.deepEqual(after, before);

    const malformedRoot = path.join(fixtureRoot, "malformed-root");
    const malformedOps = path.join(
      malformedRoot,
      "data/projects/fixture-governance/ops"
    );
    fs.mkdirSync(malformedOps, { recursive: true });
    fs.writeFileSync(path.join(malformedOps, "approvals.json"), "{bad json");
    const malformedBefore = inventory(malformedRoot);
    const malformed = runIsolatedRead(
      malformedRoot,
      "fixture-governance",
      { limit: 10 }
    );
    const malformedAfter = inventory(malformedRoot);
    assert.equal(malformed.ok, false);
    assert.equal(malformed.code, "APPROVAL_STORAGE_CORRUPT_JSON");
    assert.deepEqual(malformedAfter, malformedBefore);

    return {
      existing_records: records.length,
      limit_preserved: true,
      durable_order_preserved: true,
      record_shapes_preserved: true,
      malformed_fails_closed_without_quarantine: true
    };
  } finally {
    fs.rmSync(fixtureRoot, { recursive: true, force: true });
  }
}

function dynamicProductionNonMutation() {
  assert.equal(fs.existsSync(GOVERNANCE_PARTITION_PATH), false);
  assert.equal(fs.existsSync(WORKSPACES_PATH), false);

  const dataBefore = inventory(path.join(TEST_ROOT, "data"));
  const auditBefore = inventory(path.join(TEST_ROOT, ".mh-audit"));
  const {
    listApprovals
  } = require(BACKBONE_PATH);
  const {
    WorkspaceGovernanceApprovalReaderError,
    readWorkspaceGovernanceApproval
  } = require(READER_PATH);

  assert.deepEqual(listApprovals("governance-system", { limit: 1000 }), []);
  assert.throws(
    () => readWorkspaceGovernanceApproval(MISSING_APPROVAL_ID),
    (error) => error instanceof WorkspaceGovernanceApprovalReaderError
      && error.code === "GOVERNANCE_APPROVAL_NOT_FOUND"
      && error.statusCode === 404
  );

  assert.equal(fs.existsSync(GOVERNANCE_PARTITION_PATH), false);
  assert.equal(fs.existsSync(WORKSPACES_PATH), false);
  assert.deepEqual(inventory(path.join(TEST_ROOT, "data")), dataBefore);
  assert.deepEqual(inventory(path.join(TEST_ROOT, ".mh-audit")), auditBefore);

  return {
    missing_store_result: [],
    missing_approval_error: "GOVERNANCE_APPROVAL_NOT_FOUND",
    data_tree_unchanged: true,
    audit_tree_unchanged: true,
    governance_partition_absent: true,
    workspaces_absent: true
  };
}

function run() {
  staticSafety();
  const dynamic = dynamicProductionNonMutation();
  const compatibility = existingStoreCompatibility();

  console.log(JSON.stringify({
    ok: true,
    phase: "K-6B",
    canonical_pure_read_capability: "listApprovals",
    static_safety: "PASS",
    dynamic,
    compatibility,
    approval_created: false,
    approval_decided: false,
    k5c_apply_executed: false,
    workspace_created: false,
    workspace_id_created: false,
    data_workspaces_written: false
  }, null, 2));
}

run();

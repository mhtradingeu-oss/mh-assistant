#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const REPOSITORY_ROOT = path.resolve(__dirname, "..");
const TEST_ROOT_VALUE = process.env.MH_ASSISTANT_ROOT;

if (!TEST_ROOT_VALUE) {
  throw new Error(
    "MH_ASSISTANT_ROOT is required for isolated K-6A-R2 verification"
  );
}

const TEST_ROOT = path.resolve(TEST_ROOT_VALUE);

if (
  TEST_ROOT === REPOSITORY_ROOT ||
  TEST_ROOT.startsWith(REPOSITORY_ROOT + path.sep)
) {
  throw new Error(
    "K-6A-R2 verification must not target the repository root"
  );
}
const RUNTIME = path.join(REPOSITORY_ROOT, "runtime/orchestrator-service");
const TEST_KEY = "phase-k6a-r-control-key";
const PRINCIPAL_ID = "legacy-control-center-key";
const APPROVAL_ID = "approval_mh_trading_workspace_k6ar_001";
const TIMESTAMP = "2026-07-24T17:00:00.000Z";
const GOVERNANCE_PATH = path.join(TEST_ROOT, "data/projects/governance-system");
const WORKSPACES_PATH = path.join(TEST_ROOT, "data/workspaces");

function inventory(root) {
  const result = [];
  function visit(current) {
    if (!fs.existsSync(current)) return;
    for (const entry of fs.readdirSync(current, { withFileTypes: true })
      .sort((left, right) => left.name.localeCompare(right.name))) {
      const target = path.join(current, entry.name);
      if (entry.isDirectory()) visit(target);
      else result.push({
        path: path.relative(root, target),
        hash: crypto.createHash("sha256").update(fs.readFileSync(target)).digest("hex")
      });
    }
  }
  visit(root);
  return result;
}

function assertDeepFrozen(value) {
  if (!value || typeof value !== "object") return;
  assert.equal(Object.isFrozen(value), true);
  Object.values(value).forEach(assertDeepFrozen);
}

function approval(overrides = {}) {
  return {
    id: APPROVAL_ID,
    project: "governance-system",
    entity_type: "workspace",
    entity_id: "MH Trading",
    mutation_type: "workspace_creation",
    approval_type: "workspace_creation",
    requested_action: "CREATE_WORKSPACE",
    requested_by: PRINCIPAL_ID,
    requested_for: "MH Trading Owner",
    reviewer: "MH Trading Owner",
    status: "approved",
    decided_by: PRINCIPAL_ID,
    decided_at: TIMESTAMP,
    decision_at: TIMESTAMP,
    ...overrides
  };
}

function request({
  credential,
  body = { approval_id: APPROVAL_ID },
  query = {},
  headers = {}
} = {}) {
  const normalizedHeaders = Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value])
  );
  if (credential !== undefined) {
    normalizedHeaders.authorization = `Bearer ${credential}`;
  }
  return {
    method: "POST",
    path: "/api/governance/workspaces/mh-trading/creation/prepare",
    body,
    query,
    headers: normalizedHeaders,
    get(name) {
      return this.headers[String(name || "").toLowerCase()];
    }
  };
}

function response() {
  const result = { status: 200, body: null };
  return {
    result,
    status(value) {
      result.status = value;
      return this;
    },
    json(value) {
      result.body = value;
      return this;
    }
  };
}

async function invoke(middleware, req, res) {
  let nextCalled = false;
  let nextError = null;
  await middleware(req, res, (error) => {
    nextCalled = true;
    nextError = error || null;
  });
  return { nextCalled, nextError };
}

function isolatedApprovalReadCompatibility(backbonePath) {
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mh-k6ar-"));
  try {
    const ops = path.join(fixtureRoot, "data/projects/fixture/ops");
    fs.mkdirSync(ops, { recursive: true });
    const records = [
      { ...approval({ id: "approval_fixture_003", project: "fixture" }), rank: 3 },
      { ...approval({ id: "approval_fixture_002", project: "fixture" }), rank: 2 },
      { ...approval({ id: "approval_fixture_001", project: "fixture" }), rank: 1 }
    ];
    fs.writeFileSync(path.join(ops, "approvals.json"), JSON.stringify(records, null, 2));
    const before = inventory(fixtureRoot);
    const program = `
      const { listApprovals } = require(process.env.K6AR_BACKBONE);
      try {
        process.stdout.write(JSON.stringify({
          ok: true,
          result: listApprovals("fixture", { limit: Number(process.env.K6AR_LIMIT) })
        }));
      } catch (error) {
        process.stdout.write(JSON.stringify({ ok: false, code: error.code }));
      }
    `;
    function run(root, limit) {
      const child = spawnSync(process.execPath, ["-e", program], {
        cwd: REPOSITORY_ROOT,
        env: {
          ...process.env,
          MH_ASSISTANT_ROOT: root,
          K6AR_BACKBONE: backbonePath,
          K6AR_LIMIT: String(limit)
        },
        encoding: "utf8"
      });
      assert.equal(child.status, 0, child.stderr);
      return JSON.parse(child.stdout);
    }
    assert.deepEqual(run(fixtureRoot, 10), { ok: true, result: records });
    assert.deepEqual(run(fixtureRoot, 2), { ok: true, result: records.slice(0, 2) });
    assert.deepEqual(inventory(fixtureRoot), before);

    const malformedRoot = path.join(fixtureRoot, "malformed");
    const malformedOps = path.join(malformedRoot, "data/projects/fixture/ops");
    fs.mkdirSync(malformedOps, { recursive: true });
    fs.writeFileSync(path.join(malformedOps, "approvals.json"), "{broken");
    const malformedBefore = inventory(malformedRoot);
    assert.deepEqual(run(malformedRoot, 10), {
      ok: false,
      code: "APPROVAL_STORAGE_CORRUPT_JSON"
    });
    assert.deepEqual(inventory(malformedRoot), malformedBefore);
    return {
      shape: true,
      order: true,
      filters: "NO_FILTER_CONTRACT",
      limit: true,
      malformed_strict_without_write: true
    };
  } finally {
    fs.rmSync(fixtureRoot, { recursive: true, force: true });
  }
}

function contextVariant(context, permissions, includePermissions = true) {
  const copy = { ...context };
  if (includePermissions) copy.permissions = permissions;
  else delete copy.permissions;
  return Object.freeze(copy);
}

async function run() {
  assert.equal(fs.existsSync(GOVERNANCE_PATH), false);
  assert.equal(fs.existsSync(WORKSPACES_PATH), false);
  const dataBefore = inventory(path.join(TEST_ROOT, "data"));
  const auditBefore = inventory(path.join(TEST_ROOT, ".mh-audit"));

  const priorKey = process.env.MH_CONTROL_CENTER_WRITE_KEY;
  process.env.MH_CONTROL_CENTER_WRITE_KEY = TEST_KEY;

  const backbonePath = path.join(RUNTIME, "lib/ops/backbone.js");
  const readerPath = path.join(
    RUNTIME,
    "lib/workspace/workspace-governance-approval-reader.js"
  );
  const projectionPath = path.join(
    RUNTIME,
    "lib/workspace/workspace-creation-approval-projection.js"
  );
  const assessmentPath = path.join(
    RUNTIME,
    "lib/workspace/workspace-creation-approval-model.js"
  );
  const handoffPath = path.join(
    RUNTIME,
    "lib/workspace/governed-workspace-creation-handoff.js"
  );
  const compositionPath = path.join(
    RUNTIME,
    "lib/workspace/production-governance-composition.js"
  );
  const identityPath = path.join(RUNTIME, "lib/security/identity-adapter.js");
  const catalogPath = path.join(RUNTIME, "lib/security/route-permission-catalog.js");
  const serverPath = path.join(RUNTIME, "server.js");

  const { listApprovals } = require(backbonePath);
  const {
    WorkspaceGovernanceApprovalReaderError,
    createWorkspaceGovernanceApprovalReader,
    readWorkspaceGovernanceApproval
  } = require(readerPath);
  const { projectWorkspaceCreationApproval } = require(projectionPath);
  const { assessWorkspaceCreationApproval } = require(assessmentPath);
  const { prepareGovernedWorkspaceCreationHandoff } = require(handoffPath);
  const { prepareProductionGovernanceComposition } = require(compositionPath);
  const {
    createAuthorityContext,
    assertAuthorityPermission
  } = require(identityPath);
  const {
    GOVERNANCE_WORKSPACE_CREATION_PREPARE_PERMISSION,
    classifyRoute
  } = require(catalogPath);
  const {
    __governanceWorkspacePreparation: boundary
  } = require(serverPath);

  const checks = {};

  assert.deepEqual(listApprovals("governance-system", { limit: 1000 }), []);
  assert.throws(
    () => readWorkspaceGovernanceApproval("approval_k6ar_missing_001"),
    (error) => error instanceof WorkspaceGovernanceApprovalReaderError
      && error.code === "GOVERNANCE_APPROVAL_NOT_FOUND"
      && error.statusCode === 404
  );
  assert.equal(fs.existsSync(GOVERNANCE_PATH), false);
  assert.equal(fs.existsSync(WORKSPACES_PATH), false);
  assert.deepEqual(inventory(path.join(TEST_ROOT, "data")), dataBefore);
  assert.deepEqual(inventory(path.join(TEST_ROOT, ".mh-audit")), auditBefore);
  checks.pure_read_missing_store = "PASS";
  checks.existing_store = isolatedApprovalReadCompatibility(backbonePath);

  const noCredentialRequest = request();
  const noCredentialResponse = response();
  assert.equal(
    (await invoke(
      boundary.requireAuthentication,
      noCredentialRequest,
      noCredentialResponse
    )).nextCalled,
    false
  );
  assert.equal(noCredentialResponse.result.status, 401);

  for (const credential of ["malformed", "incorrect-key"]) {
    const req = request({ credential });
    const res = response();
    assert.equal((await invoke(boundary.requireAuthentication, req, res)).nextCalled, false);
    assert.equal(res.result.status, 403);
  }

  const authenticatedRequest = request({ credential: TEST_KEY });
  const authenticatedResponse = response();
  assert.equal(
    (await invoke(
      boundary.requireAuthentication,
      authenticatedRequest,
      authenticatedResponse
    )).nextCalled,
    true
  );
  const authorityContext = authenticatedRequest.mhAuthorityContext;
  assert.equal(authorityContext.principal.principal_id, PRINCIPAL_ID);
  assert.equal(authorityContext.principal.principal_type, "service");
  assert.equal(authorityContext.principal.authentication_method, "control_key");
  assert.deepEqual(
    authorityContext.permissions,
    [GOVERNANCE_WORKSPACE_CREATION_PREPARE_PERMISSION]
  );
  assertDeepFrozen(authorityContext);
  assert.equal(JSON.stringify(authorityContext).includes(TEST_KEY), false);
  checks.authentication = "401/403/BACKEND_CONTEXT";

  const deniedContexts = [
    ["missing_context", undefined],
    ["unauthenticated", createAuthorityContext()],
    ["missing_permissions", contextVariant(authorityContext, undefined, false)],
    ["empty_permissions", contextVariant(authorityContext, Object.freeze([]))],
    ["wrong_permission", contextVariant(
      authorityContext,
      Object.freeze(["governance.other.prepare"])
    )],
    ["malformed_permission", contextVariant(
      authorityContext,
      Object.freeze([42])
    )],
    ["substring", contextVariant(
      authorityContext,
      Object.freeze(["workspace_creation"])
    )],
    ["prefixed", contextVariant(
      authorityContext,
      Object.freeze([`x.${GOVERNANCE_WORKSPACE_CREATION_PREPARE_PERMISSION}`])
    )],
    ["suffixed", contextVariant(
      authorityContext,
      Object.freeze([`${GOVERNANCE_WORKSPACE_CREATION_PREPARE_PERMISSION}.x`])
    )],
    ["wildcard", contextVariant(authorityContext, Object.freeze(["*"]))],
    ["unknown_service", Object.freeze({
      principal: Object.freeze({
        authenticated: true,
        principal_type: "service",
        principal_id: "unknown-service"
      }),
      permissions: Object.freeze([GOVERNANCE_WORKSPACE_CREATION_PREPARE_PERMISSION])
    })],
    ["forged_context", Object.freeze({
      principal: Object.freeze({
        authenticated: true,
        principal_type: "service",
        principal_id: PRINCIPAL_ID
      }),
      permissions: Object.freeze([GOVERNANCE_WORKSPACE_CREATION_PREPARE_PERMISSION])
    })]
  ];

  let compositionCalls = 0;
  let approvalReaderCalls = 0;
  let workspaceLookupCalls = 0;
  let workspaceWriterCalls = 0;
  const controlledPrepare = async (input, options) => {
    compositionCalls += 1;
    return prepareProductionGovernanceComposition(input, {
      authenticatedContext: options.authenticatedContext,
      approvalReader: async () => {
        approvalReaderCalls += 1;
        return approval();
      },
      workspaceRuntime: {
        findWorkspaceByCreationEvidence: async () => {
          workspaceLookupCalls += 1;
          return null;
        },
        createWorkspace: async () => {
          workspaceWriterCalls += 1;
          throw new Error("Workspace writer must remain unreachable");
        }
      }
    });
  };
  const controlledHandler = boundary.createHandler(controlledPrepare);

  for (const [name, context] of deniedContexts) {
    const req = request({ credential: TEST_KEY });
    req.mhAuthorityContext = context;
    const res = response();
    const outcome = await invoke(boundary.requireAuthorization, req, res);
    assert.equal(outcome.nextCalled, false, name);
    assert.equal(res.result.status, 403, name);
  }
  assert.equal(compositionCalls, 0);
  assert.equal(approvalReaderCalls, 0);
  assert.equal(workspaceLookupCalls, 0);
  assert.equal(workspaceWriterCalls, 0);
  assert.equal(
    assertAuthorityPermission(
      authorityContext,
      GOVERNANCE_WORKSPACE_CREATION_PREPARE_PERMISSION
    ),
    true
  );
  checks.authorization = "FAIL_CLOSED_BEFORE_DOWNSTREAM";

  const forgedByCaller = createAuthorityContext({
    principal: {
      authenticated: true,
      principal_type: "service",
      principal_id: PRINCIPAL_ID
    },
    permissions: [GOVERNANCE_WORKSPACE_CREATION_PREPARE_PERMISSION]
  });
  assert.equal(forgedByCaller.principal.authenticated, false);
  assert.deepEqual(forgedByCaller.permissions, []);

  const spoofFields = [
    "permissions", "permission", "scopes", "scope", "roles", "role",
    "principal", "principal_id", "principal_type", "authority_context",
    "mhAuthorityContext", "authenticated", "service_identity",
    "service_principal", "capabilities", "grants"
  ];
  for (const field of spoofFields) {
    for (const location of ["body", "query", "header"]) {
      const req = request({ credential: TEST_KEY });
      if (location === "body") req.body = { approval_id: APPROVAL_ID, [field]: "forged" };
      if (location === "query") req.query = { [field]: "forged" };
      if (location === "header") {
        req.headers[`x-mh-${field.replace(/_/g, "-")}`] = "forged";
      }
      const res = response();
      assert.equal(
        (await invoke(boundary.rejectUntrustedAuthority, req, res)).nextCalled,
        false
      );
      assert.equal(res.result.status, 400);
    }
  }
  checks.spoof_matrix = `${spoofFields.length * 3}_REJECTED`;

  const invalidInputs = [
    undefined,
    null,
    {},
    { approval_id: null },
    { approval_id: 3 },
    { approval_id: "" },
    { approval_id: " " },
    [],
    { approval_id: { nested: true } }
  ];
  const dangerousExtras = [
    "permissions", "permission", "scopes", "scope", "roles", "role",
    "principal", "principal_id", "principal_type", "authority_context",
    "mhAuthorityContext", "authenticated", "service_identity",
    "service_principal", "capabilities", "grants", "authority_partition",
    "authority_project", "workspace_name", "workspace_id", "owner",
    "requester_id", "approver_id", "requested_by", "decided_by", "approval",
    "approval_record", "ownership_evidence", "source_evidence", "apply",
    "execute", "mutation", "dry_run", "plan", "approved_plan",
    "runtime_input", "create_workspace"
  ];
  for (const input of invalidInputs) {
    await assert.rejects(controlledPrepare(input, { authenticatedContext: authorityContext }));
  }
  for (const field of dangerousExtras) {
    await assert.rejects(controlledPrepare(
      { approval_id: APPROVAL_ID, [field]: "forged" },
      { authenticatedContext: authorityContext }
    ));
  }
  assert.equal(approvalReaderCalls, 0);
  checks.input_surface = `${invalidInputs.length + dangerousExtras.length}_REJECTED`;

  async function semanticRejection(overrides) {
    await assert.rejects(prepareProductionGovernanceComposition(
      { approval_id: APPROVAL_ID },
      {
        authenticatedContext: authorityContext,
        approvalReader: async () => approval(overrides),
        workspaceRuntime: { findWorkspaceByCreationEvidence: async () => null }
      }
    ));
  }
  for (const status of [
    "pending", "rejected", "changes_requested", "escalated", "cancelled", "overridden"
  ]) {
    await semanticRejection({ status });
  }
  for (const overrides of [
    { project: "other" },
    { entity_type: "project" },
    { entity_id: "Other Workspace" },
    { approval_type: "project_activation" },
    { mutation_type: "project_activation" },
    { requested_action: "DELETE_WORKSPACE" },
    { requested_for: "Other Owner" },
    { reviewer: "Other Owner" },
    { requested_by: "other" },
    { decided_by: "other" },
    { requested_by: undefined },
    { decided_by: undefined },
    { decision_at: "" },
    { decided_at: "" },
    { decision_at: "not-a-time", decided_at: "not-a-time" }
  ]) {
    await semanticRejection(overrides);
  }
  assert.throws(() => createWorkspaceGovernanceApprovalReader({
    listApprovals: () => []
  })(APPROVAL_ID), /not found/);
  assert.throws(() => createWorkspaceGovernanceApprovalReader({
    listApprovals: () => [approval(), approval()]
  })(APPROVAL_ID), /duplicated/);
  assert.throws(() => createWorkspaceGovernanceApprovalReader({
    listApprovals: () => ({ items: [approval()] })
  })(APPROVAL_ID), /malformed/);
  checks.approval_semantics = "EXACT_OVERRIDDEN_REJECTED";

  const query = {
    authority_partition: "governance-system",
    approval_id: APPROVAL_ID,
    requester_id: PRINCIPAL_ID,
    approver_id: PRINCIPAL_ID
  };
  const projection = await projectWorkspaceCreationApproval(query, {
    approvalReader: async () => approval()
  });
  const assessment = assessWorkspaceCreationApproval(projection);
  const runtime = {
    findWorkspaceByCreationEvidence: async () => null,
    createWorkspace: async () => {
      workspaceWriterCalls += 1;
      throw new Error("Workspace writer must remain unreachable");
    }
  };
  const handoff = await prepareGovernedWorkspaceCreationHandoff(query, {
    approvalReader: async () => approval(),
    workspaceRuntime: runtime
  });
  assert.equal(handoff.approval_assessment.approval_state, "APPROVED");
  assert.equal(handoff.dry_run.result_state, "DRY_RUN_READY");
  assertDeepFrozen(projection);
  assertDeepFrozen(assessment);
  assertDeepFrozen(handoff);

  const positiveRequest = request({ credential: TEST_KEY });
  const positiveResponse = response();
  assert.equal(
    (await invoke(boundary.requireAuthentication, positiveRequest, positiveResponse)).nextCalled,
    true
  );
  assert.equal(
    (await invoke(boundary.requireAuthorization, positiveRequest, positiveResponse)).nextCalled,
    true
  );
  assert.equal(
    (await invoke(boundary.rejectUntrustedAuthority, positiveRequest, positiveResponse)).nextCalled,
    true
  );
  assert.equal((await invoke(controlledHandler, positiveRequest, positiveResponse)).nextError, null);
  const first = positiveResponse.result.body.preparation;
  const second = await prepareProductionGovernanceComposition(
    { approval_id: APPROVAL_ID },
    {
      authenticatedContext: authorityContext,
      approvalReader: async () => approval(),
      workspaceRuntime: runtime
    }
  );
  assert.equal(JSON.stringify(first), JSON.stringify(second));
  assert.equal(first.workspace_name, "MH Trading");
  assert.equal(first.authority_partition, "governance-system");
  assert.equal(first.approval_state, "APPROVED");
  assert.equal(first.dry_run.result_state, "DRY_RUN_READY");
  assert.equal(first.dry_run_plans_equivalent, true);
  assert.equal(first.apply_executed, false);
  assert.equal(first.workspace_created, false);
  assert.equal(first.workspace_id, null);
  assert.equal(first.mutation_allowed_by_this_endpoint, false);
  assertDeepFrozen(first);
  assert.throws(() => {
    first.dry_run.safety.apply_executed = true;
  });
  assert.throws(() => {
    authorityContext.permissions.push("forged");
  });
  assert.equal(JSON.stringify(first), JSON.stringify(second));
  assert.equal(workspaceWriterCalls, 0);
  checks.composition = "PREPARATION_ONLY";
  checks.determinism = "BYTE_EQUIVALENT";
  checks.deep_immutability = "PASS";

  const responseContract = {
    authority_partition: first.authority_partition === "governance-system",
    workspace_name: first.workspace_name === "MH Trading",
    approval_state: first.approval_state === "APPROVED",
    dry_run_state: first.dry_run_state === "DRY_RUN_READY",
    dry_runs_equivalent: first.dry_runs_equivalent === true,
    apply_executed: first.apply_executed === false,
    workspace_created: first.workspace_created === false,
    workspace_id: first.workspace_id === null,
    mutation_allowed_by_this_endpoint:
      first.mutation_allowed_by_this_endpoint === false
  };
  checks.required_response_contract = responseContract;
  checks.actual_response_contract = {
    nested_dry_run_result_state: first.dry_run.result_state,
    dry_run_plans_equivalent: first.dry_run_plans_equivalent
  };
  const responseContractExact = Object.values(responseContract).every(Boolean);

  const sources = {
    backbone: fs.readFileSync(backbonePath, "utf8"),
    reader: fs.readFileSync(readerPath, "utf8"),
    projection: fs.readFileSync(projectionPath, "utf8"),
    assessment: fs.readFileSync(assessmentPath, "utf8"),
    handoff: fs.readFileSync(handoffPath, "utf8"),
    composition: fs.readFileSync(compositionPath, "utf8"),
    identity: fs.readFileSync(identityPath, "utf8"),
    catalog: fs.readFileSync(catalogPath, "utf8"),
    server: fs.readFileSync(serverPath, "utf8"),
    workspaceRuntime: fs.readFileSync(
      path.join(RUNTIME, "lib/workspace/workspace-runtime.js"),
      "utf8"
    ),
    partition: fs.readFileSync(
      path.join(RUNTIME, "lib/security/governance-authority-partition.js"),
      "utf8"
    )
  };
  assert.equal((sources.backbone.match(/^function createApproval\(/gm) || []).length, 1);
  assert.equal((sources.backbone.match(/^function decideApproval\(/gm) || []).length, 1);
  assert.equal((sources.backbone.match(/^function listApprovals\(/gm) || []).length, 1);
  assert.equal(
    (sources.workspaceRuntime.match(/^async function createWorkspace\(/gm) || []).length,
    1
  );
  assert.equal((sources.partition.match(/"governance-system"/g) || []).length, 1);
  assert.equal(
    (sources.server.match(/mh-trading\/creation\/prepare/g) || []).length,
    1
  );
  assert.doesNotMatch(
    `${sources.reader}\n${sources.projection}\n${sources.assessment}\n${sources.handoff}\n${sources.composition}\n${sources.server}`,
    /data\/approvals\.json/
  );
  assert.doesNotMatch(sources.reader, /node:fs|readFileSync|createApproval|decideApproval/);
  assert.doesNotMatch(sources.composition, /createWorkspace\s*\(|executeControlledWorkspaceCreation/);
  const routeRegistration = sources.server.match(
    /app\.post\(\s*GOVERNANCE_WORKSPACE_PREPARATION_ROUTE[\s\S]*?handleGovernanceWorkspacePreparation\s*\);/
  )[0];
  assert.ok(
    routeRegistration.indexOf("requireGovernancePreparationAuthentication")
      < routeRegistration.indexOf("requireGovernancePreparationAuthorization")
  );
  assert.doesNotMatch(`${sources.identity}\n${sources.server}`, /permissions\s*\|\|\s*\[\s*["']\*["']/);
  assert.equal(
    classifyRoute(
      "POST",
      "/api/governance/workspaces/mh-trading/creation/prepare"
    ).requiredScope,
    GOVERNANCE_WORKSPACE_CREATION_PREPARE_PERMISSION
  );
  checks.static_bypass = "NONE_FOUND";

  assert.equal(fs.existsSync(GOVERNANCE_PATH), false);
  assert.equal(fs.existsSync(WORKSPACES_PATH), false);
  assert.deepEqual(inventory(path.join(TEST_ROOT, "data")), dataBefore);
  assert.deepEqual(inventory(path.join(TEST_ROOT, ".mh-audit")), auditBefore);
  checks.production_data = "UNCHANGED";

  if (priorKey === undefined) delete process.env.MH_CONTROL_CENTER_WRITE_KEY;
  else process.env.MH_CONTROL_CENTER_WRITE_KEY = priorKey;

  const certified = responseContractExact;
  console.log(JSON.stringify({
    ok: certified,
    phase: "K-6A-R",
    certified,
    blocking_findings: certified ? [] : [
      "REQUIRED_RESPONSE_FIELD_DRY_RUN_STATE_MISSING",
      "REQUIRED_RESPONSE_FIELD_DRY_RUNS_EQUIVALENT_MISSING"
    ],
    checks,
    approval_created: false,
    approval_decided: false,
    k5c_apply_executed: false,
    workspace_created: false,
    workspace_id_created: false,
    data_workspaces_written: false
  }, null, 2));
  if (!certified) process.exitCode = 1;
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

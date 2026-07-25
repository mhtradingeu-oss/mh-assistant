#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const SERVER_PATH = path.join(ROOT, "runtime/orchestrator-service/server.js");
const IDENTITY_PATH = path.join(
  ROOT,
  "runtime/orchestrator-service/lib/security/identity-adapter.js"
);
const CATALOG_PATH = path.join(
  ROOT,
  "runtime/orchestrator-service/lib/security/route-permission-catalog.js"
);
const COMPOSITION_PATH = path.join(
  ROOT,
  "runtime/orchestrator-service/lib/workspace/production-governance-composition.js"
);
const GOVERNANCE_PARTITION_PATH = path.join(
  ROOT,
  "data/projects/governance-system"
);
const WORKSPACES_PATH = path.join(ROOT, "data/workspaces");
const TEST_KEY = "phase-k6c-test-control-key";
const APPROVAL_ID = "approval_mh_trading_workspace_k6c_001";
const PRINCIPAL_ID = "legacy-control-center-key";
const TIMESTAMP = "2026-07-24T16:00:00.000Z";

function inventory(root) {
  const result = [];

  function visit(current) {
    if (!fs.existsSync(current)) return;
    for (const entry of fs.readdirSync(current, { withFileTypes: true })
      .sort((left, right) => left.name.localeCompare(right.name))) {
      const target = path.join(current, entry.name);
      if (entry.isDirectory()) {
        visit(target);
      } else {
        result.push({
          path: path.relative(root, target),
          hash: crypto.createHash("sha256").update(fs.readFileSync(target)).digest("hex")
        });
      }
    }
  }

  visit(root);
  return result;
}

function approval() {
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
    decision_at: TIMESTAMP
  };
}

function request({
  credential,
  controlHeader = false,
  body = { approval_id: APPROVAL_ID },
  query = {},
  extraHeaders = {}
} = {}) {
  const headers = Object.fromEntries(
    Object.entries(extraHeaders).map(([key, value]) => [key.toLowerCase(), value])
  );
  if (credential !== undefined) {
    if (controlHeader) headers["x-mh-control-key"] = credential;
    else headers.authorization = `Bearer ${credential}`;
  }
  return {
    method: "POST",
    path: "/api/governance/workspaces/mh-trading/creation/prepare",
    headers,
    body,
    query,
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

function contextWithPermissions(context, permissions, includePermissions = true) {
  const copy = { ...context };
  if (includePermissions) copy.permissions = permissions;
  else delete copy.permissions;
  return Object.freeze(copy);
}

async function run() {
  assert.equal(fs.existsSync(GOVERNANCE_PARTITION_PATH), false);
  assert.equal(fs.existsSync(WORKSPACES_PATH), false);
  const dataBefore = inventory(path.join(ROOT, "data"));
  const auditBefore = inventory(path.join(ROOT, ".mh-audit"));

  const priorKey = process.env.MH_CONTROL_CENTER_WRITE_KEY;
  process.env.MH_CONTROL_CENTER_WRITE_KEY = TEST_KEY;

  const {
    GOVERNANCE_WORKSPACE_CREATION_PREPARE_PERMISSION,
    classifyRoute
  } = require(CATALOG_PATH);
  const {
    createLegacyControlKeyAssertion,
    createAuthorityContext,
    assertAuthorityPermission
  } = require(IDENTITY_PATH);
  const {
    prepareProductionGovernanceComposition
  } = require(COMPOSITION_PATH);
  const {
    __governanceWorkspacePreparation: boundary
  } = require(SERVER_PATH);

  const checks = {};
  const authenticationCases = [
    { name: "missing", credential: undefined, status: 401 },
    { name: "malformed", credential: "malformed", status: 403 },
    { name: "incorrect", credential: "incorrect-control-key", status: 403 }
  ];
  for (const testCase of authenticationCases) {
    const req = request({ credential: testCase.credential });
    const res = response();
    const outcome = await invoke(boundary.requireAuthentication, req, res);
    assert.equal(outcome.nextCalled, false);
    assert.equal(res.result.status, testCase.status);
    assert.equal(req.mhAuthorityContext, undefined);
    checks[`authentication_${testCase.name}`] = testCase.status;
  }

  const authenticatedRequest = request({ credential: TEST_KEY });
  const authenticatedResponse = response();
  const authenticated = await invoke(
    boundary.requireAuthentication,
    authenticatedRequest,
    authenticatedResponse
  );
  assert.equal(authenticated.nextCalled, true);
  const authorityContext = authenticatedRequest.mhAuthorityContext;
  assert.equal(authorityContext.principal.principal_id, PRINCIPAL_ID);
  assert.equal(authorityContext.principal.principal_type, "service");
  assert.equal(authorityContext.principal.authenticated, true);
  assert.deepEqual(
    authorityContext.permissions,
    [GOVERNANCE_WORKSPACE_CREATION_PREPARE_PERMISSION]
  );
  assert.equal(Object.isFrozen(authorityContext), true);
  assert.equal(Object.isFrozen(authorityContext.principal), true);
  assert.equal(Object.isFrozen(authorityContext.permissions), true);
  checks.authentication_valid = "BACKEND_SERVICE_PRINCIPAL";

  const deniedContexts = [
    ["missing_context", undefined],
    ["missing_permissions", contextWithPermissions(authorityContext, undefined, false)],
    ["empty_permissions", contextWithPermissions(authorityContext, Object.freeze([]))],
    ["wrong_permission", contextWithPermissions(
      authorityContext,
      Object.freeze(["governance.other.prepare"])
    )],
    ["malformed_permissions", contextWithPermissions(
      authorityContext,
      Object.freeze([" governance.workspace_creation.prepare"])
    )],
    ["forged_context", Object.freeze({
      principal: Object.freeze({
        authenticated: true,
        principal_type: "service",
        principal_id: PRINCIPAL_ID
      }),
      permissions: Object.freeze([
        GOVERNANCE_WORKSPACE_CREATION_PREPARE_PERMISSION
      ])
    })],
    ["unknown_service", Object.freeze({
      principal: Object.freeze({
        authenticated: true,
        principal_type: "service",
        principal_id: "unknown-service"
      }),
      permissions: Object.freeze([
        GOVERNANCE_WORKSPACE_CREATION_PREPARE_PERMISSION
      ])
    })]
  ];

  for (const [name, context] of deniedContexts) {
    const req = request({ credential: TEST_KEY });
    req.mhAuthorityContext = context;
    const res = response();
    const outcome = await invoke(boundary.requireAuthorization, req, res);
    assert.equal(outcome.nextCalled, false);
    assert.equal(res.result.status, 403);
    assert.equal(
      res.result.body.error.code,
      "GOVERNANCE_PREPARATION_PERMISSION_DENIED"
    );
    checks[`authorization_${name}`] = 403;
  }

  const allowedResponse = response();
  const allowed = await invoke(
    boundary.requireAuthorization,
    authenticatedRequest,
    allowedResponse
  );
  assert.equal(allowed.nextCalled, true);
  assert.equal(
    assertAuthorityPermission(
      authorityContext,
      GOVERNANCE_WORKSPACE_CREATION_PREPARE_PERMISSION
    ),
    true
  );
  checks.authorization_exact_permission = "ALLOWED";

  assert.throws(() => authorityContext.permissions.push("forged.permission"));
  assert.throws(() => {
    authorityContext.permissions = ["forged.permission"];
  });
  const secondRequest = request({ credential: TEST_KEY, controlHeader: true });
  const secondResponse = response();
  assert.equal(
    (await invoke(boundary.requireAuthentication, secondRequest, secondResponse)).nextCalled,
    true
  );
  assert.notEqual(secondRequest.mhAuthorityContext, authorityContext);
  assert.notEqual(secondRequest.mhAuthorityContext.permissions, authorityContext.permissions);
  assert.deepEqual(secondRequest.mhAuthorityContext.permissions, authorityContext.permissions);
  checks.authority_context_immutable_and_isolated = true;

  const callerContext = createAuthorityContext({
    principal: {
      authenticated: true,
      principal_type: "service",
      principal_id: PRINCIPAL_ID
    },
    permissions: [GOVERNANCE_WORKSPACE_CREATION_PREPARE_PERMISSION],
    roles: ["admin"]
  });
  assert.equal(callerContext.principal.authenticated, false);
  assert.deepEqual(callerContext.permissions, []);
  assert.deepEqual(callerContext.roles, []);

  const trustedAssertion = createLegacyControlKeyAssertion({
    authenticated: true,
    validated_by_existing_guard: true,
    source: "protected_read_key_guard"
  });
  const callerExtendedContext = createAuthorityContext({
    identity_assertion: trustedAssertion,
    permissions: ["*", "caller.grant"],
    roles: ["admin"]
  });
  assert.deepEqual(
    callerExtendedContext.permissions,
    [GOVERNANCE_WORKSPACE_CREATION_PREPARE_PERMISSION]
  );
  assert.deepEqual(callerExtendedContext.roles, []);
  checks.caller_authority_ignored = true;

  const spoofFields = [
    "permissions", "permission", "scopes", "scope", "roles", "role",
    "principal", "principal_id", "principal_type", "authority_context",
    "mhAuthorityContext", "authenticated", "service_identity",
    "service_principal", "access_level", "capabilities", "grants"
  ];
  for (const field of spoofFields) {
    for (const source of ["body", "query", "header"]) {
      const req = request({ credential: TEST_KEY });
      if (source === "body") req.body = { approval_id: APPROVAL_ID, [field]: "forged" };
      if (source === "query") req.query = { [field]: "forged" };
      if (source === "header") {
        req.headers[`x-mh-${field.replace(/_/g, "-")}`] = "forged";
      }
      const res = response();
      assert.equal(
        (await invoke(boundary.rejectUntrustedAuthority, req, res)).nextCalled,
        false
      );
      assert.equal(res.result.status, 400);
      assert.equal(
        res.result.body.error.code,
        "GOVERNANCE_PREPARATION_AUTHORITY_INPUT_FORBIDDEN"
      );
    }
  }
  checks.caller_spoof_matrix = `${spoofFields.length * 3}_REJECTED`;

  let compositionCalls = 0;
  let approvalReaderCalls = 0;
  let workspaceLookupCalls = 0;
  let workspaceCreateCalls = 0;
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
          workspaceCreateCalls += 1;
          throw new Error("Workspace mutation must remain unreachable");
        }
      }
    });
  };
  const testHandler = boundary.createHandler(controlledPrepare);

  for (const [name, context] of deniedContexts) {
    const req = request({ credential: TEST_KEY });
    req.mhAuthorityContext = context;
    const res = response();
    const authorization = await invoke(boundary.requireAuthorization, req, res);
    assert.equal(authorization.nextCalled, false, name);
  }
  assert.equal(compositionCalls, 0);
  assert.equal(approvalReaderCalls, 0);
  assert.equal(workspaceLookupCalls, 0);
  assert.equal(workspaceCreateCalls, 0);
  checks.denied_downstream_execution = "NONE";

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
  const handled = await invoke(testHandler, positiveRequest, positiveResponse);
  assert.equal(handled.nextCalled, false);
  assert.equal(handled.nextError, null);
  assert.equal(positiveResponse.result.status, 200);
  assert.equal(positiveResponse.result.body.ok, true);
  const prepared = positiveResponse.result.body.preparation;
  assert.equal(prepared.approval_state, "APPROVED");
  assert.equal(prepared.dry_run.result_state, "DRY_RUN_READY");
  assert.equal(prepared.dry_run_plans_equivalent, true);
  assert.equal(prepared.apply_executed, false);
  assert.equal(prepared.workspace_created, false);
  assert.equal(prepared.workspace_id, null);
  assert.equal(prepared.mutation_allowed_by_this_endpoint, false);
  assert.equal(compositionCalls, 1);
  assert.equal(approvalReaderCalls, 1);
  assert.equal(workspaceLookupCalls, 2);
  assert.equal(workspaceCreateCalls, 0);
  assert.equal(JSON.stringify(positiveResponse.result.body).includes("permissions"), false);
  assert.equal(JSON.stringify(authorityContext).includes(TEST_KEY), false);
  assert.equal(JSON.stringify(positiveResponse.result.body).includes(TEST_KEY), false);
  checks.positive_route = "DRY_RUN_READY";

  const catalog = classifyRoute(
    "POST",
    "/api/governance/workspaces/mh-trading/creation/prepare"
  );
  assert.equal(catalog.requiredScope, GOVERNANCE_WORKSPACE_CREATION_PREPARE_PERMISSION);
  assert.equal(catalog.requiredAccess, "service");
  assert.equal(catalog.readWrite, "read");
  checks.catalog_reconciled = true;

  const serverSource = fs.readFileSync(SERVER_PATH, "utf8");
  const identitySource = fs.readFileSync(IDENTITY_PATH, "utf8");
  const catalogSource = fs.readFileSync(CATALOG_PATH, "utf8");
  const routeRegistration = serverSource.match(
    /app\.post\(\s*GOVERNANCE_WORKSPACE_PREPARATION_ROUTE[\s\S]*?handleGovernanceWorkspacePreparation\s*\);/
  )[0];
  assert.ok(
    routeRegistration.indexOf("requireGovernancePreparationAuthentication")
      < routeRegistration.indexOf("requireGovernancePreparationAuthorization")
  );
  assert.ok(
    routeRegistration.indexOf("requireGovernancePreparationAuthorization")
      < routeRegistration.indexOf("rejectGovernancePreparationAuthoritySpoofing")
  );
  assert.ok(
    routeRegistration.indexOf("rejectGovernancePreparationAuthoritySpoofing")
      < routeRegistration.indexOf("handleGovernanceWorkspacePreparation")
  );
  const authorizationSource = serverSource.match(
    /function requireGovernancePreparationAuthorization[\s\S]*?\n}\n/
  )[0];
  assert.doesNotMatch(authorizationSource, /req\.body|req\.query|req\.headers/);
  assert.doesNotMatch(identitySource, /input\.permissions|input\.roles/);
  assert.doesNotMatch(`${identitySource}\n${serverSource}`, /permissions\s*\|\|\s*\[\s*["']\*["']/);
  assert.doesNotMatch(`${identitySource}\n${serverSource}`, /\.includes\([^)]*requiredPermission[^)]*,/);
  assert.equal(
    (catalogSource.match(/governance\.workspace_creation\.prepare/g) || []).length,
    1
  );
  assert.equal(
    (serverSource.match(/mh-trading\/creation\/prepare/g) || []).length,
    1
  );
  assert.equal(
    (serverSource.match(/prepareProductionGovernanceComposition\(req\.body/g) || []).length,
    0
  );
  checks.static_security = "PASS";

  assert.equal(fs.existsSync(GOVERNANCE_PARTITION_PATH), false);
  assert.equal(fs.existsSync(WORKSPACES_PATH), false);
  assert.deepEqual(inventory(path.join(ROOT, "data")), dataBefore);
  assert.deepEqual(inventory(path.join(ROOT, ".mh-audit")), auditBefore);
  checks.production_data = "UNCHANGED";

  if (priorKey === undefined) delete process.env.MH_CONTROL_CENTER_WRITE_KEY;
  else process.env.MH_CONTROL_CENTER_WRITE_KEY = priorKey;

  console.log(JSON.stringify({
    ok: true,
    phase: "K-6C",
    required_permission: GOVERNANCE_WORKSPACE_CREATION_PREPARE_PERMISSION,
    checks,
    approval_created: false,
    approval_decided: false,
    k5c_apply_executed: false,
    workspace_created: false,
    workspace_id_created: false,
    data_workspaces_written: false
  }, null, 2));
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

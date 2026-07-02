#!/usr/bin/env node
"use strict";

const assert = require("assert");
const path = require("path");
const { spawnSync } = require("child_process");

const root = process.cwd();
const serverPath = path.join(root, "runtime/orchestrator-service/server.js");
const server = require(serverPath);
const {
  classifyRoute
} = require("../../runtime/orchestrator-service/lib/security/route-permission-catalog");
const {
  classifyProviderAction
} = require("../../runtime/orchestrator-service/lib/security/provider-execution-gate");
const {
  classifyPublicAliasAccess
} = require("../../runtime/orchestrator-service/lib/security/public-alias-compatibility");

function withEnv(baseEnv, overrides) {
  return Object.assign({}, baseEnv, overrides);
}

function run() {
  const checks = {};

  assert.ok(server.__productionProfile, "server must export production profile helpers");
  assert.strictEqual(
    typeof server.__productionProfile.validateProductionProfileHardening,
    "function",
    "production profile validator must load"
  );
  assert.strictEqual(
    typeof server.__productionProfile.assertProductionProfileHardening,
    "function",
    "production profile guard must load"
  );
  checks.helperExportsLoadable = "pass";

  const devBypass = server.__productionProfile.validateProductionProfileHardening({
    NODE_ENV: "development",
    MH_CONTROL_CENTER_DISABLE_ACCESS_KEY: "1"
  });
  assert.strictEqual(devBypass.productionMode, false, "development should not be treated as production");
  assert.strictEqual(devBypass.blocked, false, "development bypass should remain allowed for local work");
  assert.strictEqual(devBypass.allowedLocalDevelopment, true, "development bypass should be recognized as local-dev only");
  checks.nonProductionBypassStillAllowed = "pass";

  const productionReadBypass = server.__productionProfile.validateProductionProfileHardening({
    NODE_ENV: "production",
    MH_CONTROL_CENTER_DISABLE_ACCESS_KEY: "1"
  });
  assert.strictEqual(productionReadBypass.productionMode, true, "production mode should be detected from NODE_ENV");
  assert.strictEqual(productionReadBypass.blocked, true, "production read-key bypass must be blocked");
  assert.ok(productionReadBypass.bypassFlags.some((flag) => flag.name === "MH_CONTROL_CENTER_DISABLE_ACCESS_KEY"), "read-key bypass env must be reported");
  checks.productionReadBypassBlocked = "pass";

  const productionWriteBypass = server.__productionProfile.validateProductionProfileHardening({
    MH_ENV: "production",
    MH_WRITE_KEY_BYPASS: "true"
  });
  assert.strictEqual(productionWriteBypass.productionMode, true, "MH_ENV production should be detected");
  assert.strictEqual(productionWriteBypass.blocked, true, "production write/security bypass must be blocked");
  assert.ok(productionWriteBypass.bypassFlags.some((flag) => flag.name === "MH_WRITE_KEY_BYPASS"), "write bypass env must be reported");
  checks.productionWriteSecurityBypassBlocked = "pass";

  const startupResult = spawnSync(process.execPath, [serverPath], {
    cwd: root,
    env: withEnv(process.env, {
      NODE_ENV: "production",
      MH_CONTROL_CENTER_DISABLE_ACCESS_KEY: "1"
    }),
    encoding: "utf8",
    timeout: 10000
  });
  assert.notStrictEqual(startupResult.status, 0, "production startup must fail when bypass env is enabled");
  const startupOutput = `${startupResult.stdout || ""}\n${startupResult.stderr || ""}`;
  assert.ok(/PRODUCTION_BYPASS_ENV_BLOCKED|Production startup blocked/i.test(startupOutput), "startup failure should be explicit");
  checks.productionStartupHardFails = "pass";

  const routeDecision = classifyRoute("POST", "/media-manager/project/demo/publishing/123/publish");
  assert.strictEqual(routeDecision.requiredAccess, "write_key", "route permission helper must classify write routes");
  checks.routePermissionHelperLoads = "pass";

  const providerDecision = classifyProviderAction("/media-manager/project/demo/integrations/meta/sync", {
    configured: false,
    approved: false
  });
  assert.strictEqual(providerDecision.execution, true, "provider execution gate helper must classify execution routes");
  checks.providerExecutionGateHelperLoads = "pass";

  const publicAliasDecision = classifyPublicAliasAccess(
    "POST",
    "/public/media-manager/project/demo/publishing/123/publish",
    { productionMode: true, hasAuthorizedWriteKey: false }
  );
  assert.strictEqual(publicAliasDecision.allowed, false, "public mutation aliases must remain blocked in production context without a write key");
  assert.strictEqual(publicAliasDecision.code, "route_permission_denied", "public alias block should preserve authorization denial");
  checks.publicMutationAliasHardeningActive = "pass";

  console.log(JSON.stringify({ checks }, null, 2));
}

run();

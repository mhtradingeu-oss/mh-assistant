#!/usr/bin/env node
"use strict";

const assert = require("assert");
const {
  classifyRoute
} = require("../../runtime/orchestrator-service/lib/security/route-permission-catalog");
const {
  classifyProviderAction
} = require("../../runtime/orchestrator-service/lib/security/provider-execution-gate");
const {
  SENSITIVE_MUTATION_ROUTE_PATTERNS,
  isSensitiveMutationRoute,
  classifyRuntimeSecurityDecision,
  createRuntimeSecurityEnforcementMiddleware,
  buildRoutePermissionDeniedResponse
} = require("../../runtime/orchestrator-service/lib/security/runtime-security-enforcement");

function run() {
  const canonicalAiPath = "/media-manager/project/demo/ai/command";
  const publicAiPath = "/public/media-manager/project/demo/ai/command";

  const routeClassification = classifyRoute("POST", canonicalAiPath);
  assert.strictEqual(routeClassification.readWrite, "write", "AI command route must classify as write");
  assert.strictEqual(isSensitiveMutationRoute("POST", canonicalAiPath), true, "Canonical AI command route must be in sensitive scope");
  assert.strictEqual(isSensitiveMutationRoute("POST", publicAiPath), true, "Public AI alias must be in sensitive scope");

  const deniedCanonical = classifyRuntimeSecurityDecision({
    method: "POST",
    routePath: canonicalAiPath,
    hasAuthorizedWriteKey: false
  });
  assert.strictEqual(deniedCanonical.enforced, true, "Canonical sensitive route must be enforced");
  assert.strictEqual(deniedCanonical.allowed, false, "Canonical sensitive route must deny without auth");

  const deniedPublicAlias = classifyRuntimeSecurityDecision({
    method: "POST",
    routePath: publicAiPath,
    hasAuthorizedWriteKey: false
  });
  assert.strictEqual(deniedPublicAlias.enforced, true, "Public sensitive alias must be enforced");
  assert.strictEqual(deniedPublicAlias.allowed, false, "Public sensitive alias must deny without auth");

  const providerClassification = classifyProviderAction("execute_publish_package", {
    configured: false,
    approved: false
  });
  assert.strictEqual(providerClassification.execution, true, "Publish execution must classify as provider execution");
  assert.strictEqual(providerClassification.allowed, false, "Publish execution must be gated without configured+approved state");

  const helperExportsLoad =
    typeof createRuntimeSecurityEnforcementMiddleware === "function"
    && typeof buildRoutePermissionDeniedResponse === "function"
    && Array.isArray(SENSITIVE_MUTATION_ROUTE_PATTERNS);
  assert.strictEqual(helperExportsLoad, true, "Runtime enforcement helper exports must be loadable");

  const allowedWithAuthorization = classifyRuntimeSecurityDecision({
    method: "POST",
    routePath: "/media-manager/project/demo/publishing/job-1/publish",
    hasAuthorizedWriteKey: true
  });
  assert.strictEqual(allowedWithAuthorization.enforced, true, "Publishing mutation should be enforced");
  assert.strictEqual(allowedWithAuthorization.allowed, true, "Publishing mutation should allow with authorization");

  const summary = {
    checks: {
      sensitiveRouteClassification: "pass",
      providerGateClassification: "pass",
      publicAliasBypassPrevention: "pass",
      helperExportsLoadable: "pass"
    },
    deniedResponseShape: buildRoutePermissionDeniedResponse(),
    sampleProviderDecision: providerClassification.decision
  };

  console.log(JSON.stringify(summary, null, 2));
}

run();

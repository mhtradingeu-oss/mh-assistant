#!/usr/bin/env node
"use strict";

const assert = require("assert");
const {
  classifyPublicAliasAccess
} = require("../../runtime/orchestrator-service/lib/security/public-alias-compatibility");
const {
  classifyRuntimeSecurityDecision,
  buildRoutePermissionDeniedResponse
} = require("../../runtime/orchestrator-service/lib/security/runtime-security-enforcement");

const HIGH_RISK_MUTATION_ROUTES = [
  "/media-manager/project/demo/ai/command",
  "/public/media-manager/project/demo/ai/command",
  "/media-manager/project/demo/ai/chat",
  "/public/media-manager/project/demo/ai/workflows/wf-1/run",
  "/media-manager/project/demo/workflows/wf-1/run",
  "/public/media-manager/project/demo/approvals",
  "/media-manager/project/demo/governance/policy",
  "/public/media-manager/project/demo/integrations/meta/connect",
  "/media-manager/project/demo/publishing/schedule",
  "/public/media-manager/project/demo/publishing/job-1/publish",
  "/media-manager/project/demo/native-media/generate",
  "/execute_publish_package",
  "/execute_email_package",
  "/generate_media_from_prompt",
  "/build_ad_execution_package",
  "/api/media/render"
];

function assertDenied(decision, label) {
  assert.strictEqual(decision.enforced, true, `${label}: expected enforced=true`);
  assert.strictEqual(decision.allowed, false, `${label}: expected allowed=false`);
}

function run() {
  const unauthorizedPublicMutation = classifyPublicAliasAccess(
    "POST",
    "/public/media-manager/project/demo/publishing/job-1/publish",
    { productionMode: true, hasAuthorizedWriteKey: false }
  );

  assert.strictEqual(unauthorizedPublicMutation.allowed, false, "Unauthorized public mutation must be blocked");
  assert.strictEqual(
    unauthorizedPublicMutation.code,
    "route_permission_denied",
    "Unauthorized public mutation must use route_permission_denied code"
  );

  HIGH_RISK_MUTATION_ROUTES.forEach((routePath) => {
    const decision = classifyRuntimeSecurityDecision({
      method: "POST",
      routePath,
      hasAuthorizedWriteKey: false
    });
    assertDenied(decision, `High-risk route ${routePath}`);
  });

  const publicReadAlias = classifyPublicAliasAccess(
    "GET",
    "/public/media-manager/projects",
    { productionMode: true, hasAuthorizedWriteKey: false }
  );
  assert.strictEqual(publicReadAlias.allowed, true, "Public read alias should remain allowed");

  const publicReadDecision = classifyRuntimeSecurityDecision({
    method: "GET",
    routePath: "/public/media-manager/projects",
    hasAuthorizedWriteKey: false
  });
  assert.strictEqual(publicReadDecision.enforced, false, "Read-only alias should not be blocked by mutation enforcement");
  assert.strictEqual(publicReadDecision.allowed, true, "Read-only alias should remain allowed");

  const canonicalDenied = classifyRuntimeSecurityDecision({
    method: "POST",
    routePath: "/media-manager/project/demo/ai/command",
    hasAuthorizedWriteKey: false
  });
  assertDenied(canonicalDenied, "Canonical AI mutation without authorization");

  const canonicalAllowed = classifyRuntimeSecurityDecision({
    method: "POST",
    routePath: "/media-manager/project/demo/ai/command",
    hasAuthorizedWriteKey: true
  });
  assert.strictEqual(canonicalAllowed.enforced, true, "Canonical sensitive route should be enforced");
  assert.strictEqual(canonicalAllowed.allowed, true, "Canonical sensitive route should be allowed with authorization");

  assert.deepStrictEqual(buildRoutePermissionDeniedResponse(), {
    ok: false,
    error: "forbidden",
    code: "route_permission_denied",
    message: "This backend action requires authorization."
  });

  const summary = {
    checks: {
      noSensitivePublicMutationBypass: "pass",
      enforcementOnHighRiskRoutes: "pass",
      readOnlyPublicAliasesRemainFunctional: "pass",
      canonicalEnforcementStillWorks: "pass"
    }
  };

  console.log(JSON.stringify(summary, null, 2));
}

run();

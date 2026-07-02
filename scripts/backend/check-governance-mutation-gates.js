#!/usr/bin/env node
"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const {
  ACTION_RULES,
  decideGovernanceMutation,
  GOVERNANCE_APPROVAL_REQUIRED_RESPONSE,
  GOVERNANCE_POLICY_BLOCKED_RESPONSE
} = require("../../runtime/orchestrator-service/lib/security/governance-mutation-gate");
const {
  classifyProviderAction
} = require("../../runtime/orchestrator-service/lib/security/provider-execution-gate");
const {
  classifyPublicAliasAccess
} = require("../../runtime/orchestrator-service/lib/security/public-alias-compatibility");

const root = process.cwd();
const serverPath = path.join(root, "runtime/orchestrator-service/server.js");
const source = fs.readFileSync(serverPath, "utf8");

function section(startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  if (start < 0) return "";
  const end = endMarker ? source.indexOf(endMarker, start + startMarker.length) : -1;
  return end < 0 ? source.slice(start) : source.slice(start, end);
}

function mustContain(haystack, needle, label) {
  assert.ok(haystack.includes(needle), `${label}: missing ${needle}`);
}

function run() {
  const checks = {};

  const publishScheduleBlock = section(
    "app.post('/media-manager/project/:project/publishing/schedule'",
    "app.post('/public/media-manager/project/:project/publishing/schedule'"
  );
  const publishReadyBlock = section(
    "app.post('/media-manager/project/:project/publishing/:jobId/ready'",
    "app.post('/public/media-manager/project/:project/publishing/:jobId/ready'"
  );
  const publishPublishBlock = section(
    "app.post('/media-manager/project/:project/publishing/:jobId/publish'",
    "app.post('/public/media-manager/project/:project/publishing/:jobId/publish'"
  );
  const publishFailBlock = section(
    "app.post('/media-manager/project/:project/publishing/:jobId/fail'",
    "app.post('/public/media-manager/project/:project/publishing/:jobId/fail'"
  );

  [
    [publishScheduleBlock, "publishing schedule"],
    [publishReadyBlock, "publishing ready"],
    [publishPublishBlock, "publishing publish"],
    [publishFailBlock, "publishing fail"]
  ].forEach(([block, label]) => {
    mustContain(block, "enforceGovernanceMutationGate", `${label} governance gate`);
    mustContain(block, "assertPublishingMutationAllowed", `${label} policy guard`);
  });
  checks.highRiskPublishingMutationsGovernanceGated = "pass";

  const executePublishBlock = section("app.post('/execute_publish_package'", "app.post('/execute_email_package'");
  const executeEmailBlock = section("app.post('/execute_email_package'", "app.post('/generate_media_from_prompt'");
  const executeMediaBlock = section("app.post('/generate_media_from_prompt'", "app.post('/build_ad_execution_package'");
  const executeAdsBlock = section("app.post('/build_ad_execution_package'", "app.get('/products'");

  [
    [executePublishBlock, "execute publish"],
    [executeEmailBlock, "execute email"],
    [executeMediaBlock, "generate media"],
    [executeAdsBlock, "build ads package"]
  ].forEach(([block, label]) => {
    mustContain(block, "enforceGovernanceMutationGate", `${label} governance gate`);
  });
  checks.executionBridgeGovernanceGated = "pass";

  const workflowBlock = section("function handleRunWorkflow", "app.post('/media-manager/project/:project/workflows/:workflowId/run'");
  const aiCommandBlock = section("async function handleExecuteAiCommand", "async function handleExecuteAiChat");
  const aiChatBlock = section("async function handleExecuteAiChat", "async function handleExecuteAiGuidance");
  const aiGuidanceBlock = section("async function handleExecuteAiGuidance", "function handleExecuteAiWorkflow");
  const aiWorkflowBlock = section("function handleExecuteAiWorkflow", "function handleListAiCommands");

  [
    [workflowBlock, "workflow run"],
    [aiCommandBlock, "ai command"],
    [aiChatBlock, "ai chat"],
    [aiGuidanceBlock, "ai guidance"],
    [aiWorkflowBlock, "ai workflow"]
  ].forEach(([block, label]) => {
    mustContain(block, "enforceGovernanceMutationGate", `${label} governance gate`);
  });
  checks.workflowRunRoutesGovernanceGated = "pass";

  const connectBlock = section("async function handleConnectProjectIntegration", "async function handleProjectIntegrationAction");
  const integrationActionBlock = section("async function handleProjectIntegrationAction", "const customerOperationsRuntime =");
  mustContain(connectBlock, "enforceGovernanceMutationGate", "integration connect/reconnect gate");
  mustContain(integrationActionBlock, "enforceGovernanceMutationGate", "integration action gate");

  const providerClassification = classifyProviderAction("/media-manager/project/demo/integrations/meta/sync", {
    configured: false,
    approved: false
  });
  assert.strictEqual(providerClassification.execution, true, "integration sync should classify as provider execution");
  checks.integrationRoutesGovernanceOrProviderGated = "pass";

  const decisionActionRule = ACTION_RULES.approvals_decision;
  assert.ok(decisionActionRule, "approvals_decision action rule must exist");
  assert.strictEqual(decisionActionRule.requiresApproval, false, "approvals decisions must not recursively require approvals");

  const approvalDecisionEvaluation = decideGovernanceMutation({
    action: "approvals_decision",
    projectName: "demo",
    governancePolicy: { policy_rules: { freeze_publishing: false } },
    policyLoaded: true,
    approvals: []
  });
  assert.strictEqual(approvalDecisionEvaluation.allowed, true, "approvals decision should be allowed without recursive approval");
  checks.approvalsDecisionNotRecursivelyBlocked = "pass";

  const governanceUpdateEvaluation = decideGovernanceMutation({
    action: "governance_policy_update",
    projectName: "demo",
    governancePolicy: { policy_rules: { freeze_publishing: true } },
    policyLoaded: true,
    approvals: []
  });
  assert.strictEqual(governanceUpdateEvaluation.allowed, true, "governance policy update should remain write-key protected and readable");
  checks.governancePolicyMutationDoesNotBreakReads = "pass";

  const missingPolicyDecision = decideGovernanceMutation({
    action: "execute_publish_package",
    projectName: "demo",
    governancePolicy: null,
    policyLoaded: false,
    approvals: [],
    entityType: "execution_bridge",
    entityId: "execute_publish_package",
    requestedAction: "publish"
  });
  assert.strictEqual(missingPolicyDecision.allowed, false, "secure default must deny high-risk mutation when policy is unavailable");
  assert.deepStrictEqual(missingPolicyDecision.response, GOVERNANCE_APPROVAL_REQUIRED_RESPONSE);

  const frozenPolicyDecision = decideGovernanceMutation({
    action: "publishing_publish",
    projectName: "demo",
    governancePolicy: { policy_rules: { freeze_publishing: true } },
    policyLoaded: true,
    approvals: [
      {
        id: "approval_1",
        status: "approved",
        entity_type: "publishing_job",
        entity_id: "job-1",
        requested_action: "publish",
        updated_at: new Date().toISOString()
      }
    ],
    entityType: "publishing_job",
    entityId: "job-1",
    requestedAction: "publish"
  });
  assert.strictEqual(frozenPolicyDecision.allowed, false, "freeze policy must block publishing mutations");
  assert.deepStrictEqual(frozenPolicyDecision.response, GOVERNANCE_POLICY_BLOCKED_RESPONSE);
  checks.missingPolicyUsesSecureDefaults = "pass";

  const unauthorizedPublicPublishAlias = classifyPublicAliasAccess(
    "POST",
    "/public/media-manager/project/demo/publishing/job-1/publish",
    { productionMode: true, hasAuthorizedWriteKey: false }
  );
  assert.strictEqual(unauthorizedPublicPublishAlias.allowed, false, "public alias write should remain denied without write key");

  const publicPublishAliasBlock = section(
    "app.post('/public/media-manager/project/:project/publishing/:jobId/publish'",
    "app.post('/media-manager/project/:project/publishing/:jobId/fail'"
  );
  mustContain(publicPublishAliasBlock, "enforceGovernanceMutationGate", "public publishing alias governance gate");
  checks.publicAliasesCannotBypassGovernanceGate = "pass";

  console.log(JSON.stringify({ checks }, null, 2));
}

run();

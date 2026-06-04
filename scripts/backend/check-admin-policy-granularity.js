#!/usr/bin/env node
"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const {
  ACTION_RULES,
  classifyProjectSetupMutation,
  decideGovernanceMutation,
  GOVERNANCE_APPROVAL_REQUIRED_RESPONSE
} = require("../../runtime/orchestrator-service/lib/security/governance-mutation-gate");
const {
  classifyPublicAliasAccess
} = require("../../runtime/orchestrator-service/lib/security/public-alias-compatibility");

const root = process.cwd();
const serverPath = path.join(root, "runtime/orchestrator-service/server.js");
const backbonePath = path.join(root, "runtime/orchestrator-service/lib/ops/backbone.js");
const serverSource = fs.readFileSync(serverPath, "utf8");
const backboneSource = fs.readFileSync(backbonePath, "utf8");

function section(source, startMarker, endMarker) {
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

  [
    "require_approval_for_team_model_changes",
    "require_approval_for_source_registry_changes",
    "require_approval_for_project_setup_authority_changes"
  ].forEach((policyKey) => {
    mustContain(backboneSource, policyKey, `backbone policy key ${policyKey}`);
  });
  checks.policyKeysAdded = "pass";

  assert.ok(ACTION_RULES.team_model_mutation, "team_model_mutation action must exist");
  assert.ok(ACTION_RULES.source_registry_mutation, "source_registry_mutation action must exist");
  assert.ok(ACTION_RULES.project_setup_mutation, "project_setup_mutation action must exist");
  checks.adminActionsClassified = "pass";

  const teamRouteBlock = section(
    serverSource,
    "function handleUpdateProjectTeam(req, res)",
    "app.get('/media-manager/project/:project/team', handleGetProjectTeam);"
  );
  mustContain(teamRouteBlock, "enforceGovernanceMutationGate", "team model mutation gate");

  const sourceCreateBlock = section(
    serverSource,
    "app.post('/media-manager/project/:project/sources'",
    "app.post('/public/media-manager/project/:project/sources'"
  );
  const sourceDeleteBlock = section(
    serverSource,
    "app.delete('/media-manager/project/:project/sources/:sourceType'",
    "app.delete('/public/media-manager/project/:project/sources/:sourceType'"
  );
  mustContain(sourceCreateBlock, "enforceGovernanceMutationGate", "source create gate");
  mustContain(sourceDeleteBlock, "enforceGovernanceMutationGate", "source delete gate");
  checks.teamAndSourceRoutesGated = "pass";

  const setupCanonicalBlock = section(
    serverSource,
    "app.post('/media-manager/project/:project/setup'",
    "app.post('/public/media-manager/project/:project/setup'"
  );
  const setupPublicBlock = section(
    serverSource,
    "app.post('/public/media-manager/project/:project/setup'",
    "function handleGetProjectOperations(req, res)"
  );
  mustContain(setupCanonicalBlock, "enforceGovernanceMutationGate", "setup canonical gate");
  mustContain(setupPublicBlock, "enforceGovernanceMutationGate", "setup public gate");

  const highRiskSetupClassification = classifyProjectSetupMutation({
    execution_mode: "full_auto",
    role_permissions: { admin: ["*" ] }
  });
  assert.strictEqual(highRiskSetupClassification.highRisk, true, "authority-impacting setup fields must classify high risk");

  const safeSetupClassification = classifyProjectSetupMutation({
    brand_name: "Demo Brand",
    audience_primary: "professionals",
    website_url: "https://example.com"
  });
  assert.strictEqual(safeSetupClassification.highRisk, false, "safe setup updates must classify as non-authority mutations");
  checks.setupClassification = "pass";

  const authoritySetupDecision = decideGovernanceMutation({
    action: "project_setup_mutation",
    projectName: "demo",
    policyLoaded: true,
    governancePolicy: {
      policy_rules: {
        require_approval_for_project_setup_authority_changes: true,
        block_project_setup_authority_changes: false
      }
    },
    approvals: [],
    entityType: "project_setup",
    entityId: "demo",
    requestedAction: "update",
    setupPayload: {
      execution_mode: "full_auto"
    }
  });
  assert.strictEqual(authoritySetupDecision.allowed, false, "authority-impacting setup mutation must be approval-gated");
  assert.strictEqual(authoritySetupDecision.decision, "approval_required");
  assert.deepStrictEqual(authoritySetupDecision.response, GOVERNANCE_APPROVAL_REQUIRED_RESPONSE);

  const safeSetupDecision = decideGovernanceMutation({
    action: "project_setup_mutation",
    projectName: "demo",
    policyLoaded: true,
    governancePolicy: {
      policy_rules: {
        require_approval_for_project_setup_authority_changes: true,
        block_project_setup_authority_changes: false
      }
    },
    approvals: [],
    setupPayload: {
      brand_name: "Demo Brand",
      website_url: "https://example.com"
    }
  });
  assert.strictEqual(safeSetupDecision.allowed, true, "safe setup updates should not be blindly blocked");
  assert.strictEqual(safeSetupDecision.decision, "write_key_only_intentional");
  checks.setupSafeUpdatesAllowed = "pass";

  const unauthorizedPublicTeamAlias = classifyPublicAliasAccess(
    "POST",
    "/public/media-manager/project/demo/team",
    { productionMode: true, hasAuthorizedWriteKey: false }
  );
  assert.strictEqual(unauthorizedPublicTeamAlias.allowed, false, "public team alias should remain unauthorized without write key");

  const publicTeamBlock = section(
    serverSource,
    "app.post('/public/media-manager/project/:project/team', handleUpdateProjectTeam);",
    "function handleListCampaigns(req, res)"
  );
  const publicSourceCreateBlock = section(
    serverSource,
    "app.post('/public/media-manager/project/:project/sources'",
    "app.delete('/media-manager/project/:project/sources/:sourceType'"
  );
  const publicSourceDeleteBlock = section(
    serverSource,
    "app.delete('/public/media-manager/project/:project/sources/:sourceType'",
    "function handleGetProjectIntegrationControlCenter(req, res)"
  );
  mustContain(publicTeamBlock, "handleUpdateProjectTeam", "public team alias route");
  mustContain(publicSourceCreateBlock, "enforceGovernanceMutationGate", "public source create gate");
  mustContain(publicSourceDeleteBlock, "enforceGovernanceMutationGate", "public source delete gate");
  checks.publicAliasesNoBypass = "pass";

  assert.strictEqual(ACTION_RULES.approvals_decision.requiresApproval, false, "approval decision route must remain non-recursive");
  assert.strictEqual(ACTION_RULES.governance_policy_update.requiresApproval, false, "governance policy mutation must remain non-recursive");
  checks.nonRecursiveApprovalAndPolicy = "pass";

  console.log(JSON.stringify({ checks }, null, 2));
}

run();

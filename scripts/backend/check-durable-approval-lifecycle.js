#!/usr/bin/env node
"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const serverPath = path.join(root, "runtime/orchestrator-service/server.js");
const backbonePath = path.join(root, "runtime/orchestrator-service/lib/ops/backbone.js");
const gatePath = path.join(root, "runtime/orchestrator-service/lib/security/governance-mutation-gate.js");

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

function loadGateWithApprovalMocks() {
  const backbone = require(backbonePath);
  const createCalls = [];
  let approvalCounter = 0;
  let approvalsState = [];

  backbone.getGovernancePolicy = () => ({
    policy_rules: {
      require_approval_for_team_model_changes: true,
      require_approval_for_source_registry_changes: true,
      require_approval_for_project_setup_authority_changes: true
    }
  });
  backbone.listApprovals = () => approvalsState;
  backbone.createApproval = (projectName, input) => {
    approvalCounter += 1;
    const approval = {
      id: `approval_${approvalCounter}`,
      project_name: projectName,
      status: input.status || "pending",
      ...input
    };
    createCalls.push({ projectName, input, approval });
    return approval;
  };

  delete require.cache[require.resolve(gatePath)];
  const gate = require(gatePath);

  return {
    backbone,
    gate,
    createCalls,
    setApprovals(nextApprovals) {
      approvalsState = Array.isArray(nextApprovals) ? nextApprovals : [];
    }
  };
}

function run() {
  const checks = {};

  mustContain(backboneSource, "mutation_type", "approval linkage metadata");
  mustContain(backboneSource, "approval_fingerprint", "approval fingerprint metadata");
  mustContain(backboneSource, "decision_at", "approval decision timestamp");
  checks.backboneStoresDurableApprovalMetadata = "pass";

  const teamBlock = section(
    serverSource,
    "function handleUpdateProjectTeam(req, res)",
    "app.get('/media-manager/project/:project/team', handleGetProjectTeam);"
  );
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

  [
    [teamBlock, "team mutation lifecycle gate"],
    [sourceCreateBlock, "source create lifecycle gate"],
    [sourceDeleteBlock, "source delete lifecycle gate"],
    [setupCanonicalBlock, "setup canonical lifecycle gate"],
    [setupPublicBlock, "setup public lifecycle gate"]
  ].forEach(([block, label]) => {
    mustContain(block, "enforceGovernanceApprovalLifecycle", label);
  });
  checks.serverRoutesInvokeApprovalLifecycle = "pass";

  const { gate, createCalls, backbone, setApprovals } = loadGateWithApprovalMocks();

  const firstIssue = gate.issueGovernanceApprovalRequest({
    projectName: "demo",
    action: "team_model_mutation",
    entityType: "team_model",
    entityId: "default",
    requestedAction: "update",
    route: "/media-manager/project/demo/team",
    method: "POST",
    payload: { team_name: "Ops" },
    title: "Team model approval"
  });
  assert.strictEqual(firstIssue.allowed, false, "new approval request should not auto-allow execution");
  assert.strictEqual(firstIssue.reason, "approval_created", "new approval request should create a durable approval record");
  assert.strictEqual(createCalls.length, 1, "first approval request should create exactly one approval record");
  assert.strictEqual(createCalls[0].approval.approval_fingerprint, createCalls[0].input.approval_fingerprint, "approval fingerprint should persist on the stored record");
  assert.strictEqual(createCalls[0].approval.linked_execution_id, createCalls[0].input.linked_execution_id, "linked execution id should persist on the stored record");
  assert.strictEqual(createCalls[0].approval.request_payload_hash, createCalls[0].input.request_payload_hash, "payload hash should persist on the stored record");
  checks.approvalCreationPersistsLinkageMetadata = "pass";

  setApprovals([{
    id: firstIssue.approval.id,
    status: "pending",
    approval_fingerprint: createCalls[0].input.approval_fingerprint,
    mutation_type: "team_model_mutation",
    entity_type: "team_model",
    entity_id: "default",
    requested_action: "update",
    route: "/media-manager/project/demo/team",
    method: "POST"
  }]);
  const repeatedIssue = gate.issueGovernanceApprovalRequest({
    projectName: "demo",
    action: "team_model_mutation",
    entityType: "team_model",
    entityId: "default",
    requestedAction: "update",
    route: "/media-manager/project/demo/team",
    method: "POST",
    payload: { team_name: "Ops" },
    title: "Team model approval"
  });
  assert.strictEqual(repeatedIssue.reason, "approval_pending", "matching pending approval should be reused instead of duplicated");
  assert.strictEqual(createCalls.length, 1, "matching pending approval should not create a duplicate record");
  checks.pendingApprovalIsReused = "pass";

  setApprovals([{
    id: "approval_approved",
    status: "approved",
    approval_fingerprint: createCalls[0].input.approval_fingerprint,
    mutation_type: "team_model_mutation",
    entity_type: "team_model",
    entity_id: "default",
    requested_action: "update",
    route: "/media-manager/project/demo/team",
    method: "POST"
  }]);
  const approvedIssue = gate.issueGovernanceApprovalRequest({
    projectName: "demo",
    action: "team_model_mutation",
    entityType: "team_model",
    entityId: "default",
    requestedAction: "update",
    route: "/media-manager/project/demo/team",
    method: "POST",
    payload: { team_name: "Ops" },
    title: "Team model approval"
  });
  assert.strictEqual(approvedIssue.reason, "approval_already_granted", "approved decisions should immediately satisfy later requests");
  assert.strictEqual(approvedIssue.allowed, true, "approved decisions should allow execution");
  checks.approvedApprovalUnblocksExecution = "pass";

  setApprovals([{
    id: "approval_rejected",
    status: "rejected",
    approval_fingerprint: createCalls[0].input.approval_fingerprint,
    mutation_type: "team_model_mutation",
    entity_type: "team_model",
    entity_id: "default",
    requested_action: "update",
    route: "/media-manager/project/demo/team",
    method: "POST"
  }]);
  const rejectedIssue = gate.issueGovernanceApprovalRequest({
    projectName: "demo",
    action: "team_model_mutation",
    entityType: "team_model",
    entityId: "default",
    requestedAction: "update",
    route: "/media-manager/project/demo/team",
    method: "POST",
    payload: { team_name: "Ops" },
    title: "Team model approval"
  });
  assert.strictEqual(rejectedIssue.reason, "approval_rejected", "rejected approvals must stay blocked");
  assert.strictEqual(rejectedIssue.allowed, false, "rejected approvals must not allow execution");
  assert.strictEqual(rejectedIssue.response.code, "governance_approval_rejected", "rejected approvals should return a rejection response");
  checks.rejectedApprovalRemainsBlocked = "pass";

  setApprovals([]);
  const lifecycleDecision = gate.evaluateGovernanceApprovalLifecycle({
    projectName: "demo",
    action: "team_model_mutation",
    entityType: "team_model",
    entityId: "default",
    requestedAction: "update",
    route: "/media-manager/project/demo/team",
    method: "POST",
    payload: { team_name: "Ops" },
    title: "Team model approval",
    skipApprovalGate: true,
    policyLoaded: true
  });
  assert.strictEqual(lifecycleDecision.allowed, false, "approval lifecycle should still gate execution when approval is required");
  assert.strictEqual(lifecycleDecision.reason, "approval_created", "approval lifecycle should issue a durable approval record");
  checks.lifecycleHelperIssuesApproval = "pass";

  console.log(JSON.stringify({ checks }, null, 2));
}

run();
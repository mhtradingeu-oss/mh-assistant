#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const orchestrator = require(
  "../runtime/orchestrator-service/lib/workspace/workspace-projection-orchestrator"
);
const relationships = require(
  "../runtime/orchestrator-service/lib/workspace/workspace-relationship-runtime"
);
const storage = require("../runtime/orchestrator-service/lib/workspace/workspace-storage");
const projections = require(
  "../runtime/orchestrator-service/lib/projects/project-workspace-projection"
);

const WORKSPACE_ID = `ws_${"1".repeat(32)}`;
const PROJECT_ID = `prj_${"2".repeat(32)}`;
const RELATIONSHIP_ID = `wpr_${"3".repeat(32)}`;
const UPDATED_AT = "2026-07-14T12:00:00.000Z";

function relationship(status) {
  return {
    relationship_schema_version: 1,
    relationship_id: RELATIONSHIP_ID,
    project_id: PROJECT_ID,
    relationship_status: status,
    validation_state: "VALID",
    created_at: UPDATED_AT,
    updated_at: UPDATED_AT,
    attached_at: status === "ATTACHED" ? UPDATED_AT : null,
    detached_at: status === "DETACHED" ? UPDATED_AT : null,
    archived_at: null
  };
}

function input() {
  return {
    workspace_id: WORKSPACE_ID,
    relationship_id: RELATIONSHIP_ID,
    expected_workspace_version: 6
  };
}

function ownerHarness(kind, failureAt) {
  const calls = [];
  const pendingStatus = kind === "attach" ? "PENDING_ATTACH" : "PENDING_DETACH";
  const terminalStatus = kind === "attach" ? "ATTACHED" : "DETACHED";
  const relationshipOutcome = kind === "attach" ? "ATTACH_SUCCESS" : "DETACH_SUCCESS";
  let rollbackCalls = 0;
  const relationshipOwner = {
    async completeWorkspaceProjectAttach(completeInput) {
      calls.push("relationship:complete");
      assert.deepEqual(completeInput, input());
      if (failureAt === "terminal-throw") throw Object.assign(new Error("relationship failed"), {
        outcome: "ATTACH_RECOVERY_REQUIRED",
        code: "RELATIONSHIP_FAILURE"
      });
      if (failureAt === "terminal-conflict") {
        return { outcome: "ATTACH_CONFLICT", workspace_version: 6, relationship: relationship(pendingStatus) };
      }
      return { outcome: relationshipOutcome, workspace_version: 7, relationship: relationship(terminalStatus) };
    },
    async completeWorkspaceProjectDetach(completeInput) {
      calls.push("relationship:complete");
      assert.deepEqual(completeInput, input());
      if (failureAt === "terminal-throw") throw Object.assign(new Error("relationship failed"), {
        outcome: "DETACH_RECOVERY_REQUIRED",
        code: "RELATIONSHIP_FAILURE"
      });
      if (failureAt === "terminal-conflict") {
        return { outcome: "DETACH_CONFLICT", workspace_version: 6, relationship: relationship(pendingStatus) };
      }
      return { outcome: relationshipOutcome, workspace_version: 7, relationship: relationship(terminalStatus) };
    },
    async getWorkspaceProjectRelationship(readInput) {
      calls.push("relationship:read");
      assert.deepEqual(readInput, { workspace_id: WORKSPACE_ID, relationship_id: RELATIONSHIP_ID });
      if (failureAt === "relationship-read") throw new Error("reread failed");
      if (failureAt === "not-pending") return relationship(terminalStatus);
      return relationship(pendingStatus);
    },
    async rollbackWorkspaceProjectDetach() { rollbackCalls += 1; },
    async abandonWorkspaceProjectAttach() { rollbackCalls += 1; }
  };
  const workspaceOwner = {
    async getWorkspace(workspaceId) {
      calls.push("workspace:read");
      assert.equal(workspaceId, WORKSPACE_ID);
      if (failureAt === "workspace-read") throw new Error("workspace read failed");
      return { workspace_id: WORKSPACE_ID, workspace_version: failureAt === "version-conflict" ? 5 : 6 };
    }
  };
  const projectionOwner = {
    PROJECT_WORKSPACE_PROJECTION_SCHEMA_VERSION: 1,
    PROJECT_WORKSPACE_PROJECTION_SOURCE_OWNER: "workspace-runtime",
    validateProjectWorkspaceProjection() { throw new Error("orchestrator duplicated projection validation"); },
    async inspectProjectWorkspaceProjection(inspectInput) {
      calls.push("projection:inspect");
      assert.deepEqual(calls, ["relationship:read", "workspace:read", "projection:inspect"]);
      assert.equal(inspectInput.project_id, PROJECT_ID);
      assert.deepEqual(inspectInput.expected_projection, {
        projection_schema_version: 1,
        workspace_id: WORKSPACE_ID,
        relationship_id: RELATIONSHIP_ID,
        relationship_status: terminalStatus,
        workspace_version: 7,
        projected_at: UPDATED_AT,
        authoritative: false,
        source_owner: "workspace-runtime"
      });
      if (failureAt === "projection-read") throw new Error("projection read failed");
      if (failureAt === "projection-noop") {
        return {
          classification: "MATCH",
          projection_fingerprint: {
            projection_schema_version: 1,
            workspace_id: WORKSPACE_ID,
            relationship_id: RELATIONSHIP_ID,
            relationship_status: terminalStatus,
            workspace_version: 7
          }
        };
      }
      return { classification: "MISSING", projection_fingerprint: null };
    },
    async writeProjectWorkspaceProjection(writeInput) {
      calls.push("projection:write");
      assert.deepEqual(calls, [
        "relationship:read",
        "workspace:read",
        "projection:inspect",
        "projection:write"
      ]);
      assert.equal(writeInput.project_id, PROJECT_ID);
      if (failureAt === "projection-noop") {
        assert.deepEqual(writeInput.expected_current_projection, {
          projection_schema_version: 1,
          workspace_id: WORKSPACE_ID,
          relationship_id: RELATIONSHIP_ID,
          relationship_status: terminalStatus,
          workspace_version: 7
        });
      } else {
        assert.equal(writeInput.expected_current_projection, null);
      }
      if (failureAt === "projection-write") {
        throw Object.assign(new Error("projection write failed"), {
          outcome: "PROJECT_PROJECTION_FAILED",
          code: "PROJECTION_FAILURE",
          persistence: { committed: false }
        });
      }
      if (failureAt === "projection-noop") {
        return {
          outcome: "PROJECT_PROJECTION_WRITE_NOOP",
          changed: false,
          workspace_projection: writeInput.desired_projection
        };
      }
      return {
        outcome: "PROJECT_PROJECTION_WRITE_SUCCESS",
        changed: true,
        workspace_projection: writeInput.desired_projection
      };
    }
  };
  return {
    calls,
    options: {
      relationshipRuntime: relationshipOwner,
      workspaceRuntime: workspaceOwner,
      projectionRuntime: projectionOwner
    },
    rollbackCalls: () => rollbackCalls
  };
}

async function verifySuccessAndOrdering(kind) {
  const harness = ownerHarness(kind);
  const operation = kind === "attach"
    ? orchestrator.completeWorkspaceProjectAttach
    : orchestrator.completeWorkspaceProjectDetach;
  const result = await operation(input(), harness.options);
  assert.equal(result.outcome, kind === "attach" ? "ATTACH_SUCCESS" : "DETACH_SUCCESS");
  assert.deepEqual(harness.calls, [
    "relationship:read",
    "workspace:read",
    "projection:inspect",
    "projection:write",
    "relationship:complete"
  ]);
  assert.equal(result.projection_attempted, true);
  assert.equal(harness.rollbackCalls(), 0);
}

async function verifyPendingAuthorityGuards(kind, failureAt, expectedCalls) {
  const harness = ownerHarness(kind, failureAt);
  const operation = kind === "attach"
    ? orchestrator.completeWorkspaceProjectAttach
    : orchestrator.completeWorkspaceProjectDetach;
  const result = await operation(input(), harness.options);
  assert.equal(result.outcome, kind === "attach" ? "ATTACH_CONFLICT" : "DETACH_CONFLICT");
  assert.deepEqual(harness.calls, expectedCalls);
  assert.equal(result.projection_attempted, false);
  assert.equal(harness.rollbackCalls(), 0);
}

async function verifyProjectionFailureStopsTerminal(kind, failureAt) {
  const harness = ownerHarness(kind, failureAt);
  const operation = kind === "attach"
    ? orchestrator.completeWorkspaceProjectAttach
    : orchestrator.completeWorkspaceProjectDetach;
  const result = await operation(input(), harness.options);
  assert.equal(
    result.outcome,
    kind === "attach" ? "ATTACH_PROJECTION_PARTIAL" : "DETACH_PROJECTION_PARTIAL"
  );
  assert.equal(harness.calls.includes("relationship:complete"), false);
  assert.equal(harness.rollbackCalls(), 0);
  assert.equal(result.relationship_result, null);
}

async function verifyProjectionSuccessTerminalFailure(kind, failureAt) {
  const harness = ownerHarness(kind, failureAt);
  const operation = kind === "attach"
    ? orchestrator.completeWorkspaceProjectAttach
    : orchestrator.completeWorkspaceProjectDetach;
  const result = await operation(input(), harness.options);
  assert.equal(result.outcome, kind === "attach" ? "ATTACH_PROJECTION_PARTIAL" : "DETACH_PROJECTION_PARTIAL");
  assert.deepEqual(harness.calls, [
    "relationship:read",
    "workspace:read",
    "projection:inspect",
    "projection:write",
    "relationship:complete"
  ]);
  assert.equal(result.projection_result.outcome, "PROJECT_PROJECTION_WRITE_SUCCESS");
  assert.equal(harness.rollbackCalls(), 0);
}

async function verifyProjectionNoopBeforeTerminal(kind) {
  const harness = ownerHarness(kind, "projection-noop");
  const operation = kind === "attach"
    ? orchestrator.completeWorkspaceProjectAttach
    : orchestrator.completeWorkspaceProjectDetach;
  const result = await operation(input(), harness.options);
  assert.equal(result.outcome, kind === "attach" ? "ATTACH_SUCCESS" : "DETACH_SUCCESS");
  assert.equal(result.projection_result.outcome, "PROJECT_PROJECTION_WRITE_NOOP");
  assert.equal(harness.calls.at(-1), "relationship:complete");
  assert.equal(harness.rollbackCalls(), 0);
}

async function verifyRealOwnerIntegration() {
  const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mh-workspace-projection-orchestrator-"));
  const workspaceRoot = path.join(temporaryRoot, "workspaces");
  const projectsRoot = path.join(temporaryRoot, "projects");
  const projectSlug = "orchestrator-integration";
  const projectDirectory = path.join(projectsRoot, projectSlug);
  fs.mkdirSync(projectDirectory, { recursive: true });
  fs.writeFileSync(path.join(projectDirectory, "project.json"), `${JSON.stringify({
    project_name: "Orchestrator Integration",
    status: "initialized"
  }, null, 2)}\n`, "utf8");
  await storage.writeWorkspace(workspaceRoot, {
    schema_version: 1,
    workspace_id: WORKSPACE_ID,
    workspace_version: 1,
    workspace_name: "Orchestrator Integration",
    status: "ACTIVE",
    ownership_state: "UNCLAIMED",
    created_at: UPDATED_AT,
    updated_at: UPDATED_AT,
    project_relationships: [],
    evidence_references: []
  });
  const commonOptions = { root: workspaceRoot, projectsRoot, now: () => UPDATED_AT };
  const pendingAttach = await relationships.beginWorkspaceProjectAttach({
    workspace_id: WORKSPACE_ID,
    project_slug: projectSlug,
    expected_workspace_version: 1
  }, {
    ...commonOptions,
    generateProjectRelationshipId: () => RELATIONSHIP_ID
  });
  const attached = await orchestrator.completeWorkspaceProjectAttach({
    workspace_id: WORKSPACE_ID,
    relationship_id: RELATIONSHIP_ID,
    expected_workspace_version: pendingAttach.workspace_version
  }, commonOptions);
  assert.equal(attached.outcome, "ATTACH_SUCCESS");
  assert.equal(attached.projection_result.workspace_projection.relationship_status, "ATTACHED");

  const pendingDetach = await relationships.beginWorkspaceProjectDetach({
    workspace_id: WORKSPACE_ID,
    relationship_id: RELATIONSHIP_ID,
    expected_workspace_version: attached.relationship_result.workspace_version
  }, commonOptions);
  const detached = await orchestrator.completeWorkspaceProjectDetach({
    workspace_id: WORKSPACE_ID,
    relationship_id: RELATIONSHIP_ID,
    expected_workspace_version: pendingDetach.workspace_version
  }, commonOptions);
  assert.equal(detached.outcome, "DETACH_SUCCESS");
  const projected = projections.readProjectWorkspaceProjection(
    pendingAttach.relationship.project_id,
    commonOptions
  );
  assert.equal(projected.workspace_projection.relationship_status, "DETACHED");
  assert.equal(projected.workspace_projection.workspace_version, detached.relationship_result.workspace_version);
}

function verifyBoundaries() {
  assert.deepEqual(Object.keys(orchestrator).sort(), [
    "completeWorkspaceProjectAttach",
    "completeWorkspaceProjectDetach"
  ]);
  const sourcePath = path.resolve(
    __dirname,
    "../runtime/orchestrator-service/lib/workspace/workspace-projection-orchestrator.js"
  );
  const source = fs.readFileSync(sourcePath, "utf8");
  const forbidden = [
    [/(?:require|import)\s*\(?["'](?:node:)?(?:fs|path)["']/, "direct storage import"],
    [/\b(?:readFile|writeFile|appendFile|rename|unlink|mkdir|copyFile)(?:Sync)?\s*\(/, "direct storage access"],
    [/\b(?:validateProjectWorkspaceProjection|validateProjectRelationship|validateWorkspaceRecord)\s*\(/, "duplicated validation"],
    [/\b(?:writeWorkspace|readWorkspace|mutateWorkspace)\s*\(/, "direct Workspace mutation"],
    [/\b(?:project_relationships|workspace_projection)\s*[.[]/, "direct record mutation"],
    [/\b(?:rollbackWorkspaceProjectDetach|abandonWorkspaceProjectAttach)\s*\(/, "authority reversal"]
  ];
  for (const [pattern, label] of forbidden) assert.doesNotMatch(source, pattern, label);
  assert.match(source, /completeWorkspaceProjectAttach/);
  assert.match(source, /getWorkspaceProjectRelationship/);
  assert.match(source, /getWorkspace/);
  assert.match(source, /inspectProjectWorkspaceProjection/);
  assert.match(source, /writeProjectWorkspaceProjection/);
}

function verifyRegressionCompatibility() {
  for (const script of [
    "verify-workspace-relationship-runtime.js",
    "verify-project-workspace-projection.js"
  ]) {
    const result = spawnSync(process.execPath, [path.join(__dirname, script)], {
      encoding: "utf8",
      env: { ...process.env }
    });
    assert.equal(result.status, 0, `${script} failed:\n${result.stdout}\n${result.stderr}`);
  }
}

async function run() {
  await verifySuccessAndOrdering("attach");
  await verifySuccessAndOrdering("detach");
  await verifyPendingAuthorityGuards("attach", "not-pending", ["relationship:read"]);
  await verifyPendingAuthorityGuards("detach", "not-pending", ["relationship:read"]);
  await verifyPendingAuthorityGuards("attach", "version-conflict", ["relationship:read", "workspace:read"]);
  await verifyPendingAuthorityGuards("detach", "version-conflict", ["relationship:read", "workspace:read"]);
  await verifyProjectionFailureStopsTerminal("attach", "projection-read");
  await verifyProjectionFailureStopsTerminal("detach", "projection-read");
  await verifyProjectionFailureStopsTerminal("attach", "projection-write");
  await verifyProjectionFailureStopsTerminal("detach", "projection-write");
  await verifyProjectionSuccessTerminalFailure("attach", "terminal-throw");
  await verifyProjectionSuccessTerminalFailure("detach", "terminal-throw");
  await verifyProjectionSuccessTerminalFailure("attach", "terminal-conflict");
  await verifyProjectionSuccessTerminalFailure("detach", "terminal-conflict");
  await verifyProjectionNoopBeforeTerminal("attach");
  await verifyProjectionNoopBeforeTerminal("detach");
  await verifyRealOwnerIntegration();
  verifyBoundaries();
  verifyRegressionCompatibility();
  console.log(JSON.stringify({
    verifier: "workspace-projection-orchestrator",
    status: "PASS",
    orchestration_ordering: true,
    projection_before_terminal_completion: true,
    pending_authority_read_before_projection: true,
    no_terminal_completion_when_projection_fails: true,
    projection_success_terminal_failure_maps_to_projection_partial: true,
    no_rollback: true,
    owner_boundaries_preserved: true,
    regression_compatibility: true,
    production_data_touched: false
  }, null, 2));
}

run().catch((error) => {
  console.error(error.stack || error);
  process.exitCode = 1;
});

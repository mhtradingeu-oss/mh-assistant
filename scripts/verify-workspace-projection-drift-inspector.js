#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const inspector = require("../runtime/orchestrator-service/lib/workspace/workspace-projection-drift-inspector");

const WORKSPACE_ID = `ws_${"a".repeat(32)}`;
const PROJECT_ID = `prj_${"b".repeat(32)}`;

function relationship(relationshipId, status) {
  return {
    relationship_id: relationshipId,
    workspace_id: WORKSPACE_ID,
    project_id: PROJECT_ID,
    relationship_status: status,
    updated_at: "2026-07-15T00:00:00.000Z"
  };
}

function projection(status, workspaceVersion, relationshipId) {
  return {
    projection_schema_version: 1,
    workspace_id: WORKSPACE_ID,
    relationship_id: relationshipId,
    relationship_status: status,
    workspace_version: workspaceVersion,
    projected_at: "2026-07-15T00:00:00.000Z",
    authoritative: false,
    source_owner: "workspace-runtime"
  };
}

function makeOwners(overrides = {}) {
  const listRelationships = overrides.relationshipsList || [
    relationship(`wpr_${"1".repeat(32)}`, "PENDING_ATTACH"),
    relationship(`wpr_${"2".repeat(32)}`, "ATTACHED"),
    relationship(`wpr_${"3".repeat(32)}`, "PENDING_DETACH"),
    relationship(`wpr_${"4".repeat(32)}`, "DETACHED"),
    relationship(`wpr_${"5".repeat(32)}`, "ARCHIVED")
  ];

  const relationshipsById = new Map(listRelationships.map((item) => [item.relationship_id, item]));

  const counters = {
    list: 0,
    getRelationship: 0,
    getWorkspace: 0,
    inspectProjection: 0,
    findProject: 0
  };

  const relationshipRuntime = {
    async getWorkspaceProjectRelationship(input) {
      counters.getRelationship += 1;
      if (typeof overrides.onGetRelationship === "function") {
        return overrides.onGetRelationship(input);
      }
      const found = relationshipsById.get(input.relationship_id);
      if (!found) {
        const error = new Error("relationship missing");
        error.code = "WORKSPACE_RELATIONSHIP_NOT_FOUND";
        throw error;
      }
      return found;
    },
    async listWorkspaceProjectRelationships() {
      counters.list += 1;
      if (typeof overrides.onListRelationships === "function") {
        return overrides.onListRelationships();
      }
      return listRelationships;
    },
    async beginWorkspaceProjectAttach() {
      throw new Error("mutation API must not be used");
    },
    async completeWorkspaceProjectAttach() {
      throw new Error("mutation API must not be used");
    }
  };

  const workspaceRuntime = {
    async getWorkspace() {
      counters.getWorkspace += 1;
      if (typeof overrides.onGetWorkspace === "function") {
        return overrides.onGetWorkspace();
      }
      return {
        workspace_id: WORKSPACE_ID,
        workspace_version: 10,
        status: "ACTIVE"
      };
    },
    async transitionWorkspace() {
      throw new Error("mutation API must not be used");
    }
  };

  const projectIdentity = {
    findProjectById(projectId) {
      counters.findProject += 1;
      if (typeof overrides.onFindProjectById === "function") {
        return overrides.onFindProjectById(projectId);
      }
      return {
        resolution: "RESOLVED",
        project_id: projectId,
        project: {
          project_slug: "demo"
        }
      };
    }
  };

  const projectionRuntime = {
    PROJECT_WORKSPACE_PROJECTION_SCHEMA_VERSION: 1,
    PROJECT_WORKSPACE_PROJECTION_SOURCE_OWNER: "workspace-runtime",
    createProjectWorkspaceProjectionFingerprint(value) {
      return {
        projection_schema_version: value.projection_schema_version,
        workspace_id: value.workspace_id,
        relationship_id: value.relationship_id,
        relationship_status: value.relationship_status,
        workspace_version: value.workspace_version
      };
    },
    inspectProjectWorkspaceProjection(input) {
      counters.inspectProjection += 1;
      if (typeof overrides.onInspectProjection === "function") {
        return overrides.onInspectProjection(input);
      }
      return {
        classification: "MATCH",
        workspace_projection: projection(
          input.expected_projection.relationship_status,
          input.expected_projection.workspace_version,
          input.expected_projection.relationship_id
        ),
        projection_fingerprint: {
          projection_schema_version: 1,
          workspace_id: WORKSPACE_ID,
          relationship_id: input.expected_projection.relationship_id,
          relationship_status: input.expected_projection.relationship_status,
          workspace_version: input.expected_projection.workspace_version
        }
      };
    },
    writeProjectWorkspaceProjection() {
      throw new Error("projection writes are forbidden in inspector");
    }
  };

  return {
    options: {
      relationshipRuntime,
      workspaceRuntime,
      projectIdentity,
      projectionRuntime,
      now: () => "2026-07-15T10:00:00.000Z"
    },
    counters,
    listRelationships
  };
}

function assertAllowedDimensions(item) {
  assert.match(item.resolution_state, /^(RESOLVED|UNRESOLVED_PROJECT|PROJECT_ID_COLLISION)$/);
  assert.match(item.authority_alignment, /^(MATCH|MISSING|STALE|CONFLICTING|AHEAD_OF_AUTHORITY|NOT_APPLICABLE)$/);
  assert.match(item.operation_readiness, /^(COMPLETE|READY_TO_PROJECT|READY_TO_COMPLETE_TERMINAL|PARTIAL|BLOCKED|RECOVERY_REQUIRED)$/);
  assert.match(item.storage_health, /^(HEALTHY|WORKSPACE_RECOVERY_REQUIRED|PROJECT_PROJECTION_RECOVERY_REQUIRED|UNKNOWN)$/);
  assert.match(item.recommended_action, /^(NONE|WRITE_MISSING_PROJECTION|UPDATE_STALE_PROJECTION|COMPLETE_PENDING_ATTACH|COMPLETE_PENDING_DETACH|INVESTIGATE_CONFLICT|RESOLVE_PROJECT_IDENTITY|RECOVER_WORKSPACE_STORAGE|RECOVER_PROJECT_STORAGE)$/);
  assert.match(item.repair_eligibility, /^(ELIGIBLE|INELIGIBLE|UNKNOWN)$/);
}

async function verifyPendingAheadAttach() {
  const rel = relationship(`wpr_${"6".repeat(32)}`, "PENDING_ATTACH");
  const owners = makeOwners({
    relationshipsList: [rel],
    onInspectProjection(input) {
      return {
        classification: "MATCH",
        workspace_projection: projection("ATTACHED", input.expected_projection.workspace_version, rel.relationship_id),
        projection_fingerprint: {
          projection_schema_version: 1,
          workspace_id: WORKSPACE_ID,
          relationship_id: rel.relationship_id,
          relationship_status: "ATTACHED",
          workspace_version: input.expected_projection.workspace_version
        }
      };
    }
  });
  const result = await inspector.inspectWorkspaceProjectProjectionDrift({
    workspace_id: WORKSPACE_ID,
    relationship_id: rel.relationship_id
  }, owners.options);
  assert.equal(result.authority_alignment, "AHEAD_OF_AUTHORITY");
  assert.equal(result.operation_readiness, "READY_TO_COMPLETE_TERMINAL");
  assert.equal(result.recommended_action, "COMPLETE_PENDING_ATTACH");
  assertAllowedDimensions(result);
}

async function verifyPendingAheadDetach() {
  const rel = relationship(`wpr_${"7".repeat(32)}`, "PENDING_DETACH");
  const owners = makeOwners({
    relationshipsList: [rel],
    onInspectProjection(input) {
      return {
        classification: "MATCH",
        workspace_projection: projection("DETACHED", input.expected_projection.workspace_version, rel.relationship_id),
        projection_fingerprint: {
          projection_schema_version: 1,
          workspace_id: WORKSPACE_ID,
          relationship_id: rel.relationship_id,
          relationship_status: "DETACHED",
          workspace_version: input.expected_projection.workspace_version
        }
      };
    }
  });
  const result = await inspector.inspectWorkspaceProjectProjectionDrift({
    workspace_id: WORKSPACE_ID,
    relationship_id: rel.relationship_id
  }, owners.options);
  assert.equal(result.authority_alignment, "AHEAD_OF_AUTHORITY");
  assert.equal(result.operation_readiness, "READY_TO_COMPLETE_TERMINAL");
  assert.equal(result.recommended_action, "COMPLETE_PENDING_DETACH");
  assertAllowedDimensions(result);
}

async function verifyTerminalStates() {
  const attachedRel = relationship(`wpr_${"8".repeat(32)}`, "ATTACHED");

  const matchOwners = makeOwners({
    relationshipsList: [attachedRel],
    onInspectProjection(input) {
      return {
        classification: "MATCH",
        workspace_projection: projection("ATTACHED", input.expected_projection.workspace_version, attachedRel.relationship_id),
        projection_fingerprint: {
          projection_schema_version: 1,
          workspace_id: WORKSPACE_ID,
          relationship_id: attachedRel.relationship_id,
          relationship_status: "ATTACHED",
          workspace_version: input.expected_projection.workspace_version
        }
      };
    }
  });

  const match = await inspector.inspectWorkspaceProjectProjectionDrift({
    workspace_id: WORKSPACE_ID,
    relationship_id: attachedRel.relationship_id
  }, matchOwners.options);
  assert.equal(match.authority_alignment, "MATCH");
  assert.equal(match.operation_readiness, "COMPLETE");

  const missingOwners = makeOwners({
    relationshipsList: [attachedRel],
    onInspectProjection() {
      return {
        classification: "MISSING",
        workspace_projection: null,
        projection_fingerprint: null
      };
    }
  });

  const missing = await inspector.inspectWorkspaceProjectProjectionDrift({
    workspace_id: WORKSPACE_ID,
    relationship_id: attachedRel.relationship_id
  }, missingOwners.options);
  assert.equal(missing.authority_alignment, "MISSING");
  assert.equal(missing.operation_readiness, "PARTIAL");
  assert.equal(missing.recommended_action, "WRITE_MISSING_PROJECTION");

  const staleOwners = makeOwners({
    relationshipsList: [attachedRel],
    onInspectProjection(input) {
      return {
        classification: "STALE",
        workspace_projection: projection("ATTACHED", input.expected_projection.workspace_version - 1, attachedRel.relationship_id),
        projection_fingerprint: {
          projection_schema_version: 1,
          workspace_id: WORKSPACE_ID,
          relationship_id: attachedRel.relationship_id,
          relationship_status: "ATTACHED",
          workspace_version: input.expected_projection.workspace_version - 1
        }
      };
    }
  });

  const stale = await inspector.inspectWorkspaceProjectProjectionDrift({
    workspace_id: WORKSPACE_ID,
    relationship_id: attachedRel.relationship_id
  }, staleOwners.options);
  assert.equal(stale.authority_alignment, "STALE");
  assert.equal(stale.operation_readiness, "PARTIAL");
  assert.equal(stale.recommended_action, "UPDATE_STALE_PROJECTION");

  const conflictingOwners = makeOwners({
    relationshipsList: [attachedRel],
    onInspectProjection() {
      return {
        classification: "CONFLICTING",
        workspace_projection: {
          relation: "bad"
        },
        projection_fingerprint: null
      };
    }
  });

  const conflicting = await inspector.inspectWorkspaceProjectProjectionDrift({
    workspace_id: WORKSPACE_ID,
    relationship_id: attachedRel.relationship_id
  }, conflictingOwners.options);
  assert.equal(conflicting.authority_alignment, "CONFLICTING");
  assert.equal(conflicting.operation_readiness, "BLOCKED");
  assert.equal(conflicting.recommended_action, "INVESTIGATE_CONFLICT");
}

async function verifyResolutionAndRecoveryStates() {
  const rel = relationship(`wpr_${"9".repeat(32)}`, "ATTACHED");

  const unresolvedOwners = makeOwners({
    relationshipsList: [rel],
    onFindProjectById() {
      return {
        resolution: "UNRESOLVED",
        project_id: PROJECT_ID,
        project: null
      };
    }
  });
  const unresolved = await inspector.inspectWorkspaceProjectProjectionDrift({
    workspace_id: WORKSPACE_ID,
    relationship_id: rel.relationship_id
  }, unresolvedOwners.options);
  assert.equal(unresolved.resolution_state, "UNRESOLVED_PROJECT");
  assert.equal(unresolved.recommended_action, "RESOLVE_PROJECT_IDENTITY");
  assert.equal(unresolved.operation_readiness, "BLOCKED");

  const collisionOwners = makeOwners({
    relationshipsList: [rel],
    onFindProjectById() {
      const error = new Error("collision");
      error.code = "PROJECT_ID_COLLISION";
      throw error;
    }
  });
  const collision = await inspector.inspectWorkspaceProjectProjectionDrift({
    workspace_id: WORKSPACE_ID,
    relationship_id: rel.relationship_id
  }, collisionOwners.options);
  assert.equal(collision.resolution_state, "PROJECT_ID_COLLISION");
  assert.equal(collision.recommended_action, "RESOLVE_PROJECT_IDENTITY");

  const workspaceRecoveryOwners = makeOwners({
    relationshipsList: [rel],
    onGetRelationship() {
      const error = new Error("workspace recovery required");
      error.code = "WORKSPACE_RELATIONSHIP_WORKSPACE_RECOVERY_REQUIRED";
      throw error;
    }
  });
  const workspaceRecovery = await inspector.inspectWorkspaceProjectProjectionDrift({
    workspace_id: WORKSPACE_ID,
    relationship_id: rel.relationship_id
  }, workspaceRecoveryOwners.options);
  assert.equal(workspaceRecovery.storage_health, "WORKSPACE_RECOVERY_REQUIRED");
  assert.equal(workspaceRecovery.operation_readiness, "RECOVERY_REQUIRED");
  assert.equal(workspaceRecovery.recommended_action, "RECOVER_WORKSPACE_STORAGE");

  const projectRecoveryOwners = makeOwners({
    relationshipsList: [rel],
    onInspectProjection() {
      const error = new Error("projection recovery required");
      error.code = "PROJECT_PROJECTION_RECOVERY_REQUIRED";
      throw error;
    }
  });
  const projectRecovery = await inspector.inspectWorkspaceProjectProjectionDrift({
    workspace_id: WORKSPACE_ID,
    relationship_id: rel.relationship_id
  }, projectRecoveryOwners.options);
  assert.equal(projectRecovery.storage_health, "PROJECT_PROJECTION_RECOVERY_REQUIRED");
  assert.equal(projectRecovery.operation_readiness, "RECOVERY_REQUIRED");
  assert.equal(projectRecovery.recommended_action, "RECOVER_PROJECT_STORAGE");
}

async function verifyListAndSummary() {
  const relA = relationship(`wpr_${"0".repeat(31)}1`, "PENDING_ATTACH");
  const relB = relationship(`wpr_${"0".repeat(31)}2`, "ATTACHED");
  const relC = relationship(`wpr_${"0".repeat(31)}3`, "PENDING_DETACH");
  const relD = relationship(`wpr_${"0".repeat(31)}4`, "DETACHED");
  const relE = relationship(`wpr_${"0".repeat(31)}5`, "ARCHIVED");

  const owners = makeOwners({
    relationshipsList: [relA, relB, relC, relD, relE],
    onInspectProjection(input) {
      if (input.expected_projection.relationship_id === relB.relationship_id) {
        return {
          classification: "MISSING",
          workspace_projection: null,
          projection_fingerprint: null
        };
      }
      if (input.expected_projection.relationship_id === relC.relationship_id) {
        const error = new Error("broken projection read");
        error.code = "PROJECT_PROJECTION_PROJECT_NOT_FOUND";
        throw error;
      }
      return {
        classification: "MATCH",
        workspace_projection: projection(
          input.expected_projection.relationship_status,
          input.expected_projection.workspace_version,
          input.expected_projection.relationship_id
        ),
        projection_fingerprint: {
          projection_schema_version: 1,
          workspace_id: WORKSPACE_ID,
          relationship_id: input.expected_projection.relationship_id,
          relationship_status: input.expected_projection.relationship_status,
          workspace_version: input.expected_projection.workspace_version
        }
      };
    }
  });

  const listedDefault = await inspector.listWorkspaceProjectionDrift(
    { workspace_id: WORKSPACE_ID },
    owners.options
  );
  assert.deepEqual(
    listedDefault.items.map((item) => item.relationship_id),
    [relA.relationship_id, relB.relationship_id, relC.relationship_id]
  );
  assert.equal(listedDefault.errors.length, 1);

  const listedWithHistory = await inspector.listWorkspaceProjectionDrift(
    { workspace_id: WORKSPACE_ID, include_history: true },
    owners.options
  );
  assert.deepEqual(
    listedWithHistory.items.map((item) => item.relationship_id),
    [relA.relationship_id, relB.relationship_id, relC.relationship_id, relD.relationship_id, relE.relationship_id]
  );

  const beforeListCalls = owners.counters.list;
  const summary = await inspector.summarizeWorkspaceProjectionDrift(
    { workspace_id: WORKSPACE_ID },
    owners.options
  );
  assert.equal(owners.counters.list, beforeListCalls + 1);
  assert.equal(summary.inspected_relationships, 3);
  assert.equal(summary.error_count, 1);
  assert.ok(summary.counts.authority_alignment.AHEAD_OF_AUTHORITY >= 1);
  assert.ok(summary.counts.authority_alignment.MISSING >= 1);
}

function verifyBoundaries() {
  assert.deepEqual(Object.keys(inspector).sort(), [
    "inspectWorkspaceProjectProjectionDrift",
    "listWorkspaceProjectionDrift",
    "summarizeWorkspaceProjectionDrift"
  ]);

  const sourcePath = path.resolve(
    __dirname,
    "../runtime/orchestrator-service/lib/workspace/workspace-projection-drift-inspector.js"
  );
  const source = fs.readFileSync(sourcePath, "utf8");

  const forbidden = [
    [/\bwriteWorkspace\s*\(/, "workspace writes are forbidden"],
    [/\bwriteProjectWorkspaceProjection\s*\(/, "projection writes are forbidden"],
    [/\bcompleteWorkspaceProjectAttach\s*\(/, "relationship completion is forbidden"],
    [/\bcompleteWorkspaceProjectDetach\s*\(/, "relationship completion is forbidden"],
    [/\brollbackWorkspaceProjectDetach\s*\(/, "rollback is forbidden"],
    [/\babandonWorkspaceProjectAttach\s*\(/, "abandon is forbidden"]
  ];

  for (const [pattern, label] of forbidden) {
    assert.doesNotMatch(source, pattern, label);
  }
}

async function run() {
  await verifyPendingAheadAttach();
  await verifyPendingAheadDetach();
  await verifyTerminalStates();
  await verifyResolutionAndRecoveryStates();
  await verifyListAndSummary();
  verifyBoundaries();

  console.log(JSON.stringify({
    verifier: "workspace-projection-drift-inspector",
    status: "PASS",
    read_only: true,
    frozen_dimensions: true,
    pending_ahead_of_authority: true,
    terminal_interpretation: true,
    list_default_scope: true,
    summary_reduction_only: true,
    per_item_failures_visible: true,
    production_data_touched: false
  }, null, 2));
}

run().catch((error) => {
  console.error(error.stack || error);
  process.exitCode = 1;
});

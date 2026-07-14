#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const contract = require("../../runtime/orchestrator-service/lib/workspace/workspace-contract");

const UUID_HEX = "0123456789abcdef0123456789abcdef";
const TIMESTAMP = "2026-07-14T12:00:00.000Z";

function assertContractError(fn, code) {
  assert.throws(fn, (error) => {
    assert.equal(error.name, "WorkspaceContractError");
    assert.equal(error.code, code);
    return true;
  });
}

function relationship(overrides = {}) {
  return {
    relationship_schema_version: 1,
    relationship_id: `wpr_${UUID_HEX}`,
    project_id: `prj_${UUID_HEX}`,
    relationship_status: "PENDING_ATTACH",
    validation_state: "VALID",
    created_at: TIMESTAMP,
    updated_at: TIMESTAMP,
    attached_at: null,
    detached_at: null,
    archived_at: null,
    ...overrides
  };
}

function evidence(overrides = {}) {
  return {
    reference_type: "workspace_creation",
    reference_id: "evt_workspace_creation_1",
    source_owner: "workspace-runtime",
    recorded_at: TIMESTAMP,
    ...overrides
  };
}

function workspace(overrides = {}) {
  return {
    schema_version: 1,
    workspace_id: `ws_${UUID_HEX}`,
    workspace_version: 1,
    workspace_name: "Contract Workspace",
    status: "CREATING",
    ownership_state: "UNCLAIMED",
    created_at: TIMESTAMP,
    updated_at: TIMESTAMP,
    project_relationships: [relationship()],
    evidence_references: [evidence()],
    ...overrides
  };
}

function assertEnum(actual, expected) {
  assert.deepEqual(actual, expected);
  assert.equal(Object.isFrozen(actual), true);
}

function run() {
  assert.equal(contract.PROJECT_RELATIONSHIP_SCHEMA_VERSION, 1);
  assertEnum(contract.WORKSPACE_LIFECYCLE_STATES, [
    "CREATING", "ACTIVE", "SUSPENDED", "ARCHIVED", "FAILED"
  ]);
  assertEnum(contract.WORKSPACE_OWNERSHIP_STATES, [
    "UNCLAIMED", "SHADOW", "CLAIMED", "VERIFIED", "TRANSFER_PENDING"
  ]);
  assertEnum(contract.P1_1_OPERATIONAL_OWNERSHIP_STATES, ["UNCLAIMED", "SHADOW"]);
  assertEnum(contract.PROJECT_RELATIONSHIP_STATES, [
    "PENDING_ATTACH", "ATTACHED", "PENDING_DETACH", "DETACHED", "ARCHIVED"
  ]);
  assertEnum(contract.EVIDENCE_REFERENCE_TYPES, [
    "workspace_creation",
    "workspace_activation",
    "workspace_suspension",
    "workspace_resumption",
    "workspace_failure",
    "workspace_archive",
    "workspace_attach",
    "workspace_detach",
    "workspace_relationship_archive",
    "workspace_recovery",
    "workspace_projection_rebuild",
    "workspace_ownership_shadow"
  ]);
  assertEnum(contract.ATTACH_OUTCOMES, [
    "ATTACH_SUCCESS",
    "ATTACH_PENDING",
    "ATTACH_PROJECTION_PARTIAL",
    "ATTACH_CONFLICT",
    "ATTACH_RECOVERY_REQUIRED",
    "ATTACH_FAILED"
  ]);
  assertEnum(contract.DETACH_OUTCOMES, [
    "DETACH_SUCCESS",
    "DETACH_PENDING",
    "DETACH_PROJECTION_PARTIAL",
    "DETACH_CONFLICT",
    "DETACH_RECOVERY_REQUIRED",
    "DETACH_FAILED"
  ]);
  assertEnum(contract.VALIDATION_STATES, [
    "VALID", "UNRESOLVED_PROJECT", "PROJECT_ID_COLLISION", "MATCH", "MISSING", "STALE", "CONFLICTING"
  ]);
  assert.strictEqual(contract.DRIFT_VALIDATION_STATES, contract.VALIDATION_STATES);
  contract.WORKSPACE_LIFECYCLE_STATES.forEach(contract.validateWorkspaceStatus);
  contract.WORKSPACE_OWNERSHIP_STATES.forEach(contract.validateOwnershipState);
  contract.PROJECT_RELATIONSHIP_STATES.forEach(contract.validateProjectRelationshipStatus);
  contract.VALIDATION_STATES.forEach(contract.validateValidationState);
  assertContractError(
    () => contract.validateProjectRelationshipStatus("UNRESOLVED_PROJECT"),
    contract.ERROR_CODES.INVALID_RELATIONSHIP_STATUS
  );
  assertContractError(
    () => contract.validateValidationState("ATTACHED"),
    contract.ERROR_CODES.INVALID_VALIDATION_STATE
  );

  const validIds = {
    workspace: `ws_${UUID_HEX}`,
    project: `prj_${UUID_HEX}`,
    relationship: `wpr_${UUID_HEX}`
  };
  assert.equal(contract.isValidWorkspaceId(validIds.workspace), true);
  assert.equal(contract.isValidProjectId(validIds.project), true);
  assert.equal(contract.isValidProjectRelationshipId(validIds.relationship), true);
  assert.equal(contract.isValidWorkspaceId(validIds.workspace.toUpperCase()), false);
  assert.equal(contract.isValidProjectId("prj_short"), false);
  assert.equal(contract.isValidProjectRelationshipId("wpr_0123456789abcdef0123456789abcdeg"), false);
  assertContractError(
    () => contract.validateWorkspaceId(validIds.workspace.toUpperCase()),
    contract.ERROR_CODES.INVALID_WORKSPACE_ID
  );

  const uppercaseUuid = () => "01234567-89AB-CDEF-0123-456789ABCDEF";
  assert.equal(contract.generateWorkspaceId(uppercaseUuid), validIds.workspace);
  assert.equal(contract.generateProjectId(uppercaseUuid), validIds.project);
  assert.equal(contract.generateProjectRelationshipId(uppercaseUuid), validIds.relationship);
  assert.match(contract.generateWorkspaceId(), contract.WORKSPACE_ID_REGEX);

  assertContractError(
    () => contract.validateWorkspaceCreationInput({ workspace_id: validIds.workspace }),
    contract.ERROR_CODES.AUTHORITATIVE_ID_NOT_ALLOWED
  );
  assertContractError(
    () => contract.validateWorkspaceCreationInput({ workspaceId: validIds.workspace }),
    contract.ERROR_CODES.AUTHORITATIVE_ID_NOT_ALLOWED
  );
  assertContractError(
    () => contract.validateProjectCreationInput({ project_id: validIds.project }),
    contract.ERROR_CODES.AUTHORITATIVE_ID_NOT_ALLOWED
  );
  assertContractError(
    () => contract.validateProjectRelationshipCreationInput({ relationship_id: validIds.relationship }),
    contract.ERROR_CODES.AUTHORITATIVE_ID_NOT_ALLOWED
  );
  assertContractError(
    () => contract.validateProjectRelationshipCreationInput({ project_id: validIds.project }),
    contract.ERROR_CODES.AUTHORITATIVE_ID_NOT_ALLOWED
  );
  assertContractError(
    () => contract.validateProjectRelationshipCreationInput({ relationship_schema_version: 1 }),
    contract.ERROR_CODES.AUTHORITATIVE_ID_NOT_ALLOWED
  );

  const validWorkspace = workspace();
  assert.strictEqual(contract.validateWorkspaceRecord(validWorkspace), validWorkspace);
  assertContractError(
    () => contract.validateWorkspaceRecord(workspace({ unexpected: true })),
    contract.ERROR_CODES.UNKNOWN_WORKSPACE_FIELD
  );
  assertContractError(
    () => contract.validateWorkspaceRecord(workspace({ status: "READY" })),
    contract.ERROR_CODES.INVALID_WORKSPACE_STATUS
  );
  assertContractError(
    () => contract.validateWorkspaceRecord(workspace({ ownership_state: "OWNER" })),
    contract.ERROR_CODES.INVALID_OWNERSHIP_STATE
  );
  assertContractError(
    () => contract.validateWorkspaceRecord(workspace({ workspace_id: validIds.workspace.toUpperCase() })),
    contract.ERROR_CODES.INVALID_WORKSPACE_ID
  );

  const allowedWorkspaceTransitions = new Set([
    "CREATING:ACTIVE", "CREATING:FAILED", "ACTIVE:SUSPENDED", "SUSPENDED:ACTIVE",
    "ACTIVE:ARCHIVED", "SUSPENDED:ARCHIVED", "FAILED:ARCHIVED", "FAILED:CREATING"
  ]);
  for (const from of contract.WORKSPACE_LIFECYCLE_STATES) {
    for (const to of contract.WORKSPACE_LIFECYCLE_STATES) {
      assert.equal(contract.isWorkspaceTransitionAllowed(from, to), allowedWorkspaceTransitions.has(`${from}:${to}`));
    }
  }
  assert.equal(contract.validateWorkspaceTransition("CREATING", "ACTIVE"), true);
  assertContractError(
    () => contract.validateWorkspaceTransition("ARCHIVED", "ACTIVE"),
    contract.ERROR_CODES.INVALID_WORKSPACE_TRANSITION
  );

  for (const state of contract.P1_1_OPERATIONAL_OWNERSHIP_STATES) {
    assert.equal(contract.validateOperationalOwnershipState(state), state);
  }
  for (const state of ["CLAIMED", "VERIFIED", "TRANSFER_PENDING"]) {
    assertContractError(
      () => contract.validateOperationalOwnershipState(state),
      contract.ERROR_CODES.OWNERSHIP_STATE_NOT_OPERATIONAL
    );
  }

  const allowedRelationshipTransitions = new Set([
    "PENDING_ATTACH:ATTACHED", "PENDING_ATTACH:ARCHIVED", "ATTACHED:PENDING_DETACH",
    "PENDING_DETACH:DETACHED", "PENDING_DETACH:ATTACHED", "DETACHED:ARCHIVED"
  ]);
  for (const from of contract.PROJECT_RELATIONSHIP_STATES) {
    for (const to of contract.PROJECT_RELATIONSHIP_STATES) {
      assert.equal(
        contract.isProjectRelationshipTransitionAllowed(from, to),
        allowedRelationshipTransitions.has(`${from}:${to}`)
      );
    }
  }
  assertContractError(
    () => contract.validateProjectRelationshipTransition("ARCHIVED", "ATTACHED"),
    contract.ERROR_CODES.INVALID_RELATIONSHIP_TRANSITION
  );

  for (const type of contract.EVIDENCE_REFERENCE_TYPES) {
    assert.equal(contract.validateEvidenceReference(evidence({ reference_type: type })).reference_type, type);
  }
  assertContractError(
    () => contract.validateEvidenceReference(evidence({ reference_type: "workspace_unknown" })),
    contract.ERROR_CODES.INVALID_EVIDENCE_REFERENCE_TYPE
  );
  assertContractError(
    () => contract.validateEvidenceReference({ ...evidence(), token: "raw-value" }),
    contract.ERROR_CODES.SENSITIVE_EVIDENCE_DATA
  );
  assertContractError(
    () => contract.validateEvidenceReference(evidence({ reference_id: "Bearer raw-authorization" })),
    contract.ERROR_CODES.SENSITIVE_EVIDENCE_DATA
  );

  assert.equal(contract.validateProjectRelationship(relationship()).validation_state, "VALID");
  assert.equal(contract.validateProjectRelationship(relationship()).relationship_schema_version, 1);
  const missingRelationshipSchemaVersion = relationship();
  delete missingRelationshipSchemaVersion.relationship_schema_version;
  assertContractError(
    () => contract.validateProjectRelationship(missingRelationshipSchemaVersion),
    contract.ERROR_CODES.MISSING_FIELD
  );
  for (const invalidVersion of [null, 0, -1, 1.5, "1", 2]) {
    assertContractError(
      () => contract.validateProjectRelationship(relationship({
        relationship_schema_version: invalidVersion
      })),
      contract.ERROR_CODES.INVALID_RELATIONSHIP_SCHEMA_VERSION
    );
  }
  assertContractError(
    () => contract.validateProjectRelationship({ ...relationship(), unexpected: true }),
    contract.ERROR_CODES.UNKNOWN_RELATIONSHIP_FIELD
  );
  assertContractError(
    () => contract.validateProjectRelationship({ ...relationship(), project_slug: "routing-only" }),
    contract.ERROR_CODES.PROJECT_SLUG_FORBIDDEN
  );
  assert.equal(contract.PROJECT_RELATIONSHIP_FIELDS.includes("project_slug"), false);
  assert.equal(contract.PROJECT_RELATIONSHIP_FIELDS.includes("slug"), false);
  assert.equal(contract.PROJECT_RELATIONSHIP_FIELDS.includes("validation_state"), true);
  assert.equal(contract.PROJECT_RELATIONSHIP_FIELDS.includes("relationship_status"), true);
  assert.equal(contract.PROJECT_RELATIONSHIP_FIELDS.includes("relationship_schema_version"), true);
  assert.equal(
    contract.PROJECT_RELATIONSHIP_STATES.some((state) => contract.VALIDATION_STATES.includes(state)),
    false
  );

  const changedRelationshipId = relationship({ relationship_id: "wpr_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" });
  assertContractError(
    () => contract.assertRelationshipIdImmutable(relationship(), changedRelationshipId),
    contract.ERROR_CODES.RELATIONSHIP_ID_IMMUTABLE
  );
  assertContractError(
    () => contract.assertRelationshipIdNotReused([relationship()], validIds.relationship),
    contract.ERROR_CODES.RELATIONSHIP_ID_REUSE
  );

  contract.ATTACH_OUTCOMES.forEach(contract.validateAttachOutcome);
  contract.DETACH_OUTCOMES.forEach(contract.validateDetachOutcome);
  assertContractError(
    () => contract.validateAttachOutcome("SUCCESS"),
    contract.ERROR_CODES.INVALID_ATTACH_OUTCOME
  );
  assertContractError(
    () => contract.validateDetachOutcome("SUCCESS"),
    contract.ERROR_CODES.INVALID_DETACH_OUTCOME
  );

  assert.equal(contract.validateExpectedWorkspaceVersion(3, 3), true);
  assertContractError(
    () => contract.validateExpectedWorkspaceVersion(3, 2),
    contract.ERROR_CODES.WORKSPACE_VERSION_CONFLICT
  );
  assert.equal(contract.doesWorkspaceStatusGrantAuthorization("ACTIVE"), false);

  const unboundedEvidence = Array.from({ length: 75 }, (_, index) => evidence({
    reference_id: `evt_${index}`
  }));
  const noTruncationWorkspace = workspace({ evidence_references: unboundedEvidence });
  contract.validateWorkspaceRecord(noTruncationWorkspace);
  assert.equal(noTruncationWorkspace.evidence_references.length, 75);

  console.log(JSON.stringify({
    result: "pass",
    checks: {
      enums: "pass",
      identifiers: "pass",
      backendGeneration: "pass",
      schemaAndUnknownFields: "pass",
      relationshipSchemaVersion: "pass",
      lifecycleTransitions: "pass",
      operationalOwnership: "pass",
      relationshipTransitions: "pass",
      evidenceReferences: "pass",
      terminalImmutability: "pass",
      validationSeparation: "pass",
      noSlugIdentity: "pass",
      noSilentTruncation: "pass"
    }
  }, null, 2));
}

run();

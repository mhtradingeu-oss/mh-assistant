"use strict";

const WORKSPACE_CREATION_APPROVAL_SCHEMA_VERSION = 1;
const TARGET_WORKSPACE_NAME = "MH Trading";
const TARGET_ACTION = "CREATE_WORKSPACE";
const TARGET_OWNER = "MH Trading Owner";
const APPROVAL_STATES = Object.freeze(["APPROVED", "BLOCKED"]);
const REFERENCE_STATES = Object.freeze(["PRESENT", "MISSING", "INVALID"]);
const BLOCKING_REASON_ORDER = Object.freeze([
  "WORKSPACE_SCOPE_INVALID",
  "ACTION_INVALID",
  "APPROVAL_MISSING_OR_INVALID",
  "OWNER_INVALID",
  "EVIDENCE_REFERENCE_INVALID",
  "REQUESTER_INVALID",
  "APPROVER_INVALID"
]);

const AUTHORITY = Object.freeze({
  artifact_contract_owner: "workspace-creation-approval-contract",
  assessment_owner: "workspace-creation-approval-model",
  evidence_owner: "governance-approval-engine",
  execution_coordinator: "controlled-workspace-creation-boundary",
  workspace_writer_owner: "workspace-runtime",
  backend_authoritative: true,
  frontend_projection_only: true,
  creates_workspace: false,
  creates_workspace_id: false,
  writes_workspace_storage: false,
  mutates_projects: false,
  mutates_hairoticmen: false,
  migrates_data: false
});

class WorkspaceCreationApprovalContractError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "WorkspaceCreationApprovalContractError";
    this.code = "WORKSPACE_CREATION_APPROVAL_CONTRACT_INVALID";
    this.details = deepFreeze(copy(details));
  }
}

function copy(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.freeze(value);
  Object.values(value).forEach(deepFreeze);
  return value;
}

function fail(message, details) {
  throw new WorkspaceCreationApprovalContractError(message, details);
}

function object(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail(`${label} must be an object`);
}

function exact(value, fields, label) {
  object(value, label);
  const actual = Object.keys(value).sort();
  const expected = [...fields].sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(`${label} fields are invalid`, { actual, expected });
  }
}

function boundedNullableText(value, label, maximum = 200) {
  if (value === null) return;
  if (typeof value !== "string" || value.length < 1 || value.length > maximum || value.trim() !== value) {
    fail(`${label} must be null or a bounded trimmed string`);
  }
}

function boundedText(value, label, maximum = 200) {
  if (typeof value !== "string" || value.length < 1 || value.length > maximum || value.trim() !== value) {
    fail(`${label} must be a bounded trimmed string`);
  }
}

function timestamp(value, label) {
  if (typeof value !== "string"
    || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)
    || Number.isNaN(Date.parse(value))) fail(`${label} must be a UTC ISO-8601 timestamp`);
}

function validateEvidenceReference(value) {
  exact(
    value,
    ["state", "reference_type", "reference_id", "source_owner", "recorded_at"],
    "evidence_reference"
  );
  if (!REFERENCE_STATES.includes(value.state)) fail("evidence_reference.state is invalid");
  if (value.state !== "PRESENT") {
    if (value.reference_type !== null || value.reference_id !== null || value.source_owner !== "governance-approval-engine"
      || value.recorded_at !== null) fail("absent evidence_reference projection is invalid");
    return;
  }
  if (value.reference_type !== "governance_approval"
    || typeof value.reference_id !== "string"
    || !/^approval[_-][A-Za-z0-9][A-Za-z0-9:_-]{2,191}$/.test(value.reference_id)
    || value.source_owner !== "governance-approval-engine") fail("evidence_reference is invalid");
  timestamp(value.recorded_at, "evidence_reference.recorded_at");
}

function validateRequester(value) {
  exact(value, ["state", "requester_id", "requester_type", "source_owner", "evidence_ref"], "requester");
  if (!REFERENCE_STATES.includes(value.state)) fail("requester.state is invalid");
  if (value.state !== "PRESENT") {
    if (value.requester_id !== null || value.requester_type !== null
      || value.source_owner !== "governance-approval-engine" || value.evidence_ref !== null) {
      fail("absent requester projection is invalid");
    }
    return;
  }
  boundedText(value.requester_id, "requester.requester_id", 120);
  if (!["human", "service"].includes(value.requester_type)
    || value.source_owner !== "governance-approval-engine") fail("requester is invalid");
  boundedText(value.evidence_ref, "requester.evidence_ref");
}

function validateApprover(value) {
  exact(value, ["state", "approver_id", "decided_at", "source_owner", "evidence_ref"], "approver");
  if (!REFERENCE_STATES.includes(value.state)) fail("approver.state is invalid");
  if (value.state !== "PRESENT") {
    if (value.approver_id !== null || value.decided_at !== null
      || value.source_owner !== "governance-approval-engine" || value.evidence_ref !== null) {
      fail("absent approver projection is invalid");
    }
    return;
  }
  boundedText(value.approver_id, "approver.approver_id", 120);
  timestamp(value.decided_at, "approver.decided_at");
  if (value.source_owner !== "governance-approval-engine") fail("approver source_owner is invalid");
  boundedText(value.evidence_ref, "approver.evidence_ref");
}

function expectedBlockingReasons(value) {
  const reasons = [];
  if (value.workspace_name !== TARGET_WORKSPACE_NAME) reasons.push("WORKSPACE_SCOPE_INVALID");
  if (value.action !== TARGET_ACTION) reasons.push("ACTION_INVALID");
  if (value.decision !== "APPROVED") reasons.push("APPROVAL_MISSING_OR_INVALID");
  if (value.owner !== TARGET_OWNER) reasons.push("OWNER_INVALID");
  if (value.evidence_reference.state !== "PRESENT") reasons.push("EVIDENCE_REFERENCE_INVALID");
  if (value.requester.state !== "PRESENT") reasons.push("REQUESTER_INVALID");
  if (value.approver.state !== "PRESENT") reasons.push("APPROVER_INVALID");
  else if (value.evidence_reference.state === "PRESENT"
    && (value.approver.decided_at !== value.evidence_reference.recorded_at
      || value.approver.evidence_ref !== value.evidence_reference.reference_id)) {
    reasons.push("APPROVER_INVALID");
  }
  return reasons;
}

function validateSafety(value) {
  exact(value, [
    "read_only", "workspace_created", "workspace_id_created", "workspace_storage_written",
    "project_mutated", "hairoticmen_mutated", "data_migrated", "unrelated_writes"
  ], "safety");
  if (!value.read_only || value.workspace_created || value.workspace_id_created
    || value.workspace_storage_written || value.project_mutated || value.hairoticmen_mutated
    || value.data_migrated || value.unrelated_writes) fail("safety declaration is invalid");
}

function validateAuthority(value) {
  exact(value, Object.keys(AUTHORITY), "authority");
  if (Object.entries(AUTHORITY).some(([field, expected]) => value[field] !== expected)) {
    fail("authority declaration is invalid");
  }
}

function validateWorkspaceCreationApprovalArtifact(value) {
  exact(value, [
    "schema_version", "kind", "approval_state", "workspace_name", "action", "decision",
    "owner", "evidence_reference", "requester", "approver", "blocking_reasons", "safety",
    "authority"
  ], "Workspace creation approval artifact");
  if (value.schema_version !== WORKSPACE_CREATION_APPROVAL_SCHEMA_VERSION
    || value.kind !== "read_only_workspace_creation_approval_artifact") {
    fail("artifact schema or kind is invalid");
  }
  if (!APPROVAL_STATES.includes(value.approval_state)) fail("approval_state is invalid");
  boundedNullableText(value.workspace_name, "workspace_name");
  boundedNullableText(value.action, "action", 80);
  boundedNullableText(value.decision, "decision", 40);
  boundedNullableText(value.owner, "owner", 120);
  validateEvidenceReference(value.evidence_reference);
  validateRequester(value.requester);
  validateApprover(value.approver);
  if (!Array.isArray(value.blocking_reasons)
    || value.blocking_reasons.some((reason) => !BLOCKING_REASON_ORDER.includes(reason))) {
    fail("blocking_reasons are invalid");
  }
  const expectedReasons = expectedBlockingReasons(value);
  if (JSON.stringify(value.blocking_reasons) !== JSON.stringify(expectedReasons)) {
    fail("blocking_reasons contradict the validated approval evidence");
  }
  if ((value.approval_state === "APPROVED") !== (expectedReasons.length === 0)) {
    fail("approval_state contradicts the validated approval evidence");
  }
  validateSafety(value.safety);
  validateAuthority(value.authority);
  return deepFreeze(copy(value));
}

module.exports = Object.freeze({
  APPROVAL_STATES,
  AUTHORITY,
  BLOCKING_REASON_ORDER,
  TARGET_ACTION,
  TARGET_OWNER,
  TARGET_WORKSPACE_NAME,
  WORKSPACE_CREATION_APPROVAL_SCHEMA_VERSION,
  WorkspaceCreationApprovalContractError,
  deepFreeze,
  validateWorkspaceCreationApprovalArtifact
});

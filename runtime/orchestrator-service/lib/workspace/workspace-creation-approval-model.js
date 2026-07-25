"use strict";

const {
  AUTHORITY,
  TARGET_ACTION,
  TARGET_OWNER,
  TARGET_WORKSPACE_NAME,
  WORKSPACE_CREATION_APPROVAL_SCHEMA_VERSION,
  validateWorkspaceCreationApprovalArtifact
} = require("./workspace-creation-approval-contract");
const {
  isAuthoritativeProjection
} = require("./workspace-approval-authority-provenance");

const CANDIDATE_FIELDS = new Set([
  "workspace_name", "action", "decision", "owner", "evidence_reference", "requester", "approver"
]);

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function text(value, maximum = 200) {
  return typeof value === "string" && value.length > 0 && value.length <= maximum
    && value.trim() === value ? value : null;
}

function validTimestamp(value) {
  return typeof value === "string"
    && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)
    && !Number.isNaN(Date.parse(value));
}

function candidate(value) {
  if (!isAuthoritativeProjection(value)) {
    throw new TypeError("Workspace creation approval input must come from the authoritative approval projection");
  }
  if (!isObject(value)) throw new TypeError("Workspace creation approval evidence must be an object");
  for (const field of Object.keys(value)) {
    if (!CANDIDATE_FIELDS.has(field)) {
      throw new TypeError(`Workspace creation approval evidence contains unknown field: ${field}`);
    }
  }
  return value;
}

function absentProjection(state, fields, sourceOwner) {
  return Object.fromEntries([
    ["state", state],
    ...fields.map((field) => [field, null]),
    ["source_owner", sourceOwner]
  ]);
}

function evidenceReferenceProjection(value) {
  const fields = ["reference_type", "reference_id", "recorded_at"];
  if (value === undefined || value === null) {
    return absentProjection("MISSING", fields, "governance-approval-engine");
  }
  if (!isObject(value)) return absentProjection("INVALID", fields, "governance-approval-engine");
  const valid = Object.keys(value).sort().join(",")
      === ["recorded_at", "reference_id", "reference_type", "source_owner"].sort().join(",")
    && value.reference_type === "governance_approval"
    && /^approval[_-][A-Za-z0-9][A-Za-z0-9:_-]{2,191}$/.test(value.reference_id || "")
    && value.source_owner === "governance-approval-engine"
    && validTimestamp(value.recorded_at);
  if (!valid) return absentProjection("INVALID", fields, "governance-approval-engine");
  return {
    state: "PRESENT",
    reference_type: value.reference_type,
    reference_id: value.reference_id,
    source_owner: value.source_owner,
    recorded_at: value.recorded_at
  };
}

function requesterProjection(value) {
  const fields = ["requester_id", "requester_type", "evidence_ref"];
  if (value === undefined || value === null) {
    return absentProjection("MISSING", fields, "governance-approval-engine");
  }
  if (!isObject(value)) return absentProjection("INVALID", fields, "governance-approval-engine");
  const valid = Object.keys(value).sort().join(",")
      === ["requester_id", "requester_type", "source_owner", "evidence_ref"].sort().join(",")
    && text(value.requester_id, 120) !== null
    && ["human", "service"].includes(value.requester_type)
    && value.source_owner === "governance-approval-engine"
    && text(value.evidence_ref) !== null;
  if (!valid) return absentProjection("INVALID", fields, "governance-approval-engine");
  return {
    state: "PRESENT",
    requester_id: value.requester_id,
    requester_type: value.requester_type,
    source_owner: value.source_owner,
    evidence_ref: value.evidence_ref
  };
}

function approverProjection(value) {
  const fields = ["approver_id", "decided_at", "evidence_ref"];
  if (value === undefined || value === null) {
    return absentProjection("MISSING", fields, "governance-approval-engine");
  }
  if (!isObject(value)) return absentProjection("INVALID", fields, "governance-approval-engine");
  const valid = Object.keys(value).sort().join(",")
      === ["approver_id", "decided_at", "source_owner", "evidence_ref"].sort().join(",")
    && text(value.approver_id, 120) !== null
    && validTimestamp(value.decided_at)
    && value.source_owner === "governance-approval-engine"
    && text(value.evidence_ref) !== null;
  if (!valid) return absentProjection("INVALID", fields, "governance-approval-engine");
  return {
    state: "PRESENT",
    approver_id: value.approver_id,
    decided_at: value.decided_at,
    source_owner: value.source_owner,
    evidence_ref: value.evidence_ref
  };
}

function assessWorkspaceCreationApproval(evidence = {}) {
  const source = candidate(evidence);
  const artifact = {
    schema_version: WORKSPACE_CREATION_APPROVAL_SCHEMA_VERSION,
    kind: "read_only_workspace_creation_approval_artifact",
    approval_state: "BLOCKED",
    workspace_name: text(source.workspace_name),
    action: text(source.action, 80),
    decision: text(source.decision, 40),
    owner: text(source.owner, 120),
    evidence_reference: evidenceReferenceProjection(source.evidence_reference),
    requester: requesterProjection(source.requester),
    approver: approverProjection(source.approver),
    blocking_reasons: [],
    safety: {
      read_only: true,
      workspace_created: false,
      workspace_id_created: false,
      workspace_storage_written: false,
      project_mutated: false,
      hairoticmen_mutated: false,
      data_migrated: false,
      unrelated_writes: false
    },
    authority: AUTHORITY
  };
  if (artifact.workspace_name !== TARGET_WORKSPACE_NAME) artifact.blocking_reasons.push("WORKSPACE_SCOPE_INVALID");
  if (artifact.action !== TARGET_ACTION) artifact.blocking_reasons.push("ACTION_INVALID");
  if (artifact.decision !== "APPROVED") artifact.blocking_reasons.push("APPROVAL_MISSING_OR_INVALID");
  if (artifact.owner !== TARGET_OWNER) artifact.blocking_reasons.push("OWNER_INVALID");
  if (artifact.evidence_reference.state !== "PRESENT") artifact.blocking_reasons.push("EVIDENCE_REFERENCE_INVALID");
  if (artifact.requester.state !== "PRESENT") artifact.blocking_reasons.push("REQUESTER_INVALID");
  if (artifact.approver.state !== "PRESENT") artifact.blocking_reasons.push("APPROVER_INVALID");
  if (artifact.blocking_reasons.length === 0
    && (artifact.approver.decided_at !== artifact.evidence_reference.recorded_at
      || artifact.approver.evidence_ref !== artifact.evidence_reference.reference_id)) {
    artifact.blocking_reasons.push("APPROVER_INVALID");
  }
  artifact.approval_state = artifact.blocking_reasons.length === 0 ? "APPROVED" : "BLOCKED";
  return validateWorkspaceCreationApprovalArtifact(artifact);
}

module.exports = Object.freeze({ assessWorkspaceCreationApproval });

"use strict";

const {
  markAuthoritativeProjection
} = require("./workspace-approval-authority-provenance");

const TARGET = Object.freeze({
  workspace_name: "MH Trading",
  action: "CREATE_WORKSPACE",
  owner: "MH Trading Owner",
  entity_type: "workspace",
  approval_type: "workspace_creation"
});
const DECISIONS = new Set([
  "pending", "approved", "rejected", "changes_requested", "escalated", "overridden", "cancelled"
]);
const QUERY_FIELDS = Object.freeze([
  "authority_partition", "approval_id", "requester_id", "approver_id"
]);

class WorkspaceCreationApprovalProjectionError extends Error {
  constructor(message, code = "WORKSPACE_APPROVAL_PROJECTION_INVALID") {
    super(message);
    this.name = "WorkspaceCreationApprovalProjectionError";
    this.code = code;
  }
}

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.freeze(value);
  Object.values(value).forEach(deepFreeze);
  return value;
}

function fail(message, code) {
  throw new WorkspaceCreationApprovalProjectionError(message, code);
}

function text(value, label, maximum = 200) {
  if (typeof value !== "string" || value.length < 1 || value.length > maximum || value.trim() !== value) {
    fail(`${label} must be a bounded trimmed string`);
  }
  return value;
}

function timestamp(value, label) {
  if (typeof value !== "string"
    || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)
    || Number.isNaN(Date.parse(value))) {
    fail(`${label} must be a UTC ISO-8601 timestamp`);
  }
  return value;
}

function validateQuery(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail("Projection query must be an object");
  const actual = Object.keys(value).sort();
  const expected = [...QUERY_FIELDS].sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) fail("Projection query fields are invalid");
  const authorityPartition = text(value.authority_partition, "authority_partition", 80).toLowerCase();
  if (!/^[a-z0-9_-]+$/.test(authorityPartition)) fail("authority_partition is invalid");
  return deepFreeze({
    authority_partition: authorityPartition,
    approval_id: text(value.approval_id, "approval_id", 160),
    requester_id: text(value.requester_id, "requester_id", 120),
    approver_id: text(value.approver_id, "approver_id", 120)
  });
}

function missingProjection() {
  return markAuthoritativeProjection(deepFreeze({
    workspace_name: null,
    action: null,
    decision: null,
    owner: null,
    evidence_reference: null,
    requester: null,
    approver: null
  }));
}

function validateRecord(record, query) {
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    fail("Authoritative approval reader returned a malformed record");
  }
  if (record.id !== query.approval_id || record.project !== query.authority_partition) {
    fail("Approval identity or durable storage partition is invalid");
  }
  if (record.entity_type !== TARGET.entity_type || record.entity_id !== TARGET.workspace_name) {
    fail("Approval is not scoped to the exact Workspace");
  }
  if (record.approval_type !== TARGET.approval_type || record.mutation_type !== TARGET.approval_type
    || record.requested_action !== TARGET.action) {
    fail("Approval action or type is invalid");
  }
  if (!DECISIONS.has(record.status)) fail("Approval status is invalid");
  if (record.requested_for !== TARGET.owner || record.reviewer !== TARGET.owner) {
    fail("Approval owner is invalid");
  }
  if (record.requested_by !== query.requester_id) fail("Approval requester does not match");
  if (record.status === "approved") {
    if (record.decided_by !== query.approver_id) fail("Approval approver does not match");
    timestamp(record.decision_at, "approval.decision_at");
    timestamp(record.decided_at, "approval.decided_at");
    if (record.decision_at !== record.decided_at) fail("Approval decision timestamps do not match");
  }
}

async function projectWorkspaceCreationApproval(queryInput, options = {}) {
  const query = validateQuery(queryInput);
  if (typeof options.approvalReader !== "function") {
    fail("An authoritative approval reader is required", "WORKSPACE_APPROVAL_READER_REQUIRED");
  }
  const record = await options.approvalReader(deepFreeze({
    authority_partition: query.authority_partition,
    approval_id: query.approval_id
  }));
  if (record == null) return missingProjection();
  validateRecord(record, query);
  const decidedAt = record.status === "approved" ? record.decision_at : null;
  const projection = {
    workspace_name: TARGET.workspace_name,
    action: TARGET.action,
    decision: String(record.status).toUpperCase(),
    owner: TARGET.owner,
    evidence_reference: decidedAt ? {
      reference_type: "governance_approval",
      reference_id: record.id,
      source_owner: "governance-approval-engine",
      recorded_at: decidedAt
    } : null,
    requester: {
      requester_id: record.requested_by,
      requester_type: "human",
      source_owner: "governance-approval-engine",
      evidence_ref: record.id
    },
    approver: decidedAt ? {
      approver_id: record.decided_by,
      decided_at: decidedAt,
      source_owner: "governance-approval-engine",
      evidence_ref: record.id
    } : null
  };
  return markAuthoritativeProjection(deepFreeze(projection));
}

module.exports = Object.freeze({
  TARGET,
  WorkspaceCreationApprovalProjectionError,
  projectWorkspaceCreationApproval
});

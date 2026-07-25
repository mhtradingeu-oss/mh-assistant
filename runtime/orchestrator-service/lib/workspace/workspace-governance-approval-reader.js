"use strict";

const {
  listApprovals
} = require("../ops/backbone");
const {
  GOVERNANCE_AUTHORITY_PARTITION
} = require("../security/governance-authority-partition");

class WorkspaceGovernanceApprovalReaderError extends Error {
  constructor(message, code, statusCode = 409) {
    super(message);
    this.name = "WorkspaceGovernanceApprovalReaderError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

function fail(message, code, statusCode) {
  throw new WorkspaceGovernanceApprovalReaderError(message, code, statusCode);
}

function approvalId(value) {
  if (typeof value !== "string" || value.trim() !== value || value.length < 1 || value.length > 160
    || !/^approval[_-][A-Za-z0-9][A-Za-z0-9:_-]{2,151}$/.test(value)) {
    fail("approval_id is invalid", "GOVERNANCE_APPROVAL_ID_INVALID", 400);
  }
  return value;
}

function durableCopy(value, seen = new Set()) {
  if (value === null || typeof value === "string" || typeof value === "boolean") return value;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (!value || typeof value !== "object" || seen.has(value)) {
    fail("Approval Engine returned malformed durable output", "GOVERNANCE_APPROVAL_OUTPUT_MALFORMED");
  }
  seen.add(value);
  let copy;
  if (Array.isArray(value)) {
    copy = value.map((item) => durableCopy(item, seen));
  } else {
    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) {
      fail("Approval Engine returned malformed durable output", "GOVERNANCE_APPROVAL_OUTPUT_MALFORMED");
    }
    copy = {};
    for (const [key, item] of Object.entries(value)) {
      if (typeof item === "undefined" || typeof item === "function" || typeof item === "symbol") {
        fail("Approval Engine returned malformed durable output", "GOVERNANCE_APPROVAL_OUTPUT_MALFORMED");
      }
      copy[key] = durableCopy(item, seen);
    }
  }
  seen.delete(value);
  return copy;
}

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.freeze(value);
  Object.values(value).forEach(deepFreeze);
  return value;
}

function createWorkspaceGovernanceApprovalReader(options = {}) {
  const authoritativeList = options.listApprovals || listApprovals;
  if (typeof authoritativeList !== "function") {
    throw new TypeError("Authoritative listApprovals capability is required");
  }

  return function readWorkspaceGovernanceApproval(requestedApprovalId) {
    const targetId = approvalId(requestedApprovalId);
    const output = authoritativeList(GOVERNANCE_AUTHORITY_PARTITION, { limit: 1000 });
    if (!Array.isArray(output)) {
      fail("Approval Engine returned malformed durable output", "GOVERNANCE_APPROVAL_OUTPUT_MALFORMED");
    }
    const matches = output.filter((record) => record && typeof record === "object" && record.id === targetId);
    if (matches.length === 0) {
      fail("Governance approval was not found", "GOVERNANCE_APPROVAL_NOT_FOUND", 404);
    }
    if (matches.length !== 1) {
      fail("Governance approval identity is duplicated", "GOVERNANCE_APPROVAL_ID_DUPLICATE");
    }
    const record = durableCopy(matches[0]);
    if (record.id !== targetId || record.project !== GOVERNANCE_AUTHORITY_PARTITION) {
      fail("Governance approval durable identity is malformed", "GOVERNANCE_APPROVAL_OUTPUT_MALFORMED");
    }
    return deepFreeze(record);
  };
}

const readWorkspaceGovernanceApproval = createWorkspaceGovernanceApprovalReader();

module.exports = Object.freeze({
  WorkspaceGovernanceApprovalReaderError,
  createWorkspaceGovernanceApprovalReader,
  readWorkspaceGovernanceApproval
});

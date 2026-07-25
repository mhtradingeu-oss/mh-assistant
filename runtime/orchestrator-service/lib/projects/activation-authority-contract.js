"use strict";

const { normalizeProjectSlug } = require("../security/project-isolation");
const {
  validateProductionActivationWorkflow
} = require("./production-activation-workflow-contract");

const ACTIVATION_AUTHORITY_SCHEMA_VERSION = 1;
const AUTHORITY_STATES = Object.freeze([
  "BLOCKED_ACTIVATION",
  "MISSING_REQUESTER",
  "MISSING_APPROVAL_OWNER",
  "MISSING_EXECUTION_OWNER",
  "FULLY_SPECIFIED_READY_ACTIVATION"
]);

class ActivationAuthorityContractError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "ActivationAuthorityContractError";
    this.code = "ACTIVATION_AUTHORITY_CONTRACT_INVALID";
    this.details = Object.freeze(copy(details));
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
  throw new ActivationAuthorityContractError(message, details);
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function assertExactFields(value, fields, label) {
  if (!isObject(value)) fail(`${label} must be an object`);
  const actual = Object.keys(value).sort();
  const expected = [...fields].sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(`${label} fields do not match the activation authority contract`, { actual, expected });
  }
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.length > 0;
}

function isSortedUniqueStrings(values) {
  return Array.isArray(values)
    && values.every(isNonEmptyString)
    && JSON.stringify(values) === JSON.stringify([...new Set(values)].sort());
}

function validateRequester(value, blocked) {
  assertExactFields(value, ["state", "requester_id", "requester_type", "source_owner", "evidence_ref"], "requester");
  if (!['PRESENT', 'MISSING'].includes(value.state)) fail("requester state is invalid");
  const present = value.state === "PRESENT";
  if (present !== [value.requester_id, value.requester_type, value.evidence_ref].every(isNonEmptyString)
    || value.source_owner !== "backend-request-context") {
    fail("requester evidence is invalid");
  }
  if (!present && [value.requester_id, value.requester_type, value.evidence_ref].some((item) => item !== null)) {
    fail("missing requester must not contain invented identity evidence");
  }
  if (blocked && value.state !== "PRESENT" && value.state !== "MISSING") fail("blocked requester is invalid");
}

function validateOwner(value, label, expectedSource, allowedOwner, applicable) {
  assertExactFields(value, ["state", "owner", "source_owner", "evidence_ref"], label);
  const expectedStates = applicable ? ["ASSIGNED", "MISSING"] : ["NOT_APPLICABLE"];
  if (!expectedStates.includes(value.state) || value.source_owner !== expectedSource) {
    fail(`${label} state or source owner is invalid`);
  }
  if (value.state === "ASSIGNED") {
    if (!isNonEmptyString(value.owner) || !isNonEmptyString(value.evidence_ref)) {
      fail(`${label} assignment requires owner evidence`);
    }
    if (allowedOwner && value.owner !== allowedOwner) fail(`${label} cannot replace its existing runtime owner`);
  } else if (value.owner !== null || value.evidence_ref !== null) {
    fail(`${label} without an assignment must not invent owner evidence`);
  }
}

function validateAuthorityDeclaration(value) {
  assertExactFields(value, [
    "request_context_owner", "authorization_decision_owner", "approval_owner_source",
    "execution_owner_source", "project_id_owner", "workspace_project_owner",
    "creates_approval", "executes_activation", "mutates_roles", "mutates_permissions",
    "mutates_workspace", "mutates_project", "mutates_data", "mutates_filesystem",
    "backend_authoritative", "frontend_projection_only"
  ], "authority");
  const expected = {
    request_context_owner: "backend-request-context",
    authorization_decision_owner: "production-activation-workflow",
    approval_owner_source: "operations-backbone",
    execution_owner_source: "workspace-runtime",
    project_id_owner: "project-identity",
    workspace_project_owner: "workspace-relationship-runtime",
    creates_approval: false,
    executes_activation: false,
    mutates_roles: false,
    mutates_permissions: false,
    mutates_workspace: false,
    mutates_project: false,
    mutates_data: false,
    mutates_filesystem: false,
    backend_authoritative: true,
    frontend_projection_only: true
  };
  if (Object.entries(expected).some(([field, expectedValue]) => value[field] !== expectedValue)) {
    fail("authority declaration is invalid");
  }
}

function validateActivationAuthorityModel(value) {
  assertExactFields(value, [
    "schema_version", "kind", "authority_state", "project_slug", "requester",
    "authorization", "approval_owner", "execution_owner", "audit_evidence",
    "source_evidence", "safety", "authority"
  ], "activation authority model");
  if (value.schema_version !== ACTIVATION_AUTHORITY_SCHEMA_VERSION) fail("schema_version is unsupported");
  if (value.kind !== "read_only_activation_authority_model") fail("kind is invalid");
  if (!AUTHORITY_STATES.includes(value.authority_state)) fail("authority_state is invalid");

  let projectSlug;
  try { projectSlug = normalizeProjectSlug(value.project_slug); } catch { fail("project_slug is invalid"); }
  if (projectSlug !== value.project_slug) fail("project_slug is not canonical");

  assertExactFields(value.source_evidence, ["source_owner", "workflow"], "source_evidence");
  let workflow;
  try { workflow = validateProductionActivationWorkflow(value.source_evidence.workflow); } catch (error) {
    fail("Phase G workflow evidence is invalid", { cause: error.code || null });
  }
  if (value.source_evidence.source_owner !== "production-activation-workflow"
    || workflow.activation_request.project_slug !== projectSlug) {
    fail("Phase G evidence is not scoped to the requested Project");
  }

  const blocked = !workflow.readiness.ready;
  validateRequester(value.requester, blocked);

  assertExactFields(value.authorization, [
    "state", "authorized", "decision_owner", "source_owner", "reason", "evidence_ref"
  ], "authorization");
  if (value.authorization.state !== workflow.authorization.state
    || value.authorization.authorized !== workflow.authorization.authorized
    || value.authorization.decision_owner !== "production-activation-workflow"
    || value.authorization.source_owner !== workflow.authorization.source_owner
    || value.authorization.reason !== workflow.authorization.reason
    || value.authorization.evidence_ref !== `phase-g:${projectSlug}`) {
    fail("authorization must project the Phase G decision without override");
  }

  validateOwner(value.approval_owner, "approval_owner", "operations-backbone", "operations-backbone", !blocked);
  validateOwner(value.execution_owner, "execution_owner", "workspace-runtime", "workspace-runtime", !blocked);

  let expectedState = "BLOCKED_ACTIVATION";
  if (!blocked) {
    if (value.requester.state === "MISSING") expectedState = "MISSING_REQUESTER";
    else if (value.approval_owner.state === "MISSING") expectedState = "MISSING_APPROVAL_OWNER";
    else if (value.execution_owner.state === "MISSING") expectedState = "MISSING_EXECUTION_OWNER";
    else expectedState = "FULLY_SPECIFIED_READY_ACTIVATION";
  }
  if (value.authority_state !== expectedState) fail("authority_state contradicts its evidence");

  assertExactFields(value.audit_evidence, ["complete", "references", "source_owner"], "audit_evidence");
  const expectedReferences = [
    `phase-g:${projectSlug}`,
    value.requester.evidence_ref,
    value.approval_owner.evidence_ref,
    value.execution_owner.evidence_ref
  ].filter(Boolean).sort();
  const expectedComplete = expectedState === "FULLY_SPECIFIED_READY_ACTIVATION";
  if (value.audit_evidence.complete !== expectedComplete
    || !isSortedUniqueStrings(value.audit_evidence.references)
    || JSON.stringify(value.audit_evidence.references) !== JSON.stringify([...new Set(expectedReferences)])
    || value.audit_evidence.source_owner !== "activation-authority-model") {
    fail("audit evidence is invalid or incomplete");
  }

  assertExactFields(value.safety, [
    "ownership_complete", "authorized", "handoff_ready", "activation_executable",
    "activation_executed", "reason"
  ], "safety");
  const ownershipComplete = expectedState === "FULLY_SPECIFIED_READY_ACTIVATION";
  const handoffReady = ownershipComplete && workflow.authorization.authorized;
  if (value.safety.ownership_complete !== ownershipComplete
    || value.safety.authorized !== workflow.authorization.authorized
    || value.safety.handoff_ready !== handoffReady
    || value.safety.activation_executable !== false
    || value.safety.activation_executed !== false
    || value.safety.reason !== (handoffReady
      ? "READ_ONLY_MODEL_REQUIRES_EXISTING_EXECUTION_OWNER_HANDOFF"
      : "ACTIVATION_AUTHORITY_CHAIN_NOT_AUTHORIZED")) {
    fail("safety declaration is invalid");
  }

  validateAuthorityDeclaration(value.authority);
  return deepFreeze(copy(value));
}

module.exports = Object.freeze({
  ACTIVATION_AUTHORITY_SCHEMA_VERSION,
  AUTHORITY_STATES,
  ActivationAuthorityContractError,
  validateActivationAuthorityModel
});

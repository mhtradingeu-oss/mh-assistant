/**
 * MH-OS Authority Projection Helper
 *
 * IMPORTANT:
 * This file is projection-only.
 *
 * Backend owns operational authority.
 * Frontend projects operational authority.
 *
 * This helper MUST NEVER:
 * - enforce permissions
 * - mutate governance
 * - become source of truth
 * - generate authority
 * - own approvals
 * - own workflows
 */

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function safeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function readOperationsProjection(state = {}) {
  return safeObject(state.operations);
}

export function getProjectedTeamServiceModel(state = {}) {
  const operations = readOperationsProjection(state);
  return safeObject(operations.team_service_model);
}

export function getProjectedGovernance(state = {}) {
  const operations = readOperationsProjection(state);
  return safeObject(operations.governance);
}

export function getProjectedApprovals(state = {}) {
  const operations = readOperationsProjection(state);
  return safeObject(operations.approvals);
}

export function getProjectedWorkflowRuns(state = {}) {
  const operations = readOperationsProjection(state);
  return safeObject(operations.workflow_runs);
}

export function getProjectedHandoffs(state = {}) {
  const operations = readOperationsProjection(state);
  return safeObject(operations.handoffs);
}

export function getProjectedAiRecommendations(state = {}) {
  const operations = readOperationsProjection(state);
  return safeObject(operations.ai_recommendations);
}

export function getProjectedAiMemory(state = {}) {
  const operations = readOperationsProjection(state);
  return safeObject(operations.ai_memory);
}

export function getProjectedRoutePermissions(state = {}) {
  const model = getProjectedTeamServiceModel(state);
  return safeArray(model.route_permissions);
}

export function getProjectedTeamMembers(state = {}) {
  const model = getProjectedTeamServiceModel(state);
  return safeArray(model.members);
}

export function getProjectedServiceDomains(state = {}) {
  const model = getProjectedTeamServiceModel(state);
  return safeArray(model.domains);
}

export function getProjectedActiveRole(state = {}) {
  const model = getProjectedTeamServiceModel(state);

  return (
    model.active_role ||
    state.activeRole ||
    "admin"
  );
}

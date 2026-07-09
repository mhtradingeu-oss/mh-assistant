'use strict';

/**
 * M2-J2 protected route authority helper.
 *
 * Purpose:
 * - Provide a small backend route-level guard for high-risk protected mutations.
 * - Never mutate data.
 * - Never call providers.
 * - Never publish, send, launch ads, sync providers, or approve.
 * - Only decide whether a protected route may proceed.
 */

const PROTECTED_ROUTE_AUTHORITY_LEVELS = Object.freeze({
  APPROVAL_REQUIRED: 'approval_required',
  MANUAL_EXECUTION_ONLY: 'manual_execution_only',
  OWNER_WORKSPACE_REQUIRED: 'owner_workspace_required',
  FORBIDDEN_FROM_AI_COMMAND: 'forbidden_from_ai_command',
  REVIEW_OUTPUT_ONLY: 'review_output_only'
});

const PROTECTED_ROUTE_ERROR_CODES = Object.freeze({
  APPROVAL_REQUIRED: 'PROTECTED_ROUTE_APPROVAL_REQUIRED',
  MANUAL_EXECUTION_REQUIRED: 'PROTECTED_ROUTE_MANUAL_EXECUTION_REQUIRED',
  OWNER_WORKSPACE_REQUIRED: 'PROTECTED_ROUTE_OWNER_WORKSPACE_REQUIRED',
  FORBIDDEN_ACTION: 'PROTECTED_ROUTE_FORBIDDEN_ACTION',
  PUBLIC_MIRROR_BLOCKED: 'PROTECTED_ROUTE_PUBLIC_MIRROR_BLOCKED',
  PROVIDER_EXECUTION_REVIEW_REQUIRED: 'PROTECTED_ROUTE_PROVIDER_EXECUTION_REVIEW_REQUIRED',
  DESTRUCTIVE_ACTION_BLOCKED: 'PROTECTED_ROUTE_DESTRUCTIVE_ACTION_BLOCKED'
});

const FORBIDDEN_ACTIONS = new Set([
  'publish',
  'send_customer_reply',
  'send_email',
  'approve',
  'reject_approval',
  'launch_ads',
  'change_budget',
  'mutate_crm',
  'change_ticket_status',
  'assign_conversation',
  'run_provider_execution',
  'run_backend_job',
  'override_governance',
  'sync_provider',
  'delete_record'
]);

function normalizeHeaderValue(value) {
  if (Array.isArray(value)) return String(value[0] || '').trim();
  return String(value || '').trim();
}

function readProof(req) {
  const headers = req && req.headers ? req.headers : {};
  const body = req && req.body && typeof req.body === 'object' ? req.body : {};
  const query = req && req.query && typeof req.query === 'object' ? req.query : {};

  const approvalId =
    normalizeHeaderValue(headers['x-mh-approval-id']) ||
    normalizeHeaderValue(body.approval_id || body.approvalId) ||
    normalizeHeaderValue(query.approval_id || query.approvalId);

  const manualExecution =
    normalizeHeaderValue(headers['x-mh-manual-execution']) ||
    normalizeHeaderValue(body.manual_execution || body.manualExecution) ||
    normalizeHeaderValue(query.manual_execution || query.manualExecution);

  const ownerWorkspace =
    normalizeHeaderValue(headers['x-mh-owner-workspace']) ||
    normalizeHeaderValue(body.owner_workspace || body.ownerWorkspace) ||
    normalizeHeaderValue(query.owner_workspace || query.ownerWorkspace);

  const reviewOutput =
    normalizeHeaderValue(headers['x-mh-review-output']) ||
    normalizeHeaderValue(body.review_output || body.reviewOutput) ||
    normalizeHeaderValue(query.review_output || query.reviewOutput);

  return {
    approvalId,
    hasApproval: Boolean(approvalId),
    hasManualExecution: /^(1|true|yes|approved|manual)$/i.test(manualExecution),
    hasOwnerWorkspace: /^(1|true|yes|owner|workspace)$/i.test(ownerWorkspace),
    hasReviewOutput: /^(1|true|yes|review|draft)$/i.test(reviewOutput)
  };
}

function createDecision(allowed, status, code, message, routeAuthority, proof) {
  return {
    allowed,
    status,
    code,
    message,
    route_id: routeAuthority.routeId || 'unknown',
    authority: routeAuthority.authority || '',
    category: routeAuthority.category || '',
    forbidden_action: routeAuthority.forbiddenAction || '',
    proof: {
      has_approval: Boolean(proof && proof.hasApproval),
      has_manual_execution: Boolean(proof && proof.hasManualExecution),
      has_owner_workspace: Boolean(proof && proof.hasOwnerWorkspace),
      has_review_output: Boolean(proof && proof.hasReviewOutput)
    }
  };
}

function isPublicMirror(req) {
  return Boolean(req && req.path && String(req.path).startsWith('/public/'));
}

function isProtectedRouteAllowed(req, routeAuthority = {}) {
  const proof = readProof(req);
  const authority = routeAuthority.authority || PROTECTED_ROUTE_AUTHORITY_LEVELS.MANUAL_EXECUTION_ONLY;
  const forbiddenAction = routeAuthority.forbiddenAction || '';
  const publicMirror = isPublicMirror(req);

  if (publicMirror && routeAuthority.allowPublicMirror !== true && !proof.hasApproval && !proof.hasManualExecution && !proof.hasOwnerWorkspace) {
    return createDecision(
      false,
      403,
      PROTECTED_ROUTE_ERROR_CODES.PUBLIC_MIRROR_BLOCKED,
      'This public protected route requires explicit approval or manual owner proof.',
      routeAuthority,
      proof
    );
  }

  if (authority === PROTECTED_ROUTE_AUTHORITY_LEVELS.REVIEW_OUTPUT_ONLY) {
    if (routeAuthority.allowReviewOutput === true || proof.hasReviewOutput || proof.hasApproval || proof.hasManualExecution) {
      return createDecision(true, 200, 'PROTECTED_ROUTE_ALLOWED_REVIEW_OUTPUT', 'Review-output route allowed.', routeAuthority, proof);
    }
    return createDecision(
      false,
      409,
      PROTECTED_ROUTE_ERROR_CODES.PROVIDER_EXECUTION_REVIEW_REQUIRED,
      'This provider/review route requires review-output proof.',
      routeAuthority,
      proof
    );
  }

  if (forbiddenAction && FORBIDDEN_ACTIONS.has(forbiddenAction) && !proof.hasApproval && !proof.hasManualExecution && !proof.hasOwnerWorkspace) {
    const isDestructive = forbiddenAction === 'delete_record';
    return createDecision(
      false,
      isDestructive ? 403 : 409,
      isDestructive ? PROTECTED_ROUTE_ERROR_CODES.DESTRUCTIVE_ACTION_BLOCKED : PROTECTED_ROUTE_ERROR_CODES.FORBIDDEN_ACTION,
      'This protected backend action requires approval or manual owner execution proof.',
      routeAuthority,
      proof
    );
  }

  if (authority === PROTECTED_ROUTE_AUTHORITY_LEVELS.APPROVAL_REQUIRED && !proof.hasApproval && !proof.hasManualExecution) {
    return createDecision(
      false,
      409,
      PROTECTED_ROUTE_ERROR_CODES.APPROVAL_REQUIRED,
      'This protected backend route requires approval proof.',
      routeAuthority,
      proof
    );
  }

  if (authority === PROTECTED_ROUTE_AUTHORITY_LEVELS.OWNER_WORKSPACE_REQUIRED && !proof.hasOwnerWorkspace && !proof.hasApproval) {
    return createDecision(
      false,
      409,
      PROTECTED_ROUTE_ERROR_CODES.OWNER_WORKSPACE_REQUIRED,
      'This protected backend route requires owner workspace proof.',
      routeAuthority,
      proof
    );
  }

  if (authority === PROTECTED_ROUTE_AUTHORITY_LEVELS.MANUAL_EXECUTION_ONLY && !proof.hasManualExecution && !proof.hasApproval && !proof.hasOwnerWorkspace) {
    return createDecision(
      false,
      409,
      PROTECTED_ROUTE_ERROR_CODES.MANUAL_EXECUTION_REQUIRED,
      'This protected backend route requires manual owner execution context.',
      routeAuthority,
      proof
    );
  }

  if (authority === PROTECTED_ROUTE_AUTHORITY_LEVELS.FORBIDDEN_FROM_AI_COMMAND && !proof.hasApproval && !proof.hasManualExecution) {
    return createDecision(
      false,
      403,
      PROTECTED_ROUTE_ERROR_CODES.FORBIDDEN_ACTION,
      'This protected backend route is forbidden without explicit approval/manual proof.',
      routeAuthority,
      proof
    );
  }

  return createDecision(true, 200, 'PROTECTED_ROUTE_ALLOWED', 'Protected route allowed.', routeAuthority, proof);
}

function enforceProtectedRouteAuthority(req, res, routeAuthority = {}) {
  const decision = isProtectedRouteAllowed(req, routeAuthority);

  if (decision.allowed) {
    if (req) {
      req.protectedRouteAuthority = decision;
    }
    return true;
  }

  if (res && typeof res.status === 'function' && typeof res.json === 'function') {
    res.status(decision.status || 409).json({
      ok: false,
      error: decision.code,
      message: decision.message,
      route_id: decision.route_id,
      authority: decision.authority,
      category: decision.category,
      forbidden_action: decision.forbidden_action,
      proof: decision.proof
    });
  }

  return false;
}

function createProtectedRouteMiddleware(routeAuthority = {}) {
  return function protectedRouteAuthorityMiddleware(req, res, next) {
    if (enforceProtectedRouteAuthority(req, res, routeAuthority)) {
      return next();
    }
    return undefined;
  };
}

module.exports = {
  PROTECTED_ROUTE_AUTHORITY_LEVELS,
  PROTECTED_ROUTE_ERROR_CODES,
  FORBIDDEN_ACTIONS,
  readProof,
  isProtectedRouteAllowed,
  enforceProtectedRouteAuthority,
  createProtectedRouteMiddleware
};

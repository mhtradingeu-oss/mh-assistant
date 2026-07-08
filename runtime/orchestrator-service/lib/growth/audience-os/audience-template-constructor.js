"use strict";

/**
 * Audience Template Constructor MVP
 *
 * Backend-only, read-only, non-executing constructor for Audience OS.
 *
 * This module consumes the Audience Template Registry and returns draft-only
 * audience blueprint objects for manual review and future governed workflows.
 *
 * It must not:
 * - write project data
 * - call provider APIs
 * - create audiences inside external platforms
 * - launch campaigns
 * - mutate budgets
 * - mutate approvals
 */

const {
  getAudienceTemplateById,
  listAudienceTemplates,
  REGISTRY_VERSION
} = require("./audience-template-registry.js");

const CONSTRUCTOR_VERSION = "audience-template-constructor-v1";

const CONSTRUCTOR_POLICY = Object.freeze({
  version: CONSTRUCTOR_VERSION,
  registry_version: REGISTRY_VERSION,
  manual_first: true,
  draft_only: true,
  read_only: true,
  external_platform_write_allowed: false,
  campaign_launch_allowed: false,
  budget_mutation_allowed: false,
  project_data_write_allowed: false,
  provider_execution_allowed: false,
  approval_mutation_allowed: false,
  requires_human_review: true,
  allowed_output: "draft_audience_blueprint",
  authority: "registry_derived_manual_planning"
});

function asString(value, fallback = "") {
  if (value == null) return fallback;
  const normalized = String(value).trim();
  return normalized || fallback;
}

function asArray(value) {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => item != null);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function uniqueStrings(values) {
  return Array.from(new Set(asArray(values).map((value) => asString(value)).filter(Boolean)));
}

function normalizeInput(input = {}) {
  const source = input && typeof input === "object" ? input : {};

  const templateIds = uniqueStrings(
    source.template_ids || source.templateIds || source.ids || (source.template_id ? [source.template_id] : [])
  );

  return {
    project: asString(source.project || source.project_name || source.projectName),
    campaign: asString(source.campaign || source.campaign_name || source.campaignName),
    channel: asString(source.channel || source.platform || source.platform_family),
    requested_by: asString(source.requested_by || source.requestedBy || "ai_team"),
    template_id: asString(source.template_id || source.templateId),
    template_ids: templateIds,
    include_all_templates: source.include_all_templates === true || source.includeAllTemplates === true,
    context: source.context && typeof source.context === "object" ? clone(source.context) : {}
  };
}

function validateAudienceConstructorInput(input = {}) {
  const normalized = normalizeInput(input);
  const errors = [];
  const warnings = [];

  if (!normalized.template_id && !normalized.template_ids.length && !normalized.include_all_templates) {
    errors.push({
      code: "missing_template_selection",
      message: "Provide template_id, template_ids, or include_all_templates."
    });
  }

  const idsToCheck = normalized.include_all_templates
    ? listAudienceTemplates().map((template) => template.id)
    : uniqueStrings([normalized.template_id, ...normalized.template_ids]);

  for (const templateId of idsToCheck) {
    if (!getAudienceTemplateById(templateId)) {
      errors.push({
        code: "unknown_template_id",
        template_id: templateId,
        message: `Audience template was not found: ${templateId}`
      });
    }
  }

  if (!normalized.project) {
    warnings.push({
      code: "missing_project_context",
      message: "Project context is recommended for downstream review, but not required for draft construction."
    });
  }

  if (!normalized.campaign) {
    warnings.push({
      code: "missing_campaign_context",
      message: "Campaign context is recommended for downstream review, but not required for draft construction."
    });
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    normalized_input: normalized,
    policy: getAudienceConstructorPolicy()
  };
}

function buildReadiness(template, normalizedInput) {
  const requiredTrackingEvents = uniqueStrings(template.required_tracking_events);
  const optionalTrackingEvents = uniqueStrings(template.optional_tracking_events);
  const readinessRules = asArray(template.readiness_rules).map((rule) => clone(rule));

  return {
    status: "draft_requires_review",
    ready_for_platform_sync: false,
    ready_for_campaign_launch: false,
    ready_for_budget_mutation: false,
    ready_for_project_data_write: false,
    project_context_present: Boolean(normalizedInput.project),
    campaign_context_present: Boolean(normalizedInput.campaign),
    required_tracking_events: requiredTrackingEvents,
    optional_tracking_events: optionalTrackingEvents,
    readiness_rules: readinessRules,
    notes: [
      "Draft blueprint only. Human review is required before any future execution.",
      "Tracking and platform setup must be verified manually.",
      "No external platform write is allowed by this constructor."
    ]
  };
}

function buildGovernance(template) {
  const executionPolicy = template.execution_policy || {};

  return {
    approval_required: template.approval_required === true,
    review_required: true,
    reviewer_roles: uniqueStrings(template.review_roles),
    compliance_notes: asArray(template.compliance_notes),
    exclusion_policy: clone(template.exclusion_policy || {}),
    execution_policy: {
      manual_first: true,
      draft_only: true,
      external_platform_write_allowed: false,
      campaign_launch_allowed: false,
      budget_mutation_allowed: false,
      project_data_write_allowed: false,
      provider_execution_allowed: false,
      approval_mutation_allowed: false,
      requires_human_review: true,
      inherited_template_policy: clone(executionPolicy)
    }
  };
}

function buildAiTeam(template, normalizedInput) {
  const reviewRoles = uniqueStrings(template.review_roles);
  const ownerRole = asString(template.recommended_ai_owner_role, "ads_operator");

  return {
    owner_role: ownerRole,
    review_roles: reviewRoles,
    requested_by: normalizedInput.requested_by,
    suggested_handoff_targets: reviewRoles,
    output_type: "draft",
    authority: "guidance_only",
    next_action: "Review audience draft inside Ads Manager before any future platform setup."
  };
}

function buildSource(template, normalizedInput) {
  return {
    constructor_version: CONSTRUCTOR_VERSION,
    registry_version: REGISTRY_VERSION,
    template_id: template.id,
    generated_from: "audience-template-registry",
    project: normalizedInput.project || null,
    campaign: normalizedInput.campaign || null,
    channel: normalizedInput.channel || null,
    created_mode: "in_memory_draft_only"
  };
}

function buildAudienceTemplateDraft(input = {}) {
  const validation = validateAudienceConstructorInput(input);

  if (!validation.ok) {
    return {
      ok: false,
      errors: validation.errors,
      warnings: validation.warnings,
      draft: null,
      policy: validation.policy
    };
  }

  const normalizedInput = validation.normalized_input;
  const templateId = normalizedInput.template_id || normalizedInput.template_ids[0];
  const template = getAudienceTemplateById(templateId);

  if (!template) {
    return {
      ok: false,
      errors: [{
        code: "unknown_template_id",
        template_id: templateId,
        message: `Audience template was not found: ${templateId}`
      }],
      warnings: validation.warnings,
      draft: null,
      policy: validation.policy
    };
  }

  const draft = {
    id: `draft.${template.id}`,
    template_id: template.id,
    label: template.label,
    market: template.market,
    platform_family: template.platform_family,
    business_type: template.business_type,
    funnel_stage: template.funnel_stage,
    intent_level: template.intent_level,
    include_events: clone(template.include_events || []),
    exclude_events: clone(template.exclude_events || []),
    retention_days: template.retention_days,
    readiness: buildReadiness(template, normalizedInput),
    governance: buildGovernance(template),
    ai_team: buildAiTeam(template, normalizedInput),
    manual_setup: {
      notes: asArray(template.manual_setup_notes),
      setup_required: true,
      setup_mode: "manual"
    },
    campaign_usage: clone(template.campaign_usage || {}),
    creative_guidance: clone(template.creative_guidance || {}),
    compliance_notes: asArray(template.compliance_notes),
    execution_policy: {
      manual_first: true,
      draft_only: true,
      external_platform_write_allowed: false,
      campaign_launch_allowed: false,
      budget_mutation_allowed: false,
      project_data_write_allowed: false,
      provider_execution_allowed: false,
      approval_mutation_allowed: false,
      requires_human_review: true
    },
    source: buildSource(template, normalizedInput)
  };

  return {
    ok: true,
    errors: [],
    warnings: validation.warnings,
    draft,
    policy: validation.policy
  };
}

function buildAudienceTemplateDrafts(input = {}) {
  const normalizedInput = normalizeInput(input);
  const ids = normalizedInput.include_all_templates
    ? listAudienceTemplates().map((template) => template.id)
    : uniqueStrings([normalizedInput.template_id, ...normalizedInput.template_ids]);

  const results = ids.map((templateId) => buildAudienceTemplateDraft({
    ...normalizedInput,
    template_id: templateId,
    template_ids: []
  }));

  const errors = results.flatMap((result) => result.errors || []);
  const warnings = results.flatMap((result) => result.warnings || []);
  const drafts = results.map((result) => result.draft).filter(Boolean);

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    drafts,
    count: drafts.length,
    policy: getAudienceConstructorPolicy()
  };
}

function buildAudienceConstructorReadiness(input = {}) {
  const validation = validateAudienceConstructorInput(input);
  const normalizedInput = validation.normalized_input;
  const ids = normalizedInput.include_all_templates
    ? listAudienceTemplates().map((template) => template.id)
    : uniqueStrings([normalizedInput.template_id, ...normalizedInput.template_ids]);

  const templates = ids.map((id) => getAudienceTemplateById(id)).filter(Boolean);

  return {
    ok: validation.ok,
    status: validation.ok ? "ready_for_draft_construction" : "blocked",
    errors: validation.errors,
    warnings: validation.warnings,
    requested_template_count: ids.length,
    available_template_count: templates.length,
    registry_template_count: listAudienceTemplates().length,
    can_create_drafts: validation.ok,
    can_write_project_data: false,
    can_sync_platform: false,
    can_launch_campaign: false,
    can_mutate_budget: false,
    policy: getAudienceConstructorPolicy()
  };
}

function getAudienceConstructorPolicy() {
  return clone(CONSTRUCTOR_POLICY);
}

module.exports = {
  CONSTRUCTOR_VERSION,
  buildAudienceConstructorReadiness,
  buildAudienceTemplateDraft,
  buildAudienceTemplateDrafts,
  getAudienceConstructorPolicy,
  validateAudienceConstructorInput
};

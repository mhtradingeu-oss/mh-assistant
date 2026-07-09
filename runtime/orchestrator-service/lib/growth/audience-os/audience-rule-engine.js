"use strict";

/**
 * Audience Rule Engine MVP
 *
 * Backend-only, read-only, draft-only, non-executing rule engine for Audience OS.
 *
 * This module converts audience draft blueprints into explicit, reviewable
 * rule sets for manual planning and future governed workflows.
 *
 * It must not:
 * - modify project data
 * - call provider APIs
 * - create audiences inside external platforms
 * - launch campaigns
 * - mutate budgets
 * - mutate approvals
 * - schedule jobs
 */

const {
  buildAudienceTemplateDraft,
  buildAudienceTemplateDrafts,
  getAudienceConstructorPolicy
} = require("./audience-template-constructor.js");

const RULE_ENGINE_VERSION = "audience-rule-engine-v1";

const RULE_ENGINE_POLICY = Object.freeze({
  version: RULE_ENGINE_VERSION,
  constructor_policy: getAudienceConstructorPolicy(),
  manual_first: true,
  draft_only: true,
  read_only: true,
  external_platform_write_allowed: false,
  campaign_launch_allowed: false,
  budget_mutation_allowed: false,
  project_data_write_allowed: false,
  provider_execution_allowed: false,
  approval_mutation_allowed: false,
  scheduler_execution_allowed: false,
  requires_human_review: true,
  allowed_output: "draft_audience_rule_set",
  authority: "draft_rule_planning"
});

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function asString(value, fallback = "") {
  if (value == null) return fallback;
  const normalized = String(value).trim();
  return normalized || fallback;
}

function asArray(value) {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => item != null);
}

function uniqueStrings(values) {
  return Array.from(new Set(asArray(values).map((value) => asString(value)).filter(Boolean)));
}

function normalizeContext(context = {}) {
  const source = context && typeof context === "object" ? context : {};

  return {
    project: asString(source.project || source.project_name || source.projectName),
    campaign: asString(source.campaign || source.campaign_name || source.campaignName),
    requested_by: asString(source.requested_by || source.requestedBy || "ai_team"),
    channel: asString(source.channel || source.platform || source.platform_family),
    notes: asArray(source.notes).map((item) => asString(item)).filter(Boolean)
  };
}

function isDraftLike(value) {
  return Boolean(
    value &&
    typeof value === "object" &&
    value.template_id &&
    value.execution_policy &&
    value.source
  );
}

function getAudienceRuleEnginePolicy() {
  return clone(RULE_ENGINE_POLICY);
}

function validateAudienceRuleInput(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const errors = [];
  const warnings = [];

  const hasDraft = isDraftLike(source.draft);
  const hasTemplateSelection = Boolean(
    source.template_id ||
    source.templateId ||
    source.template_ids ||
    source.templateIds ||
    source.ids ||
    source.include_all_templates ||
    source.includeAllTemplates
  );

  if (!hasDraft && !hasTemplateSelection) {
    errors.push({
      code: "missing_rule_input",
      message: "Provide draft, template_id, template_ids, or include_all_templates."
    });
  }

  if (hasDraft && source.draft.execution_policy) {
    const policy = source.draft.execution_policy;

    if (policy.external_platform_write_allowed !== false) {
      errors.push({
        code: "unsafe_draft_platform_write",
        message: "Draft policy must not allow external platform actions."
      });
    }

    if (policy.campaign_launch_allowed !== false) {
      errors.push({
        code: "unsafe_draft_campaign_launch",
        message: "Draft policy must not allow campaign launch."
      });
    }

    if (policy.budget_mutation_allowed !== false) {
      errors.push({
        code: "unsafe_draft_budget_mutation",
        message: "Draft policy must not allow budget mutation."
      });
    }
  }

  if (!source.project && !source.project_name && !source.projectName && !hasDraft) {
    warnings.push({
      code: "missing_project_context",
      message: "Project context is recommended for downstream review."
    });
  }

  if (!source.campaign && !source.campaign_name && !source.campaignName && !hasDraft) {
    warnings.push({
      code: "missing_campaign_context",
      message: "Campaign context is recommended for downstream review."
    });
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    policy: getAudienceRuleEnginePolicy()
  };
}

function buildRuleSource(draft, context) {
  return {
    rule_engine_version: RULE_ENGINE_VERSION,
    constructor_version: draft.source && draft.source.constructor_version,
    registry_version: draft.source && draft.source.registry_version,
    generated_from: "audience-template-constructor",
    template_id: draft.template_id,
    project: context.project || (draft.source && draft.source.project) || null,
    campaign: context.campaign || (draft.source && draft.source.campaign) || null,
    channel: context.channel || draft.platform_family || null,
    created_mode: "in_memory_rule_set_only"
  };
}

function buildIncludeRules(draft) {
  const retentionDays = Number(draft.retention_days) || null;

  return uniqueStrings(draft.include_events).map((eventName) => ({
    id: `include.${draft.template_id}.${eventName}`,
    type: "include_event",
    event: eventName,
    retention_days: retentionDays,
    rule_operator: "any",
    required: true,
    source: "draft.include_events",
    manual_review_required: true
  }));
}

function buildExcludeRules(draft) {
  const retentionDays = Number(draft.retention_days) || null;
  const exclusionPolicy = draft.governance && draft.governance.exclusion_policy
    ? clone(draft.governance.exclusion_policy)
    : {};

  return uniqueStrings(draft.exclude_events).map((eventName) => ({
    id: `exclude.${draft.template_id}.${eventName}`,
    type: "exclude_event",
    event: eventName,
    retention_days: retentionDays,
    rule_operator: "any",
    required: true,
    source: "draft.exclude_events",
    exclusion_policy: exclusionPolicy,
    manual_review_required: true
  }));
}

function buildRetentionRule(draft) {
  return {
    id: `retention.${draft.template_id}`,
    type: "retention_window",
    retention_days: Number(draft.retention_days) || null,
    window_unit: "days",
    source: "draft.retention_days",
    manual_review_required: true
  };
}

function buildFunnelRule(draft) {
  return {
    id: `funnel.${draft.template_id}`,
    type: "funnel_position",
    funnel_stage: asString(draft.funnel_stage, "unknown"),
    intent_level: asString(draft.intent_level, "unknown"),
    market: asString(draft.market, "unknown"),
    platform_family: asString(draft.platform_family, "unknown"),
    business_type: asString(draft.business_type, "unknown"),
    source: "draft.funnel_metadata",
    manual_review_required: true
  };
}

function buildCampaignUsageRules(draft) {
  const campaignUsage = draft.campaign_usage && typeof draft.campaign_usage === "object"
    ? clone(draft.campaign_usage)
    : {};

  return [{
    id: `campaign_usage.${draft.template_id}`,
    type: "campaign_usage_guidance",
    usage: campaignUsage,
    source: "draft.campaign_usage",
    manual_review_required: true
  }];
}

function buildGovernanceRules(draft) {
  const governance = draft.governance && typeof draft.governance === "object"
    ? clone(draft.governance)
    : {};

  return [{
    id: `governance.${draft.template_id}`,
    type: "human_review_gate",
    approval_required: governance.approval_required === true,
    review_required: true,
    reviewer_roles: uniqueStrings(governance.reviewer_roles),
    compliance_notes: asArray(governance.compliance_notes),
    exclusion_policy: governance.exclusion_policy || {},
    execution_policy: governance.execution_policy || {},
    source: "draft.governance",
    manual_review_required: true
  }];
}

function buildAiTeamRules(draft, context) {
  const aiTeam = draft.ai_team && typeof draft.ai_team === "object" ? clone(draft.ai_team) : {};

  return [{
    id: `ai_team.${draft.template_id}`,
    type: "ai_team_review_routing",
    owner_role: asString(aiTeam.owner_role, "ads_operator"),
    review_roles: uniqueStrings(aiTeam.review_roles),
    requested_by: context.requested_by || asString(aiTeam.requested_by, "ai_team"),
    suggested_handoff_targets: uniqueStrings(aiTeam.suggested_handoff_targets),
    authority: "guidance_only",
    output_type: "draft",
    source: "draft.ai_team",
    manual_review_required: true
  }];
}

function buildReadinessRules(draft) {
  const readiness = draft.readiness && typeof draft.readiness === "object"
    ? clone(draft.readiness)
    : {};

  return [{
    id: `readiness.${draft.template_id}`,
    type: "readiness_gate",
    status: asString(readiness.status, "draft_requires_review"),
    ready_for_platform_sync: false,
    ready_for_campaign_launch: false,
    ready_for_budget_mutation: false,
    ready_for_project_data_write: false,
    required_tracking_events: uniqueStrings(readiness.required_tracking_events),
    optional_tracking_events: uniqueStrings(readiness.optional_tracking_events),
    readiness_rules: asArray(readiness.readiness_rules),
    notes: asArray(readiness.notes),
    source: "draft.readiness",
    manual_review_required: true
  }];
}

function buildProhibitedExecutionRules(draft) {
  return [
    {
      id: `prohibited.platform_write.${draft.template_id}`,
      type: "prohibited_execution",
      action: "external_platform_write",
      allowed: false,
      reason: "Audience OS is draft-only until explicit governed execution approval."
    },
    {
      id: `prohibited.campaign_launch.${draft.template_id}`,
      type: "prohibited_execution",
      action: "campaign_launch",
      allowed: false,
      reason: "Audience OS cannot launch campaigns from the rule engine."
    },
    {
      id: `prohibited.budget_mutation.${draft.template_id}`,
      type: "prohibited_execution",
      action: "budget_mutation",
      allowed: false,
      reason: "Audience OS cannot change budgets from the rule engine."
    },
    {
      id: `prohibited.project_data_mutation.${draft.template_id}`,
      type: "prohibited_execution",
      action: "project_data_mutation",
      allowed: false,
      reason: "Audience Rule Engine returns in-memory rule sets only."
    },
    {
      id: `prohibited.provider_execution.${draft.template_id}`,
      type: "prohibited_execution",
      action: "provider_execution",
      allowed: false,
      reason: "Provider execution is outside the Rule Engine scope."
    },
    {
      id: `prohibited.approval_mutation.${draft.template_id}`,
      type: "prohibited_execution",
      action: "approval_mutation",
      allowed: false,
      reason: "Rule Engine cannot create or mutate approvals."
    },
    {
      id: `prohibited.scheduler_execution.${draft.template_id}`,
      type: "prohibited_execution",
      action: "scheduler_execution",
      allowed: false,
      reason: "Rule Engine cannot schedule or run jobs."
    }
  ];
}

function buildAudienceRulesForDraft(draft, context = {}) {
  const normalizedContext = normalizeContext(context);
  const errors = [];
  const warnings = [];

  if (!isDraftLike(draft)) {
    return {
      ok: false,
      errors: [{
        code: "invalid_draft",
        message: "A constructor draft with template_id, execution_policy, and source is required."
      }],
      warnings,
      rule_set: null,
      policy: getAudienceRuleEnginePolicy()
    };
  }

  if (!Array.isArray(draft.include_events) || draft.include_events.length === 0) {
    warnings.push({
      code: "missing_include_events",
      template_id: draft.template_id,
      message: "Draft does not contain include events."
    });
  }

  const ruleSet = {
    id: `rules.${draft.template_id}`,
    template_id: draft.template_id,
    label: draft.label,
    status: "draft_rules_require_review",
    include_rules: buildIncludeRules(draft),
    exclude_rules: buildExcludeRules(draft),
    retention_rule: buildRetentionRule(draft),
    funnel_rule: buildFunnelRule(draft),
    campaign_usage_rules: buildCampaignUsageRules(draft),
    governance_rules: buildGovernanceRules(draft),
    ai_team_rules: buildAiTeamRules(draft, normalizedContext),
    readiness_rules: buildReadinessRules(draft),
    prohibited_execution_rules: buildProhibitedExecutionRules(draft),
    execution_policy: {
      manual_first: true,
      draft_only: true,
      read_only: true,
      external_platform_write_allowed: false,
      campaign_launch_allowed: false,
      budget_mutation_allowed: false,
      project_data_write_allowed: false,
      provider_execution_allowed: false,
      approval_mutation_allowed: false,
      scheduler_execution_allowed: false,
      requires_human_review: true
    },
    source: buildRuleSource(draft, normalizedContext)
  };

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    rule_set: ruleSet,
    policy: getAudienceRuleEnginePolicy()
  };
}

function buildAudienceRules(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const validation = validateAudienceRuleInput(source);

  if (!validation.ok) {
    return {
      ok: false,
      errors: validation.errors,
      warnings: validation.warnings,
      rule_set: null,
      policy: validation.policy
    };
  }

  if (isDraftLike(source.draft)) {
    const context = source.context || source;
    const draftResult = buildAudienceRulesForDraft(source.draft, context);

    return {
      ...draftResult,
      warnings: [...validation.warnings, ...draftResult.warnings]
    };
  }

  const draftResult = buildAudienceTemplateDraft(source);

  if (!draftResult.ok) {
    return {
      ok: false,
      errors: draftResult.errors,
      warnings: [...validation.warnings, ...(draftResult.warnings || [])],
      rule_set: null,
      policy: getAudienceRuleEnginePolicy()
    };
  }

  const rulesResult = buildAudienceRulesForDraft(draftResult.draft, source);

  return {
    ...rulesResult,
    warnings: [...validation.warnings, ...(draftResult.warnings || []), ...rulesResult.warnings]
  };
}

function buildAudienceRulesForTemplates(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const validation = validateAudienceRuleInput(source);

  if (!validation.ok) {
    return {
      ok: false,
      errors: validation.errors,
      warnings: validation.warnings,
      rule_sets: [],
      count: 0,
      policy: validation.policy
    };
  }

  const draftsResult = buildAudienceTemplateDrafts(source);

  if (!draftsResult.ok) {
    return {
      ok: false,
      errors: draftsResult.errors,
      warnings: [...validation.warnings, ...(draftsResult.warnings || [])],
      rule_sets: [],
      count: 0,
      policy: getAudienceRuleEnginePolicy()
    };
  }

  const results = draftsResult.drafts.map((draft) => buildAudienceRulesForDraft(draft, source));
  const errors = results.flatMap((result) => result.errors || []);
  const warnings = [
    ...validation.warnings,
    ...(draftsResult.warnings || []),
    ...results.flatMap((result) => result.warnings || [])
  ];
  const ruleSets = results.map((result) => result.rule_set).filter(Boolean);

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    rule_sets: ruleSets,
    count: ruleSets.length,
    policy: getAudienceRuleEnginePolicy()
  };
}

module.exports = {
  RULE_ENGINE_VERSION,
  buildAudienceRules,
  buildAudienceRulesForDraft,
  buildAudienceRulesForTemplates,
  getAudienceRuleEnginePolicy,
  validateAudienceRuleInput
};

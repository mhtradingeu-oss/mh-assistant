/**
 * MH-OS capability identity projection.
 *
 * This module is read-only compatibility metadata.
 * It does not grant authority, execute providers, create workflows,
 * bypass governance, or replace backend security.
 */

export const CAPABILITY_SURFACE_TYPES = Object.freeze({
  CAPABILITY: "capability",
  PROMPT_SUGGESTION: "prompt_suggestion",
  CONTEXT_ACTION: "context_action",
  NAVIGATION_ACTION: "navigation_action",
  WORKFLOW_INTENT: "workflow_intent",
  GOVERNANCE_ACTION: "governance_action"
});

export const CAPABILITY_MIGRATION_DECISIONS = Object.freeze({
  KEEP_IN_AI_WORKSPACE: "keep_in_ai_workspace",
  MOVE_TO_DESTINATION_PAGE: "move_to_destination_page",
  CONVERT_TO_PROMPT_SUGGESTION: "convert_to_prompt_suggestion",
  CONVERT_TO_CONTEXT_ACTION: "convert_to_context_action",
  COMPATIBILITY_ONLY: "compatibility_only",
  REMOVE_AFTER_PARITY: "remove_after_parity"
});

const defineCapability = ({
  legacyToolId,
  capabilityId,
  family,
  specialist,
  destinationRoute,
  surfaceType = CAPABILITY_SURFACE_TYPES.CAPABILITY,
  migrationDecision = CAPABILITY_MIGRATION_DECISIONS.MOVE_TO_DESTINATION_PAGE,
  executionExpectation = "destination_page_or_backend_authority"
}) => Object.freeze({
  legacyToolId,
  capabilityId,
  family,
  specialist,
  destinationRoute,
  surfaceType,
  migrationDecision,
  executionExpectation
});

export const AI_COMMAND_CAPABILITY_IDENTITIES = Object.freeze([
  defineCapability({
    legacyToolId: "rewrite",
    capabilityId: "content.rewrite",
    family: "content",
    specialist: "writer",
    destinationRoute: "content-studio"
  }),
  defineCapability({
    legacyToolId: "translate",
    capabilityId: "content.translate",
    family: "content",
    specialist: "writer",
    destinationRoute: "content-studio"
  }),
  defineCapability({
    legacyToolId: "improve",
    capabilityId: "content.improve",
    family: "content",
    specialist: "writer",
    destinationRoute: "content-studio"
  }),

  defineCapability({
    legacyToolId: "campaign-plan",
    capabilityId: "strategy.campaign_plan",
    family: "strategy",
    specialist: "strategist",
    destinationRoute: "campaign-studio"
  }),
  defineCapability({
    legacyToolId: "launch-plan",
    capabilityId: "strategy.launch_plan",
    family: "strategy",
    specialist: "strategist",
    destinationRoute: "campaign-studio"
  }),
  defineCapability({
    legacyToolId: "audience",
    capabilityId: "strategy.audience_definition",
    family: "strategy",
    specialist: "strategist",
    destinationRoute: "campaign-studio"
  }),
  defineCapability({
    legacyToolId: "offer",
    capabilityId: "strategy.offer_design",
    family: "strategy",
    specialist: "strategist",
    destinationRoute: "campaign-studio"
  }),
  defineCapability({
    legacyToolId: "funnel",
    capabilityId: "strategy.funnel_design",
    family: "strategy",
    specialist: "strategist",
    destinationRoute: "campaign-studio"
  }),
  defineCapability({
    legacyToolId: "priority",
    capabilityId: "strategy.priority_recommendation",
    family: "strategy",
    specialist: "strategist",
    destinationRoute: "home",
    surfaceType: CAPABILITY_SURFACE_TYPES.PROMPT_SUGGESTION,
    migrationDecision: CAPABILITY_MIGRATION_DECISIONS.CONVERT_TO_PROMPT_SUGGESTION,
    executionExpectation: "read_only_recommendation"
  }),

  defineCapability({
    legacyToolId: "write",
    capabilityId: "content.create",
    family: "content",
    specialist: "writer",
    destinationRoute: "content-studio"
  }),
  defineCapability({
    legacyToolId: "check",
    capabilityId: "content.quality_check",
    family: "content",
    specialist: "writer",
    destinationRoute: "content-studio"
  }),
  defineCapability({
    legacyToolId: "sources",
    capabilityId: "context.attach_source",
    family: "context",
    specialist: "writer",
    destinationRoute: "library",
    surfaceType: CAPABILITY_SURFACE_TYPES.CONTEXT_ACTION,
    migrationDecision: CAPABILITY_MIGRATION_DECISIONS.KEEP_IN_AI_WORKSPACE,
    executionExpectation: "frontend_context_selection"
  }),
  defineCapability({
    legacyToolId: "seo",
    capabilityId: "content.seo_optimize",
    family: "content",
    specialist: "writer",
    destinationRoute: "content-studio"
  }),
  defineCapability({
    legacyToolId: "repurpose",
    capabilityId: "content.repurpose",
    family: "content",
    specialist: "writer",
    destinationRoute: "content-studio"
  }),
  defineCapability({
    legacyToolId: "send",
    capabilityId: "handoff.content",
    family: "handoff",
    specialist: "writer",
    destinationRoute: "workflows",
    surfaceType: CAPABILITY_SURFACE_TYPES.WORKFLOW_INTENT,
    migrationDecision: CAPABILITY_MIGRATION_DECISIONS.KEEP_IN_AI_WORKSPACE,
    executionExpectation: "backend_handoff_authority"
  }),

  defineCapability({
    legacyToolId: "visual-brief",
    capabilityId: "media.visual_brief",
    family: "media",
    specialist: "media",
    destinationRoute: "media-studio"
  }),
  defineCapability({
    legacyToolId: "moodboard",
    capabilityId: "media.moodboard",
    family: "media",
    specialist: "media",
    destinationRoute: "media-studio"
  }),
  defineCapability({
    legacyToolId: "image-prompt",
    capabilityId: "media.image_prompt",
    family: "media",
    specialist: "media",
    destinationRoute: "media-studio"
  }),
  defineCapability({
    legacyToolId: "asset-list",
    capabilityId: "media.asset_plan",
    family: "media",
    specialist: "media",
    destinationRoute: "media-studio"
  }),
  defineCapability({
    legacyToolId: "layout",
    capabilityId: "media.layout_direction",
    family: "media",
    specialist: "media",
    destinationRoute: "media-studio"
  }),
  defineCapability({
    legacyToolId: "brand-check",
    capabilityId: "media.brand_consistency_check",
    family: "media",
    specialist: "media",
    destinationRoute: "media-studio"
  }),

  defineCapability({
    legacyToolId: "reel-script",
    capabilityId: "video.reel_script",
    family: "video",
    specialist: "video_lead",
    destinationRoute: "media-studio"
  }),
  defineCapability({
    legacyToolId: "storyboard",
    capabilityId: "video.storyboard",
    family: "video",
    specialist: "video_lead",
    destinationRoute: "media-studio"
  }),
  defineCapability({
    legacyToolId: "shot-list",
    capabilityId: "video.shot_list",
    family: "video",
    specialist: "video_lead",
    destinationRoute: "media-studio"
  }),
  defineCapability({
    legacyToolId: "voiceover",
    capabilityId: "audio.voiceover_brief",
    family: "audio",
    specialist: "video_lead",
    destinationRoute: "media-studio"
  }),
  defineCapability({
    legacyToolId: "video-cta",
    capabilityId: "video.cta_design",
    family: "video",
    specialist: "video_lead",
    destinationRoute: "media-studio"
  }),

  defineCapability({
    legacyToolId: "publish-check",
    capabilityId: "publishing.readiness_check",
    family: "publishing",
    specialist: "publisher",
    destinationRoute: "publishing"
  }),
  defineCapability({
    legacyToolId: "channel-pack",
    capabilityId: "publishing.channel_adaptation",
    family: "publishing",
    specialist: "publisher",
    destinationRoute: "publishing"
  }),
  defineCapability({
    legacyToolId: "schedule",
    capabilityId: "publishing.schedule_prepare",
    family: "publishing",
    specialist: "publisher",
    destinationRoute: "publishing"
  }),
  defineCapability({
    legacyToolId: "hashtags",
    capabilityId: "publishing.hashtag_suggestion",
    family: "publishing",
    specialist: "publisher",
    destinationRoute: "publishing",
    surfaceType: CAPABILITY_SURFACE_TYPES.PROMPT_SUGGESTION,
    migrationDecision: CAPABILITY_MIGRATION_DECISIONS.CONVERT_TO_PROMPT_SUGGESTION
  }),
  defineCapability({
    legacyToolId: "approval-pack",
    capabilityId: "publishing.approval_package",
    family: "publishing",
    specialist: "publisher",
    destinationRoute: "publishing",
    surfaceType: CAPABILITY_SURFACE_TYPES.GOVERNANCE_ACTION,
    executionExpectation: "backend_approval_authority"
  }),

  defineCapability({
    legacyToolId: "ad-angle",
    capabilityId: "ads.angle_design",
    family: "ads",
    specialist: "ads",
    destinationRoute: "ads-manager"
  }),
  defineCapability({
    legacyToolId: "ad-copy",
    capabilityId: "ads.copy_create",
    family: "ads",
    specialist: "ads",
    destinationRoute: "ads-manager"
  }),
  defineCapability({
    legacyToolId: "targeting",
    capabilityId: "ads.targeting_plan",
    family: "ads",
    specialist: "ads",
    destinationRoute: "ads-manager"
  }),
  defineCapability({
    legacyToolId: "creative-test",
    capabilityId: "ads.creative_test_plan",
    family: "ads",
    specialist: "ads",
    destinationRoute: "ads-manager"
  }),
  defineCapability({
    legacyToolId: "landing-match",
    capabilityId: "ads.landing_page_alignment",
    family: "ads",
    specialist: "ads",
    destinationRoute: "ads-manager"
  }),

  defineCapability({
    legacyToolId: "seo-brief",
    capabilityId: "research.seo_brief",
    family: "research",
    specialist: "analyst",
    destinationRoute: "research"
  }),
  defineCapability({
    legacyToolId: "insights",
    capabilityId: "analytics.insight_summary",
    family: "analytics",
    specialist: "analyst",
    destinationRoute: "insights"
  }),
  defineCapability({
    legacyToolId: "keywords",
    capabilityId: "research.keyword_analysis",
    family: "research",
    specialist: "analyst",
    destinationRoute: "research"
  }),
  defineCapability({
    legacyToolId: "performance",
    capabilityId: "analytics.performance_analysis",
    family: "analytics",
    specialist: "analyst",
    destinationRoute: "insights"
  }),
  defineCapability({
    legacyToolId: "content-gap",
    capabilityId: "research.content_gap_analysis",
    family: "research",
    specialist: "analyst",
    destinationRoute: "research"
  }),

  defineCapability({
    legacyToolId: "claims-check",
    capabilityId: "governance.claim_review",
    family: "governance",
    specialist: "compliance_reviewer",
    destinationRoute: "governance"
  }),
  defineCapability({
    legacyToolId: "safe-rewrite",
    capabilityId: "governance.safe_rewrite",
    family: "governance",
    specialist: "compliance_reviewer",
    destinationRoute: "governance"
  }),
  defineCapability({
    legacyToolId: "evidence",
    capabilityId: "governance.evidence_review",
    family: "governance",
    specialist: "compliance_reviewer",
    destinationRoute: "governance"
  }),
  defineCapability({
    legacyToolId: "gdpr",
    capabilityId: "governance.privacy_review",
    family: "governance",
    specialist: "compliance_reviewer",
    destinationRoute: "governance"
  }),
  defineCapability({
    legacyToolId: "approval-notes",
    capabilityId: "governance.approval_notes",
    family: "governance",
    specialist: "compliance_reviewer",
    destinationRoute: "governance"
  }),

  defineCapability({
    legacyToolId: "task-plan",
    capabilityId: "operations.task_plan",
    family: "operations",
    specialist: "operations",
    destinationRoute: "task-center"
  }),
  defineCapability({
    legacyToolId: "workflow",
    capabilityId: "operations.workflow_prepare",
    family: "operations",
    specialist: "operations",
    destinationRoute: "workflows",
    surfaceType: CAPABILITY_SURFACE_TYPES.WORKFLOW_INTENT,
    executionExpectation: "backend_workflow_authority"
  }),
  defineCapability({
    legacyToolId: "handoff",
    capabilityId: "operations.handoff_prepare",
    family: "operations",
    specialist: "operations",
    destinationRoute: "workflows",
    surfaceType: CAPABILITY_SURFACE_TYPES.WORKFLOW_INTENT,
    executionExpectation: "backend_handoff_authority"
  }),
  defineCapability({
    legacyToolId: "timeline",
    capabilityId: "operations.timeline_prepare",
    family: "operations",
    specialist: "operations",
    destinationRoute: "workflows"
  }),
  defineCapability({
    legacyToolId: "checklist",
    capabilityId: "operations.checklist_prepare",
    family: "operations",
    specialist: "operations",
    destinationRoute: "task-center"
  }),

  defineCapability({
    legacyToolId: "reply-draft",
    capabilityId: "customer.reply_draft",
    family: "customer",
    specialist: "customer_ops",
    destinationRoute: "customer-center"
  }),
  defineCapability({
    legacyToolId: "ticket",
    capabilityId: "customer.ticket_prepare",
    family: "customer",
    specialist: "customer_ops",
    destinationRoute: "customer-center"
  }),
  defineCapability({
    legacyToolId: "sla",
    capabilityId: "customer.sla_review",
    family: "customer",
    specialist: "customer_ops",
    destinationRoute: "customer-center"
  }),
  defineCapability({
    legacyToolId: "summary",
    capabilityId: "customer.conversation_summary",
    family: "customer",
    specialist: "customer_ops",
    destinationRoute: "customer-center"
  }),

  defineCapability({
    legacyToolId: "sales-pitch",
    capabilityId: "sales.pitch_create",
    family: "sales",
    specialist: "sales_crm",
    destinationRoute: "customer-center"
  }),
  defineCapability({
    legacyToolId: "follow-up",
    capabilityId: "sales.follow_up",
    family: "sales",
    specialist: "sales_crm",
    destinationRoute: "customer-center"
  }),
  defineCapability({
    legacyToolId: "objections",
    capabilityId: "sales.objection_handling",
    family: "sales",
    specialist: "sales_crm",
    destinationRoute: "customer-center"
  }),
  defineCapability({
    legacyToolId: "lead-brief",
    capabilityId: "sales.lead_brief",
    family: "sales",
    specialist: "sales_crm",
    destinationRoute: "customer-center"
  })
]);

const capabilityByLegacyToolId = new Map();

AI_COMMAND_CAPABILITY_IDENTITIES.forEach((entry) => {
  const current = capabilityByLegacyToolId.get(entry.legacyToolId) || [];
  capabilityByLegacyToolId.set(entry.legacyToolId, Object.freeze([...current, entry]));
});

export function getCapabilitiesByLegacyToolId(legacyToolId = "") {
  return capabilityByLegacyToolId.get(String(legacyToolId || "").trim()) || [];
}

export function getCapabilityByIdentity(capabilityId = "") {
  const normalized = String(capabilityId || "").trim();
  return AI_COMMAND_CAPABILITY_IDENTITIES.find((entry) => entry.capabilityId === normalized) || null;
}

export function listCapabilitiesForSpecialist(specialist = "") {
  const normalized = String(specialist || "").trim();
  return AI_COMMAND_CAPABILITY_IDENTITIES.filter((entry) => entry.specialist === normalized);
}

export function listCapabilitiesForDestination(destinationRoute = "") {
  const normalized = String(destinationRoute || "").trim();
  return AI_COMMAND_CAPABILITY_IDENTITIES.filter((entry) => entry.destinationRoute === normalized);
}

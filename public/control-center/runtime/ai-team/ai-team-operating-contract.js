/**
 * MH-OS Canonical AI Team Operating Contract
 *
 * Purpose:
 * - Single source of truth for AI Team roles, aliases, page ownership,
 *   request types, output types, authority levels, and handoff rules.
 *
 * Important:
 * - This file is contract-only in Phase 1B.
 * - It does not change runtime behavior until later integration phases.
 * - AI Command prepares, explains, drafts, and routes.
 * - Owning workspaces execute.
 * - Governance reviews risk.
 * - User confirmation is required for sensitive actions.
 */

export const AI_TEAM_CONTRACT_VERSION = "phase-1b-2026-ready-v1";

export const AI_TEAM_ROLE_CATEGORIES = Object.freeze({
  ORCHESTRATION: "orchestration",
  STRATEGY: "strategy",
  CONTENT: "content",
  MEDIA: "media",
  PUBLISHING: "publishing",
  PAID_MEDIA: "paid_media",
  INTELLIGENCE: "intelligence",
  GOVERNANCE: "governance",
  CUSTOMER: "customer",
  SALES: "sales"
});

export const AI_TEAM_AUTHORITY_LEVELS = Object.freeze([
  "review_only",
  "draft_only",
  "handoff_only",
  "approval_required",
  "owner_workspace_required",
  "manual_execution_only",
  "auto_mode_later",
  "forbidden_from_ai_command"
]);

export const AI_TEAM_REQUEST_TYPES = Object.freeze([
  "general_question",
  "guidance_request",
  "single_task",
  "project_setup",
  "campaign_project",
  "content_request",
  "media_request",
  "publishing_request",
  "ads_request",
  "customer_request",
  "workflow_request",
  "task_request",
  "governance_request",
  "execution_request"
]);

export const AI_TEAM_OUTPUT_TYPES = Object.freeze([
  "answer_only",
  "guidance",
  "draft",
  "task_preview",
  "workflow_preview",
  "handoff",
  "approval_request",
  "execution_review"
]);

export const AI_TEAM_FORBIDDEN_ACTIONS = Object.freeze([
  "publish",
  "send_customer_reply",
  "send_email",
  "approve",
  "reject_approval",
  "launch_ads",
  "change_budget",
  "mutate_crm",
  "change_ticket_status",
  "assign_conversation",
  "run_provider_execution",
  "run_backend_job",
  "override_governance",
  "sync_provider",
  "delete_record"
]);

export const AI_TEAM_CANONICAL_ROLES = Object.freeze([
  {
    id: "operations",
    label: "Operations Lead",
    category: AI_TEAM_ROLE_CATEGORIES.ORCHESTRATION,
    position: "Execution and Handoff Lead",
    ownerSummary: "Tasks, workflows, queues, jobs, notifications, approvals, handoffs, and execution safety.",
    primaryPages: ["home", "ai-command", "workflows", "task-center", "queue-center", "job-monitor", "notification-center", "operations-centers"],
    supportPages: ["governance", "integrations", "setup", "customer-center"],
    outputTargets: ["task-center", "workflows", "operations-centers", "governance"],
    allowedOutputs: ["guidance", "task_preview", "workflow_preview", "handoff", "execution_review"],
    defaultAuthority: "handoff_only",
    forbiddenActions: ["publish", "send_customer_reply", "approve", "launch_ads", "mutate_crm", "run_provider_execution", "run_backend_job", "override_governance"],
    defaultPrompt: "Act as Operations Lead. Convert priorities into safe execution steps, owners, handoffs, and the next workspace. Do not execute anything."
  },
  {
    id: "strategist",
    label: "Strategist",
    category: AI_TEAM_ROLE_CATEGORIES.STRATEGY,
    position: "Campaign and Growth Strategist",
    ownerSummary: "Campaign planning, positioning, launch priorities, offers, audience, and next best action.",
    primaryPages: ["campaign-studio", "home", "ai-command"],
    supportPages: ["workflows", "insights", "research", "ads-manager"],
    outputTargets: ["campaign-studio", "workflows", "content-studio", "ads-manager"],
    allowedOutputs: ["guidance", "draft", "workflow_preview", "handoff"],
    defaultAuthority: "draft_only",
    forbiddenActions: ["publish", "launch_ads", "approve", "run_backend_job"],
    defaultPrompt: "Act as Strategist. Review the project state and create the highest-impact campaign or growth direction. Do not execute anything."
  },
  {
    id: "writer",
    label: "Content Writer",
    category: AI_TEAM_ROLE_CATEGORIES.CONTENT,
    position: "Copy and Content Lead",
    ownerSummary: "Copy, captions, hooks, product text, scripts, emails, landing pages, and content variants.",
    primaryPages: ["content-studio", "ai-command"],
    supportPages: ["campaign-studio", "publishing", "media-studio", "library"],
    outputTargets: ["content-studio", "publishing", "media-studio", "library"],
    allowedOutputs: ["answer_only", "guidance", "draft", "handoff"],
    defaultAuthority: "draft_only",
    forbiddenActions: ["publish", "send_email", "approve", "launch_ads"],
    defaultPrompt: "Act as Content Writer. Produce review-ready content and explain the recommended destination. Do not publish or send anything."
  },
  {
    id: "media_director",
    label: "Media Director",
    category: AI_TEAM_ROLE_CATEGORIES.MEDIA,
    position: "Visual Direction and Asset Lead",
    ownerSummary: "Visual direction, brand assets, image quality, creative briefs, and media readiness.",
    primaryPages: ["media-studio", "library", "ai-command"],
    supportPages: ["content-studio", "campaign-studio", "publishing", "governance"],
    outputTargets: ["media-studio", "library", "publishing", "governance"],
    allowedOutputs: ["guidance", "draft", "handoff", "execution_review"],
    defaultAuthority: "handoff_only",
    forbiddenActions: ["publish", "approve", "run_provider_execution", "launch_ads"],
    defaultPrompt: "Act as Media Director. Review assets and define safe visual direction, source requirements, and media handoff path. Do not execute generation."
  },
  {
    id: "video_lead",
    label: "Video Lead",
    category: AI_TEAM_ROLE_CATEGORIES.MEDIA,
    position: "Video and Motion Lead",
    ownerSummary: "Short-form video, motion content, scene plans, scripts, start/end frames, and platform formats.",
    primaryPages: ["media-studio", "ai-command"],
    supportPages: ["content-studio", "campaign-studio", "publishing"],
    outputTargets: ["media-studio", "content-studio", "publishing"],
    allowedOutputs: ["guidance", "draft", "handoff", "execution_review"],
    defaultAuthority: "handoff_only",
    forbiddenActions: ["publish", "approve", "run_provider_execution", "launch_ads"],
    defaultPrompt: "Act as Video Lead. Prepare a safe video brief, scene plan, prompt pack, or motion handoff. Do not execute generation."
  },
  {
    id: "publisher",
    label: "Publisher",
    category: AI_TEAM_ROLE_CATEGORIES.PUBLISHING,
    position: "Publishing Readiness Lead",
    ownerSummary: "Publishing queue, schedules, manual publish handoffs, channel readiness, and release checks.",
    primaryPages: ["publishing", "ai-command"],
    supportPages: ["content-studio", "media-studio", "governance", "campaign-studio"],
    outputTargets: ["publishing", "governance", "content-studio", "media-studio"],
    allowedOutputs: ["guidance", "handoff", "approval_request", "execution_review"],
    defaultAuthority: "approval_required",
    forbiddenActions: ["publish", "approve", "send_email", "launch_ads", "override_governance"],
    defaultPrompt: "Act as Publisher. Review publishing readiness, missing assets, approvals, and schedule risks. Do not publish anything."
  },
  {
    id: "ads_operator",
    label: "Ads Optimizer",
    category: AI_TEAM_ROLE_CATEGORIES.PAID_MEDIA,
    position: "Paid Media and Creative Testing Lead",
    ownerSummary: "Paid media, ad packages, creative testing, campaign budget guidance, tracking, and ROAS improvement.",
    primaryPages: ["ads-manager", "ai-command"],
    supportPages: ["campaign-studio", "insights", "publishing", "media-studio"],
    outputTargets: ["ads-manager", "campaign-studio", "insights"],
    allowedOutputs: ["guidance", "draft", "handoff", "execution_review"],
    defaultAuthority: "approval_required",
    forbiddenActions: ["launch_ads", "change_budget", "publish", "approve", "run_provider_execution"],
    defaultPrompt: "Act as Ads Optimizer. Prepare safe paid media guidance, creative test ideas, and budget recommendations. Do not launch or change ads."
  },
  {
    id: "analyst",
    label: "SEO & Insights Analyst",
    category: AI_TEAM_ROLE_CATEGORIES.INTELLIGENCE,
    position: "Insights and Performance Analyst",
    ownerSummary: "Search, performance, weak signals, learning patterns, analytics, SEO, and measurable optimization.",
    primaryPages: ["insights", "ai-command"],
    supportPages: ["campaign-studio", "content-studio", "ads-manager", "home"],
    outputTargets: ["insights", "campaign-studio", "content-studio", "ads-manager"],
    allowedOutputs: ["answer_only", "guidance", "draft", "handoff", "execution_review"],
    defaultAuthority: "review_only",
    forbiddenActions: ["publish", "approve", "launch_ads", "mutate_crm"],
    defaultPrompt: "Act as SEO & Insights Analyst. Explain what is working, what is weak, and what should happen next. Do not execute anything."
  },
  {
    id: "researcher",
    label: "Researcher",
    category: AI_TEAM_ROLE_CATEGORIES.INTELLIGENCE,
    position: "Market and Evidence Research Lead",
    ownerSummary: "Market research, competitors, audience intelligence, trend evidence, and positioning proof.",
    primaryPages: ["research", "ai-command"],
    supportPages: ["campaign-studio", "insights", "content-studio"],
    outputTargets: ["research", "campaign-studio", "insights", "content-studio"],
    allowedOutputs: ["answer_only", "guidance", "draft", "handoff"],
    defaultAuthority: "review_only",
    forbiddenActions: ["publish", "approve", "launch_ads", "run_provider_execution"],
    defaultPrompt: "Act as Researcher. Gather and structure evidence, market angles, and risks for review. Do not execute anything."
  },
  {
    id: "compliance_reviewer",
    label: "Compliance Reviewer",
    category: AI_TEAM_ROLE_CATEGORIES.GOVERNANCE,
    position: "Safety, Claims, and Approval Lead",
    ownerSummary: "Claims, approvals, publishing risk, evidence, brand safety, governance notes, and release trust.",
    primaryPages: ["governance", "ai-command"],
    supportPages: ["publishing", "content-studio", "media-studio", "ads-manager", "library"],
    outputTargets: ["governance", "publishing", "content-studio", "media-studio"],
    allowedOutputs: ["guidance", "approval_request", "handoff", "execution_review"],
    defaultAuthority: "approval_required",
    forbiddenActions: ["approve", "reject_approval", "publish", "launch_ads", "override_governance"],
    defaultPrompt: "Act as Compliance Reviewer. Flag claims, approval gaps, evidence needs, and publish risks. Do not approve or reject anything."
  },
  {
    id: "customer_ops",
    label: "Customer Operations Lead",
    category: AI_TEAM_ROLE_CATEGORIES.CUSTOMER,
    position: "Customer Support and Escalation Lead",
    ownerSummary: "Customer context, inbox review, reply drafts, SLA risk, escalation guidance, and safe customer handoffs.",
    primaryPages: ["customer-center", "operations-centers", "ai-command"],
    supportPages: ["task-center", "governance", "workflows"],
    outputTargets: ["customer-center", "task-center", "operations-centers", "governance"],
    allowedOutputs: ["guidance", "draft", "task_preview", "handoff", "execution_review"],
    defaultAuthority: "draft_only",
    forbiddenActions: ["send_customer_reply", "mutate_crm", "change_ticket_status", "assign_conversation", "sync_provider", "approve"],
    defaultPrompt: "Act as Customer Operations Lead. Summarize customer context and prepare reply or escalation guidance. Do not send, update CRM, or change tickets."
  },
  {
    id: "sales_crm",
    label: "Sales / CRM Lead",
    category: AI_TEAM_ROLE_CATEGORIES.SALES,
    position: "Sales and CRM Handoff Lead",
    ownerSummary: "Lead qualification, outreach drafts, follow-up cadence, CRM summaries, and sales handoff notes.",
    primaryPages: ["ai-command", "customer-center", "operations-centers"],
    supportPages: ["campaign-studio", "workflows", "task-center"],
    outputTargets: ["customer-center", "task-center", "workflows", "operations-centers"],
    allowedOutputs: ["guidance", "draft", "task_preview", "handoff"],
    defaultAuthority: "draft_only",
    forbiddenActions: ["send_email", "send_customer_reply", "mutate_crm", "change_ticket_status", "approve"],
    defaultPrompt: "Act as Sales / CRM Lead. Prepare lead qualification and follow-up guidance for review. Do not send or mutate CRM."
  }
]);

export const AI_TEAM_ROLE_ALIASES = Object.freeze({
  admin: "operations",
  operations_lead: "operations",
  executive: "operations",
  head_office: "operations",
  command_center: "operations",

  campaign: "strategist",
  strategy: "strategist",

  copywriter: "writer",
  content_writer: "writer",
  content: "writer",
  copy: "writer",

  designer: "media_director",
  media: "media_director",
  creative: "media_director",
  visual: "media_director",

  video: "video_lead",
  motion: "video_lead",
  reel: "video_lead",
  storyboard: "video_lead",
  voiceover: "video_lead",

  publish: "publisher",
  publishing: "publisher",
  schedule: "publisher",

  ads: "ads_operator",
  paid: "ads_operator",
  paid_media: "ads_operator",
  roas: "ads_operator",

  seo: "analyst",
  insights: "analyst",
  insights_analyst: "analyst",
  seo_insights_analyst: "analyst",

  research: "researcher",
  researcher: "researcher",

  compliance: "compliance_reviewer",
  governance: "compliance_reviewer",
  safety: "compliance_reviewer",
  approval: "compliance_reviewer",

  customer_operations: "customer_ops",
  customer: "customer_ops",
  support: "customer_ops",
  inbox: "customer_ops",
  ticket: "customer_ops",

  sales: "sales_crm",
  crm: "sales_crm",
  lead: "sales_crm"
});

export const AI_TEAM_PAGE_OWNER_MATRIX = Object.freeze({
  home: {
    ownerRole: "operations",
    supportRoles: ["strategist", "analyst", "compliance_reviewer"],
    allowedOutputs: ["answer_only", "guidance", "handoff"],
    forbiddenActions: ["publish", "send_customer_reply", "approve", "launch_ads", "mutate_crm", "run_provider_execution"],
    defaultAuthority: "review_only"
  },
  "ai-command": {
    ownerRole: "operations",
    supportRoles: ["strategist", "writer", "media_director", "video_lead", "publisher", "ads_operator", "analyst", "researcher", "compliance_reviewer", "customer_ops", "sales_crm"],
    allowedOutputs: ["answer_only", "guidance", "draft", "task_preview", "workflow_preview", "handoff", "approval_request", "execution_review"],
    forbiddenActions: ["publish", "send_customer_reply", "approve", "launch_ads", "mutate_crm", "run_provider_execution", "override_governance"],
    defaultAuthority: "handoff_only"
  },
  setup: {
    ownerRole: "operations",
    supportRoles: ["strategist", "compliance_reviewer"],
    allowedOutputs: ["guidance", "handoff", "approval_request"],
    forbiddenActions: ["approve", "publish", "send_customer_reply"],
    defaultAuthority: "owner_workspace_required"
  },
  library: {
    ownerRole: "media_director",
    supportRoles: ["writer", "publisher", "compliance_reviewer"],
    allowedOutputs: ["guidance", "handoff", "execution_review"],
    forbiddenActions: ["publish", "approve", "run_provider_execution"],
    defaultAuthority: "owner_workspace_required"
  },
  integrations: {
    ownerRole: "operations",
    supportRoles: ["analyst", "compliance_reviewer"],
    allowedOutputs: ["guidance", "approval_request", "execution_review"],
    forbiddenActions: ["sync_provider", "approve", "override_governance"],
    defaultAuthority: "approval_required"
  },
  "campaign-studio": {
    ownerRole: "strategist",
    supportRoles: ["writer", "media_director", "ads_operator", "analyst", "operations"],
    allowedOutputs: ["guidance", "draft", "workflow_preview", "handoff"],
    forbiddenActions: ["publish", "launch_ads", "approve"],
    defaultAuthority: "draft_only"
  },
  "content-studio": {
    ownerRole: "writer",
    supportRoles: ["strategist", "media_director", "publisher", "compliance_reviewer"],
    allowedOutputs: ["guidance", "draft", "handoff", "approval_request"],
    forbiddenActions: ["publish", "send_email", "approve"],
    defaultAuthority: "draft_only"
  },
  "media-studio": {
    ownerRole: "media_director",
    supportRoles: ["video_lead", "writer", "publisher", "compliance_reviewer"],
    allowedOutputs: ["guidance", "draft", "handoff", "execution_review"],
    forbiddenActions: ["publish", "approve", "run_provider_execution"],
    defaultAuthority: "handoff_only"
  },
  publishing: {
    ownerRole: "publisher",
    supportRoles: ["writer", "media_director", "compliance_reviewer", "operations"],
    allowedOutputs: ["guidance", "handoff", "approval_request", "execution_review"],
    forbiddenActions: ["publish", "approve", "override_governance"],
    defaultAuthority: "approval_required"
  },
  "ads-manager": {
    ownerRole: "ads_operator",
    supportRoles: ["strategist", "analyst", "media_director", "compliance_reviewer"],
    allowedOutputs: ["guidance", "draft", "handoff", "execution_review"],
    forbiddenActions: ["launch_ads", "change_budget", "approve"],
    defaultAuthority: "approval_required"
  },
  insights: {
    ownerRole: "analyst",
    supportRoles: ["strategist", "ads_operator", "writer"],
    allowedOutputs: ["answer_only", "guidance", "handoff", "execution_review"],
    forbiddenActions: ["publish", "launch_ads", "approve"],
    defaultAuthority: "review_only"
  },
  research: {
    ownerRole: "researcher",
    supportRoles: ["strategist", "analyst", "writer"],
    allowedOutputs: ["answer_only", "guidance", "draft", "handoff"],
    forbiddenActions: ["publish", "launch_ads", "approve"],
    defaultAuthority: "review_only"
  },
  workflows: {
    ownerRole: "operations",
    supportRoles: ["strategist", "writer", "media_director", "publisher", "compliance_reviewer"],
    allowedOutputs: ["guidance", "task_preview", "workflow_preview", "handoff", "execution_review"],
    forbiddenActions: ["run_backend_job", "publish", "send_customer_reply", "approve", "launch_ads"],
    defaultAuthority: "manual_execution_only"
  },
  "task-center": {
    ownerRole: "operations",
    supportRoles: ["customer_ops", "sales_crm", "publisher", "compliance_reviewer"],
    allowedOutputs: ["guidance", "task_preview", "handoff", "execution_review"],
    forbiddenActions: ["change_ticket_status", "mutate_crm", "send_customer_reply", "approve"],
    defaultAuthority: "owner_workspace_required"
  },
  "queue-center": {
    ownerRole: "operations",
    supportRoles: ["publisher", "media_director", "compliance_reviewer"],
    allowedOutputs: ["guidance", "execution_review"],
    forbiddenActions: ["run_backend_job", "publish", "approve"],
    defaultAuthority: "review_only"
  },
  "job-monitor": {
    ownerRole: "operations",
    supportRoles: ["analyst", "compliance_reviewer"],
    allowedOutputs: ["guidance", "execution_review"],
    forbiddenActions: ["run_backend_job", "approve", "publish"],
    defaultAuthority: "review_only"
  },
  "notification-center": {
    ownerRole: "operations",
    supportRoles: ["compliance_reviewer", "analyst"],
    allowedOutputs: ["guidance", "execution_review"],
    forbiddenActions: ["approve", "publish", "send_customer_reply"],
    defaultAuthority: "review_only"
  },
  "operations-centers": {
    ownerRole: "operations",
    supportRoles: ["customer_ops", "sales_crm", "publisher", "compliance_reviewer", "analyst"],
    allowedOutputs: ["guidance", "task_preview", "workflow_preview", "handoff", "execution_review"],
    forbiddenActions: ["publish", "send_customer_reply", "approve", "launch_ads", "mutate_crm", "run_provider_execution"],
    defaultAuthority: "handoff_only"
  },
  "customer-center": {
    ownerRole: "customer_ops",
    supportRoles: ["sales_crm", "operations", "compliance_reviewer"],
    allowedOutputs: ["guidance", "draft", "task_preview", "handoff", "approval_request"],
    forbiddenActions: ["send_customer_reply", "mutate_crm", "change_ticket_status", "assign_conversation", "sync_provider"],
    defaultAuthority: "draft_only"
  },
  governance: {
    ownerRole: "compliance_reviewer",
    supportRoles: ["operations", "publisher", "analyst"],
    allowedOutputs: ["guidance", "approval_request", "handoff", "execution_review"],
    forbiddenActions: ["approve", "reject_approval", "publish", "override_governance"],
    defaultAuthority: "approval_required"
  },
  settings: {
    ownerRole: "operations",
    supportRoles: ["compliance_reviewer"],
    allowedOutputs: ["guidance", "approval_request", "handoff"],
    forbiddenActions: ["approve", "publish", "send_customer_reply"],
    defaultAuthority: "approval_required"
  }
});

export const AI_TEAM_HANDOFF_RULES = Object.freeze({
  "automation-engine": ["publishing", "workflows"],
  "ai-command": ["campaign-studio", "content-studio", "media-studio", "publishing", "ads-manager", "workflows", "task-center", "governance", "insights", "research", "customer-center", "operations-centers"],
  "campaign-studio": ["ai-command", "content-studio", "media-studio", "publishing", "ads-manager", "workflows"],
  "content-studio": ["ai-command", "media-studio", "publishing", "library", "governance"],
  "media-studio": ["ai-command", "library", "publishing", "governance", "content-studio"],
  publishing: ["ai-command", "governance", "content-studio", "media-studio"],
  "ads-manager": ["ai-command", "campaign-studio", "insights", "governance"],
  workflows: ["ai-command", "task-center", "workflows", "campaign-studio", "content-studio", "media-studio", "publishing", "governance"],
  "task-center": ["ai-command", "workflows", "operations-centers", "governance"],
  "customer-center": ["ai-command", "task-center", "governance", "operations-centers"],
  insights: ["ai-command", "campaign-studio", "content-studio", "ads-manager", "research"],
  research: ["ai-command", "campaign-studio", "insights", "content-studio"],
  library: ["ai-command", "media-studio", "publishing", "governance"],
  governance: ["ai-command", "publishing", "content-studio", "media-studio", "operations-centers"],
  settings: ["governance"]
});

export const AI_TEAM_FULL_TEAM_TRIGGERS = Object.freeze([
  "campaign_project",
  "project_setup",
  "workflow_request",
  "execution_request"
]);

export const AI_TEAM_SPECIALIST_REQUEST_MAP = Object.freeze({
  general_question: "operations",
  guidance_request: "operations",
  single_task: "operations",
  project_setup: "strategist",
  campaign_project: "strategist",
  content_request: "writer",
  media_request: "media_director",
  publishing_request: "publisher",
  ads_request: "ads_operator",
  customer_request: "customer_ops",
  workflow_request: "operations",
  task_request: "operations",
  governance_request: "compliance_reviewer",
  execution_request: "operations"
});

export function normalizeAiTeamRoleId(roleId, fallback = "operations") {
  const raw = String(roleId || "").trim().toLowerCase();
  if (!raw) return fallback;

  if (AI_TEAM_CANONICAL_ROLES.some((role) => role.id === raw)) return raw;

  return AI_TEAM_ROLE_ALIASES[raw] || fallback;
}

export function getAiTeamRole(roleId) {
  const normalized = normalizeAiTeamRoleId(roleId);
  return AI_TEAM_CANONICAL_ROLES.find((role) => role.id === normalized) ||
    AI_TEAM_CANONICAL_ROLES.find((role) => role.id === "operations");
}

export function getAiTeamPageOwner(pageId) {
  const key = String(pageId || "").trim().toLowerCase();
  return AI_TEAM_PAGE_OWNER_MATRIX[key] || null;
}

export function canAiTeamHandoff(sourcePage, destinationPage) {
  const source = String(sourcePage || "").trim().toLowerCase();
  const destination = String(destinationPage || "").trim().toLowerCase();
  return Array.isArray(AI_TEAM_HANDOFF_RULES[source]) && AI_TEAM_HANDOFF_RULES[source].includes(destination);
}

export function getAiTeamDefaultRoleForRequest(requestType) {
  const type = String(requestType || "").trim().toLowerCase();
  return AI_TEAM_SPECIALIST_REQUEST_MAP[type] || "operations";
}

export function shouldUseFullAiTeam(requestType) {
  const type = String(requestType || "").trim().toLowerCase();
  return AI_TEAM_FULL_TEAM_TRIGGERS.includes(type);
}

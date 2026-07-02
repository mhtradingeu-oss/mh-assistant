# PHASE 3AF.1 — AI Command Specialists / Tools Evidence

## Mode definitions
import {
        bindAiToolDock,
        getAiToolDockTools,
        openAiToolDrawerFromMetadata,
        renderAiToolDrawerShell
} from "./ai-command/tool-dock.js";
import { getProjectedActiveRole, getProjectedTeamMembers } from "../runtime/authority/authority-projection.js";

import {
        selectCurrentProject,
        selectOperationsSnapshot,
        selectProjectPayload
} from "../state.js";

import {
        getSharedHandoff,
        setSharedAiDraft,
        setSharedHandoff
} from "../shared-context.js";

import {
        getCategoryReadinessList
} from "../asset-library.js";

import {
        executeProjectAiChat,
        executeProjectAiGuidance
} from "../api.js";

//  AI TEAM DEFINITIONS
// ============================================================

const MODE_DEFS = [
        {
                id: "strategist",
                label: "Strategist",
                icon: "🎯",
                summary: "Campaign concepts, launch plans, channel mix, and offer strategy.",
                routeHint: "campaign-studio"
        },
        {
                id: "writer",
                label: "Content Writer",
                icon: "✍️",
                summary: "Captions, hooks, scripts, emails, and landing page copy.",
                routeHint: "content-studio"
        },
        {
                id: "media",
                label: "Media Director",
                icon: "🎨",
                summary: "Visual direction, creative brief, format guidance, and brand consistency.",
                routeHint: "media-studio"
        },
        {
                id: "video_lead",
                label: "Video Lead",
                icon: "🎬",
                summary: "Short-form video scripts, motion direction, and reel strategy.",
                routeHint: "media-studio"
        },
        {
                id: "publisher",
                label: "Publisher",
                icon: "📤",
                summary: "Publishing readiness, schedule review, and handoff preparation.",
                routeHint: "publishing"
        },
        {
                id: "ads",
                label: "Ads Optimizer",
                icon: "📣",
                summary: "Ad concepts, targeting angles, platform copy, and paid strategy.",
                routeHint: "ads-manager"
        },
        {
                id: "analyst",
                label: "SEO & Insights Analyst",
                icon: "📊",
                summary: "SEO signals, performance data, content insights, and traffic patterns.",
                routeHint: "insights"
        },
        {
                id: "compliance_reviewer",
                label: "Compliance Reviewer",
                icon: "🛡️",
                summary: "Claims review, approvals, safety language, and governance checks.",
                routeHint: "governance"
        },
        {
                id: "operations",
                label: "Operations Lead",
                icon: "⚙️",
                summary: "Tasks, timelines, handoffs, approvals, and execution plans.",
                routeHint: "workflows"
        },
        {
                id: "customer_ops",
                label: "Customer Operations Lead",
                icon: "🎧",
                summary: "Inbox review, reply drafts, ticket drafts, SLA risk, and escalation routing.",
                routeHint: "operations-centers"
        },
        {
                id: "sales_crm",
                label: "Sales / CRM Lead",
                icon: "💼",
                summary: "Lead qualification, outreach drafts, follow-up cadence, and CRM handoff notes.",
                routeHint: "workflows"
        }
];

// Map legacy mode IDs from older sessions to new team IDs
const MODE_ID_ALIASES = {
	executive: "operations",
	campaign: "strategist",
	content: "writer",
	designer: "media",
	media_director: "media",
	media_planner: "media",

## Specialist definitions
	media_planner: "media",
	seo: "analyst",
	research: "researcher",
	video_lead: "video_lead",
	publisher: "publisher",
	compliance_reviewer: "compliance_reviewer",
	customer_operations: "customer_ops",
	customer_ops: "customer_ops",
	support: "customer_ops",
	sales: "sales_crm",
	crm: "sales_crm",
	sales_crm: "sales_crm",
	admin: "operations"
};

// ============================================================
//  PHASE 1: SPECIALIST DEFINITIONS — AI TEAM COMMAND CENTER
// ============================================================

const SPECIALIST_DEFS = [
	{
		id: "strategist",
		label: "Strategist",
		position: "Executive Strategy Lead",
		icon: "🎯",
		summary: "Campaign concepts, launch plans, channel mix, and offer strategy.",
		placeholder: "Ask the Strategist to plan a campaign, map launch phases, review channel priorities, or define the offer strategy…",
		canHelp: ["Draft campaign plans", "Prioritize next actions", "Map launch sequences", "Advise on offer strategy", "Prepare channel briefs"],
		cannotDo: ["Publish campaigns directly", "Execute workflows automatically", "Approve content", "Set live budgets"],
		destinations: ["Campaign Studio", "Workflows", "AI Command"],
		safetyNote: "All outputs are guidance and draft only. Execution requires explicit confirmation.",
		status: "Ready"
	},
	{
		id: "writer",
		label: "Content Writer",
		position: "Messaging and Content Lead",
		icon: "✍️",
		summary: "Captions, hooks, scripts, emails, and landing page copy.",
		placeholder: "Ask the Content Writer to draft captions, hooks, landing copy, or campaign messages…",
		canHelp: ["Draft captions and hooks", "Write email copy", "Create landing page text", "Prepare publisher handoff", "Suggest message variants"],
		cannotDo: ["Publish directly", "Approve risky claims", "Invent unsupported facts", "Run workflows automatically"],
		destinations: ["Content Studio", "Publishing", "AI Command"],
		safetyNote: "Drafts require review before publishing. Cannot approve or publish without confirmation.",
		status: "Ready"
	},
	{
		id: "media",
		label: "Media Director",
		position: "Creative Direction Lead",
		icon: "🎨",
		summary: "Visual direction, creative briefs, format guidance, and brand consistency.",
		placeholder: "Ask the Media Director to define visual direction, prepare a creative brief, or review brand consistency…",
		canHelp: ["Write creative briefs", "Advise on visual direction", "Map format requirements", "Review brand alignment", "Prepare media handoffs"],
		cannotDo: ["Generate images directly", "Upload assets without review", "Approve without confirmation", "Execute media jobs"],
		destinations: ["Asset Library", "Content Studio", "AI Command"],
		safetyNote: "Direction and briefs only. Media generation requires backend confirmation and explicit action.",
		status: "Ready"
	},
	{
		id: "video_lead",
		label: "Video Lead",
		position: "Short-Form Video Lead",
		icon: "🎬",
		summary: "Short-form video scripts, motion direction, and reel strategy.",
		placeholder: "Ask the Video Lead to write a reel script, map short-form strategy, or outline the next video concept…",
		canHelp: ["Write video scripts", "Plan short-form strategy", "Define motion direction", "Map video asset requirements", "Prepare video briefs"],
		cannotDo: ["Generate video directly", "Upload footage without review", "Approve without confirmation", "Run media jobs automatically"],
		destinations: ["Asset Library", "Content Studio", "Media Native"],
		safetyNote: "Scripts and direction only. Video generation requires explicit backend action and approval.",
		status: "Ready"
	},
	{
		id: "publisher",
		label: "Publisher",
		position: "Publishing Readiness Lead",
		icon: "📤",
		summary: "Publishing readiness, schedule review, and handoff preparation.",
		placeholder: "Ask the Publisher to review publishing readiness, check scheduling, or prepare a handoff package…",
		canHelp: ["Review publishing readiness", "Check scheduled jobs", "Prepare handoff packages", "Map publishing dependencies", "Flag pre-publish risks"],
		cannotDo: ["Publish without explicit approval", "Override schedules", "Bypass governance gates", "Push to live channels directly"],
		destinations: ["Publishing", "Workflows", "AI Command"],
		safetyNote: "Publishing always requires explicit approval. No live publishing from AI guidance alone.",
		status: "Ready"
	},
	{
		id: "ads",
		label: "Ads Optimizer",
		position: "Paid Growth Lead",
		icon: "📢",
		summary: "Ad concepts, targeting angles, platform copy, and paid strategy.",
		placeholder: "Ask the Ads Optimizer to draft ad copy, review targeting angles, or plan a paid campaign structure…",
		canHelp: ["Draft ad concepts and copy", "Review targeting angles", "Plan paid campaign structure", "Suggest creative variants", "Map platform-specific strategy"],
		cannotDo: ["Launch ads directly", "Set live budgets without review", "Approve spend", "Access ad accounts directly"],
		destinations: ["Ads Manager", "Integrations", "Campaign Studio"],
		safetyNote: "Ad concepts and copy only. Live ad actions require platform integration and explicit approval.",
		status: "Ready"
	},
	{
		id: "analyst",
		label: "SEO & Insights Analyst",
		position: "Search and Insights Lead",
		icon: "📊",
		summary: "SEO signals, performance data, content insights, and traffic patterns.",
		placeholder: "Ask the SEO & Insights Analyst to review performance, suggest SEO improvements, or identify top content patterns…",
		canHelp: ["Review SEO signals", "Analyze content performance", "Identify traffic patterns", "Suggest keyword improvements", "Map data coverage gaps"],
		cannotDo: ["Update SEO settings directly", "Edit live website", "Set analytics configurations", "Publish recommendations automatically"],
		destinations: ["Insights", "Integrations", "Setup"],
		safetyNote: "Analysis and recommendations only. No direct website or analytics changes.",
		status: "Ready"
	},
	{
		id: "compliance_reviewer",
		label: "Compliance Reviewer",
		position: "Claims and Governance Lead",
		icon: "🛡️",
		summary: "Claims review, approval safety, publishing risk, and governance notes.",
		placeholder: "Ask the Compliance Reviewer to check claims, approval risks, publishing safety, and governance notes…",
		canHelp: ["Review marketing claims", "Flag approval risks", "Check publishing safety", "Prepare governance notes", "Identify compliance blockers"],
		cannotDo: ["Grant approvals directly", "Override governance gates", "Publish on behalf of approvers", "Remove flags without review"],
		destinations: ["Workflows", "Publishing", "Governance"],
		safetyNote: "Compliance review is advisory. Approvals always require human confirmation before execution.",
		status: "Ready"
	},
	{
		id: "operations",
		label: "Operations Lead",
		position: "Execution and Handoff Lead",
		icon: "⚙️",
		summary: "Tasks, timelines, handoffs, approvals, and execution plans.",
		placeholder: "Ask the Operations Lead to turn this into tasks, workflow steps, or handoffs…",
		canHelp: ["Create task plans", "Map execution sequences", "Prepare workflow handoffs", "Review execution health", "Identify operational blockers"],
		cannotDo: ["Run workflows without confirmation", "Auto-approve tasks", "Override authority gates", "Execute backend operations directly"],
		destinations: ["Workflows", "Operations Centers", "AI Command"],
		safetyNote: "Task plans and handoffs only. Workflow execution requires explicit user confirmation.",
		status: "Ready"
	},
	{
		id: "customer_ops",
		label: "Customer Operations Lead",
		position: "Customer Experience Operations Lead",
		icon: "🎧",
		summary: "Inbox review, reply drafts, ticket drafts, SLA risk, customer profile context, and escalation routing.",
		placeholder: "Ask the Customer Operations Lead to summarize a customer thread, draft a safe reply, prepare a ticket draft, check SLA risk, or route an escalation for review…",
		canHelp: ["Review inbox context", "Summarize customer threads", "Draft safe replies", "Prepare ticket drafts", "Flag SLA and escalation risk"],
		cannotDo: ["Send customer replies", "Create live tickets", "Change SLA policy", "Escalate without confirmation"],
		destinations: ["Unified Inbox", "Operations Centers", "Integrations"],
		safetyNote: "Customer operations outputs are drafts only. Sending replies, ticket creation, and escalations require confirmation in the owning surface.",
		status: "Ready"
	},
	{
		id: "sales_crm",
		label: "Sales / CRM Lead",
		position: "Revenue and CRM Operations Lead",
		icon: "💼",
		summary: "Lead qualification, outreach drafts, follow-up cadence, CRM profile summaries, and sales handoff notes.",
		placeholder: "Ask the Sales / CRM Lead to qualify a lead, draft outreach, plan follow-ups, summarize CRM context, or prepare a sales handoff for review…",
		canHelp: ["Qualify lead context", "Draft outreach", "Plan follow-up sequences", "Summarize CRM profiles", "Prepare sales handoffs"],
		cannotDo: ["Send outreach", "Mutate CRM records", "Advance pipeline stages", "Confirm follow-ups without review"],
		destinations: ["CRM", "Workflows", "Operations Centers"],
		safetyNote: "Sales and CRM outputs are guidance and drafts only. CRM mutations and outreach sends require confirmation in the owning surface.",
		status: "Ready"
	}
];

// Role-specific suggested prompt chips (prefill only, no auto-execute)
const SPECIALIST_SUGGESTED_PROMPTS = {
	strategist: [
		{ label: "What should I do next?", sub: "Review priorities and blockers" },
		{ label: "Draft a campaign brief", sub: "Map objective, audience, and channels" },
		{ label: "Review launch readiness", sub: "Identify what is blocking launch" },
		{ label: "Suggest the next campaign move", sub: "Based on current project state" }
	],
	writer: [
		{ label: "Draft campaign captions", sub: "For the active campaign" },
		{ label: "Write a hook sequence", sub: "3 hook variants to test" },
		{ label: "Prepare a Publisher handoff", sub: "Package ready content for review" },
		{ label: "Suggest message variants", sub: "Test different angles and tones" }
	],
	media: [
		{ label: "Write a creative brief", sub: "For the next campaign visual" },
		{ label: "Review brand consistency", sub: "Flag misaligned assets" },
		{ label: "Map format requirements", sub: "By platform and campaign phase" },
		{ label: "Prepare a media handoff", sub: "Package direction for the team" }
	],
	video_lead: [
		{ label: "Write a reel script", sub: "For the current campaign" },
		{ label: "Plan short-form content", sub: "Map next 4 video concepts" },
		{ label: "Outline motion direction", sub: "Align visuals with campaign tone" },
		{ label: "Map video asset needs", sub: "By platform and format" }
	],
	publisher: [
		{ label: "Review publishing readiness", sub: "Check what is ready to publish" },
		{ label: "Flag pre-publish risks", sub: "Identify what needs review first" },
		{ label: "Check scheduled jobs", sub: "Review the current queue" },
		{ label: "Prepare a handoff package", sub: "For the approver review" }
	],
	ads: [
		{ label: "Draft ad concepts", sub: "For the current campaign" },
		{ label: "Review targeting angles", sub: "Map audience and platform fit" },
		{ label: "Suggest creative variants", sub: "Test different hooks and CTAs" },
		{ label: "Plan paid campaign structure", sub: "Objective, audience, creative, budget" }
	],
	analyst: [
		{ label: "Review SEO signals", sub: "Top queries, CTR gaps, weak pages" },
		{ label: "Analyze content performance", sub: "What is working and what is not" },
		{ label: "Map data coverage gaps", sub: "Which integrations are missing" },
		{ label: "Suggest next improvements", sub: "Based on current signals" }
	],
	compliance_reviewer: [
		{ label: "Check claims for approval", sub: "Review all marketing claims" },
		{ label: "Flag publishing risks", sub: "Identify blockers before release" },
		{ label: "Prepare governance notes", sub: "Document compliance status" },
		{ label: "Review approval requirements", sub: "What needs sign-off" }
	],
	operations: [
		{ label: "Turn this into tasks", sub: "Break down into action items" },
		{ label: "Draft a workflow handoff", sub: "Prepare for the next owner" },
		{ label: "Review execution health", sub: "Check blockers and failed jobs" },
		{ label: "Map the next execution steps", sub: "Sequence and prioritize" }
	],
	customer_ops: [
		{ label: "Summarize customer thread", sub: "Capture issue, tone, and next reply" },
		{ label: "Draft customer reply", sub: "Safe response for review" },
		{ label: "Check SLA risk", sub: "Flag urgency and escalation path" },
		{ label: "Prepare escalation", sub: "Route support, sales, or operations" }
	],
	sales_crm: [
		{ label: "Qualify this lead", sub: "Fit, intent, urgency, next step" },
		{ label: "Draft outreach", sub: "Personalized message for review" },
		{ label: "Build follow-up sequence", sub: "Multi-step sales cadence" },
		{ label: "Prepare sales handoff", sub: "Route context to operations" }
	]
};

// Full Team mode suggested prompts
const TEAM_SUGGESTED_PROMPTS = [
	{ label: "What should the executive AI team focus on?", sub: "Strategy, execution, and risk review" },
	{ label: "Map the next launch wave", sub: "Strategist to Publisher to Operations" },
	{ label: "Prepare a full handoff sequence", sub: "Strategy, creative, compliance, publishing, ops" },
	{ label: "Review customer and sales impact", sub: "Customer Ops, Sales / CRM, Operations" }

## Output tabs and tool labels
const AI_ROOM_FLOW_STEPS = [
	{ id: "ask", title: "Ask", description: "Write the request and choose the team lane." },
	{ id: "draft", title: "Draft", description: "Generate guidance, copy, task, or handoff material." },
	{ id: "review", title: "Review", description: "Check safety, scope, language, and destination." },
	{ id: "route", title: "Route", description: "Send context to the owning workspace." },
	{ id: "execute", title: "Execute", description: "Execution stays gated in backend-owned surfaces." },
	{ id: "monitor", title: "Monitor", description: "Track readiness, integrations, and recent activity." }
];

const AI_ROOM_OUTPUT_TABS = [
	{ id: "draft", label: "Draft", helper: "Latest draft or guidance preview" },
	{ id: "task", label: "Task", helper: "Task-shaped output" },
	{ id: "workflow", label: "Workflow Preview", helper: "Operating sequence" },
	{ id: "handoff", label: "Handoff Preview", helper: "Destination package" },
	{ id: "export", label: "Export", helper: "File-ready package" }
];

const AI_ROOM_TEAM_CHAIN = ["Strategist", "Writer", "Media / Video", "Compliance", "Publisher", "Operations"];
const AI_ROOM_BUSINESS_BRANCH = ["Customer Ops", "Sales / CRM", "Operations"];

const AI_ROOM_ROLE_INITIALS = {
	strategist: "ST",
	writer: "CW",
	media: "MD",
	video_lead: "VL",
	publisher: "PB",
	ads: "AO",
	analyst: "SI",
	compliance_reviewer: "CR",
	operations: "OL",
	customer_ops: "CO",
	sales_crm: "SC"
};

const AI_ROOM_BACKEND_ROLE_ALIASES = {
	ads: "ads_operator",
	media: "designer",
	compliance_reviewer: "compliance_reviewer"
};

const AI_ROOM_PLANNED_SPECIALISTS = [
	{
		label: "Admin / Governance",
		initials: "AG",
		status: "Planned",
		summary: "Policy, approvals, roles, and audit controls stay destination-owned."
	},
	{
		label: "Researcher",
		initials: "RS",
		status: "Planned",
		summary: "Market, evidence, competitor, and proof research will prepare source packs only."
	},
	{
		label: "Automation Architect",
		initials: "AA",
		status: "Planned",
		summary: "Workflow blueprints and trigger maps will route to Workflows before execution."
	}
];

const PHASE35_SPECIALIST_TOOLS = {
	strategist: [
		{ id: "campaign-angle-generator", label: "Campaign Angle Generator", action: "preview", intent: "guidance", template: "Generate campaign angles for {project}. Include audience tension, promise, channel fit, and strongest first test." },
		{ id: "launch-plan", label: "Launch Plan", action: "preview", intent: "workflow", template: "Build a launch plan for {project}. Include phases, channels, owners, blockers, and next move." },
		{ id: "funnel-mapping", label: "Funnel Mapping", action: "preview", intent: "guidance", template: "Map the funnel for {project}. Include awareness, consideration, conversion, retention, and handoff points." },
		{ id: "prioritize-next-move", label: "Priority Sort", action: "preview", intent: "task", template: "Prioritize the next moves for {project}. Rank by impact, urgency, dependencies, and safest first action." }
	],
	writer: [
		{ id: "hook-generator", label: "Hook Generator", action: "preview", intent: "guidance", template: "Write 5 German hook variants for {project}. Keep them concise, testable, and suitable for the Germany market." },
		{ id: "caption-builder", label: "Caption Builder", action: "preview", intent: "guidance", template: "Draft German captions for {project}. Include angle, body, CTA, and platform adaptation notes." },
		{ id: "cta-refiner", label: "CTA Refiner", action: "preview", intent: "task", template: "Refine CTA options for {project}. Provide German variants for awareness, consideration, and action stages." },
		{ id: "publisher-package", label: "Publisher Package", action: "preview", intent: "handoff", template: "Prepare a Publisher handoff for {project}. Include German copy package, CTA, notes, and remaining checks." }
	],
	media: [
		{ id: "creative-brief-builder", label: "Creative Brief Builder", action: "preview", intent: "media", template: "Prepare a creative brief for {project}. Include concept, visual rules, subject, brand constraints, and production notes." },
		{ id: "format-mapper", label: "Format Mapper", action: "preview", intent: "guidance", template: "Map required creative formats for {project}. Include platform, aspect ratio, asset type, and usage context." },
		{ id: "asset-checklist", label: "Asset Checklist", action: "preview", intent: "task", template: "Create an asset checklist for {project}. List must-have files, missing references, usage context, and priority." },
		{ id: "visual-direction", label: "Visual Direction", action: "preview", intent: "guidance", template: "Review visual direction for {project}. Identify mismatches, improvements, and required references." },
		{ id: "open-media-studio", label: "Send prompt to Media Studio", action: "route", route: "media-studio" }
	],
	video_lead: [
		{ id: "write-video-hook", label: "Write video hook", action: "preview", intent: "guidance", template: "Write short-form video hooks for {project}. Include 3 opening variants and audience fit." },
		{ id: "draft-script", label: "Draft script", action: "preview", intent: "guidance", template: "Draft a short-form video script for {project}. Include hook, body, CTA, and visual cues." },
		{ id: "build-storyboard", label: "Build storyboard", action: "preview", intent: "workflow", template: "Build storyboard beats for {project}. Sequence shots and key transitions." },
		{ id: "prepare-voiceover", label: "Prepare voiceover", action: "preview", intent: "guidance", template: "Prepare voiceover script options for {project}. Keep clean timing and emphasis notes." },
		{ id: "map-video-asset-needs", label: "Map video asset needs", action: "preview", intent: "task", template: "Map video asset needs for {project}. Include format, source, and production owner." }
	],
	publisher: [
		{ id: "publishing-checklist", label: "Publishing Checklist", action: "preview", intent: "handoff", template: "Build a publishing checklist for {project}. Include German copy, assets, claims checks, and channel readiness." },
		{ id: "final-packaging", label: "Final Packaging", action: "preview", intent: "handoff", template: "Prepare a final publishing package for {project}. Include copy, CTA, asset notes, approvals, and destination channel." },

## Tool dock definitions

import {
  setSharedLibrarySourceBridge,
  getSharedAiSource,
  clearSharedAiSource,
  getSourceTypeMapping,
  setSharedAiDrawerReturn,
  getSharedAiDrawerReturn,
  clearSharedAiDrawerReturn
} from "../../shared-context.js";



function moveFocusOutOfDrawer(drawer, fallbackTarget = null) {
  if (!drawer || typeof document === "undefined") return;

  const active = document.activeElement;
  if (active && drawer.contains(active)) {
    if (fallbackTarget && typeof fallbackTarget.focus === "function") {
      fallbackTarget.focus({ preventScroll: true });
      return;
    }

    const composer = document.querySelector("[data-aicmd-composer-input], textarea, input");
    if (composer && typeof composer.focus === "function") {
      composer.focus({ preventScroll: true });
      return;
    }

    if (typeof active.blur === "function") {
      active.blur();
    }
  }
}

function escapeHtml(value = "") {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[char] || char);
}

function tryAutoOpenDrawerAfterLibrary(projectName) {
  const returnContext = getSharedAiDrawerReturn(projectName) || getSharedAiDrawerReturn("__default__");
  if (!returnContext?.drawerOpen) return;

  const drawer = document.querySelector("[data-aicmd-tool-drawer]");
  const root = drawer?.closest?.("[data-page='ai-command'], .ai-command-page, body") || document;

  let targetButton = null;
  if (returnContext.toolId) {
    targetButton = root.querySelector(`[data-aicmd-tool-dock="${returnContext.toolId}"]`);
  }

  if (!targetButton) {
    targetButton = root.querySelector("[data-aicmd-tool-dock][data-aicmd-tool-dock-action='guided']")
      || root.querySelector("[data-aicmd-tool-dock]");
  }

  if (targetButton && typeof targetButton.click === "function") {
    targetButton.click();
  }

  const activeDrawer = document.querySelector("[data-aicmd-tool-drawer]");
  let drawerIsOpen = Boolean(
    activeDrawer &&
    activeDrawer.hidden === false &&
    activeDrawer.getAttribute("aria-hidden") === "false" &&
    activeDrawer.classList.contains("is-open")
  );

  if (!drawerIsOpen && activeDrawer) {
    if (returnContext.toolId) activeDrawer.dataset.pendingTool = returnContext.toolId;
    if (returnContext.specialistId) activeDrawer.dataset.specialistId = returnContext.specialistId;
    if (returnContext.modeId) activeDrawer.dataset.modeId = returnContext.modeId;
    if (returnContext.teamMode) activeDrawer.dataset.teamMode = returnContext.teamMode;

    activeDrawer.hidden = false;
    activeDrawer.setAttribute("aria-hidden", "false");
    activeDrawer.classList.add("is-open");

    drawerIsOpen = true;
  }

  if (drawerIsOpen && activeDrawer) {
    applySharedAiSourceToDrawer(activeDrawer, projectName);

    const selectedSource = getSharedAiSource(projectName) || getSharedAiSource("__default__");
    const msg = activeDrawer.querySelector("[data-aicmd-tool-drawer-status]") || document.querySelector("[data-aicmd-tool-drawer-status]");
    if (msg) {
      msg.textContent = selectedSource?.name
        ? "Source added to drawer."
        : "Returned to drawer. No source selected.";
    }

    clearSharedAiDrawerReturn(projectName);
    clearSharedAiDrawerReturn("__default__");
  }
}

// --- Helper to build AI Drawer Return Context ---
function buildAiDrawerReturnContext({
  projectName = "",
  origin = "ai-command",
  drawerOpen = true,
  specialistId = "",
  modeId = "",
  toolId = "",
  teamMode = "solo",
  sourceType = "",
  outputType = "",
  created_at = null,
  extra = {}
} = {}) {
  return {
    type: "ai_drawer_return",
    origin,
    drawerOpen,
    specialistId,
    modeId,
    toolId,
    teamMode,
    sourceType,
    outputType,
    created_at: created_at || new Date().toISOString(),
    ...extra
  };
}

// --- When Open Library is clicked from tool dock, store both bridge and drawer return context ---
function handleOpenLibraryFromDrawer({
  projectName = "",
  specialistId = "",
  modeId = "",
  toolId = "",
  teamMode = "solo",
  sourceType = "",
  outputType = ""
} = {}) {
  // Build and store drawer return context
  const payload = buildAiDrawerReturnContext({
    projectName,
    origin: "ai-command",
    drawerOpen: true,
    specialistId,
    modeId,
    toolId,
    teamMode,
    sourceType,
    outputType
  });
  setSharedAiDrawerReturn(projectName || "__default__", payload);
  // Also set library source bridge context if needed (existing logic)
  // ...existing bridge logic...
}

function formatSharedAiSource(source = {}) {
  if (!source || !source.name) return null;
  const name = source.name || "(no name)";
  const type = source.asset_type || source.type || "asset";
  const path = source.file_path || source.filename || source.fileName || "";
  return { name, type, path };
}

function getSelectedLibrarySource(projectName = "") {
  return getSharedAiSource(projectName) || getSharedAiSource("__default__");
}

function truncatePromptText(value = "", maxLength = 900) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

function compactSourceReference(value = "", maxLength = 120) {
  const text = String(value || "").trim();
  if (!text || text.length <= maxLength) return text;
  const parts = text.split(/[\/]/).filter(Boolean);
  const tail = parts.slice(-2).join("/");
  if (tail && tail.length < maxLength) return `.../${tail}`;
  return `${text.slice(0, maxLength - 3).trim()}...`;
}

function buildSelectedSourceContextBlock(projectName = "") {
  const source = getSelectedLibrarySource(projectName);
  if (!source?.name) return "";

  const name = source.name || source.filename || source.fileName || "Selected Library source";
  const type = source.asset_type || source.type || source.source_type || "Library asset";
  const sourceId = source.asset_id || source.id || source.mutation_id || "";
  const path = source.file_path || source.path || source.filename || source.fileName || "";
  const preview = truncatePromptText(source.text_preview || source.preview || source.notes || "");
  const sourceOfTruth = typeof source.source_of_truth === "boolean"
    ? (source.source_of_truth ? "yes" : "no")
    : (source.source_of_truth || "");

  const lines = [
    "Selected Library source context:",
    `- Source name: ${name}.`,
    `- Source type: ${type}.`
  ];

  if (sourceId) lines.push(`- Source id: ${compactSourceReference(sourceId, 80)}.`);
  if (path) lines.push(`- Source path: ${compactSourceReference(path, 120)}.`);
  if (sourceOfTruth) lines.push(`- Source-of-truth flag: ${sourceOfTruth}.`);
  if (preview) lines.push(`- Text preview: ${preview}`);

  lines.push("Use the selected Library source as context. Do not invent unsupported claims.");
  return lines.join("\n");
}

function setDrawerSourceWarning(drawer, message = "") {
  const warning = drawer?.querySelector?.("[data-aicmd-tool-drawer-source-warning]");
  if (!warning) return;
  const hasMessage = Boolean(message);
  warning.hidden = !hasMessage;
  warning.textContent = message;
}

function sourceMetadataNeedsLibrarySource(rawValue = "") {
  return /source_of_truth_assets|selected_asset|proof_doc|legal_doc|privacy_policy/i.test(String(rawValue || ""));
}

function isDrawerSourceRequired(drawer) {
  return drawer?.dataset?.sourceRequired === "true";
}

function validateDrawerSourceRequirement(drawer, projectName = "") {
  if (!isDrawerSourceRequired(drawer)) {
    setDrawerSourceWarning(drawer, "");
    return true;
  }

  const source = getSelectedLibrarySource(projectName);
  if (source?.name) {
    setDrawerSourceWarning(drawer, "");
    return true;
  }

  setDrawerSourceWarning(
    drawer,
    "This tool needs a source. Choose from Library or change the source type before continuing."
  );
  return false;
}

export function applySharedAiSourceToDrawer(drawer, projectName = "") {
  if (!drawer) return;
  const source = getSelectedLibrarySource(projectName);
  const selectedNode = drawer.querySelector("[data-aicmd-tool-drawer-selected-source]");
  const sourceInput = drawer.querySelector("[data-aicmd-tool-drawer-source-details]");
  const sourceSelect = drawer.querySelector("[data-aicmd-tool-drawer-source-select]");

  if (!source || !source.name) {
    if (selectedNode) {
      selectedNode.innerHTML = `<span class=\"mhos-tool-drawer-selected-source-empty\">No Library source selected yet.</span>`;
    }

## Tool dock operation/destination references
195:  const preview = truncatePromptText(source.text_preview || source.preview || source.notes || "");
209:  if (preview) lines.push(`- Text preview: ${preview}`);
335:    template: "Translate or adapt the selected text for the project target market. Keep the explanation in the user's chat language and prepare only review-ready copy."
342:    template: "Improve this draft for clarity, stronger value, better structure, and a cleaner CTA. Keep it safe and review-ready."
355:      frontendOwnerPage: "campaign-studio",
356:      destinations: ["chat-preview", "campaign-studio", "content-studio", "workflows"],
358:      outputTypes: ["campaign_plan", "campaign_brief", "channel_plan", "next_best_actions"],
359:      template: "Create a campaign plan for {projectName}. Include objective, audience, offer, channels, phases, risks, and next best actions. Keep it review-ready only."
368:      frontendOwnerPage: "campaign-studio",
369:      destinations: ["chat-preview", "campaign-studio", "workflows", "publishing"],
371:      outputTypes: ["launch_plan", "readiness_plan", "timeline", "dependency_map"],
381:      frontendOwnerPage: "campaign-studio",
382:      destinations: ["chat-preview", "campaign-studio", "content-studio", "insights"],
384:      outputTypes: ["audience_map", "segment_notes", "objection_map", "message_angles"],
394:      frontendOwnerPage: "campaign-studio",
395:      destinations: ["chat-preview", "campaign-studio", "content-studio", "ads-manager"],
397:      outputTypes: ["offer_brief", "value_proposition", "proof_points", "cta_options"],
407:      frontendOwnerPage: "campaign-studio",
408:      destinations: ["chat-preview", "campaign-studio", "content-studio", "workflows", "publishing"],
410:      outputTypes: ["funnel_map", "content_needs", "handoff_points", "retention_notes"],
411:      template: "Map a funnel for {projectName}. Include awareness, consideration, conversion, retention, content needs, and handoff points."
418:      actionType: "preview",
420:      frontendOwnerPage: "workflows",
421:      destinations: ["chat-preview", "workflows", "task", "campaign-studio"],
422:      sourceTypes: ["current_chat", "operations_snapshot", "readiness_gaps", "campaign_notes", "manual_input"],
423:      outputTypes: ["next_best_action", "priority_list", "blocker_map", "action_sequence"],
436:      frontendOwnerPage: "content-studio",
437:      destinations: ["chat-preview", "content-studio", "library", "media-studio", "publishing", "compliance"],
439:      outputTypes: ["company_profile", "product_copy", "email", "blog_article", "landing_page", "contract_draft", "presentation_outline", "speech", "faq", "proposal", "social_post", "ad_copy"],
440:      template: "Use the Content Writer to create a new written output for {projectName}. First ask or infer the output type: company profile, product copy, email, blog article, landing page, contract draft, presentation outline, speech, FAQ, proposal, social post, or ad copy. Ask for sources if needed. Keep it review-ready and do not publish or send anything."
449:      frontendOwnerPage: "ai-command",
450:      destinations: ["composer", "content-studio"],
452:      outputTypes: ["professional_rewrite", "shorter_rewrite", "simpler_rewrite", "persuasive_rewrite", "premium_rewrite", "platform_specific_rewrite"],
462:      frontendOwnerPage: "content-studio",
463:      destinations: ["composer", "content-studio"],
465:      outputTypes: ["translation", "localization", "market_adaptation", "cta_localization"],
466:      template: "Translate and localize the current text for {projectName}. Ask for target language and market if missing. Preserve brand tone, adapt CTA and wording for the target audience, and keep the result review-ready."
475:      frontendOwnerPage: "ai-command",
476:      destinations: ["composer", "content-studio"],
478:      outputTypes: ["clarity_improvement", "structure_improvement", "cta_improvement", "readability_improvement", "conversion_improvement"],
486:      actionType: "preview",
488:      frontendOwnerPage: "ai-command",
489:      destinations: ["preview", "content-studio", "compliance"],
491:      outputTypes: ["grammar_check", "spelling_check", "tone_check", "readability_check", "cta_check", "claim_risk_check", "seo_check", "compliance_notes"],
501:      frontendOwnerPage: "library",
502:      destinations: ["library", "ai-command", "content-studio"],
504:      outputTypes: ["source_bundle", "fact_extraction", "proof_summary", "context_brief"],
514:      frontendOwnerPage: "content-studio",
515:      destinations: ["content-studio", "insights", "library"],
517:      outputTypes: ["seo_brief", "keyword_clusters", "search_intent_map", "blog_outline", "meta_pack", "faq_ideas", "internal_link_plan", "content_gap_notes"],
527:      frontendOwnerPage: "content-studio",
528:      destinations: ["chat-preview", "content-studio", "publishing"],
530:      outputTypes: ["blog_to_social", "profile_to_pitch", "product_to_ad_copy", "transcript_to_article", "notes_to_presentation", "long_text_to_email_sequence"],
538:      actionType: "route",
540:      frontendOwnerPage: "ai-command",
541:      destinations: ["content-studio", "library", "media-studio", "publishing", "compliance", "task", "handoff"],
542:      sourceTypes: ["current_draft", "preview", "current_chat"],
543:      outputTypes: ["content_studio_draft", "library_save", "media_brief", "publishing_package", "compliance_review", "task_preview", "handoff_preview"],
544:      template: "Prepare safe routing for this Content Writer output for {projectName}. Ask the destination: Content Studio, Save to Library, Prepare Media Brief, Publishing package, Compliance review, Task, or Handoff. Do not route or execute before review."
555:      frontendOwnerPage: "media-studio",
556:      destinations: ["chat-preview", "media-studio", "library", "content-studio", "publishing"],
558:      outputTypes: ["visual_brief", "creative_direction", "format_brief", "asset_requirements"],
568:      frontendOwnerPage: "media-studio",
569:      destinations: ["chat-preview", "media-studio", "library"],
571:      outputTypes: ["moodboard_direction", "style_notes", "reference_list", "brand_alignment_notes"],
581:      frontendOwnerPage: "media-studio",
582:      destinations: ["chat-preview", "media-studio", "library"],
584:      outputTypes: ["image_prompt", "prompt_variants", "negative_prompt", "style_prompt"],
594:      frontendOwnerPage: "media-studio",
595:      destinations: ["chat-preview", "media-studio", "library", "workflows"],
597:      outputTypes: ["asset_checklist", "missing_assets", "asset_request_brief", "production_requirements"],
607:      frontendOwnerPage: "media-studio",
608:      destinations: ["chat-preview", "media-studio", "content-studio", "publishing"],
610:      outputTypes: ["layout_plan", "section_hierarchy", "responsive_notes", "cta_placement"],
620:      frontendOwnerPage: "media-studio",
621:      destinations: ["chat-preview", "media-studio", "governance", "library"],
623:      outputTypes: ["brand_check_report", "style_risks", "missing_assets", "improvement_actions"],
636:      frontendOwnerPage: "media-studio",
637:      destinations: ["chat-preview", "media-studio", "content-studio", "publishing"],
639:      outputTypes: ["reel_script", "short_video_script", "hook_variants", "overlay_copy"],
649:      frontendOwnerPage: "media-studio",
650:      destinations: ["chat-preview", "media-studio", "library", "publishing"],
652:      outputTypes: ["storyboard", "scene_plan", "caption_plan", "asset_requirements"],
662:      frontendOwnerPage: "media-studio",
663:      destinations: ["chat-preview", "media-studio", "workflows", "library"],
665:      outputTypes: ["shot_list", "b_roll_list", "prop_list", "production_checklist"],
675:      frontendOwnerPage: "media-studio",
676:      destinations: ["chat-preview", "media-studio", "content-studio"],
678:      outputTypes: ["voiceover_script", "audio_direction", "pacing_notes", "tone_variants"],
688:      frontendOwnerPage: "media-studio",
689:      destinations: ["chat-preview", "media-studio", "publishing", "ads-manager"],
691:      outputTypes: ["video_cta_options", "soft_cta", "direct_cta", "urgency_cta", "brand_cta"],
702:      actionType: "preview",
704:      frontendOwnerPage: "publishing",
705:      destinations: ["chat-preview", "publishing", "governance", "content-studio", "media-studio"],
707:      outputTypes: ["publishing_readiness_check", "missing_items", "channel_fit_review", "risk_notes"],
717:      frontendOwnerPage: "publishing",
718:      destinations: ["chat-preview", "publishing", "content-studio", "media-studio"],
720:      outputTypes: ["channel_pack", "caption_pack", "format_notes", "approval_checklist"],
730:      frontendOwnerPage: "publishing",
731:      destinations: ["chat-preview", "publishing", "workflows"],
733:      outputTypes: ["schedule_builder", "calendar_slot_options", "dependency_notes", "review_gates"],
743:      frontendOwnerPage: "publishing",
744:      destinations: ["chat-preview", "publishing", "content-studio", "insights"],
746:      outputTypes: ["hashtag_pack", "discoverability_tags", "platform_tag_groups", "market_tags"],
756:      frontendOwnerPage: "governance",
757:      destinations: ["chat-preview", "governance", "publishing", "workflows"],
759:      outputTypes: ["approval_pack", "risk_summary", "asset_checklist", "confirmation_list"],
772:      frontendOwnerPage: "ads-manager",
773:      destinations: ["chat-preview", "ads-manager", "content-studio", "governance"],
775:      outputTypes: ["ad_angle", "angle_variants", "pain_benefit_map", "compliance_risks"],
785:      frontendOwnerPage: "ads-manager",
786:      destinations: ["chat-preview", "ads-manager", "content-studio", "governance"],
788:      outputTypes: ["ad_copy", "headline_variants", "primary_text_variants", "cta_variants"],
798:      frontendOwnerPage: "ads-manager",
799:      destinations: ["chat-preview", "ads-manager", "insights", "campaign-studio"],
801:      outputTypes: ["audience_map", "targeting_ideas", "exclusions", "funnel_stage_map"],
811:      frontendOwnerPage: "ads-manager",
812:      destinations: ["chat-preview", "ads-manager", "media-studio", "insights", "workflows"],
814:      outputTypes: ["ab_test_plan", "creative_test_matrix", "hypotheses", "success_signals"],
824:      frontendOwnerPage: "ads-manager",
825:      destinations: ["chat-preview", "ads-manager", "content-studio", "governance"],
827:      outputTypes: ["landing_match_review", "message_gap_report", "cta_improvements", "trust_signal_notes"],
840:      frontendOwnerPage: "insights",
841:      destinations: ["chat-preview", "insights", "content-studio", "library"],
843:      outputTypes: ["seo_brief", "search_intent_map", "content_structure", "meta_ideas", "internal_links"],
853:      frontendOwnerPage: "insights",
854:      destinations: ["chat-preview", "insights", "campaign-studio", "workflows"],
856:      outputTypes: ["insights_summary", "optimization_actions", "missing_data_notes", "risk_notes"],
866:      frontendOwnerPage: "insights",
867:      destinations: ["chat-preview", "insights", "content-studio", "library"],
869:      outputTypes: ["keyword_groups", "commercial_keywords", "informational_keywords", "branded_keywords", "local_keywords"],
879:      frontendOwnerPage: "insights",
880:      destinations: ["chat-preview", "insights", "campaign-studio", "workflows"],
882:      outputTypes: ["performance_review", "wins", "risks", "experiment_recommendations"],
892:      frontendOwnerPage: "insights",
893:      destinations: ["chat-preview", "insights", "content-studio", "campaign-studio"],
895:      outputTypes: ["content_gap_report", "missing_topics", "missing_pages", "priority_actions"],
908:      frontendOwnerPage: "governance",
909:      destinations: ["chat-preview", "governance", "content-studio", "publishing"],
911:      outputTypes: ["claims_check", "risk_flags", "proof_requirements", "safe_wording_notes"],
921:      frontendOwnerPage: "governance",
922:      destinations: ["chat-preview", "governance", "content-studio"],
924:      outputTypes: ["safe_rewrite", "risk_reduced_copy", "claim_softening", "review_notes"],
934:      frontendOwnerPage: "governance",
935:      destinations: ["chat-preview", "governance", "library", "workflows"],
937:      outputTypes: ["evidence_needed", "required_proof", "recommended_proof", "optional_proof"],
947:      frontendOwnerPage: "governance",
948:      destinations: ["chat-preview", "governance", "workflows", "publishing"],
950:      outputTypes: ["gdpr_review", "consent_risks", "tracking_notes", "disclosure_requirements"],
960:      frontendOwnerPage: "governance",
961:      destinations: ["chat-preview", "governance", "publishing", "workflows"],
963:      outputTypes: ["approval_notes", "risk_summary", "reviewer_requirements", "unresolved_issues"],
968:  operations: [
976:      frontendOwnerPage: "workflows",
977:      destinations: ["chat-preview", "workflows", "task", "content-studio", "media-studio"],
978:      sourceTypes: ["current_chat", "ai_preview", "content_draft", "media_job", "manual_input"],
979:      outputTypes: ["task_plan", "owner_map", "priority_list", "dependency_notes"],
989:      frontendOwnerPage: "workflows",
990:      destinations: ["chat-preview", "workflows", "task", "handoff"],
991:      sourceTypes: ["current_chat", "handoff_summary", "operations_snapshot", "approval_notes", "manual_input"],
992:      outputTypes: ["workflow_draft", "step_sequence", "trigger_notes", "review_gates", "execution_risks"],
996:      id: "handoff",
1002:      frontendOwnerPage: "workflows",
1003:      destinations: ["chat-preview", "handoff", "workflows", "content-studio", "media-studio", "publishing", "governance"],
1004:      sourceTypes: ["current_chat", "ai_preview", "content_draft", "media_job", "publishing_package", "manual_input"],
1005:      outputTypes: ["handoff_summary", "destination_brief", "required_inputs", "review_notes"],
1006:      template: "Prepare a handoff summary for {projectName}. Include context, destination workspace, owner, required inputs, and review notes."
1015:      frontendOwnerPage: "workflows",
1016:      destinations: ["chat-preview", "workflows", "campaign-studio", "publishing"],
1018:      outputTypes: ["timeline", "milestones", "blockers", "safe_sequence"],
1028:      frontendOwnerPage: "workflows",
1029:      destinations: ["chat-preview", "workflows", "governance", "publishing"],
1031:      outputTypes: ["execution_checklist", "approval_checklist", "asset_checklist", "qa_steps"],
1044:      frontendOwnerPage: "operations-centers",
1045:      destinations: ["chat-preview", "operations-centers", "task", "governance"],
1047:      outputTypes: ["reply_draft", "empathetic_response", "next_step_note", "escalation_note"],
1057:      frontendOwnerPage: "operations-centers",
1058:      destinations: ["chat-preview", "operations-centers", "task", "workflows"],
1060:      outputTypes: ["ticket_draft", "issue_summary", "priority_note", "missing_information"],
1068:      actionType: "preview",
1070:      frontendOwnerPage: "operations-centers",
1071:      destinations: ["chat-preview", "operations-centers", "task", "workflows"],
1073:      outputTypes: ["sla_risk_review", "urgency_flags", "escalation_needs", "safe_next_actions"],
1083:      frontendOwnerPage: "operations-centers",
1084:      destinations: ["chat-preview", "operations-centers", "workflows", "sales-crm-draft"],
1086:      outputTypes: ["thread_summary", "sentiment_review", "open_questions", "response_context"],
1099:      frontendOwnerPage: "workflows",
1100:      destinations: ["chat-preview", "workflows", "content-studio", "sales-crm-draft"],
1102:      outputTypes: ["sales_pitch", "value_proposition", "pain_solution_map", "cta_note"],
1112:      frontendOwnerPage: "workflows",
1113:      destinations: ["chat-preview", "content-studio", "workflows", "sales-crm-draft"],
1115:      outputTypes: ["follow_up_email", "follow_up_sequence", "value_reminder", "next_step_prompt"],
1125:      frontendOwnerPage: "workflows",
1126:      destinations: ["chat-preview", "workflows", "content-studio", "governance"],
1128:      outputTypes: ["objection_handling", "proof_needed", "safe_answers", "next_action"],
1138:      frontendOwnerPage: "workflows",
1139:      destinations: ["chat-preview", "workflows", "operations-centers", "sales-crm-draft"],
1141:      outputTypes: ["lead_brief", "fit_summary", "opportunity_notes", "risk_notes", "outreach_recommendation"],
1148:  return TOOL_DOCK_BY_SPECIALIST[specialistId] || TOOL_DOCK_BY_SPECIALIST.operations;
1156:      ...TOOL_DOCK_BY_SPECIALIST.operations.slice(0, 2)
1168:      ...TOOL_DOCK_BY_SPECIALIST.operations.slice(0, 2)
1208:          Choose the output, source, and destination before preparing a review-only composer prompt.
1226:            <select class="mhos-tool-drawer-select" data-aicmd-tool-drawer-destination-select></select>
1283:          <p data-aicmd-tool-drawer-summary>Choose output, source, destination, language, and tone.</p>
1287:          Preparation-only: this drawer creates a composer-ready instruction. It does not publish, send, route, create CRM records, run workflows, or mutate backend data.
1318:        <span class="mhos-tool-dock-copy">Guided setup · output, source, destination, then use in composer</span>
1331:            data-aicmd-tool-dock-owner="${safe(tool.frontendOwnerPage || "ai-command")}"
1332:            data-aicmd-tool-dock-destinations="${safe(joinMetaList(getToolMetaList(tool, "destinations", ["chat-preview"])))}"
1334:            data-aicmd-tool-dock-outputs="${safe(joinMetaList(getToolMetaList(tool, "outputTypes", [tool.id || "tool_output"])))}"
1446:  const destination = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-destination-select]", "Chat preview");
1464:    `- Destination: ${destination}.`,
1484:    `Create the requested ${output.toLowerCase()} as review-ready content.`,
1503:    `Prepare the output for ${destination}, but do not send, save, route, publish, or create records automatically.`,
1506:    "- Prepare review-ready output only.",
1507:    "- Do not publish, send, route, save, overwrite, create CRM records, or run workflows.",
1521:  const destination = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-destination-select]", "Chat preview");
1530:  summaryParts.push(destination);
1568:    `Prepare ${btn.getAttribute("data-aicmd-tool-dock-label") || "this tool"} for the active project. Choose the output, source, destination, language, and tone before using it in the composer.`
1574:  const rawDestinations = btn.getAttribute("data-aicmd-tool-dock-destinations") || "";
1580:  populateDrawerSelect(drawer.querySelector("[data-aicmd-tool-drawer-destination-select]"), rawDestinations, "Choose destination");
1623:    "data-aicmd-tool-dock-owner": tool.frontendOwnerPage || tool.owner || "ai-command",
1624:    "data-aicmd-tool-dock-destinations": joinMetaList(getToolMetaList(tool, "destinations", tool.route ? [tool.route] : ["chat-preview"])),
1626:    "data-aicmd-tool-dock-outputs": joinMetaList(getToolMetaList(tool, "outputTypes", [tool.id || "tool_output"]))
1742:        updateStatus(`${label} loaded into composer from smart drawer. Review it, then ask or preview.`);
1788:        updateStatus(`${label} loaded into composer. Review it, then ask or preview.`);

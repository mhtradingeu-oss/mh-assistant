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

// ============================================================
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
		label: "Writer",
		icon: "✍️",
		summary: "Captions, hooks, scripts, emails, and landing page copy.",
		routeHint: "content-studio"
	},
	{
		id: "designer",
		label: "Designer",
		icon: "🎨",
		summary: "Visual direction, creative brief, format guidance, and brand consistency.",
		routeHint: "content-studio"
	},
	{
		id: "media",
		label: "Media Agent",
		icon: "📸",
		summary: "Image selection, video direction, asset readiness, and media strategy.",
		routeHint: "library"
	},
	{
		id: "ads",
		label: "Ads Specialist",
		icon: "📢",
		summary: "Ad concepts, targeting angles, platform copy, and paid strategy.",
		routeHint: "ads-manager"
	},
	{
		id: "analyst",
		label: "Analyst",
		icon: "📊",
		summary: "SEO, performance data, content insights, and traffic patterns.",
		routeHint: "insights"
	},
	{
		id: "researcher",
		label: "Researcher",
		icon: "🔬",
		summary: "Competitors, market trends, audience research, and positioning gaps.",
		routeHint: "research"
	},
	{
		id: "operations",
		label: "Operations",
		icon: "⚙️",
		summary: "Tasks, timelines, handoffs, approvals, and execution plans.",
		routeHint: "workflows"
	}
];

// Map legacy mode IDs from older sessions to new team IDs
const MODE_ID_ALIASES = {
	executive: "operations",
	campaign: "strategist",
	content: "writer",
	seo: "analyst",
	research: "researcher",
	video_lead: "video_lead",
	publisher: "publisher",
	compliance_reviewer: "compliance_reviewer",
	admin: "operations"
};

// ============================================================
//  PHASE 1: SPECIALIST DEFINITIONS — AI TEAM COMMAND CENTER
// ============================================================

const SPECIALIST_DEFS = [
	{
		id: "strategist",
		label: "Strategist",
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
		icon: "📤",
		summary: "Publishing readiness, schedule review, and handoff preparation.",
		placeholder: "Ask the Publisher to review publishing readiness, check scheduling, or prepare a handoff package…",
		canHelp: ["Review publishing readiness", "Check scheduled jobs", "Prepare handoff packages", "Map publishing dependencies", "Flag pre-publish risks"],
		cannotDo: ["Publish without explicit approval", "Override schedules", "Bypass governance gates", "Send to live channels directly"],
		destinations: ["Publishing", "Workflows", "AI Command"],
		safetyNote: "Publishing always requires explicit approval. No live publishing from AI guidance alone.",
		status: "Ready"
	},
	{
		id: "ads",
		label: "Ads Optimizer",
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
		icon: "⚙️",
		summary: "Tasks, timelines, handoffs, approvals, and execution plans.",
		placeholder: "Ask the Operations Lead to turn this into tasks, workflow steps, or handoffs…",
		canHelp: ["Create task plans", "Map execution sequences", "Prepare workflow handoffs", "Review execution health", "Identify operational blockers"],
		cannotDo: ["Run workflows without confirmation", "Auto-approve tasks", "Override authority gates", "Execute backend operations directly"],
		destinations: ["Workflows", "Operations Centers", "AI Command"],
		safetyNote: "Task plans and handoffs only. Workflow execution requires explicit user confirmation.",
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
	]
};

// Full Team mode suggested prompts
const TEAM_SUGGESTED_PROMPTS = [
	{ label: "What should the team focus on?", sub: "Full team priority review" },
	{ label: "Map the next launch wave", sub: "End-to-end team workflow preview" },
	{ label: "Prepare a handoff sequence", sub: "Strategy → Content → Publishing" },
	{ label: "Review team readiness", sub: "Check all specialist areas" }
];

// 4 quick-action prompts shown in the composer
const QUICK_ACTIONS = [
	{ icon: "🚀", label: "Launch Campaign", sub: "Build a campaign plan", template: "Build a launch campaign for {project}. Map the channels, offer, phases, and required assets." },
	{ icon: "✍️", label: "Generate Content", sub: "Write hooks, captions & scripts", template: "Generate content for {project}. Create hooks, caption ideas, and a reel script for the next product push." },
	{ icon: "📊", label: "Analyze Performance", sub: "Review what's working", template: "Analyze current performance for {project}. What content, campaigns, and channels are working best right now?" },
	{ icon: "🔧", label: "Fix Readiness", sub: "Close critical gaps", template: "What are the critical readiness gaps for {project} and what exactly needs to be done to fix them?" }
];

const AI_COMMAND_LOCAL_DRAFTS_KEY = "mh-ai-command-local-drafts-v1";
const AI_COMMAND_LOCAL_OUTPUTS_KEY = "mh-ai-command-local-outputs-v1";

const COMMAND_TYPES = [
	{ id: "strategy", label: "Strategy" },
	{ id: "content", label: "Content" },
	{ id: "campaign", label: "Campaign" },
	{ id: "integration", label: "Integration" },
	{ id: "asset", label: "Asset" },
	{ id: "research", label: "Research" },
	{ id: "report", label: "Report" },
	{ id: "automation", label: "Automation" }
];

const TARGET_TYPES = [
	{ id: "current-project", label: "Current project" },
	{ id: "selected-context", label: "Selected page/context" },
	{ id: "campaign", label: "Campaign" },
	{ id: "product", label: "Product" }
];

const IMPACT_CHIP_LABELS = [
	"Launch readiness",
	"Content",
	"Campaign",
	"Integrations",
	"Assets",
	"Automation"
];

const AGENT_CARDS = [
	{
		id: "strategist",
		name: "Strategist",
		purpose: "Build high-leverage decisions for launch sequencing and channel focus.",
		bestUse: "When priorities compete and you need the best next move.",
		suggestedPrompt: "Act as Strategist and propose the next campaign move based on current readiness and integrations."
	},
	{
		id: "writer",
		name: "Writer",
		purpose: "Transform strategy into high-converting copy and scripts.",
		bestUse: "When campaigns need content batches fast.",
		suggestedPrompt: "Act as Writer and generate content angles for the current project and active campaign."
	},
	{
		id: "designer",
		name: "Designer",
		purpose: "Define creative direction, visual hierarchy, and asset guidance.",
		bestUse: "When briefs need clear visual standards.",
		suggestedPrompt: "Act as Designer and propose creative directions tied to current campaign goals."
	},
	{
		id: "media",
		name: "Media Planner",
		purpose: "Align media formats with channels, cadence, and readiness.",
		bestUse: "When planning image/video requirements across channels.",
		suggestedPrompt: "Act as Media Planner and map media needs by platform for this launch cycle."
	},
	{
		id: "ads",
		name: "Ads Specialist",
		purpose: "Optimize paid opportunities, creative testing, and budget decisions.",
		bestUse: "When preparing or fixing paid performance.",
		suggestedPrompt: "Act as Ads Specialist and propose paid experiments based on current readiness and data coverage."
	},
	{
		id: "analyst",
		name: "Analyst",
		purpose: "Turn multi-channel signals into prioritized actions.",
		bestUse: "When you need evidence-backed recommendations.",
		suggestedPrompt: "Act as Analyst and summarize what is working, what is weak, and what to do next."
	},
	{
		id: "researcher",
		name: "Researcher",
		purpose: "Strengthen decisions with market, competitor, and audience insight.",
		bestUse: "When strategy needs stronger external evidence.",
		suggestedPrompt: "Act as Researcher and identify high-confidence market opportunities for this project."
	},
	{
		id: "operations",
		name: "Operations Assistant",
		purpose: "Translate intent into executable workflows and handoffs.",
		bestUse: "When actions span multiple pages and teams.",
		suggestedPrompt: "Act as Operations Assistant and convert priorities into a practical execution sequence."
	}
];

const aiSessions = new Map();
let lastRenderContext = null;
let aiCommandBridgeRegistered = false;
let aiAutoModeUnsubscribe = null;
const aiAutomationState = {
	progress: "",
	result: ""
};

function buildAutoPlanFromCommand(commandText, session) {
	function getSpecialistById(id) {
		const resolvedId = MODE_ID_ALIASES[id] || id;
		return SPECIALIST_DEFS.find((s) => s.id === resolvedId) ||
			SPECIALIST_DEFS.find((s) => s.id === "operations") ||
			SPECIALIST_DEFS[0];
	}

	function detectSpecialistFromBridgePrompt(prompt) {
		const text = asString(prompt);
		if (/act as the strategist/i.test(text)) return "strategist";
		if (/act as the content writer/i.test(text)) return "writer";
		if (/act as the media director/i.test(text)) return "media";
		if (/act as the video lead/i.test(text)) return "video_lead";
		if (/act as the publisher/i.test(text)) return "publisher";
		if (/act as the ads optimizer/i.test(text)) return "ads";
		if (/act as the seo|act as the insights analyst/i.test(text)) return "analyst";
		if (/act as the compliance reviewer/i.test(text)) return "compliance_reviewer";
		if (/act as the operations lead/i.test(text)) return "operations";
		// Fallback: use keyword scoring from existing classifyIntent
		const classified = classifyIntent(text, null);
		if (classified.resolvedModeId && classified.resolvedModeId !== "operations") {
			return classified.resolvedModeId;
		}
		return null;
	}

	const command = humanizeValue(commandText || session?.draftMessage, "Prepare workflow action from AI command.");
	const plan = [
		{
			id: `auto-generate-${Date.now()}`,
			type: "generate_prompt",
			targetPage: "ai-command",
			action: "Generate prompt from AI command",
			payload: {
				prompt: command,
				title: "AI command auto plan"
			},
			priority: "recommended"
		},
		{
			id: `auto-workflow-${Date.now()}`,
			type: "prepare_workflow",
			targetPage: "workflows",
			action: "Prepare workflow from AI command",
			payload: {
				prompt: command,
				reason: "AI command prepared for workflow execution."
			},
			priority: "recommended"
		}
	];

	if (/publish\s*now|send\s*external|paid\s*ads|final\s*approval/i.test(command)) {
		plan.push({
			id: `auto-gated-${Date.now()}`,
			type: "publish_now",
			targetPage: "publishing",
			action: "Publish now to external channels",
			payload: {
				prompt: command,
				reason: "Requires approval gate before external publishing actions."
			},
			priority: "critical"
		});
	}

	return plan;
}

function detectSpecialistFromBridgePrompt(prompt) {
	const text = asString(prompt);
	if (/act as the strategist/i.test(text)) return "strategist";
	if (/act as the content writer/i.test(text)) return "writer";
	if (/act as the media director/i.test(text)) return "media";
	if (/act as the video lead/i.test(text)) return "video_lead";
	if (/act as the publisher/i.test(text)) return "publisher";
	if (/act as the ads optimizer|act as the ads operator/i.test(text)) return "ads";
	if (/act as the seo|act as the insights analyst/i.test(text)) return "analyst";
	if (/act as the compliance reviewer/i.test(text)) return "compliance_reviewer";
	if (/act as the operations lead/i.test(text)) return "operations";
	const classified = classifyIntent(text, null);
	if (classified.resolvedModeId && classified.resolvedModeId !== "operations") {
		return classified.resolvedModeId;
	}
	return null;
}

// ============================================================
//  HELPERS
// ============================================================

function asArray(value) {
	return Array.isArray(value) ? value : [];
}

function asObject(value) {
	return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function asString(value) {
	if (value == null) return "";
	return String(value);
}

function humanizeValue(value, fallback = "") {
	if (value == null) return fallback;
	if (typeof value === "string") {
		const clean = value.trim();
		return clean === "[object Object]" ? fallback : clean;
	}
	if (typeof value === "number" || typeof value === "boolean") {
		return String(value);
	}
	if (Array.isArray(value)) {
		return value.map((item) => humanizeValue(item)).filter(Boolean).join("; ") || fallback;
	}
	if (typeof value === "object") {
		const title = humanizeValue(value.title || value.label || value.name || value.headline || value.hook);
		const detail = humanizeValue(
			value.action ||
			value.summary ||
			value.description ||
			value.recommendation ||
			value.reason ||
			value.insight ||
			value.body ||
			value.text ||
			value.value
		);
		if (title && detail && title !== detail) return `${title}: ${detail}`;
		if (title || detail) return title || detail;
		return Object.entries(value)
			.filter(([, item]) => item != null && typeof item !== "object")
			.slice(0, 4)
			.map(([key, item]) => `${titleCase(key)}: ${humanizeValue(item)}`)
			.filter(Boolean)
			.join("; ") || fallback;
	}
	return fallback;
}

function normalizeDisplayList(value, limit = 8) {
	return asArray(value)
		.map((item) => humanizeValue(item))
		.filter(Boolean)
		.slice(0, limit);
}

function toNumber(value, fallback = null) {
	if (value == null || value === "") return fallback;
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : fallback;
}

function nowIso() {
	return new Date().toISOString();
}

function isMissingIntelligenceError(error) {
	const status = Number(error?.status);
	if (status !== 404) return false;
	const message = asString(error?.message).toLowerCase();
	return message.includes("insights") || message.includes("learning") || message.includes("not found");
}

function formatTime(value) {
	const date = value ? new Date(value) : new Date();
	if (Number.isNaN(date.getTime())) return "-";
	return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function titleCase(value) {
	return asString(value)
		.replace(/[_-]+/g, " ")
		.replace(/\b\w/g, (match) => match.toUpperCase());
}

function formatCompactNumber(value) {
	const parsed = Number(value);
	if (!Number.isFinite(parsed)) return "--";
	return new Intl.NumberFormat(undefined, {
		notation: "compact",
		maximumFractionDigits: 1
	}).format(parsed);
}

function formatCurrency(value, currency = "USD") {
	const parsed = Number(value);
	if (!Number.isFinite(parsed)) return "--";
	try {
		return new Intl.NumberFormat(undefined, {
			style: "currency",
			currency: currency || "USD",
			maximumFractionDigits: 0
		}).format(parsed);
	} catch (_) {
		return `${currency || "USD"} ${Math.round(parsed)}`;
	}
}

function getModeMeta(id) {
	const resolvedId = MODE_ID_ALIASES[id] || id;
	return MODE_DEFS.find((item) => item.id === resolvedId) || MODE_DEFS[0];
}

function extractTopMessage(item = {}) {
	return asString(item.label || item.title || item.page || item.query || item.campaign_name || item.name);
}

// ============================================================
//  SESSION
// ============================================================

function ensureSession(projectName) {
	const key = projectName || "__default__";
	if (!aiSessions.has(key)) {
		aiSessions.set(key, {
			modeId: "operations",
			teamMode: "solo",
			draftMessage: "",
			commandType: "strategy",
			targetType: "current-project",
			targetValue: "",
			draftStatus: "",
			validationMessage: "",
			localDraftLoaded: false,
			taskMode: "free",
			taskType: "launch",
			taskProduct: "",
			taskChannel: "",
			messages: [],
			history: [],
			intelligence: {
				project: key,
				status: "idle",
				dashboard: null,
				insights: null,
				learning: null,
				error: "",
				loadedAt: "",
				loadingPromise: null
			},
			lastAppliedHandoffId: ""
			,
			outputPreview: null
		});
	}
	return aiSessions.get(key);
}

function readLocalDraftMap() {
	if (typeof window === "undefined") return {};
	try {
		const raw = window.localStorage?.getItem(AI_COMMAND_LOCAL_DRAFTS_KEY) || "{}";
		const parsed = JSON.parse(raw);
		return parsed && typeof parsed === "object" ? parsed : {};
	} catch (_) {
		return {};
	}
}

function writeLocalDraftMap(map) {
	if (typeof window === "undefined") return;
	try {
		window.localStorage?.setItem(AI_COMMAND_LOCAL_DRAFTS_KEY, JSON.stringify(map || {}));
	} catch (_) {}
}

function loadLocalDraft(projectName) {
	const key = projectName || "__default__";
	return asObject(readLocalDraftMap()[key]);
}

function saveLocalDraft(projectName, draftPayload) {
	const key = projectName || "__default__";
	const map = readLocalDraftMap();
	map[key] = {
		...asObject(map[key]),
		...asObject(draftPayload),
		updatedAt: nowIso()
	};
	writeLocalDraftMap(map);
	return map[key];
}

function hydrateSessionDraft(projectName, session) {
	if (session.localDraftLoaded) return;
	const localDraft = loadLocalDraft(projectName);
	if (localDraft.prompt) session.draftMessage = asString(localDraft.prompt);
	if (localDraft.modeId) session.modeId = asString(localDraft.modeId);
	if (localDraft.commandType) session.commandType = asString(localDraft.commandType);
	if (localDraft.targetType) session.targetType = asString(localDraft.targetType);
	if (localDraft.targetValue) session.targetValue = asString(localDraft.targetValue);
	if (localDraft.prompt || localDraft.updatedAt) {
		session.draftStatus = `Draft restored ${formatTime(localDraft.updatedAt)}`;
	}
	session.localDraftLoaded = true;
}

function persistSessionDraft(projectName, session, hint) {
	const saved = saveLocalDraft(projectName, {
		prompt: session.draftMessage,
		modeId: session.modeId,
		commandType: session.commandType,
		targetType: session.targetType,
		targetValue: session.targetValue
	});
	session.draftStatus = hint || `Saved locally ${formatTime(saved.updatedAt)}`;
}

function readLocalOutputMap() {
	if (typeof window === "undefined") return {};
	try {
		const raw = window.localStorage?.getItem(AI_COMMAND_LOCAL_OUTPUTS_KEY) || "{}";
		const parsed = JSON.parse(raw);
		return parsed && typeof parsed === "object" ? parsed : {};
	} catch (_) {
		return {};
	}
}

function writeLocalOutputMap(map) {
	if (typeof window === "undefined") return;
	try {
		window.localStorage?.setItem(AI_COMMAND_LOCAL_OUTPUTS_KEY, JSON.stringify(map || {}));
	} catch (_) {}
}

function loadLocalOutput(projectName) {
	const key = projectName || "__default__";
	return asObject(readLocalOutputMap()[key]);
}

function saveLocalOutput(projectName, outputPayload) {
	const key = projectName || "__default__";
	const map = readLocalOutputMap();
	map[key] = {
		...asObject(map[key]),
		...asObject(outputPayload),
		updatedAt: nowIso()
	};
	writeLocalOutputMap(map);
	return map[key];
}

function destinationRouteForSpecialist(specialistId, outputType) {
	const id = asString(specialistId || "operations");
	if (outputType === "workflow") return "workflows";
	if (id === "strategist") return outputType === "task" ? "campaign-studio" : "workflows";
	if (id === "writer") return "content-studio";
	if (id === "media") return "media-studio";
	if (id === "video_lead") return "media-studio";
	if (id === "publisher") return "publishing";
	if (id === "ads") return "ads-manager";
	if (id === "analyst") return "insights";
	if (id === "compliance_reviewer") return "governance";
	if (id === "operations") return outputType === "task" ? "task-center" : "workflows";
	return "workflows";
}

function routeLabel(route) {
	const labels = {
		"campaign-studio": "Campaign Studio",
		"content-studio": "Content Studio",
		"media-studio": "Media Studio",
		publishing: "Publishing",
		"ads-manager": "Ads Manager",
		insights: "Insights",
		governance: "Governance",
		"task-center": "Task Center",
		workflows: "Workflows"
	};
	return labels[route] || titleCase(route);
}

function specialistTemplateForOutput({ specialist, outputType, prompt, projectName }) {
	const cleanPrompt = asString(prompt).trim();
	const promptSnippet = cleanPrompt || `Project request for ${projectName || "current project"}`;
	const specialistId = asString(specialist?.id || "operations");
	const route = destinationRouteForSpecialist(specialistId, outputType);

	const base = {
		specialistId,
		outputType,
		title: "Draft output",
		summary: "Guidance prepared for review.",
		bullets: [],
		steps: [],
		destinationRoute: route,
		confirmationRequired: outputType === "handoff" || specialistId === "publisher" || specialistId === "compliance_reviewer",
		generatedAt: nowIso(),
		sourcePrompt: promptSnippet,
		status: "draft_preview",
		safetyLabel: "Guidance and draft only. No backend execution.",
		nextSafeAction: `Review in ${routeLabel(route)}`,
		confirmationNote: "Execution, approvals, and publishing require explicit confirmation in destination workspaces."
	};

	if (specialistId === "strategist") {
		if (outputType === "task") {
			return {
				...base,
				title: `Task Draft: Strategic plan for ${projectName || "current project"}`,
				summary: "Strategic task draft prepared with priorities, blockers, and operating sequence.",
				steps: [
					"Define top 3 strategic priorities for this cycle",
					"List blockers and dependency owners",
					"Map next operating move by channel",
					"Route execution draft to Campaign Studio or Workflows"
				],
				nextSafeAction: "Review and refine the task draft before creating durable tasks"
			};
		}
		return {
			...base,
			title: `Strategist Guidance: Next operating move`,
			summary: `Priority guidance prepared from: ${promptSnippet}`,
			bullets: [
				"Strategic priorities aligned to current readiness",
				"Key blockers and risk dependencies identified",
				"Next operating move drafted with destination routing"
			]
		};
	}

	if (specialistId === "writer") {
		return {
			...base,
			title: outputType === "task" ? "Task Draft: Draft campaign copy" : "Content Guidance: Messaging draft",
			summary: "Content draft prepared with hooks, captions, CTA flow, and review checkpoint.",
			steps: [
				"Draft 3 hook variants",
				"Draft captions with CTA",
				"Prepare review notes and claims check",
				"Route to Content Studio for refinement"
			],
			safetyLabel: "Claims require review before publishing. No direct publish action."
		};
	}

	if (specialistId === "media") {
		return {
			...base,
			outputType: outputType === "guidance" ? "media_brief" : outputType,
			title: "Media Brief: Visual direction draft",
			summary: "Media brief prepared with visual direction, prompt ideas, and required assets.",
			bullets: [
				"Visual direction and brand constraints summarized",
				"Prompt ideas prepared for image/video planning",
				"Required assets and missing assets listed"
			],
			safetyLabel: "No media generation executed. Brief and routing only.",
			nextSafeAction: "Open Media Studio to review and refine the brief"
		};
	}

	if (specialistId === "video_lead") {
		return {
			...base,
			title: outputType === "task" ? "Task Draft: Video production plan" : "Video Brief: Hook, script, storyboard",
			summary: "Video draft prepared with hook, script structure, and storyboard flow.",
			steps: [
				"Draft opening hook and audience angle",
				"Write short-form script outline",
				"Outline storyboard beats",
				"Route to Media Studio for production planning"
			],
			safetyLabel: "Video generation requires configured provider or GPU worker; no execution started."
		};
	}

	if (specialistId === "publisher") {
		return {
			...base,
			title: outputType === "handoff" ? "Handoff Preview: Publishing package" : "Publishing Draft: Readiness checklist",
			summary: "Publishing checklist and schedule draft prepared.",
			steps: [
				"Validate asset and copy readiness",
				"Draft publish schedule by channel",
				"Flag approval dependencies",
				"Prepare handoff for publishing review"
			],
			confirmationRequired: true,
			safetyLabel: "Confirmation required before publish. No publish action performed."
		};
	}

	if (specialistId === "ads") {
		return {
			...base,
			title: outputType === "task" ? "Task Draft: Paid test plan" : "Ads Draft: Angles and tests",
			summary: "Ad angle and audience testing draft prepared for review.",
			bullets: [
				"Primary ad angle draft",
				"Audience/testing suggestions",
				"Platform-specific copy recommendations"
			],
			safetyLabel: "No budget updates or ad launches executed."
		};
	}

	if (specialistId === "analyst") {
		return {
			...base,
			title: outputType === "task" ? "Task Draft: Analysis plan" : "Insights Guidance: Signal review",
			summary: "Analysis plan prepared with key signals, coverage gaps, and next checks.",
			bullets: [
				"Signals to check: readiness, channel performance, data coverage",
				"Coverage gaps mapped for follow-up",
				"Recommendations prepared for Insights workspace"
			],
			safetyLabel: "No analytics mutation or fake metrics. Guidance only."
		};
	}

	if (specialistId === "compliance_reviewer") {
		return {
			...base,
			title: "Compliance Draft: Risk review checklist",
			summary: "Risk review checklist prepared with claims and safety review points.",
			steps: [
				"Review key claims and evidence",
				"Flag safety and policy risks",
				"Prepare governance notes",
				"Route to Governance for formal review"
			],
			confirmationRequired: true,
			safetyLabel: "Compliance review is advisory. Formal approval remains human-governed."
		};
	}

	if (specialistId === "operations") {
		if (outputType === "workflow") {
			return {
				...base,
				title: "Workflow Draft: Operating sequence",
				summary: "Workflow draft prepared with stage owners and checkpoints.",
				steps: [
					"Stage 1: Intake and objective alignment",
					"Stage 2: Specialist draft production",
					"Stage 3: Compliance/review gate",
					"Stage 4: Destination handoff and confirmation"
				],
				safetyLabel: "Workflow run is not started. This is a draft preview only."
			};
		}
		return {
			...base,
			title: outputType === "handoff" ? "Handoff Preview: Operations package" : "Operations Draft: Task and handoff plan",
			summary: "Operational plan drafted with next tasks, owners, and route.",
			steps: [
				"Define immediate tasks",
				"Assign suggested owners",
				"Prepare destination handoff context",
				"Review before creating durable records"
			],
			safetyLabel: "No workflow run and no backend task creation executed."
		};
	}

	return base;
}

function buildPhase2OutputPreview({ intent, session, prompt, projectName }) {
	const teamMode = session.teamMode === "team";
	const specialist = teamMode
		? { id: "operations", label: "Full Team" }
		: getPhase1SpecialistById(session.modeId);

	const intentToType = {
		guidance: "guidance",
		task: "task",
		workflow: "workflow",
		handoff: "handoff"
	};
	const outputType = intentToType[intent] || "guidance";

	const base = specialistTemplateForOutput({
		specialist,
		outputType,
		prompt,
		projectName
	});

	if (!teamMode) return base;

	return {
		...base,
		specialistId: "team",
		title: outputType === "workflow" ? "Team Workflow Draft" : `Team ${titleCase(outputType)} Preview`,
		summary: `Full team ${outputType.replace("_", " ")} preview prepared for ${projectName || "current project"}.`,
		bullets: [
			"Strategist defines priorities and sequence",
			"Writer and Media prepare production-ready drafts",
			"Compliance and Publisher verify release safety"
		],
		destinationRoute: outputType === "task" ? "task-center" : "workflows",
		nextSafeAction: "Review team draft and route to destination workspace"
	};
}

function formatOutputTypeLabel(outputType) {
	const labels = {
		guidance: "Guidance",
		task: "Task Draft",
		workflow: "Workflow Draft",
		handoff: "Handoff Preview",
		media_brief: "Media Brief"
	};
	return labels[outputType] || titleCase(outputType || "guidance");
}

function buildPreviewText(output, specialistLabel) {
	if (!output) return "";
	const lines = [
		`Output Type: ${formatOutputTypeLabel(output.outputType)}`,
		`Specialist: ${specialistLabel}`,
		`Status: ${humanizeValue(output.status, "draft_preview")}`,
		`Title: ${humanizeValue(output.title)}`,
		`Summary: ${humanizeValue(output.summary)}`,
		"",
		`Source Prompt: ${humanizeValue(output.sourcePrompt)}`,
		""
	];

	normalizeDisplayList(output.bullets, 12).forEach((item) => lines.push(`- ${item}`));
	normalizeDisplayList(output.steps, 12).forEach((item, idx) => lines.push(`${idx + 1}. ${item}`));

	lines.push("");
	lines.push(`Destination: ${routeLabel(output.destinationRoute)}`);
	lines.push(`Safety: ${humanizeValue(output.safetyLabel)}`);
	lines.push(`Confirmation: ${output.confirmationRequired ? "Required before execution" : "Required for execution actions"}`);
	return lines.join("\n");
}

function isProviderLikelyConfigured(aiContext) {
	const records = asObject(aiContext?.controlCenter?.records);
	return Object.values(records).some((record) => {
		const integrationId = asString(record?.integration_id || record?.id).toLowerCase();
		const status = asString(record?.status || record?.status_label).toLowerCase();
		const providerMatch = /openai|replicate|stability|runway|elevenlabs|anthropic/.test(integrationId);
		const readyState = /connected|healthy|ready|active|ok/.test(status);
		return providerMatch && readyState;
	});
}

// ============================================================
//  UNIFIED AI CONTEXT
// ============================================================

function buildUnifiedAiContext(state, intelligence) {
	const overviewBlock = asObject(state.data.overview);
	const overview = asObject(overviewBlock.overview);
	const readiness = asObject(state.data.readiness);
	const readinessDashboard = asObject(readiness.dashboard);
	const connectors = asObject(state.data.integrations);
	const controlCenter = asObject(connectors.control_center);
	const activity = asObject(state.data.activity);
	const assets = asObject(state.data.assets);
	const assetCategories = getCategoryReadinessList(assets);

	const insights =
		asObject(intelligence?.insights) ||
		asObject(activity.insights) ||
		asObject(activity.marketing_insights) ||
		asObject(activity.performance_insights);
	const learning =
		asObject(intelligence?.learning) ||
		asObject(activity.learning);

	const coverage = asObject(insights.data_coverage);
	const coverageEntries = Object.entries(coverage);
	const coveredCount = coverageEntries.filter(([, item]) => asString(item?.status) === "covered").length;
	const recommendations = asArray(learning.recommendations || insights.recommendations);
	const nextBestActions = asArray(overviewBlock.next_best_actions || readinessDashboard.next_best_actions);
	const criticalGaps = asArray(readinessDashboard.priorities?.critical || readiness.priorities?.critical);
	const importantGaps = asArray(readinessDashboard.priorities?.important || readiness.priorities?.important);
	const missingIntegrations = [];

	coverageEntries.forEach(([key, item]) => {
		if (asString(item?.status) !== "covered") {
			missingIntegrations.push({
				label: titleCase(key),
				status: asString(item?.status) || "missing",
				integrations: asArray(item?.integrations)
			});
		}
	});

	const connectorIssues = Object.values(asObject(controlCenter.records))
		.filter((record) => ["error", "token_expired", "partial"].includes(asString(record?.status)))
		.map((record) => ({
			label: titleCase(record.integration_id),
			status: record.status_label || record.status,
			reason: record.health_summary || record.last_error
		}));

	return {
		projectName: state.context.currentProject || "",
		market: state.context.currentMarket || overview.market || "",
		language: state.context.currentLanguage || overview.language || "",
		campaign: state.context.activeCampaign || "Not selected",
		executionMode: state.context.executionMode || overview.execution_mode || "",
		currency: overview.currency || "USD",
		readinessScore: toNumber(readinessDashboard.readiness_score ?? overview.readiness_score),
		readinessStatus: asString(readinessDashboard.readiness_status || overview.readiness_status || "unknown"),
		nextBestActions,
		criticalGaps,
		importantGaps,
		missingIntegrations,
		connectorIssues,
		integrationSummary: asObject(controlCenter.summary),
		coveredCount,
		coverageTotal: coverageEntries.length,
		coverage,
		overview,
		readiness,
		readinessDashboard,
		connectors,
		controlCenter,
		assets,
		assetCategories,
		approvedAssets: assetCategories
			.filter((item) => item.status === "Approved")
			.flatMap((item) => asArray(item.approved_assets).map((assetId) => ({
				asset_id: assetId,
				asset_type: item.asset_type,
				label: item.display_label || item.label || item.asset_type
			}))),
		assetBlockers: assetCategories
			.filter((item) => item.blocker || ["Missing", "Needs Review"].includes(item.status))
			.map((item) => ({
				asset_type: item.asset_type,
				label: item.display_label || item.label || item.asset_type,
				status: item.status
			})),
		activity,
		insights,
		learning,
		recommendations,
		topContent: asArray(insights.best_performing_content),
		weakContent: asArray(insights.underperforming_content),
		website: asObject(insights.website),
		seo: asObject(insights.seo),
		paid: asObject(insights.paid),
		social: asObject(insights.social),
		learningPatterns: asObject(learning.learning_patterns || insights.learning_patterns),
		aiRecommendations: asObject(learning.ai_recommendations || insights.ai_recommendations),
		sourceSummary: asObject(insights.source_summary || learning.source_summary),
		hasLiveIntelligence:
			Boolean(Object.keys(insights).length) ||
			Boolean(Object.keys(learning).length)
	};
}

// ============================================================
//  INTENT CLASSIFICATION
// ============================================================

function scoreMode(text, modeId) {
	const query = asString(text).toLowerCase();
	const keywordMap = {
		strategist: ["campaign", "launch campaign", "campaign plan", "marketing campaign", "market entry", "growth plan", "offer strategy", "launch plan"],
		writer: ["content", "post", "caption", "blog", "script", "email", "landing page section", "reel script", "copy", "write", "hooks"],
		designer: ["design", "visual", "creative brief", "format", "brand", "layout", "image direction", "creative direction"],
		media: ["media", "image", "video", "photo", "asset", "library", "gallery", "footage", "visual assets"],
		ads: ["ad ideas", "ad copy", "facebook ads", "meta ads", "tiktok ads", "google ads", "cta", "paid", "targeting angle", "ad creative"],
		analyst: ["seo", "keyword", "keywords", "query", "search", "meta", "blog topic", "search intent", "ranking", "analytics", "performance", "traffic", "insights", "metrics"],
		researcher: ["research", "market trend", "market research", "audience research", "competitor", "positioning gap", "validate", "competitive"],
		operations: ["task plan", "workflow", "handoff", "approval", "timeline", "execution plan", "route", "publish", "status", "priority", "priorities", "blocking", "blocker", "readiness", "next", "do next"]
	};
	return asArray(keywordMap[modeId]).reduce((total, keyword) => {
		return total + (query.includes(keyword) ? 1 : 0);
	}, 0);
}

function classifyIntent(message, selectedModeId) {
	const scores = MODE_DEFS.map((mode) => ({
		modeId: mode.id,
		score: scoreMode(message, mode.id) + (mode.id === selectedModeId ? 0.75 : 0)
	}));
	scores.sort((a, b) => b.score - a.score);
	const top = scores[0] || { modeId: selectedModeId || "operations" };
	const query = asString(message).toLowerCase();
	const actionRouting = /launch|build|reconnect|connect|improve|create|fix|route|plan|publish/.test(query);
	return {
		selectedModeId,
		resolvedModeId: top.modeId || selectedModeId || "operations",
		actionRouting
	};
}

function routeSuggestion(label, route, reason) {
	return { label, route, reason };
}

function normalizeActionLabel(item) {
	return titleCase(asString(item).replace(/^connector:/, "").replace(/^asset:/, ""));
}

// ============================================================
//  RESPONSE BUILDERS
// ============================================================

function buildMissingDataNotes(aiContext, lane) {
	const notes = [];
	const coverage = aiContext.coverage;
	if (!Object.keys(coverage).length) {
		notes.push("Load project insights to unlock live intelligence guidance.");
		return notes;
	}
	if (lane === "content" && asString(coverage.social_insights?.status) !== "covered") {
		notes.push("Sync social feeds to learn from real post performance.");
	}
	if (lane === "seo" && asString(coverage.seo_search_console?.status) !== "covered") {
		notes.push("Search Console not synced — SEO guidance is limited.");
	}
	if (lane === "ads" && asString(coverage.paid_ads?.status) !== "covered") {
		notes.push("Paid platform reporting not connected — ROAS guidance is limited.");
	}
	return notes;
}

function buildExecutiveResponse(aiContext) {
	const topRecommendation = aiContext.recommendations[0];
	const summaryParts = [];
	if (aiContext.readinessScore != null) summaryParts.push(`Readiness is ${aiContext.readinessScore}/100 (${aiContext.readinessStatus || "in progress"}).`);
	if (aiContext.criticalGaps.length) summaryParts.push(`${aiContext.criticalGaps.length} critical gaps are open.`);
	if (aiContext.recommendations.length) summaryParts.push(`${aiContext.recommendations.length} recommendations available.`);
	return {
		title: "Project status briefing",
		summary: summaryParts.join(" ") || "Project is loaded. Complete integrations to unlock stronger AI guidance.",
		findings: [
			aiContext.criticalGaps.length ? `Critical gaps: ${aiContext.criticalGaps.slice(0, 4).map(normalizeActionLabel).join(", ")}.` : "No critical readiness gaps flagged.",
			aiContext.missingIntegrations.length ? `Missing intelligence: ${aiContext.missingIntegrations.slice(0, 4).map((item) => item.label).join(", ")}.` : "Intelligence coverage is solid.",
			topRecommendation ? `Top recommendation: ${topRecommendation.title}.` : "No recommendation stack yet."
		],
		recommendations: [
			topRecommendation ? `${topRecommendation.title}: ${topRecommendation.action}` : "Connect missing integrations to produce better recommendations.",
			...aiContext.recommendations.slice(1, 3).map((item) => `${item.title}: ${item.action}`)
		].filter(Boolean),
		nextActions: [
			...aiContext.nextBestActions.slice(0, 4).map((item) => `Resolve ${normalizeActionLabel(item)}.`),
			...(aiContext.connectorIssues[0] ? [`Fix ${aiContext.connectorIssues[0].label}: ${aiContext.connectorIssues[0].reason}.`] : [])
		],
		routeSuggestions: [
			routeSuggestion("Setup", "setup", "Close missing project basics, goals, and audience inputs."),
			routeSuggestion("Integrations", "integrations", "Reconnect data sources and improve intelligence coverage."),
			routeSuggestion("Insights", "insights", "Review performance signals and the recommendation stack.")
		],
		missingData: buildMissingDataNotes(aiContext, "executive")
	};
}

function buildContentResponse(aiContext) {
	const top = aiContext.topContent[0];
	const weak = aiContext.weakContent[0];
	const bestFormat = aiContext.learningPatterns.best_formats?.label;
	const bestPlatform = aiContext.learningPatterns.best_platforms?.label;
	return {
		title: "Content intelligence briefing",
		summary: top
			? `${extractTopMessage(top)} is the strongest measured content item right now${top.platform ? ` on ${titleCase(top.platform)}` : ""}.`
			: "Not enough post-level data yet to rank content winners.",
		findings: [
			top ? `Top performer: ${extractTopMessage(top)} with ${formatCompactNumber(top.engagement ?? top.reach)} signal.` : "No top post measured yet.",
			weak ? `Weakest item: ${extractTopMessage(weak)}.` : "No weak content list yet.",
			bestFormat && bestFormat !== "No format pattern yet" ? `Best format: ${bestFormat}.` : "No format pattern emerged yet.",
			bestPlatform && bestPlatform !== "No platform pattern yet" ? `Best platform: ${bestPlatform}.` : "No clear platform winner yet."
		].filter(Boolean),
		recommendations: [
			top ? `Reuse the pattern from ${extractTopMessage(top)} in the next publishing cycle.` : "Sync social insights to identify winning hooks and formats.",
			weak ? `Rewrite ${extractTopMessage(weak)} with a stronger hook and better platform fit.` : null,
			bestFormat && bestFormat !== "No format pattern yet" ? `Double down on ${bestFormat} while testing one variation.` : null
		].filter(Boolean),
		nextActions: [
			top ? `Create a follow-up asset using ${extractTopMessage(top)}'s pattern.` : "Load social insight data before expanding content queue.",
			weak ? `Move ${extractTopMessage(weak)} into a rewrite workflow.` : "Audit current content for posts not converting attention to clicks.",
			"Prepare next batch with performance-led hooks instead of generic posting volume."
		],
		routeSuggestions: [
			routeSuggestion("Content Studio", "content-studio", "Rewrite weak posts and turn winning patterns into new drafts."),
			routeSuggestion("Publishing", "publishing", "Schedule the next batch with stronger timing and approval control."),
			routeSuggestion("Insights", "insights", "Compare top and weak content performance.")
		],
		missingData: buildMissingDataNotes(aiContext, "content")
	};
}

function buildSeoResponse(aiContext) {
	const seo = aiContext.seo;
	const website = aiContext.website;
	const topQuery = asArray(seo.top_queries)[0];
	const lowCtr = asArray(seo.low_ctr_pages)[0];
	const weakPage = asArray(website.weak_pages)[0];
	return {
		title: "SEO & traffic briefing",
		summary: seo.summary?.impressions != null
			? `${formatCompactNumber(seo.summary.impressions)} impressions tracked. SEO lane is ready for prioritization.`
			: "SEO visibility not live — connect Search Console to unlock guidance.",
		findings: [
			topQuery ? `Top query: ${extractTopMessage(topQuery)} with ${formatCompactNumber(topQuery.clicks)} clicks.` : "No top query data yet.",
			lowCtr ? `CTR opportunity: ${extractTopMessage(lowCtr)} has visibility but weak click-through.` : "No low-CTR list yet.",
			weakPage ? `Weak landing page: ${extractTopMessage(weakPage)}.` : "No weak page signal yet.",
			website.summary?.sessions != null ? `Website traffic: ${formatCompactNumber(website.summary.sessions)} sessions tracked.` : "Website sessions not measured yet."
		],
		recommendations: [
			lowCtr ? `Improve title and SERP message for ${extractTopMessage(lowCtr)}.` : "Connect Search Console to unlock CTR analysis.",
			weakPage ? `Tighten intent match and CTA on ${extractTopMessage(weakPage)}.` : "Review page titles and meta descriptions on priority pages.",
			aiContext.recommendations.find((item) => item.domain === "seo")?.action || ""
		].filter(Boolean),
		nextActions: [
			topQuery ? `Expand content around ${extractTopMessage(topQuery)}.` : "Reconnect Search Console before making SEO roadmap decisions.",
			lowCtr ? `Rewrite metadata for ${extractTopMessage(lowCtr)}.` : "Audit page titles on highest-priority pages.",
			"Review top landing pages for stronger offer clarity and conversion flow."
		],
		routeSuggestions: [
			routeSuggestion("Insights", "insights", "Review search and website performance together."),
			routeSuggestion("Integrations", "integrations", "Reconnect GA4 or Search Console."),
			routeSuggestion("Setup", "setup", "Refine positioning if traffic signal is weak or misaligned.")
		],
		missingData: buildMissingDataNotes(aiContext, "seo")
	};
}

function buildAdsResponse(aiContext) {
	const paid = aiContext.paid;
	const bestCampaign = asArray(paid.best_campaigns)[0];
	const weakCampaign = asArray(paid.weak_campaigns)[0];
	const bestCreative = asArray(paid.best_creatives)[0];
	return {
		title: "Paid performance briefing",
		summary: paid.summary?.spend != null
			? `Paid media live with ${formatCurrency(paid.summary.spend, aiContext.currency)} tracked spend.`
			: "Paid reporting not connected — connect Meta Ads, Google Ads, or TikTok Ads.",
		findings: [
			bestCampaign ? `Best campaign: ${extractTopMessage(bestCampaign)}.` : "No winning campaign measured yet.",
			weakCampaign ? `Weak campaign: ${extractTopMessage(weakCampaign)}.` : "No weak campaign list yet.",
			bestCreative ? `Best creative: ${extractTopMessage(bestCreative)}.` : "No creative breakdown yet.",
			paid.summary?.roas != null ? `Current ROAS: ${Number(paid.summary.roas).toFixed(2)}x.` : "ROAS not available yet."
		],
		recommendations: [
			bestCampaign ? `Scale ${extractTopMessage(bestCampaign)} only after validating strong CTR and ROAS.` : "Connect paid platforms before making scale decisions.",
			weakCampaign ? `Pause or refresh ${extractTopMessage(weakCampaign)} if weak pattern continues.` : null,
			aiContext.recommendations.find((item) => item.domain === "paid")?.action || ""
		].filter(Boolean),
		nextActions: [
			bestCreative ? `Reuse the creative pattern behind ${extractTopMessage(bestCreative)}.` : "Sync paid data before scaling any creative.",
			weakCampaign ? `Rebuild hook and CTA for ${extractTopMessage(weakCampaign)}.` : "Audit campaign naming and creative mapping.",
			"Tie paid decisions to conversion and revenue signal — not just clicks."
		],
		routeSuggestions: [
			routeSuggestion("Ads Manager", "ads-manager", "Review pacing, creative mapping, and paid operating view."),
			routeSuggestion("Integrations", "integrations", "Connect or reconnect paid reporting platforms."),
			routeSuggestion("Insights", "insights", "Compare paid vs organic and website results.")
		],
		missingData: buildMissingDataNotes(aiContext, "ads")
	};
}

function buildResearchResponse(aiContext) {
	return {
		title: "Research & evidence briefing",
		summary: "The system has enough operating context to highlight where better evidence would improve decision quality.",
		findings: [
			aiContext.missingIntegrations.length ? `Missing intelligence: ${aiContext.missingIntegrations.map((item) => item.label).join(", ")}.` : "Main intelligence lanes are structurally connected.",
			aiContext.criticalGaps.length ? `Critical gaps affecting research quality: ${aiContext.criticalGaps.slice(0, 4).map(normalizeActionLabel).join(", ")}.` : "No major setup gaps blocking research quality.",
			aiContext.learningPatterns.best_topics?.label ? `Current system learning: ${aiContext.learningPatterns.best_topics.label}.` : "Learning engine needs more live data."
		].filter(Boolean),
		recommendations: [
			"Use the missing intelligence list as the research roadmap for what the system cannot see clearly.",
			"Validate audience-language fit and offer clarity before expanding execution volume.",
			"Prioritize integrations that unlock attribution and performance evidence over vanity metrics."
		],
		nextActions: [
			"Review Setup and tighten goals, audience, competitor, and market assumptions.",
			"Reconnect missing analytics, SEO, and paid feeds to improve evidence quality.",
			"Use Insights to identify where the recommendation stack is still blind."
		],
		routeSuggestions: [
			routeSuggestion("Setup", "setup", "Strengthen project assumptions, goals, and audience context."),
			routeSuggestion("Integrations", "integrations", "Increase data coverage and reduce blind spots."),
			routeSuggestion("Insights", "insights", "See where evidence is strong and where it is thin.")
		],
		missingData: [
			...buildMissingDataNotes(aiContext, "seo"),
			...buildMissingDataNotes(aiContext, "ads"),
			...buildMissingDataNotes(aiContext, "content")
		]
	};
}

function buildOperationsTaskBlock(aiContext, message) {
	const query = asString(message).toLowerCase();
	if (/launch.*campaign|new campaign/.test(query)) {
		return { title: "Campaign launch task block", owner: "Campaign Studio", steps: ["Define the campaign objective, audience, and offer.", "Choose channels and budget based on current intelligence.", "List required assets and publishing dependencies before launch."] };
	}
	if (/content plan|7-day/.test(query)) {
		return { title: "Content plan task block", owner: "Content Studio", steps: ["Use the strongest content pattern as the starting template.", "Map posts by platform, hook, format, and CTA.", "Route approved items into Publishing for scheduling."] };
	}
	if (/weak post|improve content/.test(query)) {
		return { title: "Content repair task block", owner: "Content Studio", steps: ["Select the weakest items from Insights.", "Rewrite hooks, sharpen CTAs, and adjust format-platform fit.", "Republish only after updated versions are approved."] };
	}
	if (/reconnect|missing tools|missing integrations/.test(query)) {
		return { title: "Integration recovery task block", owner: "Integrations", steps: ["Reconnect critical analytics and performance feeds first.", "Test each integration after reconnect and sync current data.", "Return to Insights to confirm coverage improves."] };
	}
	return { title: "Execution task block", owner: "Workflows", steps: ["Confirm the goal and required output.", "Identify which workspace owns the work.", "Move into the correct page and execute the first step."] };
}

function buildOperationsResponse(aiContext, message) {
	const query = asString(message).toLowerCase();
	const taskBlock = buildOperationsTaskBlock(aiContext, message);
	const routeSuggestions = [];
	if (/campaign/.test(query)) routeSuggestions.push(routeSuggestion("Campaign Studio", "campaign-studio", "Turn this into a structured launch plan."));
	if (/content|post/.test(query)) {
		routeSuggestions.push(routeSuggestion("Content Studio", "content-studio", "Draft, rewrite, or prepare the requested content outputs."));
		routeSuggestions.push(routeSuggestion("Publishing", "publishing", "Schedule or approve if the next step is publishing."));
	}
	if (/reconnect|connect|integration|tool|sync/.test(query)) routeSuggestions.push(routeSuggestion("Integrations", "integrations", "Reconnect data sources and restore intelligence coverage."));
	if (/ads|campaign scale|roas|creative/.test(query)) routeSuggestions.push(routeSuggestion("Ads Manager", "ads-manager", "Review live paid performance and action the next media move."));
	if (!routeSuggestions.length) routeSuggestions.push(routeSuggestion("Workflows", "workflows", "Use Workflows when the task spans multiple execution areas."));
	return {
		title: "Operations routing brief",
		summary: "This request is best handled as a structured workflow — moving into the right workspace gets results faster than chat alone.",
		findings: [
			aiContext.criticalGaps.length ? `Unresolved critical gaps: ${aiContext.criticalGaps.slice(0, 3).map(normalizeActionLabel).join(", ")}.` : "No critical gap is blocking this operation.",
			aiContext.missingIntegrations.length ? "Intelligence coverage gaps may reduce execution quality." : "Core intelligence is available for routing."
		],
		recommendations: [
			"Move into the correct workspace rather than managing the whole flow from chat.",
			aiContext.recommendations[0]?.action || "Use the current recommendation stack to choose the first high-impact step."
		].filter(Boolean),
		nextActions: taskBlock.steps,
		routeSuggestions,
		taskBlock,
		missingData: buildMissingDataNotes(aiContext, "content")
	};
}

function buildResponseForMode(aiContext, classified, message) {
	switch (classified.resolvedModeId) {
		case "writer":
		case "designer":
		case "media":
			return buildContentResponse(aiContext);
		case "analyst":
			return buildSeoResponse(aiContext);
		case "ads":
			return buildAdsResponse(aiContext);
		case "researcher":
			return buildResearchResponse(aiContext);
		case "strategist":
			return buildOperationsResponse(aiContext, message);
		case "operations":
		default:
			return classified.actionRouting
				? buildOperationsResponse(aiContext, message)
				: buildExecutiveResponse(aiContext);
	}
}

// ============================================================
//  INTELLIGENCE LOADER
// ============================================================

async function ensureIntelligenceLoaded({
	projectName,
	session,
	getState,
	reloadProjectData,
	fetchProjectInsights,
	fetchProjectLearning,
	rerender
}) {
	if (!projectName) {
		session.intelligence = { ...session.intelligence, status: "error", error: "Select a project to load AI intelligence." };
		return;
	}
	const current = session.intelligence;
	const freshEnough = current.status === "ready" && current.project === projectName && current.loadedAt && (Date.now() - Date.parse(current.loadedAt)) < 1000 * 60 * 3;
	if (freshEnough) return;
	if (current.loadingPromise) return current.loadingPromise;

	const state = getState();
	const needsDashboard = !state.data.overview || !state.data.readiness || !state.data.integrations || !state.data.activity;

	session.intelligence = {
		...current,
		project: projectName,
		status: "loading",
		error: "",
		loadingPromise: (async () => {
			try {
				if (needsDashboard) await reloadProjectData(projectName);
				const [insightsResult, learningResult] = await Promise.allSettled([
					fetchProjectInsights(projectName),
					fetchProjectLearning(projectName)
				]);
				const insightsMissing = insightsResult.status === "rejected" && isMissingIntelligenceError(insightsResult.reason);
				const learningMissing = learningResult.status === "rejected" && isMissingIntelligenceError(learningResult.reason);
				const intelligenceErrors = [
					insightsResult.status === "rejected" && !insightsMissing ? insightsResult.reason?.message : "",
					learningResult.status === "rejected" && !learningMissing ? learningResult.reason?.message : ""
				].filter(Boolean);
				session.intelligence = {
					project: projectName,
					status: "ready",
					dashboard: getState().data,
					insights: insightsResult.status === "fulfilled" ? insightsResult.value : (insightsMissing ? { project: projectName, generated_at: nowIso(), data_coverage: {} } : null),
					learning: learningResult.status === "fulfilled" ? learningResult.value : (learningMissing ? { project: projectName, generated_at: nowIso(), learning_patterns: {}, recommendations: [] } : null),
					error: intelligenceErrors[0] || "",
					loadedAt: nowIso(),
					loadingPromise: null
				};
			} catch (error) {
				session.intelligence = { ...session.intelligence, project: projectName, status: "error", error: error.message || "Failed to load live intelligence", loadingPromise: null };
			} finally {
				rerender();
			}
		})()
	};

	rerender();
	return session.intelligence.loadingPromise;
}

// ============================================================
//  COMMAND SUBMISSION
// ============================================================

function syncAiWorkflowBridge({ projectName, modeId, command, response }) {
	setSharedAiDraft(projectName, {
		projectName: projectName || "",
		modeId: modeId || "",
		lastCommand: asString(command),
		lastResponseTitle: asString(response?.title),
		routeSuggestions: asArray(response?.routeSuggestions),
		updatedAt: nowIso()
	});
}

function applyDurableAiHandoff(projectName, operations, session, consumeProjectHandoff, showMessage) {
	const handoff = getSharedHandoff(projectName, "ai-command", operations);
	const handoffId = asString(handoff?.id);
	if (!handoffId || handoffId === asString(session.lastAppliedHandoffId)) return;

	const payload = asObject(handoff?.payload);
	const draftContext = asObject(payload.draft_context);
	const prompt = asString(payload.prompt);
	if (draftContext.modeId) session.modeId = draftContext.modeId;
	if (prompt) session.draftMessage = prompt;

	if (draftContext.projectName || prompt) {
		setSharedAiDraft(projectName, {
			projectName,
			modeId: draftContext.modeId || session.modeId,
			lastCommand: prompt || draftContext.lastCommand || "",
			lastResponseTitle: draftContext.lastResponseTitle || "",
			routeSuggestions: asArray(draftContext.routeSuggestions)
		});
	}

	session.lastAppliedHandoffId = handoffId;
	consumeProjectHandoff?.(projectName, handoffId, { actor: "mh-assistant" }).catch((error) => {
		console.warn("Failed to consume AI handoff:", error.message);
	});
	showMessage?.("AI Command restored context from the shared backbone.");
}

async function submitDurableCommand({
	projectName,
	aiContext,
	session,
	command,
	modeId,
	source,
	executeProjectAiCommand,
	reloadProjectData
}) {
	const cleanCommand = asString(command).trim();
	if (!cleanCommand) return { accepted: false, failed: false };
	if (typeof executeProjectAiCommand !== "function") throw new Error("AI command service is unavailable.");

	let result = null;
	let response = {};
	let resolvedModeId = modeId || session.modeId;
	let commandId = "";

	try {
		result = await executeProjectAiCommand(projectName, {
			command: cleanCommand,
			mode_id: modeId || session.modeId,
			source,
			actor: "mh-assistant",
			asset_context: {
				categories: aiContext.assetCategories,
				approved_assets: aiContext.approvedAssets,
				blockers: aiContext.assetBlockers
			}
		});
		response = asObject(result?.response);
		const classification = asObject(result?.command?.classification);
		resolvedModeId = asString(classification.resolvedModeId) || asString(result?.command?.mode_id) || modeId || session.modeId;
		commandId = asString(result?.command?.id);
	} catch (error) {
		const payload = asObject(error?.payload);
		const payloadResponse = asObject(payload?.response);
		const payloadCommand = asObject(payload?.command);
		const failureReason = asString(payload?.error) || asString(payloadResponse?.error) || asString(error?.message) || "AI provider failed to return output.";
		resolvedModeId = asString(payloadCommand?.mode_id) || modeId || session.modeId;
		commandId = asString(payloadCommand?.id);
		response = {
			status: "failed",
			title: "Command failed",
			summary: failureReason,
			findings: [failureReason],
			nextActions: ["Check AI provider configuration and retry."],
			routeSuggestions: [],
			missingData: [],
			error: failureReason
		};
	}

	const createdAt = nowIso();
	session.modeId = resolvedModeId;

	session.messages.push({
		id: `msg-user-${Date.now()}`,
		role: "user",
		modeId: resolvedModeId,
		content: cleanCommand,
		createdAt,
		source
	});

	session.messages.push({
		id: `msg-assistant-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
		role: "assistant",
		modeId: resolvedModeId,
		createdAt: asString(result?.command?.created_at) || nowIso(),
		source: "durable-ai-response",
		response
	});

	session.history.unshift({
		id: commandId || `history-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
		modeId: resolvedModeId,
		command: cleanCommand,
		createdAt,
		source,
		responseTitle: response.title || (response.status === "failed" ? "Command failed" : ""),
		failed: asString(response.status).toLowerCase() === "failed"
	});
	session.history = session.history.slice(0, 14);
	session.draftMessage = "";

	syncAiWorkflowBridge({ projectName: aiContext.projectName, modeId: resolvedModeId, command: cleanCommand, response });
	await reloadProjectData?.(projectName);
	return { accepted: true, failed: asString(response.status).toLowerCase() === "failed" };
}

// ============================================================
//  RENDER: CONTROL ROOM HEADER
// ============================================================


function buildProjectedAgentCards(state) {
  const projectedMembers = getProjectedTeamMembers(state);
  const activeRole = asString(getProjectedActiveRole(state)).toLowerCase();

  if (!projectedMembers.length) return AGENT_CARDS;

  return projectedMembers.map((member) => {
    const id = asString(member.role || member.id).toLowerCase();
    const fallback =
      AGENT_CARDS.find((agent) => agent.id === id) ||
      AGENT_CARDS.find((agent) => agent.id === "operations") ||
      AGENT_CARDS[0] ||
      {};

    return {
      ...fallback,
      id,
      name: asString(member.name || fallback.name || member.role || "AI Specialist"),
      role: asString(member.role || fallback.role || id),
      purpose: asString(member.purpose || member.description || fallback.purpose || "Support the current operating context."),
      bestUse: asString(member.bestUse || member.best_use || fallback.bestUse || "Use when this specialist owns the next step."),
      active: id === activeRole
    };
  });
}

function renderControlRoomHeader(aiContext, session, intelligenceStatus, escapeHtml) {
	const projectLabel = aiContext.projectName || "No project selected";
	const readinessLabel = aiContext.readinessScore != null ? `${aiContext.readinessScore}/100` : "--";
	const coverageLabel = aiContext.coverageTotal > 0 ? `${aiContext.coveredCount}/${aiContext.coverageTotal}` : "--";

	const intelDotClass = { ready: "ready", loading: "loading", error: "error", idle: "idle" }[intelligenceStatus] || "idle";
	const intelLabel = { ready: "Live intelligence loaded", loading: "Loading intelligence…", error: "Intelligence limited", idle: "Waiting for intelligence" }[intelligenceStatus] || "Idle";


	const caps = [];
	if (aiContext.projectName) caps.push("Campaign planning");
	if (aiContext.hasLiveIntelligence) caps.push("Performance analysis");
	if (aiContext.recommendations.length) caps.push(`${aiContext.recommendations.length} recommendations ready`);
	if (aiContext.topContent.length) caps.push("Content intelligence");
	if (aiContext.paid?.summary?.spend != null) caps.push("Paid media briefing");
	if (aiContext.seo?.summary?.impressions != null) caps.push("SEO analysis");
	caps.push("Content generation", "Research & competitor analysis", "Execution routing");

	return `
		<div class="ctrl-room-header">
			<div class="ctrl-room-header-top">
				<div>
					<div class="ctrl-room-eyebrow">AI Workspace</div>
					<h2 class="ctrl-room-title">Control Room</h2>
				</div>
				<div style="display:flex;align-items:center;gap:12px;">
					<span class="ctrl-intel-dot ${escapeHtml(intelDotClass)}"></span>
					<span class="ctrl-intel-label">${escapeHtml(intelLabel)}</span>
					<button id="ctrlRefreshBtn" class="ctrl-secondary-btn" type="button">Refresh intelligence</button>
				</div>
			</div>

			<div class="ctrl-room-context-bar">
				<div class="ctrl-room-ctx-chip">
					<span>Project</span>
					<strong>${escapeHtml(projectLabel)}</strong>
				</div>
				<div class="ctrl-room-ctx-chip">
					<span>Readiness</span>
					<strong>${escapeHtml(readinessLabel)}</strong>
				</div>
				<div class="ctrl-room-ctx-chip">
					<span>Coverage</span>
					<strong>${escapeHtml(coverageLabel)} connected</strong>
				</div>
				<div class="ctrl-room-ctx-chip">
					<span>Campaign</span>
					<strong>${escapeHtml(aiContext.campaign || "None")}</strong>
				</div>
				${aiContext.market ? `<div class="ctrl-room-ctx-chip"><span>Market</span><strong>${escapeHtml(aiContext.market)}</strong></div>` : ""}
			</div>

			<div class="ctrl-room-cap-row">
				<span class="ctrl-cap-heading">What AI can do now</span>
				<div class="ctrl-room-capability-bar">
					${caps.slice(0, 8).map((cap) => `<span class="ctrl-room-cap-pill">${escapeHtml(cap)}</span>`).join("")}
				</div>
			</div>

			${session.intelligence.error ? `<div class="ctrl-intel-error">${escapeHtml(session.intelligence.error)}</div>` : ""}
		</div>
	`;
}

// ============================================================

//  RENDER: TEAM SELECTOR
// ============================================================

function renderTeamSelector(session, escapeHtml) {
	return `
		<div>
			<div class="ctrl-room-section-label">Choose your AI specialist</div>
			<div class="ctrl-room-team">
				${MODE_DEFS.map((agent) => `
					<button
						class="ctrl-team-card${agent.id === session.modeId ? " is-active" : ""}"
						type="button"
						data-ctrl-mode="${escapeHtml(agent.id)}"
						title="${escapeHtml(agent.summary)}"
					>
						<span class="ctrl-team-icon">${agent.icon}</span>
						<span class="ctrl-team-name">${escapeHtml(agent.label)}</span>
						${agent.id === session.modeId ? `<span class="ctrl-team-active-dot"></span>` : ""}
					</button>
				`).join("")}
			</div>
		</div>
	`;
}

// ============================================================
//  RENDER: COMMAND COMPOSER
// ============================================================

function renderCommandComposer(session, aiContext, escapeHtml) {
	const mode = getModeMeta(session.modeId);
	const projectLabel = aiContext.projectName || "this project";
	const isStructured = session.taskMode === "structured";

	const productOptions = [
		...new Set(aiContext.assetCategories.map((cat) => cat.label || cat.asset_type).filter(Boolean).slice(0, 8))
	];
	const channelOptions = ["Instagram", "TikTok", "Facebook", "YouTube", "Email", "Google Ads", "Meta Ads", "LinkedIn"];

	return `
		<div class="ctrl-composer-card">
			<div class="ctrl-composer-head">
				<div style="display:flex;align-items:center;gap:8px;">
					<span style="font-size:18px;">${mode.icon}</span>
					<h3 style="margin:0;font-size:14px;font-weight:600;color:var(--color-text-0);">${escapeHtml(mode.label)} — Command Composer</h3>
				</div>
				<div class="ctrl-mode-toggle">
					<button class="ctrl-mode-btn${!isStructured ? " is-active" : ""}" type="button" data-ctrl-task-toggle="free">Free text</button>
					<button class="ctrl-mode-btn${isStructured ? " is-active" : ""}" type="button" data-ctrl-task-toggle="structured">Task builder</button>
				</div>
			</div>
			<div class="ctrl-composer-body">
				<textarea
					id="ctrlComposerInput"
					class="ctrl-composer-textarea"
					rows="4"
					placeholder="Ask ${escapeHtml(mode.label)} anything — what to do next, what content is working, which campaign to scale, or where to route the next action…"
				>${escapeHtml(session.draftMessage)}</textarea>

				<div id="ctrlTaskFields" class="ctrl-task-fields${!isStructured ? " is-hidden" : ""}">
					<div class="ctrl-task-fields-label">Build a structured task</div>
					<div class="ctrl-task-field">
						<label for="ctrlTaskType">Task type</label>
						<select id="ctrlTaskType" class="ctrl-task-select">
							<option value="launch"${session.taskType === "launch" ? " selected" : ""}>🚀 Launch Campaign</option>
							<option value="content"${session.taskType === "content" ? " selected" : ""}>✍️ Generate Content</option>
							<option value="analyze"${session.taskType === "analyze" ? " selected" : ""}>📊 Analyze Performance</option>
							<option value="fix"${session.taskType === "fix" ? " selected" : ""}>🔧 Fix Readiness</option>
						</select>
					</div>
					<div class="ctrl-task-field">
						<label for="ctrlProductSelect">Product / focus area</label>
						<select id="ctrlProductSelect" class="ctrl-task-select">
							<option value="">— whole project —</option>
							${productOptions.map((opt) => `<option value="${escapeHtml(opt)}"${session.taskProduct === opt ? " selected" : ""}>${escapeHtml(opt)}</option>`).join("")}
						</select>
					</div>
					<div class="ctrl-task-field">
						<label for="ctrlChannelSelect">Channel</label>
						<select id="ctrlChannelSelect" class="ctrl-task-select">
							<option value="">— all channels —</option>
							${channelOptions.map((ch) => `<option value="${escapeHtml(ch)}"${session.taskChannel === ch ? " selected" : ""}>${escapeHtml(ch)}</option>`).join("")}
						</select>
					</div>
					<button type="button" id="ctrlBuildTaskBtn" class="ctrl-build-task-btn">Build command from task →</button>
				</div>

				<div class="ctrl-composer-actions">
					<button id="ctrlSendBtn" class="ctrl-send-btn" type="button">Send to ${escapeHtml(mode.label)}</button>
					<button id="ctrlClearBtn" class="ctrl-secondary-btn" type="button">Clear session</button>
					<button id="ctrlGlobalBtn" class="ctrl-secondary-btn" type="button">Copy to bar</button>
				</div>
				<div class="ctrl-composer-hint">Ctrl / Cmd + Enter to send · Suggested prompts prefill only · Draft stays local until you send to execute</div>
			</div>
		</div>
	`;
}

// ============================================================
//  RENDER: SUGGESTED PROMPTS
// ============================================================

function renderSuggestedPromptsSection(aiContext, session, escapeHtml) {
	const projectLabel = aiContext.projectName || "this project";
	return `
		<div class="ctrl-composer-card">
			<div class="ctrl-composer-head">
				<h3 style="margin:0;font-size:14px;font-weight:600;color:var(--color-text-0);">Suggested prompts</h3>
				<span style="font-size:11px;color:var(--color-text-2);">Prefill only — send to run</span>
			</div>
			<div class="ctrl-composer-body">
				<div class="ctrl-prompts-grid">
					${QUICK_ACTIONS.map((action) => `
						<button
							class="ctrl-prompt-btn"
							type="button"
							data-ctrl-quick="${escapeHtml(action.action)}"
							data-ctrl-quick-template="${escapeHtml(action.template.replace("{project}", projectLabel))}"
						>
							<span class="ctrl-prompt-icon">${action.icon}</span>
							<span>
								<span class="ctrl-prompt-label">${escapeHtml(action.label)}</span>
								<span class="ctrl-prompt-sub">${escapeHtml(action.sub)}</span>
							</span>
						</button>
					`).join("")}
				</div>
			</div>
		</div>
	`;
}

// ============================================================
//  RENDER: AI RESPONSE (clean cards, no raw JSON)
// ============================================================

function renderCleanResponse(response, escapeHtml, ownerId) {
	const hasError = asString(response.status).toLowerCase() === "failed" || Boolean(asString(response.error));
	const title = humanizeValue(response.title, "");
	const summary = humanizeValue(response.summary, "");
	const findings = normalizeDisplayList(response.findings, 5);
	const recommendations = normalizeDisplayList(response.recommendations, 4);
	const nextActions = normalizeDisplayList(response.nextActions || response.next_actions, 4);
	const routeSuggestions = asArray(response.routeSuggestions || response.route_suggestions).map((item) => {
		const record = asObject(item);
		return {
			label: humanizeValue(record.label || record.title || record.route || item),
			route: asString(record.route || record.destination || record.page),
			reason: humanizeValue(record.reason || record.summary || item)
		};
	}).filter((item) => item.label || item.route);
	const taskBlock = asObject(response.taskBlock);
	const hasContent = title || summary || findings.length || recommendations.length || nextActions.length;

	if (!hasContent && !hasError) {
		return `<div class="ctrl-response-card"><p style="color:var(--color-text-2);font-size:13px;">No output returned.</p></div>`;
	}

	return `
		<div class="ctrl-response-card">
			${hasError ? `
				<div class="ctrl-error-banner">
					<span>⚠</span>
					<span>${escapeHtml(asString(response.error) || asString(response.summary) || "AI provider error.")}</span>
				</div>
			` : ""}

			${title ? `<div class="ctrl-response-summary">${escapeHtml(title)}</div>` : ""}
			${summary ? `<div class="ctrl-response-body">${escapeHtml(summary)}</div>` : ""}

			${findings.length ? `
				<div class="ctrl-response-section">
					<div class="ctrl-response-section-label">Key findings</div>
					<div class="ctrl-response-items">
						${findings.map((item) => `<div class="ctrl-response-item"><span>${escapeHtml(item)}</span></div>`).join("")}
					</div>
				</div>
			` : ""}

			${recommendations.length ? `
				<div class="ctrl-response-section">
					<div class="ctrl-response-section-label">Recommendations</div>
					<div class="ctrl-response-items">
						${recommendations.map((item) => `<div class="ctrl-response-item"><span>${escapeHtml(item)}</span></div>`).join("")}
					</div>
				</div>
			` : ""}

			${nextActions.length ? `
				<div class="ctrl-response-section">
					<div class="ctrl-response-section-label">Next actions</div>
					<div class="ctrl-response-items">
						${nextActions.map((item) => `<div class="ctrl-response-item"><span>${escapeHtml(item)}</span></div>`).join("")}
					</div>
				</div>
			` : ""}

			${taskBlock.title ? `
				<div class="ctrl-response-section">
					<div class="ctrl-response-section-label">Task block — ${escapeHtml(humanizeValue(taskBlock.owner, "System"))}</div>
					<div class="ctrl-task-block-name">${escapeHtml(humanizeValue(taskBlock.title))}</div>
					<div class="ctrl-response-items" style="margin-top:6px;">
						${normalizeDisplayList(taskBlock.steps, 6).map((step) => `<div class="ctrl-response-item"><span>${escapeHtml(step)}</span></div>`).join("")}
					</div>
				</div>
			` : ""}

			${routeSuggestions.length ? `
				<div class="ctrl-response-section">
					<div class="ctrl-response-section-label">Open workspace</div>
					<div class="ctrl-route-row">
						${routeSuggestions.map((item, index) => `
							<button class="ctrl-route-btn" type="button" data-ctrl-route="${index}" data-ctrl-route-owner="${escapeHtml(ownerId || "")}" title="${escapeHtml(item.reason)}">
								${escapeHtml(item.label)} →
							</button>
						`).join("")}
					</div>
				</div>
			` : ""}
		</div>
	`;
}

// ============================================================
//  RENDER: MESSAGE STREAM
// ============================================================

function renderMessageStream(messages, escapeHtml) {
	if (!messages.length) {
		return `
			<div class="ctrl-empty-stream">
				<div class="ctrl-empty-icon">💬</div>
				<div class="ctrl-empty-title">Start the conversation</div>
				<div class="ctrl-empty-body">Choose a specialist above, pick a suggested prompt, or write your own command and hit Send.</div>
			</div>
		`;
	}

	return messages.map((message) => {
		const mode = getModeMeta(message.modeId);
		if (message.role === "user") {
			return `
				<div class="ctrl-msg-user">
					<div class="ctrl-msg-user-bubble">
						<div class="ctrl-msg-user-text">${escapeHtml(message.content)}</div>
						<div class="ctrl-msg-meta">${escapeHtml(formatTime(message.createdAt))}</div>
					</div>
				</div>
			`;
		}
		return `
			<div class="ctrl-msg-ai">
				<div class="ctrl-msg-agent-icon" title="${escapeHtml(mode.label)}">${mode.icon}</div>
				<div class="ctrl-msg-ai-body">
					<div class="ctrl-msg-ai-agent">${escapeHtml(mode.label)} · ${escapeHtml(formatTime(message.createdAt))}</div>
					${renderCleanResponse(asObject(message.response), escapeHtml, message.id)}
				</div>
			</div>
		`;
	}).join("");
}

// ============================================================
//  RENDER: RESULTS PANEL
// ============================================================

function renderResultsPanel(session, escapeHtml) {
	return `
		<div class="ctrl-results-panel">
			<div class="ctrl-results-head">
				<h3 style="margin:0;font-size:14px;font-weight:600;color:var(--color-text-0);">Conversation &amp; results</h3>
				<span style="font-size:11px;color:var(--color-text-2);">${session.messages.length} message${session.messages.length !== 1 ? "s" : ""}</span>
			</div>
			<div id="ctrlChatStream" class="ctrl-chat-stream">
				${renderMessageStream(session.messages, escapeHtml)}
			</div>
		</div>
	`;
}

// ============================================================
//  RENDER: RECENT COMMANDS
// ============================================================

function renderRecentCommands(session, escapeHtml) {
	return `
		<div class="ctrl-composer-card">
			<div class="ctrl-composer-head">
				<h3 style="margin:0;font-size:14px;font-weight:600;color:var(--color-text-0);">Recent commands</h3>
				<span style="font-size:11px;color:var(--color-text-2);">${session.history.length} logged · click to restore</span>
			</div>
			<div class="ctrl-composer-body">
				${session.history.length ? `
					<div class="ctrl-recents-list">
						${session.history.slice(0, 8).map((entry, index) => {
							const mode = getModeMeta(entry.modeId);
							const statusClass = entry.failed ? "danger" : "success";
							const statusLabel = entry.failed ? "Failed" : "Done";
							return `
								<button class="ctrl-recent-item" type="button" data-ctrl-history="${index}">
									<span class="ctrl-recent-agent">${mode.icon}</span>
									<div class="ctrl-recent-content">
										<div class="ctrl-recent-command">${escapeHtml(entry.command)}</div>
										<div class="ctrl-recent-result">${escapeHtml(entry.responseTitle || mode.label + " · " + formatTime(entry.createdAt))}</div>
									</div>
									<div class="ctrl-recent-meta">
										<span class="ctrl-recent-time">${escapeHtml(formatTime(entry.createdAt))}</span>
										<span class="card-badge ${statusClass}" style="font-size:10px;padding:2px 7px;">${statusLabel}</span>
									</div>
								</button>
							`;
						}).join("")}
					</div>
				` : `
					<div class="ctrl-empty-box">Commands you send appear here. Click any to restore and re-run.</div>
				`}
			</div>
		</div>
	`;
}

// ============================================================
//  RENDER: AI MEMORY & ARTIFACTS
// ============================================================

function renderArtifactsPanel(aiContext, session, escapeHtml) {
	const recommendations = aiContext.recommendations.slice(0, 4);
	const patterns = Object.entries(asObject(aiContext.learningPatterns))
		.filter(([, val]) => val && val.label && val.label !== "No format pattern yet" && val.label !== "No platform pattern yet")
		.slice(0, 3);
	const artifacts = session.messages
		.filter((msg) => msg.role === "assistant" && asString(msg.response?.outputType || msg.response?.output_type))
		.slice(-4)
		.map((msg) => ({
			type: titleCase(asString(msg.response?.outputType || msg.response?.output_type)),
			title: humanizeValue(msg.response?.title, "Artifact"),
			body: humanizeValue(msg.response?.summary, ""),
			time: formatTime(msg.createdAt)
		}));

	const hasContent = recommendations.length || patterns.length || artifacts.length;

	return `
		<div class="ctrl-composer-card">
			<div class="ctrl-composer-head">
				<h3 style="margin:0;font-size:14px;font-weight:600;color:var(--color-text-0);">AI memory &amp; artifacts</h3>
				<span style="font-size:11px;color:var(--color-text-2);">${recommendations.length} rec${recommendations.length !== 1 ? "s" : ""} · ${patterns.length} patterns</span>
			</div>
			<div class="ctrl-composer-body">
				${!hasContent ? `
					<div class="ctrl-empty-box">Recommendations and learned patterns will appear here as the AI works with your project data.</div>
				` : `
					<div class="ctrl-artifacts-grid">
						${artifacts.map((art) => `
							<div class="ctrl-artifact-card">
								<div class="ctrl-artifact-type">Artifact · ${escapeHtml(art.type)} · ${escapeHtml(art.time)}</div>
								<div class="ctrl-artifact-title">${escapeHtml(art.title)}</div>
								${art.body ? `<div class="ctrl-artifact-body">${escapeHtml(art.body)}</div>` : ""}
							</div>
						`).join("")}

						${recommendations.map((rec) => {
							const r = asObject(rec);
							const recTitle = humanizeValue(r.title || r.label || r.headline || rec);
							const recAction = humanizeValue(r.action || r.recommendation || r.summary || r.description || "");
							const recDomain = asString(r.domain || r.category || "");
							return `
								<div class="ctrl-artifact-card">
									<div class="ctrl-artifact-type">Recommendation${recDomain ? " · " + titleCase(recDomain) : ""}</div>
									<div class="ctrl-artifact-title">${escapeHtml(recTitle)}</div>
									${recAction ? `<div class="ctrl-artifact-body">${escapeHtml(recAction)}</div>` : ""}
								</div>
							`;
						}).join("")}

						${patterns.map(([key, val]) => {
							const patternLabel = humanizeValue(val.label);
							const patternDetail = humanizeValue(val.detail || val.insight || val.reason || "");
							return `
								<div class="ctrl-artifact-card">
									<div class="ctrl-artifact-type">Learned pattern · ${escapeHtml(titleCase(key))}</div>
									<div class="ctrl-artifact-title">${escapeHtml(patternLabel)}</div>
									${patternDetail ? `<div class="ctrl-artifact-body">${escapeHtml(patternDetail)}</div>` : ""}
								</div>
							`;
						}).join("")}
					</div>
				`}
			</div>
		</div>
	`;
}

function getLastUserMessage(session) {
	return asArray(session.messages).slice().reverse().find((item) => item.role === "user") || null;
}

function getLastAssistantMessage(session) {
	return asArray(session.messages).slice().reverse().find((item) => item.role === "assistant") || null;
}

function buildCommandEnvelope(session, prompt) {
	const commandTypeLabel = COMMAND_TYPES.find((item) => item.id === session.commandType)?.label || "Strategy";
	const targetTypeLabel = TARGET_TYPES.find((item) => item.id === session.targetType)?.label || "Current project";
	const targetValue = asString(session.targetValue).trim();
	const targetLine = targetValue ? `${targetTypeLabel}: ${targetValue}` : targetTypeLabel;
	return `${asString(prompt).trim()}\n\nCommand type: ${commandTypeLabel}\nTarget: ${targetLine}`;
}

function buildImpactChips(activeLabels) {
	const activeSet = new Set(asArray(activeLabels));
	return IMPACT_CHIP_LABELS.map((label) => ({
		label,
		active: activeSet.has(label)
	}));
}

function buildSmartRecommendation(aiContext) {
	if (aiContext.criticalGaps.length) {
		return {
			title: "Close critical readiness gaps before scale",
			reason: `${aiContext.criticalGaps.length} critical setup gap${aiContext.criticalGaps.length === 1 ? "" : "s"} can block launch quality and downstream automation reliability.`,
			command: `Review the critical readiness gaps for ${aiContext.projectName || "this project"} and produce a fix plan with owners, order, and dependencies.`,
			chips: buildImpactChips(["Launch readiness", "Campaign", "Automation"])
		};
	}

	if (aiContext.assetBlockers.length) {
		return {
			title: "Resolve asset blockers for execution flow",
			reason: `${aiContext.assetBlockers.length} asset category blocker${aiContext.assetBlockers.length === 1 ? "" : "s"} may reduce content throughput and campaign delivery speed.`,
			command: `Create an asset unblock plan for ${aiContext.projectName || "this project"}. List missing files, priority, and where each is needed.`,
			chips: buildImpactChips(["Assets", "Content", "Campaign"])
		};
	}

	if (aiContext.missingIntegrations.length || aiContext.connectorIssues.length) {
		const impacted = aiContext.missingIntegrations.length + aiContext.connectorIssues.length;
		return {
			title: "Repair integration coverage for stronger AI output",
			reason: `${impacted} integration signal${impacted === 1 ? "" : "s"} need attention before relying on full automation and optimization loops.`,
			command: `Build an integration recovery plan for ${aiContext.projectName || "this project"}. Prioritize connectors by business impact and data coverage gain.`,
			chips: buildImpactChips(["Integrations", "Automation", "Launch readiness"])
		};
	}

	if (!aiContext.campaign || aiContext.campaign === "Not selected") {
		return {
			title: "Define the active campaign operating plan",
			reason: "A clear campaign context helps every specialist agent generate more precise outputs.",
			command: `Create a campaign operating brief for ${aiContext.projectName || "this project"} with objective, audience, channels, and first execution wave.`,
			chips: buildImpactChips(["Campaign", "Content", "Launch readiness"])
		};
	}

	return {
		title: "Generate next content wave from current signals",
		reason: "Core readiness is stable enough to move into output generation and optimization.",
		command: `Generate the next high-impact content wave for ${aiContext.projectName || "this project"} based on current readiness and campaign context.`,
		chips: buildImpactChips(["Content", "Campaign", "Automation"])
	};
}

// ============================================================
//  ROUTE EXPORT
// ============================================================
//  PHASE 1 RENDER HELPERS — AI TEAM COMMAND CENTER
// ============================================================


function getPhase1SpecialistById(value) {
  const normalize = (input) =>
    String(input || "")
      .trim()
      .toLowerCase()
      .replace(/[\s-]+/g, "_");

  const requestedId = normalize(value || "strategist");
  const rawDefinitions = typeof SPECIALIST_DEFS !== "undefined" ? SPECIALIST_DEFS : [];

  const definitions = Array.isArray(rawDefinitions)
    ? rawDefinitions
    : Object.entries(rawDefinitions || {}).map(([id, item]) => ({
        id,
        ...(item && typeof item === "object" ? item : {})
      }));

  return (
    definitions.find((item) =>
      normalize(item?.id || item?.role || item?.key || item?.name) === requestedId
    ) ||
    definitions.find((item) => normalize(item?.id || item?.role || item?.key) === "strategist") ||
    definitions[0] ||
    null
  );
}

function renderPhase1Header(session, projectName, escapeHtml) {
	const spec = getPhase1SpecialistById(session.modeId);
	const modeLabel = session.teamMode === "team" ? "Full Team" : "Solo Specialist";
	return `
		<header class="aicmd-v2-header">
			<div class="aicmd-v2-header-main">
				<p class="aicmd-v2-eyebrow">MH-OS · AI Team</p>
				<h1 class="aicmd-v2-title">AI Team Command Center</h1>
				<p class="aicmd-v2-subtitle">Work with one specialist or your full AI team to turn ideas into guidance, tasks, workflows, content, media, and handoffs.</p>
			</div>
			<div class="aicmd-v2-header-meta">
				<div class="aicmd-v2-meta-chip">
					<span>Project</span>
					<strong>${escapeHtml(projectName || "Not selected")}</strong>
				</div>
				<div class="aicmd-v2-meta-chip">
					<span>Specialist</span>
					<strong>${escapeHtml(session.teamMode === "team" ? "Full Team" : spec.label)}</strong>
				</div>
				<div class="aicmd-v2-meta-chip">
					<span>Mode</span>
					<strong>${escapeHtml(modeLabel)}</strong>
				</div>
				<div class="aicmd-v2-meta-chip aicmd-v2-safe-chip">
					<span>Status</span>
					<strong>Guidance &amp; drafts only</strong>
				</div>
			</div>
		</header>
	`;
}

function renderPhase1TeamRail(session, escapeHtml) {
	const teamBanner = session.teamMode === "team" ? `
		<div class="aicmd-v2-team-mission">
			<p class="aicmd-v2-team-mission-label">Full Team Mode</p>
			<p class="aicmd-v2-team-mission-text">All specialists collaborate toward the shared project mission. Each specialist contributes their domain. You guide the flow.</p>
		</div>
	` : "";

	return `
		<aside class="aicmd-v2-left">
			<div class="aicmd-v2-mode-toggle">
				<button class="aicmd-v2-toggle-btn${session.teamMode === "solo" ? " is-active" : ""}" type="button" data-aicmdv2-team-mode="solo">
					Solo Specialist
				</button>
				<button class="aicmd-v2-toggle-btn${session.teamMode === "team" ? " is-active" : ""}" type="button" data-aicmdv2-team-mode="team">
					Full Team
				</button>
			</div>
			${teamBanner}
			<div class="aicmd-v2-team-rail">
				${SPECIALIST_DEFS.map((spec) => {
					const isActive = spec.id === session.modeId && session.teamMode === "solo";
					return `
						<button
							class="aicmd-v2-spec-btn${isActive ? " is-active" : ""}"
							type="button"
							data-aicmdv2-specialist="${escapeHtml(spec.id)}"
							title="${escapeHtml(spec.summary)}"
						>
							<span class="aicmd-v2-spec-icon">${spec.icon}</span>
							<div class="aicmd-v2-spec-info">
								<span class="aicmd-v2-spec-name">${escapeHtml(spec.label)}</span>
								<span class="aicmd-v2-spec-summary">${escapeHtml(spec.summary)}</span>
							</div>
							<span class="aicmd-v2-spec-status${isActive ? " is-active" : ""}">${isActive ? "Active" : escapeHtml(spec.status)}</span>
						</button>
					`;
				}).join("")}
			</div>
		</aside>
	`;
}

function renderPhase1Profile(session, escapeHtml) {
	if (session.teamMode === "team") {
		return `
			<div class="aicmd-v2-profile aicmd-v2-team-profile">
				<div class="aicmd-v2-profile-header">
					<span class="aicmd-v2-profile-icon">🤝</span>
					<div>
						<h2 class="aicmd-v2-profile-title">Full AI Team</h2>
						<p class="aicmd-v2-profile-purpose">All specialists collaborate on the project together. Each specialist contributes their domain expertise toward the shared mission.</p>
					</div>
				</div>
				<div class="aicmd-v2-profile-grid">
					<div class="aicmd-v2-profile-col">
						<span class="aicmd-v2-profile-label">Team can help with</span>
						<ul class="aicmd-v2-profile-list">
							${["Strategy and campaign planning", "Content drafts and copy", "Media direction and briefs", "SEO and performance analysis", "Compliance and governance review", "Publishing readiness and handoffs", "Task planning and execution sequencing"].map((item) => `<li class="aicmd-v2-profile-item">${escapeHtml(item)}</li>`).join("")}
						</ul>
					</div>
					<div class="aicmd-v2-profile-col">
						<span class="aicmd-v2-profile-label">Team cannot do</span>
						<ul class="aicmd-v2-profile-list">
							${["Publish without explicit approval", "Execute workflows automatically", "Grant approvals or override governance", "Run backend operations without confirmation"].map((item) => `<li class="aicmd-v2-profile-item aicmd-v2-profile-denied">${escapeHtml(item)}</li>`).join("")}
						</ul>
					</div>
				</div>
				<div class="aicmd-v2-profile-destinations">
					<span class="aicmd-v2-profile-label">Key destinations</span>
					<div class="aicmd-v2-dest-row">
						${["Campaign Studio", "Content Studio", "Publishing", "Workflows", "Insights"].map((d) => `<span class="aicmd-v2-dest-chip">${escapeHtml(d)}</span>`).join("")}
					</div>
				</div>
			</div>
		`;
	}

	const spec = getPhase1SpecialistById(session.modeId);
	return `
		<div class="aicmd-v2-profile">
			<div class="aicmd-v2-profile-header">
				<span class="aicmd-v2-profile-icon">${spec.icon}</span>
				<div>
					<h2 class="aicmd-v2-profile-title">${escapeHtml(spec.label)}</h2>
					<p class="aicmd-v2-profile-purpose">${escapeHtml(spec.summary)}</p>
				</div>
			</div>
			<div class="aicmd-v2-profile-grid">
				<div class="aicmd-v2-profile-col">
					<span class="aicmd-v2-profile-label">Can help with</span>
					<ul class="aicmd-v2-profile-list">
						${spec.canHelp.map((item) => `<li class="aicmd-v2-profile-item">${escapeHtml(item)}</li>`).join("")}
					</ul>
				</div>
				<div class="aicmd-v2-profile-col">
					<span class="aicmd-v2-profile-label">Cannot do</span>
					<ul class="aicmd-v2-profile-list">
						${spec.cannotDo.map((item) => `<li class="aicmd-v2-profile-item aicmd-v2-profile-denied">${escapeHtml(item)}</li>`).join("")}
					</ul>
				</div>
			</div>
			<div class="aicmd-v2-profile-destinations">
				<span class="aicmd-v2-profile-label">Destination pages</span>
				<div class="aicmd-v2-dest-row">
					${spec.destinations.map((d) => `<span class="aicmd-v2-dest-chip">${escapeHtml(d)}</span>`).join("")}
				</div>
			</div>
		</div>
	`;
}

function renderPhase1Composer(session, escapeHtml) {
	const spec = getPhase1SpecialistById(session.modeId);
	const placeholder = session.teamMode === "team"
		? "Describe what you want the full AI team to work on — strategy, content, media, compliance, and handoffs together…"
		: escapeHtml(spec.placeholder);
	const specLabel = session.teamMode === "team" ? "Full Team" : escapeHtml(spec.label);

	return `
		<div class="aicmd-v2-composer">
			<div class="aicmd-v2-composer-head">
				<span class="aicmd-v2-composer-icon">${session.teamMode === "team" ? "🤝" : spec.icon}</span>
				<span class="aicmd-v2-composer-label">${specLabel} — Workspace Composer</span>
			</div>
			<textarea
				id="aicmdV2Input"
				class="aicmd-v2-textarea"
				rows="5"
				placeholder="${placeholder}"
			>${escapeHtml(session.draftMessage)}</textarea>
			<div class="aicmd-v2-action-row">
				<button id="aicmdV2PrepareBtn" class="aicmd-v2-btn-primary" type="button">
					Prepare Guidance
				</button>
				<button id="aicmdV2DraftTaskBtn" class="aicmd-v2-btn-secondary" type="button">
					Draft Task
				</button>
				<button id="aicmdV2DraftWorkflowBtn" class="aicmd-v2-btn-secondary" type="button">
					Draft Workflow
				</button>
				<button id="aicmdV2HandoffBtn" class="aicmd-v2-btn-secondary" type="button">
					Prepare Handoff
				</button>
				<button id="aicmdV2SaveBtn" class="aicmd-v2-btn-ghost" type="button">
					Save Local Draft
				</button>
				<button id="aicmdV2ClearBtn" class="aicmd-v2-btn-ghost" type="button">
					Clear
				</button>
			</div>
			<div id="aicmdV2Status" class="aicmd-v2-composer-hint">
				${escapeHtml(session.draftStatus || "Choose a specialist, fill in your request, and use Prepare Guidance to stage it for review. Ctrl / Cmd + Enter to prepare.")}
			</div>
		</div>
	`;
}

function renderPhase2PreviewPanel(session, escapeHtml) {
	const preview = asObject(session.outputPreview);
	const hasPreview = Boolean(preview.outputType && preview.title);
	const specialist = session.teamMode === "team"
		? { id: "team", label: "Full Team" }
		: getPhase1SpecialistById(preview.specialistId || session.modeId);

	if (!hasPreview) {
		return `
			<section class="aicmd-v2-preview">
				<div class="aicmd-v2-preview-head">
					<div>
						<h3 class="aicmd-v2-preview-title">Specialist Output Preview</h3>
						<p class="aicmd-v2-preview-subtitle">Choose a specialist, write a request, then prepare guidance, a task draft, a workflow draft, or a handoff preview.</p>
					</div>
					<span class="aicmd-v2-preview-status aicmd-v2-preview-status-empty">Waiting</span>
				</div>
			</section>
		`;
	}

	const bullets = normalizeDisplayList(preview.bullets, 8);
	const steps = normalizeDisplayList(preview.steps, 8);
	const destination = routeLabel(preview.destinationRoute);

	return `
		<section class="aicmd-v2-preview">
			<div class="aicmd-v2-preview-head">
				<div>
					<h3 class="aicmd-v2-preview-title">Specialist Output Preview</h3>
					<p class="aicmd-v2-preview-subtitle">Draft preview only. Review before saving, routing, or executing in destination workspaces.</p>
				</div>
				<span class="aicmd-v2-preview-status">${escapeHtml(titleCase(preview.status || "draft_preview"))}</span>
			</div>

			<div class="aicmd-v2-preview-meta">
				<span class="aicmd-v2-preview-chip"><strong>Type:</strong> ${escapeHtml(formatOutputTypeLabel(preview.outputType))}</span>
				<span class="aicmd-v2-preview-chip"><strong>Specialist:</strong> ${escapeHtml(specialist.label || "Specialist")}</span>
				<span class="aicmd-v2-preview-chip"><strong>Destination:</strong> ${escapeHtml(destination)}</span>
				<span class="aicmd-v2-preview-chip"><strong>Generated:</strong> ${escapeHtml(formatTime(preview.generatedAt))}</span>
			</div>

			<div class="aicmd-v2-preview-body">
				<h4 class="aicmd-v2-preview-output-title">${escapeHtml(humanizeValue(preview.title, "Draft output"))}</h4>
				<p class="aicmd-v2-preview-summary">${escapeHtml(humanizeValue(preview.summary, "Guidance preview prepared."))}</p>

				${bullets.length ? `
					<div class="aicmd-v2-preview-section">
						<span class="aicmd-v2-preview-label">Preview content</span>
						<ul class="aicmd-v2-preview-list">
							${bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
						</ul>
					</div>
				` : ""}

				${steps.length ? `
					<div class="aicmd-v2-preview-section">
						<span class="aicmd-v2-preview-label">Suggested steps</span>
						<ol class="aicmd-v2-preview-steps">
							${steps.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
						</ol>
					</div>
				` : ""}

				<div class="aicmd-v2-preview-section">
					<span class="aicmd-v2-preview-label">Next safe action</span>
					<p class="aicmd-v2-preview-note">${escapeHtml(humanizeValue(preview.nextSafeAction, "Review in destination workspace."))}</p>
				</div>

				<div class="aicmd-v2-preview-section">
					<span class="aicmd-v2-preview-label">Confirmation note</span>
					<p class="aicmd-v2-preview-note">${escapeHtml(humanizeValue(preview.confirmationNote, "Execution requires explicit confirmation."))}</p>
					<p class="aicmd-v2-preview-safety">${escapeHtml(humanizeValue(preview.safetyLabel, "Guidance only."))}</p>
				</div>
			</div>

			<div class="aicmd-v2-preview-actions">
				<button id="aicmdV2PreviewCopyBtn" class="aicmd-v2-btn-secondary" type="button">Copy preview</button>
				<button id="aicmdV2PreviewUseBtn" class="aicmd-v2-btn-secondary" type="button">Use in composer</button>
				<button id="aicmdV2PreviewSendBtn" class="aicmd-v2-btn-secondary" type="button">Send to destination</button>
				<button id="aicmdV2PreviewSaveBtn" class="aicmd-v2-btn-ghost" type="button">Save local draft</button>
				<button id="aicmdV2PreviewReadBtn" class="aicmd-v2-btn-ghost" type="button" ${typeof speechSynthesis === "undefined" ? "disabled" : ""}>Read preview</button>
				<button id="aicmdV2PreviewClearBtn" class="aicmd-v2-btn-ghost" type="button">Clear preview</button>
			</div>
		</section>
	`;
}

function renderPhase2MediaStatusPanel(aiContext, escapeHtml) {
	const providerConfigured = isProviderLikelyConfigured(aiContext);
	const providerStatus = providerConfigured
		? "Configured in integrations"
		: "Status not connected yet";

	return `
		<section class="aicmd-v2-media-status">
			<div class="aicmd-v2-media-status-head">
				<h3 class="aicmd-v2-media-status-title">Media Capability Status</h3>
				<span class="aicmd-v2-media-status-badge">Honest capability view</span>
			</div>
			<ul class="aicmd-v2-media-status-list">
				<li><span>Image prompt / provider routing</span><strong>${escapeHtml(providerStatus)}</strong></li>
				<li><span>Video brief generation</span><strong>Draft-ready</strong></li>
				<li><span>Native GPU video rendering</span><strong>Requires connected GPU worker</strong></li>
				<li><span>Voice script</span><strong>Draft-ready</strong></li>
				<li><span>Realtime voice chat</span><strong>Future connection</strong></li>
			</ul>
		</section>
	`;
}

function renderPhase1SuggestedPrompts(session, escapeHtml) {
	const prompts = session.teamMode === "team"
		? TEAM_SUGGESTED_PROMPTS
		: (SPECIALIST_SUGGESTED_PROMPTS[session.modeId] || SPECIALIST_SUGGESTED_PROMPTS.operations);
	return `
		<div class="aicmd-v2-prompts">
			<div class="aicmd-v2-prompts-head">
				<span class="aicmd-v2-prompts-label">Suggested prompts</span>
				<span class="aicmd-v2-prompts-hint">Click to prefill the composer — send when ready</span>
			</div>
			<div class="aicmd-v2-prompts-grid">
				${prompts.map((p, idx) => `
					<button
						class="aicmd-v2-prompt-chip"
						type="button"
						data-aicmdv2-prompt="${idx}"
						data-aicmdv2-prompt-text="${escapeHtml(p.label)}"
					>
						<span class="aicmd-v2-prompt-chip-label">${escapeHtml(p.label)}</span>
						<span class="aicmd-v2-prompt-chip-sub">${escapeHtml(p.sub)}</span>
					</button>
				`).join("")}
			</div>
		</div>
	`;
}

function renderPhase1ContextPanel(state, session, aiContext, escapeHtml) {
	const projectName = aiContext.projectName;
	const readiness = aiContext.readinessScore;
	const assetCount = aiContext.approvedAssets.length;
	const hasIntegrations = aiContext.coveredCount > 0;
	const hasOperations = Boolean(state.data.operations);
	const hasDraft = Boolean(aiContext.recommendations.length || session.messages.length);

	return `
		<div class="aicmd-v2-context">
			<div class="aicmd-v2-context-head">
				<span class="aicmd-v2-context-label">Context &amp; Knowledge</span>
				<span class="aicmd-v2-context-hint">What the specialist can see</span>
			</div>
			<div class="aicmd-v2-context-grid">
				<div class="aicmd-v2-context-item${projectName ? " is-present" : " is-empty"}">
					<span class="aicmd-v2-context-item-label">Project profile</span>
					<span class="aicmd-v2-context-item-value">${projectName ? escapeHtml(projectName) : "Not selected yet"}</span>
				</div>
				<div class="aicmd-v2-context-item${readiness != null ? " is-present" : " is-empty"}">
					<span class="aicmd-v2-context-item-label">Readiness</span>
					<span class="aicmd-v2-context-item-value">${readiness != null ? `${readiness}/100` : "No readiness data yet"}</span>
				</div>
				<div class="aicmd-v2-context-item${assetCount > 0 ? " is-present" : " is-empty"}">
					<span class="aicmd-v2-context-item-label">Approved assets</span>
					<span class="aicmd-v2-context-item-value">${assetCount > 0 ? `${assetCount} asset${assetCount !== 1 ? "s" : ""} ready` : "No approved assets yet"}</span>
				</div>
				<div class="aicmd-v2-context-item${hasIntegrations ? " is-present" : " is-empty"}">
					<span class="aicmd-v2-context-item-label">Integrations</span>
					<span class="aicmd-v2-context-item-value">${hasIntegrations ? `${aiContext.coveredCount} of ${aiContext.coverageTotal} connected` : "No integrations connected yet"}</span>
				</div>
				<div class="aicmd-v2-context-item${hasOperations ? " is-present" : " is-empty"}">
					<span class="aicmd-v2-context-item-label">Operations snapshot</span>
					<span class="aicmd-v2-context-item-value">${hasOperations ? "Available" : "No operations snapshot yet"}</span>
				</div>
				<div class="aicmd-v2-context-item${aiContext.hasLiveIntelligence ? " is-present" : " is-empty"}">
					<span class="aicmd-v2-context-item-label">AI intelligence</span>
					<span class="aicmd-v2-context-item-value">${aiContext.hasLiveIntelligence ? "Live intelligence loaded" : "No campaign brief attached yet"}</span>
				</div>
				<div class="aicmd-v2-context-item${hasDraft ? " is-present" : " is-empty"}">
					<span class="aicmd-v2-context-item-label">Previous AI outputs</span>
					<span class="aicmd-v2-context-item-value">${hasDraft ? `${session.messages.length} message${session.messages.length !== 1 ? "s" : ""} in session` : "No recent AI output yet"}</span>
				</div>
				<div class="aicmd-v2-context-item${aiContext.campaign && aiContext.campaign !== "Not selected" ? " is-present" : " is-empty"}">
					<span class="aicmd-v2-context-item-label">Active campaign</span>
					<span class="aicmd-v2-context-item-value">${aiContext.campaign && aiContext.campaign !== "Not selected" ? escapeHtml(aiContext.campaign) : "No campaign brief attached yet"}</span>
				</div>
			</div>
		</div>
	`;
}

function renderPhase1SafetyPanel(escapeHtml) {
	return `
		<div class="aicmd-v2-safety">
			<div class="aicmd-v2-safety-head">
				<span class="aicmd-v2-safety-icon">🔒</span>
				<span class="aicmd-v2-safety-label">How this workspace operates</span>
			</div>
			<div class="aicmd-v2-safety-rules">
				<div class="aicmd-v2-safety-rule">
					<span class="aicmd-v2-safety-bullet">●</span>
					<span>Guidance only — no execution happens from this workspace without confirmation.</span>
				</div>
				<div class="aicmd-v2-safety-rule">
					<span class="aicmd-v2-safety-bullet">●</span>
					<span>Drafts are not execution — prepared content stays local until you act on it.</span>
				</div>
				<div class="aicmd-v2-safety-rule">
					<span class="aicmd-v2-safety-bullet">●</span>
					<span>Publishing, approval, and workflow runs require your explicit confirmation in the right workspace.</span>
				</div>
				<div class="aicmd-v2-safety-rule">
					<span class="aicmd-v2-safety-bullet">●</span>
					<span>Backend owns authority — AI Command prepares guidance and routes. It does not override execution controls.</span>
				</div>
			</div>
		</div>
	`;
}

// ============================================================

export const aiCommandRoute = {
	id: "ai-command",
   disableStandardLayout: true,
	meta: {
		eyebrow: "AI & Build",
		title: "AI Workspace",
		description: "Talk to your AI team, run structured tasks, and turn intelligence into action."
	},
	template: `
		<section class="page is-active" data-page="ai-command">
			<div id="ctrlRoomRoot"></div>
		</section>
	`,
	render(context) {
		const {
			getState,
			$,
			escapeHtml,
			navigateTo,
			showMessage,
			fetchProjectInsights,
			fetchProjectLearning,
			reloadProjectData
		} = context;

		const state = getState();
		const projectName = asString(selectCurrentProject(state) || "");
		const sessionKey = projectName || "__default__";
		const session = ensureSession(sessionKey);
		hydrateSessionDraft(sessionKey, session);
		if (!session.outputPreview) {
			const savedOutput = asObject(loadLocalOutput(sessionKey));
			const preview = asObject(savedOutput.preview);
			if (preview.outputType) session.outputPreview = preview;
		}

		// ── HOME → AI COMMAND BRIDGE ────────────────────────────────
		// Consume prompt set by home.js handleAiRoleClick via quickCommandInput.
		// Once consumed we clear the global input so re-renders are idempotent.
		const globalInput = $("quickCommandInput");
		const bridgeValue = asString(globalInput?.value || "").trim();
		if (bridgeValue) {
			const detectedSpecialist = detectSpecialistFromBridgePrompt(bridgeValue);
			if (detectedSpecialist) session.modeId = detectedSpecialist;
			session.draftMessage = bridgeValue;
			persistSessionDraft(sessionKey, session, "Specialist context loaded from workspace");
			if (globalInput) globalInput.value = "";
		}
		// ─────────────────────────────────────────────────────────────

		const payload = asObject(selectProjectPayload(state));
		const overview = asObject(payload.overview?.overview || payload.overview);
		const readiness = asObject(payload.readiness?.dashboard || payload.readiness);
		const operations = asObject(selectOperationsSnapshot(state));
		const readinessScore = readiness.readiness_score ?? overview.readiness_score ?? null;

		const intelligenceStatus = session.intelligence.status || "idle";
		const aiContext = buildUnifiedAiContext(state, session.intelligence);

		const root = $("ctrlRoomRoot");
		if (!root) return;

		root.innerHTML = `
			<div class="aicmd-v2-shell">
				${renderPhase1Header(session, projectName, escapeHtml)}
				<div class="aicmd-v2-body">
					${renderPhase1TeamRail(session, escapeHtml)}
					<main class="aicmd-v2-main">
						${renderPhase1Profile(session, escapeHtml)}
						${renderPhase1Composer(session, escapeHtml)}
						${renderPhase2PreviewPanel(session, escapeHtml)}
						${renderPhase1SuggestedPrompts(session, escapeHtml)}
						${renderPhase2MediaStatusPanel(aiContext, escapeHtml)}
						${renderPhase1ContextPanel(state, session, aiContext, escapeHtml)}
						${renderPhase1SafetyPanel(escapeHtml)}
					</main>
				</div>
			</div>
		`;

		const input = $("aicmdV2Input");
		const statusEl = $("aicmdV2Status");

		const updateStatus = (msg) => {
			if (statusEl) statusEl.textContent = msg;
		};

		const setPreviewFromIntent = (intent, fallbackPrompt = "") => {
			const value = asString(input?.value || session.draftMessage || fallbackPrompt || "").trim();
			if (!value) {
				updateStatus("Please write your request in the composer first.");
				input?.focus?.();
				return null;
			}

			session.draftMessage = value;
			session.outputPreview = buildPhase2OutputPreview({
				intent,
				session,
				prompt: value,
				projectName
			});
			persistSessionDraft(sessionKey, session, "Draft saved locally");
			aiCommandRoute.render(context);
			return session.outputPreview;
		};

		// ── TEAM RAIL: SPECIALIST SELECTION ─────────────────────────
		Array.from(document.querySelectorAll("[data-aicmdv2-specialist]")).forEach((btn) => {
			btn.onclick = () => {
				const specId = btn.getAttribute("data-aicmdv2-specialist") || "operations";
				session.modeId = specId;
				session.teamMode = "solo";
				const spec = getPhase1SpecialistById(specId);
				if (!session.draftMessage) {
					session.draftMessage = "";
				}
				persistSessionDraft(sessionKey, session, `${spec.label} selected`);
				aiCommandRoute.render(context);
			};
		});

		// ── SOLO / TEAM TOGGLE ───────────────────────────────────────
		Array.from(document.querySelectorAll("[data-aicmdv2-team-mode]")).forEach((btn) => {
			btn.onclick = () => {
				const mode = btn.getAttribute("data-aicmdv2-team-mode") || "solo";
				session.teamMode = mode;
				persistSessionDraft(sessionKey, session, mode === "team" ? "Full Team mode activated" : "Solo Specialist mode activated");
				aiCommandRoute.render(context);
			};
		});

		// ── SUGGESTED PROMPTS: PREFILL ONLY ─────────────────────────
		Array.from(document.querySelectorAll("[data-aicmdv2-prompt]")).forEach((btn) => {
			btn.onclick = () => {
				const text = asString(btn.getAttribute("data-aicmdv2-prompt-text") || "");
				if (!text) return;
				session.draftMessage = text;
				if (input) input.value = text;
				persistSessionDraft(sessionKey, session, "Suggested prompt loaded — review and send when ready");
				updateStatus("Suggested prompt loaded into composer. Review it, then use Prepare Guidance.");
				input?.focus?.();
			};
		});

		// ── INPUT HANDLING ───────────────────────────────────────────
		if (input) {
			input.oninput = () => {
				session.draftMessage = input.value || "";
				persistSessionDraft(sessionKey, session, "Draft auto-saved locally");
			};

			input.onkeydown = (event) => {
				if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
					event.preventDefault();
					$("aicmdV2PrepareBtn")?.click?.();
				}
			};
		}

		// ── PREPARE GUIDANCE (primary action) ───────────────────────
		// Phase 1: stages draft locally, does NOT execute backend AI command.
		const prepareBtn = $("aicmdV2PrepareBtn");
		if (prepareBtn) {
			prepareBtn.onclick = () => {
				const preview = setPreviewFromIntent("guidance");
				if (!preview) return;
				const specLabel = session.teamMode === "team" ? "Team" : getPhase1SpecialistById(session.modeId).label;
				showMessage?.(`${specLabel} guidance preview prepared.`);
			};
		}

		// ── DRAFT TASK (secondary action) ────────────────────────────
		// Phase 1: prefills a task-framed version of the prompt. No backend execution.
		const draftTaskBtn = $("aicmdV2DraftTaskBtn");
		if (draftTaskBtn) {
			draftTaskBtn.onclick = () => {
				const value = asString(input?.value || session.draftMessage || "").trim();
				const spec = getPhase1SpecialistById(session.modeId);
				const taskPrompt = value
					? `Draft a task plan for: ${value}`
					: `Draft a task plan for the next best action for ${projectName || "this project"} with ${spec.label}.`;
				if (input) input.value = taskPrompt;
				session.draftMessage = taskPrompt;
				setPreviewFromIntent("task", taskPrompt);
				updateStatus("Task draft preview prepared locally. Review before creating durable tasks.");
				showMessage?.("Task draft preview prepared.");
			};
		}

		// ── DRAFT WORKFLOW (secondary action) ────────────────────────
		const draftWorkflowBtn = $("aicmdV2DraftWorkflowBtn");
		if (draftWorkflowBtn) {
			draftWorkflowBtn.onclick = () => {
				const value = asString(input?.value || session.draftMessage || "").trim();
				const spec = getPhase1SpecialistById(session.modeId);
				const workflowPrompt = value
					? `Draft a workflow sequence for: ${value}`
					: `Draft a workflow sequence for ${projectName || "this project"} with ${spec.label}.`;
				if (input) input.value = workflowPrompt;
				session.draftMessage = workflowPrompt;
				setPreviewFromIntent("workflow", workflowPrompt);
				updateStatus("Workflow draft preview prepared locally. No workflow run started.");
				showMessage?.("Workflow draft preview prepared.");
			};
		}

		// ── PREPARE HANDOFF (secondary action) ───────────────────────
		// Phase 1: frames a handoff prompt in the composer. No backend write.
		const handoffBtn = $("aicmdV2HandoffBtn");
		if (handoffBtn) {
			handoffBtn.onclick = () => {
				const value = asString(input?.value || session.draftMessage || "").trim();
				const spec = getPhase1SpecialistById(session.modeId);
				const handoffPrompt = value
					? `Prepare a handoff summary for: ${value}`
					: `Prepare a handoff summary from ${spec.label} for the current project state of ${projectName || "this project"}.`;
				if (input) input.value = handoffPrompt;
				session.draftMessage = handoffPrompt;
				setPreviewFromIntent("handoff", handoffPrompt);
				updateStatus("Handoff preview prepared locally. Review destination before sending.");
				showMessage?.("Handoff preview prepared.");
			};
		}

		// ── SAVE DRAFT ───────────────────────────────────────────────
		const saveBtn = $("aicmdV2SaveBtn");
		if (saveBtn) {
			saveBtn.onclick = () => {
				session.draftMessage = asString(input?.value || session.draftMessage || "");
				persistSessionDraft(sessionKey, session, "Draft saved locally");
				updateStatus("Composer draft saved locally.");
				showMessage?.("Composer draft saved locally.");
			};
		}

		// ── CLEAR ────────────────────────────────────────────────────
		const clearBtn = $("aicmdV2ClearBtn");
		if (clearBtn) {
			clearBtn.onclick = () => {
				session.draftMessage = "";
				if (input) input.value = "";
				persistSessionDraft(sessionKey, session, "Draft cleared");
				updateStatus("Composer draft cleared.");
				showMessage?.("Composer draft cleared.");
			};
		}

		// ── PREVIEW ACTIONS (Phase 2 safe actions) ───────────────────
		const previewCopyBtn = $("aicmdV2PreviewCopyBtn");
		if (previewCopyBtn) {
			previewCopyBtn.onclick = async () => {
				const output = asObject(session.outputPreview);
				if (!output.outputType) return;
				const specialistLabel = session.teamMode === "team"
					? "Full Team"
					: getPhase1SpecialistById(output.specialistId || session.modeId).label;
				const text = buildPreviewText(output, specialistLabel);
				if (!text) return;
				try {
					if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
						await navigator.clipboard.writeText(text);
						updateStatus("Preview copied to clipboard.");
						showMessage?.("Preview copied.");
					} else {
						updateStatus("Clipboard is not available in this browser context.");
					}
				} catch (_) {
					updateStatus("Copy failed. Clipboard access may be blocked.");
				}
			};
		}

		const previewUseBtn = $("aicmdV2PreviewUseBtn");
		if (previewUseBtn) {
			previewUseBtn.onclick = () => {
				const output = asObject(session.outputPreview);
				if (!output.outputType) return;
				const specialistLabel = session.teamMode === "team"
					? "Full Team"
					: getPhase1SpecialistById(output.specialistId || session.modeId).label;
				const text = buildPreviewText(output, specialistLabel);
				session.draftMessage = text;
				if (input) {
					input.value = text;
					input.focus();
				}
				persistSessionDraft(sessionKey, session, "Preview inserted into composer");
				updateStatus("Preview inserted into composer for refinement.");
			};
		}

		const previewSendBtn = $("aicmdV2PreviewSendBtn");
		if (previewSendBtn) {
			previewSendBtn.onclick = () => {
				const output = asObject(session.outputPreview);
				const destination = asString(output.destinationRoute || "").trim();
				if (!destination) {
					updateStatus("No destination route is available for this preview.");
					return;
				}

				const handoffRecord = {
					id: `aicmd-preview-${Date.now()}`,
					source_page: "ai-command",
					destination_page: destination,
					status: "available",
					created_at: nowIso(),
					payload: {
						prompt: output.sourcePrompt,
						draft_context: {
							projectName: projectName || "",
							modeId: output.specialistId || session.modeId,
							lastCommand: output.sourcePrompt || "",
							lastResponseTitle: output.title || "",
							routeSuggestions: [{ route: destination, label: routeLabel(destination), reason: "Phase 2 preview destination" }],
							phase2_output_preview: output
						}
					}
				};

				setSharedAiDraft(projectName || "__default__", handoffRecord.payload.draft_context);
				setSharedHandoff(projectName || "__default__", destination, handoffRecord);
				showMessage?.("Draft context prepared. Review before saving or executing.");
				navigateTo(destination);
			};
		}

		const previewSaveBtn = $("aicmdV2PreviewSaveBtn");
		if (previewSaveBtn) {
			previewSaveBtn.onclick = () => {
				const output = asObject(session.outputPreview);
				if (!output.outputType) return;
				const saved = saveLocalOutput(sessionKey, {
					preview: output,
					modeId: session.modeId,
					teamMode: session.teamMode
				});
				updateStatus(`Preview saved locally ${formatTime(saved.updatedAt)}.`);
				showMessage?.("Preview saved locally.");
			};
		}

		const previewReadBtn = $("aicmdV2PreviewReadBtn");
		if (previewReadBtn) {
			previewReadBtn.onclick = () => {
				const output = asObject(session.outputPreview);
				if (!output.outputType) return;
				if (typeof speechSynthesis === "undefined" || typeof SpeechSynthesisUtterance === "undefined") {
					updateStatus("Read preview is not supported in this browser.");
					return;
				}
				const previewText = [humanizeValue(output.title), humanizeValue(output.summary)]
					.filter(Boolean)
					.join(". ");
				const utterance = new SpeechSynthesisUtterance(previewText || "Draft preview ready.");
				speechSynthesis.cancel();
				speechSynthesis.speak(utterance);
				updateStatus("Reading preview locally in browser.");
			};
		}

		const previewClearBtn = $("aicmdV2PreviewClearBtn");
		if (previewClearBtn) {
			previewClearBtn.onclick = () => {
				session.outputPreview = null;
				aiCommandRoute.render(context);
				showMessage?.("Preview cleared.");
			};
		}

		// ── LOAD INTELLIGENCE if needed ──────────────────────────────
		if (projectName && session.intelligence.status === "idle") {
			ensureIntelligenceLoaded({
				projectName,
				session,
				getState,
				reloadProjectData,
				fetchProjectInsights,
				fetchProjectLearning,
				rerender: () => aiCommandRoute.render(context)
			}).catch(() => {});
		}
	}
};

import {
	getSharedHandoff,
	setSharedAiDraft,
	setSharedHandoff
} from "../shared-context.js";
import {
	buildSystemIntelligence,
} from "../system-intelligence.js";
import {
	buildAutomationPlan,
	runAutomationPlan,
	createAutoModeController,
	getAutoModeState,
	startAutoMode,
	stopAutoMode,
	approveCurrentGate,
	skipCurrentStep,
	subscribeAutoMode
} from "../automation-engine.js";

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
	research: "researcher"
};

// 4 quick-action prompts shown in the composer
const QUICK_ACTIONS = [
	{ icon: "🚀", label: "Launch Campaign", sub: "Build a campaign plan", template: "Build a launch campaign for {project}. Map the channels, offer, phases, and required assets." },
	{ icon: "✍️", label: "Generate Content", sub: "Write hooks, captions & scripts", template: "Generate content for {project}. Create hooks, caption ideas, and a reel script for the next product push." },
	{ icon: "📊", label: "Analyze Performance", sub: "Review what's working", template: "Analyze current performance for {project}. What content, campaigns, and channels are working best right now?" },
	{ icon: "🔧", label: "Fix Readiness", sub: "Close critical gaps", template: "What are the critical readiness gaps for {project} and what exactly needs to be done to fix them?" }
];

const AI_COMMAND_LOCAL_DRAFTS_KEY = "mh-ai-command-local-drafts-v1";

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

// ============================================================
//  HELPERS
// ============================================================

function asArray(value) {
	return Array.isArray(value) ? value : [];
}

function asObject(value) {
	return value && typeof value === "object" ? value : {};
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
					<div class="ctrl-room-eyebrow">AI Team</div>
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
						<label>Task type</label>
						<select id="ctrlTaskType" class="ctrl-task-select">
							<option value="launch"${session.taskType === "launch" ? " selected" : ""}>🚀 Launch Campaign</option>
							<option value="content"${session.taskType === "content" ? " selected" : ""}>✍️ Generate Content</option>
							<option value="analyze"${session.taskType === "analyze" ? " selected" : ""}>📊 Analyze Performance</option>
							<option value="fix"${session.taskType === "fix" ? " selected" : ""}>🔧 Fix Readiness</option>
						</select>
					</div>
					<div class="ctrl-task-field">
						<label>Product / focus area</label>
						<select id="ctrlProductSelect" class="ctrl-task-select">
							<option value="">— whole project —</option>
							${productOptions.map((opt) => `<option value="${escapeHtml(opt)}"${session.taskProduct === opt ? " selected" : ""}>${escapeHtml(opt)}</option>`).join("")}
						</select>
					</div>
					<div class="ctrl-task-field">
						<label>Channel</label>
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
				<div class="ctrl-composer-hint">Ctrl / Cmd + Enter to send · Suggested prompts prefill only — send to execute</div>
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

function buildSuggestedCommands(aiContext, globalIntelligence = null) {
	const suggestions = [];

	if (aiContext.criticalGaps.length || aiContext.importantGaps.length) {
		suggestions.push({
			title: "Close setup gaps",
			reason: `${aiContext.criticalGaps.length} critical and ${aiContext.importantGaps.length} important setup gap${aiContext.importantGaps.length + aiContext.criticalGaps.length === 1 ? "" : "s"} detected.`,
			commandType: "strategy",
			command: `Audit setup readiness for ${aiContext.projectName || "this project"}. Rank gaps by risk and define exact remediation steps.`,
			chips: buildImpactChips(["Launch readiness", "Campaign"]),
			score: 100
		});
	}

	if (aiContext.assetBlockers.length) {
		suggestions.push({
			title: "Fix missing assets",
			reason: `${aiContext.assetBlockers.length} asset blocker${aiContext.assetBlockers.length === 1 ? "" : "s"} can slow content and campaign execution.`,
			commandType: "asset",
			command: `List missing or blocked assets for ${aiContext.projectName || "this project"}, grouped by urgency and destination workspace.`,
			chips: buildImpactChips(["Assets", "Content", "Campaign"]),
			score: 92
		});
	}

	if (aiContext.missingIntegrations.length || aiContext.connectorIssues.length) {
		suggestions.push({
			title: "Repair missing integrations",
			reason: `${aiContext.missingIntegrations.length} missing coverage lane${aiContext.missingIntegrations.length === 1 ? "" : "s"} and ${aiContext.connectorIssues.length} connector issue${aiContext.connectorIssues.length === 1 ? "" : "s"}.`,
			commandType: "integration",
			command: `Propose an integration repair sequence for ${aiContext.projectName || "this project"} with expected readiness impact per connector.`,
			chips: buildImpactChips(["Integrations", "Automation", "Launch readiness"]),
			score: 88
		});
	}

	if (!aiContext.campaign || aiContext.campaign === "Not selected" || (aiContext.readinessScore != null && aiContext.readinessScore < 85)) {
		suggestions.push({
			title: "Sharpen campaign readiness",
			reason: "Campaign orchestration is still under-defined or below optimal readiness.",
			commandType: "campaign",
			command: `Build a campaign readiness plan for ${aiContext.projectName || "this project"} with milestones, owners, and go/no-go criteria.`,
			chips: buildImpactChips(["Campaign", "Launch readiness", "Automation"]),
			score: 84
		});
	}

	suggestions.push({
		title: "Generate content production brief",
		reason: "Maintain output velocity by translating current context into ready-to-produce content tasks.",
		commandType: "content",
		command: `Generate a content production brief for ${aiContext.projectName || "this project"} for the next seven days across priority channels.`,
		chips: buildImpactChips(["Content", "Campaign"]),
		score: 70
	});

	const intelligence = globalIntelligence || buildSystemIntelligence({ data: {}, context: {} });
	const sourceActions = asArray(intelligence.recommendations).filter((item) => {
		const target = asString(item?.targetPage).toLowerCase();
		const related = asArray(item?.relatedPages).map((entry) => asString(entry).toLowerCase());
		return target === "ai-command" || related.includes("ai-command") || related.includes("workflows") || related.includes("publishing");
	});

	asArray(sourceActions).slice(0, 2).forEach((action, index) => {
		const item = asObject(action);
		const title = humanizeValue(item.title, "Run global intelligence action");
		const reason = humanizeValue(item.reason, "System intelligence recommendation.");
		const prompt = humanizeValue(item?.draftPayload?.prompt, `Plan and execute: ${title}.`);
		suggestions.push({
			title,
			reason,
			commandType: "automation",
			command: prompt,
			chips: buildImpactChips(["Launch readiness", "Automation"]),
			score: 95 - index
		});
	});

	return suggestions
		.filter((item, index, arr) => arr.findIndex((candidate) => candidate.title === item.title) === index)
		.sort((a, b) => b.score - a.score)
		.slice(0, 3);
}

function renderImpactChips(chips, escapeHtml) {
	return asArray(chips).map((chip) => `
		<span class="aicmd-chip${chip.active ? " is-active" : ""}">${escapeHtml(chip.label)}</span>
	`).join("");
}

function renderOverviewSection(aiContext, session, intelligenceStatus, escapeHtml) {
	const lastUser = getLastUserMessage(session);
	const lastAssistant = getLastAssistantMessage(session);
	const readiness = aiContext.readinessScore != null ? `${aiContext.readinessScore}/100` : "--";
	const modeMeta = getModeMeta(session.modeId);
	const resultSummary = humanizeValue(lastAssistant?.response?.title || lastAssistant?.response?.summary, "No result yet");
	const lastCommand = humanizeValue(lastUser?.content, "No command yet");
	const statusLabel = intelligenceStatus === "ready"
		? "Live"
		: intelligenceStatus === "loading"
			? "Syncing"
			: intelligenceStatus === "error"
				? "Limited"
				: "Idle";

	return `
		<section class="aicmd-section aicmd-overview">
			<div class="aicmd-section-head">
				<h3>AI Command Overview</h3>
				<button id="aicmdRefreshBtn" class="aicmd-btn aicmd-btn-ghost" type="button">Refresh intelligence</button>
			</div>
			<div class="aicmd-overview-grid">
				<div class="aicmd-stat"><span>Current project</span><strong>${escapeHtml(aiContext.projectName || "Not selected")}</strong></div>
				<div class="aicmd-stat"><span>Current readiness</span><strong>${escapeHtml(readiness)}</strong></div>
				<div class="aicmd-stat"><span>Active campaign</span><strong>${escapeHtml(aiContext.campaign || "Not selected")}</strong></div>
				<div class="aicmd-stat"><span>System mode</span><strong>${escapeHtml(modeMeta.label)} · ${escapeHtml(statusLabel)}</strong></div>
				<div class="aicmd-stat aicmd-stat-wide"><span>Last command</span><strong>${escapeHtml(lastCommand)}</strong></div>
				<div class="aicmd-stat aicmd-stat-wide"><span>Last result</span><strong>${escapeHtml(resultSummary)}</strong></div>
			</div>
		</section>
	`;
}

function renderSmartRecommendationSection(aiContext, session, autoMode, escapeHtml) {
	const smartRec = buildSmartRecommendation(aiContext);
	const autoProgress = aiAutomationState.progress || "";
	const autoResult = aiAutomationState.result || "";
	const autoPlan = asArray(session.autoPlanDraft);
	const gate = asObject(autoMode?.approvalRequiredStep);
	return `
		<section class="aicmd-section aicmd-recommendation">
			<div class="aicmd-section-head">
				<h3>Smart Recommendation</h3>
			</div>
			<div class="aicmd-rec-title">${escapeHtml(smartRec.title)}</div>
			<p class="aicmd-rec-reason">${escapeHtml(smartRec.reason)}</p>
			<div class="aicmd-chip-row">${renderImpactChips(smartRec.chips, escapeHtml)}</div>
			<div class="aicmd-action-row">
				<button id="aicmdRunSuggestionBtn" class="aicmd-btn aicmd-btn-primary" type="button">Run Suggested Command</button>
				<button id="aicmdRunSuggestedPlanBtn" class="aicmd-btn aicmd-btn-secondary" type="button">Run Suggested Plan</button>
				<button id="aicmdSaveSuggestionBtn" class="aicmd-btn aicmd-btn-ghost" type="button">Save as Draft</button>
			</div>
			<div class="aicmd-action-row">
				<button id="aicmdRunThroughAutoBtn" class="aicmd-btn aicmd-btn-secondary" type="button">Run This Command Through Auto Mode</button>
				<button id="aicmdSaveAutoPlanBtn" class="aicmd-btn aicmd-btn-ghost" type="button">Save as Auto Plan</button>
				<button id="aicmdExplainGatesBtn" class="aicmd-btn aicmd-btn-ghost" type="button">Explain Approval Gates</button>
				<button id="aicmdAutoStopBtn" class="aicmd-btn aicmd-btn-ghost" type="button">Stop Auto Mode</button>
			</div>
			<div class="aicmd-draft-state">Auto Mode status: ${escapeHtml(autoMode?.status || "idle")}</div>
			<div class="aicmd-draft-state">Auto plan steps: ${escapeHtml(String(autoPlan.length))}</div>
			<div class="aicmd-draft-state">Current step: ${escapeHtml(asArray(autoMode?.currentPlan)[autoMode?.currentStepIndex]?.action || "None")}</div>
			${autoMode?.status === "waiting_approval" ? `
				<div class="aicmd-draft-state"><strong>Approval needed:</strong> ${escapeHtml(gate.reason || "Manual approval required.")}</div>
				<div class="aicmd-draft-state">${escapeHtml(gate.whatWillHappen || "Auto Mode paused at gate.")}</div>
				<div class="aicmd-action-row">
					<button id="aicmdAutoApproveBtn" class="aicmd-btn aicmd-btn-secondary" type="button">Approve and Continue</button>
					<button id="aicmdAutoSkipBtn" class="aicmd-btn aicmd-btn-secondary" type="button">Skip Step</button>
				</div>
			` : ""}
			<div class="aicmd-draft-state">${escapeHtml(asArray(autoMode?.logs).slice(-3).map((entry) => `${entry.level || "info"}: ${entry.message || ""}`).join(" | ") || "No logs yet")}</div>
			<div class="aicmd-draft-state">${escapeHtml(autoProgress)}</div>
			<div class="aicmd-draft-state">${escapeHtml(autoResult)}</div>
		</section>
	`;
}

function renderComposerSection(session, aiContext, escapeHtml) {
	return `
		<section class="aicmd-section">
			<div class="aicmd-section-head"><h3>Command Composer</h3></div>
			<div class="aicmd-input-grid">
				<div>
					<label class="aicmd-label" for="aicmdCommandType">Command type</label>
					<select id="aicmdCommandType" class="aicmd-select">
						${COMMAND_TYPES.map((item) => `<option value="${escapeHtml(item.id)}"${session.commandType === item.id ? " selected" : ""}>${escapeHtml(item.label)}</option>`).join("")}
					</select>
				</div>
				<div>
					<label class="aicmd-label" for="aicmdTargetType">Target</label>
					<select id="aicmdTargetType" class="aicmd-select">
						${TARGET_TYPES.map((item) => `<option value="${escapeHtml(item.id)}"${session.targetType === item.id ? " selected" : ""}>${escapeHtml(item.label)}</option>`).join("")}
					</select>
				</div>
			</div>
			<div>
				<label class="aicmd-label" for="aicmdTargetValue">Target detail</label>
				<input id="aicmdTargetValue" class="aicmd-input" type="text" placeholder="Optional campaign/product/context" value="${escapeHtml(session.targetValue || "")}">
			</div>
			<div>
				<label class="aicmd-label" for="ctrlComposerInput">Prompt</label>
				<textarea id="ctrlComposerInput" class="aicmd-textarea" rows="8" placeholder="Describe exactly what the AI Operating Center should do next for ${escapeHtml(aiContext.projectName || "this project")}.">${escapeHtml(session.draftMessage || "")}</textarea>
				<div id="aicmdValidation" class="aicmd-validation${session.validationMessage ? " is-visible" : ""}">${escapeHtml(session.validationMessage || "")}</div>
			</div>
			<div class="aicmd-action-row">
				<button id="aiCommandSendBtn" class="aicmd-btn aicmd-btn-primary" type="button">Run</button>
				<button id="aicmdSaveDraftBtn" class="aicmd-btn aicmd-btn-ghost" type="button">Save Draft</button>
				<button id="aicmdClearBtn" class="aicmd-btn aicmd-btn-ghost" type="button">Clear</button>
				<button id="aicmdLoadSuggestionBtn" class="aicmd-btn aicmd-btn-ghost" type="button">Load Suggestion</button>
			</div>
			<div class="aicmd-draft-state">${escapeHtml(session.draftStatus || "Draft auto-saves locally while you type.")}</div>
		</section>
	`;
}

function renderSuggestedCommandsSection(aiContext, globalIntelligence, escapeHtml) {
	const suggestions = buildSuggestedCommands(aiContext, globalIntelligence);
	return `
		<section class="aicmd-section">
			<div class="aicmd-section-head"><h3>Suggested Commands</h3></div>
			<div class="aicmd-suggestions">
				${suggestions.map((item, index) => `
					<article class="aicmd-suggestion-card">
						<h4>${escapeHtml(item.title)}</h4>
						<p>${escapeHtml(item.reason)}</p>
						<div class="aicmd-chip-row">${renderImpactChips(item.chips, escapeHtml)}</div>
						<div class="aicmd-action-row">
							<button class="aicmd-btn aicmd-btn-secondary" type="button" data-aicmd-use-suggestion="${index}">Use</button>
							<button class="aicmd-btn aicmd-btn-ghost" type="button" data-aicmd-save-suggestion="${index}">Save Draft</button>
						</div>
					</article>
				`).join("")}
			</div>
		</section>
	`;
}

function renderSpecialistAgentsSection(escapeHtml) {
	return `
		<section class="aicmd-section">
			<div class="aicmd-section-head"><h3>Specialist Agents</h3></div>
			<div class="aicmd-agent-grid">
				${AGENT_CARDS.map((agent) => `
					<article class="aicmd-agent-card">
						<h4>${escapeHtml(agent.name)}</h4>
						<div class="aicmd-agent-meta"><span>Purpose</span><p>${escapeHtml(agent.purpose)}</p></div>
						<div class="aicmd-agent-meta"><span>Best use</span><p>${escapeHtml(agent.bestUse)}</p></div>
						<div class="aicmd-agent-meta"><span>Suggested prompt</span><p>${escapeHtml(agent.suggestedPrompt)}</p></div>
						<button class="aicmd-btn aicmd-btn-secondary" type="button" data-aicmd-start-agent="${escapeHtml(agent.id)}">Start with this agent</button>
					</article>
				`).join("")}
			</div>
		</section>
	`;
}

function renderOutputSection(session, escapeHtml) {
	const lastAssistant = getLastAssistantMessage(session);
	if (!lastAssistant) {
		return `
			<section class="aicmd-section">
				<div class="aicmd-section-head"><h3>Output / Result</h3></div>
				<div class="aicmd-empty-state">No result yet. Run a command to generate an output.</div>
				<div class="aicmd-action-row">
					<button class="aicmd-btn aicmd-btn-ghost" type="button" disabled>Copy Result</button>
					<button class="aicmd-btn aicmd-btn-ghost" type="button" disabled>Send to Workflow (coming soon)</button>
					<button class="aicmd-btn aicmd-btn-ghost" type="button" disabled>Send to Campaign (coming soon)</button>
					<button class="aicmd-btn aicmd-btn-ghost" type="button" disabled>Send to Content Studio (coming soon)</button>
				</div>
			</section>
		`;
	}

	return `
		<section class="aicmd-section">
			<div class="aicmd-section-head">
				<h3>Output / Result</h3>
				<span class="aicmd-result-time">${escapeHtml(formatTime(lastAssistant.createdAt))}</span>
			</div>
			${renderCleanResponse(asObject(lastAssistant.response), escapeHtml, lastAssistant.id)}
			<div class="aicmd-action-row">
				<button id="aicmdCopyResultBtn" class="aicmd-btn aicmd-btn-secondary" type="button">Copy Result</button>
				<button class="aicmd-btn aicmd-btn-ghost" type="button" data-aicmd-output-route="workflows">Send to Workflow</button>
				<button class="aicmd-btn aicmd-btn-ghost" type="button" data-aicmd-output-route="campaign-studio">Send to Campaign</button>
				<button class="aicmd-btn aicmd-btn-ghost" type="button" data-aicmd-output-route="content-studio">Send to Content Studio</button>
			</div>
		</section>
	`;
}

function renderAiOperatingCenter(aiContext, session, intelligenceStatus, globalIntelligence, escapeHtml) {
	const autoMode = getAutoModeState();
	return `
		<div class="aicmd-shell">
			${renderOverviewSection(aiContext, session, intelligenceStatus, escapeHtml)}
			<div class="aicmd-main-grid">
				<div class="aicmd-left-stack">
					${renderSmartRecommendationSection(aiContext, session, autoMode, escapeHtml)}
					${renderComposerSection(session, aiContext, escapeHtml)}
				</div>
				<div class="aicmd-right-stack">
					${renderSuggestedCommandsSection(aiContext, globalIntelligence, escapeHtml)}
					${renderOutputSection(session, escapeHtml)}
				</div>
			</div>
			${renderSpecialistAgentsSection(escapeHtml)}
		</div>
	`;
}

function buildResultCopyText(response) {
	const title = humanizeValue(response?.title, "AI Result");
	const summary = humanizeValue(response?.summary, "");
	const findings = normalizeDisplayList(response?.findings, 10);
	const actions = normalizeDisplayList(response?.nextActions || response?.next_actions, 10);
	return [
		title,
		summary,
		findings.length ? `Findings:\n- ${findings.join("\n- ")}` : "",
		actions.length ? `Next actions:\n- ${actions.join("\n- ")}` : ""
	].filter(Boolean).join("\n\n");
}

function bindAiOperatingCenter({
	$,
	getState,
	navigateTo,
	showMessage,
	showError,
	createProjectHandoff,
	executeProjectAiCommand,
	reloadProjectData,
	fetchProjectInsights,
	fetchProjectLearning,
	render,
	saveProjectAiDraft
}) {
	const state = getState();
	const projectName = state.context.currentProject || "";
	const session = ensureSession(projectName);
	const aiContext = buildUnifiedAiContext(state, session.intelligence);
	const smartRec = buildSmartRecommendation(aiContext);
	const globalIntelligence = buildSystemIntelligence(state);
	const suggestions = buildSuggestedCommands(aiContext, globalIntelligence);
	createAutoModeController(getState, { getState, navigateTo, createProjectHandoff });
	if (aiAutoModeUnsubscribe) aiAutoModeUnsubscribe();
	aiAutoModeUnsubscribe = subscribeAutoMode(() => {
		render();
	});

	function syncSessionInputs() {
		session.commandType = $("aicmdCommandType")?.value || session.commandType;
		session.targetType = $("aicmdTargetType")?.value || session.targetType;
		session.targetValue = $("aicmdTargetValue")?.value || "";
		session.draftMessage = $("ctrlComposerInput")?.value || session.draftMessage || "";
	}

	function setValidation(message) {
		session.validationMessage = message || "";
		const validation = $("aicmdValidation");
		if (!validation) return;
		validation.textContent = session.validationMessage;
		validation.classList.toggle("is-visible", Boolean(session.validationMessage));
	}

	function saveDraftLocal(hint, overridePrompt) {
		syncSessionInputs();
		if (overridePrompt != null) session.draftMessage = overridePrompt;
		persistSessionDraft(projectName, session, hint);
		if (typeof saveProjectAiDraft === "function") {
			Promise.resolve(saveProjectAiDraft(projectName, {
				prompt: session.draftMessage,
				mode_id: session.modeId,
				command_type: session.commandType,
				target_type: session.targetType,
				target_value: session.targetValue
			})).catch(() => {});
		}
	}

	async function runCommandFromPrompt(prompt, source) {
		syncSessionInputs();
		const clean = asString(prompt).trim();
		if (!clean) {
			setValidation("Prompt is required before running a command.");
			const input = $("ctrlComposerInput");
			if (input) input.focus();
			return;
		}
		setValidation("");
		const command = buildCommandEnvelope(session, clean);
		let submitted = { accepted: false, failed: false };
		try {
			submitted = await submitDurableCommand({
				projectName,
				aiContext,
				session,
				command,
				modeId: session.modeId,
				source: source || "control-room",
				executeProjectAiCommand,
				reloadProjectData
			});
		} catch (error) {
			showError?.(error.message || "Failed to execute AI command.");
			return;
		}
		if (!submitted.accepted) {
			setValidation("Prompt is required before running a command.");
			const input = $("ctrlComposerInput");
			if (input) input.focus();
			return;
		}
		if (submitted.failed) {
			showError?.("AI command returned an error. Review the Output section.");
		} else {
			showMessage?.("AI command completed.");
		}
		render();
	}

	function createAndNavigateHandoff(route, prompt, response) {
		const handoffMessage = asString(prompt || "").trim() || humanizeValue(response?.summary || response?.title, "");
		if (!handoffMessage) {
			showError?.("No output is available to hand off yet.");
			return;
		}
		const handoff = {
			source_page: "ai-command",
			destination_page: route,
			payload: {
				prompt: handoffMessage,
				draft_context: {
					projectName,
					modeId: session.modeId,
					lastCommand: handoffMessage,
					lastResponseTitle: asString(response?.title),
					routeSuggestions: asArray(response?.routeSuggestions)
				},
				output: asObject(response)
			},
			status: "available"
		};

		if (route === "workflows") {
			syncAiWorkflowBridge({ projectName, modeId: session.modeId, command: handoffMessage, response });
		}

		setSharedHandoff(projectName, route, handoff);
		createProjectHandoff?.(projectName, handoff).catch((error) => {
			console.warn("Failed to persist AI handoff:", error.message);
		});
		navigateTo(route);
	}

	const composerInput = $("ctrlComposerInput");
	if (composerInput) {
		composerInput.oninput = () => {
			session.draftMessage = composerInput.value || "";
			if (session.validationMessage) setValidation("");
			saveDraftLocal("Auto-saved locally");
		};
		composerInput.onkeydown = (event) => {
			if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
				event.preventDefault();
				runCommandFromPrompt(composerInput.value || session.draftMessage || "", "control-room");
			}
		};
	}

	const commandType = $("aicmdCommandType");
	if (commandType) commandType.onchange = () => saveDraftLocal("Draft updated");

	const targetType = $("aicmdTargetType");
	if (targetType) targetType.onchange = () => saveDraftLocal("Draft updated");

	const targetValue = $("aicmdTargetValue");
	if (targetValue) targetValue.oninput = () => saveDraftLocal("Draft updated");

	const runBtn = $("aiCommandSendBtn");
	if (runBtn) {
		runBtn.onclick = () => runCommandFromPrompt($("ctrlComposerInput")?.value || session.draftMessage || "", "control-room");
	}

	const saveDraftBtn = $("aicmdSaveDraftBtn");
	if (saveDraftBtn) {
		saveDraftBtn.onclick = () => {
			saveDraftLocal("Draft saved");
			showMessage?.("Draft saved.");
			render();
		};
	}

	const clearBtn = $("aicmdClearBtn");
	if (clearBtn) {
		clearBtn.onclick = () => {
			session.draftMessage = "";
			session.validationMessage = "";
			saveDraftLocal("Draft cleared", "");
			showMessage?.("Draft cleared.");
			render();
		};
	}

	const loadSuggestionBtn = $("aicmdLoadSuggestionBtn");
	if (loadSuggestionBtn) {
		loadSuggestionBtn.onclick = () => {
			session.draftMessage = smartRec.command;
			session.commandType = "strategy";
			saveDraftLocal("Suggestion loaded", smartRec.command);
			render();
		};
	}

	const runSuggestionBtn = $("aicmdRunSuggestionBtn");
	if (runSuggestionBtn) {
		runSuggestionBtn.onclick = () => runCommandFromPrompt(smartRec.command, "smart-recommendation");
	}

	const runSuggestedPlanBtn = $("aicmdRunSuggestedPlanBtn");
	if (runSuggestedPlanBtn) {
		runSuggestedPlanBtn.onclick = async () => {
			const plan = buildAutomationPlan(getState());
			if (!plan.length) {
				aiAutomationState.progress = "";
				aiAutomationState.result = "No safe plan steps available.";
				render();
				return;
			}

			const confirmed = window.confirm(`Run suggested automation plan with ${plan.length} safe step(s)?`);
			if (!confirmed) return;

			aiAutomationState.result = "";
			aiAutomationState.progress = `Step 0 / ${plan.length}`;
			render();

			const runResult = await runAutomationPlan(plan, {
				context: { getState, navigateTo, createProjectHandoff, projectName },
				onProgress: ({ index, total, step, result }) => {
					aiAutomationState.progress = `Step ${index} / ${total}: ${step.action} (${result.status})`;
					render();
				}
			});

			aiAutomationState.result = runResult.status === "success"
				? "Suggested automation plan completed."
				: "Suggested automation plan stopped before completion.";
			showMessage?.(aiAutomationState.result);
			render();
		};
	}

	const saveSuggestionBtn = $("aicmdSaveSuggestionBtn");
	if (saveSuggestionBtn) {
		saveSuggestionBtn.onclick = () => {
			session.draftMessage = smartRec.command;
			session.commandType = "strategy";
			saveDraftLocal("Recommendation saved as draft", smartRec.command);
			showMessage?.("Recommendation saved as draft.");
			render();
		};
	}

	const runThroughAutoBtn = $("aicmdRunThroughAutoBtn");
	if (runThroughAutoBtn) {
		runThroughAutoBtn.onclick = async () => {
			syncSessionInputs();
			const command = asString($("ctrlComposerInput")?.value || session.draftMessage || smartRec.command).trim();
			const plan = buildAutoPlanFromCommand(command, session);
			session.autoPlanDraft = plan;
			await startAutoMode(plan, {
				mode: "auto_until_approval",
				context: { getState, navigateTo, createProjectHandoff, projectName }
			});
			showMessage?.("Auto Mode started from AI command.");
		};
	}

	const saveAutoPlanBtn = $("aicmdSaveAutoPlanBtn");
	if (saveAutoPlanBtn) {
		saveAutoPlanBtn.onclick = () => {
			syncSessionInputs();
			const command = asString($("ctrlComposerInput")?.value || session.draftMessage || smartRec.command).trim();
			session.autoPlanDraft = buildAutoPlanFromCommand(command, session);
			setSharedHandoff(projectName, "workflows", {
				source_page: "ai-command",
				destination_page: "workflows",
				status: "available",
				payload: {
					title: "Saved Auto Plan",
					auto_plan: session.autoPlanDraft,
					prompt: command
				}
			});
			saveDraftLocal("Auto plan saved", command);
			showMessage?.("Auto plan saved.");
			render();
		};
	}

	const explainGatesBtn = $("aicmdExplainGatesBtn");
	if (explainGatesBtn) {
		explainGatesBtn.onclick = () => {
			aiAutomationState.result = "Approval gates pause Auto Mode for publishing, final approvals, external sends, paid ads, destructive edits, and credential actions.";
			render();
		};
	}

	const autoStopBtn = $("aicmdAutoStopBtn");
	if (autoStopBtn) {
		autoStopBtn.onclick = () => {
			stopAutoMode();
			showMessage?.("Auto Mode stopped.");
		};
	}

	const autoApproveBtn = $("aicmdAutoApproveBtn");
	if (autoApproveBtn) {
		autoApproveBtn.onclick = async () => {
			await approveCurrentGate({ context: { getState, navigateTo, createProjectHandoff, projectName } });
			showMessage?.("Approval gate accepted.");
		};
	}

	const autoSkipBtn = $("aicmdAutoSkipBtn");
	if (autoSkipBtn) {
		autoSkipBtn.onclick = async () => {
			await skipCurrentStep({ context: { getState, navigateTo, createProjectHandoff, projectName } });
			showMessage?.("Gated step skipped.");
		};
	}

	Array.from(document.querySelectorAll("[data-aicmd-use-suggestion]")).forEach((button) => {
		button.onclick = () => {
			const suggestion = suggestions[Number(button.getAttribute("data-aicmd-use-suggestion"))];
			if (!suggestion) return;
			session.commandType = suggestion.commandType;
			session.draftMessage = suggestion.command;
			saveDraftLocal("Suggestion loaded", suggestion.command);
			render();
		};
	});

	Array.from(document.querySelectorAll("[data-aicmd-save-suggestion]")).forEach((button) => {
		button.onclick = () => {
			const suggestion = suggestions[Number(button.getAttribute("data-aicmd-save-suggestion"))];
			if (!suggestion) return;
			session.commandType = suggestion.commandType;
			session.draftMessage = suggestion.command;
			saveDraftLocal("Suggestion saved", suggestion.command);
			showMessage?.("Suggestion saved as draft.");
			render();
		};
	});

	Array.from(document.querySelectorAll("[data-aicmd-start-agent]")).forEach((button) => {
		button.onclick = () => {
			const agentId = button.getAttribute("data-aicmd-start-agent") || "operations";
			const card = AGENT_CARDS.find((item) => item.id === agentId);
			session.modeId = agentId;
			session.draftMessage = card?.suggestedPrompt || session.draftMessage;
			saveDraftLocal("Agent prompt loaded", session.draftMessage);
			render();
		};
	});

	const copyResultBtn = $("aicmdCopyResultBtn");
	if (copyResultBtn) {
		copyResultBtn.onclick = async () => {
			const lastAssistant = getLastAssistantMessage(session);
			if (!lastAssistant) {
				showError?.("No result available to copy.");
				return;
			}
			const payload = buildResultCopyText(lastAssistant.response);
			try {
				await navigator.clipboard.writeText(payload);
				showMessage?.("Result copied.");
			} catch (_) {
				showError?.("Copy failed. Clipboard permission might be blocked.");
			}
		};
	}

	Array.from(document.querySelectorAll("[data-aicmd-output-route]")).forEach((button) => {
		button.onclick = () => {
			const lastAssistant = getLastAssistantMessage(session);
			const lastUser = getLastUserMessage(session);
			if (!lastAssistant) {
				showError?.("Run a command first to hand off output.");
				return;
			}
			const route = button.getAttribute("data-aicmd-output-route") || "";
			createAndNavigateHandoff(route, lastUser?.content, lastAssistant.response);
		};
	});

	Array.from(document.querySelectorAll("[data-ctrl-route]"))
		.forEach((button) => {
			button.onclick = () => {
				const ownerId = button.getAttribute("data-ctrl-route-owner") || "";
				const message = session.messages.find((item) => item.id === ownerId && item.role === "assistant");
				const route = asArray(message?.response?.routeSuggestions)[Number(button.getAttribute("data-ctrl-route"))];
				if (!route?.route) return;
				const messageIndex = session.messages.findIndex((item) => item.id === ownerId);
				const priorUserMessage = messageIndex > 0
					? session.messages.slice(0, messageIndex).reverse().find((item) => item.role === "user")
					: null;
				createAndNavigateHandoff(route.route, priorUserMessage?.content, message?.response);
			};
		});

	const refreshBtn = $("aicmdRefreshBtn");
	if (refreshBtn) {
		refreshBtn.onclick = async () => {
			session.intelligence.loadedAt = "";
			session.intelligence.status = "idle";
			await ensureIntelligenceLoaded({
				projectName,
				session,
				getState,
				reloadProjectData,
				fetchProjectInsights,
				fetchProjectLearning,
				rerender: render
			});
			showMessage?.("Intelligence refreshed.");
		};
	}

}

// ============================================================
//  BRIDGE
// ============================================================

function rerenderAiWorkspace() {
	if (!lastRenderContext) return;
	const { getState, render } = lastRenderContext;
	const state = getState();
	if (state.currentRoute !== "ai-command") return;
	render();
}

function ensureAiCommandBridge() {
	if (aiCommandBridgeRegistered || typeof window === "undefined") return;

	window.addEventListener("mh:submit-ai-command", async (event) => {
		if (!lastRenderContext) return;
		const detail = asObject(event?.detail);
		const message = asString(detail.message);
		const meta = asObject(detail.meta);
		const { getState, fetchProjectInsights, fetchProjectLearning, reloadProjectData, render, executeProjectAiCommand } = lastRenderContext;
		const state = getState();
		const projectName = state.context.currentProject || "";
		const session = ensureSession(projectName);
		await ensureIntelligenceLoaded({ projectName, session, getState, reloadProjectData, fetchProjectInsights, fetchProjectLearning, rerender: render });
		const aiContext = buildUnifiedAiContext(getState(), session.intelligence);
		let accepted = { accepted: false, failed: false };
		try {
			accepted = await submitDurableCommand({ projectName, aiContext, session, command: message, modeId: meta.modeId || session.modeId, source: meta.source || "external-command", executeProjectAiCommand, reloadProjectData });
		} catch (error) {
			lastRenderContext.showError?.(error.message || "Failed to execute AI command.");
		}
		if (accepted.accepted) rerenderAiWorkspace();
	});

	aiCommandBridgeRegistered = true;
}

// ============================================================
//  BINDING
// ============================================================

function buildTaskCommand(session, projectLabel) {
	const typeMap = {
		launch: `Build a launch campaign for ${projectLabel}`,
		content: `Generate content for ${projectLabel}`,
		analyze: `Analyze current performance for ${projectLabel}`,
		fix: `Identify and fix the critical readiness gaps for ${projectLabel}`
	};
	const base = typeMap[session.taskType] || `Work on ${projectLabel}`;
	const product = session.taskProduct ? ` focusing on ${session.taskProduct}` : "";
	const channel = session.taskChannel ? ` for ${session.taskChannel}` : "";
	return `${base}${product}${channel}. Use the current live intelligence to produce a concrete, actionable plan.`;
}

function bindAiWorkspace({
	$,
	getState,
	navigateTo,
	showMessage,
	showError,
	createProjectHandoff,
	executeProjectAiCommand,
	reloadProjectData,
	render
}) {
	const state = getState();
	const projectName = state.context.currentProject || "";
	const session = ensureSession(projectName);
	const aiContext = buildUnifiedAiContext(state, session.intelligence);

	// Team selector
	Array.from(document.querySelectorAll("[data-ctrl-mode]")).forEach((button) => {
		button.onclick = () => {
			session.modeId = button.getAttribute("data-ctrl-mode") || session.modeId;
			render();
		};
	});

	// Quick action prompts
	Array.from(document.querySelectorAll("[data-ctrl-quick]")).forEach((button) => {
		button.onclick = () => {
			const template = button.getAttribute("data-ctrl-quick-template") || "";
			const input = $("ctrlComposerInput");
			if (input && template) {
				input.value = template;
				session.draftMessage = template;
			}
		};
	});

	// History restore
	Array.from(document.querySelectorAll("[data-ctrl-history]")).forEach((button) => {
		button.onclick = () => {
			const entry = session.history[Number(button.getAttribute("data-ctrl-history"))];
			if (!entry) return;
			session.modeId = entry.modeId;
			session.draftMessage = entry.command;
			render();
		};
	});

	// Route buttons
	Array.from(document.querySelectorAll("[data-ctrl-route]")).forEach((button) => {
		button.onclick = () => {
			const ownerId = button.getAttribute("data-ctrl-route-owner") || "";
			const messageIndex = session.messages.findIndex((item) => item.id === ownerId && item.role === "assistant");
			const message = session.messages.find((item) => item.id === ownerId && item.role === "assistant");
			const route = asArray(message?.response?.routeSuggestions)[Number(button.getAttribute("data-ctrl-route"))];
			if (!route?.route) return;
			const priorUserMessage = messageIndex > 0 ? session.messages.slice(0, messageIndex).reverse().find((item) => item.role === "user") : null;
			const handoffMessage = priorUserMessage?.content || message?.response?.summary || "";

			if (route.route === "workflows") {
				syncAiWorkflowBridge({ projectName, modeId: priorUserMessage?.modeId || session.modeId, command: handoffMessage, response: message?.response });
				const handoff = {
					source_page: "ai-command", destination_page: "workflows",
					payload: {
						prompt: handoffMessage, workflow_title: message?.response?.title || "",
						draft_context: { projectName, modeId: priorUserMessage?.modeId || session.modeId, lastCommand: handoffMessage, lastResponseTitle: message?.response?.title || "", routeSuggestions: asArray(message?.response?.routeSuggestions) },
						output: { summary: message?.response?.summary || "", nextActions: asArray(message?.response?.nextActions) }
					}
				};
				setSharedHandoff(projectName, "workflows", handoff);
				createProjectHandoff?.(projectName, handoff).catch((error) => console.warn("Failed to persist AI-to-workflow handoff:", error.message));
				const globalInput = $("quickCommandInput");
				if (globalInput) globalInput.value = handoffMessage;
			} else {
				const handoff = {
					source_page: "ai-command", destination_page: route.route,
					payload: {
						prompt: handoffMessage,
						draft_context: { projectName, modeId: priorUserMessage?.modeId || session.modeId, lastCommand: handoffMessage, lastResponseTitle: message?.response?.title || "", routeSuggestions: asArray(message?.response?.routeSuggestions) },
						output: message?.response || {}
					},
					status: "available"
				};
				setSharedHandoff(projectName, route.route, handoff);
				createProjectHandoff?.(projectName, handoff).catch((error) => console.warn("Failed to persist AI route handoff:", error.message));
			}
			navigateTo(route.route);
		};
	});

	// Task mode toggle
	Array.from(document.querySelectorAll("[data-ctrl-task-toggle]")).forEach((button) => {
		button.onclick = () => {
			session.taskMode = button.getAttribute("data-ctrl-task-toggle") || "free";
			render();
		};
	});

	// Build task command
	const buildTaskBtn = $("ctrlBuildTaskBtn");
	if (buildTaskBtn) {
		buildTaskBtn.onclick = () => {
			const productSelect = $("ctrlProductSelect");
			const channelSelect = $("ctrlChannelSelect");
			const typeSelect = $("ctrlTaskType");
			if (productSelect) session.taskProduct = productSelect.value || "";
			if (channelSelect) session.taskChannel = channelSelect.value || "";
			if (typeSelect) session.taskType = typeSelect.value || "launch";
			const cmd = buildTaskCommand(session, aiContext.projectName || "this project");
			const input = $("ctrlComposerInput");
			if (input) { input.value = cmd; session.draftMessage = cmd; }
		};
	}

	// Main textarea
	const composerInput = $("ctrlComposerInput");
	if (composerInput) {
		composerInput.value = session.draftMessage || "";
		composerInput.oninput = (event) => { session.draftMessage = event.target.value || ""; };
		composerInput.onkeydown = (event) => {
			if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
				event.preventDefault();
				triggerSend();
			}
		};
	}

	async function triggerSend() {
		const cmd = $("ctrlComposerInput")?.value || session.draftMessage || "";
		let submitted = { accepted: false, failed: false };
		try {
			submitted = await submitDurableCommand({ projectName, aiContext, session, command: cmd, modeId: session.modeId, source: "control-room", executeProjectAiCommand, reloadProjectData });
		} catch (error) {
			showError?.(error.message || "Failed to execute AI command.");
			return;
		}
		if (!submitted.accepted) { showError?.("Enter a command before sending."); return; }
		if (submitted.failed) {
			showError?.("AI Command failed. See the response area for details.");
		} else {
			showMessage?.("AI Team responded using live project intelligence.");
		}
		render();
	}

	const sendBtn = $("ctrlSendBtn");
	if (sendBtn) sendBtn.onclick = triggerSend;

	const clearBtn = $("ctrlClearBtn");
	if (clearBtn) {
		clearBtn.onclick = () => {
			session.messages = [];
			session.history = [];
			session.draftMessage = "";
			showMessage?.("Session cleared.");
			render();
		};
	}

	const globalBtn = $("ctrlGlobalBtn");
	if (globalBtn) {
		globalBtn.onclick = () => {
			const globalInput = $("quickCommandInput");
			if (globalInput) globalInput.value = $("ctrlComposerInput")?.value || session.draftMessage || "";
			showMessage?.("Draft copied to the global bar.");
		};
	}

	const refreshBtn = $("ctrlRefreshBtn");
	if (refreshBtn) {
		refreshBtn.onclick = async () => {
			session.intelligence.loadedAt = "";
			session.intelligence.status = "idle";
			await ensureIntelligenceLoaded({
				projectName, session, getState,
				reloadProjectData: lastRenderContext.reloadProjectData,
				fetchProjectInsights: lastRenderContext.fetchProjectInsights,
				fetchProjectLearning: lastRenderContext.fetchProjectLearning,
				rerender: render
			});
			showMessage?.("Intelligence refreshed.");
		};
	}

	// Scroll chat to bottom
	const chatStream = $("ctrlChatStream");
	if (chatStream) chatStream.scrollTop = chatStream.scrollHeight;
}

// ============================================================
//  ROUTE EXPORT
// ============================================================

export const aiCommandRoute = {
	id: "ai-command",
	meta: {
		eyebrow: "AI & Build",
		title: "AI Team Control Room",
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
			showError,
			reloadProjectData,
			fetchProjectInsights,
			fetchProjectLearning,
			createProjectHandoff,
			consumeProjectHandoff,
			executeProjectAiCommand,
			saveProjectAiDraft
		} = context;

		const render = () => {
			const state = getState();
			const projectName = state.context.currentProject || "";
			const session = ensureSession(projectName);
			session.lastAppliedHandoffId = asString(session.lastAppliedHandoffId);
			hydrateSessionDraft(projectName, session);

			lastRenderContext = { ...context, render };
			ensureAiCommandBridge();
			applyDurableAiHandoff(projectName, state.data.operations, session, consumeProjectHandoff, showMessage);
			ensureIntelligenceLoaded({ projectName, session, getState, reloadProjectData, fetchProjectInsights, fetchProjectLearning, rerender: render });

			const aiContext = buildUnifiedAiContext(state, session.intelligence);
			const globalIntelligence = buildSystemIntelligence(state);
			const intelligenceStatus = session.intelligence.status || "idle";

			const root = $("ctrlRoomRoot");
			if (!root) return;

			root.innerHTML = renderAiOperatingCenter(aiContext, session, intelligenceStatus, globalIntelligence, escapeHtml);

			bindAiOperatingCenter({
				$,
				getState,
				navigateTo,
				showMessage,
				showError,
				createProjectHandoff,
				executeProjectAiCommand,
				reloadProjectData,
				fetchProjectInsights,
				fetchProjectLearning,
				render,
				saveProjectAiDraft
			});
		};

		render();
	}
};

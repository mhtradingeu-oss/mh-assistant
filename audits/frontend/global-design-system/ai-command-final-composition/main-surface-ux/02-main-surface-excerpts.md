# 02 — Main Surface Excerpts

## Top / shell area
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

## Mid render area
	const routeSuggestions = normalizeAiInboundRouteSuggestions(
		asAiInboundList(payload.routeSuggestions).length ? payload.routeSuggestions :
		asAiInboundList(payload.route_suggestions).length ? payload.route_suggestions :
		asAiInboundList(draftContext.routeSuggestions).length ? draftContext.routeSuggestions :
		draftContext.route_suggestions,
		sourcePage,
		sourceLabel
	);
	const teamMode = normalizeAiInboundTeamMode(firstAiInboundId(payload.teamMode, payload.team_mode, draftContext.teamMode, draftContext.team_mode));
	const rawOutputPreview = firstAiInboundObject(
		draftContext.outputPreview,
		draftContext.output_preview,
		draftContext.phase2_output_preview,
		payload.outputPreview,
		payload.output_preview
	);
	const normalized = {
		sourcePage,
		sourceLabel,
		title,
		prompt,
		suggestedSpecialist,
		teamMode,
		routeSuggestions,
		outputPreview: null,
		draftContext: {
			...draftContext,
			source_page: sourcePage,
			sourcePage
		},
		status: asString(handoff?.status || payload.status || "available"),
		note: "Guidance only. No publishing, task creation, CRM updates, customer replies, workflow runs, exports, or backend actions are executed from this handoff."
	};
	normalized.outputPreview = normalizeAiInboundOutputPreview(rawOutputPreview, normalized);
	return normalized;
}

function applyDurableAiHandoff(projectName, operations, session, consumeProjectHandoff, showMessage) {
	const handoff = getSharedHandoff(projectName, "ai-command", operations);
	const handoffId = getAiInboundHandoffId(handoff);
	if (!handoffId || handoffId === asString(session.lastAppliedHandoffId)) return;

	const normalized = normalizeAiInboundHandoff(handoff, projectName);
	session.draftMessage = normalized.prompt;
	session.composerText = normalized.prompt;
	session.modeId = normalized.suggestedSpecialist;
	session.teamMode = normalized.teamMode || "solo";
	session.routeSuggestions = normalized.routeSuggestions;
	session.inboundHandoff = {
		id: handoffId,
		sourcePage: normalized.sourcePage,
		sourceLabel: normalized.sourceLabel,
		title: normalized.title,
		routeSuggestions: normalized.routeSuggestions
	};
	session.bridgeContext = null;

	if (normalized.outputPreview) {
		session.outputPreview = normalized.outputPreview;
		session.outputWorkspaceTab = outputTabFromPreview(normalized.outputPreview);
		session.activeOutputTab = session.outputWorkspaceTab;
		saveLocalOutput(projectName, {
			preview: session.outputPreview,
			responses: session.responseHistory,
			modeId: session.modeId,
			teamMode: session.teamMode
		});
	}

	setSharedAiDraft(projectName, {
		...normalized.draftContext,
		projectName,
		modeId: normalized.suggestedSpecialist,
		teamMode: normalized.teamMode,
		lastCommand: normalized.prompt,
		lastResponseTitle: normalized.title,
		routeSuggestions: normalized.routeSuggestions,
		inboundHandoff: session.inboundHandoff,
		updatedAt: nowIso()
	});

	session.lastAppliedHandoffId = handoffId;
	persistSessionDraft(projectName, session, `Inbound handoff loaded from ${normalized.sourceLabel}`);

	const durableHandoffId = getAiInboundDurableHandoffId(handoff);
	if (durableHandoffId) {
		consumeProjectHandoff?.(projectName, durableHandoffId, { actor: "mh-assistant" }).catch((error) => {
			console.warn("Failed to consume AI handoff:", error.message);
		});
	}
	showMessage?.(`Inbound handoff loaded from ${normalized.sourceLabel}.`);
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
					<button id="ctrlSendBtn" class="ctrl-send-btn" type="button">Send prompt to ${escapeHtml(mode.label)}</button>
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
				<span style="font-size:11px;color:var(--color-text-2);">Prefill only — send prompt for preview</span>
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

function buildConversationWorkContext(session, fallbackPrompt = "") {
        const messages = asArray(session.messages).slice(-12);
        const latestUser = getLastUserMessage(session);
        const latestAssistant = getLastAssistantMessage(session);
        const latestResponse = asArray(session.responseHistory)[0] || null;
        const specialist = session.teamMode === "team"
                ? { id: "team", label: "Full Team" }
                : getPhase1SpecialistById(session.modeId);

        const conversationLines = messages
                .map((message) => {
                        const role = asString(message.role || "");
                        const label = role === "user"
                                ? "User"
                                : asString(message.specialistLabel || specialist.label || "Specialist");
                        const content = asString(message.content || message.text || message.responseText || "").trim();
                        return content ? `${label}: ${content}` : "";
                })
                .filter(Boolean);

        const prompt = asString(
                fallbackPrompt ||
                latestUser?.content ||
                latestResponse?.prompt ||
                session.draftMessage ||
                ""
        ).trim();

        const assistantText = asString(
                latestAssistant?.content ||
                latestResponse?.responseText ||
                ""
        ).trim();

        const summaryParts = [
                prompt ? `User request: ${prompt}` : "",
                assistantText ? `Latest specialist answer: ${assistantText}` : "",
                conversationLines.length ? `Conversation context:\n${conversationLines.join("\n")}` : ""
        ].filter(Boolean);

        return {
                prompt,
                assistantText,
                conversationText: conversationLines.join("\n"),
                summary: summaryParts.join("\n\n"),
                specialistId: specialist.id || session.modeId,
                specialistLabel: specialist.label || "Specialist",
                teamMode: session.teamMode,
                latestResponse
        };
}

function buildConversationWorkPrompt(session, outputType, fallbackPrompt = "") {
        const context = buildConversationWorkContext(session, fallbackPrompt);
        const typeLabel = {
                guidance: "review-ready draft",
                task: "task plan",
                workflow: "workflow sequence",
                handoff: "handoff package"
        }[outputType] || "work draft";

        const basePrompt = context.summary || context.prompt || `Prepare a ${typeLabel}.`;

        return [
                `Convert this AI Team conversation into a ${typeLabel}.`,
                `Specialist: ${context.specialistLabel}`,
                "Use the conversation context, not only the composer text.",
                "Keep it review-ready and do not execute backend actions.",
                "",
                basePrompt
        ].join("\n");
}

function setPreviewFromConversation({ session, intent, fallbackPrompt, projectName }) {
        const workPrompt = buildConversationWorkPrompt(session, intent, fallbackPrompt);
        const preview = buildPhase2OutputPreview({
                intent,
                session,
                prompt: workPrompt,
                projectName
        });

        const context = buildConversationWorkContext(session, fallbackPrompt);
        preview.sourcePrompt = context.prompt || workPrompt;
        preview.conversationContext = context.conversationText;

        // Keep raw conversation context available internally, but do not show it as the main output.
        // The visible preview should stay clean and user-facing.
        if (context.assistantText) {
                preview.summary = context.assistantText;
                preview.mainOutput = context.assistantText;
        }

        preview.generatedAt = nowIso();
        preview.safetyLabel = preview.safetyLabel || "Conversation converted into a review-ready draft. No backend action executed.";

        session.outputPreview = preview;
        session.outputWorkspaceTab = outputTabFromIntent(intent);

## Main interaction area
			};
		}

		const voiceBtn = $("aicmdV2VoiceBtn");
		if (voiceBtn) {
			voiceBtn.onclick = () => {
				const SpeechRecognitionCtor = typeof window !== "undefined"
					? (window.SpeechRecognition || window.webkitSpeechRecognition)
					: null;
				if (!SpeechRecognitionCtor) {
					updateStatus("Voice input trigger is ready. Browser speech recognition is not available in this environment yet.");
					showMessage?.("Voice input readiness is staged for compatible browsers.");
					return;
				}

				try {
					const recognition = new SpeechRecognitionCtor();
					recognition.lang = "ar";
					recognition.interimResults = false;
					recognition.maxAlternatives = 1;
					recognition.onresult = (event) => {
						const transcript = asString(event?.results?.[0]?.[0]?.transcript || "").trim();
						if (!transcript) return;
						setAiComposerValue(session, input, transcript);
						if (input) {
							input.value = transcript;
							input.focus();
						}
						persistSessionDraft(sessionKey, session, "Voice input captured");
						updateStatus("Voice input captured in composer.");
					};
					recognition.onerror = () => {
						updateStatus("Voice input could not start. Microphone permission may be blocked.");
					};
					recognition.start();
					updateStatus("Listening for Arabic voice input.");
				} catch (_) {
					updateStatus("Voice input could not start in this browser.");
				}
			};
		}

		// ── ASK SPECIALIST (P0.3.2C1 chat route) ────────────────
		const askBtn = $("aicmdV2AskBtn");
		if (askBtn) {
		        askBtn.onclick = async () => {
		                const value = asString(input?.value || session.draftMessage || "").trim();
		                if (!value) {
		                        updateStatus("Please write your message in the composer first.");
		                        input?.focus?.();
		                        return;
		                }

		                session.responseError = "";

		                if (!bridgeStatus.available) {
		                        session.responseLoading = false;
		                        session.responseError = bridgeStatus.reason;
		                        aiCommandRoute.render(context);
		                        updateStatus(bridgeStatus.reason);
		                        showMessage?.("AI chat route is not connected yet.");
		                        return;
		                }

		                const specialist = session.teamMode === "team"
		                        ? { id: "team", label: "Full Team" }
		                        : getPhase1SpecialistById(session.modeId);

		                const userChatMessage = {
		                        id: `chat-user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
		                        role: "user",
		                        modeId: specialist.id || session.modeId,
		                        specialistId: specialist.id || session.modeId,
		                        specialistLabel: "You",
		                        teamMode: session.teamMode,
		                        content: value,
		                        createdAt: nowIso(),
		                        source: "ai-command-chat"
		                };

		                session.messages.push(userChatMessage);
		                session.messages = session.messages.slice(-40);
		                session.draftMessage = "";
		                session.composerText = "";
		                session.responseLoading = true;

		                saveLocalOutput(sessionKey, {
		                        preview: session.outputPreview,
		                        messages: session.messages,
		                        responses: session.responseHistory,
		                        modeId: session.modeId,
		                        teamMode: session.teamMode
		                });

		                aiCommandRoute.render(context);

		                try {
		                        const languagePlan = getWorkspaceLanguagePlan(aiContext);
		                        const result = await executeProjectAiChat(projectName, {
		                                project: projectName,
		                                specialistId: specialist.id || session.modeId,
		                                specialistName: specialist.label || "Specialist",
		                                mode: session.teamMode === "team" ? "team" : "solo",
		                                request: value,
		                                message: value,
		                                messages: session.messages.slice(-12),
		                                language: languagePlan.conversationLanguage === "Auto" ? "Auto - follow the latest user message language" : languagePlan.conversationLanguage,
		                                outputLanguage: languagePlan.publishLanguage,
		                                market: languagePlan.market,
		                                marketLanguage: languagePlan.publishLanguage,
		                                contextSummary: {
		                                        projectName,
		                                        campaign: aiContext.campaign,
		                                        readinessScore: aiContext.readinessScore,
		                                        readinessSummary: aiContext.summary
		                                },
		                                safetyInstruction: "Chat only. No task/workflow/handoff/approval/publish/customer/CRM execution.",
		                                source: "ai-command-specialist-chat",
		                                actor: "mh-assistant"
		                        });

		                        const response = asObject(result?.response);
		                        const responseText = extractGeneratedResponseText({
		                                ...response,
		                                chat_answer: result?.chat_answer,
		                                response_text: result?.response_text,
		                                content: response?.content
		                        });

		                        if (!responseText) {
		                                throw new Error("AI chat route returned no response text.");
		                        }

		                        const safetyLabel = asString(result?.safety_label || "chat_only");
		                        const assistantChatMessage = {
		                                id: `chat-assistant-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
		                                role: "assistant",
		                                modeId: specialist.id || session.modeId,
		                                specialistId: specialist.id || session.modeId,
		                                specialistLabel: specialist.label || "Specialist",
		                                teamMode: session.teamMode,
		                                content: responseText,
		                                createdAt: asString(result?.timestamp) || nowIso(),
		                                source: "ai-chat-response",
		                                safetyLabel,
		                                response: {
		                                        status: "completed",
		                                        chat_answer: responseText,
		                                        content: responseText,
		                                        outputType: "chat",
		                                        provider: result?.provider,
		                                        safety_label: safetyLabel
		                                }
		                        };

		                        session.messages.push(assistantChatMessage);
		                        session.messages = session.messages.slice(-40);

		                        const routeSuggestion = asArray(response.routeSuggestions || result?.routeSuggestions)[0];
                                        const responseRoute = resolveAiResponseOutputRoute(session, {
                                                ...response,
                                                prompt: value,
                                                responseTitle: "Chat reply",
                                                responseText,
                                                outputType: response.outputType,
                                                destinationRoute: asString(routeSuggestion?.route)
                                        });
		                        session.responseHistory.unshift({
		                                id: `resp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
		                                prompt: value,
		                                specialistId: specialist.id || session.modeId,
		                                specialistLabel: specialist.label || "Specialist",
		                                generatedAt: assistantChatMessage.createdAt,
		                                responseTitle: "Chat reply",
		                                responseText,
		                                responseRaw: {
		                                        ...response,
		                                        safety_label: safetyLabel,
		                                        provider: result?.provider
		                                },
		                                teamMode: session.teamMode,
		                                outputType: responseRoute.outputType,

		                                destinationRoute: responseRoute.destinationRoute
		                        });

		                        session.responseHistory = session.responseHistory.slice(0, 12);
		                        session.responseLoading = false;
		                        session.responseError = "";

		                        saveLocalOutput(sessionKey, {
		                                preview: session.outputPreview,
		                                messages: session.messages,
		                                responses: session.responseHistory,
		                                modeId: session.modeId,
		                                teamMode: session.teamMode
		                });

		                        saveAiChatSession(sessionKey, session);

                                aiCommandRoute.render(context);
		                        updateStatus("Specialist reply generated. No workflow/task/handoff was created.");
		                        showMessage?.("Specialist reply generated.");
		                } catch (error) {
		                        session.responseLoading = false;
		                        session.responseError = asString(error?.message || "Failed to generate specialist chat reply.");

		                        saveLocalOutput(sessionKey, {
		                                preview: session.outputPreview,
		                                messages: session.messages,
		                                responses: session.responseHistory,
		                                modeId: session.modeId,
		                                teamMode: session.teamMode
		                });

		                        aiCommandRoute.render(context);
		                        updateStatus(session.responseError);
		                }
		        };
		}

                // ── PREPARE GUIDANCE (primary action) ───────────────────────
                // Phase 1: stages draft locally from conversation context. No backend execution.
                const prepareBtn = $("aicmdV2PrepareBtn");
                if (prepareBtn) {
                        prepareBtn.onclick = () => {
                                const fallback = asString(input?.value || session.draftMessage || "").trim();
                                const preview = setPreviewFromConversation({
                                        session,
                                        intent: "guidance",
                                        fallbackPrompt: fallback,
                                        projectName
                                });
                                if (!preview) return;
                                persistSessionDraft(sessionKey, session, "Guidance preview prepared from conversation");
                                const specLabel = session.teamMode === "team" ? "Team" : getPhase1SpecialistById(session.modeId).label;
                                updateStatus("Guidance preview prepared from conversation context.");
                                showMessage?.(`${specLabel} guidance preview prepared from conversation.`);
                                aiCommandRoute.render(context);
                        };
                }

                // ── DRAFT TASK (secondary action) ────────────────────────────
                // Phase 1: converts the current conversation into a task preview. No backend execution.
                const draftTaskBtn = $("aicmdV2DraftTaskBtn");
                if (draftTaskBtn) {
                        draftTaskBtn.onclick = () => {
                                const value = asString(input?.value || session.draftMessage || "").trim();
                                const spec = getPhase1SpecialistById(session.modeId);
                                const fallback = value
                                        ? `Draft a task plan for: ${value}`
                                        : `Draft a task plan for the next best action for ${projectName || "this project"} with ${spec.label}.`;
                                const preview = setPreviewFromConversation({
                                        session,
                                        intent: "task",
                                        fallbackPrompt: fallback,
                                        projectName
                                });
                                if (!preview) return;
                                persistSessionDraft(sessionKey, session, "Task preview prepared from conversation");
                                updateStatus("Task draft preview prepared from conversation context. Review before creating durable tasks.");
                                showMessage?.("Task draft preview prepared from conversation.");
                                aiCommandRoute.render(context);
                        };
                }

                // ── DRAFT WORKFLOW (secondary action) ────────────────────────
                const draftWorkflowBtn = $("aicmdV2DraftWorkflowBtn");
                if (draftWorkflowBtn) {
                        draftWorkflowBtn.onclick = () => {
                                const value = asString(input?.value || session.draftMessage || "").trim();
                                const spec = getPhase1SpecialistById(session.modeId);
                                const fallback = value
                                        ? `Draft a workflow sequence for: ${value}`
                                        : `Draft a workflow sequence for ${projectName || "this project"} with ${spec.label}.`;
                                const preview = setPreviewFromConversation({
                                        session,
                                        intent: "workflow",
                                        fallbackPrompt: fallback,
                                        projectName
                                });
                                if (!preview) return;
                                persistSessionDraft(sessionKey, session, "Workflow preview prepared from conversation");
                                updateStatus("Workflow draft preview prepared from conversation context. No workflow run started.");
                                showMessage?.("Workflow draft preview prepared from conversation.");
                                aiCommandRoute.render(context);
                        };
                }

                // ── PREPARE HANDOFF (secondary action) ───────────────────────
                // Phase 1: converts the current conversation into a handoff preview. No backend write.
                const handoffBtn = $("aicmdV2HandoffBtn");
                if (handoffBtn) {
                        handoffBtn.onclick = () => {
                                const value = asString(input?.value || session.draftMessage || "").trim();
                                const spec = getPhase1SpecialistById(session.modeId);
                                const fallback = value
                                        ? `Prepare a handoff summary for: ${value}`
                                        : `Prepare a handoff summary from ${spec.label} for the current project state of ${projectName || "this project"}.`;
                                const preview = setPreviewFromConversation({
                                        session,
                                        intent: "handoff",
                                        fallbackPrompt: fallback,
                                        projectName
                                });
                                if (!preview) return;
                                persistSessionDraft(sessionKey, session, "Handoff preview prepared from conversation");
                                updateStatus("Handoff preview prepared from conversation context. Review destination before sending.");
                                showMessage?.("Handoff preview prepared from conversation.");
                                aiCommandRoute.render(context);
                        };
                }
		const toolButtons = Array.from(document.querySelectorAll("[data-aicmdv2-tool]"));
		toolButtons.forEach((btn) => {
			btn.onclick = () => {
				const toolId = asString(btn.getAttribute("data-aicmdv2-tool") || "").trim();
				if (!toolId) return;

				const tool = getPhase35ToolSet(session).find((entry) => entry.id === toolId);
				if (!tool) return;

				const preparedPrompt = applyTokenTemplate(tool.template, {
					projectName,
					specialistLabel: session.teamMode === "team" ? "Full Team" : getPhase1SpecialistById(session.modeId)?.label,
					campaign: aiContext.campaign
				});

				const drawerTool = {
					...tool,
					actionType: tool.requiresSelectedSource ? "source_required" : (tool.actionType || "guided"),
					destinations: asArray(tool.destinations).length ? tool.destinations : [getToolDestinationRoute(tool, session)],
					sourceTypes: asArray(tool.sourceTypes).length ? tool.sourceTypes : ["current_chat"],
					outputTypes: asArray(tool.outputTypes).length ? tool.outputTypes : [asString(tool.intent || tool.id || "draft").replace(/[^a-z0-9_]+/g, "_")]
				};

				const opened = openAiToolDrawerFromMetadata({
					root: document,
					tool: drawerTool,
					template: preparedPrompt,
					input,
					session,
					projectName,
					persistSessionDraft,
					sessionKey,
					updateStatus
				});

				if (!opened) {
					updateStatus("Smart tool drawer is unavailable. Refresh AI Command and try again.");
				}
			};
		});

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
				session.composerText = "";
				session.routeSuggestions = [];
				session.inboundHandoff = null;
				session.bridgeContext = null;
				if (input) input.value = "";
				persistSessionDraft(sessionKey, session, "Draft cleared");
				updateStatus("Composer draft cleared.");
				showMessage?.("Composer draft cleared.");
			};
		}

		// ── RESPONSE ACTIONS (Phase 3 safe actions) ──────────────────
		const latestResponse = asArray(session.responseHistory)[0] || null;

		const responseContinueBtn = $("aicmdV3ResponseContinueBtn");
		if (responseContinueBtn) {
		        responseContinueBtn.onclick = () => {
		                input?.focus?.();
		                updateStatus("Continue from the Composer. The selected specialist is still active.");
		        };
		}

		const responseCopyBtn = $("aicmdV3ResponseCopyBtn");
		if (responseCopyBtn) {
			responseCopyBtn.onclick = async () => {
				if (!latestResponse?.responseText) return;
				try {
					if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
						await navigator.clipboard.writeText(latestResponse.responseText);
						updateStatus("Response copied to clipboard.");
						showMessage?.("Response copied.");
					} else {
						updateStatus("Clipboard is not available in this browser context.");
					}
				} catch (_) {
					updateStatus("Copy failed. Clipboard access may be blocked.");
				}
			};
		}

		const responseUseBtn = $("aicmdV3ResponseUseBtn");
		if (responseUseBtn) {
			responseUseBtn.onclick = () => {
				if (!latestResponse?.responseText) return;
				setAiComposerValue(session, input, latestResponse.responseText);
				if (input) {
					input.focus();
				}
				persistSessionDraft(sessionKey, session, "Generated response inserted into composer");
				updateStatus("Response inserted into composer.");
			};
		}

		const responseSaveBtn = $("aicmdV3ResponseSaveBtn");
		if (responseSaveBtn) {
			responseSaveBtn.onclick = () => {
				if (!latestResponse) return;

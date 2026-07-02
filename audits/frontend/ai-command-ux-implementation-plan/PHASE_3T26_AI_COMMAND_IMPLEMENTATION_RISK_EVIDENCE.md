# PHASE 3T.26 — AI Command Composer/Prompt Implementation Risk Evidence

## Current prompt constants
286:const SPECIALIST_SUGGESTED_PROMPTS = {
356:const TEAM_SUGGESTED_PROMPTS = [

## Prompt array range
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
];

const PHASE35_WORKSPACE_TABS = ["chat", "preview", "tools", "context", "history"];

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
	{ id: "workflow", label: "Draft Workflow", helper: "Operating sequence" },
	{ id: "handoff", label: "Prepare Handoff", helper: "Destination package" },
	{ id: "export", label: "Export", helper: "File-ready package" }
];

## Composer render range

function renderPhase1Composer(session, aiContext, escapeHtml) {
		const spec = getPhase1SpecialistById(session.modeId);
		const placeholder = "Message the AI specialist...";
		const isTeam = session.teamMode === "team";
		const specLabel = isTeam ? "Team Meeting Room" : spec.label;
		const headerText = isTeam
			? "Coordinated Team Review — Guidance Only"
			: `Chat with ${spec.label}`;
		const draftLabel = asString(session.draftMessage).trim() ? "Draft saved" : "Empty draft";
		const roleId = isTeam ? "team" : getAiRoomRoleId(spec.id);
		const isGenerating = Boolean(session.responseLoading);

		return `
			<div class="aicmd-v2-composer aicmd-room-composer aicmd-chatgpt-composer" data-role="${escapeHtml(roleId)}">
				<div class="aicmd-v2-composer-head aicmd-chatgpt-composer-head">
					<div class="aicmd-v2-composer-title-row">
						<span class="aicmd-v2-composer-icon">${escapeHtml(isTeam ? "Team" : getAiRoomInitials(spec))}</span>
						<span class="aicmd-v2-composer-label">${escapeHtml(headerText)}</span>
					</div>
					<span class="aicmd-v2-draft-state">${escapeHtml(draftLabel)}</span>
				</div>

				<div class="aicmd-chatgpt-input-shell">
					<textarea
						id="aicmdV2Input"
						class="aicmd-v2-textarea aicmd-chatgpt-textarea"
						rows="3"
						placeholder="${escapeHtml(placeholder)}"
						aria-label="Message ${escapeHtml(specLabel)}"
					>${escapeHtml(session.draftMessage)}</textarea>

					<div class="aicmd-chatgpt-toolbar" aria-label="Composer controls">
						<div class="aicmd-chatgpt-tools-left">
							<button id="aicmdV2VoiceBtn" class="aicmd-chatgpt-icon-btn" type="button" disabled title="Voice input coming soon">🎙</button>
						</div>
						<div class="aicmd-chatgpt-tools-right">
							<span class="aicmd-chatgpt-enter-hint">Enter to send · Shift+Enter newline</span>
							<button id="aicmdV2AskBtn" class="aicmd-chatgpt-send-btn" type="button" ${isGenerating ? "disabled" : ""} title="Send message">
								${isGenerating ? "…" : "➤"}
							</button>
						</div>
					</div>
				</div>

				<div class="aicmd-chatgpt-context-row">
					${renderLanguageMarketStrip(aiContext, escapeHtml)}
				</div>

				<div id="aicmdV2Status" class="aicmd-v2-composer-hint"></div>
			</div>
		`;
}

function renderPhase2PreviewPanel(session, escapeHtml) {
	const preview = asObject(session.outputPreview);
	const hasPreview = Boolean(preview.outputType && preview.title);
	if (!hasPreview) {
		return `
			<section class="aicmd-v2-preview">
				<div class="aicmd-v2-preview-head">
					<div>
						<h3 class="aicmd-v2-preview-title">Preview</h3>
						<p class="aicmd-v2-preview-subtitle">Generated content, draft packages, and routed handoffs appear here.</p>
					</div>
					<span class="aicmd-v2-preview-status aicmd-v2-preview-status-empty">Waiting</span>

## Prompt render range
                                        </div>
                                </details>
                        ` : ""}
                </section>
        `;
}

function renderPhase1SuggestedPrompts(session, escapeHtml) {
	const promptModeId = MODE_ID_ALIASES[getAiRoomRoleId(session.modeId)] || getAiRoomRoleId(session.modeId);
	const prompts = session.teamMode === "team"
		? TEAM_SUGGESTED_PROMPTS
		: (SPECIALIST_SUGGESTED_PROMPTS[promptModeId] || SPECIALIST_SUGGESTED_PROMPTS.operations);
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

## Handler binding range
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
				updateStatus("Suggested prompt loaded into composer. Review it, then Ask AI Team or Draft.");
				input?.focus?.();
			};
		});

		Array.from(document.querySelectorAll("[data-aicmdv2-quick]")).forEach((btn) => {
			btn.onclick = () => {
				const text = asString(btn.getAttribute("data-aicmdv2-quick-template") || "");
				if (!text) return;
				session.draftMessage = text;
				if (input) input.value = text;
				persistSessionDraft(sessionKey, session, "Quick action loaded");
				updateStatus("Quick action loaded into composer. Review it, then ask or preview.");
				input?.focus?.();
			};
		});

                bindAiToolDock({
                        root: document,
                        session,
                        input,
                        projectName,
                        aiContext,
                        specialistLabel: session.teamMode === "team" ? "Full Team" : getPhase1SpecialistById(session.modeId)?.label,
                        persistSessionDraft,
                        sessionKey,
                        updateStatus
                });

		// ── INPUT HANDLING ───────────────────────────────────────────
		if (input) {
			input.oninput = () => {
				session.draftMessage = input.value || "";
				session.composerText = session.draftMessage;
				persistSessionDraft(sessionKey, session, "Draft auto-saved locally");
			};

			input.onkeydown = (event) => {
			        if (event.key !== "Enter") return;

			        if (event.shiftKey) {
			                return;
			        }

			        event.preventDefault();

			        const sendBtn = $("aicmdV2AskBtn");
			        if (sendBtn && !sendBtn.disabled) {
			                sendBtn.click?.();
			        }
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

## Send handler range

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

# PHASE 3AF.1 — AI Command Route / UI Evidence

## Router registration
public/control-center/router.js:4:import { aiCommandRoute } from "./pages/ai-command.js";
public/control-center/router.js:32:  [aiCommandRoute.id]: aiCommandRoute,
public/control-center/pages/ai-command.js:2838:					<div class="ctrl-room-eyebrow">AI Workspace</div>
public/control-center/pages/ai-command.js:4660:export const aiCommandRoute = {
public/control-center/pages/ai-command.js:4661:	id: "ai-command",
public/control-center/pages/ai-command.js:4664:		eyebrow: "AI & Build",
public/control-center/pages/ai-command.js:4665:		title: "AI Workspace",
public/control-center/pages/ai-command.js:4819:			aiCommandRoute.render(context);
public/control-center/pages/ai-command.js:4845:		                aiCommandRoute.render(context);
public/control-center/pages/ai-command.js:4881:		                aiCommandRoute.render(context);
public/control-center/pages/ai-command.js:4902:				aiCommandRoute.render(context);
public/control-center/pages/ai-command.js:4927:                                aiCommandRoute.render(context);
public/control-center/pages/ai-command.js:4938:				aiCommandRoute.render(context);
public/control-center/pages/ai-command.js:5058:		                        aiCommandRoute.render(context);
public/control-center/pages/ai-command.js:5094:		                aiCommandRoute.render(context);
public/control-center/pages/ai-command.js:5200:                                aiCommandRoute.render(context);
public/control-center/pages/ai-command.js:5215:		                        aiCommandRoute.render(context);
public/control-center/pages/ai-command.js:5238:                                aiCommandRoute.render(context);
public/control-center/pages/ai-command.js:5262:                                aiCommandRoute.render(context);
public/control-center/pages/ai-command.js:5285:                                aiCommandRoute.render(context);
public/control-center/pages/ai-command.js:5309:                                aiCommandRoute.render(context);
public/control-center/pages/ai-command.js:5464:		                aiCommandRoute.render(context);
public/control-center/pages/ai-command.js:5636:				aiCommandRoute.render(context);
public/control-center/pages/ai-command.js:5650:				rerender: () => aiCommandRoute.render(context)
public/control-center/index.html:151:            Open AI Workspace
public/control-center/index.html:207:                AI Workspace

## Sidebar placement
119:            <button class="nav-item" data-route="ai-command" data-page="ai-command" type="button">AI Command</button>
120:            <button class="nav-item" data-route="workflows" data-page="workflows" type="button">Workflows</button>
121:            <button class="nav-item" data-route="publishing" data-page="publishing" type="button">Publishing</button>
122:            <button class="nav-item" data-route="insights" data-page="insights" type="button">Insights</button>

## Route metadata block
	`;
}

// ============================================================

export const aiCommandRoute = {
	id: "ai-command",
   disableStandardLayout: true,
	meta: {
		eyebrow: "AI & Build",
		title: "AI Workspace",
		description: "Talk to your AI team, run structured tasks, and turn intelligence into review-ready plans and routed handoffs."
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
			consumeProjectHandoff,
			executeProjectAiCommand,
			fetchProjectInsights,
			fetchProjectLearning,
			reloadProjectData
		} = context;

		const state = getState();
		const projectName = asString(selectCurrentProject(state) || "");

## Main render surface
export const aiCommandRoute = {
	id: "ai-command",
   disableStandardLayout: true,
	meta: {
		eyebrow: "AI & Build",
		title: "AI Workspace",
		description: "Talk to your AI team, run structured tasks, and turn intelligence into review-ready plans and routed handoffs."
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
			consumeProjectHandoff,
			executeProjectAiCommand,
			fetchProjectInsights,
			fetchProjectLearning,
			reloadProjectData
		} = context;

		const state = getState();
		const projectName = asString(selectCurrentProject(state) || "");
		const sessionKey = projectName || "__default__";
		const session = ensureSession(sessionKey);
		hydrateSessionDraft(sessionKey, session);
		const normalizedSessionModeId = MODE_ID_ALIASES[getAiRoomRoleId(session.modeId)] || getAiRoomRoleId(session.modeId);
		if (normalizedSessionModeId && normalizedSessionModeId !== session.modeId) session.modeId = normalizedSessionModeId;
		refreshAiChatSessions(sessionKey, session);
           const savedOutput = asObject(loadLocalOutput(sessionKey));
           if (asArray(savedOutput.messages).length && !asArray(session.messages).length) {
                   session.messages = asArray(savedOutput.messages).slice(-40);
           }
		if (!session.outputPreview) {
			const preview = asObject(savedOutput.preview);
			if (preview.outputType) {
				session.outputPreview = preview;
				session.outputWorkspaceTab = outputTabFromPreview(preview);
			}
		}
		if (!session.responseHistoryLoaded) {
			session.responseHistory = asArray(savedOutput.responses).slice(0, 12);
			session.responseHistoryLoaded = true;
		}

		// ── HOME → AI COMMAND BRIDGE ────────────────────────────────
		// Consume prompt set by home.js handleAiRoleClick via quickCommandInput.
		// Once consumed we clear the global input so re-renders are idempotent.
		const globalInput = $("quickCommandInput");
		const bridgeValue = asString(globalInput?.value || "").trim();
		if (bridgeValue) {
			const detectedSpecialist = detectSpecialistFromBridgePrompt(bridgeValue);
			if (detectedSpecialist) {
				session.modeId = detectedSpecialist;
				const bridgeSpecialist = getPhase1SpecialistById(detectedSpecialist);
				session.bridgeContext = {
					source: "Home",
					specialistId: detectedSpecialist,
					specialistLabel: bridgeSpecialist?.label || titleCase(detectedSpecialist),
					loadedAt: nowIso()
				};
			} else {
				session.bridgeContext = null;
			}
			session.draftMessage = normalizeAiComposerPrompt(bridgeValue);
			persistSessionDraft(sessionKey, session, detectedSpecialist ? "Specialist context loaded from Home" : "AI prompt loaded from workspace");
			if (globalInput) globalInput.value = "";
		}
		// ─────────────────────────────────────────────────────────────

		const payload = asObject(selectProjectPayload(state));
		const overview = asObject(payload.overview?.overview || payload.overview);
		const readiness = asObject(payload.readiness?.dashboard || payload.readiness);
		const operations = asObject(selectOperationsSnapshot(state));
		applyDurableAiHandoff(sessionKey, operations, session, consumeProjectHandoff, showMessage);
		const readinessScore = readiness.readiness_score ?? overview.readiness_score ?? null;

		const intelligenceStatus = session.intelligence.status || "idle";
		const aiContext = buildUnifiedAiContext(state, session.intelligence);
		const bridgeStatus = getAiResponseBridgeStatus(executeProjectAiChat);
		if (!session.workspaceTabInitialized) {
			session.workspaceTab = bridgeStatus.available ? "chat" : "preview";
			session.workspaceTabInitialized = true;
		}
		if (!PHASE35_WORKSPACE_TABS.includes(session.workspaceTab)) {
			session.workspaceTab = bridgeStatus.available ? "chat" : "preview";
		}

		const root = $("ctrlRoomRoot");
		if (!root) return;

		// Final Room v1 renders the conversation, composer, output workspace, and tools directly.
		// Legacy workspace tabs remain as helper functions only and are not mounted in this shell.

		root.innerHTML = `
			<div class="aicmd-v2-shell aicmd-room-shell">
				${renderPhase1Header(session, projectName, aiContext, bridgeStatus, escapeHtml)}
				<div class="aicmd-v2-body aicmd-room-grid">
					${renderPhase1TeamRail(session, bridgeStatus, escapeHtml)}

										<main class="aicmd-v2-main aicmd-room-center">
											<div class="aicmd-unified-chat-surface">
												${renderAiRoomConversationHeader(session, bridgeStatus, escapeHtml)}
												<div class="aicmd-room-specialist-conversation">
													${renderPhase3SpecialistConversation(session, bridgeStatus, escapeHtml)}
												</div>
												${renderPhase1Composer(session, aiContext, escapeHtml)}
											</div>
										</main>

					<aside class="aicmd-room-output">
						${renderAiRoomOutputWorkspace(session, aiContext, escapeHtml)}
						${renderPhase35ToolsPanel(session, projectName, aiContext, escapeHtml)}
					</aside>
				</div>
				${renderAiRoomStatusStrip(aiContext, session, bridgeStatus, escapeHtml)}
				${renderAiToolDrawerShell({ escapeHtml })}
			</div>
		`;

		const input = $("aicmdV2Input");
		const statusEl = $("aicmdV2Status");

		const updateStatus = (msg) => {
			if (statusEl) statusEl.textContent = msg;
		};

		const setPreviewFromIntent = (intent, fallbackPrompt = "", options = {}) => {
			const value = asString(input?.value || session.draftMessage || fallbackPrompt || "").trim();
			if (!value) {

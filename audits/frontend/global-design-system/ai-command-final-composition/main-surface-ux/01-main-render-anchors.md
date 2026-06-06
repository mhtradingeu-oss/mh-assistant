# 01 — Main Surface Render Anchors

Generated: Sat Jun  6 23:54:03 CEST 2026

5:        renderAiToolDrawerShell
6:} from "./ai-command/tool-dock.js";
7:import { getProjectedActiveRole, getProjectedTeamMembers } from "../runtime/authority/authority-projection.js";
27:        executeProjectAiGuidance
146:		placeholder: "Ask the Strategist to plan a campaign, map launch phases, review channel priorities, or define the offer strategy…",
149:		destinations: ["Campaign Studio", "Workflows", "AI Command"],
151:		status: "Ready"
159:		placeholder: "Ask the Content Writer to draft captions, hooks, landing copy, or campaign messages…",
161:		cannotDo: ["Publish directly", "Approve risky claims", "Invent unsupported facts", "Run workflows automatically"],
162:		destinations: ["Content Studio", "Publishing", "AI Command"],
164:		status: "Ready"
172:		placeholder: "Ask the Media Director to define visual direction, prepare a creative brief, or review brand consistency…",
175:		destinations: ["Asset Library", "Content Studio", "AI Command"],
177:		status: "Ready"
185:		placeholder: "Ask the Video Lead to write a reel script, map short-form strategy, or outline the next video concept…",
187:		cannotDo: ["Generate video directly", "Upload footage without review", "Approve without confirmation", "Run media jobs automatically"],
190:		status: "Ready"
198:		placeholder: "Ask the Publisher to review publishing readiness, check scheduling, or prepare a handoff package…",
201:		destinations: ["Publishing", "Workflows", "AI Command"],
203:		status: "Ready"
211:		placeholder: "Ask the Ads Optimizer to draft ad copy, review targeting angles, or plan a paid campaign structure…",
216:		status: "Ready"
224:		placeholder: "Ask the SEO & Insights Analyst to review performance, suggest SEO improvements, or identify top content patterns…",
229:		status: "Ready"
237:		placeholder: "Ask the Compliance Reviewer to check claims, approval risks, publishing safety, and governance notes…",
242:		status: "Ready"
250:		placeholder: "Ask the Operations Lead to turn this into tasks, workflow steps, or handoffs…",
252:		cannotDo: ["Run workflows without confirmation", "Auto-approve tasks", "Override authority gates", "Execute backend operations directly"],
253:		destinations: ["Workflows", "Operations Centers", "AI Command"],
255:		status: "Ready"
263:		placeholder: "Ask the Customer Operations Lead to summarize a customer thread, draft a safe reply, prepare a ticket draft, check SLA risk, or route an escalation for review…",
268:		status: "Ready"
276:		placeholder: "Ask the Sales / CRM Lead to qualify a lead, draft outreach, plan follow-ups, summarize CRM context, or prepare a sales handoff for review…",
281:		status: "Ready"
285:// Role-specific suggested prompt chips (prefill only, no auto-execute)
332:		{ label: "Prepare governance notes", sub: "Document compliance status" },
355:// Full Team mode suggested prompts
363:const PHASE35_WORKSPACE_TABS = ["chat", "preview", "tools", "context", "history"];
366:	{ id: "ask", title: "Ask", description: "Write the request and choose the team lane." },
377:	{ id: "workflow", label: "Workflow Preview", helper: "Operating sequence" },
378:	{ id: "handoff", label: "Handoff Preview", helper: "Destination package" },
409:		status: "Planned",
415:		status: "Planned",
421:		status: "Planned",
444:		{ id: "open-media-studio", label: "Send prompt to Media Studio", action: "route", route: "media-studio" }
502:		{ id: "crm-profile-summary", label: "CRM Profile Summary", action: "preview", intent: "guidance", template: "Summarize the CRM profile context for {project}. Include fit, history, open questions, and next sales action without mutating CRM data." },
503:		{ id: "pipeline-next-step", label: "Pipeline Next Step", action: "preview", intent: "task", template: "Recommend the pipeline next step for {project}. Include stage, rationale, owner, risk, and required confirmation." },
510:// 4 quick-action prompts shown in the composer
579:		name: "Ads Specialist",
582:		suggestedPrompt: "Act as Ads Specialist and propose paid experiments based on current readiness and data coverage."
611:let lastRenderContext = null;
612:let aiCommandBridgeRegistered = false;
619:function buildAutoPlanFromCommand(commandText, session) {
620:	function getSpecialistById(id) {
627:	function detectSpecialistFromBridgePrompt(prompt) {
628:		const text = asString(prompt);
652:			type: "generate_prompt",
654:			action: "Generate prompt from AI command",
656:				prompt: command,
667:				prompt: command,
681:				prompt: command,
691:function detectSpecialistFromBridgePrompt(prompt) {
692:	const text = asString(prompt);
769:		specialist: asString(context.specialistLabel || "Specialist") || "Specialist",
770:		specialistLabel: asString(context.specialistLabel || "Specialist") || "Specialist",
778:function normalizeAiComposerPrompt(value) {
822:function setAiComposerValue(session, input, value) {
823:  const cleanValue = normalizeAiComposerPrompt(value);
852:	const status = Number(error?.status);
853:	if (status !== 404) return false;
864:function getWorkspaceLanguagePlan(aiContext = {}) {
865:	const overview = asObject(aiContext.overview);
866:	const rawMarket = asString(aiContext.market || overview.market || "").trim();
953:			history: [],
956:				status: "idle",
968:			bridgeContext: null,
969:			outputPreview: null,
1021:	if (localDraft.prompt) {
1022:		session.draftMessage = asString(localDraft.prompt);
1029:	if (localDraft.prompt || localDraft.updatedAt) {
1037:		prompt: session.draftMessage,
1081:function getAiResponseBridgeStatus(executeProjectAiGuidanceFn) {
1082:	if (typeof executeProjectAiGuidanceFn !== "function") {
1091:		reason: "Guidance bridge connected."
1122:        const hasContent = messages.length || responses.length || asObject(session.outputPreview).title;
1129:        const titleSeed = asString(options.title || firstUser?.content || responses[0]?.prompt || "AI Team session").trim();
1133:                title: titleSeed.slice(0, 80) || "AI Team session",
1138:                preview: session.outputPreview || null,
1161:        session.outputPreview = asObject(record.preview);
1162:        session.outputWorkspaceTab = outputTabFromPreview(session.outputPreview);
1170:        session.bridgeContext = null;
1181:function buildSpecialistChatPrompt({ prompt, specialistLabel, modeLabel, projectName, language, outputLanguage, market }) {
1182:	const cleanPrompt = asString(prompt).trim();
1184:	const safeSpecialist = asString(specialistLabel || "Specialist").trim();
1185:	const safeMode = asString(modeLabel || "Solo Specialist").trim();
1189:	const teamWorkflowLines = safeMode === "Full Team"
1191:			"Full Team workflow: Strategist -> Writer -> Media/Video -> Compliance -> Publisher -> Operations.",
1198:		`Role: ${safeSpecialist}`,
1258:function destinationRouteForSpecialist(specialistId, outputType) {
1288:                response.prompt
1354:        const destinationRoute = explicitDestination || destinationRouteForSpecialist(session?.modeId || "operations", outputType);
1377:function specialistTemplateForOutput({ specialist, outputType, prompt, projectName }) {
1378:	const cleanPrompt = asString(prompt).trim();
1379:	const promptSnippet = cleanPrompt || `Project request for ${projectName || "current project"}`;
1381:	const route = destinationRouteForSpecialist(specialistId, outputType);
1387:		summary: "Guidance prepared for review.",
1393:		sourcePrompt: promptSnippet,
1394:		status: "draft_preview",
1395:		safetyLabel: "Guidance and draft only. No backend execution.",
1396:		nextSafeAction: `Review in ${routeLabel(route)}`,
1412:				nextSafeAction: "Review and refine the task draft before creating durable tasks"
1417:			title: `Strategist Guidance: Next operating move`,
1418:			summary: `Priority guidance prepared from: ${promptSnippet}`,
1422:				"Next operating move drafted with destination routing"
1430:			title: outputType === "task" ? "Task: Draft campaign copy" : "Content Guidance: Messaging draft",
1466:			summary: "Media brief prepared with visual direction, prompt ideas, and required assets.",
1477:			nextSafeAction: "Open Media Studio to review and refine the brief"
1499:			title: outputType === "handoff" ? "Handoff Preview: Publishing package" : "Publishing Draft: Readiness checklist",
1547:			title: outputType === "task" ? "Task: Analysis plan" : "Insights Guidance: Signal review",
1554:			safetyLabel: "No analytics mutation or fake metrics. Guidance only."
1610:			mainOutput: "Use this as a sales planning draft. Confirm CRM context and owner before sending outreach or changing pipeline status.",
1627:				"CRM profile and pipeline changes remain outside AI Team.",
1650:					"Stage 2: Specialist draft production",
1659:			title: outputType === "handoff" ? "Handoff Preview: Operations package" : "Operations Draft: Task and handoff plan",
1674:function buildPhase2OutputPreview({ intent, session, prompt, projectName }) {
1677:		? { id: "operations", label: "Full Team" }
1678:		: getPhase1SpecialistById(session.modeId);
1691:		prompt,
1700:		title: outputType === "workflow" ? "Team Workflow" : `Team ${titleCase(outputType)} Preview`,
1718:		nextSafeAction: "Review the team draft, confirm owners, then route draft context to the destination workspace",
1719:		confirmationNote: "No task, workflow, outreach, customer reply, CRM update, approval, or publishing action is executed from Full Team mode.",
1720:		safetyLabel: "Full Team output is a coordinated draft preview only."
1726:		guidance: "Guidance",
1729:		handoff: "Handoff Preview",
1735:function buildPreviewText(output, specialistLabel) {
1739:		`Specialist: ${specialistLabel}`,
1740:		`Status: ${humanizeValue(output.status, "draft_preview")}`,
1744:		`Source Prompt: ${humanizeValue(output.sourcePrompt)}`,
1759:function compactPreviewText(value, maxLength = 360) {
1766:function splitPreviewLines(value, limit = 6) {
1790:function buildStructuredPreviewBlocks(preview = {}) {
1801:        const compactSummary = compactPreviewText(sourceText || summary, 420);
1804:        const mainLines = splitPreviewLines(sourceText || summary, 14)
1805:                .map((item) => compactPreviewText(item, 360));
1812:                .map((item) => compactPreviewText(item, 300));
1819:                .map((item) => compactPreviewText(item, 280));
1822:                blocks.push({ label: "Next steps", items: steps, ordered: true });
1824:                blocks.push({ label: "Next step", items: [compactPreviewText(preview.nextStep, 280)] });
1835:function isProviderLikelyConfigured(aiContext) {
1836:	const records = asObject(aiContext?.controlCenter?.records);
1839:		const status = asString(record?.status || record?.status_label).toLowerCase();
1841:		const readyState = /connected|healthy|ready|active|ok/.test(status);
1850:function buildUnifiedAiContext(state, intelligence) {
1872:	const coveredCount = coverageEntries.filter(([, item]) => asString(item?.status) === "covered").length;
1874:	const nextBestActions = asArray(overviewBlock.next_best_actions || readinessDashboard.next_best_actions);
1880:		if (asString(item?.status) !== "covered") {
1883:				status: asString(item?.status) || "missing",
1890:		.filter((record) => ["error", "token_expired", "partial"].includes(asString(record?.status)))
1893:			status: record.status_label || record.status,
1905:		readinessStatus: asString(readinessDashboard.readiness_status || overview.readiness_status || "unknown"),
1906:		nextBestActions,
1923:			.filter((item) => item.status === "Approved")
1930:			.filter((item) => item.blocker || ["Missing", "Needs Review"].includes(item.status))
1934:				status: item.status
1969:		operations: ["task plan", "workflow", "handoff", "approval", "timeline", "execution plan", "route", "publish", "status", "priority", "priorities", "blocking", "blocker", "readiness", "next", "do next"],
1998:function normalizeActionLabel(item) {
2006:function buildMissingDataNotes(aiContext, lane) {
2008:	const coverage = aiContext.coverage;
2013:	if (lane === "content" && asString(coverage.social_insights?.status) !== "covered") {
2016:	if (lane === "seo" && asString(coverage.seo_search_console?.status) !== "covered") {
2019:	if (lane === "ads" && asString(coverage.paid_ads?.status) !== "covered") {
2025:function buildExecutiveResponse(aiContext) {
2026:	const topRecommendation = aiContext.recommendations[0];
2028:	if (aiContext.readinessScore != null) summaryParts.push(`Readiness is ${aiContext.readinessScore}/100 (${aiContext.readinessStatus || "in progress"}).`);
2029:	if (aiContext.criticalGaps.length) summaryParts.push(`${aiContext.criticalGaps.length} critical gaps are open.`);
2030:	if (aiContext.recommendations.length) summaryParts.push(`${aiContext.recommendations.length} recommendations available.`);
2032:		title: "Project status briefing",
2035:			aiContext.criticalGaps.length ? `Critical gaps: ${aiContext.criticalGaps.slice(0, 4).map(normalizeActionLabel).join(", ")}.` : "No critical readiness gaps flagged.",
2036:			aiContext.missingIntegrations.length ? `Missing intelligence: ${aiContext.missingIntegrations.slice(0, 4).map((item) => item.label).join(", ")}.` : "Intelligence coverage is solid.",
2041:			...aiContext.recommendations.slice(1, 3).map((item) => `${item.title}: ${item.action}`)
2043:		nextActions: [
2044:			...aiContext.nextBestActions.slice(0, 4).map((item) => `Resolve ${normalizeActionLabel(item)}.`),
2045:			...(aiContext.connectorIssues[0] ? [`Fix ${aiContext.connectorIssues[0].label}: ${aiContext.connectorIssues[0].reason}.`] : [])
2052:		missingData: buildMissingDataNotes(aiContext, "executive")
2056:function buildContentResponse(aiContext) {
2057:	const top = aiContext.topContent[0];
2058:	const weak = aiContext.weakContent[0];
2059:	const bestFormat = aiContext.learningPatterns.best_formats?.label;
2060:	const bestPlatform = aiContext.learningPatterns.best_platforms?.label;
2077:		nextActions: [
2087:		missingData: buildMissingDataNotes(aiContext, "content")
2091:function buildSeoResponse(aiContext) {
2092:	const seo = aiContext.seo;
2093:	const website = aiContext.website;
2111:			aiContext.recommendations.find((item) => item.domain === "seo")?.action || ""
2113:		nextActions: [
2123:		missingData: buildMissingDataNotes(aiContext, "seo")
2127:function buildAdsResponse(aiContext) {
2128:	const paid = aiContext.paid;
2135:			? `Paid media live with ${formatCurrency(paid.summary.spend, aiContext.currency)} tracked spend.`
2146:			aiContext.recommendations.find((item) => item.domain === "paid")?.action || ""
2148:		nextActions: [
2158:		missingData: buildMissingDataNotes(aiContext, "ads")
2162:function buildResearchResponse(aiContext) {
2167:			aiContext.missingIntegrations.length ? `Missing intelligence: ${aiContext.missingIntegrations.map((item) => item.label).join(", ")}.` : "Main intelligence lanes are structurally connected.",
2168:			aiContext.criticalGaps.length ? `Critical gaps affecting research quality: ${aiContext.criticalGaps.slice(0, 4).map(normalizeActionLabel).join(", ")}.` : "No major setup gaps blocking research quality.",
2169:			aiContext.learningPatterns.best_topics?.label ? `Current system learning: ${aiContext.learningPatterns.best_topics.label}.` : "Learning engine needs more live data."
2176:		nextActions: [
2187:			...buildMissingDataNotes(aiContext, "seo"),
2188:			...buildMissingDataNotes(aiContext, "ads"),
2189:			...buildMissingDataNotes(aiContext, "content")
2194:function buildOperationsTaskBlock(aiContext, message) {
2205:	if (/reconnect|missing tools|missing integrations/.test(query)) {
2211:function buildOperationsResponse(aiContext, message) {
2213:	const taskBlock = buildOperationsTaskBlock(aiContext, message);
2220:	if (/reconnect|connect|integration|tool|sync/.test(query)) routeSuggestions.push(routeSuggestion("Integrations", "integrations", "Reconnect data sources and restore intelligence coverage."));
2227:			aiContext.criticalGaps.length ? `Unresolved critical gaps: ${aiContext.criticalGaps.slice(0, 3).map(normalizeActionLabel).join(", ")}.` : "No critical gap is blocking this operation.",
2228:			aiContext.missingIntegrations.length ? "Intelligence coverage gaps may reduce execution quality." : "Core intelligence is available for routing."
2232:			aiContext.recommendations[0]?.action || "Use the current recommendation stack to choose the first high-impact step."
2234:		nextActions: taskBlock.steps,
2237:		missingData: buildMissingDataNotes(aiContext, "content")
2241:function buildResponseForMode(aiContext, classified, message) {
2246:			return buildContentResponse(aiContext);
2248:			return buildSeoResponse(aiContext);
2250:			return buildAdsResponse(aiContext);
2252:			return buildResearchResponse(aiContext);
2254:			return buildOperationsResponse(aiContext, message);
2258:				? buildOperationsResponse(aiContext, message)
2259:				: buildExecutiveResponse(aiContext);
2274:	rerender
2277:		session.intelligence = { ...session.intelligence, status: "error", error: "Select a project to load AI intelligence." };
2281:	const freshEnough = current.status === "ready" && current.project === projectName && current.loadedAt && (Date.now() - Date.parse(current.loadedAt)) < 1000 * 60 * 3;
2291:		status: "loading",
2300:				const insightsMissing = insightsResult.status === "rejected" && isMissingIntelligenceError(insightsResult.reason);
2301:				const learningMissing = learningResult.status === "rejected" && isMissingIntelligenceError(learningResult.reason);
2303:					insightsResult.status === "rejected" && !insightsMissing ? insightsResult.reason?.message : "",
2304:					learningResult.status === "rejected" && !learningMissing ? learningResult.reason?.message : ""
2308:					status: "ready",
2310:					insights: insightsResult.status === "fulfilled" ? insightsResult.value : (insightsMissing ? { project: projectName, generated_at: nowIso(), data_coverage: {} } : null),
2311:					learning: learningResult.status === "fulfilled" ? learningResult.value : (learningMissing ? { project: projectName, generated_at: nowIso(), learning_patterns: {}, recommendations: [] } : null),
2317:				session.intelligence = { ...session.intelligence, project: projectName, status: "error", error: error.message || "Failed to load live intelligence", loadingPromise: null };
2319:				rerender();
2324:	rerender();
2336:		lastCommand: asString(command),
2452:function normalizeAiInboundSourcePage(value) {
2462:function normalizeAiInboundSpecialistId(value, fallback = "operations") {
2471:function normalizeAiInboundTeamMode(value) {
2483:		const route = normalizeAiInboundSourcePage(rawRoute || stringRoute || fallbackRoute);
2485:		const reason = firstAiInboundText(record.reason, record.summary, record.description) || `Return to ${label} after AI Team review.`;
2493:		reason: `Return to ${fallbackLabel} after AI Team review.`
2497:function normalizeAiInboundOutputPreview(rawPreview, normalized) {
2498:	const preview = asObject(rawPreview);
2501:	const destinationRoute = normalizeAiInboundSourcePage(
2508:	const specialistId = normalizeAiInboundSpecialistId(preview.specialistId || preview.specialist_id || normalized.suggestedSpecialist, normalized.suggestedSpecialist);
2514:		summary: firstAiInboundText(preview.summary, preview.description, normalized.prompt),
2518:		sourcePrompt: firstAiInboundText(preview.sourcePrompt, preview.source_prompt, normalized.prompt),
2519:		status: asString(preview.status || "draft_preview"),
2520:		safetyLabel: firstAiInboundText(preview.safetyLabel, preview.safety_label, "Guidance and draft only. No backend execution."),
2551:	return [handoff?.source_page, handoff?.destination_page, payload.prompt, payload.title]
2559:	const draftContext = firstAiInboundObject(payload.draft_context, payload.draftContext, handoff?.draft_context, handoff?.draftContext);
2560:	const sourcePage = normalizeAiInboundSourcePage(firstAiInboundId(
2565:		draftContext.source_page,
2566:		draftContext.sourcePage
2569:	const explicitSpecialist = firstAiInboundId(payload.specialist, payload.specialist_id);
2570:	const suggestedSpecialist = normalizeAiInboundSpecialistId(
2571:		explicitSpecialist ||
2575:		draftContext.specialist ||
2576:		draftContext.specialist_id ||
2577:		draftContext.modeId ||
2578:		draftContext.mode_id ||
2583:	const prompt = normalizeAiComposerPrompt(firstAiInboundText(
2584:		payload.prompt,
2587:		draftContext.prompt,
2588:		draftContext.message,
2589:		draftContext.request,
2590:		draftContext.summary
2595:		draftContext.title,
2596:		draftContext.lastResponseTitle,
2603:		asAiInboundList(draftContext.routeSuggestions).length ? draftContext.routeSuggestions :
2604:		draftContext.route_suggestions,
2608:	const teamMode = normalizeAiInboundTeamMode(firstAiInboundId(payload.teamMode, payload.team_mode, draftContext.teamMode, draftContext.team_mode));
2609:	const rawOutputPreview = firstAiInboundObject(
2610:		draftContext.outputPreview,
2611:		draftContext.output_preview,
2612:		draftContext.phase2_output_preview,
2613:		payload.outputPreview,
2620:		prompt,
2621:		suggestedSpecialist,
2624:		outputPreview: null,
2625:		draftContext: {
2626:			...draftContext,
2630:		status: asString(handoff?.status || payload.status || "available"),
2631:		note: "Guidance only. No publishing, task creation, CRM updates, customer replies, workflow runs, exports, or backend actions are executed from this handoff."
2633:	normalized.outputPreview = normalizeAiInboundOutputPreview(rawOutputPreview, normalized);
2643:	session.draftMessage = normalized.prompt;
2644:	session.composerText = normalized.prompt;
2645:	session.modeId = normalized.suggestedSpecialist;
2655:	session.bridgeContext = null;
2657:	if (normalized.outputPreview) {
2658:		session.outputPreview = normalized.outputPreview;
2659:		session.outputWorkspaceTab = outputTabFromPreview(normalized.outputPreview);
2662:			preview: session.outputPreview,
2670:		...normalized.draftContext,
2672:		modeId: normalized.suggestedSpecialist,
2674:		lastCommand: normalized.prompt,
2693:async function submitDurableCommand({
2695:	aiContext,
2700:	executeProjectAiCommand,
2703:	const cleanCommand = asString(command).trim();
2704:	if (!cleanCommand) return { accepted: false, failed: false };
2705:	if (typeof executeProjectAiCommand !== "function") throw new Error("AI command service is unavailable.");
2713:		result = await executeProjectAiCommand(projectName, {
2714:			command: cleanCommand,
2719:				categories: aiContext.assetCategories,
2720:				approved_assets: aiContext.approvedAssets,
2721:				blockers: aiContext.assetBlockers
2731:		const payloadCommand = asObject(payload?.command);
2733:		resolvedModeId = asString(payloadCommand?.mode_id) || modeId || session.modeId;
2734:		commandId = asString(payloadCommand?.id);
2736:			status: "failed",
2737:			title: "Command failed",
2740:			nextActions: ["Check AI provider configuration and retry."],
2754:		content: cleanCommand,
2768:	session.history.unshift({
2769:		id: commandId || `history-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
2771:		command: cleanCommand,
2774:		responseTitle: response.title || (response.status === "failed" ? "Command failed" : ""),
2775:		failed: asString(response.status).toLowerCase() === "failed"
2777:	session.history = session.history.slice(0, 14);
2780:	syncAiWorkflowBridge({ projectName: aiContext.projectName, modeId: resolvedModeId, command: cleanCommand, response });
2782:	return { accepted: true, failed: asString(response.status).toLowerCase() === "failed" };
2791:  const projectedMembers = getProjectedTeamMembers(state);
2807:      name: asString(member.name || fallback.name || member.role || "AI Specialist"),
2816:function renderControlRoomHeader(aiContext, session, intelligenceStatus, escapeHtml) {
2817:	const projectLabel = aiContext.projectName || "No project selected";
2818:	const readinessLabel = aiContext.readinessScore != null ? `${aiContext.readinessScore}/100` : "--";
2819:	const coverageLabel = aiContext.coverageTotal > 0 ? `${aiContext.coveredCount}/${aiContext.coverageTotal}` : "--";
2826:	if (aiContext.projectName) caps.push("Campaign planning");
2827:	if (aiContext.hasLiveIntelligence) caps.push("Performance analysis");
2828:	if (aiContext.recommendations.length) caps.push(`${aiContext.recommendations.length} recommendations ready`);
2829:	if (aiContext.topContent.length) caps.push("Content intelligence");
2830:	if (aiContext.paid?.summary?.spend != null) caps.push("Paid media briefing");
2831:	if (aiContext.seo?.summary?.impressions != null) caps.push("SEO analysis");
2863:					<strong>${escapeHtml(aiContext.campaign || "None")}</strong>
2865:				${aiContext.market ? `<div class="ctrl-room-ctx-chip"><span>Market</span><strong>${escapeHtml(aiContext.market)}</strong></div>` : ""}
2885:function renderTeamSelector(session, escapeHtml) {
2911:function renderCommandComposer(session, aiContext, escapeHtml) {
2913:	const projectLabel = aiContext.projectName || "this project";
2917:		...new Set(aiContext.assetCategories.map((cat) => cat.label || cat.asset_type).filter(Boolean).slice(0, 8))
2926:					<h3 style="margin:0;font-size:14px;font-weight:600;color:var(--color-text-0);">${escapeHtml(mode.label)} — Command Composer</h3>
2935:					id="ctrlComposerInput"
2938:					placeholder="Ask ${escapeHtml(mode.label)} anything — what to do next, what content is working, which campaign to scale, or where to route the next action…"
2970:					<button id="ctrlSendBtn" class="ctrl-send-btn" type="button">Send prompt to ${escapeHtml(mode.label)}</button>
2974:				<div class="ctrl-composer-hint">Ctrl / Cmd + Enter to send · Suggested prompts prefill only · Draft stays local until you send to execute</div>
2984:function renderSuggestedPromptsSection(aiContext, session, escapeHtml) {
2985:	const projectLabel = aiContext.projectName || "this project";
2989:				<h3 style="margin:0;font-size:14px;font-weight:600;color:var(--color-text-0);">Suggested prompts</h3>
2990:				<span style="font-size:11px;color:var(--color-text-2);">Prefill only — send prompt for preview</span>
2993:				<div class="ctrl-prompts-grid">
2996:							class="ctrl-prompt-btn"
3001:							<span class="ctrl-prompt-icon">${action.icon}</span>
3003:								<span class="ctrl-prompt-label">${escapeHtml(action.label)}</span>
3004:								<span class="ctrl-prompt-sub">${escapeHtml(action.sub)}</span>
3018:function renderCleanResponse(response, escapeHtml, ownerId) {
3019:	const hasError = asString(response.status).toLowerCase() === "failed" || Boolean(asString(response.error));
3024:	const nextActions = normalizeDisplayList(response.nextActions || response.next_actions, 4);
3034:	const hasContent = title || summary || findings.length || recommendations.length || nextActions.length;
3070:			${nextActions.length ? `
3072:					<div class="ctrl-response-section-label">Next actions</div>
3074:						${nextActions.map((item) => `<div class="ctrl-response-item"><span>${escapeHtml(item)}</span></div>`).join("")}
3109:function renderMessageStream(messages, escapeHtml) {
3115:				<div class="ctrl-empty-body">Choose a specialist above, pick a suggested prompt, or write your own command and hit Send.</div>
3137:					${renderCleanResponse(asObject(message.response), escapeHtml, message.id)}
3148:function renderResultsPanel(session, escapeHtml) {
3156:				${renderMessageStream(session.messages, escapeHtml)}
3166:function renderRecentCommands(session, escapeHtml) {
3171:				<span style="font-size:11px;color:var(--color-text-2);">${session.history.length} logged · click to restore</span>
3174:				${session.history.length ? `
3176:						${session.history.slice(0, 8).map((entry, index) => {
3178:							const statusClass = entry.failed ? "danger" : "success";
3179:							const statusLabel = entry.failed ? "Failed" : "Done";
3181:								<button class="ctrl-recent-item" type="button" data-ctrl-history="${index}">
3189:										<span class="card-badge ${statusClass}" style="font-size:10px;padding:2px 7px;">${statusLabel}</span>
3196:					<div class="ctrl-empty-box">Commands you send appear here. Click any to restore and re-run.</div>
3207:function renderArtifactsPanel(aiContext, session, escapeHtml) {
3208:	const recommendations = aiContext.recommendations.slice(0, 4);
3209:	const patterns = Object.entries(asObject(aiContext.learningPatterns))
3246:							const recAction = humanizeValue(r.action || r.recommendation || r.summary || r.description || "");
3252:									${recAction ? `<div class="ctrl-artifact-body">${escapeHtml(recAction)}</div>` : ""}
3283:function buildConversationWorkContext(session, fallbackPrompt = "") {
3289:                ? { id: "team", label: "Full Team" }
3290:                : getPhase1SpecialistById(session.modeId);
3297:                                : asString(message.specialistLabel || specialist.label || "Specialist");
3303:        const prompt = asString(
3306:                latestResponse?.prompt ||
3318:                prompt ? `User request: ${prompt}` : "",
3324:                prompt,
3329:                specialistLabel: specialist.label || "Specialist",
3336:        const context = buildConversationWorkContext(session, fallbackPrompt);
3344:        const basePrompt = context.summary || context.prompt || `Prepare a ${typeLabel}.`;
3347:                `Convert this AI Team conversation into a ${typeLabel}.`,
3348:                `Specialist: ${context.specialistLabel}`,
3356:function setPreviewFromConversation({ session, intent, fallbackPrompt, projectName }) {
3358:        const preview = buildPhase2OutputPreview({
3361:                prompt: workPrompt,
3365:        const context = buildConversationWorkContext(session, fallbackPrompt);
3366:        preview.sourcePrompt = context.prompt || workPrompt;
3367:        preview.conversationContext = context.conversationText;
3379:        session.outputPreview = preview;
3387:function buildCommandEnvelope(session, prompt) {
3392:	return `${asString(prompt).trim()}\n\nCommand type: ${commandTypeLabel}\nTarget: ${targetLine}`;
3403:function buildSmartRecommendation(aiContext) {
3404:	if (aiContext.criticalGaps.length) {
3407:			reason: `${aiContext.criticalGaps.length} critical setup gap${aiContext.criticalGaps.length === 1 ? "" : "s"} can block launch quality and downstream automation reliability.`,
3408:			command: `Review the critical readiness gaps for ${aiContext.projectName || "this project"} and produce a fix plan with owners, order, and dependencies.`,
3413:	if (aiContext.assetBlockers.length) {
3416:			reason: `${aiContext.assetBlockers.length} asset category blocker${aiContext.assetBlockers.length === 1 ? "" : "s"} may reduce content throughput and campaign delivery speed.`,
3417:			command: `Create an asset unblock plan for ${aiContext.projectName || "this project"}. List missing files, priority, and where each is needed.`,
3422:	if (aiContext.missingIntegrations.length || aiContext.connectorIssues.length) {
3423:		const impacted = aiContext.missingIntegrations.length + aiContext.connectorIssues.length;
3427:			command: `Build an integration recovery plan for ${aiContext.projectName || "this project"}. Prioritize connectors by business impact and data coverage gain.`,
3432:	if (!aiContext.campaign || aiContext.campaign === "Not selected") {
3436:			command: `Create a campaign operating brief for ${aiContext.projectName || "this project"} with objective, audience, channels, and first execution wave.`,
3444:		command: `Generate the next high-impact content wave for ${aiContext.projectName || "this project"} based on current readiness and campaign context.`,
3456:function getPhase1SpecialistById(value) {
3503:	const preview = asObject(session.outputPreview);
3526:function outputTabFromPreview(preview) {
3537:	return outputTabFromPreview(asObject(session.outputPreview));
3540:function getToolOutputTypeLabel(tool) {
3544:		workflow: "Workflow Preview",
3545:		handoff: "Handoff Preview",
3548:	if (labels[asString(tool.intent)]) return labels[asString(tool.intent)];
3549:	const firstOutput = asArray(tool.outputTypes)[0];
3553:function getToolDestinationRoute(tool, session) {
3554:	if (tool.route) return asString(tool.route || "workflows");
3555:	if (session?.teamMode === "team") return tool.intent === "task" ? "task-center" : "workflows";
3556:	const outputType = tool.intent === "media" ? "guidance" : asString(tool.intent || "guidance");
3557:	return destinationRouteForSpecialist(session?.modeId || "operations", outputType);
3560:function getToolExecutionStatusLabel(tool) {
3561:	if (tool.safetyLevel === "confirmation_required") return "Destination confirmation required";
3562:	if (tool.actionType === "source_required") return "Source required";
3566:function getToolSafeActionLabel(tool) {
3567:	if (tool.intent === "workflow") return "Draft";
3568:	if (tool.intent === "handoff") return "Prepare";
3569:	if (tool.intent === "task") return "Draft";
3570:	if (/review|check|compliance|readiness|governance/i.test(asString(tool.label))) return "Review";
3574:function summarizeToolPurpose(tool) {
3575:	const template = asString(tool.template || "")
3584:function renderAiRoomChainSegment(items, escapeHtml) {
3591:function renderAiRoomTeamChain(escapeHtml) {
3594:			${renderAiRoomChainSegment(AI_ROOM_TEAM_CHAIN, escapeHtml)}
3596:			${renderAiRoomChainSegment(AI_ROOM_BUSINESS_BRANCH, escapeHtml)}
3601:function renderPhase1Header(session, projectName, aiContext, bridgeStatus, escapeHtml) {
3603:	const modeLabel = session.teamMode === "team" ? "Full Team" : "Solo Specialist";
3604:	const languagePlan = getWorkspaceLanguagePlan(aiContext);
3606:	const readinessLabel = aiContext.readinessScore != null ? `${aiContext.readinessScore}/100` : "Pending";
3612:				<h1 class="aicmd-room-title mhos-context-title">AI Team Command Center</h1>
3617:					${escapeHtml(safeBridgeStatus.available ? "Guidance connected" : "Preview guarded")}
3623:							${escapeHtml(asString(item.title || "AI Team session").slice(0, 48))}
3667:function renderPhase1TeamRail(session, bridgeStatus, escapeHtml) {
3669:	const plannedSpecialists = AI_ROOM_PLANNED_SPECIALISTS.map((item) => `
3674:				<span class="aicmd-room-member-role">${escapeHtml(item.status)} - destination-owned authority</span>
3682:			<strong>Full Team Mode</strong>
3683:			<span>Full Team prepares a coordinated, review-ready plan. It does <b>not</b> execute workflows or publish anything.</span>
3684:			${renderAiRoomTeamChain(escapeHtml)}
3692:					<span class="aicmd-room-panel-kicker">AI Team</span>
3693:					<strong>Specialists</strong>
3699:					Ask Specialist
3702:					Full Team
3710:					const isTeamActive = session.teamMode === "team";
3713:					const roleLine = `${spec.status || "Ready"} - ${spec.position || spec.label || "Specialist"}${backendAlias ? ` - Backend: ${backendAlias}` : ""}`;
3716:							class="aicmd-v2-spec-btn aicmd-room-member${isActive ? " is-active" : ""}${isTeamActive ? " is-team-active" : ""}"
3735:				${plannedSpecialists}
3741:function renderPhase1Profile(session, escapeHtml) {
3747:					<span class="aicmd-v2-profile-icon">Team</span>
3749:						<h2 class="aicmd-v2-profile-title">Full AI Team</h2>
3760:	const spec = getPhase1SpecialistById(session.modeId);
3774:				${specialistTools.slice(0, 3).map((tool) => `<span class="aicmd-v2-strength-chip is-tool">${escapeHtml(tool.label)}</span>`).join("")}
3781:function getAiSpecialistWorkingMessage(session = {}) {
3782:        const isTeam = session.teamMode === "team";
3783:        const spec = isTeam
3784:                ? { label: "Full AI Team" }
3785:                : getPhase1SpecialistById(session.modeId);
3789:        if (isTeam) return `${label} is reviewing your request...`;
3803:function renderAiRoomConversationHeader(session, bridgeStatus, escapeHtml) {
3804:	const spec = getPhase1SpecialistById(session.modeId);
3806:	const isTeam = session.teamMode === "team";
3807:	const title = isTeam ? "Full AI Team" : spec.label;
3808:	const roleLine = isTeam
3809:		? "Team orchestration across strategy, writing, media/video, compliance, publishing, customer operations, sales/CRM, and operations"
3811:	const avatarLabel = isTeam ? "Team" : getAiRoomInitials(spec);
3812:	const modeLabel = isTeam ? "Full Team" : "Solo Specialist";
3815:		<div class="aicmd-room-conversation-head" data-role="${escapeHtml(isTeam ? "team" : getAiRoomRoleId(spec.id))}">
3821:				${isTeam ? renderAiRoomTeamChain(escapeHtml) : ""}
3824:				<span class="aicmd-room-status-dot${safeBridgeStatus.available ? " is-live" : ""}"></span>
3825:				<strong>${escapeHtml(safeBridgeStatus.available ? "Available" : "Preview-safe")}</strong>
3832:function getCanonicalToolIntent(tool = {}) {
3833:	const id = asString(tool.id);
3834:	const outputs = asArray(tool.outputTypes).join(" ");
3835:	const haystack = `${id} ${outputs} ${asString(tool.label)}`.toLowerCase();
3842:function getCanonicalToolRoute(tool = {}, session) {
3843:	const destinations = asArray(tool.destinations).filter(Boolean);
3846:	return destinationRouteForSpecialist(session?.modeId || "operations", getCanonicalToolIntent(tool));
3849:function canonicalToolNeedsSelectedSource(tool = {}) {
3850:	const sourceMeta = asArray(tool.sourceTypes).join(" ");
3851:	return tool.actionType === "source_required" || /source_of_truth_assets|selected_asset|proof_doc|legal_doc|privacy_policy/i.test(sourceMeta);
3854:function normalizeCanonicalToolForPanel(tool = {}, session) {
3856:		...tool,
3858:		intent: getCanonicalToolIntent(tool),
3859:		route: getCanonicalToolRoute(tool, session),
3860:		requiresSelectedSource: canonicalToolNeedsSelectedSource(tool),
3861:		template: asString(tool.template || "Prepare a review-ready draft for {projectName}.")
3866:	const toolModeId = MODE_ID_ALIASES[getAiRoomRoleId(session.modeId)] || getAiRoomRoleId(session.modeId);
3868:		specialistId: toolModeId,
3871:	}).map((tool) => normalizeCanonicalToolForPanel(tool, session));
3874:function renderPhase35WorkspaceTabs(session, bridgeStatus, escapeHtml) {
3877:		{ id: "preview", label: "Preview", hint: "Draft output" },
3878:		{ id: "tools", label: "Tools", hint: "Role actions" },
3879:		{ id: "context", label: "Context", hint: "Live state" },
3880:		{ id: "history", label: "History", hint: "Saved outputs" }
3901:function renderPhase35ToolsPanel(session, projectName, aiContext, escapeHtml) {
3902:	const tools = getPhase35ToolSet(session);
3903:	const specialistLabel = session.teamMode === "team" ? "Full Team" : getPhase1SpecialistById(session.modeId)?.label || "Specialist";
3907:		<section class="aicmd-v2-tools aicmd-room-tools" data-role="${escapeHtml(roleId)}">
3908:			<div class="aicmd-v2-tools-head">
3910:					<h3 class="aicmd-v2-tools-title">${escapeHtml(specialistLabel)} Quick Actions</h3>
3911:					<span class="aicmd-v2-tools-subtitle">Fast specialist actions for the current output. Review-only: prepares drafts, previews, or handoffs without backend execution.</span>
3913:				<span class="aicmd-v2-tools-count">${tools.length} tools</span>
3915:			<div class="aicmd-v2-tools-grid aicmd-room-tools-grid">
3916:				${tools.map((tool) => {
3917:					const outputLabel = getToolOutputTypeLabel(tool);
3918:					const actionLabel = getToolSafeActionLabel(tool);
3919:					const purpose = summarizeToolPurpose(tool);
3920:					const destination = routeLabel(getToolDestinationRoute(tool, session));
3921:					const status = getToolExecutionStatusLabel(tool);
3925:							class="aicmd-v2-tool-btn aicmd-room-tool-card"
3926:							data-aicmdv2-tool="${escapeHtml(tool.id)}"
3929:							<span class="aicmd-room-tool-topline">
3930:								<strong class="aicmd-v2-tool-label">${escapeHtml(tool.label)}</strong>
3931:								<span class="aicmd-room-tool-action">${escapeHtml(actionLabel)}</span>
3933:							<span class="aicmd-room-tool-purpose">${escapeHtml(purpose)}</span>
3934:							<span class="aicmd-v2-tool-meta">
3937:								<span>Status: ${escapeHtml(status)}</span>
3943:			${projectName ? `<div class="aicmd-v2-tools-note">Project context: ${escapeHtml(projectName)}</div>` : ""}
3948:function renderLanguageMarketStrip(aiContext, escapeHtml) {
3949:	const languagePlan = getWorkspaceLanguagePlan(aiContext);
3959:function renderPhase35ReadinessStrip(aiContext, bridgeStatus, escapeHtml) {
3960:	const providerConfigured = isProviderLikelyConfigured(aiContext);
3964:		{ label: "Team chat", value: bridgeStatus.available ? "Ready" : "Coming", className: bridgeStatus.available ? "is-available" : "is-planned" },
3967:		{ label: "Image prompt generation", value: providerConfigured ? "Provider may be ready" : "Provider dependent", className: providerConfigured ? "is-available" : "is-planned" }
3981:function renderPhase1Composer(session, aiContext, escapeHtml) {
3982:		const spec = getPhase1SpecialistById(session.modeId);
3984:		const isTeam = session.teamMode === "team";
3985:		const specLabel = isTeam ? "Team Meeting Room" : spec.label;
3986:		const headerText = isTeam
3987:			? "Coordinated Team Review — Guidance Only"
3990:		const roleId = isTeam ? "team" : getAiRoomRoleId(spec.id);
3997:						<span class="aicmd-v2-composer-icon">${escapeHtml(isTeam ? "Team" : getAiRoomInitials(spec))}</span>
4012:					<div class="aicmd-chatgpt-toolbar" aria-label="Composer controls">
4013:						<div class="aicmd-chatgpt-tools-left">
4016:						<div class="aicmd-chatgpt-tools-right">
4018:							<button id="aicmdV2AskBtn" class="aicmd-chatgpt-send-btn" type="button" ${isGenerating ? "disabled" : ""} title="Send message">
4026:					${renderLanguageMarketStrip(aiContext, escapeHtml)}
4029:				<div class="aicmd-v2-composer-hint">Draft/review only · suggested prompts prefill this composer · execution happens in the owning workspace after confirmation.</div>
4035:function renderPhase2PreviewPanel(session, escapeHtml) {
4036:	const preview = asObject(session.outputPreview);
4037:	const hasPreview = Boolean(preview.outputType && preview.title);
4038:	if (!hasPreview) {
4043:						<h3 class="aicmd-v2-preview-title">Preview</h3>
4046:					<span class="aicmd-v2-preview-status aicmd-v2-preview-status-empty">Waiting</span>
4050:					<span>Ask a specialist or send the chat response to preview.</span>
4056:	const structuredPreview = buildStructuredPreviewBlocks(preview);
4057:	const destination = routeLabel(preview.destinationRoute || destinationRouteForSpecialist(session.modeId, preview.outputType || "guidance"));
4059:		? { id: "team", label: "Full Team" }
4060:		: getPhase1SpecialistById(preview.specialistId || session.modeId);
4061:	const outputLabel = hasPreview ? formatOutputTypeLabel(preview.outputType) : titleCase(activeTab);
4062:	const routeActionLabel = destination === "Content Studio"
4067:	const confirmationLabel = hasPreview
4075:					<h3 class="aicmd-v2-preview-title">Preview</h3>
4078:				<span class="aicmd-v2-preview-status">${escapeHtml(titleCase(preview.status || "draft_preview"))}</span>
4083:				<span class="aicmd-v2-preview-chip"><strong>Specialist:</strong> ${escapeHtml(specialist.label || "Specialist")}</span>
4091:				<p class="aicmd-v2-preview-summary">${escapeHtml(humanizeValue(preview.summary, "Guidance preview prepared."))}</p>
4093:				${structuredPreview.draftText ? `
4094:					<div class="aicmd-v2-preview-draft">${escapeHtml(structuredPreview.draftText)}</div>
4097:				${structuredPreview.blocks.length ? `
4099:						${structuredPreview.blocks.map((block) => `
4112:					<p class="aicmd-v2-preview-next-action">${escapeHtml(humanizeValue(preview.nextSafeAction, `Review in ${destination}.`))}</p>
4117:					<p class="aicmd-v2-preview-confirmation">${escapeHtml(humanizeValue(preview.safetyLabel, "Guidance only. No backend execution."))}</p>
4123:				<button id="aicmdV2LegacyPreviewCopyBtn" class="aicmd-v2-btn-secondary" type="button">Copy</button>
4124:				<button id="aicmdV2LegacyPreviewUseBtn" class="aicmd-v2-btn-secondary" type="button">Use in Composer</button>
4125:				<button id="aicmdV2LegacyPreviewSendBtn" class="aicmd-v2-btn-secondary" type="button">Route Draft</button>
4126:				<button id="aicmdV2LegacyPreviewSaveBtn" class="aicmd-v2-btn-ghost" type="button">Save</button>
4127:				<button id="aicmdV2LegacyPreviewReadBtn" class="aicmd-v2-btn-ghost" type="button" ${typeof speechSynthesis === "undefined" ? "disabled" : ""}>Read preview</button>
4128:				<button id="aicmdV2LegacyPreviewClearBtn" class="aicmd-v2-btn-ghost" type="button">Clear preview</button>
4134:function renderAiRoomOutputWorkspace(session, aiContext, escapeHtml) {
4135:	const preview = asObject(session.outputPreview);
4136:	const hasPreview = Boolean(preview.outputType && preview.title);
4138:	const structuredPreview = hasPreview ? buildStructuredPreviewBlocks(preview) : { blocks: [], draftText: "", compactSummary: "" };
4139:	const languagePlan = getWorkspaceLanguagePlan(aiContext);
4140:	const destination = routeLabel(preview.destinationRoute || destinationRouteForSpecialist(session.modeId, preview.outputType || "guidance"));
4142:		? { id: "team", label: "Full Team" }
4143:		: getPhase1SpecialistById(preview.specialistId || session.modeId);
4144:	const outputLabel = hasPreview ? formatOutputTypeLabel(preview.outputType) : titleCase(activeTab);
4145:	const routeActionLabel = destination === "Content Studio"
4150:	const confirmationLabel = hasPreview
4160:                                        <p>${hasPreview ? "Review the result, then route draft context to the next workspace." : "Create a preview from the conversation before routing work to another workspace."}</p>
4165:						${hasPreview ? `
4185:                                        <span><strong>Target</strong>${escapeHtml(aiContext.projectName || "Current project")}</span>
4189:			${hasPreview ? `
4193:						<span>${escapeHtml(specialist.label || "Specialist")}</span>
4196:					<p class="aicmd-room-output-summary">${escapeHtml(structuredPreview.compactSummary || humanizeValue(preview.summary, "Guidance preview prepared."))}</p>
4200:					${structuredPreview.blocks.length ? `
4202:							${structuredPreview.blocks.map((block) => `
4214:						<span>Next step</span>
4215:						<strong>${escapeHtml(humanizeValue(preview.nextSafeAction, `Review in ${destination}.`))}</strong>
4218:						<strong>${escapeHtml(humanizeValue(preview.safetyLabel, "Guidance only. No backend execution."))}</strong>
4225:                                        <span>Choose Draft, Task Preview, Workflow Preview, or Handoff Preview, then create a review-ready preview from the conversation.</span>
4229:                        ${hasPreview ? `
4231:                                        <button id="aicmdV2PreviewSendBtn" class="aicmd-v2-btn-primary" type="button">${escapeHtml(routeActionLabel)}</button>
4232:                                        <button id="aicmdV2PreviewCopyBtn" class="aicmd-v2-btn-secondary" type="button">Copy</button>
4233:                                        <button id="aicmdV2PreviewUseBtn" class="aicmd-v2-btn-secondary" type="button">Use in Composer</button>
4234:                                        <button id="aicmdV2PreviewClearBtn" class="aicmd-v2-btn-ghost" type="button">Clear</button>
4238:                                <div class="aicmd-room-planned-note">No routed preview yet. Create a Draft, Task Preview, Workflow Preview, or Handoff Preview from the conversation first.</div>
4244:function renderAiRoomStatusStrip(aiContext, session, bridgeStatus, escapeHtml) {
4245:	const preview = asObject(session.outputPreview);
4246:	const readiness = aiContext.readinessScore != null ? `${aiContext.readinessScore}/100` : "No score";
4248:	const connectedTools = bridgeStatus.available ? "Guidance bridge" : "Preview tools";
4249:	const integrations = aiContext.coverageTotal > 0 ? `${aiContext.coveredCount}/${aiContext.coverageTotal}` : "0 active";
4254:		<footer class="aicmd-room-status-strip">
4257:			<div><span>Connected tools</span><strong>${escapeHtml(connectedTools)}</strong></div>
4264:function renderPhase2MediaStatusPanel(aiContext, escapeHtml) {
4265:	const providerConfigured = isProviderLikelyConfigured(aiContext);
4272:		<section class="aicmd-v2-media-status">
4273:			<div class="aicmd-v2-media-status-head">
4274:				<h3 class="aicmd-v2-media-status-title">Media, Voice &amp; Chat Capability</h3>
4275:				<span class="aicmd-v2-media-status-badge">Honest readiness view</span>
4277:			<ul class="aicmd-v2-media-status-list">
4278:				<li><span>Image prompt generation</span><strong class="${providerConfigured ? "is-available" : "is-planned"}">${escapeHtml(providerConfigured ? "Provider configured" : "Needs provider connection")}</strong></li>
4280:				<li><span>Native GPU video rendering</span><strong class="is-planned">Requires connected GPU worker</strong></li>
4284:				<li><span>Team chat execution bridge</span><strong class="is-planned">Planned — requires backend bridge</strong></li>
4291:function renderPhase3SpecialistConversation(session, bridgeStatus, escapeHtml) {
4293:        const isTeam = session.teamMode === "team";
4294:        const selectedSpec = isTeam ? { id: "team", label: "Full Team", position: "Team workflow" } : getPhase1SpecialistById(session.modeId);
4295:        const selectedRoleId = isTeam ? "team" : getAiRoomRoleId(selectedSpec.id);
4296:        const selectedLabel = isTeam ? "Full Team" : selectedSpec.label || "Specialist";
4297:        const selectedModeLabel = isTeam ? "Team workflow" : "Solo specialist";
4304:                        return isTeam ? message.teamMode === "team" || messageRoleId === "team" : messageRoleId === selectedRoleId;
4307:                        return isTeam ? messageRoleId === "team" : messageRoleId === selectedRoleId;
4314:                return isTeam ? producerId === "team" : producerId === selectedRoleId;
4324:        const bridgeLabel = safeBridgeStatus.available ? "Connected" : "Preview-safe";
4327:                : "Preview-safe. Chat tools require the protected AI chat route.";
4330:                : "AI chat route is not connected yet. Preview tools remain available.";
4331:        const bridgeContext = asObject(session.bridgeContext);
4332:        const bridgeSpecialistId = getAiRoomRoleId(bridgeContext.specialistId || "");
4333:        const showBridgeContext = Boolean(
4334:                bridgeContext.source &&
4335:                bridgeContext.specialistLabel &&
4336:                (isTeam || !bridgeSpecialistId || bridgeSpecialistId === selectedRoleId)
4342:        }).map((tool) => asString(tool.label)).filter(Boolean);
4343:        const promptModeId = MODE_ID_ALIASES[getAiRoomRoleId(session.modeId)] || getAiRoomRoleId(session.modeId);
4346:                : (SPECIALIST_SUGGESTED_PROMPTS[promptModeId] || SPECIALIST_SUGGESTED_PROMPTS.operations);
4347:        const nextAction = asString(nextPrompts[0]?.label || "Prepare guidance");
4348:        const toolHint = selectedToolHints.length ? selectedToolHints.join(", ") : "Draft and route guidance";
4351:        const inboundSourceLabel = asString(inbound.sourceLabel || "");
4354:        const renderMessage = (message) => {
4357:                const label = isUser ? "You" : asString(message.specialistLabel || selectedLabel || "Specialist");
4379:                                content: item.prompt || "",
4399:                                        <p class="aicmd-v2-chat-subtitle">Focused chat with the selected specialist. Other specialist replies stay in shared room history.</p>
4409:                                        <strong>${escapeHtml(inboundSourceLabel ? `Inbound from ${inboundSourceLabel}` : "Project session")}</strong>
4412:                                ${showBridgeContext ? `
4415:                                                <strong>${escapeHtml("Specialist context loaded from Home: " + bridgeContext.specialistLabel)}</strong>
4426:                                        <strong>${escapeHtml(toolHint)}</strong>
4427:                                        <small>${escapeHtml("Next: " + nextAction)}</small>
4437:                                                <div class="aicmd-v2-chat-loading aicmd-room-typing-indicator" role="status" aria-live="polite">
4440:                                                                <strong>${escapeHtml(getAiSpecialistWorkingMessage(session))}</strong>
4449:                                        ${conversationMessages.map(renderMessage).join("")}
4461:                                                <span class="aicmd-room-response-avatar">${escapeHtml(selectedRoleId === "team" ? "Team" : getAiRoomInitials({ id: selectedRoleId, label: selectedLabel }))}</span>
4468:                                                <button id="aicmdV3ResponseConvertBtn" class="aicmd-v2-btn-primary" type="button">Create Preview</button>
4477:                                <details class="aicmd-room-shared-history">
4479:                                                Shared room history
4482:                                        <div class="aicmd-room-shared-history-list">
4485:                                                        const producerLabel = item.specialistLabel || "Specialist";
4487:                                                                <article class="aicmd-room-shared-history-item" data-role="${escapeHtml(producerId)}">
4503:function renderPhase1SuggestedPrompts(session, escapeHtml) {
4504:	const promptModeId = MODE_ID_ALIASES[getAiRoomRoleId(session.modeId)] || getAiRoomRoleId(session.modeId);
4505:	const prompts = session.teamMode === "team"
4507:		: (SPECIALIST_SUGGESTED_PROMPTS[promptModeId] || SPECIALIST_SUGGESTED_PROMPTS.operations);
4509:		<div class="aicmd-v2-prompts">
4510:			<div class="aicmd-v2-prompts-head">
4511:				<span class="aicmd-v2-prompts-label">Suggested prompts</span>
4512:				<span class="aicmd-v2-prompts-hint">Click to prefill the composer — send when ready</span>
4514:			<div class="aicmd-v2-prompts-grid">
4515:				${prompts.map((p, idx) => `
4517:						class="aicmd-v2-prompt-chip"
4519:						data-aicmdv2-prompt="${idx}"
4520:						data-aicmdv2-prompt-text="${escapeHtml(p.prompt || `${p.label}. ${p.sub}. Prepare this as a review-ready draft only; do not execute anything.`)}"
4522:						<span class="aicmd-v2-prompt-chip-label">${escapeHtml(p.label)}</span>
4523:						<span class="aicmd-v2-prompt-chip-sub">${escapeHtml(p.sub)}</span>
4531:function renderPhase1ContextPanel(state, session, aiContext, escapeHtml) {
4532:	const projectName = aiContext.projectName;
4533:	const readiness = aiContext.readinessScore;
4534:	const languagePlan = getWorkspaceLanguagePlan(aiContext);
4535:	const specialist = session.teamMode === "team" ? { label: "Full Team" } : getPhase1SpecialistById(session.modeId);
4536:	const destination = routeLabel(destinationRouteForSpecialist(session.modeId, asObject(session.outputPreview).outputType || "guidance"));
4537:	const sessionState = session.responseLoading ? "Generating" : (session.outputPreview ? "Preview ready" : (asString(session.draftMessage).trim() ? "Drafting" : "Ready"));
4540:		{ label: "Specialist", value: specialist.label || "Specialist", present: true },
4544:		{ label: "Mode", value: session.teamMode === "team" ? "Full Team" : "Solo Specialist", present: true },
4548:		{ label: "Integrations", value: aiContext.coverageTotal > 0 ? `${aiContext.coveredCount}/${aiContext.coverageTotal} connected` : "No coverage data", present: aiContext.coveredCount > 0 },
4549:		{ label: "Approved assets", value: aiContext.approvedAssets.length ? `${aiContext.approvedAssets.length} ready` : "No approved assets", present: aiContext.approvedAssets.length > 0 },
4552:	const scopedContextItems = session.teamMode === "solo" && session.modeId === "customer_ops"
4569:	const visibleContextItems = contextItems.concat(scopedContextItems);
4574:				<span class="aicmd-v2-context-label mhos-context-kicker">Context</span>
4577:				${visibleContextItems.map((item) => `
4588:function renderPhase1SafetyPanel(escapeHtml) {
4598:					<span>Guidance only — no execution happens from this workspace without confirmation.</span>
4610:					<span>Backend owns authority — AI Command prepares guidance, previews, and handoff context. It does not override execution controls or mutate Operations records.</span>
4617:function renderPhase4HistoryPanel(session, escapeHtml) {
4619:	const preview = asObject(session.outputPreview);
4623:			title: item.responseTitle || item.specialistLabel || "Specialist response",
4624:			body: item.prompt || item.responseText || "",

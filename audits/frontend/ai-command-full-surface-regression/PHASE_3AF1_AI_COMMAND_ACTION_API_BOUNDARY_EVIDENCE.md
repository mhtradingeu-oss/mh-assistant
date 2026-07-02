# PHASE 3AF.1 — AI Command Action / API Boundary Evidence

## AI Command imports and API helpers
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

## AI API helpers in api.js
1553:export async function executeProjectAiCommand(projectName, payload = {}) {
1566:export async function executeProjectAiChat(projectName, payload = {}) {
1581:export async function executeProjectAiGuidance(projectName, payload = {}) {

## AI Command action handlers and persistence/navigation
17:        setSharedAiDraft,
18:        setSharedHandoff
26:        executeProjectAiChat,
27:        executeProjectAiGuidance
63:                id: "publisher",
67:                routeHint: "publishing"
124:	publisher: "publisher",
150:		safetyNote: "All outputs are guidance and draft only. Execution requires explicit confirmation.",
160:		canHelp: ["Draft captions and hooks", "Write email copy", "Create landing page text", "Prepare publisher handoff", "Suggest message variants"],
163:		safetyNote: "Drafts require review before publishing. Cannot approve or publish without confirmation.",
193:		id: "publisher",
198:		placeholder: "Ask the Publisher to review publishing readiness, check scheduling, or prepare a handoff package…",
199:		canHelp: ["Review publishing readiness", "Check scheduled jobs", "Prepare handoff packages", "Map publishing dependencies", "Flag pre-publish risks"],
202:		safetyNote: "Publishing always requires explicit approval. No live publishing from AI guidance alone.",
236:		summary: "Claims review, approval safety, publishing risk, and governance notes.",
237:		placeholder: "Ask the Compliance Reviewer to check claims, approval risks, publishing safety, and governance notes…",
238:		canHelp: ["Review marketing claims", "Flag approval risks", "Check publishing safety", "Prepare governance notes", "Identify compliance blockers"],
239:		cannotDo: ["Grant approvals directly", "Override governance gates", "Publish on behalf of approvers", "Remove flags without review"],
252:		cannotDo: ["Run workflows without confirmation", "Auto-approve tasks", "Override authority gates", "Execute backend operations directly"],
267:		safetyNote: "Customer operations outputs are drafts only. Sending replies, ticket creation, and escalations require confirmation in the owning surface.",
280:		safetyNote: "Sales and CRM outputs are guidance and drafts only. CRM mutations and outreach sends require confirmation in the owning surface.",
311:	publisher: [
312:		{ label: "Review publishing readiness", sub: "Check what is ready to publish" },
313:		{ label: "Flag pre-publish risks", sub: "Identify what needs review first" },
315:		{ label: "Prepare a handoff package", sub: "For the approver review" }
331:		{ label: "Flag publishing risks", sub: "Identify blockers before release" },
359:	{ label: "Prepare a full handoff sequence", sub: "Strategy, creative, compliance, publishing, ops" },
376:	{ id: "task", label: "Task", helper: "Task-shaped output" },
390:	publisher: "PB",
437:		{ id: "publisher-package", label: "Publisher Package", action: "preview", intent: "handoff", template: "Prepare a Publisher handoff for {project}. Include German copy package, CTA, notes, and remaining checks." }
453:	publisher: [
454:		{ id: "publishing-checklist", label: "Publishing Checklist", action: "preview", intent: "handoff", template: "Build a publishing checklist for {project}. Include German copy, assets, claims checks, and channel readiness." },
455:		{ id: "final-packaging", label: "Final Packaging", action: "preview", intent: "handoff", template: "Prepare a final publishing package for {project}. Include copy, CTA, asset notes, approvals, and destination channel." },
456:		{ id: "channel-formatting", label: "Channel Formatting", action: "preview", intent: "guidance", template: "Format the next output for {project} by channel. Include German copy, limits, CTA, and scheduling notes." },
457:		{ id: "schedule-draft", label: "Schedule Draft", action: "preview", intent: "workflow", template: "Prepare a publishing schedule draft for {project}. Include channel cadence, dependencies, and review gates." },
458:		{ id: "open-publishing", label: "Open Publishing", action: "route", route: "publishing" }
478:		{ id: "publish-readiness", label: "Publish Readiness", action: "preview", intent: "handoff", template: "Review publish readiness for {project}. Confirm what needs human approval before release." },
492:		{ id: "create-ticket-draft", label: "Create Ticket Draft", action: "preview", intent: "task", template: "Create a ticket draft for {project}. Include issue, priority, owner suggestion, evidence needed, and next safe action." },
500:		{ id: "outreach-draft", label: "Outreach Draft", action: "preview", intent: "guidance", template: "Draft outreach for {project}. Include subject or opener, personalized message, CTA, and review notes before sending." },
519:const AI_COMMAND_LOCAL_OUTPUTS_KEY = "mh-ai-command-local-outputs-v1";
633:		if (/act as the publisher/i.test(text)) return "publisher";
674:	if (/publish\s*now|send\s*external|paid\s*ads|final\s*approval/i.test(command)) {
677:			type: "publish_now",
678:			targetPage: "publishing",
682:				reason: "Requires approval gate before external publishing actions."
697:	if (/act as the publisher/i.test(text)) return "publisher";
822:function setAiComposerValue(session, input, value) {
826:  if (input) {
827:    input.value = cleanValue;
828:    input.focus?.();
869:		overview.publishing_language ||
870:		overview.publish_language ||
871:		overview.output_language ||
875:	const publishLanguage = configuredPublishLanguage || "German";
878:		overview.input_language ||
885:		publishLanguage,
939:			outputWorkspaceTab: "draft",
969:			outputPreview: null,
970:			activeOutputTab: "draft",
1035:function persistSessionDraft(projectName, session, hint) {
1046:function readLocalOutputMap() {
1057:function writeLocalOutputMap(map) {
1064:function loadLocalOutput(projectName) {
1066:	return asObject(readLocalOutputMap()[key]);
1069:function saveLocalOutput(projectName, outputPayload) {
1071:	const map = readLocalOutputMap();
1074:		...asObject(outputPayload),
1077:	writeLocalOutputMap(map);
1081:function getAiResponseBridgeStatus(executeProjectAiGuidanceFn) {
1082:	if (typeof executeProjectAiGuidanceFn !== "function") {
1122:        const hasContent = messages.length || responses.length || asObject(session.outputPreview).title;
1138:                preview: session.outputPreview || null,
1139:                createdAt: asString(options.createdAt || session.activeChatSessionCreatedAt || now),
1148:        session.activeChatSessionCreatedAt = record.createdAt;
1161:        session.outputPreview = asObject(record.preview);
1162:        session.outputWorkspaceTab = outputTabFromPreview(session.outputPreview);
1163:        session.activeOutputTab = session.outputWorkspaceTab;
1169:        session.activeChatSessionCreatedAt = asString(record.createdAt || record.updatedAt || nowIso());
1181:function buildSpecialistChatPrompt({ prompt, specialistLabel, modeLabel, projectName, language, outputLanguage, market }) {
1187:	const safeOutputLanguage = asString(outputLanguage || "German").trim();
1202:		`Publishable output language: ${safeOutputLanguage}`,
1206:                `Use ${safeOutputLanguage} only for customer-facing or publishable copy such as captions, ads, emails, landing pages, final campaign text, or publishing packages.`,
1207:                "When you include publishable copy, label it clearly as publishable content and keep the explanation in the user chat language.",
1210:		`When drafting publishable copy, write it in ${safeOutputLanguage}.`,
1212:		"Never claim publish, approval, deletion, archival, sync, or operational runs happened.",
1258:function destinationRouteForSpecialist(specialistId, outputType) {
1261:	if (outputType === "workflow") return "workflows";
1262:	if (id === "strategist") return outputType === "task" ? "campaign-studio" : "workflows";
1266:	if (id === "publisher") return "publishing";
1270:	if (id === "operations") return outputType === "task" ? "task-center" : "workflows";
1271:	if (id === "customer_ops") return outputType === "task" ? "task-center" : "operations-centers";
1277:function resolveAiResponseOutputRoute(session, response = {}) {
1278:        const activeTab = getOutputWorkspaceTab(session);
1284:                response.outputType,
1291:        let outputType = asString(response.outputType || "").toLowerCase();
1292:        if (!outputType || outputType === "chat") {
1293:                outputType = activeTab === "task"
1304:        const looksContentLike = /\b(content|caption|captions|post|posts|email|blog|article|copy|headline|landing page|script|message|cta|product copy|social post)\b/.test(text);
1306:        const looksPublishingLike = /\b(publish|publishing|schedule|channel package|channel payload|approval-ready post|final post|ready to publish|publishing package)\b/.test(text);
1311:        if (outputType === "handoff" || outputType === "task" || looksTaskLike) {
1312:                outputType = "task";
1313:                return { outputType, destinationRoute: "task-center" };
1316:        if (outputType === "workflow" || looksWorkflowLike) {
1317:                outputType = "workflow";
1318:                return { outputType, destinationRoute: explicitDestination || "workflows" };
1321:        if (/content|copy|draft|caption|email|blog|article|script/.test(outputType) || looksContentLike) {
1322:                outputType = "content";
1323:                return { outputType, destinationRoute: explicitDestination || "content-studio" };
1326:        if (/media|video|visual|asset|creative/.test(outputType) || looksMediaLike) {
1327:                outputType = "media";
1328:                return { outputType, destinationRoute: explicitDestination || "media-studio" };
1331:        if (/publishing|publish|schedule/.test(outputType) || looksPublishingLike) {
1332:                outputType = "publishing";
1333:                return { outputType, destinationRoute: explicitDestination || "publishing" };
1336:        if (/governance|compliance|risk|approval/.test(outputType) || looksGovernanceLike) {
1337:                outputType = "governance";
1338:                return { outputType, destinationRoute: explicitDestination || "governance" };
1341:        if (/insight|research|seo|analytics/.test(outputType) || looksInsightLike) {
1342:                outputType = "insight";
1343:                return { outputType, destinationRoute: explicitDestination || "insights" };
1346:        if (/campaign|strategy|launch/.test(outputType) || looksCampaignLike) {
1347:                outputType = "campaign";
1349:                        outputType,
1354:        const destinationRoute = explicitDestination || destinationRouteForSpecialist(session?.modeId || "operations", outputType);
1355:        return { outputType, destinationRoute };
1364:		publishing: "Publishing",
1377:function specialistTemplateForOutput({ specialist, outputType, prompt, projectName }) {
1381:	const route = destinationRouteForSpecialist(specialistId, outputType);
1385:		outputType,
1386:		title: "Draft output",
1391:		confirmationRequired: outputType === "handoff" || specialistId === "publisher" || specialistId === "compliance_reviewer",
1397:		confirmationNote: "Execution, approvals, and publishing require explicit confirmation in the owning workspace."
1401:		if (outputType === "task") {
1430:			title: outputType === "task" ? "Task: Draft campaign copy" : "Content Guidance: Messaging draft",
1434:				"Outcome-led hook direction for a German publishing draft",
1439:				"German caption version should keep the CTA direct and easy to approve."
1447:				"Use Arabic freely in the conversation; publishable copy should be reviewed in German.",
1448:				"Claims, health, or performance promises need evidence before publishing."
1457:			safetyLabel: "Claims require review before publishing. No direct publish action."
1464:			outputType: outputType === "guidance" ? "media_brief" : outputType,
1484:			title: outputType === "task" ? "Task: Video production plan" : "Video Brief: Hook, script, storyboard",
1492:			safetyLabel: "Video generation requires configured provider or GPU worker; no execution started."
1496:	if (specialistId === "publisher") {
1499:			title: outputType === "handoff" ? "Handoff Preview: Publishing package" : "Publishing Draft: Readiness checklist",
1507:				"Draft publish schedule by channel",
1509:				"Prepare handoff for publishing review"
1512:			safetyLabel: "Confirmation required before publish. No publish action performed."
1519:			title: outputType === "task" ? "Task: Paid test plan" : "Ads Draft: Angles and tests",
1547:			title: outputType === "task" ? "Task: Analysis plan" : "Insights Guidance: Signal review",
1577:			title: outputType === "task" ? "Ticket Draft: Customer operations follow-up" : "Customer Ops Draft: Thread, reply, and routing",
1579:			mainOutput: "Review the customer context, confirm missing details, then route the draft through the owning support, sales, or operations surface.",
1601:			safetyLabel: "No reply sent, ticket created, SLA changed, or escalation triggered."
1608:			title: outputType === "handoff" ? "Sales Handoff" : "Sales / CRM Draft: Lead and outreach plan",
1610:			mainOutput: "Use this as a sales planning draft. Confirm CRM context and owner before sending outreach or changing pipeline status.",
1623:				"Can I send more details?",
1628:				"Outreach and follow-ups require confirmation before sending."
1643:		if (outputType === "workflow") {
1659:			title: outputType === "handoff" ? "Handoff Preview: Operations package" : "Operations Draft: Task and handoff plan",
1674:function buildPhase2OutputPreview({ intent, session, prompt, projectName }) {
1686:	const outputType = intentToType[intent] || "guidance";
1688:	const base = specialistTemplateForOutput({
1690:		outputType,
1700:		title: outputType === "workflow" ? "Team Workflow" : `Team ${titleCase(outputType)} Preview`,
1701:		summary: `Full team ${outputType.replace("_", " ")} preview prepared for ${projectName || "current project"}.`,
1713:			"Publisher: package channel-ready copy, assets, schedule notes, and publish checks",
1715:			"Operations: convert the reviewed output into safe tasks, workflow draft, or handoff context"
1717:		destinationRoute: outputType === "task" ? "task-center" : "workflows",
1719:		confirmationNote: "No task, workflow, outreach, customer reply, CRM update, approval, or publishing action is executed from Full Team mode.",
1720:		safetyLabel: "Full Team output is a coordinated draft preview only."
1724:function formatOutputTypeLabel(outputType) {
1732:	return labels[outputType] || titleCase(outputType || "guidance");
1735:function buildPreviewText(output, specialistLabel) {
1736:	if (!output) return "";
1738:		`Output Type: ${formatOutputTypeLabel(output.outputType)}`,
1740:		`Status: ${humanizeValue(output.status, "draft_preview")}`,
1741:		`Title: ${humanizeValue(output.title)}`,
1742:		`Summary: ${humanizeValue(output.summary)}`,
1744:		`Source Prompt: ${humanizeValue(output.sourcePrompt)}`,
1748:	normalizeDisplayList(output.bullets, 12).forEach((item) => lines.push(`- ${item}`));
1749:	normalizeDisplayList(output.steps, 12).forEach((item, idx) => lines.push(`${idx + 1}. ${item}`));
1752:	lines.push(`Destination: ${routeLabel(output.destinationRoute)}`);
1753:	lines.push(`Safety: ${humanizeValue(output.safetyLabel)}`);
1754:	lines.push(`Confirmation: ${output.confirmationRequired ? "Required before execution" : "Required for execution actions"}`);
1793:                preview.mainOutput ||
1794:                preview.output ||
1795:                preview.generatedOutput ||
1808:                blocks.push({ label: "Main output", items: mainLines });
1922:		approvedAssets: assetCategories
1924:			.flatMap((item) => asArray(item.approved_assets).map((assetId) => ({
1963:		writer: ["content", "post", "caption", "blog", "script", "email", "landing page section", "reel script", "copy", "write", "hooks"],
1969:		operations: ["task plan", "workflow", "handoff", "approval", "timeline", "execution plan", "route", "publish", "status", "priority", "priorities", "blocking", "blocker", "readiness", "next", "do next"],
1986:	const actionRouting = /launch|build|reconnect|connect|improve|create|fix|route|plan|publish/.test(query);
2014:		notes.push("Sync social feeds to learn from real post performance.");
2048:			routeSuggestion("Setup", "setup", "Close missing project basics, goals, and audience inputs."),
2065:			: "Not enough post-level data yet to rank content winners.",
2067:			top ? `Top performer: ${extractTopMessage(top)} with ${formatCompactNumber(top.engagement ?? top.reach)} signal.` : "No top post measured yet.",
2073:			top ? `Reuse the pattern from ${extractTopMessage(top)} in the next publishing cycle.` : "Sync social insights to identify winning hooks and formats.",
2079:			weak ? `Move ${extractTopMessage(weak)} into a rewrite workflow.` : "Audit current content for posts not converting attention to clicks.",
2080:			"Prepare next batch with performance-led hooks instead of generic posting volume."
2083:			routeSuggestion("Content Studio", "content-studio", "Rewrite weak posts and turn winning patterns into new drafts."),
2084:			routeSuggestion("Publishing", "publishing", "Schedule the next batch with stronger timing and approval control."),
2197:		return { title: "Campaign launch task block", owner: "Campaign Studio", steps: ["Define the campaign objective, audience, and offer.", "Choose channels and budget based on current intelligence.", "List required assets and publishing dependencies before launch."] };
2200:		return { title: "Content plan task block", owner: "Content Studio", steps: ["Use the strongest content pattern as the starting template.", "Map posts by platform, hook, format, and CTA.", "Route approved items into Publishing for scheduling."] };
2202:	if (/weak post|improve content/.test(query)) {
2203:		return { title: "Content repair task block", owner: "Content Studio", steps: ["Select the weakest items from Insights.", "Rewrite hooks, sharpen CTAs, and adjust format-platform fit.", "Republish only after updated versions are approved."] };
2208:	return { title: "Execution task block", owner: "Workflows", steps: ["Confirm the goal and required output.", "Identify which workspace owns the work.", "Move into the correct page and review the first step in the owning workspace."] };
2216:	if (/content|post/.test(query)) {
2217:		routeSuggestions.push(routeSuggestion("Content Studio", "content-studio", "Draft, rewrite, or prepare the requested content outputs."));
2218:		routeSuggestions.push(routeSuggestion("Publishing", "publishing", "Schedule or approve if the next step is publishing."));
2272:	fetchProjectInsights,
2273:	fetchProjectLearning,
2297:					fetchProjectInsights(projectName),
2298:					fetchProjectLearning(projectName)
2333:	setSharedAiDraft(projectName, {
2347:	publishing: "Publishing",
2369:	publishing: "publisher",
2403:	publish: "publishing",
2404:	publisher: "publishing",
2497:function normalizeAiInboundOutputPreview(rawPreview, normalized) {
2500:	const outputType = asString(preview.outputType || preview.output_type || preview.type || "handoff").trim() || "handoff";
2512:		outputType,
2521:		confirmationNote: firstAiInboundText(preview.confirmationNote, preview.confirmation_note, "Execution, approvals, publishing, CRM updates, customer replies, and workflow runs require explicit confirmation in the owning workspace."),
2542:	const stablePayloadId = firstAiInboundId(payload.handoff_id, payload.handoffId, payload.id, handoff?.created_at, handoff?.createdAt);
2591:	)) || `Review this ${sourceLabel} handoff for ${projectLabel}. Identify the right specialist, summarize the context, produce a review-ready draft, and recommend the next safe route. Do not execute publishing, task creation, CRM updates, customer replies, workflow runs, or backend actions.`;
2609:	const rawOutputPreview = firstAiInboundObject(
2610:		draftContext.outputPreview,
2611:		draftContext.output_preview,
2612:		draftContext.phase2_output_preview,
2613:		payload.outputPreview,
2614:		payload.output_preview
2624:		outputPreview: null,
2631:		note: "Guidance only. No publishing, task creation, CRM updates, customer replies, workflow runs, exports, or backend actions are executed from this handoff."
2633:	normalized.outputPreview = normalizeAiInboundOutputPreview(rawOutputPreview, normalized);
2657:	if (normalized.outputPreview) {
2658:		session.outputPreview = normalized.outputPreview;
2659:		session.outputWorkspaceTab = outputTabFromPreview(normalized.outputPreview);
2660:		session.activeOutputTab = session.outputWorkspaceTab;
2661:		saveLocalOutput(projectName, {
2662:			preview: session.outputPreview,
2669:	setSharedAiDraft(projectName, {
2682:	persistSessionDraft(projectName, session, `Inbound handoff loaded from ${normalized.sourceLabel}`);
2720:				approved_assets: aiContext.approvedAssets,
2732:		const failureReason = asString(payload?.error) || asString(payloadResponse?.error) || asString(error?.message) || "AI provider failed to return output.";
2747:	const createdAt = nowIso();
2755:		createdAt,
2763:		createdAt: asString(result?.command?.created_at) || nowIso(),
2772:		createdAt,
2935:					id="ctrlComposerInput"
2970:					<button id="ctrlSendBtn" class="ctrl-send-btn" type="button">Send prompt to ${escapeHtml(mode.label)}</button>
2974:				<div class="ctrl-composer-hint">Ctrl / Cmd + Enter to send · Suggested prompts prefill only · Draft stays local until you send to execute</div>
2990:				<span style="font-size:11px;color:var(--color-text-2);">Prefill only — send prompt for preview</span>
3037:		return `<div class="ctrl-response-card"><p style="color:var(--color-text-2);font-size:13px;">No output returned.</p></div>`;
3127:						<div class="ctrl-msg-meta">${escapeHtml(formatTime(message.createdAt))}</div>
3136:					<div class="ctrl-msg-ai-agent">${escapeHtml(mode.label)} · ${escapeHtml(formatTime(message.createdAt))}</div>
3185:										<div class="ctrl-recent-result">${escapeHtml(entry.responseTitle || mode.label + " · " + formatTime(entry.createdAt))}</div>
3188:										<span class="ctrl-recent-time">${escapeHtml(formatTime(entry.createdAt))}</span>
3196:					<div class="ctrl-empty-box">Commands you send appear here. Click any to restore and re-run.</div>
3213:		.filter((msg) => msg.role === "assistant" && asString(msg.response?.outputType || msg.response?.output_type))
3216:			type: titleCase(asString(msg.response?.outputType || msg.response?.output_type)),
3219:			time: formatTime(msg.createdAt)
3335:function buildConversationWorkPrompt(session, outputType, fallbackPrompt = "") {
3342:        }[outputType] || "work draft";
3358:        const preview = buildPhase2OutputPreview({
3369:        // Keep raw conversation context available internally, but do not show it as the main output.
3373:                preview.mainOutput = context.assistantText;
3379:        session.outputPreview = preview;
3380:        session.outputWorkspaceTab = outputTabFromIntent(intent);
3381:        session.activeOutputTab = session.outputWorkspaceTab;
3416:			reason: `${aiContext.assetBlockers.length} asset category blocker${aiContext.assetBlockers.length === 1 ? "" : "s"} may reduce content throughput and campaign delivery speed.`,
3425:			title: "Repair integration coverage for stronger AI output",
3435:			reason: "A clear campaign context helps every specialist agent generate more precise outputs.",
3443:		reason: "Core readiness is stable enough to move into output generation and optimization.",
3457:  const normalize = (input) =>
3458:    String(input || "")
3503:	const preview = asObject(session.outputPreview);
3505:	if (preview.outputType === "workflow") return 2;
3506:	if (preview.outputType === "handoff") return 3;
3507:	if (preview.outputType === "task") return 1;
3508:	if (preview.outputType) return 2;
3514:function outputTabFromIntent(intent) {
3526:function outputTabFromPreview(preview) {
3527:	const outputType = asString(preview?.outputType || "");
3528:	if (outputType === "task") return "task";
3529:	if (outputType === "workflow") return "workflow";
3530:	if (outputType === "handoff") return "handoff";
3534:function getOutputWorkspaceTab(session) {
3535:	const requested = asString(session.outputWorkspaceTab || "");
3537:	return outputTabFromPreview(asObject(session.outputPreview));
3540:function getToolOutputTypeLabel(tool) {
3549:	const firstOutput = asArray(tool.outputTypes)[0];
3550:	return firstOutput ? titleCase(asString(firstOutput).replace(/[_-]+/g, " ")) : "Draft";
3556:	const outputType = tool.intent === "media" ? "guidance" : asString(tool.intent || "guidance");
3557:	return destinationRouteForSpecialist(session?.modeId || "operations", outputType);
3581:	return "Prepare a review-ready output for the selected specialist lane.";
3646:					<strong>${escapeHtml(languagePlan.publishLanguage)}</strong>
3683:			<span>Full Team prepares a coordinated, review-ready plan. It does <b>not</b> execute workflows or publish anything.</span>
3797:        if (roleId === "publisher") return `${label} is preparing publishing guidance...`;
3809:		? "Team orchestration across strategy, writing, media/video, compliance, publishing, customer operations, sales/CRM, and operations"
3834:	const outputs = asArray(tool.outputTypes).join(" ");
3835:	const haystack = `${id} ${outputs} ${asString(tool.label)}`.toLowerCase();
3877:		{ id: "preview", label: "Preview", hint: "Draft output" },
3880:		{ id: "history", label: "History", hint: "Saved outputs" }
3911:					<span class="aicmd-v2-tools-subtitle">Fast specialist actions for the current output. Review-only: prepares drafts, previews, or handoffs without backend execution.</span>
3917:					const outputLabel = getToolOutputTypeLabel(tool);
3927:							data-output-type="${escapeHtml(outputLabel.toLowerCase())}"
3935:								<span>Output: ${escapeHtml(outputLabel)}</span>
3952:			<span class="aicmd-v2-lang-chip" title="Input language">🎤 ${escapeHtml(languagePlan.conversationLanguage)}</span>
3953:			<span class="aicmd-v2-lang-chip" title="Publishing language">📝 ${escapeHtml(languagePlan.publishLanguage)}</span>
3963:		{ label: "Voice input", value: "Coming", className: "is-planned" },
4003:				<div class="aicmd-chatgpt-input-shell">
4005:						id="aicmdV2Input"
4014:							<button id="aicmdV2VoiceBtn" class="aicmd-chatgpt-icon-btn" type="button" disabled title="Voice input coming soon">🎙</button>
4017:							<span class="aicmd-chatgpt-enter-hint">Enter to send · Shift+Enter newline</span>
4018:							<button id="aicmdV2AskBtn" class="aicmd-chatgpt-send-btn" type="button" ${isGenerating ? "disabled" : ""} title="Send message">
4036:	const preview = asObject(session.outputPreview);
4037:	const hasPreview = Boolean(preview.outputType && preview.title);
4050:					<span>Ask a specialist or send the chat response to preview.</span>
4057:	const destination = routeLabel(preview.destinationRoute || destinationRouteForSpecialist(session.modeId, preview.outputType || "guidance"));
4061:	const outputLabel = hasPreview ? formatOutputTypeLabel(preview.outputType) : titleCase(activeTab);
4069:		: "Waiting for output";
4076:					<p class="aicmd-v2-preview-subtitle">${escapeHtml(humanizeValue(preview.sourcePrompt, "Review the generated specialist output."))}</p>
4082:				<span class="aicmd-v2-preview-chip"><strong>Type:</strong> ${escapeHtml(formatOutputTypeLabel(preview.outputType))}</span>
4089:				<p class="aicmd-v2-preview-what-heading">Prepared output</p>
4090:				<h4 class="aicmd-v2-preview-output-title">${escapeHtml(humanizeValue(preview.title, "Draft output"))}</h4>
4098:					<div class="aicmd-v2-preview-structured-grid aicmd-room-output-blocks">
4134:function renderAiRoomOutputWorkspace(session, aiContext, escapeHtml) {
4135:	const preview = asObject(session.outputPreview);
4136:	const hasPreview = Boolean(preview.outputType && preview.title);
4137:	const activeTab = getOutputWorkspaceTab(session);
4140:	const destination = routeLabel(preview.destinationRoute || destinationRouteForSpecialist(session.modeId, preview.outputType || "guidance"));
4144:	const outputLabel = hasPreview ? formatOutputTypeLabel(preview.outputType) : titleCase(activeTab);
4152:		: "Waiting for output";
4155:		<section class="aicmd-room-output-workspace">
4156:			<div class="aicmd-room-output-head">
4158:					<span class="aicmd-room-kicker">Output Workspace</span>
4162:				<span class="aicmd-room-output-state">${escapeHtml(confirmationLabel)}</span>
4166:							<div class="aicmd-room-output-tabs mhos-workflow-chain" role="tablist" aria-label="Output workspace tabs">
4170:										class="aicmd-room-output-tab mhos-workflow-step${activeTab === tab.id ? " mhos-workflow-active is-active" : ""}"
4171:										data-aicmdv2-output-tab="${escapeHtml(tab.id)}"
4181:                                <div class="aicmd-room-output-meta">
4183:                                        <span><strong>Language</strong>${escapeHtml(languagePlan.publishLanguage)}</span>
4190:				<div class="aicmd-room-output-body">
4191:					<div class="aicmd-room-output-title-row">
4192:						<span>${escapeHtml(outputLabel)}</span>
4195:					<h3>${escapeHtml(!humanizeValue(preview.title, "") || humanizeValue(preview.title, "").toLowerCase() === "chat reply" ? `${outputLabel} result` : humanizeValue(preview.title, "Draft output"))}</h3>
4196:					<p class="aicmd-room-output-summary">${escapeHtml(structuredPreview.compactSummary || humanizeValue(preview.summary, "Guidance preview prepared."))}</p>
4201:						<div class="aicmd-v2-preview-structured-grid aicmd-room-output-blocks">
4213:					<div class="aicmd-room-output-next">
4217:					<div class="aicmd-room-output-confirmation">
4223:				<div class="aicmd-room-output-empty">
4225:                                        <span>Choose Draft, Task Preview, Workflow Preview, or Handoff Preview, then create a review-ready preview from the conversation.</span>
4230:                                <div class="aicmd-room-output-actions">
4236:                                <div class="aicmd-room-planned-note">This is a review-ready preview. Execution, publishing, approvals, CRM updates, external sends, durable task creation, and workflow runs happen only in the owning destination workspace after confirmation.</div>
4245:	const preview = asObject(session.outputPreview);
4247:	const approval = preview.confirmationRequired ? "Confirmation required" : (preview.outputType ? "Review ready" : "No draft yet");
4280:				<li><span>Native GPU video rendering</span><strong class="is-planned">Requires connected GPU worker</strong></li>
4283:				<li><span>Voice input (microphone)</span><strong class="is-planned">Planned — SpeechRecognition not enabled</strong></li>
4326:                ? "Chat only. No workflow run, durable task, external handoff action, approval, publishing action, CRM update, or customer action was created."
4358:                const createdAt = asString(message.createdAt || "");
4365:                                                ${createdAt ? `<span>${escapeHtml(formatTime(createdAt))}</span>` : ""}
4380:                                createdAt: item.generatedAt || ""
4387:                                createdAt: item.generatedAt || ""
4459:                                <article class="aicmd-v2-chat-card aicmd-room-response-card is-selected-output" data-role="${escapeHtml(selectedRoleId)}">
4464:                                                <span class="aicmd-room-producer-chip">Selected specialist output</span>
4512:				<span class="aicmd-v2-prompts-hint">Click to prefill the composer — send when ready</span>
4536:	const destination = routeLabel(destinationRouteForSpecialist(session.modeId, asObject(session.outputPreview).outputType || "guidance"));
4537:	const sessionState = session.responseLoading ? "Generating" : (session.outputPreview ? "Preview ready" : (asString(session.draftMessage).trim() ? "Drafting" : "Ready"));
4543:		{ label: "Publishing language", value: languagePlan.publishLanguage, present: true },
4549:		{ label: "Approved assets", value: aiContext.approvedAssets.length ? `${aiContext.approvedAssets.length} ready` : "No approved assets", present: aiContext.approvedAssets.length > 0 },
4619:	const preview = asObject(session.outputPreview);
4627:		...(preview.outputType ? [{
4646:							<strong>${escapeHtml(humanizeValue(item.title, "AI output"))}</strong>
4678:			navigateTo,
4682:			fetchProjectInsights,
4683:			fetchProjectLearning,
4695:           const savedOutput = asObject(loadLocalOutput(sessionKey));
4696:           if (asArray(savedOutput.messages).length && !asArray(session.messages).length) {
4697:                   session.messages = asArray(savedOutput.messages).slice(-40);
4699:		if (!session.outputPreview) {
4700:			const preview = asObject(savedOutput.preview);
4701:			if (preview.outputType) {
4702:				session.outputPreview = preview;
4703:				session.outputWorkspaceTab = outputTabFromPreview(preview);
4707:			session.responseHistory = asArray(savedOutput.responses).slice(0, 12);
4712:		// Consume prompt set by home.js handleAiRoleClick via quickCommandInput.
4713:		// Once consumed we clear the global input so re-renders are idempotent.
4714:		const globalInput = $("quickCommandInput");
4715:		const bridgeValue = asString(globalInput?.value || "").trim();
4731:			persistSessionDraft(sessionKey, session, detectedSpecialist ? "Specialist context loaded from Home" : "AI prompt loaded from workspace");
4732:			if (globalInput) globalInput.value = "";
4745:		const bridgeStatus = getAiResponseBridgeStatus(executeProjectAiChat);
4757:		// Final Room v1 renders the conversation, composer, output workspace, and tools directly.
4776:					<aside class="aicmd-room-output">
4777:						${renderAiRoomOutputWorkspace(session, aiContext, escapeHtml)}
4786:		const input = $("aicmdV2Input");
4794:			const value = asString(input?.value || session.draftMessage || fallbackPrompt || "").trim();
4797:				input?.focus?.();
4808:			session.outputPreview = buildPhase2OutputPreview({
4817:			session.outputWorkspaceTab = outputTabFromIntent(intent);
4818:			persistSessionDraft(sessionKey, session, "Draft saved locally");
4820:			return session.outputPreview;
4835:		                saveLocalOutput(sessionKey, {
4836:		                        preview: session.outputPreview,
4843:		                persistSessionDraft(sessionKey, session, `Loaded chat: ${loaded.title || "AI Team session"}`);
4851:		        newSessionBtn.onclick = () => {
4860:		                session.outputPreview = null;
4866:		                session.outputWorkspaceTab = "draft";
4871:		                saveLocalOutput(sessionKey, {
4879:		                persistSessionDraft(sessionKey, session, "New session started");
4887:			settingsBtn.onclick = () => {
4889:				navigateTo("settings");
4896:		Array.from(document.querySelectorAll("[data-aicmdv2-output-tab]")).forEach((btn) => {
4897:			btn.onclick = () => {
4898:				const nextTab = asString(btn.getAttribute("data-aicmdv2-output-tab") || "draft").trim();
4900:				session.outputWorkspaceTab = nextTab;
4901:				persistSessionDraft(sessionKey, session, `Output view: ${titleCase(nextTab)}`);
4908:                        btn.onclick = () => {
4926:                                persistSessionDraft(sessionKey, session, `${spec?.label || "Specialist"} selected`);
4933:			btn.onclick = () => {
4937:				persistSessionDraft(sessionKey, session, mode === "team" ? "Full Team mode activated" : "Solo Specialist mode activated");
4944:			btn.onclick = () => {
4948:				if (input) input.value = text;
4949:				persistSessionDraft(sessionKey, session, "Suggested prompt loaded — review and send when ready");
4951:				input?.focus?.();
4956:			btn.onclick = () => {
4960:				if (input) input.value = text;
4961:				persistSessionDraft(sessionKey, session, "Quick action loaded");
4963:				input?.focus?.();
4970:                        input,
4974:                        persistSessionDraft,
4980:		if (input) {
4981:			input.oninput = () => {
4982:				session.draftMessage = input.value || "";
4984:				persistSessionDraft(sessionKey, session, "Draft auto-saved locally");
4987:			input.onkeydown = (event) => {
4996:			        const sendBtn = $("aicmdV2AskBtn");
4997:			        if (sendBtn && !sendBtn.disabled) {
4998:			                sendBtn.click?.();
5005:			voiceBtn.onclick = () => {
5010:					updateStatus("Voice input trigger is ready. Browser speech recognition is not available in this environment yet.");
5011:					showMessage?.("Voice input readiness is staged for compatible browsers.");
5023:						setAiComposerValue(session, input, transcript);
5024:						if (input) {
5025:							input.value = transcript;
5026:							input.focus();
5028:						persistSessionDraft(sessionKey, session, "Voice input captured");
5029:						updateStatus("Voice input captured in composer.");
5032:						updateStatus("Voice input could not start. Microphone permission may be blocked.");
5035:					updateStatus("Listening for Arabic voice input.");
5037:					updateStatus("Voice input could not start in this browser.");
5045:		        askBtn.onclick = async () => {
5046:		                const value = asString(input?.value || session.draftMessage || "").trim();
5049:		                        input?.focus?.();
5076:		                        createdAt: nowIso(),
5086:		                saveLocalOutput(sessionKey, {
5087:		                        preview: session.outputPreview,
5098:		                        const result = await executeProjectAiChat(projectName, {
5107:		                                outputLanguage: languagePlan.publishLanguage,
5109:		                                marketLanguage: languagePlan.publishLanguage,
5116:		                                safetyInstruction: "Chat only. No task/workflow/handoff/approval/publish/customer/CRM execution.",
5142:		                                createdAt: asString(result?.timestamp) || nowIso(),
5149:		                                        outputType: "chat",
5159:                                        const responseRoute = resolveAiResponseOutputRoute(session, {
5164:                                                outputType: response.outputType,
5172:		                                generatedAt: assistantChatMessage.createdAt,
5181:		                                outputType: responseRoute.outputType,
5190:		                        saveLocalOutput(sessionKey, {
5191:		                                preview: session.outputPreview,
5201:		                        updateStatus("Specialist reply generated. No workflow/task/handoff was created.");
5207:		                        saveLocalOutput(sessionKey, {
5208:		                                preview: session.outputPreview,
5225:                        prepareBtn.onclick = () => {
5226:                                const fallback = asString(input?.value || session.draftMessage || "").trim();
5234:                                persistSessionDraft(sessionKey, session, "Guidance preview prepared from conversation");
5246:                        draftTaskBtn.onclick = () => {
5247:                                const value = asString(input?.value || session.draftMessage || "").trim();
5259:                                persistSessionDraft(sessionKey, session, "Task preview prepared from conversation");
5269:                        draftWorkflowBtn.onclick = () => {
5270:                                const value = asString(input?.value || session.draftMessage || "").trim();
5282:                                persistSessionDraft(sessionKey, session, "Workflow preview prepared from conversation");
5293:                        handoffBtn.onclick = () => {
5294:                                const value = asString(input?.value || session.draftMessage || "").trim();
5306:                                persistSessionDraft(sessionKey, session, "Handoff preview prepared from conversation");
5307:                                updateStatus("Handoff preview prepared from conversation context. Review destination before sending.");
5314:			btn.onclick = () => {
5332:					outputTypes: asArray(tool.outputTypes).length ? tool.outputTypes : [asString(tool.intent || tool.id || "draft").replace(/[^a-z0-9_]+/g, "_")]
5339:					input,
5342:					persistSessionDraft,
5356:			saveBtn.onclick = () => {
5357:				session.draftMessage = asString(input?.value || session.draftMessage || "");
5358:				persistSessionDraft(sessionKey, session, "Draft saved locally");
5367:			clearBtn.onclick = () => {
5373:				if (input) input.value = "";
5374:				persistSessionDraft(sessionKey, session, "Draft cleared");
5385:		        responseContinueBtn.onclick = () => {
5386:		                input?.focus?.();
5393:			responseCopyBtn.onclick = async () => {
5411:			responseUseBtn.onclick = () => {
5413:				setAiComposerValue(session, input, latestResponse.responseText);
5414:				if (input) {
5415:					input.focus();
5417:				persistSessionDraft(sessionKey, session, "Generated response inserted into composer");
5424:			responseSaveBtn.onclick = () => {
5426:				const saved = saveLocalOutput(sessionKey, {
5427:					preview: session.outputPreview,
5439:		        responseConvertBtn.onclick = () => {
5440:		                const fallback = latestResponse?.prompt || asString(input?.value || session.draftMessage || "");
5454:		                saveLocalOutput(sessionKey, {
5455:		                        preview: session.outputPreview,
5470:			responseSendBtn.onclick = () => {
5472:				const responseRoute = resolveAiResponseOutputRoute(session, latestResponse);
5473:				const destination = asString(latestResponse.destinationRoute || responseRoute.destinationRoute || destinationRouteForSpecialist(session.modeId, responseRoute.outputType || "guidance"));
5482:				setSharedAiDraft(projectName || "__default__", draftContext);
5483:				setSharedHandoff(projectName || "__default__", destination, {
5488:					created_at: nowIso(),
5492:						output: latestResponse.responseRaw || {
5499:				navigateTo(destination);
5505:			responseReadBtn.onclick = () => {
5521:			previewCopyBtn.onclick = async () => {
5522:				const output = asObject(session.outputPreview);
5523:				if (!output.outputType) return;
5526:					: getPhase1SpecialistById(output.specialistId || session.modeId).label;
5527:				const text = buildPreviewText(output, specialistLabel);
5545:			previewUseBtn.onclick = () => {
5546:				const output = asObject(session.outputPreview);
5547:				if (!output.outputType) return;
5550:					: getPhase1SpecialistById(output.specialistId || session.modeId).label;
5551:				const text = buildPreviewText(output, specialistLabel);
5553:				if (input) {
5554:					input.value = text;
5555:					input.focus();
5557:				persistSessionDraft(sessionKey, session, "Preview inserted into composer");
5564:			previewSendBtn.onclick = () => {
5565:				const output = asObject(session.outputPreview);
5566:				const destination = asString(output.destinationRoute || "").trim();
5577:					created_at: nowIso(),
5579:						prompt: output.sourcePrompt,
5582:							modeId: output.specialistId || session.modeId,
5583:							lastCommand: output.sourcePrompt || "",
5584:							lastResponseTitle: output.title || "",
5586:							phase2_output_preview: output
5591:				setSharedAiDraft(projectName || "__default__", handoffRecord.payload.draft_context);
5592:				setSharedHandoff(projectName || "__default__", destination, handoffRecord);
5594:				navigateTo(destination);
5600:			previewSaveBtn.onclick = () => {
5601:				const output = asObject(session.outputPreview);
5602:				if (!output.outputType) return;
5603:				const saved = saveLocalOutput(sessionKey, {
5604:					preview: output,
5615:			previewReadBtn.onclick = () => {
5616:				const output = asObject(session.outputPreview);
5617:				if (!output.outputType) return;
5622:				const previewText = [humanizeValue(output.title), humanizeValue(output.summary)]
5634:			previewClearBtn.onclick = () => {
5635:				session.outputPreview = null;
5648:				fetchProjectInsights,
5649:				fetchProjectLearning,

## Handler source range
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
				updateStatus("Please write your request in the composer first.");
				input?.focus?.();
				return null;
			}

			session.draftMessage = value;
			session.composerText = session.draftMessage;
			session.modeId = normalizedSessionModeId;
			session.teamMode = "solo";
			session.routeSuggestions = [];
			session.inboundHandoff = null;
			session.draftStatus = "New session started";
			session.outputPreview = buildPhase2OutputPreview({
				intent,
				session,
				prompt: value,
				projectName
			});
			if (PHASE35_WORKSPACE_TABS.includes(options.switchTab)) {
				session.workspaceTab = options.switchTab;
			}
			session.outputWorkspaceTab = outputTabFromIntent(intent);
			persistSessionDraft(sessionKey, session, "Draft saved locally");
			aiCommandRoute.render(context);
			return session.outputPreview;
		};

		const sessionSelect = $("aicmdV2SessionSelect");
		if (sessionSelect) {
		        sessionSelect.onchange = () => {
		                const selectedSessionId = asString(sessionSelect.value || "");
		                if (!selectedSessionId) return;

		                const loaded = loadAiChatSessionIntoState(sessionKey, session, selectedSessionId);
		                if (!loaded) {
		                        updateStatus("Selected chat session could not be loaded.");
		                        return;
		                }

		                saveLocalOutput(sessionKey, {
		                        preview: session.outputPreview,
		                        messages: session.messages,
		                        responses: session.responseHistory,
		                        modeId: session.modeId,
		                        teamMode: session.teamMode
		                });

		                persistSessionDraft(sessionKey, session, `Loaded chat: ${loaded.title || "AI Team session"}`);
		                showMessage?.("AI chat session loaded.");
		                aiCommandRoute.render(context);
		        };
		}

		const newSessionBtn = $("aicmdV2NewSessionBtn");
		if (newSessionBtn) {
		        newSessionBtn.onclick = () => {
		                saveAiChatSession(sessionKey, session, { title: "Previous AI Team session" });

		                session.draftMessage = "";
		                session.composerText = "";
		                session.routeSuggestions = [];
		                session.inboundHandoff = null;
		                session.bridgeContext = null;
		                session.draftStatus = "New session started";
		                session.outputPreview = null;
		                session.responseHistory = [];
		                session.messages = [];
		                session.responseError = "";
		                session.responseLoading = false;
		                session.workspaceTab = bridgeStatus.available ? "chat" : "preview";
		                session.outputWorkspaceTab = "draft";
		                session.activeChatSessionId = "";
		                session.activeChatSessionCreatedAt = "";
		                refreshAiChatSessions(sessionKey, session);

		                saveLocalOutput(sessionKey, {
		                        preview: null,
		                        messages: [],
		                        responses: [],
		                        modeId: session.modeId,
		                        teamMode: session.teamMode
		                });

		                persistSessionDraft(sessionKey, session, "New session started");
		                showMessage?.("New AI session started. Previous chat saved to Recent chats.");
		                aiCommandRoute.render(context);
		        };
		}

		const settingsBtn = $("aicmdV2SettingsBtn");
		if (settingsBtn) {
			settingsBtn.onclick = () => {
				showMessage?.("Opening Settings.");
				navigateTo("settings");
			};
		}

		// Legacy workspace tab handler removed from Final Room v1 shell.


		Array.from(document.querySelectorAll("[data-aicmdv2-output-tab]")).forEach((btn) => {
			btn.onclick = () => {
				const nextTab = asString(btn.getAttribute("data-aicmdv2-output-tab") || "draft").trim();
				if (!AI_ROOM_OUTPUT_TABS.some((tab) => tab.id === nextTab)) return;
				session.outputWorkspaceTab = nextTab;
				persistSessionDraft(sessionKey, session, `Output view: ${titleCase(nextTab)}`);
				aiCommandRoute.render(context);
			};
		});

		// ── TEAM RAIL: SPECIALIST SELECTION ─────────────────────────
		Array.from(document.querySelectorAll("[data-aicmdv2-specialist]")).forEach((btn) => {
                        btn.onclick = () => {
                                const specId = btn.getAttribute("data-aicmdv2-specialist") || "operations";
                                const previousBridgeContext = asObject(session.bridgeContext);
                                const existingDraft = asString(session.draftMessage).trim();
                                const shouldReplaceRoleDraft = Boolean(previousBridgeContext.source) ||
                                        /^Act as the\s+/i.test(existingDraft);

                                session.modeId = specId;
                                session.teamMode = "solo";
                                session.bridgeContext = null;

                                const spec = getPhase1SpecialistById(specId);
                                if (shouldReplaceRoleDraft) {
                                        session.draftMessage = `Act as the ${spec?.label || titleCase(specId)} for ${projectName}. Review the project context and suggest the next best actions. Do not execute anything; prepare guidance only.`;
                                } else if (!session.draftMessage) {
                                        session.draftMessage = "";
                                }

                                persistSessionDraft(sessionKey, session, `${spec?.label || "Specialist"} selected`);
                                aiCommandRoute.render(context);
                        };
                });

                // ── SOLO / TEAM TOGGLE ───────────────────────────────────────
                Array.from(document.querySelectorAll("[data-aicmdv2-team-mode]")).forEach((btn) => {
			btn.onclick = () => {
				const mode = btn.getAttribute("data-aicmdv2-team-mode") || "solo";
				session.teamMode = mode;
				session.bridgeContext = null;
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
				const saved = saveLocalOutput(sessionKey, {
					preview: session.outputPreview,
					responses: session.responseHistory,
					modeId: session.modeId,
					teamMode: session.teamMode
				});
				updateStatus(`Response saved locally ${formatTime(saved.updatedAt)}.`);
				showMessage?.("Response saved locally.");
			};
		}

		const responseConvertBtn = $("aicmdV3ResponseConvertBtn");
		if (responseConvertBtn) {
		        responseConvertBtn.onclick = () => {
		                const fallback = latestResponse?.prompt || asString(input?.value || session.draftMessage || "");
		                const preview = setPreviewFromConversation({
		                        session,
		                        intent: "guidance",
		                        fallbackPrompt: fallback,
		                        projectName
		                });

		                if (latestResponse?.responseText) {
		                        preview.title = latestResponse.responseTitle || preview.title;
		                        preview.summary = latestResponse.responseText;
		                        preview.generatedAt = latestResponse.generatedAt || nowIso();
		                }

		                saveLocalOutput(sessionKey, {
		                        preview: session.outputPreview,
		                        messages: session.messages,
		                        responses: session.responseHistory,
		                        modeId: session.modeId,
		                        teamMode: session.teamMode
		                });

		                updateStatus("Conversation converted into a draft preview.");
		                showMessage?.("Draft preview ready from conversation.");
		                aiCommandRoute.render(context);
		        };
		}

		const responseSendBtn = $("aicmdV3ResponseSendBtn");
		if (responseSendBtn) {
			responseSendBtn.onclick = () => {
				if (!latestResponse) return;
				const responseRoute = resolveAiResponseOutputRoute(session, latestResponse);
				const destination = asString(latestResponse.destinationRoute || responseRoute.destinationRoute || destinationRouteForSpecialist(session.modeId, responseRoute.outputType || "guidance"));
				const draftContext = {
					projectName: projectName || "",
					modeId: latestResponse.specialistId || session.modeId,
					lastCommand: latestResponse.prompt || "",
					lastResponseTitle: latestResponse.responseTitle || "Generated specialist response",
					routeSuggestions: [{ route: destination, label: routeLabel(destination), reason: "Specialist response destination" }],
					phase3_response: latestResponse
				};
				setSharedAiDraft(projectName || "__default__", draftContext);
				setSharedHandoff(projectName || "__default__", destination, {
					id: `aicmd-response-${Date.now()}`,
					source_page: "ai-command",
					destination_page: destination,
					status: "available",
					created_at: nowIso(),
					payload: {
						prompt: latestResponse.prompt,
						draft_context: draftContext,
						output: latestResponse.responseRaw || {
							title: latestResponse.responseTitle,
							summary: latestResponse.responseText
						}
					}
				});
				showMessage?.("Response draft context prepared. Review in the owning workspace before saving or executing there.");
				navigateTo(destination);
			};
		}

		const responseReadBtn = $("aicmdV3ResponseReadBtn");
		if (responseReadBtn) {
			responseReadBtn.onclick = () => {
				if (!latestResponse?.responseText) return;
				if (typeof speechSynthesis === "undefined" || typeof SpeechSynthesisUtterance === "undefined") {
					updateStatus("Read is not supported in this browser.");
					return;
				}
				const utterance = new SpeechSynthesisUtterance(latestResponse.responseText);
				speechSynthesis.cancel();
				speechSynthesis.speak(utterance);
				updateStatus("Reading response locally in browser.");
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
				showMessage?.("Draft context prepared for routing. Review before saving or executing.");
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

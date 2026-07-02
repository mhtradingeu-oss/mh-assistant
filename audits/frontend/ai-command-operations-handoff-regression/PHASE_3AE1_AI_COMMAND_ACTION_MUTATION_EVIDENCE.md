# PHASE 3AE.1 — AI Command Action / Mutation Evidence

## AI Command action verbs and mutation-like handlers
7:import { getProjectedActiveRole, getProjectedTeamMembers } from "../runtime/authority/authority-projection.js";
26:        executeProjectAiChat,
27:        executeProjectAiGuidance
39:                routeHint: "campaign-studio"
46:                routeHint: "content-studio"
53:                routeHint: "media-studio"
60:                routeHint: "media-studio"
63:                id: "publisher",
67:                routeHint: "publishing"
74:                routeHint: "ads-manager"
81:                routeHint: "insights"
88:                routeHint: "governance"
95:                routeHint: "workflows"
101:                summary: "Inbox review, reply drafts, ticket drafts, SLA risk, and escalation routing.",
102:                routeHint: "operations-centers"
108:                summary: "Lead qualification, outreach drafts, follow-up cadence, and CRM handoff notes.",
109:                routeHint: "workflows"
124:	publisher: "publisher",
148:		cannotDo: ["Publish campaigns directly", "Execute workflows automatically", "Approve content", "Set live budgets"],
150:		safetyNote: "All outputs are guidance and draft only. Execution requires explicit confirmation.",
159:		placeholder: "Ask the Content Writer to draft captions, hooks, landing copy, or campaign messages…",
160:		canHelp: ["Draft captions and hooks", "Write email copy", "Create landing page text", "Prepare publisher handoff", "Suggest message variants"],
161:		cannotDo: ["Publish directly", "Approve risky claims", "Invent unsupported facts", "Run workflows automatically"],
163:		safetyNote: "Drafts require review before publishing. Cannot approve or publish without confirmation.",
193:		id: "publisher",
198:		placeholder: "Ask the Publisher to review publishing readiness, check scheduling, or prepare a handoff package…",
199:		canHelp: ["Review publishing readiness", "Check scheduled jobs", "Prepare handoff packages", "Map publishing dependencies", "Flag pre-publish risks"],
202:		safetyNote: "Publishing always requires explicit approval. No live publishing from AI guidance alone.",
211:		placeholder: "Ask the Ads Optimizer to draft ad copy, review targeting angles, or plan a paid campaign structure…",
236:		summary: "Claims review, approval safety, publishing risk, and governance notes.",
237:		placeholder: "Ask the Compliance Reviewer to check claims, approval risks, publishing safety, and governance notes…",
238:		canHelp: ["Review marketing claims", "Flag approval risks", "Check publishing safety", "Prepare governance notes", "Identify compliance blockers"],
239:		cannotDo: ["Grant approvals directly", "Override governance gates", "Publish on behalf of approvers", "Remove flags without review"],
250:		placeholder: "Ask the Operations Lead to turn this into tasks, workflow steps, or handoffs…",
251:		canHelp: ["Create task plans", "Map execution sequences", "Prepare workflow handoffs", "Review execution health", "Identify operational blockers"],
252:		cannotDo: ["Run workflows without confirmation", "Auto-approve tasks", "Override authority gates", "Execute backend operations directly"],
262:		summary: "Inbox review, reply drafts, ticket drafts, SLA risk, customer profile context, and escalation routing.",
263:		placeholder: "Ask the Customer Operations Lead to summarize a customer thread, draft a safe reply, prepare a ticket draft, check SLA risk, or route an escalation for review…",
264:		canHelp: ["Review inbox context", "Summarize customer threads", "Draft safe replies", "Prepare ticket drafts", "Flag SLA and escalation risk"],
267:		safetyNote: "Customer operations outputs are drafts only. Sending replies, ticket creation, and escalations require confirmation in the owning surface.",
275:		summary: "Lead qualification, outreach drafts, follow-up cadence, CRM profile summaries, and sales handoff notes.",
276:		placeholder: "Ask the Sales / CRM Lead to qualify a lead, draft outreach, plan follow-ups, summarize CRM context, or prepare a sales handoff for review…",
280:		safetyNote: "Sales and CRM outputs are guidance and drafts only. CRM mutations and outreach sends require confirmation in the owning surface.",
285:// Role-specific suggested prompt chips (prefill only, no auto-execute)
311:	publisher: [
312:		{ label: "Review publishing readiness", sub: "Check what is ready to publish" },
313:		{ label: "Flag pre-publish risks", sub: "Identify what needs review first" },
315:		{ label: "Prepare a handoff package", sub: "For the approver review" }
331:		{ label: "Flag publishing risks", sub: "Identify blockers before release" },
336:		{ label: "Turn this into tasks", sub: "Break down into action items" },
337:		{ label: "Draft a workflow handoff", sub: "Prepare for the next owner" },
359:	{ label: "Prepare a full handoff sequence", sub: "Strategy, creative, compliance, publishing, ops" },
367:	{ id: "draft", title: "Draft", description: "Generate guidance, copy, task, or handoff material." },
369:	{ id: "route", title: "Route", description: "Send context to the owning workspace." },
370:	{ id: "execute", title: "Execute", description: "Execution stays gated in backend-owned surfaces." },
375:	{ id: "draft", label: "Draft", helper: "Latest draft or guidance preview" },
376:	{ id: "task", label: "Task", helper: "Task-shaped output" },
377:	{ id: "workflow", label: "Draft Workflow", helper: "Operating sequence" },
390:	publisher: "PB",
422:		summary: "Workflow blueprints and trigger maps will route to Workflows before execution."
429:		{ id: "launch-plan", label: "Launch Plan", action: "preview", intent: "workflow", template: "Build a launch plan for {project}. Include phases, channels, owners, blockers, and next move." },
431:		{ id: "prioritize-next-move", label: "Priority Sort", action: "preview", intent: "task", template: "Prioritize the next moves for {project}. Rank by impact, urgency, dependencies, and safest first action." }
436:		{ id: "cta-refiner", label: "CTA Refiner", action: "preview", intent: "task", template: "Refine CTA options for {project}. Provide German variants for awareness, consideration, and action stages." },
437:		{ id: "publisher-package", label: "Publisher Package", action: "preview", intent: "handoff", template: "Prepare a Publisher handoff for {project}. Include German copy package, CTA, notes, and remaining checks." }
442:		{ id: "asset-checklist", label: "Asset Checklist", action: "preview", intent: "task", template: "Create an asset checklist for {project}. List must-have files, missing references, usage context, and priority." },
444:		{ id: "open-media-studio", label: "Send to Media Studio", action: "route", route: "media-studio" }
448:		{ id: "draft-script", label: "Draft script", action: "preview", intent: "guidance", template: "Draft a short-form video script for {project}. Include hook, body, CTA, and visual cues." },
449:		{ id: "build-storyboard", label: "Build storyboard", action: "preview", intent: "workflow", template: "Build storyboard beats for {project}. Sequence shots and key transitions." },
451:		{ id: "map-video-asset-needs", label: "Map video asset needs", action: "preview", intent: "task", template: "Map video asset needs for {project}. Include format, source, and production owner." }
453:	publisher: [
454:		{ id: "publishing-checklist", label: "Publishing Checklist", action: "preview", intent: "handoff", template: "Build a publishing checklist for {project}. Include German copy, assets, claims checks, and channel readiness." },
455:		{ id: "final-packaging", label: "Final Packaging", action: "preview", intent: "handoff", template: "Prepare a final publishing package for {project}. Include copy, CTA, asset notes, approvals, and destination channel." },
456:		{ id: "channel-formatting", label: "Channel Formatting", action: "preview", intent: "guidance", template: "Format the next output for {project} by channel. Include German copy, limits, CTA, and scheduling notes." },
457:		{ id: "schedule-draft", label: "Schedule Draft", action: "preview", intent: "workflow", template: "Prepare a publishing schedule draft for {project}. Include channel cadence, dependencies, and review gates." },
458:		{ id: "open-publishing", label: "Open Publishing", action: "route", route: "publishing" }
463:		{ id: "test-ideas", label: "Test Ideas", action: "preview", intent: "task", template: "Suggest paid test ideas for {project}. Provide hypotheses, segments, creative variables, and measurement notes." },
465:		{ id: "open-ads-manager", label: "Open Ads Manager", action: "route", route: "ads-manager" }
470:		{ id: "opportunity-summary", label: "Opportunity Summary", action: "preview", intent: "task", template: "Summarize SEO and insight opportunities for {project}. Focus on conversion, traffic quality, and content fit." },
471:		{ id: "analysis-plan", label: "Analysis Plan", action: "preview", intent: "workflow", template: "Draft an analysis plan for {project}. Define questions, datasets, cadence, and owners." },
472:		{ id: "open-insights", label: "Open Insights", action: "route", route: "insights" }
476:		{ id: "approval-flags", label: "Approval Flags", action: "preview", intent: "task", template: "Check approval risks for {project}. List risk, impact, mitigation, and required owner." },
478:		{ id: "publish-readiness", label: "Publish Readiness", action: "preview", intent: "handoff", template: "Review publish readiness for {project}. Confirm what needs human approval before release." },
479:		{ id: "open-governance", label: "Open Governance", action: "route", route: "governance" }
482:		{ id: "timeline-draft", label: "Timeline Draft", action: "preview", intent: "workflow", template: "Draft an execution timeline for {project}. Include milestones, owners, dependencies, and review gates." },
484:		{ id: "checklist", label: "Checklist", action: "preview", intent: "task", template: "Draft an operational checklist for {project}. Include owners, dependencies, priority, and first action." },
486:		{ id: "open-workflows", label: "Open Workflows / Operations", action: "route", route: "workflows" }
491:		{ id: "draft-customer-reply", label: "Draft Customer Reply", action: "preview", intent: "guidance", template: "Draft a customer reply for {project}. Keep it helpful, calm, review-ready, and do not claim any operational action has been completed." },
492:		{ id: "create-ticket-draft", label: "Create Ticket Draft", action: "preview", intent: "task", template: "Create a ticket draft for {project}. Include issue, priority, owner suggestion, evidence needed, and next safe action." },
493:		{ id: "check-sla-risk", label: "Check SLA Risk", action: "preview", intent: "guidance", template: "Check SLA risk for {project}. Flag urgency, risk level, missing runtime data, and escalation recommendation for review." },
494:		{ id: "prepare-escalation", label: "Prepare Escalation", action: "preview", intent: "handoff", template: "Prepare an escalation draft for {project}. Include reason, customer impact, owner, confirmation needed, and destination team." },
496:		{ id: "route-support-sales-ops", label: "Route to Support / Sales / Operations", action: "preview", intent: "handoff", template: "Prepare routing guidance for {project}. Decide whether the customer item belongs with Support, Sales, or Operations, and explain the review gate." }
500:		{ id: "outreach-draft", label: "Outreach Draft", action: "preview", intent: "guidance", template: "Draft outreach for {project}. Include subject or opener, personalized message, CTA, and review notes before sending." },
501:		{ id: "follow-up-sequence", label: "Follow-up Sequence", action: "preview", intent: "workflow", template: "Build a follow-up sequence for {project}. Include timing, message angle, CTA, stop condition, and confirmation requirements." },
503:		{ id: "pipeline-next-step", label: "Pipeline Next Step", action: "preview", intent: "task", template: "Recommend the pipeline next step for {project}. Include stage, rationale, owner, risk, and required confirmation." },
505:		{ id: "influencer-lead-plan", label: "Influencer Lead Plan", action: "preview", intent: "workflow", template: "Prepare an influencer lead plan for {project}. Include target profile, outreach angle, qualification criteria, and handoff path." },
506:		{ id: "sales-handoff-draft", label: "Sales Handoff", action: "preview", intent: "handoff", template: "Prepare a sales handoff draft for {project}. Include lead context, recommended next action, owner, and confirmation needed." }
518:const AI_COMMAND_LOCAL_DRAFTS_KEY = "mh-ai-command-local-drafts-v1";
519:const AI_COMMAND_LOCAL_OUTPUTS_KEY = "mh-ai-command-local-outputs-v1";
601:		purpose: "Translate intent into executable workflows and handoffs.",
633:		if (/act as the publisher/i.test(text)) return "publisher";
648:	const command = humanizeValue(commandText || session?.draftMessage, "Prepare workflow action from AI command.");
662:			id: `auto-workflow-${Date.now()}`,
663:			type: "prepare_workflow",
664:			targetPage: "workflows",
665:			action: "Prepare workflow from AI command",
668:				reason: "AI command prepared for workflow execution."
674:	if (/publish\s*now|send\s*external|paid\s*ads|final\s*approval/i.test(command)) {
677:			type: "publish_now",
678:			targetPage: "publishing",
682:				reason: "Requires approval gate before external publishing actions."
697:	if (/act as the publisher/i.test(text)) return "publisher";
785:    "Draft a workflow sequence for:",
786:    "Draft a task plan for:",
822:function setAiComposerValue(session, input, value) {
824:  session.draftMessage = cleanValue;
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
941:			draftMessage: "",
945:			draftStatus: "",
948:			taskMode: "free",
949:			taskType: "launch",
950:			taskProduct: "",
951:			taskChannel: "",
966:			routeSuggestions: [],
969:			outputPreview: null,
970:			activeOutputTab: "draft",
1006:function saveLocalDraft(projectName, draftPayload) {
1011:		...asObject(draftPayload),
1022:		session.draftMessage = asString(localDraft.prompt);
1023:		session.composerText = session.draftMessage;
1030:		session.draftStatus = `Draft restored ${formatTime(localDraft.updatedAt)}`;
1035:function persistSessionDraft(projectName, session, hint) {
1036:	const saved = saveLocalDraft(projectName, {
1037:		prompt: session.draftMessage,
1043:	session.draftStatus = hint || `Saved locally ${formatTime(saved.updatedAt)}`;
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
1118:function saveAiChatSession(projectName, session, options = {}) {
1122:        const hasContent = messages.length || responses.length || asObject(session.outputPreview).title;
1138:                preview: session.outputPreview || null,
1139:                createdAt: asString(options.createdAt || session.activeChatSessionCreatedAt || now),
1148:        session.activeChatSessionCreatedAt = record.createdAt;
1161:        session.outputPreview = asObject(record.preview);
1162:        session.outputWorkspaceTab = outputTabFromPreview(session.outputPreview);
1163:        session.activeOutputTab = session.outputWorkspaceTab;
1164:        session.draftMessage = "";
1169:        session.activeChatSessionCreatedAt = asString(record.createdAt || record.updatedAt || nowIso());
1181:function buildSpecialistChatPrompt({ prompt, specialistLabel, modeLabel, projectName, language, outputLanguage, market }) {
1187:	const safeOutputLanguage = asString(outputLanguage || "German").trim();
1191:			"Full Team workflow: Strategist -> Writer -> Media/Video -> Compliance -> Publisher -> Operations.",
1202:		`Publishable output language: ${safeOutputLanguage}`,
1206:                `Use ${safeOutputLanguage} only for customer-facing or publishable copy such as captions, ads, emails, landing pages, final campaign text, or publishing packages.`,
1207:                "When you include publishable copy, label it clearly as publishable content and keep the explanation in the user chat language.",
1210:		`When drafting publishable copy, write it in ${safeOutputLanguage}.`,
1211:		"Never claim actions were executed.",
1212:		"Never claim publish, approval, deletion, archival, sync, or operational runs happened.",
1258:function destinationRouteForSpecialist(specialistId, outputType) {
1261:	if (outputType === "workflow") return "workflows";
1262:	if (id === "strategist") return outputType === "task" ? "campaign-studio" : "workflows";
1266:	if (id === "publisher") return "publishing";
1270:	if (id === "operations") return outputType === "task" ? "task-center" : "workflows";
1271:	if (id === "customer_ops") return outputType === "task" ? "task-center" : "operations-centers";
1272:	if (id === "sales_crm") return "workflows";
1273:	return "workflows";
1277:function resolveAiResponseOutputRoute(session, response = {}) {
1278:        const activeTab = getOutputWorkspaceTab(session);
1284:                response.outputType,
1291:        let outputType = asString(response.outputType || "").toLowerCase();
1292:        if (!outputType || outputType === "chat") {
1293:                outputType = activeTab === "task"
1294:                        ? "task"
1295:                        : activeTab === "workflow"
1296:                                ? "workflow"
1302:        const looksTaskLike = /\b(task|tasks|handoff|ticket|tickets|follow-up|follow up|owner|owners|assignee|assigned|due date|priority|priorities|backlog|checklist|next task|action item|action items)\b/.test(text);
1303:        const looksWorkflowLike = /\b(workflow|workflows|process|sequence|phase|phases|approval flow|automation|operating loop|step-by-step|steps|dependencies|trigger|review gate|execution flow)\b/.test(text);
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
1350:                        destinationRoute: explicitDestination || (session?.teamMode === "team" ? "workflows" : "campaign-studio")
1354:        const destinationRoute = explicitDestination || destinationRouteForSpecialist(session?.modeId || "operations", outputType);
1355:        return { outputType, destinationRoute };
1359:function routeLabel(route) {
1364:		publishing: "Publishing",
1370:		"task-center": "Task Center",
1372:		workflows: "Workflows"
1374:	return labels[route] || titleCase(route);
1377:function specialistTemplateForOutput({ specialist, outputType, prompt, projectName }) {
1381:	const route = destinationRouteForSpecialist(specialistId, outputType);
1385:		outputType,
1386:		title: "Draft output",
1390:		destinationRoute: route,
1391:		confirmationRequired: outputType === "handoff" || specialistId === "publisher" || specialistId === "compliance_reviewer",
1394:		status: "draft_preview",
1395:		safetyLabel: "Guidance and draft only. No backend execution.",
1396:		nextSafeAction: `Review in ${routeLabel(route)}`,
1397:		confirmationNote: "Execution, approvals, and publishing require explicit confirmation in the owning workspace."
1401:		if (outputType === "task") {
1405:				summary: "Strategic task draft prepared with priorities, blockers, and operating sequence.",
1410:					"Route execution draft to Campaign Studio or Workflows"
1412:				nextSafeAction: "Review and refine the task draft before creating durable tasks"
1422:				"Next operating move drafted with destination routing"
1430:			title: outputType === "task" ? "Task: Draft campaign copy" : "Content Guidance: Messaging draft",
1431:			summary: "Content draft prepared with hooks, captions, CTA flow, and review checkpoint.",
1434:				"Outcome-led hook direction for a German publishing draft",
1439:				"German caption version should keep the CTA direct and easy to approve."
1447:				"Use Arabic freely in the conversation; publishable copy should be reviewed in German.",
1448:				"Claims, health, or performance promises need evidence before publishing."
1457:			safetyLabel: "Claims require review before publishing. No direct publish action."
1464:			outputType: outputType === "guidance" ? "media_brief" : outputType,
1465:			title: "Media Brief: Visual direction draft",
1476:			safetyLabel: "No media generation executed. Brief and routing only.",
1484:			title: outputType === "task" ? "Task: Video production plan" : "Video Brief: Hook, script, storyboard",
1485:			summary: "Video draft prepared with hook, script structure, and storyboard flow.",
1492:			safetyLabel: "Video generation requires configured provider or GPU worker; no execution started."
1496:	if (specialistId === "publisher") {
1499:			title: outputType === "handoff" ? "Handoff Preview: Publishing package" : "Publishing Draft: Readiness checklist",
1500:			summary: "Publishing checklist and schedule draft prepared.",
1507:				"Draft publish schedule by channel",
1509:				"Prepare handoff for publishing review"
1512:			safetyLabel: "Confirmation required before publish. No publish action performed."
1519:			title: outputType === "task" ? "Task: Paid test plan" : "Ads Draft: Angles and tests",
1520:			summary: "Ad angle and audience testing draft prepared for review.",
1536:				"Primary ad angle draft",
1540:			safetyLabel: "No budget updates or ad launches executed."
1547:			title: outputType === "task" ? "Task: Analysis plan" : "Insights Guidance: Signal review",
1577:			title: outputType === "task" ? "Ticket Draft: Customer operations follow-up" : "Customer Ops Draft: Thread, reply, and routing",
1578:			summary: "Customer operations draft prepared with safe reply language, ticket notes, SLA review, and escalation guardrails.",
1579:			mainOutput: "Review the customer context, confirm missing details, then route the draft through the owning support, sales, or operations surface.",
1586:				"Priority: draft priority pending runtime inbox and SLA confirmation.",
1590:				"Unified Inbox is not duplicated here; this is a draft and routing preview only.",
1593:			nextStep: "Review the draft, confirm the destination team, then route through support, sales, or operations.",
1597:				"Create ticket draft fields for review",
1601:			safetyLabel: "No reply sent, ticket created, SLA changed, or escalation triggered."
1608:			title: outputType === "handoff" ? "Sales Handoff" : "Sales / CRM Draft: Lead and outreach plan",
1609:			summary: "Sales and CRM draft prepared with lead qualification, outreach direction, follow-up cadence, and pipeline handoff notes.",
1610:			mainOutput: "Use this as a sales planning draft. Confirm CRM context and owner before sending outreach or changing pipeline status.",
1623:				"Can I send more details?",
1628:				"Outreach and follow-ups require confirmation before sending."
1630:			nextStep: "Review the lead fit, confirm owner, then route the handoff to operations or the CRM surface.",
1643:		if (outputType === "workflow") {
1647:				summary: "Workflow draft prepared with stage owners and checkpoints.",
1650:					"Stage 2: Specialist draft production",
1654:				safetyLabel: "Workflow run is not started. This is a draft preview only."
1659:			title: outputType === "handoff" ? "Handoff Preview: Operations package" : "Operations Draft: Task and handoff plan",
1660:			summary: "Operational plan drafted with next tasks, owners, and route.",
1662:				"Define immediate tasks",
1667:			safetyLabel: "No workflow run and no backend task creation executed."
1674:function buildPhase2OutputPreview({ intent, session, prompt, projectName }) {
1682:		task: "task",
1683:		workflow: "workflow",
1686:	const outputType = intentToType[intent] || "guidance";
1688:	const base = specialistTemplateForOutput({
1690:		outputType,
1700:		title: outputType === "workflow" ? "Team Workflow" : `Team ${titleCase(outputType)} Preview`,
1701:		summary: `Full team ${outputType.replace("_", " ")} preview prepared for ${projectName || "current project"}.`,
1704:			"Writer, Media Director, and Video Lead turn strategy into message, asset, and production drafts",
1710:			"Writer: draft hooks, captions, messages, email, or outreach copy",
1711:			"Media / Video: prepare creative direction, asset needs, script, storyboard, or voiceover draft",
1713:			"Publisher: package channel-ready copy, assets, schedule notes, and publish checks",
1714:			"Customer Ops / Sales: add reply, ticket, lead, outreach, or CRM handoff drafts when relevant",
1715:			"Operations: convert the reviewed output into safe tasks, workflow draft, or handoff context"
1717:		destinationRoute: outputType === "task" ? "task-center" : "workflows",
1718:		nextSafeAction: "Review the team draft, confirm owners, then route draft context to the destination workspace",
1719:		confirmationNote: "No task, workflow, outreach, customer reply, CRM update, approval, or publishing action is executed from Full Team mode.",
1720:		safetyLabel: "Full Team output is a coordinated draft preview only."
1724:function formatOutputTypeLabel(outputType) {
1727:		task: "Task",
1728:		workflow: "Workflow",
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
1829:                draftText: "",
1840:		const providerMatch = /openai|replicate|stability|runway|elevenlabs|anthropic/.test(integrationId);
1922:		approvedAssets: assetCategories
1924:			.flatMap((item) => asArray(item.approved_assets).map((assetId) => ({
1963:		writer: ["content", "post", "caption", "blog", "script", "email", "landing page section", "reel script", "copy", "write", "hooks"],
1969:		operations: ["task plan", "workflow", "handoff", "approval", "timeline", "execution plan", "route", "publish", "status", "priority", "priorities", "blocking", "blocker", "readiness", "next", "do next"],
1986:	const actionRouting = /launch|build|reconnect|connect|improve|create|fix|route|plan|publish/.test(query);
1994:function routeSuggestion(label, route, reason) {
1995:	return { label, route, reason };
2014:		notes.push("Sync social feeds to learn from real post performance.");
2047:		routeSuggestions: [
2048:			routeSuggestion("Setup", "setup", "Close missing project basics, goals, and audience inputs."),
2049:			routeSuggestion("Integrations", "integrations", "Reconnect data sources and improve intelligence coverage."),
2050:			routeSuggestion("Insights", "insights", "Review performance signals and the recommendation stack.")
2065:			: "Not enough post-level data yet to rank content winners.",
2067:			top ? `Top performer: ${extractTopMessage(top)} with ${formatCompactNumber(top.engagement ?? top.reach)} signal.` : "No top post measured yet.",
2073:			top ? `Reuse the pattern from ${extractTopMessage(top)} in the next publishing cycle.` : "Sync social insights to identify winning hooks and formats.",
2079:			weak ? `Move ${extractTopMessage(weak)} into a rewrite workflow.` : "Audit current content for posts not converting attention to clicks.",
2080:			"Prepare next batch with performance-led hooks instead of generic posting volume."
2082:		routeSuggestions: [
2083:			routeSuggestion("Content Studio", "content-studio", "Rewrite weak posts and turn winning patterns into new drafts."),
2084:			routeSuggestion("Publishing", "publishing", "Schedule the next batch with stronger timing and approval control."),
2085:			routeSuggestion("Insights", "insights", "Compare top and weak content performance.")
2118:		routeSuggestions: [
2119:			routeSuggestion("Insights", "insights", "Review search and website performance together."),
2120:			routeSuggestion("Integrations", "integrations", "Reconnect GA4 or Search Console."),
2121:			routeSuggestion("Setup", "setup", "Refine positioning if traffic signal is weak or misaligned.")
2153:		routeSuggestions: [
2154:			routeSuggestion("Ads Manager", "ads-manager", "Review pacing, creative mapping, and paid operating view."),
2155:			routeSuggestion("Integrations", "integrations", "Connect or reconnect paid reporting platforms."),
2156:			routeSuggestion("Insights", "insights", "Compare paid vs organic and website results.")
2181:		routeSuggestions: [
2182:			routeSuggestion("Setup", "setup", "Strengthen project assumptions, goals, and audience context."),
2183:			routeSuggestion("Integrations", "integrations", "Increase data coverage and reduce blind spots."),
2184:			routeSuggestion("Insights", "insights", "See where evidence is strong and where it is thin.")
2197:		return { title: "Campaign launch task block", owner: "Campaign Studio", steps: ["Define the campaign objective, audience, and offer.", "Choose channels and budget based on current intelligence.", "List required assets and publishing dependencies before launch."] };
2200:		return { title: "Content plan task block", owner: "Content Studio", steps: ["Use the strongest content pattern as the starting template.", "Map posts by platform, hook, format, and CTA.", "Route approved items into Publishing for scheduling."] };
2202:	if (/weak post|improve content/.test(query)) {
2203:		return { title: "Content repair task block", owner: "Content Studio", steps: ["Select the weakest items from Insights.", "Rewrite hooks, sharpen CTAs, and adjust format-platform fit.", "Republish only after updated versions are approved."] };
2206:		return { title: "Integration recovery task block", owner: "Integrations", steps: ["Reconnect critical analytics and performance feeds first.", "Test each integration after reconnect and sync current data.", "Return to Insights to confirm coverage improves."] };
2208:	return { title: "Execution task block", owner: "Workflows", steps: ["Confirm the goal and required output.", "Identify which workspace owns the work.", "Move into the correct page and execute the first step."] };
2213:	const taskBlock = buildOperationsTaskBlock(aiContext, message);
2214:	const routeSuggestions = [];
2215:	if (/campaign/.test(query)) routeSuggestions.push(routeSuggestion("Campaign Studio", "campaign-studio", "Turn this into a structured launch plan."));
2216:	if (/content|post/.test(query)) {
2217:		routeSuggestions.push(routeSuggestion("Content Studio", "content-studio", "Draft, rewrite, or prepare the requested content outputs."));
2218:		routeSuggestions.push(routeSuggestion("Publishing", "publishing", "Schedule or approve if the next step is publishing."));
2220:	if (/reconnect|connect|integration|tool|sync/.test(query)) routeSuggestions.push(routeSuggestion("Integrations", "integrations", "Reconnect data sources and restore intelligence coverage."));
2221:	if (/ads|campaign scale|roas|creative/.test(query)) routeSuggestions.push(routeSuggestion("Ads Manager", "ads-manager", "Review live paid performance and action the next media move."));
2222:	if (!routeSuggestions.length) routeSuggestions.push(routeSuggestion("Workflows", "workflows", "Use Workflows when the task spans multiple execution areas."));
2225:		summary: "This request is best handled as a structured workflow — moving into the right workspace gets results faster than chat alone.",
2234:		nextActions: taskBlock.steps,
2235:		routeSuggestions,
2236:		taskBlock,
2272:	fetchProjectInsights,
2273:	fetchProjectLearning,
2297:					fetchProjectInsights(projectName),
2298:					fetchProjectLearning(projectName)
2338:		routeSuggestions: asArray(response?.routeSuggestions),
2347:	publishing: "Publishing",
2349:	workflows: "Workflows",
2356:	"task-center": "Task Center",
2359:	"notification-center": "Notification Center",
2369:	publishing: "publisher",
2371:	workflows: "operations",
2378:	"task-center": "operations",
2381:	"notification-center": "operations",
2403:	publish: "publishing",
2404:	publisher: "publishing",
2407:	workflow: "workflows",
2412:	tasks: "task-center",
2415:	notifications: "notification-center",
2477:	const fallbackRoute = sourcePage === "workspace" ? "workflows" : sourcePage;
2478:	const fallbackLabel = sourceLabel || routeLabel(fallbackRoute);
2481:		const rawRoute = firstAiInboundId(record.route, record.destination, record.page, record.targetPage, record.target_page);
2483:		const route = normalizeAiInboundSourcePage(rawRoute || stringRoute || fallbackRoute);
2484:		const label = firstAiInboundText(record.label, record.title, record.name) || routeLabel(route) || fallbackLabel;
2486:		return { route, label, reason };
2487:	}).filter((item) => item.route || item.label);
2491:		route: fallbackRoute,
2497:function normalizeAiInboundOutputPreview(rawPreview, normalized) {
2500:	const outputType = asString(preview.outputType || preview.output_type || preview.type || "handoff").trim() || "handoff";
2503:		preview.destination_route ||
2504:		asArray(normalized.routeSuggestions)[0]?.route ||
2506:		"workflows"
2512:		outputType,
2519:		status: asString(preview.status || "draft_preview"),
2520:		safetyLabel: firstAiInboundText(preview.safetyLabel, preview.safety_label, "Guidance and draft only. No backend execution."),
2521:		confirmationNote: firstAiInboundText(preview.confirmationNote, preview.confirmation_note, "Execution, approvals, publishing, CRM updates, customer replies, and workflow runs require explicit confirmation in the owning workspace."),
2542:	const stablePayloadId = firstAiInboundId(payload.handoff_id, payload.handoffId, payload.id, handoff?.created_at, handoff?.createdAt);
2559:	const draftContext = firstAiInboundObject(payload.draft_context, payload.draftContext, handoff?.draft_context, handoff?.draftContext);
2565:		draftContext.source_page,
2566:		draftContext.sourcePage
2568:	const sourceLabel = AI_INBOUND_SOURCE_LABELS[sourcePage] || routeLabel(sourcePage) || "Workspace";
2575:		draftContext.specialist ||
2576:		draftContext.specialist_id ||
2577:		draftContext.modeId ||
2578:		draftContext.mode_id ||
2587:		draftContext.prompt,
2588:		draftContext.message,
2589:		draftContext.request,
2590:		draftContext.summary
2591:	)) || `Review this ${sourceLabel} handoff for ${projectLabel}. Identify the right specialist, summarize the context, produce a review-ready draft, and recommend the next safe route. Do not execute publishing, task creation, CRM updates, customer replies, workflow runs, or backend actions.`;
2595:		draftContext.title,
2596:		draftContext.lastResponseTitle,
2600:	const routeSuggestions = normalizeAiInboundRouteSuggestions(
2601:		asAiInboundList(payload.routeSuggestions).length ? payload.routeSuggestions :
2602:		asAiInboundList(payload.route_suggestions).length ? payload.route_suggestions :
2603:		asAiInboundList(draftContext.routeSuggestions).length ? draftContext.routeSuggestions :
2604:		draftContext.route_suggestions,
2608:	const teamMode = normalizeAiInboundTeamMode(firstAiInboundId(payload.teamMode, payload.team_mode, draftContext.teamMode, draftContext.team_mode));
2609:	const rawOutputPreview = firstAiInboundObject(
2610:		draftContext.outputPreview,
2611:		draftContext.output_preview,
2612:		draftContext.phase2_output_preview,
2613:		payload.outputPreview,
2614:		payload.output_preview
2623:		routeSuggestions,
2624:		outputPreview: null,
2625:		draftContext: {
2626:			...draftContext,
2631:		note: "Guidance only. No publishing, task creation, CRM updates, customer replies, workflow runs, exports, or backend actions are executed from this handoff."
2633:	normalized.outputPreview = normalizeAiInboundOutputPreview(rawOutputPreview, normalized);
2643:	session.draftMessage = normalized.prompt;
2647:	session.routeSuggestions = normalized.routeSuggestions;
2653:		routeSuggestions: normalized.routeSuggestions
2657:	if (normalized.outputPreview) {
2658:		session.outputPreview = normalized.outputPreview;
2659:		session.outputWorkspaceTab = outputTabFromPreview(normalized.outputPreview);
2660:		session.activeOutputTab = session.outputWorkspaceTab;
2661:		saveLocalOutput(projectName, {
2662:			preview: session.outputPreview,
2670:		...normalized.draftContext,
2676:		routeSuggestions: normalized.routeSuggestions,
2682:	persistSessionDraft(projectName, session, `Inbound handoff loaded from ${normalized.sourceLabel}`);
2700:	executeProjectAiCommand,
2705:	if (typeof executeProjectAiCommand !== "function") throw new Error("AI command service is unavailable.");
2713:		result = await executeProjectAiCommand(projectName, {
2720:				approved_assets: aiContext.approvedAssets,
2732:		const failureReason = asString(payload?.error) || asString(payloadResponse?.error) || asString(error?.message) || "AI provider failed to return output.";
2740:			nextActions: ["Check AI provider configuration and retry."],
2741:			routeSuggestions: [],
2747:	const createdAt = nowIso();
2755:		createdAt,
2763:		createdAt: asString(result?.command?.created_at) || nowIso(),
2772:		createdAt,
2778:	session.draftMessage = "";
2914:	const isStructured = session.taskMode === "structured";
2929:					<button class="ctrl-mode-btn${!isStructured ? " is-active" : ""}" type="button" data-ctrl-task-toggle="free">Free text</button>
2930:					<button class="ctrl-mode-btn${isStructured ? " is-active" : ""}" type="button" data-ctrl-task-toggle="structured">Task builder</button>
2935:					id="ctrlComposerInput"
2938:					placeholder="Ask ${escapeHtml(mode.label)} anything — what to do next, what content is working, which campaign to scale, or where to route the next action…"
2939:				>${escapeHtml(session.draftMessage)}</textarea>
2941:				<div id="ctrlTaskFields" class="ctrl-task-fields${!isStructured ? " is-hidden" : ""}">
2942:					<div class="ctrl-task-fields-label">Build a structured task</div>
2943:					<div class="ctrl-task-field">
2945:						<select id="ctrlTaskType" class="ctrl-task-select">
2946:							<option value="launch"${session.taskType === "launch" ? " selected" : ""}>🚀 Launch Campaign</option>
2947:							<option value="content"${session.taskType === "content" ? " selected" : ""}>✍️ Generate Content</option>
2948:							<option value="analyze"${session.taskType === "analyze" ? " selected" : ""}>📊 Analyze Performance</option>
2949:							<option value="fix"${session.taskType === "fix" ? " selected" : ""}>🔧 Fix Readiness</option>
2952:					<div class="ctrl-task-field">
2954:						<select id="ctrlProductSelect" class="ctrl-task-select">
2956:							${productOptions.map((opt) => `<option value="${escapeHtml(opt)}"${session.taskProduct === opt ? " selected" : ""}>${escapeHtml(opt)}</option>`).join("")}
2959:					<div class="ctrl-task-field">
2961:						<select id="ctrlChannelSelect" class="ctrl-task-select">
2963:							${channelOptions.map((ch) => `<option value="${escapeHtml(ch)}"${session.taskChannel === ch ? " selected" : ""}>${escapeHtml(ch)}</option>`).join("")}
2966:					<button type="button" id="ctrlBuildTaskBtn" class="ctrl-build-task-btn">Build command from task →</button>
2970:					<button id="ctrlSendBtn" class="ctrl-send-btn" type="button">Send to ${escapeHtml(mode.label)}</button>
2974:				<div class="ctrl-composer-hint">Ctrl / Cmd + Enter to send · Suggested prompts prefill only · Draft stays local until you send to execute</div>
2990:				<span style="font-size:11px;color:var(--color-text-2);">Prefill only — send to run</span>
3025:	const routeSuggestions = asArray(response.routeSuggestions || response.route_suggestions).map((item) => {
3028:			label: humanizeValue(record.label || record.title || record.route || item),
3029:			route: asString(record.route || record.destination || record.page),
3032:	}).filter((item) => item.label || item.route);
3033:	const taskBlock = asObject(response.taskBlock);
3037:		return `<div class="ctrl-response-card"><p style="color:var(--color-text-2);font-size:13px;">No output returned.</p></div>`;
3079:			${taskBlock.title ? `
3081:					<div class="ctrl-response-section-label">Task block — ${escapeHtml(humanizeValue(taskBlock.owner, "System"))}</div>
3082:					<div class="ctrl-task-block-name">${escapeHtml(humanizeValue(taskBlock.title))}</div>
3084:						${normalizeDisplayList(taskBlock.steps, 6).map((step) => `<div class="ctrl-response-item"><span>${escapeHtml(step)}</span></div>`).join("")}
3089:			${routeSuggestions.length ? `
3092:					<div class="ctrl-route-row">
3093:						${routeSuggestions.map((item, index) => `
3094:							<button class="ctrl-route-btn" type="button" data-ctrl-route="${index}" data-ctrl-route-owner="${escapeHtml(ownerId || "")}" title="${escapeHtml(item.reason)}">
3127:						<div class="ctrl-msg-meta">${escapeHtml(formatTime(message.createdAt))}</div>
3136:					<div class="ctrl-msg-ai-agent">${escapeHtml(mode.label)} · ${escapeHtml(formatTime(message.createdAt))}</div>
3185:										<div class="ctrl-recent-result">${escapeHtml(entry.responseTitle || mode.label + " · " + formatTime(entry.createdAt))}</div>
3188:										<span class="ctrl-recent-time">${escapeHtml(formatTime(entry.createdAt))}</span>
3196:					<div class="ctrl-empty-box">Commands you send appear here. Click any to restore and re-run.</div>
3213:		.filter((msg) => msg.role === "assistant" && asString(msg.response?.outputType || msg.response?.output_type))
3216:			type: titleCase(asString(msg.response?.outputType || msg.response?.output_type)),
3219:			time: formatTime(msg.createdAt)
3307:                session.draftMessage ||
3335:function buildConversationWorkPrompt(session, outputType, fallbackPrompt = "") {
3338:                guidance: "review-ready draft",
3339:                task: "task plan",
3340:                workflow: "workflow sequence",
3342:        }[outputType] || "work draft";
3350:                "Keep it review-ready and do not execute backend actions.",
3358:        const preview = buildPhase2OutputPreview({
3369:        // Keep raw conversation context available internally, but do not show it as the main output.
3373:                preview.mainOutput = context.assistantText;
3377:        preview.safetyLabel = preview.safetyLabel || "Conversation converted into a review-ready draft. No backend action executed.";
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
3510:	if (asString(session.draftMessage).trim()) return 0;
3514:function outputTabFromIntent(intent) {
3516:		guidance: "draft",
3517:		preview: "draft",
3518:		task: "task",
3519:		workflow: "workflow",
3523:	return map[asString(intent)] || "draft";
3526:function outputTabFromPreview(preview) {
3527:	const outputType = asString(preview?.outputType || "");
3528:	if (outputType === "task") return "task";
3529:	if (outputType === "workflow") return "workflow";
3530:	if (outputType === "handoff") return "handoff";
3531:	return "draft";
3534:function getOutputWorkspaceTab(session) {
3535:	const requested = asString(session.outputWorkspaceTab || "");
3537:	return outputTabFromPreview(asObject(session.outputPreview));
3540:function getToolOutputTypeLabel(tool) {
3543:		task: "Task Draft",
3544:		workflow: "Draft Workflow",
3549:	const firstOutput = asArray(tool.outputTypes)[0];
3550:	return firstOutput ? titleCase(asString(firstOutput).replace(/[_-]+/g, " ")) : "Draft";
3554:	if (tool.route) return asString(tool.route || "workflows");
3555:	if (session?.teamMode === "team") return tool.intent === "task" ? "task-center" : "workflows";
3556:	const outputType = tool.intent === "media" ? "guidance" : asString(tool.intent || "guidance");
3557:	return destinationRouteForSpecialist(session?.modeId || "operations", outputType);
3567:	if (tool.intent === "workflow") return "Draft";
3569:	if (tool.intent === "task") return "Draft";
3581:	return "Prepare a review-ready output for the selected specialist lane.";
3613:				<p class="aicmd-room-subtitle mhos-context-description">One specialist or the full team turns requests into review-ready drafts, tasks, and handoffs.</p>
3646:					<strong>${escapeHtml(languagePlan.publishLanguage)}</strong>
3654:			<div class="aicmd-room-flow mhos-workflow-chain" aria-label="AI operating flow">
3656:					<div class="aicmd-room-flow-step mhos-workflow-step${index === activeFlowIndex ? " mhos-workflow-active is-active" : ""}${index < activeFlowIndex ? " is-complete" : ""}">
3683:			<span>Full Team prepares a coordinated, review-ready plan. It does <b>not</b> execute workflows or publish anything.</span>
3750:						<p class="aicmd-v2-profile-purpose">Coordinates specialists into one review-ready brief, workflow, or handoff.</p>
3792:        if (roleId === "content_writer") return `${label} is drafting your content...`;
3794:        if (roleId === "operations" || roleId === "customer_ops") return `${label} is preparing your task handoff...`;
3797:        if (roleId === "publisher") return `${label} is preparing publishing guidance...`;
3809:		? "Team orchestration across strategy, writing, media/video, compliance, publishing, customer operations, sales/CRM, and operations"
3834:	const outputs = asArray(tool.outputTypes).join(" ");
3835:	const haystack = `${id} ${outputs} ${asString(tool.label)}`.toLowerCase();
3836:	if (/workflow|schedule_builder|step_sequence|trigger/.test(haystack)) return "workflow";
3837:	if (/handoff|route|destination_brief/.test(haystack)) return "handoff";
3838:	if (/task|ticket|checklist|owner_map|priority/.test(haystack)) return "task";
3859:		route: getCanonicalToolRoute(tool, session),
3861:		template: asString(tool.template || "Prepare a review-ready draft for {projectName}.")
3877:		{ id: "preview", label: "Preview", hint: "Draft output" },
3880:		{ id: "history", label: "History", hint: "Saved outputs" }
3911:					<span class="aicmd-v2-tools-subtitle">Fast specialist actions for the current output. Review-only: prepares drafts, previews, or handoffs without backend execution.</span>
3917:					const outputLabel = getToolOutputTypeLabel(tool);
3920:					const destination = routeLabel(getToolDestinationRoute(tool, session));
3927:							data-output-type="${escapeHtml(outputLabel.toLowerCase())}"
3935:								<span>Output: ${escapeHtml(outputLabel)}</span>
3952:			<span class="aicmd-v2-lang-chip" title="Input language">🎤 ${escapeHtml(languagePlan.conversationLanguage)}</span>
3953:			<span class="aicmd-v2-lang-chip" title="Publishing language">📝 ${escapeHtml(languagePlan.publishLanguage)}</span>
3963:		{ label: "Voice input", value: "Coming", className: "is-planned" },
3989:		const draftLabel = asString(session.draftMessage).trim() ? "Draft saved" : "Empty draft";
4000:					<span class="aicmd-v2-draft-state">${escapeHtml(draftLabel)}</span>
4003:				<div class="aicmd-chatgpt-input-shell">
4005:						id="aicmdV2Input"
4010:					>${escapeHtml(session.draftMessage)}</textarea>
4014:							<button id="aicmdV2VoiceBtn" class="aicmd-chatgpt-icon-btn" type="button" disabled title="Voice input coming soon">🎙</button>
4017:							<span class="aicmd-chatgpt-enter-hint">Enter to send · Shift+Enter newline</span>
4018:							<button id="aicmdV2AskBtn" class="aicmd-chatgpt-send-btn" type="button" ${isGenerating ? "disabled" : ""} title="Send message">
4036:	const preview = asObject(session.outputPreview);
4037:	const hasPreview = Boolean(preview.outputType && preview.title);
4044:						<p class="aicmd-v2-preview-subtitle">Generated content, draft packages, and routed handoffs appear here.</p>
4050:					<span>Ask a specialist or send the chat response to preview.</span>
4057:	const destination = routeLabel(preview.destinationRoute || destinationRouteForSpecialist(session.modeId, preview.outputType || "guidance"));
4061:	const outputLabel = hasPreview ? formatOutputTypeLabel(preview.outputType) : titleCase(activeTab);
4062:	const routeActionLabel = destination === "Content Studio"
4068:		? (preview.confirmationRequired ? "Confirmation required" : "Review before route")
4069:		: "Waiting for output";
4076:					<p class="aicmd-v2-preview-subtitle">${escapeHtml(humanizeValue(preview.sourcePrompt, "Review the generated specialist output."))}</p>
4078:				<span class="aicmd-v2-preview-status">${escapeHtml(titleCase(preview.status || "draft_preview"))}</span>
4082:				<span class="aicmd-v2-preview-chip"><strong>Type:</strong> ${escapeHtml(formatOutputTypeLabel(preview.outputType))}</span>
4089:				<p class="aicmd-v2-preview-what-heading">Prepared output</p>
4090:				<h4 class="aicmd-v2-preview-output-title">${escapeHtml(humanizeValue(preview.title, "Draft output"))}</h4>
4093:				${structuredPreview.draftText ? `
4094:					<div class="aicmd-v2-preview-draft">${escapeHtml(structuredPreview.draftText)}</div>
4098:					<div class="aicmd-v2-preview-structured-grid aicmd-room-output-blocks">
4134:function renderAiRoomOutputWorkspace(session, aiContext, escapeHtml) {
4135:	const preview = asObject(session.outputPreview);
4136:	const hasPreview = Boolean(preview.outputType && preview.title);
4137:	const activeTab = getOutputWorkspaceTab(session);
4138:	const structuredPreview = hasPreview ? buildStructuredPreviewBlocks(preview) : { blocks: [], draftText: "", compactSummary: "" };
4140:	const destination = routeLabel(preview.destinationRoute || destinationRouteForSpecialist(session.modeId, preview.outputType || "guidance"));
4144:	const outputLabel = hasPreview ? formatOutputTypeLabel(preview.outputType) : titleCase(activeTab);
4145:	const routeActionLabel = destination === "Content Studio"
4151:		? (preview.confirmationRequired ? "Confirmation required" : "Review before route")
4152:		: "Waiting for output";
4155:		<section class="aicmd-room-output-workspace">
4156:			<div class="aicmd-room-output-head">
4158:					<span class="aicmd-room-kicker">Output Workspace</span>
4159:					<h2>Drafts, tasks, workflows, handoffs</h2>
4160:                                        <p>${hasPreview ? "Review the result, then route draft context to the next workspace." : "Create a preview from the conversation before routing work to another workspace."}</p>
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
4225:                                        <span>Choose Draft, Task, Draft Workflow, or Prepare Handoff, then create a preview from the conversation.</span>
4230:                                <div class="aicmd-room-output-actions">
4231:                                        <button id="aicmdV2PreviewSendBtn" class="aicmd-v2-btn-primary" type="button">${escapeHtml(routeActionLabel)}</button>
4236:                                <div class="aicmd-room-planned-note">This is a review-ready preview. Execution, publishing, approvals, CRM updates, and workflow runs happen only in the destination workspace after confirmation.</div>
4238:                                <div class="aicmd-room-planned-note">No output actions yet. Create a Draft, Task, Draft Workflow, or Prepare Handoff from the conversation first.</div>
4245:	const preview = asObject(session.outputPreview);
4247:	const approval = preview.confirmationRequired ? "Confirmation required" : (preview.outputType ? "Review ready" : "No draft yet");
4251:	const recent = recentAt ? formatTime(recentAt) : (session.draftStatus || "No recent activity");
4279:				<li><span>Video brief / script draft</span><strong class="is-draft-ready">Draft-ready — no generation executed</strong></li>
4280:				<li><span>Native GPU video rendering</span><strong class="is-planned">Requires connected GPU worker</strong></li>
4281:				<li><span>Voice script preparation</span><strong class="is-draft-ready">Draft-ready — script only, no audio</strong></li>
4283:				<li><span>Voice input (microphone)</span><strong class="is-planned">Planned — SpeechRecognition not enabled</strong></li>
4294:        const selectedSpec = isTeam ? { id: "team", label: "Full Team", position: "Team workflow" } : getPhase1SpecialistById(session.modeId);
4297:        const selectedModeLabel = isTeam ? "Team workflow" : "Solo specialist";
4326:                ? "Chat only. No workflow, task, handoff, approval, publish, CRM, or customer action was created."
4327:                : "Preview-safe. Chat tools require the protected AI chat route.";
4330:                : "AI chat route is not connected yet. Preview tools remain available.";
4348:        const toolHint = selectedToolHints.length ? selectedToolHints.join(", ") : "Draft and route guidance";
4358:                const createdAt = asString(message.createdAt || "");
4365:                                                ${createdAt ? `<span>${escapeHtml(formatTime(createdAt))}</span>` : ""}
4380:                                createdAt: item.generatedAt || ""
4387:                                createdAt: item.generatedAt || ""
4459:                                <article class="aicmd-v2-chat-card aicmd-room-response-card is-selected-output" data-role="${escapeHtml(selectedRoleId)}">
4464:                                                <span class="aicmd-room-producer-chip">Selected specialist output</span>
4512:				<span class="aicmd-v2-prompts-hint">Click to prefill the composer — send when ready</span>
4520:						data-aicmdv2-prompt-text="${escapeHtml(p.prompt || `${p.label}. ${p.sub}. Prepare this as a review-ready draft only; do not execute anything.`)}"
4536:	const destination = routeLabel(destinationRouteForSpecialist(session.modeId, asObject(session.outputPreview).outputType || "guidance"));
4537:	const sessionState = session.responseLoading ? "Generating" : (session.outputPreview ? "Preview ready" : (asString(session.draftMessage).trim() ? "Drafting" : "Ready"));
4543:		{ label: "Publishing language", value: languagePlan.publishLanguage, present: true },
4549:		{ label: "Approved assets", value: aiContext.approvedAssets.length ? `${aiContext.approvedAssets.length} ready` : "No approved assets", present: aiContext.approvedAssets.length > 0 },
4554:			{ label: "Open conversations", value: "Snapshot / requires runtime surface", present: false, scoped: true },
4606:					<span>Publishing, approval, and workflow runs require your explicit confirmation in the right workspace.</span>
4610:					<span>Backend owns authority — AI Command prepares guidance and routes. It does not override execution controls.</span>
4619:	const preview = asObject(session.outputPreview);
4627:		...(preview.outputType ? [{
4646:							<strong>${escapeHtml(humanizeValue(item.title, "AI output"))}</strong>
4666:		description: "Talk to your AI team, run structured tasks, and turn intelligence into action."
4678:			navigateTo,
4681:			executeProjectAiCommand,
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
4730:			session.draftMessage = normalizeAiComposerPrompt(bridgeValue);
4731:			persistSessionDraft(sessionKey, session, detectedSpecialist ? "Specialist context loaded from Home" : "AI prompt loaded from workspace");
4732:			if (globalInput) globalInput.value = "";
4745:		const bridgeStatus = getAiResponseBridgeStatus(executeProjectAiChat);
4757:		// Final Room v1 renders the conversation, composer, output workspace, and tools directly.
4776:					<aside class="aicmd-room-output">
4777:						${renderAiRoomOutputWorkspace(session, aiContext, escapeHtml)}
4786:		const input = $("aicmdV2Input");
4794:			const value = asString(input?.value || session.draftMessage || fallbackPrompt || "").trim();
4797:				input?.focus?.();
4801:			session.draftMessage = value;
4802:			session.composerText = session.draftMessage;
4805:			session.routeSuggestions = [];
4807:			session.draftStatus = "New session started";
4808:			session.outputPreview = buildPhase2OutputPreview({
4817:			session.outputWorkspaceTab = outputTabFromIntent(intent);
4818:			persistSessionDraft(sessionKey, session, "Draft saved locally");
4820:			return session.outputPreview;
4835:		                saveLocalOutput(sessionKey, {
4836:		                        preview: session.outputPreview,
4843:		                persistSessionDraft(sessionKey, session, `Loaded chat: ${loaded.title || "AI Team session"}`);
4852:		                saveAiChatSession(sessionKey, session, { title: "Previous AI Team session" });
4854:		                session.draftMessage = "";
4856:		                session.routeSuggestions = [];
4859:		                session.draftStatus = "New session started";
4860:		                session.outputPreview = null;
4866:		                session.outputWorkspaceTab = "draft";
4871:		                saveLocalOutput(sessionKey, {
4879:		                persistSessionDraft(sessionKey, session, "New session started");
4880:		                showMessage?.("New AI session started. Previous chat saved to Recent chats.");
4889:				navigateTo("settings");
4896:		Array.from(document.querySelectorAll("[data-aicmdv2-output-tab]")).forEach((btn) => {
4898:				const nextTab = asString(btn.getAttribute("data-aicmdv2-output-tab") || "draft").trim();
4900:				session.outputWorkspaceTab = nextTab;
4901:				persistSessionDraft(sessionKey, session, `Output view: ${titleCase(nextTab)}`);
4911:                                const existingDraft = asString(session.draftMessage).trim();
4921:                                        session.draftMessage = `Act as the ${spec?.label || titleCase(specId)} for ${projectName}. Review the project context and suggest the next best actions. Do not execute anything; prepare guidance only.`;
4922:                                } else if (!session.draftMessage) {
4923:                                        session.draftMessage = "";
4926:                                persistSessionDraft(sessionKey, session, `${spec?.label || "Specialist"} selected`);
4937:				persistSessionDraft(sessionKey, session, mode === "team" ? "Full Team mode activated" : "Solo Specialist mode activated");
4947:				session.draftMessage = text;
4948:				if (input) input.value = text;
4949:				persistSessionDraft(sessionKey, session, "Suggested prompt loaded — review and send when ready");
4951:				input?.focus?.();
4959:				session.draftMessage = text;
4960:				if (input) input.value = text;
4961:				persistSessionDraft(sessionKey, session, "Quick action loaded");
4963:				input?.focus?.();
4970:                        input,
4974:                        persistSessionDraft,
4980:		if (input) {
4981:			input.oninput = () => {
4982:				session.draftMessage = input.value || "";
4983:				session.composerText = session.draftMessage;
4984:				persistSessionDraft(sessionKey, session, "Draft auto-saved locally");
4987:			input.onkeydown = (event) => {
4996:			        const sendBtn = $("aicmdV2AskBtn");
4997:			        if (sendBtn && !sendBtn.disabled) {
4998:			                sendBtn.click?.();
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
5042:		// ── ASK SPECIALIST (P0.3.2C1 chat route) ────────────────
5046:		                const value = asString(input?.value || session.draftMessage || "").trim();
5049:		                        input?.focus?.();
5060:		                        showMessage?.("AI chat route is not connected yet.");
5076:		                        createdAt: nowIso(),
5082:		                session.draftMessage = "";
5086:		                saveLocalOutput(sessionKey, {
5087:		                        preview: session.outputPreview,
5098:		                        const result = await executeProjectAiChat(projectName, {
5107:		                                outputLanguage: languagePlan.publishLanguage,
5109:		                                marketLanguage: languagePlan.publishLanguage,
5116:		                                safetyInstruction: "Chat only. No task/workflow/handoff/approval/publish/customer/CRM execution.",
5130:		                                throw new Error("AI chat route returned no response text.");
5142:		                                createdAt: asString(result?.timestamp) || nowIso(),
5149:		                                        outputType: "chat",
5158:		                        const routeSuggestion = asArray(response.routeSuggestions || result?.routeSuggestions)[0];
5159:                                        const responseRoute = resolveAiResponseOutputRoute(session, {
5164:                                                outputType: response.outputType,
5165:                                                destinationRoute: asString(routeSuggestion?.route)
5172:		                                generatedAt: assistantChatMessage.createdAt,
5181:		                                outputType: responseRoute.outputType,
5190:		                        saveLocalOutput(sessionKey, {
5191:		                                preview: session.outputPreview,
5198:		                        saveAiChatSession(sessionKey, session);
5201:		                        updateStatus("Specialist reply generated. No workflow/task/handoff was created.");
5207:		                        saveLocalOutput(sessionKey, {
5208:		                                preview: session.outputPreview,
5222:                // Phase 1: stages draft locally from conversation context. No backend execution.
5226:                                const fallback = asString(input?.value || session.draftMessage || "").trim();
5234:                                persistSessionDraft(sessionKey, session, "Guidance preview prepared from conversation");
5243:                // Phase 1: converts the current conversation into a task preview. No backend execution.
5244:                const draftTaskBtn = $("aicmdV2DraftTaskBtn");
5245:                if (draftTaskBtn) {
5246:                        draftTaskBtn.onclick = () => {
5247:                                const value = asString(input?.value || session.draftMessage || "").trim();
5250:                                        ? `Draft a task plan for: ${value}`
5251:                                        : `Draft a task plan for the next best action for ${projectName || "this project"} with ${spec.label}.`;
5254:                                        intent: "task",
5259:                                persistSessionDraft(sessionKey, session, "Task preview prepared from conversation");
5260:                                updateStatus("Task draft preview prepared from conversation context. Review before creating durable tasks.");
5261:                                showMessage?.("Task draft preview prepared from conversation.");
5267:                const draftWorkflowBtn = $("aicmdV2DraftWorkflowBtn");
5268:                if (draftWorkflowBtn) {
5269:                        draftWorkflowBtn.onclick = () => {
5270:                                const value = asString(input?.value || session.draftMessage || "").trim();
5273:                                        ? `Draft a workflow sequence for: ${value}`
5274:                                        : `Draft a workflow sequence for ${projectName || "this project"} with ${spec.label}.`;
5277:                                        intent: "workflow",
5282:                                persistSessionDraft(sessionKey, session, "Workflow preview prepared from conversation");
5283:                                updateStatus("Workflow draft preview prepared from conversation context. No workflow run started.");
5284:                                showMessage?.("Workflow draft preview prepared from conversation.");
5294:                                const value = asString(input?.value || session.draftMessage || "").trim();
5306:                                persistSessionDraft(sessionKey, session, "Handoff preview prepared from conversation");
5307:                                updateStatus("Handoff preview prepared from conversation context. Review destination before sending.");
5332:					outputTypes: asArray(tool.outputTypes).length ? tool.outputTypes : [asString(tool.intent || tool.id || "draft").replace(/[^a-z0-9_]+/g, "_")]
5339:					input,
5342:					persistSessionDraft,
5354:		const saveBtn = $("aicmdV2SaveBtn");
5355:		if (saveBtn) {
5356:			saveBtn.onclick = () => {
5357:				session.draftMessage = asString(input?.value || session.draftMessage || "");
5358:				persistSessionDraft(sessionKey, session, "Draft saved locally");
5359:				updateStatus("Composer draft saved locally.");
5360:				showMessage?.("Composer draft saved locally.");
5368:				session.draftMessage = "";
5370:				session.routeSuggestions = [];
5373:				if (input) input.value = "";
5374:				persistSessionDraft(sessionKey, session, "Draft cleared");
5375:				updateStatus("Composer draft cleared.");
5376:				showMessage?.("Composer draft cleared.");
5386:		                input?.focus?.();
5413:				setAiComposerValue(session, input, latestResponse.responseText);
5414:				if (input) {
5415:					input.focus();
5417:				persistSessionDraft(sessionKey, session, "Generated response inserted into composer");
5426:				const saved = saveLocalOutput(sessionKey, {
5427:					preview: session.outputPreview,
5432:				updateStatus(`Response saved locally ${formatTime(saved.updatedAt)}.`);
5433:				showMessage?.("Response saved locally.");
5440:		                const fallback = latestResponse?.prompt || asString(input?.value || session.draftMessage || "");
5454:		                saveLocalOutput(sessionKey, {
5455:		                        preview: session.outputPreview,
5462:		                updateStatus("Conversation converted into a draft preview.");
5472:				const responseRoute = resolveAiResponseOutputRoute(session, latestResponse);
5473:				const destination = asString(latestResponse.destinationRoute || responseRoute.destinationRoute || destinationRouteForSpecialist(session.modeId, responseRoute.outputType || "guidance"));
5474:				const draftContext = {
5479:					routeSuggestions: [{ route: destination, label: routeLabel(destination), reason: "Specialist response destination" }],
5482:				setSharedAiDraft(projectName || "__default__", draftContext);
5488:					created_at: nowIso(),
5491:						draft_context: draftContext,
5492:						output: latestResponse.responseRaw || {
5498:				showMessage?.("Response draft context prepared. Review before saving or executing.");
5499:				navigateTo(destination);
5512:				speechSynthesis.cancel();
5522:				const output = asObject(session.outputPreview);
5523:				if (!output.outputType) return;
5526:					: getPhase1SpecialistById(output.specialistId || session.modeId).label;
5527:				const text = buildPreviewText(output, specialistLabel);
5546:				const output = asObject(session.outputPreview);
5547:				if (!output.outputType) return;
5550:					: getPhase1SpecialistById(output.specialistId || session.modeId).label;
5551:				const text = buildPreviewText(output, specialistLabel);
5552:				session.draftMessage = text;
5553:				if (input) {
5554:					input.value = text;
5555:					input.focus();
5557:				persistSessionDraft(sessionKey, session, "Preview inserted into composer");
5565:				const output = asObject(session.outputPreview);
5566:				const destination = asString(output.destinationRoute || "").trim();
5568:					updateStatus("No destination route is available for this preview.");
5577:					created_at: nowIso(),
5579:						prompt: output.sourcePrompt,
5580:						draft_context: {
5582:							modeId: output.specialistId || session.modeId,
5583:							lastCommand: output.sourcePrompt || "",
5584:							lastResponseTitle: output.title || "",
5585:							routeSuggestions: [{ route: destination, label: routeLabel(destination), reason: "Phase 2 preview destination" }],
5586:							phase2_output_preview: output
5591:				setSharedAiDraft(projectName || "__default__", handoffRecord.payload.draft_context);
5594:				navigateTo(destination);
5601:				const output = asObject(session.outputPreview);
5602:				if (!output.outputType) return;
5603:				const saved = saveLocalOutput(sessionKey, {
5604:					preview: output,
5608:				updateStatus(`Preview saved locally ${formatTime(saved.updatedAt)}.`);
5609:				showMessage?.("Preview saved locally.");
5616:				const output = asObject(session.outputPreview);
5617:				if (!output.outputType) return;
5622:				const previewText = [humanizeValue(output.title), humanizeValue(output.summary)]
5626:				speechSynthesis.cancel();
5635:				session.outputPreview = null;
5648:				fetchProjectInsights,
5649:				fetchProjectLearning,

## AI Command imports / API usage
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

## AI Command route/destination maps
function extractGeneratedResponseText(response = {}) {
	const direct = humanizeValue(
		response.chat_answer ||
		response.response_text ||
		response.content ||
		response.summary ||
		response.analysis ||
		response.title
	);
	if (direct) return direct;

	const bullets = normalizeDisplayList(response.bullets, 6)
		.map((item) => `- ${item}`)
		.join("\n");

	if (bullets) return bullets;

	const recommendationLine = normalizeDisplayList(response.recommendations, 4)
		.map((item, index) => `${index + 1}. ${item}`)
		.join("\n");

	const findingLine = normalizeDisplayList(response.findings, 4)
		.map((item) => `- ${item}`)
		.join("\n");

	const sectionLine = asArray(response.sections)
		.map((section) => {
			const title = humanizeValue(section?.title);
			const items = normalizeDisplayList(section?.items, 4);
			if (!items.length) return "";
			return [title ? `${title}:` : "", ...items.map((item) => `- ${item}`)].filter(Boolean).join("\n");
		})
		.filter(Boolean)
		.join("\n\n");

	return [recommendationLine, findingLine, sectionLine].filter(Boolean).join("\n\n");
}

function destinationRouteForSpecialist(specialistId, outputType) {
	const rawId = getAiRoomRoleId(specialistId || "operations");
	const id = MODE_ID_ALIASES[rawId] || rawId;
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
	if (id === "customer_ops") return outputType === "task" ? "task-center" : "operations-centers";
	if (id === "sales_crm") return "workflows";
	return "workflows";
}


function resolveAiResponseOutputRoute(session, response = {}) {
        const activeTab = getOutputWorkspaceTab(session);
        const specialistId = getAiRoomRoleId(session?.modeId || "operations");
        const explicitDestination = asString(response.destinationRoute || "").trim();

        const text = [
                activeTab,
                response.outputType,
                response.destinationRoute,
                response.responseTitle,
                response.responseText,
                response.prompt
        ].map((value) => asString(value).toLowerCase()).join(" ");

        let outputType = asString(response.outputType || "").toLowerCase();
        if (!outputType || outputType === "chat") {
                outputType = activeTab === "task"
                        ? "task"
                        : activeTab === "workflow"
                                ? "workflow"
                                : activeTab === "handoff"
                                        ? "handoff"
                                        : "guidance";
        }

        const looksTaskLike = /\b(task|tasks|handoff|ticket|tickets|follow-up|follow up|owner|owners|assignee|assigned|due date|priority|priorities|backlog|checklist|next task|action item|action items)\b/.test(text);
        const looksWorkflowLike = /\b(workflow|workflows|process|sequence|phase|phases|approval flow|automation|operating loop|step-by-step|steps|dependencies|trigger|review gate|execution flow)\b/.test(text);
        const looksContentLike = /\b(content|caption|captions|post|posts|email|blog|article|copy|headline|landing page|script|message|cta|product copy|social post)\b/.test(text);
        const looksMediaLike = /\b(media|visual|creative|image|images|video|reel|storyboard|shot list|asset|assets|design|production|creative direction|voiceover)\b/.test(text);
        const looksPublishingLike = /\b(publish|publishing|schedule|channel package|channel payload|approval-ready post|final post|ready to publish|publishing package)\b/.test(text);
        const looksGovernanceLike = /\b(compliance|governance|claim|claims|risk|risks|approval|approvals|policy|privacy|legal|safe language|safety review)\b/.test(text);
        const looksInsightLike = /\b(insight|insights|seo|keyword|keywords|analytics|performance|traffic|ranking|search intent|metrics|research|competitor|competitors|market research)\b/.test(text);
        const looksCampaignLike = /\b(campaign|launch|audience|offer|funnel|positioning|channel mix|campaign brief|go-to-market|go to market)\b/.test(text);

        if (outputType === "handoff" || outputType === "task" || looksTaskLike) {
                outputType = "task";
                return { outputType, destinationRoute: "task-center" };
        }

        if (outputType === "workflow" || looksWorkflowLike) {
                outputType = "workflow";
                return { outputType, destinationRoute: explicitDestination || "workflows" };
        }

        if (/content|copy|draft|caption|email|blog|article|script/.test(outputType) || looksContentLike) {
                outputType = "content";
                return { outputType, destinationRoute: explicitDestination || "content-studio" };
        }

        if (/media|video|visual|asset|creative/.test(outputType) || looksMediaLike) {
                outputType = "media";
                return { outputType, destinationRoute: explicitDestination || "media-studio" };
        }

        if (/publishing|publish|schedule/.test(outputType) || looksPublishingLike) {
                outputType = "publishing";
                return { outputType, destinationRoute: explicitDestination || "publishing" };
        }

        if (/governance|compliance|risk|approval/.test(outputType) || looksGovernanceLike) {
                outputType = "governance";
                return { outputType, destinationRoute: explicitDestination || "governance" };
        }

        if (/insight|research|seo|analytics/.test(outputType) || looksInsightLike) {
                outputType = "insight";
                return { outputType, destinationRoute: explicitDestination || "insights" };
        }

        if (/campaign|strategy|launch/.test(outputType) || looksCampaignLike) {
                outputType = "campaign";
                return {
                        outputType,
                        destinationRoute: explicitDestination || (session?.teamMode === "team" ? "workflows" : "campaign-studio")
                };
        }

        const destinationRoute = explicitDestination || destinationRouteForSpecialist(session?.modeId || "operations", outputType);
        return { outputType, destinationRoute };
}


function routeLabel(route) {
	const labels = {
		"campaign-studio": "Campaign Studio",
		"content-studio": "Content Studio",
		"media-studio": "Media Studio",
		publishing: "Publishing",
		"ads-manager": "Ads Manager",
		insights: "Insights",
		integrations: "Integrations",
		governance: "Governance",
		"operations-centers": "Operations Centers",
		"task-center": "Task Center",
		setup: "Setup",
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

		modeId: modeId || "",
		lastCommand: asString(command),
		lastResponseTitle: asString(response?.title),
		routeSuggestions: asArray(response?.routeSuggestions),
		updatedAt: nowIso()
	});
}


const AI_INBOUND_SOURCE_LABELS = {
	"content-studio": "Content Studio",
	"media-studio": "Media Studio",
	publishing: "Publishing",
	"campaign-studio": "Campaign Studio",
	workflows: "Workflows",
	library: "Library",
	insights: "Insights",
	integrations: "Integrations",
	settings: "Settings",
	governance: "Governance",
	"operations-centers": "Operations Centers",
	"task-center": "Task Center",
	"queue-center": "Queue Center",
	"job-monitor": "Job Monitor",
	"notification-center": "Notification Center",
	research: "Research",
	"ads-manager": "Ads Manager",
	setup: "Setup",
	workspace: "Workspace"
};

const AI_INBOUND_SPECIALIST_BY_SOURCE = {
	"content-studio": "writer",
	"media-studio": "media",
	publishing: "publisher",
	"campaign-studio": "strategist",
	workflows: "operations",
	library: "media",
	insights: "seo",
	integrations: "operations",
	settings: "operations",
	governance: "compliance_reviewer",
	"operations-centers": "operations",
	"task-center": "operations",
	"queue-center": "operations",
	"job-monitor": "operations",
	"notification-center": "operations",
	research: "seo",
	"ads-manager": "ads",
	setup: "operations",
	workspace: "operations"
};

const AI_INBOUND_SPECIALIST_ALIASES = {
	designer: "media",
	researcher: "seo",
	compliance: "compliance_reviewer",
	"customer-ops": "customer_ops",
	customer_ops: "customer_ops",
	"sales-crm": "sales_crm",
	sales_crm: "sales_crm"
};

const AI_INBOUND_SOURCE_ALIASES = {
	content: "content-studio",
	"content-studio-workspace": "content-studio",
	media: "media-studio",
	"media-studio-workspace": "media-studio",
	publish: "publishing",
	publisher: "publishing",
	campaign: "campaign-studio",
	campaigns: "campaign-studio",
	workflow: "workflows",
	asset: "library",
	"asset-library": "library",
	operation: "operations-centers",
	operations: "operations-centers",
	tasks: "task-center",
	queue: "queue-center",
	jobs: "job-monitor",
	notifications: "notification-center",
	integration: "integrations",
	govern: "governance",
	home: "workspace"
};

function firstAiInboundId(...values) {
	for (const value of values) {
		const text = asString(value).trim();
		if (text) return text;
	}

## AI Command navigation/action handlers around operations
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
				showMessage?.("Response draft context prepared. Review before saving or executing.");
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

## Tool dock operation tools
      icon: "⏱",
      label: "Timeline",
      badge: "Plan",
      actionType: "guided",
      safetyLevel: "review_only",
      frontendOwnerPage: "workflows",
      destinations: ["chat-preview", "workflows", "campaign-studio", "publishing"],
      sourceTypes: ["current_chat", "project_plan", "campaign_timeline", "dependency_notes", "manual_input"],
      outputTypes: ["timeline", "milestones", "blockers", "safe_sequence"],
      template: "Create a timeline for {projectName}. Include milestones, blockers, dependencies, and safe sequencing."
    },
    {
      id: "checklist",
      icon: "☷",
      label: "Checklist",
      badge: "Ops",
      actionType: "guided",
      safetyLevel: "review_only",
      frontendOwnerPage: "workflows",
      destinations: ["chat-preview", "workflows", "governance", "publishing"],
      sourceTypes: ["current_chat", "readiness_gaps", "asset_requirements", "approval_notes", "manual_input"],
      outputTypes: ["execution_checklist", "approval_checklist", "asset_checklist", "qa_steps"],
      template: "Create an execution checklist for {projectName}. Include required approvals, assets, content, integrations, and QA steps."
    }
  ],

  customer_ops: [
    {
      id: "reply-draft",
      icon: "💬",
      label: "Reply",
      badge: "Draft",
      actionType: "guided",
      safetyLevel: "confirmation_required",
      frontendOwnerPage: "operations-centers",
      destinations: ["chat-preview", "operations-centers", "task", "governance"],
      sourceTypes: ["customer_thread", "support_notes", "policy_doc", "faq_source", "current_chat", "manual_input"],
      outputTypes: ["reply_draft", "empathetic_response", "next_step_note", "escalation_note"],
      template: "Draft a safe customer reply for {projectName}. Do not send it. Include empathy, answer, next step, and escalation note if needed."
    },
    {
      id: "ticket",
      icon: "🎫",
      label: "Draft Ticket",
      badge: "Draft",
      actionType: "guided",
      safetyLevel: "confirmation_required",
      frontendOwnerPage: "operations-centers",
      destinations: ["chat-preview", "operations-centers", "task", "workflows"],
      sourceTypes: ["customer_thread", "support_notes", "order_case_summary", "current_chat", "manual_input"],
      outputTypes: ["ticket_draft", "issue_summary", "priority_note", "missing_information"],
      template: "Prepare a ticket draft for {projectName}. Include issue summary, priority, owner, customer impact, and missing information."
    },
    {
      id: "sla",
      icon: "⏳",
      label: "SLA",
      badge: "Risk",
      actionType: "preview",
      safetyLevel: "review_only",
      frontendOwnerPage: "operations-centers",
      destinations: ["chat-preview", "operations-centers", "task", "workflows"],
      sourceTypes: ["customer_thread", "sla_policy", "support_notes", "current_chat", "manual_input"],
      outputTypes: ["sla_risk_review", "urgency_flags", "escalation_needs", "safe_next_actions"],
      template: "Review SLA or response risk for this customer context. Flag urgency, escalation needs, and safe next actions."
    },
    {
      id: "summary",
      icon: "☷",
      label: "Summary",
      badge: "CX",
      actionType: "guided",
      safetyLevel: "review_only",
      frontendOwnerPage: "operations-centers",
      destinations: ["chat-preview", "operations-centers", "workflows", "sales-crm-draft"],
      sourceTypes: ["customer_thread", "support_notes", "current_chat", "manual_input"],
      outputTypes: ["thread_summary", "sentiment_review", "open_questions", "response_context"],
      template: "Summarize the customer context for {projectName}. Include issue, sentiment, open questions, risk, and next response."
    }
  ],

  sales_crm: [
    {
      id: "sales-pitch",
      icon: "💼",
      label: "Pitch",
      badge: "Sales",
      actionType: "guided",
      safetyLevel: "review_only",
      frontendOwnerPage: "workflows",
      destinations: ["chat-preview", "workflows", "content-studio", "sales-crm-draft"],
      sourceTypes: ["lead_context", "sales_notes", "product_data", "offer_data", "proof_points", "manual_input"],
      outputTypes: ["sales_pitch", "value_proposition", "pain_solution_map", "cta_note"],
      template: "Create a sales pitch for {projectName}. Include value proposition, customer pain, proof, offer, CTA, and follow-up note."
    },
    {
      id: "follow-up",
      icon: "↩",
      label: "Follow-up",
      badge: "Email",
      actionType: "guided",
      safetyLevel: "confirmation_required",
      frontendOwnerPage: "workflows",
      destinations: ["chat-preview", "content-studio", "workflows", "sales-crm-draft"],
      sourceTypes: ["lead_context", "meeting_notes", "sales_notes", "offer_data", "manual_input"],
      outputTypes: ["follow_up_email", "follow_up_sequence", "value_reminder", "next_step_prompt"],
      template: "Draft a sales follow-up for {projectName}. Include context, value reminder, question, CTA, and next step."
    },
    {
      id: "objections",
      icon: "❓",
      label: "Objection",
      badge: "Sales",
      actionType: "guided",
      safetyLevel: "review_only",
      frontendOwnerPage: "workflows",
      destinations: ["chat-preview", "workflows", "content-studio", "governance"],
      sourceTypes: ["lead_context", "sales_notes", "product_data", "proof_points", "objection_notes", "manual_input"],
      outputTypes: ["objection_handling", "proof_needed", "safe_answers", "next_action"],
      template: "Prepare objection handling for {projectName}. Include likely objections, safe answers, proof needed, and next action."
    },
    {
      id: "lead-brief",
      icon: "◎",
      label: "Lead Brief",
      badge: "CRM",
      actionType: "guided",
      safetyLevel: "confirmation_required",
      frontendOwnerPage: "workflows",
      destinations: ["chat-preview", "workflows", "operations-centers", "sales-crm-draft"],
      sourceTypes: ["lead_context", "crm_profile_summary", "sales_notes", "customer_notes", "manual_input"],
      outputTypes: ["lead_brief", "fit_summary", "opportunity_notes", "risk_notes", "outreach_recommendation"],
      template: "Create a lead brief for {projectName}. Include profile, need, fit, opportunity, risks, and recommended outreach."
    }
  ]
};

function getSpecialistTools(specialistId = "") {
  return TOOL_DOCK_BY_SPECIALIST[specialistId] || TOOL_DOCK_BY_SPECIALIST.operations;
}

export function getAiToolDockTools({ specialistId = "", teamMode = "solo", limit = 9 } = {}) {
  const tools = teamMode === "team"
    ? [
      ...TOOL_DOCK_BY_SPECIALIST.strategist.slice(0, 2),
      ...TOOL_DOCK_BY_SPECIALIST.writer.slice(0, 2),
      ...TOOL_DOCK_BY_SPECIALIST.operations.slice(0, 2)
    ]
    : getSpecialistTools(specialistId);

  return Number.isFinite(limit) ? tools.slice(0, limit) : tools.slice();

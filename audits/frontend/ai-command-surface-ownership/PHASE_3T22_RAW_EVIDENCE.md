# PHASE 3T.22 — Raw Evidence

## Git baseline
?? audits/frontend/ai-command-surface-ownership/

cdcc82c Close Media Studio ownership usability pass
3cacc00 Clarify Media Studio usability guidance
520d4ce Add Media Studio usability guidance copy plan
90b0aef Add Media Studio full media generation QA decision
4cf419f Add Media Studio full media generation boundary plan
80f1f93 Add Media Studio audio video readiness ownership audit
5052a6b Add Integrations browser QA readiness decision
1727799 Add Integrations provider readiness patch plan
27c440a Add Integrations provider readiness cleanup plan
b9e52bb Add Integrations provider readiness ownership audit

## File sizes
   5653 public/control-center/pages/ai-command.js
   3658 public/control-center/pages/media-studio-workspace.js
   3165 public/control-center/pages/library.js
   2036 public/control-center/pages/publishing.js
   2365 public/control-center/pages/workflows.js
   1489 public/control-center/pages/governance.js
   4207 public/control-center/app.js
    239 public/control-center/router.js
   2322 public/control-center/api.js
    201 public/control-center/shared-context.js
    740 public/control-center/automation-engine.js
  26075 total

## AI Command imports / exports / route markers
1:import {
7:import { getProjectedActiveRole, getProjectedTeamMembers } from "../runtime/authority/authority-projection.js";
9:import {
15:import {
21:import {
25:import {
2319:				rerender();
2324:	rerender();
4659:export const aiCommandRoute = {
4672:	render(context) {
4818:			aiCommandRoute.render(context);
4844:		                aiCommandRoute.render(context);
4880:		                aiCommandRoute.render(context);
4901:				aiCommandRoute.render(context);
4926:                                aiCommandRoute.render(context);
4937:				aiCommandRoute.render(context);
5057:		                        aiCommandRoute.render(context);
5093:		                aiCommandRoute.render(context);
5199:                                aiCommandRoute.render(context);
5214:		                        aiCommandRoute.render(context);
5237:                                aiCommandRoute.render(context);
5261:                                aiCommandRoute.render(context);
5284:                                aiCommandRoute.render(context);
5308:                                aiCommandRoute.render(context);
5463:		                aiCommandRoute.render(context);
5635:				aiCommandRoute.render(context);
5649:				rerender: () => aiCommandRoute.render(context)

## AI Command authority / role / mode markers
7:import { getProjectedActiveRole, getProjectedTeamMembers } from "../runtime/authority/authority-projection.js";
33:const MODE_DEFS = [
84:                id: "compliance_reviewer",
87:                summary: "Claims review, approvals, safety language, and governance checks.",
88:                routeHint: "governance"
113:// Map legacy mode IDs from older sessions to new team IDs
125:	compliance_reviewer: "compliance_reviewer",
200:		cannotDo: ["Publish without explicit approval", "Override schedules", "Bypass governance gates", "Send to live channels directly"],
232:		id: "compliance_reviewer",
236:		summary: "Claims review, approval safety, publishing risk, and governance notes.",
237:		placeholder: "Ask the Compliance Reviewer to check claims, approval risks, publishing safety, and governance notes…",
238:		canHelp: ["Review marketing claims", "Flag approval risks", "Check publishing safety", "Prepare governance notes", "Identify compliance blockers"],
239:		cannotDo: ["Grant approvals directly", "Override governance gates", "Publish on behalf of approvers", "Remove flags without review"],
252:		cannotDo: ["Run workflows without confirmation", "Auto-approve tasks", "Override authority gates", "Execute backend operations directly"],
303:		{ label: "Prepare a media handoff", sub: "Package direction for the team" }
329:	compliance_reviewer: [
332:		{ label: "Prepare governance notes", sub: "Document compliance status" },
337:		{ label: "Draft a workflow handoff", sub: "Prepare for the next owner" },
357:	{ label: "What should the executive AI team focus on?", sub: "Strategy, execution, and risk review" },
366:	{ id: "ask", title: "Ask", description: "Write the request and choose the team lane." },
393:	compliance_reviewer: "CR",
402:	compliance_reviewer: "compliance_reviewer"
410:		summary: "Policy, approvals, roles, and audit controls stay destination-owned."
429:		{ id: "launch-plan", label: "Launch Plan", action: "preview", intent: "workflow", template: "Build a launch plan for {project}. Include phases, channels, owners, blockers, and next move." },
451:		{ id: "map-video-asset-needs", label: "Map video asset needs", action: "preview", intent: "task", template: "Map video asset needs for {project}. Include format, source, and production owner." }
471:		{ id: "analysis-plan", label: "Analysis Plan", action: "preview", intent: "workflow", template: "Draft an analysis plan for {project}. Define questions, datasets, cadence, and owners." },
474:	compliance_reviewer: [
476:		{ id: "approval-flags", label: "Approval Flags", action: "preview", intent: "task", template: "Check approval risks for {project}. List risk, impact, mitigation, and required owner." },
479:		{ id: "open-governance", label: "Open Governance", action: "route", route: "governance" }
482:		{ id: "timeline-draft", label: "Timeline Draft", action: "preview", intent: "workflow", template: "Draft an execution timeline for {project}. Include milestones, owners, dependencies, and review gates." },
484:		{ id: "checklist", label: "Checklist", action: "preview", intent: "task", template: "Draft an operational checklist for {project}. Include owners, dependencies, priority, and first action." },
492:		{ id: "create-ticket-draft", label: "Create Ticket Draft", action: "preview", intent: "task", template: "Create a ticket draft for {project}. Include issue, priority, owner suggestion, evidence needed, and next safe action." },
494:		{ id: "prepare-escalation", label: "Prepare Escalation", action: "preview", intent: "handoff", template: "Prepare an escalation draft for {project}. Include reason, customer impact, owner, confirmation needed, and destination team." },
503:		{ id: "pipeline-next-step", label: "Pipeline Next Step", action: "preview", intent: "task", template: "Recommend the pipeline next step for {project}. Include stage, rationale, owner, risk, and required confirmation." },
506:		{ id: "sales-handoff-draft", label: "Sales Handoff", action: "preview", intent: "handoff", template: "Prepare a sales handoff draft for {project}. Include lead context, recommended next action, owner, and confirmation needed." }
548:const AGENT_CARDS = [
602:		bestUse: "When actions span multiple pages and teams.",
636:		if (/act as the compliance reviewer/i.test(text)) return "compliance_reviewer";
700:	if (/act as the compliance reviewer/i.test(text)) return "compliance_reviewer";
769:		specialist: asString(context.specialistLabel || "Specialist") || "Specialist",
770:		specialistLabel: asString(context.specialistLabel || "Specialist") || "Specialist",
774:	return asString(template).replace(/\{(project|projectName|specialist|specialistLabel|campaign)\}/g, (_, token) => tokenMap[token] || "");
921:	return MODE_DEFS.find((item) => item.id === resolvedId) || MODE_DEFS[0];
937:			teamMode: "solo",
1128:        const firstUser = messages.find((message) => asString(message.role) === "user");
1135:                teamMode: session.teamMode,
1158:        session.teamMode = asString(record.teamMode || "solo");
1181:function buildSpecialistChatPrompt({ prompt, specialistLabel, modeLabel, projectName, language, outputLanguage, market }) {
1184:	const safeSpecialist = asString(specialistLabel || "Specialist").trim();
1189:	const teamWorkflowLines = safeMode === "Full Team"
1193:			"Name the specialist owner for each next action and destination."
1208:		...teamWorkflowLines,
1258:function destinationRouteForSpecialist(specialistId, outputType) {
1259:	const rawId = getAiRoomRoleId(specialistId || "operations");
1269:	if (id === "compliance_reviewer") return "governance";
1279:        const specialistId = getAiRoomRoleId(session?.modeId || "operations");
1302:        const looksTaskLike = /\b(task|tasks|handoff|ticket|tickets|follow-up|follow up|owner|owners|assignee|assigned|due date|priority|priorities|backlog|checklist|next task|action item|action items)\b/.test(text);
1307:        const looksGovernanceLike = /\b(compliance|governance|claim|claims|risk|risks|approval|approvals|policy|privacy|legal|safe language|safety review)\b/.test(text);
1336:        if (/governance|compliance|risk|approval/.test(outputType) || looksGovernanceLike) {
1337:                outputType = "governance";
1338:                return { outputType, destinationRoute: explicitDestination || "governance" };
1350:                        destinationRoute: explicitDestination || (session?.teamMode === "team" ? "workflows" : "campaign-studio")
1368:		governance: "Governance",
1377:function specialistTemplateForOutput({ specialist, outputType, prompt, projectName }) {
1380:	const specialistId = asString(specialist?.id || "operations");
1381:	const route = destinationRouteForSpecialist(specialistId, outputType);
1384:		specialistId,
1391:		confirmationRequired: outputType === "handoff" || specialistId === "publisher" || specialistId === "compliance_reviewer",
1400:	if (specialistId === "strategist") {
1408:					"List blockers and dependency owners",
1427:	if (specialistId === "writer") {
1461:	if (specialistId === "media") {
1481:	if (specialistId === "video_lead") {
1496:	if (specialistId === "publisher") {
1516:	if (specialistId === "ads") {
1544:	if (specialistId === "analyst") {
1558:	if (specialistId === "compliance_reviewer") {
1566:				"Prepare governance notes",
1574:	if (specialistId === "customer_ops") {
1582:				"Avoid promising refunds, replacements, or timelines until the owning team confirms them."
1593:			nextStep: "Review the draft, confirm the destination team, then route through support, sales, or operations.",
1605:	if (specialistId === "sales_crm") {
1610:			mainOutput: "Use this as a sales planning draft. Confirm CRM context and owner before sending outreach or changing pipeline status.",
1619:				"Stop condition: pause when the lead opts out or owner confirms no fit."
1630:			nextStep: "Review the lead fit, confirm owner, then route the handoff to operations or the CRM surface.",
1642:	if (specialistId === "operations") {
1647:				summary: "Workflow draft prepared with stage owners and checkpoints.",
1660:			summary: "Operational plan drafted with next tasks, owners, and route.",
1663:				"Assign suggested owners",
1675:	const teamMode = session.teamMode === "team";
1676:	const specialist = teamMode
1688:	const base = specialistTemplateForOutput({
1689:		specialist,
1695:	if (!teamMode) return base;
1699:		specialistId: "team",
1701:		summary: `Full team ${outputType.replace("_", " ")} preview prepared for ${projectName || "current project"}.`,
1718:		nextSafeAction: "Review the team draft, confirm owners, then route draft context to the destination workspace",
1735:function buildPreviewText(output, specialistLabel) {
1739:		`Specialist: ${specialistLabel}`,
1979:	const scores = MODE_DEFS.map((mode) => ({
2197:		return { title: "Campaign launch task block", owner: "Campaign Studio", steps: ["Define the campaign objective, audience, and offer.", "Choose channels and budget based on current intelligence.", "List required assets and publishing dependencies before launch."] };
2200:		return { title: "Content plan task block", owner: "Content Studio", steps: ["Use the strongest content pattern as the starting template.", "Map posts by platform, hook, format, and CTA.", "Route approved items into Publishing for scheduling."] };
2203:		return { title: "Content repair task block", owner: "Content Studio", steps: ["Select the weakest items from Insights.", "Rewrite hooks, sharpen CTAs, and adjust format-platform fit.", "Republish only after updated versions are approved."] };
2206:		return { title: "Integration recovery task block", owner: "Integrations", steps: ["Reconnect critical analytics and performance feeds first.", "Test each integration after reconnect and sync current data.", "Return to Insights to confirm coverage improves."] };
2208:	return { title: "Execution task block", owner: "Workflows", steps: ["Confirm the goal and required output.", "Identify which workspace owns the work.", "Move into the correct page and execute the first step."] };
2354:	governance: "Governance",
2376:	governance: "compliance_reviewer",
2391:	compliance: "compliance_reviewer",
2417:	govern: "governance",
2473:	return ["team", "full-team", "fullteam", "multi-specialist", "team-mode"].includes(clean) ? "team" : "solo";
2508:	const specialistId = normalizeAiInboundSpecialistId(preview.specialistId || preview.specialist_id || normalized.suggestedSpecialist, normalized.suggestedSpecialist);
2516:		specialistId,
2569:	const explicitSpecialist = firstAiInboundId(payload.specialist, payload.specialist_id);
2575:		draftContext.specialist ||
2576:		draftContext.specialist_id ||
2591:	)) || `Review this ${sourceLabel} handoff for ${projectLabel}. Identify the right specialist, summarize the context, produce a review-ready draft, and recommend the next safe route. Do not execute publishing, task creation, CRM updates, customer replies, workflow runs, or backend actions.`;
2608:	const teamMode = normalizeAiInboundTeamMode(firstAiInboundId(payload.teamMode, payload.team_mode, draftContext.teamMode, draftContext.team_mode));
2622:		teamMode,
2646:	session.teamMode = normalized.teamMode || "solo";
2665:			teamMode: session.teamMode
2673:		teamMode: normalized.teamMode,
2752:		role: "user",
2761:		role: "assistant",
2794:  if (!projectedMembers.length) return AGENT_CARDS;
2797:    const id = asString(member.role || member.id).toLowerCase();
2799:      AGENT_CARDS.find((agent) => agent.id === id) ||
2800:      AGENT_CARDS.find((agent) => agent.id === "operations") ||
2801:      AGENT_CARDS[0] ||
2807:      name: asString(member.name || fallback.name || member.role || "AI Specialist"),
2808:      role: asString(member.role || fallback.role || id),
2810:      bestUse: asString(member.bestUse || member.best_use || fallback.bestUse || "Use when this specialist owns the next step."),
2888:			<div class="ctrl-room-section-label">Choose your AI specialist</div>
2889:			<div class="ctrl-room-team">
2890:				${MODE_DEFS.map((agent) => `
2892:						class="ctrl-team-card${agent.id === session.modeId ? " is-active" : ""}"
2894:						data-ctrl-mode="${escapeHtml(agent.id)}"
2895:						title="${escapeHtml(agent.summary)}"
2897:						<span class="ctrl-team-icon">${agent.icon}</span>
2898:						<span class="ctrl-team-name">${escapeHtml(agent.label)}</span>
2899:						${agent.id === session.modeId ? `<span class="ctrl-team-active-dot"></span>` : ""}
3018:function renderCleanResponse(response, escapeHtml, ownerId) {
3081:					<div class="ctrl-response-section-label">Task block — ${escapeHtml(humanizeValue(taskBlock.owner, "System"))}</div>
3094:							<button class="ctrl-route-btn" type="button" data-ctrl-route="${index}" data-ctrl-route-owner="${escapeHtml(ownerId || "")}" title="${escapeHtml(item.reason)}">
3115:				<div class="ctrl-empty-body">Choose a specialist above, pick a suggested prompt, or write your own command and hit Send.</div>
3122:		if (message.role === "user") {
3134:				<div class="ctrl-msg-agent-icon" title="${escapeHtml(mode.label)}">${mode.icon}</div>
3136:					<div class="ctrl-msg-ai-agent">${escapeHtml(mode.label)} · ${escapeHtml(formatTime(message.createdAt))}</div>
3182:									<span class="ctrl-recent-agent">${mode.icon}</span>
3213:		.filter((msg) => msg.role === "assistant" && asString(msg.response?.outputType || msg.response?.output_type))
3276:	return asArray(session.messages).slice().reverse().find((item) => item.role === "user") || null;
3280:	return asArray(session.messages).slice().reverse().find((item) => item.role === "assistant") || null;
3288:        const specialist = session.teamMode === "team"
3289:                ? { id: "team", label: "Full Team" }
3294:                        const role = asString(message.role || "");
3295:                        const label = role === "user"
3297:                                : asString(message.specialistLabel || specialist.label || "Specialist");
3319:                assistantText ? `Latest specialist answer: ${assistantText}` : "",
3328:                specialistId: specialist.id || session.modeId,
3329:                specialistLabel: specialist.label || "Specialist",
3330:                teamMode: session.teamMode,
3348:                `Specialist: ${context.specialistLabel}`,
3408:			command: `Review the critical readiness gaps for ${aiContext.projectName || "this project"} and produce a fix plan with owners, order, and dependencies.`,
3435:			reason: "A clear campaign context helps every specialist agent generate more precise outputs.",
3476:      normalize(item?.id || item?.role || item?.key || item?.name) === requestedId
3478:    definitions.find((item) => normalize(item?.id || item?.role || item?.key) === "strategist") ||
3491:function getAiRoomInitials(specialist) {
3492:	const id = getAiRoomRoleId(specialist?.id);
3494:	return asString(specialist?.label || "AI")
3555:	if (session?.teamMode === "team") return tool.intent === "task" ? "task-center" : "workflows";
3570:	if (/review|check|compliance|readiness|governance/i.test(asString(tool.label))) return "Review";
3581:	return "Prepare a review-ready output for the selected specialist lane.";
3593:		<div class="aicmd-room-team-chain" aria-label="Full team orchestration chain">
3603:	const modeLabel = session.teamMode === "team" ? "Full Team" : "Solo Specialist";
3613:				<p class="aicmd-room-subtitle mhos-context-description">One specialist or the full team turns requests into review-ready drafts, tasks, and handoffs.</p>
3674:				<span class="aicmd-room-member-role">${escapeHtml(item.status)} - destination-owned authority</span>
3680:	const teamBanner = session.teamMode === "team" ? `
3681:		<div class="aicmd-room-team-mode-card">
3689:		<aside class="aicmd-v2-left aicmd-room-team-panel">
3697:			<div class="aicmd-v2-team-toggle aicmd-room-mode-switch" role="group" aria-label="AI team mode">
3698:				<button class="aicmd-v2-toggle-btn${session.teamMode !== "team" ? " is-active" : ""}" type="button" data-aicmdv2-team-mode="solo">
3701:				<button class="aicmd-v2-toggle-btn${session.teamMode === "team" ? " is-active" : ""}" type="button" data-aicmdv2-team-mode="team">
3705:			${teamBanner}
3706:			<div class="aicmd-v2-team-rail aicmd-room-member-list">
3708:					const roleId = getAiRoomRoleId(spec.id);
3709:					const isActive = spec.id === session.modeId && session.teamMode === "solo";
3710:					const isTeamActive = session.teamMode === "team";
3712:					const backendAlias = AI_ROOM_BACKEND_ROLE_ALIASES[roleId];
3713:					const roleLine = `${spec.status || "Ready"} - ${spec.position || spec.label || "Specialist"}${backendAlias ? ` - Backend: ${backendAlias}` : ""}`;
3716:							class="aicmd-v2-spec-btn aicmd-room-member${isActive ? " is-active" : ""}${isTeamActive ? " is-team-active" : ""}"
3718:							data-aicmdv2-specialist="${escapeHtml(spec.id)}"
3719:							data-role="${escapeHtml(roleId)}"
3725:								<span class="aicmd-room-member-role">${escapeHtml(roleLine)}</span>
3733:			<div class="aicmd-room-planned-specialists" aria-label="Additional specialists planned">
3734:				<span class="aicmd-room-planned-title">Additional specialists planned</span>
3742:	if (session.teamMode === "team") {
3745:			<div class="aicmd-v2-profile aicmd-v2-team-profile">
3750:						<p class="aicmd-v2-profile-purpose">Coordinates specialists into one review-ready brief, workflow, or handoff.</p>
3761:	const specialistTools = getAiToolDockTools({ specialistId: spec.id, teamMode: "solo", limit: 3 });
3774:				${specialistTools.slice(0, 3).map((tool) => `<span class="aicmd-v2-strength-chip is-tool">${escapeHtml(tool.label)}</span>`).join("")}
3782:        const isTeam = session.teamMode === "team";
3787:        const label = asString(spec?.label || "AI specialist");
3791:        const roleId = getAiRoomRoleId(session.modeId);
3792:        if (roleId === "content_writer") return `${label} is drafting your content...`;
3793:        if (roleId === "media_director" || roleId === "video_lead") return `${label} is preparing creative direction...`;
3794:        if (roleId === "operations" || roleId === "customer_ops") return `${label} is preparing your task handoff...`;
3795:        if (roleId === "compliance") return `${label} is checking safety and compliance...`;
3796:        if (roleId === "seo") return `${label} is reviewing insights and signals...`;
3797:        if (roleId === "publisher") return `${label} is preparing publishing guidance...`;
3806:	const isTeam = session.teamMode === "team";
3808:	const roleLine = isTeam
3815:		<div class="aicmd-room-conversation-head" data-role="${escapeHtml(isTeam ? "team" : getAiRoomRoleId(spec.id))}">
3820:				<p>${escapeHtml(roleLine)}</p>
3838:	if (/task|ticket|checklist|owner_map|priority/.test(haystack)) return "task";
3868:		specialistId: toolModeId,
3869:		teamMode: session.teamMode,
3884:		<div class="aicmd-v2-tabs" role="tablist" aria-label="AI workspace tabs">
3890:					role="tab"
3903:	const specialistLabel = session.teamMode === "team" ? "Full Team" : getPhase1SpecialistById(session.modeId)?.label || "Specialist";
3904:	const roleId = session.teamMode === "team" ? "team" : getAiRoomRoleId(session.modeId);
3907:		<section class="aicmd-v2-tools aicmd-room-tools" data-role="${escapeHtml(roleId)}">
3910:					<h3 class="aicmd-v2-tools-title">${escapeHtml(specialistLabel)} Quick Actions</h3>
3911:					<span class="aicmd-v2-tools-subtitle">Fast specialist actions for the current output. Review-only: prepares drafts, previews, or handoffs without backend execution.</span>
3983:		const placeholder = "Message the AI specialist...";
3984:		const isTeam = session.teamMode === "team";
3990:		const roleId = isTeam ? "team" : getAiRoomRoleId(spec.id);
3994:			<div class="aicmd-v2-composer aicmd-room-composer aicmd-chatgpt-composer" data-role="${escapeHtml(roleId)}">
4049:					<span>Ask a specialist or send the chat response to preview.</span>
4057:	const specialist = session.teamMode === "team"
4058:		? { id: "team", label: "Full Team" }
4059:		: getPhase1SpecialistById(preview.specialistId || session.modeId);
4075:					<p class="aicmd-v2-preview-subtitle">${escapeHtml(humanizeValue(preview.sourcePrompt, "Review the generated specialist output."))}</p>
4082:				<span class="aicmd-v2-preview-chip"><strong>Specialist:</strong> ${escapeHtml(specialist.label || "Specialist")}</span>
4140:	const specialist = session.teamMode === "team"
4141:		? { id: "team", label: "Full Team" }
4142:		: getPhase1SpecialistById(preview.specialistId || session.modeId);
4165:							<div class="aicmd-room-output-tabs mhos-workflow-chain" role="tablist" aria-label="Output workspace tabs">
4171:										role="tab"
4192:						<span>${escapeHtml(specialist.label || "Specialist")}</span>
4292:        const isTeam = session.teamMode === "team";
4293:        const selectedSpec = isTeam ? { id: "team", label: "Full Team", position: "Team workflow" } : getPhase1SpecialistById(session.modeId);
4294:        const selectedRoleId = isTeam ? "team" : getAiRoomRoleId(selectedSpec.id);
4296:        const selectedModeLabel = isTeam ? "Team workflow" : "Solo specialist";
4300:                const role = asString(message.role || "");
4301:                const messageRoleId = getAiRoomRoleId(message.specialistId || message.modeId || "");
4302:                if (role === "user") {
4303:                        return isTeam ? message.teamMode === "team" || messageRoleId === "team" : messageRoleId === selectedRoleId;
4305:                if (role === "assistant") {
4306:                        return isTeam ? messageRoleId === "team" : messageRoleId === selectedRoleId;
4312:                const producerId = getAiRoomRoleId(item.specialistId || "");
4313:                return isTeam ? producerId === "team" : producerId === selectedRoleId;
4317:                const producerId = getAiRoomRoleId(item.specialistId || "");
4318:                return producerId && producerId !== selectedRoleId && producerId !== "team";
4331:        const bridgeSpecialistId = getAiRoomRoleId(bridgeContext.specialistId || "");
4334:                bridgeContext.specialistLabel &&
4338:                specialistId: session.modeId,
4339:                teamMode: session.teamMode,
4343:        const nextPrompts = session.teamMode === "team"
4354:                const role = asString(message.role || "");
4355:                const isUser = role === "user";
4356:                const label = isUser ? "You" : asString(message.specialistLabel || selectedLabel || "Specialist");

## AI Command handoff / media / workflow / publishing markers
23:} from "../asset-library.js";
39:                routeHint: "campaign-studio"
46:                routeHint: "content-studio"
49:                id: "media",
53:                routeHint: "media-studio"
60:                routeHint: "media-studio"
63:                id: "publisher",
66:                summary: "Publishing readiness, schedule review, and handoff preparation.",
67:                routeHint: "publishing"
80:                summary: "SEO signals, performance data, content insights, and traffic patterns.",
87:                summary: "Claims review, approvals, safety language, and governance checks.",
88:                routeHint: "governance"
94:                summary: "Tasks, timelines, handoffs, approvals, and execution plans.",
95:                routeHint: "workflows"
108:                summary: "Lead qualification, outreach drafts, follow-up cadence, and CRM handoff notes.",
109:                routeHint: "workflows"
116:	campaign: "strategist",
117:	content: "writer",
118:	designer: "media",
119:	media_director: "media",
120:	media_planner: "media",
124:	publisher: "publisher",
146:		placeholder: "Ask the Strategist to plan a campaign, map launch phases, review channel priorities, or define the offer strategy…",
147:		canHelp: ["Draft campaign plans", "Prioritize next actions", "Map launch sequences", "Advise on offer strategy", "Prepare channel briefs"],
148:		cannotDo: ["Publish campaigns directly", "Execute workflows automatically", "Approve content", "Set live budgets"],
159:		placeholder: "Ask the Content Writer to draft captions, hooks, landing copy, or campaign messages…",
160:		canHelp: ["Draft captions and hooks", "Write email copy", "Create landing page text", "Prepare publisher handoff", "Suggest message variants"],
161:		cannotDo: ["Publish directly", "Approve risky claims", "Invent unsupported facts", "Run workflows automatically"],
163:		safetyNote: "Drafts require review before publishing. Cannot approve or publish without confirmation.",
167:		id: "media",
173:		canHelp: ["Write creative briefs", "Advise on visual direction", "Map format requirements", "Review brand alignment", "Prepare media handoffs"],
174:		cannotDo: ["Generate images directly", "Upload assets without review", "Approve without confirmation", "Execute media jobs"],
186:		canHelp: ["Write video scripts", "Plan short-form strategy", "Define motion direction", "Map video asset requirements", "Prepare video briefs"],
187:		cannotDo: ["Generate video directly", "Upload footage without review", "Approve without confirmation", "Run media jobs automatically"],
189:		safetyNote: "Scripts and direction only. Video generation requires explicit backend action and approval.",
193:		id: "publisher",
197:		summary: "Publishing readiness, schedule review, and handoff preparation.",
198:		placeholder: "Ask the Publisher to review publishing readiness, check scheduling, or prepare a handoff package…",
199:		canHelp: ["Review publishing readiness", "Check scheduled jobs", "Prepare handoff packages", "Map publishing dependencies", "Flag pre-publish risks"],
200:		cannotDo: ["Publish without explicit approval", "Override schedules", "Bypass governance gates", "Send to live channels directly"],
202:		safetyNote: "Publishing always requires explicit approval. No live publishing from AI guidance alone.",
211:		placeholder: "Ask the Ads Optimizer to draft ad copy, review targeting angles, or plan a paid campaign structure…",
212:		canHelp: ["Draft ad concepts and copy", "Review targeting angles", "Plan paid campaign structure", "Suggest creative variants", "Map platform-specific strategy"],
215:		safetyNote: "Ad concepts and copy only. Live ad actions require platform integration and explicit approval.",
223:		summary: "SEO signals, performance data, content insights, and traffic patterns.",
224:		placeholder: "Ask the SEO & Insights Analyst to review performance, suggest SEO improvements, or identify top content patterns…",
225:		canHelp: ["Review SEO signals", "Analyze content performance", "Identify traffic patterns", "Suggest keyword improvements", "Map data coverage gaps"],
236:		summary: "Claims review, approval safety, publishing risk, and governance notes.",
237:		placeholder: "Ask the Compliance Reviewer to check claims, approval risks, publishing safety, and governance notes…",
238:		canHelp: ["Review marketing claims", "Flag approval risks", "Check publishing safety", "Prepare governance notes", "Identify compliance blockers"],
239:		cannotDo: ["Grant approvals directly", "Override governance gates", "Publish on behalf of approvers", "Remove flags without review"],
249:		summary: "Tasks, timelines, handoffs, approvals, and execution plans.",
250:		placeholder: "Ask the Operations Lead to turn this into tasks, workflow steps, or handoffs…",
251:		canHelp: ["Create task plans", "Map execution sequences", "Prepare workflow handoffs", "Review execution health", "Identify operational blockers"],
252:		cannotDo: ["Run workflows without confirmation", "Auto-approve tasks", "Override authority gates", "Execute backend operations directly"],
254:		safetyNote: "Task plans and handoffs only. Workflow execution requires explicit user confirmation.",
275:		summary: "Lead qualification, outreach drafts, follow-up cadence, CRM profile summaries, and sales handoff notes.",
276:		placeholder: "Ask the Sales / CRM Lead to qualify a lead, draft outreach, plan follow-ups, summarize CRM context, or prepare a sales handoff for review…",
277:		canHelp: ["Qualify lead context", "Draft outreach", "Plan follow-up sequences", "Summarize CRM profiles", "Prepare sales handoffs"],
289:		{ label: "Draft a campaign brief", sub: "Map objective, audience, and channels" },
291:		{ label: "Suggest the next campaign move", sub: "Based on current project state" }
294:		{ label: "Draft campaign captions", sub: "For the active campaign" },
296:		{ label: "Prepare a Publisher handoff", sub: "Package ready content for review" },
299:	media: [
300:		{ label: "Write a creative brief", sub: "For the next campaign visual" },
301:		{ label: "Review brand consistency", sub: "Flag misaligned assets" },
302:		{ label: "Map format requirements", sub: "By platform and campaign phase" },
303:		{ label: "Prepare a media handoff", sub: "Package direction for the team" }
306:		{ label: "Write a reel script", sub: "For the current campaign" },
307:		{ label: "Plan short-form content", sub: "Map next 4 video concepts" },
308:		{ label: "Outline motion direction", sub: "Align visuals with campaign tone" },
309:		{ label: "Map video asset needs", sub: "By platform and format" }
311:	publisher: [
312:		{ label: "Review publishing readiness", sub: "Check what is ready to publish" },
313:		{ label: "Flag pre-publish risks", sub: "Identify what needs review first" },
315:		{ label: "Prepare a handoff package", sub: "For the approver review" }
318:		{ label: "Draft ad concepts", sub: "For the current campaign" },
321:		{ label: "Plan paid campaign structure", sub: "Objective, audience, creative, budget" }
325:		{ label: "Analyze content performance", sub: "What is working and what is not" },
330:		{ label: "Check claims for approval", sub: "Review all marketing claims" },
331:		{ label: "Flag publishing risks", sub: "Identify blockers before release" },
332:		{ label: "Prepare governance notes", sub: "Document compliance status" },
333:		{ label: "Review approval requirements", sub: "What needs sign-off" }
336:		{ label: "Turn this into tasks", sub: "Break down into action items" },
337:		{ label: "Draft a workflow handoff", sub: "Prepare for the next owner" },
351:		{ label: "Prepare sales handoff", sub: "Route context to operations" }
359:	{ label: "Prepare a full handoff sequence", sub: "Strategy, creative, compliance, publishing, ops" },
367:	{ id: "draft", title: "Draft", description: "Generate guidance, copy, task, or handoff material." },
376:	{ id: "task", label: "Task", helper: "Task-shaped output" },
377:	{ id: "workflow", label: "Draft Workflow", helper: "Operating sequence" },
378:	{ id: "handoff", label: "Prepare Handoff", helper: "Destination package" },
388:	media: "MD",
390:	publisher: "PB",
401:	media: "designer",
410:		summary: "Policy, approvals, roles, and audit controls stay destination-owned."
428:		{ id: "campaign-angle-generator", label: "Campaign Angle Generator", action: "preview", intent: "guidance", template: "Generate campaign angles for {project}. Include audience tension, promise, channel fit, and strongest first test." },
429:		{ id: "launch-plan", label: "Launch Plan", action: "preview", intent: "workflow", template: "Build a launch plan for {project}. Include phases, channels, owners, blockers, and next move." },
430:		{ id: "funnel-mapping", label: "Funnel Mapping", action: "preview", intent: "guidance", template: "Map the funnel for {project}. Include awareness, consideration, conversion, retention, and handoff points." },
431:		{ id: "prioritize-next-move", label: "Priority Sort", action: "preview", intent: "task", template: "Prioritize the next moves for {project}. Rank by impact, urgency, dependencies, and safest first action." }
436:		{ id: "cta-refiner", label: "CTA Refiner", action: "preview", intent: "task", template: "Refine CTA options for {project}. Provide German variants for awareness, consideration, and action stages." },
437:		{ id: "publisher-package", label: "Publisher Package", action: "preview", intent: "handoff", template: "Prepare a Publisher handoff for {project}. Include German copy package, CTA, notes, and remaining checks." }
439:	media: [
440:		{ id: "creative-brief-builder", label: "Creative Brief Builder", action: "preview", intent: "media", template: "Prepare a creative brief for {project}. Include concept, visual rules, subject, brand constraints, and production notes." },
441:		{ id: "format-mapper", label: "Format Mapper", action: "preview", intent: "guidance", template: "Map required creative formats for {project}. Include platform, aspect ratio, asset type, and usage context." },
442:		{ id: "asset-checklist", label: "Asset Checklist", action: "preview", intent: "task", template: "Create an asset checklist for {project}. List must-have files, missing references, usage context, and priority." },
444:		{ id: "open-media-studio", label: "Send to Media Studio", action: "route", route: "media-studio" }
449:		{ id: "build-storyboard", label: "Build storyboard", action: "preview", intent: "workflow", template: "Build storyboard beats for {project}. Sequence shots and key transitions." },
451:		{ id: "map-video-asset-needs", label: "Map video asset needs", action: "preview", intent: "task", template: "Map video asset needs for {project}. Include format, source, and production owner." }
453:	publisher: [
454:		{ id: "publishing-checklist", label: "Publishing Checklist", action: "preview", intent: "handoff", template: "Build a publishing checklist for {project}. Include German copy, assets, claims checks, and channel readiness." },
455:		{ id: "final-packaging", label: "Final Packaging", action: "preview", intent: "handoff", template: "Prepare a final publishing package for {project}. Include copy, CTA, asset notes, approvals, and destination channel." },
457:		{ id: "schedule-draft", label: "Schedule Draft", action: "preview", intent: "workflow", template: "Prepare a publishing schedule draft for {project}. Include channel cadence, dependencies, and review gates." },
458:		{ id: "open-publishing", label: "Open Publishing", action: "route", route: "publishing" }
463:		{ id: "test-ideas", label: "Test Ideas", action: "preview", intent: "task", template: "Suggest paid test ideas for {project}. Provide hypotheses, segments, creative variables, and measurement notes." },
468:		{ id: "keyword-intent", label: "Keyword Intent", action: "preview", intent: "guidance", template: "Suggest keyword intent opportunities for {project}. Include Germany-market intent, content mapping, and priority." },
470:		{ id: "opportunity-summary", label: "Opportunity Summary", action: "preview", intent: "task", template: "Summarize SEO and insight opportunities for {project}. Focus on conversion, traffic quality, and content fit." },
471:		{ id: "analysis-plan", label: "Analysis Plan", action: "preview", intent: "workflow", template: "Draft an analysis plan for {project}. Define questions, datasets, cadence, and owners." },
476:		{ id: "approval-flags", label: "Approval Flags", action: "preview", intent: "task", template: "Check approval risks for {project}. List risk, impact, mitigation, and required owner." },
477:		{ id: "safety-checklist", label: "Safety Checklist", action: "preview", intent: "handoff", template: "Prepare a safety checklist for {project}. Include policy checks, evidence required, and approval notes." },
478:		{ id: "publish-readiness", label: "Publish Readiness", action: "preview", intent: "handoff", template: "Review publish readiness for {project}. Confirm what needs human approval before release." },
479:		{ id: "open-governance", label: "Open Governance", action: "route", route: "governance" }
482:		{ id: "timeline-draft", label: "Timeline Draft", action: "preview", intent: "workflow", template: "Draft an execution timeline for {project}. Include milestones, owners, dependencies, and review gates." },
483:		{ id: "handoff-routing", label: "Handoff Routing", action: "preview", intent: "handoff", template: "Prepare handoff routing for {project}. Include source, destination, decision gates, and required confirmations." },
484:		{ id: "checklist", label: "Checklist", action: "preview", intent: "task", template: "Draft an operational checklist for {project}. Include owners, dependencies, priority, and first action." },
486:		{ id: "open-workflows", label: "Open Workflows / Operations", action: "route", route: "workflows" }
492:		{ id: "create-ticket-draft", label: "Create Ticket Draft", action: "preview", intent: "task", template: "Create a ticket draft for {project}. Include issue, priority, owner suggestion, evidence needed, and next safe action." },
494:		{ id: "prepare-escalation", label: "Prepare Escalation", action: "preview", intent: "handoff", template: "Prepare an escalation draft for {project}. Include reason, customer impact, owner, confirmation needed, and destination team." },
496:		{ id: "route-support-sales-ops", label: "Route to Support / Sales / Operations", action: "preview", intent: "handoff", template: "Prepare routing guidance for {project}. Decide whether the customer item belongs with Support, Sales, or Operations, and explain the review gate." }
501:		{ id: "follow-up-sequence", label: "Follow-up Sequence", action: "preview", intent: "workflow", template: "Build a follow-up sequence for {project}. Include timing, message angle, CTA, stop condition, and confirmation requirements." },
503:		{ id: "pipeline-next-step", label: "Pipeline Next Step", action: "preview", intent: "task", template: "Recommend the pipeline next step for {project}. Include stage, rationale, owner, risk, and required confirmation." },
505:		{ id: "influencer-lead-plan", label: "Influencer Lead Plan", action: "preview", intent: "workflow", template: "Prepare an influencer lead plan for {project}. Include target profile, outreach angle, qualification criteria, and handoff path." },
506:		{ id: "sales-handoff-draft", label: "Sales Handoff", action: "preview", intent: "handoff", template: "Prepare a sales handoff draft for {project}. Include lead context, recommended next action, owner, and confirmation needed." }
512:	{ icon: "🚀", label: "Launch Campaign", sub: "Build a campaign plan", template: "Build a launch campaign for {project}. Map the channels, offer, phases, and required assets." },
513:	{ icon: "✍️", label: "Generate Content", sub: "Write hooks, captions & scripts", template: "Generate content for {project}. Create hooks, caption ideas, and a reel script for the next product push." },
514:	{ icon: "📊", label: "Analyze Performance", sub: "Review what's working", template: "Analyze current performance for {project}. What content, campaigns, and channels are working best right now?" },
523:	{ id: "content", label: "Content" },
524:	{ id: "campaign", label: "Campaign" },
526:	{ id: "asset", label: "Asset" },
535:	{ id: "campaign", label: "Campaign" },
554:		suggestedPrompt: "Act as Strategist and propose the next campaign move based on current readiness and integrations."
560:		bestUse: "When campaigns need content batches fast.",
561:		suggestedPrompt: "Act as Writer and generate content angles for the current project and active campaign."
566:		purpose: "Define creative direction, visual hierarchy, and asset guidance.",
568:		suggestedPrompt: "Act as Designer and propose creative directions tied to current campaign goals."
571:		id: "media",
573:		purpose: "Align media formats with channels, cadence, and readiness.",
575:		suggestedPrompt: "Act as Media Planner and map media needs by platform for this launch cycle."
601:		purpose: "Translate intent into executable workflows and handoffs.",
630:		if (/act as the content writer/i.test(text)) return "writer";
631:		if (/act as the media director/i.test(text)) return "media";
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
694:	if (/act as the content writer/i.test(text)) return "writer";
695:	if (/act as the media director/i.test(text)) return "media";
697:	if (/act as the publisher/i.test(text)) return "publisher";
771:		campaign: asString(context.campaign || "active campaign") || "active campaign"
774:	return asString(template).replace(/\{(project|projectName|specialist|specialistLabel|campaign)\}/g, (_, token) => tokenMap[token] || "");
784:    "Prepare a handoff summary for:",
785:    "Draft a workflow sequence for:",
786:    "Draft a task plan for:",
787:    "Build a launch campaign for:",
788:    "Generate content for:",
869:		overview.publishing_language ||
870:		overview.publish_language ||
875:	const publishLanguage = configuredPublishLanguage || "German";
885:		publishLanguage,
925:	return asString(item.label || item.title || item.page || item.query || item.campaign_name || item.name);
948:			taskMode: "free",
949:			taskType: "launch",
950:			taskProduct: "",
951:			taskChannel: "",
1129:        const titleSeed = asString(options.title || firstUser?.content || responses[0]?.prompt || "AI Team session").trim();
1191:			"Full Team workflow: Strategist -> Writer -> Media/Video -> Compliance -> Publisher -> Operations.",
1206:                `Use ${safeOutputLanguage} only for customer-facing or publishable copy such as captions, ads, emails, landing pages, final campaign text, or publishing packages.`,
1207:                "When you include publishable copy, label it clearly as publishable content and keep the explanation in the user chat language.",
1209:		"Return practical guidance and content only.",
1210:		`When drafting publishable copy, write it in ${safeOutputLanguage}.`,
1212:		"Never claim publish, approval, deletion, archival, sync, or operational runs happened.",
1224:		response.content ||
1261:	if (outputType === "workflow") return "workflows";
1262:	if (id === "strategist") return outputType === "task" ? "campaign-studio" : "workflows";
1263:	if (id === "writer") return "content-studio";
1264:	if (id === "media") return "media-studio";
1265:	if (id === "video_lead") return "media-studio";
1266:	if (id === "publisher") return "publishing";
1269:	if (id === "compliance_reviewer") return "governance";
1270:	if (id === "operations") return outputType === "task" ? "task-center" : "workflows";
1271:	if (id === "customer_ops") return outputType === "task" ? "task-center" : "operations-centers";
1272:	if (id === "sales_crm") return "workflows";
1273:	return "workflows";
1293:                outputType = activeTab === "task"
1294:                        ? "task"
1295:                        : activeTab === "workflow"
1296:                                ? "workflow"
1297:                                : activeTab === "handoff"
1298:                                        ? "handoff"
1302:        const looksTaskLike = /\b(task|tasks|handoff|ticket|tickets|follow-up|follow up|owner|owners|assignee|assigned|due date|priority|priorities|backlog|checklist|next task|action item|action items)\b/.test(text);
1303:        const looksWorkflowLike = /\b(workflow|workflows|process|sequence|phase|phases|approval flow|automation|operating loop|step-by-step|steps|dependencies|trigger|review gate|execution flow)\b/.test(text);
1304:        const looksContentLike = /\b(content|caption|captions|post|posts|email|blog|article|copy|headline|landing page|script|message|cta|product copy|social post)\b/.test(text);
1305:        const looksMediaLike = /\b(media|visual|creative|image|images|video|reel|storyboard|shot list|asset|assets|design|production|creative direction|voiceover)\b/.test(text);
1306:        const looksPublishingLike = /\b(publish|publishing|schedule|channel package|channel payload|approval-ready post|final post|ready to publish|publishing package)\b/.test(text);
1307:        const looksGovernanceLike = /\b(compliance|governance|claim|claims|risk|risks|approval|approvals|policy|privacy|legal|safe language|safety review)\b/.test(text);
1309:        const looksCampaignLike = /\b(campaign|launch|audience|offer|funnel|positioning|channel mix|campaign brief|go-to-market|go to market)\b/.test(text);
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
1346:        if (/campaign|strategy|launch/.test(outputType) || looksCampaignLike) {
1347:                outputType = "campaign";
1350:                        destinationRoute: explicitDestination || (session?.teamMode === "team" ? "workflows" : "campaign-studio")
1361:		"campaign-studio": "Campaign Studio",
1362:		"content-studio": "Content Studio",
1363:		"media-studio": "Media Studio",
1364:		publishing: "Publishing",
1368:		governance: "Governance",
1370:		"task-center": "Task Center",
1372:		workflows: "Workflows"
1391:		confirmationRequired: outputType === "handoff" || specialistId === "publisher" || specialistId === "compliance_reviewer",
1397:		confirmationNote: "Execution, approvals, and publishing require explicit confirmation in the owning workspace."
1401:		if (outputType === "task") {
1405:				summary: "Strategic task draft prepared with priorities, blockers, and operating sequence.",
1412:				nextSafeAction: "Review and refine the task draft before creating durable tasks"
1430:			title: outputType === "task" ? "Task: Draft campaign copy" : "Content Guidance: Messaging draft",
1434:				"Outcome-led hook direction for a German publishing draft",
1447:				"Use Arabic freely in the conversation; publishable copy should be reviewed in German.",
1448:				"Claims, health, or performance promises need evidence before publishing."
1457:			safetyLabel: "Claims require review before publishing. No direct publish action."
1461:	if (specialistId === "media") {
1464:			outputType: outputType === "guidance" ? "media_brief" : outputType,
1466:			summary: "Media brief prepared with visual direction, prompt ideas, and required assets.",
1474:				"Required assets and missing assets listed"
1476:			safetyLabel: "No media generation executed. Brief and routing only.",
1484:			title: outputType === "task" ? "Task: Video production plan" : "Video Brief: Hook, script, storyboard",
1496:	if (specialistId === "publisher") {
1499:			title: outputType === "handoff" ? "Handoff Preview: Publishing package" : "Publishing Draft: Readiness checklist",
1503:				"Publishing remains gated until channel, approval, and asset readiness are confirmed."
1506:				"Validate asset and copy readiness",
1507:				"Draft publish schedule by channel",
1508:				"Flag approval dependencies",
1509:				"Prepare handoff for publishing review"
1512:			safetyLabel: "Confirmation required before publish. No publish action performed."
1519:			title: outputType === "task" ? "Task: Paid test plan" : "Ads Draft: Angles and tests",
1547:			title: outputType === "task" ? "Task: Analysis plan" : "Insights Guidance: Signal review",
1566:				"Prepare governance notes",
1570:			safetyLabel: "Compliance review is advisory. Formal approval remains human-governed."
1577:			title: outputType === "task" ? "Ticket Draft: Customer operations follow-up" : "Customer Ops Draft: Thread, reply, and routing",
1608:			title: outputType === "handoff" ? "Sales Handoff" : "Sales / CRM Draft: Lead and outreach plan",
1609:			summary: "Sales and CRM draft prepared with lead qualification, outreach direction, follow-up cadence, and pipeline handoff notes.",
1630:			nextStep: "Review the lead fit, confirm owner, then route the handoff to operations or the CRM surface.",
1635:				"Route sales handoff without mutating CRM data"
1643:		if (outputType === "workflow") {
1652:					"Stage 4: Destination handoff and confirmation"
1659:			title: outputType === "handoff" ? "Handoff Preview: Operations package" : "Operations Draft: Task and handoff plan",
1660:			summary: "Operational plan drafted with next tasks, owners, and route.",
1662:				"Define immediate tasks",
1664:				"Prepare destination handoff context",
1667:			safetyLabel: "No workflow run and no backend task creation executed."
1682:		task: "task",
1683:		workflow: "workflow",
1684:		handoff: "handoff"
1700:		title: outputType === "workflow" ? "Team Workflow" : `Team ${titleCase(outputType)} Preview`,
1704:			"Writer, Media Director, and Video Lead turn strategy into message, asset, and production drafts",
1705:			"Compliance and Publisher verify claims, approvals, formatting, and release readiness",
1711:			"Media / Video: prepare creative direction, asset needs, script, storyboard, or voiceover draft",
1712:			"Compliance: flag claims, evidence needs, policy risks, and approval gates",
1713:			"Publisher: package channel-ready copy, assets, schedule notes, and publish checks",
1714:			"Customer Ops / Sales: add reply, ticket, lead, outreach, or CRM handoff drafts when relevant",
1715:			"Operations: convert the reviewed output into safe tasks, workflow draft, or handoff context"
1717:		destinationRoute: outputType === "task" ? "task-center" : "workflows",
1719:		confirmationNote: "No task, workflow, outreach, customer reply, CRM update, approval, or publishing action is executed from Full Team mode.",
1727:		task: "Task",
1728:		workflow: "Workflow",
1729:		handoff: "Handoff Preview",
1730:		media_brief: "Media Brief"
1858:	const assets = asObject(state.data.assets);
1859:	const assetCategories = getCategoryReadinessList(assets);
1901:		campaign: state.context.activeCampaign || "Not selected",
1920:		assets,
1921:		assetCategories,
1922:		approvedAssets: assetCategories
1924:			.flatMap((item) => asArray(item.approved_assets).map((assetId) => ({
1925:				asset_id: assetId,
1926:				asset_type: item.asset_type,
1927:				label: item.display_label || item.label || item.asset_type
1929:		assetBlockers: assetCategories
1932:				asset_type: item.asset_type,
1933:				label: item.display_label || item.label || item.asset_type,
1940:		topContent: asArray(insights.best_performing_content),
1941:		weakContent: asArray(insights.underperforming_content),
1962:		strategist: ["campaign", "launch campaign", "campaign plan", "marketing campaign", "market entry", "growth plan", "offer strategy", "launch plan"],
1963:		writer: ["content", "post", "caption", "blog", "script", "email", "landing page section", "reel script", "copy", "write", "hooks"],
1965:		media: ["media", "design", "visual", "creative brief", "format", "brand", "layout", "image direction", "creative direction", "image", "video", "photo", "asset", "library", "gallery", "footage", "visual assets"],
1969:		operations: ["task plan", "workflow", "handoff", "approval", "timeline", "execution plan", "route", "publish", "status", "priority", "priorities", "blocking", "blocker", "readiness", "next", "do next"],
1986:	const actionRouting = /launch|build|reconnect|connect|improve|create|fix|route|plan|publish/.test(query);
1999:	return titleCase(asString(item).replace(/^connector:/, "").replace(/^asset:/, ""));
2013:	if (lane === "content" && asString(coverage.social_insights?.status) !== "covered") {
2064:			? `${extractTopMessage(top)} is the strongest measured content item right now${top.platform ? ` on ${titleCase(top.platform)}` : ""}.`

## AI Command execution / mutation risk markers
7:import { getProjectedActiveRole, getProjectedTeamMembers } from "../runtime/authority/authority-projection.js";
26:        executeProjectAiChat,
27:        executeProjectAiGuidance
163:		safetyNote: "Drafts require review before publishing. Cannot approve or publish without confirmation.",
239:		cannotDo: ["Grant approvals directly", "Override governance gates", "Publish on behalf of approvers", "Remove flags without review"],
252:		cannotDo: ["Run workflows without confirmation", "Auto-approve tasks", "Override authority gates", "Execute backend operations directly"],
285:// Role-specific suggested prompt chips (prefill only, no auto-execute)
315:		{ label: "Prepare a handoff package", sub: "For the approver review" }
370:	{ id: "execute", title: "Execute", description: "Execution stays gated in backend-owned surfaces." },
493:		{ id: "check-sla-risk", label: "Check SLA Risk", action: "preview", intent: "guidance", template: "Check SLA risk for {project}. Flag urgency, risk level, missing runtime data, and escalation recommendation for review." },
1006:function saveLocalDraft(projectName, draftPayload) {
1012:		updatedAt: nowIso()
1029:	if (localDraft.prompt || localDraft.updatedAt) {
1030:		session.draftStatus = `Draft restored ${formatTime(localDraft.updatedAt)}`;
1036:	const saved = saveLocalDraft(projectName, {
1043:	session.draftStatus = hint || `Saved locally ${formatTime(saved.updatedAt)}`;
1069:function saveLocalOutput(projectName, outputPayload) {
1075:		updatedAt: nowIso()
1081:function getAiResponseBridgeStatus(executeProjectAiGuidanceFn) {
1082:	if (typeof executeProjectAiGuidanceFn !== "function") {
1118:function saveAiChatSession(projectName, session, options = {}) {
1140:                updatedAt: now
1169:        session.activeChatSessionCreatedAt = asString(record.createdAt || record.updatedAt || nowIso());
1211:		"Never claim actions were executed.",
1212:		"Never claim publish, approval, deletion, archival, sync, or operational runs happened.",
1304:        const looksContentLike = /\b(content|caption|captions|post|posts|email|blog|article|copy|headline|landing page|script|message|cta|product copy|social post)\b/.test(text);
1306:        const looksPublishingLike = /\b(publish|publishing|schedule|channel package|channel payload|approval-ready post|final post|ready to publish|publishing package)\b/.test(text);
1439:				"German caption version should keep the CTA direct and easy to approve."
1476:			safetyLabel: "No media generation executed. Brief and routing only.",
1540:			safetyLabel: "No budget updates or ad launches executed."
1586:				"Priority: draft priority pending runtime inbox and SLA confirmation.",
1654:				safetyLabel: "Workflow run is not started. This is a draft preview only."
1667:			safetyLabel: "No workflow run and no backend task creation executed."
1719:		confirmationNote: "No task, workflow, outreach, customer reply, CRM update, approval, or publishing action is executed from Full Team mode.",
1840:		const providerMatch = /openai|replicate|stability|runway|elevenlabs|anthropic/.test(integrationId);
1922:		approvedAssets: assetCategories
1924:			.flatMap((item) => asArray(item.approved_assets).map((assetId) => ({
1963:		writer: ["content", "post", "caption", "blog", "script", "email", "landing page section", "reel script", "copy", "write", "hooks"],
1986:	const actionRouting = /launch|build|reconnect|connect|improve|create|fix|route|plan|publish/.test(query);
2014:		notes.push("Sync social feeds to learn from real post performance.");
2017:		notes.push("Search Console not synced — SEO guidance is limited.");
2065:			: "Not enough post-level data yet to rank content winners.",
2067:			top ? `Top performer: ${extractTopMessage(top)} with ${formatCompactNumber(top.engagement ?? top.reach)} signal.` : "No top post measured yet.",
2079:			weak ? `Move ${extractTopMessage(weak)} into a rewrite workflow.` : "Audit current content for posts not converting attention to clicks.",
2080:			"Prepare next batch with performance-led hooks instead of generic posting volume."
2083:			routeSuggestion("Content Studio", "content-studio", "Rewrite weak posts and turn winning patterns into new drafts."),
2155:			routeSuggestion("Integrations", "integrations", "Connect or reconnect paid reporting platforms."),
2200:		return { title: "Content plan task block", owner: "Content Studio", steps: ["Use the strongest content pattern as the starting template.", "Map posts by platform, hook, format, and CTA.", "Route approved items into Publishing for scheduling."] };
2202:	if (/weak post|improve content/.test(query)) {
2203:		return { title: "Content repair task block", owner: "Content Studio", steps: ["Select the weakest items from Insights.", "Rewrite hooks, sharpen CTAs, and adjust format-platform fit.", "Republish only after updated versions are approved."] };
2205:	if (/reconnect|missing tools|missing integrations/.test(query)) {
2206:		return { title: "Integration recovery task block", owner: "Integrations", steps: ["Reconnect critical analytics and performance feeds first.", "Test each integration after reconnect and sync current data.", "Return to Insights to confirm coverage improves."] };
2208:	return { title: "Execution task block", owner: "Workflows", steps: ["Confirm the goal and required output.", "Identify which workspace owns the work.", "Move into the correct page and execute the first step."] };
2216:	if (/content|post/.test(query)) {
2218:		routeSuggestions.push(routeSuggestion("Publishing", "publishing", "Schedule or approve if the next step is publishing."));
2220:	if (/reconnect|connect|integration|tool|sync/.test(query)) routeSuggestions.push(routeSuggestion("Integrations", "integrations", "Reconnect data sources and restore intelligence coverage."));
2267:async function ensureIntelligenceLoaded({
2272:	fetchProjectInsights,
2273:	fetchProjectLearning,
2293:		loadingPromise: (async () => {
2297:					fetchProjectInsights(projectName),
2298:					fetchProjectLearning(projectName)
2332:function syncAiWorkflowBridge({ projectName, modeId, command, response }) {
2339:		updatedAt: nowIso()
2521:		confirmationNote: firstAiInboundText(preview.confirmationNote, preview.confirmation_note, "Execution, approvals, publishing, CRM updates, customer replies, and workflow runs require explicit confirmation in the owning workspace."),
2591:	)) || `Review this ${sourceLabel} handoff for ${projectLabel}. Identify the right specialist, summarize the context, produce a review-ready draft, and recommend the next safe route. Do not execute publishing, task creation, CRM updates, customer replies, workflow runs, or backend actions.`;
2631:		note: "Guidance only. No publishing, task creation, CRM updates, customer replies, workflow runs, exports, or backend actions are executed from this handoff."
2661:		saveLocalOutput(projectName, {
2678:		updatedAt: nowIso()
2693:async function submitDurableCommand({
2700:	executeProjectAiCommand,
2705:	if (typeof executeProjectAiCommand !== "function") throw new Error("AI command service is unavailable.");
2713:		result = await executeProjectAiCommand(projectName, {
2720:				approved_assets: aiContext.approvedAssets,
2780:	syncAiWorkflowBridge({ projectName: aiContext.projectName, modeId: resolvedModeId, command: cleanCommand, response });
2974:				<div class="ctrl-composer-hint">Ctrl / Cmd + Enter to send · Suggested prompts prefill only · Draft stays local until you send to execute</div>
2990:				<span style="font-size:11px;color:var(--color-text-2);">Prefill only — send to run</span>
3196:					<div class="ctrl-empty-box">Commands you send appear here. Click any to restore and re-run.</div>
3350:                "Keep it review-ready and do not execute backend actions.",
3377:        preview.safetyLabel = preview.safetyLabel || "Conversation converted into a review-ready draft. No backend action executed.";
3683:			<span>Full Team prepares a coordinated, review-ready plan. It does <b>not</b> execute workflows or publish anything.</span>
3989:		const draftLabel = asString(session.draftMessage).trim() ? "Draft saved" : "Empty draft";
4235:                                <div class="aicmd-room-planned-note">This is a review-ready preview. Execution, publishing, approvals, CRM updates, and workflow runs happen only in the destination workspace after confirmation.</div>
4278:				<li><span>Video brief / script draft</span><strong class="is-draft-ready">Draft-ready — no generation executed</strong></li>
4548:		{ label: "Approved assets", value: aiContext.approvedAssets.length ? `${aiContext.approvedAssets.length} ready` : "No approved assets", present: aiContext.approvedAssets.length > 0 },
4553:			{ label: "Open conversations", value: "Snapshot / requires runtime surface", present: false, scoped: true },
4605:					<span>Publishing, approval, and workflow runs require your explicit confirmation in the right workspace.</span>
4665:		description: "Talk to your AI team, run structured tasks, and turn intelligence into action."
4680:			executeProjectAiCommand,
4681:			fetchProjectInsights,
4682:			fetchProjectLearning,
4694:           const savedOutput = asObject(loadLocalOutput(sessionKey));
4695:           if (asArray(savedOutput.messages).length && !asArray(session.messages).length) {
4696:                   session.messages = asArray(savedOutput.messages).slice(-40);
4699:			const preview = asObject(savedOutput.preview);
4706:			session.responseHistory = asArray(savedOutput.responses).slice(0, 12);
4744:		const bridgeStatus = getAiResponseBridgeStatus(executeProjectAiChat);
4788:		const updateStatus = (msg) => {
4795:				updateStatus("Please write your request in the composer first.");
4817:			persistSessionDraft(sessionKey, session, "Draft saved locally");
4830:		                        updateStatus("Selected chat session could not be loaded.");
4834:		                saveLocalOutput(sessionKey, {
4850:		        newSessionBtn.onclick = () => {
4851:		                saveAiChatSession(sessionKey, session, { title: "Previous AI Team session" });
4870:		                saveLocalOutput(sessionKey, {
4879:		                showMessage?.("New AI session started. Previous chat saved to Recent chats.");
4886:			settingsBtn.onclick = () => {
4896:			btn.onclick = () => {
4907:                        btn.onclick = () => {
4920:                                        session.draftMessage = `Act as the ${spec?.label || titleCase(specId)} for ${projectName}. Review the project context and suggest the next best actions. Do not execute anything; prepare guidance only.`;
4932:			btn.onclick = () => {
4943:			btn.onclick = () => {
4949:				updateStatus("Suggested prompt loaded into composer. Review it, then Ask AI Team or Draft.");
4955:			btn.onclick = () => {
4961:				updateStatus("Quick action loaded into composer. Review it, then ask or preview.");
4975:                        updateStatus
4983:				persistSessionDraft(sessionKey, session, "Draft auto-saved locally");
5004:			voiceBtn.onclick = () => {
5009:					updateStatus("Voice input trigger is ready. Browser speech recognition is not available in this environment yet.");
5028:						updateStatus("Voice input captured in composer.");
5031:						updateStatus("Voice input could not start. Microphone permission may be blocked.");
5034:					updateStatus("Listening for Arabic voice input.");
5036:					updateStatus("Voice input could not start in this browser.");
5044:		        askBtn.onclick = async () => {
5047:		                        updateStatus("Please write your message in the composer first.");
5058:		                        updateStatus(bridgeStatus.reason);
5085:		                saveLocalOutput(sessionKey, {
5097:		                        const result = await executeProjectAiChat(projectName, {
5189:		                        saveLocalOutput(sessionKey, {
5197:		                        saveAiChatSession(sessionKey, session);
5200:		                        updateStatus("Specialist reply generated. No workflow/task/handoff was created.");
5206:		                        saveLocalOutput(sessionKey, {
5215:		                        updateStatus(session.responseError);
5224:                        prepareBtn.onclick = () => {
5235:                                updateStatus("Guidance preview prepared from conversation context.");
5245:                        draftTaskBtn.onclick = () => {
5259:                                updateStatus("Task draft preview prepared from conversation context. Review before creating durable tasks.");
5268:                        draftWorkflowBtn.onclick = () => {
5282:                                updateStatus("Workflow draft preview prepared from conversation context. No workflow run started.");
5292:                        handoffBtn.onclick = () => {
5306:                                updateStatus("Handoff preview prepared from conversation context. Review destination before sending.");
5313:			btn.onclick = () => {
5343:					updateStatus
5347:					updateStatus("Smart tool drawer is unavailable. Refresh AI Command and try again.");
5353:		const saveBtn = $("aicmdV2SaveBtn");
5354:		if (saveBtn) {
5355:			saveBtn.onclick = () => {
5357:				persistSessionDraft(sessionKey, session, "Draft saved locally");
5358:				updateStatus("Composer draft saved locally.");
5359:				showMessage?.("Composer draft saved locally.");
5366:			clearBtn.onclick = () => {
5374:				updateStatus("Composer draft cleared.");
5384:		        responseContinueBtn.onclick = () => {
5386:		                updateStatus("Continue from the Composer. The selected specialist is still active.");
5392:			responseCopyBtn.onclick = async () => {
5397:						updateStatus("Response copied to clipboard.");
5400:						updateStatus("Clipboard is not available in this browser context.");
5403:					updateStatus("Copy failed. Clipboard access may be blocked.");
5410:			responseUseBtn.onclick = () => {
5417:				updateStatus("Response inserted into composer.");
5423:			responseSaveBtn.onclick = () => {
5425:				const saved = saveLocalOutput(sessionKey, {
5431:				updateStatus(`Response saved locally ${formatTime(saved.updatedAt)}.`);
5432:				showMessage?.("Response saved locally.");
5438:		        responseConvertBtn.onclick = () => {
5453:		                saveLocalOutput(sessionKey, {
5461:		                updateStatus("Conversation converted into a draft preview.");
5469:			responseSendBtn.onclick = () => {
5504:			responseReadBtn.onclick = () => {
5507:					updateStatus("Read is not supported in this browser.");
5513:				updateStatus("Reading response locally in browser.");
5520:			previewCopyBtn.onclick = async () => {
5531:						updateStatus("Preview copied to clipboard.");
5534:						updateStatus("Clipboard is not available in this browser context.");
5537:					updateStatus("Copy failed. Clipboard access may be blocked.");
5544:			previewUseBtn.onclick = () => {
5557:				updateStatus("Preview inserted into composer for refinement.");
5563:			previewSendBtn.onclick = () => {
5567:					updateStatus("No destination route is available for this preview.");
5599:			previewSaveBtn.onclick = () => {
5602:				const saved = saveLocalOutput(sessionKey, {
5607:				updateStatus(`Preview saved locally ${formatTime(saved.updatedAt)}.`);
5608:				showMessage?.("Preview saved locally.");
5614:			previewReadBtn.onclick = () => {
5618:					updateStatus("Read preview is not supported in this browser.");
5627:				updateStatus("Reading preview locally in browser.");
5633:			previewClearBtn.onclick = () => {
5647:				fetchProjectInsights,
5648:				fetchProjectLearning,

## AI Command provider / output / attach / voice / chat markers
19:} from "../shared-context.js";
66:                summary: "Publishing readiness, schedule review, and handoff preparation.",
150:		safetyNote: "All outputs are guidance and draft only. Execution requires explicit confirmation.",
197:		summary: "Publishing readiness, schedule review, and handoff preparation.",
198:		placeholder: "Ask the Publisher to review publishing readiness, check scheduling, or prepare a handoff package…",
199:		canHelp: ["Review publishing readiness", "Check scheduled jobs", "Prepare handoff packages", "Map publishing dependencies", "Flag pre-publish risks"],
262:		summary: "Inbox review, reply drafts, ticket drafts, SLA risk, customer profile context, and escalation routing.",
263:		placeholder: "Ask the Customer Operations Lead to summarize a customer thread, draft a safe reply, prepare a ticket draft, check SLA risk, or route an escalation for review…",
264:		canHelp: ["Review inbox context", "Summarize customer threads", "Draft safe replies", "Prepare ticket drafts", "Flag SLA and escalation risk"],
267:		safetyNote: "Customer operations outputs are drafts only. Sending replies, ticket creation, and escalations require confirmation in the owning surface.",
276:		placeholder: "Ask the Sales / CRM Lead to qualify a lead, draft outreach, plan follow-ups, summarize CRM context, or prepare a sales handoff for review…",
277:		canHelp: ["Qualify lead context", "Draft outreach", "Plan follow-up sequences", "Summarize CRM profiles", "Prepare sales handoffs"],
280:		safetyNote: "Sales and CRM outputs are guidance and drafts only. CRM mutations and outreach sends require confirmation in the owning surface.",
285:// Role-specific suggested prompt chips (prefill only, no auto-execute)
290:		{ label: "Review launch readiness", sub: "Identify what is blocking launch" },
296:		{ label: "Prepare a Publisher handoff", sub: "Package ready content for review" },
312:		{ label: "Review publishing readiness", sub: "Check what is ready to publish" },
342:		{ label: "Summarize customer thread", sub: "Capture issue, tone, and next reply" },
343:		{ label: "Draft customer reply", sub: "Safe response for review" },
351:		{ label: "Prepare sales handoff", sub: "Route context to operations" }
355:// Full Team mode suggested prompts
363:const PHASE35_WORKSPACE_TABS = ["chat", "preview", "tools", "context", "history"];
369:	{ id: "route", title: "Route", description: "Send context to the owning workspace." },
371:	{ id: "monitor", title: "Monitor", description: "Track readiness, integrations, and recent activity." }
376:	{ id: "task", label: "Task", helper: "Task-shaped output" },
379:	{ id: "export", label: "Export", helper: "File-ready package" }
441:		{ id: "format-mapper", label: "Format Mapper", action: "preview", intent: "guidance", template: "Map required creative formats for {project}. Include platform, aspect ratio, asset type, and usage context." },
442:		{ id: "asset-checklist", label: "Asset Checklist", action: "preview", intent: "task", template: "Create an asset checklist for {project}. List must-have files, missing references, usage context, and priority." },
450:		{ id: "prepare-voiceover", label: "Prepare voiceover", action: "preview", intent: "guidance", template: "Prepare voiceover script options for {project}. Keep clean timing and emphasis notes." },
454:		{ id: "publishing-checklist", label: "Publishing Checklist", action: "preview", intent: "handoff", template: "Build a publishing checklist for {project}. Include German copy, assets, claims checks, and channel readiness." },
456:		{ id: "channel-formatting", label: "Channel Formatting", action: "preview", intent: "guidance", template: "Format the next output for {project} by channel. Include German copy, limits, CTA, and scheduling notes." },
478:		{ id: "publish-readiness", label: "Publish Readiness", action: "preview", intent: "handoff", template: "Review publish readiness for {project}. Confirm what needs human approval before release." },
489:		{ id: "review-unified-inbox", label: "Review Unified Inbox", action: "preview", intent: "guidance", template: "Review the Unified Inbox readiness for {project}. Summarize visible customer-operation signals, open gaps, and safe next review steps. Do not claim inbox actions happened." },
490:		{ id: "summarize-customer-thread", label: "Summarize Customer Thread", action: "preview", intent: "guidance", template: "Summarize this customer thread for {project}. Include customer issue, sentiment, reply goal, missing details, and safe next step." },
491:		{ id: "draft-customer-reply", label: "Draft Customer Reply", action: "preview", intent: "guidance", template: "Draft a customer reply for {project}. Keep it helpful, calm, review-ready, and do not claim any operational action has been completed." },
495:		{ id: "customer-profile-snapshot", label: "Customer Profile Snapshot", action: "preview", intent: "guidance", template: "Prepare a customer profile snapshot for {project}. Include known context, purchase/support signals, missing fields, and safe follow-up questions." },
502:		{ id: "crm-profile-summary", label: "CRM Profile Summary", action: "preview", intent: "guidance", template: "Summarize the CRM profile context for {project}. Include fit, history, open questions, and next sales action without mutating CRM data." },
506:		{ id: "sales-handoff-draft", label: "Sales Handoff", action: "preview", intent: "handoff", template: "Prepare a sales handoff draft for {project}. Include lead context, recommended next action, owner, and confirmation needed." }
510:// 4 quick-action prompts shown in the composer
515:	{ icon: "🔧", label: "Fix Readiness", sub: "Close critical gaps", template: "What are the critical readiness gaps for {project} and what exactly needs to be done to fix them?" }
519:const AI_COMMAND_LOCAL_OUTPUTS_KEY = "mh-ai-command-local-outputs-v1";
534:	{ id: "selected-context", label: "Selected page/context" },
540:	"Launch readiness",
554:		suggestedPrompt: "Act as Strategist and propose the next campaign move based on current readiness and integrations."
573:		purpose: "Align media formats with channels, cadence, and readiness.",
582:		suggestedPrompt: "Act as Ads Specialist and propose paid experiments based on current readiness and data coverage."
608:const AI_COMMAND_CHAT_SESSIONS_KEY = "mh_ai_command_chat_sessions_v1";
627:	function detectSpecialistFromBridgePrompt(prompt) {
628:		const text = asString(prompt);
652:			type: "generate_prompt",
654:			action: "Generate prompt from AI command",
656:				prompt: command,
667:				prompt: command,
681:				prompt: command,
691:function detectSpecialistFromBridgePrompt(prompt) {
692:	const text = asString(prompt);
765:function applyTokenTemplate(template, context = {}) {
767:		project: asString(context.projectName || "this project") || "this project",
768:		projectName: asString(context.projectName || "this project") || "this project",
769:		specialist: asString(context.specialistLabel || "Specialist") || "Specialist",
770:		specialistLabel: asString(context.specialistLabel || "Specialist") || "Specialist",
771:		campaign: asString(context.campaign || "active campaign") || "active campaign"
790:    "Fix readiness for:"
871:		overview.output_language ||
879:		overview.chat_language ||
939:			outputWorkspaceTab: "draft",
969:			outputPreview: null,
971:			responseHistory: [],
972:			responseLoading: false,
973:			responseError: "",
974:			responseHistoryLoaded: false,
975:                        chatSessions: [],
983:function readLocalDraftMap() {
1003:	return asObject(readLocalDraftMap()[key]);
1008:	const map = readLocalDraftMap();
1021:	if (localDraft.prompt) {
1022:		session.draftMessage = asString(localDraft.prompt);
1029:	if (localDraft.prompt || localDraft.updatedAt) {
1037:		prompt: session.draftMessage,
1046:function readLocalOutputMap() {
1066:	return asObject(readLocalOutputMap()[key]);
1069:function saveLocalOutput(projectName, outputPayload) {
1071:	const map = readLocalOutputMap();
1074:		...asObject(outputPayload),
1085:			reason: "AI response guidance bridge is not connected yet (API function unavailable)."
1095:function readAiChatSessionsMap() {
1115:        return asArray(readAiChatSessionsMap()[key]).slice(0, 20);
1121:        const responses = asArray(session.responseHistory);
1122:        const hasContent = messages.length || responses.length || asObject(session.outputPreview).title;
1125:        const map = readAiChatSessionsMap();
1129:        const titleSeed = asString(options.title || firstUser?.content || responses[0]?.prompt || "AI Team session").trim();
1130:        const sessionId = asString(options.sessionId || session.activeChatSessionId || `chat-session-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`);
1137:                responses: responses.slice(0, 12),
1138:                preview: session.outputPreview || null,
1149:        session.chatSessions = nextSessions;
1160:        session.responseHistory = asArray(record.responses).slice(0, 12);
1161:        session.outputPreview = asObject(record.preview);
1162:        session.outputWorkspaceTab = outputTabFromPreview(session.outputPreview);
1163:        session.activeOutputTab = session.outputWorkspaceTab;
1166:        session.responseError = "";
1167:        session.responseLoading = false;
1171:        session.chatSessions = getAiChatSessions(projectName);
1176:        session.chatSessions = getAiChatSessions(projectName);
1177:        return session.chatSessions;
1181:function buildSpecialistChatPrompt({ prompt, specialistLabel, modeLabel, projectName, language, outputLanguage, market }) {
1182:	const cleanPrompt = asString(prompt).trim();
1187:	const safeOutputLanguage = asString(outputLanguage || "German").trim();
1202:		`Publishable output language: ${safeOutputLanguage}`,
1207:                "When you include publishable copy, label it clearly as publishable content and keep the explanation in the user chat language.",
1213:		"Deliver a structured, review-ready answer.",
1220:function extractGeneratedResponseText(response = {}) {
1222:		response.chat_answer ||
1223:		response.response_text ||
1224:		response.content ||
1225:		response.summary ||
1226:		response.analysis ||
1227:		response.title
1231:	const bullets = normalizeDisplayList(response.bullets, 6)
1237:	const recommendationLine = normalizeDisplayList(response.recommendations, 4)
1241:	const findingLine = normalizeDisplayList(response.findings, 4)
1245:	const sectionLine = asArray(response.sections)
1258:function destinationRouteForSpecialist(specialistId, outputType) {
1261:	if (outputType === "workflow") return "workflows";
1262:	if (id === "strategist") return outputType === "task" ? "campaign-studio" : "workflows";
1270:	if (id === "operations") return outputType === "task" ? "task-center" : "workflows";
1271:	if (id === "customer_ops") return outputType === "task" ? "task-center" : "operations-centers";
1277:function resolveAiResponseOutputRoute(session, response = {}) {
1280:        const explicitDestination = asString(response.destinationRoute || "").trim();
1284:                response.outputType,
1285:                response.destinationRoute,
1286:                response.responseTitle,
1287:                response.responseText,
1288:                response.prompt
1291:        let outputType = asString(response.outputType || "").toLowerCase();
1292:        if (!outputType || outputType === "chat") {
1293:                outputType = activeTab === "task"
1305:        const looksMediaLike = /\b(media|visual|creative|image|images|video|reel|storyboard|shot list|asset|assets|design|production|creative direction|voiceover)\b/.test(text);
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
1377:function specialistTemplateForOutput({ specialist, outputType, prompt, projectName }) {
1378:	const cleanPrompt = asString(prompt).trim();
1379:	const promptSnippet = cleanPrompt || `Project request for ${projectName || "current project"}`;
1381:	const route = destinationRouteForSpecialist(specialistId, outputType);
1385:		outputType,
1386:		title: "Draft output",
1391:		confirmationRequired: outputType === "handoff" || specialistId === "publisher" || specialistId === "compliance_reviewer",
1393:		sourcePrompt: promptSnippet,
1401:		if (outputType === "task") {
1418:			summary: `Priority guidance prepared from: ${promptSnippet}`,
1420:				"Strategic priorities aligned to current readiness",
1430:			title: outputType === "task" ? "Task: Draft campaign copy" : "Content Guidance: Messaging draft",
1464:			outputType: outputType === "guidance" ? "media_brief" : outputType,
1466:			summary: "Media brief prepared with visual direction, prompt ideas, and required assets.",
1484:			title: outputType === "task" ? "Task: Video production plan" : "Video Brief: Hook, script, storyboard",
1492:			safetyLabel: "Video generation requires configured provider or GPU worker; no execution started."
1499:			title: outputType === "handoff" ? "Handoff Preview: Publishing package" : "Publishing Draft: Readiness checklist",
1503:				"Publishing remains gated until channel, approval, and asset readiness are confirmed."
1506:				"Validate asset and copy readiness",
1519:			title: outputType === "task" ? "Task: Paid test plan" : "Ads Draft: Angles and tests",
1547:			title: outputType === "task" ? "Task: Analysis plan" : "Insights Guidance: Signal review",
1550:				"Signals to check: readiness, channel performance, data coverage",
1577:			title: outputType === "task" ? "Ticket Draft: Customer operations follow-up" : "Customer Ops Draft: Thread, reply, and routing",
1579:			mainOutput: "Review the customer context, confirm missing details, then route the draft through the owning support, sales, or operations surface.",
1595:				"Summarize the customer thread",
1608:			title: outputType === "handoff" ? "Sales Handoff" : "Sales / CRM Draft: Lead and outreach plan",
1610:			mainOutput: "Use this as a sales planning draft. Confirm CRM context and owner before sending outreach or changing pipeline status.",
1618:				"Follow-up 2: add proof or relevant context.",
1643:		if (outputType === "workflow") {
1659:			title: outputType === "handoff" ? "Handoff Preview: Operations package" : "Operations Draft: Task and handoff plan",
1664:				"Prepare destination handoff context",
1674:function buildPhase2OutputPreview({ intent, session, prompt, projectName }) {
1686:	const outputType = intentToType[intent] || "guidance";
1690:		outputType,
1691:		prompt,
1700:		title: outputType === "workflow" ? "Team Workflow" : `Team ${titleCase(outputType)} Preview`,
1701:		summary: `Full team ${outputType.replace("_", " ")} preview prepared for ${projectName || "current project"}.`,
1705:			"Compliance and Publisher verify claims, approvals, formatting, and release readiness",
1711:			"Media / Video: prepare creative direction, asset needs, script, storyboard, or voiceover draft",
1713:			"Publisher: package channel-ready copy, assets, schedule notes, and publish checks",
1715:			"Operations: convert the reviewed output into safe tasks, workflow draft, or handoff context"
1717:		destinationRoute: outputType === "task" ? "task-center" : "workflows",
1718:		nextSafeAction: "Review the team draft, confirm owners, then route draft context to the destination workspace",
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
1794:                preview.output ||
1808:                blocks.push({ label: "Main output", items: mainLines });
1840:		const providerMatch = /openai|replicate|stability|runway|elevenlabs|anthropic/.test(integrationId);
1841:		const readyState = /connected|healthy|ready|active|ok/.test(status);
1842:		return providerMatch && readyState;
1853:	const readiness = asObject(state.data.readiness);
1854:	const readinessDashboard = asObject(readiness.dashboard);
1874:	const nextBestActions = asArray(overviewBlock.next_best_actions || readinessDashboard.next_best_actions);
1875:	const criticalGaps = asArray(readinessDashboard.priorities?.critical || readiness.priorities?.critical);
1876:	const importantGaps = asArray(readinessDashboard.priorities?.important || readiness.priorities?.important);
1898:		projectName: state.context.currentProject || "",
1899:		market: state.context.currentMarket || overview.market || "",
1900:		language: state.context.currentLanguage || overview.language || "",
1901:		campaign: state.context.activeCampaign || "Not selected",
1902:		executionMode: state.context.executionMode || overview.execution_mode || "",
1904:		readinessScore: toNumber(readinessDashboard.readiness_score ?? overview.readiness_score),
1905:		readinessStatus: asString(readinessDashboard.readiness_status || overview.readiness_status || "unknown"),
1916:		readiness,
1917:		readinessDashboard,
1969:		operations: ["task plan", "workflow", "handoff", "approval", "timeline", "execution plan", "route", "publish", "status", "priority", "priorities", "blocking", "blocker", "readiness", "next", "do next"],
1970:		customer_ops: ["customer", "support", "inbox", "ticket", "tickets", "sla", "reply", "thread", "escalation", "complaint", "refund"],
2028:	if (aiContext.readinessScore != null) summaryParts.push(`Readiness is ${aiContext.readinessScore}/100 (${aiContext.readinessStatus || "in progress"}).`);
2035:			aiContext.criticalGaps.length ? `Critical gaps: ${aiContext.criticalGaps.slice(0, 4).map(normalizeActionLabel).join(", ")}.` : "No critical readiness gaps flagged.",
2100:			? `${formatCompactNumber(seo.summary.impressions)} impressions tracked. SEO lane is ready for prioritization.`
2165:		summary: "The system has enough operating context to highlight where better evidence would improve decision quality.",
2182:			routeSuggestion("Setup", "setup", "Strengthen project assumptions, goals, and audience context."),
2208:	return { title: "Execution task block", owner: "Workflows", steps: ["Confirm the goal and required output.", "Identify which workspace owns the work.", "Move into the correct page and execute the first step."] };
2217:		routeSuggestions.push(routeSuggestion("Content Studio", "content-studio", "Draft, rewrite, or prepare the requested content outputs."));
2225:		summary: "This request is best handled as a structured workflow — moving into the right workspace gets results faster than chat alone.",
2231:			"Move into the correct workspace rather than managing the whole flow from chat.",
2281:	const freshEnough = current.status === "ready" && current.project === projectName && current.loadedAt && (Date.now() - Date.parse(current.loadedAt)) < 1000 * 60 * 3;
2286:	const needsDashboard = !state.data.overview || !state.data.readiness || !state.data.integrations || !state.data.activity;
2308:					status: "ready",
2332:function syncAiWorkflowBridge({ projectName, modeId, command, response }) {
2337:		lastResponseTitle: asString(response?.title),
2338:		routeSuggestions: asArray(response?.routeSuggestions),
2500:	const outputType = asString(preview.outputType || preview.output_type || preview.type || "handoff").trim() || "handoff";
2512:		outputType,
2514:		summary: firstAiInboundText(preview.summary, preview.description, normalized.prompt),
2518:		sourcePrompt: firstAiInboundText(preview.sourcePrompt, preview.source_prompt, normalized.prompt),
2551:	return [handoff?.source_page, handoff?.destination_page, payload.prompt, payload.title]
2559:	const draftContext = firstAiInboundObject(payload.draft_context, payload.draftContext, handoff?.draft_context, handoff?.draftContext);
2583:	const prompt = normalizeAiComposerPrompt(firstAiInboundText(
2584:		payload.prompt,
2587:		draftContext.prompt,
2591:	)) || `Review this ${sourceLabel} handoff for ${projectLabel}. Identify the right specialist, summarize the context, produce a review-ready draft, and recommend the next safe route. Do not execute publishing, task creation, CRM updates, customer replies, workflow runs, or backend actions.`;
2610:		draftContext.outputPreview,
2611:		draftContext.output_preview,
2612:		draftContext.phase2_output_preview,
2613:		payload.outputPreview,
2614:		payload.output_preview
2620:		prompt,
2624:		outputPreview: null,
2633:	normalized.outputPreview = normalizeAiInboundOutputPreview(rawOutputPreview, normalized);
2643:	session.draftMessage = normalized.prompt;
2644:	session.composerText = normalized.prompt;
2657:	if (normalized.outputPreview) {
2658:		session.outputPreview = normalized.outputPreview;
2659:		session.outputWorkspaceTab = outputTabFromPreview(normalized.outputPreview);
2660:		session.activeOutputTab = session.outputWorkspaceTab;
2662:			preview: session.outputPreview,
2663:			responses: session.responseHistory,
2674:		lastCommand: normalized.prompt,
2708:	let response = {};
2718:			asset_context: {
2724:		response = asObject(result?.response);
2730:		const payloadResponse = asObject(payload?.response);
2732:		const failureReason = asString(payload?.error) || asString(payloadResponse?.error) || asString(error?.message) || "AI provider failed to return output.";
2735:		response = {
2740:			nextActions: ["Check AI provider configuration and retry."],
2764:		source: "durable-ai-response",
2765:		response
2774:		responseTitle: response.title || (response.status === "failed" ? "Command failed" : ""),
2775:		failed: asString(response.status).toLowerCase() === "failed"
2780:	syncAiWorkflowBridge({ projectName: aiContext.projectName, modeId: resolvedModeId, command: cleanCommand, response });
2782:	return { accepted: true, failed: asString(response.status).toLowerCase() === "failed" };
2809:      purpose: asString(member.purpose || member.description || fallback.purpose || "Support the current operating context."),
2818:	const readinessLabel = aiContext.readinessScore != null ? `${aiContext.readinessScore}/100` : "--";
2821:	const intelDotClass = { ready: "ready", loading: "loading", error: "error", idle: "idle" }[intelligenceStatus] || "idle";
2822:	const intelLabel = { ready: "Live intelligence loaded", loading: "Loading intelligence…", error: "Intelligence limited", idle: "Waiting for intelligence" }[intelligenceStatus] || "Idle";
2828:	if (aiContext.recommendations.length) caps.push(`${aiContext.recommendations.length} recommendations ready`);
2848:			<div class="ctrl-room-context-bar">
2855:					<strong>${escapeHtml(readinessLabel)}</strong>
2974:				<div class="ctrl-composer-hint">Ctrl / Cmd + Enter to send · Suggested prompts prefill only · Draft stays local until you send to execute</div>
2989:				<h3 style="margin:0;font-size:14px;font-weight:600;color:var(--color-text-0);">Suggested prompts</h3>
2993:				<div class="ctrl-prompts-grid">
2996:							class="ctrl-prompt-btn"
3001:							<span class="ctrl-prompt-icon">${action.icon}</span>
3003:								<span class="ctrl-prompt-label">${escapeHtml(action.label)}</span>
3004:								<span class="ctrl-prompt-sub">${escapeHtml(action.sub)}</span>
3018:function renderCleanResponse(response, escapeHtml, ownerId) {
3019:	const hasError = asString(response.status).toLowerCase() === "failed" || Boolean(asString(response.error));
3020:	const title = humanizeValue(response.title, "");
3021:	const summary = humanizeValue(response.summary, "");
3022:	const findings = normalizeDisplayList(response.findings, 5);
3023:	const recommendations = normalizeDisplayList(response.recommendations, 4);
3024:	const nextActions = normalizeDisplayList(response.nextActions || response.next_actions, 4);
3025:	const routeSuggestions = asArray(response.routeSuggestions || response.route_suggestions).map((item) => {

## Cross-file handoff references
public/control-center/pages/publishing.js:11:  const safety = `Publishing prepares channel packages, schedules, and approval-ready handoffs. Final execution remains <strong>confirmation-gated</strong> and governed by <strong>backend approval rules</strong>.`;
public/control-center/pages/publishing.js:15:    `<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingHandoffPanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Review Approval Gate</button>`,
public/control-center/pages/publishing.js:16:    `<button type="button" class="btn btn-primary" onclick="document.getElementById('publishingPushAiBtn')?.scrollIntoView({behavior:'smooth',block:'start'})">Open AI Review</button>`
public/control-center/pages/publishing.js:82:import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";
public/control-center/pages/publishing.js:955:function getPublishingHandoff(projectName, operations) {
public/control-center/pages/publishing.js:958:    getSharedHandoff(projectName, "publishing", operations, "ai-command") ||
public/control-center/pages/publishing.js:1001:      why: "A workflow handoff is available. Loading it keeps execution moving without inventing backend data.",
public/control-center/pages/publishing.js:1076:        <button id="publishingPushAiBtn" class="btn btn-primary" type="button">Send publishing context to AI</button>
public/control-center/pages/publishing.js:1097:      <div class="simple-banner">Opens AI with this context only. <strong>No approval, publishing, or backend execution is performed.</strong></div>
public/control-center/pages/publishing.js:1286:    <section class="card publishing-card" id="publishingHandoffPanel">
public/control-center/pages/publishing.js:1302:        <button id="publishingLoadHandoffBtn" class="btn btn-secondary" type="button">Load Workflow Output</button>
public/control-center/pages/publishing.js:1785:  const loadHandoffBtn = $("publishingLoadHandoffBtn");
public/control-center/pages/publishing.js:1808:  const pushAiBtn = $("publishingPushAiBtn");
public/control-center/pages/publishing.js:1809:  if (pushAiBtn) {
public/control-center/pages/publishing.js:1810:    pushAiBtn.onclick = () => {
public/control-center/pages/publishing.js:1813:      const prompt = buildPublishingAiPrompt(projectName, current, session, handoff);
public/control-center/pages/publishing.js:1823:      setSharedHandoff(projectName, "ai-command", {
public/control-center/pages/publishing.js:1825:        destination_page: "ai-command",
public/control-center/pages/publishing.js:1844:      navigateTo("ai-command");
public/control-center/pages/publishing.js:1845:      showMessage?.("Publishing context sent to AI Command.");
public/control-center/pages/publishing.js:1943:    const handoff = getPublishingHandoff(projectName, operations);
public/control-center/pages/operations-centers.js:121:      context.navigateTo("ai-command");
public/control-center/pages/operations-centers.js:122:      context.showMessage?.("Opened AI Command.");
public/control-center/pages/operations-centers.js:132:      context.navigateTo("ai-command");
public/control-center/pages/operations-centers.js:133:      context.showMessage?.("Operations prompt added to AI Command.");
public/control-center/pages/operations-centers.js:472:        <button class="btn btn-ghost" type="button" data-ops-ai-open>Open AI Workspace</button>
public/control-center/pages/operations-centers.js:662:                  <p>Context-only handoff: opens AI with prompt/context only. No approval, publishing, or backend execution is performed.</p>
public/control-center/pages/operations-centers.js:666:                <button class="btn btn-secondary" type="button" data-ops-ai-open>Open AI: Review in AI Workspace</button>
public/control-center/pages/operations-centers.js:1015:                  <p>Context-only handoff: opens AI with prompt/context only. No approval, publishing, or backend execution is performed.</p>
public/control-center/pages/operations-centers.js:1019:                <button class="btn btn-secondary" type="button" data-ops-ai-open>Open AI: Review in AI Workspace</button>
public/control-center/pages/operations-centers.js:1310:                  <p>Context-only handoff: opens AI with prompt/context only. No approval, publishing, or backend execution is performed.</p>
public/control-center/pages/operations-centers.js:1314:                <button class="btn btn-secondary" type="button" data-ops-ai-open>Open AI: Review in AI Workspace</button>
public/control-center/pages/operations-centers.js:1666:                  <p>Context-only handoff: opens AI with prompt/context only. No approval, publishing, or backend execution is performed.</p>
public/control-center/pages/operations-centers.js:1670:                <button class="btn btn-secondary" type="button" data-ops-ai-open>Open AI: Review in AI Workspace</button>
public/control-center/pages/operations-centers.js:2037:                <button class="btn btn-secondary" type="button" data-route="ai-command">Open AI Team</button>
public/control-center/pages/ai-command/tool-dock.js:51:  const root = drawer?.closest?.("[data-page='ai-command'], .ai-command-page, body") || document;
public/control-center/pages/ai-command/tool-dock.js:107:  origin = "ai-command",
public/control-center/pages/ai-command/tool-dock.js:146:    origin: "ai-command",
public/control-center/pages/ai-command/tool-dock.js:211:  lines.push("Use the selected Library source as context. Do not invent unsupported claims.");
public/control-center/pages/ai-command/tool-dock.js:449:      frontendOwnerPage: "ai-command",
public/control-center/pages/ai-command/tool-dock.js:475:      frontendOwnerPage: "ai-command",
public/control-center/pages/ai-command/tool-dock.js:488:      frontendOwnerPage: "ai-command",
public/control-center/pages/ai-command/tool-dock.js:502:      destinations: ["library", "ai-command", "content-studio"],
public/control-center/pages/ai-command/tool-dock.js:540:      frontendOwnerPage: "ai-command",
public/control-center/pages/ai-command/tool-dock.js:541:      destinations: ["content-studio", "library", "media-studio", "publishing", "compliance", "task", "handoff"],
public/control-center/pages/ai-command/tool-dock.js:543:      outputTypes: ["content_studio_draft", "library_save", "media_brief", "publishing_package", "compliance_review", "task_preview", "handoff_preview"],
public/control-center/pages/ai-command/tool-dock.js:544:      template: "Prepare safe routing for this Content Writer output for {projectName}. Ask the destination: Content Studio, Save to Library, Prepare Media Brief, Publishing package, Compliance review, Task, or Handoff. Do not route or execute before review."
public/control-center/pages/ai-command/tool-dock.js:1331:            data-aicmd-tool-dock-owner="${safe(tool.frontendOwnerPage || "ai-command")}"
public/control-center/pages/ai-command/tool-dock.js:1564:  setDrawerText(drawer, "[data-aicmd-tool-drawer-action]", `${humanizeMeta(actionType)} · ${humanizeMeta(btn.getAttribute("data-aicmd-tool-dock-owner") || "ai-command")}`);
public/control-center/pages/ai-command/tool-dock.js:1603:export function openAiToolDrawerFromMetadata({
public/control-center/pages/ai-command/tool-dock.js:1623:    "data-aicmd-tool-dock-owner": tool.frontendOwnerPage || tool.owner || "ai-command",
public/control-center/pages/ai-command/tool-dock.js:1666:  const openLibraryBtn = root.querySelector("[data-aicmd-tool-drawer-open-library]");
public/control-center/pages/ai-command/tool-dock.js:1676:        origin: "ai-command",
public/control-center/pages/ai-command/tool-dock.js:1688:        origin: "ai-command",
public/control-center/pages/ai-command/tool-dock.js:1689:        returnTarget: "ai-command",
public/control-center/pages/ai-command/tool-dock.js:1701:      updateStatus?.("Library guide opened. Select an asset, click Use as Source in AI Command, then return to AI Command.");
public/control-center/pages/home.js:138:  return "ai-command";
public/control-center/pages/home.js:172:    { id: "publisher", name: "Publisher", fallback: "Prepare publishing packages, schedules, and manual handoffs." },
public/control-center/pages/home.js:473:    primaryActionLabel: nextActionRoute === "ai-command" ? "Open AI Workspace" : `Open ${humanizeStatus(nextActionRoute)}`,
public/control-center/pages/home.js:494:      buttonLabel: nextActionRoute === "ai-command" ? "Start With AI" : `Fix In ${humanizeStatus(nextActionRoute)}`,
public/control-center/pages/home.js:581:        : "No scheduled action yet — open Publishing or Campaign Studio to prepare the next launch step."
public/control-center/pages/home.js:889:            <button id="homeQuickOpenAiBtn" class="quick-action-btn" type="button">
public/control-center/pages/home.js:890:              <span class="home-action-title">Open AI Workspace</span>
public/control-center/pages/home.js:904:            <button id="homeOpenAiTeamBtn" class="btn btn-ghost btn-sm" type="button">
public/control-center/pages/home.js:964:                <button id="homeOpenFullAiTeamBtn" class="btn btn-ghost btn-sm" type="button">Open Full Team</button>
public/control-center/pages/home.js:1009:              <span class="section-helper">Status and handoff only. No live CRM/IVR claims.</span>
public/control-center/pages/home.js:1016:              <em>All advanced actions require handoff to Operations Centers or AI Command.</em>
public/control-center/pages/home.js:1040:    const openAiWithPrompt = (prompt) => {
public/control-center/pages/home.js:1042:      navigateTo("ai-command");
public/control-center/pages/home.js:1043:      showMessage?.("Prompt prepared in AI Command.");
public/control-center/pages/home.js:1062:      openAiWithPrompt(prompt);
public/control-center/pages/home.js:1063:      showMessage?.(`${roleName} context prepared in AI Command.`);
public/control-center/pages/home.js:1069:        if (dashboard.nextBestAction.route === "ai-command") {
public/control-center/pages/home.js:1078:      askNextActionBtn.onclick = () => openAiWithPrompt(`Explain this next best action and give me the exact steps: ${dashboard.nextBestAction.recommendation}`);
public/control-center/pages/home.js:1084:    const aiTeamBtn = $("homeOpenAiTeamBtn");
public/control-center/pages/home.js:1085:    if (aiTeamBtn) aiTeamBtn.onclick = () => openRoute("ai-command");
public/control-center/pages/home.js:1086:    const fullAiTeamBtn = $("homeOpenFullAiTeamBtn");
public/control-center/pages/home.js:1087:    if (fullAiTeamBtn) fullAiTeamBtn.onclick = () => openRoute("ai-command");
public/control-center/pages/home.js:1090:    if (quickCampaignBtn) quickCampaignBtn.onclick = () => openRoute("campaign-studio");
public/control-center/pages/home.js:1101:    const quickAiBtn = $("homeQuickOpenAiBtn");
public/control-center/pages/home.js:1103:      quickAiBtn.onclick = () => openAiWithPrompt(dashboard.nextBestAction.recommendation);
public/control-center/pages/home.js:1108:      promptNextBtn.onclick = () => openAiWithPrompt("What should I do next for this project? Prioritize the answer based on readiness, blockers, campaign state, and recent activity.");
public/control-center/pages/home.js:1113:      promptReadinessBtn.onclick = () => openAiWithPrompt("Why is readiness low? Explain the missing integrations, assets, failed jobs, and readiness gaps in simple steps.");
public/control-center/pages/home.js:1118:      promptLaunchBtn.onclick = () => openAiWithPrompt("Summarize the launch blockers and tell me what must be fixed before publishing.");
public/control-center/pages/home.js:1123:      promptPlanBtn.onclick = () => openAiWithPrompt("Prepare today's action plan from the current dashboard. Give me prioritized tasks with owners and expected outcomes.");
public/control-center/pages/ai-command.js:4:        openAiToolDrawerFromMetadata,
public/control-center/pages/ai-command.js:6:} from "./ai-command/tool-dock.js";
public/control-center/pages/ai-command.js:66:                summary: "Publishing readiness, schedule review, and handoff preparation.",
public/control-center/pages/ai-command.js:149:		destinations: ["Campaign Studio", "Workflows", "AI Command"],
public/control-center/pages/ai-command.js:162:		destinations: ["Content Studio", "Publishing", "AI Command"],
public/control-center/pages/ai-command.js:173:		canHelp: ["Write creative briefs", "Advise on visual direction", "Map format requirements", "Review brand alignment", "Prepare media handoffs"],
public/control-center/pages/ai-command.js:175:		destinations: ["Asset Library", "Content Studio", "AI Command"],
public/control-center/pages/ai-command.js:197:		summary: "Publishing readiness, schedule review, and handoff preparation.",
public/control-center/pages/ai-command.js:198:		placeholder: "Ask the Publisher to review publishing readiness, check scheduling, or prepare a handoff package…",
public/control-center/pages/ai-command.js:199:		canHelp: ["Review publishing readiness", "Check scheduled jobs", "Prepare handoff packages", "Map publishing dependencies", "Flag pre-publish risks"],
public/control-center/pages/ai-command.js:201:		destinations: ["Publishing", "Workflows", "AI Command"],
public/control-center/pages/ai-command.js:253:		destinations: ["Workflows", "Operations Centers", "AI Command"],
public/control-center/pages/ai-command.js:303:		{ label: "Prepare a media handoff", sub: "Package direction for the team" }
public/control-center/pages/ai-command.js:437:		{ id: "publisher-package", label: "Publisher Package", action: "preview", intent: "handoff", template: "Prepare a Publisher handoff for {project}. Include German copy package, CTA, notes, and remaining checks." }
public/control-center/pages/ai-command.js:454:		{ id: "publishing-checklist", label: "Publishing Checklist", action: "preview", intent: "handoff", template: "Build a publishing checklist for {project}. Include German copy, assets, claims checks, and channel readiness." },
public/control-center/pages/ai-command.js:489:		{ id: "review-unified-inbox", label: "Review Unified Inbox", action: "preview", intent: "guidance", template: "Review the Unified Inbox readiness for {project}. Summarize visible customer-operation signals, open gaps, and safe next review steps. Do not claim inbox actions happened." },
public/control-center/pages/ai-command.js:496:		{ id: "route-support-sales-ops", label: "Route to Support / Sales / Operations", action: "preview", intent: "handoff", template: "Prepare routing guidance for {project}. Decide whether the customer item belongs with Support, Sales, or Operations, and explain the review gate." }
public/control-center/pages/ai-command.js:518:const AI_COMMAND_LOCAL_DRAFTS_KEY = "mh-ai-command-local-drafts-v1";
public/control-center/pages/ai-command.js:519:const AI_COMMAND_LOCAL_OUTPUTS_KEY = "mh-ai-command-local-outputs-v1";
public/control-center/pages/ai-command.js:648:	const command = humanizeValue(commandText || session?.draftMessage, "Prepare workflow action from AI command.");
public/control-center/pages/ai-command.js:653:			targetPage: "ai-command",
public/control-center/pages/ai-command.js:654:			action: "Generate prompt from AI command",
public/control-center/pages/ai-command.js:657:				title: "AI command auto plan"
public/control-center/pages/ai-command.js:665:			action: "Prepare workflow from AI command",
public/control-center/pages/ai-command.js:668:				reason: "AI command prepared for workflow execution."
public/control-center/pages/ai-command.js:674:	if (/publish\s*now|send\s*external|paid\s*ads|final\s*approval/i.test(command)) {
public/control-center/pages/ai-command.js:1623:				"Can I send more details?",
public/control-center/pages/ai-command.js:1808:                blocks.push({ label: "Main output", items: mainLines });
public/control-center/pages/ai-command.js:1815:                blocks.push({ label: "Details", items: bullets });
public/control-center/pages/ai-command.js:1840:		const providerMatch = /openai|replicate|stability|runway|elevenlabs|anthropic/.test(integrationId);
public/control-center/pages/ai-command.js:2020:		notes.push("Paid platform reporting not connected — ROAS guidance is limited.");
public/control-center/pages/ai-command.js:2028:	if (aiContext.readinessScore != null) summaryParts.push(`Readiness is ${aiContext.readinessScore}/100 (${aiContext.readinessStatus || "in progress"}).`);
public/control-center/pages/ai-command.js:2029:	if (aiContext.criticalGaps.length) summaryParts.push(`${aiContext.criticalGaps.length} critical gaps are open.`);
public/control-center/pages/ai-command.js:2030:	if (aiContext.recommendations.length) summaryParts.push(`${aiContext.recommendations.length} recommendations available.`);
public/control-center/pages/ai-command.js:2215:	if (/campaign/.test(query)) routeSuggestions.push(routeSuggestion("Campaign Studio", "campaign-studio", "Turn this into a structured launch plan."));
public/control-center/pages/ai-command.js:2221:	if (/ads|campaign scale|roas|creative/.test(query)) routeSuggestions.push(routeSuggestion("Ads Manager", "ads-manager", "Review live paid performance and action the next media move."));
public/control-center/pages/ai-command.js:2547:			aiInboundHandoffObjectIds.set(handoff, `cached-ai-handoff-${Date.now()}-${aiInboundHandoffCounter}`);
public/control-center/pages/ai-command.js:2630:		status: asString(handoff?.status || payload.status || "available"),
public/control-center/pages/ai-command.js:2631:		note: "Guidance only. No publishing, task creation, CRM updates, customer replies, workflow runs, exports, or backend actions are executed from this handoff."
public/control-center/pages/ai-command.js:2638:	const handoff = getSharedHandoff(projectName, "ai-command", operations);
public/control-center/pages/ai-command.js:2639:	const handoffId = getAiInboundHandoffId(handoff);
public/control-center/pages/ai-command.js:2684:	const durableHandoffId = getAiInboundDurableHandoffId(handoff);
public/control-center/pages/ai-command.js:2705:	if (typeof executeProjectAiCommand !== "function") throw new Error("AI command service is unavailable.");
public/control-center/pages/ai-command.js:2826:	if (aiContext.projectName) caps.push("Campaign planning");
public/control-center/pages/ai-command.js:2828:	if (aiContext.recommendations.length) caps.push(`${aiContext.recommendations.length} recommendations ready`);
public/control-center/pages/ai-command.js:2830:	if (aiContext.paid?.summary?.spend != null) caps.push("Paid media briefing");
public/control-center/pages/ai-command.js:3844:	const preferred = destinations.find((item) => !["chat-preview", "composer", "preview", "ai-command"].includes(asString(item)));
public/control-center/pages/ai-command.js:4124:				<button id="aicmdV2LegacyPreviewSendBtn" class="aicmd-v2-btn-secondary" type="button">Route Draft</button>
public/control-center/pages/ai-command.js:4230:                                        <button id="aicmdV2PreviewSendBtn" class="aicmd-v2-btn-primary" type="button">${escapeHtml(routeActionLabel)}</button>
public/control-center/pages/ai-command.js:4468:                                                <button id="aicmdV3ResponseSendBtn" class="aicmd-v2-btn-secondary" type="button">Route</button>
public/control-center/pages/ai-command.js:4609:					<span>Backend owns authority — AI Command prepares guidance and routes. It does not override execution controls.</span>
public/control-center/pages/ai-command.js:4660:	id: "ai-command",
public/control-center/pages/ai-command.js:4668:		<section class="page is-active" data-page="ai-command">
public/control-center/pages/ai-command.js:4710:		// ── HOME → AI COMMAND BRIDGE ────────────────────────────────
public/control-center/pages/ai-command.js:4995:			        const sendBtn = $("aicmdV2AskBtn");
public/control-center/pages/ai-command.js:5076:		                        source: "ai-command-chat"
public/control-center/pages/ai-command.js:5116:		                                source: "ai-command-specialist-chat",
public/control-center/pages/ai-command.js:5290:                const handoffBtn = $("aicmdV2HandoffBtn");
public/control-center/pages/ai-command.js:5334:				const opened = openAiToolDrawerFromMetadata({
public/control-center/pages/ai-command.js:5347:					updateStatus("Smart tool drawer is unavailable. Refresh AI Command and try again.");
public/control-center/pages/ai-command.js:5467:		const responseSendBtn = $("aicmdV3ResponseSendBtn");
public/control-center/pages/ai-command.js:5484:					source_page: "ai-command",
public/control-center/pages/ai-command.js:5561:		const previewSendBtn = $("aicmdV2PreviewSendBtn");
public/control-center/pages/ai-command.js:5573:					source_page: "ai-command",
public/control-center/pages/media-studio-workspace.js:26:import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";
public/control-center/pages/media-studio-workspace.js:71:    bestUse: "Before approvals and publishing handoff, especially for regulated or claim-sensitive content.",
public/control-center/pages/media-studio-workspace.js:86:    suggestedPrompt: "Act as Publishing Assistant. Produce a final publishing handoff summary with readiness status, blockers, approval notes, and channel delivery checklist."
public/control-center/pages/media-studio-workspace.js:170:  if (["publishing_ready", "publishing ready", "handoff", "ready_for_publishing"].includes(normalized)) return "publishing_ready";
public/control-center/pages/media-studio-workspace.js:651:    getSharedHandoff(projectName, "media-studio", operations, "ai-command") ||
public/control-center/pages/media-studio-workspace.js:797:    "Keep product identity accurate, leave safe text area, avoid unsupported claims, and prepare for Publishing handoff."
public/control-center/pages/media-studio-workspace.js:953:  if (purpose.includes("campaign")) usage.push("campaign");
public/control-center/pages/media-studio-workspace.js:1207:      why: `${ready.title} is ready for a safe Publishing package handoff.`
public/control-center/pages/media-studio-workspace.js:1213:      why: "A workflow handoff is available. Load it into the generator to continue the Workflows -> Media Studio -> package handoff flow."
public/control-center/pages/media-studio-workspace.js:1241:  const publishingConnected = hasBackend || capabilityFromOperations(operations, ["publishing", "handoff"]);
public/control-center/pages/media-studio-workspace.js:1248:    publishing_handoff: publishingConnected,
public/control-center/pages/media-studio-workspace.js:1261:  return "Generator backend not connected yet — your prompt/job is ready. Review it, save it as a draft, send it to AI Command, save it to Library, or connect a provider in Integrations before trying real output generation.";
public/control-center/pages/media-studio-workspace.js:1598:  if (normalized === "sent_to_publishing") return "Handoff Prepared";
public/control-center/pages/media-studio-workspace.js:1620:function getMediaSourceReadiness(session, selectedItem, handoff) {
public/control-center/pages/media-studio-workspace.js:1657:function getMediaReadinessItems(session, selectedItem, handoff) {
public/control-center/pages/media-studio-workspace.js:1660:  const source = getMediaSourceReadiness(session, selectedItem, handoff);
public/control-center/pages/media-studio-workspace.js:1718:function renderMediaReadinessSummary({ session, selectedItem, handoff, escapeHtml }) {
public/control-center/pages/media-studio-workspace.js:1719:  const items = getMediaReadinessItems(session, selectedItem, handoff);
public/control-center/pages/media-studio-workspace.js:1733:function renderMediaCommandHeader({ projectName, session, metrics, selectedItem, handoff, recommendation, escapeHtml }) {
public/control-center/pages/media-studio-workspace.js:1740:  const handoffLabel = handoff ? "Brief available" : "No inbound brief";
public/control-center/pages/media-studio-workspace.js:1748:          <p class="media-section-copy">Start by choosing Image, Video, Voice, or Campaign Pack. Generate a prompt first, then use Generate Output only when a provider/backend is connected. Save drafts for review, save reusable results to Library, or prepare a Publishing handoff without publishing directly.</p>
public/control-center/pages/media-studio-workspace.js:1769:        <button id="mediaSendAiCommandBtn" class="btn btn-secondary" type="button">Open AI Command Review</button>
public/control-center/pages/media-studio-workspace.js:1775:function getMediaWorkflowSteps(session, selectedItem, handoff) {
public/control-center/pages/media-studio-workspace.js:1778:  const source = getMediaSourceReadiness(session, selectedItem, handoff);
public/control-center/pages/media-studio-workspace.js:1820:function renderMediaWorkflowStrip({ session, selectedItem, handoff, escapeHtml }) {
public/control-center/pages/media-studio-workspace.js:1821:  const steps = getMediaWorkflowSteps(session, selectedItem, handoff);
public/control-center/pages/media-studio-workspace.js:1823:    <nav class="media-workflow-strip" id="mediaWorkflowStrip" aria-label="Media Studio workflow: Brief Source Generate Prepare Review Save to Library Handoff">
public/control-center/pages/media-studio-workspace.js:1824:      <div class="media-workflow-title">Brief &rarr; Source &rarr; Generate/Prepare &rarr; Review &rarr; Save to Library &rarr; Handoff</div>
public/control-center/pages/media-studio-workspace.js:1856:        <div class="media-overview-item"><span>Publishing-ready handoffs</span><strong>${escapeHtml(formatCount(metrics.publishingReady))}</strong></div>
public/control-center/pages/media-studio-workspace.js:1893:        <button id="mediaSendAiCommandBtn" class="btn btn-secondary" type="button">Open AI Command Review</button>
public/control-center/pages/media-studio-workspace.js:1936:          <p class="media-section-copy">Choose a media mode, prepare a prompt/job-ready draft, then render with a connected provider or continue safely with review and handoff.</p>
public/control-center/pages/media-studio-workspace.js:1947:            Start here: choose Image, Video, Voice, or Campaign Pack. Complete the brief, generate or improve the prompt, then use Generate Output only when a provider/backend is connected. If generation is unavailable or times out, keep the prompt/job-ready draft and continue with review, Library save, AI Command review, or provider setup in Integrations.
public/control-center/pages/media-studio-workspace.js:1965:        ${renderField({ id: "mediaPromptInput", name: "prompt", label: "Prompt / brief", value: form.prompt, multiline: true, rows: 7, helper: "Use this as the creative brief. If no generation provider is connected, Media Studio keeps it as a prompt/job-ready draft for review, Library save, AI review, or provider handoff." }, session, escapeHtml)}
public/control-center/pages/media-studio-workspace.js:1990:        <span class="card-badge neutral">${escapeHtml(handoff ? "Handoff available" : "Context")}</span>
public/control-center/pages/media-studio-workspace.js:1994:        <button id="mediaPromptFromHandoffBtn" class="btn btn-secondary" type="button">Generate from workflow handoff</button>
public/control-center/pages/media-studio-workspace.js:2033:    <section class="card media-card" id="mediaWorkflowHandoff">
public/control-center/pages/media-studio-workspace.js:2052:        <button id="mediaLoadHandoffBtn" class="btn btn-secondary" type="button">${escapeHtml(buttonLabel)}</button>
public/control-center/pages/media-studio-workspace.js:2069:        <div class="empty-box">Start a media job or load a workflow handoff to create the first prompt-ready draft.</div>
public/control-center/pages/media-studio-workspace.js:2537:        <button class="btn btn-secondary" type="button" data-media-specialist-ai="${escapeHtml(specialist.id)}">Open AI Command Review</button>
public/control-center/pages/media-studio-workspace.js:2596:    ["publishing handoff", readiness.publishing_handoff],
public/control-center/pages/media-studio-workspace.js:2616:      ${!readiness.image_generation_backend || !readiness.video_generation_backend || !readiness.voice_generation_backend ? `<div class="simple-banner media-block-gap">${escapeHtml("Generator backend not connected yet — your prompt/job is ready. Review it, save it as a draft, send it to AI Command, save it to Library, or connect a provider in Integrations before trying real output generation.")}</div>` : ""}
public/control-center/pages/media-studio-workspace.js:2636:function buildPublishingHandoff(projectName, session, selectedItem) {
public/control-center/pages/media-studio-workspace.js:2644:    destination_role: MEDIA_ROLE_DEFAULTS.handoffRole,
public/control-center/pages/media-studio-workspace.js:2663:      title: source.title || session.form.title || "Media handoff",
public/control-center/pages/media-studio-workspace.js:2677:        title: source.title || session.form.title || "Media handoff",
public/control-center/pages/media-studio-workspace.js:2774:          notes: firstText(response.message, "Generator backend not connected yet — your prompt/job is ready. Review it, save it as a draft, send it to AI Command, save it to Library, or connect a provider in Integrations before trying real output generation."),
public/control-center/pages/media-studio-workspace.js:2780:        session.draftMessage = response.message || "Generator backend not connected yet — your prompt/job is ready. Review it, save it as a draft, send it to AI Command, save it to Library, or connect a provider in Integrations before trying real output generation.";
public/control-center/pages/media-studio-workspace.js:2919:  const fromHandoffBtn = document.getElementById("mediaPromptFromHandoffBtn");
public/control-center/pages/media-studio-workspace.js:2924:        session.draftMessage = "No workflow handoff is available.";
public/control-center/pages/media-studio-workspace.js:3019:  const loadHandoffBtn = document.getElementById("mediaLoadHandoffBtn");
public/control-center/pages/media-studio-workspace.js:3085:        sendPublishingHandoff({ projectName, backendProjectName, session, selectedItem: item, navigateTo, showMessage, showError });
public/control-center/pages/media-studio-workspace.js:3140:            summary: session.form.reviewNotes || "Review media output before publishing handoff.",
public/control-center/pages/media-studio-workspace.js:3209:            handoff_roles: [MEDIA_ROLE_DEFAULTS.handoffRole, MEDIA_ROLE_DEFAULTS.reviewRole],
public/control-center/pages/media-studio-workspace.js:3231:  const sendAiBtn = document.getElementById("mediaSendAiCommandBtn");
public/control-center/pages/media-studio-workspace.js:3232:  if (sendAiBtn) {
public/control-center/pages/media-studio-workspace.js:3233:    sendAiBtn.onclick = () => {
public/control-center/pages/media-studio-workspace.js:3245:      setSharedHandoff(projectName, "ai-command", {
public/control-center/pages/media-studio-workspace.js:3247:        destination_page: "ai-command",
public/control-center/pages/media-studio-workspace.js:3261:      navigateTo("ai-command");
public/control-center/pages/media-studio-workspace.js:3262:      showMessage?.("Media context sent to AI Command.");
public/control-center/pages/media-studio-workspace.js:3275:      sendPublishingHandoff({ projectName, backendProjectName, session, selectedItem: selected(), navigateTo, showMessage, showError });
public/control-center/pages/media-studio-workspace.js:3371:        await sendPublishingHandoff({ projectName, backendProjectName, session, selectedItem: selected(), navigateTo, showMessage, showError });
public/control-center/pages/media-studio-workspace.js:3411:        setSharedHandoff(projectName, "ai-command", {
public/control-center/pages/media-studio-workspace.js:3413:          destination_page: "ai-command",
public/control-center/pages/media-studio-workspace.js:3426:        navigateTo("ai-command");
public/control-center/pages/media-studio-workspace.js:3427:        showMessage?.(`${specialist.title} prompt opened in AI Command.`);
public/control-center/pages/media-studio-workspace.js:3434:async function sendPublishingHandoff({ projectName, backendProjectName, session, selectedItem, navigateTo, showMessage, showError }) {
public/control-center/pages/media-studio-workspace.js:3435:  const handoff = buildPublishingHandoff(projectName, session, selectedItem);
public/control-center/pages/media-studio-workspace.js:3441:    setSharedHandoff(scope, "publishing", handoff);
public/control-center/pages/media-studio-workspace.js:3447:      showMessage?.("Publishing package handoff prepared from Media Studio.");
public/control-center/pages/media-studio-workspace.js:3449:      showMessage?.("Publishing package handoff kept locally because backend handoff save is unavailable.");
public/control-center/pages/media-studio-workspace.js:3452:    showMessage?.("Publishing package handoff prepared locally.");
public/control-center/pages/media-studio-workspace.js:3526:              <p class="media-section-copy">Start with a brief or handoff. Attach Library assets when needed. Review creative readiness and brand compliance. Save approved assets to Library or prepare handoff to Publishing/Governance. All routing is handoff/review-based and user-triggered. Media Studio does not publish, send, or approve directly.</p>
public/control-center/pages/media-studio-workspace.js:3535:      const sourceState = getMediaSourceReadiness(session, selectedItem, handoff);
public/control-center/pages/media-studio-workspace.js:3540:      if (selectedItem?.campaign) rows.push(["Campaign", selectedItem.campaign]);
public/control-center/pages/media-studio-workspace.js:3566:      const readinessItems = getMediaReadinessItems(session, selectedItem, handoff)
public/control-center/pages/media-studio-workspace.js:3591:      const readinessItems = getMediaReadinessItems(session, selectedItem, handoff)
public/control-center/pages/media-studio-workspace.js:3618:        ${renderMediaCommandHeader({ projectName, session, metrics, selectedItem, handoff, recommendation, escapeHtml })}
public/control-center/pages/media-studio-workspace.js:3619:        ${renderMediaWorkflowStrip({ session, selectedItem, handoff, escapeHtml })}
public/control-center/pages/media-studio-workspace.js:3620:        ${renderMediaReadinessSummary({ session, selectedItem, handoff, escapeHtml })}
public/control-center/pages/media-studio-workspace.js:3622:        ${session.loading ? `<div class="empty-box">Loading media jobs, handoffs, approvals, tasks, and event history...</div>` : ""}
public/control-center/pages/publishing/publishing-payloads.js:105:export function buildPublishingAiPrompt(projectName, selectedItem, session, handoff) {
public/control-center/pages/research.js:10:  ai: { route: "ai-command", label: "AI Command", destinationRole: "admin", destinationDomain: "governance" }
public/control-center/pages/research.js:894:      navigateTo("ai-command");
public/control-center/pages/research.js:903:        setSharedHandoff(projectName, "ai-command", {
public/control-center/pages/research.js:905:          destination_page: "ai-command",
public/control-center/pages/research.js:919:          destination_page: "ai-command",
public/control-center/pages/research.js:937:        navigateTo("ai-command");
public/control-center/pages/research.js:939:        showMessage?.("Research prompt added to AI Command.");
public/control-center/pages/research.js:941:        showError?.(error?.message || "Failed to hand off the research prompt to AI Command.");
public/control-center/pages/research.js:1564:                  <button class="quick-action-btn" type="button" data-research-route="campaign">Send to Campaign Studio</button>
public/control-center/pages/research.js:1583:            <button class="btn ghost" type="button" data-research-open>Open AI: Review in AI Workspace</button>
public/control-center/pages/research.js:1584:            <button class="btn btn-secondary" type="button" data-research-route="ai">Send to AI Workspace</button>
public/control-center/pages/content-studio-workspace.js:16:import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";
public/control-center/pages/content-studio-workspace.js:187:  if (["sent_to_media", "sent to media", "media_handoff", "media handoff"].includes(normalized)) return "sent_to_media";
public/control-center/pages/content-studio-workspace.js:188:  if (["sent_to_publishing", "sent to publishing", "publishing_handoff", "publishing handoff"].includes(normalized)) return "sent_to_publishing";
public/control-center/pages/content-studio-workspace.js:620:  if (!clean(form.brief) && intent !== "load-handoff") errors.brief = "Main prompt / brief is required.";
public/control-center/pages/content-studio-workspace.js:761:    getSharedHandoff(projectName, "content-studio", operations, "ai-command") ||
public/control-center/pages/content-studio-workspace.js:781:    const [contentItems, tasks, approvals, handoffs, events, operations] = await Promise.all([
public/control-center/pages/content-studio-workspace.js:828:      why: "A clear first draft unlocks versioning, review, and downstream media/publishing handoffs."
public/control-center/pages/content-studio-workspace.js:1096:    ["Media handoff", selectedItem?.status === "approved" || selectedItem?.status === "sent_to_media" ? "Ready" : "Prepare"],
public/control-center/pages/content-studio-workspace.js:1234:        <button id="contentSendAiBtn" class="btn btn-secondary" type="button">Open AI: Send Context to AI Workspace</button>
public/control-center/pages/content-studio-workspace.js:1237:      ${handoff ? `<div class="simple-banner" style="margin-top:12px;">Inbound handoff from ${escapeHtml(titleCase(handoff.sourcePage || "workflow"))} is available below.</div>` : ""}
public/control-center/pages/content-studio-workspace.js:1432:              <button class="btn btn-secondary" type="button" data-content-agent-ai="${escapeHtml(agent.id)}">Send to AI Workspace</button>
public/control-center/pages/content-studio-workspace.js:1448:            <h3>No inbound handoff available</h3>
public/control-center/pages/content-studio-workspace.js:1452:        <div class="empty-box">Run AI Command or Workflows and route output to Content Studio to prefill the composer.</div>
public/control-center/pages/content-studio-workspace.js:1469:        <div class="content-data-item"><span>Campaign</span><strong>${escapeHtml(firstText(handoff.campaign, "-"))}</strong></div>
public/control-center/pages/content-studio-workspace.js:1498:function buildMediaHandoff(projectName, session, selectedItem) {
public/control-center/pages/content-studio-workspace.js:1544:function buildPublishingHandoff(projectName, session, selectedItem) {
public/control-center/pages/content-studio-workspace.js:1745:async function sendHandoff({ projectName, handoff, session, showMessage, failMessage, successMessage, localMessage }) {
public/control-center/pages/content-studio-workspace.js:1838:        session.draftMessage = "No inbound handoff is available.";
public/control-center/pages/content-studio-workspace.js:1846:        campaign: firstText(handoff.campaign, session.form.campaign),
public/control-center/pages/content-studio-workspace.js:1909:              notes: "Generated via AI command backend."
public/control-center/pages/content-studio-workspace.js:2028:  const sendAiBtn = document.getElementById("contentSendAiBtn");
public/control-center/pages/content-studio-workspace.js:2029:  if (sendAiBtn) {
public/control-center/pages/content-studio-workspace.js:2030:    sendAiBtn.onclick = () => {
public/control-center/pages/content-studio-workspace.js:2042:      setSharedHandoff(projectName || "__default__", "ai-command", {
public/control-center/pages/content-studio-workspace.js:2044:        destination_page: "ai-command",
public/control-center/pages/content-studio-workspace.js:2058:      navigateTo("ai-command");
public/control-center/pages/content-studio-workspace.js:2059:      showMessage?.("Content context sent to AI Command.");
public/control-center/pages/content-studio-workspace.js:2072:      const handoffPayload = buildMediaHandoff(projectName, session, selectedItem);
public/control-center/pages/content-studio-workspace.js:2078:        failMessage: "Design brief kept locally because backend handoff save is unavailable.",
public/control-center/pages/content-studio-workspace.js:2104:      const handoffPayload = buildPublishingHandoff(projectName, session, selectedItem);
public/control-center/pages/content-studio-workspace.js:2110:        failMessage: "Publishing handoff kept locally because backend save is unavailable.",
public/control-center/pages/content-studio-workspace.js:2111:        successMessage: "Publishing handoff created.",
public/control-center/pages/content-studio-workspace.js:2112:        localMessage: "Publishing handoff created locally."
public/control-center/pages/content-studio-workspace.js:2223:        setSharedHandoff(projectName || "__default__", "ai-command", {
public/control-center/pages/content-studio-workspace.js:2225:          destination_page: "ai-command",
public/control-center/pages/content-studio-workspace.js:2238:        navigateTo("ai-command");
public/control-center/pages/content-studio-workspace.js:2239:        showMessage?.(`${agent.title} prompt sent to AI Command.`);
public/control-center/pages/content-studio-workspace.js:2312:        if (handoff.campaign) sourceLines.push(`<div><strong>Campaign:</strong> ${escapeHtml(handoff.campaign)}</div>`);
public/control-center/pages/content-studio-workspace.js:2315:        sourceLines.push(`<div><strong>Handoff type:</strong> ${handoff.id ? "AI/Workflow" : "Unknown"}</div>`);
public/control-center/pages/content-studio-workspace.js:2319:        if (item.campaign) sourceLines.push(`<div><strong>Campaign:</strong> ${escapeHtml(item.campaign)}</div>`);
public/control-center/pages/content-studio-workspace.js:2327:        sourceLines.push(`<div>No source context attached yet. Use AI Command or Library to attach source-backed content.</div>`);
public/control-center/pages/content-studio-workspace.js:2329:      sourceLines.push(`<div class="content-hint content-readiness-hint">Source context helps the reviewer verify claims before routing.</div>`);
public/control-center/pages/setup.js:1153:      navigateTo("ai-command");
public/control-center/pages/setup.js:1154:      showMessage?.("Setup context sent to AI Command.");
public/control-center/pages/setup.js:1647:              <button id="setupAiCommandBtn" class="btn btn-ghost" type="button">Open AI Command with Setup Context</button>
public/control-center/pages/integrations/builders.js:489:      description: "Automation and coordination tools that help orchestrate tasks, handoffs, notifications, and AI-assisted operations.",
public/control-center/pages/integrations/cards.js:140:    return { action: "select", label: "Open details" };
public/control-center/pages/integrations/cards.js:254:          ? `<button class="btn btn-secondary" type="button" data-integration-select="${esc(card.id)}">Open details</button>`
public/control-center/pages/campaign-studio.js:1:import { getSharedCampaignRecord, getSharedHandoff, setSharedCampaignRecord, setSharedHandoff } from "../shared-context.js";
public/control-center/pages/campaign-studio.js:67:  "ai-command": { role: "admin", domain: "governance" }
public/control-center/pages/campaign-studio.js:284:    session.lastAiHandoffId = asString(session.lastAiHandoffId);
public/control-center/pages/campaign-studio.js:380:  const handoff = getSharedHandoff(projectName, "campaign-studio", operations, "ai-command");
public/control-center/pages/campaign-studio.js:382:  if (!handoffId || handoffId === asString(session.lastAiHandoffId)) return false;
public/control-center/pages/campaign-studio.js:425:    source_page: "ai-command",
public/control-center/pages/campaign-studio.js:856:  if (!values.budget) adsBlockers.push("Add a working campaign budget before routing to Ads Manager.");
public/control-center/pages/campaign-studio.js:857:  if (!channelMix.paid.length) adsBlockers.push("No paid channel recommendation is strong enough yet.");
public/control-center/pages/campaign-studio.js:859:    adsBlockers.push("No paid media platform is connected.");
public/control-center/pages/campaign-studio.js:867:    trackingBlockers.push("Campaign naming and goal framing should be locked before measurement packages are generated.");
public/control-center/pages/campaign-studio.js:875:  if (!values.offerDetail) seoBlockers.push("Offer detail is too light to brief landing pages and SEO content well.");
public/control-center/pages/campaign-studio.js:1328:      setSharedHandoff(projectName, "ai-command", {
public/control-center/pages/campaign-studio.js:1330:        destination_page: "ai-command",
public/control-center/pages/campaign-studio.js:1341:        destination_page: "ai-command",
public/control-center/pages/campaign-studio.js:1343:        destination_role: CAMPAIGN_ROUTE_ROLES["ai-command"].role,
public/control-center/pages/campaign-studio.js:1345:        destination_service_domain: CAMPAIGN_ROUTE_ROLES["ai-command"].domain,
public/control-center/pages/campaign-studio.js:1362:      navigateTo("ai-command");
public/control-center/pages/campaign-studio.js:1363:      showMessage?.("Campaign context sent to AI Command.");
public/control-center/pages/campaign-studio.js:1370:      persistCampaignRouteHandoff({ projectName, session, destinationPage: "publishing", createProjectHandoff });
public/control-center/pages/campaign-studio.js:1391:      persistCampaignRouteHandoff({ projectName, session, destinationPage: "media-studio", createProjectHandoff });
public/control-center/pages/campaign-studio.js:1960:                Send campaign context to AI prefills the current campaign draft and then navigates there. The downstream send actions open the linked workspace with the current campaign context attached.
public/control-center/pages/campaign-studio.js:1972:                  <span class="home-action-title">Send campaign context to AI</span>
public/control-center/pages/campaign-studio.js:1973:                  <span class="home-action-meta">Prefill AI Command with the current draft, blockers, and campaign context, then open that page.</span>
public/control-center/pages/campaign-studio.js:1979:                  <span class="home-action-meta">Open Content Studio with a campaign handoff attached.</span>
public/control-center/pages/campaign-studio.js:1983:                  <span class="home-action-meta">Open Media Studio with a campaign handoff attached.</span>
public/control-center/pages/campaign-studio.js:1987:                  <span class="home-action-meta">Open Publishing with a campaign handoff attached.</span>
public/control-center/pages/campaign-studio.js:1991:                  <span class="home-action-meta">Open Ads Manager with a campaign handoff attached.</span>
public/control-center/pages/ads-manager.js:270:      navigateTo("ai-command");
public/control-center/pages/ads-manager.js:271:      showMessage?.("Paid media prompt added to AI Command.");
public/control-center/pages/integrations.js:357:        enables: "Campaign sending, lifecycle messages, and email workflow execution.",
public/control-center/pages/integrations.js:358:        dataScope: ["Sending", "Delivery", "Campaign email", "Lifecycle email"],
public/control-center/pages/integrations.js:361:        primaryField: "senderEmail",
public/control-center/pages/integrations.js:363:          { key: "senderEmail", label: "Sender email", placeholder: "support@brand.com", required: true },
public/control-center/pages/integrations.js:379:        permissionScope: "Provider API key + sender domain",
public/control-center/pages/integrations.js:382:          { key: "providerName", label: "Provider name", placeholder: "SendGrid / Mailgun / Resend", required: true },
public/control-center/pages/integrations.js:384:          { key: "senderDomain", label: "Sender domain", placeholder: "brand.com" }
public/control-center/pages/integrations.js:868:  if (integration.id === "mailer" && field.key === "senderDomain") {
public/control-center/pages/integrations.js:1536:      navigateTo("ai-command");
public/control-center/pages/integrations.js:1537:      showMessage?.("Diagnostics prompt added to AI Command.");
public/control-center/pages/insights.js:682:    systemLessons.push("Connect paid performance so creative and audience learnings can improve ad spend efficiency.");
public/control-center/pages/insights.js:701:      meta: `These sources are connected but still not sending analytics into the Insight Engine: ${platformsAwaitingFeed.join(", ")}.`,
public/control-center/pages/insights.js:950:      navigateTo("ai-command");
public/control-center/pages/insights.js:999:          destination_page: "ai-command",
public/control-center/pages/insights.js:1015:        setSharedHandoff(projectName, "ai-command", handoff);
public/control-center/pages/insights.js:1021:      navigateTo("ai-command");
public/control-center/pages/insights.js:1022:      showMessage?.("Insight prompt added to AI Command.");
public/control-center/pages/insights.js:1346:            <button class="btn btn-primary" type="button" data-insights-route="campaign-studio">Navigate: Open Campaign Studio</button>
public/control-center/pages/insights.js:1397:            Use AI Workspace to dig deeper into the current signal. Opening AI Workspace only navigates. Sending a prompt prefills context and navigates.
public/control-center/pages/insights.js:1400:            <button class="btn ghost" type="button" data-insights-open>Open AI: Review in AI Workspace</button>
public/control-center/pages/library.js:829:    source_label: sourceKind === "backend" ? "Media Studio (backend handoff)" : "Media Studio (local handoff)"
public/control-center/pages/library.js:1220:        <div class="library-preview-copy">Inline preview is not available yet for this document type. You can open the file or send it to AI extraction.</div>
public/control-center/pages/library.js:1904:        <button type="button" class="btn btn-primary std-ai-btn" aria-label="Use as Source in AI Command" data-library-use-ai-source="${escapeHtml(selectedAsset.id)}">Use as Source in AI Command</button>
public/control-center/pages/library.js:1907:          <span class="library-inspector-ai-source-guide-text">Select one Library item, then click Use as Source in AI Command.</span>
public/control-center/pages/library.js:1933:      useBtn.textContent = "Use as Source in AI Command";
public/control-center/pages/library.js:1934:      useBtn.setAttribute("aria-label", "Use as Source in AI Command");
public/control-center/pages/library.js:1957:        navigateTo("ai-command");
public/control-center/pages/library.js:2094:      navigateTo("ai-command");
public/control-center/pages/library.js:2499:      const open = dropdown.classList.contains("is-open");
public/control-center/pages/library.js:2824:      navigateTo("ai-command");
public/control-center/pages/library.js:2834:      navigateTo("ai-command");
public/control-center/pages/library.js:2849:      navigateTo("ai-command");
public/control-center/pages/library.js:2863:      navigateTo("ai-command");
public/control-center/pages/library.js:2868:  const sendToAiBtn = document.querySelector("[data-library-command=\"send-to-ai\"]");
public/control-center/pages/library.js:2869:  if (sendToAiBtn && !sendToAiBtn.disabled) {
public/control-center/pages/library.js:2870:    sendToAiBtn.onclick = () => {
public/control-center/pages/library.js:2878:      showMessage?.(`AI context prepared for ${selectedAsset.name}. Open AI Command to review recommendations.`);
public/control-center/pages/library.js:2879:      navigateTo("ai-command");
public/control-center/pages/library.js:2917:          title: "Choose source for AI Command",
public/control-center/pages/library.js:2919:            "Select one Library item, then click Use as Source in AI Command.",
public/control-center/pages/library.js:2923:            { id: "back-to-ai-command", label: "Back to Drawer" },

## CSS references for AI Command
public/control-center/styles/08-components-foundation.css:648:.home-ai-team-grid {
public/control-center/styles/08-components-foundation.css:657:.home-ai-team-grid {
public/control-center/styles/08-components-foundation.css:731:.home-ai-agent-card,
public/control-center/styles/08-components-foundation.css:911:  .home-ai-team-grid,
public/control-center/styles/08-components-foundation.css:1075:.mhos-tool-drawer[hidden] {
public/control-center/styles/08-components-foundation.css:1079:.mhos-tool-drawer {
public/control-center/styles/08-components-foundation.css:1088:.mhos-tool-drawer.is-open {
public/control-center/styles/08-components-foundation.css:1092:.mhos-tool-drawer-backdrop {
public/control-center/styles/08-components-foundation.css:1099:.mhos-tool-drawer-card {
public/control-center/styles/08-components-foundation.css:1125:.mhos-tool-drawer-head,
public/control-center/styles/08-components-foundation.css:1126:.mhos-tool-drawer-title-block,
public/control-center/styles/08-components-foundation.css:1127:.mhos-tool-drawer-actions {
public/control-center/styles/08-components-foundation.css:1133:.mhos-tool-drawer-head {
public/control-center/styles/08-components-foundation.css:1138:.mhos-tool-drawer-icon {
public/control-center/styles/08-components-foundation.css:1149:.mhos-tool-drawer-kicker,
public/control-center/styles/08-components-foundation.css:1150:.mhos-tool-drawer-title-block h3,
public/control-center/styles/08-components-foundation.css:1151:.mhos-tool-drawer-description {
public/control-center/styles/08-components-foundation.css:1155:.mhos-tool-drawer-kicker {
public/control-center/styles/08-components-foundation.css:1163:.mhos-tool-drawer-title-block h3 {
public/control-center/styles/08-components-foundation.css:1168:.mhos-tool-drawer-close {
public/control-center/styles/08-components-foundation.css:1178:.mhos-tool-drawer-description {
public/control-center/styles/08-components-foundation.css:1185:.mhos-tool-drawer-grid {
public/control-center/styles/08-components-foundation.css:1190:.mhos-tool-drawer-section {
public/control-center/styles/08-components-foundation.css:1199:.mhos-tool-drawer-section-label {
public/control-center/styles/08-components-foundation.css:1208:.mhos-tool-drawer-selected-source {
public/control-center/styles/08-components-foundation.css:1218:.mhos-tool-drawer-note {
public/control-center/styles/08-components-foundation.css:1230:.mhos-tool-drawer-actions {
public/control-center/styles/08-components-foundation.css:1245:  .mhos-tool-drawer {
public/control-center/styles/08-components-foundation.css:1250:  .mhos-tool-drawer-card {
public/control-center/styles/08-components-foundation.css:1260:.mhos-tool-drawer {
public/control-center/styles/08-components-foundation.css:1264:.mhos-tool-drawer-card {
public/control-center/styles/08-components-foundation.css:1274:.mhos-tool-drawer-head {
public/control-center/styles/08-components-foundation.css:1284:.mhos-tool-drawer-title-block h3 {
public/control-center/styles/08-components-foundation.css:1289:.mhos-tool-drawer-description {
public/control-center/styles/08-components-foundation.css:1296:.mhos-tool-drawer-section {
public/control-center/styles/08-components-foundation.css:1300:.mhos-tool-drawer-chip {
public/control-center/styles/08-components-foundation.css:1307:.mhos-tool-drawer-chip:hover {
public/control-center/styles/08-components-foundation.css:1313:.mhos-tool-drawer-actions {
public/control-center/styles/08-components-foundation.css:1324:.mhos-tool-drawer-actions .btn {
public/control-center/styles/08-components-foundation.css:1329:  .mhos-tool-drawer {
public/control-center/styles/08-components-foundation.css:1333:  .mhos-tool-drawer-card {
public/control-center/styles/08-components-foundation.css:1343:.mhos-tool-drawer-select {
public/control-center/styles/08-components-foundation.css:1356:.mhos-tool-drawer-select:focus {
public/control-center/styles/08-components-foundation.css:1361:.mhos-tool-drawer-two-col {
public/control-center/styles/08-components-foundation.css:1367:.mhos-tool-drawer-two-col label {
public/control-center/styles/08-components-foundation.css:1377:.mhos-tool-drawer-summary {
public/control-center/styles/08-components-foundation.css:1387:.mhos-tool-drawer-summary span {
public/control-center/styles/08-components-foundation.css:1397:.mhos-tool-drawer-summary p {
public/control-center/styles/08-components-foundation.css:1405:  .mhos-tool-drawer-two-col {
public/control-center/styles/08-components-foundation.css:1411:.mhos-tool-drawer-actions {
public/control-center/styles/08-components-foundation.css:1416:  .mhos-tool-drawer-actions {
public/control-center/styles/08-components-foundation.css:1422:.mhos-tool-drawer-field {
public/control-center/styles/08-components-foundation.css:1433:.mhos-tool-drawer-input,
public/control-center/styles/08-components-foundation.css:1434:.mhos-tool-drawer-textarea {
public/control-center/styles/08-components-foundation.css:1446:.mhos-tool-drawer-textarea {
public/control-center/styles/08-components-foundation.css:1452:.mhos-tool-drawer-input:focus,
public/control-center/styles/08-components-foundation.css:1453:.mhos-tool-drawer-textarea:focus {
public/control-center/styles/08-components-foundation.css:1458:.mhos-tool-drawer-description {
public/control-center/styles/08-components-foundation.css:1462:.mhos-tool-drawer-select option {
public/control-center/styles/08-components-foundation.css:1467:.mhos-tool-drawer-section-label {
public/control-center/styles/08-components-foundation.css:1474:.mhos-tool-drawer-local-preview {
public/control-center/styles/08-components-foundation.css:1484:.mhos-tool-drawer-local-preview[hidden] {
public/control-center/styles/08-components-foundation.css:1488:.mhos-tool-drawer-local-preview span {
public/control-center/styles/08-components-foundation.css:1498:.mhos-tool-drawer-local-preview pre {
public/control-center/styles/08-components-foundation.css:1508:.mhos-tool-drawer-summary span {
public/control-center/styles/08-components-foundation.css:1512:.mhos-tool-drawer-actions [data-aicmd-tool-drawer-open-library] {
public/control-center/styles/08-components-foundation.css:1518:.mhos-tool-drawer-selected-source[data-aicmd-tool-drawer-selected-source] {
public/control-center/styles/08-components-foundation.css:1522:.mhos-tool-drawer-source-card {
public/control-center/styles/08-components-foundation.css:1534:.mhos-tool-drawer-source-eyebrow {
public/control-center/styles/08-components-foundation.css:1541:.mhos-tool-drawer-source-main {
public/control-center/styles/08-components-foundation.css:1548:.mhos-tool-drawer-source-meta {
public/control-center/styles/08-components-foundation.css:1552:.mhos-tool-drawer-source-path {
public/control-center/styles/08-components-foundation.css:1560:.mhos-tool-drawer-source-actions {
public/control-center/styles/08-components-foundation.css:1565:.mhos-tool-drawer-selected-source-empty {
public/control-center/styles/08-components-foundation.css:1571:.mhos-tool-drawer-warning {
public/control-center/styles/08-components-foundation.css:1581:.mhos-tool-drawer-warning[hidden] {
public/control-center/styles/08-components-foundation.css:1585:.mhos-tool-drawer-actions {
public/control-center/styles/12-pages.css:109:/* --- AI Command Header Session Density Polish --- */
public/control-center/styles/12-pages.css:110:[data-page="ai-command"] .aicmd-room-header {
public/control-center/styles/12-pages.css:117:[data-page="ai-command"] .aicmd-room-title {
public/control-center/styles/12-pages.css:123:[data-page="ai-command"] .aicmd-room-subtitle {
public/control-center/styles/12-pages.css:130:[data-page="ai-command"] .aicmd-room-header-actions {
public/control-center/styles/12-pages.css:136:[data-page="ai-command"] .aicmd-room-session-select {
public/control-center/styles/12-pages.css:141:[data-page="ai-command"] .aicmd-room-header-actions .aicmd-v2-btn-secondary,
public/control-center/styles/12-pages.css:142:[data-page="ai-command"] .aicmd-room-header-actions .aicmd-v2-btn-ghost {
public/control-center/styles/12-pages.css:148:[data-page="ai-command"] .aicmd-room-flow {
public/control-center/styles/12-pages.css:154:[data-page="ai-command"] .aicmd-room-flow-step {
public/control-center/styles/12-pages.css:162:[data-page="ai-command"] .aicmd-room-flow-step strong {
public/control-center/styles/12-pages.css:166:[data-page="ai-command"] .aicmd-room-flow-step small {
public/control-center/styles/12-pages.css:170:[data-page="ai-command"] .aicmd-room-status-strip {
public/control-center/styles/12-pages.css:179:/* --- AI Command Chat-First Unified Surface --- */
public/control-center/styles/12-pages.css:180:[data-page="ai-command"] .aicmd-unified-chat-surface {
public/control-center/styles/12-pages.css:193:[data-page="ai-command"] .aicmd-unified-chat-surface > * {
public/control-center/styles/12-pages.css:197:[data-page="ai-command"] .aicmd-unified-chat-surface > *:not(:last-child) {
public/control-center/styles/12-pages.css:201:[data-page="ai-command"] .aicmd-unified-chat-surface .aicmd-room-conversation-head {
public/control-center/styles/12-pages.css:209:[data-page="ai-command"] .aicmd-room-specialist-conversation {
public/control-center/styles/12-pages.css:217:[data-page="ai-command"] .aicmd-v2-composer.aicmd-room-composer.aicmd-chatgpt-composer {
public/control-center/styles/12-pages.css:226:[data-page="ai-command"] .aicmd-v2-composer-head {
public/control-center/styles/12-pages.css:234:[data-page="ai-command"] .aicmd-v2-composer-title-row {
public/control-center/styles/12-pages.css:241:[data-page="ai-command"] .aicmd-v2-composer-icon {
public/control-center/styles/12-pages.css:256:[data-page="ai-command"] .aicmd-v2-composer-label {
public/control-center/styles/12-pages.css:263:[data-page="ai-command"] .aicmd-v2-draft-state {
public/control-center/styles/12-pages.css:270:[data-page="ai-command"] .aicmd-chatgpt-input-shell {
public/control-center/styles/12-pages.css:274:[data-page="ai-command"] .aicmd-v2-textarea.aicmd-chatgpt-textarea {
public/control-center/styles/12-pages.css:289:[data-page="ai-command"] .aicmd-v2-textarea.aicmd-chatgpt-textarea:focus {
public/control-center/styles/12-pages.css:294:[data-page="ai-command"] .aicmd-chatgpt-toolbar {
public/control-center/styles/12-pages.css:302:[data-page="ai-command"] .aicmd-chatgpt-tools-left,
public/control-center/styles/12-pages.css:303:[data-page="ai-command"] .aicmd-chatgpt-tools-right {
public/control-center/styles/12-pages.css:309:[data-page="ai-command"] .aicmd-chatgpt-icon-btn {
public/control-center/styles/12-pages.css:323:[data-page="ai-command"] .aicmd-chatgpt-enter-hint {
public/control-center/styles/12-pages.css:328:[data-page="ai-command"] .aicmd-chatgpt-send-btn {
public/control-center/styles/12-pages.css:340:[data-page="ai-command"] .aicmd-chatgpt-send-btn:disabled {
public/control-center/styles/12-pages.css:345:[data-page="ai-command"] .aicmd-chatgpt-context-row {
public/control-center/styles/12-pages.css:350:[data-page="ai-command"] #aicmdV2Status {
public/control-center/styles/12-pages.css:1146:.home-ai-team-grid,
public/control-center/styles/12-pages.css:1327:.home-ai-team-card,
public/control-center/styles/12-pages.css:1331:.content-agent-card,
public/control-center/styles/12-pages.css:1396:  .home-ai-team-grid,
public/control-center/styles/12-pages.css:1429:  .home-ai-team-grid,
public/control-center/styles/12-pages.css:3371:   Scoped to AI Command page. Does not affect other pages.
public/control-center/styles/12-pages.css:4768:[data-page="ai-command"] {
public/control-center/styles/12-pages.css:4774:[data-page="ai-command"] .aicmd-v2-shell {
public/control-center/styles/12-pages.css:4783:[data-page="ai-command"] .aicmd-v2-header {
public/control-center/styles/12-pages.css:4791:[data-page="ai-command"] .aicmd-v2-header-meta,
public/control-center/styles/12-pages.css:4792:[data-page="ai-command"] .aicmd-v2-header-actions {
public/control-center/styles/12-pages.css:4799:[data-page="ai-command"] .aicmd-v2-header-meta {
public/control-center/styles/12-pages.css:4804:[data-page="ai-command"] .aicmd-v2-header-actions {
public/control-center/styles/12-pages.css:4808:[data-page="ai-command"] .aicmd-v2-meta-chip {
public/control-center/styles/12-pages.css:4819:[data-page="ai-command"] .aicmd-v2-meta-chip.is-project {
public/control-center/styles/12-pages.css:4823:[data-page="ai-command"] .aicmd-v2-meta-chip span,
public/control-center/styles/12-pages.css:4824:[data-page="ai-command"] .aicmd-v2-meta-chip strong {
public/control-center/styles/12-pages.css:4829:[data-page="ai-command"] .aicmd-v2-meta-chip span {
public/control-center/styles/12-pages.css:4835:[data-page="ai-command"] .aicmd-v2-meta-chip strong {
public/control-center/styles/12-pages.css:4842:[data-page="ai-command"] .aicmd-v2-body {
public/control-center/styles/12-pages.css:4848:[data-page="ai-command"] .aicmd-v2-left {
public/control-center/styles/12-pages.css:4855:[data-page="ai-command"] .aicmd-v2-mode-toggle {
public/control-center/styles/12-pages.css:4863:[data-page="ai-command"] .aicmd-v2-toggle-btn {
public/control-center/styles/12-pages.css:4871:[data-page="ai-command"] .aicmd-v2-toggle-btn.is-active {
public/control-center/styles/12-pages.css:4876:[data-page="ai-command"] .aicmd-v2-team-mission {
public/control-center/styles/12-pages.css:4883:[data-page="ai-command"] .aicmd-v2-team-mission-label,
public/control-center/styles/12-pages.css:4884:[data-page="ai-command"] .aicmd-v2-team-mission-text {
public/control-center/styles/12-pages.css:4888:[data-page="ai-command"] .aicmd-v2-team-mission-label {
public/control-center/styles/12-pages.css:4892:[data-page="ai-command"] .aicmd-v2-rail-head {
public/control-center/styles/12-pages.css:4902:[data-page="ai-command"] .aicmd-v2-team-rail {
public/control-center/styles/12-pages.css:4906:[data-page="ai-command"] .aicmd-v2-spec-btn {
public/control-center/styles/12-pages.css:4914:[data-page="ai-command"] .aicmd-v2-spec-btn:hover {
public/control-center/styles/12-pages.css:4919:[data-page="ai-command"] .aicmd-v2-spec-btn.is-active {
public/control-center/styles/12-pages.css:4927:[data-page="ai-command"] .aicmd-v2-spec-icon {
public/control-center/styles/12-pages.css:4936:[data-page="ai-command"] .aicmd-v2-spec-name {
public/control-center/styles/12-pages.css:4940:[data-page="ai-command"] .aicmd-v2-spec-summary {
public/control-center/styles/12-pages.css:4944:[data-page="ai-command"] .aicmd-v2-main {
public/control-center/styles/12-pages.css:4951:[data-page="ai-command"] .aicmd-v2-composer,
public/control-center/styles/12-pages.css:4952:[data-page="ai-command"] .aicmd-v2-profile,
public/control-center/styles/12-pages.css:4953:[data-page="ai-command"] .aicmd-v2-tools,
public/control-center/styles/12-pages.css:4954:[data-page="ai-command"] .aicmd-v2-chat,
public/control-center/styles/12-pages.css:4955:[data-page="ai-command"] .aicmd-v2-preview,
public/control-center/styles/12-pages.css:4956:[data-page="ai-command"] .aicmd-v2-context,
public/control-center/styles/12-pages.css:4957:[data-page="ai-command"] .aicmd-v2-media-status,
public/control-center/styles/12-pages.css:4958:[data-page="ai-command"] .aicmd-v2-safety,
public/control-center/styles/12-pages.css:4959:[data-page="ai-command"] .aicmd-v2-history,
public/control-center/styles/12-pages.css:4960:[data-page="ai-command"] .aicmd-v2-prompts {
public/control-center/styles/12-pages.css:4966:[data-page="ai-command"] .aicmd-v2-composer {
public/control-center/styles/12-pages.css:4973:[data-page="ai-command"] .aicmd-v2-composer-head,
public/control-center/styles/12-pages.css:4974:[data-page="ai-command"] .aicmd-v2-composer-title-row {
public/control-center/styles/12-pages.css:4980:[data-page="ai-command"] .aicmd-v2-composer-head {
public/control-center/styles/12-pages.css:4984:[data-page="ai-command"] .aicmd-v2-composer-icon {
public/control-center/styles/12-pages.css:4994:[data-page="ai-command"] .aicmd-v2-composer-label {
public/control-center/styles/12-pages.css:4998:[data-page="ai-command"] .aicmd-v2-draft-state {
public/control-center/styles/12-pages.css:5008:[data-page="ai-command"] .aicmd-v2-lang-strip {
public/control-center/styles/12-pages.css:5014:[data-page="ai-command"] .aicmd-v2-planned-chip,
public/control-center/styles/12-pages.css:5015:[data-page="ai-command"] .aicmd-v2-readiness-chip,
public/control-center/styles/12-pages.css:5016:[data-page="ai-command"] .aicmd-v2-preview-chip {
public/control-center/styles/12-pages.css:5021:[data-page="ai-command"] .aicmd-v2-textarea {
public/control-center/styles/12-pages.css:5030:[data-page="ai-command"] .aicmd-v2-textarea:focus {
public/control-center/styles/12-pages.css:5035:[data-page="ai-command"] .aicmd-v2-quick-actions {
public/control-center/styles/12-pages.css:5041:[data-page="ai-command"] .aicmd-v2-quick-btn {
public/control-center/styles/12-pages.css:5055:[data-page="ai-command"] .aicmd-v2-quick-btn:hover {
public/control-center/styles/12-pages.css:5060:[data-page="ai-command"] .aicmd-v2-quick-btn strong {
public/control-center/styles/12-pages.css:5065:[data-page="ai-command"] .aicmd-v2-action-row {
public/control-center/styles/12-pages.css:5069:[data-page="ai-command"] .aicmd-v2-btn-primary,
public/control-center/styles/12-pages.css:5070:[data-page="ai-command"] .aicmd-v2-btn-secondary,
public/control-center/styles/12-pages.css:5071:[data-page="ai-command"] .aicmd-v2-btn-ghost {
public/control-center/styles/12-pages.css:5077:[data-page="ai-command"] .aicmd-v2-btn-primary {
public/control-center/styles/12-pages.css:5083:[data-page="ai-command"] .aicmd-v2-btn-secondary {
public/control-center/styles/12-pages.css:5089:[data-page="ai-command"] .aicmd-v2-btn-ghost {
public/control-center/styles/12-pages.css:5093:[data-page="ai-command"] .aicmd-v2-btn-primary:hover,
public/control-center/styles/12-pages.css:5094:[data-page="ai-command"] .aicmd-v2-btn-secondary:hover,
public/control-center/styles/12-pages.css:5095:[data-page="ai-command"] .aicmd-v2-btn-ghost:hover {
public/control-center/styles/12-pages.css:5100:[data-page="ai-command"] .aicmd-v2-btn-primary:hover {
public/control-center/styles/12-pages.css:5104:[data-page="ai-command"] .aicmd-v2-composer-hint {
public/control-center/styles/12-pages.css:5108:[data-page="ai-command"] .aicmd-v2-profile {
public/control-center/styles/12-pages.css:5112:[data-page="ai-command"] .aicmd-v2-profile-header {
public/control-center/styles/12-pages.css:5117:[data-page="ai-command"] .aicmd-v2-profile-icon {
public/control-center/styles/12-pages.css:5128:[data-page="ai-command"] .aicmd-v2-profile-title {
public/control-center/styles/12-pages.css:5132:[data-page="ai-command"] .aicmd-v2-profile-purpose {
public/control-center/styles/12-pages.css:5136:[data-page="ai-command"] .aicmd-v2-strength-row {
public/control-center/styles/12-pages.css:5142:[data-page="ai-command"] .aicmd-v2-strength-chip {
public/control-center/styles/12-pages.css:5151:[data-page="ai-command"] .aicmd-v2-strength-chip.is-tool {
public/control-center/styles/12-pages.css:5156:[data-page="ai-command"] .aicmd-v2-tabs {
public/control-center/styles/12-pages.css:5162:[data-page="ai-command"] .aicmd-v2-tab-btn {
public/control-center/styles/12-pages.css:5169:[data-page="ai-command"] .aicmd-v2-tab-btn span,
public/control-center/styles/12-pages.css:5170:[data-page="ai-command"] .aicmd-v2-tab-btn small {
public/control-center/styles/12-pages.css:5174:[data-page="ai-command"] .aicmd-v2-tab-btn.is-active {
public/control-center/styles/12-pages.css:5179:[data-page="ai-command"] .aicmd-v2-chat,
public/control-center/styles/12-pages.css:5180:[data-page="ai-command"] .aicmd-v2-preview {
public/control-center/styles/12-pages.css:5186:[data-page="ai-command"] .aicmd-v2-chat-title,
public/control-center/styles/12-pages.css:5187:[data-page="ai-command"] .aicmd-v2-preview-title,
public/control-center/styles/12-pages.css:5188:[data-page="ai-command"] .aicmd-v2-tools-title,
public/control-center/styles/12-pages.css:5189:[data-page="ai-command"] .aicmd-v2-context-label,
public/control-center/styles/12-pages.css:5190:[data-page="ai-command"] .aicmd-v2-history-title {
public/control-center/styles/12-pages.css:5194:[data-page="ai-command"] .aicmd-v2-chat-subtitle,
public/control-center/styles/12-pages.css:5195:[data-page="ai-command"] .aicmd-v2-preview-subtitle {
public/control-center/styles/12-pages.css:5199:[data-page="ai-command"] .aicmd-v2-chat-stack {
public/control-center/styles/12-pages.css:5204:[data-page="ai-command"] .aicmd-v2-chat-card {
public/control-center/styles/12-pages.css:5210:[data-page="ai-command"] .aicmd-v2-chat-card.is-latest {
public/control-center/styles/12-pages.css:5214:[data-page="ai-command"] .aicmd-v2-chat-meta,
public/control-center/styles/12-pages.css:5215:[data-page="ai-command"] .aicmd-v2-chat-label,
public/control-center/styles/12-pages.css:5216:[data-page="ai-command"] .aicmd-v2-preview-label,
public/control-center/styles/12-pages.css:5217:[data-page="ai-command"] .aicmd-v2-preview-what-heading,
public/control-center/styles/12-pages.css:5218:[data-page="ai-command"] .aicmd-v2-context-item-label {
public/control-center/styles/12-pages.css:5222:[data-page="ai-command"] .aicmd-v2-chat-latest {
public/control-center/styles/12-pages.css:5226:[data-page="ai-command"] .aicmd-v2-chat-user,
public/control-center/styles/12-pages.css:5227:[data-page="ai-command"] .aicmd-v2-chat-response {
public/control-center/styles/12-pages.css:5232:[data-page="ai-command"] .aicmd-v2-chat-response p {
public/control-center/styles/12-pages.css:5236:[data-page="ai-command"] .aicmd-v2-chat-actions,
public/control-center/styles/12-pages.css:5237:[data-page="ai-command"] .aicmd-v2-preview-actions {
public/control-center/styles/12-pages.css:5241:[data-page="ai-command"] .aicmd-v2-preview-empty-state {
public/control-center/styles/12-pages.css:5252:[data-page="ai-command"] .aicmd-v2-preview-empty-state strong {
public/control-center/styles/12-pages.css:5256:[data-page="ai-command"] .aicmd-v2-preview-empty-state span {
public/control-center/styles/12-pages.css:5261:[data-page="ai-command"] .aicmd-v2-preview-body {
public/control-center/styles/12-pages.css:5265:[data-page="ai-command"] .aicmd-v2-preview-empty-state {
public/control-center/styles/12-pages.css:5270:[data-page="ai-command"] .aicmd-v2-chat-card {
public/control-center/styles/12-pages.css:5274:[data-page="ai-command"] .aicmd-v2-chat-card:hover {
public/control-center/styles/12-pages.css:5279:[data-page="ai-command"] .aicmd-v2-btn-primary:focus-visible,
public/control-center/styles/12-pages.css:5280:[data-page="ai-command"] .aicmd-v2-btn-secondary:focus-visible,
public/control-center/styles/12-pages.css:5281:[data-page="ai-command"] .aicmd-v2-btn-ghost:focus-visible {
public/control-center/styles/12-pages.css:5286:[data-page="ai-command"] .aicmd-v2-tool-btn:focus-visible {
public/control-center/styles/12-pages.css:5292:[data-page="ai-command"] .aicmd-v2-prompt-chip:focus-visible {
public/control-center/styles/12-pages.css:5298:[data-page="ai-command"] .aicmd-v2-spec-btn:focus-visible {
public/control-center/styles/12-pages.css:5303:[data-page="ai-command"] .aicmd-v2-preview-output-title {
public/control-center/styles/12-pages.css:5307:[data-page="ai-command"] .aicmd-v2-preview-summary,
public/control-center/styles/12-pages.css:5308:[data-page="ai-command"] .aicmd-v2-preview-draft {
public/control-center/styles/12-pages.css:5312:[data-page="ai-command"] .aicmd-v2-preview-draft {
public/control-center/styles/12-pages.css:5323:[data-page="ai-command"] .aicmd-v2-preview-structured-grid {
public/control-center/styles/12-pages.css:5330:[data-page="ai-command"] .aicmd-v2-preview-section {
public/control-center/styles/12-pages.css:5338:[data-page="ai-command"] .aicmd-v2-preview-section + .aicmd-v2-preview-section {
public/control-center/styles/12-pages.css:5342:[data-page="ai-command"] .aicmd-v2-preview-list li,
public/control-center/styles/12-pages.css:5343:[data-page="ai-command"] .aicmd-v2-preview-steps li {
public/control-center/styles/12-pages.css:5347:[data-page="ai-command"] .aicmd-v2-tools-head,
public/control-center/styles/12-pages.css:5348:[data-page="ai-command"] .aicmd-v2-history-head {
public/control-center/styles/12-pages.css:5355:[data-page="ai-command"] .aicmd-v2-tools-subtitle,
public/control-center/styles/12-pages.css:5356:[data-page="ai-command"] .aicmd-v2-tools-count,
public/control-center/styles/12-pages.css:5357:[data-page="ai-command"] .aicmd-v2-history-count {
public/control-center/styles/12-pages.css:5363:[data-page="ai-command"] .aicmd-v2-tools-grid {
public/control-center/styles/12-pages.css:5367:[data-page="ai-command"] .aicmd-v2-tool-btn {
public/control-center/styles/12-pages.css:5374:[data-page="ai-command"] .aicmd-v2-tool-label {
public/control-center/styles/12-pages.css:5378:[data-page="ai-command"] .aicmd-v2-tool-meta {
public/control-center/styles/12-pages.css:5385:[data-page="ai-command"] .aicmd-v2-tool-meta span {
public/control-center/styles/12-pages.css:5395:[data-page="ai-command"] .aicmd-v2-context-grid {
public/control-center/styles/12-pages.css:5399:[data-page="ai-command"] .aicmd-v2-context-item {
public/control-center/styles/12-pages.css:5405:[data-page="ai-command"] .aicmd-v2-context-item.is-scoped {
public/control-center/styles/12-pages.css:5410:[data-page="ai-command"] .aicmd-v2-context-item.is-scoped .aicmd-v2-context-item-label {
public/control-center/styles/12-pages.css:5414:[data-page="ai-command"] .aicmd-v2-media-status-list {
public/control-center/styles/12-pages.css:5419:[data-page="ai-command"] .aicmd-v2-media-status-list li {
public/control-center/styles/12-pages.css:5423:[data-page="ai-command"] .aicmd-v2-history-list {
public/control-center/styles/12-pages.css:5429:[data-page="ai-command"] .aicmd-v2-history-item {
public/control-center/styles/12-pages.css:5438:[data-page="ai-command"] .aicmd-v2-history-type {
public/control-center/styles/12-pages.css:5443:[data-page="ai-command"] .aicmd-v2-history-item strong {
public/control-center/styles/12-pages.css:5448:[data-page="ai-command"] .aicmd-v2-history-item p {
public/control-center/styles/12-pages.css:5455:[data-page="ai-command"] .aicmd-v2-readiness-strip {
public/control-center/styles/12-pages.css:5460:  [data-page="ai-command"] .aicmd-v2-quick-actions,
public/control-center/styles/12-pages.css:5461:  [data-page="ai-command"] .aicmd-v2-context-grid {
public/control-center/styles/12-pages.css:5465:  [data-page="ai-command"] .aicmd-v2-tools-grid {
public/control-center/styles/12-pages.css:5471:  [data-page="ai-command"] .aicmd-v2-shell {
public/control-center/styles/12-pages.css:5475:  [data-page="ai-command"] .aicmd-v2-body {
public/control-center/styles/12-pages.css:5479:  [data-page="ai-command"] .aicmd-v2-left {
public/control-center/styles/12-pages.css:5484:  [data-page="ai-command"] .aicmd-v2-team-rail {
public/control-center/styles/12-pages.css:5489:  [data-page="ai-command"] .aicmd-v2-tabs {
public/control-center/styles/12-pages.css:5493:  [data-page="ai-command"] .aicmd-v2-preview-structured-grid,
public/control-center/styles/12-pages.css:5494:  [data-page="ai-command"] .aicmd-v2-media-status-list {
public/control-center/styles/12-pages.css:5500:  [data-page="ai-command"] .aicmd-v2-header {
public/control-center/styles/12-pages.css:5504:  [data-page="ai-command"] .aicmd-v2-header-actions,
public/control-center/styles/12-pages.css:5505:  [data-page="ai-command"] .aicmd-v2-header-actions button,
public/control-center/styles/12-pages.css:5506:  [data-page="ai-command"] .aicmd-v2-action-row button {
public/control-center/styles/12-pages.css:5510:  [data-page="ai-command"] .aicmd-v2-quick-actions,
public/control-center/styles/12-pages.css:5511:  [data-page="ai-command"] .aicmd-v2-context-grid,
public/control-center/styles/12-pages.css:5512:  [data-page="ai-command"] .aicmd-v2-tools-grid,
public/control-center/styles/12-pages.css:5513:  [data-page="ai-command"] .aicmd-v2-team-rail {
public/control-center/styles/12-pages.css:5737:[data-page="ai-command"] .aicmd-v2-composer {
public/control-center/styles/12-pages.css:5744:[data-page="ai-command"] .aicmd-v2-composer-label {
public/control-center/styles/12-pages.css:5760:[data-page="ai-command"] .aicmd-v2-action-row {
public/control-center/styles/12-pages.css:5765:[data-page="ai-command"] #aicmdV2AskBtn {
public/control-center/styles/12-pages.css:5770:[data-page="ai-command"] .aicmd-v2-btn-secondary,
public/control-center/styles/12-pages.css:5771:[data-page="ai-command"] .aicmd-v2-btn-ghost {
public/control-center/styles/12-pages.css:5775:[data-page="ai-command"] .aicmd-v2-left {
public/control-center/styles/12-pages.css:5779:[data-page="ai-command"] .aicmd-v2-team-rail {
public/control-center/styles/12-pages.css:5783:[data-page="ai-command"] .aicmd-v2-spec-btn {
public/control-center/styles/12-pages.css:5787:[data-page="ai-command"] .aicmd-v2-spec-summary {
public/control-center/styles/12-pages.css:5794:[data-page="ai-command"] .aicmd-v2-tabs {
public/control-center/styles/12-pages.css:5798:[data-page="ai-command"] .aicmd-v2-tab-btn small {
public/control-center/styles/12-pages.css:5802:[data-page="ai-command"] .aicmd-v2-chat-composer-note {
public/control-center/styles/12-pages.css:5808:   Page-scoped operating room layout for AI Command.
public/control-center/styles/12-pages.css:5811:[data-page="ai-command"] {
public/control-center/styles/12-pages.css:5816:[data-page="ai-command"] [data-role="strategist"] { --role-accent: #22d3ee; --role-soft: rgba(34, 211, 238, 0.12); }
public/control-center/styles/12-pages.css:5817:[data-page="ai-command"] [data-role="writer"] { --role-accent: #a78bfa; --role-soft: rgba(167, 139, 250, 0.12); }
public/control-center/styles/12-pages.css:5818:[data-page="ai-command"] [data-role="media"] { --role-accent: #f472b6; --role-soft: rgba(244, 114, 182, 0.12); }
public/control-center/styles/12-pages.css:5819:[data-page="ai-command"] [data-role="video_lead"] { --role-accent: #fb7185; --role-soft: rgba(251, 113, 133, 0.12); }
public/control-center/styles/12-pages.css:5820:[data-page="ai-command"] [data-role="publisher"] { --role-accent: #38bdf8; --role-soft: rgba(56, 189, 248, 0.12); }
public/control-center/styles/12-pages.css:5821:[data-page="ai-command"] [data-role="ads"] { --role-accent: #f59e0b; --role-soft: rgba(245, 158, 11, 0.12); }
public/control-center/styles/12-pages.css:5822:[data-page="ai-command"] [data-role="analyst"] { --role-accent: #34d399; --role-soft: rgba(52, 211, 153, 0.12); }
public/control-center/styles/12-pages.css:5823:[data-page="ai-command"] [data-role="compliance_reviewer"] { --role-accent: #60a5fa; --role-soft: rgba(96, 165, 250, 0.12); }
public/control-center/styles/12-pages.css:5824:[data-page="ai-command"] [data-role="operations"] { --role-accent: #c084fc; --role-soft: rgba(192, 132, 252, 0.12); }
public/control-center/styles/12-pages.css:5825:[data-page="ai-command"] [data-role="customer_ops"] { --role-accent: #2dd4bf; --role-soft: rgba(45, 212, 191, 0.12); }
public/control-center/styles/12-pages.css:5826:[data-page="ai-command"] [data-role="sales_crm"] { --role-accent: #fbbf24; --role-soft: rgba(251, 191, 36, 0.12); }
public/control-center/styles/12-pages.css:5827:[data-page="ai-command"] [data-role="team"] { --role-accent: #22d3ee; --role-soft: rgba(34, 211, 238, 0.12); }
public/control-center/styles/12-pages.css:5829:[data-page="ai-command"] .aicmd-v2-composer-label,
public/control-center/styles/12-pages.css:5830:[data-page="ai-command"] .aicmd-v2-tool-label,
public/control-center/styles/12-pages.css:5831:[data-page="ai-command"] .aicmd-room-active-copy strong,
public/control-center/styles/12-pages.css:5832:[data-page="ai-command"] .aicmd-room-output-body h3,
public/control-center/styles/12-pages.css:5833:[data-page="ai-command"] .aicmd-room-panel-head strong {
public/control-center/styles/12-pages.css:5837:[data-page="ai-command"] .aicmd-v2-chat-card,
public/control-center/styles/12-pages.css:5838:[data-page="ai-command"] .aicmd-v2-chat-empty,
public/control-center/styles/12-pages.css:5839:[data-page="ai-command"] .aicmd-v2-composer-primary-note,
public/control-center/styles/12-pages.css:5840:[data-page="ai-command"] .aicmd-room-response-card {
public/control-center/styles/12-pages.css:5844:[data-page="ai-command"] .aicmd-room-shell {
public/control-center/styles/12-pages.css:5851:[data-page="ai-command"] .aicmd-room-header {
public/control-center/styles/12-pages.css:5861:[data-page="ai-command"] .aicmd-room-title-block {
public/control-center/styles/12-pages.css:5865:[data-page="ai-command"] .aicmd-room-eyebrow,
public/control-center/styles/12-pages.css:5866:[data-page="ai-command"] .aicmd-room-kicker,
public/control-center/styles/12-pages.css:5867:[data-page="ai-command"] .aicmd-room-panel-kicker {
public/control-center/styles/12-pages.css:5876:[data-page="ai-command"] .aicmd-room-title {
public/control-center/styles/12-pages.css:5884:[data-page="ai-command"] .aicmd-room-subtitle {
public/control-center/styles/12-pages.css:5892:[data-page="ai-command"] .aicmd-room-header-actions {
public/control-center/styles/12-pages.css:5896:[data-page="ai-command"] .aicmd-room-meta {
public/control-center/styles/12-pages.css:5900:[data-page="ai-command"] .aicmd-room-flow {
public/control-center/styles/12-pages.css:5907:[data-page="ai-command"] .aicmd-room-flow-step {
public/control-center/styles/12-pages.css:5920:[data-page="ai-command"] .aicmd-room-flow-step.is-active {
public/control-center/styles/12-pages.css:5926:[data-page="ai-command"] .aicmd-room-flow-step.is-complete {
public/control-center/styles/12-pages.css:5930:[data-page="ai-command"] .aicmd-room-flow-number {
public/control-center/styles/12-pages.css:5943:[data-page="ai-command"] .aicmd-room-flow-step strong,
public/control-center/styles/12-pages.css:5944:[data-page="ai-command"] .aicmd-room-flow-step small {
public/control-center/styles/12-pages.css:5952:[data-page="ai-command"] .aicmd-room-flow-step strong {
public/control-center/styles/12-pages.css:5956:[data-page="ai-command"] .aicmd-room-flow-step small {
public/control-center/styles/12-pages.css:5960:[data-page="ai-command"] .aicmd-room-grid {
public/control-center/styles/12-pages.css:5969:[data-page="ai-command"] .aicmd-room-team-panel,
public/control-center/styles/12-pages.css:5970:[data-page="ai-command"] .aicmd-room-center,
public/control-center/styles/12-pages.css:5971:[data-page="ai-command"] .aicmd-room-output {
public/control-center/styles/12-pages.css:5975:[data-page="ai-command"] .aicmd-room-team-panel,
public/control-center/styles/12-pages.css:5976:[data-page="ai-command"] .aicmd-room-output {
public/control-center/styles/12-pages.css:5983:[data-page="ai-command"] .aicmd-room-team-panel {
public/control-center/styles/12-pages.css:5989:[data-page="ai-command"] .aicmd-room-panel-head {
public/control-center/styles/12-pages.css:5997:[data-page="ai-command"] .aicmd-room-panel-head strong {
public/control-center/styles/12-pages.css:6004:[data-page="ai-command"] .aicmd-room-online-pill,
public/control-center/styles/12-pages.css:6005:[data-page="ai-command"] .aicmd-room-output-state {
public/control-center/styles/12-pages.css:6016:[data-page="ai-command"] .aicmd-room-mode-switch {
public/control-center/styles/12-pages.css:6021:[data-page="ai-command"] .aicmd-room-team-mode-card {
public/control-center/styles/12-pages.css:6031:[data-page="ai-command"] .aicmd-room-team-mode-card strong {
public/control-center/styles/12-pages.css:6036:[data-page="ai-command"] .aicmd-room-team-mode-card span {
public/control-center/styles/12-pages.css:6042:[data-page="ai-command"] .aicmd-room-team-chain {
public/control-center/styles/12-pages.css:6049:[data-page="ai-command"] .aicmd-room-chain-step {

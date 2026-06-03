# PHASE 3AH.1 — Frontend Customer / Communications Evidence

## Sidebar/customer route evidence
public/control-center/pages/ads-manager.js:8:    supportSources: ["website", "ecommerce", "analytics"],
public/control-center/pages/ads-manager.js:15:    supportSources: ["analytics", "ecommerce", "youtube"],
public/control-center/pages/ads-manager.js:22:    supportSources: ["website", "analytics"],
public/control-center/pages/ads-manager.js:29:    supportSources: ["analytics", "ecommerce"],
public/control-center/pages/ads-manager.js:132:    const supportConnected = platform.supportSources.filter((key) => Boolean(checks[key] || asObject(sources[key]).value));
public/control-center/pages/ads-manager.js:140:      status = supportConnected.length >= 2 ? "Operational" : "Partial";
public/control-center/pages/ads-manager.js:141:    } else if (supportConnected.length) {
public/control-center/pages/ads-manager.js:147:      ...platform.supportSources.filter((key) => !checks[key] && !asObject(sources[key]).value)
public/control-center/pages/ads-manager.js:160:      connectionValue: getSourceValue(sources, [...platform.primarySources, ...platform.supportSources]) || "No platform connection saved",
public/control-center/pages/ads-manager.js:161:      readinessScore: Math.round(((primaryConnected.length * 2) + supportConnected.length) / ((platform.primarySources.length * 2) + platform.supportSources.length) * 100),
public/control-center/pages/ai-command.js:98:                id: "customer_ops",
public/control-center/pages/ai-command.js:99:                label: "Customer Operations Lead",
public/control-center/pages/ai-command.js:101:                summary: "Inbox review, reply drafts, ticket drafts, SLA risk, and escalation routing.",
public/control-center/pages/ai-command.js:105:                id: "sales_crm",
public/control-center/pages/ai-command.js:106:                label: "Sales / CRM Lead",
public/control-center/pages/ai-command.js:108:                summary: "Lead qualification, outreach drafts, follow-up cadence, and CRM handoff notes.",
public/control-center/pages/ai-command.js:126:	customer_operations: "customer_ops",
public/control-center/pages/ai-command.js:127:	customer_ops: "customer_ops",
public/control-center/pages/ai-command.js:128:	support: "customer_ops",
public/control-center/pages/ai-command.js:129:	sales: "sales_crm",
public/control-center/pages/ai-command.js:130:	crm: "sales_crm",
public/control-center/pages/ai-command.js:131:	sales_crm: "sales_crm",
public/control-center/pages/ai-command.js:148:		cannotDo: ["Publish campaigns directly", "Execute workflows automatically", "Approve content", "Set live budgets"],
public/control-center/pages/ai-command.js:159:		placeholder: "Ask the Content Writer to draft captions, hooks, landing copy, or campaign messages…",
public/control-center/pages/ai-command.js:161:		cannotDo: ["Publish directly", "Approve risky claims", "Invent unsupported facts", "Run workflows automatically"],
public/control-center/pages/ai-command.js:187:		cannotDo: ["Generate video directly", "Upload footage without review", "Approve without confirmation", "Run media jobs automatically"],
public/control-center/pages/ai-command.js:226:		cannotDo: ["Update SEO settings directly", "Edit live website", "Set analytics configurations", "Publish recommendations automatically"],
public/control-center/pages/ai-command.js:258:		id: "customer_ops",
public/control-center/pages/ai-command.js:259:		label: "Customer Operations Lead",
public/control-center/pages/ai-command.js:260:		position: "Customer Experience Operations Lead",
public/control-center/pages/ai-command.js:262:		summary: "Inbox review, reply drafts, ticket drafts, SLA risk, customer profile context, and escalation routing.",
public/control-center/pages/ai-command.js:263:		placeholder: "Ask the Customer Operations Lead to summarize a customer thread, draft a safe reply, prepare a ticket draft, check SLA risk, or route an escalation for review…",
public/control-center/pages/ai-command.js:264:		canHelp: ["Review inbox context", "Summarize customer threads", "Draft safe replies", "Prepare ticket drafts", "Flag SLA and escalation risk"],
public/control-center/pages/ai-command.js:265:		cannotDo: ["Send customer replies", "Create live tickets", "Change SLA policy", "Escalate without confirmation"],
public/control-center/pages/ai-command.js:266:		destinations: ["Unified Inbox", "Operations Centers", "Integrations"],
public/control-center/pages/ai-command.js:267:		safetyNote: "Customer operations outputs are drafts only. Sending replies, ticket creation, and escalations require confirmation in the owning surface.",
public/control-center/pages/ai-command.js:271:		id: "sales_crm",
public/control-center/pages/ai-command.js:272:		label: "Sales / CRM Lead",
public/control-center/pages/ai-command.js:273:		position: "Revenue and CRM Operations Lead",
public/control-center/pages/ai-command.js:275:		summary: "Lead qualification, outreach drafts, follow-up cadence, CRM profile summaries, and sales handoff notes.",
public/control-center/pages/ai-command.js:276:		placeholder: "Ask the Sales / CRM Lead to qualify a lead, draft outreach, plan follow-ups, summarize CRM context, or prepare a sales handoff for review…",
public/control-center/pages/ai-command.js:277:		canHelp: ["Qualify lead context", "Draft outreach", "Plan follow-up sequences", "Summarize CRM profiles", "Prepare sales handoffs"],
public/control-center/pages/ai-command.js:278:		cannotDo: ["Send outreach", "Mutate CRM records", "Advance pipeline stages", "Confirm follow-ups without review"],
public/control-center/pages/ai-command.js:279:		destinations: ["CRM", "Workflows", "Operations Centers"],
public/control-center/pages/ai-command.js:280:		safetyNote: "Sales and CRM outputs are guidance and drafts only. CRM mutations and outreach sends require confirmation in the owning surface.",
public/control-center/pages/ai-command.js:341:	customer_ops: [
public/control-center/pages/ai-command.js:342:		{ label: "Summarize customer thread", sub: "Capture issue, tone, and next reply" },
public/control-center/pages/ai-command.js:343:		{ label: "Draft customer reply", sub: "Safe response for review" },
public/control-center/pages/ai-command.js:345:		{ label: "Prepare escalation", sub: "Route support, sales, or operations" }
public/control-center/pages/ai-command.js:347:	sales_crm: [
public/control-center/pages/ai-command.js:360:	{ label: "Review customer and sales impact", sub: "Customer Ops, Sales / CRM, Operations" }
public/control-center/pages/ai-command.js:383:const AI_ROOM_BUSINESS_BRANCH = ["Customer Ops", "Sales / CRM", "Operations"];
public/control-center/pages/ai-command.js:395:	customer_ops: "CO",
public/control-center/pages/ai-command.js:396:	sales_crm: "SC"
public/control-center/pages/ai-command.js:475:		{ id: "claims-check", label: "Claims Check", action: "preview", intent: "guidance", template: "Review marketing claims for {project}. Flag unsupported, high-risk, or evidence-dependent wording." },
public/control-center/pages/ai-command.js:488:	customer_ops: [
public/control-center/pages/ai-command.js:489:		{ id: "review-unified-inbox", label: "Review Unified Inbox", action: "preview", intent: "guidance", template: "Review the Unified Inbox readiness for {project}. Summarize visible customer-operation signals, open gaps, and safe next review steps. Do not claim inbox actions happened." },
public/control-center/pages/ai-command.js:490:		{ id: "summarize-customer-thread", label: "Summarize Customer Thread", action: "preview", intent: "guidance", template: "Summarize this customer thread for {project}. Include customer issue, sentiment, reply goal, missing details, and safe next step." },
public/control-center/pages/ai-command.js:491:		{ id: "draft-customer-reply", label: "Draft Customer Reply", action: "preview", intent: "guidance", template: "Draft a customer reply for {project}. Keep it helpful, calm, review-ready, and do not claim any operational action has been completed." },
public/control-center/pages/ai-command.js:494:		{ id: "prepare-escalation", label: "Prepare Escalation", action: "preview", intent: "handoff", template: "Prepare an escalation draft for {project}. Include reason, customer impact, owner, confirmation needed, and destination team." },
public/control-center/pages/ai-command.js:495:		{ id: "customer-profile-snapshot", label: "Customer Profile Snapshot", action: "preview", intent: "guidance", template: "Prepare a customer profile snapshot for {project}. Include known context, purchase/support signals, missing fields, and safe follow-up questions." },
public/control-center/pages/ai-command.js:496:		{ id: "route-support-sales-ops", label: "Route to Support / Sales / Operations", action: "preview", intent: "handoff", template: "Prepare routing guidance for {project}. Decide whether the customer item belongs with Support, Sales, or Operations, and explain the review gate." }
public/control-center/pages/ai-command.js:498:	sales_crm: [
public/control-center/pages/ai-command.js:499:		{ id: "lead-qualification", label: "Lead Qualification", action: "preview", intent: "guidance", template: "Qualify the lead for {project}. Include fit, intent, urgency, missing CRM fields, and the safest next step." },
public/control-center/pages/ai-command.js:502:		{ id: "crm-profile-summary", label: "CRM Profile Summary", action: "preview", intent: "guidance", template: "Summarize the CRM profile context for {project}. Include fit, history, open questions, and next sales action without mutating CRM data." },
public/control-center/pages/ai-command.js:638:		if (/act as the customer operations lead|act as customer ops/i.test(text)) return "customer_ops";
public/control-center/pages/ai-command.js:639:		if (/act as the sales|act as the crm|sales \/ crm lead/i.test(text)) return "sales_crm";
public/control-center/pages/ai-command.js:702:	if (/act as the customer operations lead|act as customer ops/i.test(text)) return "customer_ops";
public/control-center/pages/ai-command.js:703:	if (/act as the sales|act as the crm|sales \/ crm lead/i.test(text)) return "sales_crm";
public/control-center/pages/ai-command.js:876:	const conversationLanguage = asString(
public/control-center/pages/ai-command.js:877:		overview.conversation_language ||
public/control-center/pages/ai-command.js:884:		conversationLanguage,
public/control-center/pages/ai-command.js:952:			messages: [],
public/control-center/pages/ai-command.js:1043:	session.draftStatus = hint || `Saved locally ${formatTime(saved.updatedAt)}`;
public/control-center/pages/ai-command.js:1120:        const messages = asArray(session.messages);
public/control-center/pages/ai-command.js:1122:        const hasContent = messages.length || responses.length || asObject(session.outputPreview).title;
public/control-center/pages/ai-command.js:1128:        const firstUser = messages.find((message) => asString(message.role) === "user");
public/control-center/pages/ai-command.js:1136:                messages: messages.slice(-40),
public/control-center/pages/ai-command.js:1159:        session.messages = asArray(record.messages).slice(-40);
public/control-center/pages/ai-command.js:1192:			"When the request touches inbox, tickets, leads, outreach, or CRM, include Customer Ops -> Sales/CRM -> Operations.",
public/control-center/pages/ai-command.js:1201:		`User conversation language: ${safeLanguage}`,
public/control-center/pages/ai-command.js:1206:                `Use ${safeOutputLanguage} only for customer-facing or publishable copy such as captions, ads, emails, landing pages, final campaign text, or publishing packages.`,
public/control-center/pages/ai-command.js:1271:	if (id === "customer_ops") return outputType === "task" ? "task-center" : "operations-centers";
public/control-center/pages/ai-command.js:1272:	if (id === "sales_crm") return "workflows";
public/control-center/pages/ai-command.js:1447:				"Use Arabic freely in the conversation; publishable copy should be reviewed in German.",
public/control-center/pages/ai-command.js:1574:	if (specialistId === "customer_ops") {
public/control-center/pages/ai-command.js:1577:			title: outputType === "task" ? "Ticket Draft: Customer operations follow-up" : "Customer Ops Draft: Thread, reply, and routing",
public/control-center/pages/ai-command.js:1578:			summary: "Customer operations draft prepared with safe reply language, ticket notes, SLA review, and escalation guardrails.",
public/control-center/pages/ai-command.js:1579:			mainOutput: "Review the customer context, confirm missing details, then route the draft through the owning support, sales, or operations surface.",
public/control-center/pages/ai-command.js:1581:				"Thank the customer, acknowledge the issue, and confirm the next reviewed support step.",
public/control-center/pages/ai-command.js:1585:				"Issue summary: customer concern or request captured for review.",
public/control-center/pages/ai-command.js:1586:				"Priority: draft priority pending runtime inbox and SLA confirmation.",
public/control-center/pages/ai-command.js:1587:				"Owner: support, sales, or operations to be confirmed before creation."
public/control-center/pages/ai-command.js:1590:				"Unified Inbox is not duplicated here; this is a draft and routing preview only.",
public/control-center/pages/ai-command.js:1593:			nextStep: "Review the draft, confirm the destination team, then route through support, sales, or operations.",
public/control-center/pages/ai-command.js:1595:				"Summarize the customer thread",
public/control-center/pages/ai-command.js:1596:				"Draft a safe customer reply",
public/control-center/pages/ai-command.js:1605:	if (specialistId === "sales_crm") {
public/control-center/pages/ai-command.js:1608:			title: outputType === "handoff" ? "Sales Handoff" : "Sales / CRM Draft: Lead and outreach plan",
public/control-center/pages/ai-command.js:1609:			summary: "Sales and CRM draft prepared with lead qualification, outreach direction, follow-up cadence, and pipeline handoff notes.",
public/control-center/pages/ai-command.js:1610:			mainOutput: "Use this as a sales planning draft. Confirm CRM context and owner before sending outreach or changing pipeline status.",
public/control-center/pages/ai-command.js:1627:				"CRM profile and pipeline changes remain outside AI Team.",
public/control-center/pages/ai-command.js:1630:			nextStep: "Review the lead fit, confirm owner, then route the handoff to operations or the CRM surface.",
public/control-center/pages/ai-command.js:1635:				"Route sales handoff without mutating CRM data"
public/control-center/pages/ai-command.js:1638:			safetyLabel: "No outreach sent, CRM record changed, follow-up scheduled, or pipeline stage advanced."
public/control-center/pages/ai-command.js:1706:			"Customer Ops and Sales / CRM join when the request touches inbox, tickets, leads, outreach, or CRM"
public/control-center/pages/ai-command.js:1710:			"Writer: draft hooks, captions, messages, email, or outreach copy",
public/control-center/pages/ai-command.js:1714:			"Customer Ops / Sales: add reply, ticket, lead, outreach, or CRM handoff drafts when relevant",
public/control-center/pages/ai-command.js:1719:		confirmationNote: "No task, workflow, outreach, customer reply, CRM update, approval, or publishing action is executed from Full Team mode.",
public/control-center/pages/ai-command.js:1970:		customer_ops: ["customer", "support", "inbox", "ticket", "tickets", "sla", "reply", "thread", "escalation", "complaint", "refund"],
public/control-center/pages/ai-command.js:1971:		sales_crm: ["lead", "leads", "crm", "sales", "outreach", "follow-up", "follow up", "pipeline", "dealer", "salon", "influencer"]
public/control-center/pages/ai-command.js:2392:	"customer-ops": "customer_ops",
public/control-center/pages/ai-command.js:2393:	customer_ops: "customer_ops",
public/control-center/pages/ai-command.js:2394:	"sales-crm": "sales_crm",
public/control-center/pages/ai-command.js:2395:	sales_crm: "sales_crm"
public/control-center/pages/ai-command.js:2521:		confirmationNote: firstAiInboundText(preview.confirmationNote, preview.confirmation_note, "Execution, approvals, publishing, CRM updates, customer replies, and workflow runs require explicit confirmation in the owning workspace."),
public/control-center/pages/ai-command.js:2591:	)) || `Review this ${sourceLabel} handoff for ${projectLabel}. Identify the right specialist, summarize the context, produce a review-ready draft, and recommend the next safe route. Do not execute publishing, task creation, CRM updates, customer replies, workflow runs, or backend actions.`;
public/control-center/pages/ai-command.js:2631:		note: "Guidance only. No publishing, task creation, CRM updates, customer replies, workflow runs, exports, or backend actions are executed from this handoff."
public/control-center/pages/ai-command.js:2750:	session.messages.push({
public/control-center/pages/ai-command.js:2759:	session.messages.push({
public/control-center/pages/ai-command.js:2809:      purpose: asString(member.purpose || member.description || fallback.purpose || "Support the current operating context."),
public/control-center/pages/ai-command.js:3109:function renderMessageStream(messages, escapeHtml) {
public/control-center/pages/ai-command.js:3110:	if (!messages.length) {
public/control-center/pages/ai-command.js:3114:				<div class="ctrl-empty-title">Start the conversation</div>
public/control-center/pages/ai-command.js:3120:	return messages.map((message) => {
public/control-center/pages/ai-command.js:3152:				<h3 style="margin:0;font-size:14px;font-weight:600;color:var(--color-text-0);">Conversation &amp; results</h3>
public/control-center/pages/ai-command.js:3153:				<span style="font-size:11px;color:var(--color-text-2);">${session.messages.length} message${session.messages.length !== 1 ? "s" : ""}</span>
public/control-center/pages/ai-command.js:3156:				${renderMessageStream(session.messages, escapeHtml)}
public/control-center/pages/ai-command.js:3212:	const artifacts = session.messages
public/control-center/pages/ai-command.js:3276:	return asArray(session.messages).slice().reverse().find((item) => item.role === "user") || null;
public/control-center/pages/ai-command.js:3280:	return asArray(session.messages).slice().reverse().find((item) => item.role === "assistant") || null;
public/control-center/pages/ai-command.js:3283:function buildConversationWorkContext(session, fallbackPrompt = "") {
public/control-center/pages/ai-command.js:3284:        const messages = asArray(session.messages).slice(-12);
public/control-center/pages/ai-command.js:3292:        const conversationLines = messages
public/control-center/pages/ai-command.js:3320:                conversationLines.length ? `Conversation context:\n${conversationLines.join("\n")}` : ""
public/control-center/pages/ai-command.js:3326:                conversationText: conversationLines.join("\n"),
public/control-center/pages/ai-command.js:3335:function buildConversationWorkPrompt(session, outputType, fallbackPrompt = "") {
public/control-center/pages/ai-command.js:3336:        const context = buildConversationWorkContext(session, fallbackPrompt);
public/control-center/pages/ai-command.js:3347:                `Convert this AI Team conversation into a ${typeLabel}.`,
public/control-center/pages/ai-command.js:3349:                "Use the conversation context, not only the composer text.",
public/control-center/pages/ai-command.js:3356:function setPreviewFromConversation({ session, intent, fallbackPrompt, projectName }) {
public/control-center/pages/ai-command.js:3357:        const workPrompt = buildConversationWorkPrompt(session, intent, fallbackPrompt);
public/control-center/pages/ai-command.js:3365:        const context = buildConversationWorkContext(session, fallbackPrompt);
public/control-center/pages/ai-command.js:3367:        preview.conversationContext = context.conversationText;
public/control-center/pages/ai-command.js:3369:        // Keep raw conversation context available internally, but do not show it as the main output.
public/control-center/pages/ai-command.js:3377:        preview.safetyLabel = preview.safetyLabel || "Conversation converted into a review-ready draft. No backend action executed.";
public/control-center/pages/ai-command.js:3595:			<span class="aicmd-room-chain-branch-label">Customer / revenue branch</span>
public/control-center/pages/ai-command.js:3743:		const lanes = ["Strategy", "Content", "Media", "Customer Ops", "Sales / CRM", "Compliance", "Publishing", "Operations"];
public/control-center/pages/ai-command.js:3794:        if (roleId === "operations" || roleId === "customer_ops") return `${label} is preparing your task handoff...`;
public/control-center/pages/ai-command.js:3803:function renderAiRoomConversationHeader(session, bridgeStatus, escapeHtml) {
public/control-center/pages/ai-command.js:3809:		? "Team orchestration across strategy, writing, media/video, compliance, publishing, customer operations, sales/CRM, and operations"
public/control-center/pages/ai-command.js:3815:		<div class="aicmd-room-conversation-head" data-role="${escapeHtml(isTeam ? "team" : getAiRoomRoleId(spec.id))}">
public/control-center/pages/ai-command.js:3818:				<span class="aicmd-room-kicker">Conversation Room</span>
public/control-center/pages/ai-command.js:3952:			<span class="aicmd-v2-lang-chip" title="Input language">🎤 ${escapeHtml(languagePlan.conversationLanguage)}</span>
public/control-center/pages/ai-command.js:4160:                                        <p>${hasPreview ? "Review the result, then route draft context to the next workspace." : "Create a preview from the conversation before routing work to another workspace."}</p>
public/control-center/pages/ai-command.js:4225:                                        <span>Choose Draft, Task Preview, Workflow Preview, or Handoff Preview, then create a review-ready preview from the conversation.</span>
public/control-center/pages/ai-command.js:4236:                                <div class="aicmd-room-planned-note">This is a review-ready preview. Execution, publishing, approvals, CRM updates, external sends, durable task creation, and workflow runs happen only in the owning destination workspace after confirmation.</div>
public/control-center/pages/ai-command.js:4238:                                <div class="aicmd-room-planned-note">No routed preview yet. Create a Draft, Task Preview, Workflow Preview, or Handoff Preview from the conversation first.</div>
public/control-center/pages/ai-command.js:4282:				<li><span>Read preview aloud (browser)</span><strong class="${speechSynthAvailable ? "is-available" : "is-planned"}">${speechSynthAvailable ? "Available in this browser" : "Not supported in this browser"}</strong></li>
public/control-center/pages/ai-command.js:4291:function renderPhase3SpecialistConversation(session, bridgeStatus, escapeHtml) {
public/control-center/pages/ai-command.js:4299:        const allMessages = asArray(session.messages);
public/control-center/pages/ai-command.js:4300:        const selectedMessages = allMessages.filter((message) => {
public/control-center/pages/ai-command.js:4326:                ? "Chat only. No workflow run, durable task, external handoff action, approval, publishing action, CRM update, or customer action was created."
public/control-center/pages/ai-command.js:4329:                ? `Start a focused conversation with ${selectedLabel}.`
public/control-center/pages/ai-command.js:4373:        const fallbackSelectedResponses = !selectedMessages.length && selectedResponses.length
public/control-center/pages/ai-command.js:4392:        const conversationMessages = selectedMessages.length ? selectedMessages : fallbackSelectedResponses;
public/control-center/pages/ai-command.js:4398:                                        <h3 class="aicmd-v2-chat-title">Conversation</h3>
public/control-center/pages/ai-command.js:4447:                        ${conversationMessages.length ? `
public/control-center/pages/ai-command.js:4449:                                        ${conversationMessages.map(renderMessage).join("")}
public/control-center/pages/ai-command.js:4453:                                        <strong>No conversation with ${escapeHtml(selectedLabel)} yet</strong>
public/control-center/pages/ai-command.js:4542:		{ label: "Conversation language", value: languagePlan.conversationLanguage, present: true },
public/control-center/pages/ai-command.js:4552:	const scopedContextItems = session.teamMode === "solo" && session.modeId === "customer_ops"
public/control-center/pages/ai-command.js:4554:			{ label: "Open conversations", value: "Snapshot / requires runtime surface", present: false, scoped: true },
public/control-center/pages/ai-command.js:4560:		: session.teamMode === "solo" && session.modeId === "sales_crm"
public/control-center/pages/ai-command.js:4563:				{ label: "CRM", value: "Profile context", present: true, scoped: true },
public/control-center/pages/ai-command.js:4696:           if (asArray(savedOutput.messages).length && !asArray(session.messages).length) {
public/control-center/pages/ai-command.js:4697:                   session.messages = asArray(savedOutput.messages).slice(-40);
public/control-center/pages/ai-command.js:4757:		// Final Room v1 renders the conversation, composer, output workspace, and tools directly.
public/control-center/pages/ai-command.js:4768:												${renderAiRoomConversationHeader(session, bridgeStatus, escapeHtml)}
public/control-center/pages/ai-command.js:4769:												<div class="aicmd-room-specialist-conversation">
public/control-center/pages/ai-command.js:4770:													${renderPhase3SpecialistConversation(session, bridgeStatus, escapeHtml)}
public/control-center/pages/ai-command.js:4818:			persistSessionDraft(sessionKey, session, "Draft saved locally");
public/control-center/pages/ai-command.js:4837:		                        messages: session.messages,
public/control-center/pages/ai-command.js:4862:		                session.messages = [];
public/control-center/pages/ai-command.js:4873:		                        messages: [],
public/control-center/pages/ai-command.js:4984:				persistSessionDraft(sessionKey, session, "Draft auto-saved locally");
public/control-center/pages/ai-command.js:5080:		                session.messages.push(userChatMessage);
public/control-center/pages/ai-command.js:5081:		                session.messages = session.messages.slice(-40);
public/control-center/pages/ai-command.js:5088:		                        messages: session.messages,
public/control-center/pages/ai-command.js:5105:		                                messages: session.messages.slice(-12),
public/control-center/pages/ai-command.js:5106:		                                language: languagePlan.conversationLanguage === "Auto" ? "Auto - follow the latest user message language" : languagePlan.conversationLanguage,
public/control-center/pages/ai-command.js:5116:		                                safetyInstruction: "Chat only. No task/workflow/handoff/approval/publish/customer/CRM execution.",
public/control-center/pages/ai-command.js:5155:		                        session.messages.push(assistantChatMessage);
public/control-center/pages/ai-command.js:5156:		                        session.messages = session.messages.slice(-40);
public/control-center/pages/ai-command.js:5192:		                                messages: session.messages,
public/control-center/pages/ai-command.js:5209:		                                messages: session.messages,
public/control-center/pages/ai-command.js:5222:                // Phase 1: stages draft locally from conversation context. No backend execution.
public/control-center/pages/ai-command.js:5227:                                const preview = setPreviewFromConversation({
public/control-center/pages/ai-command.js:5234:                                persistSessionDraft(sessionKey, session, "Guidance preview prepared from conversation");
public/control-center/pages/ai-command.js:5236:                                updateStatus("Guidance preview prepared from conversation context.");
public/control-center/pages/ai-command.js:5237:                                showMessage?.(`${specLabel} guidance preview prepared from conversation.`);
public/control-center/pages/ai-command.js:5243:                // Phase 1: converts the current conversation into a task preview. No backend execution.
public/control-center/pages/ai-command.js:5252:                                const preview = setPreviewFromConversation({
public/control-center/pages/ai-command.js:5259:                                persistSessionDraft(sessionKey, session, "Task preview prepared from conversation");
public/control-center/pages/ai-command.js:5260:                                updateStatus("Task draft preview prepared from conversation context. Review before creating durable tasks.");
public/control-center/pages/ai-command.js:5261:                                showMessage?.("Task draft preview prepared from conversation.");
public/control-center/pages/ai-command.js:5275:                                const preview = setPreviewFromConversation({
public/control-center/pages/ai-command.js:5282:                                persistSessionDraft(sessionKey, session, "Workflow preview prepared from conversation");
public/control-center/pages/ai-command.js:5283:                                updateStatus("Workflow draft preview prepared from conversation context. No workflow run started.");
public/control-center/pages/ai-command.js:5284:                                showMessage?.("Workflow draft preview prepared from conversation.");
public/control-center/pages/ai-command.js:5290:                // Phase 1: converts the current conversation into a handoff preview. No backend write.
public/control-center/pages/ai-command.js:5299:                                const preview = setPreviewFromConversation({
public/control-center/pages/ai-command.js:5306:                                persistSessionDraft(sessionKey, session, "Handoff preview prepared from conversation");
public/control-center/pages/ai-command.js:5307:                                updateStatus("Handoff preview prepared from conversation context. Review destination before sending.");
public/control-center/pages/ai-command.js:5308:                                showMessage?.("Handoff preview prepared from conversation.");
public/control-center/pages/ai-command.js:5358:				persistSessionDraft(sessionKey, session, "Draft saved locally");
public/control-center/pages/ai-command.js:5359:				updateStatus("Composer draft saved locally.");
public/control-center/pages/ai-command.js:5360:				showMessage?.("Composer draft saved locally.");
public/control-center/pages/ai-command.js:5432:				updateStatus(`Response saved locally ${formatTime(saved.updatedAt)}.`);
public/control-center/pages/ai-command.js:5433:				showMessage?.("Response saved locally.");
public/control-center/pages/ai-command.js:5441:		                const preview = setPreviewFromConversation({
public/control-center/pages/ai-command.js:5456:		                        messages: session.messages,
public/control-center/pages/ai-command.js:5462:		                updateStatus("Conversation converted into a draft preview.");
public/control-center/pages/ai-command.js:5463:		                showMessage?.("Draft preview ready from conversation.");
public/control-center/pages/ai-command.js:5508:					updateStatus("Read is not supported in this browser.");
public/control-center/pages/ai-command.js:5514:				updateStatus("Reading response locally in browser.");
public/control-center/pages/ai-command.js:5608:				updateStatus(`Preview saved locally ${formatTime(saved.updatedAt)}.`);
public/control-center/pages/ai-command.js:5609:				showMessage?.("Preview saved locally.");
public/control-center/pages/ai-command.js:5619:					updateStatus("Read preview is not supported in this browser.");
public/control-center/pages/ai-command.js:5628:				updateStatus("Reading preview locally in browser.");
public/control-center/pages/campaign-studio.js:235:    audienceNeed: overviewData.audience_problem || overviewData.customer_problem || "",
public/control-center/pages/campaign-studio.js:739:  const support = [];
public/control-center/pages/campaign-studio.js:755:          ? "Connected inside the current system, so this channel can support launch execution."
public/control-center/pages/campaign-studio.js:790:  support.push({
public/control-center/pages/campaign-studio.js:794:      ? "Use lifecycle support to reinforce the launch and recover warm traffic."
public/control-center/pages/campaign-studio.js:795:      : "Add email support once the channel is connected and lists are ready."
public/control-center/pages/campaign-studio.js:797:  support.push({
public/control-center/pages/campaign-studio.js:800:    rationale: seoOpportunities[0]?.body || "Use website and search support to capture campaign intent beyond social reach."
public/control-center/pages/campaign-studio.js:802:  support.push({
public/control-center/pages/campaign-studio.js:817:    support.push({
public/control-center/pages/campaign-studio.js:827:    support: uniqueBy(support, (item) => item.label).slice(0, 3)
public/control-center/pages/campaign-studio.js:951:      ? `${topOrganic ? `${topOrganic.label} first` : ""}${topOrganic && topPaid ? " • " : ""}${topPaid ? `${topPaid.label} as paid support` : ""}`
public/control-center/pages/campaign-studio.js:966:    ...channelMix.support.map((item) => item.label.toLowerCase())
public/control-center/pages/campaign-studio.js:978:    if (missingAssets.length) missingInputs.push("Supporting assets");
public/control-center/pages/campaign-studio.js:986:    const supportingAssetSuggestion = wave.index === 1
public/control-center/pages/campaign-studio.js:998:      supportingAssetSuggestion
public/control-center/pages/campaign-studio.js:1536:    const recommendedChannelCount = channelMix.organic.length + channelMix.paid.length + channelMix.support.length;
public/control-center/pages/campaign-studio.js:1791:                        <span>Supporting assets</span>
public/control-center/pages/campaign-studio.js:1792:                        <strong>${escapeHtml(wave.supportingAssetSuggestion)}</strong>
public/control-center/pages/campaign-studio.js:1797:                        ? `<div class="campaign-wave-callout">Missing inputs: ${escapeHtml(wave.missingInputs.join(", "))}</div>`
public/control-center/pages/campaign-studio.js:1798:                        : `<div class="campaign-wave-callout is-ready">${escapeHtml(wave.roleHint)}</div>`
public/control-center/pages/campaign-studio.js:1877:                  <h4 class="insights-subtitle">Recommended support channels</h4>
public/control-center/pages/campaign-studio.js:1878:                  ${renderChannelRecommendationCards(channelMix.support, escapeHtml)}
public/control-center/pages/campaign-studio.js:1941:                  "SEO support is not currently blocked."
public/control-center/pages/content-studio-workspace.js:689:    showMessage?.("Content draft saved locally.");
public/control-center/pages/content-studio-workspace.js:1255:  const cta = lines.find((line) => /cta|call to action/i.test(line)) || lines[lines.length - 1] || "CTA: missing";
public/control-center/pages/content-studio-workspace.js:2078:        failMessage: "Design brief kept locally because backend handoff save is unavailable.",
public/control-center/pages/content-studio-workspace.js:2080:        localMessage: "Design brief prepared for Media Studio locally."
public/control-center/pages/content-studio-workspace.js:2110:        failMessage: "Publishing handoff kept locally because backend save is unavailable.",
public/control-center/pages/content-studio-workspace.js:2112:        localMessage: "Publishing handoff created locally."
public/control-center/pages/governance.js:960:        <section class="panel mhos-clean-surface" aria-label="Supporting governance signals">
public/control-center/pages/governance.js:963:              <div class="panel-kicker">Supporting signals</div>
public/control-center/pages/home.js:164:          "Ready to support this project."
public/control-center/pages/home.js:1004:        <section class="card home-customer-ops-panel">
public/control-center/pages/home.js:1007:              <p class="card-label">Customer Operations Pulse</p>
public/control-center/pages/home.js:1008:              <h3>Customer Operations Readiness</h3>
public/control-center/pages/home.js:1009:              <span class="section-helper">Status and handoff only. No live CRM/IVR claims.</span>
public/control-center/pages/home.js:1012:          <div class="home-customer-ops-body">
public/control-center/pages/home.js:1013:            <span class="home-customer-ops-badge">${dashboard.health?.customerOpsStatus || "Planned/Partial"}</span>
public/control-center/pages/insights.js:685:    systemLessons.push("Start ingesting post-level Facebook, Instagram, TikTok, and YouTube insight data so winning patterns can be reused automatically.");
public/control-center/pages/integrations.js:37:const UNSUPPORTED_INTEGRATION_IDS = new Set(["amazon", "smtp", "mailer", "crm"]);
public/control-center/pages/integrations.js:88:        enables: "Product sync, order sync, customer sync, and sales reporting.",
public/control-center/pages/integrations.js:89:        dataScope: ["Products", "Orders", "Customers", "Sales"],
public/control-center/pages/integrations.js:101:        backendSupported: false,
public/control-center/pages/integrations.js:102:        unavailableReason: "Backend provider support is not configured yet.",
public/control-center/pages/integrations.js:148:        enables: "Post insights, engagement data, comments, publishing support, and ad account linkage.",
public/control-center/pages/integrations.js:184:        enables: "Video insights, engagement, comments, profile metrics, and future publishing support.",
public/control-center/pages/integrations.js:220:        enables: "Post insights, audience signals, company page analytics, and publishing support.",
public/control-center/pages/integrations.js:262:        enables: "Tag management, event instrumentation, pixel deployment, and attribution support.",
public/control-center/pages/integrations.js:277:        purpose: "Meta tracking layer for conversions, events, and paid attribution support.",
public/control-center/pages/integrations.js:296:        enables: "Events, conversion tracking, attribution, and paid optimization support.",
public/control-center/pages/integrations.js:344:    id: "email-crm",
public/control-center/pages/integrations.js:345:    title: "Email & CRM",
public/control-center/pages/integrations.js:346:    description: "Lifecycle messaging, customer records, contact sync, and email campaign infrastructure.",
public/control-center/pages/integrations.js:351:        backendSupported: false,
public/control-center/pages/integrations.js:352:        unavailableReason: "Backend provider support is not configured yet.",
public/control-center/pages/integrations.js:356:        whyItMatters: "Email is critical for lifecycle recovery, conversion support, and owned audience communication.",
public/control-center/pages/integrations.js:357:        enables: "Campaign sending, lifecycle messages, and email workflow execution.",
public/control-center/pages/integrations.js:363:          { key: "senderEmail", label: "Sender email", placeholder: "support@brand.com", required: true },
public/control-center/pages/integrations.js:371:        backendSupported: false,
public/control-center/pages/integrations.js:372:        unavailableReason: "Backend provider support is not configured yet.",
public/control-center/pages/integrations.js:405:        id: "crm",
public/control-center/pages/integrations.js:407:        backendSupported: false,
public/control-center/pages/integrations.js:408:        unavailableReason: "Backend provider support is not configured yet.",
public/control-center/pages/integrations.js:409:        label: "CRM Integration",
public/control-center/pages/integrations.js:411:        purpose: "Customer record sync for lead, customer, and lifecycle intelligence.",
public/control-center/pages/integrations.js:412:        whyItMatters: "CRM data helps the system connect campaigns to pipeline, customers, and repeat purchase behavior.",
public/control-center/pages/integrations.js:413:        enables: "Contact sync, customer sync, lead intelligence, and lifecycle learning.",
public/control-center/pages/integrations.js:414:        dataScope: ["Contacts", "Customers", "Leads", "Lifecycle state"],
public/control-center/pages/integrations.js:415:        permissionScope: "CRM account ID + API token",
public/control-center/pages/integrations.js:418:          { key: "workspaceId", label: "Workspace / account ID", placeholder: "CRM workspace ID", required: true },
public/control-center/pages/integrations.js:419:          { key: "apiKey", label: "API key", placeholder: "CRM API key", type: "password" },
public/control-center/pages/integrations.js:457:        permissionScope: "Customer ID + OAuth token",
public/control-center/pages/integrations.js:459:        primaryField: "customerId",
public/control-center/pages/integrations.js:461:          { key: "customerId", label: "Customer ID", placeholder: "123-456-7890", required: true },
public/control-center/pages/integrations.js:900:  if (card.backendSupported === false) return "Open setup";
public/control-center/pages/integrations.js:909:  if (card.backendSupported === false) {
public/control-center/pages/integrations.js:1001:    { key: "orders", pattern: /order|sale|revenue|product|listing|merchant|customer|contact|lead/ }
public/control-center/pages/integrations.js:1040:  if (integration.domainId === "email-crm") {
public/control-center/pages/integrations.js:1122:  if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
public/control-center/pages/integrations.js:1123:    return asString(integration.unavailableReason) || "This integration is unavailable because backend provider support is not configured yet.";
public/control-center/pages/integrations.js:1148:  if (card.backendSupported === false) {
public/control-center/pages/integrations.js:1325:            unsupportedIntegrationIds: UNSUPPORTED_INTEGRATION_IDS,
public/control-center/pages/integrations.js:1411:    if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
public/control-center/pages/integrations.js:1412:      showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
public/control-center/pages/integrations.js:1451:    if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
public/control-center/pages/integrations.js:1452:      showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
public/control-center/pages/integrations.js:1477:    if (integration.backendSupported === false || UNSUPPORTED_INTEGRATION_IDS.has(integration.id)) {
public/control-center/pages/integrations.js:1478:      showError?.(integration.unavailableReason || "This integration is unavailable because backend provider support is not configured yet.");
public/control-center/pages/integrations.js:1598:          unsupportedIntegrationIds: UNSUPPORTED_INTEGRATION_IDS,
public/control-center/pages/library.js:146:    why: "Research and proof documents support claims, trust signals, and strategy decisions.",
public/control-center/pages/media-studio-workspace.js:795:    `Objective: ${form.objective || overview.primary_goal || "support campaign readiness"}.`,
public/control-center/pages/media-studio-workspace.js:797:    "Keep product identity accurate, leave safe text area, avoid unsupported claims, and prepare for Publishing handoff."
public/control-center/pages/media-studio-workspace.js:803:  return `${base}\n\nProduction constraints: accurate product identity, clean composition, strong focal hierarchy, channel-safe crop, no unsupported claims, no cluttered text, and enough negative space for publishing copy.`;
public/control-center/pages/media-studio-workspace.js:1168:  session.draftMessage = "Media draft saved locally.";
public/control-center/pages/media-studio-workspace.js:2332:        <div class="media-prompt-box media-block-gap">${escapeHtml(voiceScript || asString(payload.message) || "No voice script or audio output is available yet. Voice mode prepares voiceover scripts/audio outputs only; it does not run IVR, phone calls, or call-center workflows.")}</div>
public/control-center/pages/media-studio-workspace.js:2555:          <p class="card-label">AI Agent Support</p>
public/control-center/pages/media-studio-workspace.js:2692:    showMessage?.("Media draft saved locally.");
public/control-center/pages/media-studio-workspace.js:2705:    showMessage?.("Backend media save unavailable; draft kept locally.");
public/control-center/pages/media-studio-workspace.js:2761:    const callApi = generationApiForMode(activeRequestType);
public/control-center/pages/media-studio-workspace.js:2764:      const response = await callApi(buildGenerationRequestPayload(session));
public/control-center/pages/media-studio-workspace.js:2853:        ? `${authMessage} Draft kept locally.`
public/control-center/pages/media-studio-workspace.js:2854:        : payloadMessage || error?.message || "Generation failed. Draft kept locally.";
public/control-center/pages/media-studio-workspace.js:2950:          applyPrompt(improvePrompt(session.form.prompt), result.message || "Prompt improved locally.");
public/control-center/pages/media-studio-workspace.js:2958:          applyPrompt(improvePrompt(session.form.prompt), `${authMessage} Prompt improved locally.`);
public/control-center/pages/media-studio-workspace.js:2962:        applyPrompt(improvePrompt(session.form.prompt), "Prompt improved locally.");
public/control-center/pages/media-studio-workspace.js:2979:          applyPrompt(makeBrandSafe(session.form.prompt), result.message || "Prompt made brand-safe locally.");
public/control-center/pages/media-studio-workspace.js:2991:          applyPrompt(makeBrandSafe(session.form.prompt), `${authMessage} Prompt made brand-safe locally.`);
public/control-center/pages/media-studio-workspace.js:2995:        applyPrompt(makeBrandSafe(session.form.prompt), "Prompt made brand-safe locally.");
public/control-center/pages/media-studio-workspace.js:3076:        showMessage?.("Media job marked review-ready locally.");
public/control-center/pages/media-studio-workspace.js:3157:        showMessage?.("Media draft moved to needs review locally.");
public/control-center/pages/media-studio-workspace.js:3222:          showMessage?.("Task action kept locally because backend task save is unavailable.");
public/control-center/pages/media-studio-workspace.js:3399:        showMessage?.(`${specialist.title} draft saved locally.`);
public/control-center/pages/media-studio-workspace.js:3449:      showMessage?.("Publishing package handoff kept locally because backend handoff save is unavailable.");
public/control-center/pages/media-studio-workspace.js:3452:    showMessage?.("Publishing package handoff prepared locally.");
public/control-center/pages/operations-centers.js:351:      label: "Inbox",
public/control-center/pages/operations-centers.js:454:          <p>Review-only context from ${escapeHtml(titleCase(source))}. No durable task is created automatically from this handoff.</p>
public/control-center/pages/operations-centers.js:543:          description: "Supporting cross-center health and risk signal.",
public/control-center/pages/operations-centers.js:544:          badge: "Supporting context"
public/control-center/pages/operations-centers.js:914:          description: "Supporting cross-center runtime and queue pressure context.",
public/control-center/pages/operations-centers.js:915:          badge: "Supporting context"
public/control-center/pages/operations-centers.js:1204:          description: "Supporting cross-center runtime and execution health context.",
public/control-center/pages/operations-centers.js:1205:          badge: "Supporting context"
public/control-center/pages/operations-centers.js:1448:  const inboxItems = asArray(notificationCenter.notification_items).map((item) => ({
public/control-center/pages/operations-centers.js:1455:    item_type: "inbox"
public/control-center/pages/operations-centers.js:1475:  const inboxList = inboxItems.map((item, index) => ({
public/control-center/pages/operations-centers.js:1477:    _opsKey: getOpsItemKey(item, index, "inbox")
public/control-center/pages/operations-centers.js:1480:  let listItems = session.focus === "inbox" ? inboxList : baseAlerts;
public/control-center/pages/operations-centers.js:1542:            <p class="std-context-description">Review operational alerts, unread inbox state, approvals, sync issues, publishing, claim risk, provider health, and workflow completion for ${escapeHtml(projectLabel)}.</p>
public/control-center/pages/operations-centers.js:1545:              <span class="std-context-chip"><span>Unread Inbox</span><strong>${escapeHtml(formatCount(notificationCenter.unread_count))}</strong></span>
public/control-center/pages/operations-centers.js:1559:          description: "Supporting cross-center runtime and urgency signal context.",
public/control-center/pages/operations-centers.js:1560:          badge: "Supporting context"
public/control-center/pages/operations-centers.js:1568:                <h3>${escapeHtml(session.focus === "inbox" ? "Notification history and read-state review" : "Operational alert review")}</h3>
public/control-center/pages/operations-centers.js:1569:                <p>${escapeHtml(session.focus === "inbox" ? "Review durable inbox history. Mark Read updates read-state only where a backend notification id exists." : "Review route-aware alerts, then inspect the selected signal before routing or follow-up.")}</p>
public/control-center/pages/operations-centers.js:1579:              { value: "inbox", label: "Inbox", count: formatCount(inboxList.length) }
public/control-center/pages/operations-centers.js:1583:              <input id="notificationCenterSearch" class="command-input" type="text" placeholder="Search alerts, sources, messages..." value="${escapeHtml(session.search)}">
public/control-center/pages/operations-centers.js:1607:                  <p>${escapeHtml(selectedItem ? "Review source, severity, timing, and owning route before follow-up." : "Choose an alert or inbox item to inspect details.")}</p>
public/control-center/pages/operations-centers.js:1631:                  <p>Active actions are refresh, route, AI guidance, and Mark Read only where supported. Lifecycle controls remain disabled until backend mutation safety checks are approved.</p>
public/control-center/pages/operations-centers.js:1884:    description: "Review alerts, unread inbox state, approvals, provider health, publishing, claim risks, and workflow completion signals with Mark Read limited to notification read-state."
public/control-center/pages/publishing.js:127:let publishingRenderCallback = null;
public/control-center/pages/publishing.js:132:    publishingRenderCallback = render;
public/control-center/pages/publishing.js:142:    if (typeof publishingRenderCallback === "function") {
public/control-center/pages/publishing.js:143:      publishingRenderCallback();
public/control-center/pages/publishing.js:149:  publishingRenderCallback = render;
public/control-center/pages/publishing.js:1017:      ? "No queue item is ready. Start with a draft and save it locally until it can be scheduled."
public/control-center/pages/publishing.js:1485:  function saveDraftLocally(message = "Publishing draft saved locally.") {
public/control-center/pages/publishing.js:1496:    const local = saveDraftLocally("Publishing draft saved locally.");
public/control-center/pages/publishing.js:1625:        saveDraftLocally("Backend schedule unavailable; draft kept locally.");
public/control-center/pages/publishing.js:1803:      saveDraftLocally("Workflow output loaded into a local publishing draft.");
public/control-center/pages/research.js:747:      preview: "Translate audience and search intelligence into topics, hooks, formats, and calls to action.",
public/control-center/pages/research.js:1529:                        "Once competitor, audience, SEO, or product signals arrive, the page will turn them into short-term and growth-oriented opportunities automatically.",
public/control-center/pages/settings.js:384:        placeholder: "Reject anything with unsupported claims, brand mismatch, or missing route metadata. Two failed reviews escalate."
public/control-center/pages/settings.js:942:      revisionRules: "Reject unsupported claims, brand drift, weak hooks, or missing metadata. Two revisions escalate to the owner.",
public/control-center/pages/settings.js:1050:      prohibitedOutputs: "No fake testimonials, fake claims, altered packaging, counterfeit logos, or unsupported medical positioning.",
public/control-center/pages/settings.js:1202:    risks.push("No default publishing channels are selected, so campaign output cannot route automatically.");
public/control-center/pages/settings.js:1222:    risks.push("Claim safety is weakened, so unsupported product or compliance claims may slip into drafts.");
public/control-center/pages/setup.js:84:  competitors: "Supports differentiation and benchmark-aware recommendations.",
public/control-center/pages/setup.js:96:  audience_primary: "Defines the main customer group the system should optimize messages for.",
public/control-center/pages/setup.js:241:    audience_problem: overviewData.audience_problem || overviewData.customer_problem || "",
public/control-center/pages/setup.js:539:  const audience = asString(values.audience_primary).trim() || "a focused customer segment";
public/control-center/pages/setup.js:1020:      saveLocal(`Draft saved locally for ${draftKeyName}.`);
public/control-center/pages/setup.js:1048:            ? " Project name remains local-only until project rename support exists."
public/control-center/pages/setup.js:1533:                  ${renderField({ name: "audience_primary", label: "Primary audience", value: values.audience_primary, helper: "Main customer segment.", placeholder: "Who are we targeting?", escapeHtml, multiline: true, rows: 3, required: true })}
public/control-center/pages/setup.js:1544:                  ${renderField({ name: "secondary_goal", label: "Secondary goal", value: values.secondary_goal, helper: "Supporting objective.", placeholder: "Optional secondary outcome", escapeHtml, multiline: true, rows: 3 })}
public/control-center/pages/setup.js:1553:                  ${renderField({ name: "differentiation", label: "Differentiation", value: values.differentiation, helper: "How this brand stands out.", placeholder: "Why customers choose us", escapeHtml, multiline: true, rows: 3 })}
public/control-center/pages/workflows.js:820:      <div class="wfexec-draft-status">${escapeHtml(draftStatus || "Drafts auto-save locally per workflow.")}</div>
public/control-center/pages/workflows.js:1105:  showMessage?.(allowPersistent ? "Workflow context sent to AI Command." : "Workflow context sent locally to AI Command.");
public/control-center/pages/workflows.js:1337:    `Confirm workflow review package preparation\n\nAction: Prepare and record backend workflow output for "${title}".\n\nThis may call the backend workflow run endpoint and update workflow run history. It prepares a review output only and does not publish, send messages, create CRM records, bypass Governance, or perform destructive actions.\n\nSelect Cancel to keep the workflow unchanged.`
public/control-center/pages/ai-command/tool-dock.js:211:  lines.push("Use the selected Library source as context. Do not invent unsupported claims.");
public/control-center/pages/ai-command/tool-dock.js:383:      sourceTypes: ["current_chat", "market_notes", "customer_notes", "insights_report", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:518:      template: "Prepare SEO support for {projectName}. Ask for topic, market, language, and audience if missing. Create keyword ideas, search intent, meta title/description, blog outline, FAQ ideas, internal link ideas, and content gap notes."
public/control-center/pages/ai-command/tool-dock.js:800:      sourceTypes: ["audience_notes", "insights_report", "campaign_brief", "customer_notes", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:912:      template: "Review claims for {projectName}. Flag unsupported, risky, health/performance, legal, or approval-sensitive statements."
public/control-center/pages/ai-command/tool-dock.js:925:      template: "Rewrite this content in a safer compliant way. Keep the value clear while reducing unsupported or risky claims."
public/control-center/pages/ai-command/tool-dock.js:1036:  customer_ops: [
public/control-center/pages/ai-command/tool-dock.js:1046:      sourceTypes: ["customer_thread", "support_notes", "policy_doc", "faq_source", "current_chat", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:1048:      template: "Draft a safe customer reply for {projectName}. Do not send it. Include empathy, answer, next step, and escalation note if needed."
public/control-center/pages/ai-command/tool-dock.js:1059:      sourceTypes: ["customer_thread", "support_notes", "order_case_summary", "current_chat", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:1061:      template: "Prepare a ticket draft for {projectName}. Include issue summary, priority, owner, customer impact, and missing information."
public/control-center/pages/ai-command/tool-dock.js:1072:      sourceTypes: ["customer_thread", "sla_policy", "support_notes", "current_chat", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:1074:      template: "Review SLA or response risk for this customer context. Flag urgency, escalation needs, and safe next actions."
public/control-center/pages/ai-command/tool-dock.js:1084:      destinations: ["chat-preview", "operations-centers", "workflows", "sales-crm-draft"],
public/control-center/pages/ai-command/tool-dock.js:1085:      sourceTypes: ["customer_thread", "support_notes", "current_chat", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:1087:      template: "Summarize the customer context for {projectName}. Include issue, sentiment, open questions, risk, and next response."
public/control-center/pages/ai-command/tool-dock.js:1091:  sales_crm: [
public/control-center/pages/ai-command/tool-dock.js:1100:      destinations: ["chat-preview", "workflows", "content-studio", "sales-crm-draft"],
public/control-center/pages/ai-command/tool-dock.js:1103:      template: "Create a sales pitch for {projectName}. Include value proposition, customer pain, proof, offer, CTA, and follow-up note."
public/control-center/pages/ai-command/tool-dock.js:1113:      destinations: ["chat-preview", "content-studio", "workflows", "sales-crm-draft"],
public/control-center/pages/ai-command/tool-dock.js:1135:      badge: "CRM",
public/control-center/pages/ai-command/tool-dock.js:1139:      destinations: ["chat-preview", "workflows", "operations-centers", "sales-crm-draft"],
public/control-center/pages/ai-command/tool-dock.js:1140:      sourceTypes: ["lead_context", "crm_profile_summary", "sales_notes", "customer_notes", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:1287:          Preparation-only: this drawer creates a composer-ready instruction. It does not publish, send, route, create CRM records, run workflows, or mutate backend data.
public/control-center/pages/ai-command/tool-dock.js:1356:    crm: "CRM",
public/control-center/pages/ai-command/tool-dock.js:1373:    .replace(/\bCrm\b/g, "CRM")
public/control-center/pages/ai-command/tool-dock.js:1491:    "- If the conversation language differs from the publishable output language, keep any short explanation in the conversation language and put only the publishable content in the selected output language.",
public/control-center/pages/ai-command/tool-dock.js:1503:    `Prepare the output for ${destination}, but do not send, save, route, publish, or create records automatically.`,
public/control-center/pages/ai-command/tool-dock.js:1507:    "- Do not publish, send, route, save, overwrite, create CRM records, or run workflows.",
public/control-center/pages/ai-command/tool-dock.js:1508:    "- Do not make unsupported claims. Mark missing proof clearly."

## Route exports
public/control-center/pages/campaign-studio.js:1448:export const campaignStudioRoute = {
public/control-center/pages/media-studio-workspace.js:3462:export const mediaStudioRoute = {
public/control-center/pages/operations-centers.js:1747:export const taskCenterRoute = {
public/control-center/pages/operations-centers.js:1782:export const queueCenterRoute = {
public/control-center/pages/operations-centers.js:1830:export const jobMonitorRoute = {
public/control-center/pages/operations-centers.js:1878:export const notificationCenterRoute = {
public/control-center/pages/operations-centers.js:2065:export const operationsCentersRoute = {
public/control-center/pages/research.js:1101:export const researchRoute = {
public/control-center/pages/ai-command.js:4660:export const aiCommandRoute = {
public/control-center/pages/library.js:2884:export const libraryRoute = {
public/control-center/pages/home.js:643:export const homeRoute = {
public/control-center/pages/insights.js:1027:export const insightsRoute = {
public/control-center/pages/content-studio-workspace.js:2247:export const contentStudioRoute = {
public/control-center/pages/governance.js:1460:export const governanceRoute = {
public/control-center/pages/integrations.js:1556:export const integrationsRoute = {
public/control-center/pages/setup.js:1325:export const setupRoute = {
public/control-center/pages/publishing.js:1908:export const publishingRoute = {
public/control-center/pages/workflows.js:1769:export const workflowsRoute = {
public/control-center/pages/settings.js:2017:export const settingsRoute = {
public/control-center/pages/ads-manager.js:286:export const adsManagerRoute = {

## Customer-related navigateTo targets
public/control-center/pages/ai-command/tool-dock.js:1084:      destinations: ["chat-preview", "operations-centers", "workflows", "sales-crm-draft"],
public/control-center/pages/ai-command/tool-dock.js:1091:  sales_crm: [
public/control-center/pages/ai-command/tool-dock.js:1100:      destinations: ["chat-preview", "workflows", "content-studio", "sales-crm-draft"],
public/control-center/pages/ai-command/tool-dock.js:1113:      destinations: ["chat-preview", "content-studio", "workflows", "sales-crm-draft"],
public/control-center/pages/ai-command/tool-dock.js:1135:      badge: "CRM",
public/control-center/pages/ai-command/tool-dock.js:1139:      destinations: ["chat-preview", "workflows", "operations-centers", "sales-crm-draft"],
public/control-center/pages/ai-command/tool-dock.js:1140:      sourceTypes: ["lead_context", "crm_profile_summary", "sales_notes", "customer_notes", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:1287:          Preparation-only: this drawer creates a composer-ready instruction. It does not publish, send, route, create CRM records, run workflows, or mutate backend data.
public/control-center/pages/ai-command/tool-dock.js:1356:    crm: "CRM",
public/control-center/pages/ai-command/tool-dock.js:1373:    .replace(/\bCrm\b/g, "CRM")
public/control-center/pages/ai-command/tool-dock.js:1491:    "- If the conversation language differs from the publishable output language, keep any short explanation in the conversation language and put only the publishable content in the selected output language.",
public/control-center/pages/ai-command/tool-dock.js:1507:    "- Do not publish, send, route, save, overwrite, create CRM records, or run workflows.",
public/control-center/pages/media-studio-workspace.js:2332:        <div class="media-prompt-box media-block-gap">${escapeHtml(voiceScript || asString(payload.message) || "No voice script or audio output is available yet. Voice mode prepares voiceover scripts/audio outputs only; it does not run IVR, phone calls, or call-center workflows.")}</div>
public/control-center/pages/operations-centers.js:1583:              <input id="notificationCenterSearch" class="command-input" type="text" placeholder="Search alerts, sources, messages..." value="${escapeHtml(session.search)}">
public/control-center/pages/research.js:747:      preview: "Translate audience and search intelligence into topics, hooks, formats, and calls to action.",
public/control-center/pages/ai-command.js:105:                id: "sales_crm",
public/control-center/pages/ai-command.js:106:                label: "Sales / CRM Lead",
public/control-center/pages/ai-command.js:108:                summary: "Lead qualification, outreach drafts, follow-up cadence, and CRM handoff notes.",
public/control-center/pages/ai-command.js:129:	sales: "sales_crm",
public/control-center/pages/ai-command.js:130:	crm: "sales_crm",
public/control-center/pages/ai-command.js:131:	sales_crm: "sales_crm",
public/control-center/pages/ai-command.js:159:		placeholder: "Ask the Content Writer to draft captions, hooks, landing copy, or campaign messages…",
public/control-center/pages/ai-command.js:271:		id: "sales_crm",
public/control-center/pages/ai-command.js:272:		label: "Sales / CRM Lead",
public/control-center/pages/ai-command.js:273:		position: "Revenue and CRM Operations Lead",
public/control-center/pages/ai-command.js:275:		summary: "Lead qualification, outreach drafts, follow-up cadence, CRM profile summaries, and sales handoff notes.",
public/control-center/pages/ai-command.js:276:		placeholder: "Ask the Sales / CRM Lead to qualify a lead, draft outreach, plan follow-ups, summarize CRM context, or prepare a sales handoff for review…",
public/control-center/pages/ai-command.js:277:		canHelp: ["Qualify lead context", "Draft outreach", "Plan follow-up sequences", "Summarize CRM profiles", "Prepare sales handoffs"],
public/control-center/pages/ai-command.js:278:		cannotDo: ["Send outreach", "Mutate CRM records", "Advance pipeline stages", "Confirm follow-ups without review"],
public/control-center/pages/ai-command.js:279:		destinations: ["CRM", "Workflows", "Operations Centers"],
public/control-center/pages/ai-command.js:280:		safetyNote: "Sales and CRM outputs are guidance and drafts only. CRM mutations and outreach sends require confirmation in the owning surface.",
public/control-center/pages/ai-command.js:347:	sales_crm: [
public/control-center/pages/ai-command.js:360:	{ label: "Review customer and sales impact", sub: "Customer Ops, Sales / CRM, Operations" }
public/control-center/pages/ai-command.js:383:const AI_ROOM_BUSINESS_BRANCH = ["Customer Ops", "Sales / CRM", "Operations"];
public/control-center/pages/ai-command.js:396:	sales_crm: "SC"
public/control-center/pages/ai-command.js:498:	sales_crm: [
public/control-center/pages/ai-command.js:499:		{ id: "lead-qualification", label: "Lead Qualification", action: "preview", intent: "guidance", template: "Qualify the lead for {project}. Include fit, intent, urgency, missing CRM fields, and the safest next step." },
public/control-center/pages/ai-command.js:502:		{ id: "crm-profile-summary", label: "CRM Profile Summary", action: "preview", intent: "guidance", template: "Summarize the CRM profile context for {project}. Include fit, history, open questions, and next sales action without mutating CRM data." },
public/control-center/pages/ai-command.js:639:		if (/act as the sales|act as the crm|sales \/ crm lead/i.test(text)) return "sales_crm";
public/control-center/pages/ai-command.js:703:	if (/act as the sales|act as the crm|sales \/ crm lead/i.test(text)) return "sales_crm";
public/control-center/pages/ai-command.js:876:	const conversationLanguage = asString(
public/control-center/pages/ai-command.js:877:		overview.conversation_language ||
public/control-center/pages/ai-command.js:884:		conversationLanguage,
public/control-center/pages/ai-command.js:952:			messages: [],
public/control-center/pages/ai-command.js:1120:        const messages = asArray(session.messages);
public/control-center/pages/ai-command.js:1122:        const hasContent = messages.length || responses.length || asObject(session.outputPreview).title;
public/control-center/pages/ai-command.js:1128:        const firstUser = messages.find((message) => asString(message.role) === "user");
public/control-center/pages/ai-command.js:1136:                messages: messages.slice(-40),
public/control-center/pages/ai-command.js:1159:        session.messages = asArray(record.messages).slice(-40);
public/control-center/pages/ai-command.js:1192:			"When the request touches inbox, tickets, leads, outreach, or CRM, include Customer Ops -> Sales/CRM -> Operations.",
public/control-center/pages/ai-command.js:1201:		`User conversation language: ${safeLanguage}`,
public/control-center/pages/ai-command.js:1272:	if (id === "sales_crm") return "workflows";
public/control-center/pages/ai-command.js:1447:				"Use Arabic freely in the conversation; publishable copy should be reviewed in German.",
public/control-center/pages/ai-command.js:1605:	if (specialistId === "sales_crm") {
public/control-center/pages/ai-command.js:1608:			title: outputType === "handoff" ? "Sales Handoff" : "Sales / CRM Draft: Lead and outreach plan",
public/control-center/pages/ai-command.js:1609:			summary: "Sales and CRM draft prepared with lead qualification, outreach direction, follow-up cadence, and pipeline handoff notes.",
public/control-center/pages/ai-command.js:1610:			mainOutput: "Use this as a sales planning draft. Confirm CRM context and owner before sending outreach or changing pipeline status.",
public/control-center/pages/ai-command.js:1627:				"CRM profile and pipeline changes remain outside AI Team.",
public/control-center/pages/ai-command.js:1630:			nextStep: "Review the lead fit, confirm owner, then route the handoff to operations or the CRM surface.",
public/control-center/pages/ai-command.js:1635:				"Route sales handoff without mutating CRM data"
public/control-center/pages/ai-command.js:1638:			safetyLabel: "No outreach sent, CRM record changed, follow-up scheduled, or pipeline stage advanced."
public/control-center/pages/ai-command.js:1706:			"Customer Ops and Sales / CRM join when the request touches inbox, tickets, leads, outreach, or CRM"
public/control-center/pages/ai-command.js:1710:			"Writer: draft hooks, captions, messages, email, or outreach copy",
public/control-center/pages/ai-command.js:1714:			"Customer Ops / Sales: add reply, ticket, lead, outreach, or CRM handoff drafts when relevant",
public/control-center/pages/ai-command.js:1719:		confirmationNote: "No task, workflow, outreach, customer reply, CRM update, approval, or publishing action is executed from Full Team mode.",
public/control-center/pages/ai-command.js:1971:		sales_crm: ["lead", "leads", "crm", "sales", "outreach", "follow-up", "follow up", "pipeline", "dealer", "salon", "influencer"]
public/control-center/pages/ai-command.js:2394:	"sales-crm": "sales_crm",
public/control-center/pages/ai-command.js:2395:	sales_crm: "sales_crm"
public/control-center/pages/ai-command.js:2521:		confirmationNote: firstAiInboundText(preview.confirmationNote, preview.confirmation_note, "Execution, approvals, publishing, CRM updates, customer replies, and workflow runs require explicit confirmation in the owning workspace."),
public/control-center/pages/ai-command.js:2591:	)) || `Review this ${sourceLabel} handoff for ${projectLabel}. Identify the right specialist, summarize the context, produce a review-ready draft, and recommend the next safe route. Do not execute publishing, task creation, CRM updates, customer replies, workflow runs, or backend actions.`;
public/control-center/pages/ai-command.js:2631:		note: "Guidance only. No publishing, task creation, CRM updates, customer replies, workflow runs, exports, or backend actions are executed from this handoff."
public/control-center/pages/ai-command.js:2750:	session.messages.push({
public/control-center/pages/ai-command.js:2759:	session.messages.push({
public/control-center/pages/ai-command.js:3109:function renderMessageStream(messages, escapeHtml) {
public/control-center/pages/ai-command.js:3110:	if (!messages.length) {
public/control-center/pages/ai-command.js:3114:				<div class="ctrl-empty-title">Start the conversation</div>
public/control-center/pages/ai-command.js:3120:	return messages.map((message) => {
public/control-center/pages/ai-command.js:3152:				<h3 style="margin:0;font-size:14px;font-weight:600;color:var(--color-text-0);">Conversation &amp; results</h3>
public/control-center/pages/ai-command.js:3153:				<span style="font-size:11px;color:var(--color-text-2);">${session.messages.length} message${session.messages.length !== 1 ? "s" : ""}</span>
public/control-center/pages/ai-command.js:3156:				${renderMessageStream(session.messages, escapeHtml)}
public/control-center/pages/ai-command.js:3212:	const artifacts = session.messages
public/control-center/pages/ai-command.js:3276:	return asArray(session.messages).slice().reverse().find((item) => item.role === "user") || null;
public/control-center/pages/ai-command.js:3280:	return asArray(session.messages).slice().reverse().find((item) => item.role === "assistant") || null;
public/control-center/pages/ai-command.js:3283:function buildConversationWorkContext(session, fallbackPrompt = "") {
public/control-center/pages/ai-command.js:3284:        const messages = asArray(session.messages).slice(-12);
public/control-center/pages/ai-command.js:3292:        const conversationLines = messages
public/control-center/pages/ai-command.js:3320:                conversationLines.length ? `Conversation context:\n${conversationLines.join("\n")}` : ""
public/control-center/pages/ai-command.js:3326:                conversationText: conversationLines.join("\n"),
public/control-center/pages/ai-command.js:3335:function buildConversationWorkPrompt(session, outputType, fallbackPrompt = "") {
public/control-center/pages/ai-command.js:3336:        const context = buildConversationWorkContext(session, fallbackPrompt);
public/control-center/pages/ai-command.js:3347:                `Convert this AI Team conversation into a ${typeLabel}.`,
public/control-center/pages/ai-command.js:3349:                "Use the conversation context, not only the composer text.",
public/control-center/pages/ai-command.js:3356:function setPreviewFromConversation({ session, intent, fallbackPrompt, projectName }) {
public/control-center/pages/ai-command.js:3357:        const workPrompt = buildConversationWorkPrompt(session, intent, fallbackPrompt);
public/control-center/pages/ai-command.js:3365:        const context = buildConversationWorkContext(session, fallbackPrompt);
public/control-center/pages/ai-command.js:3367:        preview.conversationContext = context.conversationText;
public/control-center/pages/ai-command.js:3369:        // Keep raw conversation context available internally, but do not show it as the main output.
public/control-center/pages/ai-command.js:3377:        preview.safetyLabel = preview.safetyLabel || "Conversation converted into a review-ready draft. No backend action executed.";
public/control-center/pages/ai-command.js:3743:		const lanes = ["Strategy", "Content", "Media", "Customer Ops", "Sales / CRM", "Compliance", "Publishing", "Operations"];
public/control-center/pages/ai-command.js:3803:function renderAiRoomConversationHeader(session, bridgeStatus, escapeHtml) {
public/control-center/pages/ai-command.js:3809:		? "Team orchestration across strategy, writing, media/video, compliance, publishing, customer operations, sales/CRM, and operations"
public/control-center/pages/ai-command.js:3815:		<div class="aicmd-room-conversation-head" data-role="${escapeHtml(isTeam ? "team" : getAiRoomRoleId(spec.id))}">
public/control-center/pages/ai-command.js:3818:				<span class="aicmd-room-kicker">Conversation Room</span>
public/control-center/pages/ai-command.js:3952:			<span class="aicmd-v2-lang-chip" title="Input language">🎤 ${escapeHtml(languagePlan.conversationLanguage)}</span>
public/control-center/pages/ai-command.js:4160:                                        <p>${hasPreview ? "Review the result, then route draft context to the next workspace." : "Create a preview from the conversation before routing work to another workspace."}</p>
public/control-center/pages/ai-command.js:4225:                                        <span>Choose Draft, Task Preview, Workflow Preview, or Handoff Preview, then create a review-ready preview from the conversation.</span>
public/control-center/pages/ai-command.js:4236:                                <div class="aicmd-room-planned-note">This is a review-ready preview. Execution, publishing, approvals, CRM updates, external sends, durable task creation, and workflow runs happen only in the owning destination workspace after confirmation.</div>
public/control-center/pages/ai-command.js:4238:                                <div class="aicmd-room-planned-note">No routed preview yet. Create a Draft, Task Preview, Workflow Preview, or Handoff Preview from the conversation first.</div>
public/control-center/pages/ai-command.js:4291:function renderPhase3SpecialistConversation(session, bridgeStatus, escapeHtml) {
public/control-center/pages/ai-command.js:4299:        const allMessages = asArray(session.messages);
public/control-center/pages/ai-command.js:4300:        const selectedMessages = allMessages.filter((message) => {
public/control-center/pages/ai-command.js:4326:                ? "Chat only. No workflow run, durable task, external handoff action, approval, publishing action, CRM update, or customer action was created."
public/control-center/pages/ai-command.js:4329:                ? `Start a focused conversation with ${selectedLabel}.`
public/control-center/pages/ai-command.js:4373:        const fallbackSelectedResponses = !selectedMessages.length && selectedResponses.length
public/control-center/pages/ai-command.js:4392:        const conversationMessages = selectedMessages.length ? selectedMessages : fallbackSelectedResponses;
public/control-center/pages/ai-command.js:4398:                                        <h3 class="aicmd-v2-chat-title">Conversation</h3>
public/control-center/pages/ai-command.js:4447:                        ${conversationMessages.length ? `
public/control-center/pages/ai-command.js:4449:                                        ${conversationMessages.map(renderMessage).join("")}
public/control-center/pages/ai-command.js:4453:                                        <strong>No conversation with ${escapeHtml(selectedLabel)} yet</strong>
public/control-center/pages/ai-command.js:4542:		{ label: "Conversation language", value: languagePlan.conversationLanguage, present: true },
public/control-center/pages/ai-command.js:4554:			{ label: "Open conversations", value: "Snapshot / requires runtime surface", present: false, scoped: true },
public/control-center/pages/ai-command.js:4560:		: session.teamMode === "solo" && session.modeId === "sales_crm"
public/control-center/pages/ai-command.js:4563:				{ label: "CRM", value: "Profile context", present: true, scoped: true },
public/control-center/pages/ai-command.js:4696:           if (asArray(savedOutput.messages).length && !asArray(session.messages).length) {
public/control-center/pages/ai-command.js:4697:                   session.messages = asArray(savedOutput.messages).slice(-40);
public/control-center/pages/ai-command.js:4757:		// Final Room v1 renders the conversation, composer, output workspace, and tools directly.
public/control-center/pages/ai-command.js:4768:												${renderAiRoomConversationHeader(session, bridgeStatus, escapeHtml)}
public/control-center/pages/ai-command.js:4769:												<div class="aicmd-room-specialist-conversation">
public/control-center/pages/ai-command.js:4770:													${renderPhase3SpecialistConversation(session, bridgeStatus, escapeHtml)}
public/control-center/pages/ai-command.js:4837:		                        messages: session.messages,
public/control-center/pages/ai-command.js:4862:		                session.messages = [];
public/control-center/pages/ai-command.js:4873:		                        messages: [],
public/control-center/pages/ai-command.js:5080:		                session.messages.push(userChatMessage);
public/control-center/pages/ai-command.js:5081:		                session.messages = session.messages.slice(-40);
public/control-center/pages/ai-command.js:5088:		                        messages: session.messages,
public/control-center/pages/ai-command.js:5105:		                                messages: session.messages.slice(-12),
public/control-center/pages/ai-command.js:5106:		                                language: languagePlan.conversationLanguage === "Auto" ? "Auto - follow the latest user message language" : languagePlan.conversationLanguage,
public/control-center/pages/ai-command.js:5116:		                                safetyInstruction: "Chat only. No task/workflow/handoff/approval/publish/customer/CRM execution.",
public/control-center/pages/ai-command.js:5155:		                        session.messages.push(assistantChatMessage);
public/control-center/pages/ai-command.js:5156:		                        session.messages = session.messages.slice(-40);
public/control-center/pages/ai-command.js:5192:		                                messages: session.messages,
public/control-center/pages/ai-command.js:5209:		                                messages: session.messages,
public/control-center/pages/ai-command.js:5222:                // Phase 1: stages draft locally from conversation context. No backend execution.
public/control-center/pages/ai-command.js:5227:                                const preview = setPreviewFromConversation({
public/control-center/pages/ai-command.js:5234:                                persistSessionDraft(sessionKey, session, "Guidance preview prepared from conversation");
public/control-center/pages/ai-command.js:5236:                                updateStatus("Guidance preview prepared from conversation context.");
public/control-center/pages/ai-command.js:5237:                                showMessage?.(`${specLabel} guidance preview prepared from conversation.`);
public/control-center/pages/ai-command.js:5243:                // Phase 1: converts the current conversation into a task preview. No backend execution.
public/control-center/pages/ai-command.js:5252:                                const preview = setPreviewFromConversation({
public/control-center/pages/ai-command.js:5259:                                persistSessionDraft(sessionKey, session, "Task preview prepared from conversation");
public/control-center/pages/ai-command.js:5260:                                updateStatus("Task draft preview prepared from conversation context. Review before creating durable tasks.");
public/control-center/pages/ai-command.js:5261:                                showMessage?.("Task draft preview prepared from conversation.");
public/control-center/pages/ai-command.js:5275:                                const preview = setPreviewFromConversation({
public/control-center/pages/ai-command.js:5282:                                persistSessionDraft(sessionKey, session, "Workflow preview prepared from conversation");
public/control-center/pages/ai-command.js:5283:                                updateStatus("Workflow draft preview prepared from conversation context. No workflow run started.");
public/control-center/pages/ai-command.js:5284:                                showMessage?.("Workflow draft preview prepared from conversation.");
public/control-center/pages/ai-command.js:5290:                // Phase 1: converts the current conversation into a handoff preview. No backend write.
public/control-center/pages/ai-command.js:5299:                                const preview = setPreviewFromConversation({
public/control-center/pages/ai-command.js:5306:                                persistSessionDraft(sessionKey, session, "Handoff preview prepared from conversation");
public/control-center/pages/ai-command.js:5307:                                updateStatus("Handoff preview prepared from conversation context. Review destination before sending.");
public/control-center/pages/ai-command.js:5308:                                showMessage?.("Handoff preview prepared from conversation.");
public/control-center/pages/ai-command.js:5441:		                const preview = setPreviewFromConversation({
public/control-center/pages/ai-command.js:5456:		                        messages: session.messages,
public/control-center/pages/ai-command.js:5462:		                updateStatus("Conversation converted into a draft preview.");
public/control-center/pages/ai-command.js:5463:		                showMessage?.("Draft preview ready from conversation.");
public/control-center/pages/home.js:1009:              <span class="section-helper">Status and handoff only. No live CRM/IVR claims.</span>
public/control-center/pages/integrations/builders.js:44:      label: "Email / CRM",
public/control-center/pages/integrations/builders.js:45:      ids: ["smtp", "mailer", "mailchimp", "crm"]
public/control-center/pages/integrations/builders.js:192:    label: "Communication / CRM",
public/control-center/pages/integrations/builders.js:193:    description: "Email, CRM, and operational messaging connectors that keep lifecycle and team coordination intact.",
public/control-center/pages/integrations/builders.js:194:    connectorIds: ["smtp", "mailer", "mailchimp", "crm", "telegram", "slack", "notion", "zapier-make", "google-drive", "webhook"]
public/control-center/pages/integrations/builders.js:481:      id: "email-crm",
public/control-center/pages/integrations/builders.js:482:      title: "Email & CRM",
public/control-center/pages/integrations/builders.js:484:      domains: [byId.get("email-crm")].filter(Boolean)
public/control-center/pages/integrations.js:37:const UNSUPPORTED_INTEGRATION_IDS = new Set(["amazon", "smtp", "mailer", "crm"]);
public/control-center/pages/integrations.js:344:    id: "email-crm",
public/control-center/pages/integrations.js:345:    title: "Email & CRM",
public/control-center/pages/integrations.js:357:        enables: "Campaign sending, lifecycle messages, and email workflow execution.",
public/control-center/pages/integrations.js:405:        id: "crm",
public/control-center/pages/integrations.js:409:        label: "CRM Integration",
public/control-center/pages/integrations.js:412:        whyItMatters: "CRM data helps the system connect campaigns to pipeline, customers, and repeat purchase behavior.",
public/control-center/pages/integrations.js:415:        permissionScope: "CRM account ID + API token",
public/control-center/pages/integrations.js:418:          { key: "workspaceId", label: "Workspace / account ID", placeholder: "CRM workspace ID", required: true },
public/control-center/pages/integrations.js:419:          { key: "apiKey", label: "API key", placeholder: "CRM API key", type: "password" },
public/control-center/pages/integrations.js:1040:  if (integration.domainId === "email-crm") {
public/control-center/pages/setup.js:96:  audience_primary: "Defines the main customer group the system should optimize messages for.",
public/control-center/pages/workflows.js:1337:    `Confirm workflow review package preparation\n\nAction: Prepare and record backend workflow output for "${title}".\n\nThis may call the backend workflow run endpoint and update workflow run history. It prepares a review output only and does not publish, send messages, create CRM records, bypass Governance, or perform destructive actions.\n\nSelect Cancel to keep the workflow unchanged.`

## AI Command customer/service role evidence
public/control-center/pages/ai-command.js:98:                id: "customer_ops",
public/control-center/pages/ai-command.js:99:                label: "Customer Operations Lead",
public/control-center/pages/ai-command.js:101:                summary: "Inbox review, reply drafts, ticket drafts, SLA risk, and escalation routing.",
public/control-center/pages/ai-command.js:105:                id: "sales_crm",
public/control-center/pages/ai-command.js:106:                label: "Sales / CRM Lead",
public/control-center/pages/ai-command.js:108:                summary: "Lead qualification, outreach drafts, follow-up cadence, and CRM handoff notes.",
public/control-center/pages/ai-command.js:126:	customer_operations: "customer_ops",
public/control-center/pages/ai-command.js:127:	customer_ops: "customer_ops",
public/control-center/pages/ai-command.js:128:	support: "customer_ops",
public/control-center/pages/ai-command.js:129:	sales: "sales_crm",
public/control-center/pages/ai-command.js:130:	crm: "sales_crm",
public/control-center/pages/ai-command.js:131:	sales_crm: "sales_crm",
public/control-center/pages/ai-command.js:148:		cannotDo: ["Publish campaigns directly", "Execute workflows automatically", "Approve content", "Set live budgets"],
public/control-center/pages/ai-command.js:159:		placeholder: "Ask the Content Writer to draft captions, hooks, landing copy, or campaign messages…",
public/control-center/pages/ai-command.js:160:		canHelp: ["Draft captions and hooks", "Write email copy", "Create landing page text", "Prepare publisher handoff", "Suggest message variants"],
public/control-center/pages/ai-command.js:161:		cannotDo: ["Publish directly", "Approve risky claims", "Invent unsupported facts", "Run workflows automatically"],
public/control-center/pages/ai-command.js:187:		cannotDo: ["Generate video directly", "Upload footage without review", "Approve without confirmation", "Run media jobs automatically"],
public/control-center/pages/ai-command.js:226:		cannotDo: ["Update SEO settings directly", "Edit live website", "Set analytics configurations", "Publish recommendations automatically"],
public/control-center/pages/ai-command.js:258:		id: "customer_ops",
public/control-center/pages/ai-command.js:259:		label: "Customer Operations Lead",
public/control-center/pages/ai-command.js:260:		position: "Customer Experience Operations Lead",
public/control-center/pages/ai-command.js:262:		summary: "Inbox review, reply drafts, ticket drafts, SLA risk, customer profile context, and escalation routing.",
public/control-center/pages/ai-command.js:263:		placeholder: "Ask the Customer Operations Lead to summarize a customer thread, draft a safe reply, prepare a ticket draft, check SLA risk, or route an escalation for review…",
public/control-center/pages/ai-command.js:264:		canHelp: ["Review inbox context", "Summarize customer threads", "Draft safe replies", "Prepare ticket drafts", "Flag SLA and escalation risk"],
public/control-center/pages/ai-command.js:265:		cannotDo: ["Send customer replies", "Create live tickets", "Change SLA policy", "Escalate without confirmation"],
public/control-center/pages/ai-command.js:267:		safetyNote: "Customer operations outputs are drafts only. Sending replies, ticket creation, and escalations require confirmation in the owning surface.",
public/control-center/pages/ai-command.js:271:		id: "sales_crm",
public/control-center/pages/ai-command.js:272:		label: "Sales / CRM Lead",
public/control-center/pages/ai-command.js:273:		position: "Revenue and CRM Operations Lead",
public/control-center/pages/ai-command.js:275:		summary: "Lead qualification, outreach drafts, follow-up cadence, CRM profile summaries, and sales handoff notes.",
public/control-center/pages/ai-command.js:276:		placeholder: "Ask the Sales / CRM Lead to qualify a lead, draft outreach, plan follow-ups, summarize CRM context, or prepare a sales handoff for review…",
public/control-center/pages/ai-command.js:277:		canHelp: ["Qualify lead context", "Draft outreach", "Plan follow-up sequences", "Summarize CRM profiles", "Prepare sales handoffs"],
public/control-center/pages/ai-command.js:278:		cannotDo: ["Send outreach", "Mutate CRM records", "Advance pipeline stages", "Confirm follow-ups without review"],
public/control-center/pages/ai-command.js:279:		destinations: ["CRM", "Workflows", "Operations Centers"],
public/control-center/pages/ai-command.js:280:		safetyNote: "Sales and CRM outputs are guidance and drafts only. CRM mutations and outreach sends require confirmation in the owning surface.",
public/control-center/pages/ai-command.js:297:		{ label: "Suggest message variants", sub: "Test different angles and tones" }
public/control-center/pages/ai-command.js:341:	customer_ops: [
public/control-center/pages/ai-command.js:342:		{ label: "Summarize customer thread", sub: "Capture issue, tone, and next reply" },
public/control-center/pages/ai-command.js:343:		{ label: "Draft customer reply", sub: "Safe response for review" },
public/control-center/pages/ai-command.js:345:		{ label: "Prepare escalation", sub: "Route support, sales, or operations" }
public/control-center/pages/ai-command.js:347:	sales_crm: [
public/control-center/pages/ai-command.js:349:		{ label: "Draft outreach", sub: "Personalized message for review" },
public/control-center/pages/ai-command.js:360:	{ label: "Review customer and sales impact", sub: "Customer Ops, Sales / CRM, Operations" }
public/control-center/pages/ai-command.js:383:const AI_ROOM_BUSINESS_BRANCH = ["Customer Ops", "Sales / CRM", "Operations"];
public/control-center/pages/ai-command.js:395:	customer_ops: "CO",
public/control-center/pages/ai-command.js:396:	sales_crm: "SC"
public/control-center/pages/ai-command.js:475:		{ id: "claims-check", label: "Claims Check", action: "preview", intent: "guidance", template: "Review marketing claims for {project}. Flag unsupported, high-risk, or evidence-dependent wording." },
public/control-center/pages/ai-command.js:488:	customer_ops: [
public/control-center/pages/ai-command.js:489:		{ id: "review-unified-inbox", label: "Review Unified Inbox", action: "preview", intent: "guidance", template: "Review the Unified Inbox readiness for {project}. Summarize visible customer-operation signals, open gaps, and safe next review steps. Do not claim inbox actions happened." },
public/control-center/pages/ai-command.js:490:		{ id: "summarize-customer-thread", label: "Summarize Customer Thread", action: "preview", intent: "guidance", template: "Summarize this customer thread for {project}. Include customer issue, sentiment, reply goal, missing details, and safe next step." },
public/control-center/pages/ai-command.js:491:		{ id: "draft-customer-reply", label: "Draft Customer Reply", action: "preview", intent: "guidance", template: "Draft a customer reply for {project}. Keep it helpful, calm, review-ready, and do not claim any operational action has been completed." },
public/control-center/pages/ai-command.js:494:		{ id: "prepare-escalation", label: "Prepare Escalation", action: "preview", intent: "handoff", template: "Prepare an escalation draft for {project}. Include reason, customer impact, owner, confirmation needed, and destination team." },
public/control-center/pages/ai-command.js:495:		{ id: "customer-profile-snapshot", label: "Customer Profile Snapshot", action: "preview", intent: "guidance", template: "Prepare a customer profile snapshot for {project}. Include known context, purchase/support signals, missing fields, and safe follow-up questions." },
public/control-center/pages/ai-command.js:496:		{ id: "route-support-sales-ops", label: "Route to Support / Sales / Operations", action: "preview", intent: "handoff", template: "Prepare routing guidance for {project}. Decide whether the customer item belongs with Support, Sales, or Operations, and explain the review gate." }
public/control-center/pages/ai-command.js:498:	sales_crm: [
public/control-center/pages/ai-command.js:499:		{ id: "lead-qualification", label: "Lead Qualification", action: "preview", intent: "guidance", template: "Qualify the lead for {project}. Include fit, intent, urgency, missing CRM fields, and the safest next step." },
public/control-center/pages/ai-command.js:500:		{ id: "outreach-draft", label: "Outreach Draft", action: "preview", intent: "guidance", template: "Draft outreach for {project}. Include subject or opener, personalized message, CTA, and review notes before sending." },
public/control-center/pages/ai-command.js:501:		{ id: "follow-up-sequence", label: "Follow-up Sequence", action: "preview", intent: "workflow", template: "Build a follow-up sequence for {project}. Include timing, message angle, CTA, stop condition, and confirmation requirements." },
public/control-center/pages/ai-command.js:502:		{ id: "crm-profile-summary", label: "CRM Profile Summary", action: "preview", intent: "guidance", template: "Summarize the CRM profile context for {project}. Include fit, history, open questions, and next sales action without mutating CRM data." },
public/control-center/pages/ai-command.js:638:		if (/act as the customer operations lead|act as customer ops/i.test(text)) return "customer_ops";
public/control-center/pages/ai-command.js:639:		if (/act as the sales|act as the crm|sales \/ crm lead/i.test(text)) return "sales_crm";
public/control-center/pages/ai-command.js:674:	if (/publish\s*now|send\s*external|paid\s*ads|final\s*approval/i.test(command)) {
public/control-center/pages/ai-command.js:702:	if (/act as the customer operations lead|act as customer ops/i.test(text)) return "customer_ops";
public/control-center/pages/ai-command.js:703:	if (/act as the sales|act as the crm|sales \/ crm lead/i.test(text)) return "sales_crm";
public/control-center/pages/ai-command.js:854:	const message = asString(error?.message).toLowerCase();
public/control-center/pages/ai-command.js:855:	return message.includes("insights") || message.includes("learning") || message.includes("not found");
public/control-center/pages/ai-command.js:876:	const conversationLanguage = asString(
public/control-center/pages/ai-command.js:877:		overview.conversation_language ||
public/control-center/pages/ai-command.js:884:		conversationLanguage,
public/control-center/pages/ai-command.js:952:			messages: [],
public/control-center/pages/ai-command.js:1043:	session.draftStatus = hint || `Saved locally ${formatTime(saved.updatedAt)}`;
public/control-center/pages/ai-command.js:1120:        const messages = asArray(session.messages);
public/control-center/pages/ai-command.js:1122:        const hasContent = messages.length || responses.length || asObject(session.outputPreview).title;
public/control-center/pages/ai-command.js:1128:        const firstUser = messages.find((message) => asString(message.role) === "user");
public/control-center/pages/ai-command.js:1136:                messages: messages.slice(-40),
public/control-center/pages/ai-command.js:1159:        session.messages = asArray(record.messages).slice(-40);
public/control-center/pages/ai-command.js:1192:			"When the request touches inbox, tickets, leads, outreach, or CRM, include Customer Ops -> Sales/CRM -> Operations.",
public/control-center/pages/ai-command.js:1201:		`User conversation language: ${safeLanguage}`,
public/control-center/pages/ai-command.js:1205:                "If the user writes Arabic, reply in Arabic. If the user writes English, reply in English. If the user writes German, reply in German.",
public/control-center/pages/ai-command.js:1206:                `Use ${safeOutputLanguage} only for customer-facing or publishable copy such as captions, ads, emails, landing pages, final campaign text, or publishing packages.`,
public/control-center/pages/ai-command.js:1271:	if (id === "customer_ops") return outputType === "task" ? "task-center" : "operations-centers";
public/control-center/pages/ai-command.js:1272:	if (id === "sales_crm") return "workflows";
public/control-center/pages/ai-command.js:1304:        const looksContentLike = /\b(content|caption|captions|post|posts|email|blog|article|copy|headline|landing page|script|message|cta|product copy|social post)\b/.test(text);
public/control-center/pages/ai-command.js:1447:				"Use Arabic freely in the conversation; publishable copy should be reviewed in German.",
public/control-center/pages/ai-command.js:1574:	if (specialistId === "customer_ops") {
public/control-center/pages/ai-command.js:1577:			title: outputType === "task" ? "Ticket Draft: Customer operations follow-up" : "Customer Ops Draft: Thread, reply, and routing",
public/control-center/pages/ai-command.js:1578:			summary: "Customer operations draft prepared with safe reply language, ticket notes, SLA review, and escalation guardrails.",
public/control-center/pages/ai-command.js:1579:			mainOutput: "Review the customer context, confirm missing details, then route the draft through the owning support, sales, or operations surface.",
public/control-center/pages/ai-command.js:1580:			replyDraft: [
public/control-center/pages/ai-command.js:1581:				"Thank the customer, acknowledge the issue, and confirm the next reviewed support step.",
public/control-center/pages/ai-command.js:1585:				"Issue summary: customer concern or request captured for review.",
public/control-center/pages/ai-command.js:1587:				"Owner: support, sales, or operations to be confirmed before creation."
public/control-center/pages/ai-command.js:1593:			nextStep: "Review the draft, confirm the destination team, then route through support, sales, or operations.",
public/control-center/pages/ai-command.js:1595:				"Summarize the customer thread",
public/control-center/pages/ai-command.js:1596:				"Draft a safe customer reply",
public/control-center/pages/ai-command.js:1601:			safetyLabel: "No reply sent, ticket created, SLA changed, or escalation triggered."
public/control-center/pages/ai-command.js:1605:	if (specialistId === "sales_crm") {
public/control-center/pages/ai-command.js:1608:			title: outputType === "handoff" ? "Sales Handoff" : "Sales / CRM Draft: Lead and outreach plan",
public/control-center/pages/ai-command.js:1609:			summary: "Sales and CRM draft prepared with lead qualification, outreach direction, follow-up cadence, and pipeline handoff notes.",
public/control-center/pages/ai-command.js:1610:			mainOutput: "Use this as a sales planning draft. Confirm CRM context and owner before sending outreach or changing pipeline status.",
public/control-center/pages/ai-command.js:1623:				"Can I send more details?",
public/control-center/pages/ai-command.js:1627:				"CRM profile and pipeline changes remain outside AI Team.",
public/control-center/pages/ai-command.js:1628:				"Outreach and follow-ups require confirmation before sending."
public/control-center/pages/ai-command.js:1630:			nextStep: "Review the lead fit, confirm owner, then route the handoff to operations or the CRM surface.",
public/control-center/pages/ai-command.js:1635:				"Route sales handoff without mutating CRM data"
public/control-center/pages/ai-command.js:1638:			safetyLabel: "No outreach sent, CRM record changed, follow-up scheduled, or pipeline stage advanced."
public/control-center/pages/ai-command.js:1704:			"Writer, Media Director, and Video Lead turn strategy into message, asset, and production drafts",
public/control-center/pages/ai-command.js:1706:			"Customer Ops and Sales / CRM join when the request touches inbox, tickets, leads, outreach, or CRM"
public/control-center/pages/ai-command.js:1710:			"Writer: draft hooks, captions, messages, email, or outreach copy",
public/control-center/pages/ai-command.js:1714:			"Customer Ops / Sales: add reply, ticket, lead, outreach, or CRM handoff drafts when relevant",
public/control-center/pages/ai-command.js:1719:		confirmationNote: "No task, workflow, outreach, customer reply, CRM update, approval, or publishing action is executed from Full Team mode.",
public/control-center/pages/ai-command.js:1970:		customer_ops: ["customer", "support", "inbox", "ticket", "tickets", "sla", "reply", "thread", "escalation", "complaint", "refund"],
public/control-center/pages/ai-command.js:1971:		sales_crm: ["lead", "leads", "crm", "sales", "outreach", "follow-up", "follow up", "pipeline", "dealer", "salon", "influencer"]
public/control-center/pages/ai-command.js:1978:function classifyIntent(message, selectedModeId) {
public/control-center/pages/ai-command.js:1981:		score: scoreMode(message, mode.id) + (mode.id === selectedModeId ? 0.75 : 0)
public/control-center/pages/ai-command.js:1985:	const query = asString(message).toLowerCase();
public/control-center/pages/ai-command.js:2109:			lowCtr ? `Improve title and SERP message for ${extractTopMessage(lowCtr)}.` : "Connect Search Console to unlock CTR analysis.",
public/control-center/pages/ai-command.js:2194:function buildOperationsTaskBlock(aiContext, message) {
public/control-center/pages/ai-command.js:2195:	const query = asString(message).toLowerCase();
public/control-center/pages/ai-command.js:2211:function buildOperationsResponse(aiContext, message) {
public/control-center/pages/ai-command.js:2212:	const query = asString(message).toLowerCase();
public/control-center/pages/ai-command.js:2213:	const taskBlock = buildOperationsTaskBlock(aiContext, message);
public/control-center/pages/ai-command.js:2241:function buildResponseForMode(aiContext, classified, message) {
public/control-center/pages/ai-command.js:2254:			return buildOperationsResponse(aiContext, message);
public/control-center/pages/ai-command.js:2258:				? buildOperationsResponse(aiContext, message)
public/control-center/pages/ai-command.js:2303:					insightsResult.status === "rejected" && !insightsMissing ? insightsResult.reason?.message : "",
public/control-center/pages/ai-command.js:2304:					learningResult.status === "rejected" && !learningMissing ? learningResult.reason?.message : ""
public/control-center/pages/ai-command.js:2317:				session.intelligence = { ...session.intelligence, project: projectName, status: "error", error: error.message || "Failed to load live intelligence", loadingPromise: null };
public/control-center/pages/ai-command.js:2392:	"customer-ops": "customer_ops",
public/control-center/pages/ai-command.js:2393:	customer_ops: "customer_ops",
public/control-center/pages/ai-command.js:2394:	"sales-crm": "sales_crm",
public/control-center/pages/ai-command.js:2395:	sales_crm: "sales_crm"
public/control-center/pages/ai-command.js:2521:		confirmationNote: firstAiInboundText(preview.confirmationNote, preview.confirmation_note, "Execution, approvals, publishing, CRM updates, customer replies, and workflow runs require explicit confirmation in the owning workspace."),
public/control-center/pages/ai-command.js:2585:		payload.message,
public/control-center/pages/ai-command.js:2588:		draftContext.message,
public/control-center/pages/ai-command.js:2591:	)) || `Review this ${sourceLabel} handoff for ${projectLabel}. Identify the right specialist, summarize the context, produce a review-ready draft, and recommend the next safe route. Do not execute publishing, task creation, CRM updates, customer replies, workflow runs, or backend actions.`;
public/control-center/pages/ai-command.js:2631:		note: "Guidance only. No publishing, task creation, CRM updates, customer replies, workflow runs, exports, or backend actions are executed from this handoff."
public/control-center/pages/ai-command.js:2687:			console.warn("Failed to consume AI handoff:", error.message);
public/control-center/pages/ai-command.js:2732:		const failureReason = asString(payload?.error) || asString(payloadResponse?.error) || asString(error?.message) || "AI provider failed to return output.";
public/control-center/pages/ai-command.js:2750:	session.messages.push({
public/control-center/pages/ai-command.js:2759:	session.messages.push({
public/control-center/pages/ai-command.js:2970:					<button id="ctrlSendBtn" class="ctrl-send-btn" type="button">Send prompt to ${escapeHtml(mode.label)}</button>
public/control-center/pages/ai-command.js:2974:				<div class="ctrl-composer-hint">Ctrl / Cmd + Enter to send · Suggested prompts prefill only · Draft stays local until you send to execute</div>
public/control-center/pages/ai-command.js:2990:				<span style="font-size:11px;color:var(--color-text-2);">Prefill only — send prompt for preview</span>
public/control-center/pages/ai-command.js:3109:function renderMessageStream(messages, escapeHtml) {
public/control-center/pages/ai-command.js:3110:	if (!messages.length) {
public/control-center/pages/ai-command.js:3114:				<div class="ctrl-empty-title">Start the conversation</div>
public/control-center/pages/ai-command.js:3120:	return messages.map((message) => {
public/control-center/pages/ai-command.js:3121:		const mode = getModeMeta(message.modeId);
public/control-center/pages/ai-command.js:3122:		if (message.role === "user") {
public/control-center/pages/ai-command.js:3126:						<div class="ctrl-msg-user-text">${escapeHtml(message.content)}</div>
public/control-center/pages/ai-command.js:3127:						<div class="ctrl-msg-meta">${escapeHtml(formatTime(message.createdAt))}</div>
public/control-center/pages/ai-command.js:3136:					<div class="ctrl-msg-ai-agent">${escapeHtml(mode.label)} · ${escapeHtml(formatTime(message.createdAt))}</div>
public/control-center/pages/ai-command.js:3137:					${renderCleanResponse(asObject(message.response), escapeHtml, message.id)}
public/control-center/pages/ai-command.js:3153:				<span style="font-size:11px;color:var(--color-text-2);">${session.messages.length} message${session.messages.length !== 1 ? "s" : ""}</span>
public/control-center/pages/ai-command.js:3156:				${renderMessageStream(session.messages, escapeHtml)}
public/control-center/pages/ai-command.js:3196:					<div class="ctrl-empty-box">Commands you send appear here. Click any to restore and re-run.</div>
public/control-center/pages/ai-command.js:3212:	const artifacts = session.messages
public/control-center/pages/ai-command.js:3276:	return asArray(session.messages).slice().reverse().find((item) => item.role === "user") || null;
public/control-center/pages/ai-command.js:3280:	return asArray(session.messages).slice().reverse().find((item) => item.role === "assistant") || null;
public/control-center/pages/ai-command.js:3284:        const messages = asArray(session.messages).slice(-12);
public/control-center/pages/ai-command.js:3292:        const conversationLines = messages
public/control-center/pages/ai-command.js:3293:                .map((message) => {
public/control-center/pages/ai-command.js:3294:                        const role = asString(message.role || "");
public/control-center/pages/ai-command.js:3297:                                : asString(message.specialistLabel || specialist.label || "Specialist");
public/control-center/pages/ai-command.js:3298:                        const content = asString(message.content || message.text || message.responseText || "").trim();
public/control-center/pages/ai-command.js:3320:                conversationLines.length ? `Conversation context:\n${conversationLines.join("\n")}` : ""
public/control-center/pages/ai-command.js:3326:                conversationText: conversationLines.join("\n"),
public/control-center/pages/ai-command.js:3347:                `Convert this AI Team conversation into a ${typeLabel}.`,
public/control-center/pages/ai-command.js:3349:                "Use the conversation context, not only the composer text.",
public/control-center/pages/ai-command.js:3367:        preview.conversationContext = context.conversationText;
public/control-center/pages/ai-command.js:3369:        // Keep raw conversation context available internally, but do not show it as the main output.
public/control-center/pages/ai-command.js:3595:			<span class="aicmd-room-chain-branch-label">Customer / revenue branch</span>
public/control-center/pages/ai-command.js:3743:		const lanes = ["Strategy", "Content", "Media", "Customer Ops", "Sales / CRM", "Compliance", "Publishing", "Operations"];
public/control-center/pages/ai-command.js:3794:        if (roleId === "operations" || roleId === "customer_ops") return `${label} is preparing your task handoff...`;
public/control-center/pages/ai-command.js:3809:		? "Team orchestration across strategy, writing, media/video, compliance, publishing, customer operations, sales/CRM, and operations"
public/control-center/pages/ai-command.js:3815:		<div class="aicmd-room-conversation-head" data-role="${escapeHtml(isTeam ? "team" : getAiRoomRoleId(spec.id))}">
public/control-center/pages/ai-command.js:3952:			<span class="aicmd-v2-lang-chip" title="Input language">🎤 ${escapeHtml(languagePlan.conversationLanguage)}</span>
public/control-center/pages/ai-command.js:4017:							<span class="aicmd-chatgpt-enter-hint">Enter to send · Shift+Enter newline</span>
public/control-center/pages/ai-command.js:4018:							<button id="aicmdV2AskBtn" class="aicmd-chatgpt-send-btn" type="button" ${isGenerating ? "disabled" : ""} title="Send message">
public/control-center/pages/ai-command.js:4050:					<span>Ask a specialist or send the chat response to preview.</span>
public/control-center/pages/ai-command.js:4160:                                        <p>${hasPreview ? "Review the result, then route draft context to the next workspace." : "Create a preview from the conversation before routing work to another workspace."}</p>
public/control-center/pages/ai-command.js:4195:					<h3>${escapeHtml(!humanizeValue(preview.title, "") || humanizeValue(preview.title, "").toLowerCase() === "chat reply" ? `${outputLabel} result` : humanizeValue(preview.title, "Draft output"))}</h3>
public/control-center/pages/ai-command.js:4225:                                        <span>Choose Draft, Task Preview, Workflow Preview, or Handoff Preview, then create a review-ready preview from the conversation.</span>
public/control-center/pages/ai-command.js:4236:                                <div class="aicmd-room-planned-note">This is a review-ready preview. Execution, publishing, approvals, CRM updates, external sends, durable task creation, and workflow runs happen only in the owning destination workspace after confirmation.</div>
public/control-center/pages/ai-command.js:4238:                                <div class="aicmd-room-planned-note">No routed preview yet. Create a Draft, Task Preview, Workflow Preview, or Handoff Preview from the conversation first.</div>
public/control-center/pages/ai-command.js:4282:				<li><span>Read preview aloud (browser)</span><strong class="${speechSynthAvailable ? "is-available" : "is-planned"}">${speechSynthAvailable ? "Available in this browser" : "Not supported in this browser"}</strong></li>
public/control-center/pages/ai-command.js:4299:        const allMessages = asArray(session.messages);
public/control-center/pages/ai-command.js:4300:        const selectedMessages = allMessages.filter((message) => {
public/control-center/pages/ai-command.js:4301:                const role = asString(message.role || "");
public/control-center/pages/ai-command.js:4302:                const messageRoleId = getAiRoomRoleId(message.specialistId || message.modeId || "");
public/control-center/pages/ai-command.js:4304:                        return isTeam ? message.teamMode === "team" || messageRoleId === "team" : messageRoleId === selectedRoleId;
public/control-center/pages/ai-command.js:4307:                        return isTeam ? messageRoleId === "team" : messageRoleId === selectedRoleId;
public/control-center/pages/ai-command.js:4326:                ? "Chat only. No workflow run, durable task, external handoff action, approval, publishing action, CRM update, or customer action was created."
public/control-center/pages/ai-command.js:4329:                ? `Start a focused conversation with ${selectedLabel}.`
public/control-center/pages/ai-command.js:4354:        const renderMessage = (message) => {
public/control-center/pages/ai-command.js:4355:                const role = asString(message.role || "");
public/control-center/pages/ai-command.js:4357:                const label = isUser ? "You" : asString(message.specialistLabel || selectedLabel || "Specialist");
public/control-center/pages/ai-command.js:4358:                const createdAt = asString(message.createdAt || "");
public/control-center/pages/ai-command.js:4359:                const content = asString(message.content || message.text || message.responseText || "");
public/control-center/pages/ai-command.js:4361:                        <div class="aicmd-room-chat-message ${isUser ? "is-user" : "is-assistant"}">
public/control-center/pages/ai-command.js:4363:                                        <div class="aicmd-room-chat-message-meta">
public/control-center/pages/ai-command.js:4392:        const conversationMessages = selectedMessages.length ? selectedMessages : fallbackSelectedResponses;
public/control-center/pages/ai-command.js:4430:                                        <span>Latest selected reply</span>
public/control-center/pages/ai-command.js:4432:                                        <small>${escapeHtml(latestSelected ? formatTime(latestSelected.generatedAt) : "No reply yet")}</small>
public/control-center/pages/ai-command.js:4447:                        ${conversationMessages.length ? `
public/control-center/pages/ai-command.js:4449:                                        ${conversationMessages.map(renderMessage).join("")}
public/control-center/pages/ai-command.js:4453:                                        <strong>No conversation with ${escapeHtml(selectedLabel)} yet</strong>
public/control-center/pages/ai-command.js:4512:				<span class="aicmd-v2-prompts-hint">Click to prefill the composer — send when ready</span>
public/control-center/pages/ai-command.js:4542:		{ label: "Conversation language", value: languagePlan.conversationLanguage, present: true },
public/control-center/pages/ai-command.js:4552:	const scopedContextItems = session.teamMode === "solo" && session.modeId === "customer_ops"
public/control-center/pages/ai-command.js:4554:			{ label: "Open conversations", value: "Snapshot / requires runtime surface", present: false, scoped: true },
public/control-center/pages/ai-command.js:4560:		: session.teamMode === "solo" && session.modeId === "sales_crm"
public/control-center/pages/ai-command.js:4563:				{ label: "CRM", value: "Profile context", present: true, scoped: true },
public/control-center/pages/ai-command.js:4696:           if (asArray(savedOutput.messages).length && !asArray(session.messages).length) {
public/control-center/pages/ai-command.js:4697:                   session.messages = asArray(savedOutput.messages).slice(-40);
public/control-center/pages/ai-command.js:4757:		// Final Room v1 renders the conversation, composer, output workspace, and tools directly.
public/control-center/pages/ai-command.js:4769:												<div class="aicmd-room-specialist-conversation">
public/control-center/pages/ai-command.js:4818:			persistSessionDraft(sessionKey, session, "Draft saved locally");
public/control-center/pages/ai-command.js:4837:		                        messages: session.messages,
public/control-center/pages/ai-command.js:4862:		                session.messages = [];
public/control-center/pages/ai-command.js:4873:		                        messages: [],
public/control-center/pages/ai-command.js:4949:				persistSessionDraft(sessionKey, session, "Suggested prompt loaded — review and send when ready");
public/control-center/pages/ai-command.js:4984:				persistSessionDraft(sessionKey, session, "Draft auto-saved locally");
public/control-center/pages/ai-command.js:4996:			        const sendBtn = $("aicmdV2AskBtn");
public/control-center/pages/ai-command.js:4997:			        if (sendBtn && !sendBtn.disabled) {
public/control-center/pages/ai-command.js:4998:			                sendBtn.click?.();
public/control-center/pages/ai-command.js:5048:		                        updateStatus("Please write your message in the composer first.");
public/control-center/pages/ai-command.js:5080:		                session.messages.push(userChatMessage);
public/control-center/pages/ai-command.js:5081:		                session.messages = session.messages.slice(-40);
public/control-center/pages/ai-command.js:5088:		                        messages: session.messages,
public/control-center/pages/ai-command.js:5104:		                                message: value,
public/control-center/pages/ai-command.js:5105:		                                messages: session.messages.slice(-12),
public/control-center/pages/ai-command.js:5106:		                                language: languagePlan.conversationLanguage === "Auto" ? "Auto - follow the latest user message language" : languagePlan.conversationLanguage,
public/control-center/pages/ai-command.js:5116:		                                safetyInstruction: "Chat only. No task/workflow/handoff/approval/publish/customer/CRM execution.",
public/control-center/pages/ai-command.js:5155:		                        session.messages.push(assistantChatMessage);
public/control-center/pages/ai-command.js:5156:		                        session.messages = session.messages.slice(-40);
public/control-center/pages/ai-command.js:5162:                                                responseTitle: "Chat reply",
public/control-center/pages/ai-command.js:5173:		                                responseTitle: "Chat reply",
public/control-center/pages/ai-command.js:5192:		                                messages: session.messages,
public/control-center/pages/ai-command.js:5201:		                        updateStatus("Specialist reply generated. No workflow/task/handoff was created.");
public/control-center/pages/ai-command.js:5202:		                        showMessage?.("Specialist reply generated.");
public/control-center/pages/ai-command.js:5205:		                        session.responseError = asString(error?.message || "Failed to generate specialist chat reply.");
public/control-center/pages/ai-command.js:5209:		                                messages: session.messages,
public/control-center/pages/ai-command.js:5222:                // Phase 1: stages draft locally from conversation context. No backend execution.
public/control-center/pages/ai-command.js:5234:                                persistSessionDraft(sessionKey, session, "Guidance preview prepared from conversation");
public/control-center/pages/ai-command.js:5236:                                updateStatus("Guidance preview prepared from conversation context.");
public/control-center/pages/ai-command.js:5237:                                showMessage?.(`${specLabel} guidance preview prepared from conversation.`);
public/control-center/pages/ai-command.js:5243:                // Phase 1: converts the current conversation into a task preview. No backend execution.
public/control-center/pages/ai-command.js:5259:                                persistSessionDraft(sessionKey, session, "Task preview prepared from conversation");
public/control-center/pages/ai-command.js:5260:                                updateStatus("Task draft preview prepared from conversation context. Review before creating durable tasks.");
public/control-center/pages/ai-command.js:5261:                                showMessage?.("Task draft preview prepared from conversation.");
public/control-center/pages/ai-command.js:5282:                                persistSessionDraft(sessionKey, session, "Workflow preview prepared from conversation");
public/control-center/pages/ai-command.js:5283:                                updateStatus("Workflow draft preview prepared from conversation context. No workflow run started.");
public/control-center/pages/ai-command.js:5284:                                showMessage?.("Workflow draft preview prepared from conversation.");
public/control-center/pages/ai-command.js:5290:                // Phase 1: converts the current conversation into a handoff preview. No backend write.
public/control-center/pages/ai-command.js:5306:                                persistSessionDraft(sessionKey, session, "Handoff preview prepared from conversation");
public/control-center/pages/ai-command.js:5307:                                updateStatus("Handoff preview prepared from conversation context. Review destination before sending.");
public/control-center/pages/ai-command.js:5308:                                showMessage?.("Handoff preview prepared from conversation.");
public/control-center/pages/ai-command.js:5358:				persistSessionDraft(sessionKey, session, "Draft saved locally");
public/control-center/pages/ai-command.js:5359:				updateStatus("Composer draft saved locally.");
public/control-center/pages/ai-command.js:5360:				showMessage?.("Composer draft saved locally.");
public/control-center/pages/ai-command.js:5432:				updateStatus(`Response saved locally ${formatTime(saved.updatedAt)}.`);
public/control-center/pages/ai-command.js:5433:				showMessage?.("Response saved locally.");
public/control-center/pages/ai-command.js:5456:		                        messages: session.messages,
public/control-center/pages/ai-command.js:5463:		                showMessage?.("Draft preview ready from conversation.");
public/control-center/pages/ai-command.js:5508:					updateStatus("Read is not supported in this browser.");
public/control-center/pages/ai-command.js:5514:				updateStatus("Reading response locally in browser.");
public/control-center/pages/ai-command.js:5608:				updateStatus(`Preview saved locally ${formatTime(saved.updatedAt)}.`);
public/control-center/pages/ai-command.js:5609:				showMessage?.("Preview saved locally.");
public/control-center/pages/ai-command.js:5619:					updateStatus("Read preview is not supported in this browser.");
public/control-center/pages/ai-command.js:5628:				updateStatus("Reading preview locally in browser.");
public/control-center/pages/ai-command/tool-dock.js:211:  lines.push("Use the selected Library source as context. Do not invent unsupported claims.");
public/control-center/pages/ai-command/tool-dock.js:215:function setDrawerSourceWarning(drawer, message = "") {
public/control-center/pages/ai-command/tool-dock.js:218:  const hasMessage = Boolean(message);
public/control-center/pages/ai-command/tool-dock.js:220:  warning.textContent = message;
public/control-center/pages/ai-command/tool-dock.js:383:      sourceTypes: ["current_chat", "market_notes", "customer_notes", "insights_report", "library_source", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:384:      outputTypes: ["audience_map", "segment_notes", "objection_map", "message_angles"],
public/control-center/pages/ai-command/tool-dock.js:385:      template: "Map the target audience for {projectName}. Include segments, needs, objections, buying triggers, and message angles."
public/control-center/pages/ai-command/tool-dock.js:440:      template: "Use the Content Writer to create a new written output for {projectName}. First ask or infer the output type: company profile, product copy, email, blog article, landing page, contract draft, presentation outline, speech, FAQ, proposal, social post, or ad copy. Ask for sources if needed. Keep it review-ready and do not publish or send anything."
public/control-center/pages/ai-command/tool-dock.js:518:      template: "Prepare SEO support for {projectName}. Ask for topic, market, language, and audience if missing. Create keyword ideas, search intent, meta title/description, blog outline, FAQ ideas, internal link ideas, and content gap notes."
public/control-center/pages/ai-command/tool-dock.js:534:      id: "send",
public/control-center/pages/ai-command/tool-dock.js:800:      sourceTypes: ["audience_notes", "insights_report", "campaign_brief", "customer_notes", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:827:      outputTypes: ["landing_match_review", "message_gap_report", "cta_improvements", "trust_signal_notes"],
public/control-center/pages/ai-command/tool-dock.js:828:      template: "Review ad-to-landing-page message match for {projectName}. Identify gaps, stronger claims, CTA improvements, and trust signals."
public/control-center/pages/ai-command/tool-dock.js:912:      template: "Review claims for {projectName}. Flag unsupported, risky, health/performance, legal, or approval-sensitive statements."
public/control-center/pages/ai-command/tool-dock.js:925:      template: "Rewrite this content in a safer compliant way. Keep the value clear while reducing unsupported or risky claims."
public/control-center/pages/ai-command/tool-dock.js:1036:  customer_ops: [
public/control-center/pages/ai-command/tool-dock.js:1038:      id: "reply-draft",
public/control-center/pages/ai-command/tool-dock.js:1046:      sourceTypes: ["customer_thread", "support_notes", "policy_doc", "faq_source", "current_chat", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:1047:      outputTypes: ["reply_draft", "empathetic_response", "next_step_note", "escalation_note"],
public/control-center/pages/ai-command/tool-dock.js:1048:      template: "Draft a safe customer reply for {projectName}. Do not send it. Include empathy, answer, next step, and escalation note if needed."
public/control-center/pages/ai-command/tool-dock.js:1059:      sourceTypes: ["customer_thread", "support_notes", "order_case_summary", "current_chat", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:1061:      template: "Prepare a ticket draft for {projectName}. Include issue summary, priority, owner, customer impact, and missing information."
public/control-center/pages/ai-command/tool-dock.js:1072:      sourceTypes: ["customer_thread", "sla_policy", "support_notes", "current_chat", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:1074:      template: "Review SLA or response risk for this customer context. Flag urgency, escalation needs, and safe next actions."
public/control-center/pages/ai-command/tool-dock.js:1084:      destinations: ["chat-preview", "operations-centers", "workflows", "sales-crm-draft"],
public/control-center/pages/ai-command/tool-dock.js:1085:      sourceTypes: ["customer_thread", "support_notes", "current_chat", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:1087:      template: "Summarize the customer context for {projectName}. Include issue, sentiment, open questions, risk, and next response."
public/control-center/pages/ai-command/tool-dock.js:1091:  sales_crm: [
public/control-center/pages/ai-command/tool-dock.js:1100:      destinations: ["chat-preview", "workflows", "content-studio", "sales-crm-draft"],
public/control-center/pages/ai-command/tool-dock.js:1103:      template: "Create a sales pitch for {projectName}. Include value proposition, customer pain, proof, offer, CTA, and follow-up note."
public/control-center/pages/ai-command/tool-dock.js:1113:      destinations: ["chat-preview", "content-studio", "workflows", "sales-crm-draft"],
public/control-center/pages/ai-command/tool-dock.js:1135:      badge: "CRM",
public/control-center/pages/ai-command/tool-dock.js:1139:      destinations: ["chat-preview", "workflows", "operations-centers", "sales-crm-draft"],
public/control-center/pages/ai-command/tool-dock.js:1140:      sourceTypes: ["lead_context", "crm_profile_summary", "sales_notes", "customer_notes", "manual_input"],
public/control-center/pages/ai-command/tool-dock.js:1287:          Preparation-only: this drawer creates a composer-ready instruction. It does not publish, send, route, create CRM records, run workflows, or mutate backend data.
public/control-center/pages/ai-command/tool-dock.js:1356:    crm: "CRM",
public/control-center/pages/ai-command/tool-dock.js:1373:    .replace(/\bCrm\b/g, "CRM")
public/control-center/pages/ai-command/tool-dock.js:1491:    "- If the conversation language differs from the publishable output language, keep any short explanation in the conversation language and put only the publishable content in the selected output language.",
public/control-center/pages/ai-command/tool-dock.js:1503:    `Prepare the output for ${destination}, but do not send, save, route, publish, or create records automatically.`,
public/control-center/pages/ai-command/tool-dock.js:1507:    "- Do not publish, send, route, save, overwrite, create CRM records, or run workflows.",
public/control-center/pages/ai-command/tool-dock.js:1508:    "- Do not make unsupported claims. Mark missing proof clearly."

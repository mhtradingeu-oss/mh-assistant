# PHASE 3T.25 — AI Command UX Markers

## Composer-related markers
146:		placeholder: "Ask the Strategist to plan a campaign, map launch phases, review channel priorities, or define the offer strategy…",
159:		placeholder: "Ask the Content Writer to draft captions, hooks, landing copy, or campaign messages…",
172:		placeholder: "Ask the Media Director to define visual direction, prepare a creative brief, or review brand consistency…",
185:		placeholder: "Ask the Video Lead to write a reel script, map short-form strategy, or outline the next video concept…",
198:		placeholder: "Ask the Publisher to review publishing readiness, check scheduling, or prepare a handoff package…",
200:		cannotDo: ["Publish without explicit approval", "Override schedules", "Bypass governance gates", "Send to live channels directly"],
211:		placeholder: "Ask the Ads Optimizer to draft ad copy, review targeting angles, or plan a paid campaign structure…",
224:		placeholder: "Ask the SEO & Insights Analyst to review performance, suggest SEO improvements, or identify top content patterns…",
237:		placeholder: "Ask the Compliance Reviewer to check claims, approval risks, publishing safety, and governance notes…",
250:		placeholder: "Ask the Operations Lead to turn this into tasks, workflow steps, or handoffs…",
263:		placeholder: "Ask the Customer Operations Lead to summarize a customer thread, draft a safe reply, prepare a ticket draft, check SLA risk, or route an escalation for review…",
265:		cannotDo: ["Send customer replies", "Create live tickets", "Change SLA policy", "Escalate without confirmation"],
267:		safetyNote: "Customer operations outputs are drafts only. Sending replies, ticket creation, and escalations require confirmation in the owning surface.",
276:		placeholder: "Ask the Sales / CRM Lead to qualify a lead, draft outreach, plan follow-ups, summarize CRM context, or prepare a sales handoff for review…",
278:		cannotDo: ["Send outreach", "Mutate CRM records", "Advance pipeline stages", "Confirm follow-ups without review"],
366:	{ id: "ask", title: "Ask", description: "Write the request and choose the team lane." },
369:	{ id: "route", title: "Route", description: "Send context to the owning workspace." },
444:		{ id: "open-media-studio", label: "Send to Media Studio", action: "route", route: "media-studio" }
510:// 4 quick-action prompts shown in the composer
648:	const command = humanizeValue(commandText || session?.draftMessage, "Prepare workflow action from AI command.");
800:  // If the composer contains a chain of quick actions, keep only the latest action.
822:function setAiComposerValue(session, input, value) {
824:  session.draftMessage = cleanValue;
825:  session.composerText = cleanValue;
826:  if (input) {
827:    input.value = cleanValue;
828:    input.focus?.();
878:		overview.input_language ||
941:			draftMessage: "",
965:			composerText: "",
1022:		session.draftMessage = asString(localDraft.prompt);
1023:		session.composerText = session.draftMessage;
1037:		prompt: session.draftMessage,
1164:        session.draftMessage = "";
1165:        session.composerText = "";
1450:			nextStep: "Send this package to Content Studio or Publisher after review.",
2048:			routeSuggestion("Setup", "setup", "Close missing project basics, goals, and audience inputs."),
2643:	session.draftMessage = normalized.prompt;
2644:	session.composerText = normalized.prompt;
2778:	session.draftMessage = "";
2894:						data-ctrl-mode="${escapeHtml(agent.id)}"
2922:		<div class="ctrl-composer-card">
2923:			<div class="ctrl-composer-head">
2929:					<button class="ctrl-mode-btn${!isStructured ? " is-active" : ""}" type="button" data-ctrl-task-toggle="free">Free text</button>
2930:					<button class="ctrl-mode-btn${isStructured ? " is-active" : ""}" type="button" data-ctrl-task-toggle="structured">Task builder</button>
2933:			<div class="ctrl-composer-body">
2934:				<textarea
2936:					class="ctrl-composer-textarea"
2938:					placeholder="Ask ${escapeHtml(mode.label)} anything — what to do next, what content is working, which campaign to scale, or where to route the next action…"
2939:				>${escapeHtml(session.draftMessage)}</textarea>
2969:				<div class="ctrl-composer-actions">
2970:					<button id="ctrlSendBtn" class="ctrl-send-btn" type="button">Send to ${escapeHtml(mode.label)}</button>
2974:				<div class="ctrl-composer-hint">Ctrl / Cmd + Enter to send · Suggested prompts prefill only · Draft stays local until you send to execute</div>
2987:		<div class="ctrl-composer-card">
2988:			<div class="ctrl-composer-head">
2992:			<div class="ctrl-composer-body">
2998:							data-ctrl-quick="${escapeHtml(action.action)}"
2999:							data-ctrl-quick-template="${escapeHtml(action.template.replace("{project}", projectLabel))}"
3094:							<button class="ctrl-route-btn" type="button" data-ctrl-route="${index}" data-ctrl-route-owner="${escapeHtml(ownerId || "")}" title="${escapeHtml(item.reason)}">
3115:				<div class="ctrl-empty-body">Choose a specialist above, pick a suggested prompt, or write your own command and hit Send.</div>
3168:		<div class="ctrl-composer-card">
3169:			<div class="ctrl-composer-head">
3173:			<div class="ctrl-composer-body">
3181:								<button class="ctrl-recent-item" type="button" data-ctrl-history="${index}">
3225:		<div class="ctrl-composer-card">
3226:			<div class="ctrl-composer-head">
3230:			<div class="ctrl-composer-body">
3307:                session.draftMessage ||
3349:                "Use the conversation context, not only the composer text.",
3457:  const normalize = (input) =>
3458:    String(input || "")
3510:	if (asString(session.draftMessage).trim()) return 0;
3698:				<button class="aicmd-v2-toggle-btn${session.teamMode !== "team" ? " is-active" : ""}" type="button" data-aicmdv2-team-mode="solo">
3699:					Ask Specialist
3701:				<button class="aicmd-v2-toggle-btn${session.teamMode === "team" ? " is-active" : ""}" type="button" data-aicmdv2-team-mode="team">
3718:							data-aicmdv2-specialist="${escapeHtml(spec.id)}"
3844:	const preferred = destinations.find((item) => !["chat-preview", "composer", "preview", "ai-command"].includes(asString(item)));
3889:					data-aicmdv2-tab="${tab.id}"
3926:							data-aicmdv2-tool="${escapeHtml(tool.id)}"
3963:		{ label: "Voice input", value: "Coming", className: "is-planned" },
3989:		const draftLabel = asString(session.draftMessage).trim() ? "Draft saved" : "Empty draft";
3994:			<div class="aicmd-v2-composer aicmd-room-composer aicmd-chatgpt-composer" data-role="${escapeHtml(roleId)}">
3995:				<div class="aicmd-v2-composer-head aicmd-chatgpt-composer-head">
3996:					<div class="aicmd-v2-composer-title-row">
3997:						<span class="aicmd-v2-composer-icon">${escapeHtml(isTeam ? "Team" : getAiRoomInitials(spec))}</span>
3998:						<span class="aicmd-v2-composer-label">${escapeHtml(headerText)}</span>
4003:				<div class="aicmd-chatgpt-input-shell">
4004:					<textarea
4006:						class="aicmd-v2-textarea aicmd-chatgpt-textarea"
4010:					>${escapeHtml(session.draftMessage)}</textarea>
4014:							<button id="aicmdV2VoiceBtn" class="aicmd-chatgpt-icon-btn" type="button" disabled title="Voice input coming soon">🎙</button>
4018:							<button id="aicmdV2AskBtn" class="aicmd-chatgpt-send-btn" type="button" ${isGenerating ? "disabled" : ""} title="Send message">
4029:				<div id="aicmdV2Status" class="aicmd-v2-composer-hint"></div>
4049:					<span>Ask a specialist or send the chat response to preview.</span>
4062:		? "Send Draft to Content Studio"
4124:				<button id="aicmdV2LegacyPreviewSendBtn" class="aicmd-v2-btn-secondary" type="button">Route Draft</button>
4145:		? "Send Draft to Content Studio"
4170:										data-aicmdv2-output-tab="${escapeHtml(tab.id)}"
4230:                                        <button id="aicmdV2PreviewSendBtn" class="aicmd-v2-btn-primary" type="button">${escapeHtml(routeActionLabel)}</button>
4282:				<li><span>Voice input (microphone)</span><strong class="is-planned">Planned — SpeechRecognition not enabled</strong></li>
4468:                                                <button id="aicmdV3ResponseSendBtn" class="aicmd-v2-btn-secondary" type="button">Route</button>
4511:				<span class="aicmd-v2-prompts-hint">Click to prefill the composer — send when ready</span>
4518:						data-aicmdv2-prompt="${idx}"
4519:						data-aicmdv2-prompt-text="${escapeHtml(p.label)}"
4536:	const sessionState = session.responseLoading ? "Generating" : (session.outputPreview ? "Preview ready" : (asString(session.draftMessage).trim() ? "Drafting" : "Ready"));
4712:		// Once consumed we clear the global input so re-renders are idempotent.
4729:			session.draftMessage = normalizeAiComposerPrompt(bridgeValue);
4756:		// Final Room v1 renders the conversation, composer, output workspace, and tools directly.
4785:		const input = $("aicmdV2Input");
4793:			const value = asString(input?.value || session.draftMessage || fallbackPrompt || "").trim();
4795:				updateStatus("Please write your request in the composer first.");
4796:				input?.focus?.();
4800:			session.draftMessage = value;
4801:			session.composerText = session.draftMessage;
4853:		                session.draftMessage = "";
4854:		                session.composerText = "";
4895:		Array.from(document.querySelectorAll("[data-aicmdv2-output-tab]")).forEach((btn) => {
4897:				const nextTab = asString(btn.getAttribute("data-aicmdv2-output-tab") || "draft").trim();
4906:		Array.from(document.querySelectorAll("[data-aicmdv2-specialist]")).forEach((btn) => {
4908:                                const specId = btn.getAttribute("data-aicmdv2-specialist") || "operations";
4910:                                const existingDraft = asString(session.draftMessage).trim();
4920:                                        session.draftMessage = `Act as the ${spec?.label || titleCase(specId)} for ${projectName}. Review the project context and suggest the next best actions. Do not execute anything; prepare guidance only.`;
4921:                                } else if (!session.draftMessage) {
4922:                                        session.draftMessage = "";
4931:                Array.from(document.querySelectorAll("[data-aicmdv2-team-mode]")).forEach((btn) => {
4933:				const mode = btn.getAttribute("data-aicmdv2-team-mode") || "solo";
4942:		Array.from(document.querySelectorAll("[data-aicmdv2-prompt]")).forEach((btn) => {
4944:				const text = asString(btn.getAttribute("data-aicmdv2-prompt-text") || "");
4946:				session.draftMessage = text;
4947:				if (input) input.value = text;
4949:				updateStatus("Suggested prompt loaded into composer. Review it, then Ask AI Team or Draft.");
4950:				input?.focus?.();
4954:		Array.from(document.querySelectorAll("[data-aicmdv2-quick]")).forEach((btn) => {
4956:				const text = asString(btn.getAttribute("data-aicmdv2-quick-template") || "");
4958:				session.draftMessage = text;
4959:				if (input) input.value = text;
4961:				updateStatus("Quick action loaded into composer. Review it, then ask or preview.");
4962:				input?.focus?.();
4969:                        input,
4979:		if (input) {
4980:			input.oninput = () => {
4981:				session.draftMessage = input.value || "";
4982:				session.composerText = session.draftMessage;
4986:			input.onkeydown = (event) => {
4995:			        const sendBtn = $("aicmdV2AskBtn");
5009:					updateStatus("Voice input trigger is ready. Browser speech recognition is not available in this environment yet.");
5010:					showMessage?.("Voice input readiness is staged for compatible browsers.");
5022:						setAiComposerValue(session, input, transcript);
5023:						if (input) {
5024:							input.value = transcript;
5025:							input.focus();
5027:						persistSessionDraft(sessionKey, session, "Voice input captured");
5028:						updateStatus("Voice input captured in composer.");
5031:						updateStatus("Voice input could not start. Microphone permission may be blocked.");
5034:					updateStatus("Listening for Arabic voice input.");
5036:					updateStatus("Voice input could not start in this browser.");
5042:		const askBtn = $("aicmdV2AskBtn");
5045:		                const value = asString(input?.value || session.draftMessage || "").trim();
5047:		                        updateStatus("Please write your message in the composer first.");
5048:		                        input?.focus?.();
5081:		                session.draftMessage = "";
5082:		                session.composerText = "";
5225:                                const fallback = asString(input?.value || session.draftMessage || "").trim();
5246:                                const value = asString(input?.value || session.draftMessage || "").trim();
5269:                                const value = asString(input?.value || session.draftMessage || "").trim();
5293:                                const value = asString(input?.value || session.draftMessage || "").trim();
5311:		const toolButtons = Array.from(document.querySelectorAll("[data-aicmdv2-tool]"));
5314:				const toolId = asString(btn.getAttribute("data-aicmdv2-tool") || "").trim();
5338:					input,
5356:				session.draftMessage = asString(input?.value || session.draftMessage || "");
5367:				session.draftMessage = "";
5368:				session.composerText = "";
5372:				if (input) input.value = "";
5385:		                input?.focus?.();
5412:				setAiComposerValue(session, input, latestResponse.responseText);
5413:				if (input) {
5414:					input.focus();
5416:				persistSessionDraft(sessionKey, session, "Generated response inserted into composer");
5417:				updateStatus("Response inserted into composer.");
5439:		                const fallback = latestResponse?.prompt || asString(input?.value || session.draftMessage || "");
5467:		const responseSendBtn = $("aicmdV3ResponseSendBtn");
5468:		if (responseSendBtn) {
5469:			responseSendBtn.onclick = () => {
5551:				session.draftMessage = text;
5552:				if (input) {
5553:					input.value = text;
5554:					input.focus();
5556:				persistSessionDraft(sessionKey, session, "Preview inserted into composer");
5557:				updateStatus("Preview inserted into composer for refinement.");
5561:		const previewSendBtn = $("aicmdV2PreviewSendBtn");
5562:		if (previewSendBtn) {
5563:			previewSendBtn.onclick = () => {

## Suggested prompt markers
285:// Role-specific suggested prompt chips (prefill only, no auto-execute)
286:const SPECIALIST_SUGGESTED_PROMPTS = {
355:// Full Team mode suggested prompts
356:const TEAM_SUGGESTED_PROMPTS = [
2984:function renderSuggestedPromptsSection(aiContext, session, escapeHtml) {
3115:				<div class="ctrl-empty-body">Choose a specialist above, pick a suggested prompt, or write your own command and hit Send.</div>
4344:                ? TEAM_SUGGESTED_PROMPTS
4345:                : (SPECIALIST_SUGGESTED_PROMPTS[promptModeId] || SPECIALIST_SUGGESTED_PROMPTS.operations);
4502:function renderPhase1SuggestedPrompts(session, escapeHtml) {
4505:		? TEAM_SUGGESTED_PROMPTS
4506:		: (SPECIALIST_SUGGESTED_PROMPTS[promptModeId] || SPECIALIST_SUGGESTED_PROMPTS.operations);

## Safety/review-only markers
66:                summary: "Publishing readiness, schedule review, and handoff preparation.",
94:                summary: "Tasks, timelines, handoffs, approvals, and execution plans.",
101:                summary: "Inbox review, reply drafts, ticket drafts, SLA risk, and escalation routing.",
108:                summary: "Lead qualification, outreach drafts, follow-up cadence, and CRM handoff notes.",
150:		safetyNote: "All outputs are guidance and draft only. Execution requires explicit confirmation.",
159:		placeholder: "Ask the Content Writer to draft captions, hooks, landing copy, or campaign messages…",
160:		canHelp: ["Draft captions and hooks", "Write email copy", "Create landing page text", "Prepare publisher handoff", "Suggest message variants"],
163:		safetyNote: "Drafts require review before publishing. Cannot approve or publish without confirmation.",
173:		canHelp: ["Write creative briefs", "Advise on visual direction", "Map format requirements", "Review brand alignment", "Prepare media handoffs"],
174:		cannotDo: ["Generate images directly", "Upload assets without review", "Approve without confirmation", "Execute media jobs"],
176:		safetyNote: "Direction and briefs only. Media generation requires backend confirmation and explicit action.",
187:		cannotDo: ["Generate video directly", "Upload footage without review", "Approve without confirmation", "Run media jobs automatically"],
197:		summary: "Publishing readiness, schedule review, and handoff preparation.",
198:		placeholder: "Ask the Publisher to review publishing readiness, check scheduling, or prepare a handoff package…",
199:		canHelp: ["Review publishing readiness", "Check scheduled jobs", "Prepare handoff packages", "Map publishing dependencies", "Flag pre-publish risks"],
211:		placeholder: "Ask the Ads Optimizer to draft ad copy, review targeting angles, or plan a paid campaign structure…",
241:		safetyNote: "Compliance review is advisory. Approvals always require human confirmation before execution.",
249:		summary: "Tasks, timelines, handoffs, approvals, and execution plans.",
250:		placeholder: "Ask the Operations Lead to turn this into tasks, workflow steps, or handoffs…",
251:		canHelp: ["Create task plans", "Map execution sequences", "Prepare workflow handoffs", "Review execution health", "Identify operational blockers"],
252:		cannotDo: ["Run workflows without confirmation", "Auto-approve tasks", "Override authority gates", "Execute backend operations directly"],
254:		safetyNote: "Task plans and handoffs only. Workflow execution requires explicit user confirmation.",
262:		summary: "Inbox review, reply drafts, ticket drafts, SLA risk, customer profile context, and escalation routing.",
263:		placeholder: "Ask the Customer Operations Lead to summarize a customer thread, draft a safe reply, prepare a ticket draft, check SLA risk, or route an escalation for review…",
264:		canHelp: ["Review inbox context", "Summarize customer threads", "Draft safe replies", "Prepare ticket drafts", "Flag SLA and escalation risk"],
265:		cannotDo: ["Send customer replies", "Create live tickets", "Change SLA policy", "Escalate without confirmation"],
267:		safetyNote: "Customer operations outputs are drafts only. Sending replies, ticket creation, and escalations require confirmation in the owning surface.",
275:		summary: "Lead qualification, outreach drafts, follow-up cadence, CRM profile summaries, and sales handoff notes.",
276:		placeholder: "Ask the Sales / CRM Lead to qualify a lead, draft outreach, plan follow-ups, summarize CRM context, or prepare a sales handoff for review…",
277:		canHelp: ["Qualify lead context", "Draft outreach", "Plan follow-up sequences", "Summarize CRM profiles", "Prepare sales handoffs"],
280:		safetyNote: "Sales and CRM outputs are guidance and drafts only. CRM mutations and outreach sends require confirmation in the owning surface.",
296:		{ label: "Prepare a Publisher handoff", sub: "Package ready content for review" },
303:		{ label: "Prepare a media handoff", sub: "Package direction for the team" }
315:		{ label: "Prepare a handoff package", sub: "For the approver review" }
337:		{ label: "Draft a workflow handoff", sub: "Prepare for the next owner" },
351:		{ label: "Prepare sales handoff", sub: "Route context to operations" }
359:	{ label: "Prepare a full handoff sequence", sub: "Strategy, creative, compliance, publishing, ops" },
363:const PHASE35_WORKSPACE_TABS = ["chat", "preview", "tools", "context", "history"];
367:	{ id: "draft", title: "Draft", description: "Generate guidance, copy, task, or handoff material." },
375:	{ id: "draft", label: "Draft", helper: "Latest draft or guidance preview" },
378:	{ id: "handoff", label: "Prepare Handoff", helper: "Destination package" },
428:		{ id: "campaign-angle-generator", label: "Campaign Angle Generator", action: "preview", intent: "guidance", template: "Generate campaign angles for {project}. Include audience tension, promise, channel fit, and strongest first test." },
429:		{ id: "launch-plan", label: "Launch Plan", action: "preview", intent: "workflow", template: "Build a launch plan for {project}. Include phases, channels, owners, blockers, and next move." },
430:		{ id: "funnel-mapping", label: "Funnel Mapping", action: "preview", intent: "guidance", template: "Map the funnel for {project}. Include awareness, consideration, conversion, retention, and handoff points." },
431:		{ id: "prioritize-next-move", label: "Priority Sort", action: "preview", intent: "task", template: "Prioritize the next moves for {project}. Rank by impact, urgency, dependencies, and safest first action." }
434:		{ id: "hook-generator", label: "Hook Generator", action: "preview", intent: "guidance", template: "Write 5 German hook variants for {project}. Keep them concise, testable, and suitable for the Germany market." },
435:		{ id: "caption-builder", label: "Caption Builder", action: "preview", intent: "guidance", template: "Draft German captions for {project}. Include angle, body, CTA, and platform adaptation notes." },
436:		{ id: "cta-refiner", label: "CTA Refiner", action: "preview", intent: "task", template: "Refine CTA options for {project}. Provide German variants for awareness, consideration, and action stages." },
437:		{ id: "publisher-package", label: "Publisher Package", action: "preview", intent: "handoff", template: "Prepare a Publisher handoff for {project}. Include German copy package, CTA, notes, and remaining checks." }
440:		{ id: "creative-brief-builder", label: "Creative Brief Builder", action: "preview", intent: "media", template: "Prepare a creative brief for {project}. Include concept, visual rules, subject, brand constraints, and production notes." },
441:		{ id: "format-mapper", label: "Format Mapper", action: "preview", intent: "guidance", template: "Map required creative formats for {project}. Include platform, aspect ratio, asset type, and usage context." },
442:		{ id: "asset-checklist", label: "Asset Checklist", action: "preview", intent: "task", template: "Create an asset checklist for {project}. List must-have files, missing references, usage context, and priority." },
443:		{ id: "visual-direction", label: "Visual Direction", action: "preview", intent: "guidance", template: "Review visual direction for {project}. Identify mismatches, improvements, and required references." },
447:		{ id: "write-video-hook", label: "Write video hook", action: "preview", intent: "guidance", template: "Write short-form video hooks for {project}. Include 3 opening variants and audience fit." },
448:		{ id: "draft-script", label: "Draft script", action: "preview", intent: "guidance", template: "Draft a short-form video script for {project}. Include hook, body, CTA, and visual cues." },
449:		{ id: "build-storyboard", label: "Build storyboard", action: "preview", intent: "workflow", template: "Build storyboard beats for {project}. Sequence shots and key transitions." },
450:		{ id: "prepare-voiceover", label: "Prepare voiceover", action: "preview", intent: "guidance", template: "Prepare voiceover script options for {project}. Keep clean timing and emphasis notes." },
451:		{ id: "map-video-asset-needs", label: "Map video asset needs", action: "preview", intent: "task", template: "Map video asset needs for {project}. Include format, source, and production owner." }
454:		{ id: "publishing-checklist", label: "Publishing Checklist", action: "preview", intent: "handoff", template: "Build a publishing checklist for {project}. Include German copy, assets, claims checks, and channel readiness." },
455:		{ id: "final-packaging", label: "Final Packaging", action: "preview", intent: "handoff", template: "Prepare a final publishing package for {project}. Include copy, CTA, asset notes, approvals, and destination channel." },
456:		{ id: "channel-formatting", label: "Channel Formatting", action: "preview", intent: "guidance", template: "Format the next output for {project} by channel. Include German copy, limits, CTA, and scheduling notes." },
457:		{ id: "schedule-draft", label: "Schedule Draft", action: "preview", intent: "workflow", template: "Prepare a publishing schedule draft for {project}. Include channel cadence, dependencies, and review gates." },
461:		{ id: "ad-angle-generator", label: "Ad Angle Generator", action: "preview", intent: "guidance", template: "Draft ad angles for {project}. Include audience problem, value promise, German hook direction, and platform fit." },
462:		{ id: "copy-variants", label: "Copy Variants", action: "preview", intent: "guidance", template: "Prepare German ad copy variants for {project}. Include hooks, primary text, CTA, and creative notes." },
463:		{ id: "test-ideas", label: "Test Ideas", action: "preview", intent: "task", template: "Suggest paid test ideas for {project}. Provide hypotheses, segments, creative variables, and measurement notes." },
464:		{ id: "budget-notes", label: "Budget Notes", action: "preview", intent: "guidance", template: "Review budget notes for {project}. Summarize constraints and safe test allocation guidance." },
468:		{ id: "keyword-intent", label: "Keyword Intent", action: "preview", intent: "guidance", template: "Suggest keyword intent opportunities for {project}. Include Germany-market intent, content mapping, and priority." },
469:		{ id: "meta-direction", label: "Meta Direction", action: "preview", intent: "guidance", template: "Prepare meta direction for {project}. Include page angle, title direction, description direction, and CTA intent." },
470:		{ id: "opportunity-summary", label: "Opportunity Summary", action: "preview", intent: "task", template: "Summarize SEO and insight opportunities for {project}. Focus on conversion, traffic quality, and content fit." },
471:		{ id: "analysis-plan", label: "Analysis Plan", action: "preview", intent: "workflow", template: "Draft an analysis plan for {project}. Define questions, datasets, cadence, and owners." },
475:		{ id: "claims-check", label: "Claims Check", action: "preview", intent: "guidance", template: "Review marketing claims for {project}. Flag unsupported, high-risk, or evidence-dependent wording." },
476:		{ id: "approval-flags", label: "Approval Flags", action: "preview", intent: "task", template: "Check approval risks for {project}. List risk, impact, mitigation, and required owner." },
477:		{ id: "safety-checklist", label: "Safety Checklist", action: "preview", intent: "handoff", template: "Prepare a safety checklist for {project}. Include policy checks, evidence required, and approval notes." },
478:		{ id: "publish-readiness", label: "Publish Readiness", action: "preview", intent: "handoff", template: "Review publish readiness for {project}. Confirm what needs human approval before release." },
482:		{ id: "timeline-draft", label: "Timeline Draft", action: "preview", intent: "workflow", template: "Draft an execution timeline for {project}. Include milestones, owners, dependencies, and review gates." },
483:		{ id: "handoff-routing", label: "Handoff Routing", action: "preview", intent: "handoff", template: "Prepare handoff routing for {project}. Include source, destination, decision gates, and required confirmations." },
484:		{ id: "checklist", label: "Checklist", action: "preview", intent: "task", template: "Draft an operational checklist for {project}. Include owners, dependencies, priority, and first action." },
485:		{ id: "blocker-review", label: "Blocker Review", action: "preview", intent: "guidance", template: "Review operational blockers for {project}. Prioritize by risk and impact." },
489:		{ id: "review-unified-inbox", label: "Review Unified Inbox", action: "preview", intent: "guidance", template: "Review the Unified Inbox readiness for {project}. Summarize visible customer-operation signals, open gaps, and safe next review steps. Do not claim inbox actions happened." },
490:		{ id: "summarize-customer-thread", label: "Summarize Customer Thread", action: "preview", intent: "guidance", template: "Summarize this customer thread for {project}. Include customer issue, sentiment, reply goal, missing details, and safe next step." },
491:		{ id: "draft-customer-reply", label: "Draft Customer Reply", action: "preview", intent: "guidance", template: "Draft a customer reply for {project}. Keep it helpful, calm, review-ready, and do not claim any operational action has been completed." },
492:		{ id: "create-ticket-draft", label: "Create Ticket Draft", action: "preview", intent: "task", template: "Create a ticket draft for {project}. Include issue, priority, owner suggestion, evidence needed, and next safe action." },
493:		{ id: "check-sla-risk", label: "Check SLA Risk", action: "preview", intent: "guidance", template: "Check SLA risk for {project}. Flag urgency, risk level, missing runtime data, and escalation recommendation for review." },
494:		{ id: "prepare-escalation", label: "Prepare Escalation", action: "preview", intent: "handoff", template: "Prepare an escalation draft for {project}. Include reason, customer impact, owner, confirmation needed, and destination team." },
495:		{ id: "customer-profile-snapshot", label: "Customer Profile Snapshot", action: "preview", intent: "guidance", template: "Prepare a customer profile snapshot for {project}. Include known context, purchase/support signals, missing fields, and safe follow-up questions." },
496:		{ id: "route-support-sales-ops", label: "Route to Support / Sales / Operations", action: "preview", intent: "handoff", template: "Prepare routing guidance for {project}. Decide whether the customer item belongs with Support, Sales, or Operations, and explain the review gate." }
499:		{ id: "lead-qualification", label: "Lead Qualification", action: "preview", intent: "guidance", template: "Qualify the lead for {project}. Include fit, intent, urgency, missing CRM fields, and the safest next step." },
500:		{ id: "outreach-draft", label: "Outreach Draft", action: "preview", intent: "guidance", template: "Draft outreach for {project}. Include subject or opener, personalized message, CTA, and review notes before sending." },
501:		{ id: "follow-up-sequence", label: "Follow-up Sequence", action: "preview", intent: "workflow", template: "Build a follow-up sequence for {project}. Include timing, message angle, CTA, stop condition, and confirmation requirements." },
502:		{ id: "crm-profile-summary", label: "CRM Profile Summary", action: "preview", intent: "guidance", template: "Summarize the CRM profile context for {project}. Include fit, history, open questions, and next sales action without mutating CRM data." },
503:		{ id: "pipeline-next-step", label: "Pipeline Next Step", action: "preview", intent: "task", template: "Recommend the pipeline next step for {project}. Include stage, rationale, owner, risk, and required confirmation." },
504:		{ id: "dealer-salon-outreach", label: "Dealer / Salon Outreach", action: "preview", intent: "guidance", template: "Draft dealer or salon outreach for {project}. Include positioning, proof needs, offer angle, CTA, and follow-up note." },
505:		{ id: "influencer-lead-plan", label: "Influencer Lead Plan", action: "preview", intent: "workflow", template: "Prepare an influencer lead plan for {project}. Include target profile, outreach angle, qualification criteria, and handoff path." },
506:		{ id: "sales-handoff-draft", label: "Sales Handoff", action: "preview", intent: "handoff", template: "Prepare a sales handoff draft for {project}. Include lead context, recommended next action, owner, and confirmation needed." }
518:const AI_COMMAND_LOCAL_DRAFTS_KEY = "mh-ai-command-local-drafts-v1";
601:		purpose: "Translate intent into executable workflows and handoffs.",
648:	const command = humanizeValue(commandText || session?.draftMessage, "Prepare workflow action from AI command.");
784:    "Prepare a handoff summary for:",
824:  session.draftMessage = cleanValue;
938:			workspaceTab: "preview",
939:			outputWorkspaceTab: "draft",
941:			draftMessage: "",
945:			draftStatus: "",
970:			activeOutputTab: "draft",
1006:function saveLocalDraft(projectName, draftPayload) {
1011:		...asObject(draftPayload),
1022:		session.draftMessage = asString(localDraft.prompt);
1023:		session.composerText = session.draftMessage;
1030:		session.draftStatus = `Draft restored ${formatTime(localDraft.updatedAt)}`;
1037:		prompt: session.draftMessage,
1043:	session.draftStatus = hint || `Saved locally ${formatTime(saved.updatedAt)}`;
1138:                preview: session.outputPreview || null,
1161:        session.outputPreview = asObject(record.preview);
1164:        session.draftMessage = "";
1210:		`When drafting publishable copy, write it in ${safeOutputLanguage}.`,
1297:                                : activeTab === "handoff"
1298:                                        ? "handoff"
1302:        const looksTaskLike = /\b(task|tasks|handoff|ticket|tickets|follow-up|follow up|owner|owners|assignee|assigned|due date|priority|priorities|backlog|checklist|next task|action item|action items)\b/.test(text);
1311:        if (outputType === "handoff" || outputType === "task" || looksTaskLike) {
1321:        if (/content|copy|draft|caption|email|blog|article|script/.test(outputType) || looksContentLike) {
1391:		confirmationRequired: outputType === "handoff" || specialistId === "publisher" || specialistId === "compliance_reviewer",
1394:		status: "draft_preview",
1395:		safetyLabel: "Guidance and draft only. No backend execution.",
1397:		confirmationNote: "Execution, approvals, and publishing require explicit confirmation in the owning workspace."
1405:				summary: "Strategic task draft prepared with priorities, blockers, and operating sequence.",
1410:					"Route execution draft to Campaign Studio or Workflows"
1412:				nextSafeAction: "Review and refine the task draft before creating durable tasks"
1422:				"Next operating move drafted with destination routing"
1430:			title: outputType === "task" ? "Task: Draft campaign copy" : "Content Guidance: Messaging draft",
1431:			summary: "Content draft prepared with hooks, captions, CTA flow, and review checkpoint.",
1434:				"Outcome-led hook direction for a German publishing draft",
1465:			title: "Media Brief: Visual direction draft",
1485:			summary: "Video draft prepared with hook, script structure, and storyboard flow.",
1499:			title: outputType === "handoff" ? "Handoff Preview: Publishing package" : "Publishing Draft: Readiness checklist",
1500:			summary: "Publishing checklist and schedule draft prepared.",
1509:				"Prepare handoff for publishing review"
1511:			confirmationRequired: true,
1512:			safetyLabel: "Confirmation required before publish. No publish action performed."
1520:			summary: "Ad angle and audience testing draft prepared for review.",
1536:				"Primary ad angle draft",
1569:			confirmationRequired: true,
1578:			summary: "Customer operations draft prepared with safe reply language, ticket notes, SLA review, and escalation guardrails.",
1579:			mainOutput: "Review the customer context, confirm missing details, then route the draft through the owning support, sales, or operations surface.",
1586:				"Priority: draft priority pending runtime inbox and SLA confirmation.",
1590:				"Unified Inbox is not duplicated here; this is a draft and routing preview only.",
1591:				"SLA and escalation decisions require confirmation in the owning operations surface."
1593:			nextStep: "Review the draft, confirm the destination team, then route through support, sales, or operations.",
1597:				"Create ticket draft fields for review",
1600:			confirmationRequired: true,
1608:			title: outputType === "handoff" ? "Sales Handoff" : "Sales / CRM Draft: Lead and outreach plan",
1609:			summary: "Sales and CRM draft prepared with lead qualification, outreach direction, follow-up cadence, and pipeline handoff notes.",
1610:			mainOutput: "Use this as a sales planning draft. Confirm CRM context and owner before sending outreach or changing pipeline status.",
1628:				"Outreach and follow-ups require confirmation before sending."
1630:			nextStep: "Review the lead fit, confirm owner, then route the handoff to operations or the CRM surface.",
1635:				"Route sales handoff without mutating CRM data"
1637:			confirmationRequired: true,
1647:				summary: "Workflow draft prepared with stage owners and checkpoints.",
1650:					"Stage 2: Specialist draft production",
1652:					"Stage 4: Destination handoff and confirmation"
1654:				safetyLabel: "Workflow run is not started. This is a draft preview only."
1659:			title: outputType === "handoff" ? "Handoff Preview: Operations package" : "Operations Draft: Task and handoff plan",
1660:			summary: "Operational plan drafted with next tasks, owners, and route.",
1664:				"Prepare destination handoff context",
1667:			safetyLabel: "No workflow run and no backend task creation executed."
1684:		handoff: "handoff"
1701:		summary: `Full team ${outputType.replace("_", " ")} preview prepared for ${projectName || "current project"}.`,
1704:			"Writer, Media Director, and Video Lead turn strategy into message, asset, and production drafts",
1710:			"Writer: draft hooks, captions, messages, email, or outreach copy",
1711:			"Media / Video: prepare creative direction, asset needs, script, storyboard, or voiceover draft",
1714:			"Customer Ops / Sales: add reply, ticket, lead, outreach, or CRM handoff drafts when relevant",
1715:			"Operations: convert the reviewed output into safe tasks, workflow draft, or handoff context"
1718:		nextSafeAction: "Review the team draft, confirm owners, then route draft context to the destination workspace",
1719:		confirmationNote: "No task, workflow, outreach, customer reply, CRM update, approval, or publishing action is executed from Full Team mode.",
1720:		safetyLabel: "Full Team output is a coordinated draft preview only."
1729:		handoff: "Handoff Preview",
1740:		`Status: ${humanizeValue(output.status, "draft_preview")}`,
1754:	lines.push(`Confirmation: ${output.confirmationRequired ? "Required before execution" : "Required for execution actions"}`);
1790:function buildStructuredPreviewBlocks(preview = {}) {
1791:        const summary = humanizeValue(preview.summary, "");
1793:                preview.mainOutput ||
1794:                preview.output ||
1795:                preview.generatedOutput ||
1796:                preview.result ||
1811:        const bullets = normalizeUniqueDisplayList(preview.bullets, 8)
1818:        const steps = normalizeUniqueDisplayList(preview.steps, 8)
1823:        } else if (preview.nextStep) {
1824:                blocks.push({ label: "Next step", items: [compactPreviewText(preview.nextStep, 280)] });
1829:                draftText: "",
1969:		operations: ["task plan", "workflow", "handoff", "approval", "timeline", "execution plan", "route", "publish", "status", "priority", "priorities", "blocking", "blocker", "readiness", "next", "do next"],
2083:			routeSuggestion("Content Studio", "content-studio", "Rewrite weak posts and turn winning patterns into new drafts."),
2498:	const preview = asObject(rawPreview);
2499:	if (!Object.keys(preview).length) return null;
2500:	const outputType = asString(preview.outputType || preview.output_type || preview.type || "handoff").trim() || "handoff";
2502:		preview.destinationRoute ||
2503:		preview.destination_route ||
2508:	const specialistId = normalizeAiInboundSpecialistId(preview.specialistId || preview.specialist_id || normalized.suggestedSpecialist, normalized.suggestedSpecialist);
2511:		...preview,
2513:		title: firstAiInboundText(preview.title, normalized.title, `Inbound handoff from ${normalized.sourceLabel}`),
2514:		summary: firstAiInboundText(preview.summary, preview.description, normalized.prompt),
2517:		generatedAt: asString(preview.generatedAt || preview.generated_at || nowIso()),
2518:		sourcePrompt: firstAiInboundText(preview.sourcePrompt, preview.source_prompt, normalized.prompt),
2519:		status: asString(preview.status || "draft_preview"),
2520:		safetyLabel: firstAiInboundText(preview.safetyLabel, preview.safety_label, "Guidance and draft only. No backend execution."),
2521:		confirmationNote: firstAiInboundText(preview.confirmationNote, preview.confirmation_note, "Execution, approvals, publishing, CRM updates, customer replies, and workflow runs require explicit confirmation in the owning workspace."),
2522:		confirmationRequired: preview.confirmationRequired ?? preview.confirmation_required ?? true
2526:function getAiInboundDurableHandoffId(handoff) {
2527:	const payload = asObject(handoff?.payload);
2529:		handoff?.id,
2530:		handoff?.handoff_id,
2531:		handoff?.handoffId,
2532:		payload.handoff_id,
2533:		payload.handoffId
2537:function getAiInboundHandoffId(handoff) {
2538:	const durableId = getAiInboundDurableHandoffId(handoff);
2540:	if (!handoff) return "";
2541:	const payload = asObject(handoff?.payload);
2542:	const stablePayloadId = firstAiInboundId(payload.handoff_id, payload.handoffId, payload.id, handoff?.created_at, handoff?.createdAt);
2545:		if (!aiInboundHandoffObjectIds.has(handoff)) {
2547:			aiInboundHandoffObjectIds.set(handoff, `cached-ai-handoff-${Date.now()}-${aiInboundHandoffCounter}`);
2549:		return aiInboundHandoffObjectIds.get(handoff);
2551:	return [handoff?.source_page, handoff?.destination_page, payload.prompt, payload.title]
2554:		.join("::") || `cached-ai-handoff-${Date.now()}`;
2557:function normalizeAiInboundHandoff(handoff, projectName) {
2558:	const payload = asObject(handoff?.payload);
2559:	const draftContext = firstAiInboundObject(payload.draft_context, payload.draftContext, handoff?.draft_context, handoff?.draftContext);
2563:		handoff?.source_page,
2564:		handoff?.sourcePage,
2565:		draftContext.source_page,
2566:		draftContext.sourcePage
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
2597:		handoff?.title,
2598:		`Inbound handoff from ${sourceLabel}`
2603:		asAiInboundList(draftContext.routeSuggestions).length ? draftContext.routeSuggestions :
2604:		draftContext.route_suggestions,
2608:	const teamMode = normalizeAiInboundTeamMode(firstAiInboundId(payload.teamMode, payload.team_mode, draftContext.teamMode, draftContext.team_mode));
2610:		draftContext.outputPreview,
2611:		draftContext.output_preview,
2612:		draftContext.phase2_output_preview,
2614:		payload.output_preview
2625:		draftContext: {
2626:			...draftContext,
2630:		status: asString(handoff?.status || payload.status || "available"),
2631:		note: "Guidance only. No publishing, task creation, CRM updates, customer replies, workflow runs, exports, or backend actions are executed from this handoff."
2638:	const handoff = getSharedHandoff(projectName, "ai-command", operations);
2639:	const handoffId = getAiInboundHandoffId(handoff);
2640:	if (!handoffId || handoffId === asString(session.lastAppliedHandoffId)) return;
2642:	const normalized = normalizeAiInboundHandoff(handoff, projectName);
2643:	session.draftMessage = normalized.prompt;
2649:		id: handoffId,
2662:			preview: session.outputPreview,

## Render function markers
5:        renderAiToolDrawerShell
2911:function renderCommandComposer(session, aiContext, escapeHtml) {
2984:function renderSuggestedPromptsSection(aiContext, session, escapeHtml) {
3803:function renderAiRoomConversationHeader(session, bridgeStatus, escapeHtml) {
3901:function renderPhase35ToolsPanel(session, projectName, aiContext, escapeHtml) {
3981:function renderPhase1Composer(session, aiContext, escapeHtml) {
4133:function renderAiRoomOutputWorkspace(session, aiContext, escapeHtml) {
4290:function renderPhase3SpecialistConversation(session, bridgeStatus, escapeHtml) {
4502:function renderPhase1SuggestedPrompts(session, escapeHtml) {
4587:function renderPhase1SafetyPanel(escapeHtml) {
4767:												${renderAiRoomConversationHeader(session, bridgeStatus, escapeHtml)}
4769:													${renderPhase3SpecialistConversation(session, bridgeStatus, escapeHtml)}
4771:												${renderPhase1Composer(session, aiContext, escapeHtml)}
4776:						${renderAiRoomOutputWorkspace(session, aiContext, escapeHtml)}
4777:						${renderPhase35ToolsPanel(session, projectName, aiContext, escapeHtml)}
4781:				${renderAiToolDrawerShell({ escapeHtml })}

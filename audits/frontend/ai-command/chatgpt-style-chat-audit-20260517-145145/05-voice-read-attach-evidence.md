# Voice / Read / Attach Evidence

public/control-center/pages/ai-command.js:14:	getCategoryReadinessList
public/control-center/pages/ai-command.js:140:		status: "Ready"
public/control-center/pages/ai-command.js:153:		status: "Ready"
public/control-center/pages/ai-command.js:166:		status: "Ready"
public/control-center/pages/ai-command.js:179:		status: "Ready"
public/control-center/pages/ai-command.js:184:		position: "Publishing Readiness Lead",
public/control-center/pages/ai-command.js:192:		status: "Ready"
public/control-center/pages/ai-command.js:205:		status: "Ready"
public/control-center/pages/ai-command.js:218:		status: "Ready"
public/control-center/pages/ai-command.js:231:		status: "Ready"
public/control-center/pages/ai-command.js:244:		status: "Ready"
public/control-center/pages/ai-command.js:251:		summary: "Inbox review, reply drafts, ticket drafts, SLA risk, customer profile context, and escalation routing.",
public/control-center/pages/ai-command.js:257:		status: "Ready"
public/control-center/pages/ai-command.js:264:		summary: "Lead qualification, outreach drafts, follow-up cadence, CRM profile summaries, and sales handoff notes.",
public/control-center/pages/ai-command.js:266:		canHelp: ["Qualify lead context", "Draft outreach", "Plan follow-up sequences", "Summarize CRM profiles", "Prepare sales handoffs"],
public/control-center/pages/ai-command.js:270:		status: "Ready"
public/control-center/pages/ai-command.js:404:		{ id: "asset-checklist", label: "Asset Checklist", action: "preview", intent: "task", template: "Create an asset checklist for {project}. List must-have files, missing references, usage context, and priority." },
public/control-center/pages/ai-command.js:440:		{ id: "publish-readiness", label: "Publish Readiness", action: "preview", intent: "handoff", template: "Review publish readiness for {project}. Confirm what needs human approval before release." },
public/control-center/pages/ai-command.js:457:		{ id: "customer-profile-snapshot", label: "Customer Profile Snapshot", action: "preview", intent: "guidance", template: "Prepare a customer profile snapshot for {project}. Include known context, purchase/support signals, missing fields, and safe follow-up questions." },
public/control-center/pages/ai-command.js:464:		{ id: "crm-profile-summary", label: "CRM Profile Summary", action: "preview", intent: "guidance", template: "Summarize the CRM profile context for {project}. Include fit, history, open questions, and next sales action without mutating CRM data." },
public/control-center/pages/ai-command.js:467:		{ id: "influencer-lead-plan", label: "Influencer Lead Plan", action: "preview", intent: "workflow", template: "Prepare an influencer lead plan for {project}. Include target profile, outreach angle, qualification criteria, and handoff path." },
public/control-center/pages/ai-command.js:477:	{ icon: "🔧", label: "Fix Readiness", sub: "Close critical gaps", template: "What are the critical readiness gaps for {project} and what exactly needs to be done to fix them?" }
public/control-center/pages/ai-command.js:1281:			title: outputType === "handoff" ? "Handoff Preview: Publishing package" : "Publishing Draft: Readiness checklist",
public/control-center/pages/ai-command.js:1409:				"CRM profile and pipeline changes remain outside AI Team.",
public/control-center/pages/ai-command.js:1617:	const assetCategories = getCategoryReadinessList(assets);
public/control-center/pages/ai-command.js:1786:	if (aiContext.readinessScore != null) summaryParts.push(`Readiness is ${aiContext.readinessScore}/100 (${aiContext.readinessStatus || "in progress"}).`);
public/control-center/pages/ai-command.js:2611:					<span>Readiness</span>
public/control-center/pages/ai-command.js:2706:							<option value="fix"${session.taskType === "fix" ? " selected" : ""}>🔧 Fix Readiness</option>
public/control-center/pages/ai-command.js:3070:			command: `Create an asset unblock plan for ${aiContext.projectName || "this project"}. List missing files, priority, and where each is needed.`,
public/control-center/pages/ai-command.js:3289:					<span>Readiness</span>
public/control-center/pages/ai-command.js:3341:					const roleLine = `${spec.status || "Ready"} - ${spec.position || "Specialist"}`;
public/control-center/pages/ai-command.js:3365:function renderPhase1Profile(session, escapeHtml) {
public/control-center/pages/ai-command.js:3369:			<div class="aicmd-v2-profile aicmd-v2-team-profile">
public/control-center/pages/ai-command.js:3370:				<div class="aicmd-v2-profile-header">
public/control-center/pages/ai-command.js:3371:					<span class="aicmd-v2-profile-icon">Team</span>
public/control-center/pages/ai-command.js:3373:						<h2 class="aicmd-v2-profile-title">Full AI Team</h2>
public/control-center/pages/ai-command.js:3374:						<p class="aicmd-v2-profile-purpose">Coordinates specialists into one review-ready brief, workflow, or handoff.</p>
public/control-center/pages/ai-command.js:3388:		<div class="aicmd-v2-profile">
public/control-center/pages/ai-command.js:3389:			<div class="aicmd-v2-profile-header">
public/control-center/pages/ai-command.js:3390:				<span class="aicmd-v2-profile-icon">${spec.icon}</span>
public/control-center/pages/ai-command.js:3392:					<h2 class="aicmd-v2-profile-title">${escapeHtml(spec.label)}</h2>
public/control-center/pages/ai-command.js:3393:					<p class="aicmd-v2-profile-purpose">${escapeHtml(spec.position ? `${spec.position}. ${spec.summary}` : spec.summary)}</p>
public/control-center/pages/ai-command.js:3534:function renderPhase35ReadinessStrip(aiContext, bridgeStatus, escapeHtml) {
public/control-center/pages/ai-command.js:3537:		{ label: "Read preview", value: "Ready", className: "is-available" },
public/control-center/pages/ai-command.js:3538:		{ label: "Voice input", value: "Coming", className: "is-planned" },
public/control-center/pages/ai-command.js:3539:		{ label: "Team chat", value: bridgeStatus.available ? "Ready" : "Coming", className: bridgeStatus.available ? "is-available" : "is-planned" },
public/control-center/pages/ai-command.js:3582:				<button class="aicmd-room-mini-btn" type="button" disabled title="Attachment intake is planned for a later backend step.">Attach</button>
public/control-center/pages/ai-command.js:3583:				<button id="aicmdV2VoiceBtn" class="aicmd-room-mini-btn" type="button" title="Use browser speech recognition when available.">Voice</button>
public/control-center/pages/ai-command.js:3699:				<button id="aicmdV2LegacyPreviewReadBtn" class="aicmd-v2-btn-ghost" type="button" ${typeof speechSynthesis === "undefined" ? "disabled" : ""}>Read preview</button>
public/control-center/pages/ai-command.js:3804:				<button id="aicmdV2PreviewReadBtn" class="aicmd-v2-btn-ghost" type="button" ${(hasPreview && typeof speechSynthesis !== "undefined") ? "" : "disabled"}>Read Aloud</button>
public/control-center/pages/ai-command.js:3809:			<div class="aicmd-room-planned-note">Planned controls are disabled: no task record or export file is created from this page until durable handlers are connected.</div>
public/control-center/pages/ai-command.js:3825:			<div><span>Readiness</span><strong>${escapeHtml(readiness)}</strong></div>
public/control-center/pages/ai-command.js:3839:	const speechSynthAvailable = typeof speechSynthesis !== "undefined";
public/control-center/pages/ai-command.js:3844:				<h3 class="aicmd-v2-media-status-title">Media, Voice &amp; Chat Capability</h3>
public/control-center/pages/ai-command.js:3851:				<li><span>Voice script preparation</span><strong class="is-draft-ready">Draft-ready — script only, no audio</strong></li>
public/control-center/pages/ai-command.js:3852:				<li><span>Read preview aloud (browser)</span><strong class="${speechSynthAvailable ? "is-available" : "is-planned"}">${speechSynthAvailable ? "Available in this browser" : "Not supported in this browser"}</strong></li>
public/control-center/pages/ai-command.js:3853:				<li><span>Voice input (microphone)</span><strong class="is-planned">Planned — SpeechRecognition not enabled</strong></li>
public/control-center/pages/ai-command.js:3976:                                                                                <button id="aicmdV3ResponseReadBtn" class="aicmd-v2-btn-ghost" type="button" ${(latest && typeof speechSynthesis !== "undefined") ? "" : "disabled"}>Read</button>
public/control-center/pages/ai-command.js:4028:	const sessionState = session.responseLoading ? "Generating" : (session.outputPreview ? "Preview ready" : (asString(session.draftMessage).trim() ? "Drafting" : "Ready"));
public/control-center/pages/ai-command.js:4038:		{ label: "Readiness", value: readiness != null ? `${readiness}/100` : "No readiness data", present: readiness != null },
public/control-center/pages/ai-command.js:4054:				{ label: "CRM", value: "Profile context", present: true, scoped: true },
public/control-center/pages/ai-command.js:4402:		const voiceBtn = $("aicmdV2VoiceBtn");
public/control-center/pages/ai-command.js:4405:				const SpeechRecognitionCtor = typeof window !== "undefined"
public/control-center/pages/ai-command.js:4406:					? (window.SpeechRecognition || window.webkitSpeechRecognition)
public/control-center/pages/ai-command.js:4408:				if (!SpeechRecognitionCtor) {
public/control-center/pages/ai-command.js:4409:					updateStatus("Voice input trigger is ready. Browser speech recognition is not available in this environment yet.");
public/control-center/pages/ai-command.js:4410:					showMessage?.("Voice input readiness is staged for compatible browsers.");
public/control-center/pages/ai-command.js:4415:					const recognition = new SpeechRecognitionCtor();
public/control-center/pages/ai-command.js:4427:						persistSessionDraft(sessionKey, session, "Voice input captured");
public/control-center/pages/ai-command.js:4428:						updateStatus("Voice input captured in composer.");
public/control-center/pages/ai-command.js:4431:						updateStatus("Voice input could not start. Microphone permission may be blocked.");
public/control-center/pages/ai-command.js:4436:					updateStatus("Voice input could not start in this browser.");
public/control-center/pages/ai-command.js:4801:		const responseReadBtn = $("aicmdV3ResponseReadBtn");
public/control-center/pages/ai-command.js:4802:		if (responseReadBtn) {
public/control-center/pages/ai-command.js:4803:			responseReadBtn.onclick = () => {
public/control-center/pages/ai-command.js:4805:				if (typeof speechSynthesis === "undefined" || typeof SpeechSynthesisUtterance === "undefined") {
public/control-center/pages/ai-command.js:4806:					updateStatus("Read is not supported in this browser.");
public/control-center/pages/ai-command.js:4810:				speechSynthesis.cancel();
public/control-center/pages/ai-command.js:4811:				speechSynthesis.speak(utterance);
public/control-center/pages/ai-command.js:4812:				updateStatus("Reading response locally in browser.");
public/control-center/pages/ai-command.js:4911:		const previewReadBtn = $("aicmdV2PreviewReadBtn");
public/control-center/pages/ai-command.js:4912:		if (previewReadBtn) {
public/control-center/pages/ai-command.js:4913:			previewReadBtn.onclick = () => {
public/control-center/pages/ai-command.js:4916:				if (typeof speechSynthesis === "undefined" || typeof SpeechSynthesisUtterance === "undefined") {
public/control-center/pages/ai-command.js:4917:					updateStatus("Read preview is not supported in this browser.");
public/control-center/pages/ai-command.js:4924:				speechSynthesis.cancel();
public/control-center/pages/ai-command.js:4925:				speechSynthesis.speak(utterance);
public/control-center/pages/ai-command.js:4926:				updateStatus("Reading preview locally in browser.");
public/control-center/styles/12-pages.css:2647:.aicmd-v2-profile {
public/control-center/styles/12-pages.css:2654:.aicmd-v2-team-profile {
public/control-center/styles/12-pages.css:2659:.aicmd-v2-profile-header {
public/control-center/styles/12-pages.css:2666:.aicmd-v2-profile-icon {
public/control-center/styles/12-pages.css:2672:.aicmd-v2-profile-title {
public/control-center/styles/12-pages.css:2679:.aicmd-v2-profile-purpose {
public/control-center/styles/12-pages.css:2686:.aicmd-v2-profile-safety {
public/control-center/styles/12-pages.css:2698:.aicmd-v2-profile-safety-icon {
public/control-center/styles/12-pages.css:2703:.aicmd-v2-profile-grid {
public/control-center/styles/12-pages.css:2710:.aicmd-v2-profile-col {
public/control-center/styles/12-pages.css:2716:.aicmd-v2-profile-details {
public/control-center/styles/12-pages.css:2722:.aicmd-v2-profile-details summary {
public/control-center/styles/12-pages.css:2730:.aicmd-v2-profile-details summary::-webkit-details-marker {
public/control-center/styles/12-pages.css:2734:.aicmd-v2-profile-details[open] summary {
public/control-center/styles/12-pages.css:2738:.aicmd-v2-profile-details .aicmd-v2-profile-grid {
public/control-center/styles/12-pages.css:2743:.aicmd-v2-profile-label {
public/control-center/styles/12-pages.css:2751:.aicmd-v2-profile-list {
public/control-center/styles/12-pages.css:2760:.aicmd-v2-profile-item {
public/control-center/styles/12-pages.css:2767:.aicmd-v2-profile-item::before {
public/control-center/styles/12-pages.css:2775:.aicmd-v2-profile-denied {
public/control-center/styles/12-pages.css:2779:.aicmd-v2-profile-denied::before {
public/control-center/styles/12-pages.css:2784:.aicmd-v2-profile-destinations {
public/control-center/styles/12-pages.css:3651:  .aicmd-v2-profile-grid {
public/control-center/styles/12-pages.css:3850:[data-page="ai-command"] .aicmd-v2-profile,
public/control-center/styles/12-pages.css:4006:[data-page="ai-command"] .aicmd-v2-profile {
public/control-center/styles/12-pages.css:4010:[data-page="ai-command"] .aicmd-v2-profile-header {
public/control-center/styles/12-pages.css:4015:[data-page="ai-command"] .aicmd-v2-profile-icon {
public/control-center/styles/12-pages.css:4026:[data-page="ai-command"] .aicmd-v2-profile-title {
public/control-center/styles/12-pages.css:4030:[data-page="ai-command"] .aicmd-v2-profile-purpose {
public/control-center/styles/12-pages.css:4423:.aicmd-v2-profile,

# PHASE 3AE.3 — AI Command Operations Handoff Target Review

## Existing target marker file preview
# PHASE 3AE.2 — AI Command Operations Handoff Copy Target Markers

## Candidate copy risk strings in ai-command.js
377:	{ id: "workflow", label: "Draft Workflow", helper: "Operating sequence" },
378:	{ id: "handoff", label: "Prepare Handoff", helper: "Destination package" },
491:		{ id: "draft-customer-reply", label: "Draft Customer Reply", action: "preview", intent: "guidance", template: "Draft a customer reply for {project}. Keep it helpful, calm, review-ready, and do not claim any operational action has been completed." },
1213:		"Deliver a structured, review-ready answer.",
1395:		safetyLabel: "Guidance and draft only. No backend execution.",
1512:			safetyLabel: "Confirmation required before publish. No publish action performed."
1718:		nextSafeAction: "Review the team draft, confirm owners, then route draft context to the destination workspace",
2208:	return { title: "Execution task block", owner: "Workflows", steps: ["Confirm the goal and required output.", "Identify which workspace owns the work.", "Move into the correct page and execute the first step."] };
2520:		safetyLabel: firstAiInboundText(preview.safetyLabel, preview.safety_label, "Guidance and draft only. No backend execution."),
2591:	)) || `Review this ${sourceLabel} handoff for ${projectLabel}. Identify the right specialist, summarize the context, produce a review-ready draft, and recommend the next safe route. Do not execute publishing, task creation, CRM updates, customer replies, workflow runs, or backend actions.`;
2990:				<span style="font-size:11px;color:var(--color-text-2);">Prefill only — send to run</span>
3338:                guidance: "review-ready draft",
3350:                "Keep it review-ready and do not execute backend actions.",
3377:        preview.safetyLabel = preview.safetyLabel || "Conversation converted into a review-ready draft. No backend action executed.";
3543:		task: "Task Draft",
3544:		workflow: "Draft Workflow",
3545:		handoff: "Prepare Handoff",
3581:	return "Prepare a review-ready output for the selected specialist lane.";
3613:				<p class="aicmd-room-subtitle mhos-context-description">One specialist or the full team turns requests into review-ready drafts, tasks, and handoffs.</p>
3683:			<span>Full Team prepares a coordinated, review-ready plan. It does <b>not</b> execute workflows or publish anything.</span>
3750:						<p class="aicmd-v2-profile-purpose">Coordinates specialists into one review-ready brief, workflow, or handoff.</p>
3861:		template: asString(tool.template || "Prepare a review-ready draft for {projectName}.")
4068:		? (preview.confirmationRequired ? "Confirmation required" : "Review before route")
4117:					<p class="aicmd-v2-preview-confirmation">${escapeHtml(humanizeValue(preview.safetyLabel, "Guidance only. No backend execution."))}</p>
4151:		? (preview.confirmationRequired ? "Confirmation required" : "Review before route")
4160:                                        <p>${hasPreview ? "Review the result, then route draft context to the next workspace." : "Create a preview from the conversation before routing work to another workspace."}</p>
4218:						<strong>${escapeHtml(humanizeValue(preview.safetyLabel, "Guidance only. No backend execution."))}</strong>
4225:                                        <span>Choose Draft, Task, Draft Workflow, or Prepare Handoff, then create a preview from the conversation.</span>
4236:                                <div class="aicmd-room-planned-note">This is a review-ready preview. Execution, publishing, approvals, CRM updates, and workflow runs happen only in the destination workspace after confirmation.</div>
4238:                                <div class="aicmd-room-planned-note">No output actions yet. Create a Draft, Task, Draft Workflow, or Prepare Handoff from the conversation first.</div>
4247:	const approval = preview.confirmationRequired ? "Confirmation required" : (preview.outputType ? "Review ready" : "No draft yet");
4441:                                                                <small>Please wait while the specialist prepares a review-ready response.</small>
4520:						data-aicmdv2-prompt-text="${escapeHtml(p.prompt || `${p.label}. ${p.sub}. Prepare this as a review-ready draft only; do not execute anything.`)}"
4610:					<span>Backend owns authority — AI Command prepares guidance and routes. It does not override execution controls.</span>
4666:		description: "Talk to your AI team, run structured tasks, and turn intelligence into action."
5222:                // Phase 1: stages draft locally from conversation context. No backend execution.
5243:                // Phase 1: converts the current conversation into a task preview. No backend execution.

## Candidate copy risk strings in tool-dock.js
59:    targetButton = root.querySelector("[data-aicmd-tool-dock][data-aicmd-tool-dock-action='guided']")
172:function truncatePromptText(value = "", maxLength = 900) {
195:  const preview = truncatePromptText(source.text_preview || source.preview || source.notes || "");
277:        <div class=\"mhos-tool-drawer-source-actions\">
299:  // Attach actions
328:    template: "Rewrite the latest response or selected text for {projectName}. Make it clearer, more professional, and easier to use. Do not publish or execute anything."
335:    template: "Translate or adapt the selected text for the project target market. Keep the explanation in the user's chat language and prepare only review-ready copy."
342:    template: "Improve this draft for clarity, stronger value, better structure, and a cleaner CTA. Keep it safe and review-ready."
353:      actionType: "guided",
358:      outputTypes: ["campaign_plan", "campaign_brief", "channel_plan", "next_best_actions"],
359:      template: "Create a campaign plan for {projectName}. Include objective, audience, offer, channels, phases, risks, and next best actions. Keep it review-ready only."
366:      actionType: "guided",
372:      template: "Build a launch plan for {projectName}. Include timeline, required assets, owners, channels, readiness gaps, and safe next actions."
379:      actionType: "guided",
392:      actionType: "guided",
405:      actionType: "guided",
410:      outputTypes: ["funnel_map", "content_needs", "handoff_points", "retention_notes"],
411:      template: "Map a funnel for {projectName}. Include awareness, consideration, conversion, retention, content needs, and handoff points."
418:      actionType: "preview",
423:      outputTypes: ["next_best_action", "priority_list", "blocker_map", "action_sequence"],
424:      template: "Prioritize the next best actions for {projectName}. Separate urgent, important, blocked, and later work."
434:      actionType: "guided",
440:      template: "Use the Content Writer to create a new written output for {projectName}. First ask or infer the output type: company profile, product copy, email, blog article, landing page, contract draft, presentation outline, speech, FAQ, proposal, social post, or ad copy. Ask for sources if needed. Keep it review-ready and do not publish or send anything."
447:      actionType: "guided",
460:      actionType: "guided",
466:      template: "Translate and localize the current text for {projectName}. Ask for target language and market if missing. Preserve brand tone, adapt CTA and wording for the target audience, and keep the result review-ready."
473:      actionType: "guided",
486:      actionType: "preview",
499:      actionType: "source_required",
504:      outputTypes: ["source_bundle", "fact_extraction", "proof_summary", "context_brief"],
512:      actionType: "guided",
525:      actionType: "guided",
534:      id: "send",
538:      actionType: "route",
541:      destinations: ["content-studio", "library", "media-studio", "publishing", "compliance", "task", "handoff"],
543:      outputTypes: ["content_studio_draft", "library_save", "media_brief", "publishing_package", "compliance_review", "task_preview", "handoff_preview"],
544:      template: "Prepare safe routing for this Content Writer output for {projectName}. Ask the destination: Content Studio, Save to Library, Prepare Media Brief, Publishing package, Compliance review, Task, or Handoff. Do not route or execute before review."
553:      actionType: "guided",
566:      actionType: "guided",
579:      actionType: "guided",
592:      actionType: "source_required",
605:      actionType: "guided",
618:      actionType: "source_required",
623:      outputTypes: ["brand_check_report", "style_risks", "missing_assets", "improvement_actions"],
624:      template: "Review the visual direction for brand consistency. Flag risks, missing assets, style mismatches, and improvement actions."
634:      actionType: "guided",
647:      actionType: "guided",
660:      actionType: "guided",
673:      actionType: "guided",
686:      actionType: "guided",
702:      actionType: "preview",
715:      actionType: "guided",
728:      actionType: "guided",
734:      template: "Draft a publishing schedule for {projectName}. Include channels, timing, dependencies, review gates, and next actions."
741:      actionType: "guided",
754:      actionType: "source_required",
770:      actionType: "guided",
783:      actionType: "guided",
796:      actionType: "guided",
809:      actionType: "guided",
815:      template: "Create a creative testing plan for {projectName}. Include hypotheses, variants, success signals, and next actions."
822:      actionType: "source_required",
838:      actionType: "guided",
851:      actionType: "source_required",
856:      outputTypes: ["insights_summary", "optimization_actions", "missing_data_notes", "risk_notes"],
857:      template: "Summarize insights for {projectName}. Include what is working, what is weak, missing data, and next optimization actions."
864:      actionType: "guided",
877:      actionType: "source_required",
890:      actionType: "guided",
895:      outputTypes: ["content_gap_report", "missing_topics", "missing_pages", "priority_actions"],
896:      template: "Identify content gaps for {projectName}. Include missing pages, missing topics, weak funnel stages, and priority actions."
906:      actionType: "source_required",
919:      actionType: "guided",
932:      actionType: "source_required",
945:      actionType: "source_required",
958:      actionType: "source_required",
964:      template: "Prepare approval notes for {projectName}. Include risks, required reviewer, unresolved issues, and safe next actions."
974:      actionType: "guided",
987:      actionType: "guided",
990:      destinations: ["chat-preview", "workflows", "task", "handoff"],
991:      sourceTypes: ["current_chat", "handoff_summary", "operations_snapshot", "approval_notes", "manual_input"],
996:      id: "handoff",
1000:      actionType: "guided",
1003:      destinations: ["chat-preview", "handoff", "workflows", "content-studio", "media-studio", "publishing", "governance"],
1005:      outputTypes: ["handoff_summary", "destination_brief", "required_inputs", "review_notes"],
1006:      template: "Prepare a handoff summary for {projectName}. Include context, destination workspace, owner, required inputs, and review notes."
1013:      actionType: "guided",
1026:      actionType: "guided",
1042:      actionType: "guided",
1044:      frontendOwnerPage: "operations-centers",
1045:      destinations: ["chat-preview", "operations-centers", "task", "governance"],
1048:      template: "Draft a safe customer reply for {projectName}. Do not send it. Include empathy, answer, next step, and escalation note if needed."
1055:      actionType: "guided",
1057:      frontendOwnerPage: "operations-centers",
1058:      destinations: ["chat-preview", "operations-centers", "task", "workflows"],
1068:      actionType: "preview",
1070:      frontendOwnerPage: "operations-centers",
1071:      destinations: ["chat-preview", "operations-centers", "task", "workflows"],
1073:      outputTypes: ["sla_risk_review", "urgency_flags", "escalation_needs", "safe_next_actions"],
1074:      template: "Review SLA or response risk for this customer context. Flag urgency, escalation needs, and safe next actions."
1081:      actionType: "guided",
1083:      frontendOwnerPage: "operations-centers",
1084:      destinations: ["chat-preview", "operations-centers", "workflows", "sales-crm-draft"],
1097:      actionType: "guided",
1110:      actionType: "guided",
1123:      actionType: "guided",
1128:      outputTypes: ["objection_handling", "proof_needed", "safe_answers", "next_action"],
1129:      template: "Prepare objection handling for {projectName}. Include likely objections, safe answers, proof needed, and next action."
1136:      actionType: "guided",
1139:      destinations: ["chat-preview", "workflows", "operations-centers", "sales-crm-draft"],
1200:              <p class="mhos-tool-drawer-kicker" data-aicmd-tool-drawer-action>Smart tool</p>
1287:          Preparation-only: this drawer creates a composer-ready instruction. It does not publish, send, route, create CRM records, run workflows, or mutate backend data.
1290:        <div class="mhos-tool-drawer-actions">
1329:            data-aicmd-tool-dock-action="${safe(tool.actionType || "guided")}"
1443:  const action = drawer?.querySelector?.("[data-aicmd-tool-drawer-action]")?.textContent || "Guided";
1461:    `- Tool mode: ${action}.`,
1484:    `Create the requested ${output.toLowerCase()} as review-ready content.`,
1503:    `Prepare the output for ${destination}, but do not send, save, route, publish, or create records automatically.`,
1506:    "- Prepare review-ready output only.",
1507:    "- Do not publish, send, route, save, overwrite, create CRM records, or run workflows.",
1557:  const actionType = btn.getAttribute("data-aicmd-tool-dock-action") || "guided";
1564:  setDrawerText(drawer, "[data-aicmd-tool-drawer-action]", `${humanizeMeta(actionType)} · ${humanizeMeta(btn.getAttribute("data-aicmd-tool-dock-owner") || "ai-command")}`);
1575:  drawer.dataset.sourceRequired = actionType === "source_required" || sourceMetadataNeedsLibrarySource(rawSources) ? "true" : "false";
1615:  const actionType = tool.requiresSelectedSource && !tool.actionType ? "source_required" : (tool.actionType || tool.action || "guided");
1621:    "data-aicmd-tool-dock-action": actionType,
1755:      const actionType = btn.getAttribute("data-aicmd-tool-dock-action") || "prefill";
1758:      if (actionType !== "prefill") {

## AI Command source ranges for future patch review

### Route maps
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

### Composer and send/preview labels

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
					<button id="ctrlSendBtn" class="ctrl-send-btn" type="button">Send to ${escapeHtml(mode.label)}</button>
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
				<span style="font-size:11px;color:var(--color-text-2);">Prefill only — send to run</span>
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


### Output workspace copy
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
				</div>
				<div class="aicmd-v2-preview-empty-state">
					<strong>No preview yet</strong>
					<span>Ask a specialist or send the chat response to preview.</span>
				</div>
			</section>
		`;
	}

	const structuredPreview = buildStructuredPreviewBlocks(preview);
	const destination = routeLabel(preview.destinationRoute || destinationRouteForSpecialist(session.modeId, preview.outputType || "guidance"));
	const specialist = session.teamMode === "team"
		? { id: "team", label: "Full Team" }
		: getPhase1SpecialistById(preview.specialistId || session.modeId);
	const outputLabel = hasPreview ? formatOutputTypeLabel(preview.outputType) : titleCase(activeTab);
	const routeActionLabel = destination === "Content Studio"
		? "Send Draft to Content Studio"
		: destination === "Publishing"
			? "Route Draft to Publishing"
			: `Route Draft to ${destination}`;
	const confirmationLabel = hasPreview
		? (preview.confirmationRequired ? "Confirmation required" : "Review before route")
		: "Waiting for output";

	return `
		<section class="aicmd-v2-preview">
			<div class="aicmd-v2-preview-head">
				<div>
					<h3 class="aicmd-v2-preview-title">Preview</h3>
					<p class="aicmd-v2-preview-subtitle">${escapeHtml(humanizeValue(preview.sourcePrompt, "Review the generated specialist output."))}</p>
				</div>
				<span class="aicmd-v2-preview-status">${escapeHtml(titleCase(preview.status || "draft_preview"))}</span>
			</div>

			<div class="aicmd-v2-preview-meta">
				<span class="aicmd-v2-preview-chip"><strong>Type:</strong> ${escapeHtml(formatOutputTypeLabel(preview.outputType))}</span>
				<span class="aicmd-v2-preview-chip"><strong>Specialist:</strong> ${escapeHtml(specialist.label || "Specialist")}</span>
				<span class="aicmd-v2-preview-chip"><strong>Destination:</strong> ${escapeHtml(destination)}</span>
				<span class="aicmd-v2-preview-chip"><strong>Generated:</strong> ${escapeHtml(formatTime(preview.generatedAt))}</span>
			</div>

			<div class="aicmd-v2-preview-body">
				<p class="aicmd-v2-preview-what-heading">Prepared output</p>
				<h4 class="aicmd-v2-preview-output-title">${escapeHtml(humanizeValue(preview.title, "Draft output"))}</h4>
				<p class="aicmd-v2-preview-summary">${escapeHtml(humanizeValue(preview.summary, "Guidance preview prepared."))}</p>

				${structuredPreview.draftText ? `
					<div class="aicmd-v2-preview-draft">${escapeHtml(structuredPreview.draftText)}</div>
				` : ""}

				${structuredPreview.blocks.length ? `
					<div class="aicmd-v2-preview-structured-grid aicmd-room-output-blocks">
						${structuredPreview.blocks.map((block) => `
							<div class="aicmd-v2-preview-section">
								<span class="aicmd-v2-preview-label">${escapeHtml(block.label)}</span>
								<${block.ordered ? "ol" : "ul"} class="${block.ordered ? "aicmd-v2-preview-steps" : "aicmd-v2-preview-list"}">
									${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
								</${block.ordered ? "ol" : "ul"}>
							</div>
						`).join("")}
					</div>
				` : ""}

				<div class="aicmd-v2-preview-section">
					<span class="aicmd-v2-preview-label">What you can do next</span>
					<p class="aicmd-v2-preview-next-action">${escapeHtml(humanizeValue(preview.nextSafeAction, `Review in ${destination}.`))}</p>
				</div>

				<div class="aicmd-v2-preview-section">
					<span class="aicmd-v2-preview-label">What requires confirmation</span>
					<p class="aicmd-v2-preview-confirmation">${escapeHtml(humanizeValue(preview.safetyLabel, "Guidance only. No backend execution."))}</p>
					<p class="aicmd-v2-preview-safety">${escapeHtml(humanizeValue(preview.confirmationNote, "Execution requires explicit confirmation in the destination workspace."))}</p>
				</div>
			</div>

			<div class="aicmd-v2-preview-actions">
				<button id="aicmdV2LegacyPreviewCopyBtn" class="aicmd-v2-btn-secondary" type="button">Copy</button>
				<button id="aicmdV2LegacyPreviewUseBtn" class="aicmd-v2-btn-secondary" type="button">Use in Composer</button>
				<button id="aicmdV2LegacyPreviewSendBtn" class="aicmd-v2-btn-secondary" type="button">Route Draft</button>
				<button id="aicmdV2LegacyPreviewSaveBtn" class="aicmd-v2-btn-ghost" type="button">Save</button>
				<button id="aicmdV2LegacyPreviewReadBtn" class="aicmd-v2-btn-ghost" type="button" ${typeof speechSynthesis === "undefined" ? "disabled" : ""}>Read preview</button>
				<button id="aicmdV2LegacyPreviewClearBtn" class="aicmd-v2-btn-ghost" type="button">Clear preview</button>
			</div>
		</section>
	`;
}

function renderAiRoomOutputWorkspace(session, aiContext, escapeHtml) {
	const preview = asObject(session.outputPreview);
	const hasPreview = Boolean(preview.outputType && preview.title);
	const activeTab = getOutputWorkspaceTab(session);
	const structuredPreview = hasPreview ? buildStructuredPreviewBlocks(preview) : { blocks: [], draftText: "", compactSummary: "" };
	const languagePlan = getWorkspaceLanguagePlan(aiContext);
	const destination = routeLabel(preview.destinationRoute || destinationRouteForSpecialist(session.modeId, preview.outputType || "guidance"));
	const specialist = session.teamMode === "team"
		? { id: "team", label: "Full Team" }
		: getPhase1SpecialistById(preview.specialistId || session.modeId);
	const outputLabel = hasPreview ? formatOutputTypeLabel(preview.outputType) : titleCase(activeTab);
	const routeActionLabel = destination === "Content Studio"
		? "Send Draft to Content Studio"
		: destination === "Publishing"
			? "Route Draft to Publishing"
			: `Route Draft to ${destination}`;
	const confirmationLabel = hasPreview
		? (preview.confirmationRequired ? "Confirmation required" : "Review before route")
		: "Waiting for output";

	return `
		<section class="aicmd-room-output-workspace">
			<div class="aicmd-room-output-head">
				<div>
					<span class="aicmd-room-kicker">Output Workspace</span>
					<h2>Drafts, tasks, workflows, handoffs</h2>
                                        <p>${hasPreview ? "Review the result, then route draft context to the next workspace." : "Create a preview from the conversation before routing work to another workspace."}</p>
				</div>
				<span class="aicmd-room-output-state">${escapeHtml(confirmationLabel)}</span>
			</div>

						${hasPreview ? `
							<div class="aicmd-room-output-tabs mhos-workflow-chain" role="tablist" aria-label="Output workspace tabs">
								${AI_ROOM_OUTPUT_TABS.map((tab) => `
									<button
										type="button"
										class="aicmd-room-output-tab mhos-workflow-step${activeTab === tab.id ? " mhos-workflow-active is-active" : ""}"
										data-aicmdv2-output-tab="${escapeHtml(tab.id)}"
										role="tab"
										aria-selected="${activeTab === tab.id ? "true" : "false"}"
									>
										<strong>${escapeHtml(tab.label)}</strong>
										<span>${escapeHtml(tab.helper)}</span>
									</button>
								`).join("")}
							</div>

                                <div class="aicmd-room-output-meta">
                                        <span><strong>Market</strong>${escapeHtml(languagePlan.market)}</span>
                                        <span><strong>Language</strong>${escapeHtml(languagePlan.publishLanguage)}</span>
                                        <span><strong>Channel</strong>${escapeHtml(destination)}</span>
                                        <span><strong>Target</strong>${escapeHtml(aiContext.projectName || "Current project")}</span>
                                </div>
                        ` : ""}

			${hasPreview ? `
				<div class="aicmd-room-output-body">
					<div class="aicmd-room-output-title-row">
						<span>${escapeHtml(outputLabel)}</span>
						<span>${escapeHtml(specialist.label || "Specialist")}</span>
					</div>
					<h3>${escapeHtml(!humanizeValue(preview.title, "") || humanizeValue(preview.title, "").toLowerCase() === "chat reply" ? `${outputLabel} result` : humanizeValue(preview.title, "Draft output"))}</h3>
					<p class="aicmd-room-output-summary">${escapeHtml(structuredPreview.compactSummary || humanizeValue(preview.summary, "Guidance preview prepared."))}</p>

					

					${structuredPreview.blocks.length ? `
						<div class="aicmd-v2-preview-structured-grid aicmd-room-output-blocks">
							${structuredPreview.blocks.map((block) => `
								<div class="aicmd-v2-preview-section">
									<span class="aicmd-v2-preview-label">${escapeHtml(block.label)}</span>
									<${block.ordered ? "ol" : "ul"} class="${block.ordered ? "aicmd-v2-preview-steps" : "aicmd-v2-preview-list"}">
										${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
									</${block.ordered ? "ol" : "ul"}>
								</div>
							`).join("")}
						</div>
					` : ""}

					<div class="aicmd-room-output-next">
						<span>Next step</span>
						<strong>${escapeHtml(humanizeValue(preview.nextSafeAction, `Review in ${destination}.`))}</strong>
					</div>
					<div class="aicmd-room-output-confirmation">
						<strong>${escapeHtml(humanizeValue(preview.safetyLabel, "Guidance only. No backend execution."))}</strong>
						<span>${escapeHtml(humanizeValue(preview.confirmationNote, "Execution requires explicit confirmation in the destination workspace."))}</span>
					</div>
				</div>
			` : `
				<div class="aicmd-room-output-empty">
                                        <strong>No preview yet</strong>
                                        <span>Choose Draft, Task, Draft Workflow, or Prepare Handoff, then create a preview from the conversation.</span>
				</div>
			`}

                        ${hasPreview ? `
                                <div class="aicmd-room-output-actions">
                                        <button id="aicmdV2PreviewSendBtn" class="aicmd-v2-btn-primary" type="button">${escapeHtml(routeActionLabel)}</button>
                                        <button id="aicmdV2PreviewCopyBtn" class="aicmd-v2-btn-secondary" type="button">Copy</button>
                                        <button id="aicmdV2PreviewUseBtn" class="aicmd-v2-btn-secondary" type="button">Use in Composer</button>
                                        <button id="aicmdV2PreviewClearBtn" class="aicmd-v2-btn-ghost" type="button">Clear</button>
                                </div>
                                <div class="aicmd-room-planned-note">This is a review-ready preview. Execution, publishing, approvals, CRM updates, and workflow runs happen only in the destination workspace after confirmation.</div>
                        ` : `
                                <div class="aicmd-room-planned-note">No output actions yet. Create a Draft, Task, Draft Workflow, or Prepare Handoff from the conversation first.</div>
                        `}
		</section>
	`;
}

function renderAiRoomStatusStrip(aiContext, session, bridgeStatus, escapeHtml) {
	const preview = asObject(session.outputPreview);

### Safety / backend authority copy
		<div class="aicmd-v2-safety">
			<div class="aicmd-v2-safety-head">
				<span class="aicmd-v2-safety-icon">🔒</span>
				<span class="aicmd-v2-safety-label">How this workspace operates</span>
			</div>
			<div class="aicmd-v2-safety-rules">
				<div class="aicmd-v2-safety-rule">
					<span class="aicmd-v2-safety-bullet">●</span>
					<span>Guidance only — no execution happens from this workspace without confirmation.</span>
				</div>
				<div class="aicmd-v2-safety-rule">
					<span class="aicmd-v2-safety-bullet">●</span>
					<span>Drafts are not execution — prepared content stays local until you act on it.</span>
				</div>
				<div class="aicmd-v2-safety-rule">
					<span class="aicmd-v2-safety-bullet">●</span>
					<span>Publishing, approval, and workflow runs require your explicit confirmation in the right workspace.</span>
				</div>
				<div class="aicmd-v2-safety-rule">
					<span class="aicmd-v2-safety-bullet">●</span>
					<span>Backend owns authority — AI Command prepares guidance and routes. It does not override execution controls.</span>
				</div>
			</div>
		</div>
	`;
}

function renderPhase4HistoryPanel(session, escapeHtml) {
	const responses = asArray(session.responseHistory);
	const preview = asObject(session.outputPreview);
	const items = [

### Action handlers around previews and route handoff
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

### Tool dock operations tools
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

## Focused visible copy candidates
377:	{ id: "workflow", label: "Draft Workflow", helper: "Operating sequence" },
378:	{ id: "handoff", label: "Prepare Handoff", helper: "Destination package" },
491:		{ id: "draft-customer-reply", label: "Draft Customer Reply", action: "preview", intent: "guidance", template: "Draft a customer reply for {project}. Keep it helpful, calm, review-ready, and do not claim any operational action has been completed." },
1213:		"Deliver a structured, review-ready answer.",
1395:		safetyLabel: "Guidance and draft only. No backend execution.",
1512:			safetyLabel: "Confirmation required before publish. No publish action performed."
2208:	return { title: "Execution task block", owner: "Workflows", steps: ["Confirm the goal and required output.", "Identify which workspace owns the work.", "Move into the correct page and execute the first step."] };
2520:		safetyLabel: firstAiInboundText(preview.safetyLabel, preview.safety_label, "Guidance and draft only. No backend execution."),
2591:	)) || `Review this ${sourceLabel} handoff for ${projectLabel}. Identify the right specialist, summarize the context, produce a review-ready draft, and recommend the next safe route. Do not execute publishing, task creation, CRM updates, customer replies, workflow runs, or backend actions.`;
2990:				<span style="font-size:11px;color:var(--color-text-2);">Prefill only — send to run</span>
3338:                guidance: "review-ready draft",
3350:                "Keep it review-ready and do not execute backend actions.",
3377:        preview.safetyLabel = preview.safetyLabel || "Conversation converted into a review-ready draft. No backend action executed.";
3543:		task: "Task Draft",
3544:		workflow: "Draft Workflow",
3545:		handoff: "Prepare Handoff",
3581:	return "Prepare a review-ready output for the selected specialist lane.";
3613:				<p class="aicmd-room-subtitle mhos-context-description">One specialist or the full team turns requests into review-ready drafts, tasks, and handoffs.</p>
3683:			<span>Full Team prepares a coordinated, review-ready plan. It does <b>not</b> execute workflows or publish anything.</span>
3750:						<p class="aicmd-v2-profile-purpose">Coordinates specialists into one review-ready brief, workflow, or handoff.</p>
3861:		template: asString(tool.template || "Prepare a review-ready draft for {projectName}.")
4068:		? (preview.confirmationRequired ? "Confirmation required" : "Review before route")
4117:					<p class="aicmd-v2-preview-confirmation">${escapeHtml(humanizeValue(preview.safetyLabel, "Guidance only. No backend execution."))}</p>
4151:		? (preview.confirmationRequired ? "Confirmation required" : "Review before route")
4218:						<strong>${escapeHtml(humanizeValue(preview.safetyLabel, "Guidance only. No backend execution."))}</strong>
4225:                                        <span>Choose Draft, Task, Draft Workflow, or Prepare Handoff, then create a preview from the conversation.</span>
4236:                                <div class="aicmd-room-planned-note">This is a review-ready preview. Execution, publishing, approvals, CRM updates, and workflow runs happen only in the destination workspace after confirmation.</div>
4238:                                <div class="aicmd-room-planned-note">No output actions yet. Create a Draft, Task, Draft Workflow, or Prepare Handoff from the conversation first.</div>
4247:	const approval = preview.confirmationRequired ? "Confirmation required" : (preview.outputType ? "Review ready" : "No draft yet");
4441:                                                                <small>Please wait while the specialist prepares a review-ready response.</small>
4520:						data-aicmdv2-prompt-text="${escapeHtml(p.prompt || `${p.label}. ${p.sub}. Prepare this as a review-ready draft only; do not execute anything.`)}"
4610:					<span>Backend owns authority — AI Command prepares guidance and routes. It does not override execution controls.</span>
4666:		description: "Talk to your AI team, run structured tasks, and turn intelligence into action."
5222:                // Phase 1: stages draft locally from conversation context. No backend execution.
5243:                // Phase 1: converts the current conversation into a task preview. No backend execution.

## Focused Operations destination references
public/control-center/pages/ai-command.js:102:                routeHint: "operations-centers"
public/control-center/pages/ai-command.js:253:		destinations: ["Workflows", "Operations Centers", "AI Command"],
public/control-center/pages/ai-command.js:266:		destinations: ["Unified Inbox", "Operations Centers", "Integrations"],
public/control-center/pages/ai-command.js:279:		destinations: ["CRM", "Workflows", "Operations Centers"],
public/control-center/pages/ai-command.js:1270:	if (id === "operations") return outputType === "task" ? "task-center" : "workflows";
public/control-center/pages/ai-command.js:1271:	if (id === "customer_ops") return outputType === "task" ? "task-center" : "operations-centers";
public/control-center/pages/ai-command.js:1313:                return { outputType, destinationRoute: "task-center" };
public/control-center/pages/ai-command.js:1369:		"operations-centers": "Operations Centers",
public/control-center/pages/ai-command.js:1370:		"task-center": "Task Center",
public/control-center/pages/ai-command.js:1717:		destinationRoute: outputType === "task" ? "task-center" : "workflows",
public/control-center/pages/ai-command.js:2355:	"operations-centers": "Operations Centers",
public/control-center/pages/ai-command.js:2356:	"task-center": "Task Center",
public/control-center/pages/ai-command.js:2357:	"queue-center": "Queue Center",
public/control-center/pages/ai-command.js:2358:	"job-monitor": "Job Monitor",
public/control-center/pages/ai-command.js:2359:	"notification-center": "Notification Center",
public/control-center/pages/ai-command.js:2377:	"operations-centers": "operations",
public/control-center/pages/ai-command.js:2378:	"task-center": "operations",
public/control-center/pages/ai-command.js:2379:	"queue-center": "operations",
public/control-center/pages/ai-command.js:2380:	"job-monitor": "operations",
public/control-center/pages/ai-command.js:2381:	"notification-center": "operations",
public/control-center/pages/ai-command.js:2410:	operation: "operations-centers",
public/control-center/pages/ai-command.js:2411:	operations: "operations-centers",
public/control-center/pages/ai-command.js:2412:	tasks: "task-center",
public/control-center/pages/ai-command.js:2413:	queue: "queue-center",
public/control-center/pages/ai-command.js:2414:	jobs: "job-monitor",
public/control-center/pages/ai-command.js:2415:	notifications: "notification-center",
public/control-center/pages/ai-command.js:3555:	if (session?.teamMode === "team") return tool.intent === "task" ? "task-center" : "workflows";
public/control-center/pages/ai-command/tool-dock.js:1044:      frontendOwnerPage: "operations-centers",
public/control-center/pages/ai-command/tool-dock.js:1045:      destinations: ["chat-preview", "operations-centers", "task", "governance"],
public/control-center/pages/ai-command/tool-dock.js:1057:      frontendOwnerPage: "operations-centers",
public/control-center/pages/ai-command/tool-dock.js:1058:      destinations: ["chat-preview", "operations-centers", "task", "workflows"],
public/control-center/pages/ai-command/tool-dock.js:1070:      frontendOwnerPage: "operations-centers",
public/control-center/pages/ai-command/tool-dock.js:1071:      destinations: ["chat-preview", "operations-centers", "task", "workflows"],
public/control-center/pages/ai-command/tool-dock.js:1083:      frontendOwnerPage: "operations-centers",
public/control-center/pages/ai-command/tool-dock.js:1084:      destinations: ["chat-preview", "operations-centers", "workflows", "sales-crm-draft"],
public/control-center/pages/ai-command/tool-dock.js:1139:      destinations: ["chat-preview", "workflows", "operations-centers", "sales-crm-draft"],

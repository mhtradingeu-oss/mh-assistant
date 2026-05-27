# Authority and Execution Safety Evidence

## AI Command execution / safety markers
26:        executeProjectAiChat,
27:        executeProjectAiGuidance
63:                id: "publisher",
67:                routeHint: "publishing"
87:                summary: "Claims review, approvals, safety language, and governance checks.",
94:                summary: "Tasks, timelines, handoffs, approvals, and execution plans.",
124:	publisher: "publisher",
160:		canHelp: ["Draft captions and hooks", "Write email copy", "Create landing page text", "Prepare publisher handoff", "Suggest message variants"],
163:		safetyNote: "Drafts require review before publishing. Cannot approve or publish without confirmation.",
189:		safetyNote: "Scripts and direction only. Video generation requires explicit backend action and approval.",
193:		id: "publisher",
198:		placeholder: "Ask the Publisher to review publishing readiness, check scheduling, or prepare a handoff package…",
199:		canHelp: ["Review publishing readiness", "Check scheduled jobs", "Prepare handoff packages", "Map publishing dependencies", "Flag pre-publish risks"],
200:		cannotDo: ["Publish without explicit approval", "Override schedules", "Bypass governance gates", "Send to live channels directly"],
202:		safetyNote: "Publishing always requires explicit approval. No live publishing from AI guidance alone.",
215:		safetyNote: "Ad concepts and copy only. Live ad actions require platform integration and explicit approval.",
236:		summary: "Claims review, approval safety, publishing risk, and governance notes.",
237:		placeholder: "Ask the Compliance Reviewer to check claims, approval risks, publishing safety, and governance notes…",
238:		canHelp: ["Review marketing claims", "Flag approval risks", "Check publishing safety", "Prepare governance notes", "Identify compliance blockers"],
239:		cannotDo: ["Grant approvals directly", "Override governance gates", "Publish on behalf of approvers", "Remove flags without review"],
249:		summary: "Tasks, timelines, handoffs, approvals, and execution plans.",
311:	publisher: [
312:		{ label: "Review publishing readiness", sub: "Check what is ready to publish" },
313:		{ label: "Flag pre-publish risks", sub: "Identify what needs review first" },
330:		{ label: "Check claims for approval", sub: "Review all marketing claims" },
331:		{ label: "Flag publishing risks", sub: "Identify blockers before release" },
333:		{ label: "Review approval requirements", sub: "What needs sign-off" }
359:	{ label: "Prepare a full handoff sequence", sub: "Strategy, creative, compliance, publishing, ops" },
390:	publisher: "PB",
410:		summary: "Policy, approvals, roles, and audit controls stay destination-owned."
437:		{ id: "publisher-package", label: "Publisher Package", action: "preview", intent: "handoff", template: "Prepare a Publisher handoff for {project}. Include German copy package, CTA, notes, and remaining checks." }
453:	publisher: [
454:		{ id: "publishing-checklist", label: "Publishing Checklist", action: "preview", intent: "handoff", template: "Build a publishing checklist for {project}. Include German copy, assets, claims checks, and channel readiness." },
455:		{ id: "final-packaging", label: "Final Packaging", action: "preview", intent: "handoff", template: "Prepare a final publishing package for {project}. Include copy, CTA, asset notes, approvals, and destination channel." },
457:		{ id: "schedule-draft", label: "Schedule Draft", action: "preview", intent: "workflow", template: "Prepare a publishing schedule draft for {project}. Include channel cadence, dependencies, and review gates." },
458:		{ id: "open-publishing", label: "Open Publishing", action: "route", route: "publishing" }
476:		{ id: "approval-flags", label: "Approval Flags", action: "preview", intent: "task", template: "Check approval risks for {project}. List risk, impact, mitigation, and required owner." },
477:		{ id: "safety-checklist", label: "Safety Checklist", action: "preview", intent: "handoff", template: "Prepare a safety checklist for {project}. Include policy checks, evidence required, and approval notes." },
478:		{ id: "publish-readiness", label: "Publish Readiness", action: "preview", intent: "handoff", template: "Review publish readiness for {project}. Confirm what needs human approval before release." },
633:		if (/act as the publisher/i.test(text)) return "publisher";
674:	if (/publish\s*now|send\s*external|paid\s*ads|final\s*approval/i.test(command)) {
677:			type: "publish_now",
678:			targetPage: "publishing",
682:				reason: "Requires approval gate before external publishing actions."
697:	if (/act as the publisher/i.test(text)) return "publisher";
869:		overview.publishing_language ||
870:		overview.publish_language ||
875:	const publishLanguage = configuredPublishLanguage || "German";
885:		publishLanguage,
1081:function getAiResponseBridgeStatus(executeProjectAiGuidanceFn) {
1082:	if (typeof executeProjectAiGuidanceFn !== "function") {
1206:                `Use ${safeOutputLanguage} only for customer-facing or publishable copy such as captions, ads, emails, landing pages, final campaign text, or publishing packages.`,
1207:                "When you include publishable copy, label it clearly as publishable content and keep the explanation in the user chat language.",
1210:		`When drafting publishable copy, write it in ${safeOutputLanguage}.`,
1212:		"Never claim publish, approval, deletion, archival, sync, or operational runs happened.",
1266:	if (id === "publisher") return "publishing";
1303:        const looksWorkflowLike = /\b(workflow|workflows|process|sequence|phase|phases|approval flow|automation|operating loop|step-by-step|steps|dependencies|trigger|review gate|execution flow)\b/.test(text);
1306:        const looksPublishingLike = /\b(publish|publishing|schedule|channel package|channel payload|approval-ready post|final post|ready to publish|publishing package)\b/.test(text);
1307:        const looksGovernanceLike = /\b(compliance|governance|claim|claims|risk|risks|approval|approvals|policy|privacy|legal|safe language|safety review)\b/.test(text);
1331:        if (/publishing|publish|schedule/.test(outputType) || looksPublishingLike) {
1332:                outputType = "publishing";
1333:                return { outputType, destinationRoute: explicitDestination || "publishing" };
1336:        if (/governance|compliance|risk|approval/.test(outputType) || looksGovernanceLike) {
1364:		publishing: "Publishing",
1391:		confirmationRequired: outputType === "handoff" || specialistId === "publisher" || specialistId === "compliance_reviewer",
1395:		safetyLabel: "Guidance and draft only. No backend execution.",
1397:		confirmationNote: "Execution, approvals, and publishing require explicit confirmation in the owning workspace."
1434:				"Outcome-led hook direction for a German publishing draft",
1447:				"Use Arabic freely in the conversation; publishable copy should be reviewed in German.",
1448:				"Claims, health, or performance promises need evidence before publishing."
1457:			safetyLabel: "Claims require review before publishing. No direct publish action."
1496:	if (specialistId === "publisher") {
1503:				"Publishing remains gated until channel, approval, and asset readiness are confirmed."
1507:				"Draft publish schedule by channel",
1508:				"Flag approval dependencies",
1509:				"Prepare handoff for publishing review"
1512:			safetyLabel: "Confirmation required before publish. No publish action performed."
1570:			safetyLabel: "Compliance review is advisory. Formal approval remains human-governed."
1667:			safetyLabel: "No workflow run and no backend task creation executed."
1705:			"Compliance and Publisher verify claims, approvals, formatting, and release readiness",
1712:			"Compliance: flag claims, evidence needs, policy risks, and approval gates",
1713:			"Publisher: package channel-ready copy, assets, schedule notes, and publish checks",
1719:		confirmationNote: "No task, workflow, outreach, customer reply, CRM update, approval, or publishing action is executed from Full Team mode.",
1969:		operations: ["task plan", "workflow", "handoff", "approval", "timeline", "execution plan", "route", "publish", "status", "priority", "priorities", "blocking", "blocker", "readiness", "next", "do next"],
1986:	const actionRouting = /launch|build|reconnect|connect|improve|create|fix|route|plan|publish/.test(query);
2073:			top ? `Reuse the pattern from ${extractTopMessage(top)} in the next publishing cycle.` : "Sync social insights to identify winning hooks and formats.",
2084:			routeSuggestion("Publishing", "publishing", "Schedule the next batch with stronger timing and approval control."),
2197:		return { title: "Campaign launch task block", owner: "Campaign Studio", steps: ["Define the campaign objective, audience, and offer.", "Choose channels and budget based on current intelligence.", "List required assets and publishing dependencies before launch."] };
2203:		return { title: "Content repair task block", owner: "Content Studio", steps: ["Select the weakest items from Insights.", "Rewrite hooks, sharpen CTAs, and adjust format-platform fit.", "Republish only after updated versions are approved."] };
2218:		routeSuggestions.push(routeSuggestion("Publishing", "publishing", "Schedule or approve if the next step is publishing."));
2347:	publishing: "Publishing",
2369:	publishing: "publisher",
2403:	publish: "publishing",
2404:	publisher: "publishing",
2520:		safetyLabel: firstAiInboundText(preview.safetyLabel, preview.safety_label, "Guidance and draft only. No backend execution."),
2521:		confirmationNote: firstAiInboundText(preview.confirmationNote, preview.confirmation_note, "Execution, approvals, publishing, CRM updates, customer replies, and workflow runs require explicit confirmation in the owning workspace."),
2591:	)) || `Review this ${sourceLabel} handoff for ${projectLabel}. Identify the right specialist, summarize the context, produce a review-ready draft, and recommend the next safe route. Do not execute publishing, task creation, CRM updates, customer replies, workflow runs, or backend actions.`;
2631:		note: "Guidance only. No publishing, task creation, CRM updates, customer replies, workflow runs, exports, or backend actions are executed from this handoff."
2700:	executeProjectAiCommand,
2705:	if (typeof executeProjectAiCommand !== "function") throw new Error("AI command service is unavailable.");
2713:		result = await executeProjectAiCommand(projectName, {
3377:        preview.safetyLabel = preview.safetyLabel || "Conversation converted into a review-ready draft. No backend action executed.";
3646:					<strong>${escapeHtml(languagePlan.publishLanguage)}</strong>
3683:			<span>Full Team prepares a coordinated, review-ready plan. It does <b>not</b> execute workflows or publish anything.</span>
3797:        if (roleId === "publisher") return `${label} is preparing publishing guidance...`;
3809:		? "Team orchestration across strategy, writing, media/video, compliance, publishing, customer operations, sales/CRM, and operations"
3953:			<span class="aicmd-v2-lang-chip" title="Publishing language">📝 ${escapeHtml(languagePlan.publishLanguage)}</span>
4029:				<div class="aicmd-v2-composer-hint">Draft/review only · suggested prompts prefill this composer · execution happens in the owning workspace after confirmation.</div>
4117:					<p class="aicmd-v2-preview-confirmation">${escapeHtml(humanizeValue(preview.safetyLabel, "Guidance only. No backend execution."))}</p>
4183:                                        <span><strong>Language</strong>${escapeHtml(languagePlan.publishLanguage)}</span>
4218:						<strong>${escapeHtml(humanizeValue(preview.safetyLabel, "Guidance only. No backend execution."))}</strong>
4236:                                <div class="aicmd-room-planned-note">This is a review-ready preview. Execution, publishing, approvals, CRM updates, and workflow runs happen only in the destination workspace after confirmation.</div>
4247:	const approval = preview.confirmationRequired ? "Confirmation required" : (preview.outputType ? "Review ready" : "No draft yet");
4256:			<div><span>Approval</span><strong>${escapeHtml(approval)}</strong></div>
4326:                ? "Chat only. No workflow, task, handoff, approval, publish, CRM, or customer action was created."
4543:		{ label: "Publishing language", value: languagePlan.publishLanguage, present: true },
4606:					<span>Publishing, approval, and workflow runs require your explicit confirmation in the right workspace.</span>
4681:			executeProjectAiCommand,
4745:		const bridgeStatus = getAiResponseBridgeStatus(executeProjectAiChat);
5098:		                        const result = await executeProjectAiChat(projectName, {
5107:		                                outputLanguage: languagePlan.publishLanguage,
5109:		                                marketLanguage: languagePlan.publishLanguage,
5116:		                                safetyInstruction: "Chat only. No task/workflow/handoff/approval/publish/customer/CRM execution.",
5201:		                        updateStatus("Specialist reply generated. No workflow/task/handoff was created.");
5222:                // Phase 1: stages draft locally from conversation context. No backend execution.
5243:                // Phase 1: converts the current conversation into a task preview. No backend execution.
5283:                                updateStatus("Workflow draft preview prepared from conversation context. No workflow run started.");
5290:                // Phase 1: converts the current conversation into a handoff preview. No backend write.

## Publishing high-risk markers
9:  const approval = selectedItem?.approvalStatus ? titleCase(selectedItem.approvalStatus) : "Draft";
11:  const safety = `Publishing prepares channel packages, schedules, and approval-ready handoffs. Final execution remains <strong>confirmation-gated</strong> and governed by <strong>backend approval rules</strong>.`;
13:    `<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingBuilderPanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Prepare Publishing Package</button>`,
14:    `<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingQueuePanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Open Queue</button>`,
15:    `<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingHandoffPanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Review Approval Gate</button>`,
16:    `<button type="button" class="btn btn-primary" onclick="document.getElementById('publishingPushAiBtn')?.scrollIntoView({behavior:'smooth',block:'start'})">Open AI Review</button>`
19:    <section class="publishing-command-header" role="region" aria-label="Publishing Command Header">
20:      <div class="publishing-command-header-title">Publishing Control Workspace</div>
21:      <div class="publishing-command-header-context">${context}</div>
22:      <div class="publishing-command-header-status">Status: <strong>${escapeHtml(status)}</strong> &middot; Approval: <strong>${escapeHtml(approval)}</strong></div>
23:      <div class="publishing-command-header-status">Next: <span>${nextAction}</span></div>
24:      <div class="publishing-command-header-safety">${safety}</div>
25:      <div class="publishing-command-header-actions">${actions}</div>
30:function renderPublishingWorkflowStrip({ selectedItem, recommendation, blockers, approvalState, escapeHtml }) {
35:    { key: "approval", label: "Approval" },
36:    { key: "schedule", label: "Schedule" },
43:    approval: selectedItem?.approvalStatus === "approved" ? "ready" : selectedItem?.approvalStatus === "needs approval" ? "warning" : "missing",
44:    schedule: selectedItem?.status === "scheduled" ? "ready" : "missing",
45:    handoff: selectedItem?.status === "published" ? "ready" : "missing"
48:    <nav class="publishing-workflow-strip" aria-label="Publishing Workflow">
50:        <div class="publishing-workflow-step is-${statusMap[step.key]}" aria-label="${escapeHtml(step.label)}: ${statusMap[step.key]}">
52:          <span class="publishing-workflow-step-label">${statusMap[step.key]}</span>
65:    { key: "schedule", label: "Schedule", state: selectedItem?.scheduledFor ? "ready" : "missing" },
67:    { key: "approval", label: "Approval", state: selectedItem?.approvalStatus === "approved" ? "ready" : selectedItem?.approvalStatus === "needs approval" ? "warning" : "missing" }
69:  const blockersSummary = blockers && blockers.length ? `<div class="publishing-readiness-card is-warning">${escapeHtml(blockers.length)} blocker(s) present</div>` : "";
71:    <section class="publishing-readiness-summary" aria-label="Publishing Readiness Summary">
73:        <div class="publishing-readiness-card is-${r.state}">
74:          <span class="publishing-readiness-card-label">${escapeHtml(r.label)}</span>
102:} from "./publishing/publishing-payloads.js";
104:const publishingSessions = new Map();
105:const PUBLISHING_LOCAL_DRAFTS_KEY = "mh-publishing-local-drafts-v1";
106:const STATUS_FILTERS = ["all", "draft", "ready", "needs approval", "scheduled", "published", "failed"];
107:const DISPLAY_STATUSES = ["draft", "ready", "needs approval", "scheduled", "published", "failed"];
109:const APPROVAL_STATUSES = ["draft", "needs approval", "approved"];
120:const publishingAutomationState = {
124:let publishingAutoModeUnsubscribe = null;
125:let publishingAutoModeControllerReady = false;
126:let publishingAutomationEnabled = false;
127:let publishingRenderCallback = null;
128:let publishingRenderTimer = null;
130:function schedulePublishingRender(render) {
132:    publishingRenderCallback = render;
135:  if (publishingRenderTimer) {
139:  publishingRenderTimer = window.setTimeout(() => {
140:    publishingRenderTimer = null;
142:    if (typeof publishingRenderCallback === "function") {
143:      publishingRenderCallback();
148:function ensurePublishingAutoModeBinding(getState, navigateTo, render) {
149:  publishingRenderCallback = render;
151:  if (!publishingAutomationEnabled) {
155:  if (!publishingAutoModeControllerReady) {
156:    createAutoModeController(getState, { getState, navigateTo });
157:    publishingAutoModeControllerReady = true;
160:  if (publishingAutoModeUnsubscribe) {
164:  publishingAutoModeUnsubscribe = subscribeAutoMode(() => {
172:    schedulePublishingRender();
229:function formatDateTime(value, fallback = "Not scheduled") {
242:  if (!date) return "Unscheduled";
272:  if (["ready", "approved", "ready_for_manual_publish", "ready_for_manual_send"].includes(normalized)) return "ready";
273:  if (["needs approval", "needs_approval", "approval", "pending_approval", "review", "in_review"].includes(normalized)) {
274:    return "needs approval";
276:  if (["scheduled", "queued", "queue", "pending", "pending_publish"].includes(normalized)) return "scheduled";
277:  if (["published", "completed", "complete", "success", "done", "sent", "live"].includes(normalized)) return "published";
284:  if (status === "published") return "success";
285:  if (status === "ready" || status === "scheduled") return "warning";
325:    id: asString(draft.id || `local-publish-${Date.now()}`),
355:    publishDate: toDateInput(tomorrow),
356:    publishTime: "09:00",
357:    approvalStatus: "draft",
365:  if (!publishingSessions.has(key)) {
366:    publishingSessions.set(key, {
377:  return publishingSessions.get(key);
395:  if (item.campaign) return `${item.campaign} ${titleCase(item.channel || "publish")}`;
396:  if (context.activeCampaign) return `${context.activeCampaign} ${titleCase(item.channel || "publish")}`;
403:  const scheduledFor = firstText(raw.scheduled_for, raw.scheduledFor);
404:  const status = normalizeStatus(raw.execution_status || raw.status, scheduledFor ? "scheduled" : "draft");
414:    scheduledFor,
415:    executedAt: firstText(raw.executed_at, raw.executedAt),
416:    createdAt: firstText(raw.created_at, raw.createdAt, raw.executed_at),
417:    updatedAt: firstText(raw.updated_at, raw.updatedAt, raw.executed_at, raw.created_at),
418:    approvalStatus: status === "ready" ? "approved" : status === "needs approval" ? "needs approval" : "draft",
436:    .sort((a, b) => (toDate(b.executed_at)?.getTime() || 0) - (toDate(a.executed_at)?.getTime() || 0));
444:  const scheduledItems = asArray(activity.scheduled_jobs).map((job) => {
457:  const knownIds = new Set(scheduledItems.map((item) => item.jobId));
463:  const backendIds = new Set([...scheduledItems, ...orphanResults].map((item) => item.id));
466:  return [...visibleLocalDrafts, ...scheduledItems, ...orphanResults].sort(compareQueueItems);
473:    "needs approval": 2,
474:    scheduled: 3,
476:    published: 5
481:  const aTime = toDate(a.scheduledFor || a.updatedAt || a.createdAt)?.getTime() || 0;
482:  const bTime = toDate(b.scheduledFor || b.updatedAt || b.createdAt)?.getTime() || 0;
515:    .filter((item) => item.scheduledFor && ["scheduled", "ready"].includes(item.status))
516:    .sort((a, b) => (toDate(a.scheduledFor)?.getTime() || 0) - (toDate(b.scheduledFor)?.getTime() || 0))[0];
517:  return next ? `${formatDateTime(next.scheduledFor)} - ${next.title}` : "No scheduled window";
529:    publishDate: toDateInput(item.scheduledFor),
530:    publishTime: toTimeInput(item.scheduledFor),
531:    approvalStatus: item.approvalStatus || "draft",
559:  const date = clean(form.publishDate);
561:  return `${date}T${clean(form.publishTime) || "09:00"}:00Z`;
568:    "Prepare publishing draft from current project context."
573:      id: `publishing-prepare-${Date.now()}`,
574:      type: "prepare_publishing_draft",
575:      targetPage: "publishing",
576:      action: "Prepare publishing draft",
579:        reason: "Prepare a safe publishing draft without executing publish.",
580:        title: firstText(session.form.title, "Prepared publishing draft")
585:      id: `publishing-gate-${Date.now()}`,
586:      type: "publish_now",
587:      targetPage: "publishing",
591:        reason: "Publishing is gated and requires manual approval."
606:  if (["schedule", "publish", "retry"].includes(intent) && !clean(form.publishDate)) {
607:    errors.publishDate = "Publish date is required for this action.";
609:  if (intent === "publish" && form.approvalStatus !== "approved") {
610:    errors.approvalStatus = "Approval must be approved before publishing now.";
626:function guardPublishingAssetBlockers(session, assetBlockers, showMessage, actionLabel = "this publishing action") {
630:  const message = `Publishing blocker(s) must be resolved before ${actionLabel}: ${summary || "required publishing assets are missing or need review"}.`;
636:function confirmPublishingBackendAction(message) {
637:  if (typeof window === "undefined" || typeof window.confirm !== "function") return true;
638:  return window.confirm(message);
643:  return message ? `<div class="publishing-inline-error">${escapeHtml(message)}</div>` : "";
647:  // Add governance/approval hints for status pills
649:  if (status === "needs approval") {
652:    hint = "title=\"Prepare Governance Review. Backend approval rules apply.\" aria-label=\"Prepare Governance Review. Backend approval rules apply.\"";
653:  } else if (status === "scheduled") {
656:  return `<span class="publishing-status-pill is-${escapeHtml(statusClass(status))}" ${hint}>${escapeHtml(titleCase(status))}</span>`;
662:      .publishing-execution-center {
668:      .publishing-execution-grid {
674:      .publishing-main-column,
675:      .publishing-side-column {
682:      .publishing-card {
687:      .publishing-overview-grid {
693:      .publishing-overview-item,
694:      .publishing-impact-chip {
702:      .publishing-overview-item span,
703:      .publishing-impact-chip small {
710:      .publishing-overview-item strong,
711:      .publishing-impact-chip strong {
717:      .publishing-overview-item.is-wide {
721:      .publishing-impact-row,
722:      .publishing-action-row,
723:      .publishing-form-actions,
724:      .publishing-filter-row {
731:      .publishing-impact-row {
735:      .publishing-action-row,
736:      .publishing-form-actions {
740:      .publishing-action-row .btn,
741:      .publishing-form-actions .btn {
747:      .publishing-impact-chip {
751:      .publishing-filter-chip {
764:      .publishing-filter-chip.is-active {
770:      .publishing-queue-list,
771:      .publishing-calendar-list,
772:      .publishing-blocker-list {
779:      .publishing-queue-row {
790:      .publishing-queue-row.is-active {
795:      .publishing-queue-main,
796:      .publishing-calendar-row {
807:      .publishing-queue-title {
815:      .publishing-queue-meta {
824:      .publishing-queue-actions {
831:      .publishing-queue-actions button {
843:      .publishing-queue-actions button:focus-visible,
844:      .publishing-queue-main:focus-visible,
845:      .publishing-calendar-row:focus-visible,
846:      .publishing-filter-chip:focus-visible {
851:      .publishing-queue-actions button:disabled,
852:      .publishing-queue-actions button[disabled] {
860:      .publishing-status-pill {
873:      .publishing-status-pill.is-ready,
874:      .publishing-status-pill.is-scheduled {
878:      .publishing-status-pill.is-published {
882:      .publishing-status-pill.is-failed {
886:      .publishing-inline-error {
893:      .publishing-calendar-row {
904:      .publishing-calendar-row em {
913:        .publishing-execution-grid {
918:        .publishing-queue-row {
923:        .publishing-queue-actions {
957:    getSharedHandoff(projectName, "publishing", operations, "workflows") ||
958:    getSharedHandoff(projectName, "publishing", operations, "ai-command") ||
959:    getSharedHandoff(projectName, "publishing", operations)
970:  const needsApproval = queue.find((item) => item.status === "needs approval");
977:      action: "Retry failed publishing item",
978:      why: `${failed.title} is blocked or failed. Clear the blocker before adding more scheduled work.`,
992:      action: "Review approval queue",
993:      why: `${needsApproval.title} needs approval before it can move into the publishable queue.`,
1008:      action: "Complete and schedule a draft",
1009:      why: `${draft.title} is not yet executable. Add channel, content, approval, and timing details.`,
1015:    action: connectedCount ? "Create a publishing draft" : "Connect a publishing channel",
1017:      ? "No queue item is ready. Start with a draft and save it locally until it can be scheduled."
1026:    <section class="card publishing-card">
1034:      <div class="publishing-overview-grid">
1035:        <div class="publishing-overview-item"><span>Scheduled items</span><strong>${escapeHtml(String(counts.scheduled))}</strong></div>
1036:        <div class="publishing-overview-item"><span>Ready to publish</span><strong>${escapeHtml(String(counts.ready))}</strong></div>
1037:        <div class="publishing-overview-item"><span>Draft items</span><strong>${escapeHtml(String(counts.draft))}</strong></div>
1038:        <div class="publishing-overview-item"><span>Failed / blocked items</span><strong>${escapeHtml(String(counts.failed))}</strong></div>
1039:        <div class="publishing-overview-item is-wide"><span>Next publish window</span><strong>${escapeHtml(getNextPublishWindow(queue))}</strong></div>
1047:    ["Launch readiness", counts.ready + counts.scheduled > 0 ? "Active" : "Needs queue"],
1048:    ["Content", counts.draft || counts.ready || counts.scheduled ? "Present" : "Empty"],
1051:    ["Approval", counts["needs approval"] ? "Pending" : counts.ready ? "Approved" : "Draft"],
1052:    ["Automation", counts.scheduled ? "Scheduled" : "Manual"]
1056:    <section class="card publishing-card" id="publishingRecommendation">
1061:          <p class="publishing-section-copy">${escapeHtml(recommendation.why)}</p>
1065:      <div class="publishing-impact-row">
1067:          <span class="publishing-impact-chip">
1073:      <div class="publishing-action-row">
1074:        <button id="publishingOpenQueueBtn" class="btn btn-secondary" type="button">Open Publish Queue</button>
1075:        <button id="publishingSaveDraftBtn" class="btn btn-secondary" type="button">Save publishing draft</button>
1076:        <button id="publishingPushAiBtn" class="btn btn-primary" type="button">Send publishing context to AI</button>
1077:        <button id="publishingAutoPrepareBtn" class="btn btn-secondary" type="button">Auto-prepare publishing plan</button>
1078:        <button id="publishingAutoStopBtn" class="btn btn-secondary" type="button">Stop Auto Mode</button>
1080:      <details class="publishing-automation-preview publishing-block-gap">
1082:        <div class="publishing-automation-preview-copy">Automation cannot publish without manual review, confirmation, and backend approval gates.</div>
1083:        <div class="simple-banner publishing-inline-gap">Auto Mode status: ${escapeHtml(getAutoModeState().status || "idle")}</div>
1085:          <div class="simple-banner publishing-block-gap">Cross-system blockers: ${escapeHtml(asArray(recommendation.externalBlockers).map((item) => item.title).join("; "))}</div>
1087:        ${publishingAutomationState.progress ? `<div class="simple-banner publishing-block-gap">${escapeHtml(publishingAutomationState.progress)}</div>` : ""}
1088:        ${publishingAutomationState.result ? `<div class="simple-banner publishing-inline-gap">${escapeHtml(publishingAutomationState.result)}</div>` : ""}
1089:        ${getAutoModeState().status === "waiting_approval" ? `
1090:          <div class="simple-banner publishing-inline-gap"><strong>Approval needed:</strong> ${escapeHtml(asObject(getAutoModeState().approvalRequiredStep).reason || "Manual approval required.")}</div>
1091:          <div class="publishing-action-row publishing-inline-gap">

## Workflow high-risk markers
22:  approveCurrentGate,
26:  runAutomationPlan
100:  "run-weekly-report": "generate-report",
104:const WORKFLOW_LOCAL_DRAFTS_KEY = "mh-workflow-local-drafts-v1";
106:const workflowSessions = new Map();
108:let workflowBridgeRegistered = false;
109:let workflowAutoModeUnsubscribe = null;
110:let workflowAutomationEnabled = false;
111:const workflowAutomationState = {
174:  if (["running", "in_progress", "processing", "queued", "scheduled", "pending"].includes(normalized)) return "running";
181:  const runStatus = normalizeRunStatus(status);
182:  if (runStatus === "completed") return "success";
183:  if (runStatus === "running") return "warning";
184:  if (runStatus === "failed") return "danger";
214:    runId: "",
224:  return WORKFLOW_CATALOG.reduce((acc, workflow) => {
225:    acc[workflow.id] = createEmptyRunState();
231:  return WORKFLOW_CATALOG.reduce((acc, workflow) => {
232:    acc[workflow.id] = {
243:    String(operations?.workflows?.total_runs || 0),
271:function saveLocalDraft(projectName, workflowId, payload) {
275:  projectDrafts[workflowId] = {
276:    ...asObject(projectDrafts[workflowId]),
282:  return projectDrafts[workflowId];
288:  WORKFLOW_CATALOG.forEach((workflow) => {
289:    const draft = asObject(local[workflow.id]);
291:    session.inputsByWorkflow[workflow.id] = {
292:      ...session.inputsByWorkflow[workflow.id],
296:      session.selectedWorkflowId = workflow.id;
305:function persistWorkflowDraft(projectName, session, workflowId, hint, selected) {
306:  const saved = saveLocalDraft(projectName, workflowId, {
307:    inputs: asObject(session.inputsByWorkflow[workflowId]),
308:    workflowId,
316:  if (!workflowSessions.has(key)) {
317:    workflowSessions.set(key, {
320:      runsByWorkflow: createRunsMap(),
338:    const session = workflowSessions.get(key);
339:    session.inputsByWorkflow = WORKFLOW_CATALOG.reduce((acc, workflow) => {
340:      acc[workflow.id] = {
342:        ...asObject(session.inputsByWorkflow?.[workflow.id])
346:    session.runsByWorkflow = session.runsByWorkflow || createRunsMap();
363:  const session = workflowSessions.get(key);
374:  asArray(operations?.workflows?.items).forEach((item) => {
375:    const sourceId = asString(item.workflow_id);
383:      runId: asString(item.id),
384:      source: asString(item.source || "durable-run"),
391:          source: asString(item.source || "durable-run"),
398:  session.runsByWorkflow = nextRuns;
453:  const allRuns = Object.values(asObject(session.runsByWorkflow));
459:    running: 0,
463:  allRuns.forEach((run) => {
464:    const normalized = normalizeRunStatus(run.status);
466:    else if (normalized === "running") counts.running += 1;
470:    if (asString(run.lastRunAt) && (!counts.lastExecutionAt || Date.parse(run.lastRunAt) > Date.parse(counts.lastExecutionAt))) {
471:      counts.lastExecutionAt = run.lastRunAt;
476:    const when = asString(item.executed_at || item.created_at);
485:function getBlockedRequirements(workflow, inputs, context) {
487:  const missingRequired = workflow.requiredInputs.filter((field) => !asString(inputs[field]).trim());
492:  if (workflow.id === "prepare-publishing-package" && context.missingAssets.length) {
496:  if (workflow.id === "generate-report" && context.missingIntegrations.length) {
500:  if (workflow.id === "fix-integrations" && !context.missingIntegrations.length) {
501:    blocked.push("No integration gaps detected. Use this workflow only if connectors are unstable.");
507:function buildWorkflowPrompt(workflow, inputs, context) {
509:    `Workflow: ${workflow.title}`,
510:    `Purpose: ${workflow.purpose}`,
522:function buildFallbackOutput(workflow, inputs, context) {
525:  const blockedRequirements = getBlockedRequirements(workflow, inputs, context);
528:    title: `${workflow.title} execution package`,
529:    summary: `Prepared ${workflow.title.toLowerCase()} for ${inputs.project || context.projectName || "the current project"} with ${inputs.goal || "a defined goal"}.`,
532:      `Open ${titleCase(workflow.routeHint)} for execution handoff.`,
536:    requiredInputs: workflow.requiredInputs.map(titleCase),
539:        label: `Open ${titleCase(workflow.routeHint)}`,
540:        route: workflow.routeHint,
541:        reason: `Continue execution in ${titleCase(workflow.routeHint)}.`
546:        reason: "Refine this workflow package with AI reasoning."
567:      workflowId: mapped.id,
577:      workflowId: "fix-integrations",
581:      prompt: "Build a prioritized integration recovery workflow with dependency order and expected readiness impact."
587:      workflowId: "prepare-publishing-package",
597:      workflowId: "launch-campaign",
598:      title: "Define launch campaign workflow",
599:      reason: "A campaign operating sequence is required before content, media, and publishing lanes can execute clearly.",
601:      prompt: "Create a launch campaign workflow with owner sequence and execution gates."
607:    workflowId: selected.id,
609:    reason: "Current context is sufficient to run the selected execution workflow now.",
625:        <article class="wfexec-stat"><span>Total workflows</span><strong>${escapeHtml(String(metrics.total))}</strong></article>
626:        <article class="wfexec-stat"><span>Ready workflows</span><strong>${escapeHtml(String(metrics.ready))}</strong></article>
627:        <article class="wfexec-stat"><span>Draft workflows</span><strong>${escapeHtml(String(metrics.draft))}</strong></article>
663:  const gate = asObject(autoMode?.approvalRequiredStep);
669:        Safe execution only: navigate, create draft, generate prompt, and create handoff.
698:        <button id="workflowRunFullAutomationBtn" class="wfexec-btn wfexec-btn-primary" type="button">
701:        <button id="workflowRunStepAutomationBtn" class="wfexec-btn wfexec-btn-secondary" type="button">
706:      <div id="workflowAutomationProgress" class="wfexec-meta">
707:        ${esc(workflowAutomationState.progress || "")}
710:      <div id="workflowAutomationResult" class="wfexec-meta">
711:        ${esc(workflowAutomationState.result || "")}
719:        Hands-free safe execution with approval gates and inline logs.
723:        <button id="workflowAutoStartBtn" class="wfexec-btn wfexec-btn-primary" type="button">
726:        <button id="workflowAutoPauseBtn" class="wfexec-btn wfexec-btn-secondary" type="button">
729:        <button id="workflowAutoResumeBtn" class="wfexec-btn wfexec-btn-secondary" type="button">
732:        <button id="workflowAutoStopBtn" class="wfexec-btn wfexec-btn-ghost" type="button">
751:              <strong>Approval needed:</strong> ${esc(gate.reason || "Manual approval required.")}
754:              ${esc(gate.whatWillHappen || "Auto Mode is paused.")}
757:              <button id="workflowAutoApproveBtn" class="wfexec-btn wfexec-btn-secondary" type="button">
760:              <button id="workflowAutoSkipBtn" class="wfexec-btn wfexec-btn-secondary" type="button">
780:function renderBuilderSection(session, workflow, inputs, validationMessage, draftStatus, escapeHtml) {
788:            ${WORKFLOW_CATALOG.map((item) => `<option value="${escapeHtml(item.id)}"${item.id === workflow.id ? " selected" : ""}>${escapeHtml(item.title)}</option>`).join("")}
814:        <button id="workflowRunBtn" class="wfexec-btn wfexec-btn-primary" type="button">Prepare Workflow Package</button>
815:        <button id="workflowRunBtnMain" class="wfexec-btn wfexec-btn-primary" type="button">Prepare</button>
820:      <div class="wfexec-draft-status">${escapeHtml(draftStatus || "Drafts auto-save locally per workflow.")}</div>
830:        ${WORKFLOW_CATALOG.map((workflow) => {
831:          const inputs = asObject(session.inputsByWorkflow[workflow.id]);
832:          const run = asObject(session.runsByWorkflow[workflow.id]);
833:          const blocked = getBlockedRequirements(workflow, inputs, context);
836:            <article class="wfexec-catalog-card${workflow.id === session.selectedWorkflowId ? " is-active" : ""}">
838:                <h4>${escapeHtml(workflow.title)}</h4>
841:              <p>${escapeHtml(workflow.purpose)}</p>
842:              <div class="wfexec-required"><strong>Required inputs:</strong> ${escapeHtml(workflow.requiredInputs.map(titleCase).join(", "))}</div>
843:              <div class="wfexec-required"><strong>Readiness status:</strong> ${escapeHtml(ready ? "Ready to run" : blocked[0])}</div>
845:                <button class="wfexec-btn wfexec-btn-primary" type="button" data-wf-catalog-run="${escapeHtml(workflow.id)}">Prepare</button>
846:                <button class="wfexec-btn wfexec-btn-ghost" type="button" data-wf-catalog-save="${escapeHtml(workflow.id)}">Save Draft</button>
847:                <button class="wfexec-btn wfexec-btn-secondary" type="button" data-wf-catalog-ai="${escapeHtml(workflow.id)}">Open in AI Command</button>
849:              ${run.lastRunAt ? `<div class="wfexec-catalog-meta">Last run ${escapeHtml(formatDateTime(run.lastRunAt))}</div>` : ""}
858:function renderExecutionSection(run, workflow, blockedRequirements, escapeHtml) {
859:  const output = asObject(run.output);
864:        <div class="wfexec-empty">No prepared package yet. Prepare a workflow package to generate a review-ready output.</div>
873:        <span class="wfexec-meta">${escapeHtml(run.lastRunAt ? formatDateTime(run.lastRunAt) : "recent")}</span>
889:        <button id="workflowPushAiBtn" class="wfexec-btn wfexec-btn-secondary" type="button">Refine in AI Command</button>
890:        <button id="workflowPushAiBtnSecondary" class="wfexec-btn wfexec-btn-secondary" type="button">Open in AI Command</button>
891:        <button id="workflowSaveTaskBtn" class="wfexec-btn wfexec-btn-ghost" type="button">Prepare Task Handoff</button>
892:        <button id="workflowBuildCustomBtn" class="wfexec-btn wfexec-btn-ghost" type="button">Build Custom Workflow</button>
893:        <button id="workflowRecommendBtn" class="wfexec-btn wfexec-btn-ghost" type="button">Recommend Workflow</button>
895:      <div class="wfexec-meta">Workflow: ${escapeHtml(workflow.title)} · Status: ${escapeHtml(titleCase(normalizeRunStatus(run.status)))}</div>
907:  workflow,
909:  run,
920:          ${renderBuilderSection(session, workflow, inputs, session.validationMessage, session.draftStatus, escapeHtml)}
924:          ${renderExecutionSection(run, workflow, blockedRequirements, escapeHtml)}
932:  const handoff = getSharedHandoff(projectName, "workflows", operations);
937:  const fromWorkflowId = asString(payload.workflow_id);
940:  const workflowId = getWorkflowDef(fromWorkflowId || modeMapped || session.selectedWorkflowId).id;
942:  session.selectedWorkflowId = workflowId;
943:  session.inputsByWorkflow[workflowId] = {
944:    ...session.inputsByWorkflow[workflowId],
945:    project: firstNonEmpty(payload?.draft_context?.projectName, session.inputsByWorkflow[workflowId].project),
946:    campaign: firstNonEmpty(payload?.campaign_name, session.inputsByWorkflow[workflowId].campaign),
947:    goal: firstNonEmpty(payload?.draft_context?.lastResponseTitle, payload?.workflow_title, session.inputsByWorkflow[workflowId].goal),
948:    product: firstNonEmpty(payload?.output?.product, session.inputsByWorkflow[workflowId].product),
949:    channel: firstNonEmpty(payload?.output?.channel, session.inputsByWorkflow[workflowId].channel)
953:    const run = session.runsByWorkflow[workflowId];
954:    run.output = asObject(payload.output);
955:    run.status = "completed";
956:    run.lastRunAt = nowIso();
957:    run.source = "handoff";
958:    run.history.unshift({ createdAt: run.lastRunAt, source: run.source, output: run.output });
959:    run.history = run.history.slice(0, 8);
964:    console.warn("Failed to consume workflow handoff:", error.message);
979:    session.intelligence = { ...session.intelligence, status: "error", error: "Select a project to run workflows." };
1016:            ? (insightsResult.reason?.message || learningResult.reason?.message || "Failed to load workflow intelligence")
1026:          error: error.message || "Failed to load workflow intelligence",
1039:function buildAiHandoffPrompt(workflow, inputs, runOutput, context) {
1040:  if (runOutput?.summary) {
1042:      `Refine the ${workflow.title.toLowerCase()} execution package.`,
1045:      `Summary: ${runOutput.summary}`,
1046:      `Next actions: ${asArray(runOutput.nextActions).join("; ")}`
1050:    `Build a ${workflow.title.toLowerCase()} execution package.`,
1063:  workflow,
1065:  run,
1067:  navigateTo,
1072:  const prompt = buildAiHandoffPrompt(workflow, inputs, run.output, context);
1075:    modeId: workflow.aiModeId,
1077:    lastResponseTitle: asString(run.output?.title || workflow.title),
1078:    routeSuggestions: asArray(run.output?.routeSuggestions)
1084:    source_page: "workflows",
1088:      workflow_id: workflow.id,
1089:      workflow_title: workflow.title,
1091:      output: asObject(run.output)
1100:      console.warn("Failed to persist workflow-to-ai handoff:", error.message);
1104:  navigateTo("ai-command");
1108:function validateWorkflowInputs(workflow, inputs) {
1109:  const missing = workflow.requiredInputs.filter((field) => !asString(inputs[field]).trim());
1116:  if (workflowBridgeRegistered || typeof window === "undefined") return;
1118:  window.addEventListener("mh:submit-workflow", async (event) => {
1130:      runProjectWorkflow,
1131:      runProjectAiWorkflow,
1140:    const workflow = WORKFLOW_CATALOG.find((item) => item.aiModeId === asString(meta.modeId)) || WORKFLOW_CATALOG[0];
1142:    session.selectedWorkflowId = workflow.id;
1143:    session.inputsByWorkflow[workflow.id] = {
1144:      ...session.inputsByWorkflow[workflow.id],
1145:      project: firstNonEmpty(projectName, session.inputsByWorkflow[workflow.id].project),
1146:      goal: firstNonEmpty(meta.assistantTitle, session.inputsByWorkflow[workflow.id].goal),
1147:      campaign: firstNonEmpty(session.inputsByWorkflow[workflow.id].campaign, state.context.activeCampaign),
1148:      product: firstNonEmpty(session.inputsByWorkflow[workflow.id].product, state.context.currentProject)
1152:      session.draftStatus = "AI prompt imported into workflow builder";
1157:    const run = session.runsByWorkflow[workflow.id];
1158:    run.status = "running";
1173:      const result = await (runProjectAiWorkflow || runProjectWorkflow)?.(projectName, workflow.id, {
1174:        title: workflow.title,
1177:        inputs: session.inputsByWorkflow[workflow.id],
1178:        prompt: firstNonEmpty(message, buildWorkflowPrompt(workflow, session.inputsByWorkflow[workflow.id], contextModel)),
1181:          source: "workflow-auto-run"
1184:      const output = asObject(result?.output || result?.run?.output) || buildFallbackOutput(workflow, session.inputsByWorkflow[workflow.id], contextModel);
1185:      run.status = "completed";
1186:      run.lastRunAt = asString(result?.run?.created_at) || createdAt;
1187:      run.runId = asString(result?.run?.id);
1188:      run.source = meta.source || "external-trigger";
1189:      run.output = output;
1190:      run.blockedRequirements = asArray(output.blockedRequirements || output.blocked_requirements);
1191:      run.history.unshift({ createdAt: run.lastRunAt, source: run.source, output });
1192:      run.history = run.history.slice(0, 8);
1194:      showMessage?.(`${workflow.title} created from AI context.`);
1196:      run.status = "failed";
1203:  workflowBridgeRegistered = true;
1209:  navigateTo,
1215:  runProjectWorkflow,
1216:  runProjectAiWorkflow,
1221:  if (workflowAutomationEnabled) {
1222:    createAutoModeController(getState, { getState, navigateTo, createProjectHandoff });
1223:    if (workflowAutoModeUnsubscribe) workflowAutoModeUnsubscribe();
1224:    workflowAutoModeUnsubscribe = subscribeAutoMode(() => {
1232:  const workflow = getWorkflowDef(session.selectedWorkflowId);

## Governance approval markers
7:function collectGovernanceEvidence({ selectedItem, projectData, governanceData }) {
8:  // Defensive extraction of evidence assets
9:  const evidence = {
14:    proof: [],
23:  const sources = [selectedItem, projectData, governanceData];
28:      if (/source_of_truth|source/.test(key)) evidence.source_of_truth.push(v);
29:      else if (/legal/.test(key)) evidence.legal.push(v);
30:      else if (/pricing/.test(key)) evidence.pricing.push(v);
31:      else if (/certificate|certificates/.test(key)) evidence.certificate.push(v);
32:      else if (/proof/.test(key)) evidence.proof.push(v);
33:      else if (/product/.test(key)) evidence.product.push(v);
34:      else if (/brand/.test(key)) evidence.brand.push(v);
35:      else if (/claim/.test(key)) evidence.claim.push(v);
36:      else if (/media/.test(key)) evidence.media.push(v);
37:      else if (/content/.test(key)) evidence.content.push(v);
38:      else if (/library/.test(key)) evidence.library.push(v);
39:      else evidence.other.push(v);
43:  Object.keys(evidence).forEach((k) => {
44:    evidence[k] = asSafeArray(evidence[k]).flat().filter(Boolean);
46:  return evidence;
56:  if (s.includes("proof")) return "proof";
66:function summarizeEvidenceState(evidence) {
67:  // Returns true if any key evidence is present
69:    evidence.source_of_truth.length ||
70:    evidence.legal.length ||
71:    evidence.pricing.length ||
72:    evidence.certificate.length ||
73:    evidence.proof.length
77:function renderGovernanceEvidenceSummary({ selectedItem, projectData, governanceData, intakeContext, escapeHtml }) {
78:  const evidence = collectGovernanceEvidence({ selectedItem, projectData, governanceData });
79:  const hasEvidence = summarizeEvidenceState(evidence);
81:    <div class="governance-evidence-summary">
82:      <div class="governance-evidence-summary-header">Evidence Summary</div>
83:      <div class="governance-evidence-cards">
84:        <div class="governance-evidence-card${evidence.source_of_truth.length ? '' : ' is-missing'}">
85:          <span class="governance-evidence-label">Source of Truth</span>
86:          <span class="governance-evidence-value">${evidence.source_of_truth.length ? escapeHtml(asString(evidence.source_of_truth[0])) : "Missing"}</span>
88:        <div class="governance-evidence-card${evidence.legal.length ? '' : ' is-missing'}">
89:          <span class="governance-evidence-label">Legal</span>
90:          <span class="governance-evidence-value">${evidence.legal.length ? escapeHtml(asString(evidence.legal[0])) : "Missing"}</span>
92:        <div class="governance-evidence-card${evidence.pricing.length ? '' : ' is-missing'}">
93:          <span class="governance-evidence-label">Pricing</span>
94:          <span class="governance-evidence-value">${evidence.pricing.length ? escapeHtml(asString(evidence.pricing[0])) : "Missing"}</span>
96:        <div class="governance-evidence-card${evidence.certificate.length ? '' : ' is-missing'}">
97:          <span class="governance-evidence-label">Certificate/Proof</span>
98:          <span class="governance-evidence-value">${evidence.certificate.length ? escapeHtml(asString(evidence.certificate[0])) : evidence.proof.length ? escapeHtml(asString(evidence.proof[0])) : "Missing"}</span>
100:        <div class="governance-evidence-card${evidence.brand.length ? '' : ' is-missing'}">
101:          <span class="governance-evidence-label">Brand Asset</span>
102:          <span class="governance-evidence-value">${evidence.brand.length ? escapeHtml(asString(evidence.brand[0])) : "Missing"}</span>
104:        <div class="governance-evidence-card${evidence.product.length ? '' : ' is-missing'}">
105:          <span class="governance-evidence-label">Product Asset</span>
106:          <span class="governance-evidence-value">${evidence.product.length ? escapeHtml(asString(evidence.product[0])) : "Missing"}</span>
109:      ${!hasEvidence ? `<div class="governance-evidence-card is-missing governance-source-warning">Missing source evidence — attach Library proof before high-risk approval.</div>` : ""}
110:      <div class="governance-evidence-guidance">High-risk governance decisions should reference source-of-truth evidence, proof assets, or an incoming handoff. Missing evidence should be resolved before approval or override.</div>
127:    <div class="governance-intake-panel">
128:      <div class="governance-intake-panel-header">Incoming Review Context</div>
129:      <div class="governance-intake-list">
131:          <div class="governance-intake-item"><span class="governance-intake-label">${escapeHtml(item.label)}</span><span class="governance-intake-value">${escapeHtml(item.value)}</span></div>
132:        `).join("") : `<div class="governance-intake-item is-missing">No intake yet</div>`}
144:const governanceSessions = new Map();
180:  if (normalized === "approved" || normalized === "success") return "success";
187:  if (["approval", "approved", "approve"].includes(normalized)) {
188:    return "Submit Approval Decision? This records a governance decision and may affect downstream readiness. It does not publish or execute directly.";
192:    return "Record Override Decision? This is a high-risk governance action. Backend authority rules remain active, but this can unblock downstream operations. Continue only after verifying source, risk, and owner.";
202:function confirmGovernanceDecision(decision) {
203:  if (typeof window === "undefined" || typeof window.confirm !== "function") return true;
204:  return window.confirm(getDecisionConfirmationMessage(decision));
209:  if (!governanceSessions.has(key)) {
210:    governanceSessions.set(key, {
219:  return governanceSessions.get(key);
227:  const approval = asObject(settings.approval);
235:      approval_before_publish: Boolean(publishing.approvalBeforePublish),
236:      high_risk_claim_review_required: Boolean(safety.aiClaimCheck),
239:      auto_escalate_critical_risk: String(operating.actionPolicy || "").toLowerCase().includes("blocked"),
242:    approval_owners: {
243:      content: asString(approval.contentOwner) || "Marketing lead",
244:      media: asString(approval.mediaOwner) || "Creative lead",
245:      campaign: asString(approval.adsOwner) || "Operations lead",
253:      approval_mode: asString(ai.approvalRequiredMode) || "Only high-risk",
254:      claim_safety_mode: asString(ai.claimSafetyMode) || "Strict evidence required",
255:      approval_before_publish: Boolean(publishing.approvalBeforePublish)
261:  return asArray(summary?.sections?.approval_queue).find((item) =>
280:    session.error = error.message || "Failed to load governance console.";
297:    <div class="governance-metric">
313:      <div class="governance-card-list">
315:          <div class="governance-card">
316:            <div class="governance-card-head">
327:        ${Object.entries(escalationChain).map(([risk, roles]) => `
329:            <strong>${escapeHtml(titleCase(risk))}</strong>
344:    <div class="governance-flag-list">
346:        <div class="governance-flag">
366:    <article class="governance-card">
367:      <div class="governance-card-head">
369:          <div class="panel-kicker">${escapeHtml(titleCase(item.entity_type || "approval"))}</div>
372:        <span class="card-badge ${severityClass(item.risk_level || item.status)}">${escapeHtml(titleCase(item.status || item.risk_level || "pending"))}</span>
374:      <div class="governance-meta">
375:        <span>Risk: ${escapeHtml(titleCase(item.risk_level || "medium"))}</span>
380:      <p class="governance-copy">${escapeHtml(item.summary || "Awaiting review and decision.")}</p>
381:      ${renderFlagList(flags, "No extra policy flags were attached to this approval.", escapeHtml)}
382:      <textarea id="${escapeHtml(noteId)}" class="setup-input setup-textarea governance-note" rows="3" placeholder="Add a decision reason, change request, or escalation note.">${escapeHtml(item.decision_note || "")}</textarea>
383:      <div class="governance-actions">
384:        <button class="btn btn-primary" type="button" data-governance-decision="approved" data-approval-id="${escapeHtml(item.id)}">Submit Approval Decision</button>
385:        <button class="btn btn-secondary" type="button" data-governance-decision="rejected" data-approval-id="${escapeHtml(item.id)}">Submit Rejection Decision</button>
386:        <button class="btn btn-secondary" type="button" data-governance-decision="changes_requested" data-approval-id="${escapeHtml(item.id)}">Request Changes Review</button>
387:        <button class="btn btn-secondary" type="button" data-governance-decision="escalated" data-approval-id="${escapeHtml(item.id)}">Escalate Review</button>
388:        <button class="btn btn-secondary" type="button" data-governance-decision="overridden" data-approval-id="${escapeHtml(item.id)}">Record Override Decision</button>
391:        <div class="governance-history">
393:            <div class="governance-history-item">
404:function renderReviewCard(item, type, escapeHtml, approval) {
413:    <article class="governance-card">
414:      <div class="governance-card-head">
419:        <span class="card-badge ${approval ? "warning" : "neutral"}">${escapeHtml(approval ? "In approval queue" : "Not requested")}</span>
421:      <div class="governance-meta">
426:      ${approval ? `
428:          <strong>Linked approval:</strong> ${escapeHtml(approval.title || approval.id)} • ${escapeHtml(titleCase(approval.status))}
431:        <div class="governance-actions">
435:            data-governance-request-approval="true"
439:            data-risk="${escapeHtml(flags[0]?.severity || "medium")}"
456:    <div class="governance-timeline">
458:        <div class="governance-timeline-item">
459:          <div class="governance-timeline-dot"></div>
460:          <div class="governance-timeline-copy">
474:  const owners = asObject(policy.approval_owners);
477:    <div class="governance-policy-grid">
478:      <label class="settings-toggle" for="governance-approval-before-publish">
480:        <input id="governance-approval-before-publish" type="checkbox" class="settings-toggle-input" data-governance-policy="approval_before_publish" ${rules.approval_before_publish ? "checked" : ""} />
483:      <label class="settings-toggle" for="governance-claim-review">
485:        <input id="governance-claim-review" type="checkbox" class="settings-toggle-input" data-governance-policy="high_risk_claim_review_required" ${rules.high_risk_claim_review_required ? "checked" : ""} />
488:      <label class="settings-toggle" for="governance-brand-safety">
490:        <input id="governance-brand-safety" type="checkbox" class="settings-toggle-input" data-governance-policy="brand_safety_review_required" ${rules.brand_safety_review_required ? "checked" : ""} />
493:      <label class="settings-toggle" for="governance-auto-escalate">
494:        <span class="settings-field-label">Auto-escalate critical risk</span>
495:        <input id="governance-auto-escalate" type="checkbox" class="settings-toggle-input" data-governance-policy="auto_escalate_critical_risk" ${rules.auto_escalate_critical_risk ? "checked" : ""} />
498:      <label class="settings-toggle" for="governance-admin-override">
500:        <input id="governance-admin-override" type="checkbox" class="settings-toggle-input" data-governance-policy="allow_admin_override" ${rules.allow_admin_override ? "checked" : ""} />
503:      <label class="settings-toggle" for="governance-freeze-publishing">
505:        <input id="governance-freeze-publishing" type="checkbox" class="settings-toggle-input" data-governance-policy="freeze_publishing" ${rules.freeze_publishing ? "checked" : ""} />
509:        <label class="settings-field-label" for="governance-owner-content">Content owner</label>
510:        <input id="governance-owner-content" class="settings-control" type="text" data-governance-owner="content" value="${escapeHtml(owners.content || "")}" />
513:        <label class="settings-field-label" for="governance-owner-media">Media owner</label>
514:        <input id="governance-owner-media" class="settings-control" type="text" data-governance-owner="media" value="${escapeHtml(owners.media || "")}" />
517:        <label class="settings-field-label" for="governance-owner-publishing">Publishing owner</label>
518:        <input id="governance-owner-publishing" class="settings-control" type="text" data-governance-owner="publishing" value="${escapeHtml(owners.publishing || "")}" />
534:  const approvals = asArray(sections.approval_queue).map((item) => ({
536:    queue_kind: "approval",
537:    selected_key: `approval:${asString(item.id)}`,
541:    queue_risk: item.risk_level || "medium",
550:    linked_approval: item
554:    const approval = findApprovalForEntity(summary, item.entity_type, item.entity_id);
561:      queue_status: approval?.status || item.status || "open",
562:      queue_risk: asArray(item.claim_flags)[0]?.severity || "medium",
563:      queue_owner: approval?.reviewer || "Compliance Reviewer",
564:      queue_created: approval?.created_at || item.updated_at || item.created_at,
566:      linked_approval: approval
571:    const approval = findApprovalForEntity(summary, item.entity_type, item.entity_id);
578:      queue_status: approval?.status || item.status || "open",
579:      queue_risk: asArray(item.brand_safety_flags)[0]?.severity || "medium",
580:      queue_owner: approval?.reviewer || "Brand Reviewer",
581:      queue_created: approval?.created_at || item.updated_at || item.created_at,
583:      linked_approval: approval
588:    const approval = findApprovalForEntity(summary, "publishing_job", item.entity_id);
595:      queue_status: approval?.status || item.status || "open",
596:      queue_risk: asArray(item.publish_guardrails)[0]?.severity || "medium",
597:      queue_owner: approval?.reviewer || "Publishing Reviewer",
598:      queue_created: approval?.created_at || item.updated_at || item.created_at,
600:      linked_approval: approval
611:    queue_risk: "high",
617:  return [...approvals, ...claims, ...brand, ...publish, ...escalations];
622:  const itemLabel = asString(selectedItem?.queue_title || selectedItem?.title || "the selected governance item");
625:      label: "Summarize governance state",
626:      preview: "Explain the current approval pressure, risk level, and next governance priority.",
627:      prompt: `Summarize the current governance state for ${projectLabel}. Cover policy pressure, pending approvals, risky claims, brand safety issues, publish blockers, and the next governance priority.`
631:      preview: "Explain the selected governance item and what decision path is safest.",
632:      prompt: `Review ${itemLabel} in Governance for ${projectLabel}. Explain the risk, what policy is implicated, and what decision path is safest next.`
635:      label: "Find governance gaps",
636:      preview: "Identify the highest-risk governance gaps and what rules or ownership need tightening.",
637:      prompt: `Review Governance for ${projectLabel} with focus on ${focusLabel}. Identify the highest-risk governance gaps, where approval ownership is weak, and what rules need tightening next.`
646:  const owners = asObject(policy.approval_owners);
647:  const approvals = asArray(sections.approval_queue).length;
655:    blockers.push("Publishing is currently frozen by governance policy.");
657:  if (approvals > 0) {
658:    blockers.push(`${approvals} approval item${approvals === 1 ? " is" : "s are"} waiting for a decision.`);
674:  let nextBestAction = "Run a governance AI summary, then keep policy owners and rules aligned with live operations.";
675:  if (selectedItem?.queue_kind === "approval") {
676:    nextBestAction = "Review the selected approval, document decision reasoning, and submit a governance decision.";
677:  } else if (approvals > 0) {
678:    nextBestAction = "Switch to Approvals focus and clear highest-risk decisions first.";
680:    nextBestAction = "Inspect policy violations and request approvals where review is still missing.";
691:    approvals,
698:function governanceRiskRank(value) {
710:    return governanceRiskRank(item.queue_risk) > governanceRiskRank(highest.queue_risk) ? item : highest;
718:function getGovernanceEscalationRoute(summary, risk) {
720:  const normalizedRisk = asString(risk).toLowerCase();
732:      <section class="page is-active" data-page="governance">
733:        <div class="governance-shell governance-workspace mhos-clean-root mhos-clean-shell">
739:                <p>Governance operating surface for approvals, policy pressure, and decision routing.</p>
751:            <div class="empty-box">Select a project to review approvals, policy violations, overrides, and audit history.</div>
760:      <section class="page is-active" data-page="governance">
761:        <div class="governance-shell governance-workspace mhos-clean-root mhos-clean-shell">
767:                <p>Preparing the governance operating surface.</p>
779:            <div class="empty-box">Loading governance console...</div>
788:      <section class="page is-active" data-page="governance">
789:        <div class="governance-shell governance-workspace mhos-clean-root mhos-clean-shell">
820:    approvals: queueItems.filter((item) => item.queue_kind === "approval").length,
829:      approvals: "approval",
842:  const owners = asObject(policy.approval_owners);
852:  const highestRiskValue = asString(highestRiskItem?.queue_risk || executiveFocusItem?.queue_risk);
853:  const highestRiskLabel = highestRiskValue ? titleCase(highestRiskValue) : "No open risk";
857:  const selectedDecisionKind = titleCase(executiveFocusItem?.queue_kind || "governance");
860:    <section class="page is-active" data-page="governance">
861:      <div class="governance-shell governance-workspace mhos-clean-root mhos-clean-shell">
862:        <section class="panel mhos-executive-surface mhos-context-ribbon governance-operating-header" aria-label="Executive governance command band">
863:          <div class="panel-header mhos-context-main governance-operating-header-main">
865:              <div class="panel-kicker mhos-context-kicker governance-operating-eyebrow">Governance Operating Surface</div>
866:              <h3 class="mhos-context-title governance-operating-title">Governance Command Center for ${escapeHtml(projectName)}</h3>
867:              <p class="mhos-context-description governance-operating-desc">Canonical executive surface for policy authority, approval pressure, escalation, and safe decision routing.</p>
869:            <span class="card-badge neutral governance-operating-status">${escapeHtml(session.loading ? "Refreshing" : "Active")}</span>
872:          <div class="mhos-executive-summary-grid governance-executive-summary-grid" aria-label="Governance executive anchors">
873:            <article class="mhos-executive-summary-item governance-summary-readiness">
878:            <article class="mhos-executive-summary-item governance-summary-approval">

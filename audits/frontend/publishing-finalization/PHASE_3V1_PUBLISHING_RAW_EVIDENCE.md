# PHASE 3V.1 — Publishing Raw Evidence

## Publishing JS size
    2036 public/control-center/pages/publishing.js

## Publishing imports/exports
2:function renderPublishingCommandHeader({ projectName, recommendation, selectedItem, summary, queue, blockers, escapeHtml }) {
13:    `<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingBuilderPanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Prepare Publishing Package</button>`,
14:    `<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingQueuePanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Open Queue</button>`,
15:    `<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingHandoffPanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Review Approval Gate</button>`,
16:    `<button type="button" class="btn btn-primary" onclick="document.getElementById('publishingPushAiBtn')?.scrollIntoView({behavior:'smooth',block:'start'})">Open AI Review</button>`
30:function renderPublishingWorkflowStrip({ selectedItem, recommendation, blockers, approvalState, escapeHtml }) {
59:function renderPublishingReadinessSummary({ selectedItem, recommendation, blockers, assetData, escapeHtml }) {
82:import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";
83:import {
88:import { getReadinessBlockers } from "../system-intelligence.js";
89:import {
98:import {
646:function renderStatusPill(status, escapeHtml) {
659:function renderScopedStyles() {
1024:function renderOverview(counts, queue, escapeHtml) {
1045:function renderRecommendation(recommendation, counts, assetBlockers, checks, escapeHtml) {
1102:function renderFilterRow(filter, queue, escapeHtml) {
1122:function renderQueue(queue, visibleQueue, selectedId, filter, escapeHtml) {
1157:function renderBuilder(session, channels, checks, escapeHtml) {
1267:function renderWorkflowHandoff(handoff, session, escapeHtml) {
1308:function renderCalendar(queue, escapeHtml) {
1374:function renderExecutionResult(queue, escapeHtml) {
1422:function renderAssetGate(state, escapeHtml) {
1453:function bindPublishingWorkspace({
1518:    button.onclick = () => {
1525:    button.onclick = () => {
1546:    newBtn.onclick = () => {
1555:    openQueueBtn.onclick = () => {
1562:    button.onclick = async () => {
1575:    scheduleBtn.onclick = async () => {
1632:    button.onclick = async () => {
1724:    approveBtn.onclick = async () => {
1757:    failBtn.onclick = async () => {
1787:    loadHandoffBtn.onclick = () => {
1810:    pushAiBtn.onclick = () => {
1851:    autoPrepareBtn.onclick = async () => {
1885:    autoStopBtn.onclick = () => {
1893:    autoApproveBtn.onclick = async () => {
1901:    autoSkipBtn.onclick = async () => {
1908:export const publishingRoute = {

## Publish / schedule / execution markers
public/control-center/pages/publishing.js:2:function renderPublishingCommandHeader({ projectName, recommendation, selectedItem, summary, queue, blockers, escapeHtml }) {
public/control-center/pages/publishing.js:6:    selectedItem?.channel && `<span>Channel: <strong>${escapeHtml(titleCase(selectedItem.channel))}</strong></span>`
public/control-center/pages/publishing.js:9:  const approval = selectedItem?.approvalStatus ? titleCase(selectedItem.approvalStatus) : "Draft";
public/control-center/pages/publishing.js:10:  const nextAction = recommendation?.action ? escapeHtml(recommendation.action) : "Review queue";
public/control-center/pages/publishing.js:11:  const safety = `Publishing prepares channel packages, schedules, and approval-ready handoffs. Final execution remains <strong>confirmation-gated</strong> and governed by <strong>backend approval rules</strong>.`;
public/control-center/pages/publishing.js:13:    `<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingBuilderPanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Prepare Publishing Package</button>`,
public/control-center/pages/publishing.js:14:    `<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingQueuePanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Open Queue</button>`,
public/control-center/pages/publishing.js:15:    `<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingHandoffPanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Review Approval Gate</button>`,
public/control-center/pages/publishing.js:16:    `<button type="button" class="btn btn-primary" onclick="document.getElementById('publishingPushAiBtn')?.scrollIntoView({behavior:'smooth',block:'start'})">Open AI Review</button>`
public/control-center/pages/publishing.js:19:    <section class="publishing-command-header" role="region" aria-label="Publishing Command Header">
public/control-center/pages/publishing.js:20:      <div class="publishing-command-header-title">Publishing Control Workspace</div>
public/control-center/pages/publishing.js:21:      <div class="publishing-command-header-context">${context}</div>
public/control-center/pages/publishing.js:22:      <div class="publishing-command-header-status">Status: <strong>${escapeHtml(status)}</strong> &middot; Approval: <strong>${escapeHtml(approval)}</strong></div>
public/control-center/pages/publishing.js:23:      <div class="publishing-command-header-status">Next: <span>${nextAction}</span></div>
public/control-center/pages/publishing.js:24:      <div class="publishing-command-header-safety">${safety}</div>
public/control-center/pages/publishing.js:25:      <div class="publishing-command-header-actions">${actions}</div>
public/control-center/pages/publishing.js:30:function renderPublishingWorkflowStrip({ selectedItem, recommendation, blockers, approvalState, escapeHtml }) {
public/control-center/pages/publishing.js:32:    { key: "draft", label: "Draft" },
public/control-center/pages/publishing.js:35:    { key: "approval", label: "Approval" },
public/control-center/pages/publishing.js:36:    { key: "schedule", label: "Schedule" },
public/control-center/pages/publishing.js:37:    { key: "handoff", label: "Execution Handoff" }
public/control-center/pages/publishing.js:40:    draft: selectedItem?.status === "draft" ? "active" : selectedItem ? "ready" : "missing",
public/control-center/pages/publishing.js:41:    source: selectedItem?.source ? "ready" : "missing",
public/control-center/pages/publishing.js:42:    package: selectedItem ? "ready" : "missing",
public/control-center/pages/publishing.js:43:    approval: selectedItem?.approvalStatus === "approved" ? "ready" : selectedItem?.approvalStatus === "needs approval" ? "warning" : "missing",
public/control-center/pages/publishing.js:44:    schedule: selectedItem?.status === "scheduled" ? "ready" : "missing",
public/control-center/pages/publishing.js:45:    handoff: selectedItem?.status === "published" ? "ready" : "missing"
public/control-center/pages/publishing.js:48:    <nav class="publishing-workflow-strip" aria-label="Publishing Workflow">
public/control-center/pages/publishing.js:50:        <div class="publishing-workflow-step is-${statusMap[step.key]}" aria-label="${escapeHtml(step.label)}: ${statusMap[step.key]}">
public/control-center/pages/publishing.js:52:          <span class="publishing-workflow-step-label">${statusMap[step.key]}</span>
public/control-center/pages/publishing.js:61:    { key: "source", label: "Source", state: selectedItem?.source ? "ready" : "missing" },
public/control-center/pages/publishing.js:62:    { key: "copy", label: "Copy", state: selectedItem?.contentItem ? "ready" : "missing" },
public/control-center/pages/publishing.js:63:    { key: "media", label: "Media", state: assetData?.some(a => a.type === "media" && a.status === "Ready") ? "ready" : "missing" },
public/control-center/pages/publishing.js:64:    { key: "channel", label: "Channel", state: selectedItem?.channel ? "ready" : "missing" },
public/control-center/pages/publishing.js:65:    { key: "schedule", label: "Schedule", state: selectedItem?.scheduledFor ? "ready" : "missing" },
public/control-center/pages/publishing.js:66:    { key: "governance", label: "Governance", state: selectedItem?.governanceStatus === "approved" ? "ready" : "missing" },
public/control-center/pages/publishing.js:67:    { key: "approval", label: "Approval", state: selectedItem?.approvalStatus === "approved" ? "ready" : selectedItem?.approvalStatus === "needs approval" ? "warning" : "missing" }
public/control-center/pages/publishing.js:69:  const blockersSummary = blockers && blockers.length ? `<div class="publishing-readiness-card is-warning">${escapeHtml(blockers.length)} blocker(s) present</div>` : "";
public/control-center/pages/publishing.js:71:    <section class="publishing-readiness-summary" aria-label="Publishing Readiness Summary">
public/control-center/pages/publishing.js:73:        <div class="publishing-readiness-card is-${r.state}">
public/control-center/pages/publishing.js:74:          <span class="publishing-readiness-card-label">${escapeHtml(r.label)}</span>
public/control-center/pages/publishing.js:94:  approveCurrentGate,
public/control-center/pages/publishing.js:102:} from "./publishing/publishing-payloads.js";
public/control-center/pages/publishing.js:104:const publishingSessions = new Map();
public/control-center/pages/publishing.js:105:const PUBLISHING_LOCAL_DRAFTS_KEY = "mh-publishing-local-drafts-v1";
public/control-center/pages/publishing.js:106:const STATUS_FILTERS = ["all", "draft", "ready", "needs approval", "scheduled", "published", "failed"];
public/control-center/pages/publishing.js:107:const DISPLAY_STATUSES = ["draft", "ready", "needs approval", "scheduled", "published", "failed"];
public/control-center/pages/publishing.js:109:const APPROVAL_STATUSES = ["draft", "needs approval", "approved"];
public/control-center/pages/publishing.js:120:const publishingAutomationState = {
public/control-center/pages/publishing.js:124:let publishingAutoModeUnsubscribe = null;
public/control-center/pages/publishing.js:125:let publishingAutoModeControllerReady = false;
public/control-center/pages/publishing.js:126:let publishingAutomationEnabled = false;
public/control-center/pages/publishing.js:127:let publishingRenderCallback = null;
public/control-center/pages/publishing.js:128:let publishingRenderTimer = null;
public/control-center/pages/publishing.js:130:function schedulePublishingRender(render) {
public/control-center/pages/publishing.js:132:    publishingRenderCallback = render;
public/control-center/pages/publishing.js:135:  if (publishingRenderTimer) {
public/control-center/pages/publishing.js:139:  publishingRenderTimer = window.setTimeout(() => {
public/control-center/pages/publishing.js:140:    publishingRenderTimer = null;
public/control-center/pages/publishing.js:142:    if (typeof publishingRenderCallback === "function") {
public/control-center/pages/publishing.js:143:      publishingRenderCallback();
public/control-center/pages/publishing.js:149:  publishingRenderCallback = render;
public/control-center/pages/publishing.js:151:  if (!publishingAutomationEnabled) {
public/control-center/pages/publishing.js:155:  if (!publishingAutoModeControllerReady) {
public/control-center/pages/publishing.js:157:    publishingAutoModeControllerReady = true;
public/control-center/pages/publishing.js:160:  if (publishingAutoModeUnsubscribe) {
public/control-center/pages/publishing.js:164:  publishingAutoModeUnsubscribe = subscribeAutoMode(() => {
public/control-center/pages/publishing.js:172:    schedulePublishingRender();
public/control-center/pages/publishing.js:229:function formatDateTime(value, fallback = "Not scheduled") {
public/control-center/pages/publishing.js:242:  if (!date) return "Unscheduled";
public/control-center/pages/publishing.js:268:function normalizeStatus(value, fallback = "draft") {
public/control-center/pages/publishing.js:271:  if (["draft", "paused", "pause"].includes(normalized)) return "draft";
public/control-center/pages/publishing.js:272:  if (["ready", "approved", "ready_for_manual_publish", "ready_for_manual_send"].includes(normalized)) return "ready";
public/control-center/pages/publishing.js:273:  if (["needs approval", "needs_approval", "approval", "pending_approval", "review", "in_review"].includes(normalized)) {
public/control-center/pages/publishing.js:274:    return "needs approval";
public/control-center/pages/publishing.js:276:  if (["scheduled", "queued", "queue", "pending", "pending_publish"].includes(normalized)) return "scheduled";
public/control-center/pages/publishing.js:277:  if (["published", "completed", "complete", "success", "done", "sent", "live"].includes(normalized)) return "published";
public/control-center/pages/publishing.js:284:  if (status === "published") return "success";
public/control-center/pages/publishing.js:285:  if (status === "ready" || status === "scheduled") return "warning";
public/control-center/pages/publishing.js:319:function saveLocalDraft(projectName, draft) {
public/control-center/pages/publishing.js:322:  const drafts = asArray(map[key]).filter((item) => asString(item.id) !== asString(draft.id));
public/control-center/pages/publishing.js:324:    ...asObject(draft),
public/control-center/pages/publishing.js:325:    id: asString(draft.id || `local-publish-${Date.now()}`),
public/control-center/pages/publishing.js:326:    source: "Local draft",
public/control-center/pages/publishing.js:330:  map[key] = [nextDraft, ...drafts].slice(0, 20);
public/control-center/pages/publishing.js:353:    channel: "instagram",
public/control-center/pages/publishing.js:355:    publishDate: toDateInput(tomorrow),
public/control-center/pages/publishing.js:356:    publishTime: "09:00",
public/control-center/pages/publishing.js:357:    approvalStatus: "draft",
public/control-center/pages/publishing.js:365:  if (!publishingSessions.has(key)) {
public/control-center/pages/publishing.js:366:    publishingSessions.set(key, {
public/control-center/pages/publishing.js:372:      draftMessage: "",
public/control-center/pages/publishing.js:377:  return publishingSessions.get(key);
public/control-center/pages/publishing.js:395:  if (item.campaign) return `${item.campaign} ${titleCase(item.channel || "publish")}`;
public/control-center/pages/publishing.js:396:  if (context.activeCampaign) return `${context.activeCampaign} ${titleCase(item.channel || "publish")}`;
public/control-center/pages/publishing.js:397:  return `${titleCase(item.channel || "Publishing")} item`;
public/control-center/pages/publishing.js:402:  const preview = asObject(raw.preview || raw.connector_preview);
public/control-center/pages/publishing.js:403:  const scheduledFor = firstText(raw.scheduled_for, raw.scheduledFor);
public/control-center/pages/publishing.js:404:  const status = normalizeStatus(raw.execution_status || raw.status, scheduledFor ? "scheduled" : "draft");
public/control-center/pages/publishing.js:405:  const channel = toKey(raw.channel || preview.channel);
public/control-center/pages/publishing.js:412:    channel,
public/control-center/pages/publishing.js:414:    scheduledFor,
public/control-center/pages/publishing.js:415:    executedAt: firstText(raw.executed_at, raw.executedAt),
public/control-center/pages/publishing.js:416:    createdAt: firstText(raw.created_at, raw.createdAt, raw.executed_at),
public/control-center/pages/publishing.js:417:    updatedAt: firstText(raw.updated_at, raw.updatedAt, raw.executed_at, raw.created_at),
public/control-center/pages/publishing.js:418:    approvalStatus: status === "ready" ? "approved" : status === "needs approval" ? "needs approval" : "draft",
public/control-center/pages/publishing.js:422:    notes: normalizeNotes(raw.notes, raw.connector_error),
public/control-center/pages/publishing.js:436:    .sort((a, b) => (toDate(b.executed_at)?.getTime() || 0) - (toDate(a.executed_at)?.getTime() || 0));
public/control-center/pages/publishing.js:444:  const scheduledItems = asArray(activity.scheduled_jobs).map((job) => {
public/control-center/pages/publishing.js:450:        preview: asObject(latest?.preview || job.preview || job.connector_preview)
public/control-center/pages/publishing.js:457:  const knownIds = new Set(scheduledItems.map((item) => item.jobId));
public/control-center/pages/publishing.js:462:  const localDrafts = loadLocalDrafts(projectName).map((draft) => normalizeQueueItem(draft, state, "Local draft"));
public/control-center/pages/publishing.js:463:  const backendIds = new Set([...scheduledItems, ...orphanResults].map((item) => item.id));
public/control-center/pages/publishing.js:466:  return [...visibleLocalDrafts, ...scheduledItems, ...orphanResults].sort(compareQueueItems);
public/control-center/pages/publishing.js:472:    ready: 1,
public/control-center/pages/publishing.js:473:    "needs approval": 2,
public/control-center/pages/publishing.js:474:    scheduled: 3,
public/control-center/pages/publishing.js:475:    draft: 4,
public/control-center/pages/publishing.js:476:    published: 5
public/control-center/pages/publishing.js:481:  const aTime = toDate(a.scheduledFor || a.updatedAt || a.createdAt)?.getTime() || 0;
public/control-center/pages/publishing.js:482:  const bTime = toDate(b.scheduledFor || b.updatedAt || b.createdAt)?.getTime() || 0;
public/control-center/pages/publishing.js:486:function buildChannels(state, queue) {
public/control-center/pages/publishing.js:491:      ...queue.map((item) => item.channel),
public/control-center/pages/publishing.js:497:function getStatusCounts(queue) {
public/control-center/pages/publishing.js:499:    acc[status] = queue.filter((item) => item.status === status).length;
public/control-center/pages/publishing.js:504:function getVisibleQueue(queue, filter) {
public/control-center/pages/publishing.js:505:  if (!filter || filter === "all") return queue;
public/control-center/pages/publishing.js:506:  return queue.filter((item) => item.status === filter);
public/control-center/pages/publishing.js:509:function getSelectedItem(queue, selectedId) {
public/control-center/pages/publishing.js:510:  return queue.find((item) => item.id === selectedId) || null;
public/control-center/pages/publishing.js:513:function getNextPublishWindow(queue) {
public/control-center/pages/publishing.js:514:  const next = queue
public/control-center/pages/publishing.js:515:    .filter((item) => item.scheduledFor && ["scheduled", "ready"].includes(item.status))
public/control-center/pages/publishing.js:516:    .sort((a, b) => (toDate(a.scheduledFor)?.getTime() || 0) - (toDate(b.scheduledFor)?.getTime() || 0))[0];
public/control-center/pages/publishing.js:517:  return next ? `${formatDateTime(next.scheduledFor)} - ${next.title}` : "No scheduled window";
public/control-center/pages/publishing.js:527:    channel: item.channel || session.form.channel || "",
public/control-center/pages/publishing.js:529:    publishDate: toDateInput(item.scheduledFor),
public/control-center/pages/publishing.js:530:    publishTime: toTimeInput(item.scheduledFor),
public/control-center/pages/publishing.js:531:    approvalStatus: item.approvalStatus || "draft",
public/control-center/pages/publishing.js:546:  session.draftMessage = "";
public/control-center/pages/publishing.js:559:  const date = clean(form.publishDate);
public/control-center/pages/publishing.js:561:  return `${date}T${clean(form.publishTime) || "09:00"}:00Z`;
public/control-center/pages/publishing.js:565:  const draftPrompt = firstText(
public/control-center/pages/publishing.js:568:    "Prepare publishing draft from current project context."
public/control-center/pages/publishing.js:573:      id: `publishing-prepare-${Date.now()}`,
public/control-center/pages/publishing.js:574:      type: "prepare_publishing_draft",
public/control-center/pages/publishing.js:575:      targetPage: "publishing",
public/control-center/pages/publishing.js:576:      action: "Prepare publishing draft",
public/control-center/pages/publishing.js:578:        prompt: draftPrompt,
public/control-center/pages/publishing.js:579:        reason: "Prepare a safe publishing draft without executing publish.",
public/control-center/pages/publishing.js:580:        title: firstText(session.form.title, "Prepared publishing draft")
public/control-center/pages/publishing.js:585:      id: `publishing-gate-${Date.now()}`,
public/control-center/pages/publishing.js:586:      type: "publish_now",
public/control-center/pages/publishing.js:587:      targetPage: "publishing",
public/control-center/pages/publishing.js:588:      action: "Publish now to external channels",
public/control-center/pages/publishing.js:590:        prompt: draftPrompt,
public/control-center/pages/publishing.js:591:        reason: "Publishing is gated and requires manual approval."
public/control-center/pages/publishing.js:604:  if (!clean(form.channel)) errors.channel = "Channel is required.";
public/control-center/pages/publishing.js:606:  if (["schedule", "publish", "retry"].includes(intent) && !clean(form.publishDate)) {
public/control-center/pages/publishing.js:607:    errors.publishDate = "Publish date is required for this action.";
public/control-center/pages/publishing.js:609:  if (intent === "publish" && form.approvalStatus !== "approved") {
public/control-center/pages/publishing.js:610:    errors.approvalStatus = "Approval must be approved before publishing now.";
public/control-center/pages/publishing.js:626:function guardPublishingAssetBlockers(session, assetBlockers, showMessage, actionLabel = "this publishing action") {
public/control-center/pages/publishing.js:630:  const message = `Publishing blocker(s) must be resolved before ${actionLabel}: ${summary || "required publishing assets are missing or need review"}.`;
public/control-center/pages/publishing.js:636:function confirmPublishingBackendAction(message) {
public/control-center/pages/publishing.js:637:  if (typeof window === "undefined" || typeof window.confirm !== "function") return true;
public/control-center/pages/publishing.js:638:  return window.confirm(message);
public/control-center/pages/publishing.js:643:  return message ? `<div class="publishing-inline-error">${escapeHtml(message)}</div>` : "";
public/control-center/pages/publishing.js:647:  // Add governance/approval hints for status pills
public/control-center/pages/publishing.js:649:  if (status === "needs approval") {
public/control-center/pages/publishing.js:651:  } else if (status === "ready") {
public/control-center/pages/publishing.js:652:    hint = "title=\"Prepare Governance Review. Backend approval rules apply.\" aria-label=\"Prepare Governance Review. Backend approval rules apply.\"";
public/control-center/pages/publishing.js:653:  } else if (status === "scheduled") {
public/control-center/pages/publishing.js:656:  return `<span class="publishing-status-pill is-${escapeHtml(statusClass(status))}" ${hint}>${escapeHtml(titleCase(status))}</span>`;
public/control-center/pages/publishing.js:662:      .publishing-execution-center {
public/control-center/pages/publishing.js:668:      .publishing-execution-grid {
public/control-center/pages/publishing.js:674:      .publishing-main-column,
public/control-center/pages/publishing.js:675:      .publishing-side-column {
public/control-center/pages/publishing.js:682:      .publishing-card {
public/control-center/pages/publishing.js:687:      .publishing-overview-grid {
public/control-center/pages/publishing.js:693:      .publishing-overview-item,
public/control-center/pages/publishing.js:694:      .publishing-impact-chip {
public/control-center/pages/publishing.js:702:      .publishing-overview-item span,
public/control-center/pages/publishing.js:703:      .publishing-impact-chip small {
public/control-center/pages/publishing.js:710:      .publishing-overview-item strong,
public/control-center/pages/publishing.js:711:      .publishing-impact-chip strong {
public/control-center/pages/publishing.js:717:      .publishing-overview-item.is-wide {
public/control-center/pages/publishing.js:721:      .publishing-impact-row,
public/control-center/pages/publishing.js:722:      .publishing-action-row,
public/control-center/pages/publishing.js:723:      .publishing-form-actions,
public/control-center/pages/publishing.js:724:      .publishing-filter-row {
public/control-center/pages/publishing.js:731:      .publishing-impact-row {
public/control-center/pages/publishing.js:735:      .publishing-action-row,
public/control-center/pages/publishing.js:736:      .publishing-form-actions {
public/control-center/pages/publishing.js:740:      .publishing-action-row .btn,
public/control-center/pages/publishing.js:741:      .publishing-form-actions .btn {
public/control-center/pages/publishing.js:747:      .publishing-impact-chip {
public/control-center/pages/publishing.js:751:      .publishing-filter-chip {
public/control-center/pages/publishing.js:764:      .publishing-filter-chip.is-active {
public/control-center/pages/publishing.js:769:      /* Publishing queue dark contrast correction */
public/control-center/pages/publishing.js:770:      .publishing-queue-list,
public/control-center/pages/publishing.js:771:      .publishing-calendar-list,
public/control-center/pages/publishing.js:772:      .publishing-blocker-list {
public/control-center/pages/publishing.js:779:      .publishing-queue-row {
public/control-center/pages/publishing.js:790:      .publishing-queue-row.is-active {
public/control-center/pages/publishing.js:795:      .publishing-queue-main,
public/control-center/pages/publishing.js:796:      .publishing-calendar-row {
public/control-center/pages/publishing.js:807:      .publishing-queue-title {
public/control-center/pages/publishing.js:815:      .publishing-queue-meta {
public/control-center/pages/publishing.js:824:      .publishing-queue-actions {
public/control-center/pages/publishing.js:831:      .publishing-queue-actions button {
public/control-center/pages/publishing.js:843:      .publishing-queue-actions button:focus-visible,
public/control-center/pages/publishing.js:844:      .publishing-queue-main:focus-visible,
public/control-center/pages/publishing.js:845:      .publishing-calendar-row:focus-visible,
public/control-center/pages/publishing.js:846:      .publishing-filter-chip:focus-visible {
public/control-center/pages/publishing.js:851:      .publishing-queue-actions button:disabled,
public/control-center/pages/publishing.js:852:      .publishing-queue-actions button[disabled] {
public/control-center/pages/publishing.js:860:      .publishing-status-pill {
public/control-center/pages/publishing.js:873:      .publishing-status-pill.is-ready,
public/control-center/pages/publishing.js:874:      .publishing-status-pill.is-scheduled {
public/control-center/pages/publishing.js:878:      .publishing-status-pill.is-published {
public/control-center/pages/publishing.js:882:      .publishing-status-pill.is-failed {
public/control-center/pages/publishing.js:886:      .publishing-inline-error {
public/control-center/pages/publishing.js:893:      .publishing-calendar-row {
public/control-center/pages/publishing.js:904:      .publishing-calendar-row em {
public/control-center/pages/publishing.js:913:        .publishing-execution-grid {
public/control-center/pages/publishing.js:918:        .publishing-queue-row {
public/control-center/pages/publishing.js:923:        .publishing-queue-actions {
public/control-center/pages/publishing.js:937:function extractHandoffSummary(handoff) {
public/control-center/pages/publishing.js:938:  const payload = asObject(handoff?.payload);
public/control-center/pages/publishing.js:940:  const draftContext = asObject(payload.draft_context);
public/control-center/pages/publishing.js:942:    id: asString(handoff?.id || payload.workflow_id || payload.prompt || payload.workflow_title),
public/control-center/pages/publishing.js:943:    sourcePage: asString(handoff?.source_page || "workflows"),
public/control-center/pages/publishing.js:945:    title: firstText(output.title, payload.workflow_title, draftContext.lastResponseTitle, "Workflow output"),
public/control-center/pages/publishing.js:946:    project: firstText(draftContext.projectName, payload.project_name, output.project),
public/control-center/pages/publishing.js:948:    channel: firstText(output.channel, payload.channel),
public/control-center/pages/publishing.js:950:    summary: firstText(output.summary, output.description, payload.prompt, draftContext.lastCommand),
public/control-center/pages/publishing.js:957:    getSharedHandoff(projectName, "publishing", operations, "workflows") ||
public/control-center/pages/publishing.js:958:    getSharedHandoff(projectName, "publishing", operations, "ai-command") ||
public/control-center/pages/publishing.js:959:    getSharedHandoff(projectName, "publishing", operations)
public/control-center/pages/publishing.js:967:function buildRecommendation({ queue, counts, assetBlockers, checks, handoff, globalBlockers }) {
public/control-center/pages/publishing.js:968:  const failed = queue.find((item) => item.status === "failed");
public/control-center/pages/publishing.js:969:  const ready = queue.find((item) => item.status === "ready");
public/control-center/pages/publishing.js:970:  const needsApproval = queue.find((item) => item.status === "needs approval");
public/control-center/pages/publishing.js:971:  const draft = queue.find((item) => item.status === "draft");
public/control-center/pages/publishing.js:977:      action: "Retry failed publishing item",
public/control-center/pages/publishing.js:978:      why: `${failed.title} is blocked or failed. Clear the blocker before adding more scheduled work.`,
public/control-center/pages/publishing.js:983:  if (ready && !assetBlockers.length) {
public/control-center/pages/publishing.js:985:      action: "Publish the ready item",
public/control-center/pages/publishing.js:986:      why: `${ready.title} is approved and ready for execution. Publishing now converts completed workflow output into a live action.`,
public/control-center/pages/publishing.js:987:      focusId: ready.id
public/control-center/pages/publishing.js:992:      action: "Review approval queue",
public/control-center/pages/publishing.js:993:      why: `${needsApproval.title} needs approval before it can move into the publishable queue.`,
public/control-center/pages/publishing.js:998:  if (handoff) {
public/control-center/pages/publishing.js:1000:      action: "Load workflow output into a draft",
public/control-center/pages/publishing.js:1001:      why: "A workflow handoff is available. Loading it keeps execution moving without inventing backend data.",
public/control-center/pages/publishing.js:1006:  if (draft) {
public/control-center/pages/publishing.js:1008:      action: "Complete and schedule a draft",
public/control-center/pages/publishing.js:1009:      why: `${draft.title} is not yet executable. Add channel, content, approval, and timing details.`,
public/control-center/pages/publishing.js:1010:      focusId: draft.id,
public/control-center/pages/publishing.js:1015:    action: connectedCount ? "Create a publishing draft" : "Connect a publishing channel",
public/control-center/pages/publishing.js:1017:      ? "No queue item is ready. Start with a draft and save it locally until it can be scheduled."
public/control-center/pages/publishing.js:1018:      : "Channel readiness is missing. Publishing can prepare drafts, but live execution needs a connected destination.",
public/control-center/pages/publishing.js:1024:function renderOverview(counts, queue, escapeHtml) {
public/control-center/pages/publishing.js:1026:    <section class="card publishing-card">
public/control-center/pages/publishing.js:1032:        <span class="card-badge neutral">${escapeHtml(String(queue.length))} items</span>
public/control-center/pages/publishing.js:1034:      <div class="publishing-overview-grid">
public/control-center/pages/publishing.js:1035:        <div class="publishing-overview-item"><span>Scheduled items</span><strong>${escapeHtml(String(counts.scheduled))}</strong></div>
public/control-center/pages/publishing.js:1036:        <div class="publishing-overview-item"><span>Ready to publish</span><strong>${escapeHtml(String(counts.ready))}</strong></div>
public/control-center/pages/publishing.js:1037:        <div class="publishing-overview-item"><span>Draft items</span><strong>${escapeHtml(String(counts.draft))}</strong></div>
public/control-center/pages/publishing.js:1038:        <div class="publishing-overview-item"><span>Failed / blocked items</span><strong>${escapeHtml(String(counts.failed))}</strong></div>
public/control-center/pages/publishing.js:1039:        <div class="publishing-overview-item is-wide"><span>Next publish window</span><strong>${escapeHtml(getNextPublishWindow(queue))}</strong></div>
public/control-center/pages/publishing.js:1047:    ["Launch readiness", counts.ready + counts.scheduled > 0 ? "Active" : "Needs queue"],
public/control-center/pages/publishing.js:1048:    ["Content", counts.draft || counts.ready || counts.scheduled ? "Present" : "Empty"],
public/control-center/pages/publishing.js:1051:    ["Approval", counts["needs approval"] ? "Pending" : counts.ready ? "Approved" : "Draft"],
public/control-center/pages/publishing.js:1052:    ["Automation", counts.scheduled ? "Scheduled" : "Manual"]
public/control-center/pages/publishing.js:1056:    <section class="card publishing-card" id="publishingRecommendation">
public/control-center/pages/publishing.js:1061:          <p class="publishing-section-copy">${escapeHtml(recommendation.why)}</p>
public/control-center/pages/publishing.js:1065:      <div class="publishing-impact-row">
public/control-center/pages/publishing.js:1067:          <span class="publishing-impact-chip">
public/control-center/pages/publishing.js:1073:      <div class="publishing-action-row">
public/control-center/pages/publishing.js:1074:        <button id="publishingOpenQueueBtn" class="btn btn-secondary" type="button">Open Publish Queue</button>
public/control-center/pages/publishing.js:1075:        <button id="publishingSaveDraftBtn" class="btn btn-secondary" type="button">Save publishing draft</button>
public/control-center/pages/publishing.js:1076:        <button id="publishingPushAiBtn" class="btn btn-primary" type="button">Send publishing context to AI</button>
public/control-center/pages/publishing.js:1077:        <button id="publishingAutoPrepareBtn" class="btn btn-secondary" type="button">Auto-prepare publishing plan</button>
public/control-center/pages/publishing.js:1078:        <button id="publishingAutoStopBtn" class="btn btn-secondary" type="button">Stop Auto Mode</button>
public/control-center/pages/publishing.js:1080:      <details class="publishing-automation-preview publishing-block-gap">
public/control-center/pages/publishing.js:1082:        <div class="publishing-automation-preview-copy">Automation cannot publish without manual review, confirmation, and backend approval gates.</div>
public/control-center/pages/publishing.js:1083:        <div class="simple-banner publishing-inline-gap">Auto Mode status: ${escapeHtml(getAutoModeState().status || "idle")}</div>
public/control-center/pages/publishing.js:1085:          <div class="simple-banner publishing-block-gap">Cross-system blockers: ${escapeHtml(asArray(recommendation.externalBlockers).map((item) => item.title).join("; "))}</div>
public/control-center/pages/publishing.js:1087:        ${publishingAutomationState.progress ? `<div class="simple-banner publishing-block-gap">${escapeHtml(publishingAutomationState.progress)}</div>` : ""}
public/control-center/pages/publishing.js:1088:        ${publishingAutomationState.result ? `<div class="simple-banner publishing-inline-gap">${escapeHtml(publishingAutomationState.result)}</div>` : ""}
public/control-center/pages/publishing.js:1089:        ${getAutoModeState().status === "waiting_approval" ? `
public/control-center/pages/publishing.js:1090:          <div class="simple-banner publishing-inline-gap"><strong>Approval needed:</strong> ${escapeHtml(asObject(getAutoModeState().approvalRequiredStep).reason || "Manual approval required.")}</div>
public/control-center/pages/publishing.js:1091:          <div class="publishing-action-row publishing-inline-gap">
public/control-center/pages/publishing.js:1092:            <button id="publishingAutoApproveBtn" class="btn btn-secondary" type="button">Approve automation step</button>
public/control-center/pages/publishing.js:1093:            <button id="publishingAutoSkipBtn" class="btn btn-secondary" type="button">Skip automation step</button>
public/control-center/pages/publishing.js:1097:      <div class="simple-banner">Opens AI with this context only. <strong>No approval, publishing, or backend execution is performed.</strong></div>
public/control-center/pages/publishing.js:1102:function renderFilterRow(filter, queue, escapeHtml) {
public/control-center/pages/publishing.js:1103:  const counts = getStatusCounts(queue);
public/control-center/pages/publishing.js:1107:    <div class="publishing-filter-row">
public/control-center/pages/publishing.js:1110:        const count = status === "all" ? queue.length : counts[status];
public/control-center/pages/publishing.js:1112:          <button class="publishing-filter-chip${active ? " is-active" : ""}" type="button" data-publishing-filter="${escapeHtml(status)}">
public/control-center/pages/publishing.js:1122:function renderQueue(queue, visibleQueue, selectedId, filter, escapeHtml) {
public/control-center/pages/publishing.js:1125:      <article class="publishing-queue-row${item.id === selectedId ? " is-active" : ""}" data-publishing-row="${escapeHtml(item.id)}">
public/control-center/pages/publishing.js:1126:        <button class="publishing-queue-main" type="button" data-publishing-select="${escapeHtml(item.id)}">
public/control-center/pages/publishing.js:1127:          <span class="publishing-queue-title">${escapeHtml(item.title)}</span>
public/control-center/pages/publishing.js:1128:          <span class="publishing-queue-meta">${escapeHtml(titleCase(item.channel || "unassigned"))} • ${escapeHtml(item.scheduledFor ? formatDateTime(item.scheduledFor) : "Unscheduled")} • ${escapeHtml(item.source)}</span>
public/control-center/pages/publishing.js:1130:        <div class="publishing-queue-state">${renderStatusPill(item.status, escapeHtml)}</div>
public/control-center/pages/publishing.js:1131:        <div class="publishing-queue-actions">
public/control-center/pages/publishing.js:1132:          <button type="button" data-publishing-action="review" data-publishing-id="${escapeHtml(item.id)}">Review Package</button>
public/control-center/pages/publishing.js:1133:          <button type="button" data-publishing-action="schedule" data-publishing-id="${escapeHtml(item.id)}">Queue for Manual Publishing</button>
public/control-center/pages/publishing.js:1134:          <button type="button" data-publishing-action="publish" data-publishing-id="${escapeHtml(item.id)}">Prepare Publishing Package</button>
public/control-center/pages/publishing.js:1135:          <button type="button" data-publishing-action="pause" data-publishing-id="${escapeHtml(item.id)}">Pause to draft</button>
public/control-center/pages/publishing.js:1136:          <button type="button" data-publishing-action="retry" data-publishing-id="${escapeHtml(item.id)}">Retry scheduled item</button>
public/control-center/pages/publishing.js:1140:    : `<div class="empty-box">No publish queue items match this filter. Create or load a draft to start the execution queue.</div>`;
public/control-center/pages/publishing.js:1143:    <section class="card publishing-card" id="publishingQueuePanel">
public/control-center/pages/publishing.js:1151:      ${renderFilterRow(filter, queue, escapeHtml)}
public/control-center/pages/publishing.js:1152:      <div class="publishing-queue-list">${rows}</div>
public/control-center/pages/publishing.js:1157:function renderBuilder(session, channels, checks, escapeHtml) {
public/control-center/pages/publishing.js:1159:    <section class="card publishing-card" id="publishingBuilderPanel">
public/control-center/pages/publishing.js:1163:          <h3>Draft, validate, schedule, and execute</h3>
public/control-center/pages/publishing.js:1167:      <form id="publishingBuilderForm" class="setup-form-grid publishing-builder-form" novalidate>
public/control-center/pages/publishing.js:1171:              <label class="setup-label" for="publishingProjectInput">Project</label>
public/control-center/pages/publishing.js:1174:            <input id="publishingProjectInput" name="project" class="setup-input" type="text" value="${escapeHtml(session.form.project)}" placeholder="Project name">
public/control-center/pages/publishing.js:1179:              <label class="setup-label" for="publishingCampaignInput">Campaign</label>
public/control-center/pages/publishing.js:1182:            <input id="publishingCampaignInput" name="campaign" class="setup-input" type="text" value="${escapeHtml(session.form.campaign)}" placeholder="Campaign or launch wave">
public/control-center/pages/publishing.js:1190:              <label class="setup-label" for="publishingChannelInput">Channel</label>
public/control-center/pages/publishing.js:1191:              <span class="setup-field-state is-optional">${escapeHtml(checks[toKey(session.form.channel)] ? "Ready" : "Planning")}</span>
public/control-center/pages/publishing.js:1193:            <select id="publishingChannelInput" name="channel" class="setup-input">
public/control-center/pages/publishing.js:1194:              <option value="">Choose channel</option>
public/control-center/pages/publishing.js:1195:              ${channels.map((channel) => `
public/control-center/pages/publishing.js:1196:                <option value="${escapeHtml(channel)}"${channel === session.form.channel ? " selected" : ""}>${escapeHtml(titleCase(channel))}</option>
public/control-center/pages/publishing.js:1199:            ${fieldError(session, "channel", escapeHtml)}
public/control-center/pages/publishing.js:1203:              <label class="setup-label" for="publishingContentInput">Content item</label>
public/control-center/pages/publishing.js:1206:            <input id="publishingContentInput" name="contentItem" class="setup-input" type="text" value="${escapeHtml(session.form.contentItem)}" placeholder="Caption, email, product update, or workflow output">
public/control-center/pages/publishing.js:1214:              <label class="setup-label" for="publishingDateInput">Publish date</label>
public/control-center/pages/publishing.js:1217:            <input id="publishingDateInput" name="publishDate" class="setup-input" type="date" value="${escapeHtml(session.form.publishDate)}">
public/control-center/pages/publishing.js:1218:            ${fieldError(session, "publishDate", escapeHtml)}
public/control-center/pages/publishing.js:1222:              <label class="setup-label" for="publishingTimeInput">Publish time</label>
public/control-center/pages/publishing.js:1225:            <input id="publishingTimeInput" name="publishTime" class="setup-input" type="time" value="${escapeHtml(session.form.publishTime)}">
public/control-center/pages/publishing.js:1229:              <label class="setup-label" for="publishingApprovalInput">Approval status</label>
public/control-center/pages/publishing.js:1232:            <select id="publishingApprovalInput" name="approvalStatus" class="setup-input">
public/control-center/pages/publishing.js:1234:                <option value="${escapeHtml(status)}"${status === session.form.approvalStatus ? " selected" : ""}>${escapeHtml(titleCase(status))}</option>
public/control-center/pages/publishing.js:1237:            ${fieldError(session, "approvalStatus", escapeHtml)}
public/control-center/pages/publishing.js:1243:            <label class="setup-label" for="publishingTitleInput">Queue title</label>
public/control-center/pages/publishing.js:1246:          <input id="publishingTitleInput" name="title" class="setup-input" type="text" value="${escapeHtml(session.form.title)}" placeholder="Operator-facing title">
public/control-center/pages/publishing.js:1251:            <label class="setup-label" for="publishingNotesInput">Execution notes</label>
public/control-center/pages/publishing.js:1254:          <textarea id="publishingNotesInput" name="notes" class="setup-input setup-textarea" rows="4" placeholder="Approval notes, blockers, manual steps, content references">${escapeHtml(session.form.notes)}</textarea>
public/control-center/pages/publishing.js:1257:      <div class="publishing-form-actions">
public/control-center/pages/publishing.js:1258:        <button id="publishingNewItemBtn" class="btn btn-secondary" type="button">New Draft</button>
public/control-center/pages/publishing.js:1259:        <button id="publishingBuilderSaveBtn" class="btn btn-secondary" type="button">Save publishing draft</button>
public/control-center/pages/publishing.js:1260:        <button id="publishingScheduleBtn" class="btn btn-primary" type="button">Queue for Manual Publishing</button>
public/control-center/pages/publishing.js:1262:      ${session.draftMessage ? `<div class="simple-banner">${escapeHtml(session.draftMessage)}</div>` : ""}
public/control-center/pages/publishing.js:1267:function renderWorkflowHandoff(handoff, session, escapeHtml) {
public/control-center/pages/publishing.js:1268:  if (!handoff) {
public/control-center/pages/publishing.js:1270:      <section class="card publishing-card">
public/control-center/pages/publishing.js:1278:        <div class="empty-box">Run or route a workflow into Publishing to load execution-ready output here.</div>
public/control-center/pages/publishing.js:1283:  const summary = extractHandoffSummary(handoff);
public/control-center/pages/publishing.js:1286:    <section class="card publishing-card" id="publishingHandoffPanel">
public/control-center/pages/publishing.js:1291:          <p class="publishing-section-copy">${escapeHtml(summarizeText(summary.summary, "Workflow output is available for draft loading."))}</p>
public/control-center/pages/publishing.js:1299:        <div class="data-row"><span>Channel</span><strong>${escapeHtml(summary.channel || "Not specified")}</strong></div>
public/control-center/pages/publishing.js:1301:      <div class="publishing-action-row">
public/control-center/pages/publishing.js:1302:        <button id="publishingLoadHandoffBtn" class="btn btn-secondary" type="button">Load Workflow Output</button>
public/control-center/pages/publishing.js:1308:function renderCalendar(queue, escapeHtml) {
public/control-center/pages/publishing.js:1310:  const scheduled = queue.filter((item) => item.scheduledFor);
public/control-center/pages/publishing.js:1311:  const future = scheduled.filter((item) => toDate(item.scheduledFor)?.getTime() > now);
public/control-center/pages/publishing.js:1312:  const past = scheduled.filter((item) => toDate(item.scheduledFor)?.getTime() <= now);
public/control-center/pages/publishing.js:1316:      <section class="card publishing-card">
public/control-center/pages/publishing.js:1320:            <h3>No scheduled window</h3>
public/control-center/pages/publishing.js:1324:        <div class="empty-box">Scheduled publishing items will appear here once timing exists in the queue.</div>
public/control-center/pages/publishing.js:1332:      <div class="publishing-calendar-list">
public/control-center/pages/publishing.js:1334:          <button class="publishing-calendar-row" type="button" data-publishing-select="${escapeHtml(item.id)}">
public/control-center/pages/publishing.js:1335:            <span>${escapeHtml(formatDate(item.scheduledFor))}</span>
public/control-center/pages/publishing.js:1336:            <strong>${escapeHtml(formatTime(item.scheduledFor))}</strong>
public/control-center/pages/publishing.js:1346:      <div class="publishing-calendar-list publishing-block-gap">
public/control-center/pages/publishing.js:1347:        <div class="simple-banner publishing-block-gap publishing-past-schedule-warning">Past scheduled items — reschedule required</div>
public/control-center/pages/publishing.js:1349:          <button class="publishing-calendar-row" type="button" data-publishing-select="${escapeHtml(item.id)}">
public/control-center/pages/publishing.js:1350:            <span>${escapeHtml(formatDate(item.scheduledFor))}</span>
public/control-center/pages/publishing.js:1351:            <strong>${escapeHtml(formatTime(item.scheduledFor))}</strong>
public/control-center/pages/publishing.js:1361:    <section class="card publishing-card">
public/control-center/pages/publishing.js:1365:          <h3>${future.length ? "Upcoming scheduled items" : "Past scheduled items — reschedule required"}</h3>
public/control-center/pages/publishing.js:1374:function renderExecutionResult(queue, escapeHtml) {
public/control-center/pages/publishing.js:1375:  const latest = queue
public/control-center/pages/publishing.js:1376:    .filter((item) => item.executedAt || item.status === "failed")
public/control-center/pages/publishing.js:1377:    .sort((a, b) => (toDate(b.executedAt || b.updatedAt)?.getTime() || 0) - (toDate(a.executedAt || a.updatedAt)?.getTime() || 0))[0];
public/control-center/pages/publishing.js:1378:  const failed = queue.filter((item) => item.status === "failed");
public/control-center/pages/publishing.js:1382:      <section class="card publishing-card">
public/control-center/pages/publishing.js:1386:            <h3>No publish result yet</h3>
public/control-center/pages/publishing.js:1390:        <div class="empty-box">Last publish result and failed publish blockers will appear here after execution data exists.</div>
public/control-center/pages/publishing.js:1396:    <section class="card publishing-card">
public/control-center/pages/publishing.js:1400:          <h3>${escapeHtml(latest ? latest.title : "Failed publish blockers")}</h3>
public/control-center/pages/publishing.js:1407:          <div class="data-row"><span>Executed</span><strong>${escapeHtml(formatDateTime(latest.executedAt, "Not executed"))}</strong></div>
public/control-center/pages/publishing.js:1408:          <div class="data-row"><span>Channel</span><strong>${escapeHtml(titleCase(latest.channel || "unassigned"))}</strong></div>
public/control-center/pages/publishing.js:1412:        <div class="publishing-blocker-list">
public/control-center/pages/publishing.js:1414:            <div class="simple-banner">${escapeHtml(item.title)}: ${escapeHtml(normalizeNotes(item.notes).join("; ") || "Failed publish needs review.")}</div>
public/control-center/pages/publishing.js:1427:    <section class="card publishing-card">
public/control-center/pages/publishing.js:1436:      <div class="simple-banner publishing-block-gap">${escapeHtml(getAssetNextAction(assetData, PUBLISHING_ASSET_KEYS))}</div>
public/control-center/pages/publishing.js:1461:  reschedulePublishingItem,
public/control-center/pages/publishing.js:1462:  approvePublishingItem,
public/control-center/pages/publishing.js:1463:  publishPublishingItem,
public/control-center/pages/publishing.js:1466:  queue,
public/control-center/pages/publishing.js:1467:  handoff
public/control-center/pages/publishing.js:1477:    schedulePublishingRender(render);
public/control-center/pages/publishing.js:1482:    return getSelectedItem(queue, session.selectedId);
public/control-center/pages/publishing.js:1485:  function saveDraftLocally(message = "Publishing draft saved locally.") {
public/control-center/pages/publishing.js:1486:    const local = saveLocalDraft(projectName, buildLocalDraftPayload(session, "draft"));
public/control-center/pages/publishing.js:1490:    session.draftMessage = message;
public/control-center/pages/publishing.js:1496:    const local = saveDraftLocally("Publishing draft saved locally.");
public/control-center/pages/publishing.js:1499:        () => savePublishingSchedule(projectName, buildSchedulePayload(session, "draft")),
public/control-center/pages/publishing.js:1505:          successMessage: "Publishing draft saved."
public/control-center/pages/publishing.js:1517:  Array.from(document.querySelectorAll("[data-publishing-filter]")).forEach((button) => {
public/control-center/pages/publishing.js:1519:      session.filter = button.getAttribute("data-publishing-filter") || "all";
public/control-center/pages/publishing.js:1524:  Array.from(document.querySelectorAll("[data-publishing-select]")).forEach((button) => {
public/control-center/pages/publishing.js:1526:      const itemId = button.getAttribute("data-publishing-select") || "";
public/control-center/pages/publishing.js:1528:      syncFormFromItem(session, getSelectedItem(queue, itemId));
public/control-center/pages/publishing.js:1533:  const form = $("publishingBuilderForm");
public/control-center/pages/publishing.js:1544:  const newBtn = $("publishingNewItemBtn");
public/control-center/pages/publishing.js:1548:      showMessage?.("New publishing draft opened.");
public/control-center/pages/publishing.js:1553:  const openQueueBtn = $("publishingOpenQueueBtn");
public/control-center/pages/publishing.js:1556:      document.getElementById("publishingQueuePanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
public/control-center/pages/publishing.js:1560:  const saveDraftButtons = [$("publishingSaveDraftBtn"), $("publishingBuilderSaveBtn")].filter(Boolean);
public/control-center/pages/publishing.js:1564:      if (!validateBuilder(session, "draft")) {
public/control-center/pages/publishing.js:1573:  const scheduleBtn = $("publishingScheduleBtn");
public/control-center/pages/publishing.js:1574:  if (scheduleBtn) {
public/control-center/pages/publishing.js:1575:    scheduleBtn.onclick = async () => {
public/control-center/pages/publishing.js:1577:      if (!validateBuilder(session, "schedule")) {
public/control-center/pages/publishing.js:1583:      const payload = buildSchedulePayload(session, "scheduled");
public/control-center/pages/publishing.js:1590:          ...buildLocalDraftPayload(session, "scheduled"),
public/control-center/pages/publishing.js:1593:        session.draftMessage = "Local publishing draft scheduled in this browser.";
public/control-center/pages/publishing.js:1594:        showMessage?.(session.draftMessage);
public/control-center/pages/publishing.js:1599:      const confirmed = confirmPublishingBackendAction(
public/control-center/pages/publishing.js:1601:          ? "Confirm reschedule\n\nAction: Reschedule this publishing item.\n\nThis updates a backend publishing schedule and remains governed by approval rules.\n\nSelect Cancel to keep the current schedule."
public/control-center/pages/publishing.js:1602:          : "Confirm schedule\n\nAction: Queue this publishing item for manual publishing.\n\nThis creates a backend publishing schedule and remains governed by approval rules.\n\nSelect Cancel to keep this as a draft."
public/control-center/pages/publishing.js:1604:      if (!confirmed) {
public/control-center/pages/publishing.js:1610:        ? () => reschedulePublishingItem(projectName, current.jobId, payload)
public/control-center/pages/publishing.js:1618:        successMessage: current ? "Publishing item scheduled." : "Publishing schedule saved."
public/control-center/pages/publishing.js:1625:        saveDraftLocally("Backend schedule unavailable; draft kept locally.");
public/control-center/pages/publishing.js:1631:  Array.from(document.querySelectorAll("[data-publishing-action]")).forEach((button) => {
public/control-center/pages/publishing.js:1633:      const itemId = button.getAttribute("data-publishing-id") || "";
public/control-center/pages/publishing.js:1634:      const action = button.getAttribute("data-publishing-action") || "";
public/control-center/pages/publishing.js:1635:      const item = getSelectedItem(queue, itemId);
public/control-center/pages/publishing.js:1646:      if (action === "schedule") {
public/control-center/pages/publishing.js:1647:        document.getElementById("publishingBuilderPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
public/control-center/pages/publishing.js:1652:      const intent = action === "publish" ? "publish" : action === "retry" ? "retry" : "draft";
public/control-center/pages/publishing.js:1659:        const nextStatus = action === "pause" ? "draft" : action === "retry" ? "scheduled" : action === "publish" ? "published" : item.status;
public/control-center/pages/publishing.js:1661:        session.draftMessage = `Local draft ${action === "publish" ? "marked published" : action === "pause" ? "paused" : "updated"}.`;
public/control-center/pages/publishing.js:1662:        showMessage?.(session.draftMessage);
public/control-center/pages/publishing.js:1667:      if (action === "publish") {
public/control-center/pages/publishing.js:1668:        if (guardPublishingAssetBlockers(session, assetBlockers, showMessage, "publishing")) {
public/control-center/pages/publishing.js:1673:        const confirmed = window.confirm(
public/control-center/pages/publishing.js:1674:          "Final Confirmation Required\n\nAction: Publish this item to configured channels.\n\nThis is a high-risk, final step. Please verify channel, source, schedule, and approval status.\n\nPublishing is always confirmation-gated and governed by backend approval rules.\nApproval and governance gates must be satisfied before execution.\n\nSelect Cancel to keep this item in the queue."
public/control-center/pages/publishing.js:1676:        if (!confirmed) {
public/control-center/pages/publishing.js:1681:          () => publishPublishingItem(projectName, item.jobId, { notes: session.form.notes || item.notes }),
public/control-center/pages/publishing.js:1682:          { projectName, reloadProjectData, showMessage, showError, successMessage: "Publishing item marked as published." }
public/control-center/pages/publishing.js:1686:        const confirmed = confirmPublishingBackendAction(
public/control-center/pages/publishing.js:1687:          "Confirm pause\n\nAction: Move this backend publishing item back to draft.\n\nThis updates the backend publishing lifecycle state.\n\nSelect Cancel to keep the item unchanged."
public/control-center/pages/publishing.js:1689:        if (!confirmed) {
public/control-center/pages/publishing.js:1695:          () => reschedulePublishingItem(projectName, item.jobId, buildSchedulePayload(session, "draft")),
public/control-center/pages/publishing.js:1696:          { projectName, reloadProjectData, showMessage, showError, successMessage: "Publishing item paused as a draft.\n\nConfirmation required before execution. Backend approval rules apply." }
public/control-center/pages/publishing.js:1705:        const confirmed = confirmPublishingBackendAction(
public/control-center/pages/publishing.js:1706:          "Confirm retry\n\nAction: Retry this backend publishing item in the scheduled queue.\n\nThis updates the backend publishing schedule/lifecycle state and remains governed by approval rules.\n\nSelect Cancel to keep the item unchanged."
public/control-center/pages/publishing.js:1708:        if (!confirmed) {
public/control-center/pages/publishing.js:1714:          () => reschedulePublishingItem(projectName, item.jobId, buildSchedulePayload(session, "scheduled")),
public/control-center/pages/publishing.js:1715:          { projectName, reloadProjectData, showMessage, showError, successMessage: "Publishing item retried in the scheduled queue.\n\nConfirmation required before execution. Backend approval rules apply." }
public/control-center/pages/publishing.js:1722:  const approveBtn = $("publishingApproveBtn");
public/control-center/pages/publishing.js:1723:  if (approveBtn) {
public/control-center/pages/publishing.js:1724:    approveBtn.onclick = async () => {
public/control-center/pages/publishing.js:1727:        session.validation.contentItem = "Select or save a publishing draft before approval.";
public/control-center/pages/publishing.js:1731:      session.form.approvalStatus = "approved";
public/control-center/pages/publishing.js:1733:        updateLocalDraft(projectName, current.id, { ...buildLocalDraftPayload(session, "ready"), id: current.id, approvalStatus: "approved" });
public/control-center/pages/publishing.js:1734:        showMessage?.("Local publishing draft approved.");
public/control-center/pages/publishing.js:1739:      const confirmed = confirmPublishingBackendAction(
public/control-center/pages/publishing.js:1740:        "Confirm approval\n\nAction: Mark this backend publishing item ready for publishing.\n\nApproval moves the item toward publishable readiness and remains governed by backend rules.\n\nSelect Cancel to keep the item unchanged."
public/control-center/pages/publishing.js:1742:      if (!confirmed) {
public/control-center/pages/publishing.js:1748:        () => approvePublishingItem(projectName, current.jobId, { notes: session.form.notes || current.notes }),
public/control-center/pages/publishing.js:1749:        { projectName, reloadProjectData, showMessage, showError, successMessage: "Publishing item approved and marked ready." }
public/control-center/pages/publishing.js:1755:  const failBtn = $("publishingFailBtn");
public/control-center/pages/publishing.js:1760:        session.validation.contentItem = "Select a publishing item before marking it failed.";
public/control-center/pages/publishing.js:1766:        showMessage?.("Local publishing draft marked failed.");
public/control-center/pages/publishing.js:1771:      const confirmed = window.confirm("Confirm fail action\n\nAction: Mark this publishing item as failed.\nRisk: This creates a permanent failure record and stops the publishing lifecycle for this item.\nPolicy: Use only when this item cannot proceed and requires explicit failure logging.\n\nSelect Cancel to keep this item in its current state.");
public/control-center/pages/publishing.js:1772:      if (!confirmed) {
public/control-center/pages/publishing.js:1785:  const loadHandoffBtn = $("publishingLoadHandoffBtn");
public/control-center/pages/publishing.js:1788:      const summary = extractHandoffSummary(handoff);
public/control-center/pages/publishing.js:1793:        channel: toKey(firstText(summary.channel, session.form.channel)),
public/control-center/pages/publishing.js:1803:      saveDraftLocally("Workflow output loaded into a local publishing draft.");
public/control-center/pages/publishing.js:1808:  const pushAiBtn = $("publishingPushAiBtn");
public/control-center/pages/publishing.js:1813:      const prompt = buildPublishingAiPrompt(projectName, current, session, handoff);
public/control-center/pages/publishing.js:1824:        source_page: "publishing",
public/control-center/pages/publishing.js:1827:          entity_type: "publishing_job",
public/control-center/pages/publishing.js:1832:          publishing_item_id: current?.jobId || session.formSourceId || "",
public/control-center/pages/publishing.js:1833:          publishing_title: current?.title || session.form.title || "",
public/control-center/pages/publishing.js:1834:          draft_context: aiDraft,
public/control-center/pages/publishing.js:1836:            status: current?.status || "draft",
public/control-center/pages/publishing.js:1837:            channel: session.form.channel || current?.channel || "",
public/control-center/pages/publishing.js:1838:            scheduled_for: buildScheduleTime(session.form) || current?.scheduledFor || "",
public/control-center/pages/publishing.js:1849:  const autoPrepareBtn = $("publishingAutoPrepareBtn");
public/control-center/pages/publishing.js:1854:        publishingAutomationState.progress = "";
public/control-center/pages/publishing.js:1855:        publishingAutomationState.result = "No safe publishing preparation steps available.";
public/control-center/pages/publishing.js:1860:      publishingAutomationState.result = "";
public/control-center/pages/publishing.js:1861:      publishingAutomationState.progress = `Step 0 / ${plan.length}`;
public/control-center/pages/publishing.js:1862:      publishingAutomationEnabled = true;
public/control-center/pages/publishing.js:1867:        mode: "auto_until_approval",
public/control-center/pages/publishing.js:1870:        publishingAutomationState.progress = `Step ${index} / ${total}: ${step.action} (${result.status})`;
public/control-center/pages/publishing.js:1871:        schedulePublishingRender(render);
public/control-center/pages/publishing.js:1875:      publishingAutomationState.result = runResult.status === "success"
public/control-center/pages/publishing.js:1878:      showMessage?.(publishingAutomationState.result);
public/control-center/pages/publishing.js:1883:  const autoStopBtn = $("publishingAutoStopBtn");
public/control-center/pages/publishing.js:1891:  const autoApproveBtn = $("publishingAutoApproveBtn");
public/control-center/pages/publishing.js:1894:      await approveCurrentGate({ context: { getState, navigateTo, projectName } });
public/control-center/pages/publishing.js:1899:  const autoSkipBtn = $("publishingAutoSkipBtn");
public/control-center/pages/publishing.js:1908:export const publishingRoute = {
public/control-center/pages/publishing.js:1909:  id: "publishing",
public/control-center/pages/publishing.js:1914:    description: "Review, approve, schedule, and control publishing with clear previews and real backend actions."
public/control-center/pages/publishing.js:1917:    <section class="page is-active" data-page="publishing">
public/control-center/pages/publishing.js:1918:      <div id="publishingRoot"></div>
public/control-center/pages/publishing.js:1931:    reschedulePublishingItem,
public/control-center/pages/publishing.js:1932:    approvePublishingItem,
public/control-center/pages/publishing.js:1933:    publishPublishingItem,
public/control-center/pages/publishing.js:1939:    const queue = buildQueue(state, projectName);

## Related handoff markers
public/control-center/pages/library.js:104:    why: "Logos keep brand identity consistent across setup, media generation, and publishing.",
public/control-center/pages/library.js:118:    why: "Product data anchors facts, variants, and claims for campaign and publishing.",
public/control-center/pages/library.js:625:  if (normalized.includes("publishing_ready")) return "publishing_ready";
public/control-center/pages/library.js:626:  if (normalized.includes("sent_to_publishing")) return "sent_to_publishing";
public/control-center/pages/library.js:639:  if (value === "publishing_ready") return "Publishing Ready";
public/control-center/pages/library.js:640:  if (value === "sent_to_publishing") return "Sent to Publishing";
public/control-center/pages/library.js:651:  if (value === "publishing_ready" || value === "sent_to_publishing") return "success";
public/control-center/pages/library.js:774:  if (["publishing_ready", "sent_to_publishing"].includes(normalizeReadinessStatus(asset.status))) return "publishing_ready_asset";
public/control-center/pages/library.js:1026:      || (selectedSource === "publishing-ready" && ["publishing_ready", "sent_to_publishing"].includes(normalizeReadinessStatus(asset.status)));
public/control-center/pages/library.js:1595:    { value: "publishing-ready", label: "Publishing Ready" }
public/control-center/pages/library.js:1609:          <li>Use selected assets in AI Team, Content, Media, Publishing, Governance, and Insights.</li>
public/control-center/pages/library.js:2359:      const confirmed = status === "approved" ? true : confirm(`Confirm asset status change\n\nAction: Set asset status to "${status}".\nRisk: This updates Library readiness metadata and may affect downstream review/publishing visibility. It does not publish anything.\n\nSelect Cancel to keep the current status.`);
public/control-center/pages/library.js:3029:            <p class="card-subtitle">Upload or register asset candidates. Approval, source-of-truth status, and publishing readiness remain separate steps.</p>
public/control-center/pages/library.js:3099:                    <option value="publishing_ready">Publishing ready</option>
public/control-center/pages/library.js:3100:                    <option value="sent_to_publishing">Sent to publishing</option>
public/control-center/pages/media-studio-workspace.js:32:const MEDIA_STATUSES = ["draft", "prompt_ready", "generating", "needs_review", "approved", "publishing_ready", "sent_to_publishing", "failed"];
public/control-center/pages/media-studio-workspace.js:33:const MEDIA_PREVIEW_STATES = ["provider_not_configured", "generation_error", "prompt_ready", "generated", "saved_to_library", "needs_review", "approved", "publishing_ready", "sent_to_publishing"];
public/control-center/pages/media-studio-workspace.js:71:    bestUse: "Before approvals and publishing handoff, especially for regulated or claim-sensitive content.",
public/control-center/pages/media-studio-workspace.js:82:    id: "publishing-assistant",
public/control-center/pages/media-studio-workspace.js:83:    title: "Publishing Assistant",
public/control-center/pages/media-studio-workspace.js:84:    purpose: "Finalize readiness signals and handoff payload quality before publishing.",
public/control-center/pages/media-studio-workspace.js:85:    bestUse: "Right before preparing a Publishing package for downstream review.",
public/control-center/pages/media-studio-workspace.js:86:    suggestedPrompt: "Act as Publishing Assistant. Produce a final publishing handoff summary with readiness status, blockers, approval notes, and channel delivery checklist."
public/control-center/pages/media-studio-workspace.js:170:  if (["publishing_ready", "publishing ready", "handoff", "ready_for_publishing"].includes(normalized)) return "publishing_ready";
public/control-center/pages/media-studio-workspace.js:171:  if (["sent_to_publishing", "sent to publishing", "sent"].includes(normalized)) return "sent_to_publishing";
public/control-center/pages/media-studio-workspace.js:177:  if (status === "approved" || status === "publishing_ready" || status === "sent_to_publishing") return "success";
public/control-center/pages/media-studio-workspace.js:279:    objective: firstText(overview.primary_goal, overview.goal, "Create publishing-ready media"),
public/control-center/pages/media-studio-workspace.js:528:    publishing_job_id: asString(raw.publishing_job_id || ""),
public/control-center/pages/media-studio-workspace.js:557:    publishing_ready: 1,
public/control-center/pages/media-studio-workspace.js:558:    sent_to_publishing: 2,
public/control-center/pages/media-studio-workspace.js:792:    `Create ${form.outputPurpose || "publishing-ready media"} for ${form.product || overview.project_name || "the product"}.`,
public/control-center/pages/media-studio-workspace.js:797:    "Keep product identity accurate, leave safe text area, avoid unsupported claims, and prepare for Publishing handoff."
public/control-center/pages/media-studio-workspace.js:803:  return `${base}\n\nProduction constraints: accurate product identity, clean composition, strong focal hierarchy, channel-safe crop, no unsupported claims, no cluttered text, and enough negative space for publishing copy.`;
public/control-center/pages/media-studio-workspace.js:839:    `${contextPrompt}\n\nCampaign pack outputs: image hero, video short, voiceover script, channel cutdowns, and publishing-ready metadata.`
public/control-center/pages/media-studio-workspace.js:941:  if (["approved", "publishing_ready", "sent_to_publishing"].includes(normalized)) return "approved";
public/control-center/pages/media-studio-workspace.js:957:  if (["publishing_ready", "sent_to_publishing", "approved"].includes(normalizeStatus(readiness.readinessStatus, "draft"))) {
public/control-center/pages/media-studio-workspace.js:958:    usage.push("publishing");
public/control-center/pages/media-studio-workspace.js:1135:    version.readiness_status = "publishing_ready";
public/control-center/pages/media-studio-workspace.js:1136:    session.form.status = "publishing_ready";
public/control-center/pages/media-studio-workspace.js:1140:  saveDraftToSession(projectName, state, session, normalizeStatus(session.form.status || version.readiness_status || "publishing_ready", "publishing_ready"));
public/control-center/pages/media-studio-workspace.js:1179:    readyAssets: counts.approved + counts.publishing_ready + counts.sent_to_publishing,
public/control-center/pages/media-studio-workspace.js:1183:    publishingReady: counts.publishing_ready,
public/control-center/pages/media-studio-workspace.js:1203:  const ready = selectedItem?.status === "publishing_ready" ? selectedItem : null;
public/control-center/pages/media-studio-workspace.js:1206:      action: "Prepare Publishing Package",
public/control-center/pages/media-studio-workspace.js:1207:      why: `${ready.title} is ready for a safe Publishing package handoff.`
public/control-center/pages/media-studio-workspace.js:1224:    why: "No media job is ready yet. Start with a brief, build a brand-safe prompt, then review and prepare a Publishing package."
public/control-center/pages/media-studio-workspace.js:1241:  const publishingConnected = hasBackend || capabilityFromOperations(operations, ["publishing", "handoff"]);
public/control-center/pages/media-studio-workspace.js:1248:    publishing_handoff: publishingConnected,
public/control-center/pages/media-studio-workspace.js:1441:      .media-status-pill.is-publishing-ready {
public/control-center/pages/media-studio-workspace.js:1451:      .media-status-pill.is-sent-to-publishing {
public/control-center/pages/media-studio-workspace.js:1597:  if (normalized === "publishing_ready") return "Package Ready";
public/control-center/pages/media-studio-workspace.js:1598:  if (normalized === "sent_to_publishing") return "Handoff Prepared";
public/control-center/pages/media-studio-workspace.js:1668:  const packageReady = ["publishing_ready", "sent_to_publishing", "approved"].includes(readiness.readinessStatus) && hasOutput;
public/control-center/pages/media-studio-workspace.js:1698:      key: "publishing",
public/control-center/pages/media-studio-workspace.js:1699:      label: "Publishing",
public/control-center/pages/media-studio-workspace.js:1703:        ? "Selected version can be prepared as a Publishing package."
public/control-center/pages/media-studio-workspace.js:1748:          <p class="media-section-copy">Start by choosing Image, Video, Voice, or Campaign Pack. Generate a prompt first, then use Generate Output only when a provider/backend is connected. Save drafts for review, save reusable results to Library, or prepare a Publishing handoff without publishing directly.</p>
public/control-center/pages/media-studio-workspace.js:1768:        <button id="mediaSendToPublishingBtn" class="btn btn-primary" type="button">Prepare Publishing Package</button>
public/control-center/pages/media-studio-workspace.js:1783:  const handoffPrepared = readiness.readinessStatus === "sent_to_publishing";
public/control-center/pages/media-studio-workspace.js:1784:  const packageReady = ["publishing_ready", "approved", "sent_to_publishing"].includes(readiness.readinessStatus) && hasOutput;
public/control-center/pages/media-studio-workspace.js:1804:      state: ["approved", "publishing_ready", "sent_to_publishing"].includes(readiness.readinessStatus) ? "ready" : hasOutput ? "active" : "missing",
public/control-center/pages/media-studio-workspace.js:1856:        <div class="media-overview-item"><span>Publishing-ready handoffs</span><strong>${escapeHtml(formatCount(metrics.publishingReady))}</strong></div>
public/control-center/pages/media-studio-workspace.js:1868:    ["Publishing", metrics.publishingReady ? "Ready" : "Prepare"],
public/control-center/pages/media-studio-workspace.js:1894:        <button id="mediaSendToPublishingBtn" class="btn btn-primary" type="button">Prepare Publishing Package</button>
public/control-center/pages/media-studio-workspace.js:2096:              <button type="button" data-media-action="send-publishing" data-media-id="${escapeHtml(item.id)}">Prepare Publishing Package</button>
public/control-center/pages/media-studio-workspace.js:2128:  const publishingReady = ["publishing_ready", "sent_to_publishing", "approved"].includes(readinessStatus) && hasOutput;
public/control-center/pages/media-studio-workspace.js:2129:  const approvalStatus = ["approved", "publishing_ready", "sent_to_publishing"].includes(readinessStatus) ? "approved" : "pending";
public/control-center/pages/media-studio-workspace.js:2135:    ["package ready", publishingReady],
public/control-center/pages/media-studio-workspace.js:2156:  if (key === "publishing-readiness") return item.status === "publishing_ready" || item.status === "sent_to_publishing" ? "Ready" : "Prepare";
public/control-center/pages/media-studio-workspace.js:2343:        <div class="media-check-item"><span>Captions/notes</span><strong>${escapeHtml(firstText(campaignPack.channel_notes, campaignPack.publishing_notes, "Missing"))}</strong></div>
public/control-center/pages/media-studio-workspace.js:2459:        <button class="btn btn-primary" type="button" data-media-version-action="send-publishing">Prepare Publishing Package</button>
public/control-center/pages/media-studio-workspace.js:2479:    ["publishing-readiness", "Publishing readiness"]
public/control-center/pages/media-studio-workspace.js:2520:  if (mode.includes("publish") || mode.includes("handoff")) return "publishing-assistant";
public/control-center/pages/media-studio-workspace.js:2596:    ["publishing handoff", readiness.publishing_handoff],
public/control-center/pages/media-studio-workspace.js:2636:function buildPublishingHandoff(projectName, session, selectedItem) {
public/control-center/pages/media-studio-workspace.js:2637:  const source = selectedItem || normalizeMediaItem(buildMediaPayload(session, "publishing_ready"), { context: {} }, "Local draft");
public/control-center/pages/media-studio-workspace.js:2642:    destination_page: "publishing",
public/control-center/pages/media-studio-workspace.js:2646:    destination_service_domain: "publishing",
public/control-center/pages/media-studio-workspace.js:3079:      if (action === "send-publishing") {
public/control-center/pages/media-studio-workspace.js:3080:        session.form.status = "sent_to_publishing";
public/control-center/pages/media-studio-workspace.js:3082:        if (currentVersion) currentVersion.readiness_status = "sent_to_publishing";
public/control-center/pages/media-studio-workspace.js:3084:        saveDraftToSession(projectName, state, session, "sent_to_publishing");
public/control-center/pages/media-studio-workspace.js:3085:        sendPublishingHandoff({ projectName, backendProjectName, session, selectedItem: item, navigateTo, showMessage, showError });
public/control-center/pages/media-studio-workspace.js:3140:            summary: session.form.reviewNotes || "Review media output before publishing handoff.",
public/control-center/pages/media-studio-workspace.js:3204:            description: session.form.objective || item.brief || "Review prompt, outputs, approval, and publishing readiness.",
public/control-center/pages/media-studio-workspace.js:3266:  const sendPublishingBtn = document.getElementById("mediaSendToPublishingBtn");
public/control-center/pages/media-studio-workspace.js:3267:  if (sendPublishingBtn) {
public/control-center/pages/media-studio-workspace.js:3268:    sendPublishingBtn.onclick = () => {
public/control-center/pages/media-studio-workspace.js:3270:      session.form.status = "sent_to_publishing";
public/control-center/pages/media-studio-workspace.js:3272:      if (currentVersion) currentVersion.readiness_status = "sent_to_publishing";
public/control-center/pages/media-studio-workspace.js:3274:      saveDraftToSession(projectName, state, session, "sent_to_publishing");
public/control-center/pages/media-studio-workspace.js:3275:      sendPublishingHandoff({ projectName, backendProjectName, session, selectedItem: selected(), navigateTo, showMessage, showError });
public/control-center/pages/media-studio-workspace.js:3366:      if (action === "send-publishing") {
public/control-center/pages/media-studio-workspace.js:3367:        session.form.status = "sent_to_publishing";
public/control-center/pages/media-studio-workspace.js:3368:        currentVersion.readiness_status = "sent_to_publishing";
public/control-center/pages/media-studio-workspace.js:3370:        saveDraftToSession(projectName, state, session, "sent_to_publishing");
public/control-center/pages/media-studio-workspace.js:3371:        await sendPublishingHandoff({ projectName, backendProjectName, session, selectedItem: selected(), navigateTo, showMessage, showError });
public/control-center/pages/media-studio-workspace.js:3434:async function sendPublishingHandoff({ projectName, backendProjectName, session, selectedItem, navigateTo, showMessage, showError }) {
public/control-center/pages/media-studio-workspace.js:3435:  const handoff = buildPublishingHandoff(projectName, session, selectedItem);
public/control-center/pages/media-studio-workspace.js:3441:    setSharedHandoff(scope, "publishing", handoff);
public/control-center/pages/media-studio-workspace.js:3447:      showMessage?.("Publishing package handoff prepared from Media Studio.");
public/control-center/pages/media-studio-workspace.js:3449:      showMessage?.("Publishing package handoff kept locally because backend handoff save is unavailable.");
public/control-center/pages/media-studio-workspace.js:3452:    showMessage?.("Publishing package handoff prepared locally.");
public/control-center/pages/media-studio-workspace.js:3456:    navigateTo("publishing");
public/control-center/pages/media-studio-workspace.js:3458:    showError?.(error.message || "Failed to open Publishing.");
public/control-center/pages/media-studio-workspace.js:3526:              <p class="media-section-copy">Start with a brief or handoff. Attach Library assets when needed. Review creative readiness and brand compliance. Save approved assets to Library or prepare handoff to Publishing/Governance. All routing is handoff/review-based and user-triggered. Media Studio does not publish, send, or approve directly.</p>
public/control-center/pages/media-studio-workspace.js:3567:        .filter((item) => ["creative", "publishing"].includes(item.key));
public/control-center/pages/ai-command.js:66:                summary: "Publishing readiness, schedule review, and handoff preparation.",
public/control-center/pages/ai-command.js:67:                routeHint: "publishing"
public/control-center/pages/ai-command.js:162:		destinations: ["Content Studio", "Publishing", "AI Command"],
public/control-center/pages/ai-command.js:163:		safetyNote: "Drafts require review before publishing. Cannot approve or publish without confirmation.",
public/control-center/pages/ai-command.js:195:		position: "Publishing Readiness Lead",
public/control-center/pages/ai-command.js:197:		summary: "Publishing readiness, schedule review, and handoff preparation.",
public/control-center/pages/ai-command.js:198:		placeholder: "Ask the Publisher to review publishing readiness, check scheduling, or prepare a handoff package…",
public/control-center/pages/ai-command.js:199:		canHelp: ["Review publishing readiness", "Check scheduled jobs", "Prepare handoff packages", "Map publishing dependencies", "Flag pre-publish risks"],
public/control-center/pages/ai-command.js:201:		destinations: ["Publishing", "Workflows", "AI Command"],
public/control-center/pages/ai-command.js:202:		safetyNote: "Publishing always requires explicit approval. No live publishing from AI guidance alone.",
public/control-center/pages/ai-command.js:236:		summary: "Claims review, approval safety, publishing risk, and governance notes.",
public/control-center/pages/ai-command.js:237:		placeholder: "Ask the Compliance Reviewer to check claims, approval risks, publishing safety, and governance notes…",
public/control-center/pages/ai-command.js:238:		canHelp: ["Review marketing claims", "Flag approval risks", "Check publishing safety", "Prepare governance notes", "Identify compliance blockers"],
public/control-center/pages/ai-command.js:240:		destinations: ["Workflows", "Publishing", "Governance"],
public/control-center/pages/ai-command.js:312:		{ label: "Review publishing readiness", sub: "Check what is ready to publish" },
public/control-center/pages/ai-command.js:331:		{ label: "Flag publishing risks", sub: "Identify blockers before release" },
public/control-center/pages/ai-command.js:359:	{ label: "Prepare a full handoff sequence", sub: "Strategy, creative, compliance, publishing, ops" },
public/control-center/pages/ai-command.js:454:		{ id: "publishing-checklist", label: "Publishing Checklist", action: "preview", intent: "handoff", template: "Build a publishing checklist for {project}. Include German copy, assets, claims checks, and channel readiness." },
public/control-center/pages/ai-command.js:455:		{ id: "final-packaging", label: "Final Packaging", action: "preview", intent: "handoff", template: "Prepare a final publishing package for {project}. Include copy, CTA, asset notes, approvals, and destination channel." },
public/control-center/pages/ai-command.js:457:		{ id: "schedule-draft", label: "Schedule Draft", action: "preview", intent: "workflow", template: "Prepare a publishing schedule draft for {project}. Include channel cadence, dependencies, and review gates." },
public/control-center/pages/ai-command.js:458:		{ id: "open-publishing", label: "Open Publishing", action: "route", route: "publishing" }
public/control-center/pages/ai-command.js:678:			targetPage: "publishing",
public/control-center/pages/ai-command.js:682:				reason: "Requires approval gate before external publishing actions."
public/control-center/pages/ai-command.js:869:		overview.publishing_language ||
public/control-center/pages/ai-command.js:1206:                `Use ${safeOutputLanguage} only for customer-facing or publishable copy such as captions, ads, emails, landing pages, final campaign text, or publishing packages.`,
public/control-center/pages/ai-command.js:1266:	if (id === "publisher") return "publishing";
public/control-center/pages/ai-command.js:1306:        const looksPublishingLike = /\b(publish|publishing|schedule|channel package|channel payload|approval-ready post|final post|ready to publish|publishing package)\b/.test(text);
public/control-center/pages/ai-command.js:1331:        if (/publishing|publish|schedule/.test(outputType) || looksPublishingLike) {
public/control-center/pages/ai-command.js:1332:                outputType = "publishing";
public/control-center/pages/ai-command.js:1333:                return { outputType, destinationRoute: explicitDestination || "publishing" };
public/control-center/pages/ai-command.js:1364:		publishing: "Publishing",
public/control-center/pages/ai-command.js:1397:		confirmationNote: "Execution, approvals, and publishing require explicit confirmation in the owning workspace."
public/control-center/pages/ai-command.js:1434:				"Outcome-led hook direction for a German publishing draft",
public/control-center/pages/ai-command.js:1448:				"Claims, health, or performance promises need evidence before publishing."
public/control-center/pages/ai-command.js:1457:			safetyLabel: "Claims require review before publishing. No direct publish action."
public/control-center/pages/ai-command.js:1499:			title: outputType === "handoff" ? "Handoff Preview: Publishing package" : "Publishing Draft: Readiness checklist",
public/control-center/pages/ai-command.js:1500:			summary: "Publishing checklist and schedule draft prepared.",
public/control-center/pages/ai-command.js:1503:				"Publishing remains gated until channel, approval, and asset readiness are confirmed."
public/control-center/pages/ai-command.js:1509:				"Prepare handoff for publishing review"
public/control-center/pages/ai-command.js:1719:		confirmationNote: "No task, workflow, outreach, customer reply, CRM update, approval, or publishing action is executed from Full Team mode.",
public/control-center/pages/ai-command.js:2073:			top ? `Reuse the pattern from ${extractTopMessage(top)} in the next publishing cycle.` : "Sync social insights to identify winning hooks and formats.",
public/control-center/pages/ai-command.js:2084:			routeSuggestion("Publishing", "publishing", "Schedule the next batch with stronger timing and approval control."),
public/control-center/pages/ai-command.js:2197:		return { title: "Campaign launch task block", owner: "Campaign Studio", steps: ["Define the campaign objective, audience, and offer.", "Choose channels and budget based on current intelligence.", "List required assets and publishing dependencies before launch."] };
public/control-center/pages/ai-command.js:2200:		return { title: "Content plan task block", owner: "Content Studio", steps: ["Use the strongest content pattern as the starting template.", "Map posts by platform, hook, format, and CTA.", "Route approved items into Publishing for scheduling."] };
public/control-center/pages/ai-command.js:2218:		routeSuggestions.push(routeSuggestion("Publishing", "publishing", "Schedule or approve if the next step is publishing."));
public/control-center/pages/ai-command.js:2347:	publishing: "Publishing",
public/control-center/pages/ai-command.js:2369:	publishing: "publisher",
public/control-center/pages/ai-command.js:2403:	publish: "publishing",
public/control-center/pages/ai-command.js:2404:	publisher: "publishing",
public/control-center/pages/ai-command.js:2521:		confirmationNote: firstAiInboundText(preview.confirmationNote, preview.confirmation_note, "Execution, approvals, publishing, CRM updates, customer replies, and workflow runs require explicit confirmation in the owning workspace."),
public/control-center/pages/ai-command.js:2591:	)) || `Review this ${sourceLabel} handoff for ${projectLabel}. Identify the right specialist, summarize the context, produce a review-ready draft, and recommend the next safe route. Do not execute publishing, task creation, CRM updates, customer replies, workflow runs, or backend actions.`;
public/control-center/pages/ai-command.js:2631:		note: "Guidance only. No publishing, task creation, CRM updates, customer replies, workflow runs, exports, or backend actions are executed from this handoff."
public/control-center/pages/ai-command.js:3743:		const lanes = ["Strategy", "Content", "Media", "Customer Ops", "Sales / CRM", "Compliance", "Publishing", "Operations"];
public/control-center/pages/ai-command.js:3797:        if (roleId === "publisher") return `${label} is preparing publishing guidance...`;
public/control-center/pages/ai-command.js:3809:		? "Team orchestration across strategy, writing, media/video, compliance, publishing, customer operations, sales/CRM, and operations"
public/control-center/pages/ai-command.js:3953:			<span class="aicmd-v2-lang-chip" title="Publishing language">📝 ${escapeHtml(languagePlan.publishLanguage)}</span>
public/control-center/pages/ai-command.js:4064:		: destination === "Publishing"
public/control-center/pages/ai-command.js:4065:			? "Route Draft to Publishing"
public/control-center/pages/ai-command.js:4147:		: destination === "Publishing"
public/control-center/pages/ai-command.js:4148:			? "Route Draft to Publishing"
public/control-center/pages/ai-command.js:4236:                                <div class="aicmd-room-planned-note">This is a review-ready preview. Execution, publishing, approvals, CRM updates, and workflow runs happen only in the destination workspace after confirmation.</div>
public/control-center/pages/ai-command.js:4543:		{ label: "Publishing language", value: languagePlan.publishLanguage, present: true },
public/control-center/pages/ai-command.js:4606:					<span>Publishing, approval, and workflow runs require your explicit confirmation in the right workspace.</span>
public/control-center/pages/governance.js:116:  // Intake context: { ai, publishing, content, media, workflows, operations, notifications, insights }
public/control-center/pages/governance.js:119:  if (intakeContext?.publishing) items.push({ label: "Publishing", value: asString(intakeContext.publishing) });
public/control-center/pages/governance.js:228:  const publishing = asObject(settings.publishing);
public/control-center/pages/governance.js:235:      approval_before_publish: Boolean(publishing.approvalBeforePublish),
public/control-center/pages/governance.js:240:      freeze_publishing: false
public/control-center/pages/governance.js:246:      publishing: asString(settings.team?.publishAccess) || "Publisher",
public/control-center/pages/governance.js:255:      approval_before_publish: Boolean(publishing.approvalBeforePublish)
public/control-center/pages/governance.js:503:      <label class="settings-toggle" for="governance-freeze-publishing">
public/control-center/pages/governance.js:504:        <span class="settings-field-label">Freeze publishing</span>
public/control-center/pages/governance.js:505:        <input id="governance-freeze-publishing" type="checkbox" class="settings-toggle-input" data-governance-policy="freeze_publishing" ${rules.freeze_publishing ? "checked" : ""} />
public/control-center/pages/governance.js:517:        <label class="settings-field-label" for="governance-owner-publishing">Publishing owner</label>
public/control-center/pages/governance.js:518:        <input id="governance-owner-publishing" class="settings-control" type="text" data-governance-owner="publishing" value="${escapeHtml(owners.publishing || "")}" />
public/control-center/pages/governance.js:588:    const approval = findApprovalForEntity(summary, "publishing_job", item.entity_id);
public/control-center/pages/governance.js:597:      queue_owner: approval?.reviewer || "Publishing Reviewer",
public/control-center/pages/governance.js:654:  if (rules.freeze_publishing) {
public/control-center/pages/governance.js:655:    blockers.push("Publishing is currently frozen by governance policy.");
public/control-center/pages/governance.js:668:  if (rules.freeze_publishing || escalations > 0) {
public/control-center/pages/governance.js:1129:                        intakeContext.publishing = getSharedHandoff(projectName, "publishing", operations)?.payload?.summary;
public/control-center/pages/governance.js:1395:        const confirmed = window.confirm("Confirm governance policy save\n\nAction: Save governance policy rules for this project.\nRisk: These rules can affect approvals, publishing readiness, brand safety review, and admin override behavior.\nAuthority: This is a backend-governed durable policy update.\n\nSelect Cancel to review the policy settings before saving.");
public/control-center/pages/governance.js:1466:    description: "Review approvals, policy violations, overrides, escalation, and audit visibility across content, media, campaigns, and publishing."
public/control-center/pages/integrations.js:139:    description: "Post insights, video performance, engagement, comments, publishing paths, and linked account intelligence.",
public/control-center/pages/integrations.js:148:        enables: "Post insights, engagement data, comments, publishing support, and ad account linkage.",
public/control-center/pages/integrations.js:149:        dataScope: ["Post insights", "Engagement", "Comments", "Publishing", "Ads linkage"],
public/control-center/pages/integrations.js:166:        enables: "Post insights, reel insights, engagement, comments, publishing, and business account analytics.",
public/control-center/pages/integrations.js:167:        dataScope: ["Posts", "Reels", "Engagement", "Comments", "Publishing"],
public/control-center/pages/integrations.js:184:        enables: "Video insights, engagement, comments, profile metrics, and future publishing support.",
public/control-center/pages/integrations.js:185:        dataScope: ["Video insights", "Engagement", "Comments", "Audience", "Publishing"],
public/control-center/pages/integrations.js:202:        enables: "Video insights, watch metrics, subscriber trends, comments, and publishing context.",
public/control-center/pages/integrations.js:203:        dataScope: ["Videos", "Views", "Watch time", "Engagement", "Publishing"],
public/control-center/pages/integrations.js:218:        purpose: "Future-ready business profile insight and publishing connection for LinkedIn surfaces.",
public/control-center/pages/integrations.js:220:        enables: "Post insights, audience signals, company page analytics, and publishing support.",
public/control-center/pages/integrations.js:221:        dataScope: ["Posts", "Audience", "Engagement", "Publishing"],
public/control-center/pages/integrations.js:997:    { key: "posts", pattern: /post|reel|video|comment|publishing|profile|channel/ },
public/control-center/pages/integrations.js:1015:      write: ["publishing", "audience updates"]

## Publishing API function markers
913:      scheduled_jobs: [],
1626:    `/media-manager/project/${encodeURIComponent(projectName)}/approvals`,
1629:    "Failed to create approval request"
1640:    `/media-manager/project/${encodeURIComponent(projectName)}/approvals${suffix}`,
1641:    "Failed to load approvals"
1645:export async function decideProjectApproval(projectName, approvalId, payload = {}) {
1650:  if (!approvalId) {
1651:    throw new Error("Missing approval id");
1655:    `/media-manager/project/${encodeURIComponent(projectName)}/approvals/${encodeURIComponent(approvalId)}/decision`,
1658:    "Failed to update approval"
1865:    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/schedule`,
1868:    "Failed to save publishing schedule"
1872:export async function reschedulePublishingItem(projectName, jobId, payload = {}) {
1882:    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/${encodeURIComponent(jobId)}/reschedule`,
1885:    "Failed to reschedule publishing item"
1899:    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/${encodeURIComponent(jobId)}/ready`,
1902:    "Failed to approve publishing item"
1906:export async function publishPublishingItem(projectName, jobId, payload = {}) {
1916:    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/${encodeURIComponent(jobId)}/publish`,
1919:    "Failed to publish item"
1933:    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/${encodeURIComponent(jobId)}/fail`,
1936:    "Failed to mark publishing item as failed"

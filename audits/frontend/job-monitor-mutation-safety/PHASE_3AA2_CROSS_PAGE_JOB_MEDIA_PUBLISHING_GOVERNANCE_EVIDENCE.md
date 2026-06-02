# PHASE 3AA.2 — Cross-Page Job / Media / Publishing / Governance Evidence

## Cross-page references
public/control-center/pages/media-studio-workspace.js:499:function normalizeMediaItem(rawItem, state, source = "Backend media job") {
public/control-center/pages/media-studio-workspace.js:505:    title: firstText(raw.title, raw.name, raw.prompt, `${titleCase(mode)} media job`),
public/control-center/pages/media-studio-workspace.js:1192:      action: "Regenerate or repair the failed media job",
public/control-center/pages/media-studio-workspace.js:1223:    action: "Start a media job",
public/control-center/pages/media-studio-workspace.js:1224:    why: "No media job is ready yet. Start with a brief, build a brand-safe prompt, then review and prepare a Publishing package."
public/control-center/pages/media-studio-workspace.js:1765:        <button id="mediaStartJobBtn" class="btn btn-secondary" type="button" data-new-media-job="image">Start Media Job</button>
public/control-center/pages/media-studio-workspace.js:1851:        <div class="media-overview-item"><span>Total media jobs/assets</span><strong>${escapeHtml(formatCount(metrics.total))}</strong></div>
public/control-center/pages/media-studio-workspace.js:1853:        <div class="media-overview-item"><span>Draft media jobs</span><strong>${escapeHtml(formatCount(metrics.draftJobs))}</strong></div>
public/control-center/pages/media-studio-workspace.js:1891:        <button id="mediaStartJobBtn" class="btn btn-secondary" type="button" data-new-media-job="image">Start Media Job</button>
public/control-center/pages/media-studio-workspace.js:2064:            <div class="setup-kicker">Media Job Queue</div>
public/control-center/pages/media-studio-workspace.js:2065:            <h3>No media jobs yet</h3>
public/control-center/pages/media-studio-workspace.js:2069:        <div class="empty-box">Start a media job or load a workflow handoff to create the first prompt-ready draft.</div>
public/control-center/pages/media-studio-workspace.js:2078:          <div class="setup-kicker">Media Job Queue</div>
public/control-center/pages/media-studio-workspace.js:2471:  const prompt = activePrompt || selectedItem?.prompt || selectedItem?.brief || "Select or save a media job to preview the prompt, brief, and asset notes.";
public/control-center/pages/media-studio-workspace.js:2487:          <h3>${escapeHtml(selectedItem?.title || "No selected media job")}</h3>
public/control-center/pages/media-studio-workspace.js:2651:      label: source.title || session.form.title || "Media job"
public/control-center/pages/media-studio-workspace.js:2702:    showMessage?.("Media job saved.");
public/control-center/pages/media-studio-workspace.js:2893:      showMessage?.("New media job draft opened.");
public/control-center/pages/media-studio-workspace.js:3060:        showMessage?.("Media job saved as local draft.");
public/control-center/pages/media-studio-workspace.js:3076:        showMessage?.("Media job marked review-ready locally.");
public/control-center/pages/media-studio-workspace.js:3137:            title: `Review ${item.title || session.form.title || "media job"}`,
public/control-center/pages/media-studio-workspace.js:3148:              label: item.title || session.form.title || "Media job"
public/control-center/pages/media-studio-workspace.js:3190:      showMessage?.("Media job returned to draft for revision.");
public/control-center/pages/media-studio-workspace.js:3203:            title: `Complete media job ${item.title || session.form.title || "media job"}`,
public/control-center/pages/media-studio-workspace.js:3216:              label: item.title || session.form.title || "Media job"
public/control-center/pages/media-studio-workspace.js:3220:          showMessage?.("Task created and linked to the media job.");
public/control-center/pages/media-studio-workspace.js:3225:        showMessage?.("Create Task needs a backend media job; local draft is preserved.");
public/control-center/pages/media-studio-workspace.js:3622:        ${session.loading ? `<div class="empty-box">Loading media jobs, handoffs, approvals, tasks, and event history...</div>` : ""}
public/control-center/pages/operations-centers.js:222:  if (pageKey === "job-monitor") {
public/control-center/pages/operations-centers.js:227:        prompt: `Review Job Monitor for ${projectLabel}. Prioritize failures, retry risk, and health issues, then explain what should be inspected first.`
public/control-center/pages/operations-centers.js:232:        prompt: `Review ${itemLabel} in Job Monitor for ${projectLabel}. Explain what the current job state implies, what likely happened, and what should be checked next.`
public/control-center/pages/operations-centers.js:236:        preview: "Assess execution health across workflows, media, and publishing jobs.",
public/control-center/pages/operations-centers.js:237:        prompt: `Summarize current execution health for ${projectLabel} across workflows, media, and publishing jobs. Highlight failure clusters, retry patterns, and risk areas.`
public/control-center/pages/operations-centers.js:299:      route: "job-monitor"
public/control-center/pages/operations-centers.js:313:      route: "job-monitor"
public/control-center/pages/operations-centers.js:1151:            <strong>Job Monitor error</strong>
public/control-center/pages/operations-centers.js:1179:    <section class="page is-active" data-page="job-monitor">
public/control-center/pages/operations-centers.js:1184:              <span class="std-context-eyebrow">JOB MONITOR</span>
public/control-center/pages/operations-centers.js:1185:              <h3 class="std-context-title">Job Monitor</h3>
public/control-center/pages/operations-centers.js:1188:            <div class="std-context-metrics" aria-label="Job Monitor metrics">
public/control-center/pages/operations-centers.js:1213:                <h3>Execution inventory</h3>
public/control-center/pages/operations-centers.js:1234:              <div class="error-state ops-job-state" aria-live="assertive"><strong>Job Monitor error</strong><span>${escapeHtml(session.errorMessage)}</span></div>
public/control-center/pages/operations-centers.js:1281:                <button class="btn btn-primary" type="button" id="jobMonitorRefreshBtn">Refresh Job Monitor</button>
public/control-center/pages/operations-centers.js:1298:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Retry job (deferred: mutation safety pass)</button>
public/control-center/pages/operations-centers.js:1299:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Cancel job (deferred: mutation safety pass)</button>
public/control-center/pages/operations-centers.js:1300:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Rerun job (deferred: mutation safety pass)</button>
public/control-center/pages/operations-centers.js:1301:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Delete job (deferred: mutation safety pass)</button>
public/control-center/pages/operations-centers.js:1355:  const prompts = buildOpsAssistantPrompts("job-monitor", projectName, selectedItem, titleCase(session.focus || "all jobs"));
public/control-center/pages/operations-centers.js:1383:          session.errorMessage = `Job Monitor: ${error?.message || "Failed to refresh."}`;
public/control-center/pages/operations-centers.js:1831:  id: "job-monitor",
public/control-center/pages/operations-centers.js:1835:    title: "Job Monitor",
public/control-center/pages/operations-centers.js:1838:  template: `<section class="page is-active" data-page="job-monitor"><div class="ops-shell"></div></section>`,
public/control-center/pages/operations-centers.js:1868:          session.errorMessage = `Job Monitor: ${error?.message || "Failed to load live data."}`;
public/control-center/pages/operations-centers.js:1957:      route: "job-monitor",
public/control-center/pages/operations-centers.js:1958:      title: "Job Monitor",
public/control-center/pages/operations-centers.js:1962:      action: "Open Job Monitor"
public/control-center/pages/operations-centers.js:2033:                  <p>For new operational work, start in AI Team with Operations Lead or Full Team, then route the result to Task Center, Workflows, Queue, or Job Monitor.</p>
public/control-center/pages/ai-command.js:174:		cannotDo: ["Generate images directly", "Upload assets without review", "Approve without confirmation", "Execute media jobs"],
public/control-center/pages/ai-command.js:187:		cannotDo: ["Generate video directly", "Upload footage without review", "Approve without confirmation", "Run media jobs automatically"],
public/control-center/pages/ai-command.js:1492:			safetyLabel: "Video generation requires configured provider or GPU worker; no execution started."
public/control-center/pages/ai-command.js:2358:	"job-monitor": "Job Monitor",
public/control-center/pages/ai-command.js:2380:	"job-monitor": "operations",
public/control-center/pages/ai-command.js:2414:	jobs: "job-monitor",
public/control-center/pages/ai-command.js:4280:				<li><span>Native GPU video rendering</span><strong class="is-planned">Requires connected GPU worker</strong></li>
public/control-center/pages/governance.js:235:      approval_before_publish: Boolean(publishing.approvalBeforePublish),
public/control-center/pages/governance.js:240:      freeze_publishing: false
public/control-center/pages/governance.js:255:      approval_before_publish: Boolean(publishing.approvalBeforePublish)
public/control-center/pages/governance.js:480:        <input id="governance-approval-before-publish" type="checkbox" class="settings-toggle-input" data-governance-policy="approval_before_publish" ${rules.approval_before_publish ? "checked" : ""} />
public/control-center/pages/governance.js:505:        <input id="governance-freeze-publishing" type="checkbox" class="settings-toggle-input" data-governance-policy="freeze_publishing" ${rules.freeze_publishing ? "checked" : ""} />
public/control-center/pages/governance.js:654:  if (rules.freeze_publishing) {
public/control-center/pages/governance.js:668:  if (rules.freeze_publishing || escalations > 0) {
public/control-center/pages/workflows.js:48:    title: "Build Media Job",
public/control-center/pages/settings.js:715:    approvalBeforePublish: rules.approval_before_publish ?? normalized.publishing?.approvalBeforePublish
public/control-center/pages/settings.js:773:      approval_before_publish: Boolean(publishing.approvalBeforePublish),
public/control-center/pages/settings.js:778:      freeze_publishing: asString(operating.primaryMode) === "Emergency Safe Mode"

## Media Studio job markers
32:const MEDIA_STATUSES = ["draft", "prompt_ready", "generating", "needs_review", "approved", "publishing_ready", "sent_to_publishing", "failed"];
169:  if (["approved", "complete", "completed"].includes(normalized)) return "approved";
172:  if (["failed", "blocked", "error", "rejected"].includes(normalized)) return "failed";
179:  if (status === "failed") return "danger";
499:function normalizeMediaItem(rawItem, state, source = "Backend media job") {
504:    id: firstText(raw.id, raw.media_job_id, raw.job_id),
505:    title: firstText(raw.title, raw.name, raw.prompt, `${titleCase(mode)} media job`),
528:    publishing_job_id: asString(raw.publishing_job_id || ""),
556:    failed: 0,
610:    const failedLoads = results.filter((result) => result.status === "rejected").length;
621:    session.error = failedLoads
622:      ? `${failedLoads} Media Studio data source${failedLoads === 1 ? "" : "s"} could not be loaded. Available data is still shown.`
676:      payload.media_job_id ||
891:    media_job_id: session.formSourceId || session.selectedId || "",
984:    media_job_id: sourceMediaId,
1063:      entity_type: "media_job",
1182:    failed: counts.failed,
1189:  const failed = selectedItem?.status === "failed" ? selectedItem : null;
1190:  if (failed) {
1192:      action: "Regenerate or repair the failed media job",
1193:      why: `${failed.title} is blocked. Review the prompt and reference asset before routing downstream.`
1223:    action: "Start a media job",
1224:    why: "No media job is ready yet. Start with a brief, build a brand-safe prompt, then review and prepare a Publishing package."
1261:  return "Generator backend not connected yet — your prompt/job is ready. Review it, save it as a draft, send it to AI Command, save it to Library, or connect a provider in Integrations before trying real output generation.";
1455:      .media-status-pill.is-failed {
1647:      detail: "Inbound or job context exists; attach Library source when claims or product truth matter."
1738:  const packageCount = `${formatCount(metrics.total)} jobs/assets`;
1765:        <button id="mediaStartJobBtn" class="btn btn-secondary" type="button" data-new-media-job="image">Start Media Job</button>
1848:        <span class="card-badge neutral">${escapeHtml(formatCount(metrics.total))} jobs/assets</span>
1851:        <div class="media-overview-item"><span>Total media jobs/assets</span><strong>${escapeHtml(formatCount(metrics.total))}</strong></div>
1853:        <div class="media-overview-item"><span>Draft media jobs</span><strong>${escapeHtml(formatCount(metrics.draftJobs))}</strong></div>
1855:        <div class="media-overview-item"><span>Failed / blocked jobs</span><strong>${escapeHtml(formatCount(metrics.failed))}</strong></div>
1891:        <button id="mediaStartJobBtn" class="btn btn-secondary" type="button" data-new-media-job="image">Start Media Job</button>
1936:          <p class="media-section-copy">Choose a media mode, prepare a prompt/job-ready draft, then render with a connected provider or continue safely with review and handoff.</p>
1942:          <button class="media-mode-tab${item === mode ? " is-active" : ""}" type="button" data-media-mode="${escapeHtml(item)}"${item === "image" || item === "video" ? ` data-new-media-job="${escapeHtml(item)}"` : ""}>${escapeHtml(item === "campaign-pack" ? "Campaign Pack" : titleCase(item))}</button>
1947:            Start here: choose Image, Video, Voice, or Campaign Pack. Complete the brief, generate or improve the prompt, then use Generate Output only when a provider/backend is connected. If generation is unavailable or times out, keep the prompt/job-ready draft and continue with review, Library save, AI Command review, or provider setup in Integrations.
1965:        ${renderField({ id: "mediaPromptInput", name: "prompt", label: "Prompt / brief", value: form.prompt, multiline: true, rows: 7, helper: "Use this as the creative brief. If no generation provider is connected, Media Studio keeps it as a prompt/job-ready draft for review, Library save, AI review, or provider handoff." }, session, escapeHtml)}
2065:            <h3>No media jobs yet</h3>
2069:        <div class="empty-box">Start a media job or load a workflow handoff to create the first prompt-ready draft.</div>
2149:  if (!item) return "Needs job";
2295:      : `<div class="media-prompt-box">${escapeHtml(JSON.stringify(payload, null, 2) || "No image output was returned yet. If the provider is not connected or timed out, keep the prompt/job-ready draft and continue with review, Library save, or provider setup in Integrations.")}</div>`;
2471:  const prompt = activePrompt || selectedItem?.prompt || selectedItem?.brief || "Select or save a media job to preview the prompt, brief, and asset notes.";
2487:          <h3>${escapeHtml(selectedItem?.title || "No selected media job")}</h3>
2616:      ${!readiness.image_generation_backend || !readiness.video_generation_backend || !readiness.voice_generation_backend ? `<div class="simple-banner media-block-gap">${escapeHtml("Generator backend not connected yet — your prompt/job is ready. Review it, save it as a draft, send it to AI Command, save it to Library, or connect a provider in Integrations before trying real output generation.")}</div>` : ""}
2623:    `Review this Media Studio job for ${projectName}.`,
2648:      entity_type: "media_job",
2651:      label: source.title || session.form.title || "Media job"
2658:      media_job_id: source.id || session.formSourceId || "",
2698:    const saved = normalizeMediaItem(result.media_job || result.item || buildMediaPayload(session, status), state);
2702:    showMessage?.("Media job saved.");
2774:          notes: firstText(response.message, "Generator backend not connected yet — your prompt/job is ready. Review it, save it as a draft, send it to AI Command, save it to Library, or connect a provider in Integrations before trying real output generation."),
2780:        session.draftMessage = response.message || "Generator backend not connected yet — your prompt/job is ready. Review it, save it as a draft, send it to AI Command, save it to Library, or connect a provider in Integrations before trying real output generation.";
2821:      session.draftMessage = "Generation completed and queued for review.";
2833:            : firstText(error?.payload?.message, error?.message, "Generation failed."),
2839:        readinessStatus: "failed",
2842:          : firstText(error?.payload?.message, error?.message, "Generation failed."),
2854:        : payloadMessage || error?.message || "Generation failed. Draft kept locally.";
2893:      showMessage?.("New media job draft opened.");
3060:        showMessage?.("Media job saved as local draft.");
3076:        showMessage?.("Media job marked review-ready locally.");
3108:          asString(approval.entity_type) === "media_job" &&
3137:            title: `Review ${item.title || session.form.title || "media job"}`,
3138:            entity_type: "media_job",
3145:              entity_type: "media_job",
3148:              label: item.title || session.form.title || "Media job"
3176:          asString(approval.entity_type) === "media_job" &&
3190:      showMessage?.("Media job returned to draft for revision.");
3203:            title: `Complete media job ${item.title || session.form.title || "media job"}`,
3213:              entity_type: "media_job",
3216:              label: item.title || session.form.title || "Media job"
3220:          showMessage?.("Task created and linked to the media job.");
3225:        showMessage?.("Create Task needs a backend media job; local draft is preserved.");
3249:          entity_type: "media_job",
3254:          media_job_id: item?.id || session.formSourceId || "",
3415:            entity_type: "media_job",
3468:    description: "Run saved image, video, voice, and campaign-pack jobs with prompts, review states, Library saves, and package routing."
3622:        ${session.loading ? `<div class="empty-box">Loading media jobs, handoffs, approvals, tasks, and event history...</div>` : ""}

## Publishing page job markers
11:  const safety = `Publishing prepares channel packages, manual schedule records, and approval-ready handoffs. External publishing requires provider proof; backend status changes remain <strong>confirmation-gated</strong> and governed by <strong>backend approval rules</strong>.`;
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
40:    draft: selectedItem?.status === "draft" ? "active" : selectedItem ? "ready" : "missing",
41:    source: selectedItem?.source ? "ready" : "missing",
42:    package: selectedItem ? "ready" : "missing",
43:    approval: selectedItem?.approvalStatus === "approved" ? "ready" : selectedItem?.approvalStatus === "needs approval" ? "warning" : "missing",
44:    schedule: selectedItem?.status === "scheduled" ? "ready" : "missing",
45:    handoff: selectedItem?.status === "published" ? "ready" : "missing"
48:    <nav class="publishing-workflow-strip" aria-label="Publishing Workflow">
50:        <div class="publishing-workflow-step is-${statusMap[step.key]}" aria-label="${escapeHtml(step.label)}: ${statusMap[step.key]}">
52:          <span class="publishing-workflow-step-label">${statusMap[step.key]}</span>
61:    { key: "source", label: "Source", state: selectedItem?.source ? "ready" : "missing" },
62:    { key: "copy", label: "Copy", state: selectedItem?.contentItem ? "ready" : "missing" },
63:    { key: "media", label: "Media", state: assetData?.some(a => a.type === "media" && a.status === "Ready") ? "ready" : "missing" },
64:    { key: "channel", label: "Channel", state: selectedItem?.channel ? "ready" : "missing" },
65:    { key: "schedule", label: "Schedule", state: selectedItem?.scheduledFor ? "ready" : "missing" },
66:    { key: "governance", label: "Governance", state: selectedItem?.governanceStatus === "approved" ? "ready" : "missing" },
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
120:const publishingAutomationState = {
124:let publishingAutoModeUnsubscribe = null;
125:let publishingAutoModeControllerReady = false;
126:let publishingAutomationEnabled = false;
127:let publishingRenderCallback = null;
128:let publishingRenderTimer = null;
132:    publishingRenderCallback = render;
135:  if (publishingRenderTimer) {
139:  publishingRenderTimer = window.setTimeout(() => {
140:    publishingRenderTimer = null;
142:    if (typeof publishingRenderCallback === "function") {
143:      publishingRenderCallback();
149:  publishingRenderCallback = render;
151:  if (!publishingAutomationEnabled) {
155:  if (!publishingAutoModeControllerReady) {
157:    publishingAutoModeControllerReady = true;
160:  if (publishingAutoModeUnsubscribe) {
164:  publishingAutoModeUnsubscribe = subscribeAutoMode(() => {
272:  if (["ready", "approved", "ready_for_manual_publish", "ready_for_manual_send"].includes(normalized)) return "ready";
276:  if (["scheduled", "queued", "queue", "pending", "pending_publish"].includes(normalized)) return "scheduled";
277:  if (["published", "completed", "complete", "success", "done", "sent", "live"].includes(normalized)) return "published";
278:  if (["failed", "error", "blocked", "rejected"].includes(normalized)) return "failed";
284:  if (status === "published") return "success";
285:  if (status === "ready" || status === "scheduled") return "warning";
286:  if (status === "failed") return "danger";
325:    id: asString(draft.id || `local-publish-${Date.now()}`),
355:    publishDate: toDateInput(tomorrow),
356:    publishTime: "09:00",
365:  if (!publishingSessions.has(key)) {
366:    publishingSessions.set(key, {
377:  return publishingSessions.get(key);
395:  if (item.campaign) return `${item.campaign} ${titleCase(item.channel || "publish")}`;
396:  if (context.activeCampaign) return `${context.activeCampaign} ${titleCase(item.channel || "publish")}`;
407:    id: firstText(raw.job_id, raw.execution_id, raw.id),
408:    jobId: firstText(raw.job_id, raw.execution_id, raw.id),
418:    approvalStatus: status === "ready" ? "approved" : status === "needs approval" ? "needs approval" : "draft",
440:    const jobId = firstText(result.job_id, result.execution_id);
441:    if (jobId && !latestResultByJob.has(jobId)) latestResultByJob.set(jobId, result);
444:  const scheduledItems = asArray(activity.scheduled_jobs).map((job) => {
445:    const latest = latestResultByJob.get(asString(job.job_id));
448:        ...asObject(job),
450:        preview: asObject(latest?.preview || job.preview || job.connector_preview)
453:      latest ? "Scheduled job + result" : "Scheduled job"
457:  const knownIds = new Set(scheduledItems.map((item) => item.jobId));
459:    .filter((result) => !knownIds.has(firstText(result.job_id, result.execution_id)))
471:    failed: 0,
472:    ready: 1,
476:    published: 5
515:    .filter((item) => item.scheduledFor && ["scheduled", "ready"].includes(item.status))
529:    publishDate: toDateInput(item.scheduledFor),
530:    publishTime: toTimeInput(item.scheduledFor),
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
588:      action: "Record manual publish completion",
591:        reason: "This records a manual publishing completion only after review; external provider execution requires separate proof."
606:  if (["schedule", "publish", "retry"].includes(intent) && !clean(form.publishDate)) {
607:    errors.publishDate = "Publish date is required for this action.";
609:  if (intent === "publish" && form.approvalStatus !== "approved") {
626:function guardPublishingAssetBlockers(session, assetBlockers, showMessage, actionLabel = "this publishing action") {
630:  const message = `Publishing blocker(s) must be resolved before ${actionLabel}: ${summary || "required publishing assets are missing or need review"}.`;
643:  return message ? `<div class="publishing-inline-error">${escapeHtml(message)}</div>` : "";
651:  } else if (status === "ready") {
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
968:  const failed = queue.find((item) => item.status === "failed");
969:  const ready = queue.find((item) => item.status === "ready");
975:  if (failed) {
977:      action: "Retry failed publishing item",
978:      why: `${failed.title} is blocked or failed. Clear the blocker before adding more scheduled work.`,
979:      focusId: failed.id,
983:  if (ready && !assetBlockers.length) {
985:      action: "Record manual completion for the ready item",
986:      why: `${ready.title} is approved for a backend readiness update. Record manual completion only after external execution is verified.`,
987:      focusId: ready.id
993:      why: `${needsApproval.title} needs approval before it can move into the manual publishing queue.`,
1015:    action: connectedCount ? "Create a publishing draft" : "Connect a publishing channel",
1017:      ? "No queue item is ready. Start with a draft and save it locally until it can be scheduled."
1026:    <section class="card publishing-card">
1034:      <div class="publishing-overview-grid">
1035:        <div class="publishing-overview-item"><span>Scheduled items</span><strong>${escapeHtml(String(counts.scheduled))}</strong></div>
1036:        <div class="publishing-overview-item"><span>Ready for manual review</span><strong>${escapeHtml(String(counts.ready))}</strong></div>
1037:        <div class="publishing-overview-item"><span>Draft items</span><strong>${escapeHtml(String(counts.draft))}</strong></div>
1038:        <div class="publishing-overview-item"><span>Failed / blocked items</span><strong>${escapeHtml(String(counts.failed))}</strong></div>
1039:        <div class="publishing-overview-item is-wide"><span>Next publish window</span><strong>${escapeHtml(getNextPublishWindow(queue))}</strong></div>
1047:    ["Manual publishing readiness", counts.ready + counts.scheduled > 0 ? "Active" : "Needs queue"],
1048:    ["Content", counts.draft || counts.ready || counts.scheduled ? "Present" : "Empty"],
1051:    ["Approval", counts["needs approval"] ? "Pending" : counts.ready ? "Approved" : "Draft"],
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
1090:          <div class="simple-banner publishing-inline-gap"><strong>Approval needed:</strong> ${escapeHtml(asObject(getAutoModeState().approvalRequiredStep).reason || "Manual approval required.")}</div>
1091:          <div class="publishing-action-row publishing-inline-gap">
1092:            <button id="publishingAutoApproveBtn" class="btn btn-secondary" type="button">Approve automation step</button>
1093:            <button id="publishingAutoSkipBtn" class="btn btn-secondary" type="button">Skip automation step</button>
1097:      <div class="simple-banner">Opens AI with this context only. <strong>No approval, publishing, or backend execution is performed.</strong></div>
1107:    <div class="publishing-filter-row">
1112:          <button class="publishing-filter-chip${active ? " is-active" : ""}" type="button" data-publishing-filter="${escapeHtml(status)}">
1125:      <article class="publishing-queue-row${item.id === selectedId ? " is-active" : ""}" data-publishing-row="${escapeHtml(item.id)}">
1126:        <button class="publishing-queue-main" type="button" data-publishing-select="${escapeHtml(item.id)}">
1127:          <span class="publishing-queue-title">${escapeHtml(item.title)}</span>
1128:          <span class="publishing-queue-meta">${escapeHtml(titleCase(item.channel || "unassigned"))} • ${escapeHtml(item.scheduledFor ? formatDateTime(item.scheduledFor) : "Unscheduled")} • ${escapeHtml(item.source)}</span>
1130:        <div class="publishing-queue-state">${renderStatusPill(item.status, escapeHtml)}</div>
1131:        <div class="publishing-queue-actions">
1132:          <button type="button" data-publishing-action="review" data-publishing-id="${escapeHtml(item.id)}">Review Package</button>
1133:          <button type="button" data-publishing-action="schedule" data-publishing-id="${escapeHtml(item.id)}">Queue for Manual Publishing</button>
1134:          <button type="button" data-publishing-action="publish" data-publishing-id="${escapeHtml(item.id)}">Record Manual Completion</button>
1135:          <button type="button" data-publishing-action="pause" data-publishing-id="${escapeHtml(item.id)}">Pause to draft</button>
1136:          <button type="button" data-publishing-action="retry" data-publishing-id="${escapeHtml(item.id)}">Retry scheduled item</button>
1140:    : `<div class="empty-box">No publish queue items match this filter. Create or load a draft to start the execution queue.</div>`;
1143:    <section class="card publishing-card" id="publishingQueuePanel">
1152:      <div class="publishing-queue-list">${rows}</div>
1159:    <section class="card publishing-card" id="publishingBuilderPanel">
1163:          <h3>Draft, validate, and queue manual publishing records</h3>
1167:      <form id="publishingBuilderForm" class="setup-form-grid publishing-builder-form" novalidate>
1171:              <label class="setup-label" for="publishingProjectInput">Project</label>
1174:            <input id="publishingProjectInput" name="project" class="setup-input" type="text" value="${escapeHtml(session.form.project)}" placeholder="Project name">
1179:              <label class="setup-label" for="publishingCampaignInput">Campaign</label>
1182:            <input id="publishingCampaignInput" name="campaign" class="setup-input" type="text" value="${escapeHtml(session.form.campaign)}" placeholder="Campaign or launch wave">
1190:              <label class="setup-label" for="publishingChannelInput">Channel</label>
1193:            <select id="publishingChannelInput" name="channel" class="setup-input">
1203:              <label class="setup-label" for="publishingContentInput">Content item</label>
1206:            <input id="publishingContentInput" name="contentItem" class="setup-input" type="text" value="${escapeHtml(session.form.contentItem)}" placeholder="Caption, email, product update, or workflow output">
1214:              <label class="setup-label" for="publishingDateInput">Publish date</label>
1217:            <input id="publishingDateInput" name="publishDate" class="setup-input" type="date" value="${escapeHtml(session.form.publishDate)}">
1218:            ${fieldError(session, "publishDate", escapeHtml)}
1222:              <label class="setup-label" for="publishingTimeInput">Publish time</label>
1225:            <input id="publishingTimeInput" name="publishTime" class="setup-input" type="time" value="${escapeHtml(session.form.publishTime)}">
1229:              <label class="setup-label" for="publishingApprovalInput">Approval status</label>
1232:            <select id="publishingApprovalInput" name="approvalStatus" class="setup-input">
1243:            <label class="setup-label" for="publishingTitleInput">Queue title</label>
1246:          <input id="publishingTitleInput" name="title" class="setup-input" type="text" value="${escapeHtml(session.form.title)}" placeholder="Operator-facing title">
1251:            <label class="setup-label" for="publishingNotesInput">Execution notes</label>
1254:          <textarea id="publishingNotesInput" name="notes" class="setup-input setup-textarea" rows="4" placeholder="Approval notes, blockers, manual steps, content references">${escapeHtml(session.form.notes)}</textarea>
1257:      <div class="publishing-form-actions">
1258:        <button id="publishingNewItemBtn" class="btn btn-secondary" type="button">New Draft</button>
1259:        <button id="publishingBuilderSaveBtn" class="btn btn-secondary" type="button">Save publishing draft</button>
1260:        <button id="publishingScheduleBtn" class="btn btn-primary" type="button">Queue for Manual Publishing</button>
1270:      <section class="card publishing-card">
1278:        <div class="empty-box">Run or route a workflow into Publishing to load execution-ready output here.</div>
1286:    <section class="card publishing-card" id="publishingHandoffPanel">
1291:          <p class="publishing-section-copy">${escapeHtml(summarizeText(summary.summary, "Workflow output is available for draft loading."))}</p>
1301:      <div class="publishing-action-row">
1302:        <button id="publishingLoadHandoffBtn" class="btn btn-secondary" type="button">Load Workflow Output</button>
1316:      <section class="card publishing-card">
1324:        <div class="empty-box">Scheduled publishing items will appear here once timing exists in the queue.</div>
1332:      <div class="publishing-calendar-list">
1334:          <button class="publishing-calendar-row" type="button" data-publishing-select="${escapeHtml(item.id)}">
1346:      <div class="publishing-calendar-list publishing-block-gap">
1347:        <div class="simple-banner publishing-block-gap publishing-past-schedule-warning">Past scheduled items — reschedule required</div>
1349:          <button class="publishing-calendar-row" type="button" data-publishing-select="${escapeHtml(item.id)}">
1361:    <section class="card publishing-card">
1365:          <h3>${future.length ? "Upcoming scheduled items" : "Past scheduled items — reschedule required"}</h3>
1376:    .filter((item) => item.executedAt || item.status === "failed")
1378:  const failed = queue.filter((item) => item.status === "failed");
1380:  if (!latest && !failed.length) {
1382:      <section class="card publishing-card">
1386:            <h3>No publish result yet</h3>
1390:        <div class="empty-box">Last publish result and failed publish blockers will appear here after execution data exists.</div>
1396:    <section class="card publishing-card">
1400:          <h3>${escapeHtml(latest ? latest.title : "Failed publish blockers")}</h3>
1402:        <span class="card-badge ${badgeTone(latest?.status || "failed")}">${escapeHtml(latest ? titleCase(latest.status) : "Failed")}</span>
1411:      ${failed.length ? `
1412:        <div class="publishing-blocker-list">
1413:          ${failed.map((item) => `
1414:            <div class="simple-banner">${escapeHtml(item.title)}: ${escapeHtml(normalizeNotes(item.notes).join("; ") || "Failed publish needs review.")}</div>
1427:    <section class="card publishing-card">
1436:      <div class="simple-banner publishing-block-gap">${escapeHtml(getAssetNextAction(assetData, PUBLISHING_ASSET_KEYS))}</div>
1448:    showError?.(error.message || "Publishing action failed.");
1461:  reschedulePublishingItem,
1463:  publishPublishingItem,
1464:  failPublishingItem,
1509:      if (response?.job?.job_id) {
1510:        session.selectedId = response.job.job_id;
1511:        session.formSourceId = response.job.job_id;
1517:  Array.from(document.querySelectorAll("[data-publishing-filter]")).forEach((button) => {
1519:      session.filter = button.getAttribute("data-publishing-filter") || "all";
1524:  Array.from(document.querySelectorAll("[data-publishing-select]")).forEach((button) => {
1526:      const itemId = button.getAttribute("data-publishing-select") || "";
1533:  const form = $("publishingBuilderForm");
1544:  const newBtn = $("publishingNewItemBtn");
1548:      showMessage?.("New publishing draft opened.");
1553:  const openQueueBtn = $("publishingOpenQueueBtn");
1556:      document.getElementById("publishingQueuePanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
1560:  const saveDraftButtons = [$("publishingSaveDraftBtn"), $("publishingBuilderSaveBtn")].filter(Boolean);
1573:  const scheduleBtn = $("publishingScheduleBtn");
1593:        session.draftMessage = "Local publishing draft scheduled in this browser.";
1601:          ? "Confirm reschedule\n\nAction: Reschedule this publishing item.\n\nThis updates a backend publishing schedule and remains governed by approval rules.\n\nSelect Cancel to keep the current schedule."
1602:          : "Confirm schedule\n\nAction: Queue this publishing item for manual publishing.\n\nThis creates a backend publishing schedule and remains governed by approval rules.\n\nSelect Cancel to keep this as a draft."
1610:        ? () => reschedulePublishingItem(projectName, current.jobId, payload)
1621:      if (response?.job?.job_id) {
1622:        session.selectedId = response.job.job_id;
1623:        session.formSourceId = response.job.job_id;
1631:  Array.from(document.querySelectorAll("[data-publishing-action]")).forEach((button) => {
1633:      const itemId = button.getAttribute("data-publishing-id") || "";
1634:      const action = button.getAttribute("data-publishing-action") || "";
1647:        document.getElementById("publishingBuilderPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
1652:      const intent = action === "publish" ? "publish" : action === "retry" ? "retry" : "draft";
1659:        const nextStatus = action === "pause" ? "draft" : action === "retry" ? "scheduled" : action === "publish" ? "published" : item.status;
1661:        session.draftMessage = `Local draft ${action === "publish" ? "marked as manual completion recorded" : action === "pause" ? "paused" : "updated"}.`;
1667:      if (action === "publish") {
1668:        if (guardPublishingAssetBlockers(session, assetBlockers, showMessage, "publishing")) {
1674:          "Final Confirmation Required\n\nAction: Record manual publish completion for this backend job.\n\nThis is a high-risk status update. Confirm that external provider publishing was completed or verified outside this page before recording completion.\n\nThis does not prove live external publishing by itself. Backend approval rules still apply.\n\nSelect Cancel to keep this item in the queue."
1681:          () => publishPublishingItem(projectName, item.jobId, { notes: session.form.notes || item.notes }),
1682:          { projectName, reloadProjectData, showMessage, showError, successMessage: "Manual publishing completion recorded." }
1687:          "Confirm pause\n\nAction: Move this backend publishing item back to draft.\n\nThis updates the backend publishing lifecycle state.\n\nSelect Cancel to keep the item unchanged."
1695:          () => reschedulePublishingItem(projectName, item.jobId, buildSchedulePayload(session, "draft")),
1706:          "Confirm retry\n\nAction: Retry this backend publishing item in the scheduled queue.\n\nThis updates the backend publishing schedule/lifecycle state and remains governed by approval rules.\n\nSelect Cancel to keep the item unchanged."
1714:          () => reschedulePublishingItem(projectName, item.jobId, buildSchedulePayload(session, "scheduled")),
1722:  const approveBtn = $("publishingApproveBtn");
1727:        session.validation.contentItem = "Select or save a publishing draft before approval.";
1733:        updateLocalDraft(projectName, current.id, { ...buildLocalDraftPayload(session, "ready"), id: current.id, approvalStatus: "approved" });
1734:        showMessage?.("Local publishing draft approved.");
1740:        "Confirm publishing readiness\n\nAction: Mark this backend publishing item ready for manual publishing review.\n\nThis does not replace Governance approval or external provider readiness proof.\n\nSelect Cancel to keep the item unchanged."
1748:        () => approvePublishingItem(projectName, current.jobId, { notes: session.form.notes || current.notes }),
1749:        { projectName, reloadProjectData, showMessage, showError, successMessage: "Publishing item marked ready for manual review." }
1755:  const failBtn = $("publishingFailBtn");
1756:  if (failBtn) {
1757:    failBtn.onclick = async () => {
1760:        session.validation.contentItem = "Select a publishing item before marking it failed.";
1765:        updateLocalDraft(projectName, current.id, { ...buildLocalDraftPayload(session, "failed"), id: current.id });
1766:        showMessage?.("Local publishing draft marked failed.");
1771:      const confirmed = window.confirm("Confirm fail action\n\nAction: Mark this publishing item as failed.\nRisk: This creates a permanent failure record and stops the publishing lifecycle for this item.\nPolicy: Use only when this item cannot proceed and requires explicit failure logging.\n\nSelect Cancel to keep this item in its current state.");
1778:        () => failPublishingItem(projectName, current.jobId, { notes: session.form.notes || current.notes }),
1779:        { projectName, reloadProjectData, showMessage, showError, successMessage: "Publishing item marked as failed." }
1785:  const loadHandoffBtn = $("publishingLoadHandoffBtn");
1803:      saveDraftLocally("Workflow output loaded into a local publishing draft.");
1808:  const pushAiBtn = $("publishingPushAiBtn");
1824:        source_page: "publishing",
1827:          entity_type: "publishing_job",
1828:          entity_id: current?.jobId || session.formSourceId || ""
1832:          publishing_item_id: current?.jobId || session.formSourceId || "",
1833:          publishing_title: current?.title || session.form.title || "",
1849:  const autoPrepareBtn = $("publishingAutoPrepareBtn");
1854:        publishingAutomationState.progress = "";
1855:        publishingAutomationState.result = "No safe publishing preparation steps available.";
1860:      publishingAutomationState.result = "";
1861:      publishingAutomationState.progress = `Step 0 / ${plan.length}`;
1862:      publishingAutomationEnabled = true;
1870:        publishingAutomationState.progress = `Step ${index} / ${total}: ${step.action} (${result.status})`;
1875:      publishingAutomationState.result = runResult.status === "success"
1878:      showMessage?.(publishingAutomationState.result);
1883:  const autoStopBtn = $("publishingAutoStopBtn");
1891:  const autoApproveBtn = $("publishingAutoApproveBtn");
1899:  const autoSkipBtn = $("publishingAutoSkipBtn");
1908:export const publishingRoute = {
1909:  id: "publishing",
1914:    description: "Review, prepare, queue, and record manual publishing status with clear previews and backend-controlled actions."
1917:    <section class="page is-active" data-page="publishing">
1918:      <div id="publishingRoot"></div>
1931:    reschedulePublishingItem,
1933:    publishPublishingItem,
1934:    failPublishingItem
1945:    const root = $("publishingRoot");
1962:    const publishingAssets = filterAssetCategories(getAssetData(state), PUBLISHING_ASSET_KEYS);
1963:    const assetBlockers = publishingAssets.filter((item) => ["Missing", "Needs Review"].includes(item.status));
1971:      ${renderPublishingReadinessSummary({ selectedItem, recommendation, blockers: assetBlockers, assetData: publishingAssets, escapeHtml })}
1972:      <div class="publishing-execution-center">
1976:        <div class="publishing-execution-grid">
1977:          <div class="publishing-main-column">
1980:            <section class="card publishing-card">
1984:                  <h3>${escapeHtml(safeText(selectedItem?.title, "Selected publishing item"))}</h3>
1988:              <div class="publishing-action-row">
1989:                <button id="publishingApproveBtn" class="btn btn-secondary" type="button" title="Prepare publishing readiness review. Confirmation required. Backend approval rules apply.">Mark ready for manual review</button>
1990:                <button id="publishingFailBtn" class="btn btn-secondary" type="button" title="Request Approval Review or mark as failed. Confirmation required before execution.">Mark publishing item as failed</button>
1995:          <aside class="publishing-side-column">
2013:      reschedulePublishingItem,
2015:      publishPublishingItem,
2016:      failPublishingItem,
2017:      render: () => publishingRoute.render({
2027:        reschedulePublishingItem,
2029:        publishPublishingItem,
2030:        failPublishingItem

## Governance execution/publishing policy markers
116:  // Intake context: { ai, publishing, content, media, workflows, operations, notifications, insights }
119:  if (intakeContext?.publishing) items.push({ label: "Publishing", value: asString(intakeContext.publishing) });
188:    return "Submit reviewed approval decision? This records a backend Governance decision and may affect downstream readiness where policy gates apply. It does not publish, send, or execute directly.";
192:    return "Record high-risk override decision? This records a backend Governance override. It may unblock downstream gated actions where policy allows override. Continue only after verifying source evidence, risk, owner, and reason.";
223:  return asObject(asObject(summary?.policy).settings_bridge?.form);
228:  const publishing = asObject(settings.publishing);
234:    policy_rules: {
235:      approval_before_publish: Boolean(publishing.approvalBeforePublish),
240:      freeze_publishing: false
246:      publishing: asString(settings.team?.publishAccess) || "Publisher",
255:      approval_before_publish: Boolean(publishing.approvalBeforePublish)
357:    ...asArray(item.policy_flags),
381:      ${renderFlagList(flags, "No extra policy flags were attached to this approval.", escapeHtml)}
472:  const policy = asObject(summary?.policy);
473:  const rules = asObject(policy.policy_rules);
474:  const owners = asObject(policy.approval_owners);
477:    <div class="governance-policy-grid">
479:        <span class="settings-field-label">Require approval before publishing mutations</span>
480:        <input id="governance-approval-before-publish" type="checkbox" class="settings-toggle-input" data-governance-policy="approval_before_publish" ${rules.approval_before_publish ? "checked" : ""} />
485:        <input id="governance-claim-review" type="checkbox" class="settings-toggle-input" data-governance-policy="high_risk_claim_review_required" ${rules.high_risk_claim_review_required ? "checked" : ""} />
490:        <input id="governance-brand-safety" type="checkbox" class="settings-toggle-input" data-governance-policy="brand_safety_review_required" ${rules.brand_safety_review_required ? "checked" : ""} />
495:        <input id="governance-auto-escalate" type="checkbox" class="settings-toggle-input" data-governance-policy="auto_escalate_critical_risk" ${rules.auto_escalate_critical_risk ? "checked" : ""} />
500:        <input id="governance-admin-override" type="checkbox" class="settings-toggle-input" data-governance-policy="allow_admin_override" ${rules.allow_admin_override ? "checked" : ""} />
503:      <label class="settings-toggle" for="governance-freeze-publishing">
504:        <span class="settings-field-label">Freeze publishing mutations</span>
505:        <input id="governance-freeze-publishing" type="checkbox" class="settings-toggle-input" data-governance-policy="freeze_publishing" ${rules.freeze_publishing ? "checked" : ""} />
517:        <label class="settings-field-label" for="governance-owner-publishing">Publishing owner</label>
518:        <input id="governance-owner-publishing" class="settings-control" type="text" data-governance-owner="publishing" value="${escapeHtml(owners.publishing || "")}" />
545:      ...asArray(item.policy_flags),
588:    const approval = findApprovalForEntity(summary, "publishing_job", item.entity_id);
627:      prompt: `Summarize the current governance state for ${projectLabel}. Cover policy pressure, pending approvals, risky claims, brand safety issues, publish blockers, and the next governance priority.`
632:      prompt: `Review ${itemLabel} in Governance for ${projectLabel}. Explain the risk, what policy is implicated, and what decision path is safest next.`
644:  const policy = asObject(summary?.policy);
645:  const rules = asObject(policy.policy_rules);
646:  const owners = asObject(policy.approval_owners);
648:  const violations = asArray(sections.policy_violations).length;
654:  if (rules.freeze_publishing) {
655:    blockers.push("Publishing is currently frozen by governance policy.");
661:    blockers.push(`${violations} policy violation${violations === 1 ? " requires" : "s require"} operator review.`);
668:  if (rules.freeze_publishing || escalations > 0) {
674:  let nextBestAction = "Run a governance AI summary, then keep policy owners and rules aligned with live operations.";
680:    nextBestAction = "Inspect policy violations and request approvals where review is still missing.";
739:                <p>Governance operating surface for approvals, policy pressure, and decision routing.</p>
751:            <div class="empty-box">Select a project to review approvals, policy violations, overrides, and audit history.</div>
840:  const policy = asObject(summary.policy);
841:  const rules = asObject(policy.policy_rules);
842:  const owners = asObject(policy.approval_owners);
843:  const settingsBridge = asObject(policy.settings_bridge);
867:              <p class="mhos-context-description governance-operating-desc">Canonical executive surface for policy authority, approval pressure, escalation, and safe decision routing.</p>
901:              <small class="mhos-executive-metric-note governance-ai-boundary-note">AI cannot approve or change policy. Human backend decision required.</small>
905:          <div class="governance-policy-summary-grid">
906:            <div class="governance-policy-block mhos-executive-panel">
925:            <div class="governance-policy-block">
938:            <div class="governance-policy-block">
970:            ${renderMetric("Policy Violations", asArray(sections.policy_violations).length, "Needs review", escapeHtml)}
998:              <div class="governance-policy-summary-grid">
999:                <div class="governance-policy-block">
1010:                <div class="governance-policy-block">
1021:                <div class="governance-policy-block">
1022:                  <h4>Editable policy controls</h4>
1025:                <div class="governance-policy-block">
1026:                  <h4>Open policy signal</h4>
1027:                  ${renderFlagList(asArray(sections.policy_violations), "No policy violations are currently open.", escapeHtml)}
1129:                        intakeContext.publishing = getSharedHandoff(projectName, "publishing", operations)?.payload?.summary;
1166:                  ${renderFlagList(asArray(selectedItem.queue_flags), "No policy flags were attached to this item.", escapeHtml)}
1201:                <h3>Review, decide, and maintain policy controls</h3>
1206:              <div class="simple-banner"><strong>Authority boundary:</strong> Governance records reviewed backend decisions and policy gates. It does not publish, send, or execute directly. High-risk decisions require confirmation, evidence review, and backend authority remains enforced.</div>
1211:                <button class="btn btn-primary" type="button" data-governance-action="save-policy">Save Backend Governance Policy</button>
1243:              <div class="governance-policy-summary-grid">
1244:                <div class="governance-policy-block">
1257:                <div class="governance-policy-block">
1279:              <p>Explanation-only guidance. AI cannot approve, override, or change policy; backend decisions stay in governed controls.</p>
1384:      if (action === "save-policy") {
1385:        const policyRules = {};
1386:        Array.from(root.querySelectorAll("[data-governance-policy]")).forEach((control) => {
1387:          policyRules[control.getAttribute("data-governance-policy")] = Boolean(control.checked);
1395:        const confirmed = window.confirm("Confirm backend Governance policy save\n\nAction: Save durable Governance policy rules for this project.\nRisk: These rules can affect approvals, publishing readiness, brand safety review, admin override behavior, and freeze-publishing behavior.\nAuthority: This is a backend-governed durable policy update.\n\nSelect Cancel to review the policy settings before saving.");
1403:            policy_rules: policyRules,
1406:          context.showMessage("Backend Governance policy saved.");
1409:          context.showError(error.message || "Failed to save governance policy.");
1421:        const confirmed = window.confirm("Sync Settings-derived rules to Governance policy? This updates durable Governance rules including approval-before-publish, claim review, escalation, owners, override behavior, and policy behavior. Continue only if the Settings snapshot was reviewed.");
1431:          context.showMessage("Settings-derived rules synced into durable Governance policy.");
1466:    description: "Review backend approvals, policy violations, overrides, escalation, publishing gates, and audit visibility across content, media, campaigns, and publishing."

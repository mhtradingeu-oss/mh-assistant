# PHASE 3AB.2 — Cross-Page Notification Boundary Evidence

## Cross-page notification references
public/control-center/pages/ai-command/tool-dock.js:1221:            <div class="mhos-tool-drawer-warning" data-aicmd-tool-drawer-source-warning role="alert" hidden></div>
public/control-center/pages/operations-centers.js:89:    item?.notification_id ||
public/control-center/pages/operations-centers.js:244:      label: "Rank alert urgency",
public/control-center/pages/operations-centers.js:246:      prompt: `Review Notification Center for ${projectLabel}. Rank current alerts by urgency, explain what matters most, and identify what should be handled first.`
public/control-center/pages/operations-centers.js:249:      label: "Review selected alert",
public/control-center/pages/operations-centers.js:250:      preview: "Explain what the selected alert means and where to go next.",
public/control-center/pages/operations-centers.js:251:      prompt: `Review ${itemLabel} in Notification Center for ${projectLabel}. Explain what it means, what risk it creates, and which page or team should act next.`
public/control-center/pages/operations-centers.js:278:  const criticalAlerts = Number(notificationCenter.critical_count || 0);
public/control-center/pages/operations-centers.js:279:  const unreadNotifications = Number(notificationCenter.unread_count || 0);
public/control-center/pages/operations-centers.js:281:  const providerAlerts = asArray(notificationCenter.provider_disconnect_alerts).length;
public/control-center/pages/operations-centers.js:282:  const approvalAlerts = asArray(notificationCenter.approval_pending_alerts).length;
public/control-center/pages/operations-centers.js:283:  const publishAlerts = asArray(notificationCenter.publish_alerts).length;
public/control-center/pages/operations-centers.js:284:  const claimAlerts = asArray(notificationCenter.claim_risk_alerts).length;
public/control-center/pages/operations-centers.js:286:  const runtimeTone = failedJobs || criticalAlerts ? "danger" : runningJobs || queueItems || activeTasks ? "warning" : "success";
public/control-center/pages/operations-centers.js:287:  const runtimeLabel = failedJobs || criticalAlerts
public/control-center/pages/operations-centers.js:297:      helper: failedJobs || criticalAlerts ? "Failures or critical alerts detected" : "No critical runtime issue detected",
public/control-center/pages/operations-centers.js:316:      label: "Critical Alerts",
public/control-center/pages/operations-centers.js:317:      value: formatCount(criticalAlerts),
public/control-center/pages/operations-centers.js:319:      tone: criticalAlerts ? "danger" : "success",
public/control-center/pages/operations-centers.js:320:      route: "notification-center"
public/control-center/pages/operations-centers.js:324:      value: formatCount(approvalAlerts),
public/control-center/pages/operations-centers.js:326:      tone: approvalAlerts ? "warning" : "success",
public/control-center/pages/operations-centers.js:327:      route: "notification-center"
public/control-center/pages/operations-centers.js:331:      value: formatCount(publishAlerts),
public/control-center/pages/operations-centers.js:332:      helper: "Publishing alerts",
public/control-center/pages/operations-centers.js:333:      tone: publishAlerts ? "warning" : "success",
public/control-center/pages/operations-centers.js:338:      value: formatCount(providerAlerts),
public/control-center/pages/operations-centers.js:339:      helper: "Disconnected provider alerts",
public/control-center/pages/operations-centers.js:340:      tone: providerAlerts ? "warning" : "success",
public/control-center/pages/operations-centers.js:345:      value: formatCount(claimAlerts),
public/control-center/pages/operations-centers.js:347:      tone: claimAlerts ? "danger" : "success",
public/control-center/pages/operations-centers.js:352:      value: formatCount(unreadNotifications),
public/control-center/pages/operations-centers.js:353:      helper: "Unread operational notifications",
public/control-center/pages/operations-centers.js:354:      tone: unreadNotifications ? "warning" : "success",
public/control-center/pages/operations-centers.js:355:      route: "notification-center"
public/control-center/pages/operations-centers.js:1416:function deriveProviderDisconnectAlerts(state, existingAlerts) {
public/control-center/pages/operations-centers.js:1417:  if (asArray(existingAlerts).length) return asArray(existingAlerts);
public/control-center/pages/operations-centers.js:1447:  const providerDisconnectAlerts = deriveProviderDisconnectAlerts(state, notificationCenter.provider_disconnect_alerts);
public/control-center/pages/operations-centers.js:1453:    notification_id: asString(item.id),
public/control-center/pages/operations-centers.js:1457:  const syncAlerts = asArray(notificationCenter.sync_failure_alerts).map((item) => ({ ...item, item_type: "sync" }));
public/control-center/pages/operations-centers.js:1458:  const approvalAlerts = asArray(notificationCenter.approval_pending_alerts).map((item) => ({ ...item, item_type: "approval" }));
public/control-center/pages/operations-centers.js:1459:  const publishAlerts = asArray(notificationCenter.publish_alerts).map((item) => ({ ...item, item_type: "publish" }));
public/control-center/pages/operations-centers.js:1460:  const providerAlerts = providerDisconnectAlerts.map((item) => ({ ...item, item_type: "provider" }));
public/control-center/pages/operations-centers.js:1461:  const claimAlerts = asArray(notificationCenter.claim_risk_alerts).map((item) => ({ ...item, item_type: "claim" }));
public/control-center/pages/operations-centers.js:1462:  const workflowAlerts = asArray(notificationCenter.workflow_completion_alerts).map((item) => ({ ...item, item_type: "workflow" }));
public/control-center/pages/operations-centers.js:1463:  const baseAlerts = [
public/control-center/pages/operations-centers.js:1464:    ...syncAlerts,
public/control-center/pages/operations-centers.js:1465:    ...approvalAlerts,
public/control-center/pages/operations-centers.js:1466:    ...publishAlerts,
public/control-center/pages/operations-centers.js:1467:    ...providerAlerts,
public/control-center/pages/operations-centers.js:1468:    ...claimAlerts,
public/control-center/pages/operations-centers.js:1469:    ...workflowAlerts
public/control-center/pages/operations-centers.js:1472:    _opsKey: getOpsItemKey(item, index, "alert")
public/control-center/pages/operations-centers.js:1480:  let listItems = session.focus === "inbox" ? inboxList : baseAlerts;
public/control-center/pages/operations-centers.js:1481:  if (session.focus === "critical") listItems = baseAlerts.filter((item) => asString(item.severity) === "critical");
public/control-center/pages/operations-centers.js:1482:  if (session.focus === "approvals") listItems = approvalAlerts.map((item, index) => ({ ...item, _opsKey: getOpsItemKey(item, index, "approval") }));
public/control-center/pages/operations-centers.js:1483:  if (session.focus === "provider") listItems = providerAlerts.map((item, index) => ({ ...item, _opsKey: getOpsItemKey(item, index, "provider") }));
public/control-center/pages/operations-centers.js:1489:  const prompts = buildOpsAssistantPrompts("notification-center", projectName, selectedItem, titleCase(session.focus || "all"));
public/control-center/pages/operations-centers.js:1509:            <strong>Notification Center error</strong>
public/control-center/pages/operations-centers.js:1523:              <strong>${escapeHtml(item.title || "Alert")}</strong>
public/control-center/pages/operations-centers.js:1534:    <section class="page is-active" data-page="notification-center">
public/control-center/pages/operations-centers.js:1540:              <h3 class="std-context-title">Notification Center</h3>
public/control-center/pages/operations-centers.js:1542:            <p class="std-context-description">Route-aware operational alerts for approvals, sync issues, publishing, claim risk, provider health, and workflow completion for ${escapeHtml(projectLabel)}.</p>
public/control-center/pages/operations-centers.js:1543:            <div class="std-context-metrics" aria-label="Notification Center metrics">
public/control-center/pages/operations-centers.js:1544:              <span class="std-context-chip"><span>Active Alerts</span><strong>${escapeHtml(formatCount(baseAlerts.length))}</strong></span>
public/control-center/pages/operations-centers.js:1545:              <span class="std-context-chip"><span>Unread Inbox</span><strong>${escapeHtml(formatCount(notificationCenter.unread_count))}</strong></span>
public/control-center/pages/operations-centers.js:1547:              <span class="std-context-chip is-warning"><span>Approvals</span><strong>${escapeHtml(formatCount(approvalAlerts.length))}</strong></span>
public/control-center/pages/operations-centers.js:1568:                <h3>${escapeHtml(session.focus === "inbox" ? "Notification history" : "Operational alerts")}</h3>
public/control-center/pages/operations-centers.js:1569:                <p>${escapeHtml(session.focus === "inbox" ? "Review durable inbox history and mark notifications as read where supported." : "Review route-aware alerts, then inspect the selected signal in detail.")}</p>
public/control-center/pages/operations-centers.js:1575:              { value: "all", label: "All Alerts", count: formatCount(baseAlerts.length) },
public/control-center/pages/operations-centers.js:1577:              { value: "approvals", label: "Approvals", count: formatCount(approvalAlerts.length) },
public/control-center/pages/operations-centers.js:1578:              { value: "provider", label: "Provider", count: formatCount(providerAlerts.length) },
public/control-center/pages/operations-centers.js:1583:              <input id="notificationCenterSearch" class="command-input" type="text" placeholder="Search alerts, sources, messages..." value="${escapeHtml(session.search)}">
public/control-center/pages/operations-centers.js:1590:              <div class="error-state ops-notification-state" aria-live="assertive"><strong>Notification Center error</strong><span>${escapeHtml(session.errorMessage)}</span></div>
public/control-center/pages/operations-centers.js:1607:                  <p>${escapeHtml(selectedItem ? "Review source, severity, timing, and owning route before follow-up." : "Choose an alert or inbox item to inspect details.")}</p>
public/control-center/pages/operations-centers.js:1635:                <button class="btn btn-primary" type="button" id="notificationCenterRefreshBtn">Refresh Notification Center</button>
public/control-center/pages/operations-centers.js:1637:                ${selectedItem?.notification_id ? `<button class="btn btn-secondary" type="button" data-mark-read="${escapeHtml(selectedItem.notification_id)}">Mark Read</button>` : ""}
public/control-center/pages/operations-centers.js:1642:                  <span>${escapeHtml(`${formatCount(approvalAlerts.length)} alerts`)}</span>
public/control-center/pages/operations-centers.js:1646:                  <span>${escapeHtml(`${formatCount(providerAlerts.length)} alerts`)}</span>
public/control-center/pages/operations-centers.js:1650:                  <span>${escapeHtml(`${formatCount(claimAlerts.length)} alerts`)}</span>
public/control-center/pages/operations-centers.js:1654:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Acknowledge notification (deferred: mutation safety pass)</button>
public/control-center/pages/operations-centers.js:1655:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Resolve notification (deferred: mutation safety pass)</button>
public/control-center/pages/operations-centers.js:1656:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Dismiss notification (deferred: mutation safety pass)</button>
public/control-center/pages/operations-centers.js:1657:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Delete notification (deferred: mutation safety pass)</button>
public/control-center/pages/operations-centers.js:1703:          session.errorMessage = `Notification Center: ${error?.message || "Failed to refresh."}`;
public/control-center/pages/operations-centers.js:1733:      if (!notificationId || !context.markProjectNotification) return;
public/control-center/pages/operations-centers.js:1735:        await context.markProjectNotification(projectName, notificationId, { status: "read", read: true });
public/control-center/pages/operations-centers.js:1879:  id: "notification-center",
public/control-center/pages/operations-centers.js:1883:    title: "Notification Center",
public/control-center/pages/operations-centers.js:1884:    description: "Review sync failures, pending approvals, publish events, provider disconnects, claim risks, and workflow completion alerts."
public/control-center/pages/operations-centers.js:1886:  template: `<section class="page is-active" data-page="notification-center"><div class="ops-shell"></div></section>`,
public/control-center/pages/operations-centers.js:1916:          session.errorMessage = `Notification Center: ${error?.message || "Failed to load live data."}`;
public/control-center/pages/operations-centers.js:1965:      route: "notification-center",
public/control-center/pages/operations-centers.js:1966:      title: "Notification Center",
public/control-center/pages/operations-centers.js:2047:                  <p>This overview does not execute jobs, mutate tasks, send notifications, or approve workflows. It only routes to the owning workspace.</p>
public/control-center/pages/ai-command.js:2359:	"notification-center": "Notification Center",
public/control-center/pages/ai-command.js:2381:	"notification-center": "operations",
public/control-center/pages/ai-command.js:2415:	notifications: "notification-center",
public/control-center/pages/library.js:521:            alert(message);
public/control-center/pages/home.js:250:  const unreadNotifications = notifications.filter((item) => !item?.read_at);
public/control-center/pages/home.js:425:      kind: "Alert",
public/control-center/pages/home.js:462:          summary: `${formatCount(pendingApprovals.length)} approvals pending, ${formatCount(failedExecutions.length)} escalations, ${formatCount(unreadNotifications.length)} notifications, system score ${formatPercent(systemScore)}.`
public/control-center/pages/home.js:487:      criticalAlerts: criticalGaps.length + failedExecutions.length + unreadNotifications.length
public/control-center/pages/home.js:556:        value: formatCount(unreadNotifications.length + pendingTasks.length + pendingApprovals.length),
public/control-center/pages/home.js:558:        tone: unreadNotifications.length + pendingTasks.length + pendingApprovals.length ? "warning" : "success"
public/control-center/pages/home.js:619:      notifications: unreadNotifications.length,
public/control-center/pages/governance.js:235:      approval_before_publish: Boolean(publishing.approvalBeforePublish),
public/control-center/pages/governance.js:240:      freeze_publishing: false
public/control-center/pages/governance.js:255:      approval_before_publish: Boolean(publishing.approvalBeforePublish)
public/control-center/pages/governance.js:480:        <input id="governance-approval-before-publish" type="checkbox" class="settings-toggle-input" data-governance-policy="approval_before_publish" ${rules.approval_before_publish ? "checked" : ""} />
public/control-center/pages/governance.js:505:        <input id="governance-freeze-publishing" type="checkbox" class="settings-toggle-input" data-governance-policy="freeze_publishing" ${rules.freeze_publishing ? "checked" : ""} />
public/control-center/pages/governance.js:654:  if (rules.freeze_publishing) {
public/control-center/pages/governance.js:668:  if (rules.freeze_publishing || escalations > 0) {
public/control-center/pages/integrations.js:512:        purpose: "Operational alerting, workflow notifications, and team collaboration handoff.",
public/control-center/pages/integrations.js:513:        whyItMatters: "Slack can surface sync failures, content approvals, and campaign alerts where the team already works.",
public/control-center/pages/integrations.js:514:        enables: "Alerts, approvals, sync notifications, and workflow coordination.",
public/control-center/pages/integrations.js:515:        dataScope: ["Notifications", "Approvals", "Ops alerts"],
public/control-center/pages/integrations.js:520:          { key: "channelId", label: "Channel ID", placeholder: "Channel ID for alerts" },
public/control-center/pages/integrations.js:529:        purpose: "Bot-based operational alerts, approvals, and lightweight workflow execution.",
public/control-center/pages/integrations.js:531:        enables: "Alerts, commands, approval handoff, and ops notifications.",
public/control-center/pages/integrations.js:532:        dataScope: ["Alerts", "Commands", "Approvals"],
public/control-center/pages/publishing.js:1989:                <button id="publishingApproveBtn" class="btn btn-secondary" type="button" title="Prepare publishing readiness review. Confirmation required. Backend approval rules apply.">Mark ready for manual review</button>
public/control-center/pages/settings.js:47:  "Alert when integrations fail",
public/control-center/pages/settings.js:292:        options: ["Pause and alert", "Retry then route", "Route to operator immediately", "Record only"]
public/control-center/pages/settings.js:521:        options: ["Retry twice then alert", "Retry once", "Manual retry only", "Escalate immediately"]
public/control-center/pages/settings.js:538:    id: "alerts",
public/control-center/pages/settings.js:539:    title: "Alerts & Notification Rules",
public/control-center/pages/settings.js:540:    description: "Control which operational events trigger alerts so teams can intervene before failures become launch problems.",
public/control-center/pages/settings.js:544:        path: "alerts.enabledRules",
public/control-center/pages/settings.js:545:        label: "Active alerts",
public/control-center/pages/settings.js:549:          "Sync failure alerts",
public/control-center/pages/settings.js:550:          "Approval pending alerts",
public/control-center/pages/settings.js:551:          "Scheduled publish alerts",
public/control-center/pages/settings.js:552:          "Provider disconnect alerts",
public/control-center/pages/settings.js:553:          "Claim safety alerts",
public/control-center/pages/settings.js:554:          "Workflow completion alerts"
public/control-center/pages/settings.js:558:        path: "alerts.deliveryMode",
public/control-center/pages/settings.js:564:        path: "alerts.alertCadence",
public/control-center/pages/settings.js:570:        path: "alerts.notificationNotes",
public/control-center/pages/settings.js:573:        placeholder: "Use immediate alerts for provider disconnects and claim safety issues; batch lower-priority workflow completions."
public/control-center/pages/settings.js:599:        path: "safety.complianceAlerts",
public/control-center/pages/settings.js:600:        label: "Compliance alerts",
public/control-center/pages/settings.js:642:    description: "Review connector refresh behavior, import policy, and alert routing without turning Settings into a sync control center.",
public/control-center/pages/settings.js:643:    sectionIds: ["sync", "alerts"]
public/control-center/pages/settings.js:715:    approvalBeforePublish: rules.approval_before_publish ?? normalized.publishing?.approvalBeforePublish
public/control-center/pages/settings.js:773:      approval_before_publish: Boolean(publishing.approvalBeforePublish),
public/control-center/pages/settings.js:778:      freeze_publishing: asString(operating.primaryMode) === "Emergency Safe Mode"
public/control-center/pages/settings.js:922:        "Alert when integrations fail",
public/control-center/pages/settings.js:926:      failurePolicy: "Pause and alert",
public/control-center/pages/settings.js:1032:      retryFailedBehavior: "Retry twice then alert",
public/control-center/pages/settings.js:1036:    alerts: {
public/control-center/pages/settings.js:1038:        "Sync failure alerts",
public/control-center/pages/settings.js:1039:        "Approval pending alerts",
public/control-center/pages/settings.js:1040:        "Provider disconnect alerts",
public/control-center/pages/settings.js:1041:        "Claim safety alerts"
public/control-center/pages/settings.js:1044:      alertCadence: "Immediate only",
public/control-center/pages/settings.js:1045:      notificationNotes: "Escalate provider disconnects and claim safety alerts immediately; batch lower-risk completions."
public/control-center/pages/settings.js:1051:      complianceAlerts: "Alert on regulated claims, platform policy conflicts, and high-risk launch copy.",
public/control-center/pages/settings.js:1148:  const integrationReady = Boolean(form.sync.frequency && Array.isArray(form.alerts.enabledRules) && form.alerts.enabledRules.length);
public/control-center/pages/settings.js:1173:      label: "Integrations and operations alerts",
public/control-center/pages/settings.js:1176:        ? "Sync cadence and alert routing are defined for operations visibility."
public/control-center/pages/settings.js:1177:        : "Set sync cadence and alert coverage so operations can intervene safely."
public/control-center/pages/settings.js:1229:  if (!Array.isArray(form.alerts.enabledRules) || !form.alerts.enabledRules.length) {
public/control-center/pages/settings.js:1230:    risks.push("Alert rules are missing, which reduces visibility into sync failures, approval delays, and provider issues.");
public/control-center/pages/settings.js:1695:      detail: "Sync cadence and alert routes determine how quickly teams detect connector or launch risk."
public/control-center/app.js:62:  markProjectNotification,
public/control-center/app.js:1932:  const unread = notifications.filter((item) => !item?.read_at).length;
public/control-center/app.js:1939:  setText("ctxAlerts", unread);
public/control-center/app.js:2102:      markProjectNotification,

## Governance notification/policy markers
109:      ${!hasEvidence ? `<div class="governance-evidence-card is-missing governance-source-warning">Missing source evidence — attach Library proof before high-risk approval.</div>` : ""}
110:      <div class="governance-evidence-guidance">High-risk Governance decisions should reference source-of-truth evidence, proof assets, or an incoming handoff. Missing evidence should be resolved before approval, rejection, escalation, or override.</div>
116:  // Intake context: { ai, publishing, content, media, workflows, operations, notifications, insights }
124:  if (intakeContext?.notifications) items.push({ label: "Notifications", value: asString(intakeContext.notifications) });
187:  if (["approval", "approved", "approve"].includes(normalized)) {
188:    return "Submit reviewed approval decision? This records a backend Governance decision and may affect downstream readiness where policy gates apply. It does not publish, send, or execute directly.";
192:    return "Record high-risk override decision? This records a backend Governance override. It may unblock downstream gated actions where policy allows override. Continue only after verifying source evidence, risk, owner, and reason.";
223:  return asObject(asObject(summary?.policy).settings_bridge?.form);
227:  const approval = asObject(settings.approval);
234:    policy_rules: {
235:      approval_before_publish: Boolean(publishing.approvalBeforePublish),
240:      freeze_publishing: false
242:    approval_owners: {
243:      content: asString(approval.contentOwner) || "Marketing lead",
244:      media: asString(approval.mediaOwner) || "Creative lead",
245:      campaign: asString(approval.adsOwner) || "Operations lead",
253:      approval_mode: asString(ai.approvalRequiredMode) || "Only high-risk",
255:      approval_before_publish: Boolean(publishing.approvalBeforePublish)
261:  return asArray(summary?.sections?.approval_queue).find((item) =>
357:    ...asArray(item.policy_flags),
369:          <div class="panel-kicker">${escapeHtml(titleCase(item.entity_type || "approval"))}</div>
381:      ${renderFlagList(flags, "No extra policy flags were attached to this approval.", escapeHtml)}
384:        <button class="btn btn-primary" type="button" data-governance-decision="approved" data-approval-id="${escapeHtml(item.id)}">Submit Reviewed Approval</button>
385:        <button class="btn btn-secondary" type="button" data-governance-decision="rejected" data-approval-id="${escapeHtml(item.id)}">Submit Rejection Decision</button>
386:        <button class="btn btn-secondary" type="button" data-governance-decision="changes_requested" data-approval-id="${escapeHtml(item.id)}">Request Changes Review</button>
387:        <button class="btn btn-secondary" type="button" data-governance-decision="escalated" data-approval-id="${escapeHtml(item.id)}">Escalate Review</button>
388:        <button class="btn btn-secondary" type="button" data-governance-decision="overridden" data-approval-id="${escapeHtml(item.id)}">Record High-Risk Override</button>
404:function renderReviewCard(item, type, escapeHtml, approval) {
419:        <span class="card-badge ${approval ? "warning" : "neutral"}">${escapeHtml(approval ? "In approval queue" : "Not requested")}</span>
426:      ${approval ? `
428:          <strong>Linked approval:</strong> ${escapeHtml(approval.title || approval.id)} • ${escapeHtml(titleCase(approval.status))}
435:            data-governance-request-approval="true"
472:  const policy = asObject(summary?.policy);
473:  const rules = asObject(policy.policy_rules);
474:  const owners = asObject(policy.approval_owners);
477:    <div class="governance-policy-grid">
478:      <label class="settings-toggle" for="governance-approval-before-publish">
479:        <span class="settings-field-label">Require approval before publishing mutations</span>
480:        <input id="governance-approval-before-publish" type="checkbox" class="settings-toggle-input" data-governance-policy="approval_before_publish" ${rules.approval_before_publish ? "checked" : ""} />
485:        <input id="governance-claim-review" type="checkbox" class="settings-toggle-input" data-governance-policy="high_risk_claim_review_required" ${rules.high_risk_claim_review_required ? "checked" : ""} />
490:        <input id="governance-brand-safety" type="checkbox" class="settings-toggle-input" data-governance-policy="brand_safety_review_required" ${rules.brand_safety_review_required ? "checked" : ""} />
495:        <input id="governance-auto-escalate" type="checkbox" class="settings-toggle-input" data-governance-policy="auto_escalate_critical_risk" ${rules.auto_escalate_critical_risk ? "checked" : ""} />
500:        <input id="governance-admin-override" type="checkbox" class="settings-toggle-input" data-governance-policy="allow_admin_override" ${rules.allow_admin_override ? "checked" : ""} />
505:        <input id="governance-freeze-publishing" type="checkbox" class="settings-toggle-input" data-governance-policy="freeze_publishing" ${rules.freeze_publishing ? "checked" : ""} />
534:  const approvals = asArray(sections.approval_queue).map((item) => ({
536:    queue_kind: "approval",
537:    selected_key: `approval:${asString(item.id)}`,
545:      ...asArray(item.policy_flags),
550:    linked_approval: item
554:    const approval = findApprovalForEntity(summary, item.entity_type, item.entity_id);
561:      queue_status: approval?.status || item.status || "open",
563:      queue_owner: approval?.reviewer || "Compliance Reviewer",
564:      queue_created: approval?.created_at || item.updated_at || item.created_at,
566:      linked_approval: approval
571:    const approval = findApprovalForEntity(summary, item.entity_type, item.entity_id);
578:      queue_status: approval?.status || item.status || "open",
580:      queue_owner: approval?.reviewer || "Brand Reviewer",
581:      queue_created: approval?.created_at || item.updated_at || item.created_at,
583:      linked_approval: approval
588:    const approval = findApprovalForEntity(summary, "publishing_job", item.entity_id);
595:      queue_status: approval?.status || item.status || "open",
597:      queue_owner: approval?.reviewer || "Publishing Reviewer",
598:      queue_created: approval?.created_at || item.updated_at || item.created_at,
600:      linked_approval: approval
617:  return [...approvals, ...claims, ...brand, ...publish, ...escalations];
626:      preview: "Explain the current approval pressure, risk level, and next governance priority.",
627:      prompt: `Summarize the current governance state for ${projectLabel}. Cover policy pressure, pending approvals, risky claims, brand safety issues, publish blockers, and the next governance priority.`
632:      prompt: `Review ${itemLabel} in Governance for ${projectLabel}. Explain the risk, what policy is implicated, and what decision path is safest next.`
637:      prompt: `Review Governance for ${projectLabel} with focus on ${focusLabel}. Identify the highest-risk governance gaps, where approval ownership is weak, and what rules need tightening next.`
644:  const policy = asObject(summary?.policy);
645:  const rules = asObject(policy.policy_rules);
646:  const owners = asObject(policy.approval_owners);
647:  const approvals = asArray(sections.approval_queue).length;
648:  const violations = asArray(sections.policy_violations).length;
654:  if (rules.freeze_publishing) {
655:    blockers.push("Publishing is currently frozen by governance policy.");
657:  if (approvals > 0) {
658:    blockers.push(`${approvals} approval item${approvals === 1 ? " is" : "s are"} waiting for a decision.`);
661:    blockers.push(`${violations} policy violation${violations === 1 ? " requires" : "s require"} operator review.`);
668:  if (rules.freeze_publishing || escalations > 0) {
674:  let nextBestAction = "Run a governance AI summary, then keep policy owners and rules aligned with live operations.";
675:  if (selectedItem?.queue_kind === "approval") {
676:    nextBestAction = "Review the selected approval, document decision reasoning, and submit a governance decision.";
677:  } else if (approvals > 0) {
680:    nextBestAction = "Inspect policy violations and request approvals where review is still missing.";
691:    approvals,
739:                <p>Governance operating surface for approvals, policy pressure, and decision routing.</p>
751:            <div class="empty-box">Select a project to review approvals, policy violations, overrides, and audit history.</div>
820:    approvals: queueItems.filter((item) => item.queue_kind === "approval").length,
829:      approvals: "approval",
840:  const policy = asObject(summary.policy);
841:  const rules = asObject(policy.policy_rules);
842:  const owners = asObject(policy.approval_owners);
843:  const settingsBridge = asObject(policy.settings_bridge);
867:              <p class="mhos-context-description governance-operating-desc">Canonical executive surface for policy authority, approval pressure, escalation, and safe decision routing.</p>
878:            <article class="mhos-executive-summary-item governance-summary-approval">
880:              <strong class="mhos-executive-metric-value">${escapeHtml(asString(readiness.approvals))}</strong>
881:              <small class="mhos-executive-metric-note">${escapeHtml(readiness.approvals ? "Awaiting governed decision" : "No approval queue pressure")}</small>
901:              <small class="mhos-executive-metric-note governance-ai-boundary-note">AI cannot approve or change policy. Human backend decision required.</small>
905:          <div class="governance-policy-summary-grid">
906:            <div class="governance-policy-block mhos-executive-panel">
921:                <button class="btn btn-secondary" type="button" data-governance-focus="approvals">Open Approvals</button>
925:            <div class="governance-policy-block">
938:            <div class="governance-policy-block">
943:                  <span>${escapeHtml(readiness.approvals ? "Review queued approvals" : "No queued approvals")}</span>
956:            <button class="btn btn-secondary" type="button" data-governance-focus="approvals">Focus Approvals</button>
969:            ${renderMetric("Approval Queue", asArray(sections.approval_queue).length, "Awaiting decision", escapeHtml)}
970:            ${renderMetric("Policy Violations", asArray(sections.policy_violations).length, "Needs review", escapeHtml)}
998:              <div class="governance-policy-summary-grid">
999:                <div class="governance-policy-block">
1010:                <div class="governance-policy-block">
1021:                <div class="governance-policy-block">
1022:                  <h4>Editable policy controls</h4>
1025:                <div class="governance-policy-block">
1026:                  <h4>Open policy signal</h4>
1027:                  ${renderFlagList(asArray(sections.policy_violations), "No policy violations are currently open.", escapeHtml)}
1029:                    <strong>Settings bridge:</strong> ${escapeHtml(settingsBridge.source || "Not synced")} • approval mode ${escapeHtml(settingsBridge.approval_mode || "unknown")} • claim mode ${escapeHtml(settingsBridge.claim_safety_mode || "unknown")} • synced ${escapeHtml(settingsBridge.synced_at ? formatDateTime(settingsBridge.synced_at) : "not yet")}
1039:                  <h3>Pending approvals and governance decisions</h3>
1047:                  ["approvals", "Approvals", focusCounts.approvals],
1101:                  <p>${escapeHtml(selectedItem ? "Review risk, owner, evidence, and linked approval before decision." : "Choose a governance item from the queue to inspect it.")}</p>
1134:                        intakeContext.notifications = getSharedHandoff(projectName, "notifications", operations)?.payload?.summary;
1166:                  ${renderFlagList(asArray(selectedItem.queue_flags), "No policy flags were attached to this item.", escapeHtml)}
1168:                    selectedItem.linked_approval
1171:                          <strong>Linked approval:</strong> ${escapeHtml(selectedItem.linked_approval.title || selectedItem.linked_approval.id)} • ${escapeHtml(titleCase(selectedItem.linked_approval.status || "pending"))}
1201:                <h3>Review, decide, and maintain policy controls</h3>
1202:                <p>Backend-authoritative decisions only. Approval actions mutate durable approval records and appear only for real queued approvals.</p>
1206:              <div class="simple-banner"><strong>Authority boundary:</strong> Governance records reviewed backend decisions and policy gates. It does not publish, send, or execute directly. High-risk decisions require confirmation, evidence review, and backend authority remains enforced.</div>
1211:                <button class="btn btn-primary" type="button" data-governance-action="save-policy">Save Backend Governance Policy</button>
1214:                  selectedItem?.queue_kind === "approval"
1216:                      <button class="btn btn-primary" type="button" data-governance-decision="approved" data-approval-id="${escapeHtml(selectedItem.id)}">Submit Reviewed Approval</button>
1217:                      <button class="btn btn-secondary" type="button" data-governance-decision="rejected" data-approval-id="${escapeHtml(selectedItem.id)}">Submit Rejection Decision</button>
1218:                      <button class="btn btn-secondary" type="button" data-governance-decision="changes_requested" data-approval-id="${escapeHtml(selectedItem.id)}">Request Changes Review</button>
1219:                      <button class="btn btn-secondary" type="button" data-governance-decision="escalated" data-approval-id="${escapeHtml(selectedItem.id)}">Escalate Review</button>
1220:                      <button class="btn btn-secondary" type="button" data-governance-decision="overridden" data-approval-id="${escapeHtml(selectedItem.id)}">Record High-Risk Override</button>
1225:                  selectedItem && selectedItem.queue_kind !== "approval" && !selectedItem.linked_approval
1230:                        data-governance-request-approval="true"
1243:              <div class="governance-policy-summary-grid">
1244:                <div class="governance-policy-block">
1257:                <div class="governance-policy-block">
1279:              <p>Explanation-only guidance. AI cannot approve, override, or change policy; backend decisions stay in governed controls.</p>
1282:          <div class="simple-banner"><strong>AI guidance scope:</strong> Policy pressure, approval readiness, ownership coverage, risk, and next governance move.</div>
1311:      const approvalId = button.getAttribute("data-approval-id") || "";
1322:        await decideProjectApproval(projectName, approvalId, {
1328:        context.showMessage(`Approval ${titleCase(decision)} for ${approvalId}.`);
1331:        context.showError(error.message || "Failed to update approval.");
1350:  Array.from(root.querySelectorAll("[data-governance-request-approval]")).forEach((button) => {
1357:          title: `${button.getAttribute("data-title") || "Governance item"} approval`,
1370:        context.showError(error.message || "Failed to request approval.");
1384:      if (action === "save-policy") {
1385:        const policyRules = {};
1386:        Array.from(root.querySelectorAll("[data-governance-policy]")).forEach((control) => {
1387:          policyRules[control.getAttribute("data-governance-policy")] = Boolean(control.checked);
1390:        const approvalOwners = {};
1392:          approvalOwners[control.getAttribute("data-governance-owner")] = control.value || "";
1395:        const confirmed = window.confirm("Confirm backend Governance policy save\n\nAction: Save durable Governance policy rules for this project.\nRisk: These rules can affect approvals, publishing readiness, brand safety review, admin override behavior, and freeze-publishing behavior.\nAuthority: This is a backend-governed durable policy update.\n\nSelect Cancel to review the policy settings before saving.");
1403:            policy_rules: policyRules,
1404:            approval_owners: approvalOwners
1406:          context.showMessage("Backend Governance policy saved.");
1409:          context.showError(error.message || "Failed to save governance policy.");
1421:        const confirmed = window.confirm("Sync Settings-derived rules to Governance policy? This updates durable Governance rules including approval-before-publish, claim review, escalation, owners, override behavior, and policy behavior. Continue only if the Settings snapshot was reviewed.");
1431:          context.showMessage("Settings-derived rules synced into durable Governance policy.");
1466:    description: "Review backend approvals, policy violations, overrides, escalation, publishing gates, and audit visibility across content, media, campaigns, and publishing."

## Publishing notification/status markers
2:function renderPublishingCommandHeader({ projectName, recommendation, selectedItem, summary, queue, blockers, escapeHtml }) {
9:  const approval = selectedItem?.approvalStatus ? titleCase(selectedItem.approvalStatus) : "Draft";
10:  const nextAction = recommendation?.action ? escapeHtml(recommendation.action) : "Review queue";
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
30:function renderPublishingWorkflowStrip({ selectedItem, recommendation, blockers, approvalState, escapeHtml }) {
35:    { key: "approval", label: "Approval" },
43:    approval: selectedItem?.approvalStatus === "approved" ? "ready" : selectedItem?.approvalStatus === "needs approval" ? "warning" : "missing",
45:    handoff: selectedItem?.status === "published" ? "ready" : "missing"
48:    <nav class="publishing-workflow-strip" aria-label="Publishing Workflow">
50:        <div class="publishing-workflow-step is-${statusMap[step.key]}" aria-label="${escapeHtml(step.label)}: ${statusMap[step.key]}">
52:          <span class="publishing-workflow-step-label">${statusMap[step.key]}</span>
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
273:  if (["needs approval", "needs_approval", "approval", "pending_approval", "review", "in_review"].includes(normalized)) {
274:    return "needs approval";
276:  if (["scheduled", "queued", "queue", "pending", "pending_publish"].includes(normalized)) return "scheduled";
277:  if (["published", "completed", "complete", "success", "done", "sent", "live"].includes(normalized)) return "published";
278:  if (["failed", "error", "blocked", "rejected"].includes(normalized)) return "failed";
284:  if (status === "published") return "success";
286:  if (status === "failed") return "danger";
325:    id: asString(draft.id || `local-publish-${Date.now()}`),
355:    publishDate: toDateInput(tomorrow),
356:    publishTime: "09:00",
357:    approvalStatus: "draft",
365:  if (!publishingSessions.has(key)) {
366:    publishingSessions.set(key, {
377:  return publishingSessions.get(key);
395:  if (item.campaign) return `${item.campaign} ${titleCase(item.channel || "publish")}`;
396:  if (context.activeCampaign) return `${context.activeCampaign} ${titleCase(item.channel || "publish")}`;
418:    approvalStatus: status === "ready" ? "approved" : status === "needs approval" ? "needs approval" : "draft",
471:    failed: 0,
473:    "needs approval": 2,
476:    published: 5
486:function buildChannels(state, queue) {
491:      ...queue.map((item) => item.channel),
497:function getStatusCounts(queue) {
499:    acc[status] = queue.filter((item) => item.status === status).length;
504:function getVisibleQueue(queue, filter) {
505:  if (!filter || filter === "all") return queue;
506:  return queue.filter((item) => item.status === filter);
509:function getSelectedItem(queue, selectedId) {
510:  return queue.find((item) => item.id === selectedId) || null;
513:function getNextPublishWindow(queue) {
514:  const next = queue
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
588:      action: "Record manual publish completion",
591:        reason: "This records a manual publishing completion only after review; external provider execution requires separate proof."
606:  if (["schedule", "publish", "retry"].includes(intent) && !clean(form.publishDate)) {
607:    errors.publishDate = "Publish date is required for this action.";
609:  if (intent === "publish" && form.approvalStatus !== "approved") {
610:    errors.approvalStatus = "Publishing readiness must be approved before recording manual completion.";
626:function guardPublishingAssetBlockers(session, assetBlockers, showMessage, actionLabel = "this publishing action") {
630:  const message = `Publishing blocker(s) must be resolved before ${actionLabel}: ${summary || "required publishing assets are missing or need review"}.`;
643:  return message ? `<div class="publishing-inline-error">${escapeHtml(message)}</div>` : "";
647:  // Add governance/approval hints for status pills
649:  if (status === "needs approval") {
652:    hint = "title=\"Prepare Governance Review. Backend approval rules apply.\" aria-label=\"Prepare Governance Review. Backend approval rules apply.\"";
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
769:      /* Publishing queue dark contrast correction */
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
967:function buildRecommendation({ queue, counts, assetBlockers, checks, handoff, globalBlockers }) {
968:  const failed = queue.find((item) => item.status === "failed");
969:  const ready = queue.find((item) => item.status === "ready");
970:  const needsApproval = queue.find((item) => item.status === "needs approval");
971:  const draft = queue.find((item) => item.status === "draft");
975:  if (failed) {
977:      action: "Retry failed publishing item",
978:      why: `${failed.title} is blocked or failed. Clear the blocker before adding more scheduled work.`,
979:      focusId: failed.id,
992:      action: "Review approval queue",
993:      why: `${needsApproval.title} needs approval before it can move into the manual publishing queue.`,
1009:      why: `${draft.title} is not yet executable. Add channel, content, approval, and timing details.`,
1015:    action: connectedCount ? "Create a publishing draft" : "Connect a publishing channel",
1017:      ? "No queue item is ready. Start with a draft and save it locally until it can be scheduled."
1024:function renderOverview(counts, queue, escapeHtml) {
1026:    <section class="card publishing-card">
1032:        <span class="card-badge neutral">${escapeHtml(String(queue.length))} items</span>
1034:      <div class="publishing-overview-grid">
1035:        <div class="publishing-overview-item"><span>Scheduled items</span><strong>${escapeHtml(String(counts.scheduled))}</strong></div>
1036:        <div class="publishing-overview-item"><span>Ready for manual review</span><strong>${escapeHtml(String(counts.ready))}</strong></div>
1037:        <div class="publishing-overview-item"><span>Draft items</span><strong>${escapeHtml(String(counts.draft))}</strong></div>
1038:        <div class="publishing-overview-item"><span>Failed / blocked items</span><strong>${escapeHtml(String(counts.failed))}</strong></div>
1039:        <div class="publishing-overview-item is-wide"><span>Next publish window</span><strong>${escapeHtml(getNextPublishWindow(queue))}</strong></div>
1047:    ["Manual publishing readiness", counts.ready + counts.scheduled > 0 ? "Active" : "Needs queue"],
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
1089:        ${getAutoModeState().status === "waiting_approval" ? `
1090:          <div class="simple-banner publishing-inline-gap"><strong>Approval needed:</strong> ${escapeHtml(asObject(getAutoModeState().approvalRequiredStep).reason || "Manual approval required.")}</div>
1091:          <div class="publishing-action-row publishing-inline-gap">
1092:            <button id="publishingAutoApproveBtn" class="btn btn-secondary" type="button">Approve automation step</button>
1093:            <button id="publishingAutoSkipBtn" class="btn btn-secondary" type="button">Skip automation step</button>
1097:      <div class="simple-banner">Opens AI with this context only. <strong>No approval, publishing, or backend execution is performed.</strong></div>
1102:function renderFilterRow(filter, queue, escapeHtml) {
1103:  const counts = getStatusCounts(queue);
1107:    <div class="publishing-filter-row">
1110:        const count = status === "all" ? queue.length : counts[status];
1112:          <button class="publishing-filter-chip${active ? " is-active" : ""}" type="button" data-publishing-filter="${escapeHtml(status)}">
1122:function renderQueue(queue, visibleQueue, selectedId, filter, escapeHtml) {
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
1151:      ${renderFilterRow(filter, queue, escapeHtml)}
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
1234:                <option value="${escapeHtml(status)}"${status === session.form.approvalStatus ? " selected" : ""}>${escapeHtml(titleCase(status))}</option>
1237:            ${fieldError(session, "approvalStatus", escapeHtml)}
1243:            <label class="setup-label" for="publishingTitleInput">Queue title</label>
1246:          <input id="publishingTitleInput" name="title" class="setup-input" type="text" value="${escapeHtml(session.form.title)}" placeholder="Operator-facing title">
1251:            <label class="setup-label" for="publishingNotesInput">Execution notes</label>
1254:          <textarea id="publishingNotesInput" name="notes" class="setup-input setup-textarea" rows="4" placeholder="Approval notes, blockers, manual steps, content references">${escapeHtml(session.form.notes)}</textarea>
1257:      <div class="publishing-form-actions">
1258:        <button id="publishingNewItemBtn" class="btn btn-secondary" type="button">New Draft</button>
1259:        <button id="publishingBuilderSaveBtn" class="btn btn-secondary" type="button">Save publishing draft</button>
1260:        <button id="publishingScheduleBtn" class="btn btn-primary" type="button">Queue for Manual Publishing</button>
1270:      <section class="card publishing-card">
1286:    <section class="card publishing-card" id="publishingHandoffPanel">
1291:          <p class="publishing-section-copy">${escapeHtml(summarizeText(summary.summary, "Workflow output is available for draft loading."))}</p>
1301:      <div class="publishing-action-row">
1302:        <button id="publishingLoadHandoffBtn" class="btn btn-secondary" type="button">Load Workflow Output</button>
1308:function renderCalendar(queue, escapeHtml) {
1310:  const scheduled = queue.filter((item) => item.scheduledFor);
1316:      <section class="card publishing-card">
1324:        <div class="empty-box">Scheduled publishing items will appear here once timing exists in the queue.</div>
1332:      <div class="publishing-calendar-list">
1334:          <button class="publishing-calendar-row" type="button" data-publishing-select="${escapeHtml(item.id)}">
1346:      <div class="publishing-calendar-list publishing-block-gap">
1347:        <div class="simple-banner publishing-block-gap publishing-past-schedule-warning">Past scheduled items — reschedule required</div>
1349:          <button class="publishing-calendar-row" type="button" data-publishing-select="${escapeHtml(item.id)}">
1361:    <section class="card publishing-card">
1374:function renderExecutionResult(queue, escapeHtml) {
1375:  const latest = queue
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
1463:  publishPublishingItem,
1466:  queue,
1482:    return getSelectedItem(queue, session.selectedId);
1517:  Array.from(document.querySelectorAll("[data-publishing-filter]")).forEach((button) => {
1519:      session.filter = button.getAttribute("data-publishing-filter") || "all";
1524:  Array.from(document.querySelectorAll("[data-publishing-select]")).forEach((button) => {
1526:      const itemId = button.getAttribute("data-publishing-select") || "";
1528:      syncFormFromItem(session, getSelectedItem(queue, itemId));
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
1631:  Array.from(document.querySelectorAll("[data-publishing-action]")).forEach((button) => {
1633:      const itemId = button.getAttribute("data-publishing-id") || "";
1634:      const action = button.getAttribute("data-publishing-action") || "";
1635:      const item = getSelectedItem(queue, itemId);
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
1696:          { projectName, reloadProjectData, showMessage, showError, successMessage: "Publishing item paused as a draft.\n\nConfirmation required before execution. Backend approval rules apply." }
1699:      if (action === "retry") {
1700:        if (guardPublishingAssetBlockers(session, assetBlockers, showMessage, "retrying or rescheduling")) {
1706:          "Confirm retry\n\nAction: Retry this backend publishing item in the scheduled queue.\n\nThis updates the backend publishing schedule/lifecycle state and remains governed by approval rules.\n\nSelect Cancel to keep the item unchanged."
1715:          { projectName, reloadProjectData, showMessage, showError, successMessage: "Publishing item retried in the scheduled queue.\n\nConfirmation required before execution. Backend approval rules apply." }
1722:  const approveBtn = $("publishingApproveBtn");
1727:        session.validation.contentItem = "Select or save a publishing draft before approval.";
1731:      session.form.approvalStatus = "approved";
1733:        updateLocalDraft(projectName, current.id, { ...buildLocalDraftPayload(session, "ready"), id: current.id, approvalStatus: "approved" });
1734:        showMessage?.("Local publishing draft approved.");
1740:        "Confirm publishing readiness\n\nAction: Mark this backend publishing item ready for manual publishing review.\n\nThis does not replace Governance approval or external provider readiness proof.\n\nSelect Cancel to keep the item unchanged."
1755:  const failBtn = $("publishingFailBtn");
1760:        session.validation.contentItem = "Select a publishing item before marking it failed.";
1765:        updateLocalDraft(projectName, current.id, { ...buildLocalDraftPayload(session, "failed"), id: current.id });
1766:        showMessage?.("Local publishing draft marked failed.");
1771:      const confirmed = window.confirm("Confirm fail action\n\nAction: Mark this publishing item as failed.\nRisk: This creates a permanent failure record and stops the publishing lifecycle for this item.\nPolicy: Use only when this item cannot proceed and requires explicit failure logging.\n\nSelect Cancel to keep this item in its current state.");
1779:        { projectName, reloadProjectData, showMessage, showError, successMessage: "Publishing item marked as failed." }
1785:  const loadHandoffBtn = $("publishingLoadHandoffBtn");
1803:      saveDraftLocally("Workflow output loaded into a local publishing draft.");
1808:  const pushAiBtn = $("publishingPushAiBtn");
1824:        source_page: "publishing",
1827:          entity_type: "publishing_job",
1832:          publishing_item_id: current?.jobId || session.formSourceId || "",
1833:          publishing_title: current?.title || session.form.title || "",
1849:  const autoPrepareBtn = $("publishingAutoPrepareBtn");
1854:        publishingAutomationState.progress = "";
1855:        publishingAutomationState.result = "No safe publishing preparation steps available.";
1860:      publishingAutomationState.result = "";
1861:      publishingAutomationState.progress = `Step 0 / ${plan.length}`;
1862:      publishingAutomationEnabled = true;
1867:        mode: "auto_until_approval",
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
1933:    publishPublishingItem,
1939:    const queue = buildQueue(state, projectName);
1942:    const channels = buildChannels(state, queue);
1945:    const root = $("publishingRoot");
1949:    if (!session.selectedId && queue.length && !session.isCreatingNew) {
1950:      session.selectedId = queue[0].id;
1951:      syncFormFromItem(session, queue[0]);
1954:    const selectedItem = getSelectedItem(queue, session.selectedId);
1960:    const visibleQueue = getVisibleQueue(queue, session.filter);
1961:    const counts = getStatusCounts(queue);
1962:    const publishingAssets = filterAssetCategories(getAssetData(state), PUBLISHING_ASSET_KEYS);
1963:    const assetBlockers = publishingAssets.filter((item) => ["Missing", "Needs Review"].includes(item.status));
1964:    const recommendation = buildRecommendation({ queue, counts, assetBlockers, checks, handoff, globalBlockers });
1969:      ${renderPublishingCommandHeader({ projectName, recommendation, selectedItem, summary: null, queue, blockers: assetBlockers, escapeHtml })}
1970:      ${renderPublishingWorkflowStrip({ selectedItem, recommendation, blockers: assetBlockers, approvalState: selectedItem?.approvalStatus, escapeHtml })}
1971:      ${renderPublishingReadinessSummary({ selectedItem, recommendation, blockers: assetBlockers, assetData: publishingAssets, escapeHtml })}
1972:      <div class="publishing-execution-center">
1973:        ${renderOverview(counts, queue, escapeHtml)}
1976:        <div class="publishing-execution-grid">
1977:          <div class="publishing-main-column">
1978:            ${renderQueue(queue, visibleQueue, session.selectedId, session.filter, escapeHtml)}
1980:            <section class="card publishing-card">
1984:                  <h3>${escapeHtml(safeText(selectedItem?.title, "Selected publishing item"))}</h3>
1988:              <div class="publishing-action-row">
1989:                <button id="publishingApproveBtn" class="btn btn-secondary" type="button" title="Prepare publishing readiness review. Confirmation required. Backend approval rules apply.">Mark ready for manual review</button>
1990:                <button id="publishingFailBtn" class="btn btn-secondary" type="button" title="Request Approval Review or mark as failed. Confirmation required before execution.">Mark publishing item as failed</button>
1995:          <aside class="publishing-side-column">
1997:            ${renderCalendar(queue, escapeHtml)}
1998:            ${renderExecutionResult(queue, escapeHtml)}
2015:      publishPublishingItem,
2017:      render: () => publishingRoute.render({
2029:        publishPublishingItem,
2032:      queue,

## Task/Queue/Job notification-adjacent markers
5:const notificationSessions = new Map();
44:  if (["critical", "failed", "blocked", "overdue"].includes(normalized)) return "danger";
89:    item?.notification_id ||
197:        prompt: `Identify overdue task risk for ${projectLabel}. Rank the most critical overdue items and explain likely downstream execution impact if unresolved.`
227:        prompt: `Review Job Monitor for ${projectLabel}. Prioritize failures, retry risk, and health issues, then explain what should be inspected first.`
237:        prompt: `Summarize current execution health for ${projectLabel} across workflows, media, and publishing jobs. Highlight failure clusters, retry patterns, and risk areas.`
244:      label: "Rank alert urgency",
245:      preview: "Sort current notifications by severity and action urgency.",
246:      prompt: `Review Notification Center for ${projectLabel}. Rank current alerts by urgency, explain what matters most, and identify what should be handled first.`
249:      label: "Review selected alert",
250:      preview: "Explain what the selected alert means and where to go next.",
255:      preview: "Turn the current notification stream into a short operations summary.",
256:      prompt: `Summarize the current operational notification signal for ${projectLabel} with focus on ${focusLabel}. Highlight approvals, provider health, publishing events, and urgent follow-up.`
272:  const notificationCenter = asObject(ops.notification_center);
276:  const failedJobs = Number(jobMonitor.failed_count || 0);
278:  const criticalAlerts = Number(notificationCenter.critical_count || 0);
279:  const unreadNotifications = Number(notificationCenter.unread_count || 0);
281:  const providerAlerts = asArray(notificationCenter.provider_disconnect_alerts).length;
282:  const approvalAlerts = asArray(notificationCenter.approval_pending_alerts).length;
283:  const publishAlerts = asArray(notificationCenter.publish_alerts).length;
284:  const claimAlerts = asArray(notificationCenter.claim_risk_alerts).length;
286:  const runtimeTone = failedJobs || criticalAlerts ? "danger" : runningJobs || queueItems || activeTasks ? "warning" : "success";
287:  const runtimeLabel = failedJobs || criticalAlerts
297:      helper: failedJobs || criticalAlerts ? "Failures or critical alerts detected" : "No critical runtime issue detected",
310:      value: formatCount(failedJobs),
312:      tone: failedJobs ? "danger" : "success",
317:      value: formatCount(criticalAlerts),
318:      helper: "Highest priority notifications",
319:      tone: criticalAlerts ? "danger" : "success",
320:      route: "notification-center"
324:      value: formatCount(approvalAlerts),
325:      helper: "Pending approval signals",
326:      tone: approvalAlerts ? "warning" : "success",
327:      route: "notification-center"
332:      helper: "Publishing alerts",
339:      helper: "Disconnected provider alerts",
352:      value: formatCount(unreadNotifications),
353:      helper: "Unread operational notifications",
354:      tone: unreadNotifications ? "warning" : "success",
355:      route: "notification-center"
662:                  <p>Context-only guidance: opens AI with prompt/context only. No task creation, owner assignment, status change, approval, publishing, or backend execution is performed.</p>
896:            <p class="std-context-description">Review workflow, content, media, approval, publishing, and sync queue pressure for ${escapeHtml(projectLabel)}.</p>
987:                  <p>Active actions are refresh, route, and AI guidance only. Queue, publishing, approval, and removal mutations remain disabled until backend policy and mutation safety checks are approved.</p>
1015:                  <p>Context-only guidance: opens AI with prompt/context only. No approve, publish, retry, remove, Governance bypass, or backend execution is performed.</p>
1170:          <td>${escapeHtml(formatCount(item.retry_count))}</td>
1187:            <p class="std-context-description">Review running, completed, and failed job state across workflows, media, and publishing for ${escapeHtml(projectLabel)} without triggering workers.</p>
1192:              <span class="std-context-chip is-danger"><span>Failed</span><strong>${escapeHtml(formatCount(jobMonitor.failed_count))}</strong></span>
1214:                <p>Filter by job status and kind to review active and failed work without changing lifecycle state.</p>
1222:              { value: "failed", label: "Failed", count: formatCount(jobMonitor.failed_count) },
1251:                  <p>${escapeHtml(selectedItem ? "Inspect owner, execution health, retry state, and route context before routing." : "Choose a job from the table to inspect details.")}</p>
1263:                    { label: "Retries", value: formatCount(selectedItem.retry_count) },
1277:                  <p>Active actions are refresh, route, and AI guidance only. Job retry, cancel, rerun, delete, worker execution, publishing, and approval mutations remain disabled or destination-owned.</p>
1310:                  <p>Context-only guidance: opens AI with prompt/context only. No retry, cancel, rerun, delete, worker trigger, approve, publish, Governance bypass, or backend execution is performed.</p>
1437:  const notificationCenter = asObject(asObject(state.data.operations).notification_center);
1438:  const session = ensureSession(notificationSessions, projectName, {
1447:  const providerDisconnectAlerts = deriveProviderDisconnectAlerts(state, notificationCenter.provider_disconnect_alerts);
1448:  const inboxItems = asArray(notificationCenter.notification_items).map((item) => ({
1453:    notification_id: asString(item.id),
1457:  const syncAlerts = asArray(notificationCenter.sync_failure_alerts).map((item) => ({ ...item, item_type: "sync" }));
1458:  const approvalAlerts = asArray(notificationCenter.approval_pending_alerts).map((item) => ({ ...item, item_type: "approval" }));
1459:  const publishAlerts = asArray(notificationCenter.publish_alerts).map((item) => ({ ...item, item_type: "publish" }));
1461:  const claimAlerts = asArray(notificationCenter.claim_risk_alerts).map((item) => ({ ...item, item_type: "claim" }));
1462:  const workflowAlerts = asArray(notificationCenter.workflow_completion_alerts).map((item) => ({ ...item, item_type: "workflow" }));
1465:    ...approvalAlerts,
1472:    _opsKey: getOpsItemKey(item, index, "alert")
1481:  if (session.focus === "critical") listItems = baseAlerts.filter((item) => asString(item.severity) === "critical");
1482:  if (session.focus === "approvals") listItems = approvalAlerts.map((item, index) => ({ ...item, _opsKey: getOpsItemKey(item, index, "approval") }));
1489:  const prompts = buildOpsAssistantPrompts("notification-center", projectName, selectedItem, titleCase(session.focus || "all"));
1499:    ? "No notifications match the current filters."
1500:    : "No notifications are available for this project yet. Use Refresh or adjust project context to load current signals.";
1508:          <div class="error-state ops-notification-state" aria-live="assertive">
1534:    <section class="page is-active" data-page="notification-center">
1542:            <p class="std-context-description">Route-aware operational alerts for approvals, sync issues, publishing, claim risk, provider health, and workflow completion for ${escapeHtml(projectLabel)}.</p>
1545:              <span class="std-context-chip"><span>Unread Inbox</span><strong>${escapeHtml(formatCount(notificationCenter.unread_count))}</strong></span>
1546:              <span class="std-context-chip is-danger"><span>Critical</span><strong>${escapeHtml(formatCount(notificationCenter.critical_count))}</strong></span>
1547:              <span class="std-context-chip is-warning"><span>Approvals</span><strong>${escapeHtml(formatCount(approvalAlerts.length))}</strong></span>
1552:            <button class="btn btn-secondary std-context-btn" type="button" id="notificationCenterRefreshBtnHeader">Refresh</button>
1568:                <h3>${escapeHtml(session.focus === "inbox" ? "Notification history" : "Operational alerts")}</h3>
1569:                <p>${escapeHtml(session.focus === "inbox" ? "Review durable inbox history and mark notifications as read where supported." : "Review route-aware alerts, then inspect the selected signal in detail.")}</p>
1576:              { value: "critical", label: "Critical", count: formatCount(notificationCenter.critical_count) },
1577:              { value: "approvals", label: "Approvals", count: formatCount(approvalAlerts.length) },
1583:              <input id="notificationCenterSearch" class="command-input" type="text" placeholder="Search alerts, sources, messages..." value="${escapeHtml(session.search)}">
1584:              <select id="notificationCenterSeverity" class="sidebar-select">
1585:                ${["all", "critical", "warning", "success", "info"].map((value) => `<option value="${escapeHtml(value)}"${value === session.severity ? " selected" : ""}>${escapeHtml(titleCase(value))}</option>`).join("")}
1590:              <div class="error-state ops-notification-state" aria-live="assertive"><strong>Notification Center error</strong><span>${escapeHtml(session.errorMessage)}</span></div>
1606:                  <h3>${escapeHtml(selectedItem?.title || "Select a notification")}</h3>
1607:                  <p>${escapeHtml(selectedItem ? "Review source, severity, timing, and owning route before follow-up." : "Choose an alert or inbox item to inspect details.")}</p>
1614:                    <p>${escapeHtml(selectedItem.message || selectedItem.body || "No notification detail available.")}</p>
1623:              ` : `<div class="empty-box">No notification is selected.</div>`}
1635:                <button class="btn btn-primary" type="button" id="notificationCenterRefreshBtn">Refresh Notification Center</button>
1637:                ${selectedItem?.notification_id ? `<button class="btn btn-secondary" type="button" data-mark-read="${escapeHtml(selectedItem.notification_id)}">Mark Read</button>` : ""}
1642:                  <span>${escapeHtml(`${formatCount(approvalAlerts.length)} alerts`)}</span>
1646:                  <span>${escapeHtml(`${formatCount(providerAlerts.length)} alerts`)}</span>
1650:                  <span>${escapeHtml(`${formatCount(claimAlerts.length)} alerts`)}</span>
1654:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Acknowledge notification (deferred: mutation safety pass)</button>
1655:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Resolve notification (deferred: mutation safety pass)</button>
1656:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Dismiss notification (deferred: mutation safety pass)</button>
1657:                <button class="btn btn-ghost ops-deferred-action" type="button" disabled>Delete notification (deferred: mutation safety pass)</button>
1666:                  <p>Context-only handoff: opens AI with prompt/context only. No approval, publishing, or backend execution is performed.</p>
1698:          ops.notification_center = liveData;
1712:  root.querySelector("#notificationCenterRefreshBtn")?.addEventListener("click", refreshNotificationCenter);
1713:  root.querySelector("#notificationCenterRefreshBtnHeader")?.addEventListener("click", refreshNotificationCenter);
1722:  root.querySelector("#notificationCenterSearch")?.addEventListener("input", (event) => {
1726:  root.querySelector("#notificationCenterSeverity")?.addEventListener("change", (event) => {
1732:      const notificationId = button.getAttribute("data-mark-read") || "";
1733:      if (!notificationId || !context.markProjectNotification) return;
1735:        await context.markProjectNotification(projectName, notificationId, { status: "read", read: true });
1739:        context.showError?.(error.message || "Failed to update notification.");
1788:    description: "Review queue pressure and route workflow, content, media, approval, publishing, and sync items to owning workspaces without silent mutation."
1836:    description: "Review job health, failures, retry risk, and execution logs across workflows, media, and publishing without silent job mutation."
1878:export const notificationCenterRoute = {
1879:  id: "notification-center",
1884:    description: "Review sync failures, pending approvals, publish events, provider disconnects, claim risks, and workflow completion alerts."
1886:  template: `<section class="page is-active" data-page="notification-center"><div class="ops-shell"></div></section>`,
1895:      const session = ensureSession(notificationSessions, projectName, {
1911:          ops.notification_center = liveData;
1937:  const notificationCount = asArray(operations.notifications?.items || operations.notifications).length;
1965:      route: "notification-center",
1968:      count: notificationCount,
1969:      description: "Review notifications, warnings, approvals, and attention signals.",
1981:            <p class="std-context-description">A unified entry point for execution, queues, runtime jobs, and operational notifications for ${context.escapeHtml(projectName)}.</p>
1987:            <span class="std-context-chip"><span>Signals</span><strong>${context.escapeHtml(formatCount(notificationCount))}</strong></span>
2047:                  <p>This overview does not execute jobs, mutate tasks, send notifications, or approve workflows. It only routes to the owning workspace.</p>

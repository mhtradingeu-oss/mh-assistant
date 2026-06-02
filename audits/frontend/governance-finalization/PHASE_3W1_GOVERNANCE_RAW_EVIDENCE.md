# PHASE 3W.1 — Governance Raw Evidence

## Governance JS size
    1489 public/control-center/pages/governance.js

## Imports / exports / handlers
77:function renderGovernanceEvidenceSummary({ selectedItem, projectData, governanceData, intakeContext, escapeHtml }) {
115:function renderGovernanceIntakePanel({ projectName, escapeHtml, intakeContext }) {
137:import {
267:async function loadGovernance(projectName, session, rerender) {
287:async function refreshGovernance(projectName, session, rerender, showError) {
295:function renderMetric(label, value, helper, escapeHtml) {
305:function renderReviewOwnership(summary, escapeHtml) {
338:function renderFlagList(flags, emptyText, escapeHtml) {
355:function renderApprovalCard(item, escapeHtml) {
404:function renderReviewCard(item, type, escapeHtml, approval) {
450:function renderTimeline(items, escapeHtml) {
471:function renderPolicyControls(summary, settingsDraft, escapeHtml) {
729:function renderPage(projectName, session, escapeHtml) {
1300:function bindGovernance(context, projectName, session) {
1310:    button.onclick = async () => {
1337:    button.onclick = () => {
1344:    button.onclick = () => {
1351:    button.onclick = async () => {
1376:    button.onclick = async () => {
1441:    button.onclick = () => {
1450:    button.onclick = () => {
1460:export const governanceRoute = {

## Governance approval / policy markers
public/control-center/pages/governance.js:7:function collectGovernanceEvidence({ selectedItem, projectData, governanceData }) {
public/control-center/pages/governance.js:8:  // Defensive extraction of evidence assets
public/control-center/pages/governance.js:9:  const evidence = {
public/control-center/pages/governance.js:14:    proof: [],
public/control-center/pages/governance.js:23:  const sources = [selectedItem, projectData, governanceData];
public/control-center/pages/governance.js:28:      if (/source_of_truth|source/.test(key)) evidence.source_of_truth.push(v);
public/control-center/pages/governance.js:29:      else if (/legal/.test(key)) evidence.legal.push(v);
public/control-center/pages/governance.js:30:      else if (/pricing/.test(key)) evidence.pricing.push(v);
public/control-center/pages/governance.js:31:      else if (/certificate|certificates/.test(key)) evidence.certificate.push(v);
public/control-center/pages/governance.js:32:      else if (/proof/.test(key)) evidence.proof.push(v);
public/control-center/pages/governance.js:33:      else if (/product/.test(key)) evidence.product.push(v);
public/control-center/pages/governance.js:34:      else if (/brand/.test(key)) evidence.brand.push(v);
public/control-center/pages/governance.js:35:      else if (/claim/.test(key)) evidence.claim.push(v);
public/control-center/pages/governance.js:36:      else if (/media/.test(key)) evidence.media.push(v);
public/control-center/pages/governance.js:37:      else if (/content/.test(key)) evidence.content.push(v);
public/control-center/pages/governance.js:38:      else if (/library/.test(key)) evidence.library.push(v);
public/control-center/pages/governance.js:39:      else evidence.other.push(v);
public/control-center/pages/governance.js:43:  Object.keys(evidence).forEach((k) => {
public/control-center/pages/governance.js:44:    evidence[k] = asSafeArray(evidence[k]).flat().filter(Boolean);
public/control-center/pages/governance.js:46:  return evidence;
public/control-center/pages/governance.js:56:  if (s.includes("proof")) return "proof";
public/control-center/pages/governance.js:66:function summarizeEvidenceState(evidence) {
public/control-center/pages/governance.js:67:  // Returns true if any key evidence is present
public/control-center/pages/governance.js:69:    evidence.source_of_truth.length ||
public/control-center/pages/governance.js:70:    evidence.legal.length ||
public/control-center/pages/governance.js:71:    evidence.pricing.length ||
public/control-center/pages/governance.js:72:    evidence.certificate.length ||
public/control-center/pages/governance.js:73:    evidence.proof.length
public/control-center/pages/governance.js:77:function renderGovernanceEvidenceSummary({ selectedItem, projectData, governanceData, intakeContext, escapeHtml }) {
public/control-center/pages/governance.js:78:  const evidence = collectGovernanceEvidence({ selectedItem, projectData, governanceData });
public/control-center/pages/governance.js:79:  const hasEvidence = summarizeEvidenceState(evidence);
public/control-center/pages/governance.js:81:    <div class="governance-evidence-summary">
public/control-center/pages/governance.js:82:      <div class="governance-evidence-summary-header">Evidence Summary</div>
public/control-center/pages/governance.js:83:      <div class="governance-evidence-cards">
public/control-center/pages/governance.js:84:        <div class="governance-evidence-card${evidence.source_of_truth.length ? '' : ' is-missing'}">
public/control-center/pages/governance.js:85:          <span class="governance-evidence-label">Source of Truth</span>
public/control-center/pages/governance.js:86:          <span class="governance-evidence-value">${evidence.source_of_truth.length ? escapeHtml(asString(evidence.source_of_truth[0])) : "Missing"}</span>
public/control-center/pages/governance.js:88:        <div class="governance-evidence-card${evidence.legal.length ? '' : ' is-missing'}">
public/control-center/pages/governance.js:89:          <span class="governance-evidence-label">Legal</span>
public/control-center/pages/governance.js:90:          <span class="governance-evidence-value">${evidence.legal.length ? escapeHtml(asString(evidence.legal[0])) : "Missing"}</span>
public/control-center/pages/governance.js:92:        <div class="governance-evidence-card${evidence.pricing.length ? '' : ' is-missing'}">
public/control-center/pages/governance.js:93:          <span class="governance-evidence-label">Pricing</span>
public/control-center/pages/governance.js:94:          <span class="governance-evidence-value">${evidence.pricing.length ? escapeHtml(asString(evidence.pricing[0])) : "Missing"}</span>
public/control-center/pages/governance.js:96:        <div class="governance-evidence-card${evidence.certificate.length ? '' : ' is-missing'}">
public/control-center/pages/governance.js:97:          <span class="governance-evidence-label">Certificate/Proof</span>
public/control-center/pages/governance.js:98:          <span class="governance-evidence-value">${evidence.certificate.length ? escapeHtml(asString(evidence.certificate[0])) : evidence.proof.length ? escapeHtml(asString(evidence.proof[0])) : "Missing"}</span>
public/control-center/pages/governance.js:100:        <div class="governance-evidence-card${evidence.brand.length ? '' : ' is-missing'}">
public/control-center/pages/governance.js:101:          <span class="governance-evidence-label">Brand Asset</span>
public/control-center/pages/governance.js:102:          <span class="governance-evidence-value">${evidence.brand.length ? escapeHtml(asString(evidence.brand[0])) : "Missing"}</span>
public/control-center/pages/governance.js:104:        <div class="governance-evidence-card${evidence.product.length ? '' : ' is-missing'}">
public/control-center/pages/governance.js:105:          <span class="governance-evidence-label">Product Asset</span>
public/control-center/pages/governance.js:106:          <span class="governance-evidence-value">${evidence.product.length ? escapeHtml(asString(evidence.product[0])) : "Missing"}</span>
public/control-center/pages/governance.js:109:      ${!hasEvidence ? `<div class="governance-evidence-card is-missing governance-source-warning">Missing source evidence — attach Library proof before high-risk approval.</div>` : ""}
public/control-center/pages/governance.js:110:      <div class="governance-evidence-guidance">High-risk governance decisions should reference source-of-truth evidence, proof assets, or an incoming handoff. Missing evidence should be resolved before approval or override.</div>
public/control-center/pages/governance.js:116:  // Intake context: { ai, publishing, content, media, workflows, operations, notifications, insights }
public/control-center/pages/governance.js:119:  if (intakeContext?.publishing) items.push({ label: "Publishing", value: asString(intakeContext.publishing) });
public/control-center/pages/governance.js:127:    <div class="governance-intake-panel">
public/control-center/pages/governance.js:128:      <div class="governance-intake-panel-header">Incoming Review Context</div>
public/control-center/pages/governance.js:129:      <div class="governance-intake-list">
public/control-center/pages/governance.js:131:          <div class="governance-intake-item"><span class="governance-intake-label">${escapeHtml(item.label)}</span><span class="governance-intake-value">${escapeHtml(item.value)}</span></div>
public/control-center/pages/governance.js:132:        `).join("") : `<div class="governance-intake-item is-missing">No intake yet</div>`}
public/control-center/pages/governance.js:144:const governanceSessions = new Map();
public/control-center/pages/governance.js:180:  if (normalized === "approved" || normalized === "success") return "success";
public/control-center/pages/governance.js:184:function getDecisionConfirmationMessage(decision) {
public/control-center/pages/governance.js:185:  const normalized = asString(decision).toLowerCase().replace(/\s+/g, "_");
public/control-center/pages/governance.js:187:  if (["approval", "approved", "approve"].includes(normalized)) {
public/control-center/pages/governance.js:188:    return "Submit Approval Decision? This records a governance decision and may affect downstream readiness. It does not publish or execute directly.";
public/control-center/pages/governance.js:192:    return "Record Override Decision? This is a high-risk governance action. Backend authority rules remain active, but this can unblock downstream operations. Continue only after verifying source, risk, and owner.";
public/control-center/pages/governance.js:195:  if (["reject", "rejected", "changes_requested", "request_changes", "escalated", "escalate"].includes(normalized)) {
public/control-center/pages/governance.js:196:    return "Submit Governance Decision? This records the reviewed decision and may update linked queues or review state.";
public/control-center/pages/governance.js:199:  return "Submit Governance Decision? This records the reviewed decision and may update linked queues or review state.";
public/control-center/pages/governance.js:202:function confirmGovernanceDecision(decision) {
public/control-center/pages/governance.js:203:  if (typeof window === "undefined" || typeof window.confirm !== "function") return true;
public/control-center/pages/governance.js:204:  return window.confirm(getDecisionConfirmationMessage(decision));
public/control-center/pages/governance.js:209:  if (!governanceSessions.has(key)) {
public/control-center/pages/governance.js:210:    governanceSessions.set(key, {
public/control-center/pages/governance.js:219:  return governanceSessions.get(key);
public/control-center/pages/governance.js:223:  return asObject(asObject(summary?.policy).settings_bridge?.form);
public/control-center/pages/governance.js:227:  const approval = asObject(settings.approval);
public/control-center/pages/governance.js:228:  const publishing = asObject(settings.publishing);
public/control-center/pages/governance.js:234:    policy_rules: {
public/control-center/pages/governance.js:235:      approval_before_publish: Boolean(publishing.approvalBeforePublish),
public/control-center/pages/governance.js:240:      freeze_publishing: false
public/control-center/pages/governance.js:242:    approval_owners: {
public/control-center/pages/governance.js:243:      content: asString(approval.contentOwner) || "Marketing lead",
public/control-center/pages/governance.js:244:      media: asString(approval.mediaOwner) || "Creative lead",
public/control-center/pages/governance.js:245:      campaign: asString(approval.adsOwner) || "Operations lead",
public/control-center/pages/governance.js:246:      publishing: asString(settings.team?.publishAccess) || "Publisher",
public/control-center/pages/governance.js:247:      compliance: "Compliance Reviewer",
public/control-center/pages/governance.js:253:      approval_mode: asString(ai.approvalRequiredMode) || "Only high-risk",
public/control-center/pages/governance.js:254:      claim_safety_mode: asString(ai.claimSafetyMode) || "Strict evidence required",
public/control-center/pages/governance.js:255:      approval_before_publish: Boolean(publishing.approvalBeforePublish)
public/control-center/pages/governance.js:261:  return asArray(summary?.sections?.approval_queue).find((item) =>
public/control-center/pages/governance.js:280:    session.error = error.message || "Failed to load governance console.";
public/control-center/pages/governance.js:297:    <div class="governance-metric">
public/control-center/pages/governance.js:313:      <div class="governance-card-list">
public/control-center/pages/governance.js:315:          <div class="governance-card">
public/control-center/pages/governance.js:316:            <div class="governance-card-head">
public/control-center/pages/governance.js:344:    <div class="governance-flag-list">
public/control-center/pages/governance.js:346:        <div class="governance-flag">
public/control-center/pages/governance.js:357:    ...asArray(item.policy_flags),
public/control-center/pages/governance.js:360:    ...asArray(item.publish_guardrails)
public/control-center/pages/governance.js:366:    <article class="governance-card">
public/control-center/pages/governance.js:367:      <div class="governance-card-head">
public/control-center/pages/governance.js:369:          <div class="panel-kicker">${escapeHtml(titleCase(item.entity_type || "approval"))}</div>
public/control-center/pages/governance.js:374:      <div class="governance-meta">
public/control-center/pages/governance.js:380:      <p class="governance-copy">${escapeHtml(item.summary || "Awaiting review and decision.")}</p>
public/control-center/pages/governance.js:381:      ${renderFlagList(flags, "No extra policy flags were attached to this approval.", escapeHtml)}
public/control-center/pages/governance.js:382:      <textarea id="${escapeHtml(noteId)}" class="setup-input setup-textarea governance-note" rows="3" placeholder="Add a decision reason, change request, or escalation note.">${escapeHtml(item.decision_note || "")}</textarea>
public/control-center/pages/governance.js:383:      <div class="governance-actions">
public/control-center/pages/governance.js:384:        <button class="btn btn-primary" type="button" data-governance-decision="approved" data-approval-id="${escapeHtml(item.id)}">Submit Approval Decision</button>
public/control-center/pages/governance.js:385:        <button class="btn btn-secondary" type="button" data-governance-decision="rejected" data-approval-id="${escapeHtml(item.id)}">Submit Rejection Decision</button>
public/control-center/pages/governance.js:386:        <button class="btn btn-secondary" type="button" data-governance-decision="changes_requested" data-approval-id="${escapeHtml(item.id)}">Request Changes Review</button>
public/control-center/pages/governance.js:387:        <button class="btn btn-secondary" type="button" data-governance-decision="escalated" data-approval-id="${escapeHtml(item.id)}">Escalate Review</button>
public/control-center/pages/governance.js:388:        <button class="btn btn-secondary" type="button" data-governance-decision="overridden" data-approval-id="${escapeHtml(item.id)}">Record Override Decision</button>
public/control-center/pages/governance.js:391:        <div class="governance-history">
public/control-center/pages/governance.js:393:            <div class="governance-history-item">
public/control-center/pages/governance.js:404:function renderReviewCard(item, type, escapeHtml, approval) {
public/control-center/pages/governance.js:410:        : asArray(item.publish_guardrails);
public/control-center/pages/governance.js:413:    <article class="governance-card">
public/control-center/pages/governance.js:414:      <div class="governance-card-head">
public/control-center/pages/governance.js:419:        <span class="card-badge ${approval ? "warning" : "neutral"}">${escapeHtml(approval ? "In approval queue" : "Not requested")}</span>
public/control-center/pages/governance.js:421:      <div class="governance-meta">
public/control-center/pages/governance.js:426:      ${approval ? `
public/control-center/pages/governance.js:428:          <strong>Linked approval:</strong> ${escapeHtml(approval.title || approval.id)} • ${escapeHtml(titleCase(approval.status))}
public/control-center/pages/governance.js:431:        <div class="governance-actions">
public/control-center/pages/governance.js:435:            data-governance-request-approval="true"
public/control-center/pages/governance.js:456:    <div class="governance-timeline">
public/control-center/pages/governance.js:458:        <div class="governance-timeline-item">
public/control-center/pages/governance.js:459:          <div class="governance-timeline-dot"></div>
public/control-center/pages/governance.js:460:          <div class="governance-timeline-copy">
public/control-center/pages/governance.js:472:  const policy = asObject(summary?.policy);
public/control-center/pages/governance.js:473:  const rules = asObject(policy.policy_rules);
public/control-center/pages/governance.js:474:  const owners = asObject(policy.approval_owners);
public/control-center/pages/governance.js:477:    <div class="governance-policy-grid">
public/control-center/pages/governance.js:478:      <label class="settings-toggle" for="governance-approval-before-publish">
public/control-center/pages/governance.js:479:        <span class="settings-field-label">Approval before publish</span>
public/control-center/pages/governance.js:480:        <input id="governance-approval-before-publish" type="checkbox" class="settings-toggle-input" data-governance-policy="approval_before_publish" ${rules.approval_before_publish ? "checked" : ""} />
public/control-center/pages/governance.js:483:      <label class="settings-toggle" for="governance-claim-review">
public/control-center/pages/governance.js:485:        <input id="governance-claim-review" type="checkbox" class="settings-toggle-input" data-governance-policy="high_risk_claim_review_required" ${rules.high_risk_claim_review_required ? "checked" : ""} />
public/control-center/pages/governance.js:488:      <label class="settings-toggle" for="governance-brand-safety">
public/control-center/pages/governance.js:490:        <input id="governance-brand-safety" type="checkbox" class="settings-toggle-input" data-governance-policy="brand_safety_review_required" ${rules.brand_safety_review_required ? "checked" : ""} />
public/control-center/pages/governance.js:493:      <label class="settings-toggle" for="governance-auto-escalate">
public/control-center/pages/governance.js:495:        <input id="governance-auto-escalate" type="checkbox" class="settings-toggle-input" data-governance-policy="auto_escalate_critical_risk" ${rules.auto_escalate_critical_risk ? "checked" : ""} />
public/control-center/pages/governance.js:498:      <label class="settings-toggle" for="governance-admin-override">
public/control-center/pages/governance.js:500:        <input id="governance-admin-override" type="checkbox" class="settings-toggle-input" data-governance-policy="allow_admin_override" ${rules.allow_admin_override ? "checked" : ""} />
public/control-center/pages/governance.js:503:      <label class="settings-toggle" for="governance-freeze-publishing">
public/control-center/pages/governance.js:504:        <span class="settings-field-label">Freeze publishing</span>
public/control-center/pages/governance.js:505:        <input id="governance-freeze-publishing" type="checkbox" class="settings-toggle-input" data-governance-policy="freeze_publishing" ${rules.freeze_publishing ? "checked" : ""} />
public/control-center/pages/governance.js:509:        <label class="settings-field-label" for="governance-owner-content">Content owner</label>
public/control-center/pages/governance.js:510:        <input id="governance-owner-content" class="settings-control" type="text" data-governance-owner="content" value="${escapeHtml(owners.content || "")}" />
public/control-center/pages/governance.js:513:        <label class="settings-field-label" for="governance-owner-media">Media owner</label>
public/control-center/pages/governance.js:514:        <input id="governance-owner-media" class="settings-control" type="text" data-governance-owner="media" value="${escapeHtml(owners.media || "")}" />
public/control-center/pages/governance.js:517:        <label class="settings-field-label" for="governance-owner-publishing">Publishing owner</label>
public/control-center/pages/governance.js:518:        <input id="governance-owner-publishing" class="settings-control" type="text" data-governance-owner="publishing" value="${escapeHtml(owners.publishing || "")}" />
public/control-center/pages/governance.js:534:  const approvals = asArray(sections.approval_queue).map((item) => ({
public/control-center/pages/governance.js:536:    queue_kind: "approval",
public/control-center/pages/governance.js:537:    selected_key: `approval:${asString(item.id)}`,
public/control-center/pages/governance.js:539:    queue_summary: item.summary || "Awaiting review and decision.",
public/control-center/pages/governance.js:545:      ...asArray(item.policy_flags),
public/control-center/pages/governance.js:548:      ...asArray(item.publish_guardrails)
public/control-center/pages/governance.js:550:    linked_approval: item
public/control-center/pages/governance.js:554:    const approval = findApprovalForEntity(summary, item.entity_type, item.entity_id);
public/control-center/pages/governance.js:561:      queue_status: approval?.status || item.status || "open",
public/control-center/pages/governance.js:563:      queue_owner: approval?.reviewer || "Compliance Reviewer",
public/control-center/pages/governance.js:564:      queue_created: approval?.created_at || item.updated_at || item.created_at,
public/control-center/pages/governance.js:566:      linked_approval: approval
public/control-center/pages/governance.js:571:    const approval = findApprovalForEntity(summary, item.entity_type, item.entity_id);
public/control-center/pages/governance.js:578:      queue_status: approval?.status || item.status || "open",
public/control-center/pages/governance.js:580:      queue_owner: approval?.reviewer || "Brand Reviewer",
public/control-center/pages/governance.js:581:      queue_created: approval?.created_at || item.updated_at || item.created_at,
public/control-center/pages/governance.js:583:      linked_approval: approval
public/control-center/pages/governance.js:587:  const publish = asArray(sections.publish_guardrails).map((item) => {
public/control-center/pages/governance.js:588:    const approval = findApprovalForEntity(summary, "publishing_job", item.entity_id);
public/control-center/pages/governance.js:591:      queue_kind: "publish",
public/control-center/pages/governance.js:592:      selected_key: `publish:${asString(item.entity_id || item.id)}`,
public/control-center/pages/governance.js:594:      queue_summary: asArray(item.publish_guardrails).map((flag) => flag.message).join(" | ") || "No publish blockers detected.",
public/control-center/pages/governance.js:595:      queue_status: approval?.status || item.status || "open",
public/control-center/pages/governance.js:596:      queue_risk: asArray(item.publish_guardrails)[0]?.severity || "medium",
public/control-center/pages/governance.js:597:      queue_owner: approval?.reviewer || "Publishing Reviewer",
public/control-center/pages/governance.js:598:      queue_created: approval?.created_at || item.updated_at || item.created_at,
public/control-center/pages/governance.js:599:      queue_flags: asArray(item.publish_guardrails),
public/control-center/pages/governance.js:600:      linked_approval: approval
public/control-center/pages/governance.js:617:  return [...approvals, ...claims, ...brand, ...publish, ...escalations];
public/control-center/pages/governance.js:622:  const itemLabel = asString(selectedItem?.queue_title || selectedItem?.title || "the selected governance item");
public/control-center/pages/governance.js:625:      label: "Summarize governance state",
public/control-center/pages/governance.js:626:      preview: "Explain the current approval pressure, risk level, and next governance priority.",
public/control-center/pages/governance.js:627:      prompt: `Summarize the current governance state for ${projectLabel}. Cover policy pressure, pending approvals, risky claims, brand safety issues, publish blockers, and the next governance priority.`
public/control-center/pages/governance.js:630:      label: "Review selected decision",
public/control-center/pages/governance.js:631:      preview: "Explain the selected governance item and what decision path is safest.",
public/control-center/pages/governance.js:632:      prompt: `Review ${itemLabel} in Governance for ${projectLabel}. Explain the risk, what policy is implicated, and what decision path is safest next.`
public/control-center/pages/governance.js:635:      label: "Find governance gaps",
public/control-center/pages/governance.js:636:      preview: "Identify the highest-risk governance gaps and what rules or ownership need tightening.",
public/control-center/pages/governance.js:637:      prompt: `Review Governance for ${projectLabel} with focus on ${focusLabel}. Identify the highest-risk governance gaps, where approval ownership is weak, and what rules need tightening next.`
public/control-center/pages/governance.js:644:  const policy = asObject(summary?.policy);
public/control-center/pages/governance.js:645:  const rules = asObject(policy.policy_rules);
public/control-center/pages/governance.js:646:  const owners = asObject(policy.approval_owners);
public/control-center/pages/governance.js:647:  const approvals = asArray(sections.approval_queue).length;
public/control-center/pages/governance.js:648:  const violations = asArray(sections.policy_violations).length;
public/control-center/pages/governance.js:650:  const publishGuardrails = asArray(sections.publish_guardrails).length;
public/control-center/pages/governance.js:654:  if (rules.freeze_publishing) {
public/control-center/pages/governance.js:655:    blockers.push("Publishing is currently frozen by governance policy.");
public/control-center/pages/governance.js:657:  if (approvals > 0) {
public/control-center/pages/governance.js:658:    blockers.push(`${approvals} approval item${approvals === 1 ? " is" : "s are"} waiting for a decision.`);
public/control-center/pages/governance.js:661:    blockers.push(`${violations} policy violation${violations === 1 ? " requires" : "s require"} operator review.`);
public/control-center/pages/governance.js:668:  if (rules.freeze_publishing || escalations > 0) {
public/control-center/pages/governance.js:674:  let nextBestAction = "Run a governance AI summary, then keep policy owners and rules aligned with live operations.";
public/control-center/pages/governance.js:675:  if (selectedItem?.queue_kind === "approval") {
public/control-center/pages/governance.js:676:    nextBestAction = "Review the selected approval, document decision reasoning, and submit a governance decision.";
public/control-center/pages/governance.js:677:  } else if (approvals > 0) {
public/control-center/pages/governance.js:678:    nextBestAction = "Switch to Approvals focus and clear highest-risk decisions first.";
public/control-center/pages/governance.js:680:    nextBestAction = "Inspect policy violations and request approvals where review is still missing.";
public/control-center/pages/governance.js:681:  } else if (publishGuardrails > 0) {
public/control-center/pages/governance.js:682:    nextBestAction = "Review publish guardrails to ensure release paths remain compliant and safe.";
public/control-center/pages/governance.js:691:    approvals,
public/control-center/pages/governance.js:698:function governanceRiskRank(value) {
public/control-center/pages/governance.js:710:    return governanceRiskRank(item.queue_risk) > governanceRiskRank(highest.queue_risk) ? item : highest;
public/control-center/pages/governance.js:732:      <section class="page is-active" data-page="governance">
public/control-center/pages/governance.js:733:        <div class="governance-shell governance-workspace mhos-clean-root mhos-clean-shell">
public/control-center/pages/governance.js:739:                <p>Governance operating surface for approvals, policy pressure, and decision routing.</p>
public/control-center/pages/governance.js:751:            <div class="empty-box">Select a project to review approvals, policy violations, overrides, and audit history.</div>
public/control-center/pages/governance.js:760:      <section class="page is-active" data-page="governance">
public/control-center/pages/governance.js:761:        <div class="governance-shell governance-workspace mhos-clean-root mhos-clean-shell">
public/control-center/pages/governance.js:767:                <p>Preparing the governance operating surface.</p>
public/control-center/pages/governance.js:779:            <div class="empty-box">Loading governance console...</div>
public/control-center/pages/governance.js:788:      <section class="page is-active" data-page="governance">
public/control-center/pages/governance.js:789:        <div class="governance-shell governance-workspace mhos-clean-root mhos-clean-shell">
public/control-center/pages/governance.js:820:    approvals: queueItems.filter((item) => item.queue_kind === "approval").length,
public/control-center/pages/governance.js:823:    publish: queueItems.filter((item) => item.queue_kind === "publish").length,
public/control-center/pages/governance.js:829:      approvals: "approval",
public/control-center/pages/governance.js:832:      publish: "publish",
public/control-center/pages/governance.js:840:  const policy = asObject(summary.policy);
public/control-center/pages/governance.js:841:  const rules = asObject(policy.policy_rules);
public/control-center/pages/governance.js:842:  const owners = asObject(policy.approval_owners);
public/control-center/pages/governance.js:843:  const settingsBridge = asObject(policy.settings_bridge);
public/control-center/pages/governance.js:856:  const selectedDecisionLabel = asString(executiveFocusItem?.queue_title || "No selected decision");
public/control-center/pages/governance.js:857:  const selectedDecisionKind = titleCase(executiveFocusItem?.queue_kind || "governance");
public/control-center/pages/governance.js:860:    <section class="page is-active" data-page="governance">
public/control-center/pages/governance.js:861:      <div class="governance-shell governance-workspace mhos-clean-root mhos-clean-shell">
public/control-center/pages/governance.js:862:        <section class="panel mhos-executive-surface mhos-context-ribbon governance-operating-header" aria-label="Executive governance command band">
public/control-center/pages/governance.js:863:          <div class="panel-header mhos-context-main governance-operating-header-main">
public/control-center/pages/governance.js:865:              <div class="panel-kicker mhos-context-kicker governance-operating-eyebrow">Governance Operating Surface</div>
public/control-center/pages/governance.js:866:              <h3 class="mhos-context-title governance-operating-title">Governance Command Center for ${escapeHtml(projectName)}</h3>
public/control-center/pages/governance.js:867:              <p class="mhos-context-description governance-operating-desc">Canonical executive surface for policy authority, approval pressure, escalation, and safe decision routing.</p>
public/control-center/pages/governance.js:869:            <span class="card-badge neutral governance-operating-status">${escapeHtml(session.loading ? "Refreshing" : "Active")}</span>
public/control-center/pages/governance.js:872:          <div class="mhos-executive-summary-grid governance-executive-summary-grid" aria-label="Governance executive anchors">
public/control-center/pages/governance.js:873:            <article class="mhos-executive-summary-item governance-summary-readiness">
public/control-center/pages/governance.js:876:              <small class="mhos-executive-metric-note">${escapeHtml(`${readiness.totalQueue} open decision${readiness.totalQueue === 1 ? "" : "s"}`)}</small>
public/control-center/pages/governance.js:878:            <article class="mhos-executive-summary-item governance-summary-approval">
public/control-center/pages/governance.js:880:              <strong class="mhos-executive-metric-value">${escapeHtml(asString(readiness.approvals))}</strong>
public/control-center/pages/governance.js:881:              <small class="mhos-executive-metric-note">${escapeHtml(readiness.approvals ? "Awaiting governed decision" : "No approval queue pressure")}</small>
public/control-center/pages/governance.js:883:            <article class="mhos-executive-summary-item governance-summary-escalation">
public/control-center/pages/governance.js:888:            <article class="mhos-executive-summary-item governance-summary-owner">
public/control-center/pages/governance.js:893:            <article class="mhos-executive-summary-item governance-summary-risk">
public/control-center/pages/governance.js:898:            <article class="mhos-executive-summary-item governance-summary-ai-boundary">
public/control-center/pages/governance.js:900:              <strong class="mhos-executive-metric-value governance-ai-boundary">Prepare / Review / Summarize Only</strong>
public/control-center/pages/governance.js:901:              <small class="mhos-executive-metric-note governance-ai-boundary-note">AI cannot approve. Human approval required.</small>
public/control-center/pages/governance.js:905:          <div class="governance-policy-summary-grid">
public/control-center/pages/governance.js:906:            <div class="governance-policy-block mhos-executive-panel">
public/control-center/pages/governance.js:907:              <h4>Next best governance action</h4>
public/control-center/pages/governance.js:908:              <p class="governance-copy mhos-executive-guidance">${escapeHtml(readiness.nextBestAction)}</p>
public/control-center/pages/governance.js:909:              <div class="governance-rule-list">
public/control-center/pages/governance.js:910:                <div class="governance-rule-item">
public/control-center/pages/governance.js:914:                <div class="governance-rule-item">
public/control-center/pages/governance.js:919:              <div class="governance-actions std-action-row">
public/control-center/pages/governance.js:920:                <button class="btn btn-secondary" type="button" data-governance-focus="all">View Full Queue</button>
public/control-center/pages/governance.js:921:                <button class="btn btn-secondary" type="button" data-governance-focus="approvals">Open Approvals</button>
public/control-center/pages/governance.js:922:                <button class="btn btn-secondary" type="button" data-governance-open-ai>Ask AI for Guidance</button>
public/control-center/pages/governance.js:925:            <div class="governance-policy-block">
public/control-center/pages/governance.js:927:              <div class="governance-activity-list">
public/control-center/pages/governance.js:930:                    <div class="governance-activity-item">
public/control-center/pages/governance.js:935:                  : `<div class="empty-box">No active governance blockers detected.</div>`}
public/control-center/pages/governance.js:938:            <div class="governance-policy-block">
public/control-center/pages/governance.js:940:              <div class="governance-rule-list">
public/control-center/pages/governance.js:941:                <div class="governance-rule-item">
public/control-center/pages/governance.js:943:                  <span>${escapeHtml(readiness.approvals ? "Review queued approvals" : "No queued approvals")}</span>
public/control-center/pages/governance.js:945:                <div class="governance-rule-item">
public/control-center/pages/governance.js:953:          <div class="governance-actions std-action-row mhos-executive-action-row">
public/control-center/pages/governance.js:954:            <button class="btn btn-secondary" type="button" data-governance-action="refresh">Refresh Governance Data</button>
public/control-center/pages/governance.js:955:            <button class="btn btn-secondary" type="button" data-governance-open-ai>Open AI Context</button>
public/control-center/pages/governance.js:956:            <button class="btn btn-secondary" type="button" data-governance-focus="approvals">Focus Approvals</button>
public/control-center/pages/governance.js:960:        <section class="panel mhos-clean-surface" aria-label="Supporting governance signals">
public/control-center/pages/governance.js:968:          <div class="governance-overview-grid">
public/control-center/pages/governance.js:969:            ${renderMetric("Approval Queue", asArray(sections.approval_queue).length, "Awaiting decision", escapeHtml)}
public/control-center/pages/governance.js:970:            ${renderMetric("Policy Violations", asArray(sections.policy_violations).length, "Needs review", escapeHtml)}
public/control-center/pages/governance.js:973:            ${renderMetric("Publish Guardrails", asArray(sections.publish_guardrails).length, "Release blockers", escapeHtml)}
public/control-center/pages/governance.js:976:          <div class="governance-activity-list">
public/control-center/pages/governance.js:979:                <div class="governance-activity-item">
public/control-center/pages/governance.js:988:        <div class="governance-workspace-grid">
public/control-center/pages/governance.js:989:          <div class="governance-action-stack std-main-column mhos-clean-stack">
public/control-center/pages/governance.js:998:              <div class="governance-policy-summary-grid">
public/control-center/pages/governance.js:999:                <div class="governance-policy-block">
public/control-center/pages/governance.js:1001:                  <div class="governance-rule-list">
public/control-center/pages/governance.js:1003:                      <div class="governance-rule-item">
public/control-center/pages/governance.js:1010:                <div class="governance-policy-block">
public/control-center/pages/governance.js:1012:                  <div class="governance-rule-list">
public/control-center/pages/governance.js:1014:                      <div class="governance-rule-item">
public/control-center/pages/governance.js:1021:                <div class="governance-policy-block">
public/control-center/pages/governance.js:1022:                  <h4>Editable policy controls</h4>
public/control-center/pages/governance.js:1025:                <div class="governance-policy-block">
public/control-center/pages/governance.js:1026:                  <h4>Open policy signal</h4>
public/control-center/pages/governance.js:1027:                  ${renderFlagList(asArray(sections.policy_violations), "No policy violations are currently open.", escapeHtml)}
public/control-center/pages/governance.js:1029:                    <strong>Settings bridge:</strong> ${escapeHtml(settingsBridge.source || "Not synced")} • approval mode ${escapeHtml(settingsBridge.approval_mode || "unknown")} • claim mode ${escapeHtml(settingsBridge.claim_safety_mode || "unknown")} • synced ${escapeHtml(settingsBridge.synced_at ? formatDateTime(settingsBridge.synced_at) : "not yet")}
public/control-center/pages/governance.js:1039:                  <h3>Pending approvals and governance decisions</h3>
public/control-center/pages/governance.js:1040:                  <p>Inspect risk, owner, status, and decision focus.</p>
public/control-center/pages/governance.js:1044:              <div class="governance-focus-tabs">
public/control-center/pages/governance.js:1047:                  ["approvals", "Approvals", focusCounts.approvals],
public/control-center/pages/governance.js:1050:                  ["publish", "Publish", focusCounts.publish],
public/control-center/pages/governance.js:1053:                  <button class="governance-focus-tab${session.focus === value ? " is-active" : ""}" type="button" data-governance-focus="${escapeHtml(value)}">
public/control-center/pages/governance.js:1077:                            <button class="governance-select-link" type="button" data-governance-select="${escapeHtml(item.selected_key)}">
public/control-center/pages/governance.js:1088:                      : `<tr><td colspan="6"><div class="empty-box">No governance items are visible in this focus state.</div></td></tr>`}
public/control-center/pages/governance.js:1095:          <div class="governance-action-stack std-right-rail mhos-clean-stack">
public/control-center/pages/governance.js:1099:                <div class="panel-kicker">Selected decision</div>
public/control-center/pages/governance.js:1100:                <h3>${escapeHtml(selectedItem?.queue_title || "Select a governance item")}</h3>
public/control-center/pages/governance.js:1101:                  <p>${escapeHtml(selectedItem ? "Review risk, owner, evidence, and linked approval before decision." : "Choose a governance item from the queue to inspect it.")}</p>
public/control-center/pages/governance.js:1107:                  <div class="governance-selected-summary">
public/control-center/pages/governance.js:1111:                  <div class="simple-banner"><strong>Authority focus:</strong> ${escapeHtml(selectedItem.queue_owner || authorityOwner)} owns this ${escapeHtml(titleCase(selectedItem.queue_risk || "medium"))} ${escapeHtml(titleCase(selectedItem.queue_kind || "governance"))} review.</div>
public/control-center/pages/governance.js:1116:                    governanceData: session.summary,
public/control-center/pages/governance.js:1129:                        intakeContext.publishing = getSharedHandoff(projectName, "publishing", operations)?.payload?.summary;
public/control-center/pages/governance.js:1140:                  <div class="governance-selected-grid">
public/control-center/pages/governance.js:1141:                    <div class="governance-selected-item">
public/control-center/pages/governance.js:1145:                    <div class="governance-selected-item">
public/control-center/pages/governance.js:1149:                    <div class="governance-selected-item">
public/control-center/pages/governance.js:1153:                    <div class="governance-selected-item">
public/control-center/pages/governance.js:1157:                    <div class="governance-selected-item">
public/control-center/pages/governance.js:1161:                    <div class="governance-selected-item">
public/control-center/pages/governance.js:1166:                  ${renderFlagList(asArray(selectedItem.queue_flags), "No policy flags were attached to this item.", escapeHtml)}
public/control-center/pages/governance.js:1168:                    selectedItem.linked_approval
public/control-center/pages/governance.js:1171:                          <strong>Linked approval:</strong> ${escapeHtml(selectedItem.linked_approval.title || selectedItem.linked_approval.id)} • ${escapeHtml(titleCase(selectedItem.linked_approval.status || "pending"))}
public/control-center/pages/governance.js:1179:                        <div class="governance-activity-list">
public/control-center/pages/governance.js:1181:                            <div class="governance-activity-item">
public/control-center/pages/governance.js:1191:                : `<div class="empty-box">No governance item is selected.</div>`
public/control-center/pages/governance.js:1201:                <h3>Review, decide, and maintain policy controls</h3>
public/control-center/pages/governance.js:1202:                <p>Backend-authoritative decisions only. Approval actions appear only for real queued approvals.</p>
public/control-center/pages/governance.js:1205:            <div class="governance-action-stack">
public/control-center/pages/governance.js:1206:              <div class="simple-banner"><strong>Authority boundary:</strong> Governance records reviewed decisions and policy gates. It does not publish, send, or execute directly. High-risk decisions require confirmation and backend authority remains enforced.</div>
public/control-center/pages/governance.js:1207:              <div class="simple-banner"><strong>Safe execution path:</strong> Review selected context, add rationale, submit one reviewed governance decision, then refresh and validate queue impact.</div>
public/control-center/pages/governance.js:1208:              <textarea id="governanceDecisionNote" class="setup-input setup-textarea governance-note" rows="4" placeholder="Add a decision reason, change request, or escalation note.">${escapeHtml(selectedItem?.decision_note || "")}</textarea>
public/control-center/pages/governance.js:1209:              <div class="governance-actions std-action-row">
public/control-center/pages/governance.js:1210:                <button class="btn btn-secondary" type="button" data-governance-action="refresh">Refresh</button>
public/control-center/pages/governance.js:1211:                <button class="btn btn-primary" type="button" data-governance-action="save-policy">Save Governance Policy</button>
public/control-center/pages/governance.js:1212:                <button class="btn btn-secondary" type="button" data-governance-action="sync-settings"${Object.keys(settingsDraft).length ? "" : " disabled"}>Review & Sync Settings Rules</button>
public/control-center/pages/governance.js:1214:                  selectedItem?.queue_kind === "approval"
public/control-center/pages/governance.js:1216:                      <button class="btn btn-primary" type="button" data-governance-decision="approved" data-approval-id="${escapeHtml(selectedItem.id)}">Submit Approval Decision</button>
public/control-center/pages/governance.js:1217:                      <button class="btn btn-secondary" type="button" data-governance-decision="rejected" data-approval-id="${escapeHtml(selectedItem.id)}">Submit Rejection Decision</button>
public/control-center/pages/governance.js:1218:                      <button class="btn btn-secondary" type="button" data-governance-decision="changes_requested" data-approval-id="${escapeHtml(selectedItem.id)}">Request Changes Review</button>
public/control-center/pages/governance.js:1219:                      <button class="btn btn-secondary" type="button" data-governance-decision="escalated" data-approval-id="${escapeHtml(selectedItem.id)}">Escalate Review</button>
public/control-center/pages/governance.js:1220:                      <button class="btn btn-secondary" type="button" data-governance-decision="overridden" data-approval-id="${escapeHtml(selectedItem.id)}">Record Override Decision</button>
public/control-center/pages/governance.js:1225:                  selectedItem && selectedItem.queue_kind !== "approval" && !selectedItem.linked_approval
public/control-center/pages/governance.js:1230:                        data-governance-request-approval="true"
public/control-center/pages/governance.js:1243:              <div class="governance-policy-summary-grid">
public/control-center/pages/governance.js:1244:                <div class="governance-policy-block">
public/control-center/pages/governance.js:1246:                  <div class="governance-activity-list">
public/control-center/pages/governance.js:1249:                        <div class="governance-activity-item">
public/control-center/pages/governance.js:1257:                <div class="governance-policy-block">
public/control-center/pages/governance.js:1259:                  <div class="governance-rule-list">
public/control-center/pages/governance.js:1261:                      <div class="governance-rule-item">
public/control-center/pages/governance.js:1279:              <p>Explanation-only guidance. Decisions and policy changes stay in governed controls.</p>
public/control-center/pages/governance.js:1282:          <div class="simple-banner"><strong>AI context scope:</strong> Policy pressure, approval readiness, ownership coverage, risk, and next governance move.</div>
public/control-center/pages/governance.js:1283:          <div class="governance-ai-toolbar">
public/control-center/pages/governance.js:1284:            <button class="btn btn-secondary" type="button" data-governance-open-ai>Open AI: Review in AI Workspace</button>
public/control-center/pages/governance.js:1288:              <button class="quick-action-btn" type="button" data-governance-ai-prompt="${index}">
public/control-center/pages/governance.js:1309:  Array.from(root.querySelectorAll("[data-governance-decision]")).forEach((button) => {
public/control-center/pages/governance.js:1311:      const approvalId = button.getAttribute("data-approval-id") || "";
public/control-center/pages/governance.js:1312:      const decision = button.getAttribute("data-governance-decision") || "";
public/control-center/pages/governance.js:1313:      const note = root.querySelector("#governanceDecisionNote")?.value?.trim() || `${titleCase(decision)} from Governance console.`;
public/control-center/pages/governance.js:1317:      if (!confirmGovernanceDecision(decision)) {
public/control-center/pages/governance.js:1322:        await decideProjectApproval(projectName, approvalId, {
public/control-center/pages/governance.js:1323:          decision,
public/control-center/pages/governance.js:1325:          actor: "governance-console",
public/control-center/pages/governance.js:1328:        context.showMessage(`Approval ${titleCase(decision)} for ${approvalId}.`);
public/control-center/pages/governance.js:1331:        context.showError(error.message || "Failed to update approval.");
public/control-center/pages/governance.js:1336:  Array.from(root.querySelectorAll("[data-governance-focus]")).forEach((button) => {
public/control-center/pages/governance.js:1338:      session.focus = button.getAttribute("data-governance-focus") || "all";
public/control-center/pages/governance.js:1343:  Array.from(root.querySelectorAll("[data-governance-select]")).forEach((button) => {
public/control-center/pages/governance.js:1345:      session.selectedKey = button.getAttribute("data-governance-select") || "";
public/control-center/pages/governance.js:1350:  Array.from(root.querySelectorAll("[data-governance-request-approval]")).forEach((button) => {
public/control-center/pages/governance.js:1357:          title: `${button.getAttribute("data-title") || "Governance item"} approval`,
public/control-center/pages/governance.js:1359:          reviewer: ownership.compliance || "Compliance Reviewer",
public/control-center/pages/governance.js:1360:          reviewer_role: "compliance_reviewer",
public/control-center/pages/governance.js:1361:          requested_by: "governance-console",
public/control-center/pages/governance.js:1362:          requested_for: ownership.compliance || "Compliance Reviewer",
public/control-center/pages/governance.js:1364:          source_page: "governance",
public/control-center/pages/governance.js:1365:          route_target: "governance"
public/control-center/pages/governance.js:1367:        context.showMessage("Approval request added to the governance queue.");
public/control-center/pages/governance.js:1370:        context.showError(error.message || "Failed to request approval.");
public/control-center/pages/governance.js:1375:  Array.from(root.querySelectorAll("[data-governance-action]")).forEach((button) => {
public/control-center/pages/governance.js:1377:      const action = button.getAttribute("data-governance-action");
public/control-center/pages/governance.js:1384:      if (action === "save-policy") {
public/control-center/pages/governance.js:1385:        const policyRules = {};
public/control-center/pages/governance.js:1386:        Array.from(root.querySelectorAll("[data-governance-policy]")).forEach((control) => {
public/control-center/pages/governance.js:1387:          policyRules[control.getAttribute("data-governance-policy")] = Boolean(control.checked);
public/control-center/pages/governance.js:1390:        const approvalOwners = {};
public/control-center/pages/governance.js:1391:        Array.from(root.querySelectorAll("[data-governance-owner]")).forEach((control) => {
public/control-center/pages/governance.js:1392:          approvalOwners[control.getAttribute("data-governance-owner")] = control.value || "";
public/control-center/pages/governance.js:1395:        const confirmed = window.confirm("Confirm governance policy save\n\nAction: Save governance policy rules for this project.\nRisk: These rules can affect approvals, publishing readiness, brand safety review, and admin override behavior.\nAuthority: This is a backend-governed durable policy update.\n\nSelect Cancel to review the policy settings before saving.");
public/control-center/pages/governance.js:1396:        if (!confirmed) {
public/control-center/pages/governance.js:1402:            actor: "governance-console",
public/control-center/pages/governance.js:1403:            policy_rules: policyRules,
public/control-center/pages/governance.js:1404:            approval_owners: approvalOwners
public/control-center/pages/governance.js:1406:          context.showMessage("Governance policy saved.");
public/control-center/pages/governance.js:1409:          context.showError(error.message || "Failed to save governance policy.");
public/control-center/pages/governance.js:1417:          context.showError("No durable Settings snapshot was found in the governance bridge for this project.");
public/control-center/pages/governance.js:1421:        const confirmed = window.confirm("Sync Settings Rules to Governance Policy? This updates enforceable governance rules including approval-before-publish, claim review, escalation, owners, and policy behavior. Continue only if these settings are reviewed.");
public/control-center/pages/governance.js:1422:        if (!confirmed) {
public/control-center/pages/governance.js:1428:            actor: "governance-console",
public/control-center/pages/governance.js:1431:          context.showMessage("Settings rules synced into enforceable Governance policy.");
public/control-center/pages/governance.js:1440:  Array.from(root.querySelectorAll("[data-governance-open-ai]")).forEach((button) => {
public/control-center/pages/governance.js:1442:      context.navigateTo("ai-command");
public/control-center/pages/governance.js:1449:  Array.from(root.querySelectorAll("[data-governance-ai-prompt]")).forEach((button) => {
public/control-center/pages/governance.js:1451:      const prompt = prompts[Number(button.getAttribute("data-governance-ai-prompt"))];
public/control-center/pages/governance.js:1454:      context.navigateTo("ai-command");
public/control-center/pages/governance.js:1460:export const governanceRoute = {
public/control-center/pages/governance.js:1461:  id: "governance",
public/control-center/pages/governance.js:1466:    description: "Review approvals, policy violations, overrides, escalation, and audit visibility across content, media, campaigns, and publishing."
public/control-center/pages/governance.js:1468:  template: `<section class="page is-active" data-page="governance"><div class="governance-shell"></div></section>`,
public/control-center/api.js:184:  const accessKeyBypass = String(response?.headers?.get?.("x-mh-control-key-bypass") || "")
public/control-center/api.js:320:      new Promise((_, reject) => {
public/control-center/api.js:326:          reject(error);
public/control-center/api.js:363:            new Promise((_, reject) => {
public/control-center/api.js:369:                reject(fallbackTimeoutError);
public/control-center/api.js:633:  const timeoutPromise = new Promise((_, reject) => {
public/control-center/api.js:650:      reject(timeoutError);
public/control-center/api.js:1626:    `/media-manager/project/${encodeURIComponent(projectName)}/approvals`,
public/control-center/api.js:1629:    "Failed to create approval request"
public/control-center/api.js:1640:    `/media-manager/project/${encodeURIComponent(projectName)}/approvals${suffix}`,
public/control-center/api.js:1641:    "Failed to load approvals"
public/control-center/api.js:1645:export async function decideProjectApproval(projectName, approvalId, payload = {}) {
public/control-center/api.js:1650:  if (!approvalId) {
public/control-center/api.js:1651:    throw new Error("Missing approval id");
public/control-center/api.js:1655:    `/media-manager/project/${encodeURIComponent(projectName)}/approvals/${encodeURIComponent(approvalId)}/decision`,
public/control-center/api.js:1658:    "Failed to update approval"
public/control-center/api.js:1676:    `/media-manager/project/${encodeURIComponent(projectName)}/governance${suffix}`,
public/control-center/api.js:1677:    "Failed to load governance summary"
public/control-center/api.js:1687:    `/media-manager/project/${encodeURIComponent(projectName)}/governance/policy`,
public/control-center/api.js:1688:    "Failed to load governance policy"
public/control-center/api.js:1698:    `/media-manager/project/${encodeURIComponent(projectName)}/governance/policy`,
public/control-center/api.js:1701:    "Failed to update governance policy"
public/control-center/api.js:1865:    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/schedule`,
public/control-center/api.js:1868:    "Failed to save publishing schedule"
public/control-center/api.js:1882:    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/${encodeURIComponent(jobId)}/reschedule`,
public/control-center/api.js:1885:    "Failed to reschedule publishing item"
public/control-center/api.js:1889:export async function approvePublishingItem(projectName, jobId, payload = {}) {
public/control-center/api.js:1899:    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/${encodeURIComponent(jobId)}/ready`,
public/control-center/api.js:1902:    "Failed to approve publishing item"
public/control-center/api.js:1906:export async function publishPublishingItem(projectName, jobId, payload = {}) {
public/control-center/api.js:1916:    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/${encodeURIComponent(jobId)}/publish`,
public/control-center/api.js:1919:    "Failed to publish item"
public/control-center/api.js:1933:    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/${encodeURIComponent(jobId)}/fail`,
public/control-center/api.js:1936:    "Failed to mark publishing item as failed"
runtime/orchestrator-service/server.js:159:    appLogger.error('unhandled_rejection', {
runtime/orchestrator-service/server.js:161:      action: 'unhandled_rejection',
runtime/orchestrator-service/server.js:200:// Temporary local/server diagnostic bypass. Do not enable in production.
runtime/orchestrator-service/server.js:219:  /^\/publish-clone\/[^/]+\/?$/i,
runtime/orchestrator-service/server.js:222:  /^\/publish-blog\/[^/]+\/?$/i,
runtime/orchestrator-service/server.js:226:  /^\/execute_publish_package\/?$/i,
runtime/orchestrator-service/server.js:406:  const decision = limiter.check(identity);
runtime/orchestrator-service/server.js:408:  if (decision.allowed) {
runtime/orchestrator-service/server.js:416:    retryAfterMs: decision.retryAfterMs
runtime/orchestrator-service/server.js:419:  res.set('Retry-After', String(Math.ceil(decision.retryAfterMs / 1000)));
runtime/orchestrator-service/server.js:780:  'manual_publish_ready',
runtime/orchestrator-service/server.js:1061:  publishing: {
runtime/orchestrator-service/server.js:1063:    canonical: 'publishing'
runtime/orchestrator-service/server.js:1095:    canonical: 'publishing/results'
runtime/orchestrator-service/server.js:1105:    return 'policy_or_config_mismatch';
runtime/orchestrator-service/server.js:1272:    policy: readPolicy
runtime/orchestrator-service/server.js:1304:      policy: {
runtime/orchestrator-service/server.js:1562:  'publishing',
runtime/orchestrator-service/server.js:1622:    return 'policy_or_config_mismatch';
runtime/orchestrator-service/server.js:1671:      policy_or_config_mismatch: 0,
runtime/orchestrator-service/server.js:1740:      stats.fallback_causes.policy_or_config_mismatch;
runtime/orchestrator-service/server.js:1801:  const aggregate = {
runtime/orchestrator-service/server.js:1810:    aggregate.read_events += summary.totals.read_events;
runtime/orchestrator-service/server.js:1811:    aggregate.canonical_hit_count += summary.totals.canonical_hit_count;
runtime/orchestrator-service/server.js:1812:    aggregate.fallback_hit_count += summary.totals.fallback_hit_count;
runtime/orchestrator-service/server.js:1813:    aggregate.unresolved_structural_mismatches += summary.totals.unresolved_structural_mismatches;
runtime/orchestrator-service/server.js:1814:    aggregate.active_write_read_mismatches += summary.totals.active_write_read_mismatches;
runtime/orchestrator-service/server.js:1817:  const totalReads = aggregate.read_events;
runtime/orchestrator-service/server.js:1818:  aggregate.canonical_hit_rate = totalReads > 0
runtime/orchestrator-service/server.js:1819:    ? Number((aggregate.canonical_hit_count / totalReads).toFixed(4))
runtime/orchestrator-service/server.js:1821:  aggregate.fallback_rate = totalReads > 0
runtime/orchestrator-service/server.js:1822:    ? Number((aggregate.fallback_hit_count / totalReads).toFixed(4))
runtime/orchestrator-service/server.js:1828:    aggregate,
runtime/orchestrator-service/server.js:1945:      body: `This campaign asset was auto-prepared by the system using the latest approved brand-controlled render.`,
runtime/orchestrator-service/server.js:2743:    published_count: 0,
runtime/orchestrator-service/server.js:2752:    if (product.status === 'publish') summary.published_count += 1;
runtime/orchestrator-service/server.js:2943:    compliance_notes: [
runtime/orchestrator-service/server.js:2949:    publish_status: imageInfo ? 'ready_for_publish' : 'needs_manual_review'
runtime/orchestrator-service/server.js:2956:  const compliance = buildMetaCompliance(projectName, placement, image);
runtime/orchestrator-service/server.js:2969:    status: compliance.publish_status,
runtime/orchestrator-service/server.js:2978:    compliance
runtime/orchestrator-service/server.js:3055:    compliance_notes: [
runtime/orchestrator-service/server.js:3061:    publish_status: imageInfo ? 'ready_for_production' : 'needs_manual_review'
runtime/orchestrator-service/server.js:3069:  const compliance = buildTikTokCompliance(projectName, image);
runtime/orchestrator-service/server.js:3080:    status: compliance.publish_status,
runtime/orchestrator-service/server.js:3099:    compliance
runtime/orchestrator-service/server.js:3200:    compliance_notes: [
runtime/orchestrator-service/server.js:3206:    publish_status: imageInfo ? 'ready_for_publish' : 'needs_manual_review'
runtime/orchestrator-service/server.js:3214:  const compliance = buildYouTubeCompliance(projectName, format, image);
runtime/orchestrator-service/server.js:3225:    : `This video package is designed for ${goal} using approved brand-controlled creative, with emphasis on product credibility, premium presentation, and visual trust.`;
runtime/orchestrator-service/server.js:3234:    status: compliance.publish_status,
runtime/orchestrator-service/server.js:3259:    compliance
runtime/orchestrator-service/server.js:3393:    description: `This Amazon package is built for ${goal} using approved real assets and a conversion-oriented marketplace structure.`,
runtime/orchestrator-service/server.js:3402:    compliance: {
runtime/orchestrator-service/server.js:3456:    description: `This eBay package is built for ${goal} using approved brand-controlled assets and a trust-oriented listing structure.`,
runtime/orchestrator-service/server.js:3458:    compliance: {
runtime/orchestrator-service/server.js:3640:    if (status !== 'publish' || !slug || !name || !stableKey) {
runtime/orchestrator-service/server.js:3696:      published_count: launchReadyProducts.length,
runtime/orchestrator-service/server.js:3846:    domain: 'publishing',
runtime/orchestrator-service/server.js:3851:    domain: 'publishing',
runtime/orchestrator-service/server.js:3854:    requestedIdentifier: 'publishing-root',
runtime/orchestrator-service/server.js:3855:    requestedFile: 'publishing'
runtime/orchestrator-service/server.js:3916:    domain: 'publishing',
runtime/orchestrator-service/server.js:3917:    artifactType: 'publishing_connector_payload',
runtime/orchestrator-service/server.js:3952:    domain: 'publishing',
runtime/orchestrator-service/server.js:3953:    artifactType: 'publishing_scheduler_job',
runtime/orchestrator-service/server.js:3970:  if (['queued', 'queue', 'scheduled', 'pending', 'pending_publish'].includes(normalized)) return 'scheduled';
runtime/orchestrator-service/server.js:3974:      'ready_for_manual_publish',
runtime/orchestrator-service/server.js:3978:      'manual_publish',
runtime/orchestrator-service/server.js:3985:  if (['published', 'completed', 'complete', 'success', 'done', 'sent', 'live'].includes(normalized)) {
runtime/orchestrator-service/server.js:3986:    return 'published';
runtime/orchestrator-service/server.js:3988:  if (['failed', 'error', 'blocked', 'rejected'].includes(normalized)) return 'failed';
runtime/orchestrator-service/server.js:4030:  if (safeChannel) return `${safeChannel} publish`;
runtime/orchestrator-service/server.js:4174:    domain: 'publishing',
runtime/orchestrator-service/server.js:4175:    artifactType: 'publishing_scheduler_job',
runtime/orchestrator-service/server.js:4304:    domain: 'publishing',
runtime/orchestrator-service/server.js:4309:    requestedFile: 'publishing/scheduler/*.json'
runtime/orchestrator-service/server.js:4430:    recommendations.push('rewrite copy in natural German for German-market publishing');
runtime/orchestrator-service/server.js:6012:    text.includes('publish') ||
runtime/orchestrator-service/server.js:6018:    return 'approval_required';
runtime/orchestrator-service/server.js:6072:  const sharedPolicy = readFileSafe(path.join(PROMPTS_DIR, 'shared-policy.md'));
runtime/orchestrator-service/server.js:6087:    approval_required: mode === 'approval_required',
runtime/orchestrator-service/server.js:6094:        mode === 'approval_required'
runtime/orchestrator-service/server.js:6095:          ? 'Prepare execution summary and request approval.'
runtime/orchestrator-service/server.js:6101:      shared_policy_loaded: sharedPolicy.length > 0,
runtime/orchestrator-service/server.js:6150:    publishingDir: path.join(baseDir, 'publishing'),
runtime/orchestrator-service/server.js:6460:    paths.publishingDir,
runtime/orchestrator-service/server.js:6576:      publishing: { path: paths.publishingDir, exists: fs.existsSync(paths.publishingDir) },
runtime/orchestrator-service/server.js:6660:    paths.publishingDir,
runtime/orchestrator-service/server.js:6697:    content_categories: ['brand_story', 'offers', 'education', 'social_proof'],
runtime/orchestrator-service/server.js:6698:    workspace_priorities: ['setup', 'library', 'content-studio', 'campaign-studio', 'publishing'],
runtime/orchestrator-service/server.js:6699:    ai_team_defaults: ['strategist', 'writer', 'designer', 'publisher', 'analyst'],
runtime/orchestrator-service/server.js:6715:      required_assets: ['logo', 'product_photos', 'product_catalog', 'price_list', 'shipping_policy', 'legal_docs'],
runtime/orchestrator-service/server.js:6718:      workspace_priorities: ['setup', 'library', 'campaign-studio', 'content-studio', 'media-studio', 'publishing', 'insights'],
runtime/orchestrator-service/server.js:6719:      ai_team_defaults: ['strategist', 'writer', 'designer', 'publisher', 'ads_operator', 'analyst', 'compliance_reviewer'],
runtime/orchestrator-service/server.js:6731:      workspace_priorities: ['setup', 'library', 'media-studio', 'content-studio', 'campaign-studio', 'publishing'],
runtime/orchestrator-service/server.js:6732:      ai_team_defaults: ['strategist', 'writer', 'designer', 'video_lead', 'publisher', 'analyst'],
runtime/orchestrator-service/server.js:6744:      workspace_priorities: ['setup', 'library', 'media-studio', 'content-studio', 'publishing', 'insights'],
runtime/orchestrator-service/server.js:6745:      ai_team_defaults: ['strategist', 'writer', 'designer', 'publisher', 'analyst'],
runtime/orchestrator-service/server.js:6757:      workspace_priorities: ['setup', 'library', 'content-studio', 'campaign-studio', 'ads-manager', 'governance'],
runtime/orchestrator-service/server.js:6758:      ai_team_defaults: ['strategist', 'writer', 'designer', 'ads_operator', 'publisher', 'compliance_reviewer'],
runtime/orchestrator-service/server.js:6770:      workspace_priorities: ['setup', 'library', 'content-studio', 'campaign-studio', 'publishing'],
runtime/orchestrator-service/server.js:6771:      ai_team_defaults: ['strategist', 'writer', 'designer', 'publisher', 'analyst'],
runtime/orchestrator-service/server.js:6783:      workspace_priorities: ['setup', 'library', 'media-studio', 'publishing', 'campaign-studio'],
runtime/orchestrator-service/server.js:6784:      ai_team_defaults: ['strategist', 'writer', 'designer', 'video_lead', 'publisher'],
runtime/orchestrator-service/server.js:6809:      workspace_priorities: ['setup', 'library', 'content-studio', 'publishing', 'insights'],
runtime/orchestrator-service/server.js:6810:      ai_team_defaults: ['strategist', 'writer', 'designer', 'publisher'],
runtime/orchestrator-service/server.js:6866:      publishing: paths.publishingDir,
runtime/orchestrator-service/server.js:7166:  const publishingReadiness = fs.existsSync(paths.publishingDir) ? 100 : 0;
runtime/orchestrator-service/server.js:7179:    publishing_readiness: publishingReadiness,
runtime/orchestrator-service/server.js:7190:    has_publishing_dir: fs.existsSync(paths.publishingDir),
runtime/orchestrator-service/server.js:7226:  if (domainScores.publishing_readiness < 100) missing.push('publishing_readiness');
runtime/orchestrator-service/server.js:7300:    approved: Boolean(asset.approved),
runtime/orchestrator-service/server.js:7301:    approved_at: normalizeSetupTextValue(asset.approved_at),
runtime/orchestrator-service/server.js:7302:    approval_note: normalizeSetupTextValue(asset.approval_note),
runtime/orchestrator-service/server.js:7303:    rejected: Boolean(asset.rejected),
runtime/orchestrator-service/server.js:7304:    rejected_at: normalizeSetupTextValue(asset.rejected_at),
runtime/orchestrator-service/server.js:7305:    rejection_note: normalizeSetupTextValue(asset.rejection_note),
runtime/orchestrator-service/server.js:8202:        what_to_upload: 'Primary logo files, transparent logo variants, and approved lockups.',
runtime/orchestrator-service/server.js:8203:        why_it_matters: 'Keeps setup, media creation, publishing previews, and AI output visually tied to the right brand.',
runtime/orchestrator-service/server.js:8258:      purpose: 'proof_compliance',
runtime/orchestrator-service/server.js:8259:      purpose_label: 'Proof and compliance',
runtime/orchestrator-service/server.js:8263:      aliases: ['legal', 'compliance_doc', 'terms_doc'],
runtime/orchestrator-service/server.js:8266:        what_to_upload: 'Terms, privacy policy, disclaimers, compliance notes, claim restrictions, and regulated copy rules.',
runtime/orchestrator-service/server.js:8280:      description: 'Approved product photography for content, media, ads, and publishing.',
runtime/orchestrator-service/server.js:8346:        what_to_upload: 'Packaging photos, label artwork, inserts, box shots, bottle/jar details, and compliance label references.',
runtime/orchestrator-service/server.js:8347:        why_it_matters: 'Media Studio and Publishing need packaging truth for product visuals and compliance checks.',
runtime/orchestrator-service/server.js:8354:      purpose: 'proof_compliance',
runtime/orchestrator-service/server.js:8355:      purpose_label: 'Proof and compliance',
runtime/orchestrator-service/server.js:8360:      description: 'Customer proof, reviews, testimonial exports, and approved quotes.',
runtime/orchestrator-service/server.js:8362:        what_to_upload: 'Review exports, testimonial docs, approved screenshots, quote permissions, and proof notes.',
runtime/orchestrator-service/server.js:8363:        why_it_matters: 'Content Studio, Campaign Studio, Publishing, and AI Command need trusted proof points.',
runtime/orchestrator-service/server.js:8370:      purpose: 'proof_compliance',
runtime/orchestrator-service/server.js:8371:      purpose_label: 'Proof and compliance',
runtime/orchestrator-service/server.js:8376:      description: 'Certifications, lab reports, awards, and official proof documents.',
runtime/orchestrator-service/server.js:8378:        what_to_upload: 'Certificates, compliance proof, awards, lab reports, or official authorization documents.',
runtime/orchestrator-service/server.js:8379:        why_it_matters: 'Publishing and AI Command can use only approved proof when making trust or compliance claims.',
runtime/orchestrator-service/server.js:8426:    record.approval_status ||
runtime/orchestrator-service/server.js:8431:  if (record.approved === true || ['approved', 'ready_approved'].includes(explicitStatus)) {
runtime/orchestrator-service/server.js:8450:  if (['needs_review', 'review', 'blocked', 'rejected'].includes(explicitStatus)) {
runtime/orchestrator-service/server.js:8894:    let approvedCount = statuses.filter(value => value === 'Approved').length;
runtime/orchestrator-service/server.js:8903:      approvedCount = 0;
runtime/orchestrator-service/server.js:8911:      approvedCount = 0;
runtime/orchestrator-service/server.js:8921:    const approvedAssets = matchingAssets
runtime/orchestrator-service/server.js:8950:      approved_count: approvedCount,
runtime/orchestrator-service/server.js:8955:      approved_assets: approvedAssets,
runtime/orchestrator-service/server.js:8964:              ? `Review and approve ${item.label} when ready.`
runtime/orchestrator-service/server.js:8965:              : `${item.label} is approved.`
runtime/orchestrator-service/server.js:8979:    approved: 0,
runtime/orchestrator-service/server.js:9349:app.post('/execute_publish_package', (req, res) => {
runtime/orchestrator-service/server.js:9354:    const publishPackage = resolvePublishPackageForExecution(projectName, req.body || {});
runtime/orchestrator-service/server.js:9355:    const payload = buildSocialExecutionPayload(publishPackage);
runtime/orchestrator-service/server.js:9356:    const executionState = 'manual_publish_ready';
runtime/orchestrator-service/server.js:9360:      campaign_name: String(publishPackage.campaign_name || req.body?.campaign_name || '').trim(),
runtime/orchestrator-service/server.js:9369:    const log = writeExecutionBridgeLog(projectName, 'execute_publish_package', {
runtime/orchestrator-service/server.js:9389:      writeExecutionBridgeLog(logProject, 'execute_publish_package', {
runtime/orchestrator-service/server.js:9402:      message: error.message || 'Failed to execute publish package'
runtime/orchestrator-service/server.js:9471:      : req.body?.publish_package?.assets?.[0]?.fallback_prompt_pack;
runtime/orchestrator-service/server.js:9474:      const error = new Error('Missing prompt_pack. Provide prompt_pack or publish_package.assets[0].fallback_prompt_pack');
runtime/orchestrator-service/server.js:9716:        'Review this prepared draft, then approve before applying any product update to WooCommerce.'
runtime/orchestrator-service/server.js:9800:        'Use the cloned draft product for safe content updates before publishing.'
runtime/orchestrator-service/server.js:9915:        'Review the updated draft clone in WooCommerce before any publish action.'
runtime/orchestrator-service/server.js:9955:      message: 'Upload request rejected'
runtime/orchestrator-service/server.js:10568:    const allowed = new Set(['approved', 'needs_review', 'rejected', 'archived']);
runtime/orchestrator-service/server.js:10585:      asset.approved = status === 'approved';
runtime/orchestrator-service/server.js:10586:      asset.rejected = status === 'rejected';
runtime/orchestrator-service/server.js:10591:      if (status === 'approved') {
runtime/orchestrator-service/server.js:10592:        asset.approved_at = now;
runtime/orchestrator-service/server.js:10593:        asset.approval_note = note || asset.approval_note || 'Approved from Control Center Library.';
runtime/orchestrator-service/server.js:10596:      if (status === 'rejected') {
runtime/orchestrator-service/server.js:10597:        asset.rejected_at = now;
runtime/orchestrator-service/server.js:10598:        asset.rejection_note = note || asset.rejection_note || 'Rejected from Control Center Library.';
runtime/orchestrator-service/server.js:11501:      error: error.message || 'Failed to list approvals'
runtime/orchestrator-service/server.js:11508:    const approval = createApproval(req.params.project, req.body || {});
runtime/orchestrator-service/server.js:11510:      approval,
runtime/orchestrator-service/server.js:11515:      error: error.message || 'Failed to create approval'
runtime/orchestrator-service/server.js:11522:    const approval = decideApproval(req.params.project, req.params.approvalId, {
runtime/orchestrator-service/server.js:11523:      decision: req.body?.decision,
runtime/orchestrator-service/server.js:11531:      approval,
runtime/orchestrator-service/server.js:11536:      error: error.message || 'Failed to update approval'
runtime/orchestrator-service/server.js:11541:app.get('/media-manager/project/:project/approvals', handleListApprovals);
runtime/orchestrator-service/server.js:11542:app.get('/public/media-manager/project/:project/approvals', handleListApprovals);
runtime/orchestrator-service/server.js:11543:app.post('/media-manager/project/:project/approvals', handleCreateApproval);
runtime/orchestrator-service/server.js:11544:app.post('/public/media-manager/project/:project/approvals', handleCreateApproval);
runtime/orchestrator-service/server.js:11545:app.post('/media-manager/project/:project/approvals/:approvalId/decision', handleApprovalDecision);
runtime/orchestrator-service/server.js:11546:app.post('/public/media-manager/project/:project/approvals/:approvalId/decision', handleApprovalDecision);
runtime/orchestrator-service/server.js:11557:      error: error.message || 'Failed to load governance summary'
runtime/orchestrator-service/server.js:11564:    const policy = updateGovernancePolicy(req.params.project, req.body || {}, req.body?.actor || 'operator');
runtime/orchestrator-service/server.js:11567:      policy
runtime/orchestrator-service/server.js:11571:      error: error.message || 'Failed to update governance policy'
runtime/orchestrator-service/server.js:11580:      policy: getGovernancePolicy(req.params.project)
runtime/orchestrator-service/server.js:11584:      error: error.message || 'Failed to load governance policy'
runtime/orchestrator-service/server.js:11589:app.get('/media-manager/project/:project/governance', handleGetGovernance);
runtime/orchestrator-service/server.js:11590:app.get('/public/media-manager/project/:project/governance', handleGetGovernance);
runtime/orchestrator-service/server.js:11591:app.get('/media-manager/project/:project/governance/policy', handleGetGovernancePolicy);
runtime/orchestrator-service/server.js:11592:app.get('/public/media-manager/project/:project/governance/policy', handleGetGovernancePolicy);
runtime/orchestrator-service/server.js:11593:app.post('/media-manager/project/:project/governance/policy', handleUpdateGovernancePolicy);
runtime/orchestrator-service/server.js:11594:app.post('/public/media-manager/project/:project/governance/policy', handleUpdateGovernancePolicy);
runtime/orchestrator-service/server.js:12253:app.post('/media-manager/project/:project/publishing/schedule', (req, res) => {
runtime/orchestrator-service/server.js:12276:    logCriticalFailure('publishing_schedule', req, error, {
runtime/orchestrator-service/server.js:12280:      error: error.message || 'Failed to save publishing schedule',
runtime/orchestrator-service/server.js:12286:app.post('/public/media-manager/project/:project/publishing/schedule', (req, res) => {
runtime/orchestrator-service/server.js:12309:    logCriticalFailure('publishing_schedule', req, error, {
runtime/orchestrator-service/server.js:12313:      error: error.message || 'Failed to save publishing schedule',
runtime/orchestrator-service/server.js:12319:app.post('/media-manager/project/:project/publishing/:jobId/reschedule', (req, res) => {
runtime/orchestrator-service/server.js:12342:      error: error.message || 'Failed to reschedule publishing item',
runtime/orchestrator-service/server.js:12348:app.post('/public/media-manager/project/:project/publishing/:jobId/reschedule', (req, res) => {
runtime/orchestrator-service/server.js:12371:      error: error.message || 'Failed to reschedule publishing item',
runtime/orchestrator-service/server.js:12377:app.post('/media-manager/project/:project/publishing/:jobId/ready', (req, res) => {
runtime/orchestrator-service/server.js:12393:      error: error.message || 'Failed to approve publishing item',
runtime/orchestrator-service/server.js:12399:app.post('/public/media-manager/project/:project/publishing/:jobId/ready', (req, res) => {
runtime/orchestrator-service/server.js:12415:      error: error.message || 'Failed to approve publishing item',
runtime/orchestrator-service/server.js:12421:app.post('/media-manager/project/:project/publishing/:jobId/publish', (req, res) => {
runtime/orchestrator-service/server.js:12423:    assertPublishingMutationAllowed(req.params.project, 'publish', {
runtime/orchestrator-service/server.js:12425:      status: 'published'
runtime/orchestrator-service/server.js:12428:      status: 'published',
runtime/orchestrator-service/server.js:12432:      execution_status: 'published',
runtime/orchestrator-service/server.js:12433:      action_type: 'manual_publish_complete',
runtime/orchestrator-service/server.js:12442:    logCriticalFailure('publishing_publish', req, error, {
runtime/orchestrator-service/server.js:12447:      error: error.message || 'Failed to publish item',
runtime/orchestrator-service/server.js:12453:app.post('/public/media-manager/project/:project/publishing/:jobId/publish', (req, res) => {
runtime/orchestrator-service/server.js:12455:    assertPublishingMutationAllowed(req.params.project, 'publish', {
runtime/orchestrator-service/server.js:12457:      status: 'published'
runtime/orchestrator-service/server.js:12460:      status: 'published',
runtime/orchestrator-service/server.js:12464:      execution_status: 'published',
runtime/orchestrator-service/server.js:12465:      action_type: 'manual_publish_complete',
runtime/orchestrator-service/server.js:12474:    logCriticalFailure('publishing_publish', req, error, {
runtime/orchestrator-service/server.js:12479:      error: error.message || 'Failed to publish item',
runtime/orchestrator-service/server.js:12485:app.post('/media-manager/project/:project/publishing/:jobId/fail', (req, res) => {
runtime/orchestrator-service/server.js:12497:      action_type: 'manual_publish_failed',
runtime/orchestrator-service/server.js:12506:    logCriticalFailure('publishing_fail', req, error, {
runtime/orchestrator-service/server.js:12511:      error: error.message || 'Failed to mark publishing item as failed',
runtime/orchestrator-service/server.js:12517:app.post('/public/media-manager/project/:project/publishing/:jobId/fail', (req, res) => {
runtime/orchestrator-service/server.js:12529:      action_type: 'manual_publish_failed',
runtime/orchestrator-service/server.js:12538:    logCriticalFailure('publishing_fail', req, error, {
runtime/orchestrator-service/server.js:12543:      error: error.message || 'Failed to mark publishing item as failed',
runtime/orchestrator-service/server.js:12724:      emphasize: ['clarity', 'compliance', 'real product fidelity'],
runtime/orchestrator-service/server.js:12881:      compliance_notes: [
runtime/orchestrator-service/server.js:13144:  const publishDir = path.join(baseDir, 'publish-packages');
runtime/orchestrator-service/server.js:13147:  const legacyPublishDir = path.join(legacyBaseDir, 'publish-packages');
runtime/orchestrator-service/server.js:13152:  ensureDir(publishDir);
runtime/orchestrator-service/server.js:13162:    publishDir,
runtime/orchestrator-service/server.js:13210:  const packageId = `publish_${Date.now()}`;
runtime/orchestrator-service/server.js:13222:    ready_for_publish: payload.assets.length > 0,
runtime/orchestrator-service/server.js:13230:    artifactType: 'campaign_publish_package',
runtime/orchestrator-service/server.js:13291:  const publishDir = resolveExecutionReadCandidate({
runtime/orchestrator-service/server.js:13294:    relativePath: 'publish-packages',
runtime/orchestrator-service/server.js:13298:    requestedFile: `campaign-finalization/publish-packages/${safeName}*`
runtime/orchestrator-service/server.js:13312:  const publishFiles = fs.existsSync(publishDir)
runtime/orchestrator-service/server.js:13313:    ? fs.readdirSync(publishDir).filter(x => x.startsWith(safeName))
runtime/orchestrator-service/server.js:13320:    publish_packages_count: publishFiles.length,
runtime/orchestrator-service/server.js:13322:    ready: mediaFiles.length > 0 || publishFiles.length > 0 || fs.existsSync(emailFile)
runtime/orchestrator-service/server.js:13400:  const inlinePackage = input.publish_package && typeof input.publish_package === 'object'
runtime/orchestrator-service/server.js:13401:    ? input.publish_package
runtime/orchestrator-service/server.js:13410:    const error = new Error('Missing publish package. Provide publish_package or campaign_name + channel');
runtime/orchestrator-service/server.js:13419:function buildSocialExecutionPayload(publishPackage) {
runtime/orchestrator-service/server.js:13420:  const assets = assertExecutionPackageAssets(publishPackage, 'publish package');
runtime/orchestrator-service/server.js:13421:  const channel = String(publishPackage.channel || '').trim().toLowerCase();
runtime/orchestrator-service/server.js:13427:    || `${String(primaryAsset.product_name || publishPackage.campaign_name || 'Campaign').trim()} update`;
runtime/orchestrator-service/server.js:13719:    domain: 'publishing',
runtime/orchestrator-service/server.js:13723:    requestedFile: `publishing/scheduler/${jobId}.json`
runtime/orchestrator-service/server.js:13741:    assertPublishingMutationAllowed(projectName, 'publish', {
runtime/orchestrator-service/server.js:13743:      status: 'published'
runtime/orchestrator-service/server.js:13762:    external_publish: normalizedMode !== 'semi_auto',
runtime/orchestrator-service/server.js:13772:      result.execution_status = 'ready_for_manual_publish';
runtime/orchestrator-service/server.js:13773:      result.action_type = 'manual_publish';
runtime/orchestrator-service/server.js:13774:      result.notes.push('Social payload is ready for operator-controlled publishing.');
runtime/orchestrator-service/server.js:13790:      result.execution_status = 'auto_publish_pending';
runtime/orchestrator-service/server.js:13791:      result.action_type = 'auto_publish';
runtime/orchestrator-service/server.js:13792:      result.notes.push('Full-auto mode enabled. Social publish adapter should consume this.');

## Cross-page governance references
public/control-center/pages/publishing.js:9:  const approval = selectedItem?.approvalStatus ? titleCase(selectedItem.approvalStatus) : "Draft";
public/control-center/pages/publishing.js:11:  const safety = `Publishing prepares channel packages, manual schedule records, and approval-ready handoffs. External publishing requires provider proof; backend status changes remain <strong>confirmation-gated</strong> and governed by <strong>backend approval rules</strong>.`;
public/control-center/pages/publishing.js:15:    `<button type="button" class="btn btn-secondary" onclick="document.getElementById('publishingHandoffPanel')?.scrollIntoView({behavior:'smooth',block:'start'})">Review Approval Gate</button>`,
public/control-center/pages/publishing.js:22:      <div class="publishing-command-header-status">Status: <strong>${escapeHtml(status)}</strong> &middot; Approval: <strong>${escapeHtml(approval)}</strong></div>
public/control-center/pages/publishing.js:30:function renderPublishingWorkflowStrip({ selectedItem, recommendation, blockers, approvalState, escapeHtml }) {
public/control-center/pages/publishing.js:35:    { key: "approval", label: "Approval" },
public/control-center/pages/publishing.js:43:    approval: selectedItem?.approvalStatus === "approved" ? "ready" : selectedItem?.approvalStatus === "needs approval" ? "warning" : "missing",
public/control-center/pages/publishing.js:66:    { key: "governance", label: "Governance", state: selectedItem?.governanceStatus === "approved" ? "ready" : "missing" },
public/control-center/pages/publishing.js:67:    { key: "approval", label: "Approval", state: selectedItem?.approvalStatus === "approved" ? "ready" : selectedItem?.approvalStatus === "needs approval" ? "warning" : "missing" }
public/control-center/pages/publishing.js:106:const STATUS_FILTERS = ["all", "draft", "ready", "needs approval", "scheduled", "published", "failed"];
public/control-center/pages/publishing.js:107:const DISPLAY_STATUSES = ["draft", "ready", "needs approval", "scheduled", "published", "failed"];
public/control-center/pages/publishing.js:109:const APPROVAL_STATUSES = ["draft", "needs approval", "approved"];
public/control-center/pages/publishing.js:272:  if (["ready", "approved", "ready_for_manual_publish", "ready_for_manual_send"].includes(normalized)) return "ready";
public/control-center/pages/publishing.js:273:  if (["needs approval", "needs_approval", "approval", "pending_approval", "review", "in_review"].includes(normalized)) {
public/control-center/pages/publishing.js:274:    return "needs approval";
public/control-center/pages/publishing.js:357:    approvalStatus: "draft",
public/control-center/pages/publishing.js:418:    approvalStatus: status === "ready" ? "approved" : status === "needs approval" ? "needs approval" : "draft",
public/control-center/pages/publishing.js:473:    "needs approval": 2,
public/control-center/pages/publishing.js:531:    approvalStatus: item.approvalStatus || "draft",
public/control-center/pages/publishing.js:591:        reason: "This records a manual publishing completion only after review; external provider execution requires separate proof."
public/control-center/pages/publishing.js:609:  if (intent === "publish" && form.approvalStatus !== "approved") {
public/control-center/pages/publishing.js:610:    errors.approvalStatus = "Publishing readiness must be approved before recording manual completion.";
public/control-center/pages/publishing.js:647:  // Add governance/approval hints for status pills
public/control-center/pages/publishing.js:649:  if (status === "needs approval") {
public/control-center/pages/publishing.js:650:    hint = "title=\"Request Approval Review. Confirmation required before execution.\" aria-label=\"Request Approval Review. Confirmation required before execution.\"";
public/control-center/pages/publishing.js:652:    hint = "title=\"Prepare Governance Review. Backend approval rules apply.\" aria-label=\"Prepare Governance Review. Backend approval rules apply.\"";
public/control-center/pages/publishing.js:970:  const needsApproval = queue.find((item) => item.status === "needs approval");
public/control-center/pages/publishing.js:986:      why: `${ready.title} is approved for a backend readiness update. Record manual completion only after external execution is verified.`,
public/control-center/pages/publishing.js:990:  if (needsApproval) {
public/control-center/pages/publishing.js:992:      action: "Review approval queue",
public/control-center/pages/publishing.js:993:      why: `${needsApproval.title} needs approval before it can move into the manual publishing queue.`,
public/control-center/pages/publishing.js:994:      focusId: needsApproval.id,
public/control-center/pages/publishing.js:1009:      why: `${draft.title} is not yet executable. Add channel, content, approval, and timing details.`,
public/control-center/pages/publishing.js:1051:    ["Approval", counts["needs approval"] ? "Pending" : counts.ready ? "Approved" : "Draft"],
public/control-center/pages/publishing.js:1082:        <div class="publishing-automation-preview-copy">Automation cannot publish without manual review, confirmation, and backend approval gates.</div>
public/control-center/pages/publishing.js:1089:        ${getAutoModeState().status === "waiting_approval" ? `
public/control-center/pages/publishing.js:1090:          <div class="simple-banner publishing-inline-gap"><strong>Approval needed:</strong> ${escapeHtml(asObject(getAutoModeState().approvalRequiredStep).reason || "Manual approval required.")}</div>
public/control-center/pages/publishing.js:1097:      <div class="simple-banner">Opens AI with this context only. <strong>No approval, publishing, or backend execution is performed.</strong></div>
public/control-center/pages/publishing.js:1229:              <label class="setup-label" for="publishingApprovalInput">Approval status</label>
public/control-center/pages/publishing.js:1232:            <select id="publishingApprovalInput" name="approvalStatus" class="setup-input">
public/control-center/pages/publishing.js:1233:              ${APPROVAL_STATUSES.map((status) => `
public/control-center/pages/publishing.js:1234:                <option value="${escapeHtml(status)}"${status === session.form.approvalStatus ? " selected" : ""}>${escapeHtml(titleCase(status))}</option>
public/control-center/pages/publishing.js:1237:            ${fieldError(session, "approvalStatus", escapeHtml)}
public/control-center/pages/publishing.js:1254:          <textarea id="publishingNotesInput" name="notes" class="setup-input setup-textarea" rows="4" placeholder="Approval notes, blockers, manual steps, content references">${escapeHtml(session.form.notes)}</textarea>
public/control-center/pages/publishing.js:1430:          <div class="setup-kicker">Channel & Approval Readiness</div>
public/control-center/pages/publishing.js:1601:          ? "Confirm reschedule\n\nAction: Reschedule this publishing item.\n\nThis updates a backend publishing schedule and remains governed by approval rules.\n\nSelect Cancel to keep the current schedule."
public/control-center/pages/publishing.js:1602:          : "Confirm schedule\n\nAction: Queue this publishing item for manual publishing.\n\nThis creates a backend publishing schedule and remains governed by approval rules.\n\nSelect Cancel to keep this as a draft."
public/control-center/pages/publishing.js:1674:          "Final Confirmation Required\n\nAction: Record manual publish completion for this backend job.\n\nThis is a high-risk status update. Confirm that external provider publishing was completed or verified outside this page before recording completion.\n\nThis does not prove live external publishing by itself. Backend approval rules still apply.\n\nSelect Cancel to keep this item in the queue."
public/control-center/pages/publishing.js:1696:          { projectName, reloadProjectData, showMessage, showError, successMessage: "Publishing item paused as a draft.\n\nConfirmation required before execution. Backend approval rules apply." }
public/control-center/pages/publishing.js:1706:          "Confirm retry\n\nAction: Retry this backend publishing item in the scheduled queue.\n\nThis updates the backend publishing schedule/lifecycle state and remains governed by approval rules.\n\nSelect Cancel to keep the item unchanged."
public/control-center/pages/publishing.js:1715:          { projectName, reloadProjectData, showMessage, showError, successMessage: "Publishing item retried in the scheduled queue.\n\nConfirmation required before execution. Backend approval rules apply." }
public/control-center/pages/publishing.js:1727:        session.validation.contentItem = "Select or save a publishing draft before approval.";
public/control-center/pages/publishing.js:1731:      session.form.approvalStatus = "approved";
public/control-center/pages/publishing.js:1733:        updateLocalDraft(projectName, current.id, { ...buildLocalDraftPayload(session, "ready"), id: current.id, approvalStatus: "approved" });
public/control-center/pages/publishing.js:1734:        showMessage?.("Local publishing draft approved.");
public/control-center/pages/publishing.js:1740:        "Confirm publishing readiness\n\nAction: Mark this backend publishing item ready for manual publishing review.\n\nThis does not replace Governance approval or external provider readiness proof.\n\nSelect Cancel to keep the item unchanged."
public/control-center/pages/publishing.js:1771:      const confirmed = window.confirm("Confirm fail action\n\nAction: Mark this publishing item as failed.\nRisk: This creates a permanent failure record and stops the publishing lifecycle for this item.\nPolicy: Use only when this item cannot proceed and requires explicit failure logging.\n\nSelect Cancel to keep this item in its current state.");
public/control-center/pages/publishing.js:1867:        mode: "auto_until_approval",
public/control-center/pages/publishing.js:1895:      showMessage?.("Approval gate accepted.");
public/control-center/pages/publishing.js:1970:      ${renderPublishingWorkflowStrip({ selectedItem, recommendation, blockers: assetBlockers, approvalState: selectedItem?.approvalStatus, escapeHtml })}
public/control-center/pages/publishing.js:1989:                <button id="publishingApproveBtn" class="btn btn-secondary" type="button" title="Prepare publishing readiness review. Confirmation required. Backend approval rules apply.">Mark ready for manual review</button>
public/control-center/pages/publishing.js:1990:                <button id="publishingFailBtn" class="btn btn-secondary" type="button" title="Request Approval Review or mark as failed. Confirmation required before execution.">Mark publishing item as failed</button>
public/control-center/pages/library.js:125:    why: "Approved product and packaging visuals are required for high-trust creative production.",
public/control-center/pages/library.js:146:    why: "Research and proof documents support claims, trust signals, and strategy decisions.",
public/control-center/pages/library.js:624:  if (normalized.includes("approved")) return "approved";
public/control-center/pages/library.js:638:  if (value === "approved") return "Approved";
public/control-center/pages/library.js:702:      merged.approval_status ||
public/control-center/pages/library.js:826:    approval_status: asString(asset.approval_status || "draft"),
public/control-center/pages/library.js:891:  const approvedAssets = assets.filter((asset) => asset.status === "approved").length;
public/control-center/pages/library.js:900:    approvedAssets,
public/control-center/pages/library.js:908:      : "Required assets are covered. Continue with classification and approvals."
public/control-center/pages/library.js:928:      status = "Approved";
public/control-center/pages/library.js:950:    if (entries.length && statuses.every((value) => value === "approved")) {
public/control-center/pages/library.js:954:    } else if (entries.length && statuses.some((value) => value === "approved")) {
public/control-center/pages/library.js:1605:        <strong>Library is the source-of-truth workspace for assets, documents, brand files, product files, proof/legal files, and AI source context.</strong>
public/control-center/pages/library.js:1609:          <li>Use selected assets in AI Team, Content, Media, Publishing, Governance, and Insights.</li>
public/control-center/pages/library.js:1625:        <span class="taxonomy-chip" tabindex="0">Proof / Legal / Pricing</span>
public/control-center/pages/library.js:2359:      const confirmed = status === "approved" ? true : confirm(`Confirm asset status change\n\nAction: Set asset status to "${status}".\nRisk: This updates Library readiness metadata and may affect downstream review/publishing visibility. It does not publish anything.\n\nSelect Cancel to keep the current status.`);
public/control-center/pages/library.js:3009:                ${escapeHtml(`${formatCount(overview.totalAssets || 0)} assets · ${formatCount(overview.sourceOfTruthAssets || 0)} source-of-truth · ${formatCount(overview.needsReviewAssets || 0)} need review · ${formatCount(overview.approvedAssets || 0)} approved · ${String(overview.sourceCoverage || 0)}% source coverage`)}
public/control-center/pages/library.js:3020:            <p class="card-subtitle">Shows evidence and media gaps needed for complete project readiness. This does not approve or publish assets.</p>
public/control-center/pages/library.js:3029:            <p class="card-subtitle">Upload or register asset candidates. Approval, source-of-truth status, and publishing readiness remain separate steps.</p>
public/control-center/pages/library.js:3097:                    <option value="approved">Approved</option>
public/control-center/pages/library.js:3135:                    <p class="card-subtitle">Preview selected evidence or media. Protected files are loaded through the protected media endpoint.</p>
public/control-center/pages/ai-command.js:87:                summary: "Claims review, approvals, safety language, and governance checks.",
public/control-center/pages/ai-command.js:88:                routeHint: "governance"
public/control-center/pages/ai-command.js:94:                summary: "Tasks, timelines, handoffs, approvals, and execution plans.",
public/control-center/pages/ai-command.js:189:		safetyNote: "Scripts and direction only. Video generation requires explicit backend action and approval.",
public/control-center/pages/ai-command.js:200:		cannotDo: ["Publish without explicit approval", "Override schedules", "Bypass governance gates", "Send to live channels directly"],
public/control-center/pages/ai-command.js:202:		safetyNote: "Publishing always requires explicit approval. No live publishing from AI guidance alone.",
public/control-center/pages/ai-command.js:215:		safetyNote: "Ad concepts and copy only. Live ad actions require platform integration and explicit approval.",
public/control-center/pages/ai-command.js:234:		position: "Claims and Governance Lead",
public/control-center/pages/ai-command.js:236:		summary: "Claims review, approval safety, publishing risk, and governance notes.",
public/control-center/pages/ai-command.js:237:		placeholder: "Ask the Compliance Reviewer to check claims, approval risks, publishing safety, and governance notes…",
public/control-center/pages/ai-command.js:238:		canHelp: ["Review marketing claims", "Flag approval risks", "Check publishing safety", "Prepare governance notes", "Identify compliance blockers"],
public/control-center/pages/ai-command.js:239:		cannotDo: ["Grant approvals directly", "Override governance gates", "Publish on behalf of approvers", "Remove flags without review"],
public/control-center/pages/ai-command.js:240:		destinations: ["Workflows", "Publishing", "Governance"],
public/control-center/pages/ai-command.js:241:		safetyNote: "Compliance review is advisory. Approvals always require human confirmation before execution.",
public/control-center/pages/ai-command.js:249:		summary: "Tasks, timelines, handoffs, approvals, and execution plans.",
public/control-center/pages/ai-command.js:265:		cannotDo: ["Send customer replies", "Create live tickets", "Change SLA policy", "Escalate without confirmation"],
public/control-center/pages/ai-command.js:330:		{ label: "Check claims for approval", sub: "Review all marketing claims" },
public/control-center/pages/ai-command.js:332:		{ label: "Prepare governance notes", sub: "Document compliance status" },
public/control-center/pages/ai-command.js:333:		{ label: "Review approval requirements", sub: "What needs sign-off" }
public/control-center/pages/ai-command.js:407:		label: "Admin / Governance",
public/control-center/pages/ai-command.js:410:		summary: "Policy, approvals, roles, and audit controls stay destination-owned."
public/control-center/pages/ai-command.js:416:		summary: "Market, evidence, competitor, and proof research will prepare source packs only."
public/control-center/pages/ai-command.js:455:		{ id: "final-packaging", label: "Final Packaging", action: "preview", intent: "handoff", template: "Prepare a final publishing package for {project}. Include copy, CTA, asset notes, approvals, and destination channel." },
public/control-center/pages/ai-command.js:475:		{ id: "claims-check", label: "Claims Check", action: "preview", intent: "guidance", template: "Review marketing claims for {project}. Flag unsupported, high-risk, or evidence-dependent wording." },
public/control-center/pages/ai-command.js:476:		{ id: "approval-flags", label: "Approval Flags", action: "preview", intent: "task", template: "Check approval risks for {project}. List risk, impact, mitigation, and required owner." },
public/control-center/pages/ai-command.js:477:		{ id: "safety-checklist", label: "Safety Checklist", action: "preview", intent: "handoff", template: "Prepare a safety checklist for {project}. Include policy checks, evidence required, and approval notes." },
public/control-center/pages/ai-command.js:478:		{ id: "publish-readiness", label: "Publish Readiness", action: "preview", intent: "handoff", template: "Review publish readiness for {project}. Confirm what needs human approval before release." },
public/control-center/pages/ai-command.js:479:		{ id: "open-governance", label: "Open Governance", action: "route", route: "governance" }
public/control-center/pages/ai-command.js:492:		{ id: "create-ticket-draft", label: "Create Ticket Draft", action: "preview", intent: "task", template: "Create a ticket draft for {project}. Include issue, priority, owner suggestion, evidence needed, and next safe action." },
public/control-center/pages/ai-command.js:504:		{ id: "dealer-salon-outreach", label: "Dealer / Salon Outreach", action: "preview", intent: "guidance", template: "Draft dealer or salon outreach for {project}. Include positioning, proof needs, offer angle, CTA, and follow-up note." },
public/control-center/pages/ai-command.js:588:		bestUse: "When you need evidence-backed recommendations.",
public/control-center/pages/ai-command.js:595:		bestUse: "When strategy needs stronger external evidence.",
public/control-center/pages/ai-command.js:674:	if (/publish\s*now|send\s*external|paid\s*ads|final\s*approval/i.test(command)) {
public/control-center/pages/ai-command.js:682:				reason: "Requires approval gate before external publishing actions."
public/control-center/pages/ai-command.js:1212:		"Never claim publish, approval, deletion, archival, sync, or operational runs happened.",
public/control-center/pages/ai-command.js:1269:	if (id === "compliance_reviewer") return "governance";
public/control-center/pages/ai-command.js:1303:        const looksWorkflowLike = /\b(workflow|workflows|process|sequence|phase|phases|approval flow|automation|operating loop|step-by-step|steps|dependencies|trigger|review gate|execution flow)\b/.test(text);
public/control-center/pages/ai-command.js:1306:        const looksPublishingLike = /\b(publish|publishing|schedule|channel package|channel payload|approval-ready post|final post|ready to publish|publishing package)\b/.test(text);
public/control-center/pages/ai-command.js:1307:        const looksGovernanceLike = /\b(compliance|governance|claim|claims|risk|risks|approval|approvals|policy|privacy|legal|safe language|safety review)\b/.test(text);
public/control-center/pages/ai-command.js:1336:        if (/governance|compliance|risk|approval/.test(outputType) || looksGovernanceLike) {
public/control-center/pages/ai-command.js:1337:                outputType = "governance";
public/control-center/pages/ai-command.js:1338:                return { outputType, destinationRoute: explicitDestination || "governance" };
public/control-center/pages/ai-command.js:1368:		governance: "Governance",
public/control-center/pages/ai-command.js:1397:		confirmationNote: "Execution, approvals, and publishing require explicit confirmation in the owning workspace."
public/control-center/pages/ai-command.js:1435:				"Proof-led hook direction with claims marked for review"
public/control-center/pages/ai-command.js:1448:				"Claims, health, or performance promises need evidence before publishing."
public/control-center/pages/ai-command.js:1503:				"Publishing remains gated until channel, approval, and asset readiness are confirmed."
public/control-center/pages/ai-command.js:1508:				"Flag approval dependencies",
public/control-center/pages/ai-command.js:1564:				"Review key claims and evidence",
public/control-center/pages/ai-command.js:1565:				"Flag safety and policy risks",
public/control-center/pages/ai-command.js:1566:				"Prepare governance notes",
public/control-center/pages/ai-command.js:1567:				"Route to Governance for formal review"
public/control-center/pages/ai-command.js:1570:			safetyLabel: "Compliance review is advisory. Formal approval remains human-governed."
public/control-center/pages/ai-command.js:1618:				"Follow-up 2: add proof or relevant context.",
public/control-center/pages/ai-command.js:1705:			"Compliance and Publisher verify claims, approvals, formatting, and release readiness",
public/control-center/pages/ai-command.js:1712:			"Compliance: flag claims, evidence needs, policy risks, and approval gates",
public/control-center/pages/ai-command.js:1719:		confirmationNote: "No task, workflow, outreach, customer reply, CRM update, approval, or publishing action is executed from Full Team mode.",
public/control-center/pages/ai-command.js:1922:		approvedAssets: assetCategories
public/control-center/pages/ai-command.js:1923:			.filter((item) => item.status === "Approved")
public/control-center/pages/ai-command.js:1924:			.flatMap((item) => asArray(item.approved_assets).map((assetId) => ({
public/control-center/pages/ai-command.js:1969:		operations: ["task plan", "workflow", "handoff", "approval", "timeline", "execution plan", "route", "publish", "status", "priority", "priorities", "blocking", "blocker", "readiness", "next", "do next"],
public/control-center/pages/ai-command.js:2084:			routeSuggestion("Publishing", "publishing", "Schedule the next batch with stronger timing and approval control."),
public/control-center/pages/ai-command.js:2164:		title: "Research & evidence briefing",
public/control-center/pages/ai-command.js:2165:		summary: "The system has enough operating context to highlight where better evidence would improve decision quality.",
public/control-center/pages/ai-command.js:2174:			"Prioritize integrations that unlock attribution and performance evidence over vanity metrics."
public/control-center/pages/ai-command.js:2178:			"Reconnect missing analytics, SEO, and paid feeds to improve evidence quality.",
public/control-center/pages/ai-command.js:2184:			routeSuggestion("Insights", "insights", "See where evidence is strong and where it is thin.")
public/control-center/pages/ai-command.js:2200:		return { title: "Content plan task block", owner: "Content Studio", steps: ["Use the strongest content pattern as the starting template.", "Map posts by platform, hook, format, and CTA.", "Route approved items into Publishing for scheduling."] };
public/control-center/pages/ai-command.js:2203:		return { title: "Content repair task block", owner: "Content Studio", steps: ["Select the weakest items from Insights.", "Rewrite hooks, sharpen CTAs, and adjust format-platform fit.", "Republish only after updated versions are approved."] };
public/control-center/pages/ai-command.js:2354:	governance: "Governance",
public/control-center/pages/ai-command.js:2376:	governance: "compliance_reviewer",
public/control-center/pages/ai-command.js:2417:	govern: "governance",
public/control-center/pages/ai-command.js:2521:		confirmationNote: firstAiInboundText(preview.confirmationNote, preview.confirmation_note, "Execution, approvals, publishing, CRM updates, customer replies, and workflow runs require explicit confirmation in the owning workspace."),
public/control-center/pages/ai-command.js:2720:				approved_assets: aiContext.approvedAssets,
public/control-center/pages/ai-command.js:3570:	if (/review|check|compliance|readiness|governance/i.test(asString(tool.label))) return "Review";
public/control-center/pages/ai-command.js:3851:	return tool.actionType === "source_required" || /source_of_truth_assets|selected_asset|proof_doc|legal_doc|privacy_policy/i.test(sourceMeta);
public/control-center/pages/ai-command.js:4236:                                <div class="aicmd-room-planned-note">This is a review-ready preview. Execution, publishing, approvals, CRM updates, and workflow runs happen only in the destination workspace after confirmation.</div>
public/control-center/pages/ai-command.js:4247:	const approval = preview.confirmationRequired ? "Confirmation required" : (preview.outputType ? "Review ready" : "No draft yet");
public/control-center/pages/ai-command.js:4256:			<div><span>Approval</span><strong>${escapeHtml(approval)}</strong></div>
public/control-center/pages/ai-command.js:4326:                ? "Chat only. No workflow, task, handoff, approval, publish, CRM, or customer action was created."
public/control-center/pages/ai-command.js:4549:		{ label: "Approved assets", value: aiContext.approvedAssets.length ? `${aiContext.approvedAssets.length} ready` : "No approved assets", present: aiContext.approvedAssets.length > 0 },
public/control-center/pages/ai-command.js:4606:					<span>Publishing, approval, and workflow runs require your explicit confirmation in the right workspace.</span>
public/control-center/pages/ai-command.js:5116:		                                safetyInstruction: "Chat only. No task/workflow/handoff/approval/publish/customer/CRM execution.",
public/control-center/pages/integrations.js:513:        whyItMatters: "Slack can surface sync failures, content approvals, and campaign alerts where the team already works.",
public/control-center/pages/integrations.js:514:        enables: "Alerts, approvals, sync notifications, and workflow coordination.",
public/control-center/pages/integrations.js:515:        dataScope: ["Notifications", "Approvals", "Ops alerts"],
public/control-center/pages/integrations.js:529:        purpose: "Bot-based operational alerts, approvals, and lightweight workflow execution.",
public/control-center/pages/integrations.js:530:        whyItMatters: "Telegram can keep MH Assistant responsive when quick approvals or notifications are needed.",
public/control-center/pages/integrations.js:531:        enables: "Alerts, commands, approval handoff, and ops notifications.",
public/control-center/pages/integrations.js:532:        dataScope: ["Alerts", "Commands", "Approvals"],
public/control-center/pages/integrations.js:563:        purpose: "Automation routing for triggers, syncs, approvals, and external workflow handoffs.",
public/control-center/pages/integrations.js:588:          { key: "eventScope", label: "Event scope", placeholder: "events, approvals, syncs" },
public/control-center/pages/media-studio-workspace.js:3:  createProjectApproval,
public/control-center/pages/media-studio-workspace.js:6:  decideProjectApproval,
public/control-center/pages/media-studio-workspace.js:13:  listProjectApprovals,
public/control-center/pages/media-studio-workspace.js:32:const MEDIA_STATUSES = ["draft", "prompt_ready", "generating", "needs_review", "approved", "publishing_ready", "sent_to_publishing", "failed"];
public/control-center/pages/media-studio-workspace.js:33:const MEDIA_PREVIEW_STATES = ["provider_not_configured", "generation_error", "prompt_ready", "generated", "saved_to_library", "needs_review", "approved", "publishing_ready", "sent_to_publishing"];
public/control-center/pages/media-studio-workspace.js:71:    bestUse: "Before approvals and publishing handoff, especially for regulated or claim-sensitive content.",
public/control-center/pages/media-studio-workspace.js:86:    suggestedPrompt: "Act as Publishing Assistant. Produce a final publishing handoff summary with readiness status, blockers, approval notes, and channel delivery checklist."
public/control-center/pages/media-studio-workspace.js:168:  if (["needs_review", "needs review", "review", "pending_approval"].includes(normalized)) return "needs_review";
public/control-center/pages/media-studio-workspace.js:169:  if (["approved", "complete", "completed"].includes(normalized)) return "approved";
public/control-center/pages/media-studio-workspace.js:177:  if (status === "approved" || status === "publishing_ready" || status === "sent_to_publishing") return "success";
public/control-center/pages/media-studio-workspace.js:470:      approvals: [],
public/control-center/pages/media-studio-workspace.js:520:    approval_state: asString(raw.approval_state || raw.approvalStatus || ""),
public/control-center/pages/media-studio-workspace.js:535:    linked_approvals: asArray(raw.linked_approvals),
public/control-center/pages/media-studio-workspace.js:559:    approved: 3,
public/control-center/pages/media-studio-workspace.js:583:      listProjectApprovals(backendProjectName, 120),
public/control-center/pages/media-studio-workspace.js:593:      approvalsResult,
public/control-center/pages/media-studio-workspace.js:605:    const approvals = fulfilledValue(approvalsResult, { items: [] });
public/control-center/pages/media-studio-workspace.js:617:    session.approvals = asArray(approvals.items);
public/control-center/pages/media-studio-workspace.js:808:  return `${base}\n\nBrand safety guardrails: use approved logo and brand cues only, preserve packaging and product truth, avoid medical or exaggerated claims, keep text legible, and respect platform content policies.`;
public/control-center/pages/media-studio-workspace.js:939:function normalizeApprovalStatus(readinessStatus) {
public/control-center/pages/media-studio-workspace.js:941:  if (["approved", "publishing_ready", "sent_to_publishing"].includes(normalized)) return "approved";
public/control-center/pages/media-studio-workspace.js:957:  if (["publishing_ready", "sent_to_publishing", "approved"].includes(normalizeStatus(readiness.readinessStatus, "draft"))) {
public/control-center/pages/media-studio-workspace.js:993:    approval_status: normalizeApprovalStatus(readiness.readinessStatus),
public/control-center/pages/media-studio-workspace.js:1179:    readyAssets: counts.approved + counts.publishing_ready + counts.sent_to_publishing,
public/control-center/pages/media-studio-workspace.js:1242:  const approvalsConnected = hasBackend || capabilityFromOperations(operations, ["approval", "approvals"]);
public/control-center/pages/media-studio-workspace.js:1249:    approval_backend: approvalsConnected,
public/control-center/pages/media-studio-workspace.js:1440:      .media-status-pill.is-approved,
public/control-center/pages/media-studio-workspace.js:1596:  if (normalized === "approved") return "Review Ready";
public/control-center/pages/media-studio-workspace.js:1668:  const packageReady = ["publishing_ready", "sent_to_publishing", "approved"].includes(readiness.readinessStatus) && hasOutput;
public/control-center/pages/media-studio-workspace.js:1669:  const needsGovernance = source.state === "missing" || /claim|proof|medical|guarantee|legal|privacy|gdpr|discount|pricing/i.test(promptText);
public/control-center/pages/media-studio-workspace.js:1707:      key: "governance",
public/control-center/pages/media-studio-workspace.js:1708:      label: "Governance",
public/control-center/pages/media-studio-workspace.js:1709:      state: needsGovernance ? "warning" : "ready",
public/control-center/pages/media-studio-workspace.js:1710:      status: needsGovernance ? "Review risk" : "No obvious risk",
public/control-center/pages/media-studio-workspace.js:1711:      detail: needsGovernance
public/control-center/pages/media-studio-workspace.js:1712:        ? "Prepare Governance Review if source, claim, legal, privacy, or pricing risk exists."
public/control-center/pages/media-studio-workspace.js:1713:        : "No obvious governance escalation signal in current prompt context."
public/control-center/pages/media-studio-workspace.js:1784:  const packageReady = ["publishing_ready", "approved", "sent_to_publishing"].includes(readiness.readinessStatus) && hasOutput;
public/control-center/pages/media-studio-workspace.js:1804:      state: ["approved", "publishing_ready", "sent_to_publishing"].includes(readiness.readinessStatus) ? "ready" : hasOutput ? "active" : "missing",
public/control-center/pages/media-studio-workspace.js:2128:  const publishingReady = ["publishing_ready", "sent_to_publishing", "approved"].includes(readinessStatus) && hasOutput;
public/control-center/pages/media-studio-workspace.js:2129:  const approvalStatus = ["approved", "publishing_ready", "sent_to_publishing"].includes(readinessStatus) ? "approved" : "pending";
public/control-center/pages/media-studio-workspace.js:2136:    ["review state", approvalStatus === "approved"]
public/control-center/pages/media-studio-workspace.js:2142:    approvalStatus,
public/control-center/pages/media-studio-workspace.js:2182:          <strong>${escapeHtml(readiness.approvalStatus === "approved" ? "Review Ready" : "Pending")}</strong>
public/control-center/pages/media-studio-workspace.js:2504:        <button id="mediaRequestApprovalBtn" class="btn btn-secondary" type="button">Request Approval</button>
public/control-center/pages/media-studio-workspace.js:2597:    ["approval backend", readiness.approval_backend]
public/control-center/pages/media-studio-workspace.js:3071:        session.form.status = "approved";
public/control-center/pages/media-studio-workspace.js:3073:        if (currentVersion) currentVersion.readiness_status = "approved";
public/control-center/pages/media-studio-workspace.js:3075:        saveDraftToSession(projectName, state, session, "approved");
public/control-center/pages/media-studio-workspace.js:3097:      session.form.status = "approved";
public/control-center/pages/media-studio-workspace.js:3100:        currentVersion.readiness_status = "approved";
public/control-center/pages/media-studio-workspace.js:3104:      saveDraftToSession(projectName, state, session, "approved");
public/control-center/pages/media-studio-workspace.js:3107:        const pendingApproval = session.approvals.find((approval) =>
public/control-center/pages/media-studio-workspace.js:3108:          asString(approval.entity_type) === "media_job" &&
public/control-center/pages/media-studio-workspace.js:3109:          asString(approval.entity_id) === asString(item.id) &&
public/control-center/pages/media-studio-workspace.js:3110:          asString(approval.status) === "pending"
public/control-center/pages/media-studio-workspace.js:3112:        if (pendingApproval) {
public/control-center/pages/media-studio-workspace.js:3114:            await decideProjectApproval(backendProjectName, pendingApproval.id, {
public/control-center/pages/media-studio-workspace.js:3115:              decision: "approved",
public/control-center/pages/media-studio-workspace.js:3127:  const requestApprovalBtn = document.getElementById("mediaRequestApprovalBtn");
public/control-center/pages/media-studio-workspace.js:3128:  if (requestApprovalBtn) {
public/control-center/pages/media-studio-workspace.js:3129:    requestApprovalBtn.onclick = async () => {
public/control-center/pages/media-studio-workspace.js:3136:          await createProjectApproval(backendProjectName, {
public/control-center/pages/media-studio-workspace.js:3175:        const pendingApproval = session.approvals.find((approval) =>
public/control-center/pages/media-studio-workspace.js:3176:          asString(approval.entity_type) === "media_job" &&
public/control-center/pages/media-studio-workspace.js:3177:          asString(approval.entity_id) === asString(item.id) &&
public/control-center/pages/media-studio-workspace.js:3178:          asString(approval.status) === "pending"
public/control-center/pages/media-studio-workspace.js:3180:        if (pendingApproval) {
public/control-center/pages/media-studio-workspace.js:3182:            await decideProjectApproval(backendProjectName, pendingApproval.id, {
public/control-center/pages/media-studio-workspace.js:3204:            description: session.form.objective || item.brief || "Review prompt, outputs, approval, and publishing readiness.",
public/control-center/pages/media-studio-workspace.js:3328:        session.form.status = "approved";
public/control-center/pages/media-studio-workspace.js:3329:        currentVersion.readiness_status = "approved";
public/control-center/pages/media-studio-workspace.js:3331:        saveDraftToSession(projectName, state, session, "approved");
public/control-center/pages/media-studio-workspace.js:3526:              <p class="media-section-copy">Start with a brief or handoff. Attach Library assets when needed. Review creative readiness and brand compliance. Save approved assets to Library or prepare handoff to Publishing/Governance. All routing is handoff/review-based and user-triggered. Media Studio does not publish, send, or approve directly.</p>
public/control-center/pages/media-studio-workspace.js:3592:        .filter((item) => ["brand", "governance"].includes(item.key));
public/control-center/pages/media-studio-workspace.js:3598:              <h3>Brand and governance</h3>
public/control-center/pages/media-studio-workspace.js:3610:          <div class="media-hint media-readiness-hint" aria-label="Governance review guidance">Prepare Governance Review if any risk or compliance concern exists.</div>
public/control-center/pages/media-studio-workspace.js:3622:        ${session.loading ? `<div class="empty-box">Loading media jobs, handoffs, approvals, tasks, and event history...</div>` : ""}

# PHASE 3W.3 — Governance Copy Target Markers

## Candidate risky copy strings
110:      <div class="governance-evidence-guidance">High-risk governance decisions should reference source-of-truth evidence, proof assets, or an incoming handoff. Missing evidence should be resolved before approval or override.</div>
188:    return "Submit Approval Decision? This records a governance decision and may affect downstream readiness. It does not publish or execute directly.";
191:  if (["override", "overridden"].includes(normalized)) {
192:    return "Record Override Decision? This is a high-risk governance action. Backend authority rules remain active, but this can unblock downstream operations. Continue only after verifying source, risk, and owner.";
238:      allow_admin_override: true,
248:      overrides: "Admin"
384:        <button class="btn btn-primary" type="button" data-governance-decision="approved" data-approval-id="${escapeHtml(item.id)}">Submit Approval Decision</button>
385:        <button class="btn btn-secondary" type="button" data-governance-decision="rejected" data-approval-id="${escapeHtml(item.id)}">Submit Rejection Decision</button>
386:        <button class="btn btn-secondary" type="button" data-governance-decision="changes_requested" data-approval-id="${escapeHtml(item.id)}">Request Changes Review</button>
387:        <button class="btn btn-secondary" type="button" data-governance-decision="escalated" data-approval-id="${escapeHtml(item.id)}">Escalate Review</button>
388:        <button class="btn btn-secondary" type="button" data-governance-decision="overridden" data-approval-id="${escapeHtml(item.id)}">Record Override Decision</button>
442:            Request Approval Review
479:        <span class="settings-field-label">Approval before publish</span>
498:      <label class="settings-toggle" for="governance-admin-override">
499:        <span class="settings-field-label">Allow admin override</span>
500:        <input id="governance-admin-override" type="checkbox" class="settings-toggle-input" data-governance-policy="allow_admin_override" ${rules.allow_admin_override ? "checked" : ""} />
504:        <span class="settings-field-label">Freeze publishing</span>
751:            <div class="empty-box">Select a project to review approvals, policy violations, overrides, and audit history.</div>
901:              <small class="mhos-executive-metric-note governance-ai-boundary-note">AI cannot approve. Human approval required.</small>
939:              <h4>Safe execution path</h4>
1206:              <div class="simple-banner"><strong>Authority boundary:</strong> Governance records reviewed decisions and policy gates. It does not publish, send, or execute directly. High-risk decisions require confirmation and backend authority remains enforced.</div>
1207:              <div class="simple-banner"><strong>Safe execution path:</strong> Review selected context, add rationale, submit one reviewed governance decision, then refresh and validate queue impact.</div>
1211:                <button class="btn btn-primary" type="button" data-governance-action="save-policy">Save Governance Policy</button>
1212:                <button class="btn btn-secondary" type="button" data-governance-action="sync-settings"${Object.keys(settingsDraft).length ? "" : " disabled"}>Review & Sync Settings Rules</button>
1216:                      <button class="btn btn-primary" type="button" data-governance-decision="approved" data-approval-id="${escapeHtml(selectedItem.id)}">Submit Approval Decision</button>
1217:                      <button class="btn btn-secondary" type="button" data-governance-decision="rejected" data-approval-id="${escapeHtml(selectedItem.id)}">Submit Rejection Decision</button>
1218:                      <button class="btn btn-secondary" type="button" data-governance-decision="changes_requested" data-approval-id="${escapeHtml(selectedItem.id)}">Request Changes Review</button>
1219:                      <button class="btn btn-secondary" type="button" data-governance-decision="escalated" data-approval-id="${escapeHtml(selectedItem.id)}">Escalate Review</button>
1220:                      <button class="btn btn-secondary" type="button" data-governance-decision="overridden" data-approval-id="${escapeHtml(selectedItem.id)}">Record Override Decision</button>
1237:                        Request Approval Review
1245:                  <h4>Active overrides</h4>
1247:                    ${asArray(sections.override_controls?.active_overrides).length
1248:                      ? asArray(sections.override_controls.active_overrides).slice(0, 4).map((item) => `
1250:                          <strong>${escapeHtml(`${titleCase(item.action || "override")} • ${item.entity_type || "entity"}`)}</strong>
1254:                      : `<div class="empty-box">No active overrides are currently open.</div>`}
1395:        const confirmed = window.confirm("Confirm governance policy save\n\nAction: Save governance policy rules for this project.\nRisk: These rules can affect approvals, publishing readiness, brand safety review, and admin override behavior.\nAuthority: This is a backend-governed durable policy update.\n\nSelect Cancel to review the policy settings before saving.");
1406:          context.showMessage("Governance policy saved.");
1421:        const confirmed = window.confirm("Sync Settings Rules to Governance Policy? This updates enforceable governance rules including approval-before-publish, claim review, escalation, owners, and policy behavior. Continue only if these settings are reviewed.");
1466:    description: "Review approvals, policy violations, overrides, escalation, and audit visibility across content, media, campaigns, and publishing."

## Relevant rendering ranges

### Confirmation messages
  if (normalized === "approved" || normalized === "success") return "success";
  return "neutral";
}

function getDecisionConfirmationMessage(decision) {
  const normalized = asString(decision).toLowerCase().replace(/\s+/g, "_");

  if (["approval", "approved", "approve"].includes(normalized)) {
    return "Submit Approval Decision? This records a governance decision and may affect downstream readiness. It does not publish or execute directly.";
  }

  if (["override", "overridden"].includes(normalized)) {
    return "Record Override Decision? This is a high-risk governance action. Backend authority rules remain active, but this can unblock downstream operations. Continue only after verifying source, risk, and owner.";
  }

  if (["reject", "rejected", "changes_requested", "request_changes", "escalated", "escalate"].includes(normalized)) {
    return "Submit Governance Decision? This records the reviewed decision and may update linked queues or review state.";
  }

  return "Submit Governance Decision? This records the reviewed decision and may update linked queues or review state.";
}

function confirmGovernanceDecision(decision) {
  if (typeof window === "undefined" || typeof window.confirm !== "function") return true;
  return window.confirm(getDecisionConfirmationMessage(decision));
}

function ensureSession(projectName) {
  const key = projectName || "__default__";
  if (!governanceSessions.has(key)) {
    governanceSessions.set(key, {

### Approval cards
    <article class="governance-card">
      <div class="governance-card-head">
        <div>
          <div class="panel-kicker">${escapeHtml(titleCase(item.entity_type || "approval"))}</div>
          <h4>${escapeHtml(item.title || "Approval item")}</h4>
        </div>
        <span class="card-badge ${severityClass(item.risk_level || item.status)}">${escapeHtml(titleCase(item.status || item.risk_level || "pending"))}</span>
      </div>
      <div class="governance-meta">
        <span>Risk: ${escapeHtml(titleCase(item.risk_level || "medium"))}</span>
        <span>Reviewer: ${escapeHtml(item.reviewer || "Operator")}</span>
        <span>Requested by: ${escapeHtml(item.requested_by || "MH Assistant")}</span>
        <span>Created: ${escapeHtml(formatDateTime(item.created_at))}</span>
      </div>
      <p class="governance-copy">${escapeHtml(item.summary || "Awaiting review and decision.")}</p>
      ${renderFlagList(flags, "No extra policy flags were attached to this approval.", escapeHtml)}
      <textarea id="${escapeHtml(noteId)}" class="setup-input setup-textarea governance-note" rows="3" placeholder="Add a decision reason, change request, or escalation note.">${escapeHtml(item.decision_note || "")}</textarea>
      <div class="governance-actions">
        <button class="btn btn-primary" type="button" data-governance-decision="approved" data-approval-id="${escapeHtml(item.id)}">Submit Approval Decision</button>
        <button class="btn btn-secondary" type="button" data-governance-decision="rejected" data-approval-id="${escapeHtml(item.id)}">Submit Rejection Decision</button>
        <button class="btn btn-secondary" type="button" data-governance-decision="changes_requested" data-approval-id="${escapeHtml(item.id)}">Request Changes Review</button>
        <button class="btn btn-secondary" type="button" data-governance-decision="escalated" data-approval-id="${escapeHtml(item.id)}">Escalate Review</button>
        <button class="btn btn-secondary" type="button" data-governance-decision="overridden" data-approval-id="${escapeHtml(item.id)}">Record Override Decision</button>
      </div>
      ${history.length ? `

### Review card request approval
      </div>
      <div class="governance-meta">
        <span>Status: ${escapeHtml(titleCase(item.status || "open"))}</span>
        <span>ID: ${escapeHtml(item.entity_id || item.id)}</span>
      </div>
      ${renderFlagList(flags, "No issues detected.", escapeHtml)}
      ${approval ? `
        <div class="simple-banner">
          <strong>Linked approval:</strong> ${escapeHtml(approval.title || approval.id)} • ${escapeHtml(titleCase(approval.status))}
        </div>
      ` : `
        <div class="governance-actions">
          <button
            class="btn btn-secondary"
            type="button"
            data-governance-request-approval="true"
            data-entity-type="${escapeHtml(item.entity_type || "content_item")}"
            data-entity-id="${escapeHtml(item.entity_id || item.id)}"
            data-title="${escapeHtml(item.title || "Governance review")}"
            data-risk="${escapeHtml(flags[0]?.severity || "medium")}"
            data-summary="${escapeHtml(flags.map((flag) => flag.message).join(" | ") || "Governance review requested.")}"

### Policy controls
  const policy = asObject(summary?.policy);
  const rules = asObject(policy.policy_rules);
  const owners = asObject(policy.approval_owners);

  return `
    <div class="governance-policy-grid">
      <label class="settings-toggle" for="governance-approval-before-publish">
        <span class="settings-field-label">Approval before publish</span>
        <input id="governance-approval-before-publish" type="checkbox" class="settings-toggle-input" data-governance-policy="approval_before_publish" ${rules.approval_before_publish ? "checked" : ""} />
        <span class="settings-toggle-pill" aria-hidden="true"></span>
      </label>
      <label class="settings-toggle" for="governance-claim-review">
        <span class="settings-field-label">Claim review required</span>
        <input id="governance-claim-review" type="checkbox" class="settings-toggle-input" data-governance-policy="high_risk_claim_review_required" ${rules.high_risk_claim_review_required ? "checked" : ""} />
        <span class="settings-toggle-pill" aria-hidden="true"></span>
      </label>
      <label class="settings-toggle" for="governance-brand-safety">
        <span class="settings-field-label">Brand safety review required</span>
        <input id="governance-brand-safety" type="checkbox" class="settings-toggle-input" data-governance-policy="brand_safety_review_required" ${rules.brand_safety_review_required ? "checked" : ""} />
        <span class="settings-toggle-pill" aria-hidden="true"></span>
      </label>
      <label class="settings-toggle" for="governance-auto-escalate">
        <span class="settings-field-label">Auto-escalate critical risk</span>
        <input id="governance-auto-escalate" type="checkbox" class="settings-toggle-input" data-governance-policy="auto_escalate_critical_risk" ${rules.auto_escalate_critical_risk ? "checked" : ""} />
        <span class="settings-toggle-pill" aria-hidden="true"></span>
      </label>
      <label class="settings-toggle" for="governance-admin-override">
        <span class="settings-field-label">Allow admin override</span>
        <input id="governance-admin-override" type="checkbox" class="settings-toggle-input" data-governance-policy="allow_admin_override" ${rules.allow_admin_override ? "checked" : ""} />
        <span class="settings-toggle-pill" aria-hidden="true"></span>
      </label>
      <label class="settings-toggle" for="governance-freeze-publishing">
        <span class="settings-field-label">Freeze publishing</span>
        <input id="governance-freeze-publishing" type="checkbox" class="settings-toggle-input" data-governance-policy="freeze_publishing" ${rules.freeze_publishing ? "checked" : ""} />
        <span class="settings-toggle-pill" aria-hidden="true"></span>

### Executive authority band
    <section class="page is-active" data-page="governance">
      <div class="governance-shell governance-workspace mhos-clean-root mhos-clean-shell">
        <section class="panel mhos-executive-surface mhos-context-ribbon governance-operating-header" aria-label="Executive governance command band">
          <div class="panel-header mhos-context-main governance-operating-header-main">
            <div>
              <div class="panel-kicker mhos-context-kicker governance-operating-eyebrow">Governance Operating Surface</div>
              <h3 class="mhos-context-title governance-operating-title">Governance Command Center for ${escapeHtml(projectName)}</h3>
              <p class="mhos-context-description governance-operating-desc">Canonical executive surface for policy authority, approval pressure, escalation, and safe decision routing.</p>
            </div>
            <span class="card-badge neutral governance-operating-status">${escapeHtml(session.loading ? "Refreshing" : "Active")}</span>
          </div>

          <div class="mhos-executive-summary-grid governance-executive-summary-grid" aria-label="Governance executive anchors">
            <article class="mhos-executive-summary-item governance-summary-readiness">
              <span class="mhos-executive-metric-label">Readiness</span>
              <strong class="mhos-executive-metric-value">${escapeHtml(readiness.state)}</strong>
              <small class="mhos-executive-metric-note">${escapeHtml(`${readiness.totalQueue} open decision${readiness.totalQueue === 1 ? "" : "s"}`)}</small>
            </article>
            <article class="mhos-executive-summary-item governance-summary-approval">
              <span class="mhos-executive-metric-label">Approval Pressure</span>
              <strong class="mhos-executive-metric-value">${escapeHtml(asString(readiness.approvals))}</strong>
              <small class="mhos-executive-metric-note">${escapeHtml(readiness.approvals ? "Awaiting governed decision" : "No approval queue pressure")}</small>
            </article>
            <article class="mhos-executive-summary-item governance-summary-escalation">
              <span class="mhos-executive-metric-label">Escalation State</span>
              <strong class="mhos-executive-metric-value">${escapeHtml(readiness.escalations ? `${readiness.escalations} active` : "Clear")}</strong>
              <small class="mhos-executive-metric-note">${escapeHtml(escalationRoute)}</small>
            </article>
            <article class="mhos-executive-summary-item governance-summary-owner">
              <span class="mhos-executive-metric-label">Authority Owner</span>
              <strong class="mhos-executive-metric-value">${escapeHtml(authorityOwner)}</strong>
              <small class="mhos-executive-metric-note">${escapeHtml(selectedDecisionKind)} focus</small>
            </article>
            <article class="mhos-executive-summary-item governance-summary-risk">
              <span class="mhos-executive-metric-label">Highest Risk</span>
              <strong class="mhos-executive-metric-value">${escapeHtml(highestRiskLabel)}</strong>
              <small class="mhos-executive-metric-note">${escapeHtml(selectedDecisionLabel)}</small>
            </article>
            <article class="mhos-executive-summary-item governance-summary-ai-boundary">
              <span class="mhos-executive-metric-label">AI Role</span>
              <strong class="mhos-executive-metric-value governance-ai-boundary">Prepare / Review / Summarize Only</strong>
              <small class="mhos-executive-metric-note governance-ai-boundary-note">AI cannot approve. Human approval required.</small>
            </article>
          </div>

          <div class="governance-policy-summary-grid">
            <div class="governance-policy-block mhos-executive-panel">
              <h4>Next best governance action</h4>
              <p class="governance-copy mhos-executive-guidance">${escapeHtml(readiness.nextBestAction)}</p>

### Governance actions panel
            <div class="panel-header">
              <div>
                <div class="panel-kicker">Governance actions</div>
                <h3>Review, decide, and maintain policy controls</h3>
                <p>Backend-authoritative decisions only. Approval actions appear only for real queued approvals.</p>
              </div>
            </div>
            <div class="governance-action-stack">
              <div class="simple-banner"><strong>Authority boundary:</strong> Governance records reviewed decisions and policy gates. It does not publish, send, or execute directly. High-risk decisions require confirmation and backend authority remains enforced.</div>
              <div class="simple-banner"><strong>Safe execution path:</strong> Review selected context, add rationale, submit one reviewed governance decision, then refresh and validate queue impact.</div>
              <textarea id="governanceDecisionNote" class="setup-input setup-textarea governance-note" rows="4" placeholder="Add a decision reason, change request, or escalation note.">${escapeHtml(selectedItem?.decision_note || "")}</textarea>
              <div class="governance-actions std-action-row">
                <button class="btn btn-secondary" type="button" data-governance-action="refresh">Refresh</button>
                <button class="btn btn-primary" type="button" data-governance-action="save-policy">Save Governance Policy</button>
                <button class="btn btn-secondary" type="button" data-governance-action="sync-settings"${Object.keys(settingsDraft).length ? "" : " disabled"}>Review & Sync Settings Rules</button>
                ${
                  selectedItem?.queue_kind === "approval"
                    ? `
                      <button class="btn btn-primary" type="button" data-governance-decision="approved" data-approval-id="${escapeHtml(selectedItem.id)}">Submit Approval Decision</button>
                      <button class="btn btn-secondary" type="button" data-governance-decision="rejected" data-approval-id="${escapeHtml(selectedItem.id)}">Submit Rejection Decision</button>
                      <button class="btn btn-secondary" type="button" data-governance-decision="changes_requested" data-approval-id="${escapeHtml(selectedItem.id)}">Request Changes Review</button>
                      <button class="btn btn-secondary" type="button" data-governance-decision="escalated" data-approval-id="${escapeHtml(selectedItem.id)}">Escalate Review</button>
                      <button class="btn btn-secondary" type="button" data-governance-decision="overridden" data-approval-id="${escapeHtml(selectedItem.id)}">Record Override Decision</button>
                    `
                    : ""
                }
                ${
                  selectedItem && selectedItem.queue_kind !== "approval" && !selectedItem.linked_approval
                    ? `
                      <button
                        class="btn btn-secondary"
                        type="button"
                        data-governance-request-approval="true"
                        data-entity-type="${escapeHtml(selectedItem.entity_type || "content_item")}"
                        data-entity-id="${escapeHtml(selectedItem.entity_id || selectedItem.id)}"
                        data-title="${escapeHtml(selectedItem.queue_title || "Governance review")}"
                        data-risk="${escapeHtml(selectedItem.queue_risk || "medium")}"
                        data-summary="${escapeHtml(selectedItem.queue_summary || "Governance review requested.")}"
                      >
                        Request Approval Review
                      </button>

### Binding confirmation copy

  Array.from(root.querySelectorAll("[data-governance-decision]")).forEach((button) => {
    button.onclick = async () => {
      const approvalId = button.getAttribute("data-approval-id") || "";
      const decision = button.getAttribute("data-governance-decision") || "";
      const note = root.querySelector("#governanceDecisionNote")?.value?.trim() || `${titleCase(decision)} from Governance console.`;
      const escalationChain = asObject(session.summary?.review_model?.escalation_chain);
      const escalateTo = asArray(escalationChain.high)[1] || asArray(escalationChain.high)[0] || "admin";

      if (!confirmGovernanceDecision(decision)) {
        return;
      }

      try {
        await decideProjectApproval(projectName, approvalId, {
          decision,
          note,
          actor: "governance-console",
          escalate_to: escalateTo
        });
        context.showMessage(`Approval ${titleCase(decision)} for ${approvalId}.`);
        await refreshGovernance(projectName, session, rerender, context.showError);
      } catch (error) {
        context.showError(error.message || "Failed to update approval.");
      }
    };
  });

  Array.from(root.querySelectorAll("[data-governance-focus]")).forEach((button) => {
    button.onclick = () => {
      session.focus = button.getAttribute("data-governance-focus") || "all";
      rerender();
    };
  });

  Array.from(root.querySelectorAll("[data-governance-select]")).forEach((button) => {
    button.onclick = () => {
      session.selectedKey = button.getAttribute("data-governance-select") || "";
      rerender();
    };
  });

  Array.from(root.querySelectorAll("[data-governance-request-approval]")).forEach((button) => {
    button.onclick = async () => {
      try {
        const ownership = asObject(session.summary?.review_model?.ownership);
        await createProjectApproval(projectName, {
          entity_type: button.getAttribute("data-entity-type") || "content_item",
          entity_id: button.getAttribute("data-entity-id") || "",
          title: `${button.getAttribute("data-title") || "Governance item"} approval`,
          summary: button.getAttribute("data-summary") || "Governance review requested.",
          reviewer: ownership.compliance || "Compliance Reviewer",
          reviewer_role: "compliance_reviewer",
          requested_by: "governance-console",
          requested_for: ownership.compliance || "Compliance Reviewer",
          risk_level: button.getAttribute("data-risk") || "medium",
          source_page: "governance",
          route_target: "governance"
        });
        context.showMessage("Approval request added to the governance queue.");
        await refreshGovernance(projectName, session, rerender, context.showError);
      } catch (error) {
        context.showError(error.message || "Failed to request approval.");
      }
    };
  });

  Array.from(root.querySelectorAll("[data-governance-action]")).forEach((button) => {
    button.onclick = async () => {
      const action = button.getAttribute("data-governance-action");

      if (action === "refresh") {
        await refreshGovernance(projectName, session, rerender, context.showError);
        return;
      }

      if (action === "save-policy") {
        const policyRules = {};
        Array.from(root.querySelectorAll("[data-governance-policy]")).forEach((control) => {
          policyRules[control.getAttribute("data-governance-policy")] = Boolean(control.checked);
        });

        const approvalOwners = {};
        Array.from(root.querySelectorAll("[data-governance-owner]")).forEach((control) => {
          approvalOwners[control.getAttribute("data-governance-owner")] = control.value || "";
        });

        const confirmed = window.confirm("Confirm governance policy save\n\nAction: Save governance policy rules for this project.\nRisk: These rules can affect approvals, publishing readiness, brand safety review, and admin override behavior.\nAuthority: This is a backend-governed durable policy update.\n\nSelect Cancel to review the policy settings before saving.");
        if (!confirmed) {
          return;
        }

        try {
          await updateProjectGovernancePolicy(projectName, {
            actor: "governance-console",
            policy_rules: policyRules,
            approval_owners: approvalOwners
          });
          context.showMessage("Governance policy saved.");
          await refreshGovernance(projectName, session, rerender, context.showError);
        } catch (error) {
          context.showError(error.message || "Failed to save governance policy.");
        }
        return;
      }

      if (action === "sync-settings") {
        const settingsDraft = getSettingsDraftFromPolicy(session.summary);
        if (!Object.keys(settingsDraft).length) {
          context.showError("No durable Settings snapshot was found in the governance bridge for this project.");
          return;
        }

        const confirmed = window.confirm("Sync Settings Rules to Governance Policy? This updates enforceable governance rules including approval-before-publish, claim review, escalation, owners, and policy behavior. Continue only if these settings are reviewed.");
        if (!confirmed) {
          return;
        }

        try {
          await updateProjectGovernancePolicy(projectName, {
            actor: "governance-console",
            ...mapSettingsToGovernancePolicy(settingsDraft)
          });
          context.showMessage("Settings rules synced into enforceable Governance policy.");
          await refreshGovernance(projectName, session, rerender, context.showError);
        } catch (error) {
          context.showError(error.message || "Failed to sync Settings into Governance.");
        }

### AI guidance panel
        </div>

        <section class="panel std-ai-panel mhos-clean-surface mhos-executive-ai-panel">
          <div class="panel-header">
            <div>
              <div class="panel-kicker">AI preparation</div>
              <h3>Governance AI assistant</h3>
              <p>Explanation-only guidance. Decisions and policy changes stay in governed controls.</p>
            </div>
          </div>
          <div class="simple-banner"><strong>AI context scope:</strong> Policy pressure, approval readiness, ownership coverage, risk, and next governance move.</div>
          <div class="governance-ai-toolbar">
            <button class="btn btn-secondary" type="button" data-governance-open-ai>Open AI: Review in AI Workspace</button>
          </div>
          <div class="quick-actions std-quick-actions">
            ${prompts.map((item, index) => `
              <button class="quick-action-btn" type="button" data-governance-ai-prompt="${index}">
                <span class="home-action-title">${escapeHtml(item.label)}</span>
                <span class="home-action-meta">${escapeHtml(item.preview)}</span>
              </button>
            `).join("")}

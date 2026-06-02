# PHASE 3W.2 — Governance Action Handler Evidence

## Handler summary
138:  createProjectApproval,
139:  decideProjectApproval,
202:function confirmGovernanceDecision(decision) {
203:  if (typeof window === "undefined" || typeof window.confirm !== "function") return true;
204:  return window.confirm(getDecisionConfirmationMessage(decision));
384:        <button class="btn btn-primary" type="button" data-governance-decision="approved" data-approval-id="${escapeHtml(item.id)}">Submit Approval Decision</button>
385:        <button class="btn btn-secondary" type="button" data-governance-decision="rejected" data-approval-id="${escapeHtml(item.id)}">Submit Rejection Decision</button>
386:        <button class="btn btn-secondary" type="button" data-governance-decision="changes_requested" data-approval-id="${escapeHtml(item.id)}">Request Changes Review</button>
387:        <button class="btn btn-secondary" type="button" data-governance-decision="escalated" data-approval-id="${escapeHtml(item.id)}">Escalate Review</button>
388:        <button class="btn btn-secondary" type="button" data-governance-decision="overridden" data-approval-id="${escapeHtml(item.id)}">Record Override Decision</button>
435:            data-governance-request-approval="true"
922:                <button class="btn btn-secondary" type="button" data-governance-open-ai>Ask AI for Guidance</button>
954:            <button class="btn btn-secondary" type="button" data-governance-action="refresh">Refresh Governance Data</button>
955:            <button class="btn btn-secondary" type="button" data-governance-open-ai>Open AI Context</button>
1210:                <button class="btn btn-secondary" type="button" data-governance-action="refresh">Refresh</button>
1211:                <button class="btn btn-primary" type="button" data-governance-action="save-policy">Save Governance Policy</button>
1212:                <button class="btn btn-secondary" type="button" data-governance-action="sync-settings"${Object.keys(settingsDraft).length ? "" : " disabled"}>Review & Sync Settings Rules</button>
1216:                      <button class="btn btn-primary" type="button" data-governance-decision="approved" data-approval-id="${escapeHtml(selectedItem.id)}">Submit Approval Decision</button>
1217:                      <button class="btn btn-secondary" type="button" data-governance-decision="rejected" data-approval-id="${escapeHtml(selectedItem.id)}">Submit Rejection Decision</button>
1218:                      <button class="btn btn-secondary" type="button" data-governance-decision="changes_requested" data-approval-id="${escapeHtml(selectedItem.id)}">Request Changes Review</button>
1219:                      <button class="btn btn-secondary" type="button" data-governance-decision="escalated" data-approval-id="${escapeHtml(selectedItem.id)}">Escalate Review</button>
1220:                      <button class="btn btn-secondary" type="button" data-governance-decision="overridden" data-approval-id="${escapeHtml(selectedItem.id)}">Record Override Decision</button>
1230:                        data-governance-request-approval="true"
1284:            <button class="btn btn-secondary" type="button" data-governance-open-ai>Open AI: Review in AI Workspace</button>
1288:              <button class="quick-action-btn" type="button" data-governance-ai-prompt="${index}">
1309:  Array.from(root.querySelectorAll("[data-governance-decision]")).forEach((button) => {
1310:    button.onclick = async () => {
1312:      const decision = button.getAttribute("data-governance-decision") || "";
1317:      if (!confirmGovernanceDecision(decision)) {
1322:        await decideProjectApproval(projectName, approvalId, {
1337:    button.onclick = () => {
1344:    button.onclick = () => {
1350:  Array.from(root.querySelectorAll("[data-governance-request-approval]")).forEach((button) => {
1351:    button.onclick = async () => {
1354:        await createProjectApproval(projectName, {
1375:  Array.from(root.querySelectorAll("[data-governance-action]")).forEach((button) => {
1376:    button.onclick = async () => {
1377:      const action = button.getAttribute("data-governance-action");
1395:        const confirmed = window.confirm("Confirm governance policy save\n\nAction: Save governance policy rules for this project.\nRisk: These rules can affect approvals, publishing readiness, brand safety review, and admin override behavior.\nAuthority: This is a backend-governed durable policy update.\n\nSelect Cancel to review the policy settings before saving.");
1421:        const confirmed = window.confirm("Sync Settings Rules to Governance Policy? This updates enforceable governance rules including approval-before-publish, claim review, escalation, owners, and policy behavior. Continue only if these settings are reviewed.");
1440:  Array.from(root.querySelectorAll("[data-governance-open-ai]")).forEach((button) => {
1441:    button.onclick = () => {
1449:  Array.from(root.querySelectorAll("[data-governance-ai-prompt]")).forEach((button) => {
1450:    button.onclick = () => {
1451:      const prompt = prompts[Number(button.getAttribute("data-governance-ai-prompt"))];

## Key function ranges

### Confirmation and session helpers
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function severityClass(value) {
  const normalized = asString(value).toLowerCase();
  if (normalized === "critical") return "danger";
  if (normalized === "high") return "warning";
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
      loaded: false,
      loading: false,
      error: "",
      summary: null,
      focus: "all",
      selectedKey: ""
    });
  }
  return governanceSessions.get(key);
}

function getSettingsDraftFromPolicy(summary) {
  return asObject(asObject(summary?.policy).settings_bridge?.form);
}

function mapSettingsToGovernancePolicy(settings = {}) {
  const approval = asObject(settings.approval);
  const publishing = asObject(settings.publishing);
  const safety = asObject(settings.safety);
  const ai = asObject(settings.ai);

### Approval cards and actions
      `).join("")}
    </div>
  `;
}

function renderApprovalCard(item, escapeHtml) {
  const flags = [
    ...asArray(item.policy_flags),
    ...asArray(item.claim_flags),
    ...asArray(item.brand_safety_flags),
    ...asArray(item.publish_guardrails)
  ];
  const noteId = `gov-note-${item.id}`;
  const history = asArray(item.history).slice(0, 3);

  return `
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
        <div class="governance-history">
          ${history.map((entry) => `
            <div class="governance-history-item">
              <strong>${escapeHtml(titleCase(entry.action || "updated"))}</strong>
              <span>${escapeHtml(entry.actor || "MH Assistant")} • ${escapeHtml(formatDateTime(entry.at))}</span>
            </div>
          `).join("")}
        </div>
      ` : ""}
    </article>
  `;
}

function renderReviewCard(item, type, escapeHtml, approval) {
  const flags =
    type === "claim"
      ? asArray(item.claim_flags)
      : type === "brand"
        ? asArray(item.brand_safety_flags)
        : asArray(item.publish_guardrails);

  return `
    <article class="governance-card">
      <div class="governance-card-head">
        <div>
          <div class="panel-kicker">${escapeHtml(titleCase(item.entity_type || type))}</div>
          <h4>${escapeHtml(item.title || "Review item")}</h4>
        </div>
        <span class="card-badge ${approval ? "warning" : "neutral"}">${escapeHtml(approval ? "In approval queue" : "Not requested")}</span>
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

function renderPolicyControls(summary, settingsDraft, escapeHtml) {
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
      </label>
      <div class="settings-field-block">
        <label class="settings-field-label" for="governance-owner-content">Content owner</label>
        <input id="governance-owner-content" class="settings-control" type="text" data-governance-owner="content" value="${escapeHtml(owners.content || "")}" />
      </div>
      <div class="settings-field-block">
        <label class="settings-field-label" for="governance-owner-media">Media owner</label>
        <input id="governance-owner-media" class="settings-control" type="text" data-governance-owner="media" value="${escapeHtml(owners.media || "")}" />
      </div>
      <div class="settings-field-block">
        <label class="settings-field-label" for="governance-owner-publishing">Publishing owner</label>
        <input id="governance-owner-publishing" class="settings-control" type="text" data-governance-owner="publishing" value="${escapeHtml(owners.publishing || "")}" />
      </div>
    </div>
  `;
}

function savePromptToQuickCommand(context, prompt) {
  const input = context.$?.("quickCommandInput");

### Decision/action panel
                `
                : `<div class="empty-box">No governance item is selected.</div>`
            }
          </section>

          ${renderReviewOwnership(summary, escapeHtml)}

          <section class="panel std-action-panel mhos-clean-surface">
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
                    `
                    : ""

### Binding handlers
function bindGovernance(context, projectName, session) {
  const root = context.$("pageRoot");
  if (!root) return;

  const rerender = () => {
    root.innerHTML = renderPage(projectName, session, context.escapeHtml);
    bindGovernance(context, projectName, session);
  };

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
      }
    };
  });

  Array.from(root.querySelectorAll("[data-governance-open-ai]")).forEach((button) => {
    button.onclick = () => {
      context.navigateTo("ai-command");
    };
  });

  const queueItems = buildDecisionQueue(asObject(session.summary));
  const selectedItem = queueItems.find((item) => item.selected_key === session.selectedKey) || queueItems[0] || null;
  const prompts = buildGovernancePrompts(projectName, selectedItem, titleCase(session.focus || "all"));
  Array.from(root.querySelectorAll("[data-governance-ai-prompt]")).forEach((button) => {
    button.onclick = () => {
      const prompt = prompts[Number(button.getAttribute("data-governance-ai-prompt"))];
      if (!prompt) return;
      savePromptToQuickCommand(context, prompt.prompt);
      context.navigateTo("ai-command");
      context.showMessage?.("Governance prompt added to AI Command.");
    };
  });
}

export const governanceRoute = {

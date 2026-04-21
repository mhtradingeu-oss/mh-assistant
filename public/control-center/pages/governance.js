import {
  createProjectApproval,
  decideProjectApproval,
  fetchProjectGovernance,
  updateProjectGovernancePolicy
} from "../api.js";

const governanceSessions = new Map();

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asObject(value) {
  return value && typeof value === "object" ? value : {};
}

function asString(value) {
  if (value == null) return "";
  return String(value);
}

function titleCase(value) {
  return asString(value)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not recorded";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
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

function ensureSession(projectName) {
  const key = projectName || "__default__";
  if (!governanceSessions.has(key)) {
    governanceSessions.set(key, {
      loaded: false,
      loading: false,
      error: "",
      summary: null
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
  const operating = asObject(settings.operating);

  return {
    policy_rules: {
      approval_before_publish: Boolean(publishing.approvalBeforePublish),
      high_risk_claim_review_required: Boolean(safety.aiClaimCheck),
      brand_safety_review_required: true,
      allow_admin_override: true,
      auto_escalate_critical_risk: String(operating.actionPolicy || "").toLowerCase().includes("blocked"),
      freeze_publishing: false
    },
    approval_owners: {
      content: asString(approval.contentOwner) || "Marketing lead",
      media: asString(approval.mediaOwner) || "Creative lead",
      campaign: asString(approval.adsOwner) || "Operations lead",
      publishing: asString(settings.team?.publishAccess) || "Publisher",
      compliance: "Compliance Reviewer",
      overrides: "Admin"
    },
    settings_bridge: {
      source: "settings-durable-record",
      synced_at: new Date().toISOString(),
      approval_mode: asString(ai.approvalRequiredMode) || "Only high-risk",
      claim_safety_mode: asString(ai.claimSafetyMode) || "Strict evidence required",
      approval_before_publish: Boolean(publishing.approvalBeforePublish)
    }
  };
}

function findApprovalForEntity(summary, entityType, entityId) {
  return asArray(summary?.sections?.approval_queue).find((item) =>
    asString(item.entity_type) === asString(entityType) &&
    asString(item.entity_id) === asString(entityId)
  ) || null;
}

async function loadGovernance(projectName, session, rerender) {
  if (!projectName || session.loading) return;

  session.loading = true;
  session.error = "";
  rerender();

  try {
    session.summary = await fetchProjectGovernance(projectName, {
      timeline_limit: 60
    });
    session.loaded = true;
  } catch (error) {
    session.error = error.message || "Failed to load governance console.";
  } finally {
    session.loading = false;
    rerender();
  }
}

async function refreshGovernance(projectName, session, rerender, showError) {
  session.loaded = false;
  await loadGovernance(projectName, session, rerender);
  if (session.error) {
    showError?.(session.error);
  }
}

function renderMetric(label, value, helper, escapeHtml) {
  return `
    <div class="governance-metric">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(asString(value))}</strong>
      <small>${escapeHtml(helper)}</small>
    </div>
  `;
}

function renderReviewOwnership(summary, escapeHtml) {
  const reviewModel = asObject(summary?.review_model);
  const ownership = asObject(reviewModel.ownership);
  const escalationChain = asObject(reviewModel.escalation_chain);

  return `
    <article class="panel">
      <div class="panel-header"><div><div class="panel-kicker">0. Review Model</div><h3>Ownership and escalation chain</h3></div></div>
      <div class="governance-card-list">
        ${Object.entries(ownership).map(([key, value]) => `
          <div class="governance-card">
            <div class="governance-card-head">
              <div>
                <div class="panel-kicker">${escapeHtml(titleCase(key))}</div>
                <h4>${escapeHtml(asString(value) || titleCase(key))}</h4>
              </div>
              <span class="card-badge neutral">Owner</span>
            </div>
          </div>
        `).join("")}
      </div>
      <div class="workflow-history-list">
        ${Object.entries(escalationChain).map(([risk, roles]) => `
          <div class="workflow-history-item">
            <strong>${escapeHtml(titleCase(risk))}</strong>
            <span>${escapeHtml(asArray(roles).map(titleCase).join(" -> ") || "No escalation path")}</span>
          </div>
        `).join("")}
      </div>
    </article>
  `;
}

function renderFlagList(flags, emptyText, escapeHtml) {
  if (!flags.length) {
    return `<div class="empty-box">${escapeHtml(emptyText)}</div>`;
  }

  return `
    <div class="governance-flag-list">
      ${flags.map((flag) => `
        <div class="governance-flag">
          <span class="card-badge ${severityClass(flag.severity)}">${escapeHtml(titleCase(flag.severity || "info"))}</span>
          <strong>${escapeHtml(flag.message || flag.label || "Flagged")}</strong>
        </div>
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
        <button class="btn btn-primary" type="button" data-governance-decision="approved" data-approval-id="${escapeHtml(item.id)}">Approve</button>
        <button class="btn btn-secondary" type="button" data-governance-decision="rejected" data-approval-id="${escapeHtml(item.id)}">Reject</button>
        <button class="btn btn-secondary" type="button" data-governance-decision="changes_requested" data-approval-id="${escapeHtml(item.id)}">Request Changes</button>
        <button class="btn btn-secondary" type="button" data-governance-decision="escalated" data-approval-id="${escapeHtml(item.id)}">Escalate</button>
        <button class="btn btn-secondary" type="button" data-governance-decision="overridden" data-approval-id="${escapeHtml(item.id)}">Override</button>
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
          >
            Request Approval
          </button>
        </div>
      `}
    </article>
  `;
}

function renderTimeline(items, escapeHtml) {
  if (!items.length) {
    return `<div class="empty-box">No audit history is available yet.</div>`;
  }

  return `
    <div class="governance-timeline">
      ${items.map((item) => `
        <div class="governance-timeline-item">
          <div class="governance-timeline-dot"></div>
          <div class="governance-timeline-copy">
            <strong>${escapeHtml(item.title || titleCase(item.type || "event"))}</strong>
            <p>${escapeHtml(item.summary || "Operational event recorded.")}</p>
            <span>${escapeHtml(item.actor || "MH Assistant")} • ${escapeHtml(formatDateTime(item.timestamp))}</span>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderPolicyControls(summary, settingsDraft, escapeHtml) {
  const policy = asObject(summary?.policy);
  const rules = asObject(policy.policy_rules);
  const owners = asObject(policy.approval_owners);
  const settingsBridge = asObject(policy.settings_bridge);

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
    <div class="governance-actions">
      <button class="btn btn-primary" type="button" data-governance-action="save-policy">Save Governance Policy</button>
      <button class="btn btn-secondary" type="button" data-governance-action="sync-settings"${Object.keys(settingsDraft).length ? "" : " disabled"}>Sync Settings Rules</button>
    </div>
    <div class="simple-banner">
      <strong>Settings bridge:</strong> ${escapeHtml(settingsBridge.source || "Not synced")} • approval mode ${escapeHtml(settingsBridge.approval_mode || "unknown")} • claim mode ${escapeHtml(settingsBridge.claim_safety_mode || "unknown")} • synced ${escapeHtml(settingsBridge.synced_at ? formatDateTime(settingsBridge.synced_at) : "not yet")}
    </div>
  `;
}

function renderPage(projectName, session, escapeHtml) {
  if (!projectName) {
    return `
      <section class="page is-active" data-page="governance">
        <div class="panel panel-span-2">
          <div class="empty-box">Select a project to review approvals, policy violations, overrides, and audit history.</div>
        </div>
      </section>
    `;
  }

  if (session.loading && !session.loaded) {
    return `
      <section class="page is-active" data-page="governance">
        <div class="panel panel-span-2">
          <div class="empty-box">Loading governance console...</div>
        </div>
      </section>
    `;
  }

  if (session.error && !session.summary) {
    return `
      <section class="page is-active" data-page="governance">
        <div class="panel panel-span-2">
          <div class="empty-box">${escapeHtml(session.error)}</div>
        </div>
      </section>
    `;
  }

  const summary = asObject(session.summary);
  const sections = asObject(summary.sections);
  const settingsDraft = getSettingsDraftFromPolicy(summary);

  return `
    <section class="page is-active" data-page="governance">
      <div class="governance-shell">
        <div class="governance-hero panel">
          <div class="panel-header">
            <div>
              <div class="panel-kicker">Operational Governance</div>
              <h3>Governance console for ${escapeHtml(projectName)}</h3>
              <p>Enforce policy, review approvals, inspect risky claims and brand safety issues, manage overrides, and keep a durable audit trail.</p>
            </div>
            <div class="governance-hero-actions">
              <button class="btn btn-secondary" type="button" data-governance-action="refresh">Refresh</button>
            </div>
          </div>
          <div class="governance-metrics">
            ${renderMetric("Approval Queue", asArray(sections.approval_queue).length, "Awaiting decision", escapeHtml)}
            ${renderMetric("Policy Violations", asArray(sections.policy_violations).length, "Needs review", escapeHtml)}
            ${renderMetric("Claim Review", asArray(sections.claim_review).length, "Risky AI claims", escapeHtml)}
            ${renderMetric("Brand Safety", asArray(sections.brand_safety_review).length, "Creative flags", escapeHtml)}
            ${renderMetric("Publish Guardrails", asArray(sections.publish_guardrails).length, "Release blockers", escapeHtml)}
            ${renderMetric("Escalation Queue", asArray(sections.escalation_queue).length, "Open escalations", escapeHtml)}
          </div>
        </div>

        <div class="governance-grid">
          ${renderReviewOwnership(summary, escapeHtml)}

          <article class="panel">
            <div class="panel-header"><div><div class="panel-kicker">1. Approval Queue</div><h3>Pending decisions</h3></div></div>
            <div class="governance-card-list">
              ${asArray(sections.approval_queue).length
                ? asArray(sections.approval_queue).map((item) => renderApprovalCard(item, escapeHtml)).join("")
                : `<div class="empty-box">No approval items are currently waiting in the queue.</div>`}
            </div>
          </article>

          <article class="panel">
            <div class="panel-header"><div><div class="panel-kicker">2. Policy Violations</div><h3>Detected risk and rule breaks</h3></div></div>
            ${renderFlagList(asArray(sections.policy_violations), "No policy violations are currently open.", escapeHtml)}
          </article>

          <article class="panel">
            <div class="panel-header"><div><div class="panel-kicker">3. Claim Review</div><h3>Risky AI-generated claims</h3></div></div>
            <div class="governance-card-list">
              ${asArray(sections.claim_review).length
                ? asArray(sections.claim_review).map((item) => renderReviewCard(item, "claim", escapeHtml, findApprovalForEntity(summary, item.entity_type, item.entity_id))).join("")
                : `<div class="empty-box">No claim review items are currently flagged.</div>`}
            </div>
          </article>

          <article class="panel">
            <div class="panel-header"><div><div class="panel-kicker">4. Brand Safety Review</div><h3>Creative and media safety flags</h3></div></div>
            <div class="governance-card-list">
              ${asArray(sections.brand_safety_review).length
                ? asArray(sections.brand_safety_review).map((item) => renderReviewCard(item, "brand", escapeHtml, findApprovalForEntity(summary, item.entity_type, item.entity_id))).join("")
                : `<div class="empty-box">No brand safety flags are currently open.</div>`}
            </div>
          </article>

          <article class="panel">
            <div class="panel-header"><div><div class="panel-kicker">5. Publish Guardrails</div><h3>Release blockers and preflight checks</h3></div></div>
            <div class="governance-card-list">
              ${asArray(sections.publish_guardrails).length
                ? asArray(sections.publish_guardrails).map((item) => renderReviewCard(item, "publish", escapeHtml, findApprovalForEntity(summary, "publishing_job", item.entity_id))).join("")
                : `<div class="empty-box">Publishing guardrails are clear right now.</div>`}
            </div>
          </article>

          <article class="panel">
            <div class="panel-header"><div><div class="panel-kicker">6. Audit Timeline</div><h3>Who decided what, and why</h3></div></div>
            ${renderTimeline(asArray(sections.audit_timeline), escapeHtml)}
          </article>

          <article class="panel">
            <div class="panel-header"><div><div class="panel-kicker">7. Override Controls</div><h3>Policy locks and active overrides</h3></div></div>
            ${renderPolicyControls(summary, settingsDraft, escapeHtml)}
            <div class="governance-card-list">
              ${asArray(sections.override_controls?.active_overrides).length
                ? asArray(sections.override_controls.active_overrides).map((item) => `
                  <div class="governance-card">
                    <div class="governance-card-head">
                      <div>
                        <div class="panel-kicker">${escapeHtml(titleCase(item.action || "override"))}</div>
                        <h4>${escapeHtml(`${item.entity_type || "entity"} ${item.entity_id || ""}`)}</h4>
                      </div>
                      <span class="card-badge warning">${escapeHtml(titleCase(item.status || "active"))}</span>
                    </div>
                    <p class="governance-copy">${escapeHtml(item.reason || "Manual override recorded.")}</p>
                    <div class="governance-meta">
                      <span>${escapeHtml(item.actor || "Operator")}</span>
                      <span>${escapeHtml(formatDateTime(item.created_at))}</span>
                    </div>
                  </div>
                `).join("")
                : `<div class="empty-box">No active overrides are currently open.</div>`}
            </div>
          </article>

          <article class="panel">
            <div class="panel-header"><div><div class="panel-kicker">8. Escalation Queue</div><h3>Items routed for higher-level review</h3></div></div>
            <div class="governance-card-list">
              ${asArray(sections.escalation_queue).length
                ? asArray(sections.escalation_queue).map((item) => `
                  <div class="governance-card">
                    <div class="governance-card-head">
                      <div>
                        <div class="panel-kicker">${escapeHtml(titleCase(item.source_type || item.entity_type || "escalation"))}</div>
                        <h4>${escapeHtml(item.title || "Escalation item")}</h4>
                      </div>
                      <span class="card-badge danger">${escapeHtml(titleCase(item.status || "open"))}</span>
                    </div>
                    <p class="governance-copy">${escapeHtml(item.description || item.summary || "Escalated for follow-up.")}</p>
                    <div class="governance-meta">
                      <span>${escapeHtml(item.assignee || item.owner || item.reviewer || "Admin")}</span>
                      <span>${escapeHtml(formatDateTime(item.updated_at || item.created_at))}</span>
                    </div>
                  </div>
                `).join("")
                : `<div class="empty-box">No escalations are currently active.</div>`}
            </div>
          </article>
        </div>
      </div>
    </section>
  `;
}

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
      const note = document.getElementById(`gov-note-${approvalId}`)?.value?.trim() || `${titleCase(decision)} from Governance console.`;
      const escalationChain = asObject(session.summary?.review_model?.escalation_chain);
      const escalateTo = asArray(escalationChain.high)[1] || asArray(escalationChain.high)[0] || "admin";

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
}

export const governanceRoute = {
  id: "governance",
  meta: {
    eyebrow: "System",
    title: "Governance",
    description: "Review approvals, policy violations, overrides, escalation, and audit visibility across content, media, campaigns, and publishing."
  },
  template: `<section class="page is-active" data-page="governance"><div class="governance-shell"></div></section>`,
  render(context) {
    const state = context.getState();
    const projectName = state?.context?.currentProject || "";
    const session = ensureSession(projectName);
    const root = context.$("pageRoot");

    if (!root) return;

    const rerender = () => {
      root.innerHTML = renderPage(projectName, session, context.escapeHtml);
      bindGovernance(context, projectName, session);
    };

    rerender();

    if (!projectName) {
      return;
    }

    if (!session.loaded && !session.loading) {
      loadGovernance(projectName, session, rerender);
    }
  }
};

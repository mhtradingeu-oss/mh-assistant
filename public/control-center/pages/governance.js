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
      <div class="panel-header"><div><div class="panel-kicker">Review model</div><h3>Ownership and escalation chain</h3></div></div>
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
  if (input) {
    input.value = prompt;
  }
}

function buildDecisionQueue(summary) {
  const sections = asObject(summary.sections);

  const approvals = asArray(sections.approval_queue).map((item) => ({
    ...item,
    queue_kind: "approval",
    selected_key: `approval:${asString(item.id)}`,
    queue_title: item.title || "Approval item",
    queue_summary: item.summary || "Awaiting review and decision.",
    queue_status: item.status || "pending",
    queue_risk: item.risk_level || "medium",
    queue_owner: item.reviewer || item.requested_for || "Operator",
    queue_created: item.created_at,
    queue_flags: [
      ...asArray(item.policy_flags),
      ...asArray(item.claim_flags),
      ...asArray(item.brand_safety_flags),
      ...asArray(item.publish_guardrails)
    ],
    linked_approval: item
  }));

  const claims = asArray(sections.claim_review).map((item) => {
    const approval = findApprovalForEntity(summary, item.entity_type, item.entity_id);
    return {
      ...item,
      queue_kind: "claim",
      selected_key: `claim:${asString(item.entity_id || item.id)}`,
      queue_title: item.title || "Claim review item",
      queue_summary: asArray(item.claim_flags).map((flag) => flag.message).join(" | ") || "No claim issues detected.",
      queue_status: approval?.status || item.status || "open",
      queue_risk: asArray(item.claim_flags)[0]?.severity || "medium",
      queue_owner: approval?.reviewer || "Compliance Reviewer",
      queue_created: approval?.created_at || item.updated_at || item.created_at,
      queue_flags: asArray(item.claim_flags),
      linked_approval: approval
    };
  });

  const brand = asArray(sections.brand_safety_review).map((item) => {
    const approval = findApprovalForEntity(summary, item.entity_type, item.entity_id);
    return {
      ...item,
      queue_kind: "brand",
      selected_key: `brand:${asString(item.entity_id || item.id)}`,
      queue_title: item.title || "Brand safety review",
      queue_summary: asArray(item.brand_safety_flags).map((flag) => flag.message).join(" | ") || "No brand issues detected.",
      queue_status: approval?.status || item.status || "open",
      queue_risk: asArray(item.brand_safety_flags)[0]?.severity || "medium",
      queue_owner: approval?.reviewer || "Brand Reviewer",
      queue_created: approval?.created_at || item.updated_at || item.created_at,
      queue_flags: asArray(item.brand_safety_flags),
      linked_approval: approval
    };
  });

  const publish = asArray(sections.publish_guardrails).map((item) => {
    const approval = findApprovalForEntity(summary, "publishing_job", item.entity_id);
    return {
      ...item,
      queue_kind: "publish",
      selected_key: `publish:${asString(item.entity_id || item.id)}`,
      queue_title: item.title || "Publish guardrail",
      queue_summary: asArray(item.publish_guardrails).map((flag) => flag.message).join(" | ") || "No publish blockers detected.",
      queue_status: approval?.status || item.status || "open",
      queue_risk: asArray(item.publish_guardrails)[0]?.severity || "medium",
      queue_owner: approval?.reviewer || "Publishing Reviewer",
      queue_created: approval?.created_at || item.updated_at || item.created_at,
      queue_flags: asArray(item.publish_guardrails),
      linked_approval: approval
    };
  });

  const escalations = asArray(sections.escalation_queue).map((item) => ({
    ...item,
    queue_kind: "escalation",
    selected_key: `escalation:${asString(item.entity_id || item.id || item.title)}`,
    queue_title: item.title || "Escalation item",
    queue_summary: item.description || item.summary || "Escalated for follow-up.",
    queue_status: item.status || "open",
    queue_risk: "high",
    queue_owner: item.assignee || item.owner || item.reviewer || "Admin",
    queue_created: item.updated_at || item.created_at,
    queue_flags: []
  }));

  return [...approvals, ...claims, ...brand, ...publish, ...escalations];
}

function buildGovernancePrompts(projectName, selectedItem, focusLabel) {
  const projectLabel = projectName || "this project";
  const itemLabel = asString(selectedItem?.queue_title || selectedItem?.title || "the selected governance item");
  return [
    {
      label: "Summarize governance state",
      preview: "Explain the current approval pressure, risk level, and next governance priority.",
      prompt: `Summarize the current governance state for ${projectLabel}. Cover policy pressure, pending approvals, risky claims, brand safety issues, publish blockers, and the next governance priority.`
    },
    {
      label: "Review selected decision",
      preview: "Explain the selected governance item and what decision path is safest.",
      prompt: `Review ${itemLabel} in Governance for ${projectLabel}. Explain the risk, what policy is implicated, and what decision path is safest next.`
    },
    {
      label: "Find governance gaps",
      preview: "Identify the highest-risk governance gaps and what rules or ownership need tightening.",
      prompt: `Review Governance for ${projectLabel} with focus on ${focusLabel}. Identify the highest-risk governance gaps, where approval ownership is weak, and what rules need tightening next.`
    }
  ];
}

function renderPage(projectName, session, escapeHtml) {
  if (!projectName) {
    return `
      <section class="page is-active" data-page="governance">
        <div class="governance-shell governance-workspace">
          <section class="panel">
            <div class="panel-header">
              <div>
                <div class="panel-kicker">Command surface</div>
                <h3>Governance command center</h3>
                <p>Governance operating surface for approvals, policy pressure, and decision routing.</p>
              </div>
              <span class="card-badge neutral">Idle</span>
            </div>
          </section>
          <section class="panel">
            <div class="panel-header">
              <div>
                <div class="panel-kicker">System signals</div>
                <h3>Current system signals</h3>
              </div>
            </div>
            <div class="empty-box">Select a project to review approvals, policy violations, overrides, and audit history.</div>
          </section>
        </div>
      </section>
    `;
  }

  if (session.loading && !session.loaded) {
    return `
      <section class="page is-active" data-page="governance">
        <div class="governance-shell governance-workspace">
          <section class="panel">
            <div class="panel-header">
              <div>
                <div class="panel-kicker">Command surface</div>
                <h3>Governance command center for ${escapeHtml(projectName)}</h3>
                <p>Preparing the governance operating surface.</p>
              </div>
              <span class="card-badge neutral">Loading</span>
            </div>
          </section>
          <section class="panel">
            <div class="panel-header">
              <div>
                <div class="panel-kicker">System signals</div>
                <h3>Current system signals</h3>
              </div>
            </div>
            <div class="empty-box">Loading governance console...</div>
          </section>
        </div>
      </section>
    `;
  }

  if (session.error && !session.summary) {
    return `
      <section class="page is-active" data-page="governance">
        <div class="governance-shell governance-workspace">
          <section class="panel">
            <div class="panel-header">
              <div>
                <div class="panel-kicker">Command surface</div>
                <h3>Governance command center for ${escapeHtml(projectName)}</h3>
                <p>Governance surface is available but the latest data could not be loaded.</p>
              </div>
              <span class="card-badge warning">Error</span>
            </div>
          </section>
          <section class="panel">
            <div class="panel-header">
              <div>
                <div class="panel-kicker">System signals</div>
                <h3>Current system signals</h3>
              </div>
            </div>
            <div class="empty-box">${escapeHtml(session.error)}</div>
          </section>
        </div>
      </section>
    `;
  }

  const summary = asObject(session.summary);
  const sections = asObject(summary.sections);
  const settingsDraft = getSettingsDraftFromPolicy(summary);
  const queueItems = buildDecisionQueue(summary);
  const focusCounts = {
    all: queueItems.length,
    approvals: queueItems.filter((item) => item.queue_kind === "approval").length,
    claims: queueItems.filter((item) => item.queue_kind === "claim").length,
    brand: queueItems.filter((item) => item.queue_kind === "brand").length,
    publish: queueItems.filter((item) => item.queue_kind === "publish").length,
    escalations: queueItems.filter((item) => item.queue_kind === "escalation").length
  };
  let visibleQueue = queueItems;
  if (session.focus !== "all") {
    const focusMap = {
      approvals: "approval",
      claims: "claim",
      brand: "brand",
      publish: "publish",
      escalations: "escalation"
    };
    visibleQueue = queueItems.filter((item) => item.queue_kind === focusMap[session.focus]);
  }
  const selectedItem = visibleQueue.find((item) => item.selected_key === session.selectedKey) || visibleQueue[0] || null;
  session.selectedKey = selectedItem?.selected_key || "";
  const prompts = buildGovernancePrompts(projectName, selectedItem, titleCase(session.focus || "all"));
  const policy = asObject(summary.policy);
  const rules = asObject(policy.policy_rules);
  const owners = asObject(policy.approval_owners);
  const settingsBridge = asObject(policy.settings_bridge);
  const recentTimeline = asArray(sections.audit_timeline).slice(0, 4);

  return `
    <section class="page is-active" data-page="governance">
      <div class="governance-shell governance-workspace">
        <section class="panel">
          <div class="panel-header">
            <div>
              <div class="panel-kicker">Command surface</div>
              <h3>Governance command center for ${escapeHtml(projectName)}</h3>
              <p>Header and control surface for policy pressure, approval demand, and next governance decisions.</p>
            </div>
            <span class="card-badge neutral">${escapeHtml(session.loading ? "Refreshing" : "Active")}</span>
          </div>
        </section>

        <section class="panel">
          <div class="panel-header">
            <div>
              <div class="panel-kicker">System signals</div>
              <h3>Current system signals</h3>
              <p>Live governance metrics and latest recorded governance activity.</p>
            </div>
          </div>
          <div class="governance-overview-grid">
            ${renderMetric("Approval Queue", asArray(sections.approval_queue).length, "Awaiting decision", escapeHtml)}
            ${renderMetric("Policy Violations", asArray(sections.policy_violations).length, "Needs review", escapeHtml)}
            ${renderMetric("Claim Review", asArray(sections.claim_review).length, "Risky AI claims", escapeHtml)}
            ${renderMetric("Brand Safety", asArray(sections.brand_safety_review).length, "Creative flags", escapeHtml)}
            ${renderMetric("Publish Guardrails", asArray(sections.publish_guardrails).length, "Release blockers", escapeHtml)}
            ${renderMetric("Escalations", asArray(sections.escalation_queue).length, "Higher-level review", escapeHtml)}
          </div>
          <div class="governance-activity-list">
            ${recentTimeline.length
              ? recentTimeline.map((item) => `
                <div class="governance-activity-item">
                  <strong>${escapeHtml(item.title || titleCase(item.type || "event"))}</strong>
                  <span>${escapeHtml(item.actor || "MH Assistant")} • ${escapeHtml(formatDateTime(item.timestamp))}</span>
                </div>
              `).join("")
              : `<div class="empty-box">No audit history is available yet.</div>`}
          </div>
        </section>

        <div class="governance-workspace-grid">
          <div class="governance-action-stack">
            <section class="panel">
              <div class="panel-header">
                <div>
                  <div class="panel-kicker">Policy and rule summary</div>
                  <h3>Policy visibility</h3>
                  <p>Keep active rules, ownership, and settings bridge state visible from the main view.</p>
                </div>
              </div>
              <div class="governance-policy-summary-grid">
                <div class="governance-policy-block">
                  <h4>Active rules</h4>
                  <div class="governance-rule-list">
                    ${Object.entries(rules).map(([key, value]) => `
                      <div class="governance-rule-item">
                        <strong>${escapeHtml(titleCase(key))}</strong>
                        <span>${escapeHtml(value ? "Enabled" : "Disabled")}</span>
                      </div>
                    `).join("")}
                  </div>
                </div>
                <div class="governance-policy-block">
                  <h4>Approval owners</h4>
                  <div class="governance-rule-list">
                    ${Object.entries(owners).map(([key, value]) => `
                      <div class="governance-rule-item">
                        <strong>${escapeHtml(titleCase(key))}</strong>
                        <span>${escapeHtml(asString(value) || "Unassigned")}</span>
                      </div>
                    `).join("")}
                  </div>
                </div>
                <div class="governance-policy-block">
                  <h4>Editable policy controls</h4>
                  ${renderPolicyControls(summary, settingsDraft, escapeHtml)}
                </div>
                <div class="governance-policy-block">
                  <h4>Open policy signal</h4>
                  ${renderFlagList(asArray(sections.policy_violations), "No policy violations are currently open.", escapeHtml)}
                  <div class="simple-banner">
                    <strong>Settings bridge:</strong> ${escapeHtml(settingsBridge.source || "Not synced")} • approval mode ${escapeHtml(settingsBridge.approval_mode || "unknown")} • claim mode ${escapeHtml(settingsBridge.claim_safety_mode || "unknown")} • synced ${escapeHtml(settingsBridge.synced_at ? formatDateTime(settingsBridge.synced_at) : "not yet")}
                  </div>
                </div>
              </div>
            </section>

            <section class="panel">
              <div class="panel-header">
                <div>
                  <div class="panel-kicker">Decision queue</div>
                  <h3>Pending approvals and governance decisions</h3>
                  <p>Browse the combined governance queue, then inspect one selected item before taking action.</p>
                </div>
                <span class="card-badge neutral">${escapeHtml(`${visibleQueue.length} visible`)}</span>
              </div>
              <div class="governance-focus-tabs">
                ${[
                  ["all", "All", focusCounts.all],
                  ["approvals", "Approvals", focusCounts.approvals],
                  ["claims", "Claims", focusCounts.claims],
                  ["brand", "Brand", focusCounts.brand],
                  ["publish", "Publish", focusCounts.publish],
                  ["escalations", "Escalations", focusCounts.escalations]
                ].map(([value, label, count]) => `
                  <button class="governance-focus-tab${session.focus === value ? " is-active" : ""}" type="button" data-governance-focus="${escapeHtml(value)}">
                    <strong>${escapeHtml(label)}</strong>
                    <span>${escapeHtml(asString(count))}</span>
                  </button>
                `).join("")}
              </div>
              <div class="ops-table-wrap">
                <table class="ops-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Item</th>
                      <th>Risk</th>
                      <th>Owner</th>
                      <th>Status</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${visibleQueue.length
                      ? visibleQueue.map((item) => `
                        <tr class="${selectedItem?.selected_key === item.selected_key ? "is-selected" : ""}">
                          <td><span class="card-badge neutral">${escapeHtml(titleCase(item.queue_kind || "item"))}</span></td>
                          <td>
                            <button class="governance-select-link" type="button" data-governance-select="${escapeHtml(item.selected_key)}">
                              <strong>${escapeHtml(item.queue_title)}</strong>
                              <span>${escapeHtml(item.queue_summary)}</span>
                            </button>
                          </td>
                          <td><span class="card-badge ${severityClass(item.queue_risk)}">${escapeHtml(titleCase(item.queue_risk || "medium"))}</span></td>
                          <td>${escapeHtml(item.queue_owner || "-")}</td>
                          <td><span class="card-badge ${severityClass(item.queue_status)}">${escapeHtml(titleCase(item.queue_status || "open"))}</span></td>
                          <td>${escapeHtml(formatDateTime(item.queue_created))}</td>
                        </tr>
                      `).join("")
                      : `<tr><td colspan="6"><div class="empty-box">No governance items are visible in this focus state.</div></td></tr>`}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <div class="governance-action-stack">
          <section class="panel">
            <div class="panel-header">
              <div>
                <div class="panel-kicker">Selected decision</div>
                <h3>${escapeHtml(selectedItem?.queue_title || "Select a governance item")}</h3>
                <p>${escapeHtml(selectedItem ? "Review the selected item, its flags, and linked approval history before deciding." : "Choose a governance item from the queue to inspect it.")}</p>
              </div>
            </div>
            ${
              selectedItem
                ? `
                  <div class="governance-selected-summary">
                    <strong>${escapeHtml(selectedItem.queue_title)}</strong>
                    <p>${escapeHtml(selectedItem.queue_summary)}</p>
                  </div>
                  <div class="governance-selected-grid">
                    <div class="governance-selected-item">
                      <span>Type</span>
                      <strong>${escapeHtml(titleCase(selectedItem.queue_kind || "item"))}</strong>
                    </div>
                    <div class="governance-selected-item">
                      <span>Risk</span>
                      <strong>${escapeHtml(titleCase(selectedItem.queue_risk || "medium"))}</strong>
                    </div>
                    <div class="governance-selected-item">
                      <span>Owner</span>
                      <strong>${escapeHtml(selectedItem.queue_owner || "-")}</strong>
                    </div>
                    <div class="governance-selected-item">
                      <span>Status</span>
                      <strong>${escapeHtml(titleCase(selectedItem.queue_status || "open"))}</strong>
                    </div>
                    <div class="governance-selected-item">
                      <span>Entity</span>
                      <strong>${escapeHtml(selectedItem.entity_type || selectedItem.source_type || "-")}</strong>
                    </div>
                    <div class="governance-selected-item">
                      <span>Created</span>
                      <strong>${escapeHtml(formatDateTime(selectedItem.queue_created))}</strong>
                    </div>
                  </div>
                  ${renderFlagList(asArray(selectedItem.queue_flags), "No policy flags were attached to this item.", escapeHtml)}
                  ${
                    selectedItem.linked_approval
                      ? `
                        <div class="simple-banner">
                          <strong>Linked approval:</strong> ${escapeHtml(selectedItem.linked_approval.title || selectedItem.linked_approval.id)} • ${escapeHtml(titleCase(selectedItem.linked_approval.status || "pending"))}
                        </div>
                      `
                      : ""
                  }
                  ${
                    asArray(selectedItem.history).length
                      ? `
                        <div class="governance-activity-list">
                          ${asArray(selectedItem.history).slice(0, 4).map((entry) => `
                            <div class="governance-activity-item">
                              <strong>${escapeHtml(titleCase(entry.action || "updated"))}</strong>
                              <span>${escapeHtml(entry.actor || "MH Assistant")} • ${escapeHtml(formatDateTime(entry.at))}</span>
                            </div>
                          `).join("")}
                        </div>
                      `
                      : ""
                  }
                `
                : `<div class="empty-box">No governance item is selected.</div>`
            }
          </section>

          ${renderReviewOwnership(summary, escapeHtml)}

          <section class="panel">
            <div class="panel-header">
              <div>
                <div class="panel-kicker">Governance actions</div>
                <h3>Review, decide, and maintain policy controls</h3>
                <p>Only real governance actions are shown here. Approve and reject actions appear only for real approvals.</p>
              </div>
            </div>
            <div class="governance-action-stack">
              <textarea id="governanceDecisionNote" class="setup-input setup-textarea governance-note" rows="4" placeholder="Add a decision reason, change request, or escalation note.">${escapeHtml(selectedItem?.decision_note || "")}</textarea>
              <div class="governance-actions">
                <button class="btn btn-secondary" type="button" data-governance-action="refresh">Refresh</button>
                <button class="btn btn-primary" type="button" data-governance-action="save-policy">Save Governance Policy</button>
                <button class="btn btn-secondary" type="button" data-governance-action="sync-settings"${Object.keys(settingsDraft).length ? "" : " disabled"}>Sync Settings Rules</button>
                ${
                  selectedItem?.queue_kind === "approval"
                    ? `
                      <button class="btn btn-primary" type="button" data-governance-decision="approved" data-approval-id="${escapeHtml(selectedItem.id)}">Approve</button>
                      <button class="btn btn-secondary" type="button" data-governance-decision="rejected" data-approval-id="${escapeHtml(selectedItem.id)}">Reject</button>
                      <button class="btn btn-secondary" type="button" data-governance-decision="changes_requested" data-approval-id="${escapeHtml(selectedItem.id)}">Request Changes</button>
                      <button class="btn btn-secondary" type="button" data-governance-decision="escalated" data-approval-id="${escapeHtml(selectedItem.id)}">Escalate</button>
                      <button class="btn btn-secondary" type="button" data-governance-decision="overridden" data-approval-id="${escapeHtml(selectedItem.id)}">Override</button>
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
                        Request Approval
                      </button>
                    `
                    : ""
                }
              </div>
              <div class="governance-policy-summary-grid">
                <div class="governance-policy-block">
                  <h4>Active overrides</h4>
                  <div class="governance-activity-list">
                    ${asArray(sections.override_controls?.active_overrides).length
                      ? asArray(sections.override_controls.active_overrides).slice(0, 4).map((item) => `
                        <div class="governance-activity-item">
                          <strong>${escapeHtml(`${titleCase(item.action || "override")} • ${item.entity_type || "entity"}`)}</strong>
                          <span>${escapeHtml(item.actor || "Operator")} • ${escapeHtml(formatDateTime(item.created_at))}</span>
                        </div>
                      `).join("")
                      : `<div class="empty-box">No active overrides are currently open.</div>`}
                  </div>
                </div>
                <div class="governance-policy-block">
                  <h4>Escalation chain</h4>
                  <div class="governance-rule-list">
                    ${Object.entries(asObject(summary.review_model?.escalation_chain)).map(([risk, roles]) => `
                      <div class="governance-rule-item">
                        <strong>${escapeHtml(titleCase(risk))}</strong>
                        <span>${escapeHtml(asArray(roles).map(titleCase).join(" -> ") || "No escalation path")}</span>
                      </div>
                    `).join("")}
                  </div>
                </div>
              </div>
            </div>
          </section>
          </div>
        </div>

        <section class="panel">
          <div class="panel-header">
            <div>
              <div class="panel-kicker">Governance AI assistant</div>
              <h3>Governance AI assistant</h3>
              <p>Opens AI with governance context only. No approval, publishing, or backend execution is performed.</p>
            </div>
          </div>
          <div class="governance-ai-toolbar">
            <button class="btn btn-secondary" type="button" data-governance-open-ai>Open AI: Review in AI Workspace</button>
          </div>
          <div class="quick-actions">
            ${prompts.map((item, index) => `
              <button class="quick-action-btn" type="button" data-governance-ai-prompt="${index}">
                <span class="home-action-title">${escapeHtml(item.label)}</span>
                <span class="home-action-meta">${escapeHtml(item.preview)}</span>
              </button>
            `).join("")}
          </div>
        </section>
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
      const note = root.querySelector("#governanceDecisionNote")?.value?.trim() || `${titleCase(decision)} from Governance console.`;
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
  id: "governance",
  disableStandardLayout: true,
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

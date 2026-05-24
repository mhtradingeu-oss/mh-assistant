// --- Governance Evidence Summary & Intake Patch ---
// Evidence helpers
function asSafeArray(val) {
  return Array.isArray(val) ? val : val ? [val] : [];
}

function collectGovernanceEvidence({ selectedItem, projectData, governanceData }) {
  // Defensive extraction of evidence assets
  const evidence = {
    source_of_truth: [],
    legal: [],
    pricing: [],
    certificate: [],
    proof: [],
    product: [],
    brand: [],
    claim: [],
    media: [],
    content: [],
    library: [],
    other: []
  };
  const sources = [selectedItem, projectData, governanceData];
  sources.forEach((src) => {
    if (!src) return;
    Object.entries(src).forEach(([k, v]) => {
      const key = k.toLowerCase();
      if (/source_of_truth|source/.test(key)) evidence.source_of_truth.push(v);
      else if (/legal/.test(key)) evidence.legal.push(v);
      else if (/pricing/.test(key)) evidence.pricing.push(v);
      else if (/certificate|certificates/.test(key)) evidence.certificate.push(v);
      else if (/proof/.test(key)) evidence.proof.push(v);
      else if (/product/.test(key)) evidence.product.push(v);
      else if (/brand/.test(key)) evidence.brand.push(v);
      else if (/claim/.test(key)) evidence.claim.push(v);
      else if (/media/.test(key)) evidence.media.push(v);
      else if (/content/.test(key)) evidence.content.push(v);
      else if (/library/.test(key)) evidence.library.push(v);
      else evidence.other.push(v);
    });
  });
  // Flatten and filter
  Object.keys(evidence).forEach((k) => {
    evidence[k] = asSafeArray(evidence[k]).flat().filter(Boolean);
  });
  return evidence;
}

function classifyEvidenceAsset(asset) {
  if (!asset) return "other";
  const s = JSON.stringify(asset).toLowerCase();
  if (s.includes("source_of_truth") || s.includes("source")) return "source_of_truth";
  if (s.includes("legal")) return "legal";
  if (s.includes("pricing")) return "pricing";
  if (s.includes("certificate")) return "certificate";
  if (s.includes("proof")) return "proof";
  if (s.includes("product")) return "product";
  if (s.includes("brand")) return "brand";
  if (s.includes("claim")) return "claim";
  if (s.includes("media")) return "media";
  if (s.includes("content")) return "content";
  if (s.includes("library")) return "library";
  return "other";
}

function summarizeEvidenceState(evidence) {
  // Returns true if any key evidence is present
  return (
    evidence.source_of_truth.length ||
    evidence.legal.length ||
    evidence.pricing.length ||
    evidence.certificate.length ||
    evidence.proof.length
  );
}

function renderGovernanceEvidenceSummary({ selectedItem, projectData, governanceData, intakeContext, escapeHtml }) {
  const evidence = collectGovernanceEvidence({ selectedItem, projectData, governanceData });
  const hasEvidence = summarizeEvidenceState(evidence);
  return `
    <div class="governance-evidence-summary">
      <div class="governance-evidence-summary-header">Evidence Summary</div>
      <div class="governance-evidence-cards">
        <div class="governance-evidence-card${evidence.source_of_truth.length ? '' : ' is-missing'}">
          <span class="governance-evidence-label">Source of Truth</span>
          <span class="governance-evidence-value">${evidence.source_of_truth.length ? escapeHtml(asString(evidence.source_of_truth[0])) : "Missing"}</span>
        </div>
        <div class="governance-evidence-card${evidence.legal.length ? '' : ' is-missing'}">
          <span class="governance-evidence-label">Legal</span>
          <span class="governance-evidence-value">${evidence.legal.length ? escapeHtml(asString(evidence.legal[0])) : "Missing"}</span>
        </div>
        <div class="governance-evidence-card${evidence.pricing.length ? '' : ' is-missing'}">
          <span class="governance-evidence-label">Pricing</span>
          <span class="governance-evidence-value">${evidence.pricing.length ? escapeHtml(asString(evidence.pricing[0])) : "Missing"}</span>
        </div>
        <div class="governance-evidence-card${evidence.certificate.length ? '' : ' is-missing'}">
          <span class="governance-evidence-label">Certificate/Proof</span>
          <span class="governance-evidence-value">${evidence.certificate.length ? escapeHtml(asString(evidence.certificate[0])) : evidence.proof.length ? escapeHtml(asString(evidence.proof[0])) : "Missing"}</span>
        </div>
        <div class="governance-evidence-card${evidence.brand.length ? '' : ' is-missing'}">
          <span class="governance-evidence-label">Brand Asset</span>
          <span class="governance-evidence-value">${evidence.brand.length ? escapeHtml(asString(evidence.brand[0])) : "Missing"}</span>
        </div>
        <div class="governance-evidence-card${evidence.product.length ? '' : ' is-missing'}">
          <span class="governance-evidence-label">Product Asset</span>
          <span class="governance-evidence-value">${evidence.product.length ? escapeHtml(asString(evidence.product[0])) : "Missing"}</span>
        </div>
      </div>
      ${!hasEvidence ? `<div class="governance-evidence-card is-missing governance-source-warning">Missing source evidence — attach Library proof before high-risk approval.</div>` : ""}
      <div class="governance-evidence-guidance">High-risk governance decisions should reference source-of-truth evidence, proof assets, or an incoming handoff. Missing evidence should be resolved before approval or override.</div>
    </div>
  `;
}

function renderGovernanceIntakePanel({ projectName, escapeHtml, intakeContext }) {
  // Intake context: { ai, publishing, content, media, workflows, operations, notifications, insights }
  const items = [];
  if (intakeContext?.ai) items.push({ label: "AI Team", value: asString(intakeContext.ai) });
  if (intakeContext?.publishing) items.push({ label: "Publishing", value: asString(intakeContext.publishing) });
  if (intakeContext?.content) items.push({ label: "Content Studio", value: asString(intakeContext.content) });
  if (intakeContext?.media) items.push({ label: "Media Studio", value: asString(intakeContext.media) });
  if (intakeContext?.workflows) items.push({ label: "Workflows", value: asString(intakeContext.workflows) });
  if (intakeContext?.operations) items.push({ label: "Operations", value: asString(intakeContext.operations) });
  if (intakeContext?.notifications) items.push({ label: "Notifications", value: asString(intakeContext.notifications) });
  if (intakeContext?.insights) items.push({ label: "Insights", value: asString(intakeContext.insights) });
  return `
    <div class="governance-intake-panel">
      <div class="governance-intake-panel-header">Incoming Review Context</div>
      <div class="governance-intake-list">
        ${items.length ? items.map((item) => `
          <div class="governance-intake-item"><span class="governance-intake-label">${escapeHtml(item.label)}</span><span class="governance-intake-value">${escapeHtml(item.value)}</span></div>
        `).join("") : `<div class="governance-intake-item is-missing">No intake yet</div>`}
      </div>
    </div>
  `;
}
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
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
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
    <article class="panel std-detail-card mhos-clean-surface">
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
          >
            Request Approval Review
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

function buildReadinessSnapshot(summary, queueItems, selectedItem) {
  const sections = asObject(summary?.sections);
  const policy = asObject(summary?.policy);
  const rules = asObject(policy.policy_rules);
  const owners = asObject(policy.approval_owners);
  const approvals = asArray(sections.approval_queue).length;
  const violations = asArray(sections.policy_violations).length;
  const escalations = asArray(sections.escalation_queue).length;
  const publishGuardrails = asArray(sections.publish_guardrails).length;
  const ownerCoverage = Object.values(owners).filter((value) => asString(value).trim()).length;
  const blockers = [];

  if (rules.freeze_publishing) {
    blockers.push("Publishing is currently frozen by governance policy.");
  }
  if (approvals > 0) {
    blockers.push(`${approvals} approval item${approvals === 1 ? " is" : "s are"} waiting for a decision.`);
  }
  if (violations > 0) {
    blockers.push(`${violations} policy violation${violations === 1 ? " requires" : "s require"} operator review.`);
  }
  if (escalations > 0) {
    blockers.push(`${escalations} escalation${escalations === 1 ? " is" : "s are"} open for higher-level review.`);
  }

  let state = "Launch ready";
  if (rules.freeze_publishing || escalations > 0) {
    state = "Blocked";
  } else if (blockers.length > 0) {
    state = "Attention required";
  }

  let nextBestAction = "Run a governance AI summary, then keep policy owners and rules aligned with live operations.";
  if (selectedItem?.queue_kind === "approval") {
    nextBestAction = "Review the selected approval, document decision reasoning, and submit a governance decision.";
  } else if (approvals > 0) {
    nextBestAction = "Switch to Approvals focus and clear highest-risk decisions first.";
  } else if (violations > 0) {
    nextBestAction = "Inspect policy violations and request approvals where review is still missing.";
  } else if (publishGuardrails > 0) {
    nextBestAction = "Review publish guardrails to ensure release paths remain compliant and safe.";
  }

  return {
    state,
    blockers,
    nextBestAction,
    ownerCoverage,
    totalQueue: queueItems.length,
    approvals,
    violations,
    escalations
  };
}


function governanceRiskRank(value) {
  const normalized = asString(value).toLowerCase();
  if (normalized === "critical") return 4;
  if (normalized === "high") return 3;
  if (normalized === "medium" || normalized === "warning") return 2;
  if (normalized === "low") return 1;
  return 0;
}

function findHighestRiskQueueItem(queueItems) {
  return asArray(queueItems).reduce((highest, item) => {
    if (!highest) return item;
    return governanceRiskRank(item.queue_risk) > governanceRiskRank(highest.queue_risk) ? item : highest;
  }, null);
}

function firstConfiguredOwner(owners) {
  return Object.values(asObject(owners)).map(asString).find((value) => value.trim()) || "";
}

function getGovernanceEscalationRoute(summary, risk) {
  const escalationChain = asObject(summary?.review_model?.escalation_chain);
  const normalizedRisk = asString(risk).toLowerCase();
  const roles = asArray(
    escalationChain[normalizedRisk] ||
    escalationChain.high ||
    escalationChain.critical
  );
  return roles.length ? roles.map(titleCase).join(" -> ") : "No escalation path";
}

function renderPage(projectName, session, escapeHtml) {
  if (!projectName) {
    return `
      <section class="page is-active" data-page="governance">
        <div class="governance-shell governance-workspace mhos-clean-root mhos-clean-shell">
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
        <div class="governance-shell governance-workspace mhos-clean-root mhos-clean-shell">
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
        <div class="governance-shell governance-workspace mhos-clean-root mhos-clean-shell">
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
  const readiness = buildReadinessSnapshot(summary, queueItems, selectedItem);
  const highestRiskItem = findHighestRiskQueueItem(queueItems);
  const executiveFocusItem = selectedItem || highestRiskItem;
  const authorityOwner =
    asString(executiveFocusItem?.queue_owner) ||
    firstConfiguredOwner(owners) ||
    "Governance owner";
  const highestRiskValue = asString(highestRiskItem?.queue_risk || executiveFocusItem?.queue_risk);
  const highestRiskLabel = highestRiskValue ? titleCase(highestRiskValue) : "No open risk";
  const highestRiskTone = highestRiskValue ? severityClass(highestRiskValue) : "success";
  const escalationRoute = getGovernanceEscalationRoute(summary, highestRiskValue || "high");
  const selectedDecisionLabel = asString(executiveFocusItem?.queue_title || "No selected decision");
  const selectedDecisionKind = titleCase(executiveFocusItem?.queue_kind || "governance");

  return `
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
              <div class="governance-rule-list">
                <div class="governance-rule-item">
                  <strong>Owner</strong>
                  <span>${escapeHtml(authorityOwner)}</span>
                </div>
                <div class="governance-rule-item">
                  <strong>Risk</strong>
                  <span><span class="card-badge ${highestRiskTone}">${escapeHtml(highestRiskLabel)}</span></span>
                </div>
              </div>
              <div class="governance-actions std-action-row">
                <button class="btn btn-secondary" type="button" data-governance-focus="all">View Full Queue</button>
                <button class="btn btn-secondary" type="button" data-governance-focus="approvals">Open Approvals</button>
                <button class="btn btn-secondary" type="button" data-governance-open-ai>Ask AI for Guidance</button>
              </div>
            </div>
            <div class="governance-policy-block">
              <h4>Current blockers</h4>
              <div class="governance-activity-list">
                ${readiness.blockers.length
                  ? readiness.blockers.map((item) => `
                    <div class="governance-activity-item">
                      <strong>Action needed</strong>
                      <span>${escapeHtml(item)}</span>
                    </div>
                  `).join("")
                  : `<div class="empty-box">No active governance blockers detected.</div>`}
              </div>
            </div>
            <div class="governance-policy-block">
              <h4>Safe execution path</h4>
              <div class="governance-rule-list">
                <div class="governance-rule-item">
                  <strong>Approval route</strong>
                  <span>${escapeHtml(readiness.approvals ? "Review queued approvals" : "No queued approvals")}</span>
                </div>
                <div class="governance-rule-item">
                  <strong>Escalation route</strong>
                  <span>${escapeHtml(escalationRoute)}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="governance-actions std-action-row mhos-executive-action-row">
            <button class="btn btn-secondary" type="button" data-governance-action="refresh">Refresh Governance Data</button>
            <button class="btn btn-secondary" type="button" data-governance-open-ai>Open AI Context</button>
            <button class="btn btn-secondary" type="button" data-governance-focus="approvals">Focus Approvals</button>
          </div>
        </section>

        <section class="panel mhos-clean-surface" aria-label="Supporting governance signals">
          <div class="panel-header">
            <div>
              <div class="panel-kicker">Supporting signals</div>
              <h3>Governance signal inventory</h3>
              <p>Counts remain visible below the executive action band.</p>
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
          <div class="governance-action-stack std-main-column mhos-clean-stack">
            <section class="panel std-detail-card mhos-clean-surface">
              <div class="panel-header">
                <div>
                  <div class="panel-kicker">Policy and rule summary</div>
                  <h3>Policy visibility</h3>
                  <p>Rules, owners, and Settings bridge state.</p>
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

            <section class="panel std-detail-card mhos-clean-surface">
              <div class="panel-header">
                <div>
                  <div class="panel-kicker">Decision queue</div>
                  <h3>Pending approvals and governance decisions</h3>
                  <p>Inspect risk, owner, status, and decision focus.</p>
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

          <div class="governance-action-stack std-right-rail mhos-clean-stack">
          <section class="panel std-detail-card mhos-clean-surface">
            <div class="panel-header">
              <div>
                <div class="panel-kicker">Selected decision</div>
                <h3>${escapeHtml(selectedItem?.queue_title || "Select a governance item")}</h3>
                  <p>${escapeHtml(selectedItem ? "Review risk, owner, evidence, and linked approval before decision." : "Choose a governance item from the queue to inspect it.")}</p>
              </div>
            </div>
            ${
              selectedItem
                ? `
                  <div class="governance-selected-summary">
                    <strong>${escapeHtml(selectedItem.queue_title)}</strong>
                    <p>${escapeHtml(selectedItem.queue_summary)}</p>
                  </div>
                  <div class="simple-banner"><strong>Authority focus:</strong> ${escapeHtml(selectedItem.queue_owner || authorityOwner)} owns this ${escapeHtml(titleCase(selectedItem.queue_risk || "medium"))} ${escapeHtml(titleCase(selectedItem.queue_kind || "governance"))} review.</div>
                  <!-- Evidence Summary & Intake Panel -->
                  ${renderGovernanceEvidenceSummary({
                    selectedItem,
                    projectData: session.summary?.project_data,
                    governanceData: session.summary,
                    intakeContext: null,
                    escapeHtml
                  })}
                  ${(() => {
                    // Intake context extraction
                    const projectName = session?.projectName || "";
                    const operations = session.summary?.operations;
                    let intakeContext = {};
                    try {
                      // Use shared-context helpers if available
                      if (typeof getSharedHandoff === "function") {
                        intakeContext.ai = (typeof getSharedAiDraft === "function") ? getSharedAiDraft(projectName, operations)?.summary : undefined;
                        intakeContext.publishing = getSharedHandoff(projectName, "publishing", operations)?.payload?.summary;
                        intakeContext.content = getSharedHandoff(projectName, "content-studio", operations)?.payload?.summary;
                        intakeContext.media = getSharedHandoff(projectName, "media-studio", operations)?.payload?.summary;
                        intakeContext.workflows = getSharedHandoff(projectName, "workflows", operations)?.payload?.summary;
                        intakeContext.operations = getSharedHandoff(projectName, "operations", operations)?.payload?.summary;
                        intakeContext.notifications = getSharedHandoff(projectName, "notifications", operations)?.payload?.summary;
                        intakeContext.insights = getSharedHandoff(projectName, "insights", operations)?.payload?.summary;
                      }
                    } catch (e) {}
                    return renderGovernanceIntakePanel({ projectName, escapeHtml, intakeContext });
                  })()}
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

    if (projectName && !session.loaded && !session.loading) {
      loadGovernance(projectName, session, rerender);
      return;
    }

    rerender();
  }
};

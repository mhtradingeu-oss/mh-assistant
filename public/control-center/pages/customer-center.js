import {
  fetchCustomerOperationsReadiness,
  fetchCustomerOperationsInbox,
  fetchCustomerConversations,
  fetchCustomerTickets,
  fetchCustomerChannels
} from "../api.js";

const CUSTOMER_CENTER_STATE = {
  loading: false,
  loaded: false,
  error: "",
  model: null
};

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function asString(value) {
  return value == null ? "" : String(value);
}

function escapeHtml(value) {
  return asString(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getPayload(response) {
  if (response && typeof response === "object" && "data" in response) {
    return response.data;
  }
  return response;
}

function isProtectedReadGuard(value) {
  const message = asString(value?.error || value?.message || value);
  return /protected read routes are disabled/i.test(message);
}

function getProtectedReadMessage(value) {
  return asString(value?.error || value?.message || value || "Protected read routes are disabled.");
}

async function loadCustomerCenterModel(projectName) {
  const [readiness, inbox, conversations, tickets, channels] = await Promise.all([
    fetchCustomerOperationsReadiness(projectName),
    fetchCustomerOperationsInbox(projectName),
    fetchCustomerConversations(projectName),
    fetchCustomerTickets(projectName),
    fetchCustomerChannels(projectName)
  ]);

  const responses = [readiness, inbox, conversations, tickets, channels];
  const guard = responses.find(isProtectedReadGuard);
  if (guard) {
    return {
      protectedReadGuard: true,
      guardMessage: getProtectedReadMessage(guard),
      readiness: {},
      inbox: [],
      conversations: [],
      tickets: [],
      channels: [],
      blockers: ["Protected read route guard is active."],
      warnings: ["Configure MH_CONTROL_CENTER_WRITE_KEY on the server to load Customer Center data."],
      disabledActions: buildDisabledActions()
    };
  }

  const readinessData = asObject(getPayload(readiness));
  const inboxData = getPayload(inbox);
  const conversationsData = getPayload(conversations);
  const ticketsData = getPayload(tickets);
  const channelsData = getPayload(channels);

  return {
    protectedReadGuard: false,
    guardMessage: "",
    readiness: readinessData,
    inbox: asArray(inboxData?.inbox || inboxData),
    conversations: asArray(conversationsData?.conversations || conversationsData),
    tickets: asArray(ticketsData?.tickets || ticketsData),
    channels: asArray(channelsData?.channels || channelsData),
    blockers: asArray(readinessData.blockers),
    warnings: asArray(readinessData.warnings),
    disabledActions: buildDisabledActions()
  };
}

function buildDisabledActions() {
  return [
    ["Send reply", "External send is locked for Customer Center v1."],
    ["Add CRM note", "CRM mutation requires a future confirmation gate and audit log."],
    ["Update ticket", "Ticket mutation is not enabled in this read-only release."],
    ["Assign conversation", "Assignment mutation is not enabled in this read-only release."],
    ["Mark reviewed", "Review state mutation requires a future safety pass."],
    ["Trigger callback", "Call placement is not ready."],
    ["Trigger IVR", "IVR provider execution is not ready."],
    ["Sync CRM", "CRM provider execution is not ready."],
    ["Auto-reply", "Auto-reply is forbidden by default."]
  ];
}

function countWaitingReplies(inbox) {
  return asArray(inbox).filter((entry) => /waiting|open|unread/i.test(`${entry.status || ""} ${entry.sla_status || ""}`)).length;
}

function countSlaRisk(items) {
  return asArray(items).filter((item) => /risk|breach|late|urgent/i.test(`${item.sla_status || ""} ${item.priority || ""}`)).length;
}

function renderMetric(label, value, note = "") {
  return `
    <article class="mhos-executive-summary-item">
      <span class="mhos-executive-metric-label">${escapeHtml(label)}</span>
      <strong class="mhos-executive-metric-value">${escapeHtml(value)}</strong>
      ${note ? `<small class="mhos-executive-metric-note">${escapeHtml(note)}</small>` : ""}
    </article>
  `;
}

function renderProtectedReadGuard(model) {
  if (!model?.protectedReadGuard) return "";
  return `
    <section class="panel mhos-clean-surface" aria-label="Protected read guard">
      <div class="panel-header">
        <div>
          <div class="panel-kicker">Protected read guard</div>
          <h3>Customer Center data is locked by server configuration</h3>
        </div>
      </div>
      <p class="muted">${escapeHtml(model.guardMessage)}</p>
      <div class="empty-box">
        <strong>Server setup required</strong>
        <p>Configure <code>MH_CONTROL_CENTER_WRITE_KEY</code> on the server, restart the service, then reload this page to load read-only customer projections.</p>
        <p>No fake customer data is shown. External send, CRM updates, ticket changes, calls, IVR, and auto-reply remain locked.</p>
      </div>
    </section>
  `;
}

function renderEmptyState(title, body, nextStep = "Safe next step: connect/read customer operations data when backend readiness is confirmed.") {
  return `
    <div class="empty-state">
      <strong>${escapeHtml(title)}</strong>
      <p>${escapeHtml(body)}</p>
      <small>${escapeHtml(nextStep)}</small>
    </div>
  `;
}

function renderInbox(model) {
  const inbox = asArray(model?.inbox);
  if (!inbox.length) {
    return renderEmptyState("No inbox entries yet", "Customer conversations will appear here after read-only customer operations data is available.");
  }

  return inbox.slice(0, 8).map((entry) => `
    <article class="ops-list-item">
      <div>
        <strong>${escapeHtml(entry.customer_label || "Masked customer")}</strong>
        <p>${escapeHtml(entry.last_message_preview || "No message preview available.")}</p>
      </div>
      <span class="card-badge">${escapeHtml(entry.status || "open")}</span>
    </article>
  `).join("");
}

function renderConversations(model) {
  const conversations = asArray(model?.conversations);
  if (!conversations.length) {
    return renderEmptyState("No conversations selected", "Conversation previews will appear here. Customer identity and messages remain masked/truncated by default.");
  }

  return conversations.slice(0, 6).map((item) => `
    <article class="ops-list-item">
      <div>
        <strong>${escapeHtml(item.customer_label || "Masked customer")}</strong>
        <p>${escapeHtml(item.channel || "unknown")} • ${escapeHtml(item.status || "open")} • ${escapeHtml(item.message_count || 0)} messages</p>
      </div>
      <span class="card-badge">${escapeHtml(item.priority || "normal")}</span>
    </article>
  `).join("");
}

function renderTickets(model) {
  const tickets = asArray(model?.tickets);
  if (!tickets.length) {
    return renderEmptyState("No tickets yet", "Ticket and SLA snapshots will appear here when support records are available.");
  }

  return tickets.slice(0, 6).map((ticket) => `
    <article class="ops-list-item">
      <div>
        <strong>${escapeHtml(ticket.ticket_id || "Ticket")}</strong>
        <p>${escapeHtml(ticket.status || "open")} • ${escapeHtml(ticket.sla_status || "unknown SLA")}</p>
      </div>
      <span class="card-badge">${escapeHtml(ticket.priority || "normal")}</span>
    </article>
  `).join("");
}

function renderChannels(model) {
  const channels = asArray(model?.channels);
  if (!channels.length) {
    return renderEmptyState("No channels connected", "Email, social messaging, CRM, voice, and IVR readiness will appear here when providers are configured.");
  }

  return channels.map((channel) => `
    <article class="ops-list-item">
      <div>
        <strong>${escapeHtml(channel.channel_id || channel.provider || "Channel")}</strong>
        <p>${escapeHtml(channel.blocked_reason || "Read-only projection only.")}</p>
      </div>
      <span class="card-badge">${channel.external_send_ready ? "Send ready" : "Send locked"}</span>
    </article>
  `).join("");
}

function renderDisabledActions(actions) {
  return `
    <div class="customer-center-locked-actions" aria-label="Future customer actions locked">
      <div class="panel-kicker">Future actions locked</div>
      <p class="muted">These actions require confirmation gates, role permissions, provider readiness, and audit logging before they can be enabled.</p>
      <div class="button-row">
        ${asArray(actions).map(([label, reason]) => `
          <button class="btn btn-ghost" type="button" disabled title="${escapeHtml(reason)}">
            ${escapeHtml(label)}
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

function renderCustomerCenter(context) {
  const model = CUSTOMER_CENTER_STATE.model || {};
  const inbox = asArray(model.inbox);
  const conversations = asArray(model.conversations);
  const tickets = asArray(model.tickets);
  const channels = asArray(model.channels);

  if (CUSTOMER_CENTER_STATE.loading) {
    return `
      <section class="page-grid">
        <div class="panel mhos-clean-surface">
          <div class="panel-kicker">Customer Center</div>
          <h2>Loading customer operations…</h2>
          <p class="muted">Fetching read-only customer projections.</p>
        </div>
      </section>
    `;
  }

  return `
    <section class="mhos-page-hero">
      <div>
        <p class="mhos-context-eyebrow">Customer Operations</p>
        <h1>Customer Center</h1>
        <p class="mhos-context-description">Read-only customer communication surface for inbox visibility, conversation previews, ticket/SLA state, channel readiness, and AI handoff preparation.</p>
      </div>
      <div class="mhos-hero-actions">
        <button class="btn btn-secondary" type="button" data-customer-center-action="refresh">Refresh read-only data</button>
        <button class="btn btn-primary" type="button" data-customer-center-action="ai-handoff">Prepare AI support prompt</button>
      </div>
    </section>

    <section class="mhos-executive-summary-grid">
      ${renderMetric("Open Conversations", conversations.length || "0", "Read-only")}
      ${renderMetric("Waiting Replies", countWaitingReplies(inbox), "No auto-send")}
      ${renderMetric("SLA Risk", countSlaRisk([...tickets, ...inbox]), "Review only")}
      ${renderMetric("Channels", channels.length || "0", "Send locked")}
    </section>

    ${renderProtectedReadGuard(model)}

    <section class="page-grid page-grid-2">
      <div class="panel mhos-clean-surface">
        <div class="panel-header"><div><div class="panel-kicker">Readiness Locks</div><h3>Read-only customer operations mode</h3></div></div>
        <div class="ops-list">
          <article class="ops-list-item"><div><strong>Read-only projections</strong><p>Customer Center can display safe projections only.</p></div><span class="card-badge">Allowed</span></article>
          <article class="ops-list-item"><div><strong>External send</strong><p>Replies and provider messages are locked.</p></div><span class="card-badge">Locked</span></article>
          <article class="ops-list-item"><div><strong>CRM / Ticket mutations</strong><p>CRM notes, ticket updates, and assignment changes require future confirmation gates.</p></div><span class="card-badge">Locked</span></article>
          <article class="ops-list-item"><div><strong>Calls / IVR</strong><p>Voice and IVR provider execution is not ready.</p></div><span class="card-badge">Locked</span></article>
        </div>
      </div>

      <div class="panel mhos-clean-surface">
        <div class="panel-header"><div><div class="panel-kicker">Safe Operating Rules</div><h3>Preview-first support workflow</h3></div></div>
        <p class="muted">Use Customer Center to review, summarize, and prepare handoffs. Any future outbound customer action must be approved in its owning surface with audit logging.</p>
      </div>
    </section>

    <section class="page-grid page-grid-2">
      <div class="panel mhos-clean-surface">
        <div class="panel-header"><div><div class="panel-kicker">Unified Inbox</div><h3>Inbound customer signals</h3></div></div>
        <div class="ops-list">${renderInbox(model)}</div>
      </div>

      <div class="panel mhos-clean-surface">
        <div class="panel-header"><div><div class="panel-kicker">Conversation Preview</div><h3>Masked conversation context</h3></div></div>
        <div class="ops-list">${renderConversations(model)}</div>
      </div>

      <div class="panel mhos-clean-surface">
        <div class="panel-header"><div><div class="panel-kicker">Tickets / SLA</div><h3>Support state snapshot</h3></div></div>
        <div class="ops-list">${renderTickets(model)}</div>
      </div>

      <div class="panel mhos-clean-surface">
        <div class="panel-header"><div><div class="panel-kicker">Channel Readiness</div><h3>Provider and action locks</h3></div></div>
        <div class="ops-list">${renderChannels(model)}</div>
      </div>
    </section>

    <section class="page-grid page-grid-2">
      <div class="panel mhos-clean-surface">
        <div class="panel-header"><div><div class="panel-kicker">Action Panel</div><h3>Safe handoffs only</h3></div></div>
        <p class="muted">These buttons only prepare navigation/context handoffs. They do not send customer messages or mutate records.</p>
        <div class="button-row">
          <button class="btn btn-secondary" type="button" data-customer-center-action="task-handoff">Prepare Task Center handoff</button>
          <button class="btn btn-secondary" type="button" data-customer-center-action="governance-handoff">Prepare Governance review</button>
          <button class="btn btn-secondary" type="button" data-customer-center-action="ai-handoff">Prepare AI Command prompt</button>
        </div>
        ${renderDisabledActions(model.disabledActions)}
      </div>

      <div class="panel mhos-clean-surface">
        <div class="panel-header"><div><div class="panel-kicker">AI Panel</div><h3>Draft and guidance only</h3></div></div>
        <p class="muted">AI may summarize, draft, translate, and suggest next steps. It must not send replies, update CRM, close tickets, place calls, or trigger IVR.</p>
      </div>
    </section>
  `;
}

function attachCustomerCenterHandlers(context) {
  const root = document.querySelector('[data-page="customer-center"]');
  if (!root) return;

  root.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-customer-center-action]");
    if (!button) return;

    const action = button.dataset.customerCenterAction;
    if (action === "refresh") {
      await loadAndRenderCustomerCenter(context);
      context.showMessage?.("Customer Center read-only data refreshed.");
      return;
    }

    if (action === "ai-handoff") {
      context.setSharedAiDraft?.({
        source: "customer-center",
        title: "Customer Center support prompt",
        prompt: "Review Customer Center read-only state. Summarize customer support risks, draft safe reply guidance, and identify escalation needs. Do not send replies or mutate CRM."
      });
      context.navigateTo?.("ai-command");
      context.showMessage?.("Customer Center context sent to AI Command.");
      return;
    }

    if (action === "task-handoff") {
      context.setSharedHandoff?.("task-center", {
        source: "customer-center",
        title: "Customer follow-up task preview",
        summary: "Review Customer Center state and prepare a human follow-up task. No customer mutation was performed."
      });
      context.navigateTo?.("task-center");
      context.showMessage?.("Customer task handoff prepared.");
      return;
    }

    if (action === "governance-handoff") {
      context.setSharedHandoff?.("governance", {
        source: "customer-center",
        title: "Customer communication governance review",
        summary: "Review customer reply/escalation risk before any external response. No send action was performed."
      });
      context.navigateTo?.("governance");
      context.showMessage?.("Customer governance handoff prepared.");
    }
  });
}

async function loadAndRenderCustomerCenter(context) {
  const projectName = context.projectName || context.state?.projectName || "default";
  CUSTOMER_CENTER_STATE.loading = true;
  context.rerender?.();

  try {
    CUSTOMER_CENTER_STATE.model = await loadCustomerCenterModel(projectName);
    CUSTOMER_CENTER_STATE.loaded = true;
    CUSTOMER_CENTER_STATE.error = "";
  } catch (error) {
    CUSTOMER_CENTER_STATE.error = error?.message || "Failed to load Customer Center.";
    CUSTOMER_CENTER_STATE.model = {
      protectedReadGuard: isProtectedReadGuard(error),
      guardMessage: getProtectedReadMessage(error),
      inbox: [],
      conversations: [],
      tickets: [],
      channels: [],
      blockers: [CUSTOMER_CENTER_STATE.error],
      warnings: [],
      disabledActions: buildDisabledActions()
    };
  } finally {
    CUSTOMER_CENTER_STATE.loading = false;
    context.rerender?.();
  }
}

export const customerCenterRoute = {
  id: "customer-center",
  label: "Customer Center",
  meta: {
    eyebrow: "Customer Operations",
    title: "Customer Center",
    description: "Read-only customer operations, inbox visibility, ticket/SLA state, and safe AI handoffs."
  },
  get template() {
    return `
      <section class="page is-active customer-center-page" data-page="customer-center">
        ${renderCustomerCenter({})}
      </section>
    `;
  }
};


if (typeof window !== "undefined") {
  window.__mhCustomerCenterRefresh = loadAndRenderCustomerCenter;
  window.__mhAttachCustomerCenterHandlers = attachCustomerCenterHandlers;
}

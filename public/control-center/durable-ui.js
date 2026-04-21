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

function matchesEntityLink(item, entityType, entityId) {
  if (!entityType || !entityId) return false;

  const linked = asObject(item?.linked_entity);
  const source = asObject(item?.source_entity);

  return [
    [item?.entity_type, item?.entity_id],
    [linked.entity_type, linked.entity_id],
    [source.entity_type, source.entity_id]
  ].some(([type, id]) =>
    asString(type) === asString(entityType) &&
    asString(id) === asString(entityId)
  );
}

function findEntityRecord(operations, entityType, entityId) {
  const collections = [
    "campaigns",
    "content_items",
    "media_jobs",
    "workflow_runs",
    "ai_commands",
    "tasks",
    "approvals",
    "queues"
  ];

  for (const key of collections) {
    const match = asArray(operations?.[key]?.items).find((item) =>
      matchesEntityLink(item, entityType, entityId) ||
      (
        asString(item?.id) === asString(entityId) &&
        (
          asString(item?.entity_type) === asString(entityType) ||
          (
            key === "campaigns" && entityType === "campaign"
          ) ||
          (
            key === "content_items" && entityType === "content_item"
          ) ||
          (
            key === "media_jobs" && entityType === "media_job"
          ) ||
          (
            key === "workflow_runs" && entityType === "workflow_run"
          ) ||
          (
            key === "ai_commands" && entityType === "ai_command"
          )
        )
      )
    );

    if (match) {
      return match;
    }
  }

  return null;
}

function renderDataRow(label, value, escapeHtml) {
  return `
    <div class="data-row">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(asString(value) || "-")}</strong>
    </div>
  `;
}

function renderMiniLinks(items, escapeHtml, fallback) {
  if (!items.length) {
    return `<div class="empty-box">${escapeHtml(fallback)}</div>`;
  }

  return `
    <div class="workflow-history-list">
      ${items.map((item) => `
        <div class="workflow-history-item">
          <strong>${escapeHtml(item.label)}</strong>
          <span>${escapeHtml(item.meta)}</span>
        </div>
      `).join("")}
    </div>
  `;
}

export function renderDurableSystemSummary(operations, escapeHtml, options = {}) {
  const entityType = asString(options.entityType);
  const entityId = asString(options.entityId);
  const entityRecord = entityType && entityId
    ? findEntityRecord(operations, entityType, entityId)
    : null;

  const linkedTasks = entityType && entityId
    ? asArray(operations?.tasks?.items).filter((item) => matchesEntityLink(item, entityType, entityId))
    : [];
  const linkedApprovals = entityType && entityId
    ? asArray(operations?.approvals?.items).filter((item) => matchesEntityLink(item, entityType, entityId))
    : [];
  const linkedHandoffs = entityType && entityId
    ? asArray(operations?.handoffs?.items).filter((item) => matchesEntityLink(item, entityType, entityId))
    : [];
  const linkedQueue = entityType && entityId
    ? asArray(operations?.queues?.items).filter((item) => matchesEntityLink(item, entityType, entityId))
    : [];

  const title = asString(options.title) || "Durable System Backbone";
  const kicker = asString(options.kicker) || "Shared Model";
  const emptyText = asString(options.emptyText) || "No durable backbone data is available yet.";

  if (!operations) {
    return `
      <section class="card">
        <div class="card-head">
          <h3>${escapeHtml(title)}</h3>
          <span class="card-badge neutral">${escapeHtml(kicker)}</span>
        </div>
        <div class="empty-box">${escapeHtml(emptyText)}</div>
      </section>
    `;
  }

  const globalRows = [
    ["Backbone", titleCase(operations.backbone?.status || "operational")],
    ["Durable entities", asArray(operations.backbone?.durable_entities).length],
    ["Open tasks", operations.tasks?.open_count ?? operations.tasks?.total ?? 0],
    ["Pending approvals", operations.approvals?.pending_count ?? operations.approvals?.total ?? 0],
    ["Active jobs", operations.queues?.active_count ?? operations.queues?.total ?? 0],
    ["Available handoffs", operations.handoffs?.available_count ?? operations.handoffs?.total ?? 0],
    ["Last updated", formatDateTime(operations.backbone?.last_updated || operations.generated_at)]
  ];

  const entityRows = entityRecord
    ? [
        ["Owner role", titleCase(entityRecord.owner_role || entityRecord.owner || entityRecord.source_role || "unassigned")],
        ["Review role", titleCase(entityRecord.review_role || entityRecord.reviewer_role || entityRecord.reviewer || "not set")],
        ["Status", titleCase(entityRecord.status || entityRecord.approval_status || entityRecord.publish_status || entityRecord.queue_status || "tracked")],
        ["Next owner", titleCase(entityRecord.next_owner_role || entityRecord.destination_role || "pending")],
        ["Linked tasks", linkedTasks.length],
        ["Linked approvals", linkedApprovals.length],
        ["Linked handoffs", linkedHandoffs.length],
        ["Downstream jobs", linkedQueue.length]
      ]
    : [];

  const connectionItems = [
    ...linkedTasks.slice(0, 3).map((item) => ({
      label: item.title || "Task",
      meta: `${titleCase(item.status || "open")} • ${titleCase(item.owner_role || item.owner || "owner pending")}`
    })),
    ...linkedApprovals.slice(0, 2).map((item) => ({
      label: item.title || "Approval",
      meta: `${titleCase(item.status || "pending")} • ${titleCase(item.reviewer_role || item.reviewer || "reviewer pending")}`
    })),
    ...linkedHandoffs.slice(0, 2).map((item) => ({
      label: `${titleCase(item.source_page || "system")} -> ${titleCase(item.destination_page || "destination")}`,
      meta: `${titleCase(item.status || "available")} • ${titleCase(item.destination_role_label || item.destination_role || "owner pending")}`
    }))
  ];

  return `
    <section class="card">
      <div class="card-head">
        <h3>${escapeHtml(title)}</h3>
        <span class="card-badge neutral">${escapeHtml(kicker)}</span>
      </div>
      <div class="publishing-secondary-grid">
        <div class="data-stack">
          ${globalRows.map(([label, value]) => renderDataRow(label, value, escapeHtml)).join("")}
        </div>
        ${
          entityRows.length
            ? `<div class="data-stack">${entityRows.map(([label, value]) => renderDataRow(label, value, escapeHtml)).join("")}</div>`
            : `<div class="empty-box">${escapeHtml("This view is reading the shared durable system model instead of page-only state.")}</div>`
        }
      </div>
      ${renderMiniLinks(
        connectionItems,
        escapeHtml,
        entityRows.length
          ? "No linked downstream records have been attached to this entity yet."
          : "Tasks, approvals, and handoffs will appear here as pages route shared work."
      )}
    </section>
  `;
}

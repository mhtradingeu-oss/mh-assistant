function asObject(value) {
  return value && typeof value === "object" ? value : {};
}

function asString(value) {
  if (value == null) return "";
  return String(value);
}

function clean(value) {
  return asString(value).trim();
}

function firstText(...values) {
  for (const value of values) {
    const text = clean(value);
    if (text) return text;
  }
  return "";
}

function nowIso() {
  return new Date().toISOString();
}

function buildScheduleTime(form) {
  const date = clean(form.publishDate);
  if (!date) return "";
  return `${date}T${clean(form.publishTime) || "09:00"}:00Z`;
}

function titleCase(value) {
  return asString(value)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function normalizeNotes(...values) {
  return values
    .flatMap((value) => {
      if (Array.isArray(value)) return value;
      if (typeof value === "string") return value.split(/\n+/);
      return [];
    })
    .map((item) => clean(item))
    .filter(Boolean);
}

function summarizeText(value, fallback = "No content payload available yet.") {
  const text = clean(value);
  if (!text) return fallback;
  return text.length > 180 ? `${text.slice(0, 177)}...` : text;
}

function extractHandoffSummary(handoff) {
  const payload = asObject(handoff?.payload);
  const output = asObject(payload.output);
  const draftContext = asObject(payload.draft_context);
  return {
    id: asString(handoff?.id || payload.workflow_id || payload.prompt || payload.workflow_title),
    sourcePage: asString(handoff?.source_page || "workflows"),
    workflowId: asString(payload.workflow_id),
    title: firstText(output.title, payload.workflow_title, draftContext.lastResponseTitle, "Workflow output"),
    project: firstText(draftContext.projectName, payload.project_name, output.project),
    campaign: firstText(payload.campaign_name, output.campaign, output.campaignName),
    channel: firstText(output.channel, payload.channel),
    contentItem: firstText(output.content_item, output.contentItem, output.summary, payload.prompt),
    summary: firstText(output.summary, output.description, payload.prompt, draftContext.lastCommand),
    output
  };
}

export function buildSchedulePayload(session, status = "scheduled") {
  return {
    title: firstText(session.form.title, session.form.contentItem, "Publishing item"),
    wave_name: session.form.campaign,
    campaign: session.form.campaign,
    channel: session.form.channel,
    content_item: session.form.contentItem,
    scheduled_for: buildScheduleTime(session.form),
    status,
    approval_status: session.form.approvalStatus,
    mode: "semi_auto",
    offer: "",
    notes: session.form.notes
  };
}

export function buildLocalDraftPayload(session, status = "draft") {
  return {
    id: session.formSourceId || session.selectedId || "",
    title: firstText(session.form.title, session.form.contentItem, "Publishing draft"),
    project: session.form.project,
    campaign: session.form.campaign,
    channel: session.form.channel,
    contentItem: session.form.contentItem,
    scheduledFor: buildScheduleTime(session.form),
    approvalStatus: session.form.approvalStatus,
    status,
    notes: session.form.notes,
    updatedAt: nowIso()
  };
}

export function buildPublishingAiPrompt(projectName, selectedItem, session, handoff) {
  const handoffSummary = handoff ? extractHandoffSummary(handoff) : null;
  return [
    `Review this publishing execution plan for ${projectName || "the current project"}.`,
    `Project: ${session.form.project || projectName || "not set"}`,
    `Campaign: ${session.form.campaign || "not set"}`,
    `Channel: ${session.form.channel || selectedItem?.channel || "not set"}`,
    `Content item: ${session.form.contentItem || selectedItem?.contentItem || "not set"}`,
    `Publish window: ${session.form.publishDate ? `${session.form.publishDate} ${session.form.publishTime || "09:00"}` : "not scheduled"}`,
    `Approval: ${titleCase(session.form.approvalStatus || selectedItem?.approvalStatus || "draft")}`,
    handoffSummary ? `Workflow handoff: ${handoffSummary.title} - ${summarizeText(handoffSummary.summary)}` : "Workflow handoff: none",
    `Notes: ${session.form.notes || normalizeNotes(selectedItem?.notes).join("; ") || "none"}`
  ].join("\n");
}

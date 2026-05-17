import {
  createProjectApproval,
  createProjectHandoff,
  createProjectTask,
  decideProjectApproval,
  executeProjectAiCommand,
  fetchProjectOperations,
  listProjectApprovals,
  listProjectContentItems,
  listProjectEvents,
  listProjectHandoffs,
  listProjectTasks,
  saveProjectContentItem
} from "../api.js";
import { getAssetNextAction, renderAssetDependencyRows } from "../asset-library.js";
import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";

const contentStudioSessions = new Map();
const CONTENT_LOCAL_DRAFTS_KEY = "mh-content-studio-local-drafts-v1";
const CONTENT_LIBRARY_LOCAL_ASSETS_KEY = "mh-media-library-assets-v1";

const CONTENT_MODES = [
  "social-post",
  "caption",
  "reel-script",
  "video-script",
  "blog-draft",
  "email",
  "marketplace-copy",
  "ad-copy"
];

const CONTENT_MODE_LABELS = {
  "social-post": "Social Post",
  caption: "Caption",
  "reel-script": "Reel Script",
  "video-script": "Video Script",
  "blog-draft": "Blog Draft",
  email: "Email",
  "marketplace-copy": "Marketplace Copy",
  "ad-copy": "Ad Copy"
};

const CONTENT_STATUSES = [
  "draft",
  "prompt_ready",
  "needs_review",
  "approved",
  "sent_to_media",
  "sent_to_publishing"
];

const CONTENT_ROLE_DEFAULTS = {
  serviceDomain: "content",
  ownerRole: "writer",
  reviewRole: "compliance_reviewer",
  mediaRole: "designer",
  handoffRole: "publisher"
};

const WRITING_AGENTS = [
  {
    id: "content-strategist",
    title: "Content Strategist",
    purpose: "Plan message angles and format mix that moves campaign readiness quickly.",
    bestUse: "When choosing what to write first across social, email, and marketplace.",
    suggestedPrompt: "Act as Content Strategist. Build a priority content plan by channel with hooks, outcomes, and handoff order."
  },
  {
    id: "copywriter",
    title: "Copywriter",
    purpose: "Write concise, conversion-focused copy with clear value framing.",
    bestUse: "When you need strong post copy, ad text, or direct-response messaging.",
    suggestedPrompt: "Act as Copywriter. Produce high-conversion copy with a strong hook, body value stack, and clear CTA."
  },
  {
    id: "seo-writer",
    title: "SEO Writer",
    purpose: "Draft discoverable long-form content with search intent alignment.",
    bestUse: "When creating blog drafts and landing content for organic traffic.",
    suggestedPrompt: "Act as SEO Writer. Produce an SEO-structured draft with intent match, metadata, headings, and semantic coverage."
  },
  {
    id: "social-writer",
    title: "Social Media Writer",
    purpose: "Create channel-native posts with platform-fit pacing and style.",
    bestUse: "When preparing Instagram, TikTok, Facebook, or YouTube text assets.",
    suggestedPrompt: "Act as Social Media Writer. Write platform-native content variants with hook lines, scroll-stopping openings, and CTA endings."
  },
  {
    id: "email-writer",
    title: "Email Writer",
    purpose: "Create subject, preheader, and body copy that improves open and click-through.",
    bestUse: "When building campaign newsletters, launch emails, and promos.",
    suggestedPrompt: "Act as Email Writer. Generate subject, preheader, and body with clear structure, benefit-led copy, and CTA clarity."
  },
  {
    id: "script-writer",
    title: "Script Writer",
    purpose: "Turn ideas into scene-ready scripts with hooks, beats, and CTA flow.",
    bestUse: "When creating reel/video scripts that will feed Media Studio production.",
    suggestedPrompt: "Act as Script Writer. Create a short-form script with opening hook, scene beats, voiceover-friendly lines, and CTA close."
  },
  {
    id: "marketplace-copywriter",
    title: "Marketplace Copywriter",
    purpose: "Write listing-optimized product copy for conversion and clarity.",
    bestUse: "When drafting marketplace titles, bullets, and descriptions.",
    suggestedPrompt: "Act as Marketplace Copywriter. Draft title, bullet points, and description focused on conversion while keeping product truth."
  },
  {
    id: "brand-guardian",
    title: "Brand Guardian",
    purpose: "Validate tone, claims, and compliance before downstream handoffs.",
    bestUse: "Before approval or sending drafts to Media Studio or Publishing.",
    suggestedPrompt: "Act as Brand Guardian. Audit this draft for brand tone, claim risk, and handoff readiness."
  }
];

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

function clean(value) {
  return asString(value).trim();
}

function toKey(value) {
  return clean(value).toLowerCase();
}

function firstText(...values) {
  for (const value of values) {
    const text = clean(value);
    if (text) return text;
  }
  return "";
}

function titleCase(value) {
  return asString(value)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function formatCount(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "0";
  return String(Math.max(0, Math.round(parsed)));
}

function nowIso() {
  return new Date().toISOString();
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

function projectKey(projectName) {
  return toKey(projectName) || "__default__";
}

function normalizeStatus(value, fallback = "draft") {
  const normalized = toKey(value);
  if (!normalized) return fallback;
  if (["draft"].includes(normalized)) return "draft";
  if (["prompt_ready", "ready", "prompt ready"].includes(normalized)) return "prompt_ready";
  if (["needs_review", "needs review", "review", "pending_approval"].includes(normalized)) return "needs_review";
  if (["approved", "complete", "completed"].includes(normalized)) return "approved";
  if (["sent_to_media", "sent to media", "media_handoff", "media handoff"].includes(normalized)) return "sent_to_media";
  if (["sent_to_publishing", "sent to publishing", "publishing_handoff", "publishing handoff"].includes(normalized)) return "sent_to_publishing";
  return fallback;
}

function statusTone(status) {
  if (["approved", "sent_to_media", "sent_to_publishing"].includes(status)) return "success";
  if (["prompt_ready", "needs_review"].includes(status)) return "warning";
  return "neutral";
}

function modeLabel(mode) {
  return CONTENT_MODE_LABELS[mode] || titleCase(mode || "social-post");
}

function requestTypeForMode(mode) {
  if (["reel-script", "video-script"].includes(mode)) return "script";
  if (mode === "blog-draft") return "blog";
  if (mode === "marketplace-copy") return "marketplace";
  if (mode === "ad-copy") return "ad";
  if (mode === "email") return "email";
  return "social";
}

function defaultForm(state, mode = "social-post") {
  const context = asObject(state.context);
  const overview = asObject(state.data.overview?.overview);
  return {
    mode,
    project: firstText(context.currentProject, overview.project_name),
    campaign: firstText(context.activeCampaign, overview.active_campaign),
    product: firstText(overview.project_name, context.currentProject),
    channel: "instagram",
    language: "English",
    tone: firstText(overview.brand_voice, "Premium, direct, clear"),
    objective: firstText(overview.primary_goal, "Create conversion-ready content"),
    brief: "",
    title: "",
    status: "draft"
  };
}

function readDraftMap() {
  if (typeof window === "undefined") return {};
  try {
    const parsed = JSON.parse(window.localStorage?.getItem(CONTENT_LOCAL_DRAFTS_KEY) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (_) {
    return {};
  }
}

function writeDraftMap(map) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage?.setItem(CONTENT_LOCAL_DRAFTS_KEY, JSON.stringify(map || {}));
  } catch (_) {}
}

function loadLocalDrafts(projectName) {
  return asArray(readDraftMap()[projectKey(projectName)]);
}

function saveLocalDraft(projectName, draft) {
  const map = readDraftMap();
  const key = projectKey(projectName);
  const next = {
    ...asObject(draft),
    id: asString(draft.id || `local-content-${Date.now()}`),
    source: "Local draft",
    localOnly: true,
    updated_at: nowIso()
  };
  const existing = asArray(map[key]).filter((item) => asString(item.id) !== next.id);
  map[key] = [next, ...existing].slice(0, 60);
  writeDraftMap(map);
  return next;
}

function readContentLibraryMap() {
  if (typeof window === "undefined") return {};
  try {
    const parsed = JSON.parse(window.localStorage?.getItem(CONTENT_LIBRARY_LOCAL_ASSETS_KEY) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (_) {
    return {};
  }
}

function writeContentLibraryMap(map) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage?.setItem(CONTENT_LIBRARY_LOCAL_ASSETS_KEY, JSON.stringify(map || {}));
  } catch (_) {}
}

function loadLocalLibraryAssets(projectName) {
  const map = readContentLibraryMap();
  return asArray(map[projectKey(projectName)]);
}

function upsertLocalLibraryAsset(projectName, asset) {
  const map = readContentLibraryMap();
  const key = projectKey(projectName);
  const next = {
    ...asObject(asset),
    id: asString(asset.id || `content-library-${Date.now()}`),
    source_signature: asString(asset.source_signature),
    updated_at: nowIso()
  };
  const existing = asArray(map[key]).filter((item) => {
    const sameId = asString(item.id) === next.id;
    const sameSig = next.source_signature && asString(item.source_signature) === next.source_signature;
    return !(sameId || sameSig);
  });
  map[key] = [next, ...existing].slice(0, 120);
  writeContentLibraryMap(map);
  return next;
}

function nextVersionId(versions = []) {
  return `v${asArray(versions).length + 1}`;
}

function createVersionEntry({
  id,
  mode = "social-post",
  prompt = "",
  outputContent = "",
  language = "English",
  tone = "",
  channel = "",
  readinessStatus = "draft",
  approvalStatus = "draft",
  notes = "",
  libraryAssetRef = null,
  createdAt
} = {}, existing = []) {
  return {
    id: asString(id || nextVersionId(existing)),
    mode: asString(mode || "social-post"),
    prompt: asString(prompt),
    output_content: asString(outputContent),
    language: asString(language || "English"),
    tone: asString(tone),
    channel: asString(channel),
    readiness_status: normalizeStatus(readinessStatus || "draft", "draft"),
    approval_status: asString(approvalStatus || "draft"),
    notes: asString(notes),
    library_asset_ref: libraryAssetRef == null ? null : asObject(libraryAssetRef),
    timestamp: asString(createdAt || nowIso())
  };
}

function normalizeVersionEntry(rawVersion, index = 0) {
  const raw = asObject(rawVersion);
  return createVersionEntry({
    id: firstText(raw.id, raw.version_id, `v${index + 1}`),
    mode: firstText(raw.mode, raw.content_type, "social-post"),
    prompt: firstText(raw.prompt, raw.input_prompt),
    outputContent: firstText(raw.output_content, raw.content, raw.body, raw.draft),
    language: firstText(raw.language, "English"),
    tone: firstText(raw.tone),
    channel: firstText(raw.channel),
    readinessStatus: firstText(raw.readiness_status, raw.status, "draft"),
    approvalStatus: firstText(raw.approval_status, "draft"),
    notes: firstText(raw.notes),
    libraryAssetRef: raw.library_asset_ref || null,
    createdAt: firstText(raw.timestamp, raw.created_at, raw.updated_at)
  });
}

function createVersioningState(seed = {}) {
  const base = createVersionEntry({
    id: "v1",
    mode: firstText(seed.mode, "social-post"),
    prompt: firstText(seed.prompt),
    outputContent: firstText(seed.outputContent),
    language: firstText(seed.language, "English"),
    tone: firstText(seed.tone),
    channel: firstText(seed.channel),
    readinessStatus: firstText(seed.readinessStatus, "draft"),
    approvalStatus: firstText(seed.approvalStatus, "draft"),
    notes: firstText(seed.notes),
    createdAt: firstText(seed.timestamp, nowIso())
  });
  return {
    selectedVersionId: base.id,
    compareMode: false,
    compareNotes: "",
    versions: [base]
  };
}

function ensureVersioning(session) {
  if (!session.versioning) {
    session.versioning = createVersioningState({
      mode: session.form?.mode || "social-post",
      prompt: session.form?.brief,
      language: session.form?.language,
      tone: session.form?.tone,
      channel: session.form?.channel,
      readinessStatus: session.form?.status || "draft"
    });
  }
  if (!asArray(session.versioning.versions).length) {
    session.versioning.versions = createVersioningState().versions;
  }
  if (!session.versioning.selectedVersionId) {
    session.versioning.selectedVersionId = session.versioning.versions[session.versioning.versions.length - 1]?.id || "v1";
  }
  return session.versioning;
}

function selectedVersionEntry(session) {
  const versioning = ensureVersioning(session);
  const selected = versioning.versions.find((item) => item.id === versioning.selectedVersionId);
  if (selected) return selected;
  const fallback = versioning.versions[versioning.versions.length - 1] || null;
  versioning.selectedVersionId = fallback?.id || "v1";
  return fallback;
}

function previousVersionEntry(session) {
  const versioning = ensureVersioning(session);
  const current = selectedVersionEntry(session);
  const index = versioning.versions.findIndex((item) => item.id === current?.id);
  if (index <= 0) return null;
  return versioning.versions[index - 1] || null;
}

function appendVersion(session, versionInput) {
  const versioning = ensureVersioning(session);
  const next = createVersionEntry({
    ...asObject(versionInput),
    id: nextVersionId(versioning.versions)
  }, versioning.versions);
  versioning.versions = [...versioning.versions, next];
  versioning.selectedVersionId = next.id;
  return next;
}

function syncVersionFromForm(session) {
  const selected = selectedVersionEntry(session);
  if (!selected) return;
  selected.mode = session.form.mode || selected.mode;
  selected.prompt = clean(session.form.brief);
  selected.language = clean(session.form.language || "English");
  selected.tone = clean(session.form.tone);
  selected.channel = clean(session.form.channel);
  selected.readiness_status = normalizeStatus(session.form.status || selected.readiness_status || "draft", "draft");
}

function applySelectedVersionToForm(session) {
  const selected = selectedVersionEntry(session);
  if (!selected) return;
  session.form.mode = selected.mode || session.form.mode || "social-post";
  session.form.brief = selected.prompt || session.form.brief || "";
  session.form.language = selected.language || session.form.language || "English";
  session.form.tone = selected.tone || session.form.tone || "";
  session.form.channel = selected.channel || session.form.channel || "";
  session.form.status = normalizeStatus(selected.readiness_status || session.form.status || "draft", "draft");
}

function hydrateVersioningFromItem(item) {
  const raw = asObject(item);
  const versions = asArray(raw.content_versions || raw.output_versions || raw.versions)
    .map((entry, index) => normalizeVersionEntry(entry, index))
    .filter((entry) => entry.id);
  if (versions.length) {
    return {
      selectedVersionId: versions[versions.length - 1].id,
      compareMode: false,
      compareNotes: "",
      versions
    };
  }
  return createVersioningState({
    mode: firstText(raw.type, raw.mode, "social-post"),
    prompt: firstText(raw.prompt, raw.brief),
    outputContent: firstText(raw.draft),
    language: firstText(raw.language, "English"),
    tone: firstText(raw.tone),
    channel: firstText(raw.channel),
    readinessStatus: firstText(raw.status, "draft"),
    approvalStatus: firstText(raw.approval_status, "draft")
  });
}

function normalizeContentItem(rawItem) {
  const raw = asObject(rawItem);
  const mode = firstText(raw.type, raw.content_type, raw.mode, "social-post");
  return {
    id: firstText(raw.id, raw.content_item_id),
    title: firstText(raw.title, `${modeLabel(mode)} draft`),
    mode: CONTENT_MODES.includes(mode) ? mode : "social-post",
    project: firstText(raw.project, raw.project_name),
    campaign: firstText(raw.campaign, raw.campaign_id, raw.campaign_name),
    product: firstText(raw.product),
    channel: firstText(raw.channel, raw.destination),
    language: firstText(raw.language, "English"),
    tone: firstText(raw.tone),
    objective: firstText(raw.objective),
    brief: firstText(raw.prompt, raw.brief),
    draft: firstText(raw.draft, raw.body),
    status: normalizeStatus(raw.status, "draft"),
    approval_status: asString(raw.approval_status || "draft"),
    destination: firstText(raw.destination, raw.publishing_destination),
    notes: asArray(raw.notes),
    linked_tasks: asArray(raw.linked_tasks),
    linked_approvals: asArray(raw.linked_approvals),
    linked_handoffs: asArray(raw.linked_handoffs),
    content_versions: asArray(raw.content_versions || raw.output_versions || []),
    source: firstText(raw.source, raw.localOnly ? "Local draft" : "Backend"),
    localOnly: Boolean(raw.localOnly),
    created_at: firstText(raw.created_at),
    updated_at: firstText(raw.updated_at)
  };
}

function compareContentItems(a, b) {
  const order = {
    needs_review: 0,
    approved: 1,
    sent_to_media: 2,
    sent_to_publishing: 3,
    prompt_ready: 4,
    draft: 5
  };
  const aOrder = order[a.status] ?? 99;
  const bOrder = order[b.status] ?? 99;
  if (aOrder !== bOrder) return aOrder - bOrder;
  return (Date.parse(b.updated_at || b.created_at) || 0) - (Date.parse(a.updated_at || a.created_at) || 0);
}

function mergeItems(backendItems, localItems) {
  const backendIds = new Set(backendItems.map((item) => asString(item.id)));
  return [
    ...localItems.filter((item) => !backendIds.has(asString(item.id))),
    ...backendItems
  ].sort(compareContentItems);
}

function ensureSession(projectName, state) {
  const key = projectKey(projectName);
  if (!contentStudioSessions.has(key)) {
    contentStudioSessions.set(key, {
      loaded: false,
      loading: false,
      error: "",
      items: [],
      tasks: [],
      approvals: [],
      handoffs: [],
      events: [],
      operations: null,
      selectedId: "",
      formSourceId: "",
      form: defaultForm(state, "social-post"),
      versioning: createVersioningState(),
      validation: {},
      draftMessage: "",
      loadedHandoffId: "",
      saving: false,
      isCreatingNew: true,
      aiPromptDraft: ""
    });
  }
  return contentStudioSessions.get(key);
}

function getSelectedItem(session) {
  return session.items.find((item) => asString(item.id) === asString(session.selectedId)) || null;
}

function syncFormFromItem(session, item) {
  if (!item) return;
  session.form = {
    mode: item.mode || "social-post",
    project: item.project || session.form.project || "",
    campaign: item.campaign || "",
    product: item.product || "",
    channel: item.channel || "instagram",
    language: item.language || "English",
    tone: item.tone || "",
    objective: item.objective || "",
    brief: item.brief || item.draft || "",
    title: item.title || "",
    status: item.status || "draft"
  };
  session.versioning = hydrateVersioningFromItem(item);
  session.formSourceId = item.id;
  session.validation = {};
  session.isCreatingNew = false;
}

function resetForm(session, state, mode = "social-post") {
  session.form = defaultForm(state, mode);
  session.versioning = createVersioningState({
    mode,
    prompt: "",
    outputContent: "",
    language: "English",
    tone: session.form.tone,
    channel: session.form.channel,
    readinessStatus: "draft"
  });
  session.formSourceId = "";
  session.selectedId = "";
  session.validation = {};
  session.isCreatingNew = true;
  session.draftMessage = "";
}

function syncSessionForm(session, form) {
  if (!form) return;
  Array.from(form.elements).forEach((field) => {
    if (!field.name) return;
    session.form[field.name] = field.value || "";
  });
  syncVersionFromForm(session);
}

function validateComposer(session, intent = "save") {
  const errors = {};
  const form = session.form;
  if (!clean(form.project)) errors.project = "Project is required.";
  if (!clean(form.campaign)) errors.campaign = "Campaign is required.";
  if (!clean(form.product)) errors.product = "Product is required.";
  if (!clean(form.channel)) errors.channel = "Channel is required.";
  if (!clean(form.language)) errors.language = "Language is required.";
  if (!clean(form.tone)) errors.tone = "Tone is required.";
  if (!clean(form.objective)) errors.objective = "Objective is required.";
  if (!clean(form.brief) && intent !== "load-handoff") errors.brief = "Main prompt / brief is required.";
  session.validation = errors;
  return !Object.keys(errors).length;
}

function fieldError(session, key, escapeHtml) {
  const message = session.validation[key];
  return message ? `<div class="content-inline-error">${escapeHtml(message)}</div>` : "";
}

function buildContentPayload(session, status = "draft") {
  const versioning = ensureVersioning(session);
  const selected = selectedVersionEntry(session);
  return {
    id: session.formSourceId || session.selectedId || "",
    title: firstText(session.form.title, `${modeLabel(session.form.mode)} for ${session.form.campaign || session.form.project || "campaign"}`),
    type: session.form.mode,
    mode: session.form.mode,
    project: session.form.project,
    campaign: session.form.campaign,
    product: session.form.product,
    channel: session.form.channel,
    language: session.form.language,
    tone: session.form.tone,
    objective: session.form.objective,
    prompt: session.form.brief,
    brief: session.form.brief,
    draft: firstText(selected?.output_content, ""),
    status,
    approval_status: firstText(selected?.approval_status, "draft"),
    destination: session.form.channel,
    owner_role: CONTENT_ROLE_DEFAULTS.ownerRole,
    review_role: CONTENT_ROLE_DEFAULTS.reviewRole,
    service_domain: CONTENT_ROLE_DEFAULTS.serviceDomain,
    content_versions: asArray(versioning.versions).map((version) => ({
      id: version.id,
      mode: version.mode,
      prompt: version.prompt,
      output_content: version.output_content,
      language: version.language,
      tone: version.tone,
      channel: version.channel,
      readiness_status: version.readiness_status,
      approval_status: version.approval_status,
      notes: version.notes,
      library_asset_ref: version.library_asset_ref || null,
      timestamp: version.timestamp
    })),
    actor: "content-studio"
  };
}

function syncItemsWithLocalSave(session, projectName, payload) {
  const saved = saveLocalDraft(projectName, payload);
  const normalized = normalizeContentItem(saved);
  session.items = mergeItems(
    session.items.filter((item) => asString(item.id) !== asString(normalized.id)),
    [normalized]
  );
  session.selectedId = normalized.id;
  session.formSourceId = normalized.id;
  return normalized;
}

async function persistContentRecord({ projectName, state, session, status, showMessage }) {
  const payload = buildContentPayload(session, status);
  const localItem = syncItemsWithLocalSave(session, projectName, payload);

  if (!projectName) {
    showMessage?.("Content draft saved locally.");
    return localItem;
  }

  try {
    const result = await saveProjectContentItem(projectName, payload);
    const backendItem = normalizeContentItem(result.content_item || payload);
    session.items = mergeItems(
      session.items.filter((item) => asString(item.id) !== asString(localItem.id)),
      [backendItem]
    );
    session.selectedId = backendItem.id || localItem.id;
    session.formSourceId = session.selectedId;
    showMessage?.("Content draft saved.");
    return backendItem;
  } catch (_) {
    showMessage?.("Backend content save unavailable; local draft kept.");
    return localItem;
  }
}

function getVersionMetrics(session) {
  const selected = selectedVersionEntry(session);
  const previous = previousVersionEntry(session);
  const promptChanged = Boolean(previous && clean(previous.prompt) !== clean(selected?.prompt));
  const contentChanged = Boolean(previous && clean(previous.output_content) !== clean(selected?.output_content));
  const statusChanged = Boolean(previous && clean(previous.readiness_status) !== clean(selected?.readiness_status));
  return { selected, previous, promptChanged, contentChanged, statusChanged };
}

function parseLines(text) {
  return asString(text).split(/\n+/).map((line) => clean(line)).filter(Boolean);
}

function computeSuggestedMediaBrief(mode, version, form) {
  const content = firstText(version?.output_content, version?.prompt, form.brief);
  return [
    `Create media assets for ${modeLabel(mode)} content.`,
    `Channel: ${form.channel || "not set"}`,
    `Language/Tone: ${firstText(form.language, version?.language, "English")} / ${firstText(form.tone, version?.tone, "not set")}`,
    `Core message: ${firstText(content, "No content body yet.")}`,
    "Output target: product-visible, publishing-safe, and campaign-consistent creative."
  ].join("\n");
}

function buildInboundSummary(handoff) {
  const payload = asObject(handoff?.payload);
  const output = asObject(payload.output);
  const selectedVersion = asObject(payload.selected_version);
  return {
    id: asString(handoff?.id || payload.id || payload.workflow_id || payload.content_item_id),
    sourcePage: asString(handoff?.source_page || "workflows"),
    title: firstText(payload.title, output.title, selectedVersion.title),
    project: firstText(payload.project, output.project),
    campaign: firstText(payload.campaign, output.campaign, payload.campaign_id),
    product: firstText(payload.product, output.product),
    channel: firstText(payload.channel, output.channel),
    mode: firstText(payload.content_type, selectedVersion.mode, payload.type),
    language: firstText(payload.language, selectedVersion.language),
    tone: firstText(payload.tone, selectedVersion.tone),
    objective: firstText(payload.objective, output.goal, output.objective),
    brief: firstText(selectedVersion.prompt, payload.prompt, output.summary, payload.brief),
    contentBody: firstText(selectedVersion.output_content, payload.content, payload.body, output.content_item),
    readinessStatus: firstText(selectedVersion.readiness_status, payload.readiness_status, "draft"),
    approvalStatus: firstText(selectedVersion.approval_status, payload.approval_status, "draft")
  };
}

function getInboundHandoff(projectName, session) {
  const operations = session.operations || {};
  return (
    getSharedHandoff(projectName, "content-studio", operations, "workflows") ||
    getSharedHandoff(projectName, "content-studio", operations, "ai-command") ||
    getSharedHandoff(projectName, "content-studio", operations)
  );
}

function applyInboundHandoff(projectName, session) {
  const handoff = getInboundHandoff(projectName, session);
  if (!handoff) return;
  const summary = buildInboundSummary(handoff);
  if (!summary.id || summary.id === session.loadedHandoffId) return;
  session.loadedHandoffId = summary.id;
}

async function loadWorkspace(projectName, state, session, rerender) {
  if (!projectName || session.loading || session.loaded) return;
  session.loading = true;
  session.error = "";
  rerender();

  try {
    const [contentItems, tasks, approvals, handoffs, events, operations] = await Promise.all([
      listProjectContentItems(projectName, { limit: 120 }),
      listProjectTasks(projectName, 120),
      listProjectApprovals(projectName, 120),
      listProjectHandoffs(projectName, { limit: 120 }),
      listProjectEvents(projectName, 120),
      fetchProjectOperations(projectName)
    ]);

    const backendItems = asArray(contentItems.items).map((item) => normalizeContentItem(item));
    const localItems = loadLocalDrafts(projectName).map((item) => normalizeContentItem(item));
    session.items = mergeItems(backendItems, localItems);
    session.tasks = asArray(tasks.items);
    session.approvals = asArray(approvals.items);
    session.handoffs = asArray(handoffs.items);
    session.events = asArray(events.items);
    session.operations = operations || null;
    session.loaded = true;
    applyInboundHandoff(projectName, session);
    if (!session.selectedId) session.selectedId = session.items[0]?.id || "";
  } catch (error) {
    session.error = "Backend content data unavailable. Content Studio is running in local draft mode.";
    session.items = mergeItems([], loadLocalDrafts(projectName).map((item) => normalizeContentItem(item)));
    session.loaded = true;
    applyInboundHandoff(projectName, session);
  } finally {
    session.loading = false;
    rerender();
  }
}

function getMetrics(session) {
  const items = asArray(session.items);
  return {
    total: items.length,
    ready: items.filter((item) => ["prompt_ready"].includes(item.status)).length,
    needsReview: items.filter((item) => item.status === "needs_review").length,
    approved: items.filter((item) => item.status === "approved").length,
    sentMedia: items.filter((item) => item.status === "sent_to_media").length,
    sentPublishing: items.filter((item) => item.status === "sent_to_publishing").length
  };
}

function buildRecommendation(metrics, selectedItem) {
  if (!selectedItem) {
    return {
      action: "Start a draft from the main brief",
      why: "A clear first draft unlocks versioning, review, and downstream media/publishing handoffs."
    };
  }

  if (selectedItem.status === "needs_review") {
    return {
      action: "Approve or request revision on the selected draft",
      why: "Review decisions reduce production delay and move content into executable lanes."
    };
  }

  if (selectedItem.status === "approved") {
    return {
      action: "Send approved content to Media Studio",
      why: "Approved copy can now drive structured media generation with fewer revisions."
    };
  }

  if (metrics.sentMedia + metrics.sentPublishing > 0) {
    return {
      action: "Create next content variant",
      why: "Version expansion keeps campaign momentum while existing content moves downstream."
    };
  }

  return {
    action: "Improve brief and generate next version",
    why: "Higher-quality prompt context improves draft quality and handoff readiness."
  };
}

function renderScopedStyles() {
  return `
    <style>
      .content-smart-root {
        display: grid;
        gap: 16px;
        min-width: 0;
      }

      .content-smart-grid {
        display: grid;
        gap: 16px;
        min-width: 0;
      }

      .content-main,
      .content-side {
        display: grid;
        gap: 16px;
        min-width: 0;
        align-content: start;
      }

      .content-card {
        min-width: 0;
        overflow: hidden;
      }

      .content-overview-grid,
      .content-impact-grid,
      .content-preview-grid,
      .content-version-grid,
      .content-handoff-grid {
        display: grid;
        gap: 10px;
        min-width: 0;
      }

      .content-overview-item,
      .content-impact-chip,
      .content-data-item {
        border: 1px solid var(--border, rgba(148, 163, 184, 0.24));
        border-radius: 8px;
        padding: 12px;
        background: var(--surface-muted, rgba(15, 23, 42, 0.03));
        min-width: 0;
      }

      .content-overview-item span,
      .content-impact-chip small,
      .content-data-item span {
        display: block;
        color: var(--text-muted, #64748b);
        font-size: 0.78rem;
      }

      .content-overview-item strong,
      .content-impact-chip strong,
      .content-data-item strong {
        display: block;
        margin-top: 4px;
        overflow-wrap: anywhere;
      }

      .content-impact-chip {
        min-width: 0;
      }

      .content-mode-tabs,
      .content-action-row,
      .content-version-tabs,
      .content-agent-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        min-width: 0;
      }

      .content-mode-tab,
      .content-version-tab {
        min-height: 34px;
        border: 1px solid var(--border, rgba(148, 163, 184, 0.28));
        border-radius: 999px;
        padding: 6px 12px;
        background: transparent;
        cursor: pointer;
        color: inherit;
      }

      .content-mode-tab.is-active,
      .content-version-tab.is-active {
        border-color: var(--accent, #2563eb);
        background: rgba(37, 99, 235, 0.08);
      }

      .content-inline-error {
        margin-top: 6px;
        color: var(--danger, #b91c1c);
        font-size: 0.82rem;
        line-height: 1.35;
      }

      .content-text-box {
        border: 1px solid var(--border, rgba(148, 163, 184, 0.24));
        border-radius: 8px;
        padding: 12px;
        background: rgba(15, 23, 42, 0.04);
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        line-height: 1.45;
      }

      .content-queue-list,
      .content-agent-grid {
        display: grid;
        gap: 10px;
      }

      .content-queue-item,
      .content-agent-card {
        width: 100%;
        border: 1px solid var(--border, rgba(148, 163, 184, 0.24));
        border-radius: 8px;
        background: #f8fafc;
        color: #0f172a;
        text-align: left;
        padding: 12px;
        min-width: 0;
      }

      .content-queue-item {
        cursor: pointer;
      }

      .content-queue-item.is-active {
        border-color: var(--accent, #2563eb);
        background: #eef4ff;
      }

      .content-queue-title {
        display: block;
        font-weight: 700;
        overflow-wrap: anywhere;
      }

      .content-queue-meta,
      .content-copy,
      .content-hint {
        color: #334155;
        overflow-wrap: anywhere;
      }

      .content-agent-card strong,
      .content-agent-card p {
        overflow-wrap: anywhere;
      }

      .content-preview-social,
      .content-preview-email,
      .content-preview-marketplace,
      .content-preview-ad,
      .content-preview-script,
      .content-preview-blog {
        border: 1px solid var(--border, rgba(148, 163, 184, 0.24));
        border-radius: 10px;
        padding: 12px;
        background: #ffffff;
        min-width: 0;
      }

      .content-preview-social .headline,
      .content-preview-blog .headline,
      .content-preview-email .headline,
      .content-preview-marketplace .headline,
      .content-preview-ad .headline,
      .content-preview-script .headline {
        font-weight: 700;
        margin-bottom: 8px;
        overflow-wrap: anywhere;
      }

      .content-preview-script .scene,
      .content-preview-marketplace .bullet,
      .content-preview-blog .section,
      .content-preview-email .segment,
      .content-preview-ad .segment {
        margin-top: 8px;
        overflow-wrap: anywhere;
      }

      @media (min-width: 980px) {
        .content-smart-grid {
          grid-template-columns: minmax(0, 1.35fr) minmax(300px, 0.85fr);
          align-items: start;
        }

        .content-overview-grid,
        .content-impact-grid,
        .content-preview-grid,
        .content-version-grid,
        .content-handoff-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .content-agent-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
    </style>
  `;
}

function renderOverview(metrics, escapeHtml) {
  return `
    <section class="card content-card">
      <div class="card-head">
        <div>
          <div class="setup-kicker">Content Overview</div>
          <h3>Smart Content Production Center</h3>
        </div>
        <span class="card-badge neutral">${escapeHtml(formatCount(metrics.total))} drafts</span>
      </div>
      <div class="content-overview-grid">
        <div class="content-overview-item"><span>Total content drafts</span><strong>${escapeHtml(formatCount(metrics.total))}</strong></div>
        <div class="content-overview-item"><span>Ready content</span><strong>${escapeHtml(formatCount(metrics.ready))}</strong></div>
        <div class="content-overview-item"><span>Needs review</span><strong>${escapeHtml(formatCount(metrics.needsReview))}</strong></div>
        <div class="content-overview-item"><span>Approved content</span><strong>${escapeHtml(formatCount(metrics.approved))}</strong></div>
        <div class="content-overview-item"><span>Sent to Media</span><strong>${escapeHtml(formatCount(metrics.sentMedia))}</strong></div>
        <div class="content-overview-item"><span>Sent to Publishing</span><strong>${escapeHtml(formatCount(metrics.sentPublishing))}</strong></div>
      </div>
    </section>
  `;
}

function renderRecommendation(recommendation, selectedItem, escapeHtml) {
  const chips = [
    ["Campaign readiness", selectedItem ? "Active" : "Initialize"],
    ["Media handoff", selectedItem?.status === "approved" || selectedItem?.status === "sent_to_media" ? "Ready" : "Prepare"],
    ["Publishing", selectedItem?.status === "sent_to_publishing" ? "Sent" : "Pending"],
    ["SEO", ["blog-draft"].includes(selectedItem?.mode) ? "Priority" : "Optional"],
    ["Social", ["social-post", "caption", "reel-script"].includes(selectedItem?.mode) ? "Focused" : "Available"],
    ["Email", selectedItem?.mode === "email" ? "Focused" : "Available"],
    ["Marketplace", selectedItem?.mode === "marketplace-copy" ? "Focused" : "Available"]
  ];

  return `
    <section class="card content-card">
      <div class="card-head">
        <div>
          <div class="setup-kicker">Smart Recommendation</div>
          <h3>${escapeHtml(recommendation.action)}</h3>
          <p class="content-copy">${escapeHtml(recommendation.why)}</p>
        </div>
        <span class="card-badge ${statusTone(normalizeStatus(selectedItem?.status || "draft", "draft"))}">${escapeHtml(titleCase(selectedItem?.status || "draft"))}</span>
      </div>
      <div class="content-impact-grid">
        ${chips.map(([label, value]) => `<span class="content-impact-chip"><strong>${escapeHtml(label)}</strong><small>${escapeHtml(value)}</small></span>`).join("")}
      </div>
    </section>
  `;
}

function renderQueue(session, escapeHtml) {
  if (!session.items.length) {
    return `
      <section class="card content-card">
        <div class="card-head">
          <div>
            <div class="setup-kicker">Draft Queue</div>
            <h3>Saved content records</h3>
          </div>
        </div>
        <div class="empty-box">No drafts yet. Start from composer and save the first draft.</div>
      </section>
    `;
  }

  return `
    <section class="card content-card">
      <div class="card-head">
        <div>
          <div class="setup-kicker">Draft Queue</div>
          <h3>Saved content records</h3>
        </div>
        <span class="card-badge neutral">${escapeHtml(formatCount(session.items.length))} visible</span>
      </div>
      <div class="content-queue-list">
        ${session.items.map((item) => `
          <button class="content-queue-item${item.id === session.selectedId ? " is-active" : ""}" type="button" data-content-select="${escapeHtml(item.id)}">
            <span class="content-queue-title">${escapeHtml(item.title || "Untitled")}</span>
            <span class="content-queue-meta">${escapeHtml(modeLabel(item.mode))} • ${escapeHtml(item.channel || "channel")} • ${escapeHtml(item.source || "source")}</span>
            <span class="card-badge ${statusTone(item.status)}" style="margin-top:8px;display:inline-flex;">${escapeHtml(titleCase(item.status))}</span>
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function renderComposer(session, state, handoff, escapeHtml) {
  const form = session.form;
  const modeTabs = CONTENT_MODES.map((mode) => `
    <button class="content-mode-tab${form.mode === mode ? " is-active" : ""}" type="button" data-content-mode="${escapeHtml(mode)}">${escapeHtml(modeLabel(mode))}</button>
  `).join("");

  return `
    <section class="card content-card" id="contentComposerPanel">
      <div class="card-head">
        <div>
          <div class="setup-kicker">Content Composer</div>
          <h3>Brief -> Draft -> Version -> Review -> Approve -> Send</h3>
        </div>
        <span class="card-badge ${statusTone(normalizeStatus(form.status || "draft", "draft"))}">${escapeHtml(titleCase(form.status || "draft"))}</span>
      </div>

      <div class="content-mode-tabs">${modeTabs}</div>
      <form id="contentComposerForm" class="content-composer-form">
        <div class="content-preview-grid">
          <div class="setup-field-group">
            <div class="setup-field-head"><label class="setup-label" for="contentProjectInput">Project</label></div>
            <input id="contentProjectInput" name="project" class="setup-input" type="text" value="${escapeHtml(form.project || "")}">
            ${fieldError(session, "project", escapeHtml)}
          </div>
          <div class="setup-field-group">
            <div class="setup-field-head"><label class="setup-label" for="contentCampaignInput">Campaign</label></div>
            <input id="contentCampaignInput" name="campaign" class="setup-input" type="text" value="${escapeHtml(form.campaign || "")}">
            ${fieldError(session, "campaign", escapeHtml)}
          </div>
          <div class="setup-field-group">
            <div class="setup-field-head"><label class="setup-label" for="contentProductInput">Product</label></div>
            <input id="contentProductInput" name="product" class="setup-input" type="text" value="${escapeHtml(form.product || "")}">
            ${fieldError(session, "product", escapeHtml)}
          </div>
          <div class="setup-field-group">
            <div class="setup-field-head"><label class="setup-label" for="contentChannelInput">Channel</label></div>
            <input id="contentChannelInput" name="channel" class="setup-input" type="text" value="${escapeHtml(form.channel || "")}">
            ${fieldError(session, "channel", escapeHtml)}
          </div>
          <div class="setup-field-group">
            <div class="setup-field-head"><label class="setup-label" for="contentLanguageInput">Language</label></div>
            <input id="contentLanguageInput" name="language" class="setup-input" type="text" value="${escapeHtml(form.language || "")}">
            ${fieldError(session, "language", escapeHtml)}
          </div>
          <div class="setup-field-group">
            <div class="setup-field-head"><label class="setup-label" for="contentToneInput">Tone</label></div>
            <input id="contentToneInput" name="tone" class="setup-input" type="text" value="${escapeHtml(form.tone || "")}">
            ${fieldError(session, "tone", escapeHtml)}
          </div>
        </div>

        <div class="setup-field-group">
          <div class="setup-field-head"><label class="setup-label" for="contentObjectiveInput">Objective</label></div>
          <input id="contentObjectiveInput" name="objective" class="setup-input" type="text" value="${escapeHtml(form.objective || "")}">
          ${fieldError(session, "objective", escapeHtml)}
        </div>

        <div class="setup-field-group">
          <div class="setup-field-head"><label class="setup-label" for="contentBriefInput">Main prompt / brief</label></div>
          <textarea id="contentBriefInput" name="brief" class="setup-input setup-textarea" rows="6">${escapeHtml(form.brief || "")}</textarea>
          ${fieldError(session, "brief", escapeHtml)}
        </div>

        <div class="setup-field-group">
          <div class="setup-field-head"><label class="setup-label" for="contentTitleInput">Draft title</label></div>
          <input id="contentTitleInput" name="title" class="setup-input" type="text" value="${escapeHtml(form.title || "")}">
        </div>
      </form>

      <div class="content-action-row">
        <button id="contentGenerateDraftBtn" class="btn btn-primary" type="button">Generate Draft</button>
        <button id="contentImproveBtn" class="btn btn-secondary" type="button">Improve</button>
        <button id="contentTranslateBtn" class="btn btn-secondary" type="button">Translate / Adapt</button>
        <button id="contentSaveDraftBtn" class="btn btn-secondary" type="button">Save Draft</button>
        <button id="contentSendMediaBtn" class="btn btn-secondary" type="button">Send Design Brief to Media Studio</button>
        <button id="contentSendPublishingBtn" class="btn btn-secondary" type="button">Send to Publishing</button>
        <button id="contentSendAiBtn" class="btn btn-secondary" type="button">Open AI: Send Context to AI Workspace</button>
      </div>

      ${handoff ? `<div class="simple-banner" style="margin-top:12px;">Inbound handoff from ${escapeHtml(titleCase(handoff.sourcePage || "workflow"))} is available below.</div>` : ""}
      ${session.draftMessage ? `<div class="simple-banner" style="margin-top:12px;">${escapeHtml(session.draftMessage)}</div>` : ""}
    </section>
  `;
}

function previewPost(content, escapeHtml) {
  return `
    <div class="content-preview-social">
      <div class="headline">Social Preview</div>
      <div class="content-text-box">${escapeHtml(content || "No social post body yet.")}</div>
    </div>
  `;
}

function previewScript(content, escapeHtml) {
  const lines = parseLines(content);
  const hook = lines.find((line) => /hook/i.test(line)) || lines[0] || "Hook: missing";
  const cta = lines.find((line) => /cta|call to action/i.test(line)) || lines[lines.length - 1] || "CTA: missing";
  const scenes = lines.filter((line) => /scene|beat|shot/i.test(line)).slice(0, 6);
  return `
    <div class="content-preview-script">
      <div class="headline">Script Preview</div>
      <div class="scene"><strong>Hook:</strong> ${escapeHtml(hook)}</div>
      <div class="scene"><strong>Scenes:</strong> ${escapeHtml((scenes.length ? scenes : lines.slice(1, 5)).join("\n") || "No scene blocks yet.")}</div>
      <div class="scene"><strong>CTA:</strong> ${escapeHtml(cta)}</div>
    </div>
  `;
}

function previewBlog(content, escapeHtml) {
  const lines = parseLines(content);
  const title = lines[0] || "Blog title missing";
  const meta = lines.find((line) => /meta/i.test(line)) || "Meta description not specified";
  const sections = lines.filter((line) => /^#+\s|section/i.test(line)).slice(0, 6);
  return `
    <div class="content-preview-blog">
      <div class="headline">Blog Preview</div>
      <div class="section"><strong>Title:</strong> ${escapeHtml(title)}</div>
      <div class="section"><strong>Meta:</strong> ${escapeHtml(meta)}</div>
      <div class="section"><strong>Sections:</strong> ${escapeHtml((sections.length ? sections : lines.slice(1, 8)).join("\n") || "No sections yet.")}</div>
    </div>
  `;
}

function previewEmail(content, escapeHtml) {
  const lines = parseLines(content);
  const subject = lines.find((line) => /^subject/i.test(line)) || lines[0] || "Subject missing";
  const preheader = lines.find((line) => /^preheader/i.test(line)) || lines[1] || "Preheader missing";
  const body = lines.slice(2).join("\n") || content || "Email body missing";
  return `
    <div class="content-preview-email">
      <div class="headline">Email Preview</div>
      <div class="segment"><strong>Subject:</strong> ${escapeHtml(subject)}</div>
      <div class="segment"><strong>Preheader:</strong> ${escapeHtml(preheader)}</div>
      <div class="segment"><strong>Body:</strong><div class="content-text-box">${escapeHtml(body)}</div></div>
    </div>
  `;
}

function previewMarketplace(content, escapeHtml) {
  const lines = parseLines(content);
  const title = lines[0] || "Listing title missing";
  const bullets = lines.filter((line) => /^[-*]|^\d+\./.test(line)).slice(0, 6);
  const description = lines.slice(bullets.length + 1).join("\n") || content || "Description missing";
  return `
    <div class="content-preview-marketplace">
      <div class="headline">Marketplace Preview</div>
      <div class="segment"><strong>Title:</strong> ${escapeHtml(title)}</div>
      <div class="segment"><strong>Bullets:</strong> ${escapeHtml((bullets.length ? bullets : ["- Bullet points missing"]).join("\n"))}</div>
      <div class="segment"><strong>Description:</strong><div class="content-text-box">${escapeHtml(description)}</div></div>
    </div>
  `;
}

function previewAd(content, escapeHtml) {
  const lines = parseLines(content);
  const headline = lines.find((line) => /headline/i.test(line)) || lines[0] || "Headline missing";
  const body = lines.find((line) => /body/i.test(line)) || lines.slice(1, 4).join(" ") || "Body missing";
  const cta = lines.find((line) => /cta/i.test(line)) || lines[lines.length - 1] || "CTA missing";
  return `
    <div class="content-preview-ad">
      <div class="headline">Ad Preview</div>
      <div class="segment"><strong>Headline:</strong> ${escapeHtml(headline)}</div>
      <div class="segment"><strong>Body:</strong> ${escapeHtml(body)}</div>
      <div class="segment"><strong>CTA:</strong> ${escapeHtml(cta)}</div>
    </div>
  `;
}

function renderPreview(session, selectedItem, escapeHtml) {
  const selected = selectedVersionEntry(session);
  const mode = firstText(selected?.mode, session.form.mode, selectedItem?.mode, "social-post");
  const content = firstText(selected?.output_content, selectedItem?.draft);

  let body = previewPost(content, escapeHtml);
  if (["reel-script", "video-script"].includes(mode)) body = previewScript(content, escapeHtml);
  if (mode === "blog-draft") body = previewBlog(content, escapeHtml);
  if (mode === "email") body = previewEmail(content, escapeHtml);
  if (mode === "marketplace-copy") body = previewMarketplace(content, escapeHtml);
  if (mode === "ad-copy") body = previewAd(content, escapeHtml);

  return `
    <section class="card content-card" id="contentPreviewPanel">
      <div class="card-head">
        <div>
          <div class="setup-kicker">Content Preview</div>
          <h3>${escapeHtml(modeLabel(mode))} output</h3>
          <p class="content-copy">Selected version rendering by content type with fallback-safe formatting.</p>
        </div>
        <span class="card-badge ${statusTone(normalizeStatus(selected?.readiness_status || session.form.status || "draft", "draft"))}">${escapeHtml(titleCase(selected?.readiness_status || session.form.status || "draft"))}</span>
      </div>
      ${body}
      ${!clean(content) ? `<div class="content-text-box" style="margin-top:10px;">${escapeHtml("No generated output yet. Draft is in prompt-ready state until content output is produced.")}</div>` : ""}
    </section>
  `;
}

function renderVersioning(session, escapeHtml) {
  const versioning = ensureVersioning(session);
  const { selected, previous, promptChanged, contentChanged, statusChanged } = getVersionMetrics(session);

  return `
    <section class="card content-card" id="contentVersioningPanel">
      <div class="card-head">
        <div>
          <div class="setup-kicker">Draft / Versioning</div>
          <h3>Version controls and review actions</h3>
        </div>
        <span class="card-badge neutral">${escapeHtml(selected?.id ? `${titleCase(selected.id)} selected` : "No version")}</span>
      </div>

      <div class="content-version-tabs">
        ${asArray(versioning.versions).map((version) => `
          <button class="content-version-tab${selected?.id === version.id ? " is-active" : ""}" type="button" data-content-version="${escapeHtml(version.id)}">${escapeHtml(titleCase(version.id))}</button>
        `).join("")}
      </div>

      <div class="content-version-grid" style="margin-top:12px;">
        <div class="content-data-item"><span>Prompt used</span><strong>${escapeHtml(selected?.prompt || "-")}</strong></div>
        <div class="content-data-item"><span>Content output</span><strong>${escapeHtml(selected?.output_content ? "Generated" : "Not generated")}</strong></div>
        <div class="content-data-item"><span>Language</span><strong>${escapeHtml(firstText(selected?.language, "English"))}</strong></div>
        <div class="content-data-item"><span>Tone</span><strong>${escapeHtml(firstText(selected?.tone, "-") || "-")}</strong></div>
        <div class="content-data-item"><span>Channel</span><strong>${escapeHtml(firstText(selected?.channel, "-") || "-")}</strong></div>
        <div class="content-data-item"><span>Readiness status</span><strong>${escapeHtml(titleCase(firstText(selected?.readiness_status, "draft")))}</strong></div>
        <div class="content-data-item"><span>Approval status</span><strong>${escapeHtml(titleCase(firstText(selected?.approval_status, "draft")))}</strong></div>
        <div class="content-data-item"><span>Timestamp</span><strong>${escapeHtml(formatDateTime(selected?.timestamp || ""))}</strong></div>
      </div>

      <div class="content-action-row" style="margin-top:12px;">
        <button class="btn btn-secondary" type="button" data-content-version-action="compare-toggle">${escapeHtml(versioning.compareMode ? "Hide Compare" : "Compare version")}</button>
      </div>

      ${versioning.compareMode ? `
        <div class="content-version-grid" style="margin-top:10px;">
          <div class="content-data-item"><span>Current version</span><strong>${escapeHtml(selected?.id ? titleCase(selected.id) : "None")}</strong></div>
          <div class="content-data-item"><span>Previous version</span><strong>${escapeHtml(previous?.id ? titleCase(previous.id) : "None")}</strong></div>
          <div class="content-data-item"><span>Prompt difference</span><strong>${escapeHtml(previous ? (promptChanged ? "Changed" : "Unchanged") : "N/A")}</strong></div>
          <div class="content-data-item"><span>Content difference</span><strong>${escapeHtml(previous ? (contentChanged ? "Changed" : "Unchanged") : "N/A")}</strong></div>
          <div class="content-data-item"><span>Status difference</span><strong>${escapeHtml(previous ? (statusChanged ? "Changed" : "Unchanged") : "N/A")}</strong></div>
        </div>
      ` : ""}

      <div class="content-action-row" style="margin-top:12px;">
        <button class="btn btn-secondary" type="button" data-content-version-action="approve">Approve</button>
        <button class="btn btn-secondary" type="button" data-content-version-action="reject">Reject</button>
        <button class="btn btn-secondary" type="button" data-content-version-action="regenerate">Regenerate</button>
        <button class="btn btn-secondary" type="button" data-content-version-action="save-draft">Save Draft</button>
        <button class="btn btn-secondary" type="button" data-content-version-action="save-library">Save to Library</button>
      </div>
      ${fieldError(session, "version", escapeHtml)}
    </section>
  `;
}

function renderAgents(escapeHtml) {
  return `
    <section class="card content-card" id="contentAgentsPanel">
      <div class="card-head">
        <div>
          <div class="setup-kicker">Smart Writing Agents</div>
          <h3>Specialists for fast, reusable draft quality</h3>
        </div>
        <span class="card-badge neutral">${escapeHtml(formatCount(WRITING_AGENTS.length))} agents</span>
      </div>
      <div class="content-agent-grid">
        ${WRITING_AGENTS.map((agent) => `
          <article class="content-agent-card">
            <strong>${escapeHtml(agent.title)}</strong>
            <p class="content-copy"><strong>Purpose:</strong> ${escapeHtml(agent.purpose)}</p>
            <p class="content-copy"><strong>Best use:</strong> ${escapeHtml(agent.bestUse)}</p>
            <div class="content-text-box">${escapeHtml(agent.suggestedPrompt)}</div>
            <div class="content-agent-actions" style="margin-top:10px;">
              <button class="btn btn-secondary" type="button" data-content-agent-use="${escapeHtml(agent.id)}">Use Prompt</button>
              <button class="btn btn-secondary" type="button" data-content-agent-save="${escapeHtml(agent.id)}">Save Draft</button>
              <button class="btn btn-secondary" type="button" data-content-agent-ai="${escapeHtml(agent.id)}">Send to AI Workspace</button>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderInboundHandoff(handoff, session, escapeHtml) {
  if (!handoff) {
    return `
      <section class="card content-card" id="contentHandoffPanel">
        <div class="card-head">
          <div>
            <div class="setup-kicker">Workflow / AI Handoff</div>
            <h3>No inbound handoff available</h3>
          </div>
          <span class="card-badge neutral">Empty</span>
        </div>
        <div class="empty-box">Run AI Command or Workflows and route output to Content Studio to prefill the composer.</div>
      </section>
    `;
  }

  return `
    <section class="card content-card" id="contentHandoffPanel">
      <div class="card-head">
        <div>
          <div class="setup-kicker">Workflow / AI Handoff</div>
          <h3>${escapeHtml(firstText(handoff.title, "Inbound content context"))}</h3>
          <p class="content-copy">Source: ${escapeHtml(titleCase(handoff.sourcePage || "workflow"))}</p>
        </div>
        <span class="card-badge success">Available</span>
      </div>
      <div class="content-handoff-grid">
        <div class="content-data-item"><span>Project</span><strong>${escapeHtml(firstText(handoff.project, "-"))}</strong></div>
        <div class="content-data-item"><span>Campaign</span><strong>${escapeHtml(firstText(handoff.campaign, "-"))}</strong></div>
        <div class="content-data-item"><span>Channel</span><strong>${escapeHtml(firstText(handoff.channel, "-"))}</strong></div>
        <div class="content-data-item"><span>Type</span><strong>${escapeHtml(modeLabel(firstText(handoff.mode, "social-post")))}</strong></div>
      </div>
      <div class="content-text-box" style="margin-top:10px;">${escapeHtml(firstText(handoff.brief, handoff.contentBody, "No handoff brief text."))}</div>
      <div class="content-action-row" style="margin-top:10px;">
        <button id="contentLoadHandoffBtn" class="btn btn-secondary" type="button">Load into Composer</button>
      </div>
    </section>
  `;
}

function buildAiPrompt(projectName, session, selectedItem) {
  const selected = selectedVersionEntry(session);
  return [
    `Improve content for ${projectName || "current project"}.`,
    `Type: ${modeLabel(firstText(selected?.mode, session.form.mode, selectedItem?.mode, "social-post"))}`,
    `Campaign: ${firstText(session.form.campaign, selectedItem?.campaign, "not set")}`,
    `Channel: ${firstText(session.form.channel, selectedItem?.channel, "not set")}`,
    `Language/Tone: ${firstText(session.form.language, selected?.language, "English")} / ${firstText(session.form.tone, selected?.tone, "not set")}`,
    "",
    "Prompt:",
    firstText(selected?.prompt, session.form.brief, "not set"),
    "",
    "Current output:",
    firstText(selected?.output_content, selectedItem?.draft, "none")
  ].join("\n");
}

function buildMediaHandoff(projectName, session, selectedItem) {
  const selected = selectedVersionEntry(session);
  const readinessStatus = normalizeStatus(firstText(selected?.readiness_status, session.form.status, selectedItem?.status), "draft");
  const contentBody = firstText(selected?.output_content, selectedItem?.draft, "");

  return {
    source_page: "content-studio",
    destination_page: "media-studio",
    source_role: CONTENT_ROLE_DEFAULTS.ownerRole,
    destination_role: CONTENT_ROLE_DEFAULTS.mediaRole,
    source_service_domain: CONTENT_ROLE_DEFAULTS.serviceDomain,
    destination_service_domain: "media",
    linked_entity: {
      entity_type: "content_item",
      entity_id: firstText(selectedItem?.id, session.formSourceId),
      route: "content-studio",
      label: firstText(selectedItem?.title, session.form.title, "Content draft")
    },
    payload: {
      project: firstText(session.form.project, selectedItem?.project, projectName),
      campaign: firstText(session.form.campaign, selectedItem?.campaign),
      product: firstText(session.form.product, selectedItem?.product),
      channel: firstText(session.form.channel, selectedItem?.channel),
      content_type: firstText(selected?.mode, session.form.mode, selectedItem?.mode),
      selected_content_version: {
        version_id: selected?.id || "",
        prompt: selected?.prompt || session.form.brief,
        content_output: contentBody,
        language: firstText(selected?.language, session.form.language),
        tone: firstText(selected?.tone, session.form.tone),
        channel: firstText(selected?.channel, session.form.channel),
        readiness_status: readinessStatus,
        approval_status: firstText(selected?.approval_status, "draft"),
        timestamp: selected?.timestamp || nowIso()
      },
      script_caption_copy: contentBody,
      suggested_media_brief: computeSuggestedMediaBrief(firstText(selected?.mode, session.form.mode), selected, session.form),
      language: firstText(selected?.language, session.form.language),
      tone: firstText(selected?.tone, session.form.tone),
      readiness_status: readinessStatus
    },
    status: "available",
    actor: "content-studio"
  };
}

function buildPublishingHandoff(projectName, session, selectedItem) {
  const selected = selectedVersionEntry(session);
  const readinessStatus = normalizeStatus(firstText(selected?.readiness_status, session.form.status, selectedItem?.status), "draft");
  const approvalStatus = firstText(selected?.approval_status, selectedItem?.approval_status, "draft");
  const body = firstText(selected?.output_content, selectedItem?.draft, "");

  return {
    source_page: "content-studio",
    destination_page: "publishing",
    source_role: CONTENT_ROLE_DEFAULTS.ownerRole,
    destination_role: CONTENT_ROLE_DEFAULTS.handoffRole,
    source_service_domain: CONTENT_ROLE_DEFAULTS.serviceDomain,
    destination_service_domain: "publishing",
    linked_entity: {
      entity_type: "content_item",
      entity_id: firstText(selectedItem?.id, session.formSourceId),
      route: "content-studio",
      label: firstText(selectedItem?.title, session.form.title, "Content draft")
    },
    payload: {
      project: firstText(session.form.project, selectedItem?.project, projectName),
      campaign: firstText(session.form.campaign, selectedItem?.campaign),
      channel: firstText(session.form.channel, selectedItem?.channel),
      readiness_status: readinessStatus,
      approval_status: approvalStatus,
      selected_content_version: {
        version_id: selected?.id || "",
        mode: firstText(selected?.mode, session.form.mode),
        caption_body_script: body,
        prompt: selected?.prompt || session.form.brief,
        language: firstText(selected?.language, session.form.language),
        tone: firstText(selected?.tone, session.form.tone),
        readiness_status: readinessStatus,
        approval_status: approvalStatus,
        timestamp: selected?.timestamp || nowIso()
      },
      caption: body,
      body,
      script: body,
      content_item: body,
      title: firstText(selectedItem?.title, session.form.title, "Content handoff")
    },
    status: "available",
    actor: "content-studio"
  };
}

function findExistingLibraryAssetSave(session, projectName, signature) {
  const local = loadLocalLibraryAssets(projectName).find((item) => asString(item.source_signature) === asString(signature));
  const backend = asArray(session.handoffs).find((item) => {
    const payload = asObject(item.payload);
    const asset = asObject(payload.library_asset);
    return asString(item.destination_page) === "library" && asString(asset.source_signature) === asString(signature);
  });
  return { local: local || null, backend: backend || null };
}

function mapLibraryAssetType(mode) {
  if (["reel-script", "video-script"].includes(mode)) return "script";
  if (mode === "blog-draft") return "blog";
  if (mode === "email") return "email";
  if (mode === "marketplace-copy") return "marketplace_copy";
  if (mode === "ad-copy") return "ad_copy";
  return "content_draft";
}

async function saveToLibrary({ projectName, session, selectedItem, showMessage, rerender }) {
  const selected = selectedVersionEntry(session);
  if (!selected) {
    session.validation = { ...session.validation, version: "Select a version before saving to Library." };
    rerender();
    return;
  }

  const hasPayload = Boolean(clean(selected.prompt) || clean(selected.output_content));
  if (!hasPayload) {
    session.validation = { ...session.validation, version: "Version needs prompt or content output before Library save." };
    rerender();
    return;
  }

  const signature = [
    toKey(projectName),
    toKey(firstText(selectedItem?.id, session.formSourceId)),
    toKey(selected.id),
    toKey(selected.mode),
    clean(selected.prompt)
  ].join("::");

  const existing = findExistingLibraryAssetSave(session, projectName, signature);
  if (existing.local && !projectName) {
    showMessage?.("Already saved to Library (local reference).");
    return;
  }

  const libraryAsset = {
    id: `content-lib-${Date.now()}`,
    source_signature: signature,
    source: "content-studio",
    project: firstText(session.form.project, selectedItem?.project, projectName),
    campaign: firstText(session.form.campaign, selectedItem?.campaign),
    product: firstText(session.form.product, selectedItem?.product),
    channel: firstText(session.form.channel, selectedItem?.channel),
    media_type: firstText(selected.mode, session.form.mode),
    asset_type: mapLibraryAssetType(firstText(selected.mode, session.form.mode)),
    version_id: selected.id,
    prompt: selected.prompt,
    output_payload: {
      content_output: selected.output_content,
      language: selected.language,
      tone: selected.tone,
      channel: selected.channel,
      mode: selected.mode
    },
    readiness_status: normalizeStatus(selected.readiness_status || "draft", "draft"),
    approval_status: firstText(selected.approval_status, "draft"),
    notes: firstText(selected.notes, selectedItem?.notes?.join("\n")),
    created_at: selected.timestamp || nowIso(),
    updated_at: nowIso()
  };

  const handoff = {
    id: asString(existing.backend?.id || ""),
    source_page: "content-studio",
    destination_page: "library",
    source_role: CONTENT_ROLE_DEFAULTS.ownerRole,
    destination_role: CONTENT_ROLE_DEFAULTS.reviewRole,
    source_service_domain: CONTENT_ROLE_DEFAULTS.serviceDomain,
    destination_service_domain: "library",
    linked_entity: {
      entity_type: "content_item",
      entity_id: firstText(selectedItem?.id, session.formSourceId),
      route: "content-studio",
      label: firstText(selectedItem?.title, session.form.title, "Content draft")
    },
    payload: {
      library_asset: libraryAsset,
      project: libraryAsset.project,
      campaign: libraryAsset.campaign,
      asset_type: libraryAsset.asset_type,
      content_type: libraryAsset.media_type
    },
    status: "available",
    actor: "content-studio"
  };

  setSharedHandoff(projectName || "__default__", "library", handoff);
  if (!clean(projectName) || toKey(projectName) === "workspace") {
    setSharedHandoff("__default__", "library", handoff);
  }

  if (projectName) {
    try {
      const result = await createProjectHandoff(projectName, handoff);
      const saved = asObject(result?.handoff);
      const handoffId = asString(saved.id || handoff.id);
      upsertLocalLibraryAsset(projectName, {
        ...libraryAsset,
        id: handoffId || libraryAsset.id,
        handoff_id: handoffId,
        local_only: false
      });
      selected.library_asset_ref = {
        handoff_id: handoffId,
        source_signature: signature,
        local_only: false,
        saved_at: nowIso()
      };
      showMessage?.(existing.backend ? "Already saved. Library metadata updated." : "Content draft saved to Library.");
    } catch (_) {
      upsertLocalLibraryAsset(projectName, {
        ...libraryAsset,
        id: libraryAsset.id,
        local_only: true
      });
      selected.library_asset_ref = {
        handoff_id: "",
        source_signature: signature,
        local_only: true,
        saved_at: nowIso()
      };
      showMessage?.("Library backend unavailable. Saved as local library handoff.");
    }
  } else {
    upsertLocalLibraryAsset(projectName, {
      ...libraryAsset,
      id: libraryAsset.id,
      local_only: true
    });
    selected.library_asset_ref = {
      handoff_id: "",
      source_signature: signature,
      local_only: true,
      saved_at: nowIso()
    };
    showMessage?.("Content draft saved to Library (local handoff).");
  }

  session.validation = { ...session.validation, version: "" };
}

async function sendHandoff({ projectName, handoff, session, showMessage, failMessage, successMessage, localMessage }) {
  setSharedHandoff(projectName || "__default__", handoff.destination_page, handoff);
  if (!clean(projectName) || toKey(projectName) === "workspace") {
    setSharedHandoff("__default__", handoff.destination_page, handoff);
  }

  if (projectName) {
    try {
      await createProjectHandoff(projectName, handoff);
      showMessage?.(successMessage);
      return true;
    } catch (_) {
      showMessage?.(failMessage);
      return false;
    }
  }

  showMessage?.(localMessage);
  return true;
}

function buildAssetGate(state, escapeHtml) {
  const keys = ["brand_guideline", "product_csv", "product_photos", "product_videos", "testimonials_reviews", "legal_doc"];
  const assetData = asObject(state.data?.assets);
  const nextAction = getAssetNextAction(assetData, keys);
  return `
    <section class="card content-card">
      <div class="card-head">
        <div>
          <div class="setup-kicker">Content Inputs</div>
          <h3>Library dependency gate</h3>
        </div>
        <span class="card-badge neutral">Assets</span>
      </div>
      ${renderAssetDependencyRows(assetData, keys, escapeHtml, "Content dependencies are covered.")}
      <div class="simple-banner" style="margin-top:12px;">${escapeHtml(nextAction)}</div>
    </section>
  `;
}

function bindPage({
  projectName,
  state,
  session,
  handoff,
  navigateTo,
  showMessage,
  showError,
  rerender
}) {
  const form = document.getElementById("contentComposerForm");

  function selected() {
    return getSelectedItem(session);
  }

  function sync() {
    syncSessionForm(session, form);
  }

  function clearValidation() {
    if (Object.keys(session.validation).length) session.validation = {};
  }

  if (form) {
    form.oninput = () => {
      sync();
      clearValidation();
    };
  }

  Array.from(document.querySelectorAll("[data-content-mode]")).forEach((button) => {
    button.onclick = () => {
      const mode = button.getAttribute("data-content-mode") || "social-post";
      resetForm(session, state, mode);
      rerender();
    };
  });

  Array.from(document.querySelectorAll("[data-content-select]")).forEach((button) => {
    button.onclick = () => {
      const item = session.items.find((entry) => asString(entry.id) === asString(button.getAttribute("data-content-select")));
      if (!item) return;
      session.selectedId = item.id;
      syncFormFromItem(session, item);
      rerender();
    };
  });

  const loadHandoffBtn = document.getElementById("contentLoadHandoffBtn");
  if (loadHandoffBtn) {
    loadHandoffBtn.onclick = () => {
      if (!handoff) {
        session.draftMessage = "No inbound handoff is available.";
        rerender();
        return;
      }
      session.form = {
        ...session.form,
        mode: firstText(handoff.mode, session.form.mode, "social-post"),
        project: firstText(handoff.project, session.form.project, projectName),
        campaign: firstText(handoff.campaign, session.form.campaign),
        product: firstText(handoff.product, session.form.product),
        channel: firstText(handoff.channel, session.form.channel),
        language: firstText(handoff.language, session.form.language),
        tone: firstText(handoff.tone, session.form.tone),
        objective: firstText(handoff.objective, session.form.objective),
        brief: firstText(handoff.brief, handoff.contentBody, session.form.brief),
        title: firstText(handoff.title, session.form.title),
        status: normalizeStatus(handoff.readinessStatus || "draft", "draft")
      };
      appendVersion(session, {
        mode: session.form.mode,
        prompt: session.form.brief,
        outputContent: firstText(handoff.contentBody),
        language: session.form.language,
        tone: session.form.tone,
        channel: session.form.channel,
        readinessStatus: session.form.status,
        approvalStatus: firstText(handoff.approvalStatus, "draft"),
        notes: `Loaded from ${titleCase(handoff.sourcePage || "handoff")}.`
      });
      session.draftMessage = "Handoff loaded into composer.";
      rerender();
    };
  }

  const generateBtn = document.getElementById("contentGenerateDraftBtn");
  if (generateBtn) {
    generateBtn.onclick = async () => {
      sync();
      if (!validateComposer(session, "generate")) {
        rerender();
        return;
      }

      const promptUsed = clean(session.form.brief);
      session.form.status = "prompt_ready";
      session.draftMessage = "Draft is prompt-ready.";

      if (projectName) {
        try {
          const aiResult = await executeProjectAiCommand(projectName, {
            message: buildAiPrompt(projectName, session, selected()),
            route_target: "content-studio",
            actor: "content-studio"
          });
          const generatedText = firstText(
            aiResult?.response?.answer,
            aiResult?.response?.summary,
            aiResult?.response?.content,
            aiResult?.summary
          );

          if (clean(generatedText)) {
            appendVersion(session, {
              mode: session.form.mode,
              prompt: promptUsed,
              outputContent: generatedText,
              language: session.form.language,
              tone: session.form.tone,
              channel: session.form.channel,
              readinessStatus: "needs_review",
              approvalStatus: "needs_review",
              notes: "Generated via AI command backend."
            });
            session.form.status = "needs_review";
            session.draftMessage = "Draft generated and queued for review.";
          } else {
            appendVersion(session, {
              mode: session.form.mode,
              prompt: promptUsed,
              outputContent: "",
              language: session.form.language,
              tone: session.form.tone,
              channel: session.form.channel,
              readinessStatus: "prompt_ready",
              approvalStatus: "draft",
              notes: "No model output returned. Prompt-ready state kept."
            });
            session.draftMessage = "No generated output returned. Draft kept as prompt-ready.";
          }
        } catch (_) {
          appendVersion(session, {
            mode: session.form.mode,
            prompt: promptUsed,
            outputContent: "",
            language: session.form.language,
            tone: session.form.tone,
            channel: session.form.channel,
            readinessStatus: "prompt_ready",
            approvalStatus: "draft",
            notes: "Generation backend unavailable. Prompt-ready state only."
          });
          session.draftMessage = "Generation backend unavailable. Prompt-ready state only.";
        }
      } else {
        appendVersion(session, {
          mode: session.form.mode,
          prompt: promptUsed,
          outputContent: "",
          language: session.form.language,
          tone: session.form.tone,
          channel: session.form.channel,
          readinessStatus: "prompt_ready",
          approvalStatus: "draft",
          notes: "No backend project selected. Prompt-ready state only."
        });
        session.draftMessage = "No backend project selected. Draft is prompt-ready.";
      }

      await persistContentRecord({ projectName, state, session, status: session.form.status, showMessage });
      rerender();
    };
  }

  const improveBtn = document.getElementById("contentImproveBtn");
  if (improveBtn) {
    improveBtn.onclick = () => {
      sync();
      if (!clean(session.form.brief)) {
        session.validation = { ...session.validation, brief: "Main prompt / brief is required." };
        rerender();
        return;
      }
      session.form.brief = `${clean(session.form.brief)}\n\nImprove for clarity: stronger opening hook, tighter value message, cleaner CTA, and channel-safe length.`;
      syncVersionFromForm(session);
      session.draftMessage = "Brief improved for stronger draft quality.";
      rerender();
    };
  }

  const translateBtn = document.getElementById("contentTranslateBtn");
  if (translateBtn) {
    translateBtn.onclick = async () => {
      sync();
      if (!clean(session.form.brief)) {
        session.validation = { ...session.validation, brief: "Main prompt / brief is required." };
        rerender();
        return;
      }

      const language = clean(session.form.language || "English");
      if (!projectName) {
        session.form.brief = `${clean(session.form.brief)}\n\nAdaptation note: Local mode only. Translate/adapt target language = ${language}.`;
        syncVersionFromForm(session);
        session.draftMessage = "Translate/adapt prepared in local mode.";
        rerender();
        return;
      }

      try {
        await executeProjectAiCommand(projectName, {
          message: `Adapt this content brief to ${language} while preserving brand tone and campaign intent:\n\n${session.form.brief}`,
          route_target: "content-studio",
          actor: "content-studio"
        });
        session.form.brief = `${clean(session.form.brief)}\n\nAdaptation request sent for ${language}.`;
        syncVersionFromForm(session);
        session.draftMessage = `Translate/adapt request sent for ${language}.`;
      } catch (_) {
        session.form.brief = `${clean(session.form.brief)}\n\nAdaptation note: backend unavailable for ${language}; prompt-ready adaptation added.`;
        syncVersionFromForm(session);
        session.draftMessage = "Translate/adapt backend unavailable. Prompt-ready adaptation saved.";
      }
      rerender();
    };
  }

  const saveBtn = document.getElementById("contentSaveDraftBtn");
  if (saveBtn) {
    saveBtn.onclick = async () => {
      sync();
      if (!validateComposer(session, "save")) {
        rerender();
        return;
      }
      session.form.status = normalizeStatus(session.form.status || "draft", "draft");
      await persistContentRecord({ projectName, state, session, status: session.form.status, showMessage });
      rerender();
    };
  }

  const sendAiBtn = document.getElementById("contentSendAiBtn");
  if (sendAiBtn) {
    sendAiBtn.onclick = () => {
      sync();
      const selectedItem = selected();
      const prompt = buildAiPrompt(projectName, session, selectedItem);
      const aiDraft = {
        projectName,
        modeId: "content",
        lastCommand: prompt,
        lastResponseTitle: firstText(selectedItem?.title, session.form.title, "Content Draft"),
        routeSuggestions: []
      };
      setSharedAiDraft(projectName || "__default__", aiDraft);
      setSharedHandoff(projectName || "__default__", "ai-command", {
        source_page: "content-studio",
        destination_page: "ai-command",
        linked_entity: {
          entity_type: "content_item",
          entity_id: firstText(selectedItem?.id, session.formSourceId)
        },
        payload: {
          prompt,
          title: firstText(selectedItem?.title, session.form.title),
          content_item_id: firstText(selectedItem?.id, session.formSourceId),
          draft_context: aiDraft,
          content: buildContentPayload(session, session.form.status || "draft")
        },
        status: "available"
      });
      navigateTo("ai-command");
      showMessage?.("Content context sent to AI Command.");
    };
  }

  const sendMediaBtn = document.getElementById("contentSendMediaBtn");
  if (sendMediaBtn) {
    sendMediaBtn.onclick = async () => {
      sync();
      if (!validateComposer(session, "save")) {
        rerender();
        return;
      }
      const selectedItem = selected();
      const handoffPayload = buildMediaHandoff(projectName, session, selectedItem);
      const ok = await sendHandoff({
        projectName,
        handoff: handoffPayload,
        session,
        showMessage,
        failMessage: "Design brief kept locally because backend handoff save is unavailable.",
        successMessage: "Design brief sent to Media Studio.",
        localMessage: "Design brief prepared for Media Studio locally."
      });
      if (ok) {
        const selectedVersion = selectedVersionEntry(session);
        if (selectedVersion) {
          selectedVersion.readiness_status = "sent_to_media";
        }
        session.form.status = "sent_to_media";
        await persistContentRecord({ projectName, state, session, status: "sent_to_media", showMessage });
        navigateTo("media-studio");
      }
      rerender();
    };
  }

  const sendPublishingBtn = document.getElementById("contentSendPublishingBtn");
  if (sendPublishingBtn) {
    sendPublishingBtn.onclick = async () => {
      sync();
      if (!validateComposer(session, "save")) {
        rerender();
        return;
      }
      const selectedItem = selected();
      const handoffPayload = buildPublishingHandoff(projectName, session, selectedItem);
      const ok = await sendHandoff({
        projectName,
        handoff: handoffPayload,
        session,
        showMessage,
        failMessage: "Publishing handoff kept locally because backend save is unavailable.",
        successMessage: "Publishing handoff created.",
        localMessage: "Publishing handoff created locally."
      });
      if (ok) {
        const selectedVersion = selectedVersionEntry(session);
        if (selectedVersion) {
          selectedVersion.readiness_status = "sent_to_publishing";
        }
        session.form.status = "sent_to_publishing";
        await persistContentRecord({ projectName, state, session, status: "sent_to_publishing", showMessage });
        navigateTo("publishing");
      }
      rerender();
    };
  }

  Array.from(document.querySelectorAll("[data-content-version]")).forEach((button) => {
    button.onclick = () => {
      ensureVersioning(session).selectedVersionId = button.getAttribute("data-content-version") || "v1";
      applySelectedVersionToForm(session);
      session.draftMessage = `${titleCase(ensureVersioning(session).selectedVersionId)} selected.`;
      rerender();
    };
  });

  Array.from(document.querySelectorAll("[data-content-version-action]")).forEach((button) => {
    button.onclick = async () => {
      sync();
      const action = button.getAttribute("data-content-version-action") || "";
      const current = selectedVersionEntry(session);
      if (!current) return;

      if (action === "compare-toggle") {
        const versioning = ensureVersioning(session);
        versioning.compareMode = !versioning.compareMode;
        rerender();
        return;
      }

      if (action === "approve") {
        current.readiness_status = "approved";
        current.approval_status = "approved";
        session.form.status = "approved";
        session.draftMessage = "Selected version approved.";
        await persistContentRecord({ projectName, state, session, status: "approved", showMessage });
      }

      if (action === "reject") {
        current.readiness_status = "draft";
        current.approval_status = "rejected";
        session.form.status = "draft";
        session.draftMessage = "Selected version returned to draft.";
        await persistContentRecord({ projectName, state, session, status: "draft", showMessage });
      }

      if (action === "regenerate") {
        const nextPrompt = `${clean(current.prompt || session.form.brief)}\n\nRegenerate with stronger opening and clearer CTA while preserving tone.`;
        appendVersion(session, {
          mode: current.mode,
          prompt: nextPrompt,
          outputContent: "",
          language: current.language,
          tone: current.tone,
          channel: current.channel,
          readinessStatus: "prompt_ready",
          approvalStatus: "draft",
          notes: `Regenerated from ${current.id}.`
        });
        session.form.brief = nextPrompt;
        session.form.status = "prompt_ready";
        session.draftMessage = "New prompt-ready version created.";
        await persistContentRecord({ projectName, state, session, status: "prompt_ready", showMessage });
      }

      if (action === "save-draft") {
        await persistContentRecord({ projectName, state, session, status: normalizeStatus(session.form.status || current.readiness_status || "draft", "draft"), showMessage });
        session.draftMessage = "Version saved as draft.";
      }

      if (action === "save-library") {
        await saveToLibrary({ projectName, session, selectedItem: selected(), showMessage, rerender });
        await persistContentRecord({ projectName, state, session, status: normalizeStatus(session.form.status || current.readiness_status || "draft", "draft"), showMessage });
      }

      rerender();
    };
  });

  Array.from(document.querySelectorAll("[data-content-agent-use], [data-content-agent-save], [data-content-agent-ai]")).forEach((button) => {
    button.onclick = async () => {
      const id = button.getAttribute("data-content-agent-use") || button.getAttribute("data-content-agent-save") || button.getAttribute("data-content-agent-ai") || "";
      const agent = WRITING_AGENTS.find((entry) => entry.id === id);
      if (!agent) return;

      session.form.brief = [agent.suggestedPrompt, session.form.brief].filter(Boolean).join("\n\n");
      syncVersionFromForm(session);
      session.draftMessage = `${agent.title} prompt added.`;

      if (button.hasAttribute("data-content-agent-save")) {
        await persistContentRecord({ projectName, state, session, status: normalizeStatus(session.form.status || "draft", "draft"), showMessage });
      }

      if (button.hasAttribute("data-content-agent-ai")) {
        const prompt = buildAiPrompt(projectName, session, selected());
        const aiDraft = {
          projectName,
          modeId: "content",
          lastCommand: prompt,
          lastResponseTitle: `${agent.title} Assist`,
          routeSuggestions: []
        };
        setSharedAiDraft(projectName || "__default__", aiDraft);
        setSharedHandoff(projectName || "__default__", "ai-command", {
          source_page: "content-studio",
          destination_page: "ai-command",
          linked_entity: {
            entity_type: "content_item",
            entity_id: session.formSourceId || ""
          },
          payload: {
            prompt,
            title: `${agent.title} Assist`,
            draft_context: aiDraft,
            content: buildContentPayload(session, session.form.status || "draft")
          },
          status: "available"
        });
        navigateTo("ai-command");
        showMessage?.(`${agent.title} prompt sent to AI Command.`);
      }

      rerender();
    };
  });
}

export const contentStudioRoute = {
  id: "content-studio",
  disableStandardLayout: true,
  meta: {
    eyebrow: "Operations",
    title: "Content Studio",
    description: "Smart content production hub for draft generation, review, and routing to Media Studio and Publishing."
  },
  template: `
    <section class="page is-active" data-page="content-studio">
      <div id="contentStudioRoot"></div>
    </section>
  `,
  render({
    getState,
    $,
    escapeHtml,
    navigateTo,
    showMessage,
    showError
  }) {
    const state = getState();
    const projectName = firstText(state.context?.currentProject);
    const root = $("contentStudioRoot");
    if (!root) return;

    const session = ensureSession(projectName, state);
    const rerender = () => contentStudioRoute.render({
      getState,
      $,
      escapeHtml,
      navigateTo,
      showMessage,
      showError
    });

    if (!session.loaded && !session.loading && projectName) {
      loadWorkspace(projectName, state, session, rerender);
    }

    if (!projectName && !session.items.length) {
      session.items = loadLocalDrafts(projectName).map((item) => normalizeContentItem(item));
    }

    const selectedItem = getSelectedItem(session);
    if (selectedItem && selectedItem.id !== session.formSourceId && !session.isCreatingNew) {
      syncFormFromItem(session, selectedItem);
    }

    const metrics = getMetrics(session);
    const recommendation = buildRecommendation(metrics, selectedItem);
    const inbound = getInboundHandoff(projectName, session);
    const inboundSummary = inbound ? buildInboundSummary(inbound) : null;

    root.innerHTML = `
      ${renderScopedStyles()}
      <div class="content-smart-root">
        ${renderOverview(metrics, escapeHtml)}
        ${renderRecommendation(recommendation, selectedItem, escapeHtml)}
        ${session.error ? `<div class="simple-banner">${escapeHtml(session.error)}</div>` : ""}
        ${session.loading ? `<div class="empty-box">Loading content records, approvals, tasks, handoffs, and events...</div>` : ""}

        <div class="content-smart-grid">
          <div class="content-main">
            ${renderComposer(session, state, inboundSummary, escapeHtml)}
            ${renderQueue(session, escapeHtml)}
            ${renderPreview(session, selectedItem, escapeHtml)}
            ${renderVersioning(session, escapeHtml)}
          </div>
          <aside class="content-side">
            ${renderInboundHandoff(inboundSummary, session, escapeHtml)}
            ${renderAgents(escapeHtml)}
            ${buildAssetGate(state, escapeHtml)}
          </aside>
        </div>
      </div>
    `;

    bindPage({
      projectName,
      state,
      session,
      handoff: inboundSummary,
      navigateTo,
      showMessage,
      showError,
      rerender
    });
  }
};

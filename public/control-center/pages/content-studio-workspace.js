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

function confirmContentStudioAuthorityAction(action, detail = "") {
  if (typeof window === "undefined" || typeof window.confirm !== "function") return true;

  const message = [
    `Confirm Content Studio action: ${action}`,
    "",
    detail || "This action may create or update backend Content Studio records, AI drafts, or handoffs.",
    "",
    "Authority: This does not publish, send externally, or approve anything automatically.",
    "Select Cancel to review the draft, evidence, and destination before continuing."
  ].join("\n");

  return window.confirm(message);
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

  if (!confirmContentStudioAuthorityAction(
    "Save backend content draft",
    `This will save or update a Content Studio draft for ${projectName}.`
  )) {
    showMessage?.("Backend content save cancelled.");
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

  if (!confirmContentStudioAuthorityAction(
    "Create Library handoff",
    "This will create a Content Studio to Library handoff for review and asset preparation."
  )) {
    showMessage?.("Library handoff cancelled.");
    return;
  }

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
  if (!confirmContentStudioAuthorityAction(
    "Create Content Studio handoff",
    `This will create a Content Studio handoff to ${handoff.destination_page || "the selected workspace"} for review.`
  )) {
    showMessage?.("Content Studio handoff cancelled.");
    return false;
  }

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

  Array.from(document.querySelectorAll("[data-content-specialist]")).forEach((button) => {
    button.onclick = () => {
      session.activeSpecialistId = button.getAttribute("data-content-specialist") || "";
      rerender();
    };
  });

  
  
  
  
  
  
  Array.from(document.querySelectorAll("[data-content-publish-action]")).forEach((button) => {
    button.onclick = () => {
      const action = button.getAttribute("data-content-publish-action") || "";
      const clickExisting = (id) => {
        const target = document.getElementById(id);
        if (target && typeof target.click === "function") {
          target.click();
          return true;
        }
        return false;
      };

      if (action === "build-caption") {
        session.activeOutputMode = "draft";
        showMessage?.("Caption workflow selected. Build platform caption, opening hook, CTA, tone, language, and safe wording.");
        rerender();
        return;
      }

      if (action === "build-hashtags") {
        session.activeOutputMode = "packet";
        showMessage?.("Hashtag workflow selected. Build brand, category, problem, result, campaign, trend, and local-market hashtag set.");
        rerender();
        return;
      }

      if (action === "build-ads") {
        session.activeOutputMode = "packet";
        showMessage?.("Ad variants workflow selected. Prepare primary text, headlines, CTA variants, hook variants, and A/B labels.");
        rerender();
        return;
      }

      if (action === "legal-check") {
        session.activeReviewMode = "risk";
        showMessage?.("Legal check selected. Review claims, before/after, copyright, platform policy, brand safety, and consumer clarity.");
        rerender();
        return;
      }

      if (action === "approval-gates") {
        session.activeReviewMode = "handoff";
        showMessage?.("Approval gates selected. Confirm brand, source, governance, media, and publishing approvals before launch.");
        rerender();
        return;
      }

      if (action === "performance-plan") {
        session.activeReviewMode = "platform";
        showMessage?.("Performance plan selected. Track hook, watch time, engagement, clicks, conversions, ROAS, and learning loop.");
        rerender();
        return;
      }

      if (action === "save-learning") {
        if (!clickExisting("contentSaveDraftBtn")) {
          showMessage?.("Learning pack selected. Save winning hooks, weak points, audience reactions, prompt templates, and next actions to Library.");
        }
        return;
      }

      if (action === "send-publishing") {
        if (!clickExisting("contentSendPublishingBtn")) {
          showMessage?.("Publishing Pack is ready after caption, hashtags, CTA, legal checks, approvals, schedule, A/B plan, and measurement are complete.");
        }
        return;
      }

      showMessage?.("Publishing / Legal / Performance action selected.");
    };
  });

  Array.from(document.querySelectorAll("[data-content-post-action]")).forEach((button) => {
    button.onclick = () => {
      const action = button.getAttribute("data-content-post-action") || "";
      const clickExisting = (id) => {
        const target = document.getElementById(id);
        if (target && typeof target.click === "function") {
          target.click();
          return true;
        }
        return false;
      };

      if (action === "build-voiceover") {
        session.activeOutputMode = "voiceover";
        showMessage?.("Voiceover workflow selected. Build script, language variants, voice profile, pace, emotion, pronunciation notes, and duration.");
        rerender();
        return;
      }

      if (action === "sound-design") {
        session.activeOutputMode = "voiceover";
        showMessage?.("Sound design selected. Define music mood, BPM, transitions, beat sync, logo sting, and emotional sound direction.");
        rerender();
        return;
      }

      if (action === "sfx-plan") {
        session.activeOutputMode = "scene";
        showMessage?.("SFX plan selected. Map sound effects per scene: hits, risers, whooshes, texture swipes, jar click, and CTA sting.");
        rerender();
        return;
      }

      if (action === "graphics-plan") {
        session.activeOutputMode = "scene";
        showMessage?.("Graphics plan selected. Prepare text overlays, callouts, badges, safe zones, Canva-style motion, and After Effects notes.");
        rerender();
        return;
      }

      if (action === "editing-notes") {
        session.activeOutputMode = "packet";
        showMessage?.("Editing notes selected. Define cut rhythm, scene order, transitions, hold frames, CTA ending, and beat sync.");
        rerender();
        return;
      }

      if (action === "export-plan") {
        session.activeReviewMode = "platform";
        showMessage?.("Export plan selected. Prepare 9:16, 1:1, 4:5, VO, no-VO, music-only, subtitle, and ad-safe versions.");
        rerender();
        return;
      }

      if (action === "post-qc") {
        session.activeReviewMode = "risk";
        showMessage?.("Post QC selected. Validate audio clarity, subtitle accuracy, graphic safety, edit rhythm, platform specs, and final approval.");
        rerender();
        return;
      }

      if (action === "send-media-post") {
        if (!clickExisting("contentSendMediaBtn")) {
          showMessage?.("Post Production Pack is ready for Media Studio after VO, sound, SFX, graphics, edit notes, exports, and QC are complete.");
        }
        return;
      }

      showMessage?.("Post-production action selected.");
    };
  });

  Array.from(document.querySelectorAll("[data-content-video-action]")).forEach((button) => {
    button.onclick = () => {
      const action = button.getAttribute("data-content-video-action") || "";
      const clickExisting = (id) => {
        const target = document.getElementById(id);
        if (target && typeof target.click === "function") {
          target.click();
          return true;
        }
        return false;
      };

      if (action === "build-motion-system") {
        session.activeOutputMode = "scene";
        showMessage?.("Motion system selected. Define platform ratio, duration, scene timing, camera language, product motion, and video continuity rules.");
        rerender();
        return;
      }

      if (action === "scene-motion-rules") {
        session.activeOutputMode = "scene";
        showMessage?.("Scene motion rules selected. Every scene must have one action, start frame, end frame, motion prompt, negative prompt, and QC rule.");
        rerender();
        return;
      }

      if (action === "camera-plan") {
        session.activeOutputMode = "prompt";
        showMessage?.("Camera plan selected. Define shot size, angle, lens feel, movement, speed, and stabilization for each scene.");
        rerender();
        return;
      }

      if (action === "continuity-locks") {
        session.activeReviewMode = "brand";
        showMessage?.("Continuity locks selected. Keep product, logo, label, model, hand, outfit, location, light, and color grade consistent.");
        rerender();
        return;
      }

      if (action === "negative-motion") {
        session.activeOutputMode = "prompt";
        showMessage?.("Negative motion prompt selected. Prevent product morphing, unreadable logo, distorted hands, random objects, and scene jumps.");
        rerender();
        return;
      }

      if (action === "video-qc") {
        session.activeReviewMode = "risk";
        showMessage?.("Video QC selected. Validate scene logic, timing, motion clarity, logo readability, audio sync, and Media Studio readiness.");
        rerender();
        return;
      }

      if (action === "send-media-video") {
        if (!clickExisting("contentSendMediaBtn")) {
          showMessage?.("Video Motion Pack is ready for Media Studio after image locks, scene motion, audio notes, export specs, and QC are complete.");
        }
        return;
      }

      showMessage?.("Video / Motion action selected.");
    };
  });

  Array.from(document.querySelectorAll("[data-content-image-action]")).forEach((button) => {
    button.onclick = () => {
      const action = button.getAttribute("data-content-image-action") || "";
      const clickExisting = (id) => {
        const target = document.getElementById(id);
        if (target && typeof target.click === "function") {
          target.click();
          return true;
        }
        return false;
      };

      if (action === "check-assets") {
        session.activeReviewMode = "sources";
        showMessage?.("Image asset check selected. Approve product, logo, model, location, texture, start/end frames, thumbnail, and clean plate references.");
        rerender();
        return;
      }

      if (action === "build-image-prompt") {
        session.activeOutputMode = "prompt";
        showMessage?.("Image prompt workflow selected. Build prompt with product lock, logo lock, background, camera, lighting, style, and negative prompt.");
        rerender();
        return;
      }

      if (action === "build-start-frame") {
        session.activeOutputMode = "scene";
        showMessage?.("Start Frame workflow selected. Prepare the approved still image before motion with product, logo, model, and location locked.");
        rerender();
        return;
      }

      if (action === "build-end-frame") {
        session.activeOutputMode = "scene";
        showMessage?.("End Frame workflow selected. Prepare the approved final still for CTA, logo readability, and product hero continuity.");
        rerender();
        return;
      }

      if (action === "build-thumbnail") {
        session.activeOutputMode = "prompt";
        showMessage?.("Thumbnail workflow selected. Prepare a high-attention cover image with safe text zone and platform-ready crop.");
        rerender();
        return;
      }

      if (action === "send-media-image") {
        if (!clickExisting("contentSendMediaBtn")) {
          showMessage?.("Image Pack is ready for Media Studio after product, logo, background, start/end frames, and QC are approved.");
        }
        return;
      }

      showMessage?.("Image production action selected.");
    };
  });

  Array.from(document.querySelectorAll("[data-content-research-action]")).forEach((button) => {
    button.onclick = () => {
      const action = button.getAttribute("data-content-research-action") || "";
      const clickExisting = (id) => {
        const target = document.getElementById(id);
        if (target && typeof target.click === "function") {
          target.click();
          return true;
        }
        return false;
      };

      if (action === "load-research") {
        session.activeReviewMode = "sources";
        showMessage?.("Research Packet selected. Attach competitor, trend, audience, sound, hashtag, and hook findings from Research.");
        rerender();
        return;
      }

      if (action === "load-insight") {
        session.activeReviewMode = "sources";
        showMessage?.("Insight Packet selected. Attach performance gaps, weak hooks, best variants, audience behavior, and improvement notes.");
        rerender();
        return;
      }

      if (action === "build-angles") {
        session.activeOutputMode = "draft";
        showMessage?.("Creative angle workflow selected. Convert research signals into campaign angles, audience pain points, and content opportunities.");
        rerender();
        return;
      }

      if (action === "build-hooks") {
        if (!clickExisting("contentGenerateDraftBtn")) {
          showMessage?.("Hook Bank workflow selected. Generate hooks from audience pain, competitor patterns, platform trends, and performance insights.");
        }
        return;
      }

      if (action === "send-storyboard") {
        session.activeOutputMode = "script";
        session.activeReviewMode = "handoff";
        showMessage?.("Research findings are ready to feed the Storyboard Execution Packet.");
        rerender();
        return;
      }

      if (action === "save-learning") {
        if (!clickExisting("contentSaveDraftBtn")) {
          showMessage?.("Learning packet is ready to save after approved outputs and performance results.");
        }
        return;
      }

      showMessage?.("Research / Insight action selected.");
    };
  });

  Array.from(document.querySelectorAll("[data-content-bible-action]")).forEach((button) => {
    button.onclick = () => {
      const action = button.getAttribute("data-content-bible-action") || "";
      const clickExisting = (id) => {
        const target = document.getElementById(id);
        if (target && typeof target.click === "function") {
          target.click();
          return true;
        }
        return false;
      };

      if (action === "check-references") {
        session.activeReviewMode = "sources";
        showMessage?.("Reference check selected. Attach approved product, logo, model, location, motion, and audio references before Media Studio.");
        rerender();
        return;
      }

      if (action === "improve-brief") {
        if (!clickExisting("contentImproveBtn")) {
          showMessage?.("Improve Brief is ready. Add missing audience, CTA, platform, and source rules first.");
        }
        return;
      }

      if (action === "build-scene-prompts") {
        session.activeOutputMode = "prompt";
        session.activeReviewMode = "handoff";
        showMessage?.("Scene prompt workflow selected. Build one prompt per scene with product, logo, model, location, motion, and negative prompt rules.");
        rerender();
        return;
      }

      if (action === "build-audio-plan") {
        session.activeOutputMode = "voiceover";
        session.activeReviewMode = "handoff";
        showMessage?.("Audio plan selected. Prepare voiceover, music direction, SFX, timing, and export variants before Media Studio.");
        rerender();
        return;
      }

      if (action === "prepare-handoff") {
        session.activeReviewMode = "handoff";
        showMessage?.("Media handoff preparation selected. Review the validator, complete missing references, then send the packet to Media Studio.");
        rerender();
        return;
      }

      if (action === "save-bible") {
        if (!clickExisting("contentSaveDraftBtn")) {
          showMessage?.("Production Bible is ready to save once the draft packet is available.");
        }
        return;
      }

      if (action === "send-media") {
        if (!clickExisting("contentSendMediaBtn")) {
          showMessage?.("Media Studio handoff is ready once the production bible, references, scene prompts, and audio plan are complete.");
        }
        return;
      }

      showMessage?.("Production Bible action selected.");
    };
  });

  Array.from(document.querySelectorAll("[data-content-review]")).forEach((button) => {
    button.onclick = () => {
      session.activeReviewMode = button.getAttribute("data-content-review") || "output";
      rerender();
    };
  });

  Array.from(document.querySelectorAll("[data-content-timeline]")).forEach((button) => {
    button.onclick = () => {
      session.activeTimelineMode = button.getAttribute("data-content-timeline") || "drafts";
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
        if (!confirmContentStudioAuthorityAction(
          "Generate draft with AI backend",
          "This will send the current brief to the AI command backend and create a review draft inside Content Studio."
        )) {
          session.draftMessage = "AI draft generation cancelled.";
          rerender();
          return;
        }

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

      if (!confirmContentStudioAuthorityAction(
        "Translate/adapt brief with AI backend",
        `This will send the current Content Studio brief to the AI command backend for ${language} adaptation.`
      )) {
        session.draftMessage = "Translate/adapt request cancelled.";
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
      const confirmed = confirmContentStudioAuthorityAction(
        "Create AI Command content handoff",
        "This will attach shared AI handoff context and navigate to AI Command for review and planning support. It does not publish, approve, send externally, or create backend tasks."
      );
      if (!confirmed) return;

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
        const confirmed = confirmContentStudioAuthorityAction(
          "Confirm content approval mark",
          "This will mark the selected content version as approved/review-ready and may save that readiness state to the backend."
        );
        if (!confirmed) return;

        current.readiness_status = "approved";
        current.approval_status = "approved";
        session.form.status = "approved";
        session.draftMessage = "Selected version approved.";
        await persistContentRecord({ projectName, state, session, status: "approved", showMessage });
      }

      if (action === "reject") {
        const confirmed = confirmContentStudioAuthorityAction(
          "Confirm content revision decision",
          "This will return the selected content version to draft/revision and may save that readiness state to the backend."
        );
        if (!confirmed) return;

        current.readiness_status = "draft";
        current.approval_status = "rejected";
        session.form.status = "draft";
        session.draftMessage = "Selected version returned to draft.";
        await persistContentRecord({ projectName, state, session, status: "draft", showMessage });
      }

      if (action === "regenerate") {
        const confirmed = confirmContentStudioAuthorityAction(
          "Confirm content version regeneration",
          "This will create a new prompt-ready version from the selected content version and may save it to the backend."
        );
        if (!confirmed) return;

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
        const confirmed = confirmContentStudioAuthorityAction(
          "Confirm content draft save",
          "This will save the selected content version as a draft. If a backend project is selected, it may update the backend content record."
        );
        if (!confirmed) return;

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
        const confirmed = confirmContentStudioAuthorityAction(
          "Confirm agent draft save",
          "This will save the agent-assisted content draft. If a backend project is selected, it may update the backend content record."
        );
        if (!confirmed) return;

        await persistContentRecord({ projectName, state, session, status: normalizeStatus(session.form.status || "draft", "draft"), showMessage });
      }

      if (button.hasAttribute("data-content-agent-ai")) {
        const confirmed = confirmContentStudioAuthorityAction(
          "Create AI Command agent handoff",
          `This will attach ${agent.title} shared AI handoff context and navigate to AI Command for review and planning support. It does not publish, approve, send externally, or create backend tasks.`
        );
        if (!confirmed) {
          rerender();
          return;
        }

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




function contentOsSpecialists() {
  return WRITING_AGENTS.map((agent, index) => ({
    ...agent,
    step: index + 1
  }));
}

function contentOsActiveSpecialist(session) {
  const list = contentOsSpecialists();
  const requested = session.activeSpecialistId || list[0]?.id || "";
  return list.find((agent) => agent.id === requested) || list[0] || {
    id: "content-strategist",
    title: "Content Strategist",
    purpose: "Plan content direction.",
    bestUse: "Use before drafting.",
    suggestedPrompt: "Act as Content Strategist.",
    step: 1
  };
}

function contentOsActiveReviewMode(session) {
  const allowed = ["readiness", "sources", "brand", "platform", "governance", "handoff"];
  return allowed.includes(session.activeReviewMode) ? session.activeReviewMode : "readiness";
}

function contentOsActiveTimeline(session) {
  const allowed = ["request", "brief", "draft", "review", "approved", "handoff", "learned"];
  return allowed.includes(session.activeTimelineMode) ? session.activeTimelineMode : "request";
}

function contentOsDetectedType(session, selectedItem) {
  const form = session.form || {};
  const joined = [
    form.mode,
    form.objective,
    form.brief,
    form.title,
    selectedItem?.type,
    selectedItem?.title,
    selectedItem?.draft
  ].filter(Boolean).join(" ").toLowerCase();

  if (/video|reel|short|storyboard|scene|shot|voiceover|voice over|kling|runway|sora/.test(joined)) {
    return "Video Ad / Media Brief";
  }

  if (/image|photo|picture|visual|prompt|logo|product shot|frame/.test(joined)) {
    return "Image Prompt / Visual Brief";
  }

  if (/profile|company profile|about us|company/.test(joined)) {
    return "Company Profile";
  }

  if (/agreement|contract|terms|legal/.test(joined)) {
    return "Agreement Draft";
  }

  if (/speech|talk|presentation|voice/.test(joined)) {
    return "Speech / Voice Draft";
  }

  if (/email|newsletter/.test(joined)) {
    return "Email Content";
  }

  if (/marketplace|amazon|ebay|shopify|woocommerce|listing/.test(joined)) {
    return "Marketplace Listing";
  }

  if (/campaign|ad|ads|caption|social|post|instagram|tiktok|facebook|linkedin/.test(joined)) {
    return "Campaign / Social Content";
  }

  if (/customer|reply|whatsapp|message|crm/.test(joined)) {
    return "Customer Message";
  }

  if (/research|insight|competitor|trend|report|performance/.test(joined)) {
    return "Research-to-Content";
  }

  return modeLabel(form.mode || "social-post");
}

function contentOsDestination(session, selectedItem) {
  const detected = contentOsDetectedType(session, selectedItem);
  const text = `${detected} ${session.form?.objective || ""} ${session.form?.brief || ""}`.toLowerCase();

  if (/video|image|visual|scene|shot|voiceover|media/.test(text)) {
    return "Media Studio";
  }

  if (/ad|ads|campaign|variant/.test(text)) {
    return "Ads / Campaign";
  }

  if (/customer|crm|whatsapp|reply/.test(text)) {
    return "CRM";
  }

  if (/post|caption|publish|instagram|tiktok|facebook|linkedin|youtube/.test(text)) {
    return "Publishing";
  }

  if (/profile|library|approved/.test(text)) {
    return "Library";
  }

  return "Final Content";
}

function contentOsWorkflowName(session, selectedItem) {
  const detected = contentOsDetectedType(session, selectedItem);

  if (/Video|Media/.test(detected)) return "Media Production Blueprint";
  if (/Image/.test(detected)) return "Image Prompt Blueprint";
  if (/Company Profile/.test(detected)) return "Company Profile Package";
  if (/Agreement/.test(detected)) return "Agreement Draft Workflow";
  if (/Speech|Voice/.test(detected)) return "Speech & Voice Workflow";
  if (/Marketplace/.test(detected)) return "Marketplace Listing Workflow";
  if (/Research/.test(detected)) return "Insight-to-Content Builder";
  if (/Customer/.test(detected)) return "Customer Message Workflow";
  return "Content Package Builder";
}

function contentOsIsMediaWorkflow(session, selectedItem) {
  return /Media|Video|Image|Voice|Storyboard|Prompt/.test(contentOsDetectedType(session, selectedItem)) ||
    /Media|Image|Video/.test(contentOsWorkflowName(session, selectedItem));
}

function contentOsReadiness(session, state, handoff, selectedItem) {
  const form = session.form || {};
  const sourceCount = asArray(state?.sharedContext?.sources).length +
    asArray(handoff?.sources).length +
    (handoff ? 1 : 0) +
    (form.product ? 1 : 0) +
    (form.campaign ? 1 : 0);

  const hasBrief = Boolean(String(form.brief || "").trim());
  const hasObjective = Boolean(String(form.objective || "").trim());
  const hasProduct = Boolean(String(form.product || "").trim());
  const hasChannel = Boolean(String(form.channel || "").trim());
  const hasOutput = Boolean(selectedVersionEntry(session)?.output_content || selectedItem?.draft);
  const isMedia = contentOsIsMediaWorkflow(session, selectedItem);

  const items = [
    ["Source ready", sourceCount > 0 || hasProduct || Boolean(handoff)],
    ["Brief ready", hasBrief || hasObjective],
    ["Audience / channel", hasChannel || Boolean(form.tone)],
    ["Output created", hasOutput],
    ["Brand / product lock", isMedia ? hasProduct : true],
    ["Review ready", hasOutput && (hasBrief || hasObjective)]
  ];

  const ready = items.filter((item) => item[1]).length;
  const score = Math.round((ready / items.length) * 100);

  return {
    items,
    score,
    level: score >= 80 ? "High" : score >= 50 ? "Medium" : "Low",
    missing: items.filter((item) => !item[1]).map((item) => item[0])
  };
}


function contentOsNextAction(session, state, handoff, selectedItem) {
  const readiness = contentOsReadiness(session, state, handoff, selectedItem);
  const missing = readiness.missing || [];
  const destination = contentOsDestination(session, selectedItem);

  if (missing.includes("Output created")) {
    return "Generate the first output to unlock review, versions, and handoff.";
  }

  if (missing.includes("Review ready")) {
    return "Run review, approve the version, then create the handoff packet.";
  }

  if (missing.includes("Brief ready")) {
    return "Complete the brief or use Smart Tools to build it from the command.";
  }

  if (missing.includes("Brand / product lock")) {
    return "Confirm product and logo lock before sending to Media Studio.";
  }

  if (destination === "Media Studio") {
    return "Create a media production packet with prompts, scenes, voiceover, and locks.";
  }

  if (destination === "Publishing") {
    return "Approve final copy, then send a publishing packet with caption, CTA, and hashtags.";
  }

  if (destination === "Ads / Campaign") {
    return "Create ad-ready variants, hooks, CTA options, and claim-safe copy.";
  }

  return "Approve the output or improve it before sending to the next workspace.";
}

function contentOsPackageItems(session, selectedItem) {
  const detected = contentOsDetectedType(session, selectedItem);

  if (/Video|Media/.test(detected)) {
    return [
      "Concept",
      "Hook",
      "Script",
      "Voiceover",
      "Scene list",
      "Shot list",
      "Prompt per scene",
      "Start / end frame",
      "Sound direction",
      "Media packet"
    ];
  }

  if (/Image/.test(detected)) {
    return [
      "Image description",
      "Product identity notes",
      "Logo rule",
      "Camera angle",
      "Lighting",
      "Background",
      "Negative prompt",
      "Visual packet"
    ];
  }

  if (/Company Profile/.test(detected)) {
    return [
      "Executive summary",
      "About us",
      "Services",
      "Mission / vision",
      "Why choose us",
      "Short version",
      "Website version",
      "PDF-ready version"
    ];
  }

  if (/Research/.test(detected)) {
    return [
      "Insight summary",
      "Content opportunities",
      "Post ideas",
      "Ad hooks",
      "Video concepts",
      "SEO angles",
      "Media brief",
      "Campaign suggestion"
    ];
  }

  if (/Customer/.test(detected)) {
    return [
      "Short message",
      "Formal version",
      "Friendly version",
      "WhatsApp version",
      "Email version",
      "Follow-up"
    ];
  }

  return [
    "Main draft",
    "Improved version",
    "Short version",
    "Platform version",
    "CTA",
    "Variants"
  ];
}

function renderContentOsAppBar(session, state, handoff, metrics, selectedItem, escapeHtml) {
  const detected = contentOsDetectedType(session, selectedItem);
  const destination = contentOsDestination(session, selectedItem);
  const workflow = contentOsWorkflowName(session, selectedItem);
  const readiness = contentOsReadiness(session, state, handoff, selectedItem);
  const form = session.form || {};

  return `
    <header class="content-os-appbar">
      <div class="content-os-appbrand">
        <span>Content Studio</span>
        <strong>AI Content Production Agency</strong>
      </div>

      <label class="content-os-commandline" for="contentObjectiveInput">
        <span>Creative Command</span>
        <input id="contentObjectiveInput" name="objective" form="contentComposerForm" class="content-os-input" type="text" value="${escapeHtml(form.objective || "")}" placeholder="Tell the AI team what you want to create, improve, adapt, script, prompt, or hand off...">
      </label>

      <div class="content-os-appmeta">
        <span>${escapeHtml(detected)}</span>
        <span>${escapeHtml(destination)}</span>
        <span>${escapeHtml(readiness.level)} · ${escapeHtml(String(readiness.score))}%</span>
      </div>

      <button id="contentGenerateDraftBtn" class="content-os-action is-primary" type="button">Generate Draft</button>

      <div class="content-os-live-line"><span class="content-os-live-dot"></span><strong>Live studio ready</strong><em>AI team is standing by for brief, draft, prompt, review, and handoff.</em></div><div class="content-os-contextline">
        <span>Workflow: ${escapeHtml(workflow)}</span>
        <span>Project: ${escapeHtml(form.project || "No project")}</span>
        <span>Incoming: ${handoff ? escapeHtml(titleCase(handoff.sourcePage || "handover")) : "None"}</span>
        <span>Status: ${escapeHtml(titleCase(selectedItem?.status || form.status || "draft"))}</span>
      </div>
    </header>
  `;
}

function renderContentOsContextStrip(session, state, handoff, recommendation, escapeHtml) {
  const form = session.form || {};
  const items = [
    ["AI Command", handoff?.sourcePage ? `Handover from ${titleCase(handoff.sourcePage)}` : "No handover"],
    ["Campaign", form.campaign || "Not selected"],
    ["Research", state?.sharedContext?.insight ? "Insight attached" : "No insight"],
    ["Reports", "Can improve variants"],
    ["Media", "Can return prompt fixes"],
    ["CRM", "Can request replies"]
  ];

  return `
    <section class="content-os-context-strip" aria-label="Incoming context">
      <div class="content-os-guide-tower" aria-label="Content production guide"><span class="is-active">01 Request</span><span>02 Sources</span><span>03 Draft</span><span>04 Review</span><span>05 Handoff</span></div><div class="content-os-context-items">
        ${items.map(([label, value]) => `
          <span><em>${escapeHtml(label)}</em>${escapeHtml(value)}</span>
        `).join("")}
      </div>
      <strong>${escapeHtml(recommendation?.action || "Build brief, attach sources, then generate output.")}</strong>
    </section>
  `;
}

function renderContentOsField(id, name, label, value, session, escapeHtml) {
  return `
    <label class="content-os-field" for="${escapeHtml(id)}">
      <span>${escapeHtml(label)}</span>
      <input id="${escapeHtml(id)}" name="${escapeHtml(name)}" class="content-os-input" type="text" value="${escapeHtml(value || "")}">
      ${fieldError(session, name, escapeHtml)}
    </label>
  `;
}

function renderContentOsSourceRail(session, state, handoff, selectedItem, escapeHtml) {
  const form = session.form || {};
  const readiness = contentOsReadiness(session, state, handoff, selectedItem);
  const sourceRows = [
    ["Setup", firstText(state?.setup?.brand, state?.brand?.name, "Brand / product setup")],
    ["Library", asArray(state?.sharedContext?.sources).length ? `${asArray(state?.sharedContext?.sources).length} linked sources` : "Select approved sources"],
    ["Handover", handoff ? firstText(handoff.sourcePage, "Incoming context") : "No active handover"],
    ["Research", state?.sharedContext?.insight ? "Insight attached" : "No insight"],
    ["Upload", "PDF / image / voice / document"],
    ["Rules", "Do / Don’t, locks, legal-safe wording"]
  ];

  return `
    <aside class="content-os-source-rail" aria-label="Sources and brief">
      <div class="content-os-rail-heading">
        <span>Sources & Brief</span>
        <strong>Source truth, locks, and brief</strong>
      </div>

      <form id="contentComposerForm" class="content-os-form">
        ${renderContentOsField("contentProjectInput", "project", "Project", form.project, session, escapeHtml)}
        ${renderContentOsField("contentCampaignInput", "campaign", "Campaign", form.campaign, session, escapeHtml)}
        ${renderContentOsField("contentProductInput", "product", "Product / Subject", form.product, session, escapeHtml)}
        ${renderContentOsField("contentChannelInput", "channel", "Platform", form.channel, session, escapeHtml)}
        ${renderContentOsField("contentLanguageInput", "language", "Language", form.language, session, escapeHtml)}
        ${renderContentOsField("contentToneInput", "tone", "Tone", form.tone, session, escapeHtml)}

        <label class="content-os-writing is-brief" for="contentBriefInput">
          <span>Brief</span>
          <textarea id="contentBriefInput" name="brief" class="content-os-textarea" rows="9" placeholder="Goal, audience, sources, rules, platform, and desired output.">${escapeHtml(form.brief || "")}</textarea>
          ${fieldError(session, "brief", escapeHtml)}
        </label>

        <label class="content-os-field content-os-title-field" for="contentTitleInput">
          <span>Output title</span>
          <input id="contentTitleInput" name="title" class="content-os-input" type="text" value="${escapeHtml(form.title || "")}">
        </label>
      </form>

      <div class="content-os-source-stack">
        <div class="content-os-mini-title">Source map</div>
        ${sourceRows.map(([label, value]) => `
          <div class="content-os-source-line">
            <span>${escapeHtml(label)}</span>
            <strong>${escapeHtml(value)}</strong>
          </div>
        `).join("")}
      </div>

      <div class="content-os-readiness-chip">
        <span>Source confidence</span>
        <strong>${escapeHtml(readiness.level)} · ${escapeHtml(String(readiness.score))}%</strong>
      </div>
    </aside>
  `;
}

function renderContentOsModeTabs(session, selectedItem, escapeHtml) {
  const tabs = ["Draft", "Prompt", "Script", "Scene", "Voiceover", "Packet"];
  return `
    <nav class="content-os-mode-tabs" aria-label="Output modes">
      ${tabs.map((tab, index) => `
        <button class="${index === 0 ? "is-active" : ""}" type="button">${escapeHtml(tab)}</button>
      `).join("")}
    </nav>
  `;
}

function renderContentOsInlineToolbelt(session, selectedItem, escapeHtml) {
  const active = contentOsActiveSpecialist(session);
  const tools = [
    ["Improve", "contentImproveBtn"],
    ["Translate / Localize", "contentTranslateBtn"],
    ["Save Draft", "contentSaveDraftBtn"],
    ["Media Packet", "contentSendMediaBtn"],
    ["Publishing Packet", "contentSendPublishingBtn"],
    ["AI Context", "contentSendAiBtn"]
  ];

  return `
    <div class="content-os-inline-tools" aria-label="Smart content tools">
      <div class="content-os-tool-left">
        ${tools.map(([label, id]) => `
          <button id="${escapeHtml(id)}" class="content-os-action" type="button">${escapeHtml(label)}</button>
        `).join("")}
      </div>
      <div class="content-os-tool-right">
        <span>Assistant</span>
        <strong>${escapeHtml(active.title)}</strong>
      </div>
    </div>
  `;
}

function renderContentOsProductionCanvas(session, state, handoff, selectedItem, escapeHtml) {
  const form = session.form || {};
  const version = selectedVersionEntry(session);
  const content = firstText(version?.output_content, selectedItem?.draft, "");
  const detected = contentOsDetectedType(session, selectedItem);
  const workflow = contentOsWorkflowName(session, selectedItem);
  const destination = contentOsDestination(session, selectedItem);

  return `
    <main class="content-os-canvas-main" aria-label="Production canvas">
      <div class="content-os-canvas-header">
        <div>
          <span>Production Desk</span>
          <strong>${escapeHtml(workflow)}</strong>
        </div>
        ${renderContentOsModeTabs(session, selectedItem, escapeHtml)}
      </div>

      ${renderContentOsInlineToolbelt(session, selectedItem, escapeHtml)}

      <section class="content-os-editor-surface content-os-live-surface" id="contentPreviewPanel">
        <div class="content-os-editor-meta">
          <span>${escapeHtml(detected)}</span>
          <strong>${escapeHtml(firstText(form.title, selectedItem?.title, "Untitled output"))}</strong>
          <em>Destination: ${escapeHtml(destination)}</em>
        </div>

        <div class="content-os-editor-actions"><button id="contentCanvasDraftCta" class="content-os-action is-ghost" type="button">Generate first draft</button><button id="contentCanvasBriefCta" class="content-os-action is-ghost" type="button">Build better brief</button><button id="contentCanvasPacketCta" class="content-os-action is-ghost" type="button">Prepare packet</button></div><div class="content-os-editor-body">
          ${escapeHtml(content || "Ready to produce your first content package. Start with a draft, strengthen the brief, or prepare a production packet for the selected destination.")}
        </div>
      </section>

      ${renderContentOsPackageLine(session, selectedItem, escapeHtml)}
      ${renderContentOsProductionBible(session, selectedItem, escapeHtml)}
      ${renderContentOsStoryboardPacket(session, selectedItem, escapeHtml)}
      ${renderContentOsCampaignContentPack(session, selectedItem, escapeHtml)}
      ${renderContentOsResearchInsightPacket(session, selectedItem, escapeHtml)}
      ${renderContentOsImageProductionPack(session, selectedItem, escapeHtml)}
      ${renderContentOsVideoMotionPack(session, selectedItem, escapeHtml)}
      ${renderContentOsPostProductionPack(session, selectedItem, escapeHtml)}
      ${renderContentOsPublishingLegalPerformancePack(session, selectedItem, escapeHtml)}
      ${renderContentOsMediaBlueprint(session, selectedItem, escapeHtml)}
    </main>
  `;
}

function renderContentOsPackageLine(session, selectedItem, escapeHtml) {
  return `
    <div class="content-os-package-line" aria-label="Expected package">
      <span>Expected package</span>
      ${contentOsPackageItems(session, selectedItem).map((item) => `
        <strong>${escapeHtml(item)}</strong>
      `).join("")}
    </div>
  `;
}

function renderContentOsMediaBlueprint(session, selectedItem, escapeHtml) {
  if (!contentOsIsMediaWorkflow(session, selectedItem)) {
    return "";
  }

  const rows = [
    ["Product lock", "Same approved product shape, color, proportions, and details"],
    ["Logo lock", "Exact approved logo, readable, not distorted"],
    ["Location strategy", "Choose and keep one approved location style"],
    ["Scene logic", "Hook → feature/demo → benefit → hero → CTA"],
    ["Motion rules", "Define movement and what must stay fixed"],
    ["Negative prompt", "No wrong logo, altered product, or random background"]
  ];

  return `
    <section class="content-os-blueprint-line" aria-label="Media production blueprint">
      <span>Media blueprint</span>
      ${rows.map(([label, value]) => `
        <div>
          <strong>${escapeHtml(label)}</strong>
          <em>${escapeHtml(value)}</em>
        </div>
      `).join("")}
    </section>
  `;
}


function contentOsCampaignBibleSections(session, selectedItem) {
  const form = session.form || {};
  const detected = contentOsDetectedType(session, selectedItem);
  const destination = contentOsDestination(session, selectedItem);
  const workflow = contentOsWorkflowName(session, selectedItem);

  return [
    {
      title: "Campaign Intake",
      status: "ready",
      items: [
        ["Product", form.product || "Not selected"],
        ["Goal", form.objective || "Needs campaign goal"],
        ["Audience", "Target audience and buyer segment required"],
        ["Platform", form.channel || "Needs platform"],
        ["Language", form.language || "Needs language"],
        ["CTA", "CTA and landing link required"]
      ]
    },
    {
      title: "Reference Packs",
      status: "missing",
      items: [
        ["Product Reference", "Front, side, packaging, logo close-up, texture"],
        ["Brand Assets", "Logo, colors, tone, visual identity"],
        ["Model Reference", "Same model, hair, outfit, expression"],
        ["Location Reference", "Approved studio / location reference"],
        ["Motion Reference", "Product handling, application, styling movement"],
        ["Audio Reference", "Music mood, SFX, voice profile"]
      ]
    },
    {
      title: "Consistency Locks",
      status: "needs-review",
      items: [
        ["Product Lock", "Same product, label, cap, logo, size, no redesign"],
        ["Brand Lock", "Premium masculine grooming, dark clean style"],
        ["Model Lock", "Same face, hair, outfit, skin tone"],
        ["Location Lock", "Same room, lighting, background"],
        ["Logo Lock", "Readable, not distorted, not hidden"],
        ["Claim Safety", "No medical or unsupported performance claims"]
      ]
    },
    {
      title: "Scene Production Table",
      status: "draft",
      items: [
        ["Scene 01", "Hook / problem / first impression"],
        ["Scene 02", "Product reveal / logo readable"],
        ["Scene 03", "Texture and small amount"],
        ["Scene 04", "Application and styling"],
        ["Scene 05", "Final look and confidence"],
        ["Scene 06", "Product hero and CTA"]
      ]
    },
    {
      title: "Prompt System",
      status: "draft",
      items: [
        ["Master Prompt", "Campaign-wide visual, brand, product, model, location rules"],
        ["Scene Prompts", "One prompt per scene, one action per shot"],
        ["Negative Prompt", "No product redesign, no logo change, no fake labels, no random text"],
        ["Start Frames", "Approved still image before motion"],
        ["End Frames", "Approved final image before motion"],
        ["Prompt Preview", "What AI will use and why"]
      ]
    },
    {
      title: "Audio & Post Production",
      status: "draft",
      items: [
        ["Music Direction", "Dark premium beat, 90–110 BPM"],
        ["Sound Effects", "Bass hit, jar click, texture swipe, riser, logo sting"],
        ["Voiceover", "Language, tone, pace, pronunciation"],
        ["Text Animation", "Short safe text, no AI-generated text inside video"],
        ["Color Grade", "Premium dark grade, clean skin tone, visible product"],
        ["Exports", "9:16 ad, story, no-VO, VO, music-only versions"]
      ]
    },
    {
      title: "Media Handoff Validator",
      status: "missing",
      items: [
        ["Production Bible", "Must be complete before Media Studio"],
        ["References", "Product, logo, model, and location references approved"],
        ["Scenes", "Scene list, shot list, and durations approved"],
        ["Prompts", "Master, scene, and negative prompts ready"],
        ["Audio", "Voiceover, music, and SFX direction ready"],
        ["QC Gates", "Product, brand, motion, audio, platform checks ready"]
      ]
    }
  ];
}

function contentOsBibleReadiness(session, selectedItem) {
  const sections = contentOsCampaignBibleSections(session, selectedItem);
  const ready = sections.filter((section) => section.status === "ready").length;
  const draft = sections.filter((section) => section.status === "draft").length;
  const missing = sections.filter((section) => section.status === "missing").length;
  const needsReview = sections.filter((section) => section.status === "needs-review").length;
  const total = sections.length;
  const score = Math.max(12, Math.round(((ready * 1 + draft * 0.55 + needsReview * 0.38) / total) * 100));

  return {
    score,
    label: score >= 85 ? "Media handoff ready" : score >= 60 ? "Production bible in progress" : "Bible needs sources",
    missing,
    draft,
    needsReview,
    ready
  };
}

function renderContentOsProductionBible(session, selectedItem, escapeHtml) {
  const sections = contentOsCampaignBibleSections(session, selectedItem);
  const readiness = contentOsBibleReadiness(session, selectedItem);

  return `
    <section class="content-os-bible" aria-label="Campaign Production Bible">
      <header class="content-os-bible-head">
        <div>
          <span>Campaign Production Bible</span>
          <strong>Media-ready production control file</strong>
          <p>Lock product, brand, references, scenes, prompts, audio, post-production, and handoff readiness before Media Studio execution.</p>
        </div>
        <aside>
          <span>${escapeHtml(readiness.label)}</span>
          <strong>${escapeHtml(String(readiness.score))}%</strong>
        </aside>
      </header>

      <div class="content-os-bible-route" aria-label="Production Bible flow">
        <span class="is-ready">01 Intake</span>
        <span class="is-missing">02 References</span>
        <span class="is-review">03 Locks</span>
        <span class="is-draft">04 Scenes</span>
        <span class="is-draft">05 Prompts</span>
        <span class="is-draft">06 Audio/Edit</span>
        <span class="is-missing">07 Handoff</span>
      </div>

      <div class="content-os-bible-alert">
        <strong>Before Media Studio</strong>
        <span>Attach approved product, logo, model, location, motion, and audio references. Then generate scene prompts and validate the handoff packet.</span>
      </div>

      <div class="content-os-bible-actions" aria-label="Media Studio handoff actions">
        <button type="button" data-content-bible-action="check-references">
          <span>01</span>
          <strong>Check Missing References</strong>
        </button>
        <button type="button" data-content-bible-action="improve-brief">
          <span>02</span>
          <strong>Improve Brief</strong>
        </button>
        <button type="button" data-content-bible-action="build-scene-prompts">
          <span>03</span>
          <strong>Build Scene Prompts</strong>
        </button>
        <button type="button" data-content-bible-action="build-audio-plan">
          <span>04</span>
          <strong>Build Audio Plan</strong>
        </button>
        <button type="button" data-content-bible-action="prepare-handoff">
          <span>05</span>
          <strong>Prepare Media Handoff</strong>
        </button>
        <button type="button" data-content-bible-action="save-bible">
          <span>06</span>
          <strong>Save Production Bible</strong>
        </button>
        <button type="button" data-content-bible-action="send-media" class="is-primary">
          <span>07</span>
          <strong>Send to Media Studio</strong>
        </button>
      </div>

      <div class="content-os-bible-grid">
        ${sections.map((section) => `
          <article class="content-os-bible-section is-${escapeHtml(section.status)}">
            <header>
              <span>${escapeHtml(section.status.replace("-", " "))}</span>
              <strong>${escapeHtml(section.title)}</strong>
            </header>
            <div>
              ${section.items.map(([label, value]) => `
                <p>
                  <span>${escapeHtml(label)}</span>
                  <strong>${escapeHtml(value)}</strong>
                </p>
              `).join("")}
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}


function contentOsStoryboardScenes(session, selectedItem) {
  const detected = contentOsDetectedType(session, selectedItem);
  const isMedia = /video|media|image|visual|campaign|social/i.test(`${detected} ${session.form?.objective || ""} ${session.form?.brief || ""}`);

  if (!isMedia) {
    return [
      {
        scene: "01",
        duration: "Draft",
        purpose: "Main message",
        visual: "Turn the request into a clear content structure.",
        camera: "N/A",
        action: "Write and refine",
        text: "Main headline",
        voice: "Optional",
        audio: "N/A",
        start: "N/A",
        end: "N/A",
        motion: "N/A",
        negative: "Avoid unclear claims and off-brand language",
        qc: "Brand tone, source truth, destination fit"
      }
    ];
  }

  return [
    {
      scene: "01",
      duration: "0:00–0:03",
      purpose: "Problem hook",
      visual: "Model in mirror with slightly uncontrolled hair; dissatisfaction is clear.",
      camera: "Close medium over-shoulder mirror shot",
      action: "Hand through hair, pause, serious expression",
      text: "Bad hair ruins the first impression.",
      voice: "Your style starts before you leave the room.",
      audio: "Low bass hit + natural hair movement",
      start: "Model before styling, same room, same outfit, hair uncontrolled",
      end: "Model pauses in mirror, problem clearly visible",
      motion: "One natural hand-through-hair motion only",
      negative: "No product yet, no location change, no different model",
      qc: "Problem visible in first 2 seconds"
    },
    {
      scene: "02",
      duration: "0:03–0:06",
      purpose: "Product reveal",
      visual: "Real product jar on premium dark counter; logo readable.",
      camera: "Slow cinematic push-in / macro product shot",
      action: "Product appears as solution",
      text: "HAIROTICMEN Aqua Wax",
      voice: "HAIROTICMEN Aqua Wax gives you strong control.",
      audio: "Premium whoosh",
      start: "Product centered on counter",
      end: "Logo sharp and readable",
      motion: "Slow camera push-in only",
      negative: "No product redesign, no fake label, no blurry logo",
      qc: "Logo readable and product identical to reference"
    },
    {
      scene: "03",
      duration: "0:06–0:10",
      purpose: "Texture and usage",
      visual: "Hand opens jar and takes a small amount of wax.",
      camera: "Macro close-up on jar, hand, texture",
      action: "Open jar, take small amount",
      text: "Small amount. Strong control.",
      voice: "A small amount helps shape and define your look.",
      audio: "Jar click + texture swipe",
      start: "Jar closed or just opened",
      end: "Small amount visible on finger",
      motion: "Open and scoop one small amount only",
      negative: "No deformed hands, no extra product, no dirty counter",
      qc: "Texture visible, hand natural, package unchanged"
    },
    {
      scene: "04",
      duration: "0:10–0:15",
      purpose: "Styling transformation",
      visual: "Model rubs wax between hands and applies it to hair.",
      camera: "Close-up hands and hair, mirror reflection",
      action: "Rub, apply, define shape",
      text: "Shape it. Define it. Own it.",
      voice: "Shape it. Define it. Own it.",
      audio: "Soft riser + styling movement",
      start: "Wax on hands before application",
      end: "Hair begins to look defined",
      motion: "One styling movement sequence, no sudden jump",
      negative: "No unrealistic hair movement, no face change, no location change",
      qc: "Hair transformation looks natural"
    },
    {
      scene: "05",
      duration: "0:15–0:20",
      purpose: "Final look and emotion",
      visual: "Model looks confident with finished styled hair.",
      camera: "Hero close-up then half-body confidence shot",
      action: "Look in mirror, adjust collar, turn slightly",
      text: "All-day confidence.",
      voice: "Clean definition and all-day confidence.",
      audio: "Impact hit",
      start: "Final hair visible in mirror",
      end: "Confident hero look",
      motion: "Subtle collar adjustment and turn",
      negative: "No different model, no overdramatic transformation",
      qc: "Confidence clear, hair controlled"
    },
    {
      scene: "06",
      duration: "0:20–0:24",
      purpose: "Product hero and CTA",
      visual: "Product sharp in foreground, model blurred in background.",
      camera: "Static premium hero shot",
      action: "Product hold, final brand memory",
      text: "AQUA WAX · LOCK YOUR LOOK · Shop now",
      voice: "Lock your look. Own your day.",
      audio: "Final bass hit + logo sting",
      start: "Product foreground, final styled model behind",
      end: "Logo and CTA clear",
      motion: "Subtle light movement only",
      negative: "No extra objects, no unreadable logo, no fake text on package",
      qc: "Product sells the final frame"
    }
  ];
}

function contentOsCampaignPacks(session, selectedItem) {
  return [
    {
      title: "Hook Bank",
      status: "ready",
      items: [
        "Bad hair ruins the first impression.",
        "From messy to sharp in seconds.",
        "Small amount. Strong control.",
        "Your hair. Your rules.",
        "Look sharp. Feel confident."
      ]
    },
    {
      title: "Ad Copy Pack",
      status: "draft",
      items: [
        "Primary text variants",
        "Problem / solution angle",
        "Premium brand angle",
        "German ad version",
        "Arabic ad version"
      ]
    },
    {
      title: "Social Pack",
      status: "draft",
      items: [
        "Product hero post",
        "Before / after post",
        "Texture close-up post",
        "Lifestyle result post",
        "Barber / salon version"
      ]
    },
    {
      title: "Voice Pack",
      status: "draft",
      items: [
        "English voiceover",
        "Arabic voiceover",
        "German voiceover",
        "No-voice version",
        "Music + SFX only"
      ]
    },
    {
      title: "Landing / Thumbnail",
      status: "draft",
      items: [
        "Landing hero headline",
        "Subheadline",
        "CTA",
        "Thumbnail text",
        "Safe overlay copy"
      ]
    },
    {
      title: "Calendar / Learning",
      status: "draft",
      items: [
        "14-day launch calendar",
        "A/B campaign versions",
        "3-second hold rate",
        "Watch time / completion",
        "CTR / conversion / ROAS learning"
      ]
    }
  ];
}

function contentOsReferenceStatusItems(session, selectedItem) {
  return [
    ["Product reference", "Missing", "Front, side, packaging, logo close-up, texture"],
    ["Logo file", "Missing", "Approved logo, no distortion, readable lock"],
    ["Model reference", "Missing", "Same face, hair, outfit, expression"],
    ["Location reference", "Missing", "Approved dark bathroom / studio"],
    ["Motion reference", "Missing", "Open jar, apply wax, style hair"],
    ["Audio reference", "Missing", "Music mood, SFX, voice profile"],
    ["Start / End frames", "Missing", "Approved stills before animation"],
    ["Export specs", "Draft", "9:16, story, 1:1, VO, no-VO, languages"]
  ];
}


function contentOsResearchInsightItems(session, selectedItem) {
  const objective = session.form?.objective || "";
  const brief = session.form?.brief || "";
  const campaign = session.form?.campaign || "Not selected yet";
  const platform = session.form?.channel || "instagram";

  return {
    source: [
      ["Research source", "Research Page", "Market, competitor, trend, audience, keyword, sound, and hashtag findings"],
      ["Insight source", "Insights Page", "Performance reports, content gaps, weak hooks, best variants, and next opportunities"],
      ["Campaign source", "Campaign Studio", campaign],
      ["Current platform", platform, "Used to adapt hooks, caption style, media format, safe zones, and publishing packet"]
    ],
    signals: [
      ["Audience pain", "Needs buyer segment", "Define exact buyer pain, lifestyle, motivation, and objection"],
      ["Competitor pattern", "Needs research packet", "Winning ads, repeated hooks, claims, visual structure, and offer style"],
      ["Trend signal", "No trend attached", "Relevant creative trend, format, sound, pacing, and platform behavior"],
      ["Hook pattern", "Draft", "Problem hook, transformation hook, proof hook, product demo hook, social proof hook"],
      ["Sound direction", "Draft", "Music mood, sound effect pattern, voice energy, and licensed usage"],
      ["Hashtag direction", "Draft", "Brand, category, problem, result, campaign, and local market hashtags"]
    ],
    opportunities: [
      {
        title: "Creative Angles",
        status: "draft",
        items: [
          "Problem / solution angle",
          "Premium grooming angle",
          "Confidence and first impression angle",
          "Small amount / strong control angle",
          "Salon and barber recommendation angle"
        ]
      },
      {
        title: "Content Opportunities",
        status: "draft",
        items: [
          "Short-form video concept",
          "Product education post",
          "Before / after transformation",
          "Texture close-up content",
          "Marketplace product copy"
        ]
      },
      {
        title: "Research-to-Output",
        status: "draft",
        items: [
          "Turn top hook into ad script",
          "Turn competitor pattern into safe variant",
          "Turn trend signal into scene direction",
          "Turn audience pain into caption",
          "Turn report weakness into improved version"
        ]
      },
      {
        title: "Missing Research",
        status: "missing",
        items: [
          "Top 5 competitor ads",
          "Top 5 platform hooks",
          "Audience segment and objections",
          "Trend / sound references",
          "Hashtag and keyword set"
        ]
      }
    ],
    next: [
      "Attach Research Packet from Research Page",
      "Attach Insight Packet from Insights Page",
      "Convert findings into hook bank and creative angles",
      "Send selected angles into Storyboard and Campaign Content Pack",
      "Save winning patterns to Library after performance review"
    ],
    objective,
    brief
  };
}


function contentOsImageRequirements(session, selectedItem) {
  return [
    ["Product master reference", "missing", "Approved front, side, top, packaging, label, cap, texture, and scale references"],
    ["Logo lock", "missing", "Approved logo file; must stay readable, undistorted, correctly placed, and never regenerated"],
    ["Brand visual system", "draft", "Color palette, typography style, lighting language, premium grooming mood, and design rules"],
    ["Background / location", "missing", "Approved studio, bathroom, counter, or lifestyle background; no random locations"],
    ["Model / hand reference", "missing", "Same model, hand, skin tone, hair type, outfit, and expression when people are used"],
    ["Texture / product detail", "draft", "Macro texture, wax amount, shine level, jar opening, application detail"],
    ["Start frame", "missing", "Approved still image before motion; product, logo, model, and location locked"],
    ["End frame", "missing", "Approved final still image for CTA or product hero; no surprise change in video"],
    ["Clean plate", "draft", "Background image without product/model for editing, masking, or graphics"],
    ["Thumbnail / hero image", "draft", "High-attention campaign still for ads, reels cover, website, and marketplace use"],
    ["Safe text zone", "draft", "Text overlay area; avoid adding fake AI text inside generated product image"],
    ["Image QC", "missing", "Product identical, logo readable, no fake label, no extra objects, no distorted hands, no brand drift"]
  ];
}

function contentOsImagePromptLayers(session, selectedItem) {
  return [
    {
      title: "Product Hero",
      status: "missing",
      items: [
        "Main product image",
        "Logo readable",
        "Premium lighting",
        "Clean background",
        "Ad-ready composition"
      ]
    },
    {
      title: "Texture Macro",
      status: "draft",
      items: [
        "Wax texture detail",
        "Small amount on finger",
        "Natural hand",
        "No deformed fingers",
        "No extra product"
      ]
    },
    {
      title: "Lifestyle Result",
      status: "draft",
      items: [
        "Same model",
        "Styled hair result",
        "Same room / lighting",
        "Premium grooming mood",
        "Confidence expression"
      ]
    },
    {
      title: "Start / End Frames",
      status: "missing",
      items: [
        "Scene start still",
        "Scene end still",
        "No product change",
        "No logo change",
        "Motion-safe continuity"
      ]
    },
    {
      title: "Thumbnail / Cover",
      status: "draft",
      items: [
        "Readable product",
        "Strong contrast",
        "Short text area",
        "Platform-safe crop",
        "CTA-ready framing"
      ]
    },
    {
      title: "Image Negative Prompt",
      status: "ready",
      items: [
        "No product redesign",
        "No fake logo",
        "No unreadable label",
        "No distorted hands",
        "No random background"
      ]
    }
  ];
}

function contentOsImageOutputList(session, selectedItem) {
  return [
    ["Product hero image", "Required before video hero scene"],
    ["Logo close-up", "Required for brand lock and final frame"],
    ["Packaging / label image", "Required to prevent product redesign"],
    ["Texture macro image", "Required for product detail scene"],
    ["Model result image", "Required if model appears in video"],
    ["Location reference image", "Required for visual consistency"],
    ["Start frame per key scene", "Required before motion generation"],
    ["End frame per key scene", "Required before motion generation"],
    ["Thumbnail / cover image", "Required for publishing and ads"],
    ["Clean plate", "Useful for graphics, text overlay, and editing"]
  ];
}


function contentOsVideoMotionRequirements(session, selectedItem) {
  return [
    ["Video objective", "draft", "Define what the video must achieve: awareness, product proof, sales, education, or retargeting"],
    ["Platform ratio", "draft", "9:16, 1:1, 4:5, 16:9, story, reels, TikTok, ad, website, marketplace"],
    ["Duration plan", "draft", "Exact total duration and scene timing; each scene must have seconds and purpose"],
    ["Start frame lock", "missing", "Approved still image before motion for every key scene"],
    ["End frame lock", "missing", "Approved final still image for every key scene"],
    ["One action per shot", "ready", "Each shot must contain one clear motion only to avoid AI drift"],
    ["Camera movement", "draft", "Push-in, pull-out, orbit, pan, tilt, macro, handheld, static, or locked tripod"],
    ["Product motion", "draft", "What moves: product, hand, model, camera, light, or background"],
    ["Continuity locks", "missing", "Same product, logo, label, model, outfit, location, lighting, and color grade"],
    ["Negative motion prompt", "ready", "No product redesign, no logo change, no random text, no distorted hands, no scene jump"],
    ["Transition logic", "draft", "Cut, match cut, whip, hard cut, speed ramp, before/after, or clean product reveal"],
    ["Video QC", "missing", "Check product identity, logo readability, scene logic, motion quality, timing, and export readiness"]
  ];
}

function contentOsVideoMotionLayers(session, selectedItem) {
  return [
    {
      title: "Master Video Prompt",
      status: "draft",
      items: [
        "Campaign-wide visual rules",
        "Product and logo lock",
        "Model / location continuity",
        "Camera language",
        "Platform and duration"
      ]
    },
    {
      title: "Scene Motion Rules",
      status: "draft",
      items: [
        "One action per scene",
        "Start frame approved",
        "End frame approved",
        "Motion path defined",
        "QC rule per scene"
      ]
    },
    {
      title: "Camera Direction",
      status: "draft",
      items: [
        "Shot size",
        "Camera movement",
        "Lens / angle",
        "Speed and pacing",
        "Stabilization rule"
      ]
    },
    {
      title: "Continuity Locks",
      status: "missing",
      items: [
        "Same product",
        "Same logo",
        "Same model / hand",
        "Same location",
        "Same light and grade"
      ]
    },
    {
      title: "Negative Motion Prompt",
      status: "ready",
      items: [
        "No product morphing",
        "No unreadable logo",
        "No extra objects",
        "No warped hands",
        "No random scene change"
      ]
    },
    {
      title: "Video Export Rules",
      status: "draft",
      items: [
        "9:16 story / reel",
        "No-VO version",
        "VO version",
        "Music-only version",
        "Ad-safe cutdown"
      ]
    }
  ];
}

function contentOsVideoQcItems(session, selectedItem) {
  return [
    ["Scene logic", "Hook → product reveal → proof/detail → transformation/result → hero/CTA"],
    ["Timing", "Every scene has duration, pacing, and clear cut point"],
    ["Motion clarity", "Only one main motion per shot; no confusing or competing movement"],
    ["Product identity", "Product shape, size, label, cap, packaging, and texture remain unchanged"],
    ["Logo visibility", "Logo readable in product reveal and final hero frame"],
    ["Model consistency", "Same face, hair, hand, outfit, and expression when model appears"],
    ["Location consistency", "Same approved studio, bathroom, counter, or lifestyle environment"],
    ["Prompt completeness", "Master prompt, scene prompt, motion prompt, and negative prompt are ready"],
    ["Audio sync", "Motion allows room for VO, SFX, music beat, and text animation"],
    ["Handoff readiness", "Video pack can be sent to Media Studio only after missing references are resolved"]
  ];
}


function contentOsPostProductionRequirements(session, selectedItem) {
  return [
    ["Voiceover script", "draft", "Final spoken script by language, tone, pacing, pronunciation, pauses, and duration"],
    ["Voice profile", "missing", "Male/female, age feel, accent, energy, emotion, brand style, and provider reference"],
    ["Speech-to-text source", "draft", "Voice note or recorded idea can be transcribed into structured script and captions"],
    ["Music direction", "draft", "Genre, mood, BPM, intensity, platform suitability, license status, and cut points"],
    ["Sound design", "draft", "Bass hits, risers, whooshes, product sounds, texture swipes, logo sting, and transitions"],
    ["Sound effects / SFX", "draft", "Specific SFX per scene; not generic noise; must support motion and product action"],
    ["Text overlays", "draft", "Short readable text, safe area, timing, hierarchy, no fake AI text inside generated footage"],
    ["Motion graphics", "draft", "Canva / After Effects style elements, lower thirds, callouts, arrows, badges, and highlights"],
    ["Editing notes", "draft", "Cut rhythm, scene order, pacing, transition logic, beat sync, hold times, and final CTA"],
    ["Color grade", "draft", "Premium dark/gold, clean skin, product visible, brand-safe contrast, and platform readability"],
    ["Export versions", "draft", "VO, no-VO, music-only, subtitle version, short cutdown, 9:16, 1:1, 4:5, 16:9"],
    ["Post QC", "missing", "Audio clarity, sync, subtitle accuracy, logo visibility, text safety, platform specs, final approval"]
  ];
}

function contentOsPostProductionLayers(session, selectedItem) {
  return [
    {
      title: "Voiceover Pack",
      status: "draft",
      items: [
        "Final VO script",
        "Language variants",
        "Voice tone and pace",
        "Pronunciation notes",
        "Duration timing"
      ]
    },
    {
      title: "Sound Design Pack",
      status: "draft",
      items: [
        "Music mood",
        "SFX per scene",
        "Beat sync notes",
        "Logo sting",
        "Transition sounds"
      ]
    },
    {
      title: "Graphics Pack",
      status: "draft",
      items: [
        "Text overlays",
        "Callouts / badges",
        "Canva-style motion",
        "After Effects notes",
        "Safe text zones"
      ]
    },
    {
      title: "Editing Pack",
      status: "draft",
      items: [
        "Scene order",
        "Cut rhythm",
        "Transition logic",
        "Hold frames",
        "CTA ending"
      ]
    },
    {
      title: "Localization Pack",
      status: "draft",
      items: [
        "Arabic version",
        "English version",
        "German version",
        "Subtitle adaptation",
        "Market-safe wording"
      ]
    },
    {
      title: "Final Export Pack",
      status: "missing",
      items: [
        "9:16 final",
        "No-VO version",
        "VO version",
        "Music-only version",
        "Ad-safe version"
      ]
    }
  ];
}

function contentOsPostProductionScenePlan(session, selectedItem) {
  return [
    ["Scene 01", "Hook", "Low bass hit", "Problem text", "Hard cut after first impression"],
    ["Scene 02", "Product reveal", "Logo sting", "Product name / benefit", "Slow push-in, hold logo readable"],
    ["Scene 03", "Texture detail", "Jar click + texture swipe", "Small amount", "Macro cut, no fast motion"],
    ["Scene 04", "Application", "Soft riser", "Shape it. Define it.", "Beat-synced application sequence"],
    ["Scene 05", "Result", "Impact hit", "All-day confidence", "Hold confident expression"],
    ["Scene 06", "Hero / CTA", "Final bass hit + logo sting", "AQUA WAX · LOCK YOUR LOOK", "End frame locked for CTA"]
  ];
}

function contentOsPostQcItems(session, selectedItem) {
  return [
    ["Voiceover clarity", "Voice is clear, on-brand, correctly paced, and fits scene timing"],
    ["Audio mix", "Music, SFX, and voice do not fight each other; levels are platform-safe"],
    ["Subtitle accuracy", "Captions match VO and are readable on mobile"],
    ["Graphic safety", "No fake AI-generated product text; overlays are outside protected product/logo areas"],
    ["Brand consistency", "Color, motion, typography, sound, and CTA match brand rules"],
    ["Edit rhythm", "Hook fast, product readable, detail clear, result emotional, CTA held long enough"],
    ["Platform specs", "Safe zones, ratio, duration, captions, file naming, and export versions ready"],
    ["Legal safety", "No unsupported medical, performance, or misleading claims"],
    ["Media handoff", "Media Studio receives VO, SFX notes, graphics notes, edit notes, and exports"],
    ["Publishing readiness", "Final assets can move to Publishing / Ads after review and approval"]
  ];
}


function contentOsPublishingRequirements(session, selectedItem) {
  return [
    ["Publishing caption", "draft", "Final caption by platform, language, tone, CTA, hook, and safe claim rules"],
    ["Platform versions", "draft", "Instagram, TikTok, YouTube Shorts, Facebook, LinkedIn, website, marketplace, email, and ads variants"],
    ["Hashtag set", "missing", "Brand, category, problem, result, campaign, local market, and trend hashtags"],
    ["CTA system", "missing", "Shop now, learn more, book, message us, visit page, claim offer, or save for later"],
    ["Ad copy variants", "draft", "Primary text, headline, description, hook angle, benefit angle, problem angle, and retargeting angle"],
    ["SEO / metadata", "draft", "Title, meta description, keywords, alt text, video title, video description, and searchable terms"],
    ["Legal / claim safety", "missing", "No unsupported medical, performance, guarantee, before/after, or misleading claims"],
    ["Approval gates", "missing", "Brand approval, source approval, governance approval, media approval, publishing approval"],
    ["Schedule plan", "draft", "Best posting windows, campaign wave, launch sequence, reminders, and reuse plan"],
    ["A/B testing plan", "draft", "Hook variants, CTA variants, caption variants, thumbnail variants, and audience angle variants"],
    ["Performance tracking", "draft", "CTR, hold rate, watch time, saves, shares, comments, conversion, ROAS, and learning notes"],
    ["Learning loop", "missing", "Save winning hooks, weak points, audience reactions, and next content actions to Library and Insights"]
  ];
}

function contentOsPlatformDeliverables(session, selectedItem) {
  return [
    {
      title: "Instagram / TikTok",
      status: "draft",
      items: [
        "Short caption",
        "Hook in first line",
        "Hashtags",
        "Reel cover text",
        "CTA and safe zone"
      ]
    },
    {
      title: "Ads Manager",
      status: "draft",
      items: [
        "Primary text variants",
        "Headline variants",
        "CTA variants",
        "Audience angle",
        "A/B test labels"
      ]
    },
    {
      title: "Publishing",
      status: "missing",
      items: [
        "Approved final caption",
        "Asset link",
        "Schedule note",
        "Platform format",
        "Approval status"
      ]
    },
    {
      title: "Website / Landing",
      status: "draft",
      items: [
        "Hero headline",
        "Subheadline",
        "Benefit bullets",
        "CTA",
        "SEO metadata"
      ]
    },
    {
      title: "CRM / WhatsApp",
      status: "draft",
      items: [
        "Short message",
        "Friendly version",
        "Formal version",
        "Follow-up message",
        "Localized version"
      ]
    },
    {
      title: "Library / Learning",
      status: "missing",
      items: [
        "Approved final copy",
        "Winning hooks",
        "Prompt template",
        "Performance notes",
        "Reusable asset pack"
      ]
    }
  ];
}

function contentOsLegalChecklist(session, selectedItem) {
  return [
    ["Claims", "No medical, guaranteed, unsupported, exaggerated, or unverifiable product claims"],
    ["Before / after", "Use only if supported, truthful, non-misleading, and visually fair"],
    ["AI-generated assets", "Avoid fake product labels, fake certification, fake testimonials, and fake legal proof"],
    ["Copyright", "Music, voice, image, and video references must be licensed or approved"],
    ["Platform policy", "Ad text, landing claims, targeting, and creative must follow platform rules"],
    ["Brand safety", "Tone, visuals, CTA, and message must match brand guidelines and approved source truth"],
    ["Consumer clarity", "Offer, price, product, delivery, and CTA must be clear and not deceptive"],
    ["Approval", "High-risk claims route to Governance before Publishing / Ads"]
  ];
}

function contentOsPerformancePlan(session, selectedItem) {
  return [
    ["Hook performance", "Measure first 1–3 seconds, scroll stop, and opening line strength"],
    ["Watch time", "Track average watch duration, completion rate, and drop-off scene"],
    ["Engagement", "Track saves, shares, comments, replies, and message requests"],
    ["Click behavior", "Track CTR, landing clicks, profile visits, and CTA action"],
    ["Conversion", "Track orders, leads, CRM replies, booking, or campaign goal completion"],
    ["Creative learning", "Save winning angles, weak scenes, best caption, best thumbnail, and next test"],
    ["Optimization", "Generate new variants from weak points and send back to Content Studio"],
    ["Reporting", "Send performance packet to Insights and Library for future campaign decisions"]
  ];
}

function renderContentOsPublishingLegalPerformancePack(session, selectedItem, escapeHtml) {
  const requirements = contentOsPublishingRequirements(session, selectedItem);
  const deliverables = contentOsPlatformDeliverables(session, selectedItem);
  const legal = contentOsLegalChecklist(session, selectedItem);
  const performance = contentOsPerformancePlan(session, selectedItem);

  return `
    <section class="content-os-publish-pack" aria-label="Publishing Legal and Performance Pack">
      <header class="content-os-publish-head">
        <div>
          <span>Publishing + Legal + Performance Pack</span>
          <strong>Prepare platform-ready content, approvals, and learning loop</strong>
          <p>Final content is not complete until captions, hashtags, platform variants, ad copy, legal safety, approval gates, publishing checklist, performance tracking, and learning actions are ready.</p>
        </div>
        <aside>
          <span>Launch readiness</span>
          <strong>Needs approval</strong>
        </aside>
      </header>

      <div class="content-os-publish-actions" aria-label="Publishing legal performance actions">
        <button type="button" data-content-publish-action="build-caption">
          <span>01</span>
          <strong>Build Caption</strong>
        </button>
        <button type="button" data-content-publish-action="build-hashtags">
          <span>02</span>
          <strong>Build Hashtags</strong>
        </button>
        <button type="button" data-content-publish-action="build-ads">
          <span>03</span>
          <strong>Build Ad Variants</strong>
        </button>
        <button type="button" data-content-publish-action="legal-check">
          <span>04</span>
          <strong>Legal Check</strong>
        </button>
        <button type="button" data-content-publish-action="approval-gates">
          <span>05</span>
          <strong>Approval Gates</strong>
        </button>
        <button type="button" data-content-publish-action="performance-plan">
          <span>06</span>
          <strong>Performance Plan</strong>
        </button>
        <button type="button" data-content-publish-action="save-learning">
          <span>07</span>
          <strong>Save Learning</strong>
        </button>
        <button type="button" data-content-publish-action="send-publishing">
          <span>08</span>
          <strong>Send Publishing Pack</strong>
        </button>
      </div>

      <div class="content-os-publish-requirements">
        <header>
          <span>Launch Requirements</span>
          <strong>Publishing, ads, legal, and learning must be ready before campaign release</strong>
        </header>
        <div>
          ${requirements.map(([label, status, note]) => `
            <p class="is-${escapeHtml(status)}">
              <span>${escapeHtml(status)}</span>
              <strong>${escapeHtml(label)}</strong>
              <em>${escapeHtml(note)}</em>
            </p>
          `).join("")}
        </div>
      </div>

      <div class="content-os-publish-grid">
        ${deliverables.map((pack) => `
          <article class="content-os-publish-card is-${escapeHtml(pack.status)}">
            <header>
              <strong>${escapeHtml(pack.title)}</strong>
              <span>${escapeHtml(pack.status)}</span>
            </header>
            <ul>
              ${pack.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            </ul>
          </article>
        `).join("")}
      </div>

      <div class="content-os-legal-performance">
        <article>
          <header>
            <span>Legal / Claim Safety</span>
            <strong>Governance-ready checklist</strong>
          </header>
          <div>
            ${legal.map(([label, note]) => `
              <p>
                <strong>${escapeHtml(label)}</strong>
                <em>${escapeHtml(note)}</em>
              </p>
            `).join("")}
          </div>
        </article>

        <article>
          <header>
            <span>Performance Learning</span>
            <strong>Close the loop after publishing</strong>
          </header>
          <div>
            ${performance.map(([label, note]) => `
              <p>
                <strong>${escapeHtml(label)}</strong>
                <em>${escapeHtml(note)}</em>
              </p>
            `).join("")}
          </div>
        </article>
      </div>

      <div class="content-os-publish-handoff">
        <span>Final Launch Handoff Rule</span>
        <strong>Do not publish without approvals, platform variants, and measurement plan.</strong>
        <p>Send the final packet to Publishing / Ads only after caption, hashtags, CTA, legal safety, platform specs, approval gates, asset links, schedule plan, A/B variants, and performance learning rules are prepared.</p>
      </div>
    </section>
  `;
}

function renderContentOsPostProductionPack(session, selectedItem, escapeHtml) {
  const requirements = contentOsPostProductionRequirements(session, selectedItem);
  const layers = contentOsPostProductionLayers(session, selectedItem);
  const scenePlan = contentOsPostProductionScenePlan(session, selectedItem);
  const qc = contentOsPostQcItems(session, selectedItem);

  return `
    <section class="content-os-post-pack" aria-label="Voiceover Sound Design Graphics and Editing Pack">
      <header class="content-os-post-head">
        <div>
          <span>Voiceover + Sound Design + Graphics + Editing Pack</span>
          <strong>Prepare the complete post-production direction before Media Studio</strong>
          <p>Post-production must be planned before execution: voiceover, music, sound effects, text overlays, motion graphics, editing rhythm, export versions, subtitles, and final QC must be clear before Media Studio builds the final asset.</p>
        </div>
        <aside>
          <span>Post readiness</span>
          <strong>Needs direction</strong>
        </aside>
      </header>

      <div class="content-os-post-actions" aria-label="Post production actions">
        <button type="button" data-content-post-action="build-voiceover">
          <span>01</span>
          <strong>Build Voiceover</strong>
        </button>
        <button type="button" data-content-post-action="sound-design">
          <span>02</span>
          <strong>Sound Design</strong>
        </button>
        <button type="button" data-content-post-action="sfx-plan">
          <span>03</span>
          <strong>SFX Plan</strong>
        </button>
        <button type="button" data-content-post-action="graphics-plan">
          <span>04</span>
          <strong>Graphics Plan</strong>
        </button>
        <button type="button" data-content-post-action="editing-notes">
          <span>05</span>
          <strong>Editing Notes</strong>
        </button>
        <button type="button" data-content-post-action="export-plan">
          <span>06</span>
          <strong>Export Plan</strong>
        </button>
        <button type="button" data-content-post-action="post-qc">
          <span>07</span>
          <strong>Post QC</strong>
        </button>
        <button type="button" data-content-post-action="send-media-post">
          <span>08</span>
          <strong>Send Post Pack</strong>
        </button>
      </div>

      <div class="content-os-post-requirements">
        <header>
          <span>Post-Production Requirements</span>
          <strong>Separate voiceover, sound design, SFX, graphics, and editing direction</strong>
        </header>
        <div>
          ${requirements.map(([label, status, note]) => `
            <p class="is-${escapeHtml(status)}">
              <span>${escapeHtml(status)}</span>
              <strong>${escapeHtml(label)}</strong>
              <em>${escapeHtml(note)}</em>
            </p>
          `).join("")}
        </div>
      </div>

      <div class="content-os-post-grid">
        ${layers.map((pack) => `
          <article class="content-os-post-card is-${escapeHtml(pack.status)}">
            <header>
              <strong>${escapeHtml(pack.title)}</strong>
              <span>${escapeHtml(pack.status)}</span>
            </header>
            <ul>
              ${pack.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            </ul>
          </article>
        `).join("")}
      </div>

      <div class="content-os-post-scene-plan">
        <header>
          <span>Scene Audio / Graphics / Edit Plan</span>
          <strong>Per-scene post-production direction</strong>
        </header>
        <div>
          ${scenePlan.map(([scene, purpose, audio, graphics, edit]) => `
            <p>
              <span>${escapeHtml(scene)}</span>
              <strong>${escapeHtml(purpose)}</strong>
              <em>${escapeHtml(audio)}</em>
              <b>${escapeHtml(graphics)}</b>
              <i>${escapeHtml(edit)}</i>
            </p>
          `).join("")}
        </div>
      </div>

      <div class="content-os-post-qc">
        <header>
          <span>Post QC Checklist</span>
          <strong>Before final Media Studio export</strong>
        </header>
        <div>
          ${qc.map(([label, note]) => `
            <p>
              <strong>${escapeHtml(label)}</strong>
              <em>${escapeHtml(note)}</em>
            </p>
          `).join("")}
        </div>
      </div>

      <div class="content-os-post-handoff">
        <span>Final Post-Production Handoff Rule</span>
        <strong>Media Studio must receive creative direction, not only a script.</strong>
        <p>Send voiceover script, voice profile, music direction, SFX map, graphics instructions, editing notes, subtitle rules, export versions, and QC requirements together with the video motion packet.</p>
      </div>
    </section>
  `;
}

function renderContentOsVideoMotionPack(session, selectedItem, escapeHtml) {
  const requirements = contentOsVideoMotionRequirements(session, selectedItem);
  const layers = contentOsVideoMotionLayers(session, selectedItem);
  const qc = contentOsVideoQcItems(session, selectedItem);

  return `
    <section class="content-os-video-pack" aria-label="Video and Motion Prompt Pack">
      <header class="content-os-video-head">
        <div>
          <span>Video / Motion Prompt Pack</span>
          <strong>Turn storyboard and image references into controllable video motion</strong>
          <p>Video generation must not start from a vague prompt. It needs approved start frames, end frames, one-action-per-shot rules, camera movement, continuity locks, negative motion prompts, and QC checks before Media Studio execution.</p>
        </div>
        <aside>
          <span>Motion readiness</span>
          <strong>Needs locks</strong>
        </aside>
      </header>

      <div class="content-os-video-actions" aria-label="Video motion actions">
        <button type="button" data-content-video-action="build-motion-system">
          <span>01</span>
          <strong>Build Motion System</strong>
        </button>
        <button type="button" data-content-video-action="scene-motion-rules">
          <span>02</span>
          <strong>Scene Motion Rules</strong>
        </button>
        <button type="button" data-content-video-action="camera-plan">
          <span>03</span>
          <strong>Camera Plan</strong>
        </button>
        <button type="button" data-content-video-action="continuity-locks">
          <span>04</span>
          <strong>Continuity Locks</strong>
        </button>
        <button type="button" data-content-video-action="negative-motion">
          <span>05</span>
          <strong>Negative Motion</strong>
        </button>
        <button type="button" data-content-video-action="video-qc">
          <span>06</span>
          <strong>Video QC</strong>
        </button>
        <button type="button" data-content-video-action="send-media-video">
          <span>07</span>
          <strong>Send Video Pack</strong>
        </button>
      </div>

      <div class="content-os-video-requirements">
        <header>
          <span>Motion Requirements</span>
          <strong>Start frame → motion → end frame must be controlled for every scene</strong>
        </header>
        <div>
          ${requirements.map(([label, status, note]) => `
            <p class="is-${escapeHtml(status)}">
              <span>${escapeHtml(status)}</span>
              <strong>${escapeHtml(label)}</strong>
              <em>${escapeHtml(note)}</em>
            </p>
          `).join("")}
        </div>
      </div>

      <div class="content-os-video-grid">
        ${layers.map((pack) => `
          <article class="content-os-video-card is-${escapeHtml(pack.status)}">
            <header>
              <strong>${escapeHtml(pack.title)}</strong>
              <span>${escapeHtml(pack.status)}</span>
            </header>
            <ul>
              ${pack.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            </ul>
          </article>
        `).join("")}
      </div>

      <div class="content-os-video-qc">
        <header>
          <span>Video QC Checklist</span>
          <strong>Before Media Studio execution</strong>
        </header>
        <div>
          ${qc.map(([label, note]) => `
            <p>
              <strong>${escapeHtml(label)}</strong>
              <em>${escapeHtml(note)}</em>
            </p>
          `).join("")}
        </div>
      </div>

      <div class="content-os-video-handoff">
        <span>Final Video Handoff Rule</span>
        <strong>Do not send vague video prompts to Media Studio.</strong>
        <p>Send a complete motion packet: approved image references, scene timing, camera direction, one-action motion rules, start/end frames, negative motion prompts, audio timing notes, export ratio, and QC checklist.</p>
      </div>
    </section>
  `;
}

function renderContentOsImageProductionPack(session, selectedItem, escapeHtml) {
  const requirements = contentOsImageRequirements(session, selectedItem);
  const promptLayers = contentOsImagePromptLayers(session, selectedItem);
  const outputs = contentOsImageOutputList(session, selectedItem);

  return `
    <section class="content-os-image-pack" aria-label="Image Production Pack and Asset Requirements">
      <header class="content-os-image-head">
        <div>
          <span>Image Production Pack</span>
          <strong>Lock product, logo, background, and frames before video</strong>
          <p>Images are the foundation of strong video generation. This pack prepares approved product references, logo locks, background/location references, start frames, end frames, thumbnails, and image QC before Media Studio execution.</p>
        </div>
        <aside>
          <span>Image readiness</span>
          <strong>Needs assets</strong>
        </aside>
      </header>

      <div class="content-os-image-actions" aria-label="Image production actions">
        <button type="button" data-content-image-action="check-assets">
          <span>01</span>
          <strong>Check Image Assets</strong>
        </button>
        <button type="button" data-content-image-action="build-image-prompt">
          <span>02</span>
          <strong>Build Image Prompt</strong>
        </button>
        <button type="button" data-content-image-action="build-start-frame">
          <span>03</span>
          <strong>Build Start Frame</strong>
        </button>
        <button type="button" data-content-image-action="build-end-frame">
          <span>04</span>
          <strong>Build End Frame</strong>
        </button>
        <button type="button" data-content-image-action="build-thumbnail">
          <span>05</span>
          <strong>Build Thumbnail</strong>
        </button>
        <button type="button" data-content-image-action="send-media-image">
          <span>06</span>
          <strong>Send Image Pack</strong>
        </button>
      </div>

      <div class="content-os-image-requirements">
        <header>
          <span>Asset Requirements</span>
          <strong>Do not start video until core image references are approved</strong>
        </header>
        <div>
          ${requirements.map(([label, status, note]) => `
            <p class="is-${escapeHtml(status)}">
              <span>${escapeHtml(status)}</span>
              <strong>${escapeHtml(label)}</strong>
              <em>${escapeHtml(note)}</em>
            </p>
          `).join("")}
        </div>
      </div>

      <div class="content-os-image-grid">
        ${promptLayers.map((pack) => `
          <article class="content-os-image-card is-${escapeHtml(pack.status)}">
            <header>
              <strong>${escapeHtml(pack.title)}</strong>
              <span>${escapeHtml(pack.status)}</span>
            </header>
            <ul>
              ${pack.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            </ul>
          </article>
        `).join("")}
      </div>

      <div class="content-os-image-output">
        <header>
          <span>Required Image Outputs</span>
          <strong>Media Studio input checklist</strong>
        </header>
        <div>
          ${outputs.map(([label, note]) => `
            <p>
              <strong>${escapeHtml(label)}</strong>
              <em>${escapeHtml(note)}</em>
            </p>
          `).join("")}
        </div>
      </div>

      <div class="content-os-image-qc">
        <span>Image QC Gate</span>
        <strong>Product identity must be locked before video motion.</strong>
        <p>Before video generation, confirm that product shape, logo, label, background, model, lighting, color grade, and safe text areas are approved. Any missing image reference should block final Media Studio handoff.</p>
      </div>
    </section>
  `;
}

function renderContentOsResearchInsightPacket(session, selectedItem, escapeHtml) {
  const data = contentOsResearchInsightItems(session, selectedItem);

  return `
    <section class="content-os-research-packet" aria-label="Research and Insight Receiver Packet">
      <header class="content-os-research-head">
        <div>
          <span>Research / Insight Receiver Packet</span>
          <strong>Turn market intelligence into content decisions</strong>
          <p>Research and Insights stay in their own pages. Content Studio receives their packets, detects what matters, then converts findings into hooks, angles, scripts, prompts, campaign assets, and improvement actions.</p>
        </div>
        <aside>
          <span>Receiver status</span>
          <strong>Needs packet</strong>
        </aside>
      </header>

      <div class="content-os-research-actions" aria-label="Research and insight actions">
        <button type="button" data-content-research-action="load-research">
          <span>01</span>
          <strong>Load Research Packet</strong>
        </button>
        <button type="button" data-content-research-action="load-insight">
          <span>02</span>
          <strong>Load Insight Packet</strong>
        </button>
        <button type="button" data-content-research-action="build-angles">
          <span>03</span>
          <strong>Build Creative Angles</strong>
        </button>
        <button type="button" data-content-research-action="build-hooks">
          <span>04</span>
          <strong>Generate Hook Bank</strong>
        </button>
        <button type="button" data-content-research-action="send-storyboard">
          <span>05</span>
          <strong>Send to Storyboard</strong>
        </button>
        <button type="button" data-content-research-action="save-learning">
          <span>06</span>
          <strong>Save Learning</strong>
        </button>
      </div>

      <div class="content-os-research-grid">
        <article class="content-os-research-source">
          <header>
            <span>Incoming Intelligence</span>
            <strong>Source map</strong>
          </header>
          ${data.source.map(([label, value, note]) => `
            <p>
              <span>${escapeHtml(label)}</span>
              <strong>${escapeHtml(value)}</strong>
              <em>${escapeHtml(note)}</em>
            </p>
          `).join("")}
        </article>

        <article class="content-os-research-source is-signals">
          <header>
            <span>Decision Signals</span>
            <strong>What the content team must use</strong>
          </header>
          ${data.signals.map(([label, value, note]) => `
            <p>
              <span>${escapeHtml(label)}</span>
              <strong>${escapeHtml(value)}</strong>
              <em>${escapeHtml(note)}</em>
            </p>
          `).join("")}
        </article>
      </div>

      <div class="content-os-research-opportunities">
        ${data.opportunities.map((pack) => `
          <article class="content-os-research-card is-${escapeHtml(pack.status)}">
            <header>
              <strong>${escapeHtml(pack.title)}</strong>
              <span>${escapeHtml(pack.status)}</span>
            </header>
            <ul>
              ${pack.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            </ul>
          </article>
        `).join("")}
      </div>

      <div class="content-os-research-next">
        <span>Research-to-content workflow</span>
        <strong>Use research as decision input, not as a separate writing page.</strong>
        <ol>
          ${data.next.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ol>
      </div>
    </section>
  `;
}

function renderContentOsStoryboardPacket(session, selectedItem, escapeHtml) {
  const scenes = contentOsStoryboardScenes(session, selectedItem);

  return `
    <section class="content-os-storyboard" aria-label="Storyboard Execution Packet">
      <header class="content-os-storyboard-head">
        <div>
          <span>Storyboard Execution Packet</span>
          <strong>Scene-by-scene media execution</strong>
          <p>Define every scene with duration, purpose, visual, camera, text, audio, start frame, end frame, motion prompt, negative prompt, and QC rule.</p>
        </div>
        <aside>
          <span>Media execution</span>
          <strong>${escapeHtml(String(scenes.length))} scenes</strong>
        </aside>
      </header>

      <div class="content-os-storyboard-table">
        ${scenes.map((scene) => `
          <article class="content-os-storyboard-row">
            <header>
              <span>Scene ${escapeHtml(scene.scene)} · ${escapeHtml(scene.duration)}</span>
              <strong>${escapeHtml(scene.purpose)}</strong>
            </header>
            <div class="content-os-storyboard-grid">
              <p><span>Visual</span><strong>${escapeHtml(scene.visual)}</strong></p>
              <p><span>Camera</span><strong>${escapeHtml(scene.camera)}</strong></p>
              <p><span>Action</span><strong>${escapeHtml(scene.action)}</strong></p>
              <p><span>On-screen text</span><strong>${escapeHtml(scene.text)}</strong></p>
              <p><span>Voiceover</span><strong>${escapeHtml(scene.voice)}</strong></p>
              <p><span>Audio / SFX</span><strong>${escapeHtml(scene.audio)}</strong></p>
              <p><span>Start frame</span><strong>${escapeHtml(scene.start)}</strong></p>
              <p><span>End frame</span><strong>${escapeHtml(scene.end)}</strong></p>
              <p><span>Motion prompt</span><strong>${escapeHtml(scene.motion)}</strong></p>
              <p><span>Negative prompt</span><strong>${escapeHtml(scene.negative)}</strong></p>
              <p><span>QC rule</span><strong>${escapeHtml(scene.qc)}</strong></p>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderContentOsCampaignContentPack(session, selectedItem, escapeHtml) {
  const packs = contentOsCampaignPacks(session, selectedItem);
  const refs = contentOsReferenceStatusItems(session, selectedItem);

  return `
    <section class="content-os-campaign-pack" aria-label="Campaign Content Pack">
      <header class="content-os-campaign-pack-head">
        <div>
          <span>Campaign Content Pack</span>
          <strong>Copy, social, ads, voice, landing, and learning assets</strong>
          <p>Prepare the campaign assets around the storyboard so Media Studio, Publishing, Ads, and CRM receive one consistent package.</p>
        </div>
      </header>

      <div class="content-os-reference-status">
        <header>
          <span>Reference Status Manager</span>
          <strong>Sources required before full media execution</strong>
        </header>
        <div>
          ${refs.map(([label, status, note]) => `
            <p class="is-${escapeHtml(status.toLowerCase())}">
              <span>${escapeHtml(status)}</span>
              <strong>${escapeHtml(label)}</strong>
              <em>${escapeHtml(note)}</em>
            </p>
          `).join("")}
        </div>
      </div>

      <div class="content-os-campaign-pack-grid">
        ${packs.map((pack) => `
          <article class="content-os-pack-card is-${escapeHtml(pack.status)}">
            <header>
              <strong>${escapeHtml(pack.title)}</strong>
              <span>${escapeHtml(pack.status)}</span>
            </header>
            <ul>
              ${pack.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            </ul>
          </article>
        `).join("")}
      </div>

      <div class="content-os-final-media-packet">
        <span>Final Media Studio Packet Preview</span>
        <strong>Campaign Bible + Storyboard + Prompts + References + Audio + Exports + QC</strong>
        <p>Do not send to Media Studio until product/logo/model/location references, start/end frames, scene prompts, audio plan, export specs, and QC checklist are ready.</p>
      </div>
    </section>
  `;
}

function renderContentOsInspector(session, state, handoff, recommendation, selectedItem, escapeHtml) {
  const mode = contentOsActiveReviewMode(session);
  const readiness = contentOsReadiness(session, state, handoff, selectedItem);
  const destination = contentOsDestination(session, selectedItem);
  const tabs = [
    ["readiness", "Ready"],
    ["sources", "Sources"],
    ["brand", "Brand"],
    ["platform", "Platform"],
    ["governance", "Risk"],
    ["handoff", "Handoff"]
  ];

  let body = `
    <div class="content-os-inspector-body">
      <div class="content-os-inspector-priority"><span>Priority</span><strong>Next action first</strong></div><div class="content-os-scoreline">
        <span>${escapeHtml(readiness.level)}</span>
        <strong>${escapeHtml(String(readiness.score))}%</strong>
      </div>
      <div class="content-os-next-action">
        <span>Next action</span>
        <strong>${escapeHtml(contentOsNextAction(session, state, handoff, selectedItem))}</strong>
      </div>
      ${readiness.items.map(([label, ready]) => `
        <div class="content-os-inspector-row ${ready ? "is-ready" : "is-missing"}">
          <span>${ready ? "Ready" : "Missing"}</span>
          <strong>${escapeHtml(label)}</strong>
        </div>
      `).join("")}
    </div>
  `;

  if (mode === "sources") {
    body = `
      <div class="content-os-inspector-body">
        <p>Classify sources before final handoff: exact reference, style reference, research source, legal source, product source, brand source, or performance source.</p>
        <button id="contentLoadHandoffBtn" class="content-os-action" type="button"${handoff ? "" : " disabled"}>Load Handoff</button>
      </div>
    `;
  }

  if (mode === "brand") {
    body = `
      <div class="content-os-inspector-body">
        ${["Product identity", "Logo visibility", "Tone of voice", "Approved claims", "Do / Don’t rules"].map((item) => `
          <div class="content-os-inspector-row is-missing"><span>Check</span><strong>${escapeHtml(item)}</strong></div>
        `).join("")}
      </div>
    `;
  }

  if (mode === "platform") {
    body = `
      <div class="content-os-inspector-body">
        ${["Platform length", "Hook style", "Caption style", "Hashtags / keywords", "CTA", "Aspect ratio if media"].map((item) => `
          <div class="content-os-inspector-row is-missing"><span>Review</span><strong>${escapeHtml(item)}</strong></div>
        `).join("")}
      </div>
    `;
  }

  if (mode === "governance") {
    body = `
      <div class="content-os-inspector-body">
        ${["Risky claims", "Proof-required wording", "Legal-safe alternatives", "Privacy / GDPR", "Human approval"].map((item) => `
          <div class="content-os-inspector-row is-missing"><span>Review</span><strong>${escapeHtml(item)}</strong></div>
        `).join("")}
      </div>
    `;
  }

  if (mode === "handoff") {
    body = `
      <div class="content-os-inspector-body">
        <p>${escapeHtml(recommendation?.why || "Create a validated packet before sending content to the next workspace.")}</p>
        ${["Media Studio", "Publishing", "Ads", "CRM", "AI Command", "Library"].map((item) => `
          <div class="content-os-inspector-row ${destination.includes(item.split(" ")[0]) ? "is-ready" : ""}">
            <span>Destination</span><strong>${escapeHtml(item)}</strong>
          </div>
        `).join("")}
      </div>
    `;
  }

  return `
    <aside class="content-os-inspector" aria-label="Review inspector">
      <div class="content-os-inspector-head">
        <span>Quality Inspector</span>
        <strong>${escapeHtml(destination)}</strong>
      </div>

      <nav class="content-os-inspector-tabs" aria-label="Inspector tabs">
        ${tabs.map(([id, label]) => `
          <button class="${mode === id ? "is-active" : ""}" type="button" data-content-review="${escapeHtml(id)}">${escapeHtml(label)}</button>
        `).join("")}
      </nav>

      ${body}
    </aside>
  `;
}

function renderContentOsAssistantDock(session, selectedItem, escapeHtml) {
  const active = contentOsActiveSpecialist(session);
  const toolGroups = [
    ["Brief", "Build brief", "Ask questions", "Suggest structure"],
    ["Write", "Generate", "Rewrite", "Improve"],
    ["Prompt", "Image prompt", "Video prompt", "Negative prompt"],
    ["Video", "Scene list", "Shot list", "Voiceover"],
    ["Review", "Brand", "SEO", "Governance"]
  ];

  return `
    <section class="content-os-assistant-dock" aria-label="Assistant and smart tools">
      <div class="content-os-dock-head">
        <span>AI Team Tools</span>
        <strong>Active: ${escapeHtml(active.title)}</strong>
      </div>

      <div class="content-os-tool-dock">
        ${toolGroups.map(([label, ...tools]) => `
          <div>
            <span>${escapeHtml(label)}</span>
            ${tools.map((tool) => `<button type="button">${escapeHtml(tool)}</button>`).join("")}
          </div>
        `).join("")}
      </div>

      <div class="content-os-agent-strip">
        ${contentOsSpecialists().map((agent) => `
          <button class="${agent.id === active.id ? "is-active" : ""}" type="button" data-content-specialist="${escapeHtml(agent.id)}">
            ${escapeHtml(agent.title)}
          </button>
        `).join("")}
      </div>

      <div class="content-os-agent-actions">
        <button class="content-os-action" type="button" data-content-agent-use="${escapeHtml(active.id)}">Use Assistant</button>
        <button class="content-os-action" type="button" data-content-agent-save="${escapeHtml(active.id)}">Save Prompt</button>
        <button class="content-os-action" type="button" data-content-agent-ai="${escapeHtml(active.id)}">Send to AI</button>
      </div>
    </section>
  `;
}

function renderContentOsTimeline(session, metrics, escapeHtml) {
  const active = contentOsActiveTimeline(session);
  const steps = [
    ["request", "Request"],
    ["brief", "Brief"],
    ["draft", "Draft"],
    ["review", "Review"],
    ["approved", "Approved"],
    ["handoff", "Handoff"],
    ["learned", "Learned"]
  ];
  const versioning = ensureVersioning(session);
  const currentVersion = selectedVersionEntry(session);

  return `
    <footer class="content-os-status-timeline" aria-label="Production timeline">
      <nav>
        ${steps.map(([id, label]) => `
          <button class="${active === id ? "is-active" : ""}" type="button" data-content-timeline="${escapeHtml(id)}">${escapeHtml(label)}</button>
        `).join("")}
      </nav>

      <div>
        <span>Total drafts <strong>${escapeHtml(formatCount(metrics.total || 0))}</strong></span>
        <span>Needs review <strong>${escapeHtml(formatCount(metrics.needsReview || 0))}</strong></span>
        <span>Approved <strong>${escapeHtml(formatCount(metrics.approved || 0))}</strong></span>
        <span>Current <strong>${escapeHtml(currentVersion?.id || "V1")}</strong></span>
      </div>

      <section>
        ${asArray(versioning.versions).map((version) => `
          <button class="${version.id === currentVersion?.id ? "is-active" : ""}" type="button" data-content-version="${escapeHtml(version.id)}">${escapeHtml(titleCase(version.id))}</button>
        `).join("")}
        <button type="button" data-content-version-action="compare-toggle">Compare</button>
        <button type="button" data-content-version-action="approve">Approve</button>
        <button type="button" data-content-version-action="reject">Reject</button>
        <button type="button" data-content-version-action="regenerate">Regenerate</button>
        <button type="button" data-content-version-action="save-draft">Save Version</button>
        <button type="button" data-content-version-action="save-library">Save Library</button>
      </section>
    </footer>
  `;
}

function renderContentOsShell({ session, state, handoff, metrics, recommendation, selectedItem, escapeHtml }) {
  return `
    <div class="content-os-shell content-os-shell-2e content-os-shell-2g" data-theme-version="v2">
      ${renderContentOsAppBar(session, state, handoff, metrics, selectedItem, escapeHtml)}
      ${renderContentOsContextStrip(session, state, handoff, recommendation, escapeHtml)}

      <div class="content-os-editor-layout">
        ${renderContentOsSourceRail(session, state, handoff, selectedItem, escapeHtml)}
        ${renderContentOsProductionCanvas(session, state, handoff, selectedItem, escapeHtml)}
        ${renderContentOsInspector(session, state, handoff, recommendation, selectedItem, escapeHtml)}
      </div>

      ${renderContentOsAssistantDock(session, selectedItem, escapeHtml)}
      ${renderContentOsTimeline(session, metrics, escapeHtml)}
    </div>
  `;
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


    // --- Source/Provenance Panel ---
    function renderSourcePanel() {
      let sourceLines = [];
      let ariaLabel = "Source context panel";
      // Prefer inbound handoff, then selectedItem, then session.form
      const handoff = inboundSummary;
      const item = selectedItem;
      if (handoff) {
        sourceLines.push(`<div><strong>Source page:</strong> ${escapeHtml(titleCase(handoff.sourcePage || "-"))}</div>`);
        if (handoff.project) sourceLines.push(`<div><strong>Project:</strong> ${escapeHtml(handoff.project)}</div>`);
        if (handoff.campaign) sourceLines.push(`<div><strong>Campaign:</strong> ${escapeHtml(handoff.campaign)}</div>`);
        if (handoff.channel) sourceLines.push(`<div><strong>Channel:</strong> ${escapeHtml(handoff.channel)}</div>`);
        if (handoff.brief) sourceLines.push(`<div><strong>Brief:</strong> ${escapeHtml(handoff.brief.slice(0, 120))}</div>`);
        sourceLines.push(`<div><strong>Handoff type:</strong> ${handoff.id ? "AI/Workflow" : "Unknown"}</div>`);
      } else if (item) {
        sourceLines.push(`<div><strong>Source:</strong> ${escapeHtml(item.source || "-")}</div>`);
        if (item.project) sourceLines.push(`<div><strong>Project:</strong> ${escapeHtml(item.project)}</div>`);
        if (item.campaign) sourceLines.push(`<div><strong>Campaign:</strong> ${escapeHtml(item.campaign)}</div>`);
        if (item.channel) sourceLines.push(`<div><strong>Channel:</strong> ${escapeHtml(item.channel)}</div>`);
      }
      // Library asset/provenance
      if (item && item.library_asset_ref) {
        sourceLines.push(`<div><strong>Library asset ref:</strong> ${escapeHtml(item.library_asset_ref.source_signature || "-")}</div>`);
      }
      if (!sourceLines.length) {
        sourceLines.push(`<div>No source context attached yet. Use AI Command or Library to attach source-backed content.</div>`);
      }
      sourceLines.push(`<div class="content-hint content-readiness-hint">Source context helps the reviewer verify claims before routing.</div>`);
      return `<section class="card content-card" aria-label="${ariaLabel}"><div class="card-head"><div><div class="setup-kicker">Source Context</div><h3>Source / Provenance</h3></div></div><div class="content-data-item">${sourceLines.join("")}</div></section>`;
    }

    // --- SEO Checklist Panel ---
    function renderSeoChecklistPanel() {
      const ariaLabel = "SEO Checklist panel";
      // Visual checklist only, not interactive
      return `<section class="card content-card" aria-label="${ariaLabel}"><div class="card-head"><div><div class="setup-kicker">SEO Checklist</div><h3>SEO Readiness Guidance</h3></div></div><ul class="content-seo-checklist content-readiness-list">
        <li><strong>Meta title</strong> present and clear</li>
        <li><strong>Meta description</strong> summarizes value</li>
        <li><strong>Primary keyword</strong> included</li>
        <li><strong>Headings / structure</strong> logical</li>
        <li><strong>CTA</strong> is actionable</li>
        <li><strong>Internal link idea</strong> noted</li>
        <li><strong>Brand tone</strong> consistent</li>
        <li><strong>Readability</strong> is high</li>
      </ul><div class="content-hint content-readiness-hint">Review these before routing for publishing or governance.</div></section>`;
    }

    // --- Governance Risk / Approval Readiness Panel ---
    function renderGovernancePanel() {
      const ariaLabel = "Governance risk and approval readiness panel";
      return `<section class="card content-card" aria-label="${ariaLabel}"><div class="card-head"><div><div class="setup-kicker">Governance Risk</div><h3>Approval Readiness</h3></div></div><ul class="content-governance-checklist content-readiness-list">
        <li>Claims or proof needed?</li>
        <li>Legal/compliance sensitivity?</li>
        <li>Pricing/offer sensitivity?</li>
        <li>GDPR/privacy sensitivity?</li>
        <li><strong>Approval recommended before routing</strong></li>
        <li>Route to Governance Review if needed</li>
      </ul><div class="content-hint content-readiness-hint">Prepare Governance Review before publishing or campaign use.</div></section>`;
    }

    // --- Patch: Soften routing labels if needed (button text is already safe, but check for clarity) ---
    // No direct publish/approve/send labels found in action rows; all routing is review/handoff-based.

    root.innerHTML = `
      ${renderContentOsShell({
        session,
        state,
        handoff: inboundSummary,
        metrics,
        recommendation,
        selectedItem,
        escapeHtml
      })}
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

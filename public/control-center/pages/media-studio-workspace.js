import {
  brandCheckMedia,
  createProjectApproval,
  createProjectHandoff,
  createProjectTask,
  decideProjectApproval,
  fetchProjectOperations,
  generateMediaCampaignPack,
  generateMediaImage,
  generateMediaVideoBrief,
  generateMediaVoiceScript,
  improveMediaPrompt,
  listProjectApprovals,
  listProjectContentItems,
  listProjectEvents,
  listProjectHandoffs,
  listProjectMediaJobs,
  listProjectTasks,
  saveProjectMediaJob,
  isAccessKeyFailure
} from "../api.js";
import {
  getAssetNextAction,
  renderAssetDependencyRows
} from "../asset-library.js";
import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";

const mediaStudioSessions = new Map();
const MEDIA_LOCAL_DRAFTS_KEY = "mh-media-studio-local-drafts-v1";
const MEDIA_LIBRARY_LOCAL_ASSETS_KEY = "mh-media-library-assets-v1";
const MEDIA_MODES = ["image", "video", "voice", "campaign-pack"];
const MEDIA_STATUSES = ["draft", "prompt_ready", "generating", "needs_review", "approved", "publishing_ready", "sent_to_publishing", "failed"];
const MEDIA_PREVIEW_STATES = ["provider_not_configured", "generation_error", "prompt_ready", "generated", "saved_to_library", "needs_review", "approved", "publishing_ready", "sent_to_publishing"];
const OUTPUT_PURPOSES = ["social post", "reel", "ad creative", "marketplace image", "email visual", "website banner"];
const CHANNELS = ["instagram", "facebook", "tiktok", "youtube", "email", "amazon", "ebay", "website"];
const MEDIA_ASSET_KEYS = ["logo", "brand_guideline", "product_photos", "product_videos", "packaging_images", "social_assets", "campaign_assets"];
const MEDIA_ROLE_DEFAULTS = {
  serviceDomain: "media",
  designRole: "designer",
  videoRole: "video_lead",
  reviewRole: "compliance_reviewer",
  handoffRole: "publisher"
};
const MEDIA_ACCESS_KEY_GUIDANCE = "Missing or invalid Control Center access key. Save a valid access key before using provider-backed media generation.";
const SPECIALISTS = [
  {
    id: "visual-director",
    title: "Visual Director",
    purpose: "Design premium still visuals that keep product truth and visual hierarchy clear.",
    bestUse: "When creating hero images, product carousels, ad stills, and marketplace visuals.",
    suggestedPrompt: "Act as Visual Director. Build a high-conversion image brief with composition, camera angle, lighting, text-safe area, and product-first framing."
  },
  {
    id: "video-strategist",
    title: "Video Strategist",
    purpose: "Translate campaign goals into short-form video concepts with strong hooks and pacing.",
    bestUse: "When producing reels, shorts, story cuts, and paid social video variants.",
    suggestedPrompt: "Act as Video Strategist. Convert this brief into a 9:16 short video plan with hook, beat-by-beat storyboard, scene transitions, and CTA timing."
  },
  {
    id: "voice-director",
    title: "Voice Director",
    purpose: "Shape narration tone, rhythm, and script clarity for voice-led content.",
    bestUse: "When writing voiceovers for UGC-style videos, explainers, and promotional reels.",
    suggestedPrompt: "Act as Voice Director. Create a voiceover script with opening hook, scene-aligned narration, cadence notes, and pronunciation guidance."
  },
  {
    id: "brand-guardian",
    title: "Brand Guardian",
    purpose: "Protect brand consistency, legal-safe claims, and publishable creative outputs.",
    bestUse: "Before approvals and publishing handoff, especially for regulated or claim-sensitive content.",
    suggestedPrompt: "Act as Brand Guardian. Audit this draft for logo fit, claim risk, brand color compliance, German tone quality, and platform-safe layout."
  },
  {
    id: "prompt-engineer",
    title: "Prompt Engineer",
    purpose: "Convert rough drafts into model-ready prompts with constraints and reusable structure.",
    bestUse: "When a brief is unclear, too broad, or missing technical constraints for generation.",
    suggestedPrompt: "Act as Prompt Engineer. Rewrite this into a structured generation prompt with objective, constraints, negatives, quality targets, and channel-specific formatting."
  },
  {
    id: "publishing-assistant",
    title: "Publishing Assistant",
    purpose: "Finalize readiness signals and handoff payload quality before publishing.",
    bestUse: "Right before preparing a Publishing package for downstream review.",
    suggestedPrompt: "Act as Publishing Assistant. Produce a final publishing handoff summary with readiness status, blockers, approval notes, and channel delivery checklist."
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

function titleCase(value) {
  return asString(value)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function toKey(value) {
  return clean(value).toLowerCase();
}

function nowIso() {
  return new Date().toISOString();
}

function firstText(...values) {
  for (const value of values) {
    const text = clean(value);
    if (text) return text;
  }
  return "";
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

function formatCount(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "0";
  return String(Math.max(0, Math.round(parsed)));
}

function projectKey(projectName) {
  return toKey(projectName) || "__default__";
}

function getProjectName(state) {
  return firstText(state.context?.currentProject, state.data.overview?.overview?.project_name, "Workspace");
}

function getBackendProjectName(state) {
  return firstText(state.context?.currentProject, state.data.overview?.overview?.project_name);
}

function getAssetData(state) {
  return asObject(state.data.assets);
}

function normalizeStatus(value, fallback = "draft") {
  const normalized = toKey(value);
  if (!normalized) return fallback;
  if (["requested", "request", "queued", "draft"].includes(normalized)) return "draft";
  if (["prompt_ready", "prompt ready", "ready"].includes(normalized)) return "prompt_ready";
  if (["generating", "running", "processing", "in_progress"].includes(normalized)) return "generating";
  if (["needs_review", "needs review", "review", "pending_approval"].includes(normalized)) return "needs_review";
  if (["approved", "complete", "completed"].includes(normalized)) return "approved";
  if (["publishing_ready", "publishing ready", "handoff", "ready_for_publishing"].includes(normalized)) return "publishing_ready";
  if (["sent_to_publishing", "sent to publishing", "sent"].includes(normalized)) return "sent_to_publishing";
  if (["failed", "blocked", "error", "rejected"].includes(normalized)) return "failed";
  return fallback;
}

function statusTone(status) {
  if (status === "approved" || status === "publishing_ready" || status === "sent_to_publishing") return "success";
  if (status === "prompt_ready" || status === "generating" || status === "needs_review") return "warning";
  if (status === "failed") return "danger";
  return "neutral";
}

function statusClass(status) {
  return asString(status).replace(/[\s_]+/g, "-");
}

function readDraftMap() {
  if (typeof window === "undefined") return {};
  try {
    const parsed = JSON.parse(window.localStorage?.getItem(MEDIA_LOCAL_DRAFTS_KEY) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (_) {
    return {};
  }
}

function writeDraftMap(map) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage?.setItem(MEDIA_LOCAL_DRAFTS_KEY, JSON.stringify(map || {}));
  } catch (_) {}
}

function readLibraryAssetMap() {
  if (typeof window === "undefined") return {};
  try {
    const parsed = JSON.parse(window.localStorage?.getItem(MEDIA_LIBRARY_LOCAL_ASSETS_KEY) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (_) {
    return {};
  }
}

function writeLibraryAssetMap(map) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage?.setItem(MEDIA_LIBRARY_LOCAL_ASSETS_KEY, JSON.stringify(map || {}));
  } catch (_) {}
}

function mediaAccessKeyMessage(error) {
  const detail = firstText(error?.payload?.message, error?.message);
  return detail ? `${MEDIA_ACCESS_KEY_GUIDANCE} (${detail})` : MEDIA_ACCESS_KEY_GUIDANCE;
}

function loadLocalDrafts(projectName) {
  return asArray(readDraftMap()[projectKey(projectName)]);
}

function loadLocalLibraryAssets(projectName) {
  return asArray(readLibraryAssetMap()[projectKey(projectName)]);
}

function upsertLocalLibraryAsset(projectName, asset) {
  const map = readLibraryAssetMap();
  const key = projectKey(projectName);
  const nextAsset = {
    ...asObject(asset),
    id: asString(asset.id || `media-library-${Date.now()}`),
    source_signature: asString(asset.source_signature),
    updated_at: nowIso()
  };
  const existing = asArray(map[key]).filter((item) => {
    const sameId = asString(item.id) && asString(item.id) === nextAsset.id;
    const sameSignature = nextAsset.source_signature && asString(item.source_signature) === nextAsset.source_signature;
    return !(sameId || sameSignature);
  });
  map[key] = [nextAsset, ...existing].slice(0, 120);
  writeLibraryAssetMap(map);
  return nextAsset;
}

function saveLocalDraft(projectName, draft) {
  const map = readDraftMap();
  const key = projectKey(projectName);
  const existing = asArray(map[key]).filter((item) => asString(item.id) !== asString(draft.id));
  const next = {
    ...asObject(draft),
    id: asString(draft.id || `local-media-${Date.now()}`),
    localOnly: true,
    source: "Local draft",
    updated_at: nowIso()
  };
  map[key] = [next, ...existing].slice(0, 30);
  writeDraftMap(map);
  return next;
}

function defaultForm(state, mode = "image") {
  const context = asObject(state.context);
  const overview = asObject(state.data.overview?.overview);
  return {
    mode,
    project: firstText(context.currentProject, overview.project_name),
    campaign: firstText(context.activeCampaign, overview.active_campaign),
    product: firstText(overview.project_name, context.currentProject),
    channel: "instagram",
    format: mode === "video" ? "9:16 reel" : mode === "voice" ? "voiceover script" : "1:1 social image",
    objective: firstText(overview.primary_goal, overview.goal, "Create publishing-ready media"),
    brandStyle: firstText(overview.brand_voice, overview.tone, "Premium, clear, brand-safe"),
    prompt: "",
    referenceAsset: "",
    outputPurpose: mode === "video" ? "reel" : "social post",
    reviewNotes: "",
    title: "",
    status: "draft"
  };
}

function nextVersionId(versions = []) {
  return `v${asArray(versions).length + 1}`;
}

function createVersionEntry({
  id,
  mode = "image",
  prompt = "",
  outputPayload = null,
  providerStatus = "prompt_ready",
  readinessStatus = "draft",
  notes = "",
  provider = "",
  model = "",
  libraryAssetRef = null,
  createdAt
} = {}, existing = []) {
  return {
    id: asString(id || nextVersionId(existing)),
    mode: asString(mode || "image"),
    prompt: asString(prompt),
    output_payload: outputPayload == null ? null : outputPayload,
    provider_status: MEDIA_PREVIEW_STATES.includes(asString(providerStatus)) ? asString(providerStatus) : "prompt_ready",
    readiness_status: normalizeStatus(readinessStatus || "draft", "draft"),
    notes: asString(notes),
    provider: asString(provider),
    model: asString(model),
    library_asset_ref: libraryAssetRef == null ? null : asObject(libraryAssetRef),
    timestamp: asString(createdAt || nowIso())
  };
}

function normalizeVersionEntry(rawVersion, index = 0) {
  const raw = asObject(rawVersion);
  const outputPayload = raw.output_payload != null
    ? raw.output_payload
    : raw.output != null
      ? raw.output
      : raw.summary
        ? safeJsonParse(raw.summary, { raw_summary: raw.summary })
        : null;

  return createVersionEntry({
    id: firstText(raw.id, raw.version_id, `v${index + 1}`),
    mode: firstText(raw.mode, raw.request_type, "image"),
    prompt: firstText(raw.prompt, raw.input_prompt),
    outputPayload,
    providerStatus: firstText(raw.provider_status, raw.status, "prompt_ready"),
    readinessStatus: firstText(raw.readiness_status, raw.status, "draft"),
    notes: firstText(raw.notes, raw.compare_notes),
    provider: firstText(raw.provider),
    model: firstText(raw.model),
    libraryAssetRef: raw.library_asset_ref || null,
    createdAt: firstText(raw.timestamp, raw.created_at, raw.updated_at)
  });
}

function createVersioningState(seedPrompt = "", seedNotes = "", seed = {}) {
  const baseVersion = createVersionEntry({
    id: "v1",
    mode: firstText(seed.mode, "image"),
    prompt: clean(seedPrompt),
    outputPayload: seed.outputPayload || null,
    providerStatus: firstText(seed.providerStatus, "prompt_ready"),
    readinessStatus: firstText(seed.readinessStatus, "draft"),
    notes: clean(seedNotes),
    provider: firstText(seed.provider, ""),
    model: firstText(seed.model, ""),
    createdAt: seed.timestamp || nowIso()
  });

  return {
    selectedVersionId: baseVersion.id,
    compareMode: false,
    compareNotes: "",
    versions: [baseVersion]
  };
}

function ensureVersioning(session) {
  if (!session.versioning) {
    session.versioning = createVersioningState(session.form?.prompt, session.form?.reviewNotes, {
      mode: session.form?.mode || session.mode || "image",
      readinessStatus: session.form?.status || "draft"
    });
  }
  if (!Array.isArray(session.versioning.versions) || !session.versioning.versions.length) {
    session.versioning.versions = createVersioningState(session.form?.prompt, session.form?.reviewNotes).versions;
  }
  if (!session.versioning.selectedVersionId) {
    session.versioning.selectedVersionId = session.versioning.versions[session.versioning.versions.length - 1]?.id || "v1";
  }
  return session.versioning;
}

function selectedVersionEntry(session) {
  const versioning = ensureVersioning(session);
  const selected = versioning.versions.find((version) => version.id === versioning.selectedVersionId);
  if (selected) return selected;
  const fallback = versioning.versions[versioning.versions.length - 1];
  versioning.selectedVersionId = fallback?.id || "v1";
  return fallback;
}

function previousVersionEntry(session) {
  const versioning = ensureVersioning(session);
  const current = selectedVersionEntry(session);
  const index = versioning.versions.findIndex((version) => version.id === current?.id);
  if (index <= 0) return null;
  return versioning.versions[index - 1] || null;
}

function appendVersion(session, versionEntry) {
  const versioning = ensureVersioning(session);
  const normalized = createVersionEntry({
    ...asObject(versionEntry),
    id: nextVersionId(versioning.versions)
  }, versioning.versions);
  versioning.versions = [...versioning.versions, normalized];
  versioning.selectedVersionId = normalized.id;
  return normalized;
}

function hydrateVersioningFromItem(item) {
  const itemObject = asObject(item);
  const rawVersions = asArray(itemObject.output_versions);
  const normalized = rawVersions.map((version, index) => normalizeVersionEntry(version, index)).filter((entry) => entry.id);
  if (normalized.length) {
    return {
      selectedVersionId: normalized[normalized.length - 1].id,
      compareMode: false,
      compareNotes: "",
      versions: normalized
    };
  }
  return createVersioningState(itemObject.prompt || "", itemObject.reviewNotes || "", {
    mode: itemObject.mode || "image",
    readinessStatus: itemObject.status || "draft"
  });
}

function syncVersionFromForm(session) {
  const current = selectedVersionEntry(session);
  if (!current) return;
  current.prompt = clean(session.form.prompt);
  current.notes = clean(session.form.reviewNotes);
  current.mode = session.form.mode || session.mode || current.mode || "image";
  current.readiness_status = normalizeStatus(session.form.status || current.readiness_status || "draft", "draft");
}

function applySelectedVersionToForm(session) {
  const current = selectedVersionEntry(session);
  if (!current) return;
  session.form.prompt = current.prompt || "";
  session.form.reviewNotes = current.notes || "";
  session.form.status = normalizeStatus(current.readiness_status || session.form.status || "draft", "draft");
  session.mode = current.mode || session.mode || "image";
  session.form.mode = session.mode;
}

function safeJsonParse(value, fallback = {}) {
  try {
    if (typeof value === "object" && value) return value;
    const parsed = JSON.parse(asString(value));
    return parsed && typeof parsed === "object" ? parsed : fallback;
  } catch (_) {
    return fallback;
  }
}

function ensureSession(projectName, state) {
  const key = projectKey(projectName);
  if (!mediaStudioSessions.has(key)) {
    mediaStudioSessions.set(key, {
      loaded: false,
      loading: false,
      error: "",
      items: [],
      contentItems: [],
      tasks: [],
      approvals: [],
      handoffs: [],
      events: [],
      operations: null,
      selectedId: "",
      mode: "image",
      form: defaultForm(state, "image"),
      formSourceId: "",
      generationOutputs: [],
      versioning: createVersioningState(),
      validation: {},
      draftMessage: "",
      loadedHandoffId: "",
      isCreatingNew: true
    });
  }
  return mediaStudioSessions.get(key);
}

function requestTypeForMode(mode) {
  if (mode === "voice") return "audio";
  if (mode === "campaign-pack") return "multi_format";
  return mode || "image";
}

function ownerRoleForMode(mode) {
  return mode === "video" ? MEDIA_ROLE_DEFAULTS.videoRole : MEDIA_ROLE_DEFAULTS.designRole;
}

function normalizeMediaItem(rawItem, state, source = "Backend media job") {
  const raw = asObject(rawItem);
  const requestType = toKey(raw.request_type || raw.media_type || raw.mode || "image");
  const mode = requestType === "audio" ? "voice" : requestType === "multi_format" ? "campaign-pack" : requestType || "image";
  const item = {
    id: firstText(raw.id, raw.media_job_id, raw.job_id),
    title: firstText(raw.title, raw.name, raw.prompt, `${titleCase(mode)} media job`),
    mode: MEDIA_MODES.includes(mode) ? mode : "image",
    request_type: requestTypeForMode(mode),
    project: firstText(raw.project, raw.project_name, state.context?.currentProject),
    campaign: firstText(raw.campaign, raw.campaign_name, raw.campaign_id, state.context?.activeCampaign),
    product: firstText(raw.product, raw.product_name),
    channel: firstText(raw.channel, raw.destination_channel),
    format: firstText(raw.format, raw.aspect_ratio, raw.output_format),
    objective: firstText(raw.objective, raw.goal, raw.brief),
    brandStyle: firstText(raw.brand_style, raw.style, raw.brandStyle),
    prompt: firstText(raw.prompt, raw.generation_prompt),
    brief: firstText(raw.brief, raw.summary, raw.description),
    referenceAsset: firstText(raw.reference_asset, raw.referenceAsset, raw.asset_id),
    outputPurpose: firstText(raw.output_purpose, raw.outputPurpose, raw.purpose),
    status: normalizeStatus(raw.status, "draft"),
    approval_state: asString(raw.approval_state || raw.approvalStatus || ""),
    provider: asString(raw.provider || ""),
    model: asString(raw.model || ""),
    owner: asString(raw.owner || ""),
    owner_role: asString(raw.owner_role || ownerRoleForMode(mode)),
    review_role: asString(raw.review_role || MEDIA_ROLE_DEFAULTS.reviewRole),
    service_domain: asString(raw.service_domain || MEDIA_ROLE_DEFAULTS.serviceDomain),
    content_item_id: asString(raw.content_item_id || ""),
    publishing_job_id: asString(raw.publishing_job_id || ""),
    outputs: asArray(raw.outputs || raw.output_versions),
    output_versions: asArray(raw.output_versions || raw.outputs),
    preview_history: asArray(raw.preview_history),
    comments: asArray(raw.comments),
    asset_lineage: asArray(raw.asset_lineage),
    linked_tasks: asArray(raw.linked_tasks),
    linked_approvals: asArray(raw.linked_approvals),
    linked_handoffs: asArray(raw.linked_handoffs),
    reviewNotes: firstText(raw.review_notes, raw.reviewNotes, asArray(raw.comments)[0]?.text),
    source,
    localOnly: Boolean(raw.localOnly),
    created_at: asString(raw.created_at || raw.createdAt),
    updated_at: asString(raw.updated_at || raw.updatedAt)
  };
  return item;
}

function mergeQueueItems(backendItems, localItems) {
  const backendIds = new Set(backendItems.map((item) => asString(item.id)));
  return [
    ...localItems.filter((item) => !backendIds.has(asString(item.id))),
    ...backendItems
  ].sort(compareMediaItems);
}

function compareMediaItems(a, b) {
  const order = {
    failed: 0,
    publishing_ready: 1,
    sent_to_publishing: 2,
    approved: 3,
    needs_review: 4,
    generating: 5,
    prompt_ready: 6,
    draft: 7
  };
  const aOrder = order[a.status] ?? 99;
  const bOrder = order[b.status] ?? 99;
  if (aOrder !== bOrder) return aOrder - bOrder;
  return (Date.parse(b.updated_at || b.created_at) || 0) - (Date.parse(a.updated_at || a.created_at) || 0);
}

async function loadMediaWorkspace(projectName, backendProjectName, state, session, rerender) {
  if (!backendProjectName || session.loading || session.loaded) return;

  session.loading = true;
  session.error = "";
  rerender();

  try {
    const results = await Promise.allSettled([
      listProjectMediaJobs(backendProjectName, { limit: 120 }),
      listProjectContentItems(backendProjectName, { limit: 120 }),
      listProjectTasks(backendProjectName, 120),
      listProjectApprovals(backendProjectName, 120),
      listProjectHandoffs(backendProjectName, { limit: 120 }),
      listProjectEvents(backendProjectName, 120),
      fetchProjectOperations(backendProjectName)
    ]);

    const [
      mediaJobsResult,
      contentItemsResult,
      tasksResult,
      approvalsResult,
      handoffsResult,
      eventsResult,
      operationsResult
    ] = results;

    const fulfilledValue = (result, fallback) =>
      result?.status === "fulfilled" ? result.value : fallback;

    const mediaJobs = fulfilledValue(mediaJobsResult, { items: [] });
    const contentItems = fulfilledValue(contentItemsResult, { items: [] });
    const tasks = fulfilledValue(tasksResult, { items: [] });
    const approvals = fulfilledValue(approvalsResult, { items: [] });
    const handoffs = fulfilledValue(handoffsResult, { items: [] });
    const events = fulfilledValue(eventsResult, { items: [] });
    const operations = fulfilledValue(operationsResult, null);

    const failedLoads = results.filter((result) => result.status === "rejected").length;

    const backendItems = asArray(mediaJobs.items).map((item) => normalizeMediaItem(item, state));
    const localItems = loadLocalDrafts(projectName).map((item) => normalizeMediaItem(item, state, "Local draft"));
    session.items = mergeQueueItems(backendItems, localItems);
    session.contentItems = asArray(contentItems.items);
    session.tasks = asArray(tasks.items);
    session.approvals = asArray(approvals.items);
    session.handoffs = asArray(handoffs.items);
    session.events = asArray(events.items);
    session.operations = operations || null;
    session.error = failedLoads
      ? `${failedLoads} Media Studio data source${failedLoads === 1 ? "" : "s"} could not be loaded. Available data is still shown.`
      : "";
    session.loaded = true;
    applyInboundHandoff(projectName, session);
    if (!session.selectedId) session.selectedId = session.items[0]?.id || "";
  } catch (error) {
    session.error = "Backend media data is unavailable. Media Studio is running in local draft mode.";
    session.items = mergeQueueItems([], loadLocalDrafts(projectName).map((item) => normalizeMediaItem(item, state, "Local draft")));
    session.loaded = true;
    applyInboundHandoff(projectName, session);
  } finally {
    session.loading = false;
    rerender();
  }
}

function getSelectedItem(session) {
  return session.items.find((item) => asString(item.id) === asString(session.selectedId)) || null;
}

function getLinkedRecords(items, ids) {
  const set = new Set(asArray(ids).map((value) => asString(value)).filter(Boolean));
  return items.filter((item) => set.has(asString(item.id)));
}

function getInboundHandoff(projectName, session) {
  const operations = session.operations || {};
  return (
    getSharedHandoff(projectName, "media-studio", operations, "workflows") ||
    getSharedHandoff(projectName, "media-studio", operations, "ai-command") ||
    getSharedHandoff(projectName, "media-studio", operations, "content-studio") ||
    getSharedHandoff(projectName, "media-studio", operations)
  );
}

function extractHandoffSummary(handoff) {
  const payload = asObject(handoff?.payload);
  const output = asObject(payload.output);
  const draftContext = asObject(payload.draft_context);
  const contentVersion = asObject(payload.selected_content_version);
  const sourcePage = asString(handoff?.source_page || "workflows");
  const contentType = firstText(payload.content_type, contentVersion.mode, output.content_type);
  const contentBody = firstText(
    contentVersion.content_output,
    payload.script_caption_copy,
    payload.copy,
    payload.content,
    payload.draft
  );

  return {
    id: asString(
      handoff?.id ||
      payload.workflow_id ||
      payload.media_job_id ||
      payload.prompt ||
      payload.workflow_title ||
      contentVersion.version_id ||
      payload.content_item_id
    ),
    sourcePage,
    title: firstText(
      output.title,
      payload.workflow_title,
      payload.title,
      contentVersion.title,
      draftContext.lastResponseTitle,
      contentType ? `${titleCase(contentType)} design brief` : "Inbound media brief"
    ),
    project: firstText(draftContext.projectName, payload.project, payload.project_name, output.project),
    campaign: firstText(payload.campaign_name, payload.campaign, output.campaign, output.campaignName),
    product: firstText(output.product, payload.product, output.productName),
    channel: firstText(output.channel, payload.channel, contentVersion.channel),
    objective: firstText(output.goal, output.objective, payload.goal, payload.suggested_media_brief, payload.prompt, contentVersion.prompt),
    prompt: firstText(output.prompt, output.media_prompt, payload.suggested_media_brief, payload.prompt, contentVersion.prompt, draftContext.lastCommand),
    brief: firstText(payload.suggested_media_brief, output.summary, output.brief, payload.brief, contentBody),
    copy: contentBody,
    contentType,
    language: firstText(payload.language, contentVersion.language),
    tone: firstText(payload.tone, contentVersion.tone),
    readinessStatus: firstText(payload.readiness_status, contentVersion.readiness_status),
    output
  };
}

function applyInboundHandoff(projectName, session) {
  const handoff = getInboundHandoff(projectName, session);
  if (!handoff) return;
  const summary = extractHandoffSummary(handoff);
  if (!summary.id || summary.id === session.loadedHandoffId) return;
  session.loadedHandoffId = summary.id;
}

function syncFormFromItem(session, item) {
  if (!item) return;
  session.mode = item.mode || "image";
  session.form = {
    mode: item.mode || "image",
    project: item.project || session.form.project || "",
    campaign: item.campaign || "",
    product: item.product || "",
    channel: item.channel || "instagram",
    format: item.format || "",
    objective: item.objective || item.brief || "",
    brandStyle: item.brandStyle || "",
    prompt: item.prompt || "",
    referenceAsset: item.referenceAsset || asArray(item.asset_lineage)[0] || "",
    outputPurpose: item.outputPurpose || "social post",
    reviewNotes: item.reviewNotes || "",
    title: item.title || "",
    status: item.status || "draft"
  };
  session.generationOutputs = asArray(item.outputs);
  session.versioning = hydrateVersioningFromItem(item);
  syncOutputsFromVersioning(session);
  session.formSourceId = item.id;
  session.validation = {};
  session.isCreatingNew = false;
}

function resetForm(session, state, mode = session.mode || "image") {
  session.mode = mode;
  session.form = defaultForm(state, mode);
  session.versioning = createVersioningState("", "", {
    mode,
    readinessStatus: "draft"
  });
  syncOutputsFromVersioning(session);
  session.selectedId = "";
  session.formSourceId = "";
  session.validation = {};
  session.draftMessage = "";
  session.isCreatingNew = true;
}

function syncSessionForm(session, form) {
  if (!form) return;
  Array.from(form.elements).forEach((field) => {
    if (!field.name) return;
    session.form[field.name] = field.value || "";
  });
  session.mode = session.form.mode || session.mode || "image";
  syncVersionFromForm(session);
}

function validateGenerator(session, intent = "save") {
  const form = session.form;
  const errors = {};
  if (!clean(form.project)) errors.project = "Project is required.";
  if (!clean(form.campaign)) errors.campaign = "Campaign is required.";
  if (!clean(form.product)) errors.product = "Product is required.";
  if (!clean(form.channel)) errors.channel = "Channel is required.";
  if (!clean(form.format)) errors.format = "Format is required.";
  if (!clean(form.objective)) errors.objective = "Objective is required.";
  if (!clean(form.brandStyle)) errors.brandStyle = "Brand style is required.";
  if (!clean(form.prompt) && intent !== "generate-prompt") errors.prompt = "Prompt or brief is required.";
  if (!clean(form.outputPurpose)) errors.outputPurpose = "Output purpose is required.";
  session.validation = errors;
  return !Object.keys(errors).length;
}

function fieldError(session, key, escapeHtml) {
  const message = session.validation[key];
  return message ? `<div class="media-inline-error">${escapeHtml(message)}</div>` : "";
}

function buildPromptFromContext(state, session) {
  const overview = asObject(state.data.overview?.overview);
  const form = session.form;
  return [
    `Create ${form.outputPurpose || "publishing-ready media"} for ${form.product || overview.project_name || "the product"}.`,
    `Campaign: ${form.campaign || state.context?.activeCampaign || "current campaign"}.`,
    `Channel and format: ${form.channel || "channel"} / ${form.format || "format"}.`,
    `Objective: ${form.objective || overview.primary_goal || "support campaign readiness"}.`,
    `Brand style: ${form.brandStyle || overview.brand_voice || "premium, clear, brand-safe"}.`,
    "Keep product identity accurate, leave safe text area, avoid unsupported claims, and prepare for Publishing handoff."
  ].join("\n");
}

function improvePrompt(prompt) {
  const base = clean(prompt) || "Create brand-safe campaign media.";
  return `${base}\n\nProduction constraints: accurate product identity, clean composition, strong focal hierarchy, channel-safe crop, no unsupported claims, no cluttered text, and enough negative space for publishing copy.`;
}

function makeBrandSafe(prompt) {
  const base = clean(prompt) || "Create brand-safe campaign media.";
  return `${base}\n\nBrand safety guardrails: use approved logo and brand cues only, preserve packaging and product truth, avoid medical or exaggerated claims, keep text legible, and respect platform content policies.`;
}

function adaptGerman(prompt) {
  const base = clean(prompt) || "Create brand-safe campaign media.";
  return `${base}\n\nGerman adaptation: keep the visual brief international, adapt on-image or voiceover language to clear German, preserve brand tone, and avoid literal translations that sound unnatural.`;
}

function convertImagePromptToVideoBrief(prompt) {
  const base = clean(prompt) || "Create a product-focused image concept.";
  return `${base}\n\nConvert to video brief:\n- Duration: 15-30 seconds\n- Hook in first 2 seconds\n- Shot list with camera moves\n- Product visibility in every key shot\n- Text-safe zones and CTA ending\n- Channel export notes for reels/shorts`;
}

function convertVideoBriefToVoiceover(prompt) {
  const base = clean(prompt) || "Create a short video plan.";
  return `${base}\n\nConvert to voiceover script:\n- Opening hook line\n- Scene-by-scene narration\n- German-friendly pronunciation notes\n- Timing markers for each scene\n- CTA close with compliant brand tone`;
}

function generateAllFormats(session, state) {
  const contextPrompt = clean(session.form.prompt) || buildPromptFromContext(state, session);
  return [
    "Image format brief:",
    contextPrompt,
    "",
    "Video format brief:",
    convertImagePromptToVideoBrief(contextPrompt),
    "",
    "Voice format brief:",
    convertVideoBriefToVoiceover(contextPrompt),
    "",
    "Campaign pack brief:",
    `${contextPrompt}\n\nCampaign pack outputs: image hero, video short, voiceover script, channel cutdowns, and publishing-ready metadata.`
  ].join("\n");
}

function buildMediaPayload(session, status = "prompt_ready") {
  const mode = session.form.mode || session.mode || "image";
  const versioning = ensureVersioning(session);
  return {
    id: session.formSourceId || session.selectedId || "",
    title: firstText(session.form.title, `${titleCase(mode)} media for ${session.form.campaign || session.form.project || "campaign"}`),
    request_type: requestTypeForMode(mode),
    mode,
    project: session.form.project,
    campaign: session.form.campaign,
    product: session.form.product,
    channel: session.form.channel,
    format: session.form.format,
    objective: session.form.objective,
    brand_style: session.form.brandStyle,
    prompt: session.form.prompt,
    brief: session.form.objective,
    reference_asset: session.form.referenceAsset,
    output_purpose: session.form.outputPurpose,
    review_notes: session.form.reviewNotes,
    provider: mode === "video" ? "video provider pending" : mode === "voice" ? "voice provider pending" : "image provider pending",
    model: "backend generation pending",
    owner_role: ownerRoleForMode(mode),
    review_role: MEDIA_ROLE_DEFAULTS.reviewRole,
    service_domain: MEDIA_ROLE_DEFAULTS.serviceDomain,
    status,
    asset_lineage: clean(session.form.referenceAsset) ? [session.form.referenceAsset] : [],
    outputs: asArray(session.generationOutputs),
    output_versions: asArray(versioning.versions).map((version) => ({
      id: version.id,
      mode: version.mode,
      prompt: version.prompt,
      output_payload: version.output_payload,
      provider_status: version.provider_status,
      readiness_status: version.readiness_status,
      notes: version.notes,
      provider: version.provider,
      model: version.model,
      library_asset_ref: version.library_asset_ref || null,
      timestamp: version.timestamp
    })),
    actor: "media-studio"
  };
}

function buildGenerationRequestPayload(session) {
  const mode = session.form.mode || session.mode || "image";
  return {
    media_job_id: session.formSourceId || session.selectedId || "",
    request_type: requestTypeForMode(mode),
    mode,
    project: session.form.project,
    campaign: session.form.campaign,
    product: session.form.product,
    channel: session.form.channel,
    format: session.form.format,
    objective: session.form.objective,
    brandStyle: session.form.brandStyle,
    prompt: session.form.prompt,
    title: session.form.title,
    output_purpose: session.form.outputPurpose,
    reference_asset: session.form.referenceAsset
  };
}

function buildOutputVersionFromGeneration(mode, response) {
  const summaryPayload = {
    mode,
    status: response?.status,
    provider: response?.provider,
    model: response?.model,
    url: response?.url,
    image_url: response?.image_url,
    video_url: response?.video_url,
    audio_url: response?.audio_url,
    images: asArray(response?.images),
    videos: asArray(response?.videos),
    audio: response?.audio,
    video_brief: response?.video_brief,
    voice_script: response?.voice_script,
    campaign_pack: response?.campaign_pack,
    improved_prompt: response?.improved_prompt,
    brand_check: response?.brand_check,
    message: response?.message
  };

  return {
    label: `${titleCase(mode)} output ${new Date().toISOString().slice(0, 19).replace("T", " ")}`,
    summary: JSON.stringify(summaryPayload),
    provider: response?.provider || "",
    model: response?.model || "",
    payload: summaryPayload,
    created_at: nowIso()
  };
}

function normalizeApprovalStatus(readinessStatus) {
  const normalized = normalizeStatus(readinessStatus || "draft", "draft");
  if (["approved", "publishing_ready", "sent_to_publishing"].includes(normalized)) return "approved";
  if (normalized === "needs_review") return "needs_review";
  return "draft";
}

function classifyLibraryUsage(session, selectedItem, version, readiness) {
  const usage = [];
  const purpose = firstText(session.form.outputPurpose, selectedItem?.outputPurpose).toLowerCase();
  if (purpose.includes("marketplace") || ["amazon", "ebay"].includes(toKey(session.form.channel || selectedItem?.channel))) {
    usage.push("marketplace");
  }
  if (purpose.includes("ad")) usage.push("ad");
  if (purpose.includes("campaign")) usage.push("campaign");
  if (["instagram", "facebook", "tiktok", "youtube"].includes(toKey(session.form.channel || selectedItem?.channel))) {
    usage.push("social");
  }
  if (["publishing_ready", "sent_to_publishing", "approved"].includes(normalizeStatus(readiness.readinessStatus, "draft"))) {
    usage.push("publishing");
  }
  return [...new Set(usage.length ? usage : ["campaign"] )];
}

function buildLibraryAssetPayload(projectName, session, selectedItem, version) {
  const payload = asObject(version?.output_payload);
  const mediaPreview = resolvePreviewMedia(payload);
  const readiness = getVersionReadiness(version, session, selectedItem);
  const mediaType = firstText(version?.mode, selectedItem?.mode, session.form.mode, "image");
  const sourceMediaId = firstText(selectedItem?.id, session.formSourceId);
  const sourceSignature = [
    toKey(projectName),
    toKey(sourceMediaId),
    toKey(version?.id),
    toKey(mediaType),
    clean(version?.prompt || session.form.prompt)
  ].join("::");

  return {
    id: `media-lib-${Date.now()}`,
    source_signature: sourceSignature,
    project: firstText(session.form.project, selectedItem?.project, projectName),
    campaign: firstText(session.form.campaign, selectedItem?.campaign),
    media_type: mediaType,
    version_id: asString(version?.id || ""),
    media_job_id: sourceMediaId,
    title: firstText(selectedItem?.title, session.form.title, `${titleCase(mediaType)} ${titleCase(asString(version?.id || "version"))}`),
    prompt: firstText(version?.prompt, session.form.prompt),
    output_payload: payload,
    url: firstText(payload.url, mediaPreview.imageUrl),
    image_url: mediaPreview.imageUrl,
    video_url: mediaPreview.videoUrl,
    audio_url: mediaPreview.audioUrl,
    readiness_status: readiness.readinessStatus,
    approval_status: normalizeApprovalStatus(readiness.readinessStatus),
    brand_checklist: readiness.checklist.map(([label, ready]) => ({ label, ready })),
    brand_check: asObject(payload.brand_check),
    notes: firstText(version?.notes, session.form.reviewNotes, selectedItem?.reviewNotes),
    source: "media-studio",
    usage: classifyLibraryUsage(session, selectedItem, version, readiness),
    status: normalizeStatus(version?.readiness_status || readiness.readinessStatus || "draft", "draft"),
    local_only: false,
    created_at: version?.timestamp || nowIso(),
    updated_at: nowIso()
  };
}

function findExistingLibrarySave(session, projectName, sourceSignature) {
  const local = loadLocalLibraryAssets(projectName).find((item) => asString(item.source_signature) === asString(sourceSignature));
  const backend = asArray(session.handoffs).find((entry) => {
    const payload = asObject(entry?.payload);
    const libraryAsset = asObject(payload.library_asset);
    const routeMatches = asString(entry?.destination_page) === "library" && asString(entry?.source_page) === "media-studio";
    return routeMatches && asString(libraryAsset.source_signature) === asString(sourceSignature);
  });
  return {
    local: local || null,
    backend: backend || null
  };
}

async function saveVersionToLibrary({
  projectName,
  backendProjectName,
  state,
  session,
  selectedItem,
  showMessage,
  rerender
}) {
  const version = selectedVersionEntry(session);
  if (!version) {
    session.validation = { ...session.validation, librarySave: "Select a version before saving to Library." };
    rerender();
    return;
  }

  const payload = asObject(version.output_payload);
  const hasPrompt = Boolean(clean(version.prompt || session.form.prompt));
  const hasPayload = Object.keys(payload).length > 0;
  if (!hasPrompt && !hasPayload) {
    session.validation = { ...session.validation, librarySave: "Version needs prompt or output payload before saving to Library." };
    rerender();
    return;
  }

  const libraryAsset = buildLibraryAssetPayload(projectName, session, selectedItem, version);
  const existing = findExistingLibrarySave(session, projectName, libraryAsset.source_signature);
  const allowBackendWrite = Boolean(backendProjectName);

  if (!allowBackendWrite && existing.local) {
    showMessage?.("Already saved to Library (local reference).");
    return;
  }

  const handoffPayload = {
    id: asString(existing.backend?.id || ""),
    source_page: "media-studio",
    destination_page: "library",
    source_role: selectedItem?.owner_role || ownerRoleForMode(session.form.mode || session.mode || "image"),
    destination_role: MEDIA_ROLE_DEFAULTS.reviewRole,
    source_service_domain: MEDIA_ROLE_DEFAULTS.serviceDomain,
    destination_service_domain: "library",
    linked_entity: {
      entity_type: "media_job",
      entity_id: firstText(selectedItem?.id, session.formSourceId),
      route: "media-studio",
      label: firstText(selectedItem?.title, session.form.title, "Media output")
    },
    payload: {
      project: libraryAsset.project,
      campaign: libraryAsset.campaign,
      media_type: libraryAsset.media_type,
      usage: libraryAsset.usage,
      library_asset: libraryAsset
    },
    status: "available",
    actor: "media-studio"
  };

  setSharedHandoff(projectName || "__default__", "library", handoffPayload);
  if (!clean(projectName) || toKey(projectName) === "workspace") {
    setSharedHandoff("__default__", "library", handoffPayload);
  }

  let reference = {
    handoff_id: asString(existing.backend?.id || existing.local?.handoff_id || ""),
    source_signature: libraryAsset.source_signature,
    local_only: true,
    saved_at: nowIso(),
    status: "saved_to_library"
  };

  if (allowBackendWrite) {
    try {
      const result = await createProjectHandoff(backendProjectName, handoffPayload);
      const savedHandoff = asObject(result?.handoff);
      const savedId = asString(savedHandoff.id || handoffPayload.id);
      upsertLocalLibraryAsset(projectName, {
        ...libraryAsset,
        id: savedId || libraryAsset.id,
        handoff_id: savedId,
        local_only: false,
        source: "media-studio"
      });
      reference = {
        handoff_id: savedId,
        source_signature: libraryAsset.source_signature,
        local_only: false,
        saved_at: nowIso(),
        status: "saved_to_library"
      };
      session.handoffs = [savedHandoff, ...asArray(session.handoffs).filter((item) => asString(item.id) !== savedId)];
      showMessage?.(existing.backend ? "Already saved. Library metadata updated." : "Selected version saved to Library.");
    } catch (_) {
      upsertLocalLibraryAsset(projectName, {
        ...libraryAsset,
        id: libraryAsset.id,
        local_only: true,
        source: "media-studio"
      });
      showMessage?.("Library backend unavailable. Saved as local library handoff.");
    }
  } else {
    upsertLocalLibraryAsset(projectName, {
      ...libraryAsset,
      id: libraryAsset.id,
      local_only: true,
      source: "media-studio"
    });
    showMessage?.("Selected version saved to Library (local handoff).");
  }

  version.library_asset_ref = reference;
  version.provider_status = "saved_to_library";
  if (["draft", "prompt_ready"].includes(normalizeStatus(version.readiness_status || "draft", "draft"))) {
    version.readiness_status = "publishing_ready";
    session.form.status = "publishing_ready";
  }
  session.validation = { ...session.validation, librarySave: "" };
  syncOutputsFromVersioning(session);
  saveDraftToSession(projectName, state, session, normalizeStatus(session.form.status || version.readiness_status || "publishing_ready", "publishing_ready"));
}

function syncOutputsFromVersioning(session) {
  const versioning = ensureVersioning(session);
  session.generationOutputs = asArray(versioning.versions).map((version) => ({
    label: `${titleCase(version.id)} ${titleCase(version.mode)}`,
    summary: JSON.stringify({
      mode: version.mode,
      provider_status: version.provider_status,
      readiness_status: version.readiness_status,
      output_payload: version.output_payload
    }),
    provider: version.provider || "",
    model: version.model || "",
    payload: version.output_payload || null,
    created_at: version.timestamp || nowIso()
  }));
}

function saveDraftToSession(projectName, state, session, status = "prompt_ready") {
  syncOutputsFromVersioning(session);
  const saved = saveLocalDraft(projectName, buildMediaPayload(session, status));
  const item = normalizeMediaItem(saved, state, "Local draft");
  session.items = mergeQueueItems(session.items.filter((entry) => entry.id !== item.id), [item]);
  session.selectedId = item.id;
  session.formSourceId = item.id;
  session.isCreatingNew = false;
  session.draftMessage = "Media draft saved locally.";
  return item;
}

function getMetrics(session) {
  const counts = MEDIA_STATUSES.reduce((acc, status) => {
    acc[status] = session.items.filter((item) => item.status === status).length;
    return acc;
  }, {});
  return {
    total: session.items.length,
    readyAssets: counts.approved + counts.publishing_ready + counts.sent_to_publishing,
    draftJobs: counts.draft + counts.prompt_ready,
    needsReview: counts.needs_review,
    failed: counts.failed,
    publishingReady: counts.publishing_ready,
    counts
  };
}

function buildRecommendation(metrics, handoff, selectedItem) {
  const failed = selectedItem?.status === "failed" ? selectedItem : null;
  if (failed) {
    return {
      action: "Regenerate or repair the failed media job",
      why: `${failed.title} is blocked. Review the prompt and reference asset before routing downstream.`
    };
  }
  const needsReview = selectedItem?.status === "needs_review" ? selectedItem : null;
  if (needsReview) {
    return {
      action: "Review selected media package",
      why: `${needsReview.title} needs brand and format review before it can become package-ready.`
    };
  }
  const ready = selectedItem?.status === "publishing_ready" ? selectedItem : null;
  if (ready) {
    return {
      action: "Prepare Publishing Package",
      why: `${ready.title} is ready for a safe Publishing package handoff.`
    };
  }
  if (handoff) {
    return {
      action: "Load workflow media brief",
      why: "A workflow handoff is available. Load it into the generator to continue the Workflows -> Media Studio -> package handoff flow."
    };
  }
  if (metrics.draftJobs) {
    return {
      action: "Finish the strongest prompt draft",
      why: "Draft media work exists. Complete prompt, brand style, format, and output purpose before review."
    };
  }
  return {
    action: "Start a media job",
    why: "No media job is ready yet. Start with a brief, build a brand-safe prompt, then review and prepare a Publishing package."
  };
}

function capabilityFromOperations(operations, hints = []) {
  const text = clean(JSON.stringify(asObject(operations))).toLowerCase();
  if (!text) return false;
  return hints.some((hint) => text.includes(hint));
}

function getApiReadiness(session, backendProjectName) {
  const hasBackend = Boolean(backendProjectName);
  const operations = session.operations;
  const imageConnected = capabilityFromOperations(operations, ["image_generation", "image generator", "image_backend"]);
  const videoConnected = capabilityFromOperations(operations, ["video_generation", "video generator", "video_backend"]);
  const voiceConnected = capabilityFromOperations(operations, ["voice_generation", "audio_generation", "voice_backend"]);

  const publishingConnected = hasBackend || capabilityFromOperations(operations, ["publishing", "handoff"]);
  const approvalsConnected = hasBackend || capabilityFromOperations(operations, ["approval", "approvals"]);

  return {
    image_generation_backend: imageConnected,
    video_generation_backend: videoConnected,
    voice_generation_backend: voiceConnected,
    publishing_handoff: publishingConnected,
    approval_backend: approvalsConnected,
    hasBackend
  };
}

function getGeneratorFallbackMessage(session, backendProjectName) {
  const readiness = getApiReadiness(session, backendProjectName);
  const mode = session.mode || session.form?.mode || "image";
  if (mode === "image" && readiness.image_generation_backend) return "";
  if (mode === "video" && readiness.video_generation_backend) return "";
  if (mode === "voice" && readiness.voice_generation_backend) return "";
  if (mode === "campaign-pack" && readiness.image_generation_backend && readiness.video_generation_backend && readiness.voice_generation_backend) return "";
  return "Generator backend not connected yet — your prompt/job is ready. Review it, save it as a draft, send it to AI Command, save it to Library, or connect a provider in Integrations before trying real output generation.";
}

function renderScopedStyles() {
  return `
    <style>
      .media-production-center {
        display: grid;
        gap: 16px;
        min-width: 0;
      }

      .media-production-grid {
        display: grid;
        gap: 16px;
        min-width: 0;
      }

      .media-main-column,
      .media-side-column {
        display: grid;
        gap: 16px;
        min-width: 0;
        align-content: start;
      }

      .media-card {
        min-width: 0;
        overflow: hidden;
      }

      .media-overview-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(135px, 1fr));
        gap: 10px;
      }

      .media-overview-item,
      .media-impact-chip,
      .media-check-item {
        min-width: 0;
        border: 1px solid var(--border, rgba(148, 163, 184, 0.24));
        border-radius: 8px;
        padding: 12px;
        background: var(--surface-muted, rgba(15, 23, 42, 0.03));
      }

      .media-overview-item span,
      .media-impact-chip small,
      .media-check-item span {
        display: block;
        color: var(--text-muted, #64748b);
        font-size: 0.78rem;
        line-height: 1.35;
      }

      .media-overview-item strong,
      .media-impact-chip strong,
      .media-check-item strong {
        display: block;
        margin-top: 4px;
        overflow-wrap: anywhere;
      }

      .media-impact-row,
      .media-action-row,
      .media-mode-tabs,
      .media-queue-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        min-width: 0;
      }

      .media-impact-row,
      .media-action-row {
        margin-top: 14px;
      }

      .media-impact-chip {
        flex: 1 1 140px;
      }

      .media-mode-tabs {
        margin-bottom: 14px;
      }

      .media-mode-tab {
        min-height: 38px;
        border: 1px solid var(--border, rgba(148, 163, 184, 0.28));
        border-radius: 999px;
        padding: 8px 12px;
        background: transparent;
        color: inherit;
        cursor: pointer;
      }

      .media-mode-tab.is-active {
        border-color: var(--accent, #2563eb);
        background: rgba(37, 99, 235, 0.08);
      }

      .media-queue-list,
      .media-specialist-grid,
      .media-check-grid {
        display: grid;
        gap: 10px;
        min-width: 0;
      }

      .media-queue-row,
      .media-specialist-card {
        display: grid;
        gap: 10px;
        min-width: 0;
        border: 1px solid var(--border, rgba(148, 163, 184, 0.24));
        border-radius: 8px;
        padding: 12px;
        background: #f8fafc;
        color: #0f172a;
      }

      .media-queue-row.is-active {
        border-color: var(--accent, #2563eb);
        background: #eef4ff;
      }

      .media-queue-main {
        width: 100%;
        min-width: 0;
        border: 0;
        padding: 0;
        background: transparent;
        color: #0f172a;
        text-align: left;
        cursor: pointer;
      }

      .media-queue-title,
      .media-preview-title {
        display: block;
        font-weight: 700;
        color: #0f172a;
        overflow-wrap: anywhere;
      }

      .media-queue-meta,
      .media-preview-copy,
      .media-section-copy {
        color: #334155;
        overflow-wrap: anywhere;
      }

      .media-queue-actions button {
        min-height: 34px;
        border: 1px solid rgba(71, 85, 105, 0.45);
        border-radius: 999px;
        padding: 6px 9px;
        background: #ffffff;
        color: #0f172a;
        cursor: pointer;
      }

      .media-queue-actions button:hover {
        background: #e2e8f0;
      }

      .media-status-pill {
        display: inline-flex;
        width: fit-content;
        max-width: 100%;
        border-radius: 999px;
        padding: 4px 8px;
        background: rgba(100, 116, 139, 0.12);
        color: #0f172a;
        font-size: 0.76rem;
        font-weight: 700;
      }

      .media-status-pill.is-approved,
      .media-status-pill.is-publishing-ready {
        background: rgba(22, 163, 74, 0.12);
      }

      .media-status-pill.is-needs-review,
      .media-status-pill.is-prompt-ready,
      .media-status-pill.is-generating {
        background: rgba(217, 119, 6, 0.12);
      }

      .media-status-pill.is-sent-to-publishing {
        background: rgba(22, 163, 74, 0.18);
      }

      .media-status-pill.is-failed {
        background: rgba(220, 38, 38, 0.12);
      }

      .media-inline-error {
        margin-top: 6px;
        color: var(--danger, #b91c1c);
        font-size: 0.82rem;
        line-height: 1.35;
      }

      .media-prompt-box {
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        border: 1px solid var(--border, rgba(148, 163, 184, 0.24));
        border-radius: 8px;
        padding: 12px;
        background: rgba(15, 23, 42, 0.04);
        line-height: 1.45;
      }

      .media-viewer-frame {
        width: 100%;
        min-width: 0;
        border: 1px solid var(--border, rgba(148, 163, 184, 0.24));
        border-radius: 10px;
        background: #f8fafc;
        padding: 10px;
      }

      .media-viewer-image-link {
        display: block;
        width: 100%;
        text-decoration: none;
      }

      .media-viewer-image,
      .media-viewer-video {
        display: block;
        width: 100%;
        max-height: min(68vh, 520px);
        object-fit: contain;
        border-radius: 8px;
        background: #0f172a;
      }

      .media-viewer-audio {
        width: 100%;
        max-width: 100%;
      }

      .media-viewer-hint {
        margin-top: 8px;
        color: #475569;
        font-size: 0.82rem;
      }

      .media-generator-form {
        min-width: 0;
      }

      .media-readiness-grid,
      .media-version-grid,
      .media-api-grid {
        display: grid;
        gap: 10px;
        min-width: 0;
      }

      .media-version-tabs {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .media-version-tab {
        min-height: 34px;
        border: 1px solid var(--border, rgba(148, 163, 184, 0.28));
        border-radius: 999px;
        padding: 6px 12px;
        background: transparent;
        cursor: pointer;
      }

      .media-version-tab.is-active {
        border-color: var(--accent, #2563eb);
        background: rgba(37, 99, 235, 0.08);
      }

      .media-api-item {
        border: 1px solid var(--border, rgba(148, 163, 184, 0.24));
        border-radius: 8px;
        padding: 10px;
        background: var(--surface, #fff);
      }

      .media-api-item strong,
      .media-api-item span {
        display: block;
        overflow-wrap: anywhere;
      }

      @media (min-width: 980px) {
        .media-production-grid {
          grid-template-columns: minmax(0, 1.35fr) minmax(300px, 0.8fr);
          align-items: start;
        }

        .media-queue-row {
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: start;
        }

        .media-queue-actions {
          grid-column: 1 / -1;
        }

        .media-specialist-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .media-check-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .media-readiness-grid,
        .media-version-grid,
        .media-api-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
    </style>
  `;
}

function renderStatusPill(status, escapeHtml) {
  return `<span class="media-status-pill is-${escapeHtml(statusClass(status))}">${escapeHtml(displayMediaStatusLabel(status))}</span>`;
}

function displayMediaStatusLabel(status) {
  const normalized = normalizeStatus(status || "draft", "draft");
  if (normalized === "approved") return "Review Ready";
  if (normalized === "publishing_ready") return "Package Ready";
  if (normalized === "sent_to_publishing") return "Handoff Prepared";
  return titleCase(normalized);
}

function hasSelectedVersionOutput(version) {
  const payload = asObject(version?.output_payload);
  return Boolean(
    clean(payload.url) ||
    clean(payload.image_url) ||
    clean(payload.video_url) ||
    clean(payload.audio_url) ||
    asArray(payload.images).length ||
    asArray(payload.videos).length ||
    clean(payload.video_brief) ||
    clean(payload.voice_script) ||
    asObject(payload.campaign_pack).image_prompt ||
    asObject(payload.campaign_pack).video_brief ||
    asObject(payload.campaign_pack).voice_script ||
    clean(payload.message)
  );
}

function getMediaSourceReadiness(session, selectedItem, handoff) {
  const hasLibraryRef = Boolean(
    selectedItem?.library_asset_ref?.handoff_id ||
    selectedVersionEntry(session)?.library_asset_ref?.handoff_id
  );
  const hasReference = Boolean(clean(session.form?.referenceAsset || selectedItem?.referenceAsset));
  const hasItemSource = Boolean(clean(selectedItem?.source));
  const hasHandoff = Boolean(handoff);

  if (hasLibraryRef) {
    return {
      state: "ready",
      status: "Library source",
      detail: "Linked Library provenance is available for this package."
    };
  }
  if (hasReference) {
    return {
      state: "warning",
      status: "Reference attached",
      detail: "A reference asset is named, but source-of-truth status still needs review."
    };
  }
  if (hasHandoff || hasItemSource) {
    return {
      state: "warning",
      status: "Workflow context",
      detail: "Inbound or job context exists; attach Library source when claims or product truth matter."
    };
  }
  return {
    state: "missing",
    status: "Missing source",
    detail: "Attach a Library asset or load a source-backed handoff before final package routing."
  };
}

function getMediaReadinessItems(session, selectedItem, handoff) {
  const version = selectedVersionEntry(session);
  const readiness = getVersionReadiness(version, session, selectedItem);
  const source = getMediaSourceReadiness(session, selectedItem, handoff);
  const form = session.form || {};
  const promptText = firstText(version?.prompt, form.prompt, selectedItem?.prompt, selectedItem?.brief);
  const hasBrief = Boolean(promptText || clean(form.objective || selectedItem?.objective));
  const hasOutput = hasSelectedVersionOutput(version);
  const hasFormat = Boolean(clean(form.channel || selectedItem?.channel) && clean(form.format || selectedItem?.format));
  const hasBrandCue = Boolean(clean(form.brandStyle || selectedItem?.brandStyle || selectedItem?.referenceAsset || form.referenceAsset));
  const isBrandSafe = !readiness.missingItems.includes("brand safe");
  const packageReady = ["publishing_ready", "sent_to_publishing", "approved"].includes(readiness.readinessStatus) && hasOutput;
  const needsGovernance = source.state === "missing" || /claim|proof|medical|guarantee|legal|privacy|gdpr|discount|pricing/i.test(promptText);

  return [
    {
      key: "source",
      label: "Source",
      state: source.state,
      status: source.status,
      detail: source.detail
    },
    {
      key: "creative",
      label: "Creative",
      state: hasBrief && hasFormat ? "ready" : hasBrief ? "warning" : "missing",
      status: hasBrief && hasFormat ? "Brief ready" : hasBrief ? "Needs format" : "Needs brief",
      detail: hasBrief && hasFormat
        ? "Brief, channel, and format are present."
        : "Complete the objective, prompt, channel, and format before review."
    },
    {
      key: "brand",
      label: "Brand",
      state: isBrandSafe && hasBrandCue ? "ready" : promptText ? "warning" : "missing",
      status: isBrandSafe && hasBrandCue ? "Brand guided" : promptText ? "Review brand fit" : "Needs prompt",
      detail: isBrandSafe && hasBrandCue
        ? "Brand style or reference cues are present."
        : "Review brand style, logo fit, product truth, and safe claims."
    },
    {
      key: "publishing",
      label: "Publishing",
      state: packageReady ? "ready" : hasOutput ? "active" : hasBrief ? "warning" : "missing",
      status: packageReady ? "Package ready" : hasOutput ? "Review package" : hasBrief ? "Prepare output" : "Needs brief",
      detail: packageReady
        ? "Selected version can be prepared as a Publishing package."
        : "Output, selected version, and review notes should be checked before handoff."
    },
    {
      key: "governance",
      label: "Governance",
      state: needsGovernance ? "warning" : "ready",
      status: needsGovernance ? "Review risk" : "No obvious risk",
      detail: needsGovernance
        ? "Prepare Governance Review if source, claim, legal, privacy, or pricing risk exists."
        : "No obvious governance escalation signal in current prompt context."
    }
  ];
}

function renderMediaReadinessSummary({ session, selectedItem, handoff, escapeHtml }) {
  const items = getMediaReadinessItems(session, selectedItem, handoff);
  return `
    <section class="media-readiness-summary" aria-label="Media Studio compact readiness summary">
      ${items.map((item) => `
        <article class="media-readiness-chip is-${escapeHtml(item.state)}">
          <span>${escapeHtml(item.label)}</span>
          <strong>${escapeHtml(item.status)}</strong>
          <small>${escapeHtml(titleCase(item.state))}</small>
        </article>
      `).join("")}
    </section>
  `;
}

function renderMediaCommandHeader({ projectName, session, metrics, selectedItem, handoff, recommendation, escapeHtml }) {
  const form = session.form || {};
  const mode = form.mode || session.mode || selectedItem?.mode || "image";
  const campaign = firstText(form.campaign, selectedItem?.campaign, "No campaign");
  const status = displayMediaStatusLabel(selectedVersionEntry(session)?.readiness_status || selectedItem?.status || form.status || "draft");
  const packageCount = `${formatCount(metrics.total)} jobs/assets`;
  const readyCount = `${formatCount(metrics.readyAssets)} ready`;
  const handoffLabel = handoff ? "Brief available" : "No inbound brief";

  return `
    <header class="media-command-header" id="mediaCommandHeader" aria-label="Media Studio command header">
      <div class="media-command-main">
        <div>
          <div class="setup-kicker">Media Studio</div>
          <h2>Creative preparation, review, and routing workspace</h2>
          <p class="media-section-copy">Start by choosing Image, Video, Voice, or Campaign Pack. Generate a prompt first, then use Generate Output only when a provider/backend is connected. Save drafts for review, save reusable results to Library, or prepare a Publishing handoff without publishing directly.</p>
        </div>
        <div class="media-command-next">
          <span>Next action</span>
          <strong>${escapeHtml(recommendation.action)}</strong>
          <small>${escapeHtml(recommendation.why)}</small>
        </div>
      </div>
      <div class="media-command-meta" aria-label="Media Studio context">
        <span><strong>Project</strong>${escapeHtml(projectName || form.project || "Workspace")}</span>
        <span><strong>Campaign</strong>${escapeHtml(campaign)}</span>
        <span><strong>Mode</strong>${escapeHtml(mode === "campaign-pack" ? "Campaign Pack" : titleCase(mode))}</span>
        <span><strong>Package</strong>${escapeHtml(status)}</span>
        <span><strong>Workspace</strong>${escapeHtml(packageCount)} · ${escapeHtml(readyCount)}</span>
        <span><strong>Brief</strong>${escapeHtml(handoffLabel)}</span>
      </div>
      <div class="media-command-actions" aria-label="Media Studio safe actions">
        <button id="mediaStartJobBtn" class="btn btn-secondary" type="button" data-new-media-job="image">Start Media Job</button>
        <button id="mediaSaveDraftBtn" class="btn btn-secondary" type="button">Save Draft</button>
        <button id="mediaHeaderSaveLibraryBtn" class="btn btn-secondary" type="button">Save to Library</button>
        <button id="mediaSendToPublishingBtn" class="btn btn-primary" type="button">Prepare Publishing Package</button>
        <button id="mediaSendAiCommandBtn" class="btn btn-secondary" type="button">Open AI Command Review</button>
      </div>
    </header>
  `;
}

function getMediaWorkflowSteps(session, selectedItem, handoff) {
  const version = selectedVersionEntry(session);
  const readiness = getVersionReadiness(version, session, selectedItem);
  const source = getMediaSourceReadiness(session, selectedItem, handoff);
  const form = session.form || {};
  const hasBrief = Boolean(firstText(version?.prompt, form.prompt, form.objective, selectedItem?.prompt, selectedItem?.brief));
  const hasOutput = hasSelectedVersionOutput(version);
  const savedToLibrary = Boolean(version?.library_asset_ref?.handoff_id || selectedItem?.library_asset_ref?.handoff_id);
  const handoffPrepared = readiness.readinessStatus === "sent_to_publishing";
  const packageReady = ["publishing_ready", "approved", "sent_to_publishing"].includes(readiness.readinessStatus) && hasOutput;

  return [
    {
      label: "Brief",
      state: hasBrief ? "ready" : "active",
      detail: hasBrief ? "Brief present" : "Start here"
    },
    {
      label: "Source",
      state: source.state,
      detail: source.status
    },
    {
      label: "Generate/Prepare",
      state: hasOutput ? "ready" : hasBrief ? "active" : "missing",
      detail: hasOutput ? "Output captured" : hasBrief ? "Prompt ready" : "Needs brief"
    },
    {
      label: "Review",
      state: ["approved", "publishing_ready", "sent_to_publishing"].includes(readiness.readinessStatus) ? "ready" : hasOutput ? "active" : "missing",
      detail: hasOutput ? displayMediaStatusLabel(readiness.readinessStatus) : "Needs output"
    },
    {
      label: "Save to Library",
      state: savedToLibrary ? "ready" : hasOutput || hasBrief ? "active" : "missing",
      detail: savedToLibrary ? "Library linked" : "Available after draft"
    },
    {
      label: "Handoff",
      state: handoffPrepared ? "ready" : packageReady ? "active" : "missing",
      detail: handoffPrepared ? "Prepared" : packageReady ? "Package ready" : "Needs review"
    }
  ];
}

function renderMediaWorkflowStrip({ session, selectedItem, handoff, escapeHtml }) {
  const steps = getMediaWorkflowSteps(session, selectedItem, handoff);
  return `
    <nav class="media-workflow-strip" id="mediaWorkflowStrip" aria-label="Media Studio workflow: Brief Source Generate Prepare Review Save to Library Handoff">
      <div class="media-workflow-title">Brief &rarr; Source &rarr; Generate/Prepare &rarr; Review &rarr; Save to Library &rarr; Handoff</div>
      <ol class="media-workflow-list" role="list">
        ${steps.map((step, index) => `
          <li class="media-workflow-step is-${escapeHtml(step.state)}" role="listitem">
            <span class="media-workflow-index">${escapeHtml(String(index + 1))}</span>
            <span class="media-workflow-copy">
              <strong>${escapeHtml(step.label)}</strong>
              <small>${escapeHtml(step.detail)} · ${escapeHtml(titleCase(step.state))}</small>
            </span>
          </li>
        `).join("")}
      </ol>
    </nav>
  `;
}

function renderOverview(metrics, escapeHtml) {
  return `
    <section class="card media-card">
      <div class="card-head">
        <div>
          <div class="setup-kicker">Media Overview</div>
          <h3>Smart Media Generation & Production Center</h3>
        </div>
        <span class="card-badge neutral">${escapeHtml(formatCount(metrics.total))} jobs/assets</span>
      </div>
      <div class="media-overview-grid">
        <div class="media-overview-item"><span>Total media jobs/assets</span><strong>${escapeHtml(formatCount(metrics.total))}</strong></div>
        <div class="media-overview-item"><span>Ready assets</span><strong>${escapeHtml(formatCount(metrics.readyAssets))}</strong></div>
        <div class="media-overview-item"><span>Draft media jobs</span><strong>${escapeHtml(formatCount(metrics.draftJobs))}</strong></div>
        <div class="media-overview-item"><span>Needs review</span><strong>${escapeHtml(formatCount(metrics.needsReview))}</strong></div>
        <div class="media-overview-item"><span>Failed / blocked jobs</span><strong>${escapeHtml(formatCount(metrics.failed))}</strong></div>
        <div class="media-overview-item"><span>Publishing-ready handoffs</span><strong>${escapeHtml(formatCount(metrics.publishingReady))}</strong></div>
      </div>
    </section>
  `;
}

function renderRecommendation(recommendation, metrics, selectedItem, handoff, escapeHtml) {
  const chips = [
    ["Brand assets", metrics.total ? "In use" : "Needed"],
    ["Image generation", "Check API readiness"],
    ["Video", metrics.counts.generating ? "Active" : "Prompt-ready flow"],
    ["Voice", selectedItem?.mode === "voice" ? "Selected" : "Available"],
    ["Publishing", metrics.publishingReady ? "Ready" : "Prepare"],
    ["Campaign readiness", handoff ? "Workflow linked" : "Draft first"]
  ];

  return `
    <section class="card media-card" id="mediaRecommendation">
      <div class="card-head">
        <div>
          <div class="setup-kicker">Smart Recommendation</div>
          <h3>${escapeHtml(recommendation.action)}</h3>
          <p class="media-section-copy">${escapeHtml(recommendation.why)}</p>
        </div>
        <span class="card-badge ${statusTone(selectedItem?.status || "draft")}">${escapeHtml(selectedItem ? titleCase(selectedItem.status) : "Draft")}</span>
      </div>
      <div class="media-impact-row">
        ${chips.map(([label, value]) => `
          <span class="media-impact-chip">
            <strong>${escapeHtml(label)}</strong>
            <small>${escapeHtml(value)}</small>
          </span>
        `).join("")}
      </div>
      <div class="media-action-row">
        <button id="mediaStartJobBtn" class="btn btn-secondary" type="button" data-new-media-job="image">Start Media Job</button>
        <button id="mediaSaveDraftBtn" class="btn btn-secondary" type="button">Save Draft</button>
        <button id="mediaSendAiCommandBtn" class="btn btn-secondary" type="button">Open AI Command Review</button>
        <button id="mediaSendToPublishingBtn" class="btn btn-primary" type="button">Prepare Publishing Package</button>
      </div>
    </section>
  `;
}

function renderField({ id, name, label, value, type = "text", options = [], multiline = false, rows = 4, helper = "", errorKey = name }, session, escapeHtml) {
  const input = options.length
    ? `
      <select id="${escapeHtml(id)}" name="${escapeHtml(name)}" class="setup-input">
        ${options.map((option) => `
          <option value="${escapeHtml(option)}"${option === value ? " selected" : ""}>${escapeHtml(titleCase(option))}</option>
        `).join("")}
      </select>
    `
    : multiline
      ? `<textarea id="${escapeHtml(id)}" name="${escapeHtml(name)}" class="setup-input setup-textarea" rows="${rows}">${escapeHtml(value)}</textarea>`
      : `<input id="${escapeHtml(id)}" name="${escapeHtml(name)}" class="setup-input" type="${escapeHtml(type)}" value="${escapeHtml(value)}">`;

  return `
    <div class="setup-field-group">
      <div class="setup-field-head">
        <label class="setup-label" for="${escapeHtml(id)}">${escapeHtml(label)}</label>
      </div>
      ${input}
      ${helper ? `<div class="setup-helper">${escapeHtml(helper)}</div>` : ""}
      ${fieldError(session, errorKey, escapeHtml)}
    </div>
  `;
}

function renderGenerator(session, state, backendProjectName, escapeHtml) {
  const form = session.form;
  const mode = session.mode || form.mode || "image";
  const fallback = getGeneratorFallbackMessage(session, backendProjectName);
  const modeLabel = mode === "campaign-pack" ? "Campaign Pack" : titleCase(mode);
  return `
    <section class="card media-card" id="mediaGeneratorPanel">
      <div class="card-head">
        <div>
          <div class="setup-kicker">Media Generator</div>
          <h3>Brief -> Source -> Generate/Prepare -> Review -> Save to Library -> Handoff</h3>
          <p class="media-section-copy">Choose a media mode, prepare a prompt/job-ready draft, then render with a connected provider or continue safely with review and handoff.</p>
        </div>
        <span class="card-badge neutral">${escapeHtml(modeLabel)}</span>
      </div>
      <div class="media-mode-tabs" role="tablist" aria-label="Media generation mode">
        ${MEDIA_MODES.map((item) => `
          <button class="media-mode-tab${item === mode ? " is-active" : ""}" type="button" data-media-mode="${escapeHtml(item)}"${item === "image" || item === "video" ? ` data-new-media-job="${escapeHtml(item)}"` : ""}>${escapeHtml(item === "campaign-pack" ? "Campaign Pack" : titleCase(item))}</button>
        `).join("")}
      </div>
      ${fallback ? `<div class="simple-banner">${escapeHtml(fallback)}</div>` : ""}
          <div class="simple-banner media-block-gap">
            Start here: choose Image, Video, Voice, or Campaign Pack. Complete the brief, generate or improve the prompt, then use Generate Output only when a provider/backend is connected. If generation is unavailable or times out, keep the prompt/job-ready draft and continue with review, Library save, AI Command review, or provider setup in Integrations.
          </div>
      <form id="mediaGeneratorForm" class="setup-form-grid media-generator-form" novalidate>
        <input type="hidden" name="mode" value="${escapeHtml(mode)}">
        <div class="setup-form-grid setup-form-grid-2">
          ${renderField({ id: "mediaProjectInput", name: "project", label: "Project", value: form.project }, session, escapeHtml)}
          ${renderField({ id: "mediaCampaignInput", name: "campaign", label: "Campaign", value: form.campaign }, session, escapeHtml)}
        </div>
        <div class="setup-form-grid setup-form-grid-2">
          ${renderField({ id: "mediaProductInput", name: "product", label: "Product", value: form.product }, session, escapeHtml)}
          ${renderField({ id: "mediaChannelInput", name: "channel", label: "Channel", value: form.channel, options: CHANNELS }, session, escapeHtml)}
        </div>
        <div class="setup-form-grid setup-form-grid-2">
          ${renderField({ id: "mediaFormatInput", name: "format", label: "Format", value: form.format, helper: "Examples: 1:1 product image, 9:16 reel, voiceover script, marketplace hero." }, session, escapeHtml)}
          ${renderField({ id: "mediaPurposeInput", name: "outputPurpose", label: "Output purpose", value: form.outputPurpose, options: OUTPUT_PURPOSES }, session, escapeHtml)}
        </div>
        ${renderField({ id: "mediaObjectiveInput", name: "objective", label: "Objective", value: form.objective, multiline: true, rows: 3 }, session, escapeHtml)}
        ${renderField({ id: "mediaBrandStyleInput", name: "brandStyle", label: "Brand style", value: form.brandStyle, multiline: true, rows: 3 }, session, escapeHtml)}
        ${renderField({ id: "mediaPromptInput", name: "prompt", label: "Prompt / brief", value: form.prompt, multiline: true, rows: 7, helper: "Use this as the creative brief. If no generation provider is connected, Media Studio keeps it as a prompt/job-ready draft for review, Library save, AI review, or provider handoff." }, session, escapeHtml)}
        <div class="setup-form-grid setup-form-grid-2">
          ${renderField({ id: "mediaReferenceInput", name: "referenceAsset", label: "Reference asset if available", value: form.referenceAsset, helper: "Use an asset id, filename, or source note already known to the project." }, session, escapeHtml)}
          ${renderField({ id: "mediaTitleInput", name: "title", label: "Job title", value: form.title, helper: "Optional operator-facing queue title." }, session, escapeHtml)}
        </div>
        ${renderField({ id: "mediaReviewNotesInput", name: "reviewNotes", label: "Review notes", value: form.reviewNotes, multiline: true, rows: 3, errorKey: "reviewNotes" }, session, escapeHtml)}
      </form>
      <div class="media-action-row">
        <button id="mediaGeneratePromptBtn" class="btn btn-secondary" type="button">Generate Prompt From Context</button>
        <button id="mediaRunGenerationBtn" class="btn btn-secondary" type="button">Generate Output</button>
        <button id="mediaSaveBtn" class="btn btn-primary" type="button">Save Draft</button>
      </div>
      ${session.draftMessage ? `<div class="simple-banner">${escapeHtml(session.draftMessage)}</div>` : ""}
    </section>
  `;
}

function renderPromptBuilder(session, handoff, escapeHtml) {
  return `
    <section class="card media-card">
      <div class="card-head">
        <div>
          <div class="setup-kicker">Smart Prompt Intelligence</div>
          <h3>Prompt operations and format conversion</h3>
        </div>
        <span class="card-badge neutral">${escapeHtml(handoff ? "Handoff available" : "Context")}</span>
      </div>
      <div class="media-action-row">
        <button id="mediaPromptFromContextBtn" class="btn btn-secondary" type="button">Generate from project setup</button>
        <button id="mediaPromptFromHandoffBtn" class="btn btn-secondary" type="button">Generate from workflow handoff</button>
        <button id="mediaImprovePromptBtn" class="btn btn-secondary" type="button">Improve prompt</button>
        <button id="mediaBrandSafePromptBtn" class="btn btn-secondary" type="button">Make brand-safe</button>
        <button id="mediaGermanPromptBtn" class="btn btn-secondary" type="button">Adapt to German market</button>
        <button id="mediaImageToVideoBtn" class="btn btn-secondary" type="button">Convert image prompt to video brief</button>
        <button id="mediaVideoToVoiceBtn" class="btn btn-secondary" type="button">Convert video brief to voiceover</button>
        <button id="mediaGenerateAllFormatsBtn" class="btn btn-secondary" type="button">Generate all formats</button>
        <button id="mediaSavePromptBtn" class="btn btn-primary" type="button">Save prompt draft</button>
      </div>
    </section>
  `;
}

function renderWorkflowHandoff(handoff, session, escapeHtml) {
  if (!handoff) {
    return `
      <section class="card media-card">
        <div class="card-head">
          <div>
            <div class="setup-kicker">Inbound Media Brief</div>
            <h3>No inbound media brief available</h3>
          </div>
          <span class="card-badge neutral">Empty</span>
        </div>
        <div class="empty-box">Route content, workflow, or AI context into Media Studio to load a media brief here.</div>
      </section>
    `;
  }

  const summary = extractHandoffSummary(handoff);
  const loaded = summary.id && summary.id === session.loadedHandoffId;
  const isContentBrief = summary.sourcePage === "content-studio";
  const kicker = isContentBrief ? "Inbound Content Brief" : "Inbound Media Brief";
  const buttonLabel = isContentBrief ? "Load Content Design Brief" : "Load Media Brief";
  const fallbackCopy = isContentBrief
    ? "Content Studio output is ready to become a design brief."
    : "Handoff output is ready to become a media brief.";

  return `
    <section class="card media-card" id="mediaWorkflowHandoff">
      <div class="card-head">
        <div>
          <div class="setup-kicker">${escapeHtml(kicker)}</div>
          <h3>${escapeHtml(summary.title)}</h3>
          <p class="media-section-copy">${escapeHtml(summary.brief || summary.prompt || fallbackCopy)}</p>
        </div>
        <span class="card-badge ${loaded ? "success" : "neutral"}">${escapeHtml(loaded ? "Loaded" : "Available")}</span>
      </div>
      <div class="data-stack">
        <div class="data-row"><span>Source</span><strong>${escapeHtml(titleCase(summary.sourcePage))}</strong></div>
        <div class="data-row"><span>Campaign</span><strong>${escapeHtml(summary.campaign || "Not specified")}</strong></div>
        <div class="data-row"><span>Product</span><strong>${escapeHtml(summary.product || "Not specified")}</strong></div>
        <div class="data-row"><span>Channel</span><strong>${escapeHtml(summary.channel || "Not specified")}</strong></div>
        ${summary.contentType ? `<div class="data-row"><span>Content type</span><strong>${escapeHtml(titleCase(summary.contentType))}</strong></div>` : ""}
        ${summary.language ? `<div class="data-row"><span>Language</span><strong>${escapeHtml(summary.language)}</strong></div>` : ""}
        ${summary.tone ? `<div class="data-row"><span>Tone</span><strong>${escapeHtml(summary.tone)}</strong></div>` : ""}
      </div>
      <div class="media-action-row">
        <button id="mediaLoadHandoffBtn" class="btn btn-secondary" type="button">${escapeHtml(buttonLabel)}</button>
      </div>
    </section>
  `;
}

function renderQueue(session, escapeHtml) {
  if (!session.items.length) {
    return `
      <section class="card media-card" id="mediaQueuePanel">
        <div class="card-head">
          <div>
            <div class="setup-kicker">Media Job Queue</div>
            <h3>No media jobs yet</h3>
          </div>
          <span class="card-badge neutral">Empty</span>
        </div>
        <div class="empty-box">Start a media job or load a workflow handoff to create the first prompt-ready draft.</div>
      </section>
    `;
  }

  return `
    <section class="card media-card" id="mediaQueuePanel">
      <div class="card-head">
        <div>
          <div class="setup-kicker">Media Job Queue</div>
          <h3>Production queue</h3>
        </div>
        <span class="card-badge neutral">${escapeHtml(formatCount(session.items.length))} visible</span>
      </div>
      <div class="media-queue-list">
        ${session.items.map((item) => `
          <article class="media-queue-row${item.id === session.selectedId ? " is-active" : ""}">
            <button class="media-queue-main" type="button" data-media-select="${escapeHtml(item.id)}">
              <span class="media-queue-title">${escapeHtml(item.title)}</span>
              <span class="media-queue-meta">${escapeHtml(titleCase(item.mode))} • ${escapeHtml(item.channel || "channel")} • ${escapeHtml(item.format || "format")} • ${escapeHtml(item.source)}</span>
            </button>
            <div>${renderStatusPill(item.status, escapeHtml)}</div>
            <div class="media-queue-actions">
              <button type="button" data-media-action="preview" data-media-id="${escapeHtml(item.id)}">Preview</button>
              <button type="button" data-media-action="edit-prompt" data-media-id="${escapeHtml(item.id)}">Edit prompt</button>
              <button type="button" data-media-action="approve" data-media-id="${escapeHtml(item.id)}">Mark Review Ready</button>
              <button type="button" data-media-action="regenerate" data-media-id="${escapeHtml(item.id)}">Regenerate</button>
              <button type="button" data-media-action="send-publishing" data-media-id="${escapeHtml(item.id)}">Prepare Publishing Package</button>
              <button type="button" data-media-action="save-draft" data-media-id="${escapeHtml(item.id)}">Save draft</button>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function getVersionReadiness(version, session, selectedItem) {
  const current = asObject(version);
  const payload = asObject(current.output_payload);
  const readinessStatus = normalizeStatus(current.readiness_status || session.form.status || selectedItem?.status || "draft", "draft");
  const brandCheck = asObject(payload.brand_check);
  const isBrandSafe = brandCheck.is_brand_safe === true || /brand-safe|brand safe/i.test(current.prompt || "");
  const hasChannelFit = Boolean(clean(session.form.channel || selectedItem?.channel));
  const hasFormatFit = Boolean(clean(session.form.format || selectedItem?.format));
  const hasOutput = Boolean(
    clean(payload.url) ||
    clean(payload.image_url) ||
    clean(payload.video_url) ||
    clean(payload.audio_url) ||
    asArray(payload.images).length ||
    asArray(payload.videos).length ||
    clean(payload.video_brief) ||
    clean(payload.voice_script) ||
    asObject(payload.campaign_pack).image_prompt ||
    asObject(payload.campaign_pack).video_brief ||
    asObject(payload.campaign_pack).voice_script ||
    clean(payload.message)
  );
  const publishingReady = ["publishing_ready", "sent_to_publishing", "approved"].includes(readinessStatus) && hasOutput;
  const approvalStatus = ["approved", "publishing_ready", "sent_to_publishing"].includes(readinessStatus) ? "approved" : "pending";

  const checklist = [
    ["brand safe", isBrandSafe],
    ["channel fit", hasChannelFit],
    ["format fit", hasFormatFit],
    ["package ready", publishingReady],
    ["review state", approvalStatus === "approved"]
  ];

  const missingItems = checklist.filter(([, value]) => !value).map(([label]) => label);
  return {
    readinessStatus,
    approvalStatus,
    checklist,
    missingItems
  };
}

function checklistValue(item, key) {
  if (!item) return "Needs job";
  if (key === "brand-colors") return item.brandStyle ? "Review" : "Missing";
  if (key === "logo-fit") return item.brandStyle || item.referenceAsset ? "Review" : "Missing";
  if (key === "product-visibility") return item.prompt || item.objective ? "Review" : "Missing";
  if (key === "platform-format") return item.channel && item.format ? "Ready" : "Missing";
  if (key === "safe-text-area") return item.prompt ? "Review" : "Missing";
  if (key === "german-tone") return /german|deutsch/i.test(item.prompt || "") ? "Review" : "Prepare";
  if (key === "publishing-readiness") return item.status === "publishing_ready" || item.status === "sent_to_publishing" ? "Ready" : "Prepare";
  return "Review";
}

function renderOutputReadinessPanel(session, selectedItem, escapeHtml) {
  const version = selectedVersionEntry(session);
  const readiness = getVersionReadiness(version, session, selectedItem);
  const activeStatus = readiness.readinessStatus;
  return `
    <section class="card media-card" id="mediaOutputReadinessPanel">
      <div class="card-head">
        <div>
          <div class="setup-kicker">Output Readiness State</div>
          <h3>Generation and package readiness lifecycle</h3>
        </div>
        <span class="card-badge ${statusTone(activeStatus)}">${escapeHtml(displayMediaStatusLabel(activeStatus))}</span>
      </div>
      <div class="media-readiness-grid">
        ${readiness.checklist.map(([label, ready]) => `
          <div class="media-check-item">
            <span>${escapeHtml(label)}</span>
            <strong>${escapeHtml(ready ? "Ready" : "Missing")}</strong>
          </div>
        `).join("")}
        <div class="media-check-item">
          <span>Review state</span>
          <strong>${escapeHtml(readiness.approvalStatus === "approved" ? "Review Ready" : "Pending")}</strong>
        </div>
        <div class="media-check-item">
          <span>Missing items</span>
          <strong>${escapeHtml(readiness.missingItems.length ? readiness.missingItems.join(", ") : "None")}</strong>
        </div>
        ${MEDIA_PREVIEW_STATES.map((status) => `
          <div class="media-check-item">
            <span>${escapeHtml(status === activeStatus ? "Selected version state" : "Available state")}</span>
            <strong>${escapeHtml(displayMediaStatusLabel(status))}</strong>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function parseStructuredList(text, fallbackPrefix = "-") {
  const lines = asString(text).split(/\n+/).map((line) => clean(line)).filter(Boolean);
  const list = lines.filter((line) => /^[-*]|^\d+\./.test(line));
  if (list.length) return list;
  return lines.length ? lines.map((line) => `${fallbackPrefix} ${line}`) : [];
}

function normalizeMediaUrl(url, allowDataImage = false) {
  const value = clean(url);
  if (!value) return "";
  if (allowDataImage && /^data:image\//i.test(value)) return value;
  if (/^blob:/i.test(value)) return value;
  if (/^https?:\/\//i.test(value)) return value;
  return "";
}

function resolvePreviewMedia(payload) {
  const root = asObject(payload);
  const firstImage = asObject(asArray(root.images)[0]);
  const firstVideo = asObject(asArray(root.videos)[0]);
  const audioObject = asObject(root.audio);

  const imageUrl = firstText(
    normalizeMediaUrl(root.url, true),
    normalizeMediaUrl(root.image_url, true),
    normalizeMediaUrl(firstImage.url, true),
    clean(firstImage.b64_json) ? `data:image/png;base64,${clean(firstImage.b64_json)}` : ""
  );

  const videoUrl = firstText(
    normalizeMediaUrl(root.video_url),
    normalizeMediaUrl(firstVideo.url),
    normalizeMediaUrl(asObject(root.video).url),
    normalizeMediaUrl(asObject(root.asset).video_url)
  );

  const audioUrl = firstText(
    normalizeMediaUrl(root.audio_url),
    normalizeMediaUrl(audioObject.url),
    normalizeMediaUrl(asObject(root.voice).audio_url),
    normalizeMediaUrl(asObject(root.asset).audio_url)
  );

  let detectedType = "text-brief";
  if (videoUrl) {
    detectedType = "video";
  } else if (audioUrl) {
    detectedType = "audio";
  } else if (imageUrl) {
    detectedType = "image";
  }

  return {
    detectedType,
    imageUrl,
    videoUrl,
    audioUrl
  };
}

function renderOutputPreviewPanel(session, selectedItem, escapeHtml) {
  const version = selectedVersionEntry(session);
  if (!version) {
    return `
      <section class="card media-card" id="mediaOutputPreviewPanel">
        <div class="card-head">
          <div>
            <div class="setup-kicker">Output Preview</div>
            <h3>No selected version yet</h3>
          </div>
          <span class="card-badge neutral">Empty</span>
        </div>
      </section>
    `;
  }

  const payload = asObject(version.output_payload);
  const mode = asString(version.mode || selectedItem?.mode || session.form.mode || "image");
  const stateLabel = asString(version.provider_status || "prompt_ready");
  const mediaPreview = resolvePreviewMedia(payload);
  const videoBrief = asString(payload.video_brief);
  const voiceScript = asString(payload.voice_script);
  const campaignPack = asObject(payload.campaign_pack);

  let previewBody = `<div class="media-prompt-box">${escapeHtml("Prompt-ready state. Generate output or switch version to inspect payload.")}</div>`;

  if (mode === "image") {
    previewBody = mediaPreview.imageUrl
      ? `
        <div class="media-viewer-frame">
          <a class="media-viewer-image-link" href="${escapeHtml(mediaPreview.imageUrl)}" target="_blank" rel="noopener noreferrer">
            <img class="media-viewer-image" alt="Generated media preview" src="${escapeHtml(mediaPreview.imageUrl)}">
          </a>
          <div class="media-viewer-hint">Tap/click image to expand.</div>
        </div>
      `
      : `<div class="media-prompt-box">${escapeHtml(JSON.stringify(payload, null, 2) || "No image output was returned yet. If the provider is not connected or timed out, keep the prompt/job-ready draft and continue with review, Library save, or provider setup in Integrations.")}</div>`;
  }

  if (mode === "video") {
    if (mediaPreview.videoUrl) {
      previewBody = `
        <div class="media-viewer-frame">
          <video class="media-viewer-video" controls preload="metadata" src="${escapeHtml(mediaPreview.videoUrl)}"></video>
        </div>
      `;
    } else {
      const lines = parseStructuredList(videoBrief || asString(payload.message));
      previewBody = lines.length
        ? `<div class="media-prompt-box">${escapeHtml(lines.join("\n"))}</div>`
        : `<div class="media-prompt-box">${escapeHtml("No video output or video brief is available yet. Generate or prepare a video brief first; provider-backed video output appears here only when the backend returns a video URL.")}</div>`;
    }
  }

  if (mode === "voice") {
    if (mediaPreview.audioUrl) {
      previewBody = `
        <div class="media-viewer-frame">
          <audio class="media-viewer-audio" controls preload="metadata" src="${escapeHtml(mediaPreview.audioUrl)}"></audio>
        </div>
      `;
    } else {
      const tone = firstText(payload.tone, session.form.brandStyle, "Not specified");
      const language = firstText(payload.language, "Not specified");
      const pacing = firstText(payload.pacing, "Not specified");
      const duration = firstText(payload.duration, "Not specified");
      previewBody = `
        <div class="media-readiness-grid">
          <div class="media-check-item"><span>Voice tone</span><strong>${escapeHtml(tone)}</strong></div>
          <div class="media-check-item"><span>Language</span><strong>${escapeHtml(language)}</strong></div>
          <div class="media-check-item"><span>Pacing</span><strong>${escapeHtml(pacing)}</strong></div>
          <div class="media-check-item"><span>Duration</span><strong>${escapeHtml(duration)}</strong></div>
        </div>
        <div class="media-prompt-box media-block-gap">${escapeHtml(voiceScript || asString(payload.message) || "No voice script or audio output is available yet. Voice mode prepares voiceover scripts/audio outputs only; it does not run IVR, phone calls, or call-center workflows.")}</div>
      `;
    }
  }

  if (mode === "campaign-pack") {
    previewBody = `
      <div class="media-readiness-grid">
        <div class="media-check-item"><span>Image prompt</span><strong>${escapeHtml(firstText(campaignPack.image_prompt, "Missing"))}</strong></div>
        <div class="media-check-item"><span>Video brief</span><strong>${escapeHtml(firstText(campaignPack.video_brief, "Missing"))}</strong></div>
        <div class="media-check-item"><span>Voice script</span><strong>${escapeHtml(firstText(campaignPack.voice_script, "Missing"))}</strong></div>
        <div class="media-check-item"><span>Captions/notes</span><strong>${escapeHtml(firstText(campaignPack.channel_notes, campaignPack.publishing_notes, "Missing"))}</strong></div>
      </div>
      <div class="media-prompt-box media-block-gap">${escapeHtml(JSON.stringify(campaignPack, null, 2) || "Campaign pack payload is not available yet.")}</div>
    `;
  }

  return `
    <section class="card media-card" id="mediaOutputPreviewPanel">
      <div class="card-head">
        <div>
          <div class="setup-kicker">Output Preview</div>
          <h3>${escapeHtml(titleCase(mode))} output</h3>
          <p class="media-section-copy">${escapeHtml(firstText(payload.message, `Detected output type: ${mediaPreview.detectedType}.`))}</p>
        </div>
        <span class="card-badge ${statusTone(normalizeStatus(version.readiness_status || selectedItem?.status || "draft", "draft"))}">${escapeHtml(titleCase(stateLabel))}</span>
      </div>
      ${previewBody}
    </section>
  `;
}

function renderVersioningPanel(session, escapeHtml) {
  const versioning = ensureVersioning(session);
  const selected = selectedVersionEntry(session);
  const previous = previousVersionEntry(session);
  const comparePromptChanged = Boolean(previous && clean(previous.prompt) !== clean(selected?.prompt));
  const compareStatusChanged = Boolean(previous && clean(previous.readiness_status) !== clean(selected?.readiness_status));
  const compareNotesChanged = Boolean(previous && clean(previous.notes) !== clean(selected?.notes));

  return `
    <section class="card media-card" id="mediaVersioningPanel">
      <div class="card-head">
        <div>
          <div class="setup-kicker">Versioning</div>
          <h3>Prompt versions and decision controls</h3>
        </div>
        <span class="card-badge neutral">${escapeHtml(selected?.id ? `${titleCase(selected.id)} selected` : "No version")}</span>
      </div>
      <div class="media-version-tabs">
        ${asArray(versioning.versions).map((entry) => `
          <button class="media-version-tab${selected?.id === entry.id ? " is-active" : ""}" type="button" data-media-version="${escapeHtml(entry.id)}">${escapeHtml(titleCase(entry.id))}</button>
        `).join("")}
      </div>
      <div class="media-version-grid media-block-gap">
        <div class="media-check-item">
          <span>Selected version</span>
          <strong>${escapeHtml(selected?.id ? titleCase(selected.id) : "None")}</strong>
        </div>
        <div class="media-check-item">
          <span>Timestamp</span>
          <strong>${escapeHtml(formatDateTime(selected?.timestamp || ""))}</strong>
        </div>
        <div class="media-check-item">
          <span>Mode</span>
          <strong>${escapeHtml(titleCase(selected?.mode || session.mode || "image"))}</strong>
        </div>
        <div class="media-check-item">
          <span>Provider</span>
          <strong>${escapeHtml(firstText(selected?.provider, "Not set"))}</strong>
        </div>
        <div class="media-check-item">
          <span>Provider status</span>
          <strong>${escapeHtml(titleCase(firstText(selected?.provider_status, "prompt_ready")))}</strong>
        </div>
        <div class="media-check-item">
          <span>Readiness status</span>
          <strong>${escapeHtml(titleCase(firstText(selected?.readiness_status, "draft")))}</strong>
        </div>
        <div class="media-check-item">
          <span>Prompt length</span>
          <strong>${escapeHtml(formatCount(clean(selected?.prompt).length))} chars</strong>
        </div>
        <div class="media-check-item">
          <span>Library link</span>
          <strong>${escapeHtml(selected?.library_asset_ref?.handoff_id ? `Saved (${selected.library_asset_ref.local_only ? "Local" : "Backend"})` : "Not saved")}</strong>
        </div>
      </div>
      <div class="setup-field-group media-block-gap">
        <div class="setup-field-head">
          <label class="setup-label" for="mediaVersionCompareNotes">Compare notes</label>
        </div>
        <textarea id="mediaVersionCompareNotes" class="setup-input setup-textarea" rows="3">${escapeHtml(versioning.compareNotes || "")}</textarea>
      </div>
      <div class="media-action-row">
        <button class="btn btn-secondary" type="button" data-media-version-action="compare-toggle">${escapeHtml(versioning.compareMode ? "Hide Compare" : "Compare with previous")}</button>
      </div>
      ${versioning.compareMode ? `
        <div class="media-version-grid media-block-gap">
          <div class="media-check-item">
            <span>Current version</span>
            <strong>${escapeHtml(selected?.id ? `${titleCase(selected.id)} (${titleCase(selected.readiness_status || "draft")})` : "None")}</strong>
          </div>
          <div class="media-check-item">
            <span>Previous version</span>
            <strong>${escapeHtml(previous?.id ? `${titleCase(previous.id)} (${titleCase(previous.readiness_status || "draft")})` : "No previous version")}</strong>
          </div>
          <div class="media-check-item">
            <span>Prompt difference</span>
            <strong>${escapeHtml(previous ? (comparePromptChanged ? "Changed" : "Unchanged") : "N/A")}</strong>
          </div>
          <div class="media-check-item">
            <span>Readiness difference</span>
            <strong>${escapeHtml(previous ? (compareStatusChanged ? "Changed" : "Unchanged") : "N/A")}</strong>
          </div>
          <div class="media-check-item">
            <span>Notes difference</span>
            <strong>${escapeHtml(previous ? (compareNotesChanged ? "Changed" : "Unchanged") : "N/A")}</strong>
          </div>
        </div>
      ` : ""}
      <div class="media-action-row">
        <button class="btn btn-secondary" type="button" data-media-version-action="approve">Mark Review Ready</button>
        <button class="btn btn-secondary" type="button" data-media-version-action="reject">Reject</button>
        <button class="btn btn-secondary" type="button" data-media-version-action="regenerate">Regenerate</button>
        <button class="btn btn-secondary" type="button" data-media-version-action="save-draft">Save as draft</button>
        <button class="btn btn-secondary" type="button" data-media-version-action="save-library">Save to Library</button>
        <button class="btn btn-primary" type="button" data-media-version-action="send-publishing">Prepare Publishing Package</button>
      </div>
      ${fieldError(session, "librarySave", escapeHtml)}
    </section>
  `;
}

function renderReviewPanel(session, selectedItem, escapeHtml) {
  const version = selectedVersionEntry(session);
  const activePrompt = clean(version?.prompt);
  const activeNotes = clean(version?.notes);
  const notesText = activeNotes || selectedItem?.reviewNotes || asArray(selectedItem?.comments)[0]?.text || "No review notes yet.";
  const prompt = activePrompt || selectedItem?.prompt || selectedItem?.brief || "Select or save a media job to preview the prompt, brief, and asset notes.";
  const checklist = [
    ["brand-colors", "Brand colors"],
    ["logo-fit", "Logo fit"],
    ["product-visibility", "Product visibility"],
    ["platform-format", "Platform format"],
    ["safe-text-area", "Safe text area"],
    ["german-tone", "German tone"],
    ["publishing-readiness", "Publishing readiness"]
  ];

  return `
    <section class="card media-card" id="mediaReviewPanel">
      <div class="card-head">
        <div>
          <div class="setup-kicker">Asset Preview / Brand Safety Checklist</div>
          <h3>${escapeHtml(selectedItem?.title || "No selected media job")}</h3>
        </div>
        <span class="card-badge ${statusTone(normalizeStatus(version?.readiness_status || selectedItem?.status || "draft", "draft"))}">${escapeHtml(displayMediaStatusLabel(version?.readiness_status || selectedItem?.status || "draft"))}</span>
      </div>
      <span class="media-preview-title">${escapeHtml(selectedItem ? `${titleCase(selectedItem.mode)} preview / prompt` : "Preview")}</span>
      <div class="media-prompt-box">${escapeHtml(prompt)}</div>
      <div class="media-check-grid media-block-gap">
        ${checklist.map(([key, label]) => `
          <div class="media-check-item">
            <span>${escapeHtml(label)}</span>
            <strong>${escapeHtml(checklistValue(selectedItem, key))}</strong>
          </div>
        `).join("")}
      </div>
      <div class="media-prompt-box media-block-gap">${escapeHtml(notesText)}</div>
      <div class="media-action-row">
        <button id="mediaApproveBtn" class="btn btn-secondary" type="button">Mark Review Ready</button>
        <button id="mediaRequestApprovalBtn" class="btn btn-secondary" type="button">Request Approval</button>
        <button id="mediaRejectBtn" class="btn btn-secondary" type="button">Reject</button>
        <button id="mediaCreateTaskBtn" class="btn btn-secondary" type="button">Create Task</button>
      </div>
    </section>
  `;
}

function getRecommendedSpecialistId(session = {}, selectedItem = null) {
  const mode = String(session?.mode || session?.selectedMode || selectedItem?.mode || "").toLowerCase();
  const status = String(selectedItem?.status || selectedItem?.review_status || "").toLowerCase();

  if (mode.includes("video") || mode.includes("reel") || mode.includes("storyboard")) return "video-strategist";
  if (mode.includes("voice") || mode.includes("audio")) return "voice-director";
  if (mode.includes("campaign") || mode.includes("pack")) return "prompt-engineer";
  if (status.includes("ready") || status.includes("review")) return "brand-guardian";
  if (mode.includes("publish") || mode.includes("handoff")) return "publishing-assistant";
  return "visual-director";
}

function renderSpecialistCard(specialist, escapeHtml, { primary = false } = {}) {
  if (!specialist) return "";

  return `
    <article class="media-specialist-card ${primary ? "media-specialist-primary" : "media-specialist-secondary"}">
      <div>
        <p class="card-label">${primary ? "Recommended specialist" : "Specialist"}</p>
        <h4>${escapeHtml(specialist.label || specialist.name || "Media specialist")}</h4>
        <p>${escapeHtml(specialist.description || specialist.summary || "Use this specialist to improve the media brief.")}</p>
      </div>
      <div class="media-specialist-actions">
        <button class="btn btn-secondary" type="button" data-media-specialist-use="${escapeHtml(specialist.id)}">Apply to Brief</button>
        <button class="btn btn-secondary" type="button" data-media-specialist-save="${escapeHtml(specialist.id)}">Save Draft</button>
        <button class="btn btn-secondary" type="button" data-media-specialist-ai="${escapeHtml(specialist.id)}">Open AI Command Review</button>
      </div>
    </article>
  `;
}

function renderSpecialists(session = {}, selectedItem = null, escapeHtml) {
  const specialists = Array.isArray(SPECIALISTS) ? SPECIALISTS : [];
  if (!specialists.length) return "";

  const recommendedId = getRecommendedSpecialistId(session, selectedItem);
  const recommended = specialists.find((specialist) => specialist.id === recommendedId) || specialists[0];
  const others = specialists.filter((specialist) => specialist.id !== recommended.id);

  return `
    <section class="card media-card media-specialists-compact" aria-label="AI media specialists">
      <div class="card-head">
        <div>
          <p class="card-label">AI Agent Support</p>
          <h3>Specialist guidance</h3>
        </div>
        <span class="status-pill is-info">Contextual</span>
      </div>
      ${renderSpecialistCard(recommended, escapeHtml, { primary: true })}
      ${others.length ? `
        <details class="media-specialists-more">
          <summary>More specialists</summary>
          <div class="media-specialists-secondary-list">
            ${others.map((specialist) => renderSpecialistCard(specialist, escapeHtml, { primary: false })).join("")}
          </div>
        </details>
      ` : ""}
    </section>
  `;
}

function renderAssetGate(state, escapeHtml) {
  const assetData = getAssetData(state);
  return `
    <section class="card media-card">
      <div class="card-head">
        <div>
          <div class="setup-kicker">Brand-Safe Assets</div>
          <h3>Library inputs</h3>
        </div>
        <span class="card-badge neutral">Source assets</span>
      </div>
      ${renderAssetDependencyRows(assetData, MEDIA_ASSET_KEYS, escapeHtml, "Media library inputs are covered.")}
      <div class="simple-banner media-block-gap">${escapeHtml(getAssetNextAction(assetData, MEDIA_ASSET_KEYS))}</div>
    </section>
  `;
}

function renderApiReadiness(session, backendProjectName, escapeHtml) {
  const readiness = getApiReadiness(session, backendProjectName);
  const items = [
    ["image generation backend", readiness.image_generation_backend],
    ["video generation backend", readiness.video_generation_backend],
    ["voice generation backend", readiness.voice_generation_backend],
    ["publishing handoff", readiness.publishing_handoff],
    ["approval backend", readiness.approval_backend]
  ];
  return `
    <section class="card media-card" id="mediaApiReadinessPanel">
      <div class="card-head">
        <div>
          <div class="setup-kicker">API Readiness</div>
          <h3>Generation and workflow connectivity</h3>
        </div>
        <span class="card-badge ${readiness.hasBackend ? "success" : "warning"}">${escapeHtml(readiness.hasBackend ? "Backend project linked" : "Fallback/derived")}</span>
      </div>
      <div class="media-api-grid">
        ${items.map(([label, connected]) => `
          <div class="media-api-item">
            <span>${escapeHtml(label)}</span>
            <strong>${escapeHtml(connected ? "Available" : "Not connected")}</strong>
          </div>
        `).join("")}
      </div>
      ${!readiness.image_generation_backend || !readiness.video_generation_backend || !readiness.voice_generation_backend ? `<div class="simple-banner media-block-gap">${escapeHtml("Generator backend not connected yet — your prompt/job is ready. Review it, save it as a draft, send it to AI Command, save it to Library, or connect a provider in Integrations before trying real output generation.")}</div>` : ""}
    </section>
  `;
}

function buildAiPrompt(projectName, session, selectedItem) {
  return [
    `Review this Media Studio job for ${projectName}.`,
    `Mode: ${titleCase(session.form.mode || selectedItem?.mode || "media")}`,
    `Project: ${session.form.project || selectedItem?.project || "not set"}`,
    `Campaign: ${session.form.campaign || selectedItem?.campaign || "not set"}`,
    `Product: ${session.form.product || selectedItem?.product || "not set"}`,
    `Channel: ${session.form.channel || selectedItem?.channel || "not set"}`,
    `Format: ${session.form.format || selectedItem?.format || "not set"}`,
    `Output purpose: ${session.form.outputPurpose || selectedItem?.outputPurpose || "not set"}`,
    `Prompt: ${session.form.prompt || selectedItem?.prompt || "not set"}`,
    `Review notes: ${session.form.reviewNotes || selectedItem?.reviewNotes || "none"}`
  ].join("\n");
}

function buildPublishingHandoff(projectName, session, selectedItem) {
  const source = selectedItem || normalizeMediaItem(buildMediaPayload(session, "publishing_ready"), { context: {} }, "Local draft");
  const version = selectedVersionEntry(session);
  const readiness = getVersionReadiness(version, session, source);
  return {
    source_page: "media-studio",
    destination_page: "publishing",
    source_role: source.owner_role || ownerRoleForMode(source.mode),
    destination_role: MEDIA_ROLE_DEFAULTS.handoffRole,
    source_service_domain: MEDIA_ROLE_DEFAULTS.serviceDomain,
    destination_service_domain: "publishing",
    linked_entity: {
      entity_type: "media_job",
      entity_id: source.id || session.formSourceId || "",
      route: "media-studio",
      label: source.title || session.form.title || "Media job"
    },
    payload: {
      project: source.project || session.form.project || projectName,
      campaign: source.campaign || session.form.campaign,
      channel: source.channel || session.form.channel,
      media_type: source.mode || session.form.mode,
      media_job_id: source.id || session.formSourceId || "",
      prompt: source.prompt || session.form.prompt,
      asset_reference: source.referenceAsset || session.form.referenceAsset,
      readiness_status: readiness.readinessStatus,
      version_id: version?.id || "",
      title: source.title || session.form.title || "Media handoff",
      selected_version: {
        version_id: version?.id || "",
        mode: version?.mode || source.mode || session.form.mode || "image",
        prompt: version?.prompt || source.prompt || session.form.prompt,
        output_payload: version?.output_payload || null,
        library_asset_reference: version?.library_asset_ref || null,
        readiness_status: readiness.readinessStatus,
        provider_status: firstText(version?.provider_status, "prompt_ready"),
        brand_checklist: readiness.checklist.map(([label, ready]) => ({ label, ready })),
        notes: firstText(version?.notes, session.form.reviewNotes, source.reviewNotes),
        timestamp: version?.timestamp || nowIso()
      },
      output: {
        title: source.title || session.form.title || "Media handoff",
        summary: source.brief || session.form.objective || version?.prompt || source.prompt || session.form.prompt,
        channel: source.channel || session.form.channel,
        product: source.product || session.form.product,
        content_item: version?.prompt || source.prompt || session.form.prompt
      }
    },
    status: "available",
    actor: "media-studio"
  };
}

async function persistMediaJob({ backendProjectName, projectName, state, session, status, showMessage }) {
  const localItem = saveDraftToSession(projectName, state, session, status);
  if (!backendProjectName) {
    showMessage?.("Media draft saved locally.");
    return localItem;
  }

  try {
    const result = await saveProjectMediaJob(backendProjectName, buildMediaPayload(session, status));
    const saved = normalizeMediaItem(result.media_job || result.item || buildMediaPayload(session, status), state);
    session.items = mergeQueueItems(session.items.filter((item) => item.id !== localItem.id), [saved]);
    session.selectedId = saved.id || localItem.id;
    session.formSourceId = session.selectedId;
    showMessage?.("Media job saved.");
    return saved;
  } catch (_) {
    showMessage?.("Backend media save unavailable; draft kept locally.");
    return localItem;
  }
}

function bindMediaStudio({
  projectName,
  backendProjectName,
  state,
  session,
  handoff,
  navigateTo,
  showMessage,
  showError,
  rerender
}) {
  const form = document.getElementById("mediaGeneratorForm");

  function selected() {
    return getSelectedItem(session);
  }

  function sync() {
    syncSessionForm(session, form);
  }

  function applyPrompt(value, message) {
    session.form.prompt = value;
    syncVersionFromForm(session);
    session.validation = {};
    session.draftMessage = message || "";
    rerender();
  }

  function confirmMediaAuthorityAction(title, detail) {
    return window.confirm(`${title}\n\n${detail}\n\nAuthority: Media Studio can prepare, save, request review, and hand off media work, but provider generation, approval decisions, task creation, and publishing handoff must be explicitly confirmed by the operator.\n\nSelect Cancel to review before continuing.`);
  }

  function generationApiForMode(mode) {
    if (mode === "video") return generateMediaVideoBrief;
    if (mode === "audio") return generateMediaVoiceScript;
    if (mode === "multi_format") return generateMediaCampaignPack;
    return generateMediaImage;
  }

  async function runGenerationAction() {
    sync();
    if (!validateGenerator(session, "save")) {
      rerender();
      return;
    }

    const promptUsed = clean(session.form.prompt);
    const selectedMode = session.form.mode || session.mode || "image";
    const activeRequestType = requestTypeForMode(selectedMode);

    const confirmed = confirmMediaAuthorityAction(
      "Confirm media generation",
      `Action: Start provider-backed media generation for ${selectedMode}.\nRisk: This may call a configured AI/media provider and create a new generated output that must be reviewed before approval or publishing.`
    );
    if (!confirmed) {
      session.draftMessage = "Media generation cancelled. Prompt remains ready for review.";
      rerender();
      return;
    }

    session.form.status = "generating";
    session.validation = {};
    saveDraftToSession(projectName, state, session, "generating");
    rerender();

    const callApi = generationApiForMode(activeRequestType);

    try {
      const response = await callApi(buildGenerationRequestPayload(session));

      if (response && response.ok === false && response.status === "provider_not_configured") {
        session.form.status = "prompt_ready";
        appendVersion(session, {
          mode: selectedMode,
          prompt: promptUsed,
          outputPayload: response,
          providerStatus: "provider_not_configured",
          readinessStatus: "prompt_ready",
          notes: firstText(response.message, "Generator backend not connected yet — your prompt/job is ready. Review it, save it as a draft, send it to AI Command, save it to Library, or connect a provider in Integrations before trying real output generation."),
          provider: response.provider || "",
          model: response.model || ""
        });
        syncOutputsFromVersioning(session);
        saveDraftToSession(projectName, state, session, "prompt_ready");
        session.draftMessage = response.message || "Generator backend not connected yet — your prompt/job is ready. Review it, save it as a draft, send it to AI Command, save it to Library, or connect a provider in Integrations before trying real output generation.";
        rerender();
        return;
      }

      const outputEntry = buildOutputVersionFromGeneration(activeRequestType, response || {});
      appendVersion(session, {
        mode: selectedMode,
        prompt: promptUsed,
        outputPayload: outputEntry.payload,
        providerStatus: "generated",
        readinessStatus: "needs_review",
        notes: firstText(response?.message, "Generation response captured."),
        provider: response?.provider || "",
        model: response?.model || ""
      });
      syncOutputsFromVersioning(session);

      if (response?.improved_prompt) {
        session.form.prompt = response.improved_prompt;
      }
      if (response?.video_brief) {
        session.form.reviewNotes = [session.form.reviewNotes, response.video_brief].filter(Boolean).join("\n\n").trim();
      }
      if (response?.voice_script) {
        session.form.reviewNotes = [session.form.reviewNotes, response.voice_script].filter(Boolean).join("\n\n").trim();
      }
      if (response?.campaign_pack) {
        const packText = JSON.stringify(response.campaign_pack, null, 2);
        session.form.reviewNotes = [session.form.reviewNotes, packText].filter(Boolean).join("\n\n").trim();
      }

      session.form.status = "needs_review";
      await persistMediaJob({
        backendProjectName,
        projectName,
        state,
        session,
        status: "needs_review",
        showMessage
      });
      session.draftMessage = "Generation completed and queued for review.";
      rerender();
    } catch (error) {
      const isAuthError = isAccessKeyFailure(error);
      const authMessage = mediaAccessKeyMessage(error);
      session.form.status = "prompt_ready";
      appendVersion(session, {
        mode: selectedMode,
        prompt: promptUsed,
        outputPayload: {
          message: isAuthError
            ? authMessage
            : firstText(error?.payload?.message, error?.message, "Generation failed."),
          error_code: isAuthError
            ? "access_key_required"
            : firstText(error?.payload?.code, error?.code, "generation_error")
        },
        providerStatus: "generation_error",
        readinessStatus: "failed",
        notes: isAuthError
          ? authMessage
          : firstText(error?.payload?.message, error?.message, "Generation failed."),
        provider: "",
        model: ""
      });
      syncOutputsFromVersioning(session);
      saveDraftToSession(projectName, state, session, "prompt_ready");
      if (isAuthError) {
        showError?.(MEDIA_ACCESS_KEY_GUIDANCE);
      }
      const payloadMessage = error?.payload?.message;
      session.draftMessage = isAuthError
        ? `${authMessage} Draft kept locally.`
        : payloadMessage || error?.message || "Generation failed. Draft kept locally.";
      rerender();
    }
  }

  if (form) {
    form.oninput = () => {
      sync();
      if (Object.keys(session.validation).length) {
        session.validation = {};
        rerender();
      }
    };
  }

  Array.from(document.querySelectorAll("[data-media-mode]")).forEach((button) => {
    button.onclick = () => {
      const mode = button.getAttribute("data-media-mode") || "image";
      resetForm(session, state, mode);
      rerender();
    };
  });

  Array.from(document.querySelectorAll("[data-media-select]")).forEach((button) => {
    button.onclick = () => {
      const item = session.items.find((entry) => entry.id === button.getAttribute("data-media-select"));
      if (item) {
        session.selectedId = item.id;
        syncFormFromItem(session, item);
      }
      rerender();
    };
  });

  const startBtn = document.getElementById("mediaStartJobBtn");
  if (startBtn) {
    startBtn.onclick = () => {
      resetForm(session, state, session.mode || "image");
      document.getElementById("mediaGeneratorPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
      showMessage?.("New media job draft opened.");
      rerender();
    };
  }

  const saveButtons = [document.getElementById("mediaSaveDraftBtn"), document.getElementById("mediaSaveBtn"), document.getElementById("mediaSavePromptBtn")].filter(Boolean);
  saveButtons.forEach((button) => {
    button.onclick = async () => {
      sync();
      if (!validateGenerator(session, "save")) {
        rerender();
        return;
      }
      await persistMediaJob({ backendProjectName, projectName, state, session, status: "prompt_ready", showMessage });
      rerender();
    };
  });

  const generateContextButtons = [document.getElementById("mediaGeneratePromptBtn"), document.getElementById("mediaPromptFromContextBtn")].filter(Boolean);
  generateContextButtons.forEach((button) => {
    button.onclick = () => {
      sync();
      applyPrompt(buildPromptFromContext(state, session), "Prompt generated from project context.");
    };
  });

  const fromHandoffBtn = document.getElementById("mediaPromptFromHandoffBtn");
  if (fromHandoffBtn) {
    fromHandoffBtn.onclick = () => {
      const summary = handoff ? extractHandoffSummary(handoff) : null;
      if (!summary) {
        session.draftMessage = "No workflow handoff is available.";
        rerender();
        return;
      }
      session.form.prompt = firstText(summary.prompt, summary.brief, session.form.prompt);
      session.form.campaign = firstText(summary.campaign, session.form.campaign);
      session.form.product = firstText(summary.product, session.form.product);
      session.form.channel = firstText(summary.channel, session.form.channel);
      session.form.objective = firstText(summary.objective, summary.brief, session.form.objective);
      session.draftMessage = "Prompt generated from workflow handoff.";
      rerender();
    };
  }

  const improveBtn = document.getElementById("mediaImprovePromptBtn");
  if (improveBtn) {
    improveBtn.onclick = async () => {
      sync();
      if (!clean(session.form.prompt)) {
        session.validation = { ...session.validation, prompt: "Prompt is required." };
        rerender();
        return;
      }
      const confirmed = confirmMediaAuthorityAction(
        "Confirm prompt improvement",
        "Action: Improve this prompt using the media prompt service.\nRisk: This may call a configured AI provider. The result remains review-only and is not published."
      );
      if (!confirmed) {
        session.draftMessage = "Prompt improvement cancelled.";
        rerender();
        return;
      }

      try {
        const result = await improveMediaPrompt(buildGenerationRequestPayload(session));
        if (result && result.ok === false && result.status === "provider_not_configured") {
          applyPrompt(improvePrompt(session.form.prompt), result.message || "Prompt improved locally.");
          return;
        }
        applyPrompt(result.improved_prompt || improvePrompt(session.form.prompt), "Prompt improved.");
      } catch (error) {
        if (isAccessKeyFailure(error)) {
          const authMessage = mediaAccessKeyMessage(error);
          showError?.(MEDIA_ACCESS_KEY_GUIDANCE);
          applyPrompt(improvePrompt(session.form.prompt), `${authMessage} Prompt improved locally.`);
          return;
        }

        applyPrompt(improvePrompt(session.form.prompt), "Prompt improved locally.");
      }
    };
  }

  const brandSafeBtn = document.getElementById("mediaBrandSafePromptBtn");
  if (brandSafeBtn) {
    brandSafeBtn.onclick = async () => {
      sync();
      if (!clean(session.form.prompt)) {
        session.validation = { ...session.validation, prompt: "Prompt is required." };
        rerender();
        return;
      }
      const confirmed = confirmMediaAuthorityAction(
        "Confirm brand safety check",
        "Action: Run media brand-safety review for this prompt.\nRisk: This may call a configured AI/provider service. The result remains review-only."
      );
      if (!confirmed) {
        session.draftMessage = "Brand safety check cancelled.";
        rerender();
        return;
      }

      try {
        const result = await brandCheckMedia(buildGenerationRequestPayload(session));
        if (result && result.ok === false && result.status === "provider_not_configured") {
          applyPrompt(makeBrandSafe(session.form.prompt), result.message || "Prompt made brand-safe locally.");
          return;
        }
        const safePrompt = result?.brand_check?.is_brand_safe ? session.form.prompt : makeBrandSafe(session.form.prompt);
        const message = result?.brand_check?.is_brand_safe
          ? "Prompt passed brand safety check."
          : "Prompt adjusted for brand safety.";
        applyPrompt(safePrompt, message);
      } catch (error) {
        if (isAccessKeyFailure(error)) {
          const authMessage = mediaAccessKeyMessage(error);
          showError?.(MEDIA_ACCESS_KEY_GUIDANCE);
          applyPrompt(makeBrandSafe(session.form.prompt), `${authMessage} Prompt made brand-safe locally.`);
          return;
        }

        applyPrompt(makeBrandSafe(session.form.prompt), "Prompt made brand-safe locally.");
      }
    };
  }

  const germanBtn = document.getElementById("mediaGermanPromptBtn");
  if (germanBtn) germanBtn.onclick = () => { sync(); applyPrompt(adaptGerman(session.form.prompt), "Prompt adapted for German usage."); };

  const imageToVideoBtn = document.getElementById("mediaImageToVideoBtn");
  if (imageToVideoBtn) imageToVideoBtn.onclick = () => { sync(); applyPrompt(convertImagePromptToVideoBrief(session.form.prompt), "Image prompt converted to video brief."); };

  const videoToVoiceBtn = document.getElementById("mediaVideoToVoiceBtn");
  if (videoToVoiceBtn) videoToVoiceBtn.onclick = () => { sync(); applyPrompt(convertVideoBriefToVoiceover(session.form.prompt), "Video brief converted to voiceover script."); };

  const allFormatsBtn = document.getElementById("mediaGenerateAllFormatsBtn");
  if (allFormatsBtn) allFormatsBtn.onclick = () => { sync(); applyPrompt(generateAllFormats(session, state), "All format briefs generated."); };

  const runGenerationBtn = document.getElementById("mediaRunGenerationBtn");
  if (runGenerationBtn) {
    runGenerationBtn.onclick = async () => {
      await runGenerationAction();
    };
  }

  const loadHandoffBtn = document.getElementById("mediaLoadHandoffBtn");
  if (loadHandoffBtn) {
    loadHandoffBtn.onclick = () => {
      const summary = extractHandoffSummary(handoff);
      session.form = {
        ...session.form,
        project: firstText(summary.project, session.form.project, projectName),
        campaign: firstText(summary.campaign, session.form.campaign),
        product: firstText(summary.product, session.form.product),
        channel: firstText(summary.channel, session.form.channel),
        objective: firstText(summary.objective, summary.brief, session.form.objective),
        prompt: firstText(summary.prompt, summary.brief, summary.copy, session.form.prompt),
        title: firstText(summary.title, session.form.title)
      };
      session.loadedHandoffId = summary.id;
      session.isCreatingNew = true;
      session.selectedId = "";
      session.formSourceId = "";
      session.draftMessage = summary.sourcePage === "content-studio"
        ? "Content design brief loaded into generator."
        : "Media brief loaded into generator.";
      rerender();
    };
  }

  Array.from(document.querySelectorAll("[data-media-action]")).forEach((button) => {
    button.onclick = async () => {
      const item = session.items.find((entry) => entry.id === button.getAttribute("data-media-id"));
      const action = button.getAttribute("data-media-action") || "";
      if (!item) return;
      session.selectedId = item.id;
      syncFormFromItem(session, item);

      if (action === "preview" || action === "edit-prompt") {
        document.getElementById(action === "preview" ? "mediaReviewPanel" : "mediaGeneratorPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
        rerender();
        return;
      }

      if (action === "save-draft") {
        saveDraftToSession(projectName, state, session, "draft");
        showMessage?.("Media job saved as local draft.");
      }

      if (action === "regenerate") {
        session.form.prompt = improvePrompt(session.form.prompt);
        syncVersionFromForm(session);
        saveDraftToSession(projectName, state, session, "prompt_ready");
        showMessage?.("Regeneration prompt prepared. No generation backend was invoked.");
      }

      if (action === "approve") {
        const confirmed = confirmMediaAuthorityAction(
          "Confirm local media approval mark",
          "Action: Mark this media job as approved/review-ready locally.\nRisk: This does not publish, but it changes readiness status and can influence downstream handoff."
        );
        if (!confirmed) return;

        session.form.status = "approved";
        const currentVersion = selectedVersionEntry(session);
        if (currentVersion) currentVersion.readiness_status = "approved";
        syncOutputsFromVersioning(session);
        saveDraftToSession(projectName, state, session, "approved");
        showMessage?.("Media job marked review-ready locally.");
      }

      if (action === "send-publishing") {
        const confirmed = confirmMediaAuthorityAction(
          "Confirm publishing handoff",
          "Action: Prepare and send this media package to Publishing.\nRisk: This creates a handoff path for downstream publishing review. It does not publish directly."
        );
        if (!confirmed) return;

        session.form.status = "sent_to_publishing";
        const currentVersion = selectedVersionEntry(session);
        if (currentVersion) currentVersion.readiness_status = "sent_to_publishing";
        syncOutputsFromVersioning(session);
        saveDraftToSession(projectName, state, session, "sent_to_publishing");
        sendPublishingHandoff({ projectName, backendProjectName, session, selectedItem: item, navigateTo, showMessage, showError });
        return;
      }
      rerender();
    };
  });

  const approveBtn = document.getElementById("mediaApproveBtn");
  if (approveBtn) {
    approveBtn.onclick = async () => {
      sync();
      const item = selected();

      const confirmed = confirmMediaAuthorityAction(
        "Confirm media approval decision",
        "Action: Record this media job as approved/review-ready.\nRisk: If a pending backend approval exists, this may submit an approval decision."
      );
      if (!confirmed) return;

      session.form.status = "approved";
      const currentVersion = selectedVersionEntry(session);
      if (currentVersion) {
        currentVersion.readiness_status = "approved";
        currentVersion.provider_status = currentVersion.provider_status || "generated";
      }
      syncOutputsFromVersioning(session);
      saveDraftToSession(projectName, state, session, "approved");

      if (backendProjectName && item && !item.localOnly) {
        const pendingApproval = session.approvals.find((approval) =>
          asString(approval.entity_type) === "media_job" &&
          asString(approval.entity_id) === asString(item.id) &&
          asString(approval.status) === "pending"
        );
        if (pendingApproval) {
          try {
            await decideProjectApproval(backendProjectName, pendingApproval.id, {
              decision: "approved",
              note: session.form.reviewNotes || "Marked review-ready in Media Studio.",
              actor: "media-studio"
            });
          } catch (_) {}
        }
      }
      showMessage?.("Media review state recorded.");
      rerender();
    };
  }

  const requestApprovalBtn = document.getElementById("mediaRequestApprovalBtn");
  if (requestApprovalBtn) {
    requestApprovalBtn.onclick = async () => {
      sync();

      const confirmed = confirmMediaAuthorityAction(
        "Confirm media approval request",
        "Action: Request Governance/Compliance review for this media job.\nRisk: This may create a backend approval item for a reviewer."
      );
      if (!confirmed) return;

      const item = selected() || saveDraftToSession(projectName, state, session, "needs_review");
      saveDraftToSession(projectName, state, session, "needs_review");

      if (backendProjectName && item && !item.localOnly) {
        try {
          await createProjectApproval(backendProjectName, {
            title: `Review ${item.title || session.form.title || "media job"}`,
            entity_type: "media_job",
            entity_id: item.id,
            summary: session.form.reviewNotes || "Review media output before publishing handoff.",
            reviewer_role: MEDIA_ROLE_DEFAULTS.reviewRole,
            service_domain: MEDIA_ROLE_DEFAULTS.serviceDomain,
            requested_by: "media-studio",
            linked_entity: {
              entity_type: "media_job",
              entity_id: item.id,
              route: "media-studio",
              label: item.title || session.form.title || "Media job"
            },
            actor: "media-studio"
          });
          showMessage?.("Review request created.");
        } catch (_) {
          showMessage?.("Review request kept as local review state.");
        }
      } else {
        showMessage?.("Media draft moved to needs review locally.");
      }
      rerender();
    };
  }

  const rejectBtn = document.getElementById("mediaRejectBtn");
  if (rejectBtn) {
    rejectBtn.onclick = async () => {
      sync();
      const item = selected();

      const confirmed = confirmMediaAuthorityAction(
        "Confirm media revision decision",
        "Action: Return this media job to draft/revision.\nRisk: If a pending backend approval exists, this may submit a rejection/revision decision."
      );
      if (!confirmed) return;

      session.form.status = "draft";
      const currentVersion = selectedVersionEntry(session);
      if (currentVersion) currentVersion.readiness_status = "draft";
      syncOutputsFromVersioning(session);
      saveDraftToSession(projectName, state, session, "draft");

      if (backendProjectName && item && !item.localOnly) {
        const pendingApproval = session.approvals.find((approval) =>
          asString(approval.entity_type) === "media_job" &&
          asString(approval.entity_id) === asString(item.id) &&
          asString(approval.status) === "pending"
        );
        if (pendingApproval) {
          try {
            await decideProjectApproval(backendProjectName, pendingApproval.id, {
              decision: "rejected",
              note: session.form.reviewNotes || "Revision requested in Media Studio.",
              actor: "media-studio"
            });
          } catch (_) {}
        }
      }
      showMessage?.("Media job returned to draft for revision.");
      rerender();
    };
  }

  const createTaskBtn = document.getElementById("mediaCreateTaskBtn");
  if (createTaskBtn) {
    createTaskBtn.onclick = async () => {
      sync();

      const confirmed = confirmMediaAuthorityAction(
        "Confirm media task creation",
        "Action: Create a task linked to this media job.\nRisk: This may create durable work for the media team."
      );
      if (!confirmed) return;

      const item = selected() || saveDraftToSession(projectName, state, session, "prompt_ready");
      if (backendProjectName && item && !item.localOnly) {
        try {
          await createProjectTask(backendProjectName, {
            title: `Complete media job ${item.title || session.form.title || "media job"}`,
            description: session.form.objective || item.brief || "Review prompt, outputs, approval, and publishing readiness.",
            owner_role: item.owner_role || ownerRoleForMode(item.mode),
            assignee_role: item.owner_role || ownerRoleForMode(item.mode),
            service_domain: MEDIA_ROLE_DEFAULTS.serviceDomain,
            responsibility: item.mode === "video" ? "video_production" : "creative_production",
            handoff_roles: [MEDIA_ROLE_DEFAULTS.handoffRole, MEDIA_ROLE_DEFAULTS.reviewRole],
            source_page: "media-studio",
            route_target: "media-studio",
            linked_entity: {
              entity_type: "media_job",
              entity_id: item.id,
              route: "media-studio",
              label: item.title || session.form.title || "Media job"
            },
            actor: "media-studio"
          });
          showMessage?.("Task created and linked to the media job.");
        } catch (_) {
          showMessage?.("Task action kept locally because backend task save is unavailable.");
        }
      } else {
        showMessage?.("Create Task needs a backend media job; local draft is preserved.");
      }
      rerender();
    };
  }

  const sendAiBtn = document.getElementById("mediaSendAiCommandBtn");
  if (sendAiBtn) {
    sendAiBtn.onclick = () => {
      sync();
      const item = selected();
      const prompt = buildAiPrompt(projectName, session, item);
      const aiDraft = {
        projectName,
        modeId: "media",
        lastCommand: prompt,
        lastResponseTitle: item?.title || session.form.title || "Media Studio Review",
        routeSuggestions: []
      };
      setSharedAiDraft(projectName, aiDraft);
      setSharedHandoff(projectName, "ai-command", {
        source_page: "media-studio",
        destination_page: "ai-command",
        linked_entity: {
          entity_type: "media_job",
          entity_id: item?.id || session.formSourceId || ""
        },
        payload: {
          prompt,
          media_job_id: item?.id || session.formSourceId || "",
          title: item?.title || session.form.title || "",
          draft_context: aiDraft,
          media: buildMediaPayload(session, item?.status || "prompt_ready")
        },
        status: "available"
      });
      navigateTo("ai-command");
      showMessage?.("Media context sent to AI Command.");
    };
  }

  const sendPublishingBtn = document.getElementById("mediaSendToPublishingBtn");
  if (sendPublishingBtn) {
    sendPublishingBtn.onclick = () => {
      sync();

      const confirmed = confirmMediaAuthorityAction(
        "Confirm publishing handoff",
        "Action: Prepare and send this media package to Publishing.\nRisk: This creates a downstream publishing handoff. It does not publish directly."
      );
      if (!confirmed) return;

      session.form.status = "sent_to_publishing";
      const currentVersion = selectedVersionEntry(session);
      if (currentVersion) currentVersion.readiness_status = "sent_to_publishing";
      syncOutputsFromVersioning(session);
      saveDraftToSession(projectName, state, session, "sent_to_publishing");
      sendPublishingHandoff({ projectName, backendProjectName, session, selectedItem: selected(), navigateTo, showMessage, showError });
    };
  }

  const headerSaveLibraryBtn = document.getElementById("mediaHeaderSaveLibraryBtn");
  if (headerSaveLibraryBtn) {
    headerSaveLibraryBtn.onclick = async () => {
      sync();
      await saveVersionToLibrary({
        projectName,
        backendProjectName,
        state,
        session,
        selectedItem: selected(),
        showMessage,
        rerender
      });
      rerender();
    };
  }

  const versionNotes = document.getElementById("mediaVersionCompareNotes");
  if (versionNotes) {
    versionNotes.oninput = () => {
      ensureVersioning(session).compareNotes = versionNotes.value || "";
    };
  }

  Array.from(document.querySelectorAll("[data-media-version]")).forEach((button) => {
    button.onclick = () => {
      const key = button.getAttribute("data-media-version") || "v1";
      ensureVersioning(session).selectedVersionId = key;
      applySelectedVersionToForm(session);
      session.draftMessage = `${titleCase(key)} selected.`;
      rerender();
    };
  });

  Array.from(document.querySelectorAll("[data-media-version-action]")).forEach((button) => {
    button.onclick = async () => {
      sync();
      const action = button.getAttribute("data-media-version-action") || "";
      const currentVersion = selectedVersionEntry(session);
      if (!currentVersion) return;

      if (action === "compare-toggle") {
        const versioning = ensureVersioning(session);
        versioning.compareMode = !versioning.compareMode;
        rerender();
        return;
      }

      if (action === "approve") {
        const confirmed = confirmMediaAuthorityAction(
          "Confirm local media approval mark",
          "Action: Mark this media job as approved/review-ready locally.\nRisk: This does not publish, but it changes readiness status and can influence downstream handoff."
        );
        if (!confirmed) return;

        session.form.status = "approved";
        currentVersion.readiness_status = "approved";
        currentVersion.provider_status = currentVersion.provider_status || "generated";
        saveDraftToSession(projectName, state, session, "approved");
        syncOutputsFromVersioning(session);
        showMessage?.("Selected version marked review-ready.");
      }
      if (action === "reject") {
        session.form.status = "draft";
        currentVersion.readiness_status = "draft";
        saveDraftToSession(projectName, state, session, "draft");
        syncOutputsFromVersioning(session);
        showMessage?.("Selected version rejected and returned to draft.");
      }
      if (action === "regenerate") {
        session.form.prompt = improvePrompt(currentVersion.prompt || session.form.prompt);
        session.form.status = "prompt_ready";
        appendVersion(session, {
          mode: currentVersion.mode || session.form.mode || session.mode || "image",
          prompt: session.form.prompt,
          outputPayload: {
            message: "Regenerated from selected version prompt.",
            source_version_id: currentVersion.id
          },
          providerStatus: "prompt_ready",
          readinessStatus: "prompt_ready",
          notes: "Regenerated from selected version.",
          provider: currentVersion.provider || "",
          model: currentVersion.model || ""
        });
        syncOutputsFromVersioning(session);
        saveDraftToSession(projectName, state, session, "prompt_ready");
        showMessage?.("Selected version regenerated as prompt-ready draft.");
      }
      if (action === "save-draft") {
        saveDraftToSession(projectName, state, session, "draft");
        showMessage?.("Selected version saved as draft.");
      }
      if (action === "send-publishing") {
        const confirmed = confirmMediaAuthorityAction(
          "Confirm publishing handoff",
          "Action: Prepare and send this media package to Publishing.\nRisk: This creates a handoff path for downstream publishing review. It does not publish directly."
        );
        if (!confirmed) return;

        session.form.status = "sent_to_publishing";
        currentVersion.readiness_status = "sent_to_publishing";
        syncOutputsFromVersioning(session);
        saveDraftToSession(projectName, state, session, "sent_to_publishing");
        await sendPublishingHandoff({ projectName, backendProjectName, session, selectedItem: selected(), navigateTo, showMessage, showError });
        return;
      }
      if (action === "save-library") {
        await saveVersionToLibrary({
          projectName,
          backendProjectName,
          state,
          session,
          selectedItem: selected(),
          showMessage,
          rerender
        });
      }
      rerender();
    };
  });

  Array.from(document.querySelectorAll("[data-media-specialist-use], [data-media-specialist-save], [data-media-specialist-ai]")).forEach((button) => {
    button.onclick = async () => {
      const id = button.getAttribute("data-media-specialist-use") || button.getAttribute("data-media-specialist-save") || button.getAttribute("data-media-specialist-ai") || "";
      const specialist = SPECIALISTS.find((item) => item.id === id);
      if (!specialist) return;
      session.form.prompt = [specialist.suggestedPrompt, session.form.prompt].filter(Boolean).join("\n\n");
      syncVersionFromForm(session);
      session.draftMessage = `${specialist.title} prompt added.`;
      if (button.hasAttribute("data-media-specialist-save")) {
        saveDraftToSession(projectName, state, session, "draft");
        showMessage?.(`${specialist.title} draft saved locally.`);
      }
      if (button.hasAttribute("data-media-specialist-ai")) {
        const prompt = buildAiPrompt(projectName, session, selected());
        const aiDraft = {
          projectName,
          modeId: "media",
          lastCommand: prompt,
          lastResponseTitle: `${specialist.title} Assist`,
          routeSuggestions: []
        };
        setSharedAiDraft(projectName, aiDraft);
        setSharedHandoff(projectName, "ai-command", {
          source_page: "media-studio",
          destination_page: "ai-command",
          linked_entity: {
            entity_type: "media_job",
            entity_id: session.formSourceId || ""
          },
          payload: {
            prompt,
            title: `${specialist.title} Assist`,
            draft_context: aiDraft,
            media: buildMediaPayload(session, session.form.status || "prompt_ready")
          },
          status: "available"
        });
        navigateTo("ai-command");
        showMessage?.(`${specialist.title} prompt opened in AI Command.`);
      }
      rerender();
    };
  });
}

async function sendPublishingHandoff({ projectName, backendProjectName, session, selectedItem, navigateTo, showMessage, showError }) {
  const handoff = buildPublishingHandoff(projectName, session, selectedItem);
  const handoffScopes = new Set([asString(projectName)]);
  if (!clean(projectName) || toKey(projectName) === "workspace") {
    handoffScopes.add("__default__");
  }
  handoffScopes.forEach((scope) => {
    setSharedHandoff(scope, "publishing", handoff);
  });

  if (backendProjectName && selectedItem && !selectedItem.localOnly) {
    try {
      await createProjectHandoff(backendProjectName, handoff);
      showMessage?.("Publishing package handoff prepared from Media Studio.");
    } catch (error) {
      showMessage?.("Publishing package handoff kept locally because backend handoff save is unavailable.");
    }
  } else {
    showMessage?.("Publishing package handoff prepared locally.");
  }

  try {
    navigateTo("publishing");
  } catch (error) {
    showError?.(error.message || "Failed to open Publishing.");
  }
}

export const mediaStudioRoute = {
  id: "media-studio",
  disableStandardLayout: true,
  meta: {
    eyebrow: "Operations",
    title: "Media Studio",
    description: "Run saved image, video, voice, and campaign-pack jobs with prompts, review states, Library saves, and package routing."
  },
  template: `
    <section class="page is-active" data-page="media-studio">
      <div id="mediaStudioRoot"></div>
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
    const projectName = getProjectName(state);
    const backendProjectName = getBackendProjectName(state);
    const root = $("mediaStudioRoot");
    if (!root) return;

    const session = ensureSession(projectName, state);
    const rerender = () => mediaStudioRoute.render({
      getState,
      $,
      escapeHtml,
      navigateTo,
      showMessage,
      showError
    });

    if (!session.loaded && !session.loading) {
      loadMediaWorkspace(projectName, backendProjectName, state, session, rerender);
    }

    const localItems = loadLocalDrafts(projectName).map((item) => normalizeMediaItem(item, state, "Local draft"));
    if (!backendProjectName && localItems.length && !session.items.length) {
      session.items = localItems;
    }

    const selectedItem = getSelectedItem(session);
    if (selectedItem && selectedItem.id !== session.formSourceId && !session.isCreatingNew) {
      syncFormFromItem(session, selectedItem);
    }

    const handoff = getInboundHandoff(projectName, session);
    const metrics = getMetrics(session);
    const recommendation = buildRecommendation(metrics, handoff, selectedItem);


    // Onboarding / Next Action Guidance Panel
    function renderOnboardingPanel() {
      return `
        <section class="card media-card" id="mediaOnboardingPanel" aria-label="Media Studio Onboarding and Next Actions">
          <div class="card-head">
            <div>
              <div class="setup-kicker">Welcome to Media Studio</div>
              <h3>Creative Preparation, Review, and Routing Workspace</h3>
              <p class="media-section-copy">Start with a brief or handoff. Attach Library assets when needed. Review creative readiness and brand compliance. Save approved assets to Library or prepare handoff to Publishing/Governance. All routing is handoff/review-based and user-triggered. Media Studio does not publish, send, or approve directly.</p>
            </div>
          </div>
        </section>
      `;
    }

    // Source / Provenance Panel
    function renderSourceProvenancePanel() {
      const sourceState = getMediaSourceReadiness(session, selectedItem, handoff);
      const rows = [];
      if (selectedItem?.source) rows.push(["Source page", titleCase(selectedItem.source)]);
      if (selectedItem?.library_asset_ref?.handoff_id) rows.push(["Library asset", selectedItem.library_asset_ref.handoff_id]);
      if (selectedItem?.project) rows.push(["Project", selectedItem.project]);
      if (selectedItem?.campaign) rows.push(["Campaign", selectedItem.campaign]);
      if (session.form?.referenceAsset) rows.push(["Reference", session.form.referenceAsset]);
      if (!rows.length && handoff) rows.push(["Inbound handoff", titleCase(handoff.source_page || "Workflow")]);
      if (!rows.length) rows.push(["Source", "No trusted source attached yet"]);

      return `
        <section class="card media-card media-rail-card" id="mediaSourceProvenancePanel" aria-label="Source Context Panel">
          <div class="card-head media-compact-head">
            <div>
              <div class="setup-kicker">Source Context</div>
              <h3>Provenance</h3>
            </div>
            <span class="media-state-badge is-${escapeHtml(sourceState.state)}">${escapeHtml(sourceState.status)}</span>
          </div>
          <div class="media-compact-list media-provenance-list">
            ${rows.map(([label, value]) => `
              <div class="media-compact-row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>
            `).join("")}
          </div>
          <p class="media-rail-note">${escapeHtml(sourceState.detail)}</p>
        </section>
      `;
    }

    // Creative Readiness Checklist Panel
    function renderCreativeReadinessPanel() {
      const readinessItems = getMediaReadinessItems(session, selectedItem, handoff)
        .filter((item) => ["creative", "publishing"].includes(item.key));
      return `
        <section class="card media-card media-rail-card" id="mediaCreativeReadinessPanel" aria-label="Creative Readiness Checklist">
          <div class="card-head media-compact-head">
            <div>
              <div class="setup-kicker">Creative Readiness</div>
              <h3>Package inputs</h3>
            </div>
          </div>
          <div class="media-compact-list" role="list">
            ${readinessItems.map((item) => `
              <div class="media-compact-row is-${escapeHtml(item.state)}" role="listitem">
                <span>${escapeHtml(item.label)}</span>
                <strong>${escapeHtml(item.status)}</strong>
                <small>${escapeHtml(item.detail)}</small>
              </div>
            `).join("")}
          </div>
        </section>
      `;
    }

    // Brand Compliance Checklist Panel
    function renderBrandCompliancePanel() {
      const readinessItems = getMediaReadinessItems(session, selectedItem, handoff)
        .filter((item) => ["brand", "governance"].includes(item.key));
      return `
        <section class="card media-card media-rail-card" id="mediaBrandCompliancePanel" aria-label="Brand Compliance Checklist">
          <div class="card-head media-compact-head">
            <div>
              <div class="setup-kicker">Brand Compliance</div>
              <h3>Brand and governance</h3>
            </div>
          </div>
          <div class="media-compact-list" role="list">
            ${readinessItems.map((item) => `
              <div class="media-compact-row is-${escapeHtml(item.state)}" role="listitem">
                <span>${escapeHtml(item.label)}</span>
                <strong>${escapeHtml(item.status)}</strong>
                <small>${escapeHtml(item.detail)}</small>
              </div>
            `).join("")}
          </div>
          <div class="media-hint media-readiness-hint" aria-label="Governance review guidance">Prepare Governance Review if any risk or compliance concern exists.</div>
        </section>
      `;
    }

    root.innerHTML = `
      ${renderScopedStyles()}
      <div class="media-production-center">
        ${renderMediaCommandHeader({ projectName, session, metrics, selectedItem, handoff, recommendation, escapeHtml })}
        ${renderMediaWorkflowStrip({ session, selectedItem, handoff, escapeHtml })}
        ${renderMediaReadinessSummary({ session, selectedItem, handoff, escapeHtml })}
        ${session.error ? `<div class="simple-banner">${escapeHtml(session.error)}</div>` : ""}
        ${session.loading ? `<div class="empty-box">Loading media jobs, handoffs, approvals, tasks, and event history...</div>` : ""}
        <div class="media-production-grid">
          <div class="media-main-column">
            ${renderGenerator(session, state, backendProjectName, escapeHtml)}
            ${renderPromptBuilder(session, handoff, escapeHtml)}
            ${renderOutputPreviewPanel(session, selectedItem, escapeHtml)}
            ${renderQueue(session, escapeHtml)}
            ${renderReviewPanel(session, selectedItem, escapeHtml)}
            ${renderOutputReadinessPanel(session, selectedItem, escapeHtml)}
            ${renderVersioningPanel(session, escapeHtml)}
          </div>
          <aside class="media-side-column">
            ${renderWorkflowHandoff(handoff, session, escapeHtml)}
            ${renderSourceProvenancePanel()}
            ${renderCreativeReadinessPanel()}
            ${renderBrandCompliancePanel()}
            ${renderSpecialists(session, selectedItem, escapeHtml)}
            ${renderAssetGate(state, escapeHtml)}
            ${renderApiReadiness(session, backendProjectName, escapeHtml)}
          </aside>
        </div>
      </div>
    `;

    bindMediaStudio({
      projectName,
      backendProjectName,
      state,
      session,
      handoff,
      navigateTo,
      showMessage,
      showError,
      rerender
    });
  }
};

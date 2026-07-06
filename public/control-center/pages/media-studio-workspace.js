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


function getAiCommandLocalCampaignHandoff(destinationRoute) {
  const keys = [
    `mh_ai_command_handoff_${destinationRoute}`,
    "mh_ai_command_campaign_handoff"
  ];

  for (const storage of [window.sessionStorage, window.localStorage]) {
    for (const key of keys) {
      try {
        const parsed = JSON.parse(storage?.getItem?.(key) || "null");
        if (!parsed || typeof parsed !== "object") continue;

        const type = asString(parsed.type);
        const route = asString(parsed.destination_route);
        if (type === "ai_command_campaign_handoff" && (!route || route === destinationRoute)) {
          return parsed;
        }
      } catch (error) {
        console.warn("Unable to read AI Command campaign handoff", error);
      }
    }
  }

  return null;
}

function clearAiCommandLocalCampaignHandoff(destinationRoute) {
  const keys = [
    `mh_ai_command_handoff_${destinationRoute}`,
    "mh_ai_command_campaign_handoff"
  ];

  for (const storage of [window.sessionStorage, window.localStorage]) {
    for (const key of keys) {
      try {
        storage?.removeItem?.(key);
      } catch (error) {
        console.warn("Unable to clear AI Command campaign handoff", error);
      }
    }
  }
}


function getInboundHandoff(projectName, session) {
  const aiCommandLocalHandoff = getAiCommandLocalCampaignHandoff("media-studio");
  if (aiCommandLocalHandoff) return aiCommandLocalHandoff;

  const operations = session.operations || {};
  return (
    getSharedHandoff(projectName, "media-studio", operations, "workflows") ||
    getSharedHandoff(projectName, "media-studio", operations, "ai-command") ||
    getSharedHandoff(projectName, "media-studio", operations, "content-studio") ||
    getSharedHandoff(projectName, "media-studio", operations)
  );
}

function extractHandoffSummary(handoff) {
  const direct = asObject(handoff);
  const payload = asObject(handoff?.payload);
  const output = asObject(payload.output);
  const draftContext = asObject(payload.draft_context);
  const isAiCampaign = asString(direct.type || payload.type) === "ai_command_campaign_handoff";
  const contentType = asString(payload.content_type || output.content_type || draftContext.outputType || direct.type);
  const sourcePage = asString(handoff?.source_page || direct.source || "workflows");
  const title = firstText(
    direct.title,
    output.title,
    payload.workflow_title,
    draftContext.lastResponseTitle,
    isAiCampaign ? "AI Team Campaign Brief" : "",
    contentType ? `${titleCase(contentType)} design brief` : "Inbound media brief"
  );
  const summary = firstText(
    direct.summary,
    output.summary,
    payload.summary,
    draftContext.lastResponseSummary,
    payload.prompt,
    isAiCampaign ? "AI Team campaign package is available for creative preparation." : "",
    "Workflow handoff is available for media preparation."
  );
  const sections = asArray(direct.sections || payload.sections || output.sections);
  const goal = asString(direct.goal || payload.goal);
  const channel = asString(direct.channel || payload.channel);
  const sourceType = asString(direct.source_type || payload.source_type || direct.source);

  return {
    id: asString(
      direct.id ||
      handoff?.id ||
      payload.workflow_id ||
      payload.prompt ||
      payload.workflow_title ||
      title
    ),
    sourcePage,
    workflowId: asString(payload.workflow_id || direct.id),
    contentType,
    title,
    summary,
    isAiCampaign,
    goal,
    channel,
    sourceType,
    campaignPackage: asObject(direct.campaignPackage || payload.campaignPackage || output.campaignPackage),
    backendPreview: Boolean(direct.backend_preview || direct.backendPreview || payload.backendPreview || output.backendPreview),
    backendSource: asString(direct.backend_source || direct.backendSource || payload.backendSource || output.backendSource || ""),
    sections,
    packageLabel: isAiCampaign ? "AI Team Campaign Brief" : "Workflow Handoff"
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
    provider: mode === "video" ? "Prompt-only" : mode === "voice" ? "Prompt-only" : "Prompt-only",
    model: "Prompt draft",
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
      action: "Prepare Campaign Pack",
      why: `${ready.title} is ready for a safe Publishing package handoff.`
    };
  }
  if (handoff) {
    return {
      action: handoff && extractHandoffSummary(handoff).isAiCampaign ? "Load AI Team campaign brief" : "Load workflow media brief",
      why: handoff && extractHandoffSummary(handoff).isAiCampaign ? "An AI Team campaign package is available. Load it as the creative brief before preparing media assets." : "A workflow handoff is available. Load it into the generator to continue the Workflows -> Media Studio -> package handoff flow."
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
  return "Connect a provider in Integrations, or continue with a prompt draft.";
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
    

      /* MEDIA-STUDIO-PHASE2R2-CONTENT-STUDIO-STYLE-EXECUTION-ROOM */
/* MEDIA-STUDIO-PHASE2R2-REPAIR-RESTORE-OVERVIEW-RECOMMENDATION */
      .media-os-shell {
        --media-os-bg: #020711;
        --media-os-line: rgba(148, 163, 184, 0.12);
        --media-os-line-soft: rgba(148, 163, 184, 0.075);
        --media-os-text: rgba(248, 250, 252, 0.96);
        --media-os-muted: rgba(203, 213, 225, 0.72);
        --media-os-faint: rgba(148, 163, 184, 0.56);
        --media-os-accent: #5eead4;
        --media-os-accent-2: #38bdf8;
        display: grid;
        gap: 0;
        min-width: 0;
        padding: 0;
        color: var(--media-os-text);
        background:
          radial-gradient(circle at 12% 0%, rgba(20, 184, 166, 0.08), transparent 28%),
          radial-gradient(circle at 88% 8%, rgba(56, 189, 248, 0.07), transparent 30%),
          linear-gradient(180deg, var(--media-os-bg) 0%, #030a16 100%);
      }

      .media-os-shell * {
        box-sizing: border-box;
      }

      .media-os-shell .media-command-header,
      .media-os-shell .media-workflow-strip,
      .media-os-shell .media-os-section,
      .media-os-shell .media-card {
        border-radius: 0 !important;
        box-shadow: none !important;
      }

      .media-os-shell .media-command-header {
        border: 0;
        border-bottom: 1px solid var(--media-os-line);
        background: rgba(2, 7, 17, 0.72);
        backdrop-filter: blur(18px);
      }

      .media-os-shell .media-command-main h2 {
        color: var(--media-os-text);
        letter-spacing: -0.055em;
      }

      .media-os-shell .media-section-copy,
      .media-os-shell .media-command-next small,
      .media-os-shell .media-workflow-copy small {
        color: var(--media-os-muted);
      }

      .media-os-shell .media-command-meta span,
      .media-os-shell .media-overview-item,
      .media-os-shell .media-impact-chip,
      .media-os-shell .media-check-item,
      .media-os-shell .media-api-item,
      .media-os-shell .media-queue-row,
      .media-os-shell .media-specialist-card,
      .media-os-shell .media-prompt-box,
      .media-os-shell .media-viewer-frame,
      .media-os-shell .simple-banner,
      .media-os-shell .empty-box {
        border-radius: 0 !important;
        border-color: var(--media-os-line-soft) !important;
        background: rgba(255, 255, 255, 0.015) !important;
        color: var(--media-os-text) !important;
        box-shadow: none !important;
      }

      .media-os-shell .btn,
      .media-os-shell .btn-primary,
      .media-os-shell .btn-secondary,
      .media-os-shell button {
        border-radius: 0 !important;
      }

      .media-os-shell .media-workflow-strip {
        padding: 14px 18px;
        border: 0;
        border-bottom: 1px solid var(--media-os-line);
        background: rgba(2, 7, 17, 0.52);
      }

      .media-os-section {
        display: grid;
        gap: 14px;
        min-width: 0;
        padding: 18px;
        border-bottom: 1px solid var(--media-os-line);
        background: rgba(2, 7, 17, 0.22);
      }

      .media-os-section-head {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 16px;
        align-items: start;
      }

      .media-os-kicker,
      .media-os-data-row span,
      .media-os-prompt-sheet span,
      .media-os-lane span {
        color: var(--media-os-accent);
        font-size: 0.68rem;
        font-weight: 850;
        letter-spacing: 0.1em;
        text-transform: uppercase;
      }

      .media-os-section-head h3 {
        margin: 4px 0 6px;
        color: var(--media-os-text);
        font-size: clamp(1.35rem, 2.2vw, 2.25rem);
        line-height: 1;
        letter-spacing: -0.055em;
      }

      .media-os-section-head p,
      .media-os-lane p,
      .media-os-prompt-sheet p {
        margin: 0;
        color: var(--media-os-muted);
        line-height: 1.5;
        overflow-wrap: anywhere;
      }

      .media-os-badge {
        display: inline-flex;
        align-items: center;
        min-height: 28px;
        padding: 6px 9px;
        border: 1px solid var(--media-os-line-soft);
        color: var(--media-os-muted);
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }

      .media-os-badge.is-ready,
      .media-os-badge.success {
        border-color: rgba(52, 211, 153, 0.4);
        color: #bbf7d0;
      }

      .media-os-badge.is-waiting,
      .media-os-badge.warning {
        border-color: rgba(251, 191, 36, 0.42);
        color: #fde68a;
      }

      .media-os-packet-grid,
      .media-os-source-grid {
        display: grid;
        grid-template-columns: minmax(0, 1.35fr) minmax(300px, 0.65fr);
        gap: 0;
        border-top: 1px solid var(--media-os-line-soft);
        border-left: 1px solid var(--media-os-line-soft);
      }

      .media-os-prompt-sheet,
      .media-os-data,
      .media-os-source-list,
      .media-os-source-actions {
        min-width: 0;
        padding: 14px;
        border-right: 1px solid var(--media-os-line-soft);
        border-bottom: 1px solid var(--media-os-line-soft);
      }

      .media-os-prompt-sheet {
        display: grid;
        gap: 10px;
      }

      .media-os-data {
        display: grid;
        gap: 0;
      }

      .media-os-data-row {
        display: grid;
        gap: 3px;
        padding: 8px 0;
        border-bottom: 1px solid var(--media-os-line-soft);
      }

      .media-os-data-row:last-child {
        border-bottom: 0;
      }

      .media-os-data-row strong {
        color: var(--media-os-text);
        overflow-wrap: anywhere;
      }

      .media-os-lanes {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 0;
        border-top: 1px solid var(--media-os-line-soft);
        border-left: 1px solid var(--media-os-line-soft);
      }

      .media-os-lane {
        display: grid;
        gap: 8px;
        min-width: 0;
        padding: 14px;
        border-right: 1px solid var(--media-os-line-soft);
        border-bottom: 1px solid var(--media-os-line-soft);
        background: rgba(255, 255, 255, 0.01);
      }

      .media-os-lane.is-active {
        background: linear-gradient(180deg, rgba(20, 184, 166, 0.11), rgba(255, 255, 255, 0.01));
      }

      .media-os-lane strong {
        color: var(--media-os-text);
        font-size: 1rem;
      }

      .media-os-lane-status {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }

      .media-os-lane-status em {
        border: 1px solid var(--media-os-line-soft);
        padding: 4px 7px;
        color: var(--media-os-muted);
        font-size: 0.7rem;
        font-style: normal;
        font-weight: 800;
      }

      .media-os-lane-status em.is-ready {
        border-color: rgba(52, 211, 153, 0.38);
        color: #bbf7d0;
      }

      .media-os-lane button,
      .media-os-actions button {
        min-height: 32px;
        border: 1px solid var(--media-os-line-soft);
        background: transparent;
        color: var(--media-os-text);
        padding: 7px 10px;
        font: inherit;
        font-size: 0.76rem;
        font-weight: 780;
        cursor: pointer;
      }

      .media-os-lane button:hover,
      .media-os-actions button:hover {
        border-color: rgba(94, 234, 212, 0.5);
        background: rgba(20, 184, 166, 0.1);
      }

      .media-os-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }

      .media-os-source-grid {
        grid-template-columns: minmax(0, 1fr) minmax(230px, 0.36fr);
      }

      .media-os-source-actions {
        align-content: start;
      }

      .media-os-notice {
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid var(--media-os-line-soft);
        color: var(--media-os-muted);
      }

      .media-os-shell .setup-input,
      .media-os-shell .setup-textarea,
      .media-os-shell input,
      .media-os-shell textarea,
      .media-os-shell select {
        border-radius: 0 !important;
        background: rgba(2, 7, 17, 0.32) !important;
        color: var(--media-os-text) !important;
        border-color: var(--media-os-line-soft) !important;
      }

      @media (max-width: 1280px) {
        .media-os-lanes {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .media-os-packet-grid,
        .media-os-source-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 760px) {
        .media-os-section-head,
        .media-os-lanes {
          grid-template-columns: 1fr;
        }
      }

    
      
      /* MEDIA-STUDIO-PHASE3A-PRODUCTION-INTELLIGENCE-ROUTER-UI\n      /* MEDIA-STUDIO-PHASE3A-REPAIR-LICENSE-MARKER */ */
      .media-os-shell .media-intelligence-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(300px, 0.82fr);
        gap: 0;
        border-top: 1px solid var(--media-os-line-soft);
        border-left: 1px solid var(--media-os-line-soft);
      }

      .media-os-shell .media-intelligence-cell {
        display: grid;
        gap: 12px;
        min-width: 0;
        padding: 14px;
        border-right: 1px solid var(--media-os-line-soft);
        border-bottom: 1px solid var(--media-os-line-soft);
        background: rgba(255, 255, 255, 0.012);
      }

      .media-os-shell .media-intelligence-stack {
        display: grid;
        gap: 10px;
      }

      .media-os-shell .media-intelligence-route {
        display: grid;
        gap: 8px;
        padding: 12px;
        border: 1px solid var(--media-os-line-soft);
        background: rgba(2, 7, 17, 0.28);
      }

      .media-os-shell .media-intelligence-route strong,
      .media-os-shell .media-model-card strong,
      .media-os-shell .media-lock-row strong,
      .media-os-shell .media-format-row strong {
        color: var(--media-os-text);
        overflow-wrap: anywhere;
      }

      .media-os-shell .media-intelligence-route p,
      .media-os-shell .media-model-card p,
      .media-os-shell .media-lock-row p,
      .media-os-shell .media-format-row p {
        margin: 0;
        color: var(--media-os-muted);
        line-height: 1.45;
        overflow-wrap: anywhere;
      }

      .media-os-shell .media-route-tags,
      .media-os-shell .media-model-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }

      .media-os-shell .media-route-tags span,
      .media-os-shell .media-model-tags span {
        border: 1px solid var(--media-os-line-soft);
        padding: 4px 7px;
        color: var(--media-os-muted);
        font-size: 0.68rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .media-os-shell .media-route-tags span.is-critical,
      .media-os-shell .media-model-tags span.is-critical {
        border-color: rgba(251, 191, 36, 0.42);
        color: #fde68a;
      }

      .media-os-shell .media-route-tags span.is-ready,
      .media-os-shell .media-model-tags span.is-ready {
        border-color: rgba(52, 211, 153, 0.38);
        color: #bbf7d0;
      }

      .media-os-shell .media-model-matrix {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0;
        border-top: 1px solid var(--media-os-line-soft);
        border-left: 1px solid var(--media-os-line-soft);
      }

      .media-os-shell .media-model-card {
        display: grid;
        gap: 8px;
        min-width: 0;
        padding: 12px;
        border-right: 1px solid var(--media-os-line-soft);
        border-bottom: 1px solid var(--media-os-line-soft);
        background: rgba(255, 255, 255, 0.012);
      }

      .media-os-shell .media-lock-list,
      .media-os-shell .media-format-list {
        display: grid;
        gap: 0;
        border-top: 1px solid var(--media-os-line-soft);
        border-left: 1px solid var(--media-os-line-soft);
      }

      .media-os-shell .media-lock-row,
      .media-os-shell .media-format-row {
        display: grid;
        grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr) auto;
        gap: 10px;
        align-items: center;
        min-width: 0;
        padding: 10px 12px;
        border-right: 1px solid var(--media-os-line-soft);
        border-bottom: 1px solid var(--media-os-line-soft);
      }

      .media-os-shell .media-lock-row span,
      .media-os-shell .media-format-row span {
        border: 1px solid var(--media-os-line-soft);
        padding: 4px 7px;
        color: var(--media-os-muted);
        font-size: 0.68rem;
        font-weight: 850;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        white-space: nowrap;
      }

      .media-os-shell .media-lock-row span.is-ready,
      .media-os-shell .media-format-row span.is-ready {
        border-color: rgba(52, 211, 153, 0.38);
        color: #bbf7d0;
      }

      .media-os-shell .media-lock-row span.is-missing,
      .media-os-shell .media-format-row span.is-missing {
        border-color: rgba(251, 191, 36, 0.42);
        color: #fde68a;
      }

      @media (max-width: 980px) {
        .media-os-shell .media-intelligence-grid,
        .media-os-shell .media-model-matrix {
          grid-template-columns: 1fr;
        }

        .media-os-shell .media-lock-row,
        .media-os-shell .media-format-row {
          grid-template-columns: 1fr;
        }
      }

      

      /* MEDIA-STUDIO-PHASE3B-PRODUCT-LOCK-PROMPT-COMPILER */
      .media-os-shell .media-compiler-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(300px, 0.92fr);
        gap: 0;
        border-top: 1px solid var(--media-os-line-soft);
        border-left: 1px solid var(--media-os-line-soft);
      }

      .media-os-shell .media-compiler-cell {
        display: grid;
        gap: 12px;
        min-width: 0;
        padding: 14px;
        border-right: 1px solid var(--media-os-line-soft);
        border-bottom: 1px solid var(--media-os-line-soft);
        background: rgba(255, 255, 255, 0.012);
      }

      .media-os-shell .media-compiler-block {
        display: grid;
        gap: 8px;
        min-width: 0;
        padding: 12px;
        border: 1px solid var(--media-os-line-soft);
        background: rgba(2, 7, 17, 0.28);
      }

      .media-os-shell .media-compiler-block strong {
        color: var(--media-os-text);
        overflow-wrap: anywhere;
      }

      .media-os-shell .media-compiler-block p {
        margin: 0;
        color: var(--media-os-muted);
        line-height: 1.45;
        overflow-wrap: anywhere;
      }

      .media-os-shell .media-compiler-code {
        display: block;
        min-height: 94px;
        max-height: 260px;
        overflow: auto;
        white-space: pre-wrap;
        word-break: break-word;
        padding: 12px;
        border: 1px solid var(--media-os-line-soft);
        background: rgba(0, 0, 0, 0.32);
        color: var(--media-os-text);
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
        font-size: 0.78rem;
        line-height: 1.5;
      }

      .media-os-shell .media-compiler-mini-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0;
        border-top: 1px solid var(--media-os-line-soft);
        border-left: 1px solid var(--media-os-line-soft);
      }

      .media-os-shell .media-compiler-mini {
        display: grid;
        gap: 7px;
        min-width: 0;
        padding: 10px 12px;
        border-right: 1px solid var(--media-os-line-soft);
        border-bottom: 1px solid var(--media-os-line-soft);
      }

      .media-os-shell .media-compiler-mini span {
        color: var(--media-os-muted);
        font-size: 0.72rem;
        font-weight: 850;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }

      .media-os-shell .media-compiler-mini strong {
        color: var(--media-os-text);
        overflow-wrap: anywhere;
      }

      .media-os-shell .media-compiler-chip-row {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }

      .media-os-shell .media-compiler-chip-row span {
        border: 1px solid var(--media-os-line-soft);
        padding: 4px 7px;
        color: var(--media-os-muted);
        font-size: 0.68rem;
        font-weight: 850;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }

      .media-os-shell .media-compiler-chip-row span.is-ready {
        border-color: rgba(52, 211, 153, 0.38);
        color: #bbf7d0;
      }

      .media-os-shell .media-compiler-chip-row span.is-critical {
        border-color: rgba(251, 191, 36, 0.42);
        color: #fde68a;
      }

      @media (max-width: 980px) {
        .media-os-shell .media-compiler-grid,
        .media-os-shell .media-compiler-mini-grid {
          grid-template-columns: 1fr;
        }
      }

      

      /* MEDIA-STUDIO-PHASE3C-SCENE-PLANNER-START-END-FRAME-WORKFLOW */
      .media-os-shell .media-scene-planner-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(320px, 0.88fr);
        gap: 0;
        border-top: 1px solid var(--media-os-line-soft);
        border-left: 1px solid var(--media-os-line-soft);
      }

      .media-os-shell .media-scene-planner-cell {
        display: grid;
        gap: 12px;
        min-width: 0;
        padding: 14px;
        border-right: 1px solid var(--media-os-line-soft);
        border-bottom: 1px solid var(--media-os-line-soft);
        background: rgba(255, 255, 255, 0.012);
      }

      .media-os-shell .media-scene-table {
        display: grid;
        gap: 0;
        border-top: 1px solid var(--media-os-line-soft);
        border-left: 1px solid var(--media-os-line-soft);
      }

      .media-os-shell .media-scene-row {
        display: grid;
        grid-template-columns: minmax(90px, 0.45fr) minmax(0, 1.2fr) minmax(0, 1.3fr) minmax(110px, 0.6fr);
        gap: 10px;
        align-items: start;
        min-width: 0;
        padding: 10px 12px;
        border-right: 1px solid var(--media-os-line-soft);
        border-bottom: 1px solid var(--media-os-line-soft);
      }

      .media-os-shell .media-scene-row strong {
        color: var(--media-os-text);
        overflow-wrap: anywhere;
      }

      .media-os-shell .media-scene-row p {
        margin: 0;
        color: var(--media-os-muted);
        line-height: 1.45;
        overflow-wrap: anywhere;
      }

      .media-os-shell .media-scene-status {
        display: inline-flex;
        width: fit-content;
        border: 1px solid var(--media-os-line-soft);
        padding: 4px 7px;
        color: var(--media-os-muted);
        font-size: 0.68rem;
        font-weight: 850;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        white-space: nowrap;
      }

      .media-os-shell .media-scene-status.is-ready {
        border-color: rgba(52, 211, 153, 0.38);
        color: #bbf7d0;
      }

      .media-os-shell .media-scene-status.is-warning {
        border-color: rgba(251, 191, 36, 0.42);
        color: #fde68a;
      }

      .media-os-shell .media-frame-card {
        display: grid;
        gap: 8px;
        min-width: 0;
        padding: 12px;
        border: 1px solid var(--media-os-line-soft);
        background: rgba(2, 7, 17, 0.28);
      }

      .media-os-shell .media-frame-card strong {
        color: var(--media-os-text);
        overflow-wrap: anywhere;
      }

      .media-os-shell .media-frame-card p {
        margin: 0;
        color: var(--media-os-muted);
        line-height: 1.45;
        overflow-wrap: anywhere;
      }

      .media-os-shell .media-frame-code {
        display: block;
        white-space: pre-wrap;
        word-break: break-word;
        max-height: 220px;
        overflow: auto;
        padding: 11px;
        border: 1px solid var(--media-os-line-soft);
        background: rgba(0, 0, 0, 0.32);
        color: var(--media-os-text);
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
        font-size: 0.76rem;
        line-height: 1.48;
      }

      .media-os-shell .media-frame-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }

      .media-os-shell .media-frame-tags span {
        border: 1px solid var(--media-os-line-soft);
        padding: 4px 7px;
        color: var(--media-os-muted);
        font-size: 0.68rem;
        font-weight: 850;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }

      .media-os-shell .media-frame-tags span.is-ready {
        border-color: rgba(52, 211, 153, 0.38);
        color: #bbf7d0;
      }

      .media-os-shell .media-frame-tags span.is-risk {
        border-color: rgba(251, 191, 36, 0.42);
        color: #fde68a;
      }

      @media (max-width: 1100px) {
        .media-os-shell .media-scene-planner-grid,
        .media-os-shell .media-scene-row {
          grid-template-columns: 1fr;
        }
      }

      

      /* MEDIA-STUDIO-UX1A-INTERNATIONAL-CREATION-STUDIO-SHELL */
      .media-os-shell .media-creation-studio-shell {
        display: grid;
        gap: 14px;
        padding: 16px;
        border-top: 1px solid var(--media-os-line-soft);
        border-bottom: 1px solid var(--media-os-line-soft);
        background:
          radial-gradient(circle at 12% 12%, rgba(45, 212, 191, 0.13), transparent 30%),
          linear-gradient(180deg, rgba(2, 7, 17, 0.88), rgba(2, 7, 17, 0.72));
      }

      .media-os-shell .media-creation-studio-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 14px;
      }

      .media-os-shell .media-creation-studio-head h3 {
        margin: 0;
        color: var(--media-os-text);
        font-size: clamp(1.45rem, 2.3vw, 2.25rem);
        line-height: 0.98;
        letter-spacing: -0.045em;
      }

      .media-os-shell .media-creation-studio-head p {
        max-width: 860px;
        margin: 7px 0 0;
        color: var(--media-os-muted);
        line-height: 1.45;
      }

      .media-os-shell .media-creation-grid {
        display: grid;
        grid-template-columns: 250px minmax(0, 1fr) minmax(320px, 0.42fr);
        gap: 12px;
        align-items: stretch;
      }

      .media-os-shell .media-creation-rail,
      .media-os-shell .media-creation-canvas,
      .media-os-shell .media-creation-inspector {
        min-width: 0;
        border: 1px solid var(--media-os-line-soft);
        background: rgba(4, 12, 25, 0.72);
      }

      .media-os-shell .media-creation-rail {
        display: grid;
        align-content: start;
        gap: 10px;
        padding: 12px;
      }

      .media-os-shell .media-mode-card {
        width: 100%;
        display: grid;
        gap: 5px;
        text-align: left;
        padding: 12px;
        border: 1px solid var(--media-os-line-soft);
        background: rgba(255, 255, 255, 0.018);
        color: var(--media-os-muted);
        cursor: pointer;
      }

      .media-os-shell .media-mode-card strong {
        color: var(--media-os-text);
        font-size: 0.95rem;
      }

      .media-os-shell .media-mode-card span {
        color: var(--media-os-muted);
        font-size: 0.76rem;
        line-height: 1.35;
      }

      .media-os-shell .media-mode-card.is-active {
        border-color: rgba(45, 212, 191, 0.72);
        background: linear-gradient(135deg, rgba(20, 184, 166, 0.2), rgba(37, 99, 235, 0.08));
        box-shadow: inset 0 0 0 1px rgba(45, 212, 191, 0.16);
      }

      .media-os-shell .media-provider-select-wrap {
        display: grid;
        gap: 7px;
        margin-top: 4px;
      }

      .media-os-shell .media-provider-select-wrap label {
        color: var(--media-os-muted);
        font-size: 0.68rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .media-os-shell .media-provider-select {
        width: 100%;
        border: 1px solid var(--media-os-line-soft);
        background: rgba(2, 7, 17, 0.8);
        color: var(--media-os-text);
        padding: 10px 11px;
        font-weight: 800;
      }

      .media-os-shell .media-provider-note {
        color: var(--media-os-muted);
        font-size: 0.76rem;
        line-height: 1.4;
      }

      .media-os-shell .media-creation-canvas {
        display: grid;
        gap: 12px;
        padding: 12px;
      }

      .media-os-shell .media-generation-status {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 12px;
        align-items: center;
        padding: 12px;
        border: 1px solid var(--media-os-line-soft);
        background: rgba(0, 0, 0, 0.24);
      }

      .media-os-shell .media-generation-status strong {
        color: var(--media-os-text);
      }

      .media-os-shell .media-generation-status p {
        margin: 4px 0 0;
        color: var(--media-os-muted);
        line-height: 1.4;
      }

      .media-os-shell .media-generation-pill {
        border: 1px solid rgba(251, 191, 36, 0.45);
        color: #fde68a;
        padding: 6px 9px;
        font-size: 0.7rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        white-space: nowrap;
      }

      .media-os-shell .media-generation-pill.is-ready {
        border-color: rgba(52, 211, 153, 0.45);
        color: #bbf7d0;
      }

      .media-os-shell .media-creation-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .media-os-shell .media-creation-actions button,
      .media-os-shell .media-creation-actions a {
        border: 1px solid var(--media-os-line-soft);
        background: rgba(15, 23, 42, 0.86);
        color: var(--media-os-text);
        padding: 9px 12px;
        font-weight: 900;
        text-decoration: none;
      }

      .media-os-shell .media-creation-actions .is-primary {
        border-color: rgba(45, 212, 191, 0.72);
        background: linear-gradient(135deg, #22d3ee, #2dd4bf);
        color: #03121a;
      }

      .media-os-shell .media-creation-preview-frame {
        min-height: 360px;
        border: 1px solid rgba(148, 163, 184, 0.18);
        background:
          linear-gradient(135deg, rgba(15, 23, 42, 0.64), rgba(2, 6, 23, 0.96)),
          radial-gradient(circle at 50% 0%, rgba(45, 212, 191, 0.08), transparent 38%);
        overflow: hidden;
      }

      .media-os-shell .media-creation-preview-frame #mediaOutputPreviewPanel,
      .media-os-shell .media-creation-preview-frame .media-card {
        border: 0;
        background: transparent;
        box-shadow: none;
      }

      .media-os-shell .media-creation-generator-frame #mediaGeneratorPanel,
      .media-os-shell .media-creation-generator-frame .media-card,
      .media-os-shell .media-creation-promptops-frame #mediaPromptBuilderPanel,
      .media-os-shell .media-creation-promptops-frame .media-card {
        border-color: rgba(148, 163, 184, 0.16);
        background: rgba(2, 7, 17, 0.48);
      }

      .media-os-shell .media-creation-inspector {
        display: grid;
        align-content: start;
        gap: 10px;
        padding: 12px;
      }

      .media-os-shell .media-inspector-tabs {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 6px;
      }

      .media-os-shell .media-inspector-tabs span {
        border: 1px solid var(--media-os-line-soft);
        padding: 7px 8px;
        color: var(--media-os-muted);
        font-size: 0.68rem;
        font-weight: 900;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }

      .media-os-shell .media-inspector-card {
        display: grid;
        gap: 8px;
        padding: 11px;
        border: 1px solid var(--media-os-line-soft);
        background: rgba(255, 255, 255, 0.014);
      }

      .media-os-shell .media-inspector-card strong {
        color: var(--media-os-text);
      }

      .media-os-shell .media-inspector-card p {
        margin: 0;
        color: var(--media-os-muted);
        line-height: 1.4;
      }

      .media-os-shell .media-inspector-row {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        border-top: 1px solid rgba(148, 163, 184, 0.12);
        padding-top: 8px;
        color: var(--media-os-muted);
        font-size: 0.78rem;
      }

      .media-os-shell .media-inspector-row b {
        color: var(--media-os-text);
      }

      .media-os-shell .media-advanced-stack {
        display: grid;
        gap: 0;
      }

      .media-os-shell .media-advanced-stack details {
        border-top: 1px solid var(--media-os-line-soft);
        background: rgba(2, 7, 17, 0.44);
      }

      .media-os-shell .media-advanced-stack summary {
        cursor: pointer;
        padding: 13px 16px;
        color: var(--media-os-text);
        font-weight: 950;
        letter-spacing: -0.02em;
      }

      .media-os-shell .media-advanced-stack details > *:not(summary) {
        margin-left: 0;
        margin-right: 0;
      }

      @media (max-width: 1260px) {
        .media-os-shell .media-creation-grid {
          grid-template-columns: 1fr;
        }

        .media-os-shell .media-creation-rail {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 760px) {
        .media-os-shell .media-creation-studio-head,
        .media-os-shell .media-generation-status {
          grid-template-columns: 1fr;
          display: grid;
        }

        .media-os-shell .media-creation-rail,
        .media-os-shell .media-inspector-tabs {
          grid-template-columns: 1fr;
        }
      }

      

      /* MEDIA-STUDIO-UX1B-REPAIR-DUPLICATE-PREVIEW-QUEUE-ID-AUTHORITY */
      /* MEDIA-STUDIO-UX1B-PREVIEW-FIRST-CANVAS-QUEUE-THEME-COMPRESSION */
      .media-os-shell .media-creation-canvas {
        grid-template-rows: auto auto minmax(420px, auto) auto;
      }

      .media-os-shell .media-preview-command-row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 10px;
        align-items: center;
        padding: 12px;
        border: 1px solid var(--media-os-line-soft);
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.72), rgba(2, 7, 17, 0.92));
      }

      .media-os-shell .media-preview-command-row strong {
        color: var(--media-os-text);
        font-size: 1rem;
      }

      .media-os-shell .media-preview-command-row p {
        margin: 4px 0 0;
        color: var(--media-os-muted);
        line-height: 1.4;
      }

      .media-os-shell .media-preview-status-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        justify-content: flex-end;
      }

      .media-os-shell .media-preview-status-grid span {
        border: 1px solid var(--media-os-line-soft);
        padding: 5px 8px;
        color: var(--media-os-muted);
        font-size: 0.68rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        white-space: nowrap;
      }

      .media-os-shell .media-preview-status-grid span.is-warning {
        border-color: rgba(251, 191, 36, 0.45);
        color: #fde68a;
      }

      .media-os-shell .media-preview-status-grid span.is-ready {
        border-color: rgba(52, 211, 153, 0.45);
        color: #bbf7d0;
      }

      .media-os-shell .media-creation-preview-frame {
        position: relative;
        display: grid;
        align-content: stretch;
        min-height: 460px;
        border-radius: 18px;
        border: 1px solid rgba(45, 212, 191, 0.24);
        box-shadow:
          inset 0 0 0 1px rgba(255, 255, 255, 0.025),
          0 24px 70px rgba(0, 0, 0, 0.26);
      }

      .media-os-shell .media-empty-preview-state {
        display: grid;
        place-items: center;
        min-height: 220px;
        padding: 30px;
        text-align: center;
        border-bottom: 1px solid rgba(148, 163, 184, 0.12);
        background:
          radial-gradient(circle at 50% 30%, rgba(45, 212, 191, 0.13), transparent 34%),
          radial-gradient(circle at 30% 75%, rgba(37, 99, 235, 0.1), transparent 38%);
      }

      .media-os-shell .media-empty-preview-state strong {
        display: block;
        color: var(--media-os-text);
        font-size: clamp(1.25rem, 2.3vw, 2rem);
        letter-spacing: -0.04em;
      }

      .media-os-shell .media-empty-preview-state p {
        max-width: 680px;
        margin: 8px auto 0;
        color: var(--media-os-muted);
        line-height: 1.5;
      }

      .media-os-shell .media-empty-preview-actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
        margin-top: 14px;
      }

      .media-os-shell .media-empty-preview-actions button {
        border: 1px solid var(--media-os-line-soft);
        background: rgba(15, 23, 42, 0.82);
        color: var(--media-os-text);
        padding: 9px 12px;
        font-weight: 900;
      }

      .media-os-shell .media-empty-preview-actions button.is-primary {
        border-color: rgba(45, 212, 191, 0.72);
        background: linear-gradient(135deg, #22d3ee, #2dd4bf);
        color: #03121a;
      }

      .media-os-shell .media-creation-control-drawer {
        border: 1px solid var(--media-os-line-soft);
        background: rgba(2, 7, 17, 0.54);
      }

      .media-os-shell .media-creation-control-drawer summary {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        cursor: pointer;
        padding: 12px 14px;
        color: var(--media-os-text);
        font-weight: 950;
        letter-spacing: -0.02em;
      }

      .media-os-shell .media-creation-control-drawer summary span {
        color: var(--media-os-muted);
        font-size: 0.75rem;
        font-weight: 850;
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }

      .media-os-shell .media-creation-control-drawer-body {
        display: grid;
        gap: 12px;
        padding: 0 12px 12px;
      }

      .media-os-shell .media-provider-readiness-card {
        display: grid;
        gap: 8px;
        padding: 11px;
        border: 1px solid rgba(251, 191, 36, 0.34);
        background: rgba(120, 53, 15, 0.14);
      }

      .media-os-shell .media-provider-readiness-card.is-ready {
        border-color: rgba(52, 211, 153, 0.36);
        background: rgba(6, 78, 59, 0.14);
      }

      .media-os-shell .media-provider-readiness-card strong {
        color: var(--media-os-text);
      }

      .media-os-shell .media-provider-readiness-card p {
        margin: 0;
        color: var(--media-os-muted);
        line-height: 1.4;
      }

      .media-os-shell #mediaQueuePanel button,
      .media-os-shell #mediaQueuePanel .media-button,
      .media-os-shell #mediaQueuePanel [type="button"],
      .media-os-shell .media-job-card button,
      .media-os-shell .media-queue-card button {
        border: 1px solid var(--media-os-line-soft) !important;
        background: rgba(15, 23, 42, 0.86) !important;
        color: var(--media-os-text) !important;
        padding: 9px 11px;
        font-weight: 900;
        box-shadow: none !important;
      }

      .media-os-shell #mediaQueuePanel button:hover,
      .media-os-shell .media-job-card button:hover,
      .media-os-shell .media-queue-card button:hover {
        border-color: rgba(45, 212, 191, 0.54) !important;
        background: rgba(20, 184, 166, 0.14) !important;
      }

      .media-os-shell .media-advanced-stack {
        margin-top: 14px;
        border-top: 1px solid rgba(148, 163, 184, 0.16);
      }

      .media-os-shell .media-advanced-stack details:not([open]) {
        opacity: 0.92;
      }

      .media-os-shell .media-advanced-stack details:not([open]) summary {
        border-bottom: 0;
      }

      .media-os-shell .media-advanced-stack details[open] summary {
        border-bottom: 1px solid var(--media-os-line-soft);
        background: rgba(45, 212, 191, 0.05);
      }

      .media-os-shell .media-bottom-production-drawer {
        border-top: 1px solid rgba(148, 163, 184, 0.14);
        padding-top: 12px;
      }

      @media (max-width: 900px) {
        .media-os-shell .media-preview-command-row {
          grid-template-columns: 1fr;
        }

        .media-os-shell .media-preview-status-grid {
          justify-content: flex-start;
        }
      }

      

      /* MEDIA-STUDIO-UX1C-PROVIDER-MODEL-SELECTOR-MATRIX */
      .media-os-shell .media-model-select-wrap {
        display: grid;
        gap: 7px;
        margin-top: 10px;
      }

      .media-os-shell .media-model-select-wrap label {
        color: var(--media-os-muted);
        font-size: 0.68rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .media-os-shell .media-model-select {
        width: 100%;
        border: 1px solid var(--media-os-line-soft);
        background: rgba(2, 7, 17, 0.8);
        color: var(--media-os-text);
        padding: 10px 11px;
        font-weight: 850;
      }

      .media-os-shell .media-provider-family-strip {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 6px;
        margin-top: 10px;
      }

      .media-os-shell .media-provider-family-strip span {
        border: 1px solid var(--media-os-line-soft);
        padding: 7px 8px;
        text-align: center;
        color: var(--media-os-muted);
        font-size: 0.66rem;
        font-weight: 950;
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }

      .media-os-shell .media-provider-family-strip span.is-active {
        border-color: rgba(45, 212, 191, 0.58);
        color: #99f6e4;
        background: rgba(20, 184, 166, 0.08);
      }

      .media-os-shell .media-provider-model-card {
        display: grid;
        gap: 8px;
        padding: 11px;
        border: 1px solid var(--media-os-line-soft);
        background: rgba(255, 255, 255, 0.014);
      }

      .media-os-shell .media-provider-model-card strong {
        color: var(--media-os-text);
      }

      .media-os-shell .media-provider-model-card p {
        margin: 0;
        color: var(--media-os-muted);
        line-height: 1.4;
      }

      .media-os-shell .media-model-chip-row {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }

      .media-os-shell .media-model-chip-row span {
        border: 1px solid rgba(148, 163, 184, 0.18);
        color: var(--media-os-muted);
        padding: 5px 7px;
        font-size: 0.66rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .media-os-shell .media-model-chip-row span.is-paid {
        border-color: rgba(59, 130, 246, 0.42);
        color: #bfdbfe;
      }

      .media-os-shell .media-model-chip-row span.is-local {
        border-color: rgba(52, 211, 153, 0.42);
        color: #bbf7d0;
      }

      .media-os-shell .media-model-chip-row span.is-required {
        border-color: rgba(251, 191, 36, 0.45);
        color: #fde68a;
      }

      

      /* MEDIA-STUDIO-UX-R1-CLEAN-GLOBAL-SHELL-MODE-FIRST MEDIA-STUDIO-UX-R1-REPAIR-ADVANCED-DETAILS-MARKER */
      .media-os-shell .media-system-status-drawer,
      .media-os-shell .media-advanced-system-drawer,
      .media-os-shell details.mediaStudioAdvancedStack,
      .media-os-shell details.media-studio-advanced-stack {
        border: 1px solid rgba(148, 163, 184, 0.14);
        background: rgba(2, 7, 17, 0.62);
        margin: 14px 0;
      }

      .media-os-shell .media-system-status-drawer > summary,
      .media-os-shell .media-advanced-system-drawer > summary,
      .media-os-shell details.mediaStudioAdvancedStack > summary,
      .media-os-shell details.media-studio-advanced-stack > summary {
        cursor: pointer;
        list-style: none;
        padding: 13px 16px;
        color: rgba(226, 232, 240, 0.92);
        font-weight: 950;
        letter-spacing: -0.02em;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .media-os-shell .media-system-status-drawer > summary::-webkit-details-marker,
      .media-os-shell .media-advanced-system-drawer > summary::-webkit-details-marker,
      .media-os-shell details.mediaStudioAdvancedStack > summary::-webkit-details-marker,
      .media-os-shell details.media-studio-advanced-stack > summary::-webkit-details-marker {
        display: none;
      }

      .media-os-shell .media-system-status-drawer > summary::after,
      .media-os-shell .media-advanced-system-drawer > summary::after,
      .media-os-shell details.mediaStudioAdvancedStack > summary::after,
      .media-os-shell details.media-studio-advanced-stack > summary::after {
        content: "Open";
        border: 1px solid rgba(45, 212, 191, 0.34);
        color: #99f6e4;
        padding: 4px 8px;
        font-size: 0.66rem;
        font-weight: 950;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .media-os-shell .media-system-status-drawer[open] > summary::after,
      .media-os-shell .media-advanced-system-drawer[open] > summary::after,
      .media-os-shell details.mediaStudioAdvancedStack[open] > summary::after,
      .media-os-shell details.media-studio-advanced-stack[open] > summary::after {
        content: "Close";
      }

      .media-os-shell .media-system-status-body,
      .media-os-shell .media-advanced-system-body {
        padding: 0 16px 16px;
      }

      .media-os-shell .mediaStudioAdvancedStack:not([open]) > *:not(summary),
      .media-os-shell .media-studio-advanced-stack:not([open]) > *:not(summary) {
        display: none !important;
      }

      .media-os-shell .media-r1-start-hint {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        border: 1px solid rgba(45, 212, 191, 0.32);
        background: rgba(20, 184, 166, 0.08);
        color: #99f6e4;
        padding: 7px 10px;
        font-size: 0.72rem;
        font-weight: 950;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin-bottom: 10px;
      }

      .media-os-shell .media-r1-quiet-note {
        color: var(--media-os-muted);
        line-height: 1.45;
        max-width: 760px;
      }

      .media-os-shell .media-creation-studio,
      .media-os-shell .media-studio-creation-shell,
      .media-os-shell #mediaStudioCreationCanvas {
        scroll-margin-top: 24px;
      }

      .media-os-shell .media-creation-mode-card,
      .media-os-shell [data-media-creation-mode],
      .media-os-shell [data-media-mode] {
        transition: border-color 140ms ease, background 140ms ease, transform 140ms ease;
      }

      .media-os-shell [data-media-creation-mode]:hover,
      .media-os-shell [data-media-mode]:hover {
        transform: translateY(-1px);
      }

      .media-os-shell .media-generator-warning,
      .media-os-shell .media-long-system-message {
        color: rgba(203, 213, 225, 0.88);
        line-height: 1.45;
      }

      .media-os-shell .media-system-status-drawer .media-command-header,
      .media-os-shell .media-system-status-drawer .media-workflow-strip {
        margin-top: 10px;
      }

      

      /* MEDIA-STUDIO-UX-R2R-TRUE-MODE-SPECIFIC-CANVAS-REPAIR */
      .media-os-shell .media-r2r-studio {
        display: grid;
        grid-template-columns: 220px minmax(0, 1fr) 320px;
        gap: 16px;
        margin-top: 14px;
        min-height: 560px;
      }

      .media-os-shell .media-r2r-rail,
      .media-os-shell .media-r2r-main,
      .media-os-shell .media-r2r-inspector {
        border: 1px solid rgba(148, 163, 184, 0.14);
        background: radial-gradient(circle at top left, rgba(20, 184, 166, 0.12), transparent 34%), rgba(2, 6, 14, 0.78);
      }

      .media-os-shell .media-r2r-rail {
        padding: 14px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .media-os-shell .media-r2r-label {
        color: rgba(148, 163, 184, 0.9);
        font-size: 0.68rem;
        font-weight: 950;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      .media-os-shell .media-r2r-mode {
        border: 1px solid rgba(148, 163, 184, 0.16);
        background: rgba(15, 23, 42, 0.52);
        padding: 13px;
        display: grid;
        gap: 6px;
        text-align: left;
        color: rgba(226, 232, 240, 0.92);
        cursor: pointer;
      }

      .media-os-shell .media-r2r-mode.is-active {
        border-color: rgba(45, 212, 191, 0.85);
        background: linear-gradient(135deg, rgba(20, 184, 166, 0.22), rgba(59, 130, 246, 0.06)), rgba(15, 23, 42, 0.78);
      }

      .media-os-shell .media-r2r-mode strong {
        color: #f8fafc;
        font-weight: 1000;
      }

      .media-os-shell .media-r2r-mode span {
        color: rgba(203, 213, 225, 0.78);
        font-size: 0.82rem;
        line-height: 1.35;
      }

      .media-os-shell .media-r2r-provider-box {
        margin-top: auto;
        display: grid;
        gap: 10px;
        padding-top: 12px;
        border-top: 1px solid rgba(148, 163, 184, 0.12);
      }

      .media-os-shell .media-r2r-select,
      .media-os-shell .media-r2r-textarea {
        width: 100%;
        border: 1px solid rgba(148, 163, 184, 0.18);
        background: rgba(2, 6, 14, 0.72);
        color: rgba(248, 250, 252, 0.96);
        padding: 11px 12px;
        font-weight: 850;
      }

      .media-os-shell .media-r2r-textarea {
        min-height: 110px;
        resize: vertical;
        line-height: 1.45;
      }

      .media-os-shell .media-r2r-main {
        display: grid;
        grid-template-rows: auto minmax(300px, 1fr) auto;
        min-width: 0;
      }

      .media-os-shell .media-r2r-head {
        padding: 18px 20px 12px;
        border-bottom: 1px solid rgba(148, 163, 184, 0.12);
        display: flex;
        justify-content: space-between;
        gap: 18px;
        align-items: flex-start;
      }

      .media-os-shell .media-r2r-title {
        font-size: clamp(1.5rem, 2.7vw, 2.8rem);
        line-height: 0.96;
        letter-spacing: -0.07em;
        font-weight: 1000;
        color: #f8fafc;
      }

      .media-os-shell .media-r2r-copy {
        margin-top: 8px;
        max-width: 780px;
        color: rgba(203, 213, 225, 0.82);
        line-height: 1.45;
      }

      .media-os-shell .media-r2r-pill {
        border: 1px solid rgba(234, 179, 8, 0.48);
        color: #fde68a;
        background: rgba(234, 179, 8, 0.06);
        padding: 7px 10px;
        text-transform: uppercase;
        font-size: 0.68rem;
        letter-spacing: 0.09em;
        font-weight: 950;
        white-space: nowrap;
      }

      .media-os-shell .media-r2r-live-canvas {
        margin: 18px 20px;
        border: 1px solid rgba(45, 212, 191, 0.2);
        background: radial-gradient(circle at 50% 10%, rgba(45, 212, 191, 0.13), transparent 34%), linear-gradient(135deg, rgba(15, 23, 42, 0.68), rgba(2, 6, 14, 0.92));
        min-height: 330px;
        display: grid;
        place-items: center;
        text-align: center;
        padding: 24px;
      }

      .media-os-shell .media-r2r-icon {
        width: 56px;
        height: 56px;
        border-radius: 18px;
        border: 1px solid rgba(45, 212, 191, 0.3);
        display: grid;
        place-items: center;
        color: #99f6e4;
        font-weight: 1000;
        margin: 0 auto 16px;
        background: rgba(20, 184, 166, 0.08);
      }

      .media-os-shell .media-r2r-canvas-title {
        font-size: clamp(1.6rem, 3vw, 2.8rem);
        line-height: 0.98;
        letter-spacing: -0.06em;
        font-weight: 1000;
        color: #f8fafc;
      }

      .media-os-shell .media-r2r-canvas-copy {
        margin: 12px auto 0;
        max-width: 620px;
        color: rgba(203, 213, 225, 0.82);
        line-height: 1.5;
      }

      .media-os-shell .media-r2r-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: center;
        margin-top: 20px;
      }

      .media-os-shell .media-r2r-primary {
        border: 0;
        background: #22d3ee;
        color: #001018;
        font-weight: 1000;
        padding: 13px 18px;
        cursor: pointer;
      }

      .media-os-shell .media-r2r-secondary {
        border: 1px solid rgba(148, 163, 184, 0.2);
        background: rgba(15, 23, 42, 0.72);
        color: rgba(248, 250, 252, 0.94);
        font-weight: 950;
        padding: 12px 16px;
        cursor: pointer;
      }

      .media-os-shell .media-r2r-bottom {
        border-top: 1px solid rgba(148, 163, 184, 0.12);
        padding: 14px 20px 18px;
        display: grid;
        gap: 12px;
      }

      .media-os-shell .media-r2r-controls {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 130px 120px 130px;
        gap: 10px;
      }

      .media-os-shell .media-r2r-frame-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        margin-bottom: 12px;
      }

      .media-os-shell .media-r2r-frame-drop {
        border: 1px dashed rgba(148, 163, 184, 0.28);
        background: rgba(15, 23, 42, 0.48);
        min-height: 122px;
        display: grid;
        place-items: center;
        color: rgba(203, 213, 225, 0.78);
        font-weight: 900;
        text-align: center;
        padding: 12px;
        cursor: pointer;
      }

      .media-os-shell .media-r2r-timeline {
        display: grid;
        gap: 10px;
        width: min(840px, 100%);
        margin: 0 auto;
        text-align: left;
      }

      .media-os-shell .media-r2r-timeline-row {
        display: grid;
        grid-template-columns: 42px minmax(0, 1fr) auto;
        gap: 12px;
        align-items: center;
        border: 1px solid rgba(148, 163, 184, 0.16);
        background: rgba(15, 23, 42, 0.62);
        padding: 12px;
      }

      .media-os-shell .media-r2r-step {
        width: 34px;
        height: 34px;
        border-radius: 999px;
        display: grid;
        place-items: center;
        background: rgba(20, 184, 166, 0.12);
        color: #99f6e4;
        font-weight: 1000;
      }

      .media-os-shell .media-r2r-step-title {
        font-weight: 1000;
        color: #f8fafc;
      }

      .media-os-shell .media-r2r-step-copy {
        color: rgba(203, 213, 225, 0.76);
        font-size: 0.82rem;
        line-height: 1.35;
        margin-top: 2px;
      }

      .media-os-shell .media-r2r-inspector {
        padding: 14px;
        display: grid;
        align-content: start;
        gap: 12px;
      }

      .media-os-shell .media-r2r-card {
        border: 1px solid rgba(148, 163, 184, 0.15);
        background: rgba(15, 23, 42, 0.58);
        padding: 14px;
      }

      .media-os-shell .media-r2r-card-title {
        color: #f8fafc;
        font-weight: 1000;
        letter-spacing: -0.02em;
        margin-bottom: 10px;
      }

      .media-os-shell .media-r2r-kv {
        display: grid;
        gap: 8px;
      }

      .media-os-shell .media-r2r-kv-row {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        border-top: 1px solid rgba(148, 163, 184, 0.1);
        padding-top: 8px;
        color: rgba(203, 213, 225, 0.84);
        font-size: 0.82rem;
      }

      .media-os-shell .media-r2r-kv-row strong {
        color: rgba(248, 250, 252, 0.94);
        text-align: right;
      }

      .media-os-shell .media-r2r-chip-row {
        display: flex;
        flex-wrap: wrap;
        gap: 7px;
      }

      .media-os-shell .media-r2r-chip {
        border: 1px solid rgba(148, 163, 184, 0.18);
        color: rgba(226, 232, 240, 0.88);
        background: rgba(2, 6, 14, 0.45);
        padding: 5px 8px;
        font-size: 0.68rem;
        letter-spacing: 0.07em;
        text-transform: uppercase;
        font-weight: 950;
      }

      .media-os-shell .media-r2r-chip.is-ready {
        border-color: rgba(45, 212, 191, 0.42);
        color: #99f6e4;
      }

      .media-os-shell .media-r2r-chip.is-warning {
        border-color: rgba(234, 179, 8, 0.44);
        color: #fde68a;
      }

      @media (max-width: 1180px) {
        .media-os-shell .media-r2r-studio {
          grid-template-columns: 1fr;
        }

        .media-os-shell .media-r2r-rail {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .media-os-shell .media-r2r-provider-box {
          grid-column: 1 / -1;
        }

        .media-os-shell .media-r2r-controls {
          grid-template-columns: 1fr;
        }
      }

      

      /* MEDIA-STUDIO-UX-R2S-FIRST-SCREEN-POLISH-ADVANCED-CLEANUP */
      .media-os-shell .media-r2r-studio {
        min-height: calc(100vh - 142px);
      }

      .media-os-shell .media-r2r-head {
        min-height: 104px;
      }

      .media-os-shell .media-r2r-live-canvas {
        min-height: clamp(270px, 35vh, 410px);
      }

      .media-os-shell .media-r2r-bottom {
        position: relative;
      }

      .media-os-shell .media-r2s-control-wrap {
        display: grid;
        gap: 6px;
        min-width: 0;
      }

      .media-os-shell .media-r2s-control-label {
        color: rgba(148, 163, 184, 0.9);
        font-size: 0.66rem;
        font-weight: 950;
        letter-spacing: 0.1em;
        text-transform: uppercase;
      }

      .media-os-shell .media-r2s-primary-wrap {
        display: grid;
        align-items: end;
      }

      .media-os-shell .media-r2s-primary-wrap .media-r2r-primary {
        min-height: 52px;
      }

      .media-os-shell .media-r2r-controls.media-r2s-controls-image {
        grid-template-columns: minmax(0, 1fr) 155px 150px 150px;
      }

      .media-os-shell .media-r2r-controls.media-r2s-controls-video {
        grid-template-columns: minmax(0, 1fr) 130px 140px 160px;
      }

      .media-os-shell .media-r2r-controls.media-r2s-controls-voice {
        grid-template-columns: minmax(0, 1fr) 160px 150px 160px;
      }

      .media-os-shell .media-r2r-controls.media-r2s-controls-campaign {
        grid-template-columns: minmax(0, 1fr) 170px 150px 180px;
      }

      .media-os-shell .media-r2s-mode-note {
        border: 1px solid rgba(45, 212, 191, 0.18);
        background: rgba(20, 184, 166, 0.06);
        color: rgba(204, 251, 241, 0.9);
        padding: 9px 11px;
        font-size: 0.78rem;
        line-height: 1.4;
      }

      .media-os-shell .media-r2s-advanced-menu {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding: 10px 0 14px;
      }

      .media-os-shell .media-r2s-advanced-chip {
        border: 1px solid rgba(148, 163, 184, 0.2);
        background: rgba(15, 23, 42, 0.66);
        color: rgba(226, 232, 240, 0.9);
        padding: 7px 10px;
        font-size: 0.7rem;
        font-weight: 950;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .media-os-shell .media-system-status-drawer[open],
      .media-os-shell details.mediaStudioAdvancedStack[open],
      .media-os-shell details.media-studio-advanced-stack[open],
      .media-os-shell .media-advanced-system-drawer[open] {
        max-height: 76vh;
        overflow: auto;
        overscroll-behavior: contain;
      }

      .media-os-shell .media-system-status-drawer > summary,
      .media-os-shell details.mediaStudioAdvancedStack > summary,
      .media-os-shell details.media-studio-advanced-stack > summary,
      .media-os-shell .media-advanced-system-drawer > summary {
        position: sticky;
        top: 0;
        z-index: 5;
        backdrop-filter: blur(10px);
        background: rgba(2, 6, 14, 0.94);
      }

      .media-os-shell .media-r2s-raw-kv-cleanup {
        display: grid;
        gap: 8px;
      }

      .media-os-shell .media-r2s-raw-kv-row {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        border: 1px solid rgba(148, 163, 184, 0.12);
        background: rgba(15, 23, 42, 0.45);
        padding: 9px 10px;
      }

      .media-os-shell .media-r2s-raw-kv-row span {
        color: rgba(148, 163, 184, 0.9);
        font-size: 0.74rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-weight: 950;
      }

      .media-os-shell .media-r2s-raw-kv-row strong {
        color: rgba(248, 250, 252, 0.94);
        text-align: right;
      }

      @media (max-width: 1180px) {
        .media-os-shell .media-r2r-controls.media-r2s-controls-image,
        .media-os-shell .media-r2r-controls.media-r2s-controls-video,
        .media-os-shell .media-r2r-controls.media-r2s-controls-voice,
        .media-os-shell .media-r2r-controls.media-r2s-controls-campaign {
          grid-template-columns: 1fr;
        }
      }

      

      /* MEDIA-STUDIO-UX-R3-PROFESSIONAL-PROVIDER-MODEL-PICKER */
      .media-os-shell .media-r3-provider-picker {
        display: grid;
        gap: 12px;
        padding-top: 12px;
        border-top: 1px solid rgba(148, 163, 184, 0.12);
      }

      .media-os-shell .media-r3-provider-tabs {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }

      .media-os-shell .media-r3-provider-tab {
        border: 1px solid rgba(148, 163, 184, 0.16);
        background: rgba(15, 23, 42, 0.6);
        color: rgba(226, 232, 240, 0.88);
        padding: 6px 8px;
        font-size: 0.66rem;
        font-weight: 950;
        text-transform: uppercase;
        letter-spacing: 0.07em;
      }

      .media-os-shell .media-r3-provider-tab.is-active {
        border-color: rgba(45, 212, 191, 0.72);
        color: #99f6e4;
        background: rgba(20, 184, 166, 0.12);
      }

      .media-os-shell .media-r3-provider-list {
        display: grid;
        gap: 8px;
        max-height: 360px;
        overflow: auto;
        padding-right: 2px;
        overscroll-behavior: contain;
      }

      .media-os-shell .media-r3-provider-card {
        border: 1px solid rgba(148, 163, 184, 0.16);
        background:
          radial-gradient(circle at top left, rgba(20, 184, 166, 0.08), transparent 38%),
          rgba(15, 23, 42, 0.62);
        padding: 10px;
        display: grid;
        gap: 8px;
      }

      .media-os-shell .media-r3-provider-card.is-featured {
        border-color: rgba(45, 212, 191, 0.44);
      }

      .media-os-shell .media-r3-provider-card.is-selected {
        border-color: rgba(34, 211, 238, 0.82);
        box-shadow: inset 0 0 0 1px rgba(34, 211, 238, 0.16);
      }

      .media-os-shell .media-r3-provider-head {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 10px;
      }

      .media-os-shell .media-r3-provider-title {
        color: #f8fafc;
        font-weight: 1000;
        line-height: 1.15;
      }

      .media-os-shell .media-r3-provider-subtitle {
        color: rgba(203, 213, 225, 0.72);
        font-size: 0.72rem;
        line-height: 1.35;
        margin-top: 3px;
      }

      .media-os-shell .media-r3-provider-status {
        border: 1px solid rgba(148, 163, 184, 0.2);
        color: rgba(226, 232, 240, 0.86);
        background: rgba(2, 6, 14, 0.45);
        padding: 4px 6px;
        font-size: 0.6rem;
        font-weight: 1000;
        text-transform: uppercase;
        letter-spacing: 0.07em;
        white-space: nowrap;
      }

      .media-os-shell .media-r3-provider-status.is-prompt {
        border-color: rgba(45, 212, 191, 0.48);
        color: #99f6e4;
      }

      .media-os-shell .media-r3-provider-status.is-setup {
        border-color: rgba(234, 179, 8, 0.5);
        color: #fde68a;
      }

      .media-os-shell .media-r3-provider-status.is-local {
        border-color: rgba(251, 146, 60, 0.5);
        color: #fed7aa;
      }

      .media-os-shell .media-r3-provider-status.is-connected {
        border-color: rgba(34, 197, 94, 0.55);
        color: #bbf7d0;
      }

      .media-os-shell .media-r3-provider-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
      }

      .media-os-shell .media-r3-provider-chip {
        border: 1px solid rgba(148, 163, 184, 0.14);
        color: rgba(203, 213, 225, 0.82);
        background: rgba(2, 6, 14, 0.36);
        padding: 4px 6px;
        font-size: 0.6rem;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        font-weight: 950;
      }

      .media-os-shell .media-r3-provider-actions {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
      }

      .media-os-shell .media-r3-provider-action {
        border: 1px solid rgba(148, 163, 184, 0.18);
        background: rgba(15, 23, 42, 0.82);
        color: rgba(248, 250, 252, 0.92);
        font-weight: 950;
        font-size: 0.72rem;
        padding: 7px 8px;
        cursor: pointer;
      }

      .media-os-shell .media-r3-provider-action.is-primary {
        border-color: rgba(34, 211, 238, 0.45);
        background: rgba(34, 211, 238, 0.12);
        color: #a5f3fc;
      }

      .media-os-shell .media-r3-provider-note {
        border: 1px solid rgba(234, 179, 8, 0.22);
        background: rgba(234, 179, 8, 0.05);
        color: rgba(253, 230, 138, 0.9);
        padding: 8px;
        line-height: 1.35;
        font-size: 0.72rem;
      }

      .media-os-shell .media-r3-selected-provider-summary {
        border: 1px solid rgba(45, 212, 191, 0.2);
        background: rgba(20, 184, 166, 0.06);
        padding: 9px 10px;
        display: grid;
        gap: 4px;
      }

      .media-os-shell .media-r3-selected-provider-summary strong {
        color: #f8fafc;
      }

      .media-os-shell .media-r3-selected-provider-summary span {
        color: rgba(203, 213, 225, 0.76);
        font-size: 0.74rem;
        line-height: 1.35;
      }

      .media-os-shell .media-r3-hidden-native-select {
        position: absolute;
        width: 1px;
        height: 1px;
        opacity: 0;
        pointer-events: none;
      }

      

      /* MEDIA-STUDIO-UX-R3B-REPAIR-SIMPLE-PROVIDER-MENU-IN-PLACE */
      .media-os-shell .media-r3b-provider-menu {
        display: grid;
        gap: 10px;
        padding-top: 12px;
        border-top: 1px solid rgba(148, 163, 184, 0.12);
      }

      .media-os-shell .media-r3b-menu-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }

      .media-os-shell .media-r3b-menu-title strong {
        color: #f8fafc;
        font-size: 0.88rem;
        font-weight: 1000;
      }

      .media-os-shell .media-r3b-menu-status {
        border: 1px solid rgba(234, 179, 8, 0.45);
        color: #fde68a;
        background: rgba(234, 179, 8, 0.06);
        padding: 4px 7px;
        font-size: 0.62rem;
        font-weight: 1000;
        text-transform: uppercase;
        letter-spacing: 0.07em;
        white-space: nowrap;
      }

      .media-os-shell .media-r3b-menu-status.is-draft {
        border-color: rgba(45, 212, 191, 0.48);
        color: #99f6e4;
        background: rgba(20, 184, 166, 0.08);
      }

      .media-os-shell .media-r3b-provider-select,
      .media-os-shell .media-r3b-model-select {
        width: 100%;
        border: 1px solid rgba(148, 163, 184, 0.18);
        background: rgba(2, 6, 14, 0.72);
        color: rgba(248, 250, 252, 0.96);
        padding: 11px 12px;
        font-weight: 900;
      }

      .media-os-shell .media-r3b-selected-line {
        color: rgba(203, 213, 225, 0.76);
        font-size: 0.78rem;
        line-height: 1.35;
      }

      .media-os-shell .media-r3b-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }

      .media-os-shell .media-r3b-action,
      .media-os-shell .media-r3b-source-button {
        border: 1px solid rgba(148, 163, 184, 0.18);
        background: rgba(15, 23, 42, 0.78);
        color: rgba(248, 250, 252, 0.92);
        font-weight: 950;
        padding: 10px;
        cursor: pointer;
      }

      .media-os-shell .media-r3b-action.is-primary,
      .media-os-shell .media-r3b-source-button.is-primary {
        border-color: rgba(34, 211, 238, 0.45);
        background: rgba(34, 211, 238, 0.13);
        color: #a5f3fc;
      }

      .media-os-shell .media-r3b-source-row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 10px;
      }

      .media-os-shell .media-r3b-source-help {
        color: rgba(203, 213, 225, 0.72);
        font-size: 0.76rem;
        line-height: 1.4;
        width: 100%;
      }

      

      /* MEDIA-STUDIO-UX-R3D-STABLE-PROVIDER-UI */
      .media-os-shell .media-r2r-studio,
      .media-os-shell .media-r2r-main,
      .media-os-shell .media-r2r-workspace {
        overflow: visible;
      }

      .media-os-shell .media-r2r-main h1,
      .media-os-shell .media-r2r-main h2,
      .media-os-shell .media-r2r-title,
      .media-os-shell .media-r2r-studio-title {
        line-height: 1.08;
        padding-top: 6px;
        margin-top: 0;
        overflow: visible;
      }

      .media-os-shell .media-r2r-stage-head,
      .media-os-shell .media-r2r-hero-head,
      .media-os-shell .media-r2r-mode-head {
        padding-top: 14px;
        overflow: visible;
      }

      .media-os-shell .media-r3d-provider-menu {
        gap: 11px;
      }

      .media-os-shell .media-r3d-route-select {
        width: 100%;
        border: 1px solid rgba(45, 212, 191, 0.22);
        background: rgba(2, 6, 14, 0.74);
        color: rgba(248, 250, 252, 0.96);
        padding: 11px 12px;
        font-weight: 950;
      }

      .media-os-shell .media-r3d-provider-model-line {
        border: 1px solid rgba(148, 163, 184, 0.14);
        background: rgba(15, 23, 42, 0.52);
        padding: 9px 10px;
        color: rgba(203, 213, 225, 0.78);
        font-size: 0.76rem;
        line-height: 1.35;
      }

      .media-os-shell .media-r3d-provider-model-line strong {
        color: #f8fafc;
      }

      .media-os-shell .media-r3d-provider-note {
        color: rgba(203, 213, 225, 0.72);
        font-size: 0.74rem;
        line-height: 1.35;
      }

      .media-os-shell .media-r3d-hidden-select {
        position: absolute;
        width: 1px;
        height: 1px;
        opacity: 0;
        pointer-events: none;
      }

      .media-os-shell .media-r3d-reference-panel {
        border: 1px solid rgba(45, 212, 191, 0.18);
        background:
          radial-gradient(circle at top left, rgba(20, 184, 166, 0.08), transparent 38%),
          rgba(2, 6, 14, 0.36);
        padding: 12px;
        margin: 0 0 12px;
        display: grid;
        gap: 9px;
      }

      .media-os-shell .media-r3d-reference-title {
        color: #f8fafc;
        font-size: 0.82rem;
        font-weight: 1000;
      }

      .media-os-shell .media-r3d-reference-row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .media-os-shell .media-r3d-reference-button {
        border: 1px solid rgba(148, 163, 184, 0.18);
        background: rgba(15, 23, 42, 0.72);
        color: rgba(248, 250, 252, 0.92);
        font-weight: 950;
        padding: 9px 11px;
        cursor: pointer;
      }

      .media-os-shell .media-r3d-reference-button.is-primary {
        border-color: rgba(34, 211, 238, 0.45);
        background: rgba(34, 211, 238, 0.13);
        color: #a5f3fc;
      }

      .media-os-shell .media-r3d-reference-help {
        color: rgba(203, 213, 225, 0.72);
        font-size: 0.76rem;
        line-height: 1.4;
      }

      .media-os-shell .media-r2r-timeline button,
      .media-os-shell .media-r2r-timeline-action {
        min-width: 86px;
      }

      

      /* MEDIA-STUDIO-UX-R3E-COMPACT-COMPOSER-NO-CARDS */
      .media-os-shell .media-r3d-reference-panel {
        display: none !important;
      }

      .media-os-shell .media-r3d-provider-model-line,
      .media-os-shell .media-r3d-provider-note {
        display: none !important;
      }

      .media-os-shell .media-r3b-provider-menu,
      .media-os-shell .media-r3d-provider-menu {
        gap: 8px;
        padding-top: 10px;
      }

      .media-os-shell .media-r3b-menu-title strong {
        font-size: 0.82rem;
      }

      .media-os-shell .media-r3b-menu-status {
        padding: 4px 7px;
        font-size: 0.58rem;
      }

      .media-os-shell .media-r3b-provider-select,
      .media-os-shell .media-r3b-model-select,
      .media-os-shell .media-r3d-route-select {
        min-height: 40px;
        padding: 9px 10px;
        font-size: 0.9rem;
      }

      .media-os-shell .media-r3b-selected-line,
      .media-os-shell .media-r3d-provider-model-line {
        font-size: 0.72rem;
      }

      .media-os-shell .media-r3b-actions {
        gap: 8px;
      }

      .media-os-shell .media-r3b-action {
        min-height: 42px;
        padding: 8px 10px;
      }

      .media-os-shell .media-r3e-compact-source {
        display: flex;
        align-items: center;
        gap: 8px;
        border: 1px solid rgba(148, 163, 184, 0.12);
        background: rgba(2, 6, 14, 0.46);
        padding: 8px;
        margin: 0 0 8px;
      }

      .media-os-shell .media-r3e-plus {
        width: 32px;
        height: 32px;
        display: inline-grid;
        place-items: center;
        border: 1px solid rgba(45, 212, 191, 0.34);
        background: rgba(20, 184, 166, 0.1);
        color: #99f6e4;
        font-size: 1.05rem;
        font-weight: 1000;
        cursor: pointer;
        flex: 0 0 auto;
      }

      .media-os-shell .media-r3e-source-text {
        color: rgba(203, 213, 225, 0.78);
        font-size: 0.78rem;
        line-height: 1.3;
        flex: 1;
        min-width: 0;
      }

      .media-os-shell .media-r3e-source-text strong {
        color: #f8fafc;
      }

      .media-os-shell .media-r3e-mini-action {
        border: 1px solid rgba(148, 163, 184, 0.16);
        background: rgba(15, 23, 42, 0.66);
        color: rgba(248, 250, 252, 0.9);
        padding: 8px 10px;
        font-size: 0.75rem;
        font-weight: 950;
        cursor: pointer;
        white-space: nowrap;
      }

      .media-os-shell .media-r2r-textarea {
        min-height: 84px;
      }

      .media-os-shell .media-r2r-main h1,
      .media-os-shell .media-r2r-main h2 {
        line-height: 1.08;
        padding-top: 6px;
      }

      @media (max-width: 980px) {
        .media-os-shell .media-r3e-compact-source {
          flex-wrap: wrap;
        }

        .media-os-shell .media-r3e-source-text {
          flex-basis: calc(100% - 44px);
        }
      }

      

      /* MEDIA-STUDIO-UX-R3F-HIGGSFIELD-STYLE-COMPACT-COMPOSER */
      .media-os-shell .media-r3b-provider-menu,
      .media-os-shell .media-r3d-provider-menu {
        display: none !important;
      }

      .media-os-shell .media-r3e-compact-source {
        display: none !important;
      }

      .media-os-shell .media-r3f-composer {
        border: 1px solid rgba(148, 163, 184, 0.16);
        background:
          linear-gradient(180deg, rgba(15, 23, 42, 0.94), rgba(2, 6, 14, 0.92)),
          radial-gradient(circle at top left, rgba(34, 211, 238, 0.12), transparent 35%);
        padding: 10px;
        margin: 0 0 10px;
        display: grid;
        gap: 10px;
        box-shadow: 0 18px 54px rgba(0, 0, 0, 0.22);
      }

      .media-os-shell .media-r3f-prompt-line {
        display: grid;
        grid-template-columns: 34px minmax(0, 1fr) auto auto;
        align-items: center;
        gap: 8px;
      }

      .media-os-shell .media-r3f-plus {
        width: 32px;
        height: 32px;
        display: inline-grid;
        place-items: center;
        border: 1px solid rgba(163, 230, 53, 0.55);
        background: rgba(163, 230, 53, 0.08);
        color: #d9f99d;
        font-size: 1.05rem;
        font-weight: 1000;
        cursor: pointer;
      }

      .media-os-shell .media-r3f-inline-copy {
        color: rgba(203, 213, 225, 0.78);
        font-size: 0.78rem;
        line-height: 1.3;
        min-width: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .media-os-shell .media-r3f-inline-copy strong {
        color: #f8fafc;
        font-weight: 1000;
      }

      .media-os-shell .media-r3f-mini-button {
        border: 1px solid rgba(148, 163, 184, 0.18);
        background: rgba(15, 23, 42, 0.74);
        color: rgba(248, 250, 252, 0.94);
        font-size: 0.76rem;
        font-weight: 950;
        padding: 8px 10px;
        cursor: pointer;
        white-space: nowrap;
      }

      .media-os-shell .media-r3f-controls {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
      }

      .media-os-shell .media-r3f-chip,
      .media-os-shell .media-r3f-select {
        min-height: 36px;
        border: 1px solid rgba(148, 163, 184, 0.16);
        background: rgba(2, 6, 14, 0.74);
        color: rgba(248, 250, 252, 0.95);
        padding: 8px 10px;
        font-size: 0.78rem;
        font-weight: 950;
      }

      .media-os-shell .media-r3f-provider-chip {
        min-width: 190px;
        max-width: 280px;
      }

      .media-os-shell .media-r3f-chip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }

      .media-os-shell .media-r3f-main-action {
        margin-left: auto;
        min-height: 42px;
        border: 0;
        background: #22d3ee;
        color: #001018;
        font-weight: 1000;
        padding: 10px 18px;
        cursor: pointer;
      }

      .media-os-shell .media-r3f-subtle {
        color: rgba(203, 213, 225, 0.64);
        font-size: 0.72rem;
        font-weight: 800;
      }

      .media-os-shell .media-r2r-textarea {
        min-height: 92px;
        margin-top: 0;
      }

      .media-os-shell .media-r2r-controls-note {
        margin-top: 6px;
      }

      .media-os-shell .media-r2r-main h1,
      .media-os-shell .media-r2r-main h2 {
        line-height: 1.08;
        padding-top: 8px;
      }

      @media (max-width: 980px) {
        .media-os-shell .media-r3f-prompt-line {
          grid-template-columns: 34px minmax(0, 1fr);
        }

        .media-os-shell .media-r3f-mini-button {
          grid-column: span 1;
        }

        .media-os-shell .media-r3f-main-action {
          width: 100%;
          margin-left: 0;
        }

        .media-os-shell .media-r3f-provider-chip {
          max-width: 100%;
          width: 100%;
        }
      }

      

      /* MEDIA-STUDIO-UX-R3G-COMPOSER-DEDUP-FINAL-POLISH */
      .media-os-shell .media-r2r-bottom {
        gap: 10px;
      }

      .media-os-shell .media-r2r-actions {
        margin-top: 4px;
      }

      .media-os-shell .media-r2r-actions .media-r2r-secondary {
        min-height: 38px;
        padding: 8px 12px;
        font-size: 0.82rem;
      }

      

      /* MEDIA-STUDIO-UX-R3H-COMPOSER-CATALOG-FINAL-POLISH */
      .media-os-shell .media-r3f-composer {
        padding: 10px;
      }

      .media-os-shell .media-r3f-controls {
        display: grid;
        grid-template-columns: minmax(220px, 1.45fr) minmax(92px, 0.5fr) minmax(92px, 0.5fr) minmax(118px, 0.65fr) minmax(110px, 0.6fr) auto;
        gap: 8px;
        align-items: center;
      }

      .media-os-shell .media-r3h-select,
      .media-os-shell .media-r3f-select {
        width: 100%;
        min-height: 38px;
      }

      .media-os-shell .media-r3h-small-select {
        min-width: 86px;
      }

      .media-os-shell .media-r3h-status-chip {
        border: 1px solid rgba(45, 212, 191, 0.18);
        background: rgba(20, 184, 166, 0.07);
        color: rgba(153, 246, 228, 0.92);
        min-height: 38px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 8px 10px;
        font-size: 0.76rem;
        font-weight: 950;
        white-space: nowrap;
      }

      .media-os-shell .media-r3f-main-action {
        min-width: 190px;
        white-space: nowrap;
      }

      .media-os-shell .media-r3f-inline-copy {
        max-width: 100%;
      }

      @media (max-width: 1280px) {
        .media-os-shell .media-r3f-controls {
          grid-template-columns: minmax(220px, 1fr) repeat(3, minmax(90px, auto));
        }

        .media-os-shell .media-r3f-main-action {
          grid-column: 1 / -1;
          width: 100%;
        }
      }

      @media (max-width: 760px) {
        .media-os-shell .media-r3f-controls {
          grid-template-columns: 1fr;
        }
      }

      

      /* MEDIA-STUDIO-UX-R3I-COMPOSER-SPACING-LABEL-POLISH */
      .media-os-shell .media-r3f-controls {
        grid-template-columns:
          minmax(250px, 1.55fr)
          minmax(88px, 0.45fr)
          minmax(104px, 0.52fr)
          minmax(112px, 0.55fr)
          minmax(132px, 0.66fr)
          minmax(190px, 0.82fr);
      }

      .media-os-shell .media-r3h-status-chip {
        min-width: 132px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .media-os-shell .media-r3f-main-action {
        justify-self: end;
        min-width: 190px;
      }

      .media-os-shell .media-r3f-select,
      .media-os-shell .media-r3h-select,
      .media-os-shell .media-r3h-small-select {
        overflow: hidden;
        text-overflow: ellipsis;
      }

      @media (max-width: 1380px) {
        .media-os-shell .media-r3f-controls {
          grid-template-columns:
            minmax(240px, 1.4fr)
            minmax(86px, 0.45fr)
            minmax(100px, 0.5fr)
            minmax(108px, 0.52fr)
            minmax(128px, 0.6fr);
        }

        .media-os-shell .media-r3f-main-action {
          grid-column: 1 / -1;
          width: 100%;
          justify-self: stretch;
        }
      }

      @media (max-width: 900px) {
        .media-os-shell .media-r3f-controls {
          grid-template-columns: 1fr 1fr;
        }

        .media-os-shell .media-r3f-provider-chip {
          grid-column: 1 / -1;
        }

        .media-os-shell .media-r3f-main-action {
          grid-column: 1 / -1;
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
          <h2>AI Media Studio</h2>
          <p class="media-section-copy">Create images, videos, voiceovers, and campaign assets from one brief.</p>
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
        <button id="mediaSave DraftBtn" class="btn btn-secondary" type="button">Save Draft</button>
        <button id="mediaHeaderSaveLibraryBtn" class="btn btn-secondary" type="button">Save to Library</button>
        <button id="mediaSendToPublishingBtn" class="btn btn-primary" type="button">Prepare Campaign Pack</button>
        <button id="mediaSendAiCommandBtn" class="btn btn-secondary" type="button">AI Review</button>
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
        <div class="media-overview-item"><span>Publishing handoffs</span><strong>${escapeHtml(formatCount(metrics.publishingReady))}</strong></div>
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
        <button class="btn btn-secondary" type="button" data-media-exec-action="scroll-generator" data-new-media-job="image">Start Media Job</button>
        <button class="btn btn-secondary" type="button" data-media-version-action="save-draft">Save Draft</button>
        <button class="btn btn-secondary" type="button" data-media-specialist-ai="media-director">AI Review</button>
        <button class="btn btn-primary" type="button" data-media-exec-action="scroll-review">Prepare Campaign Pack</button>
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
            Choose a mode, add a short brief, then generate or prepare the asset.
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
          <h3>Prompt tools</h3>
        </div>
        <span class="card-badge neutral">${escapeHtml(handoff ? "Handoff available" : "Context")}</span>
      </div>
      <div class="media-action-row">
        <button id="mediaPromptFromContextBtn" class="btn btn-secondary" type="button">Generate from project setup</button>
        <button id="mediaPromptFromHandoffBtn" class="btn btn-secondary" type="button">${escapeHtml(handoff && extractHandoffSummary(handoff).isAiCampaign ? "Load AI Team Campaign Brief" : "Generate from workflow handoff")}</button>
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


function renderCampaignPackageSummaryRows(summary, escapeHtml) {
  const campaignPackage = asObject(summary.campaignPackage);
  const rows = [
    ["Concept", asString(campaignPackage.concept)],
    ["Audience", asString(campaignPackage.targetAudience || campaignPackage.target_audience)],
    ["Offer", asString(campaignPackage.offer)]
  ].filter(([, value]) => value);

  const groups = [
    ["Required assets", asArray(campaignPackage.requiredAssets || campaignPackage.required_assets)],
    ["Review blockers", asArray(campaignPackage.missingBlockers || campaignPackage.missing_blockers)],
    ["Next actions", asArray(campaignPackage.nextActions || campaignPackage.next_actions)]
  ].filter(([, items]) => items.length);

  if (!rows.length && !groups.length) return "";

  return `
    <div class="data-stack">
      ${rows.map(([label, value]) => `<div class="data-row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("")}
      ${groups.map(([label, items]) => `<div class="data-row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(items.slice(0, 3).map((item) => asString(item)).join(" · "))}</strong></div>`).join("")}
      ${summary.backendPreview ? `<div class="data-row"><span>AI source</span><strong>${escapeHtml(summary.backendSource || "Backend preview")}</strong></div>` : ""}
    </div>
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
  const kicker = summary.isAiCampaign ? "AI Team Campaign Brief" : isContentBrief ? "Inbound Content Brief" : "Inbound Media Brief";
  const buttonLabel = summary.isAiCampaign ? "Load AI Team Campaign Brief" : isContentBrief ? "Load Content Design Brief" : "Load Media Brief";
  const fallbackCopy = summary.isAiCampaign
    ? "AI Team campaign package is ready to become a creative media brief."
    : isContentBrief
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
        <span class="card-badge ${loaded ? "success" : summary.isAiCampaign ? "warning" : "neutral"}">${escapeHtml(loaded ? "Loaded" : summary.isAiCampaign ? "From AI Command" : "Available")}</span>
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
      ${summary.isAiCampaign ? renderCampaignPackageSummaryRows(summary, escapeHtml) : ""}
      <div class="media-action-row">
        <button id="mediaLoadHandoffBtn" class="btn btn-secondary" type="button">${escapeHtml(buttonLabel)}</button>
        ${summary.isAiCampaign ? `<button id="mediaClearAiCommandHandoffBtn" class="btn btn-secondary" type="button">Clear AI Command Brief</button>` : ""}
      </div>
    </section>
  `;
}

function renderQueue(session, escapeHtml) {
  if (!session.items.length) {
    return `
      <section class="card media-card" id="mediaQueuePanelEmpty" data-canonical-panel="mediaQueuePanel">
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
              <button type="button" data-media-action="send-publishing" data-media-id="${escapeHtml(item.id)}">Prepare Campaign Pack</button>
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
          <h3>Output readiness</h3>
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
      <section class="card media-card" id="mediaOutputPreviewPanelEmpty" data-canonical-panel="mediaOutputPreviewPanel">
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
        : `<div class="media-prompt-box">${escapeHtml("No video yet. Prepare a video prompt or connect a provider to generate.")}</div>`;
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
          <h3>Versions</h3>
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
        <button class="btn btn-primary" type="button" data-media-version-action="send-publishing">Prepare Campaign Pack</button>
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
        <button class="btn btn-secondary" type="button" data-media-specialist-ai="${escapeHtml(specialist.id)}">AI Review</button>
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
    ["Image generation", readiness.image_generation_backend],
    ["Video generation", readiness.video_generation_backend],
    ["Voice generation", readiness.voice_generation_backend],
    ["publishing handoff", readiness.publishing_handoff],
    ["Approval", readiness.approval_backend]
  ];
  return `
    <section class="card media-card" id="mediaApiReadinessPanel">
      <div class="card-head">
        <div>
          <div class="setup-kicker">API Readiness</div>
          <h3>Provider readiness</h3>
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
      ${!readiness.image_generation_backend || !readiness.video_generation_backend || !readiness.voice_generation_backend ? `<div class="simple-banner media-block-gap">${escapeHtml("Connect a provider in Integrations, or continue with a prompt draft.")}</div>` : ""}
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
          notes: firstText(response.message, "Connect a provider in Integrations, or continue with a prompt draft."),
          provider: response.provider || "",
          model: response.model || ""
        });
        syncOutputsFromVersioning(session);
        saveDraftToSession(projectName, state, session, "prompt_ready");
        session.draftMessage = response.message || "Connect a provider in Integrations, or continue with a prompt draft.";
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

  
  const providerPreferenceSelect = document.getElementById("mediaProviderPreferenceSelect");
  if (providerPreferenceSelect) {
    providerPreferenceSelect.onchange = () => {
      sync();
      session.form.providerPreference = providerPreferenceSelect.value || "prompt_only";
      session.providerPreference = session.form.providerPreference;
      const selectedChoice = getSelectedMediaProviderChoice(session, selected());
      const providerKind = selectedChoice.value.split(":")[0] || "prompt_only";
      const message = providerKind === "paid"
        ? "Paid provider selected. Connect it in Integrations before running real generation."
        : providerKind === "local"
          ? "Local/open provider selected. Configure the local runtime in Integrations or setup before real generation."
          : "Prompt draft mode is selected. You can prepare, review, and save without connecting a provider.";
      showMessage(message);
      rerender();
    };
  }

  const providerModelSelect = document.getElementById("mediaProviderModelSelect");
  if (providerModelSelect) {
    providerModelSelect.onchange = () => {
      sync();
      session.form.providerModel = providerModelSelect.value || "prompt_only";
      session.providerModel = session.form.providerModel;
      const selectedModel = getSelectedMediaProviderModelChoice(session, selected());
      showMessage(`Model/workflow selected: ${selectedModel.label}`);
      rerender();
    };
  }

  Array.from(document.querySelectorAll("[data-media-packet-action]")).forEach((button) => {
    button.onclick = () => {
      const action = button.getAttribute("data-media-packet-action") || "";

      if (action === "load-packet") {
        const summary = handoff ? extractHandoffSummary(handoff) : null;
        if (!summary) {
          session.draftMessage = "No Content Studio or workflow packet is available.";
          rerender();
          return;
        }

        session.form = {
          ...session.form,
          project: firstText(summary.project, session.form.project, projectName),
          campaign: firstText(summary.campaign, session.form.campaign),
          product: firstText(summary.product, session.form.product),
          channel: firstText(summary.channel, session.form.channel),
          objective: firstText(summary.objective, summary.brief, session.form.objective),
          prompt: firstText(summary.prompt, summary.brief, summary.copy, session.form.prompt),
          title: firstText(summary.title, session.form.title),
          status: "prompt_ready"
        };
        session.loadedHandoffId = summary.id;
        session.isCreatingNew = true;
        session.selectedId = "";
        session.formSourceId = "";
        appendVersion(session, {
          mode: session.form.mode || session.mode || "image",
          prompt: session.form.prompt,
          notes: "Loaded from inbound Content Studio / workflow packet.",
          providerStatus: "prompt_ready",
          readinessStatus: "prompt_ready",
          provider: "packet_receiver"
        });
        session.draftMessage = summary.sourcePage === "content-studio"
          ? "Content Studio packet loaded into Media Studio execution room."
          : "Workflow packet loaded into Media Studio execution room.";
        rerender();
        return;
      }

      if (action === "build-execution-prompt") {
        sync();
        const summary = handoff ? extractHandoffSummary(handoff) : {};
        const prompt = firstText(summary.prompt, summary.brief, summary.copy, session.form.prompt, buildPromptFromContext(state, session));
        applyPrompt(prompt, "Execution prompt prepared from packet/context.");
        return;
      }

      if (action === "open-content") {
        navigateTo?.("content-studio");
      }
    };
  });

  Array.from(document.querySelectorAll("[data-media-exec-action]")).forEach((button) => {
    button.onclick = async () => {
      const action = button.getAttribute("data-media-exec-action") || "";

      if (action === "mode") {
        const mode = button.getAttribute("data-media-exec-mode") || "image";
        resetForm(session, state, mode);
        showMessage?.(`${titleCase(mode)} execution room opened.`);
        rerender();
        return;
      }

      if (action === "scroll-generator") {
        document.getElementById("mediaGeneratorPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      if (action === "scroll-preview") {
        document.getElementById("mediaOutputPreviewPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      if (action === "scroll-review") {
        document.getElementById("mediaReviewPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      if (action === "save-library") {
        sync();
        await saveVersionToLibrary({ backendProjectName, projectName, state, session, selectedItem: selected(), showMessage, rerender });
        rerender();
        return;
      }

      if (action === "open-library") {
        navigateTo?.("library");
        return;
      }

      if (action === "open-setup") {
        navigateTo?.("setup");
        return;
      }

      if (action === "open-integrations") {
        navigateTo?.("integrations");
      }
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

  const saveButtons = [document.getElementById("mediaSave DraftBtn"), document.getElementById("mediaSaveBtn"), document.getElementById("mediaSavePromptBtn")].filter(Boolean);
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

  const clearAiCommandHandoffBtn = document.getElementById("mediaClearAiCommandHandoffBtn");
  if (clearAiCommandHandoffBtn) {
    clearAiCommandHandoffBtn.onclick = () => {
      clearAiCommandLocalCampaignHandoff("media-studio");
      session.loadedHandoffId = "";
      session.draftMessage = "AI Command campaign brief cleared locally.";
      saveDraftLocally("AI Command campaign brief cleared locally.");
      navigateTo("media-studio");
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

      if (!item) {
        sync();

        if (action === "generate-prompt") {
          applyPrompt(buildPromptFromContext(state, session), "Prompt generated from project context.");
          return;
        }

        if (action === "open-library") {
          navigateTo?.("library");
          return;
        }

        if (action === "upload-reference") {
          session.form.referenceAsset = session.form.referenceAsset || "";
          session.draftMessage = "Add or paste a reference asset, filename, URL, or source note in the Reference asset field.";
          document.getElementById("mediaReferenceInput")?.focus();
          rerender();
          return;
        }

        if (action === "load-handoff") {
          const summary = handoff ? extractHandoffSummary(handoff) : null;
          if (!summary) {
            session.draftMessage = "No workflow handoff is available.";
            rerender();
            return;
          }

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
          return;
        }

        if (action === "prepare-publishing") {
          syncVersionFromForm(session);
          saveDraftToSession(projectName, state, session, "publishing_ready");
          session.form.status = "publishing_ready";
          session.draftMessage = "Campaign pack prepared locally. Review before Publishing handoff.";
          rerender();
          return;
        }

        if (action === "save-draft") {
          if (!validateGenerator(session, "save")) {
            rerender();
            return;
          }
          await persistMediaJob({ backendProjectName, projectName, state, session, status: "prompt_ready", showMessage });
          rerender();
          return;
        }

        if (action === "improve-prompt") {
          if (!clean(session.form.prompt)) {
            session.validation = { ...session.validation, prompt: "Prompt is required." };
            rerender();
            return;
          }
          applyPrompt(improvePrompt(session.form.prompt), "Prompt improved locally.");
          return;
        }

        return;
      }

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
        showMessage?.("Prompt prepared. Connect a provider when you are ready to generate.");
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
      const confirmed = confirmMediaAuthorityAction(
        "Confirm AI Command media handoff",
        "Action: Send this media context to AI Command for review and planning support.\nRisk: This attaches shared AI handoff context and navigates to AI Command. It does not publish, approve, run provider generation, or create backend tasks."
      );
      if (!confirmed) return;

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

      const confirmed = confirmMediaAuthorityAction(
        "Confirm Library save",
        "Action: Save this media version as a Library handoff.\nRisk: This may create a durable Library handoff record for review and reuse. It does not publish directly."
      );
      if (!confirmed) return;

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
        const confirmed = confirmMediaAuthorityAction(
          "Confirm Library save",
          "Action: Save this selected version as a Library handoff.\nRisk: This may create a durable Library handoff record for review and reuse. It does not publish directly."
        );
        if (!confirmed) return;

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
        const confirmed = confirmMediaAuthorityAction(
          "Confirm AI Command specialist handoff",
          `Action: Send ${specialist.title} media context to AI Command for review and planning support.\nRisk: This attaches shared AI handoff context and navigates to AI Command. It does not publish, approve, run provider generation, or create backend tasks.`
        );
        if (!confirmed) {
          rerender();
          return;
        }

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


/* MEDIA-STUDIO-PHASE2R2-CONTENT-STUDIO-STYLE-EXECUTION-ROOM */
function renderMediaPacketReceiverPanel({ projectName, session, selectedItem, handoff, escapeHtml }) {
  const summary = handoff ? extractHandoffSummary(handoff) : {};
  const payload = asObject(handoff?.payload);
  const output = asObject(payload.output);
  const mediaPayload = asObject(payload.media || payload.media_brief || payload.media_handoff || output.media);
  const sourcePage = firstText(summary.sourcePage, handoff?.source_page, payload.source_page, "No inbound source");
  const isContentStudioPacket = sourcePage === "content-studio" || /content studio/i.test(firstText(summary.sourceLabel, sourcePage));
  const prompt = firstText(summary.prompt, summary.brief, summary.copy, mediaPayload.prompt, output.prompt, session.form?.prompt, selectedItem?.prompt);
  const project = firstText(summary.project, mediaPayload.project, session.form?.project, selectedItem?.project, projectName);
  const campaign = firstText(summary.campaign, mediaPayload.campaign, session.form?.campaign, selectedItem?.campaign);
  const product = firstText(summary.product, mediaPayload.product, session.form?.product, selectedItem?.product);
  const channel = firstText(summary.channel, mediaPayload.channel, session.form?.channel, selectedItem?.channel);
  const format = firstText(mediaPayload.format, summary.format, session.form?.format, selectedItem?.format);
  const objective = firstText(summary.objective, mediaPayload.objective, summary.brief, session.form?.objective, selectedItem?.objective);
  const hasPacket = Boolean(handoff);
  const badge = hasPacket ? (isContentStudioPacket ? "Content Studio packet ready" : "Workflow packet ready") : "No packet loaded";

  const rows = [
    ["Source", sourcePage],
    ["Project", project],
    ["Campaign", campaign || "not set"],
    ["Product", product || "not set"],
    ["Channel", channel || "not set"],
    ["Format", format || "not set"],
    ["Objective", objective || "not set"]
  ];

  return `
    <section class="media-os-section media-os-packet" id="mediaPacketReceiverPanel" aria-label="Incoming Content Studio Packet Receiver">
      <div class="media-os-section-head">
        <div>
          <span class="media-os-kicker">Incoming Packet Receiver</span>
          <h3>Content Studio packet → Media execution brief</h3>
          <p>Receives the production packet from Content Studio and turns it into a controlled execution brief for image, video, voice, campaign pack, review, Library, and Publishing.</p>
        </div>
        <strong class="media-os-badge ${hasPacket ? "is-ready" : "is-waiting"}">${escapeHtml(badge)}</strong>
      </div>

      <div class="media-os-packet-grid">
        <div class="media-os-prompt-sheet">
          <span>Execution prompt / brief preview</span>
          <p>${escapeHtml(prompt ? prompt.slice(0, 700) : "Load a Content Studio packet or generate a prompt from project context before running any media execution.")}</p>
          <div class="media-os-actions">
            <button type="button" data-media-packet-action="load-packet"${hasPacket ? "" : " disabled aria-disabled=\"true\""}>Load packet into generator</button>
            <button type="button" data-media-packet-action="build-execution-prompt">Build execution prompt</button>
            <button type="button" data-media-packet-action="open-content">Open Content Studio</button>
          </div>
        </div>

        <div class="media-os-data">
          ${rows.map(([label, value]) => `
            <div class="media-os-data-row">
              <span>${escapeHtml(label)}</span>
              <strong>${escapeHtml(value || "not set")}</strong>
            </div>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderMediaExecutionRoomPanel({ session, selectedItem, handoff, escapeHtml }) {
  const version = selectedVersionEntry(session);
  const readiness = getVersionReadiness(version, session, selectedItem);
  const source = getMediaSourceReadiness(session, selectedItem, handoff);
  const mode = session.form?.mode || session.mode || selectedItem?.mode || "image";
  const prompt = firstText(version?.prompt, session.form?.prompt, selectedItem?.prompt, selectedItem?.brief);
  const hasPrompt = Boolean(clean(prompt));
  const hasOutput = hasSelectedVersionOutput(version);
  const status = readiness.readinessStatus || "draft";

  const lanes = [
    ["image", "Image Execution", "Images / frames / thumbnails", "Product truth, logo lock, composition, lighting, negative prompt, safe text area, thumbnail-ready output."],
    ["video", "Video Execution", "Motion / scenes / camera", "Scene motion, camera path, continuity locks, negative motion, start/end frame, and video QC."],
    ["voice", "Voice / Audio", "Voiceover / sound direction", "Tone, pacing, pronunciation, emotion, sound design, SFX, and export notes."],
    ["campaign-pack", "Campaign Pack", "All formats bundle", "Image prompt, video brief, voice script, cutdowns, channel notes, and publishing-ready package."]
  ];

  return `
    <section class="media-os-section media-os-execution" id="mediaExecutionRoomPanel" aria-label="Media Execution Room">
      <div class="media-os-section-head">
        <div>
          <span class="media-os-kicker">Execution Room</span>
          <h3>Image → Video → Voice → Campaign Pack</h3>
          <p>Every media job is treated as an execution packet: source, mode, provider readiness, prompt quality, output preview, versions, review, Library save, and Publishing handoff stay connected.</p>
        </div>
        <strong class="media-os-badge ${statusTone(status)}">${escapeHtml(displayMediaStatusLabel(status))}</strong>
      </div>

      <div class="media-os-lanes">
        ${lanes.map(([id, title, label, detail]) => `
          <article class="media-os-lane${id === mode ? " is-active" : ""}">
            <span>${escapeHtml(label)}</span>
            <strong>${escapeHtml(title)}</strong>
            <p>${escapeHtml(detail)}</p>
            <div class="media-os-lane-status">
              <em class="${id === mode && hasPrompt ? "is-ready" : "is-waiting"}">${escapeHtml(id === mode && hasPrompt ? "Prompt ready" : "Waiting")}</em>
              <em>${escapeHtml(source.status || "source check")}</em>
            </div>
            <button type="button" data-media-exec-action="mode" data-media-exec-mode="${escapeHtml(id)}">Open ${escapeHtml(title)}</button>
          </article>
        `).join("")}
      </div>

      <div class="media-os-actions media-os-actions-bar">
        <button type="button" data-media-exec-action="scroll-generator">Generator</button>
        <button type="button" data-media-exec-action="scroll-preview">Preview</button>
        <button type="button" data-media-exec-action="scroll-review">Review</button>
        <button type="button" data-media-exec-action="save-library"${hasOutput || hasPrompt ? "" : " disabled aria-disabled=\"true\""}>Save Asset</button>
      </div>
    </section>
  `;
}

function renderMediaAssetSourceTruthPanel({ state, session, selectedItem, escapeHtml }) {
  const assetData = getAssetData(state);
  const nextAction = getAssetNextAction(assetData, MEDIA_ASSET_KEYS);
  const hasReference = Boolean(clean(session.form?.referenceAsset || selectedItem?.referenceAsset));
  const badge = hasReference ? "Source reference attached" : "Source reference needed";

  return `
    <section class="media-os-section media-os-source" id="mediaAssetSourceTruthPanel" aria-label="Asset Gate and Source of Truth">
      <div class="media-os-section-head">
        <div>
          <span class="media-os-kicker">Asset Gate / Source of Truth</span>
          <h3>Approved assets before generation</h3>
          <p>Before image, video, or voice execution, Media Studio must know which logo, product photos, product videos, packaging images, campaign assets, and brand rules are approved as source of truth.</p>
        </div>
        <strong class="media-os-badge ${hasReference ? "is-ready" : "is-waiting"}">${escapeHtml(badge)}</strong>
      </div>

      <div class="media-os-source-grid">
        <div class="media-os-source-list">
          ${renderAssetDependencyRows(assetData, MEDIA_ASSET_KEYS, escapeHtml, "Media library inputs are covered.")}
          <div class="media-os-notice">${escapeHtml(nextAction)}</div>
        </div>
        <div class="media-os-actions media-os-source-actions">
          <button type="button" data-media-exec-action="open-library">Open Library</button>
          <button type="button" data-media-exec-action="open-setup">Review setup assets</button>
          <button type="button" data-media-exec-action="open-integrations">Provider readiness</button>
        </div>
      </div>
    </section>
  `;
}



/* MEDIA-STUDIO-PHASE3A-PRODUCTION-INTELLIGENCE-ROUTER-UI */
function renderMediaProductionIntelligenceRouter({ session, selectedItem, handoff, escapeHtml }) {
  const mode = asString(session?.form?.mode || selectedItem?.mode || "image");
  const prompt = asString(session?.form?.prompt || selectedItem?.prompt || selectedItem?.brief || "");
  const hasHandoff = Boolean(handoff?.payload || handoff?.summary || handoff?.source);
  const hasPrompt = prompt.trim().length > 0;
  const hasOutput = Boolean(selectedItem?.output || selectedItem?.result || selectedItem?.asset_url);

  const routeMap = {
    image: {
      title: "Image production route",
      workflow: "Product photo, campaign visual, post image, start frame, end frame, blog image, or marketplace visual.",
      best: "Use strict reference identity, product lock, ratio intent, and negative prompt before generation.",
      provider: "Nano Banana / Gemini for fast drafts, ComfyUI + FLUX/SDXL + IP-Adapter/LoRA for controlled production."
    },
    video: {
      title: "Video scene route",
      workflow: "Single scene, image-to-video, start/end frame motion, product reveal, styling shot, or cinematic product movement.",
      best: "Use approved start/end frames, one motion, short duration, locked product, locked model, locked location.",
      provider: "Kling / Runway / Luma for cloud execution, Wan / Hunyuan / AnimateDiff for open/local workflows."
    },
    audio: {
      title: "Voice / audio route",
      workflow: "Voiceover, music prompt, SFX notes, sound design, language versions, and silent/no-VO variants.",
      best: "Separate voiceover from music, define BPM/mood/structure, keep commercial license status visible.",
      provider: "ElevenLabs/Suno for fast cloud drafts, Coqui/Bark/MusicGen/Amphion for open/local workflows."
    },
    multi_format: {
      title: "Campaign pack route",
      workflow: "Multi-platform image, video, voice, graphics, captions, thumbnails, and export handoff.",
      best: "Resolve platform formats, preview crops, CTA, legal/claims, Library save, and Publishing handoff.",
      provider: "Hybrid route: image + video + audio + graphics + publishing handoff."
    }
  };

  const route = routeMap[mode] || routeMap.image;

  const readiness = [
    {
      label: "Brief / handoff",
      state: hasHandoff || hasPrompt ? "ready" : "missing",
      detail: hasHandoff ? "Content Studio or AI Command packet available." : hasPrompt ? "Prompt/brief entered." : "Load a campaign packet or enter a brief before production."
    },
    {
      label: "Provider path",
      state: "active",
      detail: "Choose cloud or local/open workflow based on task, quality, privacy, license, and runtime readiness."
    },
    {
      label: "Preview / approval",
      state: hasOutput ? "ready" : "missing",
      detail: hasOutput ? "Output exists and can move through review/versioning." : "Generate or prepare an output before final approval."
    }
  ];

  return `
    <section class="media-os-section" id="mediaProductionIntelligenceRouter" aria-label="Media Production Intelligence Router">
      <div class="media-os-section-head">
        <div>
          <div class="media-os-kicker">Phase 3A · Production Intelligence</div>
          <h3>Task → Workflow → Provider → Prompt → Preview → Handoff</h3>
          <p>Routes each media request into the correct production path before AI generation. The page should not let AI invent the ad; it should force AI to execute a structured production plan.</p>
        </div>
        <span class="media-os-badge ${hasHandoff || hasPrompt ? "is-ready" : "is-waiting"}">${escapeHtml(hasHandoff || hasPrompt ? "Brief ready" : "Needs brief")}</span>
      </div>
      <div class="media-intelligence-grid">
        <div class="media-intelligence-cell">
          <div class="media-intelligence-route">
            <strong>${escapeHtml(route.title)}</strong>
            <p>${escapeHtml(route.workflow)}</p>
            <div class="media-route-tags">
              <span class="is-ready">${escapeHtml(mode)}</span>
              <span>${escapeHtml(hasHandoff ? "handoff" : "manual brief")}</span>
              <span class="is-critical">product lock required</span>
            </div>
          </div>
          <div class="media-intelligence-route">
            <strong>Recommended execution rule</strong>
            <p>${escapeHtml(route.best)}</p>
          </div>
          <div class="media-intelligence-route">
            <strong>Suggested provider family</strong>
            <p>${escapeHtml(route.provider)}</p>
          </div>
        </div>
        <div class="media-intelligence-cell">
          <div class="media-intelligence-stack">
            ${readiness.map((item) => `
              <div class="media-lock-row">
                <strong>${escapeHtml(item.label)}</strong>
                <p>${escapeHtml(item.detail)}</p>
                <span class="${item.state === "ready" ? "is-ready" : "is-missing"}">${escapeHtml(item.state)}</span>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderMediaProviderModelRouterPanel({ session, selectedItem, escapeHtml }) {
  const mode = asString(session?.form?.mode || selectedItem?.mode || "image");

  const providers = [
    {
      family: "Image",
      cloud: "Nano Banana / Gemini image",
      local: "ComfyUI + FLUX / SDXL + ControlNet / IP-Adapter / LoRA",
      best: "Product hero, social post, Amazon secondary image, start/end frame, blog image, infographic.",
      license: "Check commercial usage and model license before paid ads or marketplace use."
    },
    {
      family: "Video",
      cloud: "Kling / Runway / Luma / Pika",
      local: "Wan / HunyuanVideo / CogVideoX / Mochi / AnimateDiff / LTX",
      best: "Image-to-video, short scenes, product reveal, camera push-in, styling shot, motion loop.",
      license: "Keep scenes short, use approved frames, and confirm provider terms before commercial publishing."
    },
    {
      family: "Audio",
      cloud: "ElevenLabs / Suno / licensed music libraries",
      local: "Coqui TTS / Bark / MusicGen / Amphion",
      best: "Voiceover, music draft, SFX plan, brand sound, multilingual variants.",
      license: "Paid ads require licensed or verified commercial-safe music/audio."
    },
    {
      family: "Research / LLM",
      cloud: "Hosted LLM / search providers",
      local: "LlamaIndex / LangGraph / Ollama / Qwen / Llama / Mistral / Docling / SearXNG",
      best: "Product facts, campaign bible, research notes, hooks, compliance, platform rules.",
      license: "Respect site terms, data privacy, and model licenses for commercial workflows."
    }
  ];

  return `
    <section class="media-os-section" id="mediaProviderModelRouterPanel" aria-label="Provider and Model Router">
      <div class="media-os-section-head">
        <div>
          <div class="media-os-kicker">Provider / Model Router</div>
          <h3>Choose the right model family for the production task</h3>
          <p>Cloud providers are faster. Open/local workflows give deeper control, privacy, reference consistency, and custom product workflows. Commercial license status must stay visible before publishing.</p>
        </div>
        <span class="media-os-badge is-ready">${escapeHtml(mode)} route</span>
      </div>
      <div class="media-model-matrix">
        ${providers.map((provider) => `
          <div class="media-model-card">
            <strong>${escapeHtml(provider.family)}</strong>
            <p><b>Cloud:</b> ${escapeHtml(provider.cloud)}</p>
            <p><b>Open/local:</b> ${escapeHtml(provider.local)}</p>
            <p>${escapeHtml(provider.best)}</p>
            <div class="media-model-tags">
              <span class="${provider.family.toLowerCase() === mode ? "is-ready" : ""}">${escapeHtml(provider.family)}</span>
              <span class="is-critical">license check</span>
            </div>
            <p>${escapeHtml(provider.license)}</p>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderMediaProductLockChecklistPanel({ session, selectedItem, handoff, escapeHtml }) {
  const prompt = asString(session?.form?.prompt || selectedItem?.prompt || selectedItem?.brief || "");
  const sourceText = [
    prompt,
    JSON.stringify(handoff?.payload || {}),
    JSON.stringify(selectedItem || {})
  ].join(" ").toLowerCase();

  const checks = [
    {
      label: "Product reference",
      detail: "Front product image, logo close-up, label, cap, shape, color, and proportions should be attached.",
      ready: /reference|asset|library|product|image/.test(sourceText)
    },
    {
      label: "Strict identity lock",
      detail: "Prompt should say reference is strict identity, not inspiration.",
      ready: /strict identity|preserve|exact|unchanged|product lock/.test(sourceText)
    },
    {
      label: "Negative prompt",
      detail: "Block redesign, fake label, changed logo, deformed hands, face change, random objects, and cheap lighting.",
      ready: /negative|no redesign|no logo|no fake|unchanged|distortion/.test(sourceText)
    },
    {
      label: "License & Commercial safety",
      detail: "Avoid unsupported claims, check music/model/provider licenses, and keep marketplace/platform rules visible.",
      ready: /license|commercial|amazon|claims|compliance|safe/.test(sourceText)
    }
  ];

  return `
    <section class="media-os-section" id="mediaProductLockChecklistPanel" aria-label="Product Lock Checklist">
      <div class="media-os-section-head">
        <div>
          <div class="media-os-kicker">Product Lock Engine</div>
          <h3>Protect the product before generation</h3>
          <p>AI tools do not automatically protect brand identity. Every commercial output must lock product shape, logo, label, cap, color, model, location, platform rules, and negative instructions before generation.</p>
        </div>
        <span class="media-os-badge ${checks.every((item) => item.ready) ? "is-ready" : "is-waiting"}">${escapeHtml(checks.every((item) => item.ready) ? "Lock strong" : "Lock incomplete")}</span>
      </div>
      <div class="media-lock-list">
        ${checks.map((item) => `
          <div class="media-lock-row">
            <strong>${escapeHtml(item.label)}</strong>
            <p>${escapeHtml(item.detail)}</p>
            <span class="${item.ready ? "is-ready" : "is-missing"}">${escapeHtml(item.ready ? "ready" : "missing")}</span>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderMediaPlatformExportIntentPanel({ session, selectedItem, escapeHtml }) {
  const mode = asString(session?.form?.mode || selectedItem?.mode || "image");
  const items = [
    {
      label: "Instagram / TikTok / Shorts",
      spec: "9:16 · 1080×1920 · hook in first 1–3 seconds · safe-zone text and CTA.",
      ready: mode === "video" || mode === "multi_format"
    },
    {
      label: "Feed / Carousel",
      spec: "1:1 · 1080×1080 and 4:5 · 1080×1350 · product visible and caption-ready.",
      ready: mode === "image" || mode === "multi_format"
    },
    {
      label: "Website / Blog",
      spec: "16:9, 1920×1080, 1600×900, or banner variants · compressed and brand-safe.",
      ready: true
    },
    {
      label: "Amazon / Marketplace",
      spec: "Main image: white background/product only. Secondary: lifestyle, usage, benefits, texture, no risky claims.",
      ready: false
    },
    {
      label: "Audio / Voice variants",
      spec: "VO + music + SFX, music-only, VO-only, silent version, Arabic/English/German where needed.",
      ready: mode === "audio" || mode === "multi_format"
    }
  ];

  return `
    <section class="media-os-section" id="mediaPlatformExportIntentPanel" aria-label="Platform and Export Intent">
      <div class="media-os-section-head">
        <div>
          <div class="media-os-kicker">Platform Format Resolver</div>
          <h3>Plan ratios, safe zones, export variants, and publishing handoff</h3>
          <p>Media Studio should prepare outputs for the destination before generation, not after. Platform format, safe zones, CTA, thumbnail, audio versions, and marketplace rules must be visible before approval.</p>
        </div>
        <span class="media-os-badge is-ready">export intent</span>
      </div>
      <div class="media-format-list">
        ${items.map((item) => `
          <div class="media-format-row">
            <strong>${escapeHtml(item.label)}</strong>
            <p>${escapeHtml(item.spec)}</p>
            <span class="${item.ready ? "is-ready" : "is-missing"}">${escapeHtml(item.ready ? "active" : "needs review")}</span>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderMediaSceneStartEndReadinessPanel({ session, selectedItem, handoff, escapeHtml }) {
  const mode = asString(session?.form?.mode || selectedItem?.mode || "image");
  const text = [
    asString(session?.form?.prompt || ""),
    asString(selectedItem?.prompt || ""),
    asString(selectedItem?.brief || ""),
    JSON.stringify(handoff?.payload || {})
  ].join(" ").toLowerCase();

  const rows = [
    {
      label: "Scene plan",
      detail: "Split complex video into short scenes: problem, product reveal, texture, styling, final look, product hero.",
      ready: /scene|shot|storyboard|video/.test(text) || mode === "video"
    },
    {
      label: "Start frame",
      detail: "Approved first frame with product/model/location locked before animation.",
      ready: /start frame|first frame|image-to-video/.test(text)
    },
    {
      label: "End frame",
      detail: "Approved final frame or target result to reduce AI drift.",
      ready: /end frame|final frame|target frame/.test(text)
    },
    {
      label: "Motion rule",
      detail: "One clear motion per scene, 3–5 seconds, camera movement separated from object movement.",
      ready: /motion|push-in|camera|duration|seconds|3-5|4 seconds/.test(text)
    }
  ];

  return `
    <section class="media-os-section" id="mediaSceneStartEndReadinessPanel" aria-label="Scene and Start End Frame Readiness">
      <div class="media-os-section-head">
        <div>
          <div class="media-os-kicker">Video Scene Planner</div>
          <h3>Start frame → motion bridge → end frame</h3>
          <p>For product videos, image-to-video and start/end frame planning should be preferred over text-to-video. Short controlled scenes reduce product drift, logo distortion, face changes, and random objects.</p>
        </div>
        <span class="media-os-badge ${mode === "video" ? "is-ready" : "is-waiting"}">${escapeHtml(mode === "video" ? "video route" : "optional")}</span>
      </div>
      <div class="media-lock-list">
        ${rows.map((item) => `
          <div class="media-lock-row">
            <strong>${escapeHtml(item.label)}</strong>
            <p>${escapeHtml(item.detail)}</p>
            <span class="${item.ready ? "is-ready" : "is-missing"}">${escapeHtml(item.ready ? "ready" : "missing")}</span>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}


/* MEDIA-STUDIO-PHASE3B-PRODUCT-LOCK-PROMPT-COMPILER */
function buildMediaCompilerContext(session, selectedItem, handoff) {
  const form = session?.form || {};
  const mode = asString(form.mode || selectedItem?.mode || "image");
  const prompt = asString(form.prompt || selectedItem?.prompt || selectedItem?.brief || "");
  const platform = asString(form.platform || selectedItem?.platform || handoff?.payload?.platform || "primary social channels");
  const ratio = asString(form.ratio || selectedItem?.ratio || handoff?.payload?.ratio || (mode === "video" ? "9:16" : "1:1 / 4:5 / 9:16"));
  const project = asString(handoff?.projectName || handoff?.project || selectedItem?.project || "");
  const handoffSummary = asString(handoff?.summary || handoff?.payload?.summary || handoff?.payload?.brief || "");
  const selectedTitle = asString(selectedItem?.title || selectedItem?.name || selectedItem?.type || "");
  const rawContext = [prompt, handoffSummary, selectedTitle, JSON.stringify(handoff?.payload || {}), JSON.stringify(selectedItem || {})].join(" ");

  const productGuess = firstText(
    form.product,
    selectedItem?.product,
    handoff?.payload?.product,
    project,
    "the approved product"
  );

  const campaignGuess = firstText(
    form.campaign,
    selectedItem?.campaign,
    handoff?.payload?.campaign,
    handoff?.payload?.campaignName,
    "the active campaign"
  );

  const visualStyle = firstText(
    form.visual_style,
    selectedItem?.visual_style,
    handoff?.payload?.visual_style,
    "premium commercial brand-safe style"
  );

  const audience = firstText(
    form.audience,
    selectedItem?.audience,
    handoff?.payload?.audience,
    "the target audience"
  );

  const location = firstText(
    form.location,
    selectedItem?.location,
    handoff?.payload?.location,
    "approved brand environment"
  );

  return {
    mode,
    prompt,
    platform,
    ratio,
    product: productGuess,
    campaign: campaignGuess,
    visualStyle,
    audience,
    location,
    rawContext
  };
}

function buildMediaProductLockPrompt(ctx) {
  return [
    `Product accuracy is the top priority for ${ctx.product}.`,
    "Use the approved product reference as strict identity, not inspiration.",
    "Preserve the exact product shape, logo, label, cap, color, material, proportions, and readable brand details.",
    "Do not redesign, reinterpret, replace, recolor, simplify, stylize, or invent the product.",
    "Brand consistency is more important than dramatic creativity.",
    `Keep the visual style aligned with ${ctx.visualStyle}.`,
    `Keep the output suitable for ${ctx.platform} and ratio ${ctx.ratio}.`
  ].join(" ");
}

function buildMediaNegativePrompt(ctx) {
  return [
    "No product redesign.",
    "No changed logo.",
    "No fake label.",
    "No distorted text.",
    "No extra products.",
    "No random objects.",
    "No blurry product.",
    "No deformed hands.",
    "No face change.",
    "No location change.",
    "No cartoon style unless explicitly requested.",
    "No unrealistic hair movement.",
    "No cheap lighting.",
    "No unsupported claims.",
    "No medical claims.",
    "No unsafe platform or marketplace claims."
  ].join(" ");
}

function buildMediaImagePrompt(ctx, productLock, negativePrompt) {
  return [
    `Create a premium commercial image for ${ctx.product} for ${ctx.campaign}.`,
    productLock,
    `Scene: ${ctx.location}.`,
    `Audience: ${ctx.audience}.`,
    `Composition: clean product-first layout, strong readable product presence, safe space for text overlays when needed.`,
    `Lighting: premium, controlled, brand-safe, polished commercial lighting.`,
    `Camera: sharp product focus, professional product photography, natural depth, clean background separation.`,
    `Format: ${ctx.ratio} for ${ctx.platform}.`,
    `Restrictions: ${negativePrompt}`
  ].join("\n");
}

function buildMediaVideoPrompt(ctx, productLock, negativePrompt) {
  return [
    `Create one controlled video scene for ${ctx.product} in ${ctx.campaign}.`,
    productLock,
    "Use image-to-video or approved start/end frames when product accuracy matters.",
    "Scene rule: one clear motion only, 3-5 seconds per scene, no unnecessary camera chaos.",
    "Motion: define exactly what moves and what stays fixed before generation.",
    "Camera: slow push-in, subtle pan, or stable product-focused movement only unless the brief requires otherwise.",
    "Keep fixed: product identity, logo readability, model identity, location, lighting, and brand style.",
    `Output format: ${ctx.ratio} for ${ctx.platform}.`,
    `Restrictions: ${negativePrompt}`
  ].join("\n");
}

function buildMediaAudioPrompt(ctx) {
  return [
    `Create an audio direction for ${ctx.campaign} and ${ctx.product}.`,
    `Purpose: support a premium media asset for ${ctx.platform}.`,
    "Voiceover: clear, concise, brand-safe, no unsupported claims, language/version defined before recording.",
    "Music: define genre, mood, BPM, duration, structure, and whether vocals are allowed.",
    "SFX: define timing for product action, transition whoosh, impact hit, and final brand/logo moment.",
    "Required variants: music + SFX + VO, music + SFX only, VO + SFX only, silent version with on-screen text.",
    "License guard: paid ads and marketplace usage require licensed or verified commercial-safe audio."
  ].join("\n");
}

function buildMediaGraphicsPrompt(ctx) {
  return [
    `Build a graphics and overlay plan for ${ctx.product}.`,
    "Do not bake important text or logo into AI-generated video if it may distort.",
    "Add overlays in editing/design stage when accuracy matters.",
    "Required overlay decisions: hook text, benefit labels, CTA, logo lockup, subtitles, end card, platform safe zones.",
    `Format guard: ${ctx.ratio} for ${ctx.platform}.`,
    "Infographic option: use benefit cards, arrows, steps, comparison blocks, and clean product callouts only when useful.",
    "Compliance guard: avoid exaggerated before/after, medical claims, guaranteed results, or unsupported claims."
  ].join("\n");
}

function renderMediaPromptCompilerPanel({ session, selectedItem, handoff, escapeHtml }) {
  const ctx = buildMediaCompilerContext(session, selectedItem, handoff);
  const productLock = buildMediaProductLockPrompt(ctx);
  const negativePrompt = buildMediaNegativePrompt(ctx);
  const imagePrompt = buildMediaImagePrompt(ctx, productLock, negativePrompt);
  const videoPrompt = buildMediaVideoPrompt(ctx, productLock, negativePrompt);
  const audioPrompt = buildMediaAudioPrompt(ctx);
  const graphicsPrompt = buildMediaGraphicsPrompt(ctx);

  const activePrompt = ctx.mode === "video"
    ? videoPrompt
    : ctx.mode === "audio"
      ? audioPrompt
      : ctx.mode === "multi_format"
        ? [imagePrompt, videoPrompt, audioPrompt, graphicsPrompt].join("\n\n---\n\n")
        : imagePrompt;

  const facts = [
    ["Mode", ctx.mode],
    ["Product", ctx.product],
    ["Campaign", ctx.campaign],
    ["Platform", ctx.platform],
    ["Ratio", ctx.ratio],
    ["Style", ctx.visualStyle]
  ];

  return `
    <section class="media-os-section" id="mediaPromptCompilerPanel" aria-label="Product Lock and Prompt Compiler">
      <div class="media-os-section-head">
        <div>
          <div class="media-os-kicker">Phase 3B · Product Lock + Prompt Compiler</div>
          <h3>Build prompts that force AI to execute the production plan</h3>
          <p>This compiler turns the brief into structured prompts for image, video, audio, and graphics. It prioritizes product accuracy, strict identity, negative instructions, platform fit, and commercial safety before generation.</p>
        </div>
        <span class="media-os-badge is-ready">${escapeHtml(ctx.mode)} compiler</span>
      </div>

      <div class="media-compiler-grid">
        <div class="media-compiler-cell">
          <div class="media-compiler-mini-grid">
            ${facts.map(([label, value]) => `
              <div class="media-compiler-mini">
                <span>${escapeHtml(label)}</span>
                <strong>${escapeHtml(value)}</strong>
              </div>
            `).join("")}
          </div>

          <div class="media-compiler-block">
            <strong>Product Lock Prompt</strong>
            <p>Use this as a fixed identity guard for commercial product generation.</p>
            <code class="media-compiler-code">${escapeHtml(productLock)}</code>
            <div class="media-compiler-chip-row">
              <span class="is-ready">strict identity</span>
              <span class="is-critical">preserve logo</span>
              <span class="is-critical">no redesign</span>
            </div>
          </div>

          <div class="media-compiler-block">
            <strong>Negative Prompt</strong>
            <p>Use this to reduce common image/video AI failures.</p>
            <code class="media-compiler-code">${escapeHtml(negativePrompt)}</code>
          </div>
        </div>

        <div class="media-compiler-cell">
          <div class="media-compiler-block">
            <strong>Active Compiled Prompt</strong>
            <p>This is the recommended prompt for the current mode.</p>
            <code class="media-compiler-code">${escapeHtml(activePrompt)}</code>
            <div class="media-compiler-chip-row">
              <span class="is-ready">prompt ready</span>
              <span>preview before approval</span>
              <span>save to library after review</span>
            </div>
          </div>

          <div class="media-compiler-block">
            <strong>Image Prompt Compiler</strong>
            <code class="media-compiler-code">${escapeHtml(imagePrompt)}</code>
          </div>

          <div class="media-compiler-block">
            <strong>Video Prompt Compiler</strong>
            <code class="media-compiler-code">${escapeHtml(videoPrompt)}</code>
          </div>

          <div class="media-compiler-block">
            <strong>Audio / Voice Prompt Compiler</strong>
            <code class="media-compiler-code">${escapeHtml(audioPrompt)}</code>
          </div>

          <div class="media-compiler-block">
            <strong>Graphics / Overlay Plan</strong>
            <code class="media-compiler-code">${escapeHtml(graphicsPrompt)}</code>
          </div>
        </div>
      </div>
    </section>
  `;
}


/* MEDIA-STUDIO-PHASE3C-SCENE-PLANNER-START-END-FRAME-WORKFLOW */
function buildMediaDefaultScenePlan(ctx) {
  const product = ctx.product || "the approved product";
  return [
    {
      id: "scene-1-hook-problem",
      title: "Scene 1 — Hook / Problem",
      purpose: "Open with a visual problem, need, or attention hook before showing a full solution.",
      startFrame: "Model or environment shows the problem clearly; product can be absent or subtly teased.",
      endFrame: "Viewer understands the problem and expects the product reveal.",
      motion: "Subtle human or camera movement only.",
      duration: "3–4 sec",
      locked: "Model identity, location, lighting, mood.",
      risk: "medium",
      provider: "Image-to-video if using model/location reference; otherwise scene brief for video provider."
    },
    {
      id: "scene-2-product-reveal",
      title: "Scene 2 — Product Reveal",
      purpose: `Reveal ${product} clearly and build product trust.`,
      startFrame: "Approved product hero start frame; product large, sharp, logo readable.",
      endFrame: "Same product composition closer or stronger, still readable.",
      motion: "Slow camera push-in or light sweep only.",
      duration: "3–4 sec",
      locked: "Product shape, logo, label, cap, color, proportions.",
      risk: "low",
      provider: "Kling / Wan image-to-video, or ComfyUI-generated start/end frames before video."
    },
    {
      id: "scene-3-texture-or-feature",
      title: "Scene 3 — Texture / Feature",
      purpose: "Show texture, usage detail, benefit, or one feature without overloading the frame.",
      startFrame: "Product or feature detail visible with clean composition.",
      endFrame: "Feature action completed or benefit visually clear.",
      motion: "One controlled action only: open, touch, reveal, pour, swipe, or rotate slightly.",
      duration: "3–5 sec",
      locked: "Product identity, hands, feature area, lighting.",
      risk: "medium",
      provider: "Start/end frame workflow recommended if hands or product opening are involved."
    },
    {
      id: "scene-4-action-use",
      title: "Scene 4 — Action / Use",
      purpose: "Show the product being used naturally without causing model or product drift.",
      startFrame: "Approved action start frame with model/product/location locked.",
      endFrame: "Action result is visible but not exaggerated.",
      motion: "One natural hand/model action; avoid complex transformations.",
      duration: "4–5 sec",
      locked: "Face, hair, product, hands, location, lighting.",
      risk: "high",
      provider: "Use short image-to-video scene with strict locked elements; split into smaller shots if needed."
    },
    {
      id: "scene-5-result-confidence",
      title: "Scene 5 — Result / Confidence",
      purpose: "Show result, confidence, finish, or lifestyle payoff.",
      startFrame: "Result visible and brand-consistent.",
      endFrame: "Model or product lands in final confident frame.",
      motion: "Small head turn, collar adjustment, mirror glance, or slow camera move.",
      duration: "3–4 sec",
      locked: "Model identity, final look, location, lighting.",
      risk: "medium",
      provider: "Image-to-video with model reference; avoid dramatic face expressions."
    },
    {
      id: "scene-6-hero-cta",
      title: "Scene 6 — Product Hero / CTA",
      purpose: "End with product, CTA, platform-safe composition, and publishing handoff readiness.",
      startFrame: "Product hero final frame with safe text area.",
      endFrame: "Same product hero with CTA space and optional logo/end card plan.",
      motion: "Very slow push-in, light sweep, or static premium hold.",
      duration: "3–4 sec",
      locked: "Product identity, logo readability, CTA safe area, no extra objects.",
      risk: "low",
      provider: "Image-to-video or static end card; add text/logo overlays in editing when accuracy matters."
    }
  ];
}

function buildMediaScenePlannerSummary(ctx, scenes) {
  const videoLike = ctx.mode === "video" || ctx.mode === "multi_format";
  const highRisk = scenes.filter((scene) => scene.risk === "high").length;
  const mediumRisk = scenes.filter((scene) => scene.risk === "medium").length;
  return {
    title: videoLike ? "Video scene plan active" : "Scene plan available for video conversion",
    imageToVideoReadiness: videoLike ? "active" : "optional",
    count: scenes.length,
    riskSummary: `${highRisk} high-risk scene(s), ${mediumRisk} medium-risk scene(s).`,
    providerRecommendation: "Use image-to-video with approved start/end frames for product scenes; keep each scene 3–5 seconds with one motion."
  };
}

function buildMediaStartEndFrameInstruction(ctx, scenes) {
  const productLock = buildMediaProductLockPrompt(ctx);
  const negativePrompt = buildMediaNegativePrompt(ctx);
  const firstScene = scenes[1] || scenes[0];
  return [
    "Start Frame Workflow:",
    `Create or approve the first frame for ${firstScene.title}.`,
    "The product/model/location must already be correct before animation.",
    productLock,
    "",
    "End Frame Workflow:",
    "Create or approve the target final frame before video generation when the motion is complex.",
    "The end frame should preserve the same product, same model, same location, same lighting, and same platform crop.",
    "",
    "Motion Bridge:",
    "Animate smoothly from start frame to end frame. Use one clear motion only. Keep duration between 3 and 5 seconds. Product accuracy and logo readability are more important than dramatic movement.",
    "",
    `Negative Prompt: ${negativePrompt}`
  ].join("\n");
}

function renderMediaScenePlannerWorkflowPanel({ session, selectedItem, handoff, escapeHtml }) {
  const ctx = buildMediaCompilerContext(session, selectedItem, handoff);
  const scenes = buildMediaDefaultScenePlan(ctx);
  const summary = buildMediaScenePlannerSummary(ctx, scenes);
  const frameInstruction = buildMediaStartEndFrameInstruction(ctx, scenes);

  return `
    <section class="media-os-section" id="mediaScenePlannerWorkflowPanel" aria-label="Scene Planner and Start End Frame Workflow">
      <div class="media-os-section-head">
        <div>
          <div class="media-os-kicker">Phase 3C · Scene Planner + Start/End Frame Workflow</div>
          <h3>Scene Planner Matrix → Start Frame → Motion Bridge → End Frame</h3>
          <p>Media Studio should not ask AI to create a full commercial in one prompt. It should split the production into short controlled scenes with start/end frames, locked elements, risk level, and provider recommendation.</p>
        </div>
        <span class="media-os-badge ${ctx.mode === "video" || ctx.mode === "multi_format" ? "is-ready" : "is-waiting"}">${escapeHtml(summary.imageToVideoReadiness)}</span>
      </div>

      <div class="media-scene-planner-grid">
        <div class="media-scene-planner-cell">
          <div class="media-frame-card">
            <strong>Image-to-Video Readiness</strong>
            <p>${escapeHtml(summary.providerRecommendation)}</p>
            <div class="media-frame-tags">
              <span class="is-ready">Scene Planner Matrix</span>
              <span class="is-ready">Start Frame Workflow</span>
              <span class="is-ready">End Frame Workflow</span>
              <span class="is-risk">Risk Level</span>
            </div>
          </div>

          <div class="media-scene-table" aria-label="Scene Planner Matrix">
            ${scenes.map((scene, index) => `
              <div class="media-scene-row">
                <div>
                  <strong>${escapeHtml(`S${index + 1}`)}</strong>
                  <span class="media-scene-status ${scene.risk === "low" ? "is-ready" : "is-warning"}">${escapeHtml(scene.risk)} risk</span>
                </div>
                <div>
                  <strong>${escapeHtml(scene.title)}</strong>
                  <p>${escapeHtml(scene.purpose)}</p>
                </div>
                <div>
                  <p><b>Start:</b> ${escapeHtml(scene.startFrame)}</p>
                  <p><b>End:</b> ${escapeHtml(scene.endFrame)}</p>
                  <p><b>Motion Bridge:</b> ${escapeHtml(scene.motion)}</p>
                </div>
                <div>
                  <p><b>Duration:</b> ${escapeHtml(scene.duration)}</p>
                  <p><b>Locked Elements:</b> ${escapeHtml(scene.locked)}</p>
                  <p><b>Provider Recommendation:</b> ${escapeHtml(scene.provider)}</p>
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="media-scene-planner-cell">
          <div class="media-frame-card">
            <strong>Start Frame Workflow</strong>
            <p>Generate or approve the first frame before animation. The product, model, location, logo, label, and crop must be correct in the first frame.</p>
          </div>

          <div class="media-frame-card">
            <strong>End Frame Workflow</strong>
            <p>Generate or approve the target final frame for complex motion. The end frame reduces drift and gives the video provider a controlled destination.</p>
          </div>

          <div class="media-frame-card">
            <strong>Motion Bridge Prompt</strong>
            <p>Use this instruction when moving from approved start frame to approved end frame.</p>
            <code class="media-frame-code">${escapeHtml(frameInstruction)}</code>
          </div>

          <div class="media-frame-card">
            <strong>Risk Level Decision</strong>
            <p>${escapeHtml(summary.riskSummary)} High-risk scenes should be split into smaller clips, use one motion only, and avoid face/product/logo deformation.</p>
          </div>

          <div class="media-frame-card">
            <strong>Provider Recommendation</strong>
            <p>Cloud: Kling / Runway / Luma for fast image-to-video. Open/local: Wan / HunyuanVideo / AnimateDiff for controlled or private workflows. Use ComfyUI / FLUX / SDXL to generate approved start/end frames before animation.</p>
          </div>
        </div>
      </div>
    </section>
  `;
}


/* MEDIA-STUDIO-UX1A-INTERNATIONAL-CREATION-STUDIO-SHELL */
function getMediaProviderChoices(mode) {
  const normalized = mode === "voice" ? "audio" : mode === "campaign-pack" ? "multi_format" : mode || "image";
  const common = [
    { value: "prompt_only", label: "Prompt-only / no provider", type: "safe", note: "Build prompts, drafts, and handoff packages without running paid or local generation." }
  ];

  const map = {
    image: [
      { value: "paid:openai_image", label: "Paid Cloud · OpenAI Image", type: "paid", note: "Requires provider connection in Integrations." },
      { value: "paid:gemini_nano_banana", label: "Paid Cloud · Gemini / Nano Banana", type: "paid", note: "Fast commercial image drafts when connected." },
      { value: "local:comfyui_flux", label: "Local/Open · ComfyUI + FLUX", type: "local", note: "Best for controlled product workflows when local runtime is configured." },
      { value: "local:comfyui_sdxl", label: "Local/Open · ComfyUI + SDXL", type: "local", note: "Stable local image workflow with product references and ControlNet/IP-Adapter." },
      { value: "local:flux_lora", label: "Local/Open · FLUX / LoRA product workflow", type: "local", note: "Use when product identity needs repeatable consistency." }
    ],
    video: [
      { value: "paid:higgsfield", label: "Paid Cloud · Higgsfield", type: "paid", note: "Social video, camera motion, product/ad video workflow. Requires Higgsfield integration/API contract." },
      { value: "paid:kling", label: "Paid Cloud · Kling", type: "paid", note: "Image-to-video and short product scenes when connected." },
      { value: "paid:runway", label: "Paid Cloud · Runway", type: "paid", note: "Cloud cinematic video generation when connected." },
      { value: "paid:luma", label: "Paid Cloud · Luma", type: "paid", note: "Cloud motion and video generation when connected." },
      { value: "local:wan", label: "Local/Open · Wan image-to-video", type: "local", note: "Open/local scene workflow when runtime is configured." },
      { value: "local:hunyuan_video", label: "Local/Open · HunyuanVideo", type: "local", note: "Heavy cinematic local/open workflow when GPU/runtime is ready." },
      { value: "local:animatediff", label: "Local/Open · AnimateDiff", type: "local", note: "Useful for loops and controlled motion." }
    ],
    audio: [
      { value: "paid:elevenlabs", label: "Paid Cloud · ElevenLabs", type: "paid", note: "Voiceover generation when connected." },
      { value: "paid:suno", label: "Paid Cloud · Suno", type: "paid", note: "Music direction/drafts when commercial rights are verified." },
      { value: "local:coqui", label: "Local/Open · Coqui TTS", type: "local", note: "Local voice generation when runtime is configured." },
      { value: "local:bark", label: "Local/Open · Bark", type: "local", note: "Experimental local/open voice/audio workflow." },
      { value: "local:musicgen", label: "Local/Open · MusicGen", type: "local", note: "Music draft generation with local/open workflow." },
      { value: "local:amphion", label: "Local/Open · Amphion", type: "local", note: "Advanced speech/music/audio research workflow." }
    ],
    multi_format: [
      { value: "paid:higgsfield", label: "Paid Cloud · Higgsfield campaign video", type: "paid", note: "Paid social/ad video workflow. Requires Higgsfield integration/API contract." },
      { value: "hybrid:cloud", label: "Hybrid · Paid cloud pack", type: "paid", note: "Uses connected cloud providers for image, video, and voice." },
      { value: "hybrid:local", label: "Hybrid · Local/open pack", type: "local", note: "Uses configured local/open providers for image, video, and audio." },
      { value: "hybrid:prompt_pack", label: "Hybrid · Prompt pack only", type: "safe", note: "Creates prompts, scenes, voice scripts, and publishing handoff without generation." }
    ]
  };

  return common.concat(map[normalized] || map.image);
}

function getMediaProviderModelChoices(providerValue, mode) {
  const normalized = asString(providerValue || "prompt_only");
  const normalizedMode = mode === "voice" ? "audio" : mode === "campaign-pack" ? "multi_format" : mode || "image";

  const catalog = {
    prompt_only: [
      { value: "prompt_only", label: "Prompt / job-ready draft", note: "No generation provider. Build prompts, drafts, Library packages, and Publishing handoffs." }
    ],

    "paid:openai_image": [
      { value: "gpt-image-1", label: "gpt-image-1", note: "OpenAI image generation model when OPENAI_API_KEY is configured." },
      { value: "dall-e-3", label: "DALL·E 3 legacy/fallback", note: "Use only if supported by the current backend/runtime." }
    ],

    "paid:gemini_nano_banana": [
      { value: "gemini-image", label: "Gemini image / Nano Banana workflow", note: "Paid/cloud image generation workflow when provider access is configured." },
      { value: "gemini-edit", label: "Gemini image edit", note: "Use for controlled edits and reference-driven image tasks when supported." }
    ],

    "paid:higgsfield": [
      { value: "higgsfield-social-video", label: "Higgsfield social video workflow", note: "Paid provider. Requires Higgsfield integration/API contract before real generation." },
      { value: "higgsfield-motion-control", label: "Higgsfield motion control workflow", note: "Use for cinematic movement, creator-style shots, and social ad video once connected." },
      { value: "higgsfield-character-product", label: "Higgsfield character/product ad workflow", note: "Use only with approved product/model/brand references and commercial rights." }
    ],

    "paid:kling": [
      { value: "kling-video", label: "Kling video", note: "Paid/cloud image-to-video and controlled short scenes when connected." },
      { value: "kling-i2v", label: "Kling image-to-video", note: "Preferred when product identity must be preserved from approved frames." }
    ],

    "paid:runway": [
      { value: "runway-video", label: "Runway video", note: "Paid/cloud video workflow when connected." },
      { value: "runway-i2v", label: "Runway image-to-video", note: "Use with approved start/end frames when available." }
    ],

    "paid:luma": [
      { value: "luma-video", label: "Luma video", note: "Paid/cloud video generation workflow when connected." }
    ],

    "paid:elevenlabs": [
      { value: "elevenlabs-voice", label: "ElevenLabs voice", note: "Paid/cloud voiceover generation when ELEVENLABS_API_KEY is configured." },
      { value: "elevenlabs-multilingual", label: "ElevenLabs multilingual voice", note: "Use for Arabic/English/German voiceover variants when licensed." }
    ],

    "paid:suno": [
      { value: "suno-music", label: "Suno music", note: "Paid/cloud music generation. Commercial usage must be verified before ads." }
    ],

    "local:comfyui_flux": [
      { value: "flux-dev", label: "FLUX dev via ComfyUI", note: "Local/open image generation workflow. Requires ComfyUI endpoint and model setup." },
      { value: "flux-schnell", label: "FLUX schnell via ComfyUI", note: "Fast local/open image drafts when configured." },
      { value: "flux-product-lock", label: "FLUX product-lock workflow", note: "Use with LoRA/IP-Adapter/ControlNet style reference workflow when configured." }
    ],

    "local:comfyui_sdxl": [
      { value: "sdxl-base", label: "SDXL base via ComfyUI", note: "Local/open image generation workflow." },
      { value: "sdxl-controlnet", label: "SDXL + ControlNet", note: "Use for structured composition and reference control when configured." },
      { value: "sdxl-ip-adapter", label: "SDXL + IP-Adapter", note: "Use for reference consistency when configured." }
    ],

    "local:flux_lora": [
      { value: "flux-lora-product", label: "FLUX + product LoRA", note: "Local/open repeatable product identity workflow when trained/available." }
    ],

    "local:wan": [
      { value: "wan-video", label: "Wan image-to-video", note: "Local/open video generation workflow. Requires local runtime/GPU/worker." }
    ],

    "local:hunyuan_video": [
      { value: "hunyuan-video", label: "HunyuanVideo", note: "Local/open video generation workflow. Heavy runtime requirements." }
    ],

    "local:animatediff": [
      { value: "animatediff", label: "AnimateDiff", note: "Local/open video/motion workflow for loops and controlled movement." }
    ],

    "local:coqui": [
      { value: "coqui-tts", label: "Coqui TTS", note: "Local/open TTS workflow when runtime is configured." }
    ],

    "local:bark": [
      { value: "bark-tts", label: "Bark", note: "Local/open experimental voice/audio workflow." }
    ],

    "local:musicgen": [
      { value: "musicgen", label: "MusicGen", note: "Local/open music draft generation workflow." }
    ],

    "local:amphion": [
      { value: "amphion", label: "Amphion", note: "Advanced local/open speech/music/audio research workflow." }
    ],

    "hybrid:cloud": [
      { value: "hybrid-cloud-pack", label: "Cloud production pack", note: "Uses connected paid providers for image/video/voice." }
    ],

    "hybrid:local": [
      { value: "hybrid-local-pack", label: "Local/open production pack", note: "Uses configured local/open workflows for image/video/audio." }
    ],

    "hybrid:prompt_pack": [
      { value: "hybrid-prompt-pack", label: "Prompt-only campaign pack", note: "Creates prompts, scenes, voice scripts, and handoff without real generation." }
    ]
  };

  const direct = catalog[normalized];
  if (direct) return direct;

  if (normalizedMode === "video") return catalog["paid:higgsfield"];
  if (normalizedMode === "audio") return catalog["paid:elevenlabs"];
  if (normalizedMode === "multi_format") return catalog["hybrid:prompt_pack"];
  return catalog.prompt_only;
}

function getSelectedMediaProviderModelChoice(session, selectedItem) {
  const mode = asString(session?.form?.mode || session?.mode || selectedItem?.mode || "image");
  const provider = getSelectedMediaProviderChoice(session, selectedItem);
  const choices = getMediaProviderModelChoices(provider.value, mode);
  const selected = asString(session?.form?.providerModel || selectedItem?.providerModel || choices[0]?.value || "prompt_only");
  return choices.find((choice) => choice.value === selected) || choices[0] || { value: "prompt_only", label: "Prompt / job-ready draft", note: "No model selected." };
}

function getSelectedMediaProviderChoice(session, selectedItem) {
  const mode = asString(session?.form?.mode || session?.mode || selectedItem?.mode || "image");
  const choices = getMediaProviderChoices(mode);
  const selected = asString(session?.form?.providerPreference || selectedItem?.providerPreference || "prompt_only");
  return choices.find((choice) => choice.value === selected) || choices[0];
}

function getMediaGenerationStatusForUx(session, selectedItem) {
  const mode = asString(session?.form?.mode || session?.mode || selectedItem?.mode || "image");
  const choice = getSelectedMediaProviderChoice(session, selectedItem);
  const providerKind = choice.value.split(":")[0] || "prompt_only";
  const isPromptOnly = choice.value === "prompt_only" || providerKind === "hybrid" && choice.value.includes("prompt");
  const isPaid = choice.type === "paid";
  const isLocal = choice.type === "local";
  const title = isPromptOnly
    ? "Prompt-only mode"
    : isPaid
      ? "Paid provider selected"
      : isLocal
        ? "Local/open provider selected"
        : "Provider selected";

  const message = isPromptOnly
    ? "Prompt-only mode is active. Connect a provider to generate real media, or prepare a prompt-ready draft now."
    : isPaid
      ? "Paid/cloud provider selected. Connect and authorize this provider in Integrations before real generation can run."
      : isLocal
        ? "Local/open-source provider selected. Configure the local runtime, endpoint, or model worker in Integrations/Setup before real generation can run."
        : "Confirm provider readiness before running real generation.";

  return {
    mode,
    choice,
    providerKind,
    title,
    message,
    ready: false
  };
}


function normalizeMediaStudioModeR2R(mode) {
  const value = String(mode || "image").toLowerCase();
  if (value === "audio") return "voice";
  if (value === "multi_format" || value === "campaign_pack" || value === "campaign-pack") return "campaign";
  if (["image", "video", "voice", "campaign"].includes(value)) return value;
  return "image";
}

function getMediaStudioModeCopyR2R(mode) {
  const normalized = normalizeMediaStudioModeR2R(mode);

  if (normalized === "video") {
    return {
      label: "Video",
      eyebrow: "Video Studio",
      title: "Create a controlled video scene",
      description: "Use start/end frames, one motion prompt, duration, and ratio.",
      canvasTitle: "Your video will appear here",
      canvasCopy: "Add or generate a start frame first. Then describe one clear motion.",
      primaryAction: "Generate Video",
      fallbackAction: "Prepare Video Prompt",
      secondaryAction: "Upload Start Frame",
      providerHint: "Video providers: Higgsfield, Kling, Runway, Luma, Sora, Veo, Wan, HunyuanVideo.",
      icon: "VID"
    };
  }

  if (normalized === "voice") {
    return {
      label: "Voice",
      eyebrow: "Voice Studio",
      title: "Create voice, audio, or sound direction",
      description: "Write or upload a script, choose a voice, then prepare the voice direction.",
      canvasTitle: "Your voice track will appear here",
      canvasCopy: "Add a script, choose a voice model, then generate or save a review-ready voice brief.",
      primaryAction: "Generate Voice",
      fallbackAction: "Prepare Voice Prompt",
      secondaryAction: "Choose Voice",
      providerHint: "Audio providers: OpenAI Audio, ElevenLabs, Seed Audio, MiniMax Speech, Coqui, Bark, MusicGen.",
      icon: "AUD"
    };
  }

  if (normalized === "campaign") {
    return {
      label: "Campaign",
      eyebrow: "Campaign Studio",
      title: "Build a full production timeline",
      description: "Turn one brief into images, start frames, video scenes, voiceover, captions, export variants, and publishing handoff.",
      canvasTitle: "Campaign production timeline",
      canvasCopy: "Each asset moves through generate, preview, approve, save, and handoff.",
      primaryAction: "Prepare Campaign Pack",
      fallbackAction: "Prepare Campaign Pack",
      secondaryAction: "Load Campaign Brief",
      providerHint: "Campaign mode routes each asset to the right provider/model.",
      icon: "PACK"
    };
  }

  return {
    label: "Image",
    eyebrow: "Image Studio",
    title: "Create a brand-safe image",
    description: "Use a prompt, reference image, ratio, style, and quality.",
    canvasTitle: "Your image will appear here",
    canvasCopy: "Write a short image brief, attach a reference when needed, then generate or prepare a prompt-ready draft.",
    primaryAction: "Generate Image",
    fallbackAction: "Prepare Image Prompt",
    secondaryAction: "Upload Reference",
    providerHint: "Image providers: OpenAI, Higgsfield, Nano Banana, Seedream, Recraft, ComfyUI, FLUX, SDXL.",
    icon: "IMG"
  };
}


function renderMediaStudioControlsR2S({ mode, format, actionLabel, escapeHtml }) {
  const normalized = normalizeMediaStudioModeR2R(mode);

  if (normalized === "voice") {
    return `
          <div class="media-r2s-mode-note">Voice mode uses script, language, voice, and tone. Video duration is hidden because it does not apply to voice drafts.</div>
          <div class="media-r2r-controls media-r2s-controls-voice">
            <label class="media-r2s-control-wrap">
              <span class="media-r2s-control-label">Language</span>
              <select class="media-r2r-select" data-media-field="language">
                <option>Auto / project language</option>
                <option>German</option>
                <option>English</option>
                <option>Arabic</option>
              </select>
            </label>
            <label class="media-r2s-control-wrap">
              <span class="media-r2s-control-label">Voice</span>
              <select class="media-r2r-select" data-media-field="voice">
                <option>Voice preset</option>
                <option>Male commercial</option>
                <option>Female commercial</option>
                <option>Warm narrator</option>
              </select>
            </label>
            <label class="media-r2s-control-wrap">
              <span class="media-r2s-control-label">Tone</span>
              <select class="media-r2r-select" data-media-field="tone">
                <option>Confident</option>
                <option>Premium</option>
                <option>Friendly</option>
                <option>Energetic</option>
              </select>
            </label>
            <div class="media-r2s-primary-wrap">
              <button class="media-r2r-primary" type="button" data-media-action="generate-prompt">${escapeHtml(actionLabel)}</button>
            </div>
          </div>
    `;
  }

  if (normalized === "video") {
    return `
          <div class="media-r2s-mode-note">Video mode needs one clear motion. For product accuracy, add a start frame before real generation.</div>
          <div class="media-r2r-controls media-r2s-controls-video">
            <label class="media-r2s-control-wrap">
              <span class="media-r2s-control-label">Ratio</span>
              <select class="media-r2r-select" data-media-field="format">
                <option ${format.includes("9:16") ? "selected" : ""}>9:16</option>
                <option ${format.includes("16:9") ? "selected" : ""}>16:9</option>
                <option ${format.includes("1:1") ? "selected" : ""}>1:1</option>
                <option ${format.includes("4:5") ? "selected" : ""}>4:5</option>
              </select>
            </label>
            <label class="media-r2s-control-wrap">
              <span class="media-r2s-control-label">Duration</span>
              <select class="media-r2r-select" data-media-field="duration">
                <option>3s</option>
                <option>5s</option>
                <option>10s</option>
                <option>15s</option>
              </select>
            </label>
            <label class="media-r2s-control-wrap">
              <span class="media-r2s-control-label">Quality</span>
              <select class="media-r2r-select" data-media-field="quality">
                <option>Standard</option>
                <option>HD</option>
                <option>4K</option>
              </select>
            </label>
            <div class="media-r2s-primary-wrap">
              <button class="media-r2r-primary" type="button" data-media-action="generate-prompt">${escapeHtml(actionLabel)}</button>
            </div>
          </div>
    `;
  }

  if (normalized === "campaign") {
    return `
          <div class="media-r2s-mode-note">Campaign mode prepares a production pack: images, start frames, video scenes, voiceover, captions, exports, and handoff.</div>
          <div class="media-r2r-controls media-r2s-controls-campaign">
            <label class="media-r2s-control-wrap">
              <span class="media-r2s-control-label">Channel set</span>
              <select class="media-r2r-select" data-media-field="channelSet">
                <option>Primary social channels</option>
                <option>Instagram / TikTok / Shorts</option>
                <option>Marketplace + social</option>
                <option>Full campaign pack</option>
              </select>
            </label>
            <label class="media-r2s-control-wrap">
              <span class="media-r2s-control-label">Exports</span>
              <select class="media-r2r-select" data-media-field="exports">
                <option>Core ratios</option>
                <option>9:16 only</option>
                <option>1:1 + 4:5</option>
                <option>Marketplace ready</option>
              </select>
            </label>
            <label class="media-r2s-control-wrap">
              <span class="media-r2s-control-label">Review</span>
              <select class="media-r2r-select" data-media-field="review">
                <option>Approval</option>
                <option>Draft only</option>
                <option>Library handoff</option>
              </select>
            </label>
            <div class="media-r2s-primary-wrap">
              <button class="media-r2r-primary" type="button" data-media-action="prepare-publishing">${escapeHtml(actionLabel)}</button>
            </div>
          </div>
    `;
  }

  return `
          <div class="media-r2s-mode-note">Image mode uses ratio, style, and quality. Duration is hidden because it only applies to video.</div>
          <div class="media-r2r-controls media-r2s-controls-image">
            <label class="media-r2s-control-wrap">
              <span class="media-r2s-control-label">Ratio</span>
              <select class="media-r2r-select" data-media-field="format">
                <option ${format.includes("1:1") ? "selected" : ""}>1:1</option>
                <option ${format.includes("4:5") ? "selected" : ""}>4:5</option>
                <option ${format.includes("9:16") ? "selected" : ""}>9:16</option>
                <option ${format.includes("16:9") ? "selected" : ""}>16:9</option>
              </select>
            </label>
            <label class="media-r2s-control-wrap">
              <span class="media-r2s-control-label">Style</span>
              <select class="media-r2r-select" data-media-field="style">
                <option>Product photo</option>
                <option>Premium ad visual</option>
                <option>Marketplace hero</option>
                <option>Social post</option>
              </select>
            </label>
            <label class="media-r2s-control-wrap">
              <span class="media-r2s-control-label">Quality</span>
              <select class="media-r2r-select" data-media-field="quality">
                <option>Standard</option>
                <option>HD</option>
                <option>4K</option>
              </select>
            </label>
            <div class="media-r2s-primary-wrap">
              <button class="media-r2r-primary" type="button" data-media-action="generate-prompt">${escapeHtml(actionLabel)}</button>
            </div>
          </div>
  `;
}



function getMediaStudioProviderCatalogR3(mode) {
  const normalized = normalizeMediaStudioModeR2R(mode);

  const base = [
    {
      id: "prompt_only",
      name: "Prompt-only",
      model: "Prompt / job-ready draft",
      group: "Prompt-only",
      types: ["image", "video", "voice", "campaign"],
      status: "prompt",
      badge: "Prompt-only",
      bestFor: "Safe drafts, review packets, Library handoff, Publishing handoff.",
      requirements: "No provider connection required.",
      featured: true
    }
  ];

  const image = [
    {
      id: "openai_gpt_image",
      name: "OpenAI Image",
      model: "gpt-image",
      group: "Paid Cloud",
      types: ["image", "campaign"],
      status: "setup",
      badge: "Setup needed",
      bestFor: "Commercial image generation, product visuals, campaign images.",
      requirements: "API key, image model access, usage limits."
    },
    {
      id: "higgsfield_soul",
      name: "Higgsfield Soul",
      model: "Soul / Soul Cinema",
      group: "Paid Cloud",
      types: ["image", "campaign"],
      status: "setup",
      badge: "Setup needed",
      bestFor: "Fashion, cinematic product visuals, moodboards.",
      requirements: "Account/API connection and credits.",
      featured: true
    },
    {
      id: "nano_banana",
      name: "Nano Banana / Gemini Image",
      model: "Nano Banana / Gemini image",
      group: "Paid Cloud",
      types: ["image", "campaign"],
      status: "setup",
      badge: "Setup needed",
      bestFor: "Fast image drafts, product concepts, social visuals.",
      requirements: "Provider account/API availability."
    },
    {
      id: "seedream",
      name: "Seedream",
      model: "Seedream image",
      group: "Paid Cloud",
      types: ["image", "campaign"],
      status: "setup",
      badge: "Setup needed",
      bestFor: "High-quality image generation and visual exploration.",
      requirements: "Provider account/API availability."
    },
    {
      id: "recraft",
      name: "Recraft",
      model: "Recraft image",
      group: "Paid Cloud",
      types: ["image", "campaign"],
      status: "setup",
      badge: "Setup needed",
      bestFor: "Design-like visuals, ad graphics, brand-safe variations.",
      requirements: "Provider account/API availability."
    },
    {
      id: "comfyui_flux",
      name: "ComfyUI + FLUX",
      model: "FLUX workflow",
      group: "Local / Open Source",
      types: ["image", "campaign"],
      status: "local",
      badge: "Local runtime",
      bestFor: "Controlled image generation, product lock, custom workflows.",
      requirements: "Set up the studio workflow in Integrations.",
      featured: true
    },
    {
      id: "comfyui_sdxl",
      name: "ComfyUI + SDXL",
      model: "SDXL workflow",
      group: "Local / Open Source",
      types: ["image", "campaign"],
      status: "local",
      badge: "Local runtime",
      bestFor: "Open-source image generation with ControlNet/IP-Adapter/LoRA.",
      requirements: "Set up the studio workflow in Integrations."
    }
  ];

  const video = [
    {
      id: "higgsfield_video",
      name: "Higgsfield Video",
      model: "Higgsfield motion workflow",
      group: "Paid Cloud",
      types: ["video", "campaign"],
      status: "setup",
      badge: "Setup needed",
      bestFor: "Cinematic social video, fashion motion, product ads.",
      requirements: "Account/API connection, credits, video permissions.",
      featured: true
    },
    {
      id: "kling",
      name: "Kling",
      model: "Kling video",
      group: "Paid Cloud",
      types: ["video", "campaign"],
      status: "setup",
      badge: "Setup needed",
      bestFor: "Image-to-video, controlled short clips, product motion.",
      requirements: "Provider account/API, duration/ratio limits."
    },
    {
      id: "runway",
      name: "Runway",
      model: "Runway video",
      group: "Paid Cloud",
      types: ["video", "campaign"],
      status: "setup",
      badge: "Setup needed",
      bestFor: "Creative video generation, editing, and motion shots.",
      requirements: "Account/API connection and credits."
    },
    {
      id: "luma",
      name: "Luma",
      model: "Luma video",
      group: "Paid Cloud",
      types: ["video", "campaign"],
      status: "setup",
      badge: "Setup needed",
      bestFor: "Image-to-video and cinematic motion exploration.",
      requirements: "Provider account/API connection."
    },
    {
      id: "sora",
      name: "Sora",
      model: "Sora video",
      group: "Paid Cloud",
      types: ["video", "campaign"],
      status: "setup",
      badge: "Setup needed",
      bestFor: "Advanced video generation when available through provider access.",
      requirements: "Account/API access and model availability."
    },
    {
      id: "veo",
      name: "Google Veo",
      model: "Veo video",
      group: "Paid Cloud",
      types: ["video", "campaign"],
      status: "setup",
      badge: "Setup needed",
      bestFor: "High-quality video generation and motion variants.",
      requirements: "Google/provider access, model permissions."
    },
    {
      id: "wan_video",
      name: "Wan Video",
      model: "Wan local video",
      group: "Local / Open Source",
      types: ["video", "campaign"],
      status: "local",
      badge: "Local runtime",
      bestFor: "Private/local video generation workflows.",
      requirements: "Local worker endpoint, installed model, GPU/queue health.",
      featured: true
    },
    {
      id: "hunyuan_video",
      name: "HunyuanVideo",
      model: "HunyuanVideo local workflow",
      group: "Local / Open Source",
      types: ["video", "campaign"],
      status: "local",
      badge: "Local runtime",
      bestFor: "Open/local video generation with controlled workflows.",
      requirements: "Set up the studio workflow in Integrations."
    },
    {
      id: "cogvideox",
      name: "CogVideoX",
      model: "CogVideoX local workflow",
      group: "Local / Open Source",
      types: ["video", "campaign"],
      status: "local",
      badge: "Local runtime",
      bestFor: "Open-source video generation experiments and private workflows.",
      requirements: "Runtime endpoint, installed model, queue status."
    },
    {
      id: "animatediff",
      name: "AnimateDiff",
      model: "AnimateDiff workflow",
      group: "Local / Open Source",
      types: ["video", "campaign"],
      status: "local",
      badge: "Local runtime",
      bestFor: "Animation from image workflows and controlled loops.",
      requirements: "Set up the studio workflow in Integrations."
    }
  ];

  const voice = [
    {
      id: "openai_audio",
      name: "OpenAI Audio",
      model: "OpenAI speech/audio",
      group: "Paid Cloud",
      types: ["voice", "campaign"],
      status: "setup",
      badge: "Setup needed",
      bestFor: "Voiceover, narration, multilingual audio direction.",
      requirements: "API key and audio model access.",
      featured: true
    },
    {
      id: "elevenlabs",
      name: "ElevenLabs",
      model: "ElevenLabs voice",
      group: "Paid Cloud",
      types: ["voice", "campaign"],
      status: "setup",
      badge: "Setup needed",
      bestFor: "Commercial voiceover, emotion, voice presets.",
      requirements: "Account/API key, voice permissions, commercial license.",
      featured: true
    },
    {
      id: "seed_audio",
      name: "Seed Audio",
      model: "Seed Audio",
      group: "Paid Cloud",
      types: ["voice", "campaign"],
      status: "setup",
      badge: "Setup needed",
      bestFor: "Speech and ambience workflows.",
      requirements: "Provider account/API availability."
    },
    {
      id: "minimax_speech",
      name: "MiniMax Speech",
      model: "MiniMax Speech",
      group: "Paid Cloud",
      types: ["voice", "campaign"],
      status: "setup",
      badge: "Setup needed",
      bestFor: "High-fidelity narration and speech.",
      requirements: "Provider account/API availability."
    },
    {
      id: "coqui_tts",
      name: "Coqui TTS",
      model: "Coqui local TTS",
      group: "Local / Open Source",
      types: ["voice", "campaign"],
      status: "local",
      badge: "Local runtime",
      bestFor: "Local/private TTS experiments and custom voices.",
      requirements: "Local endpoint, installed voice models, license review."
    },
    {
      id: "bark",
      name: "Bark",
      model: "Bark local audio",
      group: "Local / Open Source",
      types: ["voice", "campaign"],
      status: "local",
      badge: "Local runtime",
      bestFor: "Experimental local voice/audio generation.",
      requirements: "Set up the studio workflow in Integrations."
    },
    {
      id: "musicgen",
      name: "MusicGen",
      model: "MusicGen local music",
      group: "Local / Open Source",
      types: ["voice", "campaign"],
      status: "local",
      badge: "Local runtime",
      bestFor: "Local music/SFX direction and draft audio beds.",
      requirements: "Set up the studio workflow in Integrations."
    }
  ];

  const campaign = [
    {
      id: "campaign_auto_route",
      name: "Auto route by asset type",
      model: "Smart campaign router",
      group: "Featured",
      types: ["campaign"],
      status: "prompt",
      badge: "Prompt route",
      bestFor: "Route image, video, voice, captions, and exports to the right workflow.",
      requirements: "Works in prompt-only until providers are connected.",
      featured: true
    },
    {
      id: "campaign_paid_cloud",
      name: "Paid cloud campaign route",
      model: "Cloud image + video + voice",
      group: "Paid Cloud",
      types: ["campaign"],
      status: "setup",
      badge: "Setup needed",
      bestFor: "Fast campaign execution with paid providers.",
      requirements: "Image/video/voice provider connections."
    },
    {
      id: "campaign_local_open",
      name: "Local/open campaign workflow",
      model: "Local image + video + voice",
      group: "Local / Open Source",
      types: ["campaign"],
      status: "local",
      badge: "Local runtime",
      bestFor: "Private workflows with ComfyUI, Wan, Coqui, and local queues.",
      requirements: "Local endpoints, installed models, GPU/queue health."
    },
    {
      id: "campaign_hybrid",
      name: "Hybrid campaign route",
      model: "Paid + local routing",
      group: "Featured",
      types: ["campaign"],
      status: "setup",
      badge: "Setup needed",
      bestFor: "Use paid video/voice with local product-lock image workflows.",
      requirements: "At least one cloud provider and one local runtime."
    }
  ];

  return [...base, ...image, ...video, ...voice, ...campaign].filter((provider) => provider.types.includes(normalized));
}

function getMediaStudioProviderStatusClassR3(status) {
  if (status === "connected") return "is-connected";
  if (status === "local") return "is-local";
  if (status === "prompt") return "is-prompt";
  return "is-setup";
}

function getMediaStudioProviderActionLabelR3(provider) {
  if (!provider) return "Select";
  if (provider.status === "prompt") return "Use prompt-only";
  if (provider.status === "local") return "Setup local";
  if (provider.status === "connected") return "Select";
  return "Connect";
}


// MEDIA-STUDIO-UX-R3B-REPAIR-SIMPLE-PROVIDER-MENU-IN-PLACE
function getMediaStudioSimpleProviderOptionsR3B(mode) {
  const normalized = normalizeMediaStudioModeR2R(mode);

  const common = [
    { id: "prompt_only", label: "Prompt-only", model: "Prompt draft", status: "draft", action: "Use draft mode" }
  ];

  const image = [
    { id: "openai_gpt_image", label: "OpenAI Image", model: "gpt-image", status: "connect", action: "Connect" },
    { id: "higgsfield_soul", label: "Higgsfield Soul", model: "Soul / Soul Cinema", status: "connect", action: "Connect" },
    { id: "nano_banana", label: "Nano Banana", model: "Nano Banana Pro", status: "connect", action: "Connect" },
    { id: "seedream", label: "Seedream", model: "Seedream image", status: "connect", action: "Connect" },
    { id: "recraft", label: "Recraft", model: "Recraft image", status: "connect", action: "Connect" },
    { id: "comfyui_flux", label: "ComfyUI", model: "FLUX workflow", status: "setup", action: "Set up" },
    { id: "comfyui_sdxl", label: "ComfyUI", model: "SDXL workflow", status: "setup", action: "Set up" }
  ];

  const video = [
    { id: "higgsfield_video", label: "Higgsfield Video", model: "Motion workflow", status: "connect", action: "Connect" },
    { id: "kling", label: "Kling", model: "Video model", status: "connect", action: "Connect" },
    { id: "runway", label: "Runway", model: "Video model", status: "connect", action: "Connect" },
    { id: "luma", label: "Luma", model: "Video model", status: "connect", action: "Connect" },
    { id: "sora", label: "Sora", model: "Video model", status: "connect", action: "Connect" },
    { id: "veo", label: "Google Veo", model: "Video model", status: "connect", action: "Connect" },
    { id: "wan_video", label: "Wan", model: "Video workflow", status: "setup", action: "Set up" },
    { id: "hunyuan_video", label: "HunyuanVideo", model: "Video workflow", status: "setup", action: "Set up" },
    { id: "cogvideox", label: "CogVideoX", model: "Video workflow", status: "setup", action: "Set up" },
    { id: "animatediff", label: "AnimateDiff", model: "Motion workflow", status: "setup", action: "Set up" }
  ];

  const voice = [
    { id: "openai_audio", label: "OpenAI Audio", model: "Speech / audio", status: "connect", action: "Connect" },
    { id: "elevenlabs", label: "ElevenLabs", model: "Voice model", status: "connect", action: "Connect" },
    { id: "seed_audio", label: "Seed Audio", model: "Audio model", status: "connect", action: "Connect" },
    { id: "minimax_speech", label: "MiniMax Speech", model: "Speech model", status: "connect", action: "Connect" },
    { id: "coqui_tts", label: "Coqui", model: "TTS workflow", status: "setup", action: "Set up" },
    { id: "bark", label: "Bark", model: "Audio workflow", status: "setup", action: "Set up" },
    { id: "musicgen", label: "MusicGen", model: "Music workflow", status: "setup", action: "Set up" }
  ];

  const campaign = [
    { id: "campaign_auto_route", label: "Auto route", model: "Campaign router", status: "draft", action: "Use route" },
    { id: "campaign_paid_route", label: "Connected providers", model: "Image + video + voice", status: "connect", action: "Connect" },
    { id: "campaign_local_route", label: "Studio workflow", model: "Custom workflow", status: "setup", action: "Set up" },
    { id: "campaign_hybrid_route", label: "Hybrid route", model: "Connected + studio workflow", status: "connect", action: "Connect" }
  ];

  if (normalized === "video") return [...common, ...video];
  if (normalized === "voice") return [...common, ...voice];
  if (normalized === "campaign") return [...common, ...campaign];
  return [...common, ...image];
}

function getMediaStudioProviderStatusLabelR3B(option) {
  if (!option) return "Prompt draft";
  if (option.status === "setup") return "Set up";
  if (option.status === "connect") return "Connect";
  return "Prompt draft";
}


function renderMediaStudioProviderPickerR3({ mode, selectedProviderId, escapeHtml }) {
  const providers = getMediaStudioSimpleProviderOptionsR3B(mode);
  const selected = providers.find((item) => item.id === selectedProviderId) || providers[0];
  const isDraft = selected.status === "draft";
  const action = isDraft ? "generate-prompt" : "open-integrations";
  const statusLabel = isDraft ? "Prompt draft" : selected.status === "setup" ? "Set up" : "Connect";

  return `
        <div class="media-r3b-provider-menu media-r3d-provider-menu" aria-label="Provider and model">
          <div class="media-r3b-menu-title">
            <strong>Provider</strong>
            <span class="media-r3b-menu-status ${isDraft ? "is-draft" : ""}">${escapeHtml(statusLabel)}</span>
          </div>

          <select class="media-r3d-route-select" id="mediaR2RProviderFamilySelect" data-media-r2r-provider-family>
            ${providers.map((provider) => `<option value="${escapeHtml(provider.id)}" ${provider.id === selected.id ? "selected" : ""}>${escapeHtml(provider.label)} · ${escapeHtml(provider.model)}</option>`).join("")}
          </select>

          <div class="media-r3d-provider-model-line">
            Model: <strong>${escapeHtml(selected.model)}</strong>
          </div>

          <select class="media-r3d-hidden-select" id="mediaR2RModelSelect" data-media-r2r-provider-model aria-hidden="true" tabindex="-1">
            ${providers.map((provider) => `<option value="${escapeHtml(provider.id)}" ${provider.id === selected.id ? "selected" : ""}>${escapeHtml(provider.model)}</option>`).join("")}
          </select>

          <div class="media-r3d-provider-note">
            ${isDraft ? "Prompt draft" : "Connect"}
          </div>

          <div class="media-r3b-actions">
            <button class="media-r3b-action is-primary" type="button" data-media-provider-select="${escapeHtml(selected.id)}" data-media-action="${escapeHtml(action)}">${escapeHtml(selected.action)}</button>
            <button class="media-r3b-action" type="button" data-media-action="open-library">Library</button>
          </div>
        </div>
  `;
}


function renderMediaStudioSourceControlsR3B({ mode, escapeHtml }) {
  const normalized = normalizeMediaStudioModeR2R(mode);

  if (normalized === "video") {
    return `
          <div class="media-r3b-source-row">
            <button class="media-r3b-source-button is-primary" type="button" data-media-action="open-library">Choose start frame</button>
            <button class="media-r3b-source-button" type="button" data-media-action="upload-reference">Upload start frame</button>
            <button class="media-r3b-source-button" type="button" data-media-action="open-library">Choose end frame</button>
            <div class="media-r3b-source-help">Use a start frame for better product accuracy. End frame is optional.</div>
          </div>
    `;
  }

  if (normalized === "voice") {
    return `
          <div class="media-r3b-source-row">
            <button class="media-r3b-source-button is-primary" type="button" data-media-action="upload-reference">Upload script</button>
            <button class="media-r3b-source-button" type="button" data-media-action="open-library">Choose script</button>
            <div class="media-r3b-source-help">Write or load a script, then choose voice and tone.</div>
          </div>
    `;
  }

  if (normalized === "campaign") {
    return `
          <div class="media-r3b-source-row">
            <button class="media-r3b-source-button is-primary" type="button" data-media-action="load-handoff">Load brief</button>
            <button class="media-r3b-source-button" type="button" data-media-action="open-library">Choose assets</button>
            <button class="media-r3b-source-button" type="button" data-media-action="upload-reference">Upload assets</button>
            <div class="media-r3b-source-help">Load a campaign brief or add assets before preparing the campaign pack.</div>
          </div>
    `;
  }

  return `
          <div class="media-r3b-source-row">
            <button class="media-r3b-source-button is-primary" type="button" data-media-action="upload-reference">Upload reference</button>
            <button class="media-r3b-source-button" type="button" data-media-action="open-library">Choose from Library</button>
            <div class="media-r3b-source-help">Add a product or style reference when accuracy matters.</div>
          </div>
  `;
}



function renderMediaStudioReferenceControlsR3D({ mode, escapeHtml }) {
  const normalized = normalizeMediaStudioModeR2R(mode);

  if (normalized === "video") {
    return `
          <div class="media-r3d-reference-panel" aria-label="Video reference frames">
            <div class="media-r3d-reference-title">Reference frames</div>
            <div class="media-r3d-reference-row">
              <button class="media-r3d-reference-button is-primary" type="button" data-media-action="open-library">Choose start frame</button>
              <button class="media-r3d-reference-button" type="button" data-media-action="upload-reference">Upload start frame</button>
              <button class="media-r3d-reference-button" type="button" data-media-action="open-library">Choose end frame</button>
            </div>
            <div class="media-r3d-reference-help">Use a start frame for product accuracy. End frame is optional.</div>
          </div>
    `;
  }

  if (normalized === "voice") {
    return `
          <div class="media-r3d-reference-panel" aria-label="Voice script source">
            <div class="media-r3d-reference-title">Script source</div>
            <div class="media-r3d-reference-row">
              <button class="media-r3d-reference-button is-primary" type="button" data-media-action="upload-reference">Upload script</button>
              <button class="media-r3d-reference-button" type="button" data-media-action="open-library">Choose script</button>
            </div>
            <div class="media-r3d-reference-help">Write, upload, or choose a script before preparing voice direction.</div>
          </div>
    `;
  }

  if (normalized === "campaign") {
    return `
          <div class="media-r3d-reference-panel" aria-label="Campaign brief and assets">
            <div class="media-r3d-reference-title">Campaign brief and assets</div>
            <div class="media-r3d-reference-row">
              <button class="media-r3d-reference-button is-primary" type="button" data-media-action="load-handoff">Load brief</button>
              <button class="media-r3d-reference-button" type="button" data-media-action="open-library">Choose assets</button>
              <button class="media-r3d-reference-button" type="button" data-media-action="upload-reference">Upload assets</button>
            </div>
            <div class="media-r3d-reference-help">Load a brief or add assets before preparing the campaign pack.</div>
          </div>
    `;
  }

  return `
          <div class="media-r3d-reference-panel" aria-label="Image reference">
            <div class="media-r3d-reference-title">Reference image</div>
            <div class="media-r3d-reference-row">
              <button class="media-r3d-reference-button is-primary" type="button" data-media-action="upload-reference">Upload reference</button>
              <button class="media-r3d-reference-button" type="button" data-media-action="open-library">Choose from Library</button>
            </div>
            <div class="media-r3d-reference-help">Use a product, logo, or style reference when accuracy matters.</div>
          </div>
  `;
}



function getMediaStudioCompactSourceCopyR3E(mode) {
  const normalized = normalizeMediaStudioModeR2R(mode);

  if (normalized === "video") {
    return {
      title: "Add frame",
      detail: "Start frame, end frame, or approved product reference."
    };
  }

  if (normalized === "voice") {
    return {
      title: "Add script",
      detail: "Upload or choose a script before preparing voice."
    };
  }

  if (normalized === "campaign") {
    return {
      title: "Add brief",
      detail: "Load a brief or choose campaign assets."
    };
  }

  return {
    title: "Add reference",
    detail: "Upload or choose a product, logo, or style image."
  };
}

function renderMediaStudioCompactSourceR3E({ mode, escapeHtml }) {
  const copy = getMediaStudioCompactSourceCopyR3E(mode);
  const normalized = normalizeMediaStudioModeR2R(mode);
  const plusAction = normalized === "campaign" ? "load-handoff" : "upload-reference";
  const libraryLabel = normalized === "campaign" ? "Assets" : "Library";
  const uploadLabel = normalized === "campaign" ? "Upload" : normalized === "voice" ? "Script" : "Upload";

  return `
          <div class="media-r3e-compact-source" aria-label="${escapeHtml(copy.title)}">
            <button class="media-r3e-plus" type="button" data-media-action="${escapeHtml(plusAction)}" title="${escapeHtml(copy.title)}">+</button>
            <div class="media-r3e-source-text"><strong>${escapeHtml(copy.title)}</strong> · ${escapeHtml(copy.detail)}</div>
            <button class="media-r3e-mini-action" type="button" data-media-action="open-library">${escapeHtml(libraryLabel)}</button>
            <button class="media-r3e-mini-action" type="button" data-media-action="upload-reference">${escapeHtml(uploadLabel)}</button>
          </div>
  `;
}




function getMediaStudioComposerCopyR3F(mode) {
  const normalized = normalizeMediaStudioModeR2R(mode);

  if (normalized === "video") {
    return {
      add: "Add frame",
      detail: "Start frame, end frame, or product reference.",
      placeholder: "Describe one controlled motion...",
      action: "Prepare Video Prompt",
      plusAction: "open-library",
      libraryLabel: "Frames",
      uploadLabel: "Upload"
    };
  }

  if (normalized === "voice") {
    return {
      add: "Add script",
      detail: "Upload or choose a voiceover script.",
      placeholder: "Write the voiceover script or audio direction...",
      action: "Prepare Voice Prompt",
      plusAction: "upload-reference",
      libraryLabel: "Scripts",
      uploadLabel: "Upload"
    };
  }

  if (normalized === "campaign") {
    return {
      add: "Add brief",
      detail: "Load a brief or campaign assets.",
      placeholder: "Describe the campaign goal, product, audience, offer, and required assets...",
      action: "Prepare Campaign Pack",
      plusAction: "load-handoff",
      libraryLabel: "Assets",
      uploadLabel: "Upload"
    };
  }

  return {
    add: "Add reference",
    detail: "Upload or choose a product, logo, or style image.",
    placeholder: "Describe the image you want to create...",
    action: "Prepare Image Prompt",
    plusAction: "upload-reference",
    libraryLabel: "Library",
    uploadLabel: "Upload"
  };
}

function getMediaStudioComposerCatalogR3H(mode) {
  const normalized = normalizeMediaStudioModeR2R(mode);

  const ratios = [
    "Auto",
    "1:1",
    "3:4",
    "4:3",
    "2:3",
    "3:2",
    "9:16",
    "16:9",
    "5:4",
    "4:5",
    "21:9"
  ];

  const imageProviders = [
    ["prompt_only", "Prompt-only · Prompt draft"],
    ["openai_image", "OpenAI Image · gpt-image"],
    ["higgsfield_soul", "Higgsfield Soul · Soul / Soul Cinema"],
    ["nano_banana", "Nano Banana · Nano Banana Pro"],
    ["seedream", "Seedream · Seedream image"],
    ["recraft", "Recraft · Recraft image"],
    ["comfyui_flux", "ComfyUI · FLUX workflow"],
    ["comfyui_sdxl", "ComfyUI · SDXL workflow"]
  ];

  const videoProviders = [
    ["prompt_only", "Prompt-only · Video draft"],
    ["kling", "Kling · Kling 3.0"],
    ["runway", "Runway · Gen video"],
    ["higgsfield_video", "Higgsfield · Video"],
    ["luma", "Luma · Dream Machine"],
    ["sora", "Sora · Video"],
    ["veo", "Veo · Video"],
    ["wan", "Wan · Open video workflow"],
    ["hunyuanvideo", "HunyuanVideo · Open video workflow"]
  ];

  const voiceProviders = [
    ["prompt_only", "Prompt-only · Voice draft"],
    ["openai_audio", "OpenAI Audio · Voice"],
    ["elevenlabs", "ElevenLabs · Voice"],
    ["seed_audio", "Seed Audio · Voice model"],
    ["minimax_speech", "MiniMax · Voice"],
    ["coqui", "Coqui · Open voice workflow"],
    ["bark", "Bark · Open voice workflow"],
    ["musicgen", "MusicGen · Music workflow"]
  ];

  const campaignProviders = [
    ["auto_route", "Auto route · Campaign pack"],
    ["prompt_only", "Prompt-only · Campaign draft"],
    ["paid_cloud_pack", "Cloud · Campaign"],
    ["local_open_pack", "Local / open · Campaign"]
  ];

  if (normalized === "video") {
    return {
      providers: videoProviders,
      ratios,
      quality: ["Standard", "High", "4K-ready", "Production"],
      duration: ["3s", "5s", "8s", "10s", "15s"],
      status: "Start frame",
      defaultRatio: "4:5",
      defaultQuality: "Standard"
    };
  }

  if (normalized === "voice") {
    return {
      providers: voiceProviders,
      ratios: ["Auto", "Project", "Arabic", "English", "German"],
      quality: ["Confident", "Warm", "Premium", "Narration"],
      duration: ["Voice preset", "Male", "Female", "Neutral"],
      status: "Script-ready",
      defaultRatio: "Auto",
      defaultQuality: "Confident"
    };
  }

  if (normalized === "campaign") {
    return {
      providers: campaignProviders,
      ratios: ["Core ratios", "1:1 / 4:5 / 9:16", "Social channels", "Marketplace"],
      quality: ["Approval", "Draft pack", "Production pack", "Publishing"],
      duration: ["Full timeline", "Images only", "Video scenes", "Voice + captions"],
      status: "Timeline pack",
      defaultRatio: "Core ratios",
      defaultQuality: "Approval"
    };
  }

  return {
    providers: imageProviders,
    ratios,
    quality: ["Standard", "High", "4K-ready", "Production"],
    duration: ["Prompt draft", "Reference", "Product photo", "Ad creative"],
    status: "Reference",
    defaultRatio: "1:1",
    defaultQuality: "Standard"
  };
}

function renderMediaStudioOptionsR3H(options, selected, escapeHtml) {
  return options.map((item) => {
    const value = Array.isArray(item) ? item[0] : item;
    const label = Array.isArray(item) ? item[1] : item;
    return `<option value="${escapeHtml(value)}"${String(label) === String(selected) || String(value) === String(selected) ? " selected" : ""}>${escapeHtml(label)}</option>`;
  }).join("");
}

function renderMediaStudioHiggsfieldComposerR3F({ mode, escapeHtml }) {
  const normalized = normalizeMediaStudioModeR2R(mode);
  const copy = getMediaStudioComposerCopyR3F(mode);
  const catalog = getMediaStudioComposerCatalogR3H(mode);
  const selectedProvider = catalog.providers[0]?.[0] || "prompt_only";

  return `
          <div class="media-r3f-composer" aria-label="Compact media composer">
            <div class="media-r3f-prompt-line">
              <button class="media-r3f-plus" type="button" data-media-action="${escapeHtml(copy.plusAction)}" title="${escapeHtml(copy.add)}">+</button>
              <div class="media-r3f-inline-copy"><strong>${escapeHtml(copy.add)}</strong> · ${escapeHtml(copy.detail)}</div>
              <button class="media-r3f-mini-button" type="button" data-media-action="open-library">${escapeHtml(copy.libraryLabel)}</button>
              <button class="media-r3f-mini-button" type="button" data-media-action="upload-reference">${escapeHtml(copy.uploadLabel)}</button>
            </div>

            <div class="media-r3f-controls">
              <select class="media-r3f-select media-r3f-provider-chip media-r3h-select" data-media-r3f-provider aria-label="Provider model">
                ${renderMediaStudioOptionsR3H(catalog.providers, selectedProvider, escapeHtml)}
              </select>
              <select class="media-r3f-select media-r3h-small-select" data-media-r3f-ratio aria-label="${normalized === "voice" ? "Language" : "Ratio"}">
                ${renderMediaStudioOptionsR3H(catalog.ratios, catalog.defaultRatio, escapeHtml)}
              </select>
              <select class="media-r3f-select media-r3h-small-select" data-media-r3f-quality aria-label="Quality">
                ${renderMediaStudioOptionsR3H(catalog.quality, catalog.defaultQuality, escapeHtml)}
              </select>
              <select class="media-r3f-select media-r3h-small-select" data-media-r3f-duration aria-label="${normalized === "video" ? "Duration" : "Mode option"}">
                ${renderMediaStudioOptionsR3H(catalog.duration, catalog.duration[0], escapeHtml)}
              </select>
              <span class="media-r3h-status-chip">${escapeHtml(catalog.status)}</span>
              <button class="media-r3f-main-action" type="button" data-media-action="generate-prompt">${escapeHtml(copy.action)}</button>
            </div>
          </div>
  `;
}



const MEDIA_STUDIO_INTEGRATION_INTENT_KEY_C1 = "mh.mediaStudio.integrationIntent.v1";

function mapMediaStudioProviderToIntegrationC1(providerId = "") {
  const normalized = String(providerId || "").toLowerCase();

  const aliases = {
    openai_image: "openai",
    openai_audio: "openai",
    sora: "openai",
    higgsfield_soul: "higgsfield",
    higgsfield_video: "higgsfield",
    nano_banana: "google-ai",
    veo: "google-ai",
    seedream: "bytedance",
    seed_audio: "bytedance",
    recraft: "recraft",
    comfyui_flux: "comfyui",
    comfyui_sdxl: "comfyui",
    wan: "comfyui",
    hunyuanvideo: "comfyui",
    kling: "kling",
    runway: "runway",
    luma: "luma",
    elevenlabs: "elevenlabs",
    minimax_speech: "minimax",
    coqui: "coqui",
    bark: "bark",
    musicgen: "musicgen",
    paid_cloud_pack: "openai",
    local_open_pack: "comfyui",
    auto_route: "openai"
  };

  return aliases[normalized] || normalized || "";
}

function getSelectedMediaStudioProviderIntentC1(root, mode, projectName) {
  const providerSelect = root?.querySelector?.("[data-media-r3f-provider]");
  const selectedOption = providerSelect?.selectedOptions?.[0] || null;
  const providerId = providerSelect?.value || selectedOption?.value || "prompt_only";
  const providerLabel = selectedOption?.textContent?.trim?.() || providerId;
  const integrationId = mapMediaStudioProviderToIntegrationC1(providerId);

  return {
    source: "media-studio",
    returnTo: "media-studio",
    providerId,
    providerLabel,
    integrationId,
    mode: normalizeMediaStudioModeR2R(mode),
    projectName: projectName || "",
    createdAt: new Date().toISOString()
  };
}

function openMediaStudioProviderIntegrationC1(root, { mode, projectName, navigateTo, showMessage } = {}) {
  const intent = getSelectedMediaStudioProviderIntentC1(root, mode, projectName);

  if (!intent.providerId || intent.providerId === "prompt_only") {
    showMessage?.("Choose a provider first, then connect it in Integrations.");
    return;
  }

  try {
    window.sessionStorage?.setItem(MEDIA_STUDIO_INTEGRATION_INTENT_KEY_C1, JSON.stringify(intent));
  } catch (error) {
    console.warn("Unable to store Media Studio integration intent", error);
  }

  showMessage?.(`Opening Integrations for ${intent.providerLabel}.`);

  if (typeof navigateTo === "function") {
    navigateTo("integrations");
    return;
  }

  window.location.hash = "#integrations";
}

function bindMediaStudioIntegrationsReturnFlowC1(root, { mode, projectName, navigateTo, showMessage } = {}) {
  root?.querySelectorAll?.('[data-media-action="open-integrations"], [data-media-exec-action="open-integrations"]').forEach((button) => {
    if (button.dataset.mediaC1IntegrationBound === "true") return;
    button.dataset.mediaC1IntegrationBound = "true";

    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openMediaStudioProviderIntegrationC1(root, { mode, projectName, navigateTo, showMessage });
    }, true);
  });
}

/* MEDIA-STUDIO-PHASE-C1-INTEGRATIONS-RETURN-FLOW */

function renderMediaStudioModeSpecificCanvasR2R({ session, state, projectName, selectedItem, handoff, escapeHtml }) {
  const mode = normalizeMediaStudioModeR2R(session?.mode || selectedItem?.mode || "image");
  const copy = getMediaStudioModeCopyR2R(mode);
  const rawProvider = session?.provider || selectedItem?.provider || "Prompt-only";
  const rawModel = session?.model || session?.providerModel || selectedItem?.model || "Prompt draft";
  const provider = /pending|backend/i.test(String(rawProvider)) ? "Prompt-only" : rawProvider;
  const model = /pending|backend/i.test(String(rawModel)) ? "Prompt draft" : rawModel;
  const format = session?.format || selectedItem?.format || "1:1 / 4:5 / 9:16";
  const channel = session?.channel || handoff?.channel || selectedItem?.channel || "primary social channels";
  const objective = session?.objective || handoff?.objective || selectedItem?.objective || "";
  const prompt = session?.prompt || selectedItem?.prompt || "";
  const providerReady = Boolean(session?.providerReady || state?.providerReady || selectedItem?.providerReady);
  const outputReady = Boolean(selectedItem?.assetUrl || selectedItem?.outputUrl || selectedItem?.previewUrl || session?.outputUrl);
  const statusLabel = outputReady ? "Output ready" : providerReady ? "Ready to generate" : "Setup needed";
  const actionLabel = providerReady ? copy.primaryAction : copy.fallbackAction;

  const modes = [
    ["image", "Image", "Product photos, ads, posts, marketplace visuals."],
    ["video", "Video", "Scenes, start/end frames, reels, shorts."],
    ["voice", "Voice", "Voiceover, narration, music/SFX direction."],
    ["campaign", "Campaign", "Full timeline for images, video, voice, exports."]
  ];

  const modeCards = modes.map(([value, label, desc]) => `
    <button class="media-r2r-mode ${mode === value ? "is-active" : ""}" type="button" data-media-mode="${escapeHtml(value)}" data-media-creation-mode="${escapeHtml(value)}">
      <strong>${escapeHtml(label)}</strong>
      <span>${escapeHtml(desc)}</span>
    </button>
  `).join("");

  const promptPlaceholder = mode === "video"
    ? "Describe one controlled motion. Example: slow camera push-in, product remains sharp, logo stays readable."
    : mode === "voice"
      ? "Write the voiceover script or audio direction..."
      : mode === "campaign"
        ? "Describe the campaign goal, product, audience, offer, and required assets..."
        : "Describe the image you want to create...";

  const centerCanvas = mode === "campaign" ? `
    <div class="media-r2r-timeline" aria-label="Campaign production timeline">
      ${[
        ["1", "Hero image", "Generate the main campaign visual."],
        ["2", "Product image", "Create clean product and marketplace assets."],
        ["3", "Start frames", "Prepare frames before video generation."],
        ["4", "Video scenes", "Generate short controlled scenes."],
        ["5", "Voiceover", "Create narration or audio direction."],
        ["6", "Export pack", "Prepare ratios, captions, and publishing handoff."]
      ].map(([n, title, desc]) => `
        <div class="media-r2r-timeline-row">
          <div class="media-r2r-step">${escapeHtml(n)}</div>
          <div>
            <div class="media-r2r-step-title">${escapeHtml(title)}</div>
            <div class="media-r2r-step-copy">${escapeHtml(desc)}</div>
          </div>
          <button class="media-r2r-secondary" type="button" data-media-action="preview">Create</button>
        </div>
      `).join("")}
    </div>
  ` : mode === "video" ? `
    <div style="width:min(840px,100%);">
      <div class="media-r2r-frame-grid">
        <button class="media-r2r-frame-drop" type="button" data-media-action="open-library">+ Start frame<br><small>Upload or choose approved image</small></button>
        <button class="media-r2r-frame-drop" type="button" data-media-action="open-library">+ End frame<br><small>Optional target frame</small></button>
      </div>
      <div class="media-r2r-icon">${escapeHtml(copy.icon)}</div>
      <div class="media-r2r-canvas-title">${escapeHtml(copy.canvasTitle)}</div>
      <div class="media-r2r-canvas-copy">${escapeHtml(copy.canvasCopy)}</div>
    </div>
  ` : `
    <div>
      <div class="media-r2r-icon">${escapeHtml(copy.icon)}</div>
      <div class="media-r2r-canvas-title">${escapeHtml(copy.canvasTitle)}</div>
      <div class="media-r2r-canvas-copy">${escapeHtml(copy.canvasCopy)}</div>
    </div>
  `;

  return `
    <section class="media-r2r-studio" id="mediaR2RModeCanvas" data-media-r2r-mode="${escapeHtml(mode)}">
      <aside class="media-r2r-rail" aria-label="Media creation mode">
        <div class="media-r2r-label">Create</div>
        ${modeCards}

        <div class="media-r2r-provider-box">
          ${renderMediaStudioProviderPickerR3({ mode, selectedProviderId: "prompt_only", escapeHtml })}
        </div>
      </aside>

      <main class="media-r2r-main" id="mediaR2RCreationCanvas" aria-label="${escapeHtml(copy.eyebrow)}">
        <header class="media-r2r-head">
          <div>
            <div class="media-r2r-label">${escapeHtml(copy.eyebrow)}</div>
            <div class="media-r2r-title">${escapeHtml(copy.title)}</div>
            <div class="media-r2r-copy">${escapeHtml(copy.description)}</div>
          </div>
          <div class="media-r2r-pill">${escapeHtml(statusLabel)}</div>
        </header>

        <div class="media-r2r-live-canvas" id="mediaR2RLiveOutputCanvas">
          ${centerCanvas}
        </div>

        <footer class="media-r2r-bottom">
          ${renderMediaStudioHiggsfieldComposerR3F({ mode, escapeHtml })}
          <textarea class="media-r2r-textarea" data-media-field="prompt" placeholder="${escapeHtml(promptPlaceholder)}">${escapeHtml(prompt || objective)}</textarea>
<div class="media-r2r-actions">
            <button class="media-r2r-secondary" type="button" data-media-action="preview">Preview</button>
            <button class="media-r2r-secondary" type="button" data-media-action="save-draft">Save Draft</button>
            <button class="media-r2r-secondary" type="button" data-media-action="prepare-publishing">Prepare Handoff</button>
            <button class="media-r2r-secondary" type="button" data-media-action="improve-prompt">Improve Prompt</button>
          </div>
        </footer>
      </main>

      <aside class="media-r2r-inspector" aria-label="Production inspector">
        <div class="media-r2r-card">
          <div class="media-r2r-card-title">Production setup</div>
          <div class="media-r2r-kv">
            <div class="media-r2r-kv-row"><span>Project</span><strong>${escapeHtml(projectName || "Current project")}</strong></div>
            <div class="media-r2r-kv-row"><span>Mode</span><strong>${escapeHtml(copy.label)}</strong></div>
            <div class="media-r2r-kv-row"><span>Provider</span><strong>${escapeHtml(provider)}</strong></div>
            <div class="media-r2r-kv-row"><span>Model</span><strong>${escapeHtml(model)}</strong></div>
            <div class="media-r2r-kv-row"><span>Format</span><strong>${escapeHtml(format)}</strong></div>
            <div class="media-r2r-kv-row"><span>Channel</span><strong>${escapeHtml(channel)}</strong></div>
          </div>
        </div>

        <div class="media-r2r-card">
          <div class="media-r2r-card-title">Readiness</div>
          <div class="media-r2r-chip-row">
            <span class="media-r2r-chip is-ready">Brief</span>
            <span class="media-r2r-chip ${providerReady ? "is-ready" : "is-warning"}">Provider</span>
            <span class="media-r2r-chip is-warning">Reference</span>
            <span class="media-r2r-chip is-warning">Review</span>
          </div>
          <p class="media-r2r-copy" style="font-size:0.82rem;margin-top:10px;">${escapeHtml(copy.providerHint)}</p>
        </div>

        <div class="media-r2r-card">
          <div class="media-r2r-card-title">Safety</div>
          <p class="media-r2r-copy" style="font-size:0.82rem;">Use approved references, product lock, safe claims, platform format, and preview approval before publishing.</p>
        </div>

        <div class="media-r2r-actions" style="justify-content:flex-start;">
          <button class="media-r2r-secondary" type="button" data-media-action="load-handoff">Load Brief</button>
          <button class="media-r2r-secondary" type="button" data-media-action="open-integrations">Connect Provider</button>
        </div>
      </aside>
    </section>
  `;
}


function renderMediaStudioCreationShell({ projectName, backendProjectName, state, session, selectedItem, handoff, escapeHtml }) {
  const mode = asString(session?.form?.mode || session?.mode || selectedItem?.mode || "image");
  const modeCards = [
    ["image", "Image", "Product photos, ads, posts, thumbnails, marketplace visuals."],
    ["video", "Video", "Scenes, start/end frames, image-to-video, reels, shorts."],
    ["voice", "Voice", "Voiceover, scripts, pronunciation, music/SFX direction."],
    ["campaign-pack", "Campaign Pack", "Image + video + voice + captions + export handoff."]
  ];

  const generation = getMediaGenerationStatusForUx(session, selectedItem);
  const providerChoices = getMediaProviderChoices(mode);
  const selectedProvider = generation.choice.value;
  const providerLabel = generation.choice.label;
  const ctx = buildMediaCompilerContext(session, selectedItem, handoff);
  const version = selectedVersionEntry(session);
  const hasOutput = Boolean(
    selectedItem?.output ||
    selectedItem?.result ||
    selectedItem?.asset_url ||
    version?.output ||
    version?.payload ||
    version?.image_url ||
    version?.video_url ||
    version?.audio_url
  );

  return `
    <section class="media-creation-studio-shell" id="mediaStudioCreationShell" aria-label="International Media Creation Studio">
      <div class="media-creation-studio-head">
        <div>
          <div class="media-os-kicker">Creation Studio · International Layout</div>
          <h3>What do you want to create?</h3>
          <p>Choose a mode, add a brief, pick a provider/model, then generate or prepare the asset.</p>
        </div>
        <span class="media-os-badge ${hasOutput ? "is-ready" : "is-waiting"}">${escapeHtml(hasOutput ? "Output available" : "No output yet")}</span>
      </div>

      <div class="media-creation-grid">
        <aside class="media-creation-rail" aria-label="Media mode and provider selection">
          ${modeCards.map(([id, title, copy]) => `
            <button class="media-mode-card${id === mode ? " is-active" : ""}" type="button" data-media-mode="${escapeHtml(id)}"${id === "image" || id === "video" ? ` data-new-media-job="${escapeHtml(id)}"` : ""}>
              <strong>${escapeHtml(title)}</strong>
              <span>${escapeHtml(copy)}</span>
            </button>
          `).join("")}

          <div class="media-provider-select-wrap">
            <label for="mediaProviderPreferenceSelect">Provider family</label>
            <select id="mediaProviderPreferenceSelect" class="media-provider-select" aria-label="Provider selector">
              ${providerChoices.map((choice) => `
                <option value="${escapeHtml(choice.value)}"${choice.value === selectedProvider ? " selected" : ""}>${escapeHtml(choice.label)}</option>
              `).join("")}
            </select>
            <div class="media-provider-note">${escapeHtml(generation.choice.note)}</div>
          </div>

          <div class="media-model-select-wrap">
            <label for="mediaProviderModelSelect">Model / workflow</label>
            <select id="mediaProviderModelSelect" class="media-model-select" aria-label="Provider model selector">
              ${getMediaProviderModelChoices(selectedProvider, mode).map((choice) => `
                <option value="${escapeHtml(choice.value)}"${choice.value === getSelectedMediaProviderModelChoice(session, selectedItem).value ? " selected" : ""}>${escapeHtml(choice.label)}</option>
              `).join("")}
            </select>
            <div class="media-provider-note">${escapeHtml(getSelectedMediaProviderModelChoice(session, selectedItem).note)}</div>
          </div>

          <div class="media-provider-family-strip" aria-label="Provider family state">
            <span class="${generation.choice.type === "paid" ? "is-active" : ""}">Paid</span>
            <span class="${generation.choice.type === "local" ? "is-active" : ""}">Local/Open</span>
            <span class="${generation.choice.type === "safe" ? "is-active" : ""}">Prompt-only</span>
          </div>

          <div class="media-creation-actions">
            <button type="button" data-media-exec-action="open-integrations">Open Integrations</button>
            <button type="button" data-media-exec-action="open-library">Open Library</button>
          </div>
        </aside>

        <main class="media-creation-canvas" id="mediaStudioCreationCanvas" aria-label="Media creation canvas">
          <div class="media-generation-status">
            <div>
              <strong>${escapeHtml(generation.title)}</strong>
              <p>${escapeHtml(generation.message)}</p>
              <p><b>${escapeHtml(providerLabel)}</b> · ${escapeHtml(getSelectedMediaProviderModelChoice(session, selectedItem).label)}</b> · ${escapeHtml(ctx.product)} · ${escapeHtml(ctx.ratio)} · ${escapeHtml(ctx.platform)}</p>
            </div>
            <span class="media-generation-pill${generation.ready ? " is-ready" : ""}">${escapeHtml(generation.ready ? "Ready" : "Setup needed")}</span>
          </div>

          <div class="media-preview-command-row" aria-label="Preview first media command row">
            <div>
              <strong>${escapeHtml(mode === "video" ? "Video preview canvas" : mode === "voice" ? "Voice preview canvas" : mode === "campaign-pack" ? "Campaign pack preview" : "Image preview canvas")}</strong>
              <p>${escapeHtml(hasOutput ? "Review the generated output before Library save or Publishing handoff." : "No output yet. Generate, connect a provider, or save a draft.")}</p>
            </div>
            <div class="media-preview-status-grid">
              <span class="${hasOutput ? "is-ready" : "is-warning"}">${escapeHtml(hasOutput ? "output ready" : "no output yet")}</span>
              <span class="${generation.ready ? "is-ready" : "is-warning"}">${escapeHtml(generation.ready ? "provider ready" : "provider setup needed")}</span>
              <span>${escapeHtml(mode)}</span>
            </div>
          </div>

          <div class="media-creation-preview-frame" id="mediaStudioOutputCanvas" aria-label="Media output preview canvas">
            ${!hasOutput ? `
              <div class="media-empty-preview-state">
                <div>
                  <strong>${escapeHtml(mode === "video" ? "Your video will appear here" : mode === "voice" ? "Your voice/audio will appear here" : mode === "campaign-pack" ? "Your campaign assets will appear here" : "Your image will appear here")}</strong>
                  <p>${escapeHtml(generation.ready ? "Provider is ready. Generate output, then review it before saving or publishing." : "Provider is not connected yet. You can still build a strong prompt, save the draft, or open Integrations to connect paid or local/open providers.")}</p>
                  <div class="media-empty-preview-actions">
                    <button class="is-primary" type="button" data-media-exec-action="scroll-generator">${escapeHtml(mode === "video" ? "Prepare video prompt" : mode === "voice" ? "Prepare voice prompt" : mode === "campaign-pack" ? "Build campaign pack" : "Prepare image prompt")}</button>
                    <button type="button" data-media-exec-action="open-integrations">Open Integrations</button>
                    <button type="button" data-media-version-action="save-draft">Save Draft</button>
                  </div>
                </div>
              </div>
            ` : ""}
            ${renderOutputPreviewPanel(session, selectedItem, escapeHtml)}
          </div>

          <details class="media-creation-control-drawer" open>
            <summary>
              Prompt, generation, and conversion controls
              <span>${escapeHtml(generation.ready ? "generation ready" : "prompt/job mode")}</span>
            </summary>
            <div class="media-creation-control-drawer-body">
              <div class="media-provider-readiness-card${generation.ready ? " is-ready" : ""}">
                <strong>${escapeHtml(generation.title)}</strong>
                <p>${escapeHtml(generation.message)}</p>
              </div>

              <div class="media-creation-actions" aria-label="Primary media creation actions">
                <button class="is-primary" type="button" data-media-exec-action="scroll-generator">${escapeHtml(mode === "video" ? "Generate Video" : mode === "voice" ? "Generate Voice" : mode === "campaign-pack" ? "Build Campaign Pack" : "Generate Image")}</button>
                <button type="button" data-media-exec-action="scroll-preview">Open Preview</button>
                <button type="button" data-media-exec-action="scroll-review">Review / Approve</button>
                <button type="button" data-media-version-action="save-library">Save to Library</button>
                <button type="button" data-media-version-action="send-publishing">Prepare Campaign Pack</button>
              </div>

              <div class="media-creation-generator-frame">
                ${renderGenerator(session, state, backendProjectName, escapeHtml)}
              </div>

              <div class="media-creation-promptops-frame">
                ${renderPromptBuilder(session, handoff, escapeHtml)}
              </div>
            </div>
          </details>
        </main>

        <aside class="media-creation-inspector" id="mediaStudioInspector" aria-label="Media Studio inspector">
          <div class="media-inspector-tabs" aria-label="Inspector tabs">
            <span>Brief</span>
            <span>Assets</span>
            <span>Provider</span>
            <span>Lock</span>
            <span>Platform</span>
            <span>Safety</span>
          </div>

          <div class="media-inspector-card">
            <strong>Current production context</strong>
            <div class="media-inspector-row"><span>Project</span><b>${escapeHtml(projectName || ctx.product)}</b></div>
            <div class="media-inspector-row"><span>Campaign</span><b>${escapeHtml(ctx.campaign)}</b></div>
            <div class="media-inspector-row"><span>Mode</span><b>${escapeHtml(mode === "campaign-pack" ? "Campaign Pack" : titleCase(mode))}</b></div>
            <div class="media-inspector-row"><span>Provider</span><b>${escapeHtml(providerLabel)}</b></div>
            <div class="media-inspector-row"><span>Model</span><b>${escapeHtml(getSelectedMediaProviderModelChoice(session, selectedItem).label)}</b></div>
            <div class="media-inspector-row"><span>Format</span><b>${escapeHtml(ctx.ratio)}</b></div>
          </div>

          <div class="media-inspector-card media-provider-model-card">
            <strong>Provider + model readiness</strong>
            <p>${escapeHtml(getSelectedMediaProviderModelChoice(session, selectedItem).note)}</p>
            <div class="media-model-chip-row">
              <span class="${generation.choice.type === "paid" ? "is-paid" : generation.choice.type === "local" ? "is-local" : ""}">${escapeHtml(generation.choice.type)}</span>
              <span class="is-required">${escapeHtml(generation.choice.type === "paid" ? "integration required" : generation.choice.type === "local" ? "local runtime required" : "no provider required")}</span>
              <span>${escapeHtml(mode)}</span>
            </div>
          </div>

          <div class="media-inspector-card">
            <strong>Production safety</strong>
            <p>Use product references, Product Lock, negative prompts, provider readiness, platform format, and preview approval before publishing.</p>
          </div>

          <div class="media-creation-actions">
            <button type="button" data-media-packet-action="load-packet"${handoff ? "" : " disabled aria-disabled=\"true\""}>Load campaign brief</button>
            <button type="button" data-media-packet-action="build-execution-prompt">Build smart prompt</button>
          </div>
        </aside>
      </div>
    </section>
  `;
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
  /* MEDIA-STUDIO-PHASE2R2-REPAIR-SOURCE-PROVENANCE-LABEL: Source Provenance */
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
      <div class="media-production-center media-os-shell media-os-shell-2r2" data-theme-version="v2">
        <div class="media-r1-start-hint">Start here</div>
        ${renderMediaStudioModeSpecificCanvasR2R({ session, state, projectName, selectedItem, handoff, escapeHtml })}
        <details class="media-system-status-drawer">
          <summary>System status, workflow, and approvals · Advanced production details</summary>
          <div class="media-system-status-body">
            <div class="media-r2s-advanced-menu" aria-label="Advanced production detail groups">
              <span class="media-r2s-advanced-chip">Source</span>
              <span class="media-r2s-advanced-chip">Queue</span>
              <span class="media-r2s-advanced-chip">Review</span>
              <span class="media-r2s-advanced-chip">Product Lock</span>
              <span class="media-r2s-advanced-chip">Prompt Compiler</span>
              <span class="media-r2s-advanced-chip">Scene Planner</span>
              <span class="media-r2s-advanced-chip">Provider Readiness</span>
              <span class="media-r2s-advanced-chip">Versions</span>
            </div>
        ${renderMediaCommandHeader({ projectName, session, metrics, selectedItem, handoff, recommendation, escapeHtml })}
        ${renderMediaWorkflowStrip({ session, selectedItem, handoff, escapeHtml })}
          </div>
        </details>
        <div class="media-advanced-stack" id="mediaStudioAdvancedStack">
          <details>
            <summary>Advanced brief, source, product lock, prompt compiler, and scene planner</summary>
            ${renderMediaPacketReceiverPanel({ projectName, session, selectedItem, handoff, escapeHtml })}
            ${renderMediaExecutionRoomPanel({ session, selectedItem, handoff, escapeHtml })}
            ${renderMediaAssetSourceTruthPanel({ state, session, selectedItem, escapeHtml })}
            ${renderMediaProductionIntelligenceRouter({ session, selectedItem, handoff, escapeHtml })}
            ${renderMediaProviderModelRouterPanel({ session, selectedItem, escapeHtml })}
            ${renderMediaProductLockChecklistPanel({ session, selectedItem, handoff, escapeHtml })}
            ${renderMediaPromptCompilerPanel({ session, selectedItem, handoff, escapeHtml })}
            ${renderMediaPlatformExportIntentPanel({ session, selectedItem, escapeHtml })}
            ${renderMediaSceneStartEndReadinessPanel({ session, selectedItem, handoff, escapeHtml })}
            ${renderMediaScenePlannerWorkflowPanel({ session, selectedItem, handoff, escapeHtml })}
          </details>
        </div>

        ${renderOverview(metrics, escapeHtml)}
        ${renderRecommendation(recommendation, metrics, selectedItem, handoff, escapeHtml)}
        ${renderMediaReadinessSummary({ session, selectedItem, handoff, escapeHtml })}
        ${session.error ? `<div class="simple-banner">${escapeHtml(session.error)}</div>` : ""}
        ${session.loading ? `<div class="empty-box">Loading media jobs, handoffs, approvals, tasks, and event history...</div>` : ""}
        <div class="media-production-grid">
          <div class="media-main-column media-bottom-production-drawer">
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

    bindMediaStudioIntegrationsReturnFlowC1(root, {
      mode: session.mode,
      projectName,
      navigateTo,
      showMessage
    });


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

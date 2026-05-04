// public/control-center/api.js

let API_BASE_URL = "";
const DEFAULT_REQUEST_TIMEOUT_MS = 20000;

export function setApiBaseUrl(value = "") {
  API_BASE_URL = value || "";
}

function buildUrl(path = "") {
  return `${API_BASE_URL}${path}`;
}

function readControlKey() {
  try {
    if (typeof window !== "undefined") {
      const runtimeKey =
        window.__MH_CONTROL_CENTER_READ_KEY__ ||
        window.__MH_CONTROL_CENTER_WRITE_KEY__ ||
        window.__MH_CONTROL_WRITE_KEY__;

      if (runtimeKey) {
        return String(runtimeKey);
      }
    }
    if (typeof localStorage !== "undefined") {
      const stored = localStorage.getItem("mh-control-write-key");
      if (stored) return String(stored);
    }
  } catch (_) {
    // Ignore storage access errors in restricted contexts
  }
  return "";
}

function buildReadHeaders() {
  const headers = { Accept: "application/json" };
  const key = readControlKey();
  if (key) {
    headers["x-mh-control-key"] = key;
  }
  return headers;
}

function buildWriteHeaders() {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json"
  };
  const key = readControlKey();
  if (key) {
    headers["x-mh-control-key"] = key;
  }
  return headers;
}

async function parseJson(response, fallbackMessage = "Request failed") {
  let payload = null;

  try {
    payload = await response.json();
  } catch (_) {
    payload = null;
  }

  if (!response.ok) {
    const message =
      payload?.error ||
      payload?.message ||
      `${fallbackMessage} (${response.status})`;

    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    error.endpoint = response?.url || "";
    throw error;
  }

  return payload;
}

async function fetchWithTimeout(path, init = {}, timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS) {
  const controller = typeof AbortController === "function" ? new AbortController() : null;
  const timer = controller
    ? setTimeout(() => controller.abort(), Math.max(1, Number(timeoutMs) || DEFAULT_REQUEST_TIMEOUT_MS))
    : null;

  try {
    return await fetch(buildUrl(path), {
      ...init,
      signal: controller ? controller.signal : init.signal
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      const timeoutError = new Error(`Request timed out after ${timeoutMs}ms: ${path}`);
      timeoutError.endpoint = path;
      timeoutError.isTimeout = true;
      throw timeoutError;
    }

    if (error && typeof error === "object" && !error.endpoint) {
      error.endpoint = path;
    }
    throw error;
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
}

async function getJson(path, fallbackMessage, timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS) {
  const response = await fetchWithTimeout(path, {
    method: "GET",
    headers: buildReadHeaders()
  }, timeoutMs);

  return parseJson(response, fallbackMessage);
}

async function sendJson(path, method, body, fallbackMessage, timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS) {
  const response = await fetchWithTimeout(path, {
    method,
    headers: buildWriteHeaders(),
    body: body == null ? undefined : JSON.stringify(body)
  }, timeoutMs);

  return parseJson(response, fallbackMessage);
}

async function sendForm(path, formData, fallbackMessage, timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS) {
  const headers = {};
  const key = readControlKey();
  if (key) {
    headers["x-mh-control-key"] = key;
  }

  const response = await fetchWithTimeout(path, {
    method: "POST",
    headers,
    body: formData
  }, timeoutMs);

  return parseJson(response, fallbackMessage);
}

/* =========================
   NORMALIZERS
========================= */

function normalizeProjectsPayload(payload) {
  const rawItems =
    payload?.items ||
    payload?.projects ||
    [];

  const items = Array.isArray(rawItems) ? rawItems : [];

  const preferredProject =
    payload?.preferredProject ||
    (items.length
      ? (typeof items[0] === "string" ? items[0] : items[0]?.name || "")
      : "");

  return {
    items,
    preferredProject
  };
}

function normalizeProjectDashboardPayload(payload) {
  return {
    overview: payload?.overview || null,
    readiness: payload?.readiness || null,
    assets: payload?.assets || null,
    tree: payload?.tree || null,
    registry: payload?.registry || null,
    connectors: payload?.connectors || null,
    activity: payload?.activity || null,
    operations: payload?.operations || null
  };
}

function toProjectName(value) {
  const projectName = String(value || "").trim();
  if (!projectName) {
    throw new Error("Missing project name");
  }
  return projectName;
}

function createOptionalFallback(projectName, section) {
  const project = String(projectName || "").trim();

  if (section === "activity") {
    return {
      project,
      scheduled_jobs: [],
      execution_results: [],
      insights: null,
      learning: null
    };
  }

  if (section === "tree") {
    return {
      project,
      tree: []
    };
  }

  if (section === "registry") {
    return {
      project,
      total_assets: 0,
      assets: []
    };
  }

  if (section === "connectors") {
    return {
      project,
      readiness: {
        readiness_score: 0,
        checks: {},
        missing: []
      },
      sources: {}
    };
  }

  if (section === "operations") {
    return null;
  }

  if (section === "insights") {
    return null;
  }

  if (section === "learning") {
    return null;
  }

  return null;
}

function toDiagnosticEntry(section, error, required = false) {
  return {
    section,
    required: Boolean(required),
    message: String(error?.message || error || "Unknown error"),
    endpoint: String(error?.endpoint || ""),
    status: error?.status || null,
    timeout: Boolean(error?.isTimeout)
  };
}

function extractDashboardSection(payload, section) {
  const value = payload?.[section];
  if (value != null) {
    return value;
  }

  const panelError = payload?.errors?.[section];
  if (panelError) {
    const err = new Error(`Failed to load ${section}: ${panelError}`);
    err.endpoint = `/media-manager/project/:project (${section})`;
    throw err;
  }

  const err = new Error(`Missing ${section} payload`);
  err.endpoint = `/media-manager/project/:project (${section})`;
  throw err;
}

/* =========================
   PROJECTS
========================= */

export async function fetchProjects() {
  try {
    const payload = await getJson(
      "/media-manager/projects",
      "Failed to load projects",
      12000
    );

    return normalizeProjectsPayload(payload);
  } catch (error) {
    console.warn("Using fallback projects list:", error.message);

    return {
      items: [],
      preferredProject: "",
      fallback: true
    };
  }
}

/* =========================
   CORE PROJECT DATA
========================= */

export async function fetchAllCoreProjectData(projectName) {
  const safeProjectName = toProjectName(projectName);
  const encodedProjectName = encodeURIComponent(safeProjectName);

  const requiredDiagnostics = [];
  const optionalDiagnostics = [];

  const requiredDashboardPromise = getJson(
    `/media-manager/project/${encodedProjectName}`,
    "Failed to load project dashboard",
    18000
  );

  const requiredSections = ["overview", "readiness", "assets"];
  const requiredResults = await Promise.allSettled(
    requiredSections.map((section) =>
      requiredDashboardPromise.then((payload) => extractDashboardSection(payload, section))
    )
  );

  const requiredData = {};
  requiredResults.forEach((result, index) => {
    const section = requiredSections[index];
    if (result.status === "fulfilled") {
      requiredData[section] = result.value;
      return;
    }

    requiredDiagnostics.push(toDiagnosticEntry(section, result.reason, true));
  });

  if (requiredDiagnostics.length > 0) {
    const message = requiredDiagnostics
      .map((item) => `${item.section}: ${item.message}`)
      .join("; ");
    const error = new Error(`Required project data failed: ${message}`);
    error.endpoint = `/media-manager/project/${encodedProjectName}`;
    error._diagnostics = {
      required: requiredDiagnostics,
      optional: optionalDiagnostics,
      optionalPending: [
        "activity",
        "operations",
        "tree",
        "registry",
        "connectors",
        "insights",
        "learning"
      ]
    };
    throw error;
  }

  const basePayload = {
    overview: requiredData.overview,
    readiness: requiredData.readiness,
    assets: requiredData.assets,
    tree: createOptionalFallback(safeProjectName, "tree"),
    registry: createOptionalFallback(safeProjectName, "registry"),
    connectors: createOptionalFallback(safeProjectName, "connectors"),
    activity: createOptionalFallback(safeProjectName, "activity"),
    operations: createOptionalFallback(safeProjectName, "operations")
  };

  const optionalDashboardPromise = getJson(
    `/media-manager/project/${encodedProjectName}`,
    "Failed to load optional project dashboard sections",
    30000
  );

  const optionalLoaders = [
    {
      section: "activity",
      load: () => optionalDashboardPromise.then((payload) => extractDashboardSection(payload, "activity"))
    },
    {
      section: "tree",
      load: () => optionalDashboardPromise.then((payload) => extractDashboardSection(payload, "tree"))
    },
    {
      section: "registry",
      load: () => optionalDashboardPromise.then((payload) => extractDashboardSection(payload, "registry"))
    },
    {
      section: "connectors",
      load: () => optionalDashboardPromise.then((payload) => extractDashboardSection(payload, "connectors"))
    },
    {
      section: "operations",
      load: () => fetchProjectOperations(safeProjectName)
    },
    {
      section: "insights",
      load: () => fetchProjectInsights(safeProjectName)
    },
    {
      section: "learning",
      load: () => fetchProjectLearning(safeProjectName)
    }
  ];

  const optionalReady = Promise.allSettled(optionalLoaders.map((entry) => entry.load()))
    .then((results) => {
      const optionalPatch = {
        activity: createOptionalFallback(safeProjectName, "activity"),
        tree: createOptionalFallback(safeProjectName, "tree"),
        registry: createOptionalFallback(safeProjectName, "registry"),
        connectors: createOptionalFallback(safeProjectName, "connectors"),
        operations: createOptionalFallback(safeProjectName, "operations")
      };

      results.forEach((result, index) => {
        const section = optionalLoaders[index].section;
        if (result.status === "fulfilled") {
          if (section === "insights" || section === "learning") {
            optionalPatch.activity = {
              ...(optionalPatch.activity || {}),
              [section]: result.value ?? createOptionalFallback(safeProjectName, section)
            };
          } else {
            optionalPatch[section] = result.value ?? createOptionalFallback(safeProjectName, section);
          }
          return;
        }

        optionalDiagnostics.push(toDiagnosticEntry(section, result.reason, false));

        if (section === "insights" || section === "learning") {
          optionalPatch.activity = {
            ...(optionalPatch.activity || {}),
            [section]: createOptionalFallback(safeProjectName, section)
          };
        } else {
          optionalPatch[section] = createOptionalFallback(safeProjectName, section);
        }
      });

      return {
        patch: optionalPatch,
        _diagnostics: {
          required: requiredDiagnostics,
          optional: optionalDiagnostics,
          optionalPending: []
        }
      };
    });

  const normalized = normalizeProjectDashboardPayload(basePayload);
  normalized._diagnostics = {
    required: requiredDiagnostics,
    optional: optionalDiagnostics,
    optionalPending: optionalLoaders.map((entry) => entry.section)
  };
  normalized._optionalReady = optionalReady;

  return normalized;
}

export async function fetchAssetCatalog() {
  return getJson(
    "/media-manager/asset-catalog",
    "Failed to load asset catalog"
  );
}

export async function fetchProjectInsights(projectName) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  return getJson(
    `/api/insights/${encodeURIComponent(projectName)}`,
    "Failed to load project insights"
  );
}

export async function fetchProjectLearning(projectName) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  return getJson(
    `/api/learning/${encodeURIComponent(projectName)}`,
    "Failed to load project learning"
  );
}

export async function fetchProjectOperations(projectName) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  return getJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/operations`,
    "Failed to load project operations",
    15000
  );
}

export async function saveProjectSetup(projectName, payload = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/setup`,
    "POST",
    payload,
    "Failed to save project setup"
  );
}

export async function refreshProjectLibrary(projectName) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/library/refresh`,
    "POST",
    {},
    "Failed to refresh project library"
  );
}

export async function runProjectWorkflow(projectName, workflowId, payload = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  if (!workflowId) {
    throw new Error("Missing workflow id");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/workflows/${encodeURIComponent(workflowId)}/run`,
    "POST",
    payload,
    "Failed to record workflow run"
  );
}

export async function runProjectAiWorkflow(projectName, workflowId, payload = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  if (!workflowId) {
    throw new Error("Missing workflow id");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/ai/workflows/${encodeURIComponent(workflowId)}/run`,
    "POST",
    payload,
    "Failed to execute AI workflow"
  );
}

export async function executeProjectAiCommand(projectName, payload = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/ai/command`,
    "POST",
    payload,
    "Failed to execute AI command"
  );
}

export async function createProjectTask(projectName, payload = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/tasks`,
    "POST",
    payload,
    "Failed to create project task"
  );
}

export async function listProjectTasks(projectName, limit) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  const suffix = limit ? `?limit=${encodeURIComponent(limit)}` : "";
  return getJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/tasks${suffix}`,
    "Failed to load project tasks"
  );
}

export async function createProjectApproval(projectName, payload = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/approvals`,
    "POST",
    payload,
    "Failed to create approval request"
  );
}

export async function listProjectApprovals(projectName, limit) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  const suffix = limit ? `?limit=${encodeURIComponent(limit)}` : "";
  return getJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/approvals${suffix}`,
    "Failed to load approvals"
  );
}

export async function decideProjectApproval(projectName, approvalId, payload = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  if (!approvalId) {
    throw new Error("Missing approval id");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/approvals/${encodeURIComponent(approvalId)}/decision`,
    "POST",
    payload,
    "Failed to update approval"
  );
}

export async function fetchProjectGovernance(projectName, params = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  const search = new URLSearchParams();
  if (params.timeline_limit) search.set("timeline_limit", String(params.timeline_limit));
  const suffix = search.toString() ? `?${search.toString()}` : "";

  return getJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/governance${suffix}`,
    "Failed to load governance summary"
  );
}

export async function fetchProjectGovernancePolicy(projectName) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  return getJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/governance/policy`,
    "Failed to load governance policy"
  );
}

export async function updateProjectGovernancePolicy(projectName, payload = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/governance/policy`,
    "POST",
    payload,
    "Failed to update governance policy"
  );
}

export async function saveProjectConnectorSource(projectName, sourceType, sourceValue) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  if (!sourceType) {
    throw new Error("Missing source type");
  }

  if (!sourceValue) {
    throw new Error("Missing source value");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/sources`,
    "POST",
    {
      source_type: sourceType,
      source_value: sourceValue
    },
    "Failed to save project connector"
  );
}

export async function removeProjectConnectorSource(projectName, sourceType) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  if (!sourceType) {
    throw new Error("Missing source type");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/sources/${encodeURIComponent(sourceType)}`,
    "DELETE",
    null,
    "Failed to remove project connector"
  );
}

export async function fetchProjectIntegrationControlCenter(projectName) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  return getJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/integrations/control-center`,
    "Failed to load integration control center"
  );
}

export async function connectProjectIntegration(projectName, integrationId, payload = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  if (!integrationId) {
    throw new Error("Missing integration id");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/integrations/${encodeURIComponent(integrationId)}/connect`,
    "POST",
    payload,
    "Failed to connect integration"
  );
}

export async function reconnectProjectIntegration(projectName, integrationId, payload = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  if (!integrationId) {
    throw new Error("Missing integration id");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/integrations/${encodeURIComponent(integrationId)}/reconnect`,
    "POST",
    payload,
    "Failed to reconnect integration"
  );
}

export async function testProjectIntegration(projectName, integrationId, payload = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  if (!integrationId) {
    throw new Error("Missing integration id");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/integrations/${encodeURIComponent(integrationId)}/test`,
    "POST",
    payload,
    "Failed to test integration"
  );
}

export async function syncProjectIntegration(projectName, integrationId, payload = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  if (!integrationId) {
    throw new Error("Missing integration id");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/integrations/${encodeURIComponent(integrationId)}/sync`,
    "POST",
    payload,
    "Failed to sync integration"
  );
}

export async function importProjectIntegrationHistory(projectName, integrationId, payload = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  if (!integrationId) {
    throw new Error("Missing integration id");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/integrations/${encodeURIComponent(integrationId)}/import-history`,
    "POST",
    payload,
    "Failed to import integration history"
  );
}

export async function disconnectProjectIntegration(projectName, integrationId, payload = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  if (!integrationId) {
    throw new Error("Missing integration id");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/integrations/${encodeURIComponent(integrationId)}/disconnect`,
    "POST",
    payload,
    "Failed to disconnect integration"
  );
}

export async function savePublishingSchedule(projectName, payload = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/schedule`,
    "POST",
    payload,
    "Failed to save publishing schedule"
  );
}

export async function reschedulePublishingItem(projectName, jobId, payload = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  if (!jobId) {
    throw new Error("Missing job id");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/${encodeURIComponent(jobId)}/reschedule`,
    "POST",
    payload,
    "Failed to reschedule publishing item"
  );
}

export async function approvePublishingItem(projectName, jobId, payload = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  if (!jobId) {
    throw new Error("Missing job id");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/${encodeURIComponent(jobId)}/ready`,
    "POST",
    payload,
    "Failed to approve publishing item"
  );
}

export async function publishPublishingItem(projectName, jobId, payload = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  if (!jobId) {
    throw new Error("Missing job id");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/${encodeURIComponent(jobId)}/publish`,
    "POST",
    payload,
    "Failed to publish item"
  );
}

export async function failPublishingItem(projectName, jobId, payload = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  if (!jobId) {
    throw new Error("Missing job id");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/publishing/${encodeURIComponent(jobId)}/fail`,
    "POST",
    payload,
    "Failed to mark publishing item as failed"
  );
}

export async function fetchProjectOperationsSchema(projectName) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  return getJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/operations/schema`,
    "Failed to load operations schema"
  );
}

export async function fetchProjectTaskCenter(projectName) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  return getJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/task-center`,
    "Failed to load task center"
  );
}

export async function fetchProjectQueueCenter(projectName) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  return getJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/queue-center`,
    "Failed to load queue center"
  );
}

export async function fetchProjectJobMonitor(projectName) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  return getJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/job-monitor`,
    "Failed to load job monitor"
  );
}

export async function fetchProjectNotificationCenter(projectName) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  return getJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/notification-center`,
    "Failed to load notification center"
  );
}

export async function fetchProjectTeam(projectName) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  return getJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/team`,
    "Failed to load project team model"
  );
}

export async function saveProjectTeam(projectName, payload = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/team`,
    "POST",
    payload,
    "Failed to update project team model"
  );
}

export async function listProjectCampaigns(projectName, limit) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  const suffix = limit ? `?limit=${encodeURIComponent(limit)}` : "";
  return getJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/campaigns${suffix}`,
    "Failed to load campaigns"
  );
}

export async function saveProjectCampaign(projectName, payload = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  if (payload?.id) {
    return sendJson(
      `/media-manager/project/${encodeURIComponent(projectName)}/campaigns/${encodeURIComponent(payload.id)}`,
      "PATCH",
      payload,
      "Failed to update campaign"
    );
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/campaigns`,
    "POST",
    payload,
    "Failed to create campaign"
  );
}

export async function listProjectContentItems(projectName, params = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  const search = new URLSearchParams();
  if (params.limit) search.set("limit", String(params.limit));
  if (params.campaign_id) search.set("campaign_id", String(params.campaign_id));
  const suffix = search.toString() ? `?${search.toString()}` : "";

  return getJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/content-items${suffix}`,
    "Failed to load content items"
  );
}

export async function saveProjectContentItem(projectName, payload = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  if (payload?.id) {
    return sendJson(
      `/media-manager/project/${encodeURIComponent(projectName)}/content-items/${encodeURIComponent(payload.id)}`,
      "PATCH",
      payload,
      "Failed to update content item"
    );
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/content-items`,
    "POST",
    payload,
    "Failed to create content item"
  );
}

export async function listProjectMediaJobs(projectName, params = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  const search = new URLSearchParams();
  if (params.limit) search.set("limit", String(params.limit));
  if (params.campaign_id) search.set("campaign_id", String(params.campaign_id));
  if (params.content_item_id) search.set("content_item_id", String(params.content_item_id));
  const suffix = search.toString() ? `?${search.toString()}` : "";

  return getJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/media-jobs${suffix}`,
    "Failed to load media jobs"
  );
}

export async function saveProjectMediaJob(projectName, payload = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  if (payload?.id) {
    return sendJson(
      `/media-manager/project/${encodeURIComponent(projectName)}/media-jobs/${encodeURIComponent(payload.id)}`,
      "PATCH",
      payload,
      "Failed to update media job"
    );
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/media-jobs`,
    "POST",
    payload,
    "Failed to create media job"
  );
}

export async function improveMediaPrompt(payload = {}) {
  return sendJson(
    "/api/media/improve-prompt",
    "POST",
    payload,
    "Failed to improve media prompt"
  );
}

export async function brandCheckMedia(payload = {}) {
  return sendJson(
    "/api/media/brand-check",
    "POST",
    payload,
    "Failed to run media brand check"
  );
}

export async function generateMediaImage(payload = {}) {
  return sendJson(
    "/api/media/generate-image",
    "POST",
    payload,
    "Failed to generate image"
  );
}

export async function generateMediaVideoBrief(payload = {}) {
  return sendJson(
    "/api/media/generate-video-brief",
    "POST",
    payload,
    "Failed to generate video brief"
  );
}

export async function generateMediaVoiceScript(payload = {}) {
  return sendJson(
    "/api/media/generate-voice-script",
    "POST",
    payload,
    "Failed to generate voice script"
  );
}

export async function generateMediaCampaignPack(payload = {}) {
  return sendJson(
    "/api/media/generate-campaign-pack",
    "POST",
    payload,
    "Failed to generate campaign pack"
  );
}

export async function listProjectHandoffs(projectName, params = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  const search = new URLSearchParams();
  if (params.limit) search.set("limit", String(params.limit));
  if (params.destination_page) search.set("destination_page", String(params.destination_page));
  if (params.source_page) search.set("source_page", String(params.source_page));
  if (params.status) search.set("status", String(params.status));
  const suffix = search.toString() ? `?${search.toString()}` : "";

  return getJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/handoffs${suffix}`,
    "Failed to load handoffs"
  );
}

export async function createProjectHandoff(projectName, payload = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/handoffs`,
    "POST",
    payload,
    "Failed to create handoff"
  );
}

export async function consumeProjectHandoff(projectName, handoffId, payload = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  if (!handoffId) {
    throw new Error("Missing handoff id");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/handoffs/${encodeURIComponent(handoffId)}/consume`,
    "POST",
    payload,
    "Failed to consume handoff"
  );
}

export async function listProjectEvents(projectName, limit) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  const suffix = limit ? `?limit=${encodeURIComponent(limit)}` : "";
  return getJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/events${suffix}`,
    "Failed to load event log"
  );
}

export async function markProjectNotification(projectName, notificationId, payload = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  if (!notificationId) {
    throw new Error("Missing notification id");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/notifications/${encodeURIComponent(notificationId)}`,
    "PATCH",
    payload,
    "Failed to update notification"
  );
}

export async function uploadProjectAsset(projectName, assetType, file) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  const normalizedAssetType = String(assetType || "").trim().toLowerCase();

  if (!normalizedAssetType) {
    throw new Error("Missing asset type");
  }

  if (!/^[a-z0-9][a-z0-9_-]{0,63}$/.test(normalizedAssetType)) {
    throw new Error("Invalid asset type");
  }

  if (!(file instanceof File)) {
    throw new Error("Missing file");
  }

  const formData = new FormData();
  formData.append("project", projectName);
  formData.append("type", normalizedAssetType);
  formData.append("file", file);

  return sendForm(
    "/media/upload",
    formData,
    "Failed to upload asset"
  );
}

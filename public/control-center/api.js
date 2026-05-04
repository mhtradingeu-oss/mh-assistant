// public/control-center/api.js

import {
  CONTROL_ACCESS_KEY_STORAGE_KEY,
  CONTROL_ACCESS_KEY_LEGACY_STORAGE_KEYS
} from "./constants.js";

let API_BASE_URL = "";
const DEFAULT_REQUEST_TIMEOUT_MS = 20000;
const DEFAULT_RESPONSE_TEXT_TIMEOUT_MS = 20000;
const DEFAULT_PARSE_TIMEOUT_MS = 2000;

export class AccessKeyError extends Error {
  constructor(message, diagnostics = {}) {
    super(String(message || "Project data requires a valid access key."));
    this.name = "AccessKeyError";
    this.code = "ACCESS_KEY_ERROR";
    this.status = diagnostics?.status || null;
    this.endpoint = String(diagnostics?.endpoint || "");
    this.payload = diagnostics?.payload ?? null;
    this.diagnostics = {
      keyPresent: Boolean(diagnostics?.keyPresent),
      keySource: String(diagnostics?.keySource || "none"),
      authHeaderPresent: Boolean(diagnostics?.authHeaderPresent),
      endpoint: this.endpoint,
      status: this.status,
      contentType: String(diagnostics?.contentType || "")
    };
  }
}

export class ProjectPayloadError extends Error {
  constructor(message, diagnostics = {}) {
    super(String(message || "Project response was received but could not be processed."));
    this.name = "ProjectPayloadError";
    this.code = "PROJECT_PAYLOAD_ERROR";
    this.status = diagnostics?.status || null;
    this.endpoint = String(diagnostics?.endpoint || "");
    this.payload = diagnostics?.payload ?? null;
    this.diagnostics = {
      keyPresent: Boolean(diagnostics?.keyPresent),
      keySource: String(diagnostics?.keySource || "none"),
      authHeaderPresent: Boolean(diagnostics?.authHeaderPresent),
      endpoint: this.endpoint,
      status: this.status,
      contentType: String(diagnostics?.contentType || ""),
      bodyLength: Number(diagnostics?.bodyLength || 0),
      parseStage: String(diagnostics?.parseStage || ""),
      responseSnippet: String(diagnostics?.responseSnippet || "")
    };
  }
}

export function setApiBaseUrl(value = "") {
  API_BASE_URL = value || "";
}

function buildUrl(path = "") {
  return `${API_BASE_URL}${path}`;
}

function persistCanonicalControlKey(key) {
  const normalized = String(key || "").trim();
  if (!normalized) return;

  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(CONTROL_ACCESS_KEY_STORAGE_KEY, normalized);
    }
  } catch (_) {
    // Ignore storage access errors in restricted contexts
  }
}

function readControlKeyMeta() {
  const empty = { key: "", source: "none" };

  try {
    if (typeof window !== "undefined") {
      const runtimeKeyCandidates = [
        { source: "window.__MH_CONTROL_CENTER_READ_KEY__", value: window.__MH_CONTROL_CENTER_READ_KEY__ },
        { source: "window.__MH_CONTROL_CENTER_WRITE_KEY__", value: window.__MH_CONTROL_CENTER_WRITE_KEY__ },
        { source: "window.__MH_CONTROL_WRITE_KEY__", value: window.__MH_CONTROL_WRITE_KEY__ },
        { source: "window.__MH_CONTROL_CENTER_ACCESS_KEY__", value: window.__MH_CONTROL_CENTER_ACCESS_KEY__ },
        { source: "window.__MH_CONTROL_ACCESS_KEY__", value: window.__MH_CONTROL_ACCESS_KEY__ },
        { source: "window.__MH_ACCESS_KEY__", value: window.__MH_ACCESS_KEY__ }
      ];

      for (const candidate of runtimeKeyCandidates) {
        const normalized = String(candidate.value || "").trim();
        if (normalized) {
          persistCanonicalControlKey(normalized);
          return { key: normalized, source: candidate.source };
        }
      }
    }

    if (typeof localStorage !== "undefined") {
      const canonical = String(localStorage.getItem(CONTROL_ACCESS_KEY_STORAGE_KEY) || "").trim();
      if (canonical) {
        return { key: canonical, source: `localStorage:${CONTROL_ACCESS_KEY_STORAGE_KEY}` };
      }

      for (const legacyKey of CONTROL_ACCESS_KEY_LEGACY_STORAGE_KEYS) {
        const legacyValue = String(localStorage.getItem(legacyKey) || "").trim();
        if (legacyValue) {
          persistCanonicalControlKey(legacyValue);
          return { key: legacyValue, source: `localStorage:${legacyKey}` };
        }
      }
    }
  } catch (_) {
    // Ignore storage access errors in restricted contexts
  }

  return empty;
}

function isMissingReadKeyErrorMessage(message) {
  return /missing\s+read\s+key/i.test(String(message || ""));
}

function isTopLevelErrorPayload(payload) {
  return Boolean(
    payload &&
    typeof payload === "object" &&
    !Array.isArray(payload) &&
    typeof payload.error === "string" &&
    payload.error.trim()
  );
}

function buildResponseDiagnostics(response, requestMeta = {}, payload = null) {
  const endpoint = String(response?.url || requestMeta?.endpoint || "");
  const status = Number.isFinite(response?.status) ? Number(response.status) : null;
  const contentType = String(response?.headers?.get?.("content-type") || "");
  const accessKeyBypass = String(response?.headers?.get?.("x-mh-control-key-bypass") || "").trim().toLowerCase() === "temporary";

  return {
    keyPresent: Boolean(requestMeta?.keyPresent),
    keySource: String(requestMeta?.keySource || "none"),
    authHeaderPresent: Boolean(requestMeta?.authHeaderPresent),
    accessKeyBypass,
    endpoint,
    status,
    contentType,
    payload,
    bodyLength: Number(requestMeta?.bodyLength || 0),
    parseStage: String(requestMeta?.parseStage || "")
  };
}

function emitApiRuntimeTrace(stage, details = {}) {
  if (typeof window === "undefined" || typeof window.dispatchEvent !== "function") {
    return;
  }

  try {
    window.dispatchEvent(new CustomEvent("mh:control-center-api-trace", {
      detail: {
        at: new Date().toISOString(),
        stage: String(stage || "api.trace"),
        endpoint: String(details.endpoint || ""),
        method: String(details.method || "GET"),
        status: Number.isFinite(details.status) ? Number(details.status) : null,
        contentType: String(details.contentType || ""),
        message: String(details.message || ""),
        bodyLength: Number(details.bodyLength || 0),
        durationMs: Number(details.durationMs || 0),
        timeoutMs: Number(details.timeoutMs || 0)
      }
    }));
  } catch (_) {}
}

function buildReadHeaders() {
  const headers = { Accept: "application/json" };
  const keyMeta = readControlKeyMeta();
  if (keyMeta.key) {
    headers["x-mh-control-key"] = keyMeta.key;
    headers.Authorization = `Bearer ${keyMeta.key}`;
  }
  return {
    headers,
    keyPresent: Boolean(keyMeta.key),
    keySource: keyMeta.source
  };
}

function buildWriteHeaders() {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json"
  };
  const keyMeta = readControlKeyMeta();
  if (keyMeta.key) {
    headers["x-mh-control-key"] = keyMeta.key;
    headers.Authorization = `Bearer ${keyMeta.key}`;
  }
  return {
    headers,
    keyPresent: Boolean(keyMeta.key),
    keySource: keyMeta.source
  };
}

async function readResponseText(response, requestMeta = {}) {
  const endpoint = String(response?.url || requestMeta?.endpoint || "");
  const timeoutMs = Math.max(1, Number(requestMeta?.responseTextTimeoutMs) || DEFAULT_RESPONSE_TEXT_TIMEOUT_MS);
  const startedAt = Date.now();
  let timer = null;

  emitApiRuntimeTrace("response.text.start", {
    endpoint,
    status: response?.status,
    contentType: response?.headers?.get?.("content-type") || "",
    timeoutMs
  });

  try {
    return await Promise.race([
      response.text(),
      new Promise((_, reject) => {
        timer = setTimeout(() => {
          const error = new Error(`Response body timed out after ${timeoutMs}ms.`);
          error.endpoint = endpoint;
          error.isTimeout = true;
          error.parseStage = "response.text";
          reject(error);
        }, timeoutMs);
      })
    ]);
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
    emitApiRuntimeTrace("response.text.done", {
      endpoint,
      status: response?.status,
      contentType: response?.headers?.get?.("content-type") || "",
      durationMs: Date.now() - startedAt
    });
  }
}

async function parseJson(response, fallbackMessage = "Request failed", requestMeta = {}) {
  let payload = null;
  let rawText = "";

  try {
    rawText = await readResponseText(response, requestMeta);
  } catch (error) {
    emitApiRuntimeTrace("response.text.error", {
      endpoint: response?.url || requestMeta?.endpoint || "",
      status: response?.status,
      contentType: response?.headers?.get?.("content-type") || "",
      message: error?.message || "Failed to read response body"
    });
    throw error;
  }

  const bodyLength = rawText.length;
  const trimmed = rawText.trim();

  if (trimmed) {
    const parseStartedAt = Date.now();
    const parseTimeoutMs = Math.max(1, Number(requestMeta?.parseTimeoutMs) || DEFAULT_PARSE_TIMEOUT_MS);

    emitApiRuntimeTrace("api.response.parse.start", {
      endpoint: response?.url || requestMeta?.endpoint || "",
      status: response?.status,
      contentType: response?.headers?.get?.("content-type") || "",
      bodyLength,
      timeoutMs: parseTimeoutMs
    });

    let parseTimer = null;
    const parseOutcome = await Promise.race([
      Promise.resolve()
        .then(() => JSON.parse(rawText))
        .then((value) => ({ type: "done", value }))
        .catch((error) => ({ type: "error", error })),
      new Promise((resolve) => {
        parseTimer = setTimeout(() => {
          resolve({ type: "timeout" });
        }, parseTimeoutMs);
      })
    ]);

    if (parseTimer) {
      clearTimeout(parseTimer);
    }

    if (parseOutcome?.type === "timeout") {
      emitApiRuntimeTrace("api.response.parse.timeout", {
        endpoint: response?.url || requestMeta?.endpoint || "",
        status: response?.status,
        contentType: response?.headers?.get?.("content-type") || "",
        bodyLength,
        durationMs: Date.now() - parseStartedAt,
        timeoutMs: parseTimeoutMs,
        message: "Parse watchdog timed out"
      });

      throw new ProjectPayloadError("Project response was received but could not be processed.", {
        keyPresent: Boolean(requestMeta?.keyPresent),
        keySource: String(requestMeta?.keySource || "none"),
        authHeaderPresent: Boolean(requestMeta?.authHeaderPresent),
        endpoint: String(response?.url || requestMeta?.endpoint || ""),
        status: Number.isFinite(response?.status) ? Number(response.status) : null,
        contentType: String(response?.headers?.get?.("content-type") || ""),
        bodyLength,
        parseStage: "api.response.parse.timeout",
        responseSnippet: trimmed.slice(0, 240)
      });
    }

    if (parseOutcome?.type === "error") {
      const parseFailure = parseOutcome.error;
      emitApiRuntimeTrace("api.response.parse.error", {
        endpoint: response?.url || requestMeta?.endpoint || "",
        status: response?.status,
        contentType: response?.headers?.get?.("content-type") || "",
        bodyLength,
        durationMs: Date.now() - parseStartedAt,
        message: parseFailure?.message || "Invalid JSON payload"
      });

      throw new ProjectPayloadError("Project response was received but could not be processed.", {
        keyPresent: Boolean(requestMeta?.keyPresent),
        keySource: String(requestMeta?.keySource || "none"),
        authHeaderPresent: Boolean(requestMeta?.authHeaderPresent),
        endpoint: String(response?.url || requestMeta?.endpoint || ""),
        status: Number.isFinite(response?.status) ? Number(response.status) : null,
        contentType: String(response?.headers?.get?.("content-type") || ""),
        bodyLength,
        parseStage: "api.response.parse.error",
        responseSnippet: trimmed.slice(0, 240)
      });
    }

    payload = parseOutcome?.value;
    emitApiRuntimeTrace("api.response.parse.done", {
      endpoint: response?.url || requestMeta?.endpoint || "",
      status: response?.status,
      contentType: response?.headers?.get?.("content-type") || "",
      bodyLength,
      durationMs: Date.now() - parseStartedAt
    });
  }

  const diagnostics = buildResponseDiagnostics(response, {
    ...requestMeta,
    bodyLength,
    parseStage: trimmed ? "api.response.parse" : "response.empty"
  }, payload);

  if (!response.ok) {
    const message =
      payload?.error ||
      payload?.message ||
      `${fallbackMessage} (${response.status})`;

    if (isMissingReadKeyErrorMessage(message)) {
      throw new AccessKeyError(message, diagnostics);
    }

    const error = new Error(message);
    error.status = diagnostics.status;
    error.payload = payload;
    error.endpoint = diagnostics.endpoint;
    error.diagnostics = {
      keyPresent: diagnostics.keyPresent,
      keySource: diagnostics.keySource,
      authHeaderPresent: diagnostics.authHeaderPresent,
      endpoint: diagnostics.endpoint,
      status: diagnostics.status,
      contentType: diagnostics.contentType,
      bodyLength: diagnostics.bodyLength,
      parseStage: diagnostics.parseStage
    };
    throw error;
  }

  if (isTopLevelErrorPayload(payload)) {
    const message = String(payload.error || fallbackMessage);

    if (isMissingReadKeyErrorMessage(message)) {
      throw new AccessKeyError(message, diagnostics);
    }

    const error = new Error(message);
    error.status = diagnostics.status;
    error.payload = payload;
    error.endpoint = diagnostics.endpoint;
    error.diagnostics = {
      keyPresent: diagnostics.keyPresent,
      keySource: diagnostics.keySource,
      authHeaderPresent: diagnostics.authHeaderPresent,
      endpoint: diagnostics.endpoint,
      status: diagnostics.status,
      contentType: diagnostics.contentType,
      bodyLength: diagnostics.bodyLength,
      parseStage: diagnostics.parseStage
    };
    throw error;
  }

  if (payload && typeof payload === "object") {
    Object.defineProperty(payload, "__mhRequestDiagnostics", {
      value: {
        keyPresent: diagnostics.keyPresent,
        keySource: diagnostics.keySource,
        authHeaderPresent: diagnostics.authHeaderPresent,
        accessKeyBypass: Boolean(diagnostics.accessKeyBypass),
        endpoint: diagnostics.endpoint,
        status: diagnostics.status,
        contentType: diagnostics.contentType
      },
      configurable: true,
      enumerable: false,
      writable: true
    });
  }

  return payload;
}

async function fetchWithTimeout(path, init = {}, timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS) {
  const controller = typeof AbortController === "function" ? new AbortController() : null;
  const timer = controller
    ? setTimeout(() => controller.abort(), Math.max(1, Number(timeoutMs) || DEFAULT_REQUEST_TIMEOUT_MS))
    : null;
  const method = String(init?.method || "GET").toUpperCase();

  emitApiRuntimeTrace("request.start", {
    endpoint: buildUrl(path),
    method,
    timeoutMs
  });

  try {
    const response = await fetch(buildUrl(path), {
      ...init,
      signal: controller ? controller.signal : init.signal
    });
    emitApiRuntimeTrace("request.response", {
      endpoint: response?.url || buildUrl(path),
      method,
      status: response?.status,
      contentType: response?.headers?.get?.("content-type") || ""
    });
    return response;
  } catch (error) {
    if (error?.name === "AbortError") {
      const timeoutError = new Error(`Request timed out after ${timeoutMs}ms: ${path}`);
      timeoutError.endpoint = path;
      timeoutError.isTimeout = true;
      timeoutError.parseStage = "request";
      emitApiRuntimeTrace("request.timeout", {
        endpoint: buildUrl(path),
        method,
        timeoutMs,
        message: timeoutError.message
      });
      throw timeoutError;
    }

    if (error && typeof error === "object" && !error.endpoint) {
      error.endpoint = path;
    }
    emitApiRuntimeTrace("request.error", {
      endpoint: buildUrl(path),
      method,
      message: error?.message || "Request failed"
    });
    throw error;
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
}

async function getJson(path, fallbackMessage, timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS) {
  const { headers, keyPresent, keySource } = buildReadHeaders();
  const response = await fetchWithTimeout(path, {
    method: "GET",
    headers
  }, timeoutMs);

  return parseJson(response, fallbackMessage, {
    endpoint: buildUrl(path),
    keyPresent,
    keySource,
    authHeaderPresent: Boolean(headers.Authorization || headers.authorization),
    responseTextTimeoutMs: timeoutMs
  });
}

async function sendJson(path, method, body, fallbackMessage, timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS) {
  const { headers, keyPresent, keySource } = buildWriteHeaders();
  const response = await fetchWithTimeout(path, {
    method,
    headers,
    body: body == null ? undefined : JSON.stringify(body)
  }, timeoutMs);

  return parseJson(response, fallbackMessage, {
    endpoint: buildUrl(path),
    keyPresent,
    keySource,
    authHeaderPresent: Boolean(headers.Authorization || headers.authorization),
    responseTextTimeoutMs: timeoutMs
  });
}

async function sendForm(path, formData, fallbackMessage, timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS) {
  const headers = {};
  const keyMeta = readControlKeyMeta();
  if (keyMeta.key) {
    headers["x-mh-control-key"] = keyMeta.key;
    headers.Authorization = `Bearer ${keyMeta.key}`;
  }

  const response = await fetchWithTimeout(path, {
    method: "POST",
    headers,
    body: formData
  }, timeoutMs);

  return parseJson(response, fallbackMessage, {
    endpoint: buildUrl(path),
    keyPresent: Boolean(headers["x-mh-control-key"]),
    keySource: keyMeta.source,
    authHeaderPresent: Boolean(headers.Authorization || headers.authorization)
  });
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
  const status = error?.status || null;
  const isOptionalNotFound = !required && status === 404 && (section === "insights" || section === "learning");
  const requestDiagnostics = error?.diagnostics || {};

  return {
    section,
    required: Boolean(required),
    warning: Boolean(isOptionalNotFound),
    message: isOptionalNotFound
      ? `Optional ${section} endpoint returned 404 and was skipped.`
      : String(error?.message || error || "Unknown error"),
    endpoint: String(error?.endpoint || ""),
    status,
    timeout: Boolean(error?.isTimeout),
    keyPresent: Boolean(requestDiagnostics?.keyPresent),
    keySource: String(requestDiagnostics?.keySource || "none"),
    authHeaderPresent: Boolean(requestDiagnostics?.authHeaderPresent),
    accessKeyBypass: Boolean(requestDiagnostics?.accessKeyBypass)
  };
}

function extractRequestAuthDiagnostics(payload = null) {
  const diagnostics = payload?.__mhRequestDiagnostics || {};
  return {
    keyPresent: Boolean(diagnostics?.keyPresent),
    keySource: String(diagnostics?.keySource || "none"),
    authHeaderPresent: Boolean(diagnostics?.authHeaderPresent),
    accessKeyBypass: Boolean(diagnostics?.accessKeyBypass),
    endpoint: String(diagnostics?.endpoint || "")
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

  let requestAuthDiagnostics = {
    keyPresent: false,
    keySource: "none",
    authHeaderPresent: false,
    accessKeyBypass: false,
    endpoint: `/media-manager/project/${encodedProjectName}`
  };

  requiredDashboardPromise
    .then((payload) => {
      requestAuthDiagnostics = extractRequestAuthDiagnostics(payload);
    })
    .catch(() => {});

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
    const authProbe = requiredDiagnostics.find((item) => item.keyPresent || item.authHeaderPresent || item.keySource !== "none") || null;
    error.diagnostics = {
      keyPresent: Boolean(authProbe?.keyPresent),
      keySource: String(authProbe?.keySource || "none"),
      authHeaderPresent: Boolean(authProbe?.authHeaderPresent),
      accessKeyBypass: Boolean(authProbe?.accessKeyBypass),
      endpoint: String(authProbe?.endpoint || `/media-manager/project/${encodedProjectName}`)
    };
    error._diagnostics = {
      required: requiredDiagnostics,
      optional: optionalDiagnostics,
      requestAuth: requestAuthDiagnostics,
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
          requestAuth: requestAuthDiagnostics,
          optionalPending: []
        }
      };
    });

  const normalized = normalizeProjectDashboardPayload(basePayload);
  normalized._requiredSummary = {
    project: safeProjectName,
    requiredSections,
    optionalSections: optionalLoaders.map((entry) => entry.section),
    fetchedAt: new Date().toISOString()
  };
  normalized._diagnostics = {
    required: requiredDiagnostics,
    optional: optionalDiagnostics,
    requestAuth: requestAuthDiagnostics,
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

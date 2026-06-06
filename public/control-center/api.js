// public/control-center/api.js

import {
  CONTROL_ACCESS_KEY_STORAGE_KEY,
  CONTROL_ACCESS_KEY_LEGACY_STORAGE_KEYS
} from "./constants.js";

let API_BASE_URL = "";
const DEFAULT_REQUEST_TIMEOUT_MS = 20000;
const AI_GUIDANCE_REQUEST_TIMEOUT_MS = 90000;
const DEFAULT_RESPONSE_TEXT_TIMEOUT_MS = 20000;
const DEFAULT_PARSE_TIMEOUT_MS = 2000;
const REQUIRED_PROJECT_RESPONSE_TEXT_TIMEOUT_MS = 3000;

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

export function getControlCenterAccessKeyMeta() {
  const keyMeta = readControlKeyMeta();
  return {
    key: String(keyMeta?.key || ""),
    source: String(keyMeta?.source || "none")
  };
}

function isMissingReadKeyErrorMessage(message) {
  return /missing\s+read\s+key/i.test(String(message || ""));
}

function isAccessKeyRelatedMessage(message) {
  const normalized = String(message || "").toLowerCase();
  if (!normalized) {
    return false;
  }

  return /missing\s+(?:protected\s+write\s+key|read\s+key|control\s+center\s+access\s+key)/i.test(normalized)
    || /invalid\s+(?:protected\s+write\s+key|read\s+key|access\s+key)/i.test(normalized)
    || /access\s+key/i.test(normalized)
    || /write\s+key/i.test(normalized)
    || /read\s+key/i.test(normalized);
}

export function isAccessKeyFailure(error) {
  if (!error) {
    return false;
  }

  if (error instanceof AccessKeyError) {
    return true;
  }

  const status = Number(error?.status ?? error?.diagnostics?.status ?? error?.payload?.status ?? NaN);
  const message = String(
    error?.message
      || error?.payload?.error
      || error?.payload?.message
      || ""
  );

  if ((status === 401 || status === 403) && isAccessKeyRelatedMessage(message)) {
    return true;
  }

  return isAccessKeyRelatedMessage(message);
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
  const accessKeyBypass = String(response?.headers?.get?.("x-mh-control-key-bypass") || "")
    .trim()
    .toLowerCase() === "temporary";

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

export function isDebugStartupMode() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return new URLSearchParams(window.location.search).get("debugStartup") === "1";
  } catch (_) {
    return false;
  }
}

function shouldEmitApiRuntimeTrace(stage) {
  const normalized = String(stage || "");

  // Keep watchdog-critical and error traces in normal mode.
  // Verbose request traces are emitted only when ?debugStartup=1.
  if (
    normalized === "response.text.start" ||
    normalized === "response.text.done" ||
    normalized === "response.text.error" ||
    normalized === "api.response.text.start" ||
    normalized === "api.response.text.done" ||
    normalized === "api.response.text.timeout" ||
    normalized === "api.response.parse.start" ||
    normalized === "api.response.parse.done" ||
    normalized === "api.response.parse.error" ||
    normalized === "api.response.json.fallback.done" ||
    normalized === "api.response.json.fallback.error" ||
    normalized === "api.response.json.fallback.timeout" ||
    normalized === "request.timeout" ||
    normalized === "request.error"
  ) {
    return true;
  }

  return isDebugStartupMode();
}

function emitApiRuntimeTrace(stage, details = {}) {
  if (!shouldEmitApiRuntimeTrace(stage)) {
    return;
  }

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
  const responseClone = typeof response?.clone === "function" ? response.clone() : null;

  emitApiRuntimeTrace("response.text.start", {
    endpoint,
    status: response?.status,
    contentType: response?.headers?.get?.("content-type") || "",
    timeoutMs
  });

  try {
    const rawText = await Promise.race([
      response.text(),
      new Promise((_, reject) => {
        timer = setTimeout(() => {
          const error = new Error(`Response body timed out after ${timeoutMs}ms.`);
          error.endpoint = endpoint;
          error.isTimeout = true;
          error.parseStage = "response.text.timeout";
          reject(error);
        }, timeoutMs);
      })
    ]);

    emitApiRuntimeTrace("response.text.done", {
      endpoint,
      status: response?.status,
      contentType: response?.headers?.get?.("content-type") || "",
      durationMs: Date.now() - startedAt,
      bodyLength: String(rawText || "").length
    });

    return {
      mode: "text",
      rawText: String(rawText || ""),
      bodyLength: String(rawText || "").length,
      parseStage: "response.text.done"
    };
  } catch (error) {
    const isTimeout = Boolean(error?.isTimeout);

    if (isTimeout) {
      emitApiRuntimeTrace("api.response.text.timeout", {
        endpoint,
        status: response?.status,
        contentType: response?.headers?.get?.("content-type") || "",
        timeoutMs,
        durationMs: Date.now() - startedAt,
        message: error?.message || "Response body read timed out"
      });

      if (responseClone) {
        try {
          let fallbackTimer = null;
          const fallbackPayload = await Promise.race([
            responseClone.json(),
            new Promise((_, reject) => {
              fallbackTimer = setTimeout(() => {
                const fallbackTimeoutError = new Error(`JSON fallback timed out after ${timeoutMs}ms.`);
                fallbackTimeoutError.endpoint = endpoint;
                fallbackTimeoutError.isTimeout = true;
                fallbackTimeoutError.parseStage = "api.response.json.fallback.timeout";
                reject(fallbackTimeoutError);
              }, timeoutMs);
            })
          ]).finally(() => {
            if (fallbackTimer) {
              clearTimeout(fallbackTimer);
            }
          });

          const fallbackBodyLength = JSON.stringify(fallbackPayload || null).length;

          emitApiRuntimeTrace("api.response.json.fallback.done", {
            endpoint,
            status: response?.status,
            contentType: response?.headers?.get?.("content-type") || "",
            bodyLength: fallbackBodyLength,
            durationMs: Date.now() - startedAt
          });

          return {
            mode: "json-fallback",
            payload: fallbackPayload,
            bodyLength: fallbackBodyLength,
            parseStage: "api.response.json.fallback.done"
          };
        } catch (fallbackError) {
          const fallbackParseStage = fallbackError?.isTimeout
            ? "api.response.json.fallback.timeout"
            : "api.response.json.fallback.error";

          emitApiRuntimeTrace("api.response.json.fallback.error", {
            endpoint,
            status: response?.status,
            contentType: response?.headers?.get?.("content-type") || "",
            durationMs: Date.now() - startedAt,
            message: fallbackError?.message || "JSON fallback failed"
          });

          throw new ProjectPayloadError("Project response was received but could not be processed.", {
            keyPresent: Boolean(requestMeta?.keyPresent),
            keySource: String(requestMeta?.keySource || "none"),
            authHeaderPresent: Boolean(requestMeta?.authHeaderPresent),
            endpoint,
            status: Number.isFinite(response?.status) ? Number(response.status) : null,
            contentType: String(response?.headers?.get?.("content-type") || ""),
            bodyLength: 0,
            parseStage: fallbackParseStage,
            responseSnippet: ""
          });
        }
      }

      throw new ProjectPayloadError("Project response was received but could not be processed.", {
        keyPresent: Boolean(requestMeta?.keyPresent),
        keySource: String(requestMeta?.keySource || "none"),
        authHeaderPresent: Boolean(requestMeta?.authHeaderPresent),
        endpoint,
        status: Number.isFinite(response?.status) ? Number(response.status) : null,
        contentType: String(response?.headers?.get?.("content-type") || ""),
        bodyLength: 0,
        parseStage: "api.response.text.timeout",
        responseSnippet: ""
      });
    }

    emitApiRuntimeTrace("response.text.error", {
      endpoint,
      status: response?.status,
      contentType: response?.headers?.get?.("content-type") || "",
      durationMs: Date.now() - startedAt,
      message: error?.message || "Failed to read response body"
    });

    throw error;
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
}

function nextFrame() {
  return new Promise((resolve) => {
    if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(() => resolve());
      return;
    }

    setTimeout(resolve, 0);
  });
}

async function parseJsonTextSafely(rawText, response, requestMeta = {}, bodyLength = 0) {
  const endpoint = response?.url || requestMeta?.endpoint || "";
  const parseStartedAt = Date.now();
  const parseTimeoutMs = Math.max(1, Number(requestMeta?.parseTimeoutMs) || DEFAULT_PARSE_TIMEOUT_MS);

  emitApiRuntimeTrace("api.response.parse.start", {
    endpoint,
    status: response?.status,
    contentType: response?.headers?.get?.("content-type") || "",
    bodyLength,
    timeoutMs: parseTimeoutMs
  });

  // Give the browser one frame before heavy synchronous JSON parsing.
  // This helps the startup UI/watchdogs update before parsing large payloads.
  if (bodyLength > 250000) {
    await nextFrame();
  }

  try {
    const payload = JSON.parse(rawText);

    emitApiRuntimeTrace("api.response.parse.done", {
      endpoint,
      status: response?.status,
      contentType: response?.headers?.get?.("content-type") || "",
      bodyLength,
      durationMs: Date.now() - parseStartedAt
    });

    return payload;
  } catch (parseFailure) {
    emitApiRuntimeTrace("api.response.parse.error", {
      endpoint,
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
      endpoint: String(endpoint || ""),
      status: Number.isFinite(response?.status) ? Number(response.status) : null,
      contentType: String(response?.headers?.get?.("content-type") || ""),
      bodyLength,
      parseStage: "api.response.parse.error",
      responseSnippet: String(rawText || "").trim().slice(0, 240)
    });
  }
}

async function parseJson(response, fallbackMessage = "Request failed", requestMeta = {}) {
  let payload = null;
  let rawText = "";
  let parseStage = "response.empty";

  const bodyReadResult = await readResponseText(response, requestMeta);

  if (bodyReadResult?.mode === "json-fallback") {
    payload = bodyReadResult.payload;
    parseStage = String(bodyReadResult.parseStage || "api.response.json.fallback.done");
  } else {
    rawText = String(bodyReadResult?.rawText || "");
  }

  const bodyLength = Number(bodyReadResult?.bodyLength || rawText.length || 0);
  const trimmed = rawText.trim();

  if (trimmed && !payload) {
    try {
      payload = await parseJsonTextSafely(rawText, response, requestMeta, bodyLength);
      parseStage = "api.response.parse.done";
    } catch (parseFailure) {
      parseStage = "api.response.parse.error";
      throw parseFailure;
    }
  }

  const diagnostics = buildResponseDiagnostics(response, {
    ...requestMeta,
    bodyLength,
    parseStage
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
  const normalizedTimeoutMs = Math.max(1, Number(timeoutMs) || DEFAULT_REQUEST_TIMEOUT_MS);
  const controller = typeof AbortController === "function" ? new AbortController() : null;

  const createTimeoutError = () => {
    const timeoutError = new Error(`Request timed out after ${normalizedTimeoutMs}ms: ${path}`);
    timeoutError.endpoint = path;
    timeoutError.isTimeout = true;
    timeoutError.parseStage = "request";
    return timeoutError;
  };

  let timer = null;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => {
      if (controller) {
        try {
          controller.abort();
        } catch (_) {}
      }

      const timeoutError = createTimeoutError();

      emitApiRuntimeTrace("request.timeout", {
        endpoint: buildUrl(path),
        method: String(init?.method || "GET").toUpperCase(),
        timeoutMs: normalizedTimeoutMs,
        message: timeoutError.message
      });

      reject(timeoutError);
    }, normalizedTimeoutMs);
  });

  const method = String(init?.method || "GET").toUpperCase();

  emitApiRuntimeTrace("request.start", {
    endpoint: buildUrl(path),
    method,
    timeoutMs: normalizedTimeoutMs
  });

  try {
    const requestPromise = fetch(buildUrl(path), {
      ...init,
      signal: controller ? controller.signal : init.signal
    });

    const response = await Promise.race([requestPromise, timeoutPromise]);

    emitApiRuntimeTrace("request.response", {
      endpoint: response?.url || buildUrl(path),
      method,
      status: response?.status,
      contentType: response?.headers?.get?.("content-type") || ""
    });

    return response;
  } catch (error) {
    if (error?.isTimeout) {
      throw error;
    }

    if (error?.name === "AbortError") {
      throw createTimeoutError();
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

async function getJson(path, fallbackMessage, timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS, requestOptions = {}) {
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
    responseTextTimeoutMs: Number(requestOptions?.responseTextTimeoutMs) || timeoutMs,
    parseTimeoutMs: Number(requestOptions?.parseTimeoutMs) || DEFAULT_PARSE_TIMEOUT_MS
  });
}


async function sendRawJson(path, method, body, fallbackMessage, timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS) {
  const { headers } = buildWriteHeaders();
  const response = await fetchWithTimeout(path, {
    method,
    headers,
    body: body == null ? undefined : JSON.stringify(body)
  }, timeoutMs);

  const rawText = await response.text();
  let payload = null;

  if (rawText) {
    try {
      payload = JSON.parse(rawText);
    } catch (error) {
      const parseError = new Error(fallbackMessage || "Response was not valid JSON.");
      parseError.status = response.status;
      parseError.payload = {
        status: response.ok ? "failed" : "error",
        error: "Response was not valid JSON.",
        raw: rawText.slice(0, 500)
      };
      throw parseError;
    }
  } else {
    payload = {};
  }

  if (!response.ok) {
    const message = String(payload?.error || payload?.message || fallbackMessage || "Request failed").trim();
    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
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
    responseTextTimeoutMs: timeoutMs,
    parseTimeoutMs: DEFAULT_PARSE_TIMEOUT_MS
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
    authHeaderPresent: Boolean(headers.Authorization || headers.authorization),
    responseTextTimeoutMs: timeoutMs,
    parseTimeoutMs: DEFAULT_PARSE_TIMEOUT_MS
  });
}

export async function fetchProtectedMediaBlob(path, timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS) {
  const normalizedPath = String(path || "").trim();
  if (!normalizedPath) {
    throw new Error("Missing file URL.");
  }

  const { headers, keyPresent, keySource } = buildReadHeaders();
  if (!keyPresent) {
    throw new AccessKeyError("Missing Control Center access key.", {
      keyPresent,
      keySource,
      endpoint: buildUrl(normalizedPath)
    });
  }

  const response = await fetchWithTimeout(normalizedPath, {
    method: "GET",
    headers
  }, timeoutMs);

  if (!response.ok) {
    const rawText = await response.text().catch(() => "");
    let payload = null;

    try {
      payload = rawText ? JSON.parse(rawText) : null;
    } catch (_) {
      payload = null;
    }

    const message = String(payload?.error || rawText || `Failed to load protected file (${response.status}).`).trim();
    const lowerMessage = message.toLowerCase();

    if (response.status === 401 || response.status === 403 || /read key|access key|invalid.*key/.test(lowerMessage)) {
      throw new AccessKeyError(message, {
        status: response.status,
        endpoint: buildUrl(normalizedPath),
        payload,
        keyPresent,
        keySource,
        authHeaderPresent: Boolean(headers.Authorization || headers.authorization),
        contentType: String(response.headers.get("content-type") || "")
      });
    }

    throw new Error(message);
  }

  return {
    blob: await response.blob(),
    contentType: String(response.headers.get("content-type") || "")
  };
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
    parseStage: String(error?.diagnostics?.parseStage || error?.parseStage || ""),
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


export async function createMediaManagerProject(payload = {}) {
  const response = await fetch("/media-manager/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(typeof getRuntimeControlHeaders === "function" ? getRuntimeControlHeaders() : {})
    },
    body: JSON.stringify(payload)
  });

  let data = {};
  try {
    data = await response.json();
  } catch (_) {}

  if (!response.ok) {
    const message = data?.details || data?.error || `Failed to create project (${response.status})`;
    throw new Error(message);
  }

  return data;
}


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
    `/media-manager/project/${encodedProjectName}/startup`,
    "Failed to load project startup dashboard",
    12000,
    {
      responseTextTimeoutMs: REQUIRED_PROJECT_RESPONSE_TEXT_TIMEOUT_MS
    }
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
    const hasResponseTextTimeout = requiredDiagnostics.some((entry) =>
      String(entry?.parseStage || "").includes("response.text.timeout")
    );
    let requiredProjectFallback = null;

    if (hasResponseTextTimeout) {
      try {
        const fallbackProjects = await fetchProjects();
        const fallbackItems = Array.isArray(fallbackProjects?.items) ? fallbackProjects.items : [];
        const projectExists = fallbackItems.some((item) => {
          const name = typeof item === "string" ? item : item?.name;
          return String(name || "").trim() === safeProjectName;
        });

        requiredProjectFallback = {
          endpoint: "/media-manager/projects",
          verified: true,
          projectExists,
          projectName: safeProjectName,
          warning: projectExists ? "Project details are still syncing." : "Project not found in projects index."
        };
      } catch (fallbackError) {
        requiredProjectFallback = {
          endpoint: "/media-manager/projects",
          verified: false,
          projectExists: false,
          projectName: safeProjectName,
          warning: "Project details are still syncing.",
          message: String(fallbackError?.message || "Failed to verify project fallback")
        };
      }
    }

    const message = requiredDiagnostics
      .map((item) => `${item.section}: ${item.message}`)
      .join("; ");
    const error = new Error(`Required project data failed: ${message}`);
    error.endpoint = `/media-manager/project/${encodedProjectName}`;
    const authProbe = requiredDiagnostics.find((item) =>
      item.keyPresent || item.authHeaderPresent || item.keySource !== "none"
    ) || null;

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
      requiredProjectFallback,
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
    error._requiredProjectFallback = requiredProjectFallback;
    error.isResponseTextTimeout = hasResponseTextTimeout;
    throw error;
  }

  const requiredDashboardPayload = await requiredDashboardPromise;

  const basePayload = {
    project: requiredDashboardPayload?.project || safeProjectName,
    capabilities: requiredDashboardPayload?.capabilities || {},
    overview: requiredData.overview,
    readiness: requiredData.readiness,
    assets: requiredData.assets,
    tree: requiredDashboardPayload?.tree || createOptionalFallback(safeProjectName, "tree"),
    registry: requiredDashboardPayload?.registry || createOptionalFallback(safeProjectName, "registry"),
    connectors: requiredDashboardPayload?.connectors || createOptionalFallback(safeProjectName, "connectors"),
    activity: createOptionalFallback(safeProjectName, "activity"),
    operations: createOptionalFallback(safeProjectName, "operations"),
    errors: requiredDashboardPayload?.errors || {}
  };

  const optionalLoaders = [
    {
      section: "activity",
      load: (dashboardPromise) => dashboardPromise.then((payload) => extractDashboardSection(payload, "activity"))
    },
    {
      section: "tree",
      load: (dashboardPromise) => dashboardPromise.then((payload) => extractDashboardSection(payload, "tree"))
    },
    {
      section: "registry",
      load: (dashboardPromise) => dashboardPromise.then((payload) => extractDashboardSection(payload, "registry"))
    },
    {
      section: "connectors",
      load: (dashboardPromise) => dashboardPromise.then((payload) => extractDashboardSection(payload, "connectors"))
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

const optionalReady = () => {
  const optionalPatch = {
    activity: requiredDashboardPayload?.activity || createOptionalFallback(safeProjectName, "activity"),
    tree: requiredDashboardPayload?.tree || createOptionalFallback(safeProjectName, "tree"),
    registry: requiredDashboardPayload?.registry || createOptionalFallback(safeProjectName, "registry"),
    connectors: requiredDashboardPayload?.connectors || createOptionalFallback(safeProjectName, "connectors"),
    operations: createOptionalFallback(safeProjectName, "operations")
  };

  const lightweightOptionalLoaders = [
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

  return new Promise((resolve) => {
    setTimeout(resolve, 750);
  })
    .then(() => Promise.allSettled(lightweightOptionalLoaders.map((entry) => entry.load())))
    .then((results) => {
      results.forEach((result, index) => {
        const section = lightweightOptionalLoaders[index].section;

        if (result.status === "fulfilled") {
          if (section === "insights" || section === "learning") {
            optionalPatch.activity = {
              ...(optionalPatch.activity || createOptionalFallback(safeProjectName, "activity")),
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
            ...(optionalPatch.activity || createOptionalFallback(safeProjectName, "activity")),
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
};

  const normalized = normalizeProjectDashboardPayload(basePayload);
  normalized.project = normalized.project || safeProjectName;
  normalized.capabilities = normalized.capabilities || basePayload.capabilities || {};
  normalized.connectors = normalized.connectors || basePayload.connectors || {};
  normalized.errors = normalized.errors || basePayload.errors || {};
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
  normalized._optionalReady = Promise.resolve().then(optionalReady);

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


export async function applyProjectBusinessTemplate(projectName, projectType) {
  const safeProjectName = toProjectName(projectName);
  const encodedProjectName = encodeURIComponent(safeProjectName);

  const response = await fetch(`/media-manager/project/${encodedProjectName}/apply-template`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(typeof getRuntimeControlHeaders === "function" ? getRuntimeControlHeaders() : {})
    },
    body: JSON.stringify({
      project_type: projectType
    })
  });

  let data = {};
  try {
    data = await response.json();
  } catch (_) {}

  if (!response.ok) {
    const message = data?.details || data?.error || `Failed to apply project template (${response.status})`;
    throw new Error(message);
  }

  return data;
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

export async function updateProjectAssetStatus(projectName, assetId, status, note = "") {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  if (!assetId) {
    throw new Error("Missing asset id");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/assets/${encodeURIComponent(assetId)}/status`,
    "POST",
    {
      status: String(status || "").trim().toLowerCase(),
      note: String(note || "").trim()
    },
    "Failed to update asset status"
  );
}

export async function renameProjectAsset(projectName, assetId, name) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  if (!assetId) {
    throw new Error("Missing asset id");
  }

  const normalizedName = String(name || "").trim();
  if (!normalizedName) {
    throw new Error("Missing asset name");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/assets/${encodeURIComponent(assetId)}/rename`,
    "POST",
    { name: normalizedName },
    "Failed to rename asset"
  );
}

export async function setProjectAssetSourceOfTruth(projectName, assetId, sourceOfTruth) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  if (!assetId) {
    throw new Error("Missing asset id");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/assets/${encodeURIComponent(assetId)}/source-of-truth`,
    "POST",
    { source_of_truth: Boolean(sourceOfTruth) },
    "Failed to update source of truth"
  );
}

export async function archiveProjectAsset(projectName, assetId, note = "") {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  if (!assetId) {
    throw new Error("Missing asset id");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/assets/${encodeURIComponent(assetId)}/archive`,
    "POST",
    { note: String(note || "").trim() },
    "Failed to archive asset"
  );
}

export async function deleteProjectAsset(projectName, assetId, note = "") {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  if (!assetId) {
    throw new Error("Missing asset id");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/assets/${encodeURIComponent(assetId)}/delete`,
    "POST",
    { note: String(note || "").trim() },
    "Failed to delete asset"
  );
}

export async function reclassifyProjectAsset(projectName, assetId, assetType, note = "") {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  if (!assetId) {
    throw new Error("Missing asset id");
  }

  const normalizedAssetType = String(assetType || "").trim().toLowerCase();
  if (!normalizedAssetType) {
    throw new Error("Missing asset type");
  }

  return sendJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/assets/${encodeURIComponent(assetId)}/classification`,
    "PATCH",
    {
      asset_type: normalizedAssetType,
      note: String(note || "").trim()
    },
    "Failed to reclassify asset"
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

export async function executeProjectAiChat(projectName, payload = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  return sendRawJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/ai/chat`,
    "POST",
    payload,
    "Failed to request AI chat",
    AI_GUIDANCE_REQUEST_TIMEOUT_MS
  );
}


export async function executeProjectAiGuidance(projectName, payload = {}) {
  if (!projectName) {
    throw new Error("Missing project name");
  }

  return sendRawJson(
    `/media-manager/project/${encodeURIComponent(projectName)}/ai/guidance`,
    "POST",
    payload,
    "Failed to request AI guidance",
    AI_GUIDANCE_REQUEST_TIMEOUT_MS
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

  if (params.timeline_limit) {
    search.set("timeline_limit", String(params.timeline_limit));
  }

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

  if (params.limit) {
    search.set("limit", String(params.limit));
  }

  if (params.campaign_id) {
    search.set("campaign_id", String(params.campaign_id));
  }

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

  if (params.limit) {
    search.set("limit", String(params.limit));
  }

  if (params.campaign_id) {
    search.set("campaign_id", String(params.campaign_id));
  }

  if (params.content_item_id) {
    search.set("content_item_id", String(params.content_item_id));
  }

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

  if (params.limit) {
    search.set("limit", String(params.limit));
  }

  if (params.destination_page) {
    search.set("destination_page", String(params.destination_page));
  }

  if (params.source_page) {
    search.set("source_page", String(params.source_page));
  }

  if (params.status) {
    search.set("status", String(params.status));
  }

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

export async function fetchCustomerOperationsReadiness(projectName) {
  return requestJson(`/api/projects/${encodeURIComponent(projectName)}/customer-operations/readiness`);
}

export async function fetchCustomerOperationsInbox(projectName) {
  return requestJson(`/api/projects/${encodeURIComponent(projectName)}/customer-operations/inbox`);
}

export async function fetchCustomerConversations(projectName) {
  return requestJson(`/api/projects/${encodeURIComponent(projectName)}/customer-operations/conversations`);
}

export async function fetchCustomerConversationDetail(projectName, conversationId) {
  return requestJson(`/api/projects/${encodeURIComponent(projectName)}/customer-operations/conversations/${encodeURIComponent(conversationId)}`);
}

export async function fetchCustomerConversationMessages(projectName, conversationId) {
  return requestJson(`/api/projects/${encodeURIComponent(projectName)}/customer-operations/conversations/${encodeURIComponent(conversationId)}/messages`);
}

export async function fetchCustomerProfilePreview(projectName, customerId) {
  return requestJson(`/api/projects/${encodeURIComponent(projectName)}/customer-operations/customers/${encodeURIComponent(customerId)}`);
}

export async function fetchCustomerTickets(projectName) {
  return requestJson(`/api/projects/${encodeURIComponent(projectName)}/customer-operations/tickets`);
}

export async function fetchCustomerChannels(projectName) {
  return requestJson(`/api/projects/${encodeURIComponent(projectName)}/customer-operations/channels`);
}


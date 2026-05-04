// public/control-center/app.js

import {
  initRouter,
  navigateTo,
  renderRouteTemplate,
  getRouteDefinition,
  setRouteAccessResolver
} from "./router.js";
import { applyStandardPageLayout } from "./ui/page-standard.js";
import {
  getState,
  setProjects,
  setCurrentProject,
  setCurrentRoute,
  setProjectContext,
  patchState,
  setLoading,
  setError,
  clearError,
  markInitialized,
  subscribe,
  resetProjectData
} from "./state.js";
import {
  setApiBaseUrl,
  fetchProjects,
  fetchAllCoreProjectData,
  fetchProjectInsights,
  fetchProjectLearning,
  fetchProjectOperations,
  saveProjectSetup,
  executeProjectAiCommand,
  saveProjectConnectorSource,
  removeProjectConnectorSource,
  fetchProjectIntegrationControlCenter,
  connectProjectIntegration,
  reconnectProjectIntegration,
  testProjectIntegration,
  syncProjectIntegration,
  importProjectIntegrationHistory,
  disconnectProjectIntegration,
  runProjectWorkflow,
  runProjectAiWorkflow,
  createProjectTask,
  createProjectApproval,
  saveProjectCampaign,
  createProjectHandoff,
  consumeProjectHandoff,
  markProjectNotification,
  savePublishingSchedule,
  reschedulePublishingItem,
  approvePublishingItem,
  publishPublishingItem,
  failPublishingItem
} from "./api.js";

/* =========================
   CONFIG
========================= */

setApiBaseUrl("");

const CONTROL_WRITE_KEY_STORAGE_KEY = "mh-control-write-key";
const CONTROL_WRITE_HEADER = "x-mh-control-key";
const CONTROL_ROLE_STORAGE_KEY = "mh-control-role";
const DEFAULT_ACTIVE_ROLE = "admin";
const ACTIVE_ROUTE_ROLES = [
  "strategist",
  "writer",
  "designer",
  "video_lead",
  "publisher",
  "ads_operator",
  "analyst",
  "compliance_reviewer",
  "admin"
];
const DEFAULT_ROUTE_ROLE_ACCESS = {
  home: ["strategist", "analyst", "admin"],
  "ai-command": ACTIVE_ROUTE_ROLES,
  "campaign-studio": ["strategist", "ads_operator", "admin"],
  "content-studio": ["writer", "strategist", "compliance_reviewer", "admin"],
  "media-studio": ["designer", "video_lead", "compliance_reviewer", "admin"],
  publishing: ["publisher", "compliance_reviewer", "admin"],
  research: ["strategist", "analyst", "writer", "admin"],
  setup: ACTIVE_ROUTE_ROLES,
  "task-center": ACTIVE_ROUTE_ROLES,
  "queue-center": ACTIVE_ROUTE_ROLES,
  "job-monitor": ACTIVE_ROUTE_ROLES,
  "notification-center": ACTIVE_ROUTE_ROLES,
  governance: ["compliance_reviewer", "admin", "analyst"],
  "ads-manager": ["ads_operator", "strategist", "analyst", "admin"],
  insights: ["analyst", "strategist", "ads_operator", "admin"],
  integrations: ["admin"],
  workflows: ACTIVE_ROUTE_ROLES,
  library: ["designer", "video_lead", "publisher", "admin"],
  settings: ["admin"]
};

function getControlWriteKey() {
  if (typeof window === "undefined") return "";

  const runtimeValue = [
    window.__MH_CONTROL_CENTER_READ_KEY__,
    window.__MH_CONTROL_CENTER_WRITE_KEY__,
    window.__MH_CONTROL_WRITE_KEY__
  ].find((value) => typeof value === "string" && value.trim()) || "";

  if (runtimeValue) {
    return runtimeValue.trim();
  }

  try {
    return String(window.localStorage?.getItem(CONTROL_WRITE_KEY_STORAGE_KEY) || "").trim();
  } catch (_) {
    return "";
  }
}

function getActiveRole() {
  try {
    const stored = window.localStorage?.getItem(CONTROL_ROLE_STORAGE_KEY);
    if (stored && ACTIVE_ROUTE_ROLES.includes(stored.trim().toLowerCase())) {
      return stored.trim().toLowerCase();
    }
  } catch (_) {}
  const operations = getState().data.operations;
  const stateRole = operations?.team_service_model?.active_role;
  if (stateRole && typeof stateRole === "string" && stateRole.trim()) {
    return stateRole.trim().toLowerCase();
  }
  return DEFAULT_ACTIVE_ROLE;
}

function isProtectedControlWriteRequest(input, init = {}) {
  const method = String(
    init.method ||
    (input instanceof Request ? input.method : "") ||
    "GET"
  ).trim().toUpperCase();

  if (!["POST", "PATCH", "DELETE"].includes(method)) {
    return false;
  }

  try {
    const base = typeof window !== "undefined" ? window.location.origin : "http://localhost";
    const url = new URL(
      input instanceof Request ? input.url : String(input || ""),
      base
    );

    return /^\/(?:public\/)?media-manager\//.test(url.pathname);
  } catch (_) {
    return false;
  }
}

function installProtectedWriteFetch() {
  if (typeof window === "undefined" || typeof window.fetch !== "function" || window.fetch.__mhProtectedWriteFetch) {
    return;
  }

  const originalFetch = window.fetch.bind(window);

  async function protectedWriteFetch(input, init = {}) {
    if (!isProtectedControlWriteRequest(input, init)) {
      return originalFetch(input, init);
    }

    const headers = new Headers(
      init.headers ||
      (input instanceof Request ? input.headers : undefined) ||
      {}
    );
    const controlKey = getControlWriteKey();

    if (controlKey) {
      headers.set(CONTROL_WRITE_HEADER, controlKey);
    }

    const nextInit = {
      ...init,
      headers
    };
    const nextInput = input instanceof Request
      ? new Request(input, { headers })
      : input;

    return originalFetch(nextInput, nextInit);
  }

  protectedWriteFetch.__mhProtectedWriteFetch = true;
  window.fetch = protectedWriteFetch;
}

function resolveRouteAccess(route) {
  const operations = getState().data.operations;
  const routePermissions = Array.isArray(operations?.team_service_model?.route_permissions)
    ? operations.team_service_model.route_permissions
    : [];
  const activeRole = getActiveRole();

  function buildBlockedReason(allowedRoles) {
    const rolesStr = allowedRoles.join(", ");
    return (
      `Route "${route}" requires one of: [${rolesStr}]. ` +
      `Your current role is "${activeRole}". ` +
      `Use the Role selector in the top bar to switch roles for internal testing.`
    );
  }

  const explicitRule = routePermissions.find((item) => item?.route === route);

  if (!explicitRule) {
    const fallbackRoles = DEFAULT_ROUTE_ROLE_ACCESS[route];
    if (!Array.isArray(fallbackRoles)) {
      return { allowed: true, reason: "" };
    }
    const allowed = fallbackRoles.includes(activeRole);
    return {
      allowed,
      reason: allowed ? "" : buildBlockedReason(fallbackRoles)
    };
  }

  const allowedRoles = Array.isArray(explicitRule.roles)
    ? explicitRule.roles.map((item) => String(item || "").trim().toLowerCase())
    : [];
  const allowed = allowedRoles.includes(activeRole);

  return {
    allowed,
    reason: allowed ? "" : buildBlockedReason(allowedRoles)
  };
}

installProtectedWriteFetch();
setRouteAccessResolver(resolveRouteAccess);

/* =========================
   ACCESS KEY PANEL
========================= */

function createAccessKeyModal() {
  const modal = document.createElement("div");
  modal.id = "accessKeyModal";
  modal.className = "access-key-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", "Control Center Access Key");
  modal.innerHTML = `
    <div class="access-key-card">
      <h2 class="access-key-title">Control Center Access</h2>
      <p class="access-key-desc">
        Enter the Control Center access key to unlock protected reads and writes.
        The key is stored only in your browser's localStorage and never transmitted to
        static routes or logged to the console.
      </p>
      <div class="access-key-field">
        <input
          id="accessKeyInput"
          class="access-key-input"
          type="password"
          placeholder="Paste access key…"
          autocomplete="off"
          spellcheck="false"
          aria-label="Access key input"
        >
      </div>
      <div class="access-key-actions">
        <button id="accessKeySaveBtn" class="btn btn-primary" type="button">Save Key</button>
        <button id="accessKeyTestBtn" class="btn btn-secondary" type="button">Test Key</button>
        <button id="accessKeyClearBtn" class="btn btn-danger" type="button">Clear Key</button>
        <button id="accessKeyCloseBtn" class="btn btn-ghost" type="button">Close</button>
      </div>
      <div id="accessKeyStatus" class="access-key-status" aria-live="polite"></div>
    </div>
  `;
  return modal;
}

function setAccessKeyStatus(message, type) {
  const status = document.getElementById("accessKeyStatus");
  if (!status) return;
  status.textContent = message;
  status.className = "access-key-status access-key-status--" + (type || "info");
}

async function refreshProjectsAfterKeyUpdate(preferredProjectName = "") {
  const preferred = await loadProjects();
  const state = getState();
  const items = Array.isArray(state.data.projects) ? state.data.projects : [];

  const requested = getSafeProjectName(preferredProjectName, "");
  const requestedExists = requested && projectExistsInList(requested, items);
  const projectToLoad = requestedExists ? requested : getSafeProjectName(preferred || DEFAULT_PROJECT_SLUG);

  navigateTo("home");
  await loadProjectData(projectToLoad);
  showMessage(`Loaded project: ${projectToLoad}`);
}



function bindAccessKeyPanel(modal) {
  const input = modal.querySelector("#accessKeyInput");
  const saveBtn = modal.querySelector("#accessKeySaveBtn");
  const testBtn = modal.querySelector("#accessKeyTestBtn");
  const clearBtn = modal.querySelector("#accessKeyClearBtn");
  const closeBtn = modal.querySelector("#accessKeyCloseBtn");

  if (saveBtn) {
    saveBtn.addEventListener("click", async () => {
      const val = (input?.value || "").trim();
      if (!val) {
        setAccessKeyStatus("No key entered.", "error");
        return;
      }
      try {
        localStorage.setItem(CONTROL_WRITE_KEY_STORAGE_KEY, val);
      } catch (_) {
        setAccessKeyStatus("Could not save key to localStorage.", "error");
        return;
      }
      if (input) input.value = "";
      setAccessKeyStatus("Key saved. Reloading front page and projects…", "success");
      updateAccessKeyButton();

      try {
        await refreshProjectsAfterKeyUpdate();
        setAccessKeyStatus("Key saved and project loaded.", "success");
      } catch (error) {
        setAccessKeyStatus(error?.message || "Key saved, but project load failed.", "error");
      }
    });
  }

  if (testBtn) {
    testBtn.addEventListener("click", async () => {
      setAccessKeyStatus("Testing…", "info");
      const inputVal = (input?.value || "").trim();
      let storedVal = "";
      try { storedVal = localStorage.getItem(CONTROL_WRITE_KEY_STORAGE_KEY) || ""; } catch (_) {}
      const keyToTest = inputVal || storedVal;
      if (!keyToTest) {
        setAccessKeyStatus("No key to test. Enter a key or save one first.", "error");
        return;
      }
      try {
        const response = await fetch("/media-manager/projects", {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "x-mh-control-key": keyToTest
          }
        });
        if (response.ok) {
          setAccessKeyStatus("Valid key — loading front page and project…", "success");

          try {
            if (inputVal) {
              localStorage.setItem(CONTROL_WRITE_KEY_STORAGE_KEY, inputVal);
              updateAccessKeyButton();
            }
            await refreshProjectsAfterKeyUpdate();
            setAccessKeyStatus("Valid key and project loaded.", "success");
          } catch (error) {
            setAccessKeyStatus(error?.message || "Valid key, but project load failed.", "error");
          }
        } else if (response.status === 401 || response.status === 403) {
          setAccessKeyStatus("Invalid key — access denied (" + response.status + ").", "error");
        } else {
          setAccessKeyStatus("Endpoint responded with " + response.status + ".", "warn");
        }
      } catch (_) {
        setAccessKeyStatus("Request failed — check server connection.", "error");
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      try { localStorage.removeItem(CONTROL_WRITE_KEY_STORAGE_KEY); } catch (_) {}
      if (input) input.value = "";
      setAccessKeyStatus("Key cleared. Reads will now fail with missing-key errors.", "warn");
      updateAccessKeyButton();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", hideAccessKeyModal);
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) hideAccessKeyModal();
  });

  modal.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hideAccessKeyModal();
  });
}

function showAccessKeyModal() {
  let modal = document.getElementById("accessKeyModal");
  if (!modal) {
    modal = createAccessKeyModal();
    document.body.appendChild(modal);
    bindAccessKeyPanel(modal);
  }
  modal.classList.add("is-visible");
  const input = document.getElementById("accessKeyInput");
  if (input) {
    input.value = "";
    setTimeout(() => input.focus(), 50);
  }
}

function hideAccessKeyModal() {
  const modal = document.getElementById("accessKeyModal");
  if (modal) modal.classList.remove("is-visible");
}

function updateAccessKeyButton() {
  const btn = document.getElementById("accessKeyBtn");
  if (!btn) return;
  const hasKey = !!getControlWriteKey();
  btn.textContent = hasKey ? "Key: Active ✓" : "Set Access Key";
  btn.classList.toggle("btn-key-active", hasKey);
  btn.classList.toggle("btn-key-missing", !hasKey);
}

function injectAccessKeyButton() {
  const topbarRight = document.querySelector(".topbar-right");
  if (!topbarRight || document.getElementById("accessKeyBtn")) return;

  const btn = document.createElement("button");
  btn.id = "accessKeyBtn";
  btn.className = "btn btn-secondary access-key-btn";
  btn.type = "button";
  btn.title = "Manage Control Center access key";
  btn.textContent = "Set Access Key";

  topbarRight.insertBefore(btn, topbarRight.firstChild);
  btn.addEventListener("click", showAccessKeyModal);
  updateAccessKeyButton();
}

/* =========================
   ROLE SWITCHER
========================= */

function injectRoleSwitcher() {
  const topbarRight = document.querySelector(".topbar-right");
  if (!topbarRight || document.getElementById("roleSwitcherWrap")) return;

  const wrapper = document.createElement("div");
  wrapper.id = "roleSwitcherWrap";
  wrapper.className = "role-switcher";

  const label = document.createElement("label");
  label.htmlFor = "roleSwitcherSelect";
  label.className = "role-switcher-label";
  label.textContent = "Role";

  const select = document.createElement("select");
  select.id = "roleSwitcherSelect";
  select.className = "role-switcher-select";
  select.title = "Internal test role override (stored in localStorage)";

  ACTIVE_ROUTE_ROLES.forEach((r) => {
    const opt = document.createElement("option");
    opt.value = r;
    opt.textContent = r;
    select.appendChild(opt);
  });

  const currentRole = getActiveRole();
  select.value = currentRole;

  select.addEventListener("change", () => {
    const role = select.value;
    try { localStorage.setItem(CONTROL_ROLE_STORAGE_KEY, role); } catch (_) {}
    const { currentRoute } = getState();
    navigateTo(currentRoute, false);
    renderGlobalUi();
    renderCurrentPage();
  });

  wrapper.appendChild(label);
  wrapper.appendChild(select);
  topbarRight.insertBefore(wrapper, topbarRight.firstChild);
}



function $(id) {
  return document.getElementById(id);
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeText(value, fallback = "-") {
  if (value == null || value === "") return fallback;
  return String(value);
}

function formatRoleLabel(role) {
  const normalized = String(role || "").trim().toLowerCase();
  if (!normalized) return "Admin";
  return normalized
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function setText(id, value, fallback = "-") {
  const el = $(id);
  if (el) {
    el.textContent = safeText(value, fallback);
  }
}

function renderSimpleList(items, emptyText = "No items available.") {
  return items.length
    ? `<ul class="simple-list">${items.map((item) => `<li>${escapeHtml(String(item))}</li>`).join("")}</ul>`
    : `<div class="empty-box">${escapeHtml(emptyText)}</div>`;
}

function ensureRouteDom(route) {
  const pageRoot = $("pageRoot");
  if (!pageRoot) return;

  const page = pageRoot.querySelector(`.page[data-page="${route}"]`);
  if (!page) {
    renderRouteTemplate(route);
  }
}

/* =========================
   FEEDBACK
========================= */

let messageTimer = null;

function showMessage(message) {
  const box = $("globalMessage");
  if (!box) return;

  box.textContent = message || "";
  box.style.display = message ? "block" : "none";

  if (message) {
    autoHideMessage();
  }
}

function showError(message) {
  const box = $("globalError");
  if (!box) return;

  box.textContent = message || "";
  box.style.display = message ? "block" : "none";
}

function clearFeedback() {
  showMessage("");
  showError("");
}

function autoHideMessage(delay = 2500) {
  if (messageTimer) {
    clearTimeout(messageTimer);
  }

  messageTimer = setTimeout(() => {
    showMessage("");
  }, delay);
}

/* =========================
   LOADING
========================= */

function showLoading(
  title = "Loading project",
  text = "Please wait while the system loads the workspace.",
  options = {}
) {
  const token = String(options.token || "");
  const reason = String(options.reason || "project-load");
  const explicitLoad = Boolean(options.explicitLoad);

  if (!explicitLoad) {
    recordLoadingTransition("show-blocked-non-explicit", { token, reason });
    return;
  }

  if (token && !isActiveProjectLoadToken(token)) {
    recordLoadingTransition("show-blocked-stale-token", { token, reason });
    return;
  }

  const overlay = $("loadingOverlay");
  const loadingTitle = $("loadingTitle");
  const loadingText = $("loadingText");

  if (loadingTitle) loadingTitle.textContent = title;
  if (loadingText) loadingText.textContent = text;

  if (overlay) {
    overlay.style.display = "flex";
    overlay.style.pointerEvents = "auto";
    overlay.classList.add("is-visible");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-loading", "loading", "loading-locked");
    installLoadingWatchdog("loading-overlay-visible");
    recordLoadingTransition("show", { token, reason });
  }
}

function hideLoading(options = {}) {
  const token = String(options.token || "");
  const reason = String(options.reason || "project-load-complete");
  const force = Boolean(options.force);

  if (token && !force && !isActiveProjectLoadToken(token)) {
    recordLoadingTransition("hide-blocked-stale-token", { token, reason });
    return false;
  }

  const overlay = $("loadingOverlay");
  if (!overlay) return false;

  overlay.classList.remove("is-visible");
  overlay.setAttribute("aria-hidden", "true");
  overlay.style.display = "none";
  overlay.style.pointerEvents = "none";

  const body = document.body;
  if (body) {
    body.classList.remove("is-loading", "loading", "loading-locked", "app-loading", "app-locked");

    Array.from(body.classList).forEach((className) => {
      if (/loading|locked/i.test(className)) {
        body.classList.remove(className);
      }
    });
  }

  clearLoadingWatchdog();
  recordLoadingTransition(force ? "hide-force" : "hide", { token, reason });
  return true;
}

function isLoadingVisible() {
  const overlay = $("loadingOverlay");
  return Boolean(overlay && overlay.classList.contains("is-visible"));
}

const LOADING_WATCHDOG_TIMEOUT_MS = 30000;
const OVERLAY_RECOVERY_DELAY_MS = 3000;
const STARTUP_STEPS_STORAGE_KEY = "mh-control-center-startup-steps";
const LAST_PROJECT_LOAD_STORAGE_KEY = "mh-control-center-last-project-load";
const LOADING_TRANSITIONS_STORAGE_KEY = "mh-control-center-loading-transitions";
const STARTUP_HISTORY_LIMIT = 60;
const LOADING_TRANSITION_LIMIT = 80;

let loadingWatchdogTimer = null;
let loadingWatchdogReason = "";

const startupStepHistory = [];
const loadingTransitionHistory = [];

const startupDiagnostics = {
  failedEndpoints: [],
  lastErrorSource: "",
  lastErrorMessage: ""
};

function safeStorageSet(key, value) {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch (_) {}
}

function boundedPush(list, value, limit) {
  list.push(value);
  if (list.length > limit) {
    list.splice(0, list.length - limit);
  }
}

function formatStepEntry(entry) {
  if (!entry) return "";
  const tokenText = entry.token ? ` [${entry.token}]` : "";
  const detailText = entry.detail ? ` - ${entry.detail}` : "";
  return `${entry.at} ${entry.step}${tokenText}${detailText}`;
}

function renderStartupStepDiagnostics() {
  const latest = startupStepHistory[startupStepHistory.length - 1] || null;
  const banner = $("startupStepBanner");
  if (banner) {
    banner.hidden = false;
    banner.textContent = latest
      ? `Startup: ${latest.step}${latest.token ? ` [${latest.token}]` : ""}`
      : "Startup: idle";
  }

  const stepsBox = $("fatalStartupSteps");
  if (stepsBox) {
    const lines = startupStepHistory.slice(-10).map((entry) => formatStepEntry(entry));
    stepsBox.textContent = lines.length ? lines.join("\n") : "No startup steps recorded yet.";
  }

  patchState("data", {
    startupStep: latest?.step || "",
    startupSteps: startupStepHistory.slice(-20),
    loadingTransitions: loadingTransitionHistory.slice(-20)
  });
}

function recordStartupStep(step, details = {}) {
  const entry = {
    at: new Date().toISOString(),
    step: String(step || "startup.step"),
    token: String(details.token || ""),
    detail: String(details.detail || "")
  };

  boundedPush(startupStepHistory, entry, STARTUP_HISTORY_LIMIT);
  safeStorageSet(STARTUP_STEPS_STORAGE_KEY, JSON.stringify(startupStepHistory));
  renderStartupStepDiagnostics();
}

function recordLoadingTransition(action, details = {}) {
  const overlay = $("loadingOverlay");
  const entry = {
    at: new Date().toISOString(),
    action: String(action || "loading.transition"),
    token: String(details.token || ""),
    reason: String(details.reason || ""),
    visible: Boolean(overlay && overlay.classList.contains("is-visible"))
  };

  boundedPush(loadingTransitionHistory, entry, LOADING_TRANSITION_LIMIT);
  safeStorageSet(LOADING_TRANSITIONS_STORAGE_KEY, JSON.stringify(loadingTransitionHistory));
  renderStartupStepDiagnostics();
}

function recordLastProjectLoad(summary) {
  const payload = {
    at: new Date().toISOString(),
    ...summary
  };
  safeStorageSet(LAST_PROJECT_LOAD_STORAGE_KEY, JSON.stringify(payload));
  patchState("data", { lastProjectLoad: payload });
}

function recordStartupFailure(source, error) {
  const message = String(error?.message || error || "Unknown startup error").trim();
  startupDiagnostics.lastErrorSource = String(source || "startup");
  startupDiagnostics.lastErrorMessage = message;

  const endpoint = String(error?.endpoint || "").trim();
  if (!endpoint) return;

  const alreadyRecorded = startupDiagnostics.failedEndpoints.some((item) => item.endpoint === endpoint);
  if (!alreadyRecorded) {
    startupDiagnostics.failedEndpoints.push({
      endpoint,
      status: error?.status || null,
      timeout: Boolean(error?.isTimeout),
      message
    });
  }
}

function renderStartupDiagnosticsText(reason = "") {
  const rows = [];
  if (reason) {
    rows.push(`Reason: ${reason}`);
  }
  if (startupDiagnostics.lastErrorSource || startupDiagnostics.lastErrorMessage) {
    rows.push(
      `Last error: ${startupDiagnostics.lastErrorSource || "startup"} - ` +
      `${startupDiagnostics.lastErrorMessage || "unknown"}`
    );
  }
  if (startupDiagnostics.failedEndpoints.length) {
    const endpointRow = startupDiagnostics.failedEndpoints
      .map((item) => `${item.endpoint}${item.status ? ` (${item.status})` : ""}${item.timeout ? " [timeout]" : ""}`)
      .join("; ");
    rows.push(`Endpoints: ${endpointRow}`);
  }
  if (startupStepHistory.length) {
    const recentSteps = startupStepHistory.slice(-6).map((entry) => formatStepEntry(entry)).join(" | ");
    rows.push(`Steps: ${recentSteps}`);
  }
  return rows.join("\n");
}

function bindFatalErrorPanelActions() {
  const retryBtn = $("fatalRetryBtn");
  const accessKeyBtn = $("fatalAccessKeyBtn");

  if (retryBtn && !retryBtn.dataset.bound) {
    retryBtn.dataset.bound = "1";
    retryBtn.addEventListener("click", () => {
      window.location.reload();
    });
  }

  if (accessKeyBtn && !accessKeyBtn.dataset.bound) {
    accessKeyBtn.dataset.bound = "1";
    accessKeyBtn.addEventListener("click", () => {
      showAccessKeyModal();
    });
  }
}

function showFatalErrorPanel(message, details = "") {
  const panel = $("fatalErrorPanel");
  if (!panel) {
    showError(message);
    return;
  }

  const text = $("fatalErrorText");
  const detailsBox = $("fatalErrorDetails");

  if (text) {
    text.textContent = message || "Control Center failed to start.";
  }
  if (detailsBox) {
    detailsBox.textContent = details || "No additional diagnostics available.";
  }

  panel.hidden = false;
  panel.classList.add("is-visible");
  panel.setAttribute("aria-hidden", "false");
  bindFatalErrorPanelActions();
}

function handleStartupFatalError(source, error) {
  const err = error instanceof Error ? error : new Error(String(error || "Unknown startup failure"));
  recordStartupStep("startup.fatal", {
    detail: `${String(source || "startup")}: ${String(err.message || "unknown error")}`
  });
  recordStartupFailure(source, err);
  console.error("[CONTROL_CENTER_STARTUP_FATAL]", source, err);
  setLoading(false);
  hideLoading({ reason: "startup-fatal", force: true });
  setError(err.message || "Control Center initialization failed");
  showError(err.message || "Control Center initialization failed");
  showFatalErrorPanel(
    "Control Center could not complete startup.",
    renderStartupDiagnosticsText(String(source || "startup"))
  );
}

function clearLoadingWatchdog() {
  if (loadingWatchdogTimer) {
    clearTimeout(loadingWatchdogTimer);
    loadingWatchdogTimer = null;
  }
  loadingWatchdogReason = "";
}

function installLoadingWatchdog(reason = "project-load") {
  clearLoadingWatchdog();
  loadingWatchdogReason = String(reason || "project-load");

  loadingWatchdogTimer = setTimeout(() => {
    if (!isLoadingVisible()) return;

    const timeoutError = new Error(
      `Loading watchdog timed out after ${LOADING_WATCHDOG_TIMEOUT_MS / 1000}s during ${loadingWatchdogReason}.`
    );
    timeoutError.isTimeout = true;
    handleStartupFatalError("loading-watchdog", timeoutError);
  }, LOADING_WATCHDOG_TIMEOUT_MS);
}

function installGlobalErrorGuards() {
  if (typeof window === "undefined" || window.__mhControlCenterErrorGuardsInstalled) {
    return;
  }

  window.__mhControlCenterErrorGuardsInstalled = true;

  window.addEventListener("error", (event) => {
    const startupPhase = !getState().initialized || isLoadingVisible();
    if (!startupPhase) return;

    const message = event?.message || "Unhandled browser error";
    const err = event?.error instanceof Error ? event.error : new Error(message);
    handleStartupFatalError("window.error", err);
  });

  window.addEventListener("unhandledrejection", (event) => {
    const startupPhase = !getState().initialized || isLoadingVisible();
    if (!startupPhase) return;

    const reason = event?.reason;
    const err = reason instanceof Error ? reason : new Error(String(reason || "Unhandled promise rejection"));
    handleStartupFatalError("window.unhandledrejection", err);
  });
}


/* =========================
   PROJECT SELECTION SAFETY
========================= */

const DEFAULT_PROJECT_SLUG = ["hairo", "ticmen"].join("");
const PROJECT_STORAGE_KEY = "mh-control-center-current-project";
const LEGACY_PROJECT_STORAGE_KEYS = [
  "mh_current_project",
  "currentProject"
];
const BLOCKED_DEFAULT_PROJECT_PATTERNS = [
  "smoke",
  "test",
  "corestability",
  "core-stability",
  "dummy",
  "sample"
];

function normalizeProjectSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "");
}

function isBlockedDefaultProject(projectName) {
  const normalized = normalizeProjectSlug(projectName);
  if (!normalized) return true;
  return BLOCKED_DEFAULT_PROJECT_PATTERNS.some((pattern) => normalized.includes(pattern));
}

function getProjectItemSlug(item) {
  if (typeof item === "string") return normalizeProjectSlug(item);
  return normalizeProjectSlug(item?.slug || item?.id || item?.name || item?.project || "");
}

function getProjectItemLabel(item) {
  if (typeof item === "string") return item;
  return String(item?.name || item?.label || item?.slug || item?.id || item?.project || "").trim();
}

function getVisibleProjects(projects = []) {
  return (Array.isArray(projects) ? projects : []).filter((item) => {
    const slug = getProjectItemSlug(item);
    return slug && !isBlockedDefaultProject(slug);
  });
}

function projectExistsInList(projectName, projects = []) {
  const normalized = normalizeProjectSlug(projectName);
  if (!normalized) return false;
  return (Array.isArray(projects) ? projects : []).some((item) => getProjectItemSlug(item) === normalized);
}

function clearLegacyStoredProjectNames() {
  if (typeof window === "undefined" || !window.localStorage) return;

  try {
    LEGACY_PROJECT_STORAGE_KEYS.forEach((key) => window.localStorage.removeItem(key));
  } catch (_) {}
}

function getStoredProjectName() {
  if (typeof window === "undefined" || !window.localStorage) return DEFAULT_PROJECT_SLUG;

  try {
    const stored =
      window.localStorage.getItem(PROJECT_STORAGE_KEY) ||
      LEGACY_PROJECT_STORAGE_KEYS.map((key) => window.localStorage.getItem(key)).find(Boolean) ||
      "";

    const normalized = normalizeProjectSlug(stored);

    if (!normalized || isBlockedDefaultProject(normalized)) {
      window.localStorage.removeItem(PROJECT_STORAGE_KEY);
      clearLegacyStoredProjectNames();
      return DEFAULT_PROJECT_SLUG;
    }

    return normalized;
  } catch (_) {
    return DEFAULT_PROJECT_SLUG;
  }
}

function setStoredProjectName(projectName) {
  if (typeof window === "undefined" || !window.localStorage) return;

  const normalized = normalizeProjectSlug(projectName);
  if (!normalized || isBlockedDefaultProject(normalized)) return;

  try {
    window.localStorage.setItem(PROJECT_STORAGE_KEY, normalized);
    clearLegacyStoredProjectNames();
  } catch (_) {}
}

function getSafeProjectName(projectName, fallback = DEFAULT_PROJECT_SLUG) {
  const normalized = normalizeProjectSlug(projectName);
  if (!normalized || isBlockedDefaultProject(normalized)) {
    return normalizeProjectSlug(fallback) || DEFAULT_PROJECT_SLUG;
  }
  return normalized;
}

function pickSafeDefaultProject(projects = [], preferredProject = "") {
  const items = Array.isArray(projects) ? projects : [];
  const storedProject = getStoredProjectName();
  const preferred = normalizeProjectSlug(preferredProject);

  if (storedProject && !isBlockedDefaultProject(storedProject) && projectExistsInList(storedProject, items)) {
    return storedProject;
  }

  if (preferred && !isBlockedDefaultProject(preferred) && projectExistsInList(preferred, items)) {
    return preferred;
  }

  if (projectExistsInList(DEFAULT_PROJECT_SLUG, items)) {
    return DEFAULT_PROJECT_SLUG;
  }

  const firstVisible = getVisibleProjects(items)[0];
  return getProjectItemSlug(firstVisible) || DEFAULT_PROJECT_SLUG;
}

/* =========================
   GLOBAL CONTEXT
========================= */

function renderTopContext() {
  const state = getState();
  const ctx = state.context;
  const operations = state.data.operations || {};
  const notifications = Array.isArray(operations?.notifications?.items)
    ? operations.notifications.items
    : [];
  const unread = notifications.filter((item) => !item?.read_at).length;

  setText("ctxProject", ctx.currentProject);
  setText("ctxMarket", ctx.currentMarket);
  setText("ctxMode", ctx.executionMode);
  setText("ctxCampaign", ctx.activeCampaign);
  setText("ctxRoute", state.currentRoute || "home");
  setText("ctxAlerts", unread);

  const roleBadge = $("mobileRoleBadge");
  if (roleBadge) {
    roleBadge.textContent = formatRoleLabel(getActiveRole());
  }
}

function renderProjectSwitcher() {
  const state = getState();
  const select = $("projectSwitcher");
  if (!select) return;

  const currentValue = getSafeProjectName(state.context.currentProject || DEFAULT_PROJECT_SLUG);
  const items = getVisibleProjects(Array.isArray(state.data.projects) ? state.data.projects : []);

  select.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select project";
  select.appendChild(defaultOption);

  const seen = new Set();

  items.forEach((item) => {
    const slug = getProjectItemSlug(item);
    const label = getProjectItemLabel(item) || slug;
    if (!slug || seen.has(slug)) return;

    seen.add(slug);

    const option = document.createElement("option");
    option.value = slug;
    option.textContent = label;
    select.appendChild(option);
  });

  if (currentValue && !seen.has(currentValue) && !isBlockedDefaultProject(currentValue)) {
    const option = document.createElement("option");
    option.value = currentValue;
    option.textContent = currentValue;
    select.appendChild(option);
  }

  select.value = currentValue;
}



/* =========================
   PLACEHOLDERS
========================= */

function renderPlaceholders() {
  const placeholders = [
    ["aiCommandChat", "Feature not connected."],
    ["aiCommandSuggestions", "Not implemented yet."],
    ["aiCommandHistory", "Not implemented yet."],

    ["workflowsCatalog", "Not implemented yet."],

    ["campaignBuilder", "Not implemented yet."],
    ["campaignWaves", "Not implemented yet."],
    ["campaignAssets", "Feature not connected."],

    ["contentQueue", "Not implemented yet."],
    ["contentPreview", "Feature not connected."],

    ["mediaImages", "Feature not connected."],
    ["mediaVideoAudio", "Feature not connected."],
    ["mediaOutputs", "Not implemented yet."],

    ["publishingCalendar", "Not implemented yet."],
    ["publishingQueue", "Feature not connected."],
    ["publishingChannels", "Feature not connected."],

    ["adsBudget", "Feature not connected."],
    ["adsPerformance", "Feature not connected."],

    ["insightsOverview", "Feature not connected."],
    ["insightsReports", "Not implemented yet."],

    ["settingsProject", "Feature not connected."],
    ["settingsSystem", "Not implemented yet."]
  ];

  placeholders.forEach(([id, text]) => {
    const el = $(id);
    if (el && !el.dataset.bound) {
      el.innerHTML = `<div class="empty-box">${escapeHtml(text)}</div>`;
    }
  });
}

/* =========================
   PAGE RENDER ORCHESTRATION
========================= */

function renderCurrentPage() {
  const { currentRoute } = getState();
  ensureRouteDom(currentRoute);
  const routeDef = getRouteDefinition(currentRoute);

  if (typeof routeDef.render === "function") {
    routeDef.render({
      getState,
      $,
      escapeHtml,
      safeText,
      setText,
      renderSimpleList,
      navigateTo,
      showMessage,
      showError,
      clearFeedback,
      reloadProjectData: loadProjectData,
      fetchProjectInsights,
      fetchProjectLearning,
      fetchProjectOperations,
      saveProjectSetup,
      executeProjectAiCommand,
      saveProjectConnectorSource,
      removeProjectConnectorSource,
      fetchProjectIntegrationControlCenter,
      connectProjectIntegration,
      reconnectProjectIntegration,
      testProjectIntegration,
      syncProjectIntegration,
      importProjectIntegrationHistory,
      disconnectProjectIntegration,
      runProjectWorkflow,
      runProjectAiWorkflow,
      createProjectTask,
      createProjectApproval,
      saveProjectCampaign,
      createProjectHandoff,
      consumeProjectHandoff,
      markProjectNotification,
      savePublishingSchedule,
      reschedulePublishingItem,
      approvePublishingItem,
      publishPublishingItem,
      failPublishingItem
    });

    if (!routeDef.disableStandardLayout) {
      applyStandardPageLayout({
        route: currentRoute,
        state: getState(),
        navigateTo,
        showMessage,
        reloadProjectData: loadProjectData
      });
    }
    return;
  }

  renderPlaceholders();

  applyStandardPageLayout({
    route: currentRoute,
    state: getState(),
    navigateTo,
    showMessage,
    reloadProjectData: loadProjectData
  });
}

function renderGlobalUi() {
  renderProjectSwitcher();
  renderTopContext();
}

async function safeRenderCurrentPage(logLabel = "[LOAD_PROJECT_RENDER_ERROR]") {
  try {
    await Promise.resolve(renderCurrentPage());
    return true;
  } catch (renderError) {
    console.error(logLabel, renderError);
    setError(renderError.message || "Failed to render project page");
    showError(renderError.message || "Failed to render project page");
    return false;
  }
}

/* =========================
   DATA LOAD
========================= */

let activeProjectLoadPromise = null;
let activeProjectLoadProject = "";
let activeProjectLoadToken = "";
let projectLoadTokenCounter = 0;

const PROJECT_LOAD_TIMEOUT_MS = 45000;

function createProjectLoadToken(projectName) {
  projectLoadTokenCounter += 1;
  return `${Date.now()}-${projectLoadTokenCounter}-${normalizeProjectSlug(projectName || "project") || "project"}`;
}

function isActiveProjectLoadToken(token) {
  const normalized = String(token || "");
  return Boolean(normalized) && normalized === activeProjectLoadToken;
}

function fetchProjectWithTimeout(projectName) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Project load timed out after ${PROJECT_LOAD_TIMEOUT_MS / 1000}s.`));
    }, PROJECT_LOAD_TIMEOUT_MS);

    fetchAllCoreProjectData(projectName)
      .then((payload) => {
        if (!payload || payload.error) {
          throw new Error(payload?.error || `Project ${projectName} returned an empty response.`);
        }
        resolve(payload);
      })
      .catch(reject)
      .finally(() => clearTimeout(timer));
  });
}

function applyProjectPayload(projectName, payload, loadToken = "") {
  if (loadToken && !isActiveProjectLoadToken(loadToken)) {
    recordStartupStep("loadProjectData.applyProjectPayload.stale-skip", {
      token: loadToken,
      detail: `Skipping stale payload for ${projectName}`
    });
    return false;
  }

  recordStartupStep("loadProjectData.applyProjectPayload", {
    token: loadToken,
    detail: `Applying payload for ${projectName}`
  });

  const scheduledJobs = Array.isArray(payload?.activity?.scheduled_jobs)
    ? payload.activity.scheduled_jobs
    : [];
  const executionResults = Array.isArray(payload?.activity?.execution_results)
    ? payload.activity.execution_results
    : [];
  const inferredCampaign =
    executionResults[0]?.wave_name ||
    scheduledJobs[0]?.wave_name ||
    "Not selected yet";

  patchState("data", {
    overview: payload.overview,
    readiness: payload.readiness,
    assets: payload.assets,
    tree: payload.tree,
    registry: payload.registry,
    integrations: payload.connectors,
    activity: payload.activity,
    operations: payload.operations || null,
    loadDiagnostics: payload?._diagnostics || null
  });

  const overviewData = payload?.overview?.overview || {};

  recordStartupStep("loadProjectData.setCurrentProject", {
    token: loadToken,
    detail: projectName
  });
  setCurrentProject(projectName);
  setStoredProjectName(projectName);

  setProjectContext({
    project: projectName,
    market: overviewData.market || "",
    language: overviewData.language || "",
    mode: overviewData.execution_mode || "",
    campaign: inferredCampaign
  });

  const summary = {
    project: projectName,
    token: loadToken,
    requiredSummary: payload?._requiredSummary || null,
    diagnostics: payload?._diagnostics || null,
    scheduledJobs: scheduledJobs.length,
    executionResults: executionResults.length,
    overviewProject: String(overviewData.project_name || "")
  };
  recordLastProjectLoad(summary);
  return true;
}

function buildOptionalLoadWarning(diagnostics) {
  const optionalFailures = Array.isArray(diagnostics?.optional)
    ? diagnostics.optional
    : [];

  if (!optionalFailures.length) {
    return "";
  }

  const labels = optionalFailures.map((entry) => String(entry?.section || "optional").trim()).filter(Boolean);
  const unique = Array.from(new Set(labels));

  return `Loaded required project data. Optional sections unavailable: ${unique.join(", ")}.`;
}

function scheduleOverlayRecoveryCheck(loadToken, projectName) {
  setTimeout(() => {
    if (!isActiveProjectLoadToken(loadToken)) {
      return;
    }

    if (!isLoadingVisible()) {
      return;
    }

    const hidden = hideLoading({
      token: loadToken,
      reason: "post-required-success-recovery",
      force: true
    });

    if (hidden) {
      recordStartupStep("loadProjectData.overlay-recovery.force-hide", {
        token: loadToken,
        detail: projectName
      });
      const warning = "Project loaded, optional data may still be syncing.";
      setError(warning);
      showError(warning);
    }
  }, OVERLAY_RECOVERY_DELAY_MS);
}

async function applyOptionalProjectPayload(payload, loadToken = "") {
  recordStartupStep("loadProjectData.optional.start", {
    token: loadToken,
    detail: "Starting optional background payload"
  });

  if (loadToken && !isActiveProjectLoadToken(loadToken)) {
    recordStartupStep("loadProjectData.optional.skip-stale", {
      token: loadToken,
      detail: "Optional payload skipped due to stale load token"
    });
    return;
  }

  const optionalReady = payload?._optionalReady;
  if (!optionalReady || typeof optionalReady.then !== "function") {
    recordStartupStep("loadProjectData.optional.noop", {
      token: loadToken,
      detail: "No optional background payload present"
    });
    return;
  }

  try {
    const optionalResult = await optionalReady;
    if (loadToken && !isActiveProjectLoadToken(loadToken)) {
      recordStartupStep("loadProjectData.optional.skip-after-await", {
        token: loadToken,
        detail: "Optional payload resolved after token changed"
      });
      return;
    }

    const patch = optionalResult?.patch || {};
    const diagnostics = optionalResult?._diagnostics || payload?._diagnostics || null;

    patchState("data", {
      activity: patch.activity,
      tree: patch.tree,
      registry: patch.registry,
      integrations: patch.connectors,
      operations: patch.operations,
      loadDiagnostics: diagnostics
    });

    const warning = buildOptionalLoadWarning(diagnostics);
    if (warning) {
      setError(warning);
      showError(warning);

      const optionalFailures = Array.isArray(diagnostics?.optional) ? diagnostics.optional : [];
      optionalFailures.forEach((entry) => {
        const failure = new Error(String(entry?.message || "Optional endpoint failed"));
        failure.endpoint = entry?.endpoint || entry?.section || "optional";
        failure.status = entry?.status || null;
        failure.isTimeout = Boolean(entry?.timeout);
        recordStartupFailure("optional-project-data", failure);
      });
    }

    renderGlobalUi();
    await safeRenderCurrentPage("[LOAD_PROJECT_OPTIONAL_RENDER_ERROR]");
    recordStartupStep("loadProjectData.optional.end", {
      token: loadToken,
      detail: "Optional background payload applied"
    });
  } catch (optionalError) {
    console.warn("Optional project data failed:", optionalError?.message || optionalError);
    recordStartupFailure("load-project-optional-data", optionalError);
    recordStartupStep("loadProjectData.optional.error", {
      token: loadToken,
      detail: String(optionalError?.message || optionalError || "Optional payload error")
    });
    setError("Loaded required project data, but optional sections failed to refresh.");
    showError("Loaded required project data, but optional sections failed to refresh.");
  }
}

async function loadProjects() {
  try {
    const result = await fetchProjects();
    const items = Array.isArray(result?.items) ? result.items : [];
    const preferredFromApi = result?.preferredProject || "";

    setProjects(items);

    const selectedProject = pickSafeDefaultProject(items, preferredFromApi);
    setCurrentProject(selectedProject);
    setStoredProjectName(selectedProject);

    renderProjectSwitcher();
    return selectedProject;
  } catch (error) {
    console.error("[LOAD_PROJECTS_ERROR]", error);
    recordStartupFailure("load-projects", error);
    setProjects([]);
    setCurrentProject(DEFAULT_PROJECT_SLUG);
    setStoredProjectName(DEFAULT_PROJECT_SLUG);
    renderProjectSwitcher();
    return DEFAULT_PROJECT_SLUG;
  }
}

async function loadProjectData(projectName) {
  const requestedProject = normalizeProjectSlug(projectName);
  const safeProjectName = getSafeProjectName(requestedProject || DEFAULT_PROJECT_SLUG);

  if (!safeProjectName) return null;

  if (activeProjectLoadPromise && activeProjectLoadProject === safeProjectName) {
    recordStartupStep("loadProjectData.reuse-active-promise", {
      token: activeProjectLoadToken,
      detail: safeProjectName
    });
    showMessage(`Project ${safeProjectName} is already loading.`);
    return activeProjectLoadPromise;
  }

  const loadToken = createProjectLoadToken(safeProjectName);
  activeProjectLoadToken = loadToken;

  recordStartupStep("loadProjectData.start", {
    token: loadToken,
    detail: safeProjectName
  });

  const loadPromise = (async () => {
    if (!isActiveProjectLoadToken(loadToken)) {
      recordStartupStep("loadProjectData.skip-stale-before-start", {
        token: loadToken,
        detail: safeProjectName
      });
      return null;
    }

    setLoading(true);
    recordStartupStep("loadProjectData.setLoading.true", {
      token: loadToken,
      detail: safeProjectName
    });
    clearError();
    clearFeedback();
    resetProjectData();

    let payload = null;
    let loadedProjectName = safeProjectName;

    showLoading("Loading project", `Please wait while ${safeProjectName} is being loaded.`, {
      token: loadToken,
      reason: "required-load-start",
      explicitLoad: true
    });

    try {
      try {
        recordStartupStep("loadProjectData.fetchProjectWithTimeout.start", {
          token: loadToken,
          detail: safeProjectName
        });
        payload = await fetchProjectWithTimeout(safeProjectName);
        recordStartupStep("loadProjectData.fetchProjectWithTimeout.success", {
          token: loadToken,
          detail: safeProjectName
        });
      } catch (primaryError) {
        if (safeProjectName === DEFAULT_PROJECT_SLUG) {
          throw primaryError;
        }

        console.warn(
          `[LOAD_PROJECT_FALLBACK] ${safeProjectName} failed. Falling back to ${DEFAULT_PROJECT_SLUG}.`,
          primaryError
        );

        loadedProjectName = DEFAULT_PROJECT_SLUG;
        recordStartupStep("loadProjectData.fetchProjectWithTimeout.fallback", {
          token: loadToken,
          detail: `${safeProjectName} -> ${DEFAULT_PROJECT_SLUG}`
        });
        showLoading("Loading project", `Please wait while ${DEFAULT_PROJECT_SLUG} is being loaded.`, {
          token: loadToken,
          reason: "required-load-fallback",
          explicitLoad: true
        });
        payload = await fetchProjectWithTimeout(DEFAULT_PROJECT_SLUG);
        recordStartupStep("loadProjectData.fetchProjectWithTimeout.success", {
          token: loadToken,
          detail: DEFAULT_PROJECT_SLUG
        });
      }

      const applied = applyProjectPayload(loadedProjectName, payload, loadToken);
      if (!applied) {
        return null;
      }

      recordStartupStep("loadProjectData.renderGlobalUi", {
        token: loadToken,
        detail: loadedProjectName
      });
      renderGlobalUi();
      recordStartupStep("loadProjectData.safeRenderCurrentPage", {
        token: loadToken,
        detail: loadedProjectName
      });
      await safeRenderCurrentPage();

      scheduleOverlayRecoveryCheck(loadToken, loadedProjectName);

      showMessage(`Loaded project: ${loadedProjectName}`);
      return payload;
    } catch (error) {
      console.error("[LOAD_PROJECT_ERROR]", error);
      recordStartupFailure("load-project-data", error);
      setCurrentProject(DEFAULT_PROJECT_SLUG);
      setProjectContext({
        project: DEFAULT_PROJECT_SLUG,
        market: "",
        language: "",
        mode: "",
        campaign: "Not selected yet"
      });
      setError(error.message || "Failed to load project data");
      showError(error.message || "Failed to load project data");
      renderGlobalUi();
      await safeRenderCurrentPage("[LOAD_PROJECT_ERROR_RENDER_FALLBACK]");
      recordStartupStep("loadProjectData.error", {
        token: loadToken,
        detail: String(error.message || "Failed to load project data")
      });
      return null;
    } finally {
      if (isActiveProjectLoadToken(loadToken)) {
        setLoading(false);
        recordStartupStep("loadProjectData.finally.setLoading.false", {
          token: loadToken,
          detail: loadedProjectName
        });
        hideLoading({ token: loadToken, reason: "required-load-finally" });
        hideLoading();
        recordStartupStep("loadProjectData.finally.hideLoading", {
          token: loadToken,
          detail: loadedProjectName
        });
      } else {
        recordStartupStep("loadProjectData.finally.stale-skip", {
          token: loadToken,
          detail: loadedProjectName
        });
      }
    }
  })();

  activeProjectLoadPromise = loadPromise;
  activeProjectLoadProject = safeProjectName;

  try {
    const payload = await loadPromise;
    if (payload) {
      void applyOptionalProjectPayload(payload, loadToken);
    }

    return payload;
  } finally {
    if (activeProjectLoadPromise === loadPromise) {
      activeProjectLoadPromise = null;
      activeProjectLoadProject = "";
      if (activeProjectLoadToken === loadToken) {
        activeProjectLoadToken = "";
      }
    }
  }
}

/* =========================
   NAVIGATION
========================= */

function bindNavigation() {
  const navItems = Array.from(document.querySelectorAll(".nav-item[data-route]"));

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      const route = item.getAttribute("data-route") || "home";
      navigateTo(route);
    });
  });
}

function bindRouteListener() {
  window.addEventListener("mh:route-change", (event) => {
    const route = event?.detail?.route || "home";
    setCurrentRoute(route);
    renderCurrentPage();
  });
}

/* =========================
   PROJECT SWITCHER
========================= */

function bindProjectSwitcher() {
  const select = $("projectSwitcher");
  if (!select) return;

  select.addEventListener("change", async (event) => {
    const rawProjectName = event.target.value || "";

    if (!rawProjectName) {
      showError("Please select a valid project.");
      return;
    }

    const projectName = getSafeProjectName(rawProjectName);

    if (projectName !== normalizeProjectSlug(rawProjectName)) {
      showMessage(`Test project ignored. Loading ${projectName}.`);
    }

    setCurrentProject(projectName);
    await loadProjectData(projectName);
  });
}



/* =========================
   RESPONSIVE UI
========================= */

function bindResponsiveUi() {
  const sidebar = document.querySelector(".sidebar");
  const toggleBtn = $("sidebarToggleBtn");
  const backdrop = $("sidebarBackdrop");
  const appRoot = $("app");
  const commandBar = $("globalCommandBar");
  const commandToggleBtn = $("commandToggleBtn");
  const commandBackdrop = $("commandBackdrop");
  const MOBILE_BREAKPOINT = 1024;
  const MOBILE_COMPACT_BREAKPOINT = 768;

  function isMobileViewport() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  function isCompactMobileViewport() {
    return window.innerWidth <= MOBILE_COMPACT_BREAKPOINT;
  }

  function syncToggleState(isOpen) {
    if (!toggleBtn) return;
    toggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    toggleBtn.setAttribute("aria-label", isOpen ? "Close sidebar" : "Open sidebar");
  }

  function setMobileCommandExpanded(expanded) {
    if (!appRoot || !commandBar || !commandToggleBtn) return;

    if (!isCompactMobileViewport()) {
      appRoot.classList.remove("is-mobile-shell", "is-mobile-command-open");
      commandBar.classList.remove("is-collapsed");
      commandBar.setAttribute("aria-hidden", "false");
      if (commandBackdrop) {
        commandBackdrop.classList.remove("is-visible");
        commandBackdrop.setAttribute("aria-hidden", "true");
      }
      commandToggleBtn.setAttribute("aria-expanded", "false");
      commandToggleBtn.textContent = "Command";
      return;
    }

    appRoot.classList.add("is-mobile-shell");
    appRoot.classList.toggle("is-mobile-command-open", expanded);
    commandBar.classList.toggle("is-collapsed", !expanded);
    commandBar.setAttribute("aria-hidden", expanded ? "false" : "true");
    if (commandBackdrop) {
      commandBackdrop.classList.toggle("is-visible", expanded);
      commandBackdrop.setAttribute("aria-hidden", expanded ? "false" : "true");
    }
    commandToggleBtn.setAttribute("aria-expanded", expanded ? "true" : "false");
    commandToggleBtn.textContent = expanded ? "Close" : "Command";
  }

  function syncCompactShellState() {
    const isCompact = isCompactMobileViewport();
    if (!appRoot || !commandToggleBtn) return;

    appRoot.classList.toggle("is-mobile-shell", isCompact);
    commandToggleBtn.hidden = !isCompact;

    if (!isCompact) {
      setMobileCommandExpanded(false);
      return;
    }

    const isOpen = appRoot.classList.contains("is-mobile-command-open");
    setMobileCommandExpanded(isOpen);
  }

  function openSidebar() {
    if (!sidebar || !isMobileViewport()) return;
    sidebar.classList.add("is-open");
    if (backdrop) backdrop.classList.add("is-visible");
    document.body.classList.add("sidebar-open");
    document.body.style.overflow = "hidden";
    syncToggleState(true);
  }

  function closeSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove("is-open");
    if (backdrop) backdrop.classList.remove("is-visible");
    document.body.classList.remove("sidebar-open");
    document.body.style.overflow = "";
    syncToggleState(false);
  }

  syncToggleState(false);

  if (toggleBtn) {
    toggleBtn.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (sidebar?.classList.contains("is-open")) {
        closeSidebar();
      } else {
        openSidebar();
      }
    };
  }

  if (backdrop) {
    backdrop.onclick = closeSidebar;
  }

  if (commandToggleBtn) {
    commandToggleBtn.onclick = (event) => {
      event.preventDefault();
      if (!appRoot) return;
      const nextOpen = !appRoot.classList.contains("is-mobile-command-open");
      setMobileCommandExpanded(nextOpen);
    };
  }

  if (commandBackdrop) {
    commandBackdrop.onclick = () => setMobileCommandExpanded(false);
  }

  document.addEventListener("click", (event) => {
    const clickedNavItem = event.target.closest(".nav-item[data-route]");
    if (clickedNavItem && isMobileViewport()) {
      closeSidebar();
    }

    if (!isCompactMobileViewport() || !appRoot?.classList.contains("is-mobile-command-open")) {
      return;
    }

    const clickedCommandToggle = event.target.closest("#commandToggleBtn");
    const clickedInsideCommand = event.target.closest("#globalCommandBar");
    if (!clickedCommandToggle && !clickedInsideCommand) {
      setMobileCommandExpanded(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && sidebar?.classList.contains("is-open")) {
      closeSidebar();
    }
    if (event.key === "Escape" && appRoot?.classList.contains("is-mobile-command-open")) {
      setMobileCommandExpanded(false);
    }
  });

  window.addEventListener("resize", () => {
    if (!isMobileViewport()) {
      closeSidebar();
    }
    syncCompactShellState();
  });

  window.addEventListener("orientationchange", syncCompactShellState);
  syncCompactShellState();
}

function bindShellMeasurements() {
  const appRoot = $("app");
  const topbar = document.querySelector(".topbar");
  if (!appRoot || !topbar) return;

  let rafId = 0;

  const update = () => {
    rafId = 0;
    const measured = Math.max(56, Math.round(topbar.getBoundingClientRect().height || 64));
    appRoot.style.setProperty("--shell-topbar-height", `${measured}px`);
  };

  const scheduleUpdate = () => {
    if (rafId) return;
    rafId = window.requestAnimationFrame(update);
  };

  update();

  if (typeof window.ResizeObserver === "function") {
    const observer = new window.ResizeObserver(scheduleUpdate);
    observer.observe(topbar);
  }

  window.addEventListener("resize", scheduleUpdate);
  window.addEventListener("orientationchange", scheduleUpdate);
}

/* =========================
   COMMANDS & SEARCH
========================= */

function executeSearch() {
  const input = $("globalSearch");
  const query = (input?.value || "").trim().toLowerCase();
  if (!query) {
    showError("Enter a route, page name, or keyword to search.");
    return;
  }

  const navItems = Array.from(document.querySelectorAll(".nav-item[data-route]"));
  const candidates = navItems.map((item) => {
    const route = item.getAttribute("data-route") || "";
    const label = (item.textContent || "").trim();
    return {
      route,
      label,
      haystack: `${route} ${label}`.toLowerCase()
    };
  });

  const startsWith = candidates.filter((item) => item.haystack.startsWith(query));
  const includes = candidates.filter((item) => !startsWith.includes(item) && item.haystack.includes(query));
  const matches = [...startsWith, ...includes];

  if (!matches.length) {
    showError(`No route matches "${query}".`);
    return;
  }

  if (matches.length === 1) {
    navigateTo(matches[0].route);
    showMessage(`Opened ${matches[0].label}.`);
    return;
  }

  const top = matches.slice(0, 5);
  showMessage(`Matches: ${top.map((item) => item.label).join(" • ")}. Press Enter again to open ${top[0].label}.`);
  navigateTo(top[0].route);
}

function executeQuickCommand() {
  const value = $("quickCommandInput")?.value?.trim() || "";
  if (!value) {
    showError("Please enter a command first.");
    return;
  }

  navigateTo("ai-command");

  window.dispatchEvent(new CustomEvent("mh:submit-ai-command", {
    detail: {
      message: value,
      meta: {
        source: "global-quick-command"
      }
    }
  }));
}

function bindCommandInputs() {
  const searchInput = $("globalSearch");
  const commandInput = $("quickCommandInput");
  const runBtn = $("runQuickCommandBtn");
  const searchBtn = $("runSearchBtn");

  if (searchInput) {
    searchInput.value = "";
  }

  if (searchBtn) {
    searchBtn.onclick = executeSearch;
  }

  if (commandInput) {
    commandInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        executeQuickCommand();
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        executeSearch();
      }
    });
  }

  if (runBtn) {
    runBtn.textContent = "Send to AI Command";
    runBtn.onclick = executeQuickCommand;
  }
}

/* =========================
   GLOBAL BUTTONS
========================= */

function bindGlobalButtons() {
  const refreshBtn = $("refreshAllBtn");
  const openAiBtn = $("openAiBtn");
  const newCampaignBtn = $("newCampaignBtn");
  const scheduleBtn = $("scheduleBtn");

  if (refreshBtn) {
    refreshBtn.textContent = "Run Refresh";
    refreshBtn.addEventListener("click", async () => {
      const projectName = getSafeProjectName(getState().context.currentProject || DEFAULT_PROJECT_SLUG);

      if (!projectName) {
        showError("Please select a project first.");
        return;
      }

      await loadProjectData(projectName);
      navigateTo("home");
    });
  }

  if (openAiBtn) {
    openAiBtn.addEventListener("click", () => {
      navigateTo("ai-command");
    });
  }

  if (newCampaignBtn) {
    newCampaignBtn.textContent = "Open Campaign Studio";
    newCampaignBtn.addEventListener("click", () => {
      navigateTo("campaign-studio");
    });
  }

  if (scheduleBtn) {
    scheduleBtn.textContent = "Open Publishing";
    scheduleBtn.addEventListener("click", () => {
      navigateTo("publishing");
    });
  }
}



/* =========================
   INIT
========================= */

async function init() {
  try {
    recordStartupStep("init.start");
    installGlobalErrorGuards();
    bindFatalErrorPanelActions();
    clearFeedback();

    initRouter();
    setCurrentRoute("home");

    bindNavigation();
    bindRouteListener();
    bindProjectSwitcher();
    bindGlobalButtons();
    bindResponsiveUi();
    bindShellMeasurements();
    bindCommandInputs();

    injectAccessKeyButton();
    injectRoleSwitcher();

    recordStartupStep("init.initial-render");
    renderGlobalUi();
    renderCurrentPage();

    recordStartupStep("init.loadProjects.start");
    const preferredProject = await loadProjects();
    recordStartupStep("init.loadProjects.success", { detail: preferredProject || DEFAULT_PROJECT_SLUG });

    recordStartupStep("init.loadProjectData.start", { detail: preferredProject || DEFAULT_PROJECT_SLUG });
    await loadProjectData(preferredProject || DEFAULT_PROJECT_SLUG);
    recordStartupStep("init.loadProjectData.success", { detail: preferredProject || DEFAULT_PROJECT_SLUG });

    markInitialized();
    window.__mhControlCenterStarted = true;
    recordStartupStep("init.ready");

    if (!getControlWriteKey()) {
      showAccessKeyModal();
    }
  } catch (error) {
    handleStartupFatalError("init", error);
  }
}



subscribe(() => {
  renderGlobalUi();
});

window.addEventListener("DOMContentLoaded", init);

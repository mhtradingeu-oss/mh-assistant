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
  isDebugStartupMode,
  AccessKeyError,
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
  failPublishingItem,
  fetchProjectTaskCenter,
  fetchProjectQueueCenter,
  fetchProjectJobMonitor,
  fetchProjectNotificationCenter
} from "./api.js";
import {
  CONTROL_ACCESS_KEY_STORAGE_KEY,
  CONTROL_ACCESS_KEY_LEGACY_STORAGE_KEYS
} from "./constants.js";

/* =========================
   CONFIG
========================= */

setApiBaseUrl("");

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

function persistCanonicalControlKey(key) {
  const normalized = String(key || "").trim();
  if (!normalized) return;

  try {
    window.localStorage?.setItem(CONTROL_ACCESS_KEY_STORAGE_KEY, normalized);
  } catch (_) {}
}

function setRuntimeControlKey(key) {
  const normalized = String(key || "").trim();
  try {
    window.__MH_CONTROL_CENTER_READ_KEY__ = normalized;
    window.__MH_CONTROL_CENTER_WRITE_KEY__ = normalized;
    window.__MH_CONTROL_WRITE_KEY__ = normalized;
    window.__MH_CONTROL_CENTER_ACCESS_KEY__ = normalized;
    window.__MH_CONTROL_ACCESS_KEY__ = normalized;
    window.__MH_ACCESS_KEY__ = normalized;
  } catch (_) {}
}

function getControlWriteKey() {
  if (typeof window === "undefined") return "";

  const runtimeValue = [
    window.__MH_CONTROL_CENTER_READ_KEY__,
    window.__MH_CONTROL_CENTER_WRITE_KEY__,
    window.__MH_CONTROL_WRITE_KEY__,
    window.__MH_CONTROL_CENTER_ACCESS_KEY__,
    window.__MH_CONTROL_ACCESS_KEY__,
    window.__MH_ACCESS_KEY__
  ].find((value) => typeof value === "string" && value.trim()) || "";

  if (runtimeValue) {
    const normalizedRuntimeKey = runtimeValue.trim();
    persistCanonicalControlKey(normalizedRuntimeKey);
    return normalizedRuntimeKey;
  }

  try {
    const canonical = String(window.localStorage?.getItem(CONTROL_ACCESS_KEY_STORAGE_KEY) || "").trim();
    if (canonical) {
      return canonical;
    }

    const legacy = CONTROL_ACCESS_KEY_LEGACY_STORAGE_KEYS
      .map((key) => String(window.localStorage?.getItem(key) || "").trim())
      .find(Boolean) || "";

    if (legacy) {
      persistCanonicalControlKey(legacy);
    }

    return legacy;
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
      headers.set("Authorization", `Bearer ${controlKey}`);
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
        <button id="accessKeyDiagBtn" class="btn btn-secondary" type="button">Run Diagnostic</button>
        <button id="accessKeyClearBtn" class="btn btn-danger" type="button">Clear Key</button>
        <button id="accessKeyClearReloadBtn" class="btn btn-danger" type="button">Clear saved key and reload</button>
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

function getCurrentAccessKeyInputValue() {
  const input = document.getElementById("accessKeyInput");
  return String(input?.value || "").trim();
}

function collectAccessKeyDiagnostics() {
  const currentInputValue = getCurrentAccessKeyInputValue();
  const diagnostics = {
    canonicalStorageKey: CONTROL_ACCESS_KEY_STORAGE_KEY,
    canonicalValuePresent: false,
    canonicalValueLength: 0,
    currentInputPresent: Boolean(currentInputValue),
    currentInputLength: currentInputValue.length,
    runtimeSources: [],
    legacySources: [],
    resolvedKeyPresent: false,
    resolvedKeyLength: 0,
    resolvedSource: "none"
  };

  try {
    const canonical = String(localStorage.getItem(CONTROL_ACCESS_KEY_STORAGE_KEY) || "").trim();
    diagnostics.canonicalValuePresent = Boolean(canonical);
    diagnostics.canonicalValueLength = canonical.length;

    CONTROL_ACCESS_KEY_LEGACY_STORAGE_KEYS.forEach((legacyKey) => {
      const value = String(localStorage.getItem(legacyKey) || "").trim();
      if (value) {
        diagnostics.legacySources.push({ key: legacyKey, length: value.length });
      }
    });
  } catch (_) {}

  const runtimeCandidates = [
    { key: "window.__MH_CONTROL_CENTER_READ_KEY__", value: window.__MH_CONTROL_CENTER_READ_KEY__ },
    { key: "window.__MH_CONTROL_CENTER_WRITE_KEY__", value: window.__MH_CONTROL_CENTER_WRITE_KEY__ },
    { key: "window.__MH_CONTROL_WRITE_KEY__", value: window.__MH_CONTROL_WRITE_KEY__ },
    { key: "window.__MH_CONTROL_CENTER_ACCESS_KEY__", value: window.__MH_CONTROL_CENTER_ACCESS_KEY__ },
    { key: "window.__MH_CONTROL_ACCESS_KEY__", value: window.__MH_CONTROL_ACCESS_KEY__ },
    { key: "window.__MH_ACCESS_KEY__", value: window.__MH_ACCESS_KEY__ }
  ];

  runtimeCandidates.forEach((candidate) => {
    const value = String(candidate.value || "").trim();
    if (value) {
      diagnostics.runtimeSources.push({ key: candidate.key, length: value.length });
    }
  });

  const resolved = getControlWriteKey();
  diagnostics.resolvedKeyPresent = Boolean(resolved);
  diagnostics.resolvedKeyLength = String(resolved || "").length;

  if (diagnostics.runtimeSources.length) {
    diagnostics.resolvedSource = diagnostics.runtimeSources[0].key;
  } else if (diagnostics.canonicalValuePresent) {
    diagnostics.resolvedSource = `localStorage:${CONTROL_ACCESS_KEY_STORAGE_KEY}`;
  } else if (diagnostics.legacySources.length) {
    diagnostics.resolvedSource = `localStorage:${diagnostics.legacySources[0].key}`;
  }

  return diagnostics;
}

function formatAccessKeyDiagnostics(diagnostics, requestResult = null) {
  const lines = [
    "Access Key Diagnostic",
    `canonical key: ${diagnostics.canonicalStorageKey}`,
    `canonical value: ${diagnostics.canonicalValuePresent ? `present (len=${diagnostics.canonicalValueLength})` : "missing"}`,
    `current input present: ${diagnostics.currentInputPresent ? `yes (len=${diagnostics.currentInputLength})` : "no"}`,
    `legacy keys with values: ${diagnostics.legacySources.length}`,
    `runtime key globals: ${diagnostics.runtimeSources.length}`,
    `resolved by getControlWriteKey(): ${diagnostics.resolvedKeyPresent ? `present (len=${diagnostics.resolvedKeyLength})` : "missing"}`,
    `resolved source: ${diagnostics.resolvedSource}`
  ];

  if (diagnostics.legacySources.length) {
    lines.push(
      "legacy matches: " + diagnostics.legacySources.map((item) => `${item.key}(len=${item.length})`).join(", ")
    );
  }

  if (diagnostics.runtimeSources.length) {
    lines.push(
      "runtime matches: " + diagnostics.runtimeSources.map((item) => `${item.key}(len=${item.length})`).join(", ")
    );
  }

  if (requestResult) {
    lines.push(
      `probe /media-manager/projects: status=${requestResult.status || "request-failed"} auth=${requestResult.authMode}`
    );
    if (requestResult.message) {
      lines.push(`probe message: ${requestResult.message}`);
    }
  }

  return lines.join("\n");
}

async function runAccessKeyDiagnosticProbe(inputValue = "") {
  const diagnostics = collectAccessKeyDiagnostics();
  const latestInputKey = getCurrentAccessKeyInputValue();
  const explicitInputKey = String(inputValue || "").trim();
  const inputKey = latestInputKey || explicitInputKey;
  const key = inputKey || (diagnostics.canonicalValuePresent
    ? String(localStorage.getItem("mh-control-write-key") || "").trim()
    : (diagnostics.resolvedKeyPresent ? getControlWriteKey() : ""));

  if (!key) {
    return {
      diagnostics,
      type: "error",
      text: formatAccessKeyDiagnostics(diagnostics, {
        status: 0,
        authMode: "none",
        message: "No key available from input/runtime/localStorage"
      })
    };
  }

  try {
    const response = await fetch("/media-manager/projects", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "x-mh-control-key": key,
        Authorization: `Bearer ${key}`
      }
    });

    const text = formatAccessKeyDiagnostics(diagnostics, {
      status: response.status,
      authMode: "x-mh-control-key + Authorization",
      message: response.ok ? "ok" : "not-ok"
    });

    return {
      diagnostics,
      type: response.ok ? "success" : (response.status === 401 || response.status === 403 ? "error" : "warn"),
      text
    };
  } catch (error) {
    return {
      diagnostics,
      type: "error",
      text: formatAccessKeyDiagnostics(diagnostics, {
        status: 0,
        authMode: "x-mh-control-key + Authorization",
        message: error?.message || "request failed"
      })
    };
  }
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
  const diagBtn = modal.querySelector("#accessKeyDiagBtn");
  const clearBtn = modal.querySelector("#accessKeyClearBtn");
  const clearReloadBtn = modal.querySelector("#accessKeyClearReloadBtn");
  const closeBtn = modal.querySelector("#accessKeyCloseBtn");

  if (saveBtn) {
    saveBtn.addEventListener("click", async () => {
      const val = getCurrentAccessKeyInputValue();
      if (!val) {
        setAccessKeyStatus("No key entered.", "error");
        return;
      }

      try {
        localStorage.setItem("mh-control-write-key", val);
        localStorage.setItem(CONTROL_ACCESS_KEY_STORAGE_KEY, val);
        const persisted = String(localStorage.getItem("mh-control-write-key") || "").trim();
        if (persisted !== val) {
          setAccessKeyStatus("Failed to save access key to localStorage.", "error");
          return;
        }

        setRuntimeControlKey(val);
      } catch (_) {
        setAccessKeyStatus("Failed to save access key to localStorage.", "error");
        return;
      }

      setAccessKeyStatus("Key saved to mh-control-write-key. Reloading...", "success");
      updateAccessKeyButton();

      try {
        const retryProject = ["hairo", "ticmen"].join("");
        navigateTo("home");
        await loadProjectData(retryProject);
        hideAccessKeyModal();
      } catch (error) {
        setAccessKeyStatus(error?.message || "Key saved, but project load failed.", "error");
      }
    });
  }

  if (diagBtn) {
    diagBtn.addEventListener("click", async () => {
      setAccessKeyStatus("Running access-key diagnostic…", "info");
      const result = await runAccessKeyDiagnosticProbe(input?.value || "");
      setAccessKeyStatus(result.text, result.type);
    });
  }

  if (testBtn) {
    testBtn.addEventListener("click", async () => {
      setAccessKeyStatus("Testing…", "info");
      const inputVal = (input?.value || "").trim();
      let storedVal = "";
      try {
        storedVal = String(localStorage.getItem(CONTROL_ACCESS_KEY_STORAGE_KEY) || "").trim();
        if (!storedVal) {
          storedVal = CONTROL_ACCESS_KEY_LEGACY_STORAGE_KEYS
            .map((key) => String(localStorage.getItem(key) || "").trim())
            .find(Boolean) || "";
        }
      } catch (_) {}
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
              setRuntimeControlKey(inputVal);
              try {
                localStorage.setItem(CONTROL_ACCESS_KEY_STORAGE_KEY, inputVal);
              } catch (_) {}
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
      try {
        localStorage.removeItem(CONTROL_ACCESS_KEY_STORAGE_KEY);
        CONTROL_ACCESS_KEY_LEGACY_STORAGE_KEYS.forEach((legacyKey) => localStorage.removeItem(legacyKey));
      } catch (_) {}
      setRuntimeControlKey("");
      if (input) input.value = "";
      setAccessKeyStatus("Key cleared. Reads will now fail with missing-key errors.", "warn");
      updateAccessKeyButton();
    });
  }

  if (clearReloadBtn) {
    clearReloadBtn.addEventListener("click", () => {
      try {
        localStorage.removeItem(CONTROL_ACCESS_KEY_STORAGE_KEY);
        CONTROL_ACCESS_KEY_LEGACY_STORAGE_KEYS.forEach((legacyKey) => localStorage.removeItem(legacyKey));
      } catch (_) {}
      setRuntimeControlKey("");
      window.location.reload();
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

  if (!token || !isActiveProjectLoadToken(token)) {
    recordLoadingTransition("show-blocked-stale-token", { token, reason });
    return;
  }

  if (startupRuntimeState.manualUnlockActive && token === startupRuntimeState.manualUnlockToken) {
    recordLoadingTransition("show-blocked-manual-unlock", { token, reason });
    return;
  }

  if (startupRuntimeState.manualUnlockActive && token !== startupRuntimeState.manualUnlockToken) {
    recordLoadingTransition("show-blocked-manual-unlock", { token, reason });
    return;
  }

  const wasVisible = isLoadingVisible();
  const overlay = $("loadingOverlay");
  const loadingTitle = $("loadingTitle");
  const loadingText = $("loadingText");

  if (loadingTitle) loadingTitle.textContent = title;
  if (loadingText) loadingText.textContent = text;

  if (overlay) {
    overlay.hidden = false;
    overlay.style.display = "flex";
    overlay.style.opacity = "1";
    overlay.style.visibility = "visible";
    overlay.style.pointerEvents = "auto";
    overlay.classList.add("is-visible");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-loading", "loading", "loading-locked");
    installLoadingWatchdog(reason, wasVisible);
    recordLoadingTransition("show", { token, reason });
  }
}

function removeLoadingBodyClasses() {
  const body = document.body;
  if (!body) return;

  body.classList.remove("is-loading", "loading", "loading-locked", "app-loading", "app-locked");

  Array.from(body.classList).forEach((className) => {
    if (/loading|locked/i.test(className)) {
      body.classList.remove(className);
    }
  });
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
  overlay.hidden = true;
  overlay.setAttribute("aria-hidden", "true");
  overlay.style.setProperty("display", "none", "important");
  overlay.style.opacity = "0";
  overlay.style.visibility = "hidden";
  overlay.style.pointerEvents = "none";

  removeLoadingBodyClasses();

  clearLoadingWatchdog();
  startupRuntimeState.hideLoadingCalled = true;
  startupRuntimeState.hideLoadingReason = reason;
  startupRuntimeState.hideLoadingAt = new Date().toISOString();
  recordLoadingTransition(force ? "hide-force" : "hide", { token, reason });
  persistRuntimeTrace();
  return true;
}

function isLoadingVisible() {
  const overlay = $("loadingOverlay");
  if (!overlay) return false;

  const classVisible = overlay.classList.contains("is-visible");
  const ariaVisible = overlay.getAttribute("aria-hidden") === "false";
  const pointerBlocking = overlay.style.pointerEvents && overlay.style.pointerEvents !== "none";
  const displayBlocking = overlay.style.display && overlay.style.display !== "none";

  return Boolean(classVisible || ariaVisible || pointerBlocking || displayBlocking);
}

const STARTUP_UNLOCK_TIMEOUT_MS = 8000;
const LOADING_WATCHDOG_TIMEOUT_MS = STARTUP_UNLOCK_TIMEOUT_MS;
const LOADING_WATCHDOG_INTERVAL_MS = 1000;
const OVERLAY_RECOVERY_DELAY_MS = 10000;
const PARSE_WATCHDOG_TIMEOUT_MS = 2000;
const RESPONSE_TEXT_WATCHDOG_TIMEOUT_MS = 4000;
const STARTUP_STEPS_STORAGE_KEY = "mh-control-center-startup-steps";
const LAST_PROJECT_LOAD_STORAGE_KEY = "mh-control-center-last-project-load";
const LOADING_TRANSITIONS_STORAGE_KEY = "mh-control-center-loading-transitions";
const LAST_STARTUP_ERROR_STORAGE_KEY = "mh-control-center-last-startup-error";
const FETCH_DIAGNOSTICS_STORAGE_KEY = "mh-control-center-fetch-diagnostics";
const STARTUP_UNLOCK_STORAGE_KEY = "mh-control-center-startup-unlock";
const RUNTIME_TRACE_STORAGE_KEY = "mh-control-center-runtime-trace";
const LAST_CLICK_STORAGE_KEY = "mh-control-center-last-click";
const STARTUP_HISTORY_LIMIT = 60;
const LOADING_TRANSITION_LIMIT = 80;
const RUNTIME_TRACE_LIMIT = 120;
const INIT_LOAD_PROJECTS_TIMEOUT_MS = 6000;

let globalLoadingWatchdogTimer = null;
let loadingWatchdogVisibleSinceMs = 0;
let loadingWatchdogReason = "";

const startupStepHistory = [];
const loadingTransitionHistory = [];
const runtimeTraceHistory = [];

const startupDiagnostics = {
  failedEndpoints: [],
  lastErrorSource: "",
  lastErrorMessage: "",
  requestAuth: {
    keyPresent: false,
    keySource: "none",
    authHeaderPresent: false,
    accessKeyBypass: false,
    endpoint: ""
  }
};

const startupRuntimeState = {
  startupStartedAtMs: 0,
  currentProject: "",
  currentToken: "",
  projectPayloadSuccess: false,
  payloadSuccessAt: "",
  hideLoadingCalled: false,
  hideLoadingReason: "",
  hideLoadingAt: "",
  unlocked: false,
  unlockReason: "",
  unlockAt: "",
  unlockVisible: false,
  lastApiStage: "",
  lastApiStageAtMs: 0,
  lastApiMessage: "",
  lastApiEndpoint: "",
  manualUnlockActive: false,
  manualUnlockToken: "",
  initialized: false,
  initReadyAt: "",
  responseTextWatchdogUnlocked: false
};



function getOverlayState() {
  const overlay = $("loadingOverlay");
  const body = document.body;
  const overlayNodes = typeof document !== "undefined"
    ? Array.from(document.querySelectorAll("#loadingOverlay"))
    : [];

  return {
    exists: Boolean(overlay),
    count: overlayNodes.length,
    className: String(overlay?.className || ""),
    display: String(overlay?.style?.display || ""),
    visibility: String(overlay?.style?.visibility || ""),
    opacity: String(overlay?.style?.opacity || ""),
    pointerEvents: String(overlay?.style?.pointerEvents || ""),
    ariaHidden: String(overlay?.getAttribute?.("aria-hidden") || ""),
    bodyClasses: body ? body.className : ""
  };
}

function formatRuntimeTraceEntry(entry) {
  if (!entry) return "";

  const tokenText = entry.token ? ` [${entry.token}]` : "";
  const detailText = entry.detail ? ` - ${entry.detail}` : "";
  const endpointText = entry.endpoint ? ` (${entry.endpoint})` : "";
  return `${entry.at} ${entry.stage}${tokenText}${endpointText}${detailText}`;
}

function boundedTracePush(stage, details = {}) {
  const entry = {
    at: new Date().toISOString(),
    stage: String(stage || "startup.trace"),
    token: String(details.token || startupRuntimeState.currentToken || ""),
    detail: String(details.detail || details.message || ""),
    endpoint: String(details.endpoint || "")
  };

  boundedPush(runtimeTraceHistory, entry, RUNTIME_TRACE_LIMIT);
  return entry;
}

function renderStartupRuntimeTrace(cachedPayload = null) {
  const state = getState();
  const payload = cachedPayload || {
    debugStartup: isDebugStartupMode(),
    currentProject: startupRuntimeState.currentProject || state.context.currentProject || "",
    currentToken: startupRuntimeState.currentToken || "",
    payloadSuccess: Boolean(startupRuntimeState.projectPayloadSuccess),
    hideLoadingCalled: Boolean(startupRuntimeState.hideLoadingCalled),
    hideLoadingReason: String(startupRuntimeState.hideLoadingReason || ""),
    unlocked: Boolean(startupRuntimeState.unlocked),
    unlockReason: String(startupRuntimeState.unlockReason || ""),
    lastApiStage: String(startupRuntimeState.lastApiStage || ""),
    lastClick: readLastClickDiagnostic(),
    accessKeyBypass: Boolean(startupDiagnostics?.requestAuth?.accessKeyBypass),
    appLoading: Boolean(state.loading),
    overlay: getOverlayState(),
    trace: runtimeTraceHistory.slice(-20)
  };
  const panel = $("startupTracePanel");
  const meta = $("startupTraceMeta");
  const body = $("startupTraceBody");
  const unlockBar = $("startupUnlockBar");
  const unlockText = $("startupUnlockText");
  const showPanel = payload.debugStartup;
  const showUnlockBar = Boolean(startupRuntimeState.unlockVisible || startupRuntimeState.unlocked);

  if (panel) {
    panel.hidden = !showPanel;
    panel.classList.toggle("is-visible", showPanel);
    panel.setAttribute("aria-hidden", showPanel ? "false" : "true");
  }

  if (meta) {
    meta.textContent = [
      `project: ${payload.currentProject || "-"}`,
      `token: ${payload.currentToken || "-"}`,
      `appLoading: ${payload.appLoading ? "true" : "false"}`,
      `payloadSuccess: ${payload.payloadSuccess ? "true" : "false"}`,
      `hideLoadingCalled: ${payload.hideLoadingCalled ? "true" : "false"}`,
      `lastApiStage: ${payload.lastApiStage || "-"}`,
      `accessKeyBypass: ${payload.accessKeyBypass ? "true" : "false"}`,
      `overlay.className: ${payload.overlay.className || "-"}`,
      `overlay.display: ${payload.overlay.display || "-"}`,
      `overlay.pointerEvents: ${payload.overlay.pointerEvents || "-"}`,
      `overlay.aria-hidden: ${payload.overlay.ariaHidden || "-"}`,
      `body.loadingClasses: ${payload.overlay.bodyClasses || "-"}`,
      `overlay.count: ${payload.overlay.count || 0}`,
      `lastClick: ${formatLastClickSummary(payload.lastClick)}`
    ].join("\n");
  }

  if (body) {
    body.textContent = payload.trace.length
      ? payload.trace.slice(-20).map((entry) => formatRuntimeTraceEntry(entry)).join("\n")
      : "No startup events recorded yet.";
  }

  if (unlockBar) {
    unlockBar.hidden = !showUnlockBar;
    unlockBar.setAttribute("aria-hidden", showUnlockBar ? "false" : "true");
  }

  if (unlockText) {
    unlockText.textContent = startupRuntimeState.unlocked
      ? "Startup is still syncing. The interface has been unlocked."
      : "Startup is taking longer than expected. You can unlock the interface now.";
  }
}

function persistRuntimeTrace(options = {}) {
  const force = Boolean(options.force);
  const debugStartup = isDebugStartupMode();

  if (
    !force &&
    !debugStartup &&
    !startupRuntimeState.unlocked &&
    !startupRuntimeState.unlockVisible
  ) {
    return;
  }

  const state = getState();
  const payload = {
    at: new Date().toISOString(),
    debugStartup,
    currentProject: startupRuntimeState.currentProject || state.context.currentProject || "",
    currentToken: startupRuntimeState.currentToken || "",
    payloadSuccess: Boolean(startupRuntimeState.projectPayloadSuccess),
    payloadSuccessAt: String(startupRuntimeState.payloadSuccessAt || ""),
    hideLoadingCalled: Boolean(startupRuntimeState.hideLoadingCalled),
    hideLoadingReason: String(startupRuntimeState.hideLoadingReason || ""),
    hideLoadingAt: String(startupRuntimeState.hideLoadingAt || ""),
    unlocked: Boolean(startupRuntimeState.unlocked),
    unlockReason: String(startupRuntimeState.unlockReason || ""),
    unlockAt: String(startupRuntimeState.unlockAt || ""),
    lastApiStage: String(startupRuntimeState.lastApiStage || ""),
    lastApiMessage: String(startupRuntimeState.lastApiMessage || ""),
    lastApiEndpoint: String(startupRuntimeState.lastApiEndpoint || ""),
    lastClick: readLastClickDiagnostic(),
    accessKeyBypass: Boolean(startupDiagnostics?.requestAuth?.accessKeyBypass),
    appLoading: Boolean(state.loading),
    overlay: getOverlayState(),
    trace: runtimeTraceHistory.slice(-20)
  };

  safeStorageSet(RUNTIME_TRACE_STORAGE_KEY, JSON.stringify(payload));
  renderStartupRuntimeTrace(payload);
}

let runtimeTracePersistTimer = null;

function scheduleRuntimeTracePersist(force = false) {
  if (!force && !isDebugStartupMode()) {
    return;
  }

  if (runtimeTracePersistTimer) {
    clearTimeout(runtimeTracePersistTimer);
  }

  runtimeTracePersistTimer = window.setTimeout(() => {
    runtimeTracePersistTimer = null;
    persistRuntimeTrace({ force });
  }, 250);
}

function recordRuntimeTrace(stage, details = {}) {
  boundedTracePush(stage, details);
  scheduleRuntimeTracePersist(false);
}

function readLastClickDiagnostic() {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage?.getItem(LAST_CLICK_STORAGE_KEY) || "";
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch (_) {
    return null;
  }
}

function formatLastClickSummary(payload) {
  if (!payload || typeof payload !== "object") {
    return "none";
  }

  const parts = [
    payload.tag ? String(payload.tag).toLowerCase() : "",
    payload.id ? `#${payload.id}` : "",
    payload.className ? `.${String(payload.className).split(/\s+/).filter(Boolean).join(".")}` : "",
    payload.dataRoute ? `route=${payload.dataRoute}` : "",
    payload.dataPage ? `page=${payload.dataPage}` : "",
    payload.href ? `href=${payload.href}` : "",
    payload.text ? `text=${payload.text}` : ""
  ].filter(Boolean);

  return parts.join(" ") || "none";
}

function installClickDiagnosticCapture() {
  if (typeof document === "undefined" || window.__mhControlCenterClickDiagnosticInstalled) {
    return;
  }

  document.addEventListener("click", (event) => {
    const element = event.target instanceof Element
      ? event.target.closest("button, a, [data-route], [data-page], [data-action], input, select, textarea") || event.target
      : null;

    if (!element || !(element instanceof Element)) {
      return;
    }

    const payload = {
      at: new Date().toISOString(),
      tag: String(element.tagName || "").toLowerCase(),
      id: String(element.id || ""),
      className: String(element.className || "").trim(),
      text: String(element.textContent || "").trim().replace(/\s+/g, " ").slice(0, 120),
      dataRoute: String(element.getAttribute("data-route") || ""),
      dataPage: String(element.getAttribute("data-page") || ""),
      href: String(element.getAttribute("href") || "")
    };

    safeStorageSet(LAST_CLICK_STORAGE_KEY, JSON.stringify(payload));
    if (isDebugStartupMode()) {
      renderStartupRuntimeTrace();
    }
  }, { capture: true });

  window.__mhControlCenterClickDiagnosticInstalled = true;
}

function updateStartupUnlockVisibility(visible) {
  const nextVisible = Boolean(visible);
  if (startupRuntimeState.unlockVisible === nextVisible) {
    return;
  }

  startupRuntimeState.unlockVisible = nextVisible;
  recordRuntimeTrace(nextVisible ? "startup.unlock.available" : "startup.unlock.hidden", {
    detail: startupRuntimeState.currentProject || startupRuntimeState.currentToken || "startup"
  });
}

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
  const debugStartup = isDebugStartupMode();

  const banner = $("startupStepBanner");
  if (banner) {
    banner.hidden = !debugStartup;
    if (debugStartup) {
      banner.textContent = latest
        ? `Startup: ${latest.step}${latest.token ? ` [${latest.token}]` : ""}`
        : "Startup: idle";
    }
  }

  const stepsBox = $("fatalStartupSteps");
  if (stepsBox) {
    const lines = startupStepHistory.slice(-10).map((entry) => formatStepEntry(entry));
    stepsBox.textContent = lines.length ? lines.join("\n") : "No startup steps recorded yet.";
  }

  if (!debugStartup) {
    return;
  }

  patchState("data", {
    startupStep: latest?.step || "",
    startupSteps: startupStepHistory.slice(-20),
    loadingTransitions: loadingTransitionHistory.slice(-20)
  });

  scheduleRuntimeTracePersist(false);
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
  boundedTracePush(entry.step, {
    token: entry.token,
    detail: entry.detail
  });
  renderStartupStepDiagnostics();
}

function recordLoadingTransition(action, details = {}) {
  const overlay = $("loadingOverlay");
  const entry = {
    at: new Date().toISOString(),
    action: String(action || "loading.transition"),
    token: String(details.token || ""),
    reason: String(details.reason || ""),
    visible: isLoadingVisible(),
    classVisible: Boolean(overlay && overlay.classList.contains("is-visible")),
    display: String(overlay?.style?.display || ""),
    pointerEvents: String(overlay?.style?.pointerEvents || "")
  };

  boundedPush(loadingTransitionHistory, entry, LOADING_TRANSITION_LIMIT);
  safeStorageSet(LOADING_TRANSITIONS_STORAGE_KEY, JSON.stringify(loadingTransitionHistory));
  boundedTracePush(`loading.${entry.action}`, {
    token: entry.token,
    detail: `${entry.reason || ""} class=${entry.classVisible ? "visible" : "hidden"} display=${entry.display || "unset"}`,
    endpoint: "overlay"
  });
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
  const diagnostics = error?.diagnostics || {};
  safeStorageSet(LAST_STARTUP_ERROR_STORAGE_KEY, JSON.stringify({
    at: new Date().toISOString(),
    source: String(source || "startup"),
    message,
    endpoint: String(error?.endpoint || ""),
    status: error?.status || null
  }));
  safeStorageSet(FETCH_DIAGNOSTICS_STORAGE_KEY, JSON.stringify({
    at: new Date().toISOString(),
    source: String(source || "startup"),
    message,
    diagnostics: diagnostics || null,
    endpoint: String(error?.endpoint || ""),
    status: error?.status || null
  }));

  startupDiagnostics.lastErrorSource = String(source || "startup");
  startupDiagnostics.lastErrorMessage = message;
  startupDiagnostics.requestAuth = {
    keyPresent: Boolean(diagnostics?.keyPresent),
    keySource: String(diagnostics?.keySource || "none"),
    authHeaderPresent: Boolean(diagnostics?.authHeaderPresent),
    accessKeyBypass: Boolean(diagnostics?.accessKeyBypass),
    endpoint: String(diagnostics?.endpoint || error?.endpoint || "")
  };
  recordRuntimeTrace("startup.failure", {
    detail: `${String(source || "startup")}: ${message}`,
    endpoint: String(error?.endpoint || "")
  });

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
  const requestAuth = startupDiagnostics.requestAuth || {};
  const authEndpoint = String(requestAuth.endpoint || "").trim();
  if (authEndpoint || requestAuth.keyPresent || requestAuth.authHeaderPresent || requestAuth.accessKeyBypass) {
    rows.push(
      `Request auth: keyPresent=${requestAuth.keyPresent ? "true" : "false"}, ` +
      `keySource=${requestAuth.keySource || "none"}, ` +
      `authHeaderPresent=${requestAuth.authHeaderPresent ? "true" : "false"}, ` +
      `accessKeyBypass=${requestAuth.accessKeyBypass ? "true" : "false"}, ` +
      `endpoint=${authEndpoint || "unknown"}`
    );
  }
  return rows.join("\n");
}

function forceHideLoadingOverlay(reason = "access-key-recovery") {
  recordStartupStep("forceHideLoadingOverlay.start", {
    token: activeProjectLoadToken,
    detail: reason
  });
  hideLoading({ reason, force: true });

  const overlay = $("loadingOverlay");
  if (!overlay) {
    recordStartupStep("forceHideLoadingOverlay.done", {
      token: activeProjectLoadToken,
      detail: reason
    });
    return;
  }

  overlay.classList.remove("is-visible");
  overlay.hidden = true;
  overlay.setAttribute("aria-hidden", "true");
  overlay.style.setProperty("display", "none", "important");
  overlay.style.opacity = "0";
  overlay.style.visibility = "hidden";
  overlay.style.pointerEvents = "none";
  removeLoadingBodyClasses();
  clearLoadingWatchdog();
  recordRuntimeTrace("loading.force-hide", {
    token: activeProjectLoadToken,
    detail: reason,
    endpoint: "overlay"
  });
  recordStartupStep("forceHideLoadingOverlay.done", {
    token: activeProjectLoadToken,
    detail: reason
  });
}

function recordStartupUnlock(reason = "manual-unlock") {
  const payload = {
    at: new Date().toISOString(),
    reason,
    project: startupRuntimeState.currentProject || getState().context.currentProject || "",
    token: startupRuntimeState.currentToken || activeProjectLoadToken || ""
  };

  startupRuntimeState.unlocked = true;
  startupRuntimeState.unlockReason = reason;
  startupRuntimeState.unlockAt = payload.at;
  startupRuntimeState.unlockVisible = true;
  safeStorageSet(STARTUP_UNLOCK_STORAGE_KEY, JSON.stringify(payload));
  recordRuntimeTrace("startup.unlock", {
    token: payload.token,
    detail: reason
  });
}

function unlockStartupUi(reason = "manual-unlock") {
  recordStartupStep("manualUnlock.start", {
    token: activeProjectLoadToken,
    detail: reason
  });
  startupRuntimeState.manualUnlockActive = reason === "manual-unlock";
  startupRuntimeState.manualUnlockToken = activeProjectLoadToken;
  if (reason === "manual-unlock") {
    forceHideLoadingOverlay("manual-unlock");
  } else {
    forceHideLoadingOverlay(reason);
  }
  setLoading(false);
  removeLoadingBodyClasses();

  const overlay = $("loadingOverlay");
  if (overlay) {
    overlay.classList.remove("is-visible");
    overlay.setAttribute("aria-hidden", "true");
    overlay.hidden = true;
    overlay.style.setProperty("display", "none", "important");
    overlay.style.visibility = "hidden";
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";
  }

  recordStartupUnlock(reason);
  // Unlock should recover the interface quietly.
  // Do not show a persistent error after the user manually unlocks the UI.
  showMessage("Interface unlocked.");
  recordStartupStep("manualUnlock.done", {
    token: activeProjectLoadToken,
    detail: reason
  });
  renderStartupRuntimeTrace();
}

function bindStartupRecoveryControls() {
  ["startupUnlockBtn", "startupTraceUnlockBtn"].forEach((id) => {
    const button = $(id);
    if (!button || button.dataset.bound) {
      return;
    }

    button.dataset.bound = "1";
    button.addEventListener("click", () => {
      unlockStartupUi("manual-unlock");
    });
  });
}

function isMissingReadKeyMessage(message) {
  return /missing\s+read\s+key/i.test(String(message || ""));
}

function isAccessKeyStartupError(error) {
  if (Boolean(error?.diagnostics?.accessKeyBypass)) {
    return false;
  }

  const status = Number(error?.status || 0);
  const message = String(error?.message || "");
  const payloadError = String(error?.payload?.error || "");

  return (
    error instanceof AccessKeyError ||
    status === 401 ||
    status === 403 ||
    isMissingReadKeyMessage(message) ||
    isMissingReadKeyMessage(payloadError)
  );
}

function ensureFatalClearSavedKeyReloadButton() {
  const panel = $("fatalErrorPanel");
  if (!panel) return;

  const actions = panel.querySelector(".fatal-error-actions");
  if (!actions || panel.querySelector("#fatalClearSavedKeyReloadBtn")) {
    return;
  }

  const button = document.createElement("button");
  button.id = "fatalClearSavedKeyReloadBtn";
  button.className = "btn btn-danger";
  button.type = "button";
  button.textContent = "Clear saved key and reload";
  actions.appendChild(button);
}

function handleAccessKeyStartupRecovery(error, options = {}) {
  const source = String(options.source || "load-project-data");
  const loadToken = String(options.token || "");
  const message = "Project data requires a valid access key.";

  recordStartupFailure(source, error);
  recordStartupStep("loadProjectData.access-key-required", {
    token: loadToken,
    detail: String(error?.message || "missing read key")
  });

  setLoading(false);
  hideLoading({ token: loadToken, reason: "access-key-required" });
  forceHideLoadingOverlay("access-key-required-force");

  setError(message);
  showError(message);
  showMessage(message);
  setAccessKeyStatus(message, "error");

  updateAccessKeyButton();
  ensureFatalClearSavedKeyReloadButton();
  showFatalErrorPanel(message, renderStartupDiagnosticsText("access-key-required"));
  showAccessKeyModal();
}

function bindFatalErrorPanelActions() {
  const retryBtn = $("fatalRetryBtn");
  const accessKeyBtn = $("fatalAccessKeyBtn");
  const clearSavedKeyReloadBtn = $("fatalClearSavedKeyReloadBtn");

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

  if (clearSavedKeyReloadBtn && !clearSavedKeyReloadBtn.dataset.bound) {
    clearSavedKeyReloadBtn.dataset.bound = "1";
    clearSavedKeyReloadBtn.addEventListener("click", () => {
      try {
        localStorage.removeItem(CONTROL_ACCESS_KEY_STORAGE_KEY);
        CONTROL_ACCESS_KEY_LEGACY_STORAGE_KEYS.forEach((legacyKey) => localStorage.removeItem(legacyKey));
      } catch (_) {}
      window.location.reload();
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
  ensureFatalClearSavedKeyReloadButton();
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
  loadingWatchdogVisibleSinceMs = 0;
  loadingWatchdogReason = "";
  updateStartupUnlockVisibility(false);
}

function installLoadingWatchdog(reason = "project-load", preserveStart = false) {
  if (!preserveStart || !loadingWatchdogVisibleSinceMs) {
    loadingWatchdogVisibleSinceMs = Date.now();
  }
  loadingWatchdogReason = String(reason || "project-load");
}

function installGlobalLoadingWatchdog() {
  if (globalLoadingWatchdogTimer || typeof window === "undefined") {
    return;
  }

  globalLoadingWatchdogTimer = window.setInterval(() => {
    const startupAgeMs = startupRuntimeState.startupStartedAtMs
      ? Date.now() - startupRuntimeState.startupStartedAtMs
      : 0;
    const overlayVisibleMs = loadingWatchdogVisibleSinceMs
      ? Date.now() - loadingWatchdogVisibleSinceMs
      : 0;
    const apiStageAgeMs = startupRuntimeState.lastApiStageAtMs
      ? Date.now() - startupRuntimeState.lastApiStageAtMs
      : 0;
    const stalledOnResponseText = (
      startupRuntimeState.lastApiStage === "response.text.start" ||
      startupRuntimeState.lastApiStage === "api.response.text.start" ||
      startupRuntimeState.lastApiStage === "api.response.text.timeout"
    );

    if (
      isLoadingVisible() &&
      stalledOnResponseText &&
      apiStageAgeMs >= RESPONSE_TEXT_WATCHDOG_TIMEOUT_MS &&
      !startupRuntimeState.responseTextWatchdogUnlocked
    ) {
      startupRuntimeState.responseTextWatchdogUnlocked = true;
      startupRuntimeState.manualUnlockActive = true;
      startupRuntimeState.manualUnlockToken = activeProjectLoadToken;
      startupRuntimeState.projectPayloadSuccess = false;
      startupRuntimeState.payloadSuccessAt = "";

      recordStartupStep("loadProjectData.responseTextWatchdog.unlock", {
        token: activeProjectLoadToken,
        detail: "global-watchdog"
      });
      setLoading(false);
      forceHideLoadingOverlay("response-text-watchdog");
      recordStartupStep("loadProjectData.hideLoading.done", {
        token: activeProjectLoadToken,
        detail: "response-text-watchdog"
      });

      const unlockMessage = "Project response is still being processed. Interface unlocked.";
      setError(unlockMessage);
      showError(unlockMessage);
      showMessage(unlockMessage);
      void applyRequiredProjectFallback(startupRuntimeState.currentProject || DEFAULT_PROJECT_SLUG, activeProjectLoadToken);
    }

    if (!startupRuntimeState.unlocked && startupAgeMs >= STARTUP_UNLOCK_TIMEOUT_MS) {
      updateStartupUnlockVisibility(true);
    }

    if (
      isLoadingVisible() &&
      loadingWatchdogVisibleSinceMs &&
      overlayVisibleMs >= LOADING_WATCHDOG_TIMEOUT_MS
    ) {
      unlockStartupUi("global-watchdog");
    }
  }, LOADING_WATCHDOG_INTERVAL_MS);
}

function installGlobalErrorGuards() {
  if (typeof window === "undefined" || window.__mhControlCenterErrorGuardsInstalled) {
    return;
  }

  window.addEventListener("mh:control-center-api-trace", (event) => {
    const detail = event?.detail || {};
    const stage = String(detail.stage || "trace");
    const traceStage = stage.startsWith("api.") ? stage : `api.${stage}`;
    startupRuntimeState.lastApiStage = String(detail.stage || "");
    startupRuntimeState.lastApiStageAtMs = Date.now();
    startupRuntimeState.lastApiMessage = String(detail.message || "");
    startupRuntimeState.lastApiEndpoint = String(detail.endpoint || "");
    recordRuntimeTrace(traceStage, {
      token: activeProjectLoadToken,
      detail: [
        detail.message,
        detail.status ? `status=${detail.status}` : "",
        detail.bodyLength ? `bytes=${detail.bodyLength}` : ""
      ].filter(Boolean).join(" "),
      endpoint: detail.endpoint || ""
    });
  });

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
    ["aiCommandChat", "This section is currently unavailable."],
    ["aiCommandSuggestions", "No data is available yet."],
    ["aiCommandHistory", "No data is available yet."],

    ["workflowsCatalog", "No data is available yet."],

    ["campaignBuilder", "No data is available yet."],
    ["campaignWaves", "No data is available yet."],
    ["campaignAssets", "Open the related setup page to complete this section."],

    ["contentQueue", "No data is available yet."],
    ["contentPreview", "This section is currently unavailable."],

    ["mediaImages", "This section is currently unavailable."],
    ["mediaVideoAudio", "This section is currently unavailable."],
    ["mediaOutputs", "No data is available yet."],

    ["publishingCalendar", "No data is available yet."],
    ["publishingQueue", "Open the related setup page to complete this section."],
    ["publishingChannels", "Open the related setup page to complete this section."],

    ["adsBudget", "This section is currently unavailable."],
    ["adsPerformance", "This section is currently unavailable."],

    ["insightsOverview", "This section is currently unavailable."],
    ["insightsReports", "No data is available yet."],

    ["settingsProject", "Open the related setup page to complete this section."],
    ["settingsSystem", "No data is available yet."]
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
      failPublishingItem,
      fetchProjectTaskCenter,
      fetchProjectQueueCenter,
      fetchProjectJobMonitor,
      fetchProjectNotificationCenter
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

function withTimeout(promise, timeoutMs, message = "Operation timed out.") {
  let timer = null;

  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => {
      const error = new Error(message);
      error.phase = "timeout";
      error.isTimeout = true;
      reject(error);
    }, Math.max(1, Number(timeoutMs) || 1));
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timer) {
      clearTimeout(timer);
    }
  });
}

function fetchProjectWithTimeout(projectName) {
  const safeProjectName = String(projectName || "");

  recordRuntimeTrace("fetchProjectWithTimeout.request.start", {
    token: activeProjectLoadToken,
    detail: safeProjectName
  });

  let settled = false;
  let hardTimeoutTimer = null;
  let responseTextWatchdogTimer = null;
  let parseWatchdogTimer = null;

  const timeoutPromise = new Promise((_, reject) => {
    hardTimeoutTimer = setTimeout(() => {
      if (settled) return;
      const error = new Error(`Project load timed out after ${PROJECT_LOAD_TIMEOUT_MS / 1000}s.`);
      error.phase = "timeout";
      error.isTimeout = true;
      reject(error);
    }, PROJECT_LOAD_TIMEOUT_MS);
  });

  const responseTextWatchdogPromise = new Promise((_, reject) => {
    responseTextWatchdogTimer = setTimeout(() => {
      if (settled) return;

      const isBodyReadStage = (
        startupRuntimeState.lastApiStage === "response.text.start" ||
        startupRuntimeState.lastApiStage === "api.response.text.start" ||
        startupRuntimeState.lastApiStage === "api.response.text.timeout"
      );

      if (!isBodyReadStage) {
        return;
      }

      recordRuntimeTrace("fetchProjectWithTimeout.response-text-watchdog", {
        token: activeProjectLoadToken,
        detail: safeProjectName
      });

      const error = new Error("Project response is still being processed.");
      error.phase = "response-text-watchdog";
      error.isResponseTextWatchdog = true;
      error.endpoint = startupRuntimeState.lastApiEndpoint || "";
      reject(error);
    }, RESPONSE_TEXT_WATCHDOG_TIMEOUT_MS);
  });

  const parseWatchdogPromise = new Promise((_, reject) => {
    let parseWatchdogStartedAt = 0;
    parseWatchdogTimer = setInterval(() => {
      if (settled) {
        return;
      }

      const lastStage = String(startupRuntimeState.lastApiStage || "");
      const parseHasStarted = (
        lastStage === "response.text.done" ||
        lastStage === "api.response.text.done" ||
        lastStage === "api.response.parse.start"
      );

      if (!parseHasStarted) {
        parseWatchdogStartedAt = 0;
        return;
      }

      if (!parseWatchdogStartedAt) {
        parseWatchdogStartedAt = Date.now();
        return;
      }

      if (Date.now() - parseWatchdogStartedAt < PARSE_WATCHDOG_TIMEOUT_MS) {
        return;
      }

      recordRuntimeTrace("fetchProjectWithTimeout.parse-watchdog", {
        token: activeProjectLoadToken,
        detail: safeProjectName
      });

      const error = new Error("Project response was received but could not be processed.");
      error.phase = "parse-watchdog";
      error.isParseWatchdog = true;
      error.endpoint = startupRuntimeState.lastApiEndpoint || "";
      reject(error);
    }, 100);
  });

  const requiredLoadPromise = Promise.race([fetchAllCoreProjectData(safeProjectName), timeoutPromise]);

  return Promise.race([
    requiredLoadPromise,
    responseTextWatchdogPromise,
    parseWatchdogPromise
  ]).then((payload) => {
    settled = true;
    if (!payload || payload.error) {
      const error = new Error(payload?.error || `Project ${safeProjectName} returned an empty response.`);
      error.phase = "payload";
      throw error;
    }

    startupRuntimeState.projectPayloadSuccess = true;
    startupRuntimeState.payloadSuccessAt = new Date().toISOString();

    recordRuntimeTrace("fetchProjectWithTimeout.success", {
      token: activeProjectLoadToken,
      detail: safeProjectName
    });

    return payload;
  }).catch((error) => {
    settled = true;
    const nextError = error instanceof Error ? error : new Error(String(error || "Project fetch failed"));

    const parseStage = String(nextError?.diagnostics?.parseStage || nextError?.parseStage || "");

    if (!nextError.phase && parseStage.includes("response.text.timeout")) {
      nextError.phase = "response-text-watchdog";
      nextError.isResponseTextWatchdog = true;
      recordRuntimeTrace("fetchProjectWithTimeout.response-text-watchdog", {
        token: activeProjectLoadToken,
        detail: safeProjectName
      });
    }

    if (
      !nextError.phase &&
      (
        parseStage.includes("api.response.parse") ||
        parseStage.includes("api.response.json.fallback")
      )
    ) {
      nextError.phase = "parse-watchdog";
      nextError.isParseWatchdog = true;
      recordRuntimeTrace("fetchProjectWithTimeout.parse-watchdog", {
        token: activeProjectLoadToken,
        detail: safeProjectName
      });
    }

    if (!nextError.phase) {
      nextError.phase = nextError.isTimeout
        ? "timeout"
        : isAccessKeyStartupError(nextError)
          ? "access-key"
          : "payload";
    }

    recordRuntimeTrace("fetchProjectWithTimeout.error", {
      token: activeProjectLoadToken,
      detail: `${nextError.phase}: ${nextError.message}`,
      endpoint: nextError.endpoint || ""
    });

    throw nextError;
  }).finally(() => {
    settled = true;
    if (hardTimeoutTimer) {
      clearTimeout(hardTimeoutTimer);
    }
    if (responseTextWatchdogTimer) {
      clearTimeout(responseTextWatchdogTimer);
    }
    if (parseWatchdogTimer) {
      clearInterval(parseWatchdogTimer);
    }
  });
}

function validateRequiredProjectPayload(payload, projectName) {
  if (!payload || typeof payload !== "object") {
    throw new Error(`Project ${projectName} returned an invalid payload.`);
  }

  const requiredSections = ["overview", "readiness", "assets"];
  const missing = requiredSections.filter((section) => payload?.[section] == null);

  if (missing.length) {
    throw new Error(`Project ${projectName} missing required sections: ${missing.join(", ")}.`);
  }
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

async function applyRequiredProjectFallback(projectName, loadToken = "", fallbackDetails = null) {
  recordStartupStep("loadProjectData.requiredFallback.start", {
    token: loadToken,
    detail: projectName
  });

  let fallback = fallbackDetails;

  if (!fallback) {
    try {
      const projectsResult = await fetchProjects();
      const items = Array.isArray(projectsResult?.items) ? projectsResult.items : [];
      const projectExists = items.some((item) => {
        const name = typeof item === "string" ? item : item?.name;
        return String(name || "").trim() === projectName;
      });

      fallback = {
        endpoint: "/media-manager/projects",
        verified: true,
        projectExists,
        projectName,
        warning: "Project details are still syncing."
      };
    } catch (fallbackError) {
      fallback = {
        endpoint: "/media-manager/projects",
        verified: false,
        projectExists: false,
        projectName,
        warning: "Project details are still syncing.",
        message: String(fallbackError?.message || "Failed to verify project fallback")
      };
    }
  }

  const fallbackProjectName = fallback?.projectExists
    ? getSafeProjectName(projectName || DEFAULT_PROJECT_SLUG)
    : DEFAULT_PROJECT_SLUG;

  setCurrentProject(fallbackProjectName);
  setStoredProjectName(fallbackProjectName);
  setProjectContext({
    project: fallbackProjectName,
    market: "",
    language: "",
    mode: "",
    campaign: "Not selected yet"
  });

  patchState("data", {
    loadDiagnostics: {
      ...(getState().data?.loadDiagnostics || {}),
      requiredFallback: fallback
    }
  });

  setError("Project details are still syncing.");
  showError("Project details are still syncing.");
  showMessage("Project details are still syncing.");

  renderGlobalUi();
  await safeRenderCurrentPage("[LOAD_PROJECT_REQUIRED_FALLBACK_RENDER]");

  recordStartupStep("loadProjectData.requiredFallback.done", {
    token: loadToken,
    detail: `${fallbackProjectName} verified=${fallback?.verified ? "true" : "false"}`
  });
}

function scheduleOverlayRecoveryCheck(loadToken, projectName, loadStartedAtMs, didRequiredLoadSucceed) {
  const startedAt = Number(loadStartedAtMs) || Date.now();
  const elapsedMs = Math.max(0, Date.now() - startedAt);
  const delayMs = Math.max(0, OVERLAY_RECOVERY_DELAY_MS - elapsedMs);

  setTimeout(() => {
    if (!isActiveProjectLoadToken(loadToken)) {
      return;
    }

    const requiredSucceeded = typeof didRequiredLoadSucceed === "function"
      ? Boolean(didRequiredLoadSucceed())
      : Boolean(didRequiredLoadSucceed);

    if (!requiredSucceeded) {
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
  }, delayMs);
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
        if (entry?.warning) {
          recordStartupStep("loadProjectData.optional.warning", {
            token: loadToken,
            detail: String(entry?.message || entry?.section || "Optional warning")
          });
          return;
        }

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
  startupRuntimeState.currentToken = loadToken;
  startupRuntimeState.currentProject = safeProjectName;
  startupRuntimeState.projectPayloadSuccess = false;
  startupRuntimeState.payloadSuccessAt = "";
  startupRuntimeState.hideLoadingCalled = false;
  startupRuntimeState.hideLoadingReason = "";
  startupRuntimeState.hideLoadingAt = "";
  startupRuntimeState.unlocked = false;
  startupRuntimeState.unlockReason = "";
  startupRuntimeState.unlockAt = "";
  startupRuntimeState.startupStartedAtMs = Date.now();
  startupRuntimeState.unlockVisible = false;
  startupRuntimeState.manualUnlockActive = false;
  startupRuntimeState.manualUnlockToken = "";
  startupRuntimeState.responseTextWatchdogUnlocked = false;

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
    const loadStartedAtMs = Date.now();
    let requiredPayloadSucceeded = false;

    scheduleOverlayRecoveryCheck(loadToken, loadedProjectName, loadStartedAtMs, () => requiredPayloadSucceeded);

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

      recordStartupStep("loadProjectData.payload.validate.start", {
        token: loadToken,
        detail: loadedProjectName
      });
      validateRequiredProjectPayload(payload, loadedProjectName);
      recordStartupStep("loadProjectData.payload.validate.done", {
        token: loadToken,
        detail: loadedProjectName
      });

      const requestAuthDiagnostics = payload?._diagnostics?.requestAuth || null;
      if (requestAuthDiagnostics) {
        startupDiagnostics.requestAuth = {
          keyPresent: Boolean(requestAuthDiagnostics?.keyPresent),
          keySource: String(requestAuthDiagnostics?.keySource || "none"),
          authHeaderPresent: Boolean(requestAuthDiagnostics?.authHeaderPresent),
          accessKeyBypass: Boolean(requestAuthDiagnostics?.accessKeyBypass),
          endpoint: String(requestAuthDiagnostics?.endpoint || "")
        };
      }

      recordStartupStep("loadProjectData.applyPayload.start", {
        token: loadToken,
        detail: loadedProjectName
      });
      const applied = applyProjectPayload(loadedProjectName, payload, loadToken);
      recordStartupStep("loadProjectData.applyPayload.done", {
        token: loadToken,
        detail: loadedProjectName
      });
      if (!applied) {
        return null;
      }

      requiredPayloadSucceeded = true;
      startupRuntimeState.projectPayloadSuccess = true;
      startupRuntimeState.payloadSuccessAt = new Date().toISOString();
      recordStartupStep("loadProjectData.required.done", {
        token: loadToken,
        detail: loadedProjectName
      });

      setLoading(false);
      hideLoading({ token: loadToken, reason: "required-load-done" });
      hideLoading({ token: loadToken, reason: "required-load-done-hard-clear", force: true });
      recordStartupStep("loadProjectData.hideLoading.done", {
        token: loadToken,
        detail: loadedProjectName
      });

      recordStartupStep("loadProjectData.renderGlobalUi.start", {
        token: loadToken,
        detail: loadedProjectName
      });
      try {
        renderGlobalUi();
      } catch (renderGlobalError) {
        recordStartupFailure("load-project-render-global-ui", renderGlobalError);
        setLoading(false);
        forceHideLoadingOverlay("render-global-ui-error");
        const renderMessage = renderGlobalError?.message || "Failed to render global UI.";
        setError(renderMessage);
        showError(renderMessage);
        showFatalErrorPanel(renderMessage, renderStartupDiagnosticsText("renderGlobalUi"));
        recordStartupStep("loadProjectData.renderGlobalUi.error", {
          token: loadToken,
          detail: String(renderMessage)
        });
        return payload;
      }
      recordStartupStep("loadProjectData.renderGlobalUi.done", {
        token: loadToken,
        detail: loadedProjectName
      });

      recordStartupStep("loadProjectData.safeRenderCurrentPage.start", {
        token: loadToken,
        detail: loadedProjectName
      });
      try {
        const rendered = await safeRenderCurrentPage();
        if (!rendered) {
          throw new Error("Failed to render current page.");
        }
      } catch (pageRenderError) {
        recordStartupFailure("load-project-safe-render-current-page", pageRenderError);
        setLoading(false);
        forceHideLoadingOverlay("safe-render-current-page-error");
        const renderMessage = pageRenderError?.message || "Failed to render current page.";
        setError(renderMessage);
        showError(renderMessage);
        showFatalErrorPanel(renderMessage, renderStartupDiagnosticsText("safeRenderCurrentPage"));
        recordStartupStep("loadProjectData.safeRenderCurrentPage.error", {
          token: loadToken,
          detail: String(renderMessage)
        });
        return payload;
      }
      recordStartupStep("loadProjectData.safeRenderCurrentPage.done", {
        token: loadToken,
        detail: loadedProjectName
      });

      showMessage(`Loaded project: ${loadedProjectName}`);
      return payload;
    } catch (error) {
      console.error("[LOAD_PROJECT_ERROR]", error);

      if (error?.phase === "response-text-watchdog" || error?.isResponseTextWatchdog) {
        recordStartupStep("loadProjectData.responseTextWatchdog.unlock", {
          token: loadToken,
          detail: String(error?.message || "response-text-watchdog")
        });

        startupRuntimeState.manualUnlockActive = true;
        startupRuntimeState.manualUnlockToken = loadToken;
        startupRuntimeState.responseTextWatchdogUnlocked = true;
        startupRuntimeState.projectPayloadSuccess = false;
        startupRuntimeState.payloadSuccessAt = "";
        setLoading(false);
        forceHideLoadingOverlay("response-text-watchdog");
        recordStartupStep("loadProjectData.hideLoading.done", {
          token: loadToken,
          detail: "response-text-watchdog"
        });

        const unlockMessage = "Project response is still being processed. Interface unlocked.";
        setError(unlockMessage);
        showError(unlockMessage);
        showMessage(unlockMessage);

        await applyRequiredProjectFallback(
          loadedProjectName,
          loadToken,
          error?._requiredProjectFallback || error?._diagnostics?.requiredProjectFallback || null
        );
        return null;
      }

      if (error?.phase === "parse-watchdog" || error?.isParseWatchdog) {
        recordStartupStep("loadProjectData.parse-watchdog", {
          token: loadToken,
          detail: String(error?.message || "parse-watchdog")
        });
        setLoading(false);
        forceHideLoadingOverlay("parse-watchdog");
        const warning = "Project response was received but could not be processed.";
        setError(warning);
        showError(warning);
        showMessage(warning);
        renderGlobalUi();
        await safeRenderCurrentPage("[LOAD_PROJECT_PARSE_WATCHDOG_RENDER_FALLBACK]");
        return null;
      }

      if (isAccessKeyStartupError(error)) {
        handleAccessKeyStartupRecovery(error, {
          source: "load-project-data",
          token: loadToken
        });
        return null;
      }

      recordStartupFailure("load-project-data", error);
      setLoading(false);
      forceHideLoadingOverlay(`load-project-error-${String(error?.phase || "unknown")}`);
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
      showFatalErrorPanel(
        error.message || "Failed to load project data",
        renderStartupDiagnosticsText("load-project-data")
      );
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
        hideLoading({ token: loadToken, reason: "required-load-finally-hard-clear", force: true });
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

  /*
   * Optional project payload is intentionally deferred.
   * The required startup payload renders the page first; optional sections
   * can be restored later with route-level lazy loading to avoid startup
   * render pressure.
   */

  return payload;
} finally {

    if (activeProjectLoadPromise === loadPromise) {
      activeProjectLoadPromise = null;
      activeProjectLoadProject = "";
    }
  }
}

/* =========================
   NAVIGATION
========================= */

function bindNavigation() {
  const fallbackLabelRoutes = {
    Home: "home",
    Setup: "setup",
    Library: "library",
    Integrations: "integrations",
    "AI Command": "ai-command",
    Workflows: "workflows",
    Publishing: "publishing"
  };

  const navItems = Array.from(document.querySelectorAll(".nav-item"));
  navItems.forEach((item) => {
    const labeledRoute = fallbackLabelRoutes[String(item.textContent || "").trim()] || "";
    const route = item.getAttribute("data-route") || labeledRoute;
    if (!route) return;
    item.setAttribute("data-route", route);
    item.setAttribute("data-page", route);
  });
}

function bindDelegatedClickRouting() {
  if (typeof document === "undefined" || window.__mhControlCenterDelegatedClickBound) {
    return;
  }



  const actionRouteMap = {
    "open-ai-command": "ai-command",
    "open-campaign-studio": "campaign-studio",
    "open-publishing": "publishing",
    "send-ai-command": "ai-command"
  };

  async function executeMappedAction(actionName) {
    if (!actionName) return false;

    if (actionName === "search") {
      if (typeof executeSearch === "function") {
        executeSearch();
      } else {
        showMessage("Search handler is not available.");
      }
      return true;
    }

    if (actionName === "refresh-project") {
      const projectName = getSafeProjectName(getState().context.currentProject || DEFAULT_PROJECT_SLUG);
      if (!projectName) {
        showError("Please select a project first.");
        return true;
      }

      await loadProjectData(projectName);
      navigateTo("home");
      return true;
    }

    if (actionName === "send-ai-command") {
      if (typeof executeQuickCommand === "function") {
        executeQuickCommand();
      } else {
        navigateTo("ai-command");
        showMessage("AI Command opened.");
      }
      return true;
    }

    const targetRoute = actionRouteMap[actionName];
    if (targetRoute) {
      navigateTo(targetRoute);
      return true;
    }

    return false;
  }

  document.addEventListener("click", (event) => {
    const candidate = event.target instanceof Element
      ? event.target.closest("button, a, [data-route], [data-page], [data-action]")
      : null;
    if (!candidate) {
      return;
    }

    const routeAttr = String(candidate.getAttribute("data-route") || candidate.getAttribute("data-page") || "").trim();
    if (routeAttr) {
      event.preventDefault();
      navigateTo(routeAttr);
      return;
    }

    const inferredAction =
      String(candidate.getAttribute("data-action") || "").trim() ||
      (candidate.closest("#refreshAllBtn") ? "refresh-project" : "") ||
      (candidate.closest("#openAiBtn") ? "open-ai-command" : "") ||
      (candidate.closest("#runSearchBtn") ? "search" : "") ||
      (candidate.closest("#runQuickCommandBtn") ? "send-ai-command" : "") ||
      (candidate.closest("#newCampaignBtn") ? "open-campaign-studio" : "") ||
      (candidate.closest("#scheduleBtn") ? "open-publishing" : "");

    if (!inferredAction) {
      return;
    }

    event.preventDefault();
    void executeMappedAction(inferredAction).catch((error) => {
      console.error("[DELEGATED_CLICK_ACTION_ERROR]", inferredAction, error);
      showError(error?.message || "Action failed.");
    });
  });

  window.__mhControlCenterDelegatedClickBound = true;
}

function bindRouteListener() {
  window.addEventListener("mh:route-change", (event) => {
    const route = event?.detail?.route || "home";
    setCurrentRoute(route);
    renderCurrentPage();
  });

  // Back/Forward support — hashchange fires when the user navigates browser history
  window.addEventListener("hashchange", () => {
    const route = (location.hash.slice(1) || "home").trim();
    if (route && route !== getState().currentRoute) {
      navigateTo(route);
    }
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

  const measured = Math.max(56, Math.round(topbar.getBoundingClientRect().height || 64));
  appRoot.style.setProperty("--shell-topbar-height", `${measured}px`);
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
    searchBtn.setAttribute("data-action", "search");
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
    runBtn.setAttribute("data-action", "send-ai-command");
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
    refreshBtn.setAttribute("data-action", "refresh-project");
  }

  if (openAiBtn) {
    openAiBtn.setAttribute("data-action", "open-ai-command");
  }

  if (newCampaignBtn) {
    newCampaignBtn.textContent = "Open Campaign Studio";
    newCampaignBtn.setAttribute("data-action", "open-campaign-studio");
  }

  if (scheduleBtn) {
    scheduleBtn.textContent = "Open Publishing";
    scheduleBtn.setAttribute("data-action", "open-publishing");
  }
}



/* =========================
   INIT
========================= */

async function init() {
  try {
    startupRuntimeState.startupStartedAtMs = Date.now();
    recordStartupStep("init.start");
    installGlobalErrorGuards();
    installGlobalLoadingWatchdog();
    bindFatalErrorPanelActions();
    bindStartupRecoveryControls();
    installClickDiagnosticCapture();
    clearFeedback();

    initRouter();
    // Restore the route from the URL hash on refresh or deep-link
    const startRoute = (location.hash.slice(1) || "home").trim();
    setCurrentRoute(startRoute || "home");

    bindNavigation();
    bindDelegatedClickRouting();
    bindRouteListener();
    bindProjectSwitcher();
    bindGlobalButtons();
    bindResponsiveUi();
    bindShellMeasurements();
    bindCommandInputs();

    injectAccessKeyButton();
    if (
      window.__MH_DEV_MODE__ === true ||
      location.hostname === "localhost" ||
      location.hostname === "127.0.0.1"
    ) {
      injectRoleSwitcher();
    }

    recordStartupStep("init.initial-render");
    renderGlobalUi();
    renderCurrentPage();

    recordStartupStep("init.loadProjects.start");
    const projectsPromise = loadProjects();
    projectsPromise.catch(() => {});

    const preferredProject = await Promise.race([
      projectsPromise,
      new Promise((resolve) => {
        window.setTimeout(() => resolve(""), INIT_LOAD_PROJECTS_TIMEOUT_MS);
      })
    ]);

    if (preferredProject) {
      recordStartupStep("init.loadProjects.success", { detail: preferredProject || DEFAULT_PROJECT_SLUG });
    } else {
      recordStartupStep("init.loadProjects.timeout", { detail: `${INIT_LOAD_PROJECTS_TIMEOUT_MS}ms` });
      showMessage("Project list is still syncing. Continuing with default project.");
    }

    recordStartupStep("init.loadProjectData.start", { detail: preferredProject || DEFAULT_PROJECT_SLUG });
    await loadProjectData(preferredProject || DEFAULT_PROJECT_SLUG);
    recordStartupStep("init.loadProjectData.success", { detail: preferredProject || DEFAULT_PROJECT_SLUG });

    markInitialized();
    startupRuntimeState.initialized = true;
    startupRuntimeState.initReadyAt = new Date().toISOString();
    updateStartupUnlockVisibility(false);
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

  if (isDebugStartupMode()) {
    scheduleRuntimeTracePersist(false);
  }
});

window.addEventListener("DOMContentLoaded", init);

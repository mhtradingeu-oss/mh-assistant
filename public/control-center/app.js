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

  const runtimeValue = typeof window.__MH_CONTROL_WRITE_KEY__ === "string"
    ? window.__MH_CONTROL_WRITE_KEY__.trim()
    : "";

  if (runtimeValue) {
    return runtimeValue;
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

function bindAccessKeyPanel(modal) {
  const input = modal.querySelector("#accessKeyInput");
  const saveBtn = modal.querySelector("#accessKeySaveBtn");
  const testBtn = modal.querySelector("#accessKeyTestBtn");
  const clearBtn = modal.querySelector("#accessKeyClearBtn");
  const closeBtn = modal.querySelector("#accessKeyCloseBtn");

  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
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
      setAccessKeyStatus("Key saved. Use Test Key to verify access.", "success");
      updateAccessKeyButton();
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
          setAccessKeyStatus("Valid key — endpoint returned OK.", "success");
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
  text = "Please wait while the system loads the workspace."
) {
  const overlay = $("loadingOverlay");
  const loadingTitle = $("loadingTitle");
  const loadingText = $("loadingText");

  if (loadingTitle) loadingTitle.textContent = title;
  if (loadingText) loadingText.textContent = text;

  if (overlay) {
    overlay.classList.add("is-visible");
    overlay.setAttribute("aria-hidden", "false");
  }
}

function hideLoading() {
  const overlay = $("loadingOverlay");
  if (!overlay) return;

  overlay.classList.remove("is-visible");
  overlay.setAttribute("aria-hidden", "true");
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

  const currentValue = state.context.currentProject || "";
  const items = Array.isArray(state.data.projects) ? state.data.projects : [];

  select.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select project";
  select.appendChild(defaultOption);

  items.forEach((item) => {
    const projectName = typeof item === "string" ? item : item?.name;
    if (!projectName) return;

    const option = document.createElement("option");
    option.value = projectName;
    option.textContent = projectName;
    select.appendChild(option);
  });

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

/* =========================
   DATA LOAD
========================= */

async function loadProjects() {
  const result = await fetchProjects();
  const items = Array.isArray(result?.items) ? result.items : [];

  setProjects(items);

  const preferred =
    result?.preferredProject ||
    (items.length
      ? (typeof items[0] === "string" ? items[0] : items[0]?.name || "")
      : "");

  if (preferred) {
    setCurrentProject(preferred);
  }

  renderProjectSwitcher();
  return preferred;
}

async function loadProjectData(projectName) {
  if (!projectName) return;

  setLoading(true);
  clearError();
  clearFeedback();
  resetProjectData();

  showLoading("Loading project", `Please wait while ${projectName} is being loaded.`);

  try {
    const payload = await fetchAllCoreProjectData(projectName);

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
      overview: payload?.overview || {},
      readiness: payload?.readiness || {},
      assets: payload?.assets || {},
      tree: payload?.tree || {},
      registry: payload?.registry || {},
      integrations: payload?.connectors || {},
      activity: payload?.activity || {},
      operations: payload?.operations || null
    });

    if (!payload?.operations) {
      try {
        const operations = await fetchProjectOperations(projectName);
        patchState("data", { operations });
      } catch (opsError) {
        console.warn("Failed to load operations snapshot:", opsError?.message || opsError);
      }
    }

    const overviewData = payload?.overview?.overview || {};

    setProjectContext({
      project: projectName,
      market: overviewData.market || "",
      language: overviewData.language || "",
      mode: overviewData.execution_mode || "",
      campaign: inferredCampaign
    });

    try {
      renderGlobalUi();
      renderCurrentPage();
    } catch (renderError) {
      console.error("Project loaded, but render failed:", renderError);
      setError(renderError?.message || "Project loaded, but the page failed to render.");
      showError(renderError?.message || "Project loaded, but the page failed to render.");
    }

    showMessage(`Loaded project: ${projectName}`);
  } catch (error) {
    console.error("Failed to load project data:", error);

    setError(error?.message || "Failed to load project data");
    showError(error?.message || "Failed to load project data");

    patchState("data", {
      overview: {},
      readiness: {},
      assets: {},
      tree: {},
      registry: {},
      integrations: {},
      activity: {},
      operations: null
    });

    setProjectContext({
      project: projectName,
      market: "",
      language: "",
      mode: "",
      campaign: "Not selected yet"
    });

    try {
      renderGlobalUi();
      renderCurrentPage();
    } catch (renderError) {
      console.error("Fallback render failed:", renderError);
    }
  } finally {
    try {
      setLoading(false);
      hideLoading();
    } catch (cleanupError) {
      console.error("Failed to hide loading overlay:", cleanupError);
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
    const projectName = event.target.value || "";
    setCurrentProject(projectName);

    if (!projectName) {
      showError("Please select a valid project.");
      return;
    }

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
      const projectName = getState().context.currentProject;
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

    renderGlobalUi();
    renderCurrentPage();

    const preferredProject = await loadProjects();

    if (preferredProject) {
      await loadProjectData(preferredProject);
    }

    markInitialized();

    // Show access key panel if no key is stored — must run after DOM is ready
    if (!getControlWriteKey()) {
      showAccessKeyModal();
    }
  } catch (error) {
    console.error(error);
    setError(error.message || "Application initialization failed");
    showError(error.message || "Application initialization failed");
  }
}

subscribe(() => {
  renderGlobalUi();
});

window.addEventListener("DOMContentLoaded", init);

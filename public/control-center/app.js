// public/control-center/app.js

import {
  initRouter,
  navigateTo,
  renderRouteTemplate,
  getRouteDefinition
} from "./router.js";
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

/* =========================
   DOM HELPERS
========================= */

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

  setText("ctxProject", ctx.currentProject);
  setText("ctxMarket", ctx.currentMarket);
  setText("ctxMode", ctx.executionMode);
  setText("ctxCampaign", ctx.activeCampaign);
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
    return;
  }

  renderPlaceholders();
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
      overview: payload.overview,
      readiness: payload.readiness,
      assets: payload.assets,
      tree: payload.tree,
      registry: payload.registry,
      integrations: payload.connectors,
      activity: payload.activity,
      operations: payload.operations
    });

    if (!payload.operations) {
      try {
        const operations = await fetchProjectOperations(projectName);
        patchState("data", {
          operations
        });
      } catch (opsError) {
        console.warn("Failed to load operations snapshot:", opsError.message);
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

    renderGlobalUi();
    renderCurrentPage();

    showMessage(`Loaded project: ${projectName}`);
  } catch (error) {
    console.error(error);
    setError(error.message || "Failed to load project data");
    showError(error.message || "Failed to load project data");
  } finally {
    setLoading(false);
    hideLoading();
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

  function openSidebar() {
    if (!sidebar) return;
    sidebar.classList.add("is-open");
    if (backdrop) backdrop.classList.add("is-visible");
    document.body.style.overflow = "hidden";
  }

  function closeSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove("is-open");
    if (backdrop) backdrop.classList.remove("is-visible");
    document.body.style.overflow = "";
  }

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

  document.addEventListener("click", (event) => {
    const clickedNavItem = event.target.closest(".nav-item[data-route]");
    if (clickedNavItem && window.innerWidth <= 980) {
      closeSidebar();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) {
      closeSidebar();
    }
  });
}

/* =========================
   COMMANDS & SEARCH
========================= */

function executeSearch() {
  showMessage("Search is not available yet");
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
    searchInput.placeholder = "Search not available yet";
    searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        executeSearch();
      }
    });
  }

  if (commandInput) {
    commandInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        executeQuickCommand();
      }
    });
  }

  if (runBtn) {
    runBtn.textContent = "Send to AI Command";
    runBtn.onclick = executeQuickCommand;
  }

  if (searchBtn) {
    searchBtn.textContent = "Search Unavailable";
    searchBtn.onclick = executeSearch;
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
    bindCommandInputs();

    renderGlobalUi();
    renderCurrentPage();

    const preferredProject = await loadProjects();

    if (preferredProject) {
      await loadProjectData(preferredProject);
    }

    markInitialized();
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

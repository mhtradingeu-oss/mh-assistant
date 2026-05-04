// public/control-center/state.js

const state = {
  initialized: false,

  loading: false,
  error: "",

  currentRoute: "home",

  context: {
    currentProject: "",
    currentMarket: "",
    currentLanguage: "",
    executionMode: "",
    activeCampaign: ""
  },

  data: {
    projects: [],
    overview: null,
    readiness: null,
    assets: null,
    tree: null,
    registry: null,
    integrations: null,
    activity: null,
    operations: null,
    loadDiagnostics: null
  }
};

const listeners = new Set();

function notify() {
  listeners.forEach((listener) => {
    try {
      listener(getState());
    } catch (error) {
      console.error("State listener failed:", error);
    }
  });
}

export function getState() {
  return state;
}

export function subscribe(listener) {
  if (typeof listener !== "function") {
    return () => {};
  }

  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function markInitialized() {
  state.initialized = true;
  notify();
}

export function setLoading(value) {
  state.loading = Boolean(value);
  notify();
}

export function setError(message) {
  state.error = message || "";
  notify();
}

export function clearError() {
  state.error = "";
  notify();
}

export function setProjects(projects) {
  state.data.projects = Array.isArray(projects) ? projects : [];
  notify();
}

export function setCurrentProject(projectName) {
  state.context.currentProject = projectName || "";
  notify();
}

export function setCurrentRoute(route) {
  state.currentRoute = route || "home";
  notify();
}

export function setProjectContext({
  project = "",
  market = "",
  language = "",
  mode = "",
  campaign = ""
} = {}) {
  state.context.currentProject = project;
  state.context.currentMarket = market;
  state.context.currentLanguage = language;
  state.context.executionMode = mode;
  state.context.activeCampaign = campaign;
  notify();
}

export function patchState(section, patch) {
  if (!section || typeof patch !== "object" || patch == null) {
    return;
  }

  if (section === "data") {
    state.data = {
      ...state.data,
      ...patch
    };
    notify();
    return;
  }

  if (section === "context") {
    state.context = {
      ...state.context,
      ...patch
    };
    notify();
    return;
  }

  if (typeof state[section] === "object" && state[section] !== null) {
    state[section] = {
      ...state[section],
      ...patch
    };
    notify();
    return;
  }

  state[section] = patch;
  notify();
}

export function resetProjectData() {
  state.data.overview = null;
  state.data.readiness = null;
  state.data.assets = null;
  state.data.tree = null;
  state.data.registry = null;
  state.data.integrations = null;
  state.data.activity = null;
  state.data.operations = null;
  state.data.loadDiagnostics = null;
  notify();
}

export function resetContext() {
  state.context.currentProject = "";
  state.context.currentMarket = "";
  state.context.currentLanguage = "";
  state.context.executionMode = "";
  state.context.activeCampaign = "";
  notify();
}

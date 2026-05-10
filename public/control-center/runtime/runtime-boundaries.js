export const RUNTIME_BOUNDARIES = Object.freeze({
  shell: "global-app-shell",
  workspace: "dynamic-workspace",
  command: "global-command-runtime",
  overlays: "overlay-runtime",
  diagnostics: "diagnostics-runtime",
  ai: "ai-runtime",
  startup: "startup-runtime"
});

export const FRONTEND_RUNTIME_RULES = Object.freeze({
  noHeavyRenderLogic: true,
  noGlobalOverlayDuplication: true,
  noDirectDOMMutationOutsideRuntime: true,
  noPageLevelShellCreation: true,
  preserveCanonicalRouting: true
});

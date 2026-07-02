/**
 * PHASE 20.1 — SETTINGS CONTROL PLANE CONNECTOR
 */

window.__CONTROL_PLANE_SETTINGS__ = {

  mode: "CONTROLLED",

  setMode(mode) {

    this.mode = mode;

    if (window.__mhLog) {
      window.__mhLog("CONTROL_PLANE_MODE_CHANGE", { mode });
    }

    if (window.__CONTROL_PLANE__) {
      window.__CONTROL_PLANE__.setMode(mode);
    }
  }
};

// public/control-center/runtime/mh-runtime-globals.js
// Debug/view instrumentation only.
// Backend orchestrator remains the single decision authority.

export function installMhRuntimeGlobals() {
  const w = window;

  w.__MH_OBSERVER__ = w.__MH_OBSERVER__ || { events: [] };
  w.__MH_GRAPH__ = w.__MH_GRAPH__ || { nodes: [] };

  function record(type, data = {}) {
    const event = {
      type: String(type || "DEBUG_EVENT"),
      data,
      timestamp: Date.now(),
      authority: "frontend_debug_only",
      can_execute: false,
      can_decide: false
    };

    w.__MH_OBSERVER__.events.push(event);
    w.__MH_GRAPH__.nodes.push(event);

    if (w.__MH_DEV_MODE__ === true || location.hostname === "localhost") {
      console.debug("[MH-FRONTEND-DEBUG]", event);
    }

    return event;
  }

  w.__mhLog = record;
  w.__mhGraphLog = record;

  w.__MH_FRONTEND_RUNTIME__ = Object.freeze({
    mode: "debug_view_only",
    authority: "none",
    backendAuthority: "orchestrator",
    canExecute: false,
    canDecide: false,
    installedAt: new Date().toISOString()
  });

  // Compatibility no-op bridges. These must never execute or decide.
  w.__mhExecute = function(type, payload) {
    return record("FRONTEND_EXECUTION_BLOCKED", { type, payload });
  };

  w.__mhDecide = function(intent) {
    record("FRONTEND_DECISION_BLOCKED", { intent });
    return "BACKEND_AUTHORITY_REQUIRED";
  };

  w.__mhGate = function(input) {
    return record("FRONTEND_GATE_BLOCKED", { input });
  };

  w.__mhAIIntercept = function(payload) {
    return record("FRONTEND_AI_INTENT_CAPTURED", { payload });
  };

  w.__mhCommand = function(command) {
    return record("FRONTEND_COMMAND_CAPTURED", { command });
  };

  w.__mhWorkflow = function(step, data) {
    return record("FRONTEND_WORKFLOW_CAPTURED", { step, data });
  };

  w.__mhRoute = function(route) {
    return record("FRONTEND_ROUTE_CAPTURED", { route });
  };

  w.__MH_BRAIN__ = Object.freeze({
    mode: "debug_view_only",
    add: record,
    query: () => []
  });

  w.__MH_ENFORCEMENT__ = Object.freeze({
    mode: "debug_view_only",
    logViolation: record,
    rules: Object.freeze({})
  });
}

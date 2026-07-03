/**
 * Legacy AI backend connector skeleton.
 *
 * This file is intentionally preserved for compatibility but is not loaded by
 * index.html. It must not call removed legacy AI execute routes.
 *
 * Active AI runtime authority lives in project-scoped api.js helpers:
 * - executeProjectAiCommand(projectName, payload)
 * - executeProjectAiChat(projectName, payload)
 * - executeProjectAiGuidance(projectName, payload)
 */

function buildLegacyAiBridgeResponse(command, payload) {
  return {
    ok: false,
    neutralized: true,
    legacy: true,
    bridge: "__AI_BACKEND_BRIDGE__",
    command,
    message: "Legacy AI backend bridge is neutralized. Use canonical project-scoped AI helpers instead.",
    canonical: {
      command: "executeProjectAiCommand(projectName, payload)",
      chat: "executeProjectAiChat(projectName, payload)",
      guidance: "executeProjectAiGuidance(projectName, payload)"
    },
    payloadReceived: Boolean(payload)
  };
}

if (typeof window !== "undefined") {
  window.__AI_BACKEND_BRIDGE__ = {
    async call(command, payload) {
      return buildLegacyAiBridgeResponse(command, payload);
    },

    workflow(data) {
      return this.call("WORKFLOW", data);
    },

    publish(data) {
      return this.call("PUBLISH", data);
    },

    approve(data) {
      return this.call("APPROVE", data);
    }
  };
}

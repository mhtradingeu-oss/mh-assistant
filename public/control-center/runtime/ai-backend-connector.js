/**
 * PHASE 19 — FRONTEND AI CONNECTOR
 */

window.__AI_BACKEND_BRIDGE__ = {

  async call(command, payload) {

    const res = await fetch("/ai/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        command,
        payload
      })
    });

    return res.json();
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

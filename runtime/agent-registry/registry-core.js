class AgentRegistry {
  constructor() {
    this.agents = new Map();
  }

  normalizeTaskInput(task) {
    if (typeof task === "string") return task.toLowerCase();
    if (!task || typeof task !== "object") return "";

    const merged = [
      task.task,
      task.taskType,
      task.type,
      task.message,
      task.intent
    ]
      .filter((value) => typeof value === "string" && value.trim().length > 0)
      .join(" ");

    return merged.toLowerCase();
  }

  normalizeCapabilities(capabilities) {
    if (Array.isArray(capabilities)) {
      return capabilities
        .filter((value) => typeof value === "string" && value.trim().length > 0)
        .map((value) => value.trim().toLowerCase());
    }

    if (typeof capabilities === "string" && capabilities.trim().length > 0) {
      return [capabilities.trim().toLowerCase()];
    }

    return [];
  }

  register(agent) {
    if (!agent || !agent.id) {
      throw new Error("Invalid agent definition");
    }

    const normalizedCapabilities = this.normalizeCapabilities(agent.capabilities);

    this.agents.set(agent.id, {
      id: agent.id,
      role: agent.role || "specialist",
      capabilities: normalizedCapabilities,
      route: agent.route || null,
      priority: agent.priority || 50,
      active: true,
      createdAt: new Date().toISOString()
    });

    return this.agents.get(agent.id);
  }

  resolve(task) {
    const normalizedTask = this.normalizeTaskInput(task);
    const candidates = Array.from(this.agents.values())
      .filter(a => a.active)
      .filter(a =>
        (a.capabilities || []).some(c => normalizedTask.includes(String(c || "").toLowerCase()))
      );

    if (candidates.length === 0) {
      return { id: "default_orchestrator", fallback: true };
    }

    return candidates
      .sort((a, b) => {
        if (b.priority !== a.priority) {
          return b.priority - a.priority;
        }
        return String(a.id).localeCompare(String(b.id));
      })[0];
  }

  list() {
    return Array.from(this.agents.values());
  }
}

module.exports = new AgentRegistry();

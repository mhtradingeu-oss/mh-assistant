const registry = require("./registry-core");

function registerAgent(req, res) {
  try {
    const agent = registry.register(req.body);
    res.json({ success: true, agent });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

function resolveAgent(req, res) {
  try {
    const payload = req && req.body ? req.body : {};
    const task = Object.prototype.hasOwnProperty.call(payload, "task") ? payload.task : payload;
    const agent = registry.resolve(task);
    res.json({ success: true, agent });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

function listAgents(req, res) {
  res.json({ agents: registry.list() });
}

module.exports = {
  registerAgent,
  resolveAgent,
  listAgents
};

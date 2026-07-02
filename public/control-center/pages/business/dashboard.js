
/**
 * ⚡ AUTONOMOUS BUSINESS OPERATING UI
 * Real-time AI business cockpit
 */

async function loadBusinessState() {

  const [gov, econ, civ] = await Promise.all([
    fetch("/api/governance/state").then(r => r.json()),
    fetch("/api/ai-control/dashboard").then(r => r.json()),
    fetch("/api/governance/audit").then(r => r.json())
  ]);

  return { gov, econ, civ };
}

function renderMetric(label, value) {
  return `<div style="margin:8px 0;"><b>${label}:</b> ${JSON.stringify(value)}</div>`;
}

async function initBusinessUI() {

  const state = await loadBusinessState();

  document.body.innerHTML = `
    <div style="font-family:Arial;padding:20px;background:#0f172a;color:#fff;">

      <h1>⚡ AUTONOMOUS BUSINESS OPERATING SYSTEM</h1>

      <h2>🧠 AI CONTROL STATE</h2>
      ${renderMetric("AI Brain", state.econ.brain)}

      <h2>💰 ECONOMY</h2>
      ${renderMetric("Economy", state.econ.economy)}

      <h2>⚖️ GOVERNANCE</h2>
      ${renderMetric("Governance", state.gov)}

      <h2>📊 AUDIT STREAM</h2>
      <pre style="background:#111;padding:10px;max-height:200px;overflow:auto;">
        ${JSON.stringify(state.civ, null, 2)}
      </pre>

      <h2>⚙️ CONTROL PANEL</h2>

      <button onclick='sendAction({type:"ADS", budget:5000})'>
        📢 Scale Ads
      </button>

      <button onclick='sendAction({type:"FINANCE", amount:10000})'>
        💰 Trigger Revenue Action
      </button>

      <button onclick='sendAction({type:"CIVILIZATION"})'>
        🌍 Run System Evolution
      </button>

    </div>
  `;
}

// action bridge
async function sendAction(action) {

  await fetch("/api/governance/process", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(action)
  });

  alert("⚡ Action sent to AI system");
}

// init
initBusinessUI();


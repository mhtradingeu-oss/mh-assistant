
/**
 * ⚖️ LIVE GOVERNANCE DASHBOARD
 * Real-time AI control room
 */

async function fetchLiveState() {
  const res = await fetch("/api/governance/state");
  return await res.json();
}

async function fetchAudit() {
  const res = await fetch("/api/governance/audit");
  return await res.json();
}

async function sendAction(action) {
  const res = await fetch("/api/governance/process", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(action)
  });

  return await res.json();
}

// ================================
// UI STATE ENGINE (SIMPLE LIVE LOOP)
// ================================

async function initGovernanceDashboard() {

  const state = await fetchLiveState();
  const audit = await fetchAudit();

  console.log("🧠 LIVE GOVERNANCE STATE:", state);
  console.log("📊 AUDIT LOG:", audit);

  document.body.innerHTML = `
    <div style="font-family: Arial; padding: 20px;">
      
      <h1>⚖️ GOVERNANCE CONTROL CENTER</h1>

      <h2>🧠 Live State</h2>
      <pre>${JSON.stringify(state, null, 2)}</pre>

      <h2>📊 Audit Log</h2>
      <pre>${JSON.stringify(audit, null, 2)}</pre>

      <h2>⚙️ Actions</h2>
      <button onclick='sendAction({type:"ADS", budget:3000})'>
        Increase Ads Budget
      </button>

      <button onclick='sendAction({type:"FINANCE", amount:2000})'>
        Trigger Finance Action
      </button>

      <button onclick='sendAction({type:"CIVILIZATION"})'>
        Run Civilization Rule
      </button>

    </div>
  `;
}

// Auto-start dashboard
initGovernanceDashboard();


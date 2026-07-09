
// =====================================================
// MEDIA STUDIO — FINAL FLOW LOCKED ARCHITECTURE
// SINGLE EXECUTION PIPELINE (PRODUCTION SAFE)
// =====================================================

// 🧠 CONTRACT IMPORT (ONLY INTELLIGENCE ENTRY POINT)
import { buildContentMediaContract }
from "../../../runtime/orchestrator-service/lib/media/contracts/contentMediaContract";

// =====================================================
// STATE DRIVEN RENDER ONLY (NO LOGIC)
// =====================================================
function renderMediaAssets(state = {}) {
  const assets = state.assets || [];

  const container = document.getElementById('media-studio-grid');
  if (!container) return;

  container.innerHTML = '';

  assets.forEach(asset => {
    const card = document.createElement('div');
    card.className = 'media-asset-card';

    card.innerHTML = `
      <div>${asset.asset_type || 'media'}</div>
      <div>${asset.status || 'ready'}</div>
      <div style="opacity:0.6">FLOW LOCKED EXECUTION</div>
    `;

    container.appendChild(card);
  });
}

// =====================================================
// FLOW LOCKED REFRESH (STATE ONLY)
// =====================================================
function refreshMediaStudio(project, stateEngine) {
  if (!stateEngine) return;

  const state = stateEngine.get(project);
  if (!state) return;

  renderMediaAssets(state);
}

// =====================================================
// CONTRACT ENTRY POINT (ONLY WAY IN)
// =====================================================
function buildMediaFromContent(input) {
  const contract = buildContentMediaContract(input);

  return {
    locked: true,
    pipeline: "contract-only",
    executionPlan: {
      mediaTypes: contract.media.types,
      platform: contract.platform.primary,
      routing: contract.routing
    }
  };
}

// =====================================================
// INIT (STATE SUBSCRIPTION ONLY — NO LOOPS)
// =====================================================
function initMediaStudio(project, stateEngine) {
  if (!stateEngine) return;

  stateEngine.subscribe(project, (state) => {
    renderMediaAssets(state);
  });
}

// =====================================================
// GLOBAL EXPORTS
// =====================================================
window.initMediaStudio = initMediaStudio;
window.buildMediaFromContent = buildMediaFromContent;


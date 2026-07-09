
// ===============================
// MEDIA STUDIO FRONTEND LOADER
// PHASE 2E.2
// ===============================

async function loadMediaStudioIndex(project) {
  try {
    const res = await fetch(
      `/media-manager/project/${project}/media-studio/index`
    );

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to load media index');
    }

    return data.assets || data.assets || [];
  } catch (err) {
    console.error('[media-studio-load-error]', err.message);
    return [];
  }
}

function renderMediaAssets(assets = []) {
  const container = document.getElementById('media-studio-grid');
  if (!container) return;

  container.innerHTML = '';

  assets.forEach(asset => {
    const card = document.createElement('div');
    card.className = 'media-asset-card';

    card.innerHTML = `
      <div class="asset-preview">
        ${
          asset.preview_url
            ? `<img src="${asset.preview_url}" />`
            : `<div class="no-preview">No Preview</div>`
        }
      </div>
      <div class="asset-meta">
        <div>${asset.asset_type || 'media'}</div>
        <div>${asset.review_status || 'ready'}</div>
      </div>
    `;

    container.appendChild(card);
  });
}

async function refreshMediaStudio(project) {
  const assets = await loadMediaStudioIndex(project);
  renderMediaAssets(assets);
}

// Auto-init (basic version)
window.initMediaStudio = function(project) {
  refreshMediaStudio(project);

  // Auto refresh every 5 seconds (Phase 2E hybrid mode)
  setInterval(() => {
    refreshMediaStudio(project);
  }, 5000);
};


// ================================
// STATE ENGINE INTEGRATION PATCH
// PHASE 2E.4
// ================================

import mediaStateEngine from '../state/mediaState.js';

// override refresh with state engine
async function refreshMediaStudio(project) {
  try {
    const res = await fetch(
      `/media-manager/project/${project}/media-studio/index`
    );

    const data = await res.json();
    const assets = data.assets || [];

    // 🔥 inject into global state engine
    mediaStateEngine.updateIfChanged(project, assets);

  } catch (err) {
    console.error('[media-studio-refresh-error]', err.message);
  }
}

// subscribe UI to state engine
function bindMediaStudioState(project) {
  mediaStateEngine.subscribe(project, (state) => {
    renderMediaAssets(state.assets || []);
  });
}

// auto init upgraded version
window.initMediaStudio = function(project) {
  bindMediaStudioState(project);
  refreshMediaStudio(project);

  // fallback polling (will be removed later)
  setInterval(() => {
    refreshMediaStudio(project);
  }, 5000);
};


// ===============================
// FULL OS PUBLISH UI LAYER
// PHASE 2F.3
// ===============================

let selectedAssets = new Set();

// toggle asset selection
function toggleAssetSelection(assetId) {
  if (selectedAssets.has(assetId)) {
    selectedAssets.delete(assetId);
  } else {
    selectedAssets.add(assetId);
  }

  renderSelectionState();
}

// render selection UI state
function renderSelectionState() {
  const counter = document.getElementById('selected-count');
  if (counter) {
    counter.innerText = selectedAssets.size;
  }
}

// publish single asset
async function publishSingleAsset(project, asset) {
  try {
    const res = await fetch(
      `/media-manager/project/${project}/publish/asset`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asset })
      }
    );

    const data = await res.json();

    if (window.mediaStateEngine) {
      const current = window.mediaStateEngine.get(project);
      const updated = current.assets.map(a => {
        if (a.asset_id === asset.asset_id) {
          return {
            ...a,
            publish_status: data.success ? 'published' : 'failed'
          };
        }
        return a;
      });

      window.mediaStateEngine.set(project, updated);
    }

    return data;
  } catch (err) {
    console.error('[publish-error]', err.message);
  }
}

// batch publish
async function publishSelectedAssets(project, assets) {
  try {
    const res = await fetch(
      `/media-manager/project/${project}/publish/batch`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assets })
      }
    );

    const data = await res.json();

    if (window.mediaStateEngine) {
      const current = window.mediaStateEngine.get(project);

      const updatedAssets = current.assets.map(a => {
        if (selectedAssets.has(a.asset_id)) {
          return {
            ...a,
            publish_status: 'published'
          };
        }
        return a;
      });

      window.mediaStateEngine.set(project, updatedAssets);
    }

    selectedAssets.clear();
    renderSelectionState();

    return data;
  } catch (err) {
    console.error('[batch-publish-error]', err.message);
  }
}

// enhanced renderer (OS MODE UI)
function renderMediaAssets(assets = [], project) {
  const container = document.getElementById('media-studio-grid');
  if (!container) return;

  container.innerHTML = '';

  assets.forEach(asset => {
    const card = document.createElement('div');
    card.className = 'media-asset-card';

    const isSelected = selectedAssets.has(asset.asset_id);

    card.innerHTML = `
      <div class="asset-select ${isSelected ? 'selected' : ''}">
        <button onclick="toggleAssetSelection('${asset.asset_id}')">
          ${isSelected ? 'Selected' : 'Select'}
        </button>
      </div>

      <div class="asset-preview">
        ${
          asset.preview_url
            ? `<img src="${asset.preview_url}" />`
            : `<div>No Preview</div>`
        }
      </div>

      <div class="asset-meta">
        <div>Status: ${asset.publish_status || 'ready'}</div>
        <div>Type: ${asset.asset_type || 'media'}</div>
      </div>

      <div class="asset-actions">
        <button onclick='publishSingleAsset("${project}", ${JSON.stringify(asset)})'>
          Publish
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

// override global renderer
window.renderMediaAssets = renderMediaAssets;

window.publishSingleAsset = publishSingleAsset;
window.publishSelectedAssets = publishSelectedAssets;
window.toggleAssetSelection = toggleAssetSelection;


// ===============================
// PHASE 2F.5 - PUBLISH LIFECYCLE UI ENGINE
// ===============================

// active job tracker cache
let publishJobs = {};

// fetch job status from backend lifecycle engine
async function fetchPublishJob(jobId) {
  try {
    const res = await fetch(`/media-manager/publish/job/${jobId}`);
    return await res.json();
  } catch (err) {
    console.error('[job-fetch-error]', err.message);
  }
}

// render publishing dashboard
function renderPublishDashboard(containerId = 'publish-dashboard') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  const jobs = Object.values(publishJobs);

  jobs.forEach(job => {
    const card = document.createElement('div');
    card.className = 'publish-job-card';

    const statusColor =
      job.status === 'success' ? 'green' :
      job.status === 'failed' ? 'red' :
      job.status === 'processing' ? 'orange' : 'gray';

    card.innerHTML = `
      <div class="job-header">
        <strong>Asset:</strong> ${job.asset_id}
      </div>

      <div class="job-status" style="color:${statusColor}">
        Status: ${job.status}
      </div>

      <div class="job-progress">
        Progress: ${job.progress || 0}%
      </div>

      <div class="job-meta">
        Job ID: ${job.job_id}
      </div>
    `;

    container.appendChild(card);
  });
}

// start tracking a publish job
function trackPublishJob(job) {
  if (!job || !job.job_id) return;

  publishJobs[job.job_id] = job;

  renderPublishDashboard();
}

// live polling loop (real-time OS mode)
function startPublishLifecycleSync() {
  setInterval(async () => {
    const jobIds = Object.keys(publishJobs);

    for (const jobId of jobIds) {
      const updated = await fetchPublishJob(jobId);

      if (updated) {
        publishJobs[jobId] = updated;
      }
    }

    renderPublishDashboard();
  }, 3000);
}

// hook into publishSingleAsset
const originalPublishSingleAsset = window.publishSingleAsset;

window.publishSingleAsset = async function(project, asset) {
  const result = await originalPublishSingleAsset(project, asset);

  if (result?.job) {
    trackPublishJob(result.job);
  }

  return result;
};

// hook into batch publish
const originalBatchPublish = window.publishSelectedAssets;

window.publishSelectedAssets = async function(project, assets) {
  const result = await originalBatchPublish(project, assets);

  if (result?.results) {
    result.results.forEach(r => {
      if (r.job) trackPublishJob(r.job);
    });
  }

  return result;
};

// auto start lifecycle engine UI sync
startPublishLifecycleSync();

window.renderPublishDashboard = renderPublishDashboard;


// ===============================
// CONTENT → MEDIA CONTRACT INTEGRATION (PHASE 8.2)
// ===============================

import { buildContentMediaContract } 
from "../../../runtime/orchestrator-service/lib/media/contracts/contentMediaContract";

// Wrap existing media generation pipeline with contract layer
function buildMediaFromContent(input) {
  const contract = buildContentMediaContract(input);

  console.log("[MediaStudio] Contract Generated:", contract);

  return {
    contract,
    executionPlan: {
      mediaTypes: contract.media.types,
      platform: contract.platform.primary,
      provider: contract.generation.provider_strategy,
      routing: contract.routing
    }
  };
}

// Expose globally for UI debugging / orchestration
window.buildMediaFromContent = buildMediaFromContent;


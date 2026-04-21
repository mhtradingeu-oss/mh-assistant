(function () {
  const DEFAULT_ASSET_CATALOG = [
    { asset_type: 'logo', label: 'Logo', required: true, allowed_extensions: ['.png', '.svg', '.jpg', '.jpeg'], target_folder: 'brand-assets', description: 'Legacy fallback asset type.' },
    { asset_type: 'product', label: 'Product', required: false, allowed_extensions: ['.png', '.jpg', '.jpeg', '.webp'], target_folder: 'brand-assets', description: 'Legacy fallback asset type.' },
    { asset_type: 'packaging', label: 'Packaging', required: false, allowed_extensions: ['.png', '.jpg', '.jpeg', '.webp'], target_folder: 'brand-assets', description: 'Legacy fallback asset type.' },
    { asset_type: 'reference', label: 'Reference', required: false, allowed_extensions: ['.png', '.jpg', '.jpeg', '.pdf'], target_folder: 'brand-assets', description: 'Legacy fallback asset type.' },
    { asset_type: 'video', label: 'Video', required: false, allowed_extensions: ['.mp4', '.mov'], target_folder: 'brand-assets', description: 'Legacy fallback asset type.' }
  ];

  const TAB_NAMES = [
    'overview',
    'campaigns',
    'content',
    'ads',
    'tracking',
    'automation',
    'governance',
    'files'
  ];

  const state = {
    projects: [],
    projectItems: [],
    currentProject: '',
    assetCatalog: [],
    activeTab: 'overview',
    api: {
      base: '',
      candidates: [],
      status: 'unknown',
      detail: 'Checking API connectivity…',
      panelErrors: {}
    },
    data: createEmptyProjectData()
  };

  function createEmptyProjectData() {
    return {
      overview: null,
      assets: null,
      connectors: null,
      readiness: null,
      activity: null,
      tree: null,
      registry: null
    };
  }

  function $(id) {
    return document.getElementById(id);
  }

  function exists(id) {
    return !!$(id);
  }

  function safeSetHtml(id, html) {
    const el = $(id);
    if (el) el.innerHTML = html;
  }

  function safeSetText(id, value) {
    const el = $(id);
    if (el) el.textContent = value;
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function displayValue(value, fallback = '-') {
    if (value == null || value === '') return fallback;
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return String(value);
  }

  function formatDate(value) {
    if (!value) return '-';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
  }

  function formatKey(value) {
    return displayValue(value).replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
  }

  function basename(filePath) {
    return String(filePath || '').split('/').filter(Boolean).pop() || '';
  }

  function toArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function unique(values) {
    return Array.from(new Set((values || []).filter((value) => value != null)));
  }

  function summarizeResponseText(raw) {
    return String(raw || '').replace(/\s+/g, ' ').trim().slice(0, 240);
  }

  function cleanErrorText(message) {
    return summarizeResponseText(message)
      .replace(/^Request failed \(\d+\):\s*/i, '')
      .replace(/^Unexpected non-JSON response from\s+[^\s]+(?:\s+\([^)]+\))?/i, 'The server returned an unexpected response')
      .replace(/^Invalid JSON response from\s+[^\s]+/i, 'The server returned unreadable data');
  }

  function buildFriendlyAlert(key, rawMessage = '') {
    const normalized = cleanErrorText(rawMessage).toLowerCase();
    const defaults = {
      api: { tone: 'error', title: 'API connection unavailable', body: 'The page could not reach the media manager API from this browser path.' },
      projects: { tone: 'error', title: 'Project list unavailable', body: 'The available projects could not be loaded right now.' },
      catalog: { tone: 'warning', title: 'Using fallback asset types', body: 'The asset type catalog is unavailable, so the page switched to a safe fallback list.' },
      overview: { tone: 'warning', title: 'Overview unavailable', body: 'Project overview data is temporarily unavailable.' },
      assets: { tone: 'warning', title: 'Asset routing unavailable', body: 'The asset routing and folder-health view could not be refreshed right now.' },
      connectors: { tone: 'warning', title: 'Connector data unavailable', body: 'Connector readiness details could not be loaded right now.' },
      readiness: { tone: 'warning', title: 'Readiness data unavailable', body: 'Readiness scoring and next-step guidance are temporarily unavailable.' },
      activity: { tone: 'warning', title: 'Activity data unavailable', body: 'Recent scheduled jobs and execution results could not be loaded right now.' },
      tree: { tone: 'warning', title: 'Media folders unavailable', body: 'The media folder tree could not be loaded right now.' },
      registry: { tone: 'warning', title: 'Media registry unavailable', body: 'The linked media registry could not be loaded right now.' },
      refresh: { tone: 'error', title: 'Refresh failed', body: 'The page could not refresh all control-center data.' },
      upload: { tone: 'error', title: 'Upload failed', body: 'The selected file could not be uploaded right now.' },
      init: { tone: 'error', title: 'Page startup failed', body: 'The control center could not finish loading its initial data.' }
    };

    const alert = { ...(defaults[key] || defaults.init) };

    if (!normalized) return alert;
    if (normalized.includes('project profile not found')) {
      alert.body = 'This project has media files, but its full project profile has not been created yet.';
    } else if (normalized.includes('project not found')) {
      alert.body = 'The selected project is not currently available to the control center.';
    } else if (normalized.includes('missing project name')) {
      alert.body = 'Choose a project first, then try this action again.';
    } else if (normalized.includes('404')) {
      alert.body = 'The page reached the server, but one of the required API routes is not available.';
    } else if (normalized.includes('failed to fetch') || normalized.includes('networkerror') || normalized.includes('load failed')) {
      alert.body = 'The browser could not reach the server. Check the service and try again.';
    }

    return alert;
  }

  function renderAlertBox(alert) {
    return `
      <div class="alert-box ${escapeHtml(alert.tone || 'info')}">
        <div class="alert-title">${escapeHtml(displayValue(alert.title, 'Notice'))}</div>
        <div class="alert-body">${escapeHtml(displayValue(alert.body, ''))}</div>
      </div>
    `;
  }

  function setMessage(message, type = 'info') {
    if (!exists('message')) return;

    const box = $('message');
    const payload = typeof message === 'string'
      ? { title: type === 'success' ? 'Success' : type === 'error' ? 'Something needs attention' : 'Notice', body: message }
      : (message || {});

    box.className = `message visible ${type}`;
    box.innerHTML = `
      <div class="message-title">${escapeHtml(displayValue(payload.title, 'Notice'))}</div>
      <div class="message-body">${escapeHtml(displayValue(payload.body, ''))}</div>
    `;
  }

  function clearMessage() {
    if (!exists('message')) return;
    const box = $('message');
    box.className = 'message';
    box.innerHTML = '';
  }

  function setPanelError(key, message) {
    if (!message) {
      delete state.api.panelErrors[key];
      return;
    }
    state.api.panelErrors[key] = message;
  }

  function getPanelError(key) {
    return state.api.panelErrors[key] || '';
  }

  function renderErrorSummary() {
    if (!exists('errorSummary')) return;

    const entries = Object.entries(state.api.panelErrors).filter(([, value]) => value);
    const box = $('errorSummary');

    if (!entries.length) {
      box.className = 'error-summary';
      box.innerHTML = '';
      return;
    }

    box.className = 'error-summary visible';
    box.innerHTML = `
      <div class="alert-stack">
        ${entries.map(([key, value]) => renderAlertBox(buildFriendlyAlert(key, value))).join('')}
      </div>
    `;
  }

  function normalizeBase(base) {
    const value = String(base || '').trim();
    if (!value || value === '/') return '';
    return value.replace(/\/+$/, '');
  }

  function deriveApiBaseCandidates() {
    const pathname = window.location.pathname || '';
    const currentDir = pathname.replace(/\/[^/]*$/, '');
    const publicIndex = pathname.lastIndexOf('/public/');
    const publicPrefix = publicIndex >= 0 ? pathname.slice(0, publicIndex) : '';
    const publicDirPrefix = currentDir.endsWith('/public') ? currentDir.slice(0, -7) : currentDir;

    return unique([
      normalizeBase(currentDir),
      normalizeBase(publicPrefix),
      normalizeBase(publicDirPrefix),
      ''
    ]);
  }

  function buildApiUrl(endpoint, baseOverride) {
    const cleanEndpoint = String(endpoint || '').replace(/^\/+/, '');
    const base = normalizeBase(baseOverride != null ? baseOverride : state.api.base);
    return base ? `${base}/${cleanEndpoint}` : `/${cleanEndpoint}`;
  }

  async function fetchJson(url, options = {}) {
    const response = await fetch(url, options);
    const raw = await response.text();
    const contentType = response.headers.get('content-type') || '';
    const summarized = summarizeResponseText(raw);
    let data = null;
    const looksLikeJson = contentType.includes('application/json') || /^[\[{]/.test(String(raw || '').trim());

    if (looksLikeJson) {
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        if (!response.ok) throw new Error(`Request failed (${response.status}): ${summarized || 'Invalid JSON response.'}`);
        throw new Error(`Invalid JSON response from ${url}`);
      }
    } else if (raw) {
      if (!response.ok) throw new Error(`Request failed (${response.status}): ${summarized || 'No response body.'}`);
      throw new Error(`Unexpected non-JSON response from ${url}${contentType ? ` (${contentType})` : ''}`);
    }

    if (!response.ok || (data && data.error)) {
      throw new Error(
        data && data.error
          ? `${data.error}${data.details ? ` - ${data.details}` : ''}`
          : `Request failed (${response.status})${summarized ? `: ${summarized}` : ''}`
      );
    }

    return data || {};
  }

  async function apiFetch(endpoint, options = {}) {
    return fetchJson(buildApiUrl(endpoint), options);
  }

  async function resolveApiBase() {
    const candidates = deriveApiBaseCandidates();
    state.api.candidates = candidates;

    for (const candidate of candidates) {
      const probeUrl = buildApiUrl('media-manager/projects', candidate);
      try {
        const data = await fetchJson(probeUrl);
        if (Array.isArray(data.projects) || Array.isArray(data.items)) {
          state.api.base = normalizeBase(candidate);
          state.api.status = 'connected';
          state.api.detail = 'All core media manager endpoints are responding.';
          setPanelError('api', '');
          return state.api.base;
        }
      } catch (error) {
        setPanelError('api', error.message);
      }
    }

    state.api.base = normalizeBase(candidates[0] || '');
    state.api.status = 'failed';
    state.api.detail = 'The page could not resolve a working API base from this URL.';
    throw new Error(state.api.detail);
  }

  async function ensureApiReady() {
    if (state.api.base && state.api.status !== 'failed') return;
    await resolveApiBase();
  }

  function updateApiHealth() {
    const failures = Object.keys(state.api.panelErrors).filter((key) => state.api.panelErrors[key]);
    if (state.api.status === 'failed') return;
    state.api.status = failures.length ? 'partial' : 'connected';
    state.api.detail = failures.length
      ? 'The API is reachable, but some sections need attention.'
      : 'All core media manager endpoints are responding.';
  }

  async function loadProjects() {
    const data = await apiFetch('media-manager/projects');
    state.projectItems = toArray(data.items);
    state.projects = state.projectItems.length
      ? state.projectItems.map((item) => item.name).filter(Boolean)
      : toArray(data.projects);

    setPanelError('projects', '');

    const previous = state.currentProject;
    const preferredProject = displayValue(data.preferred_project, '');

    state.currentProject = state.projects.includes(previous)
      ? previous
      : (preferredProject && state.projects.includes(preferredProject) ? preferredProject : (state.projects[0] || ''));

    syncProjectSelect();
  }

  function syncProjectSelect() {
    if (!exists('projectSelect')) return;

    const select = $('projectSelect');
    select.innerHTML = '';

    state.projects.forEach((project) => {
      const option = document.createElement('option');
      option.value = project;
      option.textContent = project;
      select.appendChild(option);
    });

    select.value = state.currentProject;
  }

  async function loadAssetCatalog() {
    const previous = exists('assetTypeSelectAssets') ? $('assetTypeSelectAssets').value : '';

    try {
      const data = await apiFetch('media-manager/asset-catalog');
      state.assetCatalog = toArray(data.asset_catalog).slice().sort((a, b) =>
        Number(Boolean(b.required)) - Number(Boolean(a.required)) ||
        String(a.label || '').localeCompare(String(b.label || ''))
      );
      setPanelError('catalog', '');
    } catch (error) {
      state.assetCatalog = DEFAULT_ASSET_CATALOG.slice();
      setPanelError('catalog', error.message);
      setMessage(buildFriendlyAlert('catalog', error.message), 'info');
    }

    syncAssetTypeSelect(previous);
  }

  function syncAssetTypeSelect(selectedValue) {
    if (!exists('assetTypeSelectAssets')) return;

    const select = $('assetTypeSelectAssets');
    select.innerHTML = '';

    state.assetCatalog.forEach((item) => {
      const option = document.createElement('option');
      option.value = item.asset_type;
      option.textContent = `${item.label}${item.required ? ' • Required' : ''}`;
      select.appendChild(option);
    });

    if (selectedValue && state.assetCatalog.some((item) => item.asset_type === selectedValue)) {
      select.value = selectedValue;
    }

    updateAssetTypeDetails();
  }

  async function loadProjectData(project) {
    const payload = await apiFetch(`media-manager/project/${encodeURIComponent(project)}`);
    const panelKeys = ['overview', 'assets', 'connectors', 'readiness', 'activity', 'tree', 'registry'];
    const failures = [];

    panelKeys.forEach((key) => {
      const message = payload.errors && payload.errors[key] ? String(payload.errors[key]) : '';
      setPanelError(key, message);
      if (message) failures.push(key);
    });

    state.data = {
      overview: payload.overview || null,
      assets: payload.assets || null,
      connectors: payload.connectors || null,
      readiness: payload.readiness || null,
      activity: payload.activity || null,
      tree: payload.tree || null,
      registry: payload.registry || null
    };

    if (failures.length) {
      const firstIssue = buildFriendlyAlert(failures[0], getPanelError(failures[0]));
      setMessage({
        title: 'Some sections need attention',
        body: `The page is still showing available data for ${project}. ${firstIssue.body}`
      }, 'info');
    }
  }

  function statusTone(status) {
    const normalized = String(status || '').toLowerCase();
    if (['strong', 'ready', 'active', 'healthy', 'assets_ready', 'connectors_ready', 'fully_aligned', 'complete', 'success', 'connected'].includes(normalized)) return 'success';
    if (['progressing', 'allowed_with_constraints', 'restricted_execution', 'restricted_generation', 'partially_aligned', 'connectors_incomplete', 'missing_assets', 'needs_work', 'needs_input', 'warning', 'partial', 'required'].includes(normalized)) return 'warning';
    if (['blocked', 'critical_gaps_found', 'not_aligned', 'error', 'failed'].includes(normalized)) return 'danger';
    if (normalized) return 'info';
    return 'neutral';
  }

  function renderStatusBadge(status, label) {
    const text = escapeHtml(label || formatKey(status || 'unknown'));
    return `<span class="badge ${statusTone(status || label)}">${text}</span>`;
  }

  function renderEmptyState(message) {
    return `<div class="empty-state">${escapeHtml(message)}</div>`;
  }

  function renderKeyValueGrid(items) {
    if (!items.length) return renderEmptyState('No summary data is available.');
    return `
      <div class="summary-grid">
        ${items.map((item) => `
          <div class="summary-item">
            <strong>${escapeHtml(item.label)}</strong>
            ${item.value}
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderBadgeList(items, options = {}) {
    if (!items.length) return renderEmptyState(options.emptyMessage || 'No items are available.');
    const badgeTone = options.badgeTone || 'info';
    const badgeLabel = options.badgeLabel || 'Item';
    return `
      <ul class="action-list">
        ${items.map((item) => `
          <li>${renderStatusBadge(badgeTone, badgeLabel)} ${escapeHtml(options.formatter ? options.formatter(item) : displayValue(item))}</li>
        `).join('')}
      </ul>
    `;
  }

  function renderTable(headers, rows, emptyMessage = 'No data available.') {
    if (!rows.length) return renderEmptyState(emptyMessage);

    return `
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              ${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function apiStatusPresentation() {
    if (state.api.status === 'failed') {
      return { label: 'Failed', tone: 'failed', detail: 'The page cannot reach the media manager API right now.' };
    }
    if (state.api.status === 'partial') {
      return { label: 'Partial', tone: 'warning', detail: 'The API is reachable, but some panels are still unavailable.' };
    }
    return { label: 'Connected', tone: 'success', detail: 'All core media manager endpoints are responding.' };
  }

  function updateAssetTypeDetails() {
    if (!exists('assetTypeSelectAssets')) return;

    const assetType = $('assetTypeSelectAssets').value;
    const item = state.assetCatalog.find((entry) => entry.asset_type === assetType) || null;
    const allowedExtensions = item && item.allowed_extensions ? item.allowed_extensions.join(', ') : '-';
    const targetFolder = item ? item.target_folder : '-';
    const description = item ? item.description : 'No asset type metadata available.';
    const requirementBadge = item
      ? renderStatusBadge(item.required ? 'required' : 'optional', item.required ? 'Required' : 'Optional')
      : renderStatusBadge('info', 'Legacy');

    safeSetText('uploadProjectName', state.currentProject || '-');
    safeSetText('assetAllowedExtensions', allowedExtensions);
    safeSetText('assetTargetFolder', targetFolder);
    safeSetText('assetUploadMode', 'Project catalog routing');
    safeSetText('assetDescription', description);
    safeSetHtml('assetRequirementBadge', requirementBadge);
    safeSetText('assetCatalogHint', item ? `${item.label} routes to ${item.target_folder}.` : 'This asset type is part of the existing asset flow.');
  }

  function renderPreviewPlaceholder(text) {
    safeSetHtml('preview', `<div class="preview-placeholder">${escapeHtml(text)}</div>`);
  }

  function renderPreviewFromFile(file) {
    if (!exists('preview')) return;

    const preview = $('preview');
    preview.innerHTML = '';

    if (!file) {
      renderPreviewPlaceholder('No file selected yet. Choose a file or preview an existing asset.');
      return;
    }

    if (file.type.startsWith('image/')) {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      img.alt = file.name;
      preview.appendChild(img);
      return;
    }

    if (file.type.startsWith('video/')) {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);
      video.controls = true;
      preview.appendChild(video);
      return;
    }

    renderPreviewPlaceholder(file.name);
  }

  function renderPreviewFromUrl(url, type, filename) {
    if (!exists('preview')) return;

    const preview = $('preview');
    preview.innerHTML = '';

    if (!url) {
      renderPreviewPlaceholder('No preview available for this asset.');
      return;
    }

    const normalizedType = String(type || '').toLowerCase();
    const lowerName = String(filename || '').toLowerCase();
    const looksLikeVideo = normalizedType.includes('video') || /\.(mp4|mov|webm|m4v)$/i.test(lowerName);
    const looksLikeImage = /\.(png|jpg|jpeg|webp|gif|svg)$/i.test(lowerName) || !looksLikeVideo;

    if (looksLikeVideo) {
      const video = document.createElement('video');
      video.src = url;
      video.controls = true;
      preview.appendChild(video);
      return;
    }

    const img = document.createElement('img');
    img.src = url;
    img.alt = filename || 'Asset preview';
    img.onerror = function () {
      renderPreviewPlaceholder(filename || 'Preview not available for this file type.');
    };
    preview.appendChild(img);
  }

  function setTab(tabName) {
    const nextTab = TAB_NAMES.includes(tabName) ? tabName : 'overview';
    state.activeTab = nextTab;

    document.querySelectorAll('.tab-button[data-tab]').forEach((button) => {
      const active = button.dataset.tab === nextTab;
      button.setAttribute('aria-selected', active ? 'true' : 'false');
      button.classList.toggle('is-active', active);
    });

    document.querySelectorAll('.tab-section').forEach((section) => {
      const active = section.id === `section-${nextTab}`;
      section.classList.toggle('active', active);
      section.setAttribute('aria-hidden', active ? 'false' : 'true');
      section.style.display = active ? 'block' : 'none';
    });
  }

  function renderTopStrip() {
    const readiness = state.data.readiness || {};
    const dashboard = readiness.dashboard || {};
    const alignment = readiness.alignment || {};
    const connectors = state.data.connectors || {};
    const connectorReadiness = connectors.readiness || {};
    const apiStatus = apiStatusPresentation();

    safeSetHtml('apiStatusBadge', renderStatusBadge(apiStatus.tone, apiStatus.label));
    safeSetText('apiStatusDetail', apiStatus.detail);

    safeSetHtml(
      'statusReadinessBadge',
      dashboard.readiness_status
        ? `${renderStatusBadge(dashboard.readiness_status, formatKey(dashboard.readiness_status))} ${escapeHtml(`${displayValue(dashboard.readiness_score, '0')}%`)}`
        : renderStatusBadge('info', 'Unknown')
    );

    safeSetHtml(
      'statusConnectorBadge',
      connectorReadiness.readiness_score != null
        ? `${renderStatusBadge(connectorReadiness.status || 'info', formatKey(connectorReadiness.status || 'unknown'))} ${escapeHtml(`${connectorReadiness.readiness_score}%`)}`
        : renderStatusBadge('info', 'Unknown')
    );

    safeSetHtml(
      'statusAlignmentBadge',
      alignment.status
        ? renderStatusBadge(alignment.status, formatKey(alignment.status))
        : renderStatusBadge('info', 'Unknown')
    );
  }

  function renderDecisionArea() {
    const readiness = state.data.readiness || {};
    const dashboard = readiness.dashboard || {};
    const priorities = readiness.priorities || {};
    const criticalItems = toArray(priorities.critical);
    const nextActions = toArray(dashboard.next_best_actions).slice(0, 6);

    safeSetHtml('criticalGapsCount', renderStatusBadge(criticalItems.length ? 'danger' : 'success', `${criticalItems.length} item(s)`));
    safeSetHtml('nextActionsCount', renderStatusBadge(nextActions.length ? 'warning' : 'info', `${nextActions.length} item(s)`));

    safeSetHtml(
      'topCriticalGaps',
      renderBadgeList(criticalItems, {
        badgeTone: 'danger',
        badgeLabel: 'Critical',
        formatter: formatKey,
        emptyMessage: 'No critical gaps are currently reported.'
      })
    );

    safeSetHtml(
      'topNextActions',
      renderBadgeList(nextActions, {
        badgeTone: 'warning',
        badgeLabel: 'Action',
        emptyMessage: 'No action guidance is available yet.'
      })
    );
  }

  function renderOverviewTab() {
    const overview = state.data.overview || {};
    const overviewSummary = overview.overview || {};
    const readiness = state.data.readiness || {};
    const dashboard = readiness.dashboard || {};
    const connectors = state.data.connectors || {};
    const connectorSources = Object.keys((connectors.sources && connectors.sources.sources) || {});
    const projectName = state.currentProject || 'No project selected';

    safeSetText('ovReadiness', `${displayValue(dashboard.readiness_score, '0')}%`);
    safeSetText('ovCampaign', 'Launch Wave 1');
    safeSetText('ovHeroProduct', 'Not selected yet');
    safeSetText('ovChannels', `${connectorSources.length} ready`);

    safeSetHtml(
      'overviewLaunchSummary',
      renderKeyValueGrid([
        { label: 'Project', value: escapeHtml(projectName) },
        { label: 'Market', value: escapeHtml(displayValue(overviewSummary.market)) },
        { label: 'Language', value: escapeHtml(displayValue(overviewSummary.language)) },
        { label: 'Execution Mode', value: renderStatusBadge(overviewSummary.execution_mode || 'unknown', formatKey(overviewSummary.execution_mode || 'unknown')) },
        { label: 'Project Type', value: escapeHtml(displayValue(overviewSummary.project_type)) },
        { label: 'Website', value: overviewSummary.website_url ? `<a href="${escapeHtml(overviewSummary.website_url)}" target="_blank" rel="noreferrer">${escapeHtml(overviewSummary.website_url)}</a>` : '-' }
      ])
    );

    const alerts = [];
    if (toArray(readiness.priorities && readiness.priorities.critical).length) alerts.push('Critical launch blockers still exist and should be reviewed first.');
    if (!connectorSources.length) alerts.push('No connected sources are configured yet.');
    if (!overviewSummary.market) alerts.push('Project market is not fully defined.');
    if (!overviewSummary.language) alerts.push('Project language is not fully defined.');
    if (!alerts.length) alerts.push('System is ready for structured launch preparation. Clean the wave, select hero product, and begin content scheduling.');

    safeSetHtml(
      'overviewAlerts',
      renderBadgeList(alerts, {
        badgeTone: 'info',
        badgeLabel: 'Note',
        emptyMessage: 'No alerts available.'
      })
    );
  }

  function renderCampaignsTab() {
    const readiness = state.data.readiness || {};
    const dashboard = readiness.dashboard || {};
    const activity = state.data.activity || {};
    const scheduledJobs = toArray(activity.scheduled_jobs);
    const executionResults = toArray(activity.execution_results);

    safeSetHtml(
      'campaignsPanel',
      renderKeyValueGrid([
        { label: 'Campaign', value: 'Launch Wave 1' },
        { label: 'Status', value: renderStatusBadge('preparing', 'Preparing') },
        { label: 'Hero Product', value: 'Not selected yet' },
        { label: 'Execution Mode', value: escapeHtml(displayValue((state.data.overview || {}).overview?.execution_mode)) },
        { label: 'Next Step', value: escapeHtml(toArray(dashboard.next_best_actions)[0] || 'Clean launch wave and assign hero product') }
      ])
    );

    safeSetHtml(
      'campaignsKpiPanel',
      renderKeyValueGrid([
        { label: 'Scheduled Jobs', value: escapeHtml(String(scheduledJobs.length)) },
        { label: 'Execution Results', value: escapeHtml(String(executionResults.length)) },
        { label: 'Campaign Queue', value: renderStatusBadge(scheduledJobs.length ? 'warning' : 'info', scheduledJobs.length ? 'Queue active' : 'No queue yet') },
        { label: 'Publish State', value: renderStatusBadge('warning', 'Semi-auto recommended') }
      ])
    );
  }

  function renderContentTab() {
    const registryAssets = toArray((state.data.registry || {}).assets);
    const routedAssets = toArray((((state.data.assets || {}).routes || {}).routed_assets));

    safeSetHtml(
      'contentPanel',
      renderKeyValueGrid([
        { label: 'Posts', value: 'Pending connection' },
        { label: 'Reels', value: 'Pending connection' },
        { label: 'Captions', value: 'Pending connection' },
        { label: 'Routed Assets', value: escapeHtml(String(routedAssets.length)) },
        { label: 'Registered Media', value: escapeHtml(String(registryAssets.length)) }
      ])
    );

    safeSetHtml(
      'contentPreviewPanel',
      renderEmptyState('Content preview will appear here after connecting campaign and content queues.')
    );
  }

  function renderAdsTab() {
    safeSetHtml(
      'adsPanel',
      renderKeyValueGrid([
        { label: 'Meta Ads', value: renderStatusBadge('warning', 'Not connected yet') },
        { label: 'TikTok Ads', value: renderStatusBadge('warning', 'Not connected yet') },
        { label: 'Google Ads', value: renderStatusBadge('info', 'Planned next') },
        { label: 'Budget Control', value: renderStatusBadge('info', 'UI ready / logic next') }
      ])
    );

    safeSetHtml(
      'adsMetricsPanel',
      renderEmptyState('Paid media metrics will appear here after connecting ads sources and budget tracking.')
    );
  }

  function renderTrackingTab() {
    const activity = state.data.activity || {};
    const executionResults = toArray(activity.execution_results);

    safeSetHtml(
      'trackingPanel',
      renderKeyValueGrid([
        { label: 'Tracked Results', value: escapeHtml(String(executionResults.length)) },
        { label: 'UTM Tracking', value: renderStatusBadge('warning', 'Needs UI wiring') },
        { label: 'Conversions', value: '-' },
        { label: 'Orders', value: '-' }
      ])
    );

    safeSetHtml(
      'trackingInsightsPanel',
      renderEmptyState('AI insights and asset performance ranking will appear here after performance data starts flowing.')
    );
  }

  function renderAutomationTab() {
    const activity = state.data.activity || {};
    const scheduledJobs = toArray(activity.scheduled_jobs);

    safeSetHtml(
      'automationPanel',
      renderKeyValueGrid([
        { label: 'Scheduled Jobs', value: escapeHtml(String(scheduledJobs.length)) },
        { label: 'Workflow Status', value: renderStatusBadge(scheduledJobs.length ? 'progressing' : 'info', scheduledJobs.length ? 'Active' : 'Idle') },
        { label: 'Mode', value: renderStatusBadge('warning', 'Semi-auto first') },
        { label: 'Manual Override', value: renderStatusBadge('info', 'Available next') }
      ])
    );

    safeSetHtml(
      'automationLogsPanel',
      scheduledJobs.length
        ? renderTable(
            ['Job ID', 'Channel', 'Status', 'Scheduled For'],
            scheduledJobs.map((job) => [
              escapeHtml(displayValue(job.job_id)),
              escapeHtml(displayValue(job.channel)),
              renderStatusBadge(job.status || 'scheduled', formatKey(job.status || 'scheduled')),
              escapeHtml(displayValue(job.scheduled_for))
            ]),
            'No scheduled jobs yet.'
          )
        : renderEmptyState('No automation logs are available yet.')
    );
  }

  function renderGovernanceTab() {
    const readiness = state.data.readiness || {};
    const missingAssets = toArray(((state.data.assets || {}).missing_assets || {}).missing);

    safeSetHtml(
      'governancePanel',
      renderKeyValueGrid([
        { label: 'Approvals', value: renderStatusBadge('warning', 'Needs UI wiring') },
        { label: 'AI Safety', value: renderStatusBadge('success', 'Guardrails available') },
        { label: 'Claims Review', value: renderStatusBadge('warning', 'Manual review recommended') },
        { label: 'Compliance Docs', value: missingAssets.length ? renderStatusBadge('warning', 'Some gaps found') : renderStatusBadge('success', 'Available') }
      ])
    );

    safeSetHtml(
      'governanceAlertsPanel',
      renderBadgeList(
        missingAssets.length ? missingAssets.map(formatKey) : ['No major compliance alert is currently reported from asset requirements.'],
        {
          badgeTone: missingAssets.length ? 'warning' : 'success',
          badgeLabel: missingAssets.length ? 'Gap' : 'Status',
          emptyMessage: 'No compliance alerts are available.'
        }
      )
    );
  }

  function renderFilesTree() {
    const tree = toArray((state.data.tree || {}).tree);

    if (!tree.length) {
      return renderEmptyState('No folder data loaded yet.');
    }

    return `
      <div class="folder-grid">
        ${tree.map((folder) => {
          const files = toArray(folder.files);
          return `
            <article class="folder-card">
              <div class="row-between">
                <h3>${escapeHtml(formatKey(folder.folder))}</h3>
                ${renderStatusBadge(files.length ? 'success' : 'warning', `${files.length} file(s)`)}
              </div>
              ${
                files.length
                  ? `<ul class="file-list">
                      ${files.map((file) => `
                        <li>
                          <div>
                            <div>${escapeHtml(file)}</div>
                            <div class="muted mono">${escapeHtml(folder.folder)}</div>
                          </div>
                          <button
                            class="tiny-button"
                            type="button"
                            data-preview-project="${escapeHtml(state.currentProject)}"
                            data-preview-type="${escapeHtml(folder.folder)}"
                            data-preview-filename="${escapeHtml(file)}">
                            Preview
                          </button>
                        </li>
                      `).join('')}
                    </ul>`
                  : '<p class="muted">No files yet in this folder.</p>'
              }
            </article>
          `;
        }).join('')}
      </div>
    `;
  }

  function renderFilesPreviewPanel() {
    const registryAssets = toArray((state.data.registry || {}).assets);
    const routedAssets = toArray((((state.data.assets || {}).routes || {}).routed_assets));

    return renderKeyValueGrid([
      { label: 'Registered Legacy Assets', value: escapeHtml(String(registryAssets.length)) },
      { label: 'Routed Assets', value: escapeHtml(String(routedAssets.length)) },
      { label: 'Preview State', value: 'Use the Preview buttons or upload a file' },
      { label: 'Actions', value: 'Preview now / rename-delete-move next phase' }
    ]);
  }

  function renderFilesTab() {
    safeSetHtml('filesTreePanel', renderFilesTree());
    safeSetHtml('filesPreviewPanel', renderFilesPreviewPanel());
  }

  function updateSidebarSnapshot() {
    const overview = state.data.overview || {};
    const summary = overview.overview || {};
    const readiness = state.data.readiness || {};
    const dashboard = readiness.dashboard || {};
    const alignment = readiness.alignment || {};
    const connectors = state.data.connectors || {};
    const connectorReadiness = connectors.readiness || {};
    const activity = state.data.activity || {};
    const routedAssets = toArray(((((state.data.assets || {}).routes) || {}).routed_assets));
    const criticalGaps = toArray(((state.data.readiness || {}).priorities || {}).critical);
    const connectorSources = Object.keys((connectors.sources && connectors.sources.sources) || {});

    safeSetText('kpiProject', state.currentProject || 'No project selected');
    safeSetText('kpiReadinessScore', `${displayValue(dashboard.readiness_score, '0')}%`);
    safeSetText('kpiConnectorReadiness', `${displayValue(connectorReadiness.readiness_score, '0')}%`);
    safeSetText('kpiAlignmentStatus', formatKey(alignment.status || 'unknown'));
    safeSetText('kpiTotalAssets', String(routedAssets.length));
    safeSetText('kpiCriticalGaps', String(criticalGaps.length));
    safeSetText('kpiScheduledJobs', String(toArray(activity.scheduled_jobs).length));
    safeSetText('kpiExecutionResults', String(toArray(activity.execution_results).length));
    safeSetText('kpiConnectedSources', String(connectorSources.length));

    safeSetHtml('heroProjectContext', `${escapeHtml(state.currentProject || 'No project selected')} ${state.currentProject ? renderStatusBadge('info', 'Active context') : ''}`);
    safeSetHtml('heroExecutionMode', summary.execution_mode ? renderStatusBadge(summary.execution_mode, formatKey(summary.execution_mode)) : '-');
    safeSetHtml('heroReadinessStatus', dashboard.readiness_status ? renderStatusBadge(dashboard.readiness_status, formatKey(dashboard.readiness_status)) : '-');
    safeSetHtml('heroAlignmentStatus', alignment.status ? renderStatusBadge(alignment.status, formatKey(alignment.status)) : '-');
  }

  function renderAllPanels() {
    updateApiHealth();
    updateAssetTypeDetails();
    renderErrorSummary();
    renderTopStrip();
    renderDecisionArea();
    updateSidebarSnapshot();
    renderOverviewTab();
    renderCampaignsTab();
    renderContentTab();
    renderAdsTab();
    renderTrackingTab();
    renderAutomationTab();
    renderGovernanceTab();
    renderFilesTab();
    setTab(state.activeTab);
  }

  async function refreshCurrentProject() {
    clearMessage();

    if (!state.currentProject) {
      state.data = createEmptyProjectData();
      renderAllPanels();
      return;
    }

    const refreshButton = $('refreshButton');
    const oldLabel = refreshButton ? refreshButton.textContent : 'Refresh All';
    if (refreshButton) {
      refreshButton.disabled = true;
      refreshButton.textContent = 'Refreshing…';
    }

    try {
      await loadProjectData(state.currentProject);
      renderAllPanels();
    } catch (error) {
      setMessage(buildFriendlyAlert('refresh', error.message), 'error');
      renderAllPanels();
    } finally {
      if (refreshButton) {
        refreshButton.disabled = false;
        refreshButton.textContent = oldLabel;
      }
    }
  }

  async function refreshAll() {
    clearMessage();
    try {
      await ensureApiReady();
      if (!state.projects.length) {
        await loadProjects();
      }
      await refreshCurrentProject();
    } catch (error) {
      setMessage(buildFriendlyAlert('api', error.message), 'error');
      renderAllPanels();
    }
  }

  async function uploadFile() {
    clearMessage();

    const project = state.currentProject;
    const assetType = exists('assetTypeSelectAssets') ? $('assetTypeSelectAssets').value : '';
    const fileInput = $('assetFileInput');
    const file = fileInput && fileInput.files ? fileInput.files[0] : null;

    if (!project || !assetType || !file) {
      setMessage({
        title: 'Upload needs more information',
        body: 'Select a project, choose an asset type, and attach a file before uploading.'
      }, 'error');
      return;
    }

    const form = new FormData();
    form.append('project', project);
    form.append('type', assetType);
    form.append('file', file);

    const button = $('uploadButton');
    const oldLabel = button ? button.textContent : 'Upload & Register';

    if (button) {
      button.disabled = true;
      button.textContent = 'Uploading…';
    }

    try {
      const data = await apiFetch('media/upload', {
        method: 'POST',
        body: form
      });

      if (fileInput) fileInput.value = '';
      renderPreviewFromFile(null);
      await refreshAll();

      setMessage({
        title: 'Upload completed',
        body: `${data.filename} was uploaded successfully.${data.upload_mode ? ` Mode: ${data.upload_mode}.` : ''}`
      }, 'success');
    } catch (error) {
      setMessage(buildFriendlyAlert('upload', error.message), 'error');
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = oldLabel;
      }
    }
  }

  function previewAsset(project, type, filename) {
    const url = buildApiUrl(`media/file/${encodeURIComponent(project)}/${encodeURIComponent(type)}/${encodeURIComponent(filename)}`);
    renderPreviewFromUrl(url, type, filename);
  }

  function handleDocumentClick(event) {
    const tabButton = event.target.closest('.tab-button[data-tab]');
    if (tabButton) {
      event.preventDefault();
      setTab(tabButton.dataset.tab);
      return;
    }

    const previewButton = event.target.closest('[data-preview-project]');
    if (previewButton) {
      previewAsset(
        previewButton.dataset.previewProject,
        previewButton.dataset.previewType,
        previewButton.dataset.previewFilename
      );
      return;
    }
  }

  function wireQuickActions() {
    const actions = [
      { id: 'quickCreateCampaign', message: 'Campaign creation UI will be connected in the next step.' },
      { id: 'quickScheduleContent', message: 'Content scheduling UI will be connected in the next step.' },
      { id: 'quickPublishNow', message: 'Publish action will be connected after campaign and content wiring.' },
      { id: 'quickRunAiReview', message: 'AI review workflow will be connected after tracking and optimization wiring.' }
    ];

    actions.forEach((action) => {
      if (!exists(action.id)) return;
      $(action.id).addEventListener('click', function () {
        setMessage({
          title: 'Next wiring step',
          body: action.message
        }, 'info');
      });
    });
  }

  async function bootstrap() {
    document.addEventListener('click', handleDocumentClick);

    if (exists('refreshButton')) $('refreshButton').addEventListener('click', refreshAll);
    if (exists('uploadButton')) $('uploadButton').addEventListener('click', uploadFile);

    if (exists('assetFileInput')) {
      $('assetFileInput').addEventListener('change', function (event) {
        renderPreviewFromFile(event.target.files[0]);
      });
    }

    if (exists('assetTypeSelectAssets')) {
      $('assetTypeSelectAssets').addEventListener('change', updateAssetTypeDetails);
    }

    if (exists('projectSelect')) {
      $('projectSelect').addEventListener('change', async function (event) {
        state.currentProject = event.target.value;
        updateAssetTypeDetails();
        await refreshCurrentProject();
      });
    }

    wireQuickActions();
    renderAllPanels();
    setTab('overview');

    try {
      await ensureApiReady();
    } catch (error) {
      setMessage(buildFriendlyAlert('api', error.message), 'error');
      renderAllPanels();
      return;
    }

    try {
      await loadProjects();
    } catch (error) {
      setPanelError('projects', error.message);
      setMessage(buildFriendlyAlert('projects', error.message), 'error');
    }

    try {
      await loadAssetCatalog();
    } catch (error) {
      setPanelError('catalog', error.message);
    }

    renderAllPanels();
    await refreshCurrentProject();
    setTab('overview');
  }

  bootstrap().catch(function (error) {
    setMessage(buildFriendlyAlert('init', error.message), 'error');
  });
}());
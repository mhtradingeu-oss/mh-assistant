const path = require('path');
const {
  ensureDir,
  ensureJsonFile,
  readJsonFile,
  readJsonFileDurable,
  writeJsonFile
} = require('../integrations/storage');
const {
  normalizeProjectSlug,
  resolveProjectPath
} = require('../security/project-isolation');

const PROJECTS_DIR = path.join(process.env.MH_ASSISTANT_ROOT || path.resolve(__dirname, '../../../..'), 'data', 'projects');
const BACKBONE_VERSION = 'mh-ops-backbone-v2';

// Canonical defaults for policy_rules — these are the authoritative safe values.
// Any governance file that is missing policy_rules (or missing individual keys)
// will be merged with these at read-time so enforcement never silently bypasses.
const DEFAULT_POLICY_RULES = {
  approval_before_publish: true,
  high_risk_claim_review_required: true,
  brand_safety_review_required: true,
  allow_admin_override: true,
  auto_escalate_critical_risk: true,
  freeze_publishing: false,
  require_approval_for_team_model_changes: true,
  require_approval_for_source_registry_changes: true,
  require_approval_for_project_setup_authority_changes: true,
  block_team_model_changes: false,
  block_source_registry_changes: false,
  block_project_setup_authority_changes: false
};

const MAX_ITEMS = {
  campaigns: 150,
  contentItems: 400,
  mediaJobs: 400,
  workflowRuns: 250,
  aiCommands: 300,
  aiArtifacts: 500,
  aiRecommendations: 500,
  aiMemory: 300,
  approvals: 300,
  tasks: 400,
  notifications: 400,
  queue: 400,
  events: 1000,
  handoffs: 250
};

const STATUS_MODELS = {
  campaigns: {
    statuses: ['draft', 'planned', 'active', 'paused', 'completed', 'archived'],
    lifecycle: ['draft', 'review', 'ready', 'active', 'closed']
  },
  content_items: {
    statuses: ['draft', 'in_review', 'approved', 'scheduled', 'published', 'archived'],
    lifecycle: ['draft', 'review', 'approved', 'distribution', 'closed'],
    approval_statuses: ['not_requested', 'pending', 'approved', 'rejected'],
    publish_statuses: ['draft', 'scheduled', 'published', 'failed']
  },
  media_jobs: {
    statuses: ['requested', 'queued', 'processing', 'completed', 'failed', 'cancelled'],
    lifecycle: ['requested', 'prepared', 'running', 'review', 'closed'],
    approval_states: ['not_requested', 'pending', 'approved', 'rejected']
  },
  workflow_runs: {
    statuses: ['queued', 'running', 'completed', 'failed', 'cancelled'],
    lifecycle: ['queued', 'running', 'completed', 'closed']
  },
  ai_commands: {
    statuses: ['queued', 'running', 'completed', 'failed', 'cancelled'],
    intents: ['inspect', 'task', 'workflow', 'campaign', 'content', 'media', 'approval', 'recommendation']
  },
  ai_artifacts: {
    statuses: ['draft', 'saved', 'routed', 'archived'],
    types: ['ai_response', 'workflow_output', 'recommendation_bundle', 'memory_snapshot']
  },
  ai_recommendations: {
    statuses: ['open', 'accepted', 'routed', 'completed', 'dismissed'],
    route_targets: ['campaign-studio', 'content-studio', 'media-studio', 'publishing', 'ads-manager', 'task-center', 'governance']
  },
  ai_memory: {
    scopes: ['project', 'campaign', 'workflow', 'channel', 'audience', 'content'],
    statuses: ['active', 'archived']
  },
  approvals: {
    statuses: ['pending', 'approved', 'rejected', 'changes_requested', 'escalated', 'overridden', 'cancelled'],
    lifecycle: ['requested', 'reviewing', 'decided', 'escalated', 'closed']
  },
  tasks: {
    statuses: ['open', 'queued', 'in_progress', 'blocked', 'completed', 'cancelled'],
    lifecycle: ['open', 'active', 'blocked', 'done', 'closed'],
    priorities: ['low', 'normal', 'high', 'critical']
  },
  notifications: {
    statuses: ['unread', 'read', 'archived'],
    severities: ['info', 'success', 'warning', 'critical']
  },
  handoffs: {
    statuses: ['available', 'consumed', 'superseded', 'cancelled'],
    lifecycle: ['created', 'available', 'consumed', 'closed']
  },
  events: {
    categories: ['entity', 'workflow', 'approval', 'sync', 'publish', 'ai_routing', 'system']
  },
  execution_bridges: {
    statuses: ['draft', 'ready_for_review', 'manual_publish_ready', 'pending_execution', 'executed', 'failed'],
    bridge_actions: ['execute_publish_package', 'execute_email_package', 'generate_media_from_prompt', 'build_ad_execution_package']
  }
};

const TEAM_ROLE_DEFS = [
  {
    id: 'strategist',
    label: 'Strategist',
    routes: ['home', 'campaign-studio', 'workflows', 'research', 'insights'],
    service_domains: ['campaign', 'research'],
    actions: ['plan_campaign', 'route_work', 'approve_strategy', 'request_research']
  },
  {
    id: 'writer',
    label: 'Writer',
    routes: ['content-studio', 'workflows', 'research'],
    service_domains: ['content'],
    actions: ['draft_content', 'revise_copy', 'handoff_to_review', 'handoff_to_publishing']
  },
  {
    id: 'designer',
    label: 'Designer',
    routes: ['media-studio', 'library', 'workflows'],
    service_domains: ['media'],
    actions: ['create_visuals', 'revise_visuals', 'handoff_media']
  },
  {
    id: 'video_lead',
    label: 'Video Lead',
    routes: ['media-studio', 'library', 'workflows'],
    service_domains: ['media'],
    actions: ['create_video', 'review_video', 'handoff_video']
  },
  {
    id: 'publisher',
    label: 'Publisher',
    routes: ['publishing', 'library', 'workflows'],
    service_domains: ['publishing'],
    actions: ['schedule_publish', 'publish', 'return_for_changes']
  },
  {
    id: 'ads_operator',
    label: 'Ads Operator',
    routes: ['ads-manager', 'campaign-studio', 'workflows', 'insights'],
    service_domains: ['media', 'campaign'],
    actions: ['launch_ads', 'update_budget', 'request_creative', 'analyze_paid']
  },
  {
    id: 'analyst',
    label: 'Analyst',
    routes: ['insights', 'research', 'workflows', 'home'],
    service_domains: ['research', 'governance'],
    actions: ['analyze_performance', 'build_report', 'open_research_task']
  },
  {
    id: 'compliance_reviewer',
    label: 'Compliance Reviewer',
    routes: ['governance', 'content-studio', 'media-studio', 'publishing'],
    service_domains: ['governance'],
    actions: ['review_claims', 'review_brand_safety', 'approve_release', 'escalate_risk']
  },
  {
    id: 'admin',
    label: 'Admin',
    routes: ['home', 'settings', 'integrations', 'governance', 'workflows'],
    service_domains: ['governance'],
    actions: ['override_policy', 'manage_team', 'resolve_escalation', 'manage_permissions']
  }
];

const ROUTE_ROLE_ACCESS = {
  home: ['strategist', 'analyst', 'admin'],
  'campaign-studio': ['strategist', 'ads_operator', 'admin'],
  'content-studio': ['writer', 'strategist', 'compliance_reviewer', 'admin'],
  'media-studio': ['designer', 'video_lead', 'compliance_reviewer', 'admin'],
  publishing: ['publisher', 'compliance_reviewer', 'admin'],
  research: ['strategist', 'analyst', 'writer', 'admin'],
  governance: ['compliance_reviewer', 'admin', 'analyst'],
  'ads-manager': ['ads_operator', 'strategist', 'analyst', 'admin'],
  insights: ['analyst', 'strategist', 'ads_operator', 'admin'],
  integrations: ['admin'],
  workflows: TEAM_ROLE_DEFS.map((role) => role.id),
  library: ['designer', 'video_lead', 'publisher', 'admin'],
  settings: ['admin']
};

const SERVICE_DOMAIN_DEFS = {
  campaign: {
    label: 'Campaign',
    owner_role: 'strategist',
    review_role: 'admin',
    handoff_to: ['writer', 'designer', 'ads_operator', 'analyst'],
    route_target: 'campaign-studio',
    page_permissions: ['campaign-studio', 'workflows', 'insights']
  },
  content: {
    label: 'Content',
    owner_role: 'writer',
    review_role: 'compliance_reviewer',
    handoff_to: ['designer', 'video_lead', 'publisher', 'compliance_reviewer'],
    route_target: 'content-studio',
    page_permissions: ['content-studio', 'workflows', 'publishing']
  },
  media: {
    label: 'Media',
    owner_role: 'designer',
    review_role: 'compliance_reviewer',
    handoff_to: ['publisher', 'ads_operator', 'compliance_reviewer'],
    route_target: 'media-studio',
    page_permissions: ['media-studio', 'workflows', 'publishing']
  },
  publishing: {
    label: 'Publishing',
    owner_role: 'publisher',
    review_role: 'compliance_reviewer',
    handoff_to: ['analyst', 'strategist'],
    route_target: 'publishing',
    page_permissions: ['publishing', 'governance']
  },
  research: {
    label: 'Research',
    owner_role: 'analyst',
    review_role: 'strategist',
    handoff_to: ['strategist', 'writer', 'ads_operator'],
    route_target: 'research',
    page_permissions: ['research', 'workflows', 'insights']
  },
  governance: {
    label: 'Governance',
    owner_role: 'compliance_reviewer',
    review_role: 'admin',
    handoff_to: ['admin'],
    route_target: 'governance',
    page_permissions: ['governance', 'settings']
  }
};

const APPROVAL_DOMAIN_MAP = {
  campaign: 'campaign',
  content_item: 'content',
  media_job: 'media',
  publishing_job: 'publishing',
  workflow_run: 'research',
  approval: 'governance',
  task: 'governance'
};

const ESCALATION_CHAINS = {
  low: ['compliance_reviewer'],
  medium: ['compliance_reviewer', 'strategist'],
  high: ['compliance_reviewer', 'admin'],
  critical: ['compliance_reviewer', 'admin']
};

function normalizeProjectName(projectName) {
  return normalizeProjectSlug(projectName);
}

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asObject(value) {
  return value && typeof value === 'object' ? value : {};
}

function asString(value) {
  if (value == null) {
    return '';
  }

  return String(value).trim();
}

function asReadableString(value, fallback = '') {
  if (value == null) return fallback;
  if (typeof value === 'string') {
    const clean = value.trim();
    return clean === '[object Object]' ? fallback : clean;
  }
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) {
    return value.map((item) => asReadableString(item)).filter(Boolean).join('; ') || fallback;
  }
  if (typeof value === 'object') {
    const title = asReadableString(value.title || value.label || value.name);
    const detail = asReadableString(value.action || value.summary || value.description || value.recommendation || value.reason || value.body || value.value);
    if (title && detail && title !== detail) return `${title}: ${detail}`;
    if (title || detail) return title || detail;
  }
  return fallback;
}

function asBoolean(value, fallback = false) {
  if (typeof value === 'boolean') {
    return value;
  }

  if (value == null) {
    return fallback;
  }

  const normalized = asString(value).toLowerCase();
  if (['true', '1', 'yes'].includes(normalized)) {
    return true;
  }

  if (['false', '0', 'no'].includes(normalized)) {
    return false;
  }

  return fallback;
}

function normalizeRoleKey(value, fallback = '') {
  return asString(value).toLowerCase().replace(/[^a-z0-9]+/g, '_') || fallback;
}

function getRoleDef(roleId) {
  const normalized = normalizeRoleKey(roleId);
  return TEAM_ROLE_DEFS.find((item) => item.id === normalized) || null;
}

function getDomainDef(domainId) {
  return SERVICE_DOMAIN_DEFS[asString(domainId)] || null;
}

function buildDefaultTeamMember(roleDef, index) {
  return {
    id: `${roleDef.id}-member-${index + 1}`,
    name: roleDef.label,
    role: roleDef.id,
    type: 'human',
    availability: 'ready',
    capacity: 'shared',
    page_permissions: asArray(roleDef.routes),
    action_permissions: asArray(roleDef.actions),
    service_domains: asArray(roleDef.service_domains)
  };
}

function normalizeTeamMember(input = {}, index = 0) {
  const source = asObject(input);
  const roleId = normalizeRoleKey(source.role, 'strategist');
  const roleDef = getRoleDef(roleId) || TEAM_ROLE_DEFS[0];

  return {
    id: asString(source.id) || `${roleDef.id}-member-${index + 1}`,
    name: asString(source.name) || roleDef.label,
    role: roleDef.id,
    type: asString(source.type) || 'human',
    availability: asString(source.availability) || 'ready',
    capacity: asString(source.capacity) || 'shared',
    page_permissions: normalizeStringList(source.page_permissions).length
      ? normalizeStringList(source.page_permissions)
      : asArray(roleDef.routes),
    action_permissions: normalizeStringList(source.action_permissions).length
      ? normalizeStringList(source.action_permissions)
      : asArray(roleDef.actions),
    service_domains: normalizeStringList(source.service_domains).length
      ? normalizeStringList(source.service_domains)
      : asArray(roleDef.service_domains)
  };
}

function buildDefaultTeamModel() {
  const createdAt = nowIso();

  return {
    version: 'mh-team-ops-v1',
    members: [
      {
        id: 'mh-assistant-system',
        name: 'MH Assistant',
        role: 'system_orchestrator',
        type: 'system',
        availability: 'online',
        page_permissions: ['workflows', 'governance'],
        action_permissions: ['route_work', 'record_state'],
        service_domains: ['campaign', 'content', 'media', 'publishing', 'research', 'governance']
      },
      ...TEAM_ROLE_DEFS.map((roleDef, index) => buildDefaultTeamMember(roleDef, index))
    ],
    active_role: 'strategist',
    role_matrix: TEAM_ROLE_DEFS.map((roleDef) => ({
      role: roleDef.id,
      label: roleDef.label,
      routes: asArray(roleDef.routes),
      service_domains: asArray(roleDef.service_domains),
      actions: asArray(roleDef.actions)
    })),
    route_permissions: Object.entries(ROUTE_ROLE_ACCESS).map(([route, roles]) => ({
      route,
      roles: asArray(roles)
    })),
    service_model: {
      domains: Object.entries(SERVICE_DOMAIN_DEFS).map(([id, domain]) => ({
        id,
        label: domain.label,
        owner_role: domain.owner_role,
        review_role: domain.review_role,
        handoff_to: asArray(domain.handoff_to),
        route_target: domain.route_target,
        page_permissions: asArray(domain.page_permissions)
      }))
    },
    escalation_chain: ESCALATION_CHAINS,
    updated_at: createdAt
  };
}

function mergeTeamModel(current = {}, patch = {}) {
  const defaults = buildDefaultTeamModel();
  const nextMembers = patch.members !== undefined
    ? asArray(patch.members).map((item, index) => normalizeTeamMember(item, index))
    : asArray(current.members).length
      ? asArray(current.members).map((item, index) => normalizeTeamMember(item, index))
      : defaults.members;

  return {
    ...defaults,
    ...asObject(current),
    ...asObject(patch),
    active_role: normalizeRoleKey(patch.active_role || current.active_role || defaults.active_role, defaults.active_role),
    members: nextMembers,
    role_matrix: defaults.role_matrix,
    route_permissions: defaults.route_permissions,
    service_model: defaults.service_model,
    escalation_chain: {
      ...defaults.escalation_chain,
      ...asObject(current.escalation_chain),
      ...asObject(patch.escalation_chain)
    },
    updated_at: nowIso()
  };
}

function readTeamModel(projectName) {
  const paths = getOperationsPaths(projectName);
  let raw;
  try {
    raw = readJsonFileDurable(paths.teamPath);
  } catch (err) {
    console.error(`[backbone] readTeamModel: team file corrupt for project ${projectName}: ${err.message}`);
    throw err;
  }
  return mergeTeamModel(asObject(raw));
}

function updateTeamModel(projectName, patch = {}, actor = 'mh-assistant') {
  const paths = getOperationsPaths(projectName);
  let raw;
  try {
    raw = readJsonFileDurable(paths.teamPath);
  } catch (err) {
    console.error(`[backbone] updateTeamModel: team file corrupt for project ${projectName}: ${err.message}`);
    throw err;
  }
  const next = mergeTeamModel(asObject(raw), patch);

  writeJsonFile(paths.teamPath, next);
  updateSystem(paths);
  appendEvent(paths.project, {
    category: 'system',
    type: 'team_model_updated',
    entity_type: 'team',
    entity_id: 'default',
    title: 'Team operations model updated',
    summary: 'Role routing, permissions, or assignment settings changed.',
    actor,
    metadata: {
      active_role: next.active_role,
      member_count: asArray(next.members).length
    }
  });

  return next;
}

function findTeamMemberByRole(team, roleId) {
  const normalizedRole = normalizeRoleKey(roleId);
  return asArray(team?.members).find((member) => normalizeRoleKey(member.role) === normalizedRole) || null;
}

function roleLabel(roleId) {
  return getRoleDef(roleId)?.label || asString(roleId);
}

function roleDisplay(team, roleId) {
  const member = findTeamMemberByRole(team, roleId);
  return member?.name || roleLabel(roleId) || 'Unassigned';
}

function inferServiceDomain(entityType, record = {}) {
  const normalizedType = asString(entityType);
  if (APPROVAL_DOMAIN_MAP[normalizedType]) {
    return APPROVAL_DOMAIN_MAP[normalizedType];
  }

  const routeTarget = asString(record.route_target || record.route || record.destination_page);
  if (routeTarget === 'campaign-studio' || routeTarget === 'ads-manager') return 'campaign';
  if (routeTarget === 'content-studio') return 'content';
  if (routeTarget === 'media-studio') return 'media';
  if (routeTarget === 'publishing') return 'publishing';
  if (routeTarget === 'research' || routeTarget === 'insights') return 'research';
  if (routeTarget === 'governance') return 'governance';

  const requestType = asString(record.request_type || record.type).toLowerCase();
  if (/video|reel|motion|short/.test(requestType)) return 'media';
  return 'campaign';
}

function inferPrimaryRole(entityType, record = {}, team = null) {
  const domainId = inferServiceDomain(entityType, record);
  const domain = getDomainDef(domainId) || {};
  let ownerRole = domain.owner_role || 'strategist';

  if (asString(entityType) === 'media_job') {
    const requestType = asString(record.request_type || record.type).toLowerCase();
    if (/video|reel|motion|short/.test(requestType)) {
      ownerRole = 'video_lead';
    } else {
      ownerRole = 'designer';
    }
  }

  return {
    service_domain: domainId,
    route_target: asString(record.route_target || domain.route_target),
    owner_role: normalizeRoleKey(record.owner_role || ownerRole, ownerRole),
    reviewer_role: normalizeRoleKey(record.reviewer_role || domain.review_role, domain.review_role || 'admin'),
    handoff_roles: normalizeStringList(record.handoff_roles).length
      ? normalizeStringList(record.handoff_roles)
      : asArray(domain.handoff_to),
    owner_display: roleDisplay(team, record.owner_role || ownerRole),
    reviewer_display: roleDisplay(team, record.reviewer_role || domain.review_role)
  };
}

function getEscalationChain(riskLevel) {
  const normalized = asString(riskLevel).toLowerCase() || 'medium';
  return asArray(ESCALATION_CHAINS[normalized] || ESCALATION_CHAINS.medium);
}

function normalizeNotes(value) {
  if (Array.isArray(value)) {
    return value.map((item) => asString(item)).filter(Boolean);
  }

  const text = asString(value);
  return text ? [text] : [];
}

function normalizeStringList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => asReadableString(item)).filter(Boolean);
  }

  const text = asReadableString(value);
  return text
    ? text.split(',').map((item) => asString(item)).filter(Boolean)
    : [];
}

function normalizeLinkedEntity(input = {}) {
  const entityType = asString(input.entity_type || input.type);
  const entityId = asString(input.entity_id || input.id);

  if (!entityType && !entityId) {
    return null;
  }

  return {
    entity_type: entityType,
    entity_id: entityId,
    route: asString(input.route),
    label: asString(input.label)
  };
}

function normalizeCommentEntry(input = {}, fallbackActor = 'mh-assistant') {
  const source = typeof input === 'string' ? { text: input } : asObject(input);
  const text = asString(source.text || source.note || source.body || source.comment);

  if (!text) {
    return null;
  }

  return {
    id: asString(source.id) || createId('comment'),
    type: asString(source.type) || 'comment',
    text,
    author: asString(source.author || source.actor || source.created_by) || fallbackActor,
    created_at: asString(source.created_at) || nowIso()
  };
}

function normalizeCommentList(value, fallbackActor = 'mh-assistant') {
  const list = Array.isArray(value)
    ? value
    : value == null
      ? []
      : [value];

  return list
    .map((item) => normalizeCommentEntry(item, fallbackActor))
    .filter(Boolean);
}

function appendCommentList(current = [], additions = [], fallbackActor = 'mh-assistant', maxItems = 50) {
  const next = [
    ...normalizeCommentList(additions, fallbackActor),
    ...normalizeCommentList(current, fallbackActor)
  ];

  return next.slice(0, maxItems);
}

function normalizeRequestList(value, fallbackActor = 'mh-assistant') {
  const list = Array.isArray(value)
    ? value
    : value == null
      ? []
      : [value];

  return list
    .map((item) => {
      const source = typeof item === 'string' ? { prompt: item } : asObject(item);
      const prompt = asString(source.prompt || source.request || source.text);

      if (!prompt) {
        return null;
      }

      return {
        id: asString(source.id) || createId('aireq'),
        type: asString(source.type) || 'improve',
        prompt,
        status: asString(source.status) || 'open',
        requested_by: asString(source.requested_by || source.actor) || fallbackActor,
        created_at: asString(source.created_at) || nowIso()
      };
    })
    .filter(Boolean);
}

function appendRequestList(current = [], additions = [], fallbackActor = 'mh-assistant', maxItems = 25) {
  return [
    ...normalizeRequestList(additions, fallbackActor),
    ...normalizeRequestList(current, fallbackActor)
  ].slice(0, maxItems);
}

function normalizeRevisionEntry(input = {}, fallbackActor = 'mh-assistant') {
  const source = asObject(input);

  return {
    id: asString(source.id) || createId('rev'),
    revision: Number(source.revision || 1) || 1,
    title: asString(source.title),
    note: asString(source.note),
    draft: asString(source.draft),
    created_at: asString(source.created_at) || nowIso(),
    actor: asString(source.actor || source.author || source.created_by) || fallbackActor
  };
}

function normalizeRevisionList(value, fallbackActor = 'mh-assistant') {
  return asArray(value)
    .map((item) => normalizeRevisionEntry(item, fallbackActor))
    .filter((item) => item.title || item.draft || item.note);
}

function normalizeOutputVersionEntry(input = {}, fallbackActor = 'mh-assistant') {
  const source = asObject(input);

  return {
    id: asString(source.id) || createId('outputv'),
    label: asString(source.label) || 'Output version',
    status: asString(source.status) || 'draft',
    preview_url: asString(source.preview_url || source.previewUrl),
    file_path: asString(source.file_path || source.filePath),
    outputs: asArray(source.outputs),
    metadata: asObject(source.metadata),
    created_at: asString(source.created_at) || nowIso(),
    actor: asString(source.actor || source.author || source.created_by) || fallbackActor
  };
}

function normalizeOutputVersionList(value, fallbackActor = 'mh-assistant') {
  return asArray(value)
    .map((item) => normalizeOutputVersionEntry(item, fallbackActor))
    .filter((item) => item.label || item.preview_url || item.file_path || item.outputs.length);
}

function normalizePreviewHistoryEntry(input = {}, fallbackActor = 'mh-assistant') {
  const source = asObject(input);
  const previewLabel = asString(source.preview_label || source.label || source.title);

  if (!previewLabel && !asString(source.preview_url || source.previewUrl)) {
    return null;
  }

  return {
    id: asString(source.id) || createId('preview'),
    preview_label: previewLabel || 'Preview',
    preview_url: asString(source.preview_url || source.previewUrl),
    note: asString(source.note),
    created_at: asString(source.created_at) || nowIso(),
    actor: asString(source.actor || source.author || source.created_by) || fallbackActor
  };
}

function appendPreviewHistory(current = [], additions = [], fallbackActor = 'mh-assistant', maxItems = 30) {
  const list = Array.isArray(additions)
    ? additions
    : additions == null
      ? []
      : [additions];

  return [
    ...list.map((item) => normalizePreviewHistoryEntry(item, fallbackActor)).filter(Boolean),
    ...asArray(current)
  ].slice(0, maxItems);
}

function buildHistoryEntry(action, actor, changes = {}, timestamp = nowIso()) {
  return {
    at: timestamp,
    action: asString(action) || 'updated',
    actor: asString(actor) || 'mh-assistant',
    changes: asObject(changes)
  };
}

function appendHistory(record = {}, action, actor, changes = {}, maxItems = 25) {
  const history = asArray(record.history);
  return [buildHistoryEntry(action, actor, changes), ...history].slice(0, maxItems);
}

function mergeDefined(current = {}, updates = {}) {
  const next = { ...current };

  Object.entries(asObject(updates)).forEach(([key, value]) => {
    if (value !== undefined) {
      next[key] = value;
    }
  });

  return next;
}

function writeLimitedArray(filePath, items, maxItems) {
  writeJsonFile(filePath, asArray(items).slice(0, maxItems));
}

function getOperationsPaths(projectName) {
  const safeProject = normalizeProjectName(projectName);
  const projectDir = resolveProjectPath(PROJECTS_DIR, safeProject).projectRoot;
  const opsDir = path.join(projectDir, 'ops');

  ensureDir(projectDir);
  ensureDir(opsDir);

  const paths = {
    project: safeProject,
    projectDir,
    opsDir,
    systemPath: path.join(opsDir, 'system.json'),
    campaignsPath: path.join(opsDir, 'campaigns.json'),
    contentItemsPath: path.join(opsDir, 'content-items.json'),
    mediaJobsPath: path.join(opsDir, 'media-jobs.json'),
    workflowsPath: path.join(opsDir, 'workflow-runs.json'),
    aiCommandsPath: path.join(opsDir, 'ai-commands.json'),
    aiArtifactsPath: path.join(opsDir, 'ai-artifacts.json'),
    aiRecommendationsPath: path.join(opsDir, 'ai-recommendations.json'),
    aiMemoryPath: path.join(opsDir, 'ai-memory.json'),
    tasksPath: path.join(opsDir, 'tasks.json'),
    approvalsPath: path.join(opsDir, 'approvals.json'),
    notificationsPath: path.join(opsDir, 'notifications.json'),
    queuePath: path.join(opsDir, 'queue.json'),
    teamPath: path.join(opsDir, 'team.json'),
    governancePath: path.join(opsDir, 'governance.json'),
    eventsPath: path.join(opsDir, 'events.json'),
    handoffsPath: path.join(opsDir, 'handoffs.json')
  };

  ensureOperationsFiles(paths);
  return paths;
}

function ensureOperationsFiles(paths) {
  const createdAt = nowIso();

  ensureJsonFile(paths.systemPath, {
    project: paths.project,
    version: BACKBONE_VERSION,
    status: 'operational',
    created_at: createdAt,
    updated_at: createdAt,
    durable_entities: [
      'campaigns',
      'content_items',
      'media_jobs',
      'workflow_runs',
      'ai_commands',
      'ai_artifacts',
      'ai_recommendations',
      'ai_memory',
      'tasks',
      'approvals',
      'notifications',
      'queue',
      'handoffs',
      'events',
      'team'
    ]
  });
  ensureJsonFile(paths.campaignsPath, []);
  ensureJsonFile(paths.contentItemsPath, []);
  ensureJsonFile(paths.mediaJobsPath, []);
  ensureJsonFile(paths.workflowsPath, []);
  ensureJsonFile(paths.aiCommandsPath, []);
  ensureJsonFile(paths.aiArtifactsPath, []);
  ensureJsonFile(paths.aiRecommendationsPath, []);
  ensureJsonFile(paths.aiMemoryPath, []);
  ensureJsonFile(paths.tasksPath, []);
  ensureJsonFile(paths.approvalsPath, []);
  ensureJsonFile(paths.notificationsPath, []);
  ensureJsonFile(paths.queuePath, []);
  ensureJsonFile(paths.handoffsPath, []);
  ensureJsonFile(paths.teamPath, buildDefaultTeamModel());
  ensureJsonFile(paths.governancePath, {
    approval_required_actions: ['publish', 'launch', 'budget_change', 'integration_reconnect', 'execution_mode_change'],
    risk_levels: ['low', 'medium', 'high', 'critical'],
    execution_policy: {
      semi_auto_requires_approval: true,
      auto_execution_requires_rules: true,
      audit_logging_enabled: true
    },
    policy_rules: {
      approval_before_publish: true,
      high_risk_claim_review_required: true,
      brand_safety_review_required: true,
      allow_admin_override: true,
      auto_escalate_critical_risk: true,
      freeze_publishing: false,
      require_approval_for_team_model_changes: true,
      require_approval_for_source_registry_changes: true,
      require_approval_for_project_setup_authority_changes: true,
      block_team_model_changes: false,
      block_source_registry_changes: false,
      block_project_setup_authority_changes: false
    },
    approval_owners: {
      content: 'Marketing lead',
      media: 'Creative lead',
      campaign: 'Operations lead',
      publishing: 'Publisher',
      compliance: 'Compliance Reviewer',
      overrides: 'Admin'
    },
    settings_bridge: {
      source: 'ops-default',
      synced_at: '',
      approval_mode: 'Only high-risk',
      claim_safety_mode: 'Strict evidence required',
      approval_before_publish: true
    },
    active_overrides: [],
    mobile_ready: true,
    updated_at: createdAt
  });
  ensureJsonFile(paths.eventsPath, []);
}

function updateSystem(paths, patch = {}) {
  // Use readJsonFileDurable: corruption in the system file must not be silently
  // swallowed — it would cause a silent overwrite of the entire system record.
  // If the file does not exist yet, fall back to {} (first-time init path).
  let currentRaw;
  try {
    currentRaw = readJsonFileDurable(paths.systemPath);
  } catch (err) {
    // System file is corrupt — log and re-throw so the caller sees a 500
    console.error(`[backbone] updateSystem: system file is corrupt for project ${paths.project}: ${err.message}`);
    throw err;
  }
  const current = asObject(currentRaw);
  const next = {
    ...current,
    ...patch,
    project: paths.project,
    version: BACKBONE_VERSION,
    status: 'operational',
    durable_entities: [
      'campaigns',
      'content_items',
      'media_jobs',
      'workflow_runs',
      'ai_commands',
      'ai_artifacts',
      'ai_recommendations',
      'ai_memory',
      'tasks',
      'approvals',
      'notifications',
      'queue',
      'handoffs',
      'events',
      'team'
    ],
    updated_at: nowIso()
  };

  writeJsonFile(paths.systemPath, next);
  return next;
}

/**
 * readCollection — reads a durable JSON array file.
 *
 * Uses readJsonFileDurable so corrupt files are quarantined and an error is
 * thrown rather than silently returning [] and risking a subsequent write that
 * wipes real data. Returns [] only when the file genuinely does not exist yet.
 */
function readCollection(filePath) {
  let raw;
  try {
    raw = readJsonFileDurable(filePath);
  } catch (err) {
    // File exists but is corrupt — error has already quarantined it.
    // Re-throw so the HTTP layer returns a 500 rather than empty data.
    console.error(`[backbone] readCollection: corrupt file quarantined: ${filePath} — ${err.message}`);
    throw err;
  }
  // null means the file does not exist yet — that is a valid empty-collection state
  return raw === null ? [] : asArray(raw);
}

function writeCollection(filePath, items, maxItems) {
  writeLimitedArray(filePath, items, maxItems);
}

function findById(items, id) {
  const targetId = asString(id);
  return items.find((item) => asString(item.id) === targetId) || null;
}

function upsertById(items, record) {
  const nextItems = asArray(items).filter((item) => asString(item.id) !== asString(record.id));
  nextItems.unshift(record);
  return nextItems;
}

function listItems(items, options = {}) {
  const limit = Number(options.limit || 20) || 20;
  return asArray(items).slice(0, limit);
}

function inferEventCategory(type) {
  const value = asString(type);

  if (value.includes('approval')) return 'approval';
  if (value.includes('workflow')) return 'workflow';
  if (value.includes('publish')) return 'publish';
  if (value.includes('sync')) return 'sync';
  if (value.includes('routing') || value.includes('handoff') || value.includes('ai_')) return 'ai_routing';
  if (value.includes('campaign') || value.includes('content') || value.includes('media') || value.includes('task')) return 'entity';
  return 'system';
}

function appendEvent(projectName, event = {}) {
  const paths = getOperationsPaths(projectName);
  const items = readCollection(paths.eventsPath);
  const timestamp = asString(event.timestamp) || nowIso();
  const nextEvent = {
    id: asString(event.id) || createId('evt'),
    project: paths.project,
    category: asString(event.category) || inferEventCategory(event.type),
    type: asString(event.type) || 'system_event',
    entity_type: asString(event.entity_type),
    entity_id: asString(event.entity_id),
    title: asString(event.title) || 'System event',
    summary: asString(event.summary),
    actor: asString(event.actor) || 'mh-assistant',
    timestamp,
    metadata: asObject(event.metadata)
  };

  items.unshift(nextEvent);
  writeCollection(paths.eventsPath, items, MAX_ITEMS.events);
  updateSystem(paths);
  return nextEvent;
}

function createNotification(projectName, input = {}) {
  const paths = getOperationsPaths(projectName);
  const items = readCollection(paths.notificationsPath);
  const status = asBoolean(input.read) ? 'read' : asString(input.status) || 'unread';
  const notification = {
    id: asString(input.id) || createId('note'),
    project: paths.project,
    type: asString(input.type || input.category) || 'system',
    category: asString(input.category || input.type) || 'system',
    message: asString(input.message || input.body || input.summary),
    title: asString(input.title) || 'New update',
    body: asString(input.body || input.summary || input.message),
    severity: asString(input.severity) || 'info',
    linked_entity: normalizeLinkedEntity(input.linked_entity || input),
    entity_type: asString(input.entity_type),
    entity_id: asString(input.entity_id),
    read: status !== 'unread',
    status,
    created_at: asString(input.created_at) || nowIso(),
    updated_at: nowIso()
  };

  items.unshift(notification);
  writeCollection(paths.notificationsPath, items, MAX_ITEMS.notifications);
  updateSystem(paths);
  return notification;
}

function listNotifications(projectName, options = {}) {
  const paths = getOperationsPaths(projectName);
  return listItems(readCollection(paths.notificationsPath), options);
}

function markNotification(projectName, notificationId, input = {}) {
  const paths = getOperationsPaths(projectName);
  const items = readCollection(paths.notificationsPath);
  const index = items.findIndex((item) => asString(item.id) === asString(notificationId));

  if (index < 0) {
    throw new Error('Notification not found');
  }

  const current = asObject(items[index]);
  const status = asString(input.status) || (asBoolean(input.read, true) ? 'read' : current.status);
  const next = {
    ...current,
    read: status !== 'unread',
    status,
    updated_at: nowIso()
  };

  items[index] = next;
  writeJsonFile(paths.notificationsPath, items);
  updateSystem(paths);
  return next;
}

function upsertQueueItem(projectName, input = {}) {
  const paths = getOperationsPaths(projectName);
  const items = readCollection(paths.queuePath);
  const entityType = asString(input.entity_type);
  const entityId = asString(input.entity_id);

  if (!entityType || !entityId) {
    throw new Error('Queue item requires entity_type and entity_id');
  }

  const current = items.find((item) =>
    asString(item.entity_type) === entityType && asString(item.entity_id) === entityId
  ) || {};

  const queueItem = {
    id: asString(current.id) || asString(input.id) || createId('queue'),
    project: paths.project,
    queue_type: asString(input.queue_type || current.queue_type) || 'general',
    entity_type: entityType,
    entity_id: entityId,
    title: asString(input.title || current.title) || 'Queue item',
    status: asString(input.status || current.status) || 'queued',
    lifecycle_state: asString(input.lifecycle_state || current.lifecycle_state) || 'active',
    scheduled_for: asString(input.scheduled_for || current.scheduled_for),
    assignee: asString(input.assignee || current.assignee),
    role: normalizeRoleKey(input.role || current.role),
    priority: asString(input.priority || current.priority) || 'normal',
    route: asString(input.route || current.route),
    details: asObject(input.details || current.details),
    updated_at: nowIso(),
    created_at: asString(current.created_at) || nowIso()
  };

  writeCollection(
    paths.queuePath,
    upsertById(items, queueItem),
    MAX_ITEMS.queue
  );
  updateSystem(paths);
  return queueItem;
}

function listQueueItems(projectName, options = {}) {
  const paths = getOperationsPaths(projectName);
  return listItems(readCollection(paths.queuePath), options);
}

function updateLinkedEntity(projectName, entityType, entityId, updater) {
  const paths = getOperationsPaths(projectName);
  const normalizedType = asString(entityType);
  const normalizedId = asString(entityId);

  if (!normalizedType || !normalizedId || typeof updater !== 'function') {
    return null;
  }

  const filePath =
    normalizedType === 'content_item'
      ? paths.contentItemsPath
      : normalizedType === 'media_job'
        ? paths.mediaJobsPath
        : null;
  const maxItems =
    normalizedType === 'content_item'
      ? MAX_ITEMS.contentItems
      : normalizedType === 'media_job'
        ? MAX_ITEMS.mediaJobs
        : 0;

  if (!filePath) {
    return null;
  }

  const items = readCollection(filePath);
  const index = items.findIndex((item) => asString(item.id) === normalizedId);

  if (index < 0) {
    return null;
  }

  const current = asObject(items[index]);
  const next = updater(current, paths);

  if (!next || typeof next !== 'object') {
    return null;
  }

  items[index] = next;
  writeCollection(filePath, items, maxItems);
  updateSystem(paths);
  return next;
}

function updateQueueEntity(projectName, entityType, entityId, patch = {}) {
  const paths = getOperationsPaths(projectName);
  const items = readCollection(paths.queuePath);
  const index = items.findIndex((item) =>
    asString(item.entity_type) === asString(entityType) &&
    asString(item.entity_id) === asString(entityId)
  );

  if (index < 0) {
    return null;
  }

  const current = asObject(items[index]);
  const next = {
    ...current,
    ...asObject(patch),
    details: {
      ...asObject(current.details),
      ...asObject(patch.details)
    },
    updated_at: nowIso()
  };

  items[index] = next;
  writeCollection(paths.queuePath, items, MAX_ITEMS.queue);
  updateSystem(paths);
  return next;
}

/**
 * Normalizes a raw governance file object so that:
 *  - policy_rules is always an object (never null/undefined/non-object)
 *  - Any missing policy_rules key is filled from DEFAULT_POLICY_RULES
 *  - freeze_publishing and approval_before_publish are always explicit booleans
 *
 * This is a pure, non-mutating read-time normalization.
 * It does NOT write back to disk.
 */
function normalizeGovernancePolicy(raw) {
  const doc = asObject(raw);
  const rawRules = doc.policy_rules;
  // If policy_rules is not a plain object (missing, null, array, string, etc.)
  // treat it as empty so all defaults are applied.
  const safeRules = (rawRules && typeof rawRules === 'object' && !Array.isArray(rawRules))
    ? rawRules
    : {};

  const mergedRules = {
    ...DEFAULT_POLICY_RULES,
    ...safeRules,
    // These two critical booleans are always coerced explicitly so
    // string "true"/"false" or numeric 0/1 values from disk are safe.
    freeze_publishing: asBoolean(safeRules.freeze_publishing, DEFAULT_POLICY_RULES.freeze_publishing),
    approval_before_publish: asBoolean(safeRules.approval_before_publish, DEFAULT_POLICY_RULES.approval_before_publish)
  };

  return {
    ...doc,
    policy_rules: mergedRules
  };
}

function getGovernancePolicy(projectName) {
  const paths = getOperationsPaths(projectName);
  let raw;
  try {
    raw = readJsonFileDurable(paths.governancePath);
  } catch (err) {
    // Governance file is corrupt — do not silently bypass enforcement.
    console.error(`[backbone] getGovernancePolicy: governance file corrupt for project ${projectName}: ${err.message}`);
    throw err;
  }
  // null means the file does not exist yet — normalizeGovernancePolicy({}) gives safe defaults
  return normalizeGovernancePolicy(raw === null ? {} : raw);
}

function updateGovernancePolicy(projectName, patch = {}, actor = 'mh-assistant') {
  const paths = getOperationsPaths(projectName);
  const current = getGovernancePolicy(projectName);
  const sourcePatch = { ...asObject(patch) };
  delete sourcePatch.actor;
  const next = {
    ...current,
    ...sourcePatch,
    execution_policy: {
      ...asObject(current.execution_policy),
      ...asObject(sourcePatch.execution_policy)
    },
    policy_rules: {
      ...asObject(current.policy_rules),
      ...asObject(sourcePatch.policy_rules)
    },
    approval_owners: {
      ...asObject(current.approval_owners),
      ...asObject(sourcePatch.approval_owners)
    },
    settings_bridge: {
      ...asObject(current.settings_bridge),
      ...asObject(sourcePatch.settings_bridge)
    },
    active_overrides: Array.isArray(sourcePatch.active_overrides)
      ? sourcePatch.active_overrides
      : asArray(current.active_overrides),
    updated_at: nowIso()
  };

  writeJsonFile(paths.governancePath, next);
  updateSystem(paths);
  appendEvent(paths.project, {
    category: 'system',
    type: 'governance_policy_updated',
    entity_type: 'governance_policy',
    entity_id: 'default',
    title: 'Governance policy updated',
    summary: 'Governance rules were updated and persisted.',
    actor,
    metadata: {
      policy_rules: next.policy_rules,
      settings_bridge: next.settings_bridge
    }
  });

  return next;
}

function appendGovernanceOverride(projectName, input = {}) {
  const policy = getGovernancePolicy(projectName);
  const activeOverrides = asArray(policy.active_overrides);
  const override = {
    id: asString(input.id) || createId('override'),
    entity_type: asString(input.entity_type),
    entity_id: asString(input.entity_id),
    approval_id: asString(input.approval_id),
    action: asString(input.action) || 'override',
    reason: asString(input.reason || input.note),
    actor: asString(input.actor) || 'operator',
    created_at: asString(input.created_at) || nowIso(),
    status: asString(input.status) || 'active'
  };

  const deduped = [
    override,
    ...activeOverrides.filter((item) => asString(item.id) !== override.id)
  ].slice(0, 100);

  return updateGovernancePolicy(projectName, {
    active_overrides: deduped
  }, override.actor);
}

function buildEntitySnapshot(projectName, entityType, entityId) {
  const paths = getOperationsPaths(projectName);
  const normalizedType = asString(entityType);
  const normalizedId = asString(entityId);

  if (!normalizedType || !normalizedId) {
    return null;
  }

  if (normalizedType === 'content_item') {
    return findById(readCollection(paths.contentItemsPath), normalizedId);
  }

  if (normalizedType === 'media_job') {
    return findById(readCollection(paths.mediaJobsPath), normalizedId);
  }

  if (normalizedType === 'campaign') {
    return findById(readCollection(paths.campaignsPath), normalizedId);
  }

  if (normalizedType === 'publishing_job') {
    return readCollection(paths.queuePath).find((item) =>
      asString(item.entity_type) === 'publishing_job' &&
      asString(item.entity_id) === normalizedId
    ) || null;
  }

  return null;
}

function buildPolicyFlags(record = {}, governance = {}) {
  const flags = [];
  const text = [
    asString(record.summary),
    asString(record.decision_note),
    asString(record.draft),
    asString(record.prompt),
    asString(record.brief),
    asString(record.title)
  ].join(' ');

  if (asBoolean(governance.policy_rules?.freeze_publishing) && asString(record.entity_type) === 'publishing_job') {
    flags.push({
      code: 'publishing_frozen',
      severity: 'critical',
      message: 'Publishing is frozen by governance policy.'
    });
  }

  if (/guarantee|clinically|regrow|cure|instant results|100%/i.test(text)) {
    flags.push({
      code: 'high_risk_claim',
      severity: 'high',
      message: 'Potentially unsupported or regulated claim language detected.'
    });
  }

  if (/before\/after|before and after|doctor|medical|prescription/i.test(text)) {
    flags.push({
      code: 'brand_safety_review',
      severity: 'medium',
      message: 'Brand safety review recommended before release.'
    });
  }

  return flags;
}

function buildClaimFlags(record = {}) {
  const text = [
    asString(record.draft),
    asString(record.summary),
    asString(record.title),
    asString(record.prompt),
    asString(record.brief)
  ].join(' ');

  const matches = [
    { regex: /guarantee|guaranteed/i, label: 'Guarantee claim language detected', severity: 'high' },
    { regex: /clinically|dermatologist|doctor recommended/i, label: 'Clinical authority claim detected', severity: 'high' },
    { regex: /regrow|cure|eliminate hair loss/i, label: 'Medical efficacy claim detected', severity: 'critical' },
    { regex: /instant|overnight|in \d+ days/i, label: 'Unverifiable speed/result claim detected', severity: 'medium' }
  ];

  return matches
    .filter((item) => item.regex.test(text))
    .map((item) => ({
      id: createId('claim'),
      severity: item.severity,
      message: item.label
    }));
}

function buildBrandSafetyFlags(record = {}, governance = {}) {
  const text = [
    asString(record.prompt),
    asString(record.brief),
    asString(record.draft),
    asString(record.summary),
    asString(record.title)
  ].join(' ');
  const flags = [];

  if (/celebrity|competitor|trademark|logo swap/i.test(text)) {
    flags.push({
      id: createId('brand'),
      severity: 'high',
      message: 'Third-party identity or trademark risk detected.'
    });
  }

  if (/before\/after|shock|unsafe|violent|nsfw/i.test(text)) {
    flags.push({
      id: createId('brand'),
      severity: 'medium',
      message: 'Content pattern may violate brand safety expectations.'
    });
  }

  if (asString(record.entity_type) === 'media_job' && asBoolean(governance.policy_rules?.brand_safety_review_required, true)) {
    if (!asString(record.approval_state) || asString(record.approval_state) === 'not_requested') {
      flags.push({
        id: createId('brand'),
        severity: 'medium',
        message: 'Media asset has not completed brand safety review.'
      });
    }
  }

  return flags;
}

function buildPublishGuardrails(record = {}, governance = {}) {
  const guardrails = [];
  const details = asObject(record.details);
  const status = asString(record.status || details.source_status);

  if (!asString(record.entity_id)) {
    return guardrails;
  }

  if (!asString(record.scheduled_for) && status !== 'published') {
    guardrails.push({
      id: createId('guard'),
      severity: 'medium',
      message: 'Publishing item has no schedule locked.'
    });
  }

  if (asBoolean(governance.policy_rules?.approval_before_publish, true) && !['approved', 'ready', 'published'].includes(status)) {
    guardrails.push({
      id: createId('guard'),
      severity: 'high',
      message: 'Publishing item is not marked approved/ready under current policy.'
    });
  }

  if (asBoolean(governance.policy_rules?.freeze_publishing)) {
    guardrails.push({
      id: createId('guard'),
      severity: 'critical',
      message: 'Publishing freeze is active.'
    });
  }

  return guardrails;
}

function buildGovernanceSummary(projectName, options = {}) {
  const paths = getOperationsPaths(projectName);
  const governance = getGovernancePolicy(projectName);
  const team = readTeamModel(paths.project);
  const approvals = readCollection(paths.approvalsPath);
  const contentItems = readCollection(paths.contentItemsPath);
  const mediaJobs = readCollection(paths.mediaJobsPath);
  const campaigns = readCollection(paths.campaignsPath);
  const queueItems = readCollection(paths.queuePath);
  const events = readCollection(paths.eventsPath);
  const pendingApprovals = approvals.filter((item) => asString(item.status) === 'pending');
  const escalationApprovals = approvals.filter((item) => asString(item.status) === 'escalated');
  const activeOverrides = asArray(governance.active_overrides).filter((item) => asString(item.status) === 'active');

  const approvalQueue = pendingApprovals.map((approval) => ({
    ...approval,
    entity_snapshot: buildEntitySnapshot(projectName, approval.entity_type, approval.entity_id),
    policy_flags: buildPolicyFlags(approval, governance)
  }));

  const claimReview = [
    ...contentItems,
    ...approvals.filter((item) => ['pending', 'changes_requested', 'escalated'].includes(asString(item.status)))
  ]
    .map((item) => ({
      id: asString(item.id),
      entity_type: asString(item.entity_type) || (item.prompt ? 'media_job' : 'content_item'),
      entity_id: asString(item.entity_id || item.id),
      title: asString(item.title) || 'Claim review item',
      status: asString(item.status || item.approval_status) || 'open',
      claim_flags: buildClaimFlags(item)
    }))
    .filter((item) => item.claim_flags.length);

  const brandSafetyReview = mediaJobs
    .map((item) => ({
      id: item.id,
      entity_type: 'media_job',
      entity_id: item.id,
      title: item.title || `${item.request_type || 'media'} job`,
      status: asString(item.status || item.approval_state),
      brand_safety_flags: buildBrandSafetyFlags(item, governance)
    }))
    .filter((item) => item.brand_safety_flags.length);

  const publishGuardrails = queueItems
    .filter((item) => asString(item.entity_type) === 'publishing_job')
    .map((item) => ({
      ...item,
      publish_guardrails: buildPublishGuardrails(item, governance)
    }))
    .filter((item) => item.publish_guardrails.length || ['scheduled', 'ready', 'failed'].includes(asString(item.status)));

  const policyViolations = [
    ...approvalQueue.flatMap((item) =>
      asArray(item.policy_flags).map((flag) => ({
        id: createId('violation'),
        source: 'approval',
        entity_type: item.entity_type,
        entity_id: item.entity_id,
        title: item.title,
        severity: flag.severity,
        message: flag.message
      }))
    ),
    ...claimReview.flatMap((item) =>
      item.claim_flags.map((flag) => ({
        id: createId('violation'),
        source: 'claim_review',
        entity_type: item.entity_type,
        entity_id: item.entity_id,
        title: item.title,
        severity: flag.severity,
        message: flag.message
      }))
    ),
    ...brandSafetyReview.flatMap((item) =>
      item.brand_safety_flags.map((flag) => ({
        id: createId('violation'),
        source: 'brand_safety',
        entity_type: item.entity_type,
        entity_id: item.entity_id,
        title: item.title,
        severity: flag.severity,
        message: flag.message
      }))
    ),
    ...publishGuardrails.flatMap((item) =>
      item.publish_guardrails.map((flag) => ({
        id: createId('violation'),
        source: 'publish_guardrails',
        entity_type: 'publishing_job',
        entity_id: item.entity_id,
        title: item.title,
        severity: flag.severity,
        message: flag.message
      }))
    )
  ].sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    return (order[a.severity] ?? 99) - (order[b.severity] ?? 99);
  });

  const escalationQueue = [
    ...escalationApprovals,
    ...readCollection(paths.tasksPath).filter((item) =>
      asString(item.source_type) === 'approval' || asString(item.route_target) === 'governance'
    )
  ];

  const auditTimeline = events.slice(0, Number(options.timelineLimit || 40) || 40);

  return {
    project: paths.project,
    generated_at: nowIso(),
    policy: governance,
    review_model: {
      ownership: {
        campaign: roleDisplay(team, 'strategist'),
        content: roleDisplay(team, 'writer'),
        media: roleDisplay(team, 'designer'),
        publishing: roleDisplay(team, 'publisher'),
        compliance: roleDisplay(team, 'compliance_reviewer'),
        admin: roleDisplay(team, 'admin')
      },
      escalation_chain: governance.escalation_chain || ESCALATION_CHAINS
    },
    sections: {
      approval_queue: approvalQueue,
      policy_violations: policyViolations,
      claim_review: claimReview,
      brand_safety_review: brandSafetyReview,
      publish_guardrails: publishGuardrails,
      audit_timeline: auditTimeline,
      override_controls: {
        active_overrides: activeOverrides,
        freeze_publishing: asBoolean(governance.policy_rules?.freeze_publishing),
        allow_admin_override: asBoolean(governance.policy_rules?.allow_admin_override, true)
      },
      escalation_queue: escalationQueue
    },
    coverage: {
      campaigns: campaigns.length,
      content_items: contentItems.length,
      media_jobs: mediaJobs.length,
      publishing_jobs: queueItems.filter((item) => asString(item.entity_type) === 'publishing_job').length,
      pending_approvals: pendingApprovals.length
    }
  };
}

function syncContentQueue(projectName, item = {}) {
  return upsertQueueItem(projectName, {
    queue_type: 'content',
    entity_type: 'content_item',
    entity_id: item.id,
    title: item.title,
    status: item.publish_status || item.approval_status || item.status || 'draft',
    assignee: item.owner,
    role: asString(item.owner_role || item.review_role || 'writer'),
    priority: item.approval_status === 'pending' ? 'high' : 'normal',
    route: 'content-studio',
    details: {
      type: item.type,
      campaign_id: item.campaign_id,
      destination: item.destination,
      publish_status: item.publish_status,
      approval_status: item.approval_status,
      revision: item.revision,
      owner_role: item.owner_role,
      review_role: item.review_role,
      service_domain: item.service_domain
    }
  });
}

function syncMediaQueue(projectName, job = {}) {
  return upsertQueueItem(projectName, {
    queue_type: 'media',
    entity_type: 'media_job',
    entity_id: job.id,
    title: job.title || `${job.request_type || 'media'} job`,
    status: job.approval_state === 'pending' ? 'pending_approval' : (job.status || 'requested'),
    assignee: job.owner,
    role: asString(job.owner_role || job.review_role || 'designer'),
    priority: job.approval_state === 'pending' ? 'high' : 'normal',
    route: 'media-studio',
    details: {
      request_type: job.request_type,
      provider: job.provider,
      model: job.model,
      campaign_id: job.campaign_id,
      content_item_id: job.content_item_id,
      publishing_job_id: job.publishing_job_id,
      approval_state: job.approval_state,
      owner_role: job.owner_role,
      review_role: job.review_role,
      service_domain: job.service_domain
    }
  });
}

function upsertCampaign(projectName, input = {}) {
  const paths = getOperationsPaths(projectName);
  const items = readCollection(paths.campaignsPath);
  const team = readTeamModel(paths.project);
  const title = asString(input.name || input.title);

  if (!title) {
    throw new Error('Campaign name is required');
  }

  const current = findById(items, input.id) || {};
  const createdAt = asString(current.created_at) || asString(input.created_at) || nowIso();
  const status = asString(input.status || current.status) || 'draft';
  const routing = inferPrimaryRole('campaign', input, team);
  const campaign = {
    id: asString(current.id) || asString(input.id) || createId('campaign'),
    project: paths.project,
    name: title,
    objective: asString(input.objective || current.objective),
    audience: asString(input.audience || current.audience),
    channels: normalizeStringList(input.channels || current.channels),
    offer: asString(input.offer || current.offer),
    timeline: asString(input.timeline || current.timeline),
    budget: asString(input.budget || current.budget),
    status,
    lifecycle_state: asString(input.lifecycle_state || current.lifecycle_state) || (
      ['active', 'paused', 'completed', 'archived'].includes(status) ? status : 'draft'
    ),
    owner: asString(input.owner || current.owner) || roleDisplay(team, routing.owner_role),
    owner_role: normalizeRoleKey(input.owner_role || current.owner_role || routing.owner_role, routing.owner_role),
    review_role: normalizeRoleKey(input.review_role || current.review_role || routing.reviewer_role, routing.reviewer_role),
    service_domain: 'campaign',
    source_page: asString(input.source_page || current.source_page),
    active: input.active === undefined ? asBoolean(current.active, true) : asBoolean(input.active, true),
    form_values: asObject(input.form_values || current.form_values),
    linked_assets: normalizeStringList(input.linked_assets || current.linked_assets),
    linked_tasks: normalizeStringList(input.linked_tasks || current.linked_tasks),
    linked_approvals: normalizeStringList(input.linked_approvals || current.linked_approvals),
    timestamps: mergeDefined(asObject(current.timestamps), {
      created_at: createdAt,
      updated_at: nowIso(),
      activated_at: asString(input.activated_at || current.timestamps?.activated_at)
    }),
    created_at: createdAt,
    updated_at: nowIso(),
    history: appendHistory(
      current,
      current.id ? 'campaign_updated' : 'campaign_created',
      input.actor || input.owner,
      {
        status,
        source_page: asString(input.source_page || current.source_page)
      }
    )
  };

  writeCollection(paths.campaignsPath, upsertById(items, campaign), MAX_ITEMS.campaigns);
  updateSystem(paths);
  appendEvent(paths.project, {
    type: current.id ? 'campaign_updated' : 'campaign_created',
    entity_type: 'campaign',
    entity_id: campaign.id,
    title: campaign.name,
    summary: current.id
      ? 'Campaign record updated in the durable backbone.'
      : 'Campaign record created in the durable backbone.',
    actor: asString(input.actor || input.owner) || 'mh-assistant',
    metadata: {
      status: campaign.status,
      lifecycle_state: campaign.lifecycle_state
    }
  });

  return campaign;
}

function listCampaigns(projectName, options = {}) {
  const paths = getOperationsPaths(projectName);
  return listItems(readCollection(paths.campaignsPath), options);
}

function getCampaign(projectName, campaignId) {
  const paths = getOperationsPaths(projectName);
  return findById(readCollection(paths.campaignsPath), campaignId);
}

function upsertContentItem(projectName, input = {}) {
  const paths = getOperationsPaths(projectName);
  const items = readCollection(paths.contentItemsPath);
  const team = readTeamModel(paths.project);
  const title = asString(input.title);

  if (!title) {
    throw new Error('Content item title is required');
  }

  const current = findById(items, input.id) || {};
  const createdAt = asString(current.created_at) || asString(input.created_at) || nowIso();
  const status = asString(input.status || current.status || input.publish_status) || 'draft';
  const routing = inferPrimaryRole('content_item', input, team);
  const approvalStatus = asString(input.approval_status || current.approval_status) || 'not_requested';
  const publishStatus = asString(input.publish_status || current.publish_status) || 'draft';
  const draft = input.draft !== undefined ? asString(input.draft) : asString(current.draft);
  const comments = input.comments !== undefined
    ? normalizeCommentList(input.comments, input.actor || input.owner)
    : appendCommentList(current.comments, input.new_comment || input.comment, input.actor || input.owner);
  const aiRequests = input.ai_requests !== undefined
    ? normalizeRequestList(input.ai_requests, input.actor || input.owner)
    : appendRequestList(current.ai_requests, input.ai_request, input.actor || input.owner);
  const revisionsBase = input.revisions !== undefined
    ? normalizeRevisionList(input.revisions, input.actor || input.owner)
    : normalizeRevisionList(current.revisions, input.actor || input.owner);
  const draftChanged = current.id && draft !== asString(current.draft);
  const explicitRevision = asBoolean(input.create_revision, false);
  let revisions = revisionsBase.slice();
  let revisionNumber = Number(input.revision ?? current.revision ?? revisions[0]?.revision ?? 1) || 1;

  if (!current.id && (draft || title)) {
    revisions = [
      normalizeRevisionEntry({
        revision: revisionNumber,
        title,
        draft,
        note: asString(input.revision_note || 'Initial draft'),
        actor: input.actor || input.owner,
        created_at: createdAt
      }),
      ...revisions
    ].slice(0, 40);
  } else if (draftChanged || explicitRevision) {
    revisionNumber += 1;
    revisions = [
      normalizeRevisionEntry({
        revision: revisionNumber,
        title,
        draft,
        note: asString(input.revision_note || input.change_summary || 'Draft updated'),
        actor: input.actor || input.owner
      }),
      ...revisions
    ].slice(0, 40);
  }

  const latestRevision = revisions[0] || null;
  const item = {
    id: asString(current.id) || asString(input.id) || createId('content'),
    project: paths.project,
    campaign_id: asString(input.campaign_id || current.campaign_id),
    type: asString(input.type || current.type) || 'general',
    title,
    draft,
    revision: latestRevision?.revision || revisionNumber,
    current_revision_id: asString(input.current_revision_id || current.current_revision_id || latestRevision?.id),
    revisions,
    approval_status: approvalStatus,
    owner: asString(input.owner || current.owner) || roleDisplay(team, routing.owner_role),
    owner_role: normalizeRoleKey(input.owner_role || current.owner_role || routing.owner_role, routing.owner_role),
    review_role: normalizeRoleKey(input.review_role || current.review_role || routing.reviewer_role, routing.reviewer_role),
    service_domain: 'content',
    destination: asString(input.destination || current.destination),
    destination_type: asString(input.destination_type || current.destination_type || 'publishing'),
    linked_campaign: asString(input.linked_campaign || current.linked_campaign || input.campaign_id),
    publishing_destination: asString(input.publishing_destination || current.publishing_destination || input.destination),
    publish_status: publishStatus,
    status,
    lifecycle_state: asString(input.lifecycle_state || current.lifecycle_state) || (
      publishStatus === 'published' ? 'distribution' : approvalStatus === 'approved' ? 'approved' : 'draft'
    ),
    linked_tasks: normalizeStringList(input.linked_tasks || current.linked_tasks),
    linked_approvals: normalizeStringList(input.linked_approvals || current.linked_approvals),
    linked_handoffs: normalizeStringList(input.linked_handoffs || current.linked_handoffs),
    linked_media_jobs: normalizeStringList(input.linked_media_jobs || current.linked_media_jobs),
    comments,
    notes: normalizeNotes(input.notes || current.notes),
    ai_requests: aiRequests,
    queue_status: asString(input.queue_status || current.queue_status || publishStatus || approvalStatus || status) || 'draft',
    created_at: createdAt,
    updated_at: nowIso(),
    history: appendHistory(
      current,
      current.id ? 'content_item_updated' : 'content_item_created',
      input.actor || input.owner,
      {
        status,
        approval_status: approvalStatus,
        publish_status: publishStatus,
        revision: latestRevision?.revision || revisionNumber
      }
    )
  };

  writeCollection(paths.contentItemsPath, upsertById(items, item), MAX_ITEMS.contentItems);
  syncContentQueue(paths.project, item);
  updateSystem(paths);
  appendEvent(paths.project, {
    type: current.id ? 'content_item_updated' : 'content_item_created',
    entity_type: 'content_item',
    entity_id: item.id,
    title: item.title,
    summary: 'Content item was stored in the durable backbone.',
    actor: asString(input.actor || input.owner) || 'mh-assistant',
    metadata: {
      type: item.type,
      campaign_id: item.campaign_id,
      approval_status: approvalStatus,
      publish_status: publishStatus,
      revision: item.revision
    }
  });

  return item;
}

function listContentItems(projectName, options = {}) {
  const paths = getOperationsPaths(projectName);
  const items = readCollection(paths.contentItemsPath);
  const campaignId = asString(options.campaign_id);
  const filtered = campaignId
    ? items.filter((item) => asString(item.campaign_id) === campaignId)
    : items;
  return listItems(filtered, options);
}

function getContentItem(projectName, contentItemId) {
  const paths = getOperationsPaths(projectName);
  return findById(readCollection(paths.contentItemsPath), contentItemId);
}

function upsertMediaJob(projectName, input = {}) {
  const paths = getOperationsPaths(projectName);
  const items = readCollection(paths.mediaJobsPath);
  const team = readTeamModel(paths.project);
  const current = findById(items, input.id) || {};
  const requestType = asString(input.request_type || current.request_type);

  if (!requestType) {
    throw new Error('Media job request_type is required');
  }

  const createdAt = asString(current.created_at) || asString(input.created_at) || nowIso();
  const status = asString(input.status || current.status) || 'requested';
  const routing = inferPrimaryRole('media_job', {
    ...current,
    ...input,
    request_type: requestType
  }, team);
  const outputs = input.outputs !== undefined ? asArray(input.outputs) : asArray(current.outputs);
  const outputVersionsBase = input.output_versions !== undefined
    ? normalizeOutputVersionList(input.output_versions, input.actor || input.owner)
    : normalizeOutputVersionList(current.output_versions, input.actor || input.owner);
  const currentOutputSignature = JSON.stringify(asArray(current.outputs));
  const nextOutputSignature = JSON.stringify(outputs);
  const shouldAppendOutputVersion =
    Boolean(input.new_output_version) ||
    (current.id && input.outputs !== undefined && currentOutputSignature !== nextOutputSignature) ||
    (!current.id && outputs.length);
  const outputVersions = shouldAppendOutputVersion
    ? [
      normalizeOutputVersionEntry({
        ...asObject(input.new_output_version),
        label: asString(input.new_output_version?.label) || `Version ${outputVersionsBase.length + 1}`,
        outputs,
        preview_url: asString(input.new_output_version?.preview_url || input.preview_url),
        file_path: asString(input.new_output_version?.file_path || input.file_path),
        actor: input.actor || input.owner
      }),
      ...outputVersionsBase
    ].slice(0, 40)
    : outputVersionsBase;
  const previewHistory = input.preview_history !== undefined
    ? asArray(input.preview_history)
    : appendPreviewHistory(current.preview_history, input.preview_entry, input.actor || input.owner);
  const comments = input.comments !== undefined
    ? normalizeCommentList(input.comments, input.actor || input.owner)
    : appendCommentList(current.comments, input.new_comment || input.comment, input.actor || input.owner);
  const job = {
    id: asString(current.id) || asString(input.id) || createId('mediajob'),
    project: paths.project,
    title: asString(input.title || current.title) || `${requestType} job`,
    request_type: requestType,
    prompt: asString(input.prompt || current.prompt),
    brief: asString(input.brief || current.brief),
    provider: asString(input.provider || current.provider),
    model: asString(input.model || current.model),
    provider_metadata: asObject(input.provider_metadata || current.provider_metadata),
    status,
    lifecycle_state: asString(input.lifecycle_state || current.lifecycle_state) || (
      status === 'completed' || status === 'failed' ? 'closed' : status === 'processing' ? 'running' : 'requested'
    ),
    outputs,
    output_versions: outputVersions,
    approval_state: asString(input.approval_state || current.approval_state) || 'not_requested',
    revision_notes: normalizeNotes(input.revision_notes || current.revision_notes),
    approval_notes: normalizeNotes(input.approval_notes || current.approval_notes),
    campaign_id: asString(input.campaign_id || current.campaign_id),
    content_item_id: asString(input.content_item_id || current.content_item_id),
    publishing_job_id: asString(input.publishing_job_id || current.publishing_job_id),
    owner: asString(input.owner || current.owner) || roleDisplay(team, routing.owner_role),
    owner_role: normalizeRoleKey(input.owner_role || current.owner_role || routing.owner_role, routing.owner_role),
    review_role: normalizeRoleKey(input.review_role || current.review_role || routing.reviewer_role, routing.reviewer_role),
    service_domain: 'media',
    linked_entity: normalizeLinkedEntity(input.linked_entity || current.linked_entity || input),
    linked_tasks: normalizeStringList(input.linked_tasks || current.linked_tasks),
    linked_approvals: normalizeStringList(input.linked_approvals || current.linked_approvals),
    linked_handoffs: normalizeStringList(input.linked_handoffs || current.linked_handoffs),
    asset_lineage: asArray(input.asset_lineage || current.asset_lineage),
    preview_history: previewHistory,
    comments,
    created_at: createdAt,
    updated_at: nowIso(),
    history: appendHistory(
      current,
      current.id ? 'media_job_updated' : 'media_job_created',
      input.actor || input.owner,
      {
        status,
        provider: asString(input.provider || current.provider),
        model: asString(input.model || current.model),
        output_versions: outputVersions.length
      }
    )
  };

  writeCollection(paths.mediaJobsPath, upsertById(items, job), MAX_ITEMS.mediaJobs);
  syncMediaQueue(paths.project, job);
  updateSystem(paths);
  appendEvent(paths.project, {
    type: current.id ? 'media_job_updated' : 'media_job_created',
    entity_type: 'media_job',
    entity_id: job.id,
    title: `${job.request_type} job`,
    summary: `Media job ${job.status} stored in the durable backbone.`,
    actor: asString(input.actor || input.owner) || 'mh-assistant',
    metadata: {
      request_type: job.request_type,
      provider: job.provider,
      model: job.model,
      status: job.status,
      output_versions: outputVersions.length
    }
  });

  return job;
}

function listMediaJobs(projectName, options = {}) {
  const paths = getOperationsPaths(projectName);
  const items = readCollection(paths.mediaJobsPath);
  const campaignId = asString(options.campaign_id);
  const contentItemId = asString(options.content_item_id);
  const filtered = items.filter((item) => {
    if (campaignId && asString(item.campaign_id) !== campaignId) {
      return false;
    }
    if (contentItemId && asString(item.content_item_id) !== contentItemId) {
      return false;
    }
    return true;
  });
  return listItems(filtered, options);
}

function getMediaJob(projectName, mediaJobId) {
  const paths = getOperationsPaths(projectName);
  return findById(readCollection(paths.mediaJobsPath), mediaJobId);
}

function recordWorkflowRun(projectName, input = {}) {
  const paths = getOperationsPaths(projectName);
  const items = readCollection(paths.workflowsPath);
  const workflowId = asString(input.workflow_id || input.workflowId || input.workflow_type);

  if (!workflowId) {
    throw new Error('Missing workflow_id');
  }

  const current = findById(items, input.id) || {};
  const createdAt = asString(current.created_at) || asString(input.created_at) || nowIso();
  const status = asString(input.status || current.status) || 'completed';
  const outputPayload = asObject(input.output || input.outputs || current.output || current.outputs);
  const run = {
    id: asString(current.id) || asString(input.id) || createId('wfrun'),
    project: paths.project,
    workflow_id: workflowId,
    workflow_type: asString(input.workflow_type || current.workflow_type || workflowId),
    title: asString(input.title || current.title) || workflowId,
    status,
    lifecycle_state: asString(input.lifecycle_state || current.lifecycle_state) || (
      status === 'running' ? 'running' : status === 'queued' ? 'queued' : 'completed'
    ),
    source: asString(input.source || current.source) || 'manual-run',
    route_target: asString(input.route_target || current.route_target),
    created_by: asString(input.created_by || input.actor || current.created_by) || 'mh-assistant',
    created_at: createdAt,
    updated_at: nowIso(),
    inputs: asObject(input.inputs || current.inputs),
    outputs: outputPayload,
    output: outputPayload,
    intelligence_stamp: asObject(input.intelligence_stamp || current.intelligence_stamp),
    linked_entities: asArray(input.linked_entities || current.linked_entities),
    history: appendHistory(
      current,
      current.id ? 'workflow_run_updated' : 'workflow_run_recorded',
      input.actor || input.created_by,
      {
        workflow_id: workflowId,
        status,
        source: asString(input.source || current.source)
      }
    )
  };

  writeCollection(paths.workflowsPath, upsertById(items, run), MAX_ITEMS.workflowRuns);
  upsertQueueItem(paths.project, {
    queue_type: 'workflow',
    entity_type: 'workflow_run',
    entity_id: run.id,
    title: run.title,
    status: run.status,
    assignee: run.created_by,
    role: 'system_orchestrator',
    priority: run.status === 'failed' ? 'high' : run.status === 'running' ? 'high' : 'normal',
    route: inferRouteTarget('workflow_run', run),
    details: {
      workflow_id: workflowId,
      source: run.source
    }
  });
  updateSystem(paths);
  appendEvent(paths.project, {
    type: current.id ? 'workflow_run_updated' : 'workflow_run_recorded',
    entity_type: 'workflow_run',
    entity_id: run.id,
    title: run.title,
    summary: `${run.title} was recorded as a durable workflow run.`,
    actor: run.created_by,
    metadata: {
      workflow_id: workflowId,
      source: run.source,
      status: run.status
    }
  });
  createNotification(paths.project, {
    category: 'workflow',
    type: 'workflow',
    title:
      run.status === 'failed'
        ? `${run.title} failed`
        : run.status === 'completed'
          ? `${run.title} completed`
          : `${run.title} recorded`,
    message:
      run.status === 'failed'
        ? 'Workflow run requires operator follow-up.'
        : run.status === 'completed'
          ? 'Workflow output is now stored in the operational backbone.'
          : 'Workflow execution state was updated in the operational backbone.',
    body:
      run.status === 'failed'
        ? 'Workflow run requires operator follow-up.'
        : run.status === 'completed'
          ? 'Workflow output is now stored in the operational backbone.'
          : 'Workflow execution state was updated in the operational backbone.',
    severity: run.status === 'failed' ? 'critical' : run.status === 'completed' ? 'success' : 'info',
    linked_entity: {
      entity_type: 'workflow_run',
      entity_id: run.id,
      route: inferRouteTarget('workflow_run', run)
    },
    entity_type: 'workflow_run',
    entity_id: run.id
  });

  return run;
}

function createAiCommandRecord(projectName, input = {}) {
  const paths = getOperationsPaths(projectName);
  const items = readCollection(paths.aiCommandsPath);
  const current = findById(items, input.id) || {};
  const createdAt = asString(current.created_at) || asString(input.created_at) || nowIso();
  const status = asString(input.status || current.status) || 'completed';
  const record = {
    id: asString(current.id) || asString(input.id) || createId('aicmd'),
    project: paths.project,
    command: asString(input.command || current.command),
    mode_id: asString(input.mode_id || current.mode_id) || 'executive',
    intent: asString(input.intent || current.intent) || 'inspect',
    action_type: asString(input.action_type || current.action_type) || 'recommendation',
    status,
    route_target: asString(input.route_target || current.route_target),
    source: asString(input.source || current.source) || 'ai-command',
    created_by: asString(input.created_by || input.actor || current.created_by) || 'mh-assistant',
    context_summary: asObject(input.context_summary || current.context_summary),
    classification: asObject(input.classification || current.classification),
    response: asObject(input.response || current.response),
    linked_entities: asArray(input.linked_entities || current.linked_entities),
    artifact_ids: normalizeStringList(input.artifact_ids || current.artifact_ids),
    recommendation_ids: normalizeStringList(input.recommendation_ids || current.recommendation_ids),
    memory_ids: normalizeStringList(input.memory_ids || current.memory_ids),
    created_at: createdAt,
    updated_at: nowIso(),
    history: appendHistory(
      current,
      current.id ? 'ai_command_updated' : 'ai_command_recorded',
      input.actor || input.created_by,
      {
        status,
        intent: asString(input.intent || current.intent),
        action_type: asString(input.action_type || current.action_type)
      }
    )
  };

  writeCollection(paths.aiCommandsPath, upsertById(items, record), MAX_ITEMS.aiCommands);
  updateSystem(paths);
  appendEvent(paths.project, {
    category: 'ai_routing',
    type: current.id ? 'ai_command_updated' : 'ai_command_recorded',
    entity_type: 'ai_command',
    entity_id: record.id,
    title: record.command || 'AI command',
    summary: 'AI command stored as a durable orchestration record.',
    actor: record.created_by,
    metadata: {
      intent: record.intent,
      action_type: record.action_type,
      route_target: record.route_target
    }
  });

  return record;
}

function listAiCommandRecords(projectName, options = {}) {
  const paths = getOperationsPaths(projectName);
  return listItems(readCollection(paths.aiCommandsPath), options);
}

function getAiCommandRecord(projectName, commandId) {
  const paths = getOperationsPaths(projectName);
  return findById(readCollection(paths.aiCommandsPath), commandId);
}

function createAiArtifact(projectName, input = {}) {
  const paths = getOperationsPaths(projectName);
  const items = readCollection(paths.aiArtifactsPath);
  const current = findById(items, input.id) || {};
  const createdAt = asString(current.created_at) || asString(input.created_at) || nowIso();
  const artifact = {
    id: asString(current.id) || asString(input.id) || createId('aiart'),
    project: paths.project,
    type: asString(input.type || current.type) || 'ai_response',
    title: asReadableString(input.title || current.title) || 'AI artifact',
    status: asString(input.status || current.status) || 'saved',
    route_target: asString(input.route_target || current.route_target),
    source_type: asString(input.source_type || current.source_type),
    source_id: asString(input.source_id || current.source_id),
    payload: asObject(input.payload || current.payload),
    summary: asReadableString(input.summary || current.summary),
    created_by: asString(input.created_by || input.actor || current.created_by) || 'mh-assistant',
    created_at: createdAt,
    updated_at: nowIso(),
    history: appendHistory(
      current,
      current.id ? 'ai_artifact_updated' : 'ai_artifact_saved',
      input.actor || input.created_by,
      {
        type: asString(input.type || current.type),
        route_target: asString(input.route_target || current.route_target)
      }
    )
  };

  writeCollection(paths.aiArtifactsPath, upsertById(items, artifact), MAX_ITEMS.aiArtifacts);
  updateSystem(paths);
  appendEvent(paths.project, {
    category: 'ai_routing',
    type: current.id ? 'ai_artifact_updated' : 'ai_artifact_saved',
    entity_type: 'ai_artifact',
    entity_id: artifact.id,
    title: artifact.title,
    summary: artifact.summary || 'AI output stored as a durable artifact.',
    actor: artifact.created_by,
    metadata: {
      type: artifact.type,
      route_target: artifact.route_target
    }
  });

  return artifact;
}

function listAiArtifacts(projectName, options = {}) {
  const paths = getOperationsPaths(projectName);
  const type = asString(options.type);
  let items = readCollection(paths.aiArtifactsPath);
  if (type) {
    items = items.filter((item) => asString(item.type) === type);
  }
  return listItems(items, options);
}

function createAiRecommendation(projectName, input = {}) {
  const paths = getOperationsPaths(projectName);
  const items = readCollection(paths.aiRecommendationsPath);
  const current = findById(items, input.id) || {};
  const createdAt = asString(current.created_at) || asString(input.created_at) || nowIso();
  const recommendation = {
    id: asString(current.id) || asString(input.id) || createId('aireco'),
    project: paths.project,
    title: asReadableString(input.title || current.title) || 'Recommendation',
    summary: asReadableString(input.summary || current.summary || input.action),
    action: asReadableString(input.action || current.action),
    domain: asString(input.domain || current.domain),
    route_target: asString(input.route_target || current.route_target || input.route),
    source_type: asString(input.source_type || current.source_type),
    source_id: asString(input.source_id || current.source_id),
    linked_entity: normalizeLinkedEntity(input.linked_entity || current.linked_entity || input),
    priority: asString(input.priority || current.priority) || 'normal',
    status: asString(input.status || current.status) || 'open',
    created_by: asString(input.created_by || input.actor || current.created_by) || 'mh-assistant',
    created_at: createdAt,
    updated_at: nowIso(),
    history: appendHistory(
      current,
      current.id ? 'ai_recommendation_updated' : 'ai_recommendation_created',
      input.actor || input.created_by,
      {
        route_target: asString(input.route_target || current.route_target),
        status: asString(input.status || current.status)
      }
    )
  };

  writeCollection(paths.aiRecommendationsPath, upsertById(items, recommendation), MAX_ITEMS.aiRecommendations);
  updateSystem(paths);
  appendEvent(paths.project, {
    category: 'ai_routing',
    type: current.id ? 'ai_recommendation_updated' : 'ai_recommendation_created',
    entity_type: 'ai_recommendation',
    entity_id: recommendation.id,
    title: recommendation.title,
    summary: recommendation.summary || 'Durable recommendation created.',
    actor: recommendation.created_by,
    metadata: {
      domain: recommendation.domain,
      route_target: recommendation.route_target,
      priority: recommendation.priority
    }
  });

  return recommendation;
}

function listAiRecommendations(projectName, options = {}) {
  const paths = getOperationsPaths(projectName);
  const routeTarget = asString(options.route_target || options.route);
  let items = readCollection(paths.aiRecommendationsPath);
  if (routeTarget) {
    items = items.filter((item) => asString(item.route_target) === routeTarget);
  }
  return listItems(items, options);
}

function upsertAiMemory(projectName, input = {}) {
  const paths = getOperationsPaths(projectName);
  const items = readCollection(paths.aiMemoryPath);
  const title = asString(input.title || input.key || input.scope);

  if (!title) {
    throw new Error('AI memory title is required');
  }

  const current = findById(items, input.id) || {};
  const createdAt = asString(current.created_at) || asString(input.created_at) || nowIso();
  const memory = {
    id: asString(current.id) || asString(input.id) || createId('aimem'),
    project: paths.project,
    title,
    scope: asString(input.scope || current.scope) || 'project',
    key: asString(input.key || current.key) || title.toLowerCase().replace(/\s+/g, '_'),
    summary: asString(input.summary || current.summary),
    value: asObject(input.value || current.value),
    source_type: asString(input.source_type || current.source_type),
    source_id: asString(input.source_id || current.source_id),
    status: asString(input.status || current.status) || 'active',
    created_by: asString(input.created_by || input.actor || current.created_by) || 'mh-assistant',
    created_at: createdAt,
    updated_at: nowIso(),
    history: appendHistory(
      current,
      current.id ? 'ai_memory_updated' : 'ai_memory_saved',
      input.actor || input.created_by,
      {
        scope: asString(input.scope || current.scope),
        key: asString(input.key || current.key)
      }
    )
  };

  writeCollection(paths.aiMemoryPath, upsertById(items, memory), MAX_ITEMS.aiMemory);
  updateSystem(paths);
  appendEvent(paths.project, {
    category: 'ai_routing',
    type: current.id ? 'ai_memory_updated' : 'ai_memory_saved',
    entity_type: 'ai_memory',
    entity_id: memory.id,
    title: memory.title,
    summary: memory.summary || 'Project intelligence memory updated.',
    actor: memory.created_by,
    metadata: {
      scope: memory.scope,
      key: memory.key
    }
  });

  return memory;
}

function listAiMemory(projectName, options = {}) {
  const paths = getOperationsPaths(projectName);
  const scope = asString(options.scope);
  let items = readCollection(paths.aiMemoryPath);
  if (scope) {
    items = items.filter((item) => asString(item.scope) === scope);
  }
  return listItems(items, options);
}

function listWorkflowRuns(projectName, options = {}) {
  const paths = getOperationsPaths(projectName);
  return listItems(readCollection(paths.workflowsPath), options);
}

function getWorkflowRun(projectName, workflowRunId) {
  const paths = getOperationsPaths(projectName);
  return findById(readCollection(paths.workflowsPath), workflowRunId);
}

function createTask(projectName, input = {}) {
  const paths = getOperationsPaths(projectName);
  const items = readCollection(paths.tasksPath);
  const team = readTeamModel(paths.project);
  const title = asString(input.title);

  if (!title) {
    throw new Error('Task title is required');
  }

  const current = findById(items, input.id) || {};
  const createdAt = asString(current.created_at) || asString(input.created_at) || nowIso();
  const status = asString(input.status || current.status) || 'open';
  const routing = inferPrimaryRole('task', {
    ...current,
    ...input,
    route_target: asString(input.route_target || current.route_target),
    request_type: asString(input.request_type || current.request_type)
  }, team);
  const ownerRole = normalizeRoleKey(input.owner_role || current.owner_role || routing.owner_role, routing.owner_role);
  const assigneeRole = normalizeRoleKey(input.assignee_role || current.assignee_role || ownerRole, ownerRole);
  const task = {
    id: asString(current.id) || asString(input.id) || createId('task'),
    project: paths.project,
    title,
    description: asString(input.description || current.description),
    owner: asString(input.owner || input.assignee || current.owner || current.assignee) || roleDisplay(team, ownerRole),
    owner_role: ownerRole,
    assignee: asString(input.assignee || current.assignee || input.owner) || roleDisplay(team, assigneeRole),
    assignee_role: assigneeRole,
    team_role: asString(input.team_role || current.team_role || assigneeRole),
    service_domain: asString(input.service_domain || current.service_domain || routing.service_domain),
    source_page: asString(input.source_page || current.source_page || input.route_target),
    linked_entity: normalizeLinkedEntity(input.linked_entity || current.linked_entity || input),
    due_date: asString(input.due_date || current.due_date || input.due_at),
    due_at: asString(input.due_at || current.due_at || input.due_date),
    priority: asString(input.priority || current.priority) || 'normal',
    status,
    lifecycle_state: asString(input.lifecycle_state || current.lifecycle_state) || (
      status === 'completed' ? 'done' : status === 'blocked' ? 'blocked' : ['queued', 'in_progress'].includes(status) ? 'active' : 'open'
    ),
    queue_status: asString(input.queue_status || current.queue_status || status) || 'queued',
    workflow_id: asString(input.workflow_id || current.workflow_id),
    source_type: asString(input.source_type || current.source_type),
    source_id: asString(input.source_id || current.source_id),
    route_target: asString(input.route_target || current.route_target || routing.route_target),
    handoff_roles: normalizeStringList(input.handoff_roles || current.handoff_roles || routing.handoff_roles),
    responsibility: {
      owner_role: ownerRole,
      owner_label: roleDisplay(team, ownerRole),
      assignee_role: assigneeRole,
      assignee_label: roleDisplay(team, assigneeRole),
      review_role: routing.reviewer_role,
      review_label: roleDisplay(team, routing.reviewer_role)
    },
    output: asObject(input.output || current.output),
    notes: normalizeNotes(input.notes || current.notes),
    created_at: createdAt,
    updated_at: nowIso(),
    history: appendHistory(
      current,
      current.id ? 'task_updated' : 'task_created',
      input.actor || input.owner || input.assignee,
      {
        status,
        priority: asString(input.priority || current.priority),
        assignee_role: assigneeRole,
        service_domain: routing.service_domain
      }
    )
  };

  writeCollection(paths.tasksPath, upsertById(items, task), MAX_ITEMS.tasks);
  upsertQueueItem(paths.project, {
    queue_type: 'task',
    entity_type: 'task',
    entity_id: task.id,
    title: task.title,
    status: task.queue_status,
    assignee: task.assignee || task.owner,
    role: assigneeRole,
    priority: task.priority,
    route: task.route_target,
    details: {
      workflow_id: task.workflow_id,
      source_type: task.source_type,
      source_id: task.source_id,
      linked_entity: task.linked_entity,
      owner_role: ownerRole,
      assignee_role: assigneeRole,
      service_domain: task.service_domain
    }
  });
  updateSystem(paths);
  appendEvent(paths.project, {
    type: current.id ? 'task_updated' : 'task_created',
    entity_type: 'task',
    entity_id: task.id,
    title: task.title,
    summary: 'A durable task was added to the project operating queue.',
    actor: asString(input.actor || input.owner || input.assignee) || 'mh-assistant'
  });
  createNotification(paths.project, {
    category: 'task',
    type: 'task',
    title: `${task.title} added to queue`,
    message: 'The task is now available for team execution and follow-up.',
    body: 'The task is now available for team execution and follow-up.',
    severity: 'info',
    linked_entity: {
      entity_type: 'task',
      entity_id: task.id,
      route: inferRouteTarget('task', task)
    },
    entity_type: 'task',
    entity_id: task.id
  });

  if (task.linked_entity?.entity_type && task.linked_entity?.entity_id) {
    updateLinkedEntity(paths.project, task.linked_entity.entity_type, task.linked_entity.entity_id, (record) => ({
      ...record,
      linked_tasks: [...new Set([task.id, ...normalizeStringList(record.linked_tasks)])],
      updated_at: nowIso(),
      history: appendHistory(record, 'linked_task_added', input.actor || input.owner || input.assignee, {
        task_id: task.id
      })
    }));
  }

  return task;
}

function listTasks(projectName, options = {}) {
  const paths = getOperationsPaths(projectName);
  return listItems(readCollection(paths.tasksPath), options);
}

function getTask(projectName, taskId) {
  const paths = getOperationsPaths(projectName);
  return findById(readCollection(paths.tasksPath), taskId);
}

function createApproval(projectName, input = {}) {
  const paths = getOperationsPaths(projectName);
  const items = readCollection(paths.approvalsPath);
  const governance = getGovernancePolicy(projectName);
  const team = readTeamModel(paths.project);
  const entityLink = normalizeLinkedEntity(input.linked_entity || input);
  const targetEntityType = asString(input.entity_type) || asString(entityLink?.entity_type);
  const targetEntityId = asString(input.entity_id) || asString(entityLink?.entity_id);

  if (!targetEntityType || !targetEntityId) {
    throw new Error('Approval requires entity_type and entity_id');
  }

  const title = asString(input.title) || `${targetEntityType} approval`;
  const current = findById(items, input.id) || {};
  const createdAt = asString(current.created_at) || asString(input.created_at) || nowIso();
  const status = asString(input.status || current.status) || 'pending';
  const routing = inferPrimaryRole(targetEntityType, {
    ...input,
    route_target: asString(input.route_target || entityLink?.route)
  }, team);
  const reviewerRole = normalizeRoleKey(
    input.reviewer_role ||
      current.reviewer_role ||
      input.requested_for ||
      input.reviewer ||
      routing.reviewer_role,
    routing.reviewer_role
  );
  const escalationChain = normalizeStringList(input.escalation_chain || current.escalation_chain).length
    ? normalizeStringList(input.escalation_chain || current.escalation_chain)
    : getEscalationChain(input.risk_level || current.risk_level);
  const approval = {
    id: asString(current.id) || asString(input.id) || createId('approval'),
    project: paths.project,
    title,
    entity_type: targetEntityType,
    entity_id: targetEntityId,
    mutation_type: asString(input.mutation_type || current.mutation_type) || asString(input.approval_type || current.approval_type) || targetEntityType,
    route: asString(input.route || current.route),
    method: asString(input.method || current.method).toUpperCase(),
    approval_fingerprint: asString(input.approval_fingerprint || current.approval_fingerprint),
    intended_action_id: asString(input.intended_action_id || current.intended_action_id),
    linked_execution_id: asString(input.linked_execution_id || current.linked_execution_id),
    request_payload_hash: asString(input.request_payload_hash || current.request_payload_hash),
    request_payload_summary: input.request_payload_summary != null ? input.request_payload_summary : current.request_payload_summary || null,
    reviewer: asString(input.reviewer || current.reviewer || input.requested_for) || roleDisplay(team, reviewerRole),
    reviewer_role: reviewerRole,
    requested_by: asString(input.requested_by || current.requested_by || input.actor) || 'mh-assistant',
    requested_for: asString(input.requested_for || current.requested_for || input.reviewer) || roleDisplay(team, reviewerRole),
    status,
    lifecycle_state: asString(input.lifecycle_state || current.lifecycle_state) || 'requested',
    summary: asString(input.summary || current.summary),
    notes: normalizeNotes(input.notes || current.notes || input.decision_note),
    decision_note: asString(input.decision_note || current.decision_note),
    risk_level: asString(input.risk_level || current.risk_level) || 'medium',
    approval_type: asString(input.approval_type || current.approval_type) || targetEntityType,
    requested_action: asString(input.requested_action || current.requested_action) || 'review_and_decide',
    source_page: asString(input.source_page || current.source_page || entityLink?.route),
    route_target: asString(input.route_target || current.route_target || entityLink?.route || routing.route_target || 'governance'),
    service_domain: asString(input.service_domain || current.service_domain || routing.service_domain),
    linked_entity: entityLink,
    ownership: {
      owner_role: routing.owner_role,
      owner_label: roleDisplay(team, routing.owner_role),
      reviewer_role: reviewerRole,
      reviewer_label: roleDisplay(team, reviewerRole)
    },
    escalation_chain: escalationChain,
    policy_flags: asArray(input.policy_flags || current.policy_flags || buildPolicyFlags(input, governance)),
    claim_flags: asArray(input.claim_flags || current.claim_flags || buildClaimFlags(input)),
    brand_safety_flags: asArray(input.brand_safety_flags || current.brand_safety_flags || buildBrandSafetyFlags(input, governance)),
    publish_guardrails: asArray(input.publish_guardrails || current.publish_guardrails || []),
    timestamps: mergeDefined(asObject(current.timestamps), {
      created_at: createdAt,
      updated_at: nowIso(),
      decided_at: asString(input.decided_at || current.timestamps?.decided_at)
    }),
    created_at: createdAt,
    updated_at: nowIso(),
    decided_at: asString(input.decided_at || current.decided_at),
    decision_at: asString(input.decision_at || current.decision_at),
    decided_by: asString(input.decided_by || current.decided_by),
    history: appendHistory(
      current,
      current.id ? 'approval_updated' : 'approval_requested',
      input.actor || input.requested_by,
      {
        status,
        entity_type: targetEntityType,
        entity_id: targetEntityId,
        reviewer_role: reviewerRole
      }
    )
  };

  writeCollection(paths.approvalsPath, upsertById(items, approval), MAX_ITEMS.approvals);
  updateSystem(paths);
  appendEvent(paths.project, {
    type: current.id ? 'approval_updated' : 'approval_requested',
    entity_type: 'approval',
    entity_id: approval.id,
    title: approval.title,
    summary: approval.summary || 'A new approval was requested.',
    actor: approval.requested_by,
    metadata: {
      entity_type: approval.entity_type,
      entity_id: approval.entity_id,
      risk_level: approval.risk_level,
      approval_type: approval.approval_type
    }
  });
  createNotification(paths.project, {
    category: 'approval',
    type: 'approval',
    title: `${approval.title} needs approval`,
    message: approval.summary || 'Review and decide on the requested operation.',
    body: approval.summary || 'Review and decide on the requested operation.',
    severity: approval.risk_level === 'high' || approval.risk_level === 'critical' ? 'warning' : 'info',
    linked_entity: {
      entity_type: 'approval',
      entity_id: approval.id,
      route: inferRouteTarget('approval', approval)
    },
    entity_type: 'approval',
    entity_id: approval.id
  });

  upsertQueueItem(paths.project, {
    queue_type: 'approval',
    entity_type: 'approval',
    entity_id: approval.id,
    title: approval.title,
    status: approval.status,
    assignee: approval.reviewer,
    role: reviewerRole,
    priority: approval.risk_level === 'critical' ? 'critical' : approval.risk_level === 'high' ? 'high' : 'normal',
    route: 'governance',
    details: {
      entity_type: approval.entity_type,
      entity_id: approval.entity_id,
      approval_type: approval.approval_type,
      requested_action: approval.requested_action,
      reviewer_role: reviewerRole,
      escalation_chain: approval.escalation_chain
    }
  });

  updateLinkedEntity(paths.project, approval.entity_type, approval.entity_id, (record) => {
    const nextApprovalStatus =
      approval.entity_type === 'media_job'
        ? undefined
        : 'pending';
    const nextApprovalState =
      approval.entity_type === 'media_job'
        ? 'pending'
        : undefined;

    const nextRecord = {
      ...record,
      linked_approvals: [...new Set([approval.id, ...normalizeStringList(record.linked_approvals)])],
      updated_at: nowIso(),
      history: appendHistory(record, 'approval_linked', input.actor || input.requested_by, {
        approval_id: approval.id,
        status: approval.status
      })
    };

    if (approval.entity_type === 'content_item') {
      nextRecord.approval_status = nextApprovalStatus;
      nextRecord.status = 'in_review';
      nextRecord.queue_status = 'pending_approval';
    }

    if (approval.entity_type === 'media_job') {
      nextRecord.approval_state = nextApprovalState;
    }

    if (approval.entity_type === 'content_item') {
      syncContentQueue(paths.project, nextRecord);
    } else if (approval.entity_type === 'media_job') {
      syncMediaQueue(paths.project, nextRecord);
    }

    return nextRecord;
  });

  return approval;
}

function listApprovals(projectName, options = {}) {
  const paths = getOperationsPaths(projectName);
  return listItems(readCollection(paths.approvalsPath), options);
}

function decideApproval(projectName, approvalId, input = {}) {
  const paths = getOperationsPaths(projectName);
  const items = readCollection(paths.approvalsPath);
  const team = readTeamModel(paths.project);
  const targetId = asString(approvalId);
  const decision = asString(input.decision).toLowerCase();

  if (!['approved', 'rejected', 'changes_requested', 'escalated', 'overridden', 'cancelled'].includes(decision)) {
    throw new Error('Invalid approval decision');
  }

  const index = items.findIndex((item) => asString(item.id) === targetId);
  if (index < 0) {
    throw new Error('Approval not found');
  }

  const current = asObject(items[index]);
  const decidedAt = nowIso();
  const decisionNote = asString(input.note || input.reason);
  const escalationChain = normalizeStringList(current.escalation_chain).length
    ? normalizeStringList(current.escalation_chain)
    : getEscalationChain(current.risk_level);
  const escalationTargetRole = normalizeRoleKey(
    input.escalate_to ||
      escalationChain.find((role) => normalizeRoleKey(role) !== normalizeRoleKey(current.reviewer_role)) ||
      escalationChain[0] ||
      'admin',
    'admin'
  );
  const next = {
    ...current,
    status: decision,
    lifecycle_state: decision === 'escalated' ? 'escalated' : 'decided',
    decision_note: decisionNote,
    notes: normalizeNotes(decisionNote || current.notes),
    decided_by: asString(input.actor) || 'operator',
    escalation_chain: escalationChain,
    decided_at: decidedAt,
    updated_at: decidedAt,
    decision_at: decidedAt,
    timestamps: mergeDefined(asObject(current.timestamps), {
      updated_at: decidedAt,
      decided_at: decidedAt
    }),
    history: appendHistory(
      current,
      `approval_${decision}`,
      input.actor,
      {
        status: decision,
        note: decisionNote,
        escalate_to: escalationTargetRole
      }
    )
  };

  items[index] = next;
  writeJsonFile(paths.approvalsPath, items);
  updateSystem(paths);
  appendEvent(paths.project, {
    type: `approval_${decision}`,
    entity_type: 'approval',
    entity_id: next.id,
    title: next.title,
    summary: next.decision_note || `Approval ${decision}.`,
    actor: next.decided_by,
    metadata: {
      entity_type: next.entity_type,
      entity_id: next.entity_id,
      status: next.status
    }
  });
  createNotification(paths.project, {
    category: 'approval',
    type: 'approval',
    title: `${next.title} ${decision}`,
    message: next.decision_note || `Approval was ${decision}.`,
    body: next.decision_note || `Approval was ${decision}.`,
    severity: decision === 'approved' ? 'success' : decision === 'escalated' ? 'critical' : 'warning',
    linked_entity: {
      entity_type: 'approval',
      entity_id: next.id,
      route: inferRouteTarget('approval', next)
    },
    entity_type: 'approval',
    entity_id: next.id
  });

  updateQueueEntity(paths.project, 'approval', next.id, {
    status: next.status,
    priority: decision === 'escalated' ? 'critical' : undefined,
    details: {
      entity_type: next.entity_type,
      entity_id: next.entity_id,
      decision_note: next.decision_note,
      escalate_to: escalationTargetRole
    }
  });

  updateLinkedEntity(paths.project, next.entity_type, next.entity_id, (record) => {
    const nextRecord = {
      ...record,
      linked_approvals: [...new Set([next.id, ...normalizeStringList(record.linked_approvals)])],
      updated_at: decidedAt,
      history: appendHistory(record, `linked_approval_${decision}`, input.actor, {
        approval_id: next.id,
        decision
      })
    };

    if (next.entity_type === 'content_item') {
      nextRecord.approval_status =
        decision === 'approved'
          ? 'approved'
          : decision === 'rejected'
            ? 'rejected'
            : decision === 'changes_requested'
              ? 'rejected'
              : decision === 'overridden'
                ? 'approved'
            : 'not_requested';
      nextRecord.status = ['approved', 'overridden'].includes(decision) ? 'approved' : 'draft';
      nextRecord.queue_status = ['approved', 'overridden'].includes(decision) ? 'approved' : decision === 'escalated' ? 'escalated' : 'changes_requested';
      syncContentQueue(paths.project, nextRecord);
    } else if (next.entity_type === 'media_job') {
      nextRecord.approval_state =
        decision === 'approved'
          ? 'approved'
          : decision === 'rejected'
            ? 'rejected'
            : decision === 'changes_requested'
              ? 'rejected'
              : decision === 'overridden'
                ? 'approved'
            : 'not_requested';
      if (decision === 'approved' && !asString(nextRecord.status)) {
        nextRecord.status = 'completed';
      }
      syncMediaQueue(paths.project, nextRecord);
    }

    return nextRecord;
  });

  if (next.entity_type === 'publishing_job') {
    updateQueueEntity(paths.project, 'publishing_job', next.entity_id, {
      status:
        decision === 'approved' || decision === 'overridden'
          ? 'ready'
          : decision === 'escalated'
            ? 'escalated'
            : 'changes_requested',
      priority: decision === 'escalated' ? 'critical' : undefined
    });
  }

  if (decision === 'escalated') {
    createTask(paths.project, {
      title: `Escalation: ${next.title}`,
      description: next.decision_note || 'Governance escalation requires follow-up.',
      owner: roleDisplay(team, escalationTargetRole),
      owner_role: escalationTargetRole,
      assignee: roleDisplay(team, escalationTargetRole),
      assignee_role: escalationTargetRole,
      priority: next.risk_level === 'critical' ? 'critical' : 'high',
      service_domain: 'governance',
      route_target: 'governance',
      source_type: 'approval',
      source_id: next.id,
      linked_entity: {
        entity_type: next.entity_type,
        entity_id: next.entity_id
      },
      actor: next.decided_by
    });
  }

  if (decision === 'overridden') {
    appendGovernanceOverride(paths.project, {
      approval_id: next.id,
      entity_type: next.entity_type,
      entity_id: next.entity_id,
      action: 'manual_override',
      reason: next.decision_note,
      actor: next.decided_by
    });
  }

  return next;
}

function createHandoff(projectName, input = {}) {
  const paths = getOperationsPaths(projectName);
  const items = readCollection(paths.handoffsPath);
  const team = readTeamModel(paths.project);
  const destinationPage = asString(input.destination_page || input.route || input.destination);

  if (!destinationPage) {
    throw new Error('Handoff requires destination_page');
  }

  const current = findById(items, input.id) || {};
  const createdAt = asString(current.created_at) || asString(input.created_at) || nowIso();
  const linkedEntity = normalizeLinkedEntity(input.linked_entity || current.linked_entity || input);
  const sourceEntity = normalizeLinkedEntity(input.source_entity || current.source_entity);
  const sourceDomain = inferServiceDomain(linkedEntity?.entity_type || sourceEntity?.entity_type, {
    ...input,
    route_target: asString(input.source_page || current.source_page)
  });
  const destinationDomain = inferServiceDomain(linkedEntity?.entity_type || sourceEntity?.entity_type, {
    ...input,
    route_target: destinationPage
  });
  const sourceRouting = inferPrimaryRole(linkedEntity?.entity_type || sourceEntity?.entity_type || 'task', {
    ...input,
    route_target: asString(input.source_page || current.source_page)
  }, team);
  const destinationRole = getDomainDef(destinationDomain)?.owner_role || sourceRouting.reviewer_role || 'admin';
  const handoff = {
    id: asString(current.id) || asString(input.id) || createId('handoff'),
    project: paths.project,
    type: asString(input.type) || 'route_handoff',
    source_page: asString(input.source_page || current.source_page),
    destination_page: destinationPage,
    source_entity: sourceEntity,
    linked_entity: linkedEntity,
    payload: asObject(input.payload || current.payload),
    status: asString(input.status || current.status) || 'available',
    lifecycle_state: asString(input.lifecycle_state || current.lifecycle_state) || 'available',
    created_by: asString(input.created_by || input.actor || current.created_by) || 'mh-assistant',
    source_role: normalizeRoleKey(input.source_role || current.source_role || sourceRouting.owner_role, sourceRouting.owner_role),
    destination_role: normalizeRoleKey(input.destination_role || current.destination_role || destinationRole, destinationRole),
    source_role_label: roleDisplay(team, input.source_role || current.source_role || sourceRouting.owner_role),
    destination_role_label: roleDisplay(team, input.destination_role || current.destination_role || destinationRole),
    source_service_domain: sourceDomain,
    destination_service_domain: destinationDomain,
    route_key: asString(input.route_key || current.route_key) || `${asString(input.source_page)}:${destinationPage}`,
    created_at: createdAt,
    updated_at: nowIso(),
    consumed_at: asString(input.consumed_at || current.consumed_at),
    expires_at: asString(input.expires_at || current.expires_at),
    history: appendHistory(
      current,
      current.id ? 'handoff_updated' : 'handoff_created',
      input.actor || input.created_by,
      {
        source_page: asString(input.source_page || current.source_page),
        destination_page: destinationPage,
        status: asString(input.status || current.status) || 'available',
        destination_role: normalizeRoleKey(input.destination_role || current.destination_role || destinationRole, destinationRole)
      }
    )
  };

  const normalizedItems = items.map((item) => {
    const record = asObject(item);
    const sameRoute =
      asString(record.project) === paths.project &&
      asString(record.destination_page) === destinationPage &&
      asString(record.source_page) === handoff.source_page &&
      asString(record.id) !== handoff.id &&
      asString(record.status) === 'available';

    if (!sameRoute) {
      return record;
    }

    return {
      ...record,
      status: 'superseded',
      lifecycle_state: 'closed',
      updated_at: handoff.updated_at,
      history: appendHistory(record, 'handoff_superseded', handoff.created_by, {
        replaced_by: handoff.id
      })
    };
  });

  writeCollection(paths.handoffsPath, upsertById(normalizedItems, handoff), MAX_ITEMS.handoffs);
  updateSystem(paths);
  appendEvent(paths.project, {
    category: 'ai_routing',
    type: 'route_handoff_created',
    entity_type: 'handoff',
    entity_id: handoff.id,
    title: `${handoff.source_page || 'system'} to ${handoff.destination_page}`,
    summary: 'Durable cross-page handoff recorded.',
    actor: handoff.created_by,
    metadata: {
      source_page: handoff.source_page,
      destination_page: handoff.destination_page,
      route_key: handoff.route_key
    }
  });

  const handoffLinkedEntity = handoff.linked_entity || handoff.source_entity;
  if (handoffLinkedEntity?.entity_type && handoffLinkedEntity?.entity_id) {
    updateLinkedEntity(paths.project, handoffLinkedEntity.entity_type, handoffLinkedEntity.entity_id, (record) => {
      const nextRecord = {
        ...record,
        linked_handoffs: [...new Set([handoff.id, ...normalizeStringList(record.linked_handoffs)])],
        owner_role: asString(record.owner_role || sourceRouting.owner_role),
        next_owner_role: handoff.destination_role,
        next_owner_label: handoff.destination_role_label,
        updated_at: handoff.updated_at,
        history: appendHistory(record, 'handoff_linked', input.actor || input.created_by, {
          handoff_id: handoff.id,
          destination_page: handoff.destination_page
        })
      };

      if (handoffLinkedEntity.entity_type === 'content_item') {
        nextRecord.destination = handoff.destination_page;
        nextRecord.publish_status =
          handoff.destination_page === 'publishing'
            ? 'scheduled'
            : nextRecord.publish_status;
        nextRecord.queue_status =
          handoff.destination_page === 'publishing'
            ? 'ready_for_handoff'
            : nextRecord.queue_status;
        syncContentQueue(paths.project, nextRecord);
      } else if (handoffLinkedEntity.entity_type === 'media_job') {
        nextRecord.queue_status =
          handoff.destination_page === 'publishing'
            ? 'ready_for_handoff'
            : asString(nextRecord.queue_status);
        syncMediaQueue(paths.project, nextRecord);
      }

      return nextRecord;
    });
  }

  return handoff;
}

function listHandoffs(projectName, options = {}) {
  const paths = getOperationsPaths(projectName);
  const destinationPage = asString(options.destination_page || options.destination);
  const sourcePage = asString(options.source_page || options.source);
  const status = asString(options.status);
  let items = readCollection(paths.handoffsPath);

  if (destinationPage) {
    items = items.filter((item) => asString(item.destination_page) === destinationPage);
  }

  if (sourcePage) {
    items = items.filter((item) => asString(item.source_page) === sourcePage);
  }

  if (status) {
    items = items.filter((item) => asString(item.status) === status);
  }

  return listItems(items, options);
}

function consumeHandoff(projectName, handoffId, input = {}) {
  const paths = getOperationsPaths(projectName);
  const items = readCollection(paths.handoffsPath);
  const index = items.findIndex((item) => asString(item.id) === asString(handoffId));

  if (index < 0) {
    throw new Error('Handoff not found');
  }

  const current = asObject(items[index]);
  const consumedAt = nowIso();
  const next = {
    ...current,
    status: 'consumed',
    lifecycle_state: 'consumed',
    consumed_at: consumedAt,
    updated_at: consumedAt,
    history: appendHistory(current, 'handoff_consumed', input.actor, {
      destination_page: current.destination_page
    })
  };

  items[index] = next;
  writeJsonFile(paths.handoffsPath, items);
  updateSystem(paths);
  appendEvent(paths.project, {
    category: 'ai_routing',
    type: 'route_handoff_consumed',
    entity_type: 'handoff',
    entity_id: next.id,
    title: `${next.source_page || 'system'} to ${next.destination_page}`,
    summary: 'Durable cross-page handoff consumed.',
    actor: asString(input.actor) || 'mh-assistant'
  });

  return next;
}

function listEvents(projectName, options = {}) {
  const paths = getOperationsPaths(projectName);
  return listItems(readCollection(paths.eventsPath), options);
}

function syncPublishingJob(projectName, job = {}, executionResult = null) {
  const safeProject = normalizeProjectName(projectName);
  const team = readTeamModel(safeProject);
  const normalizedJob = asObject(job);
  const execution = asObject(executionResult);
  const jobId = asString(normalizedJob.job_id);

  if (!jobId) {
    throw new Error('Publishing job missing job_id');
  }

  const status = asString(execution.execution_status || normalizedJob.status) || 'scheduled';
  const queueItem = upsertQueueItem(safeProject, {
    queue_type: 'publishing',
    entity_type: 'publishing_job',
    entity_id: jobId,
    title: asString(normalizedJob.title) || `Publishing ${jobId}`,
    status,
    scheduled_for: asString(normalizedJob.scheduled_for),
    priority: status === 'failed' ? 'high' : 'normal',
    assignee: roleDisplay(team, 'publisher'),
    role: 'publisher',
    route: 'publishing',
    details: {
      channel: asString(normalizedJob.channel),
      wave_name: asString(normalizedJob.wave_name),
      mode: asString(normalizedJob.mode),
      source_status: asString(normalizedJob.status),
      execution_status: asString(execution.execution_status),
      service_domain: 'publishing',
      owner_role: 'publisher',
      review_role: 'compliance_reviewer'
    }
  });

  if (status === 'ready' || status === 'ready_for_manual_publish' || status === 'ready_for_manual_send') {
    createNotification(safeProject, {
      category: 'publishing',
      type: 'publishing',
      title: `${queueItem.title} is ready`,
      message: 'The publishing item is waiting for operator approval or handoff.',
      body: 'The publishing item is waiting for operator approval or handoff.',
      severity: 'info',
      linked_entity: {
        entity_type: 'publishing_job',
        entity_id: jobId,
        route: 'publishing'
      },
      entity_type: 'publishing_job',
      entity_id: jobId
    });
  }

  if (status === 'published') {
    createNotification(safeProject, {
      category: 'publishing',
      type: 'publishing',
      title: `${queueItem.title} published`,
      message: 'Publishing execution completed and was recorded durably.',
      body: 'Publishing execution completed and was recorded durably.',
      severity: 'success',
      linked_entity: {
        entity_type: 'publishing_job',
        entity_id: jobId,
        route: 'publishing'
      },
      entity_type: 'publishing_job',
      entity_id: jobId
    });
  }

  if (status === 'failed') {
    createNotification(safeProject, {
      category: 'publishing',
      type: 'publishing',
      title: `${queueItem.title} failed`,
      message: 'Publishing execution needs follow-up.',
      body: 'Publishing execution needs follow-up.',
      severity: 'critical',
      linked_entity: {
        entity_type: 'publishing_job',
        entity_id: jobId,
        route: 'publishing'
      },
      entity_type: 'publishing_job',
      entity_id: jobId
    });
  }

  appendEvent(safeProject, {
    category: 'publish',
    type: 'publishing_job_synced',
    entity_type: 'publishing_job',
    entity_id: jobId,
    title: queueItem.title,
    summary: `Publishing job synced into the durable queue with status ${status}.`,
    actor: 'mh-assistant',
    metadata: {
      status,
      channel: asString(normalizedJob.channel)
    }
  });

  return queueItem;
}

function summarizeCurrentHandoffs(items = []) {
  const byDestination = {};

  asArray(items).forEach((item) => {
    const destination = asString(item.destination_page);
    if (!destination || asString(item.status) !== 'available') {
      return;
    }

    if (!byDestination[destination]) {
      byDestination[destination] = item;
    }
  });

  return byDestination;
}

function summarizeOwnershipVisibility(team, entities = []) {
  const byRole = {};

  asArray(entities).forEach((item) => {
    const roleId = normalizeRoleKey(
      item.owner_role ||
      item.assignee_role ||
      item.reviewer_role ||
      item.role
    );

    if (!roleId) {
      return;
    }

    if (!byRole[roleId]) {
      byRole[roleId] = {
        role: roleId,
        label: roleDisplay(team, roleId),
        total: 0,
        open: 0
      };
    }

    byRole[roleId].total += 1;
    if (!['completed', 'published', 'closed', 'archived', 'cancelled'].includes(asString(item.status))) {
      byRole[roleId].open += 1;
    }
  });

  return Object.values(byRole).sort((a, b) => b.open - a.open || b.total - a.total);
}

function severityRank(value) {
  const normalized = asString(value).toLowerCase();
  if (normalized === 'critical') return 0;
  if (normalized === 'high' || normalized === 'warning') return 1;
  if (normalized === 'medium') return 2;
  if (normalized === 'low' || normalized === 'info') return 3;
  return 4;
}

function priorityRank(value) {
  const normalized = asString(value).toLowerCase();
  if (normalized === 'critical') return 0;
  if (normalized === 'high') return 1;
  if (normalized === 'normal') return 2;
  if (normalized === 'low') return 3;
  return 4;
}

function statusRank(value) {
  const normalized = asString(value).toLowerCase();
  if (['blocked', 'failed', 'escalated', 'critical'].includes(normalized)) return 0;
  if (['pending', 'queued', 'running', 'in_progress', 'processing'].includes(normalized)) return 1;
  if (['ready', 'scheduled', 'approved'].includes(normalized)) return 2;
  if (['completed', 'published', 'read', 'archived', 'cancelled', 'closed'].includes(normalized)) return 4;
  return 3;
}

function parseDate(value) {
  const text = asString(value);
  if (!text) return null;
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function dueState(dueAt) {
  const dueDate = parseDate(dueAt);
  if (!dueDate) return 'unscheduled';

  const delta = dueDate.getTime() - Date.now();
  if (delta < 0) return 'overdue';
  if (delta <= 48 * 60 * 60 * 1000) return 'due_soon';
  return 'upcoming';
}

function countBy(items = [], selector) {
  return asArray(items).reduce((acc, item) => {
    const key = asString(typeof selector === 'function' ? selector(item) : item?.[selector]) || 'unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function mapFilterCounts(items = [], selector) {
  return Object.entries(countBy(items, selector))
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}

function inferRouteTarget(entityType, record = {}) {
  const explicit =
    asString(record.route_target) ||
    asString(record.route) ||
    asString(record.destination_page) ||
    asString(record.source_page) ||
    asString(record.linked_entity?.route);

  if (explicit) {
    return explicit;
  }

  const normalizedType = asString(entityType);
  if (normalizedType === 'task') return 'workflows';
  if (normalizedType === 'approval') return 'governance';
  if (normalizedType === 'workflow_run') return 'workflows';
  if (normalizedType === 'content_item') return 'content-studio';
  if (normalizedType === 'media_job') return 'media-studio';
  if (normalizedType === 'publishing_job') return 'publishing';
  if (normalizedType === 'campaign') return 'campaign-studio';
  if (normalizedType === 'handoff') return asString(record.destination_page) || 'workflows';
  if (normalizedType === 'notification') return inferRouteTarget(record.entity_type, record) || 'home';

  if (record.service_domain && getDomainDef(record.service_domain)?.route_target) {
    return getDomainDef(record.service_domain).route_target;
  }

  return 'home';
}

function buildRouteLink(entityType, record = {}) {
  return {
    route: inferRouteTarget(entityType, record),
    entity_type: asString(entityType) || asString(record.entity_type),
    entity_id: asString(record.entity_id || record.id || record.linked_entity?.entity_id),
    label: asString(record.title || record.name) || 'Open item'
  };
}

function buildTaskCenter(tasks = []) {
  const items = asArray(tasks)
    .map((task) => {
      const dueAt = asString(task.due_at || task.due_date);
      return {
        id: asString(task.id),
        title: asString(task.title) || 'Task',
        description: asString(task.description),
        owner: asString(task.owner || task.assignee),
        owner_role: asString(task.owner_role || task.assignee_role),
        assignee: asString(task.assignee || task.owner),
        assignee_role: asString(task.assignee_role || task.owner_role),
        due_at: dueAt,
        due_state: dueState(dueAt),
        priority: asString(task.priority) || 'normal',
        source_page: asString(task.source_page),
        service_domain: asString(task.service_domain),
        linked_entity: normalizeLinkedEntity(task.linked_entity || {}),
        status: asString(task.status) || 'open',
        route: buildRouteLink('task', task),
        updated_at: asString(task.updated_at),
        created_at: asString(task.created_at)
      };
    })
    .sort((a, b) => {
      const dueDiff = statusRank(a.due_state) - statusRank(b.due_state);
      if (dueDiff !== 0) return dueDiff;
      const priorityDiff = priorityRank(a.priority) - priorityRank(b.priority);
      if (priorityDiff !== 0) return priorityDiff;
      return (parseDate(b.updated_at)?.getTime() || 0) - (parseDate(a.updated_at)?.getTime() || 0);
    });

  return {
    total: items.length,
    open_count: items.filter((item) => ['open', 'queued', 'in_progress'].includes(item.status)).length,
    blocked_count: items.filter((item) => item.status === 'blocked').length,
    overdue_count: items.filter((item) => item.due_state === 'overdue').length,
    due_soon_count: items.filter((item) => item.due_state === 'due_soon').length,
    filters: {
      statuses: mapFilterCounts(items, 'status'),
      priorities: mapFilterCounts(items, 'priority'),
      owners: mapFilterCounts(items, 'owner_role'),
      source_pages: mapFilterCounts(items, 'source_page'),
      service_domains: mapFilterCounts(items, 'service_domain')
    },
    items
  };
}

function buildWorkflowQueueFallback(workflowRuns = []) {
  return asArray(workflowRuns)
    .filter((item) => ['queued', 'running', 'failed', 'completed'].includes(asString(item.status)))
    .map((item) => ({
      id: createId('queuewf'),
      queue_type: 'workflow',
      entity_type: 'workflow_run',
      entity_id: asString(item.id),
      title: asString(item.title) || asString(item.workflow_id) || 'Workflow run',
      status: asString(item.status) || 'queued',
      assignee: asString(item.created_by) || 'MH Assistant',
      role: 'system_orchestrator',
      priority: asString(item.status) === 'failed' ? 'high' : 'normal',
      route: inferRouteTarget('workflow_run', item),
      details: {
        workflow_id: asString(item.workflow_id),
        source: asString(item.source)
      },
      updated_at: asString(item.updated_at || item.created_at),
      created_at: asString(item.created_at)
    }));
}

function buildSyncQueueFromEvents(events = []) {
  return asArray(events)
    .filter((item) => asString(item.category) === 'sync' || asString(item.type).includes('sync'))
    .slice(0, 20)
    .map((event) => ({
      id: asString(event.id),
      queue_type: 'sync',
      entity_type: asString(event.entity_type) || 'sync_event',
      entity_id: asString(event.entity_id) || asString(event.id),
      title: asString(event.title) || 'Sync event',
      status: asString(event.metadata?.status) || (asString(event.type).includes('fail') ? 'failed' : 'completed'),
      assignee: 'Integration control',
      role: 'admin',
      priority: asString(event.metadata?.status) === 'failed' || asString(event.type).includes('fail') ? 'high' : 'normal',
      route: 'integrations',
      details: {
        category: asString(event.category),
        summary: asString(event.summary)
      },
      updated_at: asString(event.timestamp),
      created_at: asString(event.timestamp)
    }));
}

function normalizeQueueItemRecord(item = {}) {
  return {
    id: asString(item.id),
    queue_type: asString(item.queue_type) || 'general',
    entity_type: asString(item.entity_type),
    entity_id: asString(item.entity_id),
    title: asString(item.title) || 'Queue item',
    status: asString(item.status) || 'queued',
    priority: asString(item.priority) || 'normal',
    assignee: asString(item.assignee),
    role: asString(item.role),
    route: asString(item.route) || inferRouteTarget(item.entity_type, item),
    scheduled_for: asString(item.scheduled_for),
    details: asObject(item.details),
    updated_at: asString(item.updated_at || item.created_at),
    created_at: asString(item.created_at)
  };
}

function buildQueueCenter(queueItems = [], workflowRuns = [], events = []) {
  const normalizedQueue = asArray(queueItems).map((item) => normalizeQueueItemRecord(item));
  const workflowQueue = normalizedQueue.filter((item) => item.queue_type === 'workflow' || item.entity_type === 'workflow_run');
  const workflowFallback = workflowQueue.length ? workflowQueue : buildWorkflowQueueFallback(workflowRuns);
  const syncQueue = [
    ...normalizedQueue.filter((item) => item.queue_type === 'sync'),
    ...buildSyncQueueFromEvents(events)
  ].slice(0, MAX_ITEMS.queue);
  const queueGroups = {
    workflow: workflowFallback,
    content: normalizedQueue.filter((item) => item.queue_type === 'content'),
    media: normalizedQueue.filter((item) => item.queue_type === 'media'),
    approval: normalizedQueue.filter((item) => item.queue_type === 'approval'),
    publishing: normalizedQueue.filter((item) => item.queue_type === 'publishing'),
    sync: syncQueue
  };

  const items = Object.entries(queueGroups)
    .flatMap(([queueType, groupedItems]) =>
      asArray(groupedItems).map((item) => ({
        ...item,
        queue_type: queueType
      }))
    )
    .sort((a, b) => {
      const statusDiff = statusRank(a.status) - statusRank(b.status);
      if (statusDiff !== 0) return statusDiff;
      const priorityDiff = priorityRank(a.priority) - priorityRank(b.priority);
      if (priorityDiff !== 0) return priorityDiff;
      return (parseDate(b.updated_at)?.getTime() || 0) - (parseDate(a.updated_at)?.getTime() || 0);
    });

  return {
    total: items.length,
    active_count: items.filter((item) => !['completed', 'published', 'read', 'archived', 'closed', 'cancelled'].includes(item.status)).length,
    queue_counts: Object.entries(queueGroups).map(([queueType, groupedItems]) => ({
      queue_type: queueType,
      total: asArray(groupedItems).length,
      active: asArray(groupedItems).filter((item) => !['completed', 'published', 'closed', 'cancelled'].includes(asString(item.status))).length
    })),
    filters: {
      queue_types: mapFilterCounts(items, 'queue_type'),
      statuses: mapFilterCounts(items, 'status'),
      priorities: mapFilterCounts(items, 'priority'),
      roles: mapFilterCounts(items, 'role')
    },
    workflow_queue: workflowFallback,
    content_queue: queueGroups.content,
    media_queue: queueGroups.media,
    approval_queue: queueGroups.approval,
    publishing_queue: queueGroups.publishing,
    sync_queue: queueGroups.sync,
    items
  };
}

function buildJobEntries(workflowRuns = [], mediaJobs = [], queueItems = []) {
  const workflowJobs = asArray(workflowRuns).map((item) => ({
    id: asString(item.id),
    kind: 'workflow',
    entity_type: 'workflow_run',
    entity_id: asString(item.id),
    title: asString(item.title) || asString(item.workflow_id) || 'Workflow run',
    status: asString(item.status) || 'queued',
    route: inferRouteTarget('workflow_run', item),
    owner: asString(item.created_by) || 'MH Assistant',
    health_state: ['failed', 'cancelled'].includes(asString(item.status)) ? 'critical' : asString(item.status) === 'running' ? 'active' : 'healthy',
    retry_count: Number(item.retry_count || item.retries || item.inputs?.retry_count || 0) || 0,
    created_at: asString(item.created_at),
    updated_at: asString(item.updated_at || item.created_at)
  }));
  const mediaJobItems = asArray(mediaJobs).map((item) => ({
    id: asString(item.id),
    kind: 'media',
    entity_type: 'media_job',
    entity_id: asString(item.id),
    title: asString(item.title) || `${asString(item.request_type) || 'media'} job`,
    status: asString(item.status) || 'requested',
    route: inferRouteTarget('media_job', item),
    owner: asString(item.owner),
    health_state: ['failed', 'cancelled'].includes(asString(item.status)) ? 'critical' : ['processing', 'queued', 'requested'].includes(asString(item.status)) ? 'active' : 'healthy',
    retry_count: Number(item.retry_count || item.provider_metadata?.retry_count || 0) || 0,
    created_at: asString(item.created_at),
    updated_at: asString(item.updated_at || item.created_at)
  }));
  const publishingJobs = asArray(queueItems)
    .filter((item) => asString(item.entity_type) === 'publishing_job')
    .map((item) => ({
      id: asString(item.id),
      kind: 'publishing',
      entity_type: 'publishing_job',
      entity_id: asString(item.entity_id),
      title: asString(item.title) || 'Publishing job',
      status: asString(item.status) || 'scheduled',
      route: inferRouteTarget('publishing_job', item),
      owner: asString(item.assignee),
      health_state: asString(item.status) === 'failed' ? 'critical' : ['scheduled', 'ready'].includes(asString(item.status)) ? 'active' : 'healthy',
      retry_count: Number(item.details?.retry_count || 0) || 0,
      created_at: asString(item.created_at),
      updated_at: asString(item.updated_at || item.created_at)
    }));

  return [...workflowJobs, ...mediaJobItems, ...publishingJobs]
    .sort((a, b) => {
      const statusDiff = statusRank(a.status) - statusRank(b.status);
      if (statusDiff !== 0) return statusDiff;
      return (parseDate(b.updated_at)?.getTime() || 0) - (parseDate(a.updated_at)?.getTime() || 0);
    });
}

function buildJobMonitor(jobEntries = [], events = []) {
  const items = asArray(jobEntries);
  const runningJobs = items.filter((item) => ['queued', 'running', 'requested', 'processing', 'scheduled', 'ready'].includes(asString(item.status)));
  const completedJobs = items.filter((item) => ['completed', 'published'].includes(asString(item.status)));
  const failedJobs = items.filter((item) => ['failed', 'cancelled'].includes(asString(item.status)));
  const totalRetries = items.reduce((sum, item) => sum + (Number(item.retry_count) || 0), 0);
  const executionLogs = asArray(events)
    .filter((item) => ['workflow', 'publish', 'sync', 'system'].includes(asString(item.category)) || ['workflow_run', 'publishing_job', 'media_job'].includes(asString(item.entity_type)))
    .slice(0, 40)
    .map((event) => ({
      id: asString(event.id),
      category: asString(event.category),
      type: asString(event.type),
      title: asString(event.title) || 'Execution event',
      summary: asString(event.summary),
      timestamp: asString(event.timestamp),
      route: inferRouteTarget(asString(event.entity_type), event),
      entity_type: asString(event.entity_type),
      entity_id: asString(event.entity_id),
      severity: asString(event.metadata?.status) === 'failed' || asString(event.type).includes('fail') ? 'critical' : 'info'
    }));

  return {
    total: items.length,
    running_count: runningJobs.length,
    completed_count: completedJobs.length,
    failed_count: failedJobs.length,
    total_retries: totalRetries,
    health_state: failedJobs.length ? 'critical' : runningJobs.length ? 'active' : 'healthy',
    running_jobs: runningJobs,
    completed_jobs: completedJobs.slice(0, 20),
    failed_jobs: failedJobs.slice(0, 20),
    execution_logs: executionLogs,
    items
  };
}

function buildNotificationAlert(input = {}) {
  return {
    id: asString(input.id) || createId('alert'),
    title: asString(input.title) || 'Alert',
    message: asString(input.message || input.body || input.summary),
    severity: asString(input.severity) || 'info',
    status: asString(input.status) || 'active',
    source: asString(input.source) || asString(input.category) || 'system',
    entity_type: asString(input.entity_type),
    entity_id: asString(input.entity_id),
    route: inferRouteTarget(asString(input.entity_type), input),
    route_label: asString(input.route_label) || inferRouteTarget(asString(input.entity_type), input),
    created_at: asString(input.created_at || input.timestamp) || nowIso(),
    notification_id: asString(input.notification_id || input.id)
  };
}

function buildNotificationCenter({
  notifications = [],
  approvals = [],
  queueItems = [],
  workflowRuns = [],
  governanceSummary = {},
  events = []
} = {}) {
  const unreadNotifications = asArray(notifications).filter((item) => !asBoolean(item.read));
  const syncFailureAlerts = [
    ...asArray(notifications)
      .filter((item) => asString(item.category) === 'sync' && ['warning', 'critical'].includes(asString(item.severity)))
      .map((item) => buildNotificationAlert({
        ...item,
        source: 'sync_failure',
        notification_id: item.id
      })),
    ...asArray(events)
      .filter((item) => (asString(item.category) === 'sync' || asString(item.type).includes('sync')) && (asString(item.metadata?.status) === 'failed' || asString(item.type).includes('fail')))
      .map((item) => buildNotificationAlert({
        ...item,
        source: 'sync_failure',
        severity: 'critical',
        route_label: 'integrations'
      }))
  ];

  const approvalPendingAlerts = asArray(approvals)
    .filter((item) => asString(item.status) === 'pending')
    .map((item) => buildNotificationAlert({
      id: `approval-pending-${item.id}`,
      title: asString(item.title) || 'Approval pending',
      message: asString(item.summary) || 'Approval requires review.',
      severity: asString(item.risk_level) === 'critical' ? 'critical' : asString(item.risk_level) === 'high' ? 'warning' : 'info',
      source: 'approval_pending',
      entity_type: 'approval',
      entity_id: asString(item.id),
      created_at: asString(item.created_at)
    }));

  const publishAlerts = asArray(queueItems)
    .filter((item) => asString(item.entity_type) === 'publishing_job' && ['ready', 'published', 'failed'].includes(asString(item.status)))
    .map((item) => buildNotificationAlert({
      id: `publishing-${item.entity_id}-${item.status}`,
      title: asString(item.title) || 'Publishing update',
      message:
        asString(item.status) === 'failed'
          ? 'Publishing execution needs follow-up.'
          : asString(item.status) === 'published'
            ? 'Publishing execution completed successfully.'
            : 'Publishing item is waiting for approval or release.',
      severity:
        asString(item.status) === 'failed'
          ? 'critical'
          : asString(item.status) === 'published'
            ? 'success'
            : 'info',
      source: 'publish',
      entity_type: 'publishing_job',
      entity_id: asString(item.entity_id),
      created_at: asString(item.updated_at || item.created_at)
    }));

  const providerDisconnectAlerts = [
    ...asArray(notifications)
      .filter((item) => ['integration', 'provider'].includes(asString(item.category)) && ['warning', 'critical'].includes(asString(item.severity)))
      .map((item) => buildNotificationAlert({
        ...item,
        source: 'provider_disconnect',
        notification_id: item.id,
        route_label: 'integrations'
      })),
    ...asArray(events)
      .filter((item) => /disconnect|offline|provider/i.test(asString(item.type)) || /disconnect|offline|provider/i.test(asString(item.title)))
      .map((item) => buildNotificationAlert({
        ...item,
        source: 'provider_disconnect',
        severity: 'warning',
        route_label: 'integrations'
      }))
  ];

  const claimRiskAlerts = [
    ...asArray(governanceSummary?.sections?.claim_review)
      .flatMap((item) => asArray(item.claim_flags).map((flag) => buildNotificationAlert({
        id: `${item.id}-${flag.id}`,
        title: asString(item.title) || 'Claim risk',
        message: asString(flag.message),
        severity: asString(flag.severity) || 'warning',
        source: 'claim_risk',
        entity_type: asString(item.entity_type),
        entity_id: asString(item.entity_id)
      }))),
    ...asArray(governanceSummary?.sections?.policy_violations)
      .filter((item) => asString(item.source) === 'claim_review')
      .map((item) => buildNotificationAlert({
        id: asString(item.id),
        title: asString(item.title) || 'Policy violation',
        message: asString(item.message),
        severity: asString(item.severity) || 'warning',
        source: 'claim_risk',
        entity_type: asString(item.entity_type),
        entity_id: asString(item.entity_id)
      }))
  ];

  const workflowCompletionAlerts = asArray(workflowRuns)
    .filter((item) => ['completed', 'failed'].includes(asString(item.status)))
    .slice(0, 20)
    .map((item) => buildNotificationAlert({
      id: `workflow-${item.id}`,
      title: asString(item.title) || asString(item.workflow_id) || 'Workflow run',
      message:
        asString(item.status) === 'failed'
          ? 'Workflow finished with a failure state.'
          : 'Workflow completed and output is available.',
      severity: asString(item.status) === 'failed' ? 'critical' : 'success',
      source: 'workflow_completion',
      entity_type: 'workflow_run',
      entity_id: asString(item.id),
      created_at: asString(item.updated_at || item.created_at)
    }));

  const items = [
    ...syncFailureAlerts,
    ...approvalPendingAlerts,
    ...publishAlerts,
    ...providerDisconnectAlerts,
    ...claimRiskAlerts,
    ...workflowCompletionAlerts
  ].sort((a, b) => {
    const severityDiff = severityRank(a.severity) - severityRank(b.severity);
    if (severityDiff !== 0) return severityDiff;
    return (parseDate(b.created_at)?.getTime() || 0) - (parseDate(a.created_at)?.getTime() || 0);
  });

  return {
    total: items.length,
    unread_count: unreadNotifications.length,
    critical_count: items.filter((item) => item.severity === 'critical').length,
    notification_items: asArray(notifications).slice(0, 40),
    sync_failure_alerts: syncFailureAlerts,
    approval_pending_alerts: approvalPendingAlerts,
    publish_alerts: publishAlerts,
    provider_disconnect_alerts: providerDisconnectAlerts,
    claim_risk_alerts: claimRiskAlerts,
    workflow_completion_alerts: workflowCompletionAlerts,
    items
  };
}

function buildOperationsSnapshot(projectName, options = {}) {
  const paths = getOperationsPaths(projectName);
  const system = asObject(readJsonFile(paths.systemPath, {}));
  const governance = asObject(readJsonFile(paths.governancePath, {}));
  const team = readTeamModel(paths.project);
  const campaigns = readCollection(paths.campaignsPath);
  const contentItems = readCollection(paths.contentItemsPath);
  const mediaJobs = readCollection(paths.mediaJobsPath);
  const workflowRuns = readCollection(paths.workflowsPath);
  const aiCommands = readCollection(paths.aiCommandsPath);
  const aiArtifacts = readCollection(paths.aiArtifactsPath);
  const aiRecommendations = readCollection(paths.aiRecommendationsPath);
  const aiMemory = readCollection(paths.aiMemoryPath);
  const tasks = readCollection(paths.tasksPath);
  const approvals = readCollection(paths.approvalsPath);
  const queueItems = readCollection(paths.queuePath);
  const notifications = readCollection(paths.notificationsPath);
  const handoffs = readCollection(paths.handoffsPath);
  const events = readCollection(paths.eventsPath);
  const governanceSummary = buildGovernanceSummary(paths.project, {
    timelineLimit: options.timelineLimit || 20
  });
  const taskLimit = Number(options.taskLimit || 10) || 10;
  const workflowLimit = Number(options.workflowLimit || 8) || 8;
  const approvalLimit = Number(options.approvalLimit || 8) || 8;
  const notificationLimit = Number(options.notificationLimit || 8) || 8;
  const queueLimit = Number(options.queueLimit || 12) || 12;
  const timelineLimit = Number(options.timelineLimit || 12) || 12;
  const campaignLimit = Number(options.campaignLimit || 8) || 8;
  const contentLimit = Number(options.contentLimit || 12) || 12;
  const mediaLimit = Number(options.mediaLimit || 12) || 12;
  const handoffLimit = Number(options.handoffLimit || 12) || 12;
  const ownershipEntities = [
    ...campaigns,
    ...contentItems,
    ...mediaJobs,
    ...tasks,
    ...approvals,
    ...queueItems
  ];
  const domainRouting = Object.entries(SERVICE_DOMAIN_DEFS).map(([id, domain]) => ({
    domain: id,
    label: domain.label,
    owner_role: domain.owner_role,
    owner_label: roleDisplay(team, domain.owner_role),
    review_role: domain.review_role,
    review_label: roleDisplay(team, domain.review_role),
    handoff_to: asArray(domain.handoff_to).map((roleId) => ({
      role: roleId,
      label: roleDisplay(team, roleId)
    })),
    route_target: domain.route_target,
    page_permissions: asArray(domain.page_permissions)
  }));
  const taskCenter = buildTaskCenter(tasks);
  const queueCenter = buildQueueCenter(queueItems, workflowRuns, events);
  const jobMonitor = buildJobMonitor(buildJobEntries(workflowRuns, mediaJobs, queueItems), events);
  const notificationCenter = buildNotificationCenter({
    notifications,
    approvals,
    queueItems,
    workflowRuns,
    governanceSummary,
    events
  });

  return {
    project: paths.project,
    generated_at: nowIso(),
    backbone: {
      version: system.version || BACKBONE_VERSION,
      status: system.status || 'operational',
      durable_entities: asArray(system.durable_entities),
      last_updated: system.updated_at || nowIso()
    },
    status_models: STATUS_MODELS,
    governance,
    task_center: taskCenter,
    queue_center: queueCenter,
    job_monitor: jobMonitor,
    notification_center: notificationCenter,
    team_service_model: {
      active_role: team.active_role,
      role_matrix: asArray(team.role_matrix),
      route_permissions: asArray(team.route_permissions),
      domains: asArray(team.service_model?.domains),
      escalation_chain: asObject(team.escalation_chain)
    },
    ownership: {
      default_owner: 'mh-assistant',
      active_role: team.active_role,
      team_roles: asArray(team.members).map((member) => ({
        id: member.id,
        name: member.name,
        role: member.role,
        type: member.type,
        page_permissions: asArray(member.page_permissions),
        action_permissions: asArray(member.action_permissions),
        service_domains: asArray(member.service_domains)
      })),
      visibility: summarizeOwnershipVisibility(team, ownershipEntities)
    },
    team: {
      members: asArray(team.members),
      service_model: asObject(team.service_model),
      route_permissions: asArray(team.route_permissions),
      role_matrix: asArray(team.role_matrix),
      escalation_chain: asObject(team.escalation_chain)
    },
    routing: {
      role_routes: domainRouting,
      queue_by_role: summarizeOwnershipVisibility(team, queueItems),
      handoffs_by_role: asArray(handoffs)
        .filter((item) => asString(item.status) === 'available')
        .map((item) => ({
          id: item.id,
          source_page: item.source_page,
          destination_page: item.destination_page,
          source_role: item.source_role,
          source_role_label: item.source_role_label,
          destination_role: item.destination_role,
          destination_role_label: item.destination_role_label,
          status: item.status,
          linked_entity: item.linked_entity
        }))
    },
    campaigns: {
      total: campaigns.length,
      active_count: campaigns.filter((item) => asString(item.status) === 'active').length,
      items: campaigns.slice(0, campaignLimit)
    },
    content_items: {
      total: contentItems.length,
      draft_count: contentItems.filter((item) => asString(item.status) === 'draft').length,
      pending_approval_count: contentItems.filter((item) => asString(item.approval_status) === 'pending').length,
      items: contentItems.slice(0, contentLimit)
    },
    media_jobs: {
      total: mediaJobs.length,
      open_count: mediaJobs.filter((item) => !['completed', 'failed', 'cancelled'].includes(asString(item.status))).length,
      items: mediaJobs.slice(0, mediaLimit)
    },
    workflows: {
      total_runs: workflowRuns.length,
      completed_runs: workflowRuns.filter((item) => asString(item.status) === 'completed').length,
      recent_runs: workflowRuns.slice(0, workflowLimit),
      items: workflowRuns.slice(0, workflowLimit)
    },
    workflow_runs: {
      total: workflowRuns.length,
      items: workflowRuns.slice(0, workflowLimit)
    },
    ai_commands: {
      total: aiCommands.length,
      completed_count: aiCommands.filter((item) => asString(item.status) === 'completed').length,
      items: aiCommands.slice(0, workflowLimit)
    },
    ai_artifacts: {
      total: aiArtifacts.length,
      items: aiArtifacts.slice(0, contentLimit)
    },
    ai_recommendations: {
      total: aiRecommendations.length,
      open_count: aiRecommendations.filter((item) => asString(item.status) === 'open').length,
      items: aiRecommendations.slice(0, contentLimit)
    },
    ai_memory: {
      total: aiMemory.length,
      items: aiMemory.slice(0, taskLimit)
    },
    tasks: {
      total: tasks.length,
      open_count: tasks.filter((item) => ['open', 'queued', 'in_progress'].includes(asString(item.status))).length,
      blocked_count: tasks.filter((item) => asString(item.status) === 'blocked').length,
      items: tasks.slice(0, taskLimit)
    },
    approvals: {
      total: approvals.length,
      pending_count: approvals.filter((item) => asString(item.status) === 'pending').length,
      by_reviewer_role: summarizeOwnershipVisibility(team, approvals),
      items: approvals.slice(0, approvalLimit)
    },
    queues: {
      total: queueItems.length,
      active_count: queueItems.filter((item) => !['published', 'completed', 'closed'].includes(asString(item.status))).length,
      items: queueItems.slice(0, queueLimit)
    },
    notifications: {
      total: notifications.length,
      unread_count: notifications.filter((item) => !item.read).length,
      items: notifications.slice(0, notificationLimit)
    },
    handoffs: {
      total: handoffs.length,
      available_count: handoffs.filter((item) => asString(item.status) === 'available').length,
      current: summarizeCurrentHandoffs(handoffs),
      by_role: asArray(handoffs)
        .filter((item) => asString(item.status) === 'available')
        .map((item) => ({
          id: item.id,
          source_role: item.source_role,
          destination_role: item.destination_role,
          source_role_label: item.source_role_label,
          destination_role_label: item.destination_role_label,
          source_page: item.source_page,
          destination_page: item.destination_page,
          status: item.status
        })),
      items: handoffs.slice(0, handoffLimit)
    },
    timeline: {
      items: events.slice(0, timelineLimit)
    },
    event_log: {
      total: events.length,
      items: events.slice(0, timelineLimit)
    }
  };
}

module.exports = {
  STATUS_MODELS,
  buildOperationsSnapshot,
  buildGovernanceSummary,
  readTeamModel,
  updateTeamModel,
  getGovernancePolicy,
  updateGovernancePolicy,
  upsertCampaign,
  listCampaigns,
  getCampaign,
  upsertContentItem,
  listContentItems,
  getContentItem,
  upsertMediaJob,
  listMediaJobs,
  getMediaJob,
  recordWorkflowRun,
  listWorkflowRuns,
  getWorkflowRun,
  createAiCommandRecord,
  listAiCommandRecords,
  getAiCommandRecord,
  createAiArtifact,
  listAiArtifacts,
  createAiRecommendation,
  listAiRecommendations,
  upsertAiMemory,
  listAiMemory,
  createTask,
  listTasks,
  getTask,
  createApproval,
  listApprovals,
  decideApproval,
  createNotification,
  listNotifications,
  markNotification,
  listQueueItems,
  createHandoff,
  listHandoffs,
  consumeHandoff,
  listEvents,
  syncPublishingJob
};

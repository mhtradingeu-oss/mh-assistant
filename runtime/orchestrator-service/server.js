const axios = require('axios');
const crypto = require('crypto');
const {
  generateWorkerId,
  isJobDue,
  isJobLockExpired,
  buildSchedulerJobRecord
} = require('./lib/execution/scheduler-helpers');
const { createSchedulerStorage } = require('./lib/execution/scheduler-storage');
const { createExecutionJobBridge } = require('./lib/execution/execution-job-bridge');
const {
  toFiniteNumber,
  normalizeFeedbackMetrics,
  derivePerformanceStats
} = require('./lib/execution/performance-metrics');
const { createPerformanceStorage } = require('./lib/execution/performance-storage');
const {
  buildRiskAlerts: buildRiskAlertsBase,
  buildLearningCandidates
} = require('./lib/execution/recommendation-builders');
const { createRecommendationRuntime } = require('./lib/execution/recommendation-runtime');
const { createLearningPatterns } = require('./lib/execution/learning-patterns');
const { createIntelligenceLoop } = require('./lib/execution/intelligence-loop');
const { createSmartSuggestions } = require('./lib/execution/smart-suggestions');
const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const FormData = require('form-data');
const {
  normalizeCredentials,
  applyEncryptedCredentials,
  hasIntegrationSecretKeyConfigured
} = require('./lib/integrations/token-manager');
const { UnifiedDataPathResolver } = require('./lib/data/unified-data-path-resolver');
const { ExecutionArtifactWriterAdapter } = require('./lib/data/execution-artifact-writer-adapter');
const {
  createLogger,
  createConsoleLikeLogger,
  sanitizeValue,
  serializeErrorForLog
} = require('./lib/observability/logger');
const { createInMemoryRateLimiter } = require('./lib/observability/rate-limit');
const { executeAdapterAction } = require('./lib/integrations/adapter-manager');
const { buildHealthState } = require('./lib/integrations/health-manager');
const {
  isSupportedProvider,
  getUnsupportedProviderMessage
} = require('./lib/integrations/provider-registry');
const {
  buildProjectInsightsPayload,
  buildProjectLearningPayload
} = require('./lib/insights/ingestion-service');
const {
  createMediaProviderLayer
} = require('./lib/media/provider-layer');
const {
  normalizeProjectSlug,
  resolveProjectPath,
  isProjectSlugValidationError
} = require('./lib/security/project-isolation');
const {
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
  createAiArtifact,
  listAiCommandRecords,
  getAiCommandRecord,
  listAiArtifacts,
  listAiRecommendations,
  listAiMemory,
  getWorkflowRun,
  createTask,
  listTasks,
  getTask,
  createApproval,
  listApprovals,
  decideApproval,
  listNotifications,
  markNotification,
  listWorkflowRuns,
  createHandoff,
  listHandoffs,
  consumeHandoff,
  listEvents,
  syncPublishingJob
} = require('./lib/ops/backbone');
const { createAiOrchestrationService } = require('./lib/ops/ai-orchestrator');

const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');

process.on('uncaughtException', (err) => {
  try {
    appLogger.error('uncaught_exception', {
      route: 'process',
      action: 'uncaught_exception',
      error: serializeErrorForLog(err)
    });
  } catch (_) {
    console.error('[uncaughtException]', err);
  }
  // Allow systemd to restart the process
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  try {
    appLogger.error('unhandled_rejection', {
      route: 'process',
      action: 'unhandled_rejection',
      error: serializeErrorForLog(reason instanceof Error ? reason : new Error(String(reason)))
    });
  } catch (_) {
    console.error('[unhandledRejection]', reason);
  }
});

const app = express();
app.use(helmet({
  contentSecurityPolicy: false // CSP managed separately; avoids breaking existing UI
}));
app.use(cors({
  origin: [
    /^https:\/\/[a-z0-9-]+\.hairoticmen\.de$/i,
    /^http:\/\/localhost(:\d+)?$/
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'x-mh-control-write-key',
    'x-mh-access-key'
  ],
  credentials: true
}));
app.use(compression());
app.use(express.json());

const appLogger = createLogger({
  service: 'orchestrator-service'
});
const runtimeCompatLogger = createConsoleLikeLogger(appLogger, {
  route: 'runtime',
  action: 'runtime_log'
});

const CONTROL_WRITE_KEY_HEADER = 'x-mh-control-key';
const CONTROL_WRITE_KEY_ENV = 'MH_CONTROL_CENTER_WRITE_KEY';
// Temporary local/server diagnostic bypass. Do not enable in production.
const CONTROL_CENTER_DISABLE_ACCESS_KEY_ENV = 'MH_CONTROL_CENTER_DISABLE_ACCESS_KEY';
const CONTROL_CENTER_KEY_BYPASS_HEADER = 'X-MH-Control-Key-Bypass';
const CONTROL_CENTER_KEY_BYPASS_HEADER_VALUE = 'temporary';
const CONTROL_CENTER_ACCESS_KEY_BYPASS_ENABLED = String(
  process.env[CONTROL_CENTER_DISABLE_ACCESS_KEY_ENV] || ''
).trim() === '1';

if (CONTROL_CENTER_ACCESS_KEY_BYPASS_ENABLED) {
  console.warn('CONTROL CENTER ACCESS KEY DISABLED - TEMPORARY TEST MODE');
}

const LEGACY_PROTECTED_WRITE_ROUTE_PATTERNS = [
  /^\/task\/?$/i,
  /^\/ingest\/?$/i,
  /^\/backup-and-clone-product\/[^/]+\/?$/i,
  /^\/apply-prepared-copy-to-clone\/[^/]+\/[^/]+\/?$/i,
  /^\/telegram-command\/?$/i,
  /^\/media\/upload\/?$/i,
  /^\/publish-clone\/[^/]+\/?$/i,
  /^\/replace-original-product\/[^/]+\/[^/]+\/?$/i,
  /^\/cleanup-clone\/[^/]+\/?$/i,
  /^\/publish-blog\/[^/]+\/?$/i,
  /^\/rollback-product\/[^/]+\/?$/i
];

function isProtectedControlWriteRequest(req) {
  const method = String(req.method || '').trim().toUpperCase();
  if (!['POST', 'PATCH', 'DELETE'].includes(method)) {
    return false;
  }

  const requestPath = String(req.path || '').trim();
  return /^\/(?:public\/)?media-manager\//.test(requestPath)
    || LEGACY_PROTECTED_WRITE_ROUTE_PATTERNS.some((pattern) => pattern.test(requestPath));
}

function readProvidedControlWriteKey(req) {
  const explicitHeader = String(req.get(CONTROL_WRITE_KEY_HEADER) || '').trim();
  if (explicitHeader) {
    return explicitHeader;
  }

  const authorization = String(req.get('authorization') || '').trim();
  const bearerMatch = authorization.match(/^Bearer\s+(.+)$/i);
  return bearerMatch ? String(bearerMatch[1] || '').trim() : '';
}

function controlWriteKeyMatches(expected, provided) {
  const expectedBuffer = Buffer.from(String(expected || ''), 'utf8');
  const providedBuffer = Buffer.from(String(provided || ''), 'utf8');

  if (!expectedBuffer.length || expectedBuffer.length !== providedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, providedBuffer);
}

function requireProtectedControlWriteKey(req, res, next) {
  if (!isProtectedControlWriteRequest(req)) {
    return next();
  }

  const expectedKey = String(process.env[CONTROL_WRITE_KEY_ENV] || '').trim();
  if (!expectedKey) {
    return res.status(503).json({
      error: `Protected write routes are disabled until ${CONTROL_WRITE_KEY_ENV} is configured on the server.`
    });
  }

  const providedKey = readProvidedControlWriteKey(req);
  if (!providedKey) {
    return res.status(401).json({
      error: `Missing protected write key. Provide ${CONTROL_WRITE_KEY_HEADER} or Authorization: Bearer <key>.`
    });
  }

  if (!controlWriteKeyMatches(expectedKey, providedKey)) {
    return res.status(403).json({
      error: 'Invalid protected write key.'
    });
  }

  return next();
}

app.use(requireProtectedControlWriteKey);

const SENSITIVE_READ_ROUTE_PATTERNS = [
  /^\/(?:public\/)?media-manager\/projects\/?$/i,
  /^\/(?:public\/)?media-manager\/asset-catalog\/?$/i,
  /^\/(?:public\/)?media-manager\/project\//i,
  /^\/(?:public\/)?media-manager\/storage\//i,
  /^\/(?:public\/)?api\//i,
  /^\/media\/(?:tree|registry|file)\//i,
  /^\/generated-output\//i,
  /^\/today\/?$/i,
  /^\/next\/?$/i,
  /^\/products\/?$/i,
  /^\/optimize-product\//i,
  /^\/prepare-product-update\//i
];

function isProtectedControlReadRequest(req) {
  const method = String(req.method || '').trim().toUpperCase();
  if (method !== 'GET') {
    return false;
  }

  const requestPath = String(req.path || '').trim();
  return SENSITIVE_READ_ROUTE_PATTERNS.some((pattern) => pattern.test(requestPath));
}

function requireProtectedReadKey(req, res, next) {
  if (!isProtectedControlReadRequest(req)) {
    return next();
  }

  if (CONTROL_CENTER_ACCESS_KEY_BYPASS_ENABLED) {
    res.set(CONTROL_CENTER_KEY_BYPASS_HEADER, CONTROL_CENTER_KEY_BYPASS_HEADER_VALUE);
    return next();
  }

  const expectedKey = String(process.env[CONTROL_WRITE_KEY_ENV] || '').trim();
  if (!expectedKey) {
    return res.status(503).json({
      error: `Protected read routes are disabled until ${CONTROL_WRITE_KEY_ENV} is configured on the server.`
    });
  }

  const providedKey = readProvidedControlWriteKey(req);
  if (!providedKey) {
    return res.status(401).json({
      error: `Missing read key. Provide ${CONTROL_WRITE_KEY_HEADER} or Authorization: Bearer <key>.`
    });
  }

  if (!controlWriteKeyMatches(expectedKey, providedKey)) {
    return res.status(403).json({
      error: 'Invalid read key.'
    });
  }

  return next();
}

app.use(requireProtectedReadKey);

const telegramRateLimiter = createInMemoryRateLimiter({
  windowMs: 60 * 1000,
  max: 40
});
const aiRateLimiter = createInMemoryRateLimiter({
  windowMs: 60 * 1000,
  max: 120
});

function getRateLimitIdentity(req) {
  const forwarded = String(req.get('x-forwarded-for') || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)[0] || '';
  return forwarded || String(req.ip || req.socket?.remoteAddress || 'anonymous');
}

function shouldApplyAiRateLimit(req) {
  const requestPath = String(req.path || '').trim();
  if (!requestPath) {
    return false;
  }

  return /\/ai(?:\/|$)/i.test(requestPath);
}

function applyRouteRateLimit(req, res, next) {
  const requestPath = String(req.path || '').trim();
  let limiter = null;
  let action = '';

  if (/^\/telegram-command\/?$/i.test(requestPath)) {
    limiter = telegramRateLimiter;
    action = 'telegram_command';
  } else if (shouldApplyAiRateLimit(req)) {
    limiter = aiRateLimiter;
    action = 'ai_endpoint';
  }

  if (!limiter) {
    return next();
  }

  const identity = getRateLimitIdentity(req);
  const decision = limiter.check(identity);

  if (decision.allowed) {
    return next();
  }

  appLogger.warn('rate_limit_exceeded', {
    route: requestPath,
    action,
    method: req.method,
    retryAfterMs: decision.retryAfterMs
  });

  res.set('Retry-After', String(Math.ceil(decision.retryAfterMs / 1000)));
  return sendError(res, {
    statusCode: 429,
    code: 'RATE_LIMITED',
    message: 'Too many requests. Please retry shortly.'
  });
}

app.use(applyRouteRateLimit);

const unifiedDataPathResolver = new UnifiedDataPathResolver({ logger: runtimeCompatLogger });
const executionArtifactWriter = new ExecutionArtifactWriterAdapter({
  resolver: unifiedDataPathResolver,
  logger: runtimeCompatLogger
});

let aiOrchestrator = null;
const mediaProviderLayer = createMediaProviderLayer({
  env: process.env,
  axios
});

function resolveMediaProjectName(req) {
  return normalizeOptionalProjectSlug(
    req?.body?.project || req?.query?.project || req?.params?.project
  );
}

function maybePersistMediaGenerationResult(req, {
  requestType,
  output,
  status = 'needs_review'
} = {}) {
  const projectName = resolveMediaProjectName(req);
  if (!projectName) return null;

  const mediaJobId = asString(req?.body?.media_job_id || req?.body?.id || '');
  const prompt = asString(req?.body?.prompt || '');
  const now = new Date().toISOString();

  const outputLabel = `${requestType} ${now.slice(0, 19).replace('T', ' ')}`;
  const outputSummary = typeof output === 'string'
    ? output
    : JSON.stringify(output || {});

  try {
    const mediaJob = upsertMediaJob(projectName, {
      id: mediaJobId || undefined,
      title: asString(req?.body?.title || `${requestType} media job`),
      request_type: requestType,
      prompt,
      brief: asString(req?.body?.objective || req?.body?.brief || ''),
      status,
      provider: asString(req?.body?.provider || req?.body?.media_provider || ''),
      model: asString(req?.body?.model || req?.body?.media_model || ''),
      campaign_id: asString(req?.body?.campaign || req?.body?.campaign_id || ''),
      content_item_id: asString(req?.body?.content_item_id || ''),
      output_versions: req?.body?.output_versions,
      new_output_version: {
        label: outputLabel,
        preview_url: asString(output?.images?.[0]?.url || output?.image_url || ''),
        file_path: asString(output?.images?.[0]?.file_path || ''),
        outputs: [
          {
            label: outputLabel,
            summary: outputSummary
          }
        ],
        actor: 'media-api'
      },
      outputs: [
        {
          label: outputLabel,
          summary: outputSummary,
          created_at: now
        }
      ],
      actor: 'media-api'
    });

    return {
      media_job: mediaJob,
      operations: buildProjectOperationsPayload(projectName)
    };
  } catch (error) {
    return null;
  }
}

function buildAssetRoleFromType(type) {
  const map = {
    product: 'product_source',
    packaging: 'packaging_source',
    reference: 'reference_source',
    video: 'video_source'
  };

  return map[String(type || '').trim().toLowerCase()] || null;
}

function resolveUploadTarget(projectName, type) {
  const project = normalizeProjectSlug(projectName);
  const normalizedType = String(type || '').trim().toLowerCase();
  const basePaths = getProjectBasePaths(project);
  if (!fs.existsSync(basePaths.projectFilePath)) {
    throw new Error('Project not found');
  }

  const canonicalType = getCanonicalAssetType(normalizedType);

  if (canonicalType) {
    const { catalog_item, target_dir } = getTargetFolderForAssetType(project, canonicalType);

    return {
      mode: 'project_catalog',
      assetType: canonicalType,
      requestedAssetType: normalizedType,
      target_folder: catalog_item.target_folder,
      catalog_item,
      dir: target_dir
    };
  }

  const legacyRole = buildAssetRoleFromType(normalizedType);

  if (legacyRole) {
    const paths = getProjectBrandPaths(project);
    return {
      mode: 'legacy_media',
      assetRole: legacyRole,
      target_folder: path.basename(getAssetDirByRole(paths, legacyRole)),
      dir: getAssetDirByRole(paths, legacyRole)
    };
  }

  throw new Error('Unknown asset type');
}

function resolveMediaFilePath(projectName, type, filename) {
  const project = normalizeProjectSlug(projectName);
  const normalizedType = String(type || '').trim().toLowerCase();
  const safeFilename = path.basename(String(filename || '').trim());
  const uploadTarget = resolveUploadTarget(project, normalizedType);
  return path.join(uploadTarget.dir, safeFilename);
}

function isPathInsideRoot(rootPath, targetPath) {
  const absoluteRoot = path.resolve(String(rootPath || ''));
  const absoluteTarget = path.resolve(String(targetPath || ''));
  const relative = path.relative(absoluteRoot, absoluteTarget);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function decodeMediaQueryPath(value) {
  const raw = String(value || '').replace(/\0/g, '').trim();
  if (!raw) {
    return '';
  }

  try {
    return decodeURIComponent(raw);
  } catch (_) {
    return raw;
  }
}

function getAllowedMediaRoots(projectName) {
  const project = normalizeProjectSlug(projectName);
  const basePaths = getProjectBasePaths(project);
  const brandPaths = getProjectBrandPaths(project);
  const roots = [
    basePaths.baseDir,
    basePaths.brandAssetsDir,
    basePaths.productsDir,
    basePaths.mediaDir,
    brandPaths.baseDir,
    brandPaths.legacyBaseDir,
    path.join(LEGACY_BRAND_ASSETS_DIR, project)
  ]
    .filter(Boolean)
    .map((entry) => path.resolve(entry));

  return [...new Set(roots)];
}

function findProjectAssetFilePathById(projectName, assetId) {
  const project = normalizeProjectSlug(projectName);
  const requestedId = String(assetId || '').trim();

  if (!requestedId) {
    return null;
  }

  try {
    const assetPaths = getProjectAssetPaths(project);
    const assets = readJsonFile(assetPaths.assetsRegistryPath, []);
    const match = assets.find((asset) => {
      const candidate = String(asset?.asset_id || asset?.assetId || asset?.id || '').trim();
      return candidate && candidate === requestedId;
    });

    const candidatePath = String(
      match?.file_path ||
      match?.local_path ||
      match?.path ||
      ''
    ).trim();

    return candidatePath || null;
  } catch (_) {
    return null;
  }
}

function resolveMediaFilePathFromQuery(projectName, requestedPath, assetId) {
  const project = normalizeProjectSlug(projectName);
  const decodedPath = decodeMediaQueryPath(requestedPath);
  const decodedAssetId = decodeMediaQueryPath(assetId);
  const allowedRoots = getAllowedMediaRoots(project);

  const resolveCandidate = (candidatePath) => {
    const candidate = path.resolve(String(candidatePath || ''));
    if (!candidate || !fs.existsSync(candidate)) {
      return null;
    }

    const allowed = allowedRoots.some((root) => isPathInsideRoot(root, candidate));
    if (!allowed) {
      return null;
    }

    try {
      const stat = fs.statSync(candidate);
      if (!stat.isFile()) {
        return null;
      }
    } catch (_) {
      return null;
    }

    return candidate;
  };

  if (decodedPath) {
    const normalizedRelative = decodedPath.replace(/^[/\\]+/, '');
    const candidates = [];

    if (path.isAbsolute(decodedPath)) {
      candidates.push(decodedPath);
    }

    allowedRoots.forEach((root) => {
      candidates.push(path.join(root, normalizedRelative));
    });

    for (const candidate of candidates) {
      const resolved = resolveCandidate(candidate);
      if (resolved) {
        return {
          filePath: resolved,
          source: 'query_path'
        };
      }
    }

    return {
      filePath: null,
      source: 'query_path',
      invalidPath: true
    };
  }

  if (decodedAssetId) {
    const byAssetId = findProjectAssetFilePathById(project, decodedAssetId);
    const resolved = resolveCandidate(byAssetId);
    if (resolved) {
      return {
        filePath: resolved,
        source: 'query_asset_id'
      };
    }
  }

  return {
    filePath: null,
    source: decodedAssetId ? 'query_asset_id' : null
  };
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      try {
        const project = normalizeProjectSlug(req.body.project);
        const type = String(req.body.type || '').trim().toLowerCase();

        if (!project || !type) {
          return cb(new Error('Missing project or type'));
        }

        const uploadTarget = resolveUploadTarget(project, type);
        const dir = uploadTarget.dir;
        ensureDir(dir);

        cb(null, dir);
      } catch (err) {
        cb(err);
      }
    },
    filename: (req, file, cb) => {
      const safeName = Date.now() + '_' + file.originalname.replace(/\s+/g, '_');
      cb(null, safeName);
    }
  }),
  limits: {
    fileSize: 1024 * 1024 * 50 // 50MB
  }
});


const BASE_DIR = process.env.MH_ASSISTANT_ROOT || path.resolve(__dirname, '../..');
const CONTEXTS_DIR = path.join(BASE_DIR, 'contexts');
const PROMPTS_DIR = path.join(BASE_DIR, 'prompts');
const DATA_DIR = path.join(BASE_DIR, 'data');
const CONTROL_CENTER_PUBLIC_DIR = path.join(BASE_DIR, 'public', 'control-center');
const LEGACY_BRAND_ASSETS_DIR = path.join(DATA_DIR, 'brand-assets');
const EXECUTION_DIR = path.join(DATA_DIR, 'execution');
const DEFAULT_PROJECT_ENV = 'MH_DEFAULT_PROJECT';
const EMAIL_ARTIFACT_TYPES = Object.freeze({
  PREPARE_PACKAGE: 'email_prepare_package',
  PREPARED_HTML: 'email_prepared_html',
  PREPARED_PACKAGE: 'email_prepared_package',
  DELIVERY_RECORD: 'email_delivery_record',
  DRAFT_QUEUE: 'email_draft_queue',
  MEDIA_QUEUE: 'email_media_queue'
});
const EXECUTION_BRIDGE_STATES = Object.freeze([
  'draft',
  'ready_for_review',
  'manual_publish_ready',
  'pending_execution',
  'executed',
  'failed'
]);

const PORT = process.env.PORT || 3000;

function sanitizeErrorMessage(rawMessage, fallbackMessage) {
  const fallback = String(fallbackMessage || 'Request failed').trim() || 'Request failed';
  const value = String(rawMessage || '').replace(/[\r\n\t]+/g, ' ').trim();
  if (!value) {
    return fallback;
  }
  return value.length > 300 ? `${value.slice(0, 297)}...` : value;
}

function getErrorStatusCode(error, fallbackStatus = 500) {
  const statusCandidate = Number(
    error?.statusCode || error?.status || error?.response?.status || fallbackStatus
  );

  if (!Number.isFinite(statusCandidate)) {
    return fallbackStatus;
  }

  if (statusCandidate < 400 || statusCandidate > 599) {
    return fallbackStatus;
  }

  return statusCandidate;
}

function sendError(res, {
  statusCode = 500,
  code = 'INTERNAL_ERROR',
  message = 'Request failed'
} = {}) {
  return res.status(statusCode).json({
    ok: false,
    error: {
      code: String(code || 'INTERNAL_ERROR').trim() || 'INTERNAL_ERROR',
      message: sanitizeErrorMessage(message, 'Request failed')
    }
  });
}

function sendInvalidProjectSlug(res) {
  return sendError(res, {
    statusCode: 400,
    code: 'INVALID_PROJECT_SLUG',
    message: 'Invalid project slug'
  });
}

const PROJECT_SLUG_RAW_PATH_PATTERNS = [
  /^\/(?:public\/)?media-manager\/project\/([^/?#]+)/i,
  /^\/(?:public\/)?api\/(?:insights|learning)\/([^/?#]+)/i,
  /^\/media\/(?:tree|registry)\/([^/?#]+)/i,
  /^\/media\/file\/([^/?#]+)/i,
  /^\/generated-output\/([^/?#]+)/i
];

function getRequestRawPath(req) {
  const rawPath = String(req.originalUrl || req.url || '').split('?')[0];
  return rawPath || '/';
}

function extractRawProjectSlug(rawPath) {
  for (const pattern of PROJECT_SLUG_RAW_PATH_PATTERNS) {
    const match = rawPath.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

function validateRawProjectSlugPathSegment(req, res, next) {
  try {
    const rawPath = getRequestRawPath(req);
    const rawProject = extractRawProjectSlug(rawPath);

    if (!rawProject) {
      return next();
    }

    normalizeProjectSlug(rawProject);
    return next();
  } catch (error) {
    if (isProjectSlugValidationError(error)) {
      return sendInvalidProjectSlug(res);
    }

    return next(error);
  }
}

app.use(validateRawProjectSlugPathSegment);

app.param('project', (req, res, next, projectValue) => {
  try {
    req.params.project = normalizeProjectSlug(projectValue);
    return next();
  } catch (error) {
    if (isProjectSlugValidationError(error)) {
      return sendInvalidProjectSlug(res);
    }
    return next(error);
  }
});

function validateOptionalProjectSlugFields(req, res, next) {
  try {
    if (req.body && Object.prototype.hasOwnProperty.call(req.body, 'project')) {
      req.body.project = normalizeProjectSlug(req.body.project);
    }

    if (req.query && Object.prototype.hasOwnProperty.call(req.query, 'project')) {
      req.query.project = normalizeProjectSlug(req.query.project);
    }

    return next();
  } catch (error) {
    if (isProjectSlugValidationError(error)) {
      return sendInvalidProjectSlug(res);
    }
    return next(error);
  }
}

app.use(validateOptionalProjectSlugFields);

function sanitizeErrorPayloadForClient(payload) {
  if (payload == null) {
    return null;
  }

  if (typeof payload === 'string') {
    return sanitizeErrorMessage(payload, 'Request failed');
  }

  return sanitizeValue(payload);
}

function logCriticalFailure(action, req, error, context = {}) {
  appLogger.error('critical_failure', {
    route: req?.path || 'unknown',
    action,
    method: req?.method || 'unknown',
    statusCode: getErrorStatusCode(error, 500),
    ...sanitizeValue(context),
    error: serializeErrorForLog(error)
  });
}

function isDataDirectoryWritable() {
  if (!fs.existsSync(DATA_DIR)) {
    return false;
  }

  try {
    fs.accessSync(DATA_DIR, fs.constants.W_OK);
    return true;
  } catch (error) {
    return false;
  }
}

function detectIntegrationSecretUsage(projects = []) {
  for (const project of projects) {
    const projectName = String(project?.project_name || project?.project_id || '').trim().toLowerCase();
    if (!projectName) {
      continue;
    }

    try {
      const paths = getProjectIntegrationPaths(projectName);
      const registry = readJsonFile(paths.controlCenterRegistryPath, {});
      const records = registry && typeof registry.records === 'object'
        ? Object.values(registry.records)
        : [];

      const hasCredentials = records.some((record) => {
        if (!record || typeof record !== 'object') {
          return false;
        }

        const encrypted = record.credentials_encrypted
          && typeof record.credentials_encrypted === 'object'
          && Object.keys(record.credentials_encrypted).length > 0;
        const plain = record.credentials
          && typeof record.credentials === 'object'
          && Object.keys(record.credentials).length > 0;
        return encrypted || plain;
      });

      if (hasCredentials) {
        return true;
      }
    } catch (error) {
      continue;
    }
  }

  return false;
}

function buildReadinessState() {
  const configuredWriteKey = String(process.env[CONTROL_WRITE_KEY_ENV] || '').trim();
  const checks = {
    control_write_key_configured: {
      ok: Boolean(configuredWriteKey),
      required: true
    },
    data_dir_exists: {
      ok: fs.existsSync(DATA_DIR),
      required: true,
      path: DATA_DIR
    },
    data_dir_writable: {
      ok: isDataDirectoryWritable(),
      required: true,
      path: DATA_DIR
    },
    project_registry_load: {
      ok: false,
      required: true,
      total_projects: 0
    }
  };

  let registryProjects = [];
  try {
    registryProjects = listProjects();
    checks.project_registry_load.ok = Array.isArray(registryProjects);
    checks.project_registry_load.total_projects = Array.isArray(registryProjects) ? registryProjects.length : 0;
  } catch (error) {
    checks.project_registry_load.error = sanitizeErrorMessage(error.message, 'Failed to load project registry');
  }

  const integrationSecretRequired = checks.project_registry_load.ok
    ? detectIntegrationSecretUsage(registryProjects)
    : false;
  checks.integration_secret_key = {
    ok: !integrationSecretRequired || hasIntegrationSecretKeyConfigured(),
    required: integrationSecretRequired,
    env: 'MH_INTEGRATION_SECRET_KEY',
    file: path.join(DATA_DIR, 'system', 'integration-secret.key.json')
  };

  const missingRequiredEnv = [];
  if (!checks.control_write_key_configured.ok) {
    missingRequiredEnv.push(CONTROL_WRITE_KEY_ENV);
  }

  if (checks.integration_secret_key.required && !checks.integration_secret_key.ok) {
    missingRequiredEnv.push('MH_INTEGRATION_SECRET_KEY');
  }

  const ready = Object.values(checks).every((check) => !check.required || check.ok);

  return {
    service: 'orchestrator-service',
    ready,
    checks,
    protected_write_mode: {
      enabled: true,
      required_key_env: CONTROL_WRITE_KEY_ENV,
      key_configured: Boolean(configuredWriteKey)
    },
    missing_required_env: missingRequiredEnv
  };
}

const EXECUTION_READ_DOMAIN_BASES = {
  generated: {
    legacy: 'generated',
    canonical: 'generated'
  },
  publishing: {
    legacy: 'launch-ops',
    canonical: 'publishing'
  },
  email: {
    legacy: '',
    canonical: ''
  },
  channels: {
    legacy: 'channels',
    canonical: 'channels'
  },
  'campaign-execution': {
    legacy: 'campaign-execution',
    canonical: 'campaign-execution'
  },
  'campaign-finalization': {
    legacy: 'campaign-finalization',
    canonical: 'campaign-finalization'
  },
  'execution-config': {
    legacy: 'execution',
    canonical: 'execution'
  },
  'german-launch': {
    legacy: 'german-launch',
    canonical: 'german-launch'
  },
  optimization: {
    legacy: 'optimization',
    canonical: 'optimization'
  },
  'execution-results': {
    legacy: 'execution/results',
    canonical: 'publishing/results'
  }
};

function classifyImmediateFallbackReason(telemetryEntry = {}) {
  if (telemetryEntry.selected_root !== 'legacy') {
    return null;
  }

  if (telemetryEntry.canonical_hit) {
    return 'policy_or_config_mismatch';
  }

  if (telemetryEntry.legacy_fallback_hit) {
    return 'canonical_miss';
  }

  return 'artifact_missing';
}

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    return '';
  }
}

function hasMatchingEntries(dirPath, matcher) {
  if (!fs.existsSync(dirPath)) {
    return false;
  }

  if (!matcher) {
    return true;
  }

  try {
    const entries = fs.readdirSync(dirPath);
    return entries.some((name) => matcher.test(name));
  } catch (error) {
    return false;
  }
}

function writeReadRedirectionTelemetry(resolution, entry) {
  if (String(process.env.MH_DISABLE_READ_TELEMETRY || '').trim() === '1') {
    return;
  }

  try {
    const telemetryDir = path.join(resolution.executionRoot, 'telemetry');
    ensureDir(telemetryDir);
    const logPath = path.join(telemetryDir, 'read-redirection-log.jsonl');
    fs.appendFileSync(logPath, `${JSON.stringify(entry)}\n`, 'utf8');
  } catch (error) {
    appLogger.error('read_redirection_telemetry_write_failed', {
      route: '/telemetry/read-redirection',
      action: 'write_read_redirection_telemetry',
      project: entry.project,
      domain: entry.domain,
      error: serializeErrorForLog(error)
    });
  }
}

function buildCandidatePaths(canonicalBase, legacyBase, relativePath = '') {
  const safeRelativePath = String(relativePath || '').replace(/^\/+/, '');

  return {
    canonicalPath: safeRelativePath ? path.join(canonicalBase, safeRelativePath) : canonicalBase,
    legacyPath: safeRelativePath ? path.join(legacyBase, safeRelativePath) : legacyBase
  };
}

function resolveReadCandidateFromBases(options = {}) {
  const projectName = String(options.projectName || '').trim().toLowerCase();
  const domain = String(options.domain || '').trim().toLowerCase();
  const artifactType = String(options.artifactType || '').trim() || null;
  const relativePath = String(options.relativePath || '').replace(/^\/+/, '');
  const pathType = options.pathType === 'directory' ? 'directory' : 'file';
  const requestedIdentifier = String(options.requestedIdentifier || '').trim() || null;
  const requestedFile = String(options.requestedFile || relativePath || '').trim() || null;
  const pathContract = String(options.pathContract || '').trim() || null;
  const matcher = options.matcher instanceof RegExp ? options.matcher : null;
  const resolution = options.resolution || unifiedDataPathResolver.resolve(projectName, {
    domain,
    operation: 'read'
  });
  const readPolicy = options.readPolicy || unifiedDataPathResolver.getDomainReadPolicy(domain);
  const candidatePaths = buildCandidatePaths(options.canonicalBase, options.legacyBase, relativePath);

  const canonicalHit =
    pathType === 'directory'
      ? hasMatchingEntries(candidatePaths.canonicalPath, matcher)
      : fs.existsSync(candidatePaths.canonicalPath);
  const legacyHit =
    pathType === 'directory'
      ? hasMatchingEntries(candidatePaths.legacyPath, matcher)
      : fs.existsSync(candidatePaths.legacyPath);

  const canonicalFirstEnabled = !!readPolicy.effectiveCanonicalFirst;
  const legacyFallbackEnabled = !!readPolicy.legacyFallbackRead;

  let selectedPath = candidatePaths.legacyPath;
  let selectedRoot = 'legacy';

  if (canonicalFirstEnabled) {
    if (canonicalHit) {
      selectedPath = candidatePaths.canonicalPath;
      selectedRoot = 'canonical';
    } else if (legacyFallbackEnabled && legacyHit) {
      selectedPath = candidatePaths.legacyPath;
      selectedRoot = 'legacy';
    } else if (legacyHit) {
      selectedPath = candidatePaths.legacyPath;
      selectedRoot = 'legacy';
    } else {
      selectedPath = candidatePaths.canonicalPath;
      selectedRoot = 'canonical';
    }
  } else if (legacyHit) {
    selectedPath = candidatePaths.legacyPath;
    selectedRoot = 'legacy';
  } else if (canonicalHit) {
    selectedPath = candidatePaths.canonicalPath;
    selectedRoot = 'canonical';
  }

  const telemetryEntry = {
    timestamp: new Date().toISOString(),
    schema_version: 'phase3-read-redirection-v1',
    project: projectName,
    domain,
    artifact_type: artifactType,
    requested_identifier: requestedIdentifier,
    requested_file: requestedFile,
    path_contract: pathContract,
    canonical_candidate: candidatePaths.canonicalPath,
    legacy_candidate: candidatePaths.legacyPath,
    canonical_hit: canonicalHit,
    legacy_fallback_hit: legacyHit,
    selected_path: selectedPath,
    selected_root: selectedRoot,
    active_flag_state: {
      execution_canonical_read: !!readPolicy.executionCanonicalReadMaster,
      domain_flag_name: readPolicy.flagName,
      domain_canonical_first: !!readPolicy.domainCanonicalFirst,
      effective_canonical_first: !!readPolicy.effectiveCanonicalFirst,
      legacy_fallback_read: !!readPolicy.legacyFallbackRead
    }
  };

  telemetryEntry.fallback_reason = classifyImmediateFallbackReason(telemetryEntry);

  writeReadRedirectionTelemetry(resolution, telemetryEntry);

  appLogger.info('read_redirection_resolved', {
    route: '/telemetry/read-redirection',
    action: 'resolve_read_candidate',
    project: projectName,
    domain,
    artifactType: artifactType || 'n/a',
    requestedIdentifier: requestedIdentifier || 'n/a',
    requestedFile: requestedFile || 'n/a',
    canonicalHit,
    legacyHit,
    selectedRoot
  });

  return {
    selectedPath,
    canonicalPath: candidatePaths.canonicalPath,
    legacyPath: candidatePaths.legacyPath,
    canonicalHit,
    legacyHit,
    selectedRoot,
    policy: readPolicy
  };
}

function resolveExecutionReadCandidate(options = {}) {
  const projectName = String(options.projectName || '').trim().toLowerCase();
  const domain = String(options.domain || '').trim().toLowerCase();
  const relativePath = String(options.relativePath || '').replace(/^\/+/, '');
  const pathType = options.pathType === 'directory' ? 'directory' : 'file';
  const requestedIdentifier = String(options.requestedIdentifier || '').trim() || null;
  const requestedFile = String(options.requestedFile || relativePath || '').trim() || null;
  const pathContract = String(options.pathContract || '').trim() || null;
  const matcher = options.matcher instanceof RegExp ? options.matcher : null;

  const resolution = unifiedDataPathResolver.resolve(projectName, {
    domain,
    operation: 'read'
  });

  const domainConfig = EXECUTION_READ_DOMAIN_BASES[domain];
  const canonicalBaseOverride = options.canonicalBaseOverride || null;
  const legacyBaseOverride = options.legacyBaseOverride || null;

  if (!domainConfig && !canonicalBaseOverride && !legacyBaseOverride) {
    const passthroughPath = path.join(resolution.activeReadPath, relativePath);
    return {
      selectedPath: passthroughPath,
      canonicalPath: passthroughPath,
      legacyPath: passthroughPath,
      canonicalHit: fs.existsSync(passthroughPath),
      legacyHit: fs.existsSync(passthroughPath),
      selectedRoot: 'active',
      policy: {
        domain,
        flagName: null,
        domainCanonicalFirst: false,
        executionCanonicalReadMaster: !!resolution.featureFlags.execution_canonical_read,
        legacyFallbackRead: !!resolution.featureFlags.legacy_fallback_read,
        effectiveCanonicalFirst: false
      }
    };
  }

  const canonicalBase = canonicalBaseOverride || (domainConfig.canonical
    ? path.join(resolution.executionRoot, domainConfig.canonical)
    : resolution.executionRoot);
  const legacyBase = legacyBaseOverride || (domainConfig.legacy
    ? path.join(resolution.legacyRoot, domainConfig.legacy)
    : resolution.legacyRoot);

  return resolveReadCandidateFromBases({
    projectName,
    domain,
    artifactType: options.artifactType,
    relativePath,
    pathType,
    requestedIdentifier,
    requestedFile,
    pathContract,
    matcher,
    resolution,
    readPolicy: unifiedDataPathResolver.getDomainReadPolicy(domain),
    canonicalBase,
    legacyBase
  });
}

function getEmailDomainPaths(projectName) {
  const safeProject = String(projectName || '').trim().toLowerCase();
  const resolution = unifiedDataPathResolver.resolve(safeProject, {
    domain: 'email',
    operation: 'read'
  });

  return {
    project: safeProject,
    resolution,
    canonicalWriteRoot: resolution.executionRoot,
    legacyMirrorRoot: resolution.legacyRoot,
    canonicalReadRoot: resolution.executionRoot,
    fallbackRoot: resolution.legacyRoot,
    canonicalEmailDir: path.join(resolution.executionRoot, 'email'),
    legacyEmailDir: path.join(resolution.legacyRoot, 'email'),
    canonicalLiveContentDir: path.join(EXECUTION_DIR, 'projects', safeProject, 'content', 'email'),
    legacyLiveContentDir: path.join(EXECUTION_DIR, safeProject, 'content', 'email'),
    canonicalLiveMediaQueueDir: path.join(EXECUTION_DIR, 'projects', safeProject, 'media', 'queue'),
    legacyLiveMediaQueueDir: path.join(EXECUTION_DIR, safeProject, 'media', 'queue')
  };
}

function getEmailArtifactContract(projectName, artifactType) {
  const paths = getEmailDomainPaths(projectName);

  const contracts = {
    [EMAIL_ARTIFACT_TYPES.PREPARE_PACKAGE]: {
      canonicalBase: paths.canonicalReadRoot,
      legacyBase: paths.fallbackRoot,
      relativePath: 'email-prepare-package.json',
      pathType: 'file',
      requestedFile: 'email-prepare-package.json',
      pathContract: 'execution/projects/<project>/email-prepare-package.json -> brand-assets/<project>/email-prepare-package.json'
    },
    [EMAIL_ARTIFACT_TYPES.PREPARED_HTML]: {
      canonicalBase: paths.canonicalEmailDir,
      legacyBase: paths.legacyEmailDir,
      relativePath: 'html',
      pathType: 'directory',
      requestedFile: 'email/html/*.html',
      pathContract: 'execution/projects/<project>/email/html/<package>.html -> brand-assets/<project>/email/html/<package>.html'
    },
    [EMAIL_ARTIFACT_TYPES.PREPARED_PACKAGE]: {
      canonicalBase: paths.canonicalEmailDir,
      legacyBase: paths.legacyEmailDir,
      relativePath: 'prepared',
      pathType: 'directory',
      requestedFile: 'email/prepared/*.json',
      pathContract: 'execution/projects/<project>/email/prepared/<package>.json -> brand-assets/<project>/email/prepared/<package>.json'
    },
    [EMAIL_ARTIFACT_TYPES.DELIVERY_RECORD]: {
      canonicalBase: paths.canonicalEmailDir,
      legacyBase: paths.legacyEmailDir,
      relativePath: 'delivery',
      pathType: 'directory',
      requestedFile: 'email/delivery/*.json',
      pathContract: 'execution/projects/<project>/email/delivery/<send>.json -> brand-assets/<project>/email/delivery/<send>.json'
    },
    [EMAIL_ARTIFACT_TYPES.DRAFT_QUEUE]: {
      canonicalBase: paths.canonicalLiveContentDir,
      legacyBase: paths.legacyLiveContentDir,
      relativePath: 'email-queue.json',
      pathType: 'file',
      requestedFile: 'content/email/email-queue.json',
      pathContract: 'execution/projects/<project>/content/email/email-queue.json -> execution/<project>/content/email/email-queue.json'
    },
    [EMAIL_ARTIFACT_TYPES.MEDIA_QUEUE]: {
      canonicalBase: paths.canonicalLiveMediaQueueDir,
      legacyBase: paths.legacyLiveMediaQueueDir,
      relativePath: 'email-image-queue.json',
      pathType: 'file',
      requestedFile: 'media/queue/email-image-queue.json',
      pathContract: 'execution/projects/<project>/media/queue/email-image-queue.json -> execution/<project>/media/queue/email-image-queue.json'
    }
  };

  const contract = contracts[artifactType];

  if (!contract) {
    throw new Error(`Unsupported email artifact contract: ${artifactType}`);
  }

  return {
    ...contract,
    project: paths.project,
    resolution: paths.resolution,
    roots: paths
  };
}

function resolveEmailReadCandidate(options = {}) {
  const safeProject = String(options.projectName || '').trim().toLowerCase();
  const artifactType = String(options.artifactType || '').trim();
  const contract = getEmailArtifactContract(safeProject, artifactType);
  const relativePath = options.relativePath == null
    ? contract.relativePath
    : String(options.relativePath || '').replace(/^\/+/, '');

  return resolveExecutionReadCandidate({
    projectName: safeProject,
    domain: 'email',
    artifactType,
    relativePath,
    pathType: options.pathType || contract.pathType,
    matcher: options.matcher instanceof RegExp ? options.matcher : null,
    requestedIdentifier: options.requestedIdentifier || safeProject,
    requestedFile: options.requestedFile || contract.requestedFile,
    pathContract: contract.pathContract,
    canonicalBaseOverride: contract.canonicalBase,
    legacyBaseOverride: contract.legacyBase
  });
}

function readEmailArtifactArray(projectName, artifactType, requestedIdentifier) {
  const candidate = resolveEmailReadCandidate({
    projectName,
    artifactType,
    requestedIdentifier
  });

  return {
    candidate,
    data: readJsonFile(candidate.selectedPath, [])
  };
}

function writeEmailArtifactArray(projectName, artifactType, data) {
  const contract = getEmailArtifactContract(projectName, artifactType);
  const candidatePaths = buildCandidatePaths(
    contract.canonicalBase,
    contract.legacyBase,
    contract.relativePath
  );
  const payload = JSON.stringify(Array.isArray(data) ? data : [], null, 2);

  ensureDir(path.dirname(candidatePaths.canonicalPath));
  ensureDir(path.dirname(candidatePaths.legacyPath));
  fs.writeFileSync(candidatePaths.canonicalPath, payload, 'utf8');
  fs.writeFileSync(candidatePaths.legacyPath, payload, 'utf8');

  return candidatePaths;
}

function requireQueueProjectName(projectName) {
  const safeProject = normalizeOptionalProjectSlug(projectName) || getPreferredProjectName();
  if (!safeProject) {
    throw Object.assign(new Error(`Missing project context. Set ${DEFAULT_PROJECT_ENV} or pass project explicitly.`), {
      statusCode: 400,
      code: 'PROJECT_CONTEXT_MISSING'
    });
  }
  return safeProject;
}

function readLiveEmailQueue(projectName, requestedIdentifier = 'email-draft-queue') {
  return readEmailArtifactArray(requireQueueProjectName(projectName), EMAIL_ARTIFACT_TYPES.DRAFT_QUEUE, requestedIdentifier);
}

function writeLiveEmailQueue(projectName, queue = []) {
  return writeEmailArtifactArray(requireQueueProjectName(projectName), EMAIL_ARTIFACT_TYPES.DRAFT_QUEUE, queue);
}

function readLiveEmailMediaQueue(projectName, requestedIdentifier = 'email-media-queue') {
  return readEmailArtifactArray(requireQueueProjectName(projectName), EMAIL_ARTIFACT_TYPES.MEDIA_QUEUE, requestedIdentifier);
}

function writeLiveEmailMediaQueue(projectName, queue = []) {
  return writeEmailArtifactArray(requireQueueProjectName(projectName), EMAIL_ARTIFACT_TYPES.MEDIA_QUEUE, queue);
}

function getLegacyExecutionRoot(projectName) {
  return resolveProjectPath(EXECUTION_DIR, requireQueueProjectName(projectName)).projectRoot;
}

function getLegacyContentQueuePath(projectName, queueType) {
  const queueMap = {
    ads: path.join('content', 'ads', 'ad-queue.json'),
    social: path.join('content', 'social', 'post-queue.json'),
    blog: path.join('content', 'blog', 'blog-queue.json'),
    reel: path.join('content', 'campaigns', 'reel-brief-queue.json'),
    tasks: path.join('tasks', 'task-board.json')
  };
  const relativePath = queueMap[queueType];

  if (!relativePath) {
    throw new Error(`Unknown content queue type: ${queueType}`);
  }

  const queuePath = path.join(getLegacyExecutionRoot(projectName), relativePath);
  ensureJsonFile(queuePath, []);
  return queuePath;
}

function readLegacyContentQueue(projectName, queueType) {
  return readJsonFile(getLegacyContentQueuePath(projectName, queueType), []);
}

function writeLegacyContentQueue(projectName, queueType, queue = []) {
  writeJsonFile(getLegacyContentQueuePath(projectName, queueType), Array.isArray(queue) ? queue : []);
}

function getProjectBackupDir(projectName) {
  const backupDir = path.join(getLegacyExecutionRoot(projectName), 'assets', 'backups');
  ensureDir(backupDir);
  return backupDir;
}

function getProjectMediaDir(projectName) {
  const mediaDir = path.join(getLegacyExecutionRoot(projectName), 'media');
  ensureDir(mediaDir);
  return mediaDir;
}

function getProjectBlogImageQueuePath(projectName) {
  const queuePath = path.join(getProjectMediaDir(projectName), 'queue', 'blog-image-queue.json');
  ensureJsonFile(queuePath, []);
  return queuePath;
}

const PHASE375_TARGET_DOMAINS = new Set([
  'email',
  'generated',
  'publishing',
  'campaign-execution',
  'campaign-finalization',
  'execution-results'
]);

function readJsonLines(filePath) {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const raw = readFileSafe(filePath);
  if (!raw.trim()) {
    return [];
  }

  const lines = raw.split('\n').map((line) => line.trim()).filter(Boolean);
  const parsed = [];

  for (const line of lines) {
    try {
      parsed.push(JSON.parse(line));
    } catch (error) {
      // Ignore malformed telemetry lines to keep reporting resilient.
    }
  }

  return parsed;
}

function toDualWriteIndex(dualWriteEntries = []) {
  const index = new Map();

  for (const entry of dualWriteEntries) {
    const domain = String(entry.domain || '').trim().toLowerCase();
    const identifier = String(entry.identifier || '').trim();

    if (!domain || !identifier) {
      continue;
    }

    const key = `${domain}::${identifier}`;
    const previous = index.get(key);
    const nextTime = new Date(entry.timestamp || 0).getTime() || 0;
    const previousTime = previous ? new Date(previous.timestamp || 0).getTime() || 0 : 0;

    if (!previous || nextTime >= previousTime) {
      index.set(key, entry);
    }
  }

  return index;
}

function classifyFallbackWithParityContext(readEntry, dualWriteIndex) {
  if (!readEntry || readEntry.selected_root !== 'legacy' || !readEntry.legacy_fallback_hit) {
    return null;
  }

  if (readEntry.canonical_hit) {
    return 'policy_or_config_mismatch';
  }

  const domain = String(readEntry.domain || '').trim().toLowerCase();
  const identifier = String(readEntry.requested_identifier || '').trim();
  const requestedFile = String(readEntry.requested_file || '').trim();

  if (domain && identifier) {
    const dualWriteEntry = dualWriteIndex.get(`${domain}::${identifier}`);

    if (dualWriteEntry && Array.isArray(dualWriteEntry.writes)) {
      const canonicalSuccess = dualWriteEntry.writes.some(
        (item) => item.root === 'canonical' && item.status === 'success'
      );
      const canonicalFailed = dualWriteEntry.writes.some(
        (item) => item.root === 'canonical' && item.status === 'failed'
      );
      const legacySuccess = dualWriteEntry.writes.some(
        (item) => item.root === 'legacy' && item.status === 'success'
      );

      if (canonicalFailed && legacySuccess) {
        return 'missing_canonical_write';
      }

      if (canonicalSuccess) {
        return 'structural_mismatch';
      }
    }
  }

  if (!identifier || requestedFile.includes('*')) {
    return 'historical_artifact';
  }

  return 'parity_gap';
}

function createDomainStats() {
  return {
    read_events: 0,
    canonical_hit_count: 0,
    fallback_hit_count: 0,
    fallback_rate: 0,
    fallback_causes: {
      historical_artifact: 0,
      parity_gap: 0,
      structural_mismatch: 0,
      missing_canonical_write: 0,
      policy_or_config_mismatch: 0,
      unresolved_risk: 0
    }
  };
}

function summarizeProjectParity(projectName) {
  const safeProject = String(projectName || '').trim().toLowerCase();
  const telemetryDir = path.join(EXECUTION_DIR, 'projects', safeProject, 'telemetry');
  const readLogPath = path.join(telemetryDir, 'read-redirection-log.jsonl');
  const dualWritePath = path.join(telemetryDir, 'dual-write-log.jsonl');

  const readEntries = readJsonLines(readLogPath);
  const dualWriteEntries = readJsonLines(dualWritePath);
  const dualWriteIndex = toDualWriteIndex(dualWriteEntries);

  const byDomain = {};

  for (const entry of readEntries) {
    const domain = String(entry.domain || '').trim().toLowerCase();

    if (!PHASE375_TARGET_DOMAINS.has(domain)) {
      continue;
    }

    if (!byDomain[domain]) {
      byDomain[domain] = createDomainStats();
    }

    const stats = byDomain[domain];
    stats.read_events += 1;

    if (entry.selected_root === 'canonical') {
      stats.canonical_hit_count += 1;
    }

    if (entry.selected_root === 'legacy' && entry.legacy_fallback_hit) {
      stats.fallback_hit_count += 1;

      const cause = classifyFallbackWithParityContext(entry, dualWriteIndex) || 'unresolved_risk';
      if (!Object.prototype.hasOwnProperty.call(stats.fallback_causes, cause)) {
        stats.fallback_causes.unresolved_risk += 1;
      } else {
        stats.fallback_causes[cause] += 1;
      }
    }
  }

  let totalReads = 0;
  let canonicalHits = 0;
  let fallbackHits = 0;
  let historicalFallbacks = 0;
  let unresolvedStructuralMismatches = 0;
  let activeWriteReadMismatches = 0;

  Object.keys(byDomain).forEach((domain) => {
    const stats = byDomain[domain];
    stats.fallback_rate = stats.read_events > 0
      ? Number((stats.fallback_hit_count / stats.read_events).toFixed(4))
      : 0;

    totalReads += stats.read_events;
    canonicalHits += stats.canonical_hit_count;
    fallbackHits += stats.fallback_hit_count;
    historicalFallbacks += stats.fallback_causes.historical_artifact;
    unresolvedStructuralMismatches += stats.fallback_causes.structural_mismatch;
    activeWriteReadMismatches +=
      stats.fallback_causes.parity_gap +
      stats.fallback_causes.missing_canonical_write +
      stats.fallback_causes.policy_or_config_mismatch;
  });

  const canonicalHitRate = totalReads > 0 ? canonicalHits / totalReads : 0;
  const fallbackRate = totalReads > 0 ? fallbackHits / totalReads : 0;
  const historicalFallbackRate = fallbackHits > 0 ? historicalFallbacks / fallbackHits : 0;

  let readiness = 'not_ready';
  if (totalReads === 0) {
    readiness = 'insufficient_data';
  } else if (
    canonicalHitRate >= 0.85 &&
    fallbackRate <= 0.15 &&
    historicalFallbackRate >= 0.7 &&
    unresolvedStructuralMismatches === 0 &&
    activeWriteReadMismatches === 0
  ) {
    readiness = 'safe_to_audit_phase4';
  } else if (
    canonicalHitRate >= 0.6 &&
    fallbackRate <= 0.4 &&
    unresolvedStructuralMismatches <= 3
  ) {
    readiness = 'partial_more_stabilization_needed';
  }

  return {
    project: safeProject,
    generated_at: new Date().toISOString(),
    telemetry_files: {
      read_redirection_log: readLogPath,
      dual_write_log: dualWritePath
    },
    totals: {
      read_events: totalReads,
      canonical_hit_count: canonicalHits,
      fallback_hit_count: fallbackHits,
      canonical_hit_rate: Number(canonicalHitRate.toFixed(4)),
      fallback_rate: Number(fallbackRate.toFixed(4)),
      fallback_historical_rate: Number(historicalFallbackRate.toFixed(4)),
      unresolved_structural_mismatches: unresolvedStructuralMismatches,
      active_write_read_mismatches: activeWriteReadMismatches
    },
    by_domain: byDomain,
    readiness
  };
}

function summarizeParityAcrossProjects() {
  const executionProjectsDir = path.join(EXECUTION_DIR, 'projects');
  const projects = fs.existsSync(executionProjectsDir)
    ? fs.readdirSync(executionProjectsDir)
        .filter((name) => {
          const fullPath = path.join(executionProjectsDir, name);
          return fs.statSync(fullPath).isDirectory();
        })
        .sort()
    : [];

  const projectSummaries = projects.map((projectName) => summarizeProjectParity(projectName));

  const aggregate = {
    read_events: 0,
    canonical_hit_count: 0,
    fallback_hit_count: 0,
    unresolved_structural_mismatches: 0,
    active_write_read_mismatches: 0
  };

  for (const summary of projectSummaries) {
    aggregate.read_events += summary.totals.read_events;
    aggregate.canonical_hit_count += summary.totals.canonical_hit_count;
    aggregate.fallback_hit_count += summary.totals.fallback_hit_count;
    aggregate.unresolved_structural_mismatches += summary.totals.unresolved_structural_mismatches;
    aggregate.active_write_read_mismatches += summary.totals.active_write_read_mismatches;
  }

  const totalReads = aggregate.read_events;
  aggregate.canonical_hit_rate = totalReads > 0
    ? Number((aggregate.canonical_hit_count / totalReads).toFixed(4))
    : 0;
  aggregate.fallback_rate = totalReads > 0
    ? Number((aggregate.fallback_hit_count / totalReads).toFixed(4))
    : 0;

  return {
    generated_at: new Date().toISOString(),
    project_count: projectSummaries.length,
    aggregate,
    projects: projectSummaries
  };
}

function getLatestRenderedImage(projectName) {
  const outputsDir = resolveExecutionReadCandidate({
    projectName,
    domain: 'generated',
    relativePath: 'outputs',
    pathType: 'directory',
    matcher: /\.(png|jpg|jpeg|webp)$/i,
    requestedIdentifier: 'latest-rendered-image',
    requestedFile: 'generated/outputs/*.{png,jpg,jpeg,webp}'
  }).selectedPath;

  const files = fs.readdirSync(outputsDir)
    .filter(name => name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.webp'))
    .sort()
    .reverse();

  if (!files.length) {
    return null;
  }

  return path.join(outputsDir, files[0]);
}

function evaluateEmailReadiness(projectName) {
  const context = buildPromptEngineContext(projectName);
  const logo = context.source_of_truth.logo;
  const renderedImage = getLatestRenderedImage(projectName);

  const result = {
    project: projectName,
    status: 'ready',
    blocking_reasons: [],
    warnings: [],
    readiness: {
      has_logo: !!logo,
      has_rendered_image: !!renderedImage,
      has_public_image_url: false,
      has_html: false
    }
  };

  if (!logo) {
    result.status = 'blocked';
    result.blocking_reasons.push('Missing logo source');
  }

  if (!renderedImage) {
    result.status = 'needs_prepare';
    result.warnings.push('No rendered image available yet');
  }

  return result;
}

function getEmailPreparePaths(projectName) {
  const safeProject = String(projectName || '').trim().toLowerCase();
  const contract = getEmailArtifactContract(safeProject, EMAIL_ARTIFACT_TYPES.PREPARE_PACKAGE);
  const baseDir = contract.canonicalBase;
  const legacyBaseDir = contract.legacyBase;
  const preparePath = path.join(legacyBaseDir, contract.relativePath);

  ensureDir(baseDir);
  ensureDir(legacyBaseDir);

  return {
    baseDir,
    legacyBaseDir,
    preparePath
  };
}

function getLatestRenderedOutput(projectName) {
  const renderRequest = getLatestRenderRequest(projectName);

  if (!renderRequest || renderRequest.status !== 'completed') {
    throw new Error('No completed render request found');
  }

  const outputPath =
    renderRequest.result?.output_path ||
    renderRequest.output_path ||
    null;

  if (!outputPath || !fs.existsSync(outputPath)) {
    throw new Error('Rendered output file not found');
  }

  return {
    render_id: renderRequest.render_id,
    output_path: outputPath,
    provider: renderRequest.result?.provider || renderRequest.provider || null,
    model: renderRequest.result?.model || null
  };
}

function buildEmailPreparePackage(projectName) {
  const preparePaths = getEmailPreparePaths(projectName);
  const readiness = evaluateEmailReadiness(projectName);
  const rendered = readiness.status !== 'blocked' ? getLatestRenderedOutput(projectName) : null;

  const packageData = {
    project: projectName,
    generated_at: new Date().toISOString(),
    status: readiness.status,
    blocking_reasons: readiness.blocking_reasons,
    warnings: readiness.warnings,
    checks: readiness.checks,
    rendered_asset: rendered,
    email_asset: {
      subject: `New campaign visual for ${projectName}`,
      headline: `Discover the new premium visual experience`,
      cta: `Shop Now`,
      body: `This campaign asset was auto-prepared by the system using the latest approved brand-controlled render.`,
      html: null,
      ready_for_send: false
    }
  };

  executionArtifactWriter.writeJson({
    project: projectName,
    domain: 'email',
    artifactType: 'email_prepare_package',
    identifier: packageData.package_id || projectName,
    legacyPath: preparePaths.preparePath,
    data: packageData
  });
  return packageData;
}

function buildEmailHtmlFromPreparePackage(packageData) {
  const subject = packageData.email_asset.subject || 'Campaign Update';
  const headline = packageData.email_asset.headline || 'New Campaign Asset';
  const body = packageData.email_asset.body || '';
  const cta = packageData.email_asset.cta || 'Learn More';
  const imagePath = packageData.rendered_asset?.output_path || '';

  // هذه النسخة الحالية تعتمد على المسار الداخلي كمرجع تشغيلي
  // وسيتم لاحقًا استبداله بـ public URL layer
  return `
<!doctype html>
<html>
  <body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f5f5f5;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f5f5;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="640" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:32px 32px 16px 32px;text-align:center;">
                <h1 style="margin:0;font-size:30px;color:#111111;">${headline}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 24px 32px;text-align:center;color:#444444;font-size:16px;line-height:1.6;">
                ${body}
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 24px 32px;text-align:center;color:#777777;font-size:13px;">
                Render source: ${imagePath}
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 40px 32px;text-align:center;">
                <a href="#" style="display:inline-block;padding:14px 28px;background:#111111;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:bold;">
                  ${cta}
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`.trim();
}

function autoPrepareEmailAsset(projectName, rawText = '') {
  const preparePaths = getEmailPreparePaths(projectName);
  const packageData = buildEmailPreparePackage(projectName);

  if (packageData.status === 'blocked') {
    return packageData;
  }

  const subject = extractFlagValue(rawText, 'subject') || packageData.email_asset.subject;
  const headline = extractFlagValue(rawText, 'headline') || packageData.email_asset.headline;
  const body = extractFlagValue(rawText, 'body') || packageData.email_asset.body;
  const cta = extractFlagValue(rawText, 'cta') || packageData.email_asset.cta;
  const ctaUrl = extractFlagValue(rawText, 'url');

  const publicImageUrl = buildPublicImageUrl(projectName, packageData.rendered_asset?.output_path || '');

  packageData.email_asset.subject = subject;
  packageData.email_asset.headline = headline;
  packageData.email_asset.body = body;
  packageData.email_asset.cta = cta;
  packageData.email_asset.cta_url = ctaUrl;
  packageData.email_asset.public_image_url = publicImageUrl;

  packageData.email_asset.html = buildHardenedEmailHtml(packageData);

  const htmlDir = path.join(preparePaths.legacyBaseDir, 'email', 'html');
  const preparedDir = path.join(preparePaths.legacyBaseDir, 'email', 'prepared');
  ensureDir(htmlDir);
  ensureDir(preparedDir);

  const packageId = `emailprep_${Date.now()}`;
  const htmlPath = path.join(htmlDir, `${packageId}.html`);
  const jsonPath = path.join(preparedDir, `${packageId}.json`);

  executionArtifactWriter.writeText({
    project: projectName,
    domain: 'email',
    artifactType: 'email_prepared_html',
    identifier: packageId,
    legacyPath: htmlPath,
    payload: packageData.email_asset.html,
    encoding: 'utf8'
  });

  const validation = validateEmailPreparePackage(packageData);

  packageData.package_id = packageId;
  packageData.html_path = htmlPath;
  packageData.public_image_url = publicImageUrl;
  packageData.validation = validation;

  if (validation.valid) {
    packageData.status = 'ready_for_send';
    packageData.email_asset.ready_for_send = true;
  } else {
    packageData.status = 'needs_manual_review';
    packageData.email_asset.ready_for_send = false;
  }

  executionArtifactWriter.writeJson({
    project: projectName,
    domain: 'email',
    artifactType: 'email_prepared_package',
    identifier: packageId,
    legacyPath: jsonPath,
    data: packageData
  });
  executionArtifactWriter.writeJson({
    project: projectName,
    domain: 'email',
    artifactType: 'email_prepare_package',
    identifier: packageId,
    legacyPath: preparePaths.preparePath,
    data: packageData
  });

  return packageData;
}

function reviewEmailPreparePackage(projectName) {
  const prepareFile = resolveEmailReadCandidate({
    projectName,
    artifactType: EMAIL_ARTIFACT_TYPES.PREPARE_PACKAGE,
    requestedIdentifier: projectName,
    requestedFile: 'email-prepare-package.json'
  });

  if (!fs.existsSync(prepareFile.selectedPath)) {
    throw new Error('Email prepare package not found');
  }

  return readJsonFile(prepareFile.selectedPath, {});
}
function extractFlagValue(text, flagName) {
  const pattern = new RegExp(`--${flagName}="([^"]*)"`);
  const match = text.match(pattern);
  return match ? match[1].trim() : '';
}

function isValidHttpUrl(value) {
  try {
    const url = new URL(String(value || '').trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function buildPublicImageUrl(projectName, outputPath) {
  if (!outputPath) return '';

  const filename = path.basename(outputPath);
  return `http://46.62.173.30/generated-output/${projectName}/${filename}`;
}

function validateEmailPreparePackage(packageData) {
  const errors = [];
  const warnings = [];

  const subject = String(packageData.email_asset?.subject || '').trim();
  const headline = String(packageData.email_asset?.headline || '').trim();
  const body = String(packageData.email_asset?.body || '').trim();
  const cta = String(packageData.email_asset?.cta || '').trim();
  const url = String(packageData.email_asset?.cta_url || '').trim();
  const html = String(packageData.email_asset?.html || '').trim();
  const publicImageUrl = String(packageData.email_asset?.public_image_url || '').trim();

  if (!subject) errors.push('Missing email subject');
  if (!headline) errors.push('Missing email headline');
  if (!body) errors.push('Missing email body');
  if (!cta) errors.push('Missing CTA text');

  if (!url) {
    errors.push('Missing CTA URL');
  } else if (!isValidHttpUrl(url)) {
    errors.push('CTA URL is invalid');
  }

  if (!publicImageUrl) {
    errors.push('Missing public image URL');
  } else if (!isValidHttpUrl(publicImageUrl)) {
    errors.push('Public image URL is invalid');
  }

  if (!html) errors.push('Missing HTML content');

  if (subject && subject.length < 3) warnings.push('Subject is very short');
  if (headline && headline.length < 3) warnings.push('Headline is very short');
  if (body && body.length < 12) warnings.push('Body text is very short');

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

function buildHardenedEmailHtml(packageData) {
  const subject = packageData.email_asset.subject;
  const headline = packageData.email_asset.headline;
  const body = packageData.email_asset.body;
  const cta = packageData.email_asset.cta;
  const ctaUrl = packageData.email_asset.cta_url;
  const publicImageUrl = packageData.email_asset.public_image_url;

  return `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f4f4f4;padding:32px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="640" cellspacing="0" cellpadding="0" border="0" style="max-width:640px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;">
          <tr>
            <td align="center">
              <img src="${publicImageUrl}" alt="${headline}" style="display:block;width:100%;max-width:640px;height:auto;">
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 16px;font-size:32px;line-height:1.2;color:#111111;">${headline}</h1>
              <p style="margin:0 0 24px;font-size:16px;line-height:1.7;color:#333333;">${body}</p>
              <a href="${ctaUrl}" style="display:inline-block;padding:14px 24px;background:#111111;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:bold;">
                ${cta}
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();
}

function getLatestRenderRequest(projectName) {
  const rendersDir = resolveExecutionReadCandidate({
    projectName,
    domain: 'generated',
    relativePath: 'renders',
    pathType: 'directory',
    matcher: /\.json$/i,
    requestedIdentifier: 'latest-render-request',
    requestedFile: 'generated/renders/*.json'
  }).selectedPath;

  const files = fs.readdirSync(rendersDir)
    .filter(name => name.endsWith('.json'))
    .sort()
    .reverse();

  if (!files.length) {
    throw new Error('No render requests found');
  }

  const latestPath = path.join(rendersDir, files[0]);
  return readJsonFile(latestPath, {});
}

function buildAssetFidelityRules(sourceOfTruth = {}, goal = '') {
  const productIntel = inferProductIntelligenceFromSource(sourceOfTruth);
  const designIntent = inferDesignIntent(goal);

  return {
    product_intelligence: productIntel,
    design_intent: designIntent,
    hard_rules: [
      'Use the provided product image as the exact source of truth.',
      'Do not change bottle shape.',
      'Do not change label structure.',
      'Do not change brand identity.',
      'Do not replace the real logo.',
      'Do not invent new packaging.',
      'Do not invent new ingredients, claims, or visual brand marks.'
    ],
    allowed_enhancements: [
      'background',
      'lighting',
      'shadow',
      'composition',
      'depth',
      'premium cinematic atmosphere',
      'clean framing'
    ],
    forbidden_transformations: [
      'shape change',
      'label redesign',
      'logo redesign',
      'bottle redesign',
      'fake packaging',
      'fake product color swap'
    ]
  };
}
function buildCreativeMap(product) {
  const mi = product.marketing_intelligence || {};
  const productName = product.product_name || 'This product';
  const productType = mi.product_type || product.category || 'general';
  const positioning = mi.positioning || 'professional';

  const mainBenefit =
    Array.isArray(mi.benefits) && mi.benefits.length > 0
      ? mi.benefits[0]
      : 'care';

  const audience =
    Array.isArray(mi.target_audience) && mi.target_audience.length > 0
      ? mi.target_audience[0]
      : 'men';

  const styleBase =
    positioning === 'premium' ? 'cinematic_premium' : 'clean_professional';

  return {
    branding: {
      goal: 'awareness',
      hook: `${productName} builds a stronger ${productType} identity with ${mainBenefit}.`,
      visual_style: styleBase,
      format: 'hero branding visual',
      cta: 'Discover the collection'
    },
    feature: {
      goal: 'consideration',
      hook: `${productName} highlights real ${productType} care benefits for ${audience}.`,
      visual_style: 'educational_product_focus',
      format: 'feature post',
      cta: 'See how it works'
    },
    offer: {
      goal: 'conversion',
      hook: `${productName} is ideal for promotional conversion-focused campaigns.`,
      visual_style: 'bold_offer_visual',
      format: 'offer post',
      cta: 'Shop now'
    },
    infographic: {
      goal: 'education',
      hook: `${productName} can be explained clearly through benefit, ingredient, and usage blocks.`,
      visual_style: 'structured_infographic',
      format: 'infographic',
      cta: 'Learn more'
    },
    reel: {
      goal: 'attention',
      hook: `${productName} fits short-form visual storytelling with strong first-second attention.`,
      visual_style: 'short_form_cinematic',
      format: 'reel / short video',
      cta: 'Watch now'
    },
    marketplace: {
      goal: 'conversion',
      hook: `${productName} should emphasize clarity, trust, and real product presentation.`,
      visual_style: 'clean_marketplace',
      format: 'marketplace listing visual',
      cta: 'Buy now'
    },
    partner: {
      goal: 'recruitment',
      hook: `${productName} is suitable for barbershops, resellers, and partner promotion use cases.`,
      visual_style: 'trust_recruitment',
      format: 'partner post',
      cta: 'Join as a partner'
    }
  };
}

function buildFidelityPrompt(renderRequest) {
  const sourceOfTruth = renderRequest.source_of_truth || {};
  const rules = buildAssetFidelityRules(sourceOfTruth, renderRequest.goal || '');

  const productIntel = rules.product_intelligence;
  const intent = rules.design_intent;

  return `
${renderRequest.final_generation_prompt}

PRODUCT INTELLIGENCE:
- Product name: ${productIntel.product_name || 'unknown'}
- Category: ${productIntel.category || 'unknown'}
- Product line: ${productIntel.line || 'unknown'}
- Size: ${productIntel.size || 'unknown'}
- Content family: ${productIntel.content_family || 'unknown'}

DESIGN INTENT:
- Content type: ${intent.content_type}
- Visual style: ${intent.visual_style}
- Objective: ${intent.objective}

MANDATORY FIDELITY RULES:
- Use the provided product image EXACTLY as the main source of truth.
- Use the provided logo image EXACTLY as the real logo reference.
- Keep the real product visually recognizable and faithful to the input.
- Do NOT change bottle shape.
- Do NOT change product proportions.
- Do NOT change label structure.
- Do NOT change packaging identity.
- Do NOT invent a new logo.
- Do NOT invent a new bottle.
- Do NOT invent ingredients, claims, or decorative brand elements.

ALLOWED ENHANCEMENTS ONLY:
- background
- lighting
- shadow
- composition
- depth
- premium cinematic atmosphere
- clean framing

STYLE DIRECTION:
Create a realistic, premium, cinematic, marketing-grade visual that supports the campaign objective while preserving the exact product identity.
`.trim();
}



async function executeProviderRender(projectName) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is missing');
  }

  const renderRequest = getLatestRenderRequest(projectName);

  if (!renderRequest || renderRequest.status !== 'render_ready') {
    throw new Error('No render-ready request found');
  }

  const outputPath = renderRequest.output_path;
  const renderId = renderRequest.render_id;
  const sourceOfTruth = renderRequest.source_of_truth || {};

  const finalPrompt = buildFidelityPrompt(renderRequest);
  const productPath = sourceOfTruth.product;
  const logoPath = sourceOfTruth.logo;

  if (!productPath || !fs.existsSync(productPath)) {
    throw new Error('Missing real product source image');
  }

  if (!logoPath || !fs.existsSync(logoPath)) {
    throw new Error('Missing real logo source image');
  }

  const form = new FormData();
  form.append('model', 'gpt-image-1.5');
  form.append('prompt', finalPrompt);
  form.append('size', '1024x1024');
  form.append('quality', 'high');
  form.append('output_format', 'png');
  form.append('input_fidelity', 'high');

  // product first = strongest fidelity
  form.append('image[]', fs.createReadStream(productPath));
  form.append('image[]', fs.createReadStream(logoPath));

  const response = await axios.post(
    'https://api.openai.com/v1/images/edits',
    form,
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        ...form.getHeaders()
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      timeout: 120000
    }
  );

  const imageBase64 = response.data?.data?.[0]?.b64_json;
  if (!imageBase64) {
    throw new Error('No image data returned from provider');
  }

  const imageBuffer = Buffer.from(imageBase64, 'base64');
  ensureDir(path.dirname(outputPath));
  executionArtifactWriter.writeBuffer({
    project: projectName,
    domain: 'generated',
    artifactType: 'generated_output_image',
    identifier: renderId,
    legacyPath: outputPath,
    payload: imageBuffer
  });

  const updated = markRenderResult(projectName, renderId, 'completed', {
  provider: 'openai',
  output_path: outputPath,
  model: 'gpt-image-1.5',
  fidelity_mode: 'real_asset_locked',
  product_locked: true,
  logo_locked: true
});

  return updated;
}

function getEmailDeliveryPaths(projectName) {
  const safeProject = String(projectName || '').trim().toLowerCase();
  const emailPaths = getEmailDomainPaths(safeProject);
  const baseDir = emailPaths.canonicalEmailDir;
  const deliveryDir = path.join(baseDir, 'delivery');
  const preparedDir = path.join(baseDir, 'prepared');
  const legacyBaseDir = emailPaths.legacyEmailDir;
  const legacyDeliveryDir = path.join(legacyBaseDir, 'delivery');
  const legacyPreparedDir = path.join(legacyBaseDir, 'prepared');

  ensureDir(baseDir);
  ensureDir(deliveryDir);
  ensureDir(preparedDir);
  ensureDir(legacyBaseDir);
  ensureDir(legacyDeliveryDir);
  ensureDir(legacyPreparedDir);

  return {
    baseDir,
    deliveryDir,
    preparedDir,
    legacyBaseDir,
    legacyDeliveryDir,
    legacyPreparedDir
  };
}

function getLatestPreparedEmailPackage(projectName) {
  const preparedDir = resolveEmailReadCandidate({
    projectName,
    artifactType: EMAIL_ARTIFACT_TYPES.PREPARED_PACKAGE,
    matcher: /\.json$/i,
    requestedIdentifier: 'latest-prepared-email-package',
    requestedFile: 'email/prepared/*.json'
  }).selectedPath;

  const files = fs.readdirSync(preparedDir)
    .filter(name => name.endsWith('.json'))
    .sort()
    .reverse();

  if (!files.length) {
    throw new Error('No prepared email package found');
  }

  const latestPath = path.join(preparedDir, files[0]);
  return readJsonFile(latestPath, {});
}

function evaluatePreparedEmailForSend(projectName) {
  const pkg = getLatestPreparedEmailPackage(projectName);

  const result = {
    project: projectName,
    status: 'ready_for_send',
    blocking_reasons: [],
    package_id: pkg.package_id || null
  };

  if (pkg.status !== 'ready_for_send') {
    result.status = 'blocked';
    result.blocking_reasons.push('Prepared email package is not ready_for_send');
  }

  if (!pkg.validation || pkg.validation.valid !== true) {
    result.status = 'blocked';
    result.blocking_reasons.push('Prepared email package validation failed');
  }

  if (!pkg.email_asset || !pkg.email_asset.html) {
    result.status = 'blocked';
    result.blocking_reasons.push('Missing email HTML');
  }

  if (!pkg.email_asset || !pkg.email_asset.public_image_url) {
    result.status = 'blocked';
    result.blocking_reasons.push('Missing public image URL');
  }

  if (!pkg.email_asset || !pkg.email_asset.cta_url) {
    result.status = 'blocked';
    result.blocking_reasons.push('Missing CTA URL');
  }

  return result;
}

function writeEmailDeliveryRecord(projectName, data) {
  const paths = getEmailDeliveryPaths(projectName);
  const deliveryId = `emailsend_${Date.now()}`;
  const recordPath = path.join(paths.legacyDeliveryDir, `${deliveryId}.json`);

  const record = {
    delivery_id: deliveryId,
    project: projectName,
    created_at: new Date().toISOString(),
    ...data
  };

  executionArtifactWriter.writeJson({
    project: projectName,
    domain: 'email',
    artifactType: 'email_delivery_record',
    identifier: deliveryId,
    legacyPath: recordPath,
    data: record
  });
  return record;
}
async function sendPreparedEmail(projectName, toEmail) {
  const readiness = evaluatePreparedEmailForSend(projectName);

  if (readiness.status !== 'ready_for_send') {
    return writeEmailDeliveryRecord(projectName, {
      status: 'send_blocked',
      to_email: toEmail,
      package_id: readiness.package_id,
      blocking_reasons: readiness.blocking_reasons
    });
  }

  const pkg = getLatestPreparedEmailPackage(projectName);

  // TODO:
  // اربط هنا مع مزود الإرسال الفعلي الموجود لديك داخل النظام
  // مثل SMTP / WordPress mail bridge / provider API
  // في هذه النسخة سنحفظ سجلاً آمنًا ونعتبره pending_send إذا لم تربط مزود الإرسال بعد.

  return writeEmailDeliveryRecord(projectName, {
    status: 'pending_provider_send',
    to_email: toEmail,
    package_id: pkg.package_id,
    subject: pkg.email_asset.subject,
    html_path: pkg.html_path,
    public_image_url: pkg.public_image_url,
    note: 'Prepared and verified. Waiting for provider integration or send bridge.'
  });
}
function ensureWooEnv() {
  if (!process.env.WC_BASE_URL || !process.env.WC_KEY || !process.env.WC_SECRET) {
    throw new Error('WooCommerce environment variables are missing');
  }
}

async function fetchWooProductsPage(page = 1, perPage = 20) {
  ensureWooEnv();

  const response = await axios.get(
    `${process.env.WC_BASE_URL}/products`,
    {
      auth: {
        username: process.env.WC_KEY,
        password: process.env.WC_SECRET
      },
      params: {
        page,
        per_page: perPage
      }
    }
  );

  return Array.isArray(response.data) ? response.data : [];
}

async function fetchWooProductBySlug(productSlug) {
  ensureWooEnv();

  const response = await axios.get(
    `${process.env.WC_BASE_URL}/products`,
    {
      auth: {
        username: process.env.WC_KEY,
        password: process.env.WC_SECRET
      },
      params: {
        slug: productSlug
      }
    }
  );

  return response.data?.[0] || null;
}

function mapWooProductSummary(product) {
  return {
    id: product?.id || null,
    name: product?.name || null,
    slug: product?.slug || null,
    status: product?.status || null,
    price: product?.price || '',
    permalink: product?.permalink || null
  };
}

function mapWooProductFull(product) {
  return {
    id: product?.id || null,
    name: product?.name || null,
    slug: product?.slug || null,
    status: product?.status || null,
    permalink: product?.permalink || null,
    short_description: product?.short_description || '',
    description: product?.description || '',
    images: Array.isArray(product?.images)
      ? product.images.map(img => ({
          id: img.id || null,
          src: img.src || null,
          name: img.name || null,
          alt: img.alt || ''
        }))
      : [],
    categories: Array.isArray(product?.categories)
      ? product.categories.map(cat => ({
          id: cat.id || null,
          name: cat.name || null,
          slug: cat.slug || null
        }))
      : [],
    attributes: Array.isArray(product?.attributes)
      ? product.attributes.map(attr => ({
          id: attr.id || null,
          name: attr.name || null,
          visible: attr.visible || false,
          variation: attr.variation || false,
          options: Array.isArray(attr.options) ? attr.options : []
        }))
      : []
  };
}

async function syncAllWooProducts(projectName) {
  const synced = [];
  let page = 1;
  const perPage = 50;

  while (true) {
    const products = await fetchWooProductsPage(page, perPage);
    if (!products.length) break;

    for (const product of products) {
      const record = buildProductIntelligenceRecordFromWoo(product);
      upsertProductIntelligenceRecord(projectName, record);
      synced.push(record);
    }

    if (products.length < perPage) break;
    page += 1;
  }

  return {
    project: projectName,
    total_synced: synced.length,
    products: synced.map(x => ({
      product_id: x.product_id,
      product_slug: x.product_slug,
      product_name: x.product_name,
      category: x.category,
      line: x.line,
      size: x.size,
      status: x.status
    }))
  };
}

function buildWcSyncSummary(projectName) {
  const products = listProductIntelligence(projectName);

  const summary = {
    project: projectName,
    total_products: products.length,
    published_count: 0,
    draft_count: 0,
    by_category: {},
    missing_size: [],
    missing_images: [],
    unenriched_count: 0
  };

  for (const product of products) {
    if (product.status === 'publish') summary.published_count += 1;
    if (product.status === 'draft') summary.draft_count += 1;

    const category = product.category || 'unknown';
    summary.by_category[category] = (summary.by_category[category] || 0) + 1;

    if (!product.size) {
      summary.missing_size.push(product.product_slug);
    }

    if (!Array.isArray(product.wc_image_urls) || product.wc_image_urls.length === 0) {
      summary.missing_images.push(product.product_slug);
    }

    const m = product.marketing_intelligence || {};
    const hasEnrichment =
      (Array.isArray(m.benefits) && m.benefits.length > 0) ||
      (Array.isArray(m.ingredients) && m.ingredients.length > 0) ||
      (Array.isArray(m.usage) && m.usage.length > 0) ||
      (Array.isArray(m.target_audience) && m.target_audience.length > 0) ||
      !!m.positioning;

    if (!hasEnrichment) {
      summary.unenriched_count += 1;
    }
  }

  return summary;
}

function getLatestGeneratedImage(projectName) {
  const resolution = unifiedDataPathResolver.resolve(projectName, {
    domain: 'generated',
    operation: 'read'
  });
  const outputDirResolution = resolveExecutionReadCandidate({
    projectName,
    domain: 'generated',
    relativePath: 'outputs',
    pathType: 'directory',
    matcher: /\.(png|jpg|jpeg|webp)$/i,
    requestedIdentifier: 'latest-generated-image',
    requestedFile: 'outputs/*.{png,jpg,jpeg,webp}'
  });
  const outputDir = outputDirResolution.selectedPath;

  ensureDir(outputDir);

  const files = fs.readdirSync(outputDir)
    .filter(name => /\.(png|jpg|jpeg|webp)$/i.test(name))
    .sort()
    .reverse();

  if (!files.length) {
    throw new Error('No generated image output found');
  }

  const latest = files[0];

  return {
    filename: latest,
    path: path.join(outputDir, latest),
    public_url: `http://46.62.173.30/generated-output/${projectName}/${latest}`
  };
}


function getMetaExecutionPaths(projectName) {
  const resolution = unifiedDataPathResolver.resolve(projectName, {
    domain: 'channels',
    operation: 'read'
  });
  const baseDir = path.join(resolution.activeReadPath, 'channels', 'meta');
  const packagesDir = path.join(baseDir, 'packages');

  ensureDir(baseDir);
  ensureDir(packagesDir);

  return {
    baseDir,
    packagesDir
  };
}

function getMetaPlacementRules(placement) {
  const rules = {
    instagram_post: {
      platform: 'instagram',
      format: 'static_image',
      recommended_ratio: '4:5 or 1:1',
      goal_style: 'visual storytelling with concise caption',
      max_caption_style: 'short_to_medium',
      cta_style: 'soft-direct'
    },
    instagram_reel: {
      platform: 'instagram',
      format: 'vertical_video_or_reel_brief',
      recommended_ratio: '9:16',
      goal_style: 'short-form visual momentum',
      max_caption_style: 'short',
      cta_style: 'direct'
    },
    facebook_feed: {
      platform: 'facebook',
      format: 'feed_post',
      recommended_ratio: '1:1 or 4:5',
      goal_style: 'clear value-led copy',
      max_caption_style: 'medium',
      cta_style: 'direct'
    },
    facebook_reel: {
      platform: 'facebook',
      format: 'vertical_video_or_reel_brief',
      recommended_ratio: '9:16',
      goal_style: 'attention-first short-form creative',
      max_caption_style: 'short',
      cta_style: 'direct'
    }
  };

  return rules[String(placement || '').trim().toLowerCase()] || null;
}

function buildMetaIntelligence(projectName, placement, goal) {
  const placementRules = getMetaPlacementRules(placement);

  if (!placementRules) {
    throw new Error('Unsupported Meta placement');
  }

  return {
    project: projectName,
    placement,
    goal,
    trend_direction: 'Use premium, high-contrast, attention-grabbing creative direction with clean focal hierarchy.',
    competitor_gap: 'Avoid generic cluttered creatives. Prioritize cleaner premium composition and stronger brand trust signals.',
    audience_fit: 'Target visually-driven users who respond to premium presentation, clarity, and direct value cues.',
    content_angle: 'Premium brand-controlled visual identity with strong product credibility and polished presentation.',
    placement_rules: placementRules
  };
}

function buildMetaCaption(projectName, placement, goal) {
  const rules = getMetaPlacementRules(placement);
  const intelligence = buildMetaIntelligence(projectName, placement, goal);

  const headline = placement.includes('reel')
    ? `Premium visual. Real brand. Real impact.`
    : `Discover the new ${projectName} visual experience`;

  const body = placement.includes('reel')
    ? `Built for fast attention and premium brand presence.`
    : `A brand-controlled creative built for ${goal}, designed to present the product with clarity, confidence, and premium appeal.`;

  const cta = rules.cta_style === 'direct'
    ? 'Shop now and explore the collection.'
    : 'Discover more and explore the collection.';

  const hashtags = [
    `#${projectName}`,
    '#premiumbrand',
    '#brandvisual',
    '#campaigncreative',
    '#mensgrooming',
    '#luxurylifestyle'
  ];

  return {
    headline,
    body,
    cta,
    hashtags,
    intelligence
  };
}

function buildMetaCompliance(projectName, placement, imageInfo) {
  const rules = getMetaPlacementRules(placement);

  if (!rules) {
    throw new Error('Unsupported Meta placement');
  }

  return {
    project: projectName,
    placement,
    platform: rules.platform,
    recommended_ratio: rules.recommended_ratio,
    format: rules.format,
    image_available: !!imageInfo,
    public_image_url: imageInfo?.public_url || null,
    compliance_notes: [
      'Use real registered brand assets only.',
      'Do not alter packaging, label layout, or brand marks.',
      'Keep messaging platform-appropriate and visually clear.',
      'Avoid misleading claims or non-verifiable promises.'
    ],
    publish_status: imageInfo ? 'ready_for_publish' : 'needs_manual_review'
  };
}

function buildMetaPackage(projectName, placement, goal) {
  const metaPaths = getMetaExecutionPaths(projectName);
  const image = getLatestGeneratedImage(projectName);
  const compliance = buildMetaCompliance(projectName, placement, image);
  const content = buildMetaCaption(projectName, placement, goal);

  const packageId = `metapkg_${Date.now()}`;
  const packagePath = path.join(metaPaths.packagesDir, `${packageId}.json`);

  const pkg = {
    package_id: packageId,
    project: projectName,
    channel_group: 'meta',
    placement,
    generated_at: new Date().toISOString(),
    goal,
    status: compliance.publish_status,
    image_path: image.path,
    public_image_url: image.public_url,
    caption: `${content.headline}\n\n${content.body}\n\n${content.cta}\n\n${content.hashtags.join(' ')}`,
    headline: content.headline,
    body: content.body,
    cta: content.cta,
    hashtags: content.hashtags,
    intelligence: content.intelligence,
    compliance
  };

  executionArtifactWriter.writeJson({
    project: projectName,
    domain: 'channels',
    artifactType: 'meta_channel_package',
    identifier: packageId,
    legacyPath: packagePath,
    data: pkg
  });
  return pkg;
}

function reviewLatestMetaPackage(projectName) {
  const packagesDir = resolveExecutionReadCandidate({
    projectName,
    domain: 'channels',
    relativePath: path.join('meta', 'packages'),
    pathType: 'directory',
    matcher: /\.json$/i,
    requestedIdentifier: 'latest-meta-package',
    requestedFile: 'channels/meta/packages/*.json'
  }).selectedPath;

  const files = fs.readdirSync(packagesDir)
    .filter(name => name.endsWith('.json'))
    .sort()
    .reverse();

  if (!files.length) {
    throw new Error('No Meta packages found');
  }

  return readJsonFile(path.join(packagesDir, files[0]), {});
}
function getVideoExecutionPaths(projectName) {
  const resolution = unifiedDataPathResolver.resolve(projectName, {
    domain: 'channels',
    operation: 'read'
  });
  const baseDir = path.join(resolution.activeReadPath, 'channels');
  const tiktokDir = path.join(baseDir, 'tiktok');
  const youtubeDir = path.join(baseDir, 'youtube');

  ensureDir(baseDir);
  ensureDir(tiktokDir);
  ensureDir(youtubeDir);

  return {
    baseDir,
    tiktokDir,
    youtubeDir
  };
}

function buildTikTokIntelligence(projectName, goal) {
  return {
    project: projectName,
    platform: 'tiktok',
    goal,
    trend_direction: 'Prioritize high-contrast first-frame impact, fast hook delivery, and visually clean premium presentation.',
    competitor_gap: 'Avoid generic noisy edits. Focus on cleaner product-led luxury execution and stronger credibility cues.',
    audience_fit: 'Target short-attention users who respond to fast visual payoff, clarity, and premium product framing.',
    algorithm_fit: 'Optimize for first seconds retention, concise structure, and direct visual storytelling.'
  };
}

function buildTikTokCompliance(projectName, imageInfo) {
  return {
    project: projectName,
    platform: 'tiktok',
    recommended_ratio: '9:16',
    minimum_resolution_guidance: '>= 540x960',
    format: 'short_video_brief',
    image_available: !!imageInfo,
    public_image_url: imageInfo?.public_url || null,
    compliance_notes: [
      'Use the image as creative reference only for short-form video production.',
      'Keep key creative elements inside safe zones.',
      'Avoid relying on clickable links, @ mentions, or hashtag behavior inside ad caption logic.',
      'Do not make misleading or non-verifiable claims.'
    ],
    publish_status: imageInfo ? 'ready_for_production' : 'needs_manual_review'
  };
}

function buildTikTokPackage(projectName, goal) {
  const paths = getVideoExecutionPaths(projectName);
  const image = getLatestGeneratedImage(projectName);
  const intelligence = buildTikTokIntelligence(projectName, goal);
  const compliance = buildTikTokCompliance(projectName, image);

  const packageId = `ttpkg_${Date.now()}`;
  const packagePath = path.join(paths.tiktokDir, `${packageId}.json`);

  const pkg = {
    package_id: packageId,
    project: projectName,
    channel: 'tiktok',
    generated_at: new Date().toISOString(),
    goal,
    status: compliance.publish_status,
    reference_image_path: image.path,
    public_image_url: image.public_url,
    hook: 'This is what premium brand-controlled creative actually looks like.',
    script: [
      'Open with the strongest premium visual frame immediately.',
      'Show the product and brand feel with clean focal composition.',
      'Reinforce premium quality and visual trust in one sentence.',
      'End with a direct CTA for discovery or shopping.'
    ],
    shot_structure: [
      'Shot 1: Hook frame',
      'Shot 2: Product emphasis',
      'Shot 3: Brand credibility / premium tone',
      'Shot 4: CTA end frame'
    ],
    caption: 'Premium visual launch built with strict brand control.',
    cta: 'Discover more now.',
    intelligence,
    compliance
  };

  executionArtifactWriter.writeJson({
    project: projectName,
    domain: 'channels',
    artifactType: 'tiktok_channel_package',
    identifier: packageId,
    legacyPath: packagePath,
    data: pkg
  });
  return pkg;
}

function reviewLatestTikTokPackage(projectName) {
  const tiktokDir = resolveExecutionReadCandidate({
    projectName,
    domain: 'channels',
    relativePath: 'tiktok',
    pathType: 'directory',
    matcher: /\.json$/i,
    requestedIdentifier: 'latest-tiktok-package',
    requestedFile: 'channels/tiktok/*.json'
  }).selectedPath;

  const files = fs.readdirSync(tiktokDir)
    .filter(name => name.endsWith('.json'))
    .sort()
    .reverse();

  if (!files.length) {
    throw new Error('No TikTok packages found');
  }

  return readJsonFile(path.join(tiktokDir, files[0]), {});
}

function getYouTubeFormatRules(format) {
  const rules = {
    short: {
      platform: 'youtube',
      format: 'short',
      recommended_ratio: 'vertical or square',
      max_duration_guidance: 'up to 3 minutes',
      goal_style: 'fast hook + short-form retention'
    },
    video: {
      platform: 'youtube',
      format: 'video',
      recommended_ratio: '16:9',
      max_duration_guidance: 'long-form',
      goal_style: 'title + thumbnail + structured value delivery'
    }
  };

  return rules[String(format || '').trim().toLowerCase()] || null;
}

function buildYouTubeIntelligence(projectName, format, goal) {
  const rules = getYouTubeFormatRules(format);

  if (!rules) {
    throw new Error('Unsupported YouTube format');
  }

  return {
    project: projectName,
    platform: 'youtube',
    format,
    goal,
    trend_direction: format === 'short'
      ? 'Lead with immediate visual payoff and strong first-line hook.'
      : 'Use stronger promise-led positioning with thumbnail-title alignment.',
    competitor_gap: format === 'short'
      ? 'Avoid slow intros. Front-load the value visually.'
      : 'Avoid vague titles. Use concrete benefit-driven framing.',
    audience_fit: format === 'short'
      ? 'Target mobile-first short-form viewers with low patience and high novelty response.'
      : 'Target viewers looking for clear value, authority, and product understanding.',
    algorithm_fit: format === 'short'
      ? 'Retention-first, immediate hook, visual momentum.'
      : 'CTR-first via title-thumbnail fit, then watch-time support through structure.',
    rules
  };
}

function buildYouTubeCompliance(projectName, format, imageInfo) {
  const rules = getYouTubeFormatRules(format);

  if (!rules) {
    throw new Error('Unsupported YouTube format');
  }

  return {
    project: projectName,
    platform: 'youtube',
    format,
    recommended_ratio: rules.recommended_ratio,
    duration_guidance: rules.max_duration_guidance,
    image_available: !!imageInfo,
    public_image_url: imageInfo?.public_url || null,
    compliance_notes: [
      'Keep music and media usage rights-safe.',
      'Do not rely on claimed third-party content for Shorts over one minute.',
      'Use clear thumbnail-title alignment for standard videos.',
      'Avoid misleading claims or deceptive packaging presentation.'
    ],
    publish_status: imageInfo ? 'ready_for_publish' : 'needs_manual_review'
  };
}

function buildYouTubePackage(projectName, format, goal) {
  const paths = getVideoExecutionPaths(projectName);
  const image = getLatestGeneratedImage(projectName);
  const intelligence = buildYouTubeIntelligence(projectName, format, goal);
  const compliance = buildYouTubeCompliance(projectName, format, image);

  const packageId = `ytpkg_${Date.now()}`;
  const packagePath = path.join(paths.youtubeDir, `${packageId}.json`);

  const title = format === 'short'
    ? 'Premium Creative. Real Brand. Real Product.'
    : `${projectName}: Premium Visual Execution for ${goal}`;

  const description = format === 'short'
    ? 'A short-form premium visual built with real brand-controlled assets.'
    : `This video package is designed for ${goal} using approved brand-controlled creative, with emphasis on product credibility, premium presentation, and visual trust.`;

  const pkg = {
    package_id: packageId,
    project: projectName,
    channel: 'youtube',
    format,
    generated_at: new Date().toISOString(),
    goal,
    status: compliance.publish_status,
    reference_image_path: image.path,
    public_image_url: image.public_url,
    title,
    description,
    hook: format === 'short'
      ? 'Here is what premium brand-controlled creative looks like in motion.'
      : 'In this video, discover how premium visual execution changes brand perception.',
    structure: format === 'short'
      ? [
          '0-3s: visual hook',
          '3-10s: product emphasis',
          '10-20s: premium message',
          'end: CTA'
        ]
      : [
          'Intro hook',
          'Problem/value setup',
          'Product/brand presentation',
          'Why it stands out',
          'CTA'
        ],
    thumbnail_brief: 'Use the strongest premium product frame with clean focal contrast and readable title alignment.',
    cta: 'Watch more and explore the collection.',
    intelligence,
    compliance
  };

  executionArtifactWriter.writeJson({
    project: projectName,
    domain: 'channels',
    artifactType: 'youtube_channel_package',
    identifier: packageId,
    legacyPath: packagePath,
    data: pkg
  });
  return pkg;
}

function reviewLatestYouTubePackage(projectName) {
  const youtubeDir = resolveExecutionReadCandidate({
    projectName,
    domain: 'channels',
    relativePath: 'youtube',
    pathType: 'directory',
    matcher: /\.json$/i,
    requestedIdentifier: 'latest-youtube-package',
    requestedFile: 'channels/youtube/*.json'
  }).selectedPath;

  const files = fs.readdirSync(youtubeDir)
    .filter(name => name.endsWith('.json'))
    .sort()
    .reverse();

  if (!files.length) {
    throw new Error('No YouTube packages found');
  }

  return readJsonFile(path.join(youtubeDir, files[0]), {});
}
function getMarketplaceExecutionPaths(projectName) {
  const resolution = unifiedDataPathResolver.resolve(projectName, {
    domain: 'channels',
    operation: 'read'
  });
  const baseDir = path.join(resolution.activeReadPath, 'channels');
  const marketplaceDir = path.join(baseDir, 'marketplace');
  const amazonDir = path.join(marketplaceDir, 'amazon');
  const ebayDir = path.join(marketplaceDir, 'ebay');

  ensureDir(baseDir);
  ensureDir(marketplaceDir);
  ensureDir(amazonDir);
  ensureDir(ebayDir);

  return {
    baseDir,
    marketplaceDir,
    amazonDir,
    ebayDir
  };
}

function getMarketplaceRules(marketplace) {
  const rules = {
    amazon: {
      platform: 'amazon',
      image_main_background: 'white',
      image_main_product_fill: '>=85%',
      image_main_text_overlay_allowed: false,
      image_main_watermark_allowed: false,
      image_main_logo_overlay_allowed: false,
      preferred_formats: ['jpg', 'jpeg', 'png', 'tif', 'gif_non_animated'],
      minimum_images: 1,
      recommended_images: 6,
      listing_style: 'conversion-focused marketplace listing'
    },
    ebay: {
      platform: 'ebay',
      minimum_images: 1,
      recommended_image_longest_side_px: '>=500',
      text_overlay_allowed: false,
      watermark_allowed: false,
      decorative_graphics_allowed: false,
      max_images_common_guidance: 24,
      listing_style: 'clear, trust-oriented marketplace listing'
    }
  };

  return rules[String(marketplace || '').trim().toLowerCase()] || null;
}

function buildMarketplaceIntelligence(projectName, marketplace, goal) {
  const rules = getMarketplaceRules(marketplace);

  if (!rules) {
    throw new Error('Unsupported marketplace');
  }

  return {
    project: projectName,
    marketplace,
    goal,
    trend_direction: 'Use clearer value articulation, real product trust signals, and conversion-oriented structure.',
    competitor_gap: 'Avoid generic wording and weak image discipline. Prioritize clarity, legitimacy, and cleaner listing presentation.',
    audience_fit: marketplace === 'amazon'
      ? 'Target users comparing offers quickly and relying on listing clarity, image trust, and bullet readability.'
      : 'Target users seeking fast clarity, confidence, and realistic product representation.',
    conversion_angle: 'Real product, clean presentation, trustworthy copy, and compliant listing assets.',
    rules
  };
}

function buildAmazonPackage(projectName, goal) {
  const paths = getMarketplaceExecutionPaths(projectName);
  const image = getLatestGeneratedImage(projectName);
  const intelligence = buildMarketplaceIntelligence(projectName, 'amazon', goal);

  const packageId = `amzpkg_${Date.now()}`;
  const packagePath = path.join(paths.amazonDir, `${packageId}.json`);

  const pkg = {
    package_id: packageId,
    project: projectName,
    marketplace: 'amazon',
    generated_at: new Date().toISOString(),
    goal,
    status: 'ready_for_listing_build',
    reference_image_path: image.path,
    public_image_url: image.public_url,
    title: `${projectName} Premium Product Presentation`,
    bullets: [
      'Brand-controlled real-asset presentation',
      'Premium visual consistency',
      'Product-first compliant listing direction',
      'Marketplace-ready structure',
      'Built for clarity and trust'
    ],
    description: `This Amazon package is built for ${goal} using approved real assets and a conversion-oriented marketplace structure.`,
    keywords: [
      projectName,
      'premium product',
      'marketplace ready',
      'brand safe',
      'real product presentation'
    ],
    intelligence,
    compliance: {
      marketplace: 'amazon',
      main_image_rules: {
        white_background_required: true,
        product_fill_requirement: '>=85%',
        text_overlay_allowed: false,
        logo_overlay_allowed: false,
        watermark_allowed: false
      },
      preferred_formats: intelligence.rules.preferred_formats,
      listing_status: 'ready_for_listing_build',
      notes: [
        'Main image should show only the product on white background.',
        'Use no text overlays or decorative graphics on main image.',
        'Use real product representation only.'
      ]
    }
  };

  executionArtifactWriter.writeJson({
    project: projectName,
    domain: 'channels',
    artifactType: 'amazon_channel_package',
    identifier: packageId,
    legacyPath: packagePath,
    data: pkg
  });
  return pkg;
}

function buildEbayPackage(projectName, goal) {
  const paths = getMarketplaceExecutionPaths(projectName);
  const image = getLatestGeneratedImage(projectName);
  const intelligence = buildMarketplaceIntelligence(projectName, 'ebay', goal);

  const packageId = `ebaypkg_${Date.now()}`;
  const packagePath = path.join(paths.ebayDir, `${packageId}.json`);

  const pkg = {
    package_id: packageId,
    project: projectName,
    marketplace: 'ebay',
    generated_at: new Date().toISOString(),
    goal,
    status: 'ready_for_listing_build',
    reference_image_path: image.path,
    public_image_url: image.public_url,
    title: `${projectName} Premium Listing Package`,
    selling_points: [
      'Real product presentation',
      'Clear premium brand identity',
      'Marketplace-safe image guidance',
      'Trust-first listing structure'
    ],
    description: `This eBay package is built for ${goal} using approved brand-controlled assets and a trust-oriented listing structure.`,
    intelligence,
    compliance: {
      marketplace: 'ebay',
      image_rules: {
        minimum_images: 1,
        minimum_longest_side_px: '>=500',
        text_overlay_allowed: false,
        watermark_allowed: false,
        decorative_graphics_allowed: false
      },
      listing_status: 'ready_for_listing_build',
      notes: [
        'Images must accurately represent the product.',
        'Avoid text overlays, watermarks, or decorative artwork.',
        'Use clean realistic product imagery.'
      ]
    }
  };

  executionArtifactWriter.writeJson({
    project: projectName,
    domain: 'channels',
    artifactType: 'ebay_channel_package',
    identifier: packageId,
    legacyPath: packagePath,
    data: pkg
  });
  return pkg;
}

function buildMarketplacePackage(projectName, marketplace, goal) {
  if (marketplace === 'amazon') {
    return buildAmazonPackage(projectName, goal);
  }

  if (marketplace === 'ebay') {
    return buildEbayPackage(projectName, goal);
  }

  throw new Error('Unsupported marketplace');
}

function reviewLatestMarketplacePackage(projectName, marketplace) {
  const dir =
    marketplace === 'amazon'
      ? resolveExecutionReadCandidate({
          projectName,
          domain: 'channels',
          relativePath: path.join('marketplace', 'amazon'),
          pathType: 'directory',
          matcher: /\.json$/i,
          requestedIdentifier: 'latest-marketplace-amazon-package',
          requestedFile: 'channels/marketplace/amazon/*.json'
        }).selectedPath
      : marketplace === 'ebay'
      ? resolveExecutionReadCandidate({
          projectName,
          domain: 'channels',
          relativePath: path.join('marketplace', 'ebay'),
          pathType: 'directory',
          matcher: /\.json$/i,
          requestedIdentifier: 'latest-marketplace-ebay-package',
          requestedFile: 'channels/marketplace/ebay/*.json'
        }).selectedPath
      : null;

  if (!dir) {
    throw new Error('Unsupported marketplace');
  }

  const files = fs.readdirSync(dir)
    .filter(name => name.endsWith('.json'))
    .sort()
    .reverse();

  if (!files.length) {
    throw new Error(`No ${marketplace} packages found`);
  }

  return readJsonFile(path.join(dir, files[0]), {});
}
function getGermanLaunchPaths(projectName) {
  const safeProject = String(projectName || '').trim().toLowerCase();
  const resolution = unifiedDataPathResolver.resolve(safeProject, {
    domain: 'german-launch',
    operation: 'read'
  });
  const baseDir = resolveExecutionReadCandidate({
    projectName: safeProject,
    domain: 'german-launch',
    relativePath: '',
    pathType: 'directory',
    requestedIdentifier: 'german-launch-root',
    requestedFile: 'german-launch'
  }).selectedPath;
  const legacyBaseDir = path.join(resolution.legacyRoot, 'german-launch');

  const planDir = path.join(baseDir, 'plan');
  const wavesDir = path.join(baseDir, 'waves');
  const legacyPlanDir = path.join(legacyBaseDir, 'plan');
  const legacyWavesDir = path.join(legacyBaseDir, 'waves');

  ensureDir(baseDir);
  ensureDir(planDir);
  ensureDir(wavesDir);
  ensureDir(legacyBaseDir);
  ensureDir(legacyPlanDir);
  ensureDir(legacyWavesDir);

  return {
    baseDir,
    planDir,
    wavesDir,
    legacyBaseDir,
    legacyPlanDir,
    legacyWavesDir
  };
}

function normalizeLaunchProductText(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getLaunchProductStableKey(product) {
  const id = String(product?.product_id || product?.id || '').trim().toLowerCase();
  if (id) return `id:${id}`;

  const slug = String(product?.product_slug || product?.slug || '').trim().toLowerCase();
  if (slug) return `slug:${slug}`;

  return '';
}

function productMatchesLaunchTheme(product, themes = []) {
  const normalizedThemes = themes
    .map((theme) => normalizeLaunchProductText(theme))
    .filter(Boolean);

  if (!normalizedThemes.length) {
    return true;
  }

  const category = normalizeLaunchProductText(product?.category);
  const productType = normalizeLaunchProductText(product?.marketing_intelligence?.product_type);
  const haystack = `${category} ${productType}`.trim();
  const tokens = new Set(haystack.split(' ').filter(Boolean));

  return normalizedThemes.some((theme) => {
    if (category === theme || productType === theme) return true;
    if (tokens.has(theme)) return true;
    return haystack.includes(theme);
  });
}

function selectLaunchReadyProducts(products, projectName, context = 'launch') {
  if (!Array.isArray(products)) {
    appLogger.warn('launch_products_invalid', {
      route: '/telegram-command',
      action: context,
      project: normalizeOptionalProjectSlug(projectName),
      received_type: typeof products
    });
    return [];
  }

  const seen = new Set();
  const launchReadyProducts = [];

  for (const product of products) {
    if (!product || typeof product !== 'object') {
      continue;
    }

    const status = String(product.status || '').trim().toLowerCase();
    const slug = String(product.product_slug || product.slug || '').trim();
    const name = String(product.product_name || product.name || '').trim();
    const stableKey = getLaunchProductStableKey(product);

    if (status !== 'publish' || !slug || !name || !stableKey) {
      continue;
    }

    const lowerName = name.toLowerCase();
    if (name.includes('(Copy)') || name.includes('[DRAFT') || lowerName.includes('clone')) {
      continue;
    }

    if (seen.has(stableKey)) {
      continue;
    }

    seen.add(stableKey);
    launchReadyProducts.push(product);
  }

  if (!launchReadyProducts.length) {
    appLogger.warn('launch_ready_products_empty', {
      route: '/telegram-command',
      action: context,
      project: normalizeOptionalProjectSlug(projectName)
    });
  }

  return launchReadyProducts;
}

function buildGermanLaunchPlan(projectName) {
  const productPaths = getProductIntelligencePaths(projectName);
  const products = readJsonFile(productPaths.productsPath, []);
  const launchReadyProducts = selectLaunchReadyProducts(products, projectName, 'build_german_launch_plan');
  const heroProducts = launchReadyProducts.slice(0, 3);
  const supportProducts = launchReadyProducts.slice(3, 10);

  const plan = {
    project: projectName,
    generated_at: new Date().toISOString(),
    launch_goals: [
      'brand awareness in German market',
      'initial product validation',
      'early sales conversion'
    ],
    launch_priorities: {
      hero_products: heroProducts.map(p => ({
        product_slug: p.product_slug,
        product_name: p.product_name,
        category: p.category
      })),
      support_products: supportProducts.map(p => ({
        product_slug: p.product_slug,
        product_name: p.product_name,
        category: p.category
      }))
    },
    product_selection: {
      published_count: launchReadyProducts.length,
      hero_count: heroProducts.length,
      support_count: supportProducts.length,
      validation_status: launchReadyProducts.length ? 'ready' : 'no_launch_ready_products'
    },
    channel_mix: [
      'instagram',
      'facebook',
      'tiktok',
      'email',
      'amazon',
      'ebay'
    ],
    content_cadence: {
      instagram: 'daily',
      tiktok: 'daily',
      facebook: '3x_per_week',
      email: '1x_per_week',
      amazon: 'listing_optimization',
      ebay: 'listing_optimization'
    },
    audience_mapping: [
      'men grooming',
      'barbers',
      'premium lifestyle buyers',
      'gift buyers',
      'resellers'
    ],
    offer_logic: [
      'launch discount',
      'bundle offers',
      'limited-time campaign'
    ]
  };

  const paths = getGermanLaunchPaths(projectName);
  const filePath = path.join(paths.legacyPlanDir, 'launch-plan.json');

  executionArtifactWriter.writeJson({
    project: projectName,
    domain: 'german-launch',
    artifactType: 'german_launch_plan',
    identifier: 'launch-plan',
    legacyPath: filePath,
    data: plan
  });

  return {
    ...plan,
    file_path: filePath
  };
}

function readGermanLaunchPlan(projectName) {
  const paths = getGermanLaunchPaths(projectName);
  const filePath = path.join(paths.planDir, 'launch-plan.json');

  if (!fs.existsSync(filePath)) {
    throw new Error('German launch plan not found');
  }

  return {
    ...readJsonFile(filePath, {}),
    file_path: filePath
  };
}

function buildLaunchWave(projectName, waveName) {
  const productPaths = getProductIntelligencePaths(projectName);
  const products = readJsonFile(productPaths.productsPath, []);

  const safeWaveName = String(waveName || '').toLowerCase();
  let launchReadyProducts = selectLaunchReadyProducts(products, projectName, 'build_launch_wave');

  if (safeWaveName.includes('beard')) {
    launchReadyProducts = launchReadyProducts.filter((p) => productMatchesLaunchTheme(p, ['beard']));
  }

  if (safeWaveName.includes('hair')) {
    launchReadyProducts = launchReadyProducts.filter((p) => productMatchesLaunchTheme(p, ['hair']));
  }

  if (safeWaveName.includes('skin') || safeWaveName.includes('face')) {
    launchReadyProducts = launchReadyProducts.filter((p) => productMatchesLaunchTheme(p, ['skin', 'face']));
  }

  const selectedProducts = launchReadyProducts.slice(0, 5).map(p => ({
    product_id: p.product_id || null,
    product_slug: p.product_slug || null,
    product_name: p.product_name || null,
    category: p.category || null,
    status: p.status || null,
    permalink: p.permalink || null,
    marketing_intelligence: p.marketing_intelligence || {},
    creative_map: p.creative_map || {},
    prompt_pack: p.prompt_pack || {},
    channel_pack: p.channel_pack || {}
  }));

  const wave = {
    project: projectName,
    wave_name: waveName,
    generated_at: new Date().toISOString(),
    campaign_type: 'launch',
    goals: ['awareness', 'engagement', 'conversion'],
    channels: ['instagram', 'tiktok', 'facebook', 'email'],
    total_products: selectedProducts.length,
    products: selectedProducts
  };

  const paths = getGermanLaunchPaths(projectName);
  const filePath = path.join(
    paths.legacyWavesDir,
    `${waveName.replace(/[^a-z0-9_-]/gi, '_').toLowerCase()}.json`
  );

  executionArtifactWriter.writeJson({
    project: projectName,
    domain: 'german-launch',
    artifactType: 'german_launch_wave',
    identifier: waveName,
    legacyPath: filePath,
    data: wave
  });

  return {
    ...wave,
    file_path: filePath
  };
}

function readLaunchWave(projectName, waveName) {
  const paths = getGermanLaunchPaths(projectName);
  const filePath = path.join(
    paths.wavesDir,
    `${waveName.replace(/[^a-z0-9_-]/gi, '_').toLowerCase()}.json`
  );

  if (!fs.existsSync(filePath)) {
    throw new Error('Launch wave not found');
  }

  return {
    ...readJsonFile(filePath, {}),
    file_path: filePath
  };
}
function getLaunchOpsPaths(projectName) {
  const safeProject = String(projectName || '').trim().toLowerCase();
  const resolution = unifiedDataPathResolver.resolve(safeProject, {
    domain: 'publishing',
    operation: 'read'
  });
  const baseDir = resolveExecutionReadCandidate({
    projectName: safeProject,
    domain: 'publishing',
    relativePath: '',
    pathType: 'directory',
    requestedIdentifier: 'publishing-root',
    requestedFile: 'publishing'
  }).selectedPath;
  const legacyBaseDir = path.join(resolution.legacyRoot, 'launch-ops');
  const connectorsDir = path.join(baseDir, 'connectors');
  const schedulerDir = path.join(baseDir, 'scheduler');
  const legacyConnectorsDir = path.join(legacyBaseDir, 'connectors');
  const legacySchedulerDir = path.join(legacyBaseDir, 'scheduler');

  ensureDir(baseDir);
  ensureDir(connectorsDir);
  ensureDir(schedulerDir);
  ensureDir(legacyBaseDir);
  ensureDir(legacyConnectorsDir);
  ensureDir(legacySchedulerDir);

  return {
    baseDir,
    connectorsDir,
    schedulerDir,
    legacyBaseDir,
    legacyConnectorsDir,
    legacySchedulerDir
  };
}

function buildChannelConnectorPayload(projectName, waveName, channel) {
  const wave = readLaunchWave(projectName, waveName);
  const normalizedChannel = String(channel || '').toLowerCase();
  const paths = getLaunchOpsPaths(projectName);

  const payload = {
    project: projectName,
    wave_name: waveName,
    channel: normalizedChannel,
    generated_at: new Date().toISOString(),
    total_products: Array.isArray(wave.products) ? wave.products.length : 0,
    assets: []
  };

  for (const product of wave.products || []) {
    const channelPack = product.channel_pack || {};
    const asset = channelPack[normalizedChannel] || null;

    if (!asset) continue;

    payload.assets.push({
      product_id: product.product_id || null,
      product_slug: product.product_slug || null,
      product_name: product.product_name || null,
      category: product.category || null,
      channel_asset: asset
    });
  }

  const filePath = path.join(
    paths.legacyConnectorsDir,
    `${waveName.replace(/[^a-z0-9_-]/gi, '_').toLowerCase()}_${normalizedChannel}.json`
  );

  executionArtifactWriter.writeJson({
    project: projectName,
    domain: 'publishing',
    artifactType: 'publishing_connector_payload',
    identifier: `${waveName}_${normalizedChannel}`,
    legacyPath: filePath,
    data: payload
  });

  return {
    ...payload,
    file_path: filePath
  };
}

function scheduleLaunchJob(projectName, waveName, channel, scheduledFor) {
  assertPublishingMutationAllowed(projectName, 'schedule', {
    status: 'scheduled'
  });
  const payload = buildChannelConnectorPayload(projectName, waveName, channel);
  const paths = getLaunchOpsPaths(projectName);

  const jobId = `sched_${Date.now()}`;
  const job = {
    job_id: jobId,
    project: projectName,
    wave_name: waveName,
    channel: channel,
    scheduled_for: scheduledFor,
    created_at: new Date().toISOString(),
    status: 'scheduled',
    total_assets: payload.assets.length,
    connector_file: payload.file_path
  };

  const filePath = path.join(paths.legacySchedulerDir, `${jobId}.json`);
  executionArtifactWriter.writeJson({
    project: projectName,
    domain: 'publishing',
    artifactType: 'publishing_scheduler_job',
    identifier: jobId,
    legacyPath: filePath,
    data: job
  });

  return {
    ...job,
    file_path: filePath
  };
}

function normalizePublishingJobStatus(value, fallback = 'draft') {
  const normalized = String(value || '').trim().toLowerCase();

  if (!normalized) return fallback;
  if (normalized === 'draft') return 'draft';
  if (['queued', 'queue', 'scheduled', 'pending', 'pending_publish'].includes(normalized)) return 'scheduled';
  if (
    [
      'ready',
      'ready_for_manual_publish',
      'ready_for_manual_send',
      'ready_for_manual_handoff',
      'ready_for_manual_review',
      'manual_publish',
      'manual_send',
      'manual_review'
    ].includes(normalized)
  ) {
    return 'ready';
  }
  if (['published', 'completed', 'complete', 'success', 'done', 'sent', 'live'].includes(normalized)) {
    return 'published';
  }
  if (['failed', 'error', 'blocked', 'rejected'].includes(normalized)) return 'failed';

  return fallback;
}

function normalizePublishingNotes(value) {
  if (Array.isArray(value)) {
    return Array.from(
      new Set(
        value
          .map(item => String(item || '').trim())
          .filter(Boolean)
      )
    );
  }

  if (typeof value === 'string') {
    return Array.from(
      new Set(
        value
          .split(/\n+/)
          .map(item => item.trim())
          .filter(Boolean)
      )
    );
  }

  return [];
}

function buildPublishingDisplayTitle(title, waveName, channel) {
  const safeTitle = String(title || '').trim();
  if (safeTitle) return safeTitle;

  const safeWave = String(waveName || '').trim();
  const safeChannel = String(channel || '').trim();

  if (safeWave && safeChannel) {
    return `${safeWave} ${safeChannel}`;
  }

  if (safeWave) return safeWave;
  if (safeChannel) return `${safeChannel} publish`;
  return 'Publishing item';
}

function buildPublishingPreviewBase(input = {}, existingPreview = null) {
  const base = existingPreview && typeof existingPreview === 'object' ? existingPreview : {};
  const channel = String(input.channel || base.channel || '').trim().toLowerCase();
  const title = buildPublishingDisplayTitle(input.title || base.title, input.wave_name || base.wave_name, channel);
  const notes = normalizePublishingNotes(input.notes != null ? input.notes : base.notes);
  const offer = String(input.offer || base.offer || '').trim();
  const body =
    String(input.body || input.caption || base.body || base.caption || '').trim() ||
    offer ||
    notes[0] ||
    '';

  return {
    preview_type:
      channel === 'email'
        ? 'email'
        : ['instagram', 'facebook', 'tiktok', 'youtube'].includes(channel)
          ? 'social'
          : 'listing',
    channel,
    title,
    headline: String(input.headline || base.headline || title).trim(),
    body,
    caption: String(input.caption || base.caption || body).trim(),
    subject: String(input.subject || base.subject || title).trim(),
    cta: String(input.cta || base.cta || (channel === 'email' ? 'Review email' : 'Shop now')).trim(),
    offer,
    format: String(input.format || base.format || '').trim(),
    goal: String(input.goal || base.goal || '').trim(),
    visual_prompt: String(input.visual_prompt || base.visual_prompt || '').trim(),
    primary_product_name: String(input.primary_product_name || base.primary_product_name || '').trim(),
    primary_product_slug: String(input.primary_product_slug || base.primary_product_slug || '').trim(),
    asset_count: Number(input.total_assets || base.asset_count || 0) || 0,
    asset_preview_items: Array.isArray(base.asset_preview_items) ? base.asset_preview_items.slice(0, 3) : [],
    notes
  };
}

function buildPublishingPreviewFromConnectorPayload(payload, input = {}) {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const assets = Array.isArray(payload.assets) ? payload.assets : [];
  const primary = assets[0] || {};
  const channelAsset = primary.channel_asset || {};
  const preview = buildPublishingPreviewBase(
    {
      channel: input.channel || payload.channel,
      title: input.title || payload.wave_name,
      wave_name: input.wave_name || payload.wave_name,
      caption: channelAsset.caption || channelAsset.body || '',
      body: channelAsset.body || channelAsset.caption || '',
      subject: channelAsset.subject || '',
      headline: channelAsset.headline || primary.product_name || payload.wave_name || '',
      cta: channelAsset.cta || '',
      format: channelAsset.format || '',
      goal: channelAsset.goal || '',
      visual_prompt: channelAsset.visual_prompt || '',
      primary_product_name: primary.product_name || '',
      primary_product_slug: primary.product_slug || '',
      total_assets: assets.length,
      offer: input.offer || ''
    },
    input.preview || null
  );

  preview.asset_preview_items = assets.slice(0, 3).map(item => ({
    product_name: item.product_name || '',
    product_slug: item.product_slug || '',
    category: item.category || '',
    caption: item.channel_asset?.caption || '',
    format: item.channel_asset?.format || '',
    goal: item.channel_asset?.goal || ''
  }));

  return preview;
}

function getPublishingJobFilePath(projectName, jobId) {
  const paths = getLaunchOpsPaths(projectName);
  return path.join(paths.legacySchedulerDir, `${String(jobId || '').trim()}.json`);
}

function hydrateScheduledJobRecord(projectName, job) {
  const rawJob = job && typeof job === 'object' ? { ...job } : {};
  const normalizedChannel = String(rawJob.channel || '').trim().toLowerCase();
  let connectorPreview =
    rawJob.connector_preview && typeof rawJob.connector_preview === 'object'
      ? rawJob.connector_preview
      : null;

  if (!connectorPreview && rawJob.connector_file && fs.existsSync(rawJob.connector_file)) {
    const connectorPayload = readJsonFile(rawJob.connector_file, {});
    connectorPreview = buildPublishingPreviewFromConnectorPayload(connectorPayload, rawJob);
  }

  const preview = buildPublishingPreviewBase(
    {
      ...connectorPreview,
      ...rawJob,
      channel: normalizedChannel,
      title: buildPublishingDisplayTitle(rawJob.title, rawJob.wave_name, normalizedChannel)
    },
    connectorPreview
  );

  return {
    ...rawJob,
    project: projectName,
    job_id: String(rawJob.job_id || '').trim(),
    title: buildPublishingDisplayTitle(rawJob.title, rawJob.wave_name, normalizedChannel),
    wave_name: String(rawJob.wave_name || '').trim(),
    channel: normalizedChannel,
    scheduled_for: String(rawJob.scheduled_for || '').trim(),
    created_at: rawJob.created_at || new Date().toISOString(),
    updated_at: rawJob.updated_at || rawJob.created_at || new Date().toISOString(),
    status: normalizePublishingJobStatus(
      rawJob.status,
      rawJob.scheduled_for ? 'scheduled' : 'draft'
    ),
    total_assets: Number(rawJob.total_assets || connectorPreview?.asset_count || 0) || 0,
    connector_file: rawJob.connector_file || null,
    connector_error: rawJob.connector_error || null,
    mode: String(rawJob.mode || readExecutionMode(projectName).mode || 'semi_auto').trim(),
    offer: String(rawJob.offer || '').trim(),
    notes: normalizePublishingNotes(rawJob.notes),
    connector_preview: connectorPreview,
    preview
  };
}

function saveScheduledJobRecord(projectName, job) {
  const hydrated = hydrateScheduledJobRecord(projectName, job);
  const filePath = getPublishingJobFilePath(projectName, hydrated.job_id);
  const payload = { ...hydrated };
  delete payload.file_path;

  executionArtifactWriter.writeJson({
    project: projectName,
    domain: 'publishing',
    artifactType: 'publishing_scheduler_job',
    identifier: hydrated.job_id,
    legacyPath: filePath,
    data: payload
  });
  syncPublishingJob(projectName, payload);

  return {
    ...payload,
    file_path: filePath
  };
}

function tryBuildPublishingConnector(projectName, waveName, channel, input = {}) {
  const safeWave = String(waveName || '').trim();
  const safeChannel = String(channel || '').trim().toLowerCase();

  if (!safeWave || !safeChannel) {
    return {
      connector_file: null,
      connector_preview: null,
      total_assets: 0,
      connector_error: null
    };
  }

  try {
    const payload = buildChannelConnectorPayload(projectName, safeWave, safeChannel);
    return {
      connector_file: payload.file_path,
      connector_preview: buildPublishingPreviewFromConnectorPayload(payload, input),
      total_assets: Array.isArray(payload.assets) ? payload.assets.length : 0,
      connector_error: null
    };
  } catch (error) {
    return {
      connector_file: null,
      connector_preview: null,
      total_assets: 0,
      connector_error: error.message || 'Connector payload unavailable'
    };
  }
}

function upsertScheduledJob(projectName, input = {}, options = {}) {
  const safeProject = String(projectName || '').trim().toLowerCase();
  const requestedJobId = String(input.job_id || '').trim().replace(/[^a-z0-9_-]/gi, '');
  const createIfMissing = options.createIfMissing !== false;
  const existingFilePath = requestedJobId ? getPublishingJobFilePath(safeProject, requestedJobId) : '';
  const hasExisting = requestedJobId && fs.existsSync(existingFilePath);

  if (requestedJobId && !hasExisting && !createIfMissing) {
    throw new Error('Scheduled job not found');
  }

  const existing = hasExisting ? readJsonFile(existingFilePath, {}) : {};
  const channel = String(input.channel || existing.channel || '').trim().toLowerCase();

  if (!channel) {
    throw new Error('Missing channel');
  }

  const scheduledForInput =
    input.scheduled_for !== undefined
      ? String(input.scheduled_for || '').trim()
      : String(existing.scheduled_for || '').trim();

  let scheduledFor = '';
  if (scheduledForInput) {
    const parsed = new Date(scheduledForInput);
    if (Number.isNaN(parsed.getTime())) {
      throw new Error('Invalid scheduled_for value');
    }
    scheduledFor = parsed.toISOString();
  }

  const waveName = String(input.wave_name || existing.wave_name || '').trim();
  const title = buildPublishingDisplayTitle(input.title || existing.title, waveName, channel);
  const notes = normalizePublishingNotes(
    input.notes !== undefined ? input.notes : existing.notes
  );
  const connectorInfo = tryBuildPublishingConnector(safeProject, waveName, channel, {
    ...input,
    title,
    notes,
    offer: input.offer || existing.offer || ''
  });
  const preview = buildPublishingPreviewBase(
    {
      ...(existing.preview || {}),
      ...(connectorInfo.connector_preview || {}),
      ...(input.preview && typeof input.preview === 'object' ? input.preview : {}),
      title,
      wave_name: waveName,
      channel,
      offer: input.offer || existing.offer || '',
      notes
    },
    connectorInfo.connector_preview || existing.preview || existing.connector_preview || null
  );
  const now = new Date().toISOString();
  const jobId = hasExisting ? existing.job_id : (requestedJobId || `sched_${Date.now()}`);
  const fallbackStatus = scheduledFor ? 'scheduled' : 'draft';

  return saveScheduledJobRecord(safeProject, {
    ...existing,
    job_id: jobId,
    project: safeProject,
    title,
    wave_name: waveName,
    channel,
    scheduled_for: scheduledFor,
    created_at: existing.created_at || now,
    updated_at: now,
    status: normalizePublishingJobStatus(input.status, existing.status || fallbackStatus),
    total_assets: connectorInfo.total_assets || existing.total_assets || preview.asset_count || 0,
    connector_file: connectorInfo.connector_file || existing.connector_file || null,
    connector_preview: connectorInfo.connector_preview || existing.connector_preview || preview,
    connector_error: connectorInfo.connector_error || existing.connector_error || null,
    mode: String(input.mode || existing.mode || readExecutionMode(safeProject).mode || 'semi_auto').trim(),
    offer: String(input.offer || existing.offer || '').trim(),
    notes,
    preview
  });
}

function reviewScheduledJobs(projectName) {
  const schedulerDir = resolveExecutionReadCandidate({
    projectName,
    domain: 'publishing',
    relativePath: 'scheduler',
    pathType: 'directory',
    matcher: /\.json$/i,
    requestedIdentifier: 'scheduled-jobs-list',
    requestedFile: 'publishing/scheduler/*.json'
  }).selectedPath;

  const files = fs.readdirSync(schedulerDir)
    .filter(name => name.endsWith('.json'))
    .sort();

  return files.map(name => {
    const filePath = path.join(schedulerDir, name);
    return hydrateScheduledJobRecord(projectName, readJsonFile(filePath, {}));
  }).sort((a, b) => {
    const aTime = new Date(a.updated_at || a.created_at || 0).getTime();
    const bTime = new Date(b.updated_at || b.created_at || 0).getTime();
    return bTime - aTime;
  });
}

function updateScheduledJobRecord(projectName, jobId, updates = {}) {
  return upsertScheduledJob(projectName, {
    ...updates,
    job_id: jobId
  }, {
    createIfMissing: false
  });
}

function updateScheduledJobStatus(projectName, jobId, status) {
  assertPublishingMutationAllowed(projectName, 'reschedule', {
    jobId,
    status
  });
  return updateScheduledJobRecord(projectName, jobId, {
    status
  });
}
function getOptimizationPaths(projectName) {
  const safeProject = String(projectName || '').trim().toLowerCase();
  const resolution = unifiedDataPathResolver.resolve(safeProject, {
    domain: 'optimization',
    operation: 'read'
  });
  const baseDir = resolveExecutionReadCandidate({
    projectName: safeProject,
    domain: 'optimization',
    relativePath: '',
    pathType: 'directory',
    requestedIdentifier: 'optimization-root',
    requestedFile: 'optimization'
  }).selectedPath;
  const legacyBaseDir = path.join(resolution.legacyRoot, 'optimization');

  const reviewsDir = path.join(baseDir, 'reviews');
  const improvementsDir = path.join(baseDir, 'improvements');
  const performanceDir = path.join(baseDir, 'performance');
  const legacyReviewsDir = path.join(legacyBaseDir, 'reviews');
  const legacyImprovementsDir = path.join(legacyBaseDir, 'improvements');
  const legacyPerformanceDir = path.join(legacyBaseDir, 'performance');

  ensureDir(baseDir);
  ensureDir(reviewsDir);
  ensureDir(improvementsDir);
  ensureDir(performanceDir);
  ensureDir(legacyBaseDir);
  ensureDir(legacyReviewsDir);
  ensureDir(legacyImprovementsDir);
  ensureDir(legacyPerformanceDir);

  return {
    baseDir,
    reviewsDir,
    improvementsDir,
    performanceDir,
    legacyBaseDir,
    legacyReviewsDir,
    legacyImprovementsDir,
    legacyPerformanceDir
  };
}

function getProductBySlug(projectName, productSlug) {
  const paths = getProductIntelligencePaths(projectName);
  const products = readJsonFile(paths.productsPath, []);

  const product = products.find(
    p => String(p.product_slug || '').toLowerCase() === String(productSlug || '').toLowerCase()
  );

  if (!product) {
    throw new Error('Product not found in intelligence registry');
  }

  return product;
}

function getChannelAssetForProduct(product, channel) {
  const normalizedChannel = String(channel || '').toLowerCase();
  const channelPack = product.channel_pack || {};
  return channelPack[normalizedChannel] || null;
}

function buildPostReview(projectName, channel, productSlug) {
  const product = getProductBySlug(projectName, productSlug);
  const asset = getChannelAssetForProduct(product, channel);

  if (!asset) {
    throw new Error('Channel asset not found for product');
  }

  const text = [
    asset.caption || '',
    asset.headline || '',
    asset.body || '',
    asset.subject || ''
  ].join(' ');

  let score = 80;
  const issues = [];
  const recommendations = [];

  if (/pflege|styling|shine/i.test(text) && /discover the collection|discover the difference/i.test(text)) {
    issues.push('mixed language detected');
    recommendations.push('rewrite copy in natural German for German-market publishing');
    score -= 8;
  }

  if (!/jetzt|entdecken|shop|kaufen|mehr erfahren/i.test(text)) {
    issues.push('cta could be stronger');
    recommendations.push('use a clearer and more direct CTA');
    score -= 5;
  }

  if ((asset.caption || '').length > 220 && ['instagram', 'facebook'].includes(String(channel).toLowerCase())) {
    issues.push('caption may be too long for fast social consumption');
    recommendations.push('tighten the first line and move detail lower');
    score -= 4;
  }

  const review = {
    project: projectName,
    channel: String(channel || '').toLowerCase(),
    product_slug: productSlug,
    reviewed_at: new Date().toISOString(),
    score: Math.max(score, 1),
    hook_strength: score >= 85 ? 'strong' : score >= 70 ? 'medium' : 'weak',
    cta_strength: /jetzt|shop|kaufen|discover|entdecken/i.test(text) ? 'medium' : 'weak',
    brand_fit: 'strong',
    channel_fit: 'strong',
    german_market_fit: issues.includes('mixed language detected') ? 'needs_improvement' : 'good',
    issues,
    recommendations,
    asset_snapshot: asset
  };

  const paths = getOptimizationPaths(projectName);
  const filePath = path.join(
    paths.legacyReviewsDir,
    `${String(channel).toLowerCase()}_${productSlug}.json`
  );

  executionArtifactWriter.writeJson({
    project: projectName,
    domain: 'optimization',
    artifactType: 'optimization_review',
    identifier: `${String(channel).toLowerCase()}_${productSlug}`,
    legacyPath: filePath,
    data: review
  });

  return {
    ...review,
    file_path: filePath
  };
}

function buildImprovedChannelPost(projectName, channel, productSlug) {
  const product = getProductBySlug(projectName, productSlug);
  const asset = getChannelAssetForProduct(product, channel);

  if (!asset) {
    throw new Error('Channel asset not found for product');
  }

  const benefits = (product.marketing_intelligence?.benefits || []).join(', ');
  const productName = product.product_name || productSlug;
  const normalizedChannel = String(channel || '').toLowerCase();

  let improved = { ...asset };

  if (normalizedChannel === 'instagram' || normalizedChannel === 'facebook') {
    const brandHashtag = buildProjectHashtag(projectName);
    improved.caption =
      `${productName} fuer eine gepflegte, starke Bart-Routine.\n\n` +
      `Highlights: ${benefits || 'Pflege und Performance'}.\n\n` +
      `Jetzt entdecken.\n\n${brandHashtag} #bartpflege #maennerpflege`;
  }

  if (normalizedChannel === 'email') {
    improved.subject = `${productName} jetzt entdecken`;
    improved.headline = `${productName} fuer Pflege, Stil und Wirkung`;
    improved.body =
      `${productName} unterstuetzt eine starke Grooming-Routine mit klarem Nutzen und echter Produktpraesenz.`;
    improved.cta = 'Jetzt entdecken';
  }

  if (normalizedChannel === 'tiktok' || normalizedChannel === 'youtube') {
    improved.hook_3s = `${productName}: starke Bartpflege in Sekunden erklaert.`;
  }

  const result = {
    project: projectName,
    channel: normalizedChannel,
    product_slug: productSlug,
    improved_at: new Date().toISOString(),
    original_asset: asset,
    improved_asset: improved
  };

  const paths = getOptimizationPaths(projectName);
  const filePath = path.join(
    paths.legacyImprovementsDir,
    `${normalizedChannel}_${productSlug}.json`
  );

  executionArtifactWriter.writeJson({
    project: projectName,
    domain: 'optimization',
    artifactType: 'optimization_improvement',
    identifier: `${normalizedChannel}_${productSlug}`,
    legacyPath: filePath,
    data: result
  });
  syncPublishingJob(safeProject, job, result);

  return {
    ...result,
    file_path: filePath
  };
}

function savePostPerformance(projectName, channel, productSlug, metricJson) {
  let metrics = {};

  try {
    metrics = JSON.parse(metricJson);
  } catch (error) {
    throw new Error('metric_json must be valid JSON');
  }

  const normalizedChannel = String(channel || '').toLowerCase();
  const paths = getOptimizationPaths(projectName);
  const filePath = path.join(
    paths.legacyPerformanceDir,
    `${normalizedChannel}_${productSlug}.json`
  );

  let history = [];
  if (fs.existsSync(filePath)) {
    history = readJsonFile(filePath, []);
    if (!Array.isArray(history)) history = [];
  }

  const record = {
    recorded_at: new Date().toISOString(),
    channel: normalizedChannel,
    product_slug: productSlug,
    metrics
  };

  history.push(record);
  executionArtifactWriter.writeJson({
    project: projectName,
    domain: 'optimization',
    artifactType: 'optimization_performance_history',
    identifier: `${normalizedChannel}_${productSlug}`,
    legacyPath: filePath,
    data: history
  });

  return {
    project: projectName,
    channel: normalizedChannel,
    product_slug: productSlug,
    total_records: history.length,
    latest: record,
    file_path: filePath
  };
}

function reviewProductPerformance(projectName, productSlug) {
  const paths = getOptimizationPaths(projectName);
  const files = fs.readdirSync(paths.performanceDir)
    .filter(name => name.endsWith(`_${productSlug}.json`));

  const result = {
    project: projectName,
    product_slug: productSlug,
    channels: []
  };

  for (const name of files) {
    const filePath = path.join(paths.performanceDir, name);
    const history = readJsonFile(filePath, []);
    const latest = Array.isArray(history) && history.length ? history[history.length - 1] : null;

    result.channels.push({
      file: name,
      total_records: Array.isArray(history) ? history.length : 0,
      latest
    });
  }

  return result;
}

function reviewChannelLearning(projectName, channel) {
  const normalizedChannel = String(channel || '').toLowerCase();
  const paths = getOptimizationPaths(projectName);

  const files = fs.readdirSync(paths.performanceDir)
    .filter(name => name.startsWith(`${normalizedChannel}_`) && name.endsWith('.json'));

  let totalRecords = 0;
  const products = [];

  for (const name of files) {
    const filePath = path.join(paths.performanceDir, name);
    const history = readJsonFile(filePath, []);
    const latest = Array.isArray(history) && history.length ? history[history.length - 1] : null;
    totalRecords += Array.isArray(history) ? history.length : 0;

    products.push({
      file: name,
      latest
    });
  }

  return {
    project: projectName,
    channel: normalizedChannel,
    total_products_tracked: products.length,
    total_records: totalRecords,
    learning_summary: {
      recommendation: 'Prioritize posts with higher saves, clicks, CTR, and conversions. Reduce weak CTA variants.',
      note: 'This layer becomes smarter as more real performance records are stored.'
    },
    products
  };
}
function getDocsPaths() {
  const baseDir = path.join(BASE_DIR, 'docs');

  return {
    baseDir,
    systemDir: path.join(baseDir, 'system'),
    blueprintsDir: path.join(baseDir, 'project-blueprints'),
    runbooksDir: path.join(baseDir, 'runbooks')
  };
}

function listSystemDocs() {
  const paths = getDocsPaths();

  function safeList(dirPath, group) {
    if (!fs.existsSync(dirPath)) return [];
    return fs.readdirSync(dirPath)
      .filter(name => name.endsWith('.md'))
      .sort()
      .map(name => ({
        group,
        name,
        path: path.join(dirPath, name)
      }));
  }

  return [
    ...safeList(paths.systemDir, 'system'),
    ...safeList(paths.blueprintsDir, 'blueprints'),
    ...safeList(paths.runbooksDir, 'runbooks')
  ];
}

function readSystemDoc(docName) {
  const docs = listSystemDocs();
  const match = docs.find(x => x.name === docName);

  if (!match) {
    throw new Error('System document not found');
  }

  return {
    ...match,
    content: fs.readFileSync(match.path, 'utf8')
  };
}










function getRenderOutputPaths(projectName) {
  const safeProject = String(projectName || '').trim().toLowerCase();
  const resolution = unifiedDataPathResolver.resolve(safeProject, {
    domain: 'generated',
    operation: 'read'
  });
  const baseDir = resolveExecutionReadCandidate({
    projectName: safeProject,
    domain: 'generated',
    relativePath: '',
    pathType: 'directory',
    requestedIdentifier: 'generated-root',
    requestedFile: 'generated'
  }).selectedPath;
  const legacyBaseDir = path.join(resolution.legacyRoot, 'generated');
  const jobsDir = path.join(baseDir, 'jobs');
  const outputsDir = path.join(baseDir, 'outputs');
  const rendersDir = path.join(baseDir, 'renders');
  const legacyJobsDir = path.join(legacyBaseDir, 'jobs');
  const legacyOutputsDir = path.join(legacyBaseDir, 'outputs');
  const legacyRendersDir = path.join(legacyBaseDir, 'renders');

  ensureDir(baseDir);
  ensureDir(jobsDir);
  ensureDir(outputsDir);
  ensureDir(rendersDir);
  ensureDir(legacyBaseDir);
  ensureDir(legacyJobsDir);
  ensureDir(legacyOutputsDir);
  ensureDir(legacyRendersDir);

  return {
    baseDir,
    jobsDir,
    outputsDir,
    rendersDir,
    legacyBaseDir,
    legacyJobsDir,
    legacyOutputsDir,
    legacyRendersDir
  };
}

function getLatestGenerationJob(projectName) {
  const jobsDir = resolveExecutionReadCandidate({
    projectName,
    domain: 'generated',
    relativePath: 'jobs',
    pathType: 'directory',
    matcher: /\.json$/i,
    requestedIdentifier: 'latest-generation-job',
    requestedFile: 'generated/jobs/*.json'
  }).selectedPath;

  const files = fs.readdirSync(jobsDir)
    .filter(name => name.endsWith('.json'))
    .sort()
    .reverse();

  if (!files.length) {
    throw new Error('No generation jobs found');
  }

  const latestPath = path.join(jobsDir, files[0]);
  return readJsonFile(latestPath, {});
}

function buildRenderRequestFromJob(projectName, job) {
  const paths = getRenderOutputPaths(projectName);

  const renderId = `render_${Date.now()}`;
  const outputPath = job.suggested_output_path ||
    path.join(paths.legacyOutputsDir, `${renderId}_${job.asset_type}.png`);

  return {
    render_id: renderId,
    project: projectName,
    job_id: job.job_id,
    asset_type: job.asset_type,
    goal: job.goal,
    requested_at: new Date().toISOString(),
    status: 'render_ready',
    provider: 'provider_pending',
    source_of_truth: job.source_of_truth,
    guardrails: job.guardrails,
    allowed_transformations: job.allowed_transformations,
    final_generation_prompt: job.final_generation_prompt,
    output_path: outputPath
  };
}

function buildRenderRequest(projectName) {
  const job = getLatestGenerationJob(projectName);
  const request = buildRenderRequestFromJob(projectName, job);

  const paths = getRenderOutputPaths(projectName);
  const requestPath = path.join(paths.legacyRendersDir, `${request.render_id}.json`);

  executionArtifactWriter.writeJson({
    project: projectName,
    domain: 'generated',
    artifactType: 'render_request_record',
    identifier: request.render_id,
    legacyPath: requestPath,
    data: request
  });
  return request;
}

function reviewLatestRenderRequest(projectName) {
  const rendersDir = resolveExecutionReadCandidate({
    projectName,
    domain: 'generated',
    relativePath: 'renders',
    pathType: 'directory',
    matcher: /\.json$/i,
    requestedIdentifier: 'review-latest-render-request',
    requestedFile: 'generated/renders/*.json'
  }).selectedPath;

  const files = fs.readdirSync(rendersDir)
    .filter(name => name.endsWith('.json'))
    .sort()
    .reverse();

  if (!files.length) {
    throw new Error('No render requests found');
  }

  const latestPath = path.join(rendersDir, files[0]);
  return readJsonFile(latestPath, {});
}

function markRenderResult(projectName, renderId, status, resultData = {}) {
  const renderRecord = resolveExecutionReadCandidate({
    projectName,
    domain: 'generated',
    relativePath: path.join('renders', `${renderId}.json`),
    pathType: 'file',
    requestedIdentifier: renderId,
    requestedFile: `generated/renders/${renderId}.json`
  });
  const renderPath = renderRecord.selectedPath;

  if (!fs.existsSync(renderPath)) {
    throw new Error('Render request not found');
  }

  const renderRequest = readJsonFile(renderPath, {});
  renderRequest.status = status;
  renderRequest.completed_at = new Date().toISOString();
  renderRequest.result = resultData;

  executionArtifactWriter.writeJson({
    project: projectName,
    domain: 'generated',
    artifactType: 'render_status_record',
    identifier: renderId,
    legacyPath: renderRecord.legacyPath,
    data: renderRequest
  });
  return renderRequest;
}

function evaluateExecutionReadiness(projectName, assetType) {
  const context = buildPromptEngineContext(projectName);
  const readiness = context.readiness;

  const result = {
    project: projectName,
    asset_type: assetType,
    status: 'allowed',
    mode: 'brand_controlled_execution',
    blocking_reasons: [],
    warnings: []
  };

  if (!readiness.has_logo) {
    result.status = 'blocked';
    result.blocking_reasons.push('Missing real logo source');
  }

  if (assetType === 'ad' || assetType === 'blog_image' || assetType === 'email_hero') {
    if (!readiness.has_product) {
      result.status = 'allowed_with_constraints';
      result.warnings.push('No real product source available');
    }

    if (!readiness.has_packaging) {
      result.status = 'allowed_with_constraints';
      result.warnings.push('No real packaging source available');
    }
  }

  if (result.blocking_reasons.length > 0) {
    result.mode = 'blocked';
  } else if (result.warnings.length > 0) {
    result.mode = 'restricted_execution';
  }

  return result;
}
function getGenerationOutputPaths(projectName) {
  const safeProject = String(projectName || '').trim().toLowerCase();
  const resolution = unifiedDataPathResolver.resolve(safeProject, {
    domain: 'generated',
    operation: 'read'
  });
  const baseDir = resolveExecutionReadCandidate({
    projectName: safeProject,
    domain: 'generated',
    relativePath: '',
    pathType: 'directory',
    requestedIdentifier: 'generated-root',
    requestedFile: 'generated'
  }).selectedPath;
  const legacyBaseDir = path.join(resolution.legacyRoot, 'generated');
  const jobsDir = path.join(baseDir, 'jobs');
  const outputsDir = path.join(baseDir, 'outputs');
  const legacyJobsDir = path.join(legacyBaseDir, 'jobs');
  const legacyOutputsDir = path.join(legacyBaseDir, 'outputs');

  ensureDir(baseDir);
  ensureDir(jobsDir);
  ensureDir(outputsDir);
  ensureDir(legacyBaseDir);
  ensureDir(legacyJobsDir);
  ensureDir(legacyOutputsDir);

  return {
    baseDir,
    jobsDir,
    outputsDir,
    legacyBaseDir,
    legacyJobsDir,
    legacyOutputsDir
  };
}

function evaluateGenerationEligibility(projectName, assetType) {
  const execution = evaluateExecutionReadiness(projectName, assetType);
  const context = buildPromptEngineContext(projectName);
  const truth = context.source_of_truth;

  const result = {
    project: projectName,
    asset_type: assetType,
    status: 'ready_for_generation',
    mode: execution.mode,
    blocking_reasons: [...execution.blocking_reasons],
    warnings: [...execution.warnings]
  };

  if (!truth.logo) {
    result.status = 'blocked';
    result.blocking_reasons.push('Logo source is required for generation');
  }

  if ((assetType === 'ad' || assetType === 'email_hero' || assetType === 'blog_visual') && !truth.product) {
    result.status = 'restricted_generation';
    result.warnings.push('Product source is missing for full-fidelity visual generation');
  }

  if ((assetType === 'ad' || assetType === 'email_hero' || assetType === 'blog_visual') && !truth.packaging) {
    result.status = 'restricted_generation';
    result.warnings.push('Packaging source is missing for full packaging-safe rendering');
  }

  if (result.blocking_reasons.length > 0) {
    result.mode = 'blocked';
  }

  return result;
}

function buildGenerationPrompt(projectName, assetType, goal) {
  const executionPackage = buildExecutionPackage(projectName, assetType, goal);
  const execution = executionPackage.execution;

  const lines = [];

  lines.push(`Create a brand-controlled ${assetType} visual for project ${projectName}.`);
  lines.push(`Goal: ${goal}.`);
  lines.push(`Use the real registered logo source only.`);
  
  if (execution.source_of_truth.product) {
    lines.push(`Use the real registered product source only.`);
  } else {
    lines.push(`No product source is available. Do not invent a fake product.`);
  }

  if (execution.source_of_truth.packaging) {
    lines.push(`Use the real registered packaging source only.`);
    lines.push(`Do not alter packaging structure, label layout, brand marks, or container form.`);
  } else {
    lines.push(`No packaging source is available. Do not invent packaging.`);
  }

  lines.push(`Brand safety is strict.`);
  lines.push(`Do not invent a logo.`);
  lines.push(`Do not invent labels.`);
  lines.push(`Do not invent brand elements.`);
  lines.push(`Do not create generic AI product visuals.`);
  lines.push(`Allowed transformations only: ${execution.allowed_transformations.join(', ')}.`);

  if (execution.source_of_truth.references.length > 0) {
    lines.push(`Reference assets may influence style direction only, never source-of-truth identity.`);
  }

  return lines.join(' ');
}

function buildGenerationJob(projectName, assetType, goal) {
  const eligibility = evaluateGenerationEligibility(projectName, assetType);
  const executionPackage = buildExecutionPackage(projectName, assetType, goal);
  const outputPaths = getGenerationOutputPaths(projectName);

  const jobId = `gen_${Date.now()}`;
  const outputFilename = `${jobId}_${assetType}.json`;
  const outputPath = path.join(outputPaths.legacyJobsDir, outputFilename);

  const job = {
    job_id: jobId,
    project: projectName,
    asset_type: assetType,
    goal,
    generated_at: new Date().toISOString(),
    status: eligibility.status,
    mode: eligibility.mode,
    blocking_reasons: eligibility.blocking_reasons,
    warnings: eligibility.warnings,
    source_of_truth: executionPackage.execution.source_of_truth,
    guardrails: executionPackage.execution.guardrails,
    allowed_transformations: executionPackage.execution.allowed_transformations,
    final_generation_prompt: buildGenerationPrompt(projectName, assetType, goal),
    suggested_output_path: path.join(outputPaths.legacyOutputsDir, `${jobId}_${assetType}.png`)
  };

  executionArtifactWriter.writeJson({
    project: projectName,
    domain: 'generated',
    artifactType: 'generation_job_record',
    identifier: jobId,
    legacyPath: outputPath,
    data: job
  });

  return job;
}
function buildExecutionInstructions(projectName, assetType, goal) {
  const context = buildPromptEngineContext(projectName);
  const truth = context.source_of_truth;
  const readinessCheck = evaluateExecutionReadiness(projectName, assetType);
  const promptPackage = generateBrandControlledPrompt(projectName, assetType, goal);

  const executionInstructions = {
    execution_type: assetType,
    project: projectName,
    goal,
    status: readinessCheck.status,
    mode: readinessCheck.mode,
    blocking_reasons: readinessCheck.blocking_reasons,
    warnings: readinessCheck.warnings,
    source_of_truth: {
      logo: truth.logo ? (truth.logo.local_path || truth.logo.filename || null) : null,
      product: truth.product ? (truth.product.local_path || truth.product.filename || null) : null,
      packaging: truth.packaging ? (truth.packaging.local_path || truth.packaging.filename || null) : null,
      references: truth.references.map(item => item.source_url || item.local_path || item.filename).filter(Boolean)
    },
    guardrails: context.guardrails,
    allowed_transformations: context.guardrails.allowed_visual_improvements,
    final_prompt: promptPackage.final_prompt
  };

  return executionInstructions;
}

function buildExecutionPackage(projectName, assetType, goal) {
  const paths = getProjectBrandPaths(projectName);
  const execution = buildExecutionInstructions(projectName, assetType, goal);

  const executionPackage = {
    project: projectName,
    asset_type: assetType,
    goal,
    generated_at: new Date().toISOString(),
    execution
  };

  const packagePath = path.join(paths.baseDir, 'execution-package.json');
  writeJsonFile(packagePath, executionPackage);

  return executionPackage;
}

function resolveSourceOfTruthAssets(projectName) {
  const paths = getProjectBrandPaths(projectName);
  ensureJsonFile(paths.registryPath, []);
  const registry = readJsonFile(paths.registryPath, []);

  const activeAssets = registry.filter(item => item.status === 'active');

  const pickFirst = (role) =>
    activeAssets.find(
      item => item.asset_role === role && item.use_as_source_of_truth === true
    ) || null;

  const references = activeAssets.filter(
    item => item.use_as_reference_only === true
  );

  return {
    logo: pickFirst('logo_source'),
    product: pickFirst('product_source'),
    packaging: pickFirst('packaging_source'),
    references,
    has_minimum_brand_truth: !!pickFirst('logo_source')
  };
}

function buildPromptGuardrails(projectName) {
  return {
    project: projectName,
    use_real_logo_only: true,
    use_real_product_only: true,
    use_real_packaging_only: true,
    do_not_change_packaging: true,
    do_not_invent_logo: true,
    do_not_invent_label: true,
    do_not_invent_brand_elements: true,
    no_generic_ai_packaging: true,
    no_fake_product_visuals: true,
    allowed_visual_improvements: [
      'background',
      'lighting',
      'composition',
      'quality',
      'shadow',
      'depth'
    ]
  };
}

function buildPromptEngineContext(projectName) {
  const paths = getProjectBrandPaths(projectName);
  ensureJsonFile(paths.brandProfilePath, {});
  ensureJsonFile(paths.registryPath, []);

  const brandProfile = readJsonFile(paths.brandProfilePath, {});
  const sourceOfTruth = resolveSourceOfTruthAssets(projectName);
  const guardrails = buildPromptGuardrails(projectName);

  const context = {
    project: projectName,
    created_at: new Date().toISOString(),
    brand_profile_available: Object.keys(brandProfile).length > 0,
    source_of_truth: sourceOfTruth,
    guardrails,
    readiness: {
      has_logo: !!sourceOfTruth.logo,
      has_product: !!sourceOfTruth.product,
      has_packaging: !!sourceOfTruth.packaging,
      reference_count: sourceOfTruth.references.length
    }
  };

  const contextPath = path.join(paths.baseDir, 'prompt-engine-context.json');
  writeJsonFile(contextPath, context);

  return context;
}

function generateBrandControlledPrompt(projectName, assetType, goal) {
  const context = buildPromptEngineContext(projectName);
  const truth = context.source_of_truth;
  const guardrails = context.guardrails;

  const lines = [];

  lines.push(`Project: ${projectName}.`);
  lines.push(`Asset type: ${assetType}.`);
  lines.push(`Goal: ${goal}.`);
  lines.push(`Use the real registered logo source only.`);

  if (truth.logo) {
    lines.push(`Registered logo source is available and must be used as source of truth.`);
  } else {
    lines.push(`No real logo source is available. Do not invent a logo.`);
  }

  if (truth.product) {
    lines.push(`Use the real registered product source only.`);
  } else {
    lines.push(`No real product source is available. Do not invent a fake product.`);
  }

  if (truth.packaging) {
    lines.push(`Use the real registered packaging source only.`);
    lines.push(`Do not alter packaging structure, label design, or container shape.`);
  } else {
    lines.push(`No real packaging source is available. Do not invent packaging.`);
  }

  lines.push(`Do not invent a logo.`);
  lines.push(`Do not invent labels.`);
  lines.push(`Do not invent brand elements.`);
  lines.push(`Do not create generic AI packaging.`);
  lines.push(`Allowed edits only: ${guardrails.allowed_visual_improvements.join(', ')}.`);

  if (truth.references.length) {
    lines.push(`Reference assets may be used for inspiration only, never as source of truth.`);
  }

  return {
    project: projectName,
    asset_type: assetType,
    goal,
    generated_at: new Date().toISOString(),
    readiness: context.readiness,
    final_prompt: lines.join(' ')
  };
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function ensureJsonFile(filePath, defaultValue = []) {
  const dir = path.dirname(filePath);
  ensureDir(dir);

  if (!fs.existsSync(filePath)) {
    writeJsonFile(filePath, defaultValue);
  }
}

function readJsonFile(filePath, fallback = []) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, 'utf8').trim();
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`[server] readJsonFile: non-fatal read/parse error for ${filePath}, returning fallback. Error: ${err.message}`);
    return fallback;
  }
}

/**
 * writeJsonFile (server-local) — atomic write with backup.
 * Mirrors the hardened implementation in storage.js.
 */
function writeJsonFile(filePath, data) {
  ensureDir(path.dirname(filePath));

  const serialized = JSON.stringify(data, null, 2);
  const tmpPath = filePath + '.tmp';
  const backupPath = filePath + '.backup';

  fs.writeFileSync(tmpPath, serialized, 'utf8');

  let fd;
  try {
    fd = fs.openSync(tmpPath, 'r+');
    fs.fsyncSync(fd);
  } catch (_) {
    // fsync is best-effort
  } finally {
    if (fd !== undefined) {
      try { fs.closeSync(fd); } catch (_) { /* ignore */ }
    }
  }

  if (fs.existsSync(filePath)) {
    try { fs.copyFileSync(filePath, backupPath); } catch (_) { /* non-fatal */ }
  }

  try {
    fs.renameSync(tmpPath, filePath);
  } catch (err) {
    try { fs.unlinkSync(tmpPath); } catch (_) { /* ignore */ }
    throw Object.assign(
      new Error(`[server] Atomic rename failed for ${filePath}: ${err.message}`),
      { filePath, tmpPath, code: 'STORAGE_RENAME_ERROR' }
    );
  }
}

function normalizeAssetRole(input) {
  const value = String(input || '').trim().toLowerCase();

  const map = {
    product: 'product_source',
    product_source: 'product_source',
    logo: 'logo_source',
    logo_source: 'logo_source',
    packaging: 'packaging_source',
    packaging_source: 'packaging_source',
    reference: 'reference_source',
    reference_source: 'reference_source',
    video: 'video_source',
    video_source: 'video_source'
  };

  return map[value] || null;
}

function getProjectBrandPaths(projectName) {
  const safeProject = normalizeProjectSlug(projectName);
  const resolution = unifiedDataPathResolver.resolve(safeProject, {
    domain: 'media',
    operation: 'read'
  });
  const legacyBaseDir = resolution.legacyRoot;
  const baseDir = resolution.activeReadPath;

  return {
    baseDir,
    legacyBaseDir,
    registryPath: path.join(baseDir, 'media-input-registry.json'),
    brandProfilePath: path.join(baseDir, 'brand-profile.json'),
    logoDir: path.join(baseDir, 'logo'),
    packagingDir: path.join(baseDir, 'packaging'),
    productDir: path.join(baseDir, 'product'),
    referenceDir: path.join(baseDir, 'reference'),
    videoDir: path.join(baseDir, 'video')
  };
}

function uniqueValues(values) {
  return [...new Set((values || []).filter(Boolean))];
}

function hasProjectProfile(projectName) {
  const safeProject = normalizeProjectSlug(projectName);

  try {
    return fs.existsSync(getProjectBasePaths(safeProject).projectFilePath);
  } catch (error) {
    return false;
  }
}

function listProjectNamesWithProfiles() {
  const names = [];
  const registryProjects = listProjects();

  registryProjects.forEach((project) => {
    const name = String(project && project.project_name || '').trim().toLowerCase();
    if (name) {
      names.push(name);
    }
  });

  const registryPaths = getProjectRegistryPaths();
  const entries = fs.readdirSync(registryPaths.baseDir, { withFileTypes: true });

  entries.forEach((entry) => {
    if (!entry.isDirectory()) return;

    const name = String(entry.name || '').trim().toLowerCase();
    if (!name) return;

    const projectFilePath = path.join(registryPaths.baseDir, name, 'project.json');
    if (fs.existsSync(projectFilePath)) {
      names.push(name);
    }
  });

  return uniqueValues(names).sort((a, b) => a.localeCompare(b));
}

function listLegacyMediaProjectNames() {
  ensureDir(LEGACY_BRAND_ASSETS_DIR);

  return fs.readdirSync(LEGACY_BRAND_ASSETS_DIR, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => String(entry.name || '').trim().toLowerCase())
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}

function listMediaManagerProjects() {
  const profileProjects = listProjectNamesWithProfiles();
  const legacyProjects = listLegacyMediaProjectNames();
  const allNames = uniqueValues([...profileProjects, ...legacyProjects]);

  const items = allNames.map((name) => {
    const brandPaths = getProjectBrandPaths(name);

    return {
      name,
      has_project_profile: profileProjects.includes(name),
      has_media_root: fs.existsSync(brandPaths.baseDir) || fs.existsSync(brandPaths.legacyBaseDir),
      media_root: brandPaths.baseDir
    };
  }).sort((a, b) => {
    if (a.has_project_profile !== b.has_project_profile) {
      return a.has_project_profile ? -1 : 1;
    }
    if (a.has_media_root !== b.has_media_root) {
      return a.has_media_root ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  return {
    projects: items.map((item) => item.name),
    items,
    preferred_project: (items.find((item) => item.has_project_profile) || items[0] || null)?.name || ''
  };
}

function buildLegacyMediaTree(projectName) {
  const project = normalizeProjectSlug(projectName);
  const paths = getProjectBrandPaths(project);

  if (!project || !fs.existsSync(paths.baseDir)) {
    throw new Error('Project not found');
  }

  const result = ['logo', 'product', 'packaging', 'reference', 'video'].map(type => {
    const dirPath = path.join(paths.baseDir, type);
    ensureDir(dirPath);

    const files = fs.readdirSync(dirPath, { withFileTypes: true })
      .filter(entry => entry.isFile())
      .map(entry => entry.name);

    return { folder: type, files };
  });

  return {
    project,
    tree: result
  };
}

function buildLegacyMediaRegistry(projectName) {
  const project = normalizeProjectSlug(projectName);
  const paths = getProjectBrandPaths(project);

  ensureJsonFile(paths.registryPath, []);
  const registry = readJsonFile(paths.registryPath, []);

  return {
    project,
    total_assets: registry.length,
    assets: registry
  };
}

function findRegisteredMediaFilePath(projectName, type, filename) {
  const project = normalizeProjectSlug(projectName);
  const normalizedType = String(type || '').trim().toLowerCase();
  const safeFilename = path.basename(String(filename || '').trim());

  if (!project || !safeFilename) {
    return null;
  }

  if (hasProjectProfile(project)) {
    try {
      const assetPaths = getProjectAssetPaths(project);
      const assets = readJsonFile(assetPaths.assetsRegistryPath, []);
      const assetMatch = assets.find((asset) => {
        const assetFilename = path.basename(String(asset.file_path || '').trim());
        if (!assetFilename || assetFilename !== safeFilename) {
          return false;
        }

        return !normalizedType || String(asset.asset_type || '').trim().toLowerCase() === normalizedType;
      });

      if (assetMatch && fs.existsSync(assetMatch.file_path)) {
        return assetMatch.file_path;
      }
    } catch (error) {
      // Fall through to the legacy registry search.
    }
  }

  try {
    const brandPaths = getProjectBrandPaths(project);
    const registry = readJsonFile(brandPaths.registryPath, []);
    const expectedRole = buildAssetRoleFromType(normalizedType);
    const legacyMatch = registry.find((asset) => {
      const assetFilename = path.basename(String(asset.local_path || asset.filename || '').trim());
      if (!assetFilename || assetFilename !== safeFilename) {
        return false;
      }

      if (!expectedRole) {
        return true;
      }

      return String(asset.asset_role || '').trim().toLowerCase() === expectedRole;
    });

    if (legacyMatch && fs.existsSync(legacyMatch.local_path)) {
      return legacyMatch.local_path;
    }
  } catch (error) {
    return null;
  }

  return null;
}

function buildMediaManagerProjectPayload(projectName) {
  const project = normalizeProjectSlug(projectName);

  const brandPaths = getProjectBrandPaths(project);
  const hasProfile = hasProjectProfile(project);
  const hasMediaRoot = fs.existsSync(brandPaths.baseDir) || fs.existsSync(brandPaths.legacyBaseDir);
  const payload = {
    project,
    capabilities: {
      has_project_profile: hasProfile,
      has_media_root: hasMediaRoot,
      media_root: brandPaths.baseDir
    },
    overview: null,
    assets: null,
    connectors: null,
    readiness: null,
    activity: null,
    operations: null,
    tree: {
      project,
      tree: []
    },
    registry: {
      project,
      total_assets: 0,
      assets: []
    },
    errors: {}
  };

  try {
    payload.tree = buildLegacyMediaTree(project);
  } catch (error) {
    payload.errors.tree = error.message;
  }

  try {
    payload.registry = buildLegacyMediaRegistry(project);
  } catch (error) {
    payload.errors.registry = error.message;
  }

  if (!hasProfile) {
    const message = 'Project profile not found';
    payload.errors.overview = message;
    payload.errors.assets = message;
    payload.errors.connectors = message;
    payload.errors.readiness = message;
    payload.errors.activity = message;
    payload.errors.operations = message;
    return payload;
  }

  const panelBuilders = {
    overview: buildProjectControlCenterOverview,
    assets: buildProjectControlCenterAssets,
    connectors: buildProjectControlCenterConnectors,
    readiness: buildProjectControlCenterReadiness,
    activity: buildProjectControlCenterActivity,
    operations: buildProjectOperationsPayload
  };

  Object.entries(panelBuilders).forEach(([key, build]) => {
    try {
      payload[key] = build(project);
    } catch (error) {
      payload.errors[key] = error.message;
    }
  });

  return payload;
}

function getAssetDirByRole(paths, assetRole) {
  if (assetRole === 'logo_source') return paths.logoDir;
  if (assetRole === 'packaging_source') return paths.packagingDir;
  if (assetRole === 'product_source') return paths.productDir;
  if (assetRole === 'reference_source') return paths.referenceDir;
  if (assetRole === 'video_source') return paths.videoDir;
  return paths.baseDir;
}

function appendAudit(entry) {
  const auditPath = path.join(DATA_DIR, 'audit.json');
  try {
    const current = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
    current.push(entry);
    fs.writeFileSync(auditPath, JSON.stringify(current, null, 2));
  } catch (error) {
    appLogger.error('audit_write_failed', {
      route: '/audit',
      action: 'append_audit',
      error: serializeErrorForLog(error)
    });
  }
}

function detectProject(message) {
  const text = String(message || '').toLowerCase();
  const compactText = text.replace(/[^a-z0-9]+/g, '');

  try {
    const projects = listProjectNamesWithProfiles();
    for (const project of projects) {
      const normalized = String(project || '').trim().toLowerCase();
      const compactProject = normalized.replace(/[^a-z0-9]+/g, '');
      if (
        normalized &&
        (text.includes(normalized) || (compactProject && compactText.includes(compactProject)))
      ) {
        return normalized;
      }
    }
  } catch (error) {
    appLogger.warn('project_detection_registry_failed', {
      route: '/task',
      action: 'detect_project',
      error: serializeErrorForLog(error)
    });
  }

  return 'unknown';
}

function normalizeOptionalProjectSlug(value) {
  const raw = String(value == null ? '' : value).trim();
  if (!raw) return '';

  try {
    return normalizeProjectSlug(raw);
  } catch (error) {
    return '';
  }
}

function getPreferredProjectName() {
  const envProject = normalizeOptionalProjectSlug(process.env[DEFAULT_PROJECT_ENV]);
  if (envProject) {
    return envProject;
  }

  try {
    const projects = listProjects();
    const first = Array.isArray(projects) ? projects[0] : null;
    return normalizeOptionalProjectSlug(
      typeof first === 'string' ? first : first?.project_name || first?.name
    );
  } catch (error) {
    return '';
  }
}

function extractProjectFlag(args = []) {
  const values = Array.isArray(args) ? args : [];

  for (let index = 0; index < values.length; index += 1) {
    const value = String(values[index] || '').trim();
    if (value === '--project' || value === '-p') {
      return normalizeOptionalProjectSlug(values[index + 1]);
    }

    if (value.startsWith('--project=')) {
      return normalizeOptionalProjectSlug(value.slice('--project='.length));
    }
  }

  return '';
}

function stripProjectFlagArgs(args = []) {
  const values = Array.isArray(args) ? args : [];
  const result = [];

  for (let index = 0; index < values.length; index += 1) {
    const value = String(values[index] || '').trim();
    if (value === '--project' || value === '-p') {
      index += 1;
      continue;
    }

    if (value.startsWith('--project=')) {
      continue;
    }

    result.push(values[index]);
  }

  return result;
}

function resolveRequestProjectName(req, options = {}) {
  const explicit = normalizeOptionalProjectSlug(options.projectName)
    || normalizeOptionalProjectSlug(options.explicitProject)
    || normalizeOptionalProjectSlug(req?.body?.project)
    || normalizeOptionalProjectSlug(req?.query?.project)
    || normalizeOptionalProjectSlug(req?.params?.project);

  if (explicit) {
    return explicit;
  }

  const detected = detectProject(options.text || req?.body?.text || '');
  if (detected && detected !== 'unknown') {
    return detected;
  }

  return options.allowFallback === false ? '' : getPreferredProjectName();
}

function requireProjectContext(req, options = {}) {
  const projectName = resolveRequestProjectName(req, options);
  if (projectName) {
    return projectName;
  }

  const error = new Error(`Missing project context. Provide request project, query project, --project, or ${DEFAULT_PROJECT_ENV}.`);
  error.statusCode = 400;
  error.code = 'PROJECT_CONTEXT_MISSING';
  throw error;
}

function buildProjectHashtag(projectName) {
  const display = getProjectDisplayName(projectName);
  const compact = String(display || projectName || '')
    .replace(/[^a-zA-Z0-9]+/g, '')
    .trim();

  return compact ? `#${compact}` : '#Project';
}

function getProjectDisplayName(projectName) {
  const safeProject = normalizeOptionalProjectSlug(projectName);
  if (!safeProject) return 'Project';

  try {
    const projectData = readJsonFile(getProjectBasePaths(safeProject).projectFilePath, {});
    return String(
      projectData.brand_name ||
      projectData.display_name ||
      projectData.project_name ||
      safeProject
    ).trim();
  } catch (error) {
    return safeProject;
  }
}

function getProjectWebsiteUrl(projectName) {
  const safeProject = normalizeOptionalProjectSlug(projectName);
  if (!safeProject) return '';

  try {
    const projectData = readJsonFile(getProjectBasePaths(safeProject).projectFilePath, {});
    return String(projectData.website_url || '').trim();
  } catch (error) {
    return '';
  }
}

function detectTaskType(message) {
  const text = String(message || '').toLowerCase();

  if (
    text.includes('bug') ||
    text.includes('code') ||
    text.includes('repo') ||
    text.includes('typescript') ||
    text.includes('build') ||
    text.includes('test') ||
    text.includes('fix') ||
    text.includes('review') ||
    text.includes('technical') ||
    text.includes('architecture') ||
    text.includes('module') ||
    text.includes('implementation') ||
    text.includes('engineering') ||
    text.includes('issues')
  ) {
    return 'development';
  }

  if (
    text.includes('campaign') ||
    text.includes('marketing') ||
    text.includes('ads') ||
    text.includes('audience') ||
    text.includes('offer') ||
    text.includes('launch') ||
    text.includes('promotion') ||
    text.includes('growth')
  ) {
    return 'marketing';
  }

  if (
    text.includes('write') ||
    text.includes('article') ||
    text.includes('page') ||
    text.includes('copy') ||
    text.includes('caption') ||
    text.includes('content') ||
    text.includes('rewrite')
  ) {
    return 'writing';
  }

  if (
    text.includes('report') ||
    text.includes('weekly') ||
    text.includes('plan') ||
    text.includes('priority') ||
    text.includes('status') ||
    text.includes('roadmap') ||
    text.includes('organize') ||
    text.includes('execution')
  ) {
    return 'ops';
  }

  return 'general';
}

function inferProductIntelligenceFromSource(sourceOfTruth = {}) {
  const productPath = String(sourceOfTruth.product || '');
  const filename = path.basename(productPath).toLowerCase();

  const intelligence = {
    product_name: null,
    line: null,
    category: null,
    size: null,
    content_family: null
  };

  if (filename.includes('after_shave')) {
    intelligence.product_name = 'After Shave Deep Sky';
    intelligence.line = 'Deep Sky';
    intelligence.category = 'skin';
    intelligence.content_family = 'after shave';
  }

  if (filename.includes('beard')) {
    intelligence.category = 'beard';
    intelligence.content_family = 'beard care';
  }

  if (filename.includes('hair')) {
    intelligence.category = 'hair';
    intelligence.content_family = 'hair care';
  }

  const sizeMatch = filename.match(/(\d+)\s*ml/);
  if (sizeMatch) {
    intelligence.size = `${sizeMatch[1]}ml`;
  }

  return intelligence;
}

function inferDesignIntent(goal = '') {
  const g = String(goal || '').toLowerCase();

  if (g.includes('offer') || g.includes('discount') || g.includes('sale')) {
    return {
      content_type: 'offer_visual',
      visual_style: 'bold_promo',
      objective: 'conversion'
    };
  }

  if (g.includes('summer') || g.includes('ramadan') || g.includes('season')) {
    return {
      content_type: 'seasonal_visual',
      visual_style: 'campaign_thematic',
      objective: 'awareness'
    };
  }

  if (g.includes('partner') || g.includes('dealer') || g.includes('affiliate')) {
    return {
      content_type: 'partner_visual',
      visual_style: 'trust_recruitment',
      objective: 'partner_recruitment'
    };
  }

  if (g.includes('feature') || g.includes('benefit') || g.includes('ingredient')) {
    return {
      content_type: 'feature_visual',
      visual_style: 'educational_product_focus',
      objective: 'consideration'
    };
  }

  if (g.includes('infographic')) {
    return {
      content_type: 'infographic',
      visual_style: 'structured_information',
      objective: 'education'
    };
  }

  if (g.includes('marketplace') || g.includes('amazon') || g.includes('ebay')) {
    return {
      content_type: 'marketplace_visual',
      visual_style: 'clean_ecommerce',
      objective: 'conversion'
    };
  }

  if (g.includes('hero') || g.includes('cinematic') || g.includes('luxury')) {
    return {
      content_type: 'hero_visual',
      visual_style: 'cinematic_premium',
      objective: 'awareness_and_conversion'
    };
  }

  return {
    content_type: 'brand_visual',
    visual_style: 'premium_branding',
    objective: 'awareness'
  };
}
function enrichProductIntelligenceData(product) {
  const text = [
    product.product_name,
    product.short_description,
    product.description
  ].join(' ').toLowerCase();

  const enrichment = {
    benefits: [],
    ingredients: [],
    usage: [],
    target_audience: [],
    positioning: '',
    product_type: '',
    problem_solution: [],
    emotional_triggers: []
  };

  // ===== TYPE =====
  if (text.includes('beard')) enrichment.product_type = 'beard';
  else if (text.includes('hair')) enrichment.product_type = 'hair';
  else if (text.includes('face') || text.includes('skin')) enrichment.product_type = 'skin';
  else enrichment.product_type = 'general';

  // ===== BENEFITS =====
  if (text.includes('pflegt') || text.includes('pflege')) enrichment.benefits.push('pflege');
  if (text.includes('styling')) enrichment.benefits.push('styling');
  if (text.includes('glanz')) enrichment.benefits.push('shine');
  if (text.includes('volume') || text.includes('volumen')) enrichment.benefits.push('volume');
  if (text.includes('schutz')) enrichment.benefits.push('protection');

  // ===== INGREDIENTS =====
  if (text.includes('argan')) enrichment.ingredients.push('argan oil');
  if (text.includes('jojoba')) enrichment.ingredients.push('jojoba oil');
  if (text.includes('mint')) enrichment.ingredients.push('mint');

  // ===== USAGE =====
  if (text.includes('shampoo')) enrichment.usage.push('cleaning');
  if (text.includes('oil')) enrichment.usage.push('moisturizing');
  if (text.includes('balm')) enrichment.usage.push('styling');

  // ===== TARGET =====
  if (text.includes('barber')) enrichment.target_audience.push('barbers');
  if (text.includes('gift')) enrichment.target_audience.push('gift buyers');
  enrichment.target_audience.push('men');

  // ===== POSITIONING =====
  if (text.includes('premium')) enrichment.positioning = 'premium';
  else enrichment.positioning = 'mass';

  // ===== EMOTIONAL =====
  enrichment.emotional_triggers = [
    'confidence',
    'clean look',
    'professional style'
  ];

  return enrichment;
}

function decideMode(message) {
  const text = String(message || '').toLowerCase();

  if (
    text.includes('send') ||
    text.includes('publish') ||
    text.includes('launch live') ||
    text.includes('deploy') ||
    text.includes('merge') ||
    text.includes('delete')
  ) {
    return 'approval_required';
  }

  if (
    text.includes('prepare') ||
    text.includes('draft') ||
    text.includes('generate')
  ) {
    return 'prepare';
  }

  return 'analyze';
}

function selectAgent(taskType) {
  switch (taskType) {
    case 'development':
      return 'MH Dev Agent';
    case 'marketing':
      return 'MH Marketing Agent';
    case 'writing':
      return 'MH Writing Agent';
    case 'ops':
      return 'MH Ops Agent';
    default:
      return 'MH Orchestrator';
  }
}

function buildTaskResult({
  message,
  source = 'direct',
  sessionId = 'unknown',
  userId = 'unknown'
}) {
  const taskId = `task_${Date.now()}`;
  const project = detectProject(message);
  const taskType = detectTaskType(message);
  const mode = decideMode(message);
  const agent = selectAgent(taskType);

  const contextPath =
    project === 'unknown'
      ? null
      : path.join(CONTEXTS_DIR, `${project}.md`);

  const promptFileMap = {
    'MH Dev Agent': 'dev-agent.md',
    'MH Marketing Agent': 'marketing-agent.md',
    'MH Writing Agent': 'writing-agent.md',
    'MH Ops Agent': 'ops-agent.md',
    'MH Orchestrator': 'orchestrator.md'
  };

  const sharedPolicy = readFileSafe(path.join(PROMPTS_DIR, 'shared-policy.md'));
  const agentPrompt = readFileSafe(
    path.join(PROMPTS_DIR, promptFileMap[agent] || 'orchestrator.md')
  );
  const projectContext = contextPath ? readFileSafe(contextPath) : '';

  const result = {
    task_id: taskId,
    source,
    session_id: sessionId,
    user_id: userId,
    project,
    task_type: taskType,
    mode,
    assigned_agent: agent,
    approval_required: mode === 'approval_required',
    message_received: message,
    loaded_context: project !== 'unknown',
    user_facing_output: {
      title: `MH Assistant: ${agent}`,
      summary: `Task classified as ${taskType} for project ${project}.`,
      next_step:
        mode === 'approval_required'
          ? 'Prepare execution summary and request approval.'
          : mode === 'prepare'
          ? 'Prepare a draft or action package.'
          : 'Return analysis and recommendations.'
    },
    debug: {
      shared_policy_loaded: sharedPolicy.length > 0,
      agent_prompt_loaded: agentPrompt.length > 0,
      project_context_loaded: projectContext.length > 0
    }
  };
  appendAudit({
    timestamp: new Date().toISOString(),
    task_id: taskId,
    source,
    session_id: sessionId,
    user_id: userId,
    project,
    task_type: taskType,
    mode,
    assigned_agent: agent,
    message
  });

  return result;
}
function getProjectRegistryPaths() {
  const baseDir = path.join(DATA_DIR, 'projects');
  const registryPath = path.join(baseDir, 'registry.json');

  ensureDir(baseDir);

  if (!fs.existsSync(registryPath)) {
    writeJsonFile(registryPath, []);
  }

  return {
    baseDir,
    registryPath
  };
}

function getProjectBasePaths(projectName) {
  const resolved = resolveProjectPath(path.join(DATA_DIR, 'projects'), projectName);
  const safeProject = resolved.project;
  const baseDir = resolved.projectRoot;

  return {
    project: safeProject,
    baseDir,
    brandAssetsDir: path.join(baseDir, 'brand-assets'),
    productsDir: path.join(baseDir, 'products'),
    contentDir: path.join(baseDir, 'content'),
    mediaDir: path.join(baseDir, 'media'),
    campaignsDir: path.join(baseDir, 'campaigns'),
    publishingDir: path.join(baseDir, 'publishing'),
    launchDir: path.join(baseDir, 'launch'),
    executionDir: path.join(baseDir, 'execution'),
    telemetryDir: path.join(baseDir, 'telemetry'),
    logsDir: path.join(baseDir, 'logs'),
    optimizationDir: path.join(baseDir, 'optimization'),
    reportsDir: path.join(baseDir, 'reports'),
    integrationsDir: path.join(baseDir, 'integrations'),
    uploadsDir: path.join(baseDir, 'uploads'),
    projectFilePath: path.join(baseDir, 'project.json')
  };
}

function getLegacyProjectBasePaths(projectName) {
  const resolved = resolveProjectPath(LEGACY_BRAND_ASSETS_DIR, projectName);
  return {
    project: resolved.project,
    baseDir: resolved.projectRoot,
    brandProfilePath: path.join(resolved.projectRoot, 'brand-profile.json'),
    assetsRegistryPath: path.join(resolved.projectRoot, 'assets-registry.json'),
    mediaInputRegistryPath: path.join(resolved.projectRoot, 'media-input-registry.json')
  };
}

function getProjectBaselinePaths(projectName) {
  const base = getProjectBasePaths(projectName);
  const legacy = getLegacyProjectBasePaths(projectName);
  const opsDir = path.join(base.baseDir, 'ops');
  const integrationsRegistryPath = path.join(base.baseDir, 'integrations-registry.json');

  return {
    ...base,
    opsDir,
    brandProfilePath: path.join(base.brandAssetsDir, 'brand-profile.json'),
    assetsRegistryPath: path.join(base.baseDir, 'assets-registry.json'),
    sourcesRegistryPath: path.join(base.baseDir, 'sources-registry.json'),
    sourceOfTruthRegistryPath: path.join(base.baseDir, 'source-of-truth-registry.json'),
    integrationsRegistryPath,
    aiCommandsPath: path.join(opsDir, 'ai-commands.json'),
    aiArtifactsPath: path.join(opsDir, 'ai-artifacts.json'),
    aiRecommendationsPath: path.join(opsDir, 'ai-recommendations.json'),
    aiMemoryPath: path.join(opsDir, 'ai-memory.json'),
    integrationRegistryPath: integrationsRegistryPath,
    integrationControlCenterPath: path.join(base.integrationsDir, 'control-center.json'),
    legacy
  };
}

function stableJsonHash(value) {
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(value == null ? null : value))
    .digest('hex');
}

function logProjectDataMismatch(projectName, entry = {}) {
  try {
    const paths = getProjectBasePaths(projectName);
    const logPath = path.join(paths.baseDir, 'ops', 'data-mismatches.json');
    const current = readJsonFile(logPath, []);
    const next = Array.isArray(current) ? current : [];
    next.push({
      timestamp: new Date().toISOString(),
      project: normalizeProjectSlug(projectName),
      ...entry
    });
    writeJsonFile(logPath, next.slice(-200));
    appLogger.warn('project_data_mismatch', {
      route: '/media-manager/project/:project/setup',
      action: 'log_project_data_mismatch',
      project: normalizeOptionalProjectSlug(projectName),
      domain: entry.domain || 'unknown',
      canonicalPath: entry.canonical_path,
      legacyPath: entry.legacy_path,
      reason: entry.reason
    });
  } catch (error) {
    appLogger.warn('project_data_mismatch_log_failed', {
      route: '/media-manager/project/:project/setup',
      action: 'log_project_data_mismatch',
      project: normalizeOptionalProjectSlug(projectName),
      error: serializeErrorForLog(error)
    });
  }
}

function readCanonicalJsonWithLegacyFallback(projectName, options = {}) {
  const canonicalPath = String(options.canonicalPath || '').trim();
  const legacyCandidates = Array.isArray(options.legacyCandidates) ? options.legacyCandidates : [];
  const fallback = options.fallback;
  const domain = String(options.domain || 'project-baseline').trim();
  const normalize = typeof options.normalize === 'function' ? options.normalize : (value) => value;
  const canonicalExists = fs.existsSync(canonicalPath);
  const canonicalValue = canonicalExists ? normalize(readJsonFile(canonicalPath, fallback)) : null;

  let firstLegacy = null;
  for (const legacyPath of legacyCandidates.filter(Boolean)) {
    if (!fs.existsSync(legacyPath)) {
      continue;
    }

    const legacyValue = normalize(readJsonFile(legacyPath, fallback));
    firstLegacy = firstLegacy || { path: legacyPath, value: legacyValue };

    if (canonicalExists && stableJsonHash(canonicalValue) !== stableJsonHash(legacyValue)) {
      logProjectDataMismatch(projectName, {
        domain,
        reason: 'canonical_legacy_value_mismatch',
        canonical_path: canonicalPath,
        legacy_path: legacyPath,
        canonical_hash: stableJsonHash(canonicalValue),
        legacy_hash: stableJsonHash(legacyValue)
      });
    }
  }

  if (canonicalExists) {
    return {
      value: canonicalValue,
      source: 'canonical',
      path: canonicalPath,
      migrated: false
    };
  }

  if (firstLegacy) {
    ensureDir(path.dirname(canonicalPath));
    writeJsonFile(canonicalPath, firstLegacy.value);
    logProjectDataMismatch(projectName, {
      domain,
      reason: 'canonical_missing_migrated_from_legacy',
      canonical_path: canonicalPath,
      legacy_path: firstLegacy.path,
      legacy_hash: stableJsonHash(firstLegacy.value)
    });
    return {
      value: firstLegacy.value,
      source: 'legacy',
      path: firstLegacy.path,
      migrated: true
    };
  }

  ensureDir(path.dirname(canonicalPath));
  writeJsonFile(canonicalPath, fallback);
  return {
    value: fallback,
    source: 'default',
    path: canonicalPath,
    migrated: false
  };
}

function normalizeAssetsRegistry(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeSourceStatus(value) {
  const raw = String(value || '').trim().toLowerCase();
  if (raw === 'verified') return 'verified';
  if (raw === 'outdated') return 'outdated';
  if (raw === 'connected') return 'connected';
  return 'missing';
}

function computeSourceStatus(entry = {}) {
  const value = normalizeSetupTextValue(entry.value);
  const explicitStatus = normalizeSourceStatus(entry.status);
  if (explicitStatus !== 'missing') {
    return explicitStatus;
  }

  if (!value) {
    return 'missing';
  }

  const updatedAt = normalizeSetupTextValue(entry.updated_at);
  const updatedMs = updatedAt ? Date.parse(updatedAt) : NaN;
  if (Number.isFinite(updatedMs)) {
    const ageMs = Date.now() - updatedMs;
    const staleThresholdMs = 180 * 24 * 60 * 60 * 1000;
    if (ageMs > staleThresholdMs) {
      return 'outdated';
    }
  }

  if (normalizeSetupTextValue(entry.verified_at)) {
    return 'verified';
  }

  return 'connected';
}

function normalizeSourceRegistry(value) {
  const input = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  return input.sources && typeof input.sources === 'object' && !Array.isArray(input.sources)
    ? input.sources
    : input;
}

function buildSourceOfTruthRegistry(sources = {}) {
  const normalizedSources = normalizeSourceRegistry(sources);
  const requiredMap = {
    website: ['website'],
    social_links: ['instagram', 'facebook', 'tiktok', 'youtube', 'linkedin', 'x', 'pinterest'],
    product_files: ['product_files', 'product_csv', 'products_file'],
    brand_assets: ['brand_assets', 'logo', 'brand_guideline'],
    legal_docs: ['legal_docs', 'legal_doc'],
    pricing_docs: ['pricing_docs', 'pricing_doc'],
    campaign_docs: ['campaign_docs', 'campaign_doc']
  };

  const requiredSources = Object.entries(requiredMap).reduce((acc, [key, candidates]) => {
    const foundEntry = candidates
      .map((candidate) => normalizeSourceRegistry(normalizedSources)[candidate])
      .find((item) => item && typeof item === 'object');

    const fallbackValue = candidates
      .map((candidate) => normalizeSetupTextValue(normalizedSources[candidate]))
      .find(Boolean);

    const entry = foundEntry || (fallbackValue ? { value: fallbackValue } : {});
    const status = computeSourceStatus(entry);

    acc[key] = {
      status,
      value: normalizeSetupTextValue(entry.value || fallbackValue),
      updated_at: normalizeSetupTextValue(entry.updated_at),
      verified_at: normalizeSetupTextValue(entry.verified_at),
      source: normalizeSetupTextValue(entry.source)
    };

    return acc;
  }, {});

  return {
    updated_at: new Date().toISOString(),
    statuses: ['missing', 'connected', 'verified', 'outdated'],
    sources: normalizedSources,
    required_sources: requiredSources
  };
}

function buildDefaultBrandProfile(projectName, projectData = {}) {
  const now = new Date().toISOString();
  const goals = [projectData.primary_goal, projectData.secondary_goal]
    .map((value) => normalizeSetupTextValue(value))
    .filter(Boolean);
  const socialChannels = normalizeSetupListValue(projectData.social_channels || projectData.social_links);

  return {
    project: normalizeProjectSlug(projectName),
    brand_name: projectData.brand_name || projectData.project_name || normalizeProjectSlug(projectName),
    business_type: projectData.business_type || projectData.project_type || '',
    brand_promise: projectData.brand_promise || '',
    tone: projectData.tone || projectData.brand_voice || '',
    brand_voice: projectData.brand_voice || '',
    visual_identity: projectData.visual_identity || '',
    positioning: projectData.positioning || projectData.offer_positioning || projectData.differentiation || '',
    offer_positioning: projectData.offer_positioning || '',
    market: projectData.market || '',
    language: projectData.language || '',
    currency: projectData.currency || '',
    audience: projectData.audience || projectData.audience_primary || '',
    audience_primary: projectData.audience_primary || '',
    audience_problem: projectData.audience_problem || '',
    competitors: normalizeSetupListValue(projectData.competitors),
    goals,
    website: projectData.website || projectData.website_url || '',
    social_channels: socialChannels,
    differentiation: projectData.differentiation || '',
    source: 'setup',
    created_at: projectData.created_at || now,
    updated_at: projectData.updated_at || now
  };
}

function buildBrandProfileFromProject(projectName, projectData = {}, existing = {}) {
  return {
    ...existing,
    ...buildDefaultBrandProfile(projectName, projectData),
    created_at: existing.created_at || projectData.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

function ensureProjectBaselineFiles(projectName, projectDataInput = {}) {
  const safeProject = normalizeProjectSlug(projectName);
  const paths = getProjectBaselinePaths(safeProject);
  const projectData = {
    ...readJsonFile(paths.projectFilePath, {}),
    ...(projectDataInput && typeof projectDataInput === 'object' ? projectDataInput : {})
  };

  [
    paths.baseDir,
    paths.brandAssetsDir,
    paths.productsDir,
    paths.contentDir,
    paths.mediaDir,
    paths.campaignsDir,
    paths.publishingDir,
    paths.launchDir,
    paths.executionDir,
    paths.telemetryDir,
    paths.logsDir,
    paths.optimizationDir,
    paths.reportsDir,
    paths.integrationsDir,
    paths.uploadsDir,
    paths.opsDir,
    paths.legacy.baseDir
  ].forEach(ensureDir);

  const brandProfile = readCanonicalJsonWithLegacyFallback(safeProject, {
    domain: 'brand-profile',
    canonicalPath: paths.brandProfilePath,
    legacyCandidates: [paths.legacy.brandProfilePath],
    fallback: buildDefaultBrandProfile(safeProject, projectData)
  });

  const assetsRegistry = readCanonicalJsonWithLegacyFallback(safeProject, {
    domain: 'assets-registry',
    canonicalPath: paths.assetsRegistryPath,
    legacyCandidates: [paths.legacy.assetsRegistryPath, paths.legacy.mediaInputRegistryPath],
    fallback: [],
    normalize: normalizeAssetsRegistry
  });

  const sourcesRegistry = readCanonicalJsonWithLegacyFallback(safeProject, {
    domain: 'source-of-truth',
    canonicalPath: paths.sourceOfTruthRegistryPath,
    legacyCandidates: [paths.sourcesRegistryPath],
    fallback: buildSourceOfTruthRegistry({}),
    normalize: buildSourceOfTruthRegistry
  });

  ensureJsonFile(paths.sourcesRegistryPath, normalizeSourceRegistry(sourcesRegistry.value));
  ensureJsonFile(paths.aiCommandsPath, []);
  ensureJsonFile(paths.aiArtifactsPath, []);
  ensureJsonFile(paths.aiRecommendationsPath, []);
  ensureJsonFile(paths.aiMemoryPath, []);
  ensureJsonFile(paths.integrationControlCenterPath, {
    updated_at: '',
    records: {}
  });
  ensureJsonFile(paths.integrationsRegistryPath, {
    updated_at: '',
    records: {}
  });

  const integrationSnapshot = readJsonFile(paths.integrationControlCenterPath, {
    updated_at: '',
    records: {}
  });
  writeJsonFile(paths.integrationsRegistryPath, {
    updated_at: normalizeSetupTextValue(integrationSnapshot.updated_at) || new Date().toISOString(),
    records: integrationSnapshot.records && typeof integrationSnapshot.records === 'object'
      ? integrationSnapshot.records
      : {}
  });

  return {
    project: safeProject,
    checked_at: new Date().toISOString(),
    required_files: {
      project_file: {
        path: paths.projectFilePath,
        exists: fs.existsSync(paths.projectFilePath)
      },
      brand_profile: {
        path: paths.brandProfilePath,
        exists: fs.existsSync(paths.brandProfilePath),
        source: brandProfile.source,
        migrated: brandProfile.migrated
      },
      assets_registry: {
        path: paths.assetsRegistryPath,
        exists: fs.existsSync(paths.assetsRegistryPath),
        source: assetsRegistry.source,
        migrated: assetsRegistry.migrated
      },
      source_of_truth_registry: {
        path: paths.sourceOfTruthRegistryPath,
        exists: fs.existsSync(paths.sourceOfTruthRegistryPath),
        source: sourcesRegistry.source,
        migrated: sourcesRegistry.migrated
      },
      integrations_registry: {
        path: paths.integrationsRegistryPath,
        exists: fs.existsSync(paths.integrationsRegistryPath)
      },
      ai_commands: {
        path: paths.aiCommandsPath,
        exists: fs.existsSync(paths.aiCommandsPath)
      },
      ai_artifacts: {
        path: paths.aiArtifactsPath,
        exists: fs.existsSync(paths.aiArtifactsPath)
      },
      ai_recommendations: {
        path: paths.aiRecommendationsPath,
        exists: fs.existsSync(paths.aiRecommendationsPath)
      },
      ai_memory: {
        path: paths.aiMemoryPath,
        exists: fs.existsSync(paths.aiMemoryPath)
      },
      integrations: {
        path: paths.integrationControlCenterPath,
        exists: fs.existsSync(paths.integrationControlCenterPath)
      }
    },
    required_folders: {
      campaigns: { path: paths.campaignsDir, exists: fs.existsSync(paths.campaignsDir) },
      content: { path: paths.contentDir, exists: fs.existsSync(paths.contentDir) },
      media: { path: paths.mediaDir, exists: fs.existsSync(paths.mediaDir) },
      publishing: { path: paths.publishingDir, exists: fs.existsSync(paths.publishingDir) },
      reports: { path: paths.reportsDir, exists: fs.existsSync(paths.reportsDir) },
      execution: { path: paths.executionDir, exists: fs.existsSync(paths.executionDir) },
      telemetry: { path: paths.telemetryDir, exists: fs.existsSync(paths.telemetryDir) },
      logs: { path: paths.logsDir, exists: fs.existsSync(paths.logsDir) }
    }
  };
}

function persistProjectSetupArtifacts(projectName, projectData = {}) {
  const safeProject = normalizeProjectSlug(projectName);
  const paths = getProjectBaselinePaths(safeProject);
  const validation = ensureProjectBaselineFiles(safeProject, projectData);
  const existingBrandProfile = readJsonFile(paths.brandProfilePath, {});
  const brandProfile = buildBrandProfileFromProject(safeProject, projectData, existingBrandProfile);
  writeJsonFile(paths.brandProfilePath, brandProfile);

  const currentSources = normalizeSourceRegistry(readJsonFile(paths.sourcesRegistryPath, {}));
  const nextSources = { ...currentSources };
  if (projectData.website_url) {
    nextSources.website = {
      value: String(projectData.website_url || '').trim(),
      updated_at: new Date().toISOString(),
      source: 'setup',
      status: 'connected'
    };
  }

  const socialChannels = normalizeSetupListValue(projectData.social_channels || projectData.social_links);
  socialChannels.forEach((channel) => {
    const key = channel.toLowerCase();
    nextSources[key] = {
      value: key,
      updated_at: new Date().toISOString(),
      source: 'setup',
      status: 'connected'
    };
  });

  const projectSourceAliases = {
    product_files: projectData.product_files || projectData.products_file,
    brand_assets: projectData.brand_assets,
    legal_docs: projectData.legal_docs,
    pricing_docs: projectData.pricing_docs,
    campaign_docs: projectData.campaign_docs
  };

  Object.entries(projectSourceAliases).forEach(([sourceKey, value]) => {
    const normalized = normalizeSetupTextValue(value);
    if (!normalized) {
      return;
    }

    nextSources[sourceKey] = {
      value: normalized,
      updated_at: new Date().toISOString(),
      source: 'setup',
      status: 'connected'
    };
  });

  writeJsonFile(paths.sourcesRegistryPath, nextSources);
  writeJsonFile(paths.sourceOfTruthRegistryPath, buildSourceOfTruthRegistry(nextSources));

  return {
    ...validation,
    brand_profile_path: paths.brandProfilePath,
    assets_registry_path: paths.assetsRegistryPath,
    source_of_truth_registry_path: paths.sourceOfTruthRegistryPath,
    ai_memory_path: paths.aiMemoryPath,
    integrations_path: paths.integrationsRegistryPath
  };
}

function ensureProjectBaseStructure(projectName) {
  const paths = getProjectBasePaths(projectName);

  [
    paths.baseDir,
    paths.brandAssetsDir,
    paths.productsDir,
    paths.contentDir,
    paths.mediaDir,
    paths.campaignsDir,
    paths.publishingDir,
    paths.launchDir,
    paths.executionDir,
    paths.telemetryDir,
    paths.logsDir,
    paths.optimizationDir,
    paths.reportsDir,
    paths.integrationsDir,
    paths.uploadsDir
  ].forEach(ensureDir);

  return paths;
}

function createProject(projectName, market, language, projectType, websiteUrl) {
  const safeProject = normalizeProjectSlug(projectName);

  const registry = getProjectRegistryPaths();
  const projects = readJsonFile(registry.registryPath, []);

  const existing = projects.find(
    p => String(p.project_name || '').toLowerCase() === safeProject
  );

  if (existing) {
    throw new Error('Project already exists');
  }

  const paths = ensureProjectBaseStructure(safeProject);

  const projectData = {
    project_name: safeProject,
    market: market || '',
    language: language || '',
    project_type: projectType || '',
    website_url: websiteUrl || '',
    execution_mode: 'semi_auto',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: 'initialized',
    folders: {
      brand_assets: paths.brandAssetsDir,
      products: paths.productsDir,
      content: paths.contentDir,
      media: paths.mediaDir,
      campaigns: paths.campaignsDir,
      publishing: paths.publishingDir,
      launch: paths.launchDir,
      execution: paths.executionDir,
      telemetry: paths.telemetryDir,
      logs: paths.logsDir,
      optimization: paths.optimizationDir,
      reports: paths.reportsDir,
      integrations: paths.integrationsDir,
      uploads: paths.uploadsDir
    }
  };

  projects.push(projectData);
  writeJsonFile(registry.registryPath, projects);
  writeJsonFile(paths.projectFilePath, projectData);
  const baseline = persistProjectSetupArtifacts(safeProject, projectData);

  return {
    ...projectData,
    registry_path: registry.registryPath,
    project_file: paths.projectFilePath,
    baseline_validation: baseline
  };
}

function normalizeSetupTextValue(value) {
  if (value == null) return '';
  return String(value).trim();
}

function normalizeSetupListValue(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => normalizeSetupTextValue(item))
      .filter(Boolean);
  }

  return normalizeSetupTextValue(value)
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeProjectSetupPayload(payload = {}) {
  const input = payload && typeof payload === 'object' ? payload : {};
  const additionalFields = {
    business_type: normalizeSetupTextValue(input.business_type || input.project_type),
    tone: normalizeSetupTextValue(input.tone || input.brand_voice),
    positioning: normalizeSetupTextValue(input.positioning || input.offer_positioning || input.differentiation),
    audience: normalizeSetupTextValue(input.audience || input.audience_primary),
    goals: normalizeSetupListValue(input.goals),
    website: normalizeSetupTextValue(input.website || input.website_url),
    social_channels: normalizeSetupListValue(input.social_channels || input.social_links),
    product_files: normalizeSetupTextValue(input.product_files || input.products_file),
    brand_assets: normalizeSetupTextValue(input.brand_assets),
    legal_docs: normalizeSetupTextValue(input.legal_docs),
    pricing_docs: normalizeSetupTextValue(input.pricing_docs),
    campaign_docs: normalizeSetupTextValue(input.campaign_docs)
  };

  return {
    project_type: normalizeSetupTextValue(input.project_type),
    website_url: normalizeSetupTextValue(input.website_url),
    status: normalizeSetupTextValue(input.project_status || input.status),
    execution_mode: normalizeSetupTextValue(input.execution_mode),
    brand_name: normalizeSetupTextValue(input.brand_name),
    brand_promise: normalizeSetupTextValue(input.brand_promise),
    brand_voice: normalizeSetupTextValue(input.brand_voice),
    visual_identity: normalizeSetupTextValue(input.visual_identity),
    offer_positioning: normalizeSetupTextValue(input.offer_positioning),
    market: normalizeSetupTextValue(input.market),
    language: normalizeSetupTextValue(input.language),
    currency: normalizeSetupTextValue(input.currency),
    primary_goal: normalizeSetupTextValue(input.primary_goal),
    secondary_goal: normalizeSetupTextValue(input.secondary_goal),
    launch_window: normalizeSetupTextValue(input.launch_window),
    audience_primary: normalizeSetupTextValue(input.audience_primary),
    audience_problem: normalizeSetupTextValue(input.audience_problem),
    audience_geography: normalizeSetupTextValue(input.audience_geography),
    competitors: normalizeSetupListValue(input.competitors),
    differentiation: normalizeSetupTextValue(input.differentiation),
    operator_notes: normalizeSetupListValue(input.operator_notes),
    ...additionalFields,
    setup_payload: {
      ...input
    }
  };
}

function updateProjectSetup(projectName, payload = {}) {
  const safeProject = normalizeProjectSlug(projectName);
  const requestedProjectName = payload.project_name == null
    ? ''
    : normalizeProjectSlug(payload.project_name);

  if (requestedProjectName && requestedProjectName !== safeProject) {
    throw new Error('Project rename is not supported by Setup persistence');
  }

  const paths = getProjectBasePaths(safeProject);

  if (!fs.existsSync(paths.projectFilePath)) {
    throw new Error('Project not found');
  }

  const registry = getProjectRegistryPaths();
  const projects = readJsonFile(registry.registryPath, []);
  const current = readJsonFile(paths.projectFilePath, {});
  const normalized = normalizeProjectSetupPayload(payload);
  const updatedAt = new Date().toISOString();
  const nextProject = {
    ...current,
    ...normalized,
    updated_at: updatedAt
  };

  writeJsonFile(paths.projectFilePath, nextProject);

  const projectIndex = projects.findIndex(
    (project) => String(project?.project_name || '').trim().toLowerCase() === safeProject
  );

  if (projectIndex >= 0) {
    projects[projectIndex] = {
      ...projects[projectIndex],
      ...normalized,
      updated_at: updatedAt
    };
    writeJsonFile(registry.registryPath, projects);
  }

  const baseline = persistProjectSetupArtifacts(safeProject, nextProject);

  return {
    project: safeProject,
    saved_fields: Object.keys(normalized),
    updated_at: updatedAt,
    project_file: paths.projectFilePath,
    registry_path: registry.registryPath,
    baseline_validation: baseline,
    record: nextProject
  };
}

function listProjects() {
  const registry = getProjectRegistryPaths();
  return readJsonFile(registry.registryPath, []);
}

function reviewProject(projectName) {
  const paths = getProjectBasePaths(projectName);

  if (!fs.existsSync(paths.projectFilePath)) {
    throw new Error('Project not found');
  }

  return readJsonFile(paths.projectFilePath, {});
}

function reviewProjectCanonicalParity(projectName) {
  const safeProject = normalizeProjectSlug(projectName);
  const paths = getProjectBaselinePaths(safeProject);
  const checks = [];
  const mismatchLogPath = path.join(paths.opsDir, 'data-mismatches.json');

  const domains = [
    {
      domain: 'brand_profile',
      canonical_path: paths.brandProfilePath,
      legacy_path: paths.legacy.brandProfilePath
    },
    {
      domain: 'assets_registry',
      canonical_path: paths.assetsRegistryPath,
      legacy_path: paths.legacy.assetsRegistryPath
    },
    {
      domain: 'source_of_truth_registry',
      canonical_path: paths.sourceOfTruthRegistryPath,
      legacy_path: paths.sourcesRegistryPath
    }
  ];

  domains.forEach((item) => {
    const canonicalExists = fs.existsSync(item.canonical_path);
    const legacyExists = fs.existsSync(item.legacy_path);
    const canonicalRaw = canonicalExists ? readJsonFile(item.canonical_path, null) : null;
    const legacyRaw = legacyExists ? readJsonFile(item.legacy_path, null) : null;
    const canonicalValue = item.domain === 'source_of_truth_registry'
      ? normalizeSourceRegistry(canonicalRaw)
      : canonicalRaw;
    const legacyValue = item.domain === 'source_of_truth_registry'
      ? normalizeSourceRegistry(legacyRaw)
      : legacyRaw;
    const parity = canonicalExists && legacyExists
      ? stableJsonHash(canonicalValue) === stableJsonHash(legacyValue)
      : canonicalExists;

    if (canonicalExists && legacyExists && !parity) {
      logProjectDataMismatch(safeProject, {
        domain: item.domain,
        reason: 'canonical_legacy_parity_check_mismatch',
        canonical_path: item.canonical_path,
        legacy_path: item.legacy_path,
        canonical_hash: stableJsonHash(canonicalValue),
        legacy_hash: stableJsonHash(legacyValue)
      });
    }

    checks.push({
      domain: item.domain,
      canonical_path: item.canonical_path,
      legacy_path: item.legacy_path,
      canonical_exists: canonicalExists,
      legacy_exists: legacyExists,
      parity,
      fallback_in_use: !canonicalExists && legacyExists
    });
  });

  const mismatches = checks.filter((item) => !item.parity).length;
  const fallbackDependencies = checks.filter((item) => item.fallback_in_use).length;
  const report = {
    project: safeProject,
    generated_at: new Date().toISOString(),
    mismatches,
    fallback_dependencies: fallbackDependencies,
    checks,
    mismatch_log_path: mismatchLogPath,
    recommendation: fallbackDependencies > 0 || mismatches > 0
      ? 'Reduce fallback dependencies by keeping canonical files in sync before disabling legacy reads.'
      : 'Canonical files are aligned with available legacy data.'
  };

  const reportPath = path.join(paths.reportsDir, 'canonical-migration-report.json');
  writeJsonFile(reportPath, report);

  return {
    ...report,
    report_path: reportPath
  };
}

function reviewProjectReadiness(projectName) {
  const paths = getProjectBaselinePaths(projectName);

  if (!fs.existsSync(paths.projectFilePath)) {
    throw new Error('Project not found');
  }

  const safeProject = normalizeProjectSlug(projectName);
  const projectData = readJsonFile(paths.projectFilePath, {});
  const baselineValidation = ensureProjectBaselineFiles(safeProject, projectData);
  const brandProfile = readJsonFile(paths.brandProfilePath, {});
  const sourceRegistry = buildSourceOfTruthRegistry(readJsonFile(paths.sourcesRegistryPath, {}));
  const missingAssets = reviewProjectMissingAssets(safeProject);
  const connectorReadiness = reviewProjectConnectorReadiness(safeProject);
  const parityReport = reviewProjectCanonicalParity(safeProject);
  const campaigns = listCampaigns(safeProject, { limit: 50 });
  const aiMemoryItems = listAiMemory(safeProject, { limit: 20 });

  const setupFields = ['project_name', 'project_type', 'website_url', 'market', 'language', 'currency', 'primary_goal', 'audience_primary'];
  const setupCompleteCount = setupFields
    .filter((field) => Boolean(normalizeSetupTextValue(projectData[field])))
    .length;
  const setupCompleteness = Math.round((setupCompleteCount / setupFields.length) * 100);

  const brandFields = ['brand_name', 'business_type', 'market', 'language', 'currency', 'tone', 'positioning', 'audience', 'goals', 'website'];
  const brandCompleteCount = brandFields
    .filter((field) => {
      if (Array.isArray(brandProfile[field])) {
        return brandProfile[field].length > 0;
      }
      return Boolean(normalizeSetupTextValue(brandProfile[field]));
    })
    .length;
  const brandProfileCompleteness = Math.round((brandCompleteCount / brandFields.length) * 100);

  const requiredSourceEntries = sourceRegistry.required_sources && typeof sourceRegistry.required_sources === 'object'
    ? Object.values(sourceRegistry.required_sources)
    : [];
  const sourceCompleteCount = requiredSourceEntries
    .filter((entry) => ['connected', 'verified'].includes(normalizeSourceStatus(entry?.status)))
    .length;
  const sourceOfTruthCompleteness = requiredSourceEntries.length
    ? Math.round((sourceCompleteCount / requiredSourceEntries.length) * 100)
    : 0;

  const assetBlockers = Array.isArray(missingAssets.blockers) ? missingAssets.blockers.length : 0;
  const requiredAssetCount = Array.isArray(missingAssets.required_asset_types) ? missingAssets.required_asset_types.length : 0;
  const assetsCompleteness = requiredAssetCount
    ? Math.max(0, Math.round(((requiredAssetCount - assetBlockers) / requiredAssetCount) * 100))
    : 0;

  const integrationsCompleteness = Number(connectorReadiness.readiness_score || 0);
  const campaignReadiness = campaigns.length > 0 ? 100 : 40;
  const executionReadiness = fs.existsSync(paths.executionDir) && fs.existsSync(paths.opsDir) ? 100 : 0;
  const publishingReadiness = fs.existsSync(paths.publishingDir) ? 100 : 0;
  const aiMemoryReadiness = fs.existsSync(paths.aiMemoryPath)
    ? (aiMemoryItems.length > 0 ? 100 : 75)
    : 0;

  const domainScores = {
    setup_completeness: setupCompleteness,
    brand_profile_completeness: brandProfileCompleteness,
    source_of_truth_completeness: sourceOfTruthCompleteness,
    assets_completeness: assetsCompleteness,
    integrations_completeness: integrationsCompleteness,
    campaign_readiness: campaignReadiness,
    execution_readiness: executionReadiness,
    publishing_readiness: publishingReadiness,
    ai_memory_readiness: aiMemoryReadiness
  };

  const checks = {
    has_project_file: fs.existsSync(paths.projectFilePath),
    has_brand_assets_dir: fs.existsSync(paths.brandAssetsDir),
    has_products_dir: fs.existsSync(paths.productsDir),
    has_content_dir: fs.existsSync(paths.contentDir),
    has_media_dir: fs.existsSync(paths.mediaDir),
    has_campaigns_dir: fs.existsSync(paths.campaignsDir),
    has_publishing_dir: fs.existsSync(paths.publishingDir),
    has_launch_dir: fs.existsSync(paths.launchDir),
    has_execution_dir: fs.existsSync(paths.executionDir),
    has_telemetry_dir: fs.existsSync(paths.telemetryDir),
    has_logs_dir: fs.existsSync(paths.logsDir),
    has_optimization_dir: fs.existsSync(paths.optimizationDir),
    has_reports_dir: fs.existsSync(paths.reportsDir),
    has_integrations_dir: fs.existsSync(paths.integrationsDir),
    has_uploads_dir: fs.existsSync(paths.uploadsDir),
    has_brand_profile: baselineValidation.required_files.brand_profile.exists,
    has_assets_registry: baselineValidation.required_files.assets_registry.exists,
    has_source_of_truth_registry: baselineValidation.required_files.source_of_truth_registry.exists,
    has_integrations_registry: baselineValidation.required_files.integrations_registry.exists,
    has_ai_commands: baselineValidation.required_files.ai_commands.exists,
    has_ai_artifacts: baselineValidation.required_files.ai_artifacts.exists,
    has_ai_recommendations: baselineValidation.required_files.ai_recommendations.exists,
    has_ai_memory: baselineValidation.required_files.ai_memory.exists,
    has_integration_control_center: baselineValidation.required_files.integrations.exists,
    has_website_url: !!projectData.website_url,
    has_market: !!projectData.market,
    has_language: !!projectData.language,
    has_project_type: !!projectData.project_type
  };

  const missing = [];

  if (!checks.has_website_url) missing.push('website_url');
  if (!checks.has_market) missing.push('market');
  if (!checks.has_language) missing.push('language');
  if (!checks.has_project_type) missing.push('project_type');
  if (domainScores.brand_profile_completeness < 100) missing.push('brand_profile_incomplete');
  if (domainScores.source_of_truth_completeness < 100) missing.push('source_of_truth_incomplete');
  if (domainScores.assets_completeness < 100) missing.push('assets_incomplete');
  if (domainScores.integrations_completeness < 100) missing.push('integrations_incomplete');
  if (domainScores.campaign_readiness < 100) missing.push('campaign_readiness');
  if (domainScores.execution_readiness < 100) missing.push('execution_readiness');
  if (domainScores.publishing_readiness < 100) missing.push('publishing_readiness');
  if (domainScores.ai_memory_readiness < 100) missing.push('ai_memory_readiness');

  const totalChecks = Object.keys(checks).length;
  const passedChecks = Object.values(checks).filter(Boolean).length;
  const structuralReadinessScore = Math.round((passedChecks / totalChecks) * 100);
  const domainReadinessScore = Math.round(
    Object.values(domainScores).reduce((sum, score) => sum + score, 0) / Object.keys(domainScores).length
  );
  const readinessScore = Math.round((structuralReadinessScore + domainReadinessScore) / 2);

  return {
    project: safeProject,
    reviewed_at: new Date().toISOString(),
    readiness_score: readinessScore,
    structural_readiness_score: structuralReadinessScore,
    domain_readiness_score: domainReadinessScore,
    readiness_domains: domainScores,
    checks,
    missing,
    baseline_validation: baselineValidation,
    canonical_parity: parityReport,
    status: readinessScore >= 85 ? 'ready_for_data_upload' : 'needs_input'
  };
}
function getProjectAssetPaths(projectName) {
  const base = getProjectBaselinePaths(projectName);
  ensureProjectBaselineFiles(projectName);

  return base;
}

function normalizeAssetTags(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => normalizeSetupTextValue(item))
      .filter(Boolean);
  }

  return normalizeSetupListValue(value);
}

function normalizeAssetRecord(projectName, asset = {}) {
  const now = new Date().toISOString();
  const canonicalType = getCanonicalAssetType(asset.type || asset.asset_type) || normalizeSetupTextValue(asset.type || asset.asset_type).toLowerCase();
  const filePath = normalizeSetupTextValue(asset.file_path || asset.path);
  const fileName = normalizeSetupTextValue(asset.file_name || (filePath ? path.basename(filePath) : ''));
  const displayName = normalizeSetupTextValue(asset.display_name || asset.name || asset.title || fileName);
  const createdAt = normalizeSetupTextValue(asset.created_at || asset.registered_at) || now;
  const status = normalizeSetupTextValue(asset.status)
    || (normalizeSetupTextValue(asset.exists) === 'false' ? 'missing' : 'connected');
  const source = normalizeSetupTextValue(asset.source || asset.scan_source || asset.metadata?.scan_source || 'project_upload');
  const normalizedProject = normalizeProjectSlug(projectName);

  return {
    id: normalizeSetupTextValue(asset.id || asset.asset_id) || `asset_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    asset_id: normalizeSetupTextValue(asset.asset_id || asset.id) || `asset_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    file_name: fileName,
    file_path: filePath,
    name: displayName || fileName,
    title: normalizeSetupTextValue(asset.title || displayName || fileName),
    display_name: displayName || fileName,
    type: canonicalType,
    asset_type: canonicalType,
    project: normalizedProject,
    source,
    tags: normalizeAssetTags(asset.tags),
    status,
    readiness_status: normalizeSetupTextValue(asset.readiness_status || status) || status,
    review_status: normalizeSetupTextValue(asset.review_status || asset.readiness_status || status) || status,
    created_at: createdAt,
    updated_at: now,
    source_of_truth: Boolean(asset.source_of_truth || asset.use_as_source_of_truth),
    use_as_source_of_truth: Boolean(asset.use_as_source_of_truth || asset.source_of_truth),
    approved: Boolean(asset.approved),
    approved_at: normalizeSetupTextValue(asset.approved_at),
    approval_note: normalizeSetupTextValue(asset.approval_note),
    rejected: Boolean(asset.rejected),
    rejected_at: normalizeSetupTextValue(asset.rejected_at),
    rejection_note: normalizeSetupTextValue(asset.rejection_note),
    needs_review: Boolean(asset.needs_review),
    reviewed_at: normalizeSetupTextValue(asset.reviewed_at),
    reviewed_by: normalizeSetupTextValue(asset.reviewed_by),
    archived: Boolean(asset.archived),
    archived_at: normalizeSetupTextValue(asset.archived_at),
    archive_note: normalizeSetupTextValue(asset.archive_note),
    deleted: Boolean(asset.deleted),
    deleted_at: normalizeSetupTextValue(asset.deleted_at),
    deleted_by: normalizeSetupTextValue(asset.deleted_by),
    delete_note: normalizeSetupTextValue(asset.delete_note),
    source_of_truth_updated_at: normalizeSetupTextValue(asset.source_of_truth_updated_at),
    source_of_truth_updated_by: normalizeSetupTextValue(asset.source_of_truth_updated_by),
    renamed_at: normalizeSetupTextValue(asset.renamed_at),
    renamed_by: normalizeSetupTextValue(asset.renamed_by),
    exists: fs.existsSync(filePath),
    metadata: asset.metadata && typeof asset.metadata === 'object' ? asset.metadata : {}
  };
}

function registerProjectAsset(projectName, assetType, filePath) {
  const paths = getProjectAssetPaths(projectName);

  if (!fs.existsSync(paths.projectFilePath)) {
    throw new Error('Project not found');
  }

  const assets = readJsonFile(paths.assetsRegistryPath, [])
    .map((item) => normalizeAssetRecord(projectName, item));

  const record = normalizeAssetRecord(projectName, {
    type: assetType,
    file_path: filePath,
    source: 'project_upload',
    status: 'connected'
  });

  const withoutExisting = assets.filter((item) => item.file_path !== record.file_path || item.type !== record.type);
  withoutExisting.unshift(record);
  writeJsonFile(paths.assetsRegistryPath, withoutExisting);

  return {
    ...record,
    registry_path: paths.assetsRegistryPath
  };
}

function listProjectAssets(projectName) {
  const paths = getProjectAssetPaths(projectName);

  if (!fs.existsSync(paths.projectFilePath)) {
    throw new Error('Project not found');
  }

  const normalized = readJsonFile(paths.assetsRegistryPath, [])
    .map((item) => normalizeAssetRecord(projectName, item));
  writeJsonFile(paths.assetsRegistryPath, normalized);
  return normalized;
}

function setProjectSourceOfTruth(projectName, sourceType, sourceValue) {
  const paths = getProjectAssetPaths(projectName);

  if (!fs.existsSync(paths.projectFilePath)) {
    throw new Error('Project not found');
  }

  const normalizedType = String(sourceType || '').trim().toLowerCase();
  const normalizedValue = String(sourceValue || '').trim();
  const sources = readJsonFile(paths.sourcesRegistryPath, {});
  sources[normalizedType] = {
    value: normalizedValue,
    updated_at: new Date().toISOString(),
    status: 'connected'
  };

  writeJsonFile(paths.sourcesRegistryPath, sources);
  writeJsonFile(paths.sourceOfTruthRegistryPath, buildSourceOfTruthRegistry(sources));

  return {
    project: projectName,
    source_type: normalizedType,
    source_value: normalizedValue,
    registry_path: paths.sourcesRegistryPath
  };
}

function removeProjectSourceOfTruth(projectName, sourceType) {
  const paths = getProjectAssetPaths(projectName);

  if (!fs.existsSync(paths.projectFilePath)) {
    throw new Error('Project not found');
  }

  const normalizedSourceType = String(sourceType || '').trim().toLowerCase();
  const sources = readJsonFile(paths.sourcesRegistryPath, {});

  if (!normalizedSourceType) {
    throw new Error('Missing source type');
  }

  const existing = sources[normalizedSourceType] || null;
  delete sources[normalizedSourceType];
  writeJsonFile(paths.sourcesRegistryPath, sources);
  writeJsonFile(paths.sourceOfTruthRegistryPath, buildSourceOfTruthRegistry(sources));

  return {
    project: projectName,
    source_type: normalizedSourceType,
    removed: Boolean(existing),
    registry_path: paths.sourcesRegistryPath
  };
}

function reviewProjectSources(projectName) {
  const paths = getProjectAssetPaths(projectName);

  if (!fs.existsSync(paths.projectFilePath)) {
    throw new Error('Project not found');
  }

  return {
    project: projectName,
    sources: readJsonFile(paths.sourcesRegistryPath, {}),
    source_of_truth_registry: readJsonFile(paths.sourceOfTruthRegistryPath, buildSourceOfTruthRegistry({}))
  };
}

const LEGACY_SOURCE_TO_INTEGRATION_ID = {
  website: 'website',
  ecommerce: 'woocommerce',
  instagram: 'instagram',
  facebook: 'facebook',
  tiktok: 'tiktok',
  youtube: 'youtube',
  email: 'smtp',
  amazon: 'amazon',
  ebay: 'ebay',
  analytics: 'ga4',
  google: 'search-console'
};

function asPlainObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function normalizeTextValue(value) {
  return String(value == null ? '' : value).trim();
}

function normalizeStringArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return [...new Set(
    value
      .map(item => normalizeTextValue(item))
      .filter(Boolean)
  )];
}

function isSensitiveIntegrationField(fieldKey) {
  return /token|secret|password|key/i.test(String(fieldKey || ''));
}

function sanitizeIntegrationId(value) {
  return normalizeTextValue(value)
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/-{2,}/g, '-');
}

function getProjectIntegrationPaths(projectName) {
  const paths = getProjectBaselinePaths(projectName);

  if (!fs.existsSync(paths.projectFilePath)) {
    throw new Error('Project not found');
  }

  ensureProjectBaselineFiles(projectName);
  const controlCenterRegistryPath = paths.integrationControlCenterPath;
  ensureJsonFile(controlCenterRegistryPath, {
    updated_at: '',
    records: {}
  });
  ensureJsonFile(paths.integrationsRegistryPath, {
    updated_at: '',
    records: {}
  });

  return {
    ...paths,
    controlCenterRegistryPath
  };
}

function readProjectIntegrationRegistry(projectName) {
  const paths = getProjectIntegrationPaths(projectName);
  const raw = readJsonFile(paths.controlCenterRegistryPath, {
    updated_at: '',
    records: {}
  });

  return {
    ...raw,
    records: asPlainObject(raw.records),
    registry_path: paths.controlCenterRegistryPath
  };
}

function writeProjectIntegrationRegistry(projectName, registry = {}) {
  const paths = getProjectIntegrationPaths(projectName);
  const payload = {
    updated_at: new Date().toISOString(),
    records: asPlainObject(registry.records)
  };

  writeJsonFile(paths.controlCenterRegistryPath, payload);
  writeJsonFile(paths.integrationsRegistryPath, payload);

  return {
    ...payload,
    registry_path: paths.controlCenterRegistryPath
  };
}

function maskIntegrationCredentialValue(value) {
  if (!normalizeTextValue(value)) {
    return '';
  }

  return 'Saved on server';
}

function maskPrimaryValueForClient(record = {}) {
  const value = normalizeTextValue(record.primary_value);
  if (!value) {
    return '';
  }

  if (isSensitiveIntegrationField(record.primary_field)) {
    return maskIntegrationCredentialValue(value);
  }

  return value;
}

function summarizeCredentialState(credentials = {}, authFields = []) {
  const result = {};
  const credentialMap = asPlainObject(credentials);
  const keys = [...new Set([
    ...Object.keys(credentialMap),
    ...normalizeStringArray(authFields)
  ])];

  keys.forEach(key => {
    const storedValue = normalizeTextValue(credentialMap[key]);
    result[key] = {
      is_set: Boolean(storedValue),
      masked: storedValue ? maskIntegrationCredentialValue(storedValue) : ''
    };
  });

  return result;
}

function mergeIntegrationConfig(existing = {}, incoming = {}) {
  const next = {
    ...asPlainObject(existing)
  };

  Object.entries(asPlainObject(incoming)).forEach(([key, value]) => {
    const normalized = normalizeTextValue(value);
    if (normalized) {
      next[key] = normalized;
    }
  });

  return next;
}

function mergeIntegrationCredentials(existing = {}, incoming = {}) {
  const next = {
    ...asPlainObject(existing)
  };

  Object.entries(asPlainObject(incoming)).forEach(([key, value]) => {
    const normalized = normalizeTextValue(value);
    if (normalized) {
      next[key] = normalized;
    }
  });

  return next;
}

function getIntegrationCredentials(record = {}) {
  return asPlainObject(normalizeCredentials(record));
}

function buildIntegrationFieldSnapshot(record = {}) {
  const snapshot = {};
  const config = asPlainObject(record.config);
  const credentials = getIntegrationCredentials(record);

  Object.entries(config).forEach(([key, value]) => {
    snapshot[key] = Boolean(normalizeTextValue(value));
  });

  Object.entries(credentials).forEach(([key, value]) => {
    snapshot[key] = Boolean(normalizeTextValue(value));
  });

  if (normalizeTextValue(record.primary_field) && normalizeTextValue(record.primary_value)) {
    snapshot[record.primary_field] = true;
  }

  return snapshot;
}

function determineIntegrationStatus(record = {}) {
  const requiredFields = normalizeStringArray(record.required_fields);
  const fieldSnapshot = buildIntegrationFieldSnapshot(record);
  const missingRequired = requiredFields.filter(key => !fieldSnapshot[key]);
  const primaryValue = normalizeTextValue(record.primary_value);
  const hasCredentials = Object.values(getIntegrationCredentials(record))
    .some(value => Boolean(normalizeTextValue(value)));
  const hasConfig = Object.values(asPlainObject(record.config))
    .some(value => Boolean(normalizeTextValue(value)));
  const now = Date.now();
  const tokenExpiry = normalizeTextValue(record.token_expires_at);
  const tokenExpired = tokenExpiry && !Number.isNaN(new Date(tokenExpiry).getTime())
    ? new Date(tokenExpiry).getTime() <= now
    : false;
  const explicitStatus = normalizeTextValue(record.status).toLowerCase();

  let statusKey = 'not_connected';

  if (tokenExpired || explicitStatus === 'token_expired') {
    statusKey = 'token_expired';
  } else if (explicitStatus === 'error' || normalizeTextValue(record.last_error)) {
    statusKey = 'error';
  } else if (explicitStatus === 'not_connected' && !primaryValue && !hasConfig && !hasCredentials) {
    statusKey = 'not_connected';
  } else if (
    primaryValue &&
    missingRequired.length === 0 &&
    (!record.requires_credentials || hasCredentials)
  ) {
    statusKey = 'connected';
  } else if (primaryValue || hasConfig || hasCredentials) {
    statusKey = 'partial';
  }

  const statusLabelMap = {
    connected: 'Connected',
    partial: 'Partial',
    error: 'Error',
    token_expired: 'Token expired',
    not_connected: 'Not Connected'
  };

  let healthSummary = normalizeTextValue(record.health_summary);
  if (!healthSummary) {
    healthSummary = 'This integration is not configured yet.';
    if (statusKey === 'connected') {
      healthSummary = record.last_test_at
        ? `Connection healthy. Last verified ${record.last_test_at}.`
        : 'Connection is saved on the server and ready for sync.';
    } else if (statusKey === 'partial') {
      healthSummary = 'Some connection data is saved, but required setup is still incomplete.';
    } else if (statusKey === 'token_expired') {
      healthSummary = 'Saved credentials appear to be expired and need reconnect before sync can continue.';
    } else if (statusKey === 'error') {
      healthSummary = normalizeTextValue(record.last_error) || 'The last integration action failed.';
    }
  }

  return {
    status: statusKey,
    status_label: statusLabelMap[statusKey] || 'Not Connected',
    missing_required: missingRequired,
    health_summary: healthSummary
  };
}

function sanitizeIntegrationConfigForClient(record = {}) {
  const config = asPlainObject(record.config);
  const sanitized = {};

  Object.entries(config).forEach(([key, value]) => {
    if (!isSensitiveIntegrationField(key)) {
      sanitized[key] = normalizeTextValue(value);
    }
  });

  return sanitized;
}

function summarizeIntegrationRecord(record = {}) {
  const decryptedCredentials = getIntegrationCredentials(record);
  const normalizedRecord = {
    ...record,
    integration_id: sanitizeIntegrationId(record.integration_id),
    source_key: normalizeTextValue(record.source_key).toLowerCase(),
    primary_field: normalizeTextValue(record.primary_field),
    primary_value: normalizeTextValue(record.primary_value),
    config: asPlainObject(record.config),
    credentials: decryptedCredentials,
    auth_fields: normalizeStringArray(record.auth_fields),
    required_fields: normalizeStringArray(record.required_fields),
    data_scopes: normalizeStringArray(record.data_scopes),
    read_scopes: normalizeStringArray(record.read_scopes),
    write_scopes: normalizeStringArray(record.write_scopes),
    connection_method: normalizeTextValue(record.connection_method),
    permission_scope: normalizeTextValue(record.permission_scope),
    enables: normalizeTextValue(record.enables),
    notes: normalizeTextValue(record.notes),
    last_error: normalizeTextValue(record.last_error),
    token_expires_at: normalizeTextValue(record.token_expires_at),
    requires_credentials: Boolean(record.requires_credentials),
    sync_source_registry: Boolean(record.sync_source_registry)
  };

  const status = determineIntegrationStatus(normalizedRecord);
  const healthState = buildHealthState({
    status: status.status,
    last_error: normalizedRecord.last_error,
    health_summary: status.health_summary
  });

  return {
    integration_id: normalizedRecord.integration_id,
    source_key: normalizedRecord.source_key,
    status: status.status,
    status_label: status.status_label,
    primary_field: normalizedRecord.primary_field,
    primary_value: maskPrimaryValueForClient(normalizedRecord),
    config: sanitizeIntegrationConfigForClient(normalizedRecord),
    credential_state: summarizeCredentialState(normalizedRecord.credentials, normalizedRecord.auth_fields),
    auth_fields: normalizedRecord.auth_fields,
    required_fields: normalizedRecord.required_fields,
    missing_required: status.missing_required,
    data_scopes: normalizedRecord.data_scopes,
    read_scopes: normalizedRecord.read_scopes,
    write_scopes: normalizedRecord.write_scopes,
    connection_method: normalizedRecord.connection_method,
    permission_scope: normalizedRecord.permission_scope,
    enables: normalizedRecord.enables,
    requires_credentials: normalizedRecord.requires_credentials,
    last_sync_at: normalizeTextValue(normalizedRecord.last_sync_at),
    last_test_at: normalizeTextValue(normalizedRecord.last_test_at),
    last_import_at: normalizeTextValue(normalizedRecord.last_import_at),
    connected_at: normalizeTextValue(normalizedRecord.connected_at),
    disconnected_at: normalizeTextValue(normalizedRecord.disconnected_at),
    updated_at: normalizeTextValue(normalizedRecord.updated_at),
    token_expires_at: normalizedRecord.token_expires_at,
    last_error: normalizedRecord.last_error,
    notes: normalizedRecord.notes,
    health_summary: status.health_summary,
    health_state: healthState,
    legacy_source: Boolean(normalizedRecord.legacy_source),
    sync_source_registry: normalizedRecord.sync_source_registry,
    provider_metadata: asPlainObject(normalizedRecord.provider_metadata),
    last_sync_summary: asPlainObject(normalizedRecord.last_sync_summary),
    provider_account: asPlainObject(normalizedRecord.provider_account),
    insights_ready: asPlainObject(normalizedRecord.insights_ready)
  };
}

function buildLegacyIntegrationRecords(projectName) {
  const sourceReview = reviewProjectSources(projectName);
  const sources = asPlainObject(sourceReview.sources);
  const derived = {};

  Object.entries(LEGACY_SOURCE_TO_INTEGRATION_ID).forEach(([sourceKey, integrationId]) => {
    const source = asPlainObject(sources[sourceKey]);
    const value = normalizeTextValue(source.value);

    if (!value) {
      return;
    }

    derived[integrationId] = summarizeIntegrationRecord({
      integration_id: integrationId,
      source_key: sourceKey,
      status: 'connected',
      primary_field: 'legacy_source',
      primary_value: value,
      updated_at: normalizeTextValue(source.updated_at),
      connected_at: normalizeTextValue(source.updated_at),
      last_sync_at: normalizeTextValue(source.updated_at),
      notes: 'Connected through the legacy source registry.',
      legacy_source: true
    });
  });

  return derived;
}

function reviewProjectIntegrationControlCenter(projectName) {
  const registry = readProjectIntegrationRegistry(projectName);
  const records = {};

  Object.entries(asPlainObject(registry.records)).forEach(([integrationId, record]) => {
    const normalizedId = sanitizeIntegrationId(integrationId);
    if (!normalizedId) {
      return;
    }

    records[normalizedId] = summarizeIntegrationRecord({
      ...asPlainObject(record),
      integration_id: normalizedId
    });
  });

  const legacyRecords = buildLegacyIntegrationRecords(projectName);
  Object.entries(legacyRecords).forEach(([integrationId, record]) => {
    if (!records[integrationId]) {
      records[integrationId] = record;
    }
  });

  const all = Object.values(records);
  const summary = {
    connected: all.filter(item => item.status === 'connected').length,
    partial: all.filter(item => item.status === 'partial').length,
    error: all.filter(item => item.status === 'error').length,
    token_expired: all.filter(item => item.status === 'token_expired').length,
    not_connected: all.filter(item => item.status === 'not_connected').length
  };

  const lastGlobalSync = all
    .map(item => normalizeTextValue(item.last_sync_at))
    .filter(Boolean)
    .sort()
    .reverse()[0] || '';

  return {
    project: projectName,
    reviewed_at: new Date().toISOString(),
    registry_path: registry.registry_path,
    updated_at: normalizeTextValue(registry.updated_at),
    summary: {
      ...summary,
      total: all.length,
      last_global_sync: lastGlobalSync
    },
    records
  };
}

async function saveProjectIntegrationRecord(projectName, integrationId, payload = {}, options = {}) {
  const normalizedId = sanitizeIntegrationId(integrationId);

  if (!normalizedId) {
    throw new Error('Missing integration id');
  }

  if (!isSupportedProvider(normalizedId)) {
    throw Object.assign(new Error(getUnsupportedProviderMessage(normalizedId)), {
      status: 'unsupported_provider'
    });
  }

  const registry = readProjectIntegrationRegistry(projectName);
  const existing = asPlainObject(registry.records[normalizedId]);
  const now = new Date().toISOString();

  const sourceKey = normalizeTextValue(payload.source_key || existing.source_key).toLowerCase();
  const primaryField = normalizeTextValue(payload.primary_field || existing.primary_field);
  const mergedConfig = mergeIntegrationConfig(existing.config, payload.config);
  const mergedCredentials = mergeIntegrationCredentials(getIntegrationCredentials(existing), payload.credentials);
  const providedPrimaryValue = normalizeTextValue(payload.primary_value);
  const primaryFromConfig = primaryField ? normalizeTextValue(mergedConfig[primaryField]) : '';
  const primaryValue = providedPrimaryValue || normalizeTextValue(existing.primary_value) || primaryFromConfig;

  let nextRecord = {
    ...existing,
    integration_id: normalizedId,
    source_key: sourceKey,
    primary_field: primaryField,
    primary_value: primaryValue,
    config: mergedConfig,
    auth_fields: normalizeStringArray(
      payload.auth_fields || existing.auth_fields || Object.keys(mergedCredentials).filter(isSensitiveIntegrationField)
    ),
    required_fields: normalizeStringArray(payload.required_fields || existing.required_fields),
    data_scopes: normalizeStringArray(payload.data_scopes || existing.data_scopes),
    read_scopes: normalizeStringArray(payload.read_scopes || existing.read_scopes),
    write_scopes: normalizeStringArray(payload.write_scopes || existing.write_scopes),
    connection_method: normalizeTextValue(payload.connection_method || existing.connection_method),
    permission_scope: normalizeTextValue(payload.permission_scope || existing.permission_scope),
    enables: normalizeTextValue(payload.enables || existing.enables),
    requires_credentials:
      payload.requires_credentials == null
        ? Boolean(existing.requires_credentials || normalizeStringArray(payload.auth_fields).length)
        : Boolean(payload.requires_credentials),
    token_expires_at: normalizeTextValue(payload.token_expires_at || existing.token_expires_at),
    sync_source_registry:
      payload.sync_source_registry == null
        ? Boolean(existing.sync_source_registry)
        : Boolean(payload.sync_source_registry),
    last_error: '',
    notes: normalizeTextValue(
      payload.notes ||
      (options.reconnect
        ? 'Integration was reconnected from the Control Center.'
        : 'Integration connection was updated from the Control Center.')
    ),
    updated_at: now,
    connected_at: existing.connected_at || now
  };

  try {
    const providerResult = await executeAdapterAction({
      projectName,
      integrationId: normalizedId,
      projectPaths: getProjectIntegrationPaths(projectName),
      record: nextRecord,
      config: mergedConfig,
      credentials: mergedCredentials,
      primaryValue,
      actionType: options.reconnect ? 'reconnect' : 'connect'
    });

    nextRecord = {
      ...nextRecord,
      status: providerResult.status,
      token_expires_at: normalizeTextValue(providerResult.token_expires_at || nextRecord.token_expires_at),
      permission_scope: normalizeTextValue(providerResult.permission_scope || nextRecord.permission_scope),
      connection_method: normalizeTextValue(providerResult.connection_method || nextRecord.connection_method),
      data_scopes: normalizeStringArray(providerResult.data_scopes?.length ? providerResult.data_scopes : nextRecord.data_scopes),
      read_scopes: normalizeStringArray(providerResult.read_scopes?.length ? providerResult.read_scopes : nextRecord.read_scopes),
      write_scopes: normalizeStringArray(providerResult.write_scopes?.length ? providerResult.write_scopes : nextRecord.write_scopes),
      provider_metadata: asPlainObject(providerResult.metadata),
      provider_account: asPlainObject(providerResult.account),
      insights_ready: asPlainObject(providerResult.insights_ready),
      last_test_at: now,
      last_error: '',
      notes: normalizeTextValue(providerResult.notes || nextRecord.notes),
      health_summary: normalizeTextValue(providerResult.health || ''),
      health_state: asPlainObject(providerResult.health_state)
    };
  } catch (error) {
    const statusFromError = normalizeTextValue(error.status);
    const fallbackStatus = determineIntegrationStatus({
      ...nextRecord,
      credentials: mergedCredentials
    }).status;

    nextRecord = {
      ...nextRecord,
      status:
        statusFromError === 'token_expired'
          ? 'token_expired'
          : statusFromError === 'reconnect_required'
            ? 'partial'
            : fallbackStatus === 'connected'
              ? 'error'
              : fallbackStatus,
      last_error: normalizeTextValue(error.message || 'Integration validation failed'),
      notes: normalizeTextValue(error.message || nextRecord.notes),
      health_summary: normalizeTextValue(error.message || ''),
      health_state: buildHealthState({
        status:
          statusFromError === 'token_expired'
            ? 'token_expired'
            : statusFromError === 'reconnect_required'
              ? 'partial'
              : fallbackStatus === 'connected'
                ? 'error'
                : fallbackStatus,
        last_error: normalizeTextValue(error.message || 'Integration validation failed'),
        health_summary: normalizeTextValue(error.message || '')
      })
    };

    nextRecord = applyEncryptedCredentials(nextRecord, mergedCredentials);
    registry.records[normalizedId] = nextRecord;
    writeProjectIntegrationRegistry(projectName, registry);
    throw Object.assign(new Error(normalizeTextValue(error.message || 'Integration validation failed')), {
      status: normalizeTextValue(error.status || nextRecord.status)
    });
  }

  nextRecord = applyEncryptedCredentials(nextRecord, mergedCredentials);

  registry.records[normalizedId] = nextRecord;
  writeProjectIntegrationRegistry(projectName, registry);

  if (
    nextRecord.sync_source_registry &&
    sourceKey &&
    primaryValue &&
    ['connected', 'partial'].includes(String(nextRecord.status || '').toLowerCase())
  ) {
    setProjectSourceOfTruth(projectName, sourceKey, primaryValue);
  }

  return {
    project: projectName,
    record: summarizeIntegrationRecord(nextRecord),
    control_center: reviewProjectIntegrationControlCenter(projectName)
  };
}

function assertIntegrationReadyForAction(record = {}, actionLabel = 'run this action') {
  const status = determineIntegrationStatus(record);

  if (status.status === 'not_connected') {
    throw new Error(`Connect this integration before you ${actionLabel}.`);
  }

  if (status.status === 'partial') {
    throw new Error(`Finish the required connection details before you ${actionLabel}.`);
  }

  if (status.status === 'token_expired') {
    throw new Error(`Reconnect this integration because the saved token has expired.`);
  }
}

async function runProjectIntegrationAction(projectName, integrationId, actionType, payload = {}) {
  const normalizedId = sanitizeIntegrationId(integrationId);
  const registry = readProjectIntegrationRegistry(projectName);
  const existing = asPlainObject(registry.records[normalizedId]);

  if (!normalizedId || !Object.keys(existing).length) {
    throw new Error('Integration record not found');
  }

  if (actionType !== 'disconnect' && !isSupportedProvider(normalizedId)) {
    throw Object.assign(new Error(getUnsupportedProviderMessage(normalizedId)), {
      status: 'unsupported_provider'
    });
  }

  if (actionType !== 'disconnect') {
    assertIntegrationReadyForAction(existing, actionType === 'test' ? 'test the connection' : actionType);
  }

  const now = new Date().toISOString();
  const nextRecord = {
    ...existing,
    integration_id: normalizedId,
    updated_at: now,
    last_error: '',
    notes: normalizeTextValue(payload.notes || existing.notes)
  };

  if (actionType === 'disconnect') {
    nextRecord.status = 'not_connected';
    nextRecord.disconnected_at = now;
    nextRecord.notes = normalizeTextValue(payload.notes || 'Integration was disconnected from the Control Center.');

    if (existing.sync_source_registry && normalizeTextValue(existing.source_key)) {
      removeProjectSourceOfTruth(projectName, existing.source_key);
    }
  } else {
    try {
      const providerResult = await executeAdapterAction({
        projectName,
        integrationId: normalizedId,
        projectPaths: getProjectIntegrationPaths(projectName),
        record: existing,
        config: asPlainObject(existing.config),
        credentials: getIntegrationCredentials(existing),
        primaryValue: normalizeTextValue(existing.primary_value),
        actionType
      });

      nextRecord.status = providerResult.status;
      nextRecord.token_expires_at = normalizeTextValue(providerResult.token_expires_at || nextRecord.token_expires_at);
      nextRecord.provider_metadata = asPlainObject(providerResult.metadata);
      nextRecord.provider_account = asPlainObject(providerResult.account);
      nextRecord.insights_ready = asPlainObject(providerResult.insights_ready);
      nextRecord.last_error = '';
      nextRecord.notes = normalizeTextValue(providerResult.notes || nextRecord.notes);
      nextRecord.health_summary = normalizeTextValue(providerResult.health || '');
      nextRecord.health_state = asPlainObject(providerResult.health_state);

      if (actionType === 'test') {
        nextRecord.last_test_at = now;
      } else if (actionType === 'sync') {
        nextRecord.last_sync_at = now;
        nextRecord.last_sync_summary = asPlainObject(providerResult.sync_summary);
      } else if (actionType === 'import-history') {
        nextRecord.last_import_at = now;
        nextRecord.last_sync_summary = asPlainObject(providerResult.sync_summary);
      } else {
        throw new Error('Unsupported integration action');
      }
    } catch (error) {
      nextRecord.status =
        normalizeTextValue(error.status) === 'token_expired'
          ? 'token_expired'
          : normalizeTextValue(error.status) === 'reconnect_required'
            ? 'partial'
            : 'error';
      nextRecord.last_error = normalizeTextValue(error.message || 'Provider action failed');
      nextRecord.notes = normalizeTextValue(error.message || nextRecord.notes);
      nextRecord.health_summary = normalizeTextValue(error.message || '');
      nextRecord.health_state = buildHealthState({
        status: nextRecord.status,
        last_error: nextRecord.last_error,
        health_summary: nextRecord.health_summary
      });
      registry.records[normalizedId] = nextRecord;
      writeProjectIntegrationRegistry(projectName, registry);
      throw error;
    }
  }

  registry.records[normalizedId] = nextRecord;
  writeProjectIntegrationRegistry(projectName, registry);

  return {
    project: projectName,
    record: summarizeIntegrationRecord(nextRecord),
    control_center: reviewProjectIntegrationControlCenter(projectName)
  };
}

function reviewProjectMissingAssets(projectName) {
  const paths = getProjectAssetPaths(projectName);

  if (!fs.existsSync(paths.projectFilePath)) {
    throw new Error('Project not found');
  }

  const assets = readJsonFile(paths.assetsRegistryPath, []);
  const categoryReadiness = buildProjectAssetCategoryReadiness(projectName, assets);
  const required = getAssetTypeCatalog()
    .filter(item => item.required)
    .map(item => item.asset_type);
  const assetTypes = assets
    .map(item => getCanonicalAssetType(item.asset_type) || String(item.asset_type || '').trim().toLowerCase())
    .filter(Boolean);
  const missing = categoryReadiness.categories
    .filter(item => item.required && item.status === 'Missing')
    .map(item => item.asset_type);
  const blockers = categoryReadiness.categories
    .filter(item => item.required && ['Missing', 'Needs Review'].includes(item.status))
    .map(item => item.asset_type);

  return {
    project: projectName,
    reviewed_at: new Date().toISOString(),
    required_asset_types: required,
    registered_asset_types: [...new Set(assetTypes)].sort(),
    missing,
    blockers,
    category_readiness: categoryReadiness,
    status: blockers.length ? 'asset_blockers' : 'assets_ready'
  };
}
function getAssetTypeCatalog() {
  return [
    {
      asset_type: 'logo',
      label: 'Logo / Logo',
      purpose: 'brand_foundation',
      purpose_label: 'Brand foundation',
      required: true,
      allowed_extensions: ['.png', '.svg', '.jpg', '.jpeg', '.webp'],
      target_folder: 'brand-assets',
      aliases: [],
      description: 'Official brand logo.',
      guidance: {
        what_to_upload: 'Primary logo files, transparent logo variants, and approved lockups.',
        why_it_matters: 'Keeps setup, media creation, publishing previews, and AI output visually tied to the right brand.',
        used_in: ['Setup', 'Media Studio', 'Publishing', 'AI Command']
      }
    },
    {
      asset_type: 'brand_guideline',
      label: 'Brand Guideline / Markenrichtlinie',
      purpose: 'brand_foundation',
      purpose_label: 'Brand foundation',
      required: true,
      allowed_extensions: ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.md', '.txt'],
      target_folder: 'brand-assets',
      aliases: ['brand_guidelines', 'brand_guide', 'brand_reference_doc'],
      description: 'Brand identity, voice, visual rules, and usage guidance.',
      guidance: {
        what_to_upload: 'Brand book, tone guide, design system notes, claim rules, and visual do/dont guidance.',
        why_it_matters: 'Gives Setup, Content Studio, Media Studio, and AI Command the guardrails they need.',
        used_in: ['Setup', 'Campaign Studio', 'Content Studio', 'Media Studio', 'AI Command']
      }
    },
    {
      asset_type: 'product_csv',
      label: 'Product Data / Produktdaten',
      purpose: 'product_offers',
      purpose_label: 'Product and offers',
      required: true,
      allowed_extensions: ['.csv', '.xlsx', '.xls', '.json'],
      target_folder: 'products',
      aliases: ['product_data', 'product_feed', 'product_sheet'],
      description: 'Structured product data for planning, content, and campaign packaging.',
      guidance: {
        what_to_upload: 'SKU list, product names, descriptions, variants, ingredients, usage, and product URLs.',
        why_it_matters: 'Campaign Studio, Content Studio, Publishing, and AI Command need accurate product facts.',
        used_in: ['Campaign Studio', 'Content Studio', 'Publishing', 'AI Command']
      }
    },
    {
      asset_type: 'pricing_doc',
      label: 'Pricing & Offers / Preise & Angebote',
      purpose: 'product_offers',
      purpose_label: 'Product and offers',
      required: true,
      allowed_extensions: ['.pdf', '.doc', '.docx', '.csv', '.xlsx', '.xls', '.txt', '.md'],
      target_folder: 'content',
      aliases: ['pricing', 'price_list', 'offers', 'offer_doc'],
      description: 'Pricing, bundles, discounts, and commercial offer rules.',
      guidance: {
        what_to_upload: 'Price lists, offer sheets, bundles, campaign discounts, coupons, and margin guardrails.',
        why_it_matters: 'Prevents Campaign Studio, Publishing, and AI Command from inventing prices or offers.',
        used_in: ['Campaign Studio', 'Publishing', 'AI Command']
      }
    },
    {
      asset_type: 'legal_doc',
      label: 'Legal Documents / Rechtliche Dokumente',
      purpose: 'proof_compliance',
      purpose_label: 'Proof and compliance',
      required: true,
      allowed_extensions: ['.pdf', '.doc', '.docx', '.txt', '.md'],
      target_folder: 'content',
      aliases: ['legal', 'compliance_doc', 'terms_doc'],
      description: 'Policies, legal terms, disclaimers, and claim restrictions.',
      guidance: {
        what_to_upload: 'Terms, privacy policy, disclaimers, compliance notes, claim restrictions, and regulated copy rules.',
        why_it_matters: 'Publishing and AI Command need legal context before release or generated claims.',
        used_in: ['Content Studio', 'Publishing', 'AI Command']
      }
    },
    {
      asset_type: 'product_photos',
      label: 'Product Photos / Produktfotos',
      purpose: 'visual_media',
      purpose_label: 'Visual media',
      required: true,
      allowed_extensions: ['.png', '.jpg', '.jpeg', '.webp', '.avif'],
      target_folder: 'products',
      aliases: ['product_image', 'product_images', 'product_photo', 'product'],
      description: 'Approved product photography for content, media, ads, and publishing.',
      guidance: {
        what_to_upload: 'Clean product packshots, lifestyle product photos, before/after images where allowed, and hero crops.',
        why_it_matters: 'Content Studio, Media Studio, Campaign Studio, and Publishing need real product visuals.',
        used_in: ['Campaign Studio', 'Content Studio', 'Media Studio', 'Publishing', 'AI Command']
      }
    },
    {
      asset_type: 'product_videos',
      label: 'Product Videos / Produktvideos',
      purpose: 'visual_media',
      purpose_label: 'Visual media',
      required: true,
      allowed_extensions: ['.mp4', '.mov', '.webm', '.m4v'],
      target_folder: 'products',
      aliases: ['product_video', 'product_video_assets', 'video'],
      description: 'Approved product videos, demos, UGC clips, and cutdowns.',
      guidance: {
        what_to_upload: 'Product demos, UGC clips, reels, explainers, usage videos, and source cutdowns.',
        why_it_matters: 'Media Studio, Content Studio, Campaign Studio, and Publishing use video as creative source material.',
        used_in: ['Campaign Studio', 'Content Studio', 'Media Studio', 'Publishing', 'AI Command']
      }
    },
    {
      asset_type: 'social_assets',
      label: 'Social Assets / Social-Media-Assets',
      purpose: 'campaign_social',
      purpose_label: 'Campaign and social',
      required: true,
      allowed_extensions: ['.png', '.jpg', '.jpeg', '.webp', '.mp4', '.mov', '.pdf', '.psd', '.ai', '.fig'],
      target_folder: 'campaigns',
      aliases: ['social_asset', 'social_creatives', 'organic_social_assets'],
      description: 'Organic social creative, post visuals, reels, stories, and channel-ready source assets.',
      guidance: {
        what_to_upload: 'Organic post images, story frames, reels, thumbnails, channel templates, and captions references.',
        why_it_matters: 'Content Studio, Media Studio, Campaign Studio, and Publishing can reuse proven channel assets.',
        used_in: ['Campaign Studio', 'Content Studio', 'Media Studio', 'Publishing', 'AI Command']
      }
    },
    {
      asset_type: 'campaign_assets',
      label: 'Campaign Assets / Kampagnenmaterial',
      purpose: 'campaign_social',
      purpose_label: 'Campaign and social',
      required: true,
      allowed_extensions: ['.png', '.jpg', '.jpeg', '.webp', '.mp4', '.mov', '.pdf', '.doc', '.docx', '.html', '.zip'],
      target_folder: 'campaigns',
      aliases: ['campaign_asset', 'creative_assets', 'ad_assets'],
      description: 'Campaign-specific creative, copy, export packs, banners, and channel packages.',
      guidance: {
        what_to_upload: 'Campaign banners, ad creative, landing-page assets, email hero files, export packs, and wave-specific files.',
        why_it_matters: 'Campaign Studio and Publishing need a reusable package for each campaign or wave.',
        used_in: ['Campaign Studio', 'Content Studio', 'Media Studio', 'Publishing', 'AI Command']
      }
    },
    {
      asset_type: 'packaging_images',
      label: 'Packaging Images / Verpackungsbilder',
      purpose: 'visual_media',
      purpose_label: 'Visual media',
      required: true,
      allowed_extensions: ['.png', '.jpg', '.jpeg', '.webp', '.pdf'],
      target_folder: 'products',
      aliases: ['packaging_doc', 'packaging_image', 'packaging', 'label_image'],
      description: 'Packaging photos, labels, inserts, and box or bottle references.',
      guidance: {
        what_to_upload: 'Packaging photos, label artwork, inserts, box shots, bottle/jar details, and compliance label references.',
        why_it_matters: 'Media Studio and Publishing need packaging truth for product visuals and compliance checks.',
        used_in: ['Campaign Studio', 'Media Studio', 'Publishing', 'AI Command']
      }
    },
    {
      asset_type: 'testimonials_reviews',
      label: 'Testimonials & Reviews / Kundenstimmen & Bewertungen',
      purpose: 'proof_compliance',
      purpose_label: 'Proof and compliance',
      required: true,
      allowed_extensions: ['.pdf', '.doc', '.docx', '.txt', '.md', '.csv', '.xlsx', '.png', '.jpg', '.jpeg'],
      target_folder: 'content',
      aliases: ['testimonial', 'testimonials', 'review', 'reviews'],
      description: 'Customer proof, reviews, testimonial exports, and approved quotes.',
      guidance: {
        what_to_upload: 'Review exports, testimonial docs, approved screenshots, quote permissions, and proof notes.',
        why_it_matters: 'Content Studio, Campaign Studio, Publishing, and AI Command need trusted proof points.',
        used_in: ['Campaign Studio', 'Content Studio', 'Publishing', 'AI Command']
      }
    },
    {
      asset_type: 'certificates',
      label: 'Certificates / Zertifikate',
      purpose: 'proof_compliance',
      purpose_label: 'Proof and compliance',
      required: true,
      allowed_extensions: ['.pdf', '.png', '.jpg', '.jpeg', '.doc', '.docx'],
      target_folder: 'content',
      aliases: ['certificate', 'certification', 'certifications', 'cert'],
      description: 'Certifications, lab reports, awards, and official proof documents.',
      guidance: {
        what_to_upload: 'Certificates, compliance proof, awards, lab reports, or official authorization documents.',
        why_it_matters: 'Publishing and AI Command can use only approved proof when making trust or compliance claims.',
        used_in: ['Content Studio', 'Publishing', 'AI Command']
      }
    },
    {
      asset_type: 'partner_docs',
      label: 'Partner Documents / Partnerdokumente',
      purpose: 'partnerships',
      purpose_label: 'Partnerships',
      required: true,
      allowed_extensions: ['.pdf', '.doc', '.docx', '.txt', '.md', '.csv', '.xlsx'],
      target_folder: 'content',
      aliases: ['partner_doc', 'partner_document', 'supplier_doc', 'partner_material'],
      description: 'Partner, supplier, distributor, marketplace, and collaboration documents.',
      guidance: {
        what_to_upload: 'Partner briefs, supplier docs, marketplace requirements, distributor notes, and collaboration agreements.',
        why_it_matters: 'Campaign Studio, Publishing, and AI Command need partner constraints before reuse or release.',
        used_in: ['Campaign Studio', 'Publishing', 'AI Command']
      }
    }
  ];
}

function getCanonicalAssetType(assetType) {
  const normalized = String(assetType || '').trim().toLowerCase();
  if (!normalized) return '';

  for (const item of getAssetTypeCatalog()) {
    const values = [item.asset_type, ...(item.aliases || [])].map(value => String(value || '').trim().toLowerCase());
    if (values.includes(normalized)) {
      return item.asset_type;
    }
  }

  return '';
}

function getAssetCategoryDefinition(assetType) {
  const canonicalType = getCanonicalAssetType(assetType);
  return getAssetTypeCatalog().find(item => item.asset_type === canonicalType) || null;
}

function getAssetCategoryStatus(asset, projectName) {
  const record = asset || {};
  const explicitStatus = String(
    record.readiness_status ||
    record.review_status ||
    record.approval_status ||
    record.status ||
    ''
  ).trim().toLowerCase();

  if (record.approved === true || ['approved', 'ready_approved'].includes(explicitStatus)) {
    return 'Approved';
  }

  const filePath = String(record.file_path || record.local_path || '').trim();
  const exists = filePath ? fs.existsSync(filePath) : record.exists === true;
  if (!exists || record.exists === false) {
    return 'Needs Review';
  }

  try {
    const folderInfo = getTargetFolderForAssetType(projectName, record.asset_type);
    if (filePath && !filePath.startsWith(folderInfo.target_dir)) {
      return 'Needs Review';
    }
  } catch (_) {
    return 'Needs Review';
  }

  if (['needs_review', 'review', 'blocked', 'rejected'].includes(explicitStatus)) {
    return 'Needs Review';
  }

  return 'Uploaded';
}

function listFilesByExtensions(rootDir, extensions = [], recursive = true) {
  if (!rootDir || !fs.existsSync(rootDir)) {
    return [];
  }

  const allow = new Set((extensions || []).map(ext => String(ext || '').trim().toLowerCase()));
  const queue = [rootDir];
  const files = [];

  while (queue.length) {
    const current = queue.shift();
    const entries = fs.readdirSync(current, { withFileTypes: true });

    entries.forEach((entry) => {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (recursive) {
          queue.push(fullPath);
        }
        return;
      }

      if (!entry.isFile()) {
        return;
      }

      const extension = path.extname(entry.name).toLowerCase();
      if (!allow.size || allow.has(extension)) {
        files.push(fullPath);
      }
    });
  }

  return files.sort((a, b) => a.localeCompare(b));
}

function listDirectChildDirectories(rootDir) {
  if (!rootDir || !fs.existsSync(rootDir)) {
    return [];
  }

  return fs.readdirSync(rootDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

function parseCsvDocument(csvRaw = '') {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let index = 0; index < csvRaw.length; index += 1) {
    const char = csvRaw[index];
    const next = csvRaw[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        field += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (!inQuotes && char === ',') {
      row.push(field);
      field = '';
      continue;
    }

    if (!inQuotes && (char === '\n' || char === '\r')) {
      if (char === '\r' && next === '\n') {
        index += 1;
      }

      row.push(field);
      const hasAnyValue = row.some(value => String(value || '').length > 0);
      if (hasAnyValue) {
        rows.push(row);
      }
      row = [];
      field = '';
      continue;
    }

    field += char;
  }

  if (field.length || row.length) {
    row.push(field);
    const hasAnyValue = row.some(value => String(value || '').length > 0);
    if (hasAnyValue) {
      rows.push(row);
    }
  }

  return rows;
}

function normalizeLibraryFolderCandidate(value = '') {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function listFrontImageFiles(rootDir) {
  return listFilesByExtensions(rootDir, ['.png'], true)
    .filter(filePath => path.basename(filePath).toLowerCase() === 'front.png');
}

function buildProjectLibraryFilesystemScan(projectName) {
  const safeProject = normalizeProjectSlug(projectName);
  const basePaths = getProjectBasePaths(safeProject);
  const brandPaths = getProjectBrandPaths(safeProject);

  const projectProductsDir = basePaths.productsDir;
  const brandProductCsvDirs = uniqueValues([
    path.join(brandPaths.baseDir, 'product_csv'),
    path.join(brandPaths.legacyBaseDir, 'product_csv'),
    path.join(LEGACY_BRAND_ASSETS_DIR, safeProject, 'product_csv')
  ]);
  const brandProductImageDirs = uniqueValues([
    path.join(brandPaths.baseDir, 'products', 'images'),
    path.join(brandPaths.legacyBaseDir, 'products', 'images'),
    path.join(LEGACY_BRAND_ASSETS_DIR, safeProject, 'products', 'images')
  ]);
  const brandProductVideoDirs = uniqueValues([
    path.join(brandPaths.baseDir, 'products', 'videos'),
    path.join(brandPaths.legacyBaseDir, 'products', 'videos'),
    path.join(LEGACY_BRAND_ASSETS_DIR, safeProject, 'products', 'videos')
  ]);

  const productDataExtensions = ['.csv', '.xlsx', '.xls', '.json'];
  const csvValidationExtensions = new Set(['.csv']);

  const projectProductDataFiles = listFilesByExtensions(projectProductsDir, productDataExtensions, true);
  const mirrorProductDataFiles = uniqueValues(brandProductCsvDirs.flatMap((dirPath) => listFilesByExtensions(dirPath, productDataExtensions, true)));

  const preferredCsvFile = projectProductDataFiles.find(filePath =>
    path.basename(filePath).toLowerCase().includes('product_master') && csvValidationExtensions.has(path.extname(filePath).toLowerCase())
  ) || projectProductDataFiles.find(filePath => csvValidationExtensions.has(path.extname(filePath).toLowerCase()))
    || mirrorProductDataFiles.find(filePath => csvValidationExtensions.has(path.extname(filePath).toLowerCase()))
    || '';

  const csvValidation = {
    csv_file: preferredCsvFile,
    rows_total: 0,
    missing_product_name_rows: 0,
    missing_image_folder_rows: 0,
    csv_product_folders: [],
    matched_product_rows: [],
    missing_product_rows: []
  };

  const frontFiles = uniqueValues(brandProductImageDirs.flatMap((dirPath) => listFrontImageFiles(dirPath)));
  const frontFolderNames = [...new Set(frontFiles.map((filePath) => {
    const matchedRoot = brandProductImageDirs.find((dirPath) => filePath === dirPath || filePath.startsWith(`${dirPath}${path.sep}`));
    if (!matchedRoot) {
      return path.basename(path.dirname(filePath));
    }

    return path.relative(matchedRoot, path.dirname(filePath)).replace(/\\/g, '/');
  }))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
  const frontFolderSet = new Set(frontFolderNames);

  if (preferredCsvFile && fs.existsSync(preferredCsvFile) && csvValidationExtensions.has(path.extname(preferredCsvFile).toLowerCase())) {
    const raw = fs.readFileSync(preferredCsvFile, 'utf8').replace(/^\uFEFF/, '');
    const parsedRows = parseCsvDocument(raw);

    if (parsedRows.length) {
      const headers = parsedRows[0].map(value => String(value || '').trim());
      const productNameIndex = headers.findIndex(value => value.toLowerCase() === 'product name');
      const imageFolderIndex = headers.findIndex(value => value.toLowerCase() === 'image folder');
      const dataRows = parsedRows.slice(1);

      csvValidation.rows_total = dataRows.length;

      dataRows.forEach((dataRow, rowIndex) => {
        const productName = productNameIndex >= 0 ? String(dataRow[productNameIndex] || '').trim() : '';
        const imageFolder = imageFolderIndex >= 0 ? String(dataRow[imageFolderIndex] || '').trim() : '';
        const candidates = [
          imageFolder,
          normalizeLibraryFolderCandidate(productName)
        ].filter((value, index, array) => value && array.indexOf(value) === index);
        const expectedFolder = imageFolder || candidates[0] || '';
        const matchedFolder = candidates.find(candidate => frontFolderSet.has(candidate)) || '';

        if (!productName) {
          csvValidation.missing_product_name_rows += 1;
        }
        if (!imageFolder) {
          csvValidation.missing_image_folder_rows += 1;
        }

        candidates.forEach((candidate) => {
          csvValidation.csv_product_folders.push(candidate);
        });

        if (matchedFolder) {
          csvValidation.matched_product_rows.push({
            row_number: rowIndex + 2,
            product_name: productName || '',
            expected_folder: expectedFolder,
            matched_folder: matchedFolder
          });
          return;
        }

        csvValidation.missing_product_rows.push({
          row_number: rowIndex + 2,
          product_name: productName || '',
          expected_folder: expectedFolder,
          candidate_folders: candidates
        });
      });
    }
  }

  const imageFolders = uniqueValues(brandProductImageDirs.flatMap((dirPath) => listDirectChildDirectories(dirPath)));
  const foldersMissingFront = imageFolders.filter((folderName) => !frontFolderSet.has(folderName));
  const csvFolderSet = new Set(csvValidation.csv_product_folders.filter(Boolean));
  const extraImageFolders = frontFolderNames.filter(folder => !csvFolderSet.has(folder));
  const missingImageFolders = csvValidation.missing_product_rows
    .map((item) => item.expected_folder || item.product_name)
    .filter(Boolean);
  const logicalProductDataFiles = [...new Set(projectProductDataFiles.concat(mirrorProductDataFiles).map(filePath => path.basename(filePath).toLowerCase()))];

  const productVideoFiles = uniqueValues(brandProductVideoDirs.flatMap((dirPath) => listFilesByExtensions(dirPath, ['.mp4', '.mov', '.webm', '.m4v'], true)));

  const scannedAssets = [];

  projectProductDataFiles.concat(mirrorProductDataFiles).forEach((filePath) => {
    scannedAssets.push({
      asset_type: 'product_csv',
      file_path: filePath,
      exists: true,
      scan_source: filePath.startsWith(projectProductsDir) ? 'project_products' : 'brand_product_csv'
    });
  });

  frontFiles.forEach((filePath) => {
    scannedAssets.push({
      asset_type: 'product_photos',
      file_path: filePath,
      exists: true,
      scan_source: 'brand_products_images_recursive'
    });
  });

  productVideoFiles.forEach((filePath) => {
    scannedAssets.push({
      asset_type: 'product_videos',
      file_path: filePath,
      exists: true,
      scan_source: 'brand_products_videos_recursive'
    });
  });

  return {
    project: safeProject,
    generated_at: new Date().toISOString(),
    paths: {
      project_products: projectProductsDir,
      brand_product_csv: brandProductCsvDirs,
      brand_product_images: brandProductImageDirs,
      brand_product_videos: brandProductVideoDirs
    },
    product_csv: {
      canonical_files: projectProductDataFiles,
      mirror_files: mirrorProductDataFiles,
      total_files: projectProductDataFiles.length + mirrorProductDataFiles.length,
      logical_files: logicalProductDataFiles.length,
      valid_files: projectProductDataFiles.concat(mirrorProductDataFiles).length,
      preferred_source: preferredCsvFile,
      status: projectProductDataFiles.concat(mirrorProductDataFiles).length > 0 ? 'Uploaded' : 'Missing',
      count_label: `${logicalProductDataFiles.length} file${logicalProductDataFiles.length === 1 ? '' : 's'}`,
      detection_summary: [
        `Detected ${logicalProductDataFiles.length} logical product data file(s) across ${projectProductDataFiles.length + mirrorProductDataFiles.length} physical location(s).`,
        `Canonical project files: ${projectProductDataFiles.length}.`,
        `Brand mirror files: ${mirrorProductDataFiles.length}.`
      ],
      csv_validation: {
        csv_file: csvValidation.csv_file,
        rows_total: csvValidation.rows_total,
        missing_product_name_rows: csvValidation.missing_product_name_rows,
        missing_image_folder_rows: csvValidation.missing_image_folder_rows
      }
    },
    product_photos: {
      total_product_folders: imageFolders.length,
      folders_with_front_image: frontFolderNames.length,
      folders_missing_front_image: foldersMissingFront.length,
      missing_front_folders: foldersMissingFront,
      csv_products_total: csvValidation.rows_total,
      csv_products_matched_front: csvValidation.matched_product_rows.length,
      csv_products_missing_front: csvValidation.missing_product_rows.length,
      csv_missing_front_folders: missingImageFolders,
      extra_image_folders: extraImageFolders,
      count_label: `${csvValidation.matched_product_rows.length}/${csvValidation.rows_total} matched`,
      missing_product_rows: csvValidation.missing_product_rows,
      status:
        csvValidation.rows_total > 0
          ? (csvValidation.missing_product_rows.length ? 'Needs Review' : (csvValidation.matched_product_rows.length ? 'Uploaded' : 'Missing'))
          : (frontFolderNames.length ? 'Uploaded' : 'Missing'),
      detection_summary: [
        `Matched front images for ${csvValidation.matched_product_rows.length} of ${csvValidation.rows_total} CSV products.`,
        `Missing images for ${csvValidation.missing_product_rows.length} CSV product(s).`,
        `Detected ${frontFolderNames.length} image folder(s) with front.png and ${extraImageFolders.length} extra folder(s) not referenced by the CSV.`
      ],
      front_files: frontFiles
    },
    product_videos: {
      total_files: productVideoFiles.length,
      status: productVideoFiles.length ? 'Uploaded' : 'Missing',
      files: productVideoFiles
    },
    scanned_assets: scannedAssets
  };
}

function refreshProjectLibraryRegistry(projectName) {
  const safeProject = normalizeProjectSlug(projectName);
  const basePaths = getProjectBasePaths(safeProject);
  const assetsRegistryPath = path.join(basePaths.baseDir, 'assets-registry.json');
  const hasAssetRegistry = fs.existsSync(assetsRegistryPath);

  if (!fs.existsSync(basePaths.projectFilePath)) {
    throw new Error('Project not found');
  }

  const existingAssets = hasAssetRegistry
    ? readJsonFile(assetsRegistryPath, []).map((asset) => normalizeAssetRecord(safeProject, asset))
    : [];
  const scan = buildProjectLibraryFilesystemScan(safeProject);
  const managedTypes = new Set(['product_csv', 'product_photos', 'product_videos']);
  const now = new Date().toISOString();

  const existingByKey = new Map();
  existingAssets.forEach((asset) => {
    const canonicalType = getCanonicalAssetType(asset.type || asset.asset_type) || String(asset.type || asset.asset_type || '').trim().toLowerCase();
    const filePath = String(asset.file_path || '').trim();
    if (!canonicalType || !filePath) {
      return;
    }
    const key = `${canonicalType}::${filePath}`;
    existingByKey.set(key, asset);
  });

  const retained = existingAssets.filter((asset) => {
    const canonicalType = getCanonicalAssetType(asset.type || asset.asset_type) || String(asset.type || asset.asset_type || '').trim().toLowerCase();
    const managedByRefresh = String(asset?.metadata?.managed_by || '').trim().toLowerCase() === 'library_refresh';
    return !(managedTypes.has(canonicalType) && managedByRefresh);
  });

  const refreshedAssets = [];
  scan.scanned_assets.forEach((scanned) => {
    const canonicalType = getCanonicalAssetType(scanned.asset_type) || String(scanned.asset_type || '').trim().toLowerCase();
    const filePath = String(scanned.file_path || '').trim();
    if (!managedTypes.has(canonicalType) || !filePath) {
      return;
    }

    const key = `${canonicalType}::${filePath}`;
    const previous = existingByKey.get(key) || {};

    refreshedAssets.push(normalizeAssetRecord(safeProject, {
      ...previous,
      id: previous.id || previous.asset_id,
      type: canonicalType,
      file_path: filePath,
      source: previous.source || scanned.scan_source || 'library_refresh',
      source_of_truth: previous.source_of_truth,
      status: fs.existsSync(filePath) ? 'connected' : 'missing',
      created_at: previous.created_at || previous.registered_at || now,
      metadata: {
        ...(previous.metadata && typeof previous.metadata === 'object' ? previous.metadata : {}),
        managed_by: 'library_refresh',
        scan_source: scanned.scan_source || 'library_refresh',
        refreshed_at: now
      }
    }));
  });

  const nextAssets = retained.concat(refreshedAssets);

  if (hasAssetRegistry) {
    writeJsonFile(assetsRegistryPath, nextAssets);
  }

  const categoryReadiness = buildProjectAssetCategoryReadiness(safeProject, nextAssets, {
    filesystemScan: scan
  });

  return {
    project: safeProject,
    refreshed_at: now,
    categories: categoryReadiness.categories,
    product_csv: scan.product_csv,
    product_photos: scan.product_photos,
    missing_images: scan.product_photos?.csv_missing_front_folders || [],
    extra_image_folders: scan.product_photos?.extra_image_folders || [],
    registry_path: hasAssetRegistry ? assetsRegistryPath : null,
    registry_updated: hasAssetRegistry,
    previous_total_assets: existingAssets.length,
    refreshed_assets_added: refreshedAssets.length,
    total_assets: nextAssets.length,
    filesystem_scan: scan,
    category_readiness: categoryReadiness
  };
}

function buildProjectAssetCategoryReadiness(projectName, assetsInput = null, options = {}) {
  const assets = Array.isArray(assetsInput) ? assetsInput : listProjectAssets(projectName);
  const filesystemScan = options.filesystemScan || buildProjectLibraryFilesystemScan(projectName);
  const catalog = getAssetTypeCatalog();
  const categories = catalog.map(item => {
    const matchingAssets = assets.filter(asset => getCanonicalAssetType(asset.asset_type) === item.asset_type);
    const statuses = matchingAssets.map(asset => getAssetCategoryStatus(asset, projectName));
    let status =
      !matchingAssets.length
        ? 'Missing'
        : statuses.includes('Approved')
          ? 'Approved'
          : statuses.includes('Uploaded')
            ? 'Uploaded'
            : 'Needs Review';

    let count = matchingAssets.length;
    let uploadedCount = statuses.filter(value => value === 'Uploaded').length;
    let approvedCount = statuses.filter(value => value === 'Approved').length;
    let needsReviewCount = statuses.filter(value => value === 'Needs Review').length;
    let detectionSummary = [];

    if (item.asset_type === 'product_csv') {
      const metrics = filesystemScan.product_csv || {};
      status = metrics.status || status;
      count = Number(metrics.logical_files || metrics.total_files || 0);
      uploadedCount = status === 'Uploaded' ? Math.max(1, count) : 0;
      approvedCount = 0;
      needsReviewCount = status === 'Needs Review' ? Math.max(1, count) : 0;
      detectionSummary = Array.isArray(metrics.detection_summary) ? metrics.detection_summary : [];
    } else if (item.asset_type === 'product_photos') {
      const metrics = filesystemScan.product_photos || {};
      status = metrics.status || status;
      count = Number(metrics.csv_products_matched_front || 0);
      uploadedCount = Number(metrics.csv_products_matched_front || 0);
      approvedCount = 0;
      needsReviewCount = Number(metrics.csv_products_missing_front || 0) > 0 ? 1 : 0;
      detectionSummary = Array.isArray(metrics.detection_summary) ? metrics.detection_summary : [];
    }

    const blocker = item.required && ['Missing', 'Needs Review'].includes(status);
    const uploadedAssets = matchingAssets
      .filter(asset => getAssetCategoryStatus(asset, projectName) === 'Uploaded')
      .map(asset => asset.asset_id || path.basename(String(asset.file_path || '')))
      .filter(Boolean);
    const approvedAssets = matchingAssets
      .filter(asset => getAssetCategoryStatus(asset, projectName) === 'Approved')
      .map(asset => asset.asset_id || path.basename(String(asset.file_path || '')))
      .filter(Boolean);

    return {
      asset_type: item.asset_type,
      internal_key: item.asset_type,
      label: item.label,
      display_label: item.label,
      purpose: item.purpose,
      purpose_label: item.purpose_label,
      required: item.required,
      allowed_extensions: item.allowed_extensions,
      accepted_file_types: item.allowed_extensions,
      target_folder: item.target_folder,
      aliases: item.aliases || [],
      description: item.description,
      guidance: item.guidance,
      status,
      blocker,
      count,
      count_label:
        item.asset_type === 'product_csv'
          ? (filesystemScan.product_csv?.count_label || `${count} file${count === 1 ? '' : 's'}`)
          : item.asset_type === 'product_photos'
            ? (filesystemScan.product_photos?.count_label || `${count} file${count === 1 ? '' : 's'}`)
            : `${count} file${count === 1 ? '' : 's'}`,
      uploaded_count: uploadedCount,
      approved_count: approvedCount,
      needs_review_count: needsReviewCount,
      detection_summary: detectionSummary,
      asset_ids: matchingAssets.map(asset => asset.asset_id).filter(Boolean),
      uploaded_assets: uploadedAssets,
      approved_assets: approvedAssets,
      next_action:
        item.asset_type === 'product_photos' && status === 'Needs Review'
          ? `Upload missing product front images. Currently matched ${filesystemScan.product_photos?.csv_products_matched_front || 0} of ${filesystemScan.product_photos?.csv_products_total || 0}.`
          : status === 'Missing'
          ? `Upload ${item.label}.`
          : status === 'Needs Review'
            ? `Review ${item.label} classification, file availability, or folder placement.`
            : status === 'Uploaded'
              ? `Review and approve ${item.label} when ready.`
              : `${item.label} is approved.`
    };
  });

  const summary = categories.reduce((acc, item) => {
    const key = item.status.toLowerCase().replace(/\s+/g, '_');
    acc[key] = (acc[key] || 0) + 1;
    if (item.blocker) acc.blockers += 1;
    return acc;
  }, {
    total: categories.length,
    missing: 0,
    uploaded: 0,
    needs_review: 0,
    approved: 0,
    blockers: 0
  });

  const nextCategory = categories.find(item => item.status === 'Missing') ||
    categories.find(item => item.status === 'Needs Review') ||
    categories.find(item => item.status === 'Uploaded') ||
    null;

  return {
    project: projectName,
    reviewed_at: new Date().toISOString(),
    summary,
    categories,
    next_best_action: nextCategory
      ? nextCategory.next_action
      : 'All library categories are covered.'
  };
}

function reviewProjectUploadMapping(projectName) {
  const paths = getProjectAssetPaths(projectName);

  if (!fs.existsSync(paths.projectFilePath)) {
    throw new Error('Project not found');
  }

  const catalog = getAssetTypeCatalog();

  return {
    project: projectName,
    reviewed_at: new Date().toISOString(),
    upload_mapping: catalog.map(item => ({
      asset_type: item.asset_type,
      label: item.label,
      purpose: item.purpose,
      purpose_label: item.purpose_label,
      required: item.required,
      allowed_extensions: item.allowed_extensions,
      target_folder: item.target_folder,
      description: item.description,
      guidance: item.guidance,
      aliases: item.aliases || []
    }))
  };
}

function reviewProjectConnectorReadiness(projectName) {
  const paths = getProjectAssetPaths(projectName);

  if (!fs.existsSync(paths.projectFilePath)) {
    throw new Error('Project not found');
  }

  const sources = normalizeSourceRegistry(readJsonFile(paths.sourcesRegistryPath, {}));
  const hasSource = (key) => {
    const source = sources[key];
    if (source && typeof source === 'object') {
      const status = normalizeSourceStatus(source.status);
      return ['connected', 'verified'].includes(status) && Boolean(normalizeSetupTextValue(source.value));
    }
    return Boolean(normalizeSetupTextValue(source));
  };

  const checks = {
    website: hasSource('website'),
    ecommerce: hasSource('ecommerce'),
    instagram: hasSource('instagram'),
    facebook: hasSource('facebook'),
    tiktok: hasSource('tiktok'),
    youtube: hasSource('youtube'),
    email: hasSource('email'),
    amazon: hasSource('amazon'),
    ebay: hasSource('ebay'),
    analytics: hasSource('analytics')
  };

  const missing = Object.keys(checks).filter(key => !checks[key]);
  const totalChecks = Object.keys(checks).length;
  const passedChecks = Object.values(checks).filter(Boolean).length;
  const readinessScore = Math.round((passedChecks / totalChecks) * 100);

  return {
    project: projectName,
    reviewed_at: new Date().toISOString(),
    readiness_score: readinessScore,
    checks,
    missing,
    status: missing.length ? 'connectors_incomplete' : 'connectors_ready'
  };
}
function getTargetFolderForAssetType(projectName, assetType) {
  const base = getProjectBasePaths(projectName);
  const catalog = getAssetTypeCatalog();
  const canonicalType = getCanonicalAssetType(assetType);
  const item = catalog.find(x => x.asset_type === canonicalType);

  if (!item) {
    throw new Error('Unknown asset type');
  }

  const folderMap = {
    'brand-assets': base.brandAssetsDir,
    'products': base.productsDir,
    'content': base.contentDir,
    'campaigns': base.campaignsDir,
    'launch': base.launchDir,
    'execution': base.executionDir,
    'optimization': base.optimizationDir,
    'reports': base.reportsDir,
    'integrations': base.integrationsDir,
    'uploads': base.uploadsDir
  };

  const targetDir = folderMap[item.target_folder];
  if (!targetDir) {
    throw new Error('No target folder mapping found');
  }

  return {
    catalog_item: item,
    target_dir: targetDir
  };
}

function routeProjectAsset(projectName, assetType, sourceFilePath) {
  const paths = getProjectAssetPaths(projectName);

  if (!fs.existsSync(paths.projectFilePath)) {
    throw new Error('Project not found');
  }

  const inputPath = String(sourceFilePath || '').trim();
  if (!inputPath || !fs.existsSync(inputPath)) {
    throw new Error('Source file does not exist');
  }

  const { catalog_item, target_dir } = getTargetFolderForAssetType(projectName, assetType);
  ensureDir(target_dir);

  const fileName = path.basename(inputPath);
  const destinationPath = path.join(target_dir, fileName);

  fs.copyFileSync(inputPath, destinationPath);

  const result = registerProjectAsset(projectName, assetType, destinationPath);

  return {
    project: projectName,
    asset_type: assetType,
    source_file_path: inputPath,
    destination_file_path: destinationPath,
    target_folder: catalog_item.target_folder,
    registered_asset: result
  };
}

function reviewProjectAssetRoutes(projectName) {
  const paths = getProjectAssetPaths(projectName);

  if (!fs.existsSync(paths.projectFilePath)) {
    throw new Error('Project not found');
  }

  const assets = readJsonFile(paths.assetsRegistryPath, []);

  const routed = assets.map(asset => {
    let expected = null;
    let in_expected_folder = false;

    try {
      const folderInfo = getTargetFolderForAssetType(projectName, asset.asset_type);
      expected = folderInfo.target_dir;
      in_expected_folder = String(asset.file_path || '').startsWith(folderInfo.target_dir);
    } catch (error) {
      expected = null;
      in_expected_folder = false;
    }

    return {
      asset_id: asset.asset_id,
      asset_type: asset.asset_type,
      file_path: asset.file_path,
      exists: asset.exists,
      expected_target_dir: expected,
      in_expected_folder
    };
  });

  return {
    project: projectName,
    reviewed_at: new Date().toISOString(),
    total_assets: routed.length,
    routed_assets: routed
  };
}

function reviewProjectFolderHealth(projectName) {
  const base = getProjectBasePaths(projectName);

  if (!fs.existsSync(base.projectFilePath)) {
    throw new Error('Project not found');
  }

  const folders = {
    brand_assets: base.brandAssetsDir,
    products: base.productsDir,
    content: base.contentDir,
    campaigns: base.campaignsDir,
    launch: base.launchDir,
    execution: base.executionDir,
    optimization: base.optimizationDir,
    reports: base.reportsDir,
    integrations: base.integrationsDir,
    uploads: base.uploadsDir
  };

  const result = {};

  for (const [key, dirPath] of Object.entries(folders)) {
    const exists = fs.existsSync(dirPath);
    const files = exists ? fs.readdirSync(dirPath) : [];

    result[key] = {
      path: dirPath,
      exists,
      total_entries: files.length,
      is_empty: files.length === 0
    };
  }

  return {
    project: projectName,
    reviewed_at: new Date().toISOString(),
    folders: result
  };
}












app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'orchestrator-service',
    port: Number(PORT)
  });
});

app.get('/healthz', (req, res) => {
  res.json({
    status: 'ok',
    service: 'orchestrator-service',
    pid: process.pid
  });
});

app.get('/readyz', (req, res) => {
  const readiness = buildReadinessState();
  return res.status(readiness.ready ? 200 : 503).json(readiness);
});

app.get('/media-manager/project/:project/storage/parity-readiness', (req, res) => {
  try {
    const summary = summarizeProjectParity(req.params.project);
    return res.json(summary);
  } catch (error) {
    return res.status(500).json({
      error: error.message || 'Failed to summarize project parity readiness'
    });
  }
});

app.get('/public/media-manager/project/:project/storage/parity-readiness', (req, res) => {
  try {
    const summary = summarizeProjectParity(req.params.project);
    return res.json(summary);
  } catch (error) {
    return res.status(500).json({
      error: error.message || 'Failed to summarize project parity readiness'
    });
  }
});

app.get('/media-manager/storage/parity-readiness', (req, res) => {
  try {
    const summary = summarizeParityAcrossProjects();
    return res.json(summary);
  } catch (error) {
    return res.status(500).json({
      error: error.message || 'Failed to summarize storage parity readiness'
    });
  }
});

app.get('/public/media-manager/storage/parity-readiness', (req, res) => {
  try {
    const summary = summarizeParityAcrossProjects();
    return res.json(summary);
  } catch (error) {
    return res.status(500).json({
      error: error.message || 'Failed to summarize storage parity readiness'
    });
  }
});

app.post('/task', (req, res) => {
  const message = req.body.message || '';
  const result = buildTaskResult({ message });
  res.json(result);
});



app.get('/today', (req, res) => {
  try {
    const projectName = requireProjectContext(req);
    const tasks = readLegacyContentQueue(projectName, 'tasks');
    
    const pending = tasks.filter(t => t.status === 'pending');

    res.json({
      project: projectName,
      today_tasks: pending.slice(0, 5)
    });
  } catch (err) {
    res.json({ error: err.message });
  }
});

app.get('/next', (req, res) => {
  try {
    const projectName = requireProjectContext(req);
    const tasks = readLegacyContentQueue(projectName, 'tasks');
    
    const next = tasks.find(t => t.status === 'pending');

    res.json({
      project: projectName,
      next_task: next || null
    });
  } catch (err) {
    res.json({ error: err.message });
  }
});

app.post('/ingest', (req, res) => {
  const message = req.body.message || req.body.text || req.body.input || '';
  const source = req.body.source || 'openclaw';
  const sessionId = req.body.session_id || req.body.sessionId || 'unknown';
  const userId = req.body.user_id || req.body.userId || 'unknown';

  const result = buildTaskResult({
    message,
    source,
    sessionId,
    userId
  });

  res.json(result);
});

app.post('/execute_publish_package', (req, res) => {
  let projectName = '';

  try {
    projectName = requireProjectContext(req, { allowFallback: false });
    const publishPackage = resolvePublishPackageForExecution(projectName, req.body || {});
    const payload = buildSocialExecutionPayload(publishPackage);
    const executionState = 'manual_publish_ready';

    const result = {
      project: projectName,
      campaign_name: String(publishPackage.campaign_name || req.body?.campaign_name || '').trim(),
      channel: payload.channel,
      execution_state: executionState,
      caption: payload.caption,
      media_path: payload.media_path,
      platform_specific_payload: payload.platform_specific_payload,
      supported_execution_states: EXECUTION_BRIDGE_STATES
    };

    const log = writeExecutionBridgeLog(projectName, 'execute_publish_package', {
      status: executionState,
      result: {
        campaign_name: result.campaign_name,
        channel: result.channel,
        media_path: result.media_path,
        has_caption: Boolean(result.caption)
      }
    });

    return res.json({
      ok: true,
      ...result,
      execution_log: log.file_path
    });
  } catch (error) {
    const statusCode = getErrorStatusCode(error, 400);
    const logProject = projectName || resolveProjectNameForLog(req);

    if (logProject) {
      writeExecutionBridgeLog(logProject, 'execute_publish_package', {
        status: 'failed',
        result: 'validation_failed',
        error: error.message,
        details: {
          code: error.code || 'REQUEST_ERROR'
        }
      });
    }

    return sendError(res, {
      statusCode,
      code: error.code || 'PUBLISH_EXECUTION_FAILED',
      message: error.message || 'Failed to execute publish package'
    });
  }
});

app.post('/execute_email_package', (req, res) => {
  let projectName = '';

  try {
    projectName = requireProjectContext(req, { allowFallback: false });
    const emailPackage = resolveEmailPackageForExecution(projectName, req.body || {});
    const readyPayload = buildEmailReadyPayload(emailPackage);
    const executionState = 'pending_execution';

    const result = {
      project: projectName,
      campaign_name: String(emailPackage.campaign_name || req.body?.campaign_name || '').trim(),
      execution_state: executionState,
      subject: readyPayload.subject,
      html_body: readyPayload.html_body,
      text_body: readyPayload.text_body,
      ready_for_provider_send: true,
      supported_execution_states: EXECUTION_BRIDGE_STATES
    };

    const log = writeExecutionBridgeLog(projectName, 'execute_email_package', {
      status: executionState,
      result: {
        campaign_name: result.campaign_name,
        subject: result.subject,
        ready_for_provider_send: true
      }
    });

    return res.json({
      ok: true,
      ...result,
      execution_log: log.file_path
    });
  } catch (error) {
    const statusCode = getErrorStatusCode(error, 400);
    const logProject = projectName || resolveProjectNameForLog(req);

    if (logProject) {
      writeExecutionBridgeLog(logProject, 'execute_email_package', {
        status: 'failed',
        result: 'validation_failed',
        error: error.message,
        details: {
          code: error.code || 'REQUEST_ERROR'
        }
      });
    }

    return sendError(res, {
      statusCode,
      code: error.code || 'EMAIL_EXECUTION_FAILED',
      message: error.message || 'Failed to execute email package'
    });
  }
});

app.post('/generate_media_from_prompt', (req, res) => {
  let projectName = '';

  try {
    projectName = requireProjectContext(req, { allowFallback: false });
    const promptPack = req.body?.prompt_pack && typeof req.body.prompt_pack === 'object'
      ? req.body.prompt_pack
      : req.body?.publish_package?.assets?.[0]?.fallback_prompt_pack;

    if (!promptPack || typeof promptPack !== 'object' || Object.keys(promptPack).length === 0) {
      const error = new Error('Missing prompt_pack. Provide prompt_pack or publish_package.assets[0].fallback_prompt_pack');
      error.statusCode = 400;
      error.code = 'PROMPT_PACK_MISSING';
      throw error;
    }

    const generated = buildMediaGenerationMock(promptPack, req.body || {});
    const executionState = 'ready_for_review';
    const log = writeExecutionBridgeLog(projectName, 'generate_media_from_prompt', {
      status: executionState,
      result: {
        has_image_prompt: Boolean(generated.image_prompt),
        scene_count: Array.isArray(generated.scene_breakdown) ? generated.scene_breakdown.length : 0
      }
    });

    return res.json({
      ok: true,
      project: projectName,
      execution_state: executionState,
      supported_execution_states: EXECUTION_BRIDGE_STATES,
      image_prompt: generated.image_prompt,
      video_script: generated.video_script,
      scene_breakdown: generated.scene_breakdown,
      mock_output: true,
      execution_log: log.file_path
    });
  } catch (error) {
    const statusCode = getErrorStatusCode(error, 400);
    const logProject = projectName || resolveProjectNameForLog(req);

    if (logProject) {
      writeExecutionBridgeLog(logProject, 'generate_media_from_prompt', {
        status: 'failed',
        result: 'validation_failed',
        error: error.message,
        details: {
          code: error.code || 'REQUEST_ERROR'
        }
      });
    }

    return sendError(res, {
      statusCode,
      code: error.code || 'MEDIA_GENERATION_BRIDGE_FAILED',
      message: error.message || 'Failed to generate media from prompt'
    });
  }
});

app.post('/build_ad_execution_package', (req, res) => {
  let projectName = '';

  try {
    projectName = requireProjectContext(req, { allowFallback: false });
    const campaignPackage = resolveCampaignPackageForAds(projectName, req.body || {});
    const adPackage = buildAdExecutionPackage(campaignPackage, req.body || {});
    const executionState = 'ready_for_review';
    const log = writeExecutionBridgeLog(projectName, 'build_ad_execution_package', {
      status: executionState,
      result: {
        campaign_name: String(campaignPackage.campaign_name || req.body?.campaign_name || '').trim(),
        headline: adPackage.headline,
        audience: adPackage.audience
      }
    });

    return res.json({
      ok: true,
      project: projectName,
      campaign_name: String(campaignPackage.campaign_name || req.body?.campaign_name || '').trim(),
      execution_state: executionState,
      supported_execution_states: EXECUTION_BRIDGE_STATES,
      ad_copy: adPackage.ad_copy,
      headline: adPackage.headline,
      cta: adPackage.cta,
      audience: adPackage.audience,
      budget_suggestion: adPackage.budget_suggestion,
      execution_log: log.file_path
    });
  } catch (error) {
    const statusCode = getErrorStatusCode(error, 400);
    const logProject = projectName || resolveProjectNameForLog(req);

    if (logProject) {
      writeExecutionBridgeLog(logProject, 'build_ad_execution_package', {
        status: 'failed',
        result: 'validation_failed',
        error: error.message,
        details: {
          code: error.code || 'REQUEST_ERROR'
        }
      });
    }

    return sendError(res, {
      statusCode,
      code: error.code || 'AD_EXECUTION_BRIDGE_FAILED',
      message: error.message || 'Failed to build ad execution package'
    });
  }
});

app.get('/products', async (req, res) => {
  try {
    const response = await axios.get(`${process.env.WC_BASE_URL}/products`, {
      auth: {
        username: process.env.WC_KEY,
        password: process.env.WC_SECRET
      }
    });

    res.json({
      products: response.data
    });
  } catch (error) {
    res.json({
      error: error.message
    });
  }

});
app.get('/optimize-product/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const projectName = resolveRequestProjectName(req);
    const brandName = projectName ? getProjectDisplayName(projectName) : 'Project';

    const response = await axios.get(`${process.env.WC_BASE_URL}/products/${productId}`, {
      auth: {
        username: process.env.WC_KEY,
        password: process.env.WC_SECRET
      }
    });

    const product = response.data;

    const result = {
      product_id: product.id,
      name: product.name,
      permalink: product.permalink,
      current_price: product.price,
      current_short_description: product.short_description || '',
      current_description: product.description || '',
      optimization: {
        seo_title_suggestion: `${product.name} | ${brandName}`,
        cta_suggestion: 'Jetzt entdecken',
        conversion_improvements: [
          'Add a stronger launch-offer banner above the fold',
          'Add a short benefit bullet list near the add-to-cart button',
          'Add trust elements like fast shipping and premium quality',
          'Add product-specific FAQ section',
          'Add cross-sell or bundle suggestion'
        ],
        offer_suggestion: '15% launch discount or bundle with shaving gel',
        next_step: 'Review the current product copy and prepare an optimized version for homepage and product page blocks'
      }
    };

    res.json(result);
  } catch (error) {
    res.json({
      error: error.message
    });
  }
});

app.get('/prepare-product-update/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const projectName = resolveRequestProjectName(req);
    const brandName = projectName ? getProjectDisplayName(projectName) : 'Project';

    const response = await axios.get(`${process.env.WC_BASE_URL}/products/${productId}`, {
      auth: {
        username: process.env.WC_KEY,
        password: process.env.WC_SECRET
      }
    });

    const product = response.data;

    const cleanName = product.name || 'Unnamed Product';
    const cleanPrice = product.price || '';
    const cleanPermalink = product.permalink || '';

    const preparedUpdate = {
      mode: 'draft_only',
      product_id: product.id,
      current_product: {
        id: product.id,
        name: product.name,
        permalink: product.permalink,
        price: product.price,
        short_description: product.short_description || '',
        description: product.description || ''
      },
      proposed_update: {
        seo_title: `${cleanName} | ${brandName}`,
        meta_description:
          `${cleanName} von ${brandName}. Premium Angebot für eine einfache, wirksame und hochwertige Routine. Jetzt entdecken.`,
        cta_primary: 'Jetzt entdecken',
        cta_secondary: 'Routine starten',
        trust_bullets: [
          'Premium Qualität für Männer',
          'Einfache Anwendung im Alltag',
          'Starker Look ohne unnötige Komplexität',
          'Ideal für eine klare Grooming-Routine'
        ],
        optimized_short_description:
          `<p><strong>${cleanName}</strong> von ${brandName} – Premium Angebot für Kunden, die Wert auf Qualität, Wirkung und eine einfache Routine legen.</p>`,

        optimized_description:
          `<h2>${cleanName}</h2>
<p>Premium Männerpflege für einen gepflegten, klaren und selbstbewussten Auftritt.</p>

<h3>Warum ${brandName}?</h3>
<ul>
  <li>Einfach in der Anwendung</li>
  <li>Premium Qualität für Männer mit Anspruch</li>
  <li>Passt in eine moderne Grooming-Routine</li>
  <li>Entwickelt für einen starken täglichen Look</li>
</ul>

<h3>Was dieses Produkt besonders macht</h3>
<p>${cleanName} unterstützt eine einfache, hochwertige Pflegeroutine für Männer, die besser aussehen und sich sicherer fühlen wollen – ohne unnötige Komplexität.</p>

<h3>Ideal für</h3>
<ul>
  <li>Männer mit Anspruch an Stil und Pflege</li>
  <li>Tägliche Grooming-Routinen</li>
  <li>Barbershops, Salons und Wiederverkäufer</li>
</ul>

<h3>Anwendung</h3>
<p>Einfach in die tägliche Routine integrieren und für einen gepflegten, klaren und hochwertigen Eindruck sorgen.</p>

<h3>Launch-Hinweis</h3>
<p>Jetzt entdecken und Teil der ${brandName} Routine werden.</p>`
      },
      review_required: true,
      next_step:
        'Review this prepared draft, then approve before applying any product update to WooCommerce.'
    };

    res.json(preparedUpdate);
  } catch (error) {
    res.json({
      error: error.message
    });
  }
});

app.post('/backup-and-clone-product/:id', async (req, res) => {
  try {
    const projectName = requireProjectContext(req);
    const productId = req.params.id;

    const response = await axios.get(`${process.env.WC_BASE_URL}/products/${productId}`, {
      auth: {
        username: process.env.WC_KEY,
        password: process.env.WC_SECRET
      }
    });

    const product = response.data;

    const backupDir = getProjectBackupDir(projectName);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFilePath = path.join(
      backupDir,
      `product-${product.id}-backup-${timestamp}.json`
    );

    fs.writeFileSync(
      backupFilePath,
      JSON.stringify(product, null, 2),
      'utf8'
    );

    const clonePayload = {
      name: `${product.name} [DRAFT CLONE]`,
      type: product.type || 'simple',
      status: 'draft',
      regular_price: product.regular_price || product.price || '',
      sale_price: product.sale_price || '',
      description: product.description || '',
      short_description: product.short_description || '',
      categories: Array.isArray(product.categories)
        ? product.categories.map(cat => ({ id: cat.id }))
        : [],
      images: Array.isArray(product.images)
        ? product.images.map(img => ({ id: img.id }))
        : [],
      tags: Array.isArray(product.tags)
        ? product.tags.map(tag => ({ id: tag.id }))
        : []
    };

    const cloneResponse = await axios.post(
      `${process.env.WC_BASE_URL}/products`,
      clonePayload,
      {
        auth: {
          username: process.env.WC_KEY,
          password: process.env.WC_SECRET
        }
      }
    );

    const clonedProduct = cloneResponse.data;

    res.json({
      mode: 'backup_and_clone',
      original_product_id: product.id,
      original_name: product.name,
      backup_file: backupFilePath,
      cloned_product: {
        id: clonedProduct.id,
        name: clonedProduct.name,
        status: clonedProduct.status,
        permalink: clonedProduct.permalink || ''
      },
      review_required: true,
      next_step:
        'Use the cloned draft product for safe content updates before publishing.'
    });
  } catch (error) {
    return sendError(res, {
      statusCode: getErrorStatusCode(error, 502),
      code: 'LEGACY_BACKUP_CLONE_FAILED',
      message: 'Failed to back up and clone product'
    });
  }
});

app.post('/apply-prepared-copy-to-clone/:originalId/:cloneId', async (req, res) => {
  try {
    const projectName = resolveRequestProjectName(req);
    const brandName = projectName ? getProjectDisplayName(projectName) : 'Project';
    const originalId = req.params.originalId;
    const cloneId = req.params.cloneId;

    const originalResponse = await axios.get(`${process.env.WC_BASE_URL}/products/${originalId}`, {
      auth: {
        username: process.env.WC_KEY,
        password: process.env.WC_SECRET
      }
    });

    const originalProduct = originalResponse.data;

    const cleanName = originalProduct.name || 'Unnamed Product';

    const preparedUpdate = {
      seo_title: `${cleanName} | ${brandName}`,
      meta_description:
        `${cleanName} von ${brandName}. Premium Angebot für eine einfache, wirksame und hochwertige Routine. Jetzt entdecken.`,
      cta_primary: 'Jetzt entdecken',
      cta_secondary: 'Routine starten',
      trust_bullets: [
        'Premium Qualität für Männer',
        'Einfache Anwendung im Alltag',
        'Starker Look ohne unnötige Komplexität',
        'Ideal für eine klare Grooming-Routine'
      ],
      optimized_short_description:
        `<p><strong>${cleanName}</strong> von ${brandName} – Premium Angebot für Kunden, die Wert auf Qualität, Wirkung und eine einfache Routine legen.</p>`,

      optimized_description:
        `<h2>${cleanName}</h2>
<p>Premium Männerpflege für einen gepflegten, klaren und selbstbewussten Auftritt.</p>

<h3>Warum ${brandName}?</h3>
<ul>
  <li>Einfach in der Anwendung</li>
  <li>Premium Qualität für Männer mit Anspruch</li>
  <li>Passt in eine moderne Grooming-Routine</li>
  <li>Entwickelt für einen starken täglichen Look</li>
</ul>

<h3>Was dieses Produkt besonders macht</h3>
<p>${cleanName} unterstützt eine einfache, hochwertige Pflegeroutine für Männer, die besser aussehen und sich sicherer fühlen wollen – ohne unnötige Komplexität.</p>

<h3>Ideal für</h3>
<ul>
  <li>Männer mit Anspruch an Stil und Pflege</li>
  <li>Tägliche Grooming-Routinen</li>
  <li>Barbershops, Salons und Wiederverkäufer</li>
</ul>

<h3>Anwendung</h3>
<p>Einfach in die tägliche Routine integrieren und für einen gepflegten, klaren und hochwertigen Eindruck sorgen.</p>

<h3>Launch-Hinweis</h3>
<p>Jetzt entdecken und Teil der ${brandName} Routine werden.</p>

<h3>Vertrauen & Qualität</h3>
<ul>
  <li>Premium Qualität für Männer</li>
  <li>Einfache Anwendung im Alltag</li>
  <li>Starker Look ohne unnötige Komplexität</li>
  <li>Ideal für eine klare Grooming-Routine</li>
</ul>`
    };

    const updatePayload = {
      name: `${cleanName} [DRAFT READY]`,
      short_description: preparedUpdate.optimized_short_description,
      description: preparedUpdate.optimized_description,
      status: 'draft'
    };

    const updateResponse = await axios.put(
      `${process.env.WC_BASE_URL}/products/${cloneId}`,
      updatePayload,
      {
        auth: {
          username: process.env.WC_KEY,
          password: process.env.WC_SECRET
        }
      }
    );

    const updatedClone = updateResponse.data;

    res.json({
      mode: 'apply_prepared_copy_to_clone',
      original_product_id: Number(originalId),
      clone_product_id: Number(cloneId),
      updated_clone: {
        id: updatedClone.id,
        name: updatedClone.name,
        status: updatedClone.status,
        permalink: updatedClone.permalink || '',
        short_description: updatedClone.short_description || '',
        description: updatedClone.description || ''
      },
      review_required: true,
      next_step:
        'Review the updated draft clone in WooCommerce before any publish action.'
    });
  } catch (error) {
    return sendError(res, {
      statusCode: getErrorStatusCode(error, 502),
      code: 'LEGACY_APPLY_COPY_FAILED',
      message: 'Failed to apply prepared copy to clone'
    });
  }
});




  app.get('/media/projects', (req, res) => {
  const result = listMediaManagerProjects();
  return res.json({ projects: result.projects });
});

app.get('/media/tree/:project', (req, res) => {
  try {
    return res.json(buildLegacyMediaTree(req.params.project));
  } catch (error) {
    return res.json({ error: error.message || 'Project not found' });
  }
});

function applySingleMediaUpload(req, res, next) {
  return upload.single('file')(req, res, (error) => {
    if (!error) {
      return next();
    }

    if (isProjectSlugValidationError(error)) {
      return sendInvalidProjectSlug(res);
    }

    return sendError(res, {
      statusCode: 400,
      code: 'UPLOAD_REJECTED',
      message: 'Upload request rejected'
    });
  });
}

app.post('/media/upload', applySingleMediaUpload, (req, res) => {
  try {
    const project = normalizeProjectSlug(req.body.project);
    const type = String(req.body.type || '').trim().toLowerCase();

    if (!project || !type || !req.file) {
      return res.status(400).json({
        error: 'Missing project, type, or file'
      });
    }

    const uploadTarget = resolveUploadTarget(project, type);
    const absolutePath = req.file.path;
    const filename = req.file.filename;
    let registeredAsset = null;

    if (uploadTarget.mode === 'legacy_media') {
      const paths = getProjectBrandPaths(project);
      ensureJsonFile(paths.registryPath, []);
      const registry = readJsonFile(paths.registryPath, []);

      const existing = registry.find(
        item =>
          item.source_type === 'local_file' &&
          item.asset_role === uploadTarget.assetRole &&
          item.local_path === absolutePath
      );

      if (!existing) {
        registry.push({
          id: `upload_${Date.now()}`,
          project_id: project,
          source_type: 'local_file',
          asset_role: uploadTarget.assetRole,
          filename,
          local_path: absolutePath,
          use_as_source_of_truth: uploadTarget.assetRole !== 'reference_source',
          use_as_reference_only: uploadTarget.assetRole === 'reference_source',
          status: 'active',
          created_at: new Date().toISOString()
        });

        writeJsonFile(paths.registryPath, registry);
      }
    } else {
      registeredAsset = registerProjectAsset(project, uploadTarget.assetType || type, absolutePath);
    }

    return res.json({
      success: true,
      project,
      type: uploadTarget.assetType || type,
      requested_type: uploadTarget.requestedAssetType || type,
      filename,
      saved_to: absolutePath,
      target_folder: uploadTarget.target_folder,
      upload_mode: uploadTarget.mode,
      registered_asset: registeredAsset
    });
  } catch (error) {
    if (isProjectSlugValidationError(error)) {
      return sendInvalidProjectSlug(res);
    }
    return res.status(500).json({
      error: 'Upload failed',
      details: error.message
    });
  }
});

app.get('/media/registry/:project', (req, res) => {
  return res.json(buildLegacyMediaRegistry(req.params.project));
});

app.get('/media/file/:project/:type/:filename', (req, res) => {
  const project = normalizeProjectSlug(req.params.project);
  const type = String(req.params.type || '').trim().toLowerCase();
  const filename = String(req.params.filename || '').trim();
  const requestedPath = String(req.query?.path || '').trim();
  const requestedAssetId = String(req.query?.assetId || req.query?.asset_id || '').trim();

  let filePath = null;

  const queryResolution = resolveMediaFilePathFromQuery(project, requestedPath, requestedAssetId);
  if (queryResolution.filePath) {
    return res.sendFile(queryResolution.filePath);
  }

  if (queryResolution.invalidPath) {
    return res.status(400).send('Invalid media path');
  }

  try {
    filePath = resolveMediaFilePath(project, type, filename);
  } catch (error) {
    filePath = null;
  }

  if (!filePath || !fs.existsSync(filePath)) {
    filePath = findRegisteredMediaFilePath(project, type, filename);
  }

  if (!filePath || !fs.existsSync(filePath)) {
    return res.status(404).send('File not found');
  }

  return res.sendFile(filePath);
});


function handleCreateMediaManagerProject(req, res) {
  const body = req.body || {};

  const projectName = String(
    body.project_name ||
    body.projectName ||
    body.name ||
    ""
  ).trim();

  const market = String(body.market || body.country || "").trim();
  const language = String(body.language || body.locale || "").trim();
  const projectType = String(
    body.project_type ||
    body.projectType ||
    body.business_type ||
    body.businessType ||
    ""
  ).trim();

  const websiteUrl = String(
    body.website_url ||
    body.websiteUrl ||
    body.website ||
    ""
  ).trim();

  if (!projectName) {
    return res.status(400).json({
      error: "Missing project name",
      code: "MISSING_PROJECT_NAME"
    });
  }

  try {
    const project = createProject(
      projectName,
      market,
      language,
      projectType,
      websiteUrl
    );

    return res.status(201).json({
      ok: true,
      project,
      preferredProject: project.project_name,
      projects: listMediaManagerProjects()
    });
  } catch (error) {
    const message = error?.message || "Failed to create project";
    const duplicate = /already exists/i.test(message);

    return res.status(duplicate ? 409 : 500).json({
      error: "Failed to create project",
      code: duplicate ? "PROJECT_ALREADY_EXISTS" : "CREATE_PROJECT_FAILED",
      details: message
    });
  }
}



app.post('/media-manager/projects', express.json({ limit: '1mb' }), handleCreateMediaManagerProject);

app.post('/public/media-manager/projects', express.json({ limit: '1mb' }), handleCreateMediaManagerProject);

app.get('/media-manager/projects', (req, res) => {
  return res.json(listMediaManagerProjects());
});

app.get('/public/media-manager/projects', (req, res) => {
  return res.json(listMediaManagerProjects());
});

app.get('/media-manager/asset-catalog', (req, res) => {
  return res.json({
    asset_catalog: getAssetTypeCatalog()
  });
});

app.get('/public/media-manager/asset-catalog', (req, res) => {
  return res.json({
    asset_catalog: getAssetTypeCatalog()
  });
});

app.get('/media-manager/project/:project/startup', (req, res) => {
  try {
    return res.json(buildMediaManagerProjectStartupPayload(req.params.project));
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to build media manager startup payload'
    });
  }
});

app.get('/public/media-manager/project/:project/startup', (req, res) => {
  try {
    return res.json(buildMediaManagerProjectStartupPayload(req.params.project));
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to build media manager startup payload'
    });
  }
});

app.get('/media-manager/project/:project', (req, res) => {
  try {
    return res.json(buildMediaManagerProjectPayload(req.params.project));
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to build media manager payload'
    });
  }
});

app.get('/public/media-manager/project/:project', (req, res) => {
  try {
    return res.json(buildMediaManagerProjectPayload(req.params.project));
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to build media manager payload'
    });
  }
});



function getProjectAssetsRegistryMeta(projectName) {
  const project = normalizeProjectSlug(projectName);
  const root = process.env.MH_ASSISTANT_ROOT || path.resolve(__dirname, '../..');
  const registryPath = path.join(root, 'data', 'projects', project, 'assets-registry.json');
  return { project, registryPath };
}

function matchesProjectAssetId(value, assetId) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const requested = String(assetId || '').trim();
  if (!requested) return false;

  const byPrimaryId = (
    String(value.asset_id || '') === requested ||
    String(value.assetId || '') === requested ||
    String(value.id || '') === requested
  );
  if (byPrimaryId) return true;

  if (requested.startsWith('path:')) {
    const requestedPath = requested.slice(5).trim();
    if (!requestedPath) return false;
    const localPath = String(value.local_path || value.file_path || value.path || '').trim();
    return Boolean(localPath && localPath === requestedPath);
  }

  if (requested.startsWith('name:')) {
    const requestedName = requested.slice(5).trim().toLowerCase();
    if (!requestedName) return false;
    const candidateName = String(
      value.filename ||
      value.file_name ||
      value.name ||
      value.title ||
      path.basename(String(value.local_path || value.file_path || value.path || ''))
    ).trim().toLowerCase();
    return Boolean(candidateName && candidateName === requestedName);
  }

  return false;
}

function mutateProjectAssetRegistry(projectName, assetId, mutator) {
  const { project, registryPath } = getProjectAssetsRegistryMeta(projectName);

  if (!assetId) {
    throw Object.assign(new Error('Missing asset id.'), { statusCode: 400 });
  }

  if (!fs.existsSync(registryPath)) {
    throw Object.assign(new Error('Assets registry not found.'), {
      statusCode: 404,
      details: { project, registryPath }
    });
  }

  const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
  const now = new Date().toISOString();
  let matched = 0;

  function walk(value) {
    if (!value || typeof value !== 'object') {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }

    if (matchesProjectAssetId(value, assetId)) {
      matched += 1;
      mutator(value, now);
      value.updated_at = now;
    }

    Object.values(value).forEach(walk);
  }

  walk(registry);

  if (!matched) {
    throw Object.assign(new Error('Asset not found in registry.'), {
      statusCode: 404,
      details: { project, assetId }
    });
  }

  if (registry && typeof registry === 'object' && !Array.isArray(registry)) {
    registry.updated_at = now;
    registry.last_reviewed_at = now;
  }

  writeJsonFile(registryPath, registry);

  return {
    ok: true,
    project,
    assetId,
    matched,
    registryPath,
    updated_at: now
  };
}

function sendAssetMutationError(res, error, fallbackMessage) {
  const statusCode = Number(error?.statusCode || 0);
  const payload = {
    error: error?.message || fallbackMessage,
    ...(error?.details && typeof error.details === 'object' ? error.details : {})
  };

  if (statusCode >= 400 && statusCode < 600) {
    return res.status(statusCode).json(payload);
  }

  return res.status(500).json({
    error: fallbackMessage,
    details: error?.message || String(error)
  });
}

app.post('/media-manager/project/:project/assets/:assetId/status', express.json({ limit: '1mb' }), (req, res) => {
  try {
    const assetId = String(req.params.assetId || '').trim();
    const status = String(req.body?.status || '').trim().toLowerCase();
    const note = String(req.body?.note || '').trim();

    const allowed = new Set(['approved', 'needs_review', 'rejected', 'archived']);
    if (!assetId) {
      return res.status(400).json({ error: 'Missing assetId.' });
    }

    if (!allowed.has(status)) {
      return res.status(400).json({
        error: 'Invalid status.',
        allowed: Array.from(allowed)
      });
    }

    const result = mutateProjectAssetRegistry(req.params.project, assetId, (asset, now) => {
      asset.status = status;
      asset.readiness_status = status;
      asset.review_status = status;
      asset.needs_review = status === 'needs_review';
      asset.approved = status === 'approved';
      asset.rejected = status === 'rejected';
      asset.archived = status === 'archived';
      asset.reviewed_at = now;
      asset.reviewed_by = 'control_center';

      if (status === 'approved') {
        asset.approved_at = now;
        asset.approval_note = note || asset.approval_note || 'Approved from Control Center Library.';
      }

      if (status === 'rejected') {
        asset.rejected_at = now;
        asset.rejection_note = note || asset.rejection_note || 'Rejected from Control Center Library.';
      }

      if (status === 'archived') {
        asset.archived_at = now;
        asset.archive_note = note || asset.archive_note || 'Archived from Control Center Library.';
      }
    });

    return res.json({
      ...result,
      status
    });
  } catch (error) {
    return sendAssetMutationError(res, error, 'Failed to update asset status.');
  }
});

app.post('/media-manager/project/:project/assets/:assetId/rename', express.json({ limit: '1mb' }), (req, res) => {
  try {
    const assetId = String(req.params.assetId || '').trim();
    const name = String(req.body?.name || req.body?.display_name || '').trim();

    if (!assetId) {
      return res.status(400).json({ error: 'Missing assetId.' });
    }

    if (!name) {
      return res.status(400).json({ error: 'Missing asset name.' });
    }

    const result = mutateProjectAssetRegistry(req.params.project, assetId, (asset, now) => {
      asset.name = name;
      asset.title = name;
      asset.display_name = name;
      asset.renamed_at = now;
      asset.renamed_by = 'control_center';
    });

    return res.json({
      ...result,
      name
    });
  } catch (error) {
    return sendAssetMutationError(res, error, 'Failed to rename asset.');
  }
});

app.post('/media-manager/project/:project/assets/:assetId/source-of-truth', express.json({ limit: '1mb' }), (req, res) => {
  try {
    const assetId = String(req.params.assetId || '').trim();
    const sourceOfTruth = Boolean(req.body?.source_of_truth);

    if (!assetId) {
      return res.status(400).json({ error: 'Missing assetId.' });
    }

    const result = mutateProjectAssetRegistry(req.params.project, assetId, (asset, now) => {
      asset.source_of_truth = sourceOfTruth;
      asset.use_as_source_of_truth = sourceOfTruth;
      asset.source_of_truth_updated_at = now;
      asset.source_of_truth_updated_by = 'control_center';
    });

    return res.json({
      ...result,
      source_of_truth: sourceOfTruth
    });
  } catch (error) {
    return sendAssetMutationError(res, error, 'Failed to update source of truth.');
  }
});

app.post('/media-manager/project/:project/assets/:assetId/archive', express.json({ limit: '1mb' }), (req, res) => {
  try {
    const assetId = String(req.params.assetId || '').trim();
    const note = String(req.body?.note || '').trim();

    if (!assetId) {
      return res.status(400).json({ error: 'Missing assetId.' });
    }

    const result = mutateProjectAssetRegistry(req.params.project, assetId, (asset, now) => {
      asset.status = 'archived';
      asset.readiness_status = 'archived';
      asset.review_status = 'archived';
      asset.archived = true;
      asset.archived_at = now;
      asset.archive_note = note || asset.archive_note || 'Archived from Control Center Library.';
      asset.reviewed_by = 'control_center';
    });

    return res.json({
      ...result,
      status: 'archived'
    });
  } catch (error) {
    return sendAssetMutationError(res, error, 'Failed to archive asset.');
  }
});

app.post('/media-manager/project/:project/assets/:assetId/delete', express.json({ limit: '1mb' }), (req, res) => {
  try {
    const assetId = String(req.params.assetId || '').trim();
    const note = String(req.body?.note || '').trim();

    if (!assetId) {
      return res.status(400).json({ error: 'Missing assetId.' });
    }

    const result = mutateProjectAssetRegistry(req.params.project, assetId, (asset, now) => {
      asset.deleted = true;
      asset.deleted_at = now;
      asset.deleted_by = 'control_center';
      asset.delete_note = note || asset.delete_note || 'Soft deleted from Control Center Library.';
      asset.status = 'archived';
      asset.readiness_status = 'archived';
      asset.review_status = 'archived';
      asset.archived = true;
      asset.archived_at = asset.archived_at || now;
    });

    return res.json({
      ...result,
      deleted: true,
      status: 'archived'
    });
  } catch (error) {
    return sendAssetMutationError(res, error, 'Failed to delete asset.');
  }
});

app.delete('/media-manager/project/:project/assets/:assetId', express.json({ limit: '1mb' }), (req, res) => {
  try {
    const assetId = String(req.params.assetId || '').trim();
    const note = String(req.body?.note || '').trim();

    if (!assetId) {
      return res.status(400).json({ error: 'Missing assetId.' });
    }

    const result = mutateProjectAssetRegistry(req.params.project, assetId, (asset, now) => {
      asset.deleted = true;
      asset.deleted_at = now;
      asset.deleted_by = 'control_center';
      asset.delete_note = note || asset.delete_note || 'Soft deleted from Control Center Library.';
      asset.status = 'archived';
      asset.readiness_status = 'archived';
      asset.review_status = 'archived';
      asset.archived = true;
      asset.archived_at = asset.archived_at || now;
    });

    return res.json({
      ...result,
      deleted: true,
      status: 'archived'
    });
  } catch (error) {
    return sendAssetMutationError(res, error, 'Failed to delete asset.');
  }
});

app.post('/media-manager/project/:project/library/refresh', (req, res) => {
  try {
    return res.json(refreshProjectLibraryRegistry(req.params.project));
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to refresh project library'
    });
  }
});

app.post('/media-manager/project/:project/setup', (req, res) => {
  try {
    return res.json(updateProjectSetup(req.params.project, req.body || {}));
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to save project setup'
    });
  }
});

app.post('/public/media-manager/project/:project/setup', (req, res) => {
  try {
    return res.json(updateProjectSetup(req.params.project, req.body || {}));
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to save project setup'
    });
  }
});

function handleGetProjectOperations(req, res) {
  try {
    return res.json(buildProjectOperationsPayload(req.params.project));
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to build project operations payload'
    });
  }
}

app.get('/media-manager/project/:project/operations', handleGetProjectOperations);
app.get('/public/media-manager/project/:project/operations', handleGetProjectOperations);

function handleGetTaskCenter(req, res) {
  try {
    const snapshot = buildProjectOperationsPayload(req.params.project);
    return res.json({
      project: String(req.params.project || '').trim().toLowerCase(),
      task_center: snapshot.task_center || {}
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to build task center payload'
    });
  }
}

function handleGetQueueCenter(req, res) {
  try {
    const snapshot = buildProjectOperationsPayload(req.params.project);
    return res.json({
      project: String(req.params.project || '').trim().toLowerCase(),
      queue_center: snapshot.queue_center || {}
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to build queue center payload'
    });
  }
}

function handleGetJobMonitor(req, res) {
  try {
    const snapshot = buildProjectOperationsPayload(req.params.project);
    return res.json({
      project: String(req.params.project || '').trim().toLowerCase(),
      job_monitor: snapshot.job_monitor || {}
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to build job monitor payload'
    });
  }
}

function handleGetNotificationCenter(req, res) {
  try {
    const snapshot = buildProjectOperationsPayload(req.params.project);
    return res.json({
      project: String(req.params.project || '').trim().toLowerCase(),
      notification_center: snapshot.notification_center || {}
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to build notification center payload'
    });
  }
}

app.get('/media-manager/project/:project/task-center', handleGetTaskCenter);
app.get('/public/media-manager/project/:project/task-center', handleGetTaskCenter);
app.get('/media-manager/project/:project/queue-center', handleGetQueueCenter);
app.get('/public/media-manager/project/:project/queue-center', handleGetQueueCenter);
app.get('/media-manager/project/:project/job-monitor', handleGetJobMonitor);
app.get('/public/media-manager/project/:project/job-monitor', handleGetJobMonitor);
app.get('/media-manager/project/:project/notification-center', handleGetNotificationCenter);
app.get('/public/media-manager/project/:project/notification-center', handleGetNotificationCenter);

function handleGetOperationsSchema(req, res) {
  return res.json({
    project: String(req.params.project || '').trim().toLowerCase(),
    status_models: STATUS_MODELS
  });
}

app.get('/media-manager/project/:project/operations/schema', handleGetOperationsSchema);
app.get('/public/media-manager/project/:project/operations/schema', handleGetOperationsSchema);

function handleGetProjectTeam(req, res) {
  try {
    return res.json({
      project: String(req.params.project || '').trim().toLowerCase(),
      team: readTeamModel(req.params.project)
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to load project team model'
    });
  }
}

function handleUpdateProjectTeam(req, res) {
  try {
    return res.json({
      project: String(req.params.project || '').trim().toLowerCase(),
      team: updateTeamModel(req.params.project, req.body || {}, req.body?.actor || 'control-center')
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to update project team model'
    });
  }
}

app.get('/media-manager/project/:project/team', handleGetProjectTeam);
app.get('/public/media-manager/project/:project/team', handleGetProjectTeam);
app.post('/media-manager/project/:project/team', handleUpdateProjectTeam);
app.post('/public/media-manager/project/:project/team', handleUpdateProjectTeam);

function handleListCampaigns(req, res) {
  try {
    return res.json({
      project: String(req.params.project || '').trim().toLowerCase(),
      items: listCampaigns(req.params.project, {
        limit: req.query?.limit
      })
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to list campaigns'
    });
  }
}

function handleUpsertCampaign(req, res) {
  try {
    const campaign = upsertCampaign(req.params.project, req.body || {});
    return res.json({
      campaign,
      operations: buildProjectOperationsPayload(req.params.project)
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to save campaign'
    });
  }
}

function handleGetCampaign(req, res) {
  try {
    const campaign = getCampaign(req.params.project, req.params.campaignId);
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    return res.json({ campaign });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to load campaign'
    });
  }
}

app.get('/media-manager/project/:project/campaigns', handleListCampaigns);
app.get('/public/media-manager/project/:project/campaigns', handleListCampaigns);
app.post('/media-manager/project/:project/campaigns', handleUpsertCampaign);
app.post('/public/media-manager/project/:project/campaigns', handleUpsertCampaign);
app.patch('/media-manager/project/:project/campaigns/:campaignId', (req, res) => {
  req.body = {
    ...(req.body || {}),
    id: req.params.campaignId
  };
  return handleUpsertCampaign(req, res);
});
app.patch('/public/media-manager/project/:project/campaigns/:campaignId', (req, res) => {
  req.body = {
    ...(req.body || {}),
    id: req.params.campaignId
  };
  return handleUpsertCampaign(req, res);
});
app.get('/media-manager/project/:project/campaigns/:campaignId', handleGetCampaign);
app.get('/public/media-manager/project/:project/campaigns/:campaignId', handleGetCampaign);

function handleListContentItems(req, res) {
  try {
    return res.json({
      project: String(req.params.project || '').trim().toLowerCase(),
      items: listContentItems(req.params.project, {
        limit: req.query?.limit,
        campaign_id: req.query?.campaign_id
      })
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to list content items'
    });
  }
}

function handleUpsertContentItem(req, res) {
  try {
    const contentItem = upsertContentItem(req.params.project, req.body || {});
    return res.json({
      content_item: contentItem,
      operations: buildProjectOperationsPayload(req.params.project)
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to save content item'
    });
  }
}

function handleGetContentItem(req, res) {
  try {
    const contentItem = getContentItem(req.params.project, req.params.contentItemId);
    if (!contentItem) {
      return res.status(404).json({ error: 'Content item not found' });
    }
    return res.json({ content_item: contentItem });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to load content item'
    });
  }
}

app.get('/media-manager/project/:project/content-items', handleListContentItems);
app.get('/public/media-manager/project/:project/content-items', handleListContentItems);
app.post('/media-manager/project/:project/content-items', handleUpsertContentItem);
app.post('/public/media-manager/project/:project/content-items', handleUpsertContentItem);
app.patch('/media-manager/project/:project/content-items/:contentItemId', (req, res) => {
  req.body = {
    ...(req.body || {}),
    id: req.params.contentItemId
  };
  return handleUpsertContentItem(req, res);
});
app.patch('/public/media-manager/project/:project/content-items/:contentItemId', (req, res) => {
  req.body = {
    ...(req.body || {}),
    id: req.params.contentItemId
  };
  return handleUpsertContentItem(req, res);
});
app.get('/media-manager/project/:project/content-items/:contentItemId', handleGetContentItem);
app.get('/public/media-manager/project/:project/content-items/:contentItemId', handleGetContentItem);

function handleListMediaJobs(req, res) {
  try {
    return res.json({
      project: String(req.params.project || '').trim().toLowerCase(),
      items: listMediaJobs(req.params.project, {
        limit: req.query?.limit,
        campaign_id: req.query?.campaign_id,
        content_item_id: req.query?.content_item_id
      })
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to list media jobs'
    });
  }
}

function handleUpsertMediaJob(req, res) {
  try {
    const mediaJob = upsertMediaJob(req.params.project, req.body || {});
    return res.json({
      media_job: mediaJob,
      operations: buildProjectOperationsPayload(req.params.project)
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to save media job'
    });
  }
}

function handleGetMediaJob(req, res) {
  try {
    const mediaJob = getMediaJob(req.params.project, req.params.mediaJobId);
    if (!mediaJob) {
      return res.status(404).json({ error: 'Media job not found' });
    }
    return res.json({ media_job: mediaJob });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to load media job'
    });
  }
}

app.get('/media-manager/project/:project/media-jobs', handleListMediaJobs);
app.get('/public/media-manager/project/:project/media-jobs', handleListMediaJobs);
app.post('/media-manager/project/:project/media-jobs', handleUpsertMediaJob);
app.post('/public/media-manager/project/:project/media-jobs', handleUpsertMediaJob);
app.patch('/media-manager/project/:project/media-jobs/:mediaJobId', (req, res) => {
  req.body = {
    ...(req.body || {}),
    id: req.params.mediaJobId
  };
  return handleUpsertMediaJob(req, res);
});
app.patch('/public/media-manager/project/:project/media-jobs/:mediaJobId', (req, res) => {
  req.body = {
    ...(req.body || {}),
    id: req.params.mediaJobId
  };
  return handleUpsertMediaJob(req, res);
});
app.get('/media-manager/project/:project/media-jobs/:mediaJobId', handleGetMediaJob);
app.get('/public/media-manager/project/:project/media-jobs/:mediaJobId', handleGetMediaJob);

function handleListWorkflowRuns(req, res) {
  try {
    return res.json({
      project: String(req.params.project || '').trim().toLowerCase(),
      items: listWorkflowRuns(req.params.project, {
        limit: req.query?.limit
      })
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to list workflow runs'
    });
  }
}

app.get('/media-manager/project/:project/workflows/runs', handleListWorkflowRuns);
app.get('/public/media-manager/project/:project/workflows/runs', handleListWorkflowRuns);

function handleGetWorkflowRun(req, res) {
  try {
    const run = getWorkflowRun(req.params.project, req.params.runId);
    if (!run) {
      return res.status(404).json({ error: 'Workflow run not found' });
    }
    return res.json({ run });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to load workflow run'
    });
  }
}

app.get('/media-manager/project/:project/workflows/runs/:runId', handleGetWorkflowRun);
app.get('/public/media-manager/project/:project/workflows/runs/:runId', handleGetWorkflowRun);

function handleRunWorkflow(req, res) {
  try {
    const output = req.body?.output;
    const run = recordWorkflowRun(req.params.project, {
      workflow_id: req.params.workflowId,
      title: req.body?.title,
      status: req.body?.status,
      source: req.body?.source,
      route_target: req.body?.route_target,
      inputs: req.body?.inputs,
      output,
      intelligence_stamp: req.body?.intelligence_stamp,
      actor: req.body?.actor
    });

    const artifact = output && Object.keys(output).length
      ? createAiArtifact(req.params.project, {
        type: 'workflow_output',
        title: req.body?.title || req.params.workflowId,
        summary: output.summary || '',
        route_target: req.body?.route_target,
        source_type: 'workflow_run',
        source_id: run.id,
        payload: output,
        actor: req.body?.actor
      })
      : null;

    return res.json({
      run,
      artifact,
      operations: buildProjectOperationsPayload(req.params.project)
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to record workflow run'
    });
  }
}

app.post('/media-manager/project/:project/workflows/:workflowId/run', handleRunWorkflow);
app.post('/public/media-manager/project/:project/workflows/:workflowId/run', handleRunWorkflow);

async function handleExecuteAiCommand(req, res) {
  const project = String(req.params.project || '').trim().toLowerCase();
  const source = String(req.body?.source || 'ai-command').trim();
  const modeId = String(req.body?.mode_id || req.body?.modeId || 'executive').trim();

  appLogger.info('ai_command_http_received', {
    route: 'ai-command',
    action: 'execute',
    project,
    source,
    mode_id: modeId
  });

  try {
    const result = await getAiOrchestrator().executeCommand(req.params.project, req.body || {});
    appLogger.info('ai_command_http_returned', {
      route: 'ai-command',
      action: 'execute',
      project,
      status: result?.status || 'completed',
      provider: result?.provider?.id || result?.response?.provider || null,
      command_id: result?.command?.id || null
    });
    return res.json({
      ...result,
      operations: buildProjectOperationsPayload(req.params.project)
    });
  } catch (error) {
    const statusCode = getErrorStatusCode(error, 500);
    const payload = error?.payload && typeof error.payload === 'object'
      ? error.payload
      : {
        status: 'failed',
        error: error.message || 'Failed to execute AI command'
      };

    appLogger.error('ai_command_http_error', {
      route: 'ai-command',
      action: 'execute',
      project,
      status_code: statusCode,
      error: serializeErrorForLog(error)
    });

    return res.status(statusCode).json(payload);
  }
}

function handleExecuteAiWorkflow(req, res) {
  try {
    const result = getAiOrchestrator().executeWorkflow(
      req.params.project,
      req.params.workflowId,
      req.body || {}
    );
    return res.json({
      ...result,
      operations: buildProjectOperationsPayload(req.params.project)
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to execute AI workflow'
    });
  }
}

function handleListAiCommands(req, res) {
  try {
    return res.json({
      project: String(req.params.project || '').trim().toLowerCase(),
      items: listAiCommandRecords(req.params.project, {
        limit: req.query?.limit
      })
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to list AI commands'
    });
  }
}

function handleGetAiCommand(req, res) {
  try {
    const command = getAiCommandRecord(req.params.project, req.params.commandId);
    if (!command) {
      return res.status(404).json({ error: 'AI command not found' });
    }
    return res.json({ command });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to load AI command'
    });
  }
}

function handleListAiArtifacts(req, res) {
  try {
    return res.json({
      project: String(req.params.project || '').trim().toLowerCase(),
      items: listAiArtifacts(req.params.project, {
        limit: req.query?.limit,
        type: req.query?.type
      })
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to list AI artifacts'
    });
  }
}

function handleListAiRecommendations(req, res) {
  try {
    return res.json({
      project: String(req.params.project || '').trim().toLowerCase(),
      items: listAiRecommendations(req.params.project, {
        limit: req.query?.limit,
        route_target: req.query?.route_target
      })
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to list AI recommendations'
    });
  }
}

function handleListAiMemory(req, res) {
  try {
    return res.json({
      project: String(req.params.project || '').trim().toLowerCase(),
      items: listAiMemory(req.params.project, {
        limit: req.query?.limit,
        scope: req.query?.scope
      })
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to list AI memory'
    });
  }
}

app.get('/media-manager/project/:project/ai/commands', handleListAiCommands);
app.get('/public/media-manager/project/:project/ai/commands', handleListAiCommands);
app.get('/media-manager/project/:project/ai/commands/:commandId', handleGetAiCommand);
app.get('/public/media-manager/project/:project/ai/commands/:commandId', handleGetAiCommand);
app.post('/media-manager/project/:project/ai/command', handleExecuteAiCommand);
app.post('/public/media-manager/project/:project/ai/command', handleExecuteAiCommand);
app.post('/media-manager/project/:project/ai/workflows/:workflowId/run', handleExecuteAiWorkflow);
app.post('/public/media-manager/project/:project/ai/workflows/:workflowId/run', handleExecuteAiWorkflow);
app.get('/media-manager/project/:project/ai/artifacts', handleListAiArtifacts);
app.get('/public/media-manager/project/:project/ai/artifacts', handleListAiArtifacts);
app.get('/media-manager/project/:project/ai/recommendations', handleListAiRecommendations);
app.get('/public/media-manager/project/:project/ai/recommendations', handleListAiRecommendations);
app.get('/media-manager/project/:project/ai/memory', handleListAiMemory);
app.get('/public/media-manager/project/:project/ai/memory', handleListAiMemory);

function handleListTasks(req, res) {
  try {
    return res.json({
      project: String(req.params.project || '').trim().toLowerCase(),
      items: listTasks(req.params.project, {
        limit: req.query?.limit
      })
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to list tasks'
    });
  }
}

function handleCreateTask(req, res) {
  try {
    const task = createTask(req.params.project, req.body || {});
    return res.json({
      task,
      operations: buildProjectOperationsPayload(req.params.project)
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to create task'
    });
  }
}

app.get('/media-manager/project/:project/tasks', handleListTasks);
app.get('/public/media-manager/project/:project/tasks', handleListTasks);
app.post('/media-manager/project/:project/tasks', handleCreateTask);
app.post('/public/media-manager/project/:project/tasks', handleCreateTask);
app.get('/media-manager/project/:project/tasks/:taskId', (req, res) => {
  try {
    const task = getTask(req.params.project, req.params.taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    return res.json({ task });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to load task'
    });
  }
});
app.get('/public/media-manager/project/:project/tasks/:taskId', (req, res) => {
  try {
    const task = getTask(req.params.project, req.params.taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    return res.json({ task });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to load task'
    });
  }
});

function handleListApprovals(req, res) {
  try {
    return res.json({
      project: String(req.params.project || '').trim().toLowerCase(),
      items: listApprovals(req.params.project, {
        limit: req.query?.limit
      })
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to list approvals'
    });
  }
}

function handleCreateApproval(req, res) {
  try {
    const approval = createApproval(req.params.project, req.body || {});
    return res.json({
      approval,
      operations: buildProjectOperationsPayload(req.params.project)
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to create approval'
    });
  }
}

function handleApprovalDecision(req, res) {
  try {
    const approval = decideApproval(req.params.project, req.params.approvalId, {
      decision: req.body?.decision,
      note: req.body?.note,
      actor: req.body?.actor,
      reason: req.body?.reason,
      escalate_to: req.body?.escalate_to
    });

    return res.json({
      approval,
      operations: buildProjectOperationsPayload(req.params.project)
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to update approval'
    });
  }
}

app.get('/media-manager/project/:project/approvals', handleListApprovals);
app.get('/public/media-manager/project/:project/approvals', handleListApprovals);
app.post('/media-manager/project/:project/approvals', handleCreateApproval);
app.post('/public/media-manager/project/:project/approvals', handleCreateApproval);
app.post('/media-manager/project/:project/approvals/:approvalId/decision', handleApprovalDecision);
app.post('/public/media-manager/project/:project/approvals/:approvalId/decision', handleApprovalDecision);

function handleGetGovernance(req, res) {
  try {
    return res.json(
      buildGovernanceSummary(req.params.project, {
        timelineLimit: req.query?.timeline_limit
      })
    );
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to load governance summary'
    });
  }
}

function handleUpdateGovernancePolicy(req, res) {
  try {
    const policy = updateGovernancePolicy(req.params.project, req.body || {}, req.body?.actor || 'operator');
    return res.json({
      project: String(req.params.project || '').trim().toLowerCase(),
      policy
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to update governance policy'
    });
  }
}

function handleGetGovernancePolicy(req, res) {
  try {
    return res.json({
      project: String(req.params.project || '').trim().toLowerCase(),
      policy: getGovernancePolicy(req.params.project)
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to load governance policy'
    });
  }
}

app.get('/media-manager/project/:project/governance', handleGetGovernance);
app.get('/public/media-manager/project/:project/governance', handleGetGovernance);
app.get('/media-manager/project/:project/governance/policy', handleGetGovernancePolicy);
app.get('/public/media-manager/project/:project/governance/policy', handleGetGovernancePolicy);
app.post('/media-manager/project/:project/governance/policy', handleUpdateGovernancePolicy);
app.post('/public/media-manager/project/:project/governance/policy', handleUpdateGovernancePolicy);

function handleListNotifications(req, res) {
  try {
    return res.json({
      project: String(req.params.project || '').trim().toLowerCase(),
      items: listNotifications(req.params.project, {
        limit: req.query?.limit
      })
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to list notifications'
    });
  }
}

app.get('/media-manager/project/:project/notifications', handleListNotifications);
app.get('/public/media-manager/project/:project/notifications', handleListNotifications);
app.patch('/media-manager/project/:project/notifications/:notificationId', (req, res) => {
  try {
    const notification = markNotification(req.params.project, req.params.notificationId, req.body || {});
    return res.json({
      notification,
      operations: buildProjectOperationsPayload(req.params.project)
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to update notification'
    });
  }
});
app.patch('/public/media-manager/project/:project/notifications/:notificationId', (req, res) => {
  try {
    const notification = markNotification(req.params.project, req.params.notificationId, req.body || {});
    return res.json({
      notification,
      operations: buildProjectOperationsPayload(req.params.project)
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to update notification'
    });
  }
});

function handleListHandoffs(req, res) {
  try {
    return res.json({
      project: String(req.params.project || '').trim().toLowerCase(),
      items: listHandoffs(req.params.project, {
        limit: req.query?.limit,
        destination_page: req.query?.destination_page,
        source_page: req.query?.source_page,
        status: req.query?.status
      })
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to list handoffs'
    });
  }
}

function handleCreateHandoff(req, res) {
  try {
    const handoff = createHandoff(req.params.project, req.body || {});
    return res.json({
      handoff,
      operations: buildProjectOperationsPayload(req.params.project)
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to create handoff'
    });
  }
}

function handleConsumeHandoff(req, res) {
  try {
    const handoff = consumeHandoff(req.params.project, req.params.handoffId, req.body || {});
    return res.json({
      handoff,
      operations: buildProjectOperationsPayload(req.params.project)
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to consume handoff'
    });
  }
}

app.get('/media-manager/project/:project/handoffs', handleListHandoffs);
app.get('/public/media-manager/project/:project/handoffs', handleListHandoffs);
app.post('/media-manager/project/:project/handoffs', handleCreateHandoff);
app.post('/public/media-manager/project/:project/handoffs', handleCreateHandoff);
app.post('/media-manager/project/:project/handoffs/:handoffId/consume', handleConsumeHandoff);
app.post('/public/media-manager/project/:project/handoffs/:handoffId/consume', handleConsumeHandoff);

function handleListEvents(req, res) {
  try {
    return res.json({
      project: String(req.params.project || '').trim().toLowerCase(),
      items: listEvents(req.params.project, {
        limit: req.query?.limit
      })
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to list events'
    });
  }
}

app.get('/media-manager/project/:project/events', handleListEvents);
app.get('/public/media-manager/project/:project/events', handleListEvents);

function handleGetProjectInsights(req, res) {
  try {
    return res.json(getProjectInsightsEnginePayload(req.params.project));
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to build project insights'
    });
  }
}

function handleGetProjectLearning(req, res) {
  try {
    return res.json(getProjectLearningEnginePayload(req.params.project));
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to build project learning'
    });
  }
}

app.get('/api/insights/:project', handleGetProjectInsights);
app.get('/public/api/insights/:project', handleGetProjectInsights);
app.get('/api/learning/:project', handleGetProjectLearning);
app.get('/public/api/learning/:project', handleGetProjectLearning);

app.post('/media-manager/project/:project/sources', (req, res) => {
  try {
    const sourceType = String(req.body?.source_type || '').trim().toLowerCase();
    const sourceValue = String(req.body?.source_value || '').trim();

    if (!sourceType) {
      return res.status(400).json({
        error: 'Missing source_type'
      });
    }

    if (!sourceValue) {
      return res.status(400).json({
        error: 'Missing source_value'
      });
    }

    const result = setProjectSourceOfTruth(req.params.project, sourceType, sourceValue);
    return res.json(result);
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to save project source'
    });
  }
});

app.post('/public/media-manager/project/:project/sources', (req, res) => {
  try {
    const sourceType = String(req.body?.source_type || '').trim().toLowerCase();
    const sourceValue = String(req.body?.source_value || '').trim();

    if (!sourceType) {
      return res.status(400).json({
        error: 'Missing source_type'
      });
    }

    if (!sourceValue) {
      return res.status(400).json({
        error: 'Missing source_value'
      });
    }

    const result = setProjectSourceOfTruth(req.params.project, sourceType, sourceValue);
    return res.json(result);
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to save project source'
    });
  }
});

app.delete('/media-manager/project/:project/sources/:sourceType', (req, res) => {
  try {
    const result = removeProjectSourceOfTruth(req.params.project, req.params.sourceType);
    return res.json(result);
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to remove project source'
    });
  }
});

app.delete('/public/media-manager/project/:project/sources/:sourceType', (req, res) => {
  try {
    const result = removeProjectSourceOfTruth(req.params.project, req.params.sourceType);
    return res.json(result);
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to remove project source'
    });
  }
});

function handleGetProjectIntegrationControlCenter(req, res) {
  try {
    return res.json(reviewProjectIntegrationControlCenter(req.params.project));
  } catch (error) {
    return res.status(400).json({
      error: error.message || 'Failed to load integration control center'
    });
  }
}

function getIntegrationErrorHttpStatus(error) {
  const status = normalizeTextValue(error?.status).toLowerCase();
  if (status === 'token_expired') {
    return 401;
  }
  if (status === 'unsupported_provider') {
    return 422;
  }
  if (status === 'reconnect_required') {
    return 403;
  }
  if (status === 'error') {
    return 502;
  }
  return 400;
}

async function handleConnectProjectIntegration(req, res, options = {}) {
  try {
    const result = await saveProjectIntegrationRecord(req.params.project, req.params.integrationId, {
      source_key: req.body?.source_key,
      primary_field: req.body?.primary_field,
      primary_value: req.body?.primary_value,
      config: req.body?.config,
      credentials: req.body?.credentials,
      auth_fields: req.body?.auth_fields,
      required_fields: req.body?.required_fields,
      data_scopes: req.body?.data_scopes,
      read_scopes: req.body?.read_scopes,
      write_scopes: req.body?.write_scopes,
      connection_method: req.body?.connection_method,
      permission_scope: req.body?.permission_scope,
      enables: req.body?.enables,
      notes: req.body?.notes,
      token_expires_at: req.body?.token_expires_at,
      requires_credentials: req.body?.requires_credentials,
      sync_source_registry: req.body?.sync_source_registry
    }, options);

    return res.json(result);
  } catch (error) {
    logCriticalFailure('integration_connect', req, error, {
      project: req.params.project,
      integrationId: req.params.integrationId,
      reconnect: Boolean(options?.reconnect)
    });
    return res.status(getIntegrationErrorHttpStatus(error)).json({
      error: error.message || 'Failed to save integration connection'
    });
  }
}

async function handleProjectIntegrationAction(req, res, actionType) {
  try {
    const result = await runProjectIntegrationAction(
      req.params.project,
      req.params.integrationId,
      actionType,
      req.body || {}
    );

    return res.json(result);
  } catch (error) {
    logCriticalFailure('integration_action', req, error, {
      project: req.params.project,
      integrationId: req.params.integrationId,
      integrationAction: actionType
    });
    return res.status(getIntegrationErrorHttpStatus(error)).json({
      error: error.message || 'Failed to update integration'
    });
  }
}

app.get('/media-manager/project/:project/integrations/control-center', handleGetProjectIntegrationControlCenter);
app.get('/public/media-manager/project/:project/integrations/control-center', handleGetProjectIntegrationControlCenter);

app.post('/media-manager/project/:project/integrations/:integrationId/connect', async (req, res) => {
  await handleConnectProjectIntegration(req, res, {
    reconnect: false
  });
});

app.post('/public/media-manager/project/:project/integrations/:integrationId/connect', async (req, res) => {
  await handleConnectProjectIntegration(req, res, {
    reconnect: false
  });
});

app.post('/media-manager/project/:project/integrations/:integrationId/reconnect', async (req, res) => {
  await handleConnectProjectIntegration(req, res, {
    reconnect: true
  });
});

app.post('/public/media-manager/project/:project/integrations/:integrationId/reconnect', async (req, res) => {
  await handleConnectProjectIntegration(req, res, {
    reconnect: true
  });
});

app.post('/media-manager/project/:project/integrations/:integrationId/test', async (req, res) => {
  await handleProjectIntegrationAction(req, res, 'test');
});

app.post('/public/media-manager/project/:project/integrations/:integrationId/test', async (req, res) => {
  await handleProjectIntegrationAction(req, res, 'test');
});

app.post('/media-manager/project/:project/integrations/:integrationId/sync', async (req, res) => {
  await handleProjectIntegrationAction(req, res, 'sync');
});

app.post('/public/media-manager/project/:project/integrations/:integrationId/sync', async (req, res) => {
  await handleProjectIntegrationAction(req, res, 'sync');
});

app.post('/media-manager/project/:project/integrations/:integrationId/import-history', async (req, res) => {
  await handleProjectIntegrationAction(req, res, 'import-history');
});

app.post('/public/media-manager/project/:project/integrations/:integrationId/import-history', async (req, res) => {
  await handleProjectIntegrationAction(req, res, 'import-history');
});

app.post('/media-manager/project/:project/integrations/:integrationId/disconnect', async (req, res) => {
  await handleProjectIntegrationAction(req, res, 'disconnect');
});

app.post('/public/media-manager/project/:project/integrations/:integrationId/disconnect', async (req, res) => {
  await handleProjectIntegrationAction(req, res, 'disconnect');
});

// TODO(phase4a): Keep `/public/media-manager/...` write aliases for active frontend compatibility.
// They remain protected by the same centralized write-key middleware as `/media-manager/...`.
app.post('/media-manager/project/:project/publishing/schedule', (req, res) => {
  try {
    assertPublishingMutationAllowed(req.params.project, 'schedule', {
      status: req.body?.status
    });
    const result = upsertScheduledJob(req.params.project, {
      title: req.body?.title,
      wave_name: req.body?.wave_name,
      channel: req.body?.channel,
      scheduled_for: req.body?.scheduled_for,
      status: req.body?.status,
      mode: req.body?.mode,
      offer: req.body?.offer,
      notes: req.body?.notes,
      preview: req.body?.preview
    }, {
      createIfMissing: true
    });

    return res.json({
      job: result
    });
  } catch (error) {
    logCriticalFailure('publishing_schedule', req, error, {
      project: req.params.project
    });
    return res.status(error.statusCode || 400).json({
      error: error.message || 'Failed to save publishing schedule',
      details: error.details || undefined
    });
  }
});

app.post('/public/media-manager/project/:project/publishing/schedule', (req, res) => {
  try {
    assertPublishingMutationAllowed(req.params.project, 'schedule', {
      status: req.body?.status
    });
    const result = upsertScheduledJob(req.params.project, {
      title: req.body?.title,
      wave_name: req.body?.wave_name,
      channel: req.body?.channel,
      scheduled_for: req.body?.scheduled_for,
      status: req.body?.status,
      mode: req.body?.mode,
      offer: req.body?.offer,
      notes: req.body?.notes,
      preview: req.body?.preview
    }, {
      createIfMissing: true
    });

    return res.json({
      job: result
    });
  } catch (error) {
    logCriticalFailure('publishing_schedule', req, error, {
      project: req.params.project
    });
    return res.status(error.statusCode || 400).json({
      error: error.message || 'Failed to save publishing schedule',
      details: error.details || undefined
    });
  }
});

app.post('/media-manager/project/:project/publishing/:jobId/reschedule', (req, res) => {
  try {
    assertPublishingMutationAllowed(req.params.project, 'reschedule', {
      jobId: req.params.jobId,
      status: req.body?.status || 'scheduled'
    });
    const result = updateScheduledJobRecord(req.params.project, req.params.jobId, {
      title: req.body?.title,
      wave_name: req.body?.wave_name,
      channel: req.body?.channel,
      scheduled_for: req.body?.scheduled_for,
      status: req.body?.status || 'scheduled',
      mode: req.body?.mode,
      offer: req.body?.offer,
      notes: req.body?.notes,
      preview: req.body?.preview
    });

    return res.json({
      job: result
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      error: error.message || 'Failed to reschedule publishing item',
      details: error.details || undefined
    });
  }
});

app.post('/public/media-manager/project/:project/publishing/:jobId/reschedule', (req, res) => {
  try {
    assertPublishingMutationAllowed(req.params.project, 'reschedule', {
      jobId: req.params.jobId,
      status: req.body?.status || 'scheduled'
    });
    const result = updateScheduledJobRecord(req.params.project, req.params.jobId, {
      title: req.body?.title,
      wave_name: req.body?.wave_name,
      channel: req.body?.channel,
      scheduled_for: req.body?.scheduled_for,
      status: req.body?.status || 'scheduled',
      mode: req.body?.mode,
      offer: req.body?.offer,
      notes: req.body?.notes,
      preview: req.body?.preview
    });

    return res.json({
      job: result
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      error: error.message || 'Failed to reschedule publishing item',
      details: error.details || undefined
    });
  }
});

app.post('/media-manager/project/:project/publishing/:jobId/ready', (req, res) => {
  try {
    assertPublishingMutationAllowed(req.params.project, 'ready', {
      jobId: req.params.jobId,
      status: 'ready'
    });
    const job = updateScheduledJobRecord(req.params.project, req.params.jobId, {
      status: 'ready',
      notes: req.body?.notes
    });

    return res.json({
      job
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      error: error.message || 'Failed to approve publishing item',
      details: error.details || undefined
    });
  }
});

app.post('/public/media-manager/project/:project/publishing/:jobId/ready', (req, res) => {
  try {
    assertPublishingMutationAllowed(req.params.project, 'ready', {
      jobId: req.params.jobId,
      status: 'ready'
    });
    const job = updateScheduledJobRecord(req.params.project, req.params.jobId, {
      status: 'ready',
      notes: req.body?.notes
    });

    return res.json({
      job
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      error: error.message || 'Failed to approve publishing item',
      details: error.details || undefined
    });
  }
});

app.post('/media-manager/project/:project/publishing/:jobId/publish', (req, res) => {
  try {
    assertPublishingMutationAllowed(req.params.project, 'publish', {
      jobId: req.params.jobId,
      status: 'published'
    });
    const job = updateScheduledJobRecord(req.params.project, req.params.jobId, {
      status: 'published',
      notes: req.body?.notes
    });
    const result = recordPublishingExecutionOutcome(req.params.project, req.params.jobId, {
      execution_status: 'published',
      action_type: 'manual_publish_complete',
      notes: req.body?.notes || ['Publishing completed from Control Center.']
    });

    return res.json({
      job,
      result
    });
  } catch (error) {
    logCriticalFailure('publishing_publish', req, error, {
      project: req.params.project,
      jobId: req.params.jobId
    });
    return res.status(error.statusCode || 400).json({
      error: error.message || 'Failed to publish item',
      details: error.details || undefined
    });
  }
});

app.post('/public/media-manager/project/:project/publishing/:jobId/publish', (req, res) => {
  try {
    assertPublishingMutationAllowed(req.params.project, 'publish', {
      jobId: req.params.jobId,
      status: 'published'
    });
    const job = updateScheduledJobRecord(req.params.project, req.params.jobId, {
      status: 'published',
      notes: req.body?.notes
    });
    const result = recordPublishingExecutionOutcome(req.params.project, req.params.jobId, {
      execution_status: 'published',
      action_type: 'manual_publish_complete',
      notes: req.body?.notes || ['Publishing completed from Control Center.']
    });

    return res.json({
      job,
      result
    });
  } catch (error) {
    logCriticalFailure('publishing_publish', req, error, {
      project: req.params.project,
      jobId: req.params.jobId
    });
    return res.status(error.statusCode || 400).json({
      error: error.message || 'Failed to publish item',
      details: error.details || undefined
    });
  }
});

app.post('/media-manager/project/:project/publishing/:jobId/fail', (req, res) => {
  try {
    assertPublishingMutationAllowed(req.params.project, 'fail', {
      jobId: req.params.jobId,
      status: 'failed'
    });
    const job = updateScheduledJobRecord(req.params.project, req.params.jobId, {
      status: 'failed',
      notes: req.body?.notes
    });
    const result = recordPublishingExecutionOutcome(req.params.project, req.params.jobId, {
      execution_status: 'failed',
      action_type: 'manual_publish_failed',
      notes: req.body?.notes || ['Publishing failed and needs follow-up.']
    });

    return res.json({
      job,
      result
    });
  } catch (error) {
    logCriticalFailure('publishing_fail', req, error, {
      project: req.params.project,
      jobId: req.params.jobId
    });
    return res.status(error.statusCode || 400).json({
      error: error.message || 'Failed to mark publishing item as failed',
      details: error.details || undefined
    });
  }
});

app.post('/public/media-manager/project/:project/publishing/:jobId/fail', (req, res) => {
  try {
    assertPublishingMutationAllowed(req.params.project, 'fail', {
      jobId: req.params.jobId,
      status: 'failed'
    });
    const job = updateScheduledJobRecord(req.params.project, req.params.jobId, {
      status: 'failed',
      notes: req.body?.notes
    });
    const result = recordPublishingExecutionOutcome(req.params.project, req.params.jobId, {
      execution_status: 'failed',
      action_type: 'manual_publish_failed',
      notes: req.body?.notes || ['Publishing failed and needs follow-up.']
    });

    return res.json({
      job,
      result
    });
  } catch (error) {
    logCriticalFailure('publishing_fail', req, error, {
      project: req.params.project,
      jobId: req.params.jobId
    });
    return res.status(error.statusCode || 400).json({
      error: error.message || 'Failed to mark publishing item as failed',
      details: error.details || undefined
    });
  }
});

app.get('/media-manager', (req, res) => {
  return res.redirect(302, '/control-center/');
});

app.get('/media-manager/', (req, res) => {
  return res.redirect(302, '/control-center/');
});

app.get(/^\/control-center$/, (req, res) => {
  return res.redirect(302, '/control-center/');
});

function buildControlCenterBootstrapScript(req) {
  const hostname = String(req.hostname || '').trim().toLowerCase();
  const isLocalRequest = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';

  if (!isLocalRequest) {
    return '';
  }

  const controlKey =
    process.env.MH_CONTROL_CENTER_READ_KEY ||
    process.env.MH_CONTROL_CENTER_WRITE_KEY ||
    process.env.MH_CONTROL_KEY ||
    '';

  if (!controlKey) {
    return '';
  }

  const serializedKey = JSON.stringify(String(controlKey));

  return [
    '<script>',
    `window.__MH_CONTROL_CENTER_READ_KEY__ = ${serializedKey};`,
    `window.__MH_CONTROL_CENTER_WRITE_KEY__ = ${serializedKey};`,
    `window.__MH_CONTROL_WRITE_KEY__ = ${serializedKey};`,
    '</script>'
  ].join('');
}

app.use(/^\/control-center\/(?:index\.html)?$/, (req, res, next) => {
  if (!['GET', 'HEAD'].includes(String(req.method || '').toUpperCase())) {
    return next();
  }

  try {
    const filePath = path.join(CONTROL_CENTER_PUBLIC_DIR, 'index.html');
    const html = fs.readFileSync(filePath, 'utf8');
    const bootstrapScript = buildControlCenterBootstrapScript(req);
    const appScriptPattern = /<script\s+type="module"\s+src="\.\/app\.js(?:\?[^"\s]*)?"\s*><\/script>/i;

    let body = html;
    if (bootstrapScript) {
      if (appScriptPattern.test(html)) {
        body = html.replace(appScriptPattern, (match) => `${bootstrapScript}\n  ${match}`);
      } else {
        body = html.replace('</body>', `${bootstrapScript}\n</body>`);
      }
    }

    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    return res.type('html').send(body);
  } catch (error) {
    return next(error);
  }
});

app.use('/control-center', express.static(CONTROL_CENTER_PUBLIC_DIR, {
  index: false,
  redirect: false,
  etag: false,
  setHeaders: (res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  }
}));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/generated-output/:project/:filename', (req, res) => {
  const project = normalizeProjectSlug(req.params.project);
  const filename = String(req.params.filename || '').trim();
  const safeFilename = path.basename(filename);

  if (!project || !safeFilename || safeFilename !== filename) {
    return res.status(400).send('Missing project or filename');
  }

  // Use canonical-first candidate resolution with fallback instrumentation
  const candidate = resolveExecutionReadCandidate({
    projectName: project,
    domain: 'generated',
    relativePath: path.join('outputs', safeFilename),
    pathType: 'file'
  });
  const filePath = candidate.selectedPath;

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Generated output not found');
  }

  return res.sendFile(filePath);
});

function getProductIntelligencePaths(projectName) {
  const resolution = unifiedDataPathResolver.resolve(projectName, {
    domain: 'media-intelligence',
    operation: 'read'
  });
  const baseDir = path.join(resolution.activeReadPath, 'product-intelligence');

  const productsPath = path.join(baseDir, 'products.json');

  ensureDir(baseDir);
  ensureJsonFile(productsPath, []);

  return {
    baseDir,
    productsPath
  };
}

function normalizeProductCategoryFromText(text = '') {
  const t = String(text || '').toLowerCase();

  if (t.includes('beard')) return 'beard';
  if (t.includes('hair')) return 'hair';
  if (t.includes('after shave') || t.includes('skin') || t.includes('face')) return 'skin';

  return 'general';
}

function inferLineFromText(text = '') {
  const t = String(text || '').toLowerCase();

  if (t.includes('deep sky')) return 'Deep Sky';
  if (t.includes('adrenaline')) return 'Adrenaline';
  if (t.includes('classic')) return 'Classic';

  return null;
}

function inferSizeFromText(text = '') {
  const match = String(text || '').match(/(\d+)\s*ml/i);
  return match ? `${match[1]}ml` : null;
}

function buildDefaultContentDesignRules(productRecord) {
  return {
    branding: {
      objective: 'awareness',
      visual_style: 'premium_branding',
      emphasize: ['brand identity', 'premium look', 'product presence'],
      avoid: ['ingredient overload', 'technical clutter']
    },
    feature: {
      objective: 'consideration',
      visual_style: 'educational_product_focus',
      emphasize: ['benefits', 'usage clarity', 'product close-up'],
      avoid: ['generic luxury without product relevance']
    },
    offer: {
      objective: 'conversion',
      visual_style: 'bold_promo',
      emphasize: ['offer clarity', 'product visibility', 'CTA readiness'],
      avoid: ['overloaded text', 'unclear pricing logic']
    },
    infographic: {
      objective: 'education',
      visual_style: 'structured_information',
      emphasize: ['steps', 'ingredients', 'benefits', 'usage'],
      avoid: ['cinematic blur', 'excess decorative effects']
    },
    marketplace: {
      objective: 'conversion',
      visual_style: 'clean_ecommerce',
      emphasize: ['clarity', 'compliance', 'real product fidelity'],
      avoid: ['fake claims', 'decorative clutter', 'non-compliant overlays']
    },
    partner: {
      objective: 'partner_recruitment',
      visual_style: 'trust_recruitment',
      emphasize: ['business value', 'brand credibility', 'program clarity'],
      avoid: ['consumer-only messaging']
    }
  };
}

function buildProductIntelligenceRecordFromWoo(product) {
  const combinedText = [
    product?.name || '',
    product?.slug || '',
    product?.short_description || '',
    product?.description || ''
  ].join(' ');

  const category = normalizeProductCategoryFromText(combinedText);
  const line = inferLineFromText(combinedText);
  const size = inferSizeFromText(combinedText);

  const imageUrls = Array.isArray(product?.images)
    ? product.images.map(img => img.src).filter(Boolean)
    : [];

  const record = {
    product_id: product?.id || null,
    product_slug: product?.slug || null,
    product_name: product?.name || null,
    category,
    line,
    size,
    status: product?.status || null,
    permalink: product?.permalink || null,
    short_description: product?.short_description || '',
    description: product?.description || '',
    wc_image_urls: imageUrls,
    source_of_truth: {
      from_woocommerce: true,
      product_id: product?.id || null,
      product_slug: product?.slug || null
    },
    marketing_intelligence: {
      benefits: [],
      ingredients: [],
      usage: [],
      target_audience: [],
      positioning: null
    },
    content_design_rules: {},
    updated_at: new Date().toISOString()
  };

  record.content_design_rules = buildDefaultContentDesignRules(record);

  return record;
}

function upsertProductIntelligenceRecord(projectName, record) {
  const paths = getProductIntelligencePaths(projectName);
  const products = readJsonFile(paths.productsPath, []);

  const index = products.findIndex(
    x =>
      (record.product_id && x.product_id === record.product_id) ||
      (record.product_slug && x.product_slug === record.product_slug)
  );

  if (index >= 0) {
    products[index] = {
      ...products[index],
      ...record,
      marketing_intelligence: {
        ...(products[index].marketing_intelligence || {}),
        ...(record.marketing_intelligence || {})
      },
      content_design_rules:
        record.content_design_rules || products[index].content_design_rules || {},
      updated_at: new Date().toISOString()
    };
  } else {
    products.push(record);
  }

  writeJsonFile(paths.productsPath, products);
  return record;
}

function listProductIntelligence(projectName) {
  const paths = getProductIntelligencePaths(projectName);
  return readJsonFile(paths.productsPath, []);
}

function reviewProductIntelligence(projectName, productSlug) {
  const paths = getProductIntelligencePaths(projectName);
  const products = readJsonFile(paths.productsPath, []);

  const product = products.find(
    x => String(x.product_slug || '').toLowerCase() === String(productSlug || '').toLowerCase()
  );

  if (!product) {
    throw new Error('Product intelligence record not found');
  }

  return product;
}
function buildProductPromptPack(product) {
  const mi = product.marketing_intelligence || {};
  const cm = product.creative_map || {};
  const productName = product.product_name || 'This product';
  const category = mi.product_type || product.category || 'general';
  const benefits = Array.isArray(mi.benefits) ? mi.benefits : [];
  const ingredients = Array.isArray(mi.ingredients) ? mi.ingredients : [];
  const usage = Array.isArray(mi.usage) ? mi.usage : [];
  const audience = Array.isArray(mi.target_audience) ? mi.target_audience : ['men'];
  const positioning = mi.positioning || 'professional';

  const benefitText = benefits.length ? benefits.join(', ') : 'care and performance';
  const ingredientText = ingredients.length ? ingredients.join(', ') : 'high-quality ingredients';
  const usageText = usage.length ? usage.join(', ') : 'daily use';
  const audienceText = audience.join(', ');

  function makeBlock(type, fallbackGoal) {
    const map = cm[type] || {};
    const hook = map.hook || `${productName} supports ${category} care with ${benefitText}.`;
    const visualStyle = map.visual_style || 'clean_professional';
    const goal = map.goal || fallbackGoal;
    const cta = map.cta || 'Learn more';

    return {
      goal,
      hook,
      headline: `${productName} — ${benefitText}`,
      cta,
      visual_prompt:
        `Create a brand-controlled ${type} visual for ${productName}. ` +
        `Category: ${category}. Positioning: ${positioning}. ` +
        `Show the real product and real logo only. ` +
        `Emphasize: ${benefitText}. Ingredients context: ${ingredientText}. ` +
        `Usage context: ${usageText}. Audience: ${audienceText}. ` +
        `Visual style: ${visualStyle}. ` +
        `Do not invent product structure, label, or packaging. ` +
        `Only improve background, lighting, shadow, depth, and composition.`,
      video_prompt:
        `Create a short-form ${type} video concept for ${productName}. ` +
        `Open with a strong hook for ${audienceText}. ` +
        `Highlight ${benefitText}. ` +
        `Reference usage: ${usageText}. ` +
        `Use a ${visualStyle} direction. ` +
        `Keep the real product visually faithful. ` +
        `No fake brand elements.`,
      caption_direction:
        `${hook} Focus on ${benefitText}. Keep tone aligned with ${positioning} ${category} branding.`,
      compliance_notes: [
        'Use real registered brand assets only.',
        'Do not alter packaging, label structure, or logo identity.',
        'Keep claims aligned with real product data.',
        'Avoid unsupported medical or misleading claims.'
      ]
    };
  }

  return {
    branding: makeBlock('branding', 'awareness'),
    feature: makeBlock('feature', 'consideration'),
    offer: makeBlock('offer', 'conversion'),
    infographic: makeBlock('infographic', 'education'),
    reel: makeBlock('reel', 'attention'),
    marketplace: makeBlock('marketplace', 'conversion'),
    partner: makeBlock('partner', 'recruitment')
  };
}
function buildChannelPack(product) {
  const pp = product.prompt_pack || {};
  const name = product.product_name || 'This product';
  const productProject = normalizeOptionalProjectSlug(product.project || product.project_name);
  const brandHashtag = productProject ? buildProjectHashtag(productProject) : '#Brand';

  function ig() {
    const b = pp.branding || {};
    return {
      caption: `${b.hook}\n\n${b.cta}\n\n${brandHashtag} #mensgrooming #premiumstyle`,
      visual_prompt: b.visual_prompt,
      format: 'square / 4:5',
      goal: 'engagement + awareness'
    };
  }

  function tiktok() {
    const r = pp.reel || {};
    return {
      hook_3s: r.hook,
      video_prompt: r.video_prompt,
      structure: [
        'Hook (0-3s)',
        'Product focus (3-8s)',
        'Benefit highlight (8-15s)',
        'CTA (15s+)'
      ],
      goal: 'attention + reach'
    };
  }

  function youtube() {
    const r = pp.reel || {};
    return {
      short_title: `${name} — Quick Result`,
      hook: r.hook,
      video_prompt: r.video_prompt,
      format: 'Short (9:16)',
      goal: 'discovery'
    };
  }

  function marketplace() {
    const m = pp.marketplace || {};
    return {
      title: `${name} | Premium Grooming Product`,
      bullets: [
        'Real product presentation',
        'Premium brand quality',
        'Designed for daily use',
        'Trusted grooming solution'
      ],
      visual_prompt: m.visual_prompt,
      goal: 'conversion'
    };
  }

  function email() {
    const b = pp.branding || {};
    return {
      subject: `${name} — Discover the Difference`,
      headline: b.headline,
      body: b.hook,
      cta: b.cta,
      visual_prompt: b.visual_prompt
    };
  }

  return {
    instagram: ig(),
    facebook: ig(),
    tiktok: tiktok(),
    youtube: youtube(),
    amazon: marketplace(),
    ebay: marketplace(),
    email: email()
  };
}
function getCampaignExecutionPaths(projectName) {
  const safeProject = String(projectName || '').trim().toLowerCase();
  const resolution = unifiedDataPathResolver.resolve(safeProject, {
    domain: 'campaign-execution',
    operation: 'read'
  });
  const baseDir = resolveExecutionReadCandidate({
    projectName: safeProject,
    domain: 'campaign-execution',
    relativePath: '',
    pathType: 'directory',
    requestedIdentifier: 'campaign-execution-root',
    requestedFile: 'campaign-execution'
  }).selectedPath;
  const legacyBaseDir = path.join(resolution.legacyRoot, 'campaign-execution');

  const packagesDir = path.join(baseDir, 'packages');
  const legacyPackagesDir = path.join(legacyBaseDir, 'packages');

  ensureDir(baseDir);
  ensureDir(packagesDir);
  ensureDir(legacyBaseDir);
  ensureDir(legacyPackagesDir);

  return {
    baseDir,
    packagesDir,
    legacyBaseDir,
    legacyPackagesDir
  };
}

function buildCampaignExecutionPackage(projectName, campaignName, productSlugs = []) {
  const paths = getProductIntelligencePaths(projectName);
  const products = readJsonFile(paths.productsPath, []);

  const selectedProducts = products.filter(p =>
    productSlugs.includes(String(p.product_slug || '').toLowerCase())
  );

  if (!selectedProducts.length) {
    throw new Error('No matching products found for campaign package');
  }

  const packageId = `camp_${Date.now()}`;
  const generatedAt = new Date().toISOString();

  const packageData = {
    package_id: packageId,
    project: projectName,
    campaign_name: campaignName,
    generated_at: generatedAt,
    total_products: selectedProducts.length,
    products: selectedProducts.map(product => ({
      product_id: product.product_id || null,
      product_slug: product.product_slug || null,
      product_name: product.product_name || null,
      category: product.category || null,
      marketing_intelligence: product.marketing_intelligence || {},
      creative_map: product.creative_map || {},
      prompt_pack: product.prompt_pack || {},
      channel_pack: product.channel_pack || {}
    }))
  };

  const execPaths = getCampaignExecutionPaths(projectName);
  const filePath = path.join(
    execPaths.legacyPackagesDir,
    `${campaignName.replace(/[^a-z0-9_-]/gi, '_').toLowerCase()}.json`
  );

  executionArtifactWriter.writeJson({
    project: projectName,
    domain: 'campaign-execution',
    artifactType: 'campaign_execution_package',
    identifier: packageId,
    legacyPath: filePath,
    data: packageData
  });

  return {
    ...packageData,
    file_path: filePath
  };
}

function readCampaignExecutionPackage(projectName, campaignName) {
  const safeName = `${campaignName.replace(/[^a-z0-9_-]/gi, '_').toLowerCase()}.json`;
  const filePath = resolveExecutionReadCandidate({
    projectName,
    domain: 'campaign-execution',
    relativePath: path.join('packages', safeName),
    pathType: 'file',
    requestedIdentifier: campaignName,
    requestedFile: `campaign-execution/packages/${safeName}`
  }).selectedPath;

  if (!fs.existsSync(filePath)) {
    throw new Error('Campaign execution package not found');
  }

  const data = readJsonFile(filePath, {});
  return {
    ...data,
    file_path: filePath
  };
}

function buildChannelExecutionPayload(projectName, campaignName, channel) {
  const pkg = readCampaignExecutionPackage(projectName, campaignName);
  const normalizedChannel = String(channel || '').toLowerCase();

  const payload = {
    project: projectName,
    campaign_name: campaignName,
    channel: normalizedChannel,
    generated_at: new Date().toISOString(),
    total_products: pkg.products.length,
    assets: []
  };

  for (const product of pkg.products) {
    const channelPack = product.channel_pack || {};
    const promptPack = product.prompt_pack || {};
    const asset = channelPack[normalizedChannel] || null;

    if (!asset) {
      continue;
    }

    payload.assets.push({
      product_slug: product.product_slug,
      product_name: product.product_name,
      category: product.category,
      channel_asset: asset,
      fallback_prompt_pack:
        normalizedChannel === 'amazon' || normalizedChannel === 'ebay'
          ? promptPack.marketplace || null
          : normalizedChannel === 'email'
          ? promptPack.branding || null
          : promptPack.branding || null
    });
  }

  return payload;
}
function getCampaignFinalizationPaths(projectName) {
  const safeProject = String(projectName || '').trim().toLowerCase();
  // Semi-auto campaign artifacts are still dual-path during stabilization:
  // canonical reads are preferred when present, with legacy brand-assets as
  // the required fallback for existing HAIROTICMEN dry-run packages.
  const resolution = unifiedDataPathResolver.resolve(safeProject, {
    domain: 'campaign-finalization',
    operation: 'read'
  });
  const baseDir = resolveExecutionReadCandidate({
    projectName: safeProject,
    domain: 'campaign-finalization',
    relativePath: '',
    pathType: 'directory',
    requestedIdentifier: 'campaign-finalization-root',
    requestedFile: 'campaign-finalization'
  }).selectedPath;
  const legacyBaseDir = path.join(resolution.legacyRoot, 'campaign-finalization');

  const mediaDir = path.join(baseDir, 'media-jobs');
  const publishDir = path.join(baseDir, 'publish-packages');
  const emailDir = path.join(baseDir, 'email');
  const legacyMediaDir = path.join(legacyBaseDir, 'media-jobs');
  const legacyPublishDir = path.join(legacyBaseDir, 'publish-packages');
  const legacyEmailDir = path.join(legacyBaseDir, 'email');

  ensureDir(baseDir);
  ensureDir(mediaDir);
  ensureDir(publishDir);
  ensureDir(emailDir);
  ensureDir(legacyBaseDir);
  ensureDir(legacyMediaDir);
  ensureDir(legacyPublishDir);
  ensureDir(legacyEmailDir);

  return {
    baseDir,
    mediaDir,
    publishDir,
    emailDir,
    legacyBaseDir,
    legacyMediaDir,
    legacyPublishDir,
    legacyEmailDir
  };
}

function buildCampaignMediaJob(projectName, campaignName, channel) {
  const payload = buildChannelExecutionPayload(projectName, campaignName, channel);
  const paths = getCampaignFinalizationPaths(projectName);

  const jobId = `mediajob_${Date.now()}`;
  const filePath = path.join(
    paths.legacyMediaDir,
    `${campaignName.replace(/[^a-z0-9_-]/gi, '_').toLowerCase()}_${channel}.json`
  );

  const job = {
    job_id: jobId,
    project: projectName,
    campaign_name: campaignName,
    channel,
    generated_at: new Date().toISOString(),
    total_assets: payload.assets.length,
    assets: payload.assets
  };

  executionArtifactWriter.writeJson({
    project: projectName,
    domain: 'campaign-finalization',
    artifactType: 'campaign_media_job',
    identifier: jobId,
    legacyPath: filePath,
    data: job
  });

  return {
    ...job,
    file_path: filePath
  };
}

function buildCampaignPublishPackage(projectName, campaignName, channel) {
  const payload = buildChannelExecutionPayload(projectName, campaignName, channel);
  const paths = getCampaignFinalizationPaths(projectName);

  const packageId = `publish_${Date.now()}`;
  const filePath = path.join(
    paths.legacyPublishDir,
    `${campaignName.replace(/[^a-z0-9_-]/gi, '_').toLowerCase()}_${channel}.json`
  );

  const pkg = {
    package_id: packageId,
    project: projectName,
    campaign_name: campaignName,
    channel,
    generated_at: new Date().toISOString(),
    ready_for_publish: payload.assets.length > 0,
    total_assets: payload.assets.length,
    assets: payload.assets
  };

  executionArtifactWriter.writeJson({
    project: projectName,
    domain: 'campaign-finalization',
    artifactType: 'campaign_publish_package',
    identifier: packageId,
    legacyPath: filePath,
    data: pkg
  });

  return {
    ...pkg,
    file_path: filePath
  };
}

function buildCampaignEmailPackage(projectName, campaignName) {
  const payload = buildChannelExecutionPayload(projectName, campaignName, 'email');
  const paths = getCampaignFinalizationPaths(projectName);

  const packageId = `campemail_${Date.now()}`;
  const filePath = path.join(
    paths.legacyEmailDir,
    `${campaignName.replace(/[^a-z0-9_-]/gi, '_').toLowerCase()}.json`
  );

  const firstAsset = payload.assets[0] || null;

  const emailPackage = {
    package_id: packageId,
    project: projectName,
    campaign_name: campaignName,
    channel: 'email',
    generated_at: new Date().toISOString(),
    ready_for_prepare: !!firstAsset,
    total_assets: payload.assets.length,
    primary_asset: firstAsset
  };

  executionArtifactWriter.writeJson({
    project: projectName,
    domain: 'campaign-finalization',
    artifactType: 'campaign_email_package',
    identifier: packageId,
    legacyPath: filePath,
    data: emailPackage
  });

  return {
    ...emailPackage,
    file_path: filePath
  };
}

function reviewCampaignFinalization(projectName, campaignName) {
  const safeName = campaignName.replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
  const mediaDir = resolveExecutionReadCandidate({
    projectName,
    domain: 'campaign-finalization',
    relativePath: 'media-jobs',
    pathType: 'directory',
    matcher: new RegExp(`^${safeName}`),
    requestedIdentifier: campaignName,
    requestedFile: `campaign-finalization/media-jobs/${safeName}*`
  }).selectedPath;
  const publishDir = resolveExecutionReadCandidate({
    projectName,
    domain: 'campaign-finalization',
    relativePath: 'publish-packages',
    pathType: 'directory',
    matcher: new RegExp(`^${safeName}`),
    requestedIdentifier: campaignName,
    requestedFile: `campaign-finalization/publish-packages/${safeName}*`
  }).selectedPath;
  const emailFile = resolveExecutionReadCandidate({
    projectName,
    domain: 'campaign-finalization',
    relativePath: path.join('email', `${safeName}.json`),
    pathType: 'file',
    requestedIdentifier: campaignName,
    requestedFile: `campaign-finalization/email/${safeName}.json`
  }).selectedPath;

  const mediaFiles = fs.existsSync(mediaDir)
    ? fs.readdirSync(mediaDir).filter(x => x.startsWith(safeName))
    : [];
  const publishFiles = fs.existsSync(publishDir)
    ? fs.readdirSync(publishDir).filter(x => x.startsWith(safeName))
    : [];

  return {
    project: projectName,
    campaign_name: campaignName,
    media_jobs_count: mediaFiles.length,
    publish_packages_count: publishFiles.length,
    has_email_package: fs.existsSync(emailFile),
    ready: mediaFiles.length > 0 || publishFiles.length > 0 || fs.existsSync(emailFile)
  };
}

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getExecutionBridgeLogDirectory(projectName) {
  const safeProject = normalizeProjectSlug(projectName);
  const projectRoot = resolveProjectPath(path.join(DATA_DIR, 'projects'), safeProject).projectRoot;
  const logsDir = path.join(projectRoot, 'execution', 'logs');
  ensureDir(logsDir);

  return {
    project: safeProject,
    logs_dir: logsDir
  };
}

function writeExecutionBridgeLog(projectName, action, payload = {}) {
  const directory = getExecutionBridgeLogDirectory(projectName);
  const timestamp = new Date().toISOString();
  const safeAction = String(action || 'execution_action')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '_') || 'execution_action';
  const fileSafeStamp = timestamp.replace(/[:.]/g, '-');
  const filePath = path.join(directory.logs_dir, `${fileSafeStamp}_${safeAction}.json`);

  const record = {
    timestamp,
    action: safeAction,
    status: String(payload.status || 'failed').trim() || 'failed',
    result: payload.result == null ? null : sanitizeValue(payload.result)
  };

  if (payload.error) {
    record.error = sanitizeErrorMessage(payload.error, 'Execution bridge failed');
  }

  if (payload.details != null) {
    record.details = sanitizeValue(payload.details);
  }

  writeJsonFile(filePath, record);

  return {
    ...record,
    file_path: filePath
  };
}

function resolveProjectNameForLog(req) {
  return normalizeOptionalProjectSlug(req?.body?.project)
    || normalizeOptionalProjectSlug(req?.query?.project)
    || normalizeOptionalProjectSlug(req?.params?.project)
    || '';
}

function assertExecutionPackageAssets(pkg, packageName = 'package') {
  const assets = Array.isArray(pkg?.assets) ? pkg.assets : [];
  if (!assets.length) {
    const error = new Error(`Cannot execute ${packageName}: package has no assets`);
    error.statusCode = 422;
    error.code = 'EXECUTION_PACKAGE_EMPTY';
    throw error;
  }

  return assets;
}

function resolvePublishPackageForExecution(projectName, input = {}) {
  const inlinePackage = input.publish_package && typeof input.publish_package === 'object'
    ? input.publish_package
    : null;
  if (inlinePackage) {
    return inlinePackage;
  }

  const campaignName = String(input.campaign_name || '').trim();
  const channel = String(input.channel || '').trim().toLowerCase();
  if (!campaignName || !channel) {
    const error = new Error('Missing publish package. Provide publish_package or campaign_name + channel');
    error.statusCode = 400;
    error.code = 'PUBLISH_PACKAGE_MISSING';
    throw error;
  }

  return buildCampaignPublishPackage(projectName, campaignName, channel);
}

function buildSocialExecutionPayload(publishPackage) {
  const assets = assertExecutionPackageAssets(publishPackage, 'publish package');
  const channel = String(publishPackage.channel || '').trim().toLowerCase();
  const primaryAsset = assets[0] || {};
  const channelAsset = primaryAsset.channel_asset && typeof primaryAsset.channel_asset === 'object'
    ? primaryAsset.channel_asset
    : {};
  const caption = String(channelAsset.caption || channelAsset.body || '').trim()
    || `${String(primaryAsset.product_name || publishPackage.campaign_name || 'Campaign').trim()} update`;
  const mediaPath = String(
    channelAsset.media_path
    || channelAsset.asset_path
    || channelAsset.file_path
    || primaryAsset.media_path
    || ''
  ).trim() || null;
  const tiktokSteps = Array.isArray(channelAsset.structure) && channelAsset.structure.length
    ? channelAsset.structure
    : ['Hook (0-3s)', 'Product value (3-8s)', 'Proof or detail (8-15s)', 'CTA (15s+)'];

  return {
    channel,
    caption,
    media_path: mediaPath,
    platform_specific_payload: {
      instagram: {
        caption,
        media_path: mediaPath,
        format: String(channelAsset.format || '4:5').trim(),
        goal: String(channelAsset.goal || 'engagement').trim()
      },
      facebook: {
        message: caption,
        media_path: mediaPath,
        format: String(channelAsset.format || '1:1').trim(),
        goal: String(channelAsset.goal || 'reach').trim()
      },
      tiktok: {
        caption,
        hook_3s: String(channelAsset.hook_3s || '').trim(),
        video_prompt: String(channelAsset.video_prompt || channelAsset.visual_prompt || '').trim(),
        structure: tiktokSteps
      }
    }
  };
}

function resolveEmailPackageForExecution(projectName, input = {}) {
  const inlinePackage = input.email_package && typeof input.email_package === 'object'
    ? input.email_package
    : null;
  if (inlinePackage) {
    return inlinePackage;
  }

  const campaignName = String(input.campaign_name || '').trim();
  if (!campaignName) {
    const error = new Error('Missing email package. Provide email_package or campaign_name');
    error.statusCode = 400;
    error.code = 'EMAIL_PACKAGE_MISSING';
    throw error;
  }

  return buildCampaignEmailPackage(projectName, campaignName);
}

function buildEmailReadyPayload(emailPackage) {
  const primaryAsset = emailPackage.primary_asset && typeof emailPackage.primary_asset === 'object'
    ? emailPackage.primary_asset
    : null;

  if (!primaryAsset || !primaryAsset.channel_asset || typeof primaryAsset.channel_asset !== 'object') {
    const error = new Error('Email package does not include a primary channel asset');
    error.statusCode = 422;
    error.code = 'EMAIL_PACKAGE_INVALID';
    throw error;
  }

  const channelAsset = primaryAsset.channel_asset;
  const campaignName = String(emailPackage.campaign_name || '').trim();
  const subject = String(channelAsset.subject || `${campaignName || 'Campaign'} Update`).trim();
  const headline = String(channelAsset.headline || primaryAsset.product_name || campaignName || 'Campaign Update').trim();
  const body = String(channelAsset.body || channelAsset.caption || '').trim();
  const cta = String(channelAsset.cta || 'Shop now').trim();
  const textBody = [headline, body, cta].filter(Boolean).join('\n\n').trim();
  const htmlBody = [
    '<!doctype html>',
    '<html lang="en">',
    '<body style="font-family:Arial,sans-serif;background:#f7f7f7;color:#111;padding:24px;">',
    `<h1 style="margin:0 0 12px;">${escapeHtml(headline)}</h1>`,
    `<p style="margin:0 0 16px;line-height:1.5;">${escapeHtml(body)}</p>`,
    `<p style="margin:0;"><strong>${escapeHtml(cta)}</strong></p>`,
    '</body>',
    '</html>'
  ].join('');

  return {
    subject,
    html_body: htmlBody,
    text_body: textBody
  };
}

function buildMediaGenerationMock(promptPack = {}, input = {}) {
  const source = promptPack && typeof promptPack === 'object' ? promptPack : {};
  const branding = source.branding && typeof source.branding === 'object' ? source.branding : {};
  const reel = source.reel && typeof source.reel === 'object' ? source.reel : {};
  const feature = source.feature && typeof source.feature === 'object' ? source.feature : {};

  const imagePrompt = String(
    input.image_prompt
    || branding.visual_prompt
    || feature.visual_prompt
    || 'Create a clean brand-safe hero visual with real product focus and premium lighting.'
  ).trim();
  const videoScript = [
    String(reel.hook || branding.hook || 'Start with a direct hook for the target audience.').trim(),
    String(reel.video_prompt || 'Show product usage with a clear before/after context and one main benefit.').trim(),
    String(reel.cta || branding.cta || 'End with a clear CTA and brand tag.').trim()
  ].filter(Boolean).join(' ');

  return {
    image_prompt: imagePrompt,
    video_script: videoScript,
    scene_breakdown: [
      {
        scene: 1,
        timing: '0-3s',
        objective: 'Hook attention',
        direction: String(reel.hook || branding.hook || 'Open with audience pain or aspiration.').trim()
      },
      {
        scene: 2,
        timing: '3-10s',
        objective: 'Show product value',
        direction: String(reel.video_prompt || feature.video_prompt || imagePrompt).trim()
      },
      {
        scene: 3,
        timing: '10-15s',
        objective: 'Drive action',
        direction: String(reel.cta || branding.cta || 'Close with CTA and brand recall.').trim()
      }
    ]
  };
}

function resolveCampaignPackageForAds(projectName, input = {}) {
  const inlinePackage = input.campaign_package && typeof input.campaign_package === 'object'
    ? input.campaign_package
    : null;
  if (inlinePackage) {
    return inlinePackage;
  }

  const campaignName = String(input.campaign_name || '').trim();
  if (!campaignName) {
    const error = new Error('Missing campaign package. Provide campaign_package or campaign_name');
    error.statusCode = 400;
    error.code = 'CAMPAIGN_PACKAGE_MISSING';
    throw error;
  }

  return readCampaignExecutionPackage(projectName, campaignName);
}

function buildAdExecutionPackage(campaignPackage, input = {}) {
  const products = Array.isArray(campaignPackage?.products) ? campaignPackage.products : [];
  if (!products.length) {
    const error = new Error('Campaign package does not include products');
    error.statusCode = 422;
    error.code = 'CAMPAIGN_PACKAGE_EMPTY';
    throw error;
  }

  const primary = products[0] || {};
  const promptPack = primary.prompt_pack && typeof primary.prompt_pack === 'object'
    ? primary.prompt_pack
    : {};
  const offer = promptPack.offer && typeof promptPack.offer === 'object' ? promptPack.offer : {};
  const branding = promptPack.branding && typeof promptPack.branding === 'object' ? promptPack.branding : {};
  const intelligence = primary.marketing_intelligence && typeof primary.marketing_intelligence === 'object'
    ? primary.marketing_intelligence
    : {};

  const headline = String(input.headline || offer.headline || branding.headline || `${primary.product_name || campaignPackage.campaign_name} offer`).trim();
  const cta = String(input.cta || offer.cta || branding.cta || 'Shop now').trim();
  const adCopy = String(input.ad_copy || offer.hook || branding.hook || `${headline}. ${cta}`).trim();
  const audience = String(
    input.audience
    || intelligence.audience_primary
    || intelligence.target_audience
    || intelligence.persona
    || 'Adults interested in premium grooming products'
  ).trim();
  const budgetSuggestion = {
    daily_budget: Number(input.daily_budget || 45),
    currency: String(input.currency || 'EUR').trim(),
    rationale: `Starter budget based on ${products.length} product(s) in campaign package.`
  };

  return {
    ad_copy: adCopy,
    headline,
    cta,
    audience,
    budget_suggestion: budgetSuggestion
  };
}

function getExecutionPaths(projectName) {
  const safeProject = String(projectName || '').trim().toLowerCase();
  const resolution = unifiedDataPathResolver.resolve(safeProject, {
    domain: 'execution-config',
    operation: 'read'
  });
  const baseDir = resolveExecutionReadCandidate({
    projectName: safeProject,
    domain: 'execution-config',
    relativePath: '',
    pathType: 'directory',
    requestedIdentifier: 'execution-root',
    requestedFile: 'execution'
  }).selectedPath;
  const legacyBaseDir = path.join(resolution.legacyRoot, 'execution');

  const configDir = path.join(baseDir, 'config');
  const resultsDir = path.join(baseDir, 'results');
  const legacyConfigDir = path.join(legacyBaseDir, 'config');
  const legacyResultsDir = path.join(legacyBaseDir, 'results');

  ensureDir(baseDir);
  ensureDir(configDir);
  ensureDir(resultsDir);
  ensureDir(legacyBaseDir);
  ensureDir(legacyConfigDir);
  ensureDir(legacyResultsDir);

  return {
    baseDir,
    configDir,
    resultsDir,
    legacyBaseDir,
    legacyConfigDir,
    legacyResultsDir
  };
}

function setExecutionMode(projectName, mode) {
  const normalizedMode = String(mode || '').toLowerCase();

  if (!['semi_auto', 'full_auto'].includes(normalizedMode)) {
    throw new Error('Execution mode must be semi_auto or full_auto');
  }

  const paths = getExecutionPaths(projectName);
  const filePath = path.join(paths.legacyConfigDir, 'mode.json');

  const data = {
    project: projectName,
    mode: normalizedMode,
    updated_at: new Date().toISOString()
  };

  executionArtifactWriter.writeJson({
    project: projectName,
    domain: 'execution-config',
    artifactType: 'execution_mode',
    identifier: 'mode',
    legacyPath: filePath,
    data
  });

  return {
    ...data,
    file_path: filePath
  };
}

function readExecutionMode(projectName) {
  const paths = getExecutionPaths(projectName);
  const filePath = path.join(paths.configDir, 'mode.json');

  if (!fs.existsSync(filePath)) {
    return {
      project: projectName,
      mode: 'semi_auto',
      defaulted: true
    };
  }

  return {
    ...readJsonFile(filePath, {}),
    file_path: filePath
  };
}

function getScheduledJobById(projectName, jobId) {
  const filePath = resolveExecutionReadCandidate({
    projectName,
    domain: 'publishing',
    relativePath: path.join('scheduler', `${jobId}.json`),
    pathType: 'file',
    requestedIdentifier: jobId,
    requestedFile: `publishing/scheduler/${jobId}.json`
  }).selectedPath;

  if (!fs.existsSync(filePath)) {
    throw new Error('Scheduled job not found');
  }

  return {
    ...readJsonFile(filePath, {}),
    file_path: filePath
  };
}

function executeScheduledJob(projectName, jobId) {
  const mode = readExecutionMode(projectName);
  const normalizedMode = String(mode?.mode || 'semi_auto').trim().toLowerCase();

  if (normalizedMode !== 'semi_auto') {
    assertPublishingMutationAllowed(projectName, 'publish', {
      jobId,
      status: 'published'
    });
  }

  const job = getScheduledJobById(projectName, jobId);
  const execPaths = getExecutionPaths(projectName);

  const result = {
    execution_id: `exec_${Date.now()}`,
    project: projectName,
    job_id: jobId,
    campaign_name: job.campaign_name || null,
    wave_name: job.wave_name,
    channel: job.channel,
    mode: mode.mode,
    executed_at: new Date().toISOString(),
    source_status: job.status,
    execution_status: 'pending',
    action_type: null,
    external_publish: normalizedMode !== 'semi_auto',
    notes: []
  };

  if (mode.mode === 'semi_auto') {
    if (job.channel === 'email') {
      result.execution_status = 'ready_for_manual_send';
      result.action_type = 'manual_send';
      result.notes.push('Email package is ready for operator-controlled sending.');
    } else if (['instagram', 'facebook', 'tiktok', 'youtube'].includes(job.channel)) {
      result.execution_status = 'ready_for_manual_publish';
      result.action_type = 'manual_publish';
      result.notes.push('Social payload is ready for operator-controlled publishing.');
    } else if (['amazon', 'ebay'].includes(job.channel)) {
      result.execution_status = 'ready_for_manual_handoff';
      result.action_type = 'manual_marketplace_handoff';
      result.notes.push('Marketplace payload is ready for manual listing handoff.');
    } else {
      result.execution_status = 'ready_for_manual_review';
      result.action_type = 'manual_review';
      result.notes.push('Unknown channel type. Manual review required.');
    }
  } else {
    if (job.channel === 'email') {
      result.execution_status = 'auto_send_pending';
      result.action_type = 'auto_send';
      result.notes.push('Full-auto mode enabled. Email send bridge should consume this.');
    } else if (['instagram', 'facebook', 'tiktok', 'youtube'].includes(job.channel)) {
      result.execution_status = 'auto_publish_pending';
      result.action_type = 'auto_publish';
      result.notes.push('Full-auto mode enabled. Social publish adapter should consume this.');
    } else if (['amazon', 'ebay'].includes(job.channel)) {
      result.execution_status = 'auto_marketplace_pending';
      result.action_type = 'auto_marketplace';
      result.notes.push('Full-auto mode enabled. Marketplace adapter should consume this.');
    } else {
      result.execution_status = 'auto_review_pending';
      result.action_type = 'auto_review';
      result.notes.push('Unknown channel type. Review connector mapping.');
    }
  }

  const filePath = path.join(execPaths.legacyResultsDir, `${jobId}.json`);
  executionArtifactWriter.writeJson({
    project: projectName,
    domain: 'execution-results',
    artifactType: 'publishing_execution_result',
    identifier: jobId,
    legacyPath: filePath,
    data: result
  });

  return {
    ...result,
    file_path: filePath
  };
}

function pickFirstExistingPath(candidates = []) {
  for (const candidate of candidates) {
    if (candidate && fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return '';
}

function recordManualPublish(projectName, campaignName, channel, jobId, operator, postUrl, notes = '') {
  const safeProject = String(projectName || '').trim().toLowerCase();
  const safeCampaign = String(campaignName || '').trim();
  const safeChannel = String(channel || '').trim().toLowerCase();
  const safeJobId = String(jobId || '').trim();
  const safeOperator = String(operator || '').trim();
  const safePostUrl = String(postUrl || '').trim();
  const safeNotes = String(notes || '').trim();

  if (!safeProject) {
    const error = new Error('Missing project');
    error.statusCode = 400;
    throw error;
  }
  if (!safeCampaign) {
    const error = new Error('Missing campaign');
    error.statusCode = 400;
    throw error;
  }
  if (!safeChannel) {
    const error = new Error('Missing channel');
    error.statusCode = 400;
    throw error;
  }
  if (!safeJobId) {
    const error = new Error('Missing job_id');
    error.statusCode = 400;
    throw error;
  }
  if (!safeOperator) {
    const error = new Error('Missing operator');
    error.statusCode = 400;
    throw error;
  }
  if (!safePostUrl) {
    const error = new Error('Missing post_url');
    error.statusCode = 400;
    throw error;
  }

  const projectPaths = getProjectBasePaths(safeProject);
  if (!fs.existsSync(projectPaths.projectFilePath)) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }

  const mode = readExecutionMode(safeProject);
  if (String(mode?.mode || '').trim().toLowerCase() !== 'semi_auto') {
    const error = new Error('Manual publish recording is allowed only in semi_auto mode.');
    error.statusCode = 409;
    throw error;
  }

  const campaignSafe = safeCampaign.replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
  const executionCampaignPackagePath = path.join(DATA_DIR, 'execution', 'projects', safeProject, 'campaign-execution', 'packages', `${campaignSafe}.json`);
  const projectCampaignPackagePath = path.join(DATA_DIR, 'projects', safeProject, 'brand-assets', 'campaign-execution', 'packages', `${campaignSafe}.json`);
  const legacyCampaignPackagePath = path.join(LEGACY_BRAND_ASSETS_DIR, safeProject, 'campaign-execution', 'packages', `${campaignSafe}.json`);

  const campaignPackagePath = pickFirstExistingPath([
    executionCampaignPackagePath,
    projectCampaignPackagePath,
    legacyCampaignPackagePath
  ]);

  if (!campaignPackagePath) {
    const error = new Error('Campaign package not found for this project/campaign.');
    error.statusCode = 404;
    throw error;
  }

  const nowIso = new Date().toISOString();
  const timestampSafe = nowIso.replace(/[:.]/g, '-');
  const manualPublishDir = path.join(projectPaths.executionDir, 'manual-publish');
  ensureDir(manualPublishDir);

  const record = {
    project: safeProject,
    campaign: safeCampaign,
    channel: safeChannel,
    job_id: safeJobId,
    operator: safeOperator,
    published_at: nowIso,
    post_url: safePostUrl,
    notes: safeNotes,
    external_publish: false,
    manual_publish: true,
    recorded_at: nowIso
  };

  const recordFilePath = path.join(
    manualPublishDir,
    `${campaignSafe}_${safeChannel}_${timestampSafe}.json`
  );
  writeJsonFile(recordFilePath, record);

  const touchedFiles = [recordFilePath];
  const warnings = [];

  const executionResultPath = resolveExecutionReadCandidate({
    projectName: safeProject,
    domain: 'execution-results',
    relativePath: `${safeJobId}.json`,
    pathType: 'file',
    requestedIdentifier: safeJobId,
    requestedFile: `execution-results/${safeJobId}.json`
  }).selectedPath;

  if (fs.existsSync(executionResultPath)) {
    const existingResult = readJsonFile(executionResultPath, {});
    const updatedResult = {
      ...existingResult,
      manual_publish_recorded: true,
      manual_publish_url: safePostUrl,
      manual_publish_operator: safeOperator,
      manual_publish_recorded_at: nowIso,
      final_status: 'manually_published',
      manual_publish: true,
      external_publish: false,
      campaign_name: existingResult.campaign_name || safeCampaign,
      channel: String(existingResult.channel || safeChannel).trim().toLowerCase(),
      notes: Array.from(new Set([
        ...normalizePublishingNotes(existingResult.notes),
        ...normalizePublishingNotes(safeNotes)
      ]))
    };

    const execPaths = getExecutionPaths(safeProject);
    const legacyExecutionResultPath = path.join(execPaths.legacyResultsDir, `${safeJobId}.json`);

    executionArtifactWriter.writeJson({
      project: safeProject,
      domain: 'execution-results',
      artifactType: 'publishing_execution_result',
      identifier: safeJobId,
      legacyPath: legacyExecutionResultPath,
      data: updatedResult
    });

    touchedFiles.push(execPaths.resultsDir ? path.join(execPaths.resultsDir, `${safeJobId}.json`) : executionResultPath);
    touchedFiles.push(legacyExecutionResultPath);
  } else {
    warnings.push('Execution result file not found for job_id. Manual publish record saved without execution-result update.');
  }

  return {
    project: safeProject,
    campaign: safeCampaign,
    channel: safeChannel,
    job_id: safeJobId,
    manual_publish_recorded: true,
    external_publish: false,
    manual_publish: true,
    recorded_at: nowIso,
    file_path: recordFilePath,
    touched_files: Array.from(new Set(touchedFiles)),
    warnings,
    campaign_package_path: campaignPackagePath
  };
}

function recordPublishingExecutionOutcome(projectName, jobId, options = {}) {
  const safeProject = String(projectName || '').trim().toLowerCase();
  const job = hydrateScheduledJobRecord(safeProject, getScheduledJobById(safeProject, jobId));
  const execPaths = getExecutionPaths(safeProject);
  const filePath = path.join(execPaths.legacyResultsDir, `${jobId}.json`);
  const existing = fs.existsSync(filePath) ? readJsonFile(filePath, {}) : {};
  const now = new Date().toISOString();

  const result = {
    execution_id: existing.execution_id || `exec_${Date.now()}`,
    project: safeProject,
    job_id: jobId,
    title: job.title,
    wave_name: job.wave_name,
    channel: job.channel,
    mode: String(options.mode || job.mode || readExecutionMode(safeProject).mode || 'semi_auto').trim(),
    executed_at: now,
    source_status: job.status,
    execution_status: String(options.execution_status || existing.execution_status || job.status || 'pending').trim(),
    action_type: String(options.action_type || existing.action_type || 'manual_update').trim(),
    notes: normalizePublishingNotes(options.notes !== undefined ? options.notes : existing.notes),
    preview: job.preview || job.connector_preview || null
  };

  executionArtifactWriter.writeJson({
    project: safeProject,
    domain: 'execution-results',
    artifactType: 'publishing_execution_result',
    identifier: jobId,
    legacyPath: filePath,
    data: result
  });

  return {
    ...result,
    file_path: filePath
  };
}

function buildPublishingGovernanceError(message, details = {}) {
  const error = new Error(message);
  error.statusCode = 409;
  error.details = details;
  return error;
}

function getLatestPublishingApproval(projectName, jobId) {
  return listApprovals(projectName, { limit: 500 })
    .filter((item) =>
      String(item?.entity_type || '').trim() === 'publishing_job'
      && String(item?.entity_id || '').trim() === String(jobId || '').trim()
    )
    .sort((a, b) => {
      const aTime = new Date(a?.updated_at || a?.created_at || 0).getTime();
      const bTime = new Date(b?.updated_at || b?.created_at || 0).getTime();
      return bTime - aTime;
    })[0] || null;
}

function assertPublishingMutationAllowed(projectName, action, options = {}) {
  const governance = getGovernancePolicy(projectName);
  // getGovernancePolicy always returns a normalized policy with policy_rules merged
  // from DEFAULT_POLICY_RULES, so policy_rules is always a fully-populated object.
  // We still guard defensively here in case of unexpected call paths.
  const policyRules = governance && typeof governance === 'object' && governance.policy_rules && typeof governance.policy_rules === 'object'
    ? governance.policy_rules
    : {};
  const jobId = String(options.jobId || '').trim();
  const requestedStatus = normalizePublishingJobStatus(options.status, '');
  const actionKey = String(action || '').trim().toLowerCase();
  const freezeSensitiveAction = ['schedule', 'reschedule', 'ready', 'publish'].includes(actionKey)
    || ['ready', 'published'].includes(requestedStatus);
  const approvalSensitiveAction = ['ready', 'publish'].includes(actionKey)
    || ['ready', 'published'].includes(requestedStatus);

  // Use explicit boolean coercion with safe defaults matching DEFAULT_POLICY_RULES:
  //   freeze_publishing  → default false (permissive — freeze is opt-in)
  //   approval_before_publish → default true (restrictive — approval is required by default)
  const freezePublishing = typeof policyRules.freeze_publishing === 'boolean'
    ? policyRules.freeze_publishing
    : policyRules.freeze_publishing == null ? false : Boolean(policyRules.freeze_publishing);
  const approvalBeforePublish = typeof policyRules.approval_before_publish === 'boolean'
    ? policyRules.approval_before_publish
    : policyRules.approval_before_publish == null ? true : Boolean(policyRules.approval_before_publish);

  function logGovernanceBlock(rule, extra = {}) {
    appLogger.warn('governance_blocked', {
      route: '/governance/publishing',
      action: actionKey || 'unknown',
      project: projectName,
      status: requestedStatus || null,
      rule,
      ...sanitizeValue(extra)
    });
  }

  if (freezeSensitiveAction && freezePublishing) {
    logGovernanceBlock('freeze_publishing');
    throw buildPublishingGovernanceError(
      'Publishing is frozen by governance policy. The requested publishing mutation was blocked.',
      {
        action: actionKey,
        rule: 'freeze_publishing'
      }
    );
  }

  if (approvalSensitiveAction && approvalBeforePublish) {
    if (!jobId) {
      logGovernanceBlock('approval_before_publish', { reason: 'job_id_missing' });
      throw buildPublishingGovernanceError(
        'Approval before publish is enabled. This publishing action requires a durable publishing job with an approved governance decision.',
        {
          action: actionKey,
          rule: 'approval_before_publish'
        }
      );
    }

    const approval = getLatestPublishingApproval(projectName, jobId);
    const approvalStatus = String(approval?.status || '').trim().toLowerCase();

    if (!['approved', 'overridden'].includes(approvalStatus)) {
      logGovernanceBlock('approval_before_publish', {
        job_id: jobId,
        approval_status: approvalStatus || 'missing'
      });
      throw buildPublishingGovernanceError(
        'Approval before publish is enabled. The publishing job is not approved for ready/publish mutation.',
        {
          action: actionKey,
          rule: 'approval_before_publish',
          job_id: jobId,
          approval_status: approvalStatus || 'missing'
        }
      );
    }
  }
}

function hydratePublishingExecutionResult(projectName, result, scheduledJobs = []) {
  const rawResult = result && typeof result === 'object' ? { ...result } : {};
  const relatedJob =
    scheduledJobs.find(item => item.job_id === rawResult.job_id) ||
    (() => {
      try {
        return hydrateScheduledJobRecord(projectName, getScheduledJobById(projectName, rawResult.job_id));
      } catch (error) {
        return null;
      }
    })();
  const normalizedChannel = String(rawResult.channel || relatedJob?.channel || '').trim().toLowerCase();

  return {
    ...rawResult,
    title: rawResult.title || relatedJob?.title || buildPublishingDisplayTitle('', rawResult.wave_name, normalizedChannel),
    channel: normalizedChannel,
    status: normalizePublishingJobStatus(
      rawResult.execution_status,
      relatedJob?.status || 'draft'
    ),
    scheduled_for: relatedJob?.scheduled_for || '',
    total_assets: Number(rawResult.total_assets || relatedJob?.total_assets || relatedJob?.preview?.asset_count || 0) || 0,
    offer: String(rawResult.offer || relatedJob?.offer || '').trim(),
    notes: Array.from(
      new Set([
        ...normalizePublishingNotes(relatedJob?.notes),
        ...normalizePublishingNotes(rawResult.notes)
      ])
    ),
    preview:
      (rawResult.preview && typeof rawResult.preview === 'object' ? rawResult.preview : null) ||
      relatedJob?.preview ||
      relatedJob?.connector_preview ||
      null
  };
}

function reviewExecutionResult(projectName, jobId) {
  const filePath = resolveExecutionReadCandidate({
    projectName,
    domain: 'execution-results',
    relativePath: `${jobId}.json`,
    pathType: 'file',
    requestedIdentifier: jobId,
    requestedFile: `execution-results/${jobId}.json`
  }).selectedPath;

  if (!fs.existsSync(filePath)) {
    throw new Error('Execution result not found');
  }

  return {
    ...readJsonFile(filePath, {}),
    file_path: filePath
  };
}

function listExecutionResults(projectName) {
  const resultsDir = resolveExecutionReadCandidate({
    projectName,
    domain: 'execution-results',
    relativePath: '',
    pathType: 'directory',
    matcher: /\.json$/i,
    requestedIdentifier: 'execution-results-list',
    requestedFile: 'execution-results/*.json'
  }).selectedPath;

  const files = fs.readdirSync(resultsDir)
    .filter(name => name.endsWith('.json'))
    .sort();

  return files.map(name => {
    const filePath = path.join(resultsDir, name);
    return readJsonFile(filePath, {});
  });
}
function reviewProjectAlignmentStatus(projectName) {
  const routes = reviewProjectAssetRoutes(projectName);
  const total = routes.total_assets || 0;
  const routed = (routes.routed_assets || []).filter(x => x.in_expected_folder).length;
  const legacy = total - routed;

  let status = 'not_aligned';
  if (total > 0 && routed === total) {
    status = 'fully_aligned';
  } else if (routed > 0) {
    status = 'partially_aligned';
  }

  return {
    project: projectName,
    reviewed_at: new Date().toISOString(),
    total_assets: total,
    routed_assets: routed,
    legacy_assets: legacy,
    status
  };
}

function reviewProjectMissingPriorities(projectName) {
  const missingAssets = reviewProjectMissingAssets(projectName);
  const connectorReadiness = reviewProjectConnectorReadiness(projectName);

  const critical = [];
  const important = [];
  const optional = [];

  const assetMissing = missingAssets.blockers || missingAssets.missing || [];
  const connectorMissing = connectorReadiness.missing || [];
  const requiredAssetTypes = new Set(getAssetTypeCatalog().filter(item => item.required).map(item => item.asset_type));

  for (const item of assetMissing) {
    if (requiredAssetTypes.has(item)) {
      critical.push(item);
    } else {
      important.push(item);
    }
  }

  for (const item of connectorMissing) {
    if (['website', 'ecommerce', 'instagram', 'facebook'].includes(item)) {
      critical.push(`connector:${item}`);
    } else if (['tiktok', 'youtube', 'email'].includes(item)) {
      important.push(`connector:${item}`);
    } else {
      optional.push(`connector:${item}`);
    }
  }

  return {
    project: projectName,
    reviewed_at: new Date().toISOString(),
    critical: [...new Set(critical)],
    important: [...new Set(important)],
    optional: [...new Set(optional)],
    status: critical.length ? 'critical_gaps_found' : important.length ? 'important_gaps_found' : 'healthy'
  };
}

function reviewProjectDashboard(projectName) {
  const project = reviewProject(projectName);
  const readiness = reviewProjectReadiness(projectName);
  const missingAssets = reviewProjectMissingAssets(projectName);
  const connectorReadiness = reviewProjectConnectorReadiness(projectName);
  const alignment = reviewProjectAlignmentStatus(projectName);
  const folderHealth = reviewProjectFolderHealth(projectName);
  const priorities = reviewProjectMissingPriorities(projectName);

  const scores = [
    readiness.readiness_score || 0,
    connectorReadiness.readiness_score || 0
  ];

  const overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

  let overallStatus = 'needs_work';
  if (overallScore >= 85 && priorities.critical.length === 0) {
    overallStatus = 'strong';
  } else if (overallScore >= 65) {
    overallStatus = 'progressing';
  }

  return {
    project: projectName,
    reviewed_at: new Date().toISOString(),
    project_info: {
      project_name: project.project_name,
      market: project.market,
      language: project.language,
      project_type: project.project_type,
      website_url: project.website_url,
      execution_mode: project.execution_mode,
      status: project.status
    },
    readiness_score: overallScore,
    readiness_status: overallStatus,
    sections: {
      base_readiness: readiness,
      assets: missingAssets,
      connectors: connectorReadiness,
      alignment,
      folder_health: folderHealth
    },
    priorities,
    operator_notes: Array.isArray(project.operator_notes) ? project.operator_notes : [],
    next_best_actions: [
      ...(priorities.critical || []).slice(0, 5),
      ...(priorities.important || []).slice(0, 3)
    ]
  };
}
function buildProjectControlCenterOverview(projectName) {
  const project = reviewProject(projectName);
  const dashboard = reviewProjectDashboard(projectName);
  const assets = listProjectAssets(projectName);
  const sources = reviewProjectSources(projectName);
  const connectorReadiness = reviewProjectConnectorReadiness(projectName);
  const alignment = reviewProjectAlignmentStatus(projectName);

  return {
    project: projectName,
    generated_at: new Date().toISOString(),
    overview: {
      project_name: project.project_name,
      market: project.market,
      language: project.language,
      project_type: project.project_type,
      website_url: project.website_url,
      execution_mode: project.execution_mode,
      status: project.status,
      project_status: project.status,
      brand_name: project.brand_name,
      brand_promise: project.brand_promise,
      brand_voice: project.brand_voice,
      visual_identity: project.visual_identity,
      offer_positioning: project.offer_positioning,
      currency: project.currency,
      primary_goal: project.primary_goal,
      goal: project.primary_goal,
      secondary_goal: project.secondary_goal,
      launch_window: project.launch_window,
      audience_primary: project.audience_primary,
      target_audience: project.audience_primary,
      audience_problem: project.audience_problem,
      customer_problem: project.audience_problem,
      audience_geography: project.audience_geography,
      competitors: Array.isArray(project.competitors) ? project.competitors : [],
      differentiation: project.differentiation,
      social_channels: Array.isArray(project.social_channels) ? project.social_channels : [],
      channels: Array.isArray(project.social_channels) ? project.social_channels : [],
      social_links: Array.isArray(project.social_channels) ? project.social_channels : [],
      setup_payload: project.setup_payload && typeof project.setup_payload === 'object' ? project.setup_payload : {},
      operator_notes: Array.isArray(project.operator_notes) ? project.operator_notes : [],
      brand_positioning: project.brand_promise,
      value_prop: project.brand_promise,
      positioning: project.offer_positioning || project.differentiation,
      readiness_score: dashboard.readiness_score,
      readiness_status: dashboard.readiness_status,
      alignment_status: alignment.status,
      total_assets: assets.length,
      connected_sources: Object.keys(sources.sources || {}).length,
      connector_readiness_score: connectorReadiness.readiness_score
    },
    next_best_actions: dashboard.next_best_actions || []
  };
}
function listFilesRecursiveSafe(dir, predicate = () => true) {
  if (!fs.existsSync(dir)) return [];

  const results = [];
  const stack = [dir];

  while (stack.length) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });

    entries.forEach(entry => {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.isFile() && predicate(fullPath)) {
        results.push(fullPath);
      }
    });
  }

  return results.sort();
}

function buildProjectProductMediaSummary(projectName) {
  const brandRoot = path.join(DATA_DIR, 'projects', projectName, 'brand-assets');
  const productsRoot = path.join(brandRoot, 'products');
  const imagesRoot = path.join(productsRoot, 'images');
  const videosRoot = path.join(productsRoot, 'videos');
  const csvRoot = path.join(brandRoot, 'product_csv');

  const images = listFilesRecursiveSafe(imagesRoot, file => /front\.png$/i.test(file));
  const videos = listFilesRecursiveSafe(videosRoot, file => /\.(mp4|mov)$/i.test(file));
  const csv_files = listFilesRecursiveSafe(csvRoot, file => /\.csv$/i.test(file));

  return {
    products_root: productsRoot,
    images_root: imagesRoot,
    videos_root: videosRoot,
    csv_root: csvRoot,
    images: images.map(file_path => ({
      file_path,
      file_name: path.basename(file_path),
      product_slug: path.basename(path.dirname(file_path))
    })),
    videos: videos.map(file_path => ({
      file_path,
      file_name: path.basename(file_path),
      product_slug: path.basename(path.dirname(file_path))
    })),
    csv_files: csv_files.map(file_path => ({
      file_path,
      file_name: path.basename(file_path)
    })),
    counts: {
      images: images.length,
      videos: videos.length,
      csv_files: csv_files.length
    }
  };
}

function buildProjectControlCenterAssets(projectName) {
  const safeProjectName = normalizeProjectSlug(projectName);
  let assets = listProjectAssets(projectName);

  if (!Array.isArray(assets) || assets.length === 0) {
    try {
      const registryPath = path.join(DATA_DIR, "projects", safeProjectName, "assets-registry.json");
      const parsed = JSON.parse(fs.readFileSync(registryPath, "utf8"));

      if (Array.isArray(parsed)) {
        assets = parsed;
      } else if (Array.isArray(parsed?.assets)) {
        assets = parsed.assets;
      } else if (Array.isArray(parsed?.items)) {
        assets = parsed.items;
      } else if (Array.isArray(parsed?.records)) {
        assets = parsed.records;
      } else {
        assets = [];
      }
    } catch (_) {
      assets = [];
    }
  }

  const routes = reviewProjectAssetRoutes(projectName);
  const missingAssets = reviewProjectMissingAssets(projectName);
  const folderHealth = reviewProjectFolderHealth(projectName);
  const categoryReadiness = missingAssets.category_readiness || buildProjectAssetCategoryReadiness(projectName, assets);
  const productMedia = buildProjectProductMediaSummary(projectName);

  return {
    project: projectName,
    generated_at: new Date().toISOString(),
    assets,
    product_media: productMedia,
    asset_catalog: getAssetTypeCatalog(),
    category_readiness: categoryReadiness,
    approved_assets: categoryReadiness.categories
      .flatMap(category => category.approved_assets.map(assetId => ({
        asset_id: assetId,
        asset_type: category.asset_type,
        label: category.label
      }))),
    routes,
    missing_assets: missingAssets,
    folder_health: folderHealth
  };
}

function buildProjectControlCenterConnectors(projectName) {
  const sources = reviewProjectSources(projectName);
  const readiness = reviewProjectConnectorReadiness(projectName);
  const controlCenter = reviewProjectIntegrationControlCenter(projectName);

  return {
    project: projectName,
    generated_at: new Date().toISOString(),
    sources,
    readiness,
    control_center: controlCenter
  };
}

function buildProjectControlCenterReadiness(projectName) {
  const dashboard = reviewProjectDashboard(projectName);
  const priorities = reviewProjectMissingPriorities(projectName);
  const alignment = reviewProjectAlignmentStatus(projectName);

  return {
    project: projectName,
    generated_at: new Date().toISOString(),
    dashboard,
    priorities,
    alignment
  };
}

function getProjectInsightsEnginePayload(projectName) {
  const safeProject = normalizeProjectSlug(projectName);
  const controlCenter = reviewProjectIntegrationControlCenter(safeProject);
  return buildProjectInsightsPayload({
    projectName: safeProject,
    projectPaths: getProjectIntegrationPaths(safeProject),
    integrationControlCenter: controlCenter
  });
}

function getProjectLearningEnginePayload(projectName) {
  const safeProject = normalizeProjectSlug(projectName);
  const controlCenter = reviewProjectIntegrationControlCenter(safeProject);
  return buildProjectLearningPayload({
    projectName: safeProject,
    projectPaths: getProjectIntegrationPaths(safeProject),
    integrationControlCenter: controlCenter
  });
}

function buildProjectControlCenterActivity(projectName) {
  let scheduledJobs = [];
  let executionResults = [];
  let insights = null;

  try {
    scheduledJobs = reviewScheduledJobs(projectName);
  } catch (error) {
    scheduledJobs = [];
  }

  try {
    executionResults = listExecutionResults(projectName);
  } catch (error) {
    executionResults = [];
  }

  const hydratedScheduledJobs = scheduledJobs.map(item => hydrateScheduledJobRecord(projectName, item));
  const hydratedExecutionResults = executionResults.map(item =>
    hydratePublishingExecutionResult(projectName, item, hydratedScheduledJobs)
  );

  try {
    insights = getProjectInsightsEnginePayload(projectName);
  } catch (error) {
    insights = {
      project: projectName,
      generated_at: new Date().toISOString(),
      error: error.message || 'Failed to build project insights'
    };
  }

  const learning = insights && !insights.error
    ? {
        project: insights.project,
        generated_at: insights.generated_at,
        data_coverage: insights.data_coverage,
        learning_patterns: insights.learning_patterns,
        recommendations: insights.recommendations,
        system_lessons: insights.system_lessons,
        ai_recommendations: insights.ai_recommendations,
        source_summary: insights.source_summary
      }
    : {
        project: projectName,
        generated_at: new Date().toISOString(),
        error: insights?.error || 'Failed to build learning payload'
      };

  return {
    project: projectName,
    generated_at: new Date().toISOString(),
    scheduled_jobs: hydratedScheduledJobs,
    execution_results: hydratedExecutionResults,
    total_scheduled_jobs: hydratedScheduledJobs.length,
    total_execution_results: hydratedExecutionResults.length,
    insights,
    marketing_insights: insights,
    performance_insights: insights,
    learning,
    learning_patterns: learning.learning_patterns || {},
    recommendations: learning.recommendations || []
  };
}

function buildProjectOperationsPayload(projectName) {
  return buildOperationsSnapshot(projectName);
}

function getAiOrchestrator() {
  if (!aiOrchestrator) {
    aiOrchestrator = createAiOrchestrationService({
      buildDashboard: buildMediaManagerProjectPayload,
      buildInsights: getProjectInsightsEnginePayload,
      buildLearning: getProjectLearningEnginePayload,
      buildOperations: buildProjectOperationsPayload,
      logger: appLogger
    });
  }

  return aiOrchestrator;
}

function resolveLegacyExecutionProjectPaths(projectName) {
  const resolved = resolveProjectPath(path.join(EXECUTION_DIR, 'projects'), projectName);
  const projectDir = resolved.projectRoot;

  return {
    project: resolved.project,
    projectDir,
    profilePath: path.join(projectDir, 'project-profile.json'),
    campaignStrategyQueuePath: path.join(projectDir, 'campaign-strategy-queue.json'),
    campaignAssetPlanPath: path.join(projectDir, 'campaign-asset-plan.json')
  };
}













app.post('/telegram-command', async (req, res) => {
  try {
    const text = (req.body.text || '').trim();

    if (!text) {
      return sendError(res, {
        statusCode: 400,
        code: 'COMMAND_TEXT_MISSING',
        message: 'No command text provided'
      });
    }

    const parts = text.split(/\s+/);
    const command = parts[0];
    const rawArgs = parts.slice(1);
    const commandProject = resolveRequestProjectName(req, {
      explicitProject: extractProjectFlag(rawArgs),
      text
    });
    const args = stripProjectFlagArgs(rawArgs);
    const commandBrandName = commandProject ? getProjectDisplayName(commandProject) : 'Project';
    const commandHashtag = commandProject ? buildProjectHashtag(commandProject) : '#Project';

    if (command === '/products') {
      const response = await axios.get(`${process.env.WC_BASE_URL}/products`, {
        auth: {
          username: process.env.WC_KEY,
          password: process.env.WC_SECRET
        }
      });

      return res.json({
        command,
        result: response.data.slice(0, 10).map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          status: p.status,
          permalink: p.permalink
        }))
      });
    }

    if (command === '/optimize_product') {
      const productId = args[0];
      if (!productId) {
        return sendError(res, {
          statusCode: 400,
          code: 'COMMAND_ARG_MISSING',
          message: 'Missing product_id'
        });
      }

      const response = await axios.get(`http://localhost:${PORT}/optimize-product/${productId}`);
      return res.json({
        command,
        result: response.data
      });
    }

    if (command === '/prepare_product_update') {
      const productId = args[0];
      if (!productId) {
        return sendError(res, {
          statusCode: 400,
          code: 'COMMAND_ARG_MISSING',
          message: 'Missing product_id'
        });
      }

      const response = await axios.get(`http://localhost:${PORT}/prepare-product-update/${productId}`);
      return res.json({
        command,
        result: response.data
      });
    }

    if (command === '/clone_product') {
      const productId = args[0];
      if (!productId) {
        return sendError(res, {
          statusCode: 400,
          code: 'COMMAND_ARG_MISSING',
          message: 'Missing product_id'
        });
      }

      const response = await axios.post(`http://localhost:${PORT}/backup-and-clone-product/${productId}`);
      return res.json({
        command,
        result: response.data
      });
    }

    if (command === '/apply_to_clone') {
      const originalId = args[0];
      const cloneId = args[1];

      if (!originalId || !cloneId) {
        return sendError(res, {
          statusCode: 400,
          code: 'COMMAND_ARG_MISSING',
          message: 'Missing original_id or clone_id'
        });
      }

      const response = await axios.post(
        `http://localhost:${PORT}/apply-prepared-copy-to-clone/${originalId}/${cloneId}`
      );

      return res.json({
        command,
        result: response.data
      });
    }

       if (command === '/content_plan') {
      const taskBoardPath = getLegacyContentQueuePath(commandProject, 'tasks');

      const tasks = readJsonFile(taskBoardPath, []);
      const contentTasks = tasks.filter(
        t =>
          String(t.project || '').trim().toLowerCase() === commandProject &&
          ['content_plan', 'content', 'blog', 'email', 'ads'].includes(t.type)
      );

      return res.json({
        command,
        result: {
          project: commandProject,
          marketing_tasks: contentTasks
        }
      });
    }

        if (command === '/create_post') {
      const topic = args.join(' ') || `${commandBrandName} launch post`;

      const postDraft = {
        id: `post_${Date.now()}`,
        topic,
        platform: 'instagram',
        status: 'draft',
        caption: `Entdecke ${topic} mit ${commandBrandName}. Premium Positionierung für Kunden, die Wert auf Stil, Qualität und Wirkung legen.`,
        cta: 'Jetzt entdecken',
        hashtags: [
          commandHashtag,
          '#MensGrooming',
          '#PremiumCare',
          '#BarberStyle',
          '#MensStyle'
        ],
        hook_type: 'brand + premium',
        visual_format: 'feed post',
        aspect_ratio: '4:5',
        overlay_text: `${topic} | Premium Männerpflege`,
        creative_prompt:
          `Create a premium social media image for ${topic}, focused on masculine grooming, luxury styling, dark elegant brand mood, high-end product presentation, suitable for Instagram and Facebook feed.`,
        video_brief:
          `Short-form social video for ${topic}: start with a strong visual hook, show premium product or grooming moment, reinforce confidence and routine, finish with CTA Jetzt entdecken.`
      };

      const queuePath = getLegacyContentQueuePath(commandProject, 'social');

      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
      queue.push(postDraft);
      fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');

      return res.json({
        command,
        result: postDraft
      });
    }

         if (command === '/create_blog') {
      const topic = args.join(' ') || 'Männerpflege und Grooming';

      const blogDraft = {
        id: `blog_${Date.now()}`,
        topic,
        status: 'draft',
        title: `${topic} | ${commandBrandName} Blog`,
        excerpt:
          `${topic} – praktische Tipps, moderne Routinen und Premium Positionierung von ${commandBrandName}.`,
        seo_title: `${topic} | ${commandBrandName}`,
        meta_description:
          `${topic} – entdecke Tipps, Routinen und Premium Positionierung von ${commandBrandName} für einen klaren und starken Auftritt.`,
        target_keywords: [
          topic,
          'männerpflege deutschland',
          'grooming routine männer',
          'premium haarpflege männer'
        ],
        search_intent: 'informational + commercial',
        recommended_word_count: '900-1400',
        category_suggestion: 'Männerpflege',
        tag_suggestions: [
          topic,
          'Männerpflege',
          'Grooming',
          commandBrandName,
          'Deutschland'
        ],
        internal_link_suggestions: [
          'Link to a matching product page',
          'Link to grooming-related category page',
          'Link to homepage hero or featured collection'
        ],
        external_reference_suggestions: [
          'Use one high-authority grooming or dermatology reference if relevant',
          'Use one standards/reference source only when it improves trust'
        ],
        featured_image_prompt:
          `Create a premium masculine featured image for a German blog article about ${topic}. Clean grooming aesthetic, luxury male care branding, modern barbershop mood, natural contrast, elegant composition, suitable for a premium men’s grooming website.`,
        featured_image_alt:
          `${topic} – Premium Artikel von ${commandBrandName}`,
        outline: [
          'Einleitung',
          'Warum das Thema wichtig ist',
          'Die häufigsten Fehler',
          'Praktische Tipps',
          'Warum eine gute Routine wichtig ist',
          'Fazit mit CTA'
        ],
        body:
          `<h2>${topic}</h2>
<p>Ein gepflegter Look beginnt nicht bei Zufall, sondern bei der richtigen Routine. ${topic} ist für viele Männer in Deutschland mehr als nur ein Trend – es ist ein Teil eines starken, bewussten und gepflegten Auftritts.</p>

<h3>Warum dieses Thema wichtig ist</h3>
<p>Viele Kunden investieren in Stil und Auftreten, unterschätzen aber die Wirkung einer klaren Routine. Genau hier setzt ${commandBrandName} an: mit Premium Produkten und einer einfachen, wirksamen Struktur.</p>

<h3>Die häufigsten Fehler</h3>
<ul>
  <li>Die falschen Produkte für den eigenen Bedarf verwenden</li>
  <li>Keine klare Routine haben</li>
  <li>Zu viele Produkte ohne System nutzen</li>
  <li>Pflege und Styling nicht aufeinander abstimmen</li>
</ul>

<h3>Praktische Tipps</h3>
<ul>
  <li>Weniger Produkte, aber die richtigen</li>
  <li>Routine statt Zufall</li>
  <li>Qualität vor Überladung</li>
  <li>Produkte wählen, die Wirkung und Einfachheit verbinden</li>
</ul>

<h3>Warum eine gute Routine wichtig ist</h3>
<p>Eine starke Routine spart Zeit, reduziert Unsicherheit und verbessert sichtbar die Wirkung des gesamten Looks. Premium Männerpflege bedeutet nicht Komplexität – sondern Klarheit, Qualität und Konsequenz.</p>

<h3>Fazit</h3>
<p>${topic} ist nicht nur ein Produktthema, sondern Teil eines modernen, selbstbewussten und klaren Lebensstils. Mit ${commandBrandName} entsteht eine Routine, die zu Kunden passt, die Wert auf Qualität, Stil und Wirkung legen.</p>

<p><strong>CTA:</strong> Entdecke jetzt ${commandBrandName} und bringe deine Routine auf das nächste Level.</p>`
      };

      const queuePath = getLegacyContentQueuePath(commandProject, 'blog');

      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
      queue.push(blogDraft);
      fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');

      return res.json({
        command,
        result: blogDraft
      });
    }

   if (command === '/create_email') {
      const topic = args.join(' ') || `${commandBrandName} Launch`;

      const emailDraft = {
        id: `email_${Date.now()}`,
        topic,
        status: 'draft',
        format: 'campaign email',
        audience: 'general launch audience',
        send_goal: 'traffic + conversion',
        subject: `${topic} – Jetzt entdecken`,
        preheader: 'Premium Pflege, klare Routine, starker Auftritt.',
        body:
          `Entdecke ${topic} mit ${commandBrandName}. Premium Produkte für Kunden, die ihre Routine auf das nächste Level bringen wollen.`,
        cta: 'Jetzt entdecken'
      };

      const { data: queue } = readLiveEmailQueue(commandProject, emailDraft.id);
      queue.push(emailDraft);
      writeLiveEmailQueue(commandProject, queue);

      return res.json({
        command,
        result: emailDraft
      });
    }

    if (command === '/create_ads') {
      const topic = args.join(' ') || `${commandBrandName} Launch`;

      const adDraft = {
        status: 'draft',
        campaign_type: 'meta',
        headline: `${topic} – Premium Pflege für Männer`,
        primary_text:
          `Mit ${topic} von ${commandBrandName} setzt du auf Premium Qualität, klare Routine und einen starken Auftritt.`,
        cta: 'Jetzt entdecken'
      };

      const queuePath = getLegacyContentQueuePath(commandProject, 'ads');

      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
      queue.push(adDraft);
      fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');

      return res.json({
        command,
        result: adDraft
      });
    }

       if (command === '/review_ads') {
      const queuePath = getLegacyContentQueuePath(commandProject, 'ads');

      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));

      return res.json({
        command,
        result: queue
      });
    }

    if (command === '/review_posts') {
      const queuePath = getLegacyContentQueuePath(commandProject, 'social');

      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));

      return res.json({
        command,
        result: queue
      });
    }

    if (command === '/review_blog') {
      const queuePath = getLegacyContentQueuePath(commandProject, 'blog');

      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));

      return res.json({
        command,
        result: queue
      });
    }

    if (command === '/review_emails') {
      const { data: queue } = readLiveEmailQueue(commandProject, 'review-emails');

      return res.json({
        command,
        result: queue
      });
    }

    if (command === '/approve_ad') {
      const draftId = args[0];
      if (!draftId) {
        return res.json({ error: 'Missing ad draft id' });
      }

      const queuePath = getLegacyContentQueuePath(commandProject, 'ads');

      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
      const item = queue.find(x => x.id === draftId);

      if (!item) {
        return res.json({ error: 'Ad draft not found' });
      }

      item.status = 'approved';

      fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');

      return res.json({
        command,
        result: item
      });
    }

    if (command === '/approve_post') {
      const draftId = args[0];
      if (!draftId) {
        return res.json({ error: 'Missing post draft id' });
      }

      const queuePath = getLegacyContentQueuePath(commandProject, 'social');

      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
      const item = queue.find(x => x.id === draftId);

      if (!item) {
        return res.json({ error: 'Post draft not found' });
      }

      item.status = 'approved';

      fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');

      return res.json({
        command,
        result: item
      });
    }

    if (command === '/approve_blog') {
      const draftId = args[0];
      if (!draftId) {
        return res.json({ error: 'Missing blog draft id' });
      }

      const queuePath = getLegacyContentQueuePath(commandProject, 'blog');

      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
      const item = queue.find(x => x.id === draftId);

      if (!item) {
        return res.json({ error: 'Blog draft not found' });
      }

      item.status = 'approved';

      fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');

      return res.json({
        command,
        result: item
      });
    }

    if (command === '/approve_email') {
      const draftId = args[0];
      if (!draftId) {
        return res.json({ error: 'Missing email draft id' });
      }

      const { data: queue } = readLiveEmailQueue(commandProject, draftId);
      const item = queue.find(x => x.id === draftId);

      if (!item) {
        return res.json({ error: 'Email draft not found' });
      }

      item.status = 'approved';

      writeLiveEmailQueue(commandProject, queue);

      return res.json({
        command,
        result: item
      });
    }

    if (command === '/improve_ad') {
      const draftId = args[0];
      if (!draftId) {
        return res.json({ error: 'Missing ad draft id' });
      }

      const queuePath = getLegacyContentQueuePath(commandProject, 'ads');

      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
      const item = queue.find(x => x.id === draftId);

      if (!item) {
        return res.json({ error: 'Ad draft not found' });
      }

      item.status = 'improved';
      item.headline = `Jetzt entdecken: ${item.topic} – Premium Angebot von ${commandBrandName}`;
      item.primary_text =
        `Für Kunden, die Wert auf Qualität, Wirkung und eine klare Routine legen: ${item.topic} von ${commandBrandName} verbindet Premium Positionierung mit einem klaren Auftritt.`;
      item.hooks = [
        'Dein Look beginnt mit deiner Routine',
        'Premium Männerpflege ohne Kompromisse',
        'Weniger Chaos. Mehr Wirkung.',
        'Bereit für einen stärkeren Auftritt?'
      ];
      item.creative_angles = [
        'product close-up',
        'before/after grooming',
        'premium masculine lifestyle',
        'barbershop authority'
      ];

      fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');

      return res.json({
        command,
        result: item
      });
    }

    if (command === '/improve_post') {
      const draftId = args[0];
      if (!draftId) {
        return res.json({ error: 'Missing post draft id' });
      }

      const queuePath = getLegacyContentQueuePath(commandProject, 'social');

      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
      const item = queue.find(x => x.id === draftId);

      if (!item) {
        return res.json({ error: 'Post draft not found' });
      }

      item.status = 'improved';
      item.caption =
        `Ein stärkerer Auftritt beginnt mit der richtigen Routine. ${item.topic} mit ${commandBrandName} steht für Premium Positionierung, klare Wirkung und einen hochwertigen Eindruck.`;
      item.hooks = [
        'Dein Look wirkt nie zufällig',
        'Premium Pflege für Männer mit Anspruch',
        'Mehr Stil beginnt bei der Routine'
      ];
      item.content_style = 'short-form, premium, Germany-market focused';
      item.hook_type = 'premium + transformation';
      item.visual_format = 'feed post / reel support';
      item.aspect_ratio = '4:5 or 9:16';
      item.overlay_text = `${commandBrandName} | ${item.topic}`;
      item.creative_prompt =
        `Create a premium social creative for ${item.topic}, suitable for Instagram and Facebook, masculine luxury grooming aesthetic, clean composition, strong product focus, elegant contrast, Germany-market premium brand feel.`;
      item.video_brief =
        `Create a short-form reel for ${item.topic}: start with a hook in the first 2 seconds, show the grooming transformation or product moment, reinforce premium positioning, end with CTA Jetzt entdecken.`;
      fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');

      return res.json({
        command,
        result: item
      });
    }

    if (command === '/improve_blog') {
      const draftId = args[0];
      if (!draftId) {
        return res.json({ error: 'Missing blog draft id' });
      }

      const queuePath = getLegacyContentQueuePath(commandProject, 'blog');

      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
      const item = queue.find(x => x.id === draftId);

      if (!item) {
        return res.json({ error: 'Blog draft not found' });
      }

            item.status = 'improved';
      item.seo_title = `${item.topic} | ${commandBrandName}`;
      item.meta_description =
        `${item.topic} – Tipps, Routine und Premium Positionierung von ${commandBrandName} für einen klaren und starken Auftritt.`;
      item.target_keywords = [
        item.topic,
        'männerpflege deutschland',
        'grooming routine männer',
        'premium haarpflege männer'
      ];
      item.search_intent = 'informational + commercial';
      item.recommended_word_count = '1000-1500';
      item.category_suggestion = 'Männerpflege';
      item.tag_suggestions = [
        item.topic,
        'Männerpflege',
        'Grooming Tipps',
        commandBrandName,
        'Premium Pflege'
      ];
      item.internal_link_suggestions = [
        'Link to matching beard or grooming product page',
        'Link to related blog article',
        'Link to homepage featured collection'
      ];
      item.external_reference_suggestions = [
        'Add one high-authority source only if it supports trust and relevance'
      ];
      item.featured_image_prompt =
        `Create a premium editorial blog image for ${item.topic}, focused on modern German men’s grooming, refined masculine styling, clean grooming tools, premium hair and beard care aesthetic, suitable as a featured image for a luxury grooming brand.`;
      item.featured_image_alt =
        `${item.topic} – Premium Artikel von ${commandBrandName}`;

      item.excerpt =
        `${item.topic} – Premium Tipps, klare Routine und hochwertige Männerpflege für Deutschland.`;

      item.body =
        `<h2>${item.topic}</h2>
<p>Wer in Deutschland auf einen gepflegten, starken und modernen Auftritt setzt, kommt an einer klaren Routine nicht vorbei. ${item.topic} ist ein zentrales Thema für Männer, die ihre Pflege ernst nehmen und gleichzeitig Wert auf Einfachheit legen.</p>

<h3>Warum ${item.topic} heute wichtig ist</h3>
<p>Pflege ist längst kein Nebenthema mehr. Sie ist Teil von Stil, Ausstrahlung und Selbstbewusstsein. Männer, die bewusst auftreten wollen, brauchen eine Routine, die funktioniert – ohne unnötige Komplexität.</p>

<h3>Die größten Fehler vieler Männer</h3>
<ul>
  <li>Unpassende Produkte wählen</li>
  <li>Ohne feste Routine pflegen</li>
  <li>Zu viel ausprobieren statt ein klares System aufzubauen</li>
  <li>Qualität und Wirkung nicht konsequent priorisieren</li>
</ul>

<h3>Die bessere Lösung</h3>
<p>Mit einer klaren Struktur, hochwertigen Produkten und einem Fokus auf echte Wirkung wird die Routine einfacher, effizienter und sichtbarer. Genau dafür steht ${commandBrandName}.</p>

<h3>Praktische Empfehlungen</h3>
<ul>
  <li>Eine konsistente Routine aufbauen</li>
  <li>Produkte nach Wirkung und Qualität auswählen</li>
  <li>Pflege und Styling als Teil des Gesamtlooks verstehen</li>
  <li>Auf Einfachheit und Beständigkeit setzen</li>
</ul>

<h3>Warum ${commandBrandName} dazu passt</h3>
<p>${commandBrandName} verbindet Premium Positionierung mit einer modernen, klaren und wirksamen Routine. Für Kunden, die nicht einfach nur Produkte wollen, sondern einen stärkeren Auftritt.</p>

<h3>Fazit</h3>
<p>${item.topic} ist ein Thema für Männer, die mehr aus ihrer Routine machen wollen. Mit der richtigen Struktur, hochwertigen Produkten und einem klaren Anspruch entsteht ein Look, der bewusst, gepflegt und stark wirkt.</p>

<p><strong>CTA:</strong> Entdecke jetzt ${commandBrandName} und entwickle eine Routine, die wirklich zu dir passt.</p>`;

      fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');

      return res.json({
        command,
        result: item
      });
    }

    if (command === '/improve_email') {
      const draftId = args[0];
      if (!draftId) {
        return res.json({ error: 'Missing email draft id' });
      }

      const { data: queue } = readLiveEmailQueue(commandProject, draftId);
      const item = queue.find(x => x.id === draftId);

      if (!item) {
        return res.json({ error: 'Email draft not found' });
      }

      item.status = 'improved';
      item.format = 'campaign email';
      item.audience = 'German men interested in premium grooming';
      item.send_goal = 'traffic + conversion';
      item.subject = `${item.topic} – Premium Routine für Männer in Deutschland`;
      item.preheader = 'Premium Pflege, klare Routine, starker Auftritt.';
      item.body =
        `Entdecke ${item.topic} mit ${commandBrandName}. Premium Positionierung für Kunden, die Qualität, Wirkung und einen starken Auftritt verbinden wollen. Jetzt ist der richtige Moment, deine Routine auf das nächste Level zu bringen.`;
      item.cta = 'Jetzt entdecken';

      writeLiveEmailQueue(commandProject, queue);

      return res.json({
        command,
        result: item
      });
    }

    if (command === '/execute_ad') {
      const draftId = args[0];
      if (!draftId) {
        return res.json({ error: 'Missing ad draft id' });
      }

      const queuePath = getLegacyContentQueuePath(commandProject, 'ads');

      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
      const item = queue.find(x => x.id === draftId);

      if (!item) {
        return res.json({ error: 'Ad draft not found' });
      }

      item.status = 'ready_for_launch';

      fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');

      return res.json({
        command,
        result: item,
        note: 'Ad draft is now ready_for_launch. External Meta launch connector is the next layer.'
      });
    }

    if (command === '/execute_post') {
      const draftId = args[0];
      if (!draftId) {
        return res.json({ error: 'Missing post draft id' });
      }

      const queuePath = getLegacyContentQueuePath(commandProject, 'social');

      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
      const item = queue.find(x => x.id === draftId);

      if (!item) {
        return res.json({ error: 'Post draft not found' });
      }

      item.status = 'ready_for_publish';

      fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');

      return res.json({
        command,
        result: item,
        note: 'Post draft is now ready_for_publish. Social publishing connector is the next layer.'
      });
    }

    if (command === '/execute_blog') {
      const draftId = args[0];
      if (!draftId) {
        return res.json({ error: 'Missing blog draft id' });
      }

      const queuePath = getLegacyContentQueuePath(commandProject, 'blog');

      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
      const item = queue.find(x => x.id === draftId);

      if (!item) {
        return res.json({ error: 'Blog draft not found' });
      }

      item.status = 'ready_for_publish';

      fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');

      return res.json({
        command,
        result: item,
        note: 'Blog draft is now ready_for_publish. Website/blog publishing connector is the next layer.'
      });
    }

    if (command === '/execute_email') {
      const draftId = args[0];
      if (!draftId) {
        return res.json({ error: 'Missing email draft id' });
      }

      const { data: queue } = readLiveEmailQueue(commandProject, draftId);
      const item = queue.find(x => x.id === draftId);

      if (!item) {
        return res.json({ error: 'Email draft not found' });
      }

      item.status = 'ready_for_send';

      writeLiveEmailQueue(commandProject, queue);

      return res.json({
        command,
        result: item,
        note: 'Email draft is now ready_for_send. Email connector is the next layer.'
      });
    }
if (command === '/publish_blog') {
  const draftId = args[0];
  if (!draftId) {
    return res.json({ error: 'Missing blog draft id' });
  }

  const response = await fetch(
    `http://localhost:${PORT}/publish-blog/${draftId}?project=${encodeURIComponent(commandProject)}`,
    { method: 'POST' }
  );

  const data = await response.json();

  return res.json({
    command,
    result: data
  });
}
    if (command === '/prepare_blog_media') {
      const draftId = args[0];
      if (!draftId) {
        return res.json({ error: 'Missing blog draft id' });
      }

      const queuePath = getLegacyContentQueuePath(commandProject, 'blog');

      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
      const item = queue.find(x => x.id === draftId);

      if (!item) {
        return res.json({ error: 'Blog draft not found' });
      }

      return res.json({
        command,
        result: {
          draft_id: item.id,
          title: item.title,
          featured_image_prompt: item.featured_image_prompt || '',
          featured_image_alt: item.featured_image_alt || '',
          recommended_format: 'blog featured image',
          recommended_ratio: '16:9',
          media_ready: Boolean(item.featured_image_prompt && item.featured_image_alt)
        }
      });
    }

    if (command === '/review_blog_assets') {
      const draftId = args[0];
      if (!draftId) {
        return res.json({ error: 'Missing blog draft id' });
      }

      const queuePath = getLegacyContentQueuePath(commandProject, 'blog');

      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
      const item = queue.find(x => x.id === draftId);

      if (!item) {
        return res.json({ error: 'Blog draft not found' });
      }

      return res.json({
        command,
        result: {
          draft_id: item.id,
          title: item.title,
          status: item.status,
          seo_title: item.seo_title || '',
          meta_description: item.meta_description || '',
          search_intent: item.search_intent || '',
          recommended_word_count: item.recommended_word_count || '',
          category_suggestion: item.category_suggestion || '',
          tag_suggestions: item.tag_suggestions || [],
          featured_image_prompt: item.featured_image_prompt || '',
          featured_image_alt: item.featured_image_alt || '',
          internal_link_suggestions: item.internal_link_suggestions || [],
          external_reference_suggestions: item.external_reference_suggestions || []
        }
      });
    }
       if (command === '/generate_blog_image') {
      const draftId = args[0];
      if (!draftId) {
        return res.json({ error: 'Missing blog draft id' });
      }

      const blogQueuePath = getLegacyContentQueuePath(commandProject, 'blog');

      const blogQueue = JSON.parse(fs.readFileSync(blogQueuePath, 'utf8'));
      const blogItem = blogQueue.find(x => x.id === draftId);

      if (!blogItem) {
        return res.json({ error: 'Blog draft not found' });
      }

      const mediaDir = getProjectMediaDir(commandProject);
      const mediaQueuePath = getProjectBlogImageQueuePath(commandProject);
      fs.mkdirSync(path.join(mediaDir, 'queue'), { recursive: true });
      fs.mkdirSync(path.join(mediaDir, 'blog'), { recursive: true });

      const mediaQueue = readJsonFile(mediaQueuePath, []);

      const assetId = `blogimg_${Date.now()}`;
      const safeSlug = String(blogItem.topic || 'blog-image')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const plannedFilename = `${assetId}-${safeSlug}.png`;
      const plannedOutputPath = path.join(
        mediaDir,
        'blog',
        plannedFilename
      );

      const assetRecord = {
        asset_id: assetId,
        type: 'blog_featured_image',
        status: 'draft',
        linked_blog_id: blogItem.id,
        blog_title: blogItem.title,
        topic: blogItem.topic,
        prompt: blogItem.featured_image_prompt || '',
        alt_text: blogItem.featured_image_alt || '',
        recommended_ratio: '16:9',
        recommended_size: '1600x900',
        style: 'premium masculine editorial',
        output_path: plannedOutputPath,
        filename: plannedFilename,
        created_at: new Date().toISOString(),
        media_ready: Boolean(blogItem.featured_image_prompt && blogItem.featured_image_alt)
      };

      mediaQueue.push(assetRecord);
      fs.writeFileSync(
        mediaQueuePath,
        JSON.stringify(mediaQueue, null, 2),
        'utf8'
      );

      return res.json({
        command,
        result: assetRecord
      });
    }

    if (command === '/review_blog_media_asset') {
      const ref = args[0];
      if (!ref) {
        return res.json({ error: 'Missing asset id or blog draft id' });
      }

      const mediaQueue = readJsonFile(getProjectBlogImageQueuePath(commandProject), []);

      let asset = mediaQueue.find(x => x.asset_id === ref);

      if (!asset) {
        const linkedAssets = mediaQueue
          .filter(x => x.linked_blog_id === ref)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        asset = linkedAssets[0];
      }

      if (!asset) {
        return res.json({ error: 'Media asset not found' });
      }

      return res.json({
        command,
        result: asset
      });
    }
if (command === '/generate_image_real') {
  const ref = args[0];

  if (!ref) {
    return res.json({ error: 'Missing blog draft id or asset id' });
  }

  const mediaQueuePath = getProjectBlogImageQueuePath(commandProject);
  const mediaQueue = readJsonFile(mediaQueuePath, []);

  let asset = mediaQueue.find(x => x.asset_id === ref);

  if (!asset) {
    const linkedAssets = mediaQueue
      .filter(x => x.linked_blog_id === ref)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    asset = linkedAssets[0];
  }

  if (!asset) {
    return res.json({ error: 'Media asset not found' });
  }

  if (!asset.prompt) {
    return res.json({ error: 'Missing prompt in asset' });
  }

  try {
    const axios = require('axios');

    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        model: 'gpt-image-1',
        prompt: asset.prompt,
        size: '1024x1024'
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const imageBase64 = response.data.data[0].b64_json;
    const imageBuffer = Buffer.from(imageBase64, 'base64');

    fs.writeFileSync(asset.output_path, imageBuffer);

    asset.status = 'generated';
    asset.generated_at = new Date().toISOString();

    fs.writeFileSync(
      mediaQueuePath,
      JSON.stringify(mediaQueue, null, 2),
      'utf8'
    );

    return res.json({
      command,
      result: {
        asset_id: asset.asset_id,
        status: asset.status,
        file_saved: asset.output_path,
        message: 'Image generated successfully'
      }
    });

  } catch (error) {
    return res.json({
      error: 'Image generation failed',
      details: error.message
    });
  }
}

if (command === '/attach_blog_image') {
  const draftId = args[0];

  if (!draftId) {
    return res.json({ error: 'Missing blog draft id' });
  }

  const blogQueuePath = getLegacyContentQueuePath(commandProject, 'blog');

  const blogQueue = JSON.parse(fs.readFileSync(blogQueuePath, 'utf8'));
  const blogItem = blogQueue.find(x => x.id === draftId);

  if (!blogItem || !blogItem.published_post_id) {
    return res.json({ error: 'Blog not published or not found' });
  }

  const mediaQueuePath = getProjectBlogImageQueuePath(commandProject);
  const mediaQueue = readJsonFile(mediaQueuePath, []);

  const asset = mediaQueue
    .filter(x => x.linked_blog_id === draftId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

  if (!asset || asset.status !== 'generated') {
    return res.json({ error: 'No generated image found for this blog' });
  }

  try {
    const fileData = fs.readFileSync(asset.output_path);

    const uploadResponse = await axios.post(
      `${process.env.WP_BASE_URL}/media`,
      fileData,
      {
        headers: {
          'Content-Disposition': `attachment; filename="${asset.filename}"`,
          'Content-Type': 'image/png'
        },
        auth: {
          username: process.env.WP_USER,
          password: process.env.WP_APP_PASSWORD
        }
      }
    );

    const mediaId = uploadResponse.data.id;

    const postUpdateResponse = await axios.post(
      `${process.env.WP_BASE_URL}/posts/${blogItem.published_post_id}`,
      {
        featured_media: mediaId
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        auth: {
          username: process.env.WP_USER,
          password: process.env.WP_APP_PASSWORD
        }
      }
    );

    asset.status = 'attached';
    asset.wp_media_id = mediaId;
    asset.attached_post_id = blogItem.published_post_id;
    asset.attached_at = new Date().toISOString();

    blogItem.featured_media_id = mediaId;
    blogItem.featured_image_attached = true;
    blogItem.featured_image_source = asset.filename;

    fs.writeFileSync(
      mediaQueuePath,
      JSON.stringify(mediaQueue, null, 2),
      'utf8'
    );

    fs.writeFileSync(
      blogQueuePath,
      JSON.stringify(blogQueue, null, 2),
      'utf8'
    );

    return res.json({
      command,
      result: {
        blog_id: draftId,
        post_id: blogItem.published_post_id,
        media_id: mediaId,
        post_link: blogItem.link || '',
        status: 'attached',
        wp_post_status: postUpdateResponse.data.status || '',
        message: 'Featured image attached successfully'
      }
    });

  } catch (error) {
    return res.json({
      error: 'Upload or attach failed',
      details: sanitizeErrorPayloadForClient(error.response?.data || error.message)
    });
  }
}

    if (command === '/enhance_published_blog') {
      const draftId = args[0];

      if (!draftId) {
        return res.json({ error: 'Missing blog draft id' });
      }

      const blogQueuePath = getLegacyContentQueuePath(commandProject, 'blog');

      const blogQueue = JSON.parse(fs.readFileSync(blogQueuePath, 'utf8'));
      const blogItem = blogQueue.find(x => x.id === draftId);

      if (!blogItem || !blogItem.published_post_id) {
        return res.json({ error: 'Published blog not found' });
      }

      try {
        const auth = {
          username: process.env.WP_USER,
          password: process.env.WP_APP_PASSWORD
        };

        const postId = blogItem.published_post_id;

        // 1) find/create tags
        let appliedTagIds = [];

        if (Array.isArray(blogItem.tag_suggestions) && blogItem.tag_suggestions.length) {
          for (const tagName of blogItem.tag_suggestions) {
            try {
              const searchResp = await axios.get(
                `${process.env.WP_BASE_URL}/tags?search=${encodeURIComponent(tagName)}`,
                { auth }
              );

              let tagId = searchResp.data?.[0]?.id;

              if (!tagId) {
                const createResp = await axios.post(
                  `${process.env.WP_BASE_URL}/tags`,
                  { name: tagName },
                  { auth }
                );
                tagId = createResp.data.id;
              }

              if (tagId) appliedTagIds.push(tagId);
            } catch (e) {}
          }
        }

        // 2) find category by suggestion
        let categoryId = null;
        if (blogItem.category_suggestion) {
          try {
            const catResp = await axios.get(
              `${process.env.WP_BASE_URL}/categories?search=${encodeURIComponent(blogItem.category_suggestion)}`,
              { auth }
            );

            categoryId = catResp.data?.[0]?.id || null;
          } catch (e) {}
        }

        // 3) update post with excerpt/taxonomies
        const postUpdatePayload = {
          excerpt: blogItem.excerpt || ''
        };

        if (categoryId) {
          postUpdatePayload.categories = [categoryId];
        }

        if (appliedTagIds.length) {
          postUpdatePayload.tags = appliedTagIds;
        }

        const postUpdateResp = await axios.post(
          `${process.env.WP_BASE_URL}/posts/${postId}`,
          postUpdatePayload,
          { auth }
        );

        // 4) update alt text on featured media if attached
        let altApplied = false;
        if (blogItem.featured_media_id && blogItem.featured_image_alt) {
          try {
            await axios.post(
              `${process.env.WP_BASE_URL}/media/${blogItem.featured_media_id}`,
              {
                alt_text: blogItem.featured_image_alt
              },
              { auth }
            );
            altApplied = true;
          } catch (e) {}
        }

        blogItem.category_applied = blogItem.category_suggestion || '';
        blogItem.tags_applied = blogItem.tag_suggestions || [];
        blogItem.excerpt_applied = Boolean(blogItem.excerpt);
        blogItem.featured_image_alt_applied = altApplied;
        blogItem.enhancement_status = 'complete';
        blogItem.last_enhanced_at = new Date().toISOString();

        fs.writeFileSync(
          blogQueuePath,
          JSON.stringify(blogQueue, null, 2),
          'utf8'
        );

        return res.json({
          command,
          result: {
            draft_id: draftId,
            post_id: postId,
            link: blogItem.link || '',
            category_applied: blogItem.category_applied,
            tags_applied: blogItem.tags_applied,
            excerpt_applied: blogItem.excerpt_applied,
            featured_image_alt_applied: blogItem.featured_image_alt_applied,
            enhancement_status: blogItem.enhancement_status,
            wp_post_status: postUpdateResp.data.status || ''
          }
        });
      } catch (error) {
        return res.json({
          error: 'Blog enhancement failed',
          details: sanitizeErrorPayloadForClient(error.response?.data || error.message)
        });
      }
    }

    if (command === '/review_published_blog') {
      const draftId = args[0];

      if (!draftId) {
        return res.json({ error: 'Missing blog draft id' });
      }

      const blogQueuePath = getLegacyContentQueuePath(commandProject, 'blog');

      const blogQueue = JSON.parse(fs.readFileSync(blogQueuePath, 'utf8'));
      const blogItem = blogQueue.find(x => x.id === draftId);

      if (!blogItem) {
        return res.json({ error: 'Blog not found' });
      }

      return res.json({
        command,
        result: {
          draft_id: blogItem.id,
          title: blogItem.title,
          status: blogItem.status,
          published_post_id: blogItem.published_post_id || null,
          link: blogItem.link || '',
          category_suggestion: blogItem.category_suggestion || '',
          category_applied: blogItem.category_applied || '',
          tag_suggestions: blogItem.tag_suggestions || [],
          tags_applied: blogItem.tags_applied || [],
          featured_media_id: blogItem.featured_media_id || null,
          featured_image_attached: blogItem.featured_image_attached || false,
          featured_image_alt: blogItem.featured_image_alt || '',
          featured_image_alt_applied: blogItem.featured_image_alt_applied || false,
          excerpt_applied: blogItem.excerpt_applied || false,
          enhancement_status: blogItem.enhancement_status || 'not_run'
        }
      });
    }

    if (command === '/review_email_asset') {
      const draftId = args[0];
      if (!draftId) {
        return res.json({ error: 'Missing email draft id' });
      }

      const { data: queue } = readLiveEmailQueue(commandProject, draftId);
      const item = queue.find(x => x.id === draftId);

      if (!item) {
        return res.json({ error: 'Email draft not found' });
      }

            return res.json({
        command,
        result: {
          draft_id: item.id,
          topic: item.topic,
          status: item.status,
          subject: item.subject || '',
          preheader: item.preheader || '',
          body: item.body || '',
          cta: item.cta || '',
          audience: item.audience || 'general launch audience',
          send_goal: item.send_goal || 'traffic + conversion',
          format: item.format || 'campaign email',
          ready_for_send: item.status === 'ready_for_send',
          hero_image_asset_id: item.hero_image_asset_id || '',
          hero_image_url: item.hero_image_url || '',
          hero_image_alt: item.hero_image_alt || '',
          html_ready: Boolean(item.html_body),
          html_body: item.html_body || ''
        }
      });
    }

    if (command === '/generate_email_image') {
      const draftId = args[0];
      if (!draftId) {
        return res.json({ error: 'Missing email draft id' });
      }

      const { data: emailQueue } = readLiveEmailQueue(commandProject, draftId);
      const emailItem = emailQueue.find(x => x.id === draftId);

      if (!emailItem) {
        return res.json({ error: 'Email draft not found' });
      }

      const mediaDir = getProjectMediaDir(commandProject);
      fs.mkdirSync(path.join(mediaDir, 'queue'), { recursive: true });
      fs.mkdirSync(path.join(mediaDir, 'email'), { recursive: true });

      const { data: mediaQueue } = readLiveEmailMediaQueue(commandProject, draftId);

      const assetId = `emailimg_${Date.now()}`;
      const safeSlug = String(emailItem.topic || 'email-image')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const plannedFilename = `${assetId}-${safeSlug}.png`;
      const plannedOutputPath = path.join(
        mediaDir,
        'email',
        plannedFilename
      );

      const prompt =
        `Create a premium email hero image for ${emailItem.topic}, focused on luxury men’s grooming, strong masculine branding, refined product presentation, elegant dark premium styling, suitable for a high-conversion campaign email for the German market.`;

      const altText =
        `${emailItem.topic} – Premium Kampagne von ${commandBrandName}`;

      const assetRecord = {
        asset_id: assetId,
        type: 'email_hero_image',
        status: 'draft',
        linked_email_id: emailItem.id,
        email_subject: emailItem.subject || '',
        topic: emailItem.topic,
        prompt,
        alt_text: altText,
        recommended_ratio: '16:9',
        recommended_size: '1600x900',
        style: 'premium masculine campaign email',
        output_path: plannedOutputPath,
        filename: plannedFilename,
        created_at: new Date().toISOString(),
        media_ready: true
      };

      mediaQueue.push(assetRecord);
      writeLiveEmailMediaQueue(commandProject, mediaQueue);

      return res.json({
        command,
        result: assetRecord
      });
    }

    if (command === '/review_email_media') {
      const ref = args[0];
      if (!ref) {
        return res.json({ error: 'Missing email draft id or asset id' });
      }

      const { data: mediaQueue } = readLiveEmailMediaQueue(commandProject, ref);

      let asset = mediaQueue.find(x => x.asset_id === ref);

      if (!asset) {
        const linkedAssets = mediaQueue
          .filter(x => x.linked_email_id === ref)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        asset = linkedAssets[0];
      }

      if (!asset) {
        return res.json({ error: 'Email media asset not found' });
      }

      return res.json({
        command,
        result: asset
      });
    }

    if (command === '/attach_email_image') {
  const draftId = args[0];
  if (!draftId) {
    return res.json({ error: 'Missing email draft id' });
  }

  const { data: emailQueue } = readLiveEmailQueue(commandProject, draftId);
  const emailItem = emailQueue.find(x => x.id === draftId);

  if (!emailItem) {
    return res.json({ error: 'Email draft not found' });
  }

  const { data: mediaQueue } = readLiveEmailMediaQueue(commandProject, draftId);

  const generatedAssets = mediaQueue
    .filter(x => x.linked_email_id === draftId && x.status === 'generated')
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const asset = generatedAssets[0];

  if (!asset) {
    return res.json({ error: 'No generated email image found' });
  }

  try {
    const fileData = fs.readFileSync(asset.output_path);

    const uploadResponse = await axios.post(
      `${process.env.WP_BASE_URL}/media`,
      fileData,
      {
        headers: {
          'Content-Disposition': `attachment; filename="${asset.filename}"`,
          'Content-Type': 'image/png'
        },
        auth: {
          username: process.env.WP_USER,
          password: process.env.WP_APP_PASSWORD
        }
      }
    );

    const mediaId = uploadResponse.data.id;
    const publicImageUrl = uploadResponse.data.source_url;

    asset.status = 'uploaded';
    asset.wp_media_id = mediaId;
    asset.public_url = publicImageUrl;
    asset.uploaded_at = new Date().toISOString();

    emailItem.hero_image_asset_id = asset.asset_id;
    emailItem.hero_image_path = asset.output_path;
    emailItem.hero_image_url = publicImageUrl;
    emailItem.hero_image_alt = asset.alt_text;
    emailItem.hero_image_wp_media_id = mediaId;

    const projectWebsiteUrl = getProjectWebsiteUrl(commandProject) || '#';
    emailItem.html_body =
      `<div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;background:#ffffff;">` +
      `<img src="${publicImageUrl}" alt="${asset.alt_text}" style="width:100%;height:auto;display:block;border:0;" />` +
      `<div style="padding:32px 24px;">` +
      `<h2 style="margin:0 0 12px 0;color:#111;">${emailItem.subject || ''}</h2>` +
      `<p style="margin:0 0 16px 0;color:#444;">${emailItem.preheader || ''}</p>` +
      `<p style="margin:0 0 24px 0;color:#222;line-height:1.6;">${emailItem.body || ''}</p>` +
      `<a href="${projectWebsiteUrl}" style="display:inline-block;padding:14px 24px;background:#111;color:#fff;text-decoration:none;border-radius:6px;">${emailItem.cta || 'Jetzt entdecken'}</a>` +
      `</div></div>`;

    writeLiveEmailMediaQueue(commandProject, mediaQueue);
    writeLiveEmailQueue(commandProject, emailQueue);

    return res.json({
      command,
      result: {
        draft_id: emailItem.id,
        subject: emailItem.subject,
        hero_image_asset_id: emailItem.hero_image_asset_id,
        hero_image_url: emailItem.hero_image_url,
        hero_image_wp_media_id: emailItem.hero_image_wp_media_id,
        html_ready: true,
        status: emailItem.status
      }
    });
  } catch (error) {
    return res.json({
      error: 'Attach email image failed',
      details: sanitizeErrorPayloadForClient(error.response?.data || error.message)
    });
  }
}

    if (command === '/generate_email_image_real') {
      const ref = args[0];

      if (!ref) {
        return res.json({ error: 'Missing email draft id or asset id' });
      }

      const { data: mediaQueue } = readLiveEmailMediaQueue(commandProject, ref);

      let asset = mediaQueue.find(x => x.asset_id === ref);

      if (!asset) {
        const linkedAssets = mediaQueue
          .filter(x => x.linked_email_id === ref)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        asset = linkedAssets[0];
      }

      if (!asset) {
        return res.json({ error: 'Email media asset not found' });
      }

      if (!asset.prompt) {
        return res.json({ error: 'Missing prompt in asset' });
      }

      try {
        const response = await axios.post(
          'https://api.openai.com/v1/images/generations',
          {
            model: 'gpt-image-1',
            prompt: asset.prompt,
            size: '1024x1024'
          },
          {
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const imageBase64 = response.data.data[0].b64_json;
        const imageBuffer = Buffer.from(imageBase64, 'base64');

        fs.writeFileSync(asset.output_path, imageBuffer);

        asset.status = 'generated';
        asset.generated_at = new Date().toISOString();

        writeLiveEmailMediaQueue(commandProject, mediaQueue);

        return res.json({
          command,
          result: {
            asset_id: asset.asset_id,
            status: asset.status,
            file_saved: asset.output_path,
            message: 'Email image generated successfully'
          }
        });

      } catch (error) {
        return res.json({
          error: 'Email image generation failed',
          details: sanitizeErrorPayloadForClient(error.response?.data || error.message)
        });
      }
    }

     if (command === '/send_email_draft') {
      const draftId = args[0];
      const toEmail = args[1];

      if (!draftId) {
        return res.json({ error: 'Missing email draft id' });
      }

      if (!toEmail) {
        return res.json({ error: 'Missing recipient email' });
      }

        const { data: emailQueue } = readLiveEmailQueue(commandProject, draftId);
      const emailItem = emailQueue.find(x => x.id === draftId);

      if (!emailItem) {
        return res.json({ error: 'Email draft not found' });
      }

      if (!emailItem.html_body) {
        return res.json({ error: 'Email HTML not prepared' });
      }

      try {
        const response = await axios.post(
          process.env.MH_EMAIL_BRIDGE_URL,
          {
            to: toEmail,
            subject: emailItem.subject,
            preheader: emailItem.preheader || '',
            html_body: emailItem.html_body
          },
          {
            headers: {
              'x-mh-token': process.env.MH_EMAIL_BRIDGE_TOKEN,
              'Content-Type': 'application/json'
            }
          }
        );

        emailItem.status = 'sent';
        emailItem.sent_to = toEmail;
        emailItem.sent_at = new Date().toISOString();
        emailItem.send_result = response.data;

        writeLiveEmailQueue(commandProject, emailQueue);

        return res.json({
          command,
          result: {
            draft_id: emailItem.id,
            status: emailItem.status,
            sent_to: emailItem.sent_to,
            sent_at: emailItem.sent_at,
            bridge_result: response.data
          }
        });
      } catch (error) {
        return res.json({
          error: 'Email send failed',
          details: sanitizeErrorPayloadForClient(error.response?.data || error.message)
        });
      }
    }

    if (command === '/create_project_profile') {
      const projectName = normalizeProjectSlug(args.join(' ').trim());
      if (!projectName) {
        return res.json({ error: 'Missing project name' });
      }

      const projectPaths = resolveLegacyExecutionProjectPaths(projectName);
      const projectDir = projectPaths.projectDir;

      fs.mkdirSync(projectDir, { recursive: true });

      const profilePath = projectPaths.profilePath;

      const profile = {
        project_id: projectName,
        display_name: projectName,
        status: 'active',
        market: 'Germany',
        language: 'de',
        brand_tone: 'premium, clear, persuasive',
        business_type: 'brand / ecommerce',
        primary_goal: 'sales + brand growth',
        target_audience: 'to be defined',
        channel_priority: [
          'website',
          'email',
          'instagram',
          'facebook',
          'meta_ads',
          'blog'
        ],
        content_pillars: [
          'education',
          'transformation',
          'trust',
          'conversion'
        ],
        default_offer_style: 'premium + value + clear CTA',
        created_at: new Date().toISOString()
      };

      fs.writeFileSync(profilePath, JSON.stringify(profile, null, 2), 'utf8');

      return res.json({
        command,
        result: profile
      });
    }

    if (command === '/review_project_profile') {
      const projectName = normalizeProjectSlug(args.join(' ').trim());
      if (!projectName) {
        return res.json({ error: 'Missing project name' });
      }

      const profilePath = resolveLegacyExecutionProjectPaths(projectName).profilePath;

      if (!fs.existsSync(profilePath)) {
        return res.json({ error: 'Project profile not found' });
      }

      const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));

      return res.json({
        command,
        result: profile
      });
    }

    if (command === '/create_campaign_strategy') {
      const projectName = normalizeProjectSlug(args[0] || '');
      const goal = args.slice(1).join(' ').trim() || 'sales';

      if (!projectName) {
        return res.json({ error: 'Missing project name' });
      }

      const projectPaths = resolveLegacyExecutionProjectPaths(projectName);
      const projectDir = projectPaths.projectDir;

      const profilePath = projectPaths.profilePath;
      const queuePath = projectPaths.campaignStrategyQueuePath;

      if (!fs.existsSync(profilePath)) {
        return res.json({ error: 'Project profile not found' });
      }

      const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));

      const strategy = {
        strategy_id: `strategy_${Date.now()}`,
        project_id: projectName,
        status: 'draft',
        campaign_goal: goal,
        market: profile.market || 'Germany',
        language: profile.language || 'de',
        target_audience: profile.target_audience || 'to be refined',
        funnel_type: 'awareness -> consideration -> conversion',
        offer_strategy: 'clear offer + premium value + direct CTA',
        channel_mix: profile.channel_priority || [],
        content_pillars: profile.content_pillars || [],
        messaging_core: [
          'clear value proposition',
          'trust building',
          'problem/solution',
          'conversion CTA'
        ],
        content_outputs: [
          'blog',
          'email',
          'social post',
          'meta ad',
          'reel brief'
        ],
        media_outputs: [
          'featured image',
          'social creative',
          'email hero image',
          'ad image',
          'reel creative brief'
        ],
        kpis: [
          'reach',
          'CTR',
          'conversion rate',
          'sales',
          'ROAS'
        ],
        optimization_rules: [
          'test multiple hooks',
          'test multiple angles',
          'keep winners and cut weak creatives',
          'reuse high-performing assets across channels'
        ],
        created_at: new Date().toISOString()
      };

      queue.push(strategy);
      fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');

      return res.json({
        command,
        result: strategy
      });
    }

    if (command === '/review_campaign_strategy') {
      const strategyId = args[0];
      const projectName = normalizeProjectSlug(args[1] || '');

      if (!strategyId || !projectName) {
        return res.json({ error: 'Missing strategy id or project name' });
      }

      const queuePath = resolveLegacyExecutionProjectPaths(projectName).campaignStrategyQueuePath;

      if (!fs.existsSync(queuePath)) {
        return res.json({ error: 'Campaign strategy queue not found' });
      }

      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
      const strategy = queue.find(x => x.strategy_id === strategyId);

      if (!strategy) {
        return res.json({ error: 'Campaign strategy not found' });
      }

      return res.json({
        command,
        result: strategy
      });
    }

    if (command === '/plan_campaign_assets') {
      const strategyId = args[0];
      const projectName = normalizeProjectSlug(args[1] || '');

      if (!strategyId || !projectName) {
        return res.json({ error: 'Missing strategy id or project name' });
      }

      const projectPaths = resolveLegacyExecutionProjectPaths(projectName);
      const strategyQueuePath = projectPaths.campaignStrategyQueuePath;
      const planPath = projectPaths.campaignAssetPlanPath;

      if (!fs.existsSync(strategyQueuePath)) {
        return res.json({ error: 'Campaign strategy queue not found' });
      }

      const strategyQueue = JSON.parse(fs.readFileSync(strategyQueuePath, 'utf8'));
      const strategy = strategyQueue.find(x => x.strategy_id === strategyId);

      if (!strategy) {
        return res.json({ error: 'Campaign strategy not found' });
      }

      const assetPlan = {
        plan_id: `plan_${Date.now()}`,
        strategy_id: strategy.strategy_id,
        project_id: projectName,
        status: 'draft',
        planned_assets: {
          blog: 1,
          email: 1,
          social_posts: 3,
          meta_ads: 2,
          reel_briefs: 1,
          tiktok_briefs: 1
        },
        sequencing: [
          'blog first',
          'email follow-up',
          'social post set',
          'ad launch',
          'reel/tiktok support'
        ],
        execution_note:
          'Generate assets from strategy, then run review -> approval -> media -> publish/send.',
        created_at: new Date().toISOString()
      };

      fs.writeFileSync(planPath, JSON.stringify(assetPlan, null, 2), 'utf8');

      return res.json({
        command,
        result: assetPlan
      });
    }

if (command === '/enrich_project_profile') {
  const projectName = normalizeProjectSlug(args.join(' ').trim());

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  const profilePath = resolveLegacyExecutionProjectPaths(projectName).profilePath;

  if (!fs.existsSync(profilePath)) {
    return res.json({ error: 'Project profile not found' });
  }

  const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));

  const enrichedProfile = {
    ...profile,

    audience_segments: [
      {
        name: "Young professionals",
        age_range: "20-35",
        behavior: "care about appearance, style, grooming",
        buying_trigger: "look improvement + confidence"
      },
      {
        name: "Barbershop clients",
        age_range: "25-45",
        behavior: "already invest in grooming",
        buying_trigger: "professional-level results at home"
      }
    ],

    core_problems: [
      "inconsistent grooming routine",
      "low-quality products",
      "lack of clear system",
      "time-consuming routines"
    ],

    desired_outcomes: [
      "clean and strong look",
      "simple effective routine",
      "confidence in appearance",
      "premium self-image"
    ],

    objections: [
      "price sensitivity",
      "uncertainty about product effectiveness",
      "too many options",
      "no clear routine"
    ],

    brand_positioning: {
      category: "premium men’s grooming",
      differentiation: "simple, effective, premium routine",
      tone: "confident, clear, masculine, modern"
    },

    offer_logic: {
      entry_offer: "starter grooming routine",
      main_offer: "premium product bundle",
      upsell: "advanced grooming kit",
      retention: "routine-based repeat purchase"
    },

    content_strategy: {
      primary_pillars: [
        "education",
        "transformation",
        "authority",
        "conversion"
      ],
      hook_types: [
        "problem/solution",
        "before/after",
        "routine simplification",
        "premium identity"
      ]
    },

    channel_behavior: {
      instagram: "visual + reels + transformation",
      facebook: "mixed + retargeting",
      email: "conversion + retention",
      blog: "SEO + authority",
      meta_ads: "testing + scaling"
    },

    keyword_themes: [
      "beard routine germany",
      "men grooming germany",
      "premium beard care",
      "hair styling men germany"
    ],

    media_style_rules: {
      visual_style: "premium masculine",
      lighting: "high contrast clean",
      mood: "modern barbershop luxury",
      formats: [
        "product close-up",
        "lifestyle grooming",
        "before/after",
        "minimal premium background"
      ]
    },

    enriched_at: new Date().toISOString()
  };

  fs.writeFileSync(profilePath, JSON.stringify(enrichedProfile, null, 2), 'utf8');

  return res.json({
    command,
    result: enrichedProfile
  });
}

// STEP 3.7B — Smart Reuse Layer

if (command === '/reuse_blog_to_social') {
  const blogId = args[0];

  if (!blogId) {
    return res.json({ error: 'Missing blog ID' });
  }

  const blogQueuePath = getLegacyContentQueuePath(commandProject, 'blog');

  if (!fs.existsSync(blogQueuePath)) {
    return res.json({ error: 'Blog queue not found' });
  }

  const blogQueue = JSON.parse(fs.readFileSync(blogQueuePath, 'utf8'));
  const blog = blogQueue.find(b => b.id === blogId);

  if (!blog) {
    return res.json({ error: 'Blog not found' });
  }

  const socialPack = {
    source: blogId,
    type: 'blog_to_social',
    posts: [
      {
        platform: 'instagram',
        caption: `Ein stärkerer Look beginnt mit der richtigen Routine. ${blog.topic} mit ${commandBrandName} steht für Premium Positionierung und klare Ergebnisse.`,
        cta: 'Jetzt entdecken',
        hashtags: [commandHashtag, '#MensGrooming', '#PremiumCare', '#BarberStyle', '#MensStyle']
      },
      {
        platform: 'facebook',
        caption: `Warum ist ${blog.topic} wichtig? Entdecke eine einfache und effektive Routine für einen starken Auftritt.`,
        cta: 'Mehr erfahren'
      }
    ],
    reel: {
      hook: 'Dein Look ist kein Zufall',
      script: `Routine entscheidet alles. ${blog.topic} mit ${commandBrandName} bringt Klarheit und Wirkung.`,
      cta: 'Jetzt starten'
    },
    ad: {
      headline: `${blog.topic} – Premium Männerpflege`,
      primary_text: `Entdecke die perfekte Routine für Männer in Deutschland.`,
      cta: 'Jetzt entdecken'
    }
  };

  return res.json({
    command,
    result: socialPack
  });
}

if (command === '/reuse_email_to_social') {
  const emailId = args[0];

  if (!emailId) {
    return res.json({ error: 'Missing email ID' });
  }

  const { candidate, data: emailQueue } = readLiveEmailQueue(commandProject, emailId);

  if (!fs.existsSync(candidate.selectedPath)) {
    return res.json({ error: 'Email queue not found' });
  }

  const email = emailQueue.find(e => e.id === emailId);

  if (!email) {
    return res.json({ error: 'Email not found' });
  }

  const socialPack = {
    source: emailId,
    type: 'email_to_social',
    instagram: {
      caption: email.body,
      cta: email.cta
    },
    ad: {
      headline: email.subject,
      primary_text: email.body,
      cta: email.cta
    }
  };

  return res.json({
    command,
    result: socialPack
  });
}

if (command === '/generate_reel_from_blog') {
  const blogId = args[0];

  if (!blogId) {
    return res.json({ error: 'Missing blog ID' });
  }

  const reel = {
    hook: 'Stop doing this wrong',
    script: 'Die meisten Männer machen diese Fehler in ihrer Routine...',
    scenes: [
      'problem scene',
      'product usage',
      'result transformation'
    ],
    cta: 'Jetzt entdecken'
  };

  return res.json({
    command,
    result: reel
  });
}

    if (command === '/analyze_competitors') {
      const projectName = (args[0] || '').trim().toLowerCase();
      const market = args.slice(1).join(' ').trim() || 'germany';

      if (!projectName) {
        return res.json({ error: 'Missing project name' });
      }

      const queuePath = path.join(
        EXECUTION_DIR,
        'intelligence/competitor-queue.json'
      );

      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));

      const record = {
        id: `competitor_${Date.now()}`,
        project_id: projectName,
        market,
        status: 'draft',
        scan_scope: [
          'brand positioning',
          'offer style',
          'ad angles',
          'content tone',
          'channel behavior'
        ],
        recommended_sources: [
          'Meta Ad Library',
          'TikTok Creative Center',
          'Google Search competitors',
          'Project-known competitors'
        ],
        output_structure: [
          'top competitors',
          'messaging patterns',
          'offer patterns',
          'creative patterns',
          'weakness opportunities'
        ],
        created_at: new Date().toISOString()
      };

      queue.push(record);
      fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');

      return res.json({
        command,
        result: record
      });
    }

    if (command === '/find_trends') {
      const topic = (args[0] || '').trim().toLowerCase();
      const market = args.slice(1).join(' ').trim() || 'germany';

      if (!topic) {
        return res.json({ error: 'Missing topic' });
      }

      const queuePath = path.join(
        EXECUTION_DIR,
        'intelligence/trend-queue.json'
      );

      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));

      const record = {
        id: `trend_${Date.now()}`,
        topic,
        market,
        status: 'draft',
        target_sources: [
          'Google Trends',
          'TikTok Creative Center',
          'Instagram/TikTok trend observation'
        ],
        output_structure: [
          'rising topics',
          'related queries',
          'content opportunities',
          'seasonal relevance',
          'platform fit'
        ],
        created_at: new Date().toISOString()
      };

      queue.push(record);
      fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');

      return res.json({
        command,
        result: record
      });
    }

    if (command === '/keyword_map') {
      const projectName = (args[0] || '').trim().toLowerCase();
      const topic = args.slice(1).join(' ').trim();

      if (!projectName || !topic) {
        return res.json({ error: 'Missing project name or topic' });
      }

      const queuePath = path.join(
        EXECUTION_DIR,
        'intelligence/keyword-queue.json'
      );

      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));

      const record = {
        id: `keyword_${Date.now()}`,
        project_id: projectName,
        topic,
        status: 'draft',
        keyword_clusters: {
          primary: [topic],
          secondary: [
            `${topic} germany`,
            `${topic} premium`,
            `${topic} men`,
            `${topic} routine`
          ],
          commercial: [
            `buy ${topic}`,
            `${topic} shop`,
            `${topic} price germany`
          ],
          informational: [
            `how to use ${topic}`,
            `best ${topic}`,
            `${topic} tips`
          ]
        },
        source_recommendation: 'Google Ads Keyword Planner',
        created_at: new Date().toISOString()
      };

      queue.push(record);
      fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');

      return res.json({
        command,
        result: record
      });
    }

    if (command === '/hashtag_engine') {
      const projectName = (args[0] || '').trim().toLowerCase();
      const topic = args.slice(1).join(' ').trim();

      if (!projectName || !topic) {
        return res.json({ error: 'Missing project name or topic' });
      }

      const queuePath = path.join(
        EXECUTION_DIR,
        'intelligence/hashtag-queue.json'
      );

      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));

      const record = {
        id: `hashtag_${Date.now()}`,
        project_id: projectName,
        topic,
        status: 'draft',
        hashtag_groups: {
          brand: [buildProjectHashtag(projectName)],
          niche: ['#MensGrooming', '#PremiumCare', '#BarberStyle'],
          topic: [`#${topic.replace(/\s+/g, '')}`],
          audience: ['#MensStyle', '#GroomingRoutine']
        },
        source_recommendation: 'TikTok Creative Center + platform validation',
        created_at: new Date().toISOString()
      };

      queue.push(record);
      fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');

      return res.json({
        command,
        result: record
      });
    }

    if (command === '/create_intelligence_brief') {
      const projectName = (args[0] || '').trim().toLowerCase();
      const goal = args.slice(1).join(' ').trim() || 'sales';

      if (!projectName) {
        return res.json({ error: 'Missing project name' });
      }

      const queuePath = path.join(
        EXECUTION_DIR,
        'intelligence/intelligence-brief-queue.json'
      );

      const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));

      const record = {
        id: `intelbrief_${Date.now()}`,
        project_id: projectName,
        goal,
        status: 'draft',
        sections: [
          'competitor opportunities',
          'trend opportunities',
          'keyword opportunities',
          'hashtag opportunities',
          'recommended content angles',
          'recommended ad angles'
        ],
        created_at: new Date().toISOString()
      };

      queue.push(record);
      fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');

      return res.json({
        command,
        result: record
      });
    }
if (command === '/enrich_trend_live') {
  const trendId = args[0];

  if (!trendId) {
    return res.json({ error: 'Missing trend ID' });
  }

  const queuePath = path.join(
    EXECUTION_DIR,
    'intelligence/trend-queue.json'
  );

  const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
  const trend = queue.find(t => t.id === trendId);

  if (!trend) {
    return res.json({ error: 'Trend not found' });
  }

  trend.live_data = {
    rising_topics: [
      "beard growth faster",
      "beard oil routine germany",
      "premium beard styling"
    ],
    related_queries: [
      "best beard oil germany",
      "how to grow beard faster",
      "beard care tips men"
    ],
    content_opportunities: [
      "routine-based content",
      "before/after transformation",
      "quick grooming tips"
    ],
    platform_fit: {
      instagram: "visual transformation",
      tiktok: "fast hook + routine",
      blog: "SEO deep guide",
      email: "conversion"
    }
  };

  trend.status = 'enriched';
  trend.enriched_at = new Date().toISOString();

  fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');

  return res.json({
    command,
    result: trend
  });
}
if (command === '/enrich_competitor_live') {
  const compId = args[0];

  if (!compId) {
    return res.json({ error: 'Missing competitor ID' });
  }

  const queuePath = path.join(
    EXECUTION_DIR,
    'intelligence/competitor-queue.json'
  );

  const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
  const comp = queue.find(c => c.id === compId);

  if (!comp) {
    return res.json({ error: 'Competitor not found' });
  }

  comp.live_data = {
    top_competitors: [
      "Proraso",
      "American Crew",
      "L'Oréal Men Expert"
    ],
    messaging_patterns: [
      "natural ingredients",
      "professional results",
      "easy routine"
    ],
    ad_angles: [
      "before/after",
      "confidence boost",
      "quick routine"
    ],
    weaknesses: [
      "no clear system",
      "generic branding",
      "lack of premium identity"
    ]
  };

  comp.status = 'enriched';
  comp.enriched_at = new Date().toISOString();

  fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');

  return res.json({
    command,
    result: comp
  });
}
if (command === '/enrich_keyword_live') {
  const keywordId = args[0];

  if (!keywordId) {
    return res.json({ error: 'Missing keyword ID' });
  }

  const queuePath = path.join(
    EXECUTION_DIR,
    'intelligence/keyword-queue.json'
  );

  const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
  const kw = queue.find(k => k.id === keywordId);

  if (!kw) {
    return res.json({ error: 'Keyword not found' });
  }

  kw.live_data = {
    high_volume_keywords: [
      "beard oil germany",
      "best beard oil",
      "beard care routine"
    ],
    long_tail_keywords: [
      "best beard oil for growth germany",
      "how to use beard oil daily",
      "premium beard oil germany"
    ],
    intent_split: {
      commercial: ["buy beard oil", "beard oil price"],
      informational: ["how to use beard oil", "beard care tips"]
    }
  };

  kw.status = 'enriched';
  kw.enriched_at = new Date().toISOString();

  fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');

  return res.json({
    command,
    result: kw
  });
}
    if (command === '/build_campaign_from_intelligence') {
      const projectName = normalizeProjectSlug(args[0] || '');
      const goal = args.slice(1).join(' ').trim() || 'sales';

      if (!projectName) {
        return res.json({ error: 'Missing project name' });
      }

      const projectPaths = resolveLegacyExecutionProjectPaths(projectName);
      const profilePath = projectPaths.profilePath;
      const strategyQueuePath = projectPaths.campaignStrategyQueuePath;

      const trendQueuePath = path.join(
        EXECUTION_DIR,
        'intelligence/trend-queue.json'
      );

      const competitorQueuePath = path.join(
        EXECUTION_DIR,
        'intelligence/competitor-queue.json'
      );

      const keywordQueuePath = path.join(
        EXECUTION_DIR,
        'intelligence/keyword-queue.json'
      );

      const hashtagQueuePath = path.join(
        EXECUTION_DIR,
        'intelligence/hashtag-queue.json'
      );

      const campaignBrainPath = path.join(
        EXECUTION_DIR,
        'intelligence/campaign-brain-queue.json'
      );

      if (!fs.existsSync(profilePath)) {
        return res.json({ error: 'Project profile not found' });
      }

      const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
      const strategyQueue = JSON.parse(fs.readFileSync(strategyQueuePath, 'utf8'));
      const trendQueue = JSON.parse(fs.readFileSync(trendQueuePath, 'utf8'));
      const competitorQueue = JSON.parse(fs.readFileSync(competitorQueuePath, 'utf8'));
      const keywordQueue = JSON.parse(fs.readFileSync(keywordQueuePath, 'utf8'));
      const hashtagQueue = JSON.parse(fs.readFileSync(hashtagQueuePath, 'utf8'));
      const campaignBrainQueue = JSON.parse(fs.readFileSync(campaignBrainPath, 'utf8'));

      const latestStrategy = [...strategyQueue].reverse()[0] || null;
      const latestTrend = [...trendQueue].reverse().find(x => x.status === 'enriched') || [...trendQueue].reverse()[0] || null;
      const latestCompetitor = [...competitorQueue].reverse().find(x => x.status === 'enriched') || [...competitorQueue].reverse()[0] || null;
      const latestKeyword = [...keywordQueue].reverse().find(x => x.status === 'enriched') || [...keywordQueue].reverse()[0] || null;
      const latestHashtag = [...hashtagQueue].reverse()[0] || null;

      const brain = {
        id: `campaignbrain_${Date.now()}`,
        project_id: projectName,
        goal,
        status: 'draft',
        strategic_base: {
          market: profile.market || 'Germany',
          language: profile.language || 'de',
          primary_goal: profile.primary_goal || goal,
          brand_tone: profile.brand_tone || '',
          audience_segments: profile.audience_segments || [],
          core_problems: profile.core_problems || [],
          desired_outcomes: profile.desired_outcomes || [],
          objections: profile.objections || []
        },
        opportunity_map: {
          trend_opportunities: latestTrend?.live_data?.content_opportunities || [],
          rising_topics: latestTrend?.live_data?.rising_topics || [],
          related_queries: latestTrend?.live_data?.related_queries || [],
          competitor_weaknesses: latestCompetitor?.live_data?.weaknesses || [],
          competitor_angles: latestCompetitor?.live_data?.ad_angles || [],
          high_volume_keywords: latestKeyword?.live_data?.high_volume_keywords || latestKeyword?.keyword_clusters?.primary || [],
          long_tail_keywords: latestKeyword?.live_data?.long_tail_keywords || [],
          hashtags: latestHashtag?.hashtag_groups || {}
        },
        recommended_campaign_angles: [
          'problem -> solution',
          'premium identity',
          'routine simplification',
          'before/after transformation',
          'confidence + appearance'
        ],
        recommended_channel_priorities: profile.channel_priority || [
          'website',
          'email',
          'instagram',
          'facebook',
          'meta_ads',
          'blog'
        ],
        recommended_content_stack: [
          '1 SEO article',
          '1 conversion email',
          '3 social posts',
          '2 ad creatives',
          '1 reel brief',
          '1 tiktok brief'
        ],
        kpi_focus: latestStrategy?.kpis || [
          'reach',
          'CTR',
          'conversion rate',
          'sales',
          'ROAS'
        ],
        execution_order: [
          'finalize offer',
          'publish landing/product/blog asset',
          'send launch email',
          'launch social content',
          'launch paid ads',
          'review performance and improve winners'
        ],
        created_at: new Date().toISOString()
      };

      campaignBrainQueue.push(brain);
      fs.writeFileSync(campaignBrainPath, JSON.stringify(campaignBrainQueue, null, 2), 'utf8');

      return res.json({
        command,
        result: brain
      });
    }

    if (command === '/recommend_campaign_angles') {
      const projectName = (args[0] || '').trim().toLowerCase();

      if (!projectName) {
        return res.json({ error: 'Missing project name' });
      }

      const campaignBrainPath = path.join(
        EXECUTION_DIR,
        'intelligence/campaign-brain-queue.json'
      );

      const queue = JSON.parse(fs.readFileSync(campaignBrainPath, 'utf8'));
      const latestBrain = [...queue].reverse().find(x => x.project_id === projectName);

      if (!latestBrain) {
        return res.json({ error: 'No campaign brain found for project' });
      }

      return res.json({
        command,
        result: {
          project_id: projectName,
          goal: latestBrain.goal,
          recommended_campaign_angles: latestBrain.recommended_campaign_angles,
          competitor_angles: latestBrain.opportunity_map?.competitor_angles || [],
          trend_opportunities: latestBrain.opportunity_map?.trend_opportunities || [],
          keyword_focus: latestBrain.opportunity_map?.high_volume_keywords || []
        }
      });
    }

    if (command === '/recommend_platform_priorities') {
      const projectName = (args[0] || '').trim().toLowerCase();

      if (!projectName) {
        return res.json({ error: 'Missing project name' });
      }

      const campaignBrainPath = path.join(
        EXECUTION_DIR,
        'intelligence/campaign-brain-queue.json'
      );

      const queue = JSON.parse(fs.readFileSync(campaignBrainPath, 'utf8'));
      const latestBrain = [...queue].reverse().find(x => x.project_id === projectName);

      if (!latestBrain) {
        return res.json({ error: 'No campaign brain found for project' });
      }

      return res.json({
        command,
        result: {
          project_id: projectName,
          recommended_channel_priorities: latestBrain.recommended_channel_priorities,
          platform_fit: {
            instagram: 'visual storytelling + reels + hooks',
            facebook: 'retargeting + mixed audience content',
            email: 'conversion + retention',
            blog: 'SEO + authority',
            meta_ads: 'testing + scale'
          }
        }
      });
    }

    if (command === '/create_weekly_market_plan') {
      const projectName = (args[0] || '').trim().toLowerCase();

      if (!projectName) {
        return res.json({ error: 'Missing project name' });
      }

      const campaignBrainPath = path.join(
        EXECUTION_DIR,
        'intelligence/campaign-brain-queue.json'
      );

      const queue = JSON.parse(fs.readFileSync(campaignBrainPath, 'utf8'));
      const latestBrain = [...queue].reverse().find(x => x.project_id === projectName);

      if (!latestBrain) {
        return res.json({ error: 'No campaign brain found for project' });
      }

      const weeklyPlan = {
        id: `weeklyplan_${Date.now()}`,
        project_id: projectName,
        status: 'draft',
        priorities: [
          'publish one authority blog',
          'launch one conversion email',
          'publish three social assets',
          'test two ad angles',
          'monitor CTR and strongest hook'
        ],
        best_angles_this_week: latestBrain.recommended_campaign_angles,
        keyword_focus: latestBrain.opportunity_map?.high_volume_keywords || [],
        trend_focus: latestBrain.opportunity_map?.rising_topics || [],
        channel_priority: latestBrain.recommended_channel_priorities || [],
        created_at: new Date().toISOString()
      };

      return res.json({
        command,
        result: weeklyPlan
      });
    }
if (command === '/execute_campaign_brain') {
  const brainId = args[0];

  if (!brainId) {
    return res.json({ error: 'Missing campaign brain ID' });
  }

  const brainPath = path.join(
    EXECUTION_DIR,
    'intelligence/campaign-brain-queue.json'
  );

  const outputPath = path.join(
    EXECUTION_DIR,
    'campaign-output/campaign-output-queue.json'
  );

  const brainQueue = JSON.parse(fs.readFileSync(brainPath, 'utf8'));
  const outputQueue = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

  const brain = brainQueue.find(b => b.id === brainId);

  if (!brain) {
    return res.json({ error: 'Campaign brain not found' });
  }

  const brainProject = normalizeOptionalProjectSlug(brain.project_id) || commandProject;
  const brainBrandName = getProjectDisplayName(brainProject);
  const mainKeyword = brain.opportunity_map?.high_volume_keywords?.[0] || 'mens grooming';

  const result = {
    id: `campaignexec_${Date.now()}`,
    campaign_brain_id: brainId,
    project_id: brain.project_id,
    status: 'generated',

    blog: {
      title: `${mainKeyword} | ${brainBrandName} Guide`,
      topic: mainKeyword,
      structure: [
        'introduction',
        'why it matters',
        'common mistakes',
        'routine steps',
        'recommended products',
        'conclusion + CTA'
      ]
    },

    email: {
      subject: `${mainKeyword} – Premium Routine für Männer`,
      body: `Entdecke die perfekte ${mainKeyword} Routine mit ${brainBrandName}.`,
      cta: 'Jetzt entdecken'
    },

    social_posts: [
      {
        platform: 'instagram',
        hook: brain.recommended_campaign_angles[0],
        caption: `Dein Look beginnt mit ${mainKeyword}.`,
        cta: 'Jetzt entdecken'
      },
      {
        platform: 'facebook',
        hook: brain.recommended_campaign_angles[1],
        caption: `Warum ${mainKeyword} wichtig ist.`,
        cta: 'Mehr erfahren'
      }
    ],

    ads: [
      {
        headline: `${mainKeyword} – Premium Pflege`,
        primary_text: 'Die beste Routine für Männer in Deutschland.',
        cta: 'Jetzt entdecken'
      }
    ],

    reel: {
      hook: 'Stop doing this wrong',
      script: `${mainKeyword} entscheidet über deinen Look.`,
      cta: 'Jetzt starten'
    },

    media_prompts: [
      `Create a premium masculine image for ${mainKeyword}`,
      `Create before/after grooming visual`,
      `Create product-focused luxury shot`
    ],

    created_at: new Date().toISOString()
  };

  outputQueue.push(result);
  fs.writeFileSync(outputPath, JSON.stringify(outputQueue, null, 2), 'utf8');

  return res.json({
    command,
    result
  });
}
    if (command === '/autogen_campaign_assets') {
      const execId = args[0];

      if (!execId) {
        return res.json({ error: 'Missing campaign execution ID' });
      }

      const campaignOutputPath = path.join(
        EXECUTION_DIR,
        'campaign-output/campaign-output-queue.json'
      );

      const campaignProject = commandProject;
      const campaignBrandName = getProjectDisplayName(campaignProject);
      const blogQueuePath = getLegacyContentQueuePath(campaignProject, 'blog');
      const postQueuePath = getLegacyContentQueuePath(campaignProject, 'social');
      const adQueuePath = getLegacyContentQueuePath(campaignProject, 'ads');
      const reelQueuePath = getLegacyContentQueuePath(campaignProject, 'reel');

      const campaignOutputQueue = JSON.parse(fs.readFileSync(campaignOutputPath, 'utf8'));
      const blogQueue = JSON.parse(fs.readFileSync(blogQueuePath, 'utf8'));
      const { data: emailQueue } = readLiveEmailQueue(commandProject, execId);
      const postQueue = JSON.parse(fs.readFileSync(postQueuePath, 'utf8'));
      const adQueue = JSON.parse(fs.readFileSync(adQueuePath, 'utf8'));
      const reelQueue = JSON.parse(fs.readFileSync(reelQueuePath, 'utf8'));

      const campaignExec = campaignOutputQueue.find(x => x.id === execId);

      if (!campaignExec) {
        return res.json({ error: 'Campaign execution record not found' });
      }

      const created = {
        blog_id: null,
        email_id: null,
        social_post_ids: [],
        ad_ids: [],
        reel_id: null
      };

      // BLOG
      if (campaignExec.blog) {
        const blogDraft = {
          id: `blog_${Date.now()}`,
          topic: campaignExec.blog.topic,
          status: 'draft',
          title: campaignExec.blog.title,
          excerpt: `${campaignExec.blog.topic} – Premium Tipps und klare Routine von ${campaignBrandName}.`,
          seo_title: `${campaignExec.blog.title} | ${campaignBrandName}`,
          meta_description: `${campaignExec.blog.topic} – entdecke eine starke und einfache Premium-Routine für Männer in Deutschland.`,
          target_keywords: [campaignExec.blog.topic],
          search_intent: 'informational + commercial',
          recommended_word_count: '1000-1500',
          category_suggestion: 'Männerpflege',
          tag_suggestions: [
            campaignExec.blog.topic,
            'Männerpflege',
            campaignBrandName,
            'Premium Pflege'
          ],
          internal_link_suggestions: [
            'Link to matching product page',
            'Link to homepage featured collection'
          ],
          external_reference_suggestions: [
            'Add one strong authority source if relevant'
          ],
          featured_image_prompt: `Create a premium editorial blog image for ${campaignExec.blog.topic}, masculine grooming, luxury brand style, clear premium composition.`,
          featured_image_alt: `${campaignExec.blog.topic} – Premium Artikel von ${campaignBrandName}`,
          outline: campaignExec.blog.structure || [],
          body: `<h2>${campaignExec.blog.topic}</h2><p>Entdecke ${campaignExec.blog.topic} mit ${campaignBrandName}.</p>`,
          source_campaign_execution_id: execId
        };

        blogQueue.push(blogDraft);
        created.blog_id = blogDraft.id;
      }

      // EMAIL
      if (campaignExec.email) {
        const emailDraft = {
          id: `email_${Date.now() + 1}`,
          topic: campaignExec.blog?.topic || campaignExec.email.subject || 'campaign email',
          status: 'draft',
          format: 'campaign email',
          audience: 'campaign audience',
          send_goal: 'traffic + conversion',
          subject: campaignExec.email.subject,
          preheader: 'Premium Pflege, klare Routine, starker Auftritt.',
          body: campaignExec.email.body,
          cta: campaignExec.email.cta || 'Jetzt entdecken',
          source_campaign_execution_id: execId
        };

        emailQueue.push(emailDraft);
        created.email_id = emailDraft.id;
      }

      // SOCIAL POSTS
      if (Array.isArray(campaignExec.social_posts)) {
        for (const post of campaignExec.social_posts) {
          const postDraft = {
            id: `post_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            topic: campaignExec.blog?.topic || 'campaign post',
            platform: post.platform || 'instagram',
            status: 'draft',
            caption: post.caption || '',
            cta: post.cta || 'Jetzt entdecken',
            hashtags: [
              buildProjectHashtag(campaignProject),
              '#MensGrooming',
              '#PremiumCare'
            ],
            hook_type: post.hook || 'campaign angle',
            visual_format: post.platform === 'instagram' ? 'feed post / reel support' : 'social post',
            aspect_ratio: post.platform === 'instagram' ? '4:5 or 9:16' : '1:1',
            overlay_text: `${campaignBrandName} | ${campaignExec.blog?.topic || 'campaign'}`,
            creative_prompt: `Create a premium ${post.platform} creative for ${campaignExec.blog?.topic || 'campaign'}, masculine luxury grooming style.`,
            video_brief: `Create short-form visual content for ${campaignExec.blog?.topic || 'campaign'} on ${post.platform}.`,
            source_campaign_execution_id: execId
          };

          postQueue.push(postDraft);
          created.social_post_ids.push(postDraft.id);
        }
      }

      // ADS
      if (Array.isArray(campaignExec.ads)) {
        for (const ad of campaignExec.ads) {
          const adDraft = {
            id: `ad_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            topic: campaignExec.blog?.topic || 'campaign ad',
            status: 'draft',
            campaign_type: 'meta',
            source_type: 'campaign_execution',
            source_id: execId,
            headline: ad.headline || '',
            primary_text: ad.primary_text || '',
            cta: ad.cta || 'Jetzt entdecken',
            audience_angle: 'campaign audience',
            offer_angle: 'premium routine + conversion',
            hero_image_url: '',
            created_at: new Date().toISOString()
          };

          adQueue.push(adDraft);
          created.ad_ids.push(adDraft.id);
        }
      }

      // REEL
      if (campaignExec.reel) {
        const reelBrief = {
          id: `reel_${Date.now() + 2}`,
          topic: campaignExec.blog?.topic || 'campaign reel',
          status: 'draft',
          platform: 'instagram_reel',
          hook: campaignExec.reel.hook || '',
          scene_plan: [
            'Hook in first 2 seconds',
            'Show product or grooming close-up',
            'Show transformation / stronger look',
            'End with CTA'
          ],
          on_screen_text: [
            'Premium Pflege',
            'Klarer Look',
            'Starker Auftritt'
          ],
          script: campaignExec.reel.script || '',
          cta: campaignExec.reel.cta || 'Jetzt starten',
          style: 'premium masculine short-form',
          created_at: new Date().toISOString(),
          source_campaign_execution_id: execId
        };

        reelQueue.push(reelBrief);
        created.reel_id = reelBrief.id;
      }

      fs.writeFileSync(blogQueuePath, JSON.stringify(blogQueue, null, 2), 'utf8');
      writeLiveEmailQueue(commandProject, emailQueue);
      fs.writeFileSync(postQueuePath, JSON.stringify(postQueue, null, 2), 'utf8');
      fs.writeFileSync(adQueuePath, JSON.stringify(adQueue, null, 2), 'utf8');
      fs.writeFileSync(reelQueuePath, JSON.stringify(reelQueue, null, 2), 'utf8');

      campaignExec.autogen_status = 'completed';
      campaignExec.autogen_created_assets = created;
      campaignExec.autogen_completed_at = new Date().toISOString();

      fs.writeFileSync(
        campaignOutputPath,
        JSON.stringify(campaignOutputQueue, null, 2),
        'utf8'
      );

      return res.json({
        command,
        result: {
          campaign_execution_id: execId,
          autogen_status: 'completed',
          created_assets: created
        }
      });
    }
    if (command === '/review_campaign_autogen') {
      const execId = args[0];

      if (!execId) {
        return res.json({ error: 'Missing campaign execution ID' });
      }

      const campaignOutputPath = path.join(
        EXECUTION_DIR,
        'campaign-output/campaign-output-queue.json'
      );

      const campaignOutputQueue = JSON.parse(fs.readFileSync(campaignOutputPath, 'utf8'));
      const campaignExec = campaignOutputQueue.find(x => x.id === execId);

      if (!campaignExec) {
        return res.json({ error: 'Campaign execution record not found' });
      }

      return res.json({
        command,
        result: {
          campaign_execution_id: execId,
          autogen_status: campaignExec.autogen_status || 'not_run',
          created_assets: campaignExec.autogen_created_assets || {},
          autogen_completed_at: campaignExec.autogen_completed_at || null
        }
      });
    }
    
    if (command === '/campaign_publish_blog') {
      const execId = args[0];

      if (!execId) {
        return res.json({ error: 'Missing campaign execution ID' });
      }

      const campaignOutputPath = path.join(
        EXECUTION_DIR,
        'campaign-output/campaign-output-queue.json'
      );

      const campaignOutputQueue = JSON.parse(fs.readFileSync(campaignOutputPath, 'utf8'));
      const campaignExec = campaignOutputQueue.find(x => x.id === execId);

      if (!campaignExec) {
        return res.json({ error: 'Campaign execution record not found' });
      }

      const blogId = campaignExec.autogen_created_assets?.blog_id;

      if (!blogId) {
        return res.json({ error: 'No generated blog asset linked to this campaign' });
      }

      try {
        const response = await axios.post(
          `http://localhost:${PORT}/publish-blog/${blogId}?project=${encodeURIComponent(commandProject)}`
        );

        campaignExec.controlled_publish = campaignExec.controlled_publish || {};
        campaignExec.controlled_publish.blog = {
          status: 'published',
          draft_id: blogId,
          result: response.data,
          published_at: new Date().toISOString()
        };

        fs.writeFileSync(
          campaignOutputPath,
          JSON.stringify(campaignOutputQueue, null, 2),
          'utf8'
        );

        return res.json({
          command,
          result: campaignExec.controlled_publish.blog
        });
      } catch (error) {
        return res.json({
          error: 'Campaign blog publish failed',
          details: sanitizeErrorPayloadForClient(error.response?.data || error.message)
        });
      }
    }

    if (command === '/campaign_send_email') {
      const execId = args[0];
      const toEmail = args[1];

      if (!execId || !toEmail) {
        return res.json({ error: 'Missing campaign execution ID or recipient email' });
      }

      const campaignOutputPath = path.join(
        EXECUTION_DIR,
        'campaign-output/campaign-output-queue.json'
      );

      const campaignOutputQueue = JSON.parse(fs.readFileSync(campaignOutputPath, 'utf8'));
      const campaignExec = campaignOutputQueue.find(x => x.id === execId);

      if (!campaignExec) {
        return res.json({ error: 'Campaign execution record not found' });
      }

      const emailId = campaignExec.autogen_created_assets?.email_id;

      if (!emailId) {
        return res.json({ error: 'No generated email asset linked to this campaign' });
      }

      try {
        const response = await axios.post(
          `http://localhost:${PORT}/telegram-command`,
          {
            project: commandProject,
            text: `/send_email_draft ${emailId} ${toEmail}`
          }
        );

        campaignExec.controlled_publish = campaignExec.controlled_publish || {};
        campaignExec.controlled_publish.email = {
          status: 'sent',
          draft_id: emailId,
          recipient: toEmail,
          result: response.data,
          sent_at: new Date().toISOString()
        };

        fs.writeFileSync(
          campaignOutputPath,
          JSON.stringify(campaignOutputQueue, null, 2),
          'utf8'
        );

        return res.json({
          command,
          result: campaignExec.controlled_publish.email
        });
      } catch (error) {
        return res.json({
          error: 'Campaign email send failed',
          details: sanitizeErrorPayloadForClient(error.response?.data || error.message)
        });
      }
    }

    if (command === '/campaign_review_publish_state') {
      const execId = args[0];

      if (!execId) {
        return res.json({ error: 'Missing campaign execution ID' });
      }

      const campaignOutputPath = path.join(
        EXECUTION_DIR,
        'campaign-output/campaign-output-queue.json'
      );

      const campaignOutputQueue = JSON.parse(fs.readFileSync(campaignOutputPath, 'utf8'));
      const campaignExec = campaignOutputQueue.find(x => x.id === execId);

      if (!campaignExec) {
        return res.json({ error: 'Campaign execution record not found' });
      }

      return res.json({
        command,
        result: {
          campaign_execution_id: execId,
          autogen_status: campaignExec.autogen_status || 'not_run',
          created_assets: campaignExec.autogen_created_assets || {},
          controlled_publish: campaignExec.controlled_publish || {},
          status_summary: {
            blog: campaignExec.controlled_publish?.blog?.status || 'not_published',
            email: campaignExec.controlled_publish?.email?.status || 'not_sent'
          }
        }
      });
    }
    if (command === '/init_brand_assets') {
      const projectName = (args[0] || '').trim().toLowerCase();

      if (!projectName) {
        return res.json({ error: 'Missing project name' });
      }

      const resolution = unifiedDataPathResolver.resolve(projectName, {
        domain: 'brand-profile',
        operation: 'write'
      });
      const brandDir = resolution.activeWritePath;

      fs.mkdirSync(path.join(brandDir, 'logo'), { recursive: true });
      fs.mkdirSync(path.join(brandDir, 'products'), { recursive: true });
      fs.mkdirSync(path.join(brandDir, 'packaging'), { recursive: true });
      fs.mkdirSync(path.join(brandDir, 'references'), { recursive: true });
      fs.mkdirSync(path.join(brandDir, 'video'), { recursive: true });

      const profilePath = path.join(brandDir, 'brand-profile.json');

      const brandProfile = {
        project_id: projectName,
        status: 'active',
        logo_files: [],
        product_assets: [],
        packaging_assets: [],
        reference_assets: [],
        video_assets: [],
        brand_colors: {
          primary: '#000000',
          secondary: '#D4AF37',
          background: '#FFFFFF'
        },
        typography: {
          primary_style: 'clean premium sans-serif',
          secondary_style: 'luxury editorial'
        },
        visual_rules: {
          mood: 'premium masculine',
          lighting: 'high contrast clean',
          allowed_backgrounds: [
            'black luxury studio',
            'modern barbershop',
            'minimal premium neutral'
          ],
          forbidden: [
            'fake product labels',
            'random logo generation',
            'wrong packaging redesign',
            'cartoonish styling'
          ]
        },
        prompt_constraints: {
          use_real_logo_only: true,
          use_real_product_only: true,
          do_not_change_packaging: true,
          do_not_invent_brand_elements: true
        },
        created_at: new Date().toISOString()
      };

      fs.writeFileSync(profilePath, JSON.stringify(brandProfile, null, 2), 'utf8');

      return res.json({
        command,
        result: brandProfile
      });
    }

    if (command === '/review_brand_assets') {
      const projectName = (args[0] || '').trim().toLowerCase();

      if (!projectName) {
        return res.json({ error: 'Missing project name' });
      }

      const resolution = unifiedDataPathResolver.resolve(projectName, {
        domain: 'brand-profile',
        operation: 'read'
      });
      const profilePath = path.join(resolution.activeReadPath, 'brand-profile.json');

      if (!fs.existsSync(profilePath)) {
        return res.json({ error: 'Brand profile not found' });
      }

      const brandProfile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));

      return res.json({
        command,
        result: brandProfile
      });
    }

    if (command === '/set_brand_rules') {
      const projectName = (args[0] || '').trim().toLowerCase();

      if (!projectName) {
        return res.json({ error: 'Missing project name' });
      }

      const resolution = unifiedDataPathResolver.resolve(projectName, {
        domain: 'brand-profile',
        operation: 'write'
      });
      const profilePath = path.join(resolution.activeWritePath, 'brand-profile.json');

      if (!fs.existsSync(profilePath)) {
        return res.json({ error: 'Brand profile not found' });
      }

      const brandProfile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));

      brandProfile.prompt_constraints = {
        use_real_logo_only: true,
        use_real_product_only: true,
        do_not_change_packaging: true,
        do_not_invent_brand_elements: true,
        enforce_brand_guidelines_strict: true
      };

      brandProfile.visual_rules = {
        ...brandProfile.visual_rules,
        approved_style_only: true,
        enforce_real_product_visibility: true,
        no_generic_ai_packaging: true
      };

      brandProfile.rules_updated_at = new Date().toISOString();

      fs.writeFileSync(profilePath, JSON.stringify(brandProfile, null, 2), 'utf8');

      return res.json({
        command,
        result: brandProfile
      });
    }

    if (command === '/register_product_asset') {
      const projectName = (args[0] || '').trim().toLowerCase();
      const productSlug = (args[1] || '').trim().toLowerCase();

      if (!projectName || !productSlug) {
        return res.json({ error: 'Missing project name or product slug' });
      }

      const resolution = unifiedDataPathResolver.resolve(projectName, {
        domain: 'brand-profile',
        operation: 'write'
      });
      const profilePath = path.join(resolution.activeWritePath, 'brand-profile.json');

      if (!fs.existsSync(profilePath)) {
        return res.json({ error: 'Brand profile not found' });
      }

      const brandProfile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));

      const assetRecord = {
        product_slug: productSlug,
        asset_path: path.join(resolution.activeWritePath, 'products', `${productSlug}.png`),
        packaging_path: path.join(resolution.activeWritePath, 'packaging', `${productSlug}-packaging.png`),
        approved_for_ai_composition: true,
        use_as_source_of_truth: true,
        created_at: new Date().toISOString()
      };

      brandProfile.product_assets = brandProfile.product_assets || [];
      brandProfile.product_assets.push(assetRecord);

      fs.writeFileSync(profilePath, JSON.stringify(brandProfile, null, 2), 'utf8');

      return res.json({
        command,
        result: assetRecord
      });
    }


    if (command === '/import_wc_product_media') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const productSlug = (args[1] || '').trim().toLowerCase();

  if (!projectName || !productSlug) {
    return res.json({ error: 'Missing project name or product slug' });
  }

  const paths = getProjectBrandPaths(projectName);
  ensureJsonFile(paths.registryPath, []);
  ensureJsonFile(paths.brandProfilePath, {});

  const brandProfile = readJsonFile(paths.brandProfilePath, {});
  const registry = readJsonFile(paths.registryPath, []);

  if (!process.env.WC_BASE_URL || !process.env.WC_KEY || !process.env.WC_SECRET) {
    return res.json({ error: 'WooCommerce environment variables are missing' });
  }

  try {
    const response = await axios.get(
      `${process.env.WC_BASE_URL}/products`,
      {
        auth: {
          username: process.env.WC_KEY,
          password: process.env.WC_SECRET
        },
        params: { slug: productSlug }
      }
    );

    const product = response.data?.[0];

    if (!product) {
      return res.json({ error: 'WooCommerce product not found by slug' });
    }

    const wcImages = Array.isArray(product.images) ? product.images : [];

    if (!wcImages.length) {
      return res.json({
        error: 'WooCommerce product found but has no images'
      });
    }

    const newAssets = [];
    const existingKeys = new Set(
      registry.map(item => `${item.source_type}|${item.product_slug || ''}|${item.source_url || ''}`)
    );

    for (const img of wcImages) {
      const sourceUrl = String(img?.src || '').trim();
      if (!sourceUrl) continue;

      const dedupeKey = `woocommerce|${product.slug}|${sourceUrl}`;
      if (existingKeys.has(dedupeKey)) continue;

      newAssets.push({
        id: `wc_${product.id}_${img.id || Date.now()}`,
        project_id: projectName,
        source_type: 'woocommerce',
        asset_role: 'product_source',
        product_id: product.id,
        product_slug: product.slug,
        product_name: product.name,
        source_url: sourceUrl,
        wc_image_id: img.id || null,
        use_as_source_of_truth: true,
        use_as_reference_only: false,
        status: 'active',
        created_at: new Date().toISOString()
      });

      existingKeys.add(dedupeKey);
    }

    registry.push(...newAssets);

    brandProfile.product_assets = Array.isArray(brandProfile.product_assets)
      ? brandProfile.product_assets
      : [];

    const existingProductAssetIndex = brandProfile.product_assets.findIndex(
      x => x.product_slug === product.slug
    );

    const productAssetRecord = {
      product_slug: product.slug,
      product_name: product.name,
      product_id: product.id,
      imported_from: 'woocommerce',
      image_count: wcImages.length,
      source_of_truth_urls: wcImages.map(x => x.src).filter(Boolean),
      approved_for_ai_composition: true,
      use_as_source_of_truth: true,
      imported_at: new Date().toISOString()
    };

    if (existingProductAssetIndex >= 0) {
      brandProfile.product_assets[existingProductAssetIndex] = productAssetRecord;
    } else {
      brandProfile.product_assets.push(productAssetRecord);
    }

    writeJsonFile(paths.registryPath, registry);
    writeJsonFile(paths.brandProfilePath, brandProfile);

    return res.json({
      command,
      result: {
        project_id: projectName,
        product_slug: product.slug,
        product_name: product.name,
        total_wc_images: wcImages.length,
        newly_registered_assets: newAssets.length,
        source_urls: wcImages.map(x => x.src).filter(Boolean)
      }
    });
  } catch (error) {
    return res.json({
      error: 'WooCommerce media import failed',
      details: sanitizeErrorPayloadForClient(error.response?.data || error.message)
    });
  }
}
if (command === '/register_local_brand_file') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const rawAssetType = (args[1] || '').trim().toLowerCase();
  const filename = args.slice(2).join(' ').trim();

  if (!projectName || !rawAssetType || !filename) {
    return res.json({ error: 'Missing project name, asset type, or filename' });
  }

  const assetRole = normalizeAssetRole(rawAssetType);
  if (!assetRole) {
    return res.json({
      error: 'Invalid asset type. Allowed: product, logo, packaging, reference, video'
    });
  }

  const paths = getProjectBrandPaths(projectName);
  ensureJsonFile(paths.registryPath, []);
  const registry = readJsonFile(paths.registryPath, []);

  const assetDir = getAssetDirByRole(paths, assetRole);
  ensureDir(assetDir);

  const absolutePath = path.join(assetDir, filename);

  if (!fs.existsSync(absolutePath)) {
    return res.json({
      error: 'Local file not found',
      expected_path: absolutePath
    });
  }

  const existing = registry.find(
    item =>
      item.source_type === 'local_file' &&
      item.asset_role === assetRole &&
      item.local_path === absolutePath
  );

  if (existing) {
    return res.json({
      command,
      result: {
        message: 'Asset already registered',
        asset: existing
      }
    });
  }

  const assetRecord = {
    id: `local_${Date.now()}`,
    project_id: projectName,
    source_type: 'local_file',
    asset_role: assetRole,
    filename,
    local_path: absolutePath,
    use_as_source_of_truth: assetRole !== 'reference_source',
    use_as_reference_only: assetRole === 'reference_source',
    status: 'active',
    created_at: new Date().toISOString()
  };

  registry.push(assetRecord);
  writeJsonFile(paths.registryPath, registry);

  return res.json({
    command,
    result: assetRecord
  });
}
if (command === '/register_reference_link') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const rawType = (args[1] || '').trim().toLowerCase();
  const url = args.slice(2).join(' ').trim();

  if (!projectName || !rawType || !url) {
    return res.json({ error: 'Missing project name, reference type, or URL' });
  }

  const assetRole = normalizeAssetRole(rawType);
  if (!assetRole) {
    return res.json({
      error: 'Invalid type. Allowed: reference, video, product, logo, packaging'
    });
  }

  const paths = getProjectBrandPaths(projectName);
  ensureJsonFile(paths.registryPath, []);
  const registry = readJsonFile(paths.registryPath, []);

  const existing = registry.find(
    item =>
      item.source_type === 'reference_link' &&
      item.asset_role === assetRole &&
      item.source_url === url
  );

  if (existing) {
    return res.json({
      command,
      result: {
        message: 'Reference already registered',
        asset: existing
      }
    });
  }

  const isReferenceOnly = assetRole === 'reference_source' || assetRole === 'video_source';

  const assetRecord = {
    id: `ref_${Date.now()}`,
    project_id: projectName,
    source_type: 'reference_link',
    asset_role: assetRole,
    source_url: url,
    use_as_source_of_truth: false,
    use_as_reference_only: isReferenceOnly,
    status: 'active',
    created_at: new Date().toISOString()
  };

  registry.push(assetRecord);
  writeJsonFile(paths.registryPath, registry);

  return res.json({
    command,
    result: assetRecord
  });
}
if (command === '/review_media_inputs') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  const paths = getProjectBrandPaths(projectName);
  ensureJsonFile(paths.registryPath, []);
  const registry = readJsonFile(paths.registryPath, []);

  const summary = {
    total_assets: registry.length,
    by_source_type: {},
    by_asset_role: {},
    source_of_truth_assets: 0,
    reference_only_assets: 0
  };

  for (const item of registry) {
    summary.by_source_type[item.source_type] =
      (summary.by_source_type[item.source_type] || 0) + 1;

    summary.by_asset_role[item.asset_role] =
      (summary.by_asset_role[item.asset_role] || 0) + 1;

    if (item.use_as_source_of_truth) summary.source_of_truth_assets += 1;
    if (item.use_as_reference_only) summary.reference_only_assets += 1;
  }

  return res.json({
    command,
    result: {
      project_id: projectName,
      summary,
      assets: registry
    }
  });
}

if (command === '/build_prompt_engine_context') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const context = buildPromptEngineContext(projectName);
    return res.json({
      command,
      result: context
    });
  } catch (error) {
    return res.json({
      error: 'Failed to build prompt engine context',
      details: error.message
    });
  }
}
if (command === '/review_prompt_guardrails') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const context = buildPromptEngineContext(projectName);

    return res.json({
      command,
      result: {
        project: projectName,
        readiness: context.readiness,
        guardrails: context.guardrails,
        source_of_truth: {
          logo: context.source_of_truth.logo
            ? (context.source_of_truth.logo.filename || context.source_of_truth.logo.local_path)
            : null,
          product: context.source_of_truth.product
            ? (context.source_of_truth.product.filename || context.source_of_truth.product.local_path)
            : null,
          packaging: context.source_of_truth.packaging
            ? (context.source_of_truth.packaging.filename || context.source_of_truth.packaging.local_path)
            : null,
          references: context.source_of_truth.references.length
        }
      }
    });
  } catch (error) {
    return res.json({
      error: 'Failed to review prompt guardrails',
      details: error.message
    });
  }
}
if (command === '/generate_brand_controlled_prompt') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const assetType = (args[1] || '').trim().toLowerCase();
  const goal = args.slice(2).join(' ').trim();

  if (!projectName || !assetType || !goal) {
    return res.json({ error: 'Missing project name, asset type, or goal' });
  }

  try {
    const result = generateBrandControlledPrompt(projectName, assetType, goal);
    return res.json({
      command,
      result
    });
  } catch (error) {
    return res.json({
      error: 'Failed to generate brand controlled prompt',
      details: error.message
    });
  }
}

if (command === '/evaluate_execution_readiness') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const assetType = (args[1] || '').trim().toLowerCase();

  if (!projectName || !assetType) {
    return res.json({ error: 'Missing project name or asset type' });
  }

  try {
    const result = evaluateExecutionReadiness(projectName, assetType);
    return res.json({
      command,
      result
    });
  } catch (error) {
    return res.json({
      error: 'Failed to evaluate execution readiness',
      details: error.message
    });
  }
}

if (command === '/build_execution_package') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const assetType = (args[1] || '').trim().toLowerCase();
  const goal = args.slice(2).join(' ').trim();

  if (!projectName || !assetType || !goal) {
    return res.json({ error: 'Missing project name, asset type, or goal' });
  }

  try {
    const result = buildExecutionPackage(projectName, assetType, goal);
    return res.json({
      command,
      result
    });
  } catch (error) {
    return res.json({
      error: 'Failed to build execution package',
      details: error.message
    });
  }
}
if (command === '/review_execution_package') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const paths = getProjectBrandPaths(projectName);
    const packagePath = path.join(paths.baseDir, 'execution-package.json');

    if (!fs.existsSync(packagePath)) {
      return res.json({ error: 'Execution package not found' });
    }

    const data = readJsonFile(packagePath, {});
    return res.json({
      command,
      result: data
    });
  } catch (error) {
    return res.json({
      error: 'Failed to review execution package',
      details: error.message
    });
  }
}
if (command === '/generate_ad_visual') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const goal = args.slice(1).join(' ').trim();

  if (!projectName || !goal) {
    return res.json({ error: 'Missing project name or goal' });
  }

  try {
    const result = buildGenerationJob(projectName, 'ad', goal);
    return res.json({
      command,
      result
    });
  } catch (error) {
    return res.json({
      error: 'Failed to generate ad visual job',
      details: error.message
    });
  }
}
if (command === '/generate_email_hero') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const goal = args.slice(1).join(' ').trim();

  if (!projectName || !goal) {
    return res.json({ error: 'Missing project name or goal' });
  }

  try {
    const result = buildGenerationJob(projectName, 'email_hero', goal);
    return res.json({
      command,
      result
    });
  } catch (error) {
    return res.json({
      error: 'Failed to generate email hero job',
      details: error.message
    });
  }
}
if (command === '/generate_blog_visual') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const goal = args.slice(1).join(' ').trim();

  if (!projectName || !goal) {
    return res.json({ error: 'Missing project name or goal' });
  }

  try {
    const result = buildGenerationJob(projectName, 'blog_visual', goal);
    return res.json({
      command,
      result
    });
  } catch (error) {
    return res.json({
      error: 'Failed to generate blog visual job',
      details: error.message
    });
  }
}
if (command === '/review_generation_job') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const outputPaths = getGenerationOutputPaths(projectName);
    const files = fs.readdirSync(outputPaths.jobsDir)
      .filter(name => name.endsWith('.json'))
      .sort()
      .reverse();

    if (!files.length) {
      return res.json({ error: 'No generation jobs found' });
    }

    const latestPath = path.join(outputPaths.jobsDir, files[0]);
    const data = readJsonFile(latestPath, {});

    return res.json({
      command,
      result: data
    });
  } catch (error) {
    return res.json({
      error: 'Failed to review generation job',
      details: error.message
    });
  }
}
if (command === '/build_render_request') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const result = buildRenderRequest(projectName);
    return res.json({
      command,
      result
    });
  } catch (error) {
    return res.json({
      error: 'Failed to build render request',
      details: error.message
    });
  }
}
if (command === '/review_render_request') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const result = reviewLatestRenderRequest(projectName);
    return res.json({
      command,
      result
    });
  } catch (error) {
    return res.json({
      error: 'Failed to review render request',
      details: error.message
    });
  }
}
if (command === '/mark_render_result') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const renderId = (args[1] || '').trim();
  const status = (args[2] || '').trim().toLowerCase();
  const outputPath = args.slice(3).join(' ').trim();

  if (!projectName || !renderId || !status) {
    return res.json({ error: 'Missing project name, render id, or status' });
  }

  try {
    const result = markRenderResult(projectName, renderId, status, {
      output_path: outputPath || null
    });

    return res.json({
      command,
      result
    });
  } catch (error) {
    return res.json({
      error: 'Failed to mark render result',
      details: error.message
    });
  }
}
if (command === '/render_generation_job') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const result = await executeProviderRender(projectName);

    return res.json({
      command,
      result
    });
  } catch (error) {
    return res.json({
      error: 'Render execution failed',
      details: sanitizeErrorPayloadForClient(error.response?.data || error.message)
    });
  }
}
if (command === '/evaluate_email_readiness') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const result = evaluateEmailReadiness(projectName);
    return res.json({
      command,
      result
    });
  } catch (error) {
    return res.json({
      error: 'Failed to evaluate email readiness',
      details: error.message
    });
  }
}
if (command === '/auto_prepare_email_asset') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const rawText = text;
    const result = autoPrepareEmailAsset(projectName, rawText);

    return res.json({
      command,
      result
    });
  } catch (error) {
    return res.json({
      error: 'Failed to auto prepare email asset',
      details: error.message
    });
  }
}
if (command === '/review_email_prepare_package') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const result = reviewEmailPreparePackage(projectName);
    return res.json({
      command,
      result
    });
  } catch (error) {
    return res.json({
      error: 'Failed to review email prepare package',
      details: error.message
    });
  }
}
if (command === '/validate_email_prepare_package') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const result = reviewEmailPreparePackage(projectName);
    return res.json({
      command,
      result: {
        project: projectName,
        status: result.status,
        validation: result.validation || null,
        html_path: result.html_path || null,
        public_image_url: result.public_image_url || null
      }
    });
  } catch (error) {
    return res.json({
      error: 'Failed to validate email prepare package',
      details: error.message
    });
  }
}
if (command === '/evaluate_prepared_email_for_send') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const result = evaluatePreparedEmailForSend(projectName);
    return res.json({
      command,
      result
    });
  } catch (error) {
    return res.json({
      error: 'Failed to evaluate prepared email for send',
      details: error.message
    });
  }
}
if (command === '/send_prepared_email') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const toEmail = (args[1] || '').trim();

  if (!projectName || !toEmail) {
    return res.json({ error: 'Missing project name or recipient email' });
  }

  try {
    const result = await sendPreparedEmail(projectName, toEmail);
    return res.json({
      command,
      result
    });
  } catch (error) {
    return res.json({
      error: 'Failed to send prepared email',
      details: error.message
    });
  }
}
if (command === '/review_email_delivery') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const deliveryDir = resolveEmailReadCandidate({
      projectName,
      artifactType: EMAIL_ARTIFACT_TYPES.DELIVERY_RECORD,
      matcher: /\.json$/i,
      requestedIdentifier: 'latest-email-delivery',
      requestedFile: 'email/delivery/*.json'
    }).selectedPath;

    const files = fs.readdirSync(deliveryDir)
      .filter(name => name.endsWith('.json'))
      .sort()
      .reverse();

    if (!files.length) {
      return res.json({ error: 'No email delivery records found' });
    }

    const latestPath = path.join(deliveryDir, files[0]);
    const result = readJsonFile(latestPath, {});

    return res.json({
      command,
      result
    });
  } catch (error) {
    return res.json({
      error: 'Failed to review email delivery',
      details: error.message
    });
  }
}
if (command === '/generate_meta_package') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const placement = (args[1] || '').trim().toLowerCase();
  const goal = args.slice(2).join(' ').trim();

  if (!projectName || !placement || !goal) {
    return res.json({ error: 'Missing project name, placement, or goal' });
  }

  try {
    const result = buildMetaPackage(projectName, placement, goal);
    return res.json({
      command,
      result
    });
  } catch (error) {
    return res.json({
      error: 'Failed to generate Meta package',
      details: error.message
    });
  }
}

if (command === '/review_meta_package') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const result = reviewLatestMetaPackage(projectName);
    return res.json({
      command,
      result
    });
  } catch (error) {
    return res.json({
      error: 'Failed to review Meta package',
      details: error.message
    });
  }
}
if (command === '/generate_tiktok_package') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const goal = args.slice(1).join(' ').trim();

  if (!projectName || !goal) {
    return res.json({ error: 'Missing project name or goal' });
  }

  try {
    const result = buildTikTokPackage(projectName, goal);
    return res.json({ command, result });
  } catch (error) {
    return res.json({
      error: 'Failed to generate TikTok package',
      details: error.message
    });
  }
}

if (command === '/review_tiktok_package') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const result = reviewLatestTikTokPackage(projectName);
    return res.json({ command, result });
  } catch (error) {
    return res.json({
      error: 'Failed to review TikTok package',
      details: error.message
    });
  }
}

if (command === '/generate_youtube_package') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const format = (args[1] || '').trim().toLowerCase();
  const goal = args.slice(2).join(' ').trim();

  if (!projectName || !format || !goal) {
    return res.json({ error: 'Missing project name, format, or goal' });
  }

  try {
    const result = buildYouTubePackage(projectName, format, goal);
    return res.json({ command, result });
  } catch (error) {
    return res.json({
      error: 'Failed to generate YouTube package',
      details: error.message
    });
  }
}

if (command === '/review_youtube_package') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const result = reviewLatestYouTubePackage(projectName);
    return res.json({ command, result });
  } catch (error) {
    return res.json({
      error: 'Failed to review YouTube package',
      details: error.message
    });
  }
}
if (command === '/generate_marketplace_package') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const marketplace = (args[1] || '').trim().toLowerCase();
  const goal = args.slice(2).join(' ').trim();

  if (!projectName || !marketplace || !goal) {
    return res.json({ error: 'Missing project name, marketplace, or goal' });
  }

  try {
    const result = buildMarketplacePackage(projectName, marketplace, goal);
    return res.json({
      command,
      result
    });
  } catch (error) {
    return res.json({
      error: 'Failed to generate marketplace package',
      details: error.message
    });
  }
}

if (command === '/review_marketplace_package') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const marketplace = (args[1] || '').trim().toLowerCase();

  if (!projectName || !marketplace) {
    return res.json({ error: 'Missing project name or marketplace' });
  }

  try {
    const result = reviewLatestMarketplacePackage(projectName, marketplace);
    return res.json({
      command,
      result
    });
  } catch (error) {
    return res.json({
      error: 'Failed to review marketplace package',
      details: error.message
    });
  }
}
if (command === '/review_asset_fidelity') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const renderRequest = getLatestRenderRequest(projectName);
    const result = buildAssetFidelityRules(
      renderRequest.source_of_truth || {},
      renderRequest.goal || ''
    );

    return res.json({
      command,
      result
    });
  } catch (error) {
    return res.json({
      error: 'Failed to review asset fidelity',
      details: error.message
    });
  }
}
if (command === '/init_product_intelligence') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const result = getProductIntelligencePaths(projectName);
    return res.json({
      command,
      result: {
        project: projectName,
        products_path: result.productsPath,
        status: 'initialized'
      }
    });
  } catch (error) {
    return res.json({
      error: 'Failed to initialize product intelligence',
      details: error.message
    });
  }
}

if (command === '/sync_wc_product_intelligence') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const productSlug = (args[1] || '').trim().toLowerCase();

  if (!projectName || !productSlug) {
    return res.json({ error: 'Missing project name or product slug' });
  }

  try {
    const response = await axios.get(
      `${process.env.WC_BASE_URL}/products`,
      {
        auth: {
          username: process.env.WC_KEY,
          password: process.env.WC_SECRET
        },
        params: {
          slug: productSlug
        }
      }
    );

    const product = response.data?.[0];

    if (!product) {
      return res.json({ error: 'WooCommerce product not found by slug' });
    }

    const record = buildProductIntelligenceRecordFromWoo(product);
    upsertProductIntelligenceRecord(projectName, record);

    return res.json({
      command,
      result: {
        project: projectName,
        product_slug: record.product_slug,
        product_name: record.product_name,
        category: record.category,
        line: record.line,
        size: record.size,
        status: 'synced'
      }
    });
  } catch (error) {
    return res.json({
      error: 'Failed to sync WooCommerce product intelligence',
      details: sanitizeErrorPayloadForClient(error.response?.data || error.message)
    });
  }
}

if (command === '/review_product_intelligence') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const productSlug = (args[1] || '').trim().toLowerCase();

  if (!projectName || !productSlug) {
    return res.json({ error: 'Missing project name or product slug' });
  }

  try {
    const result = reviewProductIntelligence(projectName, productSlug);
    return res.json({
      command,
      result
    });
  } catch (error) {
    return res.json({
      error: 'Failed to review product intelligence',
      details: error.message
    });
  }
}

if (command === '/list_product_intelligence') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const result = listProductIntelligence(projectName);
    return res.json({
      command,
      result: {
        project: projectName,
        total_products: result.length,
        products: result.map(x => ({
          product_id: x.product_id,
          product_slug: x.product_slug,
          product_name: x.product_name,
          category: x.category,
          line: x.line,
          size: x.size
        }))
      }
    });
  } catch (error) {
    return res.json({
      error: 'Failed to list product intelligence',
      details: error.message
    });
  }
}
if (command === '/list_wc_products') {
  const page = Number(args[0] || 1);
  const perPage = Number(args[1] || 10);

  try {
    const products = await fetchWooProductsPage(page, perPage);

    return res.json({
      command,
      result: {
        page,
        per_page: perPage,
        total_returned: products.length,
        products: products.map(mapWooProductSummary)
      }
    });
  } catch (error) {
    return res.json({
      error: 'Failed to list WooCommerce products',
      details: error.message
    });
  }
}

if (command === '/read_wc_product') {
  const productSlug = (args[0] || '').trim().toLowerCase();

  if (!productSlug) {
    return res.json({ error: 'Missing product slug' });
  }

  try {
    const product = await fetchWooProductBySlug(productSlug);

    if (!product) {
      return res.json({ error: 'WooCommerce product not found by slug' });
    }

    return res.json({
      command,
      result: mapWooProductFull(product)
    });
  } catch (error) {
    return res.json({
      error: 'Failed to read WooCommerce product',
      details: error.message
    });
  }
}

if (command === '/sync_all_wc_products') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const result = await syncAllWooProducts(projectName);
    return res.json({
      command,
      result
    });
  } catch (error) {
    return res.json({
      error: 'Failed to sync all WooCommerce products',
      details: error.message
    });
  }
}

if (command === '/review_wc_sync_summary') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const result = buildWcSyncSummary(projectName);
    return res.json({
      command,
      result
    });
  } catch (error) {
    return res.json({
      error: 'Failed to review WooCommerce sync summary',
      details: error.message
    });
  }
}

if (command === '/enrich_product_intelligence') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const slug = (args[1] || '').trim().toLowerCase();

  if (!projectName || !slug) {
    return res.json({ error: 'Missing project or product slug' });
  }

  try {
    const paths = getProductIntelligencePaths(projectName);
    const products = readJsonFile(paths.productsPath, []);

    const product = products.find(
      p => String(p.product_slug || '').toLowerCase() === slug
    );

    if (!product) {
      return res.json({ error: 'Product not found in intelligence registry' });
    }

    const enrichment = enrichProductIntelligenceData(product);

    product.marketing_intelligence = {
      ...(product.marketing_intelligence || {}),
      ...enrichment
    };

    writeJsonFile(paths.productsPath, products);

    return res.json({
      command,
      result: {
        project: projectName,
        product_slug: slug,
        enrichment
      }
    });
  } catch (error) {
    return res.json({
      error: 'Failed to enrich product intelligence',
      details: error.message
    });
  }
}

if (command === '/bulk_enrich_product_intelligence') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const paths = getProductIntelligencePaths(projectName);
    const products = readJsonFile(paths.productsPath, []);

    let count = 0;

    for (const product of products) {
      const enrichment = enrichProductIntelligenceData(product);

      product.marketing_intelligence = {
        ...(product.marketing_intelligence || {}),
        ...enrichment
      };

      count += 1;
    }

    writeJsonFile(paths.productsPath, products);

    return res.json({
      command,
      result: {
        project: projectName,
        enriched_products: count
      }
    });
  } catch (error) {
    return res.json({
      error: 'Failed bulk enrichment',
      details: error.message
    });
  }
}
if (command === '/build_product_creative_map') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const slug = (args[1] || '').trim().toLowerCase();

  if (!projectName || !slug) {
    return res.json({ error: 'Missing project or product slug' });
  }

  try {
    const paths = getProductIntelligencePaths(projectName);
    const products = readJsonFile(paths.productsPath, []);

    const product = products.find(
      p => String(p.product_slug || '').toLowerCase() === slug
    );

    if (!product) {
      return res.json({ error: 'Product not found in intelligence registry' });
    }

    const creativeMap = buildCreativeMap(product);
    product.creative_map = creativeMap;
    product.updated_at = new Date().toISOString();

    writeJsonFile(paths.productsPath, products);

    return res.json({
      command,
      result: {
        project: projectName,
        product_slug: slug,
        creative_map: creativeMap
      }
    });
  } catch (error) {
    return res.json({
      error: 'Failed to build product creative map',
      details: error.message
    });
  }
}
if (command === '/bulk_build_creative_maps') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const paths = getProductIntelligencePaths(projectName);
    const products = readJsonFile(paths.productsPath, []);

    let count = 0;

    for (const product of products) {
      product.creative_map = buildCreativeMap(product);
      product.updated_at = new Date().toISOString();
      count += 1;
    }

    writeJsonFile(paths.productsPath, products);

    return res.json({
      command,
      result: {
        project: projectName,
        creative_maps_built: count
      }
    });
  } catch (error) {
    return res.json({
      error: 'Failed to bulk build creative maps',
      details: error.message
    });
  }
}
if (command === '/review_product_creative_map') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const slug = (args[1] || '').trim().toLowerCase();

  if (!projectName || !slug) {
    return res.json({ error: 'Missing project or product slug' });
  }

  try {
    const product = reviewProductIntelligence(projectName, slug);

    return res.json({
      command,
      result: {
        project: projectName,
        product_slug: slug,
        product_name: product.product_name,
        creative_map: product.creative_map || null
      }
    });
  } catch (error) {
    return res.json({
      error: 'Failed to review product creative map',
      details: error.message
    });
  }
}
if (command === '/build_product_prompt_pack') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const slug = (args[1] || '').trim().toLowerCase();

  if (!projectName || !slug) {
    return res.json({ error: 'Missing project or product slug' });
  }

  try {
    const paths = getProductIntelligencePaths(projectName);
    const products = readJsonFile(paths.productsPath, []);

    const product = products.find(
      p => String(p.product_slug || '').toLowerCase() === slug
    );

    if (!product) {
      return res.json({ error: 'Product not found in intelligence registry' });
    }

    const promptPack = buildProductPromptPack(product);
    product.prompt_pack = promptPack;
    product.updated_at = new Date().toISOString();

    writeJsonFile(paths.productsPath, products);

    return res.json({
      command,
      result: {
        project: projectName,
        product_slug: slug,
        prompt_pack: promptPack
      }
    });
  } catch (error) {
    return res.json({
      error: 'Failed to build product prompt pack',
      details: error.message
    });
  }
}
if (command === '/bulk_build_product_prompt_packs') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const paths = getProductIntelligencePaths(projectName);
    const products = readJsonFile(paths.productsPath, []);

    let count = 0;

    for (const product of products) {
      product.prompt_pack = buildProductPromptPack(product);
      product.updated_at = new Date().toISOString();
      count += 1;
    }

    writeJsonFile(paths.productsPath, products);

    return res.json({
      command,
      result: {
        project: projectName,
        prompt_packs_built: count
      }
    });
  } catch (error) {
    return res.json({
      error: 'Failed to bulk build product prompt packs',
      details: error.message
    });
  }
}
if (command === '/review_product_prompt_pack') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const slug = (args[1] || '').trim().toLowerCase();

  if (!projectName || !slug) {
    return res.json({ error: 'Missing project or product slug' });
  }

  try {
    const product = reviewProductIntelligence(projectName, slug);

    return res.json({
      command,
      result: {
        project: projectName,
        product_slug: slug,
        product_name: product.product_name,
        prompt_pack: product.prompt_pack || null
      }
    });
  } catch (error) {
    return res.json({
      error: 'Failed to review product prompt pack',
      details: error.message
    });
  }
}
if (command === '/build_product_channel_pack') {
  const project = (args[0] || '').toLowerCase();
  const slug = (args[1] || '').toLowerCase();

  if (!project || !slug) {
    return res.json({ error: 'Missing project or slug' });
  }

  try {
    const paths = getProductIntelligencePaths(project);
    const products = readJsonFile(paths.productsPath, []);

    const p = products.find(x => x.product_slug === slug);
    if (!p) return res.json({ error: 'Product not found' });

    p.channel_pack = buildChannelPack(p);
    p.updated_at = new Date().toISOString();

    writeJsonFile(paths.productsPath, products);

    return res.json({
      command,
      result: {
        product_slug: slug,
        channel_pack: p.channel_pack
      }
    });
  } catch (e) {
    return res.json({ error: 'Failed', details: e.message });
  }
}
if (command === '/bulk_build_channel_packs') {
  const project = (args[0] || '').toLowerCase();

  if (!project) return res.json({ error: 'Missing project' });

  try {
    const paths = getProductIntelligencePaths(project);
    const products = readJsonFile(paths.productsPath, []);

    let count = 0;

    for (const p of products) {
      p.channel_pack = buildChannelPack(p);
      p.updated_at = new Date().toISOString();
      count++;
    }

    writeJsonFile(paths.productsPath, products);

    return res.json({
      command,
      result: {
        project,
        channel_packs_built: count
      }
    });
  } catch (e) {
    return res.json({ error: 'Failed bulk', details: e.message });
  }
}
if (command === '/review_product_channel_pack') {
  const project = (args[0] || '').toLowerCase();
  const slug = (args[1] || '').toLowerCase();

  if (!project || !slug) {
    return res.json({ error: 'Missing project or slug' });
  }

  try {
    const product = reviewProductIntelligence(project, slug);

    return res.json({
      command,
      result: {
        product_slug: slug,
        channel_pack: product.channel_pack || null
      }
    });
  } catch (e) {
    return res.json({ error: 'Failed review', details: e.message });
  }
}


if (command === '/build_campaign_execution_package') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const campaignName = (args[1] || '').trim();
  const rawSlugs = (args[2] || '').trim();

  if (!projectName || !campaignName || !rawSlugs) {
    return res.json({ error: 'Missing project, campaign name, or product slugs' });
  }

  try {
    const productSlugs = rawSlugs
      .split(',')
      .map(x => x.trim().toLowerCase())
      .filter(Boolean);

    const result = buildCampaignExecutionPackage(
      projectName,
      campaignName,
      productSlugs
    );

    return res.json({
      command,
      result
    });
  } catch (error) {
    return res.json({
      error: 'Failed to build campaign execution package',
      details: error.message
    });
  }
}
if (command === '/review_campaign_execution_package') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const campaignName = (args[1] || '').trim();

  if (!projectName || !campaignName) {
    return res.json({ error: 'Missing project or campaign name' });
  }

  try {
    const result = readCampaignExecutionPackage(projectName, campaignName);

    return res.json({
      command,
      result
    });
  } catch (error) {
    return res.json({
      error: 'Failed to review campaign execution package',
      details: error.message
    });
  }
}
if (command === '/build_channel_execution_payload') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const campaignName = (args[1] || '').trim();
  const channel = (args[2] || '').trim().toLowerCase();

  if (!projectName || !campaignName || !channel) {
    return res.json({ error: 'Missing project, campaign name, or channel' });
  }

  try {
    const result = buildChannelExecutionPayload(
      projectName,
      campaignName,
      channel
    );

    return res.json({
      command,
      result
    });
  } catch (error) {
    return res.json({
      error: 'Failed to build channel execution payload',
      details: error.message
    });
  }
}
if (command === '/build_campaign_media_job') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const campaignName = (args[1] || '').trim();
  const channel = (args[2] || '').trim().toLowerCase();

  if (!projectName || !campaignName || !channel) {
    return res.json({ error: 'Missing project, campaign name, or channel' });
  }

  try {
    const result = buildCampaignMediaJob(projectName, campaignName, channel);
    return res.json({
      command,
      result
    });
  } catch (error) {
    return res.json({
      error: 'Failed to build campaign media job',
      details: error.message
    });
  }
}
if (command === '/prepare_campaign_email') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const campaignName = (args[1] || '').trim();

  if (!projectName || !campaignName) {
    return res.json({ error: 'Missing project or campaign name' });
  }

  try {
    const result = buildCampaignEmailPackage(projectName, campaignName);
    return res.json({
      command,
      result
    });
  } catch (error) {
    return res.json({
      error: 'Failed to prepare campaign email package',
      details: error.message
    });
  }
}
if (command === '/build_campaign_publish_package') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const campaignName = (args[1] || '').trim();
  const channel = (args[2] || '').trim().toLowerCase();

  if (!projectName || !campaignName || !channel) {
    return res.json({ error: 'Missing project, campaign name, or channel' });
  }

  try {
    const result = buildCampaignPublishPackage(projectName, campaignName, channel);
    return res.json({
      command,
      result
    });
  } catch (error) {
    return res.json({
      error: 'Failed to build campaign publish package',
      details: error.message
    });
  }
}
if (command === '/review_campaign_finalization') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const campaignName = (args[1] || '').trim();

  if (!projectName || !campaignName) {
    return res.json({ error: 'Missing project or campaign name' });
  }

  try {
    const result = reviewCampaignFinalization(projectName, campaignName);
    return res.json({
      command,
      result
    });
  } catch (error) {
    return res.json({
      error: 'Failed to review campaign finalization',
      details: error.message
    });
  }
}
if (command === '/build_german_launch_plan') {
  const projectName = args[0];

  try {
    const result = buildGermanLaunchPlan(projectName);
    return res.json({ command, result });
  } catch (error) {
    return res.json({ error: 'Failed to build launch plan', details: error.message });
  }
}
if (command === '/review_german_launch_plan') {
  const projectName = args[0];

  try {
    const paths = getGermanLaunchPaths(projectName);
    const filePath = path.join(paths.planDir, 'launch-plan.json');

    const data = readJsonFile(filePath, {});
    return res.json({ command, result: data });
  } catch (error) {
    return res.json({ error: 'Failed to review launch plan', details: error.message });
  }
}
if (command === '/build_launch_wave') {
  const projectName = args[0];
  const waveName = args[1];

  try {
    const result = buildLaunchWave(projectName, waveName);
    return res.json({ command, result });
  } catch (error) {
    return res.json({ error: 'Failed to build launch wave', details: error.message });
  }
}
if (command === '/review_launch_wave') {
  const projectName = args[0];
  const waveName = args[1];

  try {
    const paths = getGermanLaunchPaths(projectName);
    const filePath = path.join(paths.wavesDir, `${waveName}.json`);

    const data = readJsonFile(filePath, {});
    return res.json({ command, result: data });
  } catch (error) {
    return res.json({ error: 'Failed to review launch wave', details: error.message });
  }
}
if (command === '/build_channel_connector_payload') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const waveName = (args[1] || '').trim();
  const channel = (args[2] || '').trim().toLowerCase();

  if (!projectName || !waveName || !channel) {
    return res.json({ error: 'Missing project, wave name, or channel' });
  }

  try {
    const result = buildChannelConnectorPayload(projectName, waveName, channel);
    return res.json({ command, result });
  } catch (error) {
    return res.json({
      error: 'Failed to build channel connector payload',
      details: error.message
    });
  }
}
if (command === '/schedule_launch_job') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const waveName = (args[1] || '').trim();
  const channel = (args[2] || '').trim().toLowerCase();
  const scheduledFor = (args[3] || '').trim();

  if (!projectName || !waveName || !channel || !scheduledFor) {
    return res.json({ error: 'Missing project, wave name, channel, or datetime' });
  }

  try {
    const result = scheduleLaunchJob(projectName, waveName, channel, scheduledFor);
    return res.json({ command, result });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      error: 'Failed to schedule launch job',
      details: error.message
    });
  }
}
if (command === '/review_scheduled_jobs') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const result = reviewScheduledJobs(projectName);
    return res.json({ command, result });
  } catch (error) {
    return res.json({
      error: 'Failed to review scheduled jobs',
      details: error.message
    });
  }
}
if (command === '/update_scheduled_job_status') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const jobId = (args[1] || '').trim();
  const status = (args[2] || '').trim().toLowerCase();

  if (!projectName || !jobId || !status) {
    return res.json({ error: 'Missing project, job id, or status' });
  }

  try {
    const result = updateScheduledJobStatus(projectName, jobId, status);
    return res.json({ command, result });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      error: 'Failed to update scheduled job status',
      details: error.message
    });
  }
}
if (command === '/record_manual_publish') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const campaignName = (args[1] || '').trim();
  const channel = (args[2] || '').trim().toLowerCase();
  const jobId = (args[3] || '').trim();
  const operator = (args[4] || '').trim();
  const postUrl = (args[5] || '').trim();
  const notes = args.slice(6).join(' ').trim();

  if (!projectName || !campaignName || !channel || !jobId || !operator || !postUrl) {
    return res.json({
      error: 'Missing required args. Usage: /record_manual_publish <project> <campaign> <channel> <job_id> <operator> <post_url> [notes...]'
    });
  }

  try {
    const result = recordManualPublish(projectName, campaignName, channel, jobId, operator, postUrl, notes);
    return res.json({ command, result });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      error: 'Failed to record manual publish',
      details: error.message
    });
  }
}
if (command === '/set_execution_mode') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const mode = (args[1] || '').trim().toLowerCase();

  if (!projectName || !mode) {
    return res.json({ error: 'Missing project or execution mode' });
  }

  try {
    const result = setExecutionMode(projectName, mode);
    return res.json({ command, result });
  } catch (error) {
    return res.json({
      error: 'Failed to set execution mode',
      details: error.message
    });
  }
}
if (command === '/review_execution_mode') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const result = readExecutionMode(projectName);
    return res.json({ command, result });
  } catch (error) {
    return res.json({
      error: 'Failed to review execution mode',
      details: error.message
    });
  }
}
if (command === '/execute_scheduled_job') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const jobId = (args[1] || '').trim();

  if (!projectName || !jobId) {
    return res.json({ error: 'Missing project or job id' });
  }

  try {
    const result = executeScheduledJob(projectName, jobId);
    return res.json({ command, result });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      error: 'Failed to execute scheduled job',
      details: error.message
    });
  }
}
if (command === '/review_execution_result') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const jobId = (args[1] || '').trim();

  if (!projectName || !jobId) {
    return res.json({ error: 'Missing project or job id' });
  }

  try {
    const result = reviewExecutionResult(projectName, jobId);
    return res.json({ command, result });
  } catch (error) {
    return res.json({
      error: 'Failed to review execution result',
      details: error.message
    });
  }
}
if (command === '/list_execution_results') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const result = listExecutionResults(projectName);
    return res.json({ command, result });
  } catch (error) {
    return res.json({
      error: 'Failed to list execution results',
      details: error.message
    });
  }
}
if (command === '/review_channel_post') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const channel = (args[1] || '').trim().toLowerCase();
  const productSlug = (args[2] || '').trim().toLowerCase();

  if (!projectName || !channel || !productSlug) {
    return res.json({ error: 'Missing project, channel, or product slug' });
  }

  try {
    const result = buildPostReview(projectName, channel, productSlug);
    return res.json({ command, result });
  } catch (error) {
    return res.json({
      error: 'Failed to review channel post',
      details: error.message
    });
  }
}
if (command === '/improve_channel_post') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const channel = (args[1] || '').trim().toLowerCase();
  const productSlug = (args[2] || '').trim().toLowerCase();

  if (!projectName || !channel || !productSlug) {
    return res.json({ error: 'Missing project, channel, or product slug' });
  }

  try {
    const result = buildImprovedChannelPost(projectName, channel, productSlug);
    return res.json({ command, result });
  } catch (error) {
    return res.json({
      error: 'Failed to improve channel post',
      details: error.message
    });
  }
}
if (command === '/save_post_performance') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const channel = (args[1] || '').trim().toLowerCase();
  const productSlug = (args[2] || '').trim().toLowerCase();
  const metricJson = args.slice(3).join(' ').trim();

  if (!projectName || !channel || !productSlug || !metricJson) {
    return res.json({ error: 'Missing project, channel, product slug, or metric json' });
  }

  try {
    const result = savePostPerformance(projectName, channel, productSlug, metricJson);
    return res.json({ command, result });
  } catch (error) {
    return res.json({
      error: 'Failed to save post performance',
      details: error.message
    });
  }
}
if (command === '/review_product_performance') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const productSlug = (args[1] || '').trim().toLowerCase();

  if (!projectName || !productSlug) {
    return res.json({ error: 'Missing project or product slug' });
  }

  try {
    const result = reviewProductPerformance(projectName, productSlug);
    return res.json({ command, result });
  } catch (error) {
    return res.json({
      error: 'Failed to review product performance',
      details: error.message
    });
  }
}
if (command === '/review_channel_learning') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const channel = (args[1] || '').trim().toLowerCase();

  if (!projectName || !channel) {
    return res.json({ error: 'Missing project or channel' });
  }

  try {
    const result = reviewChannelLearning(projectName, channel);
    return res.json({ command, result });
  } catch (error) {
    return res.json({
      error: 'Failed to review channel learning',
      details: error.message
    });
  }
}
if (command === '/list_system_docs') {
  try {
    const result = listSystemDocs();
    return res.json({ command, result });
  } catch (error) {
    return res.json({
      error: 'Failed to list system docs',
      details: error.message
    });
  }
}

if (command === '/read_system_doc') {
  const docName = (args[0] || '').trim();

  if (!docName) {
    return res.json({ error: 'Missing document name' });
  }

  try {
    const result = readSystemDoc(docName);
    return res.json({ command, result });
  } catch (error) {
    return res.json({
      error: 'Failed to read system doc',
      details: error.message
    });
  }
}
if (command === '/create_project') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const market = (args[1] || '').trim();
  const language = (args[2] || '').trim();
  const projectType = (args[3] || '').trim();
  const websiteUrl = (args[4] || '').trim();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const result = createProject(
      projectName,
      market,
      language,
      projectType,
      websiteUrl
    );

    return res.json({ command, result });
  } catch (error) {
    return res.json({
      error: 'Failed to create project',
      details: error.message
    });
  }
}

if (command === '/list_projects') {
  try {
    const result = listProjects();
    return res.json({ command, result });
  } catch (error) {
    return res.json({
      error: 'Failed to list projects',
      details: error.message
    });
  }
}

if (command === '/review_project') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const result = reviewProject(projectName);
    return res.json({ command, result });
  } catch (error) {
    return res.json({
      error: 'Failed to review project',
      details: error.message
    });
  }
}

if (command === '/review_project_readiness') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const result = reviewProjectReadiness(projectName);
    return res.json({ command, result });
  } catch (error) {
    return res.json({
      error: 'Failed to review project readiness',
      details: error.message
    });
  }
}
if (command === '/register_project_asset') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const assetType = (args[1] || '').trim().toLowerCase();
  const filePath = args.slice(2).join(' ').trim();

  if (!projectName || !assetType || !filePath) {
    return res.json({ error: 'Missing project, asset type, or file path' });
  }

  try {
    const result = registerProjectAsset(projectName, assetType, filePath);
    return res.json({ command, result });
  } catch (error) {
    return res.json({
      error: 'Failed to register project asset',
      details: error.message
    });
  }
}

if (command === '/list_project_assets') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
  const result = listProjectAssets(projectName);
  return res.json({ command, result });
} catch (error) {
  return res.status(500).json({
    error: 'Failed to list project assets.',
    details: error.message
  });
}
}

if (command === '/set_project_source_of_truth') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const sourceType = (args[1] || '').trim().toLowerCase();
  const sourceValue = args.slice(2).join(' ').trim();

  if (!projectName || !sourceType || !sourceValue) {
    return res.json({ error: 'Missing project, source type, or source value' });
  }

  try {
    const result = setProjectSourceOfTruth(projectName, sourceType, sourceValue);
    return res.json({ command, result });
  } catch (error) {
    return res.json({
      error: 'Failed to set project source of truth',
      details: error.message
    });
  }
}

if (command === '/review_project_sources') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const result = reviewProjectSources(projectName);
    return res.json({ command, result });
  } catch (error) {
    return res.json({
      error: 'Failed to review project sources',
      details: error.message
    });
  }
}

if (command === '/review_project_missing_assets') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const result = reviewProjectMissingAssets(projectName);
    return res.json({ command, result });
  } catch (error) {
    return res.json({
      error: 'Failed to review project missing assets',
      details: error.message
    });
  }
}
if (command === '/list_asset_type_catalog') {
  try {
    const result = getAssetTypeCatalog();
    return res.json({ command, result });
  } catch (error) {
    return res.json({
      error: 'Failed to list asset type catalog',
      details: error.message
    });
  }
}

if (command === '/review_project_upload_mapping') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const result = reviewProjectUploadMapping(projectName);
    return res.json({ command, result });
  } catch (error) {
    return res.json({
      error: 'Failed to review project upload mapping',
      details: error.message
    });
  }
}

if (command === '/review_project_connector_readiness') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const result = reviewProjectConnectorReadiness(projectName);
    return res.json({ command, result });
  } catch (error) {
    return res.json({
      error: 'Failed to review project connector readiness',
      details: error.message
    });
  }
}
if (command === '/route_project_asset') {
  const projectName = (args[0] || '').trim().toLowerCase();
  const assetType = (args[1] || '').trim().toLowerCase();
  const sourceFilePath = args.slice(2).join(' ').trim();

  if (!projectName || !assetType || !sourceFilePath) {
    return res.json({ error: 'Missing project, asset type, or source file path' });
  }

  try {
    const result = routeProjectAsset(projectName, assetType, sourceFilePath);
    return res.json({ command, result });
  } catch (error) {
    return res.json({
      error: 'Failed to route project asset',
      details: error.message
    });
  }
}

if (command === '/review_project_asset_routes') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const result = reviewProjectAssetRoutes(projectName);
    return res.json({ command, result });
  } catch (error) {
    return res.json({
      error: 'Failed to review project asset routes',
      details: error.message
    });
  }
}

if (command === '/review_project_folder_health') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const result = reviewProjectFolderHealth(projectName);
    return res.json({ command, result });
  } catch (error) {
    return res.json({
      error: 'Failed to review project folder health',
      details: error.message
    });
  }
}
if (command === '/review_project_alignment_status') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const result = reviewProjectAlignmentStatus(projectName);
    return res.json({ command, result });
  } catch (error) {
    return res.json({
      error: 'Failed to review project alignment status',
      details: error.message
    });
  }
}

if (command === '/review_project_missing_priorities') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const result = reviewProjectMissingPriorities(projectName);
    return res.json({ command, result });
  } catch (error) {
    return res.json({
      error: 'Failed to review project missing priorities',
      details: error.message
    });
  }
}

if (command === '/review_project_dashboard') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const result = reviewProjectDashboard(projectName);
    return res.json({ command, result });
  } catch (error) {
    return res.json({
      error: 'Failed to review project dashboard',
      details: error.message
    });
  }
}
if (command === '/project_control_center_overview') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const result = buildProjectControlCenterOverview(projectName);
    return res.json({ command, result });
  } catch (error) {
    return res.json({
      error: 'Failed to build project control center overview',
      details: error.message
    });
  }
}

if (command === '/project_control_center_assets') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const result = buildProjectControlCenterAssets(projectName);
    return res.json({ command, result });
  } catch (error) {
    return res.json({
      error: 'Failed to build project control center assets',
      details: error.message
    });
  }
}

if (command === '/project_control_center_connectors') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const result = buildProjectControlCenterConnectors(projectName);
    return res.json({ command, result });
  } catch (error) {
    return res.json({
      error: 'Failed to build project control center connectors',
      details: error.message
    });
  }
}

if (command === '/project_control_center_readiness') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const result = buildProjectControlCenterReadiness(projectName);
    return res.json({ command, result });
  } catch (error) {
    return res.json({
      error: 'Failed to build project control center readiness',
      details: error.message
    });
  }
}

if (command === '/project_control_center_activity') {
  const projectName = (args[0] || '').trim().toLowerCase();

  if (!projectName) {
    return res.json({ error: 'Missing project name' });
  }

  try {
    const result = buildProjectControlCenterActivity(projectName);
    return res.json({ command, result });
  } catch (error) {
    return res.json({
      error: 'Failed to build project control center activity',
      details: error.message
    });
  }
}












 return sendError(res, {
      statusCode: 400,
      code: 'UNSUPPORTED_COMMAND',
      message: `Unsupported command: ${command}`
    });
  } catch (error) {
    return sendError(res, {
      statusCode: getErrorStatusCode(error, 502),
      code: 'TELEGRAM_COMMAND_FAILED',
      message: 'Failed to execute telegram command'
    });
  }
});

app.post('/publish-clone/:cloneId', async (req, res) => {
  try {
    const projectName = requireProjectContext(req);
    assertPublishingMutationAllowed(projectName, 'publish', {
      status: 'published'
    });
    const cloneId = req.params.cloneId;

    const response = await axios.put(
      `${process.env.WC_BASE_URL}/products/${cloneId}`,
      {
        status: 'publish'
      },
      {
        auth: {
          username: process.env.WC_KEY,
          password: process.env.WC_SECRET
        }
      }
    );

    const publishedProduct = response.data;

    res.json({
      mode: 'publish_clone',
      product_id: publishedProduct.id,
      name: publishedProduct.name,
      status: publishedProduct.status,
      permalink: publishedProduct.permalink,
      success: true,
      warning:
        'This action published a draft product. Original product was not modified.'
    });
  } catch (error) {
    logCriticalFailure('publish_clone', req, error, {
      cloneId: req.params.cloneId
    });
    return res.status(getErrorStatusCode(error, 502)).json({
      error: sanitizeErrorPayloadForClient(error.response?.data || error.message) || 'Failed to publish clone product'
    });
  }
});

app.post('/replace-original-product/:originalId/:cloneId', async (req, res) => {
  try {
    const projectName = requireProjectContext(req);
    assertPublishingMutationAllowed(projectName, 'publish', {
      status: 'published'
    });
    const originalId = req.params.originalId;
    const cloneId = req.params.cloneId;

    const [originalResponse, cloneResponse] = await Promise.all([
      axios.get(`${process.env.WC_BASE_URL}/products/${originalId}`, {
        auth: {
          username: process.env.WC_KEY,
          password: process.env.WC_SECRET
        }
      }),
      axios.get(`${process.env.WC_BASE_URL}/products/${cloneId}`, {
        auth: {
          username: process.env.WC_KEY,
          password: process.env.WC_SECRET
        }
      })
    ]);

    const originalProduct = originalResponse.data;
    const cloneProduct = cloneResponse.data;

    const backupDir = getProjectBackupDir(projectName);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFilePath = path.join(
      backupDir,
      `product-${originalProduct.id}-pre-replace-backup-${timestamp}.json`
    );

    fs.writeFileSync(
      backupFilePath,
      JSON.stringify(originalProduct, null, 2),
      'utf8'
    );

    const updatePayload = {
      short_description: cloneProduct.short_description || originalProduct.short_description || '',
      description: cloneProduct.description || originalProduct.description || '',
      status: 'publish'
    };

    const updateResponse = await axios.put(
      `${process.env.WC_BASE_URL}/products/${originalId}`,
      updatePayload,
      {
        auth: {
          username: process.env.WC_KEY,
          password: process.env.WC_SECRET
        }
      }
    );

    const updatedOriginal = updateResponse.data;

    res.json({
      mode: 'replace_original_product',
      original_product_id: updatedOriginal.id,
      original_permalink: updatedOriginal.permalink,
      backup_file: backupFilePath,
      source_clone_id: cloneProduct.id,
      source_clone_permalink: cloneProduct.permalink,
      updated_fields: [
        'short_description',
        'description'
      ],
      status: updatedOriginal.status,
      success: true,
      seo_note:
        'Original permalink was preserved. Content was updated on the original product to keep SEO continuity.',
      next_step:
        'Review the original live product page and decide whether to keep, draft, or trash the clone.'
    });
  } catch (error) {
    logCriticalFailure('replace_original_product', req, error, {
      originalId: req.params.originalId,
      cloneId: req.params.cloneId
    });
    return res.status(getErrorStatusCode(error, 502)).json({
      error: sanitizeErrorPayloadForClient(error.response?.data || error.message) || 'Failed to replace original product'
    });
  }
});

app.post('/cleanup-clone/:cloneId', async (req, res) => {
  try {
    const cloneId = req.params.cloneId;
    const action = req.query.action || 'draft'; // draft or trash

    let statusUpdate = 'draft';

    if (action === 'trash') {
      statusUpdate = 'trash';
    }

    const response = await axios.put(
      `${process.env.WC_BASE_URL}/products/${cloneId}`,
      {
        status: statusUpdate
      },
      {
        auth: {
          username: process.env.WC_KEY,
          password: process.env.WC_SECRET
        }
      }
    );

    const updated = response.data;

    res.json({
      mode: 'cleanup_clone',
      clone_id: updated.id,
      action: statusUpdate,
      status: updated.status,
      permalink: updated.permalink || '',
      success: true
    });
  } catch (error) {
    logCriticalFailure('cleanup_clone', req, error, {
      cloneId: req.params.cloneId,
      action: req.query.action || 'draft'
    });
    return sendError(res, {
      statusCode: getErrorStatusCode(error, 502),
      code: 'LEGACY_CLEANUP_CLONE_FAILED',
      message: 'Failed to cleanup clone product'
    });
  }
});

app.post('/publish-blog/:draftId', async (req, res) => {
  try {
    const projectName = requireProjectContext(req);
    assertPublishingMutationAllowed(projectName, 'publish', {
      status: 'published'
    });
    const draftId = req.params.draftId;

    const queuePath = getLegacyContentQueuePath(projectName, 'blog');

    const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
    const item = queue.find(x => x.id === draftId);

    if (!item) {
      return sendError(res, {
        statusCode: 404,
        code: 'BLOG_DRAFT_NOT_FOUND',
        message: 'Blog draft not found'
      });
    }

    if (!item.body) {
      return sendError(res, {
        statusCode: 400,
        code: 'BLOG_DRAFT_BODY_MISSING',
        message: 'Blog draft has no body content'
      });
    }
    
    const WP_URL = process.env.WP_BASE_URL;
    const WP_USER = process.env.WP_USER;
    const WP_PASS = process.env.WP_APP_PASSWORD;

    if (!WP_URL || !WP_USER || !WP_PASS) {
      return sendError(res, {
        statusCode: 503,
        code: 'WORDPRESS_ENV_MISSING',
        message: 'WordPress environment variables are missing'
      });
    }

    const response = await fetch(WP_URL, {
      method: 'POST',
      headers: {
        'Authorization':
          'Basic ' + Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: item.title,
        content: item.body,
        excerpt: item.excerpt || '',
        status: 'publish'
      })
    });

    const data = await response.json();

        if (!response.ok) {
      return sendError(res, {
        statusCode: response.status || 502,
        code: 'WORDPRESS_PUBLISH_FAILED',
        message: `WordPress publish failed with status ${response.status}`
      });
    }

    item.status = 'published';
    item.published_post_id = data.id || null;
    item.link = data.link || '';
    item.wp_status = data.status || '';
    item.date_published = data.date || '';
    item.wp_slug = data.slug || '';
    item.category_applied = item.category_suggestion || '';
    item.tags_applied = item.tag_suggestions || [];
    item.featured_image_ready = Boolean(
      item.featured_image_prompt && item.featured_image_alt
     );

      fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');

    return res.json({
      success: true,
      draft_id: draftId,
      post_id: data.id || null,
      link: data.link || '',
      wp_status: data.status || '',
      title: data.title?.rendered || item.title,
      category_suggestion: item.category_suggestion || '',
      tag_suggestions: item.tag_suggestions || [],
      featured_image_ready: Boolean(
        item.featured_image_prompt && item.featured_image_alt
      ),
      note: 'Blog published successfully'
    });
  } catch (err) {
    logCriticalFailure('publish_blog', req, err, {
      draftId: req.params.draftId
    });
    return sendError(res, {
      statusCode: getErrorStatusCode(err, 500),
      code: 'LEGACY_BLOG_PUBLISH_FAILED',
      message: 'Failed to publish blog draft'
    });
  }
});

app.post('/rollback-product/:productId', async (req, res) => {
  try {
    const projectName = requireProjectContext(req);
    assertPublishingMutationAllowed(projectName, 'publish', {
      status: 'published'
    });
    const productId = req.params.productId;
    const backupDir = getProjectBackupDir(projectName);

    const backupFiles = fs
      .readdirSync(backupDir)
      .filter(file => file.includes(`product-${productId}`))
      .sort()
      .reverse();

    if (backupFiles.length === 0) {
      return sendError(res, {
        statusCode: 404,
        code: 'PRODUCT_BACKUP_NOT_FOUND',
        message: 'No backup found for this product'
      });
    }

    const latestBackupFile = backupFiles[0];
    const backupPath = path.join(backupDir, latestBackupFile);

    const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

    const updatePayload = {
      name: backupData.name,
      short_description: backupData.short_description,
      description: backupData.description,
      status: backupData.status || 'publish'
    };

    const response = await axios.put(
      `${process.env.WC_BASE_URL}/products/${productId}`,
      updatePayload,
      {
        auth: {
          username: process.env.WC_KEY,
          password: process.env.WC_SECRET
        }
      }
    );

    const restored = response.data;

    res.json({
      mode: 'rollback_product',
      product_id: restored.id,
      restored_from: latestBackupFile,
      status: restored.status,
      success: true,
      note: 'Product restored from latest backup snapshot'
    });
  } catch (error) {
    logCriticalFailure('rollback_product', req, error, {
      productId: req.params.productId
    });
    return sendError(res, {
      statusCode: getErrorStatusCode(error, 502),
      code: 'LEGACY_ROLLBACK_FAILED',
      message: 'Failed to rollback product'
    });
  }
});

// ─── PHASE 4: SCHEDULER / AUTOMATION LAYER ─────────────────────────────────

const SCHEDULER_LOCK_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
const SCHEDULER_VALID_JOB_TYPES = Object.freeze(['publish', 'email', 'media', 'ads']);
const SCHEDULER_DEFAULT_MAX_ATTEMPTS = 3;
const SCHEDULER_VALID_MODES = Object.freeze(['manual', 'semi_auto', 'auto']);


const schedulerStorage = createSchedulerStorage({
  path,
  fs,
  dataDir: DATA_DIR,
  normalizeProjectSlug,
  resolveProjectPath,
  ensureDir,
  readJsonFile,
  writeJsonFile,
  sanitizeErrorMessage,
  sanitizeValue
});
const {
  getSchedulerFilePath,
  readSchedulerJobs,
  writeSchedulerJobs,
  writeSchedulerAuditLog
} = schedulerStorage;

function getIntelligencePaths(projectName) {
  const safeProject = normalizeProjectSlug(projectName);
  const projectRoot = resolveProjectPath(path.join(DATA_DIR, 'projects'), safeProject).projectRoot;
  const analyticsDir = path.join(projectRoot, 'analytics');
  const aiDir = path.join(projectRoot, 'ai');

  ensureDir(analyticsDir);
  ensureDir(aiDir);

  return {
    project: safeProject,
    projectRoot,
    analyticsDir,
    aiDir,
    performancePath: path.join(analyticsDir, 'performance.json'),
    recommendationsPath: path.join(aiDir, 'recommendations.json'),
    learningPath: path.join(aiDir, 'learning.json')
  };
}

const performanceStorage = createPerformanceStorage({
  getIntelligencePaths,
  readJsonFile,
  writeJsonFile
});
const {
  readPerformanceStore,
  writePerformanceStore,
  readLearningStore,
  writeLearningStore,
  readRecommendationsStore,
  writeRecommendationsStore
} = performanceStorage;

function inferPerformanceContextFromJob(job = {}) {
  const payload = job && typeof job.package_payload === 'object' ? job.package_payload : {};
  const publishPackage = payload.publish_package && typeof payload.publish_package === 'object'
    ? payload.publish_package
    : {};
  const assets = Array.isArray(publishPackage.assets) ? publishPackage.assets : [];
  const firstAsset = assets[0] && typeof assets[0] === 'object' ? assets[0] : {};

  return {
    campaign_id: String(
      payload.campaign_id
      || publishPackage.campaign_id
      || job.source_package_id
      || ''
    ).trim() || null,
    product_slug: String(
      payload.product_slug
      || firstAsset.product_slug
      || firstAsset.product_id
      || ''
    ).trim() || null,
    hook: String(
      payload.hook
      || payload.primary_hook
      || firstAsset.hook
      || ''
    ).trim() || null
  };
}

function appendPerformanceRecord(projectName, input = {}) {
  const safeProject = normalizeProjectSlug(projectName);
  const store = readPerformanceStore(safeProject);
  const schedulerJobs = readSchedulerJobs(safeProject);
  const matchedJob = schedulerJobs.find((job) => String(job.id || '').trim() === String(input.job_id || '').trim()) || null;
  const inferred = inferPerformanceContextFromJob(matchedJob || {});
  const normalizedChannel = String(input.channel || matchedJob?.channel || '').trim().toLowerCase();
  const metrics = normalizeFeedbackMetrics(input.metrics || {});
  const stats = derivePerformanceStats(metrics);
  const recordedAt = new Date().toISOString();

  const record = {
    record_id: `perf_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
    recorded_at: recordedAt,
    project: safeProject,
    job_id: String(input.job_id || '').trim(),
    channel: normalizedChannel,
    campaign_id: String(input.campaign_id || inferred.campaign_id || '').trim() || null,
    product_slug: String(input.product_slug || inferred.product_slug || '').trim() || null,
    hook: String(input.hook || inferred.hook || '').trim() || null,
    metrics,
    stats
  };

  store.records.push(record);
  writePerformanceStore(safeProject, store);

  return {
    record,
    total_records: store.records.length
  };
}

function calculateEntityPerformance(records, key) {
  const map = new Map();

  for (const record of records) {
    const id = String(record?.[key] || '').trim();
    if (!id) continue;

    const current = map.get(id) || {
      key: id,
      count: 0,
      score_sum: 0,
      ctr_sum: 0,
      conversion_rate_sum: 0,
      roas_sum: 0,
      roas_count: 0,
      revenue_sum: 0,
      conversions_sum: 0
    };

    current.count += 1;
    current.score_sum += toFiniteNumber(record?.stats?.performance_score, 0);
    current.ctr_sum += toFiniteNumber(record?.stats?.ctr, 0);
    current.conversion_rate_sum += toFiniteNumber(record?.stats?.conversion_rate, 0);
    current.revenue_sum += toFiniteNumber(record?.metrics?.revenue, 0);
    current.conversions_sum += toFiniteNumber(record?.metrics?.conversions, 0);

    const roas = record?.stats?.roas;
    if (Number.isFinite(roas)) {
      current.roas_sum += roas;
      current.roas_count += 1;
    }

    map.set(id, current);
  }

  return Array.from(map.values()).map((value) => ({
    key: value.key,
    count: value.count,
    avg_score: Number((value.score_sum / Math.max(1, value.count)).toFixed(2)),
    avg_ctr: Number((value.ctr_sum / Math.max(1, value.count)).toFixed(4)),
    avg_conversion_rate: Number((value.conversion_rate_sum / Math.max(1, value.count)).toFixed(4)),
    avg_roas: value.roas_count > 0
      ? Number((value.roas_sum / value.roas_count).toFixed(3))
      : null,
    total_revenue: Number(value.revenue_sum.toFixed(2)),
    total_conversions: value.conversions_sum
  }));
}

function buildTrendSnapshot(records, channel) {
  const scoped = records
    .filter((record) => String(record.channel || '').trim().toLowerCase() === channel)
    .sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime());

  if (!scoped.length) {
    return {
      channel,
      direction: 'stable',
      change_pct: 0,
      recent_avg_score: 0,
      previous_avg_score: 0,
      sample_size: 0
    };
  }

  const recent = scoped.slice(-3);
  const previous = scoped.slice(-6, -3);

  const average = (items) => {
    if (!items.length) return 0;
    const total = items.reduce((sum, item) => sum + toFiniteNumber(item?.stats?.performance_score, 0), 0);
    return total / items.length;
  };

  const recentAvg = average(recent);
  const previousAvg = average(previous);
  const delta = previousAvg > 0 ? ((recentAvg - previousAvg) / previousAvg) * 100 : 0;

  let direction = 'stable';
  if (delta > 8) direction = 'up';
  if (delta < -8) direction = 'down';

  return {
    channel,
    direction,
    change_pct: Number(delta.toFixed(2)),
    recent_avg_score: Number(recentAvg.toFixed(2)),
    previous_avg_score: Number(previousAvg.toFixed(2)),
    sample_size: scoped.length
  };
}

function buildPerformanceSummary(projectName) {
  const safeProject = normalizeProjectSlug(projectName);
  const store = readPerformanceStore(safeProject);
  const records = Array.isArray(store.records) ? store.records : [];
  const topCampaigns = calculateEntityPerformance(records, 'campaign_id')
    .sort((a, b) => b.avg_score - a.avg_score)
    .slice(0, 5);
  const topProducts = calculateEntityPerformance(records, 'product_slug')
    .sort((a, b) => b.avg_score - a.avg_score)
    .slice(0, 5);
  const channels = calculateEntityPerformance(records, 'channel')
    .sort((a, b) => b.avg_score - a.avg_score);
  const topChannels = channels.slice(0, 3);
  const weakChannels = channels.filter((channel) => channel.avg_score < 22 || channel.avg_conversion_rate < 0.01);
  const hooks = calculateEntityPerformance(records, 'hook')
    .sort((a, b) => b.avg_score - a.avg_score)
    .slice(0, 5);

  const trendChannels = Array.from(
    new Set(records.map((record) => String(record.channel || '').trim().toLowerCase()).filter(Boolean))
  );
  const trends = trendChannels
    .map((channel) => buildTrendSnapshot(records, channel))
    .sort((a, b) => b.recent_avg_score - a.recent_avg_score);

  return {
    project: safeProject,
    records_tracked: records.length,
    top_performing_campaigns: topCampaigns,
    top_performing_products: topProducts,
    top_channels: topChannels,
    weak_channels: weakChannels,
    best_hooks: hooks,
    performance_trends: trends
  };
}

function collectExecutionSignals(projectName) {
  const safeProject = normalizeProjectSlug(projectName);
  const jobs = readSchedulerJobs(safeProject);
  const completed = jobs.filter((job) => job.status === 'completed');
  const failed = jobs.filter((job) => job.status === 'failed');
  const retryable = jobs.filter((job) => job.status === 'retryable');

  const byChannel = new Map();
  for (const job of jobs) {
    const channel = String(job.channel || '').trim().toLowerCase();
    if (!channel) continue;

    const current = byChannel.get(channel) || {
      channel,
      total_jobs: 0,
      completed: 0,
      failed: 0,
      retryable: 0
    };

    current.total_jobs += 1;
    if (job.status === 'completed') current.completed += 1;
    if (job.status === 'failed') current.failed += 1;
    if (job.status === 'retryable') current.retryable += 1;
    byChannel.set(channel, current);
  }

  const channelStatus = Array.from(byChannel.values()).map((entry) => ({
    ...entry,
    failure_rate: entry.total_jobs > 0
      ? Number(((entry.failed + entry.retryable) / entry.total_jobs).toFixed(4))
      : 0
  }));

  return {
    total_jobs: jobs.length,
    completed_jobs: completed.length,
    failed_jobs: failed.length,
    retryable_jobs: retryable.length,
    channel_status: channelStatus
  };
}


function buildRiskAlerts(summary, records) {
  return buildRiskAlertsBase(summary, records, { toFiniteNumber });
}


const recommendationRuntime = createRecommendationRuntime({
  normalizeProjectSlug,
  buildPerformanceSummary,
  collectExecutionSignals,
  readPerformanceStore,
  buildRiskAlerts
});

const {
  generateOptimizationRecommendations
} = recommendationRuntime;


const learningPatterns = createLearningPatterns({
  crypto,
  toFiniteNumber
});

const {
  upsertLearningPattern
} = learningPatterns;


const intelligenceLoop = createIntelligenceLoop({
  env: process.env,
  normalizeProjectSlug,
  buildPerformanceSummary,
  generateOptimizationRecommendations,
  readRecommendationsStore,
  writeRecommendationsStore,
  readLearningStore,
  writeLearningStore,
  buildLearningCandidates,
  upsertLearningPattern
});

const {
  updateIntelligenceLoop
} = intelligenceLoop;


const smartSuggestions = createSmartSuggestions({
  normalizeProjectSlug,
  buildPerformanceSummary,
  readRecommendationsStore,
  readLearningStore,
  generateOptimizationRecommendations
});

const {
  buildSmartSuggestions
} = smartSuggestions;

const executionJobBridge = createExecutionJobBridge({
  resolvePublishPackageForExecution,
  buildSocialExecutionPayload,
  resolveEmailPackageForExecution,
  buildEmailReadyPayload,
  buildMediaGenerationMock,
  resolveCampaignPackageForAds,
  buildAdExecutionPackage
});
const { executeJobBridge } = executionJobBridge;

function buildSchedulerJobRecordWithDefaults(params) {
  return buildSchedulerJobRecord(params, {
    crypto,
    defaultMaxAttempts: SCHEDULER_DEFAULT_MAX_ATTEMPTS
  });
}

function buildMediaManagerProjectStartupPayload(projectName) {
  const full = buildMediaManagerProjectPayload(projectName);
  const safeProjectName = normalizeProjectSlug(projectName);
  let startupAssets = Array.isArray(full.assets?.assets) ? full.assets.assets : [];

  if (!startupAssets.length) {
    try {
      const registryPath = path.join(DATA_DIR, "projects", safeProjectName, "assets-registry.json");
      const parsed = JSON.parse(fs.readFileSync(registryPath, "utf8"));

      if (Array.isArray(parsed)) {
        startupAssets = parsed;
      } else if (Array.isArray(parsed?.assets)) {
        startupAssets = parsed.assets;
      } else if (Array.isArray(parsed?.items)) {
        startupAssets = parsed.items;
      } else if (Array.isArray(parsed?.records)) {
        startupAssets = parsed.records;
      }
    } catch (_) {
      startupAssets = [];
    }
  }

  return {
    project: full.project,
    capabilities: full.capabilities,
    overview: full.overview,
    readiness: full.readiness,
    assets: {
      project: full.assets?.project || full.project,
      generated_at: full.assets?.generated_at || new Date().toISOString(),
      assets: startupAssets,
      asset_catalog: Array.isArray(full.assets?.asset_catalog) ? full.assets.asset_catalog : [],
      category_readiness: full.assets?.category_readiness || null,
      missing_assets: full.assets?.missing_assets || null,
      summary: {
        total: startupAssets.length,
        existing: startupAssets.filter((asset) => asset?.exists !== false).length,
        missing: startupAssets.filter((asset) => asset?.exists === false).length
      }
    },
    tree: {
      project: full.project,
      tree: []
    },
    registry: {
      project: full.project,
      total_assets: startupAssets.length,
      assets: startupAssets
    },
    connectors: full.connectors || {},
    activity: {
      project: full.project,
      items: [],
      summary: {}
    },
    operations: {
      project: full.project,
      summary: {},
      items: []
    },
    errors: full.errors || {}
  };
}

app.post('/schedule_execution_job', (req, res) => {
  let projectName = '';

  try {
    projectName = requireProjectContext(req, { allowFallback: false });

    const type = String(req.body?.type || '').trim().toLowerCase();
    if (!SCHEDULER_VALID_JOB_TYPES.includes(type)) {
      const err = new Error(
        `Invalid job type "${type}". Valid types: ${SCHEDULER_VALID_JOB_TYPES.join(', ')}`
      );
      err.statusCode = 400;
      err.code = 'INVALID_JOB_TYPE';
      throw err;
    }

    const scheduledAtRaw = String(req.body?.scheduled_at || '').trim();
    if (!scheduledAtRaw) {
      const err = new Error('Missing scheduled_at. Provide an ISO8601 datetime string.');
      err.statusCode = 400;
      err.code = 'SCHEDULED_AT_MISSING';
      throw err;
    }

    const scheduledAtMs = new Date(scheduledAtRaw).getTime();
    if (isNaN(scheduledAtMs)) {
      const err = new Error('Invalid scheduled_at. Must be a valid ISO8601 datetime string.');
      err.statusCode = 400;
      err.code = 'SCHEDULED_AT_INVALID';
      throw err;
    }

    const mode = String(req.body?.mode || 'semi_auto').trim().toLowerCase();
    if (!SCHEDULER_VALID_MODES.includes(mode)) {
      const err = new Error(
        `Invalid mode "${mode}". Valid modes: ${SCHEDULER_VALID_MODES.join(', ')}`
      );
      err.statusCode = 400;
      err.code = 'INVALID_JOB_MODE';
      throw err;
    }

    const packagePayload = req.body?.package_payload && typeof req.body.package_payload === 'object'
      ? req.body.package_payload
      : null;

    if (!packagePayload || Object.keys(packagePayload).length === 0) {
      const err = new Error(
        'Missing package content. Provide package_payload object with the execution payload.'
      );
      err.statusCode = 400;
      err.code = 'PACKAGE_PAYLOAD_MISSING';
      throw err;
    }

    const job = buildSchedulerJobRecordWithDefaults({
      project: projectName,
      type,
      source_package_id: req.body?.source_package_id,
      channel: req.body?.channel,
      scheduled_at: scheduledAtRaw,
      mode,
      package_payload: packagePayload,
      max_attempts: req.body?.max_attempts
    });

    const jobs = readSchedulerJobs(projectName);
    jobs.push(job);
    writeSchedulerJobs(projectName, jobs);

    writeSchedulerAuditLog(projectName, {
      job_id: job.id,
      action: 'job_created',
      status: 'pending',
      result_reference: {
        type: job.type,
        scheduled_at: job.scheduled_at,
        mode: job.mode
      }
    });

    return res.status(201).json({
      ok: true,
      job
    });
  } catch (error) {
    return sendError(res, {
      statusCode: getErrorStatusCode(error, 400),
      code: error.code || 'SCHEDULE_JOB_FAILED',
      message: error.message || 'Failed to schedule execution job'
    });
  }
});

app.get('/scheduler_queue', (req, res) => {
  try {
    const projectName = requireProjectContext(req, { allowFallback: false });
    const nowMs = Date.now();
    const jobs = readSchedulerJobs(projectName);

    const pending = [];
    const due = [];
    const running = [];
    const failed = [];
    const completed = [];
    const retryable = [];

    for (const job of jobs) {
      if (job.status === 'completed') {
        completed.push(job);
        continue;
      }

      if (job.status === 'failed') {
        failed.push(job);
        continue;
      }

      if (job.status === 'running') {
        running.push(isJobLockExpired(job, SCHEDULER_LOCK_TIMEOUT_MS) ? { ...job, lock_expired: true } : job);
        continue;
      }

      if (job.status === 'retryable') {
        retryable.push(job);
        const scheduledAt = new Date(job.scheduled_at).getTime();
        if (!isNaN(scheduledAt) && scheduledAt <= nowMs) {
          due.push(job);
        }
        continue;
      }

      if (job.status === 'pending') {
        pending.push(job);
        const scheduledAt = new Date(job.scheduled_at).getTime();
        if (!isNaN(scheduledAt) && scheduledAt <= nowMs) {
          due.push(job);
        }
      }
    }

    return res.json({
      ok: true,
      project: projectName,
      total: jobs.length,
      queue: {
        pending: pending.length,
        due: due.length,
        running: running.length,
        failed: failed.length,
        completed: completed.length,
        retryable: retryable.length
      },
      jobs: {
        pending,
        due,
        running,
        failed,
        completed,
        retryable
      }
    });
  } catch (error) {
    return sendError(res, {
      statusCode: getErrorStatusCode(error, 400),
      code: error.code || 'SCHEDULER_QUEUE_FAILED',
      message: error.message || 'Failed to retrieve scheduler queue'
    });
  }
});

app.post('/run_scheduler_worker_once', (req, res) => {
  let projectName = '';

  try {
    projectName = requireProjectContext(req, { allowFallback: false });
    const workerId = generateWorkerId(crypto);
    const lockTimestamp = new Date().toISOString();
    const results = [];

    const jobs = readSchedulerJobs(projectName);

    // Phase 1: lock all due jobs atomically
    for (const job of jobs) {
      if (job.status === 'completed') continue;
      if (job.status === 'failed' && job.attempts >= job.max_attempts) continue;

      const isStaleRunning = job.status === 'running' && isJobLockExpired(job, SCHEDULER_LOCK_TIMEOUT_MS);
      const isDue = isJobDue(job);

      if (!isDue && !isStaleRunning) continue;

      job.status = 'running';
      job.locked_at = lockTimestamp;
      job.locked_by = workerId;
      job.attempts = (job.attempts || 0) + 1;
      job.updated_at = lockTimestamp;
    }

    writeSchedulerJobs(projectName, jobs);

    // Phase 2: execute locked jobs and update status
    for (const job of jobs) {
      if (job.status !== 'running' || job.locked_by !== workerId) continue;

      const executionTimestamp = new Date().toISOString();

      try {
        const result = executeJobBridge(job);
        job.status = 'completed';
        job.execution_state = result.execution_state || 'completed';
        job.last_error = null;
        job.locked_at = null;
        job.locked_by = null;
        job.updated_at = executionTimestamp;

        const logPath = writeSchedulerAuditLog(projectName, {
          job_id: job.id,
          action: 'job_executed',
          status: 'completed',
          result_reference: result
        });

        let intelligenceUpdate = null;
        try {
          intelligenceUpdate = updateIntelligenceLoop(projectName, {
            trigger: 'job_completed',
            jobRecord: job,
            executionResult: result
          });
        } catch (intelligenceError) {
          writeSchedulerAuditLog(projectName, {
            job_id: job.id,
            action: 'intelligence_loop_failed',
            status: 'non_fatal',
            error: intelligenceError.message || 'Intelligence loop update failed'
          });
        }

        results.push({
          job_id: job.id,
          type: job.type,
          status: 'completed',
          execution_state: job.execution_state,
          intelligence_alerts: intelligenceUpdate?.alerts?.length || 0,
          log: logPath
        });
      } catch (err) {
        const errorMessage = sanitizeErrorMessage(err.message, 'Job execution failed');
        const canRetry = job.attempts < job.max_attempts;
        const executionTimestamp2 = new Date().toISOString();

        job.status = canRetry ? 'retryable' : 'failed';
        job.execution_state = 'failed';
        job.last_error = errorMessage;
        job.locked_at = null;
        job.locked_by = null;
        job.updated_at = executionTimestamp2;

        const logPath = writeSchedulerAuditLog(projectName, {
          job_id: job.id,
          action: 'job_failed',
          status: job.status,
          error: errorMessage,
          result_reference: {
            attempts: job.attempts,
            max_attempts: job.max_attempts,
            can_retry: canRetry
          }
        });

        results.push({
          job_id: job.id,
          type: job.type,
          status: job.status,
          attempts: job.attempts,
          max_attempts: job.max_attempts,
          last_error: errorMessage,
          log: logPath
        });
      }
    }

    writeSchedulerJobs(projectName, jobs);

    return res.json({
      ok: true,
      project: projectName,
      worker_id: workerId,
      processed: results.length,
      results
    });
  } catch (error) {
    return sendError(res, {
      statusCode: getErrorStatusCode(error, 400),
      code: error.code || 'WORKER_RUN_FAILED',
      message: error.message || 'Failed to run scheduler worker'
    });
  }
});

app.post('/record_execution_feedback', (req, res) => {
  try {
    const projectName = requireProjectContext(req, { allowFallback: false });
    const jobId = String(req.body?.job_id || '').trim();
    const channel = String(req.body?.channel || '').trim().toLowerCase();
    const metrics = req.body?.metrics;

    if (!jobId) {
      const err = new Error('Missing job_id');
      err.statusCode = 400;
      err.code = 'JOB_ID_MISSING';
      throw err;
    }

    if (!channel) {
      const err = new Error('Missing channel');
      err.statusCode = 400;
      err.code = 'CHANNEL_MISSING';
      throw err;
    }

    if (!metrics || typeof metrics !== 'object') {
      const err = new Error('Missing metrics object');
      err.statusCode = 400;
      err.code = 'METRICS_MISSING';
      throw err;
    }

    const required = ['impressions', 'clicks', 'engagement', 'conversions', 'revenue'];
    for (const key of required) {
      if (!Object.prototype.hasOwnProperty.call(metrics, key)) {
        const err = new Error(`metrics.${key} is required`);
        err.statusCode = 400;
        err.code = 'METRICS_FIELD_MISSING';
        throw err;
      }
    }

    const appended = appendPerformanceRecord(projectName, {
      job_id: jobId,
      channel,
      campaign_id: req.body?.campaign_id,
      product_slug: req.body?.product_slug,
      hook: req.body?.hook,
      metrics
    });

    const update = updateIntelligenceLoop(projectName, {
      trigger: 'feedback_recorded',
      feedbackRecord: appended.record
    });

    return res.status(201).json({
      ok: true,
      project: projectName,
      total_records: appended.total_records,
      feedback_record: appended.record,
      intelligence: {
        learning_updates: update.learning_updates.length,
        recommendation_alerts: update.alerts.length
      },
      analytics_file: getIntelligencePaths(projectName).performancePath
    });
  } catch (error) {
    return sendError(res, {
      statusCode: getErrorStatusCode(error, 400),
      code: error.code || 'RECORD_EXECUTION_FEEDBACK_FAILED',
      message: error.message || 'Failed to record execution feedback'
    });
  }
});

app.get('/get_performance_summary', (req, res) => {
  try {
    const projectName = requireProjectContext(req, { allowFallback: false });
    const summary = buildPerformanceSummary(projectName);

    return res.json({
      ok: true,
      project: projectName,
      summary
    });
  } catch (error) {
    return sendError(res, {
      statusCode: getErrorStatusCode(error, 400),
      code: error.code || 'GET_PERFORMANCE_SUMMARY_FAILED',
      message: error.message || 'Failed to build performance summary'
    });
  }
});

app.post('/generate_optimization_recommendations', (req, res) => {
  try {
    const projectName = requireProjectContext(req, { allowFallback: false });
    const update = updateIntelligenceLoop(projectName, {
      trigger: 'recommendation_requested'
    });

    return res.json({
      ok: true,
      project: projectName,
      recommendations: {
        what_to_stop: update.recommendations.stop,
        what_to_scale: update.recommendations.scale,
        what_to_improve: update.recommendations.improve,
        new_angles_to_test: update.recommendations.new_angles_to_test
      },
      risk_alerts: update.recommendations.alerts,
      based_on: update.recommendations.based_on
    });
  } catch (error) {
    return sendError(res, {
      statusCode: getErrorStatusCode(error, 400),
      code: error.code || 'GENERATE_OPTIMIZATION_RECOMMENDATIONS_FAILED',
      message: error.message || 'Failed to generate optimization recommendations'
    });
  }
});

app.post('/api/media/improve-prompt', async (req, res) => {
  try {
    const result = await mediaProviderLayer.improvePrompt(req.body || {});
    if (!result.ok && result.status === 'provider_not_configured') {
      return res.status(200).json(result);
    }

    const persisted = maybePersistMediaGenerationResult(req, {
      requestType: asString(req.body?.request_type || 'image'),
      output: { improved_prompt: result.improved_prompt },
      status: 'prompt_ready'
    });

    return res.json({
      ok: true,
      status: 'prompt_ready',
      improved_prompt: result.improved_prompt,
      provider: result.provider,
      model: result.model,
      ...(persisted || {})
    });
  } catch (error) {
    return sendError(res, {
      statusCode: getErrorStatusCode(error, 500),
      code: error.code || 'MEDIA_IMPROVE_PROMPT_FAILED',
      message: error.message || 'Failed to improve media prompt'
    });
  }
});

app.post('/api/media/brand-check', async (req, res) => {
  try {
    const result = await mediaProviderLayer.brandCheck(req.body || {});
    if (!result.ok && result.status === 'provider_not_configured') {
      return res.status(200).json(result);
    }

    const persisted = maybePersistMediaGenerationResult(req, {
      requestType: asString(req.body?.request_type || 'image'),
      output: { brand_check: result.brand_check },
      status: 'needs_review'
    });

    return res.json({
      ok: true,
      status: 'needs_review',
      brand_check: result.brand_check,
      provider: result.provider,
      model: result.model,
      ...(persisted || {})
    });
  } catch (error) {
    return sendError(res, {
      statusCode: getErrorStatusCode(error, 500),
      code: error.code || 'MEDIA_BRAND_CHECK_FAILED',
      message: error.message || 'Failed to run media brand check'
    });
  }
});

app.post('/api/media/generate-image', async (req, res) => {
  try {
    const result = await mediaProviderLayer.generateImage(req.body || {});
    if (!result.ok && result.status === 'provider_not_configured') {
      return res.status(200).json(result);
    }

    const persisted = maybePersistMediaGenerationResult(req, {
      requestType: 'image',
      output: result,
      status: 'needs_review'
    });

    return res.json({
      ok: true,
      status: 'needs_review',
      provider: result.provider,
      model: result.model,
      images: result.images,
      ...(persisted || {})
    });
  } catch (error) {
    return sendError(res, {
      statusCode: getErrorStatusCode(error, 500),
      code: error.code || 'MEDIA_GENERATE_IMAGE_FAILED',
      message: error.message || 'Failed to generate image'
    });
  }
});

app.post('/api/media/generate-video-brief', async (req, res) => {
  try {
    const result = await mediaProviderLayer.generateVideoBrief(req.body || {});
    if (!result.ok && result.status === 'provider_not_configured') {
      return res.status(200).json(result);
    }

    const persisted = maybePersistMediaGenerationResult(req, {
      requestType: 'video',
      output: { video_brief: result.video_brief },
      status: 'needs_review'
    });

    return res.json({
      ok: true,
      status: 'needs_review',
      provider: result.provider,
      model: result.model,
      video_brief: result.video_brief,
      ...(persisted || {})
    });
  } catch (error) {
    return sendError(res, {
      statusCode: getErrorStatusCode(error, 500),
      code: error.code || 'MEDIA_GENERATE_VIDEO_BRIEF_FAILED',
      message: error.message || 'Failed to generate video brief'
    });
  }
});

app.post('/api/media/generate-voice-script', async (req, res) => {
  try {
    const result = await mediaProviderLayer.generateVoiceScript(req.body || {});
    if (!result.ok && result.status === 'provider_not_configured') {
      return res.status(200).json(result);
    }

    const persisted = maybePersistMediaGenerationResult(req, {
      requestType: 'audio',
      output: { voice_script: result.voice_script },
      status: 'needs_review'
    });

    return res.json({
      ok: true,
      status: 'needs_review',
      provider: result.provider,
      model: result.model,
      voice_script: result.voice_script,
      ...(persisted || {})
    });
  } catch (error) {
    return sendError(res, {
      statusCode: getErrorStatusCode(error, 500),
      code: error.code || 'MEDIA_GENERATE_VOICE_SCRIPT_FAILED',
      message: error.message || 'Failed to generate voice script'
    });
  }
});

app.post('/api/media/generate-campaign-pack', async (req, res) => {
  try {
    const result = await mediaProviderLayer.generateCampaignPack(req.body || {});
    if (!result.ok && result.status === 'provider_not_configured') {
      return res.status(200).json(result);
    }

    const persisted = maybePersistMediaGenerationResult(req, {
      requestType: 'multi_format',
      output: { campaign_pack: result.campaign_pack },
      status: 'needs_review'
    });

    return res.json({
      ok: true,
      status: 'needs_review',
      provider: result.provider,
      model: result.model,
      campaign_pack: result.campaign_pack,
      ...(persisted || {})
    });
  } catch (error) {
    return sendError(res, {
      statusCode: getErrorStatusCode(error, 500),
      code: error.code || 'MEDIA_GENERATE_CAMPAIGN_PACK_FAILED',
      message: error.message || 'Failed to generate campaign pack'
    });
  }
});

app.get('/get_smart_suggestions', (req, res) => {
  try {
    const projectName = requireProjectContext(req, { allowFallback: false });
    const suggestions = buildSmartSuggestions(projectName);

    return res.json({
      ok: true,
      project: projectName,
      suggestions
    });
  } catch (error) {
    return sendError(res, {
      statusCode: getErrorStatusCode(error, 400),
      code: error.code || 'GET_SMART_SUGGESTIONS_FAILED',
      message: error.message || 'Failed to get smart suggestions'
    });
  }
});

// ─── END PHASE 4 ─────────────────────────────────────────────────────────────

app.use((err, req, res, next) => {
  const statusCode = getErrorStatusCode(err, 500);
  const explicitCode = String(err?.code || '').trim();
  const stableCode = explicitCode && /^[A-Z0-9_]+$/.test(explicitCode)
    ? explicitCode
    : statusCode >= 500
    ? 'INTERNAL_ERROR'
    : 'REQUEST_ERROR';

  const isProduction = String(process.env.NODE_ENV || '').trim().toLowerCase() === 'production';
  const responseMessage = statusCode >= 500 && isProduction
    ? 'Internal server error'
    : sanitizeErrorMessage(err?.message, 'Request failed');

  appLogger.error('unhandled_request_error', {
    route: req?.path || 'unknown',
    action: 'global_error_handler',
    method: req?.method || 'unknown',
    statusCode,
    error: serializeErrorForLog(err)
  });

  if (res.headersSent) {
    return next(err);
  }

  return res.status(statusCode).json({
    ok: false,
    error: {
      code: stableCode,
      message: responseMessage
    }
  });
});

if (require.main === module) {
  const server = app.listen(PORT, () => {
    appLogger.info('service_started', {
      route: '/health',
      action: 'listen',
      port: Number(PORT)
    });
  });

  process.on('SIGTERM', () => {
    appLogger.info('sigterm_received', { route: 'process', action: 'shutdown' });
    server.close((err) => {
      if (err) {
        appLogger.error('shutdown_error', {
          route: 'process',
          action: 'shutdown',
          error: serializeErrorForLog(err)
        });
        process.exit(1);
      }
      appLogger.info('shutdown_complete', { route: 'process', action: 'shutdown' });
      process.exit(0);
    });
  });
}

module.exports = {
  app,
  __stability: {
    createProject,
    updateProjectSetup,
    reviewProject,
    reviewProjectReadiness,
    reviewProjectSources,
    reviewProjectCanonicalParity,
    ensureProjectBaselineFiles,
    getProjectBaselinePaths,
    registerProjectAsset,
    listProjectAssets,
    setProjectSourceOfTruth,
    readCanonicalJsonWithLegacyFallback,
    getProductIntelligencePaths,
    buildGermanLaunchPlan,
    buildLaunchWave,
    selectLaunchReadyProducts,
    buildCampaignExecutionPackage,
    buildCampaignMediaJob,
    buildCampaignEmailPackage,
    buildCampaignPublishPackage,
    recordManualPublish,
    reviewCampaignFinalization,
    readJsonFile,
    writeJsonFile,
    upsertCampaign
  }
};

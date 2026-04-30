const fs = require('fs');
const path = require('path');
const {
  normalizeProjectSlug,
  resolveProjectPath,
  isPathWithinRoot
} = require('../security/project-isolation');

const DATA_ROOT = '/opt/mh-assistant/data';
const PROJECTS_ROOT = path.join(DATA_ROOT, 'projects');
const EXECUTION_ROOT = path.join(DATA_ROOT, 'execution', 'projects');
const LEGACY_ROOT = path.join(DATA_ROOT, 'brand-assets');

function parseBooleanFlag(value, defaultValue) {
  if (value == null || value === '') {
    return defaultValue;
  }

  const normalized = String(value).trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
  return defaultValue;
}

class UnifiedDataPathResolver {
  constructor(options = {}) {
    this.logger = options.logger || console;
    this.featureFlags = {
      execution_canonical_write: parseBooleanFlag(
        process.env.EXECUTION_CANONICAL_WRITE,
        true
      ),
      execution_canonical_read: parseBooleanFlag(
        process.env.EXECUTION_CANONICAL_READ,
        false
      ),
      legacy_mirror_write: parseBooleanFlag(
        process.env.LEGACY_MIRROR_WRITE,
        true
      ),
      legacy_fallback_read: parseBooleanFlag(
        process.env.LEGACY_FALLBACK_READ,
        true
      ),
      generated_read_canonical_first: parseBooleanFlag(
        process.env.GENERATED_READ_CANONICAL_FIRST,
        true
      ),
      publishing_read_canonical_first: parseBooleanFlag(
        process.env.PUBLISHING_READ_CANONICAL_FIRST,
        true
      ),
      email_read_canonical_first: parseBooleanFlag(
        process.env.EMAIL_READ_CANONICAL_FIRST,
        true
      ),
      channel_packages_read_canonical_first: parseBooleanFlag(
        process.env.CHANNEL_PACKAGES_READ_CANONICAL_FIRST,
        true
      ),
      campaign_execution_read_canonical_first: parseBooleanFlag(
        process.env.CAMPAIGN_EXECUTION_READ_CANONICAL_FIRST,
        true
      ),
      campaign_finalization_read_canonical_first: parseBooleanFlag(
        process.env.CAMPAIGN_FINALIZATION_READ_CANONICAL_FIRST,
        true
      ),
      execution_results_read_canonical_first: parseBooleanFlag(
        process.env.EXECUTION_RESULTS_READ_CANONICAL_FIRST,
        true
      )
    };

    this.telemetry = {
      resolution_count: 0,
      by_mode: {
        project: 0,
        execution: 0,
        legacy: 0,
        mixed: 0
      },
      root_usage: {
        read: {
          project: 0,
          execution: 0,
          legacy: 0,
          mixed: 0
        },
        write: {
          project: 0,
          execution: 0,
          legacy: 0,
          mixed: 0
        }
      },
      fallback_reads: 0,
      decisions: []
    };
  }

  getFeatureFlags() {
    return { ...this.featureFlags };
  }

  getDomainReadFlagName(domain) {
    const normalized = String(domain || '').trim().toLowerCase();

    const map = {
      generated: 'generated_read_canonical_first',
      publishing: 'publishing_read_canonical_first',
      email: 'email_read_canonical_first',
      channels: 'channel_packages_read_canonical_first',
      'campaign-execution': 'campaign_execution_read_canonical_first',
      'campaign-finalization': 'campaign_finalization_read_canonical_first',
      'execution-results': 'execution_results_read_canonical_first'
    };

    return map[normalized] || null;
  }

  getDomainReadPolicy(domain) {
    const normalized = String(domain || '').trim().toLowerCase();
    const flagName = this.getDomainReadFlagName(normalized);
    const featureFlags = this.getFeatureFlags();

    const domainCanonicalFirst =
      flagName == null ? false : !!featureFlags[flagName];

    return {
      domain: normalized,
      flagName,
      domainCanonicalFirst,
      executionCanonicalReadMaster: !!featureFlags.execution_canonical_read,
      legacyFallbackRead: !!featureFlags.legacy_fallback_read,
      effectiveCanonicalFirst: domainCanonicalFirst
    };
  }

  isDomainCanonicalFirstReadEnabled(domain) {
    return this.getDomainReadPolicy(domain).effectiveCanonicalFirst;
  }

  getTelemetrySnapshot() {
    return JSON.parse(JSON.stringify(this.telemetry));
  }

  resolve(projectName, options = {}) {
    const safeProject = normalizeProjectSlug(projectName);
    const domain = String(options.domain || 'media').trim().toLowerCase();
    const operation = String(options.operation || 'read').trim().toLowerCase();

    const roots = this.buildProjectRoots(safeProject);
    const hasProjectProfile = fs.existsSync(path.join(roots.projectRoot, 'project.json'));

    const decision = this.pickRoots({
      domain,
      operation,
      roots,
      hasProjectProfile
    });

    const mode = this.determineMode(decision.activeReadPath, decision.activeWritePath, decision.mirrorWritePath, roots);

    const result = {
      projectRoot: roots.projectRoot,
      executionRoot: roots.executionRoot,
      legacyRoot: roots.legacyRoot,
      activeReadPath: decision.activeReadPath,
      activeWritePath: decision.activeWritePath,
      mode,
      featureFlags: this.getFeatureFlags(),
      telemetry: {
        domain,
        operation,
        reason: decision.reason,
        fallbackUsed: !!decision.fallbackUsed,
        mirrorWritePath: decision.mirrorWritePath || null
      }
    };

    this.recordTelemetry({
      project: safeProject,
      domain,
      operation,
      mode,
      activeReadPath: result.activeReadPath,
      activeWritePath: result.activeWritePath,
      fallbackUsed: !!decision.fallbackUsed,
      reason: decision.reason
    });

    return result;
  }

  buildProjectRoots(projectName) {
    const safeProject = normalizeProjectSlug(projectName);
    return {
      projectRoot: resolveProjectPath(PROJECTS_ROOT, safeProject).projectRoot,
      executionRoot: resolveProjectPath(EXECUTION_ROOT, safeProject).projectRoot,
      legacyRoot: resolveProjectPath(LEGACY_ROOT, safeProject).projectRoot
    };
  }

  pickRoots(context) {
    const { domain, operation, roots, hasProjectProfile } = context;

    if (domain === 'project-control') {
      return {
        activeReadPath: roots.projectRoot,
        activeWritePath: roots.projectRoot,
        reason: 'project-control-always-project-root',
        fallbackUsed: false,
        mirrorWritePath: null
      };
    }

    if (domain === 'media') {
      const mediaProjectRoot = path.join(roots.projectRoot, 'brand-assets');
      const mediaReadRoot = hasProjectProfile ? mediaProjectRoot : roots.legacyRoot;

      return {
        activeReadPath: mediaReadRoot,
        activeWritePath: mediaReadRoot,
        reason: hasProjectProfile
          ? 'media-project-profile-present'
          : 'media-legacy-fallback-no-project-profile',
        fallbackUsed: !hasProjectProfile,
        mirrorWritePath: null
      };
    }

    const executionEligibleDomains = new Set([
      'generated',
      'publishing',
      'email',
      'channels',
      'campaign-execution',
      'campaign-finalization',
      'execution-config',
      'execution-results',
      'german-launch',
      'optimization'
    ]);

    if (!executionEligibleDomains.has(domain)) {
      return {
        activeReadPath: roots.legacyRoot,
        activeWritePath: roots.legacyRoot,
        reason: 'unknown-domain-default-legacy',
        fallbackUsed: false,
        mirrorWritePath: null
      };
    }

    let activeReadPath = roots.legacyRoot;
    let activeWritePath = roots.legacyRoot;
    let fallbackUsed = false;
    let mirrorWritePath = null;
    const reasonParts = [];

    if (this.featureFlags.execution_canonical_read) {
      activeReadPath = roots.executionRoot;
      reasonParts.push('execution-canonical-read-enabled');

      if (!fs.existsSync(activeReadPath) && this.featureFlags.legacy_fallback_read) {
        activeReadPath = roots.legacyRoot;
        fallbackUsed = true;
        reasonParts.push('legacy-fallback-read-used');
      }
    } else {
      reasonParts.push('execution-canonical-read-disabled');
    }

    if (this.featureFlags.execution_canonical_write) {
      activeWritePath = roots.executionRoot;
      reasonParts.push('execution-canonical-write-enabled');

      if (this.featureFlags.legacy_mirror_write) {
        mirrorWritePath = roots.legacyRoot;
        reasonParts.push('legacy-mirror-write-enabled');
      }
    } else {
      activeWritePath = roots.legacyRoot;
      reasonParts.push('execution-canonical-write-disabled');
    }

    if (operation === 'read') {
      reasonParts.push('read-operation');
    } else if (operation === 'write') {
      reasonParts.push('write-operation');
    }

    return {
      activeReadPath,
      activeWritePath,
      fallbackUsed,
      mirrorWritePath,
      reason: reasonParts.join('|')
    };
  }

  determineMode(readPath, writePath, mirrorWritePath, roots) {
    const readKind = this.rootKind(readPath, roots);
    const writeKind = this.rootKind(writePath, roots);

    if (mirrorWritePath) {
      return 'mixed';
    }

    if (readKind === writeKind) {
      return readKind;
    }

    return 'mixed';
  }

  rootKind(targetPath, roots) {
    if (!targetPath) return 'mixed';
    if (isPathWithinRoot(roots.projectRoot, targetPath)) return 'project';
    if (isPathWithinRoot(roots.executionRoot, targetPath)) return 'execution';
    if (isPathWithinRoot(roots.legacyRoot, targetPath)) return 'legacy';
    return 'mixed';
  }

  recordTelemetry(entry) {
    this.telemetry.resolution_count += 1;

    if (this.telemetry.by_mode[entry.mode] != null) {
      this.telemetry.by_mode[entry.mode] += 1;
    }

    const readKind = this.rootKind(entry.activeReadPath, {
      projectRoot: path.join(PROJECTS_ROOT, entry.project),
      executionRoot: path.join(EXECUTION_ROOT, entry.project),
      legacyRoot: path.join(LEGACY_ROOT, entry.project)
    });

    const writeKind = this.rootKind(entry.activeWritePath, {
      projectRoot: path.join(PROJECTS_ROOT, entry.project),
      executionRoot: path.join(EXECUTION_ROOT, entry.project),
      legacyRoot: path.join(LEGACY_ROOT, entry.project)
    });

    if (this.telemetry.root_usage.read[readKind] != null) {
      this.telemetry.root_usage.read[readKind] += 1;
    }

    if (this.telemetry.root_usage.write[writeKind] != null) {
      this.telemetry.root_usage.write[writeKind] += 1;
    }

    if (entry.fallbackUsed) {
      this.telemetry.fallback_reads += 1;
    }

    this.telemetry.decisions.push({
      timestamp: new Date().toISOString(),
      ...entry
    });

    if (this.telemetry.decisions.length > 1000) {
      this.telemetry.decisions = this.telemetry.decisions.slice(-1000);
    }

    this.logger.info(
      `[UnifiedDataPathResolver] project=${entry.project} domain=${entry.domain} op=${entry.operation} mode=${entry.mode} read=${entry.activeReadPath} write=${entry.activeWritePath} fallback=${entry.fallbackUsed ? 'yes' : 'no'} reason=${entry.reason}`
    );
  }
}

module.exports = {
  UnifiedDataPathResolver
};

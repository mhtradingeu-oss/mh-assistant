const fs = require('fs');
const path = require('path');

const DOMAIN_BASES = {
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

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function normalizeProjectName(projectName) {
  const safeProject = String(projectName || '').trim().toLowerCase();
  if (!safeProject) {
    throw new Error('Invalid project name');
  }

  return safeProject;
}

function buildBasePath(rootPath, subPath) {
  if (!subPath) return rootPath;
  return path.join(rootPath, subPath);
}

class ExecutionArtifactWriterAdapter {
  constructor(options = {}) {
    this.resolver = options.resolver;
    this.logger = options.logger || console;

    if (!this.resolver) {
      throw new Error('ExecutionArtifactWriterAdapter requires a resolver instance');
    }
  }

  writeJson(params = {}) {
    const payload = JSON.stringify(params.data, null, 2);
    return this.writeText({
      ...params,
      payload,
      encoding: 'utf8'
    });
  }

  writeText(params = {}) {
    return this.writeDual(params, (targetPath, payload, encoding) => {
      ensureDir(path.dirname(targetPath));
      fs.writeFileSync(targetPath, payload, encoding || 'utf8');
    });
  }

  writeBuffer(params = {}) {
    return this.writeDual(params, (targetPath, payload) => {
      ensureDir(path.dirname(targetPath));
      fs.writeFileSync(targetPath, payload);
    });
  }

  writeDual(params = {}, writer) {
    const safeProject = normalizeProjectName(params.project);
    const domain = String(params.domain || '').trim().toLowerCase();
    const artifactType = String(params.artifactType || 'artifact').trim();
    const identifier = String(params.identifier || '').trim();
    const legacyPath = String(params.legacyPath || '').trim();

    if (!domain) {
      throw new Error('Domain is required for dual-write');
    }

    if (!legacyPath) {
      throw new Error('Legacy path is required for dual-write');
    }

    const resolution = this.resolver.resolve(safeProject, {
      domain,
      operation: 'write'
    });

    const flags = resolution.featureFlags || {};
    const paths = this.resolvePaths({
      project: safeProject,
      domain,
      legacyPath,
      resolution
    });

    const targets = [];

    if (flags.execution_canonical_write) {
      targets.push({
        root: 'canonical',
        targetPath: paths.canonicalPath
      });
    }

    if (flags.legacy_mirror_write || !flags.execution_canonical_write) {
      targets.push({
        root: 'legacy',
        targetPath: paths.legacyPath
      });
    }

    const result = {
      artifact_type: artifactType,
      identifier,
      project: safeProject,
      domain,
      flags,
      canonical_path: paths.canonicalPath,
      legacy_path: paths.legacyPath,
      writes: []
    };

    let hasFailure = false;

    for (const target of targets) {
      try {
        writer(target.targetPath, params.payload, params.encoding);
        result.writes.push({
          root: target.root,
          path: target.targetPath,
          status: 'success'
        });
      } catch (error) {
        hasFailure = true;
        result.writes.push({
          root: target.root,
          path: target.targetPath,
          status: 'failed',
          error: error.message
        });
      }
    }

    this.logDualWrite(result, resolution);

    if (hasFailure) {
      const details = result.writes
        .filter((entry) => entry.status === 'failed')
        .map((entry) => `${entry.root}:${entry.error}`)
        .join('; ');
      throw new Error(`Dual-write failure for ${artifactType} (${identifier || 'n/a'}): ${details}`);
    }

    return result;
  }

  resolvePaths(input = {}) {
    const domainConfig = DOMAIN_BASES[input.domain];

    if (!domainConfig) {
      throw new Error(`Unsupported dual-write domain: ${input.domain}`);
    }

    const legacyBase = buildBasePath(input.resolution.legacyRoot, domainConfig.legacy);
    const canonicalBase = buildBasePath(input.resolution.executionRoot, domainConfig.canonical);

    let relativePath = path.relative(legacyBase, input.legacyPath);

    if (relativePath.startsWith('..')) {
      relativePath = path.relative(input.resolution.legacyRoot, input.legacyPath);
    }

    if (relativePath.startsWith('..')) {
      throw new Error(`Legacy path ${input.legacyPath} is outside expected domain roots`);
    }

    const canonicalPath = path.join(canonicalBase, relativePath);

    return {
      canonicalPath,
      legacyPath: input.legacyPath
    };
  }

  logDualWrite(result, resolution) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      storage_origin: 'dual_write',
      mirrored_to_legacy: !!(resolution.featureFlags && resolution.featureFlags.legacy_mirror_write),
      schema_version: 'phase2-dual-write-v1',
      ...result
    };

    try {
      const telemetryDir = path.join(resolution.executionRoot, 'telemetry');
      ensureDir(telemetryDir);
      const telemetryPath = path.join(telemetryDir, 'dual-write-log.jsonl');
      fs.appendFileSync(telemetryPath, `${JSON.stringify(logEntry)}\n`, 'utf8');
    } catch (error) {
      this.logger.error(
        `[ExecutionArtifactWriterAdapter] failed to persist telemetry: ${error.message}`
      );
    }

    this.logger.info(
      `[ExecutionArtifactWriterAdapter] project=${result.project} domain=${result.domain} artifact=${result.artifact_type} id=${result.identifier || 'n/a'} canonical=${result.canonical_path} legacy=${result.legacy_path} statuses=${result.writes.map((entry) => `${entry.root}:${entry.status}`).join(',')}`
    );
  }
}

module.exports = {
  ExecutionArtifactWriterAdapter
};

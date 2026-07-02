const path = require('path');

const MAX_PROJECT_SLUG_LENGTH = 80;
const PROJECT_SLUG_PATTERN = /^[A-Za-z0-9_-]+$/;

function createProjectIsolationError(message, code) {
  const error = new Error(message);
  error.code = code;
  error.statusCode = 400;
  return error;
}

function decodeForms(value) {
  const forms = [String(value || '')];
  let current = forms[0];

  for (let index = 0; index < 3; index += 1) {
    try {
      const decoded = decodeURIComponent(current);
      if (decoded === current) {
        break;
      }
      forms.push(decoded);
      current = decoded;
    } catch (_error) {
      break;
    }
  }

  return forms;
}

function hasTraversalOrSeparator(value) {
  const source = String(value || '');
  if (!source) return false;

  if (source.includes('..')) return true;
  if (source.includes('/')) return true;
  if (source.includes('\\')) return true;
  if (path.isAbsolute(source)) return true;
  if (/^[A-Za-z]:[\\/]/.test(source)) return true;

  return false;
}

function normalizeProjectSlug(input) {
  const rawValue = String(input == null ? '' : input);
  const trimmedValue = rawValue.trim();

  if (!trimmedValue) {
    throw createProjectIsolationError('Invalid project slug', 'INVALID_PROJECT_SLUG');
  }

  if (trimmedValue.length > MAX_PROJECT_SLUG_LENGTH) {
    throw createProjectIsolationError('Invalid project slug', 'INVALID_PROJECT_SLUG');
  }

  const forms = decodeForms(trimmedValue);
  if (forms.some((candidate) => hasTraversalOrSeparator(candidate))) {
    throw createProjectIsolationError('Invalid project slug', 'INVALID_PROJECT_SLUG');
  }

  const normalized = trimmedValue.toLowerCase();
  if (!PROJECT_SLUG_PATTERN.test(normalized)) {
    throw createProjectIsolationError('Invalid project slug', 'INVALID_PROJECT_SLUG');
  }

  return normalized;
}

function isPathWithinRoot(rootPath, targetPath) {
  const root = path.resolve(rootPath);
  const target = path.resolve(targetPath);
  const relative = path.relative(root, target);

  if (!relative) return true;
  if (relative.startsWith('..')) return false;
  if (path.isAbsolute(relative)) return false;
  return true;
}

function resolvePathWithinRoot(rootPath, ...segments) {
  const root = path.resolve(rootPath);
  const target = path.resolve(root, ...segments.map((segment) => String(segment || '')));

  if (!isPathWithinRoot(root, target)) {
    throw createProjectIsolationError('Invalid project path', 'INVALID_PROJECT_PATH');
  }

  return target;
}

function resolveProjectPath(projectsRootPath, projectSlug, ...targetSegments) {
  const project = normalizeProjectSlug(projectSlug);
  const projectsRoot = path.resolve(projectsRootPath);
  const projectRoot = resolvePathWithinRoot(projectsRoot, project);

  const targetPath = targetSegments.length
    ? resolvePathWithinRoot(projectRoot, ...targetSegments)
    : projectRoot;

  return {
    project,
    projectsRoot,
    projectRoot,
    targetPath
  };
}

function isProjectSlugValidationError(error) {
  return !!error && (error.code === 'INVALID_PROJECT_SLUG' || error.code === 'INVALID_PROJECT_PATH');
}

module.exports = {
  MAX_PROJECT_SLUG_LENGTH,
  normalizeProjectSlug,
  resolvePathWithinRoot,
  resolveProjectPath,
  isPathWithinRoot,
  isProjectSlugValidationError
};

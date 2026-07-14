"use strict";

const fs = require("node:fs");
const path = require("node:path");
const {
  PROJECT_ID_REGEX,
  generateProjectId,
  validateProjectId
} = require("../workspace/workspace-contract");
const {
  normalizeProjectSlug,
  resolveProjectPath
} = require("../security/project-isolation");

const DEFAULT_PROJECTS_ROOT = path.resolve(__dirname, "../../../../data/projects");
const PROJECT_FILE_NAME = "project.json";
const PROJECT_IDENTITY_SCHEMA_VERSION = 1;
const PROJECT_IDENTITY_SOURCE = "project-runtime";
const MAX_GENERATION_ATTEMPTS = 5;

const PROJECT_IDENTITY_STATES = Object.freeze([
  "MISSING",
  "VALID",
  "VALID_METADATA_MISSING"
]);

const PROJECT_IDENTITY_ERROR_CODES = Object.freeze({
  INVALID_OPTIONS: "PROJECT_IDENTITY_INVALID_OPTIONS",
  CALLER_PROJECT_ID_FORBIDDEN: "PROJECT_IDENTITY_CALLER_PROJECT_ID_FORBIDDEN",
  PROJECT_NOT_FOUND: "PROJECT_NOT_FOUND",
  PROJECT_RECORD_INVALID: "PROJECT_RECORD_INVALID",
  PROJECT_IDENTITY_INVALID: "PROJECT_IDENTITY_INVALID",
  PROJECT_ID_COLLISION: "PROJECT_ID_COLLISION",
  PROJECT_ID_GENERATION_FAILED: "PROJECT_ID_GENERATION_FAILED",
  PROJECT_PATH_OUTSIDE_ROOT: "PROJECT_PATH_OUTSIDE_ROOT",
  PROJECT_SYMLINK_FORBIDDEN: "PROJECT_SYMLINK_FORBIDDEN",
  PROJECT_IDENTITY_WRITE_FAILED: "PROJECT_IDENTITY_WRITE_FAILED"
});

const SINGLE_WRITER_ASSUMPTION = Object.freeze({
  process_local_per_project_mutex: true,
  cross_process_guarantee: false,
  transactional_guarantee: false,
  required_writer_model: "SINGLE_WRITER"
});

class ProjectIdentityError extends Error {
  constructor(code, message, details) {
    super(message);
    this.name = "ProjectIdentityError";
    this.code = code;
    if (details !== undefined) this.details = details;
  }
}

function fail(code, message, details) {
  throw new ProjectIdentityError(code, message, details);
}

function isPlainObject(value) {
  return value !== null
    && typeof value === "object"
    && !Array.isArray(value)
    && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);
}

function normalizeOptions(options) {
  if (options === undefined) return {};
  if (!isPlainObject(options)) {
    fail(PROJECT_IDENTITY_ERROR_CODES.INVALID_OPTIONS, "Project identity options must be a plain object");
  }
  return options;
}

function rejectCallerProvidedProjectId(options) {
  for (const field of ["id", "project_id", "projectId"]) {
    if (Object.prototype.hasOwnProperty.call(options, field)) {
      fail(
        PROJECT_IDENTITY_ERROR_CODES.CALLER_PROJECT_ID_FORBIDDEN,
        `Caller-provided authoritative Project ID is forbidden: ${field}`,
        { field }
      );
    }
  }
}

function resolveProjectsRoot(options) {
  const normalized = normalizeOptions(options);
  const configuredRoot = normalized.projectsRoot === undefined
    ? DEFAULT_PROJECTS_ROOT
    : normalized.projectsRoot;
  if (typeof configuredRoot !== "string" || configuredRoot.trim() === "") {
    fail(PROJECT_IDENTITY_ERROR_CODES.INVALID_OPTIONS, "projectsRoot must be a non-empty path string");
  }
  return path.resolve(configuredRoot);
}

function assertPathWithinRoot(root, candidate) {
  const relative = path.relative(root, candidate);
  if (relative === "" || (!relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative))) {
    return candidate;
  }
  fail(PROJECT_IDENTITY_ERROR_CODES.PROJECT_PATH_OUTSIDE_ROOT, "Project identity path escaped its root", {
    root,
    candidate
  });
}

function resolveProjectIdentityPaths(projectSlug, options) {
  const projectsRoot = resolveProjectsRoot(options);
  let resolved;
  try {
    resolved = resolveProjectPath(projectsRoot, projectSlug, PROJECT_FILE_NAME);
  } catch (error) {
    fail(error.code || PROJECT_IDENTITY_ERROR_CODES.PROJECT_PATH_OUTSIDE_ROOT, error.message);
  }
  return Object.freeze({
    projectsRoot,
    project_slug: resolved.project,
    projectDirectory: assertPathWithinRoot(projectsRoot, resolved.projectRoot),
    projectFile: assertPathWithinRoot(projectsRoot, resolved.targetPath),
    tempFile: assertPathWithinRoot(projectsRoot, path.join(resolved.projectRoot, "project.json.identity.tmp"))
  });
}

function lstatIfPresent(targetPath) {
  try {
    return fs.lstatSync(targetPath);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

function assertRealDirectory(targetPath, missingCode) {
  const stat = lstatIfPresent(targetPath);
  if (!stat) fail(missingCode, "Project directory does not exist", { path: targetPath });
  if (stat.isSymbolicLink()) {
    fail(PROJECT_IDENTITY_ERROR_CODES.PROJECT_SYMLINK_FORBIDDEN, "Project identity cannot traverse symlinks", {
      path: targetPath
    });
  }
  if (!stat.isDirectory()) fail(missingCode, "Project path is not a directory", { path: targetPath });
  return stat;
}

function assertRealProjectFile(projectFile) {
  const stat = lstatIfPresent(projectFile);
  if (!stat) {
    fail(PROJECT_IDENTITY_ERROR_CODES.PROJECT_NOT_FOUND, "Project profile does not exist", {
      project_file: projectFile
    });
  }
  if (stat.isSymbolicLink()) {
    fail(PROJECT_IDENTITY_ERROR_CODES.PROJECT_SYMLINK_FORBIDDEN, "Project profile cannot be a symlink", {
      project_file: projectFile
    });
  }
  if (!stat.isFile()) {
    fail(PROJECT_IDENTITY_ERROR_CODES.PROJECT_RECORD_INVALID, "Project profile must be a regular file", {
      project_file: projectFile
    });
  }
  return stat;
}

function readProjectRecord(paths) {
  assertRealDirectory(paths.projectsRoot, PROJECT_IDENTITY_ERROR_CODES.PROJECT_NOT_FOUND);
  assertRealDirectory(paths.projectDirectory, PROJECT_IDENTITY_ERROR_CODES.PROJECT_NOT_FOUND);
  assertRealProjectFile(paths.projectFile);
  try {
    const record = JSON.parse(fs.readFileSync(paths.projectFile, "utf8"));
    if (!isPlainObject(record)) {
      fail(PROJECT_IDENTITY_ERROR_CODES.PROJECT_RECORD_INVALID, "Project profile must contain a JSON object");
    }
    return record;
  } catch (error) {
    if (error instanceof ProjectIdentityError) throw error;
    fail(PROJECT_IDENTITY_ERROR_CODES.PROJECT_RECORD_INVALID, `Project profile is not valid JSON: ${error.message}`, {
      project_file: paths.projectFile
    });
  }
}

function validateUtcTimestamp(value) {
  return typeof value === "string"
    && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)
    && !Number.isNaN(Date.parse(value));
}

function validateProjectIdentityMetadata(metadata) {
  if (!isPlainObject(metadata)) {
    fail(PROJECT_IDENTITY_ERROR_CODES.PROJECT_IDENTITY_INVALID, "project_identity must be an object");
  }
  const expectedFields = ["schema_version", "created_at", "source"];
  const keys = Object.keys(metadata);
  if (keys.length !== expectedFields.length || keys.some((key) => !expectedFields.includes(key))) {
    fail(PROJECT_IDENTITY_ERROR_CODES.PROJECT_IDENTITY_INVALID, "project_identity contains unknown or missing fields");
  }
  if (metadata.schema_version !== PROJECT_IDENTITY_SCHEMA_VERSION) {
    fail(PROJECT_IDENTITY_ERROR_CODES.PROJECT_IDENTITY_INVALID, "project_identity schema_version must equal 1");
  }
  if (!validateUtcTimestamp(metadata.created_at)) {
    fail(PROJECT_IDENTITY_ERROR_CODES.PROJECT_IDENTITY_INVALID, "project_identity created_at must be UTC ISO-8601");
  }
  if (metadata.source !== PROJECT_IDENTITY_SOURCE) {
    fail(PROJECT_IDENTITY_ERROR_CODES.PROJECT_IDENTITY_INVALID, "project_identity source is invalid");
  }
  return metadata;
}

function validateProjectIdentityRecord(record) {
  if (!isPlainObject(record)) {
    fail(PROJECT_IDENTITY_ERROR_CODES.PROJECT_RECORD_INVALID, "Project profile must be a JSON object");
  }
  const hasId = Object.prototype.hasOwnProperty.call(record, "project_id");
  const hasMetadata = Object.prototype.hasOwnProperty.call(record, "project_identity");

  if (!hasId && !hasMetadata) {
    return Object.freeze({ state: "MISSING", project_id: null, project_identity: null });
  }
  if (!hasId && hasMetadata) {
    fail(PROJECT_IDENTITY_ERROR_CODES.PROJECT_IDENTITY_INVALID, "project_identity cannot exist without project_id");
  }
  try {
    validateProjectId(record.project_id);
  } catch (error) {
    fail(PROJECT_IDENTITY_ERROR_CODES.PROJECT_IDENTITY_INVALID, "Existing project_id is malformed", {
      project_id: record.project_id,
      cause: error.code || null
    });
  }
  if (!hasMetadata) {
    return Object.freeze({
      state: "VALID_METADATA_MISSING",
      project_id: record.project_id,
      project_identity: null
    });
  }
  validateProjectIdentityMetadata(record.project_identity);
  return Object.freeze({
    state: "VALID",
    project_id: record.project_id,
    project_identity: record.project_identity
  });
}

function inspectProjectIdentity(projectSlug, options) {
  const paths = resolveProjectIdentityPaths(projectSlug, options);
  const record = readProjectRecord(paths);
  const identity = validateProjectIdentityRecord(record);
  if (identity.state !== "MISSING") {
    const identities = assertUniqueIdentityOwnership(scanProjectIdentities(options));
    const owner = identities.find((item) => item.project_id === identity.project_id);
    if (!owner || owner.project_slug !== paths.project_slug) {
      fail(PROJECT_IDENTITY_ERROR_CODES.PROJECT_ID_COLLISION, "Existing project_id ownership is not unique", {
        project_id: identity.project_id
      });
    }
  }
  return Object.freeze({
    project_slug: paths.project_slug,
    project_file: paths.projectFile,
    state: identity.state,
    project_id: identity.project_id,
    project_identity: identity.project_identity
  });
}

function readProjectIdentity(projectSlug, options) {
  const inspection = inspectProjectIdentity(projectSlug, options);
  if (inspection.state === "MISSING") return null;
  return Object.freeze({
    project_slug: inspection.project_slug,
    project_id: inspection.project_id,
    project_identity: inspection.project_identity,
    state: inspection.state
  });
}

function isCanonicalProjectDirectoryName(name) {
  if (typeof name !== "string" || name.startsWith(".")) return false;
  try {
    return normalizeProjectSlug(name) === name;
  } catch (_) {
    return false;
  }
}

function scanProjectIdentities(options) {
  const projectsRoot = resolveProjectsRoot(options);
  const rootStat = lstatIfPresent(projectsRoot);
  if (!rootStat || rootStat.isSymbolicLink() || !rootStat.isDirectory()) return [];

  const identities = [];
  for (const entry of fs.readdirSync(projectsRoot, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.isSymbolicLink() || !isCanonicalProjectDirectoryName(entry.name)) continue;
    const projectDirectory = path.join(projectsRoot, entry.name);
    const directoryStat = lstatIfPresent(projectDirectory);
    if (!directoryStat || directoryStat.isSymbolicLink() || !directoryStat.isDirectory()) continue;
    const projectFile = path.join(projectDirectory, PROJECT_FILE_NAME);
    const fileStat = lstatIfPresent(projectFile);
    if (!fileStat || fileStat.isSymbolicLink() || !fileStat.isFile()) continue;

    let record;
    try {
      record = JSON.parse(fs.readFileSync(projectFile, "utf8"));
    } catch (error) {
      fail(PROJECT_IDENTITY_ERROR_CODES.PROJECT_RECORD_INVALID, `Cannot validate Project ID ownership: ${error.message}`, {
        project_slug: entry.name,
        project_file: projectFile
      });
    }
    const identity = validateProjectIdentityRecord(record);
    if (identity.state === "MISSING") continue;
    identities.push(Object.freeze({
      project_slug: entry.name,
      project_id: identity.project_id,
      project_identity: identity.project_identity,
      state: identity.state,
      project_file: projectFile
    }));
  }
  identities.sort((left, right) => left.project_slug.localeCompare(right.project_slug));
  return identities;
}

function assertUniqueIdentityOwnership(identities) {
  const owners = new Map();
  for (const identity of identities) {
    const existingOwner = owners.get(identity.project_id);
    if (existingOwner) {
      fail(PROJECT_IDENTITY_ERROR_CODES.PROJECT_ID_COLLISION, "A project_id has multiple Project owners", {
        project_id: identity.project_id,
        project_slugs: [existingOwner, identity.project_slug]
      });
    }
    owners.set(identity.project_id, identity.project_slug);
  }
  return identities;
}

function listProjectIdentities(options) {
  return assertUniqueIdentityOwnership(scanProjectIdentities(options));
}

function findProjectById(projectId, options) {
  try {
    validateProjectId(projectId);
  } catch (error) {
    fail(PROJECT_IDENTITY_ERROR_CODES.PROJECT_IDENTITY_INVALID, "Lookup project_id is malformed", {
      project_id: projectId
    });
  }
  const identities = assertUniqueIdentityOwnership(scanProjectIdentities(options));
  const matches = identities.filter((identity) => identity.project_id === projectId);
  if (matches.length === 0) {
    return Object.freeze({ resolution: "UNRESOLVED", project_id: projectId, project: null });
  }
  return Object.freeze({
    resolution: "RESOLVED",
    project_id: projectId,
    project: Object.freeze({
      project_slug: matches[0].project_slug,
      project_identity: matches[0].project_identity,
      project_file: matches[0].project_file
    })
  });
}

function fsyncBestEffort(filePath) {
  let descriptor;
  try {
    descriptor = fs.openSync(filePath, "r+");
    fs.fsyncSync(descriptor);
  } catch (_) {
    // File flush is best-effort and is not a transaction or cross-process guarantee.
  } finally {
    if (descriptor !== undefined) {
      try { fs.closeSync(descriptor); } catch (_) { /* best-effort close */ }
    }
  }
}

function serializeIdentityInsertion(raw, currentRecord, identity) {
  const closingMatch = /}\s*$/.exec(raw);
  if (!closingMatch) {
    fail(PROJECT_IDENTITY_ERROR_CODES.PROJECT_RECORD_INVALID, "Project profile has no closing object boundary");
  }
  const additions = [];
  if (!Object.prototype.hasOwnProperty.call(currentRecord, "project_id")) {
    additions.push(`  "project_id": ${JSON.stringify(identity.project_id)}`);
  } else if (currentRecord.project_id !== identity.project_id) {
    fail(PROJECT_IDENTITY_ERROR_CODES.PROJECT_IDENTITY_INVALID, "Persisted project_id is immutable");
  }
  if (!Object.prototype.hasOwnProperty.call(currentRecord, "project_identity")) {
    additions.push(`  "project_identity": ${JSON.stringify(identity.project_identity)}`);
  }
  if (additions.length === 0) return raw;

  const hasExistingFields = Object.keys(currentRecord).length > 0;
  const insertion = `${hasExistingFields ? "," : ""}\n${additions.join(",\n")}\n`;
  return `${raw.slice(0, closingMatch.index)}${insertion}${raw.slice(closingMatch.index)}`;
}

function persistProjectIdentity(paths, currentRecord, identity) {
  const currentStat = assertRealProjectFile(paths.projectFile);
  const currentRaw = fs.readFileSync(paths.projectFile, "utf8");
  const serialized = serializeIdentityInsertion(currentRaw, currentRecord, identity);
  const nextRecord = {
    ...currentRecord,
    project_id: identity.project_id,
    project_identity: identity.project_identity
  };
  const validatedNextRecord = JSON.parse(serialized);
  validateProjectIdentityRecord(validatedNextRecord);
  let tempCreated = false;
  try {
    fs.writeFileSync(paths.tempFile, serialized, {
      encoding: "utf8",
      flag: "wx",
      mode: currentStat.mode & 0o777
    });
    tempCreated = true;
    fsyncBestEffort(paths.tempFile);
    fs.renameSync(paths.tempFile, paths.projectFile);
    tempCreated = false;
  } catch (error) {
    if (tempCreated) {
      try { fs.unlinkSync(paths.tempFile); } catch (_) { /* single-writer recovery is explicit */ }
    }
    fail(PROJECT_IDENTITY_ERROR_CODES.PROJECT_IDENTITY_WRITE_FAILED, `Project identity write failed: ${error.message}`, {
      project_file: paths.projectFile
    });
  }
  return nextRecord;
}

const projectMutexes = new Map();

async function withProjectMutex(key, operation) {
  const previous = projectMutexes.get(key) || Promise.resolve();
  let release;
  const gate = new Promise((resolve) => { release = resolve; });
  const tail = previous.catch(() => undefined).then(() => gate);
  projectMutexes.set(key, tail);
  await previous.catch(() => undefined);
  try {
    return await operation();
  } finally {
    release();
    if (projectMutexes.get(key) === tail) projectMutexes.delete(key);
  }
}

function buildProjectIdentityMetadata() {
  return Object.freeze({
    schema_version: PROJECT_IDENTITY_SCHEMA_VERSION,
    created_at: new Date().toISOString(),
    source: PROJECT_IDENTITY_SOURCE
  });
}

async function ensureProjectIdentityForAttach(projectSlug, options) {
  const normalizedOptions = normalizeOptions(options);
  rejectCallerProvidedProjectId(normalizedOptions);
  const paths = resolveProjectIdentityPaths(projectSlug, normalizedOptions);
  const lockKey = `${paths.projectsRoot}\u0000${paths.project_slug}`;

  return withProjectMutex(lockKey, async () => {
    // An explicit yield makes same-process callers contend on the per-Project lock.
    await Promise.resolve();
    const currentRecord = readProjectRecord(paths);
    const currentIdentity = validateProjectIdentityRecord(currentRecord);
    const existingIdentities = listProjectIdentities(normalizedOptions);

    if (currentIdentity.state !== "MISSING") {
      const owners = existingIdentities.filter((item) => item.project_id === currentIdentity.project_id);
      if (owners.length !== 1 || owners[0].project_slug !== paths.project_slug) {
        fail(PROJECT_IDENTITY_ERROR_CODES.PROJECT_ID_COLLISION, "Existing project_id ownership is not unique", {
          project_id: currentIdentity.project_id
        });
      }
      if (currentIdentity.state === "VALID") {
        return Object.freeze({
          created: false,
          metadata_created: false,
          project_slug: paths.project_slug,
          project_id: currentIdentity.project_id,
          project_identity: currentIdentity.project_identity,
          project_file: paths.projectFile
        });
      }

      const metadata = buildProjectIdentityMetadata();
      persistProjectIdentity(paths, currentRecord, {
        project_id: currentIdentity.project_id,
        project_identity: metadata
      });
      return Object.freeze({
        created: false,
        metadata_created: true,
        project_slug: paths.project_slug,
        project_id: currentIdentity.project_id,
        project_identity: metadata,
        project_file: paths.projectFile
      });
    }

    const ownedIds = new Set(existingIdentities.map((identity) => identity.project_id));
    let generatedId = null;
    for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt += 1) {
      const candidate = generateProjectId();
      if (!ownedIds.has(candidate)) {
        generatedId = candidate;
        break;
      }
    }
    if (!generatedId) {
      fail(
        PROJECT_IDENTITY_ERROR_CODES.PROJECT_ID_GENERATION_FAILED,
        `Unable to establish a unique project_id after ${MAX_GENERATION_ATTEMPTS} attempts`
      );
    }

    const metadata = buildProjectIdentityMetadata();
    persistProjectIdentity(paths, currentRecord, {
      project_id: generatedId,
      project_identity: metadata
    });
    return Object.freeze({
      created: true,
      metadata_created: true,
      project_slug: paths.project_slug,
      project_id: generatedId,
      project_identity: metadata,
      project_file: paths.projectFile
    });
  });
}

module.exports = Object.freeze({
  DEFAULT_PROJECTS_ROOT,
  PROJECT_FILE_NAME,
  PROJECT_ID_REGEX,
  PROJECT_IDENTITY_SCHEMA_VERSION,
  PROJECT_IDENTITY_SOURCE,
  MAX_GENERATION_ATTEMPTS,
  PROJECT_IDENTITY_STATES,
  PROJECT_IDENTITY_ERROR_CODES,
  SINGLE_WRITER_ASSUMPTION,
  ProjectIdentityError,
  resolveProjectIdentityPaths,
  readProjectIdentity,
  inspectProjectIdentity,
  ensureProjectIdentityForAttach,
  findProjectById,
  listProjectIdentities,
  validateProjectIdentityRecord
});

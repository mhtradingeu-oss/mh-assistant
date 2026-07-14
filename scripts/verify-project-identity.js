#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const identity = require("../runtime/orchestrator-service/lib/projects/project-identity");

const TEMP_BASE = fs.mkdtempSync(path.join(os.tmpdir(), "mh-project-identity-"));
const CREATED_AT = "2026-07-14T12:00:00.000Z";

function root(name) {
  return path.join(TEMP_BASE, name, "projects");
}

function metadata(overrides = {}) {
  return {
    schema_version: 1,
    created_at: CREATED_AT,
    source: "project-runtime",
    ...overrides
  };
}

function projectRecord(overrides = {}) {
  return {
    project_name: "Example Project",
    market: "Germany",
    language: "de",
    status: "initialized",
    tags: ["one", "two"],
    nested: {
      enabled: true,
      count: 7,
      nullable: null
    },
    ...overrides
  };
}

function writeProject(projectsRoot, slug, record, raw) {
  const projectDirectory = path.join(projectsRoot, slug);
  fs.mkdirSync(projectDirectory, { recursive: true });
  const projectFile = path.join(projectDirectory, "project.json");
  fs.writeFileSync(
    projectFile,
    raw === undefined ? `${JSON.stringify(record, null, 2)}\n` : raw,
    "utf8"
  );
  return { projectDirectory, projectFile };
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

async function assertRejectsCode(promiseFactory, code) {
  await assert.rejects(promiseFactory, (error) => {
    assert.equal(error.name, "ProjectIdentityError");
    assert.equal(error.code, code);
    return true;
  });
}

function assertThrowsCode(fn, code) {
  assert.throws(fn, (error) => {
    assert.equal(error.name, "ProjectIdentityError");
    assert.equal(error.code, code);
    return true;
  });
}

function assertInsideTemporaryRoot(targetPath) {
  const relative = path.relative(TEMP_BASE, targetPath);
  assert.equal(relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative), false);
}

async function run() {
  assert.match(`prj_${"a".repeat(32)}`, identity.PROJECT_ID_REGEX);
  assert.equal(identity.MAX_GENERATION_ATTEMPTS, 5);
  assert.deepEqual(identity.SINGLE_WRITER_ASSUMPTION, {
    process_local_per_project_mutex: true,
    cross_process_guarantee: false,
    transactional_guarantee: false,
    required_writer_model: "SINGLE_WRITER"
  });

  const pureRoot = root("pure-read");
  const pure = writeProject(pureRoot, "pure-project", projectRecord());
  const pureBytesBefore = fs.readFileSync(pure.projectFile);
  assert.equal(identity.readProjectIdentity("pure-project", { projectsRoot: pureRoot }), null);
  assert.equal(identity.inspectProjectIdentity("pure-project", { projectsRoot: pureRoot }).state, "MISSING");
  assert.deepEqual(identity.listProjectIdentities({ projectsRoot: pureRoot }), []);
  assert.deepEqual(fs.readFileSync(pure.projectFile), pureBytesBefore);
  assert.equal(Object.prototype.hasOwnProperty.call(readJson(pure.projectFile), "project_id"), false);

  const absentRoot = root("absent-root");
  assert.deepEqual(identity.listProjectIdentities({ projectsRoot: absentRoot }), []);
  assert.equal(fs.existsSync(absentRoot), false);
  assertThrowsCode(
    () => identity.readProjectIdentity("missing-project", { projectsRoot: absentRoot }),
    identity.PROJECT_IDENTITY_ERROR_CODES.PROJECT_NOT_FOUND
  );
  assert.equal(fs.existsSync(absentRoot), false);

  const missingFileRoot = root("missing-file");
  fs.mkdirSync(path.join(missingFileRoot, "missing-profile"), { recursive: true });
  assertThrowsCode(
    () => identity.readProjectIdentity("missing-profile", { projectsRoot: missingFileRoot }),
    identity.PROJECT_IDENTITY_ERROR_CODES.PROJECT_NOT_FOUND
  );
  await assertRejectsCode(
    () => identity.ensureProjectIdentityForAttach("missing-profile", { projectsRoot: missingFileRoot }),
    identity.PROJECT_IDENTITY_ERROR_CODES.PROJECT_NOT_FOUND
  );
  assert.equal(fs.existsSync(path.join(missingFileRoot, "missing-profile", "project.json")), false);

  const existingRoot = root("existing");
  const existingId = `prj_${"1".repeat(32)}`;
  const compactExisting = JSON.stringify(projectRecord({
    project_id: existingId,
    project_identity: metadata()
  }));
  const existing = writeProject(existingRoot, "existing-project", null, compactExisting);
  const existingBytesBefore = fs.readFileSync(existing.projectFile);
  const existingResult = await identity.ensureProjectIdentityForAttach("existing-project", {
    projectsRoot: existingRoot
  });
  assert.equal(existingResult.created, false);
  assert.equal(existingResult.metadata_created, false);
  assert.equal(existingResult.project_id, existingId);
  assert.deepEqual(fs.readFileSync(existing.projectFile), existingBytesBefore);

  const metadataMissingRoot = root("metadata-missing");
  const metadataMissingId = `prj_${"2".repeat(32)}`;
  const metadataMissing = writeProject(metadataMissingRoot, "legacy-id", projectRecord({
    project_id: metadataMissingId
  }));
  const metadataResult = await identity.ensureProjectIdentityForAttach("legacy-id", {
    projectsRoot: metadataMissingRoot
  });
  assert.equal(metadataResult.created, false);
  assert.equal(metadataResult.metadata_created, true);
  assert.equal(metadataResult.project_id, metadataMissingId);
  assert.deepEqual(readJson(metadataMissing.projectFile).project_identity, metadataResult.project_identity);

  const malformedRoot = root("malformed");
  writeProject(malformedRoot, "malformed-id", projectRecord({
    project_id: `prj_${"A".repeat(32)}`,
    project_identity: metadata()
  }));
  assertThrowsCode(
    () => identity.readProjectIdentity("malformed-id", { projectsRoot: malformedRoot }),
    identity.PROJECT_IDENTITY_ERROR_CODES.PROJECT_IDENTITY_INVALID
  );
  assertThrowsCode(
    () => identity.listProjectIdentities({ projectsRoot: malformedRoot }),
    identity.PROJECT_IDENTITY_ERROR_CODES.PROJECT_IDENTITY_INVALID
  );
  await assertRejectsCode(
    () => identity.ensureProjectIdentityForAttach("malformed-id", { projectsRoot: malformedRoot }),
    identity.PROJECT_IDENTITY_ERROR_CODES.PROJECT_IDENTITY_INVALID
  );

  const duplicateRoot = root("duplicate");
  const duplicateId = `prj_${"3".repeat(32)}`;
  for (const slug of ["duplicate-one", "duplicate-two"]) {
    writeProject(duplicateRoot, slug, projectRecord({
      project_id: duplicateId,
      project_identity: metadata()
    }));
  }
  assertThrowsCode(
    () => identity.listProjectIdentities({ projectsRoot: duplicateRoot }),
    identity.PROJECT_IDENTITY_ERROR_CODES.PROJECT_ID_COLLISION
  );
  assertThrowsCode(
    () => identity.readProjectIdentity("duplicate-one", { projectsRoot: duplicateRoot }),
    identity.PROJECT_IDENTITY_ERROR_CODES.PROJECT_ID_COLLISION
  );
  assertThrowsCode(
    () => identity.findProjectById(duplicateId, { projectsRoot: duplicateRoot }),
    identity.PROJECT_IDENTITY_ERROR_CODES.PROJECT_ID_COLLISION
  );
  await assertRejectsCode(
    () => identity.ensureProjectIdentityForAttach("duplicate-one", { projectsRoot: duplicateRoot }),
    identity.PROJECT_IDENTITY_ERROR_CODES.PROJECT_ID_COLLISION
  );

  const generatedRoot = root("generated");
  const generatedSlug = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  const originalBusinessRecord = projectRecord({
    project_name: "Rename-safe project",
    folders: { content: "/preserve/exact/value", assets: ["a", "b"] }
  });
  const generatedProject = writeProject(generatedRoot, generatedSlug, originalBusinessRecord);
  const generatedBytesBefore = fs.readFileSync(generatedProject.projectFile, "utf8");
  await assertRejectsCode(
    () => identity.ensureProjectIdentityForAttach(generatedSlug, {
      projectsRoot: generatedRoot,
      project_id: `prj_${"f".repeat(32)}`
    }),
    identity.PROJECT_IDENTITY_ERROR_CODES.CALLER_PROJECT_ID_FORBIDDEN
  );
  assert.deepEqual(readJson(generatedProject.projectFile), originalBusinessRecord);

  const generated = await identity.ensureProjectIdentityForAttach(generatedSlug, {
    projectsRoot: generatedRoot
  });
  assert.equal(generated.created, true);
  assert.match(generated.project_id, /^prj_[0-9a-f]{32}$/);
  assert.equal(generated.project_id, generated.project_id.toLowerCase());
  assert.notEqual(generated.project_id, `prj_${generatedSlug}`);
  assert.equal(generated.project_identity.source, "project-runtime");
  const persistedGenerated = readJson(generatedProject.projectFile);
  const generatedBytesAfter = fs.readFileSync(generatedProject.projectFile, "utf8");
  const originalClosingBrace = generatedBytesBefore.lastIndexOf("}");
  assert.equal(generatedBytesAfter.startsWith(generatedBytesBefore.slice(0, originalClosingBrace)), true);
  const addedKeys = Object.keys(persistedGenerated)
    .filter((key) => !Object.prototype.hasOwnProperty.call(originalBusinessRecord, key))
    .sort();
  assert.deepEqual(addedKeys, ["project_id", "project_identity"]);
  for (const [key, value] of Object.entries(originalBusinessRecord)) {
    assert.deepEqual(persistedGenerated[key], value);
  }
  assert.equal(fs.existsSync(path.join(generatedProject.projectDirectory, "project.json.identity.tmp")), false);

  const repeated = await identity.ensureProjectIdentityForAttach(generatedSlug, {
    projectsRoot: generatedRoot
  });
  assert.equal(repeated.created, false);
  assert.equal(repeated.project_id, generated.project_id);
  assert.deepEqual(readJson(generatedProject.projectFile).project_identity, generated.project_identity);

  const renamedSlug = "current-project-slug";
  const renamedDirectory = path.join(generatedRoot, renamedSlug);
  fs.renameSync(generatedProject.projectDirectory, renamedDirectory);
  const renamedIdentity = identity.readProjectIdentity(renamedSlug, { projectsRoot: generatedRoot });
  assert.equal(renamedIdentity.project_id, generated.project_id);
  assert.equal(readJson(path.join(renamedDirectory, "project.json")).project_name, "Rename-safe project");
  const resolution = identity.findProjectById(generated.project_id, { projectsRoot: generatedRoot });
  assert.equal(resolution.resolution, "RESOLVED");
  assert.equal(resolution.project.project_slug, renamedSlug);

  const unresolvedId = `prj_${"e".repeat(32)}`;
  const unresolved = identity.findProjectById(unresolvedId, { projectsRoot: generatedRoot });
  assert.deepEqual(unresolved, {
    resolution: "UNRESOLVED",
    project_id: unresolvedId,
    project: null
  });

  const outsideDirectory = path.join(TEMP_BASE, "outside-symlink-project");
  writeProject(path.dirname(outsideDirectory), path.basename(outsideDirectory), projectRecord({
    project_id: `prj_${"4".repeat(32)}`,
    project_identity: metadata()
  }));
  const symlinkSlug = "symlink-project";
  fs.symlinkSync(outsideDirectory, path.join(generatedRoot, symlinkSlug), "dir");
  writeProject(generatedRoot, "Bad Slug", projectRecord({
    project_id: `prj_${"5".repeat(32)}`,
    project_identity: metadata()
  }));
  writeProject(generatedRoot, ".hidden-project", projectRecord({
    project_id: `prj_${"6".repeat(32)}`,
    project_identity: metadata()
  }));
  writeProject(generatedRoot, "UPPERCASE", projectRecord({
    project_id: `prj_${"7".repeat(32)}`,
    project_identity: metadata()
  }));
  const listedAfterIgnoredEntries = identity.listProjectIdentities({ projectsRoot: generatedRoot });
  assert.deepEqual(listedAfterIgnoredEntries.map((item) => item.project_slug), [renamedSlug]);
  assertThrowsCode(
    () => identity.readProjectIdentity(symlinkSlug, { projectsRoot: generatedRoot }),
    identity.PROJECT_IDENTITY_ERROR_CODES.PROJECT_SYMLINK_FORBIDDEN
  );

  const mutexRoot = root("mutex");
  const mutexProject = writeProject(mutexRoot, "mutex-project", projectRecord());
  const concurrentResults = await Promise.all(Array.from({ length: 20 }, () => (
    identity.ensureProjectIdentityForAttach("mutex-project", { projectsRoot: mutexRoot })
  )));
  const concurrentIds = new Set(concurrentResults.map((item) => item.project_id));
  assert.equal(concurrentIds.size, 1);
  assert.equal(concurrentResults.filter((item) => item.created).length, 1);
  assert.equal(readJson(mutexProject.projectFile).project_id, concurrentResults[0].project_id);
  assert.equal(fs.existsSync(path.join(mutexProject.projectDirectory, "project.json.identity.tmp")), false);

  const resolvedPaths = identity.resolveProjectIdentityPaths("mutex-project", { projectsRoot: mutexRoot });
  assertInsideTemporaryRoot(resolvedPaths.projectFile);
  assert.notEqual(identity.DEFAULT_PROJECTS_ROOT, path.resolve(generatedRoot));

  const sourcePath = path.resolve(
    __dirname,
    "../runtime/orchestrator-service/lib/projects/project-identity.js"
  );
  const source = fs.readFileSync(sourcePath, "utf8");
  assert.doesNotMatch(source, /workspace_id|workspaces\.json|registry\.json/);
  assert.doesNotMatch(source, /(?:require|import)\s*\(?["'][^"']*(?:frontend|control-center|public\/)/i);
  assert.doesNotMatch(source, /\b(?:express|router|app)\s*\.\s*(?:use|get|post|put|patch|delete|route)\s*\(/i);
  assert.doesNotMatch(source, /\b(?:membership|permissions?|RBAC)\b/);

  console.log(JSON.stringify({
    result: "pass",
    temporary_project_root: TEMP_BASE,
    production_data_touched: false,
    checks: {
      pureReads: "pass",
      missingProjectProfile: "pass",
      validIdentityReuse: "pass",
      malformedIdentityFailClosed: "pass",
      duplicateIdentityFailClosed: "pass",
      lowercaseBackendGeneration: "pass",
      stableIdentity: "pass",
      noSlugDerivation: "pass",
      callerIdentityRejected: "pass",
      businessFieldsPreserved: "pass",
      renameStability: "pass",
      projectIdResolution: "pass",
      unresolvedResult: "pass",
      symlinkAndMalformedDiscoveryExclusion: "pass",
      processLocalMutex: "pass",
      authorityBoundaries: "pass"
    }
  }, null, 2));
}

run()
  .finally(() => {
    fs.rmSync(TEMP_BASE, { recursive: true, force: true });
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

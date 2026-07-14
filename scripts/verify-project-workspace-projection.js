#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const projectionRuntime = require(
  "../runtime/orchestrator-service/lib/projects/project-workspace-projection"
);
const projectIdentity = require("../runtime/orchestrator-service/lib/projects/project-identity");

const TEMP_BASE = fs.mkdtempSync(path.join(os.tmpdir(), "mh-project-workspace-projection-"));
const PROJECTED_AT = "2026-07-14T12:00:00.000Z";

function id(prefix, character) {
  return `${prefix}_${character.repeat(32)}`;
}

function metadata() {
  return { schema_version: 1, created_at: "2026-01-01T00:00:00.000Z", source: "project-runtime" };
}

function project(overrides = {}) {
  return {
    project_name: "Projection Test",
    market: "DE",
    language: "de",
    status: "initialized",
    updated_at: "2025-02-03T04:05:06.000Z",
    workspace_priorities: ["preserve", "exactly"],
    nested: { enabled: true, nullable: null, list: [1, 2, 3] },
    ...overrides
  };
}

function projection(overrides = {}) {
  return {
    projection_schema_version: 1,
    workspace_id: id("ws", "1"),
    relationship_id: id("wpr", "2"),
    relationship_status: "ATTACHED",
    workspace_version: 3,
    projected_at: PROJECTED_AT,
    authoritative: false,
    source_owner: "workspace-runtime",
    ...overrides
  };
}

function root(name) {
  return path.join(TEMP_BASE, name, "projects");
}

function writeProject(projectsRoot, slug, projectId, overrides = {}) {
  const directory = path.join(projectsRoot, slug);
  fs.mkdirSync(directory, { recursive: true });
  const record = project({
    project_id: projectId,
    project_identity: metadata(),
    ...overrides
  });
  const file = path.join(directory, "project.json");
  fs.writeFileSync(file, `${JSON.stringify(record, null, 2)}\n`, "utf8");
  return { directory, file, record };
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function options(projectsRoot, overrides = {}) {
  return { projectsRoot, now: () => PROJECTED_AT, ...overrides };
}

function fingerprint(value) {
  return projectionRuntime.createProjectWorkspaceProjectionFingerprint(value);
}

function assertProjectionError(fn, code, outcome) {
  return assert.rejects(fn, (error) => {
    assert.equal(error.name, "ProjectWorkspaceProjectionError");
    assert.equal(error.code, code);
    if (outcome !== undefined) assert.equal(error.outcome, outcome);
    return true;
  });
}

function assertProjectionThrow(fn, code, outcome) {
  assert.throws(fn, (error) => {
    assert.equal(error.name, "ProjectWorkspaceProjectionError");
    assert.equal(error.code, code);
    if (outcome !== undefined) assert.equal(error.outcome, outcome);
    return true;
  });
}

function verifySchemaAndFingerprint() {
  const valid = projectionRuntime.validateProjectWorkspaceProjection(projection());
  assert.deepEqual(Object.keys(valid), projectionRuntime.PROJECT_WORKSPACE_PROJECTION_FIELDS);
  assert.equal(projectionRuntime.PROJECT_WORKSPACE_PROJECTION_SCHEMA_VERSION, 1);
  assert.deepEqual(projectionRuntime.PROJECT_WORKSPACE_PROJECTION_STATUSES, ["ATTACHED", "DETACHED", "ARCHIVED"]);
  assert.equal(projectionRuntime.PROJECT_WORKSPACE_PROJECTION_SOURCE_OWNER, "workspace-runtime");
  assert.equal(Object.isFrozen(projectionRuntime.PROJECT_WORKSPACE_PROJECTION_FIELDS), true);

  for (const status of projectionRuntime.PROJECT_WORKSPACE_PROJECTION_STATUSES) {
    assert.equal(projectionRuntime.validateProjectWorkspaceProjection(projection({ relationship_status: status })).relationship_status, status);
  }
  for (const status of ["PENDING_ATTACH", "PENDING_DETACH", "UNKNOWN"]) {
    assertProjectionThrow(
      () => projectionRuntime.validateProjectWorkspaceProjection(projection({ relationship_status: status })),
      projectionRuntime.PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.STATUS_INVALID
    );
  }
  const invalidCases = [
    [projection({ projection_schema_version: 2 }), "SCHEMA_INVALID"],
    [projection({ workspace_id: id("ws", "A") }), "SCHEMA_INVALID"],
    [projection({ relationship_id: id("wpr", "A") }), "SCHEMA_INVALID"],
    [projection({ workspace_version: 0 }), "VERSION_INVALID"],
    [projection({ workspace_version: 1.5 }), "VERSION_INVALID"],
    [projection({ projected_at: "today" }), "SCHEMA_INVALID"],
    [projection({ authoritative: true }), "AUTHORITY_FLAG_INVALID"],
    [projection({ source_owner: "project-runtime" }), "SOURCE_INVALID"],
    [{ ...projection(), project_slug: "forbidden" }, "UNKNOWN_FIELD"],
    [{ ...projection(), validation_state: "MATCH" }, "UNKNOWN_FIELD"],
    [{ ...projection(), projection_revision: 1 }, "UNKNOWN_FIELD"],
    [{ ...projection(), attached_at: PROJECTED_AT }, "UNKNOWN_FIELD"],
    [{ ...projection(), actor: "caller" }, "UNKNOWN_FIELD"]
  ];
  for (const [candidate, key] of invalidCases) {
    assertProjectionThrow(
      () => projectionRuntime.validateProjectWorkspaceProjection(candidate),
      projectionRuntime.PROJECT_WORKSPACE_PROJECTION_ERROR_CODES[key]
    );
  }

  const base = projection();
  const first = fingerprint(base);
  assert.deepEqual(first, fingerprint({ ...base, projected_at: "2026-07-15T12:00:00.000Z" }));
  for (const [field, replacement] of [
    ["projection_schema_version", 2],
    ["workspace_id", id("ws", "3")],
    ["relationship_id", id("wpr", "4")],
    ["relationship_status", "DETACHED"],
    ["workspace_version", 4]
  ]) {
    if (field === "projection_schema_version") {
      assertProjectionThrow(
        () => fingerprint({ ...base, [field]: replacement }),
        projectionRuntime.PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.SCHEMA_INVALID
      );
    } else {
      assert.notDeepEqual(first, fingerprint({ ...base, [field]: replacement }));
    }
  }
  assert.equal(Object.prototype.hasOwnProperty.call(base, "projection_fingerprint"), false);
  assert.equal(Object.isFrozen(first), true);
}

function verifyReadAndInspection() {
  const projectsRoot = root("read");
  const projectId = id("prj", "1");
  const created = writeProject(projectsRoot, "read-project", projectId);
  const bytes = fs.readFileSync(created.file);

  assertProjectionThrow(
    () => projectionRuntime.readProjectWorkspaceProjection(projectId, options(projectsRoot)),
    projectionRuntime.PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.PROJECTION_MISSING
  );
  assert.equal(
    projectionRuntime.inspectProjectWorkspaceProjection({ project_id: projectId }, options(projectsRoot)).classification,
    "MISSING"
  );
  assert.deepEqual(fs.readFileSync(created.file), bytes);
  assert.equal(fs.existsSync(path.join(created.directory, "project.json.workspace-projection.tmp")), false);

  assertProjectionThrow(
    () => projectionRuntime.readProjectWorkspaceProjection(id("prj", "9"), options(projectsRoot)),
    projectionRuntime.PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.PROJECT_NOT_FOUND,
    projectionRuntime.PROJECT_WORKSPACE_PROJECTION_OUTCOMES.UNRESOLVED
  );
  assert.equal(fs.existsSync(root("absent-read")), false);
  assertProjectionThrow(
    () => projectionRuntime.inspectProjectWorkspaceProjection(
      { project_id: id("prj", "8") }, options(root("absent-read"))
    ),
    projectionRuntime.PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.PROJECT_NOT_FOUND
  );

  const stored = projection();
  fs.writeFileSync(created.file, `${JSON.stringify({ ...created.record, workspace_projection: stored }, null, 2)}\n`);
  const read = projectionRuntime.readProjectWorkspaceProjection(projectId, options(projectsRoot));
  read.workspace_projection.workspace_version = 999;
  assert.equal(readJson(created.file).workspace_projection.workspace_version, 3);
  assert.equal(projectionRuntime.inspectProjectWorkspaceProjection({
    project_id: projectId,
    expected_projection: stored
  }, options(projectsRoot)).classification, "MATCH");
  assert.equal(projectionRuntime.inspectProjectWorkspaceProjection({
    project_id: projectId,
    expected_projection: projection({ workspace_version: 4 })
  }, options(projectsRoot)).classification, "STALE");
  assert.equal(projectionRuntime.inspectProjectWorkspaceProjection({
    project_id: projectId,
    expected_projection: projection({ workspace_id: id("ws", "5") })
  }, options(projectsRoot)).classification, "CONFLICTING");
  assert.equal(projectionRuntime.inspectProjectWorkspaceProjection({
    project_id: projectId,
    expected_projection: projection({ workspace_version: 2 })
  }, options(projectsRoot)).classification, "CONFLICTING");

  const collisionRoot = root("collision");
  const collisionId = id("prj", "2");
  writeProject(collisionRoot, "collision-one", collisionId);
  writeProject(collisionRoot, "collision-two", collisionId);
  assertProjectionThrow(
    () => projectionRuntime.inspectProjectWorkspaceProjection({ project_id: collisionId }, options(collisionRoot)),
    projectionRuntime.PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.PROJECT_ID_COLLISION
  );
}

async function verifyWritesAndPreservation() {
  const projectsRoot = root("write");
  const projectId = id("prj", "3");
  const created = writeProject(projectsRoot, "write-project", projectId);
  const before = readJson(created.file);
  const desired = projection();
  await assertProjectionError(
    () => projectionRuntime.writeProjectWorkspaceProjection({ project_id: projectId, desired_projection: desired }, options(projectsRoot)),
    projectionRuntime.PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.EXPECTATION_REQUIRED
  );
  const first = await projectionRuntime.writeProjectWorkspaceProjection({
    project_id: projectId,
    desired_projection: desired,
    expected_current_projection: null
  }, options(projectsRoot));
  assert.equal(first.outcome, projectionRuntime.PROJECT_WORKSPACE_PROJECTION_OUTCOMES.WRITE_SUCCESS);
  assert.equal(first.changed, true);
  assert.equal(first.persistence.committed, true);
  assert.equal(typeof first.persistence, "object");
  assert.equal(first.workspace_projection.projected_at, PROJECTED_AT);
  const after = readJson(created.file);
  for (const [field, value] of Object.entries(before)) assert.deepEqual(after[field], value);
  assert.deepEqual(Object.keys(after).filter((field) => !Object.prototype.hasOwnProperty.call(before, field)), ["workspace_projection"]);
  assert.equal(after.updated_at, before.updated_at);
  assert.equal(after.project_id, projectId);
  assert.deepEqual(after.project_identity, before.project_identity);
  assert.equal(fs.existsSync(path.join(created.directory, "project.json.backup")), true);
  assert.deepEqual(readJson(path.join(created.directory, "project.json.backup")), before);

  await assertProjectionError(
    () => projectionRuntime.writeProjectWorkspaceProjection({
      project_id: projectId, desired_projection: projection({ workspace_version: 4 }), expected_current_projection: null
    }, options(projectsRoot)),
    projectionRuntime.PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.EXPECTATION_MISMATCH,
    projectionRuntime.PROJECT_WORKSPACE_PROJECTION_OUTCOMES.CONFLICT
  );
  await assertProjectionError(
    () => projectionRuntime.writeProjectWorkspaceProjection({
      project_id: projectId,
      desired_projection: projection({ workspace_version: 4 }),
      expected_current_projection: fingerprint(projection({ workspace_version: 2 }))
    }, options(projectsRoot)),
    projectionRuntime.PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.EXPECTATION_MISMATCH
  );
  const bytesBeforeNoop = fs.readFileSync(created.file);
  const backupBytesBeforeNoop = fs.readFileSync(path.join(created.directory, "project.json.backup"));
  const noop = await projectionRuntime.writeProjectWorkspaceProjection({
    project_id: projectId,
    desired_projection: { ...desired, projected_at: "2026-07-16T12:00:00.000Z" },
    expected_current_projection: fingerprint(desired)
  }, options(projectsRoot, { now: () => "2026-07-20T12:00:00.000Z" }));
  assert.equal(noop.outcome, projectionRuntime.PROJECT_WORKSPACE_PROJECTION_OUTCOMES.WRITE_NOOP);
  assert.equal(noop.changed, false);
  assert.equal(noop.persistence.write_attempted, false);
  assert.deepEqual(fs.readFileSync(created.file), bytesBeforeNoop);
  assert.deepEqual(fs.readFileSync(path.join(created.directory, "project.json.backup")), backupBytesBeforeNoop);
  assert.equal(noop.workspace_projection.projected_at, PROJECTED_AT);

  const detached = projection({ relationship_status: "DETACHED", workspace_version: 4 });
  const detachResult = await projectionRuntime.writeProjectWorkspaceProjection({
    project_id: projectId,
    desired_projection: detached,
    expected_current_projection: fingerprint(desired)
  }, options(projectsRoot));
  assert.equal(detachResult.workspace_projection.relationship_status, "DETACHED");
  assert.equal(detachResult.persistence.warnings.some((warning) => warning.code === "PROJECT_PROJECTION_BACKUP_ALREADY_PRESENT"), true);

  const replacement = projection({
    workspace_id: id("ws", "7"),
    relationship_id: id("wpr", "8"),
    workspace_version: 1
  });
  await assertProjectionError(
    () => projectionRuntime.writeProjectWorkspaceProjection({
      project_id: projectId,
      desired_projection: replacement,
      expected_current_projection: fingerprint(desired)
    }, options(projectsRoot)),
    projectionRuntime.PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.EXPECTATION_MISMATCH
  );
  const replacementResult = await projectionRuntime.writeProjectWorkspaceProjection({
    project_id: projectId,
    desired_projection: replacement,
    expected_current_projection: fingerprint(detached)
  }, options(projectsRoot));
  assert.equal(replacementResult.workspace_projection.relationship_id, replacement.relationship_id);

  await assertProjectionError(
    () => projectionRuntime.writeProjectWorkspaceProjection({
      project_id: projectId,
      desired_projection: projection({ workspace_version: 1 }),
      expected_current_projection: fingerprint(replacement)
    }, options(projectsRoot)),
    projectionRuntime.PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.CONFLICT
  );
}

async function verifyRecoveryAndFilesystem() {
  const malformedRoot = root("malformed-existing");
  const malformedId = id("prj", "4");
  const malformed = writeProject(malformedRoot, "malformed", malformedId, {
    workspace_projection: { workspace_id: id("ws", "1") }
  });
  const malformedBefore = fs.readFileSync(malformed.file);
  await assertProjectionError(
    () => projectionRuntime.writeProjectWorkspaceProjection({
      project_id: malformedId,
      desired_projection: projection(),
      expected_current_projection: null
    }, options(malformedRoot)),
    projectionRuntime.PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.RECOVERY_REQUIRED,
    projectionRuntime.PROJECT_WORKSPACE_PROJECTION_OUTCOMES.RECOVERY_REQUIRED
  );
  assert.deepEqual(fs.readFileSync(malformed.file), malformedBefore);
  assert.equal(projectionRuntime.inspectProjectWorkspaceProjection({
    project_id: malformedId,
    expected_projection: projection()
  }, options(malformedRoot)).classification, "CONFLICTING");

  const tempRoot = root("temp-present");
  const tempId = id("prj", "5");
  const temp = writeProject(tempRoot, "temp", tempId);
  const tempFile = path.join(temp.directory, "project.json.workspace-projection.tmp");
  fs.writeFileSync(tempFile, "evidence", "utf8");
  await assertProjectionError(
    () => projectionRuntime.writeProjectWorkspaceProjection({
      project_id: tempId, desired_projection: projection(), expected_current_projection: null
    }, options(tempRoot)),
    projectionRuntime.PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.TEMP_PRESENT,
    projectionRuntime.PROJECT_WORKSPACE_PROJECTION_OUTCOMES.RECOVERY_REQUIRED
  );
  assert.equal(fs.readFileSync(tempFile, "utf8"), "evidence");

  const failRoot = root("pre-rename-failure");
  const failId = id("prj", "6");
  const failed = writeProject(failRoot, "failure", failId);
  const failingFilesystem = { ...fs, renameSync() { throw Object.assign(new Error("injected rename failure"), { code: "EIO" }); } };
  await assertProjectionError(
    () => projectionRuntime.writeProjectWorkspaceProjection({
      project_id: failId, desired_projection: projection(), expected_current_projection: null
    }, options(failRoot, { filesystem: failingFilesystem })),
    projectionRuntime.PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.PERSISTENCE_FAILED
  );
  assert.equal(fs.existsSync(path.join(failed.directory, "project.json.workspace-projection.tmp")), false);
  assert.equal(Object.prototype.hasOwnProperty.call(readJson(failed.file), "workspace_projection"), false);

  const backupWarningRoot = root("backup-warning");
  const backupWarningId = id("prj", "7");
  const backupWarning = writeProject(backupWarningRoot, "backup-warning", backupWarningId);
  const warningFilesystem = { ...fs, copyFileSync() { throw Object.assign(new Error("backup denied"), { code: "EACCES" }); } };
  const warningResult = await projectionRuntime.writeProjectWorkspaceProjection({
    project_id: backupWarningId, desired_projection: projection(), expected_current_projection: null
  }, options(backupWarningRoot, { filesystem: warningFilesystem }));
  assert.equal(warningResult.outcome, projectionRuntime.PROJECT_WORKSPACE_PROJECTION_OUTCOMES.WRITE_SUCCESS);
  assert.equal(warningResult.persistence.backup.created, false);
  assert.equal(warningResult.persistence.warnings[0].code, "PROJECT_PROJECTION_BACKUP_WARNING");
  assert.equal(fs.existsSync(path.join(backupWarning.directory, "project.json.backup")), false);

  const uncertainRoot = root("uncertain");
  const uncertainId = id("prj", "8");
  const uncertain = writeProject(uncertainRoot, "uncertain", uncertainId);
  let uncertainError;
  try {
    await projectionRuntime.writeProjectWorkspaceProjection({
      project_id: uncertainId, desired_projection: projection(), expected_current_projection: null
    }, options(uncertainRoot, { hooks: { afterRename() { throw new Error("response lost"); } } }));
  } catch (error) {
    uncertainError = error;
  }
  assert.equal(uncertainError.code, projectionRuntime.PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.UNCERTAIN_COMMIT);
  assert.equal(uncertainError.persistence.committed, true);
  assert.deepEqual(uncertainError.details.desired_fingerprint, fingerprint(projection()));
  assert.deepEqual(readJson(uncertain.file).workspace_projection, projection());
  const retried = await projectionRuntime.writeProjectWorkspaceProjection({
    project_id: uncertainId,
    desired_projection: projection(),
    expected_current_projection: fingerprint(projection())
  }, options(uncertainRoot));
  assert.equal(retried.outcome, projectionRuntime.PROJECT_WORKSPACE_PROJECTION_OUTCOMES.WRITE_NOOP);

  const symlinkRoot = root("symlink-file");
  const symlinkId = id("prj", "9");
  const real = writeProject(symlinkRoot, "symlink", symlinkId);
  const realFile = path.join(real.directory, "real-project.json");
  fs.renameSync(real.file, realFile);
  fs.symlinkSync(realFile, real.file);
  const directIdentity = {
    ...projectIdentity,
    findProjectById() {
      return { resolution: "RESOLVED", project_id: symlinkId, project: {
        project_slug: "symlink", project_identity: metadata(), project_file: real.file
      } };
    }
  };
  await assertProjectionError(
    () => projectionRuntime.writeProjectWorkspaceProjection({
      project_id: symlinkId, desired_projection: projection(), expected_current_projection: null
    }, options(symlinkRoot, { projectIdentity: directIdentity })),
    projectionRuntime.PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.SYMLINK_FORBIDDEN
  );

  const outsideIdentity = {
    ...directIdentity,
    resolveProjectIdentityPaths() {
      return {
        projectsRoot: symlinkRoot,
        project_slug: "escape",
        projectDirectory: path.dirname(symlinkRoot),
        projectFile: path.join(path.dirname(symlinkRoot), "project.json")
      };
    }
  };
  await assertProjectionError(
    () => projectionRuntime.writeProjectWorkspaceProjection({
      project_id: symlinkId, desired_projection: projection(), expected_current_projection: null
    }, options(symlinkRoot, { projectIdentity: outsideIdentity })),
    projectionRuntime.PROJECT_WORKSPACE_PROJECTION_ERROR_CODES.PATH_OUTSIDE_ROOT
  );
}

async function verifyRenameAndLocks() {
  const projectsRoot = root("rename");
  const projectId = id("prj", "a");
  const created = writeProject(projectsRoot, "old-slug", projectId);
  const newDirectory = path.join(projectsRoot, "new-slug");
  fs.renameSync(created.directory, newDirectory);
  const result = await projectionRuntime.writeProjectWorkspaceProjection({
    project_id: projectId, desired_projection: projection(), expected_current_projection: null
  }, options(projectsRoot));
  assert.equal(result.project_slug, "new-slug");
  assert.deepEqual(readJson(path.join(newDirectory, "project.json")).workspace_projection, projection());

  const sameId = id("prj", "b");
  const order = [];
  let releaseFirst;
  const firstGate = new Promise((resolve) => { releaseFirst = resolve; });
  const first = projectionRuntime.withProjectRecordMutationLock(sameId, async () => {
    order.push("first-start");
    await firstGate;
    order.push("first-end");
  });
  await Promise.resolve();
  const second = projectionRuntime.withProjectRecordMutationLock(sameId, async () => { order.push("second"); });
  await Promise.resolve();
  assert.deepEqual(order, ["first-start"]);
  releaseFirst();
  await Promise.all([first, second]);
  assert.deepEqual(order, ["first-start", "first-end", "second"]);

  let releaseIndependent;
  const independentGate = new Promise((resolve) => { releaseIndependent = resolve; });
  const blocking = projectionRuntime.withProjectRecordMutationLock(id("prj", "c"), () => independentGate);
  await Promise.resolve();
  let independentRan = false;
  await projectionRuntime.withProjectRecordMutationLock(id("prj", "d"), () => { independentRan = true; });
  assert.equal(independentRan, true);
  releaseIndependent();
  await blocking;

  await assertProjectionError(
    () => projectionRuntime.withProjectRecordMutationLock(id("prj", "e"), () => {
      throw new projectionRuntime.ProjectWorkspaceProjectionError("TEST", "failure");
    }),
    "TEST"
  );
  let released = false;
  await projectionRuntime.withProjectRecordMutationLock(id("prj", "e"), () => { released = true; });
  assert.equal(released, true);
}

function verifyExportsAndBoundaries() {
  assert.deepEqual(Object.keys(projectionRuntime).sort(), [
    "validateProjectWorkspaceProjection",
    "createProjectWorkspaceProjectionFingerprint",
    "readProjectWorkspaceProjection",
    "inspectProjectWorkspaceProjection",
    "writeProjectWorkspaceProjection",
    "withProjectRecordMutationLock",
    "ProjectWorkspaceProjectionError",
    "PROJECT_WORKSPACE_PROJECTION_ERROR_CODES",
    "PROJECT_WORKSPACE_PROJECTION_OUTCOMES",
    "PROJECT_WORKSPACE_PROJECTION_FIELDS",
    "PROJECT_WORKSPACE_PROJECTION_STATUSES",
    "PROJECT_WORKSPACE_PROJECTION_SOURCE_OWNER",
    "PROJECT_WORKSPACE_PROJECTION_SCHEMA_VERSION",
    "SINGLE_WRITER_ASSUMPTION"
  ].sort());
  assert.deepEqual(projectionRuntime.SINGLE_WRITER_ASSUMPTION, {
    process_local_per_project_mutex: true,
    synchronous_final_reread_to_rename: true,
    cross_process_guarantee: false,
    transactional_guarantee: false,
    multiprocess_writer_certified: false,
    required_writer_model: "SINGLE_WRITER"
  });
  assert.deepEqual(Object.values(projectionRuntime.PROJECT_WORKSPACE_PROJECTION_OUTCOMES), [
    "PROJECT_PROJECTION_WRITE_SUCCESS",
    "PROJECT_PROJECTION_WRITE_NOOP",
    "PROJECT_PROJECTION_CONFLICT",
    "PROJECT_PROJECTION_STALE",
    "PROJECT_PROJECTION_RECOVERY_REQUIRED",
    "PROJECT_PROJECTION_UNRESOLVED",
    "PROJECT_PROJECTION_FAILED"
  ]);
  assert.deepEqual(Object.values(projectionRuntime.PROJECT_WORKSPACE_PROJECTION_ERROR_CODES), [
    "PROJECT_PROJECTION_INPUT_INVALID",
    "PROJECT_PROJECTION_SCHEMA_INVALID",
    "PROJECT_PROJECTION_UNKNOWN_FIELD",
    "PROJECT_PROJECTION_STATUS_INVALID",
    "PROJECT_PROJECTION_VERSION_INVALID",
    "PROJECT_PROJECTION_SOURCE_INVALID",
    "PROJECT_PROJECTION_AUTHORITY_FLAG_INVALID",
    "PROJECT_PROJECTION_PROJECT_NOT_FOUND",
    "PROJECT_PROJECTION_PROJECT_IDENTITY_INVALID",
    "PROJECT_PROJECTION_PROJECT_ID_COLLISION",
    "PROJECT_PROJECTION_MISSING",
    "PROJECT_PROJECTION_EXPECTATION_REQUIRED",
    "PROJECT_PROJECTION_EXPECTATION_MISMATCH",
    "PROJECT_PROJECTION_CONFLICT",
    "PROJECT_PROJECTION_STALE",
    "PROJECT_PROJECTION_TEMP_PRESENT",
    "PROJECT_PROJECTION_RECOVERY_REQUIRED",
    "PROJECT_PROJECTION_PERSISTENCE_FAILED",
    "PROJECT_PROJECTION_UNCERTAIN_COMMIT",
    "PROJECT_PROJECTION_PATH_OUTSIDE_ROOT",
    "PROJECT_PROJECTION_SYMLINK_FORBIDDEN"
  ]);

  const source = fs.readFileSync(path.resolve(
    __dirname,
    "../runtime/orchestrator-service/lib/projects/project-workspace-projection.js"
  ), "utf8");
  for (const [pattern, label] of [
    [/(?:require|import)\s*\(?["'][^"']*(?:workspace-runtime|workspace-storage|workspace-relationship-runtime)["']/, "Workspace owner import"],
    [/\b(?:express|router|app)\s*\.\s*(?:use|get|post|put|patch|delete|route)\s*\(/i, "route registration"],
    [/(?:require|import)\s*\(?["'][^"']*(?:server|frontend|control-center|public\/|security\/)["']/i, "server/security/frontend import"],
    [/\b(?:roles|permissions|membership|attachWorkspace|detachWorkspace)\b/i, "authority or access model"],
    [/\b(?:updated_at)\s*:/, "root updated_at assignment"],
    [/projection_revision|validation_state|PENDING_ATTACH|PENDING_DETACH/, "forbidden projection field or state"]
  ]) assert.doesNotMatch(source, pattern, label);
  assert.match(source, /synchronous from this authoritative reread through rename: no await/);
  assert.doesNotMatch(source, /await[^\n]*(?:readRecord|renameSync)|(?:readRecord|renameSync)[^\n]*await/);
}

async function run() {
  verifySchemaAndFingerprint();
  verifyReadAndInspection();
  await verifyWritesAndPreservation();
  await verifyRecoveryAndFilesystem();
  await verifyRenameAndLocks();
  verifyExportsAndBoundaries();
  assert.notEqual(path.resolve(TEMP_BASE), path.resolve(projectIdentity.DEFAULT_PROJECTS_ROOT));
  console.log(JSON.stringify({
    result: "pass",
    temporary_project_root: TEMP_BASE,
    production_data_touched: false,
    checks: {
      schema_and_fingerprint: "pass",
      read_and_inspection: "pass",
      expected_current_and_idempotency: "pass",
      tombstones_and_replacement: "pass",
      field_preservation: "pass",
      filesystem_safety: "pass",
      uncertain_commit: "pass",
      concurrency_and_rename: "pass",
      static_boundaries: "pass"
    }
  }, null, 2));
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

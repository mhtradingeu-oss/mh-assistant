#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const relationships = require("../runtime/orchestrator-service/lib/workspace/workspace-relationship-runtime");
const contract = require("../runtime/orchestrator-service/lib/workspace/workspace-contract");
const storage = require("../runtime/orchestrator-service/lib/workspace/workspace-storage");
const projectIdentity = require("../runtime/orchestrator-service/lib/projects/project-identity");

const TEMP_BASE = fs.mkdtempSync(path.join(os.tmpdir(), "mh-workspace-relationship-"));
const WORKSPACE_ROOT = path.join(TEMP_BASE, "workspaces");
const PROJECT_ROOT = path.join(TEMP_BASE, "projects");
const T1 = "2026-07-14T12:00:00.000Z";
const T2 = "2026-07-14T12:01:00.000Z";
const T3 = "2026-07-14T12:02:00.000Z";

function workspaceId(character) {
  return `ws_${character.repeat(32)}`;
}

function projectId(character) {
  return `prj_${character.repeat(32)}`;
}

function relationshipId(character) {
  return `wpr_${character.repeat(32)}`;
}

function evidence(type, suffix = "1") {
  return {
    reference_type: type,
    reference_id: `evt_${type}_${suffix}`,
    source_owner: "workspace-relationship-verifier",
    recorded_at: T2
  };
}

function relationship(overrides = {}) {
  return {
    relationship_schema_version: 1,
    relationship_id: relationshipId("1"),
    project_id: projectId("1"),
    relationship_status: "PENDING_ATTACH",
    validation_state: "VALID",
    created_at: T1,
    updated_at: T1,
    attached_at: null,
    detached_at: null,
    archived_at: null,
    ...overrides
  };
}

function workspace(id, overrides = {}) {
  return {
    schema_version: 1,
    workspace_id: id,
    workspace_version: 1,
    workspace_name: "Relationship Verification Workspace",
    status: "ACTIVE",
    ownership_state: "UNCLAIMED",
    created_at: T1,
    updated_at: T1,
    project_relationships: [],
    evidence_references: [],
    ...overrides
  };
}

function createProject(slug, record = {}) {
  const directory = path.join(PROJECT_ROOT, slug);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, "project.json"), `${JSON.stringify({
    project_name: slug,
    status: "initialized",
    ...record
  }, null, 2)}\n`, "utf8");
}

function readProject(slug) {
  return JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, slug, "project.json"), "utf8"));
}

function idSequence(...ids) {
  let index = 0;
  return () => ids[Math.min(index++, ids.length - 1)];
}

function identityOwner(id = projectId("1"), overrides = {}) {
  const calls = { ensure: 0, find: 0 };
  return {
    calls,
    async ensureProjectIdentityForAttach(slug) {
      calls.ensure += 1;
      if (overrides.ensure) return overrides.ensure(slug);
      return {
        created: false,
        metadata_created: false,
        project_slug: slug,
        project_id: id,
        project_identity: { schema_version: 1, created_at: T1, source: "project-runtime" },
        project_file: `/temporary/${slug}/project.json`
      };
    },
    findProjectById(value) {
      calls.find += 1;
      if (overrides.find) return overrides.find(value);
      return { resolution: "RESOLVED", project_id: value, project: {} };
    }
  };
}

function memoryStorage(initialRecords = []) {
  const records = new Map(initialRecords.map((item) => [item.workspace_id, structuredClone(item)]));
  const writes = [];
  const owner = {
    records,
    writes,
    inspectWorkspaceStorage(_root, id) {
      const value = records.get(id);
      return {
        workspace_id: id,
        classification: value ? "HEALTHY" : "MISSING_NEW",
        states: [value ? "HEALTHY" : "MISSING_NEW"],
        recovery_required: false,
        workspace: value ? structuredClone(value) : null,
        canonical: { present: Boolean(value), valid: Boolean(value) }
      };
    },
    readWorkspace(_root, id) {
      const value = records.get(id);
      return value ? structuredClone(value) : null;
    },
    writeWorkspace(_root, value) {
      writes.push(structuredClone(value));
      records.set(value.workspace_id, structuredClone(value));
      return {
        workspace_id: value.workspace_id,
        canonical_path: `/temporary/${value.workspace_id}/workspace.json`,
        backup: { attempted: true, created: true, error: null }
      };
    },
    discoverWorkspacesWithDiagnostics() {
      return {
        workspaces: [...records.values()].map((item) => structuredClone(item)),
        diagnostics: []
      };
    }
  };
  return owner;
}

function options(owner, identity, overrides = {}) {
  return {
    root: "unused-workspace-root",
    projectsRoot: "unused-project-root",
    storage: owner,
    projectIdentity: identity,
    now: () => T2,
    generateProjectRelationshipId: () => relationshipId("9"),
    ...overrides
  };
}

async function assertRejectsCode(operation, code, name = "WorkspaceRelationshipRuntimeError") {
  await assert.rejects(operation, (error) => {
    assert.equal(error.name, name);
    assert.equal(error.code, code);
    return true;
  });
}

async function verifyRealIdentityIntegration() {
  const firstWorkspaceId = workspaceId("1");
  storage.writeWorkspace(WORKSPACE_ROOT, workspace(firstWorkspaceId));
  createProject("identity-created");
  const pending = await relationships.beginWorkspaceProjectAttach({
    workspace_id: firstWorkspaceId,
    project_slug: "identity-created",
    expected_workspace_version: 1
  }, {
    root: WORKSPACE_ROOT,
    projectsRoot: PROJECT_ROOT,
    now: () => T1,
    generateProjectRelationshipId: () => relationshipId("a")
  });
  assert.equal(pending.outcome, "ATTACH_PENDING");
  assert.equal(pending.changed, true);
  assert.equal(pending.previous_workspace_version, 1);
  assert.equal(pending.workspace_version, 2);
  assert.equal(pending.previous_relationship_status, null);
  assert.equal(pending.relationship_status, "PENDING_ATTACH");
  assert.equal(pending.relationship.relationship_schema_version, 1);
  assert.equal(pending.relationship.relationship_id, relationshipId("a"));
  assert.equal(pending.relationship.project_id, readProject("identity-created").project_id);
  assert.deepEqual(Object.keys(pending.relationship), contract.PROJECT_RELATIONSHIP_FIELDS);
  assert.equal(Object.prototype.hasOwnProperty.call(pending.relationship, "project_slug"), false);
  assert.deepEqual(pending.workspace.evidence_references, []);
  assert.ok(pending.identity && pending.persistence);

  const storedProject = readProject("identity-created");
  assert.match(storedProject.project_id, /^prj_[0-9a-f]{32}$/);
  const completed = await relationships.completeWorkspaceProjectAttach({
    workspace_id: firstWorkspaceId,
    relationship_id: relationshipId("a"),
    expected_workspace_version: 2,
    evidence_reference: evidence("workspace_attach")
  }, { root: WORKSPACE_ROOT, projectsRoot: PROJECT_ROOT, now: () => T2 });
  assert.equal(completed.outcome, "ATTACH_SUCCESS");
  assert.equal(completed.workspace_version, 3);
  assert.equal(completed.relationship.attached_at, T2);
  assert.equal(completed.relationship.relationship_schema_version, 1);
  assert.equal(completed.workspace.evidence_references.at(-1).reference_type, "workspace_attach");

  const reusedWorkspaceId = workspaceId("2");
  storage.writeWorkspace(WORKSPACE_ROOT, workspace(reusedWorkspaceId));
  const reused = await relationships.beginWorkspaceProjectAttach({
    workspace_id: reusedWorkspaceId,
    project_slug: "identity-created",
    expected_workspace_version: 1
  }, {
    root: WORKSPACE_ROOT,
    projectsRoot: PROJECT_ROOT,
    now: () => T2,
    generateProjectRelationshipId: () => relationshipId("b")
  });
  assert.equal(reused.identity.created, false);
  assert.equal(reused.identity.project_id, storedProject.project_id);

  const missingWorkspaceId = workspaceId("3");
  storage.writeWorkspace(WORKSPACE_ROOT, workspace(missingWorkspaceId));
  await assertRejectsCode(
    () => relationships.beginWorkspaceProjectAttach({
      workspace_id: missingWorkspaceId,
      project_slug: "missing-project",
      expected_workspace_version: 1
    }, { root: WORKSPACE_ROOT, projectsRoot: PROJECT_ROOT }),
    relationships.WORKSPACE_RELATIONSHIP_ERROR_CODES.PROJECT_IDENTITY_FAILED
  );
  assert.equal(storage.readWorkspace(WORKSPACE_ROOT, missingWorkspaceId).workspace_version, 1);
}

async function verifyInputAuthorityAndWorkspaceStates() {
  const id = workspaceId("4");
  const owner = memoryStorage([workspace(id)]);
  const identity = identityOwner();
  for (const [field, value] of Object.entries({
    relationship_schema_version: 1,
    relationship_id: relationshipId("1"),
    project_id: projectId("1"),
    relationship_status: "ATTACHED",
    validation_state: "VALID",
    created_at: T1,
    updated_at: T1,
    attached_at: T1,
    detached_at: null,
    archived_at: null
  })) {
    await assertRejectsCode(
      () => relationships.beginWorkspaceProjectAttach({
        workspace_id: id,
        project_slug: "project",
        expected_workspace_version: 1,
        [field]: value
      }, options(owner, identity)),
      relationships.WORKSPACE_RELATIONSHIP_ERROR_CODES.INVALID_INPUT
    );
  }
  assert.equal(identity.calls.ensure, 0);
  assert.equal(owner.writes.length, 0);

  for (const status of ["FAILED", "ARCHIVED", "SUSPENDED"]) {
    const statusOwner = memoryStorage([workspace(id, { status })]);
    const denied = await relationships.beginWorkspaceProjectAttach({
      workspace_id: id,
      project_slug: "project",
      expected_workspace_version: 1
    }, options(statusOwner, identity));
    assert.equal(denied.outcome, "ATTACH_CONFLICT");
    assert.equal(denied.changed, false);
    assert.equal(statusOwner.writes.length, 0);
  }
}

async function verifyIdentityFailuresAndUniqueness() {
  const id = workspaceId("5");
  for (const code of ["PROJECT_IDENTITY_INVALID", "PROJECT_ID_COLLISION"]) {
    const owner = memoryStorage([workspace(id)]);
    const identity = identityOwner(projectId("2"), {
      ensure() {
        throw new projectIdentity.ProjectIdentityError(code, "injected identity failure");
      }
    });
    await assert.rejects(
      () => relationships.beginWorkspaceProjectAttach({
        workspace_id: id, project_slug: "project", expected_workspace_version: 1
      }, options(owner, identity)),
      (error) => {
        assert.equal(error.code, relationships.WORKSPACE_RELATIONSHIP_ERROR_CODES.PROJECT_IDENTITY_FAILED);
        assert.equal(error.outcome, "ATTACH_FAILED");
        assert.equal(error.lower_level_error.code, code);
        return true;
      }
    );
    assert.equal(owner.writes.length, 0);
  }

  const pendingRelationship = relationship({ project_id: projectId("3") });
  const pendingOwner = memoryStorage([workspace(id, { project_relationships: [pendingRelationship] })]);
  const pendingIdentity = identityOwner(projectId("3"));
  const retry = await relationships.beginWorkspaceProjectAttach({
    workspace_id: id, project_slug: "same-project", expected_workspace_version: 1
  }, options(pendingOwner, pendingIdentity));
  assert.equal(retry.outcome, "ATTACH_PENDING");
  assert.equal(retry.changed, false);
  assert.equal(retry.workspace_version, 1);
  assert.equal(pendingOwner.writes.length, 0);

  for (const status of ["ATTACHED", "PENDING_DETACH"]) {
    const active = relationship({ project_id: projectId("3"), relationship_status: status, attached_at: T1 });
    const activeOwner = memoryStorage([workspace(id, { project_relationships: [active] })]);
    const conflict = await relationships.beginWorkspaceProjectAttach({
      workspace_id: id, project_slug: "same-project", expected_workspace_version: 1
    }, options(activeOwner, pendingIdentity));
    assert.equal(conflict.outcome, "ATTACH_CONFLICT");
    assert.equal(activeOwner.writes.length, 0);
  }
}

async function verifyGlobalAllocation() {
  const currentId = workspaceId("6");
  const otherId = workspaceId("7");
  const used = relationshipId("4");
  const available = relationshipId("5");
  const historical = relationship({
    relationship_id: used,
    project_id: projectId("4"),
    relationship_status: "ARCHIVED",
    archived_at: T1
  });
  const owner = memoryStorage([
    workspace(currentId),
    workspace(otherId, { project_relationships: [historical] })
  ]);
  let attempts = 0;
  const attached = await relationships.beginWorkspaceProjectAttach({
    workspace_id: currentId, project_slug: "new-project", expected_workspace_version: 1
  }, options(owner, identityOwner(projectId("5")), {
    generateProjectRelationshipId: () => {
      attempts += 1;
      return attempts === 1 ? used : available;
    }
  }));
  assert.equal(attempts, 2);
  assert.equal(attached.relationship.relationship_id, available);
  assert.equal(owner.records.get(otherId).project_relationships[0].relationship_id, used);

  const exhaustionId = workspaceId("8");
  const exhaustionOwner = memoryStorage([
    workspace(exhaustionId),
    workspace(otherId, { project_relationships: [historical] })
  ]);
  attempts = 0;
  await assertRejectsCode(
    () => relationships.beginWorkspaceProjectAttach({
      workspace_id: exhaustionId, project_slug: "exhaust", expected_workspace_version: 1
    }, options(exhaustionOwner, identityOwner(projectId("6")), {
      generateProjectRelationshipId: () => { attempts += 1; return used; }
    })),
    relationships.WORKSPACE_RELATIONSHIP_ERROR_CODES.RELATIONSHIP_ID_GENERATION_EXHAUSTED
  );
  assert.equal(attempts, 5);
  assert.equal(exhaustionOwner.writes.length, 0);

  const incompleteId = workspaceId("9");
  const incompleteOwner = memoryStorage([workspace(incompleteId)]);
  incompleteOwner.discoverWorkspacesWithDiagnostics = () => ({
    workspaces: [workspace(incompleteId)],
    diagnostics: [{ entry: workspaceId("a"), reason: "CORRUPT", states: ["RECOVERY_REQUIRED"] }]
  });
  await assertRejectsCode(
    () => relationships.beginWorkspaceProjectAttach({
      workspace_id: incompleteId, project_slug: "incomplete", expected_workspace_version: 1
    }, options(incompleteOwner, identityOwner(projectId("7")))),
    relationships.WORKSPACE_RELATIONSHIP_ERROR_CODES.RELATIONSHIP_ID_SCAN_INCOMPLETE
  );
  assert.equal(incompleteOwner.writes.length, 0);

  const ignoredOwner = memoryStorage([workspace(incompleteId)]);
  ignoredOwner.discoverWorkspacesWithDiagnostics = () => ({
    workspaces: [workspace(incompleteId)],
    diagnostics: [
      { entry: ".ignored", reason: "HIDDEN_ENTRY" },
      { entry: "bad", reason: "MALFORMED_WORKSPACE_ID" },
      { entry: "file", reason: "NOT_REAL_DIRECTORY" }
    ]
  });
  assert.equal((await relationships.beginWorkspaceProjectAttach({
    workspace_id: incompleteId, project_slug: "complete", expected_workspace_version: 1
  }, options(ignoredOwner, identityOwner(projectId("8"))))).outcome, "ATTACH_PENDING");
}

async function verifyLifecycleAndEvidence() {
  const id = workspaceId("b");
  const base = relationship({ relationship_id: relationshipId("6"), project_id: projectId("6") });
  const owner = memoryStorage([workspace(id, { project_relationships: [base] })]);
  const identity = identityOwner();

  const attached = await relationships.completeWorkspaceProjectAttach({
    workspace_id: id,
    relationship_id: base.relationship_id,
    expected_workspace_version: 1,
    evidence_reference: evidence("workspace_attach")
  }, options(owner, identity, { now: () => T2 }));
  assert.equal(attached.outcome, "ATTACH_SUCCESS");
  assert.equal(attached.previous_relationship_status, "PENDING_ATTACH");
  assert.equal(attached.relationship_status, "ATTACHED");
  assert.equal(attached.relationship.attached_at, T2);
  assert.equal(attached.workspace_version, 2);
  assert.equal(owner.writes.length, 1);

  const pendingDetach = await relationships.beginWorkspaceProjectDetach({
    workspace_id: id,
    relationship_id: base.relationship_id,
    expected_workspace_version: 2
  }, options(owner, identity, { now: () => T3 }));
  assert.equal(pendingDetach.outcome, "DETACH_PENDING");
  assert.equal(pendingDetach.relationship.attached_at, T2);
  assert.equal(pendingDetach.relationship.detached_at, null);
  assert.equal(identity.calls.find, 0);
  assert.equal(identity.calls.ensure, 0);

  const rolledBack = await relationships.rollbackWorkspaceProjectDetach({
    workspace_id: id, relationship_id: base.relationship_id, expected_workspace_version: 3
  }, options(owner, identity, { now: () => T3 }));
  assert.equal(rolledBack.outcome, "DETACH_FAILED");
  assert.equal(rolledBack.rollback_committed, true);
  assert.equal(rolledBack.relationship_status, "ATTACHED");
  assert.equal(rolledBack.relationship.attached_at, T2);

  await relationships.beginWorkspaceProjectDetach({
    workspace_id: id, relationship_id: base.relationship_id, expected_workspace_version: 4
  }, options(owner, identity, { now: () => T3 }));
  const detached = await relationships.completeWorkspaceProjectDetach({
    workspace_id: id,
    relationship_id: base.relationship_id,
    expected_workspace_version: 5,
    evidence_reference: evidence("workspace_detach")
  }, options(owner, identity, { now: () => T3 }));
  assert.equal(detached.outcome, "DETACH_SUCCESS");
  assert.equal(detached.relationship.detached_at, T3);
  assert.equal(detached.relationship.attached_at, T2);
  assert.deepEqual(detached.workspace.evidence_references.map((item) => item.reference_type), [
    "workspace_attach", "workspace_detach"
  ]);

  const detachedNoop = await relationships.completeWorkspaceProjectDetach({
    workspace_id: id,
    relationship_id: base.relationship_id,
    expected_workspace_version: 6,
    evidence_reference: evidence("workspace_detach", "retry")
  }, options(owner, identity, { now: () => T3 }));
  assert.equal(detachedNoop.outcome, "DETACH_SUCCESS");
  assert.equal(detachedNoop.changed, false);
  assert.equal(detachedNoop.workspace_version, 6);
  assert.deepEqual(detachedNoop.workspace.evidence_references.map((item) => item.reference_type), [
    "workspace_attach", "workspace_detach"
  ]);

  const archived = await relationships.archiveWorkspaceProjectRelationship({
    workspace_id: id,
    relationship_id: base.relationship_id,
    expected_workspace_version: 6,
    evidence_reference: evidence("workspace_relationship_archive")
  }, options(owner, identity, { now: () => T3 }));
  assert.equal(archived.outcome, "DETACH_SUCCESS");
  assert.equal(archived.relationship_status, "ARCHIVED");
  assert.equal(archived.relationship.archived_at, T3);
  assert.equal(owner.records.get(id).project_relationships.length, 1);

  const abandonId = workspaceId("c");
  const abandonRelationship = relationship({ relationship_id: relationshipId("7") });
  const abandonOwner = memoryStorage([workspace(abandonId, { project_relationships: [abandonRelationship] })]);
  const abandoned = await relationships.abandonWorkspaceProjectAttach({
    workspace_id: abandonId,
    relationship_id: abandonRelationship.relationship_id,
    expected_workspace_version: 1,
    evidence_reference: evidence("workspace_relationship_archive")
  }, options(abandonOwner, identity));
  assert.equal(abandoned.outcome, "ATTACH_FAILED");
  assert.equal(abandoned.abandonment_committed, true);
  assert.equal(abandoned.relationship_status, "ARCHIVED");

  await assert.rejects(
    () => relationships.completeWorkspaceProjectAttach({
      workspace_id: abandonId,
      relationship_id: abandonRelationship.relationship_id,
      expected_workspace_version: 2,
      evidence_reference: evidence("workspace_detach")
    }, options(abandonOwner, identity)),
    (error) => error.code === contract.ERROR_CODES.INVALID_EVIDENCE_REFERENCE_TYPE
  );
  assert.equal(abandonOwner.writes.length, 1);
}

async function verifyNoopsConflictsAndInvalidTransitions() {
  const id = workspaceId("d");
  const attachedRelationship = relationship({
    relationship_id: relationshipId("8"),
    relationship_status: "ATTACHED",
    attached_at: T1
  });
  const owner = memoryStorage([workspace(id, { workspace_version: 3, project_relationships: [attachedRelationship] })]);
  const identity = identityOwner();
  const noop = await relationships.completeWorkspaceProjectAttach({
    workspace_id: id,
    relationship_id: attachedRelationship.relationship_id,
    expected_workspace_version: 3,
    evidence_reference: evidence("workspace_attach", "retry")
  }, options(owner, identity));
  assert.equal(noop.outcome, "ATTACH_SUCCESS");
  assert.equal(noop.changed, false);
  assert.equal(noop.workspace_version, 3);
  assert.equal(noop.workspace.evidence_references.length, 0);
  assert.equal(owner.writes.length, 0);

  const stale = await relationships.beginWorkspaceProjectDetach({
    workspace_id: id,
    relationship_id: attachedRelationship.relationship_id,
    expected_workspace_version: 2
  }, options(owner, identity));
  assert.equal(stale.outcome, "DETACH_CONFLICT");
  assert.equal(stale.code, contract.ERROR_CODES.WORKSPACE_VERSION_CONFLICT);
  assert.equal(owner.writes.length, 0);

  const invalid = await relationships.completeWorkspaceProjectDetach({
    workspace_id: id,
    relationship_id: attachedRelationship.relationship_id,
    expected_workspace_version: 3
  }, options(owner, identity));
  assert.equal(invalid.outcome, "DETACH_CONFLICT");
  assert.equal(owner.writes.length, 0);
  assert.equal(owner.records.get(id).project_relationships[0].relationship_status, "ATTACHED");

  const invalidArchive = await relationships.archiveWorkspaceProjectRelationship({
    workspace_id: id,
    relationship_id: attachedRelationship.relationship_id,
    expected_workspace_version: 3
  }, options(owner, identity));
  assert.equal(invalidArchive.outcome, "DETACH_CONFLICT");
  assert.equal(invalidArchive.changed, false);
  assert.equal(owner.writes.length, 0);

  await assertRejectsCode(
    () => relationships.getWorkspaceProjectRelationship({
      workspace_id: id, relationship_id: relationshipId("f")
    }, options(owner, identity)),
    relationships.WORKSPACE_RELATIONSHIP_ERROR_CODES.RELATIONSHIP_NOT_FOUND
  );
  await assert.rejects(
    () => relationships.beginWorkspaceProjectDetach({
      workspace_id: id, relationship_id: relationshipId("f"), expected_workspace_version: 3
    }, options(owner, identity)),
    (error) => {
      assert.equal(error.code, relationships.WORKSPACE_RELATIONSHIP_ERROR_CODES.RELATIONSHIP_NOT_FOUND);
      assert.equal(error.outcome, "DETACH_FAILED");
      return true;
    }
  );
}

async function verifyAppendOnlyReattachAndReads() {
  const id = workspaceId("e");
  const oldRelationship = relationship({
    relationship_id: relationshipId("a"),
    project_id: projectId("a"),
    relationship_status: "DETACHED",
    attached_at: T1,
    detached_at: T2
  });
  const unrelated = relationship({
    relationship_id: relationshipId("b"),
    project_id: projectId("b"),
    relationship_status: "ARCHIVED",
    archived_at: T2,
    validation_state: "UNRESOLVED_PROJECT"
  });
  const owner = memoryStorage([workspace(id, { project_relationships: [oldRelationship, unrelated] })]);
  const identity = identityOwner(projectId("a"));
  const reattach = await relationships.beginWorkspaceProjectAttach({
    workspace_id: id, project_slug: "reattach", expected_workspace_version: 1
  }, options(owner, identity, { generateProjectRelationshipId: () => relationshipId("c") }));
  assert.equal(reattach.relationship.relationship_id, relationshipId("c"));
  assert.deepEqual(reattach.workspace.project_relationships.slice(0, 2), [oldRelationship, unrelated]);
  assert.equal(reattach.workspace.project_relationships.length, 3);

  const read = await relationships.getWorkspaceProjectRelationship({
    workspace_id: id, relationship_id: oldRelationship.relationship_id
  }, options(owner, identity));
  read.relationship_status = "ARCHIVED";
  assert.equal(owner.records.get(id).project_relationships[0].relationship_status, "DETACHED");

  const all = await relationships.listWorkspaceProjectRelationships({ workspace_id: id }, options(owner, identity));
  assert.deepEqual(all.map((item) => item.relationship_id), [relationshipId("a"), relationshipId("b"), relationshipId("c")]);
  assert.equal((await relationships.listWorkspaceProjectRelationships({
    workspace_id: id, project_id: projectId("a")
  }, options(owner, identity))).length, 2);
  assert.equal((await relationships.listWorkspaceProjectRelationships({
    workspace_id: id, relationship_status: "ARCHIVED"
  }, options(owner, identity))).length, 1);
  assert.equal((await relationships.listWorkspaceProjectRelationships({
    workspace_id: id, validation_state: "UNRESOLVED_PROJECT"
  }, options(owner, identity))).length, 1);
  await assertRejectsCode(
    () => relationships.listWorkspaceProjectRelationships({ workspace_id: id, project_slug: "forbidden" }, options(owner, identity)),
    relationships.WORKSPACE_RELATIONSHIP_ERROR_CODES.INVALID_INPUT
  );
}

async function verifyFailureAndUncertainty() {
  const id = workspaceId("f");
  const owner = memoryStorage([workspace(id)]);
  const identity = identityOwner(projectId("d"));
  const successfulWrite = owner.writeWorkspace;
  owner.writeWorkspace = () => { throw new Error("injected Workspace write failure"); };
  await assert.rejects(
    () => relationships.beginWorkspaceProjectAttach({
      workspace_id: id, project_slug: "identity-persists", expected_workspace_version: 1
    }, options(owner, identity)),
    (error) => {
      assert.equal(error.code, relationships.WORKSPACE_RELATIONSHIP_ERROR_CODES.PERSISTENCE_FAILED);
      assert.equal(error.outcome, "ATTACH_FAILED");
      assert.equal(error.identity.project_id, projectId("d"));
      assert.equal(error.persistence.committed, "UNKNOWN");
      return true;
    }
  );
  assert.equal(identity.calls.ensure, 1);
  assert.equal(owner.records.get(id).workspace_version, 1);
  owner.writeWorkspace = successfulWrite;
  const retryAfterFailure = await relationships.beginWorkspaceProjectAttach({
    workspace_id: id, project_slug: "identity-persists", expected_workspace_version: 1
  }, options(owner, identity));
  assert.equal(retryAfterFailure.identity.project_id, projectId("d"));
  assert.equal(identity.calls.ensure, 2);

  const uncertainId = workspaceId("0");
  const uncertainOwner = memoryStorage([workspace(uncertainId)]);
  const committedWrite = uncertainOwner.writeWorkspace;
  uncertainOwner.writeWorkspace = (...args) => {
    committedWrite(...args);
    throw new Error("response lost after commit");
  };
  await assertRejectsCode(
    () => relationships.beginWorkspaceProjectAttach({
      workspace_id: uncertainId, project_slug: "uncertain", expected_workspace_version: 1
    }, options(uncertainOwner, identityOwner(projectId("e")), {
      generateProjectRelationshipId: () => relationshipId("d")
    })),
    relationships.WORKSPACE_RELATIONSHIP_ERROR_CODES.PERSISTENCE_FAILED
  );
  const retry = await relationships.beginWorkspaceProjectAttach({
    workspace_id: uncertainId, project_slug: "uncertain", expected_workspace_version: 1
  }, options(uncertainOwner, identityOwner(projectId("e"))));
  assert.equal(retry.outcome, "ATTACH_CONFLICT");
  assert.equal(retry.code, contract.ERROR_CODES.WORKSPACE_VERSION_CONFLICT);
}

async function verifyRecoveryAndProjectDisappearance() {
  const id = workspaceId("a");
  const attached = relationship({ relationship_status: "ATTACHED", attached_at: T1 });
  const owner = memoryStorage([workspace(id, { project_relationships: [attached] })]);
  owner.inspectWorkspaceStorage = () => ({
    workspace_id: id,
    classification: "TEMP_PRESENT",
    states: ["TEMP_PRESENT", "RECOVERY_REQUIRED"],
    recovery_required: true,
    workspace: null,
    canonical: { present: false, valid: false }
  });
  await assert.rejects(
    () => relationships.beginWorkspaceProjectDetach({
      workspace_id: id, relationship_id: attached.relationship_id, expected_workspace_version: 1
    }, options(owner, identityOwner())),
    (error) => {
      assert.equal(error.outcome, "DETACH_RECOVERY_REQUIRED");
      return true;
    }
  );
  assert.equal(owner.writes.length, 0);

  const disappearedOwner = memoryStorage([workspace(id, { project_relationships: [attached] })]);
  const noResolution = identityOwner(projectId("1"), {
    find() { throw new Error("Project disappeared"); },
    ensure() { throw new Error("Project must not be recreated"); }
  });
  const unchanged = await relationships.getWorkspaceProjectRelationship({
    workspace_id: id, relationship_id: attached.relationship_id
  }, options(disappearedOwner, noResolution));
  assert.equal(unchanged.relationship_status, "ATTACHED");
  assert.equal(disappearedOwner.writes.length, 0);
  assert.equal(noResolution.calls.find, 0);
  assert.equal(noResolution.calls.ensure, 0);
  const pending = await relationships.beginWorkspaceProjectDetach({
    workspace_id: id, relationship_id: attached.relationship_id, expected_workspace_version: 1
  }, options(disappearedOwner, noResolution));
  assert.equal(pending.outcome, "DETACH_PENDING");
  assert.equal(pending.relationship.validation_state, "VALID");
  assert.equal(noResolution.calls.find, 0);
  assert.equal(noResolution.calls.ensure, 0);
}

async function verifyLocks() {
  const events = [];
  let release;
  const gate = new Promise((resolve) => { release = resolve; });
  const first = relationships.withWorkspaceRelationshipMutation("same", async () => {
    events.push("first-start");
    await gate;
    events.push("first-end");
  });
  const second = relationships.withWorkspaceRelationshipMutation("same", async () => events.push("second"));
  const different = relationships.withWorkspaceRelationshipMutation("different", async () => events.push("different"));
  await different;
  assert.deepEqual(events, ["first-start", "different"]);
  release();
  await Promise.all([first, second]);
  assert.deepEqual(events, ["first-start", "different", "first-end", "second"]);
  await assert.rejects(() => relationships.withWorkspaceRelationshipMutation("failure", async () => {
    throw new Error("injected lock failure");
  }));
  assert.equal(await relationships.withWorkspaceRelationshipMutation("failure", async () => "released"), "released");

  const firstId = workspaceId("6");
  const secondId = workspaceId("7");
  const owner = memoryStorage([workspace(firstId), workspace(secondId)]);
  const repeatedCandidate = relationshipId("e");
  const fallbackCandidate = relationshipId("f");
  let generationCalls = 0;
  const generateProjectRelationshipId = () => {
    generationCalls += 1;
    return generationCalls <= 2 ? repeatedCandidate : fallbackCandidate;
  };
  const [firstAttach, secondAttach] = await Promise.all([
    relationships.beginWorkspaceProjectAttach({
      workspace_id: firstId, project_slug: "concurrent-one", expected_workspace_version: 1
    }, options(owner, identityOwner(projectId("6")), { generateProjectRelationshipId })),
    relationships.beginWorkspaceProjectAttach({
      workspace_id: secondId, project_slug: "concurrent-two", expected_workspace_version: 1
    }, options(owner, identityOwner(projectId("7")), { generateProjectRelationshipId }))
  ]);
  assert.notEqual(firstAttach.relationship.relationship_id, secondAttach.relationship.relationship_id);
  assert.deepEqual(new Set([
    firstAttach.relationship.relationship_id,
    secondAttach.relationship.relationship_id
  ]), new Set([repeatedCandidate, fallbackCandidate]));
  assert.equal(generationCalls, 3);
}

function verifyExportsAndBoundaries() {
  assert.deepEqual(Object.keys(relationships).sort(), [
    "ACTIVE_RELATIONSHIP_STATES",
    "SINGLE_WRITER_ASSUMPTION",
    "WORKSPACE_RELATIONSHIP_ERROR_CODES",
    "WORKSPACE_RELATIONSHIP_OUTCOMES",
    "WorkspaceRelationshipRuntimeError",
    "abandonWorkspaceProjectAttach",
    "archiveWorkspaceProjectRelationship",
    "beginWorkspaceProjectAttach",
    "beginWorkspaceProjectDetach",
    "completeWorkspaceProjectAttach",
    "completeWorkspaceProjectDetach",
    "getWorkspaceProjectRelationship",
    "listWorkspaceProjectRelationships",
    "rollbackWorkspaceProjectDetach",
    "withWorkspaceRelationshipMutation"
  ].sort());
  assert.deepEqual(relationships.ACTIVE_RELATIONSHIP_STATES, ["PENDING_ATTACH", "ATTACHED", "PENDING_DETACH"]);
  assert.equal(Object.isFrozen(relationships.ACTIVE_RELATIONSHIP_STATES), true);
  assert.equal(Object.values(relationships.WORKSPACE_RELATIONSHIP_OUTCOMES).includes("ATTACH_PROJECTION_PARTIAL"), false);
  assert.equal(Object.values(relationships.WORKSPACE_RELATIONSHIP_OUTCOMES).includes("DETACH_PROJECTION_PARTIAL"), false);
  assert.equal(relationships.SINGLE_WRITER_ASSUMPTION.cross_process_guarantee, false);
  assert.equal(relationships.SINGLE_WRITER_ASSUMPTION.transactional_guarantee, false);

  const sourcePath = path.resolve(
    __dirname,
    "../runtime/orchestrator-service/lib/workspace/workspace-relationship-runtime.js"
  );
  const source = fs.readFileSync(sourcePath, "utf8");
  const absent = [
    [/(?:require|import)\s*\(?["'](?:node:)?(?:fs|path)["']/, "filesystem import"],
    [/(?:require|import)\s*\(?["'][^"']*(?:server|security|frontend|control-center|public\/)/i, "forbidden import"],
    [/workspace_projection|projection_schema_version/i, "Project projection"],
    [/\b(?:express|router|app)\s*\.\s*(?:use|get|post|put|patch|delete|route)\s*\(/i, "route registration"],
    [/\b(?:grant|assign|revoke)(?:Role|Permission|Access)\b/, "role or permission grant"],
    [/\b(?:writeFile|appendFile|rename|unlink|mkdir)(?:Sync)?\s*\(/, "direct Project or filesystem write"],
    [/\.splice\s*\(|\.filter\s*\([^\n]*project_relationships|project_relationships\s*=\s*project_relationships\.slice/i, "relationship deletion or truncation"]
  ];
  for (const [pattern, label] of absent) assert.doesNotMatch(source, pattern, label);
  assert.doesNotMatch(source, /ATTACH_PROJECTION_PARTIAL|DETACH_PROJECTION_PARTIAL/);
}

async function run() {
  await verifyRealIdentityIntegration();
  await verifyInputAuthorityAndWorkspaceStates();
  await verifyIdentityFailuresAndUniqueness();
  await verifyGlobalAllocation();
  await verifyLifecycleAndEvidence();
  await verifyNoopsConflictsAndInvalidTransitions();
  await verifyAppendOnlyReattachAndReads();
  await verifyFailureAndUncertainty();
  await verifyRecoveryAndProjectDisappearance();
  await verifyLocks();
  verifyExportsAndBoundaries();
  assert.notEqual(storage.resolveWorkspaceRoot(WORKSPACE_ROOT), storage.DEFAULT_WORKSPACE_ROOT);
  assert.notEqual(path.resolve(PROJECT_ROOT), projectIdentity.DEFAULT_PROJECTS_ROOT);
  console.log(JSON.stringify({
    result: "pass",
    temporary_workspace_root: WORKSPACE_ROOT,
    temporary_project_root: PROJECT_ROOT,
    production_data_touched: false,
    checks: {
      relationship_schema: "pass",
      project_identity: "pass",
      global_id_allocation: "pass",
      attach_lifecycle: "pass",
      detach_lifecycle: "pass",
      append_only_history: "pass",
      optimistic_versioning: "pass",
      persistence_outcomes: "pass",
      reads_and_filters: "pass",
      concurrency: "pass",
      static_boundaries: "pass"
    }
  }, null, 2));
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

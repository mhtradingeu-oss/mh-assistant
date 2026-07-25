#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const {
  WorkspaceProjectIdentityBindingError,
  inspectWorkspaceProjectIdentityBinding,
  validateWorkspaceProjectIdentityBinding
} = require("../runtime/orchestrator-service/lib/projects/workspace-project-identity-binding");

const RUNTIME_ROOT = path.resolve(__dirname, "../runtime/orchestrator-service/lib");
const TS = "2026-01-01T00:00:00.000Z";
const id = (prefix, character) => `${prefix}_${character.repeat(32)}`;

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function project(projectsRoot, slug, projectId, projection) {
  const record = {
    project_name: slug,
    project_type: "service",
    market: "Germany",
    language: "de",
    project_id: projectId,
    project_identity: { schema_version: 1, created_at: TS, source: "project-runtime" }
  };
  if (projection) record.workspace_projection = projection;
  writeJson(path.join(projectsRoot, slug, "project.json"), record);
}

function relationship(projectId, relationshipId, status = "ATTACHED") {
  return {
    relationship_schema_version: 1,
    relationship_id: relationshipId,
    project_id: projectId,
    relationship_status: status,
    validation_state: "VALID",
    created_at: TS,
    updated_at: TS,
    attached_at: status === "ATTACHED" ? TS : null,
    detached_at: null,
    archived_at: null
  };
}

function workspace(workspaceRoot, workspaceId, relationships, version = 1) {
  writeJson(path.join(workspaceRoot, workspaceId, "workspace.json"), {
    schema_version: 1,
    workspace_id: workspaceId,
    workspace_version: version,
    workspace_name: workspaceId,
    status: "ACTIVE",
    ownership_state: "SHADOW",
    created_at: TS,
    updated_at: TS,
    project_relationships: relationships,
    evidence_references: []
  });
}

function projection(workspaceId, relationshipId, version = 1) {
  return {
    projection_schema_version: 1,
    workspace_id: workspaceId,
    relationship_id: relationshipId,
    relationship_status: "ATTACHED",
    workspace_version: version,
    projected_at: TS,
    authoritative: false,
    source_owner: "workspace-runtime"
  };
}

function inventory(root) {
  const output = [];
  function visit(current) {
    if (!fs.existsSync(current)) return;
    for (const entry of fs.readdirSync(current, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const target = path.join(current, entry.name);
      if (entry.isDirectory()) visit(target);
      else output.push(`${path.relative(root, target)}:${fs.readFileSync(target, "utf8")}`);
    }
  }
  visit(root);
  return output;
}

function inspect(slug, projectsRoot, workspaceRoot) {
  return inspectWorkspaceProjectIdentityBinding(slug, { projectsRoot, workspaceRoot, runtimeRoot: RUNTIME_ROOT });
}

function run() {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "mh-phase-b-binding-"));
  try {
    const projectsRoot = path.join(fixture, "projects");
    const workspaceRoot = path.join(fixture, "workspaces");
    const projectA = id("prj", "a");
    const projectB = id("prj", "b");
    const workspaceA = id("ws", "c");
    const workspaceB = id("ws", "d");
    const relationshipA = id("wpr", "e");
    const relationshipB = id("wpr", "f");

    project(projectsRoot, "alpha", projectA, projection(workspaceA, relationshipA));
    project(projectsRoot, "beta", projectB);
    workspace(workspaceRoot, workspaceA, [relationship(projectA, relationshipA)]);

    const before = inventory(fixture);
    const ready = inspect("alpha", projectsRoot, workspaceRoot);
    const repeated = inspect("alpha", projectsRoot, workspaceRoot);
    assert.deepEqual(repeated, ready, "readiness output must be deterministic");
    assert.deepEqual(inventory(fixture), before, "inspection must not mutate Project or Workspace data");
    assert.equal(ready.readiness.state, "READY");
    assert.equal(ready.project.project_id, projectA, "existing project identity must be preserved");
    assert.equal(ready.workspace_binding.workspace_id, workspaceA, "existing Workspace relationship must be preserved");
    assert.equal(ready.authority.creates_identity, false);
    assert.equal(ready.project_projection.authoritative, false);

    const isolated = inspect("beta", projectsRoot, workspaceRoot);
    assert.equal(isolated.project.project_id, projectB);
    assert.equal(isolated.workspace_binding, null);
    assert.equal(isolated.readiness.state, "MISSING_WORKSPACE_BINDING");
    assert.equal(ready.workspace_binding.workspace_id, workspaceA, "another Project inspection cannot cross-bind identity");

    workspace(workspaceRoot, workspaceB, [relationship(projectA, relationshipB)]);
    const ambiguous = inspect("alpha", projectsRoot, workspaceRoot);
    assert.equal(ambiguous.readiness.state, "AMBIGUOUS_WORKSPACE_BINDING");
    assert.equal(ambiguous.workspace_binding, null);

    fs.rmSync(path.join(workspaceRoot, workspaceB), { recursive: true });
    project(projectsRoot, "alpha", projectA, projection(workspaceA, relationshipB));
    const mismatch = inspect("alpha", projectsRoot, workspaceRoot);
    assert.equal(mismatch.readiness.state, "PROJECTION_MISMATCH");

    project(projectsRoot, "alpha", projectA);
    const missingProjection = inspect("alpha", projectsRoot, workspaceRoot);
    assert.equal(missingProjection.readiness.state, "PROJECTION_MISSING");

    const invalid = JSON.parse(JSON.stringify(ready));
    invalid.authority.creates_identity = true;
    assert.throws(
      () => validateWorkspaceProjectIdentityBinding(invalid),
      (error) => error instanceof WorkspaceProjectIdentityBindingError
    );
    const falselyReady = JSON.parse(JSON.stringify(ready));
    falselyReady.project_projection.aligned = false;
    assert.throws(
      () => validateWorkspaceProjectIdentityBinding(falselyReady),
      (error) => error instanceof WorkspaceProjectIdentityBindingError
    );

    const liveProjectFile = path.resolve(__dirname, "../data/projects/hairoticmen/project.json");
    const liveWorkspaceRoot = path.resolve(__dirname, "../data/workspaces");
    const liveBefore = {
      project: fs.readFileSync(liveProjectFile, "utf8"),
      workspaces: inventory(liveWorkspaceRoot)
    };
    const hairoticmen = inspectWorkspaceProjectIdentityBinding("hairoticmen", {
      projectsRoot: path.resolve(__dirname, "../data/projects"),
      workspaceRoot: path.resolve(__dirname, "../data/workspaces"),
      runtimeRoot: RUNTIME_ROOT
    });
    assert.equal(hairoticmen.readiness.state, "MISSING_PROJECT_IDENTITY");
    assert.equal(hairoticmen.readiness.ready, false);
    assert.deepEqual({
      project: fs.readFileSync(liveProjectFile, "utf8"),
      workspaces: inventory(liveWorkspaceRoot)
    }, liveBefore, "HairoticMen readiness inspection must be read-only");

    console.log(JSON.stringify({
      ok: true,
      ready_fixture: ready.readiness,
      missing_binding_fixture: isolated.readiness,
      hairoticmen: hairoticmen.readiness,
      authority: ready.authority
    }, null, 2));
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
}

run();

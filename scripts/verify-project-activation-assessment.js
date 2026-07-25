#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const {
  PROJECT_ACTIVATION_STAGE_NAMES,
  ProjectActivationContractError,
  validateProjectActivationContract
} = require("../runtime/orchestrator-service/lib/projects/project-activation-contract");
const {
  assessProjectActivation
} = require("../runtime/orchestrator-service/lib/projects/project-activation-assessment");

const REPOSITORY_ROOT = path.resolve(__dirname, "..");
const RUNTIME_ROOT = path.join(REPOSITORY_ROOT, "runtime/orchestrator-service/lib");
const TS = "2026-01-01T00:00:00.000Z";
const id = (prefix, character) => `${prefix}_${character.repeat(32)}`;

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function projection(workspaceId, relationshipId) {
  return {
    projection_schema_version: 1,
    workspace_id: workspaceId,
    relationship_id: relationshipId,
    relationship_status: "ATTACHED",
    workspace_version: 1,
    projected_at: TS,
    authoritative: false,
    source_owner: "workspace-runtime"
  };
}

function createProject(projectsRoot, slug, projectId, workspaceId, relationshipId) {
  writeJson(path.join(projectsRoot, slug, "project.json"), {
    project_name: slug,
    project_type: "service",
    market: "Germany",
    language: "de",
    project_id: projectId,
    project_identity: { schema_version: 1, created_at: TS, source: "project-runtime" },
    workspace_projection: projection(workspaceId, relationshipId)
  });
}

function createWorkspace(workspaceRoot, workspaceId, projectId, relationshipId) {
  writeJson(path.join(workspaceRoot, workspaceId, "workspace.json"), {
    schema_version: 1,
    workspace_id: workspaceId,
    workspace_version: 1,
    workspace_name: workspaceId,
    status: "ACTIVE",
    ownership_state: "SHADOW",
    created_at: TS,
    updated_at: TS,
    project_relationships: [{
      relationship_schema_version: 1,
      relationship_id: relationshipId,
      project_id: projectId,
      relationship_status: "ATTACHED",
      validation_state: "VALID",
      created_at: TS,
      updated_at: TS,
      attached_at: TS,
      detached_at: null,
      archived_at: null
    }],
    evidence_references: []
  });
}

function inventory(root) {
  const records = [];
  function visit(current) {
    if (!fs.existsSync(current)) return;
    for (const entry of fs.readdirSync(current, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const target = path.join(current, entry.name);
      if (entry.isDirectory()) visit(target);
      else {
        records.push({
          path: path.relative(root, target),
          hash: crypto.createHash("sha256").update(fs.readFileSync(target)).digest("hex")
        });
      }
    }
  }
  visit(root);
  return records;
}

function assess(slug, roots) {
  return assessProjectActivation(slug, {
    projectsRoot: roots.projects,
    workspaceRoot: roots.workspaces,
    registryPath: roots.registry,
    runtimeRoot: RUNTIME_ROOT
  });
}

function run() {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "mh-phase-d-activation-"));
  try {
    const roots = {
      projects: path.join(fixture, "projects"),
      workspaces: path.join(fixture, "workspaces"),
      registry: path.join(fixture, "projects", "registry.json")
    };
    const alpha = { project: id("prj", "a"), workspace: id("ws", "c"), relationship: id("wpr", "e") };
    const beta = { project: id("prj", "b"), workspace: id("ws", "d"), relationship: id("wpr", "f") };
    createProject(roots.projects, "alpha", alpha.project, alpha.workspace, alpha.relationship);
    createProject(roots.projects, "beta", beta.project, beta.workspace, beta.relationship);
    createWorkspace(roots.workspaces, alpha.workspace, alpha.project, alpha.relationship);
    createWorkspace(roots.workspaces, beta.workspace, beta.project, beta.relationship);
    writeJson(roots.registry, [{ project_name: "alpha" }, { project_name: "beta" }]);

    const before = inventory(fixture);
    const ready = assess("alpha", roots);
    assert.deepEqual(assess("alpha", roots), ready, "unchanged inputs must produce an identical assessment");
    assert.deepEqual(inventory(fixture), before, "assessment must not mutate Project, Workspace, or registry files");
    assert.equal(ready.activation_status.state, "READY_FOR_ACTIVATION");
    assert.equal(ready.activation_status.ready, true);
    assert.deepEqual(ready.activation_path.map((item) => item.name), PROJECT_ACTIVATION_STAGE_NAMES);
    assert.equal(ready.project.project_id, alpha.project, "assessment must preserve the authoritative Project ID");
    assert.equal(ready.authority.creates_identity, false);
    assert.equal(ready.authority.writes_registry, false);
    assert.equal(ready.authority.writes_project_files, false);
    assert.equal(ready.authority.mutates_filesystem, false);

    const isolated = assess("beta", roots);
    assert.equal(isolated.activation_status.state, "READY_FOR_ACTIVATION");
    assert.equal(isolated.project.project_id, beta.project);
    assert.notEqual(isolated.project.project_id, ready.project.project_id);
    assert.equal(isolated.activation_path[0].state, "RESOLVED");

    writeJson(roots.registry, [{ project_name: "beta" }]);
    const blocked = assess("alpha", roots);
    assert.equal(blocked.activation_status.state, "BLOCKED");
    assert.deepEqual(blocked.activation_status.blockers, ["project_registry:PROJECT_NOT_REGISTERED"]);
    assert.equal(blocked.project.project_id, alpha.project, "registry evidence must never replace Project identity");

    const invalid = JSON.parse(JSON.stringify(ready));
    invalid.authority.writes_registry = true;
    assert.throws(
      () => validateProjectActivationContract(invalid),
      (error) => error instanceof ProjectActivationContractError
    );
    const contradictory = JSON.parse(JSON.stringify(ready));
    contradictory.activation_status.state = "BLOCKED";
    assert.throws(
      () => validateProjectActivationContract(contradictory),
      (error) => error instanceof ProjectActivationContractError
    );

    const implementation = [
      "project-activation-contract.js",
      "project-activation-assessment.js"
    ].map((name) => fs.readFileSync(path.join(RUNTIME_ROOT, "projects", name), "utf8")).join("\n");
    [
      /generateProjectId/,
      /generateWorkspaceId/,
      /ensureProjectIdentityForAttach/,
      /createWorkspace/,
      /attachProject/,
      /writeProjectWorkspaceProjection/,
      /writeFileSync/,
      /renameSync/,
      /unlinkSync/
    ].forEach((forbidden) => {
      assert.equal(forbidden.test(implementation), false, `activation layer contains forbidden mutation path: ${forbidden}`);
    });

    const liveRoots = {
      projects: path.join(REPOSITORY_ROOT, "data/projects"),
      workspaces: path.join(REPOSITORY_ROOT, "data/workspaces"),
      registry: path.join(REPOSITORY_ROOT, "data/projects/registry.json")
    };
    const liveBefore = inventory(path.join(REPOSITORY_ROOT, "data"));
    const hairoticmen = assess("hairoticmen", liveRoots);
    assert.equal(hairoticmen.activation_status.state, "BLOCKED");
    assert.equal(hairoticmen.lifecycle_prerequisites.state, "MISSING_PROJECT_IDENTITY");
    assert.equal(hairoticmen.project.project_id, null);
    assert.deepEqual(inventory(path.join(REPOSITORY_ROOT, "data")), liveBefore, "HairoticMen assessment must not change existing project data");

    console.log(JSON.stringify({
      ok: true,
      ready_fixture: ready.activation_status,
      isolated_fixture: isolated.activation_status,
      missing_registration_fixture: blocked.activation_status,
      hairoticmen: {
        project: hairoticmen.project,
        activation_status: hairoticmen.activation_status,
        lifecycle_prerequisites: hairoticmen.lifecycle_prerequisites,
        capabilities: hairoticmen.capabilities
      },
      authority: ready.authority
    }, null, 2));
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
}

run();

#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const {
  PROJECT_LIFECYCLE_STAGE_NAMES,
  ProjectLifecycleReadinessError,
  inspectProjectLifecycleReadiness,
  validateProjectLifecycleReadiness
} = require("../runtime/orchestrator-service/lib/projects/project-lifecycle-readiness");

const RUNTIME_ROOT = path.resolve(__dirname, "../runtime/orchestrator-service/lib");
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

function project(projectsRoot, slug, projectId, workspaceProjection) {
  writeJson(path.join(projectsRoot, slug, "project.json"), {
    project_name: slug,
    project_type: "service",
    market: "Germany",
    language: "de",
    project_id: projectId,
    project_identity: { schema_version: 1, created_at: TS, source: "project-runtime" },
    workspace_projection: workspaceProjection
  });
}

function workspace(workspaceRoot, workspaceId, projectId, relationshipId) {
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
  const result = [];
  function visit(current) {
    if (!fs.existsSync(current)) return;
    for (const entry of fs.readdirSync(current, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const target = path.join(current, entry.name);
      if (entry.isDirectory()) visit(target);
      else result.push(`${path.relative(root, target)}:${fs.readFileSync(target, "utf8")}`);
    }
  }
  visit(root);
  return result;
}

function inspect(slug, roots) {
  return inspectProjectLifecycleReadiness(slug, {
    projectsRoot: roots.projects,
    workspaceRoot: roots.workspaces,
    registryPath: roots.registry,
    runtimeRoot: RUNTIME_ROOT
  });
}

function run() {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "mh-phase-c-lifecycle-"));
  try {
    const roots = {
      projects: path.join(fixture, "projects"),
      workspaces: path.join(fixture, "workspaces"),
      registry: path.join(fixture, "projects", "registry.json")
    };
    const projectA = id("prj", "a");
    const projectB = id("prj", "b");
    const workspaceA = id("ws", "c");
    const workspaceB = id("ws", "d");
    const relationshipA = id("wpr", "e");
    const relationshipB = id("wpr", "f");

    project(roots.projects, "alpha", projectA, projection(workspaceA, relationshipA));
    project(roots.projects, "beta", projectB, projection(workspaceB, relationshipB));
    workspace(roots.workspaces, workspaceA, projectA, relationshipA);
    workspace(roots.workspaces, workspaceB, projectB, relationshipB);
    writeJson(roots.registry, [{ project_name: "alpha" }, { project_name: "beta" }]);

    const before = inventory(fixture);
    const alpha = inspect("alpha", roots);
    const repeated = inspect("alpha", roots);
    assert.deepEqual(alpha, repeated, "lifecycle inspection must be deterministic");
    assert.deepEqual(inventory(fixture), before, "lifecycle inspection must not mutate data");
    assert.equal(alpha.readiness.state, "READY");
    assert.equal(alpha.project.project_id, projectA, "Project identity authority must be preserved");
    assert.deepEqual(alpha.lifecycle.map((stage) => stage.name), PROJECT_LIFECYCLE_STAGE_NAMES);
    assert.equal(alpha.lifecycle[0].source_owner, "workspace-runtime");
    assert.equal(alpha.lifecycle[2].source_owner, "project-identity");
    assert.equal(alpha.lifecycle[4].authoritative, false);
    assert.equal(alpha.authority.creates_identity, false);
    assert.equal(alpha.authority.registers_project, false);
    assert.equal(alpha.authority.mutates_data, false);

    const beta = inspect("beta", roots);
    assert.equal(beta.readiness.state, "READY");
    assert.equal(beta.project.project_id, projectB);
    assert.notEqual(beta.project.project_id, alpha.project.project_id);
    assert.equal(beta.lifecycle[0].state, "RESOLVED");

    writeJson(roots.registry, [{ project_name: "beta" }]);
    const missingRegistration = inspect("alpha", roots);
    assert.equal(missingRegistration.readiness.state, "PROJECT_NOT_REGISTERED");
    assert.equal(missingRegistration.lifecycle[3].state, "PROJECT_NOT_REGISTERED");
    assert.equal(missingRegistration.project.project_id, projectA, "registry must not replace identity authority");

    writeJson(roots.registry, [{ project_name: "alpha" }, { project_name: "alpha" }, { project_name: "beta" }]);
    const duplicateRegistration = inspect("alpha", roots);
    assert.equal(duplicateRegistration.readiness.state, "DUPLICATE_PROJECT_REGISTRATION");

    writeJson(roots.registry, { records: [{ project_name: "alpha" }] });
    const invalidRegistry = inspect("alpha", roots);
    assert.equal(invalidRegistry.readiness.state, "REGISTRY_INVALID");

    const invalid = JSON.parse(JSON.stringify(alpha));
    invalid.lifecycle[2].source_owner = "project-lifecycle-readiness";
    assert.throws(
      () => validateProjectLifecycleReadiness(invalid),
      (error) => error instanceof ProjectLifecycleReadinessError
    );
    const mutating = JSON.parse(JSON.stringify(alpha));
    mutating.authority.mutates_data = true;
    assert.throws(
      () => validateProjectLifecycleReadiness(mutating),
      (error) => error instanceof ProjectLifecycleReadinessError
    );

    const implementation = fs.readFileSync(path.resolve(
      __dirname,
      "../runtime/orchestrator-service/lib/projects/project-lifecycle-readiness.js"
    ), "utf8");
    [
      /generateProjectId/,
      /ensureProjectIdentityForAttach/,
      /createWorkspace/,
      /attachProject/,
      /writeProjectWorkspaceProjection/,
      /writeFileSync/,
      /renameSync/,
      /unlinkSync/
    ].forEach((forbidden) => {
      assert.equal(forbidden.test(implementation), false, `readiness layer contains forbidden mutation path: ${forbidden}`);
    });

    const liveRoot = path.resolve(__dirname, "../data");
    const liveProjectFile = path.join(liveRoot, "projects", "hairoticmen", "project.json");
    const liveRegistryFile = path.join(liveRoot, "projects", "registry.json");
    const liveWorkspaceRoot = path.join(liveRoot, "workspaces");
    const liveBefore = {
      project: fs.readFileSync(liveProjectFile, "utf8"),
      registry: fs.readFileSync(liveRegistryFile, "utf8"),
      workspaces: inventory(liveWorkspaceRoot)
    };
    const hairoticmen = inspectProjectLifecycleReadiness("hairoticmen", {
      projectsRoot: path.join(liveRoot, "projects"),
      workspaceRoot: path.join(liveRoot, "workspaces"),
      registryPath: path.join(liveRoot, "projects", "registry.json"),
      runtimeRoot: RUNTIME_ROOT
    });
    assert.equal(hairoticmen.readiness.state, "MISSING_PROJECT_IDENTITY");
    assert.equal(hairoticmen.readiness.ready, false);
    assert.equal(hairoticmen.lifecycle[3].state, "REGISTERED");
    assert.deepEqual({
      project: fs.readFileSync(liveProjectFile, "utf8"),
      registry: fs.readFileSync(liveRegistryFile, "utf8"),
      workspaces: inventory(liveWorkspaceRoot)
    }, liveBefore, "HairoticMen activation check must be read-only");

    console.log(JSON.stringify({
      ok: true,
      ready_fixture: alpha.readiness,
      missing_registration_fixture: missingRegistration.readiness,
      duplicate_registration_fixture: duplicateRegistration.readiness,
      invalid_registry_fixture: invalidRegistry.readiness,
      hairoticmen: hairoticmen.readiness,
      authority: alpha.authority
    }, null, 2));
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
}

run();

#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const {
  BootstrapAuthorityContractError,
  validateBootstrapAuthorityAssessment
} = require("../runtime/orchestrator-service/lib/projects/bootstrap-authority-contract");
const {
  assessBootstrapAuthority
} = require("../runtime/orchestrator-service/lib/projects/bootstrap-authority-assessment");

const REPOSITORY_ROOT = path.resolve(__dirname, "..");
const RUNTIME_ROOT = path.join(REPOSITORY_ROOT, "runtime/orchestrator-service/lib");
const TS = "2026-01-01T00:00:00.000Z";
const id = (prefix, character) => `${prefix}_${character.repeat(32)}`;

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function createProject(projectsRoot, slug, projectId, workspaceId, relationshipId) {
  const record = {
    project_name: slug,
    project_type: "service",
    market: "Germany",
    language: "de"
  };
  if (projectId) {
    record.project_id = projectId;
    record.project_identity = { schema_version: 1, created_at: TS, source: "project-runtime" };
    record.workspace_projection = {
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
  writeJson(path.join(projectsRoot, slug, "project.json"), record);
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
      else records.push({
        path: path.relative(root, target),
        hash: crypto.createHash("sha256").update(fs.readFileSync(target)).digest("hex")
      });
    }
  }
  visit(root);
  return records;
}

function assess(slug, roots) {
  return assessBootstrapAuthority(slug, {
    projectsRoot: roots.projects,
    workspaceRoot: roots.workspaces,
    registryPath: roots.registry,
    runtimeRoot: RUNTIME_ROOT
  });
}

function run() {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "mh-phase-e-bootstrap-"));
  try {
    const roots = {
      projects: path.join(fixture, "projects"),
      workspaces: path.join(fixture, "workspaces"),
      registry: path.join(fixture, "projects", "registry.json")
    };
    const alpha = { project: id("prj", "a"), workspace: id("ws", "c"), relationship: id("wpr", "e") };
    createProject(roots.projects, "alpha", alpha.project, alpha.workspace, alpha.relationship);
    createProject(roots.projects, "legacy", null, null, null);
    createWorkspace(roots.workspaces, alpha.workspace, alpha.project, alpha.relationship);
    writeJson(roots.registry, [{ project_name: "alpha" }, { project_name: "legacy" }]);

    const before = inventory(fixture);
    const newRequest = assess("requested", roots);
    const missingIdentity = assess("legacy", roots);
    const ready = assess("alpha", roots);

    assert.equal(newRequest.scenario, "NEW_PROJECT_REQUEST");
    assert.equal(newRequest.project.exists, false);
    assert.equal(newRequest.required_project_state.current_state, "NOT_FOUND");
    assert.equal(newRequest.required_workspace_state.current_state, "NOT_ASSESSABLE");
    assert.equal(newRequest.activation_readiness.assessment, null);
    assert.equal(newRequest.decision.state, "EXISTING_LIFECYCLE_REQUIRED");

    assert.equal(missingIdentity.scenario, "EXISTING_PROJECT_WITHOUT_IDENTITY");
    assert.equal(missingIdentity.project.exists, true);
    assert.equal(missingIdentity.identity_readiness.state, "MISSING");
    assert.equal(missingIdentity.identity_readiness.ready, false);
    assert.equal(missingIdentity.activation_readiness.state, "BLOCKED");
    assert.equal(missingIdentity.decision.state, "PROJECT_IDENTITY_REQUIRED");

    assert.equal(ready.scenario, "READY_PROJECT");
    assert.equal(ready.project.project_id, alpha.project);
    assert.equal(ready.required_workspace_state.satisfied, true);
    assert.equal(ready.required_project_state.satisfied, true);
    assert.equal(ready.activation_readiness.state, "READY_FOR_ACTIVATION");
    assert.equal(ready.decision.state, "NO_BOOTSTRAP_REQUIRED");
    assert.equal(ready.decision.ready, true);
    assert.equal(ready.authority.writes_binding, false);
    assert.equal(ready.authority.writes_project_files, false);
    assert.equal(ready.authority.mutates_data, false);

    assert.deepEqual(assess("requested", roots), newRequest, "new Project decisions must be deterministic");
    assert.deepEqual(assess("legacy", roots), missingIdentity, "missing identity decisions must be deterministic");
    assert.deepEqual(assess("alpha", roots), ready, "ready Project decisions must be deterministic");
    assert.deepEqual(inventory(fixture), before, "all Bootstrap Authority scenarios must be read-only");
    assert.ok(Object.isFrozen(ready) && Object.isFrozen(ready.activation_readiness.assessment));

    assert.notEqual(ready.project.project_slug, missingIdentity.project.project_slug);
    assert.notEqual(ready.project.project_id, missingIdentity.project.project_id);
    assert.equal(missingIdentity.activation_readiness.assessment.project.project_slug, "legacy");
    assert.equal(ready.activation_readiness.assessment.project.project_slug, "alpha");

    const invalid = JSON.parse(JSON.stringify(ready));
    invalid.authority.creates_identity = true;
    assert.throws(
      () => validateBootstrapAuthorityAssessment(invalid),
      (error) => error instanceof BootstrapAuthorityContractError
    );
    const contradictory = JSON.parse(JSON.stringify(ready));
    contradictory.identity_readiness.ready = false;
    assert.throws(
      () => validateBootstrapAuthorityAssessment(contradictory),
      (error) => error instanceof BootstrapAuthorityContractError
    );

    const implementation = [
      "bootstrap-authority-contract.js",
      "bootstrap-authority-assessment.js"
    ].map((name) => fs.readFileSync(path.join(RUNTIME_ROOT, "projects", name), "utf8")).join("\n");
    const assessmentImplementation = fs.readFileSync(
      path.join(RUNTIME_ROOT, "projects", "bootstrap-authority-assessment.js"),
      "utf8"
    );
    assert.match(assessmentImplementation, /assessProjectActivation/, "Phase E must compose Phase D");
    assert.doesNotMatch(assessmentImplementation, /project-lifecycle-readiness|workspace-project-identity-binding/,
      "Phase E must not duplicate Phase B or C lifecycle inspection");
    [
      /generateProjectId/,
      /generateWorkspaceId/,
      /ensureProjectIdentityForAttach/,
      /createWorkspace/,
      /createProject\s*\(/,
      /attachProject/,
      /writeProjectWorkspaceProjection/,
      /writeFileSync/,
      /renameSync/,
      /unlinkSync/
    ].forEach((forbidden) => {
      assert.equal(forbidden.test(implementation), false, `Bootstrap Authority layer contains forbidden mutation path: ${forbidden}`);
    });

    const liveData = path.join(REPOSITORY_ROOT, "data");
    const liveBefore = inventory(liveData);
    const hairoticmen = assessBootstrapAuthority("hairoticmen", {
      projectsRoot: path.join(liveData, "projects"),
      workspaceRoot: path.join(liveData, "workspaces"),
      registryPath: path.join(liveData, "projects", "registry.json"),
      runtimeRoot: RUNTIME_ROOT
    });
    assert.equal(hairoticmen.scenario, "EXISTING_PROJECT_WITHOUT_IDENTITY");
    assert.equal(hairoticmen.identity_readiness.state, "MISSING");
    assert.equal(hairoticmen.activation_readiness.state, "BLOCKED");
    assert.equal(hairoticmen.project.project_id, null);
    assert.deepEqual(inventory(liveData), liveBefore, "HairoticMen assessment must not mutate live data");

    console.log(JSON.stringify({
      ok: true,
      scenarios: {
        new_project_request: newRequest.decision,
        existing_project_without_identity: missingIdentity.decision,
        ready_project: ready.decision
      },
      hairoticmen: {
        scenario: hairoticmen.scenario,
        identity_readiness: hairoticmen.identity_readiness,
        activation_readiness: {
          state: hairoticmen.activation_readiness.state,
          ready: hairoticmen.activation_readiness.ready,
          blockers: hairoticmen.activation_readiness.blockers
        },
        decision: hairoticmen.decision
      },
      deterministic: true,
      multi_project_isolation: true,
      mutation_free: true,
      authority: ready.authority
    }, null, 2));
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
}

run();

#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const {
  ProductionActivationWorkflowContractError,
  validateProductionActivationWorkflow
} = require("../runtime/orchestrator-service/lib/projects/production-activation-workflow-contract");
const {
  assessProductionActivationWorkflow
} = require("../runtime/orchestrator-service/lib/projects/production-activation-workflow");

const REPOSITORY_ROOT = path.resolve(__dirname, "..");
const RUNTIME_ROOT = path.join(REPOSITORY_ROOT, "runtime/orchestrator-service/lib");
const TS = "2026-01-01T00:00:00.000Z";
const id = (prefix, character) => `${prefix}_${character.repeat(32)}`;

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function createProjectFixture(projectsRoot, slug, projectId, workspaceId, relationshipId) {
  const record = { project_name: slug, project_type: "service", market: "Germany", language: "de" };
  if (projectId) {
    record.project_id = projectId;
    record.project_identity = { schema_version: 1, created_at: TS, source: "project-runtime" };
  }
  if (workspaceId && relationshipId) {
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

function createWorkspaceFixture(workspaceRoot, workspaceId, projectId, relationshipId) {
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
  return assessProductionActivationWorkflow(slug, {
    projectsRoot: roots.projects,
    workspaceRoot: roots.workspaces,
    registryPath: roots.registry,
    runtimeRoot: RUNTIME_ROOT
  });
}

function run() {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "mh-phase-g-activation-workflow-"));
  try {
    const roots = {
      projects: path.join(fixture, "projects"),
      workspaces: path.join(fixture, "workspaces"),
      registry: path.join(fixture, "projects", "registry.json")
    };
    const alpha = { project: id("prj", "a"), workspace: id("ws", "c"), relationship: id("wpr", "e") };
    const beta = { project: id("prj", "b") };
    createProjectFixture(roots.projects, "alpha", alpha.project, alpha.workspace, alpha.relationship);
    createProjectFixture(roots.projects, "beta", beta.project, null, null);
    createProjectFixture(roots.projects, "legacy", null, null, null);
    createWorkspaceFixture(roots.workspaces, alpha.workspace, alpha.project, alpha.relationship);
    writeJson(roots.registry, [
      { project_name: "alpha" },
      { project_name: "beta" },
      { project_name: "legacy" }
    ]);

    const before = inventory(fixture);
    const newProject = assess("requested", roots);
    const missingIdentity = assess("legacy", roots);
    const readyProject = assess("alpha", roots);
    const blockedProject = assess("beta", roots);

    assert.equal(newProject.workflow_state, "PREREQUISITES_REQUIRED");
    assert.equal(newProject.readiness.state, "NOT_ASSESSABLE");
    assert.deepEqual(newProject.required_authority.owners, [
      "project-identity", "workspace-relationship-runtime", "workspace-runtime"
    ]);
    assert.equal(newProject.approval_requirement.state, "NOT_APPLICABLE");

    assert.equal(missingIdentity.workflow_state, "PREREQUISITES_REQUIRED");
    assert.equal(missingIdentity.readiness.state, "BLOCKED");
    assert.deepEqual(missingIdentity.required_authority.owners, ["project-identity"]);
    assert.equal(missingIdentity.execution_owner.executable, false);

    assert.equal(blockedProject.workflow_state, "PREREQUISITES_REQUIRED");
    assert.equal(blockedProject.readiness.state, "BLOCKED");
    assert.deepEqual(blockedProject.required_authority.owners, ["project-activation-assessment"]);

    assert.equal(readyProject.readiness.state, "READY_FOR_ACTIVATION");
    assert.equal(readyProject.readiness.ready, true);
    assert.equal(readyProject.workflow_state, "MISSING_AUTHORITY");
    assert.equal(readyProject.authorization.state, "MISSING_AUTHORITY");
    assert.equal(readyProject.authorization.authorized, false);
    assert.equal(readyProject.required_authority.state, "PRODUCTION_ACTIVATION_AUTHORITY_UNRESOLVED");
    assert.deepEqual(readyProject.required_authority.owners, []);
    assert.equal(readyProject.approval_requirement.state, "REQUIRED");
    assert.equal(readyProject.approval_requirement.satisfied, false);
    assert.equal(readyProject.execution_owner.state, "UNRESOLVED");
    assert.equal(readyProject.execution_owner.owner, null);
    assert.equal(readyProject.execution_owner.executable, false);

    for (const [slug, first] of [
      ["requested", newProject], ["legacy", missingIdentity], ["alpha", readyProject], ["beta", blockedProject]
    ]) {
      assert.deepEqual(assess(slug, roots), first, `${slug} workflow must be deterministic`);
    }
    assert.deepEqual(inventory(fixture), before, "all Phase G scenarios must be read-only");
    assert.ok(Object.isFrozen(readyProject));
    assert.ok(Object.isFrozen(readyProject.source_evidence.orchestration));

    assert.equal(readyProject.activation_request.project_slug, "alpha");
    assert.equal(blockedProject.activation_request.project_slug, "beta");
    assert.notEqual(
      readyProject.source_evidence.orchestration.current_state.project_id,
      blockedProject.source_evidence.orchestration.current_state.project_id
    );

    const falselyAuthorized = JSON.parse(JSON.stringify(readyProject));
    falselyAuthorized.authorization.authorized = true;
    assert.throws(
      () => validateProductionActivationWorkflow(falselyAuthorized),
      (error) => error instanceof ProductionActivationWorkflowContractError
    );
    const inventedExecutor = JSON.parse(JSON.stringify(readyProject));
    inventedExecutor.execution_owner.owner = "workspace-runtime";
    inventedExecutor.execution_owner.executable = true;
    assert.throws(
      () => validateProductionActivationWorkflow(inventedExecutor),
      (error) => error instanceof ProductionActivationWorkflowContractError
    );
    const crossProjectEvidence = JSON.parse(JSON.stringify(readyProject));
    crossProjectEvidence.source_evidence.orchestration = blockedProject.source_evidence.orchestration;
    assert.throws(
      () => validateProductionActivationWorkflow(crossProjectEvidence),
      (error) => error instanceof ProductionActivationWorkflowContractError
    );

    const implementation = [
      "production-activation-workflow-contract.js",
      "production-activation-workflow.js"
    ].map((name) => fs.readFileSync(path.join(RUNTIME_ROOT, "projects", name), "utf8")).join("\n");
    const composer = fs.readFileSync(
      path.join(RUNTIME_ROOT, "projects", "production-activation-workflow.js"),
      "utf8"
    );
    assert.match(composer, /orchestrateOnboarding/, "Phase G must compose Phase F");
    assert.doesNotMatch(
      composer,
      /require\(["']\.\/(?:bootstrap-authority-assessment|project-activation-assessment|project-lifecycle-readiness|workspace-project-identity-binding|universal-project-contract)["']\)/,
      "Phase G must not duplicate Phase A-E inspection"
    );
    [
      /generateProjectId/,
      /generateWorkspaceId/,
      /ensureProjectIdentityForAttach/,
      /createWorkspace\s*\(/,
      /createProject\s*\(/,
      /attachProject/,
      /writeProjectWorkspaceProjection/,
      /createApproval\s*\(/,
      /decideApproval\s*\(/,
      /writeFileSync/,
      /appendFileSync/,
      /renameSync/,
      /unlinkSync/,
      /mkdirSync/,
      /rmSync/
    ].forEach((forbidden) => {
      assert.equal(forbidden.test(implementation), false, `Phase G contains forbidden mutation path: ${forbidden}`);
    });

    const liveData = path.join(REPOSITORY_ROOT, "data");
    const liveBefore = inventory(liveData);
    const hairoticmen = assessProductionActivationWorkflow("hairoticmen", {
      projectsRoot: path.join(liveData, "projects"),
      workspaceRoot: path.join(liveData, "workspaces"),
      registryPath: path.join(liveData, "projects", "registry.json"),
      runtimeRoot: RUNTIME_ROOT
    });
    assert.equal(hairoticmen.activation_request.project_slug, "hairoticmen");
    assert.equal(hairoticmen.workflow_state, "PREREQUISITES_REQUIRED");
    assert.equal(hairoticmen.readiness.state, "BLOCKED");
    assert.deepEqual(hairoticmen.required_authority.owners, ["project-identity"]);
    assert.equal(hairoticmen.execution_owner.executable, false);
    assert.deepEqual(inventory(liveData), liveBefore, "HairoticMen data must remain unchanged");

    console.log(JSON.stringify({
      ok: true,
      scenarios: {
        hairoticmen_blocked: {
          workflow_state: hairoticmen.workflow_state,
          readiness: hairoticmen.readiness.state,
          required_authority: hairoticmen.required_authority.owners
        },
        new_project_request: {
          workflow_state: newProject.workflow_state,
          readiness: newProject.readiness.state,
          required_authority: newProject.required_authority.owners
        },
        ready_project: {
          readiness: readyProject.readiness.state,
          approval_requirement: readyProject.approval_requirement.state
        },
        missing_authority: {
          workflow_state: readyProject.workflow_state,
          authorization: readyProject.authorization.state,
          execution_owner: readyProject.execution_owner.state
        }
      },
      deterministic: true,
      multi_project_isolation: true,
      no_workspace_creation: true,
      no_project_creation: true,
      no_identity_generation: true,
      no_registry_writes: true,
      mutation_free: true
    }, null, 2));
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
}

run();

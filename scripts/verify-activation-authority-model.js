#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const {
  ActivationAuthorityContractError,
  validateActivationAuthorityModel
} = require("../runtime/orchestrator-service/lib/projects/activation-authority-contract");
const {
  assessActivationAuthority
} = require("../runtime/orchestrator-service/lib/projects/activation-authority-model");

const REPOSITORY_ROOT = path.resolve(__dirname, "..");
const RUNTIME_ROOT = path.join(REPOSITORY_ROOT, "runtime/orchestrator-service/lib");
const TS = "2026-01-01T00:00:00.000Z";
const id = (prefix, character) => `${prefix}_${character.repeat(32)}`;

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function createReadyProject(roots, slug, projectId, workspaceId, relationshipId) {
  writeJson(path.join(roots.projects, slug, "project.json"), {
    project_name: slug,
    project_type: "service",
    market: "Germany",
    language: "de",
    project_id: projectId,
    project_identity: { schema_version: 1, created_at: TS, source: "project-runtime" },
    workspace_projection: {
      projection_schema_version: 1,
      workspace_id: workspaceId,
      relationship_id: relationshipId,
      relationship_status: "ATTACHED",
      workspace_version: 1,
      projected_at: TS,
      authoritative: false,
      source_owner: "workspace-runtime"
    }
  });
  writeJson(path.join(roots.workspaces, workspaceId, "workspace.json"), {
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

function options(roots) {
  return {
    projectsRoot: roots.projects,
    workspaceRoot: roots.workspaces,
    registryPath: roots.registry,
    runtimeRoot: RUNTIME_ROOT
  };
}

const requester = Object.freeze({
  requester_id: "principal_operator",
  requester_type: "service",
  evidence_ref: "request-context:operator"
});
const approvalOwner = Object.freeze({
  owner: "operations-backbone",
  evidence_ref: "operations-backbone:approval-owner"
});
const executionOwner = Object.freeze({
  owner: "workspace-runtime",
  evidence_ref: "workspace-runtime:execution-owner"
});

function run() {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "mh-phase-h-activation-authority-"));
  try {
    const roots = {
      projects: path.join(fixture, "projects"),
      workspaces: path.join(fixture, "workspaces"),
      registry: path.join(fixture, "projects", "registry.json")
    };
    const alpha = { project: id("prj", "a"), workspace: id("ws", "c"), relationship: id("wpr", "e") };
    const beta = { project: id("prj", "b"), workspace: id("ws", "d"), relationship: id("wpr", "f") };
    createReadyProject(roots, "alpha", alpha.project, alpha.workspace, alpha.relationship);
    createReadyProject(roots, "beta", beta.project, beta.workspace, beta.relationship);
    writeJson(roots.registry, [{ project_name: "alpha" }, { project_name: "beta" }]);

    const before = inventory(fixture);
    const missingApprovalOwner = assessActivationAuthority("alpha", {
      requester,
      execution_owner: executionOwner
    }, options(roots));
    const missingExecutionOwner = assessActivationAuthority("alpha", {
      requester,
      approval_owner: approvalOwner
    }, options(roots));
    const fullySpecified = assessActivationAuthority("alpha", {
      requester,
      approval_owner: approvalOwner,
      execution_owner: executionOwner
    }, options(roots));
    const isolatedProject = assessActivationAuthority("beta", {
      requester: { ...requester, evidence_ref: "request-context:operator:beta" },
      approval_owner: approvalOwner,
      execution_owner: executionOwner
    }, options(roots));

    assert.equal(missingApprovalOwner.authority_state, "MISSING_APPROVAL_OWNER");
    assert.equal(missingApprovalOwner.approval_owner.owner, null);
    assert.equal(missingApprovalOwner.execution_owner.owner, "workspace-runtime");
    assert.equal(missingExecutionOwner.authority_state, "MISSING_EXECUTION_OWNER");
    assert.equal(missingExecutionOwner.approval_owner.owner, "operations-backbone");
    assert.equal(missingExecutionOwner.execution_owner.owner, null);

    assert.equal(fullySpecified.authority_state, "FULLY_SPECIFIED_READY_ACTIVATION");
    assert.equal(fullySpecified.safety.ownership_complete, true);
    assert.equal(fullySpecified.audit_evidence.complete, true);
    assert.equal(fullySpecified.authorization.state, "MISSING_AUTHORITY");
    assert.equal(fullySpecified.authorization.authorized, false);
    assert.equal(fullySpecified.safety.handoff_ready, false);
    assert.equal(fullySpecified.safety.activation_executable, false);
    assert.equal(fullySpecified.safety.activation_executed, false);

    assert.deepEqual(
      assessActivationAuthority("alpha", {
        requester,
        approval_owner: approvalOwner,
        execution_owner: executionOwner
      }, options(roots)),
      fullySpecified,
      "Phase H output must be deterministic"
    );
    assert.deepEqual(inventory(fixture), before, "Phase H fixture assessment must be read-only");
    assert.ok(Object.isFrozen(fullySpecified));
    assert.ok(Object.isFrozen(fullySpecified.source_evidence.workflow));

    assert.equal(fullySpecified.project_slug, "alpha");
    assert.equal(isolatedProject.project_slug, "beta");
    assert.notEqual(
      fullySpecified.source_evidence.workflow.source_evidence.orchestration.current_state.project_id,
      isolatedProject.source_evidence.workflow.source_evidence.orchestration.current_state.project_id
    );

    const crossProjectEvidence = JSON.parse(JSON.stringify(fullySpecified));
    crossProjectEvidence.source_evidence.workflow = isolatedProject.source_evidence.workflow;
    assert.throws(
      () => validateActivationAuthorityModel(crossProjectEvidence),
      (error) => error instanceof ActivationAuthorityContractError
    );
    const inventedAuthorization = JSON.parse(JSON.stringify(fullySpecified));
    inventedAuthorization.authorization.authorized = true;
    assert.throws(
      () => validateActivationAuthorityModel(inventedAuthorization),
      (error) => error instanceof ActivationAuthorityContractError
    );
    const replacedExecutor = JSON.parse(JSON.stringify(fullySpecified));
    replacedExecutor.execution_owner.owner = "activation-authority-model";
    assert.throws(
      () => validateActivationAuthorityModel(replacedExecutor),
      (error) => error instanceof ActivationAuthorityContractError
    );

    const implementation = [
      "activation-authority-contract.js",
      "activation-authority-model.js"
    ].map((name) => fs.readFileSync(path.join(RUNTIME_ROOT, "projects", name), "utf8")).join("\n");
    assert.match(implementation, /assessProductionActivationWorkflow/, "Phase H must compose Phase G");
    assert.doesNotMatch(
      implementation,
      /require\(["']\.\/(?:project-activation-assessment|onboarding-orchestration|bootstrap-authority-assessment|project-lifecycle-readiness|workspace-project-identity-binding|universal-project-contract)["']\)/,
      "Phase H must not duplicate Phase A-F governance"
    );
    [
      /createApproval\s*\(/,
      /decideApproval\s*\(/,
      /createWorkspace\s*\(/,
      /updateWorkspace\s*\(/,
      /transitionWorkspace\s*\(/,
      /attachProject/,
      /ensureProjectIdentityForAttach/,
      /writeProjectWorkspaceProjection/,
      /writeFileSync/,
      /appendFileSync/,
      /renameSync/,
      /unlinkSync/,
      /mkdirSync/,
      /rmSync/,
      /mutateRole/,
      /updateTeam/,
      /setPermission/
    ].forEach((forbidden) => {
      assert.equal(forbidden.test(implementation), false, `Phase H contains forbidden mutation path: ${forbidden}`);
    });

    const liveData = path.join(REPOSITORY_ROOT, "data");
    const liveBefore = inventory(liveData);
    const hairoticmen = assessActivationAuthority("hairoticmen", { requester }, {
      projectsRoot: path.join(liveData, "projects"),
      workspaceRoot: path.join(liveData, "workspaces"),
      registryPath: path.join(liveData, "projects", "registry.json"),
      runtimeRoot: RUNTIME_ROOT
    });
    assert.equal(hairoticmen.authority_state, "BLOCKED_ACTIVATION");
    assert.equal(hairoticmen.source_evidence.workflow.readiness.state, "BLOCKED");
    assert.deepEqual(hairoticmen.source_evidence.workflow.required_authority.owners, ["project-identity"]);
    assert.equal(hairoticmen.approval_owner.state, "NOT_APPLICABLE");
    assert.equal(hairoticmen.execution_owner.state, "NOT_APPLICABLE");
    assert.equal(hairoticmen.safety.activation_executed, false);
    assert.deepEqual(inventory(liveData), liveBefore, "HairoticMen data must remain unchanged");

    console.log(JSON.stringify({
      ok: true,
      scenarios: {
        hairoticmen_blocked: hairoticmen.authority_state,
        missing_approval_owner: missingApprovalOwner.authority_state,
        missing_execution_owner: missingExecutionOwner.authority_state,
        fully_specified_ready_activation: fullySpecified.authority_state
      },
      authorization_preserved_from_phase_g: true,
      activation_executed: false,
      approval_created: false,
      roles_mutated: false,
      permissions_mutated: false,
      workspace_mutated: false,
      project_mutated: false,
      deterministic: true,
      multi_project_isolation: true,
      runtime_filesystem_writes: false
    }, null, 2));
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
}

run();

#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const {
  ActivationExecutorContractError,
  validateActivationExecutorResult
} = require("../runtime/orchestrator-service/lib/projects/activation-executor-contract");
const {
  executeActivationDryRun
} = require("../runtime/orchestrator-service/lib/projects/activation-executor-boundary");

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

function authorityEvidence(suffix) {
  return {
    requester: {
      requester_id: `principal_operator_${suffix}`,
      requester_type: "service",
      evidence_ref: `request-context:${suffix}`
    },
    approval_owner: {
      owner: "operations-backbone",
      evidence_ref: `operations-backbone:approval-owner:${suffix}`
    },
    execution_owner: {
      owner: "workspace-runtime",
      evidence_ref: `workspace-runtime:execution-owner:${suffix}`
    }
  };
}

function approvalEvidence(slug, suffix) {
  return {
    approval_id: `approval_${suffix}`,
    decision: "APPROVED",
    project_slug: slug,
    action: "ACTIVATE_PROJECT",
    policy_version: "activation-policy-v1",
    decided_by: `governance_reviewer_${suffix}`,
    decided_at: TS,
    source_owner: "operations-backbone",
    evidence_ref: `operations-backbone:approval:${suffix}`
  };
}

function executorEvidence(slug, projectId, suffix) {
  return {
    executor_id: "workspace-runtime",
    project_slug: slug,
    project_id: projectId,
    action: "ACTIVATE_PROJECT",
    mode: "DRY_RUN",
    source_owner: "workspace-runtime",
    evidence_ref: `workspace-runtime:dry-run:${suffix}`
  };
}

function run() {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "mh-phase-i-activation-executor-"));
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
    const missingApproval = executeActivationDryRun("alpha", {
      authority: authorityEvidence("alpha"),
      executor: executorEvidence("alpha", alpha.project, "alpha")
    }, options(roots));
    const missingExecutor = executeActivationDryRun("alpha", {
      authority: authorityEvidence("alpha"),
      approval: approvalEvidence("alpha", "alpha")
    }, options(roots));
    const dryRun = executeActivationDryRun("alpha", {
      authority: authorityEvidence("alpha"),
      approval: approvalEvidence("alpha", "alpha"),
      executor: executorEvidence("alpha", alpha.project, "alpha")
    }, options(roots));
    const isolatedDryRun = executeActivationDryRun("beta", {
      authority: authorityEvidence("beta"),
      approval: approvalEvidence("beta", "beta"),
      executor: executorEvidence("beta", beta.project, "beta")
    }, options(roots));

    assert.equal(missingApproval.result_state, "MISSING_APPROVAL");
    assert.equal(missingApproval.approval_evidence.state, "MISSING");
    assert.equal(missingApproval.execution_plan.state, "NOT_CREATED");
    assert.equal(missingExecutor.result_state, "MISSING_EXECUTOR");
    assert.equal(missingExecutor.execution_authority.state, "MISSING");
    assert.equal(missingExecutor.execution_plan.state, "NOT_CREATED");

    assert.equal(dryRun.result_state, "DRY_RUN_READY");
    assert.equal(dryRun.execution_plan.state, "CREATED");
    assert.equal(dryRun.execution_plan.steps.length, 4);
    assert.equal(dryRun.activation_result.state, "SIMULATED");
    assert.equal(dryRun.activation_result.activated, false);
    assert.equal(dryRun.safety.production_authorized, false);
    assert.equal(dryRun.safety.activation_executable, false);
    assert.equal(dryRun.safety.activation_executed, false);
    assert.ok(dryRun.execution_plan.steps.every((step) => step.mutation_allowed === false));

    assert.deepEqual(executeActivationDryRun("alpha", {
      authority: authorityEvidence("alpha"),
      approval: approvalEvidence("alpha", "alpha"),
      executor: executorEvidence("alpha", alpha.project, "alpha")
    }, options(roots)), dryRun, "Phase I dry-run result must be deterministic");
    assert.deepEqual(inventory(fixture), before, "Phase I fixture execution boundary must be read-only");
    assert.ok(Object.isFrozen(dryRun));
    assert.ok(Object.isFrozen(dryRun.execution_plan.steps));

    assert.equal(dryRun.project_slug, "alpha");
    assert.equal(isolatedDryRun.project_slug, "beta");
    assert.notEqual(dryRun.execution_authority.project_id, isolatedDryRun.execution_authority.project_id);
    const crossProject = JSON.parse(JSON.stringify(dryRun));
    crossProject.approval_evidence.project_slug = "beta";
    assert.throws(
      () => validateActivationExecutorResult(crossProject),
      (error) => error instanceof ActivationExecutorContractError
    );
    const executable = JSON.parse(JSON.stringify(dryRun));
    executable.safety.activation_executable = true;
    assert.throws(
      () => validateActivationExecutorResult(executable),
      (error) => error instanceof ActivationExecutorContractError
    );
    const mutatingPlan = JSON.parse(JSON.stringify(dryRun));
    mutatingPlan.execution_plan.steps[3].mutation_allowed = true;
    assert.throws(
      () => validateActivationExecutorResult(mutatingPlan),
      (error) => error instanceof ActivationExecutorContractError
    );

    const implementation = [
      "activation-executor-contract.js",
      "activation-executor-boundary.js"
    ].map((name) => fs.readFileSync(path.join(RUNTIME_ROOT, "projects", name), "utf8")).join("\n");
    const boundary = fs.readFileSync(
      path.join(RUNTIME_ROOT, "projects", "activation-executor-boundary.js"),
      "utf8"
    );
    assert.match(boundary, /assessActivationAuthority/, "Phase I must compose Phase H");
    assert.doesNotMatch(
      boundary,
      /require\(["']\.\/(?:production-activation-workflow|onboarding-orchestration|bootstrap-authority-assessment|project-activation-assessment|project-lifecycle-readiness|workspace-project-identity-binding|universal-project-contract)["']\)/,
      "Phase I must not duplicate Phase A-G runtime"
    );
    [
      /createWorkspace\s*\(/,
      /createProject\s*\(/,
      /generateProjectId/,
      /ensureProjectIdentityForAttach/,
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
      assert.equal(forbidden.test(implementation), false, `Phase I contains forbidden mutation path: ${forbidden}`);
    });

    const liveData = path.join(REPOSITORY_ROOT, "data");
    const liveBefore = inventory(liveData);
    const hairoticmen = executeActivationDryRun("hairoticmen", {
      authority: {
        requester: {
          requester_id: "principal_operator",
          requester_type: "service",
          evidence_ref: "request-context:hairoticmen"
        }
      }
    }, {
      projectsRoot: path.join(liveData, "projects"),
      workspaceRoot: path.join(liveData, "workspaces"),
      registryPath: path.join(liveData, "projects", "registry.json"),
      runtimeRoot: RUNTIME_ROOT
    });
    assert.equal(hairoticmen.result_state, "BLOCKED_ACTIVATION");
    assert.equal(hairoticmen.source_evidence.authority_model.source_evidence.workflow.readiness.state, "BLOCKED");
    assert.deepEqual(
      hairoticmen.source_evidence.authority_model.source_evidence.workflow.required_authority.owners,
      ["project-identity"]
    );
    assert.equal(hairoticmen.approval_evidence.state, "NOT_APPLICABLE");
    assert.equal(hairoticmen.execution_authority.state, "NOT_APPLICABLE");
    assert.equal(hairoticmen.execution_plan.state, "NOT_CREATED");
    assert.equal(hairoticmen.activation_result.activated, false);
    assert.deepEqual(inventory(liveData), liveBefore, "HairoticMen data must remain unchanged");

    console.log(JSON.stringify({
      ok: true,
      scenarios: {
        hairoticmen_blocked: hairoticmen.result_state,
        missing_approval: missingApproval.result_state,
        missing_executor: missingExecutor.result_state,
        fully_specified_dry_run: dryRun.result_state
      },
      activation_executed: false,
      workspace_mutated: false,
      project_mutated: false,
      identity_generated: false,
      binding_mutated: false,
      registry_mutated: false,
      deterministic: true,
      multi_project_isolation: true,
      runtime_filesystem_writes: false
    }, null, 2));
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
}

run();

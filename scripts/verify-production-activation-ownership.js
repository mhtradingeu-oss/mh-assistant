#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const {
  ProductionActivationOwnershipContractError,
  validateProductionActivationOwnership
} = require("../runtime/orchestrator-service/lib/projects/production-activation-ownership-contract");
const {
  assessProductionActivationOwnership
} = require("../runtime/orchestrator-service/lib/projects/production-activation-ownership-model");

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

function evidence(slug, projectId, suffix) {
  return {
    authority: {
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
    },
    approval: {
      approval_id: `approval_${suffix}`,
      decision: "APPROVED",
      project_slug: slug,
      action: "ACTIVATE_PROJECT",
      policy_version: "activation-policy-v1",
      decided_by: `governance_reviewer_${suffix}`,
      decided_at: TS,
      source_owner: "operations-backbone",
      evidence_ref: `operations-backbone:approval:${suffix}`
    },
    executor: {
      executor_id: "workspace-runtime",
      project_slug: slug,
      project_id: projectId,
      action: "ACTIVATE_PROJECT",
      mode: "DRY_RUN",
      source_owner: "workspace-runtime",
      evidence_ref: `workspace-runtime:dry-run:${suffix}`
    },
    audit_owner: {
      owner: "operations-backbone",
      project_slug: slug,
      evidence_ref: `operations-backbone:audit-custody:${suffix}`
    }
  };
}

function run() {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "mh-phase-j-activation-ownership-"));
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

    const alphaEvidence = evidence("alpha", alpha.project, "alpha");
    const betaEvidence = evidence("beta", beta.project, "beta");
    const before = inventory(fixture);

    const missingRequesterEvidence = JSON.parse(JSON.stringify(alphaEvidence));
    delete missingRequesterEvidence.authority.requester;
    const missingRequester = assessProductionActivationOwnership("alpha", missingRequesterEvidence, options(roots));

    const missingApproverEvidence = JSON.parse(JSON.stringify(alphaEvidence));
    delete missingApproverEvidence.approval;
    const missingApprover = assessProductionActivationOwnership("alpha", missingApproverEvidence, options(roots));

    const missingExecutorEvidence = JSON.parse(JSON.stringify(alphaEvidence));
    delete missingExecutorEvidence.executor;
    const missingExecutor = assessProductionActivationOwnership("alpha", missingExecutorEvidence, options(roots));

    const missingOwnerEvidence = JSON.parse(JSON.stringify(alphaEvidence));
    delete missingOwnerEvidence.audit_owner;
    const missingOwner = assessProductionActivationOwnership("alpha", missingOwnerEvidence, options(roots));

    const accepted = assessProductionActivationOwnership("alpha", alphaEvidence, options(roots));
    const isolated = assessProductionActivationOwnership("beta", betaEvidence, options(roots));

    assert.equal(missingRequester.ownership_state, "MISSING_REQUESTER");
    assert.equal(missingRequester.requester.state, "MISSING");
    assert.equal(missingApprover.ownership_state, "MISSING_ACTIVATION_APPROVER");
    assert.equal(missingApprover.activation_approver.state, "MISSING");
    assert.equal(missingExecutor.ownership_state, "MISSING_EXECUTION_OWNER");
    assert.equal(missingExecutor.execution_owner.state, "MISSING");
    assert.equal(missingOwner.ownership_state, "MISSING_AUDIT_OWNER");
    assert.equal(missingOwner.audit_owner.state, "MISSING");

    assert.equal(accepted.ownership_state, "OWNERSHIP_CHAIN_ACCEPTED");
    assert.equal(accepted.requester.state, "PRESENT");
    assert.equal(accepted.activation_approver.state, "PRESENT");
    assert.equal(accepted.execution_owner.owner, "workspace-runtime");
    assert.equal(accepted.audit_owner.owner, "operations-backbone");
    assert.equal(accepted.audit_owner.project_slug, "alpha");
    assert.equal(accepted.safety.ownership_chain_accepted, true);
    assert.equal(accepted.safety.production_authorized, false);
    assert.equal(accepted.safety.activation_executable, false);
    assert.equal(accepted.safety.activation_executed, false);
    assert.equal(accepted.safety.approval_created, false);

    assert.deepEqual(
      assessProductionActivationOwnership("alpha", alphaEvidence, options(roots)),
      accepted,
      "Phase J output must be deterministic"
    );
    assert.deepEqual(inventory(fixture), before, "Phase J fixture assessment must be read-only");
    assert.ok(Object.isFrozen(accepted));
    assert.ok(Object.isFrozen(accepted.source_evidence.executor_boundary));

    assert.equal(accepted.project_slug, "alpha");
    assert.equal(isolated.project_slug, "beta");
    assert.notEqual(accepted.execution_owner.project_id, isolated.execution_owner.project_id);

    const crossProject = JSON.parse(JSON.stringify(accepted));
    crossProject.source_evidence.executor_boundary = isolated.source_evidence.executor_boundary;
    assert.throws(
      () => validateProductionActivationOwnership(crossProject),
      (error) => error instanceof ProductionActivationOwnershipContractError
    );
    const inventedAcceptance = JSON.parse(JSON.stringify(missingOwner));
    inventedAcceptance.ownership_state = "OWNERSHIP_CHAIN_ACCEPTED";
    assert.throws(
      () => validateProductionActivationOwnership(inventedAcceptance),
      (error) => error instanceof ProductionActivationOwnershipContractError
    );
    const crossProjectAuditOwner = JSON.parse(JSON.stringify(alphaEvidence));
    crossProjectAuditOwner.audit_owner.project_slug = "beta";
    assert.equal(
      assessProductionActivationOwnership("alpha", crossProjectAuditOwner, options(roots)).ownership_state,
      "MISSING_AUDIT_OWNER"
    );
    const executable = JSON.parse(JSON.stringify(accepted));
    executable.safety.activation_executable = true;
    assert.throws(
      () => validateProductionActivationOwnership(executable),
      (error) => error instanceof ProductionActivationOwnershipContractError
    );

    const implementation = [
      "production-activation-ownership-contract.js",
      "production-activation-ownership-model.js"
    ].map((name) => fs.readFileSync(path.join(RUNTIME_ROOT, "projects", name), "utf8")).join("\n");
    assert.match(implementation, /executeActivationDryRun/, "Phase J must compose Phase I");
    assert.doesNotMatch(
      implementation,
      /require\(["']\.\/(?:activation-authority-model|production-activation-workflow|onboarding-orchestration|project-activation-assessment|project-lifecycle-readiness|workspace-project-identity-binding|universal-project-contract)["']\)/,
      "Phase J must not duplicate Phases A-H"
    );
    [
      /createApproval\s*\(/,
      /decideApproval\s*\(/,
      /createWorkspace\s*\(/,
      /createProject\s*\(/,
      /generateProjectId/,
      /ensureProjectIdentityForAttach/,
      /attachProject/,
      /writeProjectWorkspaceProjection/,
      /mutateRole/,
      /setPermission/,
      /writeFileSync/,
      /appendFileSync/,
      /renameSync/,
      /unlinkSync/,
      /mkdirSync/,
      /rmSync/
    ].forEach((forbidden) => {
      assert.equal(forbidden.test(implementation), false, `Phase J contains forbidden mutation path: ${forbidden}`);
    });

    const liveData = path.join(REPOSITORY_ROOT, "data");
    const liveBefore = inventory(liveData);
    const hairoticmen = assessProductionActivationOwnership("hairoticmen", {
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
    assert.equal(hairoticmen.ownership_state, "BLOCKED_ACTIVATION");
    assert.equal(hairoticmen.source_evidence.executor_boundary.result_state, "BLOCKED_ACTIVATION");
    assert.deepEqual(
      hairoticmen.source_evidence.executor_boundary.source_evidence.authority_model
        .source_evidence.workflow.required_authority.owners,
      ["project-identity"]
    );
    assert.equal(hairoticmen.requester.state, "NOT_APPLICABLE");
    assert.equal(hairoticmen.activation_approver.state, "NOT_APPLICABLE");
    assert.equal(hairoticmen.execution_owner.state, "NOT_APPLICABLE");
    assert.equal(hairoticmen.audit_owner.state, "NOT_APPLICABLE");
    assert.equal(hairoticmen.safety.activation_executed, false);
    assert.deepEqual(inventory(liveData), liveBefore, "HairoticMen data must remain unchanged");

    console.log(JSON.stringify({
      ok: true,
      scenarios: {
        hairoticmen: hairoticmen.ownership_state,
        missing_requester: missingRequester.ownership_state,
        missing_owner: missingOwner.ownership_state,
        missing_approver: missingApprover.ownership_state,
        missing_executor: missingExecutor.ownership_state,
        complete_ownership_chain: accepted.ownership_state
      },
      activation_executed: false,
      workspace_created: false,
      project_created: false,
      identity_generated: false,
      permissions_mutated: false,
      roles_mutated: false,
      approval_created: false,
      deterministic: true,
      multi_project_isolation: true,
      runtime_filesystem_writes: false
    }, null, 2));
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
}

run();

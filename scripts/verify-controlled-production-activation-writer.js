#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const projectIdentity = require("../runtime/orchestrator-service/lib/projects/project-identity");
const workspaceStorage = require("../runtime/orchestrator-service/lib/workspace/workspace-storage");
const {
  prepareControlledProductionActivation,
  executeControlledProductionActivation
} = require("../runtime/orchestrator-service/lib/projects/controlled-production-activation-writer-boundary");

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
  writeJson(path.join(roots.projects, slug, "integrations", "audit-log.json"), []);
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

function ownershipEvidence(slug, projectId, suffix) {
  return {
    authority: {
      requester: { requester_id: `principal_${suffix}`, requester_type: "service", evidence_ref: `request:${suffix}` },
      approval_owner: { owner: "operations-backbone", evidence_ref: `approval-owner:${suffix}` },
      execution_owner: { owner: "workspace-runtime", evidence_ref: `execution-owner:${suffix}` }
    },
    approval: {
      approval_id: `approval_${suffix}`,
      decision: "APPROVED",
      project_slug: slug,
      action: "ACTIVATE_PROJECT",
      policy_version: "activation-policy-v1",
      decided_by: `reviewer_${suffix}`,
      decided_at: TS,
      source_owner: "operations-backbone",
      evidence_ref: `approval:${suffix}`
    },
    executor: {
      executor_id: "workspace-runtime",
      project_slug: slug,
      project_id: projectId,
      action: "ACTIVATE_PROJECT",
      mode: "DRY_RUN",
      source_owner: "workspace-runtime",
      evidence_ref: `executor:${suffix}`
    },
    audit_owner: { owner: "operations-backbone", project_slug: slug, evidence_ref: `audit:${suffix}` }
  };
}

async function run() {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "mh-phase-k1-writer-"));
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

    const alphaEvidence = ownershipEvidence("alpha", alpha.project, "alpha");
    const initial = inventory(fixture);
    const dryRun = await prepareControlledProductionActivation("alpha", alphaEvidence, options(roots));
    const repeatDryRun = await prepareControlledProductionActivation("alpha", alphaEvidence, options(roots));
    assert.equal(dryRun.result_state, "DRY_RUN_READY");
    assert.deepEqual(repeatDryRun, dryRun, "dry-run output must be deterministic");
    assert.deepEqual(inventory(fixture), initial, "dry run must not write");
    assert.equal(dryRun.before.audit_event_present, false);
    assert.deepEqual(dryRun.before, dryRun.after);

    const changedPlan = JSON.parse(JSON.stringify(dryRun.plan));
    changedPlan.workspace_version += 1;
    await assert.rejects(
      executeControlledProductionActivation("alpha", alphaEvidence, changedPlan, options(roots)),
      /does not match/
    );
    assert.deepEqual(inventory(fixture), initial, "rejected plan must not write");

    const betaBefore = inventory(path.join(roots.projects, "beta"));
    const workspaceBefore = inventory(roots.workspaces);
    const registryBefore = fs.readFileSync(roots.registry);
    const projectBefore = fs.readFileSync(path.join(roots.projects, "alpha", "project.json"));
    const applied = await executeControlledProductionActivation("alpha", alphaEvidence, dryRun.plan, options(roots));
    assert.equal(applied.result_state, "APPLIED");
    assert.equal(applied.before.audit_event_present, false);
    assert.equal(applied.after.audit_event_present, true);
    assert.equal(applied.mutation.owner, "existing-audit-event-system");
    assert.deepEqual(inventory(path.join(roots.projects, "beta")), betaBefore, "unrelated Project changed");
    assert.deepEqual(inventory(roots.workspaces), workspaceBefore, "Workspace authority data changed");
    assert.deepEqual(fs.readFileSync(roots.registry), registryBefore, "registry changed");
    assert.deepEqual(fs.readFileSync(path.join(roots.projects, "alpha", "project.json")), projectBefore, "Project record changed");

    const replay = await executeControlledProductionActivation("alpha", alphaEvidence, dryRun.plan, options(roots));
    assert.equal(replay.result_state, "ALREADY_APPLIED");
    assert.equal(replay.mutation.event_created, false);
    const auditEntries = JSON.parse(fs.readFileSync(path.join(roots.projects, "alpha", "integrations", "audit-log.json"), "utf8"));
    assert.equal(auditEntries.filter((entry) => entry.id === dryRun.plan.event_id).length, 1, "activation event duplicated");

    const identities = projectIdentity.listProjectIdentities({ projectsRoot: roots.projects });
    assert.equal(new Set(identities.map((item) => item.project_id)).size, identities.length, "duplicate project identity");
    const workspaces = workspaceStorage.discoverWorkspacesWithDiagnostics(roots.workspaces).workspaces;
    assert.equal(new Set(workspaces.map((item) => item.workspace_id)).size, workspaces.length, "duplicate Workspace identity");

    const rollbackFixtureBefore = inventory(fixture);
    const failingOptions = {
      ...options(roots),
      audit: {
        readIntegrationAudit: () => [],
        appendIntegrationAuditOnce: () => { throw new Error("simulated audit failure"); }
      }
    };
    await assert.rejects(
      executeControlledProductionActivation("beta", ownershipEvidence("beta", beta.project, "beta"),
        (await prepareControlledProductionActivation("beta", ownershipEvidence("beta", beta.project, "beta"), failingOptions)).plan,
        failingOptions),
      /simulated audit failure/
    );
    assert.deepEqual(inventory(fixture), rollbackFixtureBefore, "failed audit append caused a partial write");

    const implementation = fs.readFileSync(path.join(RUNTIME_ROOT, "projects", "controlled-production-activation-writer-boundary.js"), "utf8");
    [/createWorkspace\s*\(/, /ensureProjectIdentityForAttach\s*\(/, /writeWorkspace\s*\(/, /writeFileSync\s*\(/, /appendJsonArrayEntry\s*\(/, /registry\.json/].forEach((pattern) => {
      assert.equal(pattern.test(implementation), false, `writer bypasses an authority: ${pattern}`);
    });

    const liveData = path.join(REPOSITORY_ROOT, "data");
    const liveBefore = inventory(liveData);
    const hairoticmen = await prepareControlledProductionActivation("hairoticmen", {
      authority: { requester: { requester_id: "principal_operator", requester_type: "service", evidence_ref: "request:hairoticmen" } }
    }, {
      projectsRoot: path.join(liveData, "projects"),
      workspaceRoot: path.join(liveData, "workspaces"),
      registryPath: path.join(liveData, "projects", "registry.json"),
      runtimeRoot: RUNTIME_ROOT
    });
    assert.equal(hairoticmen.result_state, "BLOCKED");
    assert.deepEqual(inventory(liveData), liveBefore, "HairoticMen data changed");

    console.log(JSON.stringify({
      ok: true,
      dry_run: dryRun.result_state,
      apply: applied.result_state,
      replay: replay.result_state,
      before_after_evidence: true,
      no_duplicate_identity: true,
      no_duplicate_workspace: true,
      no_data_migration: true,
      no_unrelated_writes: true,
      deterministic_output: true,
      rollback_safe: true,
      hairoticmen: hairoticmen.result_state
    }, null, 2));
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

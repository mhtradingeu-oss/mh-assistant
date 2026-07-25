#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const {
  OnboardingOrchestrationContractError,
  validateOnboardingOrchestration
} = require("../runtime/orchestrator-service/lib/projects/onboarding-orchestration-contract");
const {
  orchestrateOnboarding
} = require("../runtime/orchestrator-service/lib/projects/onboarding-orchestration");

const REPOSITORY_ROOT = path.resolve(__dirname, "..");
const RUNTIME_ROOT = path.join(REPOSITORY_ROOT, "runtime/orchestrator-service/lib");
const TS = "2026-01-01T00:00:00.000Z";
const id = (prefix, character) => `${prefix}_${character.repeat(32)}`;

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function createProjectFixture(projectsRoot, slug, projectId, workspaceId, relationshipId) {
  const record = {
    project_name: slug,
    project_type: "service",
    market: "Germany",
    language: "de"
  };
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

function orchestrate(slug, roots) {
  return orchestrateOnboarding(slug, {
    projectsRoot: roots.projects,
    workspaceRoot: roots.workspaces,
    registryPath: roots.registry,
    runtimeRoot: RUNTIME_ROOT
  });
}

function run() {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "mh-phase-f-onboarding-"));
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
    const newRequest = orchestrate("requested", roots);
    const missingIdentity = orchestrate("legacy", roots);
    const ready = orchestrate("alpha", roots);
    const blocked = orchestrate("beta", roots);

    assert.equal(newRequest.current_state.scenario, "NEW_PROJECT_REQUEST");
    assert.equal(newRequest.current_state.project_exists, false);
    assert.equal(newRequest.required_next_step.state, "USE_EXISTING_LIFECYCLES");
    assert.deepEqual(newRequest.authority_owner.responsible_authorities, [
      "project-identity", "workspace-relationship-runtime", "workspace-runtime"
    ]);
    assert.equal(newRequest.activation_outcome.state, "NOT_ASSESSABLE");

    assert.equal(missingIdentity.current_state.scenario, "EXISTING_PROJECT_WITHOUT_IDENTITY");
    assert.equal(missingIdentity.current_state.project_exists, true);
    assert.equal(missingIdentity.current_state.project_id, null);
    assert.equal(missingIdentity.required_next_step.state, "ESTABLISH_PROJECT_IDENTITY");
    assert.deepEqual(missingIdentity.authority_owner.responsible_authorities, ["project-identity"]);
    assert.equal(missingIdentity.activation_outcome.state, "BLOCKED");

    assert.equal(ready.current_state.scenario, "READY_PROJECT");
    assert.equal(ready.current_state.project_id, alpha.project);
    assert.equal(ready.required_next_step.state, "NONE");
    assert.equal(ready.required_next_step.required, false);
    assert.deepEqual(ready.authority_owner.responsible_authorities, []);
    assert.equal(ready.activation_outcome.state, "READY_FOR_ACTIVATION");
    assert.equal(ready.activation_outcome.ready, true);

    assert.equal(blocked.current_state.scenario, "EXISTING_PROJECT_NOT_READY");
    assert.equal(blocked.current_state.project_id, beta.project);
    assert.equal(blocked.required_next_step.state, "RESOLVE_ACTIVATION_PREREQUISITES");
    assert.deepEqual(blocked.authority_owner.responsible_authorities, ["project-activation-assessment"]);
    assert.equal(blocked.activation_outcome.state, "BLOCKED");
    assert.equal(blocked.activation_outcome.ready, false);
    assert.ok(blocked.activation_outcome.blockers.length > 0);

    for (const [slug, first] of [
      ["requested", newRequest], ["legacy", missingIdentity], ["alpha", ready], ["beta", blocked]
    ]) {
      assert.deepEqual(orchestrate(slug, roots), first, `${slug} orchestration must be deterministic`);
    }
    assert.deepEqual(inventory(fixture), before, "all onboarding scenarios must be read-only");
    assert.ok(Object.isFrozen(ready));
    assert.ok(Object.isFrozen(ready.current_state.assessment));

    assert.deepEqual(
      [newRequest, missingIdentity, ready, blocked].map((item) => item.user_intent.project_slug),
      ["requested", "legacy", "alpha", "beta"]
    );
    assert.notEqual(ready.current_state.project_id, blocked.current_state.project_id);
    assert.equal(ready.current_state.assessment.project.project_slug, "alpha");
    assert.equal(blocked.current_state.assessment.project.project_slug, "beta");

    const invalidAuthority = JSON.parse(JSON.stringify(ready));
    invalidAuthority.authority.creates_identity = true;
    assert.throws(
      () => validateOnboardingOrchestration(invalidAuthority),
      (error) => error instanceof OnboardingOrchestrationContractError
    );
    const contradictoryOutcome = JSON.parse(JSON.stringify(ready));
    contradictoryOutcome.activation_outcome.state = "BLOCKED";
    assert.throws(
      () => validateOnboardingOrchestration(contradictoryOutcome),
      (error) => error instanceof OnboardingOrchestrationContractError
    );
    const crossProjectEvidence = JSON.parse(JSON.stringify(ready));
    crossProjectEvidence.current_state.assessment = blocked.current_state.assessment;
    assert.throws(
      () => validateOnboardingOrchestration(crossProjectEvidence),
      (error) => error instanceof OnboardingOrchestrationContractError
    );

    const implementation = [
      "onboarding-orchestration-contract.js",
      "onboarding-orchestration.js"
    ].map((name) => fs.readFileSync(path.join(RUNTIME_ROOT, "projects", name), "utf8")).join("\n");
    const mapper = fs.readFileSync(
      path.join(RUNTIME_ROOT, "projects", "onboarding-orchestration.js"),
      "utf8"
    );
    assert.match(mapper, /assessBootstrapAuthority/, "Phase F must compose Phase E");
    assert.doesNotMatch(
      mapper,
      /require\(["']\.\/(?:project-activation-assessment|project-lifecycle-readiness|workspace-project-identity-binding|universal-project-contract)["']\)/,
      "Phase F must not duplicate Phase A-D inspection"
    );
    [
      /generateProjectId/,
      /generateWorkspaceId/,
      /ensureProjectIdentityForAttach/,
      /createWorkspace\s*\(/,
      /createProject\s*\(/,
      /attachProject/,
      /writeProjectWorkspaceProjection/,
      /writeFileSync/,
      /appendFileSync/,
      /renameSync/,
      /unlinkSync/,
      /mkdirSync/,
      /rmSync/
    ].forEach((forbidden) => {
      assert.equal(forbidden.test(implementation), false, `Phase F contains forbidden mutation path: ${forbidden}`);
    });

    const liveData = path.join(REPOSITORY_ROOT, "data");
    const liveBefore = inventory(liveData);
    const hairoticmen = orchestrateOnboarding("hairoticmen", {
      projectsRoot: path.join(liveData, "projects"),
      workspaceRoot: path.join(liveData, "workspaces"),
      registryPath: path.join(liveData, "projects", "registry.json"),
      runtimeRoot: RUNTIME_ROOT
    });
    assert.equal(hairoticmen.user_intent.project_slug, "hairoticmen");
    assert.deepEqual(inventory(liveData), liveBefore, "live Project data must remain unchanged");

    console.log(JSON.stringify({
      ok: true,
      scenarios: {
        new_project_request: newRequest.required_next_step,
        existing_project_without_identity: missingIdentity.required_next_step,
        ready_project: ready.activation_outcome,
        blocked_project: blocked.activation_outcome
      },
      deterministic: true,
      multi_project_isolation: true,
      mutation_free: true,
      live_project: {
        project_slug: hairoticmen.user_intent.project_slug,
        scenario: hairoticmen.current_state.scenario,
        next_step: hairoticmen.required_next_step.state,
        activation_outcome: hairoticmen.activation_outcome.state
      },
      authority: ready.authority
    }, null, 2));
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
}

run();

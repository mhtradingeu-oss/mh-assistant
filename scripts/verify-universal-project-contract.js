#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const {
  READINESS_STATES,
  OWNER_MAP,
  inspectUniversalProjectContract
} = require("../runtime/orchestrator-service/lib/projects/universal-project-contract");

const REPOSITORY_ROOT = path.resolve(__dirname, "..");
const PROJECTS_ROOT = path.join(REPOSITORY_ROOT, "data/projects");
const RUNTIME_ROOT = path.join(REPOSITORY_ROOT, "runtime/orchestrator-service/lib");
const EXPECTED_DOMAINS = [
  "identity_scope", "offerings", "assets", "knowledge_memory", "ai_team",
  "relationships", "operations", "growth", "commerce", "integrations",
  "intelligence", "governance", "runtime", "readiness", "learning"
];

function fileInventory(root) {
  const inventory = [];
  function visit(current) {
    if (!fs.existsSync(current)) return;
    for (const entry of fs.readdirSync(current, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const target = path.join(current, entry.name);
      if (entry.isDirectory()) visit(target);
      else {
        const stat = fs.statSync(target);
        inventory.push(`${path.relative(root, target)}:${stat.size}:${stat.mtimeMs}`);
      }
    }
  }
  visit(root);
  return inventory;
}

function domainMap(result) {
  return Object.fromEntries(result.domains.map((domain) => [domain.id, domain]));
}

function run() {
  const hairotic = inspectUniversalProjectContract("hairoticmen", {
    projectsRoot: PROJECTS_ROOT,
    runtimeRoot: RUNTIME_ROOT
  });

  assert.deepEqual(hairotic.domains.map((domain) => domain.id), EXPECTED_DOMAINS);
  assert.equal(hairotic.summary.total, 15);
  assert.equal(hairotic.authoritative, false);
  assert.equal(hairotic.creates_runtime, false);
  assert.deepEqual([...hairotic.statuses], [...READINESS_STATES]);
  assert.ok(hairotic.domains.every((domain) => domain.owner.available), "all existing domain owners must be detected");
  assert.ok(hairotic.domains.some((domain) => domain.status === "READY"), "HairoticMen must expose ready domains");
  assert.ok(hairotic.domains.some((domain) => domain.status === "PARTIAL"), "HairoticMen must expose partial domains");
  assert.ok(hairotic.domains.some((domain) => domain.status === "MISSING"), "HairoticMen must expose missing domains");

  for (const domain of hairotic.domains) {
    assert.equal(domain.owner.authority, OWNER_MAP[domain.id].authority);
    assert.equal(domain.owner.mutation_owner, OWNER_MAP[domain.id].mutation_owner);
    assert.equal(domain.owner.preserved, true);
  }

  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mh-universal-contract-"));
  const fixtureProjects = path.join(fixtureRoot, "projects");
  const fixtureProject = path.join(fixtureProjects, "blank-project");
  const missingRuntime = path.join(fixtureRoot, "runtime");
  fs.mkdirSync(fixtureProject, { recursive: true });
  fs.mkdirSync(missingRuntime);
  try {
    const before = fileInventory(fixtureRoot);
    const missing = inspectUniversalProjectContract("blank-project", {
      projectsRoot: fixtureProjects,
      runtimeRoot: RUNTIME_ROOT
    });
    const after = fileInventory(fixtureRoot);
    assert.deepEqual(after, before, "inspection must not create or mutate runtime/project files");
    assert.ok(missing.domains.every((domain) => domain.status === "MISSING"));
    assert.ok(missing.domains.every((domain) => domain.gaps.length > 0));

    const unavailableOwners = inspectUniversalProjectContract("hairoticmen", {
      projectsRoot: PROJECTS_ROOT,
      runtimeRoot: missingRuntime
    });
    assert.ok(unavailableOwners.domains.every((domain) => !domain.owner.available));
    assert.ok(unavailableOwners.domains.every((domain) => domain.gaps.some((gap) => gap.startsWith("Runtime owner source is unavailable:"))));

    fs.writeFileSync(path.join(fixtureProject, "project.json"), JSON.stringify({
      project_name: "Blank Project",
      project_type: "service",
      market: "Germany",
      language: "de"
    }));
    const partial = inspectUniversalProjectContract("blank-project", {
      projectsRoot: fixtureProjects,
      runtimeRoot: RUNTIME_ROOT
    });
    assert.equal(domainMap(partial).identity_scope.status, "PARTIAL");
    assert.match(domainMap(partial).identity_scope.gaps.join(" "), /Project ID/);
  } finally {
    fs.rmSync(fixtureRoot, { recursive: true, force: true });
  }

  const exported = Object.keys(require("../runtime/orchestrator-service/lib/projects/universal-project-contract"));
  assert.deepEqual(exported, [
    "UNIVERSAL_PROJECT_CONTRACT_SCHEMA_VERSION",
    "READINESS_STATES",
    "OWNER_MAP",
    "inspectUniversalProjectContract"
  ]);

  console.log(JSON.stringify({
    ok: true,
    project: hairotic.project,
    summary: hairotic.summary,
    domains: hairotic.domains.map(({ id, status, gaps }) => ({ id, status, gaps }))
  }, null, 2));
}

run();

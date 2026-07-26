#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  inspectProjectLifecycleReadiness
} = require("../runtime/orchestrator-service/lib/projects/project-lifecycle-readiness");

const RUNTIME_ROOT = path.resolve(
  __dirname,
  "../runtime/orchestrator-service/lib"
);

function inventory(root) {
  const result = [];

  function visit(current) {
    if (!fs.existsSync(current)) {
      return;
    }

    const entries = fs.readdirSync(
      current,
      {
        withFileTypes: true
      }
    ).sort(
      (left, right) => left.name.localeCompare(right.name)
    );

    for (const entry of entries) {
      const target = path.join(current, entry.name);

      if (entry.isDirectory()) {
        visit(target);
      } else {
        result.push(
          `${path.relative(root, target)}:`
          + fs.readFileSync(target, "utf8")
        );
      }
    }
  }

  visit(root);

  return result;
}

function run() {
  const liveRoot = path.resolve(
    __dirname,
    "../data"
  );

  const liveProjectFile = path.join(
    liveRoot,
    "projects",
    "hairoticmen",
    "project.json"
  );

  const liveRegistryFile = path.join(
    liveRoot,
    "projects",
    "registry.json"
  );

  const liveWorkspaceRoot = path.join(
    liveRoot,
    "workspaces"
  );

  const liveBefore = {
    project: fs.readFileSync(
      liveProjectFile,
      "utf8"
    ),
    registry: fs.readFileSync(
      liveRegistryFile,
      "utf8"
    ),
    workspaces: inventory(
      liveWorkspaceRoot
    )
  };

  const hairoticmen = inspectProjectLifecycleReadiness(
    "hairoticmen",
    {
      projectsRoot: path.join(
        liveRoot,
        "projects"
      ),
      workspaceRoot: liveWorkspaceRoot,
      registryPath: liveRegistryFile,
      runtimeRoot: RUNTIME_ROOT
    }
  );

  assert.equal(
    hairoticmen.readiness.state,
    "MISSING_PROJECT_IDENTITY"
  );

  assert.equal(
    hairoticmen.readiness.ready,
    false
  );

  assert.equal(
    hairoticmen.lifecycle[3].state,
    "REGISTERED"
  );

  const liveAfter = {
    project: fs.readFileSync(
      liveProjectFile,
      "utf8"
    ),
    registry: fs.readFileSync(
      liveRegistryFile,
      "utf8"
    ),
    workspaces: inventory(
      liveWorkspaceRoot
    )
  };

  assert.deepEqual(
    liveAfter,
    liveBefore,
    "HairoticMen lifecycle observation must be read-only"
  );

  assert.equal(
    hairoticmen.authority.creates_identity,
    false
  );

  assert.equal(
    hairoticmen.authority.creates_workspace,
    false
  );

  assert.equal(
    hairoticmen.authority.registers_project,
    false
  );

  assert.equal(
    hairoticmen.authority.writes_projection,
    false
  );

  assert.equal(
    hairoticmen.authority.mutates_data,
    false
  );

  console.log(JSON.stringify({
    ok: true,
    project: "hairoticmen",
    readiness: hairoticmen.readiness,
    lifecycle: hairoticmen.lifecycle,
    authority: hairoticmen.authority,
    live_root_mutated: false
  }, null, 2));
}

run();

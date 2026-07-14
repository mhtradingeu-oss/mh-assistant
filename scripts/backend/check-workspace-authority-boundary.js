#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const CONTRACT_PATH = path.resolve(
  __dirname,
  "../../runtime/orchestrator-service/lib/workspace/workspace-contract.js"
);

function assertAbsent(source, pattern, label) {
  assert.equal(pattern.test(source), false, `${label} is outside the Workspace contract boundary`);
}

function run() {
  const source = fs.readFileSync(CONTRACT_PATH, "utf8");

  const checks = [
    [/(?:require|import)\s*\(?["'][^"']*(?:frontend|control-center|public\/)/i, "frontend import"],
    [/\b(?:express|router|app)\s*\.\s*(?:use|get|post|put|patch|delete|route)\s*\(/i, "server route registration"],
    [/(?:require|import)\s*\(?["'][^"']*membership/i, "membership model import"],
    [/\b(?:grant|assign|revoke)(?:Role|Permission|Access)|\b(?:roles?|permissions?)\s*:/i, "role or permission grant"],
    [/(?:require|import)\s*\(?["'][^"']*(?:runtime-security-enforcement|governance-mutation-gate|provider-execution-gate|protected-route)/i, "security gate replacement"],
    [/(?:require|import)\s*\(?["'](?:node:)?(?:fs|path)["']|(?:\/data\/|\\data\\|workspace\.json)/i, "storage path ownership"],
    [/\b(?:writeFile|writeFileSync|appendFile|appendFileSync|rename|renameSync|unlink|unlinkSync|mkdir|mkdirSync)\s*\(/, "file write"],
    [/(?:require|import)\s*\(?["'][^"']*(?:project-runtime|project-store|project-service)|\b(?:save|write|update|mutate)Project\s*\(/i, "Project Runtime mutation"],
    [/\bprovider(?:WorkspaceId|_workspace_id)|\btrustProviderWorkspace/i, "provider Workspace ID trust"]
  ];

  for (const [pattern, label] of checks) assertAbsent(source, pattern, label);

  assert.match(source, /const crypto = require\("node:crypto"\);/, "Only backend randomness should generate identifiers");
  assert.match(source, /function doesWorkspaceStatusGrantAuthorization\(\)\s*\{\s*return false;/, "Status must not grant access");
  assert.doesNotMatch(source, /MAX_ITEMS|\.slice\s*\(/, "Contract must not silently truncate collections");

  console.log(JSON.stringify({
    result: "pass",
    inspected: path.relative(process.cwd(), CONTRACT_PATH),
    checks: {
      frontendImports: "absent",
      routeRegistration: "absent",
      membershipModel: "absent",
      roleOrPermissionGrants: "absent",
      securityGateReplacement: "absent",
      storagePaths: "absent",
      fileWrites: "absent",
      projectRuntimeMutation: "absent",
      providerWorkspaceIdTrust: "absent",
      silentTruncation: "absent"
    }
  }, null, 2));
}

run();

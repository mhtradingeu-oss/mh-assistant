#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const {
  classifyPublicAliasAccess,
  buildPublicAliasHeaders
} = require("../../runtime/orchestrator-service/lib/security/public-alias-compatibility");

const root = process.cwd();
const input = path.join(root, "audits/backend/production-completion-plan/backend-p1c1-public-alias-gate/public-alias-retirement-plan.txt");
const outDir = path.join(root, "audits/backend/production-completion-plan/backend-p1c2-public-alias-helper");
const outJson = path.join(outDir, "public-alias-compatibility-check.json");
const outMd = path.join(outDir, "public-alias-compatibility-check.md");

function parseRouteLine(line) {
  const [routeLine] = line.split("|").map((part) => part.trim());
  const methodMatch = routeLine.match(/app\.(get|post|patch|put|delete)/i);
  const pathMatch = routeLine.match(/['"`](\/public\/[^'"`]+)['"`]/);
  return {
    method: methodMatch ? methodMatch[1].toUpperCase() : "UNKNOWN",
    route: pathMatch ? pathMatch[1] : routeLine
  };
}

fs.mkdirSync(outDir, { recursive: true });

const rows = fs.readFileSync(input, "utf8")
  .split("\n")
  .filter(Boolean)
  .map(parseRouteLine)
  .map((row) => {
    const classification = classifyPublicAliasAccess(row.method, row.route);
    return {
      ...row,
      ...classification,
      headers: buildPublicAliasHeaders(classification)
    };
  });

fs.writeFileSync(outJson, `${JSON.stringify(rows, null, 2)}\n`);

const md = [
  "# BACKEND-P1C.2 Public Alias Compatibility Helper Check",
  "",
  "| method | route | allowed | status | reason |",
  "|---|---|---:|---|---|",
  ...rows.map((row) => `| ${row.method} | ${row.route} | ${row.allowed ? "yes" : "no"} | ${row.status} | ${row.reason} |`)
].join("\n");

fs.writeFileSync(outMd, `${md}\n`);

const summary = {
  total: rows.length,
  allowed: rows.filter((row) => row.allowed).length,
  blocked: rows.filter((row) => !row.allowed).length,
  criticalCompatibility: rows.filter((row) => row.status === "compatibility_critical").length,
  writeCompatibility: rows.filter((row) => row.status === "compatibility_write").length,
  sensitiveReadCompatibility: rows.filter((row) => row.status === "compatibility_sensitive_read").length,
  readCompatibility: rows.filter((row) => row.status === "compatibility_read").length
};

console.log(JSON.stringify(summary, null, 2));

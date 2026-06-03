#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const {
  classifyProviderAction,
  buildProviderGateResponse
} = require("../../runtime/orchestrator-service/lib/security/provider-execution-gate");

const root = process.cwd();
const evidenceDir = path.join(root, "audits/backend/production-completion-plan/backend-p1d-provider-bridge-risk");
const outDir = path.join(root, "audits/backend/production-completion-plan/backend-p1d1-provider-execution-gate-catalog");
const routeMap = path.join(evidenceDir, "03-provider-route-map.txt");
const riskyMap = path.join(evidenceDir, "02-risky-execution-map.txt");

function readLines(file) {
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, "utf8").split("\n").filter(Boolean);
}

fs.mkdirSync(outDir, { recursive: true });

const routeRows = readLines(routeMap).map((line) => ({
  source: "route",
  line,
  classification: classifyProviderAction(line)
}));

const riskyRows = readLines(riskyMap).map((line) => ({
  source: "risk",
  line,
  classification: classifyProviderAction(line)
}));

const rows = [...routeRows, ...riskyRows];

fs.writeFileSync(
  path.join(outDir, "provider-execution-gate-check.json"),
  `${JSON.stringify(rows, null, 2)}\n`
);

const md = [
  "# BACKEND-P1D.1 Provider Execution Gate Catalog Check",
  "",
  "| source | provider | risk | execution | allowed | decision | scope | reason | line |",
  "|---|---|---|---:|---:|---|---|---|---|",
  ...rows.slice(0, 250).map((row) => {
    const c = row.classification;
    return `| ${row.source} | ${c.provider} | ${c.risk} | ${c.execution ? "yes" : "no"} | ${c.allowed ? "yes" : "no"} | ${c.decision} | ${c.requiredScope} | ${c.reason} | ${row.line.replace(/\|/g, "\\|")} |`;
  })
];

fs.writeFileSync(path.join(outDir, "provider-execution-gate-check.md"), `${md.join("\n")}\n`);

const summary = {
  totalRows: rows.length,
  providerRoutes: routeRows.length,
  riskyRows: riskyRows.length,
  executionRows: rows.filter((row) => row.classification.execution).length,
  allowedRows: rows.filter((row) => row.classification.allowed).length,
  gatedRows: rows.filter((row) => !row.classification.allowed).length,
  criticalRiskRows: rows.filter((row) => row.classification.risk === "critical").length,
  highRiskRows: rows.filter((row) => row.classification.risk === "high").length,
  sampleGateResponse: buildProviderGateResponse(classifyProviderAction("execute_email_package"))
};

console.log(JSON.stringify(summary, null, 2));

#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { classifyRoute } = require("../../runtime/orchestrator-service/lib/security/route-permission-catalog");

const root = process.cwd();
const serverPath = path.join(root, "runtime/orchestrator-service/server.js");
const outDir = path.join(root, "audits/backend/production-completion-plan/backend-p1b-permission-catalog");
const outJson = path.join(outDir, "route-permission-matrix.json");
const outMd = path.join(outDir, "route-permission-matrix.md");

function extractRoutes(source) {
  const rows = [];
  const routeRegex = /app\.(get|post|patch|put|delete)\(\s*["'`]([^"'`]+)["'`]/gi;
  let match;

  while ((match = routeRegex.exec(source))) {
    rows.push(classifyRoute(match[1], match[2]));
  }

  return rows.sort((a, b) => {
    const routeCompare = a.route.localeCompare(b.route);
    if (routeCompare !== 0) return routeCompare;
    return a.method.localeCompare(b.method);
  });
}

function toMarkdown(rows) {
  const header = [
    "# BACKEND-P1B Route Permission Matrix",
    "",
    "Generated from runtime/orchestrator-service/server.js.",
    "",
    "| method | route | domain | read/write | public alias | access | scope | status | data risk | provider risk | destructive risk | audit event | recommendation |",
    "|---|---|---|---|---:|---|---|---|---|---|---|---|---|"
  ];

  const body = rows.map((row) => [
    row.method,
    row.route,
    row.domain,
    row.readWrite,
    row.publicAlias ? "yes" : "no",
    row.requiredAccess,
    row.requiredScope,
    row.status,
    row.dataRisk,
    row.providerRisk,
    row.destructiveRisk,
    row.auditEvent,
    row.recommendation
  ].map(escapeCell).join(" | "));

  return `${header.join("\n")}\n${body.map((line) => `| ${line} |`).join("\n")}\n`;
}

function escapeCell(value) {
  return String(value ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
}

fs.mkdirSync(outDir, { recursive: true });

const source = fs.readFileSync(serverPath, "utf8");
const rows = extractRoutes(source);

fs.writeFileSync(outJson, `${JSON.stringify(rows, null, 2)}\n`);
fs.writeFileSync(outMd, toMarkdown(rows));

const summary = {
  totalRoutes: rows.length,
  mutations: rows.filter((row) => row.readWrite === "write").length,
  publicAliases: rows.filter((row) => row.publicAlias).length,
  publicMutationAliases: rows.filter((row) => row.publicAlias && row.readWrite === "write").length,
  retire: rows.filter((row) => row.status === "retire").length,
  deprecate: rows.filter((row) => row.status === "deprecate").length,
  criticalDataRisk: rows.filter((row) => row.dataRisk === "critical").length,
  criticalProviderRisk: rows.filter((row) => row.providerRisk === "critical").length,
  criticalDestructiveRisk: rows.filter((row) => row.destructiveRisk === "critical").length
};

console.log(JSON.stringify(summary, null, 2));

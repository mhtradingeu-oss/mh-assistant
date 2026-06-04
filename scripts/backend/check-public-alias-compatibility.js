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
const topLevelOutMd = path.join(root, "audits/backend/public-alias-compatibility-check.md");
const topLevelOutJson = path.join(root, "audits/backend/public-alias-compatibility-check.json");

function parseRouteLine(line) {
  const [routeLine] = line.split("|").map((part) => part.trim());
  const methodMatch = routeLine.match(/app\.(get|post|patch|put|delete)/i);
  const pathMatch = routeLine.match(/['"`](\/public\/[^'"`]+)['"`]/);
  return {
    method: methodMatch ? methodMatch[1].toUpperCase() : "UNKNOWN",
    route: pathMatch ? pathMatch[1] : routeLine
  };
}

function isReadMethod(method) {
  return String(method || "").toUpperCase() === "GET";
}

function deriveTruthStatus({ method, classification, context }) {
  if (!classification.allowed) {
    if (classification.reason === "public_alias_compatibility_disabled" || classification.code === "public_alias_retired") {
      return "retired_or_disabled";
    }
    return context === "unauthenticated" ? "blocked_without_authorization" : "retired_or_disabled";
  }

  if (isReadMethod(method)) {
    return "compatibility_read_allowed";
  }

  return "authorized_public_write_allowed";
}

fs.mkdirSync(outDir, { recursive: true });

const rows = fs.readFileSync(input, "utf8")
  .split("\n")
  .filter(Boolean)
  .map(parseRouteLine)
  .map((row) => {
    const unauthenticated = classifyPublicAliasAccess(row.method, row.route, {
      productionMode: true,
      hasAuthorizedWriteKey: false
    });
    const authorized = classifyPublicAliasAccess(row.method, row.route, {
      productionMode: true,
      hasAuthorizedWriteKey: true
    });

    const unauthenticatedTruthStatus = deriveTruthStatus({
      method: row.method,
      classification: unauthenticated,
      context: "unauthenticated"
    });

    const authorizedTruthStatus = deriveTruthStatus({
      method: row.method,
      classification: authorized,
      context: "authorized"
    });

    return {
      ...row,
      unauthenticatedTruthStatus,
      authorizedTruthStatus,
      unauthenticated,
      authorized,
      headers: buildPublicAliasHeaders(unauthenticated)
    };
  });

fs.writeFileSync(outJson, `${JSON.stringify(rows, null, 2)}\n`);
fs.writeFileSync(topLevelOutJson, `${JSON.stringify(rows, null, 2)}\n`);

const md = [
  "# BACKEND-P1C.2 Public Alias Compatibility Helper Check",
  "",
  "Context: `unauthenticated` assumes production mode with no write authorization.",
  "",
  "Truth status categories:",
  "- `compatibility_read_allowed`",
  "- `authorized_public_write_allowed`",
  "- `blocked_without_authorization`",
  "- `retired_or_disabled`",
  "",
  "| method | route | unauthenticated allowed | unauthenticated status | unauthenticated reason | unauthenticated truth | authorized allowed | authorized status | authorized truth |",
  "|---|---|---:|---|---|---|---:|---|---|",
  ...rows.map((row) => `| ${row.method} | ${row.route} | ${row.unauthenticated.allowed ? "yes" : "no"} | ${row.unauthenticated.status} | ${row.unauthenticated.reason} | ${row.unauthenticatedTruthStatus} | ${row.authorized.allowed ? "yes" : "no"} | ${row.authorized.status} | ${row.authorizedTruthStatus} |`)
].join("\n");

fs.writeFileSync(outMd, `${md}\n`);
fs.writeFileSync(topLevelOutMd, `${md}\n`);

const summary = {
  total: rows.length,
  unauthenticatedAllowed: rows.filter((row) => row.unauthenticated.allowed).length,
  unauthenticatedBlocked: rows.filter((row) => !row.unauthenticated.allowed).length,
  authorizedAllowed: rows.filter((row) => row.authorized.allowed).length,
  unauthenticatedCompatibilityReadAllowed: rows.filter((row) => row.unauthenticatedTruthStatus === "compatibility_read_allowed").length,
  unauthenticatedBlockedWithoutAuthorization: rows.filter((row) => row.unauthenticatedTruthStatus === "blocked_without_authorization").length,
  unauthenticatedRetiredOrDisabled: rows.filter((row) => row.unauthenticatedTruthStatus === "retired_or_disabled").length,
  authorizedCompatibilityReadAllowed: rows.filter((row) => row.authorizedTruthStatus === "compatibility_read_allowed").length,
  authorizedPublicWriteAllowed: rows.filter((row) => row.authorizedTruthStatus === "authorized_public_write_allowed").length,
  authorizedRetiredOrDisabled: rows.filter((row) => row.authorizedTruthStatus === "retired_or_disabled").length
};

console.log(JSON.stringify(summary, null, 2));

#!/usr/bin/env node
"use strict";

const message = {
  ok: false,
  decision: "DENY",
  code: "MIXED_VERIFIER_RETIRED",
  message: (
    "The mixed project lifecycle verifier has been retired. "
    + "Use governed verifier IDs "
    + "identity-workspace.project-lifecycle-readiness-fixture and identity-workspace.project-lifecycle-readiness-live-root."
  ),
  replacements: [
    "identity-workspace.project-lifecycle-readiness-fixture",
    "identity-workspace.project-lifecycle-readiness-live-root"
  ],
  direct_execution_authorized: false
};

console.error(
  JSON.stringify(message, null, 2)
);

process.exitCode = 2;

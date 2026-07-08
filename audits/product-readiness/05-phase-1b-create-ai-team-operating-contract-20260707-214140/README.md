# Phase 1B — Create Canonical AI Team Operating Contract

Purpose:
- Add a new contract-only source of truth for AI Team roles, aliases, page ownership, request types, output types, authority levels, and handoff rules.
- Add a validator.
- Keep runtime behavior unchanged.

Changed source files:
- public/control-center/runtime/ai-team/ai-team-operating-contract.js
- scripts/audit/validate-ai-team-operating-contract.mjs

Related existing modified file:
- public/control-center/pages/ai-command.js already includes the cleaned top-level detector from the previous cleanup.

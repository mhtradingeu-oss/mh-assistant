# Phase 1H — Narrow AI Command Alias Integration Patch

Purpose:
- Use the canonical AI Team contract to normalize AI Command bridge detector aliases.
- Keep the patch narrow and compatibility-preserving.

Changed source file:
- public/control-center/pages/ai-command.js

Scope:
- Import normalizeAiTeamRoleId.
- Add normalizeAiCommandSpecialistId helper.
- Use helper only in detectSpecialistFromBridgePrompt.

No Home, backend, route-role-fallback, SPECIALIST_DEFS, or classifyIntent rewrite.

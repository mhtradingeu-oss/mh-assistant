# Pre-Patch Truth

## Git State Before Patch
- Branch status: main tracking origin/main
- Working tree: clean
- HEAD: 829bde1 Lock Phase 14B.1 strategist product blueprint

## Source-of-Truth Read Before Editing
- Phase 14A.1 lock and protection notes
- Phase 14B.1 lock and all required strategist blueprints (05, 06, 08, 09, 10, 11, 12, 13, 14, 15)
- Current production files:
  - public/control-center/pages/ai-command.js
  - public/control-center/pages/ai-command/tool-dock.js
  - public/control-center/pages/campaign-studio.js
  - public/control-center/ai-team-model.js
  - public/control-center/shared-context.js

## Relevant Baseline Findings
- Strategist exists and must remain strategist.
- AI Command is existing chat authority.
- Campaign Studio is existing strategist workspace authority.
- Tool Dock strategist tools already exist with review_only safety.
- Existing wording was functional but generic.

# Phase 8A Direct Fetch Classification Draft

## api.js:663
Classification:
- Expected low-level transport wrapper.
Decision:
- Keep.

## api.js:1023
Classification:
- API helper direct fetch for createMediaManagerProject.
Decision:
- Needs review only. It may be acceptable if it handles FormData/special response needs.

## api.js:1374
Classification:
- API helper direct fetch for applyProjectBusinessTemplate.
Decision:
- Needs review only. Could be converted to sendJson only if behavior is identical.

## app.js:454
Classification:
- Active app-level direct fetch to /media-manager/projects.
Decision:
- Candidate for replacement with fetchProjects() if imports/context allow.

## app.js:576
Classification:
- Active app-level direct fetch to /media-manager/projects.
Decision:
- Candidate for replacement with fetchProjects() if imports/context allow.

## Phase 8A Rule
No patch until exact app.js context and api helper behavior are confirmed.

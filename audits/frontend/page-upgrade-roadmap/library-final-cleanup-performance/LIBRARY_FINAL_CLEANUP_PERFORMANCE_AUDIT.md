# Library Final Cleanup and Performance Audit

## Status
Audit-only checkpoint.

## Purpose
Identify final Library UX cleanup issues before closing the page:
- duplicated labels
- repeated action section titles
- empty More details area
- possible slow render/loading behavior
- heavy preview/card rendering

## Questions
- Which user-facing labels are duplicated?
- Is More details empty or useful?
- Can More details be hidden when no metadata exists?
- Are asset cards rendering too much text/path information?
- Are preview/images causing slow page load?
- Can render cost be reduced without changing backend/API/data?

## Non-goals
- No backend changes.
- No API changes.
- No data changes.
- No mutation handler changes.
- No route behavior changes.
- No new feature implementation.

## Evidence
See:
- LIBRARY_FINAL_CLEANUP_PERFORMANCE_EVIDENCE.txt

## Expected next step
Create a small implementation plan:
- deduplicate right rail labels
- hide or populate More details
- reduce asset card text overload
- add lazy loading/safer preview if already compatible
- preserve all handlers and data attributes

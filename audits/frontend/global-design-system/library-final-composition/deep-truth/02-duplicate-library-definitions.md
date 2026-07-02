# 02 — Duplicate Library Definitions / Old Copies

Generated: Sat Jun  6 09:45:56 CEST 2026

## Files containing Library route or Required Asset Evidence
public/control-center/styles/14-page-standard.css:1215:[data-page="library"] [data-library-required-action],
public/control-center/styles/14-page-standard.css:1228:[data-page="library"] [data-library-required-action]:hover,
public/control-center/pages/library.js:1510:function bindLibraryWorkspace({
public/control-center/pages/library.js:1673:            <small>${escapeHtml(`Files found: ${formatCount(item.totalCount)}`)}</small>
public/control-center/pages/library.js:1677:              data-library-required-action="${escapeHtml(item.action)}"
public/control-center/pages/library.js:2034:  const requiredActionButtons = Array.from(document.querySelectorAll("[data-library-required-action]"));
public/control-center/pages/library.js:2037:      const action = button.getAttribute("data-library-required-action") || "review";
public/control-center/pages/library.js:2924:export const libraryRoute = {
public/control-center/pages/library.js:2925:  id: "library",
public/control-center/pages/library.js:3046:              <div class="setup-kicker">Asset Source Command</div>
public/control-center/pages/library.js:3059:            <h3>Required Asset Evidence</h3>

## Possible duplicate route imports
public/control-center/router.js:21:import { libraryRoute } from "./pages/library.js";
public/control-center/router.js:48:  [libraryRoute.id]: libraryRoute,
public/control-center/pages/library.js:2924:export const libraryRoute = {
public/control-center/pages/library.js:2924:export const libraryRoute = {
public/control-center/router.js:21:import { libraryRoute } from "./pages/library.js";
public/control-center/router.js:48:  [libraryRoute.id]: libraryRoute,

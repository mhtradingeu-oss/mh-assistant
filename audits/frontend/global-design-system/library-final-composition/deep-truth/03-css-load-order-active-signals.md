# 03 — CSS Load Order + Active CSS Signals

Generated: Sat Jun  6 09:45:57 CEST 2026

## CSS links in index
8:  <link rel="stylesheet" href="./styles/00-tokens.css?v=20260508-tokens-1">
9:  <link rel="stylesheet" href="./styles/01-reset.css?v=20260508-reset-1">
10:  <link rel="stylesheet" href="./styles/02-layer-system.css?v=20260510-loading-overlay-1">
11:  <link rel="stylesheet" href="./styles/03-app-shell.css?v=20260508-shell-1">
12:  <link rel="stylesheet" href="./styles/07-sidebar.css?v=20260508-sidebar-2">
13:  <link rel="stylesheet" href="./styles/10-topbar-canonical.css?v=20260508-topbar-canonical-2">
14:  <link rel="stylesheet" href="./styles/04-command-layer.css?v=20260508-command-1">
15:  <link rel="stylesheet" href="./styles/05-ai-layer.css?v=20260508-ai-layer-1">
16:  <link rel="stylesheet" href="./styles/08-components-foundation.css?v=20260508-components-1">
17:  <link rel="stylesheet" href="./styles/mhos-action-primitives.css?v=20260523-action-primitives-1">
18:  <link rel="stylesheet" href="./styles/09-operations-centers.css?v=20260511-task-center-layout-1">
19:  <link rel="stylesheet" href="./styles/12-pages.css?v=20260508-pages-1">
20:  <link rel="stylesheet" href="./styles/13-home-executive.css?v=20260508-home-executive-1">
21:  <link rel="stylesheet" href="./styles/14-page-standard.css?v=20260510-library-polish-1">
22:  <link rel="stylesheet" href="./styles/15-clean-operating-layer.css?v=20260514-clean-layer-1">
23:  <link rel="stylesheet" href="./styles/mhos-workflow-primitives.css?v=20260523-workflow-primitives-1">
24:  <link rel="stylesheet" href="./styles/mhos-context-primitives.css?v=20260523-context-primitives-1">
25:  <link rel="stylesheet" href="./styles/mhos-executive-surface-primitives.css?v=20260523-executive-surface-primitives-1">

## Library CSS signals
public/control-center/styles/12-pages.css:1105:.library-smart-shell,
public/control-center/styles/12-pages.css:1147:.library-overview-grid,
public/control-center/styles/12-pages.css:1181:.library-workspace-grid,
public/control-center/styles/12-pages.css:1242:.library-required-card-head,
public/control-center/styles/12-pages.css:1312:.library-drop-zone {
public/control-center/styles/12-pages.css:1323:.library-required-card,
public/control-center/styles/12-pages.css:1397:  .library-overview-grid,
public/control-center/styles/12-pages.css:1416:  .library-workspace-grid,
public/control-center/styles/12-pages.css:1430:  .library-overview-grid,
public/control-center/styles/14-page-standard.css:984:[data-page="library"] .library-smart-shell {
public/control-center/styles/14-page-standard.css:994:[data-page="library"] .library-smart-shell > .card:first-child {
public/control-center/styles/14-page-standard.css:1004:[data-page="library"] .library-smart-shell > .card:first-child .card-head {
public/control-center/styles/14-page-standard.css:1012:[data-page="library"] .library-smart-shell > .card:first-child .card-head > div:first-child {
public/control-center/styles/14-page-standard.css:1016:[data-page="library"] .library-smart-shell > .card:first-child .setup-kicker {
public/control-center/styles/14-page-standard.css:1023:[data-page="library"] .library-smart-shell > .card:first-child h3 {
public/control-center/styles/14-page-standard.css:1031:[data-page="library"] .library-smart-shell > .card:first-child .setup-helper {
public/control-center/styles/14-page-standard.css:1066:[data-page="library"] .library-smart-shell > .card:first-child .progress {
public/control-center/styles/14-page-standard.css:1075:[data-page="library"] .library-smart-shell > .card:first-child .progress-bar {
public/control-center/styles/14-page-standard.css:1082:  [data-page="library"] .library-smart-shell > .card:first-child .card-head {
public/control-center/styles/14-page-standard.css:1095:  [data-page="library"] .library-smart-shell > .card:first-child .progress {
public/control-center/styles/14-page-standard.css:1101:[data-page="library"] .library-smart-shell > .card {
public/control-center/styles/14-page-standard.css:1109:[data-page="library"] .library-overview-grid {
public/control-center/styles/14-page-standard.css:1142:[data-page="library"] .library-required-card {
public/control-center/styles/14-page-standard.css:1155:[data-page="library"] .library-required-card:hover {
public/control-center/styles/14-page-standard.css:1160:[data-page="library"] .library-required-card-head {
public/control-center/styles/14-page-standard.css:1168:[data-page="library"] .library-required-card-head h4 {
public/control-center/styles/14-page-standard.css:1177:[data-page="library"] .library-required-card p {
public/control-center/styles/14-page-standard.css:1200:[data-page="library"] .library-required-card-foot {
public/control-center/styles/14-page-standard.css:1208:[data-page="library"] .library-required-card-foot small {
public/control-center/styles/14-page-standard.css:1216:[data-page="library"] .library-required-card button {
public/control-center/styles/14-page-standard.css:1229:[data-page="library"] .library-required-card button:hover {
public/control-center/styles/14-page-standard.css:1235:[data-page="library"] .library-required-card .badge,
public/control-center/styles/14-page-standard.css:1236:[data-page="library"] .library-required-card .status-badge {
public/control-center/styles/14-page-standard.css:1248:[data-page="library"] .library-required-card .badge[data-status="present"] {
public/control-center/styles/14-page-standard.css:1253:[data-page="library"] .library-required-card .badge[data-status="needs-review"] {
public/control-center/styles/14-page-standard.css:1258:[data-page="library"] .library-required-card .badge[data-status="missing"] {
public/control-center/styles/14-page-standard.css:1269:  [data-page="library"] .library-required-card {
public/control-center/styles/14-page-standard.css:1294:[data-page="library"] .library-actions-card .card-head {
public/control-center/styles/14-page-standard.css:1298:[data-page="library"] .library-drop-zone,
public/control-center/styles/14-page-standard.css:1315:[data-page="library"] .library-drop-zone:hover,
public/control-center/styles/14-page-standard.css:1316:[data-page="library"] .library-drop-zone.is-drag-active,
public/control-center/styles/14-page-standard.css:1358:[data-page="library"] .library-workspace-grid {
public/control-center/styles/14-page-standard.css:1365:[data-page="library"] .library-workspace-grid.library-finder-workspace {
public/control-center/styles/14-page-standard.css:1846:[data-page="library"] .library-drop-zone,
public/control-center/styles/14-page-standard.css:1847:[data-page="library"] .library-drop-zone *,
public/control-center/styles/14-page-standard.css:1869:  [data-page="library"] .library-workspace-grid,
public/control-center/styles/14-page-standard.css:1870:  [data-page="library"] .library-workspace-grid.library-finder-workspace {
public/control-center/styles/14-page-standard.css:1904:  [data-page="library"] .library-smart-shell {
public/control-center/styles/14-page-standard.css:1917:  [data-page="library"] .library-overview-grid,
public/control-center/styles/14-page-standard.css:2654:[data-page="library"] .library-upload-empty-state {
public/control-center/styles/14-page-standard.css:2662:[data-page="library"] .library-upload-empty-state strong {
public/control-center/styles/14-page-standard.css:2667:[data-page="library"] .library-upload-empty-state span {
public/control-center/styles/14-page-standard.css:2673:[data-page="library"] #libraryAssetWorkspace.is-required-action-target {
public/control-center/styles/14-page-standard.css:2681:[data-page="library"] .library-required-card-foot small {
public/control-center/styles/14-page-standard.css:2687:[data-page="library"] .library-intake-card.is-required-action-target,
public/control-center/styles/14-page-standard.css:2688:[data-page="library"] #libraryDropZone.is-required-action-target {

## Active diff in CSS
diff --git a/public/control-center/styles/14-page-standard.css b/public/control-center/styles/14-page-standard.css
index d624b10..80f0f81 100644
--- a/public/control-center/styles/14-page-standard.css
+++ b/public/control-center/styles/14-page-standard.css
@@ -2650,3 +2650,45 @@ button,
 [data-page="library"] #libraryOverviewCards:empty {
   display: none;
 }
+
+[data-page="library"] .library-upload-empty-state {
+  display: grid;
+  gap: 4px;
+  justify-items: center;
+  text-align: center;
+  padding: 14px 18px;
+}
+
+[data-page="library"] .library-upload-empty-state strong {
+  color: var(--text-primary);
+  font-weight: 800;
+}
+
+[data-page="library"] .library-upload-empty-state span {
+  color: var(--text-secondary);
+  font-size: 0.92rem;
+}
+
+/* LIB-FINAL-4D — Required asset action target feedback */
+[data-page="library"] #libraryAssetWorkspace.is-required-action-target {
+  border-color: rgba(45, 212, 191, 0.72);
+  box-shadow:
+    0 0 0 1px rgba(45, 212, 191, 0.32),
+    0 0 34px rgba(45, 212, 191, 0.14);
+  transition: border-color 180ms ease, box-shadow 180ms ease;
+}
+
+[data-page="library"] .library-required-card-foot small {
+  color: var(--text-secondary);
+  font-weight: 700;
+}
+
+/* LIB-FINAL-4E — Required asset CTA target feedback */
+[data-page="library"] .library-intake-card.is-required-action-target,
+[data-page="library"] #libraryDropZone.is-required-action-target {
+  border-color: rgba(45, 212, 191, 0.72);
+  box-shadow:
+    0 0 0 1px rgba(45, 212, 191, 0.32),
+    0 0 34px rgba(45, 212, 191, 0.14);
+  transition: border-color 180ms ease, box-shadow 180ms ease;
+}

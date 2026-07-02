# Integrations Step 3 Page Experience Review

## Status
Complete — basis for Step 3 implementation patch.

## Branch
architecture/frontend-consolidation-v1

## Baseline
- 19a06d2 Add Integrations step 3 information architecture plan
- 3b9065c Improve Integrations context preservation and compact cards
- 25b451d Add global UI UX system plan

---

## Current Page Purpose

The Integrations page is the Integration Control Tower for MH Assistant OS.
It allows users to:
- See the health of all integrations at a glance (executive header)
- Connect, test, sync, reconnect, or manage each connector
- Identify what is missing, broken, or needs setup
- Open a setup drawer for field entry and connector actions
- Review diagnostics, sync health, and coverage priorities

The page works and is safe. Step 3 is a professional polish pass.

---

## Current Main Sections

| Section | Location | Function |
|---|---|---|
| Executive Health | Top card | Compact metric strip: Total / Connected / Missing / Failed / Readiness |
| Recommended Next Action (inline) | After header | Shows connector + details/summary + primary CTA |
| AI Smart Recommendation (module) | After inline block | Renders AGAIN when card exists → duplication |
| Connector Workspace filter bar | Main column | Category / Status / Search filters |
| Connector group rows | Main column | Provider icon / name / badge / meta / actions |
| Selected connector summary | Right sidebar | Shows selected connector and opens drawer |
| Diagnostics | Right sidebar | Blockers / Warnings / Must-fix |
| Sync Health (activity feed) | Right sidebar | Live or derived connector checkpoints |
| Coverage Priorities | Bottom full-width | Critical missing / Recommendations / Coverage map |
| Setup Drawer | Overlay | Fields / Progress / Actions / Technical details |

---

## Confirmed Duplication and Label Problems

### 1. AI Recommendation Section Renders Twice
When a connector needs to be connected (`aiRec.card` is set), the page renders:
- `integration-system-next-action` (inline block in integrations.js) — uses details/summary ✅
- `renderAISmartRecommendationModule(aiRec)` (module from render.js) — shows whyItMatters inline, no progressive disclosure ❌

Both sections appear at once. The inline block is better (already uses progressive disclosure). The module call should be conditional: only show module when `aiRec.healthy`.

### 2. "Connection status" Label Repeats 3x in Drawer
- Drawer header badge: shows status ✅
- `integration-hub-intro` section: `<strong>Connection status</strong>` label + healthSummary text
- `integration-side-panel--drawer-details` data-row: `Connection status` → statusLabel

The healthSummary is different from the statusLabel, so both have value. But the label "Connection status" is heavy and repeated. Fix: change to compact labeled rows, wrap tech details behind progressive disclosure.

### 3. "Health" Duplicates with "Connection status" in Technical Panel
- Hub-intro shows: `Connection status` → healthSummary (e.g. "Facebook is connected and ready...")
- Technical panel shows: `Health` → healthSummary again

Exact same text shown twice. Remove from technical panel (keep in hub-intro).

### 4. "Connection value" Label is Redundant
The term "Connection value" is internal jargon. The actual value (e.g. a store URL) is clearer when shown as just "Value" in a compact row or not labeled at all when empty ("Not set" is unhelpful noise).

### 5. "Primary action" / "Secondary actions" Mini-Headings in Action Block
```
Primary action
[Connect / Reconnect / Manage button]

Secondary actions
[Test connection] [Sync]
```
These headings add no value. The button labels already communicate action hierarchy. Removing them creates a cleaner action zone.

### 6. "Step 1: Fill required fields" / "Step 2: Test connection" / "Step 3: Activate"
The "Step N:" prefix before each progress label makes them feel like documentation, not a live status indicator. Removing the prefix makes them scan-faster as status indicators.

### 7. "Sync health:" Prefix on Every Connector Row
Each connector row shows:
```
Sync health: [healthLabel]
```
The label "Sync health:" is the same on every row. The value is what matters. Removing the prefix gives more space for the actual health text.

### 8. Setup Kicker "Integration Control Tower" Duplicates Badge in AI Rec
The AI rec module shows a badge labeled "Integration Control Tower" while the header section already has an eyebrow "Integration Control Tower". The duplication is fine if sections are separate, but when both render in proximity it adds noise.

---

## Text That Should Become Progressive Disclosure

| Location | Current state | Fix |
|---|---|---|
| AI rec module (`ai-smart-rec-why`) | `whyItMatters` always visible inline | Move behind details/summary |
| Drawer technical panel | Always visible data-stack (Last test / Last sync / etc) | Wrap in details/summary "Technical details" |
| Drawer hub-intro | "Connection status" + "Connection value" as always-visible labeled blocks | Convert to compact data-rows (label + value inline) |
| Step progress | Always shows all 3 steps | Already compact, just improve label format |

---

## Header Problems

1. **Metric strip is already good** — Total / Connected / Missing / Failed / Readiness is correct.
2. **Missing "Next action"** — A quick CTA in the metric strip (6th tile) would make the most important action immediately clickable from the header, without scrolling down to the inline recommendation card.
3. **Setup kicker "Integration Control Tower"** appears in header AND in AI rec badge simultaneously — keep in header, remove from AI rec badge in render.js (or keep as-is since it is a separate section).

---

## Drawer Text Hierarchy Problems

Current order:
1. Icon + label + purpose (hub-head)
2. Status badge + close button
3. **Connection status** (healthSummary)
4. **Connection value** (sourceValue)
5. Why this connector matters (expandable) ✅
6. Connection requirements (pills) ✅
7. Progress steps (Step 1/2/3)
8. **Fields and validation** mini-heading + fields
9. Optional fields (expandable) ✅
10. Credentials
11. Security note
12. **Primary action** heading + primary button
13. **Secondary actions** heading + test/sync buttons
14. OAuth note
15. **Technical and status details** — full visible data-stack (Connection status / Last test / Last sync / Last import / Health / Notes)

Problems:
- Items 3 and 4 are verbose blocks that can be compact rows
- Items 12 and 13 have unnecessary headings
- Item 15 duplicates status (already in badge) and health (already in item 3)
- Item 15 should be behind details/summary

Better order:
1. Icon + label + status badge + close button
2. Status (compact row: label → healthSummary)
3. Value (compact row: show only when set)
4. Why this matters (expandable) ✅
5. Requirements (pills) ✅
6. Progress (compact steps without "Step N: " prefix)
7. Fields (mini-heading + fields)
8. Optional fields (expandable) ✅
9. Security note
10. Action row: primary button + secondary buttons (no headings)
11. Technical details (expandable details/summary → Last test / Last sync / Last import / Notes)

---

## Connector Card Problems

1. **"Sync health:" prefix** — repeated on every row, wastes space, the value is self-explanatory
2. **Meta rows are 2 lines + pills** — already compact from Step 2 but can tighten
3. **"Setup drawer" secondary button** — label is redundant next to the primary action that also opens the drawer. Could be renamed "Details" or "Info"

---

## Sync Health Problems

1. Every activity feed item shows "Derived" or "Live" badge — this is good context
2. The section description "Shows live integration events when available, otherwise derived connector checkpoints" already explains the distinction
3. No changes needed — section is already well-structured from Step 2

---

## Coverage Priority Problems

1. Critical missing items show: `title` + `meta` (meta includes whyItMatters as a long sentence)
2. Recommended actions show: `title` + `meta`
3. Items have no direct action — but `buildCriticalMissing` and `buildRecommendations` do not expose card IDs, so action buttons cannot be added safely without modifying builders.js (not in allowed files)
4. Fix: CSS tightening of meta text, possibly 2-line clamp

---

## Safe Design Proposal

### Priority 1 — Remove AI Rec Duplication (integrations.js)
Conditional render: only show `renderAISmartRecommendationModule(aiRec)` when `aiRec.healthy`.
The inline `integration-system-next-action` block handles the non-healthy recommendation.

### Priority 2 — Improve AI Rec Module for Healthy State (render.js)
When `aiRec.healthy`, the module shows "Connector workspace is healthy" — already good.
When not healthy, the module shows whyItMatters inline → move behind details/summary.
But since Priority 1 removes the module from the not-healthy path, this is handled by Priority 1 alone.

### Priority 3 — Improve Drawer Info Hierarchy (drawer.js)
- Replace "Connection status" block with compact labeled row
- Replace "Connection value" block with compact labeled row (show only when set)
- Remove "Primary action" / "Secondary actions" mini-headings from action buttons
- Wrap technical details panel in details/summary
- Remove "Health" row from technical panel (already shown in hub-intro)
- Remove "Connection status" row from technical panel (already in badge)
- Make progress step labels cleaner (drop "Step N: " prefix)

### Priority 4 — Connector Row Meta (cards.js)
- Remove "Sync health: " prefix from meta row
- Rename "Setup drawer" secondary button to "Details"

### Priority 5 — CSS Polish (14-page-standard.css)
- Style `.integration-hub-status-row` as compact labeled row
- Style `.integration-drawer-tech-details` summary toggle
- Improve step indicator visual for `is-complete` / `is-active` / `is-pending`
- Add provider icon category tone class (subtle accent border)
- Ensure progress steps are compact

---

## Exact Production Files Planned for Editing

| File | Scope |
|---|---|
| `public/control-center/pages/integrations.js` | Remove duplicate AI rec module call; add next-action metric to header |
| `public/control-center/pages/integrations/drawer.js` | Improve hub-intro, wrap tech details in disclosure, clean action block headings, compact step labels |
| `public/control-center/pages/integrations/cards.js` | Remove "Sync health:" prefix; rename "Setup drawer" button |
| `public/control-center/pages/integrations/render.js` | Move whyItMatters in non-healthy AI rec behind details/summary (if needed after Priority 1) |
| `public/control-center/styles/14-page-standard.css` | CSS polish for new classes and visual improvements |

---

## Behavior Preserved (Must Not Change)

- `bindIntegrationActions` — not touched
- Connector model / build pipeline — not touched
- Data attributes: `data-integration-select`, `data-integration-primary`, `data-integration-action`, `data-integration-field`, `data-integration-drawer-close`, `data-integration-category-filter`, `data-integration-status-filter`, `data-integration-search`, `data-integration-diagnostics`, `data-integration-prompt` — all preserved
- Drawer open / close / Escape key behavior — not touched
- Selected connector highlight after drawer close — not touched
- Internal scroll container and scroll state restore — not touched
- setup / test / sync / connect / reconnect / disconnect flows — not touched
- Diagnostics logic — not touched
- Validation state — not touched
- Required field detection — not touched
- Step progress logic — logic unchanged, only label text made compact

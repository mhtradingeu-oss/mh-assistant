# T69 — Insights Exact Action Paths Audit

## Status
Audit-only. No production files changed.

## Scope
Classify exact user-facing actions in:

- `public/control-center/pages/insights.js`

This follows T68, which found that Insights is mostly analytics/projection/AI guidance, but includes refresh and handoff persistence paths.

## Action Classification

### 1. Open AI Command
Observed behavior:
- Button uses `data-insights-open`.
- Navigates to `ai-command`.
- No backend mutation by itself.

Classification:
- Navigation only.
- Safe.

Required action:
- No runtime patch required.

---

### 2. Open destination workspace buttons
Observed behavior:
- Buttons use `data-insights-route`.
- Routes include Campaign Studio, Content Studio, Ads Manager, and Publishing.
- Before navigation, Insights prepares a shared handoff for the target route.

Classification:
- Navigation + handoff preparation.

Risk:
- `setSharedHandoff` is frontend shared context.
- If `createProjectHandoff` is also called in this path, classify as backend handoff persistence.
- Handoff persistence is not publishing/execution, but it is a backend record creation if active.

Required action:
- Confirm exact code path.
- If backend handoff persistence happens, ensure copy says “creates a handoff only; does not publish/execute.”
- No destructive confirmation required unless handoff persistence is considered authority-sensitive.

---

### 3. AI prompt buttons
Observed behavior:
- Buttons use `data-insights-prompt`.
- Fill `quickCommandInput`.
- Navigate to AI Command.
- Store shared AI handoff.
- May call `createProjectHandoff?.(projectName, handoff)`.

Classification:
- AI context handoff.
- Possible backend handoff persistence.

Risk:
- Not an execution action.
- It may create a project handoff/audit/intake record.
- Existing copy says sending a prompt prefills context and creates a handoff.

Required action:
- Likely safe if copy is clear.
- No patch required unless wording is ambiguous.

---

### 4. Refresh Insights
Observed behavior:
- Button `#insightsRefreshBtn`.
- Sets refresh state in memory.
- Rerenders Insights.
- Refreshes available state/context.
- Needs exact classification from source lines around refresh handler.

Classification:
- Read-only refresh if it only reloads existing project data/context.
- Backend mutation only if it triggers ingestion/sync/generation.

Risk:
- T68 found no confirmation.
- This is acceptable if refresh is read-only.
- If refresh triggers provider sync/import/generation, patch required.

Required action:
- Inspect exact refresh handler.

---

### 5. Analytics / learning recommendations
Observed behavior:
- Insights computes metrics, top content, weak content, learning lessons, optimization prompts.
- Uses current state data.
- Does not write learning results back directly in the visible audit output.

Classification:
- Read-only analytics projection.
- Safe.

Required action:
- No patch required.

---

## Required Source Inspection

Inspect these source ranges:

- `bindInsightsActions`
- `data-insights-route`
- `data-insights-prompt`
- `#insightsRefreshBtn`
- `createProjectHandoff`
- `setSharedHandoff`

## Decision Rule
- If refresh is read-only and handoffs are clearly labeled as handoffs only, close Insights with no runtime patch.
- If handoff creation is backend persistence but copy is insufficient, add narrow copy clarification only.
- If refresh triggers provider sync/import/generation, add narrow confirmation/copy patch.
- Do not redesign Insights in this pass.

# SYSTEM WIDE EXECUTIVE SURFACE CONSISTENCY AUDIT

**Date:** 2026-05-24  
**Mode:** Audit only - no implementation  
**Scope:**  
- `public/control-center/pages/home.js`
- `public/control-center/pages/ai-command.js`
- `public/control-center/pages/governance.js`
- `public/control-center/pages/campaign-studio.js`
- `public/control-center/pages/operations-centers.js`
- `public/control-center/styles/mhos-executive-surface-primitives.css`
- `public/control-center/styles/mhos-context-primitives.css`
- `public/control-center/styles/mhos-workflow-primitives.css`

---

## 1. Executive Summary

MH-OS is clearly moving away from disconnected dashboards and toward a coherent AI Business Operating System. The operating model is visible across the main surfaces: executive summary, readiness, AI guidance, handoffs, approvals, blockers, queues, and route-aware action.

The system is not yet fully coherent. The strongest pages are using the same ideas, but not always the same rhythm or primitive layer. Campaign Studio and AI Command are the most advanced in shared `mhos-*` adoption. Home has the clearest "what matters now" posture, but still carries local dashboard-style composition. Governance has the best authority model, but not the clearest executive first-screen rhythm. Operations Centers show operational movement well, but they remain more standard table surfaces than executive operating surfaces.

The main convergence risk is not missing capability. It is uneven emphasis: some pages lead with executive cognition, some with data inventory, some with AI tooling, and some with governance mechanics. The next convergence work should align first-screen rhythm before adding more UI.

Overall assessment: **partially coherent, strongly recoverable, ready for system-wide convergence passes.**

---

## 2. Page Maturity Snapshot

| Page | Current maturity | Strongest signal | Main drift |
| --- | --- | --- | --- |
| Home | High executive cognition, medium primitive consistency | Best "Next Best Action" and system-wide operating snapshot | Local `home-*` and `mhos-next-action` patterns dominate over target primitives |
| AI Command | Highest AI cognition and handoff model | Specialist/team roles, draft/task/workflow/handoff output workspace | Dense AI surface, role ID aliases, workflow primitive used for button rows |
| Governance | Highest authority and approval visibility | Policy, owners, risks, decisions, escalation, audit context | Executive rhythm is buried under standard panels; handoff intake appears fragile |
| Campaign Studio | Strong campaign operating surface | Context header, strategist next move, readiness, blockers, downstream handoffs | Helper text density and form weight weaken calm executive rhythm |
| Operations Centers | Strong operational movement | Tasks, queues, jobs, alerts, route-aware detail panels | Uses `std-context-*`, lacks a single Next Best Action per center |

---

## 3. Executive Cognition Consistency

### Assessment

The pages share a recognizable executive operating intent, but not a fully consistent executive rhythm.

The strongest rhythm is:

1. Context: what surface and project are active.
2. State: readiness, pressure, blockers, and confidence.
3. Recommendation: what matters now.
4. Movement: where work goes next.
5. Authority: what is safe, blocked, or requires approval.

Home expresses this most clearly through an executive header, health strip, and `Next Best Action` surface (`home.js:687`, `home.js:708`). Campaign Studio follows with a context ribbon, strategist next move, and operating summary (`campaign-studio.js:1557`, `campaign-studio.js:1573`, `campaign-studio.js:1585`). AI Command expresses a related but AI-native rhythm through its operating room header, summary grid, and flow (`ai-command.js:3495`, `ai-command.js:3517`, `ai-command.js:3540`).

Governance and Operations are less aligned. Governance does compute and render "Launch readiness and next best governance action" (`governance.js:862`), but it comes after a command panel and system signal grid. Operations Centers show metrics and runtime signals consistently, but they do not provide a canonical "what matters now" or Next Best Action for each center (`operations-centers.js:464`, `operations-centers.js:802`, `operations-centers.js:1093`, `operations-centers.js:1448`).

### What Matters Now Clarity

| Page | Clarity |
| --- | --- |
| Home | Strong. The page explicitly centers `Next Best Action` and destination. |
| Campaign Studio | Strong-medium. "Strategist next move" is useful, but uses page-specific language instead of canonical Next Best Action. |
| AI Command | Medium. The user sees AI operating flow, but not one system-prioritized next move. |
| Governance | Medium. The next governance action exists, but is not first-screen dominant. |
| Operations Centers | Medium-low. Pressure and counts are visible, but the user must infer the next move. |

### Next Best Action Consistency

Next Best Action is not yet a system-wide primitive. Home uses it explicitly. Governance uses the concept in copy. Campaign uses "Strategist next move" and "Recommended next action." AI Command uses "Next step" and "What you can do next." Operations uses prompts like "prioritize backlog" but has no first-class Next Best Action surface.

Recommendation: define a shared executive pattern for `Next Best Action`, `Reason`, `Owner`, `Destination`, and `Governance requirement` before further page-level UI growth.

---

## 4. AI Cognition Consistency

### Assessment

AI feels operationally aware across the system, not merely chat-like. The surfaces generally describe what AI can do, what it cannot do, and where AI outputs go next.

AI Command is the strongest implementation. It defines specialists, full-team mode, canonical tools, output types, destination routing, confirmation requirements, and safe execution boundaries (`ai-command.js:111`, `ai-command.js:3636`, `ai-command.js:3770`, `ai-command.js:4027`, `ai-command.js:4108`). Home projects AI team cards from operations, notifications, tasks, and approvals, which gives AI awareness of current system state (`home.js:180`, `home.js:951`). Campaign Studio can send campaign context to AI and route campaign handoffs downstream (`campaign-studio.js:1328`, `campaign-studio.js:1975`). Governance and Operations both expose context-only AI panels with prompts based on selected work (`governance.js:620`, `governance.js:1199`, `operations-centers.js:168`).

### Contextual vs Generic Guidance

Most AI prompts are contextual. They include selected item, project, focus, owners, due-state, blockers, readiness, risk, and destination. The risk is presentation, not data. AI helper panels repeat similar safety copy across pages, which can make AI feel verbose even when the prompt content is good.

### AI Role and Handoff Consistency

Role semantics are broadly aligned, but role IDs still drift:

- Home uses roles such as `designer`, `ads_operator`, and `admin` (`home.js:168`).
- Campaign Studio routes to `designer`, `ads_operator`, and `admin` (`campaign-studio.js:60`).
- AI Command canonicalizes many legacy IDs through aliases (`ai-command.js:111`).

This is manageable because aliases exist, but it means the UI language is cleaner than the underlying role taxonomy. Future passes should normalize the displayed and persisted role vocabulary around canonical roles such as `strategist`, `writer`, `media`, `publisher`, `compliance_reviewer`, `operations`, `customer_ops`, and `sales_crm`.

---

## 5. Workflow and Orchestration Visibility

### Assessment

Workflow visibility exists, but it is uneven.

AI Command has the clearest orchestration model: an operating flow, output tabs, draft/task/workflow/handoff actions, destination routing, and confirmation copy (`ai-command.js:3540`, `ai-command.js:3889`, `ai-command.js:4038`, `ai-command.js:4102`). Home visualizes AI roles as a workflow chain and includes orchestration pressure plus escalation lane (`home.js:951`, `home.js:982`). Operations Centers show movement through tasks, queues, jobs, notifications, routes, and logs, but mostly through tables and selected detail panels rather than a workflow chain (`operations-centers.js:493`, `operations-centers.js:831`, `operations-centers.js:1121`, `operations-centers.js:1485`).

Campaign Studio has strong handoff actions to Content, Media, Publishing, and Ads (`campaign-studio.js:1975`), but those actions are not represented as a visible workflow chain. Governance has decision queues, escalation chains, and audit history, but not a clear workflow/handoff visualization (`governance.js:961`, `governance.js:1122`).

### Movement vs Status

| Page | Shows movement? | Notes |
| --- | --- | --- |
| AI Command | Strong | Drafts become previews, previews route to destinations. |
| Home | Medium-strong | Shows next route, AI role chain, blockers, escalations. |
| Operations Centers | Strong operationally, medium visually | Queues/jobs move, but movement is table-driven. |
| Campaign Studio | Medium | Handoff buttons imply movement; workflow chain is absent. |
| Governance | Medium-low | Decisions and history exist, but movement is mostly queue/status. |

Recommendation: reuse workflow primitives for true stage/handoff sequences only. Avoid using `.mhos-workflow-step` as a generic button primitive, as seen in AI Command's action row (`ai-command.js:3889`). That stretches the semantic meaning of workflow primitives.

---

## 6. Governance Visibility

### Assessment

Governance is present across the system without being entirely overwhelming, but it is not embedded with equal clarity everywhere.

Governance page itself is strong: approval queue, policy violations, claim review, brand safety, publish guardrails, escalations, owners, active rules, override controls, evidence summary, decision notes, and authority boundary are all visible (`governance.js:843`, `governance.js:916`, `governance.js:1022`, `governance.js:1122`, `governance.js:1131`).

Home embeds governance lightly through approvals, escalations, and blockers (`home.js:687`, `home.js:821`). AI Command embeds authority boundaries and compliance roles throughout its specialist model (`ai-command.js:230`, `ai-command.js:3987`, `ai-command.js:4444`). Operations Centers expose approval signals and deferred mutation safety (`operations-centers.js:322`, `operations-centers.js:593`, `operations-centers.js:916`, `operations-centers.js:1210`, `operations-centers.js:1554`). Campaign Studio includes approval blockers and safe downstream handoffs, but approval ownership is less visible in the main surface (`campaign-studio.js:1944`, `campaign-studio.js:1975`).

### Embedded Without Overwhelming

Governance is most balanced on Home and AI Command. It is most complete on Governance, but dense. It is visible but repetitive in Operations. It is weakest in Campaign Studio because approval blockers are present, while authority owner, approval path, and governance destination are not as prominent as campaign planning fields.

### Fragile Area

Governance attempts to render incoming review context from shared handoffs (`governance.js:1038`, `governance.js:1052`), but the target file does not import `getSharedHandoff` or `getSharedAiDraft`. The guarded `typeof` check prevents runtime failure, but the intake panel may remain empty unless those helpers are global. This risks making governance handoff visibility appear available while not reliably connected.

---

## 7. Visual Calmness

### Calmest Surfaces

- Operations center detail layouts are relatively calm because they repeat one stable structure: context ribbon, runtime strip, table, detail rail, actions, AI panel.
- Campaign Studio's top command header is calm and effective before the form-heavy body begins.
- Home's Next Best Action surface is clear and executive-friendly.

### Dense or Noisy Surfaces

- AI Command is the noisiest surface. It combines specialist rail, profile, chat, composer, tool dock, action row, preview/output workspace, context, safety, history, and media readiness. The model is good, but the first screen risks AI clutter.
- Campaign Studio becomes dense in the form body. Nearly every field carries helper text, and the page mixes planning inputs, recommendations, blockers, library dependencies, AI assistant, and routing in one long workspace.
- Governance is dense because it must expose policy, queue, evidence, decisions, owners, overrides, escalation, settings bridge, and AI assistant. It needs stronger hierarchy, not less information.
- Home risks dashboard entropy because it includes header, health strip, Next Best Action, signal cards, readiness, campaign, blockers, status board, quick navigation, AI prompts, workforce chain, escalation lane, and activity.

### Excessive Helper Text

Primary helper text pressure appears in:

- Campaign Studio form fields and section copy.
- AI Command planned/safety/readiness copy.
- Operations repeated "deferred: mutation safety pass" labels.
- Governance repeated authority and safe execution banners.
- Home AI prompt cards and explanatory section helpers.

Recommendation: preserve safety language, but compress repeated helper copy into canonical labels: `Guidance only`, `Review required`, `Deferred mutation`, `Route only`, `Approval required`.

### Weak Hierarchy

- Governance: "Next best governance action" should be visually promoted above or alongside system signals.
- Operations: runtime signals should resolve into one recommended operational action.
- AI Command: the current active specialist/team output should dominate more than the surrounding tooling.
- Home: the number of executive panels should be reduced or grouped after the Next Best Action.

---

## 8. Primitive Usage Consistency

### Target Primitive Files

`mhos-executive-surface-primitives.css` defines a small executive layer: surface, panel, summary grid/item, metric label/value/note, AI panel, guidance, and action row (`mhos-executive-surface-primitives.css:14`).  
`mhos-context-primitives.css` defines context ribbons, main area, kicker, title, description, chip row, chips, and actions (`mhos-context-primitives.css:4`).  
`mhos-workflow-primitives.css` defines workflow chain, step, active/blocked states, handoff, escalation lane, and orchestration pressure (`mhos-workflow-primitives.css:2`).

### Adoption Table

| Page | Executive primitives | Context primitives | Workflow primitives | Drift |
| --- | --- | --- | --- | --- |
| Home | Partial. Uses local `mhos-executive-strip`, `mhos-next-action`, and clean primitives rather than target summary primitives. | Mostly local `home-*`. | Uses `mhos-workflow-chain`, `mhos-workflow-step`, escalation lane. | High local pattern ownership. |
| AI Command | Strong. Header, panels, summary grid/items are adopted. | Strong. Header and context strip use `mhos-context-*`. | Strong but semantically stretched in action buttons. | AI-specific `aicmd-*` remains large but expected. |
| Governance | Low target adoption. Uses `mhos-clean-*`, `std-*`, and `governance-*`. | Low. No `mhos-context-*` in main render. | Low. Queues/escalations not using workflow primitives. | Standard panel system dominates. |
| Campaign Studio | Strong in header/summary/strategist/action areas. | Strong in command header. | Low. Handoffs are buttons, not workflow primitives. | Form body remains campaign-local. |
| Operations Centers | Low target adoption. Uses `mhos-clean-*`, `std-context-*`, and `ops-*`. | Uses `std-context-*` instead of `mhos-context-*`. | Low. Runtime signals are local. | Standard operations layout dominates. |

### Primitive Drift Risks

- `mhos-executive-surface-primitives.css` still says "Foundation only. No page adoption" while pages now adopt those classes. The comment is stale relative to usage.
- `mhos-context-primitives.css` says "For future context system migration. Do not use on legacy markup" while AI Command and Campaign Studio are using it. The codebase needs the documentation contract updated in a future docs/CSS authority pass.
- `mhos-workflow-step` is used for true flow steps and also for button-like action controls in AI Command. This can blur the distinction between "workflow stage" and "action button."
- Home introduces `mhos-next-action`, `mhos-executive-strip`, `mhos-workforce-room`, and escalation patterns that are not part of the three audited primitive files. These may be good candidates for future primitive extraction, but they are currently local one-off system patterns.

---

## 9. Cross-Surface Language Consistency

### Consistent Terms

- `Readiness` appears across Home, AI Command, Governance, Campaign Studio, and Operations.
- `Approval`, `Risk`, `Owner`, `Route`, and `Status` are broadly present.
- `Handoff` is strong in AI Command and Campaign Studio.
- `Governance` is consistently treated as authority, not generic advice.

### Inconsistent Terms

| Concept | Current variants | Risk |
| --- | --- | --- |
| Next priority | `Next Best Action`, `Strategist next move`, `Recommended next action`, `Next step`, `What you can do next` | User learns page-specific labels instead of one operating grammar. |
| AI surface | `AI Operating Room`, `AI Team Command Center`, `AI Guidance`, `AI Assistant`, `AI Workspace`, `AI Team Connection` | AI feels coherent in function but inconsistent in naming. |
| Operations | `Operational`, `Operating`, `Execution`, `Runtime`, `System Signal` | Some surfaces feel executive; others feel technical. |
| Handoff | `Prepare Handoff`, `Route Draft`, `Send to`, `Open Owner Page`, `Command Handoff` | Destination movement is clear, but handoff language varies. |
| Governance action | `Submit Approval Decision`, `Request Approval Review`, `Record Override Decision`, `Review before execution` | Accurate, but could use a clearer shared authority ladder. |

Recommendation: standardize the first-screen language around:

- `What matters now`
- `Next Best Action`
- `Owner`
- `Destination`
- `Blocker`
- `Approval required`
- `Governance boundary`
- `Handoff`
- `Workflow`
- `Readiness`

---

## 10. Risk Map

### Dashboard Entropy Risk

| Page | Risk | Reason |
| --- | --- | --- |
| Home | High | Many panels compete after Next Best Action; local card/snapshot/action/prompt patterns accumulate. |
| Governance | Medium-high | Complete authority data can become a policy dashboard without stronger executive hierarchy. |
| AI Command | Medium-high | Tooling, role rail, chat, preview, context, history, and safety can become an AI cockpit rather than an operating surface. |
| Campaign Studio | Medium | Form body and recommendation grids can overwhelm the clean command header. |
| Operations Centers | Medium | Repeated center tables can become inventory dashboards without per-center next action. |

### AI Clutter Risk

| Page | Risk | Reason |
| --- | --- | --- |
| AI Command | High | Many AI controls and explanatory states are visible at once. |
| Home | Medium | AI guidance, prompt cards, workforce chain, and escalation lane add cognitive weight after executive summary. |
| Campaign Studio | Medium | AI assistant copy and routing sit beside dense planning forms. |
| Operations Centers | Medium | AI panels repeat across every center with similar text. |
| Governance | Medium-low | AI is scoped as context-only and does not dominate the page. |

### Weak Orchestration Visibility Risk

| Page | Risk | Reason |
| --- | --- | --- |
| Governance | Medium-high | Queues and decisions are visible, but workflow/handoff movement is not visually strong. |
| Campaign Studio | Medium | Downstream routes exist, but not as a visible operating chain. |
| Operations Centers | Medium | Movement is visible through tables and routes, not through executive orchestration. |
| Home | Low-medium | Has workflow chain, but could clarify owner/destination more consistently. |
| AI Command | Low | Strongest orchestration surface. |

### Governance Invisibility Risk

| Page | Risk | Reason |
| --- | --- | --- |
| Campaign Studio | Medium | Approval blockers exist, but governance owner/path is not prominent in the main planning flow. |
| Operations Centers | Medium | Approval signals and mutation safety are visible, but governance path is mostly deferred text and alert counts. |
| Home | Low-medium | Approvals/escalations are visible, but governance details are summarized. |
| AI Command | Low | Strong safety and authority boundaries. |
| Governance | Low | Governance is the page purpose. |

---

## 11. Recommended Sequencing

Safest next convergence order:

1. **Governance executive rhythm pass**
   - Promote readiness, next best governance action, owner, risk, and escalation into a clearer first-screen executive pattern.
   - Safest high-value pass because governance data already exists and authority clarity benefits every other surface.
   - Keep policy/detail density, but move it below a stronger executive command layer.

2. **Operations Centers next-action and context primitive pass**
   - Normalize `std-context-*` toward `mhos-context-*` where safe.
   - Add a per-center operational Next Best Action derived from blocked, overdue, queued, failed, critical, or approval signals.
   - Keep tables intact; improve the executive layer above them.

3. **Home entropy reduction and primitive extraction pass**
   - Treat Home as the final executive synthesis surface, not the first experiment.
   - Consolidate local `mhos-next-action`, health strip, workforce room, orchestration pressure, and escalation lane into candidate shared primitives only after Governance and Operations clarify the common rhythm.

4. **Campaign Studio calmness and handoff visibility pass**
   - Keep the strong command header.
   - Compress helper text and expose the downstream campaign route as an explicit workflow/handoff chain.
   - Promote approval owner/path near readiness and blockers.

5. **AI Command declutter and role taxonomy pass**
   - Defer until the shared language is settled.
   - Normalize role IDs and visible role labels.
   - Separate workflow stage primitives from action button primitives.
   - Reduce repeated safety/helper copy while preserving authority boundaries.

6. **Primitive contract documentation pass**
   - Update primitive CSS comments/specs to match actual adoption state.
   - Decide whether Home's `mhos-next-action`, `mhos-executive-strip`, and orchestration pressure patterns become formal primitives.
   - Clarify when `mhos-workflow-*` may be used and when action primitives should be used instead.

---

## 12. Final Recommendation

Proceed with convergence, but do it through executive rhythm first, not visual polish first. The system already has the ingredients of a coherent AI Business Operating System: AI roles, handoffs, governance, workflows, readiness, blockers, and operational queues. The next work should make every main surface answer the same first-screen questions:

1. What matters now?
2. Why does it matter?
3. Who or what owns it?
4. What is blocked?
5. What is the next destination?
6. What requires governance?
7. What can AI safely prepare?

When those questions are answered consistently, the remaining primitive and visual convergence will have a stable cognitive target.

---

**Audit result:** Documentation-only audit completed. No JS, CSS, runtime, or data changes are recommended in this document.

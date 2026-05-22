# STEP G6 — Migration Risk Matrix

**Purpose:**
Provide a risk matrix for all major MH-OS frontend pages and surfaces to guide migration planning and risk mitigation. Documentation only. No code, CSS, or backend changes.

---


## Migration Risk Matrix

**Recommended migration sequence (balancing impact and safety):**
1. Publishing — first visible Result Preview migration, medium risk, high impact.
2. AI Team Command Center — first AI Workforce experience migration, low/medium risk, high strategic impact.
3. Research Insights — low-risk validation page for primitives.
4. Setup/Utility — low-risk form/panel standardization.
5. Executive Dashboard / Home — executive operating room.
6. Media Manager / Media Studio — asset and preview-heavy migration.
7. Customer Operations + IVR/Sales — operational network migration.
8. Governance — high-impact but high-risk, migrate after primitives are proven.

**Note:**
Governance remains the most important authority surface, but should not be the first full migration because it is high-risk. It can receive small safe improvements, but full operating-surface migration should happen after Publishing and AI Team patterns are proven.

| Page | Migration Risk | Key Risk Factors | Mitigation Strategies | Rollback Complexity | QA Priority |
|------|---------------|------------------|----------------------|--------------------|-------------|
| Governance | High | Layered CSS, overlays, legacy selectors, approval logic | Isolate overlays, refactor selectors, incremental migration, extra QA | High | Highest |
| Publishing | Medium | Duplicated layouts, preview logic | Modular migration, preview-first, selector audit | Medium | High |
| AI Team Command Center | Low | State sync, role complexity | Test collaboration, phased rollout | Low | High |
| Customer Operations | High | Overlays, noisy UI, evidence links | UI isolation, overlay refactor, workflow QA | High | High |
| Media Manager | Medium | Legacy CSS patches, asset grid | CSS cleanup, grid isolation | Medium | Medium |
| Research Insights | Low | Sparse actions, isolated | Minimal risk, standard QA | Low | Low |
| Setup/Utility | Low | Inconsistent panels | Panel standardization | Low | Low |
| Executive Dashboard | Medium | Card wall, summary logic | Card wall refactor, summary QA | Medium | Medium |

## Risk Scoring
- High: Requires isolation, extra QA, rollback plan
- Medium: Modular migration, standard QA
- Low: Minimal risk, standard QA

## Mitigation Checklist
- Isolate overlays and legacy selectors before migration
- Refactor duplicated layouts and panels
- Standardize preview containers
- Incremental migration with rollback checkpoints
- Extra QA for high-risk pages
- Visual regression and selector duplication checks

---

**This risk matrix must be reviewed and signed by all contributors before migration begins.**

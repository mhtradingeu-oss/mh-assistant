# Page To AI Team Connection Map

| Page | Recommended AI specialist(s) | Current connection status | Missing handoff | Suggested button/action label | Destination action |
|---|---|---|---|---|---|
| Home | Operations Lead, Strategist, Full Team | Good via `quickCommandInput` and AI cards | Operations route is invalid | Ask AI Team What To Do Next | `ai-command` with dashboard prompt |
| Setup | System Setup Assistant, Operations Lead, Strategist | Partial via quick input | True setup review and setup gap task creation | Review Setup With AI Team | `ai-command`, mode `operations` or `strategist` |
| AI Command | All specialists | Central page | Durable inbound handoff is not applied in active render | Restore Incoming Handoff | Consume shared handoff and populate composer |
| Library | Writer, Media Director, SEO/Insights, Compliance | Good prompt buttons via quick input | Selected asset to specialist handoff | Review Selected Asset With AI Team | `ai-command` with selected asset context |
| Campaign Studio | Strategist, Writer, Ads Optimizer, Publisher | Strong via quick input and handoffs | Task Center handoff | Ask Strategist To Refine Campaign | `ai-command`, mode `strategist` |
| Content Studio | Writer, SEO/Insights Analyst, Compliance, Publisher | Visual handoff exists but bridge is weak | Reliable central AI composer population | Review Draft With Content Writer | `ai-command`, mode `writer`, prompt populated |
| Media Studio | Media Director, Video Lead, Compliance, Publisher | Visual handoff exists but bridge is weak | Reliable AI composer population | Review Brief With Media Director | `ai-command`, mode `media` or `video_lead` |
| Publishing | Publisher, Compliance, Operations Lead | Visual handoff exists but bridge is weak | Reliable AI composer population and queue monitor handoff | Review Publishing Plan With AI Team | `ai-command`, mode `publisher`; then Queue/Job Monitor |
| Workflows | Operations Lead, Full Team, Analyst | Good in active surface via quick input | `researcher` mode mismatch | Review Workflow With Operations Lead | `ai-command`, mode `operations` or valid specialist |
| Task Center | Operations Lead | Good prompt buttons; open-only button lacks context | Selected task context for generic AI open | Unblock Selected Task With AI Team | `ai-command`, selected task prompt |
| Queue Center | Operations Lead | Good prompt buttons; open-only button lacks context | Selected queue context | Triage Queue With AI Team | `ai-command`, selected queue prompt |
| Job Monitor | Operations Lead | Good prompt buttons; open-only button lacks context | Selected job/failure context | Diagnose Job With AI Team | `ai-command`, selected job prompt |
| Notification Center | Operations Lead, Compliance | Good prompt buttons; open-only button lacks context | Selected alert context | Review Alert With AI Team | `ai-command`, selected notification prompt |
| Integrations | Operations Lead, provider specialist, Sales/CRM Lead for CRM/email | Partial diagnostics prompts | Connector-specific repair handoff | Ask Operations Lead To Repair Connector | `ai-command`, then Workflows/Task Center |
| Settings | Operations Lead, System Setup Assistant | Partial prompt buttons | Settings summary on generic AI open | Review System Settings With AI Team | `ai-command`, settings summary prompt |
| Governance | Compliance Reviewer, Operations Lead | Partial prompt buttons; open-only lacks context | Selected governance item context | Review Decision With Compliance | `ai-command`, selected item prompt |
| Insights | SEO/Insights Analyst, Strategist, Ads Optimizer | Good prompt buttons and durable handoff | Generic Analyst action and workflow route | Ask Analyst For Next Move | `ai-command`, mode `analyst` |
| Research | SEO/Insights Analyst or Researcher | Good prompt buttons and route handoffs | Specialist naming consistency | Ask Analyst To Turn Research Into Plan | `ai-command`, mode `analyst` |
| Ads Manager | Ads Optimizer, Strategist, Publisher | Basic quick prompts | Durable ad plan and creative/content handoffs | Ask Ads Optimizer To Build Test Plan | `ai-command`, mode `ads` |
| Operations Centers Composite | Operations Lead, Customer Ops Lead | Missing route | Valid destination for operations overview | Open Operations Command | `task-center` or new registered overview |
| Customer Operations | Customer Operations Lead, Sales/CRM Lead, Operations Lead | Present in AI Command, page missing | Read-only page or task handoff | Draft Customer Reply With AI Team | `ai-command` draft/review only, then Task Center |

## Required Standard

Every operational page should use one consistent pattern:

1. Build a prompt.
2. Set `quickCommandInput` or persist a durable handoff that AI Command actually consumes.
3. Set the intended specialist mode to a real AI Command specialist ID.
4. Navigate to `ai-command`.
5. Show a message that the context is review-only unless execution happens on the destination page.

## Specialist ID Gaps

Current issue:

- Workflows uses `aiModeId: "researcher"`.
- AI Command maps `research` to `researcher`.
- AI Command does not define a `researcher` specialist.

Recommended choice:

- Either map research/researcher to `analyst`, or add a real Research Specialist to AI Command and route it to `research`.


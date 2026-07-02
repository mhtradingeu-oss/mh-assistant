# Page To Page Workflow Map

## Intended Operating Flow

`Home / Setup -> choose work area -> inspect status -> ask AI Team or use page tools -> produce draft/task/workflow/handoff/output -> route to correct page -> monitor progress`

Current state: Mostly possible, with two major blockers:

1. `operations-centers` is not a registered route.
2. Several "send to AI" paths do not reliably populate AI Command because they rely on shared handoff records without active consumption by AI Command render.

## Route Map

| Flow | Current state | Notes |
|---|---|---|
| Setup -> Home | Works | Save/setup can return to dashboard through shell navigation. |
| Home -> AI Team | Works | Uses `quickCommandInput` for prompt-based handoff. |
| Home -> Workflows | Works through navigation/search/global nav | Direct quick card not always first-class. |
| Home -> Task Center | Indirect / needs stronger route | Home "Operations" currently targets missing `operations-centers`. |
| Home -> Operations Centers | Broken | `operations-centers` is not registered. |
| AI Team -> Content Studio | Works | Destination route exists. |
| AI Team -> Campaign Studio | Works | Destination route exists. |
| AI Team -> Publishing | Works | Destination route exists. |
| AI Team -> Workflows | Works | Destination route exists. |
| AI Team -> Task Center | Works | Destination route exists. |
| AI Team -> Media Studio | Works | Destination route exists. |
| AI Team -> Governance | Works | Destination route exists. |
| AI Team -> Customer Ops | Blocked / planned | Customer Ops non-task routes can target missing `operations-centers`; no Customer Ops page registered. |
| Library -> Content Studio | Partial | Asset context should be more explicit. |
| Library -> Media Studio | Partial | Asset context should be more explicit. |
| Library -> AI Team | Works via quick input | Selected asset context could be richer. |
| Campaign Studio -> Content Studio | Works | Handoff present. |
| Campaign Studio -> Media Studio | Works | Handoff present. |
| Campaign Studio -> Publishing | Works | Handoff present. |
| Content Studio -> Publishing | Works | Handoff present. |
| Content Studio -> Compliance | Partial | Governance/Compliance route should be first-class. |
| Content Studio -> AI Team | Weak | Visual action can arrive empty in AI Command. |
| Media Studio -> Publishing | Works | Handoff present. |
| Media Studio -> Library | Works for asset save/shared library context | Needs clearer route button for selected output. |
| Media Studio -> AI Team | Weak | Visual action can arrive empty in AI Command. |
| Publishing -> Queue Center | Missing / should be added | Queue exists but primary route not obvious. |
| Publishing -> Job Monitor | Missing / should be added | Monitor route exists but not prominent. |
| Publishing -> Notifications | Missing / should be added | Notification route exists but not prominent. |
| Workflows -> Task Center | Works | Current active surface routes to Task Center. |
| Workflows -> Job Monitor | Partial | Old execution loop has monitor semantics; active simplified surface does not foreground it. |
| Integrations -> Customer Ops | Planned / missing | CRM/email providers imply customer operations, but no page is registered. |
| Integrations -> Media | Indirect | Provider-specific effects are visible, but routing should be explicit where relevant. |
| Integrations -> Publishing | Indirect | Publishing depends on providers, but not a clear route. |
| Integrations -> AI Team | Partial | Diagnostics prompts exist; specialist handoff should be stronger. |
| Governance -> Settings | Partial | Settings can route to Governance; reverse route is not primary. |
| Governance -> Task Center | Missing | Governance decisions often need follow-up tasks. |
| Insights -> Campaign Studio | Works | Route button exists. |
| Insights -> Content Studio | Works | Route button exists. |
| Insights -> Ads Manager | Works | Route button exists. |
| Insights -> Publishing | Works | Route button exists. |
| Insights -> Workflows | Missing / recommended | Optimization workflows should be direct. |
| Research -> Campaign Studio | Works | Handoff present. |
| Research -> Content Studio | Works | Handoff present. |
| Research -> Workflows | Works | SEO Workflow route exists. |
| Research -> Ads Manager | Works | Handoff present. |
| Research -> AI Team | Works | Sets quick input and handoff. |
| Ads Manager -> Publishing | Works | Simple route button. |
| Ads Manager -> Library | Works | Simple route button. |
| Ads Manager -> Campaign Studio | Missing | Needed for strategy feedback loop. |
| Ads Manager -> Content/Media | Missing | Needed for ad creative requests. |

## Flow Blockers

P0:
- Register or replace `operations-centers`.
- Fix Library pagination runtime hazard.

P1:
- Standardize AI Team handoff bridge.
- Add confirmation to Governance approval decisions.
- Clarify/durably wire Ads Manager.

P2:
- Add page-specific "Monitor" routes from Publishing and Workflows.
- Add Task Center follow-up routes from Setup/Governance/Research.


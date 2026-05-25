# AI Command Pass 4C Browser QA Checklist

## Purpose

Final browser QA for AI Command as a professional AI Team operating surface.

## Baseline

This QA follows:

- AI Command Pass 4B closeout.
- Output Workspace readability.
- Specialist typing indicator.
- Chat composer clarity.
- AI Command to Task Center review-only route.
- Task Center incoming handoff visibility.

## Browser QA checklist

### A. First impression / empty state

- [ ] AI Command opens with no console errors.
- [ ] Selected specialist is clear.
- [ ] The user understands where to type.
- [ ] Empty conversation state is understandable.
- [ ] Output Workspace clearly shows that no preview exists yet.
- [ ] Tools are visible but do not feel like automatic execution.

### B. Solo Specialist mode

- [ ] Solo Specialist mode loads.
- [ ] Strategist can be selected.
- [ ] Content Writer can be selected.
- [ ] Media Director can be selected.
- [ ] Video Lead can be selected.
- [ ] Publisher can be selected.
- [ ] Ads Optimizer can be selected.
- [ ] SEO & Insights Analyst can be selected.
- [ ] Compliance Reviewer can be selected.
- [ ] Operations Lead can be selected.
- [ ] Header, role summary, composer title, and tools update per specialist.

### C. Chat composer

- [ ] Textarea is easy to see and read.
- [ ] Placeholder is understandable.
- [ ] Enter sends message.
- [ ] Shift+Enter adds newline.
- [ ] Empty message shows a safe status and does not send.
- [ ] Draft auto-save remains working.
- [ ] Primary send button is visually clear.
- [ ] Secondary controls do not compete with send.

### D. Typing / working indicator

- [ ] Sending a message shows a visible specialist working indicator.
- [ ] Indicator uses selected specialist name.
- [ ] Indicator disappears after the response arrives.
- [ ] Error case removes indicator and shows safe error message.

### E. Output Workspace

- [ ] Output Workspace does not show `Chat reply` as visible result title.
- [ ] Output Workspace does not duplicate the raw chat response.
- [ ] Main output is structured and readable.
- [ ] Next steps are visible.
- [ ] Safety / confirmation messaging is visible.
- [ ] Output tabs remain clickable.
- [ ] No backend execution happens from preview display.

### F. Actions / buttons

- [ ] Create Preview works.
- [ ] Route works.
- [ ] Follow Up works.
- [ ] Copy works.
- [ ] Use in Composer works.
- [ ] Clear works.
- [ ] Canonical tool cards are clickable.
- [ ] Tool card selection updates composer or context safely.
- [ ] Disabled actions remain safely disabled.

### G. Routing safety

- [ ] Operations task/handoff output routes to Task Center.
- [ ] Task Center opens.
- [ ] Incoming Handoff card appears.
- [ ] Source shows AI Command.
- [ ] Destination shows Task Center.
- [ ] Status shows review-only intake.
- [ ] Task counters remain unchanged.
- [ ] No durable task is created automatically.
- [ ] Workflow-like output routes to Workflows where applicable.

### H. Full Team mode

- [ ] Full Team mode opens.
- [ ] Team state is understandable.
- [ ] Team response works or fails safely.
- [ ] Team typing indicator appears.
- [ ] Output Workspace remains understandable.
- [ ] Team routing remains safe.

### I. Accessibility / responsiveness

- [ ] Keyboard focus is visible on main buttons.
- [ ] Buttons have readable labels.
- [ ] Typing indicator uses status semantics.
- [ ] Page is usable on the current desktop viewport.
- [ ] Page remains usable at narrower widths.
- [ ] No horizontal overflow in normal viewport.
- [ ] No console ReferenceError.
- [ ] No console SyntaxError.
- [ ] No missing handler errors.

## Acceptance

AI Command Pass 4C can be accepted only if:

- Chat, output, tools, and routing all work.
- The user can understand the page without training.
- No backend mutation occurs automatically.
- No console errors appear during normal QA.
- Task Center handoff remains review-only.

## If issues are found

Allowed fixes:

- Small CSS-only clarity patch.
- Small text/label patch.
- Small handler fix for confirmed broken button.

Not allowed in this pass:

- Large CSS rewrite.
- New backend execution.
- Durable task creation.
- Publishing execution.
- CRM mutation.
- Workflow automation execution.

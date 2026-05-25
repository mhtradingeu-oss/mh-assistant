# AI Team Routing Contract Alignment Patch

## Summary

This patch aligns AI Command response routing with the AI Team Vision and Routing Contract.

## What changed

Only `resolveAiResponseOutputRoute(...)` was updated.

The resolver now classifies output by detected intent:

- task-like -> Task Center
- workflow/process-like -> Workflows
- content-like -> Content Studio
- media-like -> Media Studio
- publishing-like -> Publishing
- governance/risk-like -> Governance
- insight/research-like -> Insights
- campaign-like -> Campaign Studio or Workflows

## Full Team behavior

Full Team no longer has to behave as if every non-task output belongs to Workflows.

Instead, output text and output type are inspected first.

Campaign-level Full Team output still defaults to Workflows when it looks like an operating plan, but content/media/publishing/governance/insight outputs can route to their owning surfaces.

## Safety

No backend changes.

No durable task creation.

No workflow execution.

No publishing execution.

No CRM/customer mutation.

No governance approval execution.

The route still prepares review-only shared handoff context.

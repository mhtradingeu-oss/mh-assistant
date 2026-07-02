# AI Team Tools / Drawer Grouping Audit

## Purpose

Audit the current AI Command tools and drawer system against the AI Team Vision and Routing Contract.

## Contract target

Tools should not appear as a flat confusing list.

Tools should be grouped as:

1. Recommended next action
2. Primary tools
3. Secondary tools
4. Needs source tools
5. Advanced tools

## What this audit checks

### 1. Tool inventory

Confirm which canonical tools exist and which specialist/page owns them.

### 2. Tool ownership

Confirm each tool has a clear owner, destination, output type, and source requirement.

### 3. Source requirement UX

Confirm whether source-required tools are blocked safely and whether the user understands what is missing.

### 4. Output workspace UX

Confirm whether tools in the right panel explain:

- what the tool does
- whether it prepares only
- where it routes
- whether it needs source
- what the recommended next action is

### 5. Duplication risk

Confirm whether similar tool concepts are duplicated under different names or whether they are intentionally distinct.

## Desired outcome

Create a clear findings document before implementation.

No code changes should be made during this audit.

## Safety

No backend execution.
No route execution.
No task creation.
No workflow execution.
No publishing.
No CRM/customer mutation.
No governance approval execution.

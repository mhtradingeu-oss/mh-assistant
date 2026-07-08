# Phase 1A — Canonical AI Team Operating Contract Proposal

## Recommended goal

Create one source of truth for the AI Team operating model before changing page behavior.

## Proposed canonical role IDs

- operations
- strategist
- writer
- media_director
- video_lead
- publisher
- ads_operator
- analyst
- researcher
- compliance_reviewer
- customer_ops
- sales_crm

## Required aliases

- admin -> operations
- operations_lead -> operations
- executive -> operations
- copywriter -> writer
- content_writer -> writer
- content -> writer
- designer -> media_director
- media -> media_director or video_lead depending request
- ads -> ads_operator
- customer_operations -> customer_ops
- support -> customer_ops
- seo -> analyst
- seo_insights_analyst -> analyst
- insights -> analyst
- crm -> sales_crm or customer_ops depending request

## Request types

- general_question
- guidance_request
- single_task
- project_setup
- campaign_project
- content_request
- media_request
- publishing_request
- ads_request
- customer_request
- workflow_request
- task_request
- governance_request
- execution_request

## Output types

- answer_only
- guidance
- draft
- task_preview
- workflow_preview
- handoff
- approval_request
- execution_review

## Authority levels

- review_only
- draft_only
- handoff_only
- approval_required
- owner_workspace_required
- manual_execution_only
- auto_mode_later
- forbidden_from_ai_command

## Operating rule

AI Command prepares, explains, drafts, and routes.
Owning workspaces execute.
Governance reviews risk.
User confirmation is required for sensitive actions.

## Recommended implementation strategy

1. Create contract file.
2. Create validation script.
3. Keep existing pages unchanged.
4. Later integrate Home first.
5. Then integrate AI Command aliases.
6. Then route-role-fallback.
7. Then page owner matrix.

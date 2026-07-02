# B2.3D Business Templates Plan

## Goal
Make real project creation adapt to business type instead of creating only a generic project shell.

## Supported templates v1
- ecommerce
- artist_singer
- beauty_salon
- real_estate
- service_business
- restaurant
- agency
- local_business

## Template payload
Each new project receives:
- business_template.id
- business_template.label
- default_channels
- required_assets
- data_requirements
- content_categories
- workspace_priorities
- ai_team_defaults
- starter_checklist
- recommended_integrations

## Rule
No migration for existing projects in this step.
Only new projects receive templates during createProject().

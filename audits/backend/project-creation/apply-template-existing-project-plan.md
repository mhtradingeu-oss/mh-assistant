# B2.3E Apply Template to Existing Project

## Goal
Allow an existing project to receive or update its business template without recreating the project.

## Use case
Projects created before B2.3D, such as nadeem-nour, may have project_type but no business_template payload.

## Endpoint
POST /media-manager/project/:project/apply-template
POST /public/media-manager/project/:project/apply-template

## Payload
{
  "project_type": "artist_singer"
}

## Behavior
- Resolve project safely
- Read project.json
- Apply getBusinessProjectTemplate(project_type)
- Update business_type, business_template, default_channels, required_assets, data_requirements, content_categories, workspace_priorities, ai_team_defaults, starter_checklist, recommended_integrations
- Update updated_at
- Persist project.json
- Return updated project

## Rules
- No project creation
- No folder rename
- No migration for all projects
- Protected write route

# B2.4 Project Rename / Slug Correction Tool

## Goal
Allow safe correction of project slugs/names after creation.

## Use case
A project may be created with a typo in the slug, such as:
- beauty-off-sprit

The system needs a safe way to rename it to:
- beauty-of-spirit

## Endpoint
POST /media-manager/project/:project/rename
POST /public/media-manager/project/:project/rename

## Payload
{
  "project_name": "Beauty of Spirit"
}

## Behavior
- Normalize old and new slug
- Validate old project exists
- Validate target project does not exist
- Rename data/projects/<old> to data/projects/<new>
- Update project.json project_name
- Update registry.json entry
- Preserve business_template and all project data
- Return updated project and projects list

## Rules
- No destructive overwrite
- No merge
- No rename if target exists
- Protected write route
- No broad search/replace in unrelated files in v1

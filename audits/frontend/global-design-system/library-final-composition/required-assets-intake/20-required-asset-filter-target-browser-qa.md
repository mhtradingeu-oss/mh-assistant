# LIB-FINAL-4H — Required Asset Filter + Target Browser QA

## Status
Accepted.

## Runtime URL
`http://127.0.0.1:3000/control-center/#library`

## Verified Behavior

### Review CTA
- Product Images → Review moves the operator to Asset Workspace.
- Review clears stale search/source/status filters that could hide matching assets.
- Review uses folder context with `selectedType = all`.
- Product Images folder includes `product_photos` and `packaging_images`.
- Asset Workspace receives temporary visual highlight.
- Operator can select a file and use the right-side action panel.

### Classify CTA
- Classify moves the operator to Asset Intake.
- Classify prepares the matching upload type.
- Asset Intake / Drop Zone receives temporary visual highlight.

### Copy / Labels
- Required Asset Evidence cards use `Files found` instead of `Detected`.
- Upload session empty state is clearer.

## Safety Confirmation
- Backend unchanged.
- API unchanged.
- Router unchanged.
- Upload behavior unchanged.
- Preview behavior unchanged.
- Protected media behavior unchanged.
- Required asset button contracts preserved.
- Asset grid behavior preserved.
- Action panel behavior preserved.
- Mutation behavior unchanged.
- No Move to folder feature was added.

## Decision
LIB-FINAL-4H is accepted.

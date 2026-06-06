# LIB-FINAL-4E — Required Asset CTA Target Fix

## Status
Implemented pending browser QA.

## Purpose
Make Required Asset Evidence buttons send the operator to the correct work area.

## Behavior
- `Review` routes the operator to Asset Workspace.
- `Classify` / upload-oriented actions route the operator to Asset Intake.
- Upload type is still prepared automatically.
- Matching folder/type is still applied.
- Workspace is still rebound when a matching folder exists.
- The target area receives a temporary visual highlight.
- Card count label changed from `Detected` to `Files found`.

## Safety
- Backend unchanged.
- API unchanged.
- Router unchanged.
- Upload behavior unchanged.
- Preview behavior unchanged.
- Mutations unchanged.
- Action panel unchanged.
- No Move to folder feature was added.

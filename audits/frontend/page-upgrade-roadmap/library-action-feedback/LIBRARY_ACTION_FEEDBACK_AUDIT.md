# Library Action Feedback Audit

## Status
Audit-only checkpoint.

## Purpose
Identify where Library actions need clearer user feedback, safer preview behavior, and smarter routing support.

## Questions to answer
- Which buttons currently have visible feedback?
- Which buttons are silent?
- Which actions mutate data?
- Which actions are safe routing/prompt actions?
- Which actions should show inline messages?
- Which actions should show selected asset preview immediately?
- Which quick actions can route safely to AI Command, Media Studio, Campaign Studio, Publishing, Governance, or Workflows?

## Candidate improvements
- Action feedback banner / toast.
- Clear preview confirmation.
- Classify prepared message.
- Review prepared message.
- Extract docs prepared message.
- Smart next-step routing prompts.
- Selected asset context confirmation.
- Disabled/action-required explanations.

## Non-goals
- No backend changes.
- No API changes.
- No data changes.
- No mutation handler rewrite.
- No auto execution.
- No bulk actions.

## Evidence
See:
- LIBRARY_ACTION_FEEDBACK_EVIDENCE.txt

## Next step
Create implementation plan for read-only/safe feedback improvements.

# Implementation Guards

Before any future code patch:

1. Scan exact files first.
2. Identify exact owner page.
3. Identify exact backend route authority.
4. Prove no duplicate rendering path.
5. Prove no legacy surface will be broken.
6. Patch one small scope only.
7. Avoid blind sed/block edits.
8. Use syntax checks.
9. Use architecture guard.
10. Check git diff before commit.
11. Commit only after validation.
12. Push only after clean final status.

Hard rule:
Do not mix UX cleanup with backend execution changes.

Hard rule:
Do not add live execution from AI Command.

Hard rule:
Do not remove legacy aliases until all call sites are proven migrated.

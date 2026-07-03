# PHASE 13B.1 - Public Mutation Alias Deprecation Headers / Warning Telemetry Patch

Date: 20260703-150145

Mode:
- TINY PATCH
- Backend compatibility/security only
- No frontend change
- No AI Command change
- No canonical route change
- No route removal
- No alias blocking
- No provider behavior change
- No publishing behavior change
- No integration behavior change
- No write-key semantic change

Goal:
Make legacy /public/media-manager/... mutation alias usage visible and explicitly deprecated without breaking compatibility.

Allowed:
- Add deprecation headers for public mutation alias requests.
- Add server-side warning telemetry for public mutation alias requests.
- Keep public aliases functional.
- Keep canonical /media-manager/... routes untouched.

Not allowed:
- Do not delete routes.
- Do not block public aliases.
- Do not alter canonical routes.
- Do not alter frontend callers.
- Do not alter AI Command.
- Do not alter execution behavior.

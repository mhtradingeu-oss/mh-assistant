
Phase 13E.1 — Future Retirement Gate
Status

PLAN ONLY

No retirement is authorized until Phase 13H proves zero-hit.

Required before Phase 13E.1
Phase 13G locked
Phase 13H locked as PASS
selected alias list approved
rollback plan ready
canonical equivalents verified
syntax checks passing
route inventory before patch captured
First future patch candidates

Only after Phase 13H PASS:

/public/media-manager/project/:project/approvals/:approvalId/decision
/public/media-manager/project/:project/governance/policy
Required future behavior

For selected retired aliases, return:

{
  "ok": false,
  "error": "public_alias_retired",
  "canonicalRequired": true,
  "canonicalPrefix": "/media-manager"
}

Prefer HTTP status:

410 Gone
Not allowed in first future retirement patch
no broad wildcard blocking
no canonical route changes
no frontend changes unless caller is found
no AI Command changes
no provider execution changes
no publishing canonical behavior change
no integration canonical behavior change
no retirement of all aliases at once

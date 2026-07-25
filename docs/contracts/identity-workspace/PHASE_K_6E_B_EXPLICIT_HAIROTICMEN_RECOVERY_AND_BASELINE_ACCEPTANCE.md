# PHASE K-6E-B — Explicit HairoticMen Recovery and Operational Baseline Acceptance

## Status

```text
PHASE_K_6E_B_COMPLETE=YES
OWNER_DECISION_APPLIED=YES
PRODUCTION_WRITER_QUIESCED=YES
EXTERNAL_EVIDENCE_CAPTURED=YES
```

## 1. Purpose

K-6E-B performed a narrowly scoped recovery following the K-6E-A forensic
audit.

The phase restored only the production telemetry file for which an exact
pre-incident byte baseline was available.

The remaining six generated operational files were not reconstructed,
deleted, normalized, regenerated, or copied from rotating backup files.
Their current contents were explicitly accepted by the owner as the new
operational baseline.

## 2. Quiesced production writer

The identified process was:

```text
PID=78305
PPID=76377
COMMAND=node server.js
WORKING_DIRECTORY=runtime/orchestrator-service
LISTENING_PORT=3000
SUPERVISOR=NONE
START_SOURCE=interactive zsh
```

The process was stopped using a targeted SIGTERM.

Post-stop verification proved:

```text
PID_78305_RUNNING=NO
PORT_3000_LISTENING=NO
AUTOMATIC_RESTART_DETECTED=NO
```

The production server remained stopped throughout recovery, observation,
and final repository verification.

## 3. External evidence

Evidence was preserved outside the repository at:

```text
/var/folders/d6/1zt10rjj7v50sxyl9mq81fnm0000gp/T//mh-k6e-b-20260724T101725Z
```

The evidence directory contains:

- original copies of all seven affected files;
- a source/evidence hash manifest;
- pre- and post-observation state manifests;
- the six-file operational-baseline manifest;
- the seven-path inventory.

The copied evidence was verified byte-for-byte against its source before
recovery.

## 4. Telemetry recovery precondition

Recovered path:

```text
data/execution/projects/hairoticmen/telemetry/read-redirection-log.jsonl
```

Pre-recovery incident state:

```text
SHA256=0b821b5b3acfa2a6e4fa2f1af7677a30d3324963739992b9407b4ad27bbdb4a8
BYTES=935572
LINES=968
```

The incident consisted of four appended JSONL records at lines 965–968.

A candidate containing the first 964 lines was built outside the
production file and independently verified as:

```text
SHA256=70661efca875c5804111e2c57fbd6f0674180a65d58decf7ac5cdbca61614b08
BYTES=931706
LINES=964
```

## 5. Byte-exact telemetry restoration

The verified candidate was copied to a same-directory temporary file,
revalidated, and installed using a narrow atomic replacement.

Final certified telemetry state:

```text
SHA256=70661efca875c5804111e2c57fbd6f0674180a65d58decf7ac5cdbca61614b08
BYTES=931706
LINES=964
```

No other production file was intentionally modified by the recovery.

## 6. Six accepted operational baselines

These files were not restored and are not claimed to represent their
pre-incident contents.

They are explicitly classified as:

```text
ACCEPTED_CURRENT_OPERATIONAL_BASELINE
```

| Path | SHA-256 | Bytes | Lines | Decision |
|---|---|---:|---:|---|
| `data/projects/hairoticmen/integrations-registry.json` | `da53ba8b5a7633de377d176edb71b1e3b385c79f6a5db4507991e65fd3b6269f` | 2572 | 87 | `ACCEPTED_CURRENT_OPERATIONAL_BASELINE` |
| `data/projects/hairoticmen/integrations-registry.json.backup` | `da53ba8b5a7633de377d176edb71b1e3b385c79f6a5db4507991e65fd3b6269f` | 2572 | 87 | `ACCEPTED_CURRENT_OPERATIONAL_BASELINE` |
| `data/projects/hairoticmen/ops/data-mismatches.json` | `58cd3f5d7bfacd31506785eb7393c2d72713bbf0b286b7743385f51ae8647c6a` | 121002 | 2001 | `ACCEPTED_CURRENT_OPERATIONAL_BASELINE` |
| `data/projects/hairoticmen/ops/data-mismatches.json.backup` | `a417b01f20951bd83c209654bca65e804c4328a6de3f72e5ab6588a19a526310` | 121002 | 2001 | `ACCEPTED_CURRENT_OPERATIONAL_BASELINE` |
| `data/projects/hairoticmen/reports/canonical-migration-report.json` | `ac7942faa2886b1e840b19535c3d354eaea8b107c239a811ff3ef2a15aa9eca3` | 1648 | 36 | `ACCEPTED_CURRENT_OPERATIONAL_BASELINE` |
| `data/projects/hairoticmen/reports/canonical-migration-report.json.backup` | `213b405e348b76afd80172802352444a9971bbfe6e14d0f1777b2b6c28653641` | 1648 | 36 | `ACCEPTED_CURRENT_OPERATIONAL_BASELINE` |

The rotating `.backup` files were not treated as pre-incident snapshots.

## 7. Stability observation

Following recovery, all seven paths were observed while the server remained
stopped.

The observation proved:

```text
SEVEN_PATHS_STABLE=YES
TELEMETRY_BASELINE_STABLE=YES
SIX_OPERATIONAL_BASELINES_STABLE=YES
ADDITIONAL_WRITER_DETECTED=NO
SERVER_RESTARTED=NO
```

Hashes, byte sizes, line counts, and mtimes remained unchanged during the
observation interval.

## 8. Repository and storage safety

Final values:

```text
DATA_TREE_SHA256=801ca6a0395a9d3421d3bf23dbea2c2949a386d77b74e3bedb601f789deda188
HAIROTICMEN_TREE_SHA256=eafb97cc62e8ad42919a0fb39924c708e34633883c7b2be0e04422807342136e
MH_AUDIT_TREE_SHA256=c88bcb0a887676ee3491b064603250b130cd6a6d501aeae4b2f8f721f5b4137c
TRACKED_DIFF_SHA256=9b73a93f25b3301390e21e6f5b10801b223bd8722c5c55977bec7f178d9be75f
```

Final safety state:

```text
WORKSPACE_STORAGE_CREATED=NO
GOVERNANCE_PARTITION_CREATED=NO
OTHER_SIX_FILES_MODIFIED=NO
STAGED_FILES=NONE
COMMIT=NO
PUSH=NO
```

Existing unrelated tracked and untracked work was preserved.

No broad cleanup, reset, restore, checkout, stash, or deletion was used.

## 9. Remaining defects

K-6E-B does not remediate the runtime defects that caused the incident.

The following remain open:

1. Nominally read-only startup, readiness, insights, and learning GET paths
   can write telemetry and generated project state.
2. `verify:read-only` can read the real HairoticMen production root rather
   than an injected temporary data root.
3. The production server must remain stopped until the next phase determines
   and validates the safe read-side-effect boundary.

## 10. Certification status

```text
PHASE_K_6E_B_COMPLETE=YES

OWNER_DECISION_APPLIED=YES
PRODUCTION_WRITER_QUIESCED=YES
EXTERNAL_EVIDENCE_CAPTURED=YES

TELEMETRY_PRECONDITION_MATCHED=YES
TELEMETRY_BASELINE_RESTORED=YES
TELEMETRY_RESTORED_LINES=964
TELEMETRY_RESTORED_SIZE=931706
TELEMETRY_RESTORED_SHA256=70661efca875c5804111e2c57fbd6f0674180a65d58decf7ac5cdbca61614b08

OTHER_SIX_FILES_MODIFIED=NO
OTHER_SIX_BASELINE_DECISION=ACCEPT_CURRENT_OPERATIONAL_BASELINE
ALL_ACCEPTED_BASELINE_HASHES_RECORDED=YES

READ_SIDE_EFFECT_DEFECT_REMEDIATED=NO
VERIFY_READ_ONLY_ISOLATED=NO
K6D_COMPLETE=NO
K6A_R2_CERTIFIED=NO
READY_FOR_REAL_APPROVAL=NO

APPROVAL_CREATED=NO
APPROVAL_DECIDED=NO
K5C_APPLY_EXECUTED=NO
WORKSPACE_CREATED=NO
GOVERNANCE_PARTITION_CREATED=NO

STAGED_FILES=NONE
COMMIT=NO
PUSH=NO

NEXT_GATE=PHASE_K_6F_READ_SIDE_EFFECT_AND_TEST_ISOLATION_REMEDIATION
```

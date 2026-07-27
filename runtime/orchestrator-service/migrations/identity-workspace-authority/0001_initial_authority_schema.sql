BEGIN;

CREATE SCHEMA identity_workspace_authority;

CREATE TABLE identity_workspace_authority.schema_migrations (
  migration_id text PRIMARY KEY,
  checksum_sha256 text NOT NULL,
  applied_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  applied_by text NOT NULL,
  CONSTRAINT schema_migrations_id_nonempty
    CHECK (btrim(migration_id) <> ''),
  CONSTRAINT schema_migrations_checksum_format
    CHECK (checksum_sha256 ~ '^[a-f0-9]{64}$'),
  CONSTRAINT schema_migrations_applied_by_nonempty
    CHECK (btrim(applied_by) <> '')
);

CREATE TABLE identity_workspace_authority.workspaces (
  workspace_id text PRIMARY KEY,
  workspace_key text NOT NULL UNIQUE,
  display_name text,
  state text NOT NULL,
  version bigint NOT NULL,
  canonical boolean NOT NULL,
  source_name text NOT NULL,
  source_reference text NOT NULL,
  source_version text NOT NULL,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL,
  CONSTRAINT workspaces_id_nonempty
    CHECK (btrim(workspace_id) <> ''),
  CONSTRAINT workspaces_key_nonempty
    CHECK (btrim(workspace_key) <> ''),
  CONSTRAINT workspaces_key_normalized
    CHECK (workspace_key = lower(btrim(workspace_key))),
  CONSTRAINT workspaces_state_valid
    CHECK (
      state IN (
        'ACTIVE',
        'INACTIVE',
        'SUSPENDED',
        'REVOKED',
        'UNRESOLVED'
      )
    ),
  CONSTRAINT workspaces_version_positive
    CHECK (version > 0),
  CONSTRAINT workspaces_canonical_true
    CHECK (canonical = TRUE),
  CONSTRAINT workspaces_source_name_nonempty
    CHECK (btrim(source_name) <> ''),
  CONSTRAINT workspaces_source_reference_nonempty
    CHECK (btrim(source_reference) <> ''),
  CONSTRAINT workspaces_source_version_nonempty
    CHECK (btrim(source_version) <> ''),
  CONSTRAINT workspaces_timestamp_order
    CHECK (updated_at >= created_at),
  CONSTRAINT workspaces_source_reference_unique
    UNIQUE (source_name, source_reference)
);

CREATE TABLE identity_workspace_authority.project_workspace_bindings (
  project_id text PRIMARY KEY,
  workspace_id text NOT NULL,
  state text NOT NULL,
  version bigint NOT NULL,
  canonical boolean NOT NULL,
  source_name text NOT NULL,
  source_reference text NOT NULL,
  source_version text NOT NULL,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL,
  CONSTRAINT project_workspace_bindings_project_id_nonempty
    CHECK (btrim(project_id) <> ''),
  CONSTRAINT project_workspace_bindings_workspace_id_nonempty
    CHECK (btrim(workspace_id) <> ''),
  CONSTRAINT project_workspace_bindings_workspace_fk
    FOREIGN KEY (workspace_id)
    REFERENCES identity_workspace_authority.workspaces(workspace_id)
    ON UPDATE RESTRICT
    ON DELETE RESTRICT,
  CONSTRAINT project_workspace_bindings_state_valid
    CHECK (
      state IN (
        'ACTIVE',
        'INACTIVE',
        'SUSPENDED',
        'REVOKED',
        'UNRESOLVED'
      )
    ),
  CONSTRAINT project_workspace_bindings_version_positive
    CHECK (version > 0),
  CONSTRAINT project_workspace_bindings_canonical_true
    CHECK (canonical = TRUE),
  CONSTRAINT project_workspace_bindings_source_name_nonempty
    CHECK (btrim(source_name) <> ''),
  CONSTRAINT project_workspace_bindings_source_reference_nonempty
    CHECK (btrim(source_reference) <> ''),
  CONSTRAINT project_workspace_bindings_source_version_nonempty
    CHECK (btrim(source_version) <> ''),
  CONSTRAINT project_workspace_bindings_timestamp_order
    CHECK (updated_at >= created_at),
  CONSTRAINT project_workspace_bindings_scope_unique
    UNIQUE (workspace_id, project_id),
  CONSTRAINT project_workspace_bindings_source_unique
    UNIQUE (source_name, source_reference)
);

CREATE TABLE identity_workspace_authority.workspace_memberships (
  membership_id text PRIMARY KEY,
  principal_id text NOT NULL,
  workspace_id text NOT NULL,
  state text NOT NULL,
  version bigint NOT NULL,
  canonical boolean NOT NULL,
  source_name text NOT NULL,
  source_reference text NOT NULL,
  source_version text NOT NULL,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL,
  CONSTRAINT workspace_memberships_id_nonempty
    CHECK (btrim(membership_id) <> ''),
  CONSTRAINT workspace_memberships_principal_nonempty
    CHECK (btrim(principal_id) <> ''),
  CONSTRAINT workspace_memberships_workspace_id_nonempty
    CHECK (btrim(workspace_id) <> ''),
  CONSTRAINT workspace_memberships_workspace_fk
    FOREIGN KEY (workspace_id)
    REFERENCES identity_workspace_authority.workspaces(workspace_id)
    ON UPDATE RESTRICT
    ON DELETE RESTRICT,
  CONSTRAINT workspace_memberships_state_valid
    CHECK (
      state IN (
        'ACTIVE',
        'INACTIVE',
        'SUSPENDED',
        'REVOKED',
        'UNRESOLVED'
      )
    ),
  CONSTRAINT workspace_memberships_version_positive
    CHECK (version > 0),
  CONSTRAINT workspace_memberships_canonical_true
    CHECK (canonical = TRUE),
  CONSTRAINT workspace_memberships_source_name_nonempty
    CHECK (btrim(source_name) <> ''),
  CONSTRAINT workspace_memberships_source_reference_nonempty
    CHECK (btrim(source_reference) <> ''),
  CONSTRAINT workspace_memberships_source_version_nonempty
    CHECK (btrim(source_version) <> ''),
  CONSTRAINT workspace_memberships_timestamp_order
    CHECK (updated_at >= created_at),
  CONSTRAINT workspace_memberships_principal_scope_unique
    UNIQUE (principal_id, workspace_id, source_name),
  CONSTRAINT workspace_memberships_source_unique
    UNIQUE (source_name, source_reference)
);

CREATE TABLE identity_workspace_authority.project_memberships (
  membership_id text PRIMARY KEY,
  principal_id text NOT NULL,
  workspace_id text NOT NULL,
  project_id text NOT NULL,
  state text NOT NULL,
  version bigint NOT NULL,
  canonical boolean NOT NULL,
  source_name text NOT NULL,
  source_reference text NOT NULL,
  source_version text NOT NULL,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL,
  CONSTRAINT project_memberships_id_nonempty
    CHECK (btrim(membership_id) <> ''),
  CONSTRAINT project_memberships_principal_nonempty
    CHECK (btrim(principal_id) <> ''),
  CONSTRAINT project_memberships_workspace_id_nonempty
    CHECK (btrim(workspace_id) <> ''),
  CONSTRAINT project_memberships_project_id_nonempty
    CHECK (btrim(project_id) <> ''),
  CONSTRAINT project_memberships_project_workspace_fk
    FOREIGN KEY (workspace_id, project_id)
    REFERENCES identity_workspace_authority.project_workspace_bindings(
      workspace_id,
      project_id
    )
    ON UPDATE RESTRICT
    ON DELETE RESTRICT,
  CONSTRAINT project_memberships_state_valid
    CHECK (
      state IN (
        'ACTIVE',
        'INACTIVE',
        'SUSPENDED',
        'REVOKED',
        'UNRESOLVED'
      )
    ),
  CONSTRAINT project_memberships_version_positive
    CHECK (version > 0),
  CONSTRAINT project_memberships_canonical_true
    CHECK (canonical = TRUE),
  CONSTRAINT project_memberships_source_name_nonempty
    CHECK (btrim(source_name) <> ''),
  CONSTRAINT project_memberships_source_reference_nonempty
    CHECK (btrim(source_reference) <> ''),
  CONSTRAINT project_memberships_source_version_nonempty
    CHECK (btrim(source_version) <> ''),
  CONSTRAINT project_memberships_timestamp_order
    CHECK (updated_at >= created_at),
  CONSTRAINT project_memberships_principal_scope_unique
    UNIQUE (
      principal_id,
      workspace_id,
      project_id,
      source_name
    ),
  CONSTRAINT project_memberships_source_unique
    UNIQUE (source_name, source_reference)
);

CREATE TABLE identity_workspace_authority.membership_grants (
  grant_id text PRIMARY KEY,
  principal_id text NOT NULL,
  workspace_membership_id text,
  project_membership_id text,
  membership_scope_type text NOT NULL,
  scope_id text NOT NULL,
  grant_type text NOT NULL,
  role_key text,
  permission text,
  effect text NOT NULL,
  state text NOT NULL,
  version bigint NOT NULL,
  canonical boolean NOT NULL,
  source_name text NOT NULL,
  source_reference text NOT NULL,
  source_version text NOT NULL,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL,
  CONSTRAINT membership_grants_id_nonempty
    CHECK (btrim(grant_id) <> ''),
  CONSTRAINT membership_grants_principal_nonempty
    CHECK (btrim(principal_id) <> ''),
  CONSTRAINT membership_grants_scope_id_nonempty
    CHECK (btrim(scope_id) <> ''),
  CONSTRAINT membership_grants_workspace_membership_fk
    FOREIGN KEY (workspace_membership_id)
    REFERENCES identity_workspace_authority.workspace_memberships(
      membership_id
    )
    ON UPDATE RESTRICT
    ON DELETE RESTRICT,
  CONSTRAINT membership_grants_project_membership_fk
    FOREIGN KEY (project_membership_id)
    REFERENCES identity_workspace_authority.project_memberships(
      membership_id
    )
    ON UPDATE RESTRICT
    ON DELETE RESTRICT,
  CONSTRAINT membership_grants_one_membership_reference
    CHECK (
      (
        workspace_membership_id IS NOT NULL
        AND project_membership_id IS NULL
      )
      OR
      (
        workspace_membership_id IS NULL
        AND project_membership_id IS NOT NULL
      )
    ),
  CONSTRAINT membership_grants_scope_type_valid
    CHECK (membership_scope_type IN ('WORKSPACE', 'PROJECT')),
  CONSTRAINT membership_grants_type_valid
    CHECK (grant_type IN ('ROLE', 'PERMISSION')),
  CONSTRAINT membership_grants_role_permission_shape
    CHECK (
      (
        grant_type = 'ROLE'
        AND role_key IS NOT NULL
        AND btrim(role_key) <> ''
        AND permission IS NULL
      )
      OR
      (
        grant_type = 'PERMISSION'
        AND permission IS NOT NULL
        AND btrim(permission) <> ''
        AND role_key IS NULL
      )
    ),
  CONSTRAINT membership_grants_effect_valid
    CHECK (effect IN ('ALLOW', 'DENY')),
  CONSTRAINT membership_grants_state_valid
    CHECK (
      state IN (
        'ACTIVE',
        'INACTIVE',
        'SUSPENDED',
        'REVOKED',
        'UNRESOLVED'
      )
    ),
  CONSTRAINT membership_grants_version_positive
    CHECK (version > 0),
  CONSTRAINT membership_grants_canonical_true
    CHECK (canonical = TRUE),
  CONSTRAINT membership_grants_source_name_nonempty
    CHECK (btrim(source_name) <> ''),
  CONSTRAINT membership_grants_source_reference_nonempty
    CHECK (btrim(source_reference) <> ''),
  CONSTRAINT membership_grants_source_version_nonempty
    CHECK (btrim(source_version) <> ''),
  CONSTRAINT membership_grants_timestamp_order
    CHECK (updated_at >= created_at),
  CONSTRAINT membership_grants_source_unique
    UNIQUE (source_name, source_reference)
);

CREATE FUNCTION identity_workspace_authority.validate_membership_grant()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
  referenced_principal_id text;
  referenced_scope_id text;
BEGIN
  IF NEW.workspace_membership_id IS NOT NULL THEN
    IF NEW.membership_scope_type <> 'WORKSPACE' THEN
      RAISE EXCEPTION
        'workspace membership grant requires WORKSPACE scope';
    END IF;

    SELECT
      principal_id,
      workspace_id
    INTO
      referenced_principal_id,
      referenced_scope_id
    FROM identity_workspace_authority.workspace_memberships
    WHERE membership_id = NEW.workspace_membership_id;
  ELSE
    IF NEW.membership_scope_type <> 'PROJECT' THEN
      RAISE EXCEPTION
        'project membership grant requires PROJECT scope';
    END IF;

    SELECT
      principal_id,
      project_id
    INTO
      referenced_principal_id,
      referenced_scope_id
    FROM identity_workspace_authority.project_memberships
    WHERE membership_id = NEW.project_membership_id;
  END IF;

  IF referenced_principal_id IS NULL THEN
    RAISE EXCEPTION
      'referenced membership does not exist';
  END IF;

  IF NEW.principal_id <> referenced_principal_id THEN
    RAISE EXCEPTION
      'grant principal does not match membership principal';
  END IF;

  IF NEW.scope_id <> referenced_scope_id THEN
    RAISE EXCEPTION
      'grant scope does not match membership scope';
  END IF;

  RETURN NEW;
END;
$function$;

CREATE TRIGGER membership_grants_validate_reference
BEFORE INSERT OR UPDATE
ON identity_workspace_authority.membership_grants
FOR EACH ROW
EXECUTE FUNCTION identity_workspace_authority.validate_membership_grant();

CREATE INDEX workspace_memberships_lookup_idx
ON identity_workspace_authority.workspace_memberships (
  principal_id,
  workspace_id,
  state
);

CREATE INDEX project_memberships_lookup_idx
ON identity_workspace_authority.project_memberships (
  principal_id,
  workspace_id,
  project_id,
  state
);

CREATE INDEX membership_grants_workspace_lookup_idx
ON identity_workspace_authority.membership_grants (
  workspace_membership_id,
  principal_id,
  state,
  effect
)
WHERE workspace_membership_id IS NOT NULL;

CREATE INDEX membership_grants_project_lookup_idx
ON identity_workspace_authority.membership_grants (
  project_membership_id,
  principal_id,
  state,
  effect
)
WHERE project_membership_id IS NOT NULL;

COMMIT;

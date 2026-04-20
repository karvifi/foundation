-- @sso/db — Phase 3 migration: session + operation persistence
-- Creates the os schema (if missing) and the three Phase 3 tables:
--   os.workspace_sessions   (sessions alias)
--   os.context_bus_events   (session_events alias)
--   os.operation_records    (operations alias)
--
-- Idempotent: uses IF NOT EXISTS throughout. Apply with:
--   psql "$DATABASE_URL" -f packages/db/migrations/0001_phase3_sessions_operations.sql

BEGIN;

CREATE SCHEMA IF NOT EXISTS os;

-- ── Sessions ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS os.workspace_sessions (
  id           text PRIMARY KEY,
  workspace_id text NOT NULL,
  pattern_id   text NOT NULL,
  created_at   timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS os_workspace_sessions_workspace_idx
  ON os.workspace_sessions (workspace_id, created_at);

-- ── Session events (context bus) ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS os.context_bus_events (
  id               text PRIMARY KEY,
  workspace_id     text NOT NULL,
  session_id       text NOT NULL,
  source_engine_id text NOT NULL,
  event_type       text NOT NULL,
  payload          jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at       timestamp NOT NULL DEFAULT now(),
  CONSTRAINT context_bus_events_session_fk
    FOREIGN KEY (session_id) REFERENCES os.workspace_sessions (id)
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS os_context_bus_events_session_idx
  ON os.context_bus_events (session_id, created_at);

CREATE INDEX IF NOT EXISTS os_context_bus_events_workspace_idx
  ON os.context_bus_events (workspace_id, created_at);

-- ── Operation records ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS os.operation_records (
  id           text PRIMARY KEY,
  session_id   text NOT NULL,
  workspace_id text NOT NULL,
  engine_id    text NOT NULL,
  operation    text NOT NULL,
  input        jsonb DEFAULT '{}'::jsonb,
  output       jsonb DEFAULT '{}'::jsonb,
  status       text NOT NULL DEFAULT 'success',
  started_at   timestamp NOT NULL,
  finished_at  timestamp,
  duration_ms  integer,
  error        text,
  created_at   timestamp NOT NULL DEFAULT now(),
  CONSTRAINT operation_records_status_chk
    CHECK (status IN ('pending', 'executing', 'success', 'failed'))
);

CREATE INDEX IF NOT EXISTS os_operation_records_session_idx
  ON os.operation_records (session_id, created_at);

CREATE INDEX IF NOT EXISTS os_operation_records_workspace_idx
  ON os.operation_records (workspace_id, created_at);

CREATE INDEX IF NOT EXISTS os_operation_records_engine_idx
  ON os.operation_records (engine_id, created_at);

COMMIT;

-- ── Down migration ────────────────────────────────────────────────────────
-- To roll back:
--   DROP TABLE IF EXISTS os.operation_records;
--   DROP TABLE IF EXISTS os.context_bus_events;
--   DROP TABLE IF EXISTS os.workspace_sessions;
